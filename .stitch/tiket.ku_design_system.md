---
name: "Tiket.ku"
description: "Design system for Tiket.ku, an event ticket booking platform with dark night-950 hero, brand-blue #146DFC actions, Plus Jakarta Sans (Roobert substitute) + Inter typography, and soft 14px/24px rounded surfaces."
---

## Overview

**Tiket.ku** adalah platform web pemesanan tiket pertandingan sepak bola, konser, dan acara langsung di Indonesia (khususnya area GBK dan kota besar lainnya). Sistem desain ini menggabungkan latar hero gelap (`#020918` – `#051027`), permukaan konten terang bersih (`#FFFFFF` dan `#F7F8F7`), aksen biru utama (`#146DFC`), serta sudut membulat lembut (`14px` pada tombol/input, `24px` pada kartu, `9999px` pada badge).

## Colors

Warna utama menggunakan `brand-blue` (`#146DFC`) dengan `on-primary: "#FFFFFF"` untuk aksi utama dan fokus, `night-950` (`#020918`) dan `night-800` (`#051027`) untuk latar hero gelap dengan teks `brand-sky` (`#BADFFF`), serta `surface-white` (`#FFFFFF`) dan `ink-900` (`#27272A`) untuk area katalog.

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

## Typography

Display menggunakan **Plus Jakarta Sans** (substitusi Google Fonts terdekat untuk **Roobert** yang tidak tersedia di Google Fonts) dengan tracking negatif yang ringkas, dipadukan dengan **Inter** untuk teks body, navigasi, dan label.

```yaml
typography:
  display-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 52px
    letterSpacing: -1.5px
  display-lg-mobile:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 38px
    letterSpacing: -0.75px
  headline-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 38px
    fontWeight: 600
    lineHeight: 44px
    letterSpacing: -0.76px
  headline-lg-mobile:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 34px
    letterSpacing: -0.5px
  headline-md:
    fontFamily: "Inter"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: 0px
  title-lg:
    fontFamily: "Inter"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  title-md:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: -0.16px
  body-md:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  label-md:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
  label-sm:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0px
  mono-md:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 22px
    letterSpacing: 0px
  mono-sm:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
```

## Layout & Spacing

Menggunakan max-width `1280px` (`max-w-7xl`), grid 12 kolom / 4 kolom kartu pada desktop dengan `24px` gutter (`gap-6`), dan skala spacing kelipatan `8px`.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 56px
  page-margin: 64px
```

## Elevation & Depth

Elevasi dicapai melalui shadow halus (`shadow-sm` / ambient border `#E2E8F0`) pada card dan modal, tanpa shadow berlapis yang berat.

## Shapes

Sudut membulat lembut dan konsisten: `12px` (`sm`/`md`) untuk badge kecil dan panel, `14px` (`lg`) untuk tombol dan input, `24px` (`xl`) untuk kartu acara dan modal/drawer, serta `9999px` (`full`) untuk pill dan badge status. Tidak ada sudut tajam pada elemen interaktif.

```yaml
rounded:
  sm: 12px
  DEFAULT: 10px
  md: 12px
  lg: 14px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Transisi warna dan hover berlangsung cepat (`150ms` `ease-out`), sementara panel geser masuk dalam `220ms` dengan kurva deselerasi halus.

```yaml
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 220ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
```

## Voice & Content Strategy

Bahasa Indonesia yang jelas, ramah, dan langsung pada tindakan (*Pilih Tiket*, *Beli Tiket*, *Pesan Sekarang*, *Cari Acara*).
