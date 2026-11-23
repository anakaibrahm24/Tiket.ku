-- Migration 0001 — skema inti Tiket.ku (MVP).
-- Jalankan seluruh isi bagian DDL di Supabase SQL Editor.
-- Bagian verifikasi di akhir sengaja dikomentari dan bukan bagian dari migration.

-- ----------------------------------------------------------------------------
-- Tabel
-- ----------------------------------------------------------------------------

create table public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('football', 'concert')),
  title text not null,
  subtitle text not null default '',
  event_date date not null,
  event_time text not null,
  time_zone text not null default 'WIB',
  venue text not null default 'Stadion Gelora Bung Karno',
  description text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);

create table public.ticket_categories (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  price integer not null check (price >= 0),
  quota integer not null check (quota >= 0),
  sold integer not null default 0 check (sold >= 0 and sold <= quota),
  unique (event_id, name)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  event_id uuid not null references public.events(id) on delete restrict,
  buyer_name text not null,
  buyer_email text not null,
  identity_number text not null check (identity_number ~ '^\d+$'),
  gender text not null check (gender in ('Laki-laki', 'Perempuan')),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  total_amount integer not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  payment_method text check (payment_method is null or payment_method in ('card', 'bank')),
  created_at timestamptz not null default now()
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  qr_code text not null,
  issued_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Index
-- ----------------------------------------------------------------------------

create index ticket_categories_event_id_idx on public.ticket_categories (event_id);
create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

alter table public.events enable row level security;
alter table public.ticket_categories enable row level security;
alter table public.orders enable row level security;
alter table public.tickets enable row level security;

create policy events_select_public on public.events
  for select using (true);

create policy ticket_categories_select_public on public.ticket_categories
  for select using (true);

create policy orders_select_owner on public.orders
  for select using (auth.uid() = user_id);

create policy tickets_select_owner on public.tickets
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Grant
-- ----------------------------------------------------------------------------

revoke all on public.orders, public.tickets from anon, authenticated;

grant select on public.events, public.ticket_categories to anon, authenticated;
grant select on public.orders, public.tickets to authenticated;

-- ============================================================================
-- VERIFIKASI — dikomentari, jalankan manual di SQL Editor. Bukan DDL migration.
-- ============================================================================

-- V1. Struktur dan policy.
-- Expected: 4 baris, masing-masing policies = 1.
--
-- select tablename, count(*) as policies
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('events','ticket_categories','orders','tickets')
-- group by tablename order by tablename;

-- V2. RLS cross-user. Ganti USER_A/USER_B dengan uid dari auth.users.
-- Siapkan satu order (dan tiketnya) milik USER_A sebagai postgres sebelum uji.
--
-- set local role authenticated;
-- set local request.jwt.claim.sub = 'USER_B';
-- select count(*) from public.orders;   -- Expected: 0
-- select count(*) from public.tickets;  -- Expected: 0
-- reset role;
--
-- set local role authenticated;
-- set local request.jwt.claim.sub = 'USER_A';
-- select count(*) from public.orders;   -- Expected: minimal 1
-- select count(*) from public.tickets;  -- Expected: minimal 1
-- reset role;
