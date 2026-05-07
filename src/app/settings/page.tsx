import Link from "next/link";
import { platformLabels, scoringWeights, sourceSettings } from "@/lib/trends";

const excludedKeywords = ["政治敏感", "灾难事故", "未成年人争议", "品牌负面"];
const trackedCategories = ["热梗", "挑战", "BGM", "流行语", "消费趋势", "二创内容"];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f2933]">
      <header className="border-b border-[#d9d1c3] bg-[#fffdf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a34832]">
                Settings
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
                采集与评分设置
              </h1>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-lg border border-[#d9d1c3] px-4 py-2 text-sm font-semibold text-[#64707d] transition hover:bg-[#f1eadf]"
              >
                趋势
              </Link>
              <Link
                href="/settings"
                className="rounded-lg bg-[#1f2933] px-4 py-2 text-sm font-semibold text-white"
              >
                设置
              </Link>
            </div>
          </nav>
          <p className="max-w-3xl text-sm leading-7 text-[#64707d]">
            这里定义系统如何采集趋势、如何计算趋势评分，以及哪些内容需要降权或过滤。
            未来接入数据库后，每一次设置变化都会影响后续快照和模型判断。
          </p>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10">
        <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">采集来源</h2>
              <p className="mt-1 text-sm text-[#64707d]">控制平台、采集周期和启用状态。</p>
            </div>
            <span className="rounded-md bg-[#edf4ef] px-2 py-1 text-xs font-semibold text-[#2c6e49]">
              自动
            </span>
          </div>

          <div className="mt-5 divide-y divide-[#eee6dc]">
            {sourceSettings.map((source) => (
              <div key={source.name} className="grid gap-3 py-4 sm:grid-cols-[1fr_110px_86px] sm:items-center">
                <div>
                  <div className="font-semibold text-[#1f2933]">{source.name}</div>
                  <div className="mt-1 text-xs text-[#64707d]">
                    平台：{platformLabels[source.platform]}
                  </div>
                </div>
                <div className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-[#6b5639]">
                  {source.cadence}
                </div>
                <div
                  className={
                    source.enabled
                      ? "rounded-md bg-[#edf4ef] px-3 py-2 text-center text-sm font-semibold text-[#2c6e49]"
                      : "rounded-md bg-[#eee6dc] px-3 py-2 text-center text-sm font-semibold text-[#64707d]"
                  }
                >
                  {source.enabled ? "启用" : "暂停"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
          <h2 className="text-lg font-semibold">评分模型</h2>
          <p className="mt-1 text-sm text-[#64707d]">
            默认权重总和为 100。数据越多，新鲜度与历史相似度判断会越稳定。
          </p>

          <div className="mt-5 space-y-4">
            {scoringWeights.map((weight) => (
              <div key={weight.key}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-[#1f2933]">{weight.label}</span>
                  <span className="font-semibold text-[#a34832]">{weight.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#eee6dc]">
                  <div className="h-full rounded-full bg-[#a34832]" style={{ width: `${weight.value}%` }} />
                </div>
                <p className="mt-2 text-xs leading-5 text-[#64707d]">{weight.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
          <h2 className="text-lg font-semibold">监测范围</h2>
          <p className="mt-1 text-sm text-[#64707d]">决定哪些内容进入候选池。</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {trackedCategories.map((category) => (
              <span
                key={category}
                className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-[#6b5639]"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
          <h2 className="text-lg font-semibold">风险与降权规则</h2>
          <p className="mt-1 text-sm text-[#64707d]">命中规则的趋势不会直接删除，但会进入观察队列。</p>
          <div className="mt-5 space-y-3">
            {excludedKeywords.map((keyword) => (
              <div
                key={keyword}
                className="flex items-center justify-between rounded-lg border border-[#eee6dc] px-3 py-3 text-sm"
              >
                <span className="font-semibold text-[#1f2933]">{keyword}</span>
                <span className="rounded-md bg-[#fff1c2] px-2 py-1 text-xs font-semibold text-[#7a5b00]">
                  降权
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
