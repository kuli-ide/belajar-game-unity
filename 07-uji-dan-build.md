# 7. Pengujian, Masalah Umum, dan Build

## 7.1 Daftar Uji Lengkap
Mainkan **dari scene Menu** (bukan dari scene soal) agar skor dan alur benar.

| No | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Klik MULAI | Pindah ke SusunKata1 |
| 2 | Lihat huruf acak | Tidak sama dengan susunan kata benar |
| 3 | Ketuk huruf | Mengisi kotak dari kiri, tombol huruf abu-abu |
| 4 | Ketuk kotak berisi | Huruf kembali, tombol aktif lagi |
| 5 | Susun salah | Suara salah, semua huruf kembali setelah 0,7 detik |
| 6 | Susun benar | Suara benar, pindah scene setelah 1 detik |
| 7 | Selesai semua soal | Scene Hasil menampilkan skor dan bintang |
| 8 | Klik MENU di Hasil | Kembali ke Menu |
| 9 | MULAI lagi | Skor kembali 0 |
| 10 | Klik TENTANG lalu KEMBALI | Pergi ke Tentang lalu kembali ke Menu |

## 7.2 Masalah Umum

| Gejala di Console/layar | Penyebab | Solusi |
|---|---|---|
| `Scene 'X' couldn't be loaded because it has not been added to the build settings` | Scene belum didaftarkan atau nama salah | Tambahkan di **File > Build Settings**, cek ejaan dan huruf besar-kecil |
| `NullReferenceException` di `BangunSoal` | Prefab atau grup belum diisi | Isi semua kolom Susun Kata |
| Tombol tidak bereaksi sama sekali | Tidak ada `EventSystem` di scene | **GameObject > UI > Event System** |
| Huruf menumpuk di satu titik | Layout Group belum dipasang | Tambahkan Horizontal Layout Group pada kedua grup |
| Kotak jawaban tidak bisa diketuk | Prefab `TempatJawaban` bukan Button | Buat ulang dari **UI > Button - TextMeshPro** |
| Teks bintang tampil kotak | Font tidak punya karakter `★` | Pakai UI Image sebagai bintang |
| Skor selalu 0 di Hasil | Memainkan scene Hasil langsung dari Editor | Mulai dari scene Menu |
| `KELUAR` tidak berfungsi | `Application.Quit()` hanya bekerja di build | Uji pada hasil build |
| Error compile `TMP_Text` tidak ditemukan | TMP Essentials belum di-import | **Window > TextMeshPro > Import TMP Essential Resources** |
| Tidak ada suara | Klip atau AudioSource belum diisi | Isi kolom Suara Benar, Suara Salah, dan Suara |

## 7.3 Build ke Android

1. **File > Build Settings**, pilih **Android**, klik **Switch Platform**.
2. Pastikan modul **Android Build Support** terpasang (Unity Hub > Installs > Add modules).
3. **Player Settings**:
   - *Company Name* dan *Product Name*
   - *Default Orientation*: Portrait (sesuaikan resolusi Canvas)
   - *Minimum API Level*: bawaan Unity
4. Hubungkan HP (aktifkan *USB Debugging*) lalu klik **Build And Run**, atau klik **Build** untuk menghasilkan berkas `.apk`.

## 7.4 Build ke WebGL (untuk GitHub Pages)

1. **File > Build Settings**, pilih **WebGL**, klik **Switch Platform**.
2. **Player Settings > Publishing Settings > Compression Format**: pilih **Disabled** (GitHub Pages tidak mengirim header kompresi Unity).
3. Klik **Build**, pilih folder tujuan, misalnya `docs-web/`.
4. Salin isi folder hasil build ke repositori GitHub.
5. Di GitHub: **Settings > Pages > Source**, pilih cabang dan folder yang berisi `index.html`.
6. Tunggu beberapa menit, lalu buka alamat `https://namaakun.github.io/namarepo/`.

## 7.5 Mengunggah Proyek Unity ke GitHub

### Yang diunggah
```
Assets/
Packages/
ProjectSettings/
.gitignore
```

### Yang **tidak** diunggah
`Library/`, `Temp/`, `Obj/`, `Build/`, `Logs/`, `UserSettings/`. Gunakan `.gitignore` Unity standar (tersedia di templat GitHub: **Add .gitignore > Unity**).

### Langkah singkat (Git)
```bash
git init
git add .
git commit -m "Game Susun Kata - versi awal"
git branch -M main
git remote add origin https://github.com/namaakun/namarepo.git
git push -u origin main
```

## 7.6 Rubrik Penilaian (Contoh)

| Aspek | Indikator | Skor |
|---|---|---|
| Scene | Kelima scene lengkap dan terhubung | 20 |
| UI | Tampilan rapi, teks terbaca, tombol berfungsi | 20 |
| Logika | Susun kata, pengecekan, skor, bintang benar | 25 |
| Soal | Menambah minimal 1 soal baru (SusunKata3) | 15 |
| Kreativitas | Tema, audio, animasi, atau fitur tambahan | 10 |
| Dokumentasi | Build berhasil dan repositori GitHub rapi | 10 |
| **Total** | | **100** |

## 7.7 Refleksi
1. Bagian mana yang paling sulit dan bagaimana mengatasinya?
2. Bagaimana cara membuat soal bertambah tanpa menduplikat scene?
3. Fitur apa yang ingin ditambahkan berikutnya?
