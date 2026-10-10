/* Data pelajaran.
   Cara menambah pelajaran: salin satu objek di array LESSONS, ganti id, judul, dan blocks.
   Jenis block: h, p, steps, code, note, table, tree, playground, quiz.
   Teks mendukung `kode` (backtick) dan **tebal**. */
const LESSONS = [
  {
    id: 'mengenal-unity',
    title: 'Mengenal Unity dan menyiapkan project 2D',
    summary: 'Istilah dasar yang dipakai di seluruh pelajaran, lalu membuat project pertama.',
    minutes: 10,
    xp: 100,
    blocks: [
      { type: 'p', text: 'Unity membangun game dari **Scene** yang berisi banyak **GameObject**. Setiap GameObject mendapat kemampuan dari **Component**, misalnya `SpriteRenderer` untuk gambar atau `Rigidbody2D` untuk fisika.' },
      { type: 'table',
        head: ['Istilah', 'Artinya', 'Contoh di game sekolah'],
        rows: [
          ['Scene', 'Satu layar atau level di dalam game', 'Scene_Sekolah dan Scene_Kelas'],
          ['GameObject', 'Benda apa pun yang ada di scene', 'Player, Guru Piket, Pintu'],
          ['Component', 'Kemampuan yang ditempelkan ke GameObject', 'PlayerController2D, BoxCollider2D'],
          ['Prefab', 'GameObject yang disimpan sebagai cetakan', 'Tombol pilihan jurusan'],
          ['Inspector', 'Panel untuk mengisi data sebuah component', 'Field Jump Force']
        ] },
      { type: 'h', text: 'Menyiapkan project' },
      { type: 'steps', items: [
        'Pasang **Unity Hub**, lalu pasang Unity Editor versi LTS lewat Hub.',
        'Buat project baru dengan template **2D**.',
        'Saat Unity meminta, klik **Import TMP Essentials** agar teks UI (TextMeshPro) bisa dipakai.',
        'Buka **Edit > Project Settings > Tags and Layers**. Tambahkan tag `Player` dan layer `Ground`.',
        'Simpan scene dengan nama jelas, misalnya `Scene_Sekolah`, lalu masukkan ke **File > Build Profiles > Scene List**.'
      ] },
      { type: 'note', kind: 'tip', title: 'Tips penamaan', text: 'Awali nama scene dan script dengan huruf besar tanpa spasi. Nama scene yang diketik di kode harus sama persis dengan nama filenya.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Apa fungsi sebuah Component?',
          options: ['Menyimpan gambar game', 'Memberi kemampuan pada sebuah GameObject', 'Menjalankan game di HP', 'Mengatur nama scene'],
          answer: 1,
          explain: 'Component ditempelkan ke GameObject. Rigidbody2D memberi fisika, script memberi perilaku.' },
        { q: 'Panel mana yang dipakai untuk mengisi nilai seperti Jump Force?',
          options: ['Hierarchy', 'Inspector', 'Console', 'Game view'],
          answer: 1,
          explain: 'Field yang diberi [SerializeField] atau public muncul di Inspector.' },
        { q: 'Mengapa nama scene di kode harus sama persis dengan nama file scene?',
          options: ['Agar file lebih kecil', 'Karena SceneManager.LoadScene mencari scene berdasarkan nama', 'Karena Unity menolak huruf kecil', 'Supaya game lebih cepat'],
          answer: 1,
          explain: 'Scene juga harus sudah terdaftar di Build Profiles, kalau tidak LoadScene akan gagal.' }
      ] }
    ]
  },

  {
    id: 'gerak-dan-lompat',
    title: 'Player bergerak dan melompat',
    summary: 'Rigidbody2D, input, dan deteksi tanah. Dicoba langsung di simulasi.',
    minutes: 15,
    xp: 150,
    blocks: [
      { type: 'p', text: 'Gerak platformer terdiri dari tiga hal: membaca input, mengatur kecepatan di `Rigidbody2D`, dan memeriksa apakah player sedang berdiri di tanah.' },
      { type: 'h', text: 'Coba dulu di simulasi' },
      { type: 'p', text: 'Ubah slider lalu rasakan bedanya. Namanya sama dengan field di Inspector Unity. Centang simulasi bug untuk melihat penyebab player tidak bisa lompat.' },
      { type: 'playground' },
      { type: 'h', text: 'Skripnya' },
      { type: 'code', file: 'PlayerController2D.cs', code: `using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class PlayerController2D : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 6f;
    [SerializeField] private float jumpForce = 12f;
    [SerializeField] private Transform groundCheck;   // objek kosong di kaki player
    [SerializeField] private float groundRadius = 0.15f;
    [SerializeField] private LayerMask groundLayer;

    private Rigidbody2D rb;
    private float moveInput;
    private bool isGrounded;

    void Awake() => rb = GetComponent<Rigidbody2D>();

    void Update()
    {
        moveInput = Input.GetAxisRaw("Horizontal");
        isGrounded = Physics2D.OverlapCircle(groundCheck.position, groundRadius, groundLayer);

        if (Input.GetButtonDown("Jump") && isGrounded)
            rb.linearVelocity = new Vector2(rb.linearVelocity.x, jumpForce);
    }

    void FixedUpdate()
    {
        // Unity 2022 ke bawah: pakai rb.velocity
        rb.linearVelocity = new Vector2(moveInput * moveSpeed, rb.linearVelocity.y);
    }
}` },
      { type: 'p', text: '`Input.GetButtonDown` hanya bernilai true pada **satu frame** saat tombol ditekan, jadi harus dibaca di `Update`. Fisika diatur di `FixedUpdate`.' },
      { type: 'h', text: 'Kalau player tidak bisa lompat' },
      { type: 'steps', items: [
        'Field **Ground Layer** di Inspector tidak boleh Nothing. Pilih layer `Ground`.',
        'Lantai dan platform harus ada di layer `Ground` dan punya `Collider2D`.',
        '`groundCheck` harus terisi dan diletakkan tepat di kaki player. Lingkaran hijau (gizmo) harus menyentuh lantai.',
        'Di **Project Settings > Player > Active Input Handling** pilih **Both** supaya `Input.GetButtonDown` tidak error.',
        'Pada `Rigidbody2D`: Gravity Scale bukan 0 dan Freeze Position Y tidak dicentang.'
      ] },
      { type: 'note', kind: 'tip', title: 'Coba di simulasi', text: 'Centang **Ground Layer = Nothing**, lalu tekan Spasi. Itulah gejala yang paling sering dialami pemula.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Apa yang terjadi jika field Ground Layer dibiarkan Nothing?',
          options: ['Player melompat lebih tinggi', 'isGrounded selalu false sehingga player tidak bisa lompat', 'Game tidak bisa dijalankan', 'Player jatuh menembus lantai'],
          answer: 1,
          explain: 'OverlapCircle hanya mencari collider di layer yang dipilih. Tanpa layer, tidak ada yang ditemukan.' },
        { q: 'Mengapa perintah lompat dibaca di Update, bukan FixedUpdate?',
          options: ['Update lebih lambat', 'Penekanan tombol per frame bisa terlewat jika dibaca di FixedUpdate', 'FixedUpdate tidak bisa membaca Rigidbody', 'Tidak ada alasan khusus'],
          answer: 1,
          explain: 'GetButtonDown hanya true pada satu frame. FixedUpdate tidak berjalan di setiap frame.' },
        { q: 'Gravity Scale diperbesar tanpa mengubah Jump Force. Lompatan akan...',
          options: ['Lebih tinggi', 'Lebih rendah dan jatuh lebih cepat', 'Tidak berubah', 'Hilang sama sekali'],
          answer: 1,
          explain: 'Gravitasi yang kuat menarik player turun lebih cepat, sehingga puncak lompatan lebih rendah.' }
      ] }
    ]
  },

  {
    id: 'trigger-interaksi',
    title: 'Area interaksi dengan trigger',
    summary: 'Membuat NPC dan pintu yang bisa diajak berinteraksi dengan tombol E.',
    minutes: 12,
    xp: 120,
    blocks: [
      { type: 'p', text: 'Collider yang diberi **Is Trigger** tidak menahan benda. Ia hanya mengirim kabar saat sesuatu masuk atau keluar. Kabar itu ditangkap oleh `OnTriggerEnter2D` dan `OnTriggerExit2D`.' },
      { type: 'h', text: 'Syarat agar trigger bekerja' },
      { type: 'table',
        head: ['Objek', 'Yang harus ada'],
        rows: [
          ['NPC atau pintu', 'Collider2D dengan Is Trigger dicentang'],
          ['Player', 'Rigidbody2D, Collider2D, dan tag Player pada objek yang memegang collider'],
          ['Script', 'Method bernama persis OnTriggerEnter2D (huruf besar dan kecil berpengaruh)']
        ] },
      { type: 'h', text: 'Kelas dasar untuk semua yang bisa diajak interaksi' },
      { type: 'code', file: 'Interactable.cs', code: `using UnityEngine;

public abstract class Interactable : MonoBehaviour
{
    [SerializeField] protected KeyCode interactKey = KeyCode.E;
    [SerializeField] protected GameObject promptUI;   // teks "Tekan E"

    protected bool playerInRange;

    protected virtual void Update()
    {
        if (playerInRange && Input.GetKeyDown(interactKey))
            Interact();
    }

    protected abstract void Interact();

    void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Player")) return;
        playerInRange = true;
        if (promptUI != null) promptUI.SetActive(true);
    }

    void OnTriggerExit2D(Collider2D other)
    {
        if (!other.CompareTag("Player")) return;
        playerInRange = false;
        if (promptUI != null) promptUI.SetActive(false);
    }
}` },
      { type: 'p', text: 'NPC dan pintu cukup mewarisi `Interactable` lalu mengisi `Interact()`. Urusan jarak dan tombol E sudah beres di kelas dasar. Lihat simulasi di pelajaran sebelumnya: tekan E di dekat Guru Piket atau pintu.' },
      { type: 'note', kind: 'tip', title: 'Mencari penyebab trigger tidak jalan', text: 'Tambahkan `Debug.Log(other.name)` di `OnTriggerEnter2D`. Kalau log tidak pernah muncul, periksa tiga hal: Is Trigger, Rigidbody2D pada Player, dan tag Player.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Mana yang BUKAN syarat agar trigger bekerja?',
          options: ['Collider2D dengan Is Trigger dicentang', 'Salah satu objek punya Rigidbody2D', 'Player bertag Player (untuk script ini)', 'Sprite NPC harus berwarna putih'],
          answer: 3,
          explain: 'Warna sprite tidak ada hubungannya dengan deteksi collision.' },
        { q: 'Mengapa memakai kelas abstrak Interactable?',
          options: ['Agar game lebih cepat', 'Supaya logika jarak dan tombol E tidak ditulis ulang di setiap NPC dan pintu', 'Karena Unity mewajibkannya', 'Agar script tidak bisa diubah'],
          answer: 1,
          explain: 'Kode yang sama dipakai bersama, tiap NPC hanya menulis apa yang terjadi saat Interact().' }
      ] }
    ]
  },

  {
    id: 'dialog-npc',
    title: 'Dialog NPC dengan UI TextMeshPro',
    summary: 'Panel dialog, tombol pilihan yang dibuat dari prefab, dan cara menghindari error umum.',
    minutes: 18,
    xp: 150,
    blocks: [
      { type: 'p', text: 'Dialog Guru Piket terdiri dari satu panel, satu teks, dan satu wadah tombol. Tombol jurusan **dibuat oleh script** dari prefab, jadi jumlahnya mengikuti data.' },
      { type: 'tree', text: `Canvas
└── DialogPanel_GuruPiket        (Image)
    ├── DialogText               (TextMeshPro - Text UI)
    └── ButtonContainer          (Vertical Layout Group)

EventSystem                      (muncul otomatis bersama Canvas)

GuruPiket                        (sprite NPC + script NPCGuruPiket)` },
      { type: 'h', text: 'Menyusun UI' },
      { type: 'steps', items: [
        'Buat **Canvas**: Render Mode Screen Space - Overlay, Canvas Scaler **Scale With Screen Size** 1920 x 1080.',
        'Pastikan ada objek **EventSystem**. Tanpa itu tombol tidak bisa diklik.',
        'Buat Panel `DialogPanel_GuruPiket` di bagian bawah layar, warna gelap semi-transparan.',
        'Di panel, buat `Text - TextMeshPro`. Aktifkan **Wrapping** dan **Rich Text**.',
        'Buat objek kosong `ButtonContainer` dan tambahkan **Vertical Layout Group** (Control Child Size: Width dan Height, Force Expand: Width).',
        'Buat satu `Button - TextMeshPro`, beri **Layout Element** dengan Preferred Height 60, seret ke folder Project untuk jadi **prefab**, lalu hapus dari Hierarchy.',
        'Pasang script di **objek NPC**, bukan di panel. Script pada objek yang nonaktif tidak berjalan.'
      ] },
      { type: 'h', text: 'Script dialog' },
      { type: 'code', file: 'NPCGuruPiket.cs', code: `using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class NPCGuruPiket : Interactable
{
    [SerializeField] private GameObject dialogPanel;
    [SerializeField] private TMP_Text dialogText;
    [SerializeField] private Transform buttonContainer;
    [SerializeField] private Button buttonPrefab;
    [SerializeField] private JurusanData[] daftarJurusan;

    protected override void Interact()
    {
        GameData.IsInDialog = true;       // player berhenti bergerak
        dialogPanel.SetActive(true);
        ShowJurusanList();
    }

    void ShowJurusanList()
    {
        ClearButtons();
        dialogText.text = "Pilih jurusan yang ingin kamu kunjungi:";

        foreach (var jurusan in daftarJurusan)
            AddButton(jurusan.namaJurusan, () => ChooseJurusan(jurusan));
    }

    void AddButton(string label, System.Action onClick)
    {
        Button btn = Instantiate(buttonPrefab, buttonContainer);
        btn.GetComponentInChildren<TMP_Text>().text = label;
        btn.onClick.AddListener(() => onClick());
    }

    void Close()
    {
        if (dialogPanel != null) dialogPanel.SetActive(false);   // cegah MissingReferenceException
        GameData.IsInDialog = false;
    }

    // ChooseJurusan() menyimpan pilihan ke GameData,
    // ClearButtons() menghapus tombol lama sebelum membuat yang baru.
}` },
      { type: 'note', kind: 'warn', title: 'MissingReferenceException saat Close()', text: 'Saat scene berganti, Canvas dihancurkan lebih dulu, tetapi `OnTriggerExit2D` tetap terpanggil. Tanpa pemeriksaan `!= null`, `Close()` mengakses panel yang sudah tiada dan memunculkan error.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Script NPCGuruPiket dipasang di mana?',
          options: ['Di DialogPanel', 'Di objek NPC di scene', 'Di EventSystem', 'Di prefab tombol'],
          answer: 1,
          explain: 'Panel dinonaktifkan saat dialog tertutup, dan script pada objek nonaktif tidak berjalan.' },
        { q: 'Tombol dialog muncul tetapi tidak bisa diklik. Apa yang diperiksa pertama?',
          options: ['Ukuran font', 'Ada objek EventSystem di scene', 'Warna tombol', 'Nama script'],
          answer: 1,
          explain: 'EventSystem meneruskan klik mouse ke UI. Tanpanya tidak ada tombol yang merespons.' },
        { q: 'Tombol-tombol jurusan menumpuk di satu titik. Penyebab paling mungkin?',
          options: ['ButtonContainer belum punya Vertical Layout Group', 'Font terlalu besar', 'Canvas terlalu kecil', 'Prefab belum disimpan'],
          answer: 0,
          explain: 'Layout Group yang mengatur posisi anak-anaknya secara berurutan.' }
      ] }
    ]
  },

  {
    id: 'pindah-scene',
    title: 'Pindah scene dan membawa data',
    summary: 'SceneManager.LoadScene dan GameData untuk menyimpan pilihan jurusan.',
    minutes: 12,
    xp: 120,
    blocks: [
      { type: 'p', text: 'Saat scene diganti, semua GameObject lama hilang. Data yang masih dibutuhkan, seperti jurusan terpilih dan skor, harus disimpan di tempat yang tidak ikut hilang. Cara paling sederhana adalah kelas `static`.' },
      { type: 'code', file: 'GameData.cs', code: `public static class GameData
{
    public static JurusanData SelectedJurusan;
    public static int Score;
    public static bool IsInDialog;   // true = player tidak boleh bergerak
}` },
      { type: 'p', text: 'Pintu kelas memeriksa pilihan player sebelum memindahkan scene. Tambahkan `using UnityEngine.SceneManagement;` di bagian atas file.' },
      { type: 'code', file: 'DoorKelas.cs', code: `protected override void Interact()
{
    var pilihan = GameData.SelectedJurusan;

    if (pilihan == null)
    {
        ShowMessage("Tanyakan dulu ke Guru Piket.");
        return;
    }

    if (pilihan != jurusanPintu)
    {
        ShowMessage("Ini bukan kelas tujuanmu.");
        return;
    }

    SceneManager.LoadScene("Scene_Kelas");
}` },
      { type: 'h', text: 'Agar LoadScene berhasil' },
      { type: 'steps', items: [
        'Buka **File > Build Profiles** dan tambahkan semua scene lewat **Add Open Scenes**.',
        'Nama di kode (`"Scene_Kelas"`) harus sama persis dengan nama file scene.',
        'Mulai bermain dari `Scene_Sekolah` supaya pilihan jurusan sempat disimpan. Kalau menguji `Scene_Kelas` langsung, sediakan jurusan uji coba di Inspector.'
      ] },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Mengapa jurusan terpilih disimpan di GameData, bukan di NPC?',
          options: ['NPC ikut hancur saat scene berganti', 'Unity melarang menyimpan data di NPC', 'GameData lebih besar', 'Agar tampil lebih cepat'],
          answer: 0,
          explain: 'Objek scene dihancurkan saat scene diganti. Field static tetap hidup.' },
        { q: 'LoadScene gagal membuka scene. Apa yang dicek dulu?',
          options: ['Scene sudah ada di Build Profiles dan namanya sama persis', 'Ukuran sprite', 'Nama Canvas', 'Versi TextMeshPro'],
          answer: 0,
          explain: 'Dua penyebab terbanyak: scene belum didaftarkan atau salah ketik nama.' }
      ] }
    ]
  },

  {
    id: 'kuis-skor',
    title: 'Kuis dan skor dengan ScriptableObject',
    summary: 'Menyimpan soal tiap jurusan sebagai aset, mengacaknya, lalu menghitung skor.',
    minutes: 18,
    xp: 150,
    blocks: [
      { type: 'p', text: '`ScriptableObject` adalah wadah data yang disimpan sebagai file di Project. Satu file untuk satu jurusan, lengkap dengan soalnya. Menambah soal tidak perlu mengubah kode, cukup mengisi Inspector.' },
      { type: 'code', file: 'JurusanData.cs', code: `[System.Serializable]
public class QuestionData
{
    [TextArea(2, 4)] public string pertanyaan;
    public string[] pilihan = new string[4];
    [Range(0, 3)] public int indexBenar;   // 0 = pilihan pertama
}

[CreateAssetMenu(fileName = "Jurusan_", menuName = "PPDB/Jurusan")]
public class JurusanData : ScriptableObject
{
    public string namaJurusan;
    [TextArea(2, 5)] public string deskripsi;
    public string lokasiKelas;
    public int soalPerSesi = 5;
    public QuestionData[] soal;
}` },
      { type: 'p', text: 'Buat aset lewat klik kanan di Project, lalu **Create > PPDB > Jurusan**. Satu aset untuk tiap jurusan.' },
      { type: 'h', text: 'Mengacak soal' },
      { type: 'code', file: 'Mengacak soal', code: `// butuh: using System.Linq;
sesi = jurusan.soal
    .OrderBy(_ => Random.value)
    .Take(jurusan.soalPerSesi)
    .ToList();` },
      { type: 'h', text: 'Menjawab dan menghitung skor' },
      { type: 'code', file: 'NPCGuruKejuruan.cs', code: `void Answer(int pilihan)
{
    if (!bolehMenjawab) return;     // cegah klik dua kali
    bolehMenjawab = false;

    QuestionData q = sesi[indexSoal];

    if (pilihan == q.indexBenar)
    {
        GameData.Score += poinPerJawabanBenar;
        feedbackText.text = $"Benar! +{poinPerJawabanBenar} poin";
    }
    else
    {
        feedbackText.text = $"Kurang tepat. Jawaban benar: {q.pilihan[q.indexBenar]}";
    }
}` },
      { type: 'note', kind: 'tip', title: 'Menguji tanpa lewat Scene_Sekolah', text: 'Sediakan field `jurusanUjiCoba` di NPC Guru Kejuruan. Kalau `GameData.SelectedJurusan` kosong, pakai jurusan uji coba itu agar scene kelas bisa dites sendiri.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Apa keuntungan menyimpan soal di ScriptableObject?',
          options: ['Soal bisa ditambah lewat Inspector tanpa mengubah kode', 'Soal otomatis benar', 'Game berubah menjadi 3D', 'Tidak perlu scene'],
          answer: 0,
          explain: 'Data terpisah dari logika, jadi guru atau teman tim bisa menambah soal tanpa menyentuh kode.' },
        { q: 'Apa fungsi `if (!bolehMenjawab) return;`?',
          options: ['Menghapus soal', 'Mencegah pemain menjawab dua kali dan menambah skor ganda', 'Mengacak soal', 'Menutup dialog'],
          answer: 1,
          explain: 'Setelah jawaban pertama, bolehMenjawab menjadi false sampai soal berikutnya tampil.' },
        { q: 'Ada 5 soal, 4 dijawab benar, 10 poin per soal. Skor akhir?',
          options: ['40', '50', '4', '10'],
          answer: 0,
          explain: '4 jawaban benar x 10 poin = 40 dari maksimal 50.' }
      ] }
    ]
  },

  {
    id: 'data-dari-server',
    title: 'Mengambil data dari internet',
    summary: 'UnityWebRequest dan server perantara untuk menampilkan harga tiket yang berubah.',
    minutes: 15,
    xp: 130,
    blocks: [
      { type: 'p', text: 'Game bisa menampilkan data yang berubah, misalnya harga tiket pesawat. Unity meminta data lewat `UnityWebRequest`, lalu JSON yang diterima diubah menjadi objek C#.' },
      { type: 'h', text: 'Alurnya' },
      { type: 'steps', items: [
        'Unity memanggil **server perantara** milikmu.',
        'Server memanggil API maskapai memakai API key yang tersimpan di server.',
        'Hasilnya dikirim kembali ke Unity sebagai JSON.',
        'Unity menampilkan data di dialog NPC dan memperbaruinya tiap 30 detik.'
      ] },
      { type: 'note', kind: 'warn', title: 'Jangan taruh API key di dalam game', text: 'Isi build game bisa dibongkar orang lain. Simpan API key di server perantara, bukan di script Unity.' },
      { type: 'code', file: 'FlightPriceService.cs', code: `IEnumerator FetchPrices(string origin, string destination)
{
    string url = $"http://localhost:3000/api/flights?from={origin}&to={destination}";

    using (UnityWebRequest req = UnityWebRequest.Get(url))
    {
        req.timeout = 10;
        yield return req.SendWebRequest();

        if (req.result != UnityWebRequest.Result.Success)
        {
            Debug.LogWarning(req.error);
            yield break;
        }

        var data = JsonUtility.FromJson<FlightPriceList>(req.downloadHandler.text);
        // tampilkan data.flights di dialog NPC
    }
}` },
      { type: 'note', kind: 'tip', title: 'Dua jebakan umum', text: '`JsonUtility` tidak bisa membaca array di paling luar, jadi bungkus dalam objek seperti `{ "flights": [ ... ] }`. Untuk alamat `http://` saat pengembangan, aktifkan **Allow downloads over HTTP** di Project Settings > Player.' },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'Mengapa API key tidak boleh ditaruh di dalam game?',
          options: ['Build game bisa dibongkar sehingga key bisa diambil orang lain', 'Key membuat game lambat', 'Unity melarang string panjang', 'Key hanya bisa dipakai sekali'],
          answer: 0,
          explain: 'Apa pun yang ada di build bisa diperiksa pemain. Server menjadi tempat rahasia yang aman.' },
        { q: 'JsonUtility gagal membaca JSON yang paling luarnya berupa array. Solusinya?',
          options: ['Bungkus array dalam sebuah objek', 'Hapus semua data', 'Ganti nama scene', 'Matikan Canvas'],
          answer: 0,
          explain: 'JsonUtility hanya bisa membaca objek di tingkat paling luar, sehingga array perlu dibungkus.' }
      ] }
    ]
  },

  {
    id: 'membaca-error',
    title: 'Membaca error di Console',
    summary: 'Penyebab dan cara memperbaiki error yang paling sering muncul.',
    minutes: 10,
    xp: 100,
    blocks: [
      { type: 'p', text: 'Console memberi tahu **jenis error**, **file**, dan **nomor baris**. Mulailah dari baris pertama yang menyebut script milikmu, lalu klik dua kali untuk membukanya.' },
      { type: 'table',
        head: ['Error', 'Biasanya karena', 'Perbaikan'],
        rows: [
          ['NullReferenceException', 'Ada field Inspector yang masih kosong, atau objek tidak ditemukan', 'Lihat baris yang disebut di Console, lalu isi field itu di Inspector'],
          ['MissingReferenceException', 'Objek sudah dihancurkan (misalnya saat scene berganti) tetapi masih diakses', 'Periksa `if (obj != null)` sebelum memakainya'],
          ['Scene couldn\'t be loaded', 'Scene belum ada di Build Profiles, atau namanya berbeda', 'Tambahkan scene dan samakan namanya'],
          ['InvalidOperationException (Input)', 'Active Input Handling memakai Input System baru, kodenya memakai Input lama', 'Ubah ke Both di Project Settings > Player, lalu restart Unity'],
          ['Player tidak bisa lompat', 'isGrounded selalu false', 'Isi Ground Layer dan periksa posisi groundCheck']
        ] },
      { type: 'h', text: 'Cara mencari penyebab dengan Debug.Log' },
      { type: 'steps', items: [
        'Tambahkan `Debug.Log` di awal method yang dicurigai.',
        'Jalankan game dan lihat apakah log muncul di Console.',
        'Jika tidak muncul, masalahnya ada di syarat sebelum method itu dipanggil: trigger, tag, atau input.'
      ] },
      { type: 'code', file: 'Contoh Debug.Log', code: `void OnTriggerEnter2D(Collider2D other)
{
    Debug.Log($"{name} kedatangan: {other.name} (tag: {other.tag})");

    if (!other.CompareTag("Player")) return;
    playerInRange = true;
}` },
      { type: 'h', text: 'Cek pemahaman' },
      { type: 'quiz', questions: [
        { q: 'MissingReferenceException berarti...',
          options: ['Field Inspector kosong', 'Objek sudah dihancurkan tetapi masih diakses', 'Scene tidak ada', 'Input salah'],
          answer: 1,
          explain: 'Field kosong menghasilkan NullReferenceException. Missing berarti objeknya pernah ada lalu dihancurkan.' },
        { q: 'Debug.Log di OnTriggerEnter2D tidak pernah muncul. Dugaan paling kuat?',
          options: ['Trigger, Rigidbody2D, atau tag belum benar', 'Font terlalu kecil', 'Nama prefab salah', 'Skor terlalu tinggi'],
          answer: 0,
          explain: 'Kalau method tidak terpanggil, syarat deteksi collision-nya yang belum terpenuhi.' }
      ] }
    ]
  }
];
