-- Split schema: this file now defines the lightweight import table: public.product_prices
-- It replaces the previous simple `public.products` definition.

create table if not exists public.product_prices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  image text,
  price numeric(12,2),
  currency text default 'USD' check (char_length(currency) = 3 and currency = upper(currency)),
  slug text,
  clicks integer default 0,
  created_at timestamptz not null default now()
);

-- Indexes for basic search/sort
create index if not exists product_prices_created_at_idx on public.product_prices(created_at desc);
create unique index if not exists product_prices_url_unique_idx on public.product_prices(url) where url is not null;
create unique index if not exists product_prices_slug_unique_idx on public.product_prices(slug) where slug is not null;

-- Enable RLS
alter table public.product_prices enable row level security;

-- Optional helper (kept for compatibility if needed elsewhere)
-- Helper to check if current auth user has confirmed email
create or replace function public.is_email_confirmed()
returns boolean
language sql
stable
security definer
set search_path = auth
as $$
  select coalesce(u.email_confirmed_at is not null, false)
  from users u
  where u.id = auth.uid();
$$;

grant execute on function public.is_email_confirmed() to anon, authenticated;

-- Policies for the import table
drop policy if exists "authenticated can select product_prices" on public.product_prices;
drop policy if exists "service role can insert product_prices" on public.product_prices;

create policy "authenticated can select product_prices"
  on public.product_prices
  for select
  to authenticated
  using (true);

create policy "service role can insert product_prices"
  on public.product_prices
  for insert
  using (auth.role() = 'service_role');
