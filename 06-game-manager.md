# 6. GameManager

Satu script, `GameManager.cs`, dipakai di **kelima scene**. Bagian yang bekerja ditentukan oleh kolom Inspector yang diisi. Tampilannya di Inspector terbagi empat kelompok:

```
Pengaturan Halaman Menu
Pengaturan Halaman Susun Kata
Untuk Keperluan Debugging, Tidak Perlu Diisi !
Pengaturan Halaman Hasil
```

Kode lengkap: [../Scripts/GameManager.cs](../Scripts/GameManager.cs)

## 6.1 Konsep Utama

| Konsep | Penjelasan |
|---|---|
| **Satu script, banyak scene** | Script sama dipasang di tiap scene. Perilaku berbeda karena kolom yang diisi berbeda. |
| **Nama scene sebagai teks** | Perpindahan scene memakai `SceneManager.LoadScene("NamaScene")`. Nama harus sama persis dan terdaftar di Build Settings. |
| **Skor `static`** | Variabel `static int total` hidup selama aplikasi berjalan, jadi tidak hilang saat scene diganti. |
| **Prefab dibuat lewat kode** | Kotak jawaban dan tombol huruf dibuat dengan `Instantiate` dari Prefab, sesuai panjang kata. |

## 6.2 Daftar Kolom Inspector

### Pengaturan Halaman Menu

| Kolom | Tipe | Fungsi | Dipakai di scene |
|---|---|---|---|
| `Halaman_Menu` | string | Nama scene menu (tujuan `KeMenu`) | Menu, Tentang, Hasil |
| `Halaman_Permainan` | string | Nama scene soal pertama (tujuan `MulaiPermainan`) | Menu |
| `Halaman_Hasil` | string | Nama scene hasil (tujuan cadangan setelah soal terakhir) | SusunKata1/2 |

Nilai bawaan: `Menu`, `SusunKata1`, `Hasil`.

### Pengaturan Halaman Susun Kata

| Kolom | Tipe | Fungsi |
|---|---|---|
| `Grup Tempat Jawaban` | GameObject | Induk tempat kotak jawaban dibuat |
| `Grup Button Jawaban` | GameObject | Induk tempat tombol huruf dibuat |
| `Prefabs Tempat Jawaban` | GameObject | Prefab kotak jawaban (harus punya Button dan teks anak) |
| `Prefabs Button Jawaban` | GameObject | Prefab tombol huruf (harus punya Button dan teks anak) |
| `Kata` | string | Kata soal (otomatis dikapitalkan) |
| `Bobot` | int | Poin bila jawaban benar |
| `Halaman Selanjutnya` | string | Nama scene setelah jawaban benar |
| `Suara Benar` | AudioClip | Efek suara jawaban benar |
| `Suara Salah` | AudioClip | Efek suara jawaban salah |
| `Suara` | AudioSource | Pemutar suara (pakai AudioSource di objek yang sama) |

### Untuk Keperluan Debugging

| Kolom | Fungsi |
|---|---|
| `Nilai` | Menampilkan skor saat ini di Inspector selagi game berjalan. Diisi otomatis, **jangan diedit**. |

### Pengaturan Halaman Hasil

| Kolom | Tipe | Fungsi |
|---|---|---|
| `Bintang` | GameObject[] | Tiga objek bintang (urutan 1, 2, 3) |
| `Text_score` | Text (Legacy) | Teks tempat skor ditampilkan |
| `Batas_bintang_1` | int | Skor minimum untuk 1 bintang |
| `Batas_bintang_2` | int | Skor minimum untuk 2 bintang |
| `Batas_bintang_3` | int | Skor minimum untuk 3 bintang |

## 6.3 Pengisian Kolom per Scene (Ringkasan)

| Kolom | Menu | Tentang | SusunKata1 | SusunKata2 | Hasil |
|---|:-:|:-:|:-:|:-:|:-:|
| Halaman_Menu | ✔ | ✔ | - | - | ✔ |
| Halaman_Permainan | ✔ | - | - | - | - |
| Halaman_Hasil | ✔ | - | bawaan | bawaan | - |
| Grup & Prefab | - | - | ✔ | ✔ | - |
| Kata, Bobot | - | - | ✔ | ✔ | - |
| Halaman Selanjutnya | - | - | `SusunKata2` | `Hasil` | - |
| Suara Benar/Salah/Suara | - | - | ✔ | ✔ | - |
| Bintang, Text_score, Batas | - | - | - | - | ✔ |

## 6.4 Penjelasan Kode Bagian demi Bagian

### a. Pustaka (using)

```csharp
using UnityEngine.SceneManagement;  // pindah scene
using UnityEngine.UI;               // Button dan Text biasa
using TMPro;                        // TextMeshPro
using System.Collections.Generic;   // List
```

### b. Variabel penting

```csharp
static int total;                                   // skor, terbawa antar scene
List<GameObject> slot = new List<GameObject>();     // kotak jawaban
List<Button> isiSlot = new List<Button>();          // tombol huruf yang mengisi tiap kotak
bool aktif;                                         // boleh diketuk atau tidak
```

`isiSlot[i] == null` berarti kotak ke-`i` kosong. Daftar ini menjadi dasar semua logika pengisian.

### c. `Start()` — menentukan peran scene

```csharp
void Start()
{
    nilai = total;
    if (!string.IsNullOrEmpty(kata) && grupTempatJawaban != null && grupButtonJawaban != null)
        BangunSoal();
    if (bintang != null && bintang.Length > 0)
        TampilkanHasil();
}
```

- Jika `Kata` dan kedua grup terisi, scene dianggap **scene soal**.
- Jika `Bintang` berisi objek, scene dianggap **scene hasil**.
- Selain itu (Menu, Tentang), tidak ada yang dijalankan otomatis.

### d. Fungsi navigasi

| Fungsi | Dipanggil dari | Tugas |
|---|---|---|
| `MulaiPermainan()` | Tombol Mulai | `total = 0`, lalu muat `Halaman_Permainan` |
| `KeMenu()` | Tombol Kembali/Menu | Muat `Halaman_Menu` |
| `PindahScene(string)` | Tombol Tentang | Muat scene dari parameter |
| `Keluar()` | Tombol Keluar | `Application.Quit()` (hanya di hasil build) |

Fungsi `public` inilah yang muncul di daftar pilihan **On Click ()**.

### e. `BangunSoal()` — membuat kotak dan huruf

Langkah di dalamnya:

1. `kata = kata.ToUpper()`: menyamakan huruf besar.
2. Loop sebanyak panjang kata: `Instantiate(prefabsTempatJawaban, ...)` membuat kotak, lalu dimasukkan ke `slot` dan `isiSlot` (diisi `null`).
3. `Acak(huruf)` mengacak array huruf. Loop `do..while` mengulang acak bila hasilnya sama dengan kata asli.
4. Loop untuk setiap huruf: `Instantiate(prefabsButtonJawaban, ...)` membuat tombol huruf, teksnya diisi huruf, dan `onClick` dihubungkan ke `PilihHuruf`.

Catatan penting soal `int idx = i;`: lambda `() => KosongkanSlot(idx)` menyimpan variabel, bukan nilainya. Tanpa salinan lokal `idx`, semua kotak akan memakai nilai `i` terakhir. Salinan ini memastikan tiap kotak memanggil indeksnya sendiri.

### f. `PilihHuruf(Button b)` — mengisi kotak

```csharp
int idx = isiSlot.IndexOf(null);   // kotak kosong pertama dari kiri
isiSlot[idx] = b;
b.interactable = false;            // tombol huruf menjadi tidak aktif
SetText(slot[idx], GetText(b.gameObject));
if (!isiSlot.Contains(null)) Periksa();   // semua terisi, cek jawaban
```

### g. `KosongkanSlot(int idx)` — mengembalikan huruf

Bila kotak `idx` terisi: tombol hurufnya diaktifkan lagi (`interactable = true`), `isiSlot[idx] = null`, teks kotak dikosongkan.

### h. `Periksa()` — memeriksa jawaban

1. `aktif = false` agar pemain tidak bisa mengetuk selama jeda.
2. Gabungkan huruf pada `isiSlot` menjadi string `jawaban`.
3. **Benar:** `total += bobot`, mainkan `suaraBenar`, `Invoke(nameof(Lanjut), 1f)`.
4. **Salah:** mainkan `suaraSalah`, `Invoke(nameof(UlangiSoal), 0.7f)`.

`Invoke` menjalankan fungsi setelah jeda detik, memberi waktu suara dan umpan balik.

### i. `UlangiSoal()` dan `Lanjut()`

- `UlangiSoal()` mengosongkan semua kotak, mengaktifkan lagi semua tombol huruf, lalu `aktif = true`.
- `Lanjut()` memuat `halamanSelanjutnya`; jika kosong, memuat `Halaman_Hasil`.

### j. `TampilkanHasil()` — bintang

```csharp
int jumlah = 0;
if (total >= batas_bintang_1) jumlah = 1;
if (total >= batas_bintang_2) jumlah = 2;
if (total >= batas_bintang_3) jumlah = 3;
for (int i = 0; i < bintang.Length; i++)
    bintang[i].SetActive(i < jumlah);
```

`if` berurutan: nilai terakhir yang terpenuhi menjadi jumlah bintang. Loop menyalakan bintang ke-0 sampai ke-`jumlah-1`.

### k. Fungsi bantu

| Fungsi | Tugas |
|---|---|
| `Acak(char[])` | Mengacak urutan huruf (algoritma Fisher-Yates) |
| `Mainkan(AudioClip)` | Memutar suara bila `AudioSource` dan klip tersedia |
| `SetText`, `GetText` | Mengisi/membaca teks anak prefab; mendukung TextMeshPro dan Text biasa |

## 6.5 Alur Eksekusi Lengkap

```
Menu
 └─ klik MULAI → MulaiPermainan(): total = 0 → muat SusunKata1
SusunKata1
 └─ Start() → BangunSoal() → pemain mengisi kotak
     ├─ Salah → UlangiSoal() (0,7 detik)
     └─ Benar → total += bobot → Lanjut() (1 detik) → muat SusunKata2
SusunKata2
 └─ (sama) → Lanjut() → muat Hasil
Hasil
 └─ Start() → TampilkanHasil() → skor dan bintang
     └─ klik MENU → KeMenu() → muat Menu
```

## 6.6 Cara Menambah Fitur

| Fitur | Petunjuk singkat |
|---|---|
| Soal baru | Duplikat scene soal, ubah `Kata`, `Bobot`, `Halaman Selanjutnya` |
| Soal acak dari daftar | Ganti `string kata` dengan `string[] daftarKata`, pilih dengan `Random.Range` |
| Timer | Tambah variabel `float sisaWaktu` dan kurangi di `Update()` |
| Tombol Acak Ulang | Tambah fungsi `public void AcakUlang()` yang mengacak teks tombol huruf |
| High score | `PlayerPrefs.SetInt("HighScore", total)` di `TampilkanHasil()` |

## 6.7 Pertanyaan Diskusi
1. Mengapa `total` dibuat `static`? Apa yang terjadi bila tidak?
2. Apa fungsi `int idx = i;` di dalam loop pembuatan kotak?
3. Mengapa `aktif` diset `false` saat `Periksa()`?
4. Apa yang terjadi bila `Halaman Selanjutnya` salah ketik?

Lanjut ke: [07-uji-dan-build.md](07-uji-dan-build.md)
