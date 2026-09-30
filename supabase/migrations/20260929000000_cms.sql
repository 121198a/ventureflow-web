-- VentureFlow first-party CMS. Authoritative store for page content, navigation and redirects.
-- Row Level Security is enabled with NO public policies: tables are reachable only through the
-- server-side CMS service (service-role key). Never expose that key to the browser.

create extension if not exists pgcrypto;

create table if not exists public.cms_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active','hidden'))
);

create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text,
  category text references public.cms_categories(slug) on update cascade on delete set null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  content jsonb not null default '[]'::jsonb,
  seo jsonb,
  sidebar jsonb,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
-- No duplicate active slugs (archived pages may keep a slug for history).
create unique index if not exists cms_pages_active_slug_key on public.cms_pages (slug) where status <> 'archived';
create index if not exists cms_pages_status_category_idx on public.cms_pages (status, category);

create table if not exists public.cms_page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.cms_pages(id) on delete cascade,
  version integer not null,
  content jsonb not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  created_by text not null,
  unique (page_id, version)
);

create table if not exists public.cms_navigation (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  slug text check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  href text not null check (href like '/%' and href not like '//%'),
  category text references public.cms_categories(slug) on update cascade on delete set null,
  parent_id uuid references public.cms_navigation(id) on delete cascade,
  sort_order integer not null default 0,
  visibility text not null default 'public' check (visibility in ('public','hidden')),
  status text not null default 'active' check (status in ('active','inactive'))
);
create unique index if not exists cms_navigation_href_key on public.cms_navigation (href);

create table if not exists public.cms_redirects (
  id uuid primary key default gen_random_uuid(),
  old_path text not null unique check (old_path like '/%' and old_path not like '//%'),
  new_path text not null check (new_path like '/%' and new_path not like '//%'),
  status_code integer not null default 301 check (status_code in (301,302,307,308)),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (old_path <> new_path)
);

create table if not exists public.cms_audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  actor_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists cms_audit_logs_entity_idx on public.cms_audit_logs (entity_type, entity_id, created_at desc);

alter table public.cms_categories enable row level security;
alter table public.cms_pages enable row level security;
alter table public.cms_page_versions enable row level security;
alter table public.cms_navigation enable row level security;
alter table public.cms_redirects enable row level security;
alter table public.cms_audit_logs enable row level security;
