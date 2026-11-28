# Desain: Susun Ulang AGENTS.md

## Intent

`AGENTS.md` saat ini 156 baris dengan 10 heading. Aturan yang sama muncul di beberapa tempat (commit, verifikasi, dead code, bahasa `.md`), sehingga agent harus membaca seluruh file untuk menemukan satu keputusan. Tujuan progress ini menyusun ulang struktur agar aturan mudah ditemukan, tanpa mengubah makna aturan lama. Saat ACC, pengguna meminta tiga aturan tambahan yang ikut dimasukkan ke dalam struktur baru.

## Goals

- Mengelompokkan seluruh aturan ke 6 bagian tetap: `Konteks`, `Lingkungan`, `Alur kerja`, `Perencanaan`, `Standar kode`, `Dokumentasi & referensi`.
- Menggabungkan aturan duplikat menjadi satu pernyataan di bagian yang tepat.
- Menjaga semua aturan lama tetap ada, termasuk yang saat ini tersebar di `Petunjuk untuk agent` dan `Instruksi PR`.
- Mencatat kontradiksi yang terlihat sebagai `Catatan` di dalam file, bukan memperbaikinya.
- Menambahkan aturan penamaan commit Conventional Commits (standar DevOps) di `Alur kerja`.
- Menambahkan aturan membaca `src/.ua/knowledge-graph.json` hasil `/understand` sebelum menganalisis atau mengubah kode, di `Standar kode`.
- Menambahkan aturan kepemilikan perubahan: perubahan yang tidak dibuat agen dianggap berasal dari pengguna, jangan di-revert; bila ragu, tanyakan.

## Non-goals

- Mengubah makna aturan lama, menambah aturan lain di luar tiga permintaan ACC, atau menghapus aturan lama.
- Menyentuh `PRD.md`, `DESIGN.md`, `README.md`, atau file di `docs/agents/`.
- Memindahkan aturan ke file `.md` lain.
- Implementasi kode atau konfigurasi proyek.

## Constraints

- File yang diubah hanya `AGENTS.md`.
- Semua teks tetap Bahasa Indonesia.
- Format Markdown heading bertingkat (`#`, `##`, `###`) dipertahankan.
- Bagian `Struktur proyek` berupa blok kode tetap dipertahankan di `Konteks`.
- Tiga aturan tambahan dari ACC mengubah isi, tetapi tidak mengubah makna aturan lama.

## Approaches

| Opsi | Perlakuan | Tradeoff |
|---|---|---|
| 1 — Susun ulang saja (dipilih) | Pertahankan semua aturan lama, rombak pengelompokan, gabungkan duplikat, catat kontradiksi, plus tiga aturan yang diminta saat ACC | Tetap panjang, tetapi tidak ada perubahan makna pada aturan lama |
| 2 — Susun ulang + perbaiki kontradiksi | Opsi 1 plus ubah aturan lint, izin commit `.md`, dan aturan branch | Mengubah isi aturan, di luar permintaan "menyusun ulang" |
| 3 — Indeks ringkas + file detail | `AGENTS.md` jadi indeks, detail pindah ke `docs/agents/*.md` | Aturan tersebar; agent wajib membaca file tambahan |

Pilihan: opsi 1. Alasan: permintaan pengguna adalah kerapian, bukan perubahan kebijakan lama. Tiga aturan baru adalah penambahan eksplisit dari ACC, bukan perbaikan kontradiksi.

## Keputusan struktur

```text
# AGENTS.md
## Konteks
## Lingkungan
## Alur kerja
## Perencanaan
## Standar kode
## Dokumentasi & referensi
### Catatan
```

Pemetaan sumber:

- `Konteks` ← Gambaran proyek, Struktur proyek, Tech stack.
- `Lingkungan` ← Tips lingkungan pengembangan, termasuk skill shadcn.
- `Alur kerja` ← aturan branch/commit/PR dari Konvensi, Instruksi PR, dan verifikasi sebelum commit dari Instruksi testing. Aturan QA live owner-side ikut di sini. Ditambah aturan penamaan commit Conventional Commits dan kepemilikan perubahan.
- `Perencanaan` ← Perencanaan & dokumentasi superpowers, kecuali aturan bahasa dan izin edit `.md`.
- `Standar kode` ← Konvensi, plus petunjuk rute, folder fitur, konfirmasi skema, dan dead code dari Petunjuk untuk agent. Ditambah aturan membaca graph `/understand`.
- `Dokumentasi & referensi` ← aturan bahasa `.md`, izin edit `.md`, Agent skills, issue tracker, triage labels, domain docs.
- `Catatan` ← kontradiksi yang ditemukan, tanpa mengubah aturan:
  - `npm run lint` diwajibkan lulus, tetapi 49 error pre-existing ada di `.agents/skills/**`.
  - `.md` dilarang di-commit tanpa izin, tetapi plan di `docs/superpowers/` pernah di-commit.
  - branch per progress diwajibkan, tetapi tracking terakhir dilakukan di branch yang sudah ada.

Duplikasi yang digabung: dead code, bahasa `.md`, verifikasi pra-commit, aturan branch, izin commit, dan konfirmasi skema backend.

## Yang tersisa untuk pembuat plan

- Tentukan task kecil per bagian heading, dengan verifikasi berupa pemeriksaan isi dan urutan heading.
- Pastikan tidak ada aturan lama yang hilang setelah reorganisasi.
- Pastikan setiap aturan tambahan ACC memiliki satu pernyataan di bagian yang ditentukan.
- Tidak ada perubahan kode, dependency, atau konfigurasi.
