# Supabase Schema, Auth & Order Logic — Rencana Implementasi

> **Untuk pekerja agen:** SUB-SKILL WAJIB: Gunakan `superpowers:subagent-driven-development` (direkomendasikan) atau `superpowers:executing-plans` untuk mengerjakan rencana ini task-per-task. Langkah memakai sintaks checkbox (`- [ ]`) untuk tracking.

**Tujuan:** Siapkan backend Supabase untuk MVP Tiket.ku: skema `events`/`ticket_categories`/`orders`/`tickets`, RLS, RPC order + pembayaran atomik, auth email/password + Google, dan service layer TypeScript yang memakai skema tersebut.

**Arsitektur:** SPA React memanggil Supabase client dari `src/lib/supabase.ts`. Data katalog dibaca langsung dengan RLS public-read. Semua tulisan ke `orders`/`tickets` dan pemotongan kuota dilakukan di fungsi PL/pgSQL `security definer` agar total dan kuota dihitung server-side. Kolom DB snake_case sesuai PRD; service layer memetakan ke tipe camelCase.

**Tech Stack:** Supabase Postgres + Auth + PostgREST, `@supabase/supabase-js` 2.x, TypeScript strict, React 19, React Router 7, Zod, React Hook Form.

**Spesifikasi:** `docs/superpowers/specs/2026-11-23-supabase-schema-auth-design.md`

## Keputusan desain (disetujui)

- Skema mengikuti PRD §6.3, bukan tabel `matches` yang sekarang dipakai kode.
- Migration versioned sebagai file SQL, diapply lewat Supabase SQL Editor.
- Kolom DB snake_case; tipe TypeScript camelCase; mapping eksplisit di service layer.
- `events`/`ticket_categories`: public read, tidak ada write dari client.
- `orders`/`tickets`: owner-only read; write hanya lewat RPC.
- Satu baris `tickets` per `order`; QR payload = `orderId|ticketId`.
- Kuota dipotong saat `complete_payment`, bukan saat order dibuat. Order `pending` yang ditinggalkan tidak mengunci kuota.
- Google OAuth dipertahankan (kode sudah ada). Email confirmation dimatikan agar signup langsung dapat session.
- Tanpa tabel `profiles`; nama user dari `auth.user_metadata.full_name`.
- Route `/matchs` dipertahankan dulu. Rename ke `/events` bukan scope plan ini.
- Tidak ada pengiriman notifikasi email, gateway nyata, verifikasi QR, seat-level, atau admin UI.

## Global Constraints

- Node.js v20+, npm, lockfile `package-lock.json` — jangan perkenalkan pnpm/yarn (`AGENTS.md`).
- TypeScript `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` — jangan dinonaktifkan, jangan pakai `any`/`@ts-ignore`.
- Semua teks UI dan dokumentasi `.md` dalam Bahasa Indonesia.
- Nama baru pakai `eventId`/`orderId`, bukan `matchId`/`userId` untuk order.
- Akses Supabase hanya lewat service layer yang memanggil `src/lib/supabase.ts`.
- `.env.local` dan service role key tidak pernah di-commit atau dipakai di client.
- Error handling via komponen `Alerts` atau inline field error, bukan `alert()`.
- Tombol async dinonaktifkan dan menampilkan spinner saat proses berjalan.
- **Commit hanya setelah pengguna menyetujui.** Plan ini sengaja tidak memuat perintah `git commit`.
- Test otomatis belum dikonfigurasi. Verifikasi pakai SQL assertion di SQL Editor + QA manual + `npm run lint` + `npm run build`.

## Review Focus

Delapan kondisi yang paling mungkin bocor atau salah, beserta task pemiliknya:

1. **Env var hilang** → aplikasi harus gagal dengan pesan jelas, bukan `undefined` client. Diuji Task 1 lewat dev server tanpa `.env.local`.
2. **RLS cross-user** → user A tidak boleh melihat `orders`/`tickets` user B. Diuji Task 2 dengan `set local role authenticated` + dua JWT berbeda.
3. **Client mengirim harga palsu** → `total_amount` harus dihitung ulang dari `ticket_categories.price`. Diuji Task 3 dengan `create_order` memakai price buatan.
4. **Race condition kuota** → dua `complete_payment` bersamaan pada kuota sisa 1 harus menghasilkan satu sukses, satu error, `sold = 1`. Diuji Task 3.
5. **Duplicate category dalam `items`** → tidak boleh ada dua line item untuk kategori yang sama. Diuji Task 3.
6. **Pembayaran diulang** → order `paid` tidak boleh diproses lagi dan tidak boleh membuat tiket kedua. Diuji Task 3 lewat constraint `unique(tickets.order_id)` + pengecekan status.
7. **Sesi hilang setelah refresh** → `useSession` harus tetap login setelah reload, dan logout menghapus sesi. Diuji Task 5.
8. **Build rusak karena file tipe hilang** → `npm run build` harus hijau setelah Task 6.

---

## File Structure

| File | Peran |
|---|---|
| `supabase/migrations/0001_init.sql` (create) | Tabel, constraint, index, RLS, fungsi `create_order` & `complete_payment`, grant. |
| `supabase/seed.sql` (create) | 6 event contoh (3 football, 3 concert) + 3 kategori per event untuk QA. |
| `.env.example` (create) | Template `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`. |
| `README.md` (modify) | Cara isi `.env.local`, apply migration & seed, matikan email confirmation, alur QA. |
| `src/lib/supabase.ts` (modify) | Validasi env saat module load; errorMessage Bahasa Indonesia. |
| `src/features/auth/service/authService.ts` (modify) | `requireUserId()`, mapping error tambahan, `signUpWithEmail` sudah ada. |
| `src/hooks/useSession.ts` (modify) | Ekspos `session` dan `user` selain `isLoggedIn`/`isLoading`. |
| `src/features/auth/page/LoginPage.tsx`, `SignupPage.tsx`, `AuthCallbackPage.tsx` (modify) | Redirect ke `location.state.from` atau `/matchs` setelah auth sukses. |
| `src/features/events/types/event.types.ts` (create) | `EventType`, `EventCategoryRecord`, `EventRecord`, `OrderItemInput`, `BuyerInput`, `OrderTicket`. |
| `src/features/events/service/eventService.ts` (create) | `getEvents`, `getEventById`; mapping snake_case → camelCase. |
| `src/features/orders/service/orderService.ts` (create) | `createOrder`, `completePayment`; wrapper `supabase.rpc`. |
| `src/features/tickets/service/ticketService.ts` (create) | `getTicketByOrderId`. |
| `src/features/matches/types/matchesPayload.ts` (create) | `MatchPayload` untuk memperbaiki import yang hilang. |
| `src/features/matches/types/matchesPayload.types.ts` (create) | `TeamPayload`. |
| `src/features/matches/components/matchesProps.ts` (create) | `MatchCardProps`. |
| `src/features/matches/components/Card.tsx` (modify) | Hapus alias lokal `MatchCardProps` yang duplikat dengan import. |
| `src/features/matches/hooks/useMatchData.ts` (modify) | Perbaiki path import tipe; tambah `loading`/`error`. |
| `src/features/matches/service/matchService.ts` (modify) | `getMatches()` jadi adapter dari `getEvents()` ke `MatchPayload[]`. |

---

## Task 1 — Branch, env contract, dan client Supabase

**Files:**
- Modify: `src/lib/supabase.ts`
- Create: `.env.example`
- Modify: `README.md`

**Interfaces:**
- Produces: `supabase` (existing named export) yang dijamin punya URL dan anon key valid saat module dimuat.
- Produces: dua env var yang terdokumentasi di `.env.example` dan `README.md`.

- [ ] **Step 1: Buat branch kerja**

Jalankan dari branch saat ini:

```bash
git switch -c feat/supabase-schema-auth
```

Expected: branch baru aktif, tidak ada perubahan commit.

- [ ] **Step 2: Tulis `.env.example`**

Isi persis dua baris:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Tidak boleh ada `SUPABASE_SERVICE_ROLE_KEY`.

- [ ] **Step 3: Validasi env di `src/lib/supabase.ts`**

Ubah agar membaca `import.meta.env.VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`, lalu `throw new Error("Supabase URL dan publishable key wajib diisi. Salin .env.example ke .env.local.")` jika salah satu kosong. Pertahankan `createClient(...)` dengan publishable key.

- [ ] **Step 4: Dokumentasikan setup di `README.md`**

Tambah bagian singkat: salin `.env.example` → `.env.local`, isi dari Supabase Dashboard → Project Settings → API, jalankan `npm run dev`, dan jangan commit `.env.local`.

- [ ] **Step 5: Verifikasi env guard**

Sementara `.env.local` tidak ada, jalankan `npm run dev`. Expected: browser menampilkan error message dari Step 3, bukan client Supabase dengan URL `undefined`. Kembalikan `.env.local` setelah verifikasi.

- [ ] **Step 6: Verifikasi lint/build**

Run: `npm run lint && npm run build`
Expected: PASS.

---

## Task 2 — Migration inti: tabel, constraint, index, RLS

**Files:**
- Create: `supabase/migrations/0001_init.sql`

**Interfaces:**
- Produces: tabel `public.events`, `public.ticket_categories`, `public.orders`, `public.tickets` dengan kolom sesuai PRD §6.3.
- Produces: policy RLS: `events`/`ticket_categories` select public; `orders` select owner; `tickets` select lewat order owner.
- Consumes: `auth.users(id)` dari Supabase Auth.

- [ ] **Step 1: Tulis DDL di `supabase/migrations/0001_init.sql`**

Buat keempat tabel persis dengan kolom berikut:

- `events`: `id uuid pk default gen_random_uuid()`, `type text not null check in ('football','concert')`, `title text not null`, `subtitle text not null default ''`, `event_date date not null`, `event_time text not null`, `time_zone text not null default 'WIB'`, `venue text not null default 'Stadion Gelora Bung Karno'`, `description text not null default ''`, `image_url text`, `created_at timestamptz not null default now()`.
- `ticket_categories`: `id uuid pk default gen_random_uuid()`, `event_id uuid not null references events(id) on delete cascade`, `name text not null`, `price integer not null check (price >= 0)`, `quota integer not null check (quota >= 0)`, `sold integer not null default 0 check (sold >= 0 and sold <= quota)`, `unique (event_id, name)`.
- `orders`: `id uuid pk default gen_random_uuid()`, `user_id uuid not null references auth.users(id) on delete restrict`, `event_id uuid not null references events(id) on delete restrict`, `buyer_name text not null`, `buyer_email text not null`, `identity_number text not null check (identity_number ~ '^\d+$')`, `gender text not null check in ('Laki-laki','Perempuan')`, `items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0)`, `total_amount integer not null check (total_amount >= 0)`, `status text not null default 'pending' check in ('pending','paid','cancelled')`, `payment_method text check (payment_method is null or payment_method in ('card','bank'))`, `created_at timestamptz not null default now()`.
- `tickets`: `id uuid pk default gen_random_uuid()`, `order_id uuid not null unique references orders(id) on delete cascade`, `qr_code text not null`, `issued_at timestamptz not null default now()`.

Tambah index: `ticket_categories(event_id)`, `orders(user_id, created_at desc)`.

- [ ] **Step 2: Aktifkan RLS dan tulis policy**

Jalankan `alter table ... enable row level security` untuk keempat tabel. Tulis policy:

- `events_select_public`: `for select using (true)`.
- `ticket_categories_select_public`: `for select using (true)`.
- `orders_select_owner`: `for select using (auth.uid() = user_id)`.
- `tickets_select_owner`: `for select using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()))`.

Tidak boleh ada policy `insert`/`update`/`delete` untuk `anon` maupun `authenticated` pada keempat tabel.

- [ ] **Step 3: Atur grant**

`grant select on events, ticket_categories to anon, authenticated;` dan `grant select on orders, tickets to authenticated;`. `revoke all on orders, tickets from anon, authenticated;` sebelum grant select.

- [ ] **Step 4: Apply migration**

Copy seluruh isi file ke Supabase Dashboard → SQL Editor → New query → Run. Expected: sukses tanpa error.

- [ ] **Step 5: Verifikasi struktur dan policy**

Jalankan di SQL Editor:

```sql
select tablename, count(*) as policies
from pg_policies
where schemaname = 'public'
  and tablename in ('events','ticket_categories','orders','tickets')
group by tablename order by tablename;
```

Expected: 4 baris, masing-masing `policies = 1`.

- [ ] **Step 6: Verifikasi RLS cross-user**

Dengan dua user uid from `auth.users` (`USER_A`, `USER_B`), insert satu order milik `USER_A` lewat SQL Editor (sebagai postgres), lalu:

```sql
set local role authenticated;
set local request.jwt.claim.sub = 'USER_B';
select count(*) from public.orders;
reset role;
```

Expected: `0`. Ulangi untuk `public.tickets`. Kembalikan `select count(*)` dengan `USER_A` → minimal `1`.

---

## Task 3 — RPC order dan pembayaran atomik

**Files:**
- Modify: `supabase/migrations/0001_init.sql` (append setelah Task 2)

**Interfaces:**
- Produces: `public.create_order(p_event_id uuid, p_items jsonb, p_buyer_name text, p_buyer_email text, p_identity_number text, p_gender text) returns table (order_id uuid, total_amount integer)`, `security definer`, `set search_path = public`, `grant execute to authenticated`.
- Produces: `public.complete_payment(p_order_id uuid, p_payment_method text) returns uuid`, `security definer`, `set search_path = public`, `grant execute to authenticated`.
- Consumes: tabel dari Task 2.

- [ ] **Step 1: Implementasi `create_order`**

Tulis fungsi dengan logika: tolak jika `auth.uid() is null`; pastikan `p_items` array tidak kosong; untuk tiap elemen `{ "categoryId": uuid, "qty": integer }`, tolak `qty <= 0`, tolak duplikat `categoryId`, ambil baris `ticket_categories` dengan `for update` yang `event_id = p_event_id` (error jika tidak ada), tolak jika `qty > quota - sold`; hitung `total_amount` dari `price` DB, bukan dari input; bangun snapshot `items` berisi `categoryId`, `categoryName`, `qty`, `price`; insert `orders` dengan `user_id = auth.uid()` dan status `pending`; return `order_id`, `total_amount`.

- [ ] **Step 2: Implementasi `complete_payment`**

Tulis fungsi dengan logika: `select ... for update` order yang `id = p_order_id` dan `user_id = auth.uid()` (error jika tidak ada); tolak jika `status <> 'pending'`; untuk tiap item di `orders.items`, jalankan `update ticket_categories set sold = sold + qty where id = categoryId and sold + qty <= quota` dan `raise exception 'Kuota tiket tidak mencukupi.'` jika `not found`; buat `v_ticket_id := gen_random_uuid()`, insert `tickets(order_id, qr_code)` dengan `qr_code = p_order_id::text || '|' || v_ticket_id::text`; update order `status = 'paid'`, `payment_method = p_payment_method`; return `v_ticket_id`.

- [ ] **Step 3: Terapkan ulang migration**

Jalankan ulang SQL Editor dengan versi file yang sudah berisi Task 2 + Task 3. Expected: sukses.

- [ ] **Step 4: Verifikasi harga dihitung server-side**

Buat order memakai kategori harga `50000`, qty `2`, tapi kirim `price: 1` di `p_items`. Expected: `total_amount = 100000`.

- [ ] **Step 5: Verifikasi kuota atomik**

Siapkan kategori `quota = 1, sold = 0`, buat dua order `pending` berbeda untuk kategori itu, lalu panggil `complete_payment` untuk keduanya (boleh dari dua session SQL Editor paralel). Expected: satu sukses, satu error `Kuota tiket tidak mencukupi.`; `select sold` = `1`; hanya satu order berstatus `paid`; hanya satu baris `tickets`.

- [ ] **Step 6: Verifikasi idempotensi pembayaran**

Panggil `complete_payment` lagi untuk order yang sudah `paid`. Expected: error karena status bukan `pending`; jumlah `tickets` untuk order itu tetap `1` (dijamin juga oleh `unique(order_id)`).

- [ ] **Step 7: Verifikasi duplikat kategori ditolak**

Panggil `create_order` dengan dua item `categoryId` sama. Expected: error, tidak ada baris `orders` baru.

---

## Task 4 — Seed data QA

**Files:**
- Create: `supabase/seed.sql`

**Interfaces:**
- Produces: 6 baris `events` dan 18 baris `ticket_categories` dengan UUID deterministik untuk QA.
- Consumes: tabel dari Task 2.

- [ ] **Step 1: Tulis seed**

Buat 3 event `football` dan 3 event `concert` dengan UUID tetap `11111111-1111-4111-8111-111111111111` sampai `...116`, tanggal di masa depan, `venue = 'Stadion Gelora Bung Karno'`. Untuk tiap event, buat kategori `VIP Barat` (price 250000, quota 100), `VIP Timur` (price 200000, quota 200), `Reguler` (price 100000, quota 500), semua `sold = 0`. UUID kategori deterministik `22222222-2222-4222-8222-...` dengan akhir unik.

- [ ] **Step 2: Apply seed**

Jalankan `supabase/seed.sql` di SQL Editor. Expected: sukses, dapat dijalankan ulang tanpa duplikat (pakai `on conflict (id) do nothing`).

- [ ] **Step 3: Verifikasi seed**

```sql
select e.type, count(*) as events, sum(c.quota) as total_quota
from public.events e join public.ticket_categories c on c.event_id = e.id
group by e.type order by e.type;
```

Expected: 2 baris, `events = 3` per tipe, `total_quota = 2400` per tipe.

---

## Task 5 — Auth: konfigurasi, session, redirect

**Files:**
- Modify: `src/features/auth/service/authService.ts`
- Modify: `src/hooks/useSession.ts`
- Modify: `src/features/auth/page/LoginPage.tsx`
- Modify: `src/features/auth/page/SignupPage.tsx`
- Modify: `src/features/auth/page/AuthCallbackPage.tsx`
- Modify: `README.md`

**Interfaces:**
- Produces: `requireUserId(): Promise<string>` dari `authService`; throw `Error("Silakan masuk untuk memesan tiket.")` jika tidak ada session.
- Produces: `useSession()` → `{ isLoggedIn, isLoading, session, user }`.
- Consumes: `supabase` dari Task 1.

- [ ] **Step 1: Matikan email confirmation**

Di Supabase Dashboard → Authentication → Providers → Email, matikan "Confirm email". Tambah catatan di `README.md` bahwa pengaturan ini untuk MVP dan harus dinyalakan sebelum produksi. Ayakan URL `http://localhost:5173/auth/callback` tetap terdaftar di URL Configuration.

- [ ] **Step 2: Tambah `requireUserId`**

Di `authService.ts`, ekspor `export const requireUserId = async (): Promise<string> => { ... }`. Panggil `supabase.auth.getUser()`, throw pesan di atas jika `error` atau `!data.user`, else return `data.user.id`.

- [ ] **Step 3: Perluas mapping error**

Tambah mapping `mapAuthError` untuk: `"Weak password"` → `"Kata sandi terlalu lemah."`, `"Email not confirmed"` → `"Email belum diverifikasi. Cek inbox Anda."` (sudah ada, pastikan tetap), dan fallback network gagal → `"Koneksi ke server gagal. Coba lagi."`. Pertahankan mapping `"Invalid login credentials"` → `"Email atau password salah."` dan `"User already registered"` → `"Email ini sudah terdaftar."`.

- [ ] **Step 4: Ekspos session/user di `useSession`**

Ubah state menjadi `{ session: Session | null, isLoading: boolean }` dan return `isLoggedIn = !!session`, `user = session?.user ?? null`. Pertahankan `onAuthStateChange` subscription dan cleanup yang sudah ada.

- [ ] **Step 5: Redirect balik setelah login/signup**

Di ketiga halaman auth, ambil `location.state?.from` (bertipe `string | undefined`), default `/matchs`, dan pakai sebagai target `navigate` setelah sukses. `AuthCallbackPage` memakai target yang sama.

- [ ] **Step 6: Verifikasi auth manual**

Dengan email confirmation mati: signup user baru → langsung masuk dan navbar berubah; refresh halaman → tetap login; logout → session hilang; login dengan password salah → alert `"Email atau password salah."`; signup email yang sudah ada → alert `"Email ini sudah terdaftar."`.

- [ ] **Step 7: Verifikasi lint/build**

Run: `npm run lint && npm run build`
Expected: PASS.

---

## Task 6 — Tipe dan service layer

**Files:**
- Create: `src/features/events/types/event.types.ts`
- Create: `src/features/events/service/eventService.ts`
- Create: `src/features/orders/service/orderService.ts`
- Create: `src/features/tickets/service/ticketService.ts`
- Create: `src/features/matches/types/matchesPayload.ts`
- Create: `src/features/matches/types/matchesPayload.types.ts`
- Create: `src/features/matches/components/matchesProps.ts`
- Modify: `src/features/matches/components/Card.tsx`
- Modify: `src/features/matches/hooks/useMatchData.ts`
- Modify: `src/features/matches/service/matchService.ts`

**Interfaces:**
- Consumes: `supabase` (Task 1), `requireUserId` (Task 5), tabel/RPC (Task 2–3).
- Produces persis:

```ts
type EventType = "football" | "concert";
interface EventCategoryRecord {
  id: string; eventId: string; name: string;
  price: number; quota: number; sold: number; remaining: number;
}
interface EventRecord {
  id: string; type: EventType; title: string; subtitle: string;
  eventDate: string; eventTime: string; timeZone: string;
  venue: string; description: string; imageUrl: string | null;
  createdAt: string; categories: EventCategoryRecord[];
}
interface OrderItemInput { categoryId: string; qty: number; }
interface BuyerInput {
  fullName: string; email: string;
  identityNumber: string; gender: "Laki-laki" | "Perempuan";
}
interface OrderTicket {
  id: string; orderId: string; qrCode: string; issuedAt: string;
}

getEvents(type?: EventType): Promise<EventRecord[]>
getEventById(eventId: string): Promise<EventRecord | null>
createOrder(input: {
  eventId: string; items: OrderItemInput[]; buyer: BuyerInput;
}): Promise<{ orderId: string; totalAmount: number }>
completePayment(input: {
  orderId: string; method: "card" | "bank";
}): Promise<{ ticketId: string }>
getTicketByOrderId(orderId: string): Promise<OrderTicket | null>
getMatches(): Promise<MatchPayload[]>
```

- [ ] **Step 1: Tulis tipe di `event.types.ts`**

Definisikan persis interface di atas. `remaining = quota - sold` hanya ada di tipe TS, bukan kolom DB.

- [ ] **Step 2: Implementasi `eventService.ts`**

`getEvents(type?)` query `events` dengan nested `ticket_categories(*)`, filter `event_date >= hari ini` dan opsional `type`, order by `event_date, event_time`, lalu map `event_date → eventDate`, `event_time → eventTime`, `time_zone → timeZone`, `image_url → imageUrl`, `created_at → createdAt`, `event_id → eventId`, dan hitung `remaining`. `getEventById(eventId)` memakai query yang sama + `.eq("id", eventId).single()`, return `null` jika `error.code === "PGRST116"`, throw error lain.

- [ ] **Step 3: Implementasi `orderService.ts`**

`createOrder` memanggil `requireUserId()` lalu `supabase.rpc("create_order", { p_event_id, p_items: items.map(({categoryId, qty}) => ({categoryId, qty})), p_buyer_name, p_buyer_email, p_identity_number, p_gender })`. `completePayment` memanggil `supabase.rpc("complete_payment", { p_order_id, p_payment_method: method })`. Keduanya melempar `error` mentah agar pemanggil bisa menampilkan pesan. `getTicketByOrderId` di `ticketService.ts` query `tickets` dengan `.eq("order_id", orderId).single()`, map camelCase, return `null` untuk `PGRST116`.

- [ ] **Step 4: Perbaiki file tipe yang hilang**

`matchesPayload.ts`: `MatchPayload` berisi `id`, `matchId`, `team_home`, `team_away` (keduanya `TeamPayload`), `match_time`, `time_zone`, `match_date`, `stadium`, `tickets: Record<string, { price: number; quota: number }>`. `matchesPayload.types.ts`: `TeamPayload { name: string; logo: string }`. `matchesProps.ts`: `MatchCardProps { onClick?: () => void }`.

- [ ] **Step 5: Perbaiki `Card.tsx`, hook, dan adapter**

Hapus `type MatchCardProps = ...` lokal di `Card.tsx` karena sudah diimpor dari `matchesProps`. Di `useMatchData.ts`, perbaiki import menjadi `MatchPayload` dari `../types/matchesPayload` dan tambah state `loading`/`error` dengan `try/catch/finally`. Di `matchService.ts`, ganti `getMatches()` menjadi adapter: panggil `getEvents()`, petakan tiap `EventRecord` ke `MatchPayload` dengan `matchId = event.id`, `team_home = { name: event.title, logo: event.imageUrl ?? "" }`, `team_away = { name: event.subtitle || event.title, logo: event.imageUrl ?? "" }`, `match_time = event.eventTime`, `time_zone = event.timeZone`, `match_date = event.eventDate`, `stadium = event.venue`, `tickets` dari `categories` (key `name`, value `{ price, quota }`). Hapus `console.log` yang ada.

> `ponytail:` adapter ini sengaja dangkal agar UI lama tetap kompil. Upgrade path: ganti komponen `matches` ke `EventRecord` asli saat halaman jadwal didesain ulang; hapus adapter saat itu.

- [ ] **Step 6: Verifikasi service lewat SQL Editor + dev server**

Apply seed (Task 4), buka `/matchs` di browser. Expected: kartu acara muncul dari tabel `events`, `loading` tampil saat fetch, tidak ada error di console, tidak ada `console.log` data mentah.

- [ ] **Step 7: Verifikasi lint/build**

Run: `npm run lint && npm run build`
Expected: PASS dengan 0 error TypeScript.

---

## Task 7 — Verifikasi akhir dan serah terima

**Files:** none

**Interfaces:**
- Consumes: semua task di atas.

- [ ] **Step 1: Jalankan gate wajib**

```bash
npm run lint
npm run build
```

Expected: keduanya PASS.

- [ ] **Step 2: Uji alur backend end-to-end di SQL Editor**

Dengan user yang sudah login: `create_order` → dapat `orderId` + `totalAmount`; `complete_payment` → dapat `ticketId`; `select qr_code from tickets where order_id = '...'` → `${orderId}|${ticketId}`; `select sold from ticket_categories where id = '...'` → bertambah sesuai qty; `select status from orders where id = '...'` → `paid`.

- [ ] **Step 3: Uji negative path**

Ulangi dengan user berbeda mengakses `orderId` tersebut: `complete_payment` harus error karena owner mismatch; `select` lewat client (bukan SQL Editor) harus return 0 baris karena RLS.

- [ ] **Step 4: Catat hasil QA**

Tulis di `README.md` bagian "QA MVP": daftar skenario yang dijalankan dan hasilnya. Jangan commit `.env.local`.

- [ ] **Step 5: Serah terima**

Laporkan path file yang berubah dan minta persetujuan pengguna sebelum commit. Jangan jalankan `git add`/`git commit` tanpa persetujuan.

---

## Di luar scope plan ini

- Implementasi ulang halaman form order, payment, dan e-ticket agar memanggil `createOrder`/`completePayment`/`getTicketByOrderId` — semua page itu masih berupa komentar/legacy. Buat plan terpisah setelah backend ini terverifikasi.
- Rename route `/matchs` → `/events` dan penghapusan adapter `matchService`.
- Admin dashboard, gateway pembayaran nyata, verifikasi QR, seat-level, notifikasi email.
