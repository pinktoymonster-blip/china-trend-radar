export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 text-[#1f2933]">
      <section className="w-full max-w-md rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a34832]">
          China Trend Radar
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">访问验证</h1>
        <p className="mt-3 text-sm leading-7 text-[#64707d]">
          请输入访问密码后继续查看趋势监测台。
        </p>

        <form action="/api/login" method="post" className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="grid gap-2 text-sm font-semibold">
            密码
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="h-11 rounded-lg border border-[#d9d1c3] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#a34832]"
              placeholder="请输入密码"
            />
          </label>

          {params.error ? (
            <div className="rounded-lg bg-[#fff1c2] px-3 py-2 text-sm font-semibold text-[#7a5b00]">
              密码不正确，请再试一次。
            </div>
          ) : null}

          <button
            type="submit"
            className="h-11 rounded-lg bg-[#1f2933] px-5 text-sm font-semibold text-white transition hover:bg-[#33404d]"
          >
            进入
          </button>
        </form>
      </section>
    </main>
  );
}
