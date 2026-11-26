# Pembersihan Struktur Proyek — Desain (Phase 0)

**Tanggal:** 2026-11-23  
**Status:** Disetujui untuk dibuatkan rencana implementasi

## Maksud

Bersihkan struktur `src/` agar konsisten dengan `AGENTS.md`, bebas dead code, dan lolos type-check. Perilaku aplikasi dan route yang sudah ada tidak diubah.

## Tujuan

- Hapus file/komponen yang seluruhnya terkomentar atau tidak direferensikan.
- Samakan nama folder, file, dan import dengan konvensi `AGENTS.md`.
- Perbaiki error `tsc -b` yang sedang ada.
- Buat `npm run build` menjalankan `tsc -b` sebelum `vite build`.
- Siapkan `.env.example` tanpa membocorkan nilai asli.
- Pertahankan route aktif: `/`, `/matchs`, `/login`, `/signup`, `/auth/callback`.

## Non-tujuan

- Rename `matches → events` atau `/matchs → /events`.
- Migrasi skema Supabase `matches → events`.
- Implementasi halaman order, detail acara, pembayaran penuh, atau e-ticket QR.
- Menambah dependency, test framework, atau global state.
- Commit perubahan tanpa persetujuan pengguna.

## Constraint

- TypeScript strict: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Tanpa `any` atau `@ts-ignore`.
- Alias wajib: `@/* → src/*`, `@/home/* → src/features/home/*`.
- Teks UI Bahasa Indonesia.
- Tanpa blok kode terkomentar dan tanpa dead code.
- Akses Supabase hanya lewat service layer, bukan langsung di komponen.
- Branch baru per progress; tidak commit langsung ke `main`/`master`.
- Test otomatis belum dikonfigurasi. Verifikasi memakai `npm run lint`, `npm run build`, dan manual QA.

## Pendekatan

1. **Phase 0 cleanup (dipilih):** hapus dead code, perbaiki tipe/build, rapikan folder, update tooling. Risiko rendah, perilaku tidak berubah.
2. Full alignment PRD sekarang: ditolak karena menyentuh route, tipe data, dan halaman yang belum ada.
3. Cleanup tanpa perbaikan build: ditolak karena `tsc -b` masih gagal.

## Keputusan desain

- `src/features/tickets/` dihapus: isinya hanya `Ticket.tsx` yang seluruhnya terkomentar dan tidak di-route.
- `src/features/users/` dihapus: semua file hanya dipakai oleh `RegisterForm.tsx` yang juga terkomentar.
- `src/features/payment/` tetap dipertahankan dan diperbaiki minimal, karena merupakan scaffold P0 yang memang direncanakan.
- `src/features/matches/` tetap memakai nama dan route lama untuk sementara.
- Tipe match disatukan di `src/features/matches/types/matches.ts`.
- `src/lib/utiils.ts` direname menjadi `src/lib/utils.ts`.
- Komponen khusus home dipindah ke `src/features/home/components/`; komponen shared tetap di `src/components/`.
- `FormField` tidak dibuat ulang; pemakaiannya di `Payment.tsx` diganti `<div>` karena hanya satu pemakai.
- `ponytail:` test otomatis tidak ditambahkan sekarang; tambahkan saat Vitest + RTL sudah disiapkan pada progress terpisah.

## Peta file target

```text
src/
├─ App.tsx
├─ components/                 # shared saja
│  ├─ index.ts
│  ├─ Alerts.tsx
│  ├─ Button.tsx
│  ├─ Dropdown.tsx
│  ├─ Footer.tsx
│  ├─ FooterLinks.tsx
│  ├─ InputField.tsx
│  └─ Navbar.tsx
├─ features/
│  ├─ auth/                    # tidak berubah
│  ├─ home/
│  │  ├─ components/
│  │  │  ├─ CTABanner.tsx
│  │  │  ├─ FeatureCard.tsx
│  │  │  ├─ Features.tsx
│  │  │  ├─ Hero.tsx
│  │  │  ├─ ScheduleCard.tsx
│  │  │  └─ SchedulePreview.tsx
│  │  └─ page/Home.tsx
│  ├─ matches/
│  │  ├─ components/Card.tsx
│  │  ├─ components/TeamSection.tsx
│  │  ├─ hooks/useMatchData.ts
│  │  ├─ page/Matches.tsx
│  │  ├─ service/matchService.ts
│  │  └─ types/matches.ts
│  └─ payment/
│     ├─ components/PaymentMethods.tsx
│     ├─ hooks/usePayment.ts
│     ├─ page/Payment.tsx
│     └─ schemas/paymentSchema.ts
├─ hooks/useSession.ts
└─ lib/
   ├─ supabase.ts
   └─ utils.ts
```

Dihapus: `src/features/tickets/`, `src/features/users/`, `src/services/userService.ts`, `src/lib/utiils.ts`, artefak `dist/`.
