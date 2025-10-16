-- Add optional slug + clicks columns
alter table public.products add column if not exists slug text;
alter table public.products add column if not exists clicks integer default 0;

-- Unique indexes to support upsert on url/slug
create unique index if not exists products_url_unique on public.products(url) where url is not null;
create unique index if not exists products_slug_unique on public.products(slug) where slug is not null;

