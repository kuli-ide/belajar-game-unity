# 1. Scene `Menu`

Halaman awal game. Pemain dapat memulai permainan, membuka halaman Tentang, atau keluar.

## Tujuan
- Membuat tata letak menu dengan UI.
- Menghubungkan tombol ke fungsi di `GameManager` (On Click).

## Hasil Akhir
```
┌─────────────────────┐
│     GAME SUSUN KATA │
│                     │
│     [  MULAI  ]     │
│     [ TENTANG ]     │
│     [ KELUAR  ]     │
└─────────────────────┘
```

## Langkah 1: Buka scene
Buka `Assets/Scenes/Menu`. Pastikan ada `Canvas` dan `EventSystem` (lihat [00-persiapan-proyek.md](00-persiapan-proyek.md), bagian 0.6).

## Langkah 2: Susun Hierarchy
Buat objek berikut di bawah `Canvas`:

```
Canvas
├── Background          (UI > Image)
├── Judul               (UI > Text - TextMeshPro)
├── BtnMulai            (UI > Button - TextMeshPro)
├── BtnTentang          (UI > Button - TextMeshPro)
└── BtnKeluar           (UI > Button - TextMeshPro)
EventSystem
GameManager             (Create Empty + script GameManager)
```

## Langkah 3: Atur tampilan

| Objek | Pengaturan |
|---|---|
| `Background` | Anchor *stretch* penuh (Alt+Shift klik preset kanan bawah), warna sesuai selera |
| `Judul` | Teks "GAME SUSUN KATA", Font Size 90, Bold, rata tengah, posisi di bagian atas |
| `BtnMulai` | Ukuran 500×140, teks "MULAI", posisi tengah |
| `BtnTentang` | Ukuran 500×140, teks "TENTANG", 180 px di bawah BtnMulai |
| `BtnKeluar` | Ukuran 500×140, teks "KELUAR", 180 px di bawah BtnTentang |

Teks tombol diubah pada objek anak `Text (TMP)`.

## Langkah 4: Isi kolom GameManager
Pilih objek `GameManager`, lalu isi di Inspector:

| Kolom | Nilai |
|---|---|
| Halaman_Menu | `Menu` |
| Halaman_Permainan | `SusunKata1` |
| Halaman_Hasil | `Hasil` |
| Kolom lain | Dibiarkan kosong |

> Nilai di atas adalah **nama scene** (teks), bukan objek. Secara bawaan ketiganya sudah terisi persis seperti tabel ini saat script dipasang. Periksa saja bahwa ejaannya sama dengan nama scene Anda.

## Langkah 5: Hubungkan tombol (On Click)
Untuk tiap tombol: pilih tombol, di komponen **Button** cari **On Click ()**, klik **+**, seret objek `GameManager` dari Hierarchy ke kolom objek, lalu pilih fungsi.

| Tombol | Fungsi yang dipilih | Parameter |
|---|---|---|
| `BtnMulai` | `GameManager > MulaiPermainan` | - |
| `BtnTentang` | `GameManager > PindahScene (string)` | ketik `Tentang` |
| `BtnKeluar` | `GameManager > Keluar` | - |

## Langkah 6: Uji
1. Simpan scene (**Ctrl+S**).
2. Tekan **Play** dari scene Menu.
3. Klik **MULAI**: harus pindah ke `SusunKata1`.
4. Kembali ke Menu, klik **TENTANG**: harus pindah ke `Tentang`.
5. `KELUAR` tidak berefek di Editor (hanya bekerja di hasil build).

## Penjelasan Singkat
- `MulaiPermainan()` mengatur skor menjadi 0 lalu memuat scene yang tertulis di kolom `Halaman_Permainan`.
- `PindahScene(string)` memuat scene dengan nama yang diketik di kolom parameter tombol, berguna untuk tombol serbaguna.
- `Keluar()` memanggil `Application.Quit()`.

## Latihan Mandiri
1. Tambahkan musik latar dengan `AudioSource` (Loop dicentang, Play On Awake dicentang).
2. Tambahkan animasi *hover* pada tombol dengan mengubah **Transition** menjadi *Color Tint*.
3. Ganti warna latar dan font sesuai tema sekolah.

## Pemeriksaan
- [ ] Tiga tombol tampil rapi
- [ ] `Halaman_Permainan` berisi `SusunKata1`
- [ ] Mulai dan Tentang berpindah scene dengan benar

Lanjut ke: [02-scene-tentang.md](02-scene-tentang.md)
