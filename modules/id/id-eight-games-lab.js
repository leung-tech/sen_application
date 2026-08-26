/* Design: ID「安定生活練習室」— 大圖示、廣東話慢速旁白、一步一提示、可拖放或點選、零挫敗回饋。 */
(function () {
  'use strict';

  const STAGES = {
    lower: { label: '初小 · P1–P3', games: ['bus', 'outfit'] },
    upper: { label: '高小 · P4–P6', games: ['snack', 'signs'] },
    junior: { label: '初中 · S1–S3', games: ['burger', 'schedule'] },
    senior: { label: '高中 · S4–S6', games: ['stock', 'emergency'] },
  };

  const GAMES = {
    bus: { icon: '🚌', title: '校園巴士對對碰', focus: '初小 · 顏色與圖形配對', description: '把同色書包或學生公仔放到同色校園巴士；不設限時。', prep: ['先看手上物件的顏色。', '找相同顏色的巴士。', '可拖放，也可直接點一下巴士。'] },
    outfit: { icon: '🌦️', title: '今日著咩衫？', focus: '初小 · 天氣與自理', description: '看窗外天氣，為小明選擇合適物品或衣服。', prep: ['先看窗外是甚麼天氣。', '找一件最適合外出的物品。', '不確定時，慢慢再看天氣圖示。'] },
    snack: { icon: '🥖', title: '小食部買麵包', focus: '高小 · 香港硬幣與付款', description: '看清楚售價，以合適硬幣付錢；可慢慢湊足金額。', prep: ['先看麵包的價錢。', '每次只選一枚硬幣。', '湊夠金額後才交給收銀機。'] },
    signs: { icon: '🚦', title: '社區標示大搜查', focus: '高小 · 社區安全與導航', description: '辨認紅綠燈、洗手間、港鐵與安全出口等常見標示。', prep: ['先看大圖示和所在情境。', '只找最安全或最合適的一個選擇。', '答錯時可再看圖示提示。'] },
    burger: { icon: '🍔', title: '快餐店實習生：漢堡包組裝線', focus: '初中 · 工作步驟與記憶', description: '跟隨由左至右的視覺食譜，逐步完成漢堡包。', prep: ['先看頂部的食譜順序。', '每次只拿下一樣食材。', '完成一步才做下一步。'] },
    schedule: { icon: '⏰', title: '我的一日小鬧鐘', focus: '初中 · 時間與日程', description: '把返學、食晚餐和瞓覺配對到合適的數字時間。', prep: ['先讀一次時鐘上的數字。', '想想這個時間通常做甚麼。', '可把活動拖到時鐘，也可直接點選。'] },
    stock: { icon: '🛒', title: '超級市場理貨員', focus: '高中 · 職業分類與上架', description: '把飲品和清潔用品放到對應貨架，練習理貨工作。', prep: ['先看推車內的一件貨品。', '看清楚它是飲品還是清潔用品。', '把貨品放到相同類別的貨架。'] },
    emergency: { icon: '☎️', title: '緊急求助熱線：119 還是 999？', focus: '高中 · 危機求助與自我保護', description: '在火警或有人暈倒時，練習撥打 999 並說出地址。', prep: ['先看情境，判斷是否需要緊急協助。', '需要消防車或救護車時，慢慢按 9、9、9。', '接通後，先選擇自己的地址資料。'], total: 8 },
  };

  const BUS_TARGETS = [{ color: '紅色', tone: 'red' }, { color: '黃色', tone: 'yellow' }, { color: '藍色', tone: 'blue' }, { color: '綠色', tone: 'green' }];
  const BUS = [{ color: '紅色', icon: '🎒', item: '紅色書包' }, { color: '黃色', icon: '🧸', item: '黃色玩具熊' }, { color: '藍色', icon: '📘', item: '藍色圖書' }, { color: '綠色', icon: '🍏', item: '綠色蘋果' }, { color: '紅色', icon: '🖍️', item: '紅色顏色筆' }, { color: '黃色', icon: '🌼', item: '黃色小花' }, { color: '藍色', icon: '💧', item: '藍色水樽' }, { color: '綠色', icon: '🧤', item: '綠色手套' }];
  const OUTFIT = [{ weather: '大雨', sky: '🌧️', answer: '雨傘', choices: ['雨傘', '泳衣', '短袖衫'] }, { weather: '太陽曬', sky: '☀️', answer: '短袖衫', choices: ['厚外套', '短袖衫', '雨傘'] }, { weather: '天氣涼', sky: '☁️', answer: '厚外套', choices: ['泳衣', '厚外套', '雨傘'] }, { weather: '寒冷有風', sky: '🌬️', answer: '外套', choices: ['外套', '背心', '雨傘'] }, { weather: '下毛毛雨', sky: '🌦️', answer: '防水外套', choices: ['防水外套', '拖鞋', '太陽帽'] }, { weather: '去沙灘玩水', sky: '🏖️', answer: '泳衣', choices: ['泳衣', '厚頸巾', '雨靴'] }, { weather: '陽光很猛烈', sky: '🌞', answer: '太陽帽', choices: ['太陽帽', '雨褸', '手套'] }, { weather: '地面有水漬', sky: '💦', answer: '防滑鞋', choices: ['防滑鞋', '拖鞋', '薄襪'] }];
  const SNACK = [{ item: '菠蘿包', icon: '🥖', price: 5 }, { item: '芝士包', icon: '🧀', price: 5 }, { item: '蛋撻', icon: '🥧', price: 10 }, { item: '紙包奶', icon: '🥛', price: 4 }, { item: '雞蛋三文治', icon: '🥪', price: 8 }, { item: '蘋果汁', icon: '🧃', price: 6 }, { item: '火腿包', icon: '🍞', price: 7 }, { item: '魚蛋', icon: '🍢', price: 9 }];
  const SIGNS = [{ scene: '紅燈正在閃。現在可以過馬路嗎？', icon: '🚦', answer: '不過馬路，等綠燈', choices: ['不過馬路，等綠燈', '立即衝過馬路', '低頭看電話'] }, { scene: '想去男廁，應該找哪一個標示？', icon: '🚻', answer: '男廁標示', choices: ['男廁標示', '安全出口標示', '升降機標示'] }, { scene: '看見這個「M」標誌，你知道附近有甚麼？', icon: 'Ⓜ️', answer: '港鐵站', choices: ['港鐵站', '巴士維修站', '圖書館'] }, { scene: '看見綠色跑步人圖示，這是甚麼地方？', icon: '🚪', answer: '安全出口', choices: ['安全出口', '食物櫃', '遊戲室'] }, { scene: '地上剛拖過很濕，應留意哪個標示？', icon: '⚠️', answer: '小心滑倒', choices: ['小心滑倒', '可以跑步', '可以玩水'] }, { scene: '想乘升降機，應找哪個圖示？', icon: '🛗', answer: '升降機標示', choices: ['升降機標示', '男廁標示', '出口標示'] }, { scene: '手有小傷口，需要找哪個標示？', icon: '⛑️', answer: '急救箱標示', choices: ['急救箱標示', '垃圾箱標示', '巴士標示'] }, { scene: '看到禁止飲食圖示，現在應怎樣做？', icon: '🚫', answer: '先不要吃東西', choices: ['先不要吃東西', '立刻打開零食', '把食物丟地上'] }];
  const BURGER = [{ part: '底麵包', icon: '🍞' }, { part: '芝士片', icon: '🧀' }, { part: '漢堡扒', icon: '🥩' }, { part: '番茄片', icon: '🍅' }, { part: '生菜', icon: '🥬' }, { part: '醬汁', icon: '🥫' }, { part: '頂麵包', icon: '🍞' }, { part: '放進餐盤', icon: '🍽️' }];
  const SCHEDULE = [{ time: '07:00', sun: '🌅', answer: '起床刷牙', choices: ['起床刷牙', '瞓覺', '食晚餐'] }, { time: '08:00', sun: '🌅', answer: '返學', choices: ['返學', '睇電視', '瞓覺'] }, { time: '12:30', sun: '☀️', answer: '食午餐', choices: ['食午餐', '沖涼', '瞓覺'] }, { time: '16:00', sun: '🌤️', answer: '做功課', choices: ['做功課', '食早餐', '瞓覺'] }, { time: '18:30', sun: '🌇', answer: '食晚餐', choices: ['瞓覺', '食晚餐', '返學'] }, { time: '19:30', sun: '🌆', answer: '收拾書包', choices: ['收拾書包', '食午餐', '起床'] }, { time: '20:30', sun: '🌙', answer: '沖涼', choices: ['沖涼', '返學', '食早餐'] }, { time: '21:30', sun: '🌙', answer: '瞓覺', choices: ['食晚餐', '返學', '瞓覺'] }];
  const STOCK = [{ item: '紙包奶', icon: '🥛', shelf: 'drink' }, { item: '洗潔精', icon: '🧴', shelf: 'clean' }, { item: '汽水', icon: '🥤', shelf: 'drink' }, { item: '沐浴露', icon: '🧼', shelf: 'clean' }, { item: '果汁', icon: '🧃', shelf: 'drink' }, { item: '洗衣液', icon: '🫧', shelf: 'clean' }, { item: '樽裝水', icon: '💧', shelf: 'drink' }, { item: '洗手液', icon: '🧴', shelf: 'clean' }];
  const EMERGENCY = [{ scene: '家裡廚房著火了。', icon: '🔥', answer: '離開危險位置並打 999', choices: ['離開危險位置並打 999', '回去拿玩具', '躲在廚房'] }, { scene: '看見有人暈倒，需要救護車。', icon: '🧑‍⚕️', answer: '找成人協助並打 999', choices: ['找成人協助並打 999', '自己搬動對方', '圍著拍照'] }, { scene: '大廈走廊有濃煙。', icon: '💨', answer: '遠離濃煙並通知成人', choices: ['遠離濃煙並通知成人', '走進濃煙查看', '回房間鎖門'] }, { scene: '在商場和家人走散。', icon: '🏬', answer: '留在原處找職員', choices: ['留在原處找職員', '跟陌生人離開', '跑到停車場'] }, { scene: '有人叫你交出家門密碼。', icon: '🔐', answer: '不要說密碼，找可信任成人', choices: ['不要說密碼，找可信任成人', '立刻說出密碼', '把門匙送人'] }, { scene: '過馬路時看見車輛很快接近。', icon: '🚗', answer: '留在安全位置等候', choices: ['留在安全位置等候', '衝出去比快', '閉眼過路'] }, { scene: '手被熱水輕微燙到。', icon: '♨️', answer: '用流動清水沖並找成人', choices: ['用流動清水沖並找成人', '繼續玩火', '塗上不明藥膏'] }, { scene: '在巴士站感到很不舒服。', icon: '🚌', answer: '坐下並向職員或成人求助', choices: ['坐下並向職員或成人求助', '獨自走去偏僻地方', '忍住不說'] }];
  Object.assign(GAMES.bus, { rounds: BUS }); Object.assign(GAMES.outfit, { rounds: OUTFIT }); Object.assign(GAMES.snack, { rounds: SNACK }); Object.assign(GAMES.signs, { rounds: SIGNS }); Object.assign(GAMES.burger, { rounds: BURGER }); Object.assign(GAMES.schedule, { rounds: SCHEDULE }); Object.assign(GAMES.stock, { rounds: STOCK }); Object.assign(GAMES.emergency, { rounds: EMERGENCY });
  const ANSWER_POSITION_PATTERNS = {
    outfit: [1,0,2,1,2,0,1,0],
    signs: [2,1,0,2,0,1,2,0],
    schedule: [0,2,1,0,1,2,0,2],
    emergency: [2,0,1,2,0,1,0,1]
  };
  Object.entries(ANSWER_POSITION_PATTERNS).forEach(([key, pattern]) => {
    GAMES[key].answerPositionStrategy = 'irregular-balanced';
    GAMES[key].answerPositionPattern = pattern;
  });

  const roundItem = (items) => items[state.round % items.length];

  let host = null;
  let options = null;
  let state = null;
  let returnFocus = null;
  const q = (selector) => host?.querySelector(selector);
  const qa = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const later = (fn, wait = 360) => window.setTimeout(fn, state?.reduceMotion ? 60 : wait);
  const stage = () => STAGES[options?.stage] || STAGES.lower;
  const game = () => GAMES[state?.game];
  const orderedChoices = (item, gameId) => {
    const choices = [...item.choices]; const pattern = ANSWER_POSITION_PATTERNS[gameId]; const position = pattern?.[state.round % pattern.length];
    if (!Number.isInteger(position) || position < 0 || position >= choices.length || !choices.includes(item.answer)) return choices;
    const others = choices.filter((choice) => choice !== item.answer); const shown = [];
    for (let index = 0; index < choices.length; index += 1) shown[index] = index === position ? item.answer : others.shift();
    return shown;
  };

  function speak(text) {
    if (!state?.speech || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    utterance.lang = 'zh-HK';
    utterance.rate = 0.72;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function status(text, type = '', voice = true) {
    const node = q('#id8Status');
    if (node) { node.textContent = text; node.className = `id8-status ${type}`; }
    if (voice) speak(text);
  }

  function progress() {
    const total = state?.total || 1;
    const done = Math.min(state?.round || 0, total);
    return `<div class="id8-progress-row"><div class="id8-progress" role="progressbar" aria-label="目前步驟進度" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><i style="width:${(done / total) * 100}%"></i></div><b>步驟 ${Math.min(done + 1, total)}/${total}</b><span>慢慢做就可以</span></div>`;
  }

  function header(title, detail) { return `<header class="id8-head"><div><span>${stage().label} · ID 生活技能</span><h2 id="id8Title">${title}</h2><p>${detail}</p></div><button type="button" id="id8Close" aria-label="關閉 ID 分齡生活遊戲">×</button></header>`; }
  function support() { return `<footer class="id8-tools"><button id="id8Pause" type="button">${state?.paused ? '▶ 繼續練習' : '☁ 先停一停'}</button><button id="id8Read" type="button" aria-pressed="${Boolean(state?.speech)}">${state?.speech ? '🔊 廣東話旁白：開' : '🔇 廣東話旁白：關'}</button><button id="id8Motion" type="button" aria-pressed="${Boolean(state?.reduceMotion)}">${state?.reduceMotion ? '◌ 減少動態：開' : '◒ 減少動態：關'}</button></footer>`; }

  function screen(content) {
    if (!host) return;
    host.classList.toggle('id8-reduce', Boolean(state?.reduceMotion));
    host.innerHTML = `<section class="id8-shell" role="dialog" aria-modal="true" aria-labelledby="id8Title">${content}</section>`;
    q('#id8Close')?.addEventListener('click', close);
    q('#id8Pause')?.addEventListener('click', () => { state.paused = !state.paused; q('#id8Pause').textContent = state.paused ? '▶ 繼續練習' : '☁ 先停一停'; status(state.paused ? '可以先停一停。準備好才繼續，沒有扣分。' : '已繼續。只做目前這一步即可。'); });
    q('#id8Read')?.addEventListener('click', () => { state.speech = !state.speech; q('#id8Read').setAttribute('aria-pressed', String(state.speech)); q('#id8Read').textContent = state.speech ? '🔊 廣東話旁白：開' : '🔇 廣東話旁白：關'; if (state.speech) speak(q('#id8Status')?.textContent || '請慢慢完成這一步。'); });
    q('#id8Motion')?.addEventListener('click', () => { state.reduceMotion = !state.reduceMotion; host.classList.toggle('id8-reduce', state.reduceMotion); q('#id8Motion').setAttribute('aria-pressed', String(state.reduceMotion)); q('#id8Motion').textContent = state.reduceMotion ? '◌ 減少動態：開' : '◒ 減少動態：關'; status(state.reduceMotion ? '已減少非必要動態。' : '已恢復一般動態。'); });
  }

  function shell(title, detail, workspace, voice) {
    screen(`${header(title, detail)}${progress()}<main class="id8-workspace">${workspace}</main><div id="id8Status" class="id8-status" role="status" aria-live="polite" aria-atomic="true">請慢慢做；不需要比速度。</div>${support()}`);
    later(() => speak(voice || detail), 80);
  }

  function correct(text, next) { if (state.paused) return; state.correct += 1; status(`✓ ${text}`, 'ok'); later(next); }
  function gentle(text) { if (state.paused) return; state.tries += 1; status(`↗ 差少少。${text}`, 'try'); }
  function advance(renderer) { state.round += 1; if (state.round >= state.total) finish(); else renderer(); }

  function finish() {
    const item = game();
    options?.onComplete?.({ label: `${item.title} · ${stage().label}`, mode: `id-eight-${state.game}`, total: state.total, correct: state.correct, incorrect: state.tries, completedAt: new Date().toLocaleString('zh-HK') });
    screen(`${header('本次生活小任務完成', '完成一小步、提出需要和慢慢再試，都是重要能力。')}${progress()}<main class="id8-workspace"><div class="id8-summary"><span>✓</span><h3>${item.title}</h3><p>你已完成 ${state.total} 個清楚步驟。</p><div><b>完成步驟 ${state.total}/${state.total}</b><b>正確回應 ${state.correct}</b></div><button id="id8Again" class="id8-main" type="button">↺ 再玩一次</button><button id="id8Menu" class="id8-plain" type="button">選另一項遊戲</button></div></main><div id="id8Status" class="id8-status ok" role="status" aria-live="polite">可以先休息，或選另一項生活練習。</div>${support()}`);
    q('#id8Again')?.addEventListener('click', () => ready(state.game));
    q('#id8Menu')?.addEventListener('click', menu);
    later(() => speak('你完成了。可以先休息，或者選另一項生活練習。'), 80);
  }

  function menu() {
    state = { speech: true, reduceMotion: false, paused: false, round: 0, total: 0, correct: 0, tries: 0 };
    const cards = stage().games.map((id) => { const item = GAMES[id]; return `<button class="id8-card" type="button" data-id8-game="${id}"><span>${item.icon}</span><small>${item.focus}</small><strong>${item.title}</strong><p>${item.description}</p><b>→</b></button>`; }).join('');
    screen(`${header('ID 分齡生活技能遊戲', '每個學段有兩項新遊戲。每一步都有廣東話慢速旁白、大型操作區和可重試提示。')}<main class="id8-workspace"><div class="id8-notice">所有活動均不設倒數、不比較速度；答錯時只會給下一個溫和提示。</div><div class="id8-menu">${cards}</div></main><div id="id8Status" class="id8-status" role="status" aria-live="polite">請選擇一項想練習的生活技能。</div>${support()}`);
    qa('[data-id8-game]').forEach((button) => button.addEventListener('click', () => ready(button.dataset.id8Game)));
    q('#id8Close')?.focus();
    later(() => speak('請選擇一項想練習的生活技能。'), 80);
  }

  function ready(id) {
    const item = GAMES[id];
    state = { game: id, speech: true, reduceMotion: false, paused: false, round: 0, total: item.total || 8, correct: 0, tries: 0, paid: 0, used: [], dial: '' };
    screen(`${header(`${item.title} · 準備頁`, '按「我準備好了」後才會開始題目；沒有計時壓力。')}<main class="id8-workspace"><section class="id8-ready"><span>${item.icon}</span><div><b>先一起讀三步</b><ol>${item.prep.map((step) => `<li>${step}</li>`).join('')}</ol><p>可用點選、拖放、指一指或說出答案。感到不確定時，隨時可先停一停。</p></div></section><div class="id8-actions"><button id="id8Menu" class="id8-plain" type="button">← 換一項</button><button id="id8Start" class="id8-main" type="button">✓ 我準備好了</button></div></main><div id="id8Status" class="id8-status" role="status" aria-live="polite">現在是準備時間；廣東話旁白已開啟。</div>${support()}`);
    q('#id8Menu')?.addEventListener('click', menu);
    q('#id8Start')?.addEventListener('click', () => begin(id));
    q('#id8Start')?.focus();
    later(() => speak(`${item.title}。${item.prep.join('。')}`), 80);
  }

  function begin(id) {
    state.round = 0; state.correct = 0; state.tries = 0; state.paid = 0; state.used = []; state.dial = '';
    ({ bus: renderBus, outfit: renderOutfit, snack: renderSnack, signs: renderSigns, burger: renderBurger, schedule: renderSchedule, stock: renderStock, emergency: renderEmergency })[id]();
  }

  function dropSetup(source, targets, resolve) {
    q(source)?.addEventListener('dragstart', (event) => event.dataTransfer?.setData('text/plain', source));
    qa(targets).forEach((target) => { target.addEventListener('dragover', (event) => event.preventDefault()); target.addEventListener('drop', (event) => { event.preventDefault(); resolve(target); }); });
  }

  function renderBus() {
    const item = roundItem(BUS);
    shell(GAMES.bus.title, '請把物件放到相同顏色的校園巴士。', `<div class="id8-task"><p>這是一個 <b>${item.item}</b>。</p><div id="id8BusItem" class="id8-drag-item" draggable="true"><span>${item.icon}</span><b>${item.item}</b></div><div class="id8-bus-row">${BUS_TARGETS.map((bus) => `<button type="button" class="id8-bus ${bus.tone}" data-id8-bus="${bus.color}"><span>🚌</span><b>${bus.color}巴士</b></button>`).join('')}</div></div>`, `現在是一個${item.item}。請找${item.color}巴士。`);
    const decide = (color) => color === item.color ? correct(`答對啦！${item.color}物件已上車。`, () => advance(renderBus)) : gentle(`再看看物件和巴士的顏色。`);
    qa('[data-id8-bus]').forEach((button) => button.addEventListener('click', () => decide(button.dataset.id8Bus)));
    dropSetup('#id8BusItem', '[data-id8-bus]', (target) => decide(target.dataset.id8Bus));
  }

  function renderOutfit() {
    const item = roundItem(OUTFIT);
    shell(GAMES.outfit.title, `窗外${item.weather}。小明要帶甚麼出街？`, `<div class="id8-task"><div class="id8-weather"><span>${item.sky}</span><div><b>窗外：${item.weather}</b><small>請為小明選一樣合適物品。</small></div></div><div class="id8-person"><span>🙂</span><div><b>小明</b><p>請把物品交給我。</p></div></div><div class="id8-choice-grid">${orderedChoices(item, 'outfit').map((choice) => `<button type="button" class="id8-choice" data-id8-outfit="${choice}">${choice}</button>`).join('')}</div></div>`, `今日${item.weather}。小明要帶甚麼出街？`);
    qa('[data-id8-outfit]').forEach((button) => button.addEventListener('click', () => button.dataset.id8Outfit === item.answer ? correct(`對了，${item.answer}很合適。`, () => advance(renderOutfit)) : gentle(`再看看窗外的${item.weather}圖示。`)));
  }

  function renderSnack() {
    const item = roundItem(SNACK);
    const coins = [1, 2, 5, 10];
    shell(GAMES.snack.title, `小食部的${item.item}售價 $${item.price}。請慢慢選硬幣。`, `<div class="id8-task"><div class="id8-order"><span>${item.icon}</span><b>${item.item}</b><strong>售價：$${item.price}</strong></div><div class="id8-payment"><b>收銀機：$${state.paid} / $${item.price}</b><div>${'🪙'.repeat(state.used.length) || '請選硬幣'}</div></div><div class="id8-money-row">${coins.map((amount) => `<button type="button" data-id8-coin="${amount}"><span>🪙</span>$${amount}</button>`).join('')}</div></div>`, `這個${item.item}售價${item.price}元。現在收銀機有${state.paid}元。`);
    qa('[data-id8-coin]').forEach((button) => button.addEventListener('click', () => { const amount = Number(button.dataset.id8Coin); if (state.paid + amount > item.price) return gentle(`現在已有${state.paid}元。麵包只需要${item.price}元，可以試另一枚硬幣。`); state.paid += amount; state.used.push(amount); if (state.paid === item.price) correct(`剛好 ${item.price} 元。多謝你付款。`, () => { state.paid = 0; state.used = []; advance(renderSnack); }); else renderSnack(); }));
  }

  function renderSigns() {
    const item = roundItem(SIGNS);
    shell(GAMES.signs.title, item.scene, `<div class="id8-task"><div class="id8-sign-scene"><span>${item.icon}</span><b>${item.scene}</b></div><div class="id8-choice-grid">${orderedChoices(item, 'signs').map((choice) => `<button type="button" class="id8-choice" data-id8-sign="${choice}">${choice}</button>`).join('')}</div></div>`, item.scene);
    qa('[data-id8-sign]').forEach((button) => button.addEventListener('click', () => button.dataset.id8Sign === item.answer ? correct('你選擇了安全又合適的做法。', () => advance(renderSigns)) : gentle('再看看大圖示，想想甚麼做法較安全。')));
  }

  function renderBurger() {
    const recipeStep = state.round % BURGER.length; const expected = BURGER[recipeStep];
    shell(GAMES.burger.title, '跟隨頂部視覺食譜，由左至右放食材。', `<div class="id8-task"><div class="id8-recipe">${BURGER.map((part, index) => `<span class="${index < recipeStep ? 'done' : index === recipeStep ? 'now' : ''}">${part.icon}<small>${part.part}</small></span>`).join('')}</div><p>現在是第 ${state.round + 1}/${state.total} 步：請選 <b>${expected.part}</b>。</p><div class="id8-ingredient-row">${BURGER.map((part) => `<button type="button" data-id8-burger="${part.part}"><span>${part.icon}</span>${part.part}</button>`).join('')}</div></div>`, `請跟食譜。現在是第${state.round + 1}步，選${expected.part}。`);
    qa('[data-id8-burger]').forEach((button) => button.addEventListener('click', () => button.dataset.id8Burger === expected.part ? correct(`已放好${expected.part}。`, () => advance(renderBurger)) : gentle(`先看食譜的下一格。現在需要${expected.part}。`)));
  }

  function renderSchedule() {
    const item = roundItem(SCHEDULE);
    shell(GAMES.schedule.title, `時鐘顯示 ${item.time}。這個時間通常做甚麼？`, `<div class="id8-task"><div class="id8-clock"><span>${item.sun}</span><b>${item.time}</b><small>現在做甚麼？</small></div><div class="id8-choice-grid">${orderedChoices(item, 'schedule').map((choice) => `<button type="button" class="id8-choice" data-id8-schedule="${choice}">${choice}</button>`).join('')}</div></div>`, `時鐘顯示${item.time}。這個時間通常做甚麼？`);
    qa('[data-id8-schedule]').forEach((button) => button.addEventListener('click', () => button.dataset.id8Schedule === item.answer ? correct(`對了，${item.time}通常是${item.answer}時間。`, () => advance(renderSchedule)) : gentle(`再看看${item.time}和天空圖示。`)));
  }

  function renderStock() {
    const item = roundItem(STOCK);
    shell(GAMES.stock.title, '把推車內貨品放到相同類別的貨架。', `<div class="id8-task"><div id="id8StockItem" class="id8-drag-item" draggable="true"><span>${item.icon}</span><b>${item.item}</b></div><div class="id8-shelf-row"><button type="button" class="id8-shelf drink" data-id8-shelf="drink"><span>🥤</span><b>飲品貨架</b><small>奶、汽水、果汁</small></button><button type="button" class="id8-shelf clean" data-id8-shelf="clean"><span>🧴</span><b>清潔用品貨架</b><small>洗潔精、沐浴露</small></button></div></div>`, `推車內有${item.item}。請放到合適貨架。`);
    const decide = (shelf) => shelf === item.shelf ? correct(`${item.item}已放到合適貨架。`, () => advance(renderStock)) : gentle('貨架會輕輕提醒你。再看看這是飲品還是清潔用品。');
    qa('[data-id8-shelf]').forEach((button) => button.addEventListener('click', () => decide(button.dataset.id8Shelf)));
    dropSetup('#id8StockItem', '[data-id8-shelf]', (target) => decide(target.dataset.id8Shelf));
  }

  function renderEmergency() {
    const item = EMERGENCY[state.round];
    shell(GAMES.emergency.title, item.scene, `<div class="id8-task"><div class="id8-emergency-scene"><span>${item.icon}</span><b>${item.scene}</b><small>先讓自己留在安全位置，再找可信任成人或職員協助。</small></div><div class="id8-choice-grid">${orderedChoices(item, 'emergency').map((choice) => `<button type="button" class="id8-choice" data-id8-emergency="${choice}">${choice}</button>`).join('')}</div></div>`, item.scene);
    qa('[data-id8-emergency]').forEach((button) => button.addEventListener('click', () => button.dataset.id8Emergency === item.answer ? correct('你選擇了安全而清楚的下一步。', () => advance(renderEmergency)) : gentle('先看看哪一個做法能讓自己留在安全位置並找到協助。')));
  }

  function handleKey(event) { if (host && event.key === 'Escape') { event.preventDefault(); close(); } }
  function close() { try { window.speechSynthesis?.cancel(); } catch (_) {} const target = returnFocus; document.removeEventListener('keydown', handleKey); host?.remove(); host = null; state = null; if (target?.isConnected) requestAnimationFrame(() => target.focus()); }

  function styles() {
    if (document.getElementById('id-eight-games-style')) return;
    const style = document.createElement('style');
    style.id = 'id-eight-games-style';
    style.textContent = `
      .id8-host{position:fixed;inset:0;z-index:1150;display:grid;place-items:center;padding:16px;background:rgba(15,43,58,.72);backdrop-filter:blur(5px);color:#244a5d}.id8-shell{width:min(920px,100%);max-height:94vh;overflow:auto;border:2px solid #fff;border-radius:28px;background:linear-gradient(145deg,#fffdf7,#f2faff);box-shadow:0 26px 72px rgba(8,25,48,.42);padding:clamp(18px,3vw,30px)}.id8-head{display:flex;justify-content:space-between;gap:18px}.id8-head span{color:#207d75;font-size:12px;font-weight:950;letter-spacing:.08em}.id8-head h2{margin:5px 0;color:#173e54;font-size:clamp(27px,4vw,38px);line-height:1.15}.id8-head p{max-width:680px;margin:0;color:#5b7480;line-height:1.55}.id8-head>button{width:52px;min-width:52px;height:52px;border:0;border-radius:50%;background:#e7f0f2;color:#31596a;font-size:30px;font-weight:950}.id8-progress-row{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:12px;margin-top:18px;color:#56727d;font-size:14px}.id8-progress{height:12px;overflow:hidden;border-radius:999px;background:#dfecef}.id8-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#26a68c,#5ea6d7);transition:width .25s ease}.id8-workspace{margin-top:18px}.id8-notice,.id8-clue,.id8-sentence{margin:14px 0 0;padding:14px 16px;border-left:5px solid #43a68f;border-radius:14px;background:#eefaf6;color:#2a665a;font-size:15px;font-weight:800;line-height:1.55}.id8-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}.id8-card{position:relative;min-height:196px;padding:20px;border:3px solid #c7e0e4;border-radius:22px;background:#fff;color:#264d60;text-align:left}.id8-card:hover{border-color:#299784;background:#f5fffc}.id8-card>span{display:block;font-size:43px}.id8-card small{display:block;margin-top:7px;color:#258278;font-weight:900}.id8-card strong{display:block;margin-top:5px;font-size:21px}.id8-card p{margin:8px 36px 0 0;color:#5d7681;font-size:14px;line-height:1.48}.id8-card>b{position:absolute;right:18px;bottom:16px;color:#1d917c;font-size:26px}.id8-ready{display:grid;grid-template-columns:auto 1fr;gap:18px;padding:20px;border:2px solid #bce4d4;border-radius:22px;background:#f1fbf7}.id8-ready>span{display:grid;place-items:center;width:82px;height:82px;border-radius:22px;background:#daf2e8;font-size:45px}.id8-ready b{color:#237365}.id8-ready ol{display:grid;gap:9px;margin:9px 0;padding-left:25px;line-height:1.5}.id8-ready p{margin:0;color:#6b6644;font-size:14px;line-height:1.5}.id8-actions{display:flex;justify-content:center;gap:12px;margin-top:18px}.id8-main,.id8-plain{min-height:58px;padding:0 22px;border-radius:16px;font-size:17px;font-weight:950}.id8-main{border:0;background:#168c7a;color:#fff}.id8-plain{border:2px solid #b7d1d9;background:#fff;color:#365f70}.id8-tools{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px;padding-top:14px;border-top:1px solid #d9e8eb}.id8-tools button{min-height:46px;padding:0 14px;border:2px solid #c3dade;border-radius:12px;background:#fff;color:#3c6271;font-size:14px;font-weight:900}.id8-status{min-height:32px;margin-top:15px;color:#59737d;text-align:center;font-size:15px;font-weight:850;line-height:1.45}.id8-status.ok{color:#14745f}.id8-status.try{color:#786128}.id8-task{text-align:center}.id8-task>p{font-size:18px}.id8-drag-item{display:grid;justify-items:center;gap:6px;width:190px;min-height:118px;margin:18px auto;padding:15px;border:3px dashed #67afc1;border-radius:22px;background:#f5fcff;color:#2c5b6c;cursor:grab;touch-action:none}.id8-drag-item span{font-size:57px}.id8-drag-item b{font-size:20px}.id8-bus-row,.id8-shelf-row,.id8-helper-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:760px;margin:16px auto}.id8-bus,.id8-shelf,.id8-helper-row button{min-height:146px;padding:14px;border:3px dashed #8db9c5;border-radius:20px;background:#fff;color:#2d596b}.id8-bus span,.id8-shelf span,.id8-helper-row span{display:block;font-size:48px}.id8-bus b,.id8-shelf b,.id8-helper-row b{display:block;margin-top:5px;font-size:19px}.id8-bus.red{background:#fff1ee;border-color:#e39b8a}.id8-bus.yellow{background:#fffbe6;border-color:#e0bf51}.id8-bus.blue{background:#eff9ff;border-color:#77b3d2}.id8-shelf-row{grid-template-columns:repeat(2,minmax(0,1fr));max-width:620px}.id8-shelf small,.id8-helper-row small{display:block;margin-top:5px;color:#63808b}.id8-weather,.id8-sign-scene,.id8-emergency-scene,.id8-person{display:flex;align-items:center;gap:16px;max-width:620px;margin:0 auto 16px;padding:17px;border-radius:21px;background:#f2f8fc;text-align:left}.id8-weather>span,.id8-sign-scene>span,.id8-emergency-scene>span,.id8-person>span{font-size:52px}.id8-weather b,.id8-sign-scene b,.id8-emergency-scene b,.id8-person b{display:block;font-size:19px}.id8-weather small,.id8-emergency-scene small,.id8-person p{display:block;margin-top:5px;color:#5c7481;font-size:14px;line-height:1.45}.id8-choice-grid{display:grid;gap:12px;max-width:620px;margin:0 auto}.id8-choice{min-height:70px;padding:13px 18px;border:3px solid #c5dce2;border-radius:16px;background:#fff;color:#315a6c;font-size:18px;font-weight:900}.id8-order{display:grid;justify-items:center;gap:5px;max-width:390px;margin:0 auto 16px;padding:15px;border-radius:18px;background:#fff7e6;color:#665020}.id8-order span{font-size:48px}.id8-order b{font-size:20px}.id8-order strong{font-size:22px}.id8-payment{max-width:510px;margin:16px auto;padding:18px;border-radius:20px;background:#ecf8ff;color:#315b72}.id8-payment b{font-size:21px}.id8-payment div{min-height:30px;margin-top:8px;font-size:22px;letter-spacing:2px}.id8-money-row,.id8-ingredient-row{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;margin:16px 0}.id8-money-row button,.id8-ingredient-row button{min-width:92px;min-height:70px;padding:8px 12px;border:3px solid #d7bd7b;border-radius:16px;background:#fff9ed;color:#6d5420;font-size:18px;font-weight:950}.id8-money-row span,.id8-ingredient-row span{display:block;font-size:27px}.id8-recipe{display:flex;justify-content:center;flex-wrap:wrap;gap:9px;margin-bottom:17px}.id8-recipe span{display:grid;gap:3px;min-width:90px;padding:10px;border:3px solid #d4e0e4;border-radius:15px;background:#fff;color:#506a75;font-size:34px}.id8-recipe small{font-size:12px;font-weight:900}.id8-recipe .now{border-color:#269b85;background:#f0fbf6}.id8-recipe .done{opacity:.48}.id8-clock{display:grid;justify-items:center;gap:4px;max-width:270px;margin:0 auto 18px;padding:20px;border:5px solid #81b4c8;border-radius:50%;background:#f3fbfd;color:#295d72}.id8-clock span{font-size:38px}.id8-clock b{font-size:35px}.id8-clock small{font-size:14px;font-weight:900}.id8-dial-display{max-width:350px;margin:18px auto;padding:18px;border-radius:16px;background:#223f51;color:#dff8ff;font-size:34px;font-weight:950;letter-spacing:12px}.id8-dial-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:340px;margin:auto}.id8-dial-pad button{min-height:67px;border:3px solid #bcd4dc;border-radius:17px;background:#fff;color:#305b6c;font-size:25px;font-weight:950}.id8-summary{text-align:center}.id8-summary>span{display:grid;place-items:center;width:78px;height:78px;margin:auto;border-radius:50%;background:#dcf4e9;color:#218461;font-size:41px;font-weight:950}.id8-summary h3{margin:14px 0 5px;font-size:26px}.id8-summary p{color:#5d7580}.id8-summary>div{display:flex;justify-content:center;gap:13px;margin:17px 0}.id8-summary>div b{padding:11px;border-radius:12px;background:#f1f8fa;color:#2e586a}.id8-host button:focus-visible{outline:4px solid #0a5f99;outline-offset:3px}.id8-host button:active{transform:scale(.97)}.id8-reduce *{animation:none!important;transition:none!important}@media(max-width:640px){.id8-shell{padding:18px}.id8-menu,.id8-bus-row,.id8-shelf-row,.id8-helper-row{grid-template-columns:1fr}.id8-ready{grid-template-columns:1fr}.id8-actions{flex-direction:column}.id8-main,.id8-plain{width:100%}.id8-progress-row{grid-template-columns:1fr auto}.id8-progress-row span{grid-column:1/-1}.id8-summary>div{flex-direction:column}.id8-recipe span{min-width:70px}.id8-task>p{font-size:17px}}`;
    document.head.appendChild(style);
  }

  window.ID_EIGHT_GAMES_LAB = { open(nextOptions = {}) { close(); options = nextOptions; returnFocus = nextOptions.trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null); styles(); host = document.createElement('div'); host.className = 'id8-host'; document.body.appendChild(host); document.addEventListener('keydown', handleKey); menu(); }, activityCards(nextStage = 'lower') { return (STAGES[nextStage] || STAGES.lower).games.map((id) => ({ id, ...GAMES[id] })); } };
})();
