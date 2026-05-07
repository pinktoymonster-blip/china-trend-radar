import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findTrendBySlug,
  getTrendScore,
  platformLabels,
  riskLabels,
  trends,
  typeLabels,
} from "@/lib/trends";

export function generateStaticParams() {
  return trends.map((trend) => ({
    slug: trend.slug,
  }));
}

export default async function TrendDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trend = findTrendBySlug(slug);

  if (!trend) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f2933]">
      <section className="border-b border-[#d9d1c3] bg-[#fffdf8]">
        <div className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
          <Link href="/" className="text-sm font-semibold text-[#395f89]">
            ← Radar로 돌아가기
          </Link>
          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a34832]">
                {platformLabels[trend.platform]} · {typeLabels[trend.type]}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
                {trend.titleKr}
              </h1>
              <p className="mt-3 text-xl text-[#64707d]">{trend.titleCn}</p>
            </div>
            <div className="grid w-full grid-cols-3 gap-2 sm:w-[360px]">
              <DetailMetric label="Score" value={`${getTrendScore(trend)}`} />
              <DetailMetric label="Rank" value={`#${trend.rank}`} />
              <DetailMetric label="Risk" value={riskLabels[trend.riskLevel]} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1.4fr_0.8fr] lg:px-10">
        <div className="space-y-5">
          <InfoBlock title="요약">{trend.summaryKr}</InfoBlock>
          <InfoBlock title="왜 뜨는가">{trend.whyTrending}</InfoBlock>
          <InfoBlock title="사용 패턴">{trend.usagePattern}</InfoBlock>

          <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
            <h2 className="text-sm font-semibold text-[#1f2933]">콘텐츠 아이디어</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#64707d]">
              {trend.contentIdeas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
            <h2 className="text-sm font-semibold text-[#1f2933]">수집 정보</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Meta label="상승률" value={`+${Math.round(trend.growthRate * 100)}%`} />
              <Meta label="열도" value={trend.heat.toLocaleString("ko-KR")} />
              <Meta label="교차 플랫폼" value={`${trend.crossPlatformCount}개`} />
              <Meta label="최초 발견" value={trend.firstSeenAt} />
            </dl>
          </div>

          <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
            <h2 className="text-sm font-semibold text-[#1f2933]">태그</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {trend.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[#f1eadf] px-2 py-1 text-xs font-semibold text-[#6b5639]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <a
            href={trend.sourceUrl}
            className="block rounded-lg bg-[#1f2933] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#33404d]"
            target="_blank"
            rel="noreferrer"
          >
            원본 소스 열기
          </a>
        </aside>
      </section>
    </main>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f1eadf] px-3 py-3">
      <div className="text-xs font-semibold text-[#6b5639]">{label}</div>
      <div className="mt-1 text-xl font-semibold text-[#1f2933]">{value}</div>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
      <h2 className="text-sm font-semibold text-[#1f2933]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#64707d]">{children}</p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#64707d]">{label}</dt>
      <dd className="text-right font-semibold text-[#1f2933]">{value}</dd>
    </div>
  );
}
