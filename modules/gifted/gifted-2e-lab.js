/* 資優／2e 課堂實驗室：獨立、非診斷性、面對面帶領用途。 */
(() => {
  const activities = {
    lower: [{
      key: 'flex-puzzle',
      icon: '🧩',
      title: '完美怪獸的彈性拼圖',
      description: '以規律拼圖配合學生自選的「意外卡」；練習看提示、換方法、先停一停或請教師一起看。',
      tag: '初小 P1–P3 · 3 回合'
    }],
    upper: [{
      key: 'space-clues',
      icon: '🔭',
      title: '星際解碼：社交線索',
      description: '先解符號規律，再按 NPC 的情境線索選擇中性確認對話。',
      tag: '高小 P4–P6 · 3 回合'
    }],
    junior: [{
      key: 'team-command',
      icon: '🗂️',
      title: 'AI 戰隊：協作指揮室',
      description: '把互補角色放到共享任務區，看看怎樣令資料、方案與核對工作同時有人照顧。',
      tag: '初中 S1–S3 · 3 回合'
    }],
    senior: [{
      key: 'values-sandbox',
      icon: '🪐',
      title: '平行人生：價值沙盒',
      description: '在虛構未來情境中選擇、略過或拒絕價值卡；不排名人生，也不需要分享私人經歷。',
      tag: '高中 S4–S6 · 自選反思'
    }]
  };

  const puzzleRounds = [
    { prompt: '規律拼圖：◼️、◻️、◼️、◻️、？', answer: '◼️', choices: ['◼️', '🔺', '●'], clue: '先由左至右數一數：深色、淺色交替出現。', change: '一張「意外卡」把下一格的邊框換成了深藍色。圖形規律沒有變；你可選一張支持卡再繼續。' },
    { prompt: '規律拼圖：🔺、🔺、●、🔺、🔺、●、？', answer: '🔺', choices: ['●', '🔺', '■'], clue: '每一組有兩個三角形，然後是一個圓形。', change: '一張「意外卡」把拼圖放到另一個位置。次序仍寫在題目中；你可選一張支持卡再繼續。' },
    { prompt: '規律拼圖：2、4、6、8、？', answer: '10', choices: ['9', '10', '12'], clue: '每次加 2；可以用手指或在紙上慢慢數。', change: '一張「意外卡」要求你用另一種方法核對答案。你可選一張支持卡，再決定怎樣繼續。' }
  ];

  const socialRounds = [
    { code: '◆　○　◆　○　？', answer: '◆', choices: ['◆', '○', '□'], clue: '先看兩個符號如何輪流出現。', npc: '阿嵐拿著答案卡，說：「我想先想一想怎樣講。」', best: '我想先確認：你想用紙條說，還是等教師一起看？' },
    { code: '▲　▲　●　▲　▲　●　？', answer: '▲', choices: ['●', '▲', '■'], clue: '每組有兩個三角形，之後才是一個圓形。', npc: '小澄望向旁邊，說：「剛才大家說得很快，我有點跟不上。」', best: '我想先確認：你想再聽一次，還是一起看步驟？' },
    { code: '星　月　月　星　月　月　？', answer: '星', choices: ['月', '星', '雲'], clue: '把三個符號當成一組：星、月、月。', npc: '俊熙說：「我知道線索在哪裡，但我不想大聲說。」', best: '我可以先聽你用自己舒服的方式說；需要時可請教師一起看。' }
  ];

  const teamRounds = [
    { mission: '校園科學展', brief: '共有 6 張資料卡、3 個可展示點子及 1 份核對表。請為共享工作區安排角色。', resources: ['資料卡 × 6', '點子紙 × 3', '核對表 × 1'] },
    { mission: '社區導覽設計', brief: '共有 4 個地點資料、2 條路線草圖及 1 份安全提醒。請為共享工作區安排角色。', resources: ['地點資料 × 4', '路線草圖 × 2', '安全提醒 × 1'] },
    { mission: '短片提案', brief: '共有 5 個訪問重點、3 個畫面點子及 1 份交付清單。請為共享工作區安排角色。', resources: ['訪問重點 × 5', '畫面點子 × 3', '交付清單 × 1'] }
  ];

  const teamRoles = [
    { id: 'research', name: '資料偵察員', detail: '整理資料、找出問題與可用線索。' },
    { id: 'designer', name: '方案設計員', detail: '把點子整理成可實行的草圖或步驟。' },
    { id: 'checker', name: '品質核對員', detail: '核對條件、清楚度與最後交付。' }
  ];

  const teamZones = [
    { id: 'clues', name: '線索整理區', detail: '讓資料先變得可用。' },
    { id: 'plan', name: '方案草圖區', detail: '把想法變成下一步。' },
    { id: 'check', name: '最後核對區', detail: '確認所有工作可交代。' }
  ];

  const valuePaths = [
    { id: 'city', title: '城市問題研究員', prompt: '在虛構的海港城市，你與不同專長的人一起改善公共空間。這條路可能讓你常常解難，也需要聽取不同人的需要。' },
    { id: 'studio', title: '獨立創作工作室', prompt: '在虛構的山城，你經營一個小型創作工作室。這條路可能帶來自主空間，也需要安排日常資源與合作。' },
    { id: 'lab', title: '跨學科研究團隊', prompt: '在虛構的探索站，你與研究伙伴整理資料與提出問題。這條路可能有深度學習，也需要長期協作與修訂。' }
  ];

  const valueCards = ['創造', '助人', '自由', '穩定', '學習', '關係'];

  let shell;
  let trigger;
  let onComplete;
  let activeKey;
  let activeStage;
  let state;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function activityCards(stage) {
    return (activities[stage] || []).map((activity) => ({
      id: `gifted-2e-${activity.key}`,
      icon: activity.icon,
      title: activity.title,
      description: activity.description,
      tag: activity.tag,
      tone: 'purple',
      supports: ['G'],
      gifted2eActivity: activity.key
    }));
  }

  function addStyles() {
    if ($('#gifted2eLabStyles')) return;
    const style = document.createElement('style');
    style.id = 'gifted2eLabStyles';
    style.textContent = `
      .gifted2e-overlay{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:18px;background:rgba(24,18,45,.66);overflow:auto}.gifted2e-dialog{width:min(900px,100%);max-height:calc(100vh - 36px);overflow:auto;background:#fffdf8;color:#25203b;border:2px solid #d8c9ff;border-radius:24px;box-shadow:0 22px 70px rgba(14,9,37,.38);padding:clamp(18px,4vw,38px)}.gifted2e-dialog button{min-height:44px;font:inherit}.gifted2e-kicker{margin:0 0 6px;color:#6339a7;font-weight:800;font-size:.93rem;letter-spacing:.04em}.gifted2e-title{margin:0;font-size:clamp(1.55rem,4vw,2.25rem);line-height:1.18}.gifted2e-lead{max-width:65ch;font-size:1.04rem;line-height:1.65}.gifted2e-topline,.gifted2e-actions,.gifted2e-help{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.gifted2e-topline{justify-content:space-between;border-bottom:1px solid #ece5ff;padding-bottom:14px;margin-bottom:20px}.gifted2e-round{margin:0;color:#544a71;font-weight:700}.gifted2e-primary,.gifted2e-secondary,.gifted2e-quiet,.gifted2e-choice,.gifted2e-support,.gifted2e-zone{border-radius:14px;border:2px solid transparent;padding:10px 14px;transition:transform .16s cubic-bezier(.23,1,.32,1),opacity .16s cubic-bezier(.23,1,.32,1),box-shadow .16s cubic-bezier(.23,1,.32,1)}.gifted2e-primary{background:#6339a7;color:#fff;border-color:#6339a7;font-weight:800}.gifted2e-secondary{background:#fff;color:#4f2b8b;border-color:#8c68c9;font-weight:750}.gifted2e-quiet{background:#f4f0ff;color:#4c3c71;border-color:#ded4f9}.gifted2e-primary:active,.gifted2e-secondary:active,.gifted2e-quiet:active,.gifted2e-choice:active,.gifted2e-support:active,.gifted2e-zone:active{transform:scale(.97)}.gifted2e-dialog button:focus-visible{outline:3px solid #1a73b8;outline-offset:3px}.gifted2e-prepare{display:grid;gap:16px}.gifted2e-rules{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:4px 0}.gifted2e-rule{background:#f5f1ff;border:1px solid #dacdf8;border-radius:16px;padding:14px;line-height:1.5}.gifted2e-rule strong{display:block;color:#5b329b;margin-bottom:4px}.gifted2e-play{display:grid;gap:18px}.gifted2e-progress{height:12px;border-radius:999px;background:#e9e2f7;overflow:hidden}.gifted2e-progress>span{display:block;height:100%;background:#6e42b0;transition:width .2s cubic-bezier(.23,1,.32,1)}.gifted2e-board{background:linear-gradient(140deg,#f8f5ff,#fff8ed);border:1px solid #dfd3f4;border-radius:20px;padding:clamp(16px,3vw,28px);text-align:center}.gifted2e-board h3{margin:0 0 8px;font-size:1.28rem}.gifted2e-prompt{font-size:clamp(1.25rem,4.2vw,2rem);letter-spacing:.06em;font-weight:800;line-height:1.55;word-spacing:.2em}.gifted2e-choice-grid,.gifted2e-support-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.gifted2e-choice{background:#fff;color:#33224c;border-color:#bfa9e7;font-size:1.25rem;font-weight:800}.gifted2e-choice:hover,.gifted2e-support:hover{box-shadow:0 8px 16px rgba(80,42,135,.14)}.gifted2e-support{background:#f1f7ff;color:#203e68;border-color:#9bc7f2;text-align:left;font-weight:750}.gifted2e-support small{display:block;margin-top:4px;font-weight:500;line-height:1.4}.gifted2e-status{min-height:1.6em;margin:0;border-radius:12px;padding:10px 12px;background:#eef7f1;color:#1e5d3a;font-weight:700;line-height:1.5}.gifted2e-status[data-state="try"]{background:#fff6df;color:#734d06}.gifted2e-status:empty{display:none}.gifted2e-clue{padding:12px 14px;border-left:4px solid #4f83b6;background:#f1f7ff;border-radius:8px;line-height:1.55}.gifted2e-npc{background:#eef8f5;border:1px solid #b9dfd4;border-radius:18px;padding:16px;line-height:1.6}.gifted2e-npc strong{color:#176155}.gifted2e-dialogue-grid{display:grid;gap:10px}.gifted2e-dialogue{background:#fff;border:2px solid #9bc9c2;color:#1d4d48;border-radius:14px;padding:12px 14px;text-align:left;font:inherit;line-height:1.45}.gifted2e-finish{display:grid;gap:16px;text-align:center;padding:10px 0}.gifted2e-finish strong{font-size:1.3rem;color:#563290}.gifted2e-finish-card{background:#f3effd;border-radius:18px;padding:16px;line-height:1.6}@media(max-width:560px){.gifted2e-overlay{padding:0;align-items:start}.gifted2e-dialog{min-height:100vh;max-height:none;border-radius:0;padding:18px}.gifted2e-rules,.gifted2e-choice-grid,.gifted2e-support-grid{grid-template-columns:1fr}.gifted2e-actions>*{flex:1}.gifted2e-topline{align-items:flex-start}}@media(prefers-reduced-motion:reduce){.gifted2e-dialog *{transition:none!important;animation:none!important}}
    `;
    document.head.append(style);
    const extraStyle = document.createElement('style');
    extraStyle.textContent = `.gifted2e-team-layout{display:grid;grid-template-columns:1fr 1fr;gap:14px}.gifted2e-role-list,.gifted2e-zone-list{display:grid;gap:10px}.gifted2e-role,.gifted2e-zone,.gifted2e-path,.gifted2e-value{background:#fff;border:2px solid #bea9df;color:#34224b;border-radius:14px;padding:12px 14px;text-align:left;font:inherit}.gifted2e-role small,.gifted2e-zone small,.gifted2e-path small{display:block;margin-top:4px;line-height:1.4}.gifted2e-role.is-selected,.gifted2e-path.is-selected,.gifted2e-value.is-selected{background:#eee5ff;border-color:#6233aa;box-shadow:0 5px 12px rgba(71,35,132,.15)}.gifted2e-resource-list{font-weight:700;color:#4a3177;line-height:1.6}.gifted2e-path-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.gifted2e-value-area{display:grid;gap:13px}.gifted2e-value-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.gifted2e-value{text-align:center;font-weight:800}@media(max-width:560px){.gifted2e-team-layout,.gifted2e-path-grid,.gifted2e-value-grid{grid-template-columns:1fr}}`;
    document.head.append(extraStyle);
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ' '));
    utterance.lang = 'zh-HK';
    utterance.rate = .76;
    window.speechSynthesis.speak(utterance);
  }

  function roundList() {
    if (activeKey === 'flex-puzzle') return puzzleRounds;
    if (activeKey === 'space-clues') return socialRounds;
    if (activeKey === 'team-command') return teamRounds;
    return valuePaths;
  }
  function label() { return activityCards(activeStage).find((item) => item.gifted2eActivity === activeKey)?.title || '2e 課堂練習'; }
  function dialogHTML(content) {
    return `<section class="gifted2e-dialog" role="dialog" aria-modal="true" aria-labelledby="gifted2eTitle" tabindex="-1">${content}</section>`;
  }
  function commonTop() {
    const stageLabel = { lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' }[activeStage] || '課堂';
    return `<div class="gifted2e-topline"><p class="gifted2e-round">${stageLabel} · 課堂練習</p><button class="gifted2e-quiet" type="button" data-action="close">離開練習</button></div>`;
  }
  function status(text = '', type = '') {
    const el = $('[data-role="status"]', shell);
    if (!el) return;
    el.textContent = text;
    el.dataset.state = type;
  }
  function progress() {
    const done = Math.min(state.round, roundList().length);
    return Math.round((done / roundList().length) * 100);
  }
  function renderReady() {
    const startText = activeKey === 'flex-puzzle' ? '開始彈性拼圖' : activeKey === 'space-clues' ? '開始星際解碼' : activeKey === 'team-command' ? '開始協作指揮' : '開始價值沙盒';
    shell.innerHTML = dialogHTML(`${commonTop()}<div class="gifted2e-prepare"><p class="gifted2e-kicker">資優／2e · 非診斷性教師帶領</p><h2 class="gifted2e-title" id="gifted2eTitle">${label()}</h2><p class="gifted2e-lead">這是一個三回合的高認知課堂練習。結果只作本節回顧，不代表能力、情緒、合作或價值觀。</p><div class="gifted2e-rules"><article class="gifted2e-rule"><strong>1. 先看規則</strong>教師可先帶讀題目；需要時可按朗讀或提示。</article><article class="gifted2e-rule"><strong>2. 支持可自選</strong>你可選看提示、換方法、先停一停或請教師一起看。</article><article class="gifted2e-rule"><strong>3. 隨時可離開</strong>不計時、不扣分；不想繼續可直接離開或換練習。</article></div><div class="gifted2e-actions"><button class="gifted2e-secondary" type="button" data-action="read-ready">🔊 朗讀規則</button><button class="gifted2e-primary" type="button" data-action="start">我準備好了</button></div></div>`);
    bindShell();
    $('[data-action="start"]', shell).focus();
  }
  function renderPuzzle() {
    const current = puzzleRounds[state.round];
    shell.innerHTML = dialogHTML(`${commonTop()}<main class="gifted2e-play"><p class="gifted2e-kicker">彈性解難 · 第 ${state.round + 1} / ${puzzleRounds.length} 回合</p><h2 class="gifted2e-title" id="gifted2eTitle">完美怪獸的彈性拼圖</h2><div class="gifted2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="gifted2e-board"><h3>找出下一塊</h3><p class="gifted2e-prompt">${current.prompt}</p><div class="gifted2e-choice-grid">${current.choices.map((choice) => `<button class="gifted2e-choice" type="button" data-answer="${choice}">${choice}</button>`).join('')}</div></section><div class="gifted2e-help"><button class="gifted2e-secondary" type="button" data-action="hint">💡 看提示</button><button class="gifted2e-secondary" type="button" data-action="read-round">🔊 朗讀這頁</button><button class="gifted2e-quiet" type="button" data-action="pause">先停一停</button><button class="gifted2e-quiet" type="button" data-action="teacher">請教師一起看</button></div><p class="gifted2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    $$('[data-answer]', shell).forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.answer === current.answer) {
        state.correct += 1;
        renderPuzzleChoice(current);
      } else {
        state.incorrect += 1;
        status('可以再看規律、按提示，或換一種方法慢慢核對。', 'try');
      }
    }));
    $('[data-answer]', shell).focus();
  }
  function renderPuzzleChoice(current) {
    shell.innerHTML = dialogHTML(`${commonTop()}<main class="gifted2e-play"><p class="gifted2e-kicker">彈性解難 · 第 ${state.round + 1} / ${puzzleRounds.length} 回合</p><h2 class="gifted2e-title" id="gifted2eTitle">你找到了規律</h2><div class="gifted2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="gifted2e-board"><h3>可選的意外卡</h3><p>${current.change}</p></section><div class="gifted2e-support-grid"><button class="gifted2e-support" type="button" data-support="看提示">💡 看提示<small>再看一次規律線索。</small></button><button class="gifted2e-support" type="button" data-support="換方法">🔄 換方法<small>可以數一數、畫一畫或說出規律。</small></button><button class="gifted2e-support" type="button" data-support="先停一停">⏸️ 先停一停<small>可以喝水、看一看別處或安靜坐一會。</small></button><button class="gifted2e-support" type="button" data-support="請教師一起看">🤝 請教師一起看<small>由教師示範第一步，或一起核對。</small></button></div><p class="gifted2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true">任選一張支持卡；所有選擇都可以。</p></main>`);
    bindShell();
    $$('[data-support]', shell).forEach((button) => button.addEventListener('click', () => {
      state.supports.push(button.dataset.support);
      state.round += 1;
      state.round < puzzleRounds.length ? renderPuzzle() : finish();
    }));
    $('[data-support]', shell).focus();
  }
  function renderSpace() {
    const current = socialRounds[state.round];
    shell.innerHTML = dialogHTML(`${commonTop()}<main class="gifted2e-play"><p class="gifted2e-kicker">星際推理 · 第 ${state.round + 1} / ${socialRounds.length} 回合</p><h2 class="gifted2e-title" id="gifted2eTitle">星際解碼：社交線索</h2><div class="gifted2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="gifted2e-board"><h3>先破解符號規律</h3><p class="gifted2e-prompt">${current.code}</p><div class="gifted2e-choice-grid">${current.choices.map((choice) => `<button class="gifted2e-choice" type="button" data-answer="${choice}">${choice}</button>`).join('')}</div></section><div class="gifted2e-help"><button class="gifted2e-secondary" type="button" data-action="hint">💡 看提示</button><button class="gifted2e-secondary" type="button" data-action="read-round">🔊 朗讀這頁</button><button class="gifted2e-quiet" type="button" data-action="pause">先停一停</button><button class="gifted2e-quiet" type="button" data-action="teacher">請教師一起看</button></div><p class="gifted2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    $$('[data-answer]', shell).forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.answer === current.answer) { state.correct += 1; renderDialogue(current); }
      else { state.incorrect += 1; status('可再看符號次序、按提示，或請教師一起核對。', 'try'); }
    }));
    $('[data-answer]', shell).focus();
  }
  function renderDialogue(current) {
    const alternatives = ['我已經知道答案，你快一點說。', '你明明有線索，現在就告訴我。', current.best];
    shell.innerHTML = dialogHTML(`${commonTop()}<main class="gifted2e-play"><p class="gifted2e-kicker">社交線索 · 第 ${state.round + 1} / ${socialRounds.length} 回合</p><h2 class="gifted2e-title" id="gifted2eTitle">下一條線索：先確認需要</h2><div class="gifted2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><article class="gifted2e-npc"><strong>NPC 線索</strong><br>${current.npc}</article><p>哪一句較能中性地確認對方想怎樣繼續？</p><div class="gifted2e-dialogue-grid">${alternatives.map((choice) => `<button class="gifted2e-dialogue" type="button" data-dialogue="${encodeURIComponent(choice)}">${choice}</button>`).join('')}</div><div class="gifted2e-help"><button class="gifted2e-secondary" type="button" data-action="read-round">🔊 朗讀這頁</button><button class="gifted2e-quiet" type="button" data-action="pause">先停一停</button><button class="gifted2e-quiet" type="button" data-action="teacher">請教師一起看</button></div><p class="gifted2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    $$('[data-dialogue]', shell).forEach((button) => button.addEventListener('click', () => {
      const choice = decodeURIComponent(button.dataset.dialogue);
      if (choice === current.best) { state.correct += 1; state.round += 1; state.round < socialRounds.length ? renderSpace() : finish(); }
      else { state.incorrect += 1; status('這句可能會讓對方更難選擇。可再試一個中性確認句，或請教師一起看。', 'try'); }
    }));
    $('[data-dialogue]', shell).focus();
  }
  function renderTeam() {
    const current = teamRounds[state.round];
    const placed = state.placements || {};
    shell.innerHTML = dialogHTML(`${commonTop()}<main class="gifted2e-play"><p class="gifted2e-kicker">協作策略 · 第 ${state.round + 1} / ${teamRounds.length} 回合</p><h2 class="gifted2e-title" id="gifted2eTitle">AI 戰隊：協作指揮室</h2><div class="gifted2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="gifted2e-board"><h3>${current.mission}</h3><p>${current.brief}</p><p class="gifted2e-resource-list">資源：${current.resources.join('　·　')}</p></section><p>先選一張角色卡，再按一個工作區；也可以把角色卡拖到工作區。</p><div class="gifted2e-team-layout"><div class="gifted2e-role-list" aria-label="角色卡">${teamRoles.map((role) => `<button class="gifted2e-role${state.selectedRole === role.id ? ' is-selected' : ''}" type="button" draggable="true" data-role="${role.id}"><strong>${role.name}</strong><small>${role.detail}</small></button>`).join('')}</div><div class="gifted2e-zone-list" aria-label="共享工作區">${teamZones.map((zone) => { const role = teamRoles.find((item) => item.id === placed[zone.id]); return `<button class="gifted2e-zone" type="button" data-zone="${zone.id}" data-sen-drop-zone="team"><strong>${zone.name}</strong><small>${role ? `已安排：${role.name}` : zone.detail}</small></button>`; }).join('')}</div></div><div class="gifted2e-help"><button class="gifted2e-secondary" type="button" data-action="hint">💡 看提示</button><button class="gifted2e-secondary" type="button" data-action="read-round">🔊 朗讀這頁</button><button class="gifted2e-quiet" type="button" data-action="pause">先停一停</button><button class="gifted2e-quiet" type="button" data-action="teacher">請教師一起看</button></div><p class="gifted2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true">角色互補，不需要比較誰較強。</p></main>`);
    bindShell();
    let dragging = null;
    $$('[data-role]', shell).forEach((button) => {
      button.addEventListener('click', () => { state.selectedRole = button.dataset.role; renderTeam(); status('已選角色卡。現在選擇一個工作區。'); });
      button.addEventListener('dragstart', (event) => { dragging = button.dataset.role; try { event.dataTransfer.setData('text/plain', dragging); } catch {} });
      button.addEventListener('dragend', () => { dragging = null; });
    });
    $$('[data-zone]', shell).forEach((button) => {
      button.addEventListener('dragover', (event) => event.preventDefault());
      button.addEventListener('drop', (event) => { event.preventDefault(); placeRole(dragging, button.dataset.zone); dragging = null; });
      button.addEventListener('click', () => placeRole(state.selectedRole, button.dataset.zone));
    });
    $('[data-role]', shell).focus();
  }
  function placeRole(roleId, zoneId) {
    if (!roleId) { status('先選一張角色卡，再選工作區；也可拖拉角色卡。', 'try'); return; }
    const answer = { clues: 'research', plan: 'designer', check: 'checker' };
    if (roleId !== answer[zoneId]) { state.incorrect += 1; status('這個角色的專長可能更適合另一個工作區。可看看角色說明、換一張卡或請教師一起看。', 'try'); return; }
    state.correct += 1;
    state.placements = { ...(state.placements || {}), [zoneId]: roleId };
    state.selectedRole = '';
    if (Object.keys(state.placements).length === teamZones.length) {
      state.round += 1;
      state.placements = {};
      state.round < teamRounds.length ? renderTeam() : finish();
    } else renderTeam();
  }
  function renderValues() {
    const path = state.path;
    shell.innerHTML = dialogHTML(`${commonTop()}<main class="gifted2e-play"><p class="gifted2e-kicker">多元價值 · 虛構未來情境</p><h2 class="gifted2e-title" id="gifted2eTitle">平行人生：價值沙盒</h2><section class="gifted2e-board"><h3>先選一個虛構路徑</h3><p>這些只是故事設定，不是對真實人生的預測或建議。沒有較好、較差或較幸福的結局。</p></section><div class="gifted2e-path-grid">${valuePaths.map((item) => `<button class="gifted2e-path${path === item.id ? ' is-selected' : ''}" type="button" data-path="${item.id}"><strong>${item.title}</strong><small>${item.prompt}</small></button>`).join('')}</div>${path ? renderValueChoices(path) : ''}<div class="gifted2e-help"><button class="gifted2e-secondary" type="button" data-action="read-round">🔊 朗讀這頁</button><button class="gifted2e-quiet" type="button" data-action="pause">先停一停</button><button class="gifted2e-quiet" type="button" data-action="teacher">請教師一起看</button></div><p class="gifted2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true">可選路徑、選價值、略過或拒絕；無須談及私人經歷。</p></main>`);
    bindShell();
    $$('[data-path]', shell).forEach((button) => button.addEventListener('click', () => { state.path = button.dataset.path; state.values = []; renderValues(); }));
    $$('[data-value]', shell).forEach((button) => button.addEventListener('click', () => toggleValue(button.dataset.value)));
    $('[data-path]', shell).focus();
  }
  function renderValueChoices(pathId) {
    const chosen = state.values || [];
    const path = valuePaths.find((item) => item.id === pathId);
    return `<section class="gifted2e-value-area"><article class="gifted2e-npc"><strong>故事情境</strong><br>${path.prompt}</article><p>這個故事中，哪些價值可能值得你放進「考慮清單」？可選最多兩張，也可不選。</p><div class="gifted2e-value-grid">${valueCards.map((value) => `<button class="gifted2e-value${chosen.includes(value) ? ' is-selected' : ''}" type="button" data-value="${value}" aria-pressed="${chosen.includes(value)}">${value}</button>`).join('')}</div><div class="gifted2e-actions"><button class="gifted2e-secondary" type="button" data-action="skip-values">略過價值卡</button><button class="gifted2e-primary" type="button" data-action="finish-values" ${chosen.length ? '' : 'disabled'}>整理反思句</button></div></section>`;
  }
  function toggleValue(value) {
    const current = state.values || [];
    if (current.includes(value)) state.values = current.filter((item) => item !== value);
    else if (current.length < 2) state.values = [...current, value];
    else { status('最多選兩張價值卡；也可以取消其中一張、略過，或請教師一起看。', 'try'); return; }
    renderValues();
  }
  function finish() {
    const supportSummary = state.supports.length ? `你選過：${[...new Set(state.supports)].join('、')}。` : '你已完成這組課堂練習。';
    const reflections = {
      'flex-puzzle': `${supportSummary} 教師可問：「哪一張支持卡令你最容易繼續？」`,
      'space-clues': '你先用規律找線索，再用中性確認句理解 NPC 想怎樣繼續。教師可問：「還有甚麼句子可以確認對方的需要？」',
      'team-command': '你把資料、方案與核對工作安排到互補角色。教師可問：「下次想先邀請組員選哪一個部分？」',
      'values-sandbox': state.values?.length ? `在虛構的「${valuePaths.find((item) => item.id === state.path)?.title || '平行路徑'}」中，你放進考慮清單的價值是：${state.values.join('、')}。這不代表任何人生較好；教師可問：「這些價值還可以用甚麼方式表現？」` : '你選擇略過價值卡。這同樣可以；教師可問：「想先聽哪一個故事情境，或今天就到這裡？」'
    };
    const rounds = activeKey === 'values-sandbox' ? '一個自選反思流程' : '三個短回合';
    shell.innerHTML = dialogHTML(`${commonTop()}<main class="gifted2e-finish"><p class="gifted2e-kicker">本節回顧 · 不作能力評分</p><h2 class="gifted2e-title" id="gifted2eTitle">完成這次課堂練習</h2><strong>你完成了${rounds}。</strong><article class="gifted2e-finish-card">${reflections[activeKey] || supportSummary}</article><div class="gifted2e-actions"><button class="gifted2e-secondary" type="button" data-action="restart">再做一次</button><button class="gifted2e-primary" type="button" data-action="close">回到直接選關</button></div></main>`);
    bindShell();
    const total = activeKey === 'flex-puzzle' ? 3 : activeKey === 'space-clues' ? 6 : activeKey === 'team-command' ? 9 : 0;
    onComplete?.({ label: label(), correct: state.correct, incorrect: state.incorrect, total, stage: activeStage, nonDiagnostic: true });
    $('[data-action="close"]', shell).focus();
  }
  function handleAction(action) {
    const current = roundList()[state.round] || roundList()[0];
    if (action === 'close') return close();
    if (action === 'start') return activeKey === 'flex-puzzle' ? renderPuzzle() : activeKey === 'space-clues' ? renderSpace() : activeKey === 'team-command' ? renderTeam() : renderValues();
    if (action === 'restart') { state = { round: 0, correct: 0, incorrect: 0, supports: [], placements: {}, selectedRole: '', path: '', values: [] }; return activeKey === 'flex-puzzle' ? renderPuzzle() : activeKey === 'space-clues' ? renderSpace() : activeKey === 'team-command' ? renderTeam() : renderValues(); }
    if (action === 'read-ready') return speak(`這是${label()}。共有三個短回合。不計時，不扣分。你可選看提示、換方法、先停一停、請教師一起看或隨時離開。準備好才按開始。`);
    if (action === 'hint') { const clue = activeKey === 'team-command' ? '資料偵察員先整理線索；方案設計員把點子變成下一步；品質核對員最後看條件。' : current.clue; status(`提示：${clue}`, ''); return speak(`提示：${clue}`); }
    if (action === 'read-round') return speak(activeKey === 'flex-puzzle' ? `規律拼圖。${current.prompt}` : activeKey === 'space-clues' ? `星際解碼。${current.code}` : activeKey === 'team-command' ? `協作指揮室。${current.mission}。${current.brief}` : '平行人生價值沙盒。這些都是虛構故事；你可以選路徑、選價值、略過或離開。');
    if (action === 'pause') { state.supports.push('先停一停'); status('已選擇先停一停。可以留在這裡安靜看一看，準備好再選答案；也可離開。', ''); }
    if (action === 'teacher') { state.supports.push('請教師一起看'); status('可請教師用紙筆、指向或口頭示範第一步；你仍可自行決定下一步。', ''); }
    if (action === 'skip-values') { state.values = []; finish(); }
    if (action === 'finish-values') finish();
  }
  function bindShell() {
    $$('[data-action]', shell).forEach((button) => button.addEventListener('click', () => handleAction(button.dataset.action)));
  }
  function focusables() { return $$('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', shell); }
  function trapFocus(event) {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  function close() {
    window.speechSynthesis?.cancel?.();
    shell?.remove();
    shell = null;
    trigger?.focus?.({ preventScroll: true });
  }
  function openActivity(key, options = {}) {
    const found = Object.values(activities).flat().some((activity) => activity.key === key);
    if (!found) return;
    addStyles();
    close();
    activeKey = key;
    activeStage = options.stage || (key === 'flex-puzzle' ? 'lower' : 'upper');
    trigger = options.trigger || document.activeElement;
    onComplete = options.onComplete;
    state = { round: 0, correct: 0, incorrect: 0, supports: [], placements: {}, selectedRole: '', path: '', values: [] };
    shell = document.createElement('div');
    shell.className = 'gifted2e-overlay';
    shell.addEventListener('keydown', trapFocus);
    shell.addEventListener('mousedown', (event) => { if (event.target === shell) close(); });
    document.body.append(shell);
    renderReady();
  }

  window.GIFTED_2E_LAB = { activityCards, openActivity };
})();
