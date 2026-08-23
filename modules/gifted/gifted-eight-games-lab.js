/* Giftedness 八項課堂活動：教師帶領、非診斷性、低壓直接選關。 */
(() => {
  const activities = {
    lower: [
      {
        key: 'flex-castle', icon: '🏰', title: '彈性城堡工房',
        description: '使用現有的功能卡建造可使用的城堡；可保留、調整或換一種可行設計。',
        tag: 'Giftedness · 初小 P1–P3 · 3 回合'
      },
      {
        key: 'selective-listening', icon: '🎼', title: '指揮家的選擇性聆聽台',
        description: '先選一條你想跟隨的節奏線索，再慢慢辨認規律；聲音和動態均可關閉。',
        tag: 'Giftedness · 初小 P1–P3 · 3 回合'
      }
    ],
    upper: [
      {
        key: 'viewpoint-studio', icon: '🪐', title: '宇宙觀點工作室',
        description: '閱讀不同角色以圖像、短句或條列提供的資料，找出可支持下一步理解的提問。',
        tag: 'Giftedness · 高小 P4–P6 · 3 回合'
      },
      {
        key: 'rule-sandbox', icon: '🧭', title: '規則設計沙盒',
        description: '比較規則草案對不同使用者的影響，再提出可修訂、可試行的下一步。',
        tag: 'Giftedness · 高小 P4–P6 · 3 回合'
      }
    ], junior: [
      {
        key: 'perspective-toolkit', icon: '🧰', title: '情境觀點工具箱',
        description: '整理虛構角色的可確定資料、未知處與支持選項；可以選「需要更多資料」。',
        tag: 'Giftedness · 初中 S1–S3 · 3 回合'
      },
      {
        key: 'tone-workbench', icon: '🗣️', title: '說話溫度工作台',
        description: '把清楚的觀察、可修訂建議和尊重收尾組成訊息；不評定人格或社交能力。',
        tag: 'Giftedness · 初中 S1–S3 · 3 回合'
      }
    ], senior: [
      {
        key: 'achievement-map', icon: '🗺️', title: '多元成就地圖',
        description: '從虛構角色的學習、創作、關係和休息投入中選擇想保留的故事線索；不涉及分數或排名。',
        tag: 'Giftedness · 高中 S4–S6 · 3 回合'
      },
      {
        key: 'values-sandbox', icon: '🌌', title: '哲學價值沙盒',
        description: '在虛構社區方案中選取、略過或拒絕價值卡，提出下一個想探索的問題；沒有正確人生答案。',
        tag: 'Giftedness · 高中 S4–S6 · 3 回合'
      }
    ]
  };

  const castleRounds = [
    {
      title: '看得見的入口',
      prompt: '城堡要讓訪客知道從哪裡進入。把每張功能卡放到最相符的位置。',
      cards: [['入口標示', '入口位置'], ['安全欄杆', '城牆邊'], ['歡迎旗幟', '塔頂']],
      hint: '想想每張卡要幫誰，並看看它要做到甚麼功能。'
    },
    {
      title: '雨天通道',
      prompt: '今天會下雨。把功能卡放到能幫助訪客使用城堡的位置。',
      cards: [['遮雨蓋', '入口位置'], ['防滑石路', '通道地面'], ['觀察窗', '城牆邊']],
      hint: '不是找「最漂亮」的設計，而是看看每張卡可以幫助甚麼。'
    },
    {
      title: '分享花園',
      prompt: '城堡花園要讓不同訪客都可使用。把功能卡放到合適的位置。',
      cards: [['休息長椅', '花園中央'], ['清楚路牌', '分岔位置'], ['小樹苗', '花園邊']],
      hint: '可以先選一張卡，再按一個位置；不需要一次完成所有卡。'
    }
  ];

  const listeningRounds = [
    {
      title: '選一條節奏線', visual: '●　●　○　●　●　○　？',
      prompt: '只跟隨「圓點」這一條線索。下一個應該是甚麼？',
      answer: '○', choices: ['●', '○', '△'],
      hint: '慢慢看：每兩個實心圓後面，是一個空心圓。'
    },
    {
      title: '低聲部規律', visual: '■　△　■　△　■　？',
      prompt: '只跟隨「方形、三角形」這一條線索。下一個應該是甚麼？',
      answer: '△', choices: ['■', '△', '○'],
      hint: '方形與三角形輪流出現。'
    },
    {
      title: '指揮手勢', visual: '↗　↗　↘　↗　↗　↘　？',
      prompt: '只跟隨箭咀方向。下一個應該是甚麼？',
      answer: '↗', choices: ['↘', '↗', '→'],
      hint: '每一組有兩個向上箭咀，再有一個向下箭咀。'
    }
  ];

  const viewpointRounds = [
    {
      title: '星際園圃的水源',
      scenario: '虛構星球的校園園圃想節省用水，但不同角色關心的地方不同。',
      reports: ['🛰️ 資料員：上星期雨量較少，水箱只剩一半。', '🌱 園藝員：幼苗每天需要少量水，不能完全停水。', '🧑‍🎓 學生：想知道可否把洗手後的清水收集作澆灌。'],
      answer: '先問：哪些用水可安全重用，以及幼苗最少需要多少水？',
      choices: ['只選一位角色的說法，其他資料不需要看。', '先問：哪些用水可安全重用，以及幼苗最少需要多少水？', '直接規定所有人不能使用水。'],
      hint: '看看哪一個問題能連結不同角色提供的資料。'
    },
    {
      title: '月球圖書艙',
      scenario: '虛構月球圖書艙要安排安靜閱讀與小組研究的位置。',
      reports: ['📚 閱讀者：需要一個不易被談話打擾的位置。', '🔬 研究小組：需要短時間討論實驗資料。', '🧑‍🚀 管理員：艙內空間有限，可以移動兩組書架。'],
      answer: '先問：哪兩組書架移動後可同時留出安靜區與短時討論區？',
      choices: ['只保留一種使用方式。', '先問：哪兩組書架移動後可同時留出安靜區與短時討論區？', '請大家自行找地方，不需要安排。'],
      hint: '找一個能把空間限制和不同使用方式一起考慮的問題。'
    },
    {
      title: '火星探測展',
      scenario: '虛構班級要準備火星探測展，不同組別想展示不同資料。',
      reports: ['🗺️ 地圖組：想展示火星地貌的大圖。', '📊 數據組：想展示溫度和風速變化。', '🎤 導覽組：想讓訪客容易知道先看甚麼。'],
      answer: '先問：可否用一張導覽卡連結地圖、數據與參觀順序？',
      choices: ['只展示最複雜的一份資料。', '先問：可否用一張導覽卡連結地圖、數據與參觀順序？', '取消所有人的展示想法。'],
      hint: '有些方案不是刪除內容，而是幫助人們看見內容之間的連結。'
    }
  ];

  const ruleRounds = [
    {
      title: '太空港排隊線',
      scenario: '虛構太空港在放學時很繁忙。家庭、步行學生和工作人員都要安全使用入口。',
      needs: ['家庭希望接送流程清楚。', '步行學生需要安全過路位置。', '工作人員需要看見入口情況。'],
      answer: '先試行分時入口與清楚步行線，並邀請不同使用者提出觀察。',
      choices: ['先試行分時入口與清楚步行線，並邀請不同使用者提出觀察。', '只有最快的人可以先進入。', '不需要任何安排。'],
      hint: '可行規則通常要說清楚誰受影響、怎樣試行，以及何時修訂。'
    },
    {
      title: '共享創作室',
      scenario: '虛構創作室有繪圖板、模型材料和安靜角，很多小組想同時使用。',
      needs: ['小組希望知道何時可使用材料。', '有人需要安靜完成細節工作。', '教師希望每個人都有公平機會。'],
      answer: '先用可見預約卡和安靜時段試行一週，再一起修訂。',
      choices: ['先用可見預約卡和安靜時段試行一週，再一起修訂。', '只有最先搶到材料的人可使用。', '把所有材料鎖起來。'],
      hint: '看看哪一項有清楚做法，也留下修訂空間。'
    },
    {
      title: '校園花圃小徑',
      scenario: '虛構校園花圃小徑有人想觀察昆蟲，有人要運送材料，也有人需要平緩通道。',
      needs: ['觀察者希望保留植物空間。', '材料組需要一條可推車路線。', '不同使用者需要容易辨認的方向。'],
      answer: '先標示一條平緩路線與觀察區，再收集使用者意見調整。',
      choices: ['先標示一條平緩路線與觀察區，再收集使用者意見調整。', '只考慮一種使用者。', '完全封閉花圃。'],
      hint: '規則可同時保護事情，也要讓人知道如何參與下一次修訂。'
    }
  ];

  const perspectiveRounds = [
    {
      title: '小組的檔案連結',
      scenario: '虛構角色洛文打開共用檔案時，發現一張原本的圖表不在頁面上。',
      facts: ['可確定：目前頁面看不到那張圖表。', '未知：圖表是否被刪除、移到別頁或尚未同步。', '可支持下一步：先查看版本紀錄，或請組員一起找。'],
      answer: '先查看版本紀錄，並用中性句確認圖表是否移到別頁。',
      choices: ['先查看版本紀錄，並用中性句確認圖表是否移到別頁。', '直接認定有人故意刪掉資料。', '不看資料，立刻停止所有人的工作。'],
      hint: '先分開可確定的事、未知的地方和可支持的下一步。'
    },
    {
      title: '活動時間改期',
      scenario: '虛構角色芷晴收到通知：原定的研究工作坊因場地安排而改期。',
      facts: ['可確定：工作坊已改期。', '未知：新日期是否與其他活動重疊。', '可支持下一步：查看新日期、提出需要或問替代安排。'],
      answer: '先查看新日期，再詢問是否有替代安排或需要預先準備的資料。',
      choices: ['先查看新日期，再詢問是否有替代安排或需要預先準備的資料。', '直接假定改期代表活動不重要。', '要求所有安排一定要維持原樣。'],
      hint: '有時不知道原因或結果時，可以先問一條能幫助安排下一步的問題。'
    },
    {
      title: '收到修訂建議',
      scenario: '虛構角色希朗的提案收到回饋：「可以令重點更清楚。」',
      facts: ['可確定：回饋建議讓重點更清楚。', '未知：哪一部分最需要優先調整。', '可支持下一步：請對方指出一個例子，再選一小部分修訂。'],
      answer: '請對方指出一個例子，並先選一小部分一起修訂。',
      choices: ['請對方指出一個例子，並先選一小部分一起修訂。', '直接認定整份提案沒有價值。', '不需要任何資料便完全拒絕回饋。'],
      hint: '一個具體例子通常比猜測對方全部意思更能幫助下一步。'
    }
  ];

  const toneRounds = [
    {
      title: '旅行提案的交通資料',
      draft: '你這個交通安排完全不可行。',
      answer: '我看到你已整理了景點；我們可否一起補上每段交通時間，再比較兩個安排？',
      choices: ['我看到你已整理了景點；我們可否一起補上每段交通時間，再比較兩個安排？', '這個安排一看就知道不對。', '不用討論，直接把你的部分刪掉。'],
      hint: '可先說清楚看見了甚麼，再提出一個具體可修訂的下一步。'
    },
    {
      title: '海報的資料來源',
      draft: '你的資料根本不能用。',
      answer: '我想確認這一段的來源；我們可否一起補上連結，再決定要不要保留？',
      choices: ['我想確認這一段的來源；我們可否一起補上連結，再決定要不要保留？', '這段太差，全部重做。', '你為甚麼永遠不查清楚？'],
      hint: '把評價換成可檢查的資料問題，通常更容易讓大家一起完成下一步。'
    },
    {
      title: '分工時間表',
      draft: '你又沒有按時間表做。',
      answer: '我看到這一部分還未更新；你想先說說目前卡在哪裡，還是我們一起調整時間表？',
      choices: ['我看到這一部分還未更新；你想先說說目前卡在哪裡，還是我們一起調整時間表？', '你拖慢了所有人。', '以後不要再做這個部分。'],
      hint: '清楚指出目前資料，再提供選擇或確認問題，能讓訊息保留重點而不貶抑對方。'
    }
  ];

  const achievementRounds = [
    {
      title: '設計展前一週',
      scenario: '虛構角色思嵐正準備設計展。她同時要整理作品、和朋友打球，以及預留一晚休息。',
      cards: ['作品整理：選出三張最能說明設計過程的草圖。', '關係投入：和朋友預留一段不談展覽的運動時間。', '休息安排：選擇一晚不修改作品，明天再檢查。'],
      prompt: '選一至兩張你想保留在思嵐「多元投入地圖」的卡；也可以略過。'
    },
    {
      title: '小組研究完成後',
      scenario: '虛構角色子澄的小組剛完成一項研究。他想整理接下來的學習、興趣和連結。',
      cards: ['學習線索：寫下一個仍想追問的研究問題。', '創作線索：把資料改成一張讓不同人容易看的圖。', '關係線索：邀請組員各分享一個想保留的合作做法。'],
      prompt: '選一至兩張你想保留在子澄「多元投入地圖」的卡；也可以略過。'
    },
    {
      title: '週末的選擇',
      scenario: '虛構角色雅懿有一個自由週末。她想兼顧學習、好奇、休息和身邊的人。',
      cards: ['好奇線索：花一小時探索一個沒有考試要求的主題。', '生活線索：完成一件讓下週更容易開始的小事。', '關係線索：和一位重要的人安排一段共同活動。'],
      prompt: '選一至兩張你想保留在雅懿「多元投入地圖」的卡；也可以略過。'
    }
  ];

  const valuesRounds = [
    {
      title: '夜間觀星計劃',
      scenario: '虛構社區想開放夜間觀星活動。團隊要在光害、安全、學習機會和社區安靜之間設計可試行方案。',
      values: ['求知', '關係', '安全', '創造'],
      question: '你想先探索哪一項價值如何影響方案？你也可以略過或拒絕全部價值卡。'
    },
    {
      title: '舊工場的新用途',
      scenario: '虛構社區有一座舊工場。有人想設創作室，有人想設安靜閱讀區，也有人希望保留歷史痕跡。',
      values: ['創造', '穩定', '自由', '連結'],
      question: '你想先探索哪一項價值如何影響方案？你也可以略過或拒絕全部價值卡。'
    },
    {
      title: '海岸學習站',
      scenario: '虛構學校計劃在海岸設學習站。學生想觀察生態，居民關心保育和通道使用。',
      values: ['助人', '求知', '自由', '關係'],
      question: '你想先探索哪一項價值如何影響方案？你也可以略過或拒絕全部價值卡。'
    }
  ];

  let shell; let trigger; let onComplete; let activeStage; let activeKey; let state;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const stageLabel = (stage) => ({ lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' })[stage] || 'Giftedness 課堂練習';
  const currentActivity = () => Object.values(activities).flat().find((item) => item.key === activeKey);
  const rounds = () => ({ 'flex-castle': castleRounds, 'selective-listening': listeningRounds, 'viewpoint-studio': viewpointRounds, 'rule-sandbox': ruleRounds, 'perspective-toolkit': perspectiveRounds, 'tone-workbench': toneRounds, 'achievement-map': achievementRounds, 'values-sandbox': valuesRounds })[activeKey] || listeningRounds;
  const isCastle = () => activeKey === 'flex-castle';

  function activityCards(stage) {
    return (activities[stage] || []).map((item) => ({
      id: `gifted-eight-${item.key}`, icon: item.icon, title: item.title,
      description: item.description, tag: item.tag, tone: 'purple', supports: ['G'], giftedEightActivity: item.key
    }));
  }

  function styles() {
    if ($('#giftedEightStyles')) return;
    const style = document.createElement('style'); style.id = 'giftedEightStyles';
    style.textContent = `
      .g8-overlay{position:fixed;inset:0;z-index:1005;display:grid;place-items:center;padding:18px;overflow:auto;background:rgba(25,14,51,.72)}
      .g8-dialog{width:min(920px,100%);max-height:calc(100vh - 36px);overflow:auto;padding:clamp(18px,4vw,38px);border:2px solid #d8c8fb;border-radius:24px;background:#fffdf8;color:#2a213d;box-shadow:0 24px 70px rgba(18,8,41,.4)}
      .g8-dialog button{min-width:40px;min-height:44px;font:inherit}.g8-dialog button:focus-visible{outline:3px solid #1470b7;outline-offset:3px}
      .g8-top,.g8-actions,.g8-tools{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.g8-top{justify-content:space-between;padding-bottom:14px;border-bottom:1px solid #e9e2f6}.g8-top p{margin:0;color:#574b73;font-weight:800}
      .g8-kicker{margin:0 0 6px;color:#6339a7;font-size:.93rem;font-weight:850;letter-spacing:.04em}.g8-title{margin:0;font-size:clamp(1.55rem,4vw,2.25rem);line-height:1.2}.g8-lead{max-width:68ch;line-height:1.65;font-size:1.04rem}
      .g8-primary,.g8-secondary,.g8-quiet,.g8-choice,.g8-card,.g8-slot,.g8-setting{border:2px solid transparent;border-radius:14px;padding:10px 14px;transition:transform .16s cubic-bezier(.23,1,.32,1),box-shadow .16s cubic-bezier(.23,1,.32,1),opacity .16s cubic-bezier(.23,1,.32,1)}
      .g8-primary{border-color:#6236a8;background:#6236a8;color:#fff;font-weight:850}.g8-secondary{border-color:#8f6acb;background:#fff;color:#4d2a88;font-weight:800}.g8-quiet{border-color:#dfd3f6;background:#f5f0ff;color:#4b3d71;font-weight:750}.g8-choice{border-color:#c4afe8;background:#fff;color:#34224d;font-size:1.12rem;font-weight:850}.g8-card{border-color:#c4afe8;background:#f9f4ff;color:#42236d;text-align:left;font-weight:850}.g8-slot{border-color:#a7d7c7;background:#f0fbf7;color:#1e594b;text-align:left;font-weight:800}.g8-setting{border-color:#9fc8ec;background:#f0f8ff;color:#21466e;text-align:left;font-weight:800}
      .g8-primary:active,.g8-secondary:active,.g8-quiet:active,.g8-choice:active,.g8-card:active,.g8-slot:active,.g8-setting:active{transform:scale(.97)}.g8-card.is-selected,.g8-setting.is-selected{border-color:#5d38a1;background:#e9e0ff;box-shadow:0 6px 15px rgba(81,43,139,.16)}.g8-slot.is-drop-target{box-shadow:0 0 0 4px rgba(73,170,137,.25);transform:scale(1.01)}
      .g8-ready,.g8-play,.g8-finish{display:grid;gap:17px}.g8-rules{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.g8-rule{padding:14px;border:1px solid #d9cdf6;border-radius:16px;background:#f6f3ff;line-height:1.5}.g8-rule strong{display:block;margin-bottom:4px;color:#59339c}
      .g8-progress{height:12px;overflow:hidden;border-radius:999px;background:#eae3f7}.g8-progress>span{display:block;height:100%;background:#6941ad;transition:width .2s cubic-bezier(.23,1,.32,1)}.g8-board{padding:clamp(16px,3vw,28px);border:1px solid #e0d5f5;border-radius:20px;background:linear-gradient(140deg,#f8f4ff,#fff9ef);text-align:center}.g8-board h3{margin:0 0 8px;font-size:1.32rem}.g8-prompt{font-size:clamp(1.16rem,4vw,1.8rem);font-weight:850;line-height:1.55}.g8-visual{margin:8px 0 14px;font-size:clamp(1.55rem,6vw,2.5rem);letter-spacing:.1em}.g8-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.g8-setting-grid,.g8-build-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.g8-stack{display:grid;gap:10px}.g8-card small,.g8-slot small,.g8-setting small{display:block;margin-top:4px;font-weight:550;line-height:1.4}.g8-status{min-height:1.6em;margin:0;padding:10px 12px;border-radius:12px;background:#eef8f1;color:#1d5f3a;font-weight:750;line-height:1.5}.g8-status[data-state="try"]{background:#fff6df;color:#754e06}.g8-status:empty{display:none}.g8-note{padding:12px 14px;border-left:4px solid #4c83bb;border-radius:8px;background:#f0f7ff;line-height:1.55}.g8-finish{text-align:center;padding:8px 0}.g8-finish strong{font-size:1.25rem;color:#59329a}.g8-finish-card{padding:16px;border-radius:18px;background:#f3effd;line-height:1.6}
      @media(max-width:560px){.g8-overlay{padding:0;align-items:start}.g8-dialog{min-height:100vh;max-height:none;padding:18px;border-radius:0}.g8-rules,.g8-choice-grid,.g8-setting-grid,.g8-build-grid{grid-template-columns:1fr}.g8-actions>*{flex:1}.g8-top{align-items:flex-start}}@media(max-width:430px){.game-card[data-gifted-eight-activity]{grid-column:1 / -1;min-height:0;padding:18px;text-align:left}}@media(prefers-reduced-motion:reduce){.g8-dialog *{transition:none!important;animation:none!important}}
    `; document.head.append(style);
  }

  function speak(text) { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ' ')); utterance.lang = 'zh-HK'; utterance.rate = .76; window.speechSynthesis.speak(utterance); }
  const dialog = (body) => `<section class="g8-dialog" role="dialog" aria-modal="true" aria-labelledby="g8Title" tabindex="-1">${body}</section>`;
  const top = () => `<div class="g8-top"><p>${stageLabel(activeStage)} · Giftedness 課堂練習</p><button type="button" class="g8-quiet" data-action="close">離開練習</button></div>`;
  const progress = () => Math.round((state.round / rounds().length) * 100);
  const tools = () => `<div class="g8-tools"><button type="button" class="g8-secondary" data-action="hint">💡 看提示</button><button type="button" class="g8-secondary" data-action="read">🔊 朗讀這頁</button><button type="button" class="g8-quiet" data-action="pause">先停一停</button><button type="button" class="g8-quiet" data-action="teacher">請教師一起看</button></div>`;
  function status(text = '', kind = '') { const node = $('[data-role="status"]', shell); if (node) { node.textContent = text; node.dataset.state = kind; } }

  function ready() {
    const activity = currentActivity();
    shell.innerHTML = dialog(`${top()}<main class="g8-ready"><p class="g8-kicker">Giftedness · 非診斷性教師帶領</p><h2 class="g8-title" id="g8Title">${activity.title} · 準備頁</h2><p class="g8-lead">這是三回合的高認知課堂練習。你可選支持方式、慢慢完成或隨時改變主意；結果只作本節回顧，不代表情緒、感官、社交或能力。</p><div class="g8-rules"><article class="g8-rule"><strong>1. 先選舒服方式</strong>可使用靜態提示、可選朗讀或教師示範；不需要忍受不舒服刺激。</article><article class="g8-rule"><strong>2. 尋找可行方案</strong>這裡比較功能、理由和不同選擇，沒有完美作品、倒數、扣分或敗局。</article><article class="g8-rule"><strong>3. 可以停下</strong>可看提示、先停一停、請教師一起看、轉換活動或隨時離開。</article></div>${activeKey === 'selective-listening' ? settings() : ''}<div class="g8-actions"><button type="button" class="g8-secondary" data-action="read-ready">🔊 朗讀規則</button><button type="button" class="g8-primary" id="g8ReadyStart" data-action="start">我準備好了</button></div></main>`);
    bind(); $('#g8ReadyStart', shell).focus();
  }

  function settings() {
    const selected = state.setting || '靜態圖像線索';
    const options = [['靜態圖像線索', '只看圖像和文字，不播放聲音或動態。'], ['可選朗讀', '只在你按朗讀按鈕時讀出題目。'], ['單一線索模式', '每次只顯示一條規律，按需要再看其他資料。']];
    return `<section><p class="g8-note">先選一種你想使用的方式。這些設定可在開始後改變，也可以不選。</p><div class="g8-setting-grid">${options.map(([name, detail]) => `<button type="button" class="g8-setting${selected === name ? ' is-selected' : ''}" data-setting="${name}" aria-pressed="${selected === name}"><strong>${name}</strong><small>${detail}</small></button>`).join('')}</div></section>`;
  }

  function renderCastle() {
    const current = castleRounds[state.round]; const selected = state.selectedCard || ''; const placed = state.placed || {};
    shell.innerHTML = dialog(`${top()}<main class="g8-play"><p class="g8-kicker">彈性建構 · 第 ${state.round + 1} / ${castleRounds.length} 回合</p><h2 class="g8-title" id="g8Title">彈性城堡工房</h2><div class="g8-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="g8-board"><h3>${current.title}</h3><p class="g8-prompt">${current.prompt}</p></section><p>可拖拉功能卡到位置；也可先按卡，再按位置。這是找可使用的方法，不是找唯一完美城堡。</p><div class="g8-build-grid"><section class="g8-stack" aria-label="功能卡">${current.cards.map(([card, target]) => `<button type="button" class="g8-card${selected === card ? ' is-selected' : ''}" draggable="true" data-g8-card="${card}"><strong>🧱 ${card}</strong><small>把它放到最相符的位置。</small></button>`).join('')}</section><section class="g8-stack" aria-label="城堡位置">${[...new Set(current.cards.map((item) => item[1]))].map((slot) => { const card = placed[slot]; return `<button type="button" class="g8-slot" data-g8-slot="${slot}" data-sen-drop-zone="gifted-castle"><strong>${slot}</strong><small>${card ? `已放入：${card}` : '放入一張功能卡。'}</small></button>`; }).join('')}</section></div>${tools()}<p class="g8-status" data-role="status" role="status" aria-live="polite" aria-atomic="true">你可以從任何一張卡開始。</p></main>`);
    bind(); let dragging = '';
    $$('[data-g8-card]', shell).forEach((card) => { card.addEventListener('click', () => { state.selectedCard = card.dataset.g8Card; renderCastle(); status('已選功能卡。現在選擇一個城堡位置。'); }); card.addEventListener('dragstart', (event) => { dragging = card.dataset.g8Card; try { event.dataTransfer.setData('text/plain', dragging); } catch {} }); card.addEventListener('dragend', () => { dragging = ''; }); });
    $$('[data-g8-slot]', shell).forEach((slot) => { slot.addEventListener('dragover', (event) => { event.preventDefault(); slot.classList.add('is-drop-target'); }); slot.addEventListener('dragleave', () => slot.classList.remove('is-drop-target')); slot.addEventListener('drop', (event) => { event.preventDefault(); slot.classList.remove('is-drop-target'); placeCastle(event.dataTransfer?.getData('text/plain') || dragging, slot.dataset.g8Slot); dragging = ''; }); slot.addEventListener('click', () => placeCastle(state.selectedCard, slot.dataset.g8Slot)); });
    $('[data-g8-card]', shell).focus();
  }

  function placeCastle(card, slot) {
    if (!card) { status('先選一張功能卡，再選一個位置；也可以直接拖拉。', 'try'); return; }
    const current = castleRounds[state.round]; const expected = current.cards.find((item) => item[0] === card)?.[1];
    if (expected !== slot) { state.retries += 1; status('這個位置可能未能發揮該功能。可以再看卡片用途、換位置，或請教師一起看。', 'try'); return; }
    state.correct += 1; state.placed = { ...state.placed, [slot]: card }; state.selectedCard = '';
    if (Object.keys(state.placed).length === current.cards.length) { state.round += 1; state.placed = {}; state.round < castleRounds.length ? renderCastle() : finish(); } else renderCastle();
  }

  function renderListening() {
    const current = listeningRounds[state.round];
    shell.innerHTML = dialog(`${top()}<main class="g8-play"><p class="g8-kicker">選擇性聆聽 · 第 ${state.round + 1} / ${listeningRounds.length} 回合 · ${state.setting || '靜態圖像線索'}</p><h2 class="g8-title" id="g8Title">指揮家的選擇性聆聽台</h2><div class="g8-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="g8-board"><h3>${current.title}</h3><p class="g8-visual" aria-hidden="true">${current.visual}</p><p class="g8-prompt">${current.prompt}</p><div class="g8-choice-grid">${current.choices.map((choice) => `<button type="button" class="g8-choice" data-g8-choice="${choice}">${choice}</button>`).join('')}</div></section>${tools()}<p class="g8-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bind(); $$('[data-g8-choice]', shell).forEach((button) => button.addEventListener('click', () => { if (button.dataset.g8Choice === current.answer) { state.correct += 1; state.round += 1; state.round < listeningRounds.length ? renderListening() : finish(); } else { state.retries += 1; status('可以慢慢只看一條線索、按提示或請教師一起看；不需要快。', 'try'); } })); $('[data-g8-choice]', shell).focus();
  }

  function renderViewpointStudio() {
    const current = viewpointRounds[state.round];
    shell.innerHTML = dialog(`${top()}<main class="g8-play"><p class="g8-kicker">多角度推理 · 第 ${state.round + 1} / ${viewpointRounds.length} 回合</p><h2 class="g8-title" id="g8Title">宇宙觀點工作室</h2><div class="g8-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="g8-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><section class="g8-note"><strong>角色資料</strong><br>${current.reports.map((item) => `• ${item}`).join('<br>')}</section><p>以下哪一個下一步問題較能把不同資料連起來？沒有任何角色的表達方式較好或較差。</p><div class="g8-stack">${current.choices.map((choice) => `<button type="button" class="g8-slot" data-g8-view="${choice}">${choice}</button>`).join('')}</div>${tools()}<p class="g8-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bind(); $$('[data-g8-view]', shell).forEach((button) => button.addEventListener('click', () => { if (button.dataset.g8View === current.answer) { state.correct += 1; state.round += 1; state.round < viewpointRounds.length ? renderViewpointStudio() : finish(); } else { state.retries += 1; status('這個選項可能未連結所有資料。可再看角色資料、按提示或請教師一起看。', 'try'); } })); $('[data-g8-view]', shell).focus();
  }

  function renderRuleSandbox() {
    const current = ruleRounds[state.round];
    shell.innerHTML = dialog(`${top()}<main class="g8-play"><p class="g8-kicker">制度設計 · 第 ${state.round + 1} / ${ruleRounds.length} 回合</p><h2 class="g8-title" id="g8Title">規則設計沙盒</h2><div class="g8-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="g8-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><section class="g8-note"><strong>不同需要</strong><br>${current.needs.map((item) => `• ${item}`).join('<br>')}</section><p>哪個草案有可理解的做法，也留下試行與修訂空間？這是比較不同制度設計，不是獎勵服從。</p><div class="g8-stack">${current.choices.map((choice) => `<button type="button" class="g8-slot" data-g8-rule="${choice}">${choice}</button>`).join('')}</div>${tools()}<p class="g8-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bind(); $$('[data-g8-rule]', shell).forEach((button) => button.addEventListener('click', () => { if (button.dataset.g8Rule === current.answer) { state.correct += 1; state.round += 1; state.round < ruleRounds.length ? renderRuleSandbox() : finish(); } else { state.retries += 1; status('這項草案可能未回應部分需要，或未留下修訂方法。可再看資料、按提示或和教師討論。', 'try'); } })); $('[data-g8-rule]', shell).focus();
  }

  function renderPerspectiveToolkit() {
    const current = perspectiveRounds[state.round];
    shell.innerHTML = dialog(`${top()}<main class="g8-play"><p class="g8-kicker">情境觀點 · 第 ${state.round + 1} / ${perspectiveRounds.length} 回合</p><h2 class="g8-title" id="g8Title">情境觀點工具箱</h2><div class="g8-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="g8-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><section class="g8-note"><strong>工具箱資料</strong><br>${current.facts.map((item) => `• ${item}`).join('<br>')}</section><p>以下哪一個下一步較能先看資料、保留未知處，並提供可支持的選擇？這是虛構角色，無須分享私人經驗。</p><div class="g8-stack">${current.choices.map((choice) => `<button type="button" class="g8-slot" data-g8-perspective="${choice}">${choice}</button>`).join('')}</div>${tools()}<p class="g8-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bind(); $$('[data-g8-perspective]', shell).forEach((button) => button.addEventListener('click', () => { if (button.dataset.g8Perspective === current.answer) { state.correct += 1; state.round += 1; state.round < perspectiveRounds.length ? renderPerspectiveToolkit() : finish(); } else { state.retries += 1; status('這個做法可能跳過了未知處或未提供支持下一步。可再看資料、按提示或請教師一起看。', 'try'); } })); $('[data-g8-perspective]', shell).focus();
  }

  function renderToneWorkbench() {
    const current = toneRounds[state.round];
    shell.innerHTML = dialog(`${top()}<main class="g8-play"><p class="g8-kicker">修辭改寫 · 第 ${state.round + 1} / ${toneRounds.length} 回合</p><h2 class="g8-title" id="g8Title">說話溫度工作台</h2><div class="g8-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="g8-board"><h3>初稿</h3><p class="g8-prompt">「${current.draft}」</p></section><p>以下哪一句較清楚指出資料、提出可修訂的下一步，並尊重對方？這不是把意見變得模糊，而是讓對話可繼續。</p><div class="g8-stack">${current.choices.map((choice) => `<button type="button" class="g8-slot" data-g8-tone="${choice}">${choice}</button>`).join('')}</div>${tools()}<p class="g8-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bind(); $$('[data-g8-tone]', shell).forEach((button) => button.addEventListener('click', () => { if (button.dataset.g8Tone === current.answer) { state.correct += 1; state.round += 1; state.round < toneRounds.length ? renderToneWorkbench() : finish(); } else { state.retries += 1; status('這句可能含有推論、評價或封閉對話。可再看初稿、按提示或與教師討論其他改寫。', 'try'); } })); $('[data-g8-tone]', shell).focus();
  }

  function renderAchievementMap() {
    const current = achievementRounds[state.round]; const selected = state.selectedValues || [];
    shell.innerHTML = dialog(`${top()}<main class="g8-play"><p class="g8-kicker">多元投入 · 第 ${state.round + 1} / ${achievementRounds.length} 回合</p><h2 class="g8-title" id="g8Title">多元成就地圖</h2><div class="g8-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="g8-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><p>${current.prompt} 這些是虛構角色的投入選項，不是成績、排名或自我價值評量。</p><div class="g8-stack">${current.cards.map((card) => `<button type="button" class="g8-card${selected.includes(card) ? ' is-selected' : ''}" data-g8-achievement="${card}" aria-pressed="${selected.includes(card)}">${card}</button>`).join('')}</div><section class="g8-note"><strong>目前選取</strong><br>${selected.length ? selected.map((item) => `• ${item}`).join('<br>') : '尚未選取；可以選一張、略過或請教師一起看。'}</section><div class="g8-actions"><button type="button" class="g8-secondary" data-action="skip-achievement">略過這回合</button><button type="button" class="g8-primary" data-action="next-choice">繼續下一回合</button></div>${tools()}<p class="g8-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bind(); $$('[data-g8-achievement]', shell).forEach((button) => button.addEventListener('click', () => { const card = button.dataset.g8Achievement; const now = state.selectedValues || []; state.selectedValues = now.includes(card) ? now.filter((item) => item !== card) : [...now, card].slice(-2); renderAchievementMap(); status('已更新選取。可繼續、略過或改變主意。'); })); $('[data-g8-achievement]', shell).focus();
  }

  function renderValuesSandbox() {
    const current = valuesRounds[state.round]; const selected = state.selectedValues || []; const declined = state.declinedValues || false;
    shell.innerHTML = dialog(`${top()}<main class="g8-play"><p class="g8-kicker">價值與問題 · 第 ${state.round + 1} / ${valuesRounds.length} 回合</p><h2 class="g8-title" id="g8Title">哲學價值沙盒</h2><div class="g8-progress" role="progressbar" aria-label="回合進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress()}"><span style="width:${progress()}%"></span></div><section class="g8-board"><h3>${current.title}</h3><p>${current.scenario}</p></section><p>${current.question}</p><div class="g8-choice-grid">${current.values.map((value) => `<button type="button" class="g8-choice${selected.includes(value) ? ' is-selected' : ''}" data-g8-value="${value}" aria-pressed="${selected.includes(value)}">${value}</button>`).join('')}</div><section class="g8-note"><strong>目前狀態</strong><br>${declined ? '已選擇：這回合不使用價值卡。' : selected.length ? `想探索：${selected.join('、')}。可和教師討論「這項價值會令我想先問甚麼？」` : '尚未選取；你可以選一張、略過或拒絕價值卡。'}<br><br>這裡沒有正確人生意義、幸福度、道德或價值排名。</section><div class="g8-actions"><button type="button" class="g8-secondary" data-action="decline-values">這回合不使用價值卡</button><button type="button" class="g8-secondary" data-action="skip-values">略過這回合</button><button type="button" class="g8-primary" data-action="next-choice">繼續下一回合</button></div>${tools()}<p class="g8-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p></main>`);
    bind(); $$('[data-g8-value]', shell).forEach((button) => button.addEventListener('click', () => { const value = button.dataset.g8Value; const now = state.selectedValues || []; state.selectedValues = now.includes(value) ? now.filter((item) => item !== value) : [...now, value].slice(-2); state.declinedValues = false; renderValuesSandbox(); status('已更新價值卡。可繼續、略過、拒絕或改變主意。'); })); $('[data-g8-value]', shell).focus();
  }

  function render() { if (isCastle()) renderCastle(); else if (activeKey === 'selective-listening') renderListening(); else if (activeKey === 'viewpoint-studio') renderViewpointStudio(); else if (activeKey === 'rule-sandbox') renderRuleSandbox(); else if (activeKey === 'perspective-toolkit') renderPerspectiveToolkit(); else if (activeKey === 'tone-workbench') renderToneWorkbench(); else if (activeKey === 'achievement-map') renderAchievementMap(); else renderValuesSandbox(); }
  function finish() { const activity = currentActivity(); shell.innerHTML = dialog(`${top()}<main class="g8-finish"><p class="g8-kicker">課堂回顧</p><h2 class="g8-title" id="g8Title">完成 ${activity.title}</h2><div class="g8-finish-card"><strong>你已完成三個可行方案／規律回合。</strong><br>本次課堂可回顧：${state.correct} 個完成步驟、${state.retries} 次調整或重試。數字不比較能力，也不代表任何情緒、感官或社交特質。</div><p class="g8-note">可和教師討論：「哪一種支持方式最幫你慢慢找出下一步？」也可以只選另一項活動。</p><div class="g8-actions"><button type="button" class="g8-secondary" data-action="restart">再做一次</button><button type="button" class="g8-primary" data-action="complete">回到 Giftedness 關卡</button></div></main>`); bind(); $('[data-action="complete"]', shell).focus(); }

  function bind() {
    $$('[data-action]', shell).forEach((button) => button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'close') close();
      if (action === 'start') render();
      if (action === 'read-ready') speak('第一，你可選舒服的支持方式。第二，慢慢尋找可行方案。第三，你可以停下、請教師一起看或離開。');
      if (action === 'read') speak($('.g8-play', shell)?.innerText || '');
      if (action === 'hint') status(rounds()[state.round]?.hint || '可慢慢看看資料，再請教師一起看。');
      if (action === 'pause') status('已先停一停。你可以深呼吸、喝水、看提示，或在準備好後繼續。');
      if (action === 'teacher') status('可請教師一起讀題、指卡或把大任務拆成一個小步驟。');
      if (action === 'decline-values') { state.selectedValues = []; state.declinedValues = true; renderValuesSandbox(); status('已選擇這回合不使用價值卡。你仍可略過、繼續或改變主意。'); }
      if (action === 'skip-achievement' || action === 'skip-values' || action === 'next-choice') { state.round += 1; state.selectedValues = []; state.declinedValues = false; if (state.round < rounds().length) render(); else finish(); }
      if (action === 'restart') { state = { ...state, round: 0, correct: 0, retries: 0, selectedCard: '', placed: {}, selectedValues: [], declinedValues: false }; ready(); }
      if (action === 'complete') { const result = { key: activeKey, title: currentActivity().title, correct: state.correct, retries: state.retries, stage: activeStage }; close(); onComplete?.(result); }
    }));
    $$('[data-setting]', shell).forEach((button) => button.addEventListener('click', () => { state.setting = button.dataset.setting; ready(); }));
  }

  function trap(event) { if (!shell || event.key !== 'Tab') return; const dialogNode = $('.g8-dialog', shell); const items = $$('button:not([disabled])', dialogNode).filter((item) => item.offsetParent !== null); if (!items.length) return; const first = items[0]; const last = items.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
  function keydown(event) { if (!shell) return; if (event.key === 'Escape') { event.preventDefault(); close(); return; } trap(event); }
  function close() { window.speechSynthesis?.cancel(); if (!shell) return; shell.remove(); shell = null; document.removeEventListener('keydown', keydown, true); trigger?.focus?.(); }
  function openActivity(key, options = {}) { const item = Object.values(activities).flat().find((activity) => activity.key === key); if (!item) return; close(); styles(); activeKey = key; activeStage = options.stage || 'lower'; trigger = options.trigger || null; onComplete = options.onComplete; state = { round: 0, correct: 0, retries: 0, setting: '靜態圖像線索', selectedCard: '', placed: {}, selectedValues: [], declinedValues: false }; shell = document.createElement('div'); shell.className = 'g8-overlay'; shell.innerHTML = ''; document.body.append(shell); document.addEventListener('keydown', keydown, true); ready(); }
  styles();
  window.GIFTED_EIGHT_GAMES_LAB = { activityCards, openActivity };
})();
