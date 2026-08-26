(() => {
  const ACTIVITIES = {
    sound: {
      stage: ['lower'], icon: '🏝️', title: '聲音魔法島', focus: '聲音覺察與清楚說字', description: '先聽目標字，再找相同的起首聲音；可以選擇錄下自己讀音再重聽。',
      prep: ['先聽教師或朗讀按鈕讀出目標字。', '慢慢比較每個字開頭的聲音。', '錄音只會留在這部裝置，不會自動判定讀音對錯。'],
      rounds: [
        { target: '送', sound: 's', prompt: '哪一個字和「送」有相近的起首聲音？', choices: ['信', '糖', '風'], answer: '信', hint: '慢慢讀：「送」和「信」開頭都有較輕的 s 聲。', growth: '🌱 長出一片新葉。' },
        { target: '糖', sound: 't', prompt: '哪一個字和「糖」有相近的起首聲音？', choices: ['圖', '手', '魚'], answer: '圖', hint: '先只聽第一下：「糖」和「圖」都由 t 聲開始。', growth: '🌼 魔法花開了。' },
        { target: '詩', sound: 's', prompt: '哪一個字和「詩」有相近的起首聲音？', choices: ['書', '雞', '火'], answer: '書', hint: '把兩個字慢慢拉長讀：「詩——」「書——」。', growth: '🦋 一隻蝴蝶飛來了。' }
      ]
    },
    portal: {
      stage: ['lower'], icon: '🌀', title: '詞彙傳送門', focus: '詞彙分類與語義關聯', description: '看物件和名稱，把它送進正確的類別傳送門。',
      prep: ['先看物件和三個傳送門的名稱。', '每次只問自己：「它屬於哪一類？」', '可以拖拉，也可以直接按傳送門。'],
      rounds: [
        { item: '🍎', name: '蘋果', answer: '食物', choices: ['食物', '交通工具', '文具'], hint: '蘋果可以吃，所以先找食物傳送門。' },
        { item: '🚌', name: '巴士', answer: '交通工具', choices: ['文具', '交通工具', '衣物'], hint: '巴士會載人到不同地方。' },
        { item: '✏️', name: '鉛筆', answer: '文具', choices: ['食物', '衣物', '文具'], hint: '上課寫字會用到鉛筆。' }
      ]
    },
    factory: {
      stage: ['lower'], icon: '🏭', title: '句子組裝工廠', focus: '人物、地方與動作句型', description: '把人物、地方和動作語塊按順序組合，砌出一個通順句子。',
      prep: ['先找「誰」的語塊。', '再找「在哪裏」和「做甚麼」。', '可拖拉或按一下語塊；每次只放一塊。'],
      rounds: [
        { prompt: '把「小貓／天台／訓覺」砌成一句完整句子。', answer: ['小貓', '喺天台', '訓覺'], choices: ['小貓', '喺天台', '訓覺'], labels: ['誰', '在哪裏', '做甚麼'], hint: '先找角色「小貓」，再想牠在哪裏和在做甚麼。' },
        { prompt: '把阿明在圖書館做的事按句子順序砌好。', answer: ['阿明', '喺圖書館', '睇書'], choices: ['睇書', '阿明', '喺圖書館'], labels: ['誰', '在哪裏', '做甚麼'], hint: '句子開始的人物是「阿明」。' },
        { prompt: '把妹妹在廚房洗碗的句子砌出來。', answer: ['妹妹', '喺廚房', '洗碗'], choices: ['喺廚房', '洗碗', '妹妹'], labels: ['誰', '在哪裏', '做甚麼'], hint: '先放人物「妹妹」，最後才放動作「洗碗」。' }
      ]
    },
    timeline: {
      stage: ['upper'], icon: '🕵️', title: '時間線偵探', focus: '故事排序、原因與結果', description: '把生活故事的卡片排好，再找出最合理的前因後果。',
      prep: ['先把所有事件卡慢慢讀一遍。', '先找最開始發生的事，再找結果。', '不必急；可以先按朗讀，再逐張選擇。'],
      rounds: [
        { story: '阿晴上巴士後才發現沒有帶銀包。', answer: ['準備出門', '上巴士', '發現沒有銀包'], choices: ['發現沒有銀包', '準備出門', '上巴士'], labels: ['開始', '中間', '結果'], hint: '先想一想：她先準備出門，還是先在巴士上發現問題？' },
        { story: '小組要交海報，但膠水不見了。', answer: ['看清工作', '找不到膠水', '向老師借膠水'], choices: ['向老師借膠水', '看清工作', '找不到膠水'], labels: ['開始', '問題', '下一步'], hint: '解決問題前，先會發現材料不見了。' },
        { story: '阿樂約了朋友在圖書館溫習。', answer: ['看清集合時間', '準時到圖書館', '一起開始溫習'], choices: ['一起開始溫習', '看清集合時間', '準時到圖書館'], labels: ['開始', '到達', '結果'], hint: '先知道時間，才可以準時到達。' }
      ]
    },
    emotion: {
      stage: ['upper'], icon: '🕶️', title: '情緒特工隊', focus: '情境、表情與得體回應', description: '從角色的表情和情境線索，選出一個清楚而尊重的回應。',
      prep: ['先看角色的表情、身體動作和情境。', '想一想：對方現在可能需要甚麼？', '選一個可以實際說出口的短句。'],
      rounds: [
        { face: '😞', context: '小美的作品被雨水弄濕了，她低頭不說話。', prompt: '小美作品被弄濕後，哪一句關心最合適？', choices: ['你想我陪你一起看看嗎？', '這有甚麼好傷心？', '你一定要立刻再做一份。'], answer: '你想我陪你一起看看嗎？', hint: '她可能感到失望；先關心和提出小幫忙。', teacher: '可問學生：「小美的臉和身體告訴你甚麼？」' },
        { face: '😳', context: '小健在分享時讀錯了一個字，臉紅紅地停下來。', prompt: '哪一句最能讓他舒服一點？', choices: ['我們可以一起慢慢讀。', '你讀得很差。', '快點，不要浪費時間。'], answer: '我們可以一起慢慢讀。', hint: '先把節奏放慢，讓對方仍可參與。', teacher: '可示範以較慢、較平靜的語氣說出正確選項。' },
        { face: '😟', context: '朋友不停望著鐘，說「我怕趕不及交功課」。', prompt: '朋友擔心交功課太趕時，可以先怎樣支持他？', choices: ['我們先看哪一部分最急。', '你不用理它。', '你現在一定做不完。'], answer: '我們先看哪一部分最急。', hint: '先把大問題變成眼前的一小步。', teacher: '可讓學生指「先做哪一部分」而不必說完整句子。' }
      ]
    },
    courier: {
      stage: ['upper'], icon: '🛵', title: '指示傳送大師', focus: '聆聽理解與多步指示', description: '聽或讀一張訂單，逐步選出正確內容；可以重播或只顯示一小步。',
      prep: ['先聽完整指示一次。', '先找第一項，再慢慢處理下一項。', '需要時可按「只看下一小步」，不用一次記住全部。'],
      rounds: [
        { order: '請準備一個大批，加芝士，不要洋蔥，送去三樓。', answer: ['大批', '加芝士', '不要洋蔥'], choices: ['大批', '細批', '加芝士', '不要洋蔥', '加洋蔥'], labels: ['餐點', '加配', '不需要'], hint: '先找餐點大小；再找「加」和「不要」後面的材料。' },
        { order: '請拿藍色文件夾、兩枝黑筆，放到接待處。', answer: ['藍色文件夾', '兩枝黑筆', '接待處'], choices: ['紅色文件夾', '藍色文件夾', '一枝黑筆', '兩枝黑筆', '接待處'], labels: ['物品一', '數量', '地點'], hint: '把指示拆成物品、數量和地點。' },
        { order: '小組開始前，先帶平板，再帶充電線，最後到禮堂集合。', answer: ['平板', '充電線', '禮堂'], choices: ['耳機', '平板', '充電線', '操場', '禮堂'], labels: ['先帶', '再帶', '最後到'], hint: '留意「先、再、最後」三個次序詞。' }
      ]
    },
    subtext: {
      stage: ['junior'], icon: '🗯️', title: '說話潛台詞', focus: '隱含意思、語氣與中性確認', description: '從上下文看一句話可能真正想表達甚麼，再選擇不升級誤會的下一句。',
      prep: ['先看說話前後發生了甚麼。', '一句話可以有不止一種意思；不要急著猜定。', '不肯定時，選擇中性確認比指責更安全。'],
      rounds: [
        { quote: '「哇，你今日真係準時喎。」', context: '小健遲了十五分鐘才到。', prompt: '這句話最可能想表達甚麼？', choices: ['可能在提醒他遲到了', '一定是認真稱讚', '完全和時間無關'], answer: '可能在提醒他遲到了', follow: '我知道我遲了，對不起。下次我會早一點出門。', hint: '先比較說話內容與實際情況是否一致。' },
        { quote: '「你真係好有心機啊。」', context: '朋友用很平靜的文字回覆你剛完成的海報。', prompt: '最穩妥的下一步是甚麼？', choices: ['先中性地問他是不是喜歡海報', '立刻認定他在諷刺', '把訊息轉發給很多人評論'], answer: '先中性地問他是不是喜歡海報', follow: '我不太肯定你的意思；你是覺得這張海報可以嗎？', hint: '文字少了語氣，先確認比猜定意思更穩妥。' },
        { quote: '「好啊，隨便你。」', context: '小組討論時，同學說得很短，又沒有看著大家。', prompt: '哪一個理解最合適？', choices: ['他可能同意，也可能不太想繼續談', '他一定很開心', '他一定完全聽不懂'], answer: '他可能同意，也可能不太想繼續談', follow: '我想確認一下：你對這個安排可以嗎？', hint: '從短句和身體線索看，保留多一個可能。' }
      ]
    },
    debate: {
      stage: ['junior'], icon: '⚖️', title: '辯論擂台', focus: '立場、理由與證據組織', description: '先選立場，再把能支持它的理據卡按順序放進論點架構。',
      prep: ['先讀題目，再選自己這一回合要練習的立場。', '每一張理據卡都要和立場有關。', '先說一個理由，再補一個例子或結果。'],
      rounds: [
        { topic: '中學生應否在上課時把手機放在桌上？', position: '不應放在桌上', answer: ['容易分心', '可在下課才查看訊息'], choices: ['容易分心', '可在下課才查看訊息', '手機顏色很好看', '所有人都一定喜歡手機'], labels: ['理由', '可行做法'], hint: '先找和上課專心有關的理由。' },
        { topic: '學校應否保留安靜閱讀時間？', position: '應保留', answer: ['可以慢慢閱讀', '有助建立閱讀習慣'], choices: ['可以慢慢閱讀', '有助建立閱讀習慣', '午飯一定要更短', '圖書一定很重'], labels: ['理由', '好處'], hint: '找能說明閱讀時間有甚麼益處的兩張卡。' },
        { topic: '班級旅行應否安排學生參與路線選擇？', position: '應參與', answer: ['可了解大家需要', '較願意遵守安排'], choices: ['可了解大家需要', '較願意遵守安排', '所有地點都一樣', '不用看安全資料'], labels: ['理由', '可能結果'], hint: '先想學生參與後能帶來甚麼實際改變。' }
      ]
    },
    interview: {
      stage: ['senior'], icon: '💼', title: '模擬面試王', focus: '自我介紹與 STAR 組織', description: '把情境、行動和結果語塊排好，完成一段清楚、真實的兼職面試回應。',
      prep: ['先讀面試問題，不用急著即時回答。', '用「情境、我做了甚麼、結果」三小步組織。', '可按句卡練習，也可自行說出自己的版本。'],
      rounds: [
        { question: '你有甚麼經驗可以幫助你做便利店店員？', answer: ['我曾在學校圖書館幫忙整理書架。', '我會先看標籤，再把圖書放到正確位置。', '結果是同學較容易找到需要的書。'], choices: ['結果是同學較容易找到需要的書。', '我會先看標籤，再把圖書放到正確位置。', '我曾在學校圖書館幫忙整理書架。'], labels: ['情境', '行動', '結果'], hint: '先說做過甚麼，再說自己怎樣做和帶來甚麼結果。' },
        { question: '如果工作很忙，你怎樣安排自己？', answer: ['我先看清楚最急的工作。', '我會逐項完成並向同事確認。', '這樣可以減少遺漏和延誤。'], choices: ['這樣可以減少遺漏和延誤。', '我先看清楚最急的工作。', '我會逐項完成並向同事確認。'], labels: ['情境／做法', '行動', '結果'], hint: '先說你的做法，再說具體行動和好處。' },
        { question: '你怎樣和同事合作？', answer: ['小組活動時，我會先確認分工。', '我會完成自己部分，遇到困難就清楚問。', '大家較容易按時完成任務。'], choices: ['大家較容易按時完成任務。', '小組活動時，我會先確認分工。', '我會完成自己部分，遇到困難就清楚問。'], labels: ['情境', '行動', '結果'], hint: '合作回答可包括分工、溝通和完成結果。' }
      ]
    },
    resolve: {
      stage: ['senior'], icon: '🧯', title: '突發事件應變室', focus: '投訴處理、語氣與解難', description: '在服務情境中把確認、道歉和處理下一步排好，練習保持平靜與清楚。',
      prep: ['先聽對方說了甚麼，不急著反駁。', '先確認問題，再用平靜語氣道歉。', '最後提出一個可做到的處理下一步。'],
      rounds: [
        { caseText: '客人說：「這條魚未熟，我等了很久。」', answer: ['我明白你說這條魚未熟。', '對不起讓你久等了。', '我現在請廚房重新處理，稍後再向你確認。'], choices: ['我現在請廚房重新處理，稍後再向你確認。', '對不起讓你久等了。', '我明白你說這條魚未熟。'], labels: ['確認', '道歉', '處理'], hint: '先說明你聽到的問題，再道歉和提出可做的處理。' },
        { caseText: '同事說：「這份表格少了日期，現在不能交。」', answer: ['我知道表格少了日期。', '對不起，我剛才沒有核對清楚。', '我現在補上日期，再請你一起看一看。'], choices: ['我現在補上日期，再請你一起看一看。', '我知道表格少了日期。', '對不起，我剛才沒有核對清楚。'], labels: ['確認', '道歉', '處理'], hint: '回應不需要很長；三句清楚的話已可開始處理。' },
        { caseText: '顧客說：「我訂的是無糖飲品，這杯太甜。」', answer: ['我明白你要的是無糖飲品。', '對不起，這杯不符合你的訂單。', '我現在為你更換，請你稍等一下。'], choices: ['我現在為你更換，請你稍等一下。', '對不起，這杯不符合你的訂單。', '我明白你要的是無糖飲品。'], labels: ['確認', '道歉', '處理'], hint: '重述訂單可讓對方知道你聽懂了，再說明下一步。' }
      ]
    }
  };
  const EXTRA_ROUNDS = {
    sound:[
      {target:'風',sound:'f',prompt:'哪一個字和「風」有相近的起首聲音？',choices:['花','書','牛'],answer:'花',hint:'慢慢聽「風」和「花」開頭較輕的 f 聲。',growth:'🌿 長出一片新葉。'},
      {target:'牛',sound:'n',prompt:'哪一個字和「牛」有相近的起首聲音？',choices:['女','火','書'],answer:'女',hint:'先只比較開頭：「牛」和「女」。',growth:'🌼 魔法花開了。'},
      {target:'雞',sound:'g',prompt:'哪一個字和「雞」有相近的起首聲音？',choices:['家','雨','手'],answer:'家',hint:'可請教師慢慢讀「雞——家」。',growth:'🦋 一隻蝴蝶飛來了。'},
      {target:'米',sound:'m',prompt:'哪一個字和「米」有相近的起首聲音？',choices:['門','風','書'],answer:'門',hint:'留意兩個字開始時嘴唇的動作。',growth:'🌳 小樹長高了。'},
      {target:'光',sound:'g',prompt:'哪一個字和「光」有相近的起首聲音？',choices:['高','水','馬'],answer:'高',hint:'先聽「光」和「高」的第一下。',growth:'✨ 島上亮起新星。'}],
    portal:[
      {item:'👕',name:'校服',answer:'衣物',choices:['衣物','食物','交通工具'],hint:'校服是穿在身上的。'},
      {item:'🚲',name:'單車',answer:'交通工具',choices:['交通工具','文具','食物'],hint:'單車可以帶人到不同地方。'},
      {item:'🥛',name:'牛奶',answer:'食物',choices:['文具','食物','衣物'],hint:'牛奶可以喝。'},
      {item:'📏',name:'間尺',answer:'文具',choices:['衣物','交通工具','文具'],hint:'上課畫線會用到間尺。'},
      {item:'🧦',name:'襪',answer:'衣物',choices:['食物','衣物','文具'],hint:'襪是穿在腳上的。'}],
    factory:[
      {prompt:'把「爸爸／喺客廳／睇報紙」砌成一句完整句子。',answer:['爸爸','喺客廳','睇報紙'],choices:['睇報紙','爸爸','喺客廳'],labels:['誰','在哪裏','做甚麼'],hint:'先找人物「爸爸」。'},
      {prompt:'把「老師／喺課室／寫字」砌成一句完整句子。',answer:['老師','喺課室','寫字'],choices:['喺課室','寫字','老師'],labels:['誰','在哪裏','做甚麼'],hint:'句子先說誰，再說地方。'},
      {prompt:'把「小狗／喺花園／跑步」砌成一句完整句子。',answer:['小狗','喺花園','跑步'],choices:['跑步','小狗','喺花園'],labels:['誰','在哪裏','做甚麼'],hint:'先放小狗，再放牠做的事。'},
      {prompt:'把「姐姐／喺廚房／煮飯」砌成一句完整句子。',answer:['姐姐','喺廚房','煮飯'],choices:['煮飯','喺廚房','姐姐'],labels:['誰','在哪裏','做甚麼'],hint:'先找「姐姐」這個人物。'},
      {prompt:'把「同學／喺操場／打波」砌成一句完整句子。',answer:['同學','喺操場','打波'],choices:['喺操場','同學','打波'],labels:['誰','在哪裏','做甚麼'],hint:'最後放動作「打波」。'}],
    timeline:[
      {story:'阿文想交功課，但發現未寫姓名。',answer:['完成功課','發現沒有姓名','補回姓名再交'],choices:['補回姓名再交','完成功課','發現沒有姓名'],labels:['開始','問題','下一步'],hint:'先完成功課，才會檢查到名字。'},
      {story:'小美下雨天出門，發現沒有雨傘。',answer:['準備出門','發現下雨沒雨傘','回去拿雨傘'],choices:['回去拿雨傘','準備出門','發現下雨沒雨傘'],labels:['開始','問題','下一步'],hint:'先出門前看天氣，再決定拿雨傘。'},
      {story:'小組要做實驗，先要準備材料。',answer:['看實驗要求','找齊材料','開始實驗'],choices:['開始實驗','看實驗要求','找齊材料'],labels:['開始','準備','結果'],hint:'先知道需要甚麼，才可以找材料。'},
      {story:'阿欣約同學一起溫習，但巴士遲到。',answer:['看清集合時間','巴士遲到','通知同學會稍後到'],choices:['通知同學會稍後到','看清集合時間','巴士遲到'],labels:['開始','問題','下一步'],hint:'先知道約了甚麼時間，才知道自己會遲到。'},
      {story:'圖書館的書要歸位。',answer:['看書背標籤','找到合適書架','把書放回去'],choices:['把書放回去','看書背標籤','找到合適書架'],labels:['開始','中間','結果'],hint:'先看標籤，才知道要放哪裏。'}],
    emotion:[
      {face:'😣',context:'小傑在比賽中跌倒，坐在地上不說話。',prompt:'小傑跌倒後，哪一句關心最合適？',choices:['你要不要先坐一會，我可以找老師。','快點站起來，不要麻煩人。','你一定不可以哭。'],answer:'你要不要先坐一會，我可以找老師。',hint:'先問對方需要甚麼，再找成人支持。',teacher:'可讓學生只指選項中的「找老師」。'},
      {face:'😠',context:'小琳等了很久仍未輪到玩，眉頭緊緊。',prompt:'哪一句可以幫她先慢下來？',choices:['我們先看看還有幾個人，慢慢等。','你生氣就不要玩。','你要立刻搶過來。'],answer:'我們先看看還有幾個人，慢慢等。',hint:'先提供一個清楚、可做的小步。',teacher:'可問學生：「她現在最需要知道甚麼？」'},
      {face:'😰',context:'阿明忘了帶功課，站在門口很緊張。',prompt:'哪一句最能支持他？',choices:['我們先告訴老師，再想下一步。','你一定會被罰。','你不要進課室。'],answer:'我們先告訴老師，再想下一步。',hint:'先找成人，再一起處理。',teacher:'可讓學生練習說「告訴老師」。'},
      {face:'😴',context:'同學午飯後一直打呵欠，做事很慢。',prompt:'哪一句較尊重又實際？',choices:['你想先喝水或休息一下嗎？','你一定要快十倍。','你很懶。'],answer:'你想先喝水或休息一下嗎？',hint:'先關心身體需要，不作批評。',teacher:'可示範平靜語氣。'},
      {face:'🙂',context:'小組完成海報後，阿欣微笑看著大家。',prompt:'哪一句可以一起慶祝又不比較？',choices:['我們完成了一步，謝謝大家合作。','只有你做得最好。','其他人甚麼也沒做。'],answer:'我們完成了一步，謝謝大家合作。',hint:'選能看見大家努力的說法。',teacher:'可讓學生指出「謝謝合作」。'}],
    courier:[
      {order:'請拿紅色文件夾、一枝藍筆，放到老師桌上。',answer:['紅色文件夾','一枝藍筆','老師桌上'],choices:['紅色文件夾','藍色文件夾','一枝藍筆','兩枝藍筆','老師桌上'],labels:['物品一','數量','地點'],hint:'拆成顏色物品、數量和地點。'},
      {order:'先帶水樽，再帶毛巾，最後到操場集合。',answer:['水樽','毛巾','操場'],choices:['水樽','毛巾','課室','操場','雨傘'],labels:['先帶','再帶','最後到'],hint:'留意先、再、最後。'},
      {order:'請預備兩張工作紙、膠水，交到美術室。',answer:['兩張工作紙','膠水','美術室'],choices:['一張工作紙','兩張工作紙','膠水','圖書館','美術室'],labels:['數量','物品','地點'],hint:'先找數量，再找物品和地點。'},
      {order:'把午餐盒洗好、放進袋，再回到課室。',answer:['洗好午餐盒','放進袋','課室'],choices:['洗好午餐盒','放進袋','操場','課室','丟掉午餐盒'],labels:['先做','再做','最後到'],hint:'句子有三個順序步驟。'},
      {order:'請拿平板、充電線，到會議室找陳老師。',answer:['平板','充電線','會議室'],choices:['平板','充電線','禮堂','會議室','足球'],labels:['物品一','物品二','地點'],hint:'先找兩件物品，再找地點。'}],
    subtext:[
      {quote:'「你可以先看規則。」',context:'你剛開始玩新遊戲，還未知道怎樣做。',prompt:'這句話最可能想幫你甚麼？',choices:['提醒你先了解玩法','叫你立刻離開','表示完全不用規則'],answer:'提醒你先了解玩法',follow:'好，我先看規則；不清楚再問你。',hint:'看情境：你還未知道玩法。'},
      {quote:'「我而家有少少忙，遲啲再傾。」',context:'同學正在完成一份功課。',prompt:'最穩妥的理解是甚麼？',choices:['他現在忙，之後可能再談','他一定永遠不想理你','他一定很生氣'],answer:'他現在忙，之後可能再談',follow:'好，完成後你方便時再告訴我。',hint:'保留時間和情境的線索，不急著猜動機。'},
      {quote:'「我想諗一諗先。」',context:'小組正決定海報主題。',prompt:'哪一個理解較合適？',choices:['對方想先思考再回應','對方一定反對所有事','對方完全沒有聽見'],answer:'對方想先思考再回應',follow:'好，我們可以先記下兩個選擇。',hint:'「諗一諗」表示未即時決定。'},
      {quote:'「你可唔可以講慢少少？」',context:'你剛才很快說完活動安排。',prompt:'對方最可能需要甚麼？',choices:['希望更清楚理解資料','希望你完全不要說話','希望立刻結束活動'],answer:'希望更清楚理解資料',follow:'可以，我慢慢再說一次。',hint:'看句子中的「講慢少少」。'},
      {quote:'「我收到了，等我睇完先。」',context:'你傳了一份較長的文件給同學。',prompt:'最穩妥的下一步是甚麼？',choices:['等對方看完再跟進','立刻連續傳很多訊息','認定對方不會看'],answer:'等對方看完再跟進',follow:'好，你看完後方便時再回覆我。',hint:'對方已說明會先閱讀。'}],
    debate:[
      {topic:'學校應否提供更多圖像指示？',position:'應提供',answer:['可幫助理解步驟','讓學生較容易跟隨安排'],choices:['可幫助理解步驟','讓學生較容易跟隨安排','所有文字都要刪掉','不用看安全資料'],labels:['理由','可能結果'],hint:'找和理解指示有關的卡。'},
      {topic:'小組工作應否先寫下分工？',position:'應先寫下',answer:['可清楚知道誰做甚麼','減少記錯安排'],choices:['可清楚知道誰做甚麼','減少記錯安排','一定不用溝通','誰都不能提問'],labels:['理由','好處'],hint:'想分工表能帶來甚麼實際幫助。'},
      {topic:'課室應否有安靜閱讀角？',position:'應設置',answer:['可提供較少干擾的位置','學生可按需要選擇'],choices:['可提供較少干擾的位置','學生可按需要選擇','所有人必須永遠坐那裏','不能有任何圖書'],labels:['理由','好處'],hint:'找和安靜、選擇有關的理由。'},
      {topic:'校外活動應否先提供行程表？',position:'應提供',answer:['可知道時間和地點','較容易準備需要物品'],choices:['可知道時間和地點','較容易準備需要物品','一定不可以問問題','所有人都喜歡驚喜'],labels:['理由','好處'],hint:'行程表會幫學生知道甚麼資料？'},
      {topic:'班會應否留時間讓學生提問？',position:'應留時間',answer:['可確認大家是否理解','能收集不同需要'],choices:['可確認大家是否理解','能收集不同需要','只有一種想法才可以','問題一定要取消'],labels:['理由','可能結果'],hint:'找和理解和需要有關的卡。'}],
    interview:[
      {question:'你怎樣處理不清楚的工作指示？',answer:['我會先看清楚指示重點。','不確定時會用短句向同事確認。','這樣可減少做錯和遺漏。'],choices:['這樣可減少做錯和遺漏。','我會先看清楚指示重點。','不確定時會用短句向同事確認。'],labels:['做法','行動','結果'],hint:'先說自己怎樣開始，再說確認和結果。'},
      {question:'你怎樣準備準時上班？',answer:['前一晚我會看清楚上班時間。','我會預備需要物品和交通安排。','這樣可較安心準時到達。'],choices:['我會預備需要物品和交通安排。','這樣可較安心準時到達。','前一晚我會看清楚上班時間。'],labels:['情境／做法','行動','結果'],hint:'把時間、準備和結果按順序說。'},
      {question:'遇到客人提問而你不確定時，會怎樣做？',answer:['我會先聽清楚客人的問題。','我會向同事確認資料再回答。','客人可得到較準確的資訊。'],choices:['客人可得到較準確的資訊。','我會先聽清楚客人的問題。','我會向同事確認資料再回答。'],labels:['情境','行動','結果'],hint:'先聽問題，再確認資料。'},
      {question:'你怎樣維持工作地方整齊？',answer:['我會看清楚物品標籤。','用完會放回指定位置。','同事較容易找到物品。'],choices:['用完會放回指定位置。','同事較容易找到物品。','我會看清楚物品標籤。'],labels:['做法','行動','結果'],hint:'先說標籤，再說放回和好處。'},
      {question:'你怎樣在小組中分享進度？',answer:['完成一部分後我會告知同組同事。','我會清楚說明下一步需要甚麼。','大家可較容易配合工作。'],choices:['大家可較容易配合工作。','完成一部分後我會告知同組同事。','我會清楚說明下一步需要甚麼。'],labels:['情境','行動','結果'],hint:'分享進度要包括完成和下一步。'}],
    resolve:[
      {caseText:'客人說：「我等了很久，但還未收到餐點。」',answer:['我明白你等了很久仍未收到餐點。','對不起讓你久等。','我現在查看訂單進度，再向你更新。'],choices:['我現在查看訂單進度，再向你更新。','對不起讓你久等。','我明白你等了很久仍未收到餐點。'],labels:['確認','道歉','處理'],hint:'先重述問題，再道歉和說明下一步。'},
      {caseText:'同事說：「這箱貨放錯了位置。」',answer:['我知道這箱貨放錯位置。','對不起，我剛才沒有核對標籤。','我現在按標籤放回正確位置。'],choices:['我現在按標籤放回正確位置。','我知道這箱貨放錯位置。','對不起，我剛才沒有核對標籤。'],labels:['確認','道歉','處理'],hint:'回應包括確認、道歉和可做到的處理。'},
      {caseText:'顧客說：「這份文件少了一頁。」',answer:['我明白文件少了一頁。','對不起，令你不方便。','我現在補印並請你核對。'],choices:['對不起，令你不方便。','我現在補印並請你核對。','我明白文件少了一頁。'],labels:['確認','道歉','處理'],hint:'先確認少了甚麼，再說補救。'},
      {caseText:'同學說：「你傳來的檔案打不開。」',answer:['我知道你現在打不開檔案。','對不起，我先再檢查一次。','我現在用另一個方式傳給你。'],choices:['我現在用另一個方式傳給你。','我知道你現在打不開檔案。','對不起，我先再檢查一次。'],labels:['確認','道歉','處理'],hint:'先承認問題，再提出可行下一步。'},
      {caseText:'客人說：「我想知道洗手間在哪裏。」',answer:['我明白你想找洗手間。','不好意思讓你要等。','我現在指給你看並帶你到附近位置。'],choices:['我現在指給你看並帶你到附近位置。','不好意思讓你要等。','我明白你想找洗手間。'],labels:['確認','道歉','處理'],hint:'先確認需要，再提供實際協助。'}]
  };
  Object.entries(EXTRA_ROUNDS).forEach(([key, rounds]) => ACTIVITIES[key].rounds.push(...rounds));
  const ANSWER_POSITION_PATTERNS = {
    sound: [1,0,2,1,2,0,1,0],
    portal: [2,1,0,2,0,1,2,0],
    emotion: [0,2,1,0,1,2,0,2],
    subtext: [2,0,1,2,0,1,0,1]
  };
  Object.entries(ANSWER_POSITION_PATTERNS).forEach(([key, pattern]) => {
    ACTIVITIES[key].answerPositionStrategy = 'irregular-balanced';
    ACTIVITIES[key].answerPositionPattern = pattern;
  });

  let host = null;
  let stage = 'lower';
  let state = null;
  let options = null;
  let returnFocus = null;
  let keyHandler = null;
  let audioContext = null;
  let timers = [];
  const preferences = { sound: true, visual: true };
  const q = (selector) => host?.querySelector(selector);
  const qa = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const wait = (callback, ms = 760) => { const id = window.setTimeout(callback, ms); timers.push(id); return id; };
  const clearTimers = () => { timers.forEach(window.clearTimeout); timers = []; };
  const stableSeed = (...parts) => [...parts.join('|')].reduce((seed, char) => ((seed * 31) + char.charCodeAt(0)) >>> 0, 2166136261);
  const stableShuffle = (items, ...parts) => { const copy = [...items]; let seed = stableSeed(...parts); for (let index = copy.length - 1; index > 0; index -= 1) { seed = ((seed * 1664525) + 1013904223) >>> 0; const swap = seed % (index + 1); [copy[index], copy[swap]] = [copy[swap], copy[index]]; } return copy; };
  const orderedSimpleChoices = (choices, answer) => { const pattern = activeActivity()?.answerPositionPattern; const answerPosition = pattern?.[state?.index % pattern.length]; if (!Number.isInteger(answerPosition) || answerPosition < 0 || answerPosition >= choices.length || !choices.includes(answer)) return stableShuffle(choices, stage, state?.game, state?.index, 'simple'); const others = choices.filter((choice) => choice !== answer); return choices.map((choice, index) => index === answerPosition ? answer : others.shift()); };
  const stageLabel = () => ({ lower: '初小 · P1–P3', upper: '高小 · P4–P6', junior: '初中 · S1–S3', senior: '高中 · S4–S6' }[stage] || '初小 · P1–P3');
  const activeActivity = () => ACTIVITIES[state?.game];
  const focusable = () => qa('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])').filter((element) => element.offsetParent !== null);
  const focusSoon = (selector) => window.requestAnimationFrame(() => q(selector)?.focus());

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/[「」]/g, ''));
    utterance.lang = 'zh-HK'; utterance.rate = .76;
    window.speechSynthesis.speak(utterance);
  }

  function playTone(kind = 'correct') {
    if (!preferences.sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const notes = kind === 'finish' ? [523, 659, 784] : [523, 659];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, audioContext.currentTime + index * .08);
        gain.gain.exponentialRampToValueAtTime(.018, audioContext.currentTime + index * .08 + .02);
        gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + index * .08 + .16);
        oscillator.connect(gain).connect(audioContext.destination); oscillator.start(audioContext.currentTime + index * .08); oscillator.stop(audioContext.currentTime + index * .08 + .18);
      });
    } catch {}
  }

  function reward(kind = 'correct') {
    state.stars = Math.min(5, (state.stars || 0) + (kind === 'finish' ? 2 : 1));
    const meter = q('#sliStars');
    if (meter) { meter.textContent = `${'★'.repeat(state.stars)}${'☆'.repeat(5 - state.stars)}`; meter.parentElement?.setAttribute('aria-label', `本節努力星 ${state.stars} / 5`); meter.parentElement?.classList.add('earned'); wait(() => meter.parentElement?.classList.remove('earned'), 360); }
    if (preferences.visual) {
      const burst = document.createElement('div'); burst.className = 'sli-reward'; burst.setAttribute('aria-hidden', 'true');
      burst.innerHTML = ['✨', '💬', '⭐'].map((icon, index) => `<span style="--delay:${index * 55}ms">${icon}</span>`).join('');
      q('.sli-lab')?.appendChild(burst); wait(() => burst.remove(), 820);
    }
    playTone(kind);
  }

  function feedback(text, tone = '', rewardKind = '') {
    const node = q('#sliFeedback'); if (!node) return;
    node.className = `sli-feedback ${tone}`; node.textContent = text;
    if (tone === 'ok' && rewardKind !== 'none') reward(rewardKind || 'correct');
  }

  function close() {
    clearTimers(); window.speechSynthesis?.cancel();
    document.removeEventListener('keydown', keyHandler); keyHandler = null;
    host?.remove(); host = null;
    if (returnFocus?.isConnected) returnFocus.focus();
  }

  function trapKeys(event) {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable(); if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function tray() {
    const stars = state?.stars || 0;
    return `<aside class="sli-tray" aria-label="低壓支持與回饋設定"><div class="sli-stars" aria-label="本節努力星 ${stars} / 5"><span id="sliStars" aria-hidden="true">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span><strong>努力星 ${stars} / 5</strong></div><div class="sli-tools"><button id="sliRule" type="button">👁 看規則</button><button id="sliRead" type="button">🔊 朗讀本頁</button><button id="sliBreak" type="button">☁ 先停一停</button><button id="sliSound" type="button" aria-pressed="${preferences.sound}">${preferences.sound ? '🔊 回饋聲：開' : '🔇 回饋聲：關'}</button><button id="sliVisual" type="button" aria-pressed="${preferences.visual}">${preferences.visual ? '✨ 視覺獎勵：開' : '◌ 視覺獎勵：關'}</button></div><div id="sliSupportNote" class="sli-support-note" role="status" aria-live="polite" aria-atomic="true" hidden></div></aside>`;
  }

  function shell(content) {
    if (!host) return;
    host.innerHTML = `<div class="sli-core-shell" role="dialog" aria-modal="true" aria-label="SLI 理解與表達訓練室"><section class="sli-lab">${content}${tray()}</section></div>`;
    q('.sli-close')?.addEventListener('click', close); bindTray();
  }

  function top(title, description, eyebrow = 'SLI · 理解與表達') {
    return `<header class="sli-top"><div><div class="sli-eyebrow">${eyebrow}</div><h2>${title}</h2><p>${description}</p></div><button class="sli-close" type="button" aria-label="關閉 SLI 訓練室">×</button></header>`;
  }

  function note(text, actions = false) {
    const node = q('#sliSupportNote'); if (!node) return; node.hidden = false;
    node.innerHTML = actions ? `${text}<span><button id="sliRestart" type="button">↺ 重新開始這一項</button><button id="sliMenu" type="button">換一項練習</button></span>` : text;
    q('#sliRestart')?.addEventListener('click', () => renderReady(state.game)); q('#sliMenu')?.addEventListener('click', renderMenu);
  }

  function readCurrentPage() {
    const activity = activeActivity(); const round = state?.rounds?.[state.index];
    if (state?.preparing) speak(`${activity.title}。${activity.prep.join('。')}`);
    else if (round) speak(`${round.prompt || round.story || round.context || round.order || round.quote || round.topic || round.question || round.caseText}。${round.hint || ''}`);
    else speak('可先選一項練習，開始前都有三步規則。');
  }

  function bindTray() {
    q('#sliRule')?.addEventListener('click', () => { const rule = q('.sli-rule'); rule?.classList.add('highlight'); rule?.scrollIntoView({ behavior: 'smooth', block: 'center' }); wait(() => rule?.classList.remove('highlight'), 760); note(rule ? '規則已標示。現在只做眼前的一小步。' : '每項開始前都可以先看三步規則。'); });
    q('#sliRead')?.addEventListener('click', readCurrentPage);
    q('#sliBreak')?.addEventListener('click', () => { clearTimers(); note('可以先停一停，不會扣分。準備好後可重新開始、換一項或離開。', true); });
    q('#sliSound')?.addEventListener('click', () => { preferences.sound = !preferences.sound; const button = q('#sliSound'); button.setAttribute('aria-pressed', String(preferences.sound)); button.textContent = preferences.sound ? '🔊 回饋聲：開' : '🔇 回饋聲：關'; note(preferences.sound ? '已開啟溫和回饋聲。' : '已關閉回饋聲；文字提示仍會保留。'); });
    q('#sliVisual')?.addEventListener('click', () => { preferences.visual = !preferences.visual; const button = q('#sliVisual'); button.setAttribute('aria-pressed', String(preferences.visual)); button.textContent = preferences.visual ? '✨ 視覺獎勵：開' : '◌ 視覺獎勵：關'; note(preferences.visual ? '已開啟柔和視覺獎勵。' : '已關閉動態視覺效果；文字支持仍會保留。'); });
  }

  function progress() {
    const total = state?.rounds?.length || 1; const now = Math.min((state?.index || 0) + 1, total);
    return `<div class="sli-progress" role="progressbar" aria-label="${activeActivity()?.title || 'SLI 訓練'}進度" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${now}" aria-valuetext="第 ${now} / ${total} 回合"><span>第 ${now} / ${total} 回合</span><i><b style="width:${Math.round(now / total * 100)}%"></b></i></div>`;
  }

  function renderMenu() {
    clearTimers(); state = { game: null, stars: 0, index: 0, rounds: [] };
    const cards = activityCards(stage).map((game) => `<button class="sli-game-card" type="button" data-sli-game="${game.sliActivityKey}"><span aria-hidden="true">${game.icon}</span><strong>${game.title}</strong><small>${game.focus}</small><p>${game.description}</p><em>${stageLabel()} 直接選關</em></button>`).join('');
    shell(`${top('選擇一項言語練習', '每項開始前都可先一起讀規則。可以慢慢讀、請教師代讀、使用提示、換練習或隨時離開。', stageLabel())}<div class="sli-game-grid">${cards}</div><aside class="sli-low-pressure"><strong>低壓參與</strong><span>學生可指一指、按句卡、聽粵語朗讀或先與教師一起完成第一步；不要求一次完成所有回合。</span></aside>`);
    qa('[data-sli-game]').forEach((button) => button.addEventListener('click', () => renderReady(button.dataset.sliGame)));
    focusSoon('.sli-close');
  }

  function renderReady(game) {
    clearTimers(); const activity = ACTIVITIES[game]; if (!activity) { renderMenu(); return; }
    state = { game, stars: 0, index: 0, correct: 0, incorrect: 0, preparing: true, rounds: activity.rounds, selected: [] };
    shell(`${top(`${activity.title} · 準備頁`, '請先由教師帶讀。未按「我準備好了」前，不會出題或播放回饋聲；本網站不會請求咪高峰權限或錄音。', `${stageLabel()} · 一起準備`)}<section class="sli-ready" aria-labelledby="sliReadyTitle"><div class="sli-ready-icon" aria-hidden="true">${activity.icon}</div><div><p>先一起讀三步</p><h3 id="sliReadyTitle">準備好了才開始</h3><ol>${activity.prep.map((step) => `<li>${step}</li>`).join('')}</ol><small>學生可以用點頭、指一指、手勢、按按鈕或說「我準備好了」表示可以開始。</small></div></section><div class="sli-actions"><button id="sliReadyBack" class="sli-secondary" type="button">← 換一項練習</button><button id="sliReadyStart" class="sli-primary" type="button">✓ 我準備好了，開始第一回合</button></div><div id="sliFeedback" class="sli-feedback" role="status" aria-live="polite" aria-atomic="true">現在是準備時間，尚未開始出題。</div>`);
    q('#sliReadyBack')?.addEventListener('click', renderMenu); q('#sliReadyStart')?.addEventListener('click', begin); focusSoon('#sliReadyStart');
  }

  function begin() { state.preparing = false; state.index = 0; state.selected = []; renderRound(); }

  function next() {
    state.index += 1; state.selected = [];
    if (state.index >= state.rounds.length) { finish(); return; }
    renderRound();
  }

  function finish() {
    clearTimers(); const activity = activeActivity();
    options?.onComplete?.({ label: `${activity.title} · ${stageLabel()}`, mode: `sli-${state.game}`, total: state.rounds.length, correct: state.correct, incorrect: state.incorrect, completedAt: new Date().toLocaleString('zh-HK') });
    shell(`${top('本次言語練習回顧', '你可以休息、重玩較短內容，或選擇另一項活動。結果只供本節課堂回顧，不作比較或診斷。', `完成 · ${stageLabel()}`)}<section class="sli-summary"><div><span>完成回合</span><strong>${state.rounds.length} / ${state.rounds.length}</strong></div><div><span>正確嘗試</span><strong>${state.correct}</strong></div><div><span>努力星</span><strong>${state.stars} / 5</strong></div></section><p class="sli-rule">每一次慢慢聽、提出需要、重聽指示或重新嘗試，都是可被看見的努力。</p><div class="sli-actions"><button id="sliRestart" class="sli-secondary" type="button">↺ 再玩這一項</button><button id="sliMenu" class="sli-primary" type="button">選另一項練習</button></div><div id="sliFeedback" class="sli-feedback" role="status" aria-live="polite" aria-atomic="true">本次練習完成，可以先休息一下。</div>`);
    reward('finish'); q('#sliRestart')?.addEventListener('click', () => renderReady(state.game)); q('#sliMenu')?.addEventListener('click', renderMenu); focusSoon('#sliMenu');
  }

  function choiceMarkup(choices, attribute = 'data-sli-choice', answer = '') {
    const shownChoices = answer ? orderedSimpleChoices(choices, answer) : stableShuffle(choices, stage, state?.game, state?.index, 'simple');
    return `<div class="sli-choice-grid">${shownChoices.map((choice) => `<button type="button" class="sli-choice" ${attribute}="${choice}">${choice}</button>`).join('')}</div>`;
  }

  function sequenceMarkup(round, selected, name) {
    const labels = round.labels || ['第一步', '第二步', '第三步'];
    return `<div class="sli-sequence-slots" aria-label="按順序放入語句">${labels.map((label, index) => `<div class="sli-slot ${selected[index] ? 'filled' : ''}" data-sli-slot="${index}" tabindex="0" aria-label="${label}位置，${selected[index] || '尚未放入內容'}"><span>${label}</span><strong>${selected[index] || '？'}</strong></div>`).join('')}</div><div class="sli-piece-bank" aria-label="可選擇的${name}">${stableShuffle(round.choices, stage, state?.game, state?.index, 'sequence').map((piece) => `<button type="button" draggable="true" class="sli-piece ${selected.includes(piece) ? 'used' : ''}" data-sli-piece="${piece}" ${selected.includes(piece) ? 'disabled' : ''}>${piece}</button>`).join('')}</div>`;
  }

  function portalMarkup(round) {
    return `<div class="sli-portal-item" draggable="true" data-sli-portal-item="${round.name}" aria-label="可拖拉的物件卡：${round.name}"><span aria-hidden="true">${round.item}</span><strong>${round.name}</strong><small>可拖到傳送門，或直接按傳送門。</small></div><p class="sli-rule">把「${round.name}」送到正確類別。可以拖拉物件卡，也可以按傳送門。</p><div class="sli-choice-grid sli-portal-grid">${orderedSimpleChoices(round.choices, round.answer).map((choice) => `<button type="button" class="sli-choice sli-portal" data-sli-portal="${choice}">${choice}</button>`).join('')}</div>`;
  }

  function soundMarkup(round) {
    return `<div class="sli-magic-island" aria-label="聲音魔法島"><span aria-hidden="true">🏝️</span><div><strong>目標字：${round.target}</strong><small>一起聽「${round.target}」的第一個聲音。</small></div><span class="sli-growth" id="sliGrowth" aria-hidden="true">🌱</span></div><p class="sli-rule">這是聽音和練習的遊戲，不會替學生自動判定發音是否正確。</p>${choiceMarkup(round.choices, 'data-sli-choice', round.answer)}<div class="sli-voice-tools"><strong>不用開啟咪高峰</strong><small>可以只聽、指圖、看句卡或跟教師一起說；本網站不錄音、不上傳，也不分析聲音。</small></div>`;
  }

  function sequenceView(round, label, caption) {
    return `<div class="sli-scene-card"><strong>${label}</strong><p>${caption}</p></div><p class="sli-rule">每次選一張卡。選對後會放入對應位置；不知道時可先按「看規則」或「朗讀本頁」。</p>${sequenceMarkup(round, state.selected, label)}`;
  }

  function renderRound() {
    const activity = activeActivity(); const round = state.rounds[state.index];
    let body = '';
    if (state.game === 'sound') body = soundMarkup(round);
    else if (state.game === 'portal') body = portalMarkup(round);
    else if (state.game === 'factory') body = sequenceView(round, '句子語塊', round.prompt);
    else if (state.game === 'timeline') body = sequenceView(round, '故事卡', round.story);
    else if (state.game === 'emotion') body = `<article class="sli-emotion-scene"><span aria-hidden="true">${round.face}</span><p>${round.context}</p><strong>${round.prompt}</strong></article><aside class="sli-teacher-card"><strong>教師引導</strong><p>${round.teacher}</p></aside>${choiceMarkup(round.choices, 'data-sli-choice', round.answer)}`;
    else if (state.game === 'courier') body = sequenceView(round, '指示卡', round.order);
    else if (state.game === 'subtext') body = `<article class="sli-quote-card"><span>角色說：</span><strong>${round.quote}</strong><p>${round.context}</p><em>${round.prompt}</em></article>${choiceMarkup(round.choices, 'data-sli-choice', round.answer)}`;
    else if (state.game === 'debate') body = sequenceView(round, '理據卡', `${round.topic}｜本回合立場：${round.position}`);
    else if (state.game === 'interview') body = sequenceView(round, '面試句卡', round.question);
    else if (state.game === 'resolve') body = sequenceView(round, '應變句卡', round.caseText);
    shell(`${top(activity.title, activity.description, `${stageLabel()} · ${state.index + 1} / ${state.rounds.length}`)}${progress()}<section class="sli-play-area">${body}</section><div id="sliFeedback" class="sli-feedback" role="status" aria-live="polite" aria-atomic="true">${round.hint}</div>`);
    bindRound(round); focusSoon(state.game === 'sound' || state.game === 'portal' || state.game === 'emotion' || state.game === 'subtext' ? '.sli-choice' : '.sli-piece');
  }

  function markCorrect(message) {
    state.correct += 1; feedback(`✓ ${message}`, 'ok'); wait(next, 840);
  }

  function chooseSimple(choice, round) {
    const answer = round.answer;
    if (choice === answer) {
      const extra = state.game === 'sound' ? `${round.growth} 你聽到了相近聲音。` : state.game === 'subtext' ? `可以接著說：「${round.follow}」` : '這是一個清楚而可做到的選擇。';
      if (state.game === 'sound') q('#sliGrowth').textContent = round.growth.split(' ')[0];
      markCorrect(`${extra}`); return;
    }
    state.incorrect += 1; feedback(`↗ ${round.hint}`, 'try', 'none');
  }

  function chooseSequence(piece, round) {
    if (state.selected.includes(piece)) return;
    const expected = round.answer[state.selected.length];
    if (piece !== expected) { state.incorrect += 1; feedback(`↗ ${round.hint}`, 'try', 'none'); return; }
    state.selected.push(piece); renderRound();
    if (state.selected.length === round.answer.length) { markCorrect('你把內容按清楚次序組合好了。'); }
    else feedback(`✓ 已放入「${piece}」。現在慢慢看下一格。`, 'ok');
  }

  function bindRound(round) {
    if (state.game === 'sound') { qa('[data-sli-choice]').forEach((button) => button.addEventListener('click', () => chooseSimple(button.dataset.sliChoice, round))); return; }
    if (state.game === 'portal') {
      const item = q('[data-sli-portal-item]');
      item?.addEventListener('dragstart', (event) => { state.dragging = round.name; event.dataTransfer?.setData('text/plain', round.name); event.dataTransfer.effectAllowed = 'move'; item.classList.add('dragging'); });
      item?.addEventListener('dragend', () => { state.dragging = ''; item.classList.remove('dragging'); qa('.sli-portal').forEach((portal) => portal.classList.remove('drop-target')); });
      qa('[data-sli-portal]').forEach((button) => {
        button.addEventListener('click', () => chooseSimple(button.dataset.sliPortal, round));
        button.addEventListener('dragover', (event) => { event.preventDefault(); button.classList.add('drop-target'); });
        button.addEventListener('dragleave', () => button.classList.remove('drop-target'));
        button.addEventListener('drop', (event) => { event.preventDefault(); button.classList.remove('drop-target'); const name = event.dataTransfer?.getData('text/plain') || state.dragging; if (name === round.name) chooseSimple(button.dataset.sliPortal, round); });
      });
      return;
    }
    if (['emotion', 'subtext'].includes(state.game)) { qa('[data-sli-choice]').forEach((button) => button.addEventListener('click', () => chooseSimple(button.dataset.sliChoice, round))); return; }
    qa('[data-sli-piece]').forEach((button) => {
      button.addEventListener('click', () => chooseSequence(button.dataset.sliPiece, round));
      button.addEventListener('dragstart', (event) => { state.dragging = button.dataset.sliPiece; event.dataTransfer?.setData('text/plain', state.dragging); event.dataTransfer.effectAllowed = 'move'; button.classList.add('dragging'); });
      button.addEventListener('dragend', () => { state.dragging = ''; button.classList.remove('dragging'); qa('.sli-slot').forEach((slot) => slot.classList.remove('drop-target')); });
    });
    qa('[data-sli-slot]').forEach((slot) => {
      slot.addEventListener('dragover', (event) => { event.preventDefault(); if (Number(slot.dataset.sliSlot) === state.selected.length) slot.classList.add('drop-target'); });
      slot.addEventListener('dragleave', () => slot.classList.remove('drop-target'));
      slot.addEventListener('drop', (event) => { event.preventDefault(); slot.classList.remove('drop-target'); const piece = event.dataTransfer?.getData('text/plain') || state.dragging; if (Number(slot.dataset.sliSlot) !== state.selected.length) { feedback('↗ 先把語塊放到下一個有問號的位置。', 'try', 'none'); return; } if (piece) chooseSequence(piece, round); });
    });
  }

  function injectStyle() {
    if (document.getElementById('sli-core-style')) return;
    const style = document.createElement('style'); style.id = 'sli-core-style';
    style.textContent = `.sli-core-host{position:fixed;inset:0;z-index:10000;background:rgba(32,24,53,.62);padding:20px;overflow:auto}.sli-core-shell{min-height:100%;display:grid;place-items:center}.sli-lab{position:relative;width:min(1080px,100%);max-height:calc(100vh - 40px);overflow:auto;border-radius:30px;background:#fff;color:#243758;box-shadow:0 26px 76px rgba(18,13,37,.35);padding:clamp(24px,4vw,48px)}.sli-top{display:flex;gap:18px;justify-content:space-between;align-items:flex-start}.sli-eyebrow{color:#a14570;font-size:14px;font-weight:900;letter-spacing:.08em}.sli-top h2{margin:6px 0 8px;font-size:clamp(30px,4vw,50px);line-height:1.1}.sli-top p{margin:0;color:#667289;font-size:18px;line-height:1.6}.sli-close{border:0;width:54px;height:54px;border-radius:50%;background:#f4f3fa;color:#4c5271;font-size:38px;line-height:1;cursor:pointer;flex:0 0 auto}.sli-progress{margin:26px 0 20px;display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;font-weight:900;color:#915173}.sli-progress i{display:block;height:14px;border-radius:999px;background:#eee6eb;position:relative;overflow:hidden}.sli-progress i b{display:block;height:100%;border-radius:inherit;background:#dc6b94;transition:width .18s cubic-bezier(.23,1,.32,1)}.sli-play-area{border:1px solid #eedde5;border-radius:26px;background:linear-gradient(145deg,#fffafd,#f8fbff);padding:clamp(20px,4vw,36px);margin-bottom:18px}.sli-rule{margin:16px 0;padding:13px 16px;border-radius:14px;background:#fff5f8;border-left:5px solid #d86490;color:#5d4862;font-size:16px;font-weight:750;line-height:1.55}.sli-tray{margin-top:22px;padding:16px;border-radius:20px;background:#f8f4f8;border:1px solid #eadde8}.sli-stars{display:flex;gap:12px;align-items:center;color:#9a416d;font-weight:900}.sli-stars span{font-size:24px;letter-spacing:2px}.sli-stars.earned{animation:sliStar .36s ease-out}.sli-tools{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.sli-tools button,.sli-actions button,.sli-voice-tools button{min-height:48px;border:1px solid #d9c9d4;border-radius:12px;background:#fff;color:#4d3650;padding:9px 14px;font-size:15px;font-weight:850;cursor:pointer}.sli-tools button:focus-visible,.sli-choice:focus-visible,.sli-piece:focus-visible,.sli-game-card:focus-visible,.sli-close:focus-visible,.sli-actions button:focus-visible{outline:4px solid #176b79;outline-offset:3px}.sli-support-note{margin-top:12px;padding:12px;border-radius:12px;background:#fff;border-left:4px solid #d86490;font-weight:750;line-height:1.5}.sli-support-note span{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.sli-support-note button{border:1px solid #a94e77;background:#fff;border-radius:9px;padding:7px 10px;font-weight:850;cursor:pointer}.sli-game-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}.sli-game-card{min-height:210px;text-align:left;border:2px solid #e8d9e3;border-radius:22px;background:#fff;padding:20px;cursor:pointer;transition:transform .18s cubic-bezier(.23,1,.32,1),box-shadow .18s cubic-bezier(.23,1,.32,1),border-color .18s}.sli-game-card:hover{transform:translateY(-3px);border-color:#cd658f;box-shadow:0 12px 24px rgba(124,52,87,.15)}.sli-game-card>span{display:block;font-size:36px}.sli-game-card strong{display:block;margin-top:10px;font-size:21px}.sli-game-card small{display:block;margin-top:5px;color:#a14570;font-weight:850}.sli-game-card p{color:#5d6780;line-height:1.45}.sli-game-card em{font-size:13px;color:#6f5471;font-style:normal;font-weight:800}.sli-low-pressure{margin-top:20px;padding:16px;border-radius:18px;background:#fff7df;color:#63532b;line-height:1.55}.sli-low-pressure strong{display:block;margin-bottom:5px}.sli-ready{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center;padding:28px;border:1px solid #ecdce5;border-radius:24px;background:#fffafa}.sli-ready-icon{font-size:70px;line-height:1}.sli-ready p{margin:0;color:#a14570;font-weight:900}.sli-ready h3{margin:5px 0;font-size:27px}.sli-ready li{padding:6px 0;line-height:1.5}.sli-ready small{color:#5d677d;font-weight:700;line-height:1.5}.sli-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}.sli-primary{background:#a84b75!important;color:#fff!important;border-color:#a84b75!important}.sli-secondary{background:#fff!important}.sli-feedback{margin-top:16px;min-height:48px;padding:13px 16px;border-radius:14px;background:#f4f1f6;color:#59647a;font-weight:750;line-height:1.5}.sli-feedback.ok{background:#e8f7ef;color:#176843;border-left:5px solid #36a269}.sli-feedback.try{background:#fff7e7;color:#855c14;border-left:5px solid #d59b31}.sli-feedback.hint{background:#f3edff;color:#5e4295;border-left:5px solid #8d69cf}.sli-magic-island,.sli-portal-item,.sli-emotion-scene,.sli-quote-card,.sli-scene-card{border-radius:20px;padding:22px;background:#f7f0f6;display:flex;gap:16px;align-items:center}.sli-magic-island>span,.sli-portal-item>span,.sli-emotion-scene>span{font-size:56px}.sli-magic-island strong,.sli-portal-item strong{display:block;font-size:30px}.sli-magic-island small{display:block;color:#657089;margin-top:4px}.sli-growth{margin-left:auto!important}.sli-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.sli-choice,.sli-piece{min-height:76px;border:2px solid #ddccda;border-radius:16px;background:#fff;color:#263756;padding:12px;font-size:18px;font-weight:850;line-height:1.38;cursor:pointer;transition:transform .16s cubic-bezier(.23,1,.32,1),background .16s,border-color .16s}.sli-choice:hover,.sli-piece:hover:not(:disabled){transform:translateY(-2px);border-color:#c25b86;background:#fff7fa}.sli-choice:active,.sli-piece:active:not(:disabled){transform:scale(.98)}.sli-choice:disabled,.sli-piece.used{opacity:.52;background:#f4f1f5}.sli-voice-tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:18px}.sli-voice-tools small{width:100%;color:#647087;font-weight:700}.sli-sequence-slots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}.sli-slot{min-height:116px;border:2px dashed #cbb7cf;border-radius:18px;background:#fff;padding:12px;display:flex;flex-direction:column;justify-content:center;text-align:center}.sli-slot span{font-size:13px;color:#8e5f78;font-weight:850}.sli-slot strong{font-size:18px;margin-top:8px;overflow-wrap:anywhere}.sli-slot.filled{border-style:solid;border-color:#b65d84;background:#fff6fa}.sli-piece-bank{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.sli-emotion-scene,.sli-quote-card,.sli-scene-card{display:block}.sli-emotion-scene>span{display:block}.sli-emotion-scene p,.sli-quote-card p,.sli-scene-card p{margin:8px 0;line-height:1.6;font-size:18px}.sli-emotion-scene strong,.sli-quote-card em{display:block;font-size:20px;font-style:normal}.sli-quote-card>span{font-size:14px;color:#a14570;font-weight:900}.sli-quote-card>strong{display:block;font-size:28px;margin:8px 0}.sli-teacher-card{margin:14px 0;padding:14px 16px;border-radius:16px;background:#eef8ff;border-left:5px solid #4c8ab7;color:#355770}.sli-teacher-card p{margin:6px 0 0;line-height:1.5}.sli-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.sli-summary div{padding:18px;border-radius:18px;background:#f7f1f6;text-align:center}.sli-summary span{display:block;font-size:14px;color:#6d6275;font-weight:750}.sli-summary strong{font-size:29px;color:#9c416b}.sli-reward{position:absolute;inset:35% 0 auto;pointer-events:none;display:flex;justify-content:center;gap:16px}.sli-reward span{font-size:28px;animation:sliFloat .72s cubic-bezier(.23,1,.32,1) both;animation-delay:var(--delay)}@keyframes sliFloat{from{opacity:0;transform:translateY(12px) scale(.94)}to{opacity:1;transform:translateY(-28px) scale(1.06)}}@keyframes sliStar{50%{transform:scale(1.09)}}@media(max-width:620px){.sli-core-host{padding:0}.sli-core-shell{display:block}.sli-lab{min-height:100vh;max-height:100vh;border-radius:0;padding:20px 16px}.sli-top h2{font-size:30px}.sli-top p{font-size:16px}.sli-close{width:48px;height:48px;font-size:33px}.sli-progress{grid-template-columns:1fr;gap:8px}.sli-play-area{padding:18px 14px}.sli-game-grid{grid-template-columns:1fr}.sli-game-card{min-height:0}.sli-choice-grid,.sli-piece-bank,.sli-sequence-slots{grid-template-columns:1fr}.sli-choice,.sli-piece{min-height:62px;font-size:18px}.sli-sequence-slots{gap:9px}.sli-slot{min-height:84px}.sli-ready{grid-template-columns:1fr;gap:12px}.sli-ready-icon{font-size:54px}.sli-actions{flex-direction:column}.sli-actions button{width:100%}.sli-tools{display:grid;grid-template-columns:1fr 1fr}.sli-tools button{min-height:50px}.sli-summary{grid-template-columns:1fr}.sli-voice-tools button{width:100%}}@media(prefers-reduced-motion:reduce){.sli-progress i b,.sli-game-card,.sli-choice,.sli-piece{transition:none}.sli-game-card:hover,.sli-choice:hover,.sli-piece:hover{transform:none}.sli-reward span,.sli-stars.earned{animation:none}}`;
    document.head.appendChild(style);
    const dragStyle = document.createElement('style');
    dragStyle.textContent = `.sli-portal-item{cursor:grab;user-select:none}.sli-portal-item.dragging,.sli-piece.dragging{opacity:.55;transform:scale(.98)}.sli-portal.drop-target,.sli-slot.drop-target{border-color:#3e9c78;background:#ebf8f1;box-shadow:0 0 0 4px rgba(62,156,120,.18)}.sli-slot:focus-visible{outline:4px solid #176b79;outline-offset:3px}@media(prefers-reduced-motion:reduce){.sli-portal-item.dragging,.sli-piece.dragging{transform:none}}`;
    document.head.appendChild(dragStyle);
  }

  function activityCards(requestedStage = stage) {
    return Object.entries(ACTIVITIES).filter(([, activity]) => activity.stage.includes(requestedStage)).map(([id, activity]) => ({ id: `sli-${id}`, sliActivityKey: id, icon: activity.icon, title: activity.title, focus: activity.focus, description: activity.description, tag: `${stageLabelFor(requestedStage)} · 直接選關`, tone: 'pink', supports: ['8'], answerPositionStrategy: activity.answerPositionStrategy, answerPositionPattern: activity.answerPositionPattern, rounds: activity.rounds }));
  }

  function stageLabelFor(value) { return ({ lower: 'P1–P3', upper: 'P4–P6', junior: 'S1–S3', senior: 'S4–S6' }[value] || 'P1–P3'); }

  function open({ stage: requestedStage = 'lower', onComplete, activity, trigger } = {}) {
    close(); stage = ACTIVITIES.sound.stage.includes(requestedStage) || ['upper', 'junior', 'senior'].includes(requestedStage) ? requestedStage : 'lower'; options = { onComplete }; returnFocus = trigger || document.activeElement; injectStyle(); host = document.createElement('div'); host.className = 'sli-core-host'; document.body.appendChild(host); keyHandler = trapKeys; document.addEventListener('keydown', keyHandler); if (activity && ACTIVITIES[activity]) renderReady(activity); else renderMenu();
  }

  function openActivity(activity, input = {}) { open({ ...input, activity }); }

  window.SLI_CORE_LAB = { open, openActivity, activityCards, close };
})();
