# 5. Scene `Hasil`

Menampilkan skor akhir dan bintang (1–3) sesuai capaian.

## Tujuan
- Menampilkan skor yang dibawa dari scene sebelumnya.
- Menyalakan jumlah bintang berdasarkan ambang batas.

## Hasil Akhir
```
┌──────────────────────┐
│        HASIL         │
│                      │
│      ★  ★  ☆         │
│                      │
│     Skor: 20         │
│                      │
│     [  MENU  ]       │
└──────────────────────┘
```

## Langkah 1: Buka scene
Buka `Assets/Scenes/Hasil`. Pastikan ada `Canvas`, `EventSystem`, dan `GameManager`.

## Langkah 2: Susun Hierarchy

```
Canvas
├── Background          (UI > Image)
├── Judul               (UI > Text - TextMeshPro)
├── GrupBintang         (Create Empty + Horizontal Layout Group)
│   ├── Bintang1        (UI > Text - TextMeshPro, teks "★")
│   ├── Bintang2        (UI > Text - TextMeshPro, teks "★")
│   └── Bintang3        (UI > Text - TextMeshPro, teks "★")
├── TextScore           (UI > Legacy > Text)
└── BtnMenu             (UI > Button - TextMeshPro)
EventSystem
GameManager
```

## Langkah 3: Atur tampilan

| Objek | Pengaturan |
|---|---|
| `Judul` | Teks "HASIL", Font Size 90, Bold, posisi atas |
| `GrupBintang` | Lebar 600, tinggi 200, tengah. Horizontal Layout Group: Spacing 30, Child Alignment Middle Center, Control Child Size dan Force Expand tidak dicentang |
| `Bintang1/2/3` | Ukuran 150×150, teks `★`, Font Size 140, warna emas (`#FFC107`), rata tengah |
| `TextScore` | Teks "0", Font Size 80, rata tengah, di bawah bintang |
| `BtnMenu` | Ukuran 500×140, teks "MENU", posisi bawah |

> **Catatan:**
> - `TextScore` memakai **Legacy Text** (menu *UI > Legacy > Text*), karena kolom `Text_score` di script bertipe `Text`.
> - Karakter `★` sering **tidak ada di font bawaan** TextMeshPro sehingga tampil sebagai kotak. Cara yang paling aman: ganti `Bintang1/2/3` dengan **UI > Image** yang diberi gambar bintang (PNG gratis, taruh di `Assets/`, lalu ubah Texture Type menjadi *Sprite (2D and UI)*). Kolom `Bintang` hanya menerima GameObject, jadi Image maupun teks sama-sama berfungsi.

## Langkah 4: Matikan objek bintang
Pilih `Bintang1`, `Bintang2`, dan `Bintang3`, lalu **hapus centang** di pojok kiri atas Inspector (objek dinonaktifkan). Script akan menyalakan sesuai jumlah bintang yang diraih.

## Langkah 5: Isi kolom GameManager

| Kolom | Nilai |
|---|---|
| Halaman_Menu | `Menu` |
| Bintang | **Size = 3**, lalu seret `Bintang1`, `Bintang2`, `Bintang3` ke Element 0, 1, 2 |
| Text_score | seret objek `TextScore` |
| Batas_bintang_1 | `10` |
| Batas_bintang_2 | `15` |
| Batas_bintang_3 | `20` |
| Kolom lain | Dibiarkan kosong |

Contoh dengan 2 soal bobot 10 (skor maksimum 20):

| Skor | Bintang |
|---|---|
| 0 – 9 | 0 |
| 10 – 14 | 1 |
| 15 – 19 | 2 |
| 20 | 3 |

> Sesuaikan ambang batas dengan jumlah soal dan bobot. Bila skor maksimum 60, mis. batas 20/40/60.

## Langkah 6: Hubungkan tombol

| Tombol | Fungsi |
|---|---|
| `BtnMenu` | `GameManager > KeMenu` |

## Langkah 7: Uji
1. Mainkan dari scene Menu, selesaikan kedua soal dengan benar: skor 20 dan 3 bintang.
2. Klik **MENU**, lalu **MULAI** lagi: skor kembali dari 0.
3. Untuk menguji jumlah bintang yang lain, ubah sementara `Bobot` di scene soal (mis. 5) atau `Batas_bintang_1/2/3` di scene Hasil, lalu jalankan ulang dari Menu.

> Game ini tidak punya jalur kalah, jadi hasil dengan skor rendah diuji lewat pengubahan `Bobot` atau ambang batas seperti di atas.

## Penjelasan Singkat
`Start()` mengisi `nilai` dari variabel `static total`. Karena kolom `Bintang` di scene ini berisi 3 objek, script memanggil `TampilkanHasil()` yang:
1. Menampilkan skor di `Text_score`.
2. Menghitung jumlah bintang dari ambang batas.
3. Menyalakan objek bintang sesuai jumlahnya, dan mematikan sisanya.

## Latihan Mandiri
1. Tambahkan tulisan komentar ("Hebat!", "Coba lagi") sesuai jumlah bintang.
2. Tambahkan tombol **Main Lagi** yang memanggil `MulaiPermainan`.
3. Simpan skor tertinggi dengan `PlayerPrefs`.

## Pemeriksaan
- [ ] Bintang dimatikan di Hierarchy sebelum dijalankan
- [ ] `Text_score` terhubung ke Legacy Text
- [ ] Skor sesuai total bobot soal yang dijawab benar
- [ ] Tombol Menu kembali ke Menu

Lanjut ke: [06-game-manager.md](06-game-manager.md)
