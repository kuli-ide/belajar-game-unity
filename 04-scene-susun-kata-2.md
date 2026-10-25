# 4. Scene `SusunKata2`

Soal kedua. Pemain menyusun kata **PROGRAM**, dan setelah benar diarahkan ke halaman Hasil.

## Tujuan
- Menduplikasi scene soal dengan cepat.
- Memahami bahwa kolom `Halaman Selanjutnya` menentukan alur permainan.

## Langkah 1: Duplikat scene SusunKata1
1. Di jendela Project, pilih `Assets/Scenes/SusunKata1`.
2. Tekan **Ctrl+D**. Unity membuat `SusunKata1 1`.
3. Ganti nama menjadi `SusunKata2`.
4. Buka scene `SusunKata2`.

> Jika sebelumnya sudah membuat scene `SusunKata2` kosong (modul 0.4), hapus yang kosong lebih dulu atau salin isi Hierarchy dari SusunKata1 dengan **Ctrl+C / Ctrl+V**.

## Langkah 2: Ubah judul soal
Pada objek `JudulSoal`, ubah teks menjadi **"Susun Kata 2"**.

## Langkah 3: Ubah kolom GameManager

Pilih `GameManager`. Hanya **tiga kolom** yang berbeda dari SusunKata1:

| Kolom | SusunKata1 | **SusunKata2** |
|---|---|---|
| Kata | `UNITY` | **`PROGRAM`** |
| Bobot | `10` | **`10`** (boleh diubah) |
| Halaman Selanjutnya | `SusunKata2` | **`Hasil`** |

Kolom lain (grup, prefab, suara) tetap sama dan sudah terisi dari hasil duplikasi.

> Soal terakhir harus mengarah ke scene `Hasil`. Isi kolom `Halaman Selanjutnya` dengan `Hasil` agar alurnya jelas. (Bila kolom ini dikosongkan, script memakai nilai `Halaman_Hasil` sebagai cadangan, yang secara bawaan juga `Hasil`.)

## Langkah 4: Daftarkan ke Build Settings
Buka **File > Build Settings**, buka scene SusunKata2, klik **Add Open Scenes** bila belum ada.

## Langkah 5: Uji alur
1. Buka scene `Menu`, tekan **Play**.
2. Klik **MULAI**, susun **UNITY**, lalu otomatis ke SusunKata2.
3. Susun **PROGRAM** dengan benar: pindah ke scene `Hasil` (kosong dulu bila belum dibuat; Unity akan menampilkan error bila scene belum ada).

## Menambah Soal ke-3, ke-4, dan Seterusnya
1. Duplikat scene soal terakhir (**Ctrl+D**), beri nama `SusunKata3`.
2. Ubah `Kata` dan `Bobot`.
3. Pada scene **sebelumnya**, ubah `Halaman Selanjutnya` menjadi `SusunKata3`.
4. Pada scene baru, isi `Halaman Selanjutnya` = `Hasil`.
5. Tambahkan `SusunKata3` ke Build Settings.

Ilustrasi alur:

```
SusunKata1 ──(Halaman Selanjutnya = SusunKata2)──► SusunKata2
SusunKata2 ──(Halaman Selanjutnya = SusunKata3)──► SusunKata3
SusunKata3 ──(Halaman Selanjutnya = Hasil)───────► Hasil
```

## Latihan Mandiri
1. Buat `SusunKata3` dengan kata `KOMPUTER`.
2. Beri bobot berbeda tiap soal (10, 15, 20) dan sesuaikan `Batas_bintang` di scene Hasil.

## Pemeriksaan
- [ ] Judul menampilkan "Susun Kata 2"
- [ ] `Kata` = `PROGRAM`
- [ ] `Halaman Selanjutnya` = `Hasil`
- [ ] Skor dari soal 1 terbawa ke soal 2 (diuji di halaman Hasil)

Lanjut ke: [05-scene-hasil.md](05-scene-hasil.md)
