(() => {
  const ACTIVITIES = {
    'tone-park': {
      stage: ['lower'], icon: '🎼', title: '聲調聽辨魔法樂園', focus: '粵語聲調聽辨與詞語覺察', description: '聽教師或朗讀按鈕的字詞，找出相近聲調線索；不會錄音或自動評定讀音。',
      prep: ['先按「朗讀目標」或由教師慢慢示範字詞。', '只比較這一回合的聲調線索，不用急著回答。', '可以只聽、指卡或跟教師一起說；網站不會錄音或判定讀音。'],
      rounds: [
        { target: '詩 si1', contour: '高平聲線', prompt: '哪一張卡和「詩」有相近的高平聲線？', choices: ['書 syu1', '時 si4', '市 si5'], answer: '書 syu1', hint: '先由教師讀三張卡；可留意「詩」和「書」的聲線都較平穩而高。' },
        { target: '時 si4', contour: '平穩而較低的聲線', prompt: '哪一張卡和「時」有相近的聲調線索？', choices: ['池 ci4', '試 si3', '史 si2'], answer: '池 ci4', hint: '不用看哪個字較熟；先一起聽「時」和三個選項的聲線。' },
        { target: '馬 maa5', contour: '先低後升的聲線', prompt: '哪一張卡和「馬」有相近的聲調線索？', choices: ['耳 ji5', '媽 maa1', '罵 maa6'], answer: '耳 ji5', hint: '可以用手指跟著教師的聲線由低向上走；不確定時請教師再讀一次。' }
      ]
    },
    'cause-workshop': {
      stage: ['lower'], icon: '🔗', title: '因果連線工房', focus: '原因、結果與「因為／所以」複句', description: '把原因和結果卡連起來，再用「因為／所以」積木砌出一條完整意思。',
      prep: ['先看圖像和兩張意思卡，找「先發生甚麼」。', '再找「後來怎樣」的結果卡。', '最後可拖拉或點選「因為／所以」積木；不需要一次說出完整句子。'],
      rounds: [
        { cause: '落大雨', result: '成身濕晒', answer: ['因為', '落大雨', '所以', '成身濕晒'], choices: ['因為', '落大雨', '所以', '成身濕晒'], labels: ['連接詞', '原因', '連接詞', '結果'], prompt: '砌出一條說明「落大雨」和「成身濕晒」的因果句。', hint: '先放「因為」，再放原因；中間用「所以」帶出結果。' },
        { cause: '倒瀉牛奶', result: '要抹地', answer: ['因為', '倒瀉牛奶', '所以', '要抹地'], choices: ['所以', '要抹地', '因為', '倒瀉牛奶'], labels: ['連接詞', '原因', '連接詞', '結果'], prompt: '砌出一條說明事情前後的因果句。', hint: '問一問：「為甚麼要抹地？」答案是因為倒瀉了牛奶。' },
        { cause: '沒有帶銀包', result: '要向家人求助', answer: ['因為', '沒有帶銀包', '所以', '要向家人求助'], choices: ['要向家人求助', '因為', '所以', '沒有帶銀包'], labels: ['連接詞', '原因', '連接詞', '結果'], prompt: '砌出一條有原因和下一步的因果句。', hint: '先看引起事情的原因，最後才放可以做的下一步。' }
      ]
    },
    'word-net': {
      stage: ['upper'], icon: '🐟', title: '深海字詞捕魚船', focus: '語義線索與字詞提取', description: '從圖像、用途、類別和特徵線索慢慢找出目標詞卡；可再看線索，不計反應時間。',
      prep: ['先看圖像和三條線索，可以一條一條讀。', '想一想它屬於哪一類、可以做甚麼和有甚麼特徵。', '慢慢選詞卡；想不到時可再看線索或請教師一起說。'],
      rounds: [
        { silhouette: '🦒', prompt: '根據長頸、草原和斑點三條線索，找出字詞魚。', clues: ['有很長的頸', '常見於非洲草原', '身上有斑點'], choices: ['長頸鹿', '斑馬', '大象'], answer: '長頸鹿', hint: '可先把三條線索分成外形、地方和特徵；不需要急著選。', success: '你把不同線索連到同一個詞語。' },
        { silhouette: '🔭', prompt: '根據看遠處、鏡片和觀星三條線索，找出字詞魚。', clues: ['可以看遠處的物件', '有鏡片', '觀星時可能會用到'], choices: ['望遠鏡', '顯微鏡', '放大鏡'], answer: '望遠鏡', hint: '先看用途：它用來看遠處，不是看很小的東西。', success: '你慢慢用用途和特徵找到了詞語。' },
        { silhouette: '🌋', prompt: '根據熔岩、地底力量和自然地貌三條線索，找出字詞魚。', clues: ['是一種自然地貌', '有時會噴出熔岩', '地底的力量會推動它'], choices: ['火山', '瀑布', '沙丘'], answer: '火山', hint: '可以先想哪一個地方會和熔岩有關。', success: '你用關鍵線索選出了相符詞語。' }
      ]
    },
    'pace-route': {
      stage: ['upper'], icon: '📮', title: '慢速訊息遞送', focus: '說話前準備與自選支援', description: '在虛構傳訊情境選擇舒服的準備方式；不評定說話快慢、停頓或流暢度。',
      prep: ['先看要傳遞的短訊息，想一想自己想用哪種方法準備。', '可以選句卡、先想一句、停一停、請教師示範或只聽範例。', '網站不錄音，也不分析或評定聲音、速度、停頓或流暢度。'],
      rounds: [
        { message: '「請你收件。」', prompt: '傳遞易碎物品前，你想先選哪一個舒服方法？', choices: ['先看句卡，再慢慢說一遍', '立即連續說很多次', '必須一次說得完全一樣'], answer: '先看句卡，再慢慢說一遍', example: '請你收件。', hint: '這不是速度挑戰；先用一個自己覺得可行的小方法。', success: '你選了一個可按自己節奏使用的方法。' },
        { message: '「我想確認明天的集合時間。」', prompt: '傳訊前不太肯定內容時，哪一個做法可幫自己準備？', choices: ['先圈出關鍵詞，再說或按句卡', '假裝已經明白', '必須不可以停頓'], answer: '先圈出關鍵詞，再說或按句卡', example: '我想確認明天的集合時間。', hint: '可以先找「確認」「明天」「集合時間」三個重點。', success: '你選了可讓訊息更清楚的準備方式。' },
        { message: '「我可以請你再說一次嗎？」', prompt: '覺得訊息說得太快或聽不清楚時，哪一句最能幫助你？', choices: ['我可以請你再說一次嗎？', '我一定要猜中', '我不能請任何人幫忙'], answer: '我可以請你再說一次嗎？', example: '我可以請你再說一次嗎？', hint: '清楚提出需要是一種有效溝通方法，不需要勉強自己猜。', success: '你選了清楚而可實行的求助句。' }
      ]
    },
    'idiom-decoder': {
      stage: ['junior'], icon: '🕵️', title: '成語與隱喻解碼室', focus: '非字面語言與概念映射', description: '從字面圖像、情境與可能意思卡找線索，理解成語、俗語和隱喻不一定按字面解讀。',
      prep: ['先看句子出現的情境，不急著只看字面圖像。', '比較不同意思卡，找最能配合情境的一張。', '不確定時可按朗讀、看提示或和教師一起找證據。'],
      rounds: [
        { phrase: '畫蛇添足', context: '小組海報已完成，但阿文再加入很多無關裝飾，令重要資料反而看不清楚。', prompt: '這句成語在這個情境最可能想提醒甚麼？', choices: ['做多了反而破壞原來已足夠的事', '一定要畫一條真的蛇', '每次都要加入更多裝飾'], answer: '做多了反而破壞原來已足夠的事', hint: '比較「原本已完成」和「後來加了無關內容」兩個情境線索。', success: '你把情境和非字面意思連起來了。' },
        { phrase: '一石二鳥', context: '小美設計一張環保宣傳單，同時提醒同學帶水樽和分類回收。', prompt: '這句成語在這個情境最可能想表達甚麼？', choices: ['一個做法同時達到兩個目的', '要找兩隻真正的鳥', '只能每次做一件事'], answer: '一個做法同時達到兩個目的', hint: '看看她的一張宣傳單做到了幾件有用的事。', success: '你看到了同一做法可以有多個效果。' },
        { phrase: '「佢係班房嘅定海神針。」', context: '小組討論有點混亂時，阿健會提醒大家回到題目，令大家較容易繼續合作。', prompt: '這句說話最可能怎樣形容阿健？', choices: ['他能幫大家穩定下來和回到重點', '他真的是一枝放在海裡的針', '他永遠不可以說話'], answer: '他能幫大家穩定下來和回到重點', hint: '不用把「針」當作真的物件；看他在小組中帶來甚麼作用。', success: '你用情境理解了隱喻的作用。' }
      ]
    },
    'repair-station': {
      stage: ['junior'], icon: '💬', title: '友誼對話修補站', focus: '中性澄清與談話修補', description: '在虛構聊天情境中選擇可行的澄清、確認或下一步句子；不設友誼值或唯一人格判斷。',
      prep: ['先讀對話和前後情況；簡短回覆可以有很多原因。', '先選一個不升級誤會、又能了解情況的下一步。', '可按句卡、請教師代讀、提出其他尊重做法，或跳過這一回合。'],
      rounds: [
        { chat: '阿晴：我剛才的意思是下星期再交。\n同學：哦。', prompt: '看到短回覆「哦」時，哪一句可作為中性確認？', choices: ['我想確認一下：你知道是下星期交嗎？', '你一定不想和我說話。', '你為甚麼只可以回一個字？'], answer: '我想確認一下：你知道是下星期交嗎？', hint: '先確認資料，不用猜定對方的心情或目的。', success: '你選了清楚而不升級誤會的確認句。' },
        { chat: '阿樂：我以為你會負責最後一頁。\n同學：我以為是你。', prompt: '面對分工誤會時，哪一步最能幫大家重新開始？', choices: ['我們可以一起看一次分工表，再決定誰做哪部分。', '一定是有人故意不做。', '不用再說，全部由一個人完成。'], answer: '我們可以一起看一次分工表，再決定誰做哪部分。', hint: '把焦點放回可以核對的資料和下一步，而非猜誰的動機。', success: '你選了可讓小組重新對齊的下一步。' },
        { chat: '阿瑩：我剛才說得不清楚。\n同學：我不太明白。', prompt: '哪一句可幫助談話修補？', choices: ['我可以換個說法：我想問你明天可不可以一起溫習。', '你應該一聽就明白。', '我以後不說話。'], answer: '我可以換個說法：我想問你明天可不可以一起溫習。', hint: '可以把意思說得更具體，並保留對方回應的空間。', success: '你用具體而尊重的方式重新表達了意思。' }
      ]
    },
    'discussion-scaffold': {
      stage: ['senior'], icon: '🧩', title: '討論骨架工作台', focus: '立場、理據、例子與總結組織', description: '用結構卡整理 DSE 或會議題目的想法；可使用句卡、打字或口說。',
      prep: ['先讀討論題目，不需要立刻口頭回答。', '每次先放一張結構卡：立場、理據、例子／回應或總結。', '可只用句卡、自己改寫或請教師一起看；活動沒有倒數，也不會錄音。'],
      rounds: [
        { topic: '中學生應否接受 AI 協助寫作？', prompt: '把一個可討論的觀點按「立場—理據—例子／回應—總結」組合。', answer: ['我的立場：可在教師指引下使用 AI 協助初稿。', '理據：可幫助整理初步想法。', '例子／回應：仍要核對資料和用自己的語言修改。', '總結：使用時需要清楚規則和個人判斷。'], choices: ['總結：使用時需要清楚規則和個人判斷。', '例子／回應：仍要核對資料和用自己的語言修改。', '理據：可幫助整理初步想法。', '我的立場：可在教師指引下使用 AI 協助初稿。'], labels: ['我的立場', '理據', '例子／回應', '總結'], hint: '先說你這一回合想討論的立場，再補一個原因、例子或回應，最後收束重點。', success: '你把一個有起點、理由和收束的觀點組織好了。' },
        { topic: '學校應否保留安靜閱讀時間？', prompt: '把「保留安靜閱讀時間」的立場、理據、例子和總結按順序組合。', answer: ['我的立場：應保留每週安靜閱讀時間。', '理據：不同學生需要固定時間慢慢閱讀。', '例子／回應：可提供不同難度和紙本／電子選擇。', '總結：彈性安排可讓更多學生參與。'], choices: ['理據：不同學生需要固定時間慢慢閱讀。', '總結：彈性安排可讓更多學生參與。', '我的立場：應保留每週安靜閱讀時間。', '例子／回應：可提供不同難度和紙本／電子選擇。'], labels: ['我的立場', '理據', '例子／回應', '總結'], hint: '不用追求一個「最強」答案；先令每一張卡在結構中有清楚作用。', success: '你把立場、理由、例子和總結連成了一段完整想法。' },
        { topic: '校園活動應否讓學生參與路線設計？', prompt: '把「學生參與路線設計」的立場、理據、回應和結論按順序組合。', answer: ['我的立場：可讓學生參與部分路線設計。', '理據：可收集不同使用者的需要。', '例子／回應：同時要由教師核對安全和時間安排。', '總結：一起設計可兼顧參與和實際限制。'], choices: ['例子／回應：同時要由教師核對安全和時間安排。', '我的立場：可讓學生參與部分路線設計。', '總結：一起設計可兼顧參與和實際限制。', '理據：可收集不同使用者的需要。'], labels: ['我的立場', '理據', '例子／回應', '總結'], hint: '一段有組織的意見可以同時說出好處和實際限制。', success: '你清楚安排了立場、理由、回應和結論。' }
      ]
    },
    'voice-use': {
      stage: ['senior'], icon: '🎙️', title: '主持聲音使用提示室', focus: '主持前準備、休息與求助句', description: '在虛構主持情境中選擇一般準備、適時休息和清楚求助方法；不評定聲音或健康。',
      prep: ['先看主持情境，選一個自己覺得可行的準備方式。', '可以使用短講稿、分段讀、喝水、停一停、使用咪高峰或和同伴分工。', '網站不錄音，不量度音量、音高、聲線或「聲帶健康」。'],
      rounds: [
        { situation: '你要在早會讀一段兩句的校園提示。', prompt: '開始前，哪一個做法最能讓你按自己的需要準備？', choices: ['先把講稿分成兩小句，和教師確認閱讀方式', '必須一次讀完而且不能停', '一定要把聲量提高到最大'], answer: '先把講稿分成兩小句，和教師確認閱讀方式', example: '早晨，請大家準時到禮堂集合。', hint: '可以把較長內容拆成較小部分，並和教師商量合適的支援。', success: '你選了一個可調整、可得到支持的準備方式。' },
        { situation: '主持排練中，你覺得想先休息一下。', prompt: '哪一句可以清楚說出你的需要？', choices: ['我想先喝水和休息一分鐘，之後再繼續。', '我一定要不停讀完。', '我不能告訴任何人我的需要。'], answer: '我想先喝水和休息一分鐘，之後再繼續。', example: '我想先喝水和休息一分鐘，之後再繼續。', hint: '使用短而清楚的求助句，能讓同伴或教師知道下一步。', success: '你清楚說出了可實行的休息需要。' },
        { situation: '你和同學一起主持活動，內容較長。', prompt: '哪一個安排可以令大家有較清楚的分工？', choices: ['和同學分段讀，並在每段之間確認下一位', '由一人一定要完成所有內容', '不用看講稿或確認次序'], answer: '和同學分段讀，並在每段之間確認下一位', example: '下一段由你讀，我會在旁邊看提示卡。', hint: '把工作分成可見的小段，能讓每人知道自己的回合。', success: '你選了清楚而可合作的主持安排。' }
      ]
    }
  };
  const EXTRA_ROUNDS = {
    'tone-park': [
      { target:'書 syu1', contour:'高平聲線', prompt:'哪一張卡和「書」有相近的高平聲線？', choices:['夫 fu1','時 si4','市 si5'], answer:'夫 fu1', hint:'先由教師讀三張卡，留意較平穩而高的聲線。' },
      { target:'市 si5', contour:'先低後升的聲線', prompt:'哪一張卡和「市」有相近的聲調線索？', choices:['耳 ji5','試 si3','詩 si1'], answer:'耳 ji5', hint:'可用手指跟著聲線由低向上走。' },
      { target:'試 si3', contour:'中間較平穩的聲線', prompt:'哪一張卡和「試」有相近的聲調線索？', choices:['四 sei3','時 si4','市 si5'], answer:'四 sei3', hint:'不用急著答，先請教師慢慢讀一次。' },
      { target:'飯 faan6', contour:'較低平穩的聲線', prompt:'哪一張卡和「飯」有相近的聲調線索？', choices:['面 min6','粉 fan2','反 faan2'], answer:'面 min6', hint:'留意兩個字最後較低而平穩的走向。' },
      { target:'狗 gau2', contour:'向上走的聲線', prompt:'哪一張卡和「狗」有相近的聲調線索？', choices:['手 sau2','救 gau3','高 gou1'], answer:'手 sau2', hint:'可以再聽一次，找由低向上走的聲線。' }
    ],
    'cause-workshop': [
      { cause:'忘記帶雨傘', result:'被雨淋濕', answer:['因為','忘記帶雨傘','所以','被雨淋濕'], choices:['所以','被雨淋濕','因為','忘記帶雨傘'], labels:['連接詞','原因','連接詞','結果'], prompt:'砌出忘記雨傘和被雨淋濕的因果句。', hint:'先放原因，再放結果。' },
      { cause:'太晚睡覺', result:'早上很疲累', answer:['因為','太晚睡覺','所以','早上很疲累'], choices:['早上很疲累','因為','太晚睡覺','所以'], labels:['連接詞','原因','連接詞','結果'], prompt:'砌出睡覺時間和疲累的因果句。', hint:'想一想先發生的是甚麼。' },
      { cause:'沒有溫習', result:'不懂回答問題', answer:['因為','沒有溫習','所以','不懂回答問題'], choices:['不懂回答問題','所以','因為','沒有溫習'], labels:['連接詞','原因','連接詞','結果'], prompt:'砌出溫習和回答問題的因果句。', hint:'先找引起事情的原因。' },
      { cause:'跟著指示排隊', result:'安全上校巴', answer:['因為','跟著指示排隊','所以','安全上校巴'], choices:['安全上校巴','因為','所以','跟著指示排隊'], labels:['連接詞','原因','連接詞','結果'], prompt:'砌出排隊和安全上車的因果句。', hint:'先想安全上車前做了甚麼。' },
      { cause:'喝了水', result:'喉嚨舒服一點', answer:['因為','喝了水','所以','喉嚨舒服一點'], choices:['所以','喉嚨舒服一點','喝了水','因為'], labels:['連接詞','原因','連接詞','結果'], prompt:'砌出喝水和舒服一點的因果句。', hint:'結果在「所以」後面。' }
    ],
    'word-net': [
      { silhouette:'🐧', prompt:'根據黑白羽毛、會游泳和住在寒冷地方三條線索，找出字詞魚。', clues:['有黑白羽毛','會游泳','常見於寒冷地方'], choices:['企鵝','海豚','鯨魚'], answer:'企鵝', hint:'先看外形和生活地方。', success:'你用不同線索找到了詞語。' },
      { silhouette:'🌈', prompt:'根據雨後、天空和多種顏色三條線索，找出字詞魚。', clues:['雨後有時看見','出現在天空','有多種顏色'], choices:['彩虹','閃電','雲'], answer:'彩虹', hint:'想一想雨後天空常出現甚麼。', success:'你把情境和詞語連起來了。' },
      { silhouette:'🧭', prompt:'根據方向、旅行和指示三條線索，找出字詞魚。', clues:['可幫助找方向','旅行時可能使用','有方向提示'], choices:['指南針','相機','雨傘'], answer:'指南針', hint:'先看用途：它用來找方向。', success:'你用用途找到了詞語。' },
      { silhouette:'🪕', prompt:'根據弦、彈奏和音樂三條線索，找出字詞魚。', clues:['有幾條弦','可以用手彈奏','是一種樂器'], choices:['結他','鼓','長笛'], answer:'結他', hint:'找有弦又可以彈的樂器。', success:'你慢慢整合了線索。' },
      { silhouette:'🚒', prompt:'根據紅色車、緊急支援和水喉三條線索，找出字詞魚。', clues:['通常是紅色','緊急時會出現','有水喉和工具'], choices:['消防車','校巴','的士'], answer:'消防車', hint:'看看哪種車和火警支援有關。', success:'你選出了相符詞語。' }
    ],
    'pace-route': [
      { message:'「我想借這本書。」', prompt:'到圖書館借書前，哪個方法可幫你慢慢準備？', choices:['先看句卡，再試讀一次','一定要不看卡立即說','不能請教師示範'], answer:'先看句卡，再試讀一次', example:'我想借這本書。', hint:'可用句卡和自己的節奏準備。', success:'你選了可行的準備方法。' },
      { message:'「請問洗手間在哪裏？」', prompt:'不清楚地點時，哪個做法可幫自己清楚表達？', choices:['先找關鍵詞，再按句卡問','一定要自己猜','不可以停一停'], answer:'先找關鍵詞，再按句卡問', example:'請問洗手間在哪裏？', hint:'可先圈出「洗手間」和「哪裏」。', success:'你選了可讓訊息清楚的方法。' },
      { message:'「我完成了，可以交嗎？」', prompt:'完成工作後，哪一句可幫你確認下一步？', choices:['我完成了，可以交嗎？','我一定要自己離開','我不能問問題'], answer:'我完成了，可以交嗎？', example:'我完成了，可以交嗎？', hint:'直接而有禮貌地確認即可。', success:'你選了清楚的確認句。' },
      { message:'「我需要多一點時間。」', prompt:'覺得時間太急時，哪個做法較可行？', choices:['先用短句說出需要','一定要勉強加快','假裝自己明白'], answer:'先用短句說出需要', example:'我需要多一點時間。', hint:'可以用短句讓成人知道需要。', success:'你選了尊重自己的方法。' },
      { message:'「請你寫下來，好嗎？」', prompt:'聽不清楚較長指示時，哪個方法可幫自己？', choices:['請對方寫下重點','一定要全部記住','不能再問一次'], answer:'請對方寫下重點', example:'請你寫下來，好嗎？', hint:'文字提示也是有效支持。', success:'你選了可使用的支持方法。' }
    ]
  };
  Object.entries(EXTRA_ROUNDS).forEach(([key, rounds]) => ACTIVITIES[key].rounds.push(...rounds));
  const MORE_ROUNDS = {
    'idiom-decoder': [
      {phrase:'守株待兔',context:'阿傑一直等別人替他完成報告，自己沒有開始。',prompt:'這句成語最可能提醒甚麼？',choices:['只等運氣而不行動未必可行','一定要找真的兔子','永遠不要請人幫忙'],answer:'只等運氣而不行動未必可行',hint:'看情境中他一直等卻沒有開始。',success:'你用情境理解了成語。'},
      {phrase:'雪中送炭',context:'同學沒有文具時，你借筆讓他完成工作。',prompt:'這句成語最可能表達甚麼？',choices:['在別人最需要時提供幫助','下雪時一定要燒炭','只可幫熟朋友'],answer:'在別人最需要時提供幫助',hint:'看幫忙的時間正好是對方需要時。',success:'你連起了情境和意思。'},
      {phrase:'對牛彈琴',context:'你向不熟悉主題的人說很多專門詞，他仍不明白。',prompt:'這句成語最可能提醒甚麼？',choices:['要按聽者需要調整說法','真的要向牛演奏','越多專門詞越好'],answer:'要按聽者需要調整說法',hint:'看對方是否理解內容。',success:'你理解了非字面提醒。'},
      {phrase:'火上加油',context:'朋友已經生氣，你再用責備語氣回應。',prompt:'這句說話最可能形容甚麼？',choices:['令原來問題變得更激烈','真的要為火加油','一定要立刻離開'],answer:'令原來問題變得更激烈',hint:'比較原來生氣和後來責備的效果。',success:'你看到了情境變化。'},
      {phrase:'「他是隊伍的橋樑。」',context:'小組意見不同時，阿琳幫大家把兩邊想法說清楚。',prompt:'這句隱喻最可能形容阿琳甚麼？',choices:['幫不同人互相理解','她真的是一座橋','她不可以表達意見'],answer:'幫不同人互相理解',hint:'看她在小組帶來的作用。',success:'你用情境理解了隱喻。'}
    ],
    'repair-station': [
      {chat:'阿文：明天在三時見；同學：我以為是四時。',prompt:'面對時間不一致，哪一句可幫助修補？',choices:['我們一起看一次訊息確認時間。','一定是你故意記錯。','不用再見面。'],answer:'我們一起看一次訊息確認時間。',hint:'先核對可看到的資料。',success:'你選了中性確認方法。'},
      {chat:'阿欣：你沒有回覆我；同學：我剛才在上課。',prompt:'哪一句較能讓談話繼續？',choices:['原來如此，方便時再回覆就可以。','你一定不重視我。','你以後不用回覆。'],answer:'原來如此，方便時再回覆就可以。',hint:'先回應對方提供的資料。',success:'你選了尊重的下一步。'},
      {chat:'阿健：我想借你的筆；同學：我現在正在用。',prompt:'哪一句可作為清楚回應？',choices:['好，我遲一點再問你。','你一定要立即給我。','我不再和你說話。'],answer:'好，我遲一點再問你。',hint:'對方正在用，可先約另一個時間。',success:'你選了可行的回應。'},
      {chat:'阿晴：你說的是哪一份工作紙？同學：藍色那份。',prompt:'哪一句可以確認自己已理解？',choices:['好，是藍色那份工作紙。','我完全聽不明白。','你說得不清楚。'],answer:'好，是藍色那份工作紙。',hint:'重述關鍵詞可確認理解。',success:'你清楚確認了資料。'},
      {chat:'阿樂：我想換座位；同學：為甚麼？',prompt:'哪一句能較清楚說明需要？',choices:['這裏太嘈，我想坐近一點教師。','你不要問我。','我一定要換。'],answer:'這裏太嘈，我想坐近一點教師。',hint:'說出情況和一個可行需要。',success:'你用具體方式說出了需要。'}
    ],
    'discussion-scaffold': [
      {topic:'學校應否提供更多電子提示？',prompt:'把一個可討論觀點按結構組合。',answer:['我的立場：可提供電子提示作額外選擇。','理據：可讓學生重看重要步驟。','例子／回應：同時保留紙本給有需要的人。','總結：多種提示可讓學生按需要選擇。'],choices:['總結：多種提示可讓學生按需要選擇。','我的立場：可提供電子提示作額外選擇。','理據：可讓學生重看重要步驟。','例子／回應：同時保留紙本給有需要的人。'],labels:['我的立場','理據','例子／回應','總結'],hint:'先立場，再理由、例子和總結。',success:'你組織了一段完整想法。'},
      {topic:'校園活動應否有安靜休息區？',prompt:'把立場、理據、例子和總結按順序組合。',answer:['我的立場：活動可設安靜休息區。','理據：有人需要短暫調節再參與。','例子／回應：可由教師安排清楚位置和規則。','總結：休息區可兼顧參與和需要。'],choices:['理據：有人需要短暫調節再參與。','總結：休息區可兼顧參與和需要。','我的立場：活動可設安靜休息區。','例子／回應：可由教師安排清楚位置和規則。'],labels:['我的立場','理據','例子／回應','總結'],hint:'每張卡都有不同結構作用。',success:'你把觀點說得有條理。'},
      {topic:'中學生應否學習基本急救知識？',prompt:'把一個可討論觀點按結構組合。',answer:['我的立場：應學習基本急救知識。','理據：遇到意外時可知道先找支援。','例子／回應：實習要跟從合資格成人指導。','總結：知識可幫助作出較安全下一步。'],choices:['總結：知識可幫助作出較安全下一步。','理據：遇到意外時可知道先找支援。','例子／回應：實習要跟從合資格成人指導。','我的立場：應學習基本急救知識。'],labels:['我的立場','理據','例子／回應','總結'],hint:'先清楚立場，再補理由和限制。',success:'你完成了有結構的意見。'},
      {topic:'班級旅行應否預先收集無障礙需要？',prompt:'把一個可討論觀點按結構組合。',answer:['我的立場：應預先收集需要。','理據：可安排較合適路線和支持。','例子／回應：資料只由合適人員按需要使用。','總結：提早準備可令參與更安心。'],choices:['例子／回應：資料只由合適人員按需要使用。','我的立場：應預先收集需要。','總結：提早準備可令參與更安心。','理據：可安排較合適路線和支持。'],labels:['我的立場','理據','例子／回應','總結'],hint:'同時看到好處和私隱考慮。',success:'你有條理地安排了想法。'},
      {topic:'學校應否安排同儕互助閱讀？',prompt:'把一個可討論觀點按結構組合。',answer:['我的立場：可安排自願同儕互助閱讀。','理據：學生可用不同方法互相理解內容。','例子／回應：要尊重不想參與的人。','總結：自願和彈性安排較合適。'],choices:['理據：學生可用不同方法互相理解內容。','我的立場：可安排自願同儕互助閱讀。','例子／回應：要尊重不想參與的人。','總結：自願和彈性安排較合適。'],labels:['我的立場','理據','例子／回應','總結'],hint:'立場後要有理由、回應和收束。',success:'你完成了一段完整觀點。'}
    ],
    'voice-use': [
      {situation:'你要在班會讀出一條簡短通知。',prompt:'開始前哪個方法可以讓自己按需要準備？',choices:['先圈出關鍵詞，再和教師試讀。','一定要一次讀完不能停。','一定要用最大聲量。'],answer:'先圈出關鍵詞，再和教師試讀。',example:'請同學明天帶回條。',hint:'可把內容拆小並請教師支持。',success:'你選了可調整的準備方式。'},
      {situation:'排練時你覺得喉嚨有點累。',prompt:'哪一句可以清楚說出需要？',choices:['我想先喝水和休息，稍後再練。','我必須不停說下去。','我不能告訴任何人。'],answer:'我想先喝水和休息，稍後再練。',example:'我想先喝水和休息，稍後再練。',hint:'用短句說出需要即可。',success:'你清楚提出了休息需要。'},
      {situation:'你要介紹小組作品，內容有四點。',prompt:'哪個安排可令自己較容易跟隨？',choices:['把四點寫成提示卡逐點說。','完全不看任何提示。','必須一次說完所有內容。'],answer:'把四點寫成提示卡逐點說。',example:'第一點是……第二點是……',hint:'可用可見提示卡分段。',success:'你選了可支持表達的方法。'},
      {situation:'你和同學輪流讀對話。',prompt:'哪個做法可幫助大家知道回合？',choices:['先標示每人讀哪一句。','由一人猜誰要讀。','不用看對話內容。'],answer:'先標示每人讀哪一句。',example:'這一句由我讀，下一句到你。',hint:'清楚分工能減少等待和猜測。',success:'你選了清楚合作安排。'},
      {situation:'你需要在較嘈的地方作簡短介紹。',prompt:'哪個方法可按需要尋找支持？',choices:['請教師或同伴安排較安靜位置。','一定要忍受所有噪音。','完全不可以求助。'],answer:'請教師或同伴安排較安靜位置。',example:'可以到較安靜位置再說嗎？',hint:'可以清楚提出環境支持需要。',success:'你選了可行的支持方法。'}
    ]
  };
  Object.entries(MORE_ROUNDS).forEach(([key, rounds]) => ACTIVITIES[key].rounds.push(...rounds));
  const ANSWER_POSITION_PATTERNS = {
    'tone-park': [1,0,2,1,2,0,1,0],
    'word-net': [2,1,0,2,0,1,2,0],
    'pace-route': [0,2,1,0,1,2,0,2],
    'idiom-decoder': [2,0,1,2,0,1,0,1],
    'repair-station': [1,2,0,1,0,2,1,0],
    'voice-use': [0,1,2,0,2,1,0,2]
  };
  Object.entries(ANSWER_POSITION_PATTERNS).forEach(([key, pattern]) => {
    ACTIVITIES[key].answerPositionStrategy = 'irregular-balanced';
    ACTIVITIES[key].answerPositionPattern = pattern;
  });

  let host = null;
  let state = null;
  let settings = null;
  let returnFocus = null;
  let keyHandler = null;

  const q = (selector) => host?.querySelector(selector);
  const qa = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const stageLabel = (value = state?.stage) => ({ lower: '初小 · P1–P3', upper: '高小 · P4–P6', junior: '初中 · S1–S3', senior: '高中 · S4–S6' }[value] || '初小 · P1–P3');
  const active = () => ACTIVITIES[state?.game];
  const shuffle = (items) => [...items].sort(() => Math.random() - .5);
  const focusSoon = (selector) => window.requestAnimationFrame(() => q(selector)?.focus());
  const focusable = () => qa('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])').filter((item) => item.offsetParent !== null);

  function speak(text) {
    if (!('speechSynthesis' in window)) { feedback('這部裝置未提供朗讀功能；可請教師慢慢讀一次。', 'hint'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/[「」]/g, ''));
    utterance.lang = 'zh-HK';
    utterance.rate = .75;
    window.speechSynthesis.speak(utterance);
  }

  function feedback(text, tone = '') {
    const node = q('#sli8Feedback');
    if (!node) return;
    node.className = `sli8-feedback ${tone}`;
    node.textContent = text;
  }

  function close() {
    window.speechSynthesis?.cancel();
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
    host?.remove();
    host = null;
    if (returnFocus?.isConnected) returnFocus.focus();
  }

  function trapKeys(event) {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function supportBar() {
    return `<aside class="sli8-support" aria-label="低壓支持工具"><div><strong>低壓參與</strong><span>可聽、看、指卡、和教師一起做、先停一停或離開；不作診斷或比較。</span></div><div class="sli8-tools"><button type="button" id="sli8Rule">👁 看規則</button><button type="button" id="sli8Read">🔊 朗讀本頁</button><button type="button" id="sli8Break">☁ 先停一停</button></div><div id="sli8SupportNote" class="sli8-support-note" role="status" aria-live="polite" aria-atomic="true" hidden></div></aside>`;
  }

  function shell(body) {
    if (!host) return;
    host.innerHTML = `<div class="sli8-shell" role="dialog" aria-modal="true" aria-label="SLI 分學段課堂練習"><section class="sli8-lab">${body}${supportBar()}</section></div>`;
    q('.sli8-close')?.addEventListener('click', close);
    bindSupport();
  }

  function heading(title, description, eyebrow = 'SLI · 課堂練習') {
    return `<header class="sli8-heading"><div><span>${eyebrow}</span><h2>${title}</h2><p>${description}</p></div><button type="button" class="sli8-close" aria-label="關閉 SLI 課堂練習">×</button></header>`;
  }

  function progress() {
    const total = state.rounds.length;
    const current = Math.min(state.index + 1, total);
    return `<div class="sli8-progress" role="progressbar" aria-label="${active().title}進度" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${current}" aria-valuetext="第 ${current} / ${total} 回合"><span>第 ${current} / ${total} 回合</span><i><b style="width:${Math.round(current / total * 100)}%"></b></i></div>`;
  }

  function bindSupport() {
    q('#sli8Rule')?.addEventListener('click', () => {
      const rule = q('.sli8-rule');
      rule?.classList.add('highlight');
      rule?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => rule?.classList.remove('highlight'), 700);
      showSupport(rule ? '已標示眼前規則。現在只做一小步。' : '每項開始前可先看三步規則。');
    });
    q('#sli8Read')?.addEventListener('click', readPage);
    q('#sli8Break')?.addEventListener('click', () => showSupport('可以先停一停，不會扣分。準備好後可重新開始、換一項或隨時離開。', true));
  }

  function showSupport(text, actions = false) {
    const node = q('#sli8SupportNote');
    if (!node) return;
    node.hidden = false;
    node.innerHTML = actions ? `${text}<span><button type="button" id="sli8Restart">↺ 重新開始</button><button type="button" id="sli8Menu">換一項練習</button></span>` : text;
    q('#sli8Restart')?.addEventListener('click', () => renderReady(state.game));
    q('#sli8Menu')?.addEventListener('click', renderMenu);
  }

  function readPage() {
    const activity = active();
    const round = state?.rounds?.[state.index];
    if (state?.preparing) speak(`${activity.title}。${activity.prep.join('。')}`);
    else if (round) speak(`${round.prompt}。${round.hint || ''}`);
    else speak('可先選一項練習，開始前都有三步規則。');
  }


  function renderMenu() {
    const viewStage = state?.stage || settings?.stage || 'lower';
    state = { game: null, stage: viewStage, index: 0, correct: 0, retry: 0, selected: [], rounds: [] };
    const cards = activityCards(viewStage).map((activity) => `<button type="button" class="sli8-card" data-sli8-game="${activity.sliEightActivityKey}"><span aria-hidden="true">${activity.icon}</span><strong>${activity.title}</strong><small>${activity.focus}</small><p>${activity.description}</p><em>${stageLabel(viewStage)} · ${activity.rounds.length} 回合</em></button>`).join('');
    shell(`${heading('選擇一項 SLI 課堂練習', '每項均可先由教師帶讀。學生可選朗讀、看提示、指卡、拖拉／點選替代或直接離開。', stageLabel(viewStage))}<div class="sli8-grid">${cards}</div><p class="sli8-rule">說話和分享均為可選；本網站不會請求咪高峰權限、錄音或分析聲音。活動結果只供本節課堂回顧，不代表構音、聲調、流暢度、聲音或能力。</p><div id="sli8Feedback" class="sli8-feedback" role="status" aria-live="polite" aria-atomic="true">請選一項活動，開始前會先出現三步規則。</div>`);
    qa('[data-sli8-game]').forEach((button) => button.addEventListener('click', () => renderReady(button.dataset.sli8Game)));
    focusSoon('.sli8-close');
  }

  function renderReady(game) {
    const activity = ACTIVITIES[game];
    if (!activity) { renderMenu(); return; }
    state = { game, index: 0, correct: 0, retry: 0, selected: [], rounds: activity.rounds, preparing: true, stage: state?.stage || settings?.stage || 'lower' };
    shell(`${heading(`${activity.title} · 準備頁`, '未按「我準備好了」前，不會出題或播放回饋聲；本網站不會請求咪高峰權限或錄音。', `${stageLabel()} · 一起準備`)}<section class="sli8-ready"><div aria-hidden="true">${activity.icon}</div><div><p>先一起讀三步</p><h3>準備好了才開始</h3><ol>${activity.prep.map((item) => `<li>${item}</li>`).join('')}</ol><small>學生可用點頭、指卡、手勢、按按鈕或說「我準備好了」表示可以開始。</small></div></section><div class="sli8-actions"><button type="button" id="sli8ReadyBack" class="sli8-secondary">← 換一項練習</button><button type="button" id="sli8ReadyStart" class="sli8-primary">✓ 我準備好了，開始第一回合</button></div><div id="sli8Feedback" class="sli8-feedback" role="status" aria-live="polite" aria-atomic="true">現在是準備時間，尚未開始出題。</div>`);
    q('#sli8ReadyBack')?.addEventListener('click', renderMenu);
    q('#sli8ReadyStart')?.addEventListener('click', () => { state.preparing = false; renderRound(); });
    focusSoon('#sli8ReadyStart');
  }

  function choiceMarkup(choices, preserveAnswerOrder = false) {
    const shownChoices = preserveAnswerOrder ? choices : shuffle(choices);
    return `<div class="sli8-choices">${shownChoices.map((choice) => `<button type="button" class="sli8-choice" data-sli8-choice="${choice}">${choice}</button>`).join('')}</div>`;
  }

  function sequenceMarkup(round) {
    return `<div class="sli8-slots" aria-label="依序放入句子積木">${round.labels.map((label, index) => `<div class="sli8-slot ${state.selected[index] ? 'filled' : ''}" data-sli8-slot="${index}" tabindex="0" aria-label="${label}，${state.selected[index] || '尚未放入'}"><span>${label}</span><strong>${state.selected[index] || '？'}</strong></div>`).join('')}</div><div class="sli8-pieces" aria-label="可選語句積木">${shuffle(round.choices).map((piece) => `<button type="button" draggable="true" class="sli8-piece ${state.selected.includes(piece) ? 'used' : ''}" data-sli8-piece="${piece}" ${state.selected.includes(piece) ? 'disabled' : ''}>${piece}</button>`).join('')}</div>`;
  }

  function renderRound() {
    const activity = active();
    const round = state.rounds[state.index];
    let play = '';
    if (state.game === 'tone-park') {
      play = `<article class="sli8-tone"><span aria-hidden="true">${activity.icon}</span><div><strong>目標字：${round.target}</strong><p>聲調線索：${round.contour}</p><button type="button" id="sli8Model">🔊 朗讀目標和選項</button></div></article><p class="sli8-rule">${round.prompt}。請先聽教師或朗讀按鈕；這是聽辨練習，不會自動判定學生讀音或錄音。</p>${choiceMarkup(round.choices, true)}`;
    } else if (state.game === 'cause-workshop') {
      play = `<article class="sli8-cause"><span aria-hidden="true">🔗</span><div><strong>原因：${round.cause}</strong><p>結果：${round.result}</p></div></article><p class="sli8-rule">${round.prompt}。可拖拉積木，也可每次點一下積木；不知道時可聽提示或請教師一起做。</p>${sequenceMarkup(round)}`;
    } else if (state.game === 'word-net') {
      play = `<article class="sli8-tone"><span aria-hidden="true">${round.silhouette}</span><div><strong>深海線索庫</strong><p>${round.clues.map((clue, index) => `${index + 1}. ${clue}`).join('　')}</p><button type="button" id="sli8Model">🔊 朗讀三條線索</button></div></article><p class="sli8-rule">${round.prompt}。可以再聽或再看線索；本活動不計反應時間。</p>${choiceMarkup(round.choices, true)}`;
    } else if (state.game === 'pace-route') {
      play = `<article class="sli8-tone"><span aria-hidden="true">${activity.icon}</span><div><strong>今次訊息：${round.message}</strong><p>可選一種自己覺得舒服的準備方法。</p><button type="button" id="sli8Model">🔊 朗讀短訊息</button></div></article><p class="sli8-rule">${round.prompt}。不需要追求快或完全一樣；可選句卡、教師示範或只聽範例。</p>${choiceMarkup(round.choices, true)}`;
    } else if (state.game === 'idiom-decoder') {
      play = `<article class="sli8-tone"><span aria-hidden="true">${activity.icon}</span><div><strong>線索句：${round.phrase}</strong><p>${round.context}</p><button type="button" id="sli8Model">🔊 朗讀句子和情境</button></div></article><p class="sli8-rule">${round.prompt}。可以先看情境，再比較不同意思；這是語言理解練習，不是人格或能力判斷。</p>${choiceMarkup(round.choices, true)}`;
    } else if (state.game === 'repair-station') {
      play = `<article class="sli8-tone"><span aria-hidden="true">${activity.icon}</span><div><strong>虛構聊天情境</strong><p class="sli8-chat">${round.chat.replace(/\n/g, '<br>')}</p><button type="button" id="sli8Model">🔊 朗讀對話</button></div></article><p class="sli8-rule">${round.prompt}。不同人可以有不同感受；先選一個可澄清或共同處理事情的句子。</p>${choiceMarkup(round.choices, true)}`;
    } else if (state.game === 'discussion-scaffold') {
      play = `<article class="sli8-cause"><span aria-hidden="true">${activity.icon}</span><div><strong>討論題目：${round.topic}</strong><p>可用句卡，也可先和教師討論自己的版本。</p></div></article><p class="sli8-rule">${round.prompt}。可拖拉或點選句卡；不設倒數，也不需要口頭說話才可完成。</p>${sequenceMarkup(round)}`;
    } else if (state.game === 'voice-use') {
      play = `<article class="sli8-tone"><span aria-hidden="true">${activity.icon}</span><div><strong>虛構主持情境</strong><p>${round.situation}</p><button type="button" id="sli8Model">🔊 朗讀情境</button></div></article><p class="sli8-rule">${round.prompt}。這是一般主持準備與溝通提示，不會錄音或評定聲音、音量、音高或健康。</p>${choiceMarkup(round.choices, true)}`;
    }
    shell(`${heading(activity.title, activity.description, `${stageLabel()} · ${state.index + 1} / ${state.rounds.length}`)}${progress()}<section class="sli8-play">${play}</section><div id="sli8Feedback" class="sli8-feedback" role="status" aria-live="polite" aria-atomic="true">${round.hint}</div>`);
    bindRound(round);
    focusSoon(['tone-park', 'word-net', 'pace-route', 'idiom-decoder', 'repair-station', 'voice-use'].includes(state.game) ? '#sli8Model' : '.sli8-piece');
  }

  function correct(message) {
    state.correct += 1;
    feedback(`✓ ${message}`, 'ok');
    window.setTimeout(next, 760);
  }

  function chooseSimple(choice, round) {
    if (choice === round.answer) { correct(round.success || '你慢慢比較了眼前線索。'); return; }
    state.retry += 1;
    feedback(`↗ ${round.hint}`, 'try');
  }

  function chooseSequence(piece, round) {
    if (state.selected.includes(piece)) return;
    const expected = round.answer[state.selected.length];
    if (piece !== expected) { state.retry += 1; feedback(`↗ ${round.hint}`, 'try'); return; }
    state.selected.push(piece);
    if (state.selected.length === round.answer.length) { correct(round.success || '你把內容按清楚次序組合好了。'); return; }
    renderRound();
    feedback(`✓ 已放入「${piece}」。現在慢慢看下一格。`, 'ok');
  }

  function bindSequence(round) {
    qa('[data-sli8-piece]').forEach((button) => {
      button.addEventListener('click', () => chooseSequence(button.dataset.sli8Piece, round));
      button.addEventListener('dragstart', (event) => { state.dragging = button.dataset.sli8Piece; event.dataTransfer?.setData('text/plain', state.dragging); event.dataTransfer.effectAllowed = 'move'; button.classList.add('dragging'); });
      button.addEventListener('dragend', () => { state.dragging = ''; button.classList.remove('dragging'); qa('.sli8-slot').forEach((slot) => slot.classList.remove('drop-target')); });
    });
    qa('[data-sli8-slot]').forEach((slot) => {
      slot.addEventListener('dragover', (event) => { event.preventDefault(); if (Number(slot.dataset.sli8Slot) === state.selected.length) slot.classList.add('drop-target'); });
      slot.addEventListener('dragleave', () => slot.classList.remove('drop-target'));
      slot.addEventListener('drop', (event) => { event.preventDefault(); slot.classList.remove('drop-target'); const piece = event.dataTransfer?.getData('text/plain') || state.dragging; if (Number(slot.dataset.sli8Slot) !== state.selected.length) { feedback('↗ 先放到下一個有問號的位置。', 'try'); return; } if (piece) chooseSequence(piece, round); });
    });
  }

  function bindRound(round) {
    if (state.game === 'tone-park') {
      q('#sli8Model')?.addEventListener('click', () => speak(`目標字是 ${round.target}。請一起比較：${round.choices.join('，')}。`));
      qa('[data-sli8-choice]').forEach((button) => button.addEventListener('click', () => chooseSimple(button.dataset.sli8Choice, round)));
      return;
    }
    if (state.game === 'word-net') {
      q('#sli8Model')?.addEventListener('click', () => speak(`三條線索是：${round.clues.join('。')}。`));
      qa('[data-sli8-choice]').forEach((button) => button.addEventListener('click', () => chooseSimple(button.dataset.sli8Choice, round)));
      return;
    }
    if (state.game === 'pace-route') {
      q('#sli8Model')?.addEventListener('click', () => speak(round.message));
      qa('[data-sli8-choice]').forEach((button) => button.addEventListener('click', () => chooseSimple(button.dataset.sli8Choice, round)));
      return;
    }
    if (state.game === 'idiom-decoder') {
      q('#sli8Model')?.addEventListener('click', () => speak(`${round.phrase}。${round.context}`));
      qa('[data-sli8-choice]').forEach((button) => button.addEventListener('click', () => chooseSimple(button.dataset.sli8Choice, round)));
      return;
    }
    if (state.game === 'repair-station') {
      q('#sli8Model')?.addEventListener('click', () => speak(round.chat.replace(/\n/g, '。')));
      qa('[data-sli8-choice]').forEach((button) => button.addEventListener('click', () => chooseSimple(button.dataset.sli8Choice, round)));
      return;
    }
    if (state.game === 'discussion-scaffold') {
      bindSequence(round);
      return;
    }
    if (state.game === 'voice-use') {
      q('#sli8Model')?.addEventListener('click', () => speak(round.situation));
      qa('[data-sli8-choice]').forEach((button) => button.addEventListener('click', () => chooseSimple(button.dataset.sli8Choice, round)));
      return;
    }
    if (state.game === 'cause-workshop') bindSequence(round);
  }

  function next() {
    state.index += 1;
    state.selected = [];
    if (state.index >= state.rounds.length) { finish(); return; }
    renderRound();
  }

  function finish() {
    const activity = active();
    settings?.onComplete?.({ label: `${activity.title} · ${stageLabel()}`, mode: `sli-eight-${state.game}`, total: state.rounds.length, correct: state.correct, incorrect: state.retry, completedAt: new Date().toLocaleString('zh-HK') });
    shell(`${heading('本次 SLI 課堂練習回顧', '可休息、重玩較短內容或選另一項活動。結果只供本節課堂回顧，不作比較、診斷或治療紀錄。', `完成 · ${stageLabel()}`)}<section class="sli8-summary"><div><span>完成回合</span><strong>${state.rounds.length} / ${state.rounds.length}</strong></div><div><span>正確嘗試</span><strong>${state.correct}</strong></div><div><span>溫和重試</span><strong>${state.retry}</strong></div></section><p class="sli8-rule">每一次重聽、指卡、說出需要、慢慢組句或請教師一起看，都是可被看見的努力。</p><div class="sli8-actions"><button type="button" id="sli8Restart" class="sli8-secondary">↺ 再玩這一項</button><button type="button" id="sli8Menu" class="sli8-primary">選另一項練習</button></div><div id="sli8Feedback" class="sli8-feedback" role="status" aria-live="polite" aria-atomic="true">本次練習完成，可以先休息一下。</div>`);
    q('#sli8Restart')?.addEventListener('click', () => renderReady(state.game));
    q('#sli8Menu')?.addEventListener('click', renderMenu);
    focusSoon('#sli8Menu');
  }

  function injectStyle() {
    if (document.getElementById('sli-eight-style')) return;
    const style = document.createElement('style');
    style.id = 'sli-eight-style';
    style.textContent = `
      .sli8-host{position:fixed;inset:0;z-index:10020;padding:20px;background:rgba(30,24,53,.64);overflow:auto}.sli8-shell{min-height:100%;display:grid;place-items:center}.sli8-lab{position:relative;width:min(1050px,100%);max-height:calc(100vh - 40px);overflow:auto;padding:clamp(24px,4vw,48px);border-radius:28px;background:#fff;color:#243758;box-shadow:0 28px 82px rgba(18,13,37,.34)}.sli8-heading{display:flex;gap:18px;justify-content:space-between;align-items:flex-start}.sli8-heading>div{min-width:0}.sli8-heading span{font-size:13px;font-weight:900;letter-spacing:.08em;color:#a14570}.sli8-heading h2{margin:7px 0 8px;font-size:clamp(30px,4vw,50px);line-height:1.1}.sli8-heading p{margin:0;color:#667289;font-size:18px;line-height:1.55}.sli8-close{flex:0 0 auto;width:48px;min-height:48px;border:0;border-radius:50%;background:#f3f2fa;color:#4f5875;font-size:32px;line-height:1}.sli8-progress{margin:26px 0 18px;display:flex;gap:12px;align-items:center;font-weight:900}.sli8-progress span{white-space:nowrap}.sli8-progress i{display:block;flex:1;height:12px;border-radius:999px;overflow:hidden;background:#eceaf6}.sli8-progress b{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#7d61d8,#da6d99);transition:width .2s ease-out}.sli8-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:28px}.sli8-card{min-height:210px;padding:22px;border:2px solid #e4dff3;border-radius:22px;background:linear-gradient(145deg,#fff,#faf9ff);text-align:left;color:#243758;transition:transform .18s ease-out,box-shadow .18s ease-out}.sli8-card:hover{transform:translateY(-2px);box-shadow:0 12px 24px rgba(80,61,130,.1)}.sli8-card>span{display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:#f0ebff;font-size:28px}.sli8-card strong{display:block;margin-top:14px;font-size:20px}.sli8-card small{display:block;margin-top:5px;color:#8d3d68;font-weight:800}.sli8-card p{margin:10px 0;color:#59667e;line-height:1.55}.sli8-card em{font-style:normal;font-size:13px;font-weight:800;color:#5f5079}.sli8-ready{display:flex;gap:22px;align-items:flex-start;margin:30px 0;padding:24px;border-radius:22px;background:#f8f6ff}.sli8-ready>div:first-child{display:grid;place-items:center;flex:0 0 72px;width:72px;height:72px;border-radius:20px;background:#e9e0ff;font-size:38px}.sli8-ready p{margin:0;color:#8d3d68;font-weight:900}.sli8-ready h3{margin:5px 0 10px;font-size:27px}.sli8-ready ol{margin:0;padding-left:23px;color:#4d5970;line-height:1.7}.sli8-ready small{display:block;margin-top:12px;color:#667289}.sli8-actions{display:flex;flex-wrap:wrap;gap:12px;margin:22px 0}.sli8-primary,.sli8-secondary,.sli8-tools button,.sli8-choice,.sli8-piece,.sli8-record button,.sli8-tone button{min-height:44px;border-radius:14px;font:inherit;font-weight:850;padding:10px 16px}.sli8-primary{border:0;background:#7050c5;color:#fff}.sli8-secondary{border:1px solid #d9d2e8;background:#fff;color:#4a5570}.sli8-play{margin-top:20px}.sli8-tone,.sli8-cause{display:flex;gap:18px;align-items:center;padding:22px;border-radius:22px;background:linear-gradient(135deg,#f5f2ff,#fff2f8)}.sli8-tone>span,.sli8-cause>span{display:grid;place-items:center;width:68px;height:68px;border-radius:20px;background:#fff;font-size:34px}.sli8-tone strong,.sli8-cause strong{font-size:24px}.sli8-tone p,.sli8-cause p{margin:5px 0;color:#636d82}.sli8-tone button{margin-top:8px;border:1px solid #bdb0e7;background:#fff;color:#59458d}.sli8-rule{margin:20px 0;padding:14px 16px;border-left:5px solid #d26c98;border-radius:0 12px 12px 0;background:#fff6f9;color:#4e5066;line-height:1.6}.sli8-rule.highlight{outline:3px solid #8f72e0;outline-offset:3px}.sli8-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.sli8-choice{min-height:78px;border:2px solid #ddd8eb;background:#fff;color:#34415b;font-size:18px}.sli8-choice:hover,.sli8-choice:focus-visible{border-color:#8365d5;background:#f8f5ff}.sli8-record{margin-top:18px;padding:17px;border-radius:18px;background:#f7f8fc;color:#49546b}.sli8-record p{margin:6px 0 12px;line-height:1.5}.sli8-record div{display:flex;flex-wrap:wrap;gap:10px}.sli8-record button{border:1px solid #c9c6d9;background:#fff;color:#45506a}.sli8-record button:disabled{opacity:.5}.sli8-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.sli8-slot{min-height:100px;padding:13px;border:2px dashed #c4b9df;border-radius:16px;background:#faf9ff;display:flex;flex-direction:column;justify-content:space-between;gap:8px}.sli8-slot span{font-size:13px;font-weight:900;color:#785bc1}.sli8-slot strong{font-size:18px;line-height:1.35}.sli8-slot.filled{border-style:solid;border-color:#a492dd;background:#f3efff}.sli8-slot.drop-target{outline:3px solid #da6d99;outline-offset:2px}.sli8-pieces{display:flex;flex-wrap:wrap;gap:11px;margin-top:16px}.sli8-piece{border:2px solid #d8d1e8;background:#fff;color:#3d4961}.sli8-piece.dragging{opacity:.55;transform:scale(.98)}.sli8-piece.used{opacity:.45}.sli8-feedback{margin-top:20px;padding:14px 16px;border-radius:14px;background:#f5f4f8;color:#555f75;line-height:1.55}.sli8-feedback.ok{background:#e9f8ef;color:#216445}.sli8-feedback.try{background:#fff6df;color:#765614}.sli8-support{margin-top:26px;padding:18px;border-top:1px solid #e6e2ee;background:#fbfbfe}.sli8-support>div:first-child{display:flex;gap:8px;flex-direction:column}.sli8-support span{color:#637086;line-height:1.5}.sli8-tools{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}.sli8-tools button{border:1px solid #d8d2e7;background:#fff;color:#4d5670}.sli8-support-note{margin-top:12px;padding:12px;border-radius:12px;background:#fff4e6;color:#755a2b}.sli8-support-note span{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.sli8-support-note button{min-height:40px;border:1px solid #d5c99b;border-radius:10px;background:#fff;color:#645126;font:inherit;font-weight:800;padding:8px 12px}.sli8-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin:26px 0}.sli8-summary div{padding:18px;border-radius:18px;background:#f6f5fb}.sli8-summary span{display:block;color:#667289;font-size:14px}.sli8-summary strong{display:block;margin-top:5px;font-size:25px;color:#4e3d84}@media (max-width:620px){.sli8-host{padding:10px}.sli8-lab{max-height:calc(100vh - 20px);padding:22px 16px;border-radius:22px}.sli8-heading h2{font-size:30px}.sli8-heading p{font-size:16px}.sli8-grid{grid-template-columns:1fr}.sli8-card{min-height:0}.sli8-ready{flex-direction:column;padding:18px}.sli8-choices{grid-template-columns:1fr}.sli8-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.sli8-slot{min-height:88px}.sli8-summary{grid-template-columns:1fr}.sli8-tone,.sli8-cause{align-items:flex-start}.sli8-actions>*{width:100%}}@media (prefers-reduced-motion:reduce){.sli8-card,.sli8-progress b{transition:none!important}.sli8-card:hover{transform:none}}
    `;
    document.head.appendChild(style);
  }

  function activityCards(stage) {
    return Object.entries(ACTIVITIES).filter(([, activity]) => activity.stage.includes(stage)).map(([key, activity]) => ({ id: `sli-eight-${key}`, sliEightActivityKey: key, icon: activity.icon, title: activity.title, description: activity.description, focus: activity.focus, supports: ['8'], tone: 'pink', tag: `${stageLabel(stage)} · ${activity.rounds.length} 回合`, answerPositionStrategy: activity.answerPositionStrategy, answerPositionPattern: activity.answerPositionPattern, rounds: activity.rounds }));
  }

  function openActivity(key, options = {}) {
    const activity = ACTIVITIES[key];
    if (!activity) return;
    settings = options;
    returnFocus = options.trigger || document.activeElement;
    if (host) close();
    injectStyle();
    host = document.createElement('div');
    host.className = 'sli8-host';
    document.body.appendChild(host);
    state = { game: key, stage: options.stage || activity.stage[0], index: 0, correct: 0, retry: 0, selected: [], rounds: activity.rounds, preparing: true };
    keyHandler = trapKeys;
    document.addEventListener('keydown', keyHandler);
    renderReady(key);
  }

  window.SLI_EIGHT_GAMES_LAB = { activityCards, openActivity };
})();
