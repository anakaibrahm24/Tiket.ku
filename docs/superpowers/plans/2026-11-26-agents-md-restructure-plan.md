# Susun Ulang AGENTS.md Implementation Plan

Branch: `chore/agents-md-restructure`

> **Untuk pekerja agen:** WAJIB memakai sub-skill `subagent-driven-development` (disarankan) atau `executing-plans` untuk mengerjakan plan ini task-per-task. Step memakai checkbox (`- [ ]`) untuk tracking.

**Goal:** Menyusun ulang `AGENTS.md` menjadi 6 bagian yang mudah dicari tanpa mengubah makna aturan lama, plus tiga aturan tambahan yang diminta pengguna saat ACC.

**Architecture:** Satu file Markdown disusun ulang bertahap: pindahkan seluruh aturan ke heading baru, gabungkan duplikat, tambahkan tiga aturan ACC, lalu tambahkan catatan kontradiksi. Tidak ada perubahan kode, dependency, atau konfigurasi.

**Tech Stack:** Markdown, PowerShell untuk verifikasi isi, Git untuk commit per task.

**Spec:** `docs/superpowers/specs/2026-11-26-agents-md-restructure-design.md`

## Global Constraints

- File yang diubah hanya `AGENTS.md`.
- Semua teks dalam Bahasa Indonesia.
- Struktur heading tetap: `## Konteks`, `## Lingkungan`, `## Alur kerja`, `## Perencanaan`, `## Standar kode`, `## Dokumentasi & referensi`, dengan `### Catatan` di bagian terakhir.
- Semua aturan lama harus tetap ada; maknanya tidak boleh diubah.
- Tiga aturan tambahan dari ACC wajib ada: Conventional Commits, pembacaan graph `/understand`, dan kepemilikan perubahan.
- Duplikasi digabung menjadi satu pernyataan per aturan.
- Kontradiksi hanya dicatat, tidak diperbaiki.
- Jangan menyentuh `PRD.md`, `DESIGN.md`, `README.md`, atau `docs/agents/`.
- File spec dan plan ini tidak di-commit tanpa persetujuan terpisah.
- Setiap task selesai dan terverifikasi dibuat commit terpisah dengan pesan **Conventional Commits**.

## Review Focus

- Aturan hilang saat dipindah → Task 1 membandingkan seluruh baris bullet baseline dengan hasil pindahan; Task 4 memeriksa cakupan kata kunci aturan lama.
- Duplikat tidak benar-benar digabung → Task 2 menghitung tiap frasa duplikat tepat satu kali.
- Tiga aturan ACC tidak masuk atau membingungkan → Task 3 memeriksa frasa kunci masing-masing tepat satu kali dan lokasi headingnya.
- Kontradiksi diam-diam diubah menjadi aturan baru → Task 4 memastikan `### Catatan` berisi tiga kontradiksi dan aturan lama yang bersangkutan masih tertulis.
- Urutan heading menyimpang dari desain → Task 1 dan Task 4 memeriksa keluaran `^## ` persis sesuai urutan.
- Bahasa atau format Markdown rusak → Task 4 memastikan tidak ada heading berbahasa Inggris dan blok struktur proyek masih berupa code fence.

---

### Task 1: Pindahkan seluruh aturan ke 6 heading

**Files:**
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: seluruh isi `AGENTS.md` pada `HEAD`, disimpan sebagai baseline di `C:\Users\anaka\AppData\Local\Temp\opencode\agents-md-baseline.txt`.
- Produces: `AGENTS.md` dengan 6 heading sesuai desain, semua aturan lama masih lengkap dan belum digabung.

- [x] **Step 1: Simpan baseline untuk perbandingan**

Run: `git show HEAD:AGENTS.md | Set-Content -Encoding utf8 C:\Users\anaka\AppData\Local\Temp\opencode\agents-md-baseline.txt`
Expected: file baseline berisi 156 baris.

- [x] **Step 2: Tulis ulang file dengan 6 heading dan pindahkan semua aturan**

Buat ulang isi `AGENTS.md` dari baseline dengan urutan heading dari desain. Pindahkan aturan apa adanya: `Gambaran proyek`, `Struktur proyek`, `Tech stack` → `Konteks`; `Tips lingkungan pengembangan` → `Lingkungan`; aturan branch/commit/PR dan verifikasi → `Alur kerja`; aturan superpowers → `Perencanaan`; `Konvensi` dan `Petunjuk untuk agent` → `Standar kode`; aturan bahasa `.md`, izin edit, dan `Agent skills` → `Dokumentasi & referensi`. Jangan gabungkan duplikat dan jangan tambahkan aturan baru pada task ini.

- [x] **Step 3: Verifikasi urutan heading**

Run: `Select-String -Path AGENTS.md -Pattern '^## ' | ForEach-Object { $_.Line }`
Expected: enam baris persis `## Konteks`, `## Lingkungan`, `## Alur kerja`, `## Perencanaan`, `## Standar kode`, `## Dokumentasi & referensi`.

- [x] **Step 4: Verifikasi tidak ada aturan hilang**

Run:

```powershell
$base = Get-Content C:\Users\anaka\AppData\Local\Temp\opencode\agents-md-baseline.txt | Where-Object { $_ -match '^- ' } | Sort-Object
$now = Get-Content AGENTS.md | Where-Object { $_ -match '^- ' } | Sort-Object
Compare-Object $base $now
```

Expected: tanpa output.

- [x] **Step 5: Commit**

```bash
git add AGENTS.md
git commit -m "docs(agents): regroup AGENTS.md sections"
```

Commit: 9f1bab9 docs(agents): regroup AGENTS.md sections\n
---

### Task 2: Gabungkan aturan yang duplikat

**Files:**
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `AGENTS.md` dari Task 1, baseline dari Task 1.
- Produces: `AGENTS.md` dengan satu pernyataan untuk tiap aturan duplikat.

- [x] **Step 1: Gabungkan enam pasangan duplikat**

Di dalam `AGENTS.md`, satukan menjadi satu pernyataan each: dead code (`Tanpa dead code`), bahasa `.md`, verifikasi sebelum commit (`npm run lint`, `npm run build`, `npx tsc -b`), aturan branch, izin commit, dan konfirmasi skema backend. Taruh pernyataan hasil gabung di bagian yang ditentukan desain. Pertahankan kata kunci aslinya agar verifikasi berikutnya bisa mencocokkan.

- [x] **Step 2: Verifikasi tiap frasa muncul satu kali**

Run:

```powershell
$sec = [string][char]0x00A7
$phrases = @('Tanpa dead code','npm run lint','npx tsc -b','feat/<nama-fitur>','Jangan pernah commit tanpa persetujuan pengguna',('`PRD.md` ' + $sec + '6.3'))
[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; foreach ($p in $phrases) { "{0} = {1}" -f $p, (Select-String -Path AGENTS.md -SimpleMatch -Pattern $p | Measure-Object).Count }
```

Expected: setiap hitungan `1`.

- [x] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs(agents): consolidate duplicated rules"
```

Commit: d2ce3d3 docs(agents): consolidate duplicated rules\n
---

### Task 3: Tambahkan tiga aturan dari ACC

**Files:**
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `AGENTS.md` dari Task 2.
- Produces: `AGENTS.md` dengan aturan Conventional Commits dan kepemilikan perubahan di `Alur kerja`, serta aturan membaca graph `/understand` di `Standar kode`.

- [x] **Step 1: Tambahkan aturan di `Alur kerja`**

Tambahkan dua bullet:

- `- **Standar DevOps untuk commit:** gunakan Conventional Commits \`type(scope): deskripsi\`. Type: \`feat\`, \`fix\`, \`docs\`, \`chore\`, \`refactor\`, \`test\`, \`perf\`, \`build\`, \`ci\`, \`style\`, \`revert\`; scope opsional; deskripsi imperatif Bahasa Indonesia, huruf kecil, tanpa titik akhir. Contoh: \`docs(agents): susun ulang struktur aturan\`.`
- `- Perlakukan perubahan yang tidak dibuat agen pada sesi ini sebagai perubahan pengguna; jangan revert atau timpa ke versi agen. Jika ragu, tanyakan apakah perubahan itu dari pengguna.`

- [x] **Step 2: Tambahkan aturan di `Standar kode`**

Tambahkan bullet: `- Sebelum menganalisis atau mengubah kode, baca \`src/.ua/knowledge-graph.json\` hasil skill \`/understand\` sebagai peta awal; gunakan \`src/.ua/code-lessons.json\` bila perlu penjelasan file.`

- [x] **Step 3: Verifikasi frasa kunci**

Run:

```powershell
$phrases = @('type(scope): deskripsi','Perlakukan perubahan yang tidak dibuat agen','src/.ua/knowledge-graph.json')
foreach ($p in $phrases) { "{0} = {1}" -f $p, (Select-String -Path AGENTS.md -SimpleMatch -Pattern $p | Measure-Object).Count }
```

Expected: setiap hitungan `1`.

- [x] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs(agents): add ACC rules for commits, graph, and ownership"
```

Commit: `03f341d` `docs(agents): add ACC rules for commits, graph, and ownership`

---

### Task 4: Tambahkan catatan kontradiksi dan verifikasi akhir

**Files:**
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `AGENTS.md` dari Task 3, baseline dari Task 1.
- Produces: `AGENTS.md` final dengan `### Catatan` berisi tiga kontradiksi dari desain.

- [x] **Step 1: Tambahkan `### Catatan` di akhir `## Dokumentasi & referensi`**

Tulis tiga bullet: `npm run lint` wajib lulus tetapi 49 error pre-existing ada di `.agents/skills/**`; `.md` dilarang di-commit tanpa izin tetapi plan pernah di-commit; branch per progress diwajibkan tetapi tracking terakhir di branch yang sudah ada. Jangan mengubah aturan terkait di bagian lain.

- [x] **Step 2: Verifikasi cakupan aturan lama**

Karena duplikat digabung dengan kata kunci berbeda, perbandingan baris persis tidak dipakai. Gunakan daftar kata kunci yang mewakili setiap aturan lama.

Run:

```powershell
$required = @(
  'Persyaratan produk','Design system & token','Runtime:','Package manager:','Instal dependensi','Jalankan dev server','Build (bundle)','Lint:','Preview build produksi','Variabel lingkungan','Alias path (tsconfig)','Styling:','Skill shadcn:',
  'Feature-first:','Primitif bersama','Rute dideklarasikan','matchId','Frontend:','Routing:','Form/Validasi','State:','Backend/Auth/DB','Payment (MVP)','QR Code','Testing (rencana)','Supabase assets',
  'TypeScript strict mode','Tanpa dead code','Penamaan konsisten','Teks UI','Ikuti `DESIGN.md`','Validasi:','Akses data:','RLS:','Migration:','Error handling:','Loading state:','Komponen reusable:','Bahasa dokumentasi:','Izin file `.md`','Kontrol versi:','Branch per progress:','Scope task:',
  'Sebelum membangun fitur','Lokasi wajib','File rencana mengikuti','Gunakan `Spesifikasi`','Eksekusi plan memakai','Plan dipecah','Setiap task yang selesai','Setelah task selesai','Plan selalu','Plan progress atas permintaan','Header branch wajib','Commit per task di plan','Semua file `.md` di `docs/superpowers/`',
  'Test otomatis belum','Sebelum commit','Saat test ditambahkan','Tambah atau perbarui test','Status QA MVP','Branch:','Format judul:','Scope:','Jangan commit',
  'Saat mengubah rute','Saat menambah fitur','Lebih baik edit','Jika ragu tentang skema','Jangan edit migration','QA live owner-side','Type-check membutuhkan',
  'needs-triage','Single-context'
)
foreach ($p in $required) { if ((Select-String -Path AGENTS.md -SimpleMatch -Pattern $p | Measure-Object).Count -eq 0) { "MISSING: $p" } }
```

Expected: tanpa output (setiap kata kunci aturan lama masih ada).

- [x] **Step 3: Verifikasi struktur akhir**

Run: `Select-String -Path AGENTS.md -Pattern '^#{2,3} ' | ForEach-Object { $_.Line }`
Expected: 6 heading `##` sesuai urutan. `###` yang diizinkan hanya `### Issue tracker`, `### Triage labels`, `### Domain docs`, dan `### Catatan`; tanpa heading berbahasa Inggris. Pastikan blok `Struktur proyek` masih berada di dalam code fence.

- [x] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs(agents): document known rule conflicts"
```

Commit: `9d3fcf9` `docs(agents): document known rule conflicts`

## Final review

Reviewer fresh-context: verdict `With fixes`. Tidak ada Critical.

- Fixed: kalimat branch ganda, duplikat semantik migration/komponen/QA, dan `keduanya harus lulus` → `ketiganya harus lulus`.
- Ruling: pesan commit lama tidak di-rewrite; aturan Conventional Commits berlaku untuk commit berikutnya.
- Ruling: `### Issue tracker`, `### Triage labels`, `### Domain docs` tetap bahasa Inggris sesuai expected output plan Task 4.
- Verifikasi: cakupan kata kunci, urutan heading, struktur code fence, hitungan duplikat akhir, `npx eslint src`, `npm run build`, `npx tsc -b` — semua lulus.

Commit: `207db08` `docs(agents): gabung aturan ganda`
