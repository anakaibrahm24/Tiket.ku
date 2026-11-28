---
title: Audit Landing Page Tiket.ku dan Placeholder Konten
date: 2026-11-26
status: draft
---

# Audit Landing Page Tiket.ku dan Placeholder Konten

## Intent

Melakukan audit tampilan landing page Tiket.ku (hero, agenda, keunggulan, venue, CTA, footer, navbar) terhadap `DESIGN.md` dan canvas Stitch, lalu menyesuaikan UI/UX dan aksesibilitas. Konten nyata (gambar, info acara, harga, status) diganti dengan placeholder campuran agar landing page tetap terasa lengkap tanpa bergantung data real.

## Goals

- Konsistensi visual dengan token `DESIGN.md`.
- Perbaikan aksesibilitas dasar (contrast, focus, semantic, responsive, keyboard).
- Placeholder campuran: gambar box abu + icon, teks placeholder untuk info/harga/status.
- Tidak mengubah logika bisnis, routing, atau data service.

## Non-goals

- Tidak audit halaman lain (matches, payment, tickets, users).
- Tidak menambah data real atau integrasi backend.
- Tidak refactor komponen reusable di luar kebutuhan landing.

## Constraints

- Tetap gunakan komponen existing (`Button`, `CardAction`, `Navbar`, `Footer`, dll.).
- Ikuti token warna, tipografi, spacing, radius, motion.
- Bahasa UI tetap Bahasa Indonesia.
- Verifikasi: `npm run lint`, `npm run build`, `npx tsc -b`.

## Approaches

1. **Manual audit saja** — cepat, tapi rawan miss a11y.
2. **impeccable saja** — bagus visual/UX, a11y kurang lengkap.
3. **impeccable + web-design-guidelines + placeholder campuran** — cakupan paling lengkap. **Dipilih.**

## Decisions

- Audit visual/UX menggunakan skill `impeccable`.
- Audit aksesibilitas/best practices menggunakan skill `web-design-guidelines`.
- Gambar: box abu dengan icon placeholder (`image`/`photo`).
- Info acara: teks placeholder seperti "Judul Acara", "Tanggal & Waktu", "Lokasi".
- Harga: "Rp ---".
- Status: "Status" (badge netral) atau badge placeholder.
- CTA dan interaksi (scroll, navigasi) tetap berfungsi.

## Placeholder Rules

- Gambar tidak menggunakan URL eksternal; gunakan `div` dengan background `surface-subtle` dan icon.
- Teks placeholder jelas sebagai placeholder, bukan data palsu.
- Card tetap memiliki struktur media, judul, metadata, footer harga + aksi.
- Jangan hapus komponen yang masih dipakai.

## Verification

- `npm run lint`
- `npm run build`
- `npx tsc -b` dengan `NODE_OPTIONS=--max-old-space-size=4096`
- Cek manual: desktop, tablet, mobile; keyboard focus; contrast.

## Open Questions

- Apakah placeholder gambar perlu skeleton animasi atau statis?
- Apakah status placeholder perlu warna netral atau badge outline?
