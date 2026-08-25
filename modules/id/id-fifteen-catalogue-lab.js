/* ID 十五項功能生活練習：低認知負荷、八題、可重試與可選朗讀。 */
(function () {
  'use strict';

  const rotate = (items, index) => items.slice(index % items.length).concat(items.slice(0, index % items.length));
  const makeActivity = (id, icon, title, focus, description, answers, distractors, hintPrefix = '慢慢看題目') => ({
    id, icon, title, focus, description,
    rounds: answers.map((answer, index) => ({
      scene: `${icon} 練習 ${index + 1}：${answer}`,
      prompt: `${description}。這一步應選甚麼？`,
      answer,
      choices: rotate([answer, ...distractors.slice(0, 3)], index),
      hint: `${hintPrefix}；這一題可選「${answer}」。`
    }))
  });
  const makeSituations = (id, icon, title, focus, description, rounds) => ({ id, icon, title, focus, description, rounds });

  const lower = [
    makeActivity('shapeHouse', '🏠', '顏色形狀配對屋', '顏色與形狀', '把看見的物件放到相同的顏色或形狀位置', ['紅色圓形', '藍色方形', '黃色三角形', '綠色星形', '紅色方形', '藍色圓形', '黃色星形', '綠色三角形'], ['看別的顏色', '隨便一格', '先離開'], '先找相同顏色和形狀'),
    makeActivity('oneStep', '☝️', '一步指令小助手', '單一步驟指令', '聽到或看見一個指令後，只做這一件事', ['點擊杯子', '指向牙刷', '找出鞋子', '按一下書本', '選雨傘', '找小手', '按門鈴', '選巴士'], ['同時按三樣', '不用看指令', '隨便點'], '一次只做一件事'),
    makeActivity('visualTrack', '🐤', '眼睛看哪裡', '視覺追蹤', '跟著畫面上的小動物或物件慢慢看', ['看小鳥', '看小狗', '看氣球', '看小魚', '看汽車', '看蝴蝶', '看星星', '看小貓'], ['看畫面外', '閉上眼睛', '按很多次'], '先把眼睛放在目標上'),
    makeActivity('soundFind', '🔊', '聽音尋物樂園', '聽覺與圖像連結', '聽到生活聲音後，找出相應的圖卡', ['狗狗', '巴士', '電話', '雨聲', '門鈴', '貓咪', '救護車', '流水聲'], ['鉛筆', '椅子', '雲朵'], '可以再聽一次，再看圖卡'),
    makeSituations('count123', '🍎', '物品點數 1-2-3', '一對一點數', '逐個數物件，再選最後的總數', [
      { scene:'🍎 枱上有一個蘋果', prompt:'慢慢指著數一數，枱上有多少個蘋果？', answer:'1 個', choices:['1 個','2 個','3 個'], hint:'只有一個蘋果；指一次，說「一」。' },
      { scene:'🧸 地墊上有兩個積木', prompt:'地墊上有多少個積木？', answer:'2 個', choices:['1 個','2 個','4 個'], hint:'逐個指著兩個積木數：一、二。' },
      { scene:'✏️ 筆盒旁有三枝鉛筆', prompt:'看清楚三枝鉛筆，總共有多少枝？', answer:'3 個', choices:['2 個','3 個','5 個'], hint:'每枝只數一次：一、二、三。' },
      { scene:'🟡 盒內有四個黃色圓點', prompt:'盒內有多少個黃色圓點？', answer:'4 個', choices:['3 個','4 個','6 個'], hint:'用手指由左至右數四個圓點。' },
      { scene:'🚗 停車位有五架玩具車', prompt:'停車位共有多少架玩具車？', answer:'5 個', choices:['4 個','5 個','7 個'], hint:'一架一架數到五，不用急。' },
      { scene:'🧦 椅子上有六隻襪子', prompt:'椅子上有多少隻襪子？', answer:'6 個', choices:['5 個','6 個','8 個'], hint:'指著每隻襪子，數到六。' },
      { scene:'🌟 夜空有七粒星星', prompt:'夜空中有多少粒星星？', answer:'7 個', choices:['6 個','7 個','9 個'], hint:'由左至右慢慢數七粒星星。' },
      { scene:'🍪 盤上有八塊餅乾', prompt:'盤上總共有多少塊餅乾？', answer:'8 個', choices:['7 個','8 個','10 個'], hint:'每塊餅乾數一次，最後數到八。' }
    ]),
    makeSituations('dailyCategory', '🧺', '生活用品歸歸類', '生活用品分類', '看用品最常在哪裏使用，再放進合適地方', [
      { scene:'🪥 牙刷', prompt:'牙刷平日最常放在哪裏使用？', answer:'浴室', choices:['浴室','廚房','書包'], hint:'刷牙和洗面通常在浴室。' },
      { scene:'👕 校服上衣', prompt:'洗好並摺好的校服最適合放在哪裏？', answer:'衣櫃', choices:['衣櫃','雪櫃','洗手盆'], hint:'乾淨衣服可放進衣櫃。' },
      { scene:'🍚 飯碗', prompt:'飯碗最常在哪裏使用？', answer:'廚房', choices:['廚房','床上','操場'], hint:'吃飯用的碗通常在廚房。' },
      { scene:'📚 功課冊', prompt:'明天要帶回學校的功課冊放在哪裏？', answer:'書包', choices:['書包','浴缸','鞋櫃'], hint:'要帶去學校的東西可先放進書包。' },
      { scene:'🧴 沐浴露', prompt:'洗澡會用到沐浴露，應放在哪裏？', answer:'浴室', choices:['浴室','衣櫃','巴士站'], hint:'洗澡用品放在浴室較方便。' },
      { scene:'🧥 外套', prompt:'不穿的外套整理好後可放在哪裏？', answer:'衣櫃', choices:['衣櫃','廚房枱','馬路旁'], hint:'衣服整理好後可放進衣櫃。' },
      { scene:'🥄 湯匙', prompt:'吃湯會用到湯匙，最常在哪裏找到？', answer:'廚房', choices:['廚房','洗手間','書包側袋'], hint:'餐具通常在廚房。' },
      { scene:'💧 水樽', prompt:'上學時要喝水，水樽最適合先放在哪裏？', answer:'書包', choices:['書包','衣櫃頂','洗手盆內'], hint:'帶去學校的水樽可放進書包。' }
    ]),
    makeSituations('emotionFace', '🙂', '情緒臉譜拼拼樂', '基礎情緒辨識', '看表情和情境，選一個最接近的感受', [
      { scene:'🎁 收到喜歡的生日卡', prompt:'小明笑著打開生日卡，他可能感到甚麼？', answer:'開心', choices:['開心','傷心','害怕'], hint:'笑容和收到喜歡的東西，常會令人開心。' },
      { scene:'🧸 找不到心愛玩具', prompt:'小華低著頭，找不到玩具，他可能感到甚麼？', answer:'傷心', choices:['傷心','興奮','平靜'], hint:'失去喜歡的物品時，可能會傷心。' },
      { scene:'🖍️ 畫紙被人弄破', prompt:'小美皺起眉頭，手握得緊緊，她可能感到甚麼？', answer:'生氣', choices:['生氣','開心','放鬆'], hint:'皺眉和握緊手，可能是在感到生氣。' },
      { scene:'🌧️ 雷聲很大', prompt:'聽到很大的雷聲，小強靠近老師，他可能感到甚麼？', answer:'害怕', choices:['害怕','自豪','開心'], hint:'想靠近可信任的人時，可能是有點害怕。' },
      { scene:'📚 安靜看圖書', prompt:'小欣坐在閱讀角慢慢看書，身體放鬆，她可能感到甚麼？', answer:'平靜', choices:['平靜','生氣','緊張'], hint:'身體放鬆、安靜閱讀時，可能感到平靜。' },
      { scene:'🏃 完成跑步練習', prompt:'小樂完成目標後舉起手，他可能感到甚麼？', answer:'自豪', choices:['自豪','傷心','害怕'], hint:'完成努力的事後，可能會為自己感到自豪。' },
      { scene:'⏰ 快要上台說話', prompt:'小晴不停看時鐘，心跳有點快，她可能感到甚麼？', answer:'緊張', choices:['緊張','平靜','生氣'], hint:'等待未知事情時，可能會有點緊張。' },
      { scene:'🤗 朋友說「我陪你」', prompt:'小文聽到朋友願意陪伴，臉上放鬆下來，他可能感到甚麼？', answer:'被安慰', choices:['被安慰','被責罵','生氣'], hint:'有人願意陪伴時，可能會感到被安慰。' }
    ]),
    makeActivity('bodyParts', '🧍', '身體部位大探索', '身體概念', '按提示找出自己或角色的身體部位', ['小手', '眼睛', '耳朵', '膝蓋', '鼻子', '腳', '嘴巴', '肩膀'], ['書包', '巴士', '桌子'], '先聽或讀身體部位名稱'),
    makeActivity('compareSize', '📏', '大小長短比一比', '相對概念', '比較兩件清楚不同的物件，選出題目要找的一件', ['較長', '較短', '較大', '較小', '較多', '較少', '較高', '較低'], ['兩個一樣', '不用比較', '隨便選'], '先只比較一個特徵'),
    makeActivity('traceTouch', '🐱', '觸控一筆畫', '手眼協調', '跟粗線或箭頭帶小動物回家', ['向上', '向右', '向下', '向左', '慢慢向前', '停在轉角', '跟下一個箭頭', '到終點'], ['跳過路線', '同時按兩邊', '不看箭頭'], '沿著一小段一小段走'),
    makeSituations('trafficLight', '🚦', '交通紅綠燈', '停與行', '看清交通訊號後，選擇停下或安全前進', [
      { scene:'🚦 行人紅燈', prompt:'紅燈亮起時，最安全的做法是甚麼？', answer:'停在路邊等候', choices:['停在路邊等候','立即跑過去','低頭看電話'], hint:'紅燈時先停在行人路邊。' },
      { scene:'🚦 綠燈未亮', prompt:'朋友催你快過馬路，但綠燈未亮，怎樣做？', answer:'等綠燈才出發', choices:['等綠燈才出發','跟朋友衝出去','閉眼向前走'], hint:'別人催促時也可等清楚安全訊號。' },
      { scene:'🚦 綠人亮起', prompt:'綠人亮起後，過路前還要做甚麼？', answer:'左右望後慢慢過', choices:['左右望後慢慢過','一邊跑一邊玩','只看朋友'], hint:'綠燈時仍可先左右望。' },
      { scene:'🚦 閃動綠人', prompt:'你已在斑馬線上，綠人開始閃動，怎樣做？', answer:'不奔跑，走到對面', choices:['不奔跑，走到對面','停在馬路中間','回頭衝回去'], hint:'已在過路時可保持步伐，走到安全一邊。' },
      { scene:'⚽ 球滾向車路', prompt:'球滾到車路旁，第一步應怎樣做？', answer:'留在行人路並找成人', choices:['留在行人路並找成人','立刻追球','請朋友一起跑出來'], hint:'球可以再拿；先留在安全地方。' },
      { scene:'🚸 校門前轉角', prompt:'走到校門轉角，未看見另一邊，怎樣做？', answer:'在轉角前停看', choices:['在轉角前停看','加速衝過','推著朋友走'], hint:'轉角前停一停、看一看。' },
      { scene:'🚌 校巴到站', prompt:'校巴到了，同學很興奮，怎樣上車？', answer:'排隊等老師指示', choices:['排隊等老師指示','搶到最前面','在車門前推擠'], hint:'排隊和等指示會令大家更安全。' },
      { scene:'✋ 手作停手牌', prompt:'看見「停手看看」圖卡，現在可以做甚麼？', answer:'手放下再看下一步', choices:['手放下再看下一步','繼續亂放材料','把材料丟掉'], hint:'停手牌是在幫你先停一停。' }
    ]),
    makeActivity('greeting', '👋', '禮貌問候小劇場', '基本社交語句', '在簡單情境選一個清楚而禮貌的短句', ['你好', '早晨', '唔該', '再見', '請問好嗎？', '對不起', '可以幫我嗎？', '拜拜'], ['大叫', '不說話就走', '拿走物品'], '可選短句，不用說得很長'),
    makeActivity('dressOrder', '👕', '穿衣順序卡', '自理步驟', '看出門或換衫情境，選下一個小步驟', ['穿內衣', '穿上衣', '穿褲子', '拉好拉鏈', '穿襪子', '穿鞋', '整理衣服', '看鏡子'], ['一次全部做', '不需要穿', '隨便跳步'], '只找現在的下一步'),
    makeActivity('sensoryVolume', '🎚️', '五感音量調節器', '感覺調節', '按情境選擇較合適的音量或休息方法', ['調小聲', '保持安靜', '戴耳機', '先休息', '請人幫忙調小聲', '關掉背景音', '去安靜角落', '慢慢呼吸'], ['開到最大聲', '忍住不說', '跑走'], '感到太嘈時可以選一個調節方法'),
    makeActivity('mirrorAction', '🪞', '鏡像動作跟著做', '動作模仿', '看角色做一個動作，再選相同動作', ['舉右手', '舉左手', '拍手', '點頭', '伸手向前', '踏一步', '雙手放下', '揮揮手'], ['做很多動作', '不看示範', '轉身離開'], '先看一次，再慢慢跟著做')
  ];

  const upper = [
    makeActivity('supermarket', '🛒', '超市購物小幫手', '購物與清單', '看清楚購物清單，選一樣需要的物品', ['牛奶', '麵包', '蘋果', '牙膏', '紙巾', '雞蛋', '米', '洗手液'], ['不在清單的玩具', '很多相同物品', '空購物車'], '先只找清單上的一樣'),
    makeActivity('clock', '🕗', '時鐘大冒險', '作息時間', '把日常活動配對到合適時間', ['早上 8 時', '中午 12 時', '下午 4 時', '晚上 8 時', '早上 7 時', '下午 1 時', '晚上 9 時', '早上 9 時'], ['昨天', '明年', '不用看時間'], '看短針和長針，再想日常作息'),
    makeActivity('signs', '🪧', '社區安全標誌認一認', '圖示閱讀', '看常用圖示，選出它提醒我們的事', ['安全出口', '洗手間', '禁止飲食', '小心滑倒', '升降機', '港鐵入口', '急救箱', '斑馬線'], ['不用理會', '隨便跑', '不看圖示'], '圖示是給我們看的安全提示'),
    makeActivity('washHands', '🧼', '洗手七步驟迷宮', '洗手程序', '每次選洗手的下一個清楚步驟', ['弄濕雙手', '搓梘液', '搓手心', '搓手背', '沖乾淨', '抹乾手', '關水龍頭', '收好毛巾'], ['跳過洗手', '只做最後一步', '馬上吃東西'], '完成一步，再看下一步'),
    makeActivity('personalSpace', '↔️', '社交小劇場', '個人空間', '看見不同關係，選一個尊重界線的做法', ['保持一隻手距離', '先問可不可以', '揮手問候', '站在旁邊等候', '不碰別人身體', '慢慢退後一步', '請老師幫忙', '說「我想要空間」'], ['貼得很近', '搶走物品', '大聲命令'], '先看對方表情和距離'),
    makeActivity('emotionWeather', '🌦️', '情緒氣象站', '情緒調節', '選一種心情，再選一個小小調節方法', ['深呼吸', '喝一口水', '坐一坐', '找老師', '數到五', '聽安靜聲音', '說出感受', '先休息'], ['打人', '大叫', '把東西丟掉'], '心情很大時，可以先做一件安全小事'),
    makeSituations('recycle', '♻️', '垃圾分類小專家', '社區分類', '把物品放進適合的回收或垃圾位置', [
      { scene:'📰 看完的報紙', prompt:'乾淨的舊報紙應放進哪一類？', answer:'紙張回收箱', choices:['紙張回收箱','膠樽回收箱','一般垃圾'], hint:'報紙是紙張，可以回收。' },
      { scene:'🧴 洗淨的膠水樽', prompt:'洗淨後的膠水樽應放進哪一類？', answer:'膠樽回收箱', choices:['鋁罐回收箱','膠樽回收箱','紙張回收箱'], hint:'這是膠製樽，放進膠樽回收。' },
      { scene:'🥫 飲完的汽水罐', prompt:'沖洗過的鋁罐應放進哪一類？', answer:'鋁罐回收箱', choices:['一般垃圾','鋁罐回收箱','紙張回收箱'], hint:'飲品罐是金屬鋁罐。' },
      { scene:'🍌 吃完的香蕉皮', prompt:'香蕉皮應放進哪一類？', answer:'廚餘或一般垃圾箱', choices:['廚餘或一般垃圾箱','紙張回收箱','膠樽回收箱'], hint:'食物剩餘物不是紙、膠或鋁罐。' },
      { scene:'📦 乾淨紙盒', prompt:'壓平的乾淨紙盒應放進哪一類？', answer:'紙盒回收箱', choices:['紙盒回收箱','鋁罐回收箱','馬路上'], hint:'乾淨紙盒可和其他紙類回收。' },
      { scene:'🧃 飲完的膠飲品盒', prompt:'跟著回收標記，這個膠飲品盒應放進哪一類？', answer:'膠類回收箱', choices:['膠類回收箱','紙張回收箱','廚餘箱'], hint:'先看包裝材質；膠製容器放膠類回收。' },
      { scene:'🧴 乾淨的洗頭水樽', prompt:'洗頭水樽沖乾淨後應放進哪一類？', answer:'膠樽回收箱', choices:['膠樽回收箱','鋁罐回收箱','一般垃圾'], hint:'洗頭水樽通常是膠製。' },
      { scene:'🧻 用過的紙巾', prompt:'用過的紙巾不能回收，應怎樣處理？', answer:'放進一般垃圾箱', choices:['放進一般垃圾箱','放進紙張回收箱','放在地上'], hint:'弄髒的紙巾不能當作乾淨紙張回收。' }
    ]),
    makeActivity('sightWords', '🖼️', '常用字詞看圖識字', '生活字詞', '看字詞和圖像，選相同意思的生活物品', ['麵包', '巴士', '藥房', '出口', '洗手間', '雨傘', '醫院', '學校'], ['不看字', '隨便圖卡', '空白圖卡'], '可以先聽讀，再看字形和圖像'),
    makeActivity('coins', '🪙', '硬幣付錢小高手', '簡單付款', '看價錢，選一個剛好的硬幣組合', ['1 元', '2 元', '3 元', '5 元', '4 元', '6 元', '7 元', '8 元'], ['很多錢', '不付錢', '隨便一枚'], '可以一枚一枚數，不用快算'),
    makeActivity('community', '🏥', '社區場所大連線', '社區資源', '看人物或需要，選合適的社區場所', ['醫院', '郵局', '圖書館', '消防局', '警署', '超市', '藥房', '港鐵站'], ['不知道去哪', '去危險地方', '不用求助'], '想想誰或哪裏可以幫忙'),
    makeActivity('emergencyCall', '☎️', '緊急求助電話盤', '安全求助', '遇到危險時，選一個安全的下一步', ['找可信任成人', '打 999 求助', '說出所在地', '保持安全距離', '找職員', '打家人電話', '慢慢說需要', '等候協助'], ['把資料給陌生人', '自己冒險', '隱瞞危險'], '先確保自己安全，再找成人或職員'),
    makeActivity('twoStep', '➡️', '兩步指令達人', '兩步指令', '先做第一件，再做第二件事', ['先拿書，再坐下', '先關門，再洗手', '先放書包，再排隊', '先拿水樽，再出門', '先看時間，再收拾', '先穿鞋，再出發', '先拿紙巾，再清潔', '先說唔該，再拿物品'], ['兩步一起亂做', '只做最後一步', '不聽指令'], '先找「先」後面的第一步'),
    makeActivity('schedule', '📅', '我的每日行事曆', '視覺日程', '把活動放在較合適的早、午或晚時間', ['早上刷牙', '中午吃飯', '下午做功課', '晚上洗澡', '早上上學', '下午運動', '晚上收拾書包', '睡前關燈'], ['全部放同一時間', '不看日程', '隨便排列'], '先想這件事通常在甚麼時候做'),
    makeActivity('healthyPlate', '🥗', '健康餐盤配一配', '健康選擇', '選一樣能令餐盤更均衡的食物', ['蔬菜', '水果', '蛋白質', '澱粉', '清水', '少糖飲品', '一份主食', '一份配菜'], ['只吃糖果', '很多汽水', '不吃任何東西'], '餐盤可有不同種類，不用一次完美'),
    makeActivity('focusFind', '🔎', '專注力找找看', '圖底辨析', '在較多物品中，慢慢找出指定生活用品', ['牙刷', '水樽', '鑰匙', '鞋子', '書本', '雨傘', '電話', '紙巾'], ['一直亂按', '看畫面外', '放棄不找'], '先看目標名稱，再由左到右找')
  ];

  const junior = [
    makeActivity('transport', '🚌', '巴士地鐵搭乘指南', '社區移動', '看目的地和圖示，選安全的搭車下一步', ['看路線圖', '排隊等候', '拍八達通', '讓人先下車', '找正確月台', '看車號', '按下車鐘', '找職員'], ['衝進車門', '跟陌生人走', '不看方向'], '先看目的地和路線，再慢慢做'),
    makeActivity('budget', '💰', '零用錢預算管家', '必需與想要', '看有限零用錢，選一個較穩妥的安排', ['先留車費', '先留午餐費', '留少量儲蓄', '比較價錢', '記下花費', '等一天再決定', '只買需要的', '請成人一起看'], ['用光所有錢', '借陌生人錢', '不看價錢'], '先分開需要和想要'),
    makeActivity('restaurant', '🍽️', '餐廳點餐與禮儀', '點餐與禮貌', '在餐廳選一個清楚、安全和禮貌的做法', ['先看餐牌', '說「唔該」', '慢慢點餐', '坐好等候', '核對價錢', '小聲說話', '收好餐具', '說「多謝」'], ['大聲叫喊', '搶別人食物', '不付款'], '每次做一個禮貌小步驟'),
    makeActivity('problemSolve', '🆘', '突發狀況應變記', '情境求助', '遇到困難時，選一個安全的下一步', ['找車站職員', '打家人電話', '留在安全地方', '找警察', '看指示牌', '告訴老師', '不跟陌生人走', '慢慢說情況'], ['自己跑去危險處', '把密碼給人', '隱瞞受傷'], '先安全，再找可信任的人'),
    makeActivity('housework', '🧹', '家務分工大作戰', '獨立生活', '看家務情境，選現在應做的一小步', ['分類深淺衣物', '把紙張放回收箱', '擦乾桌面', '把碗放好', '掃地', '晾好衣服', '收好清潔用品', '關水龍頭'], ['把水灑地上', '不看步驟', '把危險品亂放'], '只做眼前一個家務步驟'),
    makeActivity('safeMessage', '📱', '智慧訊息安全發送', '數位聯絡', '需要聯絡家人時，選一段清楚安全的短訊', ['我已到家', '我在車站等候', '我需要協助', '請回電給我', '我會先找職員', '我在安全地方', '我遲到少少', '我已見到老師'], ['把密碼傳給人', '給陌生人地址', '亂發很多訊息'], '短訊可以短而清楚'),
    makeActivity('timePlan', '⏱️', '時間管理小幫手', '時間估算', '看任務，選一個讓自己不趕急的做法', ['先設提醒', '先做第一步', '休息後再做', '看時鐘', '把任務分兩段', '完成後勾選', '提早準備', '請人提醒'], ['等最後一分鐘', '同時做很多事', '不看時間'], '把大任務變成小步'),
    makeActivity('cyberSafe', '🛡️', '網路安全與防騙雷達', '網絡安全', '看網上訊息，選一個保護自己的做法', ['不給密碼', '不按可疑連結', '告訴家長', '封鎖陌生帳戶', '核對官方資料', '不先付款', '保護個人資料', '先問可信任成人'], ['立即轉帳', '交出身分證', '跟陌生人見面'], '覺得奇怪時先停一停，找成人'),
    makeActivity('stocking', '📦', '超市理貨員體驗', '職前分類', '看商品資料，選一個正確上架步驟', ['飲品放飲品區', '零食放零食區', '舊日期放前面', '新貨放後面', '看標籤', '對齊貨品', '收好紙箱', '問店長核對'], ['把貨亂放', '不看日期', '推倒貨架'], '一次處理一件貨品'),
    makeActivity('health', '🌡️', '生病發燒怎麼辦', '健康自我照顧', '感到不舒服時，選一個安全的照顧步驟', ['告訴成人', '量體溫', '喝水休息', '按指示看醫生', '戴口罩', '不硬撐上學', '記下不舒服', '遵從藥物指示'], ['亂吃藥', '隱瞞發燒', '繼續危險活動'], '不舒服時先找成人幫忙'),
    makeActivity('conflict', '🤝', '人際衝突化解器', '替代行為', '和人意見不同時，選一個安全而尊重的做法', ['慢慢說想法', '先離開冷靜', '找老師協助', '說「我不喜歡」', '輪流說話', '聽對方一句', '說對不起', '一起想方法'], ['打人', '罵人', '搶走東西'], '先保護自己和別人，再慢慢說'),
    makeActivity('foodLabel', '📅', '食品標籤看仔細', '食品安全', '看包裝資料，選一個安全的做法', ['看食用日期', '看保存方法', '過期就不要吃', '問成人核對', '放入雪櫃', '看有沒有破損', '先洗手', '選未過期食物'], ['吃過期食物', '不看包裝', '隨便開封'], '先看日期和包裝狀況'),
    makeActivity('boundaries', '🫶', '個人界線與社交距離', '身體自主', '看不同情境，選一個尊重身體界線的做法', ['先問可不可以', '揮手問候', '說「我不想」', '保持距離', '找成人', '不跟陌生人離開', '拒絕不舒服接觸', '相信自己的感受'], ['強迫接觸', '跟陌生人走', '不說不舒服'], '自己的身體可以說「不」'),
    makeActivity('change', '💵', '購物找零計算機', '找續概念', '看付款和價錢，選較合適的找續或核對方法', ['先看價錢', '看付款金額', '慢慢數找續', '核對收據', '請店員再說一次', '把錢收好', '用計算機幫忙', '問成人核對'], ['不看找續', '把錢亂放', '直接離開'], '找續不清楚時可以請店員或成人核對'),
    makeActivity('checklist', '✅', '視覺化任務 Checklist', '自我監控', '出門前看清單，選一件需要準備的物品', ['鑰匙', '錢包', '電話', '八達通', '水樽', '口罩', '雨傘', '家人聯絡卡'], ['不帶任何物品', '不看清單', '只帶玩具'], '每拿一樣就勾一樣')
  ];

  const senior = [
    makeActivity('interview', '💼', '模擬工作面試官', '面試準備', '面試前或回答問題時，選一個清楚而禮貌的做法', ['穿整潔衣服', '說「你好」', '慢慢回答', '說出一項長處', '請對方再說一次', '說「唔該」', '準時到達', '帶齊資料'], ['大聲打斷', '不理對方', '隨便離開'], '可以用短句回答，不用說得很長'),
    makeActivity('workInstructions', '📋', '職場禮儀與指令服從', '工作任務閉環', '聽到工作指令後，選下一個可靠步驟', ['再說一次指令', '做第一步', '完成後回報', '問放在哪裏', '看安全標誌', '慢慢核對', '向主管說已完成', '記下重點'], ['假裝明白', '不做工作', '把物品亂放'], '不明白時可以問一次'),
    makeActivity('discount', '🏷️', '複雜購物與折價券', '實用數學', '看商品和優惠後，選一個穩妥的做法', ['先看原價', '看減價條件', '核對到期日', '比較兩件商品', '看收據', '問店員', '算好再付款', '保留找續'], ['只看最大字', '不看條件', '先借錢'], '優惠不清楚時先看條款或問店員'),
    makeActivity('kitchen', '🍳', '廚房安全與簡易烹飪', '家居安全', '在廚房做簡單工作時，選一個安全步驟', ['先洗手', '用隔熱手套', '不用金屬入微波爐', '看加熱時間', '請成人協助', '關好電器', '小心熱湯', '清理枱面'], ['把手伸入熱鍋', '亂開電器', '不用看安全提示'], '覺得熱或不確定時先停一停'),
    makeActivity('grooming', '🧴', '個人儀容打理術', '自我形象', '按場合選一個整潔、舒適的準備步驟', ['梳好頭髮', '換乾淨衣服', '洗手洗面', '穿合適鞋子', '檢查衣領', '準備工作證', '帶紙巾', '看天氣選衣服'], ['穿濕衣服', '不清潔自己', '隨便丟衣物'], '整潔是為了自己舒服和工作方便'),
    makeActivity('quality', '🔍', '工作品質檢查員', '品質監控', '完成包裝或整理後，選一個核對步驟', ['看有沒有漏件', '看標籤位置', '看封口', '數清楚數量', '把不合格品分開', '請主管核對', '保持工作枱整齊', '完成後交接'], ['把錯誤藏起來', '不檢查', '把產品丟掉'], '發現問題可以請主管幫忙'),
    makeActivity('booking', '🏛️', '社區設施預約員', '公共資源', '使用社區服務時，選一個安全清楚的預約步驟', ['選服務日期', '看開放時間', '填基本資料', '保護密碼', '確認地點', '保留預約資料', '如期到達', '取消要通知'], ['把帳戶給陌生人', '不看日期', '重複亂按'], '網上資料只在可信任網站填寫'),
    makeActivity('atm', '🏧', 'ATM 安全流程', '財務安全', '使用提款機模擬時，選一個保護自己的步驟', ['遮住密碼', '看四周安全', '拿回卡片', '拿回收據', '數清楚現金', '不讓人看密碼', '有問題找職員', '離開前收好錢包'], ['告訴別人密碼', '忘記拿卡', '跟陌生人去提款'], '密碼和銀行資料要保護好'),
    makeActivity('stress', '🧘', '情緒壓力調節工具箱', '職場調節', '工作覺得累或緊張時，選一個安全的調節方法', ['申請短暫休息', '慢慢呼吸', '喝水', '找主管', '先坐一坐', '說出需要', '聽安靜聲音', '把工作分小步'], ['突然離開崗位', '發脾氣', '把物品摔掉'], '有需要時可以說出來'),
    makeActivity('rights', '🧾', '我的勞工基本概念', '自我倡導', '看簡單工作資料，選一個需要核對的重點', ['上班時間', '休息時間', '發薪日期', '工作地點', '聯絡人', '請假方法', '薪金資料', '安全指引'], ['簽不明文件', '不看資料', '交出個人密碼'], '工作資料不清楚時可問主管或家人'),
    makeActivity('team', '📦', '團隊合作流水線', '合作與節奏', '和同事一起包裝時，選一個有助合作的做法', ['等輪到自己', '做好一個步驟', '把物品交下一位', '說已完成', '看工作指示', '請人再示範', '保持枱面整齊', '說「唔該」'], ['搶別人工作', '亂放物品', '不等輪次'], '每人做好自己的小步就很好'),
    makeActivity('firstAid', '🩹', '簡易急救包應用', '小傷口處理', '遇到小傷口時，選一個安全的基本步驟', ['先找成人', '洗手', '清潔傷口', '貼創可貼', '保持傷口乾淨', '需要時看醫生', '告訴家人', '不要自己亂用藥'], ['不理流血', '用髒手碰傷口', '隱瞞受傷'], '任何較嚴重情況都要找成人或醫護人員'),
    makeActivity('navigation', '🗺️', '地圖導航追蹤者', '科技輔助出行', '使用地圖指引時，選一個安全出行步驟', ['看目的地', '跟著箭頭', '看過馬路訊號', '停下核對位置', '找車站職員', '保持電話電量', '告訴家人行程', '不跟陌生人走'], ['只低頭看電話', '亂過馬路', '不看方向'], '走路時先看路和交通訊號'),
    makeActivity('savings', '🐷', '月結餘與儲蓄目標', '生活規劃', '看收入和支出後，選一個能幫助自己規劃的做法', ['先記下收入', '先記下必要支出', '留少量儲蓄', '設定小目標', '看本月結餘', '比較需要和想要', '下月再檢討', '請成人一起看'], ['花光所有錢', '借陌生人錢', '不記錄'], '目標可以小而實際'),
    makeActivity('goals', '🎯', '我的目標', '自我決定', '選一個自己可以慢慢完成的每週小目標', ['每天喝水', '準時起床', '收拾書包', '說一句唔該', '步行十分鐘', '早點睡覺', '完成一項家務', '記下心情'], ['一次改變全部', '用目標責怪自己', '不需要休息'], '目標可以按自己的能力調整')
  ];

  const STAGES = { lower, upper, junior, senior };
  const stageLabels = { lower: '初小 · P1–P3', upper: '高小 · P4–P6', junior: '初中 · S1–S3', senior: '高中 · S4–S6' };
  const threeColumnPatterns = [
    [2,0,1,2,1,0,2,0], [1,2,0,1,0,2,1,0], [0,2,1,0,1,2,0,2]
  ];
  const fourColumnPatterns = [
    [3,1,0,2,3,0,1,2], [2,0,3,1,2,1,0,3], [1,3,0,2,1,0,3,2]
  ];
  lower.forEach((activity, index) => {
    const width = activity.rounds[0]?.choices?.length || 0;
    const patterns = width === 3 ? threeColumnPatterns : width === 4 ? fourColumnPatterns : [];
    if (!patterns.length) return;
    activity.answerPositionStrategy = 'irregular-balanced';
    activity.answerPositionPattern = patterns[index % patterns.length];
  });
  let host = null; let options = {}; let active = null; let roundIndex = 0; let returnFocus = null; let speechOn = true; let solved = [];
  const q = (selector) => host?.querySelector(selector); const qa = (selector) => host ? [...host.querySelectorAll(selector)] : [];
  const speak = (text) => { if (!speechOn || !window.speechSynthesis) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'zh-HK'; utterance.rate = 0.74; window.speechSynthesis.speak(utterance); };
  const focusSoon = (selector) => window.setTimeout(() => q(selector)?.focus(), 30);
  const close = () => { window.speechSynthesis?.cancel(); document.removeEventListener('keydown', onKey); host?.remove(); host = null; if (returnFocus?.isConnected) returnFocus.focus(); returnFocus = null; };
  const shell = (content) => { host.innerHTML = `<div class="id15-backdrop"><section class="id15-lab" role="dialog" aria-modal="true" aria-labelledby="id15Title"><button class="id15-close" type="button" aria-label="關閉 ID 十五項功能生活練習">×</button>${content}</section></div>`; q('.id15-close')?.addEventListener('click', close); };
  const progress = () => `<div class="id15-progress" role="progressbar" aria-label="練習進度" aria-valuemin="1" aria-valuemax="${active.rounds.length}" aria-valuenow="${roundIndex + 1}" aria-valuetext="第 ${roundIndex + 1} / ${active.rounds.length} 題"><b>第 ${roundIndex + 1} / ${active.rounds.length} 題</b><i aria-hidden="true"><em style="width:${((roundIndex + 1) / active.rounds.length) * 100}%"></em></i></div>`;
  function menu() { active = null; roundIndex = 0; const stage = options.stage || 'lower'; const cards = STAGES[stage].map((item) => `<button class="id15-card" type="button" data-id15-activity="${item.id}"><span>${item.icon}</span><strong>${item.title}</strong><small>${item.focus}</small><em>8 題練習</em></button>`).join(''); shell(`<header class="id15-head"><span>${stageLabels[stage]} · ID</span><h2 id="id15Title">十五項功能生活練習</h2><p>每次選一項、只做一題。可以朗讀、看提示、先停一停或換練習。</p></header><div class="id15-grid">${cards}</div><aside class="id15-note">不比較速度；答錯會提示下一步，可以慢慢再試。</aside>`); qa('[data-id15-activity]').forEach((button) => button.addEventListener('click', () => { active = STAGES[stage].find((item) => item.id === button.dataset.id15Activity); ready(); })); focusSoon('[data-id15-activity]'); }
  function ready() { const stage = options.stage || 'lower'; shell(`<header class="id15-head"><span>${stageLabels[stage]} · ${active.focus}</span><h2 id="id15Title">${active.icon} ${active.title}</h2><p>${active.description}</p></header><section class="id15-ready"><b>先一起讀三步</b><ol><li>看圖示和短句。</li><li>每次只選一個答案。</li><li>不確定可按提示或請教師一起看。</li></ol></section><div class="id15-actions"><button id="id15Back" type="button">← 換一項</button><button id="id15Start" class="primary" type="button">✓ 我準備好了</button></div><p class="id15-status" role="status">現在是準備時間，還未開始作答。</p>`); q('#id15Back')?.addEventListener('click', menu); q('#id15Start')?.addEventListener('click', () => { roundIndex = 0; solved = []; render(); }); focusSoon('#id15Start'); }
  function render() { const round = active.rounds[roundIndex]; shell(`<header class="id15-head compact"><span>${active.focus}</span><h2 id="id15Title">${active.icon} ${active.title}</h2><p>${active.description}</p></header>${progress()}<article class="id15-scene"><span aria-hidden="true">${active.icon}</span><p>${round.scene}</p></article><p class="id15-prompt">${round.prompt}</p><div class="id15-options">${round.choices.map((choice, index) => `<button type="button" data-id15-answer="${choice}" aria-label="選項 ${index + 1}：${choice}"><b>${index + 1}</b><span>${choice}</span></button>`).join('')}</div><div class="id15-tools"><button id="id15Read" type="button" aria-pressed="${speechOn}">${speechOn ? '🔊 朗讀：開' : '🔇 朗讀：關'}</button><button id="id15Hint" type="button">💡 看提示</button><button id="id15Break" type="button">⏸ 先停一停</button><button id="id15Back" type="button">← 換一項</button></div><p class="id15-status" id="id15Status" role="status" aria-live="polite">慢慢看一看；每次只選一個答案。</p>`); qa('[data-id15-answer]').forEach((button) => button.addEventListener('click', () => answer(button.dataset.id15Answer, round))); q('#id15Read')?.addEventListener('click', () => { speechOn = !speechOn; q('#id15Read').setAttribute('aria-pressed', String(speechOn)); q('#id15Read').textContent = speechOn ? '🔊 朗讀：開' : '🔇 朗讀：關'; if (speechOn) speak(`${active.title}。${round.scene}。${round.prompt}`); }); q('#id15Hint')?.addEventListener('click', () => status(`💡 ${round.hint}`, 'hint')); q('#id15Break')?.addEventListener('click', () => { window.speechSynthesis?.cancel(); status('可以先停一停，不會扣分。準備好可再選答案。', 'pause'); }); q('#id15Back')?.addEventListener('click', menu); focusSoon('[data-id15-answer]'); }
  function status(text, kind = '') { const node = q('#id15Status'); if (node) { node.textContent = text; node.className = `id15-status ${kind}`; } }
  function answer(choice, round) { if (choice !== round.answer) { status(`↗ ${round.hint}`, 'try'); speak(round.hint); return; } solved.push(round.answer); status(`✓ 做得好。「${choice}」很合適。`, 'ok'); speak(`做得好。${choice}很合適。`); qa('[data-id15-answer]').forEach((button) => { button.disabled = true; if (button.dataset.id15Answer === choice) button.classList.add('correct'); }); window.setTimeout(() => { roundIndex += 1; if (roundIndex < active.rounds.length) render(); else finish(); }, 720); }
  function finish() { options.onComplete?.({ label: `${active.title} · ${stageLabels[options.stage || 'lower']}`, mode: `id15-${active.id}`, total: active.rounds.length, completedAt: new Date().toLocaleString('zh-HK') }); shell(`<header class="id15-head"><span>${stageLabels[options.stage || 'lower']}</span><h2 id="id15Title">${active.icon} 完成八題小練習</h2><p>你已逐題完成這項功能生活練習。結果只用作本節回顧，不比較能力。</p></header><section class="id15-finish"><b>今日策略回顧</b><p>你可以記得一個最有用的小步，下一次再慢慢試。</p></section><div class="id15-actions"><button id="id15Replay" type="button">↺ 再玩這一項</button><button id="id15Menu" class="primary" type="button">選另一項</button></div>`); q('#id15Replay')?.addEventListener('click', ready); q('#id15Menu')?.addEventListener('click', menu); focusSoon('#id15Menu'); }
  function onKey(event) { if (!host) return; if (event.key === 'Escape') { event.preventDefault(); close(); return; } if (/^[1-4]$/.test(event.key) && active) { const optionsForRound = active.rounds[roundIndex]?.choices || []; const target = optionsForRound[Number(event.key) - 1]; if (target) { event.preventDefault(); answer(target, active.rounds[roundIndex]); } } }
  function styles() { if (document.getElementById('id15-style')) return; const style = document.createElement('style'); style.id = 'id15-style'; style.textContent = `.id15-backdrop{position:fixed;inset:0;z-index:1170;display:grid;place-items:center;padding:16px;background:rgba(18,42,62,.76);backdrop-filter:blur(5px)}.id15-lab{position:relative;width:min(980px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,30px);border:2px solid #fff;border-radius:28px;background:#f8fffd;color:#224c59;box-shadow:0 25px 72px rgba(2,22,42,.45)}.id15-close{position:absolute;top:14px;right:15px;width:48px;height:48px;border:0;border-radius:50%;background:#e6f1f1;color:#315a63;font-size:28px;font-weight:900}.id15-head{padding-right:52px}.id15-head>span{color:#16846f;font-size:13px;font-weight:950;letter-spacing:.08em}.id15-head h2{margin:5px 0;color:#174c59;font-size:clamp(26px,4vw,38px);line-height:1.15}.id15-head p{max-width:720px;margin:0;color:#57757c;font-size:15px;line-height:1.6}.id15-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px}.id15-card{min-height:164px;padding:15px;border:3px solid #c7e5df;border-radius:20px;background:#fff;color:#285560;text-align:left}.id15-card:hover{border-color:#1b9d82;background:#f2fffb}.id15-card>span{display:block;font-size:35px}.id15-card strong{display:block;margin-top:7px;font-size:18px}.id15-card small{display:block;margin-top:5px;color:#1e8874;font-weight:900}.id15-card em{display:inline-block;margin-top:10px;padding:4px 8px;border-radius:999px;background:#eef8f7;color:#55736f;font-style:normal;font-size:12px;font-weight:900}.id15-note,.id15-ready,.id15-finish{margin-top:18px;padding:15px 17px;border-left:5px solid #31a584;border-radius:15px;background:#effbf7;color:#245e54;font-weight:800;line-height:1.55}.id15-ready ol{display:grid;gap:6px;margin:8px 0 0;padding-left:23px}.id15-actions{display:flex;justify-content:center;gap:11px;margin-top:18px}.id15-actions button,.id15-tools button{min-height:46px;padding:0 14px;border:2px solid #bcd8d7;border-radius:13px;background:#fff;color:#315c65;font-size:15px;font-weight:900}.id15-actions .primary{border-color:#168d76;background:#168d76;color:#fff}.id15-progress{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;margin-top:19px;color:#1b725f;font-weight:950}.id15-progress i{height:12px;overflow:hidden;border-radius:999px;background:#dcefea}.id15-progress em{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#21a582,#5bb5d4)}.id15-scene{display:grid;grid-template-columns:auto 1fr;gap:15px;align-items:center;margin-top:18px;padding:17px;border:2px solid #d1e8e6;border-radius:20px;background:#fff}.id15-scene span{font-size:54px}.id15-scene p{margin:0;color:#315963;font-size:18px;font-weight:900;line-height:1.45}.id15-prompt{margin:18px 0 0;color:#234f5b;font-size:18px;font-weight:900;line-height:1.55}.id15-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.id15-options button{min-height:78px;padding:11px;border:3px solid #c5e0df;border-radius:18px;background:#fff;color:#284f59;text-align:left;font-size:16px;font-weight:900}.id15-options button b{display:inline-grid;place-items:center;width:31px;height:31px;margin-right:8px;border-radius:50%;background:#def2ed;color:#187a68}.id15-options button.correct{border-color:#239b79;background:#ecfbf4}.id15-options button:disabled{opacity:.85}.id15-tools{display:flex;flex-wrap:wrap;gap:9px;margin-top:17px}.id15-status{min-height:30px;margin:14px 0 0;color:#55757c;font-size:15px;font-weight:850;line-height:1.5}.id15-status.ok{color:#177b61}.id15-status.try{color:#a94c5b}.id15-status.hint{color:#4a6d9e}.id15-status.pause{color:#7b6440}.id15-lab button:focus-visible{outline:4px solid #0d689e;outline-offset:3px}.id15-lab button:active{transform:scale(.97)}@media(max-width:720px){.id15-lab{padding:18px}.id15-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.id15-card{min-height:154px}.id15-options{grid-template-columns:1fr}.id15-actions{flex-direction:column}.id15-actions button{width:100%}}@media(max-width:420px){.id15-grid{grid-template-columns:1fr}.id15-card{min-height:124px}.id15-options button{min-height:70px}.id15-tools button{min-height:44px}}@media(prefers-reduced-motion:reduce){.id15-lab button{transition:none}}`; document.head.appendChild(style); }
  window.ID_FIFTEEN_CATALOGUE_LAB = { open(nextOptions = {}) { close(); options = nextOptions; returnFocus = nextOptions.trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null); styles(); host = document.createElement('div'); host.id = 'idFifteenCatalogueHost'; document.body.appendChild(host); document.addEventListener('keydown', onKey); menu(); }, activityCards(stage = 'lower') { return STAGES[stage].map((item) => ({ id: `id15-${stage}-${item.id}`, ...item })); } };
})();
