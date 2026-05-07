export type Platform = "douyin" | "xiaohongshu" | "weibo" | "bilibili" | "baidu";

export type TrendType = "meme" | "challenge" | "bgm" | "phrase" | "news" | "commerce";

export type RiskLevel = "low" | "medium" | "high";

export type Lifecycle = "new" | "rising" | "breakout" | "cooling";

export type Trend = {
  id: string;
  title: string;
  sourceTitle: string;
  slug: string;
  platform: Platform;
  type: TrendType;
  lifecycle: Lifecycle;
  rank: number;
  heat: number;
  growthRate: number;
  crossPlatformCount: number;
  novelty: number;
  interactionQuality: number;
  riskLevel: RiskLevel;
  firstSeenAt: string;
  sourceUrl: string;
  tags: string[];
  summary: string;
  signal: string;
  spreadPath: string;
  operatorNote: string;
  sampleSignals: string[];
};

export const platformLabels: Record<Platform, string> = {
  douyin: "抖音",
  xiaohongshu: "小红书",
  weibo: "微博",
  bilibili: "哔哩哔哩",
  baidu: "百度",
};

export const typeLabels: Record<TrendType, string> = {
  meme: "热梗",
  challenge: "挑战",
  bgm: "BGM",
  phrase: "流行语",
  news: "热点事件",
  commerce: "消费趋势",
};

export const riskLabels: Record<RiskLevel, string> = {
  low: "低风险",
  medium: "需观察",
  high: "高风险",
};

export const lifecycleLabels: Record<Lifecycle, string> = {
  new: "新出现",
  rising: "快速上升",
  breakout: "正在爆发",
  cooling: "开始回落",
};

export const scoringWeights = [
  { key: "growth", label: "增长速度", value: 35, note: "最近 1 小时与 24 小时的热度变化" },
  { key: "heat", label: "当前热度", value: 25, note: "平台榜单排名、播放、搜索与讨论量" },
  { key: "cross", label: "跨平台扩散", value: 20, note: "同一主题在多个平台同时出现的强度" },
  { key: "novelty", label: "新鲜度", value: 10, note: "与历史趋势库的相似度越低，分数越高" },
  { key: "quality", label: "互动质量", value: 10, note: "评论、收藏、转发与二创的有效互动" },
];

export const sourceSettings = [
  { platform: "douyin" as const, name: "抖音热点 / 话题 / BGM", cadence: "15 分钟", enabled: true },
  { platform: "xiaohongshu" as const, name: "小红书关键词 / 热门笔记", cadence: "30 分钟", enabled: true },
  { platform: "weibo" as const, name: "微博热搜 / 话题榜", cadence: "15 分钟", enabled: true },
  { platform: "bilibili" as const, name: "B站热门 / 排行 / 二创", cadence: "30 分钟", enabled: true },
  { platform: "baidu" as const, name: "百度热搜 / 搜索指数", cadence: "60 分钟", enabled: false },
];

const baseTrends: Trend[] = [
  {
    id: "tr_001",
    title: "打工人发疯文学",
    sourceTitle: "打工人发疯文学",
    slug: "dagongren-fafeng-wenxue",
    platform: "douyin",
    type: "meme",
    lifecycle: "breakout",
    rank: 3,
    heat: 842000,
    growthRate: 0.62,
    crossPlatformCount: 4,
    novelty: 0.71,
    interactionQuality: 0.82,
    riskLevel: "low",
    firstSeenAt: "2026-05-07T08:30:00+08:00",
    sourceUrl: sourceUrlFor("douyin", "打工人发疯文学"),
    tags: ["热梗", "职场", "年轻人", "情绪"],
    summary: "以夸张语气表达职场压力和情绪释放，适合短视频独白、评论接龙和场景化二创。",
    signal: "过去 24 小时内增长速度明显高于同类职场情绪内容，评论区复用率高。",
    spreadPath: "抖音先出现模板化文案，随后扩散到微博话题与小红书情绪价值笔记。",
    operatorNote: "可作为轻量情绪营销素材，但避免触碰真实劳动纠纷和企业负面案例。",
    sampleSignals: ["模板文案复用增加", "职场账号跟拍变多", "评论中出现大量同款句式"],
  },
  {
    id: "tr_002",
    title: "多巴胺穿搭",
    sourceTitle: "多巴胺穿搭",
    slug: "duobaan-chuanda",
    platform: "xiaohongshu",
    type: "commerce",
    lifecycle: "rising",
    rank: 8,
    heat: 526000,
    growthRate: 0.34,
    crossPlatformCount: 3,
    novelty: 0.48,
    interactionQuality: 0.91,
    riskLevel: "low",
    firstSeenAt: "2026-05-07T09:15:00+08:00",
    sourceUrl: sourceUrlFor("xiaohongshu", "多巴胺穿搭"),
    tags: ["种草", "穿搭", "色彩", "女性"],
    summary: "用高饱和色彩表达轻松、快乐、自我风格，适合服饰、美妆、生活方式内容。",
    signal: "收藏率与搜索联想词稳定上升，相关商品笔记开始密集出现。",
    spreadPath: "小红书种草笔记先升温，抖音穿搭视频与电商内容开始跟进。",
    operatorNote: "品牌可参与度高，适合做色彩搭配、清单、节日场景和用户征集。",
    sampleSignals: ["配色清单被大量收藏", "同款标签增长", "评论询问购买链接增加"],
  },
  {
    id: "tr_003",
    title: "松弛感生活",
    sourceTitle: "松弛感生活",
    slug: "songchi-gan-shenghuo",
    platform: "weibo",
    type: "phrase",
    lifecycle: "rising",
    rank: 11,
    heat: 718000,
    growthRate: 0.29,
    crossPlatformCount: 5,
    novelty: 0.42,
    interactionQuality: 0.78,
    riskLevel: "medium",
    firstSeenAt: "2026-05-07T07:45:00+08:00",
    sourceUrl: sourceUrlFor("weibo", "松弛感生活"),
    tags: ["生活方式", "情绪价值", "慢生活"],
    summary: "强调不紧绷、不用力、自然舒适的生活态度，是情绪价值内容的高频表达。",
    signal: "跨平台出现频率高，但主题已经多次回流，需要判断是否为新一轮变体。",
    spreadPath: "微博讨论带动关键词复热，小红书和短视频平台承接生活方式内容。",
    operatorNote: "适合生活方式品牌，但表达要真实克制，避免显得空泛或过度包装。",
    sampleSignals: ["生活方式账号复用", "慢生活内容互动稳定", "品牌号开始使用该表达"],
  },
  {
    id: "tr_004",
    title: "抽象整活",
    sourceTitle: "抽象整活",
    slug: "chouxiang-zhenghuo",
    platform: "bilibili",
    type: "meme",
    lifecycle: "new",
    rank: 5,
    heat: 391000,
    growthRate: 0.51,
    crossPlatformCount: 2,
    novelty: 0.76,
    interactionQuality: 0.39,
    riskLevel: "medium",
    firstSeenAt: "2026-05-07T10:00:00+08:00",
    sourceUrl: sourceUrlFor("bilibili", "抽象整活"),
    tags: ["二创", "鬼畜", "年轻男性", "亚文化"],
    summary: "以荒诞剪辑、错位叙事和高密度弹幕制造笑点，社区属性强。",
    signal: "二创速度快，但品牌可控性较低，需观察是否破圈。",
    spreadPath: "B站二创先集中爆发，部分片段被搬运到抖音和微博。",
    operatorNote: "更适合观察年轻用户语感，不建议品牌早期直接大规模参与。",
    sampleSignals: ["剪辑模板快速复用", "弹幕密度增加", "搬运视频开始出现"],
  },
  {
    id: "tr_005",
    title: "反向旅游",
    sourceTitle: "反向旅游",
    slug: "fanxiang-lvyou",
    platform: "baidu",
    type: "commerce",
    lifecycle: "cooling",
    rank: 15,
    heat: 274000,
    growthRate: 0.22,
    crossPlatformCount: 3,
    novelty: 0.57,
    interactionQuality: 0.86,
    riskLevel: "low",
    firstSeenAt: "2026-05-07T06:50:00+08:00",
    sourceUrl: sourceUrlFor("baidu", "反向旅游"),
    tags: ["旅行", "小众城市", "消费", "攻略"],
    summary: "避开热门目的地，选择小众城市与低拥挤度路线，兼具性价比和新鲜感。",
    signal: "搜索量仍有基础，但增长速度开始放缓，适合做长尾内容。",
    spreadPath: "搜索和攻略内容先形成需求，小红书与短视频平台承接路线分享。",
    operatorNote: "适合旅游、餐饮、出行品牌做区域化内容，但爆发窗口可能已过。",
    sampleSignals: ["攻略搜索稳定", "小众城市笔记增加", "节假日后讨论降温"],
  },
];

const topicPool = [
  "夏日通勤包",
  "周末微度假",
  "情绪搭子",
  "懒人早餐挑战",
  "低成本松弛感",
  "早八人自救指南",
  "赛博养生",
  "电子榨菜二创",
  "反向种草清单",
  "城市漫游计划",
  "显眼包文学",
  "万能拍照姿势",
  "早C晚A新梗",
  "办公室回血角",
  "三分钟变装挑战",
  "下班后人格",
  "氛围感书桌",
  "无痛存钱法",
  "毕业季发疯语录",
  "小城夜生活",
];

const platformCycle: Platform[] = ["douyin", "xiaohongshu", "weibo", "bilibili", "baidu"];
const typeCycle: TrendType[] = ["meme", "commerce", "phrase", "challenge", "bgm", "news"];
const lifecycleCycle: Lifecycle[] = ["breakout", "rising", "new", "cooling"];
const riskCycle: RiskLevel[] = ["low", "low", "medium", "low", "high"];

const generatedTrends: Trend[] = Array.from({ length: 95 }, (_, index) => {
  const position = index + baseTrends.length + 1;
  const title = `${topicPool[index % topicPool.length]} ${Math.floor(index / topicPool.length) + 1}`;
  const platform = platformCycle[index % platformCycle.length];
  const type = typeCycle[index % typeCycle.length];
  const lifecycle = lifecycleCycle[index % lifecycleCycle.length];
  const riskLevel = riskCycle[index % riskCycle.length];
  const heat = Math.max(48_000, 790_000 - index * 7_200 - (index % 5) * 3_100);

  return {
    id: `tr_${String(position).padStart(3, "0")}`,
    title,
    sourceTitle: title,
    slug: `trend-${String(position).padStart(3, "0")}`,
    platform,
    type,
    lifecycle,
    rank: position,
    heat,
    growthRate: Math.max(0.04, 0.58 - index * 0.004),
    crossPlatformCount: (index % 5) + 1,
    novelty: Math.max(0.21, 0.88 - index * 0.004),
    interactionQuality: Math.max(0.28, 0.83 - (index % 9) * 0.05),
    riskLevel,
    firstSeenAt: `2026-05-${String(7 + (index % 2)).padStart(2, "0")}T${String(
      8 + (index % 12),
    ).padStart(2, "0")}:00:00+08:00`,
    sourceUrl: sourceUrlFor(platform, title),
    tags: tagsFor(type, platform),
    summary: `${title} 正在 ${platformLabels[platform]} 获得关注，系统将其归类为${typeLabels[type]}候选。`,
    signal: "当前热度与互动信号进入 Top 100，后续会通过历史快照继续判断是否持续上升。",
    spreadPath: `主要信号来自${platformLabels[platform]}，系统正在观察其他平台是否出现同类关键词。`,
    operatorNote: riskLevel === "high" ? "命中风险规则，需要先观察语境再决定是否加入报告。" : "可继续观察热度变化和内容复用情况。",
    sampleSignals: ["榜单排名进入候选池", "相关关键词开始重复出现", "互动质量高于同类平均值"],
  };
});

export const trends: Trend[] = [...baseTrends, ...generatedTrends];

export function getTrendScore(trend: Trend) {
  const heatScore = Math.min(trend.heat / 1_000_000, 1);
  const platformScore = Math.min(trend.crossPlatformCount / 5, 1);

  return Math.round(
    (trend.growthRate * 0.35 +
      heatScore * 0.25 +
      platformScore * 0.2 +
      trend.novelty * 0.1 +
      trend.interactionQuality * 0.1) *
      100,
  );
}

export const rankedTrends = [...trends]
  .sort((a, b) => b.heat - a.heat)
  .map((trend, index) => ({ ...trend, rank: index + 1 }));

export function findTrendBySlug(slug: string) {
  return rankedTrends.find((trend) => trend.slug === slug);
}

function sourceUrlFor(platform: Platform, title: string) {
  const query = encodeURIComponent(title);

  if (platform === "douyin") {
    return `https://www.douyin.com/search/${query}`;
  }

  if (platform === "xiaohongshu") {
    return `https://www.xiaohongshu.com/search_result?keyword=${query}`;
  }

  if (platform === "weibo") {
    return `https://s.weibo.com/weibo?q=${query}`;
  }

  if (platform === "bilibili") {
    return `https://search.bilibili.com/all?keyword=${query}`;
  }

  return `https://www.baidu.com/s?wd=${query}`;
}

function tagsFor(type: TrendType, platform: Platform) {
  return [typeLabels[type], platformLabels[platform], "Top100"];
}
