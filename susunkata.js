/* Widget interaktif untuk modul Game Susun Kata.
   Menyediakan window.SK dengan tiga komponen:
   - createWordGame(el)        demo game Susun Kata yang bisa dimainkan, lengkap dengan alur scene
   - mountInspector(el, blok)  tiruan panel Inspector GameManager untuk satu scene
   - mountSceneMap(el, blok)   peta scene yang bisa diklik
   Dipakai oleh app.js lewat blok pelajaran bertipe 'wordgame', 'inspector', dan 'scenemap'. */
(function (global) {
  'use strict';

  // ---------- data: field GameManager ----------
  const NONE = {
    obj: 'None (Game Object)',
    clip: 'None (Audio Clip)',
    source: 'None (Audio Source)',
    text: 'None (Text)',
    arr: 'Size 0'
  };

  const FIELDS = [
    { g: 'Pengaturan Halaman Menu', name: 'Halaman_Menu', def: 'Menu',
      info: 'Nama scene menu. Dipakai fungsi KeMenu(). Isi di scene yang punya tombol Kembali atau Menu.' },
    { g: 'Pengaturan Halaman Menu', name: 'Halaman_Permainan', def: 'SusunKata1',
      info: 'Nama scene soal pertama. Dipakai fungsi MulaiPermainan() dari tombol Mulai.' },
    { g: 'Pengaturan Halaman Menu', name: 'Halaman_Hasil', def: 'Hasil',
      info: 'Nama scene hasil. Menjadi tujuan cadangan Lanjut() bila Halaman Selanjutnya dikosongkan.' },

    { g: 'Pengaturan Halaman Susun Kata', name: 'Grup Tempat Jawaban', def: NONE.obj,
      info: 'Objek kosong ber-Horizontal Layout Group. Kotak jawaban dibuat otomatis sebagai anaknya (satu kotak per huruf).' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Grup Button Jawaban', def: NONE.obj,
      info: 'Objek kosong ber-Horizontal Layout Group. Tombol huruf acak dibuat otomatis sebagai anaknya.' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Prefabs Tempat Jawaban', def: NONE.obj,
      info: 'Prefab kotak jawaban. Harus berupa Button dengan teks anak, supaya kotak bisa diketuk untuk mengembalikan huruf.' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Prefabs Button Jawaban', def: NONE.obj,
      info: 'Prefab tombol huruf (Button dengan teks anak). Teksnya diisi huruf oleh script.' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Kata', def: '',
      info: 'Kata soal. Otomatis dijadikan huruf kapital. Panjang kata menentukan jumlah kotak. Bila kosong, scene dianggap bukan scene soal.' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Bobot', def: '0',
      info: 'Poin yang ditambahkan ke total bila jawaban benar.' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Halaman Selanjutnya', def: '',
      info: 'Nama scene setelah jawaban benar. Bila kosong, script memakai Halaman_Hasil.' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Suara Benar', def: NONE.clip,
      info: 'AudioClip yang diputar saat jawaban benar. Boleh kosong, game tetap jalan tanpa suara.' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Suara Salah', def: NONE.clip,
      info: 'AudioClip yang diputar saat jawaban salah.' },
    { g: 'Pengaturan Halaman Susun Kata', name: 'Suara', def: NONE.source,
      info: 'Komponen AudioSource pemutar. Seret objek GameManager sendiri yang sudah diberi Audio Source (Play On Awake dimatikan).' },

    { g: 'Untuk Keperluan Debugging, Tidak Perlu Diisi !', name: 'Nilai', def: '0',
      info: 'Hanya penampil skor saat game berjalan, untuk debugging. Terisi otomatis, jangan diedit.', auto: true },

    { g: 'Pengaturan Halaman Hasil', name: 'Bintang', def: NONE.arr,
      info: 'Array tiga objek bintang (Size 3, urutan 1-2-3). Script menyalakan sesuai skor. Matikan ketiganya di Hierarchy sebelum Play.' },
    { g: 'Pengaturan Halaman Hasil', name: 'Text_score', def: NONE.text,
      info: 'Legacy Text (UI > Legacy > Text) tempat skor total ditampilkan. Tipenya Text biasa, bukan TextMeshPro.' },
    { g: 'Pengaturan Halaman Hasil', name: 'Batas_bintang_1', def: '0',
      info: 'Skor minimum untuk mendapat 1 bintang.' },
    { g: 'Pengaturan Halaman Hasil', name: 'Batas_bintang_2', def: '0',
      info: 'Skor minimum untuk mendapat 2 bintang.' },
    { g: 'Pengaturan Halaman Hasil', name: 'Batas_bintang_3', def: '0',
      info: 'Skor minimum untuk mendapat 3 bintang.' }
  ];

  // ---------- data: peta scene ----------
  const NODES = {
    Menu: {
      lesson: 'sk-menu',
      desc: 'Halaman awal. Dari sini pemain memulai permainan, membuka Tentang, atau keluar.',
      list: ['Mulai: MulaiPermainan() lalu masuk SusunKata1', 'Tentang: PindahScene("Tentang")', 'Keluar: Keluar()']
    },
    Tentang: {
      lesson: 'sk-tentang',
      desc: 'Halaman informasi pembuat dan cara bermain.',
      list: ['Kembali: KeMenu()']
    },
    SusunKata1: {
      lesson: 'sk-soal-1',
      desc: 'Soal pertama (UNITY). Kotak dan tombol huruf dibuat otomatis dari prefab.',
      list: ['Jawaban benar: skor + Bobot, lalu SusunKata2', 'Jawaban salah: huruf kembali, coba lagi']
    },
    SusunKata2: {
      lesson: 'sk-soal-2',
      desc: 'Soal kedua (PROGRAM). Soal terakhir mengarah ke Hasil.',
      list: ['Jawaban benar: skor + Bobot, lalu Hasil']
    },
    Hasil: {
      lesson: 'sk-hasil',
      desc: 'Menampilkan skor total dan 1 sampai 3 bintang.',
      list: ['Menu: KeMenu(), skor direset saat Mulai ditekan lagi']
    }
  };

  // ---------- util ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  const STAR = '<svg viewBox="0 0 24 24" width="56" height="56" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z" stroke-linejoin="round"/></svg>';

  // ---------- Inspector ----------
  function mountInspector(el, block) {
    const fill = block.fill || {};
    const root = document.createElement('div');
    root.className = 'sk-insp';
    root.setAttribute('data-only', '0');

    let groups = '';
    let lastG = null;
    let filledCount = 0;
    FIELDS.forEach(function (f) {
      if (f.g !== lastG) {
        if (lastG !== null) groups += '</div>';
        groups += '<div class="sk-insp-g" data-g><h4>' + esc(f.g) + '</h4>';
        lastG = f.g;
      }
      const on = Object.prototype.hasOwnProperty.call(fill, f.name);
      if (on) filledCount++;
      const val = on ? fill[f.name] : f.def;
      groups += '<button type="button" class="sk-row" aria-pressed="false" data-name="' + esc(f.name) + '" data-on="' + (on ? 1 : 0) + '">' +
        '<span class="sk-k">' + esc(f.name) + '</span>' +
        '<span class="sk-v' + (on ? ' on' : '') + '">' + (val === '' ? '&nbsp;' : esc(val)) + '</span></button>';
    });
    groups += '</div>';

    root.innerHTML =
      '<div class="sk-insp-head"><span>GameManager (Script)</span><span class="pill">Scene: ' + esc(block.scene) + '</span></div>' +
      groups +
      '<p class="sk-info" role="status" aria-live="polite">Klik sebuah kolom untuk melihat fungsinya.</p>' +
      '<div class="sk-insp-foot">' +
        '<label class="pg-check"><input type="checkbox" data-only> <span>Tampilkan hanya kolom yang diisi di scene ini</span></label>' +
        '<span class="sk-count">' + filledCount + ' kolom diisi</span>' +
      '</div>';
    el.appendChild(root);

    const info = root.querySelector('.sk-info');
    const rows = Array.prototype.slice.call(root.querySelectorAll('.sk-row'));

    rows.forEach(function (row) {
      row.addEventListener('click', function () {
        rows.forEach(function (r) { r.setAttribute('aria-pressed', r === row ? 'true' : 'false'); });
        const f = FIELDS.find(function (x) { return x.name === row.getAttribute('data-name'); });
        const on = row.getAttribute('data-on') === '1';
        const status = f.auto ? 'Terisi otomatis saat game berjalan.'
          : on ? 'Di scene ' + block.scene + ' diisi: ' + fill[f.name] + '.'
          : 'Di scene ' + block.scene + ' dibiarkan kosong atau nilai bawaan.';
        info.innerHTML = '<strong>' + esc(f.name) + '.</strong> ' + esc(f.info) + ' <em>' + esc(status) + '</em>';
      });
    });

    const only = root.querySelector('input[data-only]');
    only.addEventListener('change', function () {
      root.setAttribute('data-only', only.checked ? '1' : '0');
      Array.prototype.forEach.call(root.querySelectorAll('[data-g]'), function (g) {
        const any = g.querySelector('.sk-row[data-on="1"]');
        g.hidden = only.checked && !any;
      });
    });
  }

  // ---------- Peta scene ----------
  function mountSceneMap(el, block) {
    const root = document.createElement('div');
    root.className = 'sk-map';
    function node(name) {
      return '<button type="button" class="sk-node" data-n="' + name + '" aria-pressed="false">' + name + '</button>';
    }
    const arrow = '<span class="sk-arrow" aria-hidden="true">→</span>';
    root.innerHTML =
      '<div class="sk-map-row">' + node('Menu') + arrow + node('SusunKata1') + arrow + node('SusunKata2') + arrow + node('Hasil') + '</div>' +
      '<div class="sk-map-row sub">' + node('Tentang') + '<span class="sk-arrow" aria-hidden="true">↔ Menu</span></div>' +
      '<div class="sk-map-card" role="status" aria-live="polite"></div>';
    el.appendChild(root);

    const card = root.querySelector('.sk-map-card');
    const nodes = Array.prototype.slice.call(root.querySelectorAll('.sk-node'));

    function select(name) {
      const d = NODES[name];
      nodes.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-n') === name ? 'true' : 'false'); });
      card.innerHTML = '<strong>Scene ' + esc(name) + '.</strong> ' + esc(d.desc) +
        '<ul>' + d.list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<a href="#/belajar/' + d.lesson + '">Buka pelajaran scene ' + esc(name) + '</a>';
    }
    nodes.forEach(function (b) {
      b.addEventListener('click', function () { select(b.getAttribute('data-n')); });
    });
    select(block.current && NODES[block.current] ? block.current : 'Menu');
  }

  // ---------- Demo game ----------
  function createWordGame(container) {
    const cfg = { words: ['UNITY', 'PROGRAM'], bobot: 10, b1: 10, b2: 15, b3: 20 };
    let total = 0;          // meniru static int total pada GameManager
    let idx = 0;            // soal keberapa
    let screen = 'Menu';
    let letters = [];       // { ch, used }
    let slots = [];         // indeks huruf yang mengisi tiap kotak (null = kosong)
    let active = false;
    let timers = [];
    let slotEls = [], letterEls = [];

    const wordsId = 'sk-words-' + Math.random().toString(36).slice(2, 8);
    const root = document.createElement('div');
    root.className = 'sk';
    root.innerHTML =
      '<div class="sk-stage"><div class="sk-screen" data-screen></div></div>' +
      '<div class="pg-panel sk-panel">' +
        '<div class="pg-sliders">' +
          '<div class="pg-slider"><label for="' + wordsId + '">Kata soal (pisahkan koma)</label>' +
            '<input id="' + wordsId + '" class="sk-input" type="text" data-f="words" value="UNITY, PROGRAM" maxlength="60" autocomplete="off" spellcheck="false"></div>' +
          slider('bobot', 'Bobot per soal', 5, 30, 5, cfg.bobot) +
          slider('b1', 'Batas_bintang_1', 5, 60, 5, cfg.b1) +
          slider('b2', 'Batas_bintang_2', 5, 60, 5, cfg.b2) +
          slider('b3', 'Batas_bintang_3', 5, 60, 5, cfg.b3) +
          '<p class="pg-bugnote" data-warn role="status"></p>' +
        '</div>' +
        '<div class="pg-side">' +
          '<dl class="pg-read">' +
            '<div><dt>Scene aktif</dt><dd data-r="scene">Menu</dd></div>' +
            '<div><dt>total (static)</dt><dd data-r="total">0</dd></div>' +
            '<div><dt>nilai</dt><dd data-r="nilai">0</dd></div>' +
            '<div><dt>kata</dt><dd data-r="kata">-</dd></div>' +
          '</dl>' +
          '<p class="pg-hint">Mainkan seperti di Unity: ketuk huruf, atau ketik huruf di keyboard (Backspace menghapus). Ketuk kotak berisi untuk mengembalikan huruf.</p>' +
          '<button class="btn ghost small" type="button" data-act="reset">Mulai ulang dari Menu</button>' +
        '</div>' +
      '</div>';
    container.appendChild(root);

    function uid() { return Math.random().toString(36).slice(2, 8); }
    function slider(key, label, min, max, step, val) {
      const id = 'sk-' + key + '-' + uid();
      return '<div class="pg-slider"><label for="' + id + '">' + label + ' <output data-o="' + key + '">' + val + '</output></label>' +
        '<input id="' + id + '" type="range" data-f="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
    }

    const screenEl = root.querySelector('[data-screen]');
    function setR(k, v) { root.querySelector('[data-r="' + k + '"]').textContent = v; }
    function after(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function sceneName() { return screen === 'Soal' ? 'SusunKata' + (idx + 1) : screen; }
    function syncWarn() {
      const w = root.querySelector('[data-warn]');
      w.textContent = (cfg.b1 > cfg.b2 || cfg.b2 > cfg.b3)
        ? 'Batas tidak menaik (1 \u2264 2 \u2264 3). Script memakai tiga if berurutan, jadi jumlah bintang bisa tidak masuk akal.'
        : '';
    }
    function syncReadout() {
      setR('scene', sceneName());
      setR('total', String(total));
      setR('nilai', String(total));
      setR('kata', screen === 'Soal' ? cfg.words[idx] : '-');
      syncWarn();
    }

    // ----- layar -----
    function go(name) {
      clearTimers();
      screen = name;
      active = false;
      if (name === 'Menu') drawMenu();
      else if (name === 'Tentang') drawTentang();
      else if (name === 'Soal') drawSoal();
      else drawHasil();
      syncReadout();
    }

    function drawMenu() {
      screenEl.innerHTML =
        '<h3 class="sk-title">GAME SUSUN KATA</h3>' +
        '<div class="sk-btns">' +
          '<button class="btn" type="button" data-a="mulai">Mulai</button>' +
          '<button class="btn ghost" type="button" data-a="tentang">Tentang</button>' +
          '<button class="btn ghost" type="button" data-a="keluar">Keluar</button>' +
        '</div>' +
        '<p class="sk-fb" role="status" aria-live="polite"></p>';
      const fb = screenEl.querySelector('.sk-fb');
      screenEl.querySelector('[data-a="mulai"]').addEventListener('click', function () {
        total = 0; idx = 0; go('Soal');
      });
      screenEl.querySelector('[data-a="tentang"]').addEventListener('click', function () { go('Tentang'); });
      screenEl.querySelector('[data-a="keluar"]').addEventListener('click', function () {
        fb.textContent = 'Application.Quit() hanya bekerja pada hasil build. Di Unity Editor tidak terjadi apa-apa.';
      });
    }

    function drawTentang() {
      screenEl.innerHTML =
        '<h3 class="sk-title">TENTANG</h3>' +
        '<p class="sk-about">Game Susun Kata, media belajar Pengembangan Gim.<br>Ketuk huruf acak untuk mengisi kotak jawaban, lalu susun menjadi kata yang benar.</p>' +
        '<div class="sk-btns"><button class="btn" type="button" data-a="kembali">Kembali</button></div>';
      screenEl.querySelector('[data-a="kembali"]').addEventListener('click', function () { go('Menu'); });
    }

    function drawSoal() {
      const kata = cfg.words[idx];
      const chars = kata.split('');
      let acak = chars.slice();
      if (acak.length > 1) {
        let guard = 0;
        do { shuffle(acak); guard++; } while (acak.join('') === kata && guard < 50);
      }
      letters = acak.map(function (c) { return { ch: c, used: false }; });
      slots = chars.map(function () { return null; });

      screenEl.innerHTML =
        '<div class="sk-head"><span>Susun Kata ' + (idx + 1) + '</span><span class="pill">Skor ' + total + '</span></div>' +
        '<p class="sk-hint">Susun huruf menjadi kata yang benar</p>' +
        '<div class="sk-slots" role="group" aria-label="Kotak jawaban">' +
          chars.map(function (_, i) { return '<button type="button" class="sk-slot" data-s="' + i + '" aria-label="Kotak ' + (i + 1) + ', kosong"></button>'; }).join('') +
        '</div>' +
        '<div class="sk-letters" role="group" aria-label="Huruf acak">' +
          letters.map(function (l, i) { return '<button type="button" class="sk-letter" data-l="' + i + '">' + l.ch + '</button>'; }).join('') +
        '</div>' +
        '<p class="sk-fb" role="status" aria-live="polite"></p>';

      slotEls = Array.prototype.slice.call(screenEl.querySelectorAll('.sk-slot'));
      letterEls = Array.prototype.slice.call(screenEl.querySelectorAll('.sk-letter'));
      slotEls.forEach(function (b, i) { b.addEventListener('click', function () { kosongkan(i); }); });
      letterEls.forEach(function (b, i) { b.addEventListener('click', function () { pilih(i); }); });
      active = true;
    }

    function paint() {
      slotEls.forEach(function (b, i) {
        const li = slots[i];
        b.textContent = li === null ? '' : letters[li].ch;
        b.classList.toggle('filled', li !== null);
        b.setAttribute('aria-label', 'Kotak ' + (i + 1) + (li === null ? ', kosong' : ', huruf ' + letters[li].ch));
      });
      letterEls.forEach(function (b, i) { b.disabled = letters[i].used; });
    }

    function pilih(li) {
      if (!active || letters[li].used) return;
      const si = slots.indexOf(null);           // kotak kosong pertama dari kiri
      if (si < 0) return;
      slots[si] = li;
      letters[li].used = true;
      paint();
      if (slots.indexOf(null) < 0) periksa();
    }

    function kosongkan(si) {
      if (!active || slots[si] === null) return;
      letters[slots[si]].used = false;
      slots[si] = null;
      paint();
    }

    function periksa() {
      active = false;
      const jawaban = slots.map(function (li) { return letters[li].ch; }).join('');
      const fb = screenEl.querySelector('.sk-fb');
      const wrap = screenEl.querySelector('.sk-slots');
      if (jawaban === cfg.words[idx]) {
        total += cfg.bobot;
        syncReadout();
        wrap.classList.add('right');
        fb.className = 'sk-fb ok';
        fb.textContent = 'Benar! +' + cfg.bobot + ' poin';
        after(1000, function () {
          idx++;
          if (idx >= cfg.words.length) { idx = cfg.words.length - 1; go('Hasil'); }
          else go('Soal');
        });
      } else {
        wrap.classList.add('wrong');
        fb.className = 'sk-fb no';
        fb.textContent = 'Salah, coba lagi';
        after(700, function () {
          letters.forEach(function (l) { l.used = false; });
          slots = slots.map(function () { return null; });
          wrap.classList.remove('wrong');
          fb.className = 'sk-fb';
          fb.textContent = '';
          paint();
          active = true;
        });
      }
    }

    function drawHasil() {
      let n = 0;
      if (total >= cfg.b1) n = 1;
      if (total >= cfg.b2) n = 2;
      if (total >= cfg.b3) n = 3;
      screenEl.innerHTML =
        '<h3 class="sk-title">HASIL</h3>' +
        '<div class="sk-stars" role="img" aria-label="' + n + ' dari 3 bintang">' +
          [1, 2, 3].map(function (i) { return '<span class="sk-star' + (i <= n ? ' on' : '') + '">' + STAR + '</span>'; }).join('') +
        '</div>' +
        '<p class="sk-score">Skor: ' + total + '</p>' +
        '<p class="sk-hint">1 bintang mulai ' + cfg.b1 + ', 2 bintang mulai ' + cfg.b2 + ', 3 bintang mulai ' + cfg.b3 + '</p>' +
        '<div class="sk-btns"><button class="btn" type="button" data-a="menu">Menu</button></div>';
      screenEl.querySelector('[data-a="menu"]').addEventListener('click', function () { go('Menu'); });
    }

    // ----- keyboard -----
    function inView() {
      const r = root.getBoundingClientRect();
      return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight);
    }
    function onKey(e) {
      if (screen !== 'Soal' || !active) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (!inView()) return;
      if (e.key === 'Backspace') {
        for (let i = slots.length - 1; i >= 0; i--) {
          if (slots[i] !== null) { kosongkan(i); break; }
        }
        e.preventDefault();
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        const ch = e.key.toUpperCase();
        for (let i = 0; i < letters.length; i++) {
          if (!letters[i].used && letters[i].ch === ch) { pilih(i); break; }
        }
      }
    }
    document.addEventListener('keydown', onKey);

    // ----- kontrol panel -----
    function parseWords(v) {
      const list = v.split(/[,\s]+/)
        .map(function (w) { return w.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 9); })
        .filter(function (w) { return w.length >= 2; })
        .slice(0, 5);
      return list.length ? list : ['UNITY', 'PROGRAM'];
    }
    root.querySelectorAll('[data-f]').forEach(function (inp) {
      const key = inp.getAttribute('data-f');
      inp.addEventListener('input', function () {
        if (key === 'words') {
          cfg.words = parseWords(inp.value);
          total = 0; idx = 0; go('Menu');
          return;
        }
        cfg[key] = parseInt(inp.value, 10);
        root.querySelector('[data-o="' + key + '"]').textContent = inp.value;
        if (key === 'bobot') { total = 0; idx = 0; go('Menu'); }
        else if (screen === 'Hasil') go('Hasil');
      });
    });
    root.querySelector('[data-act="reset"]').addEventListener('click', function () {
      total = 0; idx = 0; go('Menu');
    });

    go('Menu');

    return {
      destroy: function () {
        clearTimers();
        document.removeEventListener('keydown', onKey);
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  global.SK = { createWordGame: createWordGame, mountInspector: mountInspector, mountSceneMap: mountSceneMap };
})(window);
