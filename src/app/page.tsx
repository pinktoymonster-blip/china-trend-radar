import Link from "next/link";
import {
  getTrendScore,
  platformLabels,
  rankedTrends,
  riskLabels,
  typeLabels,
} from "@/lib/trends";

const platformTotals = rankedTrends.reduce<Record<string, number>>((totals, trend) => {
  totals[trend.platform] = (totals[trend.platform] ?? 0) + 1;
  return totals;
}, {});

const topTrend = rankedTrends[0];
const averageGrowth = Math.round(
  (rankedTrends.reduce((sum, trend) => sum + trend.growthRate, 0) / rankedTrends.length) *
    100,
);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f2933]">
      <section className="border-b border-[#d9d1c3] bg-[#fffdf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a34832]">
                China Trend Radar
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[#1f2933] sm:text-5xl">
                오늘 중국에서 뜨는 밈과 챌린지
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#64707d]">
                Douyin, Xiaohongshu, Weibo, Bilibili, Baidu 신호를 한 화면에서
                보고 큐레이션하는 MVP 대시보드입니다.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm sm:min-w-[390px]">
              <Metric label="후보" value={`${rankedTrends.length}`} tone="sand" />
              <Metric label="평균 상승" value={`${averageGrowth}%`} tone="mint" />
              <Metric label="최고 점수" value={`${getTrendScore(topTrend)}`} tone="coral" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-10">
        <aside className="space-y-4">
          <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-4">
            <h2 className="text-sm font-semibold text-[#1f2933]">플랫폼 신호</h2>
            <div className="mt-4 space-y-3">
              {Object.entries(platformTotals).map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between text-sm">
                  <span className="text-[#64707d]">
                    {platformLabels[platform as keyof typeof platformLabels]}
                  </span>
                  <span className="rounded-md bg-[#edf4ef] px-2 py-1 font-semibold text-[#2c6e49]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-4">
            <h2 className="text-sm font-semibold text-[#1f2933]">수집 파이프라인</h2>
            <ol className="mt-4 space-y-3 text-sm text-[#64707d]">
              <li>1. 핫리스트 수집</li>
              <li>2. 중복 병합</li>
              <li>3. 점수화</li>
              <li>4. 한국어 요약</li>
              <li>5. Top 20 리포트</li>
            </ol>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#1f2933]">Trend Radar</h2>
              <p className="text-sm text-[#64707d]">상승률, 열도, 플랫폼 확산, 신규성을 반영한 랭킹</p>
            </div>
            <button className="h-10 rounded-lg bg-[#1f2933] px-4 text-sm font-semibold text-white transition hover:bg-[#33404d]">
              수동 등록
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#d9d1c3] bg-[#fffdf8]">
            <div className="grid min-w-[760px] grid-cols-[64px_1.5fr_120px_110px_110px_100px] border-b border-[#e8dfd0] bg-[#f1eadf] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#64707d]">
              <span>Score</span>
              <span>Trend</span>
              <span>Platform</span>
              <span>Type</span>
              <span>Growth</span>
              <span>Risk</span>
            </div>
            <div className="overflow-x-auto">
              {rankedTrends.map((trend) => (
                <Link
                  href={`/trends/${trend.slug}`}
                  key={trend.id}
                  className="grid min-w-[760px] grid-cols-[64px_1.5fr_120px_110px_110px_100px] items-center border-b border-[#eee6dc] px-4 py-4 text-sm transition last:border-b-0 hover:bg-[#faf3e8]"
                >
                  <span className="text-lg font-semibold text-[#a34832]">
                    {getTrendScore(trend)}
                  </span>
                  <span>
                    <span className="block font-semibold text-[#1f2933]">{trend.titleKr}</span>
                    <span className="mt-1 block text-xs text-[#64707d]">{trend.titleCn}</span>
                  </span>
                  <span className="text-[#395f89]">{platformLabels[trend.platform]}</span>
                  <span className="text-[#64707d]">{typeLabels[trend.type]}</span>
                  <span className="font-semibold text-[#2c6e49]">
                    +{Math.round(trend.growthRate * 100)}%
                  </span>
                  <span className={riskClassName(trend.riskLevel)}>
                    {riskLabels[trend.riskLevel]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "sand" | "mint" | "coral";
}) {
  const toneClassName = {
    sand: "bg-[#f1eadf] text-[#6b5639]",
    mint: "bg-[#edf4ef] text-[#2c6e49]",
    coral: "bg-[#fae8de] text-[#a34832]",
  }[tone];

  return (
    <div className={`rounded-lg px-3 py-3 ${toneClassName}`}>
      <div className="text-xs font-semibold">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function riskClassName(level: string) {
  if (level === "low") {
    return "w-fit rounded-md bg-[#edf4ef] px-2 py-1 text-xs font-semibold text-[#2c6e49]";
  }

  if (level === "high") {
    return "w-fit rounded-md bg-[#f8dddd] px-2 py-1 text-xs font-semibold text-[#9b2c2c]";
  }

  return "w-fit rounded-md bg-[#fff1c2] px-2 py-1 text-xs font-semibold text-[#7a5b00]";
}
