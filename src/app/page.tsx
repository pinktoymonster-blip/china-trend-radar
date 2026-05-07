import Link from "next/link";
import { requireAccess } from "@/lib/auth";
import {
  lifecycleLabels,
  platformLabels,
  rankedTrends,
  riskLabels,
  typeLabels,
} from "@/lib/trends";

const totalHeat = rankedTrends.reduce((sum, trend) => sum + trend.heat, 0);
const averageGrowth = Math.round(
  (rankedTrends.reduce((sum, trend) => sum + trend.growthRate, 0) / rankedTrends.length) *
    100,
);
const breakoutCount = rankedTrends.filter((trend) => trend.lifecycle === "breakout").length;
const riskCount = rankedTrends.filter((trend) => trend.riskLevel !== "low").length;

export default async function Home() {
  await requireAccess("/");

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f2933]">
      <header className="border-b border-[#d9d1c3] bg-[#fffdf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a34832]">
                China Trend Radar
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
                中国趋势监测台
              </h1>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-lg bg-[#1f2933] px-4 py-2 text-sm font-semibold text-white"
              >
                趋势
              </Link>
              <Link
                href="/settings"
                className="rounded-lg border border-[#d9d1c3] px-4 py-2 text-sm font-semibold text-[#64707d] transition hover:bg-[#f1eadf]"
              >
                设置
              </Link>
              <Link
                href="/logout"
                className="rounded-lg border border-[#d9d1c3] px-4 py-2 text-sm font-semibold text-[#64707d] transition hover:bg-[#f1eadf]"
              >
                退出
              </Link>
            </div>
          </nav>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="今日监测趋势" value={`${rankedTrends.length}`} />
            <Metric label="总热度信号" value={formatCompact(totalHeat)} />
            <Metric label="平均增长" value={`+${averageGrowth}%`} />
            <Metric label="需重点观察" value={`${breakoutCount + riskCount}`} />
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">实时趋势排行</h2>
              <p className="mt-1 text-sm text-[#64707d]">
                按当前热度从高到低展示 Top 100，并保留每个趋势的来源链接。
              </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#64707d]">
            <span className="rounded-md bg-[#edf4ef] px-2 py-1 text-[#2c6e49]">自动采集</span>
            <span className="rounded-md bg-[#f1eadf] px-2 py-1">历史快照累计中</span>
            <span className="rounded-md bg-[#fae8de] px-2 py-1 text-[#a34832]">Top 100</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#d9d1c3] bg-[#fffdf8]">
          <div className="grid min-w-[1160px] grid-cols-[64px_1.35fr_110px_110px_110px_120px_100px_100px_120px] border-b border-[#e8dfd0] bg-[#f1eadf] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#64707d]">
            <span>排名</span>
            <span>趋势</span>
            <span>平台</span>
            <span>类型</span>
            <span>阶段</span>
            <span>热度</span>
            <span>增长</span>
            <span>风险</span>
            <span>来源</span>
          </div>
          <div className="overflow-x-auto">
            {rankedTrends.map((trend) => (
              <div
                key={trend.id}
                className="grid min-w-[1160px] grid-cols-[64px_1.35fr_110px_110px_110px_120px_100px_100px_120px] items-center border-b border-[#eee6dc] px-4 py-4 text-sm transition last:border-b-0 hover:bg-[#faf3e8]"
              >
                <span className="text-lg font-semibold text-[#a34832]">
                  {trend.rank}
                </span>
                <span>
                  <Link
                    href={`/trends/${trend.slug}`}
                    className="block font-semibold text-[#1f2933] transition hover:text-[#a34832]"
                  >
                    {trend.title}
                  </Link>
                  <span className="mt-1 block text-xs text-[#64707d]">
                    {trend.tags.join(" / ")}
                  </span>
                </span>
                <span className="text-[#395f89]">{platformLabels[trend.platform]}</span>
                <span className="text-[#64707d]">{typeLabels[trend.type]}</span>
                <span className={lifecycleClassName(trend.lifecycle)}>
                  {lifecycleLabels[trend.lifecycle]}
                </span>
                <span className="font-semibold text-[#1f2933]">{formatCompact(trend.heat)}</span>
                <span className="font-semibold text-[#2c6e49]">
                  +{Math.round(trend.growthRate * 100)}%
                </span>
                <span className={riskClassName(trend.riskLevel)}>
                  {riskLabels[trend.riskLevel]}
                </span>
                <a
                  href={trend.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#395f89] transition hover:text-[#a34832]"
                >
                  查看来源
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] px-4 py-4">
      <div className="text-xs font-semibold text-[#64707d]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[#1f2933]">{value}</div>
    </div>
  );
}

function formatCompact(value: number) {
  return Intl.NumberFormat("zh-CN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function lifecycleClassName(level: string) {
  if (level === "breakout") {
    return "w-fit rounded-md bg-[#fae8de] px-2 py-1 text-xs font-semibold text-[#a34832]";
  }

  if (level === "rising") {
    return "w-fit rounded-md bg-[#edf4ef] px-2 py-1 text-xs font-semibold text-[#2c6e49]";
  }

  return "w-fit rounded-md bg-[#f1eadf] px-2 py-1 text-xs font-semibold text-[#6b5639]";
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
