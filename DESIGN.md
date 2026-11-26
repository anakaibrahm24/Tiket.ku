---
version: alpha
name: Tiket.ku
description: Design system for Tiket.ku, an event ticket booking platform for Stadion GBK. Fondasi visual diekstrak dari Stitch: warna, tipografi Plus Jakarta Sans + Inter, spacing, radius, elevation, motion, dan komponen dasar.
---

## Gambaran umum

Tiket.ku adalah platform web untuk pemesanan tiket pertandingan sepak bola, konser, dan acara langsung di area GBK dan kota besar lainnya. Sistem desain ini menggabungkan latar hero gelap (`#020918` - `#051027`), permukaan konten terang bersih (`#FFFFFF` dan `#F7F8F7`), aksen biru utama (`#146DFC`), sudut membulat lembut (`14px` tombol/input, `24px` kartu, `9999px` badge), dan motion cepat `150ms`.

Display menggunakan **Plus Jakarta Sans** (substitusi Google Fonts untuk Roobert), body menggunakan **Inter**.

Semua nilai tersimpan sebagai design token di `src/app.css`.

---

## 01 Warna

### Brand & Aksen

| Token         | Nilai     | Digunakan untuk                              |
| ------------- | --------- | -------------------------------------------- |
| `brand-blue`  | `#146DFC` | Aksi utama, tombol primary, fokus            |
| `brand-hover` | `#006FFF` | Hover/active state tombol primary            |
| `brand-deep`  | `#0056EC` | Dark variant brand                           |
| `brand-sky`   | `#BADFFF` | Teks sekunder pada latar gelap, aksen terang |
| `brand-tint`  | `#DEF1FF` | Background ringan dengan nuansa brand        |
| `accent`      | `#F97316` | Call to action intensitas tinggi             |

### Surface (Latar)

| Token            | Nilai     | Digunakan untuk                  |
| ---------------- | --------- | -------------------------------- |
| `surface-white`  | `#FFFFFF` | Background utama, card, input    |
| `surface-subtle` | `#F7F8F7` | Section background halus         |
| `surface-muted`  | `#F2F2F3` | Background elemen non-interaktif |
| `surface-tint`   | `#EDEEF0` | Background aktif/hover ringan    |
| `surface-line`   | `#ECECED` | Pemisah halus                    |

### Teks & Ikon (Ink)

| Token     | Nilai     | Digunakan untuk     |
| --------- | --------- | ------------------- |
| `ink-900` | `#27272A` | Teks utama, judul   |
| `ink-700` | `#4F4F55` | Teks sekunder       |
| `ink-600` | `#606169` | Teks body muted     |
| `ink-500` | `#71717A` | Placeholder, label  |
| `ink-300` | `#BABABF` | Teks disabled, meta |

### Surface Gelap (Dark)

| Token       | Nilai     | Digunakan untuk                          |
| ----------- | --------- | ---------------------------------------- |
| `night-950` | `#020918` | Background gelap terluas (hero gradient) |
| `night-800` | `#051027` | Gradient tengah gelap                    |
| `dark-900`  | `#27272A` | Surface gelap                            |
| `dark-800`  | `#3B3C3F` | Surface gelap sedang                     |
| `dark-700`  | `#434349` | Border/divider pada latar gelap          |

### Garis (Line)

| Token          | Nilai       | Digunakan untuk                |
| -------------- | ----------- | ------------------------------ |
| `line-soft`    | `#0000000F` | Border halus pada latar terang |
| `line-on-dark` | `#FFFFFF1F` | Border halus pada latar gelap  |

### Warna Semantik

| Token        | Nilai     | Digunakan untuk                           |
| ------------ | --------- | ----------------------------------------- |
| `background` | `#FFFFFF` | Kanvas halaman                            |
| `surface`    | `#F8FAFC` | Card, panel, input                        |
| `foreground` | `#0F172A` | Teks utama                                |
| `muted`      | `#64748B` | Teks sekunder dan placeholder             |
| `border`     | `#E2E8F0` | Pembagi dan border input                  |
| `primary`    | `#0891B2` | Aksi utama legacy (hindari untuk UI baru) |
| `accent`     | `#F97316` | Call to action intensitas tinggi          |
| `success`    | `#16A34A` | Status berhasil                           |
| `warning`    | `#F59E0B` | Status peringatan                         |
| `danger`     | `#DC2626` | Status error                              |
| `info`       | `#0891B2` | Informasi tambahan                        |

Catatan: UI baru memakai `brand-blue` sebagai aksi utama; `primary`/`accent` legacy dipertahankan untuk kompatibilitas.

---

## 02 Tipografi

Typeface display menggunakan **Plus Jakarta Sans**, body menggunakan **Inter** dengan fallback sistem. Semua ukuran menggunakan skala type yang ditetapkan; jangan perkenalkan ukuran font ad-hoc.

| Jenis              | Ukuran/Line Height | Berat | Huruf Spasi | Font              | Digunakan untuk         |
| ------------------ | ------------------ | ----- | ----------- | ----------------- | ----------------------- |
| Display LG         | 48/52              | 600   | -1.5px      | Plus Jakarta Sans | Headline hero besar     |
| Display LG Mobile  | 32/38              | 600   | -0.75px     | Plus Jakarta Sans | Headline hero mobile    |
| Headline LG        | 38/44              | 600   | -0.76px     | Plus Jakarta Sans | Headline section besar  |
| Headline LG Mobile | 28/34              | 600   | -0.5px      | Plus Jakarta Sans | Headline section mobile |
| Headline MD        | 24/32              | 600   | 0           | Inter             | Judul card dan section  |
| Title LG           | 18/24              | 600   | 0           | Inter             | Judul panel             |
| Title MD           | 16/22              | 600   | 0           | Inter             | Judul item              |
| Body LG            | 16/24              | 400   | -0.16px     | Inter             | Paragraf                |
| Body MD            | 14/20              | 400   | 0           | Inter             | Teks UI                 |
| Label LG           | 14/20              | 600   | 0           | Inter             | Label form              |
| Label MD           | 12/16              | 500   | 0           | Inter             | Metadata                |
| Label SM           | 12/16              | 600   | 0           | Inter             | Label kecil             |
| Mono MD            | 16/22              | 700   | 0           | Inter             | Kode/angka              |
| Mono SM            | 12/16              | 500   | 0           | Inter             | Kode kecil              |

Catatan:

- Display menggunakan Plus Jakarta Sans dengan letter-spacing negatif untuk tampilan modern dan ringkas.
- Body dan UI menggunakan Inter untuk keterbacaan maksimal.
- Pertahankan line height yang ditetapkan.

---

## 03 Spacing & Radius

### Spacing Scale

| Token         | Nilai |
| ------------- | ----- |
| `gutter-xs`   | 4px   |
| `gutter-sm`   | 8px   |
| `gutter-md`   | 16px  |
| `gutter-lg`   | 24px  |
| `gutter-xl`   | 32px  |
| `section`     | 56px  |
| `page-margin` | 64px  |

### Radius Scale

| Token       | Nilai  | Digunakan untuk            |
| ----------- | ------ | -------------------------- |
| `sm` / `md` | 12px   | Badge kecil, panel         |
| `DEFAULT`   | 10px   | Elemen standar             |
| `lg`        | 14px   | Tombol, input              |
| `xl`        | 24px   | Card, modal, drawer        |
| `full`      | 9999px | Pill, badge status, avatar |

Jangan campur sudut tajam dengan sudut membulat dalam komponen yang sama.

---

## 04 Elevasi & Kedalaman

Elevasi dicapai melalui shadow halus dan border, bukan overlap berat.

| Jenis          | Deskripsi     | Digunakan untuk      |
| -------------- | ------------- | -------------------- |
| `shadow-sm`    | Shadow halus  | Card, input, button  |
| `shadow-md`    | Shadow sedang | Card raised, modal   |
| `shadow-lg`    | Shadow besar  | Drawer, modal besar  |
| `shadow-inner` | Shadow inset  | Input focus, pressed |

- Gunakan shadow halus untuk card, modal, dan dropdown.
- Permukaan flat menggunakan border (`line-soft` atau `line-on-dark`), bukan shadow.
- Tidak ada shadow berat atau berlapis.

---

## 05 Komponen

### Tombol

Varian: primary, with icon, primary disabled, secondary, icon, OAuth Google.

- Background primary: `brand-blue`, hover `brand-deep`, teks putih.
- Background secondary: surface putih, border `line-soft`, teks `ink-900`.
- Radius `lg` (14px), padding `px-6 py-3`.
- Transisi `150ms ease-out`.

### Input

- Background `surface-white`, border `line-soft`, focus border `brand-blue`.
- Tinggi 44px, padding horizontal 14px, radius `lg`.
- Error inline berwarna `danger`.

### Badge & Status

- Badge kategori: `light-inverse-surface` background, teks putih, radius full.
- Status info: `brand-tint` background, teks `brand-deep`.
- Status aktif: border + teks `success`, dot `success`.
- Status non-aktif: border + teks `danger`, dot `danger`.
- Timer: `brand-tint` background, teks `brand-deep`, font mono.

### Banner Notifikasi

- Card dengan icon, judul, kode referensi, deskripsi.
- Background `surface`, border `line-soft`, radius `xl`.

### Searchbar

- Input dengan icon search, tombol Cari `brand-blue`.
- Radius `lg`, border `line-soft`, focus border `brand-blue`.

### Tabs (Underline)

- Tab dengan icon + label.
- Indikator aktif `brand-blue` 2px di bawah.
- Teks aktif `ink-900`, non-aktif `ink-500`.

### Card Action (Kartu Tiket)

- Media 16:10, badge kategori dan status di atas.
- Judul, tanggal, lokasi.
- Footer harga + tombol aksi.
- Radius `xl`, border `line-soft`, hover border `brand-blue`.

### Card Order History

- Row dengan thumbnail, judul, status, metadata, aksi.
- Radius `xl`, border `line-soft`.

### Stepper, Radio Selector, Drawer, QR Pass, Summary

- Stepper horizontal dengan indikator aktif.
- Radio selector dengan border aktif `brand-blue`.
- Drawer panel dari kanan, radius `xl`, shadow-lg.
- QR pass card dengan kode dan status.
- Summary card dengan total dan aksi.

---

## 06 Tata Letak & Grid

| Spesifikasi       | Nilai                                            |
| ----------------- | ------------------------------------------------ |
| Max content width | 1280px                                           |
| Outer margin      | 64px (tiap sisi)                                 |
| Column gap        | 24px                                             |
| Section padding   | 56px vertikal, 64px horizontal                   |
| Vertical rhythm   | 24px antar section                               |
| Breakpoints       | Mobile ≥ 320px, Tablet ≥ 768px, Desktop ≥ 1024px |

- Grid 12 kolom pada desktop, 1 kolom pada mobile.
- Section padding konsisten.
- Mobile-first, responsif dari 320px hingga 1440px.

---

## Motion

| Nama          | Durasi | Timing                     |
| ------------- | ------ | -------------------------- |
| State change  | 150ms  | ease-out                   |
| Surface enter | 220ms  | cubic-bezier(0.2, 0, 0, 1) |

---

## Do's and Don'ts

- Gunakan `brand-blue` untuk semua aksi utama dan state focus.
- Pertahankan kontras teks minimal WCAG AA.
- Gunakan skala tipe yang ditetapkan; jangan perkenalkan ukuran font ad-hoc.
- Jangan gunakan warna di luar palet yang ditetapkan untuk UI chrome.
- Jangan gunakan sudut tajam pada elemen interaktif.
- Jangan tumpuk multiple shadow berat.
- Jangan gunakan warna aksen untuk elemen non-aksi.
- Gunakan Plus Jakarta Sans untuk display/headline, Inter untuk body/UI.
