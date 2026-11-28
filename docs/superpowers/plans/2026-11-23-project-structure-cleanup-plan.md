# Pembersihan Struktur Proyek — Rencana Implementasi

> **Untuk pekerja agen:** SUB-SKILL WAJIB: Gunakan `superpowers:subagent-driven-development` (direkomendasikan) atau `superpowers:executing-plans` untuk mengerjakan rencana ini task-per-task. Langkah memakai sintaks checkbox (`- [ ]`) untuk tracking.

**Tujuan:** Bersihkan dead code, satukan tipe match, rapikan folder/import, dan buat `npm run build` menjalankan type-check tanpa mengubah route atau perilaku aplikasi.

**Arsitektur:** Phase 0 cleanup pada SPA React existing. Perubahan dibatasi pada penghapusan file mati, konsolidasi tipe di `features/matches/types`, pemindahan komponen khusus home ke `features/home/components`, dan perbaikan tooling. Route aktif `/`, `/matchs`, `/login`, `/signup`, `/auth/callback` tetap sama.

**Tech Stack:** React 19, Vite 6, TypeScript 5.7 strict, React Router 7, Tailwind CSS 4, Supabase JS, React Hook Form + Zod.

**Spesifikasi:** `docs/superpowers/specs/2026-11-23-project-structure-cleanup-design.md`

## Global Constraints

- Node.js v20+ (diuji v26), npm v10+.
- Package manager npm; lockfile `package-lock.json`. Jangan tambah lockfile pnpm/yarn.
- `npm install`, `npm run dev` (port 5173), `npm run lint`.
- `npm run build` harus menjalankan `tsc -b` lalu `vite build`.
- TypeScript strict: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Tanpa `any` dan tanpa `@ts-ignore`.
- Alias path: `@/* → src/*`, `@/home/* → src/features/home/*`. Pakai alias, bukan `../../../`.
- Teks UI Bahasa Indonesia.
- Tanpa blok kode terkomentar dan tanpa dead code.
- Zod schema di `src/features/<fitur>/schema` atau `schemas`, dipasang via `zodResolver`.
- Akses Supabase hanya lewat service layer yang memanggil `src/lib/supabase.ts`.
- Error ditampilkan via `Alerts` atau inline field error. Dilarang `alert()`.
- Loading state: tombol submit dinonaktifkan dan spinner aktif.
- Branch baru per progress. Jangan commit langsung ke `main`/`master`.
- **Jangan `git add` dan jangan `git commit` tanpa persetujuan pengguna.** Task diakhiri dengan review, bukan commit.
- Test otomatis belum dikonfigurasi. Verifikasi pakai `npx tsc -b`, `npm run lint`, `npm run build`, dan manual QA.
- `ponytail:` Vitest/RTL tidak ditambahkan sekarang; tambahkan saat harness test tersedia.

## Review Focus

- Modul tipe match yang hilang → Task 3 verifikasi `npx tsc -b` harus kehilangan error `TS2307` related `matchesPayload`.
- Prop `InputField` tidak cocok (`errorMessage` vs `error`, `required` wajib) → Task 4 verifikasi `npx tsc -b` bebas `TS2322` di `Payment.tsx`.
- Import komponen home setelah dipindah → Task 6 verifikasi `npx tsc -b` lolos dan manual QA halaman `/` menampilkan hero, fitur, jadwal, CTA.
- `Alerts` hanya punya default export tetapi barrel memakai `export *` → Task 6 ubah barrel ke `export { default as Alerts }`, manual QA error login tetap muncul.
- `npm run build` sebelumnya hanya `vite build` sehingga type error tidak terdeteksi → Task 7 verifikasi `npm run build` menampilkan tahap `tsc -b`.

---

### Task 1: Branch dan baseline

**Files:** tidak ada file sumber diubah.

**Interfaces:**
- Consumes: kondisi branch kerja saat ini.
- Produces: branch `refactor/project-structure-cleanup`.

- [ ] **Step 1: Buat branch kerja**

Jalankan:
```bash
git checkout -b refactor/project-structure-cleanup
```
Expected: branch aktif `refactor/project-structure-cleanup`.

- [ ] **Step 2: Rekam baseline type error**

Jalankan:
```bash
npx tsc -b
```
Expected: GAGAL dengan 5 error `TS2307`untuk `matchesPayload`/`matchesProps` dan 5 error di `Payment.tsx` (`FormField` dan prop `errorMessage`). Error ini yang harus hilang di Task 3–4.

- [ ] **Step 3: Rekam baseline lint**

Jalankan:
```bash
npm run lint
```
Expected: 0 error. Satu warning existing di `.agents/skills/shadcn/assets/showcase/state-matrix.tsx` boleh tetap.

- [ ] **Step 4: Serahkan untuk review**

Jangan commit. Lanjut ke Task 2 setelah branch dan baseline dikonfirmasi.

---

### Task 2: Hapus dead code

**Files:**
- Delete: `src/features/tickets/` (seluruh folder)
- Delete: `src/features/users/` (seluruh folder)
- Delete: `src/services/userService.ts`
- Delete: `dist/`
- Modify: `src/App.tsx`
- Modify: `src/features/payment/page/Payment.tsx`
- Modify: `src/features/matches/service/matchService.ts`

**Interfaces:**
- Consumes: baseline Task 1.
- Produces: tidak ada simbol baru. Semua referensi ke modul dihapus hilang.

- [ ] **Step 1: Hapus folder/file mati**

Hapus persis:
```text
src/features/tickets/
src/features/users/
src/services/userService.ts
dist/
```
Alasan: `Ticket.tsx`, `RegisterForm.tsx`, `useUsers.ts`, `userServices.ts`, dan `userService.ts` seluruhnya terkomentar; `TicketCard`, `useUserRegister`, `userSchema`, `userPayload.d.ts` hanya dipakai `RegisterForm` yang mati. `dist/` artefak build dan sudah di-ignore.

- [ ] **Step 2: Bersihkan `src/App.tsx`**

Hapus baris:
```tsx
// import Ticket from "./features/tickets/component/Ticket";
// import RegisterForm from "./features/users/page/RegisterForm";
```
Hapus tiga baris `<Route ...>` yang dikomentar di dalam `<Routes>`. Rapikan baris kosong berlebih. Pertahankan lima route aktif.

- [ ] **Step 3: Bersihkan komentar mati di `Payment.tsx`**

Hapus semua baris yang diawali `//` di `src/features/payment/page/Payment.tsx`, termasuk komentar `userDatas`, pencarian `user`, `localStorage`, dan navigasi alternatif. Jangan mengubah logika `onSubmit` yang aktif.

- [ ] **Step 4: Hapus debug log di `matchService.ts`**

Hapus dua baris:
```ts
console.log(data);
console.log(error);
```
Pertahankan `if (error) throw error;` dan `return data as MatchPayload[];`.

- [ ] **Step 5: Verifikasi tidak ada referensi sisa**

Jalankan:
```bash
git grep -n "selectedMatchId\|selectedUserId\|RegisterForm\|features/users\|features/tickets\|services/userService" -- src
```
Expected: tidak ada output.

- [ ] **Step 6: Cek lint**

Jalankan:
```bash
npm run lint
```
Expected: 0 error.

- [ ] **Step 7: Serahkan untuk review**

Jangan commit.

---

### Task 3: Satukan tipe match

**Files:**
- Create: `src/features/matches/types/matches.ts`
- Modify: `src/features/matches/components/Card.tsx`
- Modify: `src/features/matches/components/TeamSection.tsx`
- Modify: `src/features/matches/hooks/useMatchData.ts`
- Modify: `src/features/matches/service/matchService.ts`

**Interfaces:**
- Consumes: `MatchPayload` dipakai `useMatchData` dan `matchService`; `TeamPayload` dipakai `TeamSection`; `MatchCardProps` dipakai `Card`.
- Produces:
```ts
export interface TeamPayload {
  name: string;
  logo: string;
}

export interface MatchPayload {
  id: string;
  matchId: string;
  team_home: string;
  logo_home: string;
  team_away: string;
  logo_away: string;
  match_time: string;
  time_zone: string;
  match_date: string;
  stadium: string;
  tickets?: Record<string, unknown>;
}

export type MatchCardProps = Omit<
  MatchPayload,
  "id" | "matchId" | "tickets"
> & {
  onClick?: () => void;
};
```

- [ ] **Step 1: Buat file tipe tunggal**

Buat `src/features/matches/types/matches.ts` berisi tiga deklarasi pada blok Interfaces di atas. Tanpa `any`. Tanpa `// src/features/match/...` komentar header lama.

- [ ] **Step 2: Update `Card.tsx`**

Ganti dua import lama:
```ts
import { MatchPayload } from "../types/matchesPayload";
import { MatchCardProps } from "./matchesProps";
```
dengan satu import:
```ts
import type { MatchCardProps } from "../types/matches";
```
Hapus deklarasi lokal `type MatchCardProps = ...` yang sekarang duplikat. Pertahankan destructuring props dan JSX yang ada.

- [ ] **Step 3: Update tiga file lain**

Ganti import tipe berikut ke `../types/matches`:
- `TeamSection.tsx`: `TeamPayload`
- `useMatchData.ts`: `MatchPayload`
- `matchService.ts`: `MatchPayload`

Hapus komentar header `// src/features/match/hooks/useMatchData.ts` di `useMatchData.ts`.

- [ ] **Step 4: Verifikasi error match hilang**

Jalankan:
```bash
npx tsc -b
```
Expected: GAGAL, tetapi hanya karena `Payment.tsx`. Tidak boleh ada `TS2307` untuk `matchesPayload`, `matchesPayload.types`, atau `matchesProps`.

- [ ] **Step 5: Serahkan untuk review**

Jangan commit.

---

### Task 4: Perbaiki halaman Payment

**Files:**
- Modify: `src/features/payment/page/Payment.tsx`

**Interfaces:**
- Consumes: `PaymentFormValidation()` dari `../hooks/usePayment` mengembalikan method React Hook Form (`register`, `handleSubmit`, `formState`).
- Produces: halaman `Payment` yang lolos type-check dan memakai teks UI Indonesia.

- [ ] **Step 1: Perbaiki import**

Ganti:
```tsx
import { Button, FormField, InputField } from "../../../components";
```
dengan:
```tsx
import { Button, InputField } from "@/components";
```

- [ ] **Step 2: Ganti wrapper FormField**

Ganti pasangan tag:
```tsx
<FormField className="flex-col gap-4 p-5 w-auto">
...
</FormField>
```
dengan:
```tsx
<div className="flex flex-col gap-4 p-5 w-auto">
...
</div>
```

- [ ] **Step 3: Samakan props InputField**

Pada keempat `<InputField>`, ganti `errorMessage={...}` menjadi `error={...}` dan tambahkan `required`. Contoh untuk field pertama:
```tsx
<InputField
  labelName="Nama Pemegang Kartu"
  error={formState.errors.nameOnCard?.message}
  register={register("nameOnCard")}
  required
/>
```
Lakukan sama untuk `cardNumber`, `cvv`, `validTHRU`.

- [ ] **Step 4: Terjemahkan label UI**

Ganti label yang masih Inggris:
- `Cardholder's Name` → `Nama Pemegang Kartu`
- `Card Number` → `Nomor Kartu`
- `EXPIRY` → `Kedaluwarsa`
- `"Credit or Debit Card"` → `"Kartu Kredit/Debit"`
- `"Bank Transfer"` → `"Transfer Bank"`

`CVV` dan `Bayar Sekarang` tetap.

- [ ] **Step 5: Verifikasi type-check penuh**

Jalankan:
```bash
npx tsc -b
```
Expected: LOLOS, tanpa output error.

- [ ] **Step 6: Serahkan untuk review**

Jangan commit.

---

### Task 5: Rename util title dan import

**Files:**
- Rename: `src/lib/utiils.ts` → `src/lib/utils.ts`
- Modify: `src/components/Alerts.tsx`
- Modify: `src/components/Button.tsx`
- Modify: `src/components/InputField.tsx`

**Interfaces:**
- Consumes: `cn(...inputs: ClassValue[])` dari file lama.
- Produces: `cn(...inputs: ClassValue[])` di `src/lib/utils.ts` dengan signature sama.

- [ ] **Step 1: Rename file**

Jalankan:
```bash
git mv src/lib/utiils.ts src/lib/utils.ts
```
Expected: file lama hilang, file baru ada.

- [ ] **Step 2: Update tiga import**

Ganti `@/lib/utiils` menjadi `@/lib/utils` di:
- `src/components/Alerts.tsx`
- `src/components/Button.tsx`
- `src/components/InputField.tsx`

- [ ] **Step 3: Verifikasi tidak ada sisa typo**

Jalankan:
```bash
git grep -n "utiils" -- src
```
Expected: tidak ada output.

- [ ] **Step 4: Verifikasi type-check**

Jalankan:
```bash
npx tsc -b
```
Expected: LOLOS.

- [ ] **Step 5: Serahkan untuk review**

Jangan commit.

---

### Task 6: Pindahkan komponen khusus home

**Files:**
- Move: `src/components/CTABanner.tsx` → `src/features/home/components/CTABanner.tsx`
- Move: `src/components/FeatureCard.tsx` → `src/features/home/components/FeatureCard.tsx`
- Move: `src/components/Features.tsx` → `src/features/home/components/Features.tsx`
- Move: `src/components/Hero.tsx` → `src/features/home/components/Hero.tsx`
- Move: `src/components/ScheduleCard.tsx` → `src/features/home/components/ScheduleCard.tsx`
- Move: `src/components/SchedulePreview.tsx` → `src/features/home/components/SchedulePreview.tsx`
- Modify: `src/features/home/page/Home.tsx`
- Modify: `src/features/home/components/Hero.tsx`
- Modify: `src/components/index.ts`

**Interfaces:**
- Consumes: alias `@/home/*` dari `tsconfig.app.json`, barrel `@/components`.
- Produces: path baru `@/home/components/<Nama>` untuk komponen home; barrel shared hanya berisi `Alerts`, `Button`, `Dropdown`, `Footer`, `FooterLinks`, `InputField`, `Navbar`.

- [ ] **Step 1: Pindahkan file**

Jalankan enam `git mv` sesuai daftar Files. Expected: `src/components/` hanya berisi shared component + `index.ts`.

- [ ] **Step 2: Perbaiki import di `Hero.tsx`**

Ganti:
```tsx
import { Button } from "./Button";
```
dengan:
```tsx
import { Button } from "@/components/Button";
```

`Features.tsx` tetap memakai `./FeatureCard`; `SchedulePreview.tsx` tetap memakai `./ScheduleCard`.

- [ ] **Step 3: Perbaiki import di `Home.tsx`**

Ganti lima import home menjadi:
```tsx
import { CTABanner } from "@/home/components/CTABanner";
import { Features } from "@/home/components/Features";
import { Hero } from "@/home/components/Hero";
import { SchedulePreview } from "@/home/components/SchedulePreview";
```
Ganti dua import shared menjadi satu barrel:
```tsx
import { Footer, Navbar } from "@/components";
```
Pertahankan `useSession`, `useNavigate`, dan seluruh JSX.

- [ ] **Step 4: Perbaiki barrel shared**

Tulis ulang `src/components/index.ts` menjadi:
```ts
export { default as Alerts } from "./Alerts";
export * from "./Button";
export * from "./Dropdown";
export * from "./Footer";
export * from "./FooterLinks";
export * from "./InputField";
export * from "./Navbar";
```

- [ ] **Step 5: Verifikasi path lama hilang**

Jalankan:
```bash
git grep -n "components/Hero\|components/Features\|components/FeatureCard\|components/CTABanner\|components/SchedulePreview\|components/ScheduleCard" -- src
```
Expected: tidak ada output.

- [ ] **Step 6: Verifikasi type-check**

Jalankan:
```bash
npx tsc -b
```
Expected: LOLOS.

- [ ] **Step 7: Serahkan untuk review**

Jangan commit.

---

### Task 7: Tooling build dan environment template

**Files:**
- Modify: `package.json`
- Create: `.env.example`

**Interfaces:**
- Consumes: script build existing.
- Produces: `npm run build` = `tsc -b && vite build`; template env tanpa secret.

- [ ] **Step 1: Update script build**

Di `package.json`, ganti:
```json
"build": "vite build"
```
dengan:
```json
"build": "tsc -b && vite build"
```

- [ ] **Step 2: Buat `.env.example`**

Buat file dengan isi persis:
```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- [ ] **Step 3: Verifikasi build penuh**

Jalankan:
```bash
npm run build
```
Expected: keluar output `tsc -b` tanpa error, lalu `vite build` sukses. Warning chunk besar dari Vite boleh tetap.

- [ ] **Step 4: Verifikasi lint**

Jalankan:
```bash
npm run lint
```
Expected: 0 error. Satu warning existing di `.agents/...` boleh tetap.

- [ ] **Step 5: Serahkan untuk review**

Jangan commit.

---

### Task 8: Verifikasi akhir dan penyerahan

**Files:** tidak ada.

**Interfaces:**
- Consumes: semua task sebelumnya.
- Produces: branch siap ditinjau pengguna; tidak ada commit otomatis.

- [ ] **Step 1: Cek struktur akhir**

Jalankan:
```bash
git status --short
```
Expected: perubahan sesuai peta file di desain. Tidak ada `src/features/users/`, `src/features/tickets/`, `src/services/userService.ts`, atau `src/lib/utiils.ts`.

- [ ] **Step 2: Cek sisa dead code**

Jalankan:
```bash
git grep -n "selectedMatchId\|selectedUserId\|RegisterForm\|console\.log(data)\|FormField" -- src
```
Expected: tidak ada output.

- [ ] **Step 3: Manual QA halaman**

Jalankan `npm run dev`, lalu cek:
- `/` — hero, fitur, jadwal, CTA, footer tampil.
- Tombol “Lihat Jadwal” dan “Pesan Tiket” mengarah ke `/matchs` atau `/login` sesuai status login.
- `/matchs` — daftar card tetap render.
- `/login` — submit kredensial salah memunculkan `Alerts` (bukan blank).
- `/signup` — form tampil, validasi inline bekerja.
- `/auth/callback` — spinner tampil lalu redirect.
- Tidak ada error di browser console.

- [ ] **Step 4: Ulangi verifikasi otomatis**

Jalankan:
```bash
npm run lint
npm run build
```
Expected: keduanya sukses sesuai Task 7.

- [ ] **Step 5: Stop untuk review pengguna**

Jangan `git add`, jangan `git commit`. Laporkan diff dan hasil verifikasi. Tunggu persetujuan sebelum commit.

---

## Self-review

- **Coverage desain:** semua poin di desain memiliki task: dead code (Task 2), tipe match (Task 3), Payment (Task 4), utils (Task 5), home components (Task 6), tooling/env (Task 7), verifikasi (Task 8).
- **Konsistensi tipe:** `MatchPayload`, `TeamPayload`, `MatchCardProps` didefinisikan sekali di Task 3 dan dipakai dengan nama sama di Task 3. `cn` tetap bernama `cn` setelah rename file di Task 5.
- **Review Focus:** kelima input classes di atas dipin oleh step verifikasi Task 3, 4, 6, 6, dan 7.
- **Proporsi:** rencana berisi keputusan dan verifikasi, bukan transkode penuh; satu-satunya blok kode penuh adalah signature tipe dan barrel yang memang tetap.
