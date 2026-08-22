(function () {
  const item = (lead, context, prompt, answer, choices, hint) => ({ lead, context, prompt, answer, choices, hint });
  const activities = {
    polysemy: {
      icon: '⚔️', title: '文言一詞多義對決', description: '根據上下文辨析文言實詞的詞性和意思。', focus: '文言字義與語境轉換', accent: 'violet',
      rounds: [
        item('「過」', '「及魯肅過尋陽」', '「過」在句中最接近哪個意思？', '經過、到訪', ['經過、到訪', '超越', '過錯'], '人物到達某地拜訪，這裡的「過」是經過或到訪。'),
        item('「過」', '「以其境過清，不可久居」', '「過」在「過清」中最接近哪個意思？', '過分、太', ['過分、太', '走過', '過失'], '「過清」是清冷得太過分，表示程度。'),
        item('「過」', '「人誰無過？過而能改，善莫大焉」', '第二個「過」最接近哪個意思？', '過錯', ['過錯', '經過', '超過'], '能改的「過」是人犯下的過錯。'),
        item('「之」', '「水陸草木之花，可愛者甚蕃」', '「之」在句中最接近哪個作用？', '的', ['的', '到、往', '他、它'], '「草木之花」可理解為草木的花，表示修飾關係。'),
        item('「之」', '「輟耕之壟上」', '「之」在句中最接近哪個意思？', '到、往', ['到、往', '的', '取消'], '動作「輟耕」後是到壟上去，「之」有前往的意思。'),
        item('「之」', '「友人慚，下車引之」', '「之」指代甚麼？', '那位友人', ['那位友人', '那輛車', '羞愧的感覺'], '「引之」是拉友人上車；「之」代替前文的人。'),
        item('「卒」', '「卒獲有所聞」', '「卒」在句中最接近哪個意思？', '最終、終於', ['最終、終於', '士兵', '死亡'], '「卒獲」表示最後終於得到收穫。'),
        item('「顧」', '「元方入門不顧」', '「顧」在句中最接近哪個意思？', '回頭看', ['回頭看', '照顧', '拜訪'], '入門後「不顧」是沒有回頭看對方。'),
        item('「假」', '「每假借於藏書之家」', '「假」在句中最接近哪個意思？', '借', ['借', '假裝', '假期'], '「假借」就是向有書的人借書。'),
        item('「兵」', '「兵革非不堅利也」', '「兵」在句中最接近哪個意思？', '兵器', ['兵器', '士兵', '戰爭'], '「兵革」並列兵器和甲革，重點是武器裝備。')
      ]
    },
    loan: {
      icon: '🔗', title: '通假字配對連線', description: '把文言通假字還原為本字，再以語境確認字義。', focus: '通假字與字形還原', accent: 'teal',
      rounds: [
        item('通假字「女」', '「女知之乎？」', '「女」應配對哪一個本字？', '汝', ['汝', '如', '乳'], '古文中的「女」常通「汝」，意思是你。'),
        item('通假字「說」', '「學而時習之，不亦說乎？」', '「說」應配對哪一個本字？', '悅', ['悅', '閱', '脫'], '「不亦說乎」是感到喜悅，因此通「悅」。'),
        item('通假字「知」', '「孰為汝多知乎？」', '「知」應配對哪一個本字？', '智', ['智', '志', '至'], '這裡說的是智慧、聰明，通「智」。'),
        item('通假字「反」', '「寒暑易節，始一反焉」', '「反」應配對哪一個本字？', '返', ['返', '反', '翻'], '回去一次的「反」通「返」。'),
        item('通假字「被」', '「將軍身被堅執銳」', '「被」應配對哪一個本字？', '披', ['披', '備', '彼'], '身上披著堅甲、手持利器，通「披」。'),
        item('通假字「要」', '「便要還家，設酒殺雞作食」', '「要」應配對哪一個本字？', '邀', ['邀', '腰', '約'], '把漁人邀請回家，通「邀」。'),
        item('通假字「早」', '「旦日不可不蚤自來謝項王」', '「蚤」應配對哪一個本字？', '早', ['早', '找', '造'], '「蚤自來」就是早些親自前來。'),
        item('通假字「曾」', '「曾益其所不能」', '「曾」應配對哪一個本字？', '增', ['增', '曾', '贈'], '增加他原來不能做到的部分，通「增」。'),
        item('通假字「縣」', '「胡不見我於王？何為顛倒衣裳，以見君乎？」', '「縣」在「縣令」以外，若表示掛起時應配對哪字？', '懸', ['懸', '現', '選'], '表示掛起時，「縣」通「懸」，需依語境還原。'),
        item('通假字「具」', '「此人一一為具言所聞」', '「具」應配對哪一個本字？', '俱', ['俱', '具', '矩'], '「一一為具言」是把聽聞的事全都說出，通「俱」。')
      ]
    },
    argument: {
      icon: '🧠', title: '論證三要素拼圖', description: '辨識論點、論據與論證方式，建立清晰論述骨架。', focus: '論證結構與寫作邏輯', accent: 'orange',
      rounds: [
        item('閱讀微型論證', '「學校應增設飲水機，因為學生在運動後需要方便補充水分。」', '「學校應增設飲水機」屬於哪一項？', '論點', ['論點', '論據', '論證方式'], '作者希望讀者接受的主張，就是論點。'),
        item('閱讀微型論證', '「調查顯示，七成學生每天自備水樽。」', '「七成學生」的調查結果屬於哪一項？', '論據', ['論據', '論點', '結論標題'], '用數字或事實支持看法的材料，是論據。'),
        item('閱讀微型論證', '「若設置安靜角，同學便可在小息短暫閱讀，因此能改善課室學習氣氛。」', '作者主要採用哪種論證方式？', '因果推論', ['因果推論', '人物描寫', '時間排序'], '先提出措施，再說明帶來的結果，是因果推論。'),
        item('閱讀微型論證', '「本班上月減少列印後，紙張用量下降三成，因此其他班也可參考。」', '「紙張用量下降三成」屬於哪一項？', '論據', ['論據', '論點', '修辭名稱'], '具體數字是用來支持建議的事實依據。'),
        item('閱讀微型論證', '「我認為閱讀前先看標題，能幫助讀者預測內容。」', '「我認為……」後的主張屬於哪一項？', '論點', ['論點', '論據', '反例'], '作者表明希望成立的看法，是論點。'),
        item('閱讀微型論證', '「例如，做專題時先列問題，可避免搜尋資料時離題。」', '作者主要採用哪種論證方式？', '舉例說明', ['舉例說明', '對比反駁', '設問開場'], '「例如」引出具體情況來說明主張。'),
        item('閱讀微型論證', '「兩種方案中，方案甲成本較低，方案乙成效較快。」', '這段文字主要採用哪種論證方式？', '比較對照', ['比較對照', '引用名言', '因果推論'], '把兩個方案放在一起比較差異，是比較對照。'),
        item('閱讀微型論證', '「教育局指引建議課室保留安靜學習空間。」', '教育局指引在論述中屬於哪一項？', '論據', ['論據', '論點', '結尾祝語'], '引用可信來源的指引，是支持主張的論據。'),
        item('閱讀微型論證', '「因此，班會應訂立清楚的分工表。」', '這一句最可能是段落的哪一部分？', '結論性論點', ['結論性論點', '描述細節', '人物對話'], '「因此」把前面理由收束成要採取的主張。'),
        item('閱讀微型論證', '「先列出期限，再安排每人的工作，可減少最後一刻匆忙。」', '這段文字的推理骨架是甚麼？', '做法帶來結果', ['做法帶來結果', '景物比喻', '歷史敘事'], '提出做法，再說預期效果，是以因果關係論證。')
      ]
    },
    functionWord: {
      icon: '🧭', title: '文言虛詞分流', description: '辨析常見虛詞在句中的語法功能與語氣。', focus: '文言虛詞與句法功能', accent: 'pink',
      rounds: [
        item('虛詞「之」', '「何陋之有？」', '「之」在句中最主要的作用是甚麼？', '賓語前置標誌', ['賓語前置標誌', '表示「的」', '代替人或物'], '「何陋之有」相當於「有何陋」，「之」幫助賓語前置。'),
        item('虛詞「之」', '「予獨愛蓮之出淤泥而不染」', '「之」在句中最主要的作用是甚麼？', '取消句子獨立性', ['取消句子獨立性', '表示到、往', '語氣詞'], '「蓮之出淤泥」作為整體放在「愛」後，之用來連接主謂。'),
        item('虛詞「以」', '「以刀劈狼首」', '「以」在句中最接近哪個意思？', '用', ['用', '因為', '來到'], '後面接工具「刀」，表示用刀。'),
        item('虛詞「以」', '「不以物喜，不以己悲」', '「以」在句中最接近哪個意思？', '因為', ['因為', '把', '已經'], '不因外物而喜、不因自己遭遇而悲，表示原因。'),
        item('虛詞「於」', '「所欲有甚於生者」', '「於」在句中最接近哪個意思？', '比', ['比', '在', '向'], '「甚於生」是比生命更重要，表示比較。'),
        item('虛詞「於」', '「受地於先王」', '「於」在句中最接近哪個意思？', '從', ['從', '比', '到'], '接受土地的來源是先王，表示從。'),
        item('虛詞「而」', '「溫故而知新」', '「而」在句中最主要的作用是甚麼？', '承接連接', ['承接連接', '轉折對立', '疑問語氣'], '溫習舊知後得到新知，前後動作承接。'),
        item('虛詞「而」', '「人不知而不慍」', '「而」在句中最主要的作用是甚麼？', '轉折連接', ['轉折連接', '表示「的」', '結束語氣'], '別人不了解自己，卻不生氣，前後帶有轉折。'),
        item('虛詞「乎」', '「不亦說乎？」', '「乎」在句末主要表達甚麼？', '反問語氣', ['反問語氣', '命令語氣', '感嘆語氣'], '「不亦……乎」常用來反問，意思是「不是很……嗎」。'),
        item('虛詞「也」', '「蓮，花之君子者也」', '「也」在句末主要表達甚麼？', '判斷語氣', ['判斷語氣', '疑問語氣', '比較語氣'], '「……者也」是典型判斷句式，用來說明身分或性質。')
      ]
    },
    academic: {
      icon: '📚', title: '高階學術詞彙間隔卡', description: '以定義、搭配與例句鞏固論說文常用抽象詞彙。', focus: '學術詞彙與精準理解', accent: 'blue',
      rounds: [
        item('詞彙卡「釐清」', '討論前，主持人先釐清每個人的問題。', '「釐清」最接近哪個意思？', '把混亂的事情弄清楚', ['把混亂的事情弄清楚', '把資料全部刪掉', '把意見都同意'], '「釐清問題」是把原來不清楚的地方逐一弄明白。'),
        item('詞彙卡「闡述」', '作者在第二段闡述自己的看法。', '「闡述」最接近哪個意思？', '有條理地說明', ['有條理地說明', '快速地背誦', '完全地反對'], '論說文中「闡述」指把觀點仔細而有條理地說明。'),
        item('詞彙卡「觀點」', '兩位作者對校服政策提出不同觀點。', '「觀點」最接近哪個意思？', '對事情的看法', ['對事情的看法', '看到的景色', '一個固定事實'], '觀點是個人或作者對議題的立場、看法。'),
        item('詞彙卡「論據」', '文章引用調查數據作為論據。', '「論據」最接近哪個意思？', '支持觀點的材料', ['支持觀點的材料', '文章的標題', '讀者的心情'], '數據、例子、引文都可作為支持論點的論據。'),
        item('詞彙卡「推論」', '根據雲層變厚，我們推論可能會下雨。', '「推論」最接近哪個意思？', '根據線索作判斷', ['根據線索作判斷', '直接看到事實', '重複別人的句子'], '推論不是猜測，而是根據觀察到的線索作出判斷。'),
        item('詞彙卡「檢視」', '交稿前請檢視段落是否連貫。', '「檢視」最接近哪個意思？', '仔細查看和評估', ['仔細查看和評估', '立刻交出去', '改寫成口語'], '「檢視」比一般看一看更強調仔細檢查與評估。'),
        item('詞彙卡「影響」', '睡眠不足會影響上課時的專注力。', '「影響」最接近哪個意思？', '使結果發生改變', ['使結果發生改變', '把事情隱藏起來', '把資料分類'], '一件事令另一件事的狀態或結果改變，就是影響。'),
        item('詞彙卡「脈絡」', '理解歷史事件要先看當時的社會脈絡。', '「脈絡」最接近哪個意思？', '事情前後相關的背景', ['事情前後相關的背景', '身體的血管', '文章的字數'], '社會脈絡是事件發生時的背景、關係和前後情況。'),
        item('詞彙卡「界定」', '報告先界定「健康生活」的範圍。', '「界定」最接近哪個意思？', '清楚說明範圍與意思', ['清楚說明範圍與意思', '選出最受歡迎的答案', '把詞語讀得更快'], '界定概念是先說清楚它包括甚麼、不包括甚麼。'),
        item('詞彙卡「可行」', '小組比較後選出一個可行的方案。', '「可行」最接近哪個意思？', '實際上可以做到', ['實際上可以做到', '聽起來很複雜', '一定最昂貴'], '可行的方案是有資源、步驟或條件支持，實際可以實行。')
      ]
    },
    surgery: {
      icon: '🩺', title: '語病診斷與手術', description: '找出成分殘缺、語序不當與搭配問題，選出最清楚的修正句。', focus: '長句校對與元認知監控', accent: 'yellow', layout: 'long',
      rounds: [
        item('原句', '「透過老師的講解，使同學明白了段落結構。」', '哪一句修正後最完整？', '透過老師的講解，同學明白了段落結構。', ['透過老師的講解，同學明白了段落結構。', '透過老師的講解，使同學明白了段落結構。', '透過老師，使明白段落結構。'], '「透過」和「使」同時使用會令主語位置不清；保留一種結構即可。'),
        item('原句', '「我們不但要閱讀資料，也要並且核對來源。」', '哪一句修正後最自然？', '我們不但要閱讀資料，也要核對來源。', ['我們不但要閱讀資料，也要核對來源。', '我們不但要閱讀資料，也要並且核對來源。', '我們閱讀資料不但，也要核對來源。'], '「也要」已承接「不但要」，毋須再加「並且」。'),
        item('原句', '「這項措施有效地改善同學的閱讀能力提升。」', '哪一句修正後搭配最正確？', '這項措施有效地提升同學的閱讀能力。', ['這項措施有效地提升同學的閱讀能力。', '這項措施有效地改善同學的閱讀能力提升。', '這項措施閱讀能力有效地。'], '「提升能力」或「改善情況」均可；原句把兩種說法混在一起。'),
        item('原句', '「參加討論的同學，他們都提出意見。」', '哪一句修正後主語最清楚？', '參加討論的同學都提出意見。', ['參加討論的同學都提出意見。', '參加討論的同學，他們都提出意見。', '同學參加的討論，都他們提出意見。'], '前面已有「同學」作主語，後面不必再重複「他們」。'),
        item('原句', '「老師要求我們把完成報告在星期五前。」', '哪一句修正後語序最正確？', '老師要求我們在星期五前完成報告。', ['老師要求我們在星期五前完成報告。', '老師要求我們把完成報告在星期五前。', '老師在星期五前要求完成我們報告。'], '時間「在星期五前」放在動作「完成」前面較清楚。'),
        item('原句', '「是否能準時完成，關鍵在於大家有沒有清楚分工。」', '哪一句修正後關聯最一致？', '能否準時完成，關鍵在於大家有沒有清楚分工。', ['能否準時完成，關鍵在於大家有沒有清楚分工。', '是否能準時完成，關鍵在於大家有沒有清楚分工。', '能否準時完成，關鍵於大家。'], '「能否」與「有沒有」成對呼應，語氣較一致。'),
        item('原句', '「這篇文章的內容非常豐富，而且也有很多例子。」', '哪一句修正後較精煉？', '這篇文章內容豐富，也有很多例子。', ['這篇文章內容豐富，也有很多例子。', '這篇文章的內容非常豐富，而且也有很多例子。', '這篇文章例子內容很多也豐富。'], '刪去可有可無的加強詞，保留兩個清楚重點。'),
        item('原句', '「我們希望藉著這次活動，讓環保意識可以提高。」', '哪一句修正後主語最明確？', '我們希望藉著這次活動提高環保意識。', ['我們希望藉著這次活動提高環保意識。', '我們希望藉著這次活動，讓環保意識可以提高。', '藉著活動，希望環保意識我們。'], '「希望」後面直接接要做的事，避免主語游離。'),
        item('原句', '「由於天雨的關係，所以比賽改期。」', '哪一句修正後關聯詞不重複？', '由於下雨，比賽改期。', ['由於下雨，比賽改期。', '由於天雨的關係，所以比賽改期。', '天雨所以由於改期比賽。'], '「由於」已帶出原因，後面直接說結果即可。'),
        item('原句', '「這個建議不但可行，也受到同學一致的支持。」', '哪一句修正後詞語搭配最自然？', '這個建議不但可行，也獲得同學一致支持。', ['這個建議不但可行，也獲得同學一致支持。', '這個建議不但可行，也受到同學一致的支持。', '這個建議同學支持可行不但。'], '建議「獲得支持」比「受到支持」更常見、自然。')
      ]
    }
  };

  let activeKey = '';
  let roundIndex = 0;
  let result = { correct: 0, retries: 0, hints: 0 };
  let speechActive = false;
  let returnFocus = null;
  const currentActivity = () => activities[activeKey];
  const currentRound = () => currentActivity().rounds[roundIndex];
  const wait = (callback, duration = 900) => window.setTimeout(callback, duration);
  function updateReadButton() {
    const button = document.querySelector('#spldS4Read');
    if (!button) return;
    button.textContent = speechActive ? '■ 停止朗讀' : '🔊 朗讀語境及題目';
    button.setAttribute('aria-label', speechActive ? '停止朗讀' : '朗讀語境及題目');
    button.setAttribute('aria-pressed', String(speechActive));
  }
  function stopReading() {
    window.speechSynthesis?.cancel();
    speechActive = false;
    updateReadButton();
  }
  const speak = (text) => {
    if (!('speechSynthesis' in window)) return false;
    window.speechSynthesis.cancel();
    speechActive = true;
    updateReadButton();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = 'zh-HK'; utterance.rate = 0.72;
    utterance.onstart = () => { speechActive = true; updateReadButton(); };
    utterance.onend = utterance.onerror = () => { speechActive = false; updateReadButton(); };
    window.speechSynthesis.speak(utterance);
    return true;
  };
  const closeLab = ({ restoreFocus = true } = {}) => { const focusTarget = returnFocus; stopReading(); document.querySelector('.spld-s4-lab-backdrop')?.remove(); if (restoreFocus && focusTarget?.isConnected) window.setTimeout(() => focusTarget.focus(), 0); if (restoreFocus) returnFocus = null; };
  const trapFocus = (event) => { if (event.key === 'Escape') { event.preventDefault(); closeLab(); return; } if (event.key !== 'Tab') return; const controls = [...event.currentTarget.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter((element) => element.offsetParent !== null); if (!controls.length) return; const first = controls[0]; const last = controls.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } };
  const prepareDialog = (focusSelector = '.spld-s4-close') => { const dialog = document.querySelector('.spld-s4-lab'); if (!dialog || dialog.dataset.a11yReady) return; dialog.dataset.a11yReady = 'true'; dialog.addEventListener('keydown', trapFocus); window.setTimeout(() => dialog.querySelector(focusSelector)?.focus(), 0); };
  const focusRoundControl = () => window.setTimeout(() => document.querySelector('#spldS4Read, .spld-s4-choice:not([disabled]), .spld-s4-close')?.focus(), 0);
  const shell = (content) => `<div class="spld-s4-lab-backdrop" role="presentation"><section class="spld-s4-lab" role="dialog" aria-modal="true" aria-label="高中讀寫實驗室"><button class="spld-s4-close" type="button" aria-label="關閉高中讀寫實驗室">×</button>${content}</section></div>`;
  const cardsMarkup = () => Object.entries(activities).map(([key, activity]) => `<button type="button" class="spld-s4-menu-card ${activity.accent}" data-s4-activity="${key}"><span>${activity.icon}</span><strong>${activity.title}</strong><small>${activity.description}</small><em>${activity.rounds.length} 個短回合</em></button>`).join('');
  function openMenu() {
    closeLab({ restoreFocus: false });
    document.body.insertAdjacentHTML('beforeend', shell(`<div class="spld-s4-heading"><span>高中 S.4–S.6 · SpLD</span><h2>高中讀寫實驗室</h2><p>按今天要練的文言、論證、學術詞彙或語句校對技能直接開始。可以慢慢讀、看提示、換練習或隨時離開。</p></div><div class="spld-s4-menu">${cardsMarkup()}</div><aside class="spld-s4-low-pressure"><strong>低壓參與：</strong><span>🔊 朗讀題目</span><span>💡 使用提示</span><span>↔ 隨時換練習</span></aside>`));
    prepareDialog('[data-s4-activity]');
    document.querySelector('.spld-s4-close')?.addEventListener('click', closeLab);
    document.querySelectorAll('[data-s4-activity]').forEach((button) => button.addEventListener('click', () => startActivity(button.dataset.s4Activity)));
  }
  function choiceMarkup(round) { return `<div class="spld-s4-choice-grid ${currentActivity().layout === 'long' ? 'long' : ''}">${round.choices.map((choice, index) => `<button type="button" class="spld-s4-choice" data-s4-choice="${choice}" aria-label="選項 ${index + 1}：${choice}"><span>${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div>`; }
  function renderRound() {
    const activity = currentActivity(); const round = currentRound(); const lab = document.querySelector('.spld-s4-lab');
    if (!lab) return;
    const total = activity.rounds.length;
    lab.innerHTML = `<button class="spld-s4-close" type="button" aria-label="關閉高中讀寫實驗室">×</button><div class="spld-s4-heading compact"><span>${activity.focus}</span><h2>${activity.icon} ${activity.title}</h2><p>${activity.description}</p></div><div class="spld-s4-progress" role="progressbar" aria-label="練習進度" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${roundIndex + 1}" aria-valuetext="第 ${roundIndex + 1} / ${total} 關"><b>第 ${roundIndex + 1} / ${total} 關</b><i aria-hidden="true"><em style="width:${((roundIndex + 1) / total) * 100}%"></em></i></div><article class="spld-s4-scene"><small>${round.lead}</small><p>${round.context}</p></article><p class="spld-s4-prompt">${round.prompt}</p><div class="spld-s4-feedback" id="spldS4Feedback" role="status" aria-live="polite" aria-atomic="true">慢慢看一看；不知道時可以按提示。</div><aside class="spld-s4-low-pressure-inline">需要時可先聽語境和題目，再看提示；不需要一次完成。</aside><div class="spld-s4-tools" aria-label="低壓學習工具"><button type="button" id="spldS4Read" aria-label="朗讀語境及題目" aria-pressed="false">🔊 朗讀語境及題目</button><button type="button" id="spldS4Hint" aria-label="顯示解題提示">💡 看提示</button><button type="button" id="spldS4Back" aria-label="返回高中 SpLD 練習選單">← 換一項練習</button></div>${choiceMarkup(round)}`;
    lab.querySelector('.spld-s4-close')?.addEventListener('click', closeLab);
    lab.querySelector('#spldS4Read')?.addEventListener('click', () => { if (speechActive) stopReading(); else speak(`${activity.title}。${round.lead}。${round.context}。${round.prompt}`); });
    lab.querySelector('#spldS4Hint')?.addEventListener('click', () => { result.hints += 1; feedback(`💡 ${round.hint}`, 'hint'); speak(round.hint); });
    lab.querySelector('#spldS4Back')?.addEventListener('click', openMenu);
    lab.querySelectorAll('[data-s4-choice]').forEach((button) => button.addEventListener('click', () => choose(button, round)));
    focusRoundControl();
  }
  function feedback(message, state = '') { const panel = document.querySelector('#spldS4Feedback'); if (panel) { panel.className = `spld-s4-feedback ${state}`; panel.textContent = message; } }
  function choose(button, round) {
    if (button.disabled) return;
    const choice = button.dataset.s4Choice;
    if (choice === round.answer) { result.correct += 1; button.classList.add('correct'); feedback(`✓ 正確。「${choice}」最配合這個語境。`, 'success'); speak(`答對了。${choice}最配合這個語境。`); wait(nextRound); return; }
    result.retries += 1; button.classList.add('wrong'); feedback('可以先找關鍵詞、前後關係或最貼近句意的詞，再慢慢試一次。', 'try'); speak('可以先找關鍵詞和前後關係，再慢慢試一次。'); wait(() => button.classList.remove('wrong'), 760);
  }
  function nextRound() { if (roundIndex < currentActivity().rounds.length - 1) { roundIndex += 1; renderRound(); } else finish(); }
  function finish() {
    const activity = currentActivity(); const total = activity.rounds.length;
    document.dispatchEvent(new CustomEvent('spld-s4-lab-complete', { detail: { ...result, activity: activity.title } }));
    const lab = document.querySelector('.spld-s4-lab'); if (!lab) return;
    lab.innerHTML = `<button class="spld-s4-close" type="button" aria-label="關閉高中讀寫實驗室">×</button><div class="spld-s4-result"><span>本次讀寫回顧</span><h2>完成 ${activity.title}</h2><p>你已完成 ${total} 個小回合。可以休息、選另一項練習，或回到高中 SpLD 關卡。</p><div><strong>${result.correct} / ${total}</strong><strong>${result.retries} 次溫和重試</strong><strong>${result.hints} 次提示</strong></div><small>這些數字只協助教師安排下一步，不作比較或評分。</small><section><button type="button" id="spldS4Again">↺ 選另一項練習</button><button type="button" id="spldS4Exit">回到高中 SpLD 關卡</button></section></div>`;
    lab.querySelector('.spld-s4-close')?.addEventListener('click', closeLab); lab.querySelector('#spldS4Again')?.addEventListener('click', openMenu); lab.querySelector('#spldS4Exit')?.addEventListener('click', closeLab);
  }
  function startActivity(key) { if (!activities[key]) return; activeKey = key; roundIndex = 0; result = { correct: 0, retries: 0, hints: 0 }; renderRound(); }
  function openActivity(key, trigger = document.activeElement) { if (!activities[key]) return; returnFocus = trigger; closeLab({ restoreFocus: false }); document.body.insertAdjacentHTML('beforeend', shell('')); prepareDialog(); startActivity(key); }
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `.spld-s4-lab-backdrop{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;background:rgba(20,29,53,.7)}.spld-s4-lab{position:relative;width:min(830px,100%);max-height:calc(100vh - 32px);overflow:auto;padding:31px;border-radius:27px;background:#fff;color:#26344b;box-shadow:0 28px 72px rgba(14,21,42,.35)}.spld-s4-close{position:absolute;top:14px;right:16px;min-width:44px;min-height:44px;border:0;border-radius:50%;background:#f0f3f8;color:#5c6579;font-size:28px;cursor:pointer}.spld-s4-heading{padding-right:50px}.spld-s4-heading>span,.spld-s4-result>span{display:block;color:#6d579e;font-size:14px;font-weight:900;letter-spacing:.06em}.spld-s4-heading h2,.spld-s4-result h2{margin:5px 0;color:#28365c;font-size:29px}.spld-s4-heading p,.spld-s4-result>p{margin:0;color:#66738a;font-size:17px;line-height:1.65}.spld-s4-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:22px 0}.spld-s4-menu-card{min-height:190px;display:flex;flex-direction:column;gap:7px;padding:18px;border:2px solid #d8cff2;border-radius:21px;background:#fbfaff;color:#293758;text-align:left;cursor:pointer;transition:transform 160ms ease-out,box-shadow 160ms ease-out}.spld-s4-menu-card.teal{border-color:#cfe8e1;background:#f8fffd}.spld-s4-menu-card.orange{border-color:#f3d7a9;background:#fffaf2}.spld-s4-menu-card.pink{border-color:#ebc5d9;background:#fff8fb}.spld-s4-menu-card.blue{border-color:#c6d9f3;background:#f7faff}.spld-s4-menu-card.yellow{border-color:#ead99d;background:#fffdf3}.spld-s4-menu-card>span{font-size:37px}.spld-s4-menu-card strong{font-size:21px}.spld-s4-menu-card small{color:#617086;line-height:1.55}.spld-s4-menu-card em{margin-top:auto;color:#5a478e;font-style:normal;font-weight:850}.spld-s4-low-pressure{display:flex;flex-wrap:wrap;gap:8px;padding:13px 15px;border-radius:15px;background:#f2effd;color:#5b4d7e;font-size:14px}.spld-s4-low-pressure span{padding:5px 8px;border-radius:99px;background:#fff}.spld-s4-progress{display:flex;align-items:center;gap:12px;margin:21px 0 14px;color:#64528e}.spld-s4-progress i{height:8px;flex:1;overflow:hidden;border-radius:99px;background:#e7e0f8}.spld-s4-progress em{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#7560bb,#a68de1)}.spld-s4-scene{padding:16px;border-radius:17px;background:#f8f7fd;color:#2e4268}.spld-s4-scene small{color:#6c579b;font-weight:900}.spld-s4-scene p{margin:8px 0 0;font-size:21px;font-weight:850;line-height:1.65}.spld-s4-prompt{margin:18px 0 14px;font-size:20px;font-weight:850;line-height:1.58}.spld-s4-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.spld-s4-choice-grid.long{grid-template-columns:1fr}.spld-s4-choice{min-height:104px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:2px solid #c6bbeb;border-radius:16px;background:#fff;color:#574489;cursor:pointer;transition:transform 160ms cubic-bezier(.23,1,.32,1),border-color 160ms cubic-bezier(.23,1,.32,1)}.spld-s4-choice-grid.long .spld-s4-choice{min-height:68px;align-items:flex-start;padding:12px 15px;text-align:left}.spld-s4-choice:active{transform:scale(.97)}.spld-s4-choice span{font-size:12px;font-weight:850}.spld-s4-choice strong{padding:0 8px;font-size:19px;line-height:1.4;text-align:center}.spld-s4-choice-grid.long .spld-s4-choice strong{text-align:left}.spld-s4-choice.correct{border-color:#44a873;background:#ebf9ef;color:#246d48}.spld-s4-choice.wrong{border-color:#d47d7d;background:#fff0f0;color:#9b4d4d}.spld-s4-feedback{min-height:27px;margin:14px 0;color:#5e6f82;font-size:17px;line-height:1.65}.spld-s4-feedback.success{color:#25714f;font-weight:850}.spld-s4-feedback.try{color:#9b4d4d;font-weight:850}.spld-s4-feedback.hint{color:#896313;font-weight:850}.spld-s4-low-pressure-inline{margin:12px 0 10px;padding:9px 11px;border-left:4px solid #9e8bd2;border-radius:9px;background:#f6f3ff;color:#5c4d83;font-size:15px;line-height:1.5}.spld-s4-tools,.spld-s4-result section{display:flex;flex-wrap:wrap;gap:9px}.spld-s4-tools button,.spld-s4-result button{min-height:50px;padding:10px 13px;border:1px solid #d2caea;border-radius:11px;background:#fff;color:#5b478f;font-size:16px;font-weight:850;cursor:pointer}.spld-s4-tools button:first-child,.spld-s4-result button:first-child{border-color:#6c56b2;background:#6c56b2;color:#fff}.spld-s4-result{padding:17px 0;text-align:center}.spld-s4-result>div{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:22px 0}.spld-s4-result>div strong{padding:13px;border-radius:13px;background:#f0edfb;color:#5c488f;font-size:16px}.spld-s4-result>small{display:block;margin-bottom:17px;color:#5f7084}.spld-s4-close:focus-visible,.spld-s4-tools button:focus-visible,.spld-s4-result button:focus-visible,.spld-s4-choice:focus-visible,.spld-s4-menu-card:focus-visible{outline:4px solid #145fa8;outline-offset:3px;box-shadow:0 0 0 7px rgba(255,255,255,.95),0 0 0 10px #145fa8}@media(max-width:620px){.spld-s4-lab{padding:25px 16px;border-radius:22px}.spld-s4-menu{grid-template-columns:1fr}.spld-s4-menu-card{min-height:156px}.spld-s4-heading h2,.spld-s4-result h2{font-size:27px;line-height:1.32}.spld-s4-heading p{font-size:16px}.spld-s4-scene p,.spld-s4-prompt{font-size:19px}.spld-s4-choice-grid{gap:8px}.spld-s4-choice{min-height:100px}.spld-s4-choice strong{font-size:17px}.spld-s4-choice-grid.long .spld-s4-choice{min-height:80px}.spld-s4-choice-grid.long .spld-s4-choice strong{font-size:18px;line-height:1.48}.spld-s4-low-pressure-inline{font-size:15px}.spld-s4-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.spld-s4-tools button{font-size:15px}.spld-s4-tools button:last-child{grid-column:span 2}.spld-s4-result>div{gap:6px}.spld-s4-result>div strong{font-size:13px;padding:10px 5px}}@media(prefers-reduced-motion:reduce){.spld-s4-choice,.spld-s4-menu-card{transition:none}}`;
    document.head.appendChild(style);
  }
  window.SPLD_S4_LAB = {
    activityCards: () => Object.entries(activities).map(([key, activity]) => ({ id: `spld-s4-${key}`, s4ActivityKey: key, lab: 's4', category: 'cognition', categoryName: '高中 · SpLD 文言與論證', tone: ({ polysemy: 'purple', loan: 'teal', argument: 'orange', functionWord: 'pink', academic: 'blue', surgery: 'yellow' })[key], icon: activity.icon, title: activity.title, description: activity.description, tag: `S4–S6 · ${activity.focus}`, supports: ['1'], rounds: activity.rounds })),
    openActivity,
    openMenu
  };
  injectStyles();
})();
