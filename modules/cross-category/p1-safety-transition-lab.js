/* P1 cross-category packs: private-data-free, non-diagnostic, low-pressure practice. */
(() => {
  'use strict';

  const STAGES = {
    lower: { label: '初小 · P1–P3', cue: { digital: '在班房或家中和熟悉成人一起使用平板時', change: '遇到新安排時', advocate: '需要大人幫忙時', repair: '和同學相處時' }, support: '可以指一指、請成人讀題、暫停或稍後再看。' },
    upper: { label: '高小 · P4–P6', cue: { digital: '在校園平板、班群組或遊戲網站看到訊息時', change: '面對新課室、旅行日或不同時間表時', advocate: '在課堂、小組或校園服務中需要支援時', repair: '在小組、群組或遊戲後出現誤會時' }, support: '可以先看提示，再和教師或照顧者討論可行下一步。' },
    junior: { label: '初中 · S1–S3', cue: { digital: '在同儕群組、學校帳戶或網上購物頁面遇到要求時', change: '面對轉班、代課、社區活動或新交通安排時', advocate: '在課堂、評估或校園活動中需要支援時', repair: '在同儕互動、群組訊息或合作任務後需要修復時' }, support: '不用證明自己；可先保留證據、停止回應，再找可信任成人商量。' },
    senior: { label: '高中 · S4–S6', cue: { digital: '在實習、求職、社區服務或個人裝置遇到網上要求時', change: '面對實習首日、行程調整或新服務地點時', advocate: '在實習、職場準備或公共服務中需要調適時', repair: '在同儕、實習或社區合作中出現摩擦時' }, support: '可先確認資料和界線，再與教師、照顧者或服務負責人討論。' }
  };

  const TOPICS = {
    digital: {
      icon: '🛡️', tone: 'blue', title: '數碼安全與個人資料小盾牌', short: '陌生連結、私隱、影像與可信任成人', category: '認知學習／生活安全',
      intro: '這是虛構數碼情境練習。不會要求你輸入帳戶、密碼、電話、位置或真實社交媒體資料。',
      cards: [
        ['陌生連結', '看到「立即領取免費禮物」連結。', '先停一停，請成人一起看', ['立刻按連結並填資料', '把連結轉發給所有人'], '不熟悉的連結可以先不按。'],
        ['帳戶密碼', '有人說「把密碼給我，我幫你升級」。', '不要分享密碼，改找可信任成人', ['把密碼告訴對方', '把密碼貼在公開留言'], '密碼是保護帳戶的私密資料。'],
        ['影像轉發', '群組收到一張別人的尷尬照片。', '不轉發，先停一停並找成人商量', ['立即轉發給更多人', '留言取笑照片中的人'], '影像轉發前要想想別人的私隱和感受。'],
        ['位置資料', '一個新認識的帳戶問你現在在哪裡。', '不分享位置，先告訴可信任成人', ['直接傳送即時位置', '約對方到沒有人的地方見面'], '位置資料不需要交給陌生人。'],
        ['群組誤會', '看到一句短訊不清楚是不是在說自己。', '先不要急著回覆，向可信任成人或當事人禮貌確認', ['立刻用難聽說話回覆', '把所有人封鎖後不求助'], '短訊可能缺少語氣和背景；先確認比較安全。'],
        ['購物釣魚', '網站說「只限今天，先付費才可領取獎品」。', '先停一停，不付款，請成人核對網站', ['立即輸入付款資料', '把家人的銀行資料填上'], '過分催促付款是需要多看一看的訊號。'],
        ['假帳號', '一個用朋友名字的帳戶要求你私下聊天。', '先用其他方法確認，再請成人一起處理', ['立刻相信並傳私人資料', '假裝是別人去測試對方'], '帳戶名稱和頭像未必代表真實身分。'],
        ['求助與保留', '網上內容令你不舒服或覺得不安全。', '停止互動，保留必要資料並告訴可信任成人', ['自己一個人繼續看', '刪除一切但不告訴任何人'], '感到不安全時，找成人支持是保護自己的做法。']
      ]
    },
    change: {
      icon: '🧭', tone: 'yellow', title: '轉校、轉班與改變計劃工具箱', short: '新時間表、新地方、新人與改變計劃', category: '生活技能／轉銜支持',
      intro: '這是虛構轉變情境練習。感到不安、想多問一次、需要休息或想先看看環境都可以；沒有「適應得快」的評分。',
      cards: [
        ['看新時間表', '明天的時間表和今天不同。', '先看清新時間表，圈出第一個要做的步驟', ['假裝沒有改變', '把時間表丟掉'], '把第一步看清楚，改變會較容易開始。'],
        ['問一個問題', '你不知道新課室在哪裡。', '用短句問：請問新課室在哪裡？', ['自己一直猜路', '因為不知道而完全不出門'], '問一個清楚問題是準備新安排的方法。'],
        ['安心物與提示卡', '明天有不同的活動地點。', '帶一張提示卡或合適的安心物，並先確認規則', ['帶很多不相關物品但不問規則', '拒絕查看任何提示'], '提示卡可以幫助記得下一步。'],
        ['代課老師', '原來的老師今天不在。', '先聽新指示；不清楚時請對方重覆或寫下來', ['假裝聽懂但一直不做', '立刻離開課室'], '新老師不代表要自己一個人猜所有規則。'],
        ['特別日', '旅行日或活動日打亂平日流程。', '先核對集合時間、地點和需要帶的物品', ['只照平日習慣不查看資料', '因為改變而不帶任何用品'], '特別日可以用短清單準備。'],
        ['新交通', '今天要用不同方法去活動地點。', '先和成人確認路線、下車點和求助方法', ['自己隨便跟陌生人走', '不看任何交通資訊'], '新路線可先由可信任成人一起預演。'],
        ['報到第一天', '你第一次到新班級、轉校或實習地點。', '先找報到人、看環境提示，再問下一步', ['直接離開而不說原因', '假裝知道所有地方'], '第一天只要完成一個清楚小步已經很好。'],
        ['臨時改變', '原定安排突然取消或延後。', '停一停，找替代安排，必要時告訴可信任成人', ['把自己或別人責罵一遍', '堅持原計劃一定要發生'], '改變不等於失敗；可以找另一個可行下一步。']
      ]
    },
    advocate: {
      icon: '💬', tone: 'teal', title: '自我倡導：我需要甚麼幫助？', short: '用清楚句框提出可討論的支持需要', category: '情緒社交／自我倡導',
      intro: '這是練習清楚表達需要的虛構情境。不同學校或服務可以提供的調適不同；可與教師、照顧者或相關負責人一起討論。',
      cards: [
        ['請慢些說', '你聽指示時覺得太快。', '我想慢慢聽；可以說慢一點嗎？', ['我完全不需要知道內容', '你一定要照我的方法做'], '清楚說速度需要，對方才有機會調整。'],
        ['請寫下來', '你想記住一個較長的安排。', '可以把重點寫下來或給我提示卡嗎？', ['我會假裝全部記得', '你不可以再說任何話'], '文字、圖卡或短清單都是可討論的支架。'],
        ['短暫休息', '環境很嘈或身體需要休息。', '我想先在合適位置休息幾分鐘，之後再回來。', ['我必須忍到很不舒服', '我會突然離開而不告訴任何人'], '可以說明休息需要和回來的方法。'],
        ['調整座位', '你看不清、聽不清或容易被干擾。', '我可以坐到較合適的位置嗎？我想更容易跟上。', ['我不應該說任何需要', '其他人一定要全部換位'], '提出位置需要是一起找可行安排的開始。'],
        ['請重覆', '你沒有聽清剛才的重點。', '我想確認一次；可以重覆最後一步嗎？', ['我隨便猜一個答案', '我會責怪自己聽不懂'], '請人重覆是核對資訊，不是做錯事。'],
        ['先看例子', '你不知道一個新任務怎樣開始。', '我可以先看一個例子，然後自己試第一步嗎？', ['請別人替我做完全部', '我不看例子就放棄'], '例子可以幫助把大任務拆成第一步。'],
        ['成人協助', '你覺得一件事不安全、太複雜或很不舒服。', '我需要一位可信任成人和我一起處理。', ['我一定要獨自承擔', '我會向不認識的人求助'], '找可信任成人是可用的支持策略。'],
        ['確認下一步', '討論完後你怕自己忘記安排。', '我想確認：我現在先做甚麼，之後找誰？', ['我什麼也不問就離開', '我要求對方保證永遠不會改變'], '重述下一步可幫助大家知道安排是否清楚。']
      ]
    },
    repair: {
      icon: '🤝', tone: 'pink', title: '關係修復與旁觀者求助', short: '誤會後修復、拒絕起鬨與安全支持', category: '情緒社交／安全支持',
      intro: '這是虛構人際情境練習，不會要求分享私人經歷。若遇到欺凌、威脅、暴力、私密影像或覺得不安全的事情，請停止互動並告訴可信任成人，按學校程序處理。',
      cards: [
        ['先停一停', '你聽到一句話後很想立刻反擊。', '先停一停，慢慢呼吸，再決定是否需要成人支持', ['立刻用更難聽的話回應', '推開旁邊的人'], '停一停可以讓下一步較安全。'],
        ['描述事件', '小組活動後有人說你沒有幫忙。', '我聽到你說我沒有幫忙；我想知道哪一部分需要補回。', ['你永遠都在針對我', '我完全不會再說話'], '先描述聽到的事，可減少把猜測當成事實。'],
        ['承認影響', '你忘記帶一份大家需要的資料。', '對不起，我漏了這一項，令大家要多等一會。', ['都是別人的錯', '我不需要理會影響'], '承認影響不等於把自己貼上壞標籤。'],
        ['提出修復', '你想為剛才的錯誤做一小步。', '我現在可以補回這部分，或和你一起想一個安排。', ['我什麼也不做等別人忘記', '我要求大家立刻原諒我'], '修復可以是一個具體而可做到的小步。'],
        ['拒絕轉發', '有人叫你轉發取笑同學的內容。', '我不會轉發；這可能令對方受傷或不安全。', ['我轉發但說只是玩笑', '我加上更多取笑留言'], '不參與起鬨是保護自己和別人的選擇。'],
        ['找成人', '你看到同學被排擠、被威脅或很不舒服。', '找可信任成人，說明看見了甚麼和在哪裡發生。', ['自己冒險處理所有事情', '假裝完全沒看到'], '涉及安全時，成人支援比自己硬撐更重要。'],
        ['支持同學', '一位同學看起來想加入但站在旁邊。', '你可以一起坐嗎？如果需要，我們可以找老師幫忙。', ['叫其他人不要理他', '替對方決定所有事情'], '支持可以是尊重地邀請，也可以是一起找成人。'],
        ['界線後跟進', '你已經說過某種玩笑令你不舒服，但情況又出現。', '我之前說過這令我不舒服；我現在要找成人一起處理。', ['我必須一直忍受', '我用威脅令對方害怕'], '重覆出現或不安全的事情需要成人按程序跟進。']
      ]
    }
  };

  TOPICS.digital.answerPositionPatterns = { lower: [2, 0, 1, 2, 1, 0, 2, 0] };
  TOPICS.change.answerPositionPatterns = { lower: [1, 2, 0, 1, 0, 2, 1, 0] };
  TOPICS.advocate.answerPositionPatterns = { lower: [0, 2, 1, 0, 1, 2, 0, 2] };
  TOPICS.repair.answerPositionPatterns = { lower: [2, 1, 0, 2, 0, 1, 2, 0] };

  let host = null; let currentTopic = null; let currentStage = 'lower'; let index = 0; let speechOn = false; let trigger = null; let returnFocus = null;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const topicKeys = () => Object.keys(TOPICS);
  const topic = () => TOPICS[currentTopic];
  const roundsFor = (key, stage = 'lower') => TOPICS[key].cards.map(([title, scene, answer, distractors, hint], position) => {
    const choices = [...distractors]; const pattern = TOPICS[key]?.answerPositionPatterns?.[stage]; const target = Number.isInteger(pattern?.[position % pattern.length]) ? pattern[position % pattern.length] : position % 3; choices.splice(target, 0, answer);
    return { id: `p1-${key}-${stage}-${position + 1}`, title, scene: `${STAGES[stage].cue[key]}，${scene}`, prompt: `哪一個下一步較安全、尊重自己和別人？`, choices, answer, hint: `${hint} ${STAGES[stage].support}`, category: TOPICS[key].category };
  });
  const speak = (text) => { if (!speechOn || !window.speechSynthesis || !text) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(String(text)); utterance.lang = 'zh-HK'; utterance.rate = .78; window.speechSynthesis.speak(utterance); };
  const status = (text, type = '') => { const node = $('#p1Status', host); if (node) { node.textContent = text; node.className = `p1-status ${type}`; } };
  const close = () => { window.speechSynthesis?.cancel(); document.removeEventListener('keydown', onKey, true); host?.remove(); host = null; if (returnFocus?.isConnected) requestAnimationFrame(() => returnFocus.focus()); };

  function ensureStyles() {
    if (document.getElementById('p1SafetyTransitionStyles')) return;
    const style = document.createElement('style'); style.id = 'p1SafetyTransitionStyles';
    style.textContent = `.p1-host{position:fixed;inset:0;z-index:1210;display:grid;place-items:center;padding:16px;overflow:auto;background:rgba(14,30,52,.78);color:#17233a}.p1-dialog{width:min(940px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,32px);border:3px solid #81a5d8;border-radius:24px;background:#fffdfa;box-shadow:0 26px 75px rgba(0,0,0,.42)}.p1-head{display:flex;justify-content:space-between;gap:16px}.p1-head span{color:#3c5f91;font-size:12px;font-weight:950;letter-spacing:.08em}.p1-head h2{margin:4px 0;font-size:clamp(25px,4vw,37px);line-height:1.18}.p1-head p{margin:0;color:#425576;line-height:1.55}.p1-close{flex:0 0 auto;width:48px;height:48px;border:2px solid #8aa4ca;border-radius:50%;background:#eef5ff;color:#18365f;font-size:28px}.p1-ready,.p1-scene{margin-top:18px;padding:18px;border:2px solid #b7cce7;border-radius:18px;background:#f3f8ff;line-height:1.62}.p1-ready strong{font-size:19px}.p1-ready ul{margin:8px 0 0;padding-left:21px}.p1-progress{display:grid;gap:7px;margin-top:18px;font-weight:900;color:#385477}.p1-progress i{display:block;height:11px;overflow:hidden;border-radius:99px;background:#dce8f7}.p1-progress b{display:block;height:100%;border-radius:99px;background:#62b6a2;transition:width .2s ease}.p1-scene small{font-weight:950;color:#376196}.p1-scene h3{margin:3px 0;font-size:23px}.p1-scene p{margin:0;color:#354a6b}.p1-question{margin:16px 0 0;font-size:clamp(20px,2.6vw,27px);font-weight:950;line-height:1.42}.p1-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}.p1-choice{display:grid;align-content:start;gap:10px;min-height:146px;padding:16px;border:3px solid #9bb8d9;border-radius:17px;background:#fff;color:#193758;text-align:left;font:inherit;font-weight:850;line-height:1.5}.p1-choice:hover{border-color:#4e8cc5;background:#f0f8ff}.p1-choice b{display:grid;place-items:center;width:31px;height:31px;border-radius:50%;background:#dbeafb;color:#174878}.p1-tools,.p1-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}.p1-actions{justify-content:center}.p1-tools button,.p1-actions button{min-height:47px;padding:0 15px;border:2px solid #91afd2;border-radius:12px;background:#eef6ff;color:#183960;font:inherit;font-weight:900}.p1-actions .main{border-color:#59a58e;background:#69c8aa;color:#113d33}.p1-status{min-height:32px;margin-top:15px;color:#385477;text-align:center;font-weight:850;line-height:1.5}.p1-status.ok{color:#18745e}.p1-status.try{color:#9a5c0b}.p1-status.pause{color:#385477}.p1-finish{text-align:center;margin-top:20px;padding:24px;border:2px solid #a9c8b9;border-radius:20px;background:#f2fbf5;line-height:1.65}.p1-finish>span{display:grid;place-items:center;width:68px;height:68px;margin:auto;border-radius:50%;background:#74c8aa;color:#0d4636;font-size:35px;font-weight:950}.p1-host button:focus-visible{outline:5px solid #f4c84e;outline-offset:4px}@media(max-width:640px){.p1-dialog{padding:18px}.p1-choices{grid-template-columns:1fr}.p1-choice{min-height:74px}.p1-tools,.p1-actions{flex-direction:column}.p1-tools button,.p1-actions button{width:100%}}@media(prefers-reduced-motion:reduce){.p1-host *{animation:none!important;transition:none!important}}`;
    document.head.appendChild(style);
  }

  const shell = (content) => { host.innerHTML = `<section class="p1-dialog" role="dialog" aria-modal="true" aria-labelledby="p1Title">${content}</section>`; $('.p1-close', host)?.addEventListener('click', close); };
  const head = () => `<header class="p1-head"><div><span>${esc(STAGES[currentStage].label)} · 跨類別 P1 題材包</span><h2 id="p1Title">${esc(topic().icon)} ${esc(topic().title)}</h2><p>${esc(topic().short)}</p></div><button class="p1-close" type="button" aria-label="關閉${esc(topic().title)}">×</button></header>`;
  const tools = () => `<div class="p1-tools"><button type="button" data-p1="read">${speechOn ? '🔊 朗讀：開' : '🔇 朗讀：關'}</button><button type="button" data-p1="hint">💡 看提示</button><button type="button" data-p1="pause">⏸ 先停一停</button></div>`;

  function bindTools(round) {
    $$('[data-p1]', host).forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.p1 === 'read') { speechOn = !speechOn; button.textContent = speechOn ? '🔊 朗讀：開' : '🔇 朗讀：關'; if (speechOn) speak(round ? `${round.title}。${round.scene}。${round.prompt}` : topic().intro); }
      if (button.dataset.p1 === 'hint') status(`提示：${round?.hint || STAGES[currentStage].support}`, '');
      if (button.dataset.p1 === 'pause') status('已停在目前情境。可以慢慢看、按關閉離開，或準備好後再繼續。', 'pause');
    }));
  }
  function ready() {
    shell(`${head()}<main class="p1-ready"><strong>開始前先知道</strong><p>${esc(topic().intro)}</p><ul><li>每一題都是虛構情境；不需要分享私人經驗。</li><li>可選朗讀、看提示、暫停、重試或隨時離開。</li><li>遇到真實不安全、威脅、欺凌或難受事情，請停止互動並告訴可信任成人。</li></ul><div class="p1-actions"><button class="main" type="button" data-p1-start="true">✓ 我準備好了</button></div></main><p id="p1Status" class="p1-status" role="status" aria-live="polite">現在是準備時間，沒有倒數或個人評分。</p>${tools()}`);
    $('[data-p1-start]', host)?.addEventListener('click', play); bindTools();
  }
  function play() {
    const rounds = roundsFor(currentTopic, currentStage); const round = rounds[index];
    shell(`${head()}<div class="p1-progress"><i><b style="width:${(index / rounds.length) * 100}%"></b></i><span>情境 ${index + 1} / ${rounds.length} · 可慢慢完成</span></div><main><article class="p1-scene"><small>虛構情境</small><h3>${esc(round.title)}</h3><p>${esc(round.scene)}</p></article><p class="p1-question">${esc(round.prompt)}</p><div class="p1-choices" aria-label="可選下一步">${round.choices.map((choice, choiceIndex) => `<button type="button" class="p1-choice" data-p1-choice="${choiceIndex}" aria-label="選項 ${choiceIndex + 1}：${esc(choice)}"><b aria-hidden="true">${choiceIndex + 1}</b><span>${esc(choice)}</span></button>`).join('')}</div></main><p id="p1Status" class="p1-status" role="status" aria-live="polite">可直接點選；鍵盤可按 1、2 或 3。這不是個人表現評分。</p>${tools()}`);
    $$('[data-p1-choice]', host).forEach((button) => button.addEventListener('click', () => answer(Number(button.dataset.p1Choice), round))); bindTools(round); requestAnimationFrame(() => $('[data-p1-choice]', host)?.focus());
  }
  function answer(choiceIndex, round) {
    const choice = round.choices[choiceIndex];
    if (choice !== round.answer) { status(`↗ 可以再比較：${round.hint}`, 'try'); return; }
    status(`✓ ${round.hint}`, 'ok'); window.setTimeout(() => { index += 1; index < roundsFor(currentTopic, currentStage).length ? play() : finish(); }, window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 80 : 420);
  }
  function finish() {
    shell(`${head()}<main class="p1-finish"><span>✓</span><h3>已查看八個虛構情境</h3><p>你可以帶走一個小步：先停一停、確認資料、清楚說出需要、找可信任成人，或提出一個尊重的修復方法。這不是能力、價值、情緒或診斷評分。</p><div class="p1-actions"><button type="button" data-p1-replay="true">↺ 再看一次</button><button class="main" type="button" data-p1-close="true">← 返回活動庫</button></div></main><p id="p1Status" class="p1-status ok" role="status" aria-live="polite">可以先休息，或選另一個題材包。</p>${tools()}`);
    $('[data-p1-replay]', host)?.addEventListener('click', () => { index = 0; ready(); }); $('[data-p1-close]', host)?.addEventListener('click', close); bindTools(); requestAnimationFrame(() => $('[data-p1-close]', host)?.focus());
  }
  function onKey(event) { if (!host) return; if (event.key === 'Escape') { event.preventDefault(); close(); return; } if (/^[1-3]$/.test(event.key) && $('[data-p1-choice]', host)) { event.preventDefault(); $$('[data-p1-choice]', host)[Number(event.key) - 1]?.click(); } }
  function openTopic(key, options = {}) { if (!TOPICS[key]) return; close(); currentTopic = key; currentStage = STAGES[options.stage] ? options.stage : 'lower'; index = 0; speechOn = false; trigger = options.trigger || null; returnFocus = trigger || document.activeElement; ensureStyles(); host = document.createElement('div'); host.className = 'p1-host'; document.body.appendChild(host); document.addEventListener('keydown', onKey, true); ready(); }
  function activityCards(stage = 'lower') { return topicKeys().map((key) => { const data = TOPICS[key]; const answerPositionPattern = data.answerPositionPatterns?.[stage]; return { id: `p1-${key}-${stage}`, icon: data.icon, title: data.title, description: data.short, tag: `${STAGES[stage]?.label || STAGES.lower.label} · 8 個虛構情境`, tone: data.tone, supports: ['all'], p1Topic: key, answerPositionStrategy: answerPositionPattern ? 'irregular-balanced' : undefined, answerPositionPattern, rounds: roundsFor(key, stage) }; }); }

  window.P1_SAFETY_TRANSITION_LAB = { activityCards, openTopic, roundsFor, topics: () => topicKeys() };
})();
