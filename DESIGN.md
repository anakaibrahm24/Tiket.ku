---
version: alpha
name: Tiket.ku
description: Sistem desain Tiket.ku. Sumber kebenaran token adalah hasil Stitch di .stitch/tiket.ku_design_system.md; nilai dan nama token di bawah mengikuti file tersebut.
---

## Gambaran umum

Tiket.ku adalah platform web pemesanan tiket pertandingan sepak bola, konser, dan acara langsung di area GBK dan kota besar lainnya. Sistem desain ini memakai latar hero gelap (`#020918`–`#051027`), permukaan terang (`#FFFFFF`, `#F7F8F7`), aksen biru utama (`#146DFC`), sudut `14px` pada tombol/input, `24px` pada kartu, `9999px` pada badge, dan transisi `150ms`.

Display memakai **Plus Jakarta Sans** (substitusi Google Fonts untuk Roobert), body/UI memakai **Inter**. Semua nilai tersimpan sebagai design token di `src/app.css`.

---

## 01 Warna

Sumber: `.stitch/tiket.ku_design_system.md` → `colors`. Nama token di bawah persis seperti di Stitch dan tersedia sebagai class Tailwind (mis. `bg-light-inverse-surface`, `text-light-on-primary`, `border-dark-outline-variant`).

```yaml
colors:
  brand-blue: "#146DFC"
  brand-hover: "#006FFF"
  brand-deep: "#0056EC"
  brand-sky: "#BADFFF"
  brand-tint: "#DEF1FF"
  accent: "#F97316"
  success: "#16A34A"
  warning: "#F59E0B"
  danger: "#DC2626"
  light:
    primary: "#146DFC"
    on-primary: "#FFFFFF"
    primary-container: "#006FFF"
    on-primary-container: "#070707"
    secondary: "#0891B2"
    on-secondary: "#1E1E1E"
    secondary-container: "#DEF1FF"
    on-secondary-container: "#0056EC"
    background: "#FFFFFF"
    on-background: "#27272A"
    surface: "#F7F8F7"
    surface-dim: "#EDEEF0"
    surface-bright: "#FFFFFF"
    surface-container-lowest: "#FFFFFF"
    surface-container-low: "#F7F8F7"
    surface-container: "#F2F2F3"
    surface-container-high: "#EDEEF0"
    on-surface: "#27272A"
    surface-variant: "#F2F2F3"
    on-surface-variant: "#606169"
    outline: "#71717A"
    outline-variant: "#E2E8F0"
    inverse-surface: "#020918"
    inverse-on-surface: "#FFFFFF"
  dark:
    primary: "#BADFFF"
    on-primary: "#020918"
    primary-container: "#146DFC"
    on-primary-container: "#FFFFFF"
    background: "#020918"
    on-background: "#FFFFFF"
    surface: "#051027"
    surface-container-lowest: "#020918"
    surface-container-low: "#051027"
    surface-container: "#27272A"
    surface-container-high: "#3B3C3F"
    on-surface: "#FFFFFF"
    on-surface-variant: "#BADFFF"
    outline: "#71717A"
    outline-variant: "#434349"
```

Catatan:

- UI baru memakai `brand-blue` untuk aksi utama dan fokus.
- `light-inverse-surface` dipakai untuk latar hero dan badge kategori; teksnya `light-inverse-on-surface`.
- `dark-outline-variant` dipakai untuk border/divider pada latar gelap.
- `light-outline-variant` dipakai untuk border halus pada latar terang.

### Token kompatibilitas

Nama lama berikut tetap didefinisikan di `src/app.css` sebagai alias agar komponen yang sudah ada tidak berubah. Pakai nama Stitch untuk kode baru.

| Alias lama        | Token kanonik Stitch           |
| ----------------- | ------------------------------ |
| `surface-white`   | `light-surface-bright`         |
| `surface-subtle`  | `light-surface`                |
| `surface-muted`   | `light-surface-container`      |
| `surface-tint`    | `light-surface-dim`            |
| `surface-line`    | `light-outline-variant`        |
| `ink-900`         | `light-on-surface`             |
| `ink-600`         | `light-on-surface-variant`     |
| `ink-500`         | `light-outline`                |
| `night-950`       | `light-inverse-surface`        |
| `night-800`       | `dark-surface`                 |
| `dark-900`        | `dark-surface-container`       |
| `dark-800`        | `dark-surface-container-high`  |
| `dark-700`        | `dark-outline-variant`         |
| `line-on-dark`    | `dark-outline-variant`         |
| `background`      | `light-background`             |
| `border`          | `light-outline-variant`        |
| `primary`         | `light-secondary`              |
| `primary-foreground` | `light-on-primary`          |
| `info`            | `light-secondary`              |
| `support`         | `light-on-surface-variant`     |

Alias berikut tidak punya padanan persis di Stitch dan tetap dicatat sebagai warisan proyek: `ink-700` (`#4F4F55`), `ink-300` (`#BABABF`), `line-soft` (`#0000000F`), `surface` (`#F8FAFC`), `foreground` (`#0F172A`), `muted` (`#64748B`), `primary-hover` (`#0E7490`), `accent-foreground` (`#000000`). Hindari untuk UI baru.

---

## 02 Tipografi

Sumber: `.stitch/tiket.ku_design_system.md` → `typography`. Nama token dipakai sebagai class Tailwind, mis. `text-display-lg`, `font-headline`, `font-title`.

| Token              | Ukuran/Line Height | Berat | Huruf Spasi | Font              | Digunakan untuk         |
| ------------------ | ------------------ | ----- | ----------- | ----------------- | ----------------------- |
| `display-lg`       | 48/52              | 600   | -1.5px      | Plus Jakarta Sans | Headline hero besar     |
| `display-lg-mobile`| 32/38              | 600   | -0.75px     | Plus Jakarta Sans | Headline hero mobile    |
| `headline-lg`      | 38/44              | 600   | -0.76px     | Plus Jakarta Sans | Headline section besar  |
| `headline-lg-mobile`| 28/34             | 600   | -0.5px      | Plus Jakarta Sans | Headline section mobile |
| `headline-md`      | 24/32              | 600   | 0           | Inter             | Judul card dan section  |
| `title-lg`         | 18/24              | 600   | 0           | Inter             | Judul panel             |
| `title-md`         | 16/22              | 600   | 0           | Inter             | Judul item              |
| `body-lg`          | 16/24              | 400   | -0.16px     | Inter             | Paragraf                |
| `body-md`          | 14/20              | 400   | 0           | Inter             | Teks UI                 |
| `label-lg`         | 14/20              | 600   | 0           | Inter             | Label form              |
| `label-md`         | 12/16              | 500   | 0           | Inter             | Metadata                |
| `label-sm`         | 12/16              | 600   | 0           | Inter             | Label kecil             |
| `mono-md`          | 16/22              | 700   | 0           | Inter             | Kode/angka              |
| `mono-sm`          | 12/16              | 500   | 0           | Inter             | Kode kecil              |

Font family tersedia sebagai `font-display`, `font-headline` (Plus Jakarta Sans), `font-title`, `font-body`, `font-label`, `font-mono` (Inter). `font-sans` dan `font-heading` adalah alias kompatibilitas.

---

## 03 Spacing & Radius

Sumber: `.stitch/tiket.ku_design_system.md` → `spacing` dan `rounded`.

### Spacing

| Token         | Nilai |
| ------------- | ----- |
| `gutter-xs`   | 4px   |
| `gutter-sm`   | 8px   |
| `gutter-md`   | 16px  |
| `gutter-lg`   | 24px  |
| `gutter-xl`   | 32px  |
| `section`     | 56px  |
| `page-margin` | 64px  |

Alias lama `spacing-xs` … `spacing-xl` memetakan ke `gutter-xs` … `gutter-xl`. Token `spacing-xxl` (48px) adalah warisan proyek, bukan dari Stitch.

### Radius

| Token       | Nilai  | Digunakan untuk            |
| ----------- | ------ | -------------------------- |
| `DEFAULT`   | 10px   | Elemen standar             |
| `sm` / `md` | 12px   | Badge kecil, panel         |
| `lg`        | 14px   | Tombol, input              |
| `xl`        | 24px   | Card, modal, drawer        |
| `full`      | 9999px | Pill, badge status, avatar |

`radius-base` adalah alias kompatibilitas untuk `DEFAULT`. Jangan campur sudut tajam dengan sudut membulat dalam komponen yang sama.

---

## 04 Elevasi & Kedalaman

Elevasi dicapai melalui shadow halus dan border, bukan overlap berat.

| Token        | Deskripsi     | Digunakan untuk      |
| ------------ | ------------- | -------------------- |
| `shadow-sm`  | Shadow halus  | Card, input, button  |
| `shadow-md`  | Shadow sedang | Card raised, modal   |
| `shadow-lg`  | Shadow besar  | Drawer, modal besar  |
| `shadow-inner` | Shadow inset | Input focus, pressed |

Permukaan flat memakai border `light-outline-variant` atau `dark-outline-variant`, bukan shadow. Tidak ada shadow berat atau berlapis.

---

## 05 Komponen

### Tombol

- Varian: primary, with icon, primary disabled, secondary, icon, OAuth Google.
- Primary: latar `brand-blue`, hover `brand-deep`, teks `light-on-primary`.
- Secondary: latar `light-surface-bright`, border `light-outline-variant`, teks `light-on-surface`.
- Radius `lg` (14px), padding `px-6 py-3`, transisi `150ms ease-out`.

### Input

- Latar `light-surface-bright`, border `light-outline-variant`, focus border `brand-blue`.
- Tinggi 44px, padding horizontal 14px, radius `lg`.
- Error inline berwarna `danger`.

### Badge & Status

- Badge kategori: latar `light-inverse-surface`, teks `light-inverse-on-surface`, radius `full`.
- Status info: latar `brand-tint`, teks `brand-deep`.
- Status aktif: border + teks `success`, dot `success`.
- Status non-aktif: border + teks `danger`, dot `danger`.
- Timer: latar `brand-tint`, teks `brand-deep`, font mono.

### Banner Notifikasi

- Card dengan icon, judul, kode referensi, deskripsi.
- Latar `light-surface`, border `light-outline-variant`, radius `xl`.

### Searchbar

- Input dengan icon search, tombol Cari `brand-blue`.
- Radius `lg`, border `light-outline-variant`, focus border `brand-blue`.

### Tabs (Underline)

- Tab dengan icon + label.
- Indikator aktif `brand-blue` 2px di bawah.
- Teks aktif `light-on-surface`, non-aktif `light-outline`.

### Card Action (Kartu Tiket)

- Media 16:10, badge kategori dan status di atas.
- Judul, tanggal, lokasi.
- Footer harga + tombol aksi.
- Radius `xl`, border `light-outline-variant`, hover border `brand-blue`.

### Card Order History

- Row dengan thumbnail, judul, status, metadata, aksi.
- Radius `xl`, border `light-outline-variant`.

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

Grid 12 kolom pada desktop, 1 kolom pada mobile. Mobile-first, responsif dari 320px hingga 1440px.

---

## Motion

| Nama            | Durasi | Timing                     | Class Tailwind         |
| --------------- | ------ | -------------------------- | ---------------------- |
| `state-change`  | 150ms  | ease-out                   | `duration-state-change`, `ease-state-change` |
| `surface-enter` | 220ms  | cubic-bezier(0.2, 0, 0, 1) | `duration-surface-enter`, `ease-surface-enter` |

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
