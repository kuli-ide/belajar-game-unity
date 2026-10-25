/* Aplikasi: routing berbasis hash, render pelajaran, kuis, dan progres (disimpan di localStorage). */
(function () {
  'use strict';

  const STORE_KEY = 'bgu-progress-v1';
  const THEME_KEY = 'bgu-theme';
  const XP_QUIZ = 10;
  const XP_PER_LEVEL = 150;

  const main = document.getElementById('main');
  let state = { done: {}, quiz: {} };
  let playground = null;
  let skInstances = [];

  // ---------- penyimpanan ----------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state.done = parsed.done || {};
        state.quiz = parsed.quiz || {};
      }
    } catch (e) { /* localStorage bisa tidak tersedia, aplikasi tetap jalan */ }
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  // ---------- util teks ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fmt(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((#\/[\w\/-]*)\)/g, '<a href="$2">$1</a>');
  }

  // Penyorot sintaks C# sederhana
  const KW = 'using|public|private|protected|class|void|new|if|else|return|static|bool|int|float|string|foreach|for|while|true|false|null|this|base|abstract|virtual|override|const|var|yield|break|continue|switch|case|default|get|set|is|as';
  const TY = 'MonoBehaviour|GameObject|Transform|Rigidbody2D|Collider2D|Vector2|Vector3|KeyCode|Input|Debug|Mathf|Time|SceneManager|UnityWebRequest|IEnumerator|TMP_Text|Button|Action|Random|Color|QuestionData|JurusanData|GameData|ScriptableObject|Physics2D|LayerMask|SpriteRenderer|JsonUtility|AudioClip|AudioSource|List|Text|Application|GameObject|FlightPriceList|Interactable|NPCGuruPiket|Result';
  const TOKEN = new RegExp(
    '(\\/\\/[^\\n]*)' +                                       // 1 komentar
    '|("(?:[^"\\\\\\n]|\\\\.)*")' +                           // 2 string
    '|(\\[[A-Z][A-Za-z]*(?:\\([^)\\n]*\\))?\\])' +            // 3 atribut
    '|\\b(' + KW + ')\\b' +                                   // 4 kata kunci
    '|\\b(' + TY + ')\\b' +                                   // 5 tipe
    '|\\b(\\d+(?:\\.\\d+)?f?)\\b', 'g');                      // 6 angka

  function highlight(code) {
    return esc(code).replace(TOKEN, function (m, c, s, a, k, t, n) {
      if (c) return '<span class="tk-c">' + c + '</span>';
      if (s) return '<span class="tk-s">' + s + '</span>';
      if (a) return '<span class="tk-a">' + a + '</span>';
      if (k) return '<span class="tk-k">' + k + '</span>';
      if (t) return '<span class="tk-t">' + t + '</span>';
      if (n) return '<span class="tk-n">' + n + '</span>';
      return m;
    });
  }

  // ---------- XP ----------
  function quizCount(lessonId) {
    const q = state.quiz[lessonId] || {};
    return Object.keys(q).filter(function (k) { return q[k]; }).length;
  }
  function totalXP() {
    return LESSONS.reduce(function (sum, l) {
      return sum + (state.done[l.id] ? l.xp : 0) + quizCount(l.id) * XP_QUIZ;
    }, 0);
  }
  function updateXP() {
    const xp = totalXP();
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const into = xp % XP_PER_LEVEL;
    document.getElementById('xpLevel').textContent = 'Level ' + level;
    document.getElementById('xpText').textContent = into + '/' + XP_PER_LEVEL + ' XP';
    document.getElementById('xpFill').style.width = (into / XP_PER_LEVEL * 100) + '%';
    document.getElementById('xpBar').setAttribute('aria-valuenow', String(into));
  }

  // ---------- helper pelajaran ----------
  function nextLesson() {
    return LESSONS.find(function (l) { return !state.done[l.id]; }) || null;
  }
  function metaPills(l) {
    return '<span class="pill">' + l.minutes + ' menit</span><span class="pill">' + l.xp + ' XP</span>';
  }

  // ---------- render block ----------
  function renderBlock(b, i) {
    switch (b.type) {
      case 'h': return '<h2>' + fmt(b.text) + '</h2>';
      case 'p': return '<p>' + fmt(b.text) + '</p>';
      case 'steps':
        return '<ol class="steps">' + b.items.map(function (t) { return '<li><span>' + fmt(t) + '</span></li>'; }).join('') + '</ol>';
      case 'note':
        return '<aside class="note ' + (b.kind || '') + '"><strong>' + esc(b.title || '') + '</strong><p>' + fmt(b.text) + '</p></aside>';
      case 'table':
        return '<div class="table-wrap wide"><table><thead><tr>' +
          b.head.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') +
          '</tr></thead><tbody>' +
          b.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + fmt(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
          '</tbody></table></div>';
      case 'tree':
        return '<pre class="tree" tabindex="0">' + esc(b.text) + '</pre>';
      case 'flow':
        var stepNo = 0;
        return '<figure class="flow wide" style="margin-inline:0">' +
          (b.title ? '<figcaption class="flow-title">' + esc(b.title) + '</figcaption>' : '') +
          '<ol class="flow-list">' + b.items.map(function (it) {
            if (typeof it === 'string') return '<li class="flow-step"><span class="flow-n">' + (++stepNo) + '</span><span>' + fmt(it) + '</span></li>';
            return '<li class="flow-step flow-decision"><span class="flow-n">?</span><div><strong>' + fmt(it.decision) + '</strong>' +
              '<div class="flow-branch no">' + fmt(it.no) + '</div><div class="flow-branch yes">' + fmt(it.yes) + '</div></div></li>';
          }).join('') + '</ol>' +
          (b.caption ? '<p class="flow-caption">' + fmt(b.caption) + '</p>' : '') + '</figure>';
      case 'code':
        return '<figure class="code wide" style="margin-inline:0"><div class="code-bar"><span>' + esc(b.file || 'C#') + '</span>' +
          '<button class="copy" type="button">Salin</button></div>' +
          '<pre tabindex="0"><code>' + highlight(b.code) + '</code></pre></figure>';
      case 'playground':
        return '<div class="wide" data-mount="playground"></div>';
      case 'wordgame':
        return '<div class="wide" data-mount="wordgame"></div>';
      case 'inspector':
        return '<div class="wide" data-mount="inspector" data-block="' + i + '"></div>';
      case 'scenemap':
        return '<div class="wide" data-mount="scenemap" data-block="' + i + '"></div>';
      case 'quiz':
        return '<div class="quiz" data-mount="quiz" data-block="' + i + '"></div>';
      default: return '';
    }
  }

  // ---------- kuis ----------
  function mountQuiz(mount, lesson, block) {
    block.questions.forEach(function (q, qi) {
      const fs = document.createElement('fieldset');
      fs.className = 'quiz-q';
      fs.innerHTML =
        '<legend>Soal ' + (qi + 1) + '</legend>' +
        '<p class="q">' + fmt(q.q) + '</p>' +
        '<div class="opts">' + q.options.map(function (o, oi) {
          return '<button type="button" class="opt" data-i="' + oi + '">' + fmt(o) + '</button>';
        }).join('') + '</div>' +
        '<p class="fb" role="status" aria-live="polite"></p>';
      mount.appendChild(fs);

      const fb = fs.querySelector('.fb');
      const opts = Array.prototype.slice.call(fs.querySelectorAll('.opt'));

      function lock() {
        opts.forEach(function (b) { b.disabled = true; });
      }
      function showSolved() {
        opts[q.answer].classList.add('ok');
        lock();
        fb.className = 'fb ok';
        fb.textContent = 'Benar. ' + q.explain;
      }

      if (state.quiz[lesson.id] && state.quiz[lesson.id][qi]) showSolved();

      opts.forEach(function (btn, oi) {
        btn.addEventListener('click', function () {
          if (oi === q.answer) {
            state.quiz[lesson.id] = state.quiz[lesson.id] || {};
            const first = !state.quiz[lesson.id][qi];
            state.quiz[lesson.id][qi] = true;
            saveState();
            showSolved();
            if (first) fb.textContent = 'Benar, +' + XP_QUIZ + ' XP. ' + q.explain;
            updateXP();
          } else {
            btn.classList.add('no');
            btn.disabled = true;
            fb.className = 'fb no';
            fb.textContent = 'Belum tepat. Pilih jawaban lain.';
          }
        });
      });
    });
  }

  // ---------- daftar pelajaran (sidebar) ----------
  function renderToc(activeId) {
    return '<details class="toc"><summary>Daftar pelajaran</summary>' +
      '<p class="toc-title">Peta belajar</p><ol>' +
      LESSONS.map(function (l, i) {
        return groupHeading(l, i, 'toc-group', 'span') + '<li><a href="#/belajar/' + l.id + '"' + (l.id === activeId ? ' aria-current="page"' : '') + '>' +
          '<span class="n">' + lessonNo(l) + '</span><span>' + esc(l.title) + '</span>' +
          (state.done[l.id] ? '<span class="chk" aria-label="selesai">✓</span>' : '') + '</a></li>';
      }).join('') + '</ol></details>';
  }

  // ---------- kelompok pelajaran ----------
  // Pelajaran dikelompokkan menjadi Level. Pelajaran tanpa properti `group` masuk Level 1.
  // Level ditentukan oleh urutan kemunculan group di array LESSONS.
  const DEFAULT_GROUP = 'Dasar Unity 2D: game sekolah';
  const LEVEL_INFO = {
    'Dasar Unity 2D: game sekolah': 'Fondasi: gerak dan lompat, trigger, dialog NPC, pindah scene, kuis, membaca error, dan GDD.',
    'Game Susun Kata': 'Proyek lengkap: lima scene, satu GameManager, demo yang bisa dimainkan, dan build.'
  };
  function groupOf(l) { return l.group || DEFAULT_GROUP; }
  function levelList() {
    const order = [];
    LESSONS.forEach(function (l) { if (order.indexOf(groupOf(l)) < 0) order.push(groupOf(l)); });
    return order;
  }
  function levelNo(l) { return levelList().indexOf(groupOf(l)) + 1; }
  function inLevel(l) { return LESSONS.filter(function (x) { return groupOf(x) === groupOf(l); }); }
  function lessonNo(l) { return levelNo(l) + '.' + (inLevel(l).indexOf(l) + 1); }
  function groupHeading(l, i, cls, tag) {
    if (i > 0 && groupOf(LESSONS[i - 1]) === groupOf(l)) return '';
    const lv = levelNo(l);
    if (cls === 'toc-group') {
      return '<li class="toc-group"><span>Level ' + lv + ' · ' + esc(groupOf(l)) + '</span></li>';
    }
    const items = inLevel(l);
    const done = items.filter(function (x) { return state.done[x.id]; }).length;
    return '<li class="level-group"><div class="lg-top"><span class="lg-tag">Level ' + lv + '</span>' +
      '<' + tag + '>' + esc(groupOf(l)) + '</' + tag + '>' +
      '<span class="pill lg-prog">' + done + '/' + items.length + ' selesai</span></div>' +
      (LEVEL_INFO[groupOf(l)] ? '<p class="lg-info">' + esc(LEVEL_INFO[groupOf(l)]) + '</p>' : '') + '</li>';
  }

  // ---------- widget Susun Kata ----------
  function mountSk(lesson) {
    if (!window.SK) return;
    main.querySelectorAll('[data-mount="wordgame"]').forEach(function (m) {
      skInstances.push(window.SK.createWordGame(m));
    });
    main.querySelectorAll('[data-mount="inspector"], [data-mount="scenemap"]').forEach(function (m) {
      const b = lesson.blocks[parseInt(m.getAttribute('data-block'), 10)];
      if (b.type === 'inspector') window.SK.mountInspector(m, b); else window.SK.mountSceneMap(m, b);
    });
  }

  // ---------- halaman ----------
  function teardown() {
    if (playground) { playground.destroy(); playground = null; }
    skInstances.forEach(function (g) { g.destroy(); });
    skInstances = [];
  }

  function renderHome() {
    document.title = 'Belajar Game Unity';
    const next = nextLesson();
    const first = LESSONS[0];

    let cta;
    if (!next) {
      cta = '<a class="btn" href="#/belajar/' + first.id + '">Ulangi dari awal</a>' +
            '<span class="cta-note">Semua pelajaran sudah selesai. Kerja bagus!</span>';
    } else if (next.id === first.id && !state.done[first.id] && totalXP() === 0) {
      cta = '<a class="btn" href="#/belajar/' + first.id + '">Mulai belajar</a>' +
            '<span class="cta-note">' + LESSONS.length + ' pelajaran, sekitar ' +
            LESSONS.reduce(function (s, l) { return s + l.minutes; }, 0) + ' menit.</span>';
    } else {
      cta = '<a class="btn" href="#/belajar/' + next.id + '">Lanjutkan: ' + esc(next.title) + '</a>';
    }

    main.innerHTML =
      '<div class="wrap">' +
        '<section class="hero" aria-labelledby="judul">' +
          '<h1 id="judul">Bikin game 2D di Unity. Coba langsung di sini.</h1>' +
          '<p class="lede">Ubah kecepatan, kekuatan lompat, dan gravitasi pada player di bawah ini. Nilainya sama dengan field di Inspector Unity.</p>' +
          '<div data-mount="playground"></div>' +
          '<div class="cta-row">' + cta + '</div>' +
        '</section>' +
        '<section class="map" aria-labelledby="peta">' +
          '<h2 id="peta">Peta belajar</h2>' +
          '<p>Kerjakan berurutan, atau langsung ke bagian yang kamu butuhkan. Jawaban kuis yang benar menambah XP.</p>' +
          '<ol class="levels">' +
            LESSONS.map(function (l, i) {
              const done = !!state.done[l.id];
              const isNext = next && next.id === l.id;
              const st = done ? 'done' : (isNext ? 'next' : 'open');
              return groupHeading(l, i, 'level-group', 'h3') + '<li><a class="level" data-state="' + st + '" href="#/belajar/' + l.id + '">' +
                '<span class="lv-top"><span class="lv-n">' + lessonNo(l) + '</span>' +
                '<span class="lv-flag">' + (done ? 'Selesai ✓' : (isNext ? 'Berikutnya' : '')) + '</span></span>' +
                '<span class="lv-t">' + esc(l.title) + '</span>' +
                '<span class="lv-s">' + esc(l.summary) + '</span>' +
                '<span class="lv-meta">' + metaPills(l) + '</span></a></li>';
            }).join('') +
          '</ol>' +
        '</section>' +
      '</div>';

    mountPlayground();
  }

  function renderLesson(lesson) {
    document.title = lesson.title + ' | Belajar Game Unity';
    const idx = LESSONS.indexOf(lesson);
    const prev = LESSONS[idx - 1];
    const nxt = LESSONS[idx + 1];
    const done = !!state.done[lesson.id];

    main.innerHTML =
      '<div class="wrap lesson-grid">' +
        '<nav aria-label="Daftar pelajaran">' + renderToc(lesson.id) + '</nav>' +
        '<article class="prose">' +
          '<header class="lesson-head">' +
            '<div class="crumb"><a href="#/">Beranda</a> / Level ' + levelNo(lesson) + ' · Pelajaran ' + (inLevel(lesson).indexOf(lesson) + 1) + ' dari ' + inLevel(lesson).length + '</div>' +
            '<h1>' + esc(lesson.title) + '</h1>' +
            '<p class="lesson-sum">' + esc(lesson.summary) + '</p>' +
            '<div class="lv-meta">' + metaPills(lesson) + '</div>' +
          '</header>' +
          lesson.blocks.map(renderBlock).join('') +
          '<div class="lesson-foot">' +
            (prev ? '<a class="btn ghost" href="#/belajar/' + prev.id + '">Sebelumnya</a>' : '') +
            '<button class="btn ghost" id="doneBtn" type="button" aria-pressed="' + done + '">' +
              (done ? 'Selesai ✓ (klik untuk batalkan)' : 'Tandai selesai (+' + lesson.xp + ' XP)') + '</button>' +
            '<span class="spacer"></span>' +
            (nxt ? '<a class="btn" href="#/belajar/' + nxt.id + '">Berikutnya: ' + esc(nxt.title) + '</a>'
                 : '<a class="btn" href="#/">Kembali ke peta</a>') +
          '</div>' +
        '</article>' +
      '</div>';

    // Sidebar terbuka otomatis di layar lebar
    const toc = main.querySelector('details.toc');
    if (toc && window.matchMedia('(min-width: 1000px)').matches) toc.open = true;

    main.querySelectorAll('[data-mount="quiz"]').forEach(function (m) {
      mountQuiz(m, lesson, lesson.blocks[parseInt(m.getAttribute('data-block'), 10)]);
    });
    mountPlayground();
    mountSk(lesson);

    document.getElementById('doneBtn').addEventListener('click', function () {
      state.done[lesson.id] = !state.done[lesson.id];
      saveState();
      updateXP();
      renderLessonKeepScroll(lesson);
    });
  }

  function renderLessonKeepScroll(lesson) {
    const y = window.scrollY;
    teardown();
    renderLesson(lesson);
    window.scrollTo(0, y);
    const btn = document.getElementById('doneBtn');
    if (btn) btn.focus({ preventScroll: true });
  }

  function mountPlayground() {
    const mount = main.querySelector('[data-mount="playground"]');
    if (mount && window.createPlayground) playground = window.createPlayground(mount);
  }

  // ---------- routing ----------
  function route() {
    teardown();
    const m = location.hash.replace(/^#\/?/, '').match(/^belajar\/([\w-]+)$/);
    const lesson = m && LESSONS.find(function (l) { return l.id === m[1]; });
    if (lesson) renderLesson(lesson); else renderHome();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    updateXP();
  }

  // ---------- salin kode ----------
  document.addEventListener('click', function (e) {
    const btn = e.target.closest && e.target.closest('.copy');
    if (!btn) return;
    const text = btn.closest('.code').querySelector('pre').textContent;
    function done() {
      btn.textContent = 'Tersalin';
      setTimeout(function () { btn.textContent = 'Salin'; }, 1600);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { btn.textContent = 'Gagal'; }
      ta.remove();
    }
  });

  // ---------- tema ----------
  const themeBtn = document.getElementById('themeBtn');
  function isDark() {
    const t = document.documentElement.dataset.theme;
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncThemeBtn() { themeBtn.textContent = isDark() ? 'Mode terang' : 'Mode gelap'; }
  themeBtn.addEventListener('click', function () {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    syncThemeBtn();
    window.dispatchEvent(new Event('themechange'));
  });

  document.getElementById('resetBtn').addEventListener('click', function () {
    if (!window.confirm('Hapus semua progres belajar di browser ini?')) return;
    state = { done: {}, quiz: {} };
    saveState();
    route();
  });

  // ---------- mulai ----------
  loadState();
  syncThemeBtn();
  window.addEventListener('hashchange', route);
  route();
})();
