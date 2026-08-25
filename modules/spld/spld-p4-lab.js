(function () {
  // 高小 SpLD 答案位置原則：以活動識別碼產生可重現、不規律且無相鄰重複的位置圖樣。
  function answerPositionPattern(total, key) {
    let seed = Array.from(key).reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 2166136261);
    const next = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const counts = [0, 0, 0].map((_, position) => Math.floor(total / 3) + (position < total % 3 ? 1 : 0));
    const output = [];
    while (output.length < total) {
      const previous = output.at(-1);
      const highest = Math.max(...counts.filter((count, position) => position !== previous));
      const candidates = counts.map((count, position) => ({ count, position })).filter((item) => item.position !== previous && item.count === highest);
      const selected = candidates[Math.floor(next() * candidates.length)].position;
      output.push(selected);
      counts[selected] -= 1;
    }
    if (output.length > 1 && output.every((position, index) => position === index % 3)) [output[0], output[1]] = [output[1], output[0]];
    return output;
  }

  const IRREGULAR_CHOICE_ACTIVITIES = new Set(['morpheme', 'collocation', 'context', 'classifier', 'punctuation', 'keyword', 'fraction', 'mindmap']);
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
        { core: '日', category: '用來安排日期的工具', prompt: '以「日」延伸詞語。哪一個最適合放入「用來安排日期的工具」？', choices: ['日曆', '日常', '日落'], answer: '日曆', hint: '日曆會列出每天的日期，方便安排事情。', meaning: '日 → 日曆、日常、日落' },
        { level: 'advanced', core: '觀', category: '看事情的角度或想法', prompt: '以「觀」延伸詞語。哪一個最適合放入「看事情的角度或想法」？', choices: ['觀點', '觀察', '觀眾'], answer: '觀點', hint: '討論事情時，每個人可以有不同的「觀點」。', meaning: '觀 → 觀點、觀察、觀眾' },
        { level: 'advanced', core: '證', category: '支持說法的材料', prompt: '以「證」延伸詞語。哪一個最適合放入「支持說法的材料」？', choices: ['證據', '證書', '證人'], answer: '證據', hint: '提出意見時，可以找資料作為「證據」。', meaning: '證 → 證據、證書、證人' },
        { level: 'advanced', core: '解', category: '把內容說清楚的行動', prompt: '以「解」延伸詞語。哪一個最適合放入「把內容說清楚的行動」？', choices: ['解釋', '解決', '了解'], answer: '解釋', hint: '如果別人不明白，可以用例子「解釋」意思。', meaning: '解 → 解釋、解決、了解' },
        { level: 'advanced', core: '資', category: '可供使用的材料、人手或條件', prompt: '以「資」延伸詞語。哪一個最適合放入「可供使用的材料、人手或條件」？', choices: ['資源', '資料', '資本'], answer: '資源', hint: '圖書、時間和人手都可以是可運用的「資源」。', meaning: '資 → 資源、資料、資本' },
        { level: 'advanced', core: '重', category: '事情最值得關注的部分', prompt: '以「重」延伸詞語。哪一個最適合放入「事情最值得關注的部分」？', choices: ['重點', '重量', '重複'], answer: '重點', hint: '閱讀時先圈出重要的字句，就是找「重點」。', meaning: '重 → 重點、重量、重複' },
        { level: 'advanced', core: '調', category: '為配合需要而作出的改變', prompt: '以「調」延伸詞語。哪一個最適合放入「為配合需要而作出的改變」？', choices: ['調整', '調查', '強調'], answer: '調整', hint: '如果方法不合適，可以作出「調整」。', meaning: '調 → 調整、調查、強調' },
        { level: 'advanced', core: '發', category: '把消息或作品正式傳送出去', prompt: '以「發」延伸詞語。哪一個最適合放入「把消息或作品正式傳送出去」？', choices: ['發布', '發展', '發明'], answer: '發布', hint: '學校可以在網站「發布」活動消息。', meaning: '發 → 發布、發展、發明' },
        { level: 'advanced', core: '效', category: '做事後實際產生的結果', prompt: '以「效」延伸詞語。哪一個最適合放入「做事後實際產生的結果」？', choices: ['效果', '效率', '效力'], answer: '效果', hint: '試用一個方法後，可以看看它有沒有好的「效果」。', meaning: '效 → 效果、效率、效力' },
        { level: 'advanced', core: '聯', category: '把資料或想法互相接合', prompt: '以「聯」延伸詞語。哪一個最適合放入「把資料或想法互相接合」？', choices: ['聯繫', '聯想', '聯合'], answer: '聯繫', hint: '閱讀時把前後段的意思連起來，就是建立「聯繫」。', meaning: '聯 → 聯繫、聯想、聯合' },
        { level: 'advanced', core: '評', category: '對事物作出判斷和看法', prompt: '以「評」延伸詞語。哪一個最適合放入「對事物作出判斷和看法」？', choices: ['評價', '評語', '評分'], answer: '評價', hint: '比較兩個方法的好處時，可以作出「評價」。', meaning: '評 → 評價、評語、評分' },
        { level: 'advanced', core: '行', category: '為完成事情而採取的具體做法', prompt: '以「行」延伸詞語。哪一個最適合放入「為完成事情而採取的具體做法」？', choices: ['行動', '行程', '行人'], answer: '行動', hint: '有了計畫後，下一步就是採取「行動」。', meaning: '行 → 行動、行程、行人' },
        { level: 'advanced', core: '論', category: '提出並支持看法的文字或說話', prompt: '以「論」延伸詞語。哪一個最適合放入「提出並支持看法的文字或說話」？', choices: ['論述', '論文', '討論'], answer: '論述', hint: '寫作時用理由支持一個看法，就是作出「論述」。', meaning: '論 → 論述、論文、討論' },
        { level: 'challenge', core: '論', category: '文章希望讀者接受的核心主張', prompt: '以「論」延伸詞語。哪一個最適合放入「文章希望讀者接受的核心主張」？', choices: ['論點', '論據', '論證'], answer: '論點', hint: '論點是作者最想成立的看法；論據是支持它的材料。', meaning: '論 → 論點、論據、論證' },
        { level: 'challenge', core: '據', category: '用來支持說法的事實、例子或資料', prompt: '以「據」延伸詞語。哪一個最適合放入「用來支持說法的事實、例子或資料」？', choices: ['根據', '根本', '根源'], answer: '根據', hint: '有資料作「根據」，說法才不只是猜想。', meaning: '據 → 根據、根本、根源' },
        { level: 'challenge', core: '概', category: '概括事情主要內容的簡短說明', prompt: '以「概」延伸詞語。哪一個最適合放入「概括事情主要內容的簡短說明」？', choices: ['概述', '概念', '概況'], answer: '概述', hint: '先抽出最重要的內容，再用幾句話作「概述」。', meaning: '概 → 概述、概念、概況' },
        { level: 'challenge', core: '推', category: '根據資料一步步得出的結論', prompt: '以「推」延伸詞語。哪一個最適合放入「根據資料一步步得出的結論」？', choices: ['推論', '推測', '推薦'], answer: '推論', hint: '推論要由已知資料和理由出發，不只是隨意猜測。', meaning: '推 → 推論、推測、推薦' },
        { level: 'challenge', core: '因', category: '使事情發生的主要理由', prompt: '以「因」延伸詞語。哪一個最適合放入「使事情發生的主要理由」？', choices: ['原因', '因而', '因素'], answer: '原因', hint: '問「為甚麼會這樣」時，答案通常是在找事情的「原因」。', meaning: '因 → 原因、因而、因素' },
        { level: 'challenge', core: '結', category: '綜合資料後得出的最後判斷', prompt: '以「結」延伸詞語。哪一個最適合放入「綜合資料後得出的最後判斷」？', choices: ['結論', '結構', '結果'], answer: '結論', hint: '分析完資料後，用一句話說出最後判斷，就是「結論」。', meaning: '結 → 結論、結構、結果' },
        { level: 'challenge', core: '比', category: '把兩項或多項事物放在一起看異同', prompt: '以「比」延伸詞語。哪一個最適合放入「把兩項或多項事物放在一起看異同」？', choices: ['比較', '比率', '比賽'], answer: '比較', hint: '找出相同和不同之處，是在做「比較」。', meaning: '比 → 比較、比率、比賽' },
        { level: 'challenge', core: '策', category: '為解決問題而規劃的方法', prompt: '以「策」延伸詞語。哪一個最適合放入「為解決問題而規劃的方法」？', choices: ['策略', '策劃', '策展'], answer: '策略', hint: '面對問題時，先想可行的方法和步驟，就是訂出「策略」。', meaning: '策 → 策略、策劃、策展' },
        { level: 'challenge', core: '態', category: '對事情所持的看法或傾向', prompt: '以「態」延伸詞語。哪一個最適合放入「對事情所持的看法或傾向」？', choices: ['態度', '狀態', '形態'], answer: '態度', hint: '願意認真聆聽和回應，是一種學習「態度」。', meaning: '態 → 態度、狀態、形態' },
        { level: 'challenge', core: '釋', category: '說明字詞、概念或現象意思的文字', prompt: '以「釋」延伸詞語。哪一個最適合放入「說明字詞、概念或現象意思的文字」？', choices: ['釋義', '釋放', '釋然'], answer: '釋義', hint: '字典中的解釋就是為字詞提供「釋義」。', meaning: '釋 → 釋義、釋放、釋然' },
        { level: 'challenge', core: '範', category: '可供仿效或依循的例子', prompt: '以「範」延伸詞語。哪一個最適合放入「可供仿效或依循的例子」？', choices: ['示範', '範圍', '規範'], answer: '示範', hint: '老師先做一次給大家看，是一種「示範」。', meaning: '範 → 示範、範圍、規範' },
        { level: 'challenge', core: '架', category: '用來組織觀點或內容的整體結構', prompt: '以「架」延伸詞語。哪一個最適合放入「用來組織觀點或內容的整體結構」？', choices: ['架構', '架勢', '書架'], answer: '架構', hint: '先安排文章各部分怎樣連接，就是建立寫作「架構」。', meaning: '架 → 架構、架勢、書架' }
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
        { subject: '家人', verb: '準備', object: '晚餐', hint: '家人做的是準備；準備的內容是晚餐。' },
        { level: 'advanced', subject: '學生', verb: '運用', object: '上下文線索推斷詞義', hint: '誰做運用？學生；運用甚麼？上下文線索；目的是推斷詞義。' },
        { level: 'advanced', subject: '圖書館', verb: '提供', object: '多元化的學習資源', hint: '圖書館是提供者；提供的是多元化的學習資源。' },
        { level: 'advanced', subject: '校長', verb: '鼓勵', object: '學生積極參與服務', hint: '先找人物「校長」；再找動作「鼓勵」；最後是鼓勵的內容。' },
        { level: 'advanced', subject: '研究報告', verb: '說明', object: '調查所得的結果', hint: '研究報告是主語；它說明的是調查所得的結果。' },
        { level: 'advanced', subject: '小組成員', verb: '整理', object: '訪問記錄和重點', hint: '誰做整理？小組成員；整理的是訪問記錄和重點。' },
        { level: 'advanced', subject: '班會', verb: '討論', object: '改善課室環境的方法', hint: '班會是討論發生的主體；討論的是改善課室環境的方法。' },
        { level: 'advanced', subject: '新聞報道', verb: '呈現', object: '事件的不同觀點', hint: '新聞報道是主語；它呈現的是事件的不同觀點。' },
        { level: 'advanced', subject: '義工', verb: '協助', object: '長者使用電子服務', hint: '義工做協助；協助的對象和內容是長者使用電子服務。' },
        { level: 'advanced', subject: '我們', verb: '訂立', object: '本學期的閱讀目標', hint: '「我們」是做事的人；訂立的是本學期的閱讀目標。' },
        { level: 'advanced', subject: '導師', verb: '安排', object: '小組討論的時間', hint: '導師是安排的人；安排的是小組討論的時間。' },
        { level: 'advanced', subject: '家長', verb: '支持', object: '子女培養閱讀習慣', hint: '家長作出支持；支持的是子女培養閱讀習慣。' },
        { level: 'advanced', subject: '學校', verb: '推行', object: '環保回收計畫', hint: '學校是推行者；推行的是環保回收計畫。' },
        { level: 'challenge', subject: '作者', verb: '提出', object: '明確的論點', hint: '作者是主語；提出的是希望讀者接受的論點。' },
        { level: 'challenge', subject: '學生', verb: '比較', object: '兩種解題策略', hint: '學生做比較；比較的是兩種解題策略。' },
        { level: 'challenge', subject: '圖表', verb: '顯示', object: '閱讀習慣的變化', hint: '圖表是主語；它顯示的是閱讀習慣的變化。' },
        { level: 'challenge', subject: '班級', verb: '制定', object: '實踐環保的計畫', hint: '班級是做計畫的人；制定的是一個實踐環保的計畫。' },
        { level: 'challenge', subject: '義工', verb: '協助', object: '社區活動的安排', hint: '義工做協助；協助的是社區活動的安排。' },
        { level: 'challenge', subject: '校方', verb: '蒐集', object: '師生對活動的意見', hint: '校方是蒐集者；蒐集的是師生對活動的意見。' },
        { level: 'challenge', subject: '研究小組', verb: '分析', object: '調查所得的數據', hint: '誰在做分析？研究小組；分析甚麼？調查所得的數據。' },
        { level: 'challenge', subject: '團隊', verb: '評估', object: '活動推行的成效', hint: '團隊做評估；評估的是活動推行的成效。' },
        { level: 'challenge', subject: '導師', verb: '引導', object: '學生修訂論證結構', hint: '導師做引導；引導的內容是學生修訂論證結構。' },
        { level: 'challenge', subject: '小組', verb: '檢視', object: '報告的論據是否足夠', hint: '小組是主語；檢視的是報告的論據是否足夠。' }
      ]
    },
    collocation: {
      icon: '🤝',
      title: '詞語配對連連看',
      description: '把合適的動詞和名詞配成自然、完整的詞語搭配。',
      focus: '詞彙搭配與語感',
      accent: 'orange',
      rounds: [
        { verb: '發揮', target: '潛能', choices: ['潛能', '雨傘', '課室'], hint: '「潛能」是人的能力；可以說「發揮潛能」。' },
        { verb: '培養', target: '習慣', choices: ['習慣', '日期', '馬路'], hint: '每天重複做一件事，可以慢慢「培養習慣」。' },
        { verb: '遵守', target: '規則', choices: ['規則', '書包', '笑聲'], hint: '校園或比賽都有需要大家「遵守規則」的地方。' },
        { verb: '提供', target: '機會', choices: ['機會', '帽子', '窗戶'], hint: '學校可以「提供機會」讓同學參加不同活動。' },
        { verb: '參加', target: '活動', choices: ['活動', '水果', '答案'], hint: '運動日、興趣班都是可以「參加活動」的例子。' },
        { verb: '完成', target: '任務', choices: ['任務', '天氣', '聲音'], hint: '做完老師交代的工作，就是「完成任務」。' },
        { verb: '解決', target: '困難', choices: ['困難', '圖書', '校服'], hint: '遇到問題時，我們可以一起想方法「解決困難」。' },
        { verb: '整理', target: '資料', choices: ['資料', '鼻子', '燈光'], hint: '把筆記、圖片和重點放好，是「整理資料」。' },
        { verb: '表達', target: '意見', choices: ['意見', '雨水', '座位'], hint: '在小組討論中，可以清楚「表達意見」。' },
        { verb: '訂立', target: '目標', choices: ['目標', '顏色', '走廊'], hint: '想知道自己要完成甚麼，可以先「訂立目標」。' }
      ]
    },
    context: {
      icon: '🕵️',
      title: '上下文偵探',
      description: '看前後句和情境圖像，推斷被遮蔽的關鍵詞。',
      focus: '上下文線索與閱讀監控',
      accent: 'blue',
      rounds: [
        { picture: '📚', sentence: '這本圖書很有趣，我想＿＿它借回家。', target: '把', choices: ['把', '向', '比'], hint: '看看「它借回家」：前面需要一個把物件放在動作前的字。' },
        { picture: '🌧️', sentence: '天色開始變暗，外出時要＿＿雨傘。', target: '帶', choices: ['帶', '畫', '洗'], hint: '下雨時，要把雨傘拿在身邊，所以選「帶」。' },
        { picture: '📅', sentence: '活動通知寫著星期五交回條，大家要＿＿時間。', target: '留意', choices: ['留意', '忘記', '跳過'], hint: '通知有截止日期，要先看清和記住時間。' },
        { picture: '🥤', sentence: '阿明忘了帶水樽，天氣很熱，他需要＿＿水分。', target: '補充', choices: ['補充', '減少', '隱藏'], hint: '天氣很熱時，身體需要喝水來補回水分。' },
        { picture: '👥', sentence: '小組報告明天進行，大家今天要＿＿分工。', target: '確認', choices: ['確認', '丟掉', '取消'], hint: '報告前要知道每個人負責甚麼，所以先看清分工。' },
        { picture: '🤫', sentence: '圖書館內要保持安靜，說話時應＿＿聲量。', target: '放低', choices: ['放低', '提高', '忘記'], hint: '保持安靜表示聲音要小一點。' },
        { picture: '⏰', sentence: '借書後要看清歸還日，避免＿＿還書。', target: '遲', choices: ['遲', '早', '常'], hint: '如果錯過歸還日，就是太遲才還書。' },
        { picture: '📝', sentence: '老師展示步驟後，先＿＿第一步再開始。', target: '閱讀', choices: ['閱讀', '刪除', '跳走'], hint: '要按步驟做，先仔細看清第一步的內容。' },
        { picture: '🧥', sentence: '天氣轉冷，出門前應＿＿外套。', target: '穿上', choices: ['穿上', '放下', '借走'], hint: '冷的時候，要把外套穿在身上保暖。' },
        { picture: '✅', sentence: '交功課前要＿＿姓名和日期有沒有寫好。', target: '檢查', choices: ['檢查', '遮住', '猜想'], hint: '交出前再看一次，是為了確保沒有遺漏。' }
      ]
    },
    memory: {
      icon: '🃏',
      title: '同反義詞翻牌',
      description: '翻開詞語卡，找出意思相同或相反的兩張卡。',
      focus: '同反義詞與語義網絡',
      accent: 'pink',
      rounds: [
        { relation: '同義詞', pairs: [['快樂', '開心'], ['安靜', '寧靜']], hint: '同義詞的意思相近；想一想兩個詞讀起來會不會表達相同感受。' },
        { relation: '反義詞', pairs: [['開始', '結束'], ['困難', '容易']], hint: '反義詞的意思相反；一個詞出現時，另一個詞常表示相反情況。' },
        { relation: '同義詞', pairs: [['幫助', '協助'], ['快速', '迅速']], hint: '「幫助」和「協助」的意思很接近；「快速」和「迅速」也是。' },
        { relation: '反義詞', pairs: [['增加', '減少'], ['安全', '危險']], hint: '數量變多和變少相反；安全與危險的情況也相反。' },
        { relation: '同義詞', pairs: [['選擇', '挑選'], ['參加', '加入']], hint: '看看兩個詞在句子中是否可以互相替換，意思仍然接近。' },
        { relation: '反義詞', pairs: [['成功', '失敗'], ['接受', '拒絕']], hint: '完成得好是成功；沒有做到是失敗。接受和拒絕亦是相反意思。' },
        { relation: '同義詞', pairs: [['整理', '收拾'], ['欣賞', '喜愛']], hint: '整理和收拾都表示把東西放好；欣賞和喜愛都帶有喜歡的意思。' },
        { relation: '反義詞', pairs: [['上升', '下降'], ['豐富', '貧乏']], hint: '向上和向下相反；多和少也可以表達相反的意思。' },
        { relation: '同義詞', pairs: [['安排', '規劃'], ['建議', '提議']], hint: '安排和規劃都與事前準備有關；建議和提議都是提出想法。' },
        { relation: '反義詞', pairs: [['進步', '退步'], ['清楚', '模糊']], hint: '能力變好是進步，變差是退步；看得清楚和模糊亦相反。' }
      ]
    },
    classifier: {
      icon: '🧮',
      title: '量詞填空大闖關',
      description: '為不同名詞選擇精確量詞，完成完整詞組。',
      focus: '量詞規則與語法準確性',
      accent: 'yellow',
      rounds: [
        { noun: '帽子', target: '頂', choices: ['頂', '本', '條'], picture: '🧢', hint: '帽子戴在頭上，常說「一頂帽子」。' },
        { noun: '圖書', target: '本', choices: ['本', '把', '枝'], picture: '📘', hint: '書本一頁一頁組成，所以常說「一本圖書」。' },
        { noun: '鉛筆', target: '枝', choices: ['枝', '輛', '所'], picture: '✏️', hint: '細長的筆可以用「枝」來數。' },
        { noun: '雨傘', target: '把', choices: ['把', '張', '杯'], picture: '☂️', hint: '有手把可以拿著的雨傘，常說「一把雨傘」。' },
        { noun: '工作紙', target: '張', choices: ['張', '件', '頂'], picture: '📄', hint: '薄薄一頁紙，常用「張」來數。' },
        { noun: '外套', target: '件', choices: ['件', '本', '輛'], picture: '🧥', hint: '衣服通常用「件」來數。' },
        { noun: '單車', target: '輛', choices: ['輛', '枝', '條'], picture: '🚲', hint: '單車是車輛的一種，可以說「一輛單車」。' },
        { noun: '果汁', target: '杯', choices: ['杯', '所', '把'], picture: '🥤', hint: '倒進杯子裡的飲品，常說「一杯果汁」。' },
        { noun: '毛巾', target: '條', choices: ['條', '張', '件'], picture: '🧻', hint: '長長的毛巾，可以說「一條毛巾」。' },
        { noun: '學校', target: '所', choices: ['所', '輛', '枝'], picture: '🏫', hint: '學校、醫院等地方，常用「所」來數。' }
      ]
    },
    punctuation: {
      icon: '✒️', title: '標點符號迷宮', description: '根據句子語氣和停頓，選出最合適的標點符號。', focus: '斷句與語氣辨識', accent: 'orange', mode: 'context',
      rounds: [
        { picture: '❓', sentence: '「你今天帶了圖書證＿＿」句末應放甚麼？', target: '？', choices: ['？', '。', '！'], hint: '這是一個想知道答案的問句，用問號。' },
        { picture: '🎉', sentence: '「太好了，我們完成報告了＿＿」句末應放甚麼？', target: '！', choices: ['！', '？', '，'], hint: '很高興或很有力地說話，可以用感嘆號。' },
        { picture: '📖', sentence: '「小明今天到圖書館借書＿＿」句末應放甚麼？', target: '。', choices: ['。', '？', '！'], hint: '這是一句平靜說明，用句號。' },
        { picture: '🧺', sentence: '「請帶水樽＿＿帽子和毛巾。」空格應放甚麼？', target: '、', choices: ['、', '？', '！'], hint: '列出三樣物品時，物品之間可用頓號。' },
        { picture: '🗣️', sentence: '「老師說＿＿先看題目，再作答。」空格應放甚麼？', target: '：', choices: ['：', '。', '、'], hint: '說話內容前面常用冒號。' },
        { picture: '🌧️', sentence: '「雖然下雨＿＿我們仍會在禮堂活動。」空格應放甚麼？', target: '，', choices: ['，', '！', '？'], hint: '前後兩個短句之間需要短暫停頓，用逗號。' },
        { picture: '📚', sentence: '「我最喜歡的地方是圖書館＿＿」句末應放甚麼？', target: '。', choices: ['。', '？', '：'], hint: '這是一句完整的說明句，用句號。' },
        { picture: '🙋', sentence: '「請問集合地點在哪裏＿＿」句末應放甚麼？', target: '？', choices: ['？', '！', '、'], hint: '問集合地點是一個問題，用問號。' }
      ]
    },
    keyword: {
      icon: '🔑', title: '關鍵字尋寶', description: '在短訊息中找出時間、地點、人物或任務重點。', focus: '尋讀與資訊篩選', accent: 'teal', mode: 'context',
      rounds: [
        { picture: '📅', sentence: '通知：請在星期五前交回家長通告。哪個是重要日期？', target: '星期五', choices: ['星期五', '家長', '通告'], hint: '先找表示時間的詞語。' },
        { picture: '📍', sentence: '明天早上九時在禮堂集合。哪個是集合地點？', target: '禮堂', choices: ['禮堂', '九時', '明天'], hint: '找表示在哪裏的地方名稱。' },
        { picture: '🧴', sentence: '遠足日請帶水樽和雨傘。哪個是要帶的物品？', target: '水樽', choices: ['水樽', '遠足日', '請帶'], hint: '找「帶」字後面的用品。' },
        { picture: '👥', sentence: '班長負責在活動前提醒大家集合。誰負責提醒？', target: '班長', choices: ['班長', '大家', '活動'], hint: '找句子中做這件事的人。' },
        { picture: '📚', sentence: '圖書館星期三會提早在四時關門。哪個是關門時間？', target: '四時', choices: ['四時', '星期三', '圖書館'], hint: '先找數字和時間單位。' },
        { picture: '🧪', sentence: '科學課前請完成安全檢查表。要先完成甚麼？', target: '安全檢查表', choices: ['安全檢查表', '科學課', '課前'], hint: '找「請完成」後面的任務。' },
        { picture: '🚌', sentence: '校巴將於下午三時半在正門開出。校巴在哪裏開出？', target: '正門', choices: ['正門', '三時半', '下午'], hint: '找表示地點的字詞。' },
        { picture: '✉️', sentence: '請把問題電郵給陳老師。應聯絡誰？', target: '陳老師', choices: ['陳老師', '問題', '電郵'], hint: '找「給」字後面的收件人。' }
      ]
    },
    fraction: {
      icon: '🍕', title: '分數面積切割', description: '把圖像和分數意思配好，建立整體與部分的概念。', focus: '分數視覺表徵', accent: 'pink', mode: 'context',
      rounds: [
        { picture: '🍕', sentence: '一個薄餅平均分成 2 份，吃了其中 1 份，是多少？', target: '二分之一', choices: ['二分之一', '三分之一', '四分之一'], hint: '整體有兩等份，選了一份，就是二分之一。' },
        { picture: '🍫', sentence: '一條朱古力平均分成 4 格，吃了 1 格，是多少？', target: '四分之一', choices: ['四分之一', '二分之一', '四分之三'], hint: '分母看總格數 4，分子看選了 1 格。' },
        { picture: '🍎', sentence: '把 1 個蘋果平均切成 4 份，拿了 2 份，是多少？', target: '二分之一', choices: ['二分之一', '四分之一', '四分之三'], hint: '四份中的兩份，和一半一樣多。' },
        { picture: '🎂', sentence: '蛋糕平均分成 8 份，留下 6 份，是多少？', target: '八分之六', choices: ['八分之六', '八分之二', '六分之八'], hint: '總數是 8，留下的是 6，先說總份數再說選取份數。' },
        { picture: '🟦', sentence: '圖形平均分成 3 部分，塗了 1 部分，是多少？', target: '三分之一', choices: ['三分之一', '三分之二', '二分之一'], hint: '三等份中有一份塗色。' },
        { picture: '🍉', sentence: '西瓜平均分成 6 份，吃了 3 份，最接近多少？', target: '二分之一', choices: ['二分之一', '三分之一', '六分之一'], hint: '6 份的一半是 3 份。' },
        { picture: '🧩', sentence: '拼圖平均分成 5 塊，完成了 4 塊，是多少？', target: '五分之四', choices: ['五分之四', '四分之五', '五分之一'], hint: '總共有 5 塊，完成 4 塊。' },
        { picture: '🥛', sentence: '一杯果汁喝掉一半，最合適的分數是？', target: '二分之一', choices: ['二分之一', '四分之一', '三分之一'], hint: '一半就是把整體平均分兩份，取其中一份。' }
      ]
    },
    mindmap: {
      icon: '🧠', title: '心智地圖填空', description: '從短文找出中心概念和合適的重點分支。', focus: '圖像組織與閱讀理解', accent: 'blue', mode: 'context',
      rounds: [
        { picture: '🌱', sentence: '中心概念是「種植」。哪一個最適合作為分支？', target: '澆水', choices: ['澆水', '校巴', '雨傘'], hint: '澆水是照顧植物時會做的事。' },
        { picture: '📚', sentence: '中心概念是「圖書館」。哪一個最適合作為分支？', target: '借書', choices: ['借書', '煮飯', '游泳'], hint: '圖書館提供借書和閱讀服務。' },
        { picture: '♻️', sentence: '中心概念是「環保」。哪一個最適合作為分支？', target: '回收', choices: ['回收', '浪費', '插隊'], hint: '回收可以減少浪費，是環保行動。' },
        { picture: '🏃', sentence: '中心概念是「健康」。哪一個最適合作為分支？', target: '運動', choices: ['運動', '熬夜', '亂丟垃圾'], hint: '適量運動有助保持健康。' },
        { picture: '🚌', sentence: '中心概念是「外出」。哪一個最適合作為分支？', target: '看路線', choices: ['看路線', '忘記地點', '不帶用品'], hint: '外出前先看路線，會較容易做好準備。' },
        { picture: '👥', sentence: '中心概念是「小組合作」。哪一個最適合作為分支？', target: '分工', choices: ['分工', '責怪', '離開'], hint: '小組合作時，先分工能令每人知道自己的任務。' },
        { picture: '📖', sentence: '中心概念是「閱讀理解」。哪一個最適合作為分支？', target: '圈關鍵詞', choices: ['圈關鍵詞', '跳過全文', '只看圖片'], hint: '圈出關鍵詞可以幫助找資料和理解重點。' },
        { picture: '🌧️', sentence: '中心概念是「下雨天」。哪一個最適合作為分支？', target: '帶雨傘', choices: ['帶雨傘', '穿泳衣', '忘記天氣'], hint: '下雨天帶雨傘是實際準備。' }
      ]
    }
  };

  let activeKey = '';
  let roundIndex = 0;
  let selectedBlocks = [];
  let blockOptions = [];
  let flippedCards = [];
  let matchedPairs = [];
  let memoryCards = [];
  let memoryPreviewVisible = false;
  let memoryPhase = 'study';
  let draggedSentenceBlock = '';
  let touchSentenceDrag = null;
  let suppressTouchSentenceClick = false;
  let result = { correct: 0, retries: 0, hints: 0 };
  let completed = false;
  let selectedDifficulty = 'basic';
  const difficultySettings = {
    basic: { label: '初階', shortLabel: '常見詞／短句', description: '常見詞義與三格句型', note: '適合先建立成功經驗。' },
    advanced: { label: '進階', shortLabel: '抽象詞／長句', description: '抽象詞義與較長句子', note: '適合熟悉基本規則後再嘗試。' },
    challenge: { label: '挑戰', shortLabel: '論證詞／精準分類', description: '論證詞彙與精準語義分類', note: '可先慢讀類別，再找最符合定義的詞語。' }
  };

  const currentActivity = () => activities[activeKey];
  const activityMode = () => currentActivity()?.mode || (activeKey === 'morpheme' ? 'morpheme' : activeKey === 'sentence' ? 'sentence' : activeKey === 'collocation' ? 'collocation' : activeKey === 'context' ? 'context' : activeKey === 'memory' ? 'memory' : 'classifier');
  const isGradedActivity = () => activeKey === 'morpheme' || activeKey === 'sentence';
  const currentRounds = () => isGradedActivity() ? currentActivity().rounds.filter((round) => (round.level || 'basic') === selectedDifficulty) : currentActivity().rounds;
  const currentRound = () => currentRounds()[roundIndex];
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
    const rounds = currentRounds();
    return `<div class="spld-p4-progress"><span>第 ${roundIndex + 1} / ${rounds.length} 關</span><div><i style="width:${((roundIndex + 1) / rounds.length) * 100}%"></i></div></div>`;
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

  function clearTouchSentenceDrag() {
    document.querySelectorAll('.spld-p4-block.touch-ready,.spld-p4-block.touch-dragging').forEach((block) => block.classList.remove('touch-ready', 'touch-dragging'));
    document.querySelectorAll('[data-sentence-slot].touch-drag-over').forEach((slot) => slot.classList.remove('touch-drag-over'));
    touchSentenceDrag = null;
  }

  function sentenceSlotAtPoint(clientX, clientY) {
    return document.elementFromPoint(clientX, clientY)?.closest?.('[data-sentence-slot]') || null;
  }

  function bindTouchSentenceDrag(button, round) {
    button.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch') return;
      touchSentenceDrag = { pointerId: event.pointerId, block: button.dataset.block || '', startX: event.clientX, startY: event.clientY, moved: false };
      button.classList.add('touch-ready');
      button.setPointerCapture?.(event.pointerId);
    });
    button.addEventListener('pointermove', (event) => {
      const drag = touchSentenceDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 10) return;
      if (!drag.moved) {
        drag.moved = true;
        button.classList.remove('touch-ready');
        button.classList.add('touch-dragging');
        feedback(`已拿起「${drag.block}」。拖到主語、謂語或賓語位置後放開。`, 'hint');
      }
      event.preventDefault();
      document.querySelectorAll('[data-sentence-slot].touch-drag-over').forEach((slot) => slot.classList.remove('touch-drag-over'));
      sentenceSlotAtPoint(event.clientX, event.clientY)?.classList.add('touch-drag-over');
    });
    button.addEventListener('pointerup', (event) => {
      const drag = touchSentenceDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (!drag.moved) {
        clearTouchSentenceDrag();
        return;
      }
      event.preventDefault();
      const slot = sentenceSlotAtPoint(event.clientX, event.clientY);
      clearTouchSentenceDrag();
      suppressTouchSentenceClick = true;
      window.setTimeout(() => { suppressTouchSentenceClick = false; }, 260);
      if (slot) {
        placeSentenceBlock(drag.block, Number(slot.dataset.sentenceSlot), round);
        return;
      }
      feedback(`「${drag.block}」已放回積木區。可慢慢再試，或直接點選積木。`, 'hint');
    });
    button.addEventListener('pointercancel', clearTouchSentenceDrag);
  }

  function difficultyMarkup() {
    if (!isGradedActivity()) return '';
    const setting = difficultySettings[selectedDifficulty];
    return `<section class="spld-p4-difficulty" aria-label="難度選擇"><div><span>本節難度</span><strong>${setting.label}</strong><small>${setting.description}</small></div><div class="spld-p4-difficulty-buttons" role="group" aria-label="選擇練習難度">${Object.entries(difficultySettings).map(([key, item]) => `<button type="button" class="${selectedDifficulty === key ? 'active' : ''}" data-p4-difficulty="${key}" aria-pressed="${selectedDifficulty === key}">${item.label}<small>${item.shortLabel}</small></button>`).join('')}</div><p>${setting.note}</p></section>`;
  }

  function morphemeMarkup(round) {
    return `<div class="spld-p4-chain"><div class="spld-p4-core"><span>核心語素</span><strong>${round.core}</strong></div><span class="spld-p4-arrow">→</span><div class="spld-p4-category"><span>意思類別</span><strong>${round.category}</strong></div></div><p class="spld-p4-prompt">${round.prompt}</p><p class="spld-p4-meaning">詞彙網絡：${round.meaning}</p><div class="spld-p4-choice-grid">${round.choices.map((choice, index) => `<button type="button" class="spld-p4-choice" data-choice="${choice}"><span>${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div>`;
  }

  function sentenceMarkup(round) {
    const labels = ['主語（誰）', '謂語（做甚麼）', '賓語（甚麼）'];
    const complete = selectedBlocks.filter(Boolean).length === labels.length;
    return `<div class="spld-p4-sentence-guide"><span>句法積木</span><strong>先找誰 → 做甚麼 → 甚麼</strong></div><p class="spld-p4-prompt">可把積木拖到合適位置；也可直接點選積木，按次序放入。</p><p class="spld-p4-drag-note" id="spldP4DragNote">手機：手指拖動後放開；也可輕按積木。句子會在三格都完成後才顯示。</p><div class="spld-p4-slots" aria-describedby="spldP4DragNote">${labels.map((label, index) => `<div class="spld-p4-slot ${selectedBlocks[index] ? 'filled' : ''}" data-sentence-slot="${index}" role="button" tabindex="0" aria-label="${label}放置位置，目前${selectedBlocks[index] || '未放置'}"><span>${label}</span><strong>${selectedBlocks[index] || '？'}</strong></div>`).join('')}</div><p class="spld-p4-sentence-preview">${complete ? selectedBlocks.join(' ') : '完成三格後，這裡會出現完整句子。'}</p><div class="spld-p4-block-bank" aria-label="可拖拉或點選的句子積木">${blockOptions.map((block) => `<button type="button" class="spld-p4-block ${selectedBlocks.includes(block) ? 'used' : ''}" data-block="${block}" draggable="${!selectedBlocks.includes(block)}" style="touch-action:none" ${selectedBlocks.includes(block) ? 'disabled' : ''}>${block}</button>`).join('')}</div>`;
  }

  function collocationMarkup(round) {
    return `<div class="spld-p4-collocation-scene"><span>動詞</span><strong>${round.verb}</strong><em>＋</em><b>？</b></div><p class="spld-p4-prompt">「${round.verb}」最適合配哪一個詞語？</p><p class="spld-p4-meaning">把常一起出現的詞語配好，讀起來會更自然。</p>${choiceGridMarkup(round.choices)}`;
  }

  function contextMarkup(round) {
    return `<div class="spld-p4-context-scene"><span>${round.picture}</span><p>${round.sentence.replace('＿＿', '<strong>＿＿</strong>')}</p></div><p class="spld-p4-prompt">根據前後句和圖像，選出最合適的關鍵詞。</p>${choiceGridMarkup(round.choices)}`;
  }

  function classifierMarkup(round) {
    return `<div class="spld-p4-classifier-scene"><span>${round.picture}</span><strong>一＿＿${round.noun}</strong></div><p class="spld-p4-prompt">「${round.noun}」應該用哪一個精確量詞？</p><p class="spld-p4-meaning">慢慢把量詞和名詞一起讀一遍。</p>${choiceGridMarkup(round.choices)}`;
  }

  function choiceGridMarkup(choices) {
    return `<section class="spld-p4-mission-board" aria-label="詞彙任務台"><div class="spld-p4-choice-dock" data-p4-choice-dock role="img" aria-label="任務格。可把策略卡拖到這裏，或直接點選策略卡。"><span>🎯</span><strong>任務格</strong><small>把最合適的詞卡送進來</small></div><p>可拖放策略卡；不想拖放時，直接點選亦可。</p><div class="spld-p4-choice-grid">${choices.map((choice, index) => `<button type="button" class="spld-p4-choice" data-choice="${choice}" draggable="true"><span>${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div></section>`;
  }

  function prepareMemoryCards(round) {
    memoryCards = shuffle(round.pairs.flatMap((pair, pairIndex) => [
      { id: `pair-${roundIndex}-${pairIndex}-a`, pairId: pairIndex, word: pair[0] },
      { id: `pair-${roundIndex}-${pairIndex}-b`, pairId: pairIndex, word: pair[1] }
    ]));
    flippedCards = [];
    matchedPairs = [];
    memoryPreviewVisible = false;
    memoryPhase = 'study';
  }

  function memoryMarkup(round) {
    const studying = memoryPhase === 'study';
    const stageText = studying ? (memoryPreviewVisible ? '慢慢讀一讀；準備好才開始配對。' : '先翻開全部卡片，讓學生一起讀和記住詞語。') : '每次翻兩張卡；找到一組後，再找下一組。';
    return `<div class="spld-p4-memory-guide"><span>配對類別</span><strong>${round.relation}</strong><small>找出兩組意思${round.relation === '同義詞' ? '相近' : '相反'}的詞語</small></div><p class="spld-p4-prompt">${stageText}</p><div class="spld-p4-memory-board ${studying ? 'study' : 'match'}">${memoryCards.map((card) => {
      const revealed = studying ? memoryPreviewVisible : (flippedCards.includes(card.id) || matchedPairs.includes(card.pairId));
      return `<button type="button" class="spld-p4-memory-card ${revealed ? 'revealed' : ''} ${matchedPairs.includes(card.pairId) ? 'matched' : ''}" data-memory-card="${card.id}" ${studying || matchedPairs.includes(card.pairId) ? 'disabled' : ''} aria-label="${revealed ? card.word : '未翻開的詞語卡'}"><span>${revealed ? card.word : '？'}</span><small>${revealed ? round.relation : '點選翻開'}</small></button>`;
    }).join('')}</div>${studying ? `<div class="spld-p4-memory-actions"><button type="button" id="spldP4MemoryStudy">${memoryPreviewVisible ? '我記好了，開始配對' : '👀 翻開全部詞語卡'}</button><span>${memoryPreviewVisible ? '可先多看一會，不需要計時。' : '卡片尚未翻開；按按鈕後可一起慢讀。'}</span></div>` : ''}`;
  }

  function renderRound() {
    const activity = currentActivity();
    const round = currentRound();
    const mode = activityMode();
    const playArea = mode === 'morpheme' ? morphemeMarkup(round) : mode === 'sentence' ? sentenceMarkup(round) : mode === 'collocation' ? collocationMarkup(round) : mode === 'context' ? contextMarkup(round) : mode === 'memory' ? memoryMarkup(round) : classifierMarkup(round);
    const heading = `<div class="spld-p4-heading compact"><span class="spld-p4-kicker">${activity.focus}</span><h2>${activity.icon} ${activity.title}</h2><p>${activity.description}</p></div>`;
    const dialog = document.querySelector('.spld-p4-lab');
    dialog.innerHTML = `<button class="spld-p4-close" type="button" aria-label="關閉高小讀寫實驗室">×</button>${heading}${difficultyMarkup()}${progressMarkup()}<div class="spld-p4-play-area">${playArea}</div><div class="spld-p4-feedback" id="spldP4Feedback" role="status" aria-live="polite" aria-atomic="true">慢慢看一看；不知道時可以按提示。</div>${toolsMarkup()}`;
    bindRound(round);
  }

  function bindRound(round) {
    document.querySelector('.spld-p4-close')?.addEventListener('click', closeLab);
    document.querySelector('#spldP4Read')?.addEventListener('click', () => {
      const mode = activityMode();
      const readText = mode === 'morpheme' ? `${round.prompt}。核心語素是${round.core}，意思類別是${round.category}。` : mode === 'sentence' ? '句型重組積木。請把主語、謂語和賓語按正確次序排好。' : mode === 'collocation' ? `詞語配對連連看。請為「${round.verb}」選出最合適的詞語。` : mode === 'context' ? `${currentActivity().title}。${round.sentence}` : mode === 'memory' ? `同反義詞翻牌。請找出兩組意思${round.relation === '同義詞' ? '相近' : '相反'}的詞語。` : `量詞填空大闖關。一＿＿${round.noun}，請選出最合適的量詞。`;
      speak(readText);
    });
    document.querySelector('#spldP4Hint')?.addEventListener('click', () => {
      result.hints += 1;
      feedback(`💡 ${round.hint}`, 'hint');
      speak(round.hint);
    });
    document.querySelector('#spldP4Back')?.addEventListener('click', openMenu);
    document.querySelectorAll('[data-p4-difficulty]').forEach((button) => button.addEventListener('click', () => {
      const nextDifficulty = button.dataset.p4Difficulty;
      if (!difficultySettings[nextDifficulty] || nextDifficulty === selectedDifficulty) return;
      selectedDifficulty = nextDifficulty;
      roundIndex = 0;
      selectedBlocks = [];
      result = { correct: 0, retries: 0, hints: 0 };
      completed = false;
      prepareRoundState();
      renderRound();
      feedback(`已切換至${difficultySettings[nextDifficulty].label}：${difficultySettings[nextDifficulty].note}`, 'hint');
      speak(`已切換至${difficultySettings[nextDifficulty].label}練習。`);
    }));
    if (activityMode() === 'morpheme') {
      document.querySelectorAll('.spld-p4-choice').forEach((button) => button.addEventListener('click', () => chooseMorpheme(button, round)));
      bindChoiceDock((button) => chooseMorpheme(button, round));
    } else if (activityMode() === 'sentence') {
      document.querySelectorAll('.spld-p4-block').forEach((button) => button.addEventListener('click', () => {
        if (suppressTouchSentenceClick) return;
        chooseSentenceBlock(button.dataset.block, round);
      }));
      document.querySelectorAll('.spld-p4-block').forEach((button) => button.addEventListener('dragstart', (event) => {
        draggedSentenceBlock = button.dataset.block || '';
        event.dataTransfer?.setData('text/plain', button.dataset.block || '');
        event.dataTransfer.effectAllowed = 'move';
      }));
      document.querySelectorAll('.spld-p4-block').forEach((button) => button.addEventListener('dragend', () => { draggedSentenceBlock = ''; }));
      document.querySelectorAll('.spld-p4-block').forEach((button) => bindTouchSentenceDrag(button, round));
      document.querySelectorAll('[data-sentence-slot]').forEach((slot) => {
        slot.addEventListener('dragover', (event) => { event.preventDefault(); slot.classList.add('drag-over'); });
        slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
        slot.addEventListener('drop', (event) => {
          event.preventDefault();
          slot.classList.remove('drag-over');
          const block = event.dataTransfer?.getData('text/plain') || draggedSentenceBlock;
          if (block) placeSentenceBlock(block, Number(slot.dataset.sentenceSlot), round);
          draggedSentenceBlock = '';
        });
      });
    } else if (activityMode() === 'memory') {
      document.querySelectorAll('[data-memory-card]').forEach((button) => button.addEventListener('click', () => chooseMemoryCard(button.dataset.memoryCard, round)));
      document.querySelector('#spldP4MemoryStudy')?.addEventListener('click', () => {
        if (!memoryPreviewVisible) {
          memoryPreviewVisible = true;
          renderRound();
          feedback('已翻開全部詞語卡。可一起慢讀、指讀或請學生說一說。', 'hint');
          return;
        }
        memoryPhase = 'match';
        renderRound();
        feedback('卡片已遮起。現在每次翻兩張，慢慢找出一組。', 'hint');
      });
    } else {
      document.querySelectorAll('.spld-p4-choice').forEach((button) => button.addEventListener('click', () => chooseSimpleChoice(button, round)));
      bindChoiceDock((button) => chooseSimpleChoice(button, round));
    }
  }

  function bindChoiceDock(onDropChoice) {
    const dock = document.querySelector('[data-p4-choice-dock]');
    if (!dock) return;
    let draggedChoice = '';
    document.querySelectorAll('.spld-p4-choice').forEach((button) => {
      button.addEventListener('dragstart', (event) => {
        draggedChoice = button.dataset.choice || '';
        event.dataTransfer?.setData('text/plain', draggedChoice);
        event.dataTransfer.effectAllowed = 'move';
        button.classList.add('dragging');
      });
      button.addEventListener('dragend', () => {
        draggedChoice = '';
        button.classList.remove('dragging');
        dock.classList.remove('drag-over');
      });
    });
    dock.addEventListener('dragover', (event) => { event.preventDefault(); dock.classList.add('drag-over'); });
    dock.addEventListener('dragleave', () => dock.classList.remove('drag-over'));
    dock.addEventListener('drop', (event) => {
      event.preventDefault();
      const choice = event.dataTransfer?.getData('text/plain') || draggedChoice;
      const button = [...document.querySelectorAll('.spld-p4-choice')].find((item) => item.dataset.choice === choice);
      dock.classList.remove('drag-over');
      if (button) onDropChoice(button);
    });
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
    const nextSlot = answer.findIndex((_, index) => !selectedBlocks[index]);
    if (nextSlot < 0) return;
    placeSentenceBlock(block, nextSlot, round);
  }

  function placeSentenceBlock(block, slotIndex, round) {
    const answer = [round.subject, round.verb, round.object];
    const expected = answer[slotIndex];
    if (selectedBlocks[slotIndex]) return;
    if (block !== expected) {
      result.retries += 1;
      feedback(`這一格是「${['主語', '謂語', '賓語'][slotIndex]}」。慢慢重新選或拖到合適位置也可以。`, 'try');
      speak('先看這一格的句法提示，再慢慢重新排列。');
      return;
    }
    selectedBlocks[slotIndex] = block;
    if (selectedBlocks.filter(Boolean).length < answer.length) {
      renderRound();
      feedback(`✓ 放好了「${block}」。接著看下一格。`, 'success');
      return;
    }
    result.correct += 1;
    feedback(`✓ 句子完成：「${answer.join('')}」。`, 'success');
    speak(`答對了。${answer.join('')}。`);
    wait(nextRound);
  }

  function chooseSimpleChoice(button, round) {
    const choice = button.dataset.choice;
    if (choice === round.target) {
      result.correct += 1;
      button.classList.add('correct');
      const mode = activityMode();
      const successText = mode === 'collocation' ? `「${round.verb}${round.target}」是合適的詞語搭配。` : mode === 'context' ? `✓ 你找到了「${round.target}」這個合適重點。` : `「一${round.target}${round.noun}」讀起來正確。`;
      feedback(`✓ ${successText}`, 'success');
      speak(`答對了。${successText}`);
      wait(nextRound);
      return;
    }
    result.retries += 1;
    button.classList.add('wrong');
    const mode = activityMode();
    const retryText = mode === 'collocation' ? '先把動詞和每個選項慢慢讀一遍，找最自然的搭配。' : mode === 'context' ? '先看圖像和前後句的關鍵詞，再試一次。' : '先把量詞和名詞一起慢慢讀一遍，再試一次。';
    feedback(retryText, 'try');
    speak(retryText);
    wait(() => button.classList.remove('wrong'), 720);
  }

  function chooseMemoryCard(cardId, round) {
    if (flippedCards.includes(cardId) || flippedCards.length >= 2) return;
    flippedCards.push(cardId);
    renderRound();
    if (flippedCards.length < 2) return;
    wait(() => {
      const [firstId, secondId] = flippedCards;
      const first = memoryCards.find((card) => card.id === firstId);
      const second = memoryCards.find((card) => card.id === secondId);
      if (first?.pairId === second?.pairId) {
        matchedPairs.push(first.pairId);
        flippedCards = [];
        if (matchedPairs.length === round.pairs.length) {
          result.correct += 1;
          renderRound();
          feedback(`✓ 你找到了兩組${round.relation}。`, 'success');
          speak(`答對了。你找到了兩組${round.relation}。`);
          wait(nextRound);
        } else {
          renderRound();
          feedback(`✓ 找到一組${round.relation}，再找下一組。`, 'success');
          speak(`找到一組${round.relation}，再找下一組。`);
        }
        return;
      }
      result.retries += 1;
      flippedCards = [];
      renderRound();
      feedback(`這兩張不是${round.relation}；慢慢再找一組。`, 'try');
      speak(`這兩張不是${round.relation}，慢慢再找一組。`);
    }, 650);
  }

  function nextRound() {
    if (roundIndex < currentRounds().length - 1) {
      roundIndex += 1;
      prepareRoundState();
      renderRound();
      return;
    }
    finish();
  }

  function finish() {
    if (completed) return;
    completed = true;
    const activity = currentActivity();
    const rounds = currentRounds();
    const activityLabel = isGradedActivity() ? `${activity.title} · ${difficultySettings[selectedDifficulty].label}` : activity.title;
    document.dispatchEvent(new CustomEvent('spld-p4-lab-complete', { detail: { ...result, activity: activityLabel } }));
    const dialog = document.querySelector('.spld-p4-lab');
    dialog.innerHTML = `<button class="spld-p4-close" type="button" aria-label="關閉高小讀寫實驗室">×</button><div class="spld-p4-result"><span class="spld-p4-kicker">本次讀寫回顧</span><h2>完成 ${activityLabel}</h2><p>你已完成 ${rounds.length} 個小回合。可以休息、選另一項練習，或回到高小 SpLD 關卡。</p><div class="spld-p4-result-grid"><div><strong>${result.correct} / ${rounds.length}</strong><span>完成回合</span></div><div><strong>${result.retries}</strong><span>溫和重試</span></div><div><strong>${result.hints}</strong><span>使用提示</span></div></div><aside>這些數字只協助教師安排下一步，不作比較或評分。</aside><div class="spld-p4-result-actions"><button type="button" id="spldP4TryAgain">↺ 選另一項練習</button><button type="button" id="spldP4Exit">回到高小 SpLD 關卡</button></div></div>`;
    dialog.querySelector('.spld-p4-close')?.addEventListener('click', closeLab);
    dialog.querySelector('#spldP4TryAgain')?.addEventListener('click', openMenu);
    dialog.querySelector('#spldP4Exit')?.addEventListener('click', closeLab);
  }

  function startActivity(key) {
    if (!activities[key]) return;
    activeKey = key;
    selectedDifficulty = 'basic';
    roundIndex = 0;
    prepareRoundState();
    result = { correct: 0, retries: 0, hints: 0 };
    completed = false;
    renderRound();
  }

  function prepareRoundState() {
    selectedBlocks = [];
    draggedSentenceBlock = '';
    touchSentenceDrag = null;
    suppressTouchSentenceClick = false;
    blockOptions = activeKey === 'sentence' ? shuffle([currentRound().subject, currentRound().verb, currentRound().object]) : [];
    if (activeKey === 'memory') prepareMemoryCards(currentRound());
    else { flippedCards = []; matchedPairs = []; memoryCards = []; }
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
    const activityStyle = document.createElement('style');
    activityStyle.textContent = `.spld-p4-collocation-scene,.spld-p4-classifier-scene{display:flex;align-items:center;justify-content:center;gap:12px;padding:17px;border-radius:17px;background:#fff;color:#3a4e67}.spld-p4-collocation-scene span{padding:6px 9px;border-radius:99px;background:#fff1da;color:#9c6413;font-size:12px;font-weight:850}.spld-p4-collocation-scene strong{color:#b26c15;font-size:35px}.spld-p4-collocation-scene em{color:#e1a64b;font-size:28px;font-style:normal;font-weight:900}.spld-p4-collocation-scene b{font-size:35px}.spld-p4-context-scene{padding:18px;border-radius:17px;background:#fff;color:#2e4a69}.spld-p4-context-scene>span{display:block;font-size:44px;text-align:center}.spld-p4-context-scene p{margin:9px 0 0;font-size:20px;font-weight:850;line-height:1.65;text-align:center}.spld-p4-context-scene p strong{color:#bb7417;border-bottom:3px solid #e5b45c}.spld-p4-classifier-scene>span{font-size:45px}.spld-p4-classifier-scene strong{color:#9e7113;font-size:30px}.spld-p4-memory-guide{display:flex;align-items:center;justify-content:center;gap:12px;padding:13px 15px;border-radius:15px;background:#fff}.spld-p4-memory-guide span{color:#a44f78;font-size:12px;font-weight:850}.spld-p4-memory-guide strong{color:#9a4170;font-size:23px}.spld-p4-memory-guide small{color:#68788c}.spld-p4-memory-board{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.spld-p4-memory-card{min-height:94px;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:2px solid #e9bfd5;border-radius:16px;background:linear-gradient(145deg,#fff8fb,#f9e8f0);color:#a0527a;cursor:pointer}.spld-p4-memory-card span{font-size:25px;font-weight:900}.spld-p4-memory-card small{font-size:11px;font-weight:800}.spld-p4-memory-card.revealed{border-color:#c96996;background:#fff;color:#82385f}.spld-p4-memory-card.matched{border-color:#51a675;background:#effaf2;color:#28724b}@media(max-width:620px){.spld-p4-collocation-scene{gap:8px}.spld-p4-collocation-scene strong,.spld-p4-collocation-scene b{font-size:28px}.spld-p4-context-scene p{font-size:18px}.spld-p4-classifier-scene strong{font-size:25px}.spld-p4-memory-guide{align-items:flex-start;flex-direction:column;gap:4px}.spld-p4-memory-card{min-height:82px}.spld-p4-memory-card span{font-size:21px}}`;
    document.head.appendChild(activityStyle);
    const readabilityStyle = document.createElement('style');
    readabilityStyle.textContent = `.spld-p4-difficulty{margin:15px 0 12px;padding:14px 15px;border:1px solid #c9e5df;border-radius:16px;background:#f6fffd}.spld-p4-difficulty>div:first-child{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap}.spld-p4-difficulty>div:first-child span{color:#39776e;font-size:14px;font-weight:900}.spld-p4-difficulty>div:first-child strong{color:#23796d;font-size:20px}.spld-p4-difficulty>div:first-child small{color:#5b6f80;font-size:15px}.spld-p4-difficulty-buttons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:11px}.spld-p4-difficulty-buttons button{min-height:54px;padding:8px 10px;border:2px solid #b8dcd5;border-radius:13px;background:#fff;color:#2f746a;font-size:17px;font-weight:900;cursor:pointer}.spld-p4-difficulty-buttons button small{display:block;margin-top:2px;color:#607284;font-size:12px;font-weight:750}.spld-p4-difficulty-buttons button.active{border-color:#258f80;background:#def5ee;color:#176f63}.spld-p4-difficulty-buttons button.active small{color:#236e65}.spld-p4-difficulty>p{margin:10px 0 0;color:#496d69;font-size:15px;font-weight:750;line-height:1.62}.spld-p4-heading p{font-size:17px;line-height:1.72}.spld-p4-meaning{font-size:16px;line-height:1.68}.spld-p4-feedback{font-size:17px;line-height:1.68}.spld-p4-tools button,.spld-p4-result-actions button{min-height:50px;font-size:16px;line-height:1.35}.spld-p4-close{min-width:44px;min-height:44px}.spld-p4-choice:focus-visible,.spld-p4-block:focus-visible,.spld-p4-memory-card:focus-visible,.spld-p4-difficulty-buttons button:focus-visible{outline:4px solid #245ba7;outline-offset:3px}@media(max-width:620px){.spld-p4-lab{padding:26px 16px}.spld-p4-heading h2,.spld-p4-result h2{font-size:27px;line-height:1.32}.spld-p4-heading p{font-size:16px;line-height:1.72}.spld-p4-kicker{font-size:14px}.spld-p4-prompt{font-size:20px;line-height:1.6}.spld-p4-meaning,.spld-p4-feedback{font-size:16px;line-height:1.7}.spld-p4-choice{min-height:98px}.spld-p4-choice strong{font-size:24px}.spld-p4-slot{min-height:100px}.spld-p4-slot span{font-size:12px;line-height:1.45}.spld-p4-slot strong{font-size:17px}.spld-p4-sentence-preview{font-size:16px;line-height:1.58}.spld-p4-block{min-height:60px;padding:10px 15px;font-size:18px}.spld-p4-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.spld-p4-tools button{min-height:54px;font-size:16px}.spld-p4-tools button:last-child{grid-column:span 2}.spld-p4-difficulty{padding:13px}.spld-p4-difficulty>div:first-child small{font-size:14px}.spld-p4-difficulty>p{font-size:15px}.spld-p4-memory-card{min-height:92px}.spld-p4-memory-card span{font-size:23px}}@media(min-width:621px) and (max-width:820px){.spld-p4-lab{width:min(720px,calc(100% - 28px));padding:30px}.spld-p4-heading p{font-size:17px}.spld-p4-prompt{font-size:21px}.spld-p4-choice{min-height:108px}.spld-p4-tools button{min-height:52px}}`;
    document.head.appendChild(readabilityStyle);
    const interactionStyle = document.createElement('style');
    interactionStyle.textContent = `.spld-p4-play-area{padding:clamp(26px,4vw,38px)}.spld-p4-difficulty-buttons button:nth-child(3){grid-column:1/-1}.spld-p4-sentence-guide{margin-bottom:22px}.spld-p4-drag-note{margin:0 0 18px;color:#5e5a7e;font-size:15px;font-weight:750;line-height:1.55}.spld-p4-slots{gap:16px;margin:20px 0 16px}.spld-p4-slot{min-height:132px;transition:transform 180ms cubic-bezier(.23,1,.32,1),border-color 180ms cubic-bezier(.23,1,.32,1),background 180ms cubic-bezier(.23,1,.32,1),box-shadow 180ms cubic-bezier(.23,1,.32,1)}.spld-p4-slot.drag-over{transform:translateY(-2px);border-color:#604ec6;background:#eeebff;box-shadow:0 10px 22px rgba(94,78,198,.18)}.spld-p4-block-bank{gap:14px;padding-top:5px}.spld-p4-block{min-height:66px;padding:11px 19px;cursor:grab;transition:transform 160ms cubic-bezier(.23,1,.32,1),box-shadow 180ms cubic-bezier(.23,1,.32,1),background 180ms cubic-bezier(.23,1,.32,1)}.spld-p4-block:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 17px rgba(77,62,155,.16)}.spld-p4-block:active:not(:disabled){cursor:grabbing;transform:scale(.98)}.spld-p4-memory-board{gap:16px;margin-top:20px}.spld-p4-memory-card{min-height:112px;transition:transform 190ms cubic-bezier(.23,1,.32,1),border-color 190ms cubic-bezier(.23,1,.32,1),background 190ms cubic-bezier(.23,1,.32,1)}.spld-p4-memory-board.study .spld-p4-memory-card.revealed{animation:spld-p4-reveal 240ms cubic-bezier(.23,1,.32,1) both}.spld-p4-memory-card:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 9px 18px rgba(160,82,122,.13)}.spld-p4-memory-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:20px;padding:14px 16px;border-radius:16px;background:#fff7fb;color:#7e4662}.spld-p4-memory-actions button{min-height:52px;padding:10px 16px;border:1px solid #a6527a;border-radius:12px;background:#a6527a;color:#fff;font-size:16px;font-weight:850;cursor:pointer}.spld-p4-memory-actions span{font-size:14px;font-weight:750;line-height:1.55}.spld-p4-feedback.success{animation:spld-p4-feedback-in 240ms cubic-bezier(.23,1,.32,1)}@keyframes spld-p4-reveal{from{opacity:.35;transform:rotateY(65deg) scale(.97)}to{opacity:1;transform:rotateY(0) scale(1)}}@keyframes spld-p4-feedback-in{from{opacity:.35;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}@media(max-width:620px){.spld-p4-play-area{padding:24px 16px}.spld-p4-sentence-guide{margin-bottom:16px}.spld-p4-drag-note{font-size:14px}.spld-p4-slots{grid-template-columns:1fr;gap:11px}.spld-p4-slot{min-height:100px}.spld-p4-block-bank{display:grid;grid-template-columns:1fr;gap:10px}.spld-p4-block{width:100%;min-height:62px;font-size:18px}.spld-p4-memory-board{gap:12px}.spld-p4-memory-card{min-height:104px}.spld-p4-memory-actions{align-items:stretch;flex-direction:column}.spld-p4-memory-actions button{width:100%}}@media(prefers-reduced-motion:reduce){.spld-p4-slot,.spld-p4-block,.spld-p4-memory-card{transition:none}.spld-p4-memory-board.study .spld-p4-memory-card.revealed,.spld-p4-feedback.success{animation:none}}`;
    document.head.appendChild(interactionStyle);
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `.spld-p4-block{touch-action:none}.spld-p4-block.touch-ready{border-color:#8072d8;background:#f4f1ff;box-shadow:0 0 0 4px rgba(128,114,216,.13)}.spld-p4-block.touch-dragging{opacity:.82;transform:scale(.985);border-color:#5f4ec2;background:#eeebff;box-shadow:0 12px 24px rgba(80,63,166,.18)}.spld-p4-slot.touch-drag-over{transform:translateY(-2px);border-color:#5b49bc;background:#e8e4ff;box-shadow:0 0 0 4px rgba(91,73,188,.14)}@media(max-width:620px){.spld-p4-play-area:has(.spld-p4-slots){display:flex;flex-direction:column}.spld-p4-play-area:has(.spld-p4-slots) .spld-p4-block-bank{order:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:4px}.spld-p4-play-area:has(.spld-p4-slots) .spld-p4-slots{order:4;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:14px 0 10px}.spld-p4-play-area:has(.spld-p4-slots) .spld-p4-sentence-preview{order:5}.spld-p4-play-area:has(.spld-p4-slots) .spld-p4-block{min-height:68px;padding:8px 6px;font-size:16px;line-height:1.28;overflow-wrap:anywhere}.spld-p4-play-area:has(.spld-p4-slots) .spld-p4-slot{min-height:88px;padding:6px}.spld-p4-play-area:has(.spld-p4-slots) .spld-p4-slot span{font-size:11px}.spld-p4-play-area:has(.spld-p4-slots) .spld-p4-slot strong{font-size:16px;overflow-wrap:anywhere}}@media(prefers-reduced-motion:reduce){.spld-p4-block.touch-dragging,.spld-p4-slot.touch-drag-over{transform:none}}`;
    document.head.appendChild(touchStyle);
    const gameplayStyle = document.createElement('style');
    gameplayStyle.textContent = `.spld-p4-mission-board{display:grid;gap:12px;margin-top:14px}.spld-p4-choice-dock{display:grid;grid-template-columns:auto 1fr;column-gap:10px;align-items:center;min-height:92px;padding:14px 16px;border:3px dashed #38a492;border-radius:18px;background:linear-gradient(135deg,#e9fff8,#f5fffb);color:#176d62;transition:transform 180ms cubic-bezier(.23,1,.32,1),background 180ms cubic-bezier(.23,1,.32,1),box-shadow 180ms cubic-bezier(.23,1,.32,1)}.spld-p4-choice-dock>span{grid-row:span 2;font-size:36px}.spld-p4-choice-dock strong{font-size:18px}.spld-p4-choice-dock small{color:#47786f;font-size:14px;line-height:1.45}.spld-p4-choice-dock.drag-over{transform:translateY(-2px) scale(1.01);border-style:solid;background:#d7f8ec;box-shadow:0 10px 22px rgba(25,136,116,.18)}.spld-p4-mission-board>p{margin:0;color:#587184;font-size:14px;font-weight:750;line-height:1.5}.spld-p4-choice{cursor:grab;transition:transform 160ms cubic-bezier(.23,1,.32,1),box-shadow 180ms cubic-bezier(.23,1,.32,1),opacity 160ms}.spld-p4-choice:hover{transform:translateY(-3px);box-shadow:0 9px 18px rgba(39,106,98,.15)}.spld-p4-choice:active{cursor:grabbing;transform:scale(.98)}.spld-p4-choice.dragging{opacity:.56}@media(max-width:620px){.spld-p4-choice-dock{min-height:84px}.spld-p4-choice-dock>span{font-size:32px}.spld-p4-mission-board>p{font-size:13px}}@media(prefers-reduced-motion:reduce){.spld-p4-choice-dock,.spld-p4-choice{transition:none}}`;
    document.head.appendChild(gameplayStyle);
  }

  window.SPLD_P4_LAB = {
    activityCards(stage = 'upper') {
      if (stage !== 'upper') return [];
      return Object.entries(activities).map(([key, activity]) => ({
        id: `spld-p4-${key}`,
        p4ActivityKey: key,
        lab: 'p4',
        category: 'cognition',
        categoryName: '高小 · SpLD 多感官讀寫',
        tone: ({ morpheme: 'teal', sentence: 'purple', collocation: 'orange', context: 'blue', memory: 'pink', classifier: 'yellow' })[key] || 'purple',
        icon: activity.icon,
        title: activity.title,
        description: activity.description,
        tag: `P4–P6 · ${activity.focus}`,
        supports: ['1'],
        answerPositionStrategy: IRREGULAR_CHOICE_ACTIVITIES.has(key) ? 'irregular-balanced' : null,
        answerPositionPattern: IRREGULAR_CHOICE_ACTIVITIES.has(key) ? answerPositionPattern(activity.rounds.length, key) : null,
        rounds: activity.rounds
      }));
    },
    openActivity,
    openMenu
  };

  injectStyles();
})();
