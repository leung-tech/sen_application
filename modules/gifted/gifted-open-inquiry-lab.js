/* Design: G／2e「多路徑探究工房」— 八張可自行選順序的虛構探究卡；沒有唯一答案、排名或價值判定。 */
(() => {
  'use strict';

  const STAGE_LABELS = { lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' };
  const ROUNDS = [
    { icon: '💧', title: '雨水花園的取捨', scenario: '虛構校園想收集雨水澆花，但也要保留輪椅通道。', question: '你想先從哪一種角度探索？', lenses: [['使用者需要', '先問誰會使用通道，以及他們需要甚麼。'], ['科學測試', '先想想雨水量、花圃需要與安全限制。'], ['草圖原型', '先畫一個可試行的小模型，之後再修訂。']] },
    { icon: '🎨', title: '會說故事的海報', scenario: '虛構展覽要讓不同年齡的訪客理解同一項科學發現。', question: '你想先打開哪一個設計問題？', lenses: [['視覺轉譯', '先把一個複雜概念變成圖像、顏色或步驟。'], ['證據來源', '先核對哪些資料最值得清楚標示。'], ['訪客提問', '先寫一條想讓訪客帶走的問題。']] },
    { icon: '🤖', title: '幫手機器人的第一版', scenario: '虛構社區想做一個幫忙整理回收物的機器人。', question: '第一步可以從哪一項開始？', lenses: [['功能清單', '先選一件最小而可測試的工作。'], ['材料想像', '先比較紙板、磁鐵、感應器或標籤能做甚麼。'], ['公平影響', '先問它會否令任何使用者較難參與。']] },
    { icon: '🌙', title: '夜間閱讀站', scenario: '虛構圖書館想延長開放時間，但要顧及安靜、安全與能源。', question: '你想先找哪一種資料？', lenses: [['不同觀點', '先讀讀學生、職員與附近居民可能關心甚麼。'], ['限制條件', '先列出時間、照明、空間與人手的限制。'], ['試行版本', '先設計一個短期試行，再收集可修訂的觀察。']] },
    { icon: '🪐', title: '星球食物系統', scenario: '虛構太空站只有有限水源，但居民想種不同蔬菜。', question: '哪條探究路徑最令你好奇？', lenses: [['系統連結', '先畫出水、光、種子與居民需要之間的關係。'], ['反例問題', '先問：在甚麼情況下原來的想法不會有效？'], ['創意替代', '先想一個不同於種植的食物來源或保存方法。']] },
    { icon: '🎭', title: '互動戲劇的規則', scenario: '虛構班級要創作一段讓觀眾可參與的短劇。', question: '你想先處理哪一項？', lenses: [['角色感受', '先想觀眾與角色各會得到哪些選擇。'], ['故事結構', '先安排開頭、轉折與多個可能結局。'], ['安全界線', '先訂出不迫使任何人表演或分享私人經歷的規則。']] },
    { icon: '🧭', title: '海岸探索路線', scenario: '虛構學習小組想觀察海岸生態，也要保護小動物與步道。', question: '你想先提出哪一類問題？', lenses: [['觀察方法', '先想如何只記錄、不打擾地觀察。'], ['資料比較', '先決定哪些資料可以在不同日子比較。'], ['使用者設計', '先問不同訪客如何安全而清楚地找到路線。']] },
    { icon: '🧩', title: '不完美作品展', scenario: '虛構角色想展出一件還有很多可以修改的作品。', question: '你想先選哪一個下一步？', lenses: [['保留亮點', '先找一個已經有效、值得保留的地方。'], ['小量修訂', '先選一個最小可改變點，做一個新版本。'], ['回饋問題', '先寫一條請人給具體意見的問題。']] }
  ];

  let host;
  let state;
  let returnFocus;

  const $ = (selector) => host?.querySelector(selector);
  const $$ = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const stageLabel = () => STAGE_LABELS[state?.stage] || STAGE_LABELS.lower;
  const label = () => '多路徑探究工房';

  function ensureStyles() {
    if (document.getElementById('gifted-inquiry-styles')) return;
    const style = document.createElement('style');
    style.id = 'gifted-inquiry-styles';
    style.textContent = `
      .ginq-backdrop{position:fixed;inset:0;z-index:1180;display:grid;place-items:center;padding:16px;background:rgba(28,20,63,.76);backdrop-filter:blur(5px)}
      .ginq-dialog{position:relative;width:min(1000px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,32px);border:2px solid #ddd0ff;border-radius:28px;background:#fffdfa;color:#302748;box-shadow:0 25px 72px rgba(18,8,51,.46)}
      .ginq-close{position:absolute;top:14px;right:15px;width:48px;height:48px;border:0;border-radius:50%;background:#f0ebff;color:#553c91;font-size:28px;font-weight:900}
      .ginq-kicker{margin:0;color:#6341a6;font-size:12px;font-weight:900;letter-spacing:.08em}.ginq-title{margin:7px 52px 6px 0;color:#33255d;font-size:clamp(26px,4vw,40px);line-height:1.16}.ginq-lead{max-width:76ch;margin:0;color:#62577b;font-size:15px;font-weight:760;line-height:1.65}
      .ginq-note{margin-top:16px;padding:13px 15px;border-left:5px solid #7455bb;border-radius:14px;background:#f6f2ff;color:#4e3e78;font-size:14px;font-weight:800;line-height:1.6}.ginq-map{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px}.ginq-card{min-height:132px;padding:15px;border:2px solid #ddd4f4;border-radius:20px;background:#fff;color:#40345e;text-align:left}.ginq-card:hover,.ginq-card:focus-visible{border-color:#8063c5;background:#faf8ff}.ginq-card.done{border-color:#7bb597;background:#f1fbf5}.ginq-card span{display:block;font-size:28px}.ginq-card strong{display:block;margin-top:6px;font-size:17px}.ginq-card small{display:block;margin-top:6px;color:#776b91;font-size:12px;font-weight:750;line-height:1.4}.ginq-card em{display:inline-block;margin-top:8px;color:#347a5c;font-size:11px;font-style:normal;font-weight:900}
      .ginq-progress{display:flex;align-items:center;gap:10px;margin-top:16px;color:#5b4598;font-size:13px;font-weight:900}.ginq-progress i{display:block;flex:1;height:11px;overflow:hidden;border-radius:999px;background:#ebe6f7}.ginq-progress b{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#7352bb,#5aa58a)}
      .ginq-board{margin-top:18px;padding:clamp(17px,3vw,27px);border:2px solid #e1d8f4;border-radius:23px;background:linear-gradient(145deg,#f8f4ff,#fffaf1)}.ginq-board h3{margin:0;color:#3d2f68;font-size:clamp(21px,3vw,30px)}.ginq-board p{margin:9px 0 0;color:#5d5172;font-size:16px;font-weight:730;line-height:1.62}.ginq-question{margin:18px 0 10px;color:#3c2e67;font-size:18px;font-weight:900}.ginq-lenses{display:grid;gap:10px}.ginq-lens{padding:14px 15px;border:2px solid #cfc5eb;border-radius:16px;background:#fff;color:#403661;text-align:left}.ginq-lens:hover,.ginq-lens:focus-visible{border-color:#7658ba;background:#f9f7ff}.ginq-lens strong{display:block;font-size:16px}.ginq-lens small{display:block;margin-top:5px;color:#70648a;font-size:13px;font-weight:740;line-height:1.45}.ginq-lens.selected{border-color:#5aa283;background:#effaf3}.ginq-tools{display:flex;flex-wrap:wrap;gap:9px;margin-top:17px}.ginq-tools button,.ginq-actions button{min-height:45px;padding:0 14px;border:2px solid #d3c9eb;border-radius:13px;background:#fff;color:#50406f;font-size:14px;font-weight:900}.ginq-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.ginq-actions .primary{border-color:#6240a5;background:#6240a5;color:#fff}.ginq-status{min-height:28px;margin:14px 0 0;color:#5e7180;font-size:14px;font-weight:800;line-height:1.5}.ginq-status.ok{color:#287853}.ginq-summary{margin-top:20px;padding:22px;border:2px solid #b8dccb;border-radius:22px;background:#effbf5;text-align:center}.ginq-summary span{font-size:42px}.ginq-summary h3{margin:8px 0;color:#23614a;font-size:26px}.ginq-summary p{margin:0;color:#467060;line-height:1.6}
      .ginq-dialog button:focus-visible{outline:4px solid #146ca6;outline-offset:3px}.ginq-dialog button:active{transform:scale(.97)}
      @media(max-width:620px){.ginq-backdrop{padding:0;align-items:start}.ginq-dialog{min-height:100vh;max-height:none;border-radius:0}.ginq-map{grid-template-columns:1fr}.ginq-actions,.ginq-tools{display:grid;grid-template-columns:1fr}.ginq-actions button,.ginq-tools button{width:100%}}
      @media(prefers-reduced-motion:reduce){.ginq-dialog *{transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function shell(content) {
    host.innerHTML = `<div class="ginq-backdrop"><section class="ginq-dialog" role="dialog" aria-modal="true" aria-labelledby="ginqTitle"><button class="ginq-close" type="button" aria-label="關閉多路徑探究工房">×</button>${content}</section></div>`;
    $('.ginq-close')?.addEventListener('click', close);
  }

  function close() {
    document.removeEventListener('keydown', onKey);
    host?.remove();
    host = null;
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  }

  function renderMap() {
    if (state.done.size === ROUNDS.length) return finish();
    const count = state.done.size;
    shell(`<p class="ginq-kicker">G／資優與雙殊 · ${stageLabel()} · 非診斷性課堂探索</p><h2 class="ginq-title" id="ginqTitle">${label()}</h2><p class="ginq-lead">這是一張可自行選順序的探究地圖。每張卡都可以從不同角度開始；完成、略過或改變主意都可以，沒有唯一好答案。</p><div class="ginq-progress" role="progressbar" aria-label="已處理探索卡" aria-valuemin="0" aria-valuemax="8" aria-valuenow="${count}"><span>已處理 ${count} / ${ROUNDS.length} 張</span><i><b style="width:${(count / ROUNDS.length) * 100}%"></b></i></div><aside class="ginq-note">可選擇一張卡、看提示、先停一停或請教師一起看。內容使用虛構情境，不需要分享私人經驗，也不把探索結果當成能力或價值評分。</aside><div class="ginq-map">${ROUNDS.map((round, index) => `<button class="ginq-card${state.done.has(index) ? ' done' : ''}" type="button" data-ginq-card="${index}" aria-label="${round.title}${state.done.has(index) ? '，已處理，可再次查看' : ''}"><span aria-hidden="true">${round.icon}</span><strong>${round.title}</strong><small>${round.scenario}</small>${state.done.has(index) ? '<em>✓ 已處理，可再查看</em>' : ''}</button>`).join('')}</div><div class="ginq-tools"><button type="button" data-ginq-read>🔊 朗讀這頁</button><button type="button" data-ginq-pause>⏸ 先停一停</button><button type="button" data-ginq-close>← 返回活動庫</button></div><p class="ginq-status" id="ginqStatus" role="status" aria-live="polite">請選一張你現在想探索的卡。</p>`);
    $$('[data-ginq-card]').forEach((button) => button.addEventListener('click', () => renderCard(Number(button.dataset.ginqCard))));
    $('[data-ginq-read]')?.addEventListener('click', () => speak(`${label}。已處理${count}張探索卡。請選一張想探索的卡。`));
    $('[data-ginq-pause]')?.addEventListener('click', () => status('可以先停一停。準備好後可繼續、換一張卡或離開。'));
    $('[data-ginq-close]')?.addEventListener('click', close);
    $('[data-ginq-card]')?.focus();
  }

  function renderCard(index) {
    state.current = index;
    const round = ROUNDS[index];
    const chosen = state.notes[index];
    shell(`<p class="ginq-kicker">可自行選順序 · 探究卡 ${index + 1} / ${ROUNDS.length}</p><h2 class="ginq-title" id="ginqTitle">${round.icon} ${round.title}</h2><div class="ginq-progress" role="progressbar" aria-label="已處理探索卡" aria-valuemin="0" aria-valuemax="8" aria-valuenow="${state.done.size}"><span>已處理 ${state.done.size} / ${ROUNDS.length} 張</span><i><b style="width:${(state.done.size / ROUNDS.length) * 100}%"></b></i></div><section class="ginq-board"><h3>虛構情境</h3><p>${round.scenario}</p></section><p class="ginq-question">${round.question}</p><section class="ginq-lenses" aria-label="可選探究角度">${round.lenses.map(([title, detail], lensIndex) => `<button class="ginq-lens${chosen === title ? ' selected' : ''}" type="button" data-ginq-lens="${lensIndex}"><strong>${lensIndex + 1}. ${title}</strong><small>${detail}</small></button>`).join('')}</section><div class="ginq-actions">${chosen ? '<button type="button" class="primary" data-ginq-map>把這張卡放回地圖</button>' : '<button type="button" data-ginq-skip>這張卡今天先略過</button>'}<button type="button" data-ginq-hint>💡 看探究提示</button><button type="button" data-ginq-pause>⏸ 先停一停</button></div><p class="ginq-status${chosen ? ' ok' : ''}" id="ginqStatus" role="status" aria-live="polite">${chosen ? `你先選擇從「${chosen}」開始。這是一個可修訂的起點，不代表唯一或最佳方案。` : '選一個想先看的角度；三個角度都可以開啟下一步思考。'}</p>`);
    $$('[data-ginq-lens]').forEach((button) => button.addEventListener('click', () => {
      const [title] = round.lenses[Number(button.dataset.ginqLens)];
      state.done.add(index);
      state.notes[index] = title;
      renderCard(index);
    }));
    $('[data-ginq-map]')?.addEventListener('click', renderMap);
    $('[data-ginq-skip]')?.addEventListener('click', () => { state.done.add(index); state.notes[index] = '今天先略過'; renderMap(); });
    $('[data-ginq-hint]')?.addEventListener('click', () => status('提示：可先把情境分成「已知資料、想問的問題、可以先試的小步」。不需要一次想完整方案。'));
    $('[data-ginq-pause]')?.addEventListener('click', () => status('可以先停一停。這張卡會保留在地圖上，之後可再選。'));
    $('[data-ginq-lens]')?.focus();
  }

  function finish() {
    shell(`<p class="ginq-kicker">本節回顧 · 不作能力比較</p><h2 class="ginq-title" id="ginqTitle">探索地圖已完成</h2><section class="ginq-summary"><span aria-hidden="true">🧭</span><h3>你已處理八張探究卡</h3><p>你可以用不同角度開始、改變方向或暫時略過。教師可選一張卡，問「下一次還想查哪一個資料？」；不需要把任何選擇變成個人目標或評分。</p></section><div class="ginq-actions"><button type="button" data-ginq-replay>↺ 重新看地圖</button><button type="button" class="primary" data-ginq-close>完成並返回</button></div>`);
    $('[data-ginq-replay]')?.addEventListener('click', () => { state.done = new Set(); state.notes = {}; renderMap(); });
    $('[data-ginq-close]')?.addEventListener('click', close);
    state.onComplete?.({ label: `${label()} · ${stageLabel()}`, total: ROUNDS.length, explored: ROUNDS.length, completedAt: new Date().toLocaleString('zh-HK') });
    $('[data-ginq-close]')?.focus();
  }

  function status(text) { const node = $('#ginqStatus'); if (node) node.textContent = text; }
  function speak(text) { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'zh-HK'; utterance.rate = .76; window.speechSynthesis.speak(utterance); }
  function onKey(event) {
    if (!host) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (/^[1-8]$/.test(event.key) && state.current === null) { event.preventDefault(); renderCard(Number(event.key) - 1); return; }
    if (/^[1-3]$/.test(event.key) && state.current !== null) { const button = $(`[data-ginq-lens="${Number(event.key) - 1}"]`); if (button) { event.preventDefault(); button.click(); } }
  }

  window.GIFTED_OPEN_INQUIRY_LAB = {
    activityCards(stage = 'lower') { return [{ id: `gifted-inquiry-${stage}`, icon: '🧭', title: label(), description: '八張可自行選順序的虛構探究卡；用不同角度開始、試行、略過與修訂。', tag: `${STAGE_LABELS[stage] || STAGE_LABELS.lower} · 8 張探索卡`, tone: 'purple', supports: ['G'], giftedInquiryActivity: 'open-inquiry' }]; },
    openActivity(_key, options = {}) { this.open(options); },
    open(options = {}) { close(); ensureStyles(); returnFocus = options.trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null); state = { stage: options.stage || 'lower', onComplete: options.onComplete, done: new Set(), notes: {}, current: null }; host = document.createElement('div'); host.id = 'giftedOpenInquiryHost'; document.body.appendChild(host); document.addEventListener('keydown', onKey); renderMap(); }
  };

  const existingGiftedLab = window.GIFTED_EIGHT_GAMES_LAB;
  if (existingGiftedLab && !existingGiftedLab.__hasOpenInquiry) {
    const baseCards = existingGiftedLab.activityCards.bind(existingGiftedLab);
    const baseOpen = existingGiftedLab.openActivity.bind(existingGiftedLab);
    existingGiftedLab.activityCards = (stage = 'lower') => [...baseCards(stage), { id: `gifted-open-inquiry-${stage}`, icon: '🧭', title: label(), description: '八張可自行選順序的虛構探究卡；用不同角度開始、試行、略過與修訂。', tag: `${STAGE_LABELS[stage] || STAGE_LABELS.lower} · 8 張探索卡`, tone: 'purple', supports: ['G'], giftedEightActivity: 'open-inquiry' }];
    existingGiftedLab.openActivity = (key, options = {}) => key === 'open-inquiry' ? window.GIFTED_OPEN_INQUIRY_LAB.open(options) : baseOpen(key, options);
    existingGiftedLab.__hasOpenInquiry = true;
  }
})();
