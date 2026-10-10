/* Simulasi platformer mini.
   Meniru logika PlayerController2D di Unity: Move Speed, Jump Force, Gravity Scale,
   dan deteksi tanah lewat lingkaran kecil di kaki (Physics2D.OverlapCircle). */
(function (global) {
  'use strict';

  const PPU = 40;            // piksel per unit
  const VW = 960, VH = 320;  // ukuran kanvas (24 x 8 unit)
  const WORLD_W = 24;
  const GRAVITY = 9.81;
  const STEP = 1 / 120;
  const EPS = 1e-4;
  const GROUND_RADIUS = 0.15;

  const SOLIDS = [
    { x: 0,    y: 7,   w: 24,  h: 1 },
    { x: 5,    y: 5.2, w: 3,   h: 0.4 },
    { x: 10,   y: 3.8, w: 3,   h: 0.4 },
    { x: 15,   y: 5.2, w: 3,   h: 0.4 },
    { x: 19.5, y: 3.8, w: 3.5, h: 0.4 }
  ];
  const COIN_POS = [[6.5, 4.5], [11.5, 3.1], [16.5, 4.5], [21.2, 3.1], [13.5, 6.35]];
  const NPC  = { x: 1.6,  y: 5.9, w: 0.8, h: 1.1 };
  const DOOR = { x: 22.4, y: 5.4, w: 1.1, h: 1.6 };
  const START = { x: 3.6, y: 6 };

  function overlap(a, b) {
    return a.x < b.x + b.w - EPS && a.x + a.w > b.x + EPS &&
           a.y < b.y + b.h - EPS && a.y + a.h > b.y + EPS;
  }

  function circleHitsSolid(cx, cy, r) {
    return SOLIDS.some(function (s) {
      const nx = Math.max(s.x, Math.min(cx, s.x + s.w));
      const ny = Math.max(s.y, Math.min(cy, s.y + s.h));
      const dx = cx - nx, dy = cy - ny;
      return dx * dx + dy * dy <= r * r;
    });
  }

  function create(container) {
    const root = document.createElement('div');
    root.className = 'pg';
    root.innerHTML =
      '<div class="pg-stage">' +
        '<canvas class="pg-canvas" width="' + VW + '" height="' + VH + '" tabindex="0" ' +
          'aria-label="Simulasi game platformer. Klik, lalu gerakkan dengan panah kiri, panah kanan, dan spasi."></canvas>' +
        '<div class="pg-touch">' +
          '<button class="btn small" type="button" data-k="left" aria-label="Kiri">Kiri</button>' +
          '<button class="btn small" type="button" data-k="right" aria-label="Kanan">Kanan</button>' +
          '<button class="btn small" type="button" data-k="jump">Lompat</button>' +
          '<button class="btn small" type="button" data-k="act">E</button>' +
        '</div>' +
      '</div>' +
      '<div class="pg-panel">' +
        '<div class="pg-sliders">' +
          slider('moveSpeed', 'Move Speed', 1, 12, 0.5, 6) +
          slider('jumpForce', 'Jump Force', 4, 20, 0.5, 12) +
          slider('gravity', 'Gravity Scale', 0.5, 5, 0.1, 3) +
          '<p class="pg-hint">Klik game, lalu tekan ← → untuk jalan dan Spasi untuk lompat. Tekan E di dekat NPC atau pintu.</p>' +
        '</div>' +
        '<div class="pg-side">' +
          '<label class="pg-check"><input type="checkbox" data-opt="bug"> <span>Ground Layer = Nothing (simulasi bug)</span></label>' +
          '<label class="pg-check"><input type="checkbox" data-opt="gizmo" checked> <span>Tampilkan lingkaran groundCheck</span></label>' +
          '<p class="pg-bugnote" aria-live="polite"></p>' +
          '<dl class="pg-read">' +
            '<div><dt>isGrounded</dt><dd data-r="grounded">true</dd></div>' +
            '<div><dt>velocity.y</dt><dd data-r="vy">0.0</dd></div>' +
            '<div><dt>koin</dt><dd data-r="coins">0/' + COIN_POS.length + '</dd></div>' +
          '</dl>' +
          '<button class="btn ghost small" type="button" data-act="reset">Mulai ulang</button>' +
        '</div>' +
      '</div>';
    container.appendChild(root);

    function slider(name, label, min, max, step, val) {
      return '<div class="pg-slider"><label for="pg-' + name + '"><span>' + label + '</span>' +
        '<output data-o="' + name + '">' + val + '</output></label>' +
        '<input id="pg-' + name + '" type="range" data-s="' + name + '" min="' + min + '" max="' + max +
        '" step="' + step + '" value="' + val + '"></div>';
    }

    const canvas = root.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = VW * dpr;
    canvas.height = VH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cfg = { moveSpeed: 6, jumpForce: 12, gravity: 3, bug: false, gizmo: true };
    const keys = { left: false, right: false };
    const p = { x: START.x, y: START.y, w: 0.8, h: 1, vx: 0, vy: 0, face: 1 };
    let coins = COIN_POS.map(function () { return true; });
    let grounded = true;
    let jumpQ = false;
    let focused = false;
    let speech = null;
    let colors = {};
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let acc = 0;
    let lastReadout = 0;

    const $ = function (sel) { return root.querySelector(sel); };
    const readGrounded = $('[data-r="grounded"]');
    const readVy = $('[data-r="vy"]');
    const readCoins = $('[data-r="coins"]');
    const bugNote = $('.pg-bugnote');

    function refreshColors() {
      const cs = getComputedStyle(root);
      const v = function (n) { return cs.getPropertyValue(n).trim(); };
      colors = {
        sky: v('--pg-sky'), grid: v('--pg-grid'), solid: v('--pg-solid'), top: v('--pg-top'),
        line: v('--pg-line'), player: v('--pg-player'), npc: v('--pg-npc'), door: v('--pg-door'),
        coin: v('--pg-coin'), good: v('--pg-good'), bad: v('--pg-bad'), ink: v('--pg-ink'),
        bubble: v('--pg-bubble')
      };
    }
    refreshColors();
    window.addEventListener('themechange', refreshColors);

    function reset() {
      p.x = START.x; p.y = START.y; p.vx = 0; p.vy = 0; p.face = 1;
      coins = COIN_POS.map(function () { return true; });
      speech = null;
    }

    function say(text) { speech = { text: text, until: performance.now() + 3200 }; }

    function near(o) {
      const px = p.x + p.w / 2, ox = o.x + o.w / 2;
      return Math.abs(px - ox) < 1.7 && Math.abs((p.y + p.h) - (o.y + o.h)) < 1.2;
    }

    function act() {
      if (near(NPC)) say('Halo! Jurusan mana yang ingin kamu datangi?');
      else if (near(DOOR)) say('Pintu kelas: di game asli, di sini scene kelas dimuat.');
    }

    // ---------- fisika ----------
    function step(dt) {
      const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      p.vx = dir * cfg.moveSpeed;
      if (dir) p.face = dir;

      // Sama seperti Physics2D.OverlapCircle(groundCheck.position, radius, groundLayer)
      grounded = cfg.bug ? false : circleHitsSolid(p.x + p.w / 2, p.y + p.h, GROUND_RADIUS);

      if (jumpQ) {
        jumpQ = false;
        if (grounded) p.vy = -cfg.jumpForce;
      }

      p.vy += GRAVITY * cfg.gravity * dt;
      if (p.vy > 28) p.vy = 28;

      p.x += p.vx * dt;
      if (p.x < 0) p.x = 0;
      if (p.x + p.w > WORLD_W) p.x = WORLD_W - p.w;
      SOLIDS.forEach(function (s) {
        if (overlap(p, s)) {
          if (p.vx > 0) p.x = s.x - p.w;
          else if (p.vx < 0) p.x = s.x + s.w;
        }
      });

      p.y += p.vy * dt;
      SOLIDS.forEach(function (s) {
        if (overlap(p, s)) {
          if (p.vy > 0) { p.y = s.y - p.h; p.vy = 0; }
          else if (p.vy < 0) { p.y = s.y + s.h; p.vy = 0; }
        }
      });
      if (p.y > 12) { p.x = START.x; p.y = START.y; p.vy = 0; }

      coins.forEach(function (alive, i) {
        if (!alive) return;
        const c = COIN_POS[i];
        if (c[0] > p.x - 0.22 && c[0] < p.x + p.w + 0.22 && c[1] > p.y - 0.22 && c[1] < p.y + p.h + 0.22) {
          coins[i] = false;
        }
      });
    }

    // ---------- gambar ----------
    function rect(x, y, w, h) { ctx.fillRect(x * PPU, y * PPU, w * PPU, h * PPU); }
    function frame(x, y, w, h) { ctx.strokeRect(x * PPU, y * PPU, w * PPU, h * PPU); }
    // Di layar sempit kanvas diperkecil, jadi teks diperbesar agar tetap terbaca.
    let K = 1;
    function label(text, cx, y) {
      ctx.font = '600 ' + Math.round(12 * K) + 'px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = colors.ink;
      ctx.fillText(text, cx * PPU, y * PPU);
    }

    function draw() {
      const c = colors;
      K = Math.max(1, Math.min(2.4, (10 * VW) / (12 * (canvas.clientWidth || VW))));
      ctx.clearRect(0, 0, VW, VH);
      ctx.fillStyle = c.sky; ctx.fillRect(0, 0, VW, VH);

      ctx.strokeStyle = c.grid; ctx.lineWidth = 1; ctx.beginPath();
      for (let x = 1; x < WORLD_W; x++) { ctx.moveTo(x * PPU + 0.5, 0); ctx.lineTo(x * PPU + 0.5, VH); }
      for (let y = 1; y < 8; y++) { ctx.moveTo(0, y * PPU + 0.5); ctx.lineTo(VW, y * PPU + 0.5); }
      ctx.stroke();

      ctx.lineWidth = 2; ctx.strokeStyle = c.line;
      SOLIDS.forEach(function (s) {
        ctx.fillStyle = c.solid; rect(s.x, s.y, s.w, s.h);
        ctx.fillStyle = c.top; rect(s.x, s.y, s.w, Math.min(0.2, s.h));
        frame(s.x, s.y, s.w, s.h);
      });

      // pintu
      ctx.fillStyle = c.door; rect(DOOR.x, DOOR.y, DOOR.w, DOOR.h); frame(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
      ctx.fillStyle = c.coin; ctx.beginPath();
      ctx.arc((DOOR.x + DOOR.w - 0.22) * PPU, (DOOR.y + 0.85) * PPU, 4, 0, Math.PI * 2); ctx.fill();
      label('Pintu', DOOR.x + DOOR.w / 2, DOOR.y - 0.2);

      // NPC
      ctx.fillStyle = c.npc; rect(NPC.x, NPC.y, NPC.w, NPC.h); frame(NPC.x, NPC.y, NPC.w, NPC.h);
      ctx.fillStyle = '#ffffff'; rect(NPC.x + 0.15, NPC.y + 0.2, 0.2, 0.2); rect(NPC.x + 0.45, NPC.y + 0.2, 0.2, 0.2);
      ctx.fillStyle = '#10233f'; rect(NPC.x + 0.22, NPC.y + 0.28, 0.1, 0.1); rect(NPC.x + 0.52, NPC.y + 0.28, 0.1, 0.1);
      label('Guru Piket', NPC.x + NPC.w / 2, NPC.y - 0.2);

      // koin
      coins.forEach(function (alive, i) {
        if (!alive) return;
        ctx.fillStyle = c.coin; ctx.strokeStyle = c.line; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(COIN_POS[i][0] * PPU, COIN_POS[i][1] * PPU, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });

      // player
      ctx.lineWidth = 2; ctx.strokeStyle = c.line;
      ctx.fillStyle = c.player; rect(p.x, p.y, p.w, p.h); frame(p.x, p.y, p.w, p.h);
      const ex = p.face > 0 ? p.x + 0.46 : p.x + 0.12;
      ctx.fillStyle = '#ffffff'; rect(ex, p.y + 0.2, 0.22, 0.22);
      ctx.fillStyle = '#10233f'; rect(ex + (p.face > 0 ? 0.1 : 0.02), p.y + 0.27, 0.1, 0.1);

      // groundCheck
      if (cfg.gizmo) {
        const gx = (p.x + p.w / 2) * PPU, gy = (p.y + p.h) * PPU;
        ctx.strokeStyle = cfg.bug ? c.bad : (grounded ? c.good : c.bad);
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(gx, gy, GROUND_RADIUS * PPU, 0, Math.PI * 2); ctx.stroke();
      }

      // petunjuk "E"
      const canAct = near(NPC) || near(DOOR);
      if (canAct) {
        const size = 22 * K;
        const bx = (p.x + p.w / 2) * PPU - size / 2, by = p.y * PPU - size - 6;
        ctx.fillStyle = c.coin; ctx.strokeStyle = c.line; ctx.lineWidth = 2;
        ctx.fillRect(bx, by, size, size); ctx.strokeRect(bx, by, size, size);
        ctx.fillStyle = '#10233f'; ctx.font = '700 ' + Math.round(14 * K) + 'px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
        ctx.fillText('E', bx + size / 2, by + size * 0.73);
      }

      // gelembung ucapan
      if (speech && performance.now() < speech.until) {
        ctx.font = '600 ' + Math.round(13 * K) + 'px "Bricolage Grotesque", system-ui, sans-serif';
        const tw = ctx.measureText(speech.text).width + 24 * K;
        const bh = 30 * K;
        let bx = (p.x + p.w / 2) * PPU - tw / 2;
        bx = Math.max(6, Math.min(VW - tw - 6, bx));
        const by = Math.max(6, p.y * PPU - bh - 40);
        ctx.fillStyle = c.bubble; ctx.strokeStyle = c.line; ctx.lineWidth = 2;
        ctx.fillRect(bx, by, tw, bh); ctx.strokeRect(bx, by, tw, bh);
        ctx.fillStyle = '#10233f'; ctx.textAlign = 'left';
        ctx.fillText(speech.text, bx + 12 * K, by + bh * 0.67);
      }

      // ajakan klik
      if (!focused) {
        ctx.font = '700 ' + Math.round(15 * K) + 'px "Bricolage Grotesque", system-ui, sans-serif';
        const msg = 'Klik di sini untuk mulai bermain';
        const tw = ctx.measureText(msg).width + 32 * K;
        const bh = 34 * K;
        const bx = (VW - tw) / 2, by = 20;
        ctx.fillStyle = c.coin; ctx.strokeStyle = c.line; ctx.lineWidth = 2;
        ctx.fillRect(bx, by, tw, bh); ctx.strokeRect(bx, by, tw, bh);
        ctx.fillStyle = '#10233f'; ctx.textAlign = 'center';
        ctx.fillText(msg, VW / 2, by + bh * 0.65);
      }
    }

    function updateReadout(now) {
      if (now - lastReadout < 90) return;
      lastReadout = now;
      readGrounded.textContent = String(grounded);
      readGrounded.className = grounded ? 'ok' : 'no';
      readVy.textContent = p.vy.toFixed(1);
      const got = coins.filter(function (a) { return !a; }).length;
      readCoins.textContent = got + '/' + COIN_POS.length;
      bugNote.textContent = cfg.bug
        ? 'OverlapCircle tidak menemukan apa pun, jadi isGrounded selalu false dan Jump tidak jalan.'
        : '';
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!visible) { last = now; return; }
      acc += Math.min((now - last) / 1000, 0.05);
      last = now;
      while (acc >= STEP) { step(STEP); acc -= STEP; }
      draw();
      updateReadout(now);
    }
    raf = requestAnimationFrame(loop);

    // ---------- input ----------
    canvas.addEventListener('focus', function () { focused = true; });
    canvas.addEventListener('blur', function () { focused = false; keys.left = keys.right = false; });
    canvas.addEventListener('pointerdown', function () { canvas.focus(); });

    canvas.addEventListener('keydown', function (e) {
      switch (e.code) {
        case 'ArrowLeft': case 'KeyA': keys.left = true; break;
        case 'ArrowRight': case 'KeyD': keys.right = true; break;
        case 'Space': case 'ArrowUp': case 'KeyW': if (!e.repeat) jumpQ = true; break;
        case 'KeyE': if (!e.repeat) act(); break;
        default: return;
      }
      e.preventDefault();
    });
    canvas.addEventListener('keyup', function (e) {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    });

    root.querySelectorAll('.pg-touch [data-k]').forEach(function (btn) {
      const k = btn.getAttribute('data-k');
      function down(e) {
        e.preventDefault();
        if (k === 'left') keys.left = true;
        else if (k === 'right') keys.right = true;
        else if (k === 'jump') jumpQ = true;
        else act();
      }
      function up() { if (k === 'left') keys.left = false; if (k === 'right') keys.right = false; }
      btn.addEventListener('pointerdown', down);
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointerleave', up);
      btn.addEventListener('pointercancel', up);
    });

    root.querySelectorAll('input[data-s]').forEach(function (input) {
      input.addEventListener('input', function () {
        const name = input.getAttribute('data-s');
        cfg[name] = parseFloat(input.value);
        $('[data-o="' + name + '"]').textContent = input.value;
      });
    });
    root.querySelectorAll('input[data-opt]').forEach(function (input) {
      input.addEventListener('change', function () { cfg[input.getAttribute('data-opt')] = input.checked; });
    });
    $('[data-act="reset"]').addEventListener('click', reset);

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; });
      observer.observe(root);
    }

    return {
      destroy: function () {
        cancelAnimationFrame(raf);
        if (observer) observer.disconnect();
        window.removeEventListener('themechange', refreshColors);
        root.remove();
      }
    };
  }

  global.createPlayground = create;
})(window);
