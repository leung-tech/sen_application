/* ADHD 十五項啟動與自我管理練習：固定八題、短回合、可暫停、無倒數或扣分。 */
(function () {
  'use strict';
  const rotate = (items, index) => items.slice(index % items.length).concat(items.slice(0, index % items.length));
  const make = (id, icon, title, focus, description, answers, others, hintLead = '先看眼前的一小步') => ({ id, icon, title, focus, description, rounds: answers.map((answer, index) => ({ scene: `${icon} 小步 ${index + 1}：${answer}`, prompt: `${description}。現在最適合做甚麼？`, answer, choices: rotate([answer, ...rotate(others, index).slice(0, 2)], index % 3), hint: `${hintLead}；可以選「${answer}」。` })) });
  const makeSituations = (id, icon, title, focus, description, rounds) => ({ id, icon, title, focus, description, rounds });
  const lower = [
    makeSituations('stopLight','🚦','紅綠燈小煞車','反應抑制','看安全訊號、校園提示和身體感覺，練習先停看再決定下一小步。',[
      { scene:'🚦 學校門口的紅燈', prompt:'行人紅燈亮起時，現在最安全的做法是甚麼？', context:'你在斑馬線前，還未踏出行人路。', instruction:'請選出紅燈時可以做的一小步。', answer:'停在路邊等候', choices:['停在路邊等候','馬上跑過去','低頭一直看電話'], hint:'紅燈時先讓身體停住，站在行人路邊等候。' },
      { scene:'🚦 綠燈還未亮', prompt:'朋友說「快點過」，但綠燈還未亮，最適合怎樣做？', context:'你已在安全位置等候。', instruction:'請選出不受催促影響的安全選擇。', answer:'看清綠燈才出發', choices:['跟朋友立刻衝出去','看清綠燈才出發','閉上眼向前走'], hint:'別人催促時也可以慢慢等清楚訊號。' },
      { scene:'🚦 綠人亮起', prompt:'綠人亮起後，過路前還可以做哪一個小檢查？', context:'行人燈已轉為綠色，旁邊有車輛聲。', instruction:'請選出開始過路前的安全小步。', answer:'左右望後慢慢過', choices:['左右望後慢慢過','只看朋友往哪走','一邊跑一邊玩'], hint:'綠燈是出發提示；仍可先左右望，再按自己的步伐過路。' },
      { scene:'🚦 閃動綠人', prompt:'你已開始過路，綠人開始閃動，最合適怎樣做？', context:'你正在斑馬線中段，前面安全位置就在不遠處。', instruction:'請選出保持安全步伐的做法。', answer:'不奔跑，繼續走到對面', choices:['回頭衝回起點','不奔跑，繼續走到對面','停在馬路中間聊天'], hint:'已在過路時可保持留意，不奔跑，繼續走到安全一邊。' },
      { scene:'⚽ 球滾向行車路', prompt:'足球滾到行車路旁，最安全的第一步是甚麼？', context:'你和同學正在行人路玩球，旁邊有車輛經過。', instruction:'請選出遇到突然事情時的停一停策略。', answer:'留在行人路並請成人幫忙', choices:['立刻追著球跑','留在行人路並請成人幫忙','叫朋友一起衝出去'], hint:'球可以再拿；先留在安全位置，請成人協助。' },
      { scene:'🧍 同學催促你', prompt:'同學想你快些穿過走廊轉角，怎樣做能幫助自己不衝動？', context:'你未看見轉角另一邊是否有人。', instruction:'請選出先停看再走的方法。', answer:'在轉角前停一停再看', choices:['閉眼加速跑','在轉角前停一停再看','推著同學一起走'], hint:'轉角前先停一停、看一看，身體便有時間作安全選擇。' },
      { scene:'🚌 校巴上車隊伍', prompt:'校巴到了，大家都很興奮，最合適的下一步是甚麼？', context:'老師正在示意大家依次上車。', instruction:'請選出等候時能保護自己和同學的做法。', answer:'排隊等老師指示', choices:['搶到隊伍最前面','排隊等老師指示','在車門前推擠'], hint:'車到了也不用快；排隊和等指示會令每個人更安全。' },
      { scene:'✋ 停手提示牌', prompt:'做手作時看見「停手看看」提示牌，現在可以怎樣做？', context:'你正想立刻把下一件材料放上去。', instruction:'請選出看見停止提示後的反應抑制小步。', answer:'手放下，先看下一步圖卡', choices:['手放下，先看下一步圖卡','不看圖卡繼續亂放','把材料丟掉'], hint:'提示牌是在幫你停一停；先讓手放下，再看下一步。' }
    ]),
    make('stillFind','⭐','靜態尋找小星星','選擇性注意','在畫面線索中慢慢找出指定目標',['藍色星星','紅色圓點','綠色三角','黃色月亮','小貓圖卡','雨傘圖卡','書本圖卡','巴士圖卡'],['看全部同時按','不看目標','隨便選'],'先讀目標，再由左到右慢慢找'),
    make('reverseMemory','🔢','倒著念小魔術','工作記憶','看完短序列後，選下一個反向順序的小步',['最後一個','倒數第二個','從右到左','先停一下想','重看圖卡','數字 3','數字 2','數字 1'],['由左到右亂按','一次按全部','不記序列'],'短序列可以先在心裡慢慢重複'),
    make('rocketStep','🚀','火箭小步發射','持續專注','把大任務分成一個可完成的小步',['放好第一張卡','看第一個箭頭','完成一小格','勾選已做','喝一口水','看下一步','先坐好','按準備鍵'],['一次做完所有','一直看干擾','逼自己不休息'],'只做一小格就已經很好'),
    make('animalOrder','🐶','動物順序記憶卡','聽覺／視覺順序','看圖卡順序後，選目前應回想的動物',['小狗','小貓','小鴨','小魚','小鳥','小兔','小馬','小象'],['同時選全部','亂換順序','不用看圖卡'],'先記一個，再記下一個'),
    make('stopButton','🛑','衝動訊號停止鍵','停止策略','看見停止圖示時，選一個幫助自己停下的動作',['手放下','深呼吸','等下一張','數三下','看規則卡','坐穩','問下一步','慢慢再開始'],['越按越快','大聲叫','不看標誌'],'停得住也是一種成功'),
    make('pathFollow','🛣️','專注路徑跟隨','視覺動作整合','跟粗線或箭頭完成一小段路徑',['看起點','跟第一個箭頭','在轉角停','慢慢向前','看終點','走下一段','需要時重試','完成一格'],['跳過路線','亂畫很多線','不看箭頭'],'一小段一小段走，不會扣分'),
    make('calmBrake','🌬️','情緒冷靜三步','情緒調節','感到不開心或急躁時，選一個冷靜小步',['先停一停','深呼吸','喝水','說我需要幫忙','抱抱枕','到安靜角落','數到五','再試一次'],['打人','丟東西','責怪自己'],'感到大情緒時可以先照顧自己'),
    make('sortSwitch','🃏','分類變變變','認知彈性','規則改變後，選目前的新規則',['按顏色','按形狀','看新規則卡','先停一下','按大小','請再示範','把舊規則放下','跟著新箭頭'],['永遠照舊','隨便亂選','不看提示'],'規則改變時先看新圖示'),
    make('timeVisual','⏳','視覺時間小沙漏','時間感','用視覺提示估算一小段活動時間',['先看沙漏','完成一小步','看看還有多少','設一個提醒','停下核對','把任務分兩段','休息一下','勾選完成'],['一定要快','不看時間','一直猜'],'時間是幫手，不是壓力'),
    make('soundFind','🔊','背景聲音尋物','聽覺選擇','有背景圖示時，找出指定物品或關鍵詞',['水樽','書本','雨傘','巴士','鉛筆','門鈴','小狗','電話'],['把聲音開最大','不看提示','隨便按'],'可關掉聲音，只看文字和圖卡'),
    make('microGoal','📦','微目標拆解箱','任務啟動','把一個整理任務拆成可完成的小格',['先收三件','放進同一箱','勾選第一格','休息一下','再收三件','看下一格','請人一起做','完成一輪'],['一次清空全部','不知從哪開始','把東西亂丟'],'每次只做三件或一小格'),
    make('twoClue','⚖️','雙線索平衡木','分配注意','同時有兩個線索時，先選一個安全的處理方法',['先看顏色','再看數字','慢慢分兩步','用手指指住','重讀提示','先做左邊','再做右邊','完成後核對'],['同時亂按','不看第二線索','逼自己很快'],'兩個線索可分兩次看'),
    make('saveChoice','🐷','金幣儲蓄選擇','延遲滿足','面對想立刻得到的事，選一個幫助自己等一等的方法',['先存起來','看目標圖卡','等一下再決定','選小獎勵','勾選儲蓄','和成人商量','看進度條','完成小步再玩'],['用光全部','責怪自己想要','偷偷拿走'],'等待可以配合小目標和休息'),
    make('breathRhythm','🫧','魔法呼吸節奏','身體調節','跟著視覺呼吸提示，選下一個溫和步驟',['吸氣','停一停','慢慢呼氣','放鬆肩膀','再吸一次','喝水','坐穩','感受身體'],['憋很久氣','逼自己做到','不舒服也繼續'],'呼吸可按舒服節奏，不需要跟固定秒數')
  ];
  const upper = [
    make('dualClue','🧠','雙線索記憶卡','工作記憶','同時看到兩個簡單線索時，選一個幫助記住的方法',['先記位置','再記圖案','寫下關鍵詞','用手指指住','分兩次看','重複一次','看提示卡','先記一個'],['一次背全部','不看線索','亂猜'],'兩個線索可以分開處理'),
    make('timeEstimate','🕒','時間估測小幫手','時間感知','開始前和結束後，選一個較有用的時間策略',['先估一估','做完再核對','寫下開始時間','設溫和提醒','把任務分段','看時間表','調整下一次','預留休息'],['只靠感覺趕','不看時間','責怪自己估錯'],'估錯是資料，可以下一次調整'),
    make('popupShield','🪟','彈窗抗干擾盾','干擾抑制','讀題或工作時出現干擾圖示，選一個回到任務的方法',['關掉彈窗','回到題目','看關鍵詞','把手機放遠','先做一題','使用專注模式','喝水再回來','請成人幫忙'],['點開所有彈窗','同時做很多事','不理需要'],'先關一個干擾，再回到一題'),
    make('taskPyramid','🔺','任務拆解金字塔','計劃組織','把大任務拆成一個現在可以做的子任務',['先找資料','列三個重點','做第一頁','寫標題','設定下一步','完成後勾選','預留休息','請人核對'],['一次完成全部','只看大任務','拖到最後'],'大任務可以拆成很多小格'),
    make('ruleChange','🔄','動態規則變換','認知彈性','收到新提示後，選一個有助轉換的策略',['讀新規則','停一停','先試一題','看回饋','問可否再說','換分類方法','把舊規則劃掉','慢慢調整'],['一直照舊','亂按測試','怪自己'],'新規則要先看清楚'),
    make('selfCheck','🔔','自我監控小鈴','元認知','提示出現時，選一個溫和自我檢查問題',['我在做哪一步？','下一步是甚麼？','我需要休息嗎？','我有看題目嗎？','我可以用甚麼工具？','我卡在哪裏？','我需要誰幫忙？','我完成了一格嗎？'],['我很差','一定要快','不用檢查'],'自我檢查是幫自己回到任務'),
    make('shortSprint','🏁','短衝刺專注卡','時間分塊','開始短練習前，選一個可行的準備步驟',['選一小題','設柔和提醒','清空桌面一角','關一個通知','準備水樽','完成後休息','勾選開始','看目標卡'],['長時間硬撐','不准休息','一次做太多'],'短衝刺後可以休息，不用硬撐'),
    make('mindMap','🌳','心智圖結構整理','資訊組織','把雜亂資料放到一個主題或分支下',['找主題','放關鍵字','分三個分支','圈重要字','用圖示','先放一張卡','看連線','完成後核對'],['把所有資料塞一起','不分主題','只看長文'],'先找一個主題，再放一張卡'),
    make('delayedReward','🎁','即時與延遲獎勵','目標堅持','想立刻玩或花時間時，選一個平衡做法',['先完成小步','安排獎勵時間','看長遠目標','等十分鐘再決定','用進度卡','和成人商量','存下代幣','休息後回來'],['完全不做任務','不准自己休息','責怪自己想玩'],'獎勵可以安排在小步之後'),
    make('multiTrack','🛰️','多目標視覺追蹤','空間注意','同時有幾個目標時，選一個降低負荷的方法',['先追一個','用顏色標記','分兩輪看','停下核對','用手指指住','看位置格','先記左邊','再記右邊'],['一次追全部','一直亂看','不看標記'],'多個目標可以分組處理'),
    make('priorityMatrix','📌','優先順序四格','優先排序','面對多張任務卡，選一個先後安排方法',['先做緊急重要','安排重要任務','延後不急任務','刪除不必要','問成人優先次序','寫下三件事','做完一件再下一件','留時間休息'],['全部同時做','只做最容易','不看期限'],'先問哪件最重要或最急'),
    make('threeStep','🧭','三步導航記憶','聽覺工作記憶','收到三個簡短步驟時，選一個幫助記住的方法',['先記第一步','用手指數三步','重複短句','寫下箭頭','完成再看下一步','請再說一次','只看當前一步','完成後核對'],['一次衝到終點','不用聽完','亂走'],'三步可以分開做，不用一次記完'),
    make('reframe','🌱','挫折重塑卡','情緒與耐挫','做得不如預期時，選一個有助再試的想法',['我找到一個要練的點','我可以換方法','先休息再試','問提示','做小一點','記下下一步','我不需要完美','我可以請人幫忙'],['我永遠不行','全部放棄','責怪自己'],'挫折時先選一個下一小步'),
    make('noiseStrategy','🎧','雜訊專注防護罩','環境調節','環境嘈雜時，選一個幫助自己回到任務的策略',['戴耳罩','坐近老師','用文字指示','到安靜位置','關一個聲音','喝水休息','說我需要幫忙','先做短題'],['硬撐到底','大叫回去','不說需要'],'可以調整環境，不用忍住一切'),
    make('metaQuestion','❓','元認知自我提問','策略選擇','卡關時，選一個能幫助自己前進的提問',['我卡在哪裏？','我試過甚麼？','下一步是甚麼？','我需要提示嗎？','可以拆小一點嗎？','要不要休息？','誰可以幫我？','我完成了哪部分？'],['我為何這麼差','一定要自己做','不問問題'],'好問題能幫自己找方法')
  ];
  const junior = [
    make('taskSwitch','🔀','多工作業切換','任務切換','在兩種任務之間轉換時，選一個減少混亂的做法',['看目前標籤','完成一小格','劃掉已完成','換前深呼吸','讀新指示','把上一題放下','寫下下一步','回來再核對'],['兩邊一起亂做','不看新標籤','一直跳來跳去'],'轉換前先看目前是哪一種任務'),
    make('twoMinute','▶️','兩分鐘啟動卡','任務啟動','面對很難開始的任務，選一個最小啟動步驟',['打開文件','寫第一行','拿出課本','設兩分鐘提醒','列一個小標題','讀第一句','準備筆','完成後選擇繼續或休息'],['等有動力才做','一次做完整份','責怪自己拖延'],'開始只需很小的一步'),
    make('timeMap','🗺️','動態時間地圖','未來時間感','看截止日期時，選一個把時間變具體的做法',['寫下日期','分成三天','今天做一格','看日曆','設前一天提醒','留緩衝時間','完成後勾選','找人一起看'],['等到最後一天','不看日期','一次做全部'],'把未來時間畫成小格會更清楚'),
    make('memoryUpdate','🧩','複合記憶更新','工作記憶','資料改變時，選一個幫助更新的策略',['圈新資料','劃掉舊資料','重讀問題','記一個關鍵詞','分兩段看','用圖示','先放一張卡','核對答案'],['同時記所有','不用更新','亂猜'],'新資料出現時先更新一個重點'),
    make('coolCart','🛒','購物冷卻卡','衝動控制','很想立即購買時，選一個安全的等待方法',['放入清單','等一天再看','比較價錢','問家人','看是否需要','設定預算','做別的事','記下想買原因'],['立刻付款','借陌生人錢','不看價錢'],'想買很正常，可以先給自己一點時間'),
    make('selfTalk','💬','內部自我對話教練','自我引導','難題出現時，選一段幫助自己慢下來的短句',['一步一步來','先看題目','我可以問提示','先做簡單部分','我可以休息','慢慢再試','我不必完美','我能完成一小格'],['我很失敗','快點快點','我不行'],'自我說話可以像對朋友般溫和'),
    make('notification','📵','數位通知防護牆','環境設計','準備讀書或做功課時，選一個減少通知的方法',['開啟專注模式','把手機放遠','關閉彈窗','通知稍後看','只留一個需要程式','寫下回覆時間','請家人幫忙','完成後再看訊息'],['每則立刻回覆','所有程式都開著','一邊刷一邊做'],'先設一段不被通知打斷的小時間'),
    make('studyMatch','📚','學習策略匹配','策略選擇','看不同學習任務，選一個省力策略',['用圖卡記詞','做一題例子','畫心智圖','分段閱讀','用計算紙','問老師重點','練習回想','休息後複習'],['盲目重讀很久','一次背全部','不用工具'],'不同任務可用不同工具'),
    make('stimulation','🎚️','刺激度調節','環境與專注','學習時感到太悶或太嘈時，選一個調整方法',['調小背景聲','加一個視覺提示','換安靜位置','短暫走動','喝水','調整燈光','使用耳罩','請成人協助'],['把聲音開最大','一直忍住','不理不舒服'],'找到舒服的刺激度可以幫助專注'),
    make('woop','🎯','WOOP 應變卡','執行意圖','有目標又想到障礙時，選一個 IF–THEN 小計劃',['如果分心就看清單','如果累就休息五分鐘','如果忘記就設提醒','如果卡住就問人','如果想玩就先做一格','如果太嘈就戴耳罩','如果遲到就提早準備','如果焦慮就深呼吸'],['遇到障礙就放棄','只想結果','不做計劃'],'障礙出現前可先準備一個小計劃'),
    make('retryMap','🪜','耐挫復盤階梯','成長回顧','一個方法不成功時，選一個下一步',['記下卡住點','換一個方法','做小一點','看提示','休息後再試','請人示範','選簡單題','肯定已做部分'],['一直重複同一錯法','罵自己','完全放棄'],'回顧是找方法，不是檢討人格'),
    make('proofread','🔍','漏字校對雷達','細節檢查','做完題目後，選一個避免漏看關鍵字的方法',['圈否定詞','看單位','重讀問題','用尺遮住一行','核對數字','慢慢掃一次','看題目要求','再看答案'],['立刻交卷','跳過題目','只看第一句'],'校對是給自己多一次機會'),
    make('focusRhythm','🌗','專注節律日記','自我覺察','看不同時段狀態後，選一個安排方法',['早上做難題','下午做整理','晚上準備明天','記下有精神時間','安排短休息','調整下一天','先做一小格','和成人一起看'],['每天逼自己一樣','不看身體狀態','不休息'],'注意力每天不同，能調整就是策略'),
    make('microDeadline','📅','分工微死線','合作規劃','小組任務有大截止日時，選一個微死線做法',['先定第一天','分配一小件','中途核對','提前兩天完成','寫下誰負責','約短會議','完成後回報','留修改時間'],['全部最後一天做','不分工','不核對'],'把大死線拆小會較容易開始'),
    make('priority','🧷','任務優先卡','優先排序','有很多作業和生活事時，選一個先後策略',['先做明天要交','先做安全事情','寫三件最重要','問老師','做完勾選','留休息時間','不急的排後','一次只做一件'],['全部同時做','只做想做的','不看期限'],'先選一件最重要的事')
  ];
  const senior = [
    make('ifThen','⚡','IF–THEN 戰術卡','執行意圖','溫習或工作前，選一條具體應變規則',['如果手機響就放遠','如果卡住就看清單','如果累就休息','如果遲到就通知','如果太嘈就戴耳罩','如果想拖延就做兩分鐘','如果焦慮就呼吸','如果忘記就設提醒'],['只靠意志力','不做準備','怪自己分心'],'把「如果」和「我就」寫成一條短句'),
    make('rewardPlan','🎁','自訂獎勵計劃','動機調節','完成一個可行任務後，選一個健康獎勵安排',['休息十分鐘','聽一首歌','喝喜歡飲品','看短影片','散步一下','勾選進度','和人分享完成','安排娛樂時間'],['不休息硬撐','一次獎勵整天','用獎勵責罵自己'],'獎勵要小、清楚而可安排'),
    make('complexMemory','🧠','複雜資料記憶','工作記憶','面對多項資料時，選一個降低負荷的方法',['寫三個重點','畫表格','用顏色分類','先讀問題','分段整理','用便條紙','覆述一次','核對來源'],['全部背下','一次看十頁','不做筆記'],'複雜資料可先變成三個重點'),
    make('examPlan','📝','考試時間配置卡','策略性時間管理','面對多條題目時，選一個調配時間的方法',['先看全卷','先做會做的','標記難題','預留核對','看題號','分配每部分','不在一題卡住','最後補答'],['死守一題','不看全卷','一路做到完'],'時間策略是幫自己完成更多，不是比快'),
    make('hyperfocus','🧵','過度專注休息繩','休息與轉換','投入太久時，選一個保護精力的做法',['設休息提醒','喝水','伸展一下','看時間','儲存進度','寫下下一步','吃小點心','轉換前深呼吸'],['完全不停','忘記吃喝','強迫繼續'],'專注很有價值，休息也能保護它'),
    make('reduceLoad','📄','認知降維拆解','認知負荷','長篇或複雜資料出現時，選一個簡化方法',['圈三個重點','分一頁一頁','用圖示','先看標題','寫短句','遮住其他段落','問一句問題','完成一段再下一段'],['一次讀完全部','不分段','逼自己記住所有'],'先把內容縮成三個重點'),
    make('startRitual','🕯️','零摩擦啟動儀式','習慣建立','開始溫習或工作前，選一個固定小步',['整理一角桌面','倒一杯水','打開清單','準備材料','關一個通知','寫開始時間','做第一題','設定休息提醒'],['等完美狀態','整理整個房間','一直拖延'],'固定三個小步能幫大腦開始'),
    make('dailyReview','📔','每日專注復盤','元認知反思','一天結束時，選一個溫和回顧問題',['今天哪段最專注？','甚麼令我分心？','明天先做甚麼？','我需要甚麼支持？','哪個策略有用？','我有沒有休息？','我完成了甚麼？','下一步可以小一點嗎？'],['今天很差','不用回顧','列全部缺點'],'復盤是找下一步，不是打分數'),
    make('examNoise','🎧','考場干擾策略','環境調節','有周邊聲音或動作時，選一個回到題目的策略',['戴允許的耳塞','看下一題','深呼吸','遮住上一題','喝水','舉手求助','看關鍵詞','重新讀一次'],['和人吵架','不做題','硬撐焦慮'],'注意力飄走時可以溫和拉回來'),
    make('longGoal','🌱','長遠目標小地圖','延遲滿足','面對遠期目標時，選一個把它變近的方法',['今天做一格','畫進度線','設每週小目標','找同伴支持','完成後勾選','預留休息','看下一里程碑','調整難度'],['只想最後結果','逼自己每天很多','放棄休息'],'遠期目標可以變成今天的一小格'),
    make('energyMatch','🔋','精力與注意力配對','精力管理','安排一天任務時，選一個依精力分配的方法',['有精神時做難題','低精力時做整理','中間安排休息','先看睡眠狀態','預留吃飯','把任務分段','調整下一天','不用和別人比較'],['高低精力都做難題','不休息','排滿所有時間'],'任務可以配合自己的精力'),
    make('rejection','💛','拒絕感受調節','情緒與歸因','收到負面回覆時，選一個保護自己的回應',['先停一停','找支持的人','看具體回饋','不是全部否定','做一個小調整','休息後再看','寫下感受','找專業支援'],['我完全沒用','立刻反擊','把感受壓下'],'被拒絕會難受，可以先照顧自己'),
    make('filterInfo','🧺','資訊關鍵字篩網','資訊篩選','資料很多時，選一個先抓重點的方法',['圈數據','找結論','寫關鍵詞','看標題','分開事實和意見','先看問題','做三格筆記','略過重複句'],['讀每個字很久','一次記全部','不看問題'],'先抓數據、結論和關鍵詞'),
    make('selfSchedule','🗓️','自主時間表設計','自主規劃','安排一週時，選一個可持續的時間表原則',['預留休息','安排睡眠','放入重要任務','留彈性空格','看交通時間','設定提醒','每次一段專注','每週檢討'],['排滿每一分鐘','不安排吃飯','不留彈性'],'時間表要留空位，才可應對改變'),
    make('metaCoach','🧭','元認知自我教練','自主修復','連續卡關時，選一個能幫助重新開始的問題',['我現在卡哪裏？','可否換策略？','是否需要提示？','先做簡單部分？','要不要休息？','我試過甚麼？','下一個小步是甚麼？','誰可以幫我？'],['我一定要自己捱','重複同一做法','一直責怪自己'],'卡關時問自己好問題，就是自我教練')
  ];
  const STAGES={lower,upper,junior,senior}; const labels={lower:'初小 · P1–P3',upper:'高小 · P4–P6',junior:'初中 · S1–S3',senior:'高中 · S4–S6'};
  const lowerPatterns = [
    [2,0,1,2,1,0,1,0], [1,2,0,1,0,2,1,0], [0,2,1,0,1,2,0,2],
    [2,1,0,2,0,1,2,0], [1,0,2,1,2,0,1,0], [0,1,2,0,2,1,0,2],
    [2,0,1,2,0,1,0,1], [1,2,0,1,2,0,2,0], [2,0,1,2,1,0,1,0],
    [1,2,0,1,0,2,1,0], [0,2,1,0,1,2,0,2], [2,1,0,2,0,1,2,0],
    [1,0,2,1,2,0,1,0], [0,1,2,0,2,1,0,2], [2,0,1,2,0,1,0,1]
  ];
  lower.forEach((activity, index) => {
    activity.answerPositionStrategy = 'irregular-balanced';
    activity.answerPositionPattern = lowerPatterns[index];
  });
  const upperPatterns = [
    [1,0,2,1,2,0,1,0], [0,2,1,0,1,2,0,2], [2,1,0,2,0,1,2,0],
    [1,0,2,1,2,0,1,0], [0,1,2,0,2,1,0,2], [2,0,1,2,0,1,0,1],
    [1,2,0,1,0,2,1,0], [0,2,1,0,1,2,0,2], [2,1,0,2,0,1,2,0],
    [1,0,2,1,2,0,1,0], [0,1,2,0,2,1,0,2], [2,0,1,2,0,1,0,1],
    [1,2,0,1,0,2,1,0], [0,2,1,0,1,2,0,2], [2,1,0,2,0,1,2,0]
  ];
  upper.forEach((activity, index) => {
    activity.answerPositionStrategy = 'irregular-balanced';
    activity.answerPositionPattern = upperPatterns[index];
  });
  const juniorPatterns = [
    [0,2,1,0,1,2,0,2], [2,1,0,2,0,1,2,0], [1,0,2,1,2,0,1,0],
    [0,1,2,0,2,1,0,2], [2,0,1,2,0,1,0,1], [1,2,0,1,0,2,1,0],
    [0,2,1,0,1,2,0,2], [2,1,0,2,0,1,2,0], [1,0,2,1,2,0,1,0],
    [0,1,2,0,2,1,0,2], [2,0,1,2,0,1,0,1], [1,2,0,1,0,2,1,0],
    [0,2,1,0,1,2,0,2], [2,1,0,2,0,1,2,0], [1,0,2,1,2,0,1,0]
  ];
  junior.forEach((activity, index) => {
    activity.answerPositionStrategy = 'irregular-balanced';
    activity.answerPositionPattern = juniorPatterns[index];
  });
  let host=null,options={},active=null,index=0,speechOn=true,returnFocus=null;
  const q=s=>host?.querySelector(s),qa=s=>host?[...host.querySelectorAll(s)]:[];
  const speak=t=>{if(!speechOn||!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='zh-HK';u.rate=.75;window.speechSynthesis.speak(u)};
  const focusSoon=s=>window.setTimeout(()=>q(s)?.focus(),30);
  function close(){window.speechSynthesis?.cancel();document.removeEventListener('keydown',onKey);host?.remove();host=null;if(returnFocus?.isConnected)returnFocus.focus();returnFocus=null}
  function shell(c){host.innerHTML=`<div class="adhd15-backdrop"><section class="adhd15-lab" role="dialog" aria-modal="true" aria-labelledby="adhd15Title"><button class="adhd15-close" type="button" aria-label="關閉 ADHD 十五項啟動與自我管理練習">×</button>${c}</section></div>`;q('.adhd15-close')?.addEventListener('click',close)}
  function menu(){active=null;index=0;const stage=options.stage||'lower';const cards=STAGES[stage].map(a=>`<button class="adhd15-card" type="button" data-adhd15-activity="${a.id}"><span>${a.icon}</span><strong>${a.title}</strong><small>${a.focus}</small><em>8 題練習</em></button>`).join('');shell(`<header class="adhd15-head"><span>${labels[stage]} · ADHD</span><h2 id="adhd15Title">十五項啟動與自我管理練習</h2><p>每次選一項、只做一題。策略卡可放進任務盒；不想拖放時，直接點選亦可。</p></header><div class="adhd15-grid">${cards}</div><aside class="adhd15-note">不比較速度；沒有倒數、扣分或「失敗」標籤。</aside>`);qa('[data-adhd15-activity]').forEach(b=>b.addEventListener('click',()=>{active=STAGES[stage].find(a=>a.id===b.dataset.adhd15Activity);ready()}));focusSoon('[data-adhd15-activity]')}
  function ready(){const stage=options.stage||'lower';shell(`<header class="adhd15-head"><span>${labels[stage]} · ${active.focus}</span><h2 id="adhd15Title">${active.icon} ${active.title}</h2><p>${active.description}</p></header><section class="adhd15-ready"><b>先一起讀三步</b><ol><li>看一個圖示和短句。</li><li>選一張策略卡，或把它放進任務盒。</li><li>不確定可按提示、暫停或請教師一起看。</li></ol></section><div class="adhd15-actions"><button id="adhd15Back">← 換一項</button><button id="adhd15Start" class="primary">✓ 我準備好了</button></div><p class="adhd15-status" role="status">現在是準備時間，還未開始作答。</p>`);q('#adhd15Back')?.addEventListener('click',menu);q('#adhd15Start')?.addEventListener('click',()=>{index=0;render()});focusSoon('#adhd15Start')}
  function progress(){return `<div class="adhd15-progress" role="progressbar" aria-label="練習進度" aria-valuemin="1" aria-valuemax="${active.rounds.length}" aria-valuenow="${index+1}" aria-valuetext="第 ${index+1} / ${active.rounds.length} 題"><b>第 ${index+1} / ${active.rounds.length} 題</b><i aria-hidden="true"><em style="width:${((index+1)/active.rounds.length)*100}%"></em></i></div>`}
  function render(){const r=active.rounds[index];shell(`<header class="adhd15-head compact"><span>${active.focus}</span><h2 id="adhd15Title">${active.icon} ${active.title}</h2><p>${active.description}</p></header>${progress()}<article class="adhd15-scene"><span aria-hidden="true">${active.icon}</span><p>${r.scene}</p></article><p class="adhd15-prompt">${r.prompt}</p><section class="adhd15-mission-dock" data-adhd15-dock role="button" tabindex="0" aria-label="下一小步任務盒。可把最符合場景的策略卡放進來，或直接點選策略卡。"><b>🎯 下一小步任務盒</b><span>把最符合現在線索的策略卡放進來</span><small>可拖放策略卡；不想拖放時，直接點選亦可。</small></section><div class="adhd15-options">${r.choices.map((c,i)=>`<button type="button" draggable="true" data-adhd15-answer="${c}" aria-label="選項 ${i+1}：${c}"><b>${i+1}</b><span>${c}</span></button>`).join('')}</div><div class="adhd15-tools"><button id="adhd15Read" aria-pressed="${speechOn}">${speechOn?'🔊 朗讀：開':'🔇 朗讀：關'}</button><button id="adhd15Hint">💡 看提示</button><button id="adhd15Break">⏸ 先停一停</button><button id="adhd15Back">← 換一項</button></div><p id="adhd15Status" class="adhd15-status" role="status" aria-live="polite">慢慢看一看；每次只選一個小步。</p>`);qa('[data-adhd15-answer]').forEach(b=>{b.addEventListener('click',()=>answer(b.dataset.adhd15Answer,r));b.addEventListener('dragstart',e=>{e.dataTransfer?.setData('text/plain',b.dataset.adhd15Answer);if(e.dataTransfer)e.dataTransfer.effectAllowed='move'})});const dock=q('[data-adhd15-dock]');dock?.addEventListener('dragover',e=>{e.preventDefault();dock.classList.add('dragover')});dock?.addEventListener('dragleave',()=>dock.classList.remove('dragover'));dock?.addEventListener('drop',e=>{e.preventDefault();dock.classList.remove('dragover');const choice=e.dataTransfer?.getData('text/plain');if(choice)answer(choice,r)});dock?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();status('可選一張策略卡，或用數字鍵 1 至 3；拖放不是必須。','hint');focusSoon('[data-adhd15-answer]')}});q('#adhd15Read')?.addEventListener('click',()=>{speechOn=!speechOn;q('#adhd15Read').setAttribute('aria-pressed',String(speechOn));q('#adhd15Read').textContent=speechOn?'🔊 朗讀：開':'🔇 朗讀：關';if(speechOn)speak(`${active.title}。${r.scene}。${r.prompt}`)});q('#adhd15Hint')?.addEventListener('click',()=>status(`💡 ${r.hint}`,'hint'));q('#adhd15Break')?.addEventListener('click',()=>{window.speechSynthesis?.cancel();status('可以先停一停，不會扣分。準備好再選。','pause')});q('#adhd15Back')?.addEventListener('click',menu);focusSoon('[data-adhd15-answer]')}
  function status(t,k=''){const n=q('#adhd15Status');if(n){n.textContent=t;n.className=`adhd15-status ${k}`}}
  function answer(choice,r){if(choice!==r.answer){status(`↗ ${r.hint}`,'try');speak(r.hint);return}status(`✓ 「${choice}」是可行的小步。`,'ok');speak(`做得好。${choice}是一個可行的小步。`);qa('[data-adhd15-answer]').forEach(b=>{b.disabled=true;if(b.dataset.adhd15Answer===choice)b.classList.add('correct')});window.setTimeout(()=>{index+=1;index<active.rounds.length?render():finish()},720)}
  function finish(){options.onComplete?.({label:`${active.title} · ${labels[options.stage||'lower']}`,mode:`adhd15-${active.id}`,total:active.rounds.length,completedAt:new Date().toLocaleString('zh-HK')});shell(`<header class="adhd15-head"><span>${labels[options.stage||'lower']}</span><h2 id="adhd15Title">${active.icon} 完成八題小練習</h2><p>你已逐題完成這項自我管理練習。這是本節回顧，不比較注意力或速度。</p></header><section class="adhd15-finish"><b>今日策略回顧</b><p>你可以記住一個最有用的小步；下次再按自己的節奏練習。</p></section><div class="adhd15-actions"><button id="adhd15Replay">↺ 再玩這一項</button><button id="adhd15Menu" class="primary">選另一項</button></div>`);q('#adhd15Replay')?.addEventListener('click',ready);q('#adhd15Menu')?.addEventListener('click',menu);focusSoon('#adhd15Menu')}
  function onKey(e){if(!host)return;if(e.key==='Escape'){e.preventDefault();close();return}if(/^[1-3]$/.test(e.key)&&active){const c=active.rounds[index]?.choices?.[Number(e.key)-1];if(c){e.preventDefault();answer(c,active.rounds[index])}}}
  function styles(){if(document.getElementById('adhd15-style'))return;const s=document.createElement('style');s.id='adhd15-style';s.textContent=`.adhd15-backdrop{position:fixed;inset:0;z-index:1170;display:grid;place-items:center;padding:16px;background:rgba(30,27,57,.78);backdrop-filter:blur(5px)}.adhd15-lab{position:relative;width:min(980px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,30px);border:2px solid #fff;border-radius:28px;background:#fffdfa;color:#594c3c;box-shadow:0 25px 72px rgba(20,12,38,.47)}.adhd15-close{position:absolute;top:14px;right:15px;width:48px;height:48px;border:0;border-radius:50%;background:#f1ebdf;color:#6e5d48;font-size:28px;font-weight:900}.adhd15-head{padding-right:52px}.adhd15-head>span{color:#976a13;font-size:13px;font-weight:950;letter-spacing:.08em}.adhd15-head h2{margin:5px 0;color:#5d4931;font-size:clamp(26px,4vw,38px);line-height:1.15}.adhd15-head p{max-width:720px;margin:0;color:#7b6a57;font-size:15px;line-height:1.6}.adhd15-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px}.adhd15-card{min-height:164px;padding:15px;border:3px solid #ead6b7;border-radius:20px;background:#fff;color:#5d4b35;text-align:left}.adhd15-card:hover{border-color:#cf922c;background:#fffbf1}.adhd15-card>span{display:block;font-size:35px}.adhd15-card strong{display:block;margin-top:7px;font-size:18px}.adhd15-card small{display:block;margin-top:5px;color:#9b6813;font-weight:900}.adhd15-card em{display:inline-block;margin-top:10px;padding:4px 8px;border-radius:999px;background:#fff4dd;color:#7b6e5a;font-style:normal;font-size:12px;font-weight:900}.adhd15-note,.adhd15-ready,.adhd15-finish{margin-top:18px;padding:15px 17px;border-left:5px solid #d59a35;border-radius:15px;background:#fff8e8;color:#775e32;font-weight:800;line-height:1.55}.adhd15-ready ol{display:grid;gap:6px;margin:8px 0 0;padding-left:23px}.adhd15-actions{display:flex;justify-content:center;gap:11px;margin-top:18px}.adhd15-actions button,.adhd15-tools button{min-height:46px;padding:0 14px;border:2px solid #e2cda9;border-radius:13px;background:#fff;color:#6b5638;font-size:15px;font-weight:900}.adhd15-actions .primary{border-color:#c6841f;background:#c6841f;color:#fff}.adhd15-progress{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;margin-top:19px;color:#8d6317;font-weight:950}.adhd15-progress i{height:12px;overflow:hidden;border-radius:999px;background:#f6e8ce}.adhd15-progress em{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#d0922a,#d36f58)}.adhd15-scene{display:grid;grid-template-columns:auto 1fr;gap:15px;align-items:center;margin-top:18px;padding:17px;border:2px solid #efdfc8;border-radius:20px;background:#fff}.adhd15-scene span{font-size:54px}.adhd15-scene p{margin:0;color:#695439;font-size:18px;font-weight:900;line-height:1.45}.adhd15-prompt{margin:18px 0 0;color:#5d4931;font-size:18px;font-weight:900;line-height:1.55}.adhd15-mission-dock{display:grid;gap:4px;margin-top:16px;padding:15px 17px;border:2px dashed #d3a45b;border-radius:18px;background:#fffbf2;color:#755728;cursor:copy}.adhd15-mission-dock b{font-size:16px}.adhd15-mission-dock span{font-weight:900}.adhd15-mission-dock small{color:#927859;font-weight:760}.adhd15-mission-dock.dragover{border-style:solid;border-color:#739e7b;background:#f0fbf4;box-shadow:0 0 0 4px rgba(115,158,123,.16)}.adhd15-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.adhd15-options button{min-height:78px;padding:11px;border:3px solid #ead6b7;border-radius:18px;background:#fff;color:#624e35;text-align:left;font-size:16px;font-weight:900;cursor:grab}.adhd15-options button:active{cursor:grabbing}.adhd15-options button b{display:inline-grid;place-items:center;width:31px;height:31px;margin-right:8px;border-radius:50%;background:#fff0d2;color:#a76c12}.adhd15-options button.correct{border-color:#68a77e;background:#effbf4}.adhd15-options button:disabled{opacity:.85}.adhd15-tools{display:flex;flex-wrap:wrap;gap:9px;margin-top:17px}.adhd15-status{min-height:30px;margin:14px 0 0;color:#7b6b58;font-size:15px;font-weight:850;line-height:1.5}.adhd15-status.ok{color:#287752}.adhd15-status.try{color:#80662b}.adhd15-status.hint{color:#6b609b}.adhd15-status.pause{color:#7b6440}.adhd15-lab button:focus-visible,.adhd15-mission-dock:focus-visible{outline:4px solid #125f9b;outline-offset:3px}.adhd15-lab button:active{transform:scale(.97)}@media(max-width:720px){.adhd15-lab{padding:18px}.adhd15-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.adhd15-card{min-height:154px}.adhd15-options{grid-template-columns:1fr}.adhd15-actions{flex-direction:column}.adhd15-actions button{width:100%}}@media(max-width:420px){.adhd15-grid{grid-template-columns:1fr}.adhd15-card{min-height:124px}.adhd15-options button{min-height:70px}.adhd15-tools button{min-height:44px}}@media(prefers-reduced-motion:reduce){.adhd15-lab button{transition:none}}`;document.head.appendChild(s)}
  window.ADHD_FIFTEEN_CATALOGUE_LAB={open(next={}){close();options=next;returnFocus=next.trigger||(document.activeElement instanceof HTMLElement?document.activeElement:null);styles();host=document.createElement('div');host.id='adhdFifteenCatalogueHost';document.body.appendChild(host);document.addEventListener('keydown',onKey);menu()},activityCards(stage='lower'){return STAGES[stage].map(a=>({id:`adhd15-${stage}-${a.id}`,...a}))}};
})();
