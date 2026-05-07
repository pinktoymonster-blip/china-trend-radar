do $$
begin
  create type platform as enum ('douyin', 'xiaohongshu', 'weibo', 'bilibili', 'baidu');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type trend_type as enum ('meme', 'challenge', 'bgm', 'phrase', 'news', 'commerce');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type risk_level as enum ('low', 'medium', 'high');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.trends (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_title text,
  slug text unique not null,
  platform platform not null,
  type trend_type not null,
  lifecycle text not null default 'new',
  risk_level risk_level not null default 'medium',
  source_url text,
  tags text[] not null default '{}',
  summary text,
  signal text,
  spread_path text,
  operator_note text,
  sample_signals text[] not null default '{}',
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.trend_snapshots (
  id uuid primary key default gen_random_uuid(),
  trend_id uuid not null references public.trends(id) on delete cascade,
  platform platform not null,
  rank integer,
  heat_score numeric,
  growth_rate numeric,
  raw_payload jsonb not null default '{}',
  captured_at timestamptz not null default now()
);

create table if not exists public.collection_sources (
  source_id text primary key,
  platform platform not null,
  name text not null,
  interval_minutes integer not null default 30,
  enabled boolean not null default true,
  sort_order integer not null default 100,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.scoring_weights (
  weight_key text primary key,
  label text not null,
  weight_value integer not null default 0,
  note text not null default '',
  sort_order integer not null default 100,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.monitoring_categories (
  category_key text primary key,
  label text not null,
  enabled boolean not null default true,
  sort_order integer not null default 100,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.risk_rules (
  rule_key text primary key,
  label text not null,
  action text not null default 'downrank',
  enabled boolean not null default true,
  sort_order integer not null default 100,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.collection_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.collection_sources(source_id) on delete cascade,
  status text not null default 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  error_message text,
  raw_count integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.collection_sources
  (source_id, platform, name, interval_minutes, enabled, sort_order)
values
  ('douyin-hot', 'douyin', '抖音热点 / 话题 / BGM', 15, true, 1),
  ('xiaohongshu-keywords', 'xiaohongshu', '小红书关键词 / 热门笔记', 30, true, 2),
  ('weibo-hot', 'weibo', '微博热搜 / 话题榜', 15, true, 3),
  ('bilibili-ranking', 'bilibili', 'B站热门 / 排行 / 二创', 30, true, 4),
  ('baidu-index', 'baidu', '百度热搜 / 搜索指数', 60, false, 5)
on conflict (source_id) do update set
  platform = excluded.platform,
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.scoring_weights
  (weight_key, label, weight_value, note, sort_order)
values
  ('growth', '增长速度', 35, '最近 1 小时与 24 小时的热度变化', 1),
  ('heat', '当前热度', 25, '平台榜单排名、播放、搜索与讨论量', 2),
  ('cross', '跨平台扩散', 20, '同一主题在多个平台同时出现的强度', 3),
  ('novelty', '新鲜度', 10, '与历史趋势库的相似度越低，分数越高', 4),
  ('quality', '互动质量', 10, '评论、收藏、转发与二创的有效互动', 5)
on conflict (weight_key) do update set
  label = excluded.label,
  note = excluded.note,
  sort_order = excluded.sort_order;

insert into public.monitoring_categories
  (category_key, label, enabled, sort_order)
values
  ('meme', '热梗', true, 1),
  ('challenge', '挑战', true, 2),
  ('bgm', 'BGM', true, 3),
  ('phrase', '流行语', true, 4),
  ('commerce', '消费趋势', true, 5),
  ('ugc', '二创内容', true, 6)
on conflict (category_key) do update set
  label = excluded.label,
  sort_order = excluded.sort_order;

insert into public.risk_rules
  (rule_key, label, action, enabled, sort_order)
values
  ('political-sensitive', '政治敏感', 'downrank', true, 1),
  ('disaster', '灾难事故', 'review', true, 2),
  ('minor-dispute', '未成年人争议', 'review', true, 3),
  ('brand-negative', '品牌负面', 'downrank', true, 4)
on conflict (rule_key) do update set
  label = excluded.label,
  sort_order = excluded.sort_order;

create index if not exists trends_platform_idx on public.trends(platform);
create index if not exists trends_type_idx on public.trends(type);
create index if not exists trend_snapshots_trend_id_captured_at_idx
  on public.trend_snapshots(trend_id, captured_at desc);
create index if not exists collection_jobs_source_id_created_at_idx
  on public.collection_jobs(source_id, created_at desc);
