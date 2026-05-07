create type platform as enum ('douyin', 'xiaohongshu', 'weibo', 'bilibili', 'baidu');
create type trend_type as enum ('meme', 'challenge', 'bgm', 'phrase', 'news', 'commerce');
create type risk_level as enum ('low', 'medium', 'high');

create table public.trends (
  id uuid primary key default gen_random_uuid(),
  title_cn text not null,
  title_kr text,
  slug text unique not null,
  platform platform not null,
  type trend_type not null,
  risk_level risk_level not null default 'medium',
  source_url text,
  tags text[] not null default '{}',
  summary_kr text,
  why_trending text,
  usage_pattern text,
  content_ideas text[] not null default '{}',
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.trend_snapshots (
  id uuid primary key default gen_random_uuid(),
  trend_id uuid not null references public.trends(id) on delete cascade,
  platform platform not null,
  rank integer,
  heat_score numeric,
  growth_rate numeric,
  raw_payload jsonb not null default '{}',
  captured_at timestamptz not null default now()
);

create index trends_platform_idx on public.trends(platform);
create index trends_type_idx on public.trends(type);
create index trend_snapshots_trend_id_captured_at_idx
  on public.trend_snapshots(trend_id, captured_at desc);
