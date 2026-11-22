---
version: alpha
name: Tiket.ku
description: Design system for Tiket.ku, an event ticket booking platform for Stadion GBK.
colors:
  background: "#FFFFFF"
  surface: "#F8FAFC"
  foreground: "#0F172A"
  muted: "#64748B"
  border: "#E2E8F0"
  primary: "#2563EB"
  primary-hover: "#1D4ED8"
  primary-foreground: "#FFFFFF"
  accent: "#F97316"
  success: "#16A34A"
  warning: "#F59E0B"
  danger: "#DC2626"
typography:
  display:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 36px
    lineHeight: 40px
    fontWeight: 700
  h1:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 30px
    lineHeight: 36px
    fontWeight: 700
  h2:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 24px
    lineHeight: 32px
    fontWeight: 600
  h3:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 20px
    lineHeight: 28px
    fontWeight: 600
  body:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 16px
    lineHeight: 24px
    fontWeight: 400
  small:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 14px
    lineHeight: 20px
    fontWeight: 400
  caption:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 12px
    lineHeight: 16px
    fontWeight: 500
rounded:
  base: 10px
---

## Gambaran umum

Tiket.ku adalah platform web untuk pemesanan tiket pertandingan sepak bola dan konser di Stadion Gelora Bung Karno (GBK). Antarmuka modern dan energik: tema terang yang bersih dengan warna aksi utama biru yang kuat dan aksen oranye hangat untuk aksi berintensitas tinggi seperti pembelian tiket. Tata letak nyaman dan mudah dibaca di mobile maupun desktop. Permukaan menggunakan elevasi halus; sudut konsisten membulat.

## Warna

- **background** adalah kanvas halaman putih murni.
- **surface** adalah slate sangat terang untuk card, panel, dan input.
- **foreground** adalah slate mendekati hitam untuk teks utama.
- **muted** adalah slate tengah untuk teks sekunder dan placeholder.
- **border** adalah slate terang untuk pembagi dan border input.
- **primary** adalah warna aksi utama untuk tombol, tautan, dan focus ring. Gunakan **primary-hover** pada hover/active.
- **primary-foreground** adalah teks putih pada permukaan primary.
- **accent** (oranye) dicadangkan untuk call to action berintensitas tinggi seperti "Beli Tiket" dan highlight harga.
- **success**, **warning**, dan **danger** digunakan hanya untuk umpan balik status.

## Tipografi

- Typeface adalah Inter dengan fallback sistem.
- Gunakan **display** untuk headline hero, **h1**–**h3** untuk judul section dan card, **body** untuk paragraf dan label form, **small** untuk teks bantu, dan **caption** untuk metadata dan badge.
- Pertahankan line height yang ditetapkan; jangan perketat di bawah nilai yang ditentukan.

## Tata letak

- Mobile-first, responsif dari 320px hingga 1440px.
- Kepadatan nyaman: spacing lega antar section dan field form.
- Satu kolom di mobile; grid multi-kolom di desktop untuk card acara.
- Lebar konten maksimum 1280px, terpusat, dengan padding horizontal.

## Elevasi & kedalaman

- Gunakan shadow halus untuk card, modal, dan dropdown.
- Permukaan flat menggunakan border, bukan shadow.
- Tidak ada shadow berat atau berlapis.

## Bentuk

- Semua permukaan interaktif (tombol, input, card, modal) menggunakan **rounded.base** (10px).
- Elemen yang sepenuhnya membulat (badge, pill, avatar) menggunakan 9999px.
- Jangan campur sudut tajam dengan sudut membulat dalam komponen yang sama.

## Komponen

- **Button (primary):** background primary, teks putih, rounded.base, padding sedang. State disabled mengurangi opacity dan menampilkan spinner.
- **Button (secondary):** background surface, teks foreground, rounded.base.
- **Input:** background putih, border, rounded.base, dengan floating label dan teks error inline berwarna danger.
- **Card:** background surface, rounded.base, shadow halus, padding nyaman.
- **Badge:** teks caption, rounded pill, background warna muted atau status.

## Do's and Don'ts

- Gunakan biru primary untuk semua aksi utama dan state focus.
- Pertahankan kontras teks minimal WCAG AA.
- Gunakan skala tipe yang ditetapkan; jangan perkenalkan ukuran font ad-hoc.
- Jangan gunakan warna di luar palet yang ditetapkan untuk UI chrome.
- Jangan gunakan sudut tajam pada elemen interaktif.
- Jangan tumpuk multiple shadow berat.
- Jangan gunakan warna aksen untuk elemen non-aksi.
