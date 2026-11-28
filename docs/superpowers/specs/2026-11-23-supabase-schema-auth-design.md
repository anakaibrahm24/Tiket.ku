# Supabase Schema, Auth & Order Logic — Desain (MVP)

**Tanggal:** 2026-11-23  
**Status:** Disetujui untuk dibuatkan rencana implementasi

## Maksud

Siapkan backend Supabase untuk MVP Tiket.ku: skema database sesuai PRD §6.3, auth login/signup yang sudah ada di frontend, RLS, dan logika pemesanan yang mencegah oversell. Frontend auth sudah berjalan; yang belum ada adalah migration SQL, `.env.example`, tipe `matchesPayload` yang hilang, dan pemetaan tabel `matches` ke `events`.

## Tujuan

- Buat project Supabase aktif dengan `.env.local` dari `.env.example`; hanya anon key yang dipakai client.
- Simpan skema sebagai file migration SQL versi, diapply lewat Supabase SQL Editor.
- Buat tabel `events`, `ticket_categories`, `orders`, `tickets` sesuai PRD §6.3.
- Terapkan RLS: katalog public-read, `orders`/`tickets` owner-only, tanpa service role key di client.
- Hitung total harga dan potong kuota di server lewat fungsi PL/pgSQL atomik.
- Pastikan login/signup, session setelah refresh, dan logout bekerja sesuai US-03/US-08.
- Sediakan seed data untuk QA manual.

## Non-tujuan

- Admin dashboard CRUD acara.
- Payment gateway nyata (Midtrans/Xendit).
- Verifikasi QR di sisi server.
- Pemilihan kursi spesifik, multi-venue, i18n, notifikasi email.
- Tabel `profiles`; nama user diambil dari `auth.user_metadata.full_name`.
- Rename route `/matchs` menjadi `/events`.
- Implementasi ulang halaman order, payment, dan e-ticket yang masih berupa legacy/komentar.
- Commit tanpa persetujuan pengguna.

## Constraint

- Skema DB memakai snake_case sesuai PRD; TypeScript memakai camelCase dan dipetakan eksplisit di service layer.
- Nama baru pakai `eventId`/`orderId`, bukan `matchId`/`userId` untuk order.
- TypeScript strict: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Tanpa `any` atau `@ts-ignore`.
- Akses Supabase hanya lewat service layer yang memanggil `src/lib/supabase.ts`.
- Teks UI dan dokumentasi `.md` Bahasa Indonesia.
- Error via `Alerts` atau inline field error, bukan `alert()`.
- Loading state: tombol submit dinonaktifkan dan spinner aktif.
- Test otomatis belum dikonfigurasi. Verifikasi memakai SQL assertion, `npm run lint`, `npm run build`, dan manual QA.
- Branch baru per progress, tidak commit langsung ke `main`/`master`.

## Pendekatan

1. **File migration SQL + Supabase SQL Editor (dipilih):** satu `supabase/migrations/0001_init.sql` berisi tabel, constraint, index, RLS, dan RPC. Ringan, cocok untuk MVP satu environment, dan memenuhi PRD §7.1 soal migration versioned.
2. Supabase CLI + local dev: `supabase init`, `supabase start`, `supabase db push`. Reproducible, tapi butuh Docker dan CLI login; terlalu berat untuk MVP.
3. Buat tabel lewat Dashboard saja: paling cepat, tapi skema tidak versioned dan bertentangan dengan PRD §7.1. Ditolak.

## Keputusan desain

- Skema mengikuti PRD §6.3, bukan tabel `matches` yang dipakai kode saat ini.
- `events` dan `ticket_categories`: public read, tanpa write dari client.
- `orders` dan `tickets`: owner-only read via RLS; write hanya lewat fungsi `security definer`.
- Satu baris `tickets` per `order`; QR payload = `orderId|ticketId`.
- Kuota dipotong saat `complete_payment`, bukan saat order dibuat. Order `pending` yang ditinggalkan tidak mengunci kuota.
- `create_order` menghitung ulang `total_amount` dari `ticket_categories.price`, bukan dari input client.
- Google OAuth dipertahankan karena sudah diimplementasikan; tidak butuh tabel tambahan.
- Email confirmation dimatikan agar signup langsung mendapat session (US-03). Pengaturan ini wajib dinyalakan sebelum produksi.
- Route `/matchs` dipertahankan dulu; `matchService` menjadi adapter sementara dari `events` ke `MatchPayload`. Rename route masuk progress terpisah.
- `ponytail:` adapter `matchService` sengaja dangkal agar UI lama tetap kompil; hapus saat halaman jadwal didesain ulang memakai `EventRecord`.

## Peta file target

```text
supabase/
├─ migrations/
│  └─ 0001_init.sql          # tabel, constraint, index, RLS, RPC
└─ seed.sql                  # 6 event + 18 kategori untuk QA

.env.example

src/
├─ lib/supabase.ts           # validasi env saat module load
├─ hooks/useSession.ts       # ekspos session & user
├─ components/               # tidak diubah
├─ features/
│  ├─ auth/
│  │  ├─ service/authService.ts        # requireUserId, mapping error
│  │  └─ page/                         # redirect target setelah auth
│  ├─ events/
│  │  ├─ types/event.types.ts
│  │  └─ service/eventService.ts
│  ├─ orders/
│  │  └─ service/orderService.ts
│  ├─ tickets/
│  │  └─ service/ticketService.ts
│  └─ matches/
│     ├─ types/matchesPayload.ts
│     ├─ types/matchesPayload.types.ts
│     ├─ components/matchesProps.ts
│     ├─ components/Card.tsx
│     ├─ hooks/useMatchData.ts
│     └─ service/matchService.ts       # adapter sementara
```

## Verifikasi

- SQL assertion: policy RLS, cross-user read, harga dihitung server-side, race condition kuota, pembayaran diulang, duplikat kategori.
- Auth manual: signup → session langsung ada; refresh tetap login; logout menghapus session; error kredensial invalid dan email duplikat sesuai pesan PRD.
- Gate wajib: `npm run lint` dan `npm run build` harus lulus.
- QA alur backend: `create_order` → `complete_payment` → `tickets.qr_code` → `ticket_categories.sold` → `orders.status = paid`.
