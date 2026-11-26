# AGENTS.md

## Konteks

Tiket.ku adalah platform web untuk pemesanan tiket pertandingan sepak bola dan konser di Stadion Gelora Bung Karno (GBK), Jakarta. Pengguna dapat melihat jadwal acara, memilih tribun, mengisi data pembeli, melakukan pembayaran (simulasi pada MVP), dan menerima e-ticket digital dengan QR code.

- Persyaratan produk: lihat `PRD.md`.
- Design system & token: lihat `DESIGN.md`.
- File ini memandu coding agent yang bekerja di repositori ini.

**Struktur proyek**

```text
src/
├── app.css
├── App.tsx
├── main.tsx
├── components/              # primitif UI bersama
├── features/
│   ├── auth/                # page, schema, service
│   ├── events/              # service, types
│   ├── home/                # page
│   ├── matches/             # components, hooks, page, service, types (legacy)
│   ├── orders/              # service
│   ├── payment/             # components, hooks, page, schemas
│   ├── tickets/             # component, service
│   └── users/               # components, hooks, page, schema, service, types
├── hooks/
├── lib/                     # supabase client, utils (cn)
└── services/                # helper service legacy

supabase/
├── migrations/              # schema, index, RLS, RPC
└── seed.sql
```

- Feature-first: simpan kode spesifik fitur di `src/features/<fitur>/`.
- Primitif bersama diletakkan di `src/components/`.
- Rute dideklarasikan di `src/App.tsx`.
- `matches` masih memakai `matchId` (legacy); fitur baru memakai `eventId`.

**Tech stack**

- **Frontend:** React 19, Vite 6, TypeScript 5.7 (strict mode).
- **Routing:** React Router 7.
- **Styling:** Tailwind CSS 4 + shadcn/ui (berbasis Radix).
- **Form/Validasi:** React Hook Form + Zod.
- **State:** React hooks + Context API (tanpa global store pada MVP).
- **Backend/Auth/DB:** Supabase (Postgres + Auth + RLS).
- **Payment (MVP):** simulasi via RPC `complete_payment`; gateway nyata (Midtrans/Xendit) pada v1.1.
- **QR Code:** `qrcode` (planned, dependency belum terpasang).
- **Testing (rencana):** Vitest + React Testing Library.
- **Supabase assets:** migration dan seed berada di `supabase/migrations` dan `supabase/seed.sql`.

## Lingkungan

- **Runtime:** Node.js v20+ (diuji pada v26), npm v10+.
- **Package manager:** npm (lockfile: `package-lock.json`). Jangan perkenalkan lockfile pnpm/yarn.
- **Instal dependensi:** `npm install`
- **Jalankan dev server (Vite):** `npm run dev` (port default 5173)
- **Build (bundle):** `npm run build` (Vite bundle). Type-check terpisah memakai tsc; di lingkungan ini gunakan `NODE_OPTIONS=--max-old-space-size=4096`.
- **Lint:** ESLint terhadap `.`. Warning pre-existing di `.agents/skills/...` bukan scope task.
- **Preview build produksi:** `npm run preview`
- **Variabel lingkungan:** buat `.env.local` dari `.env.example` dengan:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - Jangan commit `.env.local` atau expose service role key Supabase.
  - Guard modul: jika env kosong, lempar `"Supabase URL dan publishable key wajib diisi. Salin .env.example ke .env.local."`.
- **Alias path (tsconfig):**
  - `@/*` → `src/*`
  - `@/home/*` → `src/features/home/*`
  - Gunakan alias pada import, bukan path relatif `../../../`.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` + komponen shadcn/ui. Ikuti token di `DESIGN.md`.
- **Skill shadcn:** tersedia di `.agents/skills/shadcn` untuk manajemen komponen (add, search, fix, styling). Gunakan saat bekerja dengan shadcn/ui.

## Alur kerja

- **Kontrol versi:** jangan langsung `git add`/`git commit`. Jangan pernah commit tanpa persetujuan pengguna. Biarkan pengguna meninjau perubahan kode terlebih dahulu.
- **Standar DevOps untuk commit:** gunakan Conventional Commits `type(scope): deskripsi`. Type: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `build`, `ci`, `style`, `revert`; scope opsional; deskripsi imperatif Bahasa Indonesia, huruf kecil, tanpa titik akhir. Contoh: `docs(agents): susun ulang struktur aturan`.
- Perlakukan perubahan yang tidak dibuat agen pada sesi ini sebagai perubahan pengguna; jangan revert atau timpa ke versi agen. Jika ragu, tanyakan apakah perubahan itu dari pengguna.
- **Branch per progress:** setiap progress/fitur/perbaikan harus dikerjakan di branch baru yang namanya sesuai progress (mis. `feat/<nama-fitur>`, `fix/<nama-bug>`). Jangan commit langsung ke `main`/`master`.
- **Scope task:** jangan keluar dari scope task. Jika ada yang membingungkan, interview pengguna sebelum bertindak.

- Test otomatis belum dikonfigurasi. Sampai Vitest disiapkan, validasi perubahan secara manual via dev server.
- Saat test ditambahkan (v1.1), jalankan `npm test` dan pastikan suite hijau.
- Tambah atau perbarui test untuk setiap perubahan kode setelah harness test tersedia.
- Status QA MVP dicatat di `README.md`: verifikasi statis selesai; QA live owner-side pending. Agen tidak menjalankan SQL live atau memakai kredensial.

- **Branch:** buat branch baru sesuai progress sebelum mulai bekerja.
- **Format judul:** `[tiket.ku] <deskripsi singkat>`
- **Sebelum commit:** jalankan `npm run lint`, `npm run build`, dan `npx tsc -b`; ketiganya harus lulus.
- **Scope:** PR fokus pada satu fitur/perbaikan. Referensikan bagian `PRD.md` jika relevan.
- **Commit per task:** setiap task selesai dan lulus verifikasi dibuat commit terpisah.
- **Jangan commit** `.env.local`, artefak build, atau `node_modules`.

## Perencanaan

- Sebelum membangun fitur atau perbaikan yang tidak trivial, ikuti alur skill superpowers: `brainstorming` untuk menyepakati desain, lalu `writing-plans` untuk menyusun rencana. Implementasi baru dimulai setelah desain disetujui pengguna.
- **Lokasi wajib:** desain di `docs/superpowers/specs/YYYY-MM-DD-<topik>-design.md`; rencana di `docs/superpowers/plans/YYYY-MM-DD-<topik>-plan.md`. Jangan menyimpan plan final di root repositori atau di folder workspace agen (mis. `.opencode/plan`); lokasi itu hanya workspace sementara.
- File rencana mengikuti format `writing-plans`: blockquote "Untuk pekerja agen", `Tujuan`, `Arsitektur`, `Tech Stack`, `Spesifikasi` yang menunjuk ke file desain, `Global Constraints`, `Review Focus`, lalu task bertanda `- [ ]` dengan `Files`, `Interfaces`, langkah implementasi, dan langkah verifikasi yang bisa dicek.
- Gunakan `Spesifikasi` sebagai sumber keputusan; plan tidak boleh mengulang seluruh isi desain atau menulis kode lengkap sebagai transcript.
- Eksekusi plan memakai `subagent-driven-development` atau `executing-plans` sesuai instruksi pada blockquote plan. Jangan mulai implementasi tanpa memilih salah satu.
- Plan dipecah menjadi task kecil yang bisa diverifikasi.
- Setiap task yang selesai dan lulus verifikasi dibuat commit terpisah (satu task = satu commit). Jangan gabungkan beberapa task dalam satu commit.
- Setelah task selesai, centang checklist task di plan (`- [ ]` → `- [x]`).
- Plan selalu mencerminkan progress aktual.
- **Plan progress atas permintaan pengguna:** saat pengguna meminta membuat plan progress, buat plan dengan format superpowers terlebih dahulu, lalu minta persetujuan pengguna sebelum eksekusi. Jangan implementasi sebelum ACC.
- **Header branch wajib:** setiap file plan harus memiliki header branch yang akan digunakan, mis. `Branch: feat/<nama-progress>`.
- **Commit per task di plan:** setelah semua checklist pada suatu task selesai dan lulus verifikasi, tambahkan commit hash dan commit message di bawah task tersebut pada file plan.
- Semua file `.md` di `docs/superpowers/` ditulis dalam Bahasa Indonesia dan tidak di-commit tanpa persetujuan pengguna.

## Standar kode

- Sebelum menganalisis atau mengubah kode, baca `src/.ua/knowledge-graph.json` hasil skill `/understand` sebagai peta awal; gunakan `src/.ua/code-lessons.json` bila perlu penjelasan file.
- **TypeScript strict mode** aktif (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`). Jangan nonaktifkan. Perbaiki error tipe, jangan gunakan `any` atau `@ts-ignore`.
- **Tanpa dead code:** hapus blok yang dikomentari dan kode mati saat menyentuh file, jangan dibiarkan. Gunakan riwayat git untuk referensi.
- **Penamaan konsisten:** gunakan `eventId` (bukan `matchId`/`match_id`) dan `orderId` (bukan `userId` untuk order) untuk fitur baru. Standarkan camelCase untuk kolom DB jika memungkinkan, atau petakan eksplisit di service layer.
- **Teks UI dalam Bahasa Indonesia.**
- **Ikuti `DESIGN.md`** untuk warna, tipografi, spacing, radius, dan styling komponen. Jangan perkenalkan nilai ad-hoc.
- **Validasi:** gunakan Zod schema di `src/features/<fitur>/schema` (atau `schemas`), dihubungkan via `zodResolver`.
- **Akses data:** melalui modul service (`src/features/<fitur>/service`) yang memanggil Supabase client dari `src/lib/supabase.ts`. Jangan panggil Supabase langsung dari komponen.
- **RLS:** definisikan Row Level Security policy untuk setiap tabel Supabase sejak MVP. `orders`/`tickets` owner-based. Jangan bypass dengan service role key di client.
- **Migration:** file gabungan final diapply sekali. Jangan edit migration yang sudah diapply.
- **Error handling:** tampilkan error ke pengguna via komponen `Alerts` atau inline field error. Hindari `alert()`.
- **Loading state:** nonaktifkan tombol submit dan tampilkan spinner saat operasi async berlangsung.
- **Komponen reusable:** jika komponen bukan dari shadcn/ui, buat file khusus di `src/components/` agar dapat digunakan ulang. Lebih baik edit file yang ada daripada membuat baru; jangan duplikasi komponen.

- Saat mengubah rute, perbarui `src/App.tsx` dan alur pengguna di `PRD.md` jika perlu.
- Saat menambah fitur, buat folder di `src/features/<fitur>/` dengan `page`, `components`, `hooks`, `service`, `schema`/`schemas`, dan `types` sesuai kebutuhan.
- Jika ragu tentang skema backend (events/ticket_categories/orders/tickets), cek `PRD.md` §6.3 dan konfirmasi ke pemilik proyek sebelum migrasi.
- Type-check membutuhkan heap 4096 MB di lingkungan ini.

## Dokumentasi & referensi

- **Bahasa dokumentasi:** semua file `.md` (PRD, DESIGN, AGENTS) ditulis dalam Bahasa Indonesia.
- **Izin file `.md`:** jangan memperbarui file `.md` (termasuk AGENTS, PRD, DESIGN, docs/superpowers) tanpa izin pengguna terlebih dahulu.

### Issue tracker

Issues tracked di GitHub repo ini via `gh` CLI. Lihat `docs/agents/issue-tracker.md`.

### Triage labels

Label default: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. Lihat `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` di root (dibuat lazily). Lihat `docs/agents/domain.md`.

### Catatan

- `npm run lint` wajib lulus tetapi 49 error pre-existing ada di `.agents/skills/**`.
- `.md` dilarang di-commit tanpa izin tetapi plan di `docs/superpowers/` pernah di-commit.
- branch per progress diwajibkan tetapi tracking terakhir di branch yang sudah ada.
