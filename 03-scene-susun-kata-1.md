# 3. Scene `SusunKata1`

Soal pertama. Pemain menyusun huruf acak menjadi kata **UNITY**.

## Tujuan
- Membuat halaman permainan dengan dua grup (kotak jawaban dan huruf acak).
- Mengisi semua kolom soal pada `GameManager`.
- Memahami bahwa kotak dan tombol huruf dibuat otomatis oleh script dari Prefab.

## Hasil Akhir
```
┌──────────────────────┐
│ Susun Kata 1    Skor │
│                      │
│   [ ][ ][ ][ ][ ]    │  ← kotak jawaban
│                      │
│   [T][I][N][U][Y]    │  ← huruf acak
└──────────────────────┘
```

## Langkah 1: Buka scene
Buka `Assets/Scenes/SusunKata1`. Pastikan ada `Canvas`, `EventSystem`, dan objek `GameManager`. Prefab `TempatJawaban` dan `ButtonJawaban` harus sudah siap ([00-persiapan-proyek.md](00-persiapan-proyek.md), bagian 0.7 dan 0.8).

## Langkah 2: Susun Hierarchy

```
Canvas
├── Background             (UI > Image)
├── JudulSoal              (UI > Text - TextMeshPro)
├── PetunjukText           (UI > Text - TextMeshPro)
├── GrupTempatJawaban      (Create Empty + Horizontal Layout Group)
└── GrupButtonJawaban      (Create Empty + Horizontal Layout Group)
EventSystem
GameManager                (script GameManager + AudioSource)
```

> `GrupTempatJawaban` dan `GrupButtonJawaban` **dibiarkan kosong**. Anak-anaknya dibuat otomatis saat game dimulai.

## Langkah 3: Atur tampilan

| Objek | Pengaturan |
|---|---|
| `Background` | Anchor stretch penuh |
| `JudulSoal` | Teks "Susun Kata 1", Font Size 70, posisi atas |
| `PetunjukText` | Teks "Susun huruf menjadi kata yang benar", Font Size 40, di bawah judul |
| `GrupTempatJawaban` | Rect Transform: lebar 1000, tinggi 120, posisi tengah atas (mis. Y = 250). Tambahkan **Horizontal Layout Group** (pengaturan di bagian 0.10) |
| `GrupButtonJawaban` | Rect Transform: lebar 1000, tinggi 120, posisi tengah bawah (mis. Y = -150). Tambahkan **Horizontal Layout Group** dengan pengaturan sama |

Cara menambah Layout Group: pilih objek, **Add Component**, ketik `Horizontal Layout Group`.

## Langkah 4: Tambahkan AudioSource
1. Pilih `GameManager`, **Add Component > Audio Source**.
2. Hapus centang **Play On Awake**.
3. Biarkan kolom *AudioClip* pada AudioSource kosong. Klip diisi lewat kolom di script.

## Langkah 5: Isi kolom GameManager

Pilih objek `GameManager`, isi kolom berikut:

### Pengaturan Halaman Susun Kata

| Kolom | Nilai |
|---|---|
| Grup Tempat Jawaban | seret objek `GrupTempatJawaban` |
| Grup Button Jawaban | seret objek `GrupButtonJawaban` |
| Prefabs Tempat Jawaban | seret prefab `TempatJawaban` dari folder Prefabs |
| Prefabs Button Jawaban | seret prefab `ButtonJawaban` dari folder Prefabs |
| Kata | `UNITY` |
| Bobot | `10` |
| Halaman Selanjutnya | `SusunKata2` |
| Suara Benar | seret klip `benar` |
| Suara Salah | seret klip `salah` |
| Suara | seret objek `GameManager` sendiri (komponen AudioSource) |

### Kolom lain

| Kolom | Nilai |
|---|---|
| Halaman_Menu, Halaman_Permainan, Halaman_Hasil | Biarkan nilai bawaan (`Menu`, `SusunKata1`, `Hasil`). `Halaman_Hasil` dipakai sebagai tujuan cadangan |
| Nilai | Dibiarkan. Hanya untuk debugging, terisi otomatis |
| Bintang, Text_score, Batas_bintang | Dikosongkan |

> Menyeret objek `GameManager` ke kolom **Suara** akan mengambil komponen AudioSource miliknya.
> Jika kolom `Kata` terisi huruf kecil, script otomatis mengubahnya menjadi huruf kapital.

## Langkah 6: Uji
1. Simpan scene, lalu tekan **Play** (boleh langsung dari scene ini).
2. Harus muncul 5 kotak kosong dan 5 tombol huruf acak.
3. Ketuk huruf: huruf mengisi kotak dari kiri, tombol huruf menjadi tidak aktif (abu-abu).
4. Ketuk kotak berisi huruf: huruf kembali dan tombol aktif lagi.
5. Susun **UNITY** dengan benar: terdengar suara benar, lalu pindah ke `SusunKata2` setelah 1 detik.
6. Susun salah: terdengar suara salah, semua huruf kembali setelah 0,7 detik.

> Bila dimainkan langsung dari scene ini, skor dimulai dari 0. Skor tersimpan di variabel `static`, jadi untuk pengujian penuh mulailah dari scene Menu.

## Penjelasan Singkat
Saat scene dimulai, `Start()` memeriksa apakah kolom `Kata` terisi. Jika ya, `BangunSoal()` membuat satu kotak per huruf kata dan satu tombol per huruf yang sudah diacak. Detailnya ada di [06-game-manager.md](06-game-manager.md).

## Membuat Soal Sendiri
Ubah dua kolom saja:
- `Kata`: kata soal yang baru
- `Bobot`: poin untuk soal tersebut

Contoh kata: `SEKOLAH`, `KOMPUTER`, `JARINGAN`, `DESAIN`. Perhatikan batas panjang kata pada bagian 0.10.

## Latihan Mandiri
1. Tambahkan teks petunjuk (mis. "Nama mesin pencari game") sebagai `TextMeshPro` tambahan.
2. Ganti `Bobot` menjadi 20 dan amati perubahan skor di halaman Hasil.
3. Tambahkan animasi kecil saat jawaban benar.

## Masalah Umum

| Gejala | Penyebab | Solusi |
|---|---|---|
| Tidak ada kotak/huruf muncul | Kolom `Kata` kosong atau grup/prefab belum diisi | Periksa kolom Susun Kata |
| Huruf bertumpuk | Layout Group belum dipasang | Tambahkan Horizontal Layout Group |
| Tidak pindah scene | `Halaman Selanjutnya` salah ketik atau scene belum di Build Settings | Cek nama dan Build Settings |
| Tidak ada suara | Kolom `Suara` kosong atau klip belum diisi | Isi kolom Suara dan klip |
| Kotak tidak bisa diketuk | Prefab `TempatJawaban` tidak punya komponen Button | Gunakan Button TMP |

## Pemeriksaan
- [ ] Kata dan Bobot terisi, `Halaman Selanjutnya` = `SusunKata2`
- [ ] Huruf tampil acak dan bukan susunan benar
- [ ] Mengetuk kotak mengembalikan huruf
- [ ] Jawaban benar berpindah ke SusunKata2

Lanjut ke: [04-scene-susun-kata-2.md](04-scene-susun-kata-2.md)
