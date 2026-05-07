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

export const trends: Trend[] = [
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
    sourceUrl: "https://www.douyin.com/",
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
    sourceUrl: "https://www.xiaohongshu.com/",
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
    sourceUrl: "https://s.weibo.com/",
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
    sourceUrl: "https://www.bilibili.com/",
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
    sourceUrl: "https://www.baidu.com/",
    tags: ["旅行", "小众城市", "消费", "攻略"],
    summary: "避开热门目的地，选择小众城市与低拥挤度路线，兼具性价比和新鲜感。",
    signal: "搜索量仍有基础，但增长速度开始放缓，适合做长尾内容。",
    spreadPath: "搜索和攻略内容先形成需求，小红书与短视频平台承接路线分享。",
    operatorNote: "适合旅游、餐饮、出行品牌做区域化内容，但爆发窗口可能已过。",
    sampleSignals: ["攻略搜索稳定", "小众城市笔记增加", "节假日后讨论降温"],
  },
];

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

export const rankedTrends = [...trends].sort(
  (a, b) => getTrendScore(b) - getTrendScore(a),
);

export function findTrendBySlug(slug: string) {
  return trends.find((trend) => trend.slug === slug);
}
