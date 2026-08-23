/* 初小 EBD／MI 情緒支持練習：課堂工具，非診斷、非治療及非危機處理。 */
(function () {
  'use strict';

  const lower = {
    ebd: [
      { id: 'ebd-cool', icon: '🌋', title: '怒氣冷靜按住與放鬆', caption: '按住準備，再按自己的節奏放鬆', kind: 'hold', rules: ['看見身體想停一停的訊號。', '按住「準備」圖示；想放鬆時再按「放鬆」。', '做完可選一個安全的下一步，或隨時離開。'], hint: '不需要用力或計時；只要試一試「準備」和「放鬆」。' },
      { id: 'ebd-stop', icon: '👾', title: '小怪獸停看聽', caption: '跟著可預期的綠、紅提示練習手先停住', kind: 'stop', rules: ['綠色時可以按「走一步」。', '紅色出現時，先把手停住。', '沒有扣分；停一停後可隨時再開始。'], hint: '紅色不是失敗提示；它只是提醒「手先停住」。' },
      { id: 'ebd-rhythm', icon: '🥁', title: '節奏換一換', caption: '跟著簡單節奏，換成慢一點的呼吸拍子', kind: 'rhythm', rules: ['先看老師或螢幕示範一個短拍子。', '按「跟一拍」完成一拍，再按「呼吸一拍」。', '每一拍由你按下一步；不設倒數。'], hint: '如果不想跟拍，可以直接按「呼吸一拍」。' },
      { id: 'ebd-tidy', icon: '🧺', title: '物歸原位大作戰', caption: '把課室用品慢慢放到合適收納箱', kind: 'tidy', rules: ['看一張用品圖卡。', '拖到合適收納箱，或直接點選收納箱。', '每放好一樣，就可以慢慢看下一樣。'], hint: '沒有計時。用品也可以用點選方式放好。' }
    ],
    mi: [
      { id: 'mi-bubble', icon: '🫧', title: '想法泡泡', caption: '把一個擔心想法放進泡泡，讓它慢慢飄遠', kind: 'bubble', rules: ['先讀「我現在有一個擔心想法」。', '按泡泡，讓它飄到畫面上方。', '選一張支持卡，或按需要成人支持。'], hint: '想法出現不代表它一定是真的；我們只練習先把它看見。' },
      { id: 'mi-safe', icon: '🛟', title: '我的安全空間', caption: '選一張能幫自己穩一穩的支持卡', kind: 'safe', rules: ['看四張支持卡。', '拖一張卡到「我現在可選」；也可以點選。', '告訴教師你想先試哪一項。'], hint: '你可以選喝水、安靜角、找成人或慢呼吸；沒有唯一答案。' },
      { id: 'mi-calm', icon: '🔎', title: '找出平靜線索', caption: '在中性圖卡中找一個令自己較穩定的線索', kind: 'calm', rules: ['慢慢看一看三張圖卡。', '選一張你覺得可以幫你穩一穩的線索。', '教師可問：「你想怎樣用這個線索？」'], hint: '不同人會選不同線索；選擇是你的。' },
      { id: 'mi-breath', icon: '✨', title: '呼吸小精靈', caption: '由你按下一拍，帶小精靈走過吸氣與呼氣', kind: 'breath', rules: ['看見一個呼吸拍子。', '準備好才按「下一拍」。', '覺得不舒服或不想繼續時，可以先停一停。'], hint: '不用跟著任何固定速度；每一拍由你決定。' }
    ]
  };

  const stageActivities = {
    lower,
    upper: {
      ebd: [
        { id: 'ebd-emotion-clue', icon: '🕵️', title: '情緒線索偵探', caption: '從表情和情境找出一個可能的感受', kind: 'calm', prompt: '同學低著頭，手上拿著被雨淋濕的畫作。你覺得他可能怎樣？', choices: ['😔 可能有點失望', '😄 一定很興奮', '😴 一定想睡覺'], rules: ['先看表情和情境線索。', '選一個「可能」的感受，不需要猜得百分百正確。', '再選一個可以說的支持短句。'], hint: '可先說：「我看到你可能有點不開心。」' },
        { id: 'ebd-pause-plan', icon: '🚦', title: '停看聽任務', caption: '練習在衝動前先讓手和身體停一停', kind: 'stop', rules: ['綠色時，按「走一步」。', '紅色提示時，練習先停住。', '停住後可選一個安全下一步。'], hint: '停一停不是輸；它是讓自己有多一個選擇。' },
        { id: 'ebd-repair-choice', icon: '🧩', title: '修復選擇卡', caption: '在小誤會後選一個願意嘗試的修復方法', kind: 'safe', options: ['💬 說「剛才我太急了」', '🛟 找教師一起想', '🌬️ 先慢呼吸', '✋ 說「我想停一停」'], rules: ['看一個小誤會情境。', '選一個你願意嘗試的修復方法。', '可以先用指向，教師再一起排練。'], hint: '修復不需要一次說得完美；先選一個小步。' },
        { id: 'ebd-classroom-reset', icon: '🎒', title: '課室重整小隊', caption: '把復課小步放到合適的流程位置', kind: 'tidy', items: [{ icon: '🪑', label: '回到座位', target: '先穩住' }, { icon: '🥤', label: '喝一口水', target: '先穩住' }, { icon: '📘', label: '拿出課本', target: '回到任務' }], rules: ['看每張復課小步卡。', '拖到合適位置，或點卡再點位置。', '不需要急著完成；先做一個小步。'], hint: '先穩住，再回到任務；可以請教師陪你選。' }
      ],
      mi: [
        { id: 'mi-weather-map', icon: '🌦️', title: '心情天氣圖', caption: '選一張最接近現在狀態的天氣卡', kind: 'calm', prompt: '現在的心情像哪一種天氣？', choices: ['🌤️ 有點雲，但還可以', '🌧️ 有點沉重，想慢一點', '☀️ 比較有精神'], rules: ['看三張中性天氣卡。', '選一張較接近現在的感覺。', '可選一個支持小步。'], hint: '心情會變；今天選甚麼都可以。' },
        { id: 'mi-support-menu', icon: '🧭', title: '支持小地圖', caption: '把一張支持卡放進今天的支持清單', kind: 'safe', options: ['🧑‍🏫 告訴信任的成人', '📓 寫一句心情', '🌿 到安靜地方坐一會', '🥤 喝水和休息'], rules: ['看一看四張支持卡。', '選一張今天可用的小步。', '教師可幫你把選擇變成一句計劃。'], hint: '支持方法可因日子不同而改變。' },
        { id: 'mi-thought-cloud', icon: '☁️', title: '想法雲朵', caption: '看見一個想法，然後選擇一張支持卡', kind: 'bubble', rules: ['讀一個中性的擔心想法。', '按雲朵，讓它移遠一點。', '選一個令自己較穩定的下一步。'], hint: '先看見想法，再選下一步；不用和想法爭論。' },
        { id: 'mi-small-step-route', icon: '👣', title: '小步路線圖', caption: '把今天的三個小步放進合適位置', kind: 'tidy', items: [{ icon: '🗓️', label: '看今天安排', target: '開始前' }, { icon: '🛟', label: '說出需要支持', target: '遇到困難時' }, { icon: '✅', label: '完成一件小事', target: '今天結束前' }], rules: ['看三個日常小步。', '拖到合適情境，或點選完成。', '只需選一個最想先試的小步。'], hint: '今天完成一件小事已經足夠。' }
      ]
    },
    junior: {
      ebd: [
        { id: 'ebd-tone-workshop', icon: '🎙️', title: '語氣轉換工作坊', caption: '把急促說法轉成較清楚的請求', kind: 'calm', prompt: '小組討論時，你想先停一停。哪一句較清楚？', choices: ['💬「我想停一分鐘，之後再討論。」', '📣「你們全部不要說話！」', '🚶 直接離開，不說原因'], rules: ['先看情境。', '選一句較清楚而有界線的說法。', '可跟教師讀一次，或只指向選項。'], hint: '清楚地說需要，不等於要解釋所有感受。' },
        { id: 'ebd-conflict-route', icon: '🤝', title: '衝突修復路線', caption: '為小衝突選一個可行的下一步', kind: 'safe', options: ['👂 先聽對方說完', '💬 說「我想重新說一次」', '🛟 請成人協助', '🌬️ 先離開冷靜一下'], rules: ['看見衝突情境時先停一停。', '選一個安全又可行的下一步。', '不需要強迫和好；先保護自己和別人。'], hint: '需要成人協助是一個合理選擇。' },
        { id: 'ebd-chain-clue', icon: '🔗', title: '行為線索鏈', caption: '把情境、身體訊號和支持小步放在一起', kind: 'tidy', items: [{ icon: '💓', label: '心跳很快', target: '身體訊號' }, { icon: '📝', label: '小組意見不同', target: '情境' }, { icon: '🛟', label: '請教師一起想', target: '支持小步' }], rules: ['讀每張線索卡。', '拖到相應欄位，或使用點選。', '目的是看見線索，不是判斷誰對誰錯。'], hint: '先分辨「發生甚麼」「身體怎樣」「我可做甚麼」。' },
        { id: 'ebd-reset-rhythm', icon: '🎧', title: '壓力轉彎站', caption: '用自己決定的拍子回到一個小步', kind: 'rhythm', rules: ['先選擇跟一拍或呼吸一拍。', '每一拍由你按下一步。', '完成後選一個可以回到課堂的小步。'], hint: '不想跟拍時可以直接按呼吸一拍。' }
      ],
      mi: [
        { id: 'mi-context-card', icon: '🗂️', title: '情境想法卡', caption: '分辨情境和心裡出現的一個想法', kind: 'calm', prompt: '測驗前心裡想：「我未必做得到。」下一步可以是？', choices: ['📝 看一題，再做一個小步', '❌ 不需要看任何資料', '📣 一定要立刻做完全部'], rules: ['先讀情境和想法。', '選一個較可行的下一步。', '可以請教師把下一步寫成短句。'], hint: '想法出現時，仍然可以選一個小小行動。' },
        { id: 'mi-network-map', icon: '🕸️', title: '支持網絡圖', caption: '把一張支持卡放到今天可聯絡的網絡中', kind: 'safe', options: ['🧑‍🏫 信任的教師', '👪 家人或照顧者', '🤝 可靠同學', '📍 學校支持服務'], rules: ['看四種支持來源。', '選一個今天可聯絡的人或地方。', '教師可協助學生決定實際聯絡方式。'], hint: '若感到很難受，優先告訴身邊可信任的成人。' },
        { id: 'mi-anchor-breath', icon: '⚓', title: '當下停靠站', caption: '由自己帶領一個短暫的呼吸循環', kind: 'breath', rules: ['只在舒服時按下一拍。', '吸氣、停一停、呼氣都由你控制。', '完成後可直接離開或選一個支持小步。'], hint: '不用閉眼，也不用固定速度。' },
        { id: 'mi-task-breakdown', icon: '🧱', title: '把事情分小步', caption: '把一個任務拆成可以開始的三個小步', kind: 'tidy', items: [{ icon: '📌', label: '寫下第一件事', target: '開始' }, { icon: '⏸️', label: '中途休息一下', target: '進行中' }, { icon: '✅', label: '核對已完成部分', target: '結束前' }], rules: ['看任務小步卡。', '拖到合適時段，或點選。', '不必一次完成整個任務。'], hint: '先做第一件事，已經是開始。' }
      ]
    },
    senior: {
      ebd: [
        { id: 'ebd-workplace-tone', icon: '💼', title: '職場語氣選擇', caption: '在實習情境中選一句清楚而尊重的回應', kind: 'calm', prompt: '同事提醒你重做一項工作。哪一句可幫助你確認下一步？', choices: ['💬「我想確認一次，哪部分需要重做？」', '📣「這不關我的事。」', '🚶 不回應便離開'], rules: ['先看職場情境。', '選一句能確認下一步的回應。', '可用指向或跟教師排練。'], hint: '確認要求可以幫助減少誤會，不代表你做錯。' },
        { id: 'ebd-incident-order', icon: '🧭', title: '突發事件先後卡', caption: '把安全、確認和支援放進合適次序', kind: 'tidy', items: [{ icon: '✋', label: '先停下不安全動作', target: '第一步' }, { icon: '💬', label: '確認發生甚麼', target: '第二步' }, { icon: '🛟', label: '需要時找主管', target: '第三步' }], rules: ['看三張突發事件小步卡。', '拖到合適先後位置，或點選。', '在真實情境先依場地安全程序和成人指示。'], hint: '安全優先；不確定時找主管或可信任成人。' },
        { id: 'ebd-boundary-plan', icon: '🧱', title: '界線與支援', caption: '選一個可保護自己和關係的下一步', kind: 'safe', options: ['💬 清楚說出可以做甚麼', '🛟 向主管或成人求助', '⏸️ 先停一停再回應', '📝 記下需要確認的事'], rules: ['看一個需要界線的情境。', '選一個安全的下一步。', '不必獨自處理令你不安的情況。'], hint: '當情況超出能力或安全範圍時，找成人支持。' },
        { id: 'ebd-reset-plan', icon: '🔄', title: '一分鐘重整計劃', caption: '用自己的節奏完成一個短暫重整循環', kind: 'breath', rules: ['準備好才按下一拍。', '可在任何一拍停下。', '完成後選擇回到工作、喝水或找支持。'], hint: '重整是工作準備的一部分，不是懲罰。' }
      ],
      mi: [
        { id: 'mi-practicum-prep', icon: '🗃️', title: '實習前支持準備', caption: '選一張今天帶去實習的支持卡', kind: 'safe', options: ['🗓️ 看清工作安排', '🧑‍💼 找指定聯絡人', '🥤 準備水和短休息', '📝 寫下要問的問題'], rules: ['看四張實習支持卡。', '選一張今天最想帶著的小步。', '可與教師或照顧者一起準備。'], hint: '先知道可以問誰、怎樣休息，能讓準備更清楚。' },
        { id: 'mi-pressure-signal', icon: '📡', title: '壓力訊號與照顧', caption: '從日常訊號選一個較溫和的照顧方法', kind: 'calm', prompt: '今天一直很難集中和容易疲累。哪一個下一步較合適？', choices: ['🛟 告訴可信任成人並安排短休息', '⚡ 強迫自己不停做下去', '❌ 假裝完全沒有感覺'], rules: ['看日常訊號。', '選一個較溫和而實際的下一步。', '如持續影響生活，請告訴成人或學校支持人員。'], hint: '照顧需要和尋求支持是成熟的工作準備。' },
        { id: 'mi-need-statement', icon: '🗣️', title: '表達需要練習', caption: '把一個需要放進清楚而簡短的句子', kind: 'bubble', rules: ['看見一個需要支持的時刻。', '按泡泡，先把需要看清楚。', '選一張可說出的支持卡。'], hint: '可以說：「我想確認下一步。」或「我需要短暫休息。」' },
        { id: 'mi-daily-return', icon: '🏡', title: '回到日常下一步', caption: '把一天結束前的三個照顧小步放好', kind: 'tidy', items: [{ icon: '📵', label: '暫停一下螢幕', target: '回家後' }, { icon: '🥣', label: '吃一點和補充水分', target: '照顧身體' }, { icon: '🛌', label: '準備明天用品', target: '睡前前' }], rules: ['看一天結束前的小步卡。', '拖到合適位置，或點選。', '選一個今晚最實際的小步就可以。'], hint: '日常小步能幫你把今天慢慢收好。' }
      ]
    }
  };

  let overlay;
  let trigger;
  let active;
  let config;
  let state;

  const by = (sel, root = document) => root.querySelector(sel);
  const escape = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-HK'; utterance.rate = .74; utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
  };
  const cards = (track, stage) => stageActivities[stage]?.[track] || [];
  const stageLabel = (stage) => ({ lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' }[stage] || '初小 P1–P3');
  const label = (track) => track === 'ebd' ? 'EBD · 情緒與行為支持' : 'MI · 情緒健康與溝通支持';

  function injectStyles() {
    if (by('#ebd-mi-lab-styles')) return;
    const style = document.createElement('style');
    style.id = 'ebd-mi-lab-styles';
    style.textContent = `
      .ebdmi-overlay{position:fixed;inset:0;z-index:1200;background:rgba(21,32,54,.72);padding:clamp(14px,3vw,42px);overflow:auto;display:grid;place-items:start center}
      .ebdmi-dialog{width:min(980px,100%);min-height:min(680px,calc(100vh - 28px));background:#fff;border-radius:30px;padding:clamp(22px,4vw,48px);box-shadow:0 24px 70px rgba(8,20,44,.35);color:#152c4d;position:relative}
      .ebdmi-close{position:absolute;top:18px;right:18px;width:52px;height:52px;border-radius:50%;border:0;background:#f0f3f9;color:#32425c;font-size:2rem;line-height:1}
      .ebdmi-kicker{margin:0 64px 4px 0;color:#4c3e99;font-weight:850;letter-spacing:.04em}.ebdmi-title{margin:0;color:#1f3966;font-size:clamp(2rem,5vw,3.4rem);line-height:1.15}.ebdmi-lead{margin:12px 0 26px;color:#58697f;font-size:clamp(1.05rem,2.5vw,1.35rem);line-height:1.65}
      .ebdmi-card{border:2px solid #d7e3ed;border-radius:24px;background:linear-gradient(135deg,#fbfeff,#f2f8fa);padding:clamp(18px,3vw,30px);margin:18px 0}.ebdmi-rules{display:grid;gap:12px;margin:0;padding:0;list-style:none}.ebdmi-rules li{display:flex;gap:10px;align-items:flex-start;font-size:1.06rem;line-height:1.55}.ebdmi-rules li::before{content:'✓';display:grid;place-items:center;min-width:26px;height:26px;border-radius:50%;background:#dbf4ec;color:#176d5b;font-weight:900}
      .ebdmi-actions,.ebdmi-tools{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}.ebdmi-btn{min-height:50px;border:2px solid #b6d4cf;border-radius:16px;padding:11px 18px;background:#fff;color:#175d58;font-size:1rem;font-weight:800;cursor:pointer}.ebdmi-btn.primary{background:#138b80;border-color:#138b80;color:#fff}.ebdmi-btn.warning{border-color:#c89d57;color:#714f13}.ebdmi-btn:focus-visible,.ebdmi-source:focus-visible,.ebdmi-zone:focus-visible{outline:4px solid #1e5b92;outline-offset:3px}.ebdmi-btn:active{transform:scale(.98)}
      .ebdmi-progress{height:13px;border-radius:999px;background:#e2eef0;overflow:hidden;margin:18px 0}.ebdmi-progress>span{display:block;height:100%;background:linear-gradient(90deg,#2cae9d,#6fd2c3);width:0;transition:width .22s cubic-bezier(.23,1,.32,1)}.ebdmi-status{min-height:2em;margin:18px 0;color:#2d526f;font-weight:750;line-height:1.5}.ebdmi-stage{min-height:260px;display:grid;place-items:center;text-align:center}.ebdmi-hero{font-size:clamp(4.5rem,12vw,8rem);filter:drop-shadow(0 9px 0 rgba(30,78,103,.08));margin:6px}.ebdmi-task-title{font-size:clamp(1.5rem,4vw,2.25rem);margin:10px 0}.ebdmi-task-copy{max-width:650px;line-height:1.7;font-size:1.1rem;color:#405b72}
      .ebdmi-hold{min-width:min(360px,100%);min-height:112px;font-size:1.45rem;border:3px solid #4a79a1;background:#eaf6ff;color:#1b527c;border-radius:26px;font-weight:900}.ebdmi-hold.is-held{background:#f9e1d7;border-color:#d37b5d;color:#823c2d}.ebdmi-signal{font-size:clamp(4rem,11vw,7rem);display:grid;place-items:center;width:150px;height:150px;border-radius:50%;margin:10px auto;background:#53b875;box-shadow:inset 0 0 0 10px #d8f1df}.ebdmi-signal.red{background:#e76d68;box-shadow:inset 0 0 0 10px #fde3e0}.ebdmi-beat{display:flex;justify-content:center;gap:14px;margin:20px}.ebdmi-beat span{width:52px;height:52px;border-radius:50%;background:#ddeaf3}.ebdmi-beat span.active{background:#74cfc0;transform:scale(1.08)}
      .ebdmi-drag-wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;width:100%;max-width:780px;margin:20px auto}.ebdmi-source,.ebdmi-zone{min-height:104px;border-radius:20px;border:3px dashed #a3c5d9;background:#fff;display:grid;place-items:center;padding:12px;font-weight:850;font-size:1.08rem;touch-action:none;cursor:grab}.ebdmi-source{border-style:solid;border-color:#94c8c0;background:#eefbf7}.ebdmi-source.is-dragging{opacity:.64;transform:translateY(-4px)}.ebdmi-zone.is-ready{background:#e8f5ff;border-color:#2674a4;box-shadow:0 0 0 4px rgba(38,116,164,.14)}.ebdmi-zone.is-filled{border-style:solid;border-color:#3ba684;background:#e9f8ed}.ebdmi-bubble{width:180px;height:180px;border-radius:50%;border:3px solid #93cddd;background:radial-gradient(circle at 34% 25%,#fff,rgba(210,244,255,.85) 45%,rgba(140,205,223,.55));display:grid;place-items:center;padding:22px;font-weight:850;font-size:1.1rem;transition:transform .6s ease,opacity .6s ease}.ebdmi-bubble.float{transform:translateY(-140px) scale(.85);opacity:0}.ebdmi-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;width:100%;max-width:720px;margin:20px auto}.ebdmi-choice{min-height:104px;border:3px solid #c7d5ed;border-radius:20px;background:#fff;color:#26456b;padding:12px;font-weight:850;font-size:1.08rem}.ebdmi-choice.selected{border-color:#2b9985;background:#ecfaf5;box-shadow:0 0 0 4px rgba(43,153,133,.14)}
      .ebdmi-support{margin-top:24px;padding:16px;border-radius:16px;background:#fff6df;color:#654b16;line-height:1.55}.ebdmi-support button{margin-top:10px}.ebdmi-complete{padding:26px;border-radius:24px;background:#eafaf3;color:#146453;text-align:center;font-weight:800}.ebdmi-complete strong{display:block;font-size:1.6rem;margin-bottom:8px}
      @media(max-width:520px){.ebdmi-overlay{padding:8px}.ebdmi-dialog{min-height:calc(100vh - 16px);border-radius:22px;padding:20px 16px}.ebdmi-drag-wrap{grid-template-columns:1fr}.ebdmi-choice-grid{grid-template-columns:1fr}.ebdmi-source,.ebdmi-zone{min-height:76px}.ebdmi-tools .ebdmi-btn,.ebdmi-actions .ebdmi-btn{flex:1 1 140px}.ebdmi-hold{min-height:96px}}
      @media (prefers-reduced-motion:reduce){.ebdmi-progress>span,.ebdmi-bubble{transition:none}.ebdmi-source.is-dragging,.ebdmi-beat span.active{transform:none}}
    `;
    document.head.appendChild(style);
  }

  function focusables() { return [...overlay.querySelectorAll('button:not([disabled]),[tabindex]:not([tabindex="-1"])')]; }
  function close() {
    window.speechSynthesis?.cancel();
    overlay?.remove(); overlay = null;
    trigger?.focus?.();
  }
  function announce(text) { const node = by('[data-ebdmi-status]', overlay); if (node) node.textContent = text; }
  function progress(value) { const node = by('[data-ebdmi-progress]', overlay); if (node) node.style.width = `${Math.max(0, Math.min(100, value))}%`; }
  function toolbar() {
    return `<div class="ebdmi-tools" aria-label="低壓支持工具"><button class="ebdmi-btn" type="button" data-read>🔊 朗讀現在內容</button><button class="ebdmi-btn" type="button" data-hint>💡 看提示</button><button class="ebdmi-btn warning" type="button" data-pause>⏸ 先停一停</button><button class="ebdmi-btn warning" type="button" data-adult>🛟 需要成人支持</button><button class="ebdmi-btn" type="button" data-leave>← 換練習／離開</button></div>`;
  }
  function shell(content) {
    injectStyles();
    overlay?.remove();
    overlay = document.createElement('div');
    overlay.className = 'ebdmi-overlay';
    overlay.innerHTML = `<section class="ebdmi-dialog" role="dialog" aria-modal="true" aria-labelledby="ebdmiTitle" tabindex="-1"><button class="ebdmi-close" type="button" aria-label="關閉練習">×</button>${content}</section>`;
    document.body.appendChild(overlay);
    by('.ebdmi-close', overlay).addEventListener('click', close);
    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'Tab') {
        const items = focusables(); if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    requestAnimationFrame(() => by('.ebdmi-dialog', overlay).focus());
  }
  function bindToolbar() {
    by('[data-read]', overlay)?.addEventListener('click', () => speak(`${active.title}。${active.caption}。${active.hint}`));
    by('[data-hint]', overlay)?.addEventListener('click', () => { announce(`提示：${active.hint}`); speak(active.hint); });
    by('[data-pause]', overlay)?.addEventListener('click', () => announce('已先停一停。你可以慢慢呼吸、喝水，或按換練習。'));
    by('[data-adult]', overlay)?.addEventListener('click', () => announce('你已選擇需要成人支持。現在可以告訴身旁的教師、家長或照顧你的成人。'));
    by('[data-leave]', overlay)?.addEventListener('click', close);
  }
  function prep() {
    shell(`<p class="ebdmi-kicker">${label(config.track)} · ${stageLabel(config.stage)}直接選關</p><h1 class="ebdmi-title" id="ebdmiTitle">${active.icon} ${escape(active.title)}</h1><p class="ebdmi-lead">${escape(active.caption)}</p><section class="ebdmi-card"><h2>教師帶讀：三個小步</h2><ol class="ebdmi-rules">${active.rules.map((rule) => `<li>${escape(rule)}</li>`).join('')}</ol></section><p class="ebdmi-support"><strong>課堂定位：</strong>這是情緒覺察、溝通與日常調節練習，不是診斷、治療或危機處理。學生可用指向、點選、拖拉或說一句短句回應。</p><div class="ebdmi-actions"><button class="ebdmi-btn" type="button" data-read-rules>🔊 朗讀規則</button><button class="ebdmi-btn primary" type="button" data-ready>我準備好了</button></div>`);
    by('[data-read-rules]', overlay).addEventListener('click', () => speak(`${active.title}。${active.rules.join('。')}`));
    by('[data-ready]', overlay).addEventListener('click', run);
  }
  function base(title, body) {
    return `<p class="ebdmi-kicker">${label(config.track)} · ${stageLabel(config.stage)}練習</p><h1 class="ebdmi-title" id="ebdmiTitle">${active.icon} ${escape(active.title)}</h1><div class="ebdmi-progress" role="progressbar" aria-label="活動進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-ebdmi-progress></span></div><section class="ebdmi-card"><div class="ebdmi-stage">${body}</div><p class="ebdmi-status" role="status" aria-live="polite" aria-atomic="true" data-ebdmi-status>慢慢來；你可以選擇下一步。</p></section>${toolbar()}`;
  }
  function complete(message = '你完成了一個小練習。') {
    progress(100); state.done = true;
    const host = by('.ebdmi-stage', overlay);
    host.innerHTML = `<div class="ebdmi-complete"><strong>🌟 做得好！</strong><span>${escape(message)} 你可以帶著這個小步回到課堂，或換另一項練習。</span></div>`;
    announce(message);
    config.onComplete?.({ label: active.title, correct: 1, incorrect: state.incorrect || 0, total: 1 });
  }
  function run() {
    state = { correct: 0, incorrect: 0, done: false, step: 0, held: false, selected: [] };
    if (active.kind === 'hold') return renderHold();
    if (active.kind === 'stop') return renderStop(false);
    if (active.kind === 'rhythm') return renderRhythm();
    if (active.kind === 'tidy') return renderTidy();
    if (active.kind === 'bubble') return renderBubble();
    if (active.kind === 'safe') return renderSafe();
    if (active.kind === 'calm') return renderCalm();
    return renderBreath();
  }
  function renderHold() {
    shell(base(active.title, `<div><div class="ebdmi-hero" aria-hidden="true">🌋</div><h2 class="ebdmi-task-title">先準備，再放鬆</h2><p class="ebdmi-task-copy">按住準備圖示時，想像自己把力量收好；準備好後，再按放鬆。</p><button class="ebdmi-hold" type="button" data-hold>👐 按住準備</button><div class="ebdmi-actions"><button class="ebdmi-btn primary" type="button" data-release disabled>🍦 放鬆一下</button></div></div>`));
    const hold = by('[data-hold]', overlay), release = by('[data-release]', overlay);
    const begin = () => { state.held = true; hold.classList.add('is-held'); hold.textContent = '👐 已準備好'; release.disabled = false; announce('你已準備好。想放鬆時可以按放鬆一下。'); progress(45); };
    hold.addEventListener('pointerdown', begin); hold.addEventListener('keydown', (event) => { if (event.key === ' ' || event.key === 'Enter') begin(); });
    release.addEventListener('click', () => { if (!state.held) return; complete('你完成了準備和放鬆。冰涼的顏色慢慢回到火山旁。'); });
    bindToolbar();
  }
  function renderStop(red) {
    shell(base(active.title, `<div><div class="ebdmi-signal ${red ? 'red' : ''}" aria-hidden="true">${red ? '✋' : '👾'}</div><h2 class="ebdmi-task-title">${red ? '紅色提示：手先停住' : '綠色提示：可以走一步'}</h2><p class="ebdmi-task-copy">${red ? '按「手先停住」後，再選擇下一步。' : '你可以先按走一步；準備好才會出現紅色提示。'}</p><div class="ebdmi-actions">${red ? '<button class="ebdmi-btn primary" type="button" data-stopped>✋ 手先停住</button>' : '<button class="ebdmi-btn primary" type="button" data-go>👣 走一步</button>'}</div></div>`));
    if (red) by('[data-stopped]', overlay).addEventListener('click', () => complete('你在紅色提示時先停住了。現在可以慢慢選擇下一步。'));
    else by('[data-go]', overlay).addEventListener('click', () => { progress(45); renderStop(true); });
    bindToolbar();
  }
  function renderRhythm() {
    const beat = () => `<div class="ebdmi-beat" aria-hidden="true">${[0,1,2].map((n) => `<span class="${n < state.step ? 'active' : ''}"></span>`).join('')}</div>`;
    shell(base(active.title, `<div><div class="ebdmi-hero" aria-hidden="true">🥁</div><h2 class="ebdmi-task-title">跟一拍，再呼吸一拍</h2>${beat()}<p class="ebdmi-task-copy">第 ${state.step + 1} 拍。每一拍由你按下一步，不需要跟任何速度。</p><div class="ebdmi-actions"><button class="ebdmi-btn" type="button" data-beat>🥁 跟一拍</button><button class="ebdmi-btn primary" type="button" data-breath>🌬️ 呼吸一拍</button></div></div>`));
    const next = (kind) => { state.step += 1; progress(state.step * 32); if (state.step >= 3) complete(kind === 'breath' ? '你已用自己的節奏完成三個慢呼吸拍子。' : '你已完成三個節奏拍子。'); else renderRhythm(); };
    by('[data-beat]', overlay).addEventListener('click', () => next('beat')); by('[data-breath]', overlay).addEventListener('click', () => next('breath')); bindToolbar();
  }
  function dragBindings(source, zones, onDrop) {
    let current;
    source.forEach((node) => {
      node.addEventListener('dragstart', (event) => { current = node; event.dataTransfer?.setData('text/plain', node.dataset.value || 'card'); node.classList.add('is-dragging'); zones.forEach((zone) => zone.classList.add('is-ready')); });
      node.addEventListener('dragend', () => { node.classList.remove('is-dragging'); zones.forEach((zone) => zone.classList.remove('is-ready')); current = null; });
      node.addEventListener('click', () => { current = node; zones.forEach((zone) => zone.classList.add('is-ready')); announce(`已選擇 ${node.dataset.label}。現在點選一個位置。`); });
    });
    zones.forEach((zone) => {
      zone.addEventListener('dragover', (event) => { event.preventDefault(); zone.classList.add('is-ready'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('is-ready'));
      zone.addEventListener('drop', (event) => { event.preventDefault(); onDrop(current, zone); current = null; });
      zone.addEventListener('click', () => { if (current) { onDrop(current, zone); current = null; } });
    });
  }
  function renderTidy() {
    const items = active.items || [{ icon: '✏️', label: '鉛筆', target: '文具盒' }, { icon: '📘', label: '圖書', target: '書架' }, { icon: '🧴', label: '水樽', target: '水樽架' }];
    const item = items[state.step];
    const zones = [...new Set(items.map((entry) => entry.target))];
    shell(base(active.title, `<div><div class="ebdmi-hero" aria-hidden="true">${item.icon}</div><h2 class="ebdmi-task-title">把「${item.label}」放好</h2><p class="ebdmi-task-copy">拖圖卡到合適地方；不想拖拉可先點圖卡，再點位置。</p><div class="ebdmi-drag-wrap"><button class="ebdmi-source" draggable="true" data-value="${item.target}" data-label="${item.label}" type="button">${item.icon}<br>${item.label}</button>${zones.map((zone) => `<button class="ebdmi-zone" type="button" data-zone="${zone}">🧺<br>${zone}</button>`).join('')}</div></div>`));
    dragBindings([by('.ebdmi-source', overlay)], [...overlay.querySelectorAll('.ebdmi-zone')], (source, zone) => {
      if (!source) return; if (source.dataset.value === zone.dataset.zone) { zone.classList.add('is-filled'); state.step += 1; progress(state.step * 33); announce(`${item.label} 已放好。`); setTimeout(() => state.step >= items.length ? complete('你慢慢把三樣用品放回原位了。') : renderTidy(), 280); } else { state.incorrect += 1; announce('這個位置不太合適。你可以再看一看，或按提示。'); }
    }); bindToolbar();
  }
  function renderBubble() {
    shell(base(active.title, `<div><button class="ebdmi-bubble" type="button" data-bubble>我現在有一個<br>擔心想法</button><h2 class="ebdmi-task-title">按泡泡，讓想法飄遠一點</h2><p class="ebdmi-task-copy">這不是要趕走想法，只是練習先看見它，然後選一個支持。</p><div class="ebdmi-choice-grid"><button class="ebdmi-choice" type="button" data-support-choice>🛟 告訴成人</button><button class="ebdmi-choice" type="button" data-support-choice>🌬️ 慢慢呼吸</button></div></div>`));
    by('[data-bubble]', overlay).addEventListener('click', (event) => { event.currentTarget.classList.add('float'); progress(50); announce('泡泡正慢慢飄遠。現在可選一張支持卡。'); });
    [...overlay.querySelectorAll('[data-support-choice]')].forEach((button) => button.addEventListener('click', (event) => { event.currentTarget.classList.add('selected'); complete(`你選了「${event.currentTarget.textContent.trim()}」作為下一步。`); })); bindToolbar();
  }
  function renderSafe() {
    const options = active.options || ['🥤 喝一口水', '🌿 去安靜角', '🛟 找成人', '🌬️ 慢呼吸'];
    shell(base(active.title, `<div><div class="ebdmi-hero" aria-hidden="true">🛟</div><h2 class="ebdmi-task-title">選一張支持卡</h2><p class="ebdmi-task-copy">拖一張卡到「我現在可選」，或先點卡再點位置。</p><div class="ebdmi-drag-wrap">${options.map((option) => `<button class="ebdmi-source" draggable="true" data-value="support" data-label="${option}" type="button">${option}</button>`).join('')}<button class="ebdmi-zone" type="button" data-zone="support">⭐<br>我現在可選</button></div></div>`));
    dragBindings([...overlay.querySelectorAll('.ebdmi-source')], [by('.ebdmi-zone', overlay)], (source, zone) => { if (!source) return; zone.classList.add('is-filled'); zone.innerHTML = `⭐<br>${escape(source.dataset.label)}`; progress(100); complete(`你選了「${source.dataset.label}」。你可把這個選擇告訴教師。`); }); bindToolbar();
  }
  function renderCalm() {
    const choices = active.choices || ['🌤️ 看一看窗外的光', '🧸 摸一摸喜歡的物件', '💬 說一句「我想先停一停」'];
    shell(base(active.title, `<div><div class="ebdmi-hero" aria-hidden="true">${active.icon || '🔎'}</div><h2 class="ebdmi-task-title">${escape(active.prompt || '找一個平靜線索')}</h2><p class="ebdmi-task-copy">沒有唯一答案；選一張你覺得較能幫自己穩一穩、較可行或較清楚的卡。</p><div class="ebdmi-choice-grid">${choices.map((choice) => `<button class="ebdmi-choice" type="button" data-calm>${escape(choice)}</button>`).join('')}</div></div>`));
    [...overlay.querySelectorAll('[data-calm]')].forEach((button) => button.addEventListener('click', (event) => { event.currentTarget.classList.add('selected'); complete(`你選了平靜線索：「${event.currentTarget.textContent.trim()}」。`); })); bindToolbar();
  }
  function renderBreath() {
    const beats = ['吸氣', '停一停', '呼氣']; const beat = beats[state.step % beats.length];
    shell(base(active.title, `<div><div class="ebdmi-hero" aria-hidden="true">✨</div><h2 class="ebdmi-task-title">小精靈正在 ${beat}</h2><p class="ebdmi-task-copy">只有準備好才按下一拍。你可以在任何一拍先停一停。</p><div class="ebdmi-beat" aria-hidden="true">${beats.map((name, index) => `<span class="${index === state.step % beats.length ? 'active' : ''}" title="${name}"></span>`).join('')}</div><div class="ebdmi-actions"><button class="ebdmi-btn primary" type="button" data-next>✨ 下一拍</button></div></div>`));
    by('[data-next]', overlay).addEventListener('click', () => { state.step += 1; progress(state.step * 33); if (state.step >= 3) complete('你已按自己的節奏走過一個呼吸循環。') ; else renderBreath(); }); bindToolbar();
  }

  window.EBD_MI_CORE_LAB = {
    activityCards(track, stage) {
      return cards(track, stage).map((activity) => ({ id: `${track}-${activity.id}`, title: activity.title, description: activity.caption, tag: `${stageLabel(stage)} · 直接選關`, icon: activity.icon, tone: track === 'ebd' ? 'pink' : 'purple', supports: [track === 'ebd' ? 'E' : '9'], ebdMiTrack: track, ebdMiActivity: activity.id }));
    },
    openActivity(track, id, options = {}) {
      config = { ...options, track }; active = cards(track, options.stage).find((item) => item.id === id); trigger = options.trigger || document.activeElement;
      if (!active) return; prep();
    }
  };
}());
