import Link from "next/link";
import { SettingsDashboard } from "@/components/settings-dashboard";

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
            连接 Supabase 后，设置会真实保存到数据库。
          </p>
        </div>
      </header>

      <SettingsDashboard />
    </main>
  );
}
