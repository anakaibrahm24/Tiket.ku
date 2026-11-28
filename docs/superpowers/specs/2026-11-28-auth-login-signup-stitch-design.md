# Design: Perbarui Halaman Login & Signup Mengikuti Stitch

Tanggal: 2026-11-28
Topik: auth-login-signup-stitch

## Tujuan

Memperbarui `LoginPage` dan `SignupPage` agar mengikuti design Stitch yang sudah ada di `.stitch/tiket.ku_masuk` dan `.stitch/tiket.ku_daftar_akun`, serta aturan `DESIGN.md` dan token kanonik di `src/app.css`. Fokus pada konsistensi visual, penggunaan token Stitch, dan penggunaan komponen reusable yang sudah ada.

## Konteks saat ini

- `LoginPage` dan `SignupPage` memakai layout lama: gradient hero, tombol kembali, `Footer`, dan token alias (`ink-900`, `line-soft`, `surface-white`).
- `SignupPage` memakai field Nama, Email, Kata Sandi, Konfirmasi Kata Sandi, dengan validasi min 6 karakter.
- Stitch login memakai brand header, card putih, Google OAuth SVG, divider, email, password dengan toggle, remember me, dan link daftar.
- Stitch signup memakai brand header, card putih, Google OAuth SVG, divider, nama, email, nomor WhatsApp, password min 8, dan terms.
- Komponen reusable yang relevan sudah ada: `InputField` (sudah memiliki toggle password), `Button`, `Alerts`, `Banner`.

## Tujuan & non-tujuan

Tujuan:
- Tampilan login/signup match Stitch.
- Semua class baru memakai token kanonik Stitch dari `src/app.css`.
- Reuse komponen yang ada; buat komponen baru hanya jika diperlukan.
- Signup sesuai Stitch: tambah telepon, hapus konfirmasi password, min 8 karakter.
- Service menyimpan nomor telepon di metadata user Supabase.

Non-tujuan:
- Tidak mengubah auth flow Supabase secara mendasar.
- Tidak menambah migrasi database.
- Tidak melakukan redesign komponen global (`Button`, `InputField`) di luar kebutuhan auth.
- Tidak menangani reset password backend; link tetap placeholder sesuai implementasi saat ini.

## Pendekatan yang dipertimbangkan

1. **Align Stitch penuh** — dipilih. Sesuai design Stitch, token kanonik, field set persis Stitch.
2. **Styling only** — ditolak karena tidak match field Stitch (telepon, min 8, tanpa konfirmasi).
3. **Hybrid** — ditolak karena menyimpang dari design Stitch.

## Keputusan desain

- Layout memakai `bg-light-surface`, container `max-w-md`, brand header dengan logo `confirmation_number`, lalu card `bg-light-surface-container-lowest border-light-outline-variant rounded-xl shadow-sm`.
- Google button memakai `Button` variant `oauth` dengan children SVG Google resmi (20x20) dan label Stitch.
- Divider memakai `bg-light-outline-variant`.
- Input memakai `InputField`, token canonical akan dipakai di halaman; komponen `InputField` tetap reuse.
- Password toggle sudah ada di `InputField`, tidak perlu komponen baru.
- Status feedback memakai `Banner` untuk status Google, dan `Alerts` untuk error.
- Login tidak menampilkan tombol kembali dan `Footer` agar match Stitch.
- Signup tidak menampilkan tombol kembali dan `Footer` agar match Stitch.
- Terms checkbox wajib di signup.
- Remember me checkbox di login, default checked seperti Stitch.

## Perubahan schema

File: `src/features/auth/schema/authSchemas.ts`

- `loginSchema`: email valid, password min 6 tetap untuk login (tidak mengubah kontrak login).
- `signupSchema`:
  - `name`: wajib, hanya huruf dan spasi.
  - `email`: wajib, email valid.
  - `phone`: wajib, format nomor Indonesia (regex sederhana, menerima `08...`, `62...`, `+62...` dengan spasi/hyphen).
  - `password`: wajib, min 8, maks 72 untuk batas Supabase.
  - hapus `confirmPassword` dan refine.
- Export type tetap `SignupSchema`.

## Perubahan service

File: `src/features/auth/service/authService.ts`

- `signUpWithEmail(email, password, fullName, phone)` menambah parameter `phone`.
- Supabase `signUp` options.data menambah `phone`.
- `mapAuthError` tetap.

## Perubahan halaman

### LoginPage

- Root: `main.min-h-screen.bg-light-surface`, centered container.
- Brand header: logo + "Tiket.ku" + subtitle.
- Card: header, Google button, divider, form.
- Form: email, password, remember me, status banner, submit.
- Link ke signup.
- Hapus `Banner` status? Tetap untuk status Google.
- Hapus `Footer` dan tombol kembali.

### SignupPage

- Root dan brand header sama.
- Card: header, Google button, divider, form.
- Form: nama, email, telepon, password, terms, status banner, submit.
- Link ke login.
- Hapus `Footer` dan tombol kembali.

## Error handling & loading

- Submit button disabled saat `isSubmitting` atau `isGoogleLoading`.
- Google button disabled saat loading.
- Error auth tampil via `Alerts`.
- Status Google tampil via `Banner`.
- Input disabled saat loading.

## Aksesibilitas

- Label terhubung ke input via `InputField`.
- Password toggle memiliki aria-label.
- Checkbox terms wajib.
- Focus visible dari global CSS.

## Verifikasi manual

- `npm run lint`
- `npm run build`
- `npx tsc -b`
- Cek visual login/signup di dev server.
- Cek submit kosong menampilkan error inline.
- Cek Google loading state.
- Cek navigasi login ↔ signup.

## File yang disentuh

- `src/features/auth/page/LoginPage.tsx`
- `src/features/auth/page/SignupPage.tsx`
- `src/features/auth/schema/authSchemas.ts`
- `src/features/auth/service/authService.ts`

## Risiko

- Perubahan field signup (telepon, hapus konfirmasi) mengubah kontrak form.
- Token canonical membuat diff cukup besar.
- Tidak ada test otomatis; verifikasi manual.

## Catatan

- Komponen `InputField` dan `Button` tetap reuse; alias token di komponen global tidak diubah pada progress ini.
- Jika nanti ingin konsistensi global, buat progress terpisah untuk canonicalize semua komponen.
