import type { Platform } from "@/lib/trends";

export type CollectionSource = {
  id: string;
  platform: Platform;
  name: string;
  intervalMinutes: number;
  enabled: boolean;
  sortOrder: number;
};

export type ScoringWeight = {
  key: string;
  label: string;
  value: number;
  note: string;
  sortOrder: number;
};

export type MonitoringCategory = {
  key: string;
  label: string;
  enabled: boolean;
  sortOrder: number;
};

export type RiskRule = {
  key: string;
  label: string;
  action: "downrank" | "exclude" | "review";
  enabled: boolean;
  sortOrder: number;
};

export type RadarSettings = {
  configured: boolean;
  sources: CollectionSource[];
  scoringWeights: ScoringWeight[];
  categories: MonitoringCategory[];
  riskRules: RiskRule[];
  error?: string;
};

export const defaultSources: CollectionSource[] = [
  {
    id: "douyin-hot",
    platform: "douyin",
    name: "抖音热点 / 话题 / BGM",
    intervalMinutes: 15,
    enabled: true,
    sortOrder: 1,
  },
  {
    id: "xiaohongshu-keywords",
    platform: "xiaohongshu",
    name: "小红书关键词 / 热门笔记",
    intervalMinutes: 30,
    enabled: true,
    sortOrder: 2,
  },
  {
    id: "weibo-hot",
    platform: "weibo",
    name: "微博热搜 / 话题榜",
    intervalMinutes: 15,
    enabled: true,
    sortOrder: 3,
  },
  {
    id: "bilibili-ranking",
    platform: "bilibili",
    name: "B站热门 / 排行 / 二创",
    intervalMinutes: 30,
    enabled: true,
    sortOrder: 4,
  },
  {
    id: "baidu-index",
    platform: "baidu",
    name: "百度热搜 / 搜索指数",
    intervalMinutes: 60,
    enabled: false,
    sortOrder: 5,
  },
];

export const defaultScoringWeights: ScoringWeight[] = [
  { key: "growth", label: "增长速度", value: 35, note: "最近 1 小时与 24 小时的热度变化", sortOrder: 1 },
  { key: "heat", label: "当前热度", value: 25, note: "平台榜单排名、播放、搜索与讨论量", sortOrder: 2 },
  { key: "cross", label: "跨平台扩散", value: 20, note: "同一主题在多个平台同时出现的强度", sortOrder: 3 },
  { key: "novelty", label: "新鲜度", value: 10, note: "与历史趋势库的相似度越低，分数越高", sortOrder: 4 },
  { key: "quality", label: "互动质量", value: 10, note: "评论、收藏、转发与二创的有效互动", sortOrder: 5 },
];

export const defaultCategories: MonitoringCategory[] = [
  { key: "meme", label: "热梗", enabled: true, sortOrder: 1 },
  { key: "challenge", label: "挑战", enabled: true, sortOrder: 2 },
  { key: "bgm", label: "BGM", enabled: true, sortOrder: 3 },
  { key: "phrase", label: "流行语", enabled: true, sortOrder: 4 },
  { key: "commerce", label: "消费趋势", enabled: true, sortOrder: 5 },
  { key: "ugc", label: "二创内容", enabled: true, sortOrder: 6 },
];

export const defaultRiskRules: RiskRule[] = [
  { key: "political-sensitive", label: "政治敏感", action: "downrank", enabled: true, sortOrder: 1 },
  { key: "disaster", label: "灾难事故", action: "review", enabled: true, sortOrder: 2 },
  { key: "minor-dispute", label: "未成年人争议", action: "review", enabled: true, sortOrder: 3 },
  { key: "brand-negative", label: "品牌负面", action: "downrank", enabled: true, sortOrder: 4 },
];

export const defaultSettings: RadarSettings = {
  configured: false,
  sources: defaultSources,
  scoringWeights: defaultScoringWeights,
  categories: defaultCategories,
  riskRules: defaultRiskRules,
};
