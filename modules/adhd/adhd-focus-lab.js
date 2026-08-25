(() => {
  const COLORS = {
    紅色: '#e34f62',
    藍色: '#2c7de8',
    綠色: '#1b9d79',
    黃色: '#d49d14',
  };

  const LABELS = {
    stroop: '短衝刺 · 色字反應',
    nogo: '中段 · 停／按反應',
    sustain: '續航 · 目標搜尋',
    dual: '進階 · 雙線任務',
  };

  const stroopSeeds = [
    ['紅', '藍色'], ['藍', '黃色'], ['綠', '紅色'], ['黃', '綠色'],
    ['藍', '紅色'], ['紅', '黃色'], ['黃', '藍色'], ['綠', '黃色'],
  ];
  const noGoSeeds = ['go', 'stop', 'go', 'go', 'stop', 'go', 'stop', 'go', 'go', 'stop', 'go', 'stop', 'go', 'go'];
  const sustainSeeds = [
    ['★', '藍色'], ['●', '紅色'], ['▲', '黃色'], ['■', '藍色'], ['★', '紅色'], ['●', '藍色'], ['★', '藍色'], ['▲', '綠色'], ['■', '黃色'],
    ['●', '黃色'], ['▲', '黃色'], ['■', '藍色'], ['●', '黃色'], ['★', '紅色'], ['▲', '黃色'], ['■', '綠色'], ['●', '黃色'], ['★', '藍色'],
  ];
  const dualSeeds = [
    { symbol: '◆', number: 6, word: '紅', colorName: '綠色', decoy: 3 },
    { symbol: '●', number: 2, word: '黃', colorName: '藍色', decoy: 5 },
    { symbol: '▲', number: 8, word: '藍', colorName: '紅色', decoy: 4 },
    { symbol: '■', number: 5, word: '綠', colorName: '黃色', decoy: 9 },
    { symbol: '★', number: 3, word: '黃', colorName: '紅色', decoy: 7 },
    { symbol: '⬟', number: 7, word: '紅', colorName: '藍色', decoy: 1 },
  ];

  let host = null;
  let options = null;
  let state = null;
  let autoTimer = null;
  let nextTimer = null;
  let returnFocus = null;
  let returnFocusSelector = '';

  function clearTimers() {
    window.clearTimeout(autoTimer);
    window.clearTimeout(nextTimer);
    autoTimer = null;
    nextTimer = null;
  }

  function getFocusableControls() {
    if (!host) return [];
    return [...host.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.offsetParent !== null);
  }

  function handleKeyboard(event) {
    if (!host) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = getFocusableControls();
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function focusInitialControl() {
    window.requestAnimationFrame(() => host?.querySelector('.focus-lab-close')?.focus());
  }

  function injectStyles() {
    if (document.getElementById('adhd-focus-lab-styles')) return;
    const style = document.createElement('style');
    style.id = 'adhd-focus-lab-styles';
    style.textContent = `
      .adhd-lab-entry,.adhd-lab-summary{margin-top:13px;padding:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #e5cf7e;border-radius:13px;background:rgba(255,255,255,.6)}
      .adhd-lab-entry strong,.adhd-lab-summary strong{display:block;color:#725300;font-size:12px}.adhd-lab-entry span,.adhd-lab-summary span{display:block;margin-top:4px;color:#8d7937;font-size:10px;font-weight:720;line-height:1.45}.adhd-lab-entry .timer-control{flex:0 0 auto}
      .focus-lab-shell{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:18px;background:rgba(20,35,61,.62);backdrop-filter:blur(6px)}
      .focus-lab{width:min(100%,900px);max-height:min(760px,94vh);overflow:auto;padding:clamp(18px,3vw,30px);border:1px solid rgba(255,255,255,.7);border-radius:28px;background:radial-gradient(circle at 90% 0%,rgba(255,255,255,.78),transparent 23%),linear-gradient(135deg,#fffdf6,#f6fbff);box-shadow:0 22px 65px rgba(13,29,55,.35);color:#263852}
      .focus-lab-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.focus-lab-kicker{color:#aa7b08;font-size:11px;font-weight:900;letter-spacing:.08em}.focus-lab h2{margin:5px 0 7px;color:#23334d;font-size:clamp(24px,4vw,34px);letter-spacing:-.04em}.focus-lab p{margin:0;color:#5e718b;font-size:14px;line-height:1.55}.focus-lab-close{width:40px;height:40px;flex:0 0 auto;border:0;border-radius:50%;background:#eff3f8;color:#465873;font-size:21px;font-weight:800}
      .focus-mode-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:24px}.focus-mode{min-height:210px;padding:18px;display:flex;flex-direction:column;align-items:flex-start;border:2px solid #e2e9f2;border-radius:20px;background:#fff;text-align:left;transition:transform .18s,border-color .18s,box-shadow .18s}.focus-mode:hover{transform:translateY(-3px);border-color:#b99a36;box-shadow:0 12px 24px rgba(74,91,119,.12)}.focus-mode .focus-icon{font-size:34px}.focus-mode strong{margin-top:16px;color:#33445f;font-size:18px}.focus-mode span{margin-top:8px;color:#667991;font-size:12px;line-height:1.55}.focus-mode small{margin-top:auto;color:#9c7616;font-size:11px;font-weight:850}
      .focus-rule{margin-top:20px;padding:13px 15px;border-left:4px solid #e0af2d;border-radius:10px;background:#fff8df;color:#674e08;font-weight:800;line-height:1.5}.focus-status{margin-top:18px;display:flex;justify-content:space-between;gap:10px;color:#687b93;font-size:12px;font-weight:800}.focus-progress{height:9px;margin-top:8px;overflow:hidden;border-radius:999px;background:#e8eef5}.focus-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#e6b83e,#74bc9f);transition:width .25s}
      .focus-stimulus-wrap{min-height:270px;margin-top:22px;display:grid;place-items:center}.focus-stroop{font-size:clamp(62px,13vw,118px);font-weight:950;letter-spacing:.12em;line-height:1}.focus-signal{width:min(220px,70vw);height:220px;display:grid;place-items:center;border:0;border-radius:50%;font-size:clamp(55px,10vw,86px);font-weight:950;box-shadow:inset 0 0 0 13px rgba(255,255,255,.35),0 15px 30px rgba(38,58,87,.18)}.focus-signal.go{background:#39b686;color:#fff}.focus-signal.stop{background:#e25769;color:#fff}.focus-shape{width:min(250px,72vw);height:190px;display:grid;place-items:center;border-radius:26px;background:#fff;box-shadow:0 14px 30px rgba(38,58,87,.13);font-size:104px;font-weight:900}
      .focus-dual-code{min-width:min(360px,82vw);padding:24px;border:2px solid #a598df;border-radius:24px;background:linear-gradient(135deg,#f5f2ff,#fff);box-shadow:0 16px 34px rgba(85,72,167,.15);text-align:center}.focus-dual-code span{display:block;color:#7b6bc4;font-size:12px;font-weight:900;letter-spacing:.1em}.focus-dual-code strong{display:block;margin-top:8px;color:#44379a;font-size:clamp(58px,12vw,100px);letter-spacing:.08em}.focus-dual-recall{margin-top:4px;color:#566a85;text-align:center;font-size:15px;font-weight:850;line-height:1.5}
      .focus-choices{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:20px}.focus-choice{min-width:112px;min-height:62px;padding:0 17px;border:2px solid #dce5ef;border-radius:16px;background:#fff;color:#34465f;font-size:15px;font-weight:900;transition:transform .14s,border-color .14s,background .14s}.focus-choice:hover{transform:translateY(-2px);border-color:#a98724}.focus-choice:active{transform:scale(.97)}.focus-choice.collect{color:#147862;border-color:#a5dcca;background:#f0fbf7}.focus-choice.skip{color:#805f10;border-color:#ecd287;background:#fffaf0}.focus-instruction{margin-top:15px;color:#5c708b;text-align:center;font-size:13px;font-weight:780;line-height:1.5}.focus-feedback{min-height:24px;margin-top:16px;text-align:center;font-weight:900}.focus-feedback.ok{color:#187e68}.focus-feedback.try{color:#b14659}
      .focus-results{margin-top:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.focus-result{padding:16px;border-radius:16px;background:#fff;text-align:center;box-shadow:0 8px 18px rgba(38,58,87,.07)}.focus-result span{display:block;color:#718198;font-size:11px;font-weight:800}.focus-result strong{display:block;margin-top:6px;color:#2d405d;font-size:28px}.focus-result small{display:block;margin-top:6px;color:#7a8da4;font-size:11px;line-height:1.4}.focus-footer{display:flex;justify-content:center;gap:10px;margin-top:22px}.focus-primary,.focus-secondary{min-height:46px;padding:0 17px;border-radius:13px;font-size:13px;font-weight:900}.focus-primary{border:0;background:#6a58c8;color:#fff}.focus-secondary{border:1px solid #ccd7e5;background:#fff;color:#50627b}
      @media (max-width:680px){.focus-mode-grid{grid-template-columns:1fr}.focus-mode{min-height:132px}.focus-results{grid-template-columns:1fr}.focus-lab{padding:20px}.focus-lab-top h2{font-size:26px}.focus-stimulus-wrap{min-height:230px}}
    `;
    document.head.appendChild(style);
  }

  function buildTrials(mode) {
    if (mode === 'stroop') return stroopSeeds.map(([word, answer]) => ({ type: 'stroop', word, answer, color: COLORS[answer] }));
    if (mode === 'nogo') return noGoSeeds.map(signal => ({ type: 'nogo', signal, answer: signal === 'go' ? 'press' : 'wait' }));
    if (mode === 'dual') return dualSeeds.map(item => ({ type: 'dual', ...item }));
    return sustainSeeds.map(([shape, color]) => ({ type: 'sustain', shape, color, answer: color === '黃色' && shape === '▲' ? 'collect' : 'skip' }));
  }

  function shell(content) {
    host.innerHTML = `<div class="focus-lab-shell" role="dialog" aria-modal="true" aria-label="ADHD 專注實驗室"><section class="focus-lab">${content}</section></div>`;
    host.querySelector('.focus-lab-close')?.addEventListener('click', close);
  }

  function renderHome() {
    state = null;
    shell(`<div class="focus-lab-top"><div><div class="focus-lab-kicker">ADHD · 分級專注訓練</div><h2>專注實驗室</h2><p>選一種合適的挑戰。可以隨時退出、休息或改用較短的回合；紀錄只顯示本次嘗試。</p></div><button class="focus-lab-close" type="button" aria-label="關閉">×</button></div><div class="focus-mode-grid"><button class="focus-mode" type="button" data-mode="stroop"><span class="focus-icon">🎨</span><strong>短衝刺</strong><span>8 題色字干擾。不要按字的意思，按文字真正的顏色。</span><small>色字反應 · 約 1–2 分鐘</small></button><button class="focus-mode" type="button" data-mode="nogo"><span class="focus-icon">🚦</span><strong>中段反應</strong><span>14 次按／停練習。綠色按一下，紅色不按並等候。</span><small>反應抑制 · 約 2–3 分鐘</small></button><button class="focus-mode" type="button" data-mode="sustain"><span class="focus-icon">🔍</span><strong>續航挑戰</strong><span>18 張目標卡。按規則找目標，並在中段轉換規則。</span><small>持續注意 · 約 3–5 分鐘</small></button><button class="focus-mode" type="button" data-mode="dual"><span class="focus-icon">🧩</span><strong>雙線任務</strong><span>先記住密碼，再完成色字判斷，最後回想密碼數字。</span><small>中高年級 · 約 3–5 分鐘</small></button></div><div class="focus-rule">教師可先說：「這不是速度比賽。你可以先看規則、慢慢作答，或隨時按暫停回到課堂工具。」</div>`);
    host.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => start(button.dataset.mode)));
  }

  function start(mode) {
    state = { mode, trials: buildTrials(mode), index: 0, correct: 0, incorrect: 0, reactionTimes: [], startedAt: Date.now(), trialStartedAt: Date.now(), locked: false, dualPhase: mode === 'dual' ? 'preview' : null, dualClassifyCorrect: false };
    renderTrial();
  }

  function progress() {
    return Math.round((state.index / state.trials.length) * 100);
  }

  function renderTrial() {
    clearTimers();
    const trial = state.trials[state.index];
    state.locked = false;
    state.trialStartedAt = Date.now();
    if (state.mode === 'dual') { renderDualTrial(trial); return; }
    const modeIntro = state.mode === 'stroop' ? '不要按字的意思；請按文字真正的顏色。' : state.mode === 'nogo' ? '綠色才按；紅色不要按，安靜等候。' : state.index < 9 ? '第一段規則：只收集黃色三角形。' : '第二段規則：仍然只收集黃色三角形；慢慢看完每張卡。';
    let stimulus = '';
    let controls = '';
    if (trial.type === 'stroop') {
      stimulus = `<div class="focus-stroop" style="color:${trial.color}">${trial.word}</div>`;
      controls = `<div class="focus-choices">${Object.keys(COLORS).map(label => `<button class="focus-choice" type="button" data-answer="${label}" style="border-color:${COLORS[label]}">${label}</button>`).join('')}</div>`;
    } else if (trial.type === 'nogo') {
      const isGo = trial.signal === 'go';
      stimulus = `<button class="focus-signal ${isGo ? 'go' : 'stop'}" type="button" data-answer="press" aria-label="${isGo ? '綠色，按一下' : '紅色，不用按'}">${isGo ? '按' : '停'}</button>`;
      controls = `<div class="focus-instruction">${isGo ? '看到綠色，按一下中間的圓形。' : '看到紅色，不用按；等一下它會自己換下一張。'}</div>`;
      if (!isGo) autoTimer = window.setTimeout(() => respond('wait', true), 1100);
    } else {
      stimulus = `<div class="focus-shape" style="color:${COLORS[trial.color]}">${trial.shape}</div>`;
      controls = `<div class="focus-choices"><button class="focus-choice collect" type="button" data-answer="collect">★ 收集目標</button><button class="focus-choice skip" type="button" data-answer="skip">→ 略過這張</button></div>`;
    }
    shell(`<div class="focus-lab-top"><div><div class="focus-lab-kicker">${LABELS[state.mode]}</div><h2>專注挑戰</h2><p>${modeIntro}</p></div><button class="focus-lab-close" type="button" aria-label="關閉">×</button></div><div class="focus-status"><span>第 ${state.index + 1} / ${state.trials.length} 題</span><span>已完成 ${state.correct} 題</span></div><div class="focus-progress" role="progressbar" aria-label="專注挑戰進度" aria-valuemin="0" aria-valuemax="${state.trials.length}" aria-valuenow="${state.index}" aria-valuetext="第 ${state.index + 1} / ${state.trials.length} 題"><i style="width:${progress()}%"></i></div><div class="focus-rule">${state.mode === 'sustain' ? (state.index < 9 ? '找「黃色三角形」才按收集。' : '規則保持一樣：仍然只找「黃色三角形」。') : modeIntro}</div><div class="focus-stimulus-wrap">${stimulus}</div>${controls}<div class="focus-feedback" role="status" aria-live="polite" aria-atomic="true"></div>`);
    host.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => respond(button.dataset.answer)));
  }

  function renderDualTrial(trial) {
    const base = `<div class="focus-lab-top"><div><div class="focus-lab-kicker">${LABELS.dual}</div><h2>雙線任務</h2><p>先保持密碼，再在干擾下做判斷，最後回想密碼數字。</p></div><button class="focus-lab-close" type="button" aria-label="關閉">×</button></div><div class="focus-status"><span>第 ${state.index + 1} / ${state.trials.length} 組</span><span>完成 ${state.correct} 組</span></div><div class="focus-progress" role="progressbar" aria-label="雙線任務進度" aria-valuemin="0" aria-valuemax="${state.trials.length}" aria-valuenow="${state.index}" aria-valuetext="第 ${state.index + 1} / ${state.trials.length} 組"><i style="width:${progress()}%"></i></div>`;
    if (state.dualPhase === 'preview') {
      shell(`${base}<div class="focus-rule">第一步：只需記住密碼的數字。下一步會出現顏色判斷。</div><div class="focus-stimulus-wrap"><div class="focus-dual-code"><span>暫存密碼</span><strong>${trial.symbol} ${trial.number}</strong></div></div><div class="focus-instruction">先把數字放在心裡。畫面很快會轉到顏色判斷。</div>`);
      autoTimer = window.setTimeout(() => { state.dualPhase = 'classify'; renderTrial(); }, 1400);
      return;
    }
    if (state.dualPhase === 'classify') {
      shell(`${base}<div class="focus-rule">第二步：不要按字義；請選文字真正的顏色，同時記住剛才的數字。</div><div class="focus-stimulus-wrap"><div class="focus-stroop" style="color:${COLORS[trial.colorName]}">${trial.word}</div></div><div class="focus-choices">${Object.keys(COLORS).map(label => `<button class="focus-choice" type="button" data-dual-color="${label}" style="border-color:${COLORS[label]}">${label}</button>`).join('')}</div><div class="focus-feedback" role="status" aria-live="polite" aria-atomic="true"></div>`);
      host.querySelectorAll('[data-dual-color]').forEach(button => button.addEventListener('click', () => respondDualColor(button.dataset.dualColor)));
      return;
    }
    shell(`${base}<div class="focus-rule">第三步：剛才的密碼數字是甚麼？</div><div class="focus-stimulus-wrap"><div class="focus-dual-code"><span>回想剛才的密碼</span><strong>${trial.symbol} ？</strong></div></div><div class="focus-dual-recall">不用急；想一想顏色判斷前出現的數字。</div><div class="focus-choices"><button class="focus-choice" type="button" data-dual-number="${trial.number}">${trial.number}</button><button class="focus-choice" type="button" data-dual-number="${trial.decoy}">${trial.decoy}</button></div><div class="focus-feedback" role="status" aria-live="polite" aria-atomic="true"></div>`);
    host.querySelectorAll('[data-dual-number]').forEach(button => button.addEventListener('click', () => respondDualNumber(Number(button.dataset.dualNumber))));
  }

  function respondDualColor(answer) {
    if (!state || state.locked) return;
    state.locked = true;
    const trial = state.trials[state.index];
    state.dualClassifyCorrect = answer === trial.colorName;
    state.reactionTimes.push(Date.now() - state.trialStartedAt);
    const feedback = host.querySelector('.focus-feedback');
    feedback.className = state.dualClassifyCorrect ? 'focus-feedback ok' : 'focus-feedback try';
    feedback.textContent = state.dualClassifyCorrect ? '✓ 顏色判斷完成。現在回想剛才的數字。' : '↗ 顏色線索已過去。現在仍可慢慢回想剛才的數字。';
    nextTimer = window.setTimeout(() => { state.dualPhase = 'recall'; renderTrial(); }, state.dualClassifyCorrect ? 560 : 850);
  }

  function respondDualNumber(answer) {
    if (!state || state.locked) return;
    state.locked = true;
    const trial = state.trials[state.index];
    const recallCorrect = answer === trial.number;
    state.reactionTimes.push(Date.now() - state.trialStartedAt);
    const cycleCorrect = state.dualClassifyCorrect && recallCorrect;
    if (cycleCorrect) state.correct += 1; else state.incorrect += 1;
    const feedback = host.querySelector('.focus-feedback');
    feedback.className = cycleCorrect ? 'focus-feedback ok' : 'focus-feedback try';
    feedback.textContent = cycleCorrect ? '✓ 你同時保持了密碼和顏色規則。' : '↗ 這一組已完成；下一組可先把數字放在心裡，再慢慢判斷。';
    nextTimer = window.setTimeout(() => {
      state.index += 1;
      state.dualPhase = 'preview';
      state.dualClassifyCorrect = false;
      if (state.index >= state.trials.length) finish(); else renderTrial();
    }, cycleCorrect ? 620 : 900);
  }

  function respond(answer, auto = false) {
    if (!state || state.locked) return;
    state.locked = true;
    clearTimers();
    const trial = state.trials[state.index];
    const correct = answer === trial.answer;
    const elapsed = Date.now() - state.trialStartedAt;
    const feedback = host.querySelector('.focus-feedback');
    if (correct) {
      state.correct += 1;
      if (!auto) state.reactionTimes.push(elapsed);
      feedback.className = 'focus-feedback ok';
      feedback.textContent = auto ? '✓ 你成功停一停並等候。' : '✓ 做得好，繼續下一張。';
    } else {
      state.incorrect += 1;
      feedback.className = 'focus-feedback try';
      feedback.textContent = trial.type === 'nogo' ? '↗ 這張是紅色，下一張我們先停一停。' : '↗ 先看規則，再慢慢試下一張。';
    }
    nextTimer = window.setTimeout(() => {
      state.index += 1;
      if (state.index >= state.trials.length) finish(); else renderTrial();
    }, correct ? 520 : 850);
  }

  function finish() {
    clearTimers();
    const averageMs = state.reactionTimes.length ? Math.round(state.reactionTimes.reduce((total, value) => total + value, 0) / state.reactionTimes.length) : 0;
    const result = { label: LABELS[state.mode], mode: state.mode, total: state.trials.length, correct: state.correct, incorrect: state.incorrect, averageMs, completedAt: new Date().toLocaleString('zh-HK') };
    options?.onComplete?.(result);
    const gentleNote = state.incorrect ? '這是一次本節嘗試的回顧；可在休息後重玩較短模式，或改回一般 ADHD 關卡。' : '你完成了一段專注挑戰。可以休息、重玩，或回到一般 ADHD 關卡。';
    shell(`<div class="focus-lab-top"><div><div class="focus-lab-kicker">本次專注回顧</div><h2>完成挑戰</h2><p>${gentleNote}</p></div><button class="focus-lab-close" type="button" aria-label="關閉">×</button></div><div class="focus-results"><div class="focus-result"><span>正確完成</span><strong>${result.correct} / ${result.total}</strong><small>本次練習紀錄</small></div><div class="focus-result"><span>溫和重試</span><strong>${result.incorrect}</strong><small>可配合提示再試</small></div><div class="focus-result"><span>平均反應</span><strong>${averageMs ? `${averageMs}ms` : '—'}</strong><small>只供本次回顧</small></div></div><div class="focus-footer"><button class="focus-secondary" id="focusRestart" type="button">↺ 選另一種挑戰</button><button class="focus-primary" id="focusClose" type="button">回到 ADHD 關卡</button></div>`);
    host.querySelector('#focusRestart').addEventListener('click', renderHome);
    host.querySelector('#focusClose').addEventListener('click', close);
  }

  function close({ restoreFocus = true } = {}) {
    clearTimers();
    document.removeEventListener('keydown', handleKeyboard);
    const focusTarget = returnFocus;
    const focusSelector = returnFocusSelector;
    host?.remove();
    host = null;
    state = null;
    returnFocus = null;
    returnFocusSelector = '';
    if (restoreFocus) window.setTimeout(() => {
      if (focusTarget?.isConnected && focusTarget.offsetParent) { focusTarget.focus(); return; }
      const fallbackFocusTarget = [focusSelector, '#adhdFocusLabLaunch', '#startSuggested']
        .filter(Boolean).map((selector) => document.querySelector(selector)).find((element) => element?.isConnected && element.offsetParent);
      fallbackFocusTarget?.focus();
    }, 0);
  }

  window.ADHD_FOCUS_LAB = {
    open(nextOptions = {}) {
      close({ restoreFocus: false });
      options = nextOptions;
      returnFocus = nextOptions.trigger instanceof HTMLElement ? nextOptions.trigger : (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      returnFocusSelector = nextOptions.returnFocusSelector || (returnFocus?.id ? `#${returnFocus.id}` : '#adhdFocusLabLaunch');
      injectStyles();
      host = document.createElement('div');
      host.id = 'adhdFocusLabRoot';
      document.body.appendChild(host);
      document.addEventListener('keydown', handleKeyboard);
      renderHome();
      focusInitialControl();
    },
  };
})();
