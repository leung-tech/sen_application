(() => {
  const GRADE = {
    lower: { label: '初小 · P1–P3', emotionCount: 3, rounds: 4, jointTargets: 3, jointMode: 'basic', visualMode: 'detail', sensoryCount: 3 },
    upper: { label: '高小 · P4–P6', emotionCount: 5, rounds: 5, jointTargets: 4, jointMode: 'basic', visualMode: 'switch', sensoryCount: 4 },
    junior: { label: '初中 · S1–S3', emotionCount: 5, rounds: 6, jointTargets: 4, jointMode: 'compound', visualMode: 'switch', sensoryCount: 5 },
    senior: { label: '高中 · S4–S6', emotionCount: 6, rounds: 6, jointTargets: 4, jointMode: 'conflict', visualMode: 'switch', sensoryCount: 5 },
  };

  const GAMES = {
    emotion: { icon: '🤖', title: '機器人情緒解碼器', focus: '表情與情緒線索', description: '看機器人臉部的眼睛、嘴巴和情境，找出最接近的感受。', prep: ['先看看眼睛和嘴巴的線索。', '每次只選一個最接近的感受。', '不確定時可先聽提示或慢慢比較。'] },
    story: { icon: '💬', title: '社交故事選擇站', focus: '情境、感受與下一步', description: '從校園故事理解可能感受，再選一個尊重別人的下一步。', prep: ['先聽完情境，不用急著答。', '想一想：這件事對別人有甚麼影響？', '選出一個安全、尊重和可做到的下一步。'] },
    joint: { icon: '👁️', title: '一起看寶箱', focus: '聯合注意與視線線索', description: '跟隨機器人的眼神或指向，找到同一個寶箱。', prep: ['先看中間機器人的眼睛和手。', '找它正在看或指向的方向。', '不計速度；看清楚後才按寶箱。'] },
    visual: { icon: '🧩', title: '細節與全圖轉換', focus: '局部與整體視知覺', description: '在找形狀與看大圖之間切換，練習一次看一個焦點。', prep: ['先讀清楚題目要找「細節」還是「全圖」。', '細節題只找目標形狀；全圖題看整個大字。', '看不清楚時可按提示，不用趕時間。'] },
    sensory: { icon: '🌊', title: '安心感官小空間', focus: '聲音連結與自我調節', description: '把可預期的環境聲與圖卡配對，並可進入無閃爍的安靜流動畫面。', prep: ['聲音只會在你按播放後出現。', '若不想聽，可按「不播放聲音」並看提示。', '任何時候可進入安靜流動畫面或返回選關。'] },
  };

  const EMOTIONS = [
    { name: '開心', face: 'happy', cue: '眼睛彎彎，嘴巴向上。', context: '機器人收到喜歡的積木。' },
    { name: '難過', face: 'sad', cue: '嘴巴向下，眼睛好像想哭。', context: '機器人喜歡的作品弄壞了。' },
    { name: '生氣', face: 'angry', cue: '眉毛靠近，嘴巴緊緊。', context: '有人沒有問就拿走它的工具。' },
    { name: '害怕', face: 'scared', cue: '眼睛張大，嘴巴張開。', context: '突然聽到很大的聲音。' },
    { name: '驚訝', face: 'surprised', cue: '眼睛圓圓，嘴巴像小 O。', context: '盒子打開後出現意想不到的禮物。' },
    { name: '擔心', face: 'worried', cue: '眉毛斜斜，嘴巴有點彎。', context: '機器人不知道下一步會怎樣安排。' },
  ];

  const STORIES = [
    { context: '小明正在砌積木，小華沒有問就拿走一塊。', question: '小明可能有甚麼感受？', answer: '生氣或不舒服', options: ['生氣或不舒服', '一定很開心', '完全沒有感覺'], why: '沒有先問就拿走別人的東西，對方可能覺得不被尊重。', next: '可以說：「我可以用這一塊嗎？」' },
    { context: '小美說：「我想自己看書一會兒。」', question: '你可以怎樣回應？', answer: '好的，我遲些再問你。', options: ['好的，我遲些再問你。', '你一定要現在和我玩。', '一直站在旁邊說話'], why: '接受別人想安靜的需要，能讓互動更舒服。', next: '稍後可以再用一句短問句邀請。' },
    { context: '小組改了活動次序，原本先畫圖，現在先找資料。', question: '最有幫助的下一步是甚麼？', answer: '確認新安排，再做第一步。', options: ['確認新安排，再做第一步。', '把所有材料收起來。', '不停說不可以改。'], why: '改變時先知道新的第一步，較容易重新開始。', next: '可以說：「收到，我現在先找資料。」' },
    { context: '同學皺眉並把手放在耳朵旁。', question: '你可以先怎樣做？', answer: '放低聲音，留一點空間。', options: ['放低聲音，留一點空間。', '更大聲叫他回應。', '一直靠近他。'], why: '表情和動作可能表示聲音或距離令他不舒服。', next: '可以問：「你想安靜一下嗎？」' },
    { context: '你不小心打斷同學說話，他停了下來。', question: '怎樣修復最合適？', answer: '對不起，請你繼續。', options: ['對不起，請你繼續。', '我一定要先說完。', '完全不理會。'], why: '道歉並把回合交回對方，是清楚的修復方法。', next: '下次可以先舉手或等對方停下來。' },
  ];

  const HIGHER_STORIES = [
    { context: '班級群組裡，小健發出合作報告的初稿。兩小時後仍未有人回覆，他開始連續發訊息問：「你們是不是不理我？」', question: '最有幫助的下一步是甚麼？', answer: '先等一段合理時間，再用一句清楚問題跟進。', options: ['先等一段合理時間，再用一句清楚問題跟進。', '立刻在群組指責大家故意不回。', '連續發十多個問號。'], why: '別人未即時回覆可能在上課、休息或還未看見；清楚而不催迫的跟進較容易得到回應。', next: '可以說：「大家方便在今晚八時前看一看第一部分嗎？」', teacher: { open: '如果你是小健，等候時心裡可能有甚麼想法？還有沒有其他可能？', wait: '學生可從「忙碌、未看見、不知道怎樣回」中指一個，不必說完整句子。', model: '教師可示範：「我有點急，但我可以先等到約好的時間。」', close: '一起選一個具體等待時間，再練習一則短而清楚的跟進訊息。' } },
    { context: '小組簡報明天要交。阿琳負責的圖片仍未放進共享檔案。組員在群組說：「你又沒有做。」', question: '較尊重而有效的回應是甚麼？', answer: '先私下確認困難，再一起訂下一小步。', options: ['先私下確認困難，再一起訂下一小步。', '在群組公開嘲笑她。', '直接把她從小組刪除。'], why: '先了解是否有檔案、技術或時間困難，才能分工和處理問題，而不把人標籤化。', next: '可以說：「你那部分卡在哪裡？我可以先和你一起放兩張圖嗎？」', teacher: { open: '這句「你又沒有做」可能令對方感到甚麼？', wait: '可讓學生用情緒卡或點選「尷尬、壓力、被誤會」。', model: '教師可示範：「我先問發生甚麼事，再談下一步。」', close: '把「指責」句改寫成「了解情況＋一個可做到的幫忙」。' } },
    { context: '午飯時，同學展示一張另一位同學的尷尬照片，並問你可不可以轉發到班級群組。', question: '最能保護界線的下一步是甚麼？', answer: '先不要轉發，並建議先問當事人是否同意。', options: ['先不要轉發，並建議先問當事人是否同意。', '轉發後再說只是開玩笑。', '叫更多人一起評論照片。'], why: '照片和訊息也有個人界線；未問同意便轉發，可能令當事人尷尬或不安全。', next: '可以說：「我不想轉發，先問一問本人會較好。」', teacher: { open: '「大家都在轉發」會不會令選擇變得較困難？', wait: '學生可只練習說「我先不轉發」。', model: '教師可示範平靜語氣：「我不方便轉發，先問本人。」', close: '提醒學生可以離開群組對話、靜音或向可信任成人求助。' } },
    { context: '做實驗時，組員對你說：「你講得很快，我跟不到，可不可以慢一點？」', question: '怎樣回應最有助合作？', answer: '放慢並確認對方想先聽哪一步。', options: ['放慢並確認對方想先聽哪一步。', '說「你自己跟不上不是我的問題」。', '馬上停止合作、不再說話。'], why: '調整節奏和確認需要，能讓每個人都較容易參與；提出需要不代表在批評人。', next: '可以說：「可以，我先慢一點。你想我由哪一步再說？」', teacher: { open: '組員是在攻擊你，還是在說明自己需要甚麼？', wait: '若學生難分辨，可由教師讀出兩種語氣讓學生選。', model: '教師可示範：「收到，你想我慢一點。」', close: '輪流練習提出一個需要，以及用一句「收到」回應。' } },
    { context: '你在共同遊戲時聽見兩位同學笑著說「這個角色好廢」，而你正使用那個角色。', question: '哪一個下一步最能照顧自己又不升級衝突？', answer: '先說明感受或暫停，然後提出具體界線。', options: ['先說明感受或暫停，然後提出具體界線。', '立刻用更難聽的說話回罵。', '一直玩下去但越來越生氣。'], why: '你可以同時保留遊戲和保護感受；清楚說明或暫停，能避免在情緒高的時候說出會後悔的話。', next: '可以說：「我聽到這句有點不舒服，我先停一停，之後再玩。」', teacher: { open: '身體有甚麼訊號提醒你快要太生氣？', wait: '可讓學生指「心跳快、想大聲、想立刻離開」其中一項。', model: '教師可示範：「我先暫停兩分鐘，不是要退出你們。」', close: '一起選一個可用的暫停句和回來後的第一句。' } },
    { context: '老師在全班面前更正你投影片上的一個資料。你覺得尷尬，也擔心同學會笑。', question: '較有助自己繼續完成簡報的下一步是甚麼？', answer: '先記下要改的地方，課後再決定是否需要找老師澄清。', options: ['先記下要改的地方，課後再決定是否需要找老師澄清。', '立刻離開課室並不再完成簡報。', '大聲說老師故意令你難堪。'], why: '被更正可能令人尷尬，但先完成眼前一小步能保留選擇；課後仍可用較私人的方式問清楚。', next: '可以說：「我先記下來，課後可以問你哪裡要改嗎？」', teacher: { open: '尷尬時，眼前哪一個小步最容易做到？', wait: '學生可選「喝一口水、寫一個關鍵字、請同伴讀下一頁」。', model: '教師可示範：「我現在有點尷尬，但我可以先記下來。」', close: '把「當下可做」和「課後可問」分成兩張小卡。' } },
    { context: '朋友傳來一句「你真係好勁啊」並加了一個笑臉。你不確定他是在稱讚還是在反諷。', question: '最穩妥的下一步是甚麼？', answer: '先不要猜定意思，用一句中性問題確認。', options: ['先不要猜定意思，用一句中性問題確認。', '立即回覆「你係咪串我？」', '把訊息截圖傳給很多人評論。'], why: '文字少了語氣和表情線索，意思可能不止一個；中性確認可減少誤會。', next: '可以說：「我不太確定你的意思，你是在稱讚我嗎？」', teacher: { open: '同一句文字可能有哪兩種不同意思？', wait: '教師可先提供選項：「稱讚、開玩笑、打字太快」。', model: '教師可示範中性句：「我想確認一下你的意思。」', close: '比較「直接指控」與「中性確認」可能帶來的不同結果。' } },
    { context: '朋友答應下課一起溫習，後來臨時要參加校隊練習，並在十分鐘前才通知你。', question: '怎樣回應能同時表達失望和保留關係？', answer: '說明自己失望，並問可否另約時間。', options: ['說明自己失望，並問可否另約時間。', '說「以後不要再找我」。', '完全不回覆並把對方刪除。'], why: '臨時改變可令人失望；說明感受和另約時間，讓對方知道影響，也留下修復機會。', next: '可以說：「我有點失望，因為我已經準備了。可不可以改到明天？」', teacher: { open: '「我失望」和「你很差」有甚麼不同？', wait: '學生可先圈出較像描述自己感受的一句。', model: '教師可示範：「我失望，但我想找另一個時間。」', close: '一起在日程上找一個備用時間，讓修復更具體。' } },
    { context: '圖書館小組討論時，有同學不斷坐得很近、拍你的肩膀。你開始難以專心，但又怕說出來會尷尬。', question: '最清楚而尊重的下一步是甚麼？', answer: '用短句說明距離需要，並提出可行替代。', options: ['用短句說明距離需要，並提出可行替代。', '突然推開對方。', '一直忍住直到離開小組。'], why: '界線可以說得短和具體；提出座位或溝通替代方法，讓對方知道可以怎樣配合。', next: '可以說：「我坐開一點會較專心，我們用這張桌子兩邊的位置吧。」', teacher: { open: '怎樣說「我需要空間」而不把對方說成故意做錯？', wait: '學生可選擇說、指向距離卡或由教師先代說。', model: '教師可示範：「我需要多一點位置，謝謝。」', close: '練習配合手勢、座位圖或文字卡提出界線。' } },
    { context: '運動會分組時，你原本以為會和朋友同隊，最後被安排到另一隊。你很想拒絕，亦擔心新隊員不認識你。', question: '哪一步能令轉換較容易開始？', answer: '先向新隊員說一句簡短介紹，再確認自己的第一個角色。', options: ['先向新隊員說一句簡短介紹，再確認自己的第一個角色。', '整節都拒絕加入任何活動。', '要求所有人一定要換隊。'], why: '意外改變確實不容易；一個短介紹和一個清楚角色，能把不確定的情況拆成可做的小步。', next: '可以說：「我叫阿明，我剛轉來這隊。第一步我可以做甚麼？」', teacher: { open: '改變發生時，哪一件事最令你不確定？', wait: '可讓學生在「人、規則、位置、時間」中選一項。', model: '教師可示範：「我有點意外，請告訴我第一步。」', close: '教師先扮演新隊員，用一句友善回應接住學生的介紹。' } },
    { context: '你借了同學的充電線，回家後才發現接頭有點鬆。你不知道是不是自己弄壞，也怕同學生氣。', question: '最負責任的下一步是甚麼？', answer: '盡快說明發現的情況，並一起決定檢查或處理方法。', options: ['盡快說明發現的情況，並一起決定檢查或處理方法。', '把充電線放回原位當作不知道。', '先說一定不是自己的問題。'], why: '先說明自己看見的事實，不急著判斷責任，能讓雙方較容易一起檢查和處理。', next: '可以說：「我發現接頭有點鬆，想和你一起看看要怎樣處理。」', teacher: { open: '「說明事實」和「急著辯解」分別會怎樣開始對話？', wait: '學生可先讀出一句事實，不必立即解釋原因。', model: '教師可示範：「我發現了這個情況，想一起處理。」', close: '一起把事情分成「先告知、再檢查、最後決定」三步。' } },
    { context: '在學校群組，有人把你的名字拼錯了。你感到不被重視，但又不肯定對方是否只是手快打錯。', question: '怎樣澄清既清楚又不過早假設？', answer: '平靜指出名字的正確寫法，並留出對方改正空間。', options: ['平靜指出名字的正確寫法，並留出對方改正空間。', '立刻說對方一定故意針對你。', '在群組貼出對方所有錯字。'], why: '先說清楚需要改甚麼，比猜對方動機更容易得到實際改正。', next: '可以說：「我的名字寫作『家朗』，可否幫我改一改？謝謝。」', teacher: { open: '你希望對方知道的是「你的感受」、還是「要改哪一個字」？也可以兩者都說。', wait: '學生可先選只說一件事；不用一次說得完整。', model: '教師可示範：「我想更正一下名字的寫法。」', close: '一起決定在群組說、私訊說，或請教師協助哪一種較舒服。' } },
  ];

  const VISUALS = [
    { target: '△', scene: '△ □ ○ △ ☆', answer: '△', options: ['△', '□', '○'], whole: 'H', detail: 'S' },
    { target: '◇', scene: '○ ◇ □ ☆ ◇', answer: '◇', options: ['◇', '☆', '○'], whole: 'E', detail: 'L' },
    { target: '☆', scene: '□ ○ ☆ △ □', answer: '☆', options: ['☆', '△', '□'], whole: 'A', detail: 'O' },
    { target: '○', scene: '◇ □ ○ ☆ △', answer: '○', options: ['○', '◇', '☆'], whole: 'T', detail: 'I' },
  ];

  const SOUNDS = [
    { id: 'rain', label: '下雨聲', icon: '🌧️', hint: '像細小雨點連續落下。' },
    { id: 'bell', label: '單車鈴', icon: '🚲', hint: '短短兩下的清脆鈴聲。' },
    { id: 'bus', label: '巴士', icon: '🚌', hint: '低低的引擎聲。' },
    { id: 'vacuum', label: '吸塵機', icon: '🧹', hint: '持續的低聲「嗚——」。' },
    { id: 'birds', label: '雀鳥', icon: '🐦', hint: '一高一低的短叫聲。' },
  ];

  let host = null;
  let stage = 'lower';
  let state = null;
  let options = null;
  let returnFocus = null;
  let audioContext = null;
  let animationFrame = null;
  let timers = [];
  const preferences = { sound: true, visual: true };

  const q = (selector) => host?.querySelector(selector);
  const qa = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const currentGrade = () => GRADE[stage] || GRADE.lower;
  const wait = (fn, ms) => { const id = window.setTimeout(fn, ms); timers.push(id); return id; };
  const clearTimers = () => { timers.forEach(window.clearTimeout); timers = []; if (animationFrame) window.cancelAnimationFrame(animationFrame); animationFrame = null; };
  const shuffle = (items) => { const copy = [...items]; for (let index = copy.length - 1; index > 0; index -= 1) { const next = Math.floor(Math.random() * (index + 1)); [copy[index], copy[next]] = [copy[next], copy[index]]; } return copy; };
  const focusSoon = (selector) => window.requestAnimationFrame(() => q(selector)?.focus());
  const focusable = () => qa('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])').filter((node) => node.offsetParent !== null);

  function playNotes(kind = 'correct') {
    if (!preferences.sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const notes = { correct: [523, 659], finish: [523, 659, 784], calm: [392, 440], story: [440, 523], joint: [494, 587] }[kind] || [523];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, audioContext.currentTime + index * .09);
        gain.gain.exponentialRampToValueAtTime(.022, audioContext.currentTime + index * .09 + .02);
        gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + index * .09 + .18);
        oscillator.connect(gain).connect(audioContext.destination); oscillator.start(audioContext.currentTime + index * .09); oscillator.stop(audioContext.currentTime + index * .09 + .2);
      });
    } catch {}
  }

  function reward(kind = 'correct') {
    state.stars = Math.min(5, (state.stars || 0) + (kind === 'finish' ? 2 : 1));
    const meter = q('#asdStars');
    if (meter) { meter.textContent = `${'★'.repeat(state.stars)}${'☆'.repeat(5 - state.stars)}`; meter.parentElement?.setAttribute('aria-label', `本節努力星 ${state.stars} / 5`); meter.parentElement?.classList.add('earned'); wait(() => meter.parentElement?.classList.remove('earned'), 420); }
    if (preferences.visual) {
      const burst = document.createElement('div'); burst.className = `asd-reward ${kind}`; burst.setAttribute('aria-hidden', 'true');
      burst.innerHTML = (kind === 'story' ? ['💬', '✨', '🤝'] : kind === 'joint' ? ['👁️', '🎁', '⭐'] : kind === 'finish' ? ['🌟', '🎈', '🌈', '✨'] : ['✨', '⭐', '💫']).map((icon, index) => `<span style="--delay:${index * 55}ms">${icon}</span>`).join('');
      q('.asd-lab')?.appendChild(burst); wait(() => burst.remove(), 850);
    }
    playNotes(kind);
  }

  function feedback(text, tone = '', rewardKind = 'correct') {
    const node = q('#asdLabFeedback'); if (!node) return;
    node.className = `asd-feedback ${tone}`; node.textContent = text;
    if (tone === 'ok') reward(rewardKind);
  }

  function progress() {
    const total = state?.total || 1; const now = Math.min(state?.index || 0, total);
    return `<div class="asd-progress" role="progressbar" aria-label="${GAMES[state?.game]?.title || '訓練'}進度" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${now}" aria-valuetext="第 ${Math.min(now + 1, total)} / ${total} 回合"><i style="width:${Math.round(now / total * 100)}%"></i></div>`;
  }

  function tray() {
    const stars = state?.stars || 0;
    return `<aside class="asd-tray" aria-label="低壓支持與回饋設定"><div class="asd-stars" aria-label="本節努力星 ${stars} / 5"><span id="asdStars" aria-hidden="true">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span><strong>努力星 ${stars} / 5</strong></div><div class="asd-tools"><button id="asdRule" type="button">👁 看規則</button><button id="asdBreak" type="button">☁ 先停一停</button><button id="asdSound" type="button" aria-pressed="${preferences.sound}">${preferences.sound ? '🔊 回饋聲：開' : '🔇 回饋聲：關'}</button><button id="asdVisual" type="button" aria-pressed="${preferences.visual}">${preferences.visual ? '✨ 視覺獎勵：開' : '◌ 視覺獎勵：關'}</button></div><div id="asdSupportNote" class="asd-support-note" role="status" aria-live="polite" aria-atomic="true" hidden></div></aside>`;
  }

  function shell(content) {
    host.innerHTML = `<div class="asd-core-shell" role="dialog" aria-modal="true" aria-label="ASD 核心訓練室"><section class="asd-lab">${content}${tray()}</section></div>`;
    q('.asd-close')?.addEventListener('click', close);
    bindTray();
  }

  function top(title, description, eyebrow = 'ASD · 核心訓練') {
    return `<header class="asd-top"><div><div class="asd-eyebrow">${eyebrow}</div><h2>${title}</h2><p>${description}</p></div><button class="asd-close" type="button" aria-label="關閉 ASD 核心訓練室">×</button></header>`;
  }

  function note(text, actions = false) {
    const node = q('#asdSupportNote'); if (!node) return; node.hidden = false;
    node.innerHTML = actions ? `${text}<span><button id="asdRestart" type="button">↺ 重新開始這項</button><button id="asdMenu" type="button">換一項</button></span>` : text;
    q('#asdRestart')?.addEventListener('click', () => renderReady(state.game)); q('#asdMenu')?.addEventListener('click', renderMenu);
  }

  function bindTray() {
    q('#asdRule')?.addEventListener('click', () => { const rule = q('.asd-rule'); rule?.classList.add('highlight'); rule?.scrollIntoView({ behavior: 'smooth', block: 'center' }); wait(() => rule?.classList.remove('highlight'), 850); note(rule ? '規則已標示。現在只做眼前的一小步。' : '可先選一項遊戲；每項開始前都有一張規則準備頁。'); });
    q('#asdBreak')?.addEventListener('click', () => { clearTimers(); note('可以先停一停，不會扣分。準備好後可重新開始、換一項或回到 ASD 看板。', true); });
    q('#asdSound')?.addEventListener('click', () => { preferences.sound = !preferences.sound; const button = q('#asdSound'); button.setAttribute('aria-pressed', String(preferences.sound)); button.textContent = preferences.sound ? '🔊 回饋聲：開' : '🔇 回饋聲：關'; if (preferences.sound) playNotes('calm'); note(preferences.sound ? '已開啟溫和回饋聲。' : '已關閉回饋聲；文字支持仍會保留。'); });
    q('#asdVisual')?.addEventListener('click', () => { preferences.visual = !preferences.visual; const button = q('#asdVisual'); button.setAttribute('aria-pressed', String(preferences.visual)); button.textContent = preferences.visual ? '✨ 視覺獎勵：開' : '◌ 視覺獎勵：關'; note(preferences.visual ? '已開啟柔和視覺獎勵。' : '已關閉動態視覺效果；文字支持仍會保留。'); });
  }

  function renderMenu() {
    clearTimers(); state = { game: null, stars: 0, index: 0 };
    const cards = Object.entries(GAMES).map(([id, game]) => `<button class="asd-game-card" type="button" data-asd-game="${id}"><span aria-hidden="true">${game.icon}</span><strong>${game.title}</strong><small>${game.focus}</small><p>${game.description}</p><em>${currentGrade().label} 難度</em></button>`).join('');
    shell(`${top('選擇一項小訓練', '每項開始前都可先一起讀規則。可隨時休息、換項或離開；不是速度比賽。', currentGrade().label)}<div class="asd-game-grid">${cards}</div><aside class="asd-low-pressure"><strong>低壓參與</strong><span>學生可以先看規則、選擇慢慢做，或只和教師一起指一指，不需要一次完成所有回合。</span></aside>`);
    qa('[data-asd-game]').forEach((button) => button.addEventListener('click', () => renderReady(button.dataset.asdGame)));
    focusSoon('.asd-close');
  }

  function renderReady(game) {
    clearTimers(); state = { game, stars: 0, index: 0, preparing: true };
    const info = GAMES[game];
    shell(`${top(`${info.title} · 準備頁`, '請先由教師帶讀。未按「我準備好了」前，不會出題、播放聲音或開始任何動態內容。', `${currentGrade().label} · 一起準備`)}<section class="asd-ready" aria-labelledby="asdReadyTitle"><div class="asd-ready-icon" aria-hidden="true">${info.icon}</div><div><p>先一起讀三步</p><h3 id="asdReadyTitle">準備好了才開始</h3><ol>${info.prep.map((step) => `<li>${step}</li>`).join('')}</ol><small>學生可用點頭、指一指、手勢或說「我準備好了」表示可以開始。</small></div></section><div class="asd-actions"><button id="asdReadyBack" class="asd-secondary" type="button">← 換一項遊戲</button><button id="asdReadyStart" class="asd-primary" type="button">✓ 我準備好了，開始第一回合</button></div><div id="asdLabFeedback" class="asd-feedback" role="status" aria-live="polite" aria-atomic="true">現在是準備時間，尚未開始出題或播放聲音。</div>`);
    q('#asdReadyBack')?.addEventListener('click', renderMenu); q('#asdReadyStart')?.addEventListener('click', () => begin(game)); focusSoon('#asdReadyStart');
  }

  function next(renderer) {
    state.index += 1;
    if (state.index >= state.total) { finish(); return; }
    renderer();
  }

  function finish() {
    clearTimers(); const info = GAMES[state.game];
    options?.onComplete?.({ label: `${info.title} · ${currentGrade().label}`, mode: `asd-${state.game}`, total: state.total, correct: state.correct, incorrect: state.tries - state.correct, completedAt: new Date().toLocaleString('zh-HK') });
    shell(`${top('本次小訓練回顧', '你可以休息、重玩較短內容，或選擇另一項活動。結果只供本節課堂回顧，不作比較。', `完成 · ${currentGrade().label}`)}<section class="asd-summary"><div><span>完成回合</span><strong>${state.total} / ${state.total}</strong></div><div><span>正確嘗試</span><strong>${state.correct}</strong></div><div><span>努力星</span><strong>${state.stars} / 5</strong></div></section><p class="asd-rule">每一次慢慢看、提出需要或重新嘗試，都是可被看見的努力。</p><div class="asd-actions"><button id="asdRestart" class="asd-secondary" type="button">↺ 再玩這一項</button><button id="asdMenu" class="asd-primary" type="button">選另一個遊戲</button></div><div id="asdLabFeedback" class="asd-feedback" role="status" aria-live="polite" aria-atomic="true">本次練習完成，可以先休息一下。</div>`);
    reward('finish'); q('#asdRestart')?.addEventListener('click', () => renderReady(state.game)); q('#asdMenu')?.addEventListener('click', renderMenu); focusSoon('#asdMenu');
  }

  function faceMarkup(face, mode) {
    const detail = mode === 'eyes' ? 'eyes-only' : mode === 'mouth' ? 'mouth-only' : 'whole-face';
    return `<div class="robot-face ${face} ${detail}" aria-label="機器人表情"><span class="antenna">⌁</span><span class="eye left"></span><span class="eye right"></span><span class="brow left"></span><span class="brow right"></span><span class="mouth"></span></div>`;
  }

  function renderEmotion() {
    const pool = EMOTIONS.slice(0, currentGrade().emotionCount); const item = pool[(state.index + Math.floor(Math.random() * pool.length)) % pool.length];
    const mode = stage === 'lower' ? 'whole' : state.index % 3 === 1 ? 'eyes' : state.index % 3 === 2 ? 'mouth' : 'whole';
    const choices = shuffle([item.name, ...shuffle(pool.filter((emotion) => emotion.name !== item.name)).slice(0, 2).map((emotion) => emotion.name)]);
    state.answer = item.name;
    shell(`${top(GAMES.emotion.title, '先看表情線索，再慢慢選一個最接近的感受。', `${currentGrade().label} · ${state.index + 1} / ${state.total}`)}${progress()}<div class="asd-rule">${mode === 'eyes' ? '這一回合只看眼睛和眉毛。' : mode === 'mouth' ? '這一回合只看嘴巴。' : '可以同時看眼睛、眉毛和嘴巴。'} ${item.context}</div><div class="emotion-stage">${faceMarkup(item.face, mode)}<p>線索：${item.cue}</p></div><div class="asd-choice-grid">${choices.map((choice) => `<button type="button" class="asd-choice" data-emotion="${choice}">${choice}</button>`).join('')}</div><div id="asdLabFeedback" class="asd-feedback" role="status" aria-live="polite" aria-atomic="true">先留意機器人的臉部線索，再選一個感受。</div>`);
    qa('[data-emotion]').forEach((button) => button.addEventListener('click', () => { if (button.dataset.emotion === state.answer) { state.correct += 1; state.tries += 1; feedback(`✓ 你找到了「${state.answer}」。${item.cue}`, 'ok'); wait(() => next(renderEmotion), 720); } else { state.tries += 1; feedback(`↗ 可以再看一次：${item.cue}`, 'try'); } })); focusSoon('[data-emotion]');
  }

  function storyPool() {
    if (stage === 'junior' || stage === 'senior') return HIGHER_STORIES;
    return stage === 'upper' ? STORIES : STORIES.slice(0, 3);
  }

  function teacherDialogue(item) {
    const teacher = item.teacher || { open: '這個情境中，誰可能受到影響？', wait: '學生可以指一指情緒卡、選一個選項，或請教師代讀。', model: '教師可示範：「我先停一停，再想一個尊重的下一步。」', close: '一起練習一句短而清楚的下一步。' };
    const panelId = `storyTeacherPanel-${state.index}`;
    return `<section class="story-teacher" aria-label="教師引導對話框"><button id="storyTeacherToggle" class="story-teacher-toggle" type="button" aria-expanded="false" aria-controls="${panelId}">🗣 教師引導對話框</button><div id="${panelId}" class="story-teacher-panel" hidden><strong>先問一問</strong><p>${teacher.open}</p><strong>學生可以怎樣回應</strong><p>${teacher.wait}</p><strong>可示範的短句</strong><p>${teacher.model}</p><strong>最後收束</strong><p>${teacher.close}</p></div></section>`;
  }

  function bindTeacherDialogue() {
    q('#storyTeacherToggle')?.addEventListener('click', () => {
      const button = q('#storyTeacherToggle'); const panel = q(`#${button?.getAttribute('aria-controls')}`); if (!button || !panel) return;
      const opening = panel.hidden; panel.hidden = !opening; button.setAttribute('aria-expanded', String(opening)); button.textContent = opening ? '▾ 收起教師引導對話框' : '🗣 教師引導對話框';
      if (opening) feedback('教師引導對話框已展開；可先選一個追問，不需要一次完成所有問題。');
    });
  }

  function renderStory() {
    const pool = storyPool(); state.storyOrder ||= shuffle(pool); const item = state.storyOrder[state.index % state.storyOrder.length]; state.answer = item.answer;
    const isHigher = stage === 'junior' || stage === 'senior';
    shell(`${top(GAMES.story.title, '這不是猜別人唯一的想法；我們一起從情境找一個可能感受和尊重的下一步。', `${currentGrade().label} · ${state.index + 1} / ${state.total}`)}${progress()}<article class="story-card" data-story-level="${isHigher ? 'higher' : 'primary'}"><span>${isHigher ? '高年級生活情境' : '校園小故事'}</span><p>${item.context}</p><strong>${item.question}</strong></article><div class="asd-rule">先想一想這件事可能帶來甚麼感受或影響，再選擇最有幫助的回應。</div>${teacherDialogue(item)}<div class="asd-choice-grid">${shuffle(item.options).map((choice) => `<button type="button" class="asd-choice" data-story="${choice}">${choice}</button>`).join('')}</div><div id="asdLabFeedback" class="asd-feedback" role="status" aria-live="polite" aria-atomic="true">先讀情境；不確定時可以請教師一起讀一遍或打開教師引導對話框。</div>`);
    bindTeacherDialogue(); qa('[data-story]').forEach((button) => button.addEventListener('click', () => { if (button.dataset.story === item.answer) { state.correct += 1; state.tries += 1; feedback(`✓ ${item.why} 可以嘗試說：「${item.next}」`, 'ok', 'story'); wait(() => next(renderStory), 1050); } else { state.tries += 1; feedback(`↗ 先想一想：${item.why}`, 'try'); } })); focusSoon('[data-story]');
  }

  function renderJoint() {
    const directions = ['left', 'right', 'up', 'down']; const labels = { left: '左邊', right: '右邊', up: '上面', down: '下面' }; const mode = currentGrade().jointMode || 'basic';
    const direction = directions[(state.index + Math.floor(Math.random() * directions.length)) % directions.length]; const handDirection = mode === 'conflict' ? directions[(directions.indexOf(direction) + 1 + state.index) % directions.length] : direction;
    if (mode === 'basic') {
      state.answer = direction;
      const boxes = shuffle(directions.slice(0, currentGrade().jointTargets)); if (!boxes.includes(direction)) boxes[0] = direction;
      shell(`${top(GAMES.joint.title, '跟隨機器人的眼神和手勢，找同一個方向的寶箱。', `${currentGrade().label} · ${state.index + 1} / ${state.total}`)}${progress()}<div class="asd-rule">機器人正在看向<strong>${labels[direction]}</strong>。先看眼睛和手，再找同一方向的寶箱。</div><div class="joint-board"><button type="button" class="joint-box up" data-joint="up" aria-label="上面寶箱">🎁</button><button type="button" class="joint-box left" data-joint="left" aria-label="左邊寶箱">🎁</button><div class="joint-robot gaze-${direction}" aria-label="機器人看向${labels[direction]}"><span class="joint-eye one"></span><span class="joint-eye two"></span><span class="joint-hand">☞</span></div><button type="button" class="joint-box right" data-joint="right" aria-label="右邊寶箱">🎁</button><button type="button" class="joint-box down" data-joint="down" aria-label="下面寶箱">🎁</button></div><div id="asdLabFeedback" class="asd-feedback" role="status" aria-live="polite" aria-atomic="true">慢慢看指向；不需要快。</div>`);
      qa('[data-joint]').forEach((button) => { if (!boxes.includes(button.dataset.joint)) button.disabled = true; button.addEventListener('click', () => { if (button.dataset.joint === state.answer) { state.correct += 1; state.tries += 1; feedback(`✓ 你和機器人一起看向${labels[direction]}。`, 'ok', 'joint'); wait(() => next(renderJoint), 720); } else { state.tries += 1; feedback('↗ 再看看機器人的眼睛和手，慢慢找方向。', 'try'); } }); }); focusSoon(`[data-joint="${direction}"]`); return;
    }
    const features = [{ id: 'star', icon: '⭐', label: '星形' }, { id: 'leaf', icon: '🍃', label: '葉形' }, { id: 'orbit', icon: '🪐', label: '環形' }]; const target = features[(state.index + directions.indexOf(direction)) % features.length]; const visibleFeatures = mode === 'conflict' ? features : [target, features[(features.indexOf(target) + 1) % features.length]];
    state.answer = `${direction}-${target.id}`; const cueLevel = mode === 'conflict' ? '高中複合線索 · 先眼神、後手勢' : '初中複合線索 · 方向＋特徵'; const hint = mode === 'conflict' ? `先跟眼睛看向${labels[direction]}；手勢正在指向${labels[handDirection]}，它是干擾線索。最後找${target.label}寶箱。` : `跟眼睛和手看向${labels[direction]}，再找${target.label}寶箱。`;
    const slotMarkup = (slot) => `<div class="joint-slot ${slot}" aria-label="${labels[slot]}的寶箱選項">${shuffle(visibleFeatures).map((feature) => `<button type="button" class="joint-token" data-joint="${slot}-${feature.id}" aria-label="${labels[slot]}的${feature.label}寶箱"><span aria-hidden="true">${feature.icon}</span><small>${feature.label}</small></button>`).join('')}</div>`;
    shell(`${top(GAMES.joint.title, '高年級版本需要把方向線索和寶箱特徵合起來判讀。所有線索會一直留在畫面上，不需要趕時間。', `${currentGrade().label} · ${state.index + 1} / ${state.total} · ${cueLevel}`)}${progress()}<div class="asd-rule"><strong>逐步判讀：</strong>${hint}</div><section class="joint-composite-clues" aria-label="本回合複合視覺線索"><div class="joint-clue-card"><span aria-hidden="true">👁️</span><b>眼神</b><p>看向${labels[direction]}</p></div><div class="joint-clue-card ${mode === 'conflict' ? 'distractor' : ''}"><span aria-hidden="true">☞</span><b>手勢${mode === 'conflict' ? '（干擾）' : ''}</b><p>指向${labels[handDirection]}</p></div><div class="joint-clue-card target"><span aria-hidden="true">🏷️</span><b>指示牌</b><p>找${target.label}寶箱</p></div></section><div class="joint-composite-board"><div class="joint-composite-robot gaze-${direction} hand-${handDirection}" aria-label="機器人眼神看向${labels[direction]}，手勢指向${labels[handDirection]}"><span class="joint-eye one"></span><span class="joint-eye two"></span><span class="joint-hand">☞</span></div>${directions.map(slotMarkup).join('')}</div><div id="asdLabFeedback" class="asd-feedback" role="status" aria-live="polite" aria-atomic="true">先讀三個線索，再選擇方向和特徵都相同的寶箱。</div>`);
    qa('[data-joint]').forEach((button) => button.addEventListener('click', () => { if (button.dataset.joint === state.answer) { state.correct += 1; state.tries += 1; feedback(`✓ 對了：眼神的${labels[direction]}，加上${target.label}寶箱。`, 'ok', 'joint'); wait(() => next(renderJoint), 820); } else { state.tries += 1; feedback(`↗ ${hint} 不用急，先只找第一步「眼神」。`, 'try'); } })); focusSoon(`[data-joint="${state.answer}"]`);
  }

  function renderVisual() {
    const item = VISUALS[state.index % VISUALS.length]; const isWhole = currentGrade().visualMode === 'switch' && state.index % 2 === 1; state.answer = isWhole ? item.whole : item.answer;
    const answers = isWhole ? shuffle([item.whole, item.detail, 'E']) : shuffle(item.options);
    shell(`${top(GAMES.visual.title, '每一回合只需做一件事：找細節，或看整個大字。', `${currentGrade().label} · ${state.index + 1} / ${state.total}`)}${progress()}<div class="asd-rule">${isWhole ? '這一回合看「全圖」：請找出由小字組成的大字。' : `這一回合找「細節」：在圖案列中找出 ${item.target}。`}</div><div class="visual-stage">${isWhole ? `<div class="navon-letter" aria-label="由小字 ${item.detail} 組成的大字 ${item.whole}"><strong>${item.whole}</strong><span>由很多小 ${item.detail} 組成</span></div>` : `<div class="embedded-scene" aria-label="複雜圖案列">${item.scene}</div>`}</div><div class="asd-choice-grid">${answers.map((choice) => `<button type="button" class="asd-choice" data-visual="${choice}">${choice}</button>`).join('')}</div><div id="asdLabFeedback" class="asd-feedback" role="status" aria-live="polite" aria-atomic="true">先確認這一回合是找細節，還是看全圖。</div>`);
    qa('[data-visual]').forEach((button) => button.addEventListener('click', () => { if (button.dataset.visual === state.answer) { state.correct += 1; state.tries += 1; feedback(isWhole ? `✓ 對了，大字是 ${item.whole}。` : `✓ 對了，你找到了 ${item.target}。`, 'ok'); wait(() => next(renderVisual), 720); } else { state.tries += 1; feedback(isWhole ? '↗ 先把眼睛放遠一點，看整個大字。' : `↗ 再慢慢找一次 ${item.target}。`, 'try'); } })); focusSoon('[data-visual]');
  }

  function playEnvironment(id) {
    if (!preferences.sound) { note('回饋聲目前關閉。可看提示來選擇，不需要播放聲音。'); return; }
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); if (audioContext.state === 'suspended') audioContext.resume();
      const now = audioContext.currentTime; const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain(); oscillator.type = id === 'bus' || id === 'vacuum' ? 'sine' : 'triangle'; oscillator.frequency.value = id === 'bell' ? 880 : id === 'birds' ? 760 : id === 'bus' ? 110 : id === 'vacuum' ? 180 : 420;
      gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.018, now + .05); gain.gain.exponentialRampToValueAtTime(.0001, now + (id === 'rain' || id === 'vacuum' ? .85 : .38)); oscillator.connect(gain).connect(audioContext.destination); oscillator.start(now); oscillator.stop(now + (id === 'rain' || id === 'vacuum' ? .9 : .42));
      feedback('聲音已播放一次。若不舒服可立即按「先停一停」或不播放聲音。');
    } catch {}
  }

  function drawCalm(timestamp = 0) {
    const canvas = q('#calmCanvas'); if (!canvas || !state?.calm) return; const ctx = canvas.getContext('2d'); const width = canvas.width; const height = canvas.height; const t = timestamp / 1000;
    const gradient = ctx.createLinearGradient(0, 0, width, height); gradient.addColorStop(0, '#eff8ff'); gradient.addColorStop(1, '#e7fff5'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 5; index += 1) { ctx.beginPath(); ctx.strokeStyle = `rgba(71,143,194,${.16 + index * .04})`; ctx.lineWidth = 7; for (let x = 0; x <= width; x += 12) { const y = 82 + index * 45 + Math.sin(x / 68 + t * .65 + index) * 12; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    animationFrame = window.requestAnimationFrame(drawCalm);
  }

  function renderSensory() {
    const pool = SOUNDS.slice(0, currentGrade().sensoryCount); const item = pool[state.index % pool.length]; state.answer = item.id; state.calm = false;
    shell(`${top(GAMES.sensory.title, '你可以選擇播放一次可預期的短聲音，或不播放而看文字提示。', `${currentGrade().label} · ${state.index + 1} / ${state.total}`)}${progress()}<div class="asd-rule">聲音必須由你按下播放才會出現；不想聽時，直接看提示：${item.hint}</div><section class="sensory-stage"><button id="asdPlaySound" class="sensory-play" type="button">🔊 播放一次聲音</button><button id="asdNoSound" class="asd-secondary" type="button">👁 不播放聲音，給我提示</button><button id="asdCalmOpen" class="asd-secondary" type="button">🌊 先進入安靜流動畫面</button><div id="calmWrap" hidden><canvas id="calmCanvas" width="620" height="300" role="img" aria-label="柔和、緩慢流動的安靜畫面，沒有閃爍內容"></canvas><button id="asdCalmBack" class="asd-secondary" type="button">回到配對</button></div></section><div class="asd-choice-grid sensory-choices">${shuffle(pool).map((sound) => `<button type="button" class="asd-choice" data-sound="${sound.id}"><span aria-hidden="true">${sound.icon}</span>${sound.label}</button>`).join('')}</div><div id="asdLabFeedback" class="asd-feedback" role="status" aria-live="polite" aria-atomic="true">可先播放一次，或看提示後慢慢選擇圖卡。</div>`);
    q('#asdPlaySound')?.addEventListener('click', () => playEnvironment(item.id)); q('#asdNoSound')?.addEventListener('click', () => feedback(`提示：${item.hint}`)); q('#asdCalmOpen')?.addEventListener('click', () => { state.calm = true; q('#calmWrap').hidden = false; drawCalm(); feedback('現在是安靜流動畫面；不需要作答。準備好時可回到配對。'); }); q('#asdCalmBack')?.addEventListener('click', () => { state.calm = false; if (animationFrame) window.cancelAnimationFrame(animationFrame); animationFrame = null; q('#calmWrap').hidden = true; feedback('已回到配對。可以慢慢選擇圖卡。'); });
    qa('[data-sound]').forEach((button) => button.addEventListener('click', () => { if (button.dataset.sound === item.id) { state.correct += 1; state.tries += 1; feedback(`✓ 對了，這是${item.label}。${item.hint}`, 'ok', 'calm'); wait(() => next(renderSensory), 850); } else { state.tries += 1; feedback(`↗ 可以再聽一次，或看提示：${item.hint}`, 'try'); } })); focusSoon('#asdPlaySound');
  }

  function beginSoundFree() { if (!preferences.sound) note('本遊戲不會自動播放聲音；要聽時請由學生或教師按播放。'); }

  function begin(game) {
    clearTimers(); state = { game, stars: 0, index: 0, total: currentGrade().rounds, correct: 0, tries: 0, keyHandler: null }; beginSoundFree();
    if (game === 'emotion') renderEmotion(); if (game === 'story') renderStory(); if (game === 'joint') renderJoint(); if (game === 'visual') renderVisual(); if (game === 'sensory') renderSensory();
  }

  function handleKeyboard(event) {
    if (!host) return; if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key === 'Tab') { const controls = focusable(); const first = controls[0]; const last = controls.at(-1); if (first && last && event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (first && last && !event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
  }

  function close({ restoreFocus = true } = {}) { clearTimers(); document.removeEventListener('keydown', handleKeyboard); const target = returnFocus; host?.remove(); host = null; state = null; returnFocus = null; if (restoreFocus && target?.isConnected) window.requestAnimationFrame(() => target.focus()); }

  function injectStyles() {
    if (document.getElementById('asd-core-lab-styles')) return;
    const style = document.createElement('style'); style.id = 'asd-core-lab-styles'; style.textContent = `
      .asd-core-shell{position:fixed;inset:0;z-index:1110;display:grid;place-items:center;padding:16px;background:rgba(18,42,65,.66);backdrop-filter:blur(7px)}.asd-lab{position:relative;width:min(930px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,30px);border:1px solid rgba(255,255,255,.9);border-radius:28px;background:radial-gradient(circle at 94% 3%,#e1fff0 0,transparent 22%),linear-gradient(145deg,#fffefa,#f4fbff);box-shadow:0 24px 70px rgba(9,24,52,.4);color:#25405b}.asd-top{display:flex;justify-content:space-between;gap:15px;align-items:flex-start}.asd-top h2{margin:5px 0 7px;color:#1f405b;font-size:clamp(25px,4.2vw,36px);line-height:1.12}.asd-top p{max-width:690px;margin:0;color:#5b758b;font-size:14px;line-height:1.6}.asd-eyebrow{color:#14766a;font-size:11px;font-weight:900;letter-spacing:.1em}.asd-close{width:44px;min-width:44px;height:44px;border:0;border-radius:50%;background:#e8f1f5;color:#375b70;font-size:24px;font-weight:900}.asd-game-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px;margin-top:23px}.asd-game-card{min-height:170px;padding:17px;display:flex;flex-direction:column;align-items:flex-start;border:2px solid #d7e6ea;border-radius:20px;background:#fff;color:#274963;text-align:left;transition:transform .16s,border-color .16s,box-shadow .16s}.asd-game-card:hover{transform:translateY(-2px);border-color:#299e87;box-shadow:0 12px 24px rgba(42,112,128,.12)}.asd-game-card>span{font-size:31px}.asd-game-card strong{margin-top:10px;font-size:18px}.asd-game-card small{margin-top:3px;color:#167565;font-weight:850}.asd-game-card p{margin:8px 0;color:#637b8c;font-size:12px;line-height:1.5}.asd-game-card em{margin-top:auto;color:#54727d;font-size:11px;font-style:normal;font-weight:850}.asd-low-pressure,.asd-rule{margin-top:18px;padding:13px 15px;border-left:4px solid #2a9c87;border-radius:12px;background:#eefbf6;color:#265f56;font-size:13px;line-height:1.55}.asd-low-pressure strong{display:block}.asd-low-pressure span{display:block;margin-top:3px}.asd-progress{height:10px;margin-top:19px;overflow:hidden;border-radius:999px;background:#e5eef3}.asd-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#2fa98f,#58aee3);transition:width .2s}.asd-ready{display:grid;grid-template-columns:auto minmax(0,1fr);gap:18px;align-items:start;margin-top:22px;padding:20px;border:2px solid #ccebe2;border-radius:22px;background:linear-gradient(135deg,#f1fcf7,#fffaf0)}.asd-ready-icon{display:grid;place-items:center;width:76px;height:76px;border-radius:23px;background:#dff5ec;font-size:40px}.asd-ready p{margin:0;color:#16806e;font-size:11px;font-weight:900;letter-spacing:.08em}.asd-ready h3{margin:4px 0 10px;color:#315a68;font-size:23px}.asd-ready ol{display:grid;gap:8px;margin:0;padding-left:23px;color:#4b6c78;font-size:14px;line-height:1.5}.asd-ready li::marker{color:#218e7b;font-weight:950}.asd-ready small{display:block;margin-top:13px;padding:10px 12px;border-radius:12px;background:#fff;color:#6c633f;font-size:12px;line-height:1.55}.asd-actions{display:flex;justify-content:center;gap:10px;margin-top:18px}.asd-primary,.asd-secondary{min-height:48px;padding:0 18px;border-radius:14px;font-size:14px;font-weight:900}.asd-primary{border:0;background:#188d7b;color:#fff}.asd-secondary{border:1px solid #cbdce2;background:#fff;color:#4f6d7c}.asd-feedback{min-height:28px;margin:16px auto 0;color:#5b7485;text-align:center;font-size:14px;font-weight:850;line-height:1.5}.asd-feedback.ok{color:#16755f}.asd-feedback.try{color:#ad4355}.asd-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;max-width:660px;margin:18px auto 0}.asd-choice{min-height:58px;padding:10px;border:2px solid #c5dce3;border-radius:16px;background:#fff;color:#31556a;font-size:15px;font-weight:900}.asd-choice:hover{border-color:#268f7f;background:#f2fcf8}.emotion-stage{display:grid;justify-items:center;gap:10px;margin-top:18px;color:#587183;font-size:13px;font-weight:800}.robot-face{position:relative;width:178px;height:150px;border:8px solid #5c8cb2;border-radius:42px;background:#eaf5ff;box-shadow:inset 0 -12px 0 rgba(87,155,198,.16)}.robot-face .antenna{position:absolute;top:-43px;left:70px;color:#58a997;font-size:46px}.robot-face .eye{position:absolute;top:48px;width:22px;height:25px;border-radius:50%;background:#274967}.robot-face .eye.left{left:40px}.robot-face .eye.right{right:40px}.robot-face .brow{position:absolute;top:35px;width:35px;height:7px;border-radius:9px;background:#365a75}.robot-face .brow.left{left:32px}.robot-face .brow.right{right:32px}.robot-face .mouth{position:absolute;bottom:27px;left:59px;width:55px;height:22px;border-bottom:8px solid #365a75;border-radius:0 0 60px 60px}.robot-face.sad .mouth,.robot-face.worried .mouth{bottom:20px;border-bottom:0;border-top:8px solid #365a75;border-radius:60px 60px 0 0}.robot-face.angry .brow.left{transform:rotate(18deg)}.robot-face.angry .brow.right{transform:rotate(-18deg)}.robot-face.scared .eye,.robot-face.surprised .eye{width:29px;height:35px;top:42px}.robot-face.scared .mouth,.robot-face.surprised .mouth{left:69px;width:34px;height:35px;border:8px solid #365a75;border-radius:50%}.robot-face.happy .mouth{height:28px}.robot-face.eyes-only .mouth{opacity:.13}.robot-face.eyes-only .brow{opacity:1}.robot-face.mouth-only .eye,.robot-face.mouth-only .brow{opacity:.13}.story-card{margin-top:18px;padding:17px;border-radius:19px;background:#fff7e7;color:#65511b}.story-card span{color:#a36c11;font-size:11px;font-weight:900}.story-card p{margin:7px 0 12px;font-size:16px;line-height:1.55}.joint-board{display:grid;grid-template-columns:1fr 1.25fr 1fr;grid-template-rows:70px 150px 70px;align-items:center;justify-items:center;gap:9px;max-width:600px;margin:18px auto}.joint-box{display:grid;place-items:center;width:76px;height:62px;border:2px solid #c8dde2;border-radius:18px;background:#fff;font-size:32px}.joint-box.up{grid-column:2;grid-row:1}.joint-box.left{grid-column:1;grid-row:2}.joint-box.right{grid-column:3;grid-row:2}.joint-box.down{grid-column:2;grid-row:3}.joint-robot{position:relative;grid-column:2;grid-row:2;width:128px;height:112px;border:7px solid #598db1;border-radius:36px;background:#eaf5ff}.joint-eye{position:absolute;top:39px;width:20px;height:23px;border-radius:50%;background:#264b68}.joint-eye.one{left:29px}.joint-eye.two{right:29px}.joint-hand{position:absolute;right:-40px;top:45px;color:#3e7e9b;font-size:36px}.joint-robot.gaze-left .joint-eye{transform:translateX(-6px)}.joint-robot.gaze-right .joint-eye{transform:translateX(6px)}.joint-robot.gaze-up .joint-eye{transform:translateY(-5px)}.joint-robot.gaze-down .joint-eye{transform:translateY(5px)}.joint-robot.gaze-left .joint-hand{left:-40px;right:auto;transform:scaleX(-1)}.joint-robot.gaze-up .joint-hand{top:-40px;right:43px;transform:rotate(-90deg)}.joint-robot.gaze-down .joint-hand{top:88px;right:43px;transform:rotate(90deg)}.visual-stage{display:grid;place-items:center;min-height:160px;margin-top:18px;border-radius:23px;background:#f6fbfd}.embedded-scene{padding:22px;color:#2d6f86;font-size:clamp(34px,9vw,70px);letter-spacing:.13em}.navon-letter{display:grid;justify-items:center;color:#2d7b8c}.navon-letter strong{font-family:serif;font-size:120px;line-height:.8;text-shadow:7px 0 #c5ebe1,-7px 0 #c5ebe1}.navon-letter span{margin-top:11px;font-size:13px;font-weight:850}.sensory-stage{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:18px}.sensory-play{min-height:54px;padding:0 18px;border:0;border-radius:17px;background:#3a83b9;color:#fff;font-size:15px;font-weight:900}.sensory-choices .asd-choice span{display:block;font-size:25px}.asd-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin-top:23px}.asd-summary div{padding:16px 10px;border-radius:17px;background:#fff;text-align:center;box-shadow:0 8px 18px rgba(48,73,105,.08)}.asd-summary span{display:block;color:#73849b;font-size:11px;font-weight:800}.asd-summary strong{display:block;margin-top:5px;color:#304f60;font-size:27px}.asd-tray{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:22px;padding:12px 14px;border:1px solid #d7e7e8;border-radius:18px;background:linear-gradient(110deg,#f7fffc,#f7fbff)}.asd-stars{display:flex;align-items:center;gap:8px;color:#356c61;white-space:nowrap}.asd-stars span{color:#d49d22;font-size:20px;letter-spacing:1px}.asd-stars strong{font-size:11px}.asd-stars.earned{animation:asd-star-pop .42s cubic-bezier(.23,1,.32,1)}.asd-tools{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:7px}.asd-tools button{min-height:38px;padding:0 10px;border:1px solid #cbdde2;border-radius:11px;background:#fff;color:#4c6d7c;font-size:11px;font-weight:850}.asd-tools button[aria-pressed="true"]{border-color:#328b7d;background:#effbf6;color:#21675c}.asd-support-note{position:absolute;right:12px;bottom:calc(100% + 8px);z-index:3;max-width:430px;padding:10px 12px;border:1px solid #b7ddd3;border-radius:13px;background:#fff;color:#356c61;box-shadow:0 10px 24px rgba(48,73,105,.16);font-size:12px;font-weight:760;line-height:1.55}.asd-support-note span{display:flex;gap:6px;margin-top:8px}.asd-support-note button{min-height:34px;padding:0 9px;border:1px solid #a8d0c5;border-radius:9px;background:#f1fbf7;color:#2b6c5e;font-size:11px;font-weight:850}.asd-reward{position:absolute;z-index:5;top:30%;left:50%;width:180px;height:120px;pointer-events:none;transform:translateX(-50%)}.asd-reward span{position:absolute;top:42%;left:50%;font-size:27px;animation:asd-float .82s var(--delay) ease-out both}.asd-reward span:nth-child(1){--x:-55px;--y:-48px}.asd-reward span:nth-child(2){--x:2px;--y:-70px}.asd-reward span:nth-child(3){--x:54px;--y:-32px}.asd-reward span:nth-child(4){--x:-40px;--y:25px}.asd-reward .finish{font-size:31px}.highlight{outline:4px solid rgba(47,169,143,.46);outline-offset:4px;animation:asd-rule-pulse .85s ease-out}@keyframes asd-star-pop{50%{transform:scale(1.16)}}@keyframes asd-float{0%{opacity:0;transform:translate(-50%,-50%) scale(.72)}28%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(1.12)}}@keyframes asd-rule-pulse{0%{outline-color:rgba(47,169,143,.66)}100%{outline-color:rgba(47,169,143,0)}}.asd-lab button:focus-visible{outline:4px solid #0d5f9c;outline-offset:3px}.asd-lab button:disabled{opacity:.48}.asd-game-card:active,.asd-primary:active,.asd-secondary:active,.asd-choice:active{transform:scale(.97)}@media(max-width:640px){.asd-lab{padding:19px}.asd-game-grid,.asd-choice-grid{grid-template-columns:1fr}.asd-ready{grid-template-columns:1fr}.asd-ready-icon{width:62px;height:62px;font-size:33px}.asd-actions{flex-direction:column}.asd-primary,.asd-secondary{width:100%}.asd-summary{grid-template-columns:1fr}.asd-tray{align-items:flex-start;flex-direction:column}.asd-tools{justify-content:flex-start}.asd-tools button{min-height:40px}.asd-support-note{right:8px;left:8px;max-width:none}.joint-board{transform:scale(.9);margin:5px auto}.sensory-stage{align-items:stretch}.sensory-stage>*{width:100%}}@media(prefers-reduced-motion:reduce){.asd-game-card,.asd-progress i{transition:none!important}.asd-stars.earned,.asd-reward span,.highlight{animation:none!important}}
    `; style.textContent += `.story-teacher{max-width:660px;margin:14px auto 0;border:1px solid #d8e5eb;border-radius:16px;background:#f8fcff}.story-teacher-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:48px;padding:11px 14px;border:0;border-radius:inherit;background:transparent;color:#285f72;text-align:left;font-size:14px;font-weight:900}.story-teacher-toggle:hover{background:#eef8fb}.story-teacher-panel{padding:2px 15px 15px;border-top:1px solid #dbe8ec;color:#4c6876;font-size:13px;line-height:1.55}.story-teacher-panel strong{display:block;margin-top:12px;color:#167565;font-size:12px}.story-teacher-panel p{margin:3px 0 0}.story-card[data-story-level="higher"]{border:1px solid #f0ca78;background:linear-gradient(135deg,#fff7e6,#fffdf8)}.joint-composite-clues{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;max-width:760px;margin:18px auto 0}.joint-clue-card{padding:11px;border:1px solid #cbe1e7;border-radius:15px;background:#f8fcff;text-align:center;color:#315d72}.joint-clue-card span{font-size:23px}.joint-clue-card b,.joint-clue-card p{display:block}.joint-clue-card b{margin-top:3px;font-size:12px}.joint-clue-card p{margin:3px 0 0;font-size:12px;line-height:1.4}.joint-clue-card.target{border-color:#b8dec7;background:#f2fbf5}.joint-clue-card.distractor{border-color:#eccf9d;background:#fff8ea}.joint-composite-board{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(86px,auto));align-items:center;gap:10px;max-width:760px;margin:17px auto}.joint-slot{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.joint-slot.up{grid-column:2;grid-row:1}.joint-slot.left{grid-column:1;grid-row:2}.joint-slot.right{grid-column:3;grid-row:2}.joint-slot.down{grid-column:2;grid-row:3}.joint-token{display:grid;place-items:center;gap:2px;min-width:66px;min-height:68px;padding:7px;border:2px solid #c8dde2;border-radius:16px;background:#fff;color:#31556a}.joint-token:hover{border-color:#268f7f;background:#f2fcf8}.joint-token span{font-size:24px}.joint-token small{font-size:11px;font-weight:900}.joint-composite-robot{position:relative;display:grid;place-items:center;grid-column:2;grid-row:2;width:128px;height:112px;justify-self:center;border:7px solid #598db1;border-radius:36px;background:#eaf5ff}.joint-composite-robot .joint-eye{position:absolute;top:39px;width:20px;height:23px;border-radius:50%;background:#264b68}.joint-composite-robot .joint-eye.one{left:29px}.joint-composite-robot .joint-eye.two{right:29px}.joint-composite-robot .joint-hand{position:absolute;right:-40px;top:45px;color:#3e7e9b;font-size:36px}.joint-composite-robot.gaze-left .joint-eye{transform:translateX(-6px)}.joint-composite-robot.gaze-right .joint-eye{transform:translateX(6px)}.joint-composite-robot.gaze-up .joint-eye{transform:translateY(-5px)}.joint-composite-robot.gaze-down .joint-eye{transform:translateY(5px)}.joint-composite-robot.hand-left .joint-hand{left:-40px;right:auto;transform:scaleX(-1)}.joint-composite-robot.hand-up .joint-hand{top:-40px;right:43px;transform:rotate(-90deg)}.joint-composite-robot.hand-down .joint-hand{top:88px;right:43px;transform:rotate(90deg)}@media(max-width:640px){.story-teacher-toggle{min-height:46px}.story-teacher-panel{font-size:13px}.joint-composite-clues{grid-template-columns:1fr}.joint-composite-board{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto}.joint-slot.up,.joint-slot.left,.joint-slot.right,.joint-slot.down{grid-column:auto;grid-row:auto}.joint-composite-robot{grid-column:1 / -1;grid-row:auto;order:-1}.joint-token{min-width:61px;min-height:62px}}`; document.head.appendChild(style);
  }

  window.ASD_CORE_LAB = { open(nextOptions = {}) { close({ restoreFocus: false }); options = nextOptions; stage = GRADE[nextOptions.stage] ? nextOptions.stage : 'lower'; returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null; injectStyles(); host = document.createElement('div'); host.id = 'asdCoreLabRoot'; document.body.appendChild(host); document.addEventListener('keydown', handleKeyboard); renderMenu(); } };
})();
