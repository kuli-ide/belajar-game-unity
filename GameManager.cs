using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using TMPro;

/// <summary>
/// GameManager untuk game Susun Kata.
/// Satu script dipakai di semua scene (Menu, Tentang, SusunKata1, SusunKata2, Hasil).
/// Bagian yang aktif bergantung pada kolom Inspector yang diisi.
/// </summary>
public class GameManager : MonoBehaviour
{
    [Header("Pengaturan Halaman Menu")]
    public string Halaman_Menu = "Menu";
    public string Halaman_Permainan = "SusunKata1";
    public string Halaman_Hasil = "Hasil";

    [Header("Pengaturan Halaman Susun Kata")]
    public GameObject grupTempatJawaban;
    public GameObject grupButtonJawaban;
    public GameObject prefabsTempatJawaban;
    public GameObject prefabsButtonJawaban;
    public string kata;
    public int bobot;
    public string halamanSelanjutnya;
    public AudioClip suaraBenar;
    public AudioClip suaraSalah;
    public AudioSource suara;

    [Header("Untuk Keperluan Debugging, Tidak Perlu Diisi !")]
    public int nilai;

    [Header("Pengaturan Halaman Hasil")]
    public GameObject[] bintang;
    public Text text_score;
    public int batas_bintang_1;
    public int batas_bintang_2;
    public int batas_bintang_3;

    // Skor total, dibuat static agar tetap terbawa saat pindah scene.
    static int total;

    List<GameObject> slot = new List<GameObject>();   // kotak jawaban
    List<Button> isiSlot = new List<Button>();        // tombol huruf yang mengisi tiap kotak (null = kosong)
    bool aktif;                                       // true saat pemain boleh mengetuk

    void Start()
    {
        nilai = total;

        // Scene soal: kolom Kata dan grup terisi
        if (!string.IsNullOrEmpty(kata) && grupTempatJawaban != null && grupButtonJawaban != null)
            BangunSoal();

        // Scene hasil: kolom Bintang terisi
        if (bintang != null && bintang.Length > 0)
            TampilkanHasil();
    }

    // ---------- NAVIGASI (dipanggil dari tombol) ----------

    public void MulaiPermainan()
    {
        total = 0;
        SceneManager.LoadScene(Halaman_Permainan);
    }

    public void KeMenu()
    {
        SceneManager.LoadScene(Halaman_Menu);
    }

    // Tombol serbaguna: nama scene diketik pada parameter di Inspector
    public void PindahScene(string namaScene)
    {
        SceneManager.LoadScene(namaScene);
    }

    public void Keluar()
    {
        Application.Quit();
    }

    // ---------- HALAMAN HASIL ----------

    void TampilkanHasil()
    {
        if (text_score != null) text_score.text = total.ToString();

        int jumlah = 0;
        if (total >= batas_bintang_1) jumlah = 1;
        if (total >= batas_bintang_2) jumlah = 2;
        if (total >= batas_bintang_3) jumlah = 3;

        for (int i = 0; i < bintang.Length; i++)
            bintang[i].SetActive(i < jumlah);
    }

    // ---------- HALAMAN SUSUN KATA ----------

    void BangunSoal()
    {
        kata = kata.ToUpper();

        // 1. Buat kotak jawaban (satu per huruf)
        for (int i = 0; i < kata.Length; i++)
        {
            GameObject s = Instantiate(prefabsTempatJawaban, grupTempatJawaban.transform);
            SetText(s, "");

            int idx = i;   // salinan lokal untuk dipakai di listener
            Button sb = s.GetComponent<Button>();
            if (sb != null) sb.onClick.AddListener(() => KosongkanSlot(idx));

            slot.Add(s);
            isiSlot.Add(null);
        }

        // 2. Acak huruf (pastikan hasil acak tidak sama dengan kata asli)
        char[] huruf = kata.ToCharArray();
        do { Acak(huruf); } while (huruf.Length > 1 && new string(huruf) == kata);

        // 3. Buat tombol huruf
        foreach (char c in huruf)
        {
            GameObject h = Instantiate(prefabsButtonJawaban, grupButtonJawaban.transform);
            SetText(h, c.ToString());

            Button b = h.GetComponent<Button>();
            b.onClick.AddListener(() => PilihHuruf(b));
        }

        aktif = true;
    }

    void PilihHuruf(Button b)
    {
        if (!aktif) return;

        int idx = isiSlot.IndexOf(null);   // kotak kosong pertama dari kiri
        if (idx < 0) return;

        isiSlot[idx] = b;
        b.interactable = false;
        SetText(slot[idx], GetText(b.gameObject));

        if (!isiSlot.Contains(null)) Periksa();
    }

    void KosongkanSlot(int idx)
    {
        if (!aktif || isiSlot[idx] == null) return;

        isiSlot[idx].interactable = true;
        isiSlot[idx] = null;
        SetText(slot[idx], "");
    }

    void Periksa()
    {
        aktif = false;

        string jawaban = "";
        foreach (Button b in isiSlot) jawaban += GetText(b.gameObject);

        if (jawaban == kata)
        {
            total += bobot;
            nilai = total;
            Mainkan(suaraBenar);
            Invoke(nameof(Lanjut), 1f);
        }
        else
        {
            Mainkan(suaraSalah);
            Invoke(nameof(UlangiSoal), 0.7f);
        }
    }

    void UlangiSoal()
    {
        for (int i = 0; i < isiSlot.Count; i++)
        {
            if (isiSlot[i] != null) isiSlot[i].interactable = true;
            isiSlot[i] = null;
            SetText(slot[i], "");
        }
        aktif = true;
    }

    void Lanjut()
    {
        string tujuan = string.IsNullOrEmpty(halamanSelanjutnya) ? Halaman_Hasil : halamanSelanjutnya;
        SceneManager.LoadScene(tujuan);
    }

    // ---------- UTILITAS ----------

    // Fisher-Yates shuffle
    void Acak(char[] arr)
    {
        for (int i = arr.Length - 1; i > 0; i--)
        {
            int j = Random.Range(0, i + 1);
            (arr[i], arr[j]) = (arr[j], arr[i]);
        }
    }

    void Mainkan(AudioClip clip)
    {
        if (suara != null && clip != null) suara.PlayOneShot(clip);
    }

    // Mendukung TextMeshPro maupun Text biasa pada prefab
    void SetText(GameObject go, string isi)
    {
        TMP_Text tmp = go.GetComponentInChildren<TMP_Text>();
        if (tmp != null) { tmp.text = isi; return; }

        Text t = go.GetComponentInChildren<Text>();
        if (t != null) t.text = isi;
    }

    string GetText(GameObject go)
    {
        TMP_Text tmp = go.GetComponentInChildren<TMP_Text>();
        if (tmp != null) return tmp.text;

        Text t = go.GetComponentInChildren<Text>();
        return t != null ? t.text : "";
    }
}
