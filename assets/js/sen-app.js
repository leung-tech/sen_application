    (() => {
      const $ = (selector, parent = document) => parent.querySelector(selector);
      const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
      const toast = $('#toast');
      let toastTimer;
      const showToast = (message) => { clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('show'); toastTimer = setTimeout(() => toast.classList.remove('show'), 2500); };
      const dateFormatter = new Intl.DateTimeFormat('zh-HK', { weekday: 'long', month: 'long', day: 'numeric' });
      $('#dateText').textContent = dateFormatter.format(new Date());

      const gameLibrary = [
        { id: 'emotion', category: 'emotion', categoryName: '情緒社交', tone: 'pink', icon: '😊', title: '心情在哪裡？', description: '找出一樣的表情', tag: '情緒辨識', supports: ['2', '3', '8', '9'], rounds: [
          { target: '😊', word: '開心', choices: [['😊', '開心'], ['😟', '擔心'], ['😡', '生氣']], answer: '開心' },
          { target: '😟', word: '擔心', choices: [['😟', '擔心'], ['😊', '開心'], ['😣', '不舒服']], answer: '擔心' },
          { target: '😡', word: '生氣', choices: [['😣', '不舒服'], ['😡', '生氣'], ['🙂', '還可以']], answer: '生氣' }
        ] },
        { id: 'colour', category: 'cognition', categoryName: '認知學習', tone: 'blue', icon: '🎨', title: '顏色小幫手', description: '把物件放進同色盒', tag: '顏色分類', supports: ['2', '4', '8', '9'], rounds: [
          { item: '🍎', name: '蘋果', color: 'red', label: '紅色' }, { item: '🍌', name: '香蕉', color: 'yellow', label: '黃色' }, { item: '🫐', name: '藍莓', color: 'blue', label: '藍色' }
        ] },
        { id: 'routine', category: 'life', categoryName: '生活技能', tone: 'yellow', icon: '🚂', title: '早晨步驟小火車', description: '把生活步驟排好', tag: '程序排序', supports: ['2', '3', '4', '8', '9'], rounds: [
          { title: '準備上學', cards: [['🧼', '洗臉'], ['👕', '穿校服'], ['🎒', '背書包']] },
          { title: '洗手步驟', cards: [['💧', '弄濕雙手'], ['🫧', '搓洗雙手'], ['🧻', '抹乾雙手']] },
          { title: '吃點心', cards: [['🪑', '坐好'], ['🍎', '慢慢吃'], ['🧹', '收拾桌子']] }
        ] },
        { id: 'listen', category: 'cognition', categoryName: '認知學習', tone: 'purple', icon: '🔊', title: '聽一聽，指一指', description: '聽到詞語，找出圖片', tag: '聽覺理解', supports: ['1', '2', '8', '9'], rounds: [
          { word: '杯', choices: [['🥤', '杯'], ['👟', '鞋'], ['🚌', '巴士']] }, { word: '鞋', choices: [['🍽️', '碗'], ['👟', '鞋'], ['🐶', '小狗']] }, { word: '巴士', choices: [['🚌', '巴士'], ['🛏️', '床'], ['🍌', '香蕉']] }
        ] },
        { id: 'fruit', category: 'cognition', categoryName: '認知學習', tone: 'orange', icon: '🍎', title: '水果小店', description: '慢慢數，剛剛好', tag: '數量概念', supports: ['2', '3', '4', '9'], rounds: [{ count: 2 }, { count: 3 }, { count: 4 }] },
        { id: 'signal', category: 'life', categoryName: '生活技能', tone: 'red', icon: '🚦', title: '紅綠燈好選擇', description: '看看訊號，再作選擇', tag: '安全規則', supports: ['2', '3', '4', '8', '9'], rounds: [
          { light: 'red', prompt: '紅燈亮了，我們要怎樣做？', answer: '停一停' }, { light: 'green', prompt: '綠燈亮了，先看看路面安全後？', answer: '可以走' }, { light: 'red', prompt: '過馬路時看見紅燈？', answer: '停一停' }
        ] },
        { id: 'turn', category: 'emotion', categoryName: '情緒社交', tone: 'teal', icon: '🔄', title: '輪到誰？', description: '看看箭頭，練習輪候', tag: '回合概念', supports: ['2', '3', '4', '8', '9'], rounds: [
          { person: '小明', people: [['🧒', '小明'], ['👧', '小美'], ['🧑', '我']] }, { person: '小美', people: [['🧒', '小明'], ['👧', '小美'], ['🧑', '我']] }, { person: '我', people: [['🧒', '小明'], ['👧', '小美'], ['🧑', '我']] }
        ] },
        { id: 'memory', category: 'cognition', categoryName: '認知學習', tone: 'purple', icon: '🧠', title: '寶盒記憶卡', description: '翻開兩張一樣的卡', tag: '視覺專注', supports: ['2', '4', '9'], rounds: [
          { cards: ['🍎', '🍎', '🐶', '🐶'] }, { cards: ['🌞', '🌞', '🚗', '🚗'] }, { cards: ['👟', '👟', '🍌', '🍌'] }
        ] },
        { id: 'weather', category: 'life', categoryName: '生活技能', tone: 'blue', icon: '🌦️', title: '今天穿甚麼？', description: '看看天氣，選合適用品', tag: '日常決策', supports: ['2', '3', '8', '9'], rounds: [
          { weather: '🌧️', label: '下雨天', answer: '雨傘', choices: [['☂️', '雨傘'], ['🕶️', '太陽眼鏡'], ['🩴', '拖鞋']] }, { weather: '☀️', label: '大太陽', answer: '太陽帽', choices: [['🧣', '頸巾'], ['🧢', '太陽帽'], ['☂️', '雨傘']] }, { weather: '❄️', label: '很冷', answer: '外套', choices: [['🧥', '外套'], ['🩳', '短褲'], ['🍦', '雪糕']] }
        ] },
        { id: 'path', category: 'life', categoryName: '生活技能', tone: 'yellow', icon: '🏠', title: '安全回家小路', description: '跟著小路，平安回家', tag: '方向選擇', supports: ['2', '3', '4', '9'], rounds: [
          { route: ['直走', '右轉', '直走'] }, { route: ['右轉', '直走', '左轉'] }, { route: ['直走', '左轉', '直走'] }
        ] }
      ];
      const stageProfiles = {
        lower: { label: '初小 · P1–P3', guide: '目前是初小任務：以具體圖片、單一步驟與直接日常詞彙開始。' },
        upper: { label: '高小 · P4–P6', guide: '目前是高小任務：加入兩個線索、校園情境及先後次序判斷。' },
        junior: { label: '初中 · S1–S3', guide: '目前是初中任務：練習同儕互動、校園規範、時間管理與社區安全。' },
        senior: { label: '高中 · S4–S6', guide: '目前是高中任務：以獨立生活、職場準備、社區使用與安全決策為情境。' }
      };
      const stageTasks = {
        upper: {
          emotion: { description: '由表情與情境找出合適感受', rounds: [{ target: '🙂', word: '有點緊張', choices: [['🙂', '有點緊張'], ['😴', '很疲倦'], ['😡', '很生氣']], answer: '有點緊張' }, { target: '😔', word: '失望', choices: [['😔', '失望'], ['😊', '自豪'], ['😳', '尷尬']], answer: '失望' }, { target: '😌', word: '放鬆', choices: [['😌', '放鬆'], ['😟', '擔心'], ['😡', '生氣']], answer: '放鬆' }] },
          colour: { description: '按色標整理校園用品', rounds: [{ item: '📘', name: '藍色數學簿', color: 'blue', label: '藍色' }, { item: '🖍️', name: '紅色美術盒', color: 'red', label: '紅色' }, { item: '🧽', name: '黃色清潔布', color: 'yellow', label: '黃色' }] },
          routine: { description: '排好校園任務的先後次序', rounds: [{ title: '準備專題研習', cards: [['📋', '看清任務'], ['🔎', '準備資料'], ['📁', '放入文件夾']] }, { title: '交功課前', cards: [['📝', '檢查答案'], ['🏷️', '寫上名字'], ['📥', '放入交功課箱']] }, { title: '小組活動', cards: [['👂', '聽清規則'], ['🤝', '分配工作'], ['✅', '一起檢查']] }] },
          listen: { description: '聽兩個線索，找出關鍵用品', rounds: [{ word: '圖書證', listenText: '去圖書館，請帶圖書證。', choices: [['💳', '圖書證'], ['⚽', '足球'], ['🍴', '餐具']] }, { word: '水樽', listenText: '戶外活動前，請帶水樽。', choices: [['🧴', '水樽'], ['🎲', '骰子'], ['🧣', '頸巾']] }, { word: '功課冊', listenText: '交功課前，請拿出功課冊。', choices: [['📒', '功課冊'], ['🎧', '耳機'], ['🪥', '牙刷']] }] },
          fruit: { description: '核對清單並數出所需物品', rounds: [{ count: 5, itemEmoji: '🍎', itemLabel: '蘋果' }, { count: 7, itemEmoji: '🍎', itemLabel: '蘋果' }, { count: 10, itemEmoji: '🍎', itemLabel: '蘋果' }] },
          signal: { description: '判斷校園與過路安全規則', rounds: [{ light: 'red', prompt: '走廊有人正在跑，自己要先？', answer: '停一停' }, { light: 'green', prompt: '綠燈亮了，確認安全後？', answer: '可以走' }, { light: 'red', prompt: '看見校園維修告示，先？', answer: '停一停' }] },
          turn: { description: '按小組規則練習輪候發言', rounds: [{ person: '小明', people: [['🧒', '小明'], ['👧', '小美'], ['🧑', '我']] }, { person: '我', people: [['🧒', '小明'], ['👧', '小美'], ['🧑', '我']] }, { person: '小美', people: [['🧒', '小明'], ['👧', '小美'], ['🧑', '我']] }] },
          memory: { description: '配對校園用品與時間提示', rounds: [{ cards: ['📚', '📚', '⏰', '⏰'] }, { cards: ['🚌', '🚌', '💳', '💳'] }, { cards: ['📒', '📒', '🖊️', '🖊️'] }] },
          weather: { description: '按天氣與活動選合適用品', rounds: [{ weather: '🌦️', label: '郊遊日', answer: '水樽', choices: [['🧴', '水樽'], ['🧣', '頸巾'], ['🩴', '拖鞋']] }, { weather: '☀️', label: '戶外運動', answer: '太陽帽', choices: [['🧢', '太陽帽'], ['☂️', '雨傘'], ['🧤', '手套']] }, { weather: '🌧️', label: '下雨天上學', answer: '雨傘', choices: [['☂️', '雨傘'], ['🕶️', '太陽眼鏡'], ['🩳', '短褲']] }] },
          path: { description: '按校園地圖走到指定位置', rounds: [{ route: ['直走', '右轉', '直走'], prompt: '跟著校園地圖到圖書館。', goalEmoji: '📚' }, { route: ['右轉', '直走', '左轉'], prompt: '跟著校園地圖到集合點。', goalEmoji: '📍' }, { route: ['直走', '左轉', '直走'], prompt: '跟著校園地圖到洗手間。', goalEmoji: '🚻' }] }
        },
        junior: {
          emotion: { description: '由同儕情境選擇調節策略', rounds: [{ target: '😳', word: '尷尬', choices: [['😳', '尷尬'], ['😊', '自豪'], ['😴', '疲倦']], answer: '尷尬' }, { target: '😔', word: '失望', choices: [['😔', '失望'], ['😌', '放鬆'], ['😡', '生氣']], answer: '失望' }, { target: '😵', word: '壓力很大', choices: [['😵', '壓力很大'], ['😊', '開心'], ['😌', '平靜']], answer: '壓力很大' }] },
          colour: { description: '按限期色標整理功課與活動', rounds: [{ item: '📄', name: '明天交的功課', color: 'red', label: '紅色' }, { item: '📘', name: '本週閱讀記錄', color: 'blue', label: '藍色' }, { item: '📝', name: '下週測驗溫習單', color: 'yellow', label: '黃色' }] },
          routine: { description: '排好初中校園及小組任務', rounds: [{ title: '小組簡報', cards: [['👥', '確認分工'], ['🖥️', '準備投影片'], ['🗣️', '一起排練']] }, { title: '借圖書', cards: [['🔎', '找書籍'], ['💳', '出示圖書證'], ['📅', '記下歸還日']] }, { title: '課後活動', cards: [['📅', '看時間表'], ['🎒', '帶所需用品'], ['📍', '到集合地點']] }] },
          listen: { description: '聽校園或社區指示，找出重點', rounds: [{ word: '八達通', listenText: '乘車前，請準備八達通。', choices: [['💳', '八達通'], ['🧃', '果汁'], ['🧤', '手套']] }, { word: '集合點', listenText: '活動結束後，請到集合點等候。', choices: [['📍', '集合點'], ['🍜', '餐廳'], ['⚽', '球場']] }, { word: '身份證', listenText: '辦理服務時，請帶身份證明文件。', choices: [['🪪', '身份證'], ['🎮', '遊戲機'], ['📚', '故事書']] }] },
          fruit: { description: '依購物清單核對數量', rounds: [{ count: 4, itemEmoji: '🥤', itemLabel: '飲品' }, { count: 6, itemEmoji: '🥤', itemLabel: '飲品' }, { count: 8, itemEmoji: '🥤', itemLabel: '飲品' }] },
          signal: { description: '判斷校園、社區與網上安全選擇', rounds: [{ light: 'red', prompt: '收到不認識的人傳來的連結，先？', answer: '停一停' }, { light: 'green', prompt: '過路前確認兩邊沒有車後？', answer: '可以走' }, { light: 'red', prompt: '朋友叫你傳別人的私人照片，先？', answer: '停一停' }] },
          turn: { description: '在討論中辨認適當的發言回合', rounds: [{ person: '組長', people: [['🧑‍🏫', '組長'], ['🧑‍💻', '紀錄員'], ['🧑', '我']] }, { person: '我', people: [['🧑‍🏫', '組長'], ['🧑‍💻', '紀錄員'], ['🧑', '我']] }, { person: '紀錄員', people: [['🧑‍🏫', '組長'], ['🧑‍💻', '紀錄員'], ['🧑', '我']] }] },
          memory: { description: '配對日程、地點與所需用品', rounds: [{ cards: ['🚌', '🚌', '📍', '📍'] }, { cards: ['⏰', '⏰', '🪪', '🪪'] }, { cards: ['📚', '📚', '🎒', '🎒'] }] },
          weather: { description: '按活動與環境作日常決策', rounds: [{ weather: '🥾', label: '遠足日', answer: '行山鞋', choices: [['🥾', '行山鞋'], ['🩴', '拖鞋'], ['🧣', '頸巾']] }, { weather: '🏃', label: '體育課', answer: '運動鞋', choices: [['👟', '運動鞋'], ['🥿', '皮鞋'], ['☂️', '雨傘']] }, { weather: '🌧️', label: '社區外出', answer: '雨傘', choices: [['☂️', '雨傘'], ['🕶️', '太陽眼鏡'], ['🧢', '太陽帽']] }] },
          path: { description: '規劃前往社區設施的安全路線', rounds: [{ route: ['直走', '右轉', '直走'], prompt: '跟著社區地圖到服務中心。', goalEmoji: '🏢' }, { route: ['右轉', '直走', '左轉'], prompt: '跟著社區地圖到巴士站。', goalEmoji: '🚌' }, { route: ['直走', '左轉', '直走'], prompt: '跟著社區地圖到求助點。', goalEmoji: '🛟' }] }
        },
        senior: {
          emotion: { description: '辨認壓力訊號並選擇支援策略', rounds: [{ target: '😰', word: '焦慮', choices: [['😰', '焦慮'], ['😌', '放鬆'], ['😄', '興奮']], answer: '焦慮' }, { target: '😮‍💨', word: '很疲累', choices: [['😮‍💨', '很疲累'], ['😠', '生氣'], ['😊', '滿足']], answer: '很疲累' }, { target: '😞', word: '受挫', choices: [['😞', '受挫'], ['😎', '有信心'], ['😴', '想睡覺']], answer: '受挫' }] },
          colour: { description: '按優先次序整理工作與出門用品', rounds: [{ item: '📁', name: '紅色緊急文件夾', color: 'red', label: '紅色' }, { item: '💼', name: '藍色工作文件夾', color: 'blue', label: '藍色' }, { item: '🧾', name: '黃色待辦清單', color: 'yellow', label: '黃色' }] },
          routine: { description: '排好職場及獨立生活準備流程', rounds: [{ title: '上班前準備', cards: [['⏰', '看出門時間'], ['🎒', '帶齊用品'], ['🚌', '預留交通時間']] }, { title: '面試前', cards: [['👔', '準備衣著'], ['📄', '帶個人資料'], ['📍', '確認地點']] }, { title: '社區服務', cards: [['📋', '看工作安排'], ['🤝', '向同事問好'], ['✅', '完成後核對']] }] },
          listen: { description: '聽職場或社區服務指示，找出下一步', rounds: [{ word: '準時', listenText: '約見時間是九時，請準時到達。', choices: [['⏰', '準時'], ['🍱', '午餐'], ['🎧', '耳機']] }, { word: '身份證', listenText: '辦理登記時，請出示身份證。', choices: [['🪪', '身份證'], ['🎮', '遊戲機'], ['🍎', '水果']] }, { word: '工作證', listenText: '到服務地點後，請佩戴工作證。', choices: [['🪪', '工作證'], ['🧣', '頸巾'], ['📚', '故事書']] }] },
          fruit: { description: '依需要與數量完成簡單購物決定', rounds: [{ count: 3, itemEmoji: '🍎', itemLabel: '水果' }, { count: 5, itemEmoji: '🥛', itemLabel: '飲品' }, { count: 6, itemEmoji: '🥪', itemLabel: '三文治' }] },
          signal: { description: '判斷公共交通、網上與職場安全決策', rounds: [{ light: 'red', prompt: '收到要求立即付款的陌生訊息，先？', answer: '停一停' }, { light: 'green', prompt: '過馬路時綠燈亮且車已停下後？', answer: '可以走' }, { light: 'red', prompt: '工作時看見不熟悉的機器，先？', answer: '停一停' }] },
          turn: { description: '在會議或服務場合辨認合適回合', rounds: [{ person: '主管', people: [['🧑‍💼', '主管'], ['🧑‍🔧', '同事'], ['🧑', '我']] }, { person: '我', people: [['🧑‍💼', '主管'], ['🧑‍🔧', '同事'], ['🧑', '我']] }, { person: '同事', people: [['🧑‍💼', '主管'], ['🧑‍🔧', '同事'], ['🧑', '我']] }] },
          memory: { description: '配對職場任務、工具與安全步驟', rounds: [{ cards: ['💼', '💼', '🪪', '🪪'] }, { cards: ['🧤', '🧤', '🧹', '🧹'] }, { cards: ['🚌', '🚌', '⏰', '⏰'] }] },
          weather: { description: '按場合選擇合適服飾與物品', rounds: [{ weather: '💼', label: '面試日', answer: '整潔衣著', choices: [['👔', '整潔衣著'], ['🩴', '拖鞋'], ['🥽', '泳鏡']] }, { weather: '🏢', label: '實習上班', answer: '工作證', choices: [['🪪', '工作證'], ['🧸', '玩具'], ['🩳', '短褲']] }, { weather: '🌧️', label: '社區服務日', answer: '雨傘', choices: [['☂️', '雨傘'], ['🕶️', '太陽眼鏡'], ['🩴', '拖鞋']] }] },
          path: { description: '規劃到實習地點或轉乘站的路線', rounds: [{ route: ['直走', '右轉', '直走'], prompt: '跟著地圖到實習地點。', goalEmoji: '💼' }, { route: ['右轉', '直走', '左轉'], prompt: '跟著地圖到轉乘站。', goalEmoji: '🚏' }, { route: ['直走', '左轉', '直走'], prompt: '跟著地圖到社區服務中心。', goalEmoji: '🏢' }] }
        }
      };
      const spldTraining = { id: 'spld', category: 'cognition', categoryName: '初小 · SpLD 讀寫訓練', tone: 'purple', icon: '字', title: '初小讀寫基礎練習', description: '12 關語音、字形、詞語與短文理解基礎練習', tag: 'P1–P3 · 基礎 12 關', supports: ['1'], rounds: [
        { id: 'P1-SPLD-01', band: 'P1 · 語音覺識', prompt: '哪個字和「花」的第一個聲音一樣？', choices: ['火', '馬', '書'], answer: '火', instruction: '請聽一聽「花」，找出開頭聲音一樣的字。', clue: '慢慢讀：「花」是 faa；「火」是 fo。兩個字開頭都有 f 聲。', success: '答對了！你聽到相同的開頭聲音。' },
        { id: 'P1-SPLD-02', band: 'P1 · 部件辨識', prompt: '「晴」字的左邊是哪個部件？', context: '目標字：<strong>晴</strong>', choices: ['日', '月', '目'], answer: '日', instruction: '請看「晴」字，找出它左邊的部件。', clue: '把「晴」分開看：左邊像太陽，是「日」字旁。', success: '做得好！你找到「晴」的日字旁。' },
        { id: 'P1-SPLD-03', band: 'P1 · 易混字辨別', prompt: '「週＿＿」應該選哪個字？', context: '句子：星期六和星期日是<strong>週末</strong>。', choices: ['未', '末', '朱'], answer: '末', instruction: '請在「週＿＿」中選出正確的字。', clue: '比較「未」和「末」：末字的上面一橫較短，下面一橫較長。', success: '答對了！「週末」的末字寫得正確。' },
        { id: 'P2-SPLD-04', band: 'P2 · 組詞與語意', prompt: '我把課本放進書＿＿。', context: '想一想：課本通常放在哪裏？', choices: ['包', '店', '寫'], answer: '包', instruction: '請選出能令句子完整的字。', clue: '把「書」和選項讀出來；能放課本的是「書包」。', success: '很好！你用語意組成了正確詞語。' },
        { id: 'P2-SPLD-05', band: 'P2 · 句子填空', prompt: '把功課＿＿進書包。', context: '選一個最合適的字，令句子通順。', choices: ['放', '房', '方'], answer: '放', instruction: '請讀完整句子，再選出合適的字。', clue: '「放進」表示把物件放到一個地方；不是房間的「房」。', success: '答對了！你用句子的意思選對了字。' },
        { id: 'P2-SPLD-06', band: 'P2 · 詞序判斷', prompt: '哪一句的詞序正確？', context: '找出「誰／在哪裏／做甚麼」都完整的一句。', choices: ['爸爸在廚房煮飯。', '廚房爸爸煮飯在。', '煮飯爸爸在廚房。'], answer: '爸爸在廚房煮飯。', instruction: '請找出讀起來最通順的一句。', clue: '先找「誰」：爸爸；再找「在哪裏」：廚房；最後找「做甚麼」：煮飯。', success: '很好！你辨認到完整句子的詞序。' },
        { id: 'P3-SPLD-07', band: 'P3 · 字形核對', prompt: '「＿＿天」應該選哪個字？', context: '晴天有太陽；請選出正確的「晴」。', choices: ['晴', '情', '請'], answer: '晴', instruction: '請找出表示好天氣的「晴」字。', clue: '好天氣和太陽有關，所以「晴」有日字旁。', success: '答對了！你用部件線索找到了正確字形。' },
        { id: 'P3-SPLD-08', band: 'P3 · 短句理解', prompt: '小婷今天要去哪裏？', context: '小婷今天要去<strong>圖書館</strong>借書。她先帶圖書證。', choices: ['圖書館', '球場', '餐廳'], answer: '圖書館', instruction: '請讀短句，找出小婷要去的地方。', clue: '找「去」字後面的地方名稱：小婷要去圖書館。', success: '做得好！你從短句找到了重要資料。' },
        { id: 'P3-SPLD-09', band: 'P3 · 短文取訊', prompt: '阿樂還差多少張工作紙？', context: '班主任說：明天交<strong>兩張</strong>工作紙。阿樂已完成<strong>一張</strong>。', choices: ['一張', '兩張', '三張'], answer: '一張', instruction: '請讀兩句資料，計算阿樂還差多少張。', clue: '共有兩張，已完成一張；2 減 1 等於 1。', success: '答對了！你從短文找資料再作出判斷。' },
        { id: 'P3-SPLD-10', band: 'P3 · 兩步指令', prompt: '這個指令的第一步是甚麼？', context: '指令：<strong>先寫姓名，再交工作紙。</strong>', choices: ['寫姓名', '交工作紙', '收拾書包'], answer: '寫姓名', instruction: '請聽兩步指令，找出第一個行動。', clue: '留意「先」字後面的行動；先寫姓名，然後才交工作紙。', success: '太好了！你記住並找到了兩步指令的第一步。' },
        { id: 'P3-SPLD-11', band: 'P3 · 部件提示', prompt: '「請＿＿」應該選哪個字？', context: '老師說：<strong>請安靜排隊。</strong>', choices: ['請', '情', '晴'], answer: '請', instruction: '請選出表示有禮貌要求的「請」字。', clue: '有禮貌地請人做事用「請」；它有言字旁。', success: '答對了！你用部件和句子意思找對了字。' },
        { id: 'P3-SPLD-12', band: 'P3 · 重點詞卡', prompt: '小志要帶甚麼去上課？', context: '課堂提示卡：今天美術課，請<strong>帶顏色筆</strong>。', choices: ['顏色筆', '雨傘', '足球'], answer: '顏色筆', instruction: '請讀提示卡，找出要帶的物品。', clue: '先找「帶」字，再圈出它後面的物品名稱。', success: '很好！你從提示卡找到重要物品。' }
      ] };
      const pathwayTraining = [
        { id: 'pathway-spld', type: '1', category: 'cognition', categoryName: '1 SpLD · 讀寫策略', tone: 'purple', icon: '字', title: '讀寫策略快練', description: '用字形、詞義和重點資料解題', tag: '讀寫策略', supports: ['1'], rounds: [
          { prompt: '「晴天」的「晴」字，左邊是哪個部件？', context: '把「晴」字分開看一看。', choices: [['☀️', '日'], ['🌙', '月'], ['👁️', '目']], answer: '日', instruction: '請找出晴字左邊的部件。', clue: '晴天和太陽有關；左邊是日字旁。', success: '答對了！你用部件找到正確字形。' },
          { prompt: '小明把課本放進書＿＿。', context: '想一想：課本通常放在哪裏？', choices: [['🎒', '包'], ['🏪', '店'], ['✍️', '寫']], answer: '包', instruction: '請選出可以組成正確詞語的字。', clue: '把「書」和每個選項慢慢讀一次。', success: '很好！「書包」是一個完整詞語。' },
          { prompt: '短句說小婷要去哪裏？', context: '小婷帶圖書證去<strong>圖書館</strong>借書。', choices: [['📚', '圖書館'], ['⚽', '球場'], ['🍜', '餐廳']], answer: '圖書館', instruction: '請從短句找出小婷要去的地方。', clue: '找一找「去」字後面的地方。', success: '做得好！你找到了重要資料。' }
        ] },
        { id: 'pathway-id', type: '2', category: 'life', categoryName: '2 ID · 生活選擇', tone: 'blue', icon: '🧺', title: '生活選擇小幫手', description: '看情境，選出下一個實用行動', tag: '生活技能', supports: ['2'], rounds: [
          { prompt: '要去小息了，先帶甚麼？', context: '你想去操場玩一會兒。', choices: [['🧴', '水樽'], ['🛏️', '枕頭'], ['🍳', '平底鑊']], answer: '水樽', instruction: '請選出小息去操場時有用的物品。', clue: '想一想：玩完後口渴時需要甚麼？', success: '對了！水樽可以在小息時使用。' },
          { prompt: '洗手後，下一步是甚麼？', context: '雙手已經搓洗乾淨。', choices: [['🧻', '抹乾雙手'], ['🧤', '戴手套'], ['📚', '看故事書']], answer: '抹乾雙手', instruction: '請選出洗手後的下一步。', clue: '手濕濕時，需要先把手弄乾。', success: '做得好！你記得洗手流程。' },
          { prompt: '想喝水時，怎樣做最合適？', context: '水樽放在桌子旁邊。', choices: [['🙋', '拿起水樽慢慢喝'], ['🏃', '跑到走廊'], ['📣', '大聲叫喊']], answer: '拿起水樽慢慢喝', instruction: '請選出想喝水時的合適做法。', clue: '先找一個安全而直接的行動。', success: '很好！這是一個安全的生活選擇。' }
        ] },
        { id: 'pathway-asd', type: '3', category: 'emotion', categoryName: '3 ASD · 社交練習', tone: 'teal', icon: '💬', title: '社交情境偵探', description: '在情境中選擇清楚而合適的回應', tag: '社交策略', supports: ['3'], rounds: [
          { prompt: '想加入同學的遊戲，可以怎樣說？', context: '兩位同學正在玩積木。', choices: [['🗣️', '我可以一起玩嗎？'], ['🧱', '直接拿走積木'], ['📢', '你們一定要讓我玩']], answer: '我可以一起玩嗎？', instruction: '請選出想加入遊戲時可以說的句子。', clue: '先用一句清楚又有禮貌的問句。', success: '答對了！這是一句清楚的加入邀請。' },
          { prompt: '輪到同學說話時，我可以怎樣做？', context: '小組分享時，小美正在說她的想法。', choices: [['👂', '看著她和安靜聽'], ['🗣️', '立刻大聲說自己的想法'], ['🚶', '把她拉走']], answer: '看著她和安靜聽', instruction: '請選出同學發言時的合適做法。', clue: '輪候時，可以先聽一聽和等一等。', success: '做得好！你知道怎樣尊重別人的回合。' },
          { prompt: '覺得太吵時，可以怎樣說？', context: '課室聲音變大，你的耳朵有點不舒服。', choices: [['🗣️', '我想去安靜角休息一下'], ['📣', '所有人立刻閉嘴'], ['🪑', '推開椅子']], answer: '我想去安靜角休息一下', instruction: '請選出感到太吵時可使用的句子。', clue: '說出自己的需要，再請大人協助。', success: '很好！你清楚說出了自己的需要。' }
        ] },
        { id: 'pathway-adhd', type: '4', category: 'cognition', categoryName: '4 ADHD · 專注策略', tone: 'yellow', icon: '🎯', title: '專注三步任務', description: '把注意力放回眼前的一小步', tag: '專注策略', supports: ['4'], rounds: [
          { prompt: '剛打開功課冊，第一步是甚麼？', context: '桌上已有鉛筆和功課冊。', choices: [['✍️', '先寫上姓名'], ['🎮', '先玩遊戲'], ['🚪', '先離開座位']], answer: '先寫上姓名', instruction: '請選出開始功課時最小的一步。', clue: '先做一個只需幾秒就能完成的動作。', success: '答對了！先開始一小步，就更容易繼續。' },
          { prompt: '做到一半分心了，可以怎樣做？', context: '你看到窗外有人走過。', choices: [['👀', '看回題目並完成下一題'], ['🏃', '馬上追出去'], ['📱', '拿出電話']], answer: '看回題目並完成下一題', instruction: '請選出分心後回到任務的方法。', clue: '不用一次完成全部；先回到下一題。', success: '很好！你把注意力帶回眼前一步。' },
          { prompt: '完成一題後，下一步是甚麼？', context: '你已經答完第一題。', choices: [['✅', '核對後做下一題'], ['🧻', '把功課撕掉'], ['🗣️', '不停叫同學']], answer: '核對後做下一題', instruction: '請選出完成一題後的合適做法。', clue: '短暫核對，然後直接開始下一步。', success: '做得好！你有清楚的完成節奏。' }
        ] },
        { id: 'pathway-gifted', type: 'G', category: 'cognition', categoryName: 'G Giftedness · 邏輯解難', tone: 'purple', icon: '🧩', title: '高階解難實驗室', description: '10 關規律、條件、證據和策略解難挑戰', tag: '邏輯解難', supports: ['G'], rounds: [
          { prompt: '找出下一個數字：2、6、12、20、？', context: '每一步增加的數量比前一步多 2。', choices: [['🔢', '30'], ['🔢', '28'], ['🔢', '32']], answer: '30', instruction: '請找出數字規律的下一項。', clue: '先看增加了多少：+4、+6、+8。', success: '答對了！你找到了遞增規律。', strategy: '先找變化規律，再檢查答案。' },
          { prompt: '哪一項不符合共同規則？', context: '12、18、24 都可以被 6 整除。', choices: [['🧮', '30'], ['🧮', '27'], ['🧮', '36']], answer: '27', instruction: '請找出不符合規則的項目。', clue: '先找共同規則，再檢查每一項。', success: '很好！你找出了例外。', strategy: '先說出共同特徵，再找不符合的一項。' },
          { prompt: '哪一項證據最支持植物需要光？', context: '同種植物有相同泥土和水量，只有光照不同。', choices: [['🌱', '光照長的植物最高'], ['🌧️', '昨天剛下雨'], ['🎨', '花盆顏色不同']], answer: '光照長的植物最高', instruction: '請選出最直接的證據。', clue: '找出唯一改變的條件和結果。', success: '做得好！你選了直接證據。', strategy: '比較唯一改變的條件和結果。' }
        ] },
        { id: 'pathway-hi', type: 'H', category: 'emotion', categoryName: 'H HI · 視覺化溝通', tone: 'teal', icon: '👁️', title: '視覺溝通小站', description: '10 關視覺線索、需要圖卡與表情識別訓練', tag: '視覺溝通', supports: ['H'], rounds: [
          { prompt: '時間表顯示書本後是鉛筆，下一步是甚麼？', context: '📚 閱讀 → ✏️ 寫字 → 🧺 收拾。', choices: [['✏️', '準備寫字'], ['🏀', '到操場'], ['🛏️', '睡覺']], answer: '準備寫字', instruction: '請從圖示找出下一步。', clue: '看目前圖示右邊的下一張圖。', success: '答對了！你從視覺時間表找到下一步。', strategy: '先看圖示順序，再選下一步。' },
          { prompt: '眉毛和嘴角向下，最可能感到甚麼？', context: '看眼睛、眉毛和嘴巴的線索。', choices: [['😟', '擔心'], ['😄', '開心'], ['😴', '很睏']], answer: '擔心', instruction: '請選出相符的感受。', clue: '擔心時，眉毛和嘴角常向下。', success: '很好！你看到了表情線索。', strategy: '看眉毛和嘴巴，再為表情找感受名字。' },
          { prompt: '想請老師把指示寫下來，應選哪張卡？', context: '你需要用文字再確認剛才的資訊。', choices: [['📝', '請你寫下來'], ['🥤', '我想喝水'], ['🏃', '我想跑步']], answer: '請你寫下來', instruction: '請選出溝通需要卡。', clue: '找有紙筆圖示的卡。', success: '做得好！你清楚表達了需要。', strategy: '選最能表達自己需要的圖卡或短句。' }
        ] },
        { id: 'pathway-ebd', type: 'E', category: 'emotion', categoryName: 'E EBD · 情緒與調節', tone: 'pink', icon: '🌡️', title: '情緒調節闖關', description: '辨認情緒訊號，選擇安全而可實行的調節下一步', tag: '情緒調節', supports: ['E'], rounds: [
          { prompt: '感到很生氣，第一步可以怎樣做？', context: '先讓身體停一停，再決定下一步。', choices: [['✋', '停一停，慢慢呼吸'], ['📣', '立刻大叫'], ['🏃', '在課室快跑']], answer: '停一停，慢慢呼吸', instruction: '請選出情緒變大時安全的第一步。', clue: '先讓身體停下來，才有空間選擇下一步。', success: '答對了！你先選了安全的停一停。' },
          { prompt: '覺得太滿時，可以怎樣向大人說？', context: '使用一個短而清楚的調節句子。', choices: [['🗣️', '我需要安靜一分鐘。'], ['📣', '你們全部停下'], ['🚪', '我不說話就跑走']], answer: '我需要安靜一分鐘。', instruction: '請選出需要調節時的清楚說法。', clue: '說清楚自己需要甚麼和多久，大人較容易幫忙。', success: '很好！你清楚表達了調節需要。' },
          { prompt: '調節後，怎樣回到事情？', context: '你已經呼吸幾次，準備再開始。', choices: [['✅', '先做眼前最小的一步'], ['📱', '不停看電話'], ['📣', '責怪所有人']], answer: '先做眼前最小的一步', instruction: '請選出調節後重新開始的方法。', clue: '不必一次完成全部；先做一件小事。', success: '做得好！你選擇用小步重新開始。' }
        ] },
        { id: 'pathway-sli', type: '8', category: 'cognition', categoryName: '8 SLI · 理解與表達', tone: 'pink', icon: '👂', title: '關鍵詞小耳朵', description: '聽清關鍵詞，再選出重要資料', tag: '理解指令', supports: ['8'], rounds: [
          { prompt: '老師說：「請拿水樽。」要找哪一樣？', context: '慢慢聽一次，找出「水樽」這個關鍵詞。', choices: [['🧴', '水樽'], ['📚', '圖書'], ['👟', '鞋']], answer: '水樽', instruction: '請找出老師說的物品。', clue: '再聽一聽句子中最後的物品名稱。', success: '答對了！你聽到了關鍵詞。' },
          { prompt: '「先寫姓名，再交工作紙」的第一步是甚麼？', context: '句子有兩個行動，要先找「先」字後面的內容。', choices: [['✍️', '寫姓名'], ['📥', '交工作紙'], ['🎒', '收拾書包']], answer: '寫姓名', instruction: '請選出兩步指令中的第一步。', clue: '留意「先」這個提示字。', success: '很好！你找到了第一個行動。' },
          { prompt: '想請同學再說一次，可以怎樣說？', context: '你剛才聽不清楚同學的說話。', choices: [['🗣️', '請你慢慢再說一次'], ['🙈', '我完全不理你'], ['📣', '你說得太差']], answer: '請你慢慢再說一次', instruction: '請選出聽不清楚時的清楚說法。', clue: '可以直接而有禮貌地說出自己的需要。', success: '做得好！你知道怎樣請人重複說話。' }
        ] },
        { id: 'pathway-mi', type: '9', category: 'life', categoryName: '9 MI · 溝通與選擇', tone: 'purple', icon: '🗂️', title: '我的選擇卡', description: '用清楚選擇卡表達需要與求助', tag: '功能性溝通', supports: ['9'], rounds: [
          { prompt: '你想喝水，可以選哪張卡？', context: '看一看圖像，選出最能表達需要的句子。', choices: [['🥤', '我想喝水'], ['🧸', '我想玩玩具'], ['🧥', '我想穿外套']], answer: '我想喝水', instruction: '請選出想喝水時可以使用的選擇卡。', clue: '找有水杯圖案和「喝水」意思的卡。', success: '答對了！你清楚表達了需要。' },
          { prompt: '你要去洗手間，可以怎樣表達？', context: '先讓大人知道你的需要。', choices: [['🚻', '我想去洗手間'], ['🍎', '我想吃水果'], ['🎵', '我想聽音樂']], answer: '我想去洗手間', instruction: '請選出去洗手間時可使用的選擇卡。', clue: '找和洗手間圖案相同的意思。', success: '很好！這是一張有用的求助卡。' },
          { prompt: '你覺得不舒服，可以選哪張卡？', context: '用一句短句讓大人知道要先停一停。', choices: [['🛟', '我需要幫忙'], ['🏃', '我想快跑'], ['🎲', '我想玩遊戲']], answer: '我需要幫忙', instruction: '請選出不舒服時可以使用的選擇卡。', clue: '找一張可以讓大人來協助你的卡。', success: '做得好！你選了清楚的求助方式。' }
        ] }
      ];
      const pathwayStageTasks = {
        upper: {
          'pathway-spld': { description: '在校園資料中找出重點與合適詞語', rounds: [{ prompt: '公告寫「星期五前交工作紙」，哪個是重要日期？', context: '班主任提示：<strong>星期五前</strong>交工作紙。', choices: [['📅', '星期五'], ['🚌', '巴士站'], ['🍽️', '午飯時間']], answer: '星期五', instruction: '請從公告找出交工作紙的日期。', clue: '找一找「前」字前面的日期。', success: '答對了！你找到了公告重點。' }, { prompt: '「預備」的意思最接近哪一項？', context: '明天有活動，老師說：「請預備水樽。」', choices: [['🎒', '先準備好'], ['🧹', '立刻清潔'], ['😴', '馬上睡覺']], answer: '先準備好', instruction: '請選出預備的意思。', clue: '想一想活動未開始前要做甚麼。', success: '很好！你用句子理解詞義。' }, { prompt: '哪一句最適合寫在功課簿上？', context: '你已完成數學功課，要寫下明天需要帶的物品。', choices: [['📝', '明天帶數學簿。'], ['🍎', '數學簿吃蘋果。'], ['🚌', '明天數學坐巴士。']], answer: '明天帶數學簿。', instruction: '請選出意思完整而合適的句子。', clue: '看看句子是否和功課簿有關。', success: '做得好！你選出了清楚的功能句。' }] },
          'pathway-id': { description: '在校園生活中選出固定而實用的下一步', rounds: [{ prompt: '到圖書館借書，先要做甚麼？', context: '你已找到了想借的故事書。', choices: [['💳', '出示圖書證'], ['⚽', '到球場踢球'], ['🛏️', '躺在地上']], answer: '出示圖書證', instruction: '請選出借書時的下一步。', clue: '想一想借書時需要讓職員知道你是誰。', success: '答對了！圖書證可以幫你完成借書。' }, { prompt: '小組活動開始前，先做甚麼？', context: '老師已分好小組。', choices: [['👂', '聽清楚規則'], ['🚪', '自己離開'], ['📢', '大聲打斷別人']], answer: '聽清楚規則', instruction: '請選出小組活動開始時的第一步。', clue: '開始前先知道要怎樣做。', success: '很好！先聽規則會更容易完成活動。' }, { prompt: '下雨天放學，應帶甚麼？', context: '天氣報告說下午會下雨。', choices: [['☂️', '雨傘'], ['🕶️', '太陽眼鏡'], ['🩴', '拖鞋']], answer: '雨傘', instruction: '請選出下雨天合適的用品。', clue: '想一想下雨時怎樣保持身體乾爽。', success: '做得好！這是實用的生活準備。' }] },
          'pathway-asd': { description: '練習校園小組中的邀請、輪候與修復語句', rounds: [{ prompt: '想在小組中發言，可以怎樣開始？', context: '組長問：「還有人想補充嗎？」', choices: [['🙋', '我想補充一點。'], ['📣', '我要馬上說完全部。'], ['🚶', '我先離開。']], answer: '我想補充一點。', instruction: '請選出想發言時的清楚句子。', clue: '可以先讓大家知道你想說話。', success: '答對了！這是一句合適的發言開始。' }, { prompt: '不小心碰到同學，可以怎樣說？', context: '走廊轉角時，你碰到小明。', choices: [['🙏', '對不起，你還好嗎？'], ['😐', '完全不說話'], ['📣', '是你自己的問題']], answer: '對不起，你還好嗎？', instruction: '請選出不小心碰到同學時的回應。', clue: '先道歉，再關心對方。', success: '很好！你用了修復關係的語句。' }, { prompt: '同學不同意你的想法，可以怎樣做？', context: '小組正在決定海報顏色。', choices: [['🤝', '我聽聽你的想法。'], ['🗑️', '把他的海報丟掉'], ['📣', '你不可以不同意']], answer: '我聽聽你的想法。', instruction: '請選出意見不同時的合適回應。', clue: '可以先聽對方，再一起選擇。', success: '做得好！你為合作留出了空間。' }] },
          'pathway-adhd': { description: '用短清單啟動、回看及完成校園任務', rounds: [{ prompt: '準備交功課時，先要核對甚麼？', context: '你已完成工作紙，桌上有功課冊。', choices: [['🔎', '姓名和題目'], ['🎮', '下一個遊戲'], ['🍪', '零食包裝']], answer: '姓名和題目', instruction: '請選出交功課前要核對的項目。', clue: '先看最容易遺漏的兩個資料。', success: '答對了！短核對能幫你完成任務。' }, { prompt: '要溫習十分鐘，怎樣開始？', context: '你有課本、計時器和鉛筆。', choices: [['⏲️', '開計時器並讀第一頁'], ['📱', '一直看短片'], ['🚶', '在走廊走來走去']], answer: '開計時器並讀第一頁', instruction: '請選出開始短時段溫習的方法。', clue: '把目標變得短而清楚。', success: '很好！短時段能讓開始更容易。' }, { prompt: '完成一項清單後，下一步是甚麼？', context: '你已把功課放進文件夾。', choices: [['✅', '在清單打勾再看下一項'], ['🗑️', '丟掉清單'], ['📣', '大聲叫喊']], answer: '在清單打勾再看下一項', instruction: '請選出完成後保持節奏的方法。', clue: '用可見的記號告訴自己已完成。', success: '做得好！你用清單保持下一步。' }] },
          'pathway-sli': { description: '在校園指令中找人、物品與先後步驟', rounds: [{ prompt: '老師說：「交功課前，先寫姓名。」先做甚麼？', context: '聽清楚「先」字後面的行動。', choices: [['✍️', '寫姓名'], ['📥', '交功課'], ['🧹', '掃地']], answer: '寫姓名', instruction: '請選出第一個行動。', clue: '先找「先」字，再找它後面的動作。', success: '答對了！你聽到了先後次序。' }, { prompt: '「請把圖書放回書架」要處理甚麼？', context: '句子中的關鍵物品是「圖書」。', choices: [['📚', '圖書'], ['⚽', '足球'], ['🧥', '外套']], answer: '圖書', instruction: '請找出指令中的物品。', clue: '慢慢聽一聽要放回去的是甚麼。', success: '很好！你找到了關鍵物品。' }, { prompt: '要確認自己聽懂了，可以怎樣說？', context: '老師剛剛解釋了活動安排。', choices: [['🗣️', '我明白，現在先做第一步。'], ['🙈', '我甚麼也不說'], ['📣', '不要再解釋']], answer: '我明白，現在先做第一步。', instruction: '請選出確認自己聽懂的說法。', clue: '可以說出自己理解到的下一步。', success: '做得好！你用說話確認了理解。' }] },
          'pathway-mi': { description: '以選擇卡表達校園需要與安排', rounds: [{ prompt: '到操場活動前，你需要哪張卡？', context: '天氣較熱，活動會在戶外進行。', choices: [['🧴', '我需要水樽'], ['🛏️', '我需要枕頭'], ['🧣', '我需要頸巾']], answer: '我需要水樽', instruction: '請選出戶外活動前的需要。', clue: '想一想天熱時要補充甚麼。', success: '答對了！你選出了實用的需要。' }, { prompt: '想請同學幫忙拿物品，可以選哪張卡？', context: '你手上已拿著幾本大書。', choices: [['🤝', '請幫我拿一拿'], ['🏃', '請你快點離開'], ['📣', '我不要任何人']], answer: '請幫我拿一拿', instruction: '請選出請人協助的短句。', clue: '找一張有「幫」字的卡。', success: '很好！你清楚表達了求助。' }, { prompt: '活動結束後，你想表達甚麼？', context: '你已完成小組任務。', choices: [['✅', '我完成了'], ['🚻', '我想去洗手間'], ['🥤', '我想喝水']], answer: '我完成了', instruction: '請選出完成活動時可以使用的選擇卡。', clue: '找有完成記號的卡。', success: '做得好！你讓別人知道了進度。' }] }
        },
        junior: {
          'pathway-spld': { description: '從校園與社區文字中篩選需要的資料', rounds: [{ prompt: '廣播說「集合時間是三時十五分」，甚麼時候集合？', context: '活動廣播：請同學在<strong>三時十五分</strong>到禮堂集合。', choices: [['⏰', '三時十五分'], ['📅', '星期一'], ['🍽️', '午飯後']], answer: '三時十五分', instruction: '請找出集合時間。', clue: '找時間數字旁邊的「集合」資料。', success: '答對了！你從廣播找到了時間。' }, { prompt: '「請保存車票」最可能是為了甚麼？', context: '乘車後，職員提醒你把車票放好。', choices: [['🎫', '之後核對或出示'], ['🗑️', '立刻丟掉'], ['🍎', '用來買水果']], answer: '之後核對或出示', instruction: '請選出保存車票的合理原因。', clue: '想一想車票在旅程中有甚麼用途。', success: '很好！你由語句推斷到用途。' }, { prompt: '哪一句最適合回覆小組訊息？', context: '組長問：明天誰可以帶剪刀？', choices: [['✂️', '我可以帶剪刀。'], ['🌧️', '剪刀正在下雨。'], ['🚌', '明天剪刀坐巴士。']], answer: '我可以帶剪刀。', instruction: '請選出清楚而相關的回覆。', clue: '看看哪一句有回應「誰可以帶」這個問題。', success: '做得好！你選出了有用的回覆。' }] },
          'pathway-id': { description: '在初中校園與社區情境中作出安全實用選擇', rounds: [{ prompt: '乘巴士前，先要準備甚麼？', context: '你要和同學去社區中心。', choices: [['💳', '八達通'], ['🧸', '大型玩具'], ['🍳', '平底鑊']], answer: '八達通', instruction: '請選出乘車時需要的物品。', clue: '想一想上車時要怎樣付款。', success: '答對了！八達通可以幫你上車。' }, { prompt: '到集合點後，應該怎樣做？', context: '老師說大家要在門口等齊。', choices: [['📍', '在安全位置等候'], ['🏃', '自己跑去別處'], ['📣', '大聲叫所有人']], answer: '在安全位置等候', instruction: '請選出到集合點後的合適做法。', clue: '集合點的意思是大家在同一位置等候。', success: '很好！你選了安全的下一步。' }, { prompt: '使用公共設施前，先要做甚麼？', context: '你第一次使用社區中心的器材。', choices: [['🙋', '先問職員怎樣使用'], ['🛠️', '自己隨意拆開'], ['📣', '立刻大叫']], answer: '先問職員怎樣使用', instruction: '請選出第一次使用器材時的做法。', clue: '不確定時，先問清楚再開始。', success: '做得好！先詢問是安全的選擇。' }] },
          'pathway-asd': { description: '處理同儕討論、界線與誤會時的社交選擇', rounds: [{ prompt: '朋友說他今天想一個人坐，可以怎樣回應？', context: '午飯時，你本來想和他坐在一起。', choices: [['🗣️', '好的，我遲些再找你。'], ['🪑', '我一定要坐在你旁邊'], ['📣', '你不可以這樣做']], answer: '好的，我遲些再找你。', instruction: '請選出尊重朋友需要的回應。', clue: '每個人有時都需要自己的空間。', success: '答對了！你尊重了對方的界線。' }, { prompt: '群組訊息沒有回覆時，最合適是甚麼？', context: '你剛發了問題，但同學可能正在上課。', choices: [['⏳', '先等一等，遲些再看'], ['📱', '不停連續傳訊息'], ['📣', '在群組責怪大家']], answer: '先等一等，遲些再看', instruction: '請選出未收到回覆時的合適做法。', clue: '別人可能未能立即回覆。', success: '很好！你給了大家回覆的時間。' }, { prompt: '同學誤會你的意思時，可以怎樣做？', context: '他以為你不想合作，但其實你想知道工作怎樣分。', choices: [['🗣️', '我想合作，可以告訴我怎樣分工嗎？'], ['🚪', '立刻離開小組'], ['📣', '你完全不明白我']], answer: '我想合作，可以告訴我怎樣分工嗎？', instruction: '請選出澄清誤會的句子。', clue: '說出自己的意思，再問一個清楚問題。', success: '做得好！你用語句把誤會說清楚。' }] },
          'pathway-adhd': { description: '在較長任務中選擇下一步、停止衝動及回看目標', rounds: [{ prompt: '小組報告有三項工作，現在應該怎樣開始？', context: '清單寫著：找資料、做海報、排練。', choices: [['📋', '先選一項並設定短時間'], ['🎲', '同時做全部事情'], ['📱', '先刷短片']], answer: '先選一項並設定短時間', instruction: '請選出開始多步任務的方法。', clue: '把大任務分成眼前一項會更容易開始。', success: '答對了！你把任務變成可開始的一步。' }, { prompt: '收到訊息想立刻回覆，但正在上課，可以怎樣做？', context: '電話震動了一下。', choices: [['📵', '記下提醒，下課才回覆'], ['📱', '立刻在課堂回覆'], ['🚶', '離開課室']], answer: '記下提醒，下課才回覆', instruction: '請選出管理分心訊息的方法。', clue: '先保留提醒，再回到目前最重要的事。', success: '很好！你同時照顧了提醒和課堂。' }, { prompt: '交報告前，最有用的最後一步是甚麼？', context: '你已完成內容，還有五分鐘。', choices: [['🔎', '核對名字、日期和附件'], ['🗑️', '刪除全部內容'], ['📣', '叫同學替你交']], answer: '核對名字、日期和附件', instruction: '請選出交報告前的短核對。', clue: '只看三項最重要資料。', success: '做得好！短核對可以減少遺漏。' }] },
          'pathway-sli': { description: '理解同儕與社區情境中的重點、目的及回應方式', rounds: [{ prompt: '同學說：「下課後去圖書館，你想一起嗎？」他在問甚麼？', context: '留意句尾的「想一起嗎」。', choices: [['📚', '是否一起去圖書館'], ['🍜', '午飯吃甚麼'], ['⚽', '誰要踢足球']], answer: '是否一起去圖書館', instruction: '請找出同學邀請你的內容。', clue: '想一想他提到的地方和「一起」這個字。', success: '答對了！你理解了同學的邀請。' }, { prompt: '公告說「請保留收據」，重點是甚麼？', context: '活動後可能需要出示付款資料。', choices: [['🧾', '不要丟掉收據'], ['🗑️', '立刻把收據丟掉'], ['🎮', '帶遊戲機']], answer: '不要丟掉收據', instruction: '請選出公告的主要行動。', clue: '保留的意思是先放好，不要丟掉。', success: '很好！你找到了主要行動。' }, { prompt: '你想確認集合地點，可以怎樣問？', context: '你知道時間，但不清楚在哪裏見面。', choices: [['🗣️', '請問我們在哪裏集合？'], ['📣', '我甚麼也不知道'], ['🚪', '我不去就可以']], answer: '請問我們在哪裏集合？', instruction: '請選出詢問地點的句子。', clue: '問題要包含「哪裏」這個關鍵詞。', success: '做得好！你問得清楚而具體。' }] },
          'pathway-mi': { description: '在外出與小組活動中使用功能性溝通選擇卡', rounds: [{ prompt: '外出時感到不舒服，選哪張卡最能表達需要？', context: '你需要先停一停，讓老師知道。', choices: [['🛟', '我需要幫忙'], ['🏃', '我想加快'], ['🎲', '我想玩遊戲']], answer: '我需要幫忙', instruction: '請選出不舒服時的求助卡。', clue: '找可以讓大人知道要協助你的句子。', success: '答對了！你清楚表達了求助。' }, { prompt: '小組分工時，你想知道自己做甚麼，可以怎樣說？', context: '大家正在安排海報工作。', choices: [['🗣️', '我的工作是甚麼？'], ['📣', '我不會做任何事'], ['🚪', '我先走了']], answer: '我的工作是甚麼？', instruction: '請選出詢問工作內容的句子。', clue: '直接問自己需要負責哪一項。', success: '很好！你主動了解了自己的任務。' }, { prompt: '你已到達集合點，可以選哪張卡？', context: '老師要知道每位同學是否安全到達。', choices: [['📍', '我已到達'], ['🚻', '我想去洗手間'], ['🥤', '我想喝水']], answer: '我已到達', instruction: '請選出到達後可使用的選擇卡。', clue: '找和位置圖示有關的句子。', success: '做得好！你報告了自己的位置。' }] }
        },
        senior: {
          'pathway-spld': { description: '在職場和社區資料中提取時間、要求與回覆重點', rounds: [{ prompt: '實習通知寫「九時正到達」，甚麼時候要到？', context: '第一天實習：請於<strong>九時正</strong>到服務台報到。', choices: [['⏰', '九時正'], ['📅', '星期五'], ['🍽️', '午飯後']], answer: '九時正', instruction: '請找出報到時間。', clue: '找一找「於」字後面的時間。', success: '答對了！你找到了職場通知的時間。' }, { prompt: '「請攜帶身份證明文件」最主要的要求是甚麼？', context: '辦理登記時，職員需要確認你的身份。', choices: [['🪪', '帶身份證明文件'], ['🎮', '帶遊戲機'], ['🧸', '帶玩具']], answer: '帶身份證明文件', instruction: '請選出通知要求帶的物品。', clue: '找和登記、身份有關的選項。', success: '很好！你提取了重要要求。' }, { prompt: '哪一句最適合回覆主管？', context: '主管問：你明天可否九時到達？', choices: [['🗣️', '可以，我會九時到達。'], ['🌧️', '九時正在下雨。'], ['🍎', '我喜歡九時吃水果。']], answer: '可以，我會九時到達。', instruction: '請選出清楚的工作回覆。', clue: '回覆要確認時間和自己會做的行動。', success: '做得好！你選了清楚的職場回覆。' }] },
          'pathway-id': { description: '為實習、社區服務與獨立出行作出功能性選擇', rounds: [{ prompt: '出發到實習地點前，先核對甚麼？', context: '背包裏有工作證、八達通和水樽。', choices: [['🪪', '工作證和交通卡'], ['🧸', '玩具和零食'], ['🎮', '遊戲機和耳機']], answer: '工作證和交通卡', instruction: '請選出出發前最重要的用品。', clue: '想一想工作身份和乘車都需要甚麼。', success: '答對了！你選出了出行重要物品。' }, { prompt: '不確定機器怎樣使用時，應該怎樣做？', context: '實習場所的清潔機器和學校的不一樣。', choices: [['🙋', '先問主管或同事'], ['🛠️', '自己隨意按掣'], ['📣', '直接離開不說話']], answer: '先問主管或同事', instruction: '請選出不熟悉器材時的安全做法。', clue: '不確定時，先問清楚再開始。', success: '很好！先詢問能保持安全。' }, { prompt: '完成工作後，最合適的下一步是甚麼？', context: '你已完成桌面整理。', choices: [['✅', '向主管報告已完成'], ['🚪', '不說話就離開'], ['📱', '立刻玩電話']], answer: '向主管報告已完成', instruction: '請選出完成工作後的做法。', clue: '讓主管知道進度，才容易安排下一步。', success: '做得好！你清楚報告了工作進度。' }] },
          'pathway-asd': { description: '在實習和服務場合練習禮貌、界線及需要表達', rounds: [{ prompt: '到實習地點見到同事，可以怎樣開始？', context: '你第一次到服務台報到。', choices: [['🗣️', '早晨，我是今天來實習的。'], ['🙈', '完全不看任何人'], ['📣', '我要你立刻幫我']], answer: '早晨，我是今天來實習的。', instruction: '請選出到新地方可使用的開始語句。', clue: '先問好，再說明自己來的原因。', success: '答對了！你有清楚而有禮貌的開始。' }, { prompt: '同事正在忙，想問問題可以怎樣做？', context: '他正在和服務使用者說話。', choices: [['⏳', '先等他完成，再問可否請教'], ['📣', '立刻大聲打斷'], ['🪑', '一直站得很近']], answer: '先等他完成，再問可否請教', instruction: '請選出同事忙碌時的合適做法。', clue: '先看對方是否方便，再提出問題。', success: '很好！你尊重了工作場合的回合。' }, { prompt: '覺得工作安排不清楚，可以怎樣說？', context: '你知道要幫忙整理，但不確定先做哪一區。', choices: [['🗣️', '請問我應先整理哪一區？'], ['📣', '這個安排很差'], ['🚪', '不做也不說']], answer: '請問我應先整理哪一區？', instruction: '請選出詢問清楚工作安排的句子。', clue: '先說出需要知道的具體資料。', success: '做得好！你用問題讓任務更清楚。' }] },
          'pathway-adhd': { description: '以優先次序、短清單和停一停策略完成成人任務', rounds: [{ prompt: '上班前有三件事，哪一項最先處理？', context: '你要帶工作證、回覆不急訊息和選背景音樂。', choices: [['🪪', '先確認工作證'], ['🎵', '先選音樂'], ['📱', '先回覆所有訊息']], answer: '先確認工作證', instruction: '請選出出門前最重要的一項。', clue: '先做遲了便不能補救的重要物品。', success: '答對了！你先處理了最重要的事。' }, { prompt: '工作中很想離開座位，可以怎樣停一停？', context: '你還有一個五分鐘的小任務未完成。', choices: [['⏲️', '完成五分鐘後再休息'], ['🚪', '立刻離開不說'], ['📱', '開始看影片']], answer: '完成五分鐘後再休息', instruction: '請選出管理衝動的短策略。', clue: '把等待時間變成一個很短的目標。', success: '很好！短目標讓你有可預期的休息。' }, { prompt: '離開工作位置前，最後核對甚麼？', context: '今天的工作已完成。', choices: [['📋', '個人物品、下一步和交接'], ['🎲', '下一個遊戲'], ['📣', '其他人有沒有看你']], answer: '個人物品、下一步和交接', instruction: '請選出離開前的三項短核對。', clue: '想一想帶走甚麼、明天做甚麼、誰要知道。', success: '做得好！你用短核對完成收尾。' }] },
          'pathway-sli': { description: '理解職場指令、確認資料及使用清楚服務語句', rounds: [{ prompt: '主管說：「先登記，再到等候區。」第一步是甚麼？', context: '這是一個有先後次序的服務指令。', choices: [['📝', '先登記'], ['🪑', '到等候區'], ['🚌', '乘巴士']], answer: '先登記', instruction: '請選出指令中的第一步。', clue: '留意「先」字後面的行動。', success: '答對了！你理解了指令的次序。' }, { prompt: '服務員說「請出示工作證」，他需要甚麼？', context: '找出句子中的重要物品。', choices: [['🪪', '工作證'], ['🎧', '耳機'], ['🧣', '頸巾']], answer: '工作證', instruction: '請選出服務員要求的物品。', clue: '慢慢重聽「出示」後面的名稱。', success: '很好！你找到了關鍵物品。' }, { prompt: '想確認下一步，可以怎樣問？', context: '你已完成登記，但不清楚要去哪裏。', choices: [['🗣️', '請問我現在要到哪裏？'], ['📣', '我完全不知道'], ['🚪', '我先自己離開']], answer: '請問我現在要到哪裏？', instruction: '請選出確認下一步的問題。', clue: '問題要清楚問「現在」和「哪裏」。', success: '做得好！你用清楚問題取得資料。' }] },
          'pathway-mi': { description: '用功能性選擇卡表達職場、社區與調節需要', rounds: [{ prompt: '到實習地點後，選哪張卡向主管報到？', context: '讓主管知道你已安全到達。', choices: [['📍', '我已到達'], ['🥤', '我想喝水'], ['🚻', '我想去洗手間']], answer: '我已到達', instruction: '請選出報到時可以使用的選擇卡。', clue: '找和位置圖示有關的短句。', success: '答對了！你清楚報告了自己已到達。' }, { prompt: '覺得聲音太大，需要短暫休息，可以選哪張卡？', context: '先讓主管知道你的調節需要。', choices: [['🌿', '我需要安靜休息'], ['🎮', '我需要玩遊戲'], ['🏃', '我需要快跑']], answer: '我需要安靜休息', instruction: '請選出感官不舒服時的需要卡。', clue: '找有休息意思的卡。', success: '很好！你清楚說出了調節需要。' }, { prompt: '要請同事再示範一次，可以怎樣說？', context: '你第一次學習新的工作步驟。', choices: [['🤝', '請你再示範一次'], ['📣', '我不要學了'], ['🚪', '我現在離開']], answer: '請你再示範一次', instruction: '請選出請人協助學習的短句。', clue: '可以直接請對方再做一次給你看。', success: '做得好！你主動請求了合適支援。' }] }
        }
      };
      const spldP1StandaloneGames = window.SPLD_P1_LAB?.activityCards?.() || [];
      const spldP4StandaloneGames = window.SPLD_P4_LAB?.activityCards?.() || [];
      const spldS1StandaloneGames = window.SPLD_S1_LAB?.activityCards?.() || [];
      const spldS4StandaloneGames = window.SPLD_S4_LAB?.activityCards?.() || [];
      const externalPathwayModules = window.SEN_PATHWAY_MODULES || {};
      Object.values(externalPathwayModules).forEach((moduleConfig) => {
        if (!moduleConfig?.card?.id) return;
        const existingIndex = pathwayTraining.findIndex((game) => game.id === moduleConfig.card.id);
        if (existingIndex !== -1) pathwayTraining[existingIndex] = moduleConfig.card;
        Object.entries(moduleConfig.stages || {}).forEach(([stage, task]) => {
          if (pathwayStageTasks[stage]) pathwayStageTasks[stage][moduleConfig.card.id] = task;
        });
      });
      const pathwayGameMap = Object.fromEntries(pathwayTraining.map(game => [game.id, game]));
      const gameMap = Object.fromEntries([...gameLibrary, spldTraining, ...spldP1StandaloneGames, ...spldP4StandaloneGames, ...spldS1StandaloneGames, ...spldS4StandaloneGames, ...pathwayTraining].map(game => [game.id, game]));
      let activeStage = 'lower';
      let activeFilter = 'all';
      let activePathway = null;
      const spldStageTasks = window.SPLD_STAGE_TASKS || {};
      const adhdStageTasks = window.ADHD_STAGE_TASKS || {};
      const asdStageTasks = window.ASD_STAGE_TASKS || {};
      const ebdStageTasks = window.EBD_STAGE_TASKS || {};
      const idStageTasks = window.idStageTraining || {};
      const giftedHiTasks = window.GIFTED_HI_STAGE_TASKS || {};
      function getStageGame(game) { if (game.id === 'spld') return { ...game, ...(spldStageTasks[activeStage] || {}) }; if (game.id === 'pathway-gifted') return { ...game, ...(giftedHiTasks.gifted || {}) }; if (game.id === 'pathway-hi') return { ...game, ...(giftedHiTasks.hi || {}) }; if (game.id === 'pathway-id') return { ...game, ...(idStageTasks[activeStage] || {}) }; if (game.id === 'pathway-adhd') return { ...game, ...(adhdStageTasks[activeStage] || {}) }; if (game.id === 'pathway-asd') return { ...game, ...(asdStageTasks[activeStage] || {}) }; if (game.id === 'pathway-ebd') return { ...game, ...(ebdStageTasks[activeStage] || {}) }; return { ...game, ...(stageTasks[activeStage]?.[game.id] || pathwayStageTasks[activeStage]?.[game.id] || {}) }; }
      function getPrimaryPathwayGame() { if (!activePathway) return null; return activePathway === '1' ? getStageGame(spldTraining) : getStageGame(pathwayGameMap[`pathway-${({ '1': 'spld', '2': 'id', '3': 'asd', '4': 'adhd', 'G': 'gifted', 'H': 'hi', 'E': 'ebd', '8': 'sli', '9': 'mi' })[activePathway]}`]); }
      let activeGame = null;
      let ebdMissionKeyHandler = null;
      let stageEscapeHandler = null;
      let roundIndex = 0;
      let completedGames = new Set();
      let tokenCount = 0;
      let soundEnabled = true;
      let hapticEnabled = false;
      let gameState = {};
      let autoAdvanceTimer;
      let adhdTimerId;
      const lessonStorageKey = 'sen-classroom-session-v1';
      const createLessonSession = () => ({ mode: false, paused: false, startedAt: null, completedGames: 0, correctAttempts: 0, hintsUsed: 0, retries: 0, updatedAt: null });
      let lessonSession = (() => { try { return { ...createLessonSession(), ...(JSON.parse(localStorage.getItem(lessonStorageKey)) || {}) }; } catch (_) { return createLessonSession(); } })();
      function saveLessonSession() { try { localStorage.setItem(lessonStorageKey, JSON.stringify(lessonSession)); } catch (_) {} }
      function lessonDurationLabel() { if (!lessonSession.startedAt) return '尚未開始'; return `已進行 ${Math.max(1, Math.floor((Date.now() - lessonSession.startedAt) / 60000))} 分鐘`; }
      function renderLessonSession() { document.body.classList.toggle('lesson-mode', Boolean(lessonSession.mode)); document.body.classList.toggle('lesson-paused', Boolean(lessonSession.mode && lessonSession.paused)); $('#lessonGames').textContent = lessonSession.completedGames; $('#lessonCorrect').textContent = lessonSession.correctAttempts; $('#lessonHints').textContent = lessonSession.hintsUsed; $('#lessonRetries').textContent = lessonSession.retries; $('#lessonSummaryText').textContent = lessonSession.mode ? `${lessonSession.paused ? '目前已暫停，先以短句、圖卡或呼吸提示帶領。' : '課堂進行中：答題、提示與完成會只記在這部裝置。'} ${lessonDurationLabel()}。` : '按「開始課堂模式」後，網站只在這部裝置記錄本節完成、正確、提示與重試，不會上傳學生資料。'; $('#lessonModeToggle').textContent = lessonSession.mode ? '✓ 課堂模式進行中' : '▶ 開始課堂模式'; $('#lessonModeToggle').classList.toggle('active', lessonSession.mode); $('#lessonPauseToggle').textContent = lessonSession.paused ? '▶ 繼續訓練' : 'Ⅱ 暫停提示'; $('#lessonPauseToggle').classList.toggle('warn', lessonSession.paused); $('#lessonPauseStage').textContent = lessonSession.paused ? '▶ 繼續' : 'Ⅱ 暫停'; $('#lessonPauseStage').classList.toggle('active', lessonSession.paused); $('#lessonStageTitle').textContent = lessonSession.paused ? '教師提示暫停中' : lessonSession.mode ? '課堂模式進行中' : '課堂模式'; $('#lessonStageStats').textContent = `完成 ${lessonSession.completedGames} · 正確 ${lessonSession.correctAttempts} · 提示 ${lessonSession.hintsUsed} · 重試 ${lessonSession.retries}`; }
      function ensureLessonSession() { if (!lessonSession.mode) { lessonSession.mode = true; lessonSession.startedAt = Date.now(); lessonSession.paused = false; } }
      function changeLessonCount(field, amount = 1) { ensureLessonSession(); lessonSession[field] += amount; lessonSession.updatedAt = Date.now(); saveLessonSession(); renderLessonSession(); }
      function toggleLessonPause() { ensureLessonSession(); lessonSession.paused = !lessonSession.paused; lessonSession.updatedAt = Date.now(); saveLessonSession(); renderLessonSession(); showToast(lessonSession.paused ? '已暫停互動，先用提示帶領。' : '已繼續訓練。'); }
      function toggleLessonMode() { if (lessonSession.mode) { lessonSession.mode = false; lessonSession.paused = false; } else { lessonSession.mode = true; lessonSession.startedAt = Date.now(); lessonSession.paused = false; } lessonSession.updatedAt = Date.now(); saveLessonSession(); renderLessonSession(); showToast(lessonSession.mode ? '已開始課堂模式；記錄只會保留在本機。' : '已結束課堂模式；本節摘要仍保留在本機。'); }
      function resetLessonSession() { if (!confirm('確定重設本節的裝置內記錄嗎？')) return; lessonSession = createLessonSession(); saveLessonSession(); renderLessonSession(); showToast('本節記錄已重設。'); }
      let adhdSession = null;
      let asdProgress = null;
      let asdCoreRuns = [];
      function isAdhdGame() { return activeGame?.id === 'pathway-adhd'; }
      function isAsdGame() { return activeGame?.id === 'pathway-asd'; }
      function resetAsdProgress() { asdProgress = { startedAt: new Date().toLocaleString('zh-HK'), rounds: {} }; }
      function getAsdRoundProgress(index = roundIndex) { if (!asdProgress) return null; return asdProgress.rounds[index] || (asdProgress.rounds[index] = { attempts: 0, retries: 0, hints: 0, correct: false, completedAt: '' }); }
      function recordAsdAttempt(correct) { if (!isAsdGame() || !asdProgress) return; const progress = getAsdRoundProgress(); progress.attempts += 1; if (!correct) progress.retries += 1; if (correct && !progress.correct) { progress.correct = true; progress.completedAt = new Date().toLocaleString('zh-HK'); } renderAsdExportPanel(); }
      function recordAsdHint() { if (!isAsdGame() || !asdProgress) return; getAsdRoundProgress().hints += 1; renderAsdExportPanel(); }
      function recordAsdLabResult(result) {
        if (!result) return;
        asdCoreRuns = [...asdCoreRuns, result].slice(-5);
        if (lessonSession.mode) {
          if (result.correct) changeLessonCount('correctAttempts', result.correct);
          if (result.incorrect) changeLessonCount('retries', result.incorrect);
        }
        showToast(`已完成${result.label}：${result.correct} / ${result.total} 正確。`);
      }
      function recordIdLabResult(result) {
        if (!result) return;
        if (lessonSession.mode) {
          if (result.correct) changeLessonCount('correctAttempts', result.correct);
          if (result.incorrect) changeLessonCount('retries', result.incorrect);
        }
        showToast(`已完成${result.label}：${result.correct} / ${result.total} 正確。`);
      }
      function recordSliLabResult(result) {
        if (!result) return;
        if (lessonSession.mode) {
          if (result.correct) changeLessonCount('correctAttempts', result.correct);
          if (result.incorrect) changeLessonCount('retries', result.incorrect);
        }
        showToast(`已完成${result.label}：${result.correct} / ${result.total} 正確。`);
      }
      function recordGifted2eLabResult(result) {
        if (!result) return;
        if (lessonSession.mode && result.total) {
          if (result.correct) changeLessonCount('correctAttempts', result.correct);
          if (result.incorrect) changeLessonCount('retries', result.incorrect);
        }
        showToast(result.total ? `已完成${result.label}；結果只作本節課回顧，不作能力比較。` : `已完成${result.label}；你可與教師按自己的意願回顧。`);
      }
      function recordEbdMiLabResult(result) {
        if (!result) return;
        if (result.openEnded) { showToast(`已完成${result.label}；這是八個策略情境的課堂回顧，不作行為評分。`); return; }
        if (lessonSession.mode) {
          if (result.correct) changeLessonCount('correctAttempts', result.correct);
          if (result.incorrect) changeLessonCount('retries', result.incorrect);
        }
        showToast(`已完成${result.label}：${result.correct} / ${result.total} 小練習。`);
      }
      function csvField(value) { return `"${String(value ?? '').replace(/"/g, '""')}"`; }
      function renderAsdExportPanel() {
        const panel = $('#asdExportPanel');
        if (!isAsdGame() || !asdProgress) { panel.hidden = true; panel.innerHTML = ''; return; }
        const completed = Object.values(asdProgress.rounds).filter(item => item.correct).length;
        panel.hidden = false;
        panel.innerHTML = `<div><strong>家長／教師進度匯出</strong><p>本次工作階段：已完成 ${completed} / ${activeGame.rounds.length} 關。匯出只含關卡使用紀錄，不含個人身分資料。</p></div><button class="asd-export-button" id="exportAsdProgress" type="button">⇩ 匯出 CSV</button>`;
        $('#exportAsdProgress')?.addEventListener('click', downloadAsdProgress);
      }
      function downloadAsdProgress() {
        if (!isAsdGame() || !asdProgress) return;
        const headers = ['匯出時間', '模組', '學段', '關卡', '訓練焦點', '嘗試次數', '正確完成', '重試次數', '提示使用', '完成時間'];
        const exportedAt = new Date().toLocaleString('zh-HK');
        const rows = activeGame.rounds.map((round, index) => { const item = asdProgress.rounds[index] || {}; return [exportedAt, 'ASD 社交互動訓練', stageProfiles[activeStage].label, `${index + 1} / ${activeGame.rounds.length}`, round.band || '', item.attempts || 0, item.correct ? '是' : '未完成', item.retries || 0, item.hints || 0, item.completedAt || '']; });
        const csv = '\ufeff' + [headers, ...rows].map(row => row.map(csvField).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
        anchor.href = url; anchor.download = `ASD_進度紀錄_${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
        showToast('已匯出 ASD 進度紀錄 CSV。');
      }
      const adhdTimerModes = [{ seconds: 0, label: '自選節奏' }, { seconds: 30, label: '30 秒啟動' }, { seconds: 45, label: '45 秒聚焦' }, { seconds: 60, label: '60 秒節奏' }, { seconds: 90, label: '90 秒完成' }, { seconds: 120, label: '120 秒雙步' }, { seconds: 180, label: '180 秒耐力' }];
      function clearAdhdTimer() { clearInterval(adhdTimerId); adhdTimerId = null; }
      function formatSeconds(total) { const safe = Math.max(0, Math.floor(total || 0)); return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`; }
      function getAdhdElapsed() { if (!adhdSession?.startedAt) return adhdSession?.elapsed || 0; return Math.min(adhdSession.duration, Math.floor((Date.now() - adhdSession.startedAt) / 1000)); }
      function getAdhdMetric(index = roundIndex) { if (!adhdSession) return null; return adhdSession.roundMetrics[index] || (adhdSession.roundMetrics[index] = { startedAt: Date.now(), timerStartElapsed: adhdSession.elapsed || 0, attempts: 0, retries: 0, correct: false, seconds: null }); }
      function getAdhdRoundSeconds(metric) { if (!metric) return 0; if (adhdSession?.duration) return Math.max(1, getAdhdElapsed() - (metric.timerStartElapsed || 0)); return Math.max(1, Math.round((Date.now() - metric.startedAt) / 1000)); }
      function startAdhdRound() { if (isAdhdGame() && adhdSession) getAdhdMetric(); }
      function resetAdhdSession() { clearAdhdTimer(); adhdSession = { duration: 0, startedAt: null, elapsed: 0, paused: false, firstCorrect: 0, retries: 0, completed: 0, currentStreak: 0, longestStreak: 0, roundMetrics: {}, timerFinished: false, modeLabel: '自選節奏' }; }
      function getAdhdAccuracy() { if (!adhdSession) return 0; const totalAttempts = Object.values(adhdSession.roundMetrics).reduce((total, metric) => total + metric.attempts, 0); return totalAttempts ? Math.round((adhdSession.completed / totalAttempts) * 100) : 0; }
      function renderAdhdLabSummary() {
        const runs = adhdSession?.labRuns || [];
        if (!runs.length) return '<section class="adhd-lab-summary"><strong>專注實驗室</strong><span>可開啟短、中或長時段挑戰；紀錄只保留本次訓練。</span></section>';
        const latest = runs[runs.length - 1];
        const average = latest.averageMs ? ` · 平均反應 ${latest.averageMs} 毫秒` : '';
        return `<section class="adhd-lab-summary"><strong>最近實驗室：${latest.label}</strong><span>${latest.correct} / ${latest.total} 正確${average} · 本節共完成 ${runs.length} 次專注挑戰</span></section>`;
      }
      function recordAdhdLabResult(result) {
        if (!adhdSession || !result) return;
        adhdSession.labRuns = [...(adhdSession.labRuns || []), result].slice(-5);
        if (lessonSession.mode) {
          if (result.correct) changeLessonCount('correctAttempts', result.correct);
          if (result.incorrect) changeLessonCount('retries', result.incorrect);
        }
        renderAdhdDashboard();
        showToast(`已完成${result.label}：${result.correct} / ${result.total} 正確。`);
      }
      function renderAdhdRoundChart() {
        const metrics = activeGame.rounds.map((_, index) => adhdSession.roundMetrics[index]);
        const finished = metrics.filter(metric => metric?.correct && metric.seconds !== null);
        const maxSeconds = Math.max(10, ...finished.map(metric => metric.seconds));
        return `<section class="adhd-analysis" aria-label="本次回合節奏分析"><div class="adhd-analysis-head"><strong>回合節奏</strong><span>完成後顯示實際作答時間</span></div><div class="adhd-round-chart">${metrics.map((metric, index) => { const seconds = metric?.seconds; const width = seconds ? Math.max(9, Math.round((seconds / maxSeconds) * 100)) : 0; return `<div class="adhd-chart-row"><span>第 ${index + 1} 關</span><div class="adhd-chart-track">${seconds ? `<i style="width:${width}%"></i>` : '<em></em>'}</div><b>${seconds ? `${seconds} 秒` : '—'}</b></div>`; }).join('')}</div><p>這是本次工作階段的流程回顧，不作能力評估或比較。</p></section>`;
      }
      function renderAdhdDashboard() {
        const dashboard = $('#adhdDashboard');
        if (!isAdhdGame() || !adhdSession) { dashboard.hidden = true; dashboard.innerHTML = ''; return; }
        const elapsed = getAdhdElapsed(); adhdSession.elapsed = elapsed;
        const activeDuration = adhdSession.duration;
        const timeText = activeDuration ? `${formatSeconds(elapsed)} / ${formatSeconds(activeDuration)}` : '未計時';
        const modeButtons = adhdTimerModes.map(mode => `<button class="timer-choice ${activeDuration === mode.seconds ? 'active' : ''}" type="button" data-seconds="${mode.seconds}" data-label="${mode.label}">${mode.label}</button>`).join('');
        dashboard.hidden = false;
        dashboard.innerHTML = `<div class="adhd-dashboard-head"><div><h3>專注紀錄與節奏看板</h3><p>計時為可選工具；可以暫停、轉換模式，並按自己的節奏繼續。</p></div></div><div class="timer-choice-row">${modeButtons}</div><div class="timer-control-row">${activeDuration ? `<button class="timer-control" id="adhdPauseTimer" type="button">${adhdSession.paused ? '▶ 繼續計時' : 'Ⅱ 暫停計時'}</button><span>目前：${adhdSession.modeLabel} · ${timeText}</span>` : '<span>目前使用自選節奏；不會顯示倒數。</span>'}</div><div class="adhd-stat-grid adhd-stat-grid-rich"><div class="adhd-stat"><span>完成關卡</span><strong>${adhdSession.completed} / ${activeGame.rounds.length}</strong></div><div class="adhd-stat"><span>已用專注時間</span><strong>${timeText}</strong></div><div class="adhd-stat"><span>首次正確</span><strong>${adhdSession.firstCorrect}</strong></div><div class="adhd-stat"><span>溫和重試</span><strong>${adhdSession.retries}</strong></div><div class="adhd-stat"><span>本次正確率</span><strong>${getAdhdAccuracy()}%</strong></div><div class="adhd-stat"><span>最長連續完成</span><strong>${adhdSession.longestStreak}</strong></div></div>${renderAdhdRoundChart()}<div class="timer-gentle-note">${adhdSession.timerFinished ? '計時段已完成；你可以不急不忙地繼續。' : '所有數據只記錄本次訓練流程，不作比較、不扣分。'}</div>`;
        dashboard.insertAdjacentHTML('beforeend', `${renderAdhdLabSummary()}<div class="adhd-lab-entry"><div><strong>🎯 分級專注實驗室</strong><span>色字干擾、反應抑制與持續注意；可按學生狀態選短、中或長挑戰。</span></div><button class="timer-control" id="adhdFocusLabLaunch" type="button">開啟專注挑戰</button></div><div class="adhd-lab-entry"><div><strong>🧠 分級認知訓練室</strong><span>按初小至高中調整回合、速度和規則複雜度；可選 CPT、步進記憶、中央箭頭、規則切換、空間記憶、視覺搜尋、星球追蹤及反應抑制。</span></div><button class="timer-control" id="adhdGradedLabLaunch" type="button">選擇分級遊戲</button></div>`);
        $$('.timer-choice', dashboard).forEach(button => button.addEventListener('click', () => startAdhdTimer(Number(button.dataset.seconds), button.dataset.label)));
        $('#adhdPauseTimer')?.addEventListener('click', toggleAdhdTimer);
        $('#adhdFocusLabLaunch')?.addEventListener('click', () => {
          if (!window.ADHD_FOCUS_LAB) { showToast('專注實驗室正在準備中，請稍後再試。'); return; }
          window.ADHD_FOCUS_LAB.open({ stage: activeStage, onComplete: recordAdhdLabResult });
        });
        $('#adhdGradedLabLaunch')?.addEventListener('click', () => {
          if (!window.ADHD_GRADED_LAB) { showToast('分級認知訓練室正在準備中，請稍後再試。'); return; }
          window.ADHD_GRADED_LAB.open({ stage: activeStage, onComplete: recordAdhdLabResult });
        });
      }
      function tickAdhdTimer() { const elapsed = getAdhdElapsed(); adhdSession.elapsed = elapsed; if (elapsed >= adhdSession.duration && !adhdSession.timerFinished) { adhdSession.timerFinished = true; clearAdhdTimer(); showToast('計時段已完成；你可以按自己的節奏繼續。'); } renderAdhdDashboard(); }
      function startAdhdTimer(seconds, label = '自選節奏') { clearAdhdTimer(); adhdSession.duration = seconds; adhdSession.elapsed = 0; adhdSession.startedAt = seconds ? Date.now() : null; adhdSession.paused = false; adhdSession.timerFinished = false; adhdSession.modeLabel = label; if (seconds) adhdTimerId = setInterval(tickAdhdTimer, 500); renderAdhdDashboard(); }
      function toggleAdhdTimer() { if (!adhdSession?.duration || adhdSession.timerFinished) return; if (adhdSession.paused) { adhdSession.startedAt = Date.now() - (adhdSession.elapsed * 1000); adhdSession.paused = false; adhdTimerId = setInterval(tickAdhdTimer, 500); } else { adhdSession.elapsed = getAdhdElapsed(); adhdSession.startedAt = null; adhdSession.paused = true; clearAdhdTimer(); } renderAdhdDashboard(); }
      function recordAdhdAttempt(correct) {
        if (!isAdhdGame() || !adhdSession) return;
        const metric = getAdhdMetric(); metric.attempts += 1;
        if (!correct) { metric.retries += 1; adhdSession.retries += 1; }
        if (correct && !metric.correct) { metric.correct = true; metric.seconds = getAdhdRoundSeconds(metric); adhdSession.completed += 1; if (metric.attempts === 1) { adhdSession.firstCorrect += 1; adhdSession.currentStreak += 1; adhdSession.longestStreak = Math.max(adhdSession.longestStreak, adhdSession.currentStreak); } else adhdSession.currentStreak = 0; }
        renderAdhdDashboard();
      }

      function makeTone(frequency = 620, duration = 0.16, volume = 0.025) {
        if (!soundEnabled) return;
        try {
          const Context = window.AudioContext || window.webkitAudioContext;
          const context = new Context();
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = 'sine'; oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(volume, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
          oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + duration); oscillator.onended = () => context.close();
        } catch (_) { /* The visual feedback remains available if audio is blocked. */ }
      }
      function triggerHaptic(kind = 'tap') {
        if (!hapticEnabled || !('vibrate' in navigator)) return;
        const patterns = { tap: 12, correct: [14, 35, 20], retry: [8, 42, 8], complete: [20, 55, 20, 55, 32] };
        navigator.vibrate(patterns[kind] || patterns.tap);
      }
      function speak(text, rate = .77) {
        if (!soundEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-HK'; utterance.rate = rate; utterance.pitch = 1.02;
        window.speechSynthesis.speak(utterance);
      }
      function stripMarkup(value) { return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }
      function getSpldReadText(round) { return `讀寫焦點：${round.band}。${round.instruction}。題目：${stripMarkup(round.prompt)}。${round.context ? `資料：${stripMarkup(round.context)}。` : ''}`; }
      function getSpldVisualCue(round) { return `<aside class="spld-visual-cue" aria-label="視覺解題步驟"><span class="spld-visual-label">視覺解題步驟</span><div class="spld-step-row"><span class="spld-step-chip">① 看題目</span><span class="spld-step-chip">② 圈關鍵詞</span><span class="spld-step-chip">③ 慢讀選項</span><span class="spld-step-chip">④ 作出選擇</span></div><div class="spld-keyword-card">本關讀寫焦點：<strong>${round.band}</strong>。先找有粗體或重要意思的詞。</div></aside>`; }
      function getSpldReadingTracker(round) { const text = stripMarkup(round.context || round.prompt); return `<details class="spld-reading-tracker"><summary>▰ 開啟文字閱讀導向條</summary><div class="spld-tracker-lane" aria-hidden="true"><i></i></div><p>${text}</p><small>可把手指、游標或這條色帶放在正在讀的一行附近，慢慢向下移動；這只是自選閱讀支架，不量度視線、速度或能力。</small></details>`; }
      function readSpldHint(round) { speak(`解題小提示。${round.clue}`, .66); }
      function shuffle(items) { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
      function escapeHTML(value) { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char])); }

      const supportLabels = { '1': 'SpLD', '2': 'ID', '3': 'ASD', '4': 'ADHD', 'G': 'Giftedness', 'H': 'HI', 'E': 'EBD', '8': 'SLI', '9': 'MI', 'V': 'VI', 'P': 'PD', 'C': 'Career' };
      function renderSupportBadges(codes) {
        return codes.map(code => `<span class="support-badge" data-code="${code}" title="支援標記：${code} ${supportLabels[code]}">${code} ${supportLabels[code]}</span>`).join('');
      }
      function updateGameLibraryHeading() {
        if (activePathway) {
          if (activePathway === '1' && (activeStage === 'lower' || activeStage === 'upper' || activeStage === 'junior' || activeStage === 'senior')) {
            $('#supportKey').hidden = true;
            $('#gamesKicker').textContent = '專屬訓練 · 直接選關';
            const isUpperSpld = activeStage === 'upper';
            const isJuniorSpld = activeStage === 'junior';
            const isSeniorSpld = activeStage === 'senior';
            $('#gamesTitle').textContent = isSeniorSpld ? 'SpLD 讀寫策略｜高中 S4–S6' : isJuniorSpld ? 'SpLD 讀寫策略｜初中 S1–S3' : isUpperSpld ? 'SpLD 讀寫策略｜高小 P4–P6' : 'SpLD 讀寫策略｜初小 P1–P3';
            $('#stageGuide').textContent = isSeniorSpld ? '可直接選擇文言字義、通假字、論證、虛詞、學術詞彙及語病校對遊戲；原有 12 關基礎練習亦會保留。' : isJuniorSpld ? '可直接選擇篇章結構、邏輯銜接、修辭、主旨、詞彙及句法遊戲；原有 12 關基礎練習亦會保留。' : isUpperSpld ? '可直接選擇語素、句法等高小讀寫技能；原有 12 關基礎練習亦會保留，不需要先進入合併的讀寫闖關。' : '可直接選擇一項多感官讀寫遊戲；原有 12 關基礎練習亦會保留，不需要再先進入合併的讀寫實驗室。';
            return;
          }
          const primaryGame = getPrimaryPathwayGame();
          $('#supportKey').hidden = true;
          $('#gamesKicker').textContent = '專屬訓練模組';
          if (activePathway === '4') {
            $('#gamesTitle').textContent = `${pathwayLabels[activePathway]}｜${stageProfiles[activeStage].label}`;
            $('#stageGuide').textContent = '可直接選擇九項分級認知遊戲，或進入十關專注策略練習；兩種方式均只保留 ADHD 專屬內容，並可隨時休息或離開。';
            return;
          }
          if (activePathway === '3') {
            $('#gamesTitle').textContent = `${pathwayLabels[activePathway]}｜${stageProfiles[activeStage].label}`;
            $('#stageGuide').textContent = '可直接選擇 ASD 核心訓練、分齡社交探索或社交情境練習；目前學段的分齡選單會顯示兩項活動，所有活動均可先帶讀規則、隨時休息或離開。';
            return;
          }
          if (activePathway === '2') {
            $('#gamesTitle').textContent = `${pathwayLabels[activePathway]}｜${stageProfiles[activeStage].label}`;
            $('#stageGuide').textContent = activeStage === 'junior' || activeStage === 'senior' ? '可直接選擇 ID 核心訓練、兩組分齡生活遊戲及十關實用生活練習；初中涵蓋個人衛生、點數付款、工作步驟與日程，高中涵蓋職業安全、包裝、理貨與緊急求助。每項均提供廣東話旁白、大型操作區及溫和重試提示。' : '可直接選擇 ID 核心訓練及兩組分齡生活遊戲；初小涵蓋安全物件、制服角色、顏色配對與自理，高小涵蓋拍卡、圖示導航、硬幣付款與社區標示。每項均提供廣東話旁白、大型操作區及溫和重試提示。';
            return;
          }
          if (activePathway === 'V' || activePathway === 'P') {
            const label = activePathway === 'V' ? 'VI 視覺障礙' : 'PD 肢體傷殘';
            const focus = activePathway === 'V' ? '鍵盤優先、可選音訊、高對比、方向與螢幕閱讀策略' : '單鍵操作、掃描選取、Tab 導覽、節能及無障礙生活策略';
            $('#gamesTitle').textContent = `${label}｜${stageProfiles[activeStage].label}`;
            $('#stageGuide').textContent = `可直接選擇兩項${focus}練習。所有活動提供大型控制、鍵盤替代、可選旁白、可選音訊與減少動態設定；內容用於課堂策略練習，不作能力比較。`;
            return;
          }
          if (activePathway === '8' && (window.SLI_CORE_LAB || window.SLI_EIGHT_GAMES_LAB)) {
            const coreCount = window.SLI_CORE_LAB?.activityCards(activeStage).length || 0;
            const eightCount = window.SLI_EIGHT_GAMES_LAB?.activityCards(activeStage).length || 0;
            const count = coreCount + eightCount;
            const focus = activeStage === 'lower' ? '聲調聽辨、詞彙分類、因果複句及基本句型' : activeStage === 'upper' ? '字詞提取、故事敘事、說話準備、情緒語用及多步指示' : activeStage === 'junior' ? '成語隱喻、對話修補、潛台詞理解及理據組織' : '討論骨架、主持準備、面試表達及服務應變';
            $('#gamesKicker').textContent = '專屬訓練 · 直接選關';
            $('#gamesTitle').textContent = `${pathwayLabels[activePathway]}｜${stageProfiles[activeStage].label}`;
            $('#stageGuide').textContent = `可直接選擇 ${count} 項${focus}練習。每項均有教師帶讀準備頁、粵語朗讀、看提示、先停一停、換練習及隨時離開；錄音與回放均可選而且只留在裝置上，不會作聲調、流暢度、聲音或能力評定。`;
            return;
          }
          if (activePathway === 'G' && (window.GIFTED_2E_LAB || window.GIFTED_CROSS_SEN_LAB || window.GIFTED_EIGHT_GAMES_LAB)) {
            const coreCount = window.GIFTED_2E_LAB?.activityCards(activeStage).length || 0;
            const crossCount = window.GIFTED_CROSS_SEN_LAB?.activityCards(activeStage).length || 0;
            const giftedCount = window.GIFTED_EIGHT_GAMES_LAB?.activityCards(activeStage).length || 0;
            const count = coreCount + crossCount + giftedCount;
            const focus = activeStage === 'lower' ? '彈性建構、感官自主、選擇性焦點與概念表徵' : activeStage === 'upper' ? '多角度推理、規則設計、社交線索與空間記憶' : activeStage === 'junior' ? '情境觀點、修辭改寫、協作策略與社交線索' : '多元投入、價值反思、故事編輯與社區系統取捨';
            $('#gamesKicker').textContent = 'Giftedness／2e · 直接選關';
            $('#gamesTitle').textContent = `Giftedness｜${stageProfiles[activeStage].label}`;
            $('#stageGuide').textContent = `可直接選擇 ${count} 項${focus}課堂練習。Giftedness 專有活動、既有 2e 活動及跨 SEN 2e 支架均保持獨立；跨 SEN 標記只提示可選支架，不會混入其他 SEN 題庫。每項均有教師帶讀、可選粵語朗讀、看提示、先停一停、請教師一起看及隨時離開；不作診斷、治療、能力比較、排名或人生價值評分。`;
            return;
          }
          if ((activePathway === 'E' || activePathway === '9') && window.EBD_MI_CORE_LAB) {
            const track = activePathway === 'E' ? 'ebd' : 'mi';
            const count = window.EBD_MI_CORE_LAB.activityCards(track, activeStage).length;
            $('#gamesKicker').textContent = '專屬訓練 · 初小直接選關';
            $('#gamesTitle').textContent = `${activePathway === 'E' ? 'EBD 情緒與行為支持' : 'MI 情緒健康與溝通支持'}｜${stageProfiles[activeStage].label}`;
            $('#stageGuide').textContent = `可直接選擇 ${count} 項低壓情緒支持練習。每項均有教師帶讀、粵語朗讀、看提示、先停一停、需要成人支持及隨時離開；內容只供課堂覺察與溝通練習，不作診斷、治療或危機處理。`;
            return;
          }
          $('#gamesTitle').textContent = `${pathwayLabels[activePathway]}｜${primaryGame.title}`;
          $('#stageGuide').textContent = `目前是${stageProfiles[activeStage].label}。此區只保留本路線的 ${primaryGame.rounds.length} 關專屬訓練，不會顯示其他 SEN 類別或通用遊戲。`;
          return;
        }
        $('#supportKey').hidden = false;
        $('#gamesKicker').textContent = '一般活動';
        $('#gamesTitle').textContent = '選一個，現在開始';
        $('#stageGuide').textContent = `目前是${stageProfiles[activeStage].label}的一般活動：${stageProfiles[activeStage].guide.replace(/^目前是[^：]+：/, '')}`;
      }
      function renderGameLibrary(filter = activeFilter) {
        let source;
        if (activePathway) {
          source = activePathway === '1' && activeStage === 'lower' ? [getPrimaryPathwayGame(), ...spldP1StandaloneGames] : activePathway === '1' && activeStage === 'upper' ? [getPrimaryPathwayGame(), ...spldP4StandaloneGames] : activePathway === '1' && activeStage === 'junior' ? [getPrimaryPathwayGame(), ...spldS1StandaloneGames] : activePathway === '1' && activeStage === 'senior' ? [getPrimaryPathwayGame(), ...spldS4StandaloneGames] : activePathway === 'G' && (window.GIFTED_2E_LAB || window.GIFTED_CROSS_SEN_LAB || window.GIFTED_EIGHT_GAMES_LAB) ? [...(window.GIFTED_EIGHT_GAMES_LAB?.activityCards(activeStage) || []), ...(window.GIFTED_2E_LAB?.activityCards(activeStage) || []), ...(window.GIFTED_CROSS_SEN_LAB?.activityCards(activeStage) || [])] : activePathway === '8' && (window.SLI_CORE_LAB || window.SLI_EIGHT_GAMES_LAB) ? [...(window.SLI_CORE_LAB?.activityCards(activeStage) || []), ...(window.SLI_EIGHT_GAMES_LAB?.activityCards(activeStage) || [])] : activePathway === 'E' && window.EBD_MI_CORE_LAB ? window.EBD_MI_CORE_LAB.activityCards('ebd', activeStage) : activePathway === '9' && window.EBD_MI_CORE_LAB ? window.EBD_MI_CORE_LAB.activityCards('mi', activeStage) : [getPrimaryPathwayGame()];
        } else {
          source = filter === 'all' ? gameLibrary : filter.startsWith('support-') ? [] : gameLibrary.filter(game => game.category === filter);
        }
        const games = source.filter(Boolean).map(getStageGame);
        updateGameLibraryHeading();
        const isSpldP1DirectSelect = activePathway === '1' && activeStage === 'lower';
        const isSpldP4DirectSelect = activePathway === '1' && activeStage === 'upper';
        const isSpldS1DirectSelect = activePathway === '1' && activeStage === 'junior';
        const isSpldS4DirectSelect = activePathway === '1' && activeStage === 'senior';
        const isGifted2eDirectSelect = activePathway === 'G' && Boolean(window.GIFTED_2E_LAB || window.GIFTED_CROSS_SEN_LAB || window.GIFTED_EIGHT_GAMES_LAB);
        const isSliDirectSelect = activePathway === '8' && Boolean(window.SLI_CORE_LAB || window.SLI_EIGHT_GAMES_LAB);
        const isEbdMiDirectSelect = (activePathway === 'E' || activePathway === '9') && Boolean(window.EBD_MI_CORE_LAB);
        document.body.classList.toggle('spld-p1-direct-select', isSpldP1DirectSelect);
        document.body.classList.toggle('spld-p4-direct-select', isSpldP4DirectSelect);
        document.body.classList.toggle('spld-s1-direct-select', isSpldS1DirectSelect);
        document.body.classList.toggle('spld-s4-direct-select', isSpldS4DirectSelect);
        document.body.classList.toggle('gifted2e-direct-select', isGifted2eDirectSelect);
        document.body.classList.toggle('sli-direct-select', isSliDirectSelect);
        document.body.classList.toggle('ebd-mi-direct-select', isEbdMiDirectSelect);
        $('#gameGrid').classList.toggle('spld-primary-grid', isSpldP1DirectSelect || isSpldP4DirectSelect || isSpldS1DirectSelect || isSpldS4DirectSelect || isGifted2eDirectSelect || isSliDirectSelect || isEbdMiDirectSelect);
        const adhdDirectCard = activePathway === '4' ? `<button class="game-card adhd-graded-direct-card" type="button" data-adhd-graded-direct="true" data-tone="purple"><div class="game-visual" aria-hidden="true">🧠</div><h3>九項分級認知遊戲</h3><p>CPT、步進記憶、中央箭頭、規則切換、空間記憶、視覺搜尋、星球追蹤與反應抑制，按目前學段自動調整。</p><div class="support-badge-row" aria-label="ADHD 分級訓練內容"><span class="support-badge">直接選關</span><span class="support-badge">低壓短回合</span></div><span class="tag">${stageProfiles[activeStage].label} · 9 項遊戲</span></button>` : '';
        const adhdFifteenDirectCard = activePathway === '4' ? `<button class="game-card adhd-fifteen-direct-card" type="button" data-adhd-fifteen-direct="true" data-tone="purple"><div class="game-visual" aria-hidden="true">⚡</div><h3>ADHD 十五項啟動與自我管理練習</h3><p>按目前學段提供十五項啟動、專注、記憶、時間、規劃與情緒策略練習；每項均有八題、提示、暫停及可選朗讀。</p><div class="support-badge-row" aria-label="ADHD 十五項啟動與自我管理練習內容"><span class="support-badge">15 項直接選關</span><span class="support-badge">每項 8 題</span><span class="support-badge">無強制倒數</span></div><span class="tag">${stageProfiles[activeStage].label} · 15 項活動</span></button>` : '';
        const asdDirectCard = activePathway === '3' ? `<button class="game-card asd-core-direct-card" type="button" data-asd-core-direct="true" data-tone="teal"><div class="game-visual" aria-hidden="true">🤖</div><h3>五項 ASD 核心訓練</h3><p>情緒解碼、社交故事、一起看寶箱、細節與全圖轉換，以及安心感官小空間；按目前學段調整。</p><div class="support-badge-row" aria-label="ASD 核心訓練內容"><span class="support-badge">直接選關</span><span class="support-badge">教師帶讀</span><span class="support-badge">低壓短回合</span></div><span class="tag">${stageProfiles[activeStage].label} · 5 項遊戲</span></button>` : '';
        const asdEightDirectCard = activePathway === '3' ? `<button class="game-card asd-eight-direct-card" type="button" data-asd-eight-direct="true" data-tone="teal"><div class="game-visual" aria-hidden="true">🧭</div><h3>ASD 分齡社交探索</h3><p>本學段可直接玩兩項社交練習：初小眼神與情緒、高小讀心與距離、初中潛台詞與協作，或高中面試與應變；全程提供關卡、溫和計時與暫停。</p><div class="support-badge-row" aria-label="ASD 分齡社交探索內容"><span class="support-badge">直接選關</span><span class="support-badge">鍵盤操作</span><span class="support-badge">可選靜音</span></div><span class="tag">${stageProfiles[activeStage].label} · 2 項活動</span></button>` : '';
        const asdFifteenDirectCard = activePathway === '3' ? `<button class="game-card asd-fifteen-direct-card" type="button" data-asd-fifteen-direct="true" data-tone="teal"><div class="game-visual" aria-hidden="true">🌿</div><h3>ASD 十五項結構化練習</h3><p>按目前學段提供十五項社交線索、彈性思考、情緒調節、界線與自我倡導練習；每項均有八題、提示、暫停及可選朗讀。</p><div class="support-badge-row" aria-label="ASD 十五項結構化練習內容"><span class="support-badge">15 項直接選關</span><span class="support-badge">每項 8 題</span><span class="support-badge">不追蹤眼神</span></div><span class="tag">${stageProfiles[activeStage].label} · 15 項活動</span></button>` : '';
        const idDirectCard = activePathway === '2' ? `<button class="game-card id-core-direct-card" type="button" data-id-core-direct="true" data-tone="blue"><div class="game-visual" aria-hidden="true">🧺</div><h3>生活技能直接選關</h3><p>分類、付款、生活步驟、手眼協調與節奏模仿；${activeStage === 'junior' || activeStage === 'senior' ? '另有成人化茶餐廳打工模擬。' : '每次只做一個清楚小步驟。'}</p><div class="support-badge-row" aria-label="ID 核心訓練內容"><span class="support-badge">直接選關</span><span class="support-badge">超大操作</span><span class="support-badge">可選朗讀</span></div><span class="tag">${stageProfiles[activeStage].label} · ${activeStage === 'junior' || activeStage === 'senior' ? '6' : '5'} 項遊戲</span></button>` : '';
        const idEightDirectCard = activePathway === '2' ? `<button class="game-card id-eight-direct-card" type="button" data-id-eight-direct="true" data-tone="blue"><div class="game-visual" aria-hidden="true">🧩</div><h3>ID 分齡生活探索</h3><p>本學段提供兩項生活練習：初小顏色與自理、高小硬幣與標示、初中工作與日程，或高中理貨與緊急求助；全程配有廣東話旁白、大型操作區和可重試提示。</p><div class="support-badge-row" aria-label="ID 分齡生活探索內容"><span class="support-badge">直接選關</span><span class="support-badge">大型操作</span><span class="support-badge">廣東話旁白</span></div><span class="tag">${stageProfiles[activeStage].label} · 2 項活動</span></button>` : '';
        const idAdvancedDirectCard = activePathway === '2' ? `<button class="game-card id-advanced-direct-card" type="button" data-id-advanced-direct="true" data-tone="blue"><div class="game-visual" aria-hidden="true">🦺</div><h3>ID 安全與工作探索</h3><p>本學段提供兩項生活與職場安全練習：初小家居安全與制服求助、高小拍卡與圖示導航、初中洗頭與點數付款，或高中碎紙安全與禮品包裝；全程提供慢速旁白、大圖示和溫和重試。</p><div class="support-badge-row" aria-label="ID 安全與工作探索內容"><span class="support-badge">直接選關</span><span class="support-badge">安全步驟</span><span class="support-badge">可拖放或點選</span></div><span class="tag">${stageProfiles[activeStage].label} · 2 項活動</span></button>` : '';
        const idFifteenDirectCard = activePathway === '2' ? `<button class="game-card id-fifteen-direct-card" type="button" data-id-fifteen-direct="true" data-tone="blue"><div class="game-visual" aria-hidden="true">🌱</div><h3>ID 十五項功能生活練習</h3><p>按目前學段提供十五項具體生活、社區、安全、自理或職前練習；每一項均有八題、可選朗讀、提示與休息。</p><div class="support-badge-row" aria-label="ID 十五項功能生活練習內容"><span class="support-badge">15 項直接選關</span><span class="support-badge">每項 8 題</span><span class="support-badge">低壓可重試</span></div><span class="tag">${stageProfiles[activeStage].label} · 15 項活動</span></button>` : '';
        const sliFifteenDirectCard = activePathway === '8' ? `<button class="game-card sli-fifteen-direct-card" type="button" data-sli-fifteen-direct="true" data-tone="pink"><div class="game-visual" aria-hidden="true">🧠</div><h3>SLI 十五項語言支架練習</h3><p>按目前學段提供十五項詞彙、句構、敘事、語用與學術語言練習；每項均有八題、提示、暫停及可選朗讀。</p><div class="support-badge-row" aria-label="SLI 十五項語言支架練習內容"><span class="support-badge">15 項直接選關</span><span class="support-badge">每項 8 題</span><span class="support-badge">不要求錄音</span></div><span class="tag">${stageProfiles[activeStage].label} · 15 項活動</span></button>` : '';
        const miFifteenDirectCard = activePathway === '9' ? `<button class="game-card mi-fifteen-direct-card" type="button" data-mi-fifteen-direct="true" data-tone="purple"><div class="game-visual" aria-hidden="true">🛟</div><h3>MI 十五項情緒支持練習</h3><p>按目前學段提供十五項覺察、調節、思維彈性、支持與自我倡導練習；每項均有八題、朗讀、暫停及成人支持提示。</p><div class="support-badge-row" aria-label="MI 十五項情緒支持練習內容"><span class="support-badge">15 項直接選關</span><span class="support-badge">每項 8 題</span><span class="support-badge">非診斷支持</span></div><span class="tag">${stageProfiles[activeStage].label} · 15 項活動</span></button>` : '';
         const viDirectCard = activePathway === 'V' ? `<button class="game-card vi-direct-card" type="button" data-vi-direct="true" data-tone="purple"><div class="game-visual" aria-hidden="true">🦯</div><h3>VI 鍵盤與生活策略</h3><p>本學段提供兩項定向與螢幕閱讀練習：初小定向與盲打、高小環境聲與盲文、初中高速聽讀與聲音雷達，或高中港鐵導航與 DSE 查閱；可選音訊、高對比和全鍵盤操作。</p><div class="support-badge-row"><span class="support-badge">鍵盤優先</span><span class="support-badge">高對比</span><span class="support-badge">可選音訊</span></div><span class="tag">${stageProfiles[activeStage].label} · 2 項活動</span></button>` : '';
         const pdDirectCard = activePathway === 'P' ? `<button class="game-card pd-direct-card" type="button" data-pd-direct="true" data-tone="blue"><div class="game-visual" aria-hidden="true">♿</div><h3>PD 輔具與生活策略</h3><p>本學段提供兩項輔具與日常策略練習：初小單鍵與掃描、高小節能與無障礙路徑、初中自我倡導與停留選取，或高中智能家居與數碼職前技能；支援單鍵、Tab 和點按替代。</p><div class="support-badge-row"><span class="support-badge">單鍵替代</span><span class="support-badge">Tab 導覽</span><span class="support-badge">無強制倒數</span></div><span class="tag">${stageProfiles[activeStage].label} · 2 項活動</span></button>` : '';
        const hiEightDirectCard = activePathway === 'H' ? `<button class="game-card hi-eight-direct-card" type="button" data-hi-eight-direct="true" data-tone="teal"><div class="game-visual" aria-hidden="true">👂</div><h3>HI 視覺溝通探索</h3><p>本學段提供兩項視覺優先練習；初小另加入環境提示視覺站，以圖示、文字與可選震動示意認識安全下一步。全部音訊皆可選，視覺線索永遠保留。</p><div class="support-badge-row" aria-label="HI 視覺溝通探索內容"><span class="support-badge">直接選關</span><span class="support-badge">視覺優先</span><span class="support-badge">可選音訊</span></div><span class="tag">${stageProfiles[activeStage].label} · ${activeStage === 'lower' ? '3' : '2'} 項活動</span></button>` : '';
        const crossCategoryDirectCard = !activePathway && (filter === 'emotion' || filter === 'cognition') && window.CROSS_CATEGORY_STRATEGY_LAB ? `<button class="game-card cross-category-direct-card" type="button" data-cross-category="${filter}" data-tone="${filter === 'emotion' ? 'pink' : 'purple'}"><div class="game-visual" aria-hidden="true">${filter === 'emotion' ? '🤝' : '🧠'}</div><h3>${filter === 'emotion' ? '同理與協商工房' : '學習策略控制台'}</h3><p>${filter === 'emotion' ? '八個虛構情境，練習多角度理解、I-message、界線、修復與找支持。' : '八個虛構學習任務，練習難度預測、分塊、主旨提取、計劃、切換與修訂。'}</p><div class="support-badge-row"><span class="support-badge">8 張策略卡</span><span class="support-badge">跨類別支架</span><span class="support-badge">不作個人評分</span></div><span class="tag">${filter === 'emotion' ? '情緒社交' : '認知學習'} · 八回合</span></button>` : '';
        $('#gameGrid').innerHTML = crossCategoryDirectCard + asdFifteenDirectCard + asdDirectCard + asdEightDirectCard + adhdFifteenDirectCard + adhdDirectCard + idFifteenDirectCard + idDirectCard + idEightDirectCard + idAdvancedDirectCard + sliFifteenDirectCard + miFifteenDirectCard + hiEightDirectCard + viDirectCard + pdDirectCard + games.map(game => {
          const badges = activePathway ? renderSupportBadges(game.supports) : '<span class="support-badge">一般活動</span>';
          const label = activePathway ? '本專屬模組類別' : '一般活動類別';
          const directActivity = game.ebdMiActivity ? ` data-ebdmi-track="${game.ebdMiTrack}" data-ebdmi-activity="${game.ebdMiActivity}"` : game.giftedEightActivity ? ` data-gifted-eight-activity="${game.giftedEightActivity}"` : game.gifted2eActivity ? ` data-gifted2e-activity="${game.gifted2eActivity}"` : game.giftedCrossActivity ? ` data-gifted-cross-activity="${game.giftedCrossActivity}"` : game.sliEightActivityKey ? ` data-sli-eight-activity="${game.sliEightActivityKey}"` : game.sliActivityKey ? ` data-sli-activity="${game.sliActivityKey}"` : game.lab === 'p4' ? ` data-spld-p4-activity="${game.p4ActivityKey}"` : game.lab === 's1' ? ` data-spld-s1-activity="${game.s1ActivityKey}"` : game.lab === 's4' ? ` data-spld-s4-activity="${game.s4ActivityKey}"` : game.activityKey ? ` data-spld-activity="${game.activityKey}"` : '';
          return `<button class="game-card" type="button" data-game-id="${game.id}"${directActivity} data-tone="${game.tone}"><div class="game-visual" aria-hidden="true">${game.icon}</div><h3>${game.title}</h3><p>${game.description}</p><div class="support-badge-row" aria-label="${label}">${badges}</div><span class="tag">${game.tag}</span></button>`;
        }).join('');
        $$('.game-card').forEach(card => card.addEventListener('click', () => {
          if (card.dataset.adhdGradedDirect) {
            if (!window.ADHD_GRADED_LAB) { showToast('分級認知訓練室正在準備中，請稍後再試。'); return; }
            window.ADHD_GRADED_LAB.open({ stage: activeStage, onComplete: recordAdhdLabResult });
            return;
          }
          if (card.dataset.adhdFifteenDirect) {
            if (!window.ADHD_FIFTEEN_CATALOGUE_LAB) { showToast('ADHD 十五項啟動與自我管理練習正在準備中，請稍後再試。'); return; }
            window.ADHD_FIFTEEN_CATALOGUE_LAB.open({ stage: activeStage, onComplete: recordAdhdLabResult, trigger: card });
            return;
          }
          if (card.dataset.asdCoreDirect) {
            if (!window.ASD_CORE_LAB) { showToast('ASD 核心訓練室正在準備中，請稍後再試。'); return; }
            window.ASD_CORE_LAB.open({ stage: activeStage, onComplete: recordAsdLabResult });
            return;
          }
          if (card.dataset.asdEightDirect) {
            if (!window.ASD_EIGHT_GAMES_LAB) { showToast('ASD 分齡社交遊戲正在準備中，請稍後再試。'); return; }
            window.ASD_EIGHT_GAMES_LAB.open({ stage: activeStage, onComplete: recordAsdLabResult, trigger: card });
            return;
          }
          if (card.dataset.asdFifteenDirect) {
            if (!window.ASD_FIFTEEN_CATALOGUE_LAB) { showToast('ASD 十五項結構化練習正在準備中，請稍後再試。'); return; }
            window.ASD_FIFTEEN_CATALOGUE_LAB.open({ stage: activeStage, onComplete: recordAsdLabResult, trigger: card });
            return;
          }
          if (card.dataset.idCoreDirect) {
            if (!window.ID_CORE_LAB) { showToast('ID 生活技能訓練室正在準備中，請稍後再試。'); return; }
            window.ID_CORE_LAB.open({ stage: activeStage, onComplete: recordIdLabResult });
            return;
          }
          if (card.dataset.idEightDirect) {
            if (!window.ID_EIGHT_GAMES_LAB) { showToast('ID 分齡生活遊戲正在準備中，請稍後再試。'); return; }
            window.ID_EIGHT_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: card });
            return;
          }
          if (card.dataset.idAdvancedDirect) {
            if (!window.ID_ADVANCED_GAMES_LAB) { showToast('ID 安全與工作遊戲正在準備中，請稍後再試。'); return; }
            window.ID_ADVANCED_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: card });
            return;
          }
          if (card.dataset.idFifteenDirect) {
            if (!window.ID_FIFTEEN_CATALOGUE_LAB) { showToast('ID 十五項功能生活練習正在準備中，請稍後再試。'); return; }
            window.ID_FIFTEEN_CATALOGUE_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: card });
            return;
          }
          if (card.dataset.sliFifteenDirect) {
            if (!window.SLI_FIFTEEN_CATALOGUE_LAB) { showToast('SLI 十五項語言支架練習正在準備中，請稍後再試。'); return; }
            window.SLI_FIFTEEN_CATALOGUE_LAB.open({ stage: activeStage, onComplete: recordSliLabResult, trigger: card });
            return;
          }
          if (card.dataset.miFifteenDirect) {
            if (!window.MI_FIFTEEN_CATALOGUE_LAB) { showToast('MI 十五項情緒支持練習正在準備中，請稍後再試。'); return; }
            window.MI_FIFTEEN_CATALOGUE_LAB.open({ stage: activeStage, onComplete: recordEbdMiLabResult, trigger: card });
            return;
          }
          if (card.dataset.hiEightDirect) {
            if (!window.HI_EIGHT_GAMES_LAB) { showToast('HI 分齡視覺聆聽遊戲正在準備中，請稍後再試。'); return; }
            window.HI_EIGHT_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: card });
            return;
          }
          if (card.dataset.viDirect) {
            if (!window.VI_GAMES_LAB) { showToast('VI 遊戲正在準備中，請稍後再試。'); return; }
            window.VI_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: card });
            return;
          }
          if (card.dataset.pdDirect) {
            if (!window.PD_GAMES_LAB) { showToast('PD 遊戲正在準備中，請稍後再試。'); return; }
            window.PD_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: card });
            return;
          }
          if (card.dataset.crossCategory) {
            window.CROSS_CATEGORY_STRATEGY_LAB?.open(card.dataset.crossCategory, { stage: activeStage, trigger: card });
            return;
          }
          if (card.dataset.gifted2eActivity) {
            if (!window.GIFTED_2E_LAB) { showToast('資優／2e 課堂練習正在準備中，請稍後再試。'); return; }
            window.GIFTED_2E_LAB.openActivity(card.dataset.gifted2eActivity, { stage: activeStage, onComplete: recordGifted2eLabResult, trigger: card });
            return;
          }
          if (card.dataset.giftedCrossActivity) {
            if (!window.GIFTED_CROSS_SEN_LAB) { showToast('跨 SEN 資優／2e 課堂練習正在準備中，請稍後再試。'); return; }
            window.GIFTED_CROSS_SEN_LAB.openActivity(card.dataset.giftedCrossActivity, { stage: activeStage, onComplete: recordGifted2eLabResult, trigger: card });
            return;
          }
          if (card.dataset.giftedEightActivity) {
            if (!window.GIFTED_EIGHT_GAMES_LAB) { showToast('Giftedness 課堂練習正在準備中，請稍後再試。'); return; }
            window.GIFTED_EIGHT_GAMES_LAB.openActivity(card.dataset.giftedEightActivity, { stage: activeStage, onComplete: recordGifted2eLabResult, trigger: card });
            return;
          }
          if (card.dataset.sliEightActivity) {
            if (!window.SLI_EIGHT_GAMES_LAB) { showToast('SLI 課堂練習正在準備中，請稍後再試。'); return; }
            window.SLI_EIGHT_GAMES_LAB.openActivity(card.dataset.sliEightActivity, { stage: activeStage, onComplete: recordSliLabResult, trigger: card });
            return;
          }
          if (card.dataset.sliActivity) {
            if (!window.SLI_CORE_LAB) { showToast('SLI 言語訓練室正在準備中，請稍後再試。'); return; }
            window.SLI_CORE_LAB.openActivity(card.dataset.sliActivity, { stage: activeStage, onComplete: recordSliLabResult, trigger: card });
            return;
          }
          if (card.dataset.ebdmiActivity) {
            if (!window.EBD_MI_CORE_LAB) { showToast('EBD／MI 情緒支持練習正在準備中，請稍後再試。'); return; }
            window.EBD_MI_CORE_LAB.openActivity(card.dataset.ebdmiTrack, card.dataset.ebdmiActivity, { stage: activeStage, onComplete: recordEbdMiLabResult, trigger: card });
            return;
          }
          if (card.dataset.spldActivity) {
            window.SPLD_P1_LAB?.openActivity(card.dataset.spldActivity);
            return;
          }
          if (card.dataset.spldP4Activity) {
            window.SPLD_P4_LAB?.openActivity(card.dataset.spldP4Activity);
            return;
          }
          if (card.dataset.spldS1Activity) {
            window.SPLD_S1_LAB?.openActivity(card.dataset.spldS1Activity, card);
            return;
          }
          if (card.dataset.spldS4Activity) {
            window.SPLD_S4_LAB?.openActivity(card.dataset.spldS4Activity, card);
            return;
          }
          startGame(card.dataset.gameId);
        }));
      }
      function updateTokenBoard() {
        $$('.token').forEach((token, index) => token.classList.toggle('earned', index < tokenCount));
      }
      function addToken(amount = 1, announce = true) {
        const previous = tokenCount;
        tokenCount = Math.max(0, Math.min(5, tokenCount + amount));
        updateTokenBoard();
        if (announce && tokenCount > previous) { makeTone(660 + tokenCount * 35, .18, .04); showToast(tokenCount === 5 ? '太好了！集齊 5 顆星。' : '做得好，亮起一顆星！'); }
      }
      function updateDashboardProgress() {
        const number = completedGames.size;
        $('#gamesComplete').textContent = number;
        $('#gamesCompleteText').textContent = number;
        $('#progressRing').style.setProperty('--p', `${number * 36}deg`);
        $('#completionBar').style.width = `${number * 10}%`;
      }

      function showDashboard() {
        clearTimeout(autoAdvanceTimer); clearAdhdTimer();
        $('#gameView').classList.add('hidden');
        $('#dashboardView').classList.remove('hidden');
        activeGame = null;
        $$('.side-link').forEach(link => link.classList.toggle('active', link.dataset.nav === 'dashboard'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      function startGame(id) {
        triggerHaptic('tap');
        clearTimeout(autoAdvanceTimer);
        activeGame = getStageGame(gameMap[id]);
        if (activeGame?.id === 'pathway-adhd') resetAdhdSession(); else { clearAdhdTimer(); adhdSession = null; }
        if (activeGame?.id === 'pathway-asd') resetAsdProgress(); else asdProgress = null;
        roundIndex = 0;
        $('#dashboardView').classList.add('hidden');
        $('#gameView').classList.remove('hidden');
        $$('.side-link').forEach(link => link.classList.remove('active'));
        renderStage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      function currentRound() { return activeGame.rounds[roundIndex]; }
      function renderStage() {
        if (!activeGame) return;
        if (ebdMissionKeyHandler) { document.removeEventListener('keydown', ebdMissionKeyHandler); ebdMissionKeyHandler = null; }
        if (stageEscapeHandler) { document.removeEventListener('keydown', stageEscapeHandler); stageEscapeHandler = null; }
        stageEscapeHandler = (event) => { if (event.key === 'Escape') { event.preventDefault(); showDashboard(); } };
        document.addEventListener('keydown', stageEscapeHandler);
        const round = currentRound();
        gameState = { locked: false, selectedSequence: [], fruitCount: 0, pathStep: 0, memoryOpen: [], memoryMatched: [] };
        startAdhdRound();
        $('#stageCategory').textContent = activeGame.categoryName;
        $('#stageLevel').textContent = stageProfiles[activeStage].label;
        $('#stageTitle').textContent = activeGame.title;
        $('#stageDescription').textContent = activeGame.description;
        const isDedicatedModule = activeGame.id === 'spld' || activeGame.id.startsWith('pathway-');
        $('#stageSupport').innerHTML = isDedicatedModule ? renderSupportBadges(activeGame.supports) : '<span class="support-badge">一般活動</span>';
        $('#roundNumber').textContent = `${roundIndex + 1} / ${activeGame.rounds.length}`;
        $('#roundDots').innerHTML = activeGame.rounds.map((_, index) => `<span class="round-dot ${index < roundIndex ? 'done' : index === roundIndex ? 'current' : ''}"></span>`).join('');
        renderAdhdDashboard();
        renderAsdExportPanel();
        const activity = $('#activityCard');
        activity.innerHTML = renderActivity(activeGame.id, round);
        bindActivity(activeGame.id, round);
        $('#stageTitle').focus({ preventScroll: true });
        speak(activeGame.id === 'spld' ? getSpldReadText(round) : getInstruction(activeGame.id, round));
      }
      function stageFrame(prompt, content, footer = true, feedbackText = '需要時可按「提示」，或再聽一次指令。') {
        return `<div class="prompt-label">一起試一試</div><div class="activity-prompt">${prompt}</div>${content}<div class="feedback" id="gameFeedback" role="status" aria-live="polite" aria-atomic="true">${feedbackText}</div>${footer ? `<div class="stage-footer"><button class="hint-button" id="hintButton" type="button">💡 聽解題提示</button><button class="hint-button" id="repeatButton" type="button">🔊 再聽一次</button></div>` : ''}`;
      }
      function renderActivity(id, round) {
        if (id === 'pathway-asd') {
          const strategy = `<aside class="asd-strategy" aria-label="社交策略卡"><span class="asd-strategy-label">社交策略卡</span><strong>${round.strategy}</strong><small>可以先看策略卡，再選擇最合適的回應。</small></aside>`;
          return stageFrame(`<span class="asd-band">${round.band}</span><br>${round.prompt}`, `<article class="scenario-context">${round.context}</article>${strategy}<div class="answer-grid">${round.choices.map(([emoji, label]) => `<button class="answer-card" type="button" data-answer="${escapeHTML(label)}"><span class="big-emoji">${emoji}</span><span class="caption">${escapeHTML(label)}</span></button>`).join('')}</div>`, true, '先看看綠色「社交策略卡」，再選擇最合適的回應。');
        }
        if (id === 'pathway-id') {
          const guide = `<aside class="id-life-guide" aria-label="生活小步驟卡"><span class="id-life-guide-label">生活小步驟卡</span><strong>先看情境，再選安全、實用和有禮貌的下一步。</strong><small>每次只做一小步；不確定時，可以用清楚句子向可信任的大人求助。</small></aside>`;
          return stageFrame(`<span class="id-band">${round.band}</span><br>${round.prompt}`, `<article class="scenario-context">${round.context}</article>${guide}<div class="answer-grid">${round.choices.map(([emoji, label]) => `<button class="answer-card" type="button" data-answer="${escapeHTML(label)}"><span class="big-emoji">${emoji}</span><span class="caption">${escapeHTML(label)}</span></button>`).join('')}</div>`, true, '先看看藍色「生活小步驟卡」，再選擇下一步。');
        }
        if (id === 'pathway-gifted') {
          const guide = `<aside class="gifted-guide" aria-label="解難策略卡"><span class="gifted-guide-label">解難策略卡</span><strong>${round.strategy}</strong><small>可先找規律、列出條件或比較證據，再檢查自己的推論。</small></aside>`;
          return stageFrame(`<span class="gifted-band">${round.band}</span><br>${round.prompt}`, `<article class="scenario-context">${round.context}</article>${guide}<div class="answer-grid">${round.choices.map(([emoji, label]) => `<button class="answer-card" type="button" data-answer="${escapeHTML(label)}"><span class="big-emoji">${emoji}</span><span class="caption">${escapeHTML(label)}</span></button>`).join('')}</div>`, true, '先看看紫色「解難策略卡」，再選擇最合條件的答案。');
        }
        if (id === 'pathway-hi') {
          const guide = `<aside class="hi-visual-guide" aria-label="視覺溝通卡"><span class="hi-visual-guide-label">視覺溝通卡</span><strong>${round.strategy}</strong><small>用圖示、表情、手勢或文字確認資訊；不確定時可要求再指一次或寫下來。</small></aside>`;
          return stageFrame(`<span class="hi-band">${round.band}</span><br>${round.prompt}`, `<article class="scenario-context">${round.context}</article>${guide}<div class="answer-grid">${round.choices.map(([emoji, label]) => `<button class="answer-card" type="button" data-answer="${escapeHTML(label)}"><span class="big-emoji">${emoji}</span><span class="caption">${escapeHTML(label)}</span></button>`).join('')}</div>`, true, '先看青藍色「視覺溝通卡」，再從圖示或表情線索選擇答案。');
        }
        if (id === 'pathway-ebd') {
          const regulation = `<aside class="ebd-regulation" aria-label="自我調節卡"><span class="ebd-regulation-label">自我調節卡</span><strong>${round.strategy}</strong><small>先看這張策略卡，再從虛構情境的三張下一步卡選一張。這不是對任何人的行為或情緒評定。</small></aside>`;
          const mission = `<div class="ebd-route-board"><div class="ebd-route-target" data-ebd-route-target tabindex="0" aria-label="安全下一步任務格。可把一張下一步卡拖到這裡，也可以直接點選卡片或按數字鍵一至三。"><span aria-hidden="true">🧭</span><b>安全下一步</b><small>拖放一張卡到這裡</small></div><div class="ebd-route-cards">${round.choices.map(([emoji, label], index) => `<button class="answer-card ebd-route-card" type="button" draggable="true" data-sen-drag-source data-answer="${escapeHTML(label)}" aria-label="選項 ${index + 1}：${escapeHTML(label)}。可直接點選或拖到安全下一步任務格。"><span class="big-emoji">${emoji}</span><span class="caption"><b>${index + 1}</b>　${escapeHTML(label)}</span></button>`).join('')}</div></div>`;
          return stageFrame(`<span class="ebd-band">${round.band}</span><br>${round.prompt}`, `<article class="scenario-context">${round.context}</article>${regulation}${mission}`, true, '慢慢選一張安全下一步卡；可點選、拖放或按數字鍵 1 至 3。');
        }
        if (id.startsWith('pathway-')) {
          return stageFrame(round.prompt, `<article class="scenario-context">${round.context}</article><div class="answer-grid">${round.choices.map(([emoji, label]) => `<button class="answer-card" type="button" data-answer="${escapeHTML(label)}"><span class="big-emoji">${emoji}</span><span class="caption">${escapeHTML(label)}</span></button>`).join('')}</div>`);
        }
        if (id === 'spld') {
          const reading = round.context ? `<article class="spld-reading">${round.context}</article>` : '';
          const tracker = getSpldReadingTracker(round);
          const controls = `<div class="spld-read-controls" aria-label="SpLD 朗讀控制"><button class="spld-read-button" id="spldReadPrompt" type="button">🔊 朗讀題目</button><button class="spld-read-button" id="spldReadHint" type="button">🐢 慢讀提示</button><button class="spld-read-button" id="spldReadChoices" type="button">🔉 朗讀選項</button></div>`;
          const visual = getSpldVisualCue(round);
          const hint = `<aside class="spld-hint" aria-label="解題小提示"><span class="spld-hint-label">解題小提示</span><strong>${round.clue}</strong><small>提示已經顯示在這裏；需要時可按「慢讀提示」再聽一次。</small></aside>`;
          return stageFrame(`<span class="spld-band">${round.band}</span><br>${round.prompt}`, `${reading}${tracker}<div class="spld-focus">讀寫焦點：${round.band}</div>${controls}${visual}${hint}<div class="spld-choice-grid">${round.choices.map(choice => `<button class="spld-answer" type="button" data-answer="${choice}">${choice}</button>`).join('')}</div>`, true, '先看紫色視覺步驟，再慢讀關鍵詞和選項。');
        }
        if (id === 'emotion') {
          return stageFrame(`找出和這張一樣的心情：<span class="sr-only">${round.word}</span>`, `<div class="match-target" aria-label="目標表情 ${round.word}">${round.target}</div><div class="answer-grid">${round.choices.map(([emoji, label]) => `<button class="answer-card" type="button" data-answer="${label}"><span class="big-emoji">${emoji}</span><span class="caption">${label}</span></button>`).join('')}</div>`);
        }
        if (id === 'colour') {
          return stageFrame(`把「${round.name}」放到${round.label}盒。`, `<div class="sort-scene"><div class="sort-item" draggable="true" data-sort-item data-sen-drag-source tabindex="0" aria-label="${round.name}，可拖到顏色盒，也可直接按顏色盒">${round.item}</div><div class="basket-row"><button class="basket red" type="button" data-colour="red" data-sen-drop-zone="colour"><span class="basket-emoji">🧺</span>紅色盒</button><button class="basket yellow" type="button" data-colour="yellow" data-sen-drop-zone="colour"><span class="basket-emoji">🧺</span>黃色盒</button><button class="basket blue" type="button" data-colour="blue" data-sen-drop-zone="colour"><span class="basket-emoji">🧺</span>藍色盒</button></div></div>`);
        }
        if (id === 'routine') {
          return stageFrame(`把「${round.title}」的三個步驟放進小火車。`, `<div class="sequence-board"><div class="sequence-slots" id="sequenceSlots">${[1, 2, 3].map(index => `<div class="sequence-slot" data-sequence-slot="${index - 1}" data-sen-drop-zone="routine"><span class="slot-number">${index}</span><span>第 ${index} 步</span></div>`).join('')}</div><div class="sequence-options" id="sequenceOptions">${shuffle(round.cards).map(([emoji, label], index) => `<button class="sequence-card" type="button" data-index="${index}" data-emoji="${emoji}" data-label="${label}" draggable="true" data-sen-drag-source><span>${emoji}</span>${label}</button>`).join('')}</div></div>`);
        }
        if (id === 'listen') {
          return stageFrame(round.listenText || '按喇叭聽一聽，再點選正確圖片。', `<button class="listen-orb" id="listenButton" type="button" aria-label="播放詞語">🔊</button><div class="answer-grid">${round.choices.map(([emoji, label]) => `<button class="answer-card" type="button" data-answer="${label}"><span class="big-emoji">${emoji}</span><span class="caption">${label}</span></button>`).join('')}</div>`);
        }
        if (id === 'fruit') {
          const itemEmoji = round.itemEmoji || '🍎'; const itemLabel = round.itemLabel || '蘋果';
          return stageFrame(`購物清單：請拿 <strong>${round.count}</strong> 個${itemLabel}。每次拿一個，慢慢數。`, `<div class="counter-layout"><button class="fruit-button" id="fruitButton" type="button" aria-label="加入一個${itemLabel}">${itemEmoji}</button><div class="bag-panel"><div class="bag" id="fruitBag"></div><div class="count-number" id="fruitCount">0 個${itemLabel}</div><div class="count-actions"><button class="minus-button" id="minusFruit" type="button">− 拿走一個</button><button class="done-button" id="checkFruit" type="button">剛剛好</button></div></div></div>`);
        }
        if (id === 'signal') {
          const active = round.light;
          return stageFrame(round.prompt, `<div class="signal" aria-label="${active === 'red' ? '紅燈' : '綠燈'}"><div class="signal-light ${active === 'red' ? 'active red' : ''}"></div><div class="signal-light ${active === 'green' ? 'active green' : ''}"></div></div><div class="choice-pill-row"><button class="choice-pill stop" type="button" data-answer="停一停"><b>✋</b>停一停</button><button class="choice-pill go" type="button" data-answer="可以走"><b>▶</b>可以走</button></div>`);
        }
        if (id === 'turn') {
          return stageFrame(`玩具正傳給誰？請找出「${round.person}」。`, `<div class="turn-stage">${round.people.map(([emoji, name]) => `<button class="turn-person ${name === round.person ? 'focused' : ''}" type="button" data-answer="${name}"><span class="avatar">${emoji}</span>${name}<span class="turn-arrow">↑ 輪到你</span></button>`).join('')}</div>`);
        }
        if (id === 'memory') {
          const cards = shuffle(round.cards.map((emoji, index) => ({ emoji, key: `${emoji}-${index}` })));
          gameState.memoryCards = cards;
          return stageFrame('翻開兩張一樣的寶盒卡。', `<div class="memory-board" id="memoryBoard">${cards.map((card, index) => `<button class="memory-card" type="button" data-index="${index}" aria-label="寶盒卡 ${index + 1}">?</button>`).join('')}</div>`);
        }
        if (id === 'weather') {
          return stageFrame(`今天是「${round.label}」，帶甚麼最合適？`, `<div class="weather-display" aria-label="${round.label}">${round.weather}</div><div class="answer-grid">${round.choices.map(([emoji, label]) => `<button class="answer-card" type="button" data-answer="${label}"><span class="big-emoji">${emoji}</span><span class="caption">${label}</span></button>`).join('')}</div>`);
        }
        if (id === 'path') {
          return stageFrame(round.prompt || '跟著小路選方向，帶小朋友平安回家。', `<div class="path-board" id="pathBoard"></div><div class="path-buttons"><button class="path-button" type="button" data-direction="左轉"><span>←</span>左轉</button><button class="path-button" type="button" data-direction="直走"><span>↑</span>直走</button><button class="path-button" type="button" data-direction="右轉"><span>→</span>右轉</button></div>`);
        }
        return '';
      }
      function getInstruction(id, round) {
        if (id.startsWith('pathway-')) return round.instruction || round.prompt;
        const texts = {
          spld: round.instruction, emotion: `請找出和這張一樣的心情：${round.word}。`, colour: `把${round.name}放進${round.label}盒。`, routine: `請把${round.title}的三個步驟放進小火車。`, listen: round.listenText || `請聽一聽，找出${round.word}。`, fruit: `請拿${round.count}個${round.itemLabel || '蘋果'}。每次拿一個，慢慢數。`, signal: round.prompt, turn: `現在輪到誰？請找出${round.person}。`, memory: '翻開兩張一樣的寶盒卡。', weather: `今天是${round.label}，帶甚麼最合適？`, path: round.prompt || '跟著小路選方向，帶小朋友平安回家。'
        };
        return texts[id] || '';
      }
      function bindCommon(round) {
        $('#hintButton')?.addEventListener('click', () => showHint(activeGame.id, round));
        $('#repeatButton')?.addEventListener('click', () => speak(getInstruction(activeGame.id, round)));
      }
      function bindActivity(id, round) {
        bindCommon(round);
        if (id === 'pathway-ebd') { bindEbdMission(round); return; }
        if (id.startsWith('pathway-')) { $$('.answer-card').forEach(button => button.addEventListener('click', () => evaluate(button, button.dataset.answer === round.answer, button.dataset.answer === round.answer ? round.success : round.clue))); return; }
        if (id === 'spld') {
          $('#spldReadPrompt')?.addEventListener('click', () => speak(getSpldReadText(round), .72));
          $('#spldReadHint')?.addEventListener('click', () => readSpldHint(round));
          $('#spldReadChoices')?.addEventListener('click', () => speak(`選項。${round.choices.map((choice, index) => `第 ${index + 1} 項：${stripMarkup(choice)}`).join('。')}`, .68));
          $$('.spld-answer').forEach(button => button.addEventListener('click', () => {
            if (gameState.locked) return;
            $$('.spld-answer').forEach(card => card.classList.remove('selected'));
            button.classList.add('selected');
            const correct = button.dataset.answer === round.answer;
            button.classList.add(correct ? 'correct' : 'wrong');
            if (correct) { success(round.success); } else {
              const hint = $('.spld-hint'); hint?.classList.add('attention'); setTimeout(() => hint?.classList.remove('attention'), 1200);
              failure('先看黃色提示卡，然後再試一次。'); readSpldHint(round);
            }
          }));
        }
        if (id === 'emotion' || id === 'listen' || id === 'weather') {
          $$('.answer-card').forEach(button => button.addEventListener('click', () => evaluate(button, button.dataset.answer === (id === 'emotion' ? round.answer : id === 'listen' ? round.word : round.answer), button.dataset.answer)));
          if (id === 'listen') $('#listenButton').addEventListener('click', () => speak(round.listenText || round.word));
        }
        if (id === 'colour') {
          const chooseColour = (button) => evaluate(button, button.dataset.colour === round.color, button.dataset.colour === round.color ? `${round.name}找到了${round.label}盒。` : '這個盒子的顏色不一樣。');
          const item = $('[data-sort-item]');
          item?.addEventListener('dragstart', (event) => { try { event.dataTransfer?.setData('text/plain', round.name); } catch {} });
          $$('.basket').forEach((button) => { button.addEventListener('click', () => chooseColour(button)); button.addEventListener('dragover', (event) => event.preventDefault()); button.addEventListener('drop', (event) => { event.preventDefault(); chooseColour(button); }); });
        }
        if (id === 'routine') {
          let draggedCard = null;
          const chooseSequence = (button) => {
            if (gameState.locked || button.disabled) return;
            gameState.selectedSequence.push([button.dataset.emoji, button.dataset.label]); button.disabled = true;
            renderSequenceSlots();
            if (gameState.selectedSequence.length === 3) {
              const correct = gameState.selectedSequence.every((card, index) => card[1] === round.cards[index][1]);
              if (correct) success('步驟排得很好！你記得了整個流程。'); else failure('我們一起看看哪一步要先做。按提示後再試一次。', () => renderStage());
            }
          };
          $$('.sequence-card').forEach((button) => { button.addEventListener('click', () => chooseSequence(button)); button.addEventListener('dragstart', (event) => { draggedCard = button; try { event.dataTransfer?.setData('text/plain', button.dataset.label); } catch {} }); button.addEventListener('dragend', () => { draggedCard = null; }); });
          $$('[data-sequence-slot]').forEach((slot) => { slot.addEventListener('dragover', (event) => event.preventDefault()); slot.addEventListener('drop', (event) => { event.preventDefault(); const next = gameState.selectedSequence.length; if (Number(slot.dataset.sequenceSlot) !== next) { $('#gameFeedback').className = 'feedback try'; $('#gameFeedback').textContent = `先放到第 ${next + 1} 步。`; return; } if (draggedCard) chooseSequence(draggedCard); draggedCard = null; }); });
        }
        if (id === 'fruit') {
          $('#fruitButton').addEventListener('click', () => { if (gameState.locked) return; gameState.fruitCount = Math.min(6, gameState.fruitCount + 1); renderFruit(); makeTone(540, .07, .015); });
          $('#minusFruit').addEventListener('click', () => { if (gameState.locked) return; gameState.fruitCount = Math.max(0, gameState.fruitCount - 1); renderFruit(); });
          $('#checkFruit').addEventListener('click', () => { evaluate($('#checkFruit'), gameState.fruitCount === round.count, gameState.fruitCount === round.count ? '剛剛好！你數得很仔細。' : `再數一次，現在有 ${gameState.fruitCount} 個。`); });
          renderFruit();
        }
        if (id === 'signal') { $$('.choice-pill').forEach(button => button.addEventListener('click', () => evaluate(button, button.dataset.answer === round.answer, button.dataset.answer === round.answer ? '你看得很仔細，這是一個安全的選擇。' : '再看看交通燈的顏色。'))); }
        if (id === 'turn') { $$('.turn-person').forEach(button => button.addEventListener('click', () => evaluate(button, button.dataset.answer === round.person, button.dataset.answer === round.person ? `對了，現在輪到${round.person}。` : '看看哪一位角色上面有箭頭。'))); }
        if (id === 'memory') { $$('.memory-card').forEach(button => button.addEventListener('click', () => handleMemory(Number(button.dataset.index)))); }
        if (id === 'path') { $$('.path-button').forEach(button => button.addEventListener('click', () => handlePath(button.dataset.direction, round))); renderPath(round); }
      }
      function bindEbdMission(round) {
        let draggedCard = null;
        const target = $('[data-ebd-route-target]');
        const choose = (button) => {
          if (!button || gameState.locked) return;
          const correct = button.dataset.answer === round.answer;
          if (correct && target) {
            target.classList.add('is-filled');
            target.innerHTML = `<span aria-hidden="true">✓</span><b>已選安全下一步</b><small>${escapeHTML(button.dataset.answer)}</small>`;
          }
          evaluate(button, correct, correct ? round.success : round.clue);
        };
        $$('.ebd-route-card').forEach((button) => {
          button.addEventListener('click', () => choose(button));
          button.addEventListener('dragstart', (event) => { draggedCard = button; try { event.dataTransfer?.setData('text/plain', button.dataset.answer); } catch {} button.classList.add('is-dragging'); target?.classList.add('is-ready'); });
          button.addEventListener('dragend', () => { button.classList.remove('is-dragging'); target?.classList.remove('is-ready'); draggedCard = null; });
        });
        target?.addEventListener('dragover', (event) => { event.preventDefault(); target.classList.add('is-ready'); });
        target?.addEventListener('dragleave', () => target.classList.remove('is-ready'));
        target?.addEventListener('drop', (event) => { event.preventDefault(); target.classList.remove('is-ready'); choose(draggedCard); draggedCard = null; });
        ebdMissionKeyHandler = (event) => {
          if (!/^[1-3]$/.test(event.key)) return;
          if (!document.body.contains(target) || activeGame?.id !== 'pathway-ebd') return;
          const card = $$('.ebd-route-card')[Number(event.key) - 1];
          if (card && !card.disabled) { event.preventDefault(); choose(card); }
        };
        document.addEventListener('keydown', ebdMissionKeyHandler);
      }
      function renderSequenceSlots() { $$('.sequence-slot').forEach((slot, index) => { const entry = gameState.selectedSequence[index]; if (entry) { slot.classList.add('filled'); slot.innerHTML = `<span class="slot-number">${index + 1}</span><span style="font-size:31px">${entry[0]}</span><span>${entry[1]}</span>`; } }); }
      function renderFruit() { const round = currentRound(); const itemEmoji = round.itemEmoji || '🍎'; const itemLabel = round.itemLabel || '蘋果'; $('#fruitBag').innerHTML = Array.from({ length: gameState.fruitCount }, () => `<span>${itemEmoji}</span>`).join(''); $('#fruitCount').textContent = `${gameState.fruitCount} 個${itemLabel}（目標 ${round.count} 個）`; }
      function handleMemory(index) {
        if (gameState.locked || gameState.memoryOpen.includes(index) || gameState.memoryMatched.includes(index) || gameState.memoryOpen.length === 2) return;
        gameState.memoryOpen.push(index); revealMemory(index);
        if (gameState.memoryOpen.length === 2) {
          const [first, second] = gameState.memoryOpen;
          const isMatch = gameState.memoryCards[first].emoji === gameState.memoryCards[second].emoji;
          setTimeout(() => {
            if (isMatch) { gameState.memoryMatched.push(first, second); $$('.memory-card').filter(card => [first, second].includes(Number(card.dataset.index))).forEach(card => card.classList.add('matched')); makeTone(720, .15, .035); $('#gameFeedback').className = 'feedback success'; $('#gameFeedback').textContent = '找到了！再找另一對一樣的卡。'; if (gameState.memoryMatched.length === 4) success('太棒了！兩對卡片都找到了。'); } else { hideMemory(first); hideMemory(second); $('#gameFeedback').className = 'feedback try'; $('#gameFeedback').textContent = '這兩張不一樣，我們記住位置，再試一次。'; } gameState.memoryOpen = []; }, 650);
        }
      }
      function revealMemory(index) { const button = $(`.memory-card[data-index="${index}"]`); button.textContent = gameState.memoryCards[index].emoji; button.classList.add('flipped'); }
      function hideMemory(index) { const button = $(`.memory-card[data-index="${index}"]`); button.textContent = '?'; button.classList.remove('flipped'); }
      function renderPath(round) {
        const positions = [[0, 0], [0, 1], [0, 2], [1, 2]];
        const pos = positions[Math.min(gameState.pathStep, positions.length - 1)];
        let cells = '';
        for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) {
          const isPath = (row === 0) || (col === 2 && row <= 1);
          const isCharacter = pos[0] === row && pos[1] === col;
          const isGoal = row === 1 && col === 2;
          cells += `<div class="path-cell ${isPath ? 'road' : ''} ${isCharacter ? 'character' : ''} ${isGoal ? 'goal' : ''}">${isCharacter ? '🧒' :           isGoal ? (round.goalEmoji || '🏠') : isPath ? '' : '🌿'}</div>`;
        }
        $('#pathBoard').innerHTML = cells;
        $('#gameFeedback').textContent = `第 ${gameState.pathStep + 1} 步：請選擇「${round.route[gameState.pathStep]}」。`;
      }
      function handlePath(direction, round) {
        if (gameState.locked) return;
        if (direction === round.route[gameState.pathStep]) {
          gameState.pathStep += 1;
          makeTone(650, .12, .025);
          if (gameState.pathStep === round.route.length) success('平安到家了！你跟對了所有方向。'); else renderPath(round);
        } else { $('#gameFeedback').className = 'feedback try'; $('#gameFeedback').textContent = '先看看小路和提示，再試一次。'; makeTone(310, .13, .02); }
      }
      function evaluate(button, correct, detail) {
        if (gameState.locked) return;
        recordAdhdAttempt(correct);
        recordAsdAttempt(correct);
        button.classList.add(correct ? 'correct' : 'wrong');
        if (activeGame?.id === 'pathway-asd' && !correct) {
          const strategy = $('.asd-strategy'); strategy?.classList.add('attention'); setTimeout(() => strategy?.classList.remove('attention'), 1200);
          speak(`再試一次。社交策略是：${currentRound().strategy}`, .72);
        }
        if (activeGame?.id === 'pathway-gifted' && !correct) {
          const guide = $('.gifted-guide'); guide?.classList.add('attention'); setTimeout(() => guide?.classList.remove('attention'), 1200);
          speak(`再檢查一次解難策略。${currentRound().strategy}`, .72);
        }
        if (activeGame?.id === 'pathway-hi' && !correct) {
          const guide = $('.hi-visual-guide'); guide?.classList.add('attention'); setTimeout(() => guide?.classList.remove('attention'), 1200);
          speak(`再看一次視覺溝通卡。${currentRound().clue}`, .72);
        }
        if (activeGame?.id === 'pathway-ebd' && !correct) {
          const regulation = $('.ebd-regulation'); regulation?.classList.add('attention'); setTimeout(() => regulation?.classList.remove('attention'), 1200);
          speak(`先停一停。自我調節策略是：${currentRound().strategy}`, .72);
        }
        if (activeGame?.id === 'pathway-id' && !correct) {
          const guide = $('.id-life-guide'); guide?.classList.add('attention'); setTimeout(() => guide?.classList.remove('attention'), 1200);
          speak(`再看一次生活小步驟。${currentRound().clue}`, .72);
        }
        if (correct) success(detail || '做得好！'); else failure(detail || '我們一起再找找。');
      }
      function success(message) {
        if (gameState.locked) return;
        if (lessonSession.mode) changeLessonCount('correctAttempts');
        gameState.locked = true;
        $('#gameFeedback').className = 'feedback success'; $('#gameFeedback').textContent = `✓ ${message}`;
        triggerHaptic('correct');
        makeTone(740, .16, .04); setTimeout(() => makeTone(920, .23, .035), 140);
        if (activeGame?.id === 'spld') speak(`答對了。${message}`, .75);
        const advanceDelay = activeGame?.id === 'spld' ? 2300 : 1350;
        autoAdvanceTimer = setTimeout(() => { if (roundIndex < activeGame.rounds.length - 1) { roundIndex += 1; renderStage(); } else completeGame(); }, advanceDelay);
      }
      function failure(message, retryAction) { if (gameState.locked) return; if (lessonSession.mode) changeLessonCount('retries'); $('#gameFeedback').className = 'feedback try'; $('#gameFeedback').textContent = `↗ ${message}`; triggerHaptic('retry'); makeTone(340, .13, .018); if (retryAction) setTimeout(retryAction, 1050); }
      function showHint(id, round) {
        if (lessonSession.mode) changeLessonCount('hintsUsed');
        if (id === 'spld') { const hint = $('.spld-hint'); hint?.classList.add('attention'); setTimeout(() => hint?.classList.remove('attention'), 1200); $('#gameFeedback').className = 'feedback'; $('#gameFeedback').textContent = '💡 已為你慢讀黃色提示卡。'; readSpldHint(round); return; }
        if (id === 'pathway-asd') { recordAsdHint(); const strategy = $('.asd-strategy'); strategy?.classList.add('attention'); setTimeout(() => strategy?.classList.remove('attention'), 1200); $('#gameFeedback').className = 'feedback'; $('#gameFeedback').textContent = `💡 ${round.clue}`; speak(`社交策略。${round.strategy}。${round.clue}`, .72); return; }
        if (id === 'pathway-gifted') { const guide = $('.gifted-guide'); guide?.classList.add('attention'); setTimeout(() => guide?.classList.remove('attention'), 1200); $('#gameFeedback').className = 'feedback'; $('#gameFeedback').textContent = `💡 ${round.clue}`; speak(`解難策略。${round.strategy}。${round.clue}`, .72); return; }
        if (id === 'pathway-hi') { const guide = $('.hi-visual-guide'); guide?.classList.add('attention'); setTimeout(() => guide?.classList.remove('attention'), 1200); $('#gameFeedback').className = 'feedback'; $('#gameFeedback').textContent = `💡 ${round.clue}`; speak(`視覺溝通卡。${round.strategy}。${round.clue}`, .72); return; }
        if (id === 'pathway-ebd') { const regulation = $('.ebd-regulation'); regulation?.classList.add('attention'); setTimeout(() => regulation?.classList.remove('attention'), 1200); $('#gameFeedback').className = 'feedback'; $('#gameFeedback').textContent = `💡 ${round.clue}`; speak(`自我調節卡。${round.strategy}。${round.clue}`, .72); return; }
        if (id === 'pathway-id') { const guide = $('.id-life-guide'); guide?.classList.add('attention'); setTimeout(() => guide?.classList.remove('attention'), 1200); $('#gameFeedback').className = 'feedback'; $('#gameFeedback').textContent = `💡 ${round.clue}`; speak(`生活小步驟。${round.clue}`, .72); return; }
        if (id.startsWith('pathway-')) { $('#gameFeedback').className = 'feedback'; $('#gameFeedback').textContent = `💡 ${round.clue}`; speak(round.clue); return; }
        const hints = { spld: round.clue, emotion: `看看眼睛和嘴巴，這張臉是「${round.word}」。`, colour: `先看物品的名稱和色標，找相同顏色的盒。`, routine: `先想一想：每件事在生活中先後發生的次序。`, listen: `先按喇叭，再慢慢聽一次：「${round.listenText || round.word}」。`, fruit: `每按一次${round.itemLabel || '蘋果'}，就一起數一個。目標是 ${round.count} 個。`, signal: `先停一停看清情況；確認安全才繼續。`, turn: `看看哪一位角色上面有「輪到你」的箭頭。`, memory: '先翻一張，記住它的位置和圖案，再找同一樣的圖案。', weather: `想一想「${round.label}」時，身體需要甚麼幫忙。`, path: `這一步的提示是「${round.route[gameState.pathStep]}」。` };
        $('#gameFeedback').className = 'feedback'; $('#gameFeedback').textContent = `💡 ${hints[id]}`; speak(hints[id]);
      }
      function completeGame() {
        clearTimeout(autoAdvanceTimer);
        if (lessonSession.mode) changeLessonCount('completedGames');
        if (isAdhdGame() && adhdSession) { adhdSession.elapsed = getAdhdElapsed(); adhdSession.startedAt = null; clearAdhdTimer(); renderAdhdDashboard(); }
        completedGames.add(activeGame.id);
        updateDashboardProgress();
        addToken(1, false);
        triggerHaptic('complete');
        makeTone(784, .2, .05); setTimeout(() => makeTone(988, .3, .045), 170);
        $('#activityCard').innerHTML = `<div class="completion"><div class="completion-star">★</div><h2>完成了！做得很好。</h2><p>你已完成「${activeGame.title}」的 ${activeGame.rounds.length} 個小任務，並得到一顆努力星星。可以再玩一次，或選另一款小遊戲。</p><div class="stage-footer"><button class="hint-button" id="playAgain" type="button">↺ 再玩一次</button><button class="primary-button" id="chooseNext" type="button">選另一個小遊戲</button></div></div>`;
        $('#playAgain').addEventListener('click', () => startGame(activeGame.id));
        $('#chooseNext').addEventListener('click', showDashboard);
      }

      // Dashboard interactions
      const pathwayLabels = { '1': 'SpLD 讀寫策略', '2': 'ID 生活選擇', '3': 'ASD 社交練習', '4': 'ADHD 專注策略', 'G': 'Giftedness 邏輯解難', 'H': 'HI 視覺化溝通', 'E': 'EBD 情緒調節', '8': 'SLI 理解與表達', '9': 'MI 溝通與選擇', 'V': 'VI 視覺障礙', 'P': 'PD 肢體傷殘', 'C': '生涯探索與職場策略' };
      function updatePathwayStatus() {
        if (!activePathway) { $('#pathwayStatus').textContent = '尚未選擇路線。你可先按學生當日需要選擇一類，再按學段開始。'; return; }
        if (activePathway === '1' && ['lower', 'upper', 'junior', 'senior'].includes(activeStage)) {
          const focus = activeStage === 'lower' ? '多感官讀寫' : activeStage === 'upper' ? '語素、句法與詞彙' : activeStage === 'junior' ? '篇章、修辭、詞彙與句法' : '文言、論證、學術詞彙與語病校對';
          const directCount = activeStage === 'junior' ? 8 : 6;
          $('#pathwayStatus').textContent = `已選擇 ${pathwayLabels[activePathway]}｜${stageProfiles[activeStage].label}。現正顯示 1 組基礎練習和 ${directCount} 項可直接選擇的${focus}關卡；本路線不會混入其他 SEN 類別或一般活動。`;
          return;
        }
        if (activePathway === 'V' || activePathway === 'P') {
          const mode = activePathway === 'V' ? '鍵盤優先、可選音訊與高對比' : '單鍵、掃描、Tab 導覽與大型控制';
          $('#pathwayStatus').textContent = `已選擇 ${pathwayLabels[activePathway]}｜${stageProfiles[activeStage].label}。現正顯示兩項${mode}的新遊戲；本路線不會混入其他 SEN 類別或一般活動。`;
          return;
        }
        if (activePathway === 'C') {
          $('#pathwayStatus').textContent = `已選擇 ${pathwayLabels[activePathway]}｜${stageProfiles[activeStage].label}。現正顯示四項低壓力生涯探索遊戲；不作個人選科、升學或職業決定。`;
          return;
        }
        const primary = getPrimaryPathwayGame();
        $('#pathwayStatus').textContent = `已選擇 ${pathwayLabels[activePathway]}｜${stageProfiles[activeStage].label}。現正顯示「${primary.title}」專屬模組；本路線不會混入其他 SEN 類別或一般活動。`;
      }
      function updateSuggested() {
        delete $('#startSuggested').dataset.careerPathway;
        if (activePathway === 'V' || activePathway === 'P') {
          $('#startSuggested').textContent = activePathway === 'V' ? '▶ 從「尋找糖果屋」開始' : '▶ 從「單鍵太空熱氣球」開始';
          $('#startSuggested').dataset.game = '';
          return;
        }
        if (activePathway === 'C') {
          $('#startSuggested').textContent = activeStage === 'lower' ? '▶ 從「職業動物森林」開始' : activeStage === 'upper' ? '▶ 從「時空快遞」開始' : activeStage === 'junior' ? '▶ 從「青年工場」開始' : '▶ 從「DSE 放榜：平行宇宙」開始';
          $('#startSuggested').dataset.game = '';
          return;
        }
        const primary = getPrimaryPathwayGame();
        if (primary) { $('#startSuggested').textContent = `▶ 從「${primary.title}」開始`; $('#startSuggested').dataset.game = primary.id; return; }
        const generalGame = getStageGame(gameLibrary[0]);
        $('#startSuggested').textContent = `▶ 從一般活動「${generalGame.title}」開始`;
        $('#startSuggested').dataset.game = generalGame.id;
      }
      function renderAccessPathwayDirect() {
        if (activePathway !== 'V' && activePathway !== 'P') return false;
        const isVi = activePathway === 'V';
        const label = isVi ? 'VI 視覺障礙' : 'PD 肢體傷殘';
        const title = isVi ? 'VI 聲音導航與鍵盤策略' : 'PD 輔具與生活策略';
        const description = isVi ? '本學段提供兩項定向與螢幕閱讀練習；可選音訊、高對比和全鍵盤操作。' : '本學段提供兩項輔具與日常策略練習；支援單鍵、Tab 和點按替代。';
        const badges = isVi ? '<span class="support-badge">鍵盤優先</span><span class="support-badge">高對比</span><span class="support-badge">可選音訊</span>' : '<span class="support-badge">單鍵替代</span><span class="support-badge">Tab 導覽</span><span class="support-badge">無強制倒數</span>';
        $('#supportKey').hidden = true;
        $('#gamesKicker').textContent = '專屬訓練 · 直接選關';
        $('#gamesTitle').textContent = `${label}｜${stageProfiles[activeStage].label}`;
        $('#stageGuide').textContent = isVi ? '本學段提供兩項以鍵盤、可選音訊、高對比與視覺／聽覺替代為核心的活動；文字提示會一直保留。' : '本學段提供兩項以單鍵、掃描、Tab 導覽及大型控制為核心的活動；不設扣分或強制倒數。';
        $('#startSuggested').textContent = isVi ? '▶ 從「尋找糖果屋」開始' : '▶ 從「單鍵太空熱氣球」開始';
        $('#startSuggested').dataset.game = '';
        $('#startSuggested').dataset.accessType = activePathway;
        $('#gameGrid').classList.remove('spld-primary-grid');
        $('#gameGrid').innerHTML = `<button class="game-card ${isVi ? 'vi-direct-card' : 'pd-direct-card'}" type="button" data-access-direct="${activePathway}" data-tone="${isVi ? 'purple' : 'blue'}"><div class="game-visual" aria-hidden="true">${isVi ? '🦯' : '♿'}</div><h3>${title}</h3><p>${description}</p><div class="support-badge-row">${badges}</div><span class="tag">${stageProfiles[activeStage].label} · 2 項活動</span></button>`;
        $('[data-access-direct]')?.addEventListener('click', (event) => {
          const trigger = event.currentTarget;
          const lab = isVi ? window.VI_GAMES_LAB : window.PD_GAMES_LAB;
          if (!lab) { showToast(`${label} 遊戲正在準備中，請稍後再試。`); return; }
          lab.open({ stage: activeStage, onComplete: recordIdLabResult, trigger });
        });
        return true;
      }
      function renderCareerPathwayDirect() {
        if (activePathway !== 'C') return false;
        $('#supportKey').hidden = true;
        $('#gamesKicker').textContent = '生涯探索 · 直接選關';
        $('#gamesTitle').textContent = `生涯探索與職場策略｜${stageProfiles[activeStage].label}`;
        $('#stageGuide').textContent = '本學段提供四項以自我概念、職場策略、支援網絡及多元可能為核心的生涯探索。活動沒有排名、能力評分、強制倒數或個人出路結論。';
        $('#startSuggested').textContent = activeStage === 'lower' ? '▶ 從「職業動物森林」開始' : activeStage === 'upper' ? '▶ 從「時空快遞」開始' : activeStage === 'junior' ? '▶ 從「青年工場」開始' : '▶ 從「DSE 放榜：平行宇宙」開始';
        $('#startSuggested').dataset.game = '';
        $('#startSuggested').dataset.careerPathway = 'true';
        $('#gameGrid').classList.remove('spld-primary-grid');
        $('#gameGrid').innerHTML = `<button class="game-card career-direct-card" type="button" data-career-direct="true" data-tone="teal"><div class="game-visual" aria-hidden="true">🗺️</div><h3>SEN 生涯探索之旅</h3><p>本學段有四項低壓力探索：初小職業特質、準時準備與代幣概念；高小時間、職業辨識與禮貌表達；初中職場安全、防騙與溝通；高中多元出路、無障礙調適與面試反思。全程可停一停、可重試。</p><div class="support-badge-row"><span class="support-badge">不作評分</span><span class="support-badge">可選旁白</span><span class="support-badge">多元可能</span></div><span class="tag">${stageProfiles[activeStage].label} · 4 項活動</span></button>`;
        $('[data-career-direct]')?.addEventListener('click', (event) => {
          if (!window.CAREER_GAMES_LAB) { showToast('生涯探索遊戲正在準備中，請稍後再試。'); return; }
          window.CAREER_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: event.currentTarget });
        });
        return true;
      }
      function selectPathway(type) {
        activePathway = type;
        activeFilter = `support-${type}`;
        $$('.pathway-card').forEach(card => { const selected = card.dataset.type === type; card.classList.toggle('active', selected); card.setAttribute('aria-pressed', String(selected)); });
        $$('.filter-button').forEach(button => { const selected = button.dataset.filter === activeFilter; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
        updatePathwayStatus();
        if (renderAccessPathwayDirect() || renderCareerPathwayDirect()) { showToast(`已選擇 ${pathwayLabels[type]} 路線。`); setTimeout(() => $('#gamesAnchor').scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); return; }
        updateSuggested(); renderGameLibrary();
        showToast(`已選擇 ${pathwayLabels[type]} 路線。`);
        setTimeout(() => $('#gamesAnchor').scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
      function clearPathwaySelection(message) {
        if (!activePathway) return;
        activePathway = null;
        $$('.pathway-card').forEach(card => { card.classList.remove('active'); card.setAttribute('aria-pressed', 'false'); });
        updatePathwayStatus();
        if (message) showToast(message);
      }
      function selectStage(stage) {
        activeStage = stage;
        activeFilter = activePathway ? `support-${activePathway}` : 'all';
        $('#stageGuide').textContent = stageProfiles[stage].guide;
        $$('.level-button').forEach(button => { const selected = button.dataset.stage === stage; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
        $$('.filter-button').forEach(button => { const selected = button.dataset.filter === activeFilter; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
        updatePathwayStatus();
        if (renderAccessPathwayDirect() || renderCareerPathwayDirect()) { showToast(`已切換至${stageProfiles[stage].label}任務。`); return; }
        updateSuggested(); renderGameLibrary(); showToast(`已切換至${stageProfiles[stage].label}任務。`);
      }
      updateSuggested(); renderGameLibrary(); updateTokenBoard(); updateDashboardProgress();
      $('#startSuggested').addEventListener('click', () => {
        const accessType = $('#startSuggested').dataset.accessType;
        if ($('#startSuggested').dataset.careerPathway === 'true' && window.CAREER_GAMES_LAB) { window.CAREER_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: $('#startSuggested') }); return; }
        if (accessType === 'V' && window.VI_GAMES_LAB) { window.VI_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: $('#startSuggested') }); return; }
        if (accessType === 'P' && window.PD_GAMES_LAB) { window.PD_GAMES_LAB.open({ stage: activeStage, onComplete: recordIdLabResult, trigger: $('#startSuggested') }); return; }
        startGame($('#startSuggested').dataset.game || 'emotion');
      });
      $('#backToDashboard').addEventListener('click', showDashboard);
      $$('.pathway-card').forEach(card => card.addEventListener('click', () => selectPathway(card.dataset.type)));
      $$('.filter-button').forEach(button => button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        if (filter.startsWith('support-')) { selectPathway(filter.replace('support-', '')); return; }
        clearPathwaySelection('已退出專屬路線，現正顯示一般活動。');
        activeFilter = filter;
        $$('.filter-button').forEach(item => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
        updateSuggested(); renderGameLibrary();
      }));
      $$('.level-button').forEach(button => button.addEventListener('click', () => selectStage(button.dataset.stage)));
      $$('.side-link').forEach(link => link.addEventListener('click', () => { const nav = link.dataset.nav; if (nav === 'dashboard') { showDashboard(); } else { if ($('#dashboardView').classList.contains('hidden')) showDashboard(); setTimeout(() => $(nav === 'games' ? '#gamesAnchor' : '#supportAnchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120); $$('.side-link').forEach(item => item.classList.toggle('active', item === link)); } }));
      $$('.meter-button').forEach(button => button.addEventListener('click', () => { $$('.meter-button').forEach(item => item.classList.toggle('active', item === button)); $('#emotionNote').textContent = `✓ ${button.dataset.emotion}`; if (button.textContent.includes('很生氣') || button.textContent.includes('不舒服')) showToast('可以先使用「一起慢慢呼吸」。'); }));
      $('#addToken').addEventListener('click', () => addToken(1)); $('#resetTokens').addEventListener('click', () => { tokenCount = 0; updateTokenBoard(); showToast('星星已重設。'); });
      let paceActive = false; let paceIndex = 0; let paceTimer;
      const paceSteps = [['慢慢吸氣', 4000], ['輕輕停留', 7000], ['慢慢呼氣', 8000]];
      function runPace() { if (!paceActive) return; const [text, duration] = paceSteps[paceIndex]; $('#paceText').textContent = text; paceTimer = setTimeout(() => { paceIndex = (paceIndex + 1) % paceSteps.length; runPace(); }, duration); }
      $('#paceButton').addEventListener('click', () => { paceActive = !paceActive; clearTimeout(paceTimer); $('#paceBall').classList.toggle('breathing', paceActive); $('#paceButton').textContent = paceActive ? '❚❚ 暫停一下' : '▶ 開始 4 · 7 · 8 呼吸'; if (paceActive) { paceIndex = 0; runPace(); makeTone(440, .18, .02); } else $('#paceText').textContent = '做得很好，準備好再開始。'; });
      function toggleReadable() { const active = document.body.classList.toggle('readable'); $('#readableButton').classList.toggle('active', active); $('#stageReadable').classList.toggle('active', active); showToast(active ? '已開啟高辨識文字模式。' : '已回復一般文字模式。'); }
      $('#readableButton').addEventListener('click', toggleReadable); $('#stageReadable').addEventListener('click', toggleReadable);
      $('#stageSound').addEventListener('click', function () { soundEnabled = !soundEnabled; this.textContent = soundEnabled ? '🔊 指令聲音：開' : '🔇 指令聲音：關'; this.classList.toggle('active', !soundEnabled); showToast(soundEnabled ? '已開啟指令聲音。' : '已關閉指令聲音。'); });
      $('#stageHaptic').addEventListener('click', function () { hapticEnabled = !hapticEnabled; this.textContent = hapticEnabled ? '⌁ 觸覺提示：開' : '⌁ 觸覺提示：關'; this.classList.toggle('haptic-active', hapticEnabled); if (hapticEnabled && !('vibrate' in navigator)) showToast('此裝置未提供震動功能，會保留視覺回饋。'); else { triggerHaptic('tap'); showToast(hapticEnabled ? '已開啟可選觸覺提示。' : '已關閉觸覺提示。'); } });
      function toggleProjector() { const enabled = document.body.classList.toggle('projector'); $('#projectorButton').innerHTML = enabled ? '<span>▣</span> 離開投影模式' : '<span>▣</span> 投影模式'; showToast(enabled ? '已切換為投影模式。' : '已回復同工操作模式。'); }
      $('#projectorButton').addEventListener('click', toggleProjector); $('#projectorTop').addEventListener('click', toggleProjector);
      $('#fullscreenButton').addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (_) { showToast('請使用瀏覽器的全螢幕功能。'); } });
      $('#lessonModeToggle').addEventListener('click', toggleLessonMode); $('#lessonPauseToggle').addEventListener('click', toggleLessonPause); $('#lessonPauseStage').addEventListener('click', toggleLessonPause); $('#lessonAddHint').addEventListener('click', () => { changeLessonCount('hintsUsed'); showToast('已記下 1 次提示。'); }); $('#lessonHintStage').addEventListener('click', () => { changeLessonCount('hintsUsed'); showToast('已記下 1 次提示。'); }); $('#lessonAddRetry').addEventListener('click', () => { changeLessonCount('retries'); showToast('已記下 1 次重試。'); }); $('#lessonRetryStage').addEventListener('click', () => { changeLessonCount('retries'); showToast('已記下 1 次重試。'); }); $('#lessonReset').addEventListener('click', resetLessonSession);
      function recordSpldLabCompletion(event, labLabel) {
        const summary = event.detail || {};
        if (lessonSession.mode) {
          for (let i = 0; i < (summary.correct || 0); i += 1) changeLessonCount('correctAttempts');
          for (let i = 0; i < (summary.retries || 0); i += 1) changeLessonCount('retries');
          for (let i = 0; i < (summary.hints || 0); i += 1) changeLessonCount('hintsUsed');
          lessonSession.completedGames += 1;
          lessonSession.updatedAt = Date.now();
          saveLessonSession();
          renderLessonSession();
        }
        showToast(`已完成${labLabel}：${summary.activity || '練習'}。`);
      }
      document.addEventListener('spld-p1-lab-complete', (event) => recordSpldLabCompletion(event, '初小讀寫實驗室'));
      document.addEventListener('spld-p4-lab-complete', (event) => recordSpldLabCompletion(event, '高小讀寫實驗室'));
      document.addEventListener('spld-s1-lab-complete', (event) => recordSpldLabCompletion(event, '初中讀寫實驗室'));
      document.addEventListener('spld-s4-lab-complete', (event) => recordSpldLabCompletion(event, '高中讀寫實驗室'));
      renderLessonSession();

      // A prepared lesson link may append senType and stageLevel to open the
      // most relevant pathway. Only allow known values.
      const quickStartPathways = { SpLD: '1', ID: '2', ASD: '3', ADHD: '4', EBD: 'E', SLI: '8', MI: '9', Giftedness: 'G', HI: 'H' };
      const quickStartStages = { 'P1–P3': 'lower', 'P4–P6': 'upper', 'S1–S3': 'junior', 'S4–S6': 'senior' };
      const quickStartParams = new URLSearchParams(window.location.search);
      const requestedPathway = quickStartPathways[quickStartParams.get('senType')];
      const requestedStage = quickStartStages[quickStartParams.get('stageLevel')];
      if (requestedStage) selectStage(requestedStage);
      if (requestedPathway) selectPathway(requestedPathway);
    })();
