# Auth Login & Signup Stitch Alignment Implementation Plan

Branch: `feat/auth-login-signup-stitch`

> **Untuk pekerja agen:** WAJIB memakai sub-skill `subagent-driven-development` (disarankan) atau `executing-plans` untuk mengerjakan plan ini task-per-task. Step memakai checkbox (`- [ ]`) untuk tracking.

**Goal:** Memperbarui `LoginPage` dan `SignupPage` agar mengikuti design Stitch, memakai token kanonik, dan reuse komponen yang sudah ada.

**Architecture:** Ubah schema dan service signup terlebih dahulu agar kontrak form sesuai Stitch (telepon, password min 8, tanpa konfirmasi). Setelah itu tulis ulang kedua halaman dengan layout Stitch: brand header, card, Google OAuth SVG, divider, form, dan link auth. Semua class memakai token kanonik dari `src/app.css`.

**Tech Stack:** React 19, TypeScript 5.7 strict, React Hook Form, Zod, Supabase Auth, Tailwind CSS 4, komponen existing (`InputField`, `Button`, `Alerts`, `Banner`).

**Spec:** `docs/superpowers/specs/2026-11-28-auth-login-signup-stitch-design.md`

## Global Constraints

- Branch: `feat/auth-login-signup-stitch`.
- File yang diubah hanya yang tercantum pada task.
- Semua teks UI dalam Bahasa Indonesia.
- Gunakan token kanonik Stitch (`light-*`, `brand-*`); hindari alias lama pada kode halaman baru.
- Reuse `InputField`, `Button`, `Alerts`, `Banner`; jangan duplikasi komponen.
- Tidak menambah dependency baru.
- Tidak menambah migrasi database.
- TypeScript strict harus lulus.
- Setiap task yang selesai dan lulus verifikasi dibuat commit terpisah.

## Review Focus

- Signup telepon tidak diteruskan ke Supabase metadata → data hilang. Task 2 menambah parameter dan Task 4 memanggilnya.
- Password min 8 tidak ditegakkan → akun lemah. Task 1 menambah min 8; Task 4 menampilkan error inline.
- Referensi `confirmPassword` tersisa → build gagal. Task 1 menghapus field dan Task 4 tidak lagi memakainya.
- Alias token lama tersisa di halaman → inkonsistensi design. Task 3/4 memakai token kanonik; verifikasi grep.
- Loading state tidak menonaktifkan submit/Google → double submit. Task 3/4 mempertahankan disabled state.

---

### Task 1: Perbarui schema auth

**Files:**
- Modify: `src/features/auth/schema/authSchemas.ts`

**Interfaces:**
- Consumes: tidak ada.
- Produces: `loginSchema`, `signupSchema`, `LoginSchema`, `SignupSchema` dengan `phone` pada signup dan tanpa `confirmPassword`.

- [ ] **Step 1: Ubah `signupSchema` sesuai Stitch**

Edit `src/features/auth/schema/authSchemas.ts`:
- Pertahankan `loginSchema` (email valid, password min 6).
- Ubah `signupSchema`:
  - `name`: wajib, regex `/^[A-Za-zÀ-ÿ\s]+$/`.
  - `email`: wajib, email valid.
  - `phone`: wajib, regex nomor Indonesia yang menerima spasi/hyphen.
  - `password`: wajib, min 8, max 72.
  - Hapus `confirmPassword` dan `.refine`.
- Update type `SignupSchema`.

- [ ] **Step 2: Verifikasi type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/auth/schema/authSchemas.ts
git commit -m "feat(auth): sesuaikan schema signup dengan design Stitch"
```

---

### Task 2: Perbarui service signup

**Files:**
- Modify: `src/features/auth/service/authService.ts`

**Interfaces:**
- Consumes: `fullName: string`, `phone: string`.
- Produces: `signUpWithEmail(email: string, password: string, fullName: string, phone: string)`.

- [ ] **Step 1: Tambah parameter telepon**

Edit `signUpWithEmail` agar menerima `phone` dan menyimpannya pada `options.data.phone`.

- [ ] **Step 2: Verifikasi type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/auth/service/authService.ts
git commit -m "feat(auth): simpan nomor telepon pada metadata signup"
```

---

### Task 3: Tulis ulang LoginPage mengikuti Stitch

**Files:**
- Modify: `src/features/auth/page/LoginPage.tsx`

**Interfaces:**
- Consumes: `loginSchema`, `LoginSchema`, `signInWithEmail`, `signInWithGoogle`, `mapAuthError`, `useSession`.
- Produces: halaman login dengan brand header, card, Google OAuth SVG, divider, email, password, remember me, submit, link signup.

- [ ] **Step 1: Ganti layout dan token**

Tulis ulang `LoginPage` dengan struktur:
- Root `main.min-h-screen.bg-light-surface`, container `max-w-md`.
- Brand header: logo `confirmation_number`, judul "Tiket.ku", subtitle portal GBK.
- Card `bg-light-surface-container-lowest border-light-outline-variant rounded-xl shadow-sm p-8`.
- Header card: "Masuk ke akun Anda" dan deskripsi.
- Google button `Button` variant `oauth` dengan SVG Google inline dan label "Masuk dengan Google".
- Divider "atau masuk dengan email".
- Form dengan `InputField` email dan password.
- Remember me checkbox default checked.
- Status `Banner` saat Google loading.
- Submit `Button` primary "Masuk ke Tiket.ku".
- Link "Daftar sekarang" ke `/signup`.
- Hapus gradient hero, tombol kembali, dan `Footer`.

Gunakan token kanonik pada semua class baru.

- [ ] **Step 2: Verifikasi lint, type-check, build**

Run:
- `npm run lint`
- `npx tsc -b`
- `npm run build`

Expected: semua lulus.

- [ ] **Step 3: Verifikasi alias token tidak tersisa**

Run: `Select-String -Path src/features/auth/page/LoginPage.tsx -Pattern 'ink-900|line-soft|surface-white|night-950'`
Expected: tanpa output.

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/page/LoginPage.tsx
git commit -m "feat(auth): perbarui halaman login mengikuti Stitch"
```

---

### Task 4: Tulis ulang SignupPage mengikuti Stitch

**Files:**
- Modify: `src/features/auth/page/SignupPage.tsx`

**Interfaces:**
- Consumes: `signupSchema`, `SignupSchema`, `signUpWithEmail(email, password, fullName, phone)`, `signInWithGoogle`, `mapAuthError`, `getSession`, `useSession`.
- Produces: halaman signup dengan brand header, card, Google OAuth SVG, divider, nama, email, telepon, password, terms, submit, link login.

- [ ] **Step 1: Ganti layout dan field**

Tulis ulang `SignupPage` dengan struktur Stitch:
- Root dan brand header sama dengan login.
- Card dengan header "Buat akun Tiket.ku".
- Google button dengan SVG Google dan label "Daftar dengan Google".
- Divider "atau daftar dengan email".
- Form dengan `InputField` nama, email, telepon (`type="tel"`), password.
- Terms checkbox wajib.
- Status `Banner` saat Google loading.
- Submit `Button` primary "Buat Akun Tiket.ku".
- Link "Masuk sekarang" ke `/login`.
- Hapus `confirmPassword`, gradient hero, tombol kembali, dan `Footer`.

Panggil `signUpWithEmail(values.email, values.password, values.name, values.phone)`.

- [ ] **Step 2: Verifikasi lint, type-check, build**

Run:
- `npm run lint`
- `npx tsc -b`
- `npm run build`

Expected: semua lulus.

- [ ] **Step 3: Verifikasi alias token tidak tersisa**

Run: `Select-String -Path src/features/auth/page/SignupPage.tsx -Pattern 'ink-900|line-soft|surface-white|night-950'`
Expected: tanpa output.

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/page/SignupPage.tsx
git commit -m "feat(auth): perbarui halaman signup mengikuti Stitch"
```

---

### Task 5: Verifikasi akhir auth pages

**Files:**
- Tidak ada file baru.

**Interfaces:**
- Consumes: semua task sebelumnya.
- Produces: verifikasi manual dan type-check final.

- [ ] **Step 1: Jalankan verifikasi final**

Run:
- `npm run lint`
- `npm run build`
- `npx tsc -b`

Expected: semua lulus.

- [ ] **Step 2: Checklist manual**

Verifikasi di dev server:
- Login: error inline saat email/password kosong.
- Login: Google button loading state.
- Login: navigasi ke signup.
- Signup: error inline saat field kosong.
- Signup: password 7 karakter ditolak.
- Signup: navigasi ke login.

- [ ] **Step 3: Commit (jika ada perubahan)**

Jika tidak ada perubahan kode, tidak perlu commit. Jika ada perubahan kecil, commit dengan pesan `fix(auth): rapikan verifikasi akhir halaman auth`.

---

## Self-review

- Spec coverage: schema, service, login, signup, loading, aksesibilitas, verifikasi tercakup.
- Type consistency: `signUpWithEmail` signature konsisten antara Task 2 dan Task 4.
- Review Focus: setiap risiko memiliki task dan langkah verifikasi.
