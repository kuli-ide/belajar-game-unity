# Modul Praktik: Game Susun Kata dengan Unity

Modul langkah demi langkah untuk membuat game edukasi **Susun Kata** (huruf diacak, pemain menyusun menjadi kata yang benar) menggunakan Unity 2D/UI.

> Versi Unity yang disarankan: **2021.3 LTS atau lebih baru**
> Bahasa pemrograman: **C#**

---

## Tujuan Pembelajaran

Setelah menyelesaikan modul ini, peserta mampu:

1. Menyusun beberapa scene Unity (menu, informasi, permainan, hasil) dan menghubungkannya.
2. Membuat antarmuka (UI) dengan Canvas, Button, Text, dan Layout Group.
3. Membuat dan memakai **Prefab** untuk objek yang dibuat berulang (tombol huruf).
4. Menulis satu script `GameManager` yang dipakai ulang di semua scene.
5. Menyimpan skor antar scene dan menampilkan hasil berupa bintang.
6. Membuild game ke Android atau WebGL.

## Gambaran Game

```
Menu ──► SusunKata1 ──► SusunKata2 ──► Hasil ──► Menu
  │
  └──► Tentang ──► Menu
```

- Pemain mengetuk huruf acak untuk mengisi kotak jawaban dari kiri ke kanan.
- Mengetuk kotak jawaban yang sudah terisi akan mengembalikan hurufnya.
- Jawaban dicek otomatis saat semua kotak terisi: benar, skor bertambah dan lanjut; salah, susunan diulang.
- Di akhir, halaman **Hasil** menampilkan skor dan 1–3 bintang.

## Daftar Isi Modul

| No | Berkas | Isi |
|---|---|---|
| 0 | [00-persiapan-proyek.md](00-persiapan-proyek.md) | Membuat proyek, folder, Canvas, dan 2 Prefab |
| 1 | [01-scene-menu.md](01-scene-menu.md) | Scene **Menu** |
| 2 | [02-scene-tentang.md](02-scene-tentang.md) | Scene **Tentang** |
| 3 | [03-scene-susun-kata-1.md](03-scene-susun-kata-1.md) | Scene **SusunKata1** |
| 4 | [04-scene-susun-kata-2.md](04-scene-susun-kata-2.md) | Scene **SusunKata2** |
| 5 | [05-scene-hasil.md](05-scene-hasil.md) | Scene **Hasil** |
| 6 | [06-game-manager.md](06-game-manager.md) | Penjelasan rinci script **GameManager** |
| 7 | [/07-uji-dan-build.md](07-uji-dan-build.md) | Pengujian, masalah umum, dan build |
| - | [GameManager.cs](GameManager.cs) | Kode lengkap |

**Urutan pengerjaan yang disarankan:** 0 → 6 (pahami script) → 1 → 2 → 3 → 4 → 5 → 7.

## Struktur Repositori

```
.
├── README.md
├── Scripts/
│   └── GameManager.cs
└── docs/
    ├── 00-persiapan-proyek.md
    ├── 01-scene-menu.md
    ├── 02-scene-tentang.md
    ├── 03-scene-susun-kata-1.md
    ├── 04-scene-susun-kata-2.md
    ├── 05-scene-hasil.md
    ├── 06-game-manager.md
    └── 07-uji-dan-build.md
```

## Nama Scene yang Harus Dipakai

Nama scene dipanggil lewat teks di Inspector, jadi **harus persis sama** (huruf besar-kecil berpengaruh):

`Menu` · `Tentang` · `SusunKata1` · `SusunKata2` · `Hasil`

## Lisensi

Silakan dipakai dan dimodifikasi untuk keperluan pembelajaran. Cantumkan sumber bila disebarluaskan.
