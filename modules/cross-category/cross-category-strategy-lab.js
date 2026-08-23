(function () {
  'use strict';

  const TRACKS = {
    emotion: {
      icon: '🤝',
      title: '同理與協商工房',
      subtitle: '八個虛構角色情境：看不同角度，選一個支持、修復或求助的下一步。',
      cards: [
        { icon: '🧩', title: '積木桌的空位', scene: '虛構角色看見同學在玩積木，想加入但不確定大家的計劃。', prompt: '哪一句最能尊重別人的活動，也表達自己的需要？', choices: ['我可以一起玩嗎？你們現在在做甚麼？', '我現在要玩，請你們全部讓開。', '直接把最重要的積木拿走。'], answer: 0, note: '先觀察，再用清楚的邀請句問一問。' },
        { icon: '⚖️', title: '兩個不同的遊戲想法', scene: '兩位虛構角色對小組遊戲規則有不同想法，聲音開始變大。', prompt: '哪一張卡可先把衝突變成可討論的事情？', choices: ['我喜歡這個方法，因為＿＿。我們可以每人試一回合嗎？', '只有我的方法可以用。', '誰不同意就不能玩。'], answer: 0, note: 'I-message 可以同時說出想法、原因和一個可試行方案。' },
        { icon: '🗺️', title: '排隊時的空間', scene: '虛構角色在餐廳排隊，前面的人正在慢慢看餐牌。', prompt: '哪一個下一步較能顧及空間和當前場合？', choices: ['留一點空位，安靜等候，輪到自己才前進。', '一直貼近前面的人催促。', '越過所有人直接走到前面。'], answer: 0, note: '場合線索可以幫助選擇距離、音量和輪候方式。' },
        { icon: '💬', title: '訊息沒有回覆', scene: '虛構角色傳了一個小組訊息，暫時還沒有人回覆。', prompt: '哪種理解較能保留多個可能性？', choices: ['對方可能在忙、未看到或需要時間；可以稍後再禮貌確認。', '對方一定討厭我。', '立刻在群組連續傳很多訊息。'], answer: 0, note: '看不到完整資訊時，可以保留幾個可能解釋，再選溫和下一步。' },
        { icon: '🧑‍🏫', title: '同伴的玩笑讓人不舒服', scene: '虛構角色聽到一句玩笑後感到不舒服，但不確定對方意思。', prompt: '哪句說法可以先澄清並說出界線？', choices: ['我聽到這句有點不舒服；你可以說說你的意思嗎？', '我會用更難聽的話回應。', '我必須假裝完全沒感覺。'], answer: 0, note: '可以用中性句子澄清，也可以選擇暫停或找支持。' },
        { icon: '🛟', title: '需要支持的秘密', scene: '虛構角色被要求保守一個讓自己感到不安全的秘密。', prompt: '哪一個做法最能保護安全？', choices: ['告訴可信任成人，並按學校既有程序處理。', '因為答應了，所以永遠不能求助。', '自己一個人承擔所有事情。'], answer: 0, note: '涉及不安全、威脅或很難受的事情，找可信任成人是合理的保護方法。' },
        { icon: '🧰', title: '合作後的小修復', scene: '虛構角色忘記帶小組需要的資料，影響了原定安排。', prompt: '哪一句較能開始修復與重新合作？', choices: ['對不起，我漏了這一項；我現在可以做＿＿來補回。', '都是其他人的錯。', '我不再參與，也不說原因。'], answer: 0, note: '修復不等於自責；可以承認影響、提出一小步和請求合作。' },
        { icon: '🌿', title: '先照顧自己再回來', scene: '虛構角色在小組討論時感到太吵和難以集中。', prompt: '哪一個選擇能同時照顧需要與維持溝通？', choices: ['我想先在安靜位置休息幾分鐘，之後再回來聽重點。', '我會突然離開而不說一聲。', '我必須留在不舒服的情境裡。'], answer: 0, note: '休息、重返和請人寫下重點，都是可用的支持策略。' }
      ]
    },
    cognition: {
      icon: '🧠',
      title: '學習策略控制台',
      subtitle: '八個虛構學習任務：預測、分塊、記錄、規劃、切換和修訂。',
      cards: [
        { icon: '🔎', title: '先預測難度', scene: '虛構角色拿到一篇長文章，還未開始閱讀。', prompt: '開始前哪個做法最能幫助安排策略？', choices: ['先看標題和小標，估計哪一段可能最需要提示。', '假裝所有部分都一樣容易。', '因為未讀完就直接放棄。'], answer: 0, note: '難度預測不是評分；它只是幫你選擇要不要先分段、看詞卡或請人帶讀。' },
        { icon: '🧱', title: '把資料分成小塊', scene: '虛構角色要記住三項實驗材料和兩個步驟。', prompt: '哪種整理方式最能減少一次要記的內容？', choices: ['把材料放一組、步驟放另一組，再逐組核對。', '把所有字混在一起反覆看。', '只記第一個字，其他完全不看。'], answer: 0, note: '分塊可以讓資訊變得較容易查看和重新組合。' },
        { icon: '🗂️', title: '找出主旨', scene: '虛構角色讀完一段介紹校園花園的文字。', prompt: '哪一張卡最像在找段落主旨？', choices: ['這段主要說：校園花園如何收集雨水和照顧植物。', '我把每個標點符號都抄一次。', '我只選一個最難的字。'], answer: 0, note: '主旨卡可以先保留「誰／甚麼／做甚麼」的核心訊息。' },
        { icon: '📝', title: '外部提示卡', scene: '虛構角色要完成四個小步驟，但容易在中途忘記下一步。', prompt: '哪個支架可以把工作記憶壓力放到外面？', choices: ['把四步寫成可勾選小卡，每完成一步才看下一步。', '要求自己一次在腦中記住所有細節。', '故意把提示藏起來。'], answer: 0, note: '清單、圖卡和標記是策略工具，不代表能力不足。' },
        { icon: '📅', title: '任務先後次序', scene: '虛構角色今天要交工作紙、找資料和準備明天物品。', prompt: '哪個計劃較容易開始？', choices: ['先做有截止時間的工作紙，再用短清單安排其餘兩項。', '同時打開所有事情但不選第一步。', '只等到最後一刻才看內容。'], answer: 0, note: '計劃可以很短：先選最急的一項，再寫下一小步。' },
        { icon: '🔁', title: '被打斷後回來', scene: '虛構角色做題時收到老師的短通知，回來後忘記剛做到哪裡。', prompt: '哪種回到任務的方法最清楚？', choices: ['看回最後的勾選或標記，重讀目前一題，再做下一步。', '從頭猜一次，不看任何線索。', '因為被打斷就不再繼續。'], answer: 0, note: '標記停點可以讓切換後有一個清楚的返回位置。' },
        { icon: '✅', title: '用證據核對', scene: '虛構角色完成了一道題目，想知道是否需要再看一次。', prompt: '哪個核對問題較具體？', choices: ['我的答案有沒有回應題目中的關鍵詞和資料？', '我是不是比其他人快？', '我有沒有一次也不休息？'], answer: 0, note: '核對策略看的是題目與證據，不是速度或比較。' },
        { icon: '🛠️', title: '修訂不是失敗', scene: '虛構角色發現心智圖漏了一個重要資料點。', prompt: '哪一個看法能支持修訂？', choices: ['加回資料並畫一條新連線；修訂能令作品更清楚。', '漏了一點就代表整份工作沒有價值。', '把整張圖撕掉，不再查看。'], answer: 0, note: '修訂是學習流程的一部分；可以改一小部分，再重新核對。' }
      ]
    }
  };

  let host = null;
  let config = null;
  let state = null;
  let returnFocus = null;
  const q = (selector) => host?.querySelector(selector);
  const qa = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const current = () => TRACKS[config.track].cards[state.index];

  function speak(text) {
    if (!state?.speech || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = 'zh-HK';
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  }

  function status(text, kind = '') {
    const element = q('#crossStatus');
    if (!element) return;
    element.textContent = text;
    element.className = `cross-status ${kind}`;
  }

  function shell(content) {
    host.innerHTML = `<section class="cross-shell" role="dialog" aria-modal="true" aria-labelledby="crossTitle">${content}</section>`;
    q('#crossClose')?.addEventListener('click', close);
    q('#crossRead')?.addEventListener('click', () => {
      state.speech = !state.speech;
      q('#crossRead').textContent = state.speech ? '🔊 朗讀：開' : '🔇 朗讀：關';
      if (state.speech) speak(q('#crossStatus')?.textContent || '請慢慢查看目前策略。');
    });
  }

  function head(track) {
    return `<header class="cross-head"><div><span>${config.track === 'emotion' ? '情緒社交 · 跨類別練習' : '認知學習 · 跨類別練習'}</span><h2 id="crossTitle">${track.title}</h2><p>${track.subtitle}</p></div><button id="crossClose" type="button" aria-label="關閉${track.title}">×</button></header>`;
  }

  function tools() {
    return `<footer class="cross-tools"><button id="crossRead" type="button">${state.speech ? '🔊 朗讀：開' : '🔇 朗讀：關'}</button><button id="crossHint" type="button">💡 看策略提示</button><button id="crossPause" type="button">⏸ 先停一停</button></footer>`;
  }

  function ready() {
    const track = TRACKS[config.track];
    shell(`${head(track)}<main class="cross-work"><section class="cross-ready"><span>${track.icon}</span><div><strong>開始前先知道</strong><p>這是虛構角色的課堂策略練習，不會詢問或記錄你的私人經驗、情緒、行為或能力。</p><ol><li>可選擇看提示、開啟朗讀或隨時停下。</li><li>每張策略卡提供一個可以嘗試的下一步。</li><li>現實中如感到不安全或很難受，請告訴身邊可信任成人並按學校既有程序處理。</li></ol></div></section><div class="cross-actions"><button id="crossStart" class="cross-main" type="button">✓ 我準備好了</button></div></main><div id="crossStatus" class="cross-status" role="status" aria-live="polite">現在是準備時間，沒有倒數或表現評分。</div>${tools()}`);
    q('#crossStart')?.addEventListener('click', play);
    bindTools();
  }

  function play() {
    const track = TRACKS[config.track];
    const card = current();
    const progress = Math.min(state.index + 1, track.cards.length);
    shell(`${head(track)}<div class="cross-progress"><i style="width:${(state.index / track.cards.length) * 100}%"></i><span>策略卡 ${progress} / ${track.cards.length} · 可慢慢完成</span></div><main class="cross-work"><article class="cross-scene"><span aria-hidden="true">${card.icon}</span><div><small>虛構情境</small><h3>${card.title}</h3><p>${card.scene}</p></div></article><h3 class="cross-question">${card.prompt}</h3><div class="cross-choices">${card.choices.map((choice, index) => `<button type="button" data-cross-choice="${index}"><b>${index + 1}.</b> ${choice}</button>`).join('')}</div></main><div id="crossStatus" class="cross-status" role="status" aria-live="polite">先選一張你想查看的策略卡；這不是個人表現評分。</div>${tools()}`);
    qa('[data-cross-choice]').forEach((button) => button.addEventListener('click', () => choose(Number(button.dataset.crossChoice))));
    bindTools();
    requestAnimationFrame(() => q('[data-cross-choice]')?.focus());
  }

  function choose(index) {
    const card = current();
    if (index !== card.answer) {
      status('↗ 可以再比較：哪一個下一步較能照顧安全、需要或學習流程？', 'try');
      return;
    }
    status(`✓ ${card.note}`, 'ok');
    window.setTimeout(() => {
      state.index += 1;
      if (state.index >= TRACKS[config.track].cards.length) finish(); else play();
    }, state.reduced ? 80 : 420);
  }

  function bindTools() {
    q('#crossHint')?.addEventListener('click', () => status(`提示：${current()?.note || '可先選一個想嘗試的下一步。'}`, 'hint'));
    q('#crossPause')?.addEventListener('click', () => status('已暫停在目前策略卡；可以慢慢看、離開，或準備好後再繼續。', 'pause'));
  }

  function finish() {
    const track = TRACKS[config.track];
    shell(`${head(track)}<main class="cross-work"><section class="cross-finish"><span>✓</span><h3>已查看八張策略卡</h3><p>你可以帶走一張最想試的支架：先觀察、說清楚、找支持、分成小步、留下標記或修訂一次。這不是分數、能力排名或個人紀錄。</p><div class="cross-actions"><button id="crossAgain" class="cross-main" type="button">↺ 再看一次</button><button id="crossCloseReturn" class="cross-plain" type="button">← 返回活動庫</button></div></section></main><div id="crossStatus" class="cross-status ok" role="status">可以先休息，或選另一個跨類別練習。</div>${tools()}`);
    q('#crossAgain')?.addEventListener('click', () => { state.index = 0; ready(); });
    q('#crossCloseReturn')?.addEventListener('click', close);
    bindTools();
  }

  function keyboard(event) {
    if (!host) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (/^[1-3]$/.test(event.key) && q('[data-cross-choice]')) {
      event.preventDefault(); qa('[data-cross-choice]')[Number(event.key) - 1]?.click();
    }
  }

  function close() {
    try { window.speechSynthesis?.cancel(); } catch (_) {}
    document.removeEventListener('keydown', keyboard);
    host?.remove();
    host = null;
    if (returnFocus?.isConnected) requestAnimationFrame(() => returnFocus.focus());
  }

  function styles() {
    if (document.getElementById('cross-category-strategy-styles')) return;
    const style = document.createElement('style');
    style.id = 'cross-category-strategy-styles';
    style.textContent = `.cross-host{position:fixed;inset:0;z-index:1190;display:grid;place-items:center;padding:16px;background:rgba(8,19,42,.78);color:#eff8ff}.cross-shell{width:min(860px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,30px);border:3px solid #8ea7ff;border-radius:24px;background:#142849;box-shadow:0 26px 72px rgba(0,0,0,.5)}.cross-head{display:flex;justify-content:space-between;gap:16px}.cross-head span{color:#a9c7ff;font-size:12px;font-weight:950;letter-spacing:.08em}.cross-head h2{margin:5px 0;font-size:clamp(28px,4vw,39px);line-height:1.16}.cross-head p{margin:0;color:#d4e3fb;line-height:1.55}.cross-head>button{flex:0 0 auto;width:52px;height:52px;border:2px solid #b7c9ee;border-radius:50%;background:#1d3b64;color:#fff;font-size:29px}.cross-progress{display:grid;gap:8px;margin-top:18px;color:#d9e8fb;font-weight:850}.cross-progress:before{content:'';grid-row:1;height:11px;border-radius:99px;background:#29486f}.cross-progress i{grid-row:1;display:block;height:11px;border-radius:99px;background:linear-gradient(90deg,#73d9c4,#8fa9ff);transition:width .25s}.cross-progress span{font-size:14px}.cross-work{margin-top:20px}.cross-ready,.cross-scene{display:grid;grid-template-columns:auto 1fr;gap:16px;padding:20px;border:2px solid #5d83b8;border-radius:18px;background:#1a365b}.cross-ready>span{display:grid;place-items:center;width:82px;height:82px;border-radius:18px;background:#34517f;font-size:45px}.cross-ready strong{font-size:20px}.cross-ready p,.cross-ready li{color:#d9e8fb;line-height:1.6}.cross-ready ol{margin:12px 0 0;padding-left:22px}.cross-scene>span{display:grid;place-items:center;width:68px;height:68px;border-radius:16px;background:#263f68;font-size:35px}.cross-scene small{color:#afd0ff;font-weight:900}.cross-scene h3{margin:4px 0;font-size:23px}.cross-scene p{margin:0;color:#d9e8fb;line-height:1.55}.cross-question{margin:22px 0 14px;font-size:clamp(20px,2.5vw,27px);line-height:1.42}.cross-choices{display:grid;gap:12px}.cross-choices button{min-height:72px;padding:15px 18px;color:#fff;border:3px solid #607fae;border-radius:16px;background:#1a3559;text-align:left;font-size:17px;font-weight:850;line-height:1.45}.cross-choices button:hover{border-color:#9fc4ff;background:#234775}.cross-choices b{color:#a9e9da}.cross-tools{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px;padding-top:15px;border-top:1px solid #4e6f99}.cross-tools button,.cross-main,.cross-plain{min-height:48px;padding:0 15px;border:2px solid #83a7d7;border-radius:12px;background:#1c3c61;color:#fff;font-weight:900}.cross-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:20px}.cross-main{border:0;background:#75ddbd;color:#0a3028}.cross-plain{background:#1a365b}.cross-status{min-height:31px;margin-top:16px;color:#d7e7fb;text-align:center;font-weight:850;line-height:1.5}.cross-status.ok{color:#a9f5db}.cross-status.try{color:#ffe49a}.cross-status.hint{color:#bcd4ff}.cross-status.pause{color:#c9e7ff}.cross-finish{text-align:center;padding:22px;border:2px solid #5d83b8;border-radius:20px;background:#18395a}.cross-finish>span{display:grid;place-items:center;width:76px;height:76px;margin:auto;border-radius:50%;background:#79dec0;color:#093126;font-size:40px;font-weight:950}.cross-finish h3{font-size:28px}.cross-finish p{max-width:620px;margin:0 auto;color:#d9e8fb;line-height:1.65}.cross-host button:focus-visible{outline:5px solid #ffed72;outline-offset:4px}@media(max-width:640px){.cross-shell{padding:18px}.cross-ready,.cross-scene{grid-template-columns:1fr}.cross-ready>span{width:64px;height:64px;font-size:36px}.cross-actions{flex-direction:column}.cross-main,.cross-plain{width:100%}.cross-choices button{min-height:76px;font-size:16px}}@media(prefers-reduced-motion:reduce){.cross-host *{animation:none!important;transition:none!important}}`;
    document.head.appendChild(style);
  }

  function open(track, options = {}) {
    close();
    if (!TRACKS[track]) return;
    config = { track, stage: options.stage || 'lower' };
    state = { index: 0, speech: true, reduced: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false };
    returnFocus = options.trigger || document.activeElement;
    styles();
    host = document.createElement('div');
    host.className = 'cross-host';
    document.body.appendChild(host);
    document.addEventListener('keydown', keyboard);
    ready();
  }

  window.CROSS_CATEGORY_STRATEGY_LAB = { open, cards(track) { return TRACKS[track]?.cards || []; } };
})();
