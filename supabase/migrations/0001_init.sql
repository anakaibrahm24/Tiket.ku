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

-- ============================================================================
-- TASK 3 — RPC order dan pembayaran atomik (DDL migration)
-- ============================================================================

create or replace function public.create_order(
  p_event_id uuid,
  p_items jsonb,
  p_buyer_name text,
  p_buyer_email text,
  p_identity_number text,
  p_gender text
)
returns table (order_id uuid, total_amount integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_item jsonb;
  v_category_id uuid;
  v_qty integer;
  v_category_name text;
  v_price integer;
  v_quota integer;
  v_sold integer;
  v_seen uuid[] := array[]::uuid[];
  v_items jsonb := '[]'::jsonb;
  v_total integer := 0;
  v_order_id uuid;
begin
  if v_user_id is null then
    raise exception 'Silakan masuk untuk memesan tiket.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Minimal satu kategori tiket harus dipilih.';
  end if;

  for v_item in select e.value from jsonb_array_elements(p_items) as e(value)
  loop
    v_category_id := nullif(v_item ->> 'categoryId', '')::uuid;
    v_qty := nullif(v_item ->> 'qty', '')::integer;

    if v_category_id is null then
      raise exception 'Kategori tiket tidak valid.';
    end if;

    if v_qty is null or v_qty <= 0 then
      raise exception 'Jumlah tiket harus lebih dari nol.';
    end if;

    if v_category_id = any (v_seen) then
      raise exception 'Kategori tiket tidak boleh duplikat.';
    end if;
    v_seen := array_append(v_seen, v_category_id);

    select c.name, c.price, c.quota, c.sold
      into v_category_name, v_price, v_quota, v_sold
      from public.ticket_categories c
     where c.id = v_category_id
       and c.event_id = p_event_id
       for update;

    if not found then
      raise exception 'Kategori tiket tidak ditemukan untuk acara ini.';
    end if;

    if v_qty > v_quota - v_sold then
      raise exception 'Kuota tiket tidak mencukupi.';
    end if;

    v_total := v_total + (v_price * v_qty);
    v_items := v_items || jsonb_build_object(
      'categoryId', v_category_id,
      'categoryName', v_category_name,
      'qty', v_qty,
      'price', v_price
    );
  end loop;

  insert into public.orders (
    user_id, event_id, buyer_name, buyer_email, identity_number,
    gender, items, total_amount, status
  )
  values (
    v_user_id, p_event_id, p_buyer_name, p_buyer_email, p_identity_number,
    p_gender, v_items, v_total, 'pending'
  )
  returning id into v_order_id;

  return query select v_order_id, v_total;
end;
$$;

create or replace function public.complete_payment(
  p_order_id uuid,
  p_payment_method text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item jsonb;
  v_category_id uuid;
  v_qty integer;
  v_ticket_id uuid;
begin
  select o.*
    into v_order
    from public.orders o
   where o.id = p_order_id
     and o.user_id = auth.uid()
   for update;

  if not found then
    raise exception 'Pesanan tidak ditemukan.';
  end if;

  if v_order.status <> 'pending' then
    raise exception 'Pesanan sudah diproses.';
  end if;

  for v_item in select e.value from jsonb_array_elements(v_order.items) as e(value)
  loop
    v_category_id := (v_item ->> 'categoryId')::uuid;
    v_qty := (v_item ->> 'qty')::integer;

    update public.ticket_categories c
       set sold = c.sold + v_qty
     where c.id = v_category_id
       and c.sold + v_qty <= c.quota;

    if not found then
      raise exception 'Kuota tiket tidak mencukupi.';
    end if;
  end loop;

  v_ticket_id := gen_random_uuid();

  insert into public.tickets (order_id, qr_code)
  values (p_order_id, p_order_id::text || '|' || v_ticket_id::text);

  update public.orders o
     set status = 'paid',
         payment_method = p_payment_method
   where o.id = p_order_id;

  return v_ticket_id;
end;
$$;

revoke all on function public.create_order(uuid, jsonb, text, text, text, text) from public, anon;
revoke all on function public.complete_payment(uuid, text) from public, anon;

grant execute on function public.create_order(uuid, jsonb, text, text, text, text) to authenticated;
grant execute on function public.complete_payment(uuid, text) to authenticated;

-- ============================================================================
-- VERIFIKASI TASK 3 — dikomentari, jalankan manual di SQL Editor. Bukan DDL.
-- Owner yang menjalankan; agen TIDAK menjalankan SQL live.
-- Ganti placeholder: USER_ID, EVENT_ID, CATEGORY_ID, CATEGORY_RACE_ID, ORDER_A, ORDER_B.
-- ============================================================================

-- V3. Atribut fungsi (opsional, cepat).
-- Expected: 2 baris, prosecdef = true, proconfig = {search_path=public}.
--
-- select p.proname, p.prosecdef, p.proconfig
-- from pg_proc p
-- join pg_namespace n on n.oid = p.pronamespace
-- where n.nspname = 'public'
--   and p.proname in ('create_order', 'complete_payment')
-- order by p.proname;

-- V4. Harga dihitung server-side.
-- Siapkan CATEGORY_ID dengan price = 50000. Jalankan sebagai USER_ID:
-- set local role authenticated;
-- set local request.jwt.claim.sub = 'USER_ID';
--
-- select * from public.create_order(
--   'EVENT_ID'::uuid,
--   '[{"categoryId":"CATEGORY_ID","qty":2,"price":1}]'::jsonb,
--   'Nama Pembeli', 'pembeli@example.com', '1234567890', 'Laki-laki'
-- );
-- Expected: total_amount = 100000 (price 50000 diambil dari DB; price: 1 diabaikan).
-- reset role;

-- V5. Kuota atomik — VERIFIKASI SEQUENTIAL (dua panggilan berurutan, BUKAN paralel).
-- Controller mengizinkan sequential bila dua session paralel tidak tersedia.
-- Catat: agen tidak menjalankan ini; owner yang menjalankan di SQL Editor.
-- Siapkan CATEGORY_RACE_ID dengan quota = 1, sold = 0:
--
-- update public.ticket_categories set sold = 0 where id = 'CATEGORY_RACE_ID'::uuid;
--
-- Kedua order pending dibuat SEBELUM pembayaran (create_order mengunci kuota saat baca):
-- set local role authenticated;
-- set local request.jwt.claim.sub = 'USER_ID';
-- select * from public.create_order('EVENT_ID'::uuid,
--   '[{"categoryId":"CATEGORY_RACE_ID","qty":1}]'::jsonb,
--   'Pembeli A', 'a@example.com', '1111111111', 'Laki-laki');  -- catat → ORDER_A
-- select * from public.create_order('EVENT_ID'::uuid,
--   '[{"categoryId":"CATEGORY_RACE_ID","qty":1}]'::jsonb,
--   'Pembeli B', 'b@example.com', '2222222222', 'Perempuan');  -- catat → ORDER_B
--
-- select public.complete_payment('ORDER_A'::uuid, 'card');  -- Expected: sukses, return uuid tiket
-- select public.complete_payment('ORDER_B'::uuid, 'card');  -- Expected: error "Kuota tiket tidak mencukupi."
-- reset role;
--
-- select sold from public.ticket_categories where id = 'CATEGORY_RACE_ID'::uuid;
-- Expected: 1.
-- select id, status from public.orders
-- where id in ('ORDER_A'::uuid, 'ORDER_B'::uuid) order by id;
-- Expected: tepat satu 'paid', satu 'pending' (ORDER_B rollback).
-- select count(*) from public.tickets
-- where order_id in ('ORDER_A'::uuid, 'ORDER_B'::uuid);
-- Expected: 1.

-- V6. Idempotensi pembayaran (ulangi untuk ORDER_A yang sudah paid).
-- set local role authenticated;
-- set local request.jwt.claim.sub = 'USER_ID';
-- select public.complete_payment('ORDER_A'::uuid, 'card');
-- Expected: error "Pesanan sudah diproses." (status bukan 'pending').
-- reset role;
-- select count(*) from public.tickets where order_id = 'ORDER_A'::uuid;
-- Expected: 1 (dijamin juga oleh unique(order_id)).

-- V7. Duplikat kategori ditolak.
-- set local role authenticated;
-- set local request.jwt.claim.sub = 'USER_ID';
-- select * from public.create_order('EVENT_ID'::uuid,
--   '[{"categoryId":"CATEGORY_ID","qty":1},{"categoryId":"CATEGORY_ID","qty":1}]'::jsonb,
--   'Pembeli C', 'c@example.com', '3333333333', 'Laki-laki');
-- Expected: error "Kategori tiket tidak boleh duplikat."
-- reset role;
-- select count(*) from public.orders where user_id = 'USER_ID'::uuid;
-- Expected: tidak bertambah dibanding sebelum panggilan di atas.
