/* Design: EBD「雙贏策略桌」— 使用虛構衝突情境、I-message、暫停與求助卡；不收集行為資料、不使用代幣或道德標籤。 */
(() => {
  'use strict';

  const STAGE_LABELS = { lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' };
  const ROUNDS = [
    { icon: '🖍️', title: '想拿回顏色筆', scenario: '虛構角色看到自己的顏色筆被同學拿走，心裡開始不舒服。', options: [['我訊息', '「我有點著急，因為我還要用這支筆。可以還給我嗎？」', '清楚說出感受、原因和請求，讓對方有機會回應。'], ['先暫停', '「我先把手放好，慢慢呼吸，再說我的需要。」', '先照顧身體，可以令之後的對話更安全。'], ['找支持', '「我想請老師幫我一起說清楚。」', '請成人協助是一種合理的保護方法。']] },
    { icon: '🗣️', title: '小組太嘈', scenario: '三位組員同時說話，虛構角色開始跟不上，也想大聲搶著說。', options: [['我訊息', '「我有點跟不上，我想一次聽一個人說。可以輪流嗎？」', '把需要說得短而具體，可幫小組調整節奏。'], ['先暫停', '「我先看一看重點卡，等一下再加入。」', '暫停不等於放棄參與，可以選擇較舒服的方式回來。'], ['找支持', '「可不可以請組長幫我們排一次說話次序？」', '請人協助安排流程，不等於任何人做錯。']] },
    { icon: '🔄', title: '規則突然改變', scenario: '原本的遊戲規則改了，虛構角色覺得失望又想把材料推開。', options: [['我訊息', '「我有點意外，想先知道新的第一步是甚麼。」', '先問一個清楚問題，可把大改變拆成小步。'], ['先暫停', '「我先坐一會，準備好再看新規則卡。」', '給自己短暫空間，能讓身體和想法慢下來。'], ['找支持', '「我想請老師用圖卡再示範一次。」', '要求不同提示方式是合理的支持。']] },
    { icon: '🧩', title: '分工不一樣', scenario: '虛構角色想做設計部分，但小組暫時安排他先整理資料。', options: [['我訊息', '「我很想參與設計，也可以先整理資料。之後我可不可以幫忙選配色？」', '同時說出願意合作和自己的希望，可留下多個選擇。'], ['先暫停', '「我先把現在的一張資料卡整理好，再想下一步。」', '回到最小工作步，能減少被整件事壓住的感覺。'], ['找支持', '「我想請組長幫我們看能否輪流做不同部分。」', '請人協助分工，是協作中的正常做法。']] },
    { icon: '📱', title: '訊息令人擔心', scenario: '虛構角色看到朋友只回覆「嗯」，開始猜想對方是否不高興。', options: [['我訊息', '「我不太確定你的意思，我有點擔心。你想遲些再談嗎？」', '中性確認可減少把猜測當成事實。'], ['先暫停', '「我先不立刻回覆，喝水或做一件別的事。」', '延後回覆是保護自己和關係的選擇。'], ['找支持', '「我想和可信任的大人一起想怎樣回覆。」', '遇到難處理的網上互動，可以找支持。']] },
    { icon: '⚽', title: '排隊輪候', scenario: '虛構角色很想先玩球，但現在輪到其他同學。', options: [['我訊息', '「我也想玩，可以告訴我大約幾時輪到我嗎？」', '問清楚次序可令等待更可預期。'], ['先暫停', '「我先到旁邊做三次慢呼吸，等候提示。」', '等待時照顧身體，是一種可練習的策略。'], ['找支持', '「我想請老師幫我看輪候卡。」', '使用視覺支架能幫助了解輪候安排。']] },
    { icon: '🧾', title: '合作出現誤會', scenario: '虛構角色以為同學答應帶材料，但今天材料沒有出現。', options: [['我訊息', '「我有點失望，因為我以為今天會有材料。現在我們可以先做哪一部分？」', '把影響和可做下一步放在一起，較容易繼續合作。'], ['先暫停', '「我先寫下現在有甚麼材料，再慢慢想替代做法。」', '把事情看清楚後再選擇，能減少衝動回應。'], ['找支持', '「我想請老師幫我們把今天和下次的分工寫下來。」', '外在清單可令合作安排更清楚。']] },
    { icon: '🤝', title: '想重新開始', scenario: '虛構角色剛才聲音太大，現在希望回到小組，但又感到尷尬。', options: [['我訊息', '「我剛才聲音太大，現在想慢慢重新說一次。」', '承認影響和提出下一步，可以開啟修復，但不強迫對方立刻回應。'], ['先暫停', '「我想先安靜一分鐘，再決定怎樣回來。」', '先調節再修復也是合理次序。'], ['找支持', '「我想請成人在旁邊，幫我重新開始對話。」', '當情況仍覺得困難，成人支持可以令大家更安全。']] }
  ];

  let host;
  let state;
  let returnFocus;

  const $ = (selector) => host?.querySelector(selector);
  const $$ = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const stageLabel = () => STAGE_LABELS[state?.stage] || STAGE_LABELS.lower;

  function ensureStyles() {
    if (document.getElementById('ebd-strategy-styles')) return;
    const style = document.createElement('style'); style.id = 'ebd-strategy-styles';
    style.textContent = `
      .estrat-backdrop{position:fixed;inset:0;z-index:1180;display:grid;place-items:center;padding:16px;background:rgba(68,31,51,.74);backdrop-filter:blur(5px)}.estrat-dialog{position:relative;width:min(940px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,31px);border:2px solid #f3c7d2;border-radius:28px;background:#fffdfd;color:#4d3542;box-shadow:0 25px 72px rgba(62,24,45,.42)}.estrat-close{position:absolute;top:14px;right:15px;width:48px;height:48px;border:0;border-radius:50%;background:#fff0f3;color:#9d4662;font-size:28px;font-weight:900}.estrat-kicker{margin:0;color:#ad4e69;font-size:12px;font-weight:900;letter-spacing:.08em}.estrat-title{margin:7px 52px 6px 0;color:#5d3044;font-size:clamp(26px,4vw,40px);line-height:1.16}.estrat-lead{max-width:74ch;margin:0;color:#765765;font-size:15px;font-weight:760;line-height:1.65}.estrat-progress{display:flex;align-items:center;gap:10px;margin-top:16px;color:#a44863;font-size:13px;font-weight:900}.estrat-progress i{display:block;flex:1;height:11px;overflow:hidden;border-radius:999px;background:#f7e3e9}.estrat-progress b{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#d76b83,#7ead92)}.estrat-board{margin-top:18px;padding:clamp(17px,3vw,27px);border:2px solid #f0d4dc;border-radius:23px;background:linear-gradient(145deg,#fff7f8,#fffaf0)}.estrat-board h3{margin:0;color:#6f314a;font-size:clamp(20px,3vw,29px)}.estrat-board p{margin:8px 0 0;color:#785968;font-size:16px;font-weight:740;line-height:1.62}.estrat-note{margin-top:14px;padding:13px 15px;border-left:5px solid #cf6b82;border-radius:14px;background:#fff2f5;color:#7c4055;font-size:14px;font-weight:800;line-height:1.58}.estrat-options{display:grid;gap:10px;margin-top:16px}.estrat-option{padding:14px 15px;border:2px solid #edc8d2;border-radius:17px;background:#fff;color:#613a4c;text-align:left}.estrat-option:hover,.estrat-option:focus-visible{border-color:#c85d76;background:#fff8fa}.estrat-option strong{display:block;font-size:16px}.estrat-option small{display:block;margin-top:5px;color:#886676;font-size:13px;font-weight:740;line-height:1.45}.estrat-option.selected{border-color:#70a989;background:#effaf3}.estrat-tools,.estrat-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:17px}.estrat-tools button,.estrat-actions button{min-height:45px;padding:0 14px;border:2px solid #e8cbd4;border-radius:13px;background:#fff;color:#6d4657;font-size:14px;font-weight:900}.estrat-actions .primary{border-color:#b34d69;background:#b34d69;color:#fff}.estrat-status{min-height:29px;margin:14px 0 0;color:#77616b;font-size:14px;font-weight:800;line-height:1.52}.estrat-status.ok{color:#2b7856}.estrat-summary{margin-top:20px;padding:22px;border:2px solid #c6e1d0;border-radius:22px;background:#f0fbf4;text-align:center}.estrat-summary span{font-size:42px}.estrat-summary h3{margin:8px 0;color:#286648;font-size:26px}.estrat-summary p{margin:0;color:#487162;line-height:1.62}.estrat-dialog button:focus-visible{outline:4px solid #136ca6;outline-offset:3px}.estrat-dialog button:active{transform:scale(.97)}@media(max-width:620px){.estrat-backdrop{padding:0;align-items:start}.estrat-dialog{min-height:100vh;max-height:none;border-radius:0}.estrat-actions,.estrat-tools{display:grid;grid-template-columns:1fr}.estrat-actions button,.estrat-tools button{width:100%}}@media(prefers-reduced-motion:reduce){.estrat-dialog *{transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function shell(content) {
    host.innerHTML = `<div class="estrat-backdrop"><section class="estrat-dialog" role="dialog" aria-modal="true" aria-labelledby="estratTitle"><button class="estrat-close" type="button" aria-label="關閉雙贏策略桌">×</button>${content}</section></div>`;
    $('.estrat-close')?.addEventListener('click', close);
  }

  function close() { document.removeEventListener('keydown', onKey); host?.remove(); host = null; if (returnFocus?.isConnected) returnFocus.focus(); returnFocus = null; }

  function renderReady() {
    shell(`<p class="estrat-kicker">EBD · ${stageLabel()} · 虛構情境策略練習</p><h2 class="estrat-title" id="estratTitle">雙贏策略桌</h2><p class="estrat-lead">這八個情境不會評定品格、行為好壞或人際能力。每一回可選擇 I-message、先暫停或找支持；不同情況可用不同策略。</p><aside class="estrat-note"><strong>安全界線：</strong>活動不建立代幣帳戶、行為契約或跨次打卡紀錄。若現實情況感到不安全、很難受或需要即時幫忙，請告訴身邊可信任成人並按學校既有程序處理。</aside><div class="estrat-actions"><button type="button" data-estrat-read>🔊 朗讀規則</button><button type="button" class="primary" data-estrat-start>我準備好了</button></div><p class="estrat-status" id="estratStatus" role="status" aria-live="polite">現在是準備時間，還未開始選擇。</p>`);
    $('[data-estrat-read]')?.addEventListener('click', () => speak('雙贏策略桌。每個虛構情境可以選擇我訊息、先暫停或找支持。沒有唯一好答案，也不會記錄個人行為。'));
    $('[data-estrat-start]')?.addEventListener('click', () => { state.index = 0; state.choices = []; renderRound(); });
    $('[data-estrat-start]')?.focus();
  }

  function renderRound() {
    const round = ROUNDS[state.index];
    const selected = state.choices[state.index];
    shell(`<p class="estrat-kicker">策略回合 ${state.index + 1} / ${ROUNDS.length} · 可重試、可暫停</p><h2 class="estrat-title" id="estratTitle">${round.icon} ${round.title}</h2><div class="estrat-progress" role="progressbar" aria-label="策略回合進度" aria-valuemin="1" aria-valuemax="${ROUNDS.length}" aria-valuenow="${state.index + 1}"><span>第 ${state.index + 1} / ${ROUNDS.length} 回合</span><i><b style="width:${((state.index + 1) / ROUNDS.length) * 100}%"></b></i></div><section class="estrat-board"><h3>虛構情境</h3><p>${round.scenario}</p></section><aside class="estrat-note">請選一個你想先練習的支持策略。這不是在判斷角色對錯；目標是看見多一個安全、可修復或可求助的下一步。</aside><section class="estrat-options" aria-label="策略選項">${round.options.map(([title, line, effect], index) => `<button class="estrat-option${selected?.title === title ? ' selected' : ''}" type="button" data-estrat-option="${index}"><strong>${index + 1}. ${title}</strong><span>${line}</span><small>${effect}</small></button>`).join('')}</section><div class="estrat-actions">${selected ? '<button type="button" class="primary" data-estrat-next>下一個情境</button>' : ''}<button type="button" data-estrat-hint>💡 看提示</button><button type="button" data-estrat-pause>⏸ 先停一停</button><button type="button" data-estrat-exit>← 返回活動庫</button></div><p class="estrat-status${selected ? ' ok' : ''}" id="estratStatus" role="status" aria-live="polite">${selected ? `已選「${selected.title}」。${selected.effect}` : '先看哪一個策略在此刻最能支持安全與溝通。'}</p>`);
    $$('[data-estrat-option]').forEach((button) => button.addEventListener('click', () => { const [title, line, effect] = round.options[Number(button.dataset.estratOption)]; state.choices[state.index] = { title, line, effect }; renderRound(); }));
    $('[data-estrat-next]')?.addEventListener('click', () => { state.index += 1; state.index < ROUNDS.length ? renderRound() : finish(); });
    $('[data-estrat-hint]')?.addEventListener('click', () => status('提示：你可以先分辨「我感到甚麼、我需要甚麼、下一個安全小步是甚麼」。也可以先停一停或請成人幫忙。'));
    $('[data-estrat-pause]')?.addEventListener('click', () => status('可以先停一停。準備好後可繼續選擇、返回上一個情境或離開。'));
    $('[data-estrat-exit]')?.addEventListener('click', close);
    $('[data-estrat-option]')?.focus();
  }

  function finish() {
    shell(`<p class="estrat-kicker">本節回顧 · 不作行為評分</p><h2 class="estrat-title" id="estratTitle">八個策略情境已完成</h2><section class="estrat-summary"><span aria-hidden="true">🤝</span><h3>你已練習看見多一個選擇</h3><p>這次選擇只屬於虛構情境中的策略練習。教師可問「哪一種支持令角色有更多選擇？」；不需要建立個人行為目標、代幣、契約或日誌。</p></section><div class="estrat-actions"><button type="button" data-estrat-replay>↺ 再看一次</button><button type="button" class="primary" data-estrat-close>完成並返回</button></div>`);
    $('[data-estrat-replay]')?.addEventListener('click', renderReady);
    $('[data-estrat-close]')?.addEventListener('click', close);
    state.onComplete?.({ label: `雙贏策略桌 · ${stageLabel()}`, total: ROUNDS.length, openEnded: true, completedAt: new Date().toLocaleString('zh-HK') });
    $('[data-estrat-close]')?.focus();
  }

  function status(text) { const node = $('#estratStatus'); if (node) node.textContent = text; }
  function speak(text) { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'zh-HK'; utterance.rate = .76; window.speechSynthesis.speak(utterance); }
  function onKey(event) { if (!host) return; if (event.key === 'Escape') { event.preventDefault(); close(); return; } if (/^[1-3]$/.test(event.key)) { const button = $(`[data-estrat-option="${Number(event.key) - 1}"]`); if (button) { event.preventDefault(); button.click(); } } }

  window.EBD_STRATEGY_LAB = {
    activityCards(stage = 'lower') { return [{ id: `ebd-strategy-${stage}`, icon: '🤝', title: '雙贏策略桌', description: '以 I-message、暫停與求助卡探索八個虛構衝突情境；不記錄個人行為。', tag: `${STAGE_LABELS[stage] || STAGE_LABELS.lower} · 8 個策略情境`, tone: 'pink', supports: ['E'], ebdStrategyActivity: 'strategy-table' }]; },
    openActivity(_key, options = {}) { this.open(options); },
    open(options = {}) { close(); ensureStyles(); returnFocus = options.trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null); state = { stage: options.stage || 'lower', onComplete: options.onComplete, index: 0, choices: [] }; host = document.createElement('div'); host.id = 'ebdStrategyHost'; document.body.appendChild(host); document.addEventListener('keydown', onKey); renderReady(); }
  };

  const existingEbdLab = window.EBD_MI_CORE_LAB;
  if (existingEbdLab && !existingEbdLab.__hasStrategyTable) {
    const baseCards = existingEbdLab.activityCards.bind(existingEbdLab);
    const baseOpen = existingEbdLab.openActivity.bind(existingEbdLab);
    existingEbdLab.activityCards = (track, stage = 'lower') => track === 'ebd' ? [...baseCards(track, stage), { id: `ebd-strategy-${stage}`, icon: '🤝', title: '雙贏策略桌', description: '以 I-message、暫停與求助卡探索八個虛構衝突情境；不記錄個人行為。', tag: `${STAGE_LABELS[stage] || STAGE_LABELS.lower} · 8 個策略情境`, tone: 'pink', supports: ['E'], ebdMiTrack: 'ebd', ebdMiActivity: 'strategy-table' }] : baseCards(track, stage);
    existingEbdLab.openActivity = (track, key, options = {}) => track === 'ebd' && key === 'strategy-table' ? window.EBD_STRATEGY_LAB.open(options) : baseOpen(track, key, options);
    existingEbdLab.__hasStrategyTable = true;
  }
})();
