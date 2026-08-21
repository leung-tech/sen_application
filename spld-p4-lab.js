(function () {
  const activities = {
    morpheme: {
      icon: '🔗',
      title: '語素接龍',
      description: '從核心語素延伸詞語，再按意思放到正確類別。',
      focus: '語素意識與詞彙網絡',
      accent: 'teal',
      rounds: [
        { core: '車', category: '交通工具', prompt: '以「車」延伸詞語。哪一個最適合放入「交通工具」？', choices: ['火車', '車票', '車廂'], answer: '火車', hint: '火車本身可以載人或載貨，是一種交通工具。', meaning: '車 → 火車、車票、車廂' },
        { core: '書', category: '可背著裝書的物品', prompt: '以「書」延伸詞語。哪一個最適合放入「可背著裝書的物品」？', choices: ['書包', '書店', '書架'], answer: '書包', hint: '書包可以背著，也可以把課本放進去。', meaning: '書 → 書包、書店、書架' },
        { core: '場', category: '進行運動的地方', prompt: '以「場」延伸詞語。哪一個最適合放入「進行運動的地方」？', choices: ['球場', '場地', '市場'], answer: '球場', hint: '踢球、打球常會在球場進行。', meaning: '場 → 球場、市場、場地' },
        { core: '手', category: '保護雙手的物品', prompt: '以「手」延伸詞語。哪一個最適合放入「保護雙手的物品」？', choices: ['手套', '手冊', '手工'], answer: '手套', hint: '天冷或做家務時，手套可以保護雙手。', meaning: '手 → 手套、手冊、手工' },
        { core: '電', category: '提供光線的用品', prompt: '以「電」延伸詞語。哪一個最適合放入「提供光線的用品」？', choices: ['電燈', '電車', '電池'], answer: '電燈', hint: '房間變暗時，開電燈可以照明。', meaning: '電 → 電燈、電車、電池' },
        { core: '口', category: '進入建築物的通道', prompt: '以「口」延伸詞語。哪一個最適合放入「進入建築物的通道」？', choices: ['入口', '出口', '口罩'], answer: '入口', hint: '要走進一個地方，就找「入口」。', meaning: '口 → 入口、出口、口罩' },
        { core: '學', category: '正在讀書的人', prompt: '以「學」延伸詞語。哪一個最適合放入「正在讀書的人」？', choices: ['學生', '學校', '學期'], answer: '學生', hint: '學生是在學校裡學習的人。', meaning: '學 → 學生、學校、學期' },
        { core: '校', category: '管理學校的人', prompt: '以「校」延伸詞語。哪一個最適合放入「管理學校的人」？', choices: ['校長', '校服', '校園'], answer: '校長', hint: '校長負責帶領和管理學校。', meaning: '校 → 校長、校服、校園' },
        { core: '天', category: '反映冷熱或下雨狀況', prompt: '以「天」延伸詞語。哪一個最適合放入「反映冷熱或下雨狀況」？', choices: ['天氣', '天空', '天文'], answer: '天氣', hint: '晴、雨、冷、熱都是天氣的情況。', meaning: '天 → 天氣、天空、天文' },
        { core: '日', category: '用來安排日期的工具', prompt: '以「日」延伸詞語。哪一個最適合放入「用來安排日期的工具」？', choices: ['日曆', '日常', '日落'], answer: '日曆', hint: '日曆會列出每天的日期，方便安排事情。', meaning: '日 → 日曆、日常、日落' }
      ]
    },
    sentence: {
      icon: '🧱',
      title: '句型重組積木',
      description: '把主語、謂語和賓語積木排好，砌出完整句子。',
      focus: '主謂賓句法拆解',
      accent: 'violet',
      rounds: [
        { subject: '小明', verb: '閱讀', object: '圖書', hint: '先找「誰」：小明；再找「做甚麼」：閱讀；最後找「甚麼」：圖書。' },
        { subject: '同學', verb: '完成', object: '專題報告', hint: '先找「誰」：同學；再找動作「完成」；最後找完成了甚麼。' },
        { subject: '姐姐', verb: '整理', object: '書包', hint: '想一想：姐姐是誰；她正在做整理這個動作；整理的是書包。' },
        { subject: '老師', verb: '提醒', object: '大家準時交回條', hint: '句子的開頭是做提醒的人；後面是老師提醒大家的內容。' },
        { subject: '學生', verb: '照顧', object: '植物', hint: '先找人物，再找動作，最後找被照顧的東西。' },
        { subject: '爸爸', verb: '修理', object: '單車', hint: '誰做修理？爸爸；修理甚麼？單車。' },
        { subject: '我們', verb: '討論', object: '小組分工', hint: '「我們」是做事的人；討論的是小組分工。' },
        { subject: '圖書館', verb: '提供', object: '安靜的閱讀空間', hint: '圖書館是句子的主語；它提供的是一個安靜的閱讀空間。' },
        { subject: '校工', verb: '清潔', object: '課室', hint: '先找「誰」：校工；再找動作「清潔」；最後找地方「課室」。' },
        { subject: '家人', verb: '準備', object: '晚餐', hint: '家人做的是準備；準備的內容是晚餐。' }
      ]
    }
  };

  let activeKey = '';
  let roundIndex = 0;
  let selectedBlocks = [];
  let blockOptions = [];
  let result = { correct: 0, retries: 0, hints: 0 };
  let completed = false;

  const currentActivity = () => activities[activeKey];
  const currentRound = () => currentActivity().rounds[roundIndex];
  const wait = (callback, duration = 1050) => window.setTimeout(callback, duration);

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/[「」]/g, ''));
    utterance.lang = 'zh-HK';
    utterance.rate = 0.72;
    window.speechSynthesis.speak(utterance);
  }

  function shuffle(items) {
    const output = [...items];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
    }
    return output;
  }

  function closeLab() {
    window.speechSynthesis?.cancel();
    document.querySelector('.spld-p4-lab-backdrop')?.remove();
  }

  function shell(content) {
    return `<div class="spld-p4-lab-backdrop" role="presentation"><section class="spld-p4-lab" role="dialog" aria-modal="true" aria-label="高小讀寫實驗室"><button class="spld-p4-close" type="button" aria-label="關閉高小讀寫實驗室">×</button>${content}</section></div>`;
  }

  function progressMarkup() {
    const activity = currentActivity();
    return `<div class="spld-p4-progress"><span>第 ${roundIndex + 1} / ${activity.rounds.length} 關</span><div><i style="width:${((roundIndex + 1) / activity.rounds.length) * 100}%"></i></div></div>`;
  }

  function toolsMarkup() {
    return `<div class="spld-p4-tools"><button type="button" id="spldP4Read">🔊 朗讀規則</button><button type="button" id="spldP4Hint">💡 看提示</button><button type="button" id="spldP4Back">← 換一項練習</button></div>`;
  }

  function menuMarkup() {
    return shell(`<div class="spld-p4-heading"><span class="spld-p4-kicker">高小 P.4–P.6 · SpLD</span><h2>高小讀寫實驗室</h2><p>按今天要練的技能直接開始。可以慢慢讀、看提示、換練習或隨時離開。</p></div><div class="spld-p4-menu">${Object.entries(activities).map(([key, activity]) => `<button type="button" class="spld-p4-menu-card ${activity.accent}" data-p4-activity="${key}"><span>${activity.icon}</span><strong>${activity.title}</strong><small>${activity.description}</small><em>約 4–6 分鐘</em></button>`).join('')}</div><aside class="spld-p4-low-pressure"><strong>低壓參與：</strong><span>👀 先看結構</span><span>🔊 重聽規則</span><span>💡 使用提示</span><span>↔ 隨時換練習</span></aside>`);
  }

  function openMenu() {
    closeLab();
    document.body.insertAdjacentHTML('beforeend', menuMarkup());
    document.querySelector('.spld-p4-close')?.addEventListener('click', closeLab);
    document.querySelectorAll('[data-p4-activity]').forEach((button) => button.addEventListener('click', () => startActivity(button.dataset.p4Activity)));
  }

  function feedback(message, state = '') {
    const panel = document.querySelector('#spldP4Feedback');
    if (!panel) return;
    panel.className = `spld-p4-feedback ${state}`;
    panel.textContent = message;
  }

  function morphemeMarkup(round) {
    return `<div class="spld-p4-chain"><div class="spld-p4-core"><span>核心語素</span><strong>${round.core}</strong></div><span class="spld-p4-arrow">→</span><div class="spld-p4-category"><span>意思類別</span><strong>${round.category}</strong></div></div><p class="spld-p4-prompt">${round.prompt}</p><p class="spld-p4-meaning">詞彙網絡：${round.meaning}</p><div class="spld-p4-choice-grid">${round.choices.map((choice, index) => `<button type="button" class="spld-p4-choice" data-choice="${choice}"><span>${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div>`;
  }

  function sentenceMarkup(round) {
    const labels = ['主語（誰）', '謂語（做甚麼）', '賓語（甚麼）'];
    return `<div class="spld-p4-sentence-guide"><span>句法積木</span><strong>先找誰 → 做甚麼 → 甚麼</strong></div><p class="spld-p4-prompt">把三塊積木按「主語、謂語、賓語」順序排好。</p><div class="spld-p4-slots">${labels.map((label, index) => `<div class="spld-p4-slot ${selectedBlocks[index] ? 'filled' : ''}"><span>${label}</span><strong>${selectedBlocks[index] || '？'}</strong></div>`).join('')}</div><p class="spld-p4-sentence-preview">${selectedBlocks.length ? selectedBlocks.join(' ') : '完成後，這裡會出現完整句子。'}</p><div class="spld-p4-block-bank">${blockOptions.map((block) => `<button type="button" class="spld-p4-block ${selectedBlocks.includes(block) ? 'used' : ''}" data-block="${block}" ${selectedBlocks.includes(block) ? 'disabled' : ''}>${block}</button>`).join('')}</div>`;
  }

  function renderRound() {
    const activity = currentActivity();
    const round = currentRound();
    const playArea = activeKey === 'morpheme' ? morphemeMarkup(round) : sentenceMarkup(round);
    const heading = `<div class="spld-p4-heading compact"><span class="spld-p4-kicker">${activity.focus}</span><h2>${activity.icon} ${activity.title}</h2><p>${activity.description}</p></div>`;
    const dialog = document.querySelector('.spld-p4-lab');
    dialog.innerHTML = `<button class="spld-p4-close" type="button" aria-label="關閉高小讀寫實驗室">×</button>${heading}${progressMarkup()}<div class="spld-p4-play-area">${playArea}</div><div class="spld-p4-feedback" id="spldP4Feedback">慢慢看一看；不知道時可以按提示。</div>${toolsMarkup()}`;
    bindRound(round);
  }

  function bindRound(round) {
    document.querySelector('.spld-p4-close')?.addEventListener('click', closeLab);
    document.querySelector('#spldP4Read')?.addEventListener('click', () => {
      const readText = activeKey === 'morpheme' ? `${round.prompt}。核心語素是${round.core}，意思類別是${round.category}。` : `句型重組積木。請把主語、謂語和賓語按正確次序排好。`;
      speak(readText);
    });
    document.querySelector('#spldP4Hint')?.addEventListener('click', () => {
      result.hints += 1;
      feedback(`💡 ${round.hint}`, 'hint');
      speak(round.hint);
    });
    document.querySelector('#spldP4Back')?.addEventListener('click', openMenu);
    if (activeKey === 'morpheme') {
      document.querySelectorAll('.spld-p4-choice').forEach((button) => button.addEventListener('click', () => chooseMorpheme(button, round)));
    } else {
      document.querySelectorAll('.spld-p4-block').forEach((button) => button.addEventListener('click', () => chooseSentenceBlock(button.dataset.block, round)));
    }
  }

  function chooseMorpheme(button, round) {
    if (button.disabled) return;
    const choice = button.dataset.choice;
    if (choice === round.answer) {
      result.correct += 1;
      button.classList.add('correct');
      feedback(`✓ ${choice}最符合「${round.category}」。${round.meaning}`, 'success');
      speak(`答對了。${choice}最符合${round.category}。`);
      wait(nextRound);
      return;
    }
    result.retries += 1;
    button.classList.add('wrong');
    feedback('先看清意思類別，再比較每個由核心語素延伸出的詞。', 'try');
    speak('先看清意思類別，再慢慢比較每個詞。');
    wait(() => button.classList.remove('wrong'), 720);
  }

  function chooseSentenceBlock(block, round) {
    const answer = [round.subject, round.verb, round.object];
    const expected = answer[selectedBlocks.length];
    if (block !== expected) {
      result.retries += 1;
      feedback(`先看這一格是「${['主語', '謂語', '賓語'][selectedBlocks.length]}」。慢慢重新排列也可以。`, 'try');
      speak('先看這一格的句法提示，再慢慢重新排列。');
      wait(() => { selectedBlocks = []; renderRound(); }, 760);
      return;
    }
    selectedBlocks.push(block);
    if (selectedBlocks.length < answer.length) {
      feedback(`✓ 放好了「${block}」。接著看下一格。`, 'success');
      renderRound();
      return;
    }
    result.correct += 1;
    feedback(`✓ 句子完成：「${answer.join('')}」。`, 'success');
    speak(`答對了。${answer.join('')}。`);
    wait(nextRound);
  }

  function nextRound() {
    if (roundIndex < currentActivity().rounds.length - 1) {
      roundIndex += 1;
      selectedBlocks = [];
      const round = currentRound();
      blockOptions = activeKey === 'sentence' ? shuffle([round.subject, round.verb, round.object]) : [];
      renderRound();
      return;
    }
    finish();
  }

  function finish() {
    if (completed) return;
    completed = true;
    const activity = currentActivity();
    document.dispatchEvent(new CustomEvent('spld-p4-lab-complete', { detail: { ...result, activity: activity.title } }));
    const dialog = document.querySelector('.spld-p4-lab');
    dialog.innerHTML = `<button class="spld-p4-close" type="button" aria-label="關閉高小讀寫實驗室">×</button><div class="spld-p4-result"><span class="spld-p4-kicker">本次讀寫回顧</span><h2>完成 ${activity.title}</h2><p>你已完成 ${activity.rounds.length} 個小回合。可以休息、選另一項練習，或回到高小 SpLD 關卡。</p><div class="spld-p4-result-grid"><div><strong>${result.correct} / ${activity.rounds.length}</strong><span>完成回合</span></div><div><strong>${result.retries}</strong><span>溫和重試</span></div><div><strong>${result.hints}</strong><span>使用提示</span></div></div><aside>這些數字只協助教師安排下一步，不作比較或評分。</aside><div class="spld-p4-result-actions"><button type="button" id="spldP4TryAgain">↺ 選另一項練習</button><button type="button" id="spldP4Exit">回到高小 SpLD 關卡</button></div></div>`;
    dialog.querySelector('.spld-p4-close')?.addEventListener('click', closeLab);
    dialog.querySelector('#spldP4TryAgain')?.addEventListener('click', openMenu);
    dialog.querySelector('#spldP4Exit')?.addEventListener('click', closeLab);
  }

  function startActivity(key) {
    if (!activities[key]) return;
    activeKey = key;
    roundIndex = 0;
    selectedBlocks = [];
    blockOptions = activeKey === 'sentence' ? shuffle([activities[key].rounds[0].subject, activities[key].rounds[0].verb, activities[key].rounds[0].object]) : [];
    result = { correct: 0, retries: 0, hints: 0 };
    completed = false;
    renderRound();
  }

  function openActivity(key) {
    if (!activities[key]) return;
    closeLab();
    document.body.insertAdjacentHTML('beforeend', shell(''));
    startActivity(key);
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `.spld-p4-lab-backdrop{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;background:rgba(20,29,53,.68)}.spld-p4-lab{position:relative;width:min(760px,100%);max-height:calc(100vh - 32px);overflow:auto;padding:32px;border-radius:27px;background:#fff;color:#26344b;box-shadow:0 28px 72px rgba(14,21,42,.35)}.spld-p4-close{position:absolute;top:14px;right:16px;width:38px;height:38px;border:0;border-radius:50%;color:#5c6579;background:#f0f3f8;font-size:28px;line-height:1;cursor:pointer}.spld-p4-heading{padding-right:42px}.spld-p4-heading h2{margin:5px 0 6px;color:#233a60;font-size:29px}.spld-p4-heading p{margin:0;color:#66738a;line-height:1.58}.spld-p4-kicker{display:block;color:#278a7e;font-size:13px;font-weight:900;letter-spacing:.06em}.spld-p4-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:22px 0}.spld-p4-menu-card{min-height:200px;padding:19px;display:flex;flex-direction:column;gap:7px;border:2px solid #cfe8e1;border-radius:21px;background:#f8fffd;color:#243852;text-align:left;cursor:pointer;transition:transform .16s,box-shadow .16s}.spld-p4-menu-card:hover{transform:translateY(-3px);box-shadow:0 13px 26px rgba(30,112,97,.13)}.spld-p4-menu-card.violet{border-color:#ddd5fb;background:#fbfaff}.spld-p4-menu-card>span{font-size:37px}.spld-p4-menu-card strong{font-size:21px}.spld-p4-menu-card small{color:#617086;line-height:1.5}.spld-p4-menu-card em{margin-top:auto;color:#2b887d;font-style:normal;font-weight:800}.spld-p4-low-pressure{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:13px 15px;border-radius:15px;background:#eff8f7;color:#35655e;font-size:14px}.spld-p4-low-pressure span{padding:5px 8px;border-radius:99px;background:#fff}.spld-p4-progress{display:flex;align-items:center;gap:12px;margin:21px 0 14px;color:#3b766e;font-size:14px;font-weight:850}.spld-p4-progress>div{height:8px;flex:1;overflow:hidden;border-radius:99px;background:#dcece9}.spld-p4-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#249b8c,#63c9ae)}.spld-p4-play-area{padding:21px;border:1px solid #d7ebe6;border-radius:21px;background:linear-gradient(145deg,#fbfffe,#eff9f7)}.spld-p4-chain{display:flex;align-items:center;justify-content:center;gap:11px;padding:14px;border-radius:16px;background:#fff;box-shadow:0 5px 14px rgba(34,116,101,.08)}.spld-p4-core,.spld-p4-category{display:flex;flex-direction:column;gap:3px}.spld-p4-core span,.spld-p4-category span{color:#6c7b8d;font-size:12px;font-weight:800}.spld-p4-core strong{color:#238275;font-size:44px}.spld-p4-category strong{color:#2a496a;font-size:19px}.spld-p4-arrow{color:#4bb09f;font-size:31px;font-weight:900}.spld-p4-prompt{margin:20px 0 6px;color:#203752;font-size:20px;font-weight:850;line-height:1.48}.spld-p4-meaning{margin:0 0 16px;color:#617286;font-size:14px}.spld-p4-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.spld-p4-choice{min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:2px solid #a7d9cf;border-radius:16px;background:#fff;color:#276a62;cursor:pointer}.spld-p4-choice span{font-size:12px;font-weight:850}.spld-p4-choice strong{font-size:25px}.spld-p4-choice.correct{border-color:#44a873;background:#ebf9ef;color:#246d48}.spld-p4-choice.wrong{border-color:#d47d7d;background:#fff0f0;color:#9b4d4d}.spld-p4-sentence-guide{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 15px;border-radius:15px;background:#fff}.spld-p4-sentence-guide span{color:#6555af;font-size:12px;font-weight:850}.spld-p4-sentence-guide strong{color:#443781;font-size:16px}.spld-p4-slots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:17px 0 10px}.spld-p4-slot{min-height:103px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:2px dashed #bfb5e8;border-radius:16px;background:#fff;color:#6a6385;text-align:center}.spld-p4-slot.filled{border-style:solid;border-color:#8f7cdc;background:#f5f2ff;color:#47398d}.spld-p4-slot span{font-size:11px;font-weight:850}.spld-p4-slot strong{font-size:20px}.spld-p4-sentence-preview{min-height:45px;margin:0 0 14px;padding:11px 13px;border-radius:12px;background:#edeaff;color:#4a3e8b;font-size:15px;font-weight:800;text-align:center}.spld-p4-block-bank{display:flex;justify-content:center;gap:9px;flex-wrap:wrap}.spld-p4-block{min-height:58px;padding:9px 15px;border:2px solid #b9afe7;border-radius:13px;background:#fff;color:#4d3e9b;font-size:17px;font-weight:850;cursor:pointer}.spld-p4-block.used{opacity:.45}.spld-p4-feedback{min-height:25px;margin:14px 0;color:#5e6f82;line-height:1.48}.spld-p4-feedback.success{color:#25714f;font-weight:850}.spld-p4-feedback.try{color:#9b4d4d;font-weight:850}.spld-p4-feedback.hint{color:#896313;font-weight:850}.spld-p4-tools,.spld-p4-result-actions{display:flex;flex-wrap:wrap;gap:9px}.spld-p4-tools button,.spld-p4-result-actions button{padding:10px 12px;border:1px solid #c9ded9;border-radius:11px;background:#fff;color:#26776d;font-weight:850;cursor:pointer}.spld-p4-tools button:first-child,.spld-p4-result-actions button:first-child{border-color:#248e81;background:#248e81;color:#fff}.spld-p4-result{padding-top:14px;text-align:center}.spld-p4-result h2{margin:6px 0;color:#233a60;font-size:29px}.spld-p4-result>p{color:#617286;line-height:1.55}.spld-p4-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin:22px 0}.spld-p4-result-grid div{padding:14px;border-radius:16px;background:#eef9f7}.spld-p4-result-grid strong{display:block;color:#277c70;font-size:25px}.spld-p4-result-grid span{color:#5a6d7b;font-size:13px}.spld-p4-result aside{padding:12px;border-radius:13px;background:#eef5ff;color:#405d7c;font-size:14px;line-height:1.5}@media(max-width:620px){.spld-p4-lab{padding:25px 16px;border-radius:22px}.spld-p4-menu{grid-template-columns:1fr}.spld-p4-menu-card{min-height:156px}.spld-p4-heading h2,.spld-p4-result h2{font-size:25px}.spld-p4-prompt{font-size:18px}.spld-p4-choice-grid{gap:8px}.spld-p4-choice{min-height:86px}.spld-p4-choice strong{font-size:21px}.spld-p4-slots{gap:7px}.spld-p4-slot{min-height:91px;padding:7px}.spld-p4-slot strong{font-size:16px}.spld-p4-sentence-guide{align-items:flex-start;flex-direction:column}.spld-p4-block{min-height:52px;font-size:15px}.spld-p4-result-grid{gap:7px}.spld-p4-result-grid strong{font-size:21px}.spld-p4-tools button{flex:1}}`;
    document.head.appendChild(style);
  }

  window.SPLD_P4_LAB = {
    activityCards() {
      return Object.entries(activities).map(([key, activity]) => ({
        id: `spld-p4-${key}`,
        p4ActivityKey: key,
        lab: 'p4',
        category: 'cognition',
        categoryName: '高小 · SpLD 多感官讀寫',
        tone: key === 'morpheme' ? 'teal' : 'purple',
        icon: activity.icon,
        title: activity.title,
        description: activity.description,
        tag: `P4–P6 · ${activity.focus}`,
        supports: ['1'],
        rounds: activity.rounds
      }));
    },
    openActivity,
    openMenu
  };

  injectStyles();
})();
