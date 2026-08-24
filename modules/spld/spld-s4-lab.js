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
    },
    sq3r: {
      icon: '🏛️', title: 'SQ3R 閱讀策略塔', description: '把概覽、提問、閱讀、背誦和複習拆成可跟隨的小步。', focus: '長文閱讀與元認知策略', accent: 'teal',
      rounds: [
        item('SQ3R · 概覽', '剛拿到一篇長文，尚未開始細讀。', '第一步最適合做甚麼？', '先看標題、小標題和圖表', ['先看標題、小標題和圖表', '立刻背誦全文', '先跳到最後一題'], 'Survey 是概覽：先掌握文章的結構和大意。'),
        item('SQ3R · 提問', '你已看過小標題「減少塑膠浪費」。', '下一步可把標題變成甚麼？', '這段會介紹哪些減塑方法？', ['這段會介紹哪些減塑方法？', '這段一共有幾個字？', '作者一定同意我嗎？'], 'Question 是把標題變成可帶著讀的問題。'),
        item('SQ3R · 閱讀', '你正閱讀有兩段例子的文章。', '最有幫助的做法是甚麼？', '帶著問題找關鍵句', ['帶著問題找關鍵句', '同時開很多無關網頁', '略過所有例子'], 'Read 時以剛才的問題引導自己找相關資料。'),
        item('SQ3R · 背誦', '讀完一個短段落後。', '應怎樣確認理解？', '合上文字，用自己的話說重點', ['合上文字，用自己的話說重點', '立刻忘記內容', '只抄最長一句'], 'Recite 是嘗試用自己的話重述，而非逐字背誦。'),
        item('SQ3R · 複習', '完成三段閱讀後。', '最合適的下一步是？', '回看問題和自己的重點', ['回看問題和自己的重點', '只看文章第一個字', '把所有標記刪除'], 'Review 是回到問題和重點，檢查是否仍能連起來。'),
        item('SQ3R · 自我監控', '你發現不能回答自己剛才提出的問題。', '較合適的做法是？', '回到相關段落慢讀，再找線索', ['回到相關段落慢讀，再找線索', '直接猜一個答案', '放棄整篇文章'], '不確定時回到問題對應的段落，是可重試的閱讀策略。'),
        item('SQ3R · 筆記', '要把一段長文的重點寫在筆記上。', '哪種寫法最有幫助？', '用關鍵詞和短句分點記錄', ['用關鍵詞和短句分點記錄', '整段逐字抄錄', '只寫自己的名字'], '短句和關鍵詞較容易在複習時找回結構。'),
        item('SQ3R · 收束', '完成閱讀後，想知道自己是否理解主旨。', '最穩妥的檢查是？', '用一句話概括文章回答的問題', ['用一句話概括文章回答的問題', '只看頁數', '比較自己讀得有多快'], '能用一句話回應開始時的問題，代表掌握到較完整的意思。')
      ]
    },
    synthesis: {
      icon: '🗂️', title: '綜合資料矩陣', description: '比較文字、圖表和對話資料，挑選能支持寫作重點的證據。', focus: '多源資料整合', accent: 'blue',
      rounds: [
        item('資料整合', '文字說「學生希望有更多安靜閱讀位置」；圖表顯示六成學生支持閱讀角。', '哪項資料最能支持設立閱讀角？', '六成學生支持閱讀角', ['六成學生支持閱讀角', '文章有三段', '圖表用了藍色'], '選與寫作主張直接相關的文字或數據。'),
        item('資料整合', '訪問記錄說「午飯時圖書館較擠」；時間表顯示午飯有三十分鐘。', '哪個建議最貼近兩份資料？', '午飯時增加短暫閱讀座位', ['午飯時增加短暫閱讀座位', '取消所有午飯時間', '把圖書館改成操場'], '把「擠」和「午飯時間」兩項資料連起來思考。'),
        item('資料整合', '調查顯示同學最常忘記帶水樽；老師提示可在前一晚準備。', '哪個行動最適合寫進建議？', '前一晚把水樽放進書包', ['前一晚把水樽放進書包', '完全不用帶水', '等到口渴才想'], '建議要同時回應問題和可做到的做法。'),
        item('資料整合', '圖表顯示回收量上升；訪問中同學說新回收箱更易找到。', '最合理的推論是？', '清楚位置可能有助同學回收', ['清楚位置可能有助同學回收', '所有人都一定喜歡回收', '回收箱不需要標誌'], '可用「可能」把觀察和原因謹慎連起來。'),
        item('資料整合', '文章指出運動可改善精神；問卷顯示多數同學希望小息有活動。', '哪個主題最能整合兩份資料？', '安排合適小息活動支持健康', ['安排合適小息活動支持健康', '只討論問卷格式', '完全取消小息'], '找出兩份資料共同指向的重點。'),
        item('資料整合', '文字說不少同學看不懂長通知；圖示版本讓更多人找到集合點。', '哪項證據最適合放在建議內？', '圖示版本讓更多人找到集合點', ['圖示版本讓更多人找到集合點', '通知用了很多字', '集合點有一張桌子'], '選能直接說明建議有何作用的資料。'),
        item('資料整合', '資料甲：圖書館平日借書量高。資料乙：週三會提早關門。', '發出提醒時最重要加入甚麼？', '週三的提早關門時間', ['週三的提早關門時間', '借書量高的感受', '圖書館牆身顏色'], '提醒要提供可影響安排的實用資料。'),
        item('資料整合', '兩篇文章分別提出「自備餐具」和「設置清洗站」。', '怎樣寫較能公平整合兩個觀點？', '兩者可配合使用以減少即棄用品', ['兩者可配合使用以減少即棄用品', '只可以選一個，不能討論', '兩篇文章完全沒有關係'], '比較後可找共同目標和可互補的做法。')
      ]
    },
    tone: {
      icon: '✉️', title: '實用文語調修復', description: '按對象和目的選擇清楚、尊重而合適的實用文句子。', focus: '體裁意識與語調', accent: 'pink', layout: 'long',
      rounds: [
        item('寫給校長的建議', '你想建議學校增加安靜閱讀角。', '哪一句開場最合適？', '敬啟者：本人建議在圖書館設置安靜閱讀角。', ['敬啟者：本人建議在圖書館設置安靜閱讀角。', '喂，快點整個閱讀角！', '你一定要聽我講。'], '寫給學校管理人員可用清楚、尊重的書面語。'),
        item('電郵給老師', '你因病未能按時交功課。', '哪一句最合適？', '老師您好，我因身體不適未能如期交功課，想申請延後一天提交。', ['老師您好，我因身體不適未能如期交功課，想申請延後一天提交。', '我唔交啦。', '你幫我做晒。'], '說明情況、提出清楚請求，會較容易得到合適回應。'),
        item('活動通知', '你要提醒同學帶備用品。', '哪一句最清楚？', '請於星期五帶備水樽及雨傘，在禮堂集合。', ['請於星期五帶備水樽及雨傘，在禮堂集合。', '記得帶嘢啦。', '星期五好多嘢。'], '通知應包括時間、用品和地點。'),
        item('致謝訊息', '義工完成社區活動後要向中心致謝。', '哪一句最合適？', '感謝貴中心提供機會，讓我們參與今次活動。', ['感謝貴中心提供機會，讓我們參與今次活動。', '你哋安排都算可以。', '下次再講。'], '致謝可指出對方提供了甚麼，語氣會更完整。'),
        item('查詢電郵', '你想確認面試地點。', '哪一句問題最清楚？', '請問面試將於哪個地址舉行？', ['請問面試將於哪個地址舉行？', '面試喺邊？', '你講清楚啲。'], '查詢要直接問需要的資料，同時保留禮貌語氣。'),
        item('公開建議', '你要提出改善校園飲水設備。', '哪一句理由最有說服力？', '增設飲水機可方便同學補充水分，亦能減少即棄膠樽。', ['增設飲水機可方便同學補充水分，亦能減少即棄膠樽。', '我覺得一定要有。', '沒有飲水機很煩。'], '實用文建議加入清楚理由，會令內容更具體。'),
        item('服務回覆', '有人詢問圖書館開放時間。', '哪一句回覆最清楚？', '本館星期一至五上午九時至下午六時開放。', ['本館星期一至五上午九時至下午六時開放。', '平日有開。', '自己上網睇。'], '服務資訊要包含日子和時間，方便對方安排。'),
        item('結尾敬語', '你完成一封正式申請電郵。', '哪個結尾最合適？', '此致 敬禮', ['此致 敬禮', '拜拜啦', '我講完'], '正式書信可用固定、尊重的結尾敬語。')
      ]
    },
    compare: {
      icon: '⚖️', title: '多文本比較對決', description: '比較兩段不同觀點的文字，找出立場、共同點和支持資料。', focus: '比較閱讀與批判思考', accent: 'orange',
      rounds: [
        item('文本甲與乙', '甲：學校應增加電子教材。乙：紙本教材有助減少螢幕時間。', '兩篇文本最主要的不同是甚麼？', '對教材形式的看法不同', ['對教材形式的看法不同', '都討論同一位老師', '都完全支持同一做法'], '兩篇都談教材，但對電子和紙本的取向不同。'),
        item('文本甲與乙', '甲：閱讀角能提供安靜空間。乙：閱讀角可增加接觸圖書的機會。', '兩篇文本的共同點是甚麼？', '都支持設置閱讀角', ['都支持設置閱讀角', '都反對圖書館', '都只談運動'], '兩者理由不同，但都指向支持閱讀角。'),
        item('文本甲與乙', '甲引用「六成同學支持回收箱」。乙說「我覺得回收箱方便」。', '哪一段提供較具體的數據證據？', '文本甲', ['文本甲', '文本乙', '兩段都沒有'], '百分比是可核對的數據資料。'),
        item('文本甲與乙', '甲主張延長圖書館時間；乙主張在課室設小書架。', '兩項建議可以怎樣理解？', '可互補，增加不同地方的閱讀機會', ['可互補，增加不同地方的閱讀機會', '一定互相矛盾', '完全與閱讀無關'], '不同做法也可以共同服務同一目標。'),
        item('文本甲與乙', '甲說雨天應留在室內活動；乙說雨天可在禮堂做體能活動。', '乙文最像對甲文作甚麼補充？', '提出室內活動的具體地點和做法', ['提出室內活動的具體地點和做法', '否定所有安全安排', '重複同一句話'], '兩段都接受室內活動，乙再具體說明可在哪裏做。'),
        item('文本甲與乙', '甲：自備水樽能減少膠樽。乙：學校應設更多飲水機。', '共同的關注點是甚麼？', '減少即棄膠樽並方便補充水分', ['減少即棄膠樽並方便補充水分', '比較水樽顏色', '增加膠樽使用'], '兩個做法都與飲水和減少即棄用品相關。'),
        item('文本甲與乙', '甲用訪問一位學生的經驗；乙用全校問卷結果。', '哪種資料較適合了解整體同學的看法？', '全校問卷結果', ['全校問卷結果', '一位學生的經驗', '兩者都不能提供資料'], '問卷涵蓋較多人，較適合描述整體趨勢。'),
        item('文本甲與乙', '甲認為先做最容易的題目；乙認為先讀完整份題目再安排。', '比較後最穩妥的結論是？', '兩者都是可按個人需要嘗試的應試策略', ['兩者都是可按個人需要嘗試的應試策略', '其中一方一定適合所有人', '兩者都不能使用'], '策略可因題目與個人情況而調整，不需要作能力比較。')
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
  function choiceMarkup(round) { return `<section class="spld-s4-mission-board" aria-label="論證與文言工房"><div class="spld-s4-choice-dock" data-s4-choice-dock role="img" aria-label="答案工位。可把解析卡拖到這裏，或直接點選解析卡。"><span>⚗️</span><div><strong>答案工位</strong><small>把最有根據的解析卡送進來</small></div></div><p>可拖放解析卡；不想拖放時，直接點選亦可。</p><div class="spld-s4-choice-grid ${currentActivity().layout === 'long' ? 'long' : ''}">${round.choices.map((choice, index) => `<button type="button" class="spld-s4-choice" data-s4-choice="${choice}" draggable="true" aria-label="選項 ${index + 1}：${choice}"><span>${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div></section>`; }
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
    bindChoiceDock((button) => choose(button, round));
    focusRoundControl();
  }
  function bindChoiceDock(onDropChoice) {
    const dock = document.querySelector('[data-s4-choice-dock]');
    if (!dock) return;
    let draggedChoice = '';
    document.querySelectorAll('.spld-s4-choice').forEach((button) => {
      button.addEventListener('dragstart', (event) => {
        draggedChoice = button.dataset.s4Choice || '';
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
      const button = [...document.querySelectorAll('.spld-s4-choice')].find((item) => item.dataset.s4Choice === choice);
      dock.classList.remove('drag-over');
      if (button) onDropChoice(button);
    });
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
    const gameplayStyle = document.createElement('style');
    gameplayStyle.textContent = `.spld-s4-mission-board{display:grid;gap:12px;margin-top:14px}.spld-s4-choice-dock{display:flex;align-items:center;gap:12px;min-height:92px;padding:14px 16px;border:3px dashed #8c73cc;border-radius:18px;background:linear-gradient(135deg,#f1edff,#fcfaff);color:#57408f;transition:transform 180ms cubic-bezier(.23,1,.32,1),background 180ms cubic-bezier(.23,1,.32,1),box-shadow 180ms cubic-bezier(.23,1,.32,1)}.spld-s4-choice-dock>span{font-size:37px}.spld-s4-choice-dock strong,.spld-s4-choice-dock small{display:block}.spld-s4-choice-dock strong{font-size:18px}.spld-s4-choice-dock small{margin-top:4px;color:#716688;font-size:14px;line-height:1.45}.spld-s4-choice-dock.drag-over{transform:translateY(-2px) scale(1.01);border-style:solid;background:#e7ddff;box-shadow:0 10px 22px rgba(100,75,169,.18)}.spld-s4-mission-board>p{margin:0;color:#687387;font-size:14px;font-weight:750;line-height:1.5}.spld-s4-choice{cursor:grab}.spld-s4-choice:hover{transform:translateY(-3px);box-shadow:0 9px 18px rgba(87,68,137,.15)}.spld-s4-choice:active{cursor:grabbing;transform:scale(.98)}.spld-s4-choice.dragging{opacity:.56}@media(max-width:620px){.spld-s4-choice-dock{min-height:84px}.spld-s4-choice-dock>span{font-size:32px}.spld-s4-mission-board>p{font-size:13px}}@media(prefers-reduced-motion:reduce){.spld-s4-choice-dock{transition:none}}`;
    document.head.appendChild(gameplayStyle);
  }
  window.SPLD_S4_LAB = {
    activityCards: () => Object.entries(activities).map(([key, activity]) => ({ id: `spld-s4-${key}`, s4ActivityKey: key, lab: 's4', category: 'cognition', categoryName: '高中 · SpLD 文言與論證', tone: ({ polysemy: 'purple', loan: 'teal', argument: 'orange', functionWord: 'pink', academic: 'blue', surgery: 'yellow', sq3r: 'teal', synthesis: 'blue', tone: 'pink', compare: 'orange' })[key], icon: activity.icon, title: activity.title, description: activity.description, tag: `S4–S6 · ${activity.focus}`, supports: ['1'], rounds: activity.rounds })),
    openActivity,
    openMenu
  };
  injectStyles();
})();
