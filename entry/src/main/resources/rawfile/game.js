/* 识字小乐园 - 游戏逻辑（字库数据在 data.js，样式在 style.css） */
(() => {
'use strict';

/* ============================================================
   数据：来自 data.js 的 window.HANZI_DATA（字库外置，家长可直接增删）
   ============================================================ */
if (!window.HANZI_DATA || !Array.isArray(window.HANZI_DATA.groups) || !window.HANZI_DATA.groups.length) {
  document.body.innerHTML =
    '<div style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;' +
    'justify-content:center;gap:12px;background:#FFF6E5;color:#a58d6f;font-size:20px;">' +
    '<div style="font-size:56px;">😳</div><div>字库数据加载失败了</div>' +
    '<div style="font-size:14px;color:#c9b8a0;">请重新安装应用后再试</div></div>';
  return;
}
const GROUPS = window.HANZI_DATA.groups;
const ALL_CHARS = GROUPS.flatMap(g => g.chars);

/* ================= 本地存储 ================= */
// 鸿蒙内嵌时：设置与进度走原生 Preferences（卸载重装不丢），轻微 UI 状态（hzk_last 等）仍用 localStorage；
// 浏览器直接打开时：全部回退 localStorage，方便开发调试。
const HAS_NATIVE = !!window.HanziNative;
const store = {
  get(k, d) {
    try {
      if (HAS_NATIVE && k === 'hzk_stats') {
        const raw = window.HanziNative.getProgress();
        return raw ? JSON.parse(raw) : d;
      }
      if (HAS_NATIVE && k === 'hzk_settings') {
        const raw = window.HanziNative.getSettings();
        return raw ? JSON.parse(raw) : d;
      }
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) { return d; }
  },
  set(k, v) {
    try {
      if (HAS_NATIVE && k === 'hzk_stats') { window.HanziNative.setProgress(JSON.stringify(v)); return; }
      if (HAS_NATIVE && k === 'hzk_settings') { window.HanziNative.setSettings(JSON.stringify(v)); return; }
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
};
// 一次性迁移：老版本进度存在 WebView localStorage 里，原生侧为空时搬上去
if (HAS_NATIVE) {
  const migrate = (localKey, nativeGet, nativeSet) => {
    try {
      const local = localStorage.getItem(localKey);
      if (local && !nativeGet()) nativeSet(local);
    } catch (e) {}
  };
  migrate('hzk_stats', () => window.HanziNative.getProgress(), v => window.HanziNative.setProgress(v));
  migrate('hzk_settings', () => window.HanziNative.getSettings(), v => window.HanziNative.setSettings(v));
}
let settings = Object.assign({ rate:'normal', hints:true, len:10, learnIcon:false }, store.get('hzk_settings', {}));
let stats = store.get('hzk_stats', {});           // { 字: { s:出现, f:一次答对, w:答错 } }
const saveSettings = () => store.set('hzk_settings', settings);
const saveStats = () => store.set('hzk_stats', stats);
const statOf = c => (stats[c] = stats[c] || { s:0, f:0, w:0 });
const isMastered = c => !!(stats[c] && stats[c].f >= 3);   // 连对 3 次算掌握

/* ================= 语音合成 ================= */
const RATES = { slow:0.75, normal:0.95, fast:1.1 };
const rate = () => RATES[settings.rate] || 0.95;
const Speech = {
  voice: null, zhFound: false,
  // 给中文人声打分：神经网络音(Natural/Online)最清晰，本地微软女声次之，
  // Google 网络音可能断续，男声对幼儿辨识稍弱
  score(v) {
    let s = 0;
    if (/zh[-_]CN/i.test(v.lang)) s += 4; else if (/^zh/i.test(v.lang)) s += 2;
    if (/natural|online/i.test(v.name)) s += 3;
    if (/xiaoxiao|xiaoyi|yunxi|yunyang|tingting|ting-ting|mei-jia|yaoyao|huihui|female|女/i.test(v.name)) s += 2;
    if (/kangkang|male|男/i.test(v.name)) s -= 2;
    if (/google/i.test(v.name) && !/natural/i.test(v.name)) s -= 1;
    return s;
  },
  zhVoices() {
    if (!('speechSynthesis' in window)) return [];
    return speechSynthesis.getVoices()
      .filter(v => /^zh/i.test(v.lang))
      .sort((a, b) => this.score(b) - this.score(a));
  },
  pick() {
    const zh = this.zhVoices();
    if (zh.length) this.zhFound = true;
    this.voice = (settings.voiceURI && zh.find(v => v.voiceURI === settings.voiceURI)) || zh[0] || null;
  },
  init() {
    if (!('speechSynthesis' in window)) return;
    this.pick();
    speechSynthesis.onvoiceschanged = () => { this.pick(); renderVoiceSeg(); };
  },
  warm() {   // 在用户手势里空读一句，解锁 iOS 的朗读权限
    if (!('speechSynthesis' in window)) return;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
  },
};
let sayTimer = null;
function say(parts) {
  const list = (Array.isArray(parts) ? parts : [parts]).map(p => (typeof p === 'string' ? { t:p } : p));
  // 鸿蒙原生 App 内嵌时：只要原生 TTS 桥存在就优先走它。
  // ArkWeb 里 window.speechSynthesis 对象可能存在但底层没有 TTS 引擎（出不了声），
  // 所以不能拿 'speechSynthesis' in window 做判断依据。
  if (window.HanziNative) {
    window.HanziNative.stop();
    // 智能拼接：上一段已带句读就不再补逗号，减少生硬停顿，朗读更连贯
    let text = '';
    list.forEach(o => {
      if (text && !/[！？。，,、.!?]$/.test(text)) text += '，';
      text += o.t;
    });
    const slowest = Math.min(...list.map(o => o.r || rate()));
    window.HanziNative.speak(text, Math.round(slowest * 100) / 100);
    return;
  }
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  clearTimeout(sayTimer);
  sayTimer = setTimeout(() => {
    list.forEach(o => {
      const u = new SpeechSynthesisUtterance(o.t);
      u.lang = 'zh-CN';
      if (Speech.voice) u.voice = Speech.voice;
      u.rate = o.r || rate();
      u.pitch = 1.0;                // 不抬高音调，保证咬字清楚
      speechSynthesis.speak(u);
    });
  }, 60);
}

/* ================= 音效（Web Audio 合成，无素材文件） ================= */
const AC = window.AudioContext || window.webkitAudioContext;
let actx = null;
function audio() {
  if (!AC) return null;
  if (!actx) actx = new AC();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, dur, type, vol, delay = 0, slideTo = null) {
  const ctx = audio(); if (!ctx) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + dur + 0.05);
}
const CHEER_SFX = [
  () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .14, 'triangle', .2, i * .08)),
  () => [587, 740, 880, 1175].forEach((f, i) => tone(f, .13, 'triangle', .18, i * .07)),
  () => [659, 784, 988, 1319].forEach((f, i) => tone(f, .15, 'sine', .18, i * .09)),
  () => { [523, 784].forEach((f, i) => tone(f, .18, 'triangle', .2, i * .1)); tone(1047, .25, 'sine', .15, .22); },
];
const SFX = {
  tap:     () => tone(600, .07, 'sine', .09, 0, 900),
  wrong:   () => { tone(300, .12, 'sine', .09, 0, 240); tone(240, .16, 'sine', .09, .1, 200); },
  win:     () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .16, 'triangle', .22, i * .12)),
  cheer:   () => CHEER_SFX[Math.floor(Math.random() * CHEER_SFX.length)](),
};

/* ================= 工具 ================= */
const $ = id => document.getElementById(id);
function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
const poolOf = id => (id === 'all' ? ALL_CHARS : (GROUPS.find(g => g.id === id) || GROUPS[0]).chars);
const groupName = id => (id === 'all' ? '全部汉字' : GROUPS.find(g => g.id === id).name);
function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
const SCREENS = { home:'screen-home', learn:'screen-learn', quiz:'screen-quiz', end:'screen-end' };
function showScreen(k) {
  Object.values(SCREENS).forEach(id => $(id).classList.remove('active'));
  $(SCREENS[k]).classList.add('active');
}

/* ================= 首页 ================= */
const ui = { mode: (store.get('hzk_last', {}) || {}).mode || 'learn' };

function renderHome() {
  document.querySelectorAll('.mode-card').forEach(b => b.classList.toggle('selected', b.dataset.mode === ui.mode));
  const grid = $('groupGrid');
  grid.innerHTML = '';
  const mk = (id, icon, name, color, pool) => {
    const b = document.createElement('button');
    b.className = 'group-card';
    b.style.borderColor = color;
    b.style.background = color + '22';
    const mastered = pool.filter(ch => isMastered(ch.c)).length;
    b.innerHTML = `<span class="g-icon">${icon}</span><b>${name}</b><small>⭐ ${mastered}/${pool.length}</small>`;
    b.addEventListener('click', () => {
      SFX.tap();
      store.set('hzk_last', { mode: ui.mode, group: id });
      ui.mode === 'learn' ? startLearn(id) : startQuiz(id);
    });
    grid.appendChild(b);
  };
  mk('all', '🌈', '全部混玩', '#8E7CC3', ALL_CHARS);
  GROUPS.forEach(g => mk(g.id, g.icon, g.name, g.color, g.chars));
}

function goHome() {
  if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch (e) {} }
  renderHome();
  showScreen('home');
}

/* ================= 认一认（字卡） ================= */
let learn = null;

function startLearn(id) {
  learn = { id, list: poolOf(id), i: 0 };
  $('learnTitle').textContent = '📖 ' + groupName(id);
  showScreen('learn');
  renderLearn();
}
function updateLearnIcon() {
  // 认一认默认只看汉字认字，图片提示按需点开，避免"看图猜字"
  const showIcon = !!settings.learnIcon;
  $('flashCard').classList.toggle('no-icon', !showIcon);
  const btn = $('btnLearnIcon');
  btn.textContent = showIcon ? '🙈' : '🖼️';
  btn.setAttribute('aria-label', showIcon ? '隐藏图片提示' : '显示图片提示');
}
function renderLearn() {
  const it = learn.list[learn.i];
  updateLearnIcon();
  $('fcEmoji').textContent = it.e;
  $('fcEmoji').classList.toggle('small', it.e.length > 2);
  $('fcChar').textContent = it.c;
  $('fcPinyin').textContent = it.p;
  $('fcWord').textContent = it.w ? '词语 · ' + it.w : '';
  $('learnCounter').textContent = (learn.i + 1) + ' / ' + learn.list.length;
  speakCard(it, false);
}
function speakCard(it, again) {
  const parts = again ? [{ t: '这是', r: rate() }] : [];
  parts.push({ t: it.c, r: rate() * 0.85 });
  if (it.w) parts.push({ t: it.w, r: rate() * 0.95 });
  if (!again) parts.push({ t: it.c, r: rate() * 0.85 });
  say(parts);
}

/* ================= 找一找（答题） ================= */
const LEADS = ['找出', '请找出', '找一找', '小朋友，找出'];
/* 答对反馈随机组合：夸奖语 + 吉祥物表情 + 气泡文案，避免每次都一样 */
const CHEERS = [
  { s:'答对啦！',           m:'🥳', b:'答对啦！🎉' },
  { s:'真棒！你真棒！',      m:'🤩', b:'真棒！👍' },
  { s:'太厉害啦！',          m:'😍', b:'太厉害了！' },
  { s:'好聪明呀！',          m:'🦄', b:'好聪明呀！' },
  { s:'完全正确！',          m:'🎉', b:'完全正确！✨' },
  { s:'了不起呀！',          m:'🌟', b:'了不起！' },
  { s:'你是识字小天才！',    m:'🏆', b:'小天才！👏' },
  { s:'哇，一下子就找到了！', m:'🐼', b:'哇！找到了！' },
];
const ENCOURAGE = ['没关系，再想一想', '别灰心，再试一次', '慢慢想，你可以的', '差一点点，再看看'];
const END_PERFECT = [
  { e:'🏆', t:'全对！你是识字小天才！', s:'哇！全对啦！你是识字小天才！' },
  { e:'🥇', t:'满分！太厉害了！', s:'满分！你真是太厉害啦！' },
  { e:'👑', t:'冠军就是你！', s:'全部答对！冠军就是你！' },
];
const END_GOOD = [
  { e:'🎉', t:'太棒了，继续加油！', s:'太棒啦！继续加油！' },
  { e:'🐼', t:'完成啦，真不错！', s:'完成啦！你真棒！' },
  { e:'🎈', t:'学得真好！', s:'学得真好！下次争取全对哦！' },
];
const OPT_COLORS = ['#FF7BAC', '#FF9F43', '#7ED957', '#5EC6F0', '#B69CFF', '#4ECDC4'];
let quiz = null;

function startQuiz(id) {
  const pool = poolOf(id);
  const n = Math.min(settings.len, pool.length);
  // 优先练没掌握的字：得分越低越靠前，掺一点随机避免每次顺序雷同
  const scored = pool.map(ch => {
    const st = stats[ch.c] || { f:0, w:0 };
    return { ch, k: (st.f || 0) - (st.w || 0) + ((st.f || 0) >= 3 ? 2 : 0) + Math.random() * 2 };
  });
  scored.sort((a, b) => a.key - b.key);
  quiz = {
    id,     qs: scored.slice(0, n).map((s, i) => ({ target: s.ch, opts: i < 2 ? 2 : 4 })),  // 前 2 题二选热身，其余四选
    i: 0, gold: 0, silver: 0, attempts: 0, locked: false,
  };
  $('dots').innerHTML = quiz.qs.map(() => '<span class="dot"></span>').join('');
  $('starCount').textContent = '⭐ 0';
  updateQuizHintsBtn();
  showScreen('quiz');
  ask();
}

function ask() {
  const q = quiz.qs[quiz.i];
  quiz.attempts = 0;
  quiz.locked = false;
  setBubble('听一听，找出来 👇', '');
  $('mascot').textContent = '🐼';
  renderOptions(q);
  markDot();
  setTimeout(() => sayPrompt(q), 250);
}

function renderOptions(q) {
  let cand = shuffle(poolOf(quiz.id).filter(ch => ch.c !== q.target.c));
  if (cand.length < q.opts - 1) {   // 字组太小时从全部汉字里补足干扰项
    cand = cand.concat(shuffle(ALL_CHARS.filter(ch => ch.c !== q.target.c && !cand.some(d => d.c === ch.c))));
  }
  const opts = shuffle([q.target, ...cand.slice(0, q.opts - 1)]);

  const box = $('options');
  box.innerHTML = '';
  opts.forEach((o, idx) => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.style.borderColor = OPT_COLORS[idx % OPT_COLORS.length];
    b.dataset.c = o.c;
    // 图片 span 始终渲染，由 applyHints() 只切显隐：切换时汉字、顺序、答题状态都不变
    b.innerHTML =
      `<span class="opt-emoji${o.e.length > 2 ? ' small' : ''}">${o.e}</span>` +
      `<span class="opt-char kai">${o.c}</span>`;
    box.appendChild(b);
  });
  applyHints();
}

function applyHints() {
  [...$('options').children].forEach(b => {
    b.classList.toggle('with-emoji', settings.hints);
    const emoji = b.querySelector('.opt-emoji');
    if (emoji) emoji.style.display = settings.hints ? '' : 'none';
  });
}

function sayPrompt(q) {
  const c = q.target.c, w = q.target.w;
  const lead = LEADS[Math.floor(Math.random() * LEADS.length)];
  const parts = [{ t: lead + '，', r: rate() * 0.95 }];
  if (w) {
    // 词语点题 + 单字慢读：如"小猫的猫……猫"，比孤零零一个音节清楚得多
    parts.push({ t: w + '的' + c, r: rate() * 0.85 });
    parts.push({ t: c, r: rate() * 0.75 });
  } else {
    parts.push({ t: c, r: rate() * 0.85 });
    parts.push({ t: c, r: rate() * 0.75 });
  }
  say(parts);
}

function setBubble(t, cls) { const el = $('bubbleText'); el.textContent = t; el.className = 'bubble ' + cls; }
function markDot() { [...$('dots').children].forEach((d, i) => d.classList.toggle('cur', i === quiz.i)); }
function updateQuizHintsBtn() {
  const btn = $('btnQuizHints');
  btn.textContent = settings.hints ? '🙈' : '🖼️';
  btn.setAttribute('aria-label', settings.hints ? '隐藏图片提示' : '显示图片提示');
}

function answer(b) {
  const q = quiz.qs[quiz.i];
  if (b.dataset.c === q.target.c) {
    quiz.locked = true;
    b.classList.add('correct');
    const first = quiz.attempts === 0;
    const st = statOf(q.target.c);
    st.s++; first ? st.f++ : st.w++;
    saveStats();
    first ? quiz.gold++ : quiz.silver++;
    $('dots').children[quiz.i].className = 'dot ' + (first ? 'gold' : 'silver');
    $('starCount').textContent = '⭐ ' + quiz.gold;
    bump($('starCount'));
    const cheer = CHEERS[Math.floor(Math.random() * CHEERS.length)];
    $('mascot').textContent = cheer.m;
    bump($('mascot'));
    setBubble(cheer.b, 'good');
    SFX.cheer();
    if (first) confetti(10);
    say([{ t: cheer.s },
         { t: '这是「' + q.target.c + '」', r: rate() * 0.95 },
         { t: q.target.c, r: rate() * 0.85 }]);
    setTimeout(nextQ, 2000);
  } else {
    quiz.attempts++;
    b.classList.add('wrong');
    b.disabled = true;
    SFX.wrong();
    if (quiz.attempts >= 3) {          // 连错 3 次：高亮正确答案，点了就过，不卡住
      setBubble('别急，它在这里 ✨ 点点它！', 'hint');
      [...$('options').children].forEach(x => {
        if (x.dataset.c !== q.target.c) x.disabled = true;
        else x.classList.add('hint-glow');
      });
      say([{ t: '别急，它在这里' }, { t: q.target.c, r: rate() * 0.85 }]);
    } else {
      const enc = ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)];
      setBubble(enc + ' 💪', 'bad');
      say([{ t: enc, r: rate() * 0.95 }]);
    }
  }
}

function nextQ() { quiz.i++; quiz.i >= quiz.qs.length ? endQuiz() : ask(); }

function endQuiz() {
  showScreen('end');
  const total = quiz.qs.length;
  const end = (quiz.gold === total ? END_PERFECT : END_GOOD)[Math.floor(Math.random() * 3)];
  $('endEmoji').textContent = end.e;
  $('endTitle').textContent = end.t;
  $('endStars').textContent = '⭐'.repeat(quiz.gold) + (quiz.silver ? ' 🌟×' + quiz.silver : '');
  $('endMsg').textContent = `第一次就答对 ${quiz.gold} 个` + (quiz.silver ? `，帮助后答对 ${quiz.silver} 个` : '');
  confetti();
  SFX.win();
  say([{ t: end.s }, { t: `你拿到了${quiz.gold}颗星星！` }]);
}

function confetti(n = 40) {
  const layer = $('confettiLayer'), EMO = ['⭐', '🎉', '✨', '🎈', '🌟'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.textContent = EMO[i % EMO.length];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (15 + Math.random() * 18) + 'px';
    s.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    s.style.animationDelay = (Math.random() * 0.7) + 's';
    layer.appendChild(s);
    setTimeout(() => s.remove(), 4200);
  }
}

/* ================= 家长中心 ================= */
function segSet(id, val) {
  document.querySelectorAll('#' + id + ' .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.v === String(val)));
}
function renderVoiceSeg() {
  const seg = $('segVoice');
  if (!seg) return;
  if (window.HanziNative) {
    seg.innerHTML = '<span class="voice-note">✅ 正在使用鸿蒙系统原生朗读（CoreSpeechKit）</span>';
    return;
  }
  const zh = Speech.zhVoices();
  seg.innerHTML = '';
  if (!zh.length) {
    seg.innerHTML = '<span class="voice-note">未找到中文语音包，请换 Chrome / Edge 打开</span>';
    return;
  }
  zh.forEach(v => {
    const b = document.createElement('button');
    b.className = 'seg-btn' + (Speech.voice && v.voiceURI === Speech.voice.voiceURI ? ' active' : '');
    const short = v.name.replace(/^(Microsoft|Google)\s+/i, '').replace(/\s*-\s*(Chinese|中文|普通话).*$/i, '').trim();
    b.textContent = short || v.name;
    b.title = v.name;
    b.addEventListener('click', () => {
      settings.voiceURI = v.voiceURI;
      saveSettings();
      Speech.pick();
      renderVoiceSeg();
      say('你好呀，小朋友，我用这个声音陪你玩');
    });
    seg.appendChild(b);
  });
}
function renderParent() {
  segSet('segRate', settings.rate);
  segSet('segHints', settings.hints ? '1' : '0');
  segSet('segLen', settings.len);
  renderVoiceSeg();
  $('voiceNote').textContent = window.HanziNative
    ? '当前人声：鸿蒙系统原生朗读'
    : Speech.voice
      ? '当前人声：' + Speech.voice.name
      : '⚠️ 未检测到中文语音包：请确认设备已装中文 TTS，或改用 Chrome / Edge / Safari 打开';
  $('progressList').innerHTML = GROUPS.map(g =>
    `<div class="pg-group"><b>${g.icon} ${g.name}</b><div class="pg-chips">` +
    g.chars.map(c => `<span class="chip kai${isMastered(c.c) ? ' mastered' : ''}" title="${c.p}">${c.c}</span>`).join('') +
    `</div></div>`
  ).join('') + `<p class="pg-tip">⭐ 金色 = 已掌握（连对 3 次）。答题会优先安排还没掌握的字。</p>`;
}

/* ================= 事件绑定 ================= */
function bindEvents() {
  document.querySelectorAll('.mode-card').forEach(b => b.addEventListener('click', () => {
    ui.mode = b.dataset.mode;
    SFX.tap();
    renderHome();
    say(ui.mode === 'learn' ? '认一认' : '找一找');
  }));

  $('learnHome').addEventListener('click', goHome);
  $('quizHome').addEventListener('click', goHome);
  $('btnHomeEnd').addEventListener('click', goHome);
  $('btnAgain').addEventListener('click', () => startQuiz(quiz.id));

  $('learnPrev').addEventListener('click', () => { SFX.tap(); learn.i = (learn.i - 1 + learn.list.length) % learn.list.length; renderLearn(); });
  $('learnNext').addEventListener('click', () => { SFX.tap(); learn.i = (learn.i + 1) % learn.list.length; renderLearn(); });
  $('btnLearnIcon').addEventListener('click', () => {
    settings.learnIcon = !settings.learnIcon;
    saveSettings();
    SFX.tap();
    updateLearnIcon();
    bump($('flashCard'));
  });
  $('flashCard').addEventListener('click', () => {
    SFX.tap();
    bump($('flashCard'));
    speakCard(learn.list[learn.i], true);
  });

  $('options').addEventListener('click', e => {
    const b = e.target.closest('button.opt');
    if (!b || !quiz || quiz.locked || b.disabled) return;
    answer(b);
  });
  $('btnReplay').addEventListener('click', () => {
    if (!quiz || !quiz.qs[quiz.i]) return;
    SFX.tap();
    sayPrompt(quiz.qs[quiz.i]);
  });

  // 找一找界面内切换「看图提示」：只切换图片显隐，不重建选项、不打断答题
  $('btnQuizHints').addEventListener('click', () => {
    settings.hints = !settings.hints;
    saveSettings();
    SFX.tap();
    updateQuizHintsBtn();
    applyHints();
  });

  $('btnSkip').addEventListener('click', () => {
    if (!quiz || quiz.locked) return;
    SFX.tap();
    nextQ();
  });

  $('btnParent').addEventListener('click', () => { renderParent(); $('parentModal').classList.remove('hidden'); });
  $('parentClose').addEventListener('click', () => $('parentModal').classList.add('hidden'));
  $('parentModal').addEventListener('click', e => { if (e.target === $('parentModal')) $('parentModal').classList.add('hidden'); });

  const segBind = (id, fn) => $(id).addEventListener('click', e => {
    const b = e.target.closest('.seg-btn');
    if (!b || b.id) return;                       // b.id 有值说明是「试听」按钮，不归属分段选择
    fn(b.dataset.v);
    document.querySelectorAll('#' + id + ' .seg-btn').forEach(x => x.classList.toggle('active', x === b));
  });
  segBind('segRate',  v => { settings.rate = v; saveSettings(); say('你好呀，小朋友'); });
  segBind('segHints', v => { settings.hints = v === '1'; saveSettings(); });
  segBind('segLen',   v => { settings.len = +v; saveSettings(); });
  $('btnVoiceTest').addEventListener('click', () => say('你好呀，我是识字小乐园'));

  let resetArmed = false, resetTimer = null;
  $('resetBtn').addEventListener('click', () => {
    if (!resetArmed) {
      resetArmed = true;
      $('resetBtn').textContent = '再点一次确认重置 ⚠️';
      resetTimer = setTimeout(() => { resetArmed = false; $('resetBtn').textContent = '🗑 重置全部进度'; }, 3000);
      return;
    }
    clearTimeout(resetTimer);
    resetArmed = false;
    stats = {};
    saveStats();
    $('resetBtn').textContent = '🗑 重置全部进度';
    renderParent();
  });

  // 首次触摸：解锁音频 & 语音（iOS 要求在用户手势内）
  let unlocked = false;
  document.addEventListener('pointerdown', () => {
    if (unlocked) return;
    unlocked = true;
    audio();
    Speech.warm();
  }, true);

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && 'speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch (e) {} }
  });
}

/* ================= 启动 ================= */
Speech.init();
bindEvents();
renderHome();

// 开发/测试入口：index.html#learn 或 #quiz 直接进入动物组
if (location.hash === '#learn') startLearn('animals');
else if (location.hash === '#quiz') startQuiz('animals');
})();
