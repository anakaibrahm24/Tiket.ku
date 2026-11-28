# React + TypeScript + Vite

## Konvensi commit

Pesan commit mengikuti aturan di `AGENTS.md`: Conventional Commits `type(scope): deskripsi` dengan deskripsi imperatif Bahasa Inggris, huruf kecil, tanpa titik akhir. Contoh: `fix(ui): constrain auth card width`.

## Konfigurasi Supabase

1. Salin `.env.example` ke `.env.local`.
2. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dari Supabase Dashboard → Project Settings → API.
3. Jalankan `npm run dev`.
4. Jangan commit `.env.local`.
5. Di Supabase Dashboard → Authentication → Providers → Email, matikan "Confirm email" untuk MVP agar signup langsung mendapat session. Aktifkan kembali sebelum produksi.
6. Pastikan `http://localhost:5173/auth/callback` terdaftar di Supabase Dashboard → Authentication → URL Configuration → Redirect URLs.

## QA MVP

Status: **verifikasi statis selesai; QA live ⚠️ PENDING (owner-side)**. Agen tidak menjalankan pengujian apa pun terhadap project Supabase live dan tidak memakai kredensial.

### Verifikasi statis — selesai

| No  | Pemeriksaan                                                                                          | Bukti                                                                                                                                                                                                             | Hasil                 |
| --- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 1   | Env guard `src/lib/supabase.ts` (Task 1)                                                             | Modul dieksekusi via Vite SSR tanpa `.env.local`: melempar `"Supabase URL dan anon key wajib diisi. Salin .env.example ke .env.local."`; jalur sukses dengan env demo → `createClient` valid.                     | PASS                  |
| 2   | `npm run lint` (Tasks 1–6; diulang Task 7)                                                           | `✖ 1 problem (0 errors, 1 warning)` — `react-refresh/only-export-components` di `.agents/skills/shadcn/assets/showcase/state-matrix.tsx:62:17` (pre-existing, di luar scope).                                     | PASS — 0 error        |
| 3   | `npx tsc -b --pretty false` dengan `NODE_OPTIONS=--max-old-space-size=4096` (Task 6; diulang Task 7) | Exit 0 tanpa error. Heap default OOM di lingkungan ini; gate memakai 4096 MB.                                                                                                                                     | PASS — 0 error        |
| 4   | `npm run build` dengan heap 4096 MB (Tasks 1/5/6; diulang Task 7)                                    | `✓ 532 modules transformed`, `✓ built in 3.76s`. Warning chunk >500 kB bersifat informasi (pre-existing).                                                                                                         | PASS                  |
| 5   | Skema, index, RLS, grant (Task 2)                                                                    | Tinjauan teks `supabase/migrations/0001_init.sql`: 4 tabel, 4 policy `for select` (`events`/`ticket_categories` publik; `orders`/`tickets` owner), `revoke all` mendahului `grant select`, tanpa policy write.    | Review teks selesai   |
| 6   | RPC `create_order` / `complete_payment` (Task 3)                                                     | Tinjauan teks: `security definer`, `set search_path = public`, harga dari DB, kuota atomik, idempotensi, `qr_code` gabungan `orderId` dan `ticketId`, `grant execute ... to authenticated`.                       | Review teks selesai   |
| 7   | Seed data (Task 4)                                                                                   | Hitung statis + grep: 6 event (3 football, 3 concert) × 3 kategori = 18 baris; `(100+200+500) × 3 = 2400` per tipe; 18 UUID kategori unik; `sold = 0`. Query verifikasi memakai `count(distinct e.id) as events`. | Hitungan statis cocok |

Catatan: butir 5–7 hanya peninjauan teks SQL. Tidak ada SQL yang diapply atau dijalankan di database mana pun.

### ⚠️ PENDING — QA live, owner-side (belum dijalankan)

Jalankan di Supabase SQL Editor / klien setelah migration gabungan `supabase/migrations/0001_init.sql` dan `supabase/seed.sql` diapply sekali. Agen tidak menjalankan langkah di bawah dan tidak mengklaim hasilnya.

- [ ] **Alur utama (Step 2):** dengan user login, `create_order(...)` → catat `orderId` + `totalAmount`; `complete_payment(orderId, method)` → dapat `ticketId`; `select qr_code from tickets where order_id = '...'` → harus persis `${orderId}|${ticketId}`; `select sold from ticket_categories where id = '...'` → bertambah sesuai qty; `select status from orders where id = '...'` → `paid`.
- [ ] **Negative path (Step 3):** user berbeda memanggil `complete_payment` untuk `orderId` tersebut → harus error owner mismatch / `'Pesanan tidak ditemukan.'`; select dari klien (bukan SQL Editor) → 0 baris karena RLS.
- [ ] **Toggle email confirmation:** Supabase Dashboard → Authentication → Providers → Email → matikan "Confirm email" untuk MVP (aktifkan lagi sebelum produksi).
- [ ] **Verifikasi RPC tambahan (Task 3, V3–V7):** atribut `security definer`/`search_path`, harga server-side, kuota atomik, idempotensi, duplikat kategori. Uji kuota ditulis sekuensial; konkurensi paralel belum diverifikasi.
- [ ] **Verifikasi seed (Task 4):** query `count(distinct e.id)` → 2 baris, `events = 3` dan `total_quota = 2400` per tipe. `on conflict (id) do nothing` tidak mereset `sold` saat seed diulang; tanggal seed kedaluwarsa setelah Januari 2027.
- [ ] **RLS lintas-user (Task 2, V1–V2):** 4 tabel masing-masing 1 policy; `USER_B` melihat 0 baris `orders`/`tickets`, `USER_A` minimal 1.
- [ ] **Auth live (Task 5):** signup langsung masuk, refresh, logout, mapping error.

Migration tidak idempotent (`create table`/`create policy` polos) → apply file gabungan final hanya sekali.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
