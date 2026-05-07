import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase-rest";
import type { Platform, RiskLevel, TrendType } from "@/lib/trends";

type SourceRow = {
  source_id: string;
  platform: Platform;
  name: string;
  enabled: boolean;
  sort_order: number;
};

type TrendRow = {
  id: string;
  slug: string;
};

type SnapshotRow = {
  trend_id: string;
  heat_score: number | string | null;
};

type CollectionJobRow = {
  id: string;
};

type CollectedTrend = {
  sourceId: string;
  platform: Platform;
  title: string;
  sourceTitle: string;
  sourceUrl: string;
  rank: number;
  heat: number;
  rawPayload: Record<string, unknown>;
};

type CollectionResult = {
  sourceId: string;
  platform: Platform;
  status: "success" | "skipped" | "failed";
  rawCount: number;
  savedCount: number;
  error?: string;
};

type CollectorAdapter = (source: SourceRow) => Promise<CollectedTrend[]>;

const requestHeaders = {
  accept: "application/json,text/html;q=0.9,*/*;q=0.8",
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.5",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

const adapters: Partial<Record<string, CollectorAdapter>> = {
  "douyin-hot": collectDouyinHot,
  "weibo-hot": collectWeiboHot,
  "bilibili-ranking": collectBilibiliPopular,
  "baidu-index": collectBaiduHot,
};

export async function runTrendCollection() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  const sources = await supabaseRest<SourceRow[]>(
    "collection_sources?select=*&enabled=eq.true&order=sort_order.asc",
  );

  const results: CollectionResult[] = [];

  for (const source of sources) {
    const startedAt = new Date().toISOString();
    const [job] = await supabaseRest<CollectionJobRow[]>("collection_jobs", {
      method: "POST",
      body: JSON.stringify([
        {
          source_id: source.source_id,
          status: "running",
          started_at: startedAt,
        },
      ]),
    });

    const adapter = adapters[source.source_id];

    if (!adapter) {
      const message = "No collector adapter is configured for this source yet.";
      await finishJob(job.id, "skipped", 0, message);
      results.push({
        sourceId: source.source_id,
        platform: source.platform,
        status: "skipped",
        rawCount: 0,
        savedCount: 0,
        error: message,
      });
      continue;
    }

    try {
      const collected = dedupeByTitle(await adapter(source)).slice(0, 100);
      const savedCount = await saveCollectedTrends(collected);
      await finishJob(job.id, "success", collected.length);
      results.push({
        sourceId: source.source_id,
        platform: source.platform,
        status: "success",
        rawCount: collected.length,
        savedCount,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Collector failed.";
      await finishJob(job.id, "failed", 0, message);
      results.push({
        sourceId: source.source_id,
        platform: source.platform,
        status: "failed",
        rawCount: 0,
        savedCount: 0,
        error: message,
      });
    }
  }

  return {
    collectedAt: new Date().toISOString(),
    results,
    totals: {
      raw: results.reduce((sum, result) => sum + result.rawCount, 0),
      saved: results.reduce((sum, result) => sum + result.savedCount, 0),
      failed: results.filter((result) => result.status === "failed").length,
      skipped: results.filter((result) => result.status === "skipped").length,
    },
  };
}

async function collectDouyinHot(source: SourceRow): Promise<CollectedTrend[]> {
  const data = await fetchJson<{
    data?: {
      word_list?: Array<{
        word?: string;
        position?: number;
        hot_value?: number;
        sentence_id?: string;
        video_count?: number;
        discuss_video_count?: number;
      }>;
    };
    status_code?: number;
  }>("https://www.douyin.com/aweme/v1/web/hot/search/list/", {
    referer: "https://www.douyin.com/",
  });

  return (data.data?.word_list ?? [])
    .map((item, index) => {
      const title = cleanTitle(item.word || "");

      if (!title) {
        return null;
      }

      return {
        sourceId: source.source_id,
        platform: source.platform,
        title,
        sourceTitle: title,
        sourceUrl: `https://www.douyin.com/search/${encodeURIComponent(title)}`,
        rank: item.position || index + 1,
        heat: Number(item.hot_value ?? 0) || heatFromRank(index + 1, 950_000),
        rawPayload: item as Record<string, unknown>,
      };
    })
    .filter(Boolean) as CollectedTrend[];
}

async function collectWeiboHot(source: SourceRow): Promise<CollectedTrend[]> {
  const data = await fetchJson<{
    ok?: number;
    data?: {
      realtime?: Array<{
        note?: string;
        word?: string;
        word_scheme?: string;
        realpos?: number;
        rank?: number;
        num?: number;
      }>;
    };
  }>("https://weibo.com/ajax/side/hotSearch", {
    referer: "https://s.weibo.com/",
  });

  const items = data.data?.realtime ?? [];

  return items
    .map((item, index) => {
      const title = cleanTitle(item.note || item.word || item.word_scheme || "");

      if (!title) {
        return null;
      }

      return {
        sourceId: source.source_id,
        platform: source.platform,
        title,
        sourceTitle: item.word || title,
        sourceUrl: `https://s.weibo.com/weibo?q=${encodeURIComponent(title)}`,
        rank: item.realpos || item.rank || index + 1,
        heat: Number(item.num ?? 0) || heatFromRank(index + 1, 900_000),
        rawPayload: item as Record<string, unknown>,
      };
    })
    .filter(Boolean) as CollectedTrend[];
}

async function collectBilibiliPopular(source: SourceRow): Promise<CollectedTrend[]> {
  const data = await fetchJson<{
    code?: number;
    message?: string;
    data?: {
      list?: Array<{
        bvid?: string;
        title?: string;
        desc?: string;
        tname?: string;
        stat?: {
          view?: number;
          danmaku?: number;
          like?: number;
          favorite?: number;
          coin?: number;
          share?: number;
        };
      }>;
    };
  }>("https://api.bilibili.com/x/web-interface/popular?ps=50&pn=1", {
    referer: "https://www.bilibili.com/",
  });

  if (data.code !== 0) {
    throw new Error(data.message || `Bilibili returned code ${data.code}`);
  }

  return (data.data?.list ?? [])
    .map((item, index) => {
      const title = cleanTitle(item.title || "");

      if (!title) {
        return null;
      }

      const stat = item.stat ?? {};
      const heat =
        Number(stat.view ?? 0) +
        Number(stat.danmaku ?? 0) * 30 +
        Number(stat.like ?? 0) * 8 +
        Number(stat.favorite ?? 0) * 6 +
        Number(stat.coin ?? 0) * 6 +
        Number(stat.share ?? 0) * 12;

      return {
        sourceId: source.source_id,
        platform: source.platform,
        title,
        sourceTitle: item.tname ? `${item.tname} · ${title}` : title,
        sourceUrl: item.bvid
          ? `https://www.bilibili.com/video/${item.bvid}`
          : `https://search.bilibili.com/all?keyword=${encodeURIComponent(title)}`,
        rank: index + 1,
        heat: heat || heatFromRank(index + 1, 650_000),
        rawPayload: item as Record<string, unknown>,
      };
    })
    .filter(Boolean) as CollectedTrend[];
}

async function collectBaiduHot(source: SourceRow): Promise<CollectedTrend[]> {
  const html = await fetchText("https://top.baidu.com/board?tab=realtime");
  const titles = extractBaiduWords(html).slice(0, 50);

  return titles.map((title, index) => ({
    sourceId: source.source_id,
    platform: source.platform,
    title,
    sourceTitle: title,
    sourceUrl: `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`,
    rank: index + 1,
    heat: heatFromRank(index + 1, 760_000),
    rawPayload: { title, source: "baidu-top" },
  }));
}

async function saveCollectedTrends(items: CollectedTrend[]) {
  if (!items.length) {
    return 0;
  }

  const now = new Date().toISOString();
  const trendPayload = items.map((item) => {
    const type = classifyTrendType(item.title, item.platform);
    const riskLevel = classifyRiskLevel(item.title);

    return {
      title: item.title,
      source_title: item.sourceTitle,
      slug: slugFor(item.platform, item.title),
      platform: item.platform,
      type,
      lifecycle: lifecycleForRank(item.rank),
      risk_level: riskLevel,
      source_url: item.sourceUrl,
      tags: tagsFor(item.platform, type, riskLevel),
      summary: `${item.title} 正在 ${platformName(item.platform)} 热榜中上升，系统已记录为候选趋势。`,
      signal: `来源排名 #${item.rank}，当前热度估算为 ${Math.round(item.heat).toLocaleString("zh-CN")}。`,
      spread_path: `当前主要信号来自${platformName(item.platform)}，后续快照会继续判断是否跨平台扩散。`,
      operator_note:
        riskLevel === "high"
          ? "命中高风险语境，建议人工复核后再用于内容策划。"
          : "可继续观察排名、热度和复用速度。",
      sample_signals: ["进入平台热榜", "已写入历史快照", "等待下一轮采集判断增速"],
      last_seen_at: now,
    };
  });

  const trendRows = await supabaseRest<TrendRow[]>("trends?on_conflict=slug", {
    method: "POST",
    headers: {
      prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(trendPayload),
  });

  const latestSnapshots = await getLatestSnapshots();
  const trendBySlug = new Map(trendRows.map((row) => [row.slug, row]));

  const snapshotPayload = items
    .map((item) => {
      const trend = trendBySlug.get(slugFor(item.platform, item.title));

      if (!trend) {
        return null;
      }

      const previousHeat = Number(latestSnapshots.get(trend.id)?.heat_score ?? 0);
      const growthRate = previousHeat > 0 ? clamp((item.heat - previousHeat) / previousHeat, -0.95, 3) : growthFromRank(item.rank);

      return {
        trend_id: trend.id,
        platform: item.platform,
        rank: item.rank,
        heat_score: Math.round(item.heat),
        growth_rate: Number(growthRate.toFixed(4)),
        raw_payload: {
          source_id: item.sourceId,
          source_url: item.sourceUrl,
          payload: item.rawPayload,
        },
        captured_at: now,
      };
    })
    .filter(Boolean);

  if (snapshotPayload.length) {
    await supabaseRest("trend_snapshots", {
      method: "POST",
      body: JSON.stringify(snapshotPayload),
    });
  }

  return trendRows.length;
}

async function getLatestSnapshots() {
  const rows = await supabaseRest<SnapshotRow[]>(
    "trend_snapshots?select=trend_id,heat_score,captured_at&order=captured_at.desc&limit=1000",
  );
  const snapshots = new Map<string, SnapshotRow>();

  for (const row of rows) {
    if (!snapshots.has(row.trend_id)) {
      snapshots.set(row.trend_id, row);
    }
  }

  return snapshots;
}

async function finishJob(id: string, status: string, rawCount: number, errorMessage?: string) {
  await supabaseRest(`collection_jobs?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      finished_at: new Date().toISOString(),
      raw_count: rawCount,
      error_message: errorMessage ?? null,
    }),
  });
}

async function fetchJson<T>(url: string, headers: Record<string, string> = {}) {
  const response = await fetch(url, {
    headers: {
      ...requestHeaders,
      ...headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return (await response.json()) as T;
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: requestHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.text();
}

function extractBaiduWords(html: string) {
  const words: string[] = [];
  const seen = new Set<string>();
  const pattern = /"word":"((?:\\.|[^"\\])*)"/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html))) {
    const word = decodeJsonString(match[1]);

    if (word && !seen.has(word) && /[\u4e00-\u9fff]/.test(word)) {
      seen.add(word);
      words.push(word);
    }
  }

  return words;
}

function decodeJsonString(value: string) {
  try {
    return JSON.parse(`"${value}"`) as string;
  } catch {
    return value;
  }
}

function dedupeByTitle(items: CollectedTrend[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.platform}:${item.title}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function cleanTitle(value: string) {
  return value.replace(/^#|#$/g, "").replace(/\s+/g, " ").trim();
}

function slugFor(platform: Platform, title: string) {
  return `${platform}-${hashString(title)}`;
}

function hashString(value: string) {
  let hash = 5381;

  for (const character of value) {
    hash = (hash * 33) ^ character.charCodeAt(0);
  }

  return (hash >>> 0).toString(36);
}

function heatFromRank(rank: number, base: number) {
  return Math.max(10_000, base - rank * 11_000);
}

function growthFromRank(rank: number) {
  if (rank <= 5) {
    return 0.75;
  }

  if (rank <= 15) {
    return 0.48;
  }

  if (rank <= 40) {
    return 0.28;
  }

  return 0.12;
}

function lifecycleForRank(rank: number) {
  if (rank <= 8) {
    return "breakout";
  }

  if (rank <= 30) {
    return "rising";
  }

  return "new";
}

function classifyTrendType(title: string, platform: Platform): TrendType {
  if (/挑战|变装|舞蹈|跟拍|challenge/i.test(title)) {
    return "challenge";
  }

  if (/BGM|音乐|歌|曲|bgm/i.test(title)) {
    return "bgm";
  }

  if (/穿搭|妆|包|店|价格|消费|旅游|经济|买|卖|品牌/.test(title)) {
    return "commerce";
  }

  if (/文学|发疯|梗|整活|表情|显眼包|搭子/.test(title) || platform === "bilibili") {
    return "meme";
  }

  if (/说法|回应|官方|通报|案|事故|政策/.test(title)) {
    return "news";
  }

  return "phrase";
}

function classifyRiskLevel(title: string): RiskLevel {
  if (/习近平|中方|军委|国务委员|政治|法院|死刑|死缓|战争|灾害|事故|未成年/.test(title)) {
    return "high";
  }

  if (/争议|道歉|封禁|塌房|曝光|举报|维权|吵架/.test(title)) {
    return "medium";
  }

  return "low";
}

function tagsFor(platform: Platform, type: TrendType, riskLevel: RiskLevel) {
  return [platformName(platform), typeName(type), riskLevel === "high" ? "需复核" : "自动采集"];
}

function platformName(platform: Platform) {
  const labels: Record<Platform, string> = {
    douyin: "抖音",
    xiaohongshu: "小红书",
    weibo: "微博",
    bilibili: "哔哩哔哩",
    baidu: "百度",
  };

  return labels[platform];
}

function typeName(type: TrendType) {
  const labels: Record<TrendType, string> = {
    meme: "热梗",
    challenge: "挑战",
    bgm: "BGM",
    phrase: "流行语",
    news: "热点事件",
    commerce: "消费趋势",
  };

  return labels[type];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
