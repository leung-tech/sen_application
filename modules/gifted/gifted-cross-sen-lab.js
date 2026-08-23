/* 跨 SEN 資優／2e 課堂實驗室：教師帶領、非診斷性、低壓直接選關。 */
(() => {
  const activities = {
    lower: [
      {
        key: 'quiet-lab', icon: '🧪', title: '安靜實驗室：觀察與選擇',
        description: '先選自己舒服的提示方式，再用圖形、數量與步驟卡完成安靜的科學觀察。',
        tag: 'G＋ADHD · 初小 P1–P3 · 3 回合', supports: ['G', '4']
      },
      {
        key: 'concept-blocks', icon: '🧱', title: '概念連結方塊',
        description: '把科學概念卡連到圖像與關係鏈；可拖拉，也可先點卡再點選圖示。',
        tag: 'G＋SLI · 初小 P1–P3 · 3 回合', supports: ['G', '8']
      }
    ],
    upper: [
      {
        key: 'case-workshop', icon: '🔎', title: '多角度案件工作室',
        description: '閱讀虛構校園情境的規則、處境與影響卡，找出兼顧修復、支持與下一步的方案。',
        tag: 'G＋EBD · 高小 P4–P6 · 3 回合', supports: ['G', 'E']
      },
      {
        key: 'memory-map', icon: '🗺️', title: '空間線索記憶地圖',
        description: '把學習線索放到圖像房間；可選圖像、首字、色彩或朗讀提示來建立回憶路線。',
        tag: 'G＋SpLD · 高小 P4–P6 · 3 回合', supports: ['G', '1']
      }
    ],
    junior: [
      {
        key: 'thought-workbench', icon: '🧰', title: '思考與感受工作台',
        description: '從虛構角色的事實、可能想法與支持選項中挑選線索；不需要分享私人感受。',
        tag: 'G＋MI · 初中 S1–S3 · 3 回合', supports: ['G', '9']
      },
      {
        key: 'social-decoder', icon: '💬', title: '社交線索解碼台',
        description: '閱讀對話的明說內容和情境線索，考慮多個可能意思，再選中性確認或澄清句。',
        tag: 'G＋ASD · 初中 S1–S3 · 3 回合', supports: ['G', '3']
      }
    ],
    senior: [
      {
        key: 'story-editor', icon: '📝', title: '成就故事編輯室',
        description: '從虛構角色的作品、回饋與支持卡中選擇證據，整理一段可修改的學習故事。',
        tag: 'G＋MI · 高中 S4–S6 · 3 回合', supports: ['G', '9']
      },
      {
        key: 'community-sandbox', icon: '🏙️', title: '社區方案沙盒',
        description: '在虛構社區中閱讀不同需要與資源限制，選擇可修訂方案並提出下一個要問的問題。',
        tag: 'G＋EBD · 高中 S4–S6 · 3 回合', supports: ['G', 'E']
      }
    ]
  };

  const quietRounds = [
    { title: '泡泡配方', prompt: '哪一張卡讓泡泡顏色由淺變深？', answer: '加入藍色一滴', choices: ['加入藍色一滴', '拿走量杯', '把卡倒轉'], hint: '看看哪一個步驟真的改變了顏色。', visual: '🫧 → 🔵' },
    { title: '圖形觀察', prompt: '觀察：🔺、🔺、●、🔺、🔺、●、？', answer: '🔺', choices: ['●', '🔺', '■'], hint: '每一組有兩個三角形，然後是一個圓形。', visual: '🔺 🔺 ●' },
    { title: '小量杯', prompt: '量杯已有 3 格水，再加入 2 格，哪張結果卡最吻合？', answer: '5 格水', choices: ['4 格水', '5 格水', '6 格水'], hint: '可以在紙上畫 3 個點，再加 2 個點。', visual: '💧💧💧 ＋ 💧💧' }
  ];

  const conceptRounds = [
    { term: '蒸發', read: '蒸發', prompt: '把「蒸發」連到最相符的圖像。', answer: '水變成水氣', choices: ['水變成水氣', '冰變成水', '雲落下雨'], hint: '想想水在太陽下慢慢去了哪裡。', visual: '☀️  💧  ↑' },
    { term: '引力', read: '引力', prompt: '把「引力」連到最相符的關係鏈。', answer: '物件向地面靠近', choices: ['物件向地面靠近', '物件自己發光', '物件變得透明'], hint: '把球放開時，通常會往哪裡走？', visual: '⚽ ↓ 🌍' },
    { term: '對流', read: '對流', prompt: '把「對流」連到最相符的空氣流動圖。', answer: '暖空氣上升、冷空氣下降', choices: ['暖空氣上升、冷空氣下降', '所有空氣停住', '冷空氣一直上升'], hint: '暖的空氣較輕，通常會向上移動。', visual: '🔥 ↑　↓ ❄️' }
  ];

  const caseRounds = [
    {
      title: '借用的平板',
      scenario: '虛構案例：小組借用平板後沒有即時交回，另一組因此要等候。',
      evidence: ['規則卡：借用後要交回充電站。', '處境卡：小組正在存檔，怕遺失作品。', '影響卡：另一組需要平板完成展示。'],
      answer: '先協助安全存檔，再約定交回時間和補回展示安排。',
      choices: ['只說「你們違規」，立刻停止所有工作。', '先協助安全存檔，再約定交回時間和補回展示安排。', '不需要討論，讓所有小組一直等候。'],
      hint: '看看哪一個方案同時回應規則、現時處境和受影響的人。'
    },
    {
      title: '分組資料被改動',
      scenario: '虛構案例：有人為了讓海報更清楚，刪掉了組員原本的一段資料。',
      evidence: ['規則卡：修改前先和小組確認。', '處境卡：海報空間有限，展示快要開始。', '影響卡：原作者想知道資料為何被改動。'],
      answer: '先保留原稿，再用短時間一起選出必留資料與修改方法。',
      choices: ['只追究誰按了刪除，暫停整個展示。', '先保留原稿，再用短時間一起選出必留資料與修改方法。', '不需要理會原作者，直接使用新版本。'],
      hint: '可尋找一個既保留資料、又能讓小組下一步可行的方案。'
    },
    {
      title: '安靜閱讀角',
      scenario: '虛構案例：閱讀角有人需要安靜，也有人正在小聲討論圖書報告。',
      evidence: ['規則卡：閱讀角要讓不同使用者可專心。', '處境卡：討論小組今天需要準備報告。', '影響卡：旁邊同學正在閱讀長篇故事。'],
      answer: '一起標示安靜區與可討論位置，並約定小聲討論的時間。',
      choices: ['禁止所有人說話，直到放學。', '一起標示安靜區與可討論位置，並約定小聲討論的時間。', '不需要調整，讓每個人自行處理。'],
      hint: '思考能否同時讓不同需要被看見，而不是只留下其中一方。'
    }
  ];

  const mapRounds = [
    { term: '水循環', prompt: '把「水循環」放到最能幫你回想的圖像房間。', answer: '太陽、雲與雨滴', choices: ['太陽、雲與雨滴', '葉子與根', '磁鐵與鐵釘'], hint: '可把水變成水氣、雲和雨想成一條路。', visual: '☀️ → ☁️ → 🌧️' },
    { term: '絲綢之路', prompt: '把「絲綢之路」放到最能幫你回想的圖像房間。', answer: '駱駝、地圖與貨物', choices: ['駱駝、地圖與貨物', '火箭、月球與星星', '珊瑚、魚與海浪'], hint: '可想像商隊帶著貨物穿過不同地方。', visual: '🐪 🗺️ 📦' },
    { term: '食物鏈', prompt: '把「食物鏈」放到最能幫你回想的圖像房間。', answer: '植物、昆蟲與雀鳥', choices: ['植物、昆蟲與雀鳥', '書本、鉛筆與尺', '雨傘、雨衣與雨靴'], hint: '想想能量怎樣由植物開始，傳到不同生物。', visual: '🌿 → 🐛 → 🐦' }
  ];

  const workbenchRounds = [
    {
      title: '小組意見被跳過',
      scenario: '虛構角色小澤在小組會議中剛想提出點子，話題已轉到下一頁。',
      cards: [
        ['事實卡', '小澤的點子還未被討論。'],
        ['可能想法卡', '「我的點子是否不重要？」'],
        ['支持選項卡', '請組員預留一分鐘，或把點子先寫在共用筆記。']
      ]
    },
    {
      title: '活動時間被改動',
      scenario: '虛構角色雅晴原本準備參加工作坊，教師通知因場地問題要改期。',
      cards: [
        ['事實卡', '工作坊改期，原因是場地安排。'],
        ['可能想法卡', '「我已花時間準備，現在不知道怎樣安排。」'],
        ['支持選項卡', '查看新日期、詢問替代安排，或先請教師說明下一步。']
      ]
    },
    {
      title: '作品收到修訂建議',
      scenario: '虛構角色浩然交出海報後，收到「可令重點更清楚」的回饋。',
      cards: [
        ['事實卡', '回饋指出海報的重點可再清楚。'],
        ['可能想法卡', '「我想先知道哪一部分最需要調整。」'],
        ['支持選項卡', '請對方指出一個例子，再選一小部分開始修訂。']
      ]
    }
  ];

  const decoderRounds = [
    {
      title: '分工訊息',
      dialogue: '班長說：「大家的想法很多，我們先寫下各自想負責的部分。」',
      clues: ['正在安排小組專題。', '班長使用「先」表示可有下一步討論。'],
      possible: ['可能想讓每人有清楚分工。', '可能想先整理資料，再決定是否需要協作。'],
      answers: ['我想確認：我先把我想負責的部分寫下來，之後再一起分配，可以嗎？', '我未必完全明白；可以先說說現在需要列出哪些部分嗎？'],
      choices: ['我想確認：我先把我想負責的部分寫下來，之後再一起分配，可以嗎？', '你是在說我做得不夠快嗎？', '我未必完全明白；可以先說說現在需要列出哪些部分嗎？']
    },
    {
      title: '簡短回覆',
      dialogue: '同學回覆：「我看到你的訊息了，晚些時候再仔細看。」',
      clues: ['對方已確認收到訊息。', '「晚些時候」沒有說明確切時間。'],
      possible: ['可能需要更多時間閱讀。', '可能正在處理另一件事情。'],
      answers: ['謝謝你確認收到。你想何時再一起看，還是我先整理兩個重點？', '我想確認一下：你方便時可否告訴我大約哪個時段再看？'],
      choices: ['謝謝你確認收到。你想何時再一起看，還是我先整理兩個重點？', '你一定是不想合作。', '我想確認一下：你方便時可否告訴我大約哪個時段再看？']
    },
    {
      title: '會議中的玩笑',
      dialogue: '有人笑著說：「我們今天的清單真的很長呢。」',
      clues: ['大家正在看一張很多項目的清單。', '語氣可能是玩笑，也可能是在提示工作量。'],
      possible: ['可能只是描述工作量。', '可能想邀請大家一起調整優先次序。'],
      answers: ['我想確認：要不要先圈出今天最重要的兩項？', '我未必知道這句話想提醒甚麼；你想先調整哪一部分？'],
      choices: ['我想確認：要不要先圈出今天最重要的兩項？', '你是在嘲笑大家嗎？', '我未必知道這句話想提醒甚麼；你想先調整哪一部分？']
    }
  ];

  const storyRounds = [
    {
      title: '研究展作品',
      scenario: '虛構角色嵐希完成研究展海報，獲得「資料整理清楚」的回饋。',
      cards: ['作品證據：嵐希把原始資料和圖表分開標示。', '學習過程：嵐希根據回饋修訂了兩次重點。', '支持選項：下次可請同學先讀一段，再確認是否清楚。']
    },
    {
      title: '校內創作展',
      scenario: '虛構角色思樂的插畫被選入創作展，但她仍想知道作品可以怎樣改進。',
      cards: ['作品證據：思樂完成了一系列有一致主題的插畫。', '學習過程：思樂比較了三種配色再作選擇。', '支持選項：下次可請評閱者指出一個保留點與一個可探索點。']
    },
    {
      title: '社區服務提案',
      scenario: '虛構角色子朗的小組提案獲批准試行，接下來需要觀察實際使用情況。',
      cards: ['作品證據：子朗把使用者需要整理成清楚流程。', '學習過程：小組根據試行回饋調整了步驟。', '支持選項：下次可先訂下一個觀察問題，再安排修訂時間。']
    }
  ];

  const communityRounds = [
    {
      title: '河畔步道',
      scenario: '虛構社區希望改善河畔步道。居民提出遮蔭、無障礙通道和保留生態空間三項需要。',
      constraints: ['資源限制：本期只能先完成兩項小工程。', '持份者：長者、輪椅使用者、學生與自然保育小組。'],
      plans: [
        ['樹蔭＋平緩通道', '先增加遮蔭和一段平緩通道，並保留觀察生態的空間。'],
        ['觀景台＋生態標示', '先設觀景台和標示，下一期再討論無障礙路段。'],
        ['臨時通道＋意見蒐集', '先設可移動通道，再蒐集不同使用者的實際意見。']
      ],
      questions: ['哪一段步道最常被不同使用者使用？', '不同使用者希望怎樣參與下一輪討論？']
    },
    {
      title: '社區閱讀室',
      scenario: '虛構社區要更新閱讀室。有人希望增加安靜座位，也有人需要小組討論位置和易讀標示。',
      constraints: ['資源限制：可移動傢具數量有限。', '持份者：閱讀者、學生小組、家長與圖書館員。'],
      plans: [
        ['可移動屏風＋易讀標示', '先建立安靜區和清楚標示，之後按使用情況調整。'],
        ['討論桌＋借閱展示', '先增加討論桌與展示區，再觀察安靜座位需要。'],
        ['試行時段＋回饋卡', '先設定不同時段的使用方式，再收集可選回饋。']
      ],
      questions: ['哪個時段最需要安靜位置？', '使用者想以哪種方式提供回饋？']
    },
    {
      title: '校門交通安排',
      scenario: '虛構學校想改善放學時段。家庭希望上落車順暢，步行學生希望過路安全，附近居民關心噪音。',
      constraints: ['資源限制：先試行一個月，再決定長期安排。', '持份者：學生、家庭、附近居民與校務人員。'],
      plans: [
        ['分時上落＋安全大使', '先安排分時上落和過路提示，再觀察交通流量。'],
        ['步行集合點＋安靜區', '先設步行集合點和暫停區，減少校門前聚集。'],
        ['路線測試＋使用紀錄', '先試行兩條路線，蒐集不同使用者的觀察。']
      ],
      questions: ['哪一個位置最需要先觀察安全情況？', '甚麼資料能幫助下月修訂安排？']
    }
  ];

  let shell;
  let trigger;
  let onComplete;
  let activeStage;
  let activeKey;
  let state;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const stageLabel = (stage) => ({ lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' })[stage] || '課堂練習';
  const activeActivity = () => Object.values(activities).flat().find((item) => item.key === activeKey);
  const rounds = () => ({ 'quiet-lab': quietRounds, 'concept-blocks': conceptRounds, 'case-workshop': caseRounds, 'memory-map': mapRounds, 'thought-workbench': workbenchRounds, 'social-decoder': decoderRounds, 'story-editor': storyRounds, 'community-sandbox': communityRounds })[activeKey] || quietRounds;
  const isConcept = () => activeKey === 'concept-blocks';

  function activityCards(stage) {
    return (activities[stage] || []).map((item) => ({
      id: `gifted-cross-${item.key}`,
      icon: item.icon,
      title: item.title,
      description: item.description,
      tag: item.tag,
      tone: 'purple',
      supports: item.supports,
      giftedCrossActivity: item.key
    }));
  }

  function addStyles() {
    if ($('#giftedCrossSenStyles')) return;
    const style = document.createElement('style');
    style.id = 'giftedCrossSenStyles';
    style.textContent = `
      .cross2e-overlay{position:fixed;inset:0;z-index:1001;display:grid;place-items:center;padding:18px;overflow:auto;background:rgba(23,17,46,.68)}
      .cross2e-dialog{width:min(920px,100%);max-height:calc(100vh - 36px);overflow:auto;padding:clamp(18px,4vw,38px);border:2px solid #d8c9ff;border-radius:24px;background:#fffdf8;color:#27213d;box-shadow:0 22px 70px rgba(15,9,37,.38)}
      .cross2e-dialog button{min-width:40px;min-height:44px;font:inherit}.cross2e-dialog button:focus-visible{outline:3px solid #196fb6;outline-offset:3px}
      .cross2e-top,.cross2e-actions,.cross2e-help{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.cross2e-top{justify-content:space-between;padding-bottom:14px;border-bottom:1px solid #eae2f6}.cross2e-top p{margin:0;color:#554a70;font-weight:750}
      .cross2e-kicker{margin:0 0 6px;color:#6036a3;font-size:.94rem;font-weight:850;letter-spacing:.04em}.cross2e-title{margin:0;font-size:clamp(1.55rem,4vw,2.25rem);line-height:1.2}.cross2e-lead{max-width:65ch;line-height:1.65;font-size:1.04rem}
      .cross2e-primary,.cross2e-secondary,.cross2e-quiet,.cross2e-choice,.cross2e-source,.cross2e-zone,.cross2e-setting{border:2px solid transparent;border-radius:14px;padding:10px 14px;transition:transform .16s cubic-bezier(.23,1,.32,1),box-shadow .16s cubic-bezier(.23,1,.32,1),opacity .16s cubic-bezier(.23,1,.32,1)}
      .cross2e-primary{border-color:#6339a7;background:#6339a7;color:#fff;font-weight:850}.cross2e-secondary{border-color:#8d6aca;background:#fff;color:#4d2c87;font-weight:800}.cross2e-quiet{border-color:#ded3f6;background:#f3efff;color:#4c3d70;font-weight:750}.cross2e-choice{border-color:#c4afe8;background:#fff;color:#34224d;font-size:1.12rem;font-weight:850}.cross2e-setting{border-color:#9bc7ee;background:#f1f8ff;color:#21456c;text-align:left;font-weight:800}.cross2e-source{border-color:#c2ade5;background:#f7f1ff;color:#41236f;text-align:left;font-weight:850}.cross2e-zone{border-color:#a6d6c7;background:#f0fbf7;color:#1d5a4b;text-align:left;font-weight:800}
      .cross2e-primary:active,.cross2e-secondary:active,.cross2e-quiet:active,.cross2e-choice:active,.cross2e-setting:active,.cross2e-source:active,.cross2e-zone:active{transform:scale(.97)}.cross2e-source.is-selected,.cross2e-setting.is-selected{border-color:#59339d;background:#e9e0ff;box-shadow:0 6px 15px rgba(81,43,139,.16)}
      .cross2e-prepare,.cross2e-play,.cross2e-finish{display:grid;gap:17px}.cross2e-rules{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.cross2e-rule{padding:14px;border:1px solid #d9cdf6;border-radius:16px;background:#f6f3ff;line-height:1.5}.cross2e-rule strong{display:block;margin-bottom:4px;color:#59339c}
      .cross2e-progress{height:12px;overflow:hidden;border-radius:999px;background:#eae3f7}.cross2e-progress>span{display:block;height:100%;background:#6941ad;transition:width .2s cubic-bezier(.23,1,.32,1)}.cross2e-board{padding:clamp(16px,3vw,28px);border:1px solid #e0d5f5;border-radius:20px;background:linear-gradient(140deg,#f8f4ff,#fff9ef);text-align:center}.cross2e-board h3{margin:0 0 8px;font-size:1.32rem}.cross2e-prompt{font-size:clamp(1.2rem,4vw,1.9rem);font-weight:850;line-height:1.55}.cross2e-visual{margin:8px 0 14px;font-size:clamp(1.55rem,6vw,2.5rem);letter-spacing:.1em}.cross2e-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.cross2e-setting-grid,.cross2e-link-layout{display:grid;grid-template-columns:1fr 1fr;gap:14px}.cross2e-zone-grid{display:grid;gap:10px}.cross2e-source small,.cross2e-zone small,.cross2e-setting small{display:block;margin-top:4px;font-weight:550;line-height:1.4}.cross2e-status{min-height:1.6em;margin:0;padding:10px 12px;border-radius:12px;background:#eef8f1;color:#1d5f3a;font-weight:750;line-height:1.5}.cross2e-status[data-state="try"]{background:#fff6df;color:#754e06}.cross2e-status:empty{display:none}.cross2e-note{padding:12px 14px;border-left:4px solid #4c83bb;border-radius:8px;background:#f0f7ff;line-height:1.55}.cross2e-finish{text-align:center;padding:8px 0}.cross2e-finish strong{font-size:1.25rem;color:#59329a}.cross2e-finish-card{padding:16px;border-radius:18px;background:#f3effd;line-height:1.6}
      @media(max-width:560px){.cross2e-overlay{padding:0;align-items:start}.cross2e-dialog{min-height:100vh;max-height:none;padding:18px;border-radius:0}.cross2e-rules,.cross2e-choice-grid,.cross2e-setting-grid,.cross2e-link-layout{grid-template-columns:1fr}.cross2e-actions>*{flex:1}.cross2e-top{align-items:flex-start}}@media(prefers-reduced-motion:reduce){.cross2e-dialog *{transition:none!important;animation:none!important}}
    `;
    document.head.append(style);
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ' '));
    utterance.lang = 'zh-HK';
    utterance.rate = .76;
    window.speechSynthesis.speak(utterance);
  }

  function dialog(content) { return `<section class="cross2e-dialog" role="dialog" aria-modal="true" aria-labelledby="cross2eTitle" tabindex="-1">${content}</section>`; }
  function top() { return `<div class="cross2e-top"><p>${stageLabel(activeStage)} · 跨 SEN 2e 課堂練習</p><button class="cross2e-quiet" type="button" data-action="close">離開練習</button></div>`; }
  function status(text = '', type = '') { const el = $('[data-role="status"]', shell); if (el) { el.textContent = text; el.dataset.state = type; } }
  function progress() { return Math.round((state.round / rounds().length) * 100); }
  function supportButtons() { return `<div class="cross2e-help"><button class="cross2e-secondary" type="button" data-action="hint">💡 看提示</button><button class="cross2e-secondary" type="button" data-action="read-round">🔊 朗讀這頁</button><button class="cross2e-quiet" type="button" data-action="pause">先停一停</button><button class="cross2e-quiet" type="button" data-action="teacher">請教師一起看</button></div>`; }

  function renderReady() {
    const activity = activeActivity();
    shell.innerHTML = dialog(`${top()}<main class="cross2e-prepare"><p class="cross2e-kicker">跨 SEN 2e · 非診斷性教師帶領</p><h2 class="cross2e-title" id="cross2eTitle">${activity.title}</h2><p class="cross2e-lead">這是三回合的高認知課堂練習。你可選自己的支持方式；結果只作本節回顧，不代表注意力、語言、情緒或能力。</p><div class="cross2e-rules"><article class="cross2e-rule"><strong>1. 先選舒服方式</strong>你可先選提示設定、聽規則或請教師示範。</article><article class="cross2e-rule"><strong>2. 慢慢完成</strong>沒有倒數、扣分或刺激效果；可以拖拉，也可以點選。</article><article class="cross2e-rule"><strong>3. 可以改變主意</strong>可看提示、先停一停、換活動或隨時離開。</article></div>${activeKey === 'quiet-lab' ? renderSettings() : ''}<div class="cross2e-actions"><button class="cross2e-secondary" type="button" data-action="read-ready">🔊 朗讀規則</button><button class="cross2e-primary" type="button" data-action="start">我準備好了</button></div></main>`);
    bindShell();
    $('[data-action="start"]', shell).focus();
  }

  function renderSettings() {
    const selected = state.setting || '靜音＋靜態提示';
    const options = [
      ['靜音＋靜態提示', '不播放聲音或動態，按需要看文字提示。'],
      ['可選朗讀', '只有按下朗讀按鈕時才播放粵語指令。'],
      ['柔和視覺提示', '使用固定色彩邊框提示；不使用閃光。']
    ];
    return `<section><p class="cross2e-note">先選一種你想使用的提示方式。任何設定都可在開始後改變，亦可以完全不選。</p><div class="cross2e-setting-grid">${options.map(([name, detail]) => `<button class="cross2e-setting${selected === name ? ' is-selected' : ''}" type="button" data-setting="${name}" aria-pressed="${selected === name}"><strong>${name}</strong><small>${detail}</small></button>`).join('')}</div></section>`;
  }

  function renderQuietLab() {
    const current = quietRounds[state.round];
    shell.innerHTML = dialog(`${top()}<main class="cross2e-play"><p class="cross2e-kicker">安靜觀察 · 第 ${state.round + 1} / ${quietRounds.length} 回合 · ${state.setting || '靜音＋靜態提示'}</p><h2 class="cross2e-title" id="cross2eTitle">安靜實驗室：觀察與選擇</h2><div class="cross2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="cross2e-board"><h3>${current.title}</h3><p class="cross2e-visual" aria-hidden="true">${current.visual}</p><p class="cross2e-prompt">${current.prompt}</p><div class="cross2e-choice-grid">${current.choices.map((choice) => `<button class="cross2e-choice" type="button" data-answer="${choice}">${choice}</button>`).join('')}</div></section>${supportButtons()}<p class="cross2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    $$('[data-answer]', shell).forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.answer === current.answer) { state.correct += 1; state.round += 1; state.round < quietRounds.length ? renderQuietLab() : finish(); }
      else { state.incorrect += 1; status('可以再看圖像、按提示，或請教師一起看；不需要快。', 'try'); }
    }));
    $('[data-answer]', shell).focus();
  }

  function renderConceptBlocks() {
    const current = rounds()[state.round];
    const selected = state.selectedTerm || '';
    shell.innerHTML = dialog(`${top()}<main class="cross2e-play"><p class="cross2e-kicker">概念表徵 · 第 ${state.round + 1} / ${conceptRounds.length} 回合</p><h2 class="cross2e-title" id="cross2eTitle">概念連結方塊</h2><div class="cross2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="cross2e-board"><h3>把概念卡連到圖像</h3><p class="cross2e-visual" aria-hidden="true">${current.visual}</p><p class="cross2e-prompt">${current.prompt}</p></section><p>可把概念卡拖到圖像區；也可先按概念卡，再按一個圖像區。</p><div class="cross2e-link-layout"><section aria-label="概念卡"><button class="cross2e-source${selected ? ' is-selected' : ''}" type="button" draggable="true" data-term="${current.term}"><strong>🧱 ${current.term}</strong><small>可拖拉或先點選，再選圖像區。</small></button></section><section class="cross2e-zone-grid" aria-label="圖像與關係鏈">${current.choices.map((choice) => `<button class="cross2e-zone" type="button" data-zone="${choice}" data-sen-drop-zone="concept"><strong>${choice}</strong><small>${choice === current.answer ? '一張科學圖像關係卡。' : '另一張可比較的圖像關係卡。'}</small></button>`).join('')}</section></div>${supportButtons()}<p class="cross2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    let dragging = '';
    const source = $('[data-term]', shell);
    source.addEventListener('click', () => { state.selectedTerm = current.term; renderConceptBlocks(); status('已選概念卡。現在選擇一張圖像關係卡。'); });
    source.addEventListener('dragstart', (event) => { dragging = current.term; try { event.dataTransfer.setData('text/plain', dragging); } catch {} });
    source.addEventListener('dragend', () => { dragging = ''; });
    $$('[data-zone]', shell).forEach((zone) => {
      zone.addEventListener('dragover', (event) => event.preventDefault());
      zone.addEventListener('drop', (event) => { event.preventDefault(); linkConcept(event.dataTransfer?.getData('text/plain') || dragging, zone.dataset.zone); dragging = ''; });
      zone.addEventListener('click', () => linkConcept(state.selectedTerm, zone.dataset.zone));
    });
    source.focus();
  }

  function renderCaseWorkshop() {
    const current = caseRounds[state.round];
    shell.innerHTML = dialog(`${top()}<main class="cross2e-play"><p class="cross2e-kicker">多角度推理 · 第 ${state.round + 1} / ${caseRounds.length} 回合</p><h2 class="cross2e-title" id="cross2eTitle">多角度案件工作室</h2><div class="cross2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="cross2e-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><section class="cross2e-note"><strong>先查看資料卡</strong><br>${current.evidence.map((item) => `• ${item}`).join('<br>')}</section><p>哪一項下一步較能同時看見規則、處境和受影響的人？不同人可以討論不同原因。</p><div class="cross2e-zone-grid">${current.choices.map((choice) => `<button class="cross2e-zone" type="button" data-case-choice="${choice}">${choice}</button>`).join('')}</div>${supportButtons()}<p class="cross2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    $$('[data-case-choice]', shell).forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.caseChoice === current.answer) { state.correct += 1; state.round += 1; state.round < caseRounds.length ? renderCaseWorkshop() : finish(); }
      else { state.incorrect += 1; status('這項做法可能只回應了部分資料。可再看資料卡、按提示或和教師討論另一種下一步。', 'try'); }
    }));
    $('[data-case-choice]', shell).focus();
  }

  function renderMemoryMap() {
    const current = mapRounds[state.round];
    const selected = state.selectedTerm || '';
    shell.innerHTML = dialog(`${top()}<main class="cross2e-play"><p class="cross2e-kicker">空間記憶 · 第 ${state.round + 1} / ${mapRounds.length} 回合</p><h2 class="cross2e-title" id="cross2eTitle">空間線索記憶地圖</h2><div class="cross2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="cross2e-board"><h3>選一個圖像房間</h3><p class="cross2e-visual" aria-hidden="true">${current.visual}</p><p class="cross2e-prompt">${current.prompt}</p></section><p>可拖拉線索卡到圖像房間；也可先按線索卡，再按一個房間。可使用圖像、首字、色彩、朗讀或自己的紙筆方式記住。</p><div class="cross2e-link-layout"><section aria-label="學習線索卡"><button class="cross2e-source${selected ? ' is-selected' : ''}" type="button" draggable="true" data-term="${current.term}"><strong>🗺️ ${current.term}</strong><small>可拖拉或先點選，再選圖像房間。</small></button></section><section class="cross2e-zone-grid" aria-label="圖像房間">${current.choices.map((choice) => `<button class="cross2e-zone" type="button" data-zone="${choice}" data-sen-drop-zone="memory"><strong>${choice}</strong><small>一個可選的回憶線索位置。</small></button>`).join('')}</section></div>${supportButtons()}<p class="cross2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    let dragging = '';
    const source = $('[data-term]', shell);
    source.addEventListener('click', () => { state.selectedTerm = current.term; renderMemoryMap(); status('已選線索卡。現在選擇一個圖像房間。'); });
    source.addEventListener('dragstart', (event) => { dragging = current.term; try { event.dataTransfer.setData('text/plain', dragging); } catch {} });
    source.addEventListener('dragend', () => { dragging = ''; });
    $$('[data-zone]', shell).forEach((zone) => {
      zone.addEventListener('dragover', (event) => event.preventDefault());
      zone.addEventListener('drop', (event) => { event.preventDefault(); linkConcept(event.dataTransfer?.getData('text/plain') || dragging, zone.dataset.zone); dragging = ''; });
      zone.addEventListener('click', () => linkConcept(state.selectedTerm, zone.dataset.zone));
    });
    source.focus();
  }

  function renderThoughtWorkbench() {
    const current = workbenchRounds[state.round];
    const placements = state.workbenchPlacements || {};
    const selected = state.selectedWorkbenchCard || '';
    const cards = [...current.cards].sort((a, b) => a[0].localeCompare(b[0], 'zh-HK'));
    const zones = ['事實卡', '可能想法卡', '支持選項卡'];
    shell.innerHTML = dialog(`${top()}<main class="cross2e-play"><p class="cross2e-kicker">角色工作台 · 第 ${state.round + 1} / ${workbenchRounds.length} 回合</p><h2 class="cross2e-title" id="cross2eTitle">思考與感受工作台</h2><div class="cross2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="cross2e-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><p>這是虛構角色的工作台。把每張卡放到相應欄位；可拖拉，也可先按卡再按欄位。你可用角色角度討論，無須分享私人經驗。</p><div class="cross2e-link-layout"><section class="cross2e-zone-grid" aria-label="角色線索卡">${cards.map(([type, text]) => `<button class="cross2e-source${selected === type ? ' is-selected' : ''}" type="button" draggable="true" data-work-card="${type}"><strong>${type}</strong><small>${text}</small></button>`).join('')}</section><section class="cross2e-zone-grid" aria-label="工作區">${zones.map((zone) => { const card = placements[zone]; const text = current.cards.find((item) => item[0] === card)?.[1]; return `<button class="cross2e-zone" type="button" data-work-zone="${zone}" data-sen-drop-zone="workbench"><strong>${zone}</strong><small>${text || '把相應卡放到這裡。'}</small></button>`; }).join('')}</section></div>${supportButtons()}<p class="cross2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true">所有卡都是用來理解角色情境的線索，不代表你本人。</p></main>`);
    bindShell();
    let dragging = '';
    $$('[data-work-card]', shell).forEach((card) => {
      card.addEventListener('click', () => { state.selectedWorkbenchCard = card.dataset.workCard; renderThoughtWorkbench(); status('已選線索卡。現在選擇一個工作區。'); });
      card.addEventListener('dragstart', (event) => { dragging = card.dataset.workCard; try { event.dataTransfer.setData('text/plain', dragging); } catch {} });
      card.addEventListener('dragend', () => { dragging = ''; });
    });
    $$('[data-work-zone]', shell).forEach((zone) => {
      zone.addEventListener('dragover', (event) => event.preventDefault());
      zone.addEventListener('drop', (event) => { event.preventDefault(); placeWorkbenchCard(event.dataTransfer?.getData('text/plain') || dragging, zone.dataset.workZone); dragging = ''; });
      zone.addEventListener('click', () => placeWorkbenchCard(state.selectedWorkbenchCard, zone.dataset.workZone));
    });
    $('[data-work-card]', shell).focus();
  }

  function placeWorkbenchCard(cardType, zoneType) {
    if (!cardType) { status('先選一張角色線索卡，再選一個工作區；也可以拖拉。', 'try'); return; }
    if (cardType !== zoneType) { state.incorrect += 1; status('可以再看卡片標題與內容，或請教師一起看。這是整理角色線索，不是對人的評價。', 'try'); return; }
    state.correct += 1;
    state.workbenchPlacements = { ...(state.workbenchPlacements || {}), [zoneType]: cardType };
    state.selectedWorkbenchCard = '';
    if (Object.keys(state.workbenchPlacements).length === 3) {
      state.round += 1;
      state.workbenchPlacements = {};
      state.round < workbenchRounds.length ? renderThoughtWorkbench() : finish();
    } else renderThoughtWorkbench();
  }

  function renderSocialDecoder() {
    const current = decoderRounds[state.round];
    shell.innerHTML = dialog(`${top()}<main class="cross2e-play"><p class="cross2e-kicker">社交線索 · 第 ${state.round + 1} / ${decoderRounds.length} 回合</p><h2 class="cross2e-title" id="cross2eTitle">社交線索解碼台</h2><div class="cross2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="cross2e-board"><h3>${current.title}</h3><p>${current.dialogue}</p></section><section class="cross2e-note"><strong>情境線索</strong><br>${current.clues.map((item) => `• ${item}`).join('<br>')}<br><br><strong>可能意思</strong><br>${current.possible.map((item) => `• ${item}`).join('<br>')}</section><p>沒有任何一句話能保證對方真正的意思。以下哪一句較能中性地確認或澄清下一步？</p><div class="cross2e-zone-grid">${current.choices.map((choice) => `<button class="cross2e-zone" type="button" data-decoder-choice="${choice}">${choice}</button>`).join('')}</div>${supportButtons()}<p class="cross2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    $$('[data-decoder-choice]', shell).forEach((button) => button.addEventListener('click', () => {
      if (current.answers.includes(button.dataset.decoderChoice)) { state.correct += 1; state.round += 1; state.round < decoderRounds.length ? renderSocialDecoder() : finish(); }
      else { state.incorrect += 1; status('這句可能直接推論了對方的意思。可再看情境線索，選一個確認、澄清或暫停回覆的說法。', 'try'); }
    }));
    $('[data-decoder-choice]', shell).focus();
  }

  function renderStoryEditor() {
    const current = storyRounds[state.round];
    const chosen = state.storyCards || [];
    shell.innerHTML = dialog(`${top()}<main class="cross2e-play"><p class="cross2e-kicker">故事編輯 · 第 ${state.round + 1} / ${storyRounds.length} 回合</p><h2 class="cross2e-title" id="cross2eTitle">成就故事編輯室</h2><div class="cross2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="cross2e-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><p>以下是虛構角色的故事卡。選一至兩張你想保留在「學習故事」中的證據；也可略過。這些卡不評定任何人的價值。</p><div class="cross2e-zone-grid">${current.cards.map((card) => `<button class="cross2e-source${chosen.includes(card) ? ' is-selected' : ''}" type="button" data-story-card="${card}" aria-pressed="${chosen.includes(card)}">${card}</button>`).join('')}</div><section class="cross2e-note"><strong>目前故事草稿</strong><br>${chosen.length ? chosen.map((card) => `• ${card}`).join('<br>') : '尚未選卡；你可選一張、略過或請教師一起看。'}</section><div class="cross2e-actions"><button class="cross2e-secondary" type="button" data-action="skip-story">略過故事卡</button><button class="cross2e-primary" type="button" data-action="finish-story">整理這一回合</button></div>${supportButtons()}<p class="cross2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bindShell();
    $$('[data-story-card]', shell).forEach((button) => button.addEventListener('click', () => {
      const card = button.dataset.storyCard;
      if (chosen.includes(card)) state.storyCards = chosen.filter((item) => item !== card);
      else if (chosen.length < 2) state.storyCards = [...chosen, card];
      else { status('最多保留兩張故事卡；也可以取消其中一張、略過或請教師一起看。', 'try'); return; }
      renderStoryEditor();
    }));
    $('[data-story-card]', shell).focus();
  }

  function finishStoryRound(skip = false) {
    if (skip) state.storyCards = [];
    if (state.storyCards?.length) state.correct += 1;
    state.round += 1;
    state.storyCards = [];
    state.round < storyRounds.length ? renderStoryEditor() : finish();
  }

  function renderCommunitySandbox() {
    const current = communityRounds[state.round];
    const plan = state.communityPlan || '';
    const question = state.communityQuestion || '';
    shell.innerHTML = dialog(`${top()}<main class="cross2e-play"><p class="cross2e-kicker">系統取捨 · 第 ${state.round + 1} / ${communityRounds.length} 回合</p><h2 class="cross2e-title" id="cross2eTitle">社區方案沙盒</h2><div class="cross2e-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="cross2e-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><section class="cross2e-note"><strong>已知限制與需要</strong><br>${current.constraints.map((item) => `• ${item}`).join('<br>')}</section><p>先選一個可試行的方案。每個方案都有不同取捨，可以日後修訂。</p><div class="cross2e-zone-grid">${current.plans.map(([name, detail]) => `<button class="cross2e-source${plan === name ? ' is-selected' : ''}" type="button" data-community-plan="${name}" aria-pressed="${plan === name}"><strong>${name}</strong><small>${detail}</small></button>`).join('')}</div>${plan ? `<section class="cross2e-note"><strong>下一個要問的問題</strong><br>選一個問題幫助下一輪討論，不需要找「完美」方案。<div class="cross2e-actions" style="margin-top:10px">${current.questions.map((item) => `<button class="cross2e-zone${question === item ? ' is-selected' : ''}" type="button" data-community-question="${item}" aria-pressed="${question === item}">${item}</button>`).join('')}</div></section><div class="cross2e-actions"><button class="cross2e-primary" type="button" data-action="finish-community" ${question ? '' : 'disabled'}>記下方案與問題</button></div>` : ''}${supportButtons()}<p class="cross2e-status" data-role="status" role="status" aria-live="polite" aria-atomic="true">這是虛構社區。活動呈現不同取捨和待問問題，不產生好／壞結局或城市分數。</p></main>`);
    bindShell();
    $$('[data-community-plan]', shell).forEach((button) => button.addEventListener('click', () => { state.communityPlan = button.dataset.communityPlan; state.communityQuestion = ''; renderCommunitySandbox(); }));
    $$('[data-community-question]', shell).forEach((button) => button.addEventListener('click', () => { state.communityQuestion = button.dataset.communityQuestion; renderCommunitySandbox(); }));
    $('[data-community-plan]', shell).focus();
  }

  function finishCommunityRound() {
    state.correct += 1;
    state.round += 1;
    state.communityPlan = '';
    state.communityQuestion = '';
    state.round < communityRounds.length ? renderCommunitySandbox() : finish();
  }

  function linkConcept(term, zone) {
    const current = rounds()[state.round];
    if (!term) { status('先選概念卡，再選一張圖像關係卡；也可以拖拉。', 'try'); return; }
    if (zone !== current.answer) { state.incorrect += 1; status('可以再看看圖像、按提示或換一張關係卡。所有嘗試都是找線索的一部分。', 'try'); return; }
    state.correct += 1;
    state.selectedTerm = '';
    if (state.readTerm) speak(`這個詞語是${current.read || current.term}。${current.answer}。`);
    state.round += 1;
    if (state.round >= rounds().length) finish();
    else if (activeKey === 'memory-map') renderMemoryMap();
    else renderConceptBlocks();
  }

  function finish() {
    const activity = activeActivity();
    const reflection = activeKey === 'quiet-lab'
      ? `你使用了「${state.setting || '自己選擇的提示方式'}」完成安靜觀察。教師可問：「下次你還想保留哪一種提示方式？」`
      : activeKey === 'concept-blocks'
        ? '你把概念卡連到圖像與關係鏈。教師可問：「哪一張圖像最幫助你記住這個詞語？」'
      : activeKey === 'case-workshop'
          ? '你查看規則、處境和影響資料，再找出一個可討論的下一步。教師可問：「還有哪一張資料卡值得再看一次？」'
          : activeKey === 'memory-map'
            ? '你把學習線索放到圖像房間。教師可問：「你想保留圖像、首字、色彩、朗讀，還是自己的紙筆方式？」'
            : activeKey === 'thought-workbench'
              ? '你用虛構角色整理了事實、可能想法和支持選項。教師可問：「哪一類線索最能幫角色決定下一步？」'
              : activeKey === 'social-decoder'
                ? '你查看對話的明說內容、情境線索與多個可能意思，再選擇中性確認句。教師可問：「還有甚麼問題可以幫助大家澄清？」'
                : activeKey === 'story-editor'
                  ? '你從虛構角色的作品、學習過程與支持選項中整理故事卡。教師可問：「這個故事還可以怎樣修訂？」'
                  : '你在虛構社區中選擇了可試行方案與下一個要問的問題。教師可問：「還想知道哪一位使用者的觀點？」';
    shell.innerHTML = dialog(`${top()}<main class="cross2e-finish"><p class="cross2e-kicker">本節回顧 · 不作能力評分</p><h2 class="cross2e-title" id="cross2eTitle">完成這次課堂練習</h2><strong>你完成了三個短回合。</strong><article class="cross2e-finish-card">${reflection}</article><div class="cross2e-actions"><button class="cross2e-secondary" type="button" data-action="restart">再做一次</button><button class="cross2e-primary" type="button" data-action="close">回到直接選關</button></div></main>`);
    bindShell();
    onComplete?.({ label: activity.title, correct: state.correct, incorrect: state.incorrect, total: rounds().length, stage: activeStage, nonDiagnostic: true });
    $('[data-action="close"]', shell).focus();
  }

  function handleAction(action) {
    const current = rounds()[state.round] || rounds()[0];
    if (action === 'close') return close();
    if (action === 'restart') { state = { round: 0, correct: 0, incorrect: 0, setting: '靜音＋靜態提示', selectedTerm: '', readTerm: false, supports: [], workbenchPlacements: {}, selectedWorkbenchCard: '', storyCards: [], communityPlan: '', communityQuestion: '' }; return renderReady(); }
    if (action === 'start') return startActivity();
    if (action === 'read-ready') return speak(`這是${activeActivity().title}。共有三個短回合。沒有倒數或扣分；你可看提示、先停一停、請教師一起看、換活動或離開。`);
    if (action === 'hint') { status(`提示：${current.hint}`, ''); return speak(`提示：${current.hint}`); }
    if (action === 'read-round') {
      if (activeKey === 'concept-blocks' || activeKey === 'memory-map') { state.readTerm = true; return speak(`${activeActivity().title}。${current.term}。${current.prompt}`); }
      if (activeKey === 'case-workshop') return speak(`${activeActivity().title}。${current.title}。${current.scenario}`);
      if (activeKey === 'thought-workbench') return speak(`${activeActivity().title}。${current.title}。${current.scenario}`);
      if (activeKey === 'social-decoder') return speak(`${activeActivity().title}。${current.title}。${current.dialogue}`);
      if (activeKey === 'story-editor') return speak(`${activeActivity().title}。${current.title}。${current.scenario}`);
      if (activeKey === 'community-sandbox') return speak(`${activeActivity().title}。${current.title}。${current.scenario}`);
      return speak(`安靜實驗室。${current.title}。${current.prompt}`);
    }
    if (action === 'pause') { state.supports.push('先停一停'); return status('已選擇先停一停。可以安靜看一看、喝水、請教師一起看，或直接離開。'); }
    if (action === 'teacher') { state.supports.push('請教師一起看'); return status('教師可用紙筆、指向或口頭示範第一步；你可以自行決定下一步。'); }
    if (action === 'skip-story') return finishStoryRound(true);
    if (action === 'finish-story') return finishStoryRound(false);
    if (action === 'finish-community') return finishCommunityRound();
  }

  function startActivity() {
    if (activeKey === 'quiet-lab') return renderQuietLab();
    if (activeKey === 'concept-blocks') return renderConceptBlocks();
    if (activeKey === 'case-workshop') return renderCaseWorkshop();
    if (activeKey === 'memory-map') return renderMemoryMap();
    if (activeKey === 'thought-workbench') return renderThoughtWorkbench();
    if (activeKey === 'social-decoder') return renderSocialDecoder();
    if (activeKey === 'story-editor') return renderStoryEditor();
    return renderCommunitySandbox();
  }

  function bindShell() {
    $$('[data-action]', shell).forEach((button) => button.addEventListener('click', () => handleAction(button.dataset.action)));
    $$('[data-setting]', shell).forEach((button) => button.addEventListener('click', () => { state.setting = button.dataset.setting; renderReady(); status(`已選擇${state.setting}。開始後仍可使用朗讀、提示、暫停或離開。`); }));
  }
  function focusables() { return $$('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', shell); }
  function trapFocus(event) {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusables(); if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  function close() { window.speechSynthesis?.cancel?.(); shell?.remove(); shell = null; trigger?.focus?.({ preventScroll: true }); }
  function openActivity(key, options = {}) {
    if (!Object.values(activities).flat().some((item) => item.key === key)) return;
    addStyles(); close(); activeKey = key; activeStage = options.stage || 'lower'; trigger = options.trigger || document.activeElement; onComplete = options.onComplete;
    state = { round: 0, correct: 0, incorrect: 0, setting: '靜音＋靜態提示', selectedTerm: '', readTerm: false, supports: [], workbenchPlacements: {}, selectedWorkbenchCard: '', storyCards: [], communityPlan: '', communityQuestion: '' };
    shell = document.createElement('div'); shell.className = 'cross2e-overlay'; shell.addEventListener('keydown', trapFocus); shell.addEventListener('mousedown', (event) => { if (event.target === shell) close(); }); document.body.append(shell); renderReady();
  }

  window.GIFTED_CROSS_SEN_LAB = { activityCards, openActivity };
})();
