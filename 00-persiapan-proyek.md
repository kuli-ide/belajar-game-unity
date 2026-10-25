# 0. Persiapan Proyek

Bagian ini dikerjakan **sekali** sebelum membuat scene.

## 0.1 Membuat proyek
1. Buka **Unity Hub > New project**.
2. Pilih template **2D (Built-In Render Pipeline)**.
3. Beri nama `GameSusunKata`, pilih lokasi, lalu klik **Create project**.

## 0.2 Membuat folder
Di jendela **Project**, klik kanan **Assets > Create > Folder**, buat folder berikut:

```
Assets/
├── Scenes/
├── Scripts/
├── Prefabs/
└── Audio/
```

## 0.3 Menyalin script
1. Salin `GameManager.cs` dari repositori ini ke `Assets/Scripts/`.
2. Tunggu Unity selesai compile (ada indikator berputar di pojok kanan bawah).
3. Pastikan **Console** tidak menampilkan error merah.

> Script memakai TextMeshPro. Saat pertama kali membuat objek TMP, Unity meminta import **TMP Essentials**. Klik **Import TMP Essentials**.

## 0.4 Membuat 5 scene
1. **File > New Scene > Basic (Built-in)**, lalu **Ctrl+S**.
2. Simpan di `Assets/Scenes/` dengan nama:
   `Menu`, `Tentang`, `SusunKata1`, `SusunKata2`, `Hasil`.
3. Buat kelima scene sekarang (kosong dulu). Isinya diisi pada file modul berikutnya.

## 0.5 Mendaftarkan scene ke Build Settings
1. Buka **File > Build Settings**.
2. Buka tiap scene, lalu klik **Add Open Scenes**.
3. Urutan yang disarankan: Menu (0), Tentang (1), SusunKata1 (2), SusunKata2 (3), Hasil (4).

Tanpa langkah ini, game akan error saat berpindah scene: *Scene 'X' couldn't be loaded because it has not been added to the build settings.*

## 0.6 Pola dasar setiap scene
Setiap scene memiliki struktur dasar yang sama:

```
Main Camera
Canvas
├── (isi UI scene)
EventSystem
GameManager     ← objek kosong + script GameManager
```

### Membuat Canvas
1. Klik kanan Hierarchy, **UI > Canvas**. Unity otomatis membuat `EventSystem`.
2. Pilih `Canvas`, atur komponen **Canvas Scaler**:

| Pengaturan | Nilai |
|---|---|
| UI Scale Mode | Scale With Screen Size |
| Reference Resolution | 1080 × 1920 (portrait) atau 1920 × 1080 (landscape) |
| Screen Match Mode | Match Width Or Height |
| Match | 0.5 |

3. Pada tab **Game**, pilih rasio yang sama (mis. *Full HD Portrait 1080×1920*) agar tampilan sesuai.

> **Tips:** Hierarchy tiap scene dapat disalin cepat. Di scene yang sudah jadi, pilih `Canvas`, `EventSystem`, dan `GameManager`, **Ctrl+C**, lalu **Ctrl+V** di scene baru.

### Membuat objek GameManager
1. Klik kanan Hierarchy, **Create Empty**, beri nama `GameManager`.
2. **Add Component** lalu pilih `GameManager` (script).
3. Pengisian kolom berbeda di tiap scene (lihat file masing-masing).

## 0.7 Membuat Prefab `TempatJawaban`
Prefab ini adalah kotak tempat huruf jawaban muncul.

1. Di scene mana pun: klik kanan `Canvas`, **UI > Button - TextMeshPro**. Beri nama `TempatJawaban`.
2. Pengaturan:

| Komponen | Pengaturan |
|---|---|
| Rect Transform | Width 100, Height 100 |
| Image | Warna abu-abu muda (mis. `#D9D9D9`) |
| Anak `Text (TMP)` | Teks dikosongkan, Font Size 60, Alignment tengah (horizontal dan vertikal), warna hitam |

3. Seret `TempatJawaban` dari Hierarchy ke folder `Assets/Prefabs/` sehingga menjadi Prefab.
4. Hapus objek dari Hierarchy.

> Komponen **Button** pada prefab ini penting. Dengan Button, pemain dapat mengetuk kotak untuk mengembalikan huruf.

## 0.8 Membuat Prefab `ButtonJawaban`
Prefab ini adalah tombol huruf acak.

1. Klik kanan `Canvas`, **UI > Button - TextMeshPro**. Beri nama `ButtonJawaban`.
2. Pengaturan:

| Komponen | Pengaturan |
|---|---|
| Rect Transform | Width 100, Height 100 |
| Image | Warna biru (mis. `#2F6FED`) |
| Anak `Text (TMP)` | Teks "A", Font Size 60, Bold, Alignment tengah, warna putih |

3. Seret ke `Assets/Prefabs/`, lalu hapus dari Hierarchy.

## 0.9 Menyiapkan audio (opsional namun disarankan)
Siapkan dua efek suara pendek (`.wav` atau `.mp3`) dan taruh di `Assets/Audio/`:

- `benar` (bunyi jawaban benar)
- `salah` (bunyi jawaban salah)

Sumber audio gratis yang umum dipakai untuk pembelajaran: Kenney.nl (CC0), Freesound.org (periksa lisensi tiap berkas).

## 0.10 Pengaturan Layout Group yang dipakai di scene susun kata
Dipakai pada dua grup di scene SusunKata1/2:

| Pengaturan Horizontal Layout Group | Nilai |
|---|---|
| Padding | 0 |
| Spacing | 15 |
| Child Alignment | Middle Center |
| Control Child Size (Width, Height) | **Tidak dicentang** |
| Child Force Expand (Width, Height) | **Tidak dicentang** |

**Batas panjang kata:** pada lebar 1080 px dengan kotak 100 px dan jarak 15 px, muat sekitar 8–9 huruf per baris. Untuk kata lebih panjang, perkecil ukuran kotak (mis. 80) atau gunakan **Grid Layout Group**.

## Pemeriksaan sebelum lanjut
- [ ] Proyek dan folder sudah dibuat
- [ ] `GameManager.cs` ada di `Assets/Scripts/` dan tidak error
- [ ] Lima scene sudah dibuat dan masuk Build Settings
- [ ] Prefab `TempatJawaban` dan `ButtonJawaban` ada di `Assets/Prefabs/`

Lanjut ke: [06-game-manager.md](06-game-manager.md) untuk memahami script, lalu mulai membuat scene.
