# Belajar Game Unity

Website pembelajaran membuat game 2D di Unity dengan simulasi interaktif, contoh kode C#, kuis, dan sistem XP. Situs ini statis (HTML, CSS, JavaScript biasa), tanpa build dan tanpa dependency, jadi bisa langsung dipasang di GitHub Pages.

## Isi folder

```
belajar-unity/
├── index.html          kerangka halaman
├── css/style.css       seluruh tampilan (termasuk mode gelap)
└── js/
    ├── lessons.js      data pelajaran dan kuis (file yang paling sering kamu ubah)
    ├── playground.js   simulasi platformer di beranda dan pelajaran 2
    └── app.js          routing, kuis, progres XP, penyorot kode
```

## Mencoba di komputer

Cara paling mudah: klik dua kali `index.html`. Semua fitur berjalan tanpa server.

Jika ingin meniru kondisi GitHub Pages, jalankan server lokal dari folder ini:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Memasang di GitHub Pages

**Lewat browser (tanpa Git)**

1. Buka github.com, klik **New repository**, beri nama misalnya `belajar-unity`, pilih **Public**, lalu **Create repository**.
2. Klik **uploading an existing file**, seret seluruh isi folder ini (`index.html`, folder `css`, dan folder `js`), lalu **Commit changes**.
3. Buka **Settings > Pages**.
4. Pada **Build and deployment**, pilih Source **Deploy from a branch**, Branch **main**, folder **/ (root)**, lalu **Save**.
5. Tunggu 1 sampai 2 menit. Alamat situs muncul di halaman yang sama, biasanya `https://USERNAME.github.io/belajar-unity/`.

**Lewat Git**

```bash
cd belajar-unity
git init
git add .
git commit -m "Situs belajar Unity"
git branch -M main
git remote add origin https://github.com/USERNAME/belajar-unity.git
git push -u origin main
```

Lalu lanjutkan dari langkah 3 di atas.

## Menambah atau mengubah pelajaran

Buka `js/lessons.js`. Setiap pelajaran adalah satu objek di array `LESSONS`. Salin salah satu objek, lalu ganti `id` (huruf kecil, tanpa spasi), `title`, dan isi `blocks`.

| Jenis block | Fungsi | Contoh |
|---|---|---|
| `h` | Judul bagian | `{ type: 'h', text: 'Langkah awal' }` |
| `p` | Paragraf (mendukung `` `kode` `` dan `**tebal**`) | `{ type: 'p', text: 'Teks...' }` |
| `steps` | Daftar langkah bernomor | `{ type: 'steps', items: ['...', '...'] }` |
| `code` | Kode C# dengan tombol Salin | `{ type: 'code', file: 'Nama.cs', code: \`...\` }` |
| `note` | Kotak catatan (`kind`: `tip` atau `warn`) | `{ type: 'note', kind: 'tip', title: 'Tips', text: '...' }` |
| `table` | Tabel | `{ type: 'table', head: [...], rows: [[...]] }` |
| `tree` | Struktur Hierarchy | `{ type: 'tree', text: '...' }` |
| `playground` | Menyisipkan simulasi platformer | `{ type: 'playground' }` |
| `quiz` | Kuis pilihan ganda | lihat contoh di bawah |

```js
{ type: 'quiz', questions: [
  { q: 'Pertanyaan?',
    options: ['A', 'B', 'C'],
    answer: 1,                 // indeks jawaban benar, mulai dari 0
    explain: 'Penjelasan singkat.' }
] }
```

Tips: jika kode berisi karakter backtick atau `${`, tulis dengan tanda kutip biasa dan escape seperlunya, karena `code` memakai template literal.

## Mengatur simulasi

Nilai awal slider ada di `js/playground.js` (objek `cfg` dan atribut slider di `create`). Bentuk level ada di konstanta `SOLIDS` (platform), `COIN_POS` (koin), `NPC`, dan `DOOR`. Satuan yang dipakai adalah unit Unity, 1 unit = 40 piksel.

## Catatan

- Progres belajar (pelajaran selesai, jawaban kuis, tema) disimpan di `localStorage` browser masing-masing pengunjung. Tidak ada data yang dikirim ke server.
- Font memakai Google Fonts. Tanpa internet, tampilan memakai font sistem dan tetap berfungsi.
- Tombol **Hapus progres** di bagian bawah halaman mengosongkan data tersimpan.
