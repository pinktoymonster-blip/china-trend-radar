# China Trend Radar

중국 타겟 밈, 챌린지, BGM, 유행어, 소비 트렌드를 수집하고 큐레이션하는 웹 MVP입니다.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase-ready Postgres schema
- Vercel deployment target

## Local

```bash
npm install
npm run dev
```

로컬 개발 서버는 기본적으로 `http://localhost:3100`에서 실행됩니다.

## Verify

```bash
npm run lint
npm run build
```

## Vercel Setup

1. GitHub에 이 폴더를 `china-trend-radar` 같은 이름으로 push합니다.
2. Vercel 프로젝트에서 GitHub repo를 연결합니다.
3. Framework preset은 `Next.js`로 둡니다.
4. Build command는 기본값 `npm run build`를 사용합니다.
5. Output directory는 비워둡니다.
6. Environment Variables는 Supabase를 붙일 때 아래 값을 추가합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Supabase

Supabase 프로젝트를 만든 뒤 SQL Editor에서 `supabase/schema.sql`을 실행하면 됩니다.

설정 저장을 활성화하려면 Vercel Environment Variables에 아래 값을 추가합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.2
```

그 다음 Vercel에서 Redeploy하면 `/settings`의 수집 소스, 주기, 점수 가중치, 모니터링 범위, 리스크 규칙이 Supabase에 저장됩니다. `/trends/[slug]` 상세 페이지에서는 `生成分析` 버튼으로 OpenAI 분석을 실행하고 `trend_enrichments`에 저장합니다.

초기 트렌드 대시보드는 `src/lib/trends.ts`의 샘플 Top 100 데이터로 동작합니다. Supabase 설정 저장이 완료된 후에는 실제 수집 worker가 `trends`와 `trend_snapshots`에 데이터를 쌓도록 연결합니다.

## Next Steps

1. Supabase 프로젝트 생성
2. `supabase/schema.sql` 실행
3. Vercel Environment Variables에 Supabase 키 추가
4. Railway collector 서비스 생성
5. Weibo/Bilibili/Baidu 핫리스트 수집기 추가
6. 대시보드를 Supabase `trends` 데이터로 교체
