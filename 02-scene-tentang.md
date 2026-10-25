# 2. Scene `Tentang`

Halaman informasi tentang game dan pembuatnya, dengan tombol kembali ke menu.

## Tujuan
- Membuat halaman teks statis.
- Memakai fungsi `KeMenu()` pada tombol.

## Hasil Akhir
```
┌─────────────────────┐
│       TENTANG       │
│                     │
│  Game Susun Kata    │
│  Dibuat oleh: ...   │
│  Cara bermain: ...  │
│                     │
│     [ KEMBALI ]     │
└─────────────────────┘
```

## Langkah 1: Buka scene
Buka `Assets/Scenes/Tentang`. Pastikan ada `Canvas`, `EventSystem`, dan `GameManager`.

## Langkah 2: Susun Hierarchy

```
Canvas
├── Background          (UI > Image)
├── Judul               (UI > Text - TextMeshPro)
├── IsiTentang          (UI > Text - TextMeshPro)
└── BtnKembali          (UI > Button - TextMeshPro)
EventSystem
GameManager
```

## Langkah 3: Atur tampilan

| Objek | Pengaturan |
|---|---|
| `Background` | Anchor stretch penuh, warna sama dengan scene Menu agar konsisten |
| `Judul` | Teks "TENTANG", Font Size 80, Bold, rata tengah, posisi atas |
| `IsiTentang` | Lebar 900, tinggi 800, Font Size 44, rata kiri, *Auto Size* boleh diaktifkan, teks seperti contoh di bawah |
| `BtnKembali` | Ukuran 500×140, teks "KEMBALI", posisi bawah |

Contoh isi `IsiTentang`:

```
Game Susun Kata

Dibuat sebagai media belajar Pengembangan Gim.
Pembuat   : (isi nama)
Sekolah   : (isi nama sekolah)
Tahun     : 2026

Cara bermain:
1. Ketuk huruf acak untuk mengisi kotak jawaban.
2. Ketuk kotak jawaban untuk mengembalikan huruf.
3. Susun semua huruf menjadi kata yang benar.
```

## Langkah 4: Isi kolom GameManager

| Kolom | Nilai |
|---|---|
| Halaman_Menu | `Menu` |
| Kolom lain | Dibiarkan kosong |

## Langkah 5: Hubungkan tombol

| Tombol | Fungsi | Parameter |
|---|---|---|
| `BtnKembali` | `GameManager > KeMenu` | - |

(Seret objek `GameManager` ke kolom On Click, lalu pilih fungsi.)

## Langkah 6: Uji
1. Simpan scene, mainkan dari scene Menu.
2. Klik **TENTANG**, baca halaman, lalu klik **KEMBALI**: harus kembali ke Menu.

## Penjelasan Singkat
`KeMenu()` hanya memuat scene yang tertulis di `Halaman_Menu`. Karena itu kolom tersebut **wajib diisi** di scene yang punya tombol kembali. Jika kosong, Unity menampilkan error saat tombol diklik.

## Latihan Mandiri
1. Tambahkan logo sekolah dengan komponen **Image**.
2. Gunakan **Scroll View** bila isi teks panjang.
3. Tambahkan tautan ke repositori GitHub dengan `Application.OpenURL("https://...")` pada tombol baru.

## Pemeriksaan
- [ ] Teks terbaca jelas dan tidak keluar dari layar
- [ ] `Halaman_Menu` berisi `Menu`
- [ ] Tombol Kembali berfungsi

Lanjut ke: [03-scene-susun-kata-1.md](03-scene-susun-kata-1.md)
