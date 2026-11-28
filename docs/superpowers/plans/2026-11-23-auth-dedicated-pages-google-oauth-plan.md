# Plan: Auth Dedicated Pages + Google OAuth

Branch: `feat/auth-dedicated-pages-google-oauth`  
Scope: migrasi auth modal ke halaman dedicated `/login` & `/signup` + tambah Google OAuth (email/password tetap). Redirect sukses ke `/matchs`. Frontend only (profil dari auth metadata). Forgot password & tabel `profiles` di luar scope.

## Prasyarat (di luar kode)

- [ ] Enable Google provider di Supabase Dashboard.
- [ ] Tambah redirect URL: `http://localhost:5173/auth/callback` + URL produksi.
- [ ] Pastikan `.env.local` berisi `VITE_SUPABASE_URL` & `VITE_SUPABASE_PUBLISHABLE_KEY`.
- [ ] (Opsional) Buat `.env.example`.

## Task 1 — Branch & fondasi

- [ ] Buat branch `feat/auth-dedicated-pages-google-oauth` dari branch kerja saat ini.
- [ ] Tambah route `/login`, `/signup`, `/auth/callback` di `src/App.tsx`.
- [ ] Buat `src/hooks/useSession.ts` untuk cek sesi + `onAuthStateChange`.

## Task 2 — Service layer auth

- [ ] Buat `src/features/auth/service/authService.ts`.
  - `getSession()`, `onAuthStateChange()`
  - `signInWithEmail(email, password)`
  - `signUpWithEmail(email, password, fullName)` dengan `options.data.full_name`
  - `signInWithGoogle()` → `signInWithOAuth({ provider: 'google', options: { redirectTo: \`${origin}/auth/callback\` } })`
  - `signOut()`
  - `mapAuthError(error, mode)` → pesan Indonesia.
- [ ] Pastikan komponen tidak memanggil Supabase langsung.

## Task 3 — Schema & validasi

- [ ] Update `src/features/auth/schema/authSchemas.ts`:
  - alias `loginSchema` dari schema existing.
  - tambah `signupSchema`: `name` (huruf/spasi, wajib), `email` valid, `password` 6–20, `confirmPassword` sama dengan password.
- [ ] Export tipe `LoginSchema`, `SignupSchema`.

## Task 4 — Halaman Login

- [ ] Buat `src/features/auth/page/LoginPage.tsx`.
  - Layout per canvas: hero band gradient, card 440px, back button, footer.
  - Google button di atas form + divider "atau".
  - Form email/password dengan `react-hook-form` + `zodResolver(loginSchema)`.
  - Loading state: disable tombol + spinner; Google button state terpisah.
  - Error submit via `Alerts`; field error inline.
  - Jika sudah login → redirect `/matchs`.

## Task 5 — Halaman Signup

- [ ] Buat `src/features/auth/page/SignupPage.tsx`.
  - Field: Nama, Email, Kata Sandi, Konfirmasi Kata Sandi.
  - Google button di atas form + divider "atau".
  - Form dengan `signupSchema`.
  - Signup email tanpa session → alert "Cek email untuk verifikasi akun."
  - Jika sudah login → redirect `/matchs`.

## Task 6 — Callback OAuth

- [ ] Buat `src/features/auth/page/AuthCallbackPage.tsx`.
  - Tunggu `getSession()`; redirect ke `/matchs` jika sukses, `/login` jika gagal.
  - Tampilkan spinner saat menunggu.

## Task 7 — Navbar & Home

- [ ] Update `src/components/Navbar.tsx`: tombol Masuk/Daftar navigate ke `/login` & `/signup`; hapus props callback.
- [ ] Update `src/features/home/page/Home.tsx`: hapus `AuthModal` & `handleFormSubmit`; CTA yang butuh login navigate ke `/login`.
- [ ] Gunakan `useSession` untuk state login.

## Task 8 — Cleanup

- [ ] Hapus penggunaan `AuthModal` di `Home.tsx`.
- [ ] Hapus `src/components/AuthModal.tsx` dan `src/features/auth/components/AuthContainer.tsx` jika tidak direferensikan.
- [ ] (Opsional) Rapikan `useAuth.tsx` agar sesuai schema per halaman.

## Task 9 — Styling & aksesibilitas

- [ ] Terapkan token DESIGN.md: card radius 14, padding 32, gap 24, input height 44, radius 14.
- [ ] Pastikan label, aria, focus ring, dan kontras WCAG AA.
- [ ] Responsive mobile (320px–1440px).

## Task 10 — Verifikasi

- [ ] Jalankan `npm run lint` (0 error).
- [ ] Jalankan `npm run build` (sukses).
- [ ] Manual QA:
  - [ ] Login email valid/invalid.
  - [ ] Signup valid/invalid (termasuk password mismatch).
  - [ ] Google OAuth round-trip ke `/matchs`.
  - [ ] Redirect saat sudah login mengakses `/login`/`/signup`.
  - [ ] Session persist setelah refresh.
  - [ ] Tidak ada error console.

## Di luar scope

- Forgot password / reset password.
- Tabel `profiles` / avatar.
- Logout UI.
- Admin dashboard.
