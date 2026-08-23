(function () {
  const activities = {
    connector: {
      icon: '🔄', title: '關聯詞轉盤', description: '由前後句的關係，選出最合適的轉折、遞進或因果關聯詞。', focus: '篇章邏輯與銜接', accent: 'teal',
      rounds: [
        { category: '轉折', before: '天氣預報說下午有雨，', after: '校內接力賽仍會照常進行。', answer: '然而', choices: ['然而', '所以', '因此'], hint: '前句預計下雨，後句卻說活動照常，是兩個不同方向的意思。' },
        { category: '因果', before: '圖書館今天提早關門，', after: '我們改到課室完成小組討論。', answer: '所以', choices: ['所以', '但是', '同時'], hint: '前句說明原因，後句是因此作出的安排。' },
        { category: '遞進', before: '他先整理訪問記錄，', after: '把重點製成簡報。', answer: '再', choices: ['再', '可是', '因為'], hint: '兩個行動按先後次序發生，第二步可用「再」。' },
        { category: '因果', before: '小組已核對日期和附件，', after: '可以安心提交報告。', answer: '因此', choices: ['因此', '不過', '而且'], hint: '核對完成是原因；安心提交是結果。' },
        { category: '轉折', before: '這篇文章的字詞較難，', after: '加上提示後，我仍能找出主旨。', answer: '不過', choices: ['不過', '於是', '首先'], hint: '前句有困難，後句卻做到，是轉折關係。' },
        { category: '遞進', before: '這個計畫能減少紙張浪費，', after: '培養同學回收的習慣。', answer: '也能', choices: ['也能', '可是', '因而'], hint: '後句是在補充另一個好處，意思比前句再推進一步。' },
        { category: '條件／結果', before: '如果大家預先分配工作，', after: '小組會較容易按時完成。', answer: '那麼', choices: ['那麼', '但是', '例如'], hint: '前句提出條件，後句說明在這個條件下的結果。' },
        { category: '舉例', before: '閱讀時可以用不同方法找重點，', after: '圈起關鍵詞和寫下段落小標題。', answer: '例如', choices: ['例如', '可是', '所以'], hint: '後句列出具體做法，是為前句提供例子。' },
        { category: '轉折', before: '同學已讀過活動守則，', after: '老師仍會在出發前再提醒一次。', answer: '可是', choices: ['可是', '因此', '接著'], hint: '已讀守則後本來似乎不需要再說，後句卻仍要提醒，是轉折。' },
        { category: '總結', before: '先看標題，再找關鍵句，最後刪去細節，', after: '這些步驟有助提煉主旨。', answer: '總之', choices: ['總之', '但是', '例如'], hint: '前句列舉方法，後句把前面的內容作一個總結。' }
      ]
    },
    paragraph: {
      icon: '🃏', title: '段落結構大洗牌', description: '把打亂的句子按起承轉合、時間或說明次序重新排好。', focus: '段落結構與篇章順序', accent: 'violet',
      rounds: [
        { structure: '時間順序', order: ['早上，班長宣布回收舊書活動。', '午飯後，同學把帶來的書分類。', '放學前，大家把已分類的書交到圖書館。'], hint: '找表示時間的詞：早上、午飯後、放學前。' },
        { structure: '起承轉合', order: ['校園角落常有被忽略的紙張。', '環保小組於是設置了回收箱。', '起初有同學忘記分類，箱內很凌亂。', '經過提醒後，回收行動漸漸順利。'], hint: '先交代現象，再說做法；之後遇到情況，最後是結果。' },
        { structure: '說明步驟', order: ['先細讀題目，圈出要求。', '再把資料分成幾個重點。', '最後用自己的句子回答問題。'], hint: '留意「先、再、最後」三個次序詞。' },
        { structure: '原因到結果', order: ['近日天氣持續炎熱。', '學校於是在操場加設飲水站。', '同學下課後能更方便補充水分。'], hint: '先發生的情況是炎熱；中間是學校的行動；最後是帶來的結果。' },
        { structure: '空間順序', order: ['走進圖書館，入口旁放著借還書機。', '再向內走，是一排排書架。', '最裡面則是安靜閱讀區。'], hint: '從入口開始，慢慢走到最裡面。' },
        { structure: '問題與解決', order: ['小組發現報告資料太多，難以閱讀。', '他們決定刪去重複內容，並加上小標題。', '完成後，報告的重點更清楚。'], hint: '先找問題，接著是解決方法，最後看結果。' },
        { structure: '觀察與推論', order: ['操場上的樹葉不停向一邊飄。', '天空也逐漸變暗。', '我們推論很快會有大雨。'], hint: '先放觀察到的線索，最後才放由線索得出的推論。' },
        { structure: '活動報告', order: ['上星期五，我們到社區中心探訪長者。', '同學先準備表演和問候卡。', '活動結束後，大家分享最難忘的一刻。'], hint: '先交代活動時間和地點，再寫準備，最後寫結束後的回顧。' },
        { structure: '觀點段落', order: ['我認為課室應設一個安靜閱讀角。', '這裡可讓同學在小息時短暫閱讀。', '因此，閱讀角能增加接觸書本的機會。'], hint: '先是觀點，中間補充原因，最後才下結論。' },
        { structure: '事件發展', order: ['小明發現自己的水樽不見了。', '他先回到剛才上課的課室查看。', '最後，他在課室門旁找回水樽。'], hint: '先出現問題，之後採取行動，最後解決問題。' }
      ]
    },
    redundancy: {
      icon: '✂️', title: '文章冗詞除錯', description: '找出句子中重複、贅餘的字詞，令表達更精準。', focus: '語句精煉與自我監控', accent: 'orange',
      rounds: [
        { sentence: '我親眼目睹看見那場比賽。', answer: '看見', choices: ['看見', '親眼', '比賽'], hint: '「目睹」本身已經有親眼看見的意思。' },
        { sentence: '同學們互相彼此幫助，完成任務。', answer: '彼此', choices: ['彼此', '幫助', '任務'], hint: '「互相」和「彼此」的意思相近，留下一個便足夠。' },
        { sentence: '我們一起共同完成這份報告。', answer: '共同', choices: ['共同', '完成', '報告'], hint: '「一起」已經表達大家共同合作的意思。' },
        { sentence: '這項新安排帶來完全徹底的改變。', answer: '徹底', choices: ['徹底', '安排', '改變'], hint: '「完全」和「徹底」都在加強程度，選一個便可。' },
        { sentence: '請先預先報名，才可以參加活動。', answer: '預先', choices: ['預先', '報名', '活動'], hint: '「先」已經表示在活動前做，毋須再加「預先」。' },
        { sentence: '凌晨半夜，我還在溫習。', answer: '半夜', choices: ['半夜', '溫習', '凌晨'], hint: '「凌晨」已說明深夜到清晨的時間，另一個時間詞重複了。' },
        { sentence: '他最後終於完成了閱讀報告。', answer: '最後', choices: ['最後', '閱讀', '完成'], hint: '「終於」已表示經過一段時間才完成，毋須再用「最後」。' },
        { sentence: '學校免費送贈禮物給參加者。', answer: '贈', choices: ['贈', '學校', '參加者'], hint: '「送」和「贈」都表示把東西給別人，留下其中一個就清楚。' },
        { sentence: '目前現在，圖書館正在整理新書。', answer: '現在', choices: ['現在', '圖書館', '整理'], hint: '「目前」就是現在這段時間，不用同時使用兩個時間詞。' },
        { sentence: '老師再次重新講解這個步驟。', answer: '重新', choices: ['重新', '講解', '步驟'], hint: '「再次」和「重新」都表示又做一次，刪走其中一個。' }
      ]
    },
    rhetoric: {
      icon: '🏷️', title: '修辭手法分類卡', description: '把句子分類到比喻、擬人或排比，讀出文字的表意方式。', focus: '修辭辨識與文本分析', accent: 'pink',
      rounds: [
        { sentence: '月亮像一盞銀燈，照亮安靜的校園。', answer: '比喻', choices: ['比喻', '擬人', '排比'], hint: '句子用「像」把月亮比作銀燈。' },
        { sentence: '春風輕輕拍著窗戶，提醒我們季節轉換了。', answer: '擬人', choices: ['擬人', '排比', '比喻'], hint: '風不會真的拍窗或提醒人，這是把人的動作給了風。' },
        { sentence: '我們要準時交功課、準備好用品、尊重每一位同學。', answer: '排比', choices: ['排比', '比喻', '擬人'], hint: '三個結構相近的行動連續排列，形成有節奏的表達。' },
        { sentence: '書本是通往不同世界的窗口。', answer: '比喻', choices: ['比喻', '排比', '擬人'], hint: '書本不是實際的窗口，句子把它比作能看見世界的窗口。' },
        { sentence: '小草從泥土裡探出頭來，好奇地望著天空。', answer: '擬人', choices: ['擬人', '比喻', '排比'], hint: '小草沒有眼睛，卻被寫成會探頭、望天空，這是人的行為。' },
        { sentence: '健康來自均衡飲食、適量運動和充足睡眠。', answer: '排比', choices: ['排比', '擬人', '比喻'], hint: '三項名詞短語並列，清楚列出健康的三個部分。' },
        { sentence: '雨點像跳動的音符，在地面奏出節拍。', answer: '比喻', choices: ['比喻', '擬人', '排比'], hint: '雨點被比作音符，關鍵線索是「像」。' },
        { sentence: '太陽慢慢爬上山頭，向每個人送上早晨的問候。', answer: '擬人', choices: ['擬人', '排比', '比喻'], hint: '太陽被寫成會爬山、問候人，是把人的動作賦予它。' },
        { sentence: '閱讀讓我們認識知識、理解別人、想像未來。', answer: '排比', choices: ['排比', '比喻', '擬人'], hint: '三個「閱讀讓我們……」的效果並列，形成整齊的節奏。' },
        { sentence: '記憶像一個收藏箱，保存著成長中的片段。', answer: '比喻', choices: ['比喻', '排比', '擬人'], hint: '記憶不是實物箱子，這裡用收藏箱說明它保存片段的作用。' }
      ]
    },
    idiom: {
      icon: '🖼️', title: '成語圖解猜謎', description: '根據意象猜出成語，再找出正確寫法來修正諧音錯字。', focus: '成語意象與正字法', accent: 'blue',
      rounds: [
        { visual: '🐍➕🦶', riddle: '畫好蛇後，卻為牠多畫幾隻腳。', wrong: '畫蛇填足', answer: '畫蛇添足', choices: ['畫蛇添足', '杯弓蛇影', '對牛彈琴'], hint: '做事已完成又加上不需要的部分，反而弄巧成拙。' },
        { visual: '🌳🐇', riddle: '有人只坐在樹樁旁，等兔子再次撞過來。', wrong: '守株代兔', answer: '守株待兔', choices: ['守株待兔', '亡羊補牢', '狐假虎威'], hint: '故事中的人守著樹樁，等候兔子出現。' },
        { visual: '🕳️🐸', riddle: '青蛙住在很深的井裡，只看見一小片天空。', wrong: '井底之娃', answer: '井底之蛙', choices: ['井底之蛙', '盲人摸象', '自相矛盾'], hint: '住在井底、視野狹窄的動物是青蛙。' },
        { visual: '🐮🎻', riddle: '有人對著不懂音樂的牛演奏琴聲。', wrong: '對牛談琴', answer: '對牛彈琴', choices: ['對牛彈琴', '畫蛇添足', '掩耳盜鈴'], hint: '樂器的動作是「彈琴」，不是談話的「談」。' },
        { visual: '🛡️⚔️', riddle: '賣兵器的人同時說自己的矛最鋒利、盾最堅固。', wrong: '自相毛盾', answer: '自相矛盾', choices: ['自相矛盾', '守株待兔', '杯弓蛇影'], hint: '矛和盾的說法互相衝突，形成前後不一致。' },
        { visual: '👂🔔', riddle: '小偷掩住自己的耳朵，以為別人聽不到鈴聲。', wrong: '掩耳盜零', answer: '掩耳盜鈴', choices: ['掩耳盜鈴', '亡羊補牢', '盲人摸象'], hint: '圖片中會發出聲音的物品是鈴，不是數量的「零」。' },
        { visual: '🦊🐯', riddle: '狐狸借著老虎的威風，令其他動物害怕。', wrong: '狐假虎危', answer: '狐假虎威', choices: ['狐假虎威', '畫蛇添足', '對牛彈琴'], hint: '老虎令人害怕的是「威風」，所以用「威」。' },
        { visual: '🐑🏠🔧', riddle: '羊走失後，人立刻把羊圈修好。', wrong: '亡羊補勞', answer: '亡羊補牢', choices: ['亡羊補牢', '守株待兔', '自相矛盾'], hint: '關羊的地方叫羊「牢」，不是工作的「勞」。' },
        { visual: '🍵🏹🐍', riddle: '杯中弓的倒影，看起來像一條蛇。', wrong: '杯弓蛇映', answer: '杯弓蛇影', choices: ['杯弓蛇影', '井底之蛙', '掩耳盜鈴'], hint: '杯裡看見的是弓的「影」，不是照相的映像。' },
        { visual: '🙈🐘', riddle: '幾個看不見的大人各摸到大象的一部分，便以為自己知道全貌。', wrong: '忙人摸象', answer: '盲人摸象', choices: ['盲人摸象', '狐假虎威', '亡羊補牢'], hint: '故事人物是視覺受限制的「盲人」，不是忙碌的人。' }
      ]
    },
    mainIdea: {
      icon: '🔍', title: '主旨提煉篩選器', description: '閱讀短文後，篩走太廣泛或太細節的選項，選出核心主旨。', focus: '摘要策略與訊息篩選', accent: 'yellow',
      rounds: [
        { passage: '學校在操場旁設置飲水機，並提醒同學自備水樽。這樣不但方便補充水分，也可減少使用即棄膠樽。', answer: '學校以飲水機和自備水樽兼顧健康及環保。', choices: ['學校以飲水機和自備水樽兼顧健康及環保。', '操場旁有一部飲水機。', '所有膠樽都不應使用。'], hint: '找能同時包括飲水和減少膠樽的句子，而不是只抽出一個細節。' },
        { passage: '閱讀小組每星期選一本短書分享。成員會先寫下問題，再在討論時引用書中的內容回應。大家慢慢學會用證據表達意見。', answer: '閱讀小組透過討論和引用內容培養有根據的表達。', choices: ['閱讀小組透過討論和引用內容培養有根據的表達。', '小組每星期只讀一本短書。', '所有討論都比閱讀重要。'], hint: '重點在於小組怎樣幫助大家表達，不只是星期或書的數量。' },
        { passage: '有同學做報告時一次打開太多網頁，結果找不到重點。老師建議先列問題，只保留相關頁面，再把資料寫成三個要點。', answer: '分步整理資料可減少分心並找出報告重點。', choices: ['分步整理資料可減少分心並找出報告重點。', '網頁的數量永遠不可以超過三個。', '老師喜歡列問題。'], hint: '看清楚老師建議的目的：減少分心、整理重點。' },
        { passage: '社區服務前，義工先學習向長者問候和聆聽。活動時，他們不急著給建議，而是先問對方需要甚麼。', answer: '服務別人前要先學習尊重地聆聽和了解需要。', choices: ['服務別人前要先學習尊重地聆聽和了解需要。', '長者不需要任何建議。', '義工只要會問候便足夠。'], hint: '主旨應包括服務時的態度和先了解需要，不要只抓一個動作。' },
        { passage: '班會討論課室噪音問題。大家提出把聊天時間安排在小息、上課時把電話調靜音，以及設置安靜閱讀角。', answer: '班會以多項具體安排改善課室的學習環境。', choices: ['班會以多項具體安排改善課室的學習環境。', '電話一定要永遠關掉。', '安靜閱讀角是唯一的解決方法。'], hint: '三個做法都指向同一件事：改善學習時的環境。' },
        { passage: '小明溫習時先看目標，再設定十五分鐘計時器。時間到後他喝水休息，然後回到下一小題。這讓他較容易開始和持續。', answer: '短時段目標與休息交替有助維持溫習專注。', choices: ['短時段目標與休息交替有助維持溫習專注。', '小明只喜歡喝水。', '溫習一定要用十五分鐘。'], hint: '看方法帶來的整體效果，而不是只記住十五分鐘或喝水。' },
        { passage: '圖書館新增簡易標誌：藍色代表借書、綠色代表還書、黃色代表查詢。剛到圖書館的同學能較快找到需要的服務。', answer: '清楚的視覺標誌能幫助使用者快速找到服務。', choices: ['清楚的視覺標誌能幫助使用者快速找到服務。', '藍色是最好的顏色。', '每個圖書館都有黃色標誌。'], hint: '顏色只是例子；重點是視覺標誌如何協助找服務。' },
        { passage: '校園種植計畫由同學輪流澆水、記錄植物高度，並在每月分享觀察。即使有植物生長較慢，大家仍會比較不同的照顧方法。', answer: '種植計畫讓同學透過持續觀察學習照顧與比較。', choices: ['種植計畫讓同學透過持續觀察學習照顧與比較。', '所有植物都會長得很快。', '同學每月只做一次記錄。'], hint: '主旨涵蓋輪流照顧、記錄和比較，不是單一的成長速度。' },
        { passage: '準備旅行時，班長把集合時間、地點、聯絡方法寫在同一張清單。出發前，同學再逐項核對，減少遲到和遺漏。', answer: '以清單集中並核對重要資料可減少出發前的遺漏。', choices: ['以清單集中並核對重要資料可減少出發前的遺漏。', '旅行只需要知道集合地點。', '班長要負責所有人的物品。'], hint: '找包含清單、核對和減少遺漏三個核心意思的選項。' },
        { passage: '有同學讀到不明白的長句時，先找出誰做甚麼，再圈起連接詞，最後把句子分成兩部分理解。難句因而變得較容易處理。', answer: '運用句法和關聯詞支架可幫助理解長難句。', choices: ['運用句法和關聯詞支架可幫助理解長難句。', '每一個長句都只有兩部分。', '只要圈起一個詞便能明白文章。'], hint: '主旨要包括多個理解步驟和它們共同的作用。' }
      ]
    },
    vocabulary: {
      icon: '🎯', title: '詞義辨析雷達', description: '根據語境辨析近義詞、詞語搭配和書面語用法，選出最精準的詞。', focus: '進階詞彙與精準表意', accent: 'blue',
      rounds: [
        { context: '班會討論後，大家同意把小息閱讀角的建議寫進行動計畫。', prompt: '哪一個詞最適合填入「班會最終＿＿了這項建議」？', answer: '採納', choices: ['採納', '採取', '採集'], hint: '「採納」指接受意見或建議；「採取」多接行動或措施。' },
        { context: '報告中的數字來自政府公開資料和學校問卷。', prompt: '哪一個詞最適合填入「資料來源相對＿＿」？', answer: '可靠', choices: ['可靠', '可惜', '可觀'], hint: '資料來源值得信任、可作判斷依據，便是「可靠」。' },
        { context: '閱讀文章時，小組先圈出作者重複強調的概念。', prompt: '哪一個詞最適合填入「先＿＿文章的核心概念」？', answer: '辨認', choices: ['辨認', '辯論', '避免'], hint: '從文字中找出並認清某個概念，用「辨認」。' },
        { context: '社區中心把長者的意見整理成三項服務改善方向。', prompt: '哪一個詞最適合填入「工作人員＿＿意見後提出方案」？', answer: '歸納', choices: ['歸納', '歸還', '歸屬'], hint: '把零散意見整理成幾個重點或規律，是「歸納」。' },
        { context: '校刊文章先說明現象，再提出原因和可行做法。', prompt: '哪一個詞最適合填入「作者的觀點有資料作＿＿」？', answer: '佐證', choices: ['佐證', '證實', '證明'], hint: '資料用來支持某個觀點或說法，可說作「佐證」。' },
        { context: '同學在討論時發現兩種方案都能減少紙張浪費。', prompt: '哪一個詞最適合填入「兩個方案各有＿＿」？', answer: '成效', choices: ['成效', '成果', '成分'], hint: '計畫或措施達成的實際效果，常用「成效」。' },
        { context: '研究小組比較不同問卷的回覆，發現學生最重視安靜環境。', prompt: '哪一個詞最適合填入「問卷結果＿＿學生重視安靜環境」？', answer: '顯示', choices: ['顯示', '展示', '表演'], hint: '數據或結果讓人看出某件事，用「顯示」。' },
        { context: '這篇說明文把複雜程序分成四個短步驟。', prompt: '哪一個詞最適合填入「這種寫法能＿＿讀者的理解負擔」？', answer: '減輕', choices: ['減輕', '減少', '降低'], hint: '「負擔」常與「減輕」搭配；三個詞意思相近，但搭配不同。' },
        { context: '小組在交報告前逐項查看題目要求、引文和格式。', prompt: '哪一個詞最適合填入「提交前應＿＿資料是否完整」？', answer: '核對', choices: ['核對', '對待', '對照'], hint: '逐項比較及確認是否正確、齊全，用「核對」。' },
        { context: '文章提醒讀者不要只看標題，還要細讀內容和資料來源。', prompt: '哪一個詞最適合填入「讀者要＿＿判斷資訊」？', answer: '審慎', choices: ['審慎', '深刻', '熱烈'], hint: '面對資訊時仔細小心、不輕易下結論，便是「審慎」。' }
      ]
    },
    grammar: {
      icon: '🧩', title: '句式關係校準', description: '辨析主謂關係、修飾語、關聯句式和語序，讓長句更清楚。', focus: '進階文法與句法拆解', accent: 'violet',
      rounds: [
        { sentence: '雖然資料很多，但是小組仍能按類別整理。', prompt: '這一句的關聯句式最主要表達甚麼關係？', answer: '轉折讓步', choices: ['轉折讓步', '因果結果', '條件假設'], hint: '前句承認有困難，後句卻指出仍然做到，是「雖然……但是……」的讓步轉折。' },
        { sentence: '老師要求同學把訪問記錄整理成三個重點。', prompt: '「把訪問記錄整理成三個重點」中的主要動作是甚麼？', answer: '整理', choices: ['整理', '訪問記錄', '三個重點'], hint: '找出「誰做甚麼」中的動詞；同學做的動作是「整理」。' },
        { sentence: '閱讀前先看標題的習慣，能幫助我們預測內容。', prompt: '哪一部分是整句的主語？', answer: '閱讀前先看標題的習慣', choices: ['閱讀前先看標題的習慣', '能幫助', '預測內容'], hint: '問「甚麼能幫助我們？」答案是「閱讀前先看標題的習慣」。' },
        { sentence: '為了減少遺漏，班長把集合資料寫在同一張清單上。', prompt: '句首「為了減少遺漏」主要說明甚麼？', answer: '行動目的', choices: ['行動目的', '時間先後', '人物身分'], hint: '「為了……」通常交代後面行動想達到的目的。' },
        { sentence: '如果能先圈出關鍵詞，理解長句便會較容易。', prompt: '這一句屬於哪一種關係？', answer: '條件結果', choices: ['條件結果', '並列列舉', '比喻說明'], hint: '「如果」提出條件，後句說在條件成立時會有的結果。' },
        { sentence: '同學不但閱讀文章，還會把證據記在筆記上。', prompt: '哪一個詞最能說明「不但……還……」的作用？', answer: '遞進補充', choices: ['遞進補充', '相反對比', '選擇取捨'], hint: '後句在前句的行動上再加一層做法，是遞進補充。' },
        { sentence: '把資料分類後，報告的脈絡變得更清楚。', prompt: '哪一部分是造成結果的先行動作？', answer: '把資料分類後', choices: ['把資料分類後', '報告的脈絡', '更清楚'], hint: '「……後」前面的部分先發生，並帶來後句的結果。' },
        { sentence: '校刊刊登的訪問，讓更多同學認識社區服務。', prompt: '「校刊刊登的」在句中主要修飾哪一個名詞？', answer: '訪問', choices: ['訪問', '同學', '社區服務'], hint: '找緊接在修飾語後面的名詞；是「校刊刊登的訪問」。' },
        { sentence: '我們應先確認資料來源，才引用在報告裡。', prompt: '哪一個改寫最能保持原句的先後關係？', answer: '確認來源後，再把資料引用在報告裡。', choices: ['確認來源後，再把資料引用在報告裡。', '引用資料後，才確認來源。', '資料來源不需要確認。'], hint: '原句的「先……才……」強調先確認、後引用，次序不可倒轉。' },
        { sentence: '因為小組分工清楚，所以每個人都知道下一步要做甚麼。', prompt: '哪一部分是這一句的原因？', answer: '小組分工清楚', choices: ['小組分工清楚', '每個人都知道下一步', '要做甚麼'], hint: '「因為」後面說原因；「所以」後面說由原因帶來的結果。' }
      ]
    },
    examRadar: {
      icon: '📡', title: '審題防陷阱雷達', description: '圈出題目中的否定詞、限定詞和答題範圍，再決定最穩妥的下一步。', focus: '審題策略與抑制控制', accent: 'yellow',
      rounds: [
        { prompt: '題目問「以下哪項**不包括**在環保做法中？」首先要留意哪個詞？', answer: '不包括', choices: ['不包括', '環保', '做法'], hint: '否定詞會改變答案方向；先把它圈起來。' },
        { prompt: '題目寫「根據**第二段**內容回答」，要先看哪個範圍？', answer: '第二段', choices: ['第二段', '整篇文章', '題目號碼'], hint: '先確認資料範圍，避免找錯段落。' },
        { prompt: '題目問「作者**主要**想說甚麼？」應優先找甚麼？', answer: '核心意思', choices: ['核心意思', '一個小例子', '最長的句子'], hint: '主要是找整段最重要的意思，不是只找一個細節。' },
        { prompt: '題目要求「選出**最合適**的標題」，答題前應怎樣做？', answer: '比較所有選項是否涵蓋主旨', choices: ['比較所有選項是否涵蓋主旨', '立刻選第一個選項', '只看最短的選項'], hint: '「最合適」要比較，不用急著選第一個看見的答案。' },
        { prompt: '題目問「下列**只有一項**正確」，應採用哪個策略？', answer: '逐項核對證據', choices: ['逐項核對證據', '選看起來最熟悉的', '把全部都選'], hint: '有限定詞時，逐項用資料核對最穩妥。' },
        { prompt: '題目寫「先說明原因，**再**提出建議」，要注意甚麼？', answer: '答題次序', choices: ['答題次序', '字數大小', '紙張顏色'], hint: '「先、再」提示兩部分的安排次序。' },
        { prompt: '題目問「哪項**並非**作者觀點？」最適合的第一步是？', answer: '圈出並非，再回文找證據', choices: ['圈出並非，再回文找證據', '只憑自己想法回答', '略過所有選項'], hint: '先圈否定詞，再回到文章核對每一個選項。' },
        { prompt: '題目要求「用**自己的話**概括」，應避免甚麼？', answer: '整句直接抄錄', choices: ['整句直接抄錄', '保留核心意思', '先列關鍵詞'], hint: '先列重點，再用自己的短句重組意思。' }
      ]
    },
    chartText: {
      icon: '📈', title: '圖表與文字轉換器', description: '把簡單圖表趨勢轉成精準文字，或從文字找出相符的資料描述。', focus: '多模態資訊轉換', accent: 'blue',
      rounds: [
        { prompt: '柱狀圖顯示：一月至三月的借書量由 20 本、30 本升至 40 本。哪句描述最準確？', answer: '借書量持續上升', choices: ['借書量持續上升', '借書量持續下降', '借書量完全不變'], hint: '數字每月增加，描述可用「持續上升」。' },
        { prompt: '折線圖顯示：星期一 80 人、星期二 80 人、星期三 80 人使用閱讀角。哪句描述最準確？', answer: '使用人數保持穩定', choices: ['使用人數保持穩定', '使用人數急升', '使用人數急跌'], hint: '三天數字一樣，表示保持穩定。' },
        { prompt: '圓形圖顯示：60% 選擇步行上學、25% 乘巴士、15% 乘車。哪項最多？', answer: '步行上學', choices: ['步行上學', '乘巴士', '乘車'], hint: '比較百分比，60% 是最大的部分。' },
        { prompt: '表格顯示：回收紙張由 50 公斤增加到 75 公斤。增加了多少？', answer: '25 公斤', choices: ['25 公斤', '50 公斤', '75 公斤'], hint: '用新數量 75 減原來 50。' },
        { prompt: '圖表顯示四月的活動參加人數比三月少。哪個詞最合適？', answer: '下降', choices: ['下降', '增加', '持平'], hint: '比之前少，可以用「下降」。' },
        { prompt: '資料顯示：閱讀時間由 10 分鐘增至 20 分鐘，之後仍是 20 分鐘。哪句最準確？', answer: '先上升，後保持穩定', choices: ['先上升，後保持穩定', '一直下降', '完全沒有改變'], hint: '先比較前兩個數字，再看最後有沒有變動。' },
        { prompt: '表格顯示甲組完成 8 題、乙組完成 6 題。哪句是客觀描述？', answer: '甲組完成題數較乙組多', choices: ['甲組完成題數較乙組多', '乙組一定不努力', '甲組一定最聰明'], hint: '圖表只能支持數量比較，不用推斷人的能力或努力。' },
        { prompt: '圖表顯示使用水樽的人數增加，同時即棄膠樽數量減少。哪個結論最謹慎？', answer: '兩項變化同時出現，值得再了解原因', choices: ['兩項變化同時出現，值得再了解原因', '水樽一定是唯一原因', '圖表完全沒有資料'], hint: '圖表能顯示同時變化；因果關係需要更多資料確認。' }
      ]
    }
  };

  let activeKey = '';
  let roundIndex = 0;
  let orderedSegments = [];
  let segmentOptions = [];
  let result = { correct: 0, retries: 0, hints: 0 };
  let completed = false;
  let returnFocus = null;
  let speechActive = false;

  const currentActivity = () => activities[activeKey];
  const currentRound = () => currentActivity().rounds[roundIndex];
  const wait = (callback, duration = 1000) => window.setTimeout(callback, duration);
  const shuffle = (items) => {
    const output = [...items];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
    }
    return output;
  };

  function updateReadButton() {
    const button = document.querySelector('#spldS1Read');
    if (!button) return;
    button.textContent = speechActive ? '■ 停止朗讀' : '🔊 朗讀題目';
    button.setAttribute('aria-label', speechActive ? '停止朗讀' : '朗讀本關題目');
    button.setAttribute('aria-pressed', String(speechActive));
  }

  function stopReading() {
    window.speechSynthesis?.cancel();
    speechActive = false;
    updateReadButton();
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    speechActive = true;
    updateReadButton();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/[「」]/g, ''));
    utterance.lang = 'zh-HK';
    utterance.rate = 0.72;
    utterance.onend = utterance.onerror = () => { speechActive = false; updateReadButton(); };
    window.speechSynthesis.speak(utterance);
  }

  function closeLab({ restoreFocus = true } = {}) {
    const focusTarget = returnFocus;
    stopReading();
    document.querySelector('.spld-s1-lab-backdrop')?.remove();
    if (restoreFocus && focusTarget?.isConnected) window.setTimeout(() => focusTarget.focus(), 0);
    if (restoreFocus) returnFocus = null;
  }

  function trapFocus(event) {
    if (event.key === 'Escape') { event.preventDefault(); closeLab(); return; }
    if (event.key !== 'Tab') return;
    const dialog = event.currentTarget;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter((element) => element.offsetParent !== null);
    if (!controls.length) return;
    const first = controls[0]; const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function prepareDialog({ focusSelector = '.spld-s1-close' } = {}) {
    const dialog = document.querySelector('.spld-s1-lab');
    if (!dialog || dialog.dataset.a11yReady) return;
    dialog.dataset.a11yReady = 'true';
    dialog.addEventListener('keydown', trapFocus);
    window.setTimeout(() => dialog.querySelector(focusSelector)?.focus(), 0);
  }

  function focusRoundControl() {
    window.setTimeout(() => document.querySelector('#spldS1Read, .spld-s1-segment:not([disabled]), .spld-s1-choice:not([disabled]), .spld-s1-close')?.focus(), 0);
  }

  function shell(content) {
    return `<div class="spld-s1-lab-backdrop" role="presentation"><section class="spld-s1-lab" role="dialog" aria-modal="true" aria-label="初中讀寫實驗室"><button class="spld-s1-close" type="button" aria-label="關閉初中讀寫實驗室">×</button>${content}</section></div>`;
  }

  function menuMarkup() {
    return shell(`<div class="spld-s1-heading"><span class="spld-s1-kicker">初中 S.1–S.3 · SpLD</span><h2>初中讀寫實驗室</h2><p>按今天要練的篇章、修辭、詞彙或句法技能直接開始。可以慢慢讀、看提示、換練習或隨時離開。</p></div><div class="spld-s1-menu">${Object.entries(activities).map(([key, activity]) => `<button type="button" class="spld-s1-menu-card ${activity.accent}" data-s1-activity="${key}"><span>${activity.icon}</span><strong>${activity.title}</strong><small>${activity.description}</small><em>${activity.rounds.length} 個短回合</em></button>`).join('')}</div><aside class="spld-s1-low-pressure"><strong>低壓參與：</strong><span>👀 慢慢看句子</span><span>🔊 朗讀題目</span><span>💡 使用提示</span><span>↔ 隨時換練習</span></aside>`);
  }

  function progressMarkup() {
    const total = currentActivity().rounds.length;
    return `<div class="spld-s1-progress" role="progressbar" aria-label="練習進度" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${roundIndex + 1}" aria-valuetext="第 ${roundIndex + 1} / ${total} 關"><span>第 ${roundIndex + 1} / ${total} 關</span><div aria-hidden="true"><i style="width:${((roundIndex + 1) / total) * 100}%"></i></div></div>`;
  }

  function toolsMarkup() {
    return `<div class="spld-s1-tools" aria-label="低壓學習工具"><button type="button" id="spldS1Read" aria-label="朗讀本關題目" aria-pressed="false">🔊 朗讀題目</button><button type="button" id="spldS1Hint" aria-label="顯示解題提示">💡 看提示</button><button type="button" id="spldS1Back" aria-label="返回初中 SpLD 練習選單">← 換一項練習</button></div>`;
  }

  function choiceGridMarkup(choices) {
    return `<section class="spld-s1-mission-board" aria-label="閱讀任務控制台"><div class="spld-s1-choice-dock" data-s1-choice-dock role="img" aria-label="解題控制區。可把線索卡拖到這裏，或直接點選線索卡。"><span>🧭</span><div><strong>解題控制區</strong><small>把最符合文本的線索卡送進來</small></div></div><p>可拖放線索卡；不想拖放時，直接點選亦可。</p><div class="spld-s1-choice-grid">${choices.map((choice, index) => `<button type="button" class="spld-s1-choice" data-choice="${choice}" draggable="true" aria-label="選項 ${index + 1}：${choice}"><span aria-hidden="true">${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div></section>`;
  }

  function connectorMarkup(round) {
    return `<div class="spld-s1-connector-scene"><span>關係類別</span><strong>${round.category}</strong></div><p class="spld-s1-sentence"><span>${round.before}</span><b>＿＿</b><span>${round.after}</span></p><p class="spld-s1-prompt">轉一轉關聯詞，哪一個最能連接前後句？</p>${choiceGridMarkup(round.choices)}`;
  }

  function paragraphMarkup(round) {
    return `<div class="spld-s1-structure"><span>排列方式</span><strong>${round.structure}</strong><small>已排好 ${orderedSegments.length} / ${round.order.length} 句</small></div><p class="spld-s1-prompt">可把句子拖到下一個空格；也可逐句點選。已選的句子會依次放到上方。</p><div class="spld-s1-order-slots">${round.order.map((_, index) => `<div class="spld-s1-order-slot ${orderedSegments[index] ? 'filled' : ''}" data-s1-slot="${index}" data-sen-drop-zone="sequence"><span>${index + 1}</span><strong>${orderedSegments[index] || '？'}</strong></div>`).join('')}</div><div class="spld-s1-segment-bank">${segmentOptions.map((segment) => `<button type="button" class="spld-s1-segment ${orderedSegments.includes(segment) ? 'used' : ''}" data-s1-segment="${segment}" draggable="${!orderedSegments.includes(segment)}" data-sen-drag-source ${orderedSegments.includes(segment) ? 'disabled' : ''}>${segment}</button>`).join('')}</div>`;
  }

  function redundancyMarkup(round) {
    return `<div class="spld-s1-proof-scene"><span>原句</span><p>${round.sentence}</p></div><p class="spld-s1-prompt">哪一個字詞重複了意思，可以刪走令句子更精準？</p>${choiceGridMarkup(round.choices)}`;
  }

  function rhetoricMarkup(round) {
    return `<div class="spld-s1-rhetoric-scene"><span>句子卡</span><p>「${round.sentence}」</p></div><p class="spld-s1-prompt">這一句最主要使用哪一種修辭手法？</p>${choiceGridMarkup(round.choices)}`;
  }

  function idiomMarkup(round) {
    return `<div class="spld-s1-idiom-scene"><span>${round.visual}</span><p>${round.riddle}</p></div><div class="spld-s1-misspelling">常見錯寫：<strong>${round.wrong}</strong></div><p class="spld-s1-prompt">看圖猜成語，再選出正確的寫法。</p>${choiceGridMarkup(round.choices)}`;
  }

  function mainIdeaMarkup(round) {
    return `<article class="spld-s1-passage"><span>短文</span><p>${round.passage}</p></article><p class="spld-s1-prompt">篩走太細節或太絕對的選項，哪一句最能概括主旨？</p>${choiceGridMarkup(round.choices)}`;
  }

  function vocabularyMarkup(round) {
    return `<article class="spld-s1-passage"><span>詞語情境</span><p>${round.context}</p></article><p class="spld-s1-prompt">${round.prompt}</p>${choiceGridMarkup(round.choices)}`;
  }

  function grammarMarkup(round) {
    return `<article class="spld-s1-rhetoric-scene"><span>句法觀察</span><p>${round.sentence}</p></article><p class="spld-s1-prompt">${round.prompt}</p>${choiceGridMarkup(round.choices)}`;
  }

  function strategyMarkup(round) {
    const label = activeKey === 'chartText' ? '資料轉換' : '審題策略';
    return `<article class="spld-s1-passage"><span>${label}</span><p>${round.prompt}</p></article><p class="spld-s1-prompt">慢慢比較每個選項，選出最符合題目重點的一項。</p>${choiceGridMarkup(round.choices)}`;
  }

  function playAreaMarkup(round) {
    if (activeKey === 'connector') return connectorMarkup(round);
    if (activeKey === 'paragraph') return paragraphMarkup(round);
    if (activeKey === 'redundancy') return redundancyMarkup(round);
    if (activeKey === 'rhetoric') return rhetoricMarkup(round);
    if (activeKey === 'idiom') return idiomMarkup(round);
    if (activeKey === 'vocabulary') return vocabularyMarkup(round);
    if (activeKey === 'grammar') return grammarMarkup(round);
    if (activeKey === 'examRadar' || activeKey === 'chartText') return strategyMarkup(round);
    return mainIdeaMarkup(round);
  }

  function feedback(message, state = '') {
    const panel = document.querySelector('#spldS1Feedback');
    if (!panel) return;
    panel.className = `spld-s1-feedback ${state}`;
    panel.textContent = message;
  }

  function renderRound() {
    const activity = currentActivity();
    const round = currentRound();
    const dialog = document.querySelector('.spld-s1-lab');
    if (!dialog) return;
    dialog.innerHTML = `<button class="spld-s1-close" type="button" aria-label="關閉初中讀寫實驗室">×</button><div class="spld-s1-heading compact"><span class="spld-s1-kicker">${activity.focus}</span><h2>${activity.icon} ${activity.title}</h2><p>${activity.description}</p></div>${progressMarkup()}<div class="spld-s1-play-area">${playAreaMarkup(round)}</div><div class="spld-s1-feedback" id="spldS1Feedback" role="status" aria-live="polite" aria-atomic="true">慢慢看一看；不知道時可以按提示。</div>${toolsMarkup()}`;
    bindRound(round);
    focusRoundControl();
  }

  function readRound(round) {
    if (activeKey === 'connector') return `關聯詞轉盤。${round.before}，空格，${round.after}。請選出最合適的${round.category}關聯詞。`;
    if (activeKey === 'paragraph') return `段落結構大洗牌。請把句子按${round.structure}排列。${round.order.join('。')}`;
    if (activeKey === 'redundancy') return `文章冗詞除錯。${round.sentence}。請找出可以刪走的重複字詞。`;
    if (activeKey === 'rhetoric') return `修辭手法分類卡。${round.sentence}。請選擇比喻、擬人或排比。`;
    if (activeKey === 'idiom') return `成語圖解猜謎。${round.riddle}。常見錯寫是${round.wrong}。請選出正確成語。`;
    if (activeKey === 'vocabulary') return `詞義辨析雷達。${round.context}。${round.prompt}`;
    if (activeKey === 'grammar') return `句式關係校準。${round.sentence}。${round.prompt}`;
    if (activeKey === 'examRadar') return `審題防陷阱雷達。${round.prompt}`;
    if (activeKey === 'chartText') return `圖表與文字轉換器。${round.prompt}`;
    return `主旨提煉篩選器。${round.passage}。請選出最能概括主旨的句子。`;
  }

  function bindRound(round) {
    document.querySelector('.spld-s1-close')?.addEventListener('click', closeLab);
    document.querySelector('#spldS1Read')?.addEventListener('click', () => { if (speechActive) stopReading(); else speak(readRound(round)); });
    document.querySelector('#spldS1Hint')?.addEventListener('click', () => {
      result.hints += 1;
      feedback(`💡 ${round.hint}`, 'hint');
      speak(round.hint);
    });
    document.querySelector('#spldS1Back')?.addEventListener('click', openMenu);
    if (activeKey === 'paragraph') {
      let draggedSegment = null;
      document.querySelectorAll('[data-s1-segment]').forEach((button) => {
        button.addEventListener('click', () => chooseSegment(button.dataset.s1Segment, round));
        button.addEventListener('dragstart', (event) => { draggedSegment = button.dataset.s1Segment; try { event.dataTransfer?.setData('text/plain', draggedSegment); } catch {} });
        button.addEventListener('dragend', () => { draggedSegment = null; });
      });
      document.querySelectorAll('[data-s1-slot]').forEach((slot) => {
        slot.addEventListener('dragover', (event) => event.preventDefault());
        slot.addEventListener('drop', (event) => { event.preventDefault(); const segment = event.dataTransfer?.getData('text/plain') || draggedSegment; const nextSlot = orderedSegments.length; if (segment && Number(slot.dataset.s1Slot) === nextSlot) chooseSegment(segment, round); else if (segment) feedback(`請先放到第 ${nextSlot + 1} 格。`, 'try'); draggedSegment = null; });
      });
      return;
    }
    document.querySelectorAll('.spld-s1-choice').forEach((button) => button.addEventListener('click', () => chooseChoice(button, round)));
    bindChoiceDock((button) => chooseChoice(button, round));
  }

  function bindChoiceDock(onDropChoice) {
    const dock = document.querySelector('[data-s1-choice-dock]');
    if (!dock) return;
    let draggedChoice = '';
    document.querySelectorAll('.spld-s1-choice').forEach((button) => {
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
      const button = [...document.querySelectorAll('.spld-s1-choice')].find((item) => item.dataset.choice === choice);
      dock.classList.remove('drag-over');
      if (button) onDropChoice(button);
    });
  }

  function successText(round, choice) {
    if (activeKey === 'connector') return `「${choice}」把前後句的${round.category}關係連起來了。`;
    if (activeKey === 'redundancy') return `移除「${choice}」後，句子的意思已經足夠清楚。`;
    if (activeKey === 'rhetoric') return `這句是${choice}：留意文字如何產生畫面、動作或節奏。`;
    if (activeKey === 'idiom') return `「${choice}」的字形和意思都正確。`;
    if (activeKey === 'vocabulary') return `「${choice}」最配合這個語境，意思和搭配都準確。`;
    if (activeKey === 'grammar') return `你已找出句中的${choice}，可以用這個線索拆解長句。`;
    if (activeKey === 'examRadar') return `你已留意「${choice}」這個審題線索，可以慢慢再看要求。`;
    if (activeKey === 'chartText') return `「${choice}」是符合資料的客觀描述。`;
    return `這一句能包括短文最重要的內容，不只是一個細節。`;
  }

  function retryText() {
    if (activeKey === 'connector') return '先看兩句是相反、原因結果，還是補充更多意思，再試一次。';
    if (activeKey === 'redundancy') return '慢慢比較：哪兩個字詞其實在說同一件事？';
    if (activeKey === 'rhetoric') return '看看句中有沒有「像」、人的動作，或三個結構相近的部分。';
    if (activeKey === 'idiom') return '再看一看圖中的關鍵物件，也留意同音字是否寫對。';
    if (activeKey === 'vocabulary') return '先讀完整個情境，再比較三個詞的意思和慣常搭配。';
    if (activeKey === 'grammar') return '可先找「誰做甚麼」、關聯詞或表示先後的詞語，再選答案。';
    if (activeKey === 'examRadar') return '先圈出否定詞、限定詞或資料範圍，再慢慢比較選項。';
    if (activeKey === 'chartText') return '先看數字或趨勢，再選不過度推論的客觀描述。';
    return '找能同時包括多個重點的句子，避免只選一個細節。';
  }

  function chooseChoice(button, round) {
    if (button.disabled) return;
    const choice = button.dataset.choice;
    if (choice === round.answer) {
      result.correct += 1;
      button.classList.add('correct');
      const message = successText(round, choice);
      feedback(`✓ ${message}`, 'success');
      speak(`答對了。${message}`);
      wait(nextRound);
      return;
    }
    result.retries += 1;
    button.classList.add('wrong');
    const message = retryText();
    feedback(message, 'try');
    speak(message);
    wait(() => button.classList.remove('wrong'), 760);
  }

  function chooseSegment(segment, round) {
    if (orderedSegments.includes(segment)) return;
    orderedSegments.push(segment);
    if (orderedSegments.length < round.order.length) {
      renderRound();
      feedback(`已放到第 ${orderedSegments.length} 格。慢慢看下一句。`, 'success');
      return;
    }
    const correct = orderedSegments.every((item, index) => item === round.order[index]);
    if (correct) {
      result.correct += 1;
      renderRound();
      feedback(`✓ 你已按「${round.structure}」排好整段內容。`, 'success');
      speak(`答對了。你已按${round.structure}排好整段內容。`);
      wait(nextRound);
      return;
    }
    result.retries += 1;
    renderRound();
    feedback('這個次序還可以再想一想。先找時間詞、問題或主要觀點，再試一次。', 'try');
    speak('這個次序還可以再想一想。慢慢重新排列也可以。');
    wait(() => { orderedSegments = []; renderRound(); }, 900);
  }

  function prepareRoundState() {
    orderedSegments = [];
    segmentOptions = activeKey === 'paragraph' ? shuffle(currentRound().order) : [];
  }

  function nextRound() {
    if (roundIndex < currentActivity().rounds.length - 1) {
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
    const total = activity.rounds.length;
    document.dispatchEvent(new CustomEvent('spld-s1-lab-complete', { detail: { ...result, activity: activity.title } }));
    const dialog = document.querySelector('.spld-s1-lab');
    if (!dialog) return;
    dialog.innerHTML = `<button class="spld-s1-close" type="button" aria-label="關閉初中讀寫實驗室">×</button><div class="spld-s1-result"><span class="spld-s1-kicker">本次讀寫回顧</span><h2>完成 ${activity.title}</h2><p>你已完成 ${total} 個小回合。可以休息、選另一項練習，或回到初中 SpLD 關卡。</p><div class="spld-s1-result-grid"><div><strong>${result.correct} / ${total}</strong><span>完成回合</span></div><div><strong>${result.retries}</strong><span>溫和重試</span></div><div><strong>${result.hints}</strong><span>使用提示</span></div></div><aside>這些數字只協助教師安排下一步，不作比較或評分。</aside><div class="spld-s1-result-actions"><button type="button" id="spldS1TryAgain">↺ 選另一項練習</button><button type="button" id="spldS1Exit">回到初中 SpLD 關卡</button></div></div>`;
    dialog.querySelector('.spld-s1-close')?.addEventListener('click', closeLab);
    dialog.querySelector('#spldS1TryAgain')?.addEventListener('click', openMenu);
    dialog.querySelector('#spldS1Exit')?.addEventListener('click', closeLab);
  }

  function startActivity(key) {
    if (!activities[key]) return;
    activeKey = key;
    roundIndex = 0;
    result = { correct: 0, retries: 0, hints: 0 };
    completed = false;
    prepareRoundState();
    renderRound();
  }

  function openMenu() {
    closeLab({ restoreFocus: false });
    document.body.insertAdjacentHTML('beforeend', menuMarkup());
    prepareDialog({ focusSelector: '[data-s1-activity]' });
    document.querySelector('.spld-s1-close')?.addEventListener('click', closeLab);
    document.querySelectorAll('[data-s1-activity]').forEach((button) => button.addEventListener('click', () => startActivity(button.dataset.s1Activity)));
  }

  function openActivity(key, trigger = document.activeElement) {
    if (!activities[key]) return;
    returnFocus = trigger;
    closeLab({ restoreFocus: false });
    document.body.insertAdjacentHTML('beforeend', shell(''));
    prepareDialog();
    startActivity(key);
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `.spld-s1-lab-backdrop{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;background:rgba(20,29,53,.7)}.spld-s1-lab{position:relative;width:min(800px,100%);max-height:calc(100vh - 32px);overflow:auto;padding:32px;border-radius:27px;background:#fff;color:#26344b;box-shadow:0 28px 72px rgba(14,21,42,.35)}.spld-s1-close{position:absolute;top:14px;right:16px;min-width:44px;min-height:44px;border:0;border-radius:50%;color:#5c6579;background:#f0f3f8;font-size:28px;line-height:1;cursor:pointer}.spld-s1-heading{padding-right:48px}.spld-s1-heading h2{margin:5px 0 6px;color:#233a60;font-size:29px}.spld-s1-heading p{margin:0;color:#66738a;font-size:17px;line-height:1.68}.spld-s1-kicker{display:block;color:#278a7e;font-size:14px;font-weight:900;letter-spacing:.06em}.spld-s1-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:22px 0}.spld-s1-menu-card{min-height:198px;padding:19px;display:flex;flex-direction:column;gap:7px;border:2px solid #cfe8e1;border-radius:21px;background:#f8fffd;color:#243852;text-align:left;cursor:pointer;transition:transform .16s,box-shadow .16s}.spld-s1-menu-card:hover{transform:translateY(-3px);box-shadow:0 13px 26px rgba(30,112,97,.13)}.spld-s1-menu-card.violet{border-color:#ddd5fb;background:#fbfaff}.spld-s1-menu-card.orange{border-color:#f3d7a9;background:#fffaf2}.spld-s1-menu-card.pink{border-color:#ebc5d9;background:#fff8fb}.spld-s1-menu-card.blue{border-color:#c6d9f3;background:#f7faff}.spld-s1-menu-card.yellow{border-color:#ead99d;background:#fffdf3}.spld-s1-menu-card>span{font-size:37px}.spld-s1-menu-card strong{font-size:21px}.spld-s1-menu-card small{color:#617086;line-height:1.55}.spld-s1-menu-card em{margin-top:auto;color:#2b887d;font-style:normal;font-weight:850}.spld-s1-low-pressure{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:13px 15px;border-radius:15px;background:#eff8f7;color:#35655e;font-size:14px}.spld-s1-low-pressure span{padding:5px 8px;border-radius:99px;background:#fff}.spld-s1-progress{display:flex;align-items:center;gap:12px;margin:21px 0 14px;color:#3b766e;font-size:15px;font-weight:850}.spld-s1-progress>div{height:8px;flex:1;overflow:hidden;border-radius:99px;background:#dcece9}.spld-s1-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#249b8c,#63c9ae)}.spld-s1-play-area{padding:21px;border:1px solid #d7ebe6;border-radius:21px;background:linear-gradient(145deg,#fbfffe,#eff9f7)}.spld-s1-connector-scene,.spld-s1-structure,.spld-s1-proof-scene,.spld-s1-rhetoric-scene,.spld-s1-idiom-scene,.spld-s1-passage{padding:16px;border-radius:17px;background:#fff;color:#2e4a69}.spld-s1-connector-scene,.spld-s1-structure{display:flex;align-items:center;justify-content:center;gap:12px}.spld-s1-connector-scene span,.spld-s1-structure span,.spld-s1-proof-scene>span,.spld-s1-rhetoric-scene>span,.spld-s1-passage>span{color:#39776e;font-size:12px;font-weight:900}.spld-s1-connector-scene strong,.spld-s1-structure strong{color:#23796d;font-size:24px}.spld-s1-structure small{color:#617286;font-weight:750}.spld-s1-sentence{margin:20px 0 6px;color:#203752;font-size:21px;font-weight:850;line-height:1.65;text-align:center}.spld-s1-sentence b{display:inline-block;min-width:62px;color:#23796d;border-bottom:3px solid #68b8ac;text-align:center}.spld-s1-prompt{margin:18px 0 14px;color:#203752;font-size:20px;font-weight:850;line-height:1.58}.spld-s1-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.spld-s1-choice{min-height:104px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:2px solid #a7d9cf;border-radius:16px;background:#fff;color:#276a62;cursor:pointer}.spld-s1-choice span{font-size:12px;font-weight:850}.spld-s1-choice strong{padding:0 8px;font-size:21px;line-height:1.38;text-align:center}.spld-s1-choice.correct{border-color:#44a873;background:#ebf9ef;color:#246d48}.spld-s1-choice.wrong{border-color:#d47d7d;background:#fff0f0;color:#9b4d4d}.spld-s1-order-slots{display:grid;gap:9px;margin:0 0 14px}.spld-s1-order-slot{min-height:58px;display:flex;align-items:center;gap:12px;padding:11px 13px;border:2px dashed #bfb5e8;border-radius:14px;background:#fff;color:#6a6385}.spld-s1-order-slot.filled{border-style:solid;border-color:#8f7cdc;background:#f5f2ff;color:#47398d}.spld-s1-order-slot span{display:grid;place-items:center;min-width:28px;height:28px;border-radius:50%;background:#edeaff;color:#51458f;font-size:13px;font-weight:900}.spld-s1-order-slot strong{font-size:16px;line-height:1.5}.spld-s1-segment-bank{display:grid;gap:9px}.spld-s1-segment{min-height:54px;padding:11px 13px;border:2px solid #b9afe7;border-radius:13px;background:#fff;color:#4d3e9b;font-size:16px;font-weight:800;line-height:1.48;text-align:left;cursor:pointer}.spld-s1-segment.used{opacity:.42}.spld-s1-proof-scene p,.spld-s1-rhetoric-scene p,.spld-s1-idiom-scene p,.spld-s1-passage p{margin:8px 0 0;font-size:20px;font-weight:850;line-height:1.65}.spld-s1-misspelling{margin-top:12px;padding:11px 13px;border-radius:13px;background:#fff4e9;color:#8e5715;font-size:16px}.spld-s1-misspelling strong{margin-left:4px;font-size:19px}.spld-s1-idiom-scene{text-align:center}.spld-s1-idiom-scene>span{display:block;font-size:50px;letter-spacing:4px}.spld-s1-passage{border-left:5px solid #5b9d93}.spld-s1-feedback{min-height:27px;margin:14px 0;color:#5e6f82;font-size:17px;line-height:1.68}.spld-s1-feedback.success{color:#25714f;font-weight:850}.spld-s1-feedback.try{color:#9b4d4d;font-weight:850}.spld-s1-feedback.hint{color:#896313;font-weight:850}.spld-s1-tools,.spld-s1-result-actions{display:flex;flex-wrap:wrap;gap:9px}.spld-s1-tools button,.spld-s1-result-actions button{min-height:50px;padding:10px 13px;border:1px solid #c9ded9;border-radius:11px;background:#fff;color:#26776d;font-size:16px;font-weight:850;cursor:pointer}.spld-s1-tools button:first-child,.spld-s1-result-actions button:first-child{border-color:#177d70;background:#177d70;color:#fff}.spld-s1-result{padding-top:14px;text-align:center}.spld-s1-result h2{margin:6px 0;color:#233a60;font-size:29px}.spld-s1-result>p{color:#617286;font-size:17px;line-height:1.6}.spld-s1-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin:22px 0}.spld-s1-result-grid div{padding:14px;border-radius:16px;background:#eef9f7}.spld-s1-result-grid strong{display:block;color:#277c70;font-size:25px}.spld-s1-result-grid span{color:#5a6d7b;font-size:13px}.spld-s1-result aside{padding:12px;border-radius:13px;background:#eef5ff;color:#405d7c;font-size:14px;line-height:1.5}.spld-s1-close:focus-visible,.spld-s1-tools button:focus-visible,.spld-s1-result-actions button:focus-visible,.spld-s1-choice:focus-visible,.spld-s1-segment:focus-visible,.spld-s1-menu-card:focus-visible{outline:4px solid #145fa8;outline-offset:3px;box-shadow:0 0 0 7px rgba(255,255,255,.95),0 0 0 10px #145fa8}@media(max-width:620px){.spld-s1-lab{padding:26px 16px;border-radius:22px}.spld-s1-menu{grid-template-columns:1fr}.spld-s1-menu-card{min-height:156px}.spld-s1-heading h2,.spld-s1-result h2{font-size:27px;line-height:1.32}.spld-s1-heading p{font-size:16px}.spld-s1-prompt{font-size:20px}.spld-s1-sentence,.spld-s1-proof-scene p,.spld-s1-rhetoric-scene p,.spld-s1-idiom-scene p,.spld-s1-passage p{font-size:19px}.spld-s1-choice-grid{gap:8px}.spld-s1-choice{min-height:100px}.spld-s1-choice strong{font-size:19px}.spld-s1-order-slot strong{font-size:15px}.spld-s1-segment{font-size:16px}.spld-s1-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.spld-s1-tools button:last-child{grid-column:span 2}.spld-s1-result-grid{gap:7px}.spld-s1-result-grid strong{font-size:21px}}@media(min-width:621px) and (max-width:820px){.spld-s1-lab{width:min(760px,calc(100% - 28px));padding:30px}.spld-s1-choice{min-height:110px}.spld-s1-prompt{font-size:21px}}@media(prefers-reduced-motion:reduce){.spld-s1-menu-card{transition:none}}`;
    document.head.appendChild(style);
    const gameplayStyle = document.createElement('style');
    gameplayStyle.textContent = `.spld-s1-mission-board{display:grid;gap:12px;margin-top:14px}.spld-s1-choice-dock{display:flex;align-items:center;gap:12px;min-height:92px;padding:14px 16px;border:3px dashed #398eae;border-radius:18px;background:linear-gradient(135deg,#e9faff,#f8fdff);color:#185d76;transition:transform 180ms cubic-bezier(.23,1,.32,1),background 180ms cubic-bezier(.23,1,.32,1),box-shadow 180ms cubic-bezier(.23,1,.32,1)}.spld-s1-choice-dock>span{font-size:37px}.spld-s1-choice-dock strong,.spld-s1-choice-dock small{display:block}.spld-s1-choice-dock strong{font-size:18px}.spld-s1-choice-dock small{margin-top:4px;color:#4e7480;font-size:14px;line-height:1.45}.spld-s1-choice-dock.drag-over{transform:translateY(-2px) scale(1.01);border-style:solid;background:#d9f3fb;box-shadow:0 10px 22px rgba(37,128,164,.18)}.spld-s1-mission-board>p{margin:0;color:#587184;font-size:14px;font-weight:750;line-height:1.5}.spld-s1-choice{cursor:grab;transition:transform 160ms cubic-bezier(.23,1,.32,1),box-shadow 180ms cubic-bezier(.23,1,.32,1),opacity 160ms}.spld-s1-choice:hover{transform:translateY(-3px);box-shadow:0 9px 18px rgba(39,106,98,.15)}.spld-s1-choice:active{cursor:grabbing;transform:scale(.98)}.spld-s1-choice.dragging{opacity:.56}@media(max-width:620px){.spld-s1-choice-dock{min-height:84px}.spld-s1-choice-dock>span{font-size:32px}.spld-s1-mission-board>p{font-size:13px}}@media(prefers-reduced-motion:reduce){.spld-s1-choice,.spld-s1-choice-dock{transition:none}}`;
    document.head.appendChild(gameplayStyle);
  }

  window.SPLD_S1_LAB = {
    activityCards() {
      return Object.entries(activities).map(([key, activity]) => ({
        id: `spld-s1-${key}`,
        s1ActivityKey: key,
        lab: 's1',
        category: 'cognition',
        categoryName: '初中 · SpLD 篇章、詞彙與文法',
        tone: ({ connector: 'teal', paragraph: 'purple', redundancy: 'orange', rhetoric: 'pink', idiom: 'blue', mainIdea: 'yellow', vocabulary: 'blue', grammar: 'purple' })[key] || 'purple',
        icon: activity.icon,
        title: activity.title,
        description: activity.description,
        tag: `S1–S3 · ${activity.focus}`,
        supports: ['1'],
        rounds: activity.rounds
      }));
    },
    openActivity,
    openMenu
  };

  injectStyles();
})();
