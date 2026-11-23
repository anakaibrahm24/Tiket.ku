---
version: alpha
name: Tiket.ku
description: Design system for Tiket.ku, an event ticket booking platform for Stadion GBK. Fondasi visual diekstrak dari mindcloud.co: warna, tipografi, spacing, radius, elevation, dan komponen dasar. Semua nilai tersimpan sebagai variabel agar bisa dipakai ulang di halaman mana pun.
---

## Gambaran umum

Tiket.ku adalah platform web untuk pemesanan tiket pertandingan sepak bola dan konser di Stadion Gelora Bung Karno (GBK). Desain sistem ini mengadopsi pendekatan mindcloud.co: warna latar gelap yang elegan di hero, tipografi Roobert untuk display dan Inter untuk body, grid spacing 8px, radius konsisten, elevasi halus melalui shadow dan border, dan komponen dasar yang bisa dipakai ulang di seluruh halaman.

Semua nilai tersimpan sebagai variabel di canvas dan diimplementasikan sebagai design token di `src/app.css` dan `src/lib/utils.ts`.

---

## 01 Warna

### Brand & Aksen

| Token | Nilai | Digunakan untuk |
|---|---|---|
| `brand-blue` | `#146DFC` | Aksi utama, tombol primary, fokus |
| `brand-hover` | `#006FFF` | Hover/active state tombol primary |
| `brand-deep` | `#0056EC` | Dark variant brand |
| `brand-sky` | `#BADFFF` | Teks sekunder pada latar gelap, aksen terang |
| `brand-tint` | `#DEF1FF` | Background ringan dengan nuansa brand |

### Surface (Latar)

| Token | Nilai | Digunakan untuk |
|---|---|---|
| `surface-white` | `#FFFFFF` | Background utama, card, input |
| `surface-subtle` | `#F7F8F7` | Section background halus |
| `surface-muted` | `#F2F2F3` | Background elemen non-interaktif |
| `surface-tint` | `#EDEEF0` | Background aktif/hover ringan |
| `surface-line` | `#ECECED` | Pemisah halus |

### Teks & Ikon (Ink)

| Token | Nilai | Digunakan untuk |
|---|---|---|
| `ink-900` | `#27272A` | Teks utama, judul |
| `ink-700` | `#4F4F55` | Teks sekunder |
| `ink-600` | `#606169` | Teks body muted |
| `ink-500` | `#71717A` | Placeholder, label |
| `ink-300` | `#BABABF` | Teks disabled, meta |

### Surface Gelap (Dark)

| Token | Nilai | Digunakan untuk |
|---|---|---|
| `night-950` | `#020918` | Background gelap terluas (hero gradient) |
| `night-800` | `#051027` | Gradient tengah gelap |
| `dark-900` | `#27272A` | Surface gelap |
| `dark-800` | `#3B3C3F` | Surface gelap sedang |
| `dark-700` | `#434349` | Border/divider pada latar gelap |

### Garis (Line)

| Token | Nilai | Digunakan untuk |
|---|---|---|
| `line-soft` | `#0000000F` | Border halus pada latar terang |
| `line-on-dark` | `#FFFFFF1F` | Border halus pada latar gelap |

### Warna Semantik (Tiket.ku)

| Token | Nilai | Digunakan untuk |
|---|---|---|
| `background` | `#FFFFFF` | Kanvas halaman |
| `surface` | `#F8FAFC` | Card, panel, input |
| `foreground` | `#0F172A` | Teks utama |
| `muted` | `#64748B` | Teks sekunder dan placeholder |
| `border` | `#E2E8F0` | Pembagi dan border input |
| `primary` | `#0891B2` | Aksi utama (tombol, tautan, focus ring) |
| `primary-hover` | `#0e7490` | Hover/active primary |
| `primary-foreground` | `#FFFFFF` | Teks pada surface primary |
| `accent` | `#F97316` | Call to action intensitas tinggi ("Beli Tiket") |
| `accent-foreground` | `#000000` | Teks pada surface accent |
| `success` | `#16A34A` | Status berhasil |
| `warning` | `#F59E0B` | Status peringatan |
| `danger` | `#DC2626` | Status error |
| `info` | `#0891B2` | Informasi tambahan |
| `support` | `#64748B` | Teks bantu non-utama |

---

## 02 Tipografi

Typeface display menggunakan **Roobert**, body menggunakan **Inter** dengan fallback sistem. Semua ukuran menggunakan skala type yang ditetapkan; jangan perkenalkan ukuran font ad-hoc.

| Jenis | Ukuran/Line Height | Berat | Huruf Spasi | Font | Digunakan untuk |
|---|---|---|---|---|---|
| Display XL | 48/52 · 1.083 | 400 | −1.5px | Roobert | Headline hero besar |
| Display L | 38/44 · 1.158 | 400 | −0.76px | Roobert | Headline section besar |
| Display M | 34/40 · 1.176 | 400 | −0.68px | Roobert | Headline section sedang |
| Title | 30/36 · 1.2 | 700 | 0 | Inter | Judul halaman |
| Heading | 24/32 · 1.333 | 600 | 0 | Inter | Judul card dan section |
| Body | 16/24 · 1.5 | 400 | −0.16px | Inter | Paragraf, label form |
| UI / Nav | 14/20 · 1.428 | 400 | 0 | Inter | Navigasi, menu |
| Caption | 12/16 · 1.333 | 500 | 0 | Inter | Metadata, badge |
| Label | 11/14 · 1.27 | 600 | 0 | Inter | Label kecil, form field |

Catatan:
- Display menggunakan font **Roobert** dengan letter-spacing negatif untuk tampilan yang modern dan ringkas.
- Body dan UI menggunakan font **Inter** untuk keterbacaan maksimal pada teks panjang.
- Pertahankan line height yang ditetapkan; jangan perketat di bawah nilai yang ditentukan.

---

## 03 Spacing & Radius

### Spacing Scale (grid 8px)

| Token | Nilai |
|---|---|
| `space-1` / `space-xs` | 4px |
| `space-2` / `space-sm` | 8px |
| `space-3` / `space-md` | 16px |
| `space-4` / `space-lg` | 24px |
| `space-5` / `space-xl` | 32px |
| `space-xxl` | 48px |

Semua spacing berkelipatan 8px. Gunakan untuk padding, gap, dan margin antar elemen.

### Radius Scale

| Token | Nilai | Digunakan untuk |
|---|---|---|
| `radius-sm` | 12px | Tombol kecil, badge, input |
| `radius-md` | 12px | Card, panel sedang |
| `radius-lg` | 14px | Tombol besar, card prominent |
| `radius-xl` | 24px | Card besar, modal |
| `radius-base` | 10px | Elemen interaktif standar |
| `radius-full` | 9999px | Pill, badge bulat, avatar |

Jangan campur sudut tajam dengan sudut membulat dalam komponen yang sama.

---

## 04 Elevasi & Kedalaman

Elevasi dicapai melalui shadow halus dan border, bukan overlap berat.

| Jenis | Deskripsi | Digunakan untuk |
|---|---|---|
| `shadow-card` | Shadow halus, raised | Card standar |
| `shadow-raised` | Shadow sedikit lebih kuat | Card yang diangkat |
| `shadow-soft` | Shadow difus, lembut | Elemen floating |
| `shadow-inset` | Shadow di dalam | Input focus, tombol pressed |

- Gunakan shadow halus untuk card, modal, dan dropdown.
- Permukaan flat menggunakan border (`line-soft` atau `line-on-dark`), bukan shadow.
- Tidak ada shadow berat atau berlapis.

---

## 05 Komponen

### Tombol (Buttons)

| Varian | Background | Teks | Border | Radius | Digunakan untuk |
|---|---|---|---|---|---|
| Primary | `brand-blue` | Putih | — | `radius-lg` (14px) | Aksi utama |
| Secondary | `surface-white` | `ink-900` | `line-soft` | `radius-lg` (14px) | Aksi sekunder |
| Outline | Transparan | `ink-900` | `line-soft` | `radius-lg` (14px) | Aksi tepi |
| Ghost | Transparan | `ink-900` | — | `radius-lg` (14px) | Tautan bertindak seperti tombol |
| Link | Transparan | `brand-blue` | — | — | Tautan teks |
| On Dark (White) | Putih | `ink-900` | — | `radius-lg` (14px) | Tombol pada latar gelap |
| On Dark (Brand) | `brand-blue` | Putih | — | `radius-lg` (14px) | Tombol brand pada latar gelap |
| Glass | Putih transparan | `ink-900` | `line-on-dark` | `radius-lg` (14px) | Tombol kaca pada latar gelap |

- State disabled mengurangi opacity dan menampilkan spinner.
- Padding standar: 14px vertikal, 24px horizontal.

### Input

| State | Background | Border | Teks | Digunakan untuk |
|---|---|---|---|---|
| Default | `surface-white` | `line-soft` | `ink-900` | Input standar |
| Focus | `surface-white` | `brand-blue` | `ink-900` | Input aktif |

- Padding: 14px horizontal, tinggi 44px.
- Radius: `radius-lg` (14px).
- Teks error inline berwarna `danger`, ditampilkan di bawah field.

### Badge

| Varian | Background | Teks | Radius |
|---|---|---|---|
| Brand | `brand-blue` | Putih | `radius-full` |
| Sky | `brand-sky` | `ink-900` | `radius-full` |
| Neutral | `surface-muted` | `ink-700` | `radius-full` |
| Outline | Transparan + border `line-soft` | `ink-900` | `radius-full` |
| Dark | `night-950` | Putih | `radius-full` |

- Teks menggunakan ukuran `caption` (12px), berat 500.

### Tabs

- Tab bar dengan gap antar tab.
- Indikator aktif berupa garis bawah (`brand-blue`, tinggi 2px).
- Teks aktif menggunakan `ink-900`, non-aktif menggunakan `ink-500`.

### Card

- Testimonial Card: latar `surface-white`, radius `radius-xl` (24px), stroke `line-soft`, padding nyaman.
- Dark Card: latar gelap (`night-950`/`dark-900`), border `line-on-dark`, teks putih/abu-abu terang.

### Composer

- Field input dengan placeholder, tombol mic dan send di sebelah kanan.
- Background `surface-white`, stroke `line-soft`, radius `radius-lg` (14px).

---

## 06 Tata Letak & Grid

| Spesifikasi | Nilai |
|---|---|
| Max content width | 1280px |
| Outer margin | 64px (tiap sisi) |
| Column gap | 24px |
| Section padding | 56px vertikal, 64px horizontal |
| Vertical rhythm | 24px antar section |
| Breakpoints | Mobile ≥ 320px, Tablet ≥ 768px, Desktop ≥ 1024px |

- Grid 12 kolom pada desktop, 1 kolom pada mobile.
- Section padding konsisten: 56px atas/bawah, 64px kiri/kanan.
- Mobile-first, responsif dari 320px hingga 1440px.

---

## Do's and Don'ts

- Gunakan biru `brand-blue` / `primary` untuk semua aksi utama dan state focus.
- Pertahankan kontras teks minimal WCAG AA.
- Gunakan skala tipe yang ditetapkan; jangan perkenalkan ukuran font ad-hoc.
- Jangan gunakan warna di luar palet yang ditetapkan untuk UI chrome.
- Jangan gunakan sudut tajam pada elemen interaktif.
- Jangan tumpuk multiple shadow berat.
- Jangan gunakan warna aksen untuk elemen non-aksi.
- Gunakan font Roobert untuk display/headline, Inter untuk body/UI.
