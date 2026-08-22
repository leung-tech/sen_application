(() => {
  const GRADE = {
    lower: { label: '初小 · P1–P3', cptTrials: 8, cptMs: 1650, nBackTrials: 8, nBackMs: 2300, nBackMax: 1, stroopTrials: 8, stroopMs: 2200, nogoTrials: 10, nogoMs: 1550, flankerTrials: 8, flankerMs: 1900, flankerConflict: .28, switchTrials: 8, switchTrigger: 3, corsiTrials: 6, corsiStart: 3, corsiMax: 4, schulteSize: 3, schulteMove: false, motBalls: 5, motTargets: 2, motMs: 3000 },
    upper: { label: '高小 · P4–P6', cptTrials: 11, cptMs: 1350, nBackTrials: 10, nBackMs: 1950, nBackMax: 1, stroopTrials: 10, stroopMs: 1850, nogoTrials: 12, nogoMs: 1300, flankerTrials: 10, flankerMs: 1550, flankerConflict: .42, switchTrials: 10, switchTrigger: 4, corsiTrials: 7, corsiStart: 3, corsiMax: 5, schulteSize: 4, schulteMove: false, motBalls: 6, motTargets: 2, motMs: 3800 },
    junior: { label: '初中 · S1–S3', cptTrials: 14, cptMs: 1050, nBackTrials: 12, nBackMs: 1650, nBackMax: 2, stroopTrials: 12, stroopMs: 1550, nogoTrials: 14, nogoMs: 1100, flankerTrials: 12, flankerMs: 1250, flankerConflict: .55, switchTrials: 12, switchTrigger: 4, corsiTrials: 8, corsiStart: 4, corsiMax: 6, schulteSize: 5, schulteMove: false, motBalls: 8, motTargets: 3, motMs: 4800 },
    senior: { label: '高中 · S4–S6', cptTrials: 16, cptMs: 900, nBackTrials: 14, nBackMs: 1450, nBackMax: 3, stroopTrials: 14, stroopMs: 1350, nogoTrials: 16, nogoMs: 950, flankerTrials: 14, flankerMs: 1050, flankerConflict: .64, switchTrials: 14, switchTrigger: 5, corsiTrials: 9, corsiStart: 5, corsiMax: 7, schulteSize: 5, schulteMove: true, motBalls: 9, motTargets: 3, motMs: 5800 },
  };

  const COLORS = [
    { name: '紅色', hex: '#c83d55', key: '1' },
    { name: '藍色', hex: '#256ac4', key: '2' },
    { name: '綠色', hex: '#187e66', key: '3' },
    { name: '黃色', hex: '#9a6900', key: '4' },
  ];

  const GAME_INFO = {
    cpt: { icon: '🐱', title: '貓咪捉老鼠 CPT', description: '只在正確前後關係出現時按一下，練習持續留意和停一停。', focus: '持續專注與衝動抑制' },
    nback: { icon: '🧠', title: '步進記憶回溯', description: '只在圖案與前面指定位置相同時回應，練習更新工作記憶。', focus: '工作記憶更新' },
    stroop: { icon: '🎨', title: '色字煞車 Stroop', description: '按文字真正的顏色，不按字義。', focus: '干擾控制與反應抑制' },
    nogo: { icon: '🛑', title: '綠燈停手 Go／No-Go', description: '看到綠色才按，看到紅色時讓身體安靜等候。', focus: '衝動控制' },
    flanker: { icon: '↔️', title: '中央箭頭過濾 Flanker', description: '只看正中央箭頭，不讓兩側箭頭帶走注意力。', focus: '視覺選擇注意' },
    switch: { icon: '🃏', title: '規則偵探卡片', description: '從對錯回饋找出分類規則，並在規則改變時調整。', focus: '認知靈活性與任務切換' },
    corsi: { icon: '🔷', title: '空間記憶磚 Corsi', description: '看方塊依序亮起，再用相同次序點選。', focus: '視覺空間工作記憶' },
    schulte: { icon: '🔢', title: '尋數方格 Schulte', description: '由 1 開始依序找數字，練習集中掃視。', focus: '視覺集中與周邊搜尋' },
    mot: { icon: '🪐', title: '目標星球追蹤 MOT', description: '記住閃爍目標球，在移動後找回它們。', focus: '分配注意與空間追蹤' },
  };

  let host = null;
  let options = null;
  let stage = 'lower';
  let state = null;
  let returnFocus = null;
  let timers = [];
  let animationFrame = null;

  const sleep = (fn, delay) => {
    const id = window.setTimeout(() => {
      timers = timers.filter((timer) => timer !== id);
      fn();
    }, delay);
    timers.push(id);
    return id;
  };

  function clearTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  function grade() {
    return GRADE[stage] || GRADE.lower;
  }

  function shuffle(items) {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
  }

  function focusable() {
    if (!host) return [];
    return [...host.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.offsetParent !== null);
  }

  function focusSoon(selector) {
    window.requestAnimationFrame(() => host?.querySelector(selector)?.focus());
  }

  function setFeedback(text, tone = '') {
    const feedback = host?.querySelector('#gradedLabFeedback');
    if (!feedback) return;
    feedback.className = `graded-feedback ${tone}`;
    feedback.textContent = text;
  }

  function progressMarkup() {
    const total = state?.total || 1;
    const current = Math.min(state?.index || 0, total);
    return `<div class="graded-progress" role="progressbar" aria-label="${GAME_INFO[state?.game]?.title || '訓練'}進度" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${current}" aria-valuetext="第 ${Math.min(current + 1, total)} / ${total} 回合"><i style="width:${Math.round((current / total) * 100)}%"></i></div>`;
  }

  function shell(content) {
    host.innerHTML = `<div class="graded-lab-shell" role="dialog" aria-modal="true" aria-label="ADHD 分級認知訓練室"><section class="graded-lab">${content}</section></div>`;
    host.querySelectorAll('.graded-close').forEach((button) => button.addEventListener('click', close));
  }

  function top(title, description, eyebrow = 'ADHD · 分級認知訓練') {
    return `<header class="graded-top"><div><div class="graded-eyebrow">${eyebrow}</div><h2>${title}</h2><p>${description}</p></div><button class="graded-close" type="button" aria-label="關閉分級認知訓練室">×</button></header>`;
  }

  function createRun(game, total) {
    state = { game, total, index: 0, correct: 0, incorrect: 0, reactionTimes: [], startedAt: Date.now(), locked: false, keyHandler: null };
  }

  function finishGame() {
    clearTimers();
    const info = GAME_INFO[state.game];
    const answered = state.correct + state.incorrect;
    const accuracy = answered ? Math.round((state.correct / answered) * 100) : 0;
    const averageMs = state.reactionTimes.length ? Math.round(state.reactionTimes.reduce((sum, value) => sum + value, 0) / state.reactionTimes.length) : 0;
    options?.onComplete?.({ label: `${info.title} · ${grade().label}`, mode: state.game, total: state.total, correct: state.correct, incorrect: state.incorrect, averageMs, completedAt: new Date().toLocaleString('zh-HK') });
    shell(`${top('本次練習回顧', '這是本節練習的溫和回顧。可以休息、重玩較短內容，或選擇另一項活動。', '完成 · ${grade().label}')}<section class="graded-summary"><div><span>完成回合</span><strong>${answered} / ${state.total}</strong></div><div><span>正確回應</span><strong>${accuracy}%</strong></div><div><span>平均反應</span><strong>${averageMs ? `${averageMs}ms` : '—'}</strong></div></section><p class="graded-note">數字只供本節課堂回顧，不用與其他同學比較。答錯時可慢慢看看規則，再選較短或較慢的練習。</p><div class="graded-actions"><button class="graded-secondary" id="gradedRestart" type="button">↺ 再玩這一項</button><button class="graded-primary" id="gradedMenu" type="button">選另一個遊戲</button></div>`);
    host.querySelector('#gradedRestart')?.addEventListener('click', () => startGame(state.game));
    host.querySelector('#gradedMenu')?.addEventListener('click', renderMenu);
    focusSoon('#gradedMenu');
  }

  function nextTrial(render) {
    state.index += 1;
    state.locked = false;
    state.keyHandler = null;
    if (state.index >= state.total) {
      finishGame();
      return;
    }
    render();
  }

  function renderMenu() {
    clearTimers();
    state = null;
    const cards = Object.entries(GAME_INFO).map(([id, info]) => `<button class="graded-game-card" type="button" data-graded-game="${id}"><span aria-hidden="true">${info.icon}</span><strong>${info.title}</strong><small>${info.focus}</small><p>${info.description}</p><em>${grade().label} 難度</em></button>`).join('');
    shell(`${top('選擇一項小挑戰', '每項都是短回合練習。可由學生選擇、隨時休息或返回 ADHD 關卡。', grade().label)}<div class="graded-game-grid">${cards}</div><aside class="graded-support" aria-label="低壓參與提示"><strong>低壓參與</strong><span>這不是速度比賽。先看規則、按自己的節奏作答；需要時可隨時離開。</span></aside>`);
    host.querySelectorAll('[data-graded-game]').forEach((button) => button.addEventListener('click', () => startGame(button.dataset.gradedGame)));
    focusSoon('.graded-close');
  }

  function renderCpt() {
    const settings = grade();
    const raw = state.sequence[state.index];
    const previous = state.index ? state.sequence[state.index - 1] : null;
    const expected = previous === 'A' && raw === 'X';
    const isLower = stage === 'lower';
    const symbol = isLower ? ({ A: '🐱', X: '🐭', B: '⭐', C: '☁️' }[raw]) : raw;
    const previousName = isLower ? ({ A: '貓咪', X: '老鼠', B: '星星', C: '雲朵' }[previous] || '開始') : (previous || '開始');
    state.expected = expected;
    state.shownAt = Date.now();
    shell(`${top(GAME_INFO.cpt.title, isLower ? '只有看到「貓咪後面緊接老鼠」時才按一下。其餘時候保持安靜等待。' : '只有看到 A 後面緊接 X 時才按一下。其餘時候保持安靜等待。', `${grade().label} · ${state.index + 1} / ${state.total}`)}${progressMarkup()}<div class="graded-rule">上一張：<strong>${previousName}</strong>。${isLower ? '只有「貓咪 → 老鼠」才按。' : '只有「A → X」才按。'}</div><div class="graded-stimulus cpt" aria-label="目前符號 ${isLower ? ({ A: '貓咪', X: '老鼠', B: '星星', C: '雲朵' }[raw]) : raw}">${symbol}</div><button class="graded-response" id="gradedResponse" type="button">✓ 這一張要按 <span>（空白鍵）</span></button><div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">留意前一張和目前這一張的關係。</div>`);
    host.querySelector('#gradedResponse')?.addEventListener('click', () => resolveCpt(true));
    state.keyHandler = (key) => { if (key === ' ' || key === 'Spacebar' || key === 'Enter') resolveCpt(true); };
    focusSoon('#gradedResponse');
    sleep(() => resolveCpt(false), settings.cptMs);
  }

  function resolveCpt(pressed) {
    if (!state || state.locked) return;
    state.locked = true;
    clearTimers();
    const correct = pressed === state.expected;
    if (pressed) state.reactionTimes.push(Date.now() - state.shownAt);
    if (correct) state.correct += 1; else state.incorrect += 1;
    const message = correct ? (pressed ? '✓ 做得好，你在正確組合出現時才按。' : '✓ 做得好，這一張不需要按。') : (pressed ? '↗ 先停一停；只有正確組合才按。' : '↗ 這是正確組合；下一次可以慢慢留意前一張。');
    setFeedback(message, correct ? 'ok' : 'try');
    sleep(() => nextTrial(renderCpt), correct ? 520 : 780);
  }

  function buildCpt(total) {
    const items = [];
    const distractors = ['B', 'C'];
    for (let index = 0; index < total; index += 1) {
      const previous = items.at(-1);
      if (previous === 'A') items.push(Math.random() < 0.42 ? 'X' : distractors[Math.floor(Math.random() * distractors.length)]);
      else items.push(Math.random() < 0.32 ? 'A' : ['X', ...distractors][Math.floor(Math.random() * 3)]);
    }
    if (!items.some((item, index) => index && items[index - 1] === 'A' && item === 'X')) items.splice(Math.max(1, Math.floor(total / 2)), 2, 'A', 'X');
    return items.slice(0, total);
  }

  function renderNBack() {
    const settings = grade();
    const n = state.n;
    const source = ['⭐', '🍎', '☁️', '🚗', '🌙', '🐟'];
    const earlier = state.history.length >= n ? state.history.at(-n) : null;
    const shouldMatch = Boolean(earlier) && Math.random() < 0.42;
    const symbol = shouldMatch ? earlier : source.filter((item) => item !== earlier)[Math.floor(Math.random() * (source.length - (earlier ? 1 : 0)))];
    state.expected = Boolean(earlier) && symbol === earlier;
    state.symbol = symbol;
    state.shownAt = Date.now();
    shell(`${top(GAME_INFO.nback.title, `只在目前圖案與前 ${n} 張一樣時按一下。連續兩次掌握後，難度會在可承受範圍內調整。`, `${grade().label} · ${n}-Back · ${state.index + 1} / ${state.total}`)}${progressMarkup()}<div class="graded-history" aria-label="最近圖案">${state.history.slice(-3).map((item, index) => `<span>${item}<small>前 ${Math.min(state.history.length - index, 3)} 張</small></span>`).join('') || '<span>準備開始</span>'}</div><div class="graded-stimulus nback" aria-label="目前圖案 ${symbol}">${symbol}</div><button class="graded-response" id="gradedResponse" type="button">✓ 與前 ${n} 張相同 <span>（空白鍵）</span></button><div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">先看目前圖案，再想一想前 ${n} 張。</div>`);
    host.querySelector('#gradedResponse')?.addEventListener('click', () => resolveNBack(true));
    state.keyHandler = (key) => { if (key === ' ' || key === 'Spacebar' || key === 'Enter') resolveNBack(true); };
    focusSoon('#gradedResponse');
    sleep(() => resolveNBack(false), settings.nBackMs);
  }

  function resolveNBack(pressed) {
    if (!state || state.locked) return;
    state.locked = true;
    clearTimers();
    const correct = pressed === state.expected;
    if (pressed) state.reactionTimes.push(Date.now() - state.shownAt);
    state.history.push(state.symbol);
    if (correct) {
      state.correct += 1;
      state.successStreak += 1;
      if (state.successStreak >= 2 && state.n < grade().nBackMax) {
        state.n += 1;
        state.successStreak = 0;
        setFeedback(`✓ 做得好。下一張會改為 ${state.n}-Back；慢慢記住前面圖案。`, 'ok');
      } else setFeedback(pressed ? '✓ 正確，比對到相同圖案。' : '✓ 正確，這一張不需要按。', 'ok');
    } else {
      state.incorrect += 1;
      state.successStreak = 0;
      if (state.n > 1) state.n -= 1;
      setFeedback(pressed ? '↗ 這一張不相同；下一張慢慢再看。' : '↗ 這一張相同；下一次可留意前面圖案。', 'try');
    }
    sleep(() => nextTrial(renderNBack), correct ? 560 : 840);
  }

  function renderStroop() {
    const settings = grade();
    const word = COLORS[Math.floor(Math.random() * COLORS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    state.expected = color.name;
    state.shownAt = Date.now();
    const choices = COLORS.map((item) => `<button class="graded-color-choice" type="button" data-color="${item.name}" style="--choice:${item.hex}"><span>${item.key}</span>${item.name}</button>`).join('');
    shell(`${top(GAME_INFO.stroop.title, '不要按字的意思；請按文字真正的顏色。鍵盤可按 1、2、3、4。', `${grade().label} · ${state.index + 1} / ${state.total}`)}${progressMarkup()}<div class="graded-rule">文字寫的是「${word.name}」，但請只看它的<strong>字體顏色</strong>。</div><div class="graded-stimulus stroop" style="color:${color.hex}" aria-label="文字 ${word.name}，字體顏色 ${color.name}">${word.name.replace('色', '')}</div><div class="graded-color-choices">${choices}</div><div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">慢慢看顏色，不用跟著文字讀。</div>`);
    host.querySelectorAll('[data-color]').forEach((button) => button.addEventListener('click', () => resolveStroop(button.dataset.color)));
    state.keyHandler = (key) => { const selected = COLORS.find((item) => item.key === key); if (selected) resolveStroop(selected.name); };
    focusSoon('[data-color]');
    sleep(() => resolveStroop(null), settings.stroopMs);
  }

  function resolveStroop(answer) {
    if (!state || state.locked) return;
    state.locked = true;
    clearTimers();
    const correct = answer === state.expected;
    if (answer) state.reactionTimes.push(Date.now() - state.shownAt);
    if (correct) state.correct += 1; else state.incorrect += 1;
    setFeedback(correct ? '✓ 正確，你看的是顏色。' : answer ? `↗ 這一張的顏色是${state.expected}，下次慢慢看字體。` : `↗ 沒關係；這一張的顏色是${state.expected}。`, correct ? 'ok' : 'try');
    sleep(() => nextTrial(renderStroop), correct ? 500 : 800);
  }

  function renderNoGo() {
    const settings = grade();
    const signal = state.sequence[state.index];
    state.expected = signal === 'go';
    state.shownAt = Date.now();
    const visual = signal === 'go' ? '🟢' : '🔴';
    const label = signal === 'go' ? '綠燈：按一下' : '紅燈：不要按，安靜等候';
    shell(`${top(GAME_INFO.nogo.title, '看到綠色訊號才按一下；紅色訊號出現時，讓手停住，等下一張。', `${grade().label} · ${state.index + 1} / ${state.total}`)}${progressMarkup()}<div class="graded-stimulus nogo ${signal}" aria-label="${label}">${visual}<strong>${signal === 'go' ? '按' : '停'}</strong></div><button class="graded-response" id="gradedResponse" type="button">✓ 看見綠色才按 <span>（空白鍵）</span></button><div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">看清楚顏色；紅色時不用做任何事。</div>`);
    host.querySelector('#gradedResponse')?.addEventListener('click', () => resolveNoGo(true));
    state.keyHandler = (key) => { if (key === ' ' || key === 'Spacebar' || key === 'Enter') resolveNoGo(true); };
    focusSoon('#gradedResponse');
    sleep(() => resolveNoGo(false), settings.nogoMs);
  }

  function resolveNoGo(pressed) {
    if (!state || state.locked) return;
    state.locked = true;
    clearTimers();
    const correct = pressed === state.expected;
    if (pressed) state.reactionTimes.push(Date.now() - state.shownAt);
    if (correct) state.correct += 1; else state.incorrect += 1;
    setFeedback(correct ? (pressed ? '✓ 做得好，綠色時才按。' : '✓ 做得好，紅色時你停住了。') : (pressed ? '↗ 紅色時先停一停；下一張再試。' : '↗ 綠色時可以按；下一張慢慢看。'), correct ? 'ok' : 'try');
    sleep(() => nextTrial(renderNoGo), correct ? 500 : 800);
  }

  function renderFlanker() {
    const settings = grade();
    const center = Math.random() < .5 ? 'left' : 'right';
    const conflict = Math.random() < settings.flankerConflict;
    const side = conflict ? (center === 'left' ? 'right' : 'left') : center;
    const arrow = { left: '←', right: '→' };
    const pattern = `${arrow[side]}${arrow[side]}${arrow[center]}${arrow[side]}${arrow[side]}`;
    state.expected = center;
    state.shownAt = Date.now();
    shell(`${top(GAME_INFO.flanker.title, '只看中間的箭頭。左右兩側可能相同，也可能故意造成干擾。可按 ←／→ 鍵。', `${grade().label} · ${state.index + 1} / ${state.total}`)}${progressMarkup()}<div class="graded-rule">只跟<strong>正中央</strong>的箭頭走，不用理會旁邊箭頭。</div><div class="graded-flanker" aria-label="五個箭頭，中央箭頭向${center === 'left' ? '左' : '右'}"><span aria-hidden="true">${pattern}</span><small>中央箭頭：${arrow[center]}</small></div><div class="graded-direction-actions"><button class="graded-direction" type="button" data-direction="left">← 向左 <span>左鍵</span></button><button class="graded-direction" type="button" data-direction="right">向右 → <span>右鍵</span></button></div><div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">先看最中間，再選方向。</div>`);
    host.querySelectorAll('[data-direction]').forEach((button) => button.addEventListener('click', () => resolveFlanker(button.dataset.direction)));
    state.keyHandler = (key) => { if (key === 'ArrowLeft') resolveFlanker('left'); if (key === 'ArrowRight') resolveFlanker('right'); };
    focusSoon('[data-direction]');
    sleep(() => resolveFlanker(null), settings.flankerMs);
  }

  function resolveFlanker(answer) {
    if (!state || state.locked) return;
    state.locked = true;
    clearTimers();
    const correct = answer === state.expected;
    if (answer) state.reactionTimes.push(Date.now() - state.shownAt);
    if (correct) state.correct += 1; else state.incorrect += 1;
    const directionName = state.expected === 'left' ? '左' : '右';
    setFeedback(correct ? `✓ 正確，中央箭頭是向${directionName}。` : answer ? `↗ 中央箭頭是向${directionName}；下次只看中間。` : `↗ 這一張中央箭頭向${directionName}。`, correct ? 'ok' : 'try');
    sleep(() => nextTrial(renderFlanker), correct ? 520 : 800);
  }

  function cardFor(value) {
    const colors = ['紅色', '藍色', '綠色'];
    const shapes = ['▲', '●', '■'];
    return { color: colors[value % 3], shape: shapes[Math.floor(value / 3) % 3], count: (value % 3) + 1 };
  }

  function cardLabel(card) {
    return `${card.count} 個${card.color}${card.shape}`;
  }

  function compareCard(target, candidate, rule) {
    return target[rule] === candidate[rule];
  }

  function renderSwitch() {
    const rules = stage === 'lower' ? ['color', 'shape'] : ['color', 'shape', 'count'];
    const rule = state.rule;
    const target = cardFor(Math.floor(Math.random() * 9));
    const values = shuffle([...Array(9).keys()]);
    let correctCard = cardFor(values.find((value) => compareCard(target, cardFor(value), rule)) ?? 0);
    const decoys = values.map(cardFor).filter((card) => !compareCard(target, card, rule)).slice(0, 3);
    const cards = shuffle([correctCard, ...decoys]);
    state.target = target;
    state.expected = cards.findIndex((card) => compareCard(target, card, rule));
    state.shownAt = Date.now();
    const cardHtml = (card, index, targetCard = false) => `<button class="graded-rule-card ${targetCard ? 'target' : ''}" type="button" data-switch-card="${index}" aria-label="${targetCard ? '目標卡' : '參考卡'}：${cardLabel(card)}"><span class="card-shapes">${Array.from({ length: card.count }, () => card.shape).join('')}</span><small>${card.color}</small></button>`;
    shell(`${top(GAME_INFO.switch.title, '規則藏在回饋裡。選擇一張與目標卡相配的參考卡；連續答對後，規則可能改變。', `${grade().label} · ${state.index + 1} / ${state.total}`)}${progressMarkup()}<div class="graded-rule">目前先看哪一種線索？不必急著知道答案；先根據每次回饋當一個規則偵探。</div><section class="graded-card-target"><span>目標卡</span>${cardHtml(target, -1, true)}</section><section class="graded-card-choices" aria-label="選擇一張參考卡">${cards.map((card, index) => cardHtml(card, index)).join('')}</section><div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">選一張你覺得和目標卡有相同規律的卡。</div>`);
    host.querySelectorAll('[data-switch-card]').forEach((button) => button.addEventListener('click', () => resolveSwitch(Number(button.dataset.switchCard))));
    focusSoon('[data-switch-card]');
  }

  function resolveSwitch(selected) {
    if (!state || state.locked) return;
    state.locked = true;
    const correct = selected === state.expected;
    state.reactionTimes.push(Date.now() - state.shownAt);
    if (correct) {
      state.correct += 1;
      state.successStreak += 1;
      if (state.successStreak >= state.switchTrigger) {
        const rules = stage === 'lower' ? ['color', 'shape'] : ['color', 'shape', 'count'];
        state.rule = rules[(rules.indexOf(state.rule) + 1) % rules.length];
        state.successStreak = 0;
        setFeedback('✓ 規則偵探很細心。下一張規則已經改變；重新從回饋找線索。', 'ok');
      } else setFeedback('✓ 配對正確。記住這次的線索，再觀察下一張。', 'ok');
    } else {
      state.incorrect += 1;
      state.successStreak = 0;
      setFeedback('↗ 這次不相配。看看目標卡的顏色、形狀或數量，再試下一張。', 'try');
    }
    sleep(() => nextTrial(renderSwitch), correct ? 620 : 880);
  }

  function newCorsiSequence(length) {
    const cells = [];
    while (cells.length < length) {
      const next = Math.floor(Math.random() * 9);
      if (cells.at(-1) !== next) cells.push(next);
    }
    return cells;
  }

  function corsiGrid({ showSequence = false } = {}) {
    const active = showSequence ? state.sequence[state.flashIndex] : null;
    return `<div class="graded-corsi-grid" aria-label="九個空間記憶方塊">${Array.from({ length: 9 }, (_, index) => `<button class="graded-corsi-cell ${active === index ? 'flash' : ''}" type="button" data-corsi-cell="${index}" aria-label="記憶方塊 ${index + 1}${active === index ? '，正在亮起' : ''}"><span>${index + 1}</span></button>`).join('')}</div>`;
  }

  function renderCorsiWatch() {
    shell(`${top(GAME_INFO.corsi.title, '先看方塊依次亮起。亮完後，請用一樣的次序點選。', `${grade().label} · ${state.span} 格 · ${state.index + 1} / ${state.total}`)}${progressMarkup()}<div class="graded-rule">現在只需看和記住，不用按。亮完後會輪到你。</div>${corsiGrid({ showSequence: true })}<div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">正在顯示第 ${state.flashIndex + 1} 個位置，共 ${state.sequence.length} 個。</div>`);
  }

  function startCorsiDisplay() {
    state.flashIndex = 0;
    const flash = () => {
      if (!state || state.game !== 'corsi') return;
      renderCorsiWatch();
      sleep(() => {
        state.flashIndex += 1;
        if (state.flashIndex < state.sequence.length) flash();
        else sleep(renderCorsiChoose, 320);
      }, 680);
    };
    flash();
  }

  function renderCorsiChoose() {
    state.selected = [];
    state.locked = false;
    shell(`${top(GAME_INFO.corsi.title, '現在請按剛才一樣的順序點選方塊。需要時可以先停一下再開始。', `${grade().label} · ${state.span} 格 · ${state.index + 1} / ${state.total}`)}${progressMarkup()}<div class="graded-rule">已選擇 <strong id="corsiCount">0 / ${state.sequence.length}</strong> 個位置。記得由第一個亮起的位置開始。</div>${corsiGrid()}<div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">輪到你。請按亮起的相同次序。</div>`);
    host.querySelectorAll('[data-corsi-cell]').forEach((button) => button.addEventListener('click', () => selectCorsiCell(Number(button.dataset.corsiCell))));
    focusSoon('[data-corsi-cell]');
  }

  function selectCorsiCell(cell) {
    if (!state || state.locked) return;
    const nextIndex = state.selected.length;
    state.selected.push(cell);
    host?.querySelector(`[data-corsi-cell="${cell}"]`)?.classList.add('selected');
    const expected = state.sequence[nextIndex];
    if (cell !== expected) {
      state.locked = true;
      state.incorrect += 1;
      state.span = Math.max(2, state.span - 1);
      state.successStreak = 0;
      setFeedback(`↗ 這次次序不同。下一回合會以 ${state.span} 格慢慢再試。`, 'try');
      sleep(() => nextCorsiRound(), 950);
      return;
    }
    const count = host?.querySelector('#corsiCount');
    if (count) count.textContent = `${state.selected.length} / ${state.sequence.length}`;
    if (state.selected.length === state.sequence.length) {
      state.locked = true;
      state.correct += 1;
      state.successStreak += 1;
      if (state.successStreak >= 2 && state.span < grade().corsiMax) {
        state.span += 1;
        state.successStreak = 0;
        setFeedback(`✓ 次序正確。下一回合會有 ${state.span} 格；慢慢看就可以。`, 'ok');
      } else setFeedback('✓ 次序正確。做得好，準備下一回合。', 'ok');
      sleep(() => nextCorsiRound(), 720);
    } else setFeedback('✓ 這一格正確，繼續想下一個位置。', 'ok');
  }

  function nextCorsiRound() {
    state.index += 1;
    if (state.index >= state.total) {
      finishGame();
      return;
    }
    state.sequence = newCorsiSequence(state.span);
    state.selected = [];
    startCorsiDisplay();
  }

  function renderSchulte() {
    const settings = grade();
    const size = settings.schulteSize;
    const elapsed = Math.round((Date.now() - state.shownAt) / 1000);
    shell(`${top(GAME_INFO.schulte.title, `由 1 開始依序找數字。${settings.schulteMove ? '每次答對後，方格會重新排列。' : '不用追求速度；看清楚下一個數字再按。'}`, `${grade().label} · ${size} × ${size}`)}${progressMarkup()}<div class="graded-schulte-meta"><span>下一個數字：<strong>${state.expected}</strong></span><span>已完成：${state.index} / ${state.total}</span><span>練習時間：約 ${elapsed} 秒</span></div><div class="graded-schulte-grid size-${size}" role="group" aria-label="尋數方格，請依序找數字">${state.numbers.map((number) => `<button class="graded-schulte-cell" type="button" data-schulte-number="${number}" ${number < state.expected ? 'disabled' : ''} aria-label="數字 ${number}${number === state.expected ? '，下一個目標' : ''}">${number}</button>`).join('')}</div><div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">請找數字 ${state.expected}。找到後按一下。</div>`);
    host.querySelectorAll('[data-schulte-number]').forEach((button) => button.addEventListener('click', () => resolveSchulte(Number(button.dataset.schulteNumber))));
    focusSoon(`[data-schulte-number="${state.expected}"]`);
  }

  function resolveSchulte(number) {
    if (!state || state.locked || number < state.expected) return;
    if (number !== state.expected) {
      state.incorrect += 1;
      setFeedback(`↗ 下一個是 ${state.expected}；慢慢掃視方格，不用急。`, 'try');
      return;
    }
    state.correct += 1;
    state.index += 1;
    state.expected += 1;
    if (state.index >= state.total) {
      state.reactionTimes.push(Date.now() - state.shownAt);
      finishGame();
      return;
    }
    if (grade().schulteMove) state.numbers = shuffle(state.numbers);
    renderSchulte();
  }

  function motSetupCanvas() {
    const canvas = host?.querySelector('#motCanvas');
    if (!canvas) return;
    state.canvas = canvas;
    state.context = canvas.getContext('2d');
    canvas.addEventListener('click', (event) => {
      if (state?.motPhase !== 'choose') return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width);
      const y = (event.clientY - rect.top) * (canvas.height / rect.height);
      const hit = state.balls.find((ball) => Math.hypot(ball.x - x, ball.y - y) < ball.r + 8);
      if (hit) selectMotBall(hit.id);
    });
    drawMot();
  }

  function drawMot() {
    if (!state?.context || !state.canvas) return;
    const { context, canvas } = state;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#102c58');
    gradient.addColorStop(1, '#315c94');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 30; i += 1) {
      context.fillStyle = 'rgba(255,255,255,.55)';
      context.fillRect((i * 71) % canvas.width, (i * 97) % canvas.height, 2, 2);
    }
    state.balls.forEach((ball) => {
      const isTargetPreview = state.motPhase === 'preview' && ball.target;
      const selected = state.selected?.includes(ball.id);
      context.beginPath();
      context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      context.fillStyle = isTargetPreview ? '#e04c66' : selected ? '#f7c850' : '#68b8ef';
      context.fill();
      context.lineWidth = selected || isTargetPreview ? 5 : 2;
      context.strokeStyle = selected || isTargetPreview ? '#fff5cf' : 'rgba(255,255,255,.85)';
      context.stroke();
      context.fillStyle = '#ffffff';
      context.font = 'bold 15px system-ui';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(String(ball.id + 1), ball.x, ball.y + 1);
    });
  }

  function moveMot(timestamp) {
    if (!state || state.game !== 'mot' || state.motPhase !== 'move') return;
    const delta = Math.min(32, timestamp - (state.lastFrame || timestamp));
    state.lastFrame = timestamp;
    const speedFactor = delta / 16;
    state.balls.forEach((ball) => {
      ball.x += ball.dx * speedFactor;
      ball.y += ball.dy * speedFactor;
      if (ball.x < ball.r || ball.x > 600 - ball.r) { ball.dx *= -1; ball.x = Math.max(ball.r, Math.min(600 - ball.r, ball.x)); }
      if (ball.y < ball.r || ball.y > 360 - ball.r) { ball.dy *= -1; ball.y = Math.max(ball.r, Math.min(360 - ball.r, ball.y)); }
    });
    drawMot();
    animationFrame = window.requestAnimationFrame(moveMot);
  }

  function renderMot() {
    const settings = grade();
    shell(`${top(GAME_INFO.mot.title, `先記住紅色目標球。它們變回藍色並移動後，請找回全部 ${settings.motTargets} 個。可點選星球或按數字 1–${settings.motBalls}。`, `${grade().label} · ${settings.motBalls} 個星球 · ${settings.motTargets} 個目標`)}${progressMarkup()}<div class="graded-rule">目標會先以紅色顯示，然後開始移動。這不是速度比賽；動態停止後才需要作答。</div><canvas id="motCanvas" class="graded-mot-canvas" width="600" height="360" tabindex="0" role="img" aria-label="目標星球追蹤畫面，星球已標示數字；可按相應數字鍵選取星球"></canvas><div class="graded-mot-keyboard" aria-label="鍵盤操作提示">星球停止後，可按數字鍵或下方按鈕選取星球；已選 <strong id="motSelectedCount">0 / ${settings.motTargets}</strong> 個。</div><div class="graded-mot-choices" id="motChoices" aria-label="星球選擇" hidden>${state.balls.map((ball) => `<button type="button" data-mot-ball="${ball.id}" aria-pressed="false" disabled>選擇星球 ${ball.id + 1}</button>`).join('')}</div><div id="gradedLabFeedback" class="graded-feedback" role="status" aria-live="polite" aria-atomic="true">先記住紅色目標星球。</div>`);
    motSetupCanvas();
    host.querySelectorAll('[data-mot-ball]').forEach((button) => button.addEventListener('click', () => selectMotBall(Number(button.dataset.motBall))));
    focusSoon('#motCanvas');
    state.motPhase = 'preview';
    drawMot();
    sleep(() => {
      state.motPhase = 'move';
      state.lastFrame = 0;
      setFeedback('目標已變回藍色，請安靜追蹤它們的位置。', '');
      animationFrame = window.requestAnimationFrame(moveMot);
      sleep(() => {
        if (!state || state.game !== 'mot') return;
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
        state.motPhase = 'choose';
        state.shownAt = Date.now();
        drawMot();
        const choices = host?.querySelector('#motChoices');
        if (choices) choices.hidden = false;
        host?.querySelectorAll('[data-mot-ball]').forEach((button) => { button.disabled = false; });
        setFeedback(`現在請找回最初紅色的 ${settings.motTargets} 個星球。可點選或按星球數字。`, '');
      }, settings.motMs);
    }, 1500);
  }

  function selectMotBall(id) {
    if (!state || state.motPhase !== 'choose' || state.locked || state.selected.includes(id)) return;
    state.selected.push(id);
    const selectedButton = host?.querySelector(`[data-mot-ball="${id}"]`);
    if (selectedButton) { selectedButton.disabled = true; selectedButton.setAttribute('aria-pressed', 'true'); }
    drawMot();
    const count = host?.querySelector('#motSelectedCount');
    if (count) count.textContent = `${state.selected.length} / ${state.targetCount}`;
    if (state.selected.length < state.targetCount) {
      setFeedback(`已選 ${state.selected.length} 個，慢慢找回餘下目標。`, '');
      return;
    }
    state.locked = true;
    const correct = state.selected.every((item) => state.targets.includes(item));
    const found = state.selected.filter((item) => state.targets.includes(item)).length;
    state.reactionTimes.push(Date.now() - state.shownAt);
    if (correct) state.correct += state.targetCount; else { state.correct += found; state.incorrect += state.targetCount - found; }
    state.motPhase = 'result';
    drawMot();
    setFeedback(correct ? `✓ 全部找回了 ${state.targetCount} 個目標星球。` : `↗ 找回 ${found} / ${state.targetCount} 個目標；先休息一下，再試也可以。`, correct ? 'ok' : 'try');
    sleep(finishGame, correct ? 900 : 1200);
  }

  function createMotBalls(count) {
    return Array.from({ length: count }, (_, id) => {
      const column = id % 3;
      const row = Math.floor(id / 3);
      return { id, x: 104 + (column * 196) + ((row % 2) * 22), y: 68 + (row * 102), dx: (id % 2 ? 1 : -1) * (1.35 + ((id % 3) * .18)), dy: (id % 3 === 0 ? 1 : -1) * (1.16 + ((id % 2) * .22)), r: 23, target: false };
    });
  }

  function startGame(game) {
    clearTimers();
    const settings = grade();
    if (game === 'cpt') {
      createRun(game, settings.cptTrials);
      state.sequence = buildCpt(settings.cptTrials);
      renderCpt();
    } else if (game === 'nback') {
      createRun(game, settings.nBackTrials);
      state.n = 1;
      state.successStreak = 0;
      state.history = [];
      renderNBack();
    } else if (game === 'stroop') {
      createRun(game, settings.stroopTrials);
      renderStroop();
    } else if (game === 'nogo') {
      createRun(game, settings.nogoTrials);
      state.sequence = Array.from({ length: settings.nogoTrials }, (_, index) => index % 5 === 3 ? 'stop' : 'go');
      state.sequence = shuffle(state.sequence);
      if (!state.sequence.includes('stop')) state.sequence[0] = 'stop';
      renderNoGo();
    } else if (game === 'flanker') {
      createRun(game, settings.flankerTrials);
      renderFlanker();
    } else if (game === 'switch') {
      createRun(game, settings.switchTrials);
      state.rule = 'color';
      state.successStreak = 0;
      state.switchTrigger = settings.switchTrigger;
      renderSwitch();
    } else if (game === 'corsi') {
      createRun(game, settings.corsiTrials);
      state.span = settings.corsiStart;
      state.successStreak = 0;
      state.sequence = newCorsiSequence(state.span);
      startCorsiDisplay();
    } else if (game === 'schulte') {
      const total = settings.schulteSize ** 2;
      createRun(game, total);
      state.expected = 1;
      state.numbers = shuffle(Array.from({ length: total }, (_, index) => index + 1));
      state.shownAt = Date.now();
      renderSchulte();
    } else if (game === 'mot') {
      createRun(game, settings.motTargets);
      state.balls = createMotBalls(settings.motBalls);
      state.targets = shuffle(state.balls.map((ball) => ball.id)).slice(0, settings.motTargets);
      state.balls.forEach((ball) => { ball.target = state.targets.includes(ball.id); });
      state.targetCount = settings.motTargets;
      state.selected = [];
      state.motPhase = 'preview';
      renderMot();
    }
  }

  function handleKeyboard(event) {
    if (!host) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      const controls = focusable();
      const first = controls[0];
      const last = controls.at(-1);
      if (first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }
    if (state?.game === 'mot' && state.motPhase === 'choose' && /^[1-9]$/.test(event.key)) {
      event.preventDefault();
      selectMotBall(Number(event.key) - 1);
      return;
    }
    state?.keyHandler?.(event.key);
  }

  function close({ restoreFocus = true } = {}) {
    clearTimers();
    document.removeEventListener('keydown', handleKeyboard);
    const focusTarget = returnFocus;
    host?.remove();
    host = null;
    state = null;
    returnFocus = null;
    if (restoreFocus && focusTarget?.isConnected) window.requestAnimationFrame(() => focusTarget.focus());
  }

  function injectStyles() {
    if (document.getElementById('adhd-graded-lab-styles')) return;
    const style = document.createElement('style');
    style.id = 'adhd-graded-lab-styles';
    style.textContent = `
      .graded-lab-shell{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:16px;background:rgba(18,32,58,.68);backdrop-filter:blur(7px)}
      .graded-lab{width:min(920px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,30px);border:1px solid rgba(255,255,255,.85);border-radius:28px;background:radial-gradient(circle at 95% 2%,#fff8d8 0,transparent 22%),linear-gradient(145deg,#fffefa,#f4f8ff);box-shadow:0 24px 70px rgba(9,24,52,.38);color:#253650}
      .graded-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.graded-top h2{margin:5px 0 7px;font-size:clamp(25px,4.2vw,36px);line-height:1.12;color:#203451}.graded-top p{max-width:680px;margin:0;color:#5c708a;font-size:14px;line-height:1.6}.graded-eyebrow{color:#8d6200;font-size:11px;font-weight:900;letter-spacing:.1em}.graded-close{width:44px;min-width:44px;height:44px;border:0;border-radius:50%;background:#eaf0f7;color:#3e526f;font-size:24px;font-weight:900}.graded-close:active,.graded-response:active,.graded-primary:active,.graded-secondary:active,.graded-game-card:active,.graded-color-choice:active{transform:scale(.97)}
      .graded-game-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px;margin-top:24px}.graded-game-card{min-height:180px;padding:17px;display:flex;flex-direction:column;align-items:flex-start;border:2px solid #dbe5ef;border-radius:20px;background:#fff;color:#2a405e;text-align:left;transition:transform .16s,border-color .16s,box-shadow .16s}.graded-game-card:hover{transform:translateY(-2px);border-color:#9d8134;box-shadow:0 12px 24px rgba(48,73,105,.12)}.graded-game-card>span{font-size:31px}.graded-game-card strong{margin-top:10px;font-size:18px}.graded-game-card small{margin-top:3px;color:#756320;font-weight:850}.graded-game-card p{margin:8px 0;color:#62758e;font-size:12px;line-height:1.5}.graded-game-card em{margin-top:auto;color:#7e6a28;font-size:11px;font-style:normal;font-weight:850}
      .graded-support,.graded-rule,.graded-note{margin-top:18px;padding:13px 15px;border-left:4px solid #d6a522;border-radius:12px;background:#fff7da;color:#684f09;font-size:13px;line-height:1.55}.graded-support strong{display:block}.graded-support span{display:block;margin-top:3px;color:#80691c}.graded-progress{height:10px;margin-top:19px;overflow:hidden;border-radius:999px;background:#e6edf5}.graded-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#e4b232,#62b797);transition:width .2s}
      .graded-stimulus{min-height:172px;margin:20px auto 16px;display:grid;place-items:center;border-radius:25px;background:#fff;box-shadow:0 15px 32px rgba(48,73,105,.12);font-size:clamp(72px,16vw,132px);font-weight:950}.graded-stimulus.cpt{color:#425777}.graded-stimulus.nback{font-size:clamp(72px,16vw,126px)}.graded-stimulus.stroop{font-size:clamp(62px,15vw,116px);letter-spacing:.1em}.graded-stimulus.nogo{width:min(250px,78vw);min-height:250px;border-radius:50%;color:#fff;box-shadow:inset 0 0 0 14px rgba(255,255,255,.3),0 15px 32px rgba(48,73,105,.16);font-size:clamp(54px,12vw,90px);line-height:1}.graded-stimulus.nogo strong{display:block;margin-top:-22px;font-size:22px}.graded-stimulus.nogo.go{background:#35a879}.graded-stimulus.nogo.stop{background:#cf5264}
      .graded-response{display:block;min-width:min(100%,370px);min-height:58px;margin:0 auto;border:0;border-radius:17px;background:#6758bf;color:#fff;font-size:16px;font-weight:900;box-shadow:0 9px 18px rgba(78,61,166,.2)}.graded-response span{display:block;margin-top:2px;color:#e7e2ff;font-size:11px}.graded-feedback{min-height:28px;margin:16px auto 0;color:#5b6d86;text-align:center;font-size:14px;font-weight:850;line-height:1.5}.graded-feedback.ok{color:#17765f}.graded-feedback.try{color:#ad4355}
      .graded-history{display:flex;justify-content:center;gap:9px;min-height:54px;margin-top:16px}.graded-history span{display:grid;place-items:center;min-width:55px;padding:6px 10px;border-radius:14px;background:#eceafb;color:#5646aa;font-size:25px;font-weight:900}.graded-history small{display:block;color:#7568ae;font-size:9px}.graded-color-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-width:520px;margin:0 auto}.graded-color-choice{min-height:54px;border:2px solid var(--choice);border-radius:15px;background:#fff;color:#344963;font-size:15px;font-weight:900}.graded-color-choice span{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:7px;border-radius:50%;background:var(--choice);color:#fff;font-size:11px}
      .graded-flanker{display:grid;place-items:center;min-height:168px;margin:20px 0;border-radius:24px;background:#fff;box-shadow:0 15px 32px rgba(48,73,105,.12);color:#364a67}.graded-flanker span{font-size:clamp(48px,11vw,92px);font-weight:950;letter-spacing:.02em}.graded-flanker small{margin-top:8px;color:#76869c;font-size:12px}.graded-direction-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;max-width:500px;margin:0 auto}.graded-direction{min-height:58px;border:2px solid #b8c8df;border-radius:17px;background:#fff;color:#324860;font-size:16px;font-weight:900}.graded-direction span{display:block;margin-top:2px;color:#75869b;font-size:11px}.graded-card-target{display:grid;justify-items:center;gap:6px;margin-top:18px;color:#687b93;font-size:12px;font-weight:900}.graded-card-choices{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:14px}.graded-rule-card{min-height:110px;padding:10px 6px;border:2px solid #dbe5ef;border-radius:18px;background:#fff;color:#40546e;transition:transform .15s,border-color .15s}.graded-rule-card:hover{border-color:#aa89cf;transform:translateY(-2px)}.graded-rule-card.target{width:132px;border-color:#d0b05b;background:#fffdf1}.card-shapes{display:block;color:#8a67bb;font-size:27px;letter-spacing:-.1em}.graded-rule-card small{display:block;margin-top:6px;font-size:11px;font-weight:900}.graded-corsi-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;max-width:420px;margin:22px auto}.graded-corsi-cell{aspect-ratio:1;min-height:74px;border:2px solid #c8d7e7;border-radius:19px;background:#dfe9f4;color:#526880;font-size:0;transition:transform .16s,background .16s,border-color .16s}.graded-corsi-cell span{font-size:12px;font-weight:900}.graded-corsi-cell.flash{border-color:#7656bf;background:#8068d6;color:#fff;box-shadow:0 0 0 5px rgba(128,104,214,.18);transform:scale(1.06)}.graded-corsi-cell.selected{border-color:#299a79;background:#dff7ed;color:#176b56}
      .graded-schulte-meta{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:19px}.graded-schulte-meta span{padding:7px 10px;border-radius:999px;background:#eaf1f8;color:#57708b;font-size:12px;font-weight:800}.graded-schulte-meta strong{color:#5946b1}.graded-schulte-grid{display:grid;gap:8px;max-width:520px;margin:19px auto}.graded-schulte-grid.size-3{grid-template-columns:repeat(3,1fr);max-width:360px}.graded-schulte-grid.size-4{grid-template-columns:repeat(4,1fr);max-width:430px}.graded-schulte-grid.size-5{grid-template-columns:repeat(5,1fr)}.graded-schulte-cell{aspect-ratio:1;min-height:48px;border:2px solid #c6d7e8;border-radius:13px;background:#fff;color:#334b68;font-size:clamp(16px,4vw,22px);font-weight:900}.graded-schulte-cell:hover:not(:disabled){border-color:#7b62bf;background:#f5f2ff}.graded-schulte-cell:disabled{border-color:#a6dcc8;background:#e5f7ee;color:#1b7960}.graded-mot-canvas{display:block;width:100%;max-width:600px;height:auto;margin:20px auto 0;border:3px solid #9cb7d5;border-radius:23px;background:#163866;touch-action:manipulation}.graded-mot-canvas:focus-visible{outline:4px solid #f1bf35;outline-offset:4px}.graded-mot-keyboard{max-width:600px;margin:10px auto 0;color:#60748e;text-align:center;font-size:12px;font-weight:750}
      .graded-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin-top:23px}.graded-summary div{padding:16px 10px;border-radius:17px;background:#fff;text-align:center;box-shadow:0 8px 18px rgba(48,73,105,.08)}.graded-summary span{display:block;color:#73849b;font-size:11px;font-weight:800}.graded-summary strong{display:block;margin-top:5px;color:#30445f;font-size:27px}.graded-actions{display:flex;justify-content:center;gap:10px;margin-top:20px}.graded-primary,.graded-secondary{min-height:48px;padding:0 18px;border-radius:14px;font-size:14px;font-weight:900}.graded-primary{border:0;background:#6758bf;color:#fff}.graded-secondary{border:1px solid #cbd7e5;background:#fff;color:#4e627e}
      .graded-lab button:focus-visible{outline:4px solid #0d5f9c;outline-offset:3px}.graded-lab button:disabled{cursor:not-allowed;opacity:.62}
      @media (max-width:640px){.graded-lab{padding:19px}.graded-game-grid{grid-template-columns:1fr}.graded-game-card{min-height:145px}.graded-summary{grid-template-columns:1fr}.graded-stimulus{min-height:145px}.graded-actions{flex-direction:column}.graded-primary,.graded-secondary{width:100%}.graded-card-choices{grid-template-columns:repeat(2,minmax(0,1fr))}.graded-rule-card{min-height:92px}.graded-corsi-grid{gap:9px}.graded-corsi-cell{min-height:62px}}
      @media (prefers-reduced-motion:reduce){.graded-game-card,.graded-progress i{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  window.ADHD_GRADED_LAB = {
    open(nextOptions = {}) {
      close({ restoreFocus: false });
      options = nextOptions;
      stage = GRADE[nextOptions.stage] ? nextOptions.stage : 'lower';
      returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      injectStyles();
      host = document.createElement('div');
      host.id = 'adhdGradedLabRoot';
      document.body.appendChild(host);
      document.addEventListener('keydown', handleKeyboard);
      renderMenu();
    },
  };
})();
