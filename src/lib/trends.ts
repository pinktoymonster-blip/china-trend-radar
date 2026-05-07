export type Platform = "douyin" | "xiaohongshu" | "weibo" | "bilibili" | "baidu";

export type TrendType = "meme" | "challenge" | "bgm" | "phrase" | "news" | "commerce";

export type RiskLevel = "low" | "medium" | "high";

export type Trend = {
  id: string;
  titleCn: string;
  titleKr: string;
  slug: string;
  platform: Platform;
  type: TrendType;
  rank: number;
  heat: number;
  growthRate: number;
  crossPlatformCount: number;
  novelty: number;
  brandFit: number;
  riskLevel: RiskLevel;
  firstSeenAt: string;
  sourceUrl: string;
  tags: string[];
  summaryKr: string;
  whyTrending: string;
  usagePattern: string;
  contentIdeas: string[];
};

export const platformLabels: Record<Platform, string> = {
  douyin: "Douyin",
  xiaohongshu: "Xiaohongshu",
  weibo: "Weibo",
  bilibili: "Bilibili",
  baidu: "Baidu",
};

export const typeLabels: Record<TrendType, string> = {
  meme: "밈",
  challenge: "챌린지",
  bgm: "BGM",
  phrase: "유행어",
  news: "이슈",
  commerce: "소비 트렌드",
};

export const riskLabels: Record<RiskLevel, string> = {
  low: "낮음",
  medium: "검토",
  high: "주의",
};

export const trends: Trend[] = [
  {
    id: "tr_001",
    titleCn: "打工人发疯文学",
    titleKr: "직장인 발광문학",
    slug: "dagongren-fafeng-wenxue",
    platform: "douyin",
    type: "meme",
    rank: 3,
    heat: 842000,
    growthRate: 0.62,
    crossPlatformCount: 4,
    novelty: 0.71,
    brandFit: 0.82,
    riskLevel: "low",
    firstSeenAt: "2026-05-07T08:30:00+08:00",
    sourceUrl: "https://www.douyin.com/",
    tags: ["热梗", "职场", "年轻人", "情绪"],
    summaryKr:
      "업무 스트레스와 자기비하식 농담을 과장된 문장으로 풀어내는 직장인 공감형 밈입니다.",
    whyTrending:
      "연휴 이후 업무 복귀, 청년층 번아웃 담론, 짧은 대사형 숏폼 포맷이 겹치며 확산되고 있습니다.",
    usagePattern:
      "짧은 상황극, 자막 중심 독백, 사무실 사물 의인화, 댓글 유도형 질문으로 많이 쓰입니다.",
    contentIdeas: [
      "브랜드 담당자의 월요일 회의 전후 감정 차이를 8초 숏폼으로 구성",
      "제품 기능을 직장인 생존템처럼 과장해 소개",
      "댓글로 오늘의 발광문학 문장을 모집하는 참여형 포스트",
    ],
  },
  {
    id: "tr_002",
    titleCn: "多巴胺穿搭",
    titleKr: "도파민 스타일링",
    slug: "duobaan-chuanda",
    platform: "xiaohongshu",
    type: "commerce",
    rank: 8,
    heat: 526000,
    growthRate: 0.34,
    crossPlatformCount: 3,
    novelty: 0.48,
    brandFit: 0.91,
    riskLevel: "low",
    firstSeenAt: "2026-05-07T09:15:00+08:00",
    sourceUrl: "https://www.xiaohongshu.com/",
    tags: ["种草", "穿搭", "色彩", "女性"],
    summaryKr:
      "밝고 대비가 강한 색 조합으로 기분 전환과 자기표현을 강조하는 스타일링 트렌드입니다.",
    whyTrending:
      "계절 전환기 패션 콘텐츠와 화사한 컬러 아이템 추천 노트가 함께 늘며 검색 수요가 증가하고 있습니다.",
    usagePattern:
      "전후 비교, 컬러 팔레트, 착장 저장용 이미지, 구매 링크형 노트로 전개됩니다.",
    contentIdeas: [
      "컬러별 기분 키워드와 제품을 연결한 저장용 카드",
      "출근룩에서 주말룩으로 바뀌는 3단 변신 영상",
      "브랜드 컬러를 활용한 도파민 팔레트 큐레이션",
    ],
  },
  {
    id: "tr_003",
    titleCn: "松弛感生活",
    titleKr: "느슨한 생활감",
    slug: "songchi-gan-shenghuo",
    platform: "weibo",
    type: "phrase",
    rank: 11,
    heat: 718000,
    growthRate: 0.29,
    crossPlatformCount: 5,
    novelty: 0.42,
    brandFit: 0.78,
    riskLevel: "medium",
    firstSeenAt: "2026-05-07T07:45:00+08:00",
    sourceUrl: "https://s.weibo.com/",
    tags: ["生活方式", "情绪价值", "慢生活"],
    summaryKr:
      "애쓰지 않는 자연스러운 태도, 여유로운 일상, 과시 없는 취향을 긍정하는 표현입니다.",
    whyTrending:
      "경쟁 피로와 라이프스타일 콘텐츠가 맞물리며 공감형 키워드로 재순환 중입니다.",
    usagePattern:
      "일상 브이로그, 공간 사진, 차분한 제품 연출, 자기돌봄 메시지에 붙습니다.",
    contentIdeas: [
      "브랜드 제품을 '긴장 풀리는 하루 루틴' 안에 배치",
      "완벽하지 않은 사용 장면을 보여주는 로우파이 숏폼",
      "사용자들의 쉬는 순간 사진을 모으는 캠페인",
    ],
  },
  {
    id: "tr_004",
    titleCn: "抽象整活",
    titleKr: "초현실 장난/기행 밈",
    slug: "chouxiang-zhenghuo",
    platform: "bilibili",
    type: "meme",
    rank: 5,
    heat: 391000,
    growthRate: 0.51,
    crossPlatformCount: 2,
    novelty: 0.76,
    brandFit: 0.39,
    riskLevel: "medium",
    firstSeenAt: "2026-05-07T10:00:00+08:00",
    sourceUrl: "https://www.bilibili.com/",
    tags: ["二创", "鬼畜", "年轻男性", "亚文化"],
    summaryKr:
      "논리보다 황당함과 편집 리듬으로 웃기는 Bilibili식 2차 창작 밈입니다.",
    whyTrending:
      "짧은 컷 편집, 음성 합성, 반복 자막을 이용한 2차 창작 영상이 커뮤니티에서 빠르게 재생산됩니다.",
    usagePattern:
      "기존 영상을 과장 편집하거나 무관한 장면을 연결해 예상 밖의 웃음을 만듭니다.",
    contentIdeas: [
      "브랜드 계정에서는 직접 참여보다 커뮤니티 언어 관찰용으로 활용",
      "제품 기능을 과장 편집하는 대신 공식 채널 톤에 맞게 순화",
      "댓글 반응을 분석해 다음 콘텐츠의 유머 강도를 조절",
    ],
  },
  {
    id: "tr_005",
    titleCn: "反向旅游",
    titleKr: "역방향 여행",
    slug: "fanxiang-lvyou",
    platform: "baidu",
    type: "commerce",
    rank: 15,
    heat: 274000,
    growthRate: 0.22,
    crossPlatformCount: 3,
    novelty: 0.57,
    brandFit: 0.86,
    riskLevel: "low",
    firstSeenAt: "2026-05-07T06:50:00+08:00",
    sourceUrl: "https://www.baidu.com/",
    tags: ["旅行", "小众城市", "消费", "攻略"],
    summaryKr:
      "유명 관광지 대신 덜 붐비는 소도시나 생활권 목적지를 찾는 여행 트렌드입니다.",
    whyTrending:
      "연휴 혼잡 회피, 가성비 여행, 로컬 경험 선호가 검색 트렌드로 이어지고 있습니다.",
    usagePattern:
      "소도시 코스, 저예산 일정표, 로컬 음식, 교통 팁 중심의 정보형 콘텐츠로 퍼집니다.",
    contentIdeas: [
      "브랜드 체험을 소도시 1박 2일 코스에 연결",
      "지역별 저장용 지도형 콘텐츠 제작",
      "사용자가 추천한 숨은 목적지를 모으는 투표형 캠페인",
    ],
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
      trend.brandFit * 0.1) *
      100,
  );
}

export const rankedTrends = [...trends].sort(
  (a, b) => getTrendScore(b) - getTrendScore(a),
);

export function findTrendBySlug(slug: string) {
  return trends.find((trend) => trend.slug === slug);
}
