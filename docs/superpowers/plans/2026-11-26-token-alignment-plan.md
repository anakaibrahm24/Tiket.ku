# Penyelarasan Token DESIGN.md–Stitch–CSS

Branch: feat/update-design-system-landing

> **Untuk pekerja agen:** REQUIRED SUB-SKILL: Gunakan `subagent-driven-development` (disarankan) atau `executing-plans` untuk mengerjakan tiap task. Centang checkbox setelah verifikasi.

**Tujuan:** Menjadikan `.stitch/tiket.ku_design_system.md` sebagai sumber kebenaran `DESIGN.md`, lalu menyelaraskan `src/app.css` ke `DESIGN.md` tanpa memutus class yang dipakai komponen.

**Arsitektur:** `DESIGN.md` ditulis ulang memakai nama token Stitch persis (`light-*`, `dark-*`, `gutter-*`, `text-*`, `font-*`). `src/app.css` mendefinisikan token kanonik itu, dengan token lama (`surface-white`, `ink-900`, `night-950`, `line-soft`, dll.) tetap sebagai alias bertanda kompatibilitas agar komponen tidak berubah.

**Tech Stack:** Tailwind CSS v4 (`@theme`), TypeScript strict, React 19, Vite.

**Spesifikasi:** `.stitch/tiket.ku_design_system.md` dan `.stitch/tiket.ku_landing_page_gbk/code.html`.

## Global Constraints

- Semua file `.md` berbahasa Indonesia.
- Jangan mengubah migration Supabase, rute, atau logika bisnis.
- Jangan menyentuh perubahan lokal `src/features/home/page/Home.tsx` di luar task ini.
- Token lama hanya menjadi alias; jangan menghapus class yang masih dipakai komponen.
- Verifikasi wajib: `npm run lint`, `npm run build`, `npx tsc -b` dengan `NODE_OPTIONS=--max-old-space-size=4096`.
- Jangan commit tanpa persetujuan pengguna.

## Review Focus

- Token kanonik Stitch yang tertinggal dari `DESIGN.md` (mis. `light-inverse-surface`, `dark-outline-variant`).
- Alias lama yang tidak lagi terdefinisi sehingga class komponen hilang dari CSS build.
- Nama spacing `gutter-*` vs `spacing-*`: keduanya harus ada dan tidak bertabrakan.
- Token font `headline` (Plus Jakarta Sans)vs `title` (Inter) pada `headline-md`.
- Motion `duration-state-change` / `ease-state-change` harus benar-benar ter-generate di CSS.

---

### Task 1: Tulis ulang DESIGN.md sesuai Stitch

**Files:**
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: `.stitch/tiket.ku_design_system.md` (YAML warna, tipografi, spacing, radius, motion), `.stitch/tiket.ku_landing_page_gbk/code.html` (nama class aktual).
- Produces: Daftar token kanonik + tabel alias kompatibilitas untuk Task 2.

- [x] **Step 1: Ganti tabel warna dengan token Stitch persis**
  Salin YAML `colors` dari `.stitch/tiket.ku_design_system.md` (`brand-*`, `accent`, `success`, `warning`, `danger`, `light-*`, `dark-*`). Tambahkan catatan singkat bahwa `surface-white`/`ink-900`/`night-950`/`line-soft` adalah alias lama.

- [x] **Step 2: Beri nama token pada skala tipografi**
  Gunakan `display-lg`, `display-lg-mobile`, `headline-lg`, `headline-lg-mobile`, `headline-md`, `title-lg`, `title-md`, `body-lg`, `body-md`, `label-lg`, `label-md`, `label-sm`, `mono-md`, `mono-sm` dengan nilai persis Stitch, termasuk `font-family` per baris.

- [x] **Step 3: Samakan spacing, radius, dan motion**
  Spacing: `gutter-xs/sm/md/lg/xl`, `section`, `page-margin`. Radius: `DEFAULT`, `sm`, `md`, `lg`, `xl`, `full`. Motion: `state-change` 150ms ease-out, `surface-enter` 220ms cubic-bezier(0.2, 0, 0, 1).

- [x] **Step 4: Verifikasi**
  Jalankan audit nama token Stitch terhadap `DESIGN.md`; pastikan `light-inverse-surface`, `dark-outline-variant`, `gutter-*`, dan ke-14 nama `text-*` muncul.

### Task 2: Selaraskan src/app.css ke DESIGN.md baru

**Files:**
- Modify: `src/app.css`

**Interfaces:**
- Consumes: token kanonik dari Task 1.
- Produces: `--color-*`, `--text-*`, `--font-*`, `--spacing-*`, `--radius-*`, dan utilitas motion yang dipakai build.

- [x] **Step 1: Tambah token warna kanonik Stitch**
  Definisikan `--color-light-*`, `--color-dark-*`, `--color-brand-*`, `--color-accent`, `--color-success`, `--color-warning`, `--color-danger` persis nilai Stitch. Ubah token lama menjadi alias `var(--color-...)` kanonik.

- [x] **Step 2: Tambah token spacing kanonik**
  Definisikan `--spacing-gutter-xs` … `--spacing-gutter-xl`, `--spacing-section`, `--spacing-page-margin`. Pertahankan `--spacing-xs` … `--spacing-xxl` sebagai alias.

- [x] **Step 3: Tambah utilitas motion bernama**
  Tambah `@utility duration-state-change` dan `@utility ease-state-change` yang merujuk ke variabel motion, agar class Stitch bekerja.

- [x] **Step 4: Verifikasi build**
  `npm run build`, lalu cek CSS hasil build memuat `.bg-light-inverse-surface`, `.border-dark-outline-variant`, `.text-headline-md`, `.font-title`, `.duration-state-change`.

### Task 3: Audit akhir dan penguncian

**Files:**
- Modify: `docs/superpowers/plans/2026-11-26-token-alignment-plan.md` (centang task)

**Interfaces:**
- Consumes: Task 1 dan Task 2.
- Produces: Status terverifikasi tanpa token tak terdokumentasi.

- [x] **Step 1: Jalankan audit token**
  Pastikan tidak ada class di `src/` yang memakai token tidak terdaftar di `src/app.css` atau tidak dijelaskan di `DESIGN.md`.

- [x] **Step 2: Jalankan verifikasi wajib**
  `npm run lint`, `npm run build`, `npx tsc -b` (heap 4096). Semua harus lulus.

- [x] **Step 3: Tandai progress**
  Centang checklist task yang selesai di file plan ini.
