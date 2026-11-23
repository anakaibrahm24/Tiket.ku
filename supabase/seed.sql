-- Seed QA — 6 event (3 football, 3 concert) + 18 kategori tiket.
-- Jalankan setelah supabase/migrations/0001_init.sql di Supabase SQL Editor.
-- Aman dijalankan ulang: bentrok pada primary key diabaikan.

-- ----------------------------------------------------------------------------
-- Events
-- ----------------------------------------------------------------------------

insert into public.events (id, type, title, subtitle, event_date, event_time, time_zone, venue, description)
values
  ('11111111-1111-4111-8111-111111111111', 'football', 'Timnas Indonesia vs Jepang',
   'Kualifikasi Piala Asia', '2026-12-05', '19:00', 'WIB', 'Stadion Gelora Bung Karno',
   'Laga kandang Timnas Indonesia di GBK.'),
  ('11111111-1111-4111-8111-111111111112', 'football', 'Persija Jakarta vs Persib Bandung',
   'El Clasico Indonesia', '2026-12-12', '15:00', 'WIB', 'Stadion Gelora Bung Karno',
   'Duel klasik dua klub papan atas Liga 1.'),
  ('11111111-1111-4111-8111-111111111113', 'football', 'Indonesia vs Arab Saudi',
   'Kualifikasi Piala Dunia', '2026-12-19', '20:00', 'WIB', 'Stadion Gelora Bung Karno',
   'Laga penentuan grup Kualifikasi Piala Dunia.'),
  ('11111111-1111-4111-8111-111111111114', 'concert', 'Coldplay — Music of the Spheres',
   'World Tour Jakarta', '2026-12-22', '19:00', 'WIB', 'Stadion Gelora Bung Karno',
   'Konser dunia perdana Coldplay di Jakarta.'),
  ('11111111-1111-4111-8111-111111111115', 'concert', 'Taylor Swift — Eras Tour',
   'Jakarta Night', '2027-01-09', '19:00', 'WIB', 'Stadion Gelora Bung Karno',
   'Malam konser Eras Tour di GBK.'),
  ('11111111-1111-4111-8111-111111111116', 'concert', 'Konser Nusantara',
   'Gala Rock Indonesia', '2027-01-16', '20:00', 'WIB', 'Stadion Gelora Bung Karno',
   'Festival musik rock Nusantara.')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Ticket categories — 3 per event, sold = 0
-- ----------------------------------------------------------------------------

insert into public.ticket_categories (id, event_id, name, price, quota, sold)
values
  ('22222222-2222-4222-8222-000000000001', '11111111-1111-4111-8111-111111111111', 'VIP Barat', 250000, 100, 0),
  ('22222222-2222-4222-8222-000000000002', '11111111-1111-4111-8111-111111111111', 'VIP Timur', 200000, 200, 0),
  ('22222222-2222-4222-8222-000000000003', '11111111-1111-4111-8111-111111111111', 'Reguler', 100000, 500, 0),
  ('22222222-2222-4222-8222-000000000004', '11111111-1111-4111-8111-111111111112', 'VIP Barat', 250000, 100, 0),
  ('22222222-2222-4222-8222-000000000005', '11111111-1111-4111-8111-111111111112', 'VIP Timur', 200000, 200, 0),
  ('22222222-2222-4222-8222-000000000006', '11111111-1111-4111-8111-111111111112', 'Reguler', 100000, 500, 0),
  ('22222222-2222-4222-8222-000000000007', '11111111-1111-4111-8111-111111111113', 'VIP Barat', 250000, 100, 0),
  ('22222222-2222-4222-8222-000000000008', '11111111-1111-4111-8111-111111111113', 'VIP Timur', 200000, 200, 0),
  ('22222222-2222-4222-8222-000000000009', '11111111-1111-4111-8111-111111111113', 'Reguler', 100000, 500, 0),
  ('22222222-2222-4222-8222-000000000010', '11111111-1111-4111-8111-111111111114', 'VIP Barat', 250000, 100, 0),
  ('22222222-2222-4222-8222-000000000011', '11111111-1111-4111-8111-111111111114', 'VIP Timur', 200000, 200, 0),
  ('22222222-2222-4222-8222-000000000012', '11111111-1111-4111-8111-111111111114', 'Reguler', 100000, 500, 0),
  ('22222222-2222-4222-8222-000000000013', '11111111-1111-4111-8111-111111111115', 'VIP Barat', 250000, 100, 0),
  ('22222222-2222-4222-8222-000000000014', '11111111-1111-4111-8111-111111111115', 'VIP Timur', 200000, 200, 0),
  ('22222222-2222-4222-8222-000000000015', '11111111-1111-4111-8111-111111111115', 'Reguler', 100000, 500, 0),
  ('22222222-2222-4222-8222-000000000016', '11111111-1111-4111-8111-111111111116', 'VIP Barat', 250000, 100, 0),
  ('22222222-2222-4222-8222-000000000017', '11111111-1111-4111-8111-111111111116', 'VIP Timur', 200000, 200, 0),
  ('22222222-2222-4222-8222-000000000018', '11111111-1111-4111-8111-111111111116', 'Reguler', 100000, 500, 0)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Verifikasi (dijalankan manual di SQL Editor setelah seed diapply)
-- Expected: 2 baris; events = 3 per tipe; total_quota = 2400 per tipe.
-- ----------------------------------------------------------------------------
--
-- select e.type, count(*) as events, sum(c.quota) as total_quota
-- from public.events e join public.ticket_categories c on c.event_id = e.id
-- group by e.type order by e.type;
