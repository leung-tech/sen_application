/* Design philosophy: Visual-first hearing support lab — calm teal surfaces, clear text, optional audio, and gentle self-advocacy prompts. */
(function () {
  'use strict';

  const STAGE_LABELS = { lower: '初小 · P1–P3', upper: '高小 · P4–P6', junior: '初中 · S1–S3', senior: '高中 · S4–S6' };
  const rootId = 'hi8LabRoot';
  let state = null;
  let audioContext = null;
  let continueTimer = null;

  const games = {
    lower: [
      { key: 'rainbow', icon: '🌈', title: '聲波彩虹橋', focus: '高音與低音辨識', description: '按一下才播放聲音，再用星星或雲朵配對音高；每一步都有色彩線索。', steps: 8 },
      { key: 'tones', icon: '🎢', title: '廣東話聲調「過山車」', focus: '視覺化聲調曲線', description: '把平穩或向上走的音高線，配對到清楚的文字和軌道圖。', steps: 8 }
    ],
    upper: [
      { key: 'lips', icon: '🕵️', title: '神探唇讀術：校園密碼', focus: '口型與字卡提示', description: '先看清楚的嘴型圖與發音線索，再選出同學或老師的訊息。', steps: 8 },
      { key: 'expression', icon: '🙂', title: '表情與聲音的「連連看」', focus: '語氣與臉部線索', description: '用文字、語氣描述和表情一起理解完整溝通訊息。', steps: 8 }
    ],
    junior: [
      { key: 'noise', icon: '📡', title: '「課室開學：降噪大作戰」', focus: '信噪比與 FM 系統', description: '在視覺化嘈雜課室中，先開啟 FM 輔具，再找出班長提及的用品。', steps: 8 },
      { key: 'shield', icon: '🛡️', title: '小組研習的「溝通盾牌」', focus: '自我倡導對白', description: '遇到說話太快或背向說話時，練習提出清晰、禮貌的支援需要。', steps: 8 }
    ],
    senior: [
      { key: 'takeaway', icon: '🍜', title: '繁忙茶餐廳：外賣接單王', focus: '高噪環境關鍵詞', description: '閱讀訂單字幕與視覺噪音線索，逐步輸入食物、飲品要求及送貨樓層。', steps: 8 },
      { key: 'dse', icon: '🎧', title: 'DSE 聆聽試：無障礙考場模擬', focus: '輔具預檢與求助', description: '完成設備檢查，遇到訊號問題時練習即時舉手求助。', steps: 8 }
    ]
  };

  function ensureStyle() {
    if (document.getElementById('hi8LabStyle')) return;
    const style = document.createElement('style');
    style.id = 'hi8LabStyle';
    style.textContent = `
      /* Visual-first HI lab: roomy targets, strong text contrast, no automatic sound or flashing. */
      .hi8-lab{position:fixed;inset:0;z-index:9900;display:grid;place-items:center;padding:18px;background:rgba(9,31,48,.72);backdrop-filter:blur(7px);overflow:auto}.hi8-lab[hidden]{display:none}.hi8-panel{width:min(860px,100%);max-height:calc(100vh - 36px);overflow:auto;background:#f8fffe;color:#12313d;border-radius:26px;box-shadow:0 24px 70px rgba(3,22,31,.35);border:2px solid #d2ece8;padding:clamp(18px,3.4vw,34px)}.hi8-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}.hi8-kicker{font-size:.78rem;font-weight:800;letter-spacing:.08em;color:#267d78}.hi8-head h2{margin:4px 0 0;font-size:clamp(1.55rem,4vw,2.35rem);line-height:1.18}.hi8-close,.hi8-btn{min-height:52px;border:2px solid #abd9d4;border-radius:15px;background:#fff;color:#164652;font:inherit;font-weight:800;cursor:pointer;padding:12px 16px;touch-action:manipulation}.hi8-close{min-width:52px;font-size:1.35rem}.hi8-btn:hover,.hi8-btn:focus-visible{border-color:#18867e;outline:3px solid rgba(24,134,126,.23);outline-offset:2px}.hi8-btn:active{transform:scale(.98)}.hi8-primary{background:#167e77;color:#fff;border-color:#167e77}.hi8-quiet{background:#eaf8f6}.hi8-progress{margin:20px 0 16px}.hi8-progress-top{display:flex;justify-content:space-between;gap:12px;font-weight:800;font-size:.9rem}.hi8-progress-bar{height:10px;background:#e2f0ee;border-radius:999px;margin-top:8px;overflow:hidden}.hi8-progress-bar span{display:block;height:100%;background:linear-gradient(90deg,#4cbaa9,#4f94ca);border-radius:inherit;transition:width .22s cubic-bezier(.23,1,.32,1)}.hi8-intro,.hi8-status{padding:14px 16px;background:#eefaf8;border-left:5px solid #58afa4;border-radius:12px;line-height:1.65}.hi8-status{margin-top:14px;min-height:28px}.hi8-status[data-kind="gentle"]{background:#fff9e8;border-left-color:#e8b649}.hi8-menu{display:grid;gap:14px;margin:20px 0}.hi8-game-card{width:100%;min-height:132px;text-align:left;display:grid;grid-template-columns:66px 1fr auto;align-items:center;gap:16px;border:2px solid #c9e7e3;background:#fff;border-radius:20px;padding:16px;cursor:pointer}.hi8-game-card:hover,.hi8-game-card:focus-visible{border-color:#21877f;box-shadow:0 8px 20px rgba(31,125,116,.13);outline:3px solid rgba(32,137,127,.2)}.hi8-game-icon{width:58px;height:58px;display:grid;place-items:center;border-radius:18px;background:#e9f8f5;font-size:2rem}.hi8-game-card h3{margin:0 0 5px;font-size:1.23rem}.hi8-game-card p{margin:0;line-height:1.5;color:#44606a}.hi8-arrow{font-size:1.6rem;color:#167e77}.hi8-play{margin-top:12px}.hi8-prompt{font-size:clamp(1.25rem,3.3vw,1.75rem);font-weight:850;line-height:1.42;margin:12px 0}.hi8-visual{min-height:150px;border:2px solid #cfe9e6;background:linear-gradient(135deg,#f2fcfb,#edf5ff);border-radius:22px;padding:20px;display:grid;place-items:center;text-align:center}.hi8-symbol{font-size:4.25rem;line-height:1}.hi8-caption{font-size:1.05rem;font-weight:800;margin-top:10px}.hi8-choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin:18px 0}.hi8-choice{min-height:96px;padding:15px;border:2px solid #b8dfda;border-radius:18px;background:#fff;color:#153c48;font:inherit;font-weight:850;font-size:1.05rem;cursor:pointer;line-height:1.35}.hi8-choice:hover,.hi8-choice:focus-visible{border-color:#167e77;background:#effaf8;outline:3px solid rgba(22,126,119,.2);outline-offset:2px}.hi8-controls{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;border-top:1px solid #d9ece9;padding-top:16px}.hi8-controls .hi8-btn{min-height:48px}.hi8-wave{display:flex;align-items:center;justify-content:center;gap:5px;height:74px}.hi8-wave i{display:block;width:10px;border-radius:10px;background:#388fc5}.hi8-line{width:min(500px,100%);height:75px;position:relative;margin:auto}.hi8-line svg{width:100%;height:100%}.hi8-lip{display:flex;gap:18px;align-items:center;justify-content:center}.hi8-mouth{width:142px;height:75px;border:8px solid #a85a62;border-radius:50%;background:#fff3f4;display:grid;place-items:center;font-size:2.5rem}.hi8-noise{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;opacity:.88}.hi8-noise span{padding:8px 10px;border-radius:10px;background:#f1dddd;color:#6e4141;font-weight:800}.hi8-fm-on .hi8-noise{opacity:.18;filter:blur(1px)}.hi8-checklist{display:grid;gap:12px;margin:16px 0}.hi8-check{min-height:64px;width:100%;text-align:left;padding:12px 16px;border:2px solid #b8dfda;background:#fff;border-radius:14px;font:inherit;font-weight:800;cursor:pointer}.hi8-check[aria-pressed="true"]{border-color:#21877f;background:#e9f8f5}.hi8-summary{text-align:center;padding:25px 0}.hi8-summary .hi8-symbol{color:#197f76}@media (prefers-reduced-motion:reduce){.hi8-progress-bar span{transition:none}}@media (max-width:540px){.hi8-panel{padding:18px;border-radius:20px}.hi8-game-card{grid-template-columns:54px 1fr}.hi8-arrow{display:none}.hi8-game-icon{width:50px;height:50px}.hi8-choice-grid{grid-template-columns:1fr}.hi8-controls{display:grid;grid-template-columns:1fr}.hi8-controls .hi8-btn{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function root() { return document.getElementById(rootId); }
  function $all(selector) { return [...root().querySelectorAll(selector)]; }
  function currentGame() { return games[state.stage].find((item) => item.key === state.gameKey); }
  function stepData() { return state.data || {}; }
  function speak(text) {
    if (!state?.readOn || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[🌈🎧📡🛡️🍜🎢🕵️🙂]/g, ''));
    utterance.lang = 'zh-HK'; utterance.rate = .78; utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
  function tone(frequency = 520, duration = .24) {
    if (!state?.audioOn) return;
    try { audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)(); const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain(); oscillator.frequency.value = frequency; oscillator.type = 'sine'; gain.gain.setValueAtTime(.0001, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.08, audioContext.currentTime + .025); gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration); oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration + .02); } catch (_) {}
  }
  function status(text, kind = 'info') { const el = root().querySelector('#hi8Status'); if (el) { el.textContent = text; el.dataset.kind = kind; } speak(text); }
  function setFrame(inner) {
    const game = currentGame(); const label = STAGE_LABELS[state.stage];
    root().innerHTML = `<section class="hi8-panel" role="dialog" aria-modal="true" aria-labelledby="hi8Title"><div class="hi8-head"><div><div class="hi8-kicker">${label} · HI 聽覺與視覺溝通</div><h2 id="hi8Title">${game ? game.title : 'HI 分齡視覺聆聽遊戲'}</h2></div><button class="hi8-close" id="hi8Close" type="button" aria-label="關閉 HI 分齡遊戲">×</button></div>${inner}</section>`;
    root().querySelector('#hi8Close').addEventListener('click', close);
  }
  function progress(total) { const current = Math.min(state.index + 1, total); return `<div class="hi8-progress"><div class="hi8-progress-top"><span>步驟 ${current}/${total}</span><span>可以慢慢做</span></div><div class="hi8-progress-bar"><span style="width:${(current / total) * 100}%"></span></div></div>`; }
  function controls() { return `<div class="hi8-controls"><button class="hi8-btn hi8-quiet" id="hi8Menu" type="button">← 換一項</button><button class="hi8-btn" id="hi8Read" type="button">🔊 文字朗讀：${state.readOn ? '開' : '關'}</button><button class="hi8-btn" id="hi8Audio" type="button">🎵 音訊提示：${state.audioOn ? '開' : '關'}</button><button class="hi8-btn" id="hi8Motion" type="button">◌ 減少動態：${state.reduceMotion ? '開' : '關'}</button></div>`; }
  function refreshCurrent() {
    const node = root();
    if (node?.querySelector('#hi8Again')) return finish();
    if (node?.querySelector('#hi8Start')) return renderReady();
    if (node?.querySelector('.hi8-menu')) return renderMenu();
    return renderPlay();
  }
  function bindControls() {
    root().querySelector('#hi8Menu')?.addEventListener('click', renderMenu);
    root().querySelector('#hi8Read')?.addEventListener('click', () => { state.readOn = !state.readOn; refreshCurrent(); status(state.readOn ? '文字朗讀已開啟。' : '文字朗讀已關閉。'); });
    root().querySelector('#hi8Audio')?.addEventListener('click', () => { state.audioOn = !state.audioOn; refreshCurrent(); status(state.audioOn ? '音訊提示已開啟。每次可先按播放，再作答。' : '音訊提示已關閉。你仍可用完整的文字和圖像線索作答。'); });
    root().querySelector('#hi8Motion')?.addEventListener('click', () => { state.reduceMotion = !state.reduceMotion; root().classList.toggle('hi8-reduce-motion', state.reduceMotion); refreshCurrent(); status(state.reduceMotion ? '已減少非必要動態。' : '已恢復簡單轉場。'); });
  }
  function gentle(message) { state.incorrect += 1; status(`差少少，${message}`, 'gentle'); }
  function correct(message, next) { state.correct += 1; status(message); tone(660, .12); clearTimeout(continueTimer); continueTimer = setTimeout(next, state.reduceMotion ? 80 : 420); }
  function advance() { state.index += 1; state.data = {}; if (state.index >= currentGame().steps) finish(); else renderPlay(); }
  function finish() { const game = currentGame(); setFrame(`${progress(game.steps)}<div class="hi8-summary"><div class="hi8-symbol">✓</div><h3>本次視覺溝通小任務完成</h3><p>你已完成 ${game.steps} 個清楚步驟。需要時，使用文字、圖像、輔具或提出要求，都是有效的溝通方法。</p><div class="hi8-choice-grid"><button class="hi8-btn hi8-primary" id="hi8Again" type="button">↺ 再玩一次</button><button class="hi8-btn" id="hi8MenuFinish" type="button">選另一項遊戲</button></div></div>${controls()}`); root().querySelector('#hi8Again').addEventListener('click', () => { state.index = 0; state.correct = 0; state.incorrect = 0; state.data = {}; renderPlay(); }); root().querySelector('#hi8MenuFinish').addEventListener('click', renderMenu); bindControls(); state.onComplete?.({ label: game.title, correct: state.correct, incorrect: state.incorrect, total: game.steps }); }
  function choose(isCorrect, success, retry, after) { if (isCorrect) correct(success, after || advance); else gentle(retry); }
  function rainbow() { const sequence = [{ kind: 'high', word: '高音', icon: '⭐', freq: 1450 }, { kind: 'low', word: '低音', icon: '☁️', freq: 260 }, { kind: 'high', word: '高音', icon: '⭐', freq: 1650 }]; const item = sequence[state.index % sequence.length]; return { visual: `<div class="hi8-visual"><div><div class="hi8-wave">${[20,42,68,42,20,42,68,42,20].map(h => `<i style="height:${h}px"></i>`).join('')}</div><div class="hi8-caption">先按「播放聲音」，再看音高提示。</div></div></div>`, prompt: '這是一個聲音練習。它是高音，還是低音？', buttons: `<button class="hi8-btn hi8-primary" data-hi8-play="${item.freq}" type="button">▶ 播放這個聲音</button><div class="hi8-choice-grid"><button class="hi8-choice" data-hi8-answer="high" type="button">⭐ 我聽到高音</button><button class="hi8-choice" data-hi8-answer="low" type="button">☁️ 我聽到低音</button></div>`, bind() { $all('[data-hi8-play]').forEach(b => b.addEventListener('click', () => { tone(Number(b.dataset.hi8Play), .48); status('聲音已播放。可再按一次，然後選擇高音或低音。'); })); $all('[data-hi8-answer]').forEach(b => b.addEventListener('click', () => choose(b.dataset.hi8Answer === item.kind, `答對了，這是${item.word}。`, '先再按播放聲音，或看看星星與雲朵的提示。'))); } }; }
  function tones() { const items = [{ target: '平穩', label: '師 si1', path: 'M10 43 L210 43', text: '平穩、較高的線' }, { target: '上升', label: '史 si2', path: 'M10 60 Q110 58 210 18', text: '由低向高走的線' }, { target: '平穩', label: '詩 si1', path: 'M10 35 L210 35', text: '平穩、較高的線' }]; const item = items[state.index % items.length]; const opposite = item.target === '平穩' ? '上升' : '平穩'; return { visual: `<div class="hi8-visual"><div class="hi8-line"><svg viewBox="0 0 220 75" aria-label="音高走向圖"><path d="${item.path}" fill="none" stroke="#258dba" stroke-width="8" stroke-linecap="round"/></svg></div><div class="hi8-caption">字卡：${item.label}。看線條怎樣走。</div></div>`, prompt: `「${item.label}」的音高走向是哪一種？`, buttons: `<button class="hi8-btn" data-hi8-play="${item.target === '平穩' ? 620 : 420}" type="button">▶ 可選：播放示範聲音</button><div class="hi8-choice-grid"><button class="hi8-choice" data-hi8-tone="平穩" type="button">━━ 平穩走勢</button><button class="hi8-choice" data-hi8-tone="上升" type="button">╱ 上升走勢</button></div>`, bind() { $all('[data-hi8-play]').forEach(b => b.addEventListener('click', () => tone(Number(b.dataset.hi8Play), .38))); $all('[data-hi8-tone]').forEach(b => b.addEventListener('click', () => choose(b.dataset.hi8Tone === item.target, `答對了，這是${item.text}。`, `看一看線條：它不是${opposite}走勢。`))); } }; }
  function lips() { const items = [{ mouth: '👄', clue: '雙唇先合起來，再張開。', answer: '班房', choices: ['班房', '餐房', '操場'] }, { mouth: '🗣️', clue: '嘴巴張開，舌尖靠近上排牙齒。', answer: '餐房', choices: ['班房', '餐房', '書房'] }, { mouth: '👄', clue: '雙唇合起來，然後有鼻音。', answer: '明天', choices: ['明天', '明白', '門口'] }]; const item = items[state.index % items.length]; return { visual: `<div class="hi8-visual"><div class="hi8-lip"><div class="hi8-mouth">${item.mouth}</div><div><strong>口型線索</strong><br>${item.clue}</div></div></div>`, prompt: '請看口型與文字線索，對方最可能說哪一個字詞？', buttons: `<div class="hi8-choice-grid">${item.choices.map(x => `<button class="hi8-choice" data-hi8-lip="${x}" type="button">${x}</button>`).join('')}</div>`, bind() { $all('[data-hi8-lip]').forEach(b => b.addEventListener('click', () => choose(b.dataset.hi8Lip === item.answer, `答對了，字卡是「${item.answer}」。`, '可以先看嘴唇有沒有合起來，再看嘴巴張開的位置。'))); } }; }
  function expression() { const items = [{ cue: '「你好叻喎」；文字一樣，但眉毛抬起、嘴角不自然地笑。', answer: '開玩笑／諷刺', choices: ['真心稱讚', '開玩笑／諷刺', '正在安慰'] }, { cue: '「唔緊要，我陪你再試。」；眼神柔和，身體面向對方。', answer: '安慰', choices: ['生氣', '安慰', '不耐煩'] }, { cue: '「而家要停。」；眉頭緊，手掌向前。', answer: '嚴肅提醒', choices: ['開玩笑', '嚴肅提醒', '興奮'] }]; const item = items[state.index % items.length]; return { visual: `<div class="hi8-visual"><div class="hi8-symbol">🧑‍🤝‍🧑</div><div class="hi8-caption">${item.cue}</div></div>`, prompt: '把文字、臉部表情和身體線索放在一起，這句話最像甚麼意思？', buttons: `<div class="hi8-choice-grid">${item.choices.map(x => `<button class="hi8-choice" data-hi8-expression="${x}" type="button">${x}</button>`).join('')}</div>`, bind() { $all('[data-hi8-expression]').forEach(b => b.addEventListener('click', () => choose(b.dataset.hi8Expression === item.answer, `答對了，完整訊息是「${item.answer}」。`, '先再看眉毛、嘴角和身體是否面向對方。'))); } }; }
  function noise() { const items = [{ answer: '科學書', choices: ['科學書', '字典', '美術袋'] }, { answer: '藍色筆', choices: ['紅色筆', '藍色筆', '計算機'] }, { answer: '工作紙', choices: ['故事書', '工作紙', '水樽'] }]; const item = items[state.index % items.length]; const fm = Boolean(stepData().fm); return { visual: `<div class="hi8-visual ${fm ? 'hi8-fm-on' : ''}"><div><div class="hi8-noise"><span>同學聊天</span><span>拉凳子</span><span>風扇聲</span><span>走廊聲</span></div><div class="hi8-caption">班長訊息：明天請帶 <strong>${fm ? item.answer : '？（可開啟 FM 系統）'}</strong>。</div></div></div>`, prompt: '課室很嘈。先選擇合適的輔具，再找出班長說的用品。', buttons: `<button class="hi8-btn ${fm ? 'hi8-primary' : ''}" id="hi8Fm" type="button">📡 FM 系統：${fm ? '已開啟' : '開啟降噪提示'}</button><div class="hi8-choice-grid">${item.choices.map(x => `<button class="hi8-choice" data-hi8-noise="${x}" type="button">${x}</button>`).join('')}</div>`, bind() { root().querySelector('#hi8Fm').addEventListener('click', () => { state.data.fm = true; renderPlay(); status('FM 系統已開啟。背景線索已減少，班長的關鍵詞更清楚。'); }); $all('[data-hi8-noise]').forEach(b => b.addEventListener('click', () => { if (!state.data.fm) return gentle('可先按 FM 系統，令關鍵詞更清楚。'); choose(b.dataset.hi8Noise === item.answer, `答對了，班長說的是「${item.answer}」。`, '重看 FM 開啟後的文字關鍵詞。'); })); } }; }
  function shield() { const items = [{ issue: '組員講得很快，又沒有面向你。', answer: '請你講慢少少，我想看著你說話。', choices: ['請你講慢少少，我想看著你說話。', '我甚麼都不用知道。', '你們全部不要說話。'] }, { issue: '大家同時講，你跟不上專題重點。', answer: '可以把這個重點寫下來嗎？', choices: ['可以把這個重點寫下來嗎？', '我會自己猜。', '你們做完再算。'] }, { issue: '同學背向你說出工作分配。', answer: '請面向我再說一次，謝謝。', choices: ['請面向我再說一次，謝謝。', '不用了。', '我現在離開。'] }]; const item = items[state.index % items.length]; return { visual: `<div class="hi8-visual"><div class="hi8-symbol">🗣️↗️👂</div><div class="hi8-caption">情況：${item.issue}</div></div>`, prompt: '選一張清楚、禮貌的「溝通盾牌」對白卡。', buttons: `<div class="hi8-choice-grid">${item.choices.map(x => `<button class="hi8-choice" data-hi8-shield="${x}" type="button">${x}</button>`).join('')}</div>`, bind() { $all('[data-hi8-shield]').forEach(b => b.addEventListener('click', () => choose(b.dataset.hi8Shield === item.answer, '做得好，你清楚又禮貌地提出了需要。', '想一想：哪一句有說清楚你需要甚麼幫助？'))); } }; }
  function takeaway() { const items = [{ part: '食物', answer: '沙爹牛肉麵', choices: ['沙爹牛肉麵', '叉燒飯', '雲吞麵'] }, { part: '飲品', answer: '凍檸茶少甜', choices: ['熱奶茶', '凍檸茶少甜', '汽水'] }, { part: '送貨地點', answer: '四樓', choices: ['二樓', '四樓', '六樓'] }]; const item = items[state.index % items.length]; return { visual: `<div class="hi8-visual"><div><div class="hi8-noise"><span>杯碟聲</span><span>電視聲</span><span>叫單聲</span></div><div class="hi8-caption">外賣訂單字幕：<strong>沙爹牛肉麵，凍檸茶少甜，送去四樓。</strong></div></div></div>`, prompt: `請在 POS 機輸入訂單的「${item.part}」。可重看字幕，不需要靠記憶猜。`, buttons: `<div class="hi8-choice-grid">${item.choices.map(x => `<button class="hi8-choice" data-hi8-takeaway="${x}" type="button">${x}</button>`).join('')}</div>`, bind() { $all('[data-hi8-takeaway]').forEach(b => b.addEventListener('click', () => choose(b.dataset.hi8Takeaway === item.answer, `已輸入正確${item.part}。`, '可再看一次訂單字幕的關鍵詞。'))); } }; }
  function dse() {
    const stage = state.index % 3;
    const checked = stepData().checked || {};
    if (stage === 0) {
      return {
        visual: `<div class="hi8-visual"><div class="hi8-symbol">🎧</div><div class="hi8-caption">考試開始前，先逐項檢查輔具。</div></div>`,
        prompt: '選出每一項已檢查的設備，然後再開始聆聽。',
        buttons: `<div class="hi8-checklist">${['收音機有電', '耳機線插穩', '已收到訊號'].map(x => `<button class="hi8-check" data-hi8-check="${x}" aria-pressed="${Boolean(checked[x])}" type="button">${checked[x] ? '✓ ' : '○ '}${x}</button>`).join('')}</div><button class="hi8-btn hi8-primary" id="hi8CheckDone" type="button">我已完成設備檢查</button>`,
        bind() {
          $all('[data-hi8-check]').forEach((button) => button.addEventListener('click', () => {
            state.data.checked = state.data.checked || {};
            state.data.checked[button.dataset.hi8Check] = !state.data.checked[button.dataset.hi8Check];
            renderPlay();
          }));
          root().querySelector('#hi8CheckDone').addEventListener('click', () => {
            if (Object.values(state.data.checked || {}).filter(Boolean).length === 3) correct('設備已逐項檢查完成。', advance);
            else gentle('先逐項檢查收音機、耳機線和訊號。');
          });
        }
      };
    }
    const items = [
      { prompt: '考試時出現沙沙聲，最合適的第一步是？', answer: '舉手告知監考員', choices: ['舉手告知監考員', '繼續猜答案', '自行拆開設備'] },
      { prompt: '監考員問你需要甚麼協助，哪句最清楚？', answer: '我聽到沙沙聲，想檢查備用耳機。', choices: ['我聽到沙沙聲，想檢查備用耳機。', '我甚麼都不用。', '不要理我。'] }
    ];
    const item = items[stage - 1];
    return {
      visual: `<div class="hi8-visual"><div class="hi8-symbol">📣</div><div class="hi8-caption">情況：${item.prompt}</div></div>`,
      prompt: '考場有支援人員。選擇安全而清楚的做法。',
      buttons: `<div class="hi8-choice-grid">${item.choices.map(x => `<button class="hi8-choice" data-hi8-dse="${x}" type="button">${x}</button>`).join('')}</div>`,
      bind() { $all('[data-hi8-dse]').forEach((button) => button.addEventListener('click', () => choose(button.dataset.hi8Dse === item.answer, '做得好，你清楚地使用了無障礙支援。', '遇到設備問題時，可以先舉手並說明自己聽到的情況。'))); }
    };
  }
  const renderers = { rainbow, tones, lips, expression, noise, shield, takeaway, dse };
  function renderPlay() { const game = currentGame(); const scene = renderers[game.key](); setFrame(`${progress(game.steps)}<main class="hi8-play"><div class="hi8-intro">${game.focus} · ${game.description}</div><h3 class="hi8-prompt">${scene.prompt}</h3>${scene.visual}${scene.buttons}<div class="hi8-status" id="hi8Status" aria-live="polite">${state.audioOn ? '音訊提示已開啟；你可按播放按鈕，再慢慢作答。' : '音訊提示現時關閉；全部題目均提供文字和視覺線索。'}</div></main>${controls()}`); scene.bind(); bindControls(); speak(scene.prompt); }
  function renderMenu() { state.gameKey = null; setFrame(`<p class="hi8-intro">每個學段有兩項新遊戲。聲音永遠是可選提示；文字、圖像、色彩和清楚的自我倡導語句同樣重要。</p><div class="hi8-menu">${games[state.stage].map(game => `<button class="hi8-game-card" data-hi8-game="${game.key}" type="button"><span class="hi8-game-icon">${game.icon}</span><span><span class="hi8-kicker">${game.focus}</span><h3>${game.title}</h3><p>${game.description}</p></span><span class="hi8-arrow">→</span></button>`).join('')}</div><div class="hi8-status" id="hi8Status">請選一項想練習的溝通或生活技能。</div>${controls()}`); $all('[data-hi8-game]').forEach(button => button.addEventListener('click', () => { state.gameKey = button.dataset.hi8Game; state.index = 0; state.correct = 0; state.incorrect = 0; state.data = {}; renderReady(); })); bindControls(); }
  function renderReady() { const game = currentGame(); setFrame(`<div class="hi8-visual"><div class="hi8-symbol">${game.icon}</div><div class="hi8-caption">先以視覺線索完成每一步；音訊與文字朗讀可按需要開啟。</div></div><p class="hi8-intro"><strong>三個小步驟：</strong><br>1. 先看清楚文字、圖像和色彩線索。<br>2. 需要時自行選擇播放音訊或文字朗讀。<br>3. 任何時候都可慢慢重試或提出支援需要。</p><div class="hi8-choice-grid"><button class="hi8-btn" id="hi8Back" type="button">← 換一項</button><button class="hi8-btn hi8-primary" id="hi8Start" type="button">✓ 我準備好了</button></div><div class="hi8-status" id="hi8Status">這是準備時間；不會自動播放聲音，也沒有倒數。</div>${controls()}`); root().querySelector('#hi8Back').addEventListener('click', renderMenu); root().querySelector('#hi8Start').addEventListener('click', renderPlay); bindControls(); }
  function open(options = {}) { ensureStyle(); clearTimeout(continueTimer); state = { stage: games[options.stage] ? options.stage : 'lower', gameKey: null, index: 0, correct: 0, incorrect: 0, data: {}, readOn: false, audioOn: false, reduceMotion: false, onComplete: options.onComplete || null, trigger: options.trigger || null }; let node = root(); if (!node) { node = document.createElement('div'); node.id = rootId; node.className = 'hi8-lab'; document.body.appendChild(node); } node.hidden = false; renderMenu(); }
  function close() { clearTimeout(continueTimer); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); const node = root(); if (node) node.hidden = true; state?.trigger?.focus?.(); }
  function activityCards(stage) { return games[stage] || []; }
  window.HI_EIGHT_GAMES_LAB = { open, close, activityCards };
})();
