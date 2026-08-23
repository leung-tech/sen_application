/* Design: ID「安全與工作小站」— 大圖示、慢速旁白、一步一提示、可拖放或點選、無時限及溫和安全回饋。 */
(function () {
  'use strict';

  const STAGES = {
    lower: { label: '初小 · P1–P3', games: ['hazard', 'uniform'] },
    upper: { label: '高小 · P4–P6', games: ['octopus', 'mall'] },
    junior: { label: '初中 · S1–S3', games: ['shampoo', 'tea'] },
    senior: { label: '高中 · S4–S6', games: ['shredder', 'pack'] }
  };

  const GAMES = {
    hazard: { icon: '⚠️', title: '「呢個唔摸得！」危險家電警報', focus: '初小 · 家居安全辨識', description: '看清楚物件，再選擇「可以摸」或「唔好摸」。', prep: ['先看物件是甚麼。', '想一想它會否發熱、轉動或有電。', '危險時，選「唔好摸」並找大人幫手。'], total: 8 },
    uniform: { icon: '🧑‍🚒', title: '「邊個可以幫我？」制服對對碰', focus: '初小 · 安全人物辨識', description: '把制服角色配對到合適的工作工具；可拖放或直接點選。', prep: ['先看制服角色。', '再看哪一件工具與他的工作有關。', '按錯時物件會留在原位，可再試。'], total: 8 },
    octopus: { icon: '🪪', title: '八達通「嘟」入閘機', focus: '高小 · 乘車連貫步驟', description: '由銀包取卡、拍感應器，再穿過已開啟的閘門。', prep: ['先點銀包拿出八達通。', '把卡貼近橙色感應器。', '聽到「嘟」後，才慢慢行過閘門。'], total: 8 },
    mall: { icon: '🚹', title: '商場搵廁所：圖示導航王', focus: '高小 · 環境圖示閱讀', description: '只看大圖示和箭頭，找出最合適的方向。', prep: ['先看小明想去甚麼地方。', '只找一個相同意思的大圖示。', '不需要急，先看看箭頭方向。'], total: 8 },
    shampoo: { icon: '🫧', title: '洗頭步驟排排坐', focus: '初中 · 個人衛生步驟', description: '把洗頭步驟按第一、二、三、四步慢慢排好。', prep: ['先看每張圖卡正在做甚麼。', '每次只選下一步。', '排錯時可重看泡泡提示並再試。'], total: 8 },
    tea: { icon: '🥧', title: '開心下午茶：數數有幾多錢', focus: '初中 · 實物點數加法', description: '不必心算；逐枚選硬幣，慢慢湊足付款金額。', prep: ['先看兩件食物合共多少錢。', '每次只放一枚硬幣。', '總額未夠時可繼續；超過時只會溫和提醒。'], total: 8 },
    shredder: { icon: '📄', title: '辦公室小助手：碎紙機安全守則', focus: '高中 · 職業安全', description: '先拔除釘書釘，再把安全紙張送進碎紙機。', prep: ['先看紙張上有沒有釘書釘。', '有釘書釘時，先用拔釘器。', '手要留在安全線外，才可把紙送入入口。'], total: 8 },
    pack: { icon: '🎁', title: '工場實戰：禮品包裝流水線', focus: '高中 · 標準化包裝工作', description: '按虛線框位置包裝、貼條碼，再把完成品放入合格箱。', prep: ['先把紅包裝紙貼在盒子正中央。', '再把條碼貼紙放在右下角。', '最後才把完成品放入合格箱。'], total: 8 }
  };

  const HAZARDS = [
    { icon: '🧸', item: '洋娃娃', danger: false },
    { icon: '♨️', item: '正在發熱的熱水煲', danger: true },
    { icon: '🔌', item: '插頭', danger: true }
  ];
  const UNIFORMS = [
    { role: '消防員', icon: '🧑‍🚒', tool: '消防車', toolIcon: '🚒' },
    { role: '警察', icon: '👮', tool: '警車', toolIcon: '🚓' },
    { role: '港鐵職員', icon: '🧑‍💼', tool: '港鐵入閘機', toolIcon: '🚇' }
  ];
  const MALL = [
    { prompt: '小明想去男廁，應該跟哪個箭頭行？', answer: '男廁', choices: [{ text: '🚹 男廁 →', value: '男廁' }, { text: '🛗 升降機 →', value: '升降機' }, { text: '🍜 食肆 →', value: '食肆' }] },
    { prompt: '小明想離開商場，應該找哪個圖示？', answer: '安全出口', choices: [{ text: '🚪 安全出口 →', value: '安全出口' }, { text: '🚻 洗手間 →', value: '洗手間' }, { text: 'Ⓜ️ 港鐵 →', value: '港鐵' }] },
    { prompt: '小明想搭港鐵，應該跟哪個圖示？', answer: '港鐵', choices: [{ text: 'Ⓜ️ 港鐵 →', value: '港鐵' }, { text: '🚹 男廁 →', value: '男廁' }, { text: '🍜 食肆 →', value: '食肆' }] }
  ];
  const SHAMPOO = [
    { icon: '💧', text: '梳濕個頭' },
    { icon: '🫧', text: '倒洗頭水捽泡泡' },
    { icon: '🚿', text: '用水沖乾淨' },
    { icon: '🧻', text: '用毛巾抹乾' }
  ];
  const TEA = [
    { order: '蛋撻 $6 ＋ 紙包奶 $4', total: 10 },
    { order: '菠蘿包 $5 ＋ 凍檸茶 $3', total: 8 },
    { order: '火腿通粉 $9 ＋ 紙包奶 $4', total: 13 }
  ];

  let host = null;
  let options = null;
  let state = null;
  let returnFocus = null;
  const q = (selector) => host?.querySelector(selector);
  const qa = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const stage = () => STAGES[options?.stage] || STAGES.lower;
  const game = () => GAMES[state?.game];
  const later = (fn, wait = 360) => window.setTimeout(fn, state?.reduced ? 80 : wait);

  function speak(text) {
    if (!state?.speech || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    utterance.lang = 'zh-HK'; utterance.rate = .72; utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function say(text, type = '') {
    const node = q('#id24Status');
    if (node) { node.textContent = text; node.className = `id24-status ${type}`; }
    speak(text);
  }

  function progress() {
    const total = state.total || 1;
    const current = Math.min(state.step + 1, total);
    return `<div class="id24-progress"><div><i style="width:${((state.step) / total) * 100}%"></i></div><b>步驟 ${current}/${total}</b><span>慢慢做就可以</span></div>`;
  }

  function head(title, detail) { return `<header class="id24-head"><div><span>${stage().label} · ID 安全與工作技能</span><h2 id="id24Title">${title}</h2><p>${detail}</p></div><button id="id24Close" type="button" aria-label="關閉 ID 新增遊戲">×</button></header>`; }
  function tools() { return `<footer class="id24-tools"><button id="id24Pause" type="button">${state.paused ? '▶ 繼續練習' : '☁ 先停一停'}</button><button id="id24Read" type="button">${state.speech ? '🔊 廣東話旁白：開' : '🔇 廣東話旁白：關'}</button><button id="id24Motion" type="button">${state.reduced ? '◌ 減少動態：開' : '◒ 減少動態：關'}</button></footer>`; }

  function screen(content) {
    host.classList.toggle('id24-reduced', Boolean(state?.reduced));
    host.innerHTML = `<section class="id24-shell" role="dialog" aria-modal="true" aria-labelledby="id24Title">${content}</section>`;
    q('#id24Close')?.addEventListener('click', close);
    q('#id24Pause')?.addEventListener('click', () => { state.paused = !state.paused; q('#id24Pause').textContent = state.paused ? '▶ 繼續練習' : '☁ 先停一停'; say(state.paused ? '可以先停一停。準備好才繼續，沒有扣分。' : '已繼續。只做目前這一步即可。'); });
    q('#id24Read')?.addEventListener('click', () => { state.speech = !state.speech; q('#id24Read').textContent = state.speech ? '🔊 廣東話旁白：開' : '🔇 廣東話旁白：關'; if (state.speech) speak(q('#id24Status')?.textContent || '請慢慢完成這一步。'); });
    q('#id24Motion')?.addEventListener('click', () => { state.reduced = !state.reduced; host.classList.toggle('id24-reduced', state.reduced); q('#id24Motion').textContent = state.reduced ? '◌ 減少動態：開' : '◒ 減少動態：關'; say(state.reduced ? '已減少非必要動態。' : '已恢復一般動態。'); });
  }

  function frame(title, detail, workspace, voice) {
    screen(`${head(title, detail)}${progress()}<main class="id24-work">${workspace}</main><div id="id24Status" class="id24-status" role="status" aria-live="polite">請慢慢做；不需要比速度。</div>${tools()}`);
    later(() => speak(voice || detail), 80);
  }
  function gentle(text) { if (!state.paused) { state.tries += 1; say(`↗ 差少少。${text}`, 'try'); } }
  function correct(text, next) { if (!state.paused) { state.correct += 1; say(`✓ ${text}`, 'ok'); later(next); } }
  function next(render) { state.step += 1; if (state.step >= state.total) finish(); else render(); }
  function setDrop(source, targets, resolve) {
    q(source)?.addEventListener('dragstart', (event) => event.dataTransfer?.setData('text/plain', source));
    qa(targets).forEach((target) => { target.addEventListener('dragover', (event) => event.preventDefault()); target.addEventListener('drop', (event) => { event.preventDefault(); resolve(target); }); });
  }

  function finish() {
    const item = game();
    options?.onComplete?.({ label: `${item.title} · ${stage().label}`, mode: `id-advanced-${state.game}`, total: state.total, correct: state.correct, incorrect: state.tries, completedAt: new Date().toLocaleString('zh-HK') });
    screen(`${head('本次安全／工作小任務完成', '完成一小步、看清楚提示和慢慢再試，都是重要能力。')}${progress()}<main class="id24-work"><div class="id24-summary"><span>✓</span><h3>${item.title}</h3><p>你已完成 ${state.total} 個清楚步驟。</p><div><b>完成步驟 ${state.total}/${state.total}</b><b>正確回應 ${state.correct}</b></div><button id="id24Again" class="id24-main" type="button">↺ 再玩一次</button><button id="id24Menu" class="id24-plain" type="button">選另一項遊戲</button></div></main><div id="id24Status" class="id24-status ok" role="status" aria-live="polite">可以先休息，或選另一項生活練習。</div>${tools()}`);
    q('#id24Again')?.addEventListener('click', () => ready(state.game));
    q('#id24Menu')?.addEventListener('click', menu);
  }

  function menu() {
    state = { speech: true, reduced: false, paused: false, step: 0, total: 0, correct: 0, tries: 0, paid: 0, cardOut: false };
    const cards = stage().games.map((id) => { const item = GAMES[id]; return `<button class="id24-card" data-id24-game="${id}" type="button"><span>${item.icon}</span><small>${item.focus}</small><strong>${item.title}</strong><p>${item.description}</p><b>→</b></button>`; }).join('');
    screen(`${head('新增 ID 安全與工作遊戲', '每個學段有兩項新增遊戲。所有活動均不設倒數、不比較速度，並提供大圖示與溫和重試。')}<main class="id24-work"><div class="id24-notice">答錯時不會出現失敗畫面；只會保留原題目並提供下一個清楚提示。</div><div class="id24-menu">${cards}</div></main><div id="id24Status" class="id24-status" role="status" aria-live="polite">請選擇一項想練習的安全或工作技能。</div>${tools()}`);
    qa('[data-id24-game]').forEach((button) => button.addEventListener('click', () => ready(button.dataset.id24Game)));
  }

  function ready(id) {
    const item = GAMES[id];
    state = { game: id, speech: true, reduced: false, paused: false, step: 0, total: item.total, correct: 0, tries: 0, paid: 0, cardOut: false };
    screen(`${head(`${item.title} · 準備頁`, '按「我準備好了」後才會開始；沒有時間壓力。')}<main class="id24-work"><section class="id24-ready"><span>${item.icon}</span><div><b>先一起讀三步</b><ol>${item.prep.map((line) => `<li>${line}</li>`).join('')}</ol><p>可用點選、拖放、指一指或說出答案。感到不確定時，隨時可先停一停。</p></div></section><div class="id24-actions"><button id="id24Menu" class="id24-plain" type="button">← 換一項</button><button id="id24Start" class="id24-main" type="button">✓ 我準備好了</button></div></main><div id="id24Status" class="id24-status" role="status" aria-live="polite">現在是準備時間；廣東話旁白已開啟。</div>${tools()}`);
    q('#id24Menu')?.addEventListener('click', menu);
    q('#id24Start')?.addEventListener('click', () => begin(id));
    later(() => speak(`${item.title}。${item.prep.join('。')}`), 80);
  }

  function begin(id) {
    state.step = 0; state.correct = 0; state.tries = 0; state.paid = 0; state.cardOut = false;
    ({ hazard: renderHazard, uniform: renderUniform, octopus: renderOctopus, mall: renderMall, shampoo: renderShampoo, tea: renderTea, shredder: renderShredder, pack: renderPack })[id]();
  }

function renderHazard() {
    const item = HAZARDS[state.step % HAZARDS.length];
    frame(GAMES.hazard.title, `這是${item.item}。應該可以摸，還是唔好摸？`, `<div class="id24-task"><div class="id24-object ${item.danger ? 'warn' : ''}"><span>${item.icon}</span><b>${item.item}</b>${item.danger ? '<small>看見熱、插頭或轉動物件時，要先停一停。</small>' : '<small>這是一件安全玩具。</small>'}</div><div class="id24-choice"><button data-id24-hazard="safe" type="button">🙂 可以摸</button><button data-id24-hazard="danger" type="button">⚠️ 唔好摸</button></div></div>`, `這是${item.item}。應該可以摸，還是唔好摸？`);
    qa('[data-id24-hazard]').forEach((button) => button.addEventListener('click', () => {
      const isDanger = button.dataset.id24Hazard === 'danger';
      if (isDanger === item.danger) correct(item.danger ? '你看得很清楚。好熱、有電或會轉動的物件，唔好摸，先找大人。' : '對了，這是安全玩具。', () => next(renderHazard));
      else gentle(item.danger ? '看一看黃色警告提示。這件物件有危險，先不要摸。' : '這是一件安全玩具，可以慢慢再看圖示。');
    }));
  }

function renderUniform() {
    const item = UNIFORMS[state.step % UNIFORMS.length];
    frame(GAMES.uniform.title, `遇到情況時，${item.role}會使用哪一件工具？`, `<div class="id24-task"><div id="id24Role" class="id24-drag" draggable="true"><span>${item.icon}</span><b>${item.role}</b></div><div class="id24-targets">${UNIFORMS.map((choice) => `<button data-id24-uniform="${choice.tool}" type="button"><span>${choice.toolIcon}</span><b>${choice.tool}</b></button>`).join('')}</div></div>`, `遇到情況時，${item.role}會使用哪一件工具？`);
    const decide = (tool) => tool === item.tool ? correct(`對了，${item.role}會幫忙處理這個情況。`, () => next(renderUniform)) : gentle(`再看${item.role}的制服和工作工具。`);
    qa('[data-id24-uniform]').forEach((button) => button.addEventListener('click', () => decide(button.dataset.id24Uniform)));
    setDrop('#id24Role', '[data-id24-uniform]', (target) => decide(target.dataset.id24Uniform));
  }

function renderOctopus() {
    const cycleStep = state.step % 3;
    if (cycleStep === 0) {
      frame(GAMES.octopus.title, '第一步：先點銀包，拿出八達通卡。', `<div class="id24-task"><button id="id24Wallet" class="id24-wallet" type="button"><span>👛</span><b>銀包</b><small>點一下拿出八達通</small></button></div>`, '第一步：先點銀包，拿出八達通卡。');
      q('#id24Wallet')?.addEventListener('click', () => { state.cardOut = true; correct('已從銀包拿出八達通卡。', () => next(renderOctopus)); }); return;
    }
    if (cycleStep === 1) {
      frame(GAMES.octopus.title, '第二步：把八達通卡貼近橙色感應器。', `<div class="id24-task"><div id="id24Card" class="id24-drag card" draggable="true"><span>🪪</span><b>八達通卡</b></div><button id="id24Sensor" class="id24-sensor" type="button"><span>🟧</span><b>橙色感應器</b><small>可把卡拖到這裡，或直接點一下</small></button></div>`, '第二步：把八達通卡貼近橙色感應器。');
      const tap = () => correct('嘟。閘門已打開。', () => next(renderOctopus)); q('#id24Sensor')?.addEventListener('click', tap); setDrop('#id24Card', '#id24Sensor', tap); return;
    }
    frame(GAMES.octopus.title, '第三步：看見閘門打開後，才慢慢行過去。', `<div class="id24-task"><div class="id24-gate open"><span>🚇</span><b>閘門已打開</b></div><button id="id24Walk" class="id24-main" type="button">→ 慢慢行過閘門</button></div>`, '第三步：看見閘門打開後，才慢慢行過去。');
    q('#id24Walk')?.addEventListener('click', () => correct('你已完成拍卡和入閘步驟。', () => next(renderOctopus)));
  }

function renderMall() {
    const item = MALL[state.step % MALL.length];
    frame(GAMES.mall.title, item.prompt, `<div class="id24-task"><div class="id24-mall"><span>🏬</span><b>${item.prompt}</b></div><div class="id24-choice">${item.choices.map((choice) => `<button data-id24-mall="${choice.value}" type="button">${choice.text}</button>`).join('')}</div></div>`, item.prompt);
    qa('[data-id24-mall]').forEach((button) => button.addEventListener('click', () => button.dataset.id24Mall === item.answer ? correct('對了，這個圖示最合適。', () => next(renderMall)) : gentle('再看一次圖示和小明想去的地方。')));
  }

function renderShampoo() {
    const expected = SHAMPOO[state.step % SHAMPOO.length];
    frame(GAMES.shampoo.title, `第 ${state.step + 1} 步：請選「${expected.text}」。`, `<div class="id24-task"><div class="id24-sequence">${SHAMPOO.map((item, index) => `<span class="${index < state.step ? 'done' : index === state.step ? 'now' : ''}">${item.icon}<small>${index < state.step ? '已完成' : `第 ${index + 1} 步`}</small></span>`).join('')}</div><div class="id24-choice">${[...SHAMPOO].sort((a, b) => a.text.localeCompare(b.text, 'zh-HK')).map((item) => `<button data-id24-shampoo="${item.text}" type="button">${item.icon} ${item.text}</button>`).join('')}</div></div>`, `第${state.step + 1}步，請選${expected.text}。`);
    qa('[data-id24-shampoo]').forEach((button) => button.addEventListener('click', () => button.dataset.id24Shampoo === expected.text ? correct(`已完成：${expected.text}。`, () => next(renderShampoo)) : gentle('小頭還有泡泡呢。先看看下一步圖卡。')));
  }

function renderTea() {
    const item = TEA[state.step % TEA.length];
    frame(GAMES.tea.title, `買「${item.order}」，合共需要 $${item.total}。`, `<div class="id24-task"><div class="id24-tea"><span>🥧 🥛</span><b>${item.order}</b><strong>合共：$${item.total}</strong></div><div class="id24-total">收銀機：$${state.paid} / $${item.total}<small>${'🪙'.repeat(Math.min(state.paid, 13)) || '請慢慢選硬幣'}</small></div><div class="id24-coins">${[1, 2, 5].map((coin) => `<button data-id24-coin="${coin}" type="button"><span>🪙</span>$${coin}</button>`).join('')}</div></div>`, `買這兩樣食物，合共${item.total}元。現在有${state.paid}元。`);
    qa('[data-id24-coin]').forEach((button) => button.addEventListener('click', () => { const coin = Number(button.dataset.id24Coin); if (state.paid + coin > item.total) return gentle(`現在已有${state.paid}元，只需${item.total}元。可以換一枚硬幣。`); state.paid += coin; if (state.paid === item.total) correct(`剛好 ${item.total} 元。你慢慢數得很清楚。`, () => { state.paid = 0; next(renderTea); }); else renderTea(); }));
  }

function renderShredder() {
    const cycleStep = state.step % 3;
    if (cycleStep === 0) {
      frame(GAMES.shredder.title, '第一步：這張紙有釘書釘。先要做甚麼？', `<div class="id24-task"><div class="id24-paper"><span>📄📌</span><b>有釘書釘的文件</b></div><div class="id24-choice"><button data-id24-shred="remove" type="button">🗜️ 先拔除釘書釘</button><button data-id24-shred="feed" type="button">➡️ 直接放入碎紙機</button></div></div>`, '這張紙有釘書釘。先要拔除釘書釘。');
      qa('[data-id24-shred]').forEach((button) => button.addEventListener('click', () => button.dataset.id24Shred === 'remove' ? correct('做得好，已先拔除釘書釘。', () => next(renderShredder)) : gentle('碎紙機不可以放入釘書釘。先用拔釘器。'))); return;
    }
    if (cycleStep === 1) {
      frame(GAMES.shredder.title, '第二步：手留在安全線外，把安全紙張送到入口。', `<div class="id24-task"><div id="id24SafePaper" class="id24-drag" draggable="true"><span>📄</span><b>已拔釘的廢紙</b></div><button id="id24Shredder" class="id24-shredder" type="button"><span>▰</span><b>碎紙機入口</b><small>只可放安全紙張</small></button><div class="id24-safety">🖐️ 手要留在紅色安全線外</div></div>`, '第二步：手留在安全線外，把安全紙張送到碎紙機入口。');
      const feed = () => correct('安全紙張已送進碎紙機。', () => next(renderShredder)); q('#id24Shredder')?.addEventListener('click', feed); setDrop('#id24SafePaper', '#id24Shredder', feed); return;
    }
    frame(GAMES.shredder.title, '第三步：碎紙完成後，先關機再離開工作位置。', `<div class="id24-task"><div class="id24-safe"><span>✅</span><b>碎紙完成，手仍在安全線外。</b></div><button id="id24SwitchOff" class="id24-main" type="button">⏻ 關閉碎紙機</button></div>`, '第三步：碎紙完成後，先關機再離開工作位置。');
    q('#id24SwitchOff')?.addEventListener('click', () => correct('已關閉碎紙機。你完成了安全工作步驟。', () => next(renderShredder)));
  }

function renderPack() {
    const steps = [
      { source: '紅包裝紙', icon: '🟥', target: '盒子中央', hint: '先把紅包裝紙貼在盒子正中央。' },
      { source: '條碼貼紙', icon: '🏷️', target: '右下角虛線框', hint: '再把條碼貼紙放在右下角虛線框。' },
      { source: '完成品', icon: '🎁', target: '合格箱', hint: '最後把完成品放入合格箱。' }
    ];
    const packStep = state.step % steps.length;
    const item = steps[packStep];
    frame(GAMES.pack.title, `第 ${state.step + 1} 步：${item.hint}`, `<div class="id24-task"><div id="id24PackItem" class="id24-drag" draggable="true"><span>${item.icon}</span><b>${item.source}</b></div><button id="id24PackTarget" class="id24-pack-target step-${state.step}" type="button"><span>${state.step === 2 ? '📦' : '🎁'}</span><b>${item.target}</b><small>可把物件拖到這裡，或直接點一下</small></button><div class="id24-dots"><i></i><i></i><i></i></div></div>`, item.hint);
    const place = () => correct(`已完成：${item.source}放到${item.target}。`, () => next(renderPack)); q('#id24PackTarget')?.addEventListener('click', place); setDrop('#id24PackItem', '#id24PackTarget', place);
  }

  function handleKey(event) { if (host && event.key === 'Escape') { event.preventDefault(); close(); } }
  function close() { try { window.speechSynthesis?.cancel(); } catch (_) {} const target = returnFocus; document.removeEventListener('keydown', handleKey); host?.remove(); host = null; state = null; if (target?.isConnected) requestAnimationFrame(() => target.focus()); }

  function styles() {
    if (document.getElementById('id24-games-style')) return;
    const style = document.createElement('style'); style.id = 'id24-games-style';
    style.textContent = `.id24-host{position:fixed;inset:0;z-index:1160;display:grid;place-items:center;padding:16px;background:rgba(18,45,58,.72);backdrop-filter:blur(5px);color:#244b5d}.id24-shell{width:min(920px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,30px);border:2px solid #fff;border-radius:28px;background:linear-gradient(145deg,#fffdf7,#f2faff);box-shadow:0 26px 72px rgba(8,25,48,.42)}.id24-head{display:flex;justify-content:space-between;gap:18px}.id24-head span{color:#207d75;font-size:12px;font-weight:950;letter-spacing:.08em}.id24-head h2{margin:5px 0;color:#173e54;font-size:clamp(27px,4vw,38px);line-height:1.15}.id24-head p{max-width:680px;margin:0;color:#5b7480;line-height:1.55}.id24-head>button{width:52px;min-width:52px;height:52px;border:0;border-radius:50%;background:#e7f0f2;color:#31596a;font-size:30px;font-weight:950}.id24-progress{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;margin-top:18px;color:#56727d;font-size:14px}.id24-progress>div{height:12px;overflow:hidden;border-radius:999px;background:#dfecef}.id24-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#26a68c,#5ea6d7);transition:width .25s ease}.id24-work{margin-top:18px}.id24-notice,.id24-safety{margin:14px 0 0;padding:14px 16px;border-left:5px solid #43a68f;border-radius:14px;background:#eefaf6;color:#2a665a;font-size:15px;font-weight:800;line-height:1.55}.id24-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}.id24-card{position:relative;min-height:196px;padding:20px;border:3px solid #c7e0e4;border-radius:22px;background:#fff;color:#264d60;text-align:left}.id24-card:hover{border-color:#299784;background:#f5fffc}.id24-card>span{display:block;font-size:43px}.id24-card small{display:block;margin-top:7px;color:#258278;font-weight:900}.id24-card strong{display:block;margin-top:5px;font-size:21px}.id24-card p{margin:8px 36px 0 0;color:#5d7681;font-size:14px;line-height:1.48}.id24-card>b{position:absolute;right:18px;bottom:16px;color:#1d917c;font-size:26px}.id24-ready{display:grid;grid-template-columns:auto 1fr;gap:18px;padding:20px;border:2px solid #bce4d4;border-radius:22px;background:#f1fbf7}.id24-ready>span{display:grid;place-items:center;width:82px;height:82px;border-radius:22px;background:#daf2e8;font-size:45px}.id24-ready b{color:#237365}.id24-ready ol{display:grid;gap:9px;margin:9px 0;padding-left:25px;line-height:1.5}.id24-ready p{margin:0;color:#6b6644;font-size:14px;line-height:1.5}.id24-actions{display:flex;justify-content:center;gap:12px;margin-top:18px}.id24-main,.id24-plain{min-height:58px;padding:0 22px;border-radius:16px;font-size:17px;font-weight:950}.id24-main{border:0;background:#168c7a;color:#fff}.id24-plain{border:2px solid #b7d1d9;background:#fff;color:#365f70}.id24-tools{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px;padding-top:14px;border-top:1px solid #d9e8eb}.id24-tools button{min-height:46px;padding:0 14px;border:2px solid #c3dade;border-radius:12px;background:#fff;color:#3c6271;font-size:14px;font-weight:900}.id24-status{min-height:32px;margin-top:15px;color:#59737d;text-align:center;font-size:15px;font-weight:850;line-height:1.45}.id24-status.ok{color:#14745f}.id24-status.try{color:#786128}.id24-task{text-align:center}.id24-object,.id24-mall,.id24-tea,.id24-paper,.id24-safe,.id24-gate{display:grid;justify-items:center;gap:8px;max-width:490px;margin:0 auto 16px;padding:20px;border:3px solid #c7e0e4;border-radius:22px;background:#f4fbff;color:#2d596b}.id24-object.warn{border-color:#edbd48;background:#fff9dc}.id24-object span,.id24-mall span,.id24-tea span,.id24-paper span,.id24-safe span,.id24-gate span{font-size:55px}.id24-object b,.id24-mall b,.id24-tea b,.id24-paper b,.id24-safe b,.id24-gate b{font-size:21px}.id24-object small,.id24-gate small{color:#5d7480}.id24-choice{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;max-width:670px;margin:16px auto}.id24-choice button,.id24-targets button,.id24-coins button{min-height:74px;padding:12px 16px;border:3px solid #c5dce2;border-radius:16px;background:#fff;color:#315a6c;font-size:18px;font-weight:900}.id24-drag{display:grid;justify-items:center;gap:6px;width:200px;min-height:122px;margin:18px auto;padding:15px;border:3px dashed #67afc1;border-radius:22px;background:#f5fcff;color:#2c5b6c;cursor:grab;touch-action:none}.id24-drag span{font-size:57px}.id24-drag b{font-size:20px}.id24-targets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:760px;margin:16px auto}.id24-targets span{display:block;font-size:48px}.id24-targets b{display:block;margin-top:5px;font-size:19px}.id24-wallet,.id24-sensor,.id24-shredder,.id24-pack-target{display:grid;justify-items:center;gap:6px;max-width:340px;width:100%;margin:18px auto;padding:18px;border:3px dashed #b6a55b;border-radius:22px;background:#fff8dc;color:#665020}.id24-wallet span,.id24-sensor span,.id24-shredder span,.id24-pack-target span{font-size:56px}.id24-wallet b,.id24-sensor b,.id24-shredder b,.id24-pack-target b{font-size:20px}.id24-wallet small,.id24-sensor small,.id24-shredder small,.id24-pack-target small{color:#6e7058}.id24-sensor{border-color:#e49b40;background:#fff4dd}.id24-gate.open{border-color:#49a989;background:#edfbf4}.id24-sequence{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin:0 auto 18px}.id24-sequence span{display:grid;gap:4px;min-width:100px;padding:12px;border:3px solid #d4e0e4;border-radius:15px;background:#fff;color:#506a75;font-size:38px}.id24-sequence small{font-size:12px;font-weight:900}.id24-sequence .now{border-color:#269b85;background:#f0fbf6}.id24-sequence .done{opacity:.48}.id24-total{max-width:510px;margin:16px auto;padding:18px;border-radius:20px;background:#ecf8ff;color:#315b72;font-size:22px;font-weight:900}.id24-total small{display:block;min-height:28px;margin-top:8px;font-size:20px;letter-spacing:2px}.id24-coins{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;margin:16px 0}.id24-coins button{min-width:98px;border-color:#d7bd7b;background:#fff9ed;color:#6d5420}.id24-coins span{display:block;font-size:27px}.id24-shredder{border-color:#b1bac1;background:#eef3f6}.id24-pack-target{border-color:#54a990;background:#f0fbf6}.id24-pack-target.step-1{border-color:#5ca5cf;background:#eff9ff}.id24-pack-target.step-2{border-color:#e0b756;background:#fff9e4}.id24-dots{display:flex;justify-content:center;gap:20px;margin-top:15px}.id24-dots i{width:20px;height:20px;border:3px dashed #65a4be;border-radius:5px}.id24-summary{text-align:center}.id24-summary>span{display:grid;place-items:center;width:78px;height:78px;margin:auto;border-radius:50%;background:#dcf4e9;color:#218461;font-size:41px;font-weight:950}.id24-summary h3{margin:14px 0 5px;font-size:26px}.id24-summary p{color:#5d7580}.id24-summary>div{display:flex;justify-content:center;gap:13px;margin:17px 0}.id24-summary>div b{padding:11px;border-radius:12px;background:#f1f8fa;color:#2e586a}.id24-host button:focus-visible{outline:4px solid #0a5f99;outline-offset:3px}.id24-host button:active{transform:scale(.97)}.id24-reduced *{animation:none!important;transition:none!important}@media(max-width:640px){.id24-shell{padding:18px}.id24-menu,.id24-targets,.id24-choice{grid-template-columns:1fr}.id24-ready{grid-template-columns:1fr}.id24-actions{flex-direction:column}.id24-main,.id24-plain{width:100%}.id24-progress{grid-template-columns:1fr auto}.id24-progress span{grid-column:1/-1}.id24-summary>div{flex-direction:column}.id24-sequence span{min-width:74px}}`;
    document.head.appendChild(style);
  }

  window.ID_ADVANCED_GAMES_LAB = {
    open(nextOptions = {}) { close(); options = nextOptions; returnFocus = nextOptions.trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null); styles(); host = document.createElement('div'); host.className = 'id24-host'; document.body.appendChild(host); document.addEventListener('keydown', handleKey); menu(); },
    activityCards(nextStage = 'lower') { return (STAGES[nextStage] || STAGES.lower).games.map((id) => ({ id, ...GAMES[id] })); }
  };
})();
