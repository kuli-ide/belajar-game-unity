/* Pelajaran proyek "Game Susun Kata".
   Ditambahkan ke array LESSONS yang dibuat di lessons.js (berkas ini harus dimuat sesudahnya).
   Properti `group` dipakai app.js untuk membuat judul kelompok di peta belajar dan daftar pelajaran.
   Jenis block tambahan: wordgame (demo game), inspector (panel Inspector GameManager), scenemap (peta scene). */
LESSONS.push(
  // ===================== 1. Persiapan =====================
  {
    id: 'sk-persiapan',
    group: 'Proyek: Game Susun Kata',
    title: 'Susun Kata: menyiapkan project, scene, dan prefab',
    summary: 'Membuat project, lima scene, dan dua prefab yang dipakai ulang di seluruh game.',
    minutes: 15,
    xp: 120,
    blocks: [
      { type: 'p', text: 'Di proyek ini kamu membuat game **Susun Kata**: huruf diacak, pemain mengetuk huruf untuk menyusun kata yang benar. Game terdiri dari **lima scene** dan **satu script** `GameManager` yang dipakai di semuanya. Klik tiap scene di bawah untuk melihat isinya.' },
      { type: 'scenemap', current: 'Menu' },
      { type: 'h', text: 'Menyiapkan project' },
      { type: 'steps', items: [
        'Buat project baru dengan template **2D**, beri nama `GameSusunKata`. Versi yang disarankan: Unity 2021.3 LTS atau lebih baru.',
        'Buat folder `Scenes`, `Scripts`, `Prefabs`, dan `Audio` di dalam `Assets`.',
        'Saat Unity meminta, klik **Import TMP Essentials** agar TextMeshPro bisa dipakai.',
        'Buat lima scene dan simpan di `Assets/Scenes`: `Menu`, `Tentang`, `SusunKata1`, `SusunKata2`, `Hasil`.',
        'Buka **File > Build Settings**. Buka tiap scene lalu klik **Add Open Scenes**.'
      ] },
      { type: 'note', kind: 'warn', title: 'Nama scene harus persis', text: 'Game berpindah scene dengan **nama berupa teks**. `Hasil` dan `hasil` dianggap berbeda. Scene yang belum masuk Build Settings menghasilkan error `Scene couldn\'t be loaded`.' },
      { type: 'h', text: 'Pola dasar setiap scene' },
      { type: 'tree', text: 'Main Camera\nCanvas\n└── (isi UI scene)\nEventSystem\nGameManager      <- objek kosong + script GameManager' },
      { type: 'p', text: 'Atur **Canvas Scaler** menjadi `Scale With Screen Size`, resolusi referensi `1080 x 1920` (portrait) atau `1920 x 1080` (landscape), Match `0.5`. Untuk menyalin pola ini ke scene lain, pilih `Canvas`, `EventSystem`, dan `GameManager`, tekan Ctrl+C, lalu Ctrl+V di scene baru.' },
      { type: 'h', text: 'Dua prefab' },
      { type: 'p', text: 'Kotak jawaban dan tombol huruf dibuat oleh script sesuai panjang kata, jadi keduanya disimpan sebagai **Prefab**. Buat dari **UI > Button - TextMeshPro**, lalu seret ke folder `Prefabs` dan hapus dari Hierarchy.' },
      { type: 'table',
        head: ['Prefab', 'Ukuran', 'Image', 'Teks anak'],
        rows: [
          ['`TempatJawaban`', '100 x 100', 'Abu-abu muda `#D9D9D9`', 'Kosong, Font Size 60, rata tengah, hitam'],
          ['`ButtonJawaban`', '100 x 100', 'Biru `#2F6FED`', '"A", Font Size 60, Bold, rata tengah, putih']
        ] },
      { type: 'note', kind: 'tip', title: 'Kotak jawaban harus Button', text: '`TempatJawaban` memakai komponen **Button** supaya pemain bisa mengetuk kotak untuk mengembalikan huruf. Kalau dibuat dari Image biasa, fitur itu tidak jalan.' },
      { type: 'h', text: 'Layout Group untuk dua grup huruf' },
      { type: 'table',
        head: ['Pengaturan Horizontal Layout Group', 'Nilai'],
        rows: [
          ['Spacing', '15'],
          ['Child Alignment', 'Middle Center'],
          ['Control Child Size (Width, Height)', 'Tidak dicentang'],
          ['Child Force Expand (Width, Height)', 'Tidak dicentang']
        ] },
      { type: 'p', text: 'Pada lebar 1080 piksel dengan kotak 100 piksel, muat sekitar 8 sampai 9 huruf per baris. Untuk kata yang lebih panjang, kecilkan kotak jadi 80 atau pakai **Grid Layout Group**.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Mengapa scene harus dimasukkan ke Build Settings?',
          options: ['Agar scene tampil lebih cepat', '`SceneManager.LoadScene` hanya bisa memuat scene yang terdaftar di sana', 'Agar nama scene otomatis benar', 'Supaya scene bisa diduplikasi'],
          answer: 1,
          explain: 'Scene yang tidak ada di Build Settings tidak ikut dikemas, sehingga LoadScene gagal dengan error.' },
        { q: 'Kenapa kotak jawaban dan tombol huruf dibuat sebagai Prefab?',
          options: ['Karena jumlahnya tergantung panjang kata dan dibuat lewat kode', 'Agar ukurannya selalu 100 x 100', 'Karena Canvas tidak bisa punya anak', 'Supaya tidak perlu EventSystem'],
          answer: 0,
          explain: 'Script memanggil `Instantiate` dari prefab sebanyak jumlah huruf. Kata berbeda berarti jumlah kotak berbeda.' },
        { q: 'Apa yang terjadi jika `TempatJawaban` dibuat dari Image tanpa komponen Button?',
          options: ['Game tidak bisa di-build', 'Huruf tidak bisa dipilih sama sekali', 'Pemain tidak bisa mengetuk kotak untuk mengembalikan huruf', 'Kotak jadi lebih besar'],
          answer: 2,
          explain: 'Script memasang `onClick` pada Button kotak. Tanpa Button, tidak ada yang menerima ketukan.' }
      ] }
    ]
  },

  // ===================== 2. GameManager =====================
  {
    id: 'sk-gamemanager',
    group: 'Proyek: Game Susun Kata',
    title: 'Susun Kata: GameManager untuk semua scene',
    summary: 'Satu script yang dipakai di lima scene. Peran tiap scene ditentukan oleh kolom Inspector yang diisi.',
    minutes: 25,
    xp: 180,
    blocks: [
      { type: 'p', text: 'Alih-alih satu script per scene, proyek ini memakai **satu script** `GameManager`. Scene Menu mengisi kolom menu, scene soal mengisi kolom Susun Kata, dan scene Hasil mengisi kolom bintang. Script menentukan perannya dari kolom mana yang terisi.' },
      { type: 'table',
        head: ['Konsep', 'Penjelasan'],
        rows: [
          ['Satu script, banyak scene', 'Script yang sama dipasang di tiap scene. Perilaku berbeda karena kolom Inspector yang diisi berbeda.'],
          ['Nama scene sebagai teks', '`SceneManager.LoadScene("NamaScene")`. Nama harus persis dan terdaftar di Build Settings.'],
          ['Skor `static`', '`static int total` hidup selama aplikasi berjalan, jadi skor tidak hilang saat scene diganti.'],
          ['Prefab lewat kode', '`Instantiate` membuat kotak dan tombol huruf sesuai panjang kata.']
        ] },
      { type: 'h', text: 'Kolom di Inspector' },
      { type: 'p', text: 'Inilah tampilan GameManager di scene soal pertama. **Klik tiap kolom** untuk melihat fungsinya, lalu coba centang filter di bawah panel.' },
      { type: 'inspector', scene: 'SusunKata1 (contoh)', fill: {
        'Grup Tempat Jawaban': 'GrupTempatJawaban',
        'Grup Button Jawaban': 'GrupButtonJawaban',
        'Prefabs Tempat Jawaban': 'TempatJawaban',
        'Prefabs Button Jawaban': 'ButtonJawaban',
        'Kata': 'UNITY',
        'Bobot': '10',
        'Halaman Selanjutnya': 'SusunKata2',
        'Suara Benar': 'benar',
        'Suara Salah': 'salah',
        'Suara': 'GameManager (Audio Source)'
      } },
      { type: 'h', text: 'Kode lengkap' },
      { type: 'p', text: 'Salin ke `Assets/Scripts/GameManager.cs`. Berkas yang sama ada di folder `modul-susun-kata/Scripts` pada repositori ini.' },
      { type: 'code', file: 'GameManager.cs', code: "using System.Collections.Generic;\nusing UnityEngine;\nusing UnityEngine.SceneManagement;\nusing UnityEngine.UI;\nusing TMPro;\n\n/// <summary>\n/// GameManager untuk game Susun Kata.\n/// Satu script dipakai di semua scene (Menu, Tentang, SusunKata1, SusunKata2, Hasil).\n/// Bagian yang aktif bergantung pada kolom Inspector yang diisi.\n/// </summary>\npublic class GameManager : MonoBehaviour\n{\n    [Header(\"Pengaturan Halaman Menu\")]\n    public string Halaman_Menu = \"Menu\";\n    public string Halaman_Permainan = \"SusunKata1\";\n    public string Halaman_Hasil = \"Hasil\";\n\n    [Header(\"Pengaturan Halaman Susun Kata\")]\n    public GameObject grupTempatJawaban;\n    public GameObject grupButtonJawaban;\n    public GameObject prefabsTempatJawaban;\n    public GameObject prefabsButtonJawaban;\n    public string kata;\n    public int bobot;\n    public string halamanSelanjutnya;\n    public AudioClip suaraBenar;\n    public AudioClip suaraSalah;\n    public AudioSource suara;\n\n    [Header(\"Untuk Keperluan Debugging, Tidak Perlu Diisi !\")]\n    public int nilai;\n\n    [Header(\"Pengaturan Halaman Hasil\")]\n    public GameObject[] bintang;\n    public Text text_score;\n    public int batas_bintang_1;\n    public int batas_bintang_2;\n    public int batas_bintang_3;\n\n    // Skor total, dibuat static agar tetap terbawa saat pindah scene.\n    static int total;\n\n    List<GameObject> slot = new List<GameObject>();   // kotak jawaban\n    List<Button> isiSlot = new List<Button>();        // tombol huruf yang mengisi tiap kotak (null = kosong)\n    bool aktif;                                       // true saat pemain boleh mengetuk\n\n    void Start()\n    {\n        nilai = total;\n\n        // Scene soal: kolom Kata dan grup terisi\n        if (!string.IsNullOrEmpty(kata) && grupTempatJawaban != null && grupButtonJawaban != null)\n            BangunSoal();\n\n        // Scene hasil: kolom Bintang terisi\n        if (bintang != null && bintang.Length > 0)\n            TampilkanHasil();\n    }\n\n    // ---------- NAVIGASI (dipanggil dari tombol) ----------\n\n    public void MulaiPermainan()\n    {\n        total = 0;\n        SceneManager.LoadScene(Halaman_Permainan);\n    }\n\n    public void KeMenu()\n    {\n        SceneManager.LoadScene(Halaman_Menu);\n    }\n\n    // Tombol serbaguna: nama scene diketik pada parameter di Inspector\n    public void PindahScene(string namaScene)\n    {\n        SceneManager.LoadScene(namaScene);\n    }\n\n    public void Keluar()\n    {\n        Application.Quit();\n    }\n\n    // ---------- HALAMAN HASIL ----------\n\n    void TampilkanHasil()\n    {\n        if (text_score != null) text_score.text = total.ToString();\n\n        int jumlah = 0;\n        if (total >= batas_bintang_1) jumlah = 1;\n        if (total >= batas_bintang_2) jumlah = 2;\n        if (total >= batas_bintang_3) jumlah = 3;\n\n        for (int i = 0; i < bintang.Length; i++)\n            bintang[i].SetActive(i < jumlah);\n    }\n\n    // ---------- HALAMAN SUSUN KATA ----------\n\n    void BangunSoal()\n    {\n        kata = kata.ToUpper();\n\n        // 1. Buat kotak jawaban (satu per huruf)\n        for (int i = 0; i < kata.Length; i++)\n        {\n            GameObject s = Instantiate(prefabsTempatJawaban, grupTempatJawaban.transform);\n            SetText(s, \"\");\n\n            int idx = i;   // salinan lokal untuk dipakai di listener\n            Button sb = s.GetComponent<Button>();\n            if (sb != null) sb.onClick.AddListener(() => KosongkanSlot(idx));\n\n            slot.Add(s);\n            isiSlot.Add(null);\n        }\n\n        // 2. Acak huruf (pastikan hasil acak tidak sama dengan kata asli)\n        char[] huruf = kata.ToCharArray();\n        do { Acak(huruf); } while (huruf.Length > 1 && new string(huruf) == kata);\n\n        // 3. Buat tombol huruf\n        foreach (char c in huruf)\n        {\n            GameObject h = Instantiate(prefabsButtonJawaban, grupButtonJawaban.transform);\n            SetText(h, c.ToString());\n\n            Button b = h.GetComponent<Button>();\n            b.onClick.AddListener(() => PilihHuruf(b));\n        }\n\n        aktif = true;\n    }\n\n    void PilihHuruf(Button b)\n    {\n        if (!aktif) return;\n\n        int idx = isiSlot.IndexOf(null);   // kotak kosong pertama dari kiri\n        if (idx < 0) return;\n\n        isiSlot[idx] = b;\n        b.interactable = false;\n        SetText(slot[idx], GetText(b.gameObject));\n\n        if (!isiSlot.Contains(null)) Periksa();\n    }\n\n    void KosongkanSlot(int idx)\n    {\n        if (!aktif || isiSlot[idx] == null) return;\n\n        isiSlot[idx].interactable = true;\n        isiSlot[idx] = null;\n        SetText(slot[idx], \"\");\n    }\n\n    void Periksa()\n    {\n        aktif = false;\n\n        string jawaban = \"\";\n        foreach (Button b in isiSlot) jawaban += GetText(b.gameObject);\n\n        if (jawaban == kata)\n        {\n            total += bobot;\n            nilai = total;\n            Mainkan(suaraBenar);\n            Invoke(nameof(Lanjut), 1f);\n        }\n        else\n        {\n            Mainkan(suaraSalah);\n            Invoke(nameof(UlangiSoal), 0.7f);\n        }\n    }\n\n    void UlangiSoal()\n    {\n        for (int i = 0; i < isiSlot.Count; i++)\n        {\n            if (isiSlot[i] != null) isiSlot[i].interactable = true;\n            isiSlot[i] = null;\n            SetText(slot[i], \"\");\n        }\n        aktif = true;\n    }\n\n    void Lanjut()\n    {\n        string tujuan = string.IsNullOrEmpty(halamanSelanjutnya) ? Halaman_Hasil : halamanSelanjutnya;\n        SceneManager.LoadScene(tujuan);\n    }\n\n    // ---------- UTILITAS ----------\n\n    // Fisher-Yates shuffle\n    void Acak(char[] arr)\n    {\n        for (int i = arr.Length - 1; i > 0; i--)\n        {\n            int j = Random.Range(0, i + 1);\n            (arr[i], arr[j]) = (arr[j], arr[i]);\n        }\n    }\n\n    void Mainkan(AudioClip clip)\n    {\n        if (suara != null && clip != null) suara.PlayOneShot(clip);\n    }\n\n    // Mendukung TextMeshPro maupun Text biasa pada prefab\n    void SetText(GameObject go, string isi)\n    {\n        TMP_Text tmp = go.GetComponentInChildren<TMP_Text>();\n        if (tmp != null) { tmp.text = isi; return; }\n\n        Text t = go.GetComponentInChildren<Text>();\n        if (t != null) t.text = isi;\n    }\n\n    string GetText(GameObject go)\n    {\n        TMP_Text tmp = go.GetComponentInChildren<TMP_Text>();\n        if (tmp != null) return tmp.text;\n\n        Text t = go.GetComponentInChildren<Text>();\n        return t != null ? t.text : \"\";\n    }\n}\n" },
      { type: 'note', kind: 'warn', title: 'Pasang script lewat Add Component', text: 'Nama kelas harus sama dengan nama berkas (`GameManager`). Kalau Console menampilkan error merah, script tidak bisa dipasang ke objek.' },
      { type: 'h', text: 'Cara kerjanya' },
      { type: 'steps', items: [
        '**`Start()`** menentukan peran scene. Kolom `Kata` dan kedua grup terisi berarti scene soal, lalu `BangunSoal()` dipanggil. Kolom `Bintang` terisi berarti scene hasil, lalu `TampilkanHasil()` dipanggil.',
        '**`BangunSoal()`** membuat satu kotak per huruf, mengacak huruf (algoritma Fisher-Yates), lalu membuat satu tombol per huruf.',
        '**`PilihHuruf()`** mengisi kotak kosong pertama dari kiri. Daftar `isiSlot` menyimpan tombol yang mengisi tiap kotak, `null` berarti kosong.',
        '**`Periksa()`** berjalan saat semua kotak terisi. Benar: `total += bobot`, suara benar, pindah scene setelah 1 detik. Salah: suara salah, huruf kembali setelah 0,7 detik.',
        '**`Lanjut()`** memuat `halamanSelanjutnya`. Bila kosong, memuat `Halaman_Hasil`.'
      ] },
      { type: 'flow', title: 'Alur satu soal',
        items: [
          'Pemain mengetuk huruf, kotak kosong pertama terisi.',
          { decision: 'Semua kotak sudah terisi?', no: 'Tunggu ketukan berikutnya.', yes: 'Gabungkan huruf menjadi jawaban, lalu bandingkan dengan `kata`.' },
          { decision: 'Jawaban sama dengan kata?', no: 'Suara salah, huruf dikembalikan setelah 0,7 detik, ulangi.', yes: 'Tambah skor, suara benar, pindah scene setelah 1 detik.' }
        ],
        caption: 'Selama jeda, `aktif = false` agar pemain tidak bisa mengetuk.' },
      { type: 'note', kind: 'tip', title: 'Kenapa ada `int idx = i;`', text: 'Lambda `() => KosongkanSlot(idx)` menyimpan **variabel**, bukan nilainya. Tanpa salinan lokal `idx`, semua kotak akan memakai nilai `i` terakhir dan mengosongkan kotak yang salah.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Mengapa `total` dibuat `static`?',
          options: ['Agar bisa diedit di Inspector', 'Agar nilainya tetap ada saat scene berganti', 'Agar script berjalan lebih cepat', 'Agar skor muncul di Console'],
          answer: 1,
          explain: 'Objek GameManager dihancurkan saat scene diganti. Variabel `static` milik kelas, bukan objek, jadi nilainya bertahan.' },
        { q: 'Bagaimana script mengetahui bahwa sebuah scene adalah scene hasil?',
          options: ['Dari nama scene', 'Dari kolom `Bintang` yang berisi objek', 'Dari urutan di Build Settings', 'Dari nilai `Bobot`'],
          answer: 1,
          explain: '`Start()` memanggil `TampilkanHasil()` bila `bintang` tidak kosong.' },
        { q: 'Apa yang dilakukan `Lanjut()` bila `Halaman Selanjutnya` kosong?',
          options: ['Game berhenti', 'Memuat scene yang tertulis di `Halaman_Hasil`', 'Kembali ke Menu', 'Mengulang soal yang sama'],
          answer: 1,
          explain: 'Ekspresi `string.IsNullOrEmpty(halamanSelanjutnya) ? Halaman_Hasil : halamanSelanjutnya` memakai Halaman_Hasil sebagai cadangan.' },
        { q: 'Apa fungsi `aktif = false` di awal `Periksa()`?',
          options: ['Mematikan suara', 'Mencegah pemain mengetuk selama jeda umpan balik', 'Menghapus semua huruf', 'Menghentikan timer'],
          answer: 1,
          explain: 'Tanpa itu pemain bisa mengetuk huruf saat game sedang menunggu pindah scene atau mengulang soal.' }
      ] }
    ]
  },

  // ===================== 3. Scene Menu =====================
  {
    id: 'sk-menu',
    group: 'Proyek: Game Susun Kata',
    title: 'Scene Menu: tombol mulai, tentang, keluar',
    summary: 'Membuat halaman awal dan menghubungkan tombol ke fungsi GameManager lewat On Click.',
    minutes: 12,
    xp: 100,
    blocks: [
      { type: 'p', text: 'Menu adalah scene pertama di Build Settings. Pemain bisa memulai permainan, membuka Tentang, atau keluar.' },
      { type: 'scenemap', current: 'Menu' },
      { type: 'h', text: 'Susun Hierarchy' },
      { type: 'tree', text: 'Canvas\n├── Background    (UI > Image)\n├── Judul         (UI > Text - TextMeshPro)\n├── BtnMulai      (UI > Button - TextMeshPro)\n├── BtnTentang    (UI > Button - TextMeshPro)\n└── BtnKeluar     (UI > Button - TextMeshPro)\nEventSystem\nGameManager       (Create Empty + script GameManager)' },
      { type: 'table',
        head: ['Objek', 'Pengaturan'],
        rows: [
          ['`Background`', 'Anchor stretch penuh (Alt+Shift klik preset kanan bawah)'],
          ['`Judul`', 'Teks "GAME SUSUN KATA", Font Size 90, Bold, rata tengah, di atas'],
          ['`BtnMulai`', '500 x 140, teks "MULAI", di tengah'],
          ['`BtnTentang`', '500 x 140, teks "TENTANG", 180 piksel di bawah BtnMulai'],
          ['`BtnKeluar`', '500 x 140, teks "KELUAR", 180 piksel di bawah BtnTentang']
        ] },
      { type: 'h', text: 'Isi kolom GameManager' },
      { type: 'inspector', scene: 'Menu', fill: {
        'Halaman_Menu': 'Menu',
        'Halaman_Permainan': 'SusunKata1',
        'Halaman_Hasil': 'Hasil'
      } },
      { type: 'note', kind: 'tip', title: 'Nilai bawaan sudah benar', text: 'Ketiga kolom ini berisi **teks nama scene**, bukan objek. Nilai bawaan script sudah `Menu`, `SusunKata1`, dan `Hasil`. Cukup periksa bahwa ejaannya sama dengan nama scene kamu.' },
      { type: 'h', text: 'Hubungkan tombol (On Click)' },
      { type: 'steps', items: [
        'Pilih tombol, cari **On Click ()** pada komponen **Button**, lalu klik **+**.',
        'Seret objek `GameManager` dari Hierarchy ke kolom objek.',
        'Pilih fungsinya dari daftar, sesuai tabel di bawah.'
      ] },
      { type: 'table',
        head: ['Tombol', 'Fungsi yang dipilih', 'Parameter'],
        rows: [
          ['`BtnMulai`', '`GameManager > MulaiPermainan`', '-'],
          ['`BtnTentang`', '`GameManager > PindahScene (string)`', 'ketik `Tentang`'],
          ['`BtnKeluar`', '`GameManager > Keluar`', '-']
        ] },
      { type: 'code', file: 'GameManager.cs (bagian navigasi)', code: 'public void MulaiPermainan()\n{\n    total = 0;                               // skor direset\n    SceneManager.LoadScene(Halaman_Permainan);\n}\n\npublic void KeMenu()\n{\n    SceneManager.LoadScene(Halaman_Menu);\n}\n\n// Tombol serbaguna: nama scene diketik di Inspector\npublic void PindahScene(string namaScene)\n{\n    SceneManager.LoadScene(namaScene);\n}\n\npublic void Keluar()\n{\n    Application.Quit();                      // hanya bekerja di hasil build\n}' },
      { type: 'note', kind: 'warn', title: 'Keluar tidak berefek di Editor', text: '`Application.Quit()` hanya bekerja pada hasil build (Android atau PC). Di Unity Editor tombolnya terlihat tidak melakukan apa-apa, dan itu normal.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Mengapa tombol Tentang memakai `PindahScene (string)`?',
          options: ['Karena tidak ada fungsi lain', 'Agar satu fungsi bisa dipakai untuk scene apa pun, nama scene diketik di parameter tombol', 'Karena Tentang bukan scene', 'Agar skor direset'],
          answer: 1,
          explain: 'Fungsi dengan parameter string muncul di On Click dengan kolom teks, sehingga satu fungsi melayani banyak tombol.' },
        { q: 'Apa yang dilakukan `MulaiPermainan()` selain berpindah scene?',
          options: ['Mengacak huruf', 'Mengatur skor total menjadi 0', 'Memutar suara benar', 'Menghapus prefab'],
          answer: 1,
          explain: 'Skor direset di sini sehingga permainan baru selalu mulai dari 0, walau `total` bersifat static.' }
      ] }
    ]
  },

  // ===================== 4. Scene Tentang =====================
  {
    id: 'sk-tentang',
    group: 'Proyek: Game Susun Kata',
    title: 'Scene Tentang: halaman informasi',
    summary: 'Halaman teks statis dengan satu tombol kembali ke menu.',
    minutes: 8,
    xp: 80,
    blocks: [
      { type: 'p', text: 'Scene paling sederhana di proyek ini: teks informasi dan satu tombol. Cocok untuk latihan memakai fungsi `KeMenu()`.' },
      { type: 'scenemap', current: 'Tentang' },
      { type: 'tree', text: 'Canvas\n├── Background    (UI > Image)\n├── Judul         (UI > Text - TextMeshPro)\n├── IsiTentang    (UI > Text - TextMeshPro)\n└── BtnKembali    (UI > Button - TextMeshPro)\nEventSystem\nGameManager' },
      { type: 'table',
        head: ['Objek', 'Pengaturan'],
        rows: [
          ['`Background`', 'Anchor stretch penuh, warna sama dengan scene Menu'],
          ['`Judul`', 'Teks "TENTANG", Font Size 80, Bold, rata tengah'],
          ['`IsiTentang`', 'Lebar 900, tinggi 800, Font Size 44, rata kiri, Auto Size boleh aktif'],
          ['`BtnKembali`', '500 x 140, teks "KEMBALI", di bagian bawah']
        ] },
      { type: 'code', file: 'Isi teks IsiTentang', code: 'Game Susun Kata\n\nDibuat sebagai media belajar Pengembangan Gim.\nPembuat   : (isi nama)\nSekolah   : (isi nama sekolah)\nTahun     : 2026\n\nCara bermain:\n1. Ketuk huruf acak untuk mengisi kotak jawaban.\n2. Ketuk kotak jawaban untuk mengembalikan huruf.\n3. Susun semua huruf menjadi kata yang benar.' },
      { type: 'h', text: 'GameManager dan tombol' },
      { type: 'inspector', scene: 'Tentang', fill: { 'Halaman_Menu': 'Menu' } },
      { type: 'steps', items: [
        'Pilih objek `GameManager`, pastikan `Halaman_Menu` berisi `Menu`.',
        'Pada `BtnKembali`, tambahkan On Click, seret `GameManager`, lalu pilih `GameManager > KeMenu`.',
        'Uji dari scene Menu: klik **TENTANG**, lalu **KEMBALI**.'
      ] },
      { type: 'note', kind: 'warn', title: '`Halaman_Menu` wajib terisi', text: '`KeMenu()` hanya memuat scene yang tertulis di `Halaman_Menu`. Bila kolom ini kosong, Unity menampilkan error saat tombol diklik.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Kolom GameManager mana yang wajib diisi di scene Tentang?',
          options: ['`Kata`', '`Bintang`', '`Halaman_Menu`', '`Bobot`'],
          answer: 2,
          explain: 'Tombol Kembali memanggil `KeMenu()` yang memuat scene di `Halaman_Menu`.' },
        { q: 'Mengapa scene Tentang tidak perlu mengisi kolom Susun Kata?',
          options: ['Karena `Kata` kosong, script tidak membangun soal di scene ini', 'Karena Tentang tidak punya Canvas', 'Karena Unity mengisinya otomatis', 'Karena Tentang tidak ada di Build Settings'],
          answer: 0,
          explain: '`Start()` hanya memanggil `BangunSoal()` bila `Kata` dan kedua grup terisi.' }
      ] }
    ]
  },

  // ===================== 5. SusunKata1 =====================
  {
    id: 'sk-soal-1',
    group: 'Proyek: Game Susun Kata',
    title: 'Scene SusunKata1: soal pertama',
    summary: 'Halaman permainan dengan dua grup. Kotak dan huruf dibuat otomatis dari prefab.',
    minutes: 20,
    xp: 150,
    blocks: [
      { type: 'p', text: 'Ini hasil akhir yang akan kamu buat. **Mainkan dulu**: tekan Mulai, susun kata, lalu lihat bagaimana skor dan scene berubah di panel kanan. Ubah kata soal atau bobot dan perhatikan bedanya.' },
      { type: 'wordgame' },
      { type: 'h', text: 'Susun Hierarchy' },
      { type: 'tree', text: 'Canvas\n├── Background           (UI > Image)\n├── JudulSoal            (UI > Text - TextMeshPro)\n├── PetunjukText         (UI > Text - TextMeshPro)\n├── GrupTempatJawaban    (Create Empty + Horizontal Layout Group)\n└── GrupButtonJawaban    (Create Empty + Horizontal Layout Group)\nEventSystem\nGameManager              (script GameManager + Audio Source)' },
      { type: 'note', kind: 'tip', title: 'Dua grup dibiarkan kosong', text: '`GrupTempatJawaban` dan `GrupButtonJawaban` tidak punya anak di Hierarchy. Anak-anaknya dibuat otomatis oleh script saat game dimulai.' },
      { type: 'table',
        head: ['Objek', 'Pengaturan'],
        rows: [
          ['`JudulSoal`', 'Teks "Susun Kata 1", Font Size 70, di atas'],
          ['`PetunjukText`', 'Teks "Susun huruf menjadi kata yang benar", Font Size 40'],
          ['`GrupTempatJawaban`', 'Lebar 1000, tinggi 120, tengah atas (Y = 250), Horizontal Layout Group'],
          ['`GrupButtonJawaban`', 'Lebar 1000, tinggi 120, tengah bawah (Y = -150), Horizontal Layout Group sama']
        ] },
      { type: 'h', text: 'Tambahkan Audio Source' },
      { type: 'steps', items: [
        'Pilih `GameManager`, klik **Add Component > Audio Source**.',
        'Hapus centang **Play On Awake**.',
        'Biarkan kolom AudioClip pada Audio Source kosong. Klip diisi lewat kolom di script.'
      ] },
      { type: 'h', text: 'Isi kolom GameManager' },
      { type: 'inspector', scene: 'SusunKata1', fill: {
        'Grup Tempat Jawaban': 'GrupTempatJawaban',
        'Grup Button Jawaban': 'GrupButtonJawaban',
        'Prefabs Tempat Jawaban': 'TempatJawaban',
        'Prefabs Button Jawaban': 'ButtonJawaban',
        'Kata': 'UNITY',
        'Bobot': '10',
        'Halaman Selanjutnya': 'SusunKata2',
        'Suara Benar': 'benar',
        'Suara Salah': 'salah',
        'Suara': 'GameManager (Audio Source)'
      } },
      { type: 'note', kind: 'tip', title: 'Mengisi kolom Suara', text: 'Seret objek `GameManager` itu sendiri ke kolom **Suara**. Unity mengambil komponen Audio Source miliknya. Kata di kolom `Kata` boleh huruf kecil, script mengubahnya menjadi kapital.' },
      { type: 'h', text: 'Bagian script yang bekerja di scene ini' },
      { type: 'code', file: 'GameManager.cs (BangunSoal)', code: 'void BangunSoal()\n{\n    kata = kata.ToUpper();\n\n    // 1. kotak jawaban, satu per huruf\n    for (int i = 0; i < kata.Length; i++)\n    {\n        GameObject s = Instantiate(prefabsTempatJawaban, grupTempatJawaban.transform);\n        SetText(s, "");\n        int idx = i;                         // salinan lokal untuk listener\n        Button sb = s.GetComponent<Button>();\n        if (sb != null) sb.onClick.AddListener(() => KosongkanSlot(idx));\n        slot.Add(s);\n        isiSlot.Add(null);\n    }\n\n    // 2. acak huruf, pastikan tidak sama dengan kata asli\n    char[] huruf = kata.ToCharArray();\n    do { Acak(huruf); } while (huruf.Length > 1 && new string(huruf) == kata);\n\n    // 3. tombol huruf\n    foreach (char c in huruf)\n    {\n        GameObject h = Instantiate(prefabsButtonJawaban, grupButtonJawaban.transform);\n        SetText(h, c.ToString());\n        Button b = h.GetComponent<Button>();\n        b.onClick.AddListener(() => PilihHuruf(b));\n    }\n    aktif = true;\n}' },
      { type: 'h', text: 'Uji di Unity' },
      { type: 'steps', items: [
        'Tekan **Play**. Harus muncul 5 kotak kosong dan 5 tombol huruf acak.',
        'Ketuk huruf: mengisi kotak dari kiri, tombol huruf menjadi abu-abu.',
        'Ketuk kotak berisi: huruf kembali dan tombol aktif lagi.',
        'Susun **UNITY** dengan benar: suara benar, lalu pindah ke `SusunKata2` setelah 1 detik.',
        'Susun salah: suara salah, semua huruf kembali setelah 0,7 detik.'
      ] },
      { type: 'note', kind: 'tip', title: 'Uji dari scene Menu', text: 'Skor disimpan di variabel `static`. Memainkan scene soal langsung dari Editor selalu mulai dari 0, jadi untuk menguji alur lengkap mulailah dari scene Menu.' },
      { type: 'h', text: 'Masalah umum' },
      { type: 'table',
        head: ['Gejala', 'Penyebab', 'Solusi'],
        rows: [
          ['Tidak ada kotak atau huruf', '`Kata` kosong atau grup/prefab belum diisi', 'Periksa semua kolom Susun Kata'],
          ['Huruf bertumpuk', 'Layout Group belum dipasang', 'Tambahkan Horizontal Layout Group pada kedua grup'],
          ['Tidak pindah scene', '`Halaman Selanjutnya` salah ketik atau scene belum di Build Settings', 'Cek ejaan dan Build Settings'],
          ['Tidak ada suara', 'Kolom `Suara` atau klip kosong', 'Isi `Suara`, `Suara Benar`, `Suara Salah`'],
          ['Kotak tidak bisa diketuk', 'Prefab `TempatJawaban` bukan Button', 'Buat ulang dari Button - TextMeshPro'],
          ['Tombol sama sekali tidak bereaksi', 'Tidak ada EventSystem', '**GameObject > UI > Event System**']
        ] },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Mengapa script memastikan susunan acak tidak sama dengan kata asli?',
          options: ['Agar kata tidak terlalu mudah', 'Agar loop tidak berhenti', 'Karena Unity melarang urutan sama', 'Agar jumlah kotak berubah'],
          answer: 0,
          explain: 'Kalau hasil acak kebetulan sama dengan kata, soal langsung terjawab tanpa pemain berpikir. Loop `do..while` mengulang acak sampai berbeda.' },
        { q: 'Pemain mengetuk huruf. Ke kotak mana huruf itu masuk?',
          options: ['Kotak dengan nomor yang sama dengan huruf', 'Kotak kosong pertama dari kiri', 'Kotak terakhir', 'Kotak yang dipilih pemain'],
          answer: 1,
          explain: '`isiSlot.IndexOf(null)` mencari kotak kosong pertama dari kiri.' },
        { q: 'Apa yang terjadi bila kolom `Kata` di scene ini kosong?',
          options: ['Game memilih kata sendiri', 'Tidak ada kotak dan huruf yang dibuat', 'Unity menolak Play', 'Scene pindah ke Hasil'],
          answer: 1,
          explain: '`Start()` hanya memanggil `BangunSoal()` bila `Kata` tidak kosong, jadi layar soal tampil kosong.' }
      ] }
    ]
  },

  // ===================== 6. SusunKata2 =====================
  {
    id: 'sk-soal-2',
    group: 'Proyek: Game Susun Kata',
    title: 'Scene SusunKata2: menambah soal dengan duplikat scene',
    summary: 'Soal kedua dibuat dengan menduplikat scene pertama dan mengubah tiga kolom.',
    minutes: 12,
    xp: 100,
    blocks: [
      { type: 'p', text: 'Soal kedua tidak dibuat dari nol. Duplikat scene pertama, lalu ubah tiga kolom di `GameManager`.' },
      { type: 'scenemap', current: 'SusunKata2' },
      { type: 'steps', items: [
        'Di jendela Project, pilih `Assets/Scenes/SusunKata1` lalu tekan **Ctrl+D**.',
        'Ganti nama hasil duplikat menjadi `SusunKata2` lalu buka scene itu.',
        'Ubah teks `JudulSoal` menjadi "Susun Kata 2".',
        'Ubah tiga kolom GameManager sesuai tabel di bawah.',
        'Pastikan `SusunKata2` sudah ada di Build Settings (**Add Open Scenes**).'
      ] },
      { type: 'note', kind: 'tip', title: 'Sudah membuat scene kosong lebih dulu?', text: 'Hapus yang kosong dahulu, atau salin isi Hierarchy dari SusunKata1 dengan Ctrl+C lalu Ctrl+V.' },
      { type: 'table',
        head: ['Kolom', 'SusunKata1', 'SusunKata2'],
        rows: [
          ['`Kata`', '`UNITY`', '`PROGRAM`'],
          ['`Bobot`', '`10`', '`10` (boleh diubah)'],
          ['`Halaman Selanjutnya`', '`SusunKata2`', '`Hasil`']
        ] },
      { type: 'inspector', scene: 'SusunKata2', fill: {
        'Grup Tempat Jawaban': 'GrupTempatJawaban',
        'Grup Button Jawaban': 'GrupButtonJawaban',
        'Prefabs Tempat Jawaban': 'TempatJawaban',
        'Prefabs Button Jawaban': 'ButtonJawaban',
        'Kata': 'PROGRAM',
        'Bobot': '10',
        'Halaman Selanjutnya': 'Hasil',
        'Suara Benar': 'benar',
        'Suara Salah': 'salah',
        'Suara': 'GameManager (Audio Source)'
      } },
      { type: 'note', kind: 'tip', title: 'Soal terakhir mengarah ke Hasil', text: 'Isi `Halaman Selanjutnya` dengan `Hasil` agar alurnya jelas. Bila dikosongkan pun, script memakai `Halaman_Hasil` yang bawaannya juga `Hasil`.' },
      { type: 'h', text: 'Menambah soal ke-3 dan seterusnya' },
      { type: 'steps', items: [
        'Duplikat scene soal terakhir, beri nama `SusunKata3`.',
        'Ubah `Kata` dan `Bobot`.',
        'Pada scene **sebelumnya**, ubah `Halaman Selanjutnya` menjadi `SusunKata3`.',
        'Pada scene baru, isi `Halaman Selanjutnya` dengan `Hasil`.',
        'Tambahkan `SusunKata3` ke Build Settings.'
      ] },
      { type: 'flow', title: 'Rantai scene soal',
        items: [
          '`SusunKata1`: Halaman Selanjutnya = `SusunKata2`',
          '`SusunKata2`: Halaman Selanjutnya = `SusunKata3`',
          '`SusunKata3`: Halaman Selanjutnya = `Hasil`'
        ],
        caption: 'Setiap scene hanya tahu satu tujuan berikutnya.' },
      { type: 'note', kind: 'tip', title: 'Tantangan', text: 'Duplikat scene itu cepat tetapi boros kalau soalnya banyak. Bagaimana cara membuat soal bertambah tanpa menduplikat scene? Petunjuk: ganti `string kata` dengan `string[] daftarKata` dan pilih dengan `Random.Range`.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Kolom mana yang harus diubah di scene soal terakhir agar permainan berakhir di Hasil?',
          options: ['`Kata`', '`Halaman Selanjutnya` diisi `Hasil`', '`Bobot` diisi 0', '`Nilai`'],
          answer: 1,
          explain: 'Tujuan setelah jawaban benar ditentukan oleh `Halaman Selanjutnya`.' },
        { q: 'Kamu menambah `SusunKata3`. Scene mana yang juga harus diubah?',
          options: ['Menu', 'SusunKata2, `Halaman Selanjutnya` menjadi `SusunKata3`', 'Hasil', 'Tentang'],
          answer: 1,
          explain: 'Sebelumnya SusunKata2 mengarah ke Hasil. Agar soal ke-3 muncul, tujuannya diganti ke SusunKata3.' }
      ] }
    ]
  },

  // ===================== 7. Hasil =====================
  {
    id: 'sk-hasil',
    group: 'Proyek: Game Susun Kata',
    title: 'Scene Hasil: skor dan bintang',
    summary: 'Menampilkan skor total yang dibawa dari scene soal dan menyalakan 1 sampai 3 bintang.',
    minutes: 15,
    xp: 120,
    blocks: [
      { type: 'p', text: 'Scene terakhir menampilkan skor dan bintang. **Coba atur** slider `Batas_bintang_1`, `2`, dan `3` pada demo, selesaikan kedua soal, lalu lihat berapa bintang yang didapat.' },
      { type: 'wordgame' },
      { type: 'h', text: 'Susun Hierarchy' },
      { type: 'tree', text: 'Canvas\n├── Background      (UI > Image)\n├── Judul           (UI > Text - TextMeshPro)\n├── GrupBintang     (Create Empty + Horizontal Layout Group)\n│   ├── Bintang1\n│   ├── Bintang2\n│   └── Bintang3\n├── TextScore       (UI > Legacy > Text)\n└── BtnMenu         (UI > Button - TextMeshPro)\nEventSystem\nGameManager' },
      { type: 'table',
        head: ['Objek', 'Pengaturan'],
        rows: [
          ['`GrupBintang`', 'Lebar 600, tinggi 200, tengah. Spacing 30, Middle Center, Control Child Size dan Force Expand tidak dicentang'],
          ['`Bintang1/2/3`', '150 x 150, warna emas `#FFC107`'],
          ['`TextScore`', 'Legacy Text, teks "0", Font Size 80, rata tengah'],
          ['`BtnMenu`', '500 x 140, teks "MENU", di bawah']
        ] },
      { type: 'note', kind: 'warn', title: 'Karakter bintang sering jadi kotak', text: 'Karakter ★ tidak ada di font bawaan TextMeshPro sehingga tampil sebagai kotak. Cara paling aman: pakai **UI > Image** dengan PNG bintang, lalu ubah Texture Type gambar menjadi **Sprite (2D and UI)**. Kolom `Bintang` menerima GameObject apa pun.' },
      { type: 'note', kind: 'tip', title: 'Matikan ketiga bintang', text: 'Pilih `Bintang1`, `Bintang2`, `Bintang3` dan hapus centang di pojok kiri atas Inspector. Script yang menyalakannya sesuai skor.' },
      { type: 'h', text: 'Isi kolom GameManager' },
      { type: 'inspector', scene: 'Hasil', fill: {
        'Halaman_Menu': 'Menu',
        'Bintang': 'Size 3: Bintang1, Bintang2, Bintang3',
        'Text_score': 'TextScore',
        'Batas_bintang_1': '10',
        'Batas_bintang_2': '15',
        'Batas_bintang_3': '20'
      } },
      { type: 'steps', items: [
        'Pada `Bintang`, ubah **Size** menjadi 3, lalu seret `Bintang1`, `Bintang2`, `Bintang3` ke Element 0, 1, 2.',
        '`Text_score` diisi objek `TextScore` bertipe Legacy Text.',
        'Hubungkan `BtnMenu` ke `GameManager > KeMenu`.'
      ] },
      { type: 'h', text: 'Cara bintang dihitung' },
      { type: 'code', file: 'GameManager.cs (TampilkanHasil)', code: 'void TampilkanHasil()\n{\n    if (text_score != null) text_score.text = total.ToString();\n\n    int jumlah = 0;\n    if (total >= batas_bintang_1) jumlah = 1;\n    if (total >= batas_bintang_2) jumlah = 2;\n    if (total >= batas_bintang_3) jumlah = 3;\n\n    for (int i = 0; i < bintang.Length; i++)\n        bintang[i].SetActive(i < jumlah);\n}' },
      { type: 'p', text: 'Tiga `if` berurutan: syarat terakhir yang terpenuhi menentukan jumlah. Loop menyalakan bintang ke-0 sampai ke-`jumlah - 1` dan mematikan sisanya.' },
      { type: 'table',
        head: ['Skor (2 soal, bobot 10)', 'Bintang dengan batas 10/15/20'],
        rows: [
          ['0 sampai 9', '0'],
          ['10 sampai 14', '1'],
          ['15 sampai 19', '2'],
          ['20', '3']
        ] },
      { type: 'note', kind: 'warn', title: 'Batas harus menaik', text: 'Karena memakai tiga `if` berurutan, batas yang tidak menaik memberi hasil aneh. Contoh: batas 25/15/30 dan skor 20 menghasilkan **2 bintang**, karena syarat `>= 15` terpenuhi sesudah syarat 1 bintang gagal. Selalu isi `Batas_bintang_1` < `2` < `3`. Coba di demo di atas.' },
      { type: 'note', kind: 'tip', title: 'Menguji jumlah bintang lain', text: 'Game ini tidak punya jalur kalah. Untuk menguji skor rendah, ubah sementara `Bobot` di scene soal (misalnya 5) atau ubah `Batas_bintang` di scene Hasil, lalu jalankan dari Menu.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Batas bintang 10/15/20 dan skor akhir 15. Berapa bintang?',
          options: ['1', '2', '3', '0'],
          answer: 1,
          explain: '15 memenuhi `>= 10` dan `>= 15` tetapi tidak `>= 20`, jadi `jumlah` berakhir di 2.' },
        { q: 'Dari mana scene Hasil mendapat skor?',
          options: ['Dari nama scene', 'Dari variabel `static total` yang dibawa antar scene', 'Dari file di folder Audio', 'Dari Inspector scene soal'],
          answer: 1,
          explain: '`total` bersifat static sehingga tetap ada setelah scene soal dihancurkan.' },
        { q: 'Mengapa `TextScore` memakai Legacy Text?',
          options: ['Karena lebih cantik', 'Karena kolom `Text_score` bertipe `Text`, bukan TMP_Text', 'Karena TextMeshPro tidak bisa menampilkan angka', 'Karena Canvas hanya mendukung Legacy Text'],
          answer: 1,
          explain: 'Tipe kolom di script menentukan objek apa yang bisa diseret ke Inspector.' }
      ] }
    ]
  },

  // ===================== 8. Uji dan build =====================
  {
    id: 'sk-uji-build',
    group: 'Proyek: Game Susun Kata',
    title: 'Susun Kata: menguji, memperbaiki error, dan build',
    summary: 'Daftar uji lengkap, error yang paling sering muncul, build Android atau WebGL, dan unggah ke GitHub.',
    minutes: 12,
    xp: 100,
    blocks: [
      { type: 'p', text: 'Mainkan **dari scene Menu** (bukan dari scene soal) agar skor dan alur benar.' },
      { type: 'table',
        head: ['No', 'Skenario', 'Hasil yang diharapkan'],
        rows: [
          ['1', 'Klik MULAI', 'Pindah ke SusunKata1'],
          ['2', 'Lihat huruf acak', 'Tidak sama dengan susunan kata benar'],
          ['3', 'Ketuk huruf', 'Mengisi kotak dari kiri, tombol huruf abu-abu'],
          ['4', 'Ketuk kotak berisi', 'Huruf kembali, tombol aktif lagi'],
          ['5', 'Susun salah', 'Suara salah, huruf kembali setelah 0,7 detik'],
          ['6', 'Susun benar', 'Suara benar, pindah scene setelah 1 detik'],
          ['7', 'Selesai semua soal', 'Scene Hasil menampilkan skor dan bintang'],
          ['8', 'Klik MENU di Hasil', 'Kembali ke Menu'],
          ['9', 'MULAI lagi', 'Skor kembali 0'],
          ['10', 'TENTANG lalu KEMBALI', 'Pergi ke Tentang lalu kembali ke Menu']
        ] },
      { type: 'h', text: 'Error yang sering muncul' },
      { type: 'table',
        head: ['Gejala', 'Penyebab', 'Solusi'],
        rows: [
          ['`Scene \'X\' couldn\'t be loaded ...`', 'Scene belum di Build Settings atau nama salah', '**File > Build Settings**, cek ejaan dan huruf besar-kecil'],
          ['`NullReferenceException` di `BangunSoal`', 'Prefab atau grup belum diisi', 'Isi semua kolom Susun Kata'],
          ['Skor selalu 0 di Hasil', 'Scene Hasil dimainkan langsung dari Editor', 'Mulai dari scene Menu'],
          ['`TMP_Text` tidak ditemukan saat compile', 'TMP Essentials belum di-import', '**Window > TextMeshPro > Import TMP Essential Resources**'],
          ['Teks bintang tampil kotak', 'Font tidak punya karakter ★', 'Pakai UI Image sebagai bintang'],
          ['Tombol Keluar tidak berfungsi', '`Application.Quit()` hanya jalan di build', 'Uji pada hasil build']
        ] },
      { type: 'note', kind: 'tip', title: 'Baca pesan error dari atas', text: 'Pelajaran **Membaca error di Console** menjelaskan cara memahami pesan merah di Console. Mulai dari baris pertama dan nama berkas beserta nomor barisnya.' },
      { type: 'h', text: 'Build Android' },
      { type: 'steps', items: [
        '**File > Build Settings**, pilih **Android**, klik **Switch Platform**.',
        'Pastikan modul **Android Build Support** terpasang di Unity Hub.',
        'Di **Player Settings**, isi Company Name dan Product Name, lalu atur *Default Orientation* ke Portrait.',
        'Aktifkan **USB Debugging** di HP lalu klik **Build And Run**, atau **Build** untuk menghasilkan berkas `.apk`.'
      ] },
      { type: 'h', text: 'Build WebGL untuk GitHub Pages' },
      { type: 'steps', items: [
        '**File > Build Settings**, pilih **WebGL**, klik **Switch Platform**.',
        'Di **Player Settings > Publishing Settings > Compression Format**, pilih **Disabled**. GitHub Pages tidak mengirim header kompresi Unity.',
        'Klik **Build** dan pilih folder tujuan.',
        'Salin isi folder hasil build ke repositori situs ini, misalnya ke folder `game/susun-kata/`.',
        'Commit dan push. Game terbuka di alamat situs kamu diikuti `/game/susun-kata/`.'
      ] },
      { type: 'note', kind: 'warn', title: 'Jangan unggah folder Library', text: 'Jika mengunggah **project** Unity ke GitHub, unggah hanya `Assets`, `Packages`, `ProjectSettings`, dan `.gitignore`. Jangan unggah `Library`, `Temp`, `Obj`, `Build`, `Logs`, dan `UserSettings`. Gunakan templat `.gitignore` Unity dari GitHub.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Kenapa skor di Hasil selalu 0 saat scene Hasil dimainkan langsung?',
          options: ['Script rusak', 'Tidak ada soal yang dijawab pada sesi itu sehingga `total` masih 0', 'Bintang dimatikan', 'Build Settings salah'],
          answer: 1,
          explain: '`total` baru terisi setelah soal dijawab benar. Memulai dari Menu menjalankan alur lengkap.' },
        { q: 'Pengaturan apa yang perlu diubah agar build WebGL berjalan di GitHub Pages?',
          options: ['Compression Format menjadi Disabled', 'Orientation menjadi Portrait', 'Scale With Screen Size', 'Play On Awake dimatikan'],
          answer: 0,
          explain: 'GitHub Pages tidak mengirim header kompresi yang dibutuhkan Unity, sehingga kompresi dimatikan.' }
      ] }
    ]
  }
);
