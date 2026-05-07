import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase-rest";
import {
  findTrendBySlug,
  getTrendScore,
  rankedTrends,
  type Lifecycle,
  type Platform,
  type RiskLevel,
  type Trend,
  type TrendType,
} from "@/lib/trends";

type TrendRow = {
  id: string;
  title: string;
  source_title: string | null;
  slug: string;
  platform: Platform;
  type: TrendType;
  lifecycle: Lifecycle;
  risk_level: RiskLevel;
  source_url: string | null;
  tags: string[] | null;
  summary: string | null;
  signal: string | null;
  spread_path: string | null;
  operator_note: string | null;
  sample_signals: string[] | null;
  first_seen_at: string;
  last_seen_at: string;
};

type SnapshotRow = {
  trend_id: string;
  rank: number | null;
  heat_score: number | string | null;
  growth_rate: number | string | null;
  captured_at: string;
};

export async function getDashboardTrends(limit = 100) {
  const storedTrends = await getStoredTrends(limit);
  return storedTrends.length ? storedTrends : rankedTrends.slice(0, limit);
}

export async function getTrendBySlug(slug: string) {
  const storedTrend = await getStoredTrendBySlug(slug);
  return storedTrend ?? findTrendBySlug(slug);
}

async function getStoredTrends(limit: number) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const [trendRows, snapshotRows] = await Promise.all([
      supabaseRest<TrendRow[]>(`trends?select=*&order=last_seen_at.desc&limit=${limit * 3}`),
      supabaseRest<SnapshotRow[]>(
        `trend_snapshots?select=trend_id,rank,heat_score,growth_rate,captured_at&order=captured_at.desc&limit=${limit * 10}`,
      ),
    ]);
    const latestSnapshots = latestSnapshotMap(snapshotRows);

    return trendRows
      .map((row) => toTrend(row, latestSnapshots.get(row.id)))
      .sort((a, b) => b.heat - a.heat || getTrendScore(b) - getTrendScore(a))
      .slice(0, limit)
      .map((trend, index) => ({ ...trend, rank: index + 1 }));
  } catch {
    return [];
  }
}

async function getStoredTrendBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const trendRows = await supabaseRest<TrendRow[]>(
      `trends?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    );
    const row = trendRows[0];

    if (!row) {
      return null;
    }

    const snapshotRows = await supabaseRest<SnapshotRow[]>(
      `trend_snapshots?trend_id=eq.${encodeURIComponent(
        row.id,
      )}&select=trend_id,rank,heat_score,growth_rate,captured_at&order=captured_at.desc&limit=1`,
    );

    return toTrend(row, snapshotRows[0]);
  } catch {
    return null;
  }
}

function latestSnapshotMap(rows: SnapshotRow[]) {
  const snapshots = new Map<string, SnapshotRow>();

  for (const row of rows) {
    if (!snapshots.has(row.trend_id)) {
      snapshots.set(row.trend_id, row);
    }
  }

  return snapshots;
}

function toTrend(row: TrendRow, snapshot?: SnapshotRow): Trend {
  const heat = Number(snapshot?.heat_score ?? 0);
  const growthRate = Number(snapshot?.growth_rate ?? 0);

  return {
    id: row.id,
    title: row.title,
    sourceTitle: row.source_title || row.title,
    slug: row.slug,
    platform: row.platform,
    type: row.type,
    lifecycle: row.lifecycle,
    rank: snapshot?.rank ?? 999,
    heat,
    growthRate,
    crossPlatformCount: 1,
    novelty: 0.65,
    interactionQuality: 0.65,
    riskLevel: row.risk_level,
    firstSeenAt: row.first_seen_at,
    sourceUrl: row.source_url || fallbackSourceUrl(row.platform, row.title),
    tags: row.tags?.length ? row.tags : ["自动采集"],
    summary: row.summary || `${row.title} 已进入趋势候选池。`,
    signal: row.signal || "系统已记录最新平台快照。",
    spreadPath: row.spread_path || "等待更多平台信号判断扩散路径。",
    operatorNote: row.operator_note || "继续观察下一轮快照变化。",
    sampleSignals: row.sample_signals?.length ? row.sample_signals : ["数据库趋势记录", "最新采集快照"],
  };
}

function fallbackSourceUrl(platform: Platform, title: string) {
  const query = encodeURIComponent(title);

  if (platform === "weibo") {
    return `https://s.weibo.com/weibo?q=${query}`;
  }

  if (platform === "bilibili") {
    return `https://search.bilibili.com/all?keyword=${query}`;
  }

  if (platform === "douyin") {
    return `https://www.douyin.com/search/${query}`;
  }

  if (platform === "xiaohongshu") {
    return `https://www.xiaohongshu.com/search_result?keyword=${query}`;
  }

  return `https://www.baidu.com/s?wd=${query}`;
}
