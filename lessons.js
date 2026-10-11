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
  },
  {
    id: 'menyusun-gdd',
    title: 'Menyusun Game Design Document (GDD)',
    summary: 'Tulis rancangan game sebelum membuat kode, memakai game Pengenalan Jurusan SMK sebagai contoh.',
    minutes: 15,
    xp: 60,
    blocks: [
      { type: 'p', text: 'Game Design Document (GDD) adalah dokumen yang menjelaskan **game apa yang akan dibuat, untuk siapa, dan bagaimana cara kerjanya**. Dengan GDD, kamu tidak membuat fitur sambil menebak-nebak, dan orang lain (guru, teman satu tim) bisa ikut memberi masukan sebelum kode ditulis.' },
      { type: 'p', text: 'Di pelajaran ini kamu belajar menyusun GDD lewat satu contoh nyata: **Game Pengenalan Jurusan SMK**, platformer 2D yang mengajak calon siswa berkeliling sekolah, bertanya ke Guru Piket, lalu mencoba kuis di kelas jurusan pilihannya.' },
      { type: 'note', kind: 'tip', title: 'GDD tidak harus panjang', text: 'Tulis secukupnya. Bagian yang belum diketahui cukup ditandai `[isi]`, lalu dilengkapi saat keputusannya sudah ada. Dokumen yang ringkas dan terus diperbarui lebih berguna daripada dokumen tebal yang tidak dibaca.' },

      { type: 'h', text: '1. Kerangka GDD' },
      { type: 'p', text: 'Urutan bagian di bawah dipakai pada contoh kita. Kamu boleh menambah atau membuang bagian sesuai kebutuhan game-mu.' },
      { type: 'table', head: ['Bagian', 'Pertanyaan yang dijawab'], rows: [
        ['Ringkasan Game', 'Game apa ini? Genre, engine, platform, dan satu kalimat pitch.'],
        ['Tujuan dan Target Pemain', 'Siapa pemainnya dan apa ukuran berhasil?'],
        ['Alur Permainan', 'Apa yang dilakukan pemain dari awal sampai selesai?'],
        ['Mekanik dan Kontrol', 'Tombol apa melakukan apa, dan apa aturannya?'],
        ['Karakter dan NPC', 'Siapa saja tokohnya dan apa perannya?'],
        ['Level dan Lingkungan', 'Area apa saja dan bagaimana tata letaknya?'],
        ['Data, Kuis, dan Skor', 'Data apa yang dipakai dan bagaimana skor dihitung?'],
        ['Antarmuka (UI/UX)', 'Layar dan tombol apa yang muncul, kapan?'],
        ['Seni dan Audio', 'Gaya visual, suara, dan sumber asetnya?'],
        ['Spesifikasi Teknis', 'Versi Unity, paket, daftar script, aturan teknis?'],
        ['Rencana Pengerjaan', 'Tahap, penanggung jawab, tenggat?'],
        ['Pengujian', 'Bagaimana tahu game sudah benar?'],
        ['Pertanyaan Terbuka', 'Apa yang belum diputuskan?']
      ] },

      { type: 'h', text: '2. Ringkasan dan tujuan' },
      { type: 'p', text: 'Mulai dari tabel identitas game. Isi yang sudah pasti, tandai yang belum dengan tanda kurung siku.' },
      { type: 'table', head: ['Item', 'Isi'], rows: [
        ['Judul', 'Game Pengenalan Jurusan SMK'],
        ['Genre', 'Platformer 2D, edukasi'],
        ['Engine', 'Unity 2D'],
        ['Platform', '[PC / WebGL / Android: pilih satu atau lebih]'],
        ['Jumlah pemain', 'Satu pemain'],
        ['Pemain sasaran', 'Calon siswa baru'],
        ['Lama satu sesi', '[mis. 10 menit]']
      ] },
      { type: 'p', text: 'Lalu tulis **pitch** dua sampai tiga kalimat tentang pengalaman yang ingin dirasakan pemain, bukan daftar fitur. Contoh: pemain berjalan di sekolah, bertanya ke guru, lalu mencoba menjawab soal di kelas yang paling menarik.' },
      { type: 'p', text: 'Bagian tujuan memakai tabel tiga kolom: **pihak**, **yang ingin dicapai**, dan **ukuran berhasil**. Ukuran berhasil harus bisa dicek, misalnya "pemain menyelesaikan minimal 1 kuis".' },
      { type: 'table', head: ['Pihak', 'Yang ingin dicapai', 'Ukuran berhasil'], rows: [
        ['Calon siswa', 'Mengetahui jurusan yang ada dan mencoba soal dasar tiap jurusan', 'Menyelesaikan minimal 1 kuis'],
        ['Sekolah', 'Memperkenalkan jurusan dan menarik minat calon siswa', 'Jumlah pemain, umpan balik panitia'],
        ['Guru kejuruan', 'Menunjukkan isi dasar jurusannya lewat soal', 'Soal sesuai kurikulum dasar jurusan']
      ] },
      { type: 'note', kind: 'tip', title: 'Tulis juga yang TIDAK dibuat', text: 'Bagian "di luar cakupan versi pertama" (misalnya pendaftaran online atau penilaian resmi) mencegah proyek melebar tanpa batas.' },

      { type: 'h', text: '3. Alur permainan' },
      { type: 'p', text: 'Gambarkan satu putaran bermain sebagai urutan langkah. Percabangan (keputusan) ditandai terpisah. Contoh di bawah punya 9 langkah dan 1 percabangan.' },
      { type: 'flow', title: 'Satu putaran bermain', items: [
        'Muncul di koridor sekolah',
        'Bicara dengan Guru Piket (tekan E)',
        'Pilih jurusan dan lihat lokasi kelas',
        'Ke pintu kelas, tekan E',
        { decision: 'Jurusan cocok?', no: 'Tidak: muncul pesan petunjuk, pemain bisa mencoba lagi', yes: 'Ya: pemain pindah ke ruang kelas' },
        'Masuk ruang kelas jurusan',
        'Bicara dengan Guru Kejuruan',
        'Jawab soal acak, +10 untuk tiap jawaban benar',
        'Lihat hasil dan skor',
        'Ulangi kuis atau kembali ke koridor'
      ], caption: 'Pintu kelas hanya terbuka untuk jurusan yang dipilih di Guru Piket.' },
      { type: 'p', text: 'Tutup bagian ini dengan **kondisi selesai**: kapan game dianggap tamat? Misalnya setelah satu kuis, atau setelah semua jurusan dicoba. Keputusan ini memengaruhi seluruh rancangan, jadi jangan dibiarkan kosong terlalu lama.' },

      { type: 'h', text: '4. Mekanik dan kontrol' },
      { type: 'p', text: 'Satu baris per aksi: kontrol, perilaku, dan nilai awal yang nanti jadi field di Inspector.' },
      { type: 'table', head: ['Aksi', 'Kontrol', 'Perilaku', 'Nilai awal'], rows: [
        ['Jalan kiri / kanan', 'Panah kiri/kanan atau A/D', 'Kecepatan tetap, sprite menoleh ke arah jalan', 'Move Speed 6'],
        ['Lompat', 'Spasi', 'Hanya saat menyentuh tanah (groundCheck)', 'Jump Force 12'],
        ['Interaksi', 'E', 'Aktif saat pemain di area trigger NPC atau pintu', '-'],
        ['Pilih jawaban atau menu', 'Klik mouse', 'Tombol dialog dan kuis', '-'],
        ['Papan skor', 'Tab', 'Tampil atau sembunyi', '-']
      ] },
      { type: 'p', text: 'Di bawah tabel, tulis **aturan penting** sebagai kalimat pendek yang bisa diuji:' },
      { type: 'steps', items: [
        'Saat dialog atau kuis terbuka, pemain tidak bisa bergerak.',
        'Pintu hanya terbuka bila jurusan yang dipilih di Guru Piket sama dengan jurusan pintu.',
        'Prompt "Tekan E" muncul saat pemain dekat objek yang bisa diajak berinteraksi.'
      ] },

      { type: 'h', text: '5. Karakter, NPC, dan level' },
      { type: 'table', head: ['Karakter', 'Peran di game', 'Perilaku'], rows: [
        ['Player (calon siswa)', 'Dikendalikan pemain', 'Jalan, lompat, berinteraksi dengan E'],
        ['NPC Guru Piket', 'Pemberi informasi jurusan', 'Menampilkan daftar jurusan, menyimpan jurusan yang dipilih, menyebut lokasi kelas'],
        ['NPC Guru Kejuruan', 'Pemberi kuis per jurusan', 'Memberi soal acak sesuai jurusan, menghitung skor, menampilkan hasil']
      ] },
      { type: 'p', text: 'Untuk setiap NPC, siapkan contoh dialog supaya nada bicaranya konsisten, misalnya Guru Piket: "Selamat datang di sekolah kami, calon siswa baru! Mau tahu jurusan apa saja yang ada?"' },
      { type: 'p', text: 'Level dijelaskan per area. Semua area contoh kita ada dalam satu scene sekolah:' },
      { type: 'table', head: ['Area', 'Isi', 'Keterangan'], rows: [
        ['Koridor sekolah', 'Titik muncul pemain, Guru Piket, pintu kelas tiap jurusan, platform', 'Pemain mulai di sini'],
        ['Ruang kelas (satu per jurusan)', 'Guru Kejuruan, pintu keluar, titik muncul', 'Kuis jurusan tersebut']
      ] },
      { type: 'note', kind: 'warn', title: 'Aturan penataan yang sering terlupa', text: 'Letakkan titik muncul **di samping** pintu, bukan di dalam area trigger-nya, dan beri lantai layer tanah agar deteksi lompat bekerja. Aturan seperti ini sebaiknya ditulis di GDD supaya tidak jadi bug yang sama berulang kali.' },

      { type: 'h', text: '6. Data, kuis, dan skor' },
      { type: 'p', text: 'Putuskan bentuk datanya sejak awal. Pada contoh ini tiap jurusan adalah satu aset **ScriptableObject** sehingga soal bisa ditambah tanpa mengubah kode.' },
      { type: 'table', head: ['Field', 'Isi', 'Contoh'], rows: [
        ['Nama jurusan', 'Nama lengkap', 'Rekayasa Perangkat Lunak'],
        ['Singkatan', 'Dipakai di pesan dan papan skor', 'RPL'],
        ['Deskripsi', 'Penjelasan singkat yang dibaca pemain', '2 sampai 3 kalimat'],
        ['Lokasi kelas', 'Petunjuk arah dari koridor', 'Pintu ketiga dari kiri'],
        ['Soal per sesi', 'Jumlah soal yang diambil acak', '5'],
        ['Daftar soal', 'Pertanyaan, 4 pilihan, satu jawaban benar', 'lihat contoh di bawah']
      ] },
      { type: 'table', head: ['Aturan skor', 'Nilai'], rows: [
        ['Poin per jawaban benar', '10'],
        ['Pengurangan untuk jawaban salah', 'Tidak ada, jawaban yang benar ditampilkan'],
        ['Skor maksimum', 'Soal per sesi × 10'],
        ['Komentar akhir', '80% benar atau lebih: "Luar biasa"; 50% atau lebih: "Bagus"; di bawahnya: "Tetap semangat"'],
        ['Ulangi kuis', 'Boleh, soal diacak ulang dan skor kembali ke 0']
      ] },
      { type: 'table', head: ['Jurusan', 'Contoh soal', 'Jawaban benar'], rows: [
        ['RPL', 'Apa kepanjangan dari HTML?', 'HyperText Markup Language'],
        ['Pengembangan GIM', 'Bahasa pemrograman apa yang digunakan pada Unity?', 'C#']
      ] },
      { type: 'note', kind: 'tip', title: 'Soal dari ahlinya', text: 'Soal sebaiknya disusun dan diperiksa guru kejuruan. Catat siapa penyusun dan pemeriksanya di bagian Pertanyaan Terbuka.' },

      { type: 'h', text: '7. Antarmuka (UI/UX)' },
      { type: 'p', text: 'Daftarkan tiap layar: isinya, tombolnya, dan kapan muncul. Ini langsung menjadi daftar panel yang harus kamu buat di Canvas.' },
      { type: 'table', head: ['Layar', 'Isi', 'Tombol', 'Muncul saat'], rows: [
        ['Dialog Guru Piket', 'Sapaan, daftar jurusan, deskripsi dan lokasi kelas', 'Satu tombol per jurusan, "Pilih jurusan lain", "Terima kasih"', 'Tekan E di dekat Guru Piket'],
        ['Pesan pintu', 'Teks singkat (belum memilih jurusan, salah kelas)', 'Tanpa tombol, hilang sendiri setelah 3 detik', 'Tekan E di pintu yang tidak cocok'],
        ['Kuis: pengantar', 'Nama jurusan, jumlah soal, nilai per soal', 'Mulai, Tutup', 'Tekan E di dekat Guru Kejuruan'],
        ['Kuis: soal', 'Nomor, pertanyaan, 4 pilihan, umpan balik, skor berjalan', '4 tombol jawaban, "Soal berikutnya"', 'Setelah Mulai'],
        ['Kuis: hasil', 'Jumlah benar, skor, komentar', 'Ulangi, Kembali ke sekolah', 'Setelah soal terakhir']
      ] },
      { type: 'p', text: 'Tambahkan pedoman tampilan yang konkret: semua teks memakai TextMeshPro, jawaban benar hijau dan salah merah, resolusi acuan 1920 x 1080 dengan **Scale With Screen Size**, dan ukuran huruf cukup besar untuk layar proyektor.' },

      { type: 'h', text: '8. Seni, audio, dan teknis' },
      { type: 'p', text: 'Untuk seni dan audio, buat tabel kebutuhan (karakter, NPC, latar, UI, musik, efek suara) dengan kolom **gaya**, **sumber aset**, dan **status**. Aturan pentingnya:' },
      { type: 'steps', items: [
        'Semua aset berlisensi jelas; simpan sumber dan lisensinya di satu daftar.',
        'Logo dan nama sekolah dipakai atas izin pihak sekolah.',
        'Foto siswa atau guru yang asli hanya dipakai dengan izin tertulis.'
      ] },
      { type: 'p', text: 'Bagian teknis berisi versi Unity, paket, jenis input, dan **daftar script dengan satu tugas masing-masing**. Daftar ini mencerminkan prinsip satu script, satu tanggung jawab:' },
      { type: 'table', head: ['Script', 'Tugas'], rows: [
        ['JurusanData, QuestionData', 'Data jurusan dan soal (ScriptableObject)'],
        ['GameData', 'Menyimpan jurusan terpilih, skor, dan status dialog'],
        ['PlayerController2D', 'Gerak, lompat, deteksi tanah'],
        ['Interactable', 'Dasar untuk objek yang bisa diajak berinteraksi dengan E'],
        ['NPCGuruPiket', 'Dialog daftar jurusan dan penyimpanan pilihan'],
        ['DoorKelas', 'Pintu kelas dan pindah scene'],
        ['NPCGuruKejuruan', 'Kuis acak, skor, hasil']
      ] },
      { type: 'note', kind: 'warn', title: 'Aturan teknis', text: 'Nama scene di kode harus sama persis dengan nama file dan terdaftar di Build Profiles. Pemain harus bertag `Player`, dan lantai memakai layer tanah.' },

      { type: 'h', text: '9. Rencana pengerjaan dan pengujian' },
      { type: 'p', text: 'Pecah pekerjaan menjadi tahap yang bisa dicoba satu per satu. Tiap tahap punya penanggung jawab, tenggat, dan status.' },
      { type: 'table', head: ['Tahap', 'Isi pekerjaan'], rows: [
        ['1. Prototipe gerak', 'Pemain berjalan dan melompat di koridor'],
        ['2. Guru Piket', 'Dialog dan daftar jurusan, jurusan tersimpan'],
        ['3. Pintu dan ruang kelas', 'Pintu hanya terbuka untuk jurusan yang cocok'],
        ['4. Kuis dan skor', 'Soal acak, skor, layar hasil'],
        ['5. Bank soal', 'Soal tiap jurusan dari guru kejuruan'],
        ['6. Tampilan akhir', 'Sprite, UI, musik, dan efek suara'],
        ['7. Uji coba', 'Dicoba beberapa siswa, catat masukan, perbaiki'],
        ['8. Dipakai', 'Dipasang di perangkat sekolah untuk penerimaan siswa']
      ] },
      { type: 'p', text: 'Pengujian ditulis sebagai kolom **yang diuji** dan **lulus bila**, supaya hasilnya jelas lulus atau tidak:' },
      { type: 'table', head: ['Area', 'Yang diuji', 'Lulus bila'], rows: [
        ['Gerak', 'Jalan dan lompat di semua platform', 'Melompat hanya saat di tanah, tidak menembus lantai'],
        ['Interaksi', 'Tombol E di dekat dan jauh dari NPC dan pintu', 'Prompt hanya muncul saat dekat; tidak aktif saat dialog terbuka'],
        ['Pintu kelas', 'Belum memilih jurusan, salah pintu, pintu yang tepat', 'Pesan sesuai muncul; hanya pintu yang tepat memindahkan pemain'],
        ['Kuis', 'Jawab benar, salah, ulangi, kembali ke sekolah', 'Skor benar, tidak bisa menjawab dua kali, soal teracak ulang']
      ] },
      { type: 'p', text: 'Terakhir, uji dengan calon siswa sungguhan. Pertanyaan kuncinya: tanpa dibantu, apakah mereka tahu harus bicara ke Guru Piket dulu? Apakah soal terlalu mudah atau sulit?' },

      { type: 'h', text: 'Latihan: GDD untuk game-mu' },
      { type: 'steps', items: [
        'Pilih satu ide game kecil dan tulis tabel identitas serta pitch-nya.',
        'Gambar alur satu putaran bermain dalam 5 sampai 9 langkah.',
        'Buat tabel kontrol lengkap dengan nilai awal.',
        'Tulis 3 aturan penting yang bisa diuji.',
        'Kumpulkan hal yang belum jelas di daftar Pertanyaan Terbuka, lalu cari jawabannya satu per satu.'
      ] },

      { type: 'quiz', questions: [
        { q: 'Apa fungsi utama GDD?',
          options: ['Pengganti kode game', 'Menyepakati rancangan game sebelum dan selama dibuat', 'Dokumen yang hanya dibaca setelah game rilis', 'Daftar harga aset'],
          answer: 1,
          explain: 'GDD adalah rancangan bersama: apa yang dibuat, untuk siapa, dan bagaimana aturannya, sehingga keputusan tidak hanya ada di kepala satu orang.' },
        { q: 'Mana "ukuran berhasil" yang baik untuk bagian Tujuan?',
          options: ['Game harus bagus', 'Pemain menyelesaikan minimal 1 kuis', 'Semua orang suka', 'Grafik menarik'],
          answer: 1,
          explain: 'Ukuran berhasil harus bisa dicek dengan angka atau kejadian yang jelas.' },
        { q: 'Mengapa bagian "di luar cakupan versi pertama" berguna?',
          options: ['Untuk mengisi halaman', 'Supaya proyek tidak melebar tanpa batas', 'Untuk menghapus fitur utama', 'Agar game tidak perlu diuji'],
          answer: 1,
          explain: 'Menulis apa yang sengaja belum dibuat menjaga jadwal dan fokus tim.' },
        { q: 'Kolom "Lulus bila" pada tabel pengujian berfungsi untuk...',
          options: ['Menentukan warna tombol', 'Membuat hasil uji jelas lulus atau tidak', 'Menghitung skor pemain', 'Menamai script'],
          answer: 1,
          explain: 'Kriteria yang tertulis membuat pengujian objektif dan bisa diulang oleh siapa pun.' },
        { q: 'Kenapa data jurusan dan soal disimpan sebagai ScriptableObject pada rancangan ini?',
          options: ['Agar soal bisa ditambah tanpa mengubah kode', 'Agar game otomatis online', 'Agar tidak perlu Canvas', 'Agar skor tersimpan ke server'],
          answer: 0,
          explain: 'Data terpisah dari kode membuat guru atau desainer bisa menambah soal lewat Inspector.' }
      ] }
    ]
  }
];
