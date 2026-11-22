# Product Requirements Document (PRD)

## Tiket.ku — Platform Pemesanan Tiket Acara di Stadion GBK

**Versi:** 1.0 (Draft)
**Tanggal:** 23 November 2026
**Status:** Greenfield (plan sebelum pengembangan)
**Bahasa Dokumen:** Bahasa Indonesia

---

## 1. Executive Summary

### Problem Statement

Penggemar sepak bola dan konser di Jakarta kesulitan mendapatkan tiket acara di Stadion Gelora Bung Karno (GBK): harus antre di loket fisik, informasi jadwal tersebar, dan risiko tiket palsu. Tidak ada satu platform yang menyatukan jadwal acara GBK dengan proses pembelian tiket yang cepat dan aman.

### Proposed Solution

Membangun platform web "Tiket.ku" yang memungkinkan pengguna melihat jadwal acara (pertandingan sepak bola maupun konser) di Stadion GBK, memilih tribun dan jumlah tiket, mengisi data pembeli, melakukan pembayaran, dan menerima e-ticket digital (QR code + cetak). Admin/operator dapat mengelola acara dan kapasitas tribun melalui backend.

### Success Criteria (KPIs)

1. **Alur end-to-end berfungsi:** 100% flow (lihat jadwal → pilih tribun → isi data → bayar → terima e-ticket) dapat diselesaikan tanpa error pada manual QA.
2. **Waktu muat jadwal:** daftar acara tampil dalam ≤ 2 detik pada koneksi 3G.
3. **Autentikasi:** login & signup berhasil 100% untuk kredensial valid; pesan error jelas untuk kredensial invalid.
4. **Pembayaran:** 100% transaksi simulasi (MVP) / gateway (v1.1) tercatat dengan status yang benar.
5. **Aksesibilitas:** skor Lighthouse Accessibility ≥ 90 pada halaman utama (mobile).
6. **Cakupan MVP:** seluruh fitur prioritas P0 selesai dan dapat didemonstrasikan.

---

## 2. Product Overview

### 2.1 Identitas Produk

| Atribut | Nilai |
|---|---|
| Nama Produk | Tiket.ku |
| Tipe | Aplikasi web (SPA) |
| Tagline | "Nonton Langsung di Stadion Kini Jadi Lebih Mudah" |
| Value Proposition | Beli tiket acara di Stadion GBK cepat, aman, dan tanpa antre lewat ponsel. |
| Target Pengguna | Penggemar sepak bola dan konser yang ingin menonton langsung di GBK. |
| Bahasa UI | Bahasa Indonesia. |
| Platform | Web (desktop & mobile responsif). |
| Cakupan Venue | Stadion Gelora Bung Karno (GBK), Jakarta — satu venue. |
| Jenis Acara | Pertandingan sepak bola dan konser. |

### 2.2 Ruang Lingkup (Scope)

- Platform fokus pada **satu venue**: Stadion GBK.
- Acara yang didukung: **pertandingan sepak bola** dan **konser**.
- Pembelian tiket pada level **tribun** (bukan kursi spesifik) untuk MVP.
- Satu akun pengguna dapat membeli beberapa tiket dalam satu transaksi.

---

## 3. User Experience & Functionality

### 3.1 User Personas

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Penggemar Bola (Buyer)** | Usia 18–45, pengguna smartphone, ingin menonton pertandingan langsung. | Melihat jadwal pertandingan, memilih tribun, beli tiket cepat & aman. |
| **Penggemar Konser (Buyer)** | Usia 18–40, pengguna smartphone, ingin menonton konser. | Melihat jadwal konser, memilih kategori tiket, beli tiket. |
| **Pengguna Baru (Guest)** | Belum punya akun. | Mendaftar & login dengan mudah. |
| **Admin/Operator** | Pengelola acara & kapasitas tribun. | Mengelola acara, tribun, harga, dan kuota via backend. |

### 3.2 User Stories & Acceptance Criteria

#### US-01 — Melihat Jadwal Acara

> Sebagai pengguna, saya ingin melihat daftar acara mendatang di GBK (sepak bola & konser) beserta waktu, tanggal, dan detail, agar saya bisa memilih acara yang ingin ditonton.

**Acceptance Criteria:**
- Halaman jadwal menampilkan semua acara dari backend.
- Filter berdasarkan jenis acara (semua / sepak bola / konser).
- Setiap kartu menampilkan: nama acara, tim/artis, tanggal, waktu, stadion (GBK).
- Klik kartu mengarahkan ke detail acara.
- Tampil state loading saat data dimuat dan state kosong jika tidak ada data.
- Tampil pesan error yang jelas jika gagal memuat data.

#### US-02 — Detail Acara

> Sebagai pengguna, saya ingin melihat detail acara (deskripsi, tribun & harga, kapasitas tersisa), agar saya bisa memutuskan pembelian.

**Acceptance Criteria:**
- Halaman detail menampilkan info lengkap acara.
- Daftar tribun dengan harga dan sisa kuota.
- Tombol "Pesan Tiket" mengarahkan ke form pembelian (memerlukan login).

#### US-03 — Autentikasi (Login/Signup)

> Sebagai pengguna, saya ingin membuat akun dan masuk, agar saya bisa melakukan pembelian tiket.

**Acceptance Criteria:**
- Modal auth dapat dibuka dari navbar (Login/Sign Up).
- Validasi email & password (min 6, max 20 karakter) dengan pesan error Indonesia.
- Login berhasil mengubah state navbar (tampil ikon user, menu jadwal).
- Signup berhasil membuat akun.
- Pesan error spesifik: "Email atau password salah", "Email ini sudah terdaftar".
- Modal dapat ditutup dengan tombol close, backdrop, atau Escape.
- Form tidak dapat disubmit ulang saat proses berlangsung (loading state).

#### US-04 — Memilih Tribun & Jumlah Tiket

> Sebagai pembeli, saya ingin memilih tribun dan jumlah tiket per tribun, agar saya bisa memesan sesuai kebutuhan.

**Acceptance Criteria:**
- Halaman form menampilkan daftar tribun dari acara terpilih (nama tribun + harga + sisa kuota).
- Pengguna dapat menambah/mengurangi jumlah tiket per tribun (min 0, max sisa kuota).
- Total harga dihitung otomatis.
- Tombol submit dinonaktifkan jika total tiket = 0.

#### US-05 — Mengisi Data Pembeli

> Sebagai pembeli, saya ingin mengisi data diri (nama lengkap, jenis kelamin, nomor identitas, email), agar tiket diterbitkan atas nama saya.

**Acceptance Criteria:**
- Validasi: nama hanya huruf & spasi; nomor identitas hanya angka; email valid; jenis kelamin wajib dipilih.
- Pesan error ditampilkan per field.
- Data tersimpan ke backend dan ID pemesanan dikembalikan.

#### US-06 — Pembayaran

> Sebagai pembeli, saya ingin memilih metode pembayaran dan memasukkan detail pembayaran, agar transaksi dapat diselesaikan.

**Acceptance Criteria:**
- Pilihan metode pembayaran: Credit/Debit Card dan Bank Transfer.
- Form validasi: nama pemegang kartu (huruf), nomor kartu, CVV (angka), expiry (angka).
- Setelah submit sukses, pengguna diarahkan ke halaman e-ticket.
- (MVP) Pembayaran bersifat simulasi; gateway nyata pada v1.1.

#### US-07 — Menerima E-Ticket

> Sebagai pembeli, saya ingin menerima e-ticket digital yang berisi detail acara dan data saya serta QR code, agar dapat ditunjukkan saat masuk stadion.

**Acceptance Criteria:**
- Halaman tiket menampilkan: nama acara, tanggal, waktu, stadion, tribun, jumlah tiket, nama pembeli, nomor tiket/ID pemesanan, QR code.
- Jika data tidak ditemukan, tampil pesan "Data acara atau pemesanan tidak ditemukan."
- Tiket dapat dicetak via `window.print()`.
- QR code dapat diverifikasi (v1.1).

#### US-08 — Navigasi & Sesi

> Sebagai pengguna, saya ingin navbar mencerminkan status login, agar saya tahu apakah saya sudah masuk.

**Acceptance Criteria:**
- State login dipertahankan saat refresh halaman (via session backend).
- Logout menghapus sesi.

### 3.3 User Flow (Happy Path)

```
Home (/)
  └─ Klik "Pesan Tiket" / CTA
       └─ Jika belum login → Auth Modal (Login/Signup)
            └─ Login/Signup berhasil → Home (state login)
  └─ Navbar "Jadwal" → Daftar Acara (/events)
       └─ Klik acara → Detail Acara (/events/:eventId)
            └─ Klik "Pesan Tiket" → Form Pembelian (/events/:eventId/order)
                 ├─ Pilih tribun & jumlah tiket
                 ├─ Isi data pembeli → submit
                 └─ Backend insert order → dapat orderId
                      └─ Payment (/events/:eventId/payment/:orderId)
                           └─ Isi detail pembayaran → submit
                                └─ E-Ticket (/orders/:orderId/ticket)
                                     └─ Tampil e-ticket (QR) → window.print()
```

### 3.4 Non-Goals (Tidak Dibangun pada MVP)

- Pemilihan kursi spesifik (seat-level) — hanya level tribun.
- Multi-venue (hanya GBK).
- Multi-bahasa (i18n) — hanya Indonesia.
- Aplikasi mobile native / PWA.
- Marketplace / resale tiket.
- Notifikasi real-time kapasitas tribun.
- Admin dashboard UI (MVP: kelola via backend/Supabase langsung; UI admin pada v1.1).
- Test E2E otomatis (v1.1).

---

## 4. Functional Requirements (Prioritas)

| ID | Fitur | Prioritas | Fase |
|---|---|---|---|
| F-01 | Landing page (hero, fitur, CTA) | P0 | MVP |
| F-02 | Auth (login/signup) | P0 | MVP |
| F-03 | Daftar & filter acara | P0 | MVP |
| F-04 | Detail acara (tribun, harga, kuota) | P0 | MVP |
| F-05 | Form pembelian (tribun + data pembeli) | P0 | MVP |
| F-06 | Pembayaran (simulasi) | P0 | MVP |
| F-07 | E-ticket digital (QR + print) | P0 | MVP |
| F-08 | Navbar state berbasis sesi | P0 | MVP |
| F-09 | Loading & error states | P1 | MVP |
| F-10 | Validasi form lengkap | P1 | MVP |
| F-11 | Responsive mobile | P1 | MVP |
| F-12 | Logout | P2 | v1.1 |
| F-13 | Admin dashboard (CRUD acara) | P2 | v1.1 |
| F-14 | Integrasi payment gateway nyata | P2 | v1.1 |
| F-15 | Verifikasi QR ticket | P2 | v1.1 |
| F-16 | Riwayat pembelian user | P3 | v2.0 |
| F-17 | Notifikasi email tiket | P3 | v2.0 |

---

## 5. AI System Requirements

**Tidak berlaku untuk MVP.** Aplikasi ini tidak menggunakan fitur AI/LLM. Jika di masa depan ditambahkan (mis. chatbot bantuan pembelian atau rekomendasi acara), bagian ini akan diperbarui dengan tool requirements & evaluation strategy.

---

## 6. Technical Specifications

### 6.1 Architecture Overview

- **Tipe:** Single Page Application (SPA) client-side.
- **Routing:** client-side router (BrowserRouter).
- **State:** lokal (useState/useEffect) + session backend; tidak ada global state manager pada MVP.
- **Data flow:** UI → Feature Hooks → Service Layer → Backend Client → Backend (DB/Auth).
- **Konteks pembelian:** diteruskan via URL params (`/events/:eventId/order`, `/events/:eventId/payment/:orderId`, `/orders/:orderId/ticket`) — tidak menggunakan sessionStorage.
- **Styling:** Tailwind CSS + shadcn/ui (utility-first + komponen UI siap pakai).
- **E-ticket:** render HTML + QR code, dicetak via `window.print()`.

### 6.2 Tech Stack (Pilihan)

| Layer | Teknologi | Catatan |
|---|---|---|
| Build tool | Vite | Dev server & bundler. |
| UI library | React 19 | Component-based UI. |
| Language | TypeScript (strict mode) | Type safety. |
| Routing | React Router | Client-side routing. |
| Styling | Tailwind CSS + shadcn/ui | Utility-first + komponen UI siap pakai (Radix-based). |
| Forms & Validation | React Hook Form + Zod | Form state & schema validation. |
| State Management | React hooks + Context API | Cukup untuk MVP. |
| Backend/Auth/DB | Supabase (Postgres + Auth + RLS) | Backend-as-a-Service. |
| QR Code | qrcode | Generate QR e-ticket di client. |
| Testing | Vitest + React Testing Library | Unit & component test. |
| Payment (MVP) | Simulasi (tanpa gateway) | Gateway nyata (Midtrans/Xendit) pada v1.1. |
| Hosting/Deploy | TBD | Belum diputuskan (Vercel/Netlify/Supabase Hosting). |

### 6.3 Data Model

#### Tabel `events`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK) | ID acara. |
| `type` | text | "football" / "concert". |
| `title` | text | Nama acara (mis. "Indonesia vs Bahrain"). |
| `subtitle` | text | Detail (tim/artis). |
| `event_date` | date | Tanggal acara. |
| `event_time` | text | Waktu (mis. "20:00"). |
| `time_zone` | text | Zona waktu (mis. "WIB"). |
| `venue` | text | "Stadion Gelora Bung Karno". |
| `description` | text | Deskripsi acara. |
| `image_url` | text | Gambar/poster acara. |
| `created_at` | timestamptz | Waktu pembuatan. |

#### Tabel `ticket_categories` (tribun per acara)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK) | ID kategori. |
| `event_id` | uuid (FK → events.id) | Acara terkait. |
| `name` | text | Nama tribun (mis. "VIP Barat"). |
| `price` | integer | Harga dalam Rupiah. |
| `quota` | integer | Kapasitas total. |
| `sold` | integer | Jumlah terjual. |

#### Tabel `orders`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK) | ID pemesanan. |
| `user_id` | uuid (FK → auth.users) | Pembeli. |
| `event_id` | uuid (FK → events.id) | Acara. |
| `buyer_name` | text | Nama pembeli. |
| `buyer_email` | text | Email pembeli. |
| `identity_number` | text | Nomor identitas. |
| `gender` | text | "Laki-laki" / "Perempuan". |
| `items` | jsonb | `[{ category_id, category_name, qty, price }]`. |
| `total_amount` | integer | Total harga. |
| `status` | text | "pending" / "paid" / "cancelled". |
| `created_at` | timestamptz | Waktu pemesanan. |

#### Tabel `tickets` (e-ticket terbit)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK) | Nomor tiket. |
| `order_id` | uuid (FK → orders.id) | Pemesanan terkait. |
| `qr_code` | text | Payload QR (order_id + ticket id). |
| `issued_at` | timestamptz | Waktu penerbitan. |

### 6.4 Integration Points

| Sistem | Cara Integrasi | Catatan |
|---|---|---|
| Supabase Auth | Email/password (`signInWithPassword`, `signUp`, `getSession`, `onAuthStateChange`) | Session persist. |
| Supabase DB | CRUD via Supabase client dengan RLS | `events`/`ticket_categories` read public; `orders`/`tickets` berbasis user. |
| Payment (MVP) | Simulasi (tanpa gateway) | Gateway nyata pada v1.1. |
| QR Code | Library `qrcode` di client | Generate dari ticket id. |

### 6.5 Security & Privacy

- Kredensial backend disimpan di environment variable (tidak di-commit; sediakan `.env.example`).
- Gunakan anon key di client; jangan expose service role key.
- Row Level Security (RLS): `events` & `ticket_categories` read public; `orders` & `tickets` hanya dapat diakses oleh pemilik.
- Validasi input di client (Zod) + constraint di DB.
- Data identitas (nomor identitas) dianggap sensitif; simpan hanya yang diperlukan; jangan log ke console di production.
- HTTPS only di production.
- Cegah pembelian melebihi kuota (validasi server-side/DB constraint).

### 6.6 Non-Functional Requirements

| Kategori | Target |
|---|---|
| Performance | First Contentful Paint ≤ 2s pada 3G; bundle size ≤ 300KB gzipped (target). |
| Accessibility | Lighthouse A11y ≥ 90. |
| Responsiveness | Mendukung viewport 320px–1440px. |
| Browser support | Chrome, Edge, Firefox, Safari versi 2 terakhir. |
| Reliability | Fallback UI untuk kegagalan fetch. |
| Maintainability | TypeScript strict mode, 0 lint error, struktur folder konsisten. |
| Concurrency | Cegah oversell tiket (kuota atomik). |

---

## 7. Risks & Roadmap

### 7.1 Technical Risks

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Oversell tiket karena race condition | Tinggi | Update kuota secara atomik (DB function/transaction); validasi server-side. |
| Skema DB berubah mid-dev | Sedang | Definisikan migration SQL sejak awal; versioning. |
| Payment gateway integration (v1.1) | Sedang | Mulai dengan simulasi MVP; abstraksi payment service. |
| Tidak ada test → regresi | Sedang | Tambah smoke test (unit + integration) sejak MVP. |
| Data sensitif (identitas) bocor | Tinggi | RLS, HTTPS, jangan log data sensitif. |
| QR code palsu | Sedang | Tanda tangan/verifikasi server-side (v1.1). |

### 7.2 Phased Rollout

#### Phase 0 — Stabilization (Minggu 1–2)
- Perbaiki build TypeScript (buat type files, konsistensi impor).
- Hapus dead code & komentar lama (termasuk file legacy yang tidak terpakai).
- Re-introduce `FormField` atau refactor komponen.
- Tambah `.env.example`.
- Dokumentasi skema DB (SQL migration) + RLS policies.
- Sediakan komponen shadcn yang dibutuhkan (button, input, card, dialog, badge, dll.).

#### Phase 1 — MVP (v1.0)
- Landing page, auth (login/signup).
- Daftar & detail acara (filter tipe).
- Form pembelian (tribun + data pembeli + validasi).
- Pembayaran simulasi.
- E-ticket (QR + print).
- Loading/error states, responsive dasar.

#### Phase 2 — Polish & Admin (v1.1)
- Admin dashboard (CRUD acara, tribun, kuota).
- Integrasi payment gateway nyata.
- Verifikasi QR ticket.
- Logout, riwayat pembelian.
- Smoke tests, Lighthouse optimization.

#### Phase 3 — Growth (v2.0)
- Notifikasi email/SMS tiket.
- Seat-level selection.
- Multi-event series / festival.
- Analytics & reporting.

---

## 8. Open Questions / TBD

1. Apakah MVP menggunakan pembayaran simulasi atau langsung gateway? (Rekomendasi: simulasi MVP, gateway v1.1.)
2. Apakah kapasitas tribun dilacak per acara atau global? (Rekomendasi: per acara.)
3. Apakah diperlukan fitur refund/pembatalan? (TBD, rekomendasi v2.0.)
4. Format nomor identitas: KTP (16 digit) atau bebas? (Rekomendasi: validasi 16 digit KTP.)
5. Apakah guest (tanpa login) boleh membeli? (Rekomendasi: wajib login untuk MVP.)

---

## 9. Appendix

### 9.1 Glosarium

- **GBK:** Gelora Bung Karno — stadion utama di Jakarta.
- **Tribun:** Sektor tempat duduk di stadion (mis. VIP Barat, Garuda Utara).
- **E-ticket:** Tiket digital dengan QR code.
- **MVP:** Minimum Viable Product.

### 9.2 Perbedaan dari Plan Awal (Tanpa PRD)

Plan sebelumnya tidak memiliki batasan venue/jenis acara yang jelas dan mencampur fitur (tiket bola, form, payment) tanpa prioritas. PRD ini mempersempit cakupan ke **acara di Stadion GBK (sepak bola & konser)**, mendefinisikan data model, prioritas fitur (P0/P1/P2), dan roadmap bertahap agar pengembangan terarah.

---

_Dokumen ini adalah living document; perbarui seiring perkembangan proyek._
