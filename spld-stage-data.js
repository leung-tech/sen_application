window.SPLD_STAGE_TASKS = {
  upper: {
    categoryName: '高小 · SpLD 讀寫訓練',
    title: '高小讀寫闖關',
    description: '12 關字詞、句子、公告與資料理解訓練',
    tag: 'P4–P6 · 12 關',
    rounds: [
      { id: 'P4-SPLD-01', band: 'P4 · 部件辨識', prompt: '「校」字的左邊是哪個部件？', context: '目標字：<strong>校</strong>', choices: ['木', '女', '日'], answer: '木', instruction: '請看校字，找出它左邊的部件。', clue: '把「校」字分開看，左邊是木字旁。', success: '答對了！你用部件找到了校字。' },
      { id: 'P4-SPLD-02', band: 'P4 · 詞義理解', prompt: '「準時」最接近哪個意思？', context: '老師說：明天請<strong>準時</strong>到禮堂集合。', choices: ['依約定時間到達', '隨時都可以到', '不用出席'], answer: '依約定時間到達', instruction: '請由句子找出準時的意思。', clue: '想一想集合有指定時間，準時就是不早太多，也不遲到。', success: '很好！你理解了準時的意思。' },
      { id: 'P4-SPLD-03', band: 'P4 · 同音字辨別', prompt: '去圖書館可以借＿＿。', context: '選出能令句子通順的字。', choices: ['書', '輸', '舒'], answer: '書', instruction: '請選出和圖書館有關的字。', clue: '圖書館有很多可以閱讀的東西，想一想是哪一個書字。', success: '答對了！圖書館可以借書。' },
      { id: 'P4-SPLD-04', band: 'P4 · 量詞運用', prompt: '一＿＿圖書', context: '選一個最合適的量詞。', choices: ['本', '張', '條'], answer: '本', instruction: '請選出和圖書最常用的量詞。', clue: '一本書、兩本書；圖書通常用本來數。', success: '做得好！你選對了圖書的量詞。' },
      { id: 'P4-SPLD-05', band: 'P4 · 連接詞', prompt: '明天下雨，＿＿要帶雨傘。', context: '選出能表達原因和結果的詞語。', choices: ['所以', '但是', '如果'], answer: '所以', instruction: '請選出把下雨和帶雨傘連起來的詞。', clue: '下雨是原因，帶雨傘是結果；可以用所以。', success: '答對了！你用所以連起了原因和結果。' },
      { id: 'P5-SPLD-06', band: 'P5 · 句子排序', prompt: '哪一句的詞序正確？', context: '把「我／在圖書館／借書」排成完整句子。', choices: ['我在圖書館借書。', '圖書館我借書在。', '借書我圖書館在。'], answer: '我在圖書館借書。', instruction: '請找出誰、在哪裏、做甚麼都清楚的一句。', clue: '先找誰：我；再找在哪裏：圖書館；最後找做甚麼：借書。', success: '很好！你辨認到完整句子的詞序。' },
      { id: 'P5-SPLD-07', band: 'P5 · 公告取訊', prompt: '哪一天要交回條？', context: '活動通知：請同學在<strong>星期五</strong>前交回條。', choices: ['星期五', '星期一', '星期日'], answer: '星期五', instruction: '請從通知找出交回條的日期。', clue: '找一找前字前面的日期；那就是截止日。', success: '答對了！你找到了公告的日期資料。' },
      { id: 'P5-SPLD-08', band: 'P5 · 段落主旨', prompt: '這段話最主要提醒甚麼？', context: '明天是戶外活動日。天氣較熱，請穿輕便衣服，並<strong>帶水樽</strong>。', choices: ['帶水樽', '帶玩具', '帶厚外套'], answer: '帶水樽', instruction: '請找出和戶外活動最有關的提醒。', clue: '天氣較熱時，身體最需要補充甚麼？', success: '很好！你找到了段落的主要提醒。' },
      { id: 'P6-SPLD-09', band: 'P6 · 表格資料', prompt: '這本書的歸還日是哪一天？', context: '借書單：書名《校園故事》；借出日 4 月 3 日；<strong>歸還日 4 月 17 日</strong>。', choices: ['4 月 17 日', '4 月 3 日', '5 月 17 日'], answer: '4 月 17 日', instruction: '請在借書單找出歸還日。', clue: '先找到歸還日三個字，再讀它後面的日期。', success: '答對了！你在表格找到正確日期。' },
      { id: 'P6-SPLD-10', band: 'P6 · 三步指令', prompt: '這個指令的第一步是甚麼？', context: '指令：<strong>先寫姓名，放入文件夾，最後交給老師。</strong>', choices: ['寫姓名', '放入文件夾', '交給老師'], answer: '寫姓名', instruction: '請聽三步指令，找出第一個行動。', clue: '留意先字後面的行動；先寫姓名，之後才放入文件夾。', success: '太好了！你找到了三步指令的第一步。' },
      { id: 'P6-SPLD-11', band: 'P6 · 易混字辨別', prompt: '「＿＿習」應該選哪個字？', context: '老師說：每天<strong>溫習</strong>十分鐘。', choices: ['溫', '穩', '蘊'], answer: '溫', instruction: '請選出可以組成「溫習」的字。', clue: '讀一讀「每天溫習」；這個詞和學習、複習有關。', success: '答對了！你用詞義和字形選對了「溫」。' },
      { id: 'P6-SPLD-12', band: 'P6 · 圖表重點', prompt: '哪一項要最先完成？', context: '待辦卡：<strong>紅色：明天交回條</strong>；黃色：下星期溫習單；藍色：月底閱讀記錄。', choices: ['紅色：明天交回條', '黃色：下星期溫習單', '藍色：月底閱讀記錄'], answer: '紅色：明天交回條', instruction: '請看顏色和日期，找出最先要做的一項。', clue: '先看最近的日期；明天比下星期和月底早。', success: '很好！你從視覺待辦卡找到了最優先事項。' }
    ]
  },
  junior: {
    categoryName: '初中 · SpLD 讀寫訓練',
    title: '初中讀寫闖關',
    description: '12 關校園、社區與同儕資料理解訓練',
    tag: 'S1–S3 · 12 關',
    rounds: [
      { id: 'S1-SPLD-01', band: 'S1 · 時間資料', prompt: '活動在甚麼時候集合？', context: '活動通知：請同學在<strong>三時十五分</strong>到禮堂集合。', choices: ['三時十五分', '二時十五分', '四時十五分'], answer: '三時十五分', instruction: '請從通知找出集合時間。', clue: '找集合兩個字附近的時間數字。', success: '答對了！你從通知找到集合時間。' },
      { id: 'S1-SPLD-02', band: 'S1 · 通知目的', prompt: '為甚麼要保留收據？', context: '社區活動提示：付款後請<strong>保留收據</strong>，有需要時出示。', choices: ['日後核對或出示', '立刻丟掉', '用來買食物'], answer: '日後核對或出示', instruction: '請選出保留收據的原因。', clue: '句子後半說有需要時出示；收據要先放好。', success: '很好！你理解了通知的目的。' },
      { id: 'S1-SPLD-03', band: 'S1 · 字義推斷', prompt: '「活動延期」是甚麼意思？', context: '因天雨關係，星期六的活動<strong>延期</strong>至下星期。', choices: ['遲一些進行', '立刻取消', '今天完成'], answer: '遲一些進行', instruction: '請由句子推斷延期的意思。', clue: '活動不是星期六進行，而是改到下星期；就是延後。', success: '答對了！你用語境理解了延期。' },
      { id: 'S1-SPLD-04', band: 'S1 · 比較資料', prompt: '哪一項的截止日期較早？', context: '閱讀報告：4 月 12 日交；專題大綱：<strong>4 月 8 日</strong>交。', choices: ['專題大綱', '閱讀報告', '兩項同一天'], answer: '專題大綱', instruction: '請比較兩個日期，找出較早的一項。', clue: '先比較同一個月的日子；8 比 12 早。', success: '做得好！你比較到較早的截止日。' },
      { id: 'S2-SPLD-05', band: 'S2 · 路線資訊', prompt: '要在哪一個出口離開？', context: '前往社區中心：乘港鐵到達後，請由<strong>B 出口</strong>離開。', choices: ['B 出口', 'A 出口', 'C 出口'], answer: 'B 出口', instruction: '請找出路線提示中的出口資料。', clue: '找由字後面的出口英文字母。', success: '答對了！你找到了正確出口。' },
      { id: 'S2-SPLD-06', band: 'S2 · 功能性回覆', prompt: '哪一句最適合回覆小組分工？', context: '組長問：明天誰可以整理資料？', choices: ['我可以整理資料。', '資料正在下雨。', '明天資料去旅行。'], answer: '我可以整理資料。', instruction: '請選出清楚回應誰可以做工作的句子。', clue: '回覆要包含我可以和要做的工作。', success: '很好！你選出了清楚的小組回覆。' },
      { id: 'S2-SPLD-07', band: 'S2 · 資料分類', prompt: '哪一樣屬於證明文件？', context: '外出前要帶身份證明文件。', choices: ['身份證', '水樽', '運動鞋'], answer: '身份證', instruction: '請選出可以證明身份的物品。', clue: '想一想辦理服務時，職員用甚麼核對你是誰。', success: '答對了！身份證屬於證明文件。' },
      { id: 'S3-SPLD-08', band: 'S3 · 廣播重點', prompt: '活動結束後要到哪裏？', context: '廣播：活動結束後，請所有同學到<strong>操場入口集合點</strong>等候。', choices: ['操場入口集合點', '圖書館', '餐廳'], answer: '操場入口集合點', instruction: '請從廣播找出活動後的地點。', clue: '找結束後三個字後面的地方名稱。', success: '很好！你找到了廣播的集合地點。' },
      { id: 'S3-SPLD-09', band: 'S3 · 段落推論', prompt: '由這段話可以知道甚麼？', context: '今日雨勢大，原定下午的戶外活動<strong>延期</strong>，新日期會再通知。', choices: ['今天不用到戶外活動', '今天仍要到操場', '活動已經完成'], answer: '今天不用到戶外活動', instruction: '請由雨勢大和延期兩個線索作判斷。', clue: '延期表示活動不會在原定今天進行。', success: '答對了！你用兩個線索作出合理判斷。' },
      { id: 'S3-SPLD-10', band: 'S3 · 任務排序', prompt: '下面哪一項是第二步？', context: '出發流程：先<strong>查時間</strong>，再<strong>準備八達通</strong>，最後到集合點。', choices: ['準備八達通', '查時間', '到集合點'], answer: '準備八達通', instruction: '請找出流程中的第二步。', clue: '留意再字後面的行動；那就是第二步。', success: '太好了！你找到流程中的第二步。' },
      { id: 'S3-SPLD-11', band: 'S3 · 關鍵詞核對', prompt: '這則訊息最重要要回覆甚麼？', context: '組長訊息：請大家在<strong>今晚八時前</strong>確認是否能出席。', choices: ['今晚八時前能否出席', '最喜歡的食物', '星期日的天氣'], answer: '今晚八時前能否出席', instruction: '請找出訊息中的時間和要回覆的事情。', clue: '圈出時間「今晚八時前」和動作「確認能否出席」。', success: '答對了！你找到了訊息的兩個關鍵資料。' },
      { id: 'S3-SPLD-12', band: 'S3 · 公告推論', prompt: '由公告可以知道今天應該怎樣做？', context: '公告：因維修關係，升降機<strong>暫停使用</strong>，請使用樓梯或向職員查詢。', choices: ['改用樓梯或問職員', '一直等升降機', '自行拆開按鈕'], answer: '改用樓梯或問職員', instruction: '請由公告找出安全的替代安排。', clue: '「暫停使用」表示今天不能用；再找公告提供的替代方法。', success: '很好！你由公告推斷出安全的下一步。' }
    ]
  },
  senior: {
    categoryName: '高中 · SpLD 讀寫訓練',
    title: '高中讀寫闖關',
    description: '12 關實習、社區與職前資料理解訓練',
    tag: 'S4–S6 · 12 關',
    rounds: [
      { id: 'S4-SPLD-01', band: 'S4 · 職場通知', prompt: '甚麼時候要到服務台報到？', context: '實習通知：第一天請於<strong>九時正</strong>到服務台報到。', choices: ['九時正', '十時正', '八時正'], answer: '九時正', instruction: '請從實習通知找出報到時間。', clue: '找於字後面、服務台前面的時間。', success: '答對了！你找到實習的報到時間。' },
      { id: 'S4-SPLD-02', band: 'S4 · 表格欄位', prompt: '「緊急聯絡人」一欄要填寫甚麼？', context: '登記表需要留下有需要時可以聯絡的大人資料。', choices: ['可聯絡的大人', '喜歡的食物', '最愛的遊戲'], answer: '可聯絡的大人', instruction: '請選出緊急聯絡人的意思。', clue: '緊急時要找一位能幫忙的大人，所以要留下可聯絡的人。', success: '很好！你理解了表格欄位的用途。' },
      { id: 'S4-SPLD-03', band: 'S4 · 服務指引', prompt: '這個指引要你帶甚麼？', context: '辦理登記時，請<strong>出示工作證</strong>。', choices: ['工作證', '遊戲機', '運動鞋'], answer: '工作證', instruction: '請找出指引要求出示的物品。', clue: '找出示兩個字後面的物品名稱。', success: '答對了！登記時要出示工作證。' },
      { id: 'S4-SPLD-04', band: 'S4 · 時間表', prompt: '當日最先要做甚麼？', context: '實習安排：9:00 登記；9:15 聽安全簡介；9:30 開始工作。', choices: ['登記', '聽安全簡介', '開始工作'], answer: '登記', instruction: '請比較時間表，找出最早的項目。', clue: '先找最小的時間；9:00 比 9:15 和 9:30 早。', success: '做得好！你找到時間表的第一項。' },
      { id: 'S5-SPLD-05', band: 'S5 · 工作訊息', prompt: '哪一句最適合向主管報告？', context: '你已完成整理桌面的工作。', choices: ['我已完成桌面整理。', '桌面正在看電視。', '我喜歡桌面顏色。'], answer: '我已完成桌面整理。', instruction: '請選出清楚報告完成工作的句子。', clue: '回覆要說自己已完成哪一項工作。', success: '答對了！這是一句清楚的工作報告。' },
      { id: 'S5-SPLD-06', band: 'S5 · 交通資訊', prompt: '應該在哪一站下車？', context: '轉乘提示：巴士到<strong>下一站</strong>時，請準備下車。', choices: ['下一站', '總站才下車', '任何一站'], answer: '下一站', instruction: '請從轉乘提示找出下車時機。', clue: '找請準備下車前面的站點資料。', success: '很好！你理解了轉乘提示。' },
      { id: 'S5-SPLD-07', band: 'S5 · 求助資訊', prompt: '如有需要，應該找誰？', context: '服務中心告示：如需要協助，請向<strong>當值職員</strong>查詢。', choices: ['當值職員', '路過的陌生人', '自己不說話'], answer: '當值職員', instruction: '請找出告示指定的求助對象。', clue: '找向字後面、查詢前面的職位名稱。', success: '答對了！你找到了合適的求助對象。' },
      { id: 'S6-SPLD-08', band: 'S6 · 履行清單', prompt: '哪兩項是出發實習的必備物品？', context: '出發清單：<strong>工作證、八達通</strong>、水樽、筆。', choices: ['工作證和八達通', '玩具和耳機', '拖鞋和足球'], answer: '工作證和八達通', instruction: '請由清單找出最重要的兩項。', clue: '想一想實習要證明身份，也要乘車；兩項都在清單內。', success: '很好！你找到了出發的重要物品。' },
      { id: 'S6-SPLD-09', band: 'S6 · 電郵理解', prompt: '這封電郵要求你何時回覆？', context: '電郵：請你在<strong>明天前</strong>回覆是否可以出席面談。', choices: ['明天前', '下個月', '不用回覆'], answer: '明天前', instruction: '請從電郵找出回覆期限。', clue: '找回覆兩個字附近的日期或時間限制。', success: '答對了！你找到了電郵的回覆期限。' },
      { id: 'S6-SPLD-10', band: 'S6 · 重點摘要', prompt: '這個工作指示的主要次序是甚麼？', context: '工作指示：<strong>先核對資料，再交給主管。</strong>', choices: ['先核對，再交給主管', '先交給主管，再核對', '不用核對直接離開'], answer: '先核對，再交給主管', instruction: '請找出指示中的先後次序。', clue: '留意先字和再字；它們告訴你兩個行動的正確順序。', success: '太好了！你概括到工作指示的主要次序。' },
      { id: 'S6-SPLD-11', band: 'S6 · 表格核對', prompt: '哪一欄資料仍未完成？', context: '實習登記表：姓名<strong>已填</strong>；聯絡電話<strong>已填</strong>；緊急聯絡人<strong>未填</strong>。', choices: ['緊急聯絡人', '姓名', '聯絡電話'], answer: '緊急聯絡人', instruction: '請比較表格三欄，找出未完成的一欄。', clue: '看每一欄後面的「已填」或「未填」標記。', success: '答對了！你核對到仍要補上的資料。' },
      { id: 'S6-SPLD-12', band: 'S6 · 電郵回覆', prompt: '哪一句最適合回覆面談安排？', context: '電郵：請回覆你是否可於星期四下午二時面談。', choices: ['我可以星期四下午二時面談。', '星期四下午二時正在下雨。', '我喜歡二時的數字。'], answer: '我可以星期四下午二時面談。', instruction: '請選出確認時間和行動的清楚回覆。', clue: '職場回覆要有「可以」和完整時間資料。', success: '很好！你選出清楚而功能性的電郵回覆。' }
    ]
  }
};
