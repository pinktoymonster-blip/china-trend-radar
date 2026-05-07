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

초기 MVP는 `src/lib/trends.ts`의 샘플 데이터로 동작합니다. Supabase 연결 후에는 이 파일을 DB fetch로 교체합니다.

## Next Steps

1. Supabase 프로젝트 생성
2. `supabase/schema.sql` 실행
3. 수동 등록 폼 구현
4. Railway collector 서비스 생성
5. Weibo/Bilibili/Baidu 핫리스트 수집기 추가
