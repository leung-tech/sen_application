/* MI 情緒支持練習：低壓課堂策略，不作診斷、治療、危機評估或個人症狀判定。 */
(function () {
  'use strict';

  const LABELS = { lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' };
  const COMMON_DISTRACTORS = ['強迫自己立刻沒事', '假裝沒有感受', '一定要一次做得完美'];
  const MISSION_TITLES = { lower: '安心小步任務格', upper: '支持路線任務格', junior: '策略路線任務格', senior: '自主支持任務格' };
  const escape = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
  const make = (id, icon, title, focus, prompt, answers, hint) => ({ id, icon, title, focus, prompt, hint, rounds: answers.map((answer, index) => ({
    prompt: `${prompt}（第 ${index + 1} 個小步）`, answer,
    choices: [answer, COMMON_DISTRACTORS[index % COMMON_DISTRACTORS.length], COMMON_DISTRACTORS[(index + 1) % COMMON_DISTRACTORS.length]].map((text, order) => ({ text, order: (order + index + id.length) % 3 })).sort((a, b) => a.order - b.order).map((item) => item.text)
  })) });
  const cards = {
    lower: [
      make('body-weather','🌦️','身體天氣站','身體覺察','慢慢留意身體，選一個可以描述現在狀態的小線索。',['肚子有點悶','肩膀繃緊','心跳較快','手心暖暖','呼吸短一點','想喝一口水','雙腳踩著地','坐到舒服位置'],'只需描述一個身體線索，不必解釋原因。'),
      make('five-senses','🔍','五感接地小尋寶','當下覺察','把注意力溫和帶回現在，選一個可以看見、聽見或觸碰的線索。',['看一樣藍色物件','聽一種穩定聲音','摸一摸衣服布料','留意雙腳位置','找一樣圓形物件','說出今天日期','看一處光線','選一個安心物件'],'你可以只做一個感官小步，然後決定是否休息。'),
      make('breathing-lamp','💡','安心呼吸燈','自定節奏','用自己決定的速度，選一個舒服的呼吸或休息小步。',['先找到舒服姿勢','按一次吸氣提示','讓肩膀放鬆','按一次呼氣提示','喝一口水','停一停感受身體','再選一次慢呼氣','決定是否休息'],'不需要閉眼，也不用跟固定秒數。'),
      make('thought-bubble','🫧','想法泡泡觀察','正念觀察','把想法當作一個可以看見的泡泡，選一個溫和下一步。',['說「我有一個想法」','把想法寫成短句','看泡泡慢慢飄遠','不急著判斷真假','選一張支持卡','看看現在環境','說「我想停一停」','回到一件小事'],'想法出現不代表它一定是真的；只需先看見它。'),
      make('emotion-names','🎨','情緒名字卡','情緒詞彙','從不同情緒名稱中，選一個較接近角色此刻的感受。',['有點緊張','有點委屈','覺得失望','感到疲累','有點生氣','覺得擔心','感到平靜','想被陪伴'],'心情可以同時有幾種；這裡只練習找一個較接近的名字。'),
      make('safe-home','🏠','安心小屋設計','安全感','為角色選一個能讓當刻較穩定的支持物或地方。',['帶喜歡的小物','坐到安靜角','請成人陪一會','喝一口水','看一張安心圖','聽柔和聲音','拿一張支持卡','說想先休息'],'每個人選的安心方法可以不同。'),
      make('kind-bear','🧸','溫柔對話小熊','自我慈悲','選一句像對待朋友般溫和的自我對話。',['「這真的很難」','「我已經在嘗試」','「可以慢慢來」','「我可以問人」','「一次做一小步」','「休息也可以」','「我值得被幫助」','「明天可再試」'],'溫和不是放棄，而是幫自己有空間選下一步。'),
      make('pause-volcano','🌋','小火山先停住','情緒調節','感到很急或很生氣時，選一個安全的暫停小步。',['把手放下來','喝一口水','慢慢數三下','說「我要停一停」','坐遠一點點','找成人陪伴','看呼吸燈','等身體慢一點'],'先停住不是輸，是讓自己多一個選擇。'),
      make('good-moments','✨','好事收集盒','正向留意','選一件小小而值得記住的好事或舒服時刻。',['喝到喜歡的水','完成一個小步','有人對我微笑','看見陽光','聽到喜歡聲音','幫到一個人','休息了一會','說出自己的需要'],'不需要每天做，也不用比較；只選一件你願意記住的事。'),
      make('relax-puppet','🪆','身體放鬆小木偶','放鬆覺察','選一個不費力、可隨時停止的身體放鬆提示。',['鬆開手指','放低肩膀','伸一伸腳趾','靠好椅背','慢慢眨眼','喝一口水','摸一摸衣角','選擇先休息'],'任何動作不舒服都可以跳過。'),
      make('thought-fact','⚖️','想法與事實小天平','思維分辨','分辨一個可觀察的事實與心裡浮現的想法。',['說「我有這個想法」','找一件看得到的事','問「還有別的解釋嗎」','寫下已知資料','請成人一起看','先不急著結論','找一個下一步','回到現在任務'],'想法很重要，但它不一定等於全部事實。'),
      make('boundary-garden','🌷','同意與界線花園','自我保護','遇到不舒服的互動時，選一個清楚且安全的界線小步。',['說「我不想這樣」','退後一小步','找成人幫忙','問「可以先問我嗎」','保留自己的物品','說「我想停一停」','選擇較舒服距離','離開不安全情境'],'界線是保護自己和別人的方法。'),
      make('repair-shop','🧩','小挫折修補所','復原小步','事情未如預期時，選一個可嘗試的修復或支持小步。',['看看哪裡卡住','請人示範一次','重做一小部分','說「我需要提示」','先休息再回來','記住已做好的部分','換一個方法','選擇先離開'],'挫折後可以修補、休息或求助，不必急著證明自己。'),
      make('help-map','🗺️','求助小地圖','求助意識','需要支持時，選一個身邊可以先告訴的人或方法。',['告訴教師','告訴家長或照顧者','找信任成人','用支持卡指一指','寫一句短句','到指定安靜位置','請人陪我走一走','說「我需要幫忙」'],'如果目前覺得不安全或很難承受，立即告訴身邊可信任成人。'),
      make('safe-next','🛟','安全下一步卡','安全支持','遇到很強烈感受時，選一個立即可做的安全支持小步。',['把危險物件放遠','留在成人附近','說「我需要陪伴」','到較安全的地方','喝水和坐下','用支持卡求助','請成人決定下一步','依學校程序找支援'],'這是課堂支持提示；緊急危險要立即找現場成人和既有緊急支援。')
    ],
    upper: [
      make('lens','🪞','多種解釋折射鏡','思維彈性','看同一個情境，選一個較平衡或可再查證的解釋。',['也許對方很忙','我可以先問清楚','可能有不只一個原因','先看已知資料','不急著猜想法','找支持的人討論','做一件小事再看','把擔心寫下來'],'這裡不是否定感受，而是為自己多留一個解釋。'),
      make('cooling','🧊','冷熱調節選擇','身體調節','情緒很強時，選一個溫和、由自己決定的降溫小步。',['喝一口涼水','洗一洗手','坐到通風位置','慢慢伸展','抱著軟墊','看呼吸提示','告訴成人','選擇先休息'],'不用勉強身體；任何方法不舒服都可以停。'),
      make('tiny-ladder','🪜','小步挑戰階梯','循序計劃','面對一件覺得有難度的事，選一個最小、最可行的準備小步。',['先想像情境','和成人排練一句','只看一次資料','在安全地方試一小步','帶支持卡','約好休息位置','完成後做個記錄','決定下次是否再試'],'你可以不做挑戰；這裡只練習把選擇拆小。'),
      make('wave','🌊','情緒浪潮觀察','情緒容納','感覺像浪潮一樣升起時，選一個讓自己站穩的小步。',['說出情緒名字','感受腳踩地','慢慢呼氣','看周圍三樣物件','提醒自己會變化','選支持卡','喝一口水','決定先休息'],'情緒會變化；不必把它推走才可以照顧自己。'),
      make('radar','📡','災難化雷達','思維重塑','遇到很可怕的預想時，選一個可以縮小事情、回到現在的小步。',['找已發生的事實','問「最小下一步是甚麼」','列出一個支持','想想中間可能性','把任務分一點','先做五分鐘以外的選擇','問人確認','提醒自己還有時間'],'不用證明擔心不會發生；先選一個當下可行的小步。'),
      make('micro-map','👣','微行動地圖','行為啟動','感到低能量時，選一個很小而不用等有動力才可做的行動。',['打開窗簾','喝一口水','站起來伸展','回覆一個訊息','打開功課第一頁','洗一洗臉','坐到有人的地方','做完後休息'],'行動可以很小；完成或不完成都不代表你的價值。'),
      make('compassion','💬','自我慈悲對話卡','自我慈悲','把很嚴厲的內在說法，換成一個較公平和溫和的句子。',['「這很難，但我在學」','「我可以求助」','「不是只有我會卡住」','「我先做一小步」','「休息也合理」','「我可再試一次」','「我值得被尊重」','「今天做到這裡也可以」'],'溫和句子不需要相信百分百；先試讀一次就好。'),
      make('mind-reading','👓','多種解釋偵探','社交想法','看到別人一個表情或動作時，選一個不急著下結論的做法。',['想想三個可能','先問清楚','留意情境資料','不把猜想當事實','找朋友討論','先照顧自己感受','把想法寫下來','等一會再決定'],'別人的想法不能只靠一個表情確定。'),
      make('battery','🔋','情緒能量電池','資源管理','選一個能幫角色平衡耗電和充電的小步。',['安排短休息','喝水吃點東西','減少一件非必要事','留一段安靜時間','和信任的人說話','做喜歡的小活動','看明天安排','早一點準備物品'],'每個人的充電方式不同；選一個最實際的即可。'),
      make('leaves','🍃','樹葉上的想法','認知解離','讓想法像葉子飄過，選一個不用追著想法跑的小步。',['說「我正在想」','把句子放在葉子上','看它飄走','回到腳底感受','看一樣實物','慢慢呼氣','選一件小事','告訴成人需要支持'],'不必趕走想法；只練習不讓它決定每一步。'),
      make('boundary','🤝','清楚拒絕句','人際界線','面對不合理要求時，選一個清楚、尊重而保護自己的說法。',['「我現在不能」','「我需要想一想」','「我可以做這一部分」','「請不要催我」','「我想先問成人」','「我需要空間」','「我們可換一個方法」','「我現在先離開」'],'界線不需要長篇解釋；一句清楚說法已經可以。'),
      make('support-plan','🧭','今日支持計劃','支持網絡','選一個今天可以安排的支持小步。',['寫下可找的成人','準備一張提示卡','選休息時間','帶一支水','先看日程','約好求助方式','挑一個安心地方','告訴照顧者需要'],'這不是個人危機計劃；只是日常支持準備。'),
      make('empathy','🎧','同理收聽卡','同理溝通','聽到同學說不舒服時，選一個不批評、先陪伴的回應。',['「聽起來不容易」','「我可以陪你找成人」','「你想我先聽嗎」','「謝謝你告訴我」','「我們可以慢一點」','「你想喝水嗎」','「我不會急著下結論」','「我會尊重你的界線」'],'同理不是替人解決全部事情，也不需要知道所有細節。'),
      make('mindful-walk','👟','正念步道','注意力回到當下','走路或坐著時，選一個可溫和留意的當下線索。',['感受腳踩地','看前方一個顏色','聽一種聲音','留意呼氣','摸衣服質感','數三個物件','坐穩椅子','決定何時停下'],'分心很正常；只要溫和地把注意力帶回來。'),
      make('pressure-valve','🎚️','壓力轉向閥','壓力調節','壓力升高時，選一個可以把速度放慢或獲得支持的小步。',['暫停一件事','看提示卡','喝一口水','找成人確認','拆小任務','移到安靜位置','做一次慢呼氣','安排稍後再看'],'壓力不需要歸零才可以選下一步。')
    ],
    junior: [
      make('enough-info','🔎','資訊足夠才判斷','元認知','資料不完整時，選一個先搜集資訊而不急著結論的小步。',['問一個澄清問題','分開事實和猜測','找第二個來源','等更多資料','寫下不知道的部分','請人一起看','保留多個可能','晚一點再判斷'],'慢一點下結論，是保護自己的思考方法。'),
      make('grey-area','⚪','灰色地帶天平','極端想法','當想法變成只有好或只有壞時，選一個中間可能性。',['找一件做得到的事','承認有困難也有進展','列出兩種結果','把標準放合理','問「有沒有中間」','看已完成部分','給自己時間','選一個小修正'],'不完美不等於失敗；中間地帶也可以是真實的。'),
      make('values','🧭','價值指南針','價值與行動','面對選擇時，選一個貼近自己重視方向的小行動。',['重視健康時先休息','重視學習時看一頁','重視關係時回覆一句','重視誠實時問清楚','重視創意時記下想法','重視成長時請提示','重視安全時找成人','重視自己時設界線'],'價值不是成績單；它可以指引一個很小的下一步。'),
      make('action-first','🚶','行動先於動機','微行動','沒有動力時，選一個不需要等心情變好才可做的小動作。',['把書放桌上','站起來喝水','寫下第一個字','整理一支筆','傳一個貼圖','打開窗簾','坐到明亮地方','完成後允許休息'],'小行動不是逼自己；它是給自己一個開始選項。'),
      make('knowledge','📚','去標籤知識卡','心理健康素養','聽到對心理健康的標籤時，選一張較尊重和科學的說法。',['求助是成熟選擇','感受不是軟弱','每人需要不同支持','標籤不等於全部人','可向專業成人提問','尊重私隱和界線','不猜測別人狀況','支持不等於評判'],'課堂不為任何人貼標籤；每人都值得被尊重。'),
      make('outside-focus','🌳','外在焦點小雷達','注意力轉向','緊張時注意力只盯著自己，選一個溫和回到外界的線索。',['看房間一件物品','聽對方一句話','感受椅背','留意窗外光線','看任務標題','摸筆的重量','找一個顏色','問一個澄清問題'],'這不是要壓下感受，只是讓注意力多一個位置。'),
      make('time-anchor','📅','時間錨點卡','現實定位','感到腦中畫面或擔心很強時，選一個簡單的現在時空線索。',['說出今天日期','看現在位置','感受腳踩地','讀一張日程卡','看一個可信任成人','留意房間光線','握住一件實物','說「我在現在」'],'如這類經驗反覆或很困擾，請告訴可信任成人或學校支持人員。'),
      make('allowing','👐','覺察與容納矩陣','接納覺察','感受不舒服時，選一個可以同時照顧自己和不跟感受打仗的小步。',['為感受命名','讓呼氣慢一點','不急著行動','看一個支持卡','選安全位置','告訴成人','做一件小任務','決定是否休息'],'容納不代表喜歡感受；是讓自己有空間選安全下一步。'),
      make('evidence','🧾','證據與替代解釋','思維檢視','有一個很負面的結論時，選一個可幫助檢視證據的做法。',['寫一件支持證據','寫一件反面資料','問「還有可能嗎」','找可信任人討論','區分事件和評價','把句子變得較準確','先查證資料','回到一個小步'],'練習是看見更多資料，不是逼自己正面思考。'),
      make('safe-support','🛟','強烈情緒支持選擇','安全支持','情緒很強時，選一個不傷害自己或別人、可立即開始的支持小步。',['留在成人附近','把危險物放遠','坐到安全位置','說「我需要陪伴」','喝水和慢呼氣','使用支持卡','請成人處理下一步','依學校程序求助'],'這是支持提示；當刻有危險時，立即告訴現場成人並按既有緊急程序處理。'),
      make('clear-request','🗣️','清楚請求工房','人際有效性','需要支持時，選一句短而清楚的請求。',['「我想確認下一步」','「我需要短休息」','「可以說慢一點嗎」','「我想找成人一起想」','「我現在聽不清楚」','「我想先寫下來」','「我需要多一點時間」','「我想換一個方法」'],'請求支持不是麻煩別人，是照顧學習與安全的方法。'),
      make('sleep-routine','🌙','睡前安排卡','日常節律','準備休息前，選一個平穩且可行的小安排。',['收好明天用品','調暗螢幕','喝一口水','做輕鬆伸展','聽柔和聲音','寫下明天一件事','留出放慢時間','告訴照顧者困難'],'睡眠問題持續影響日常時，可告訴家長、照顧者或學校支持人員。'),
      make('anchor','⚓','情緒風暴停靠站','當下支持','感覺像風暴時，選一個能幫自己先停靠的順序小步。',['感受腳踩地','說出情緒名字','看身邊物件','慢慢呼氣','找安全位置','使用支持卡','告訴成人','只做一件小事'],'你可以在任何一個小步停下，不需要完成全部。'),
      make('resource-map','🏫','支持資源地圖','求助導航','需要較多支持時，選一個合適的校內或生活中求助方向。',['找駐校支援人員','告訴班主任','告訴家長或照顧者','到學校指定地方','請成人陪同','問可用的支持方式','寫下想問的事','依場地程序求助'],'本活動只介紹求助方向；實際需要由學生與可信任成人一起決定。'),
      make('rumination','🔄','重複想法轉向卡','注意力切換','腦中不停重播同一件事時，選一個暫時轉向而不壓抑自己的小步。',['寫下稍後再看','做一件感官小事','走到有人地方','喝一口水','完成一個微任務','看一張支持卡','和成人說一聲','回到正在做的事'],'轉向不是否定問題；是先讓大腦休息一下。')
    ],
    senior: [
      make('exam-cool','📝','應試降溫小步','應試調節','面對考試或評核壓力時，選一個能讓自己回到下一題的小步。',['讀一次題目關鍵字','慢慢呼氣','先做較熟悉部分','喝一口水','寫下第一小步','看容許的提示','提醒自己可慢一點','需要時告訴監考或成人'],'這是準備策略；實際考場安排應跟從學校或考評規定。'),
      make('stop','✋','STOP 暫停框架','痛苦耐受','感覺很急時，選一個把反應速度放慢的小步。',['先停下動作','退後一小步','觀察身體訊號','看現在環境','選一個安全回應','請成人協助','喝一口水','決定是否離開'],'停下不是放棄，而是讓自己可以較安全地選下一步。'),
      make('career-values','🧭','價值與選擇地圖','生涯決策','面對選科或方向壓力時，選一個兼顧價值與支持的小步。',['列出重視的事','問一個可靠成人','比較兩個可行方向','查一項實際資料','保留調整空間','寫下一個疑問','選一個小探索','安排稍後再看'],'沒有單一完美方向；可先用小探索了解自己。'),
      make('good-enough','⚖️','好夠好標準','完美主義彈性','要求很高時，選一個合理而可完成的標準。',['先定基本要求','訂一個休息點','完成後再檢查','接受小瑕疵','問清楚真正要求','分開重要與不重要','用時間盒但可暫停','記住已完成部分'],'「夠好」不是隨便，是選一個符合情況的標準。'),
      make('support-signals','📍','支持及早訊號卡','日常支持','發現壓力或疲累增加時，選一個較早開始的照顧或求助小步。',['看見疲累訊號','安排短休息','告訴可信任成人','減少一件非必要事','準備水和食物','看今天日程','寫下困難','依既有支持計劃行動'],'這是日常支持提醒，不會判定任何人的狀況。'),
      make('evidence-first','🔍','先搜集證據','元認知','一個解讀令自己很不安時，選一個先查證和保留替代解釋的小步。',['分開已知和猜測','找第二個資料','問澄清問題','列出兩種可能','延後結論','請人一起看','寫下反面證據','回到眼前小事'],'我們練習多看資料，不對任何想法或經驗作診斷。'),
      make('overload-boundary','🧱','情緒過載界線說法','界線溝通','感到社交或家庭壓力過載時，選一句清楚且安全的表達。',['「我需要安靜一下」','「我可稍後回覆」','「我想先確認要求」','「我需要找成人一起談」','「我現在不能繼續」','「可以寫下來嗎」','「我想換較安靜地方」','「我會在休息後回來」'],'界線是一種成熟的溝通；遇到不安全情境可直接離開並找成人。'),
      make('daily-care','🌱','日常照顧訊號','自我照顧','察覺日常節奏變得吃力時，選一個溫和而實際的照顧小步。',['吃一點和喝水','早點準備用品','安排短休息','減少螢幕時間','和人保持連結','完成一件小事','看明天日程','告訴成人困難'],'照顧基本需要是準備學習和工作的一部分。'),
      make('connection','🤝','低消耗連結小步','社交支持','想避免完全孤立時，選一個負擔較低、可由自己決定的連結方式。',['傳一個貼圖','向人點頭','回覆一句訊息','坐在可信任人附近','約短時間聊天','說「我今天想安靜」','請人陪走一段','和成人說一聲'],'連結不必很大；你也可以選擇今天先休息。'),
      make('control','🎛️','可控與不可控選擇','應對策略','面對壓力事件時，選一個自己現在可控制的小部分。',['整理一項資料','問一個問題','安排休息','選支持的人','寫下下一步','練一段說法','調整準備時間','接受暫時未知'],'不可控的部分可以先放下，可控的小步已經有價值。'),
      make('identity','🪞','多元自我拼圖','自我認同','不把自己只放在單一角色或表現上，選一個多元身份線索。',['我是學習者','我是朋友或家人','我有興趣和長處','我可以改變方向','我有需要也有能力','我喜歡某些事','我值得被尊重','我不只是一個標籤'],'人可以有很多面向；任何一個標籤都不足以定義全部自己。'),
      make('meta-emotion','💭','對情緒的情緒','元情緒覺察','發現自己因為緊張而更責怪自己時，選一個分開看兩層感受的小步。',['說「我正在緊張」','不責怪有感受的自己','慢慢呼氣','找一個支持','分開事件和自責','回到當下線索','寫一個溫和句子','決定是否休息'],'有情緒本身不是錯；先看見它，再決定怎樣照顧自己。'),
      make('advocacy','📣','校園支持自我倡導','自我倡導','需要學習安排支持時，選一個清楚而尊重的表達小步。',['寫下需要的安排','說明哪部分較困難','提出一個可行選項','問校內支援渠道','請成人陪同','準備一個短例子','確認下一步時間','保存聯絡資料'],'實際支援安排由學生、家長及學校按既有程序共同決定。'),
      make('coach','🧠','元認知自我教練','自我監察','回顧一件困難事時，選一個像教練般提問自己的小步。',['我看到了甚麼資料','我漏了甚麼可能','下一次想試甚麼','誰可支持我','哪一步最小','身體需要甚麼','有沒有較溫和說法','現在是否需要休息'],'自我教練不是批評，而是幫自己多一個選擇。'),
      make('adjusting','🛤️','持續調整旅程','復原觀點','日子有起伏時，選一個把焦點放在調整與支持的下一步。',['看見一點進展','接受今天不同','保留支持聯絡','調整一個小計劃','休息後再評估','記下有效方法','請人一起回顧','帶著一個小步離開'],'進展不必是直線；需要調整和支持都很正常。')
    ]
  };

  const lowerPatterns = [
    [2,0,1,2,1,0,1,0], [1,2,0,1,0,2,1,0], [0,2,1,0,1,2,0,2],
    [2,1,0,2,0,1,2,0], [1,0,2,1,2,0,1,0], [0,1,2,0,2,1,0,2],
    [2,0,1,2,0,1,0,1], [1,2,0,1,0,2,1,0], [0,2,1,0,1,2,0,2],
    [2,1,0,2,0,1,2,0], [1,0,2,1,2,0,1,0], [0,1,2,0,2,1,0,2],
    [2,0,1,2,0,1,0,1], [1,2,0,1,0,2,1,0], [0,2,1,0,1,2,0,2]
  ];
  cards.lower.forEach((activity, index) => {
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
  cards.upper.forEach((activity, index) => {
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
  cards.junior.forEach((activity, index) => {
    activity.answerPositionStrategy = 'irregular-balanced';
    activity.answerPositionPattern = juniorPatterns[index];
  });
  const seniorPatterns = [
    [2,1,0,2,0,1,2,0], [0,1,2,0,2,1,0,2], [1,2,0,1,0,2,1,0],
    [0,2,1,0,1,2,0,2], [2,0,1,2,0,1,0,1], [1,0,2,1,2,0,1,0],
    [0,1,2,0,2,1,0,2], [2,1,0,2,0,1,2,0], [1,2,0,1,0,2,1,0],
    [0,2,1,0,1,2,0,2], [2,0,1,2,0,1,0,1], [1,0,2,1,2,0,1,0],
    [0,1,2,0,2,1,0,2], [2,1,0,2,0,1,2,0], [1,2,0,1,0,2,1,0]
  ];
  cards.senior.forEach((activity, index) => {
    activity.answerPositionStrategy = 'irregular-balanced';
    activity.answerPositionPattern = seniorPatterns[index];
  });
  let host, settings = {}, active, index = 0, correct = 0, retries = 0, speechOn = true, returnFocus;
  const q = (selector) => host?.querySelector(selector);
  const qa = (selector) => [...(host?.querySelectorAll(selector) || [])];
  const orderedChoices = (round) => {
    const choices = [...round.choices]; const pattern = active?.answerPositionPattern; const position = pattern?.[index % pattern.length];
    if (!Number.isInteger(position) || position < 0 || position >= choices.length || !choices.includes(round.answer)) return choices;
    const others = choices.filter((choice) => choice !== round.answer); const shown = [];
    for (let choiceIndex = 0; choiceIndex < choices.length; choiceIndex += 1) shown[choiceIndex] = choiceIndex === position ? round.answer : others.shift();
    return shown;
  };
  const speak = (text) => { if (!speechOn || !('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'zh-HK'; utterance.rate = .74; window.speechSynthesis.speak(utterance); };
  function injectStyles() { if (document.querySelector('#mi15-styles')) return; const style = document.createElement('style'); style.id = 'mi15-styles'; style.textContent = `
    .mi15-overlay{position:fixed;inset:0;z-index:1300;display:grid;place-items:center;padding:clamp(10px,3vw,30px);overflow:auto;background:rgba(21,35,69,.78)}.mi15-dialog{width:min(900px,100%);max-height:calc(100vh - 20px);overflow:auto;position:relative;border-radius:28px;background:#fff;color:#233653;padding:clamp(20px,4vw,44px);box-shadow:0 28px 72px rgba(6,14,35,.38)}.mi15-close{position:absolute;top:14px;right:14px;width:48px;height:48px;border:0;border-radius:50%;background:#f1f4f8;color:#31445f;font-size:2rem;cursor:pointer}.mi15-kicker{margin:0;color:#8b3e77;font-size:.9rem;font-weight:900;letter-spacing:.04em}.mi15-head h2{margin:5px 52px 8px 0;color:#2b436d;font-size:clamp(1.7rem,4vw,2.7rem);line-height:1.16}.mi15-head p{margin:0 0 16px;line-height:1.65;color:#526782}.mi15-progress{height:13px;border-radius:999px;background:#e7eef3;overflow:hidden;margin:14px 0 22px}.mi15-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#c95f98,#9b78c9);transition:width .22s cubic-bezier(.23,1,.32,1)}.mi15-card{border:2px solid #d8e2ea;border-radius:22px;background:linear-gradient(135deg,#fbfcff,#f5f0fa);padding:clamp(17px,3vw,27px)}.mi15-hero{font-size:clamp(3.8rem,10vw,6.4rem);line-height:1;text-align:center;margin:4px}.mi15-question{margin:12px 0 8px;font-size:clamp(1.25rem,3vw,1.75rem);line-height:1.5}.mi15-copy{margin:0;color:#4d617a;line-height:1.65}.mi15-mission{display:grid;grid-template-columns:minmax(175px,.72fr) minmax(0,1.28fr);gap:15px;align-items:stretch;margin:20px 0}.mi15-target{min-height:172px;border:3px dashed #a077c2;border-radius:20px;background:linear-gradient(145deg,#f3eafa,#f9f3f8);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:16px;text-align:center;color:#633d80;font-weight:850;line-height:1.5}.mi15-target b{font-size:1.05rem}.mi15-target span{font-size:.9rem;color:#6c6280}.mi15-target.is-ready{border-color:#28689c;background:#edf7ff;box-shadow:0 0 0 4px rgba(40,104,156,.14)}.mi15-target.is-filled{border-style:solid;border-color:#31997e;background:#edf9f3;color:#176d5b}.mi15-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0}.mi15-choice{min-height:76px;border:3px solid #cbd9e9;border-radius:18px;background:#fff;color:#304a6e;padding:14px;text-align:left;font-size:1.05rem;font-weight:850;cursor:grab}.mi15-choice:hover{border-color:#aa72a0}.mi15-choice.is-dragging{opacity:.65;transform:translateY(-3px)}.mi15-choice.correct{border-color:#31997e;background:#edf9f3}.mi15-choice:focus-visible,.mi15-target:focus-visible,.mi15-tool:focus-visible,.mi15-menu-card:focus-visible{outline:4px solid #1f659d;outline-offset:3px}.mi15-tools,.mi15-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.mi15-tool{min-height:48px;border:2px solid #bcd0dd;border-radius:14px;background:#fff;color:#31546f;padding:9px 14px;font-weight:850;cursor:pointer}.mi15-tool.primary{border-color:#a84f86;background:#a84f86;color:#fff}.mi15-tool.support{border-color:#c79043;color:#6f4e12}.mi15-status{min-height:2.2em;margin:15px 0 0;color:#47627e;font-weight:750;line-height:1.55}.mi15-status.try{color:#8b4f22}.mi15-status.ok{color:#176d5b}.mi15-menu{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin-top:18px}.mi15-menu-card{min-height:146px;border:2px solid #d5dfea;border-radius:20px;background:#fff;color:#2e486d;text-align:left;padding:16px;cursor:pointer}.mi15-menu-card strong{display:block;font-size:1.1rem;margin:5px 0}.mi15-menu-card span{color:#63758e;font-size:.92rem}.mi15-note,.mi15-finish{margin-top:18px;padding:15px 17px;border-radius:16px;background:#fff5df;color:#684d17;line-height:1.58}.mi15-finish{background:#ecfaf3;color:#17624f}.mi15-finish b{display:block;font-size:1.16rem;margin-bottom:5px}@media(max-width:570px){.mi15-overlay{padding:7px}.mi15-dialog{min-height:calc(100vh - 14px);border-radius:20px;padding:18px 14px}.mi15-menu,.mi15-mission,.mi15-choices{grid-template-columns:1fr}.mi15-target{min-height:112px}.mi15-menu-card{min-height:105px}.mi15-tool{flex:1 1 145px}}@media(prefers-reduced-motion:reduce){.mi15-progress span{transition:none}.mi15-choice.is-dragging{transform:none}}`; document.head.appendChild(style); }
  function mount(content) { injectStyles(); host?.remove(); host = document.createElement('div'); host.className = 'mi15-overlay'; host.innerHTML = `<section class="mi15-dialog" role="dialog" aria-modal="true" aria-labelledby="mi15Title" tabindex="-1"><button class="mi15-close" type="button" aria-label="關閉練習">×</button>${content}</section>`; document.body.appendChild(host); q('.mi15-close').addEventListener('click', close); host.addEventListener('keydown', keyHandler); requestAnimationFrame(() => q('.mi15-dialog').focus()); }
  function close() { window.speechSynthesis?.cancel(); host?.remove(); host = null; returnFocus?.focus?.(); }
  function keyHandler(event) { if (event.key === 'Escape') { event.preventDefault(); close(); return; } if (/^[1-3]$/.test(event.key)) { const choice = qa('[data-mi15-answer]')[Number(event.key) - 1]; if (choice && !choice.disabled) { event.preventDefault(); choice.click(); } } }
  function tools() { return `<div class="mi15-tools" aria-label="低壓支持工具"><button class="mi15-tool" type="button" id="mi15Read">🔊 朗讀：${speechOn ? '開' : '關'}</button><button class="mi15-tool" type="button" id="mi15Hint">💡 看提示</button><button class="mi15-tool support" type="button" id="mi15Pause">⏸ 先停一停</button><button class="mi15-tool support" type="button" id="mi15Adult">🛟 需要成人支持</button><button class="mi15-tool" type="button" id="mi15Back">← 換一項</button></div>`; }
  function bindTools(round) { q('#mi15Read')?.addEventListener('click', () => { speechOn = !speechOn; q('#mi15Read').textContent = `🔊 朗讀：${speechOn ? '開' : '關'}`; if (!speechOn) window.speechSynthesis?.cancel(); }); q('#mi15Hint')?.addEventListener('click', () => status(`💡 ${active.hint}`, 'try')); q('#mi15Pause')?.addEventListener('click', () => status('⏸ 已先停一停。你可以喝水、休息、換一項或慢慢回來。', 'try')); q('#mi15Adult')?.addEventListener('click', () => status('🛟 你已選擇需要成人支持。請立即告訴身旁可信任的教師、家長或照顧者；若有即時危險，依場地既有緊急程序處理。', 'try')); q('#mi15Back')?.addEventListener('click', menu); if (round && speechOn) speak(`${active.title}。${round.prompt}`); }
  function status(text, kind = '') { const node = q('#mi15Status'); if (node) { node.textContent = text; node.className = `mi15-status ${kind}`; } }
  function menu() { const stage = settings.stage || 'lower'; mount(`<p class="mi15-kicker">${LABELS[stage]} · MI 情緒健康支持</p><h1 id="mi15Title">十五項情緒支持練習</h1><p>每次選一項，以短句、圖示和小步策略練習覺察、支持與溝通。你可以朗讀、看提示、暫停、要求成人支持或換練習。</p><div class="mi15-menu">${cards[stage].map((activity) => `<button class="mi15-menu-card" type="button" data-mi15-open="${activity.id}"><span aria-hidden="true">${activity.icon}</span><strong>${escape(activity.title)}</strong><span>${escape(activity.focus)} · 8 題練習</span></button>`).join('')}</div><p class="mi15-note">活動不要求披露個人經歷，也不會診斷、評分或處理危機；當刻難以承受時，請選「需要成人支持」。</p>`); qa('[data-mi15-open]').forEach((button) => button.addEventListener('click', () => { active = cards[stage].find((activity) => activity.id === button.dataset.mi15Open); ready(); })); }
  function ready() { const stage = settings.stage || 'lower'; mount(`<p class="mi15-kicker">${LABELS[stage]} · ${escape(active.focus)}</p><header class="mi15-head"><h2 id="mi15Title">${active.icon} ${escape(active.title)}</h2><p>${escape(active.prompt)}</p></header><section class="mi15-card"><b>先一起讀三個小步</b><ol><li>每題只找一個較安全、溫和或可行的下一步。</li><li>不確定可按提示、暫停或要求成人支持。</li><li>可隨時換項或離開；不需要分享個人經歷。</li></ol></section><div class="mi15-actions"><button class="mi15-tool" id="mi15Back" type="button">← 換一項</button><button class="mi15-tool primary" id="mi15Start" type="button">✓ 我準備好了</button></div><p class="mi15-status" id="mi15Status" role="status">現在是準備時間，還未開始作答。</p>`); q('#mi15Back').addEventListener('click', menu); q('#mi15Start').addEventListener('click', () => { index = 0; correct = 0; retries = 0; render(); }); }
  function render() { const round = active.rounds[index]; const shownChoices = orderedChoices(round); const stage = settings.stage || 'lower'; const progress = Math.round((index / active.rounds.length) * 100); mount(`<p class="mi15-kicker">${escape(active.focus)} · ${MISSION_TITLES[stage]}</p><header class="mi15-head"><h2 id="mi15Title">${active.icon} ${escape(active.title)}</h2><p>把一張支持小步卡帶到任務格；也可以直接點選或按數字鍵 1 至 3。每一題可慢慢看或朗讀，不用追求速度。</p></header><div class="mi15-progress" role="progressbar" aria-label="八題進度" aria-valuemin="0" aria-valuemax="8" aria-valuenow="${index}"><span style="width:${progress}%"></span></div><section class="mi15-card"><div class="mi15-hero" aria-hidden="true">${active.icon}</div><h3 class="mi15-question">第 ${index + 1} / ${active.rounds.length} 題</h3><p class="mi15-copy">${escape(round.prompt)}</p><div class="mi15-mission"><div class="mi15-target" id="mi15Target" tabindex="0" aria-label="支持任務格。可把一張支持卡放到這裡，或直接點選卡片。"><b>⭐ 今日可嘗試</b><span>拖一張小步卡到這裡</span></div><div class="mi15-choices">${shownChoices.map((choice, choiceIndex) => `<button class="mi15-choice" type="button" draggable="true" data-mi15-answer="${escape(choice)}" aria-label="選項 ${choiceIndex + 1}：${escape(choice)}。可直接點選或拖到支持任務格。"><b>${choiceIndex + 1}</b>　${escape(choice)}</button>`).join('')}</div></div><p class="mi15-status" id="mi15Status" role="status">慢慢選一張可以照顧自己的小步；這是策略練習，不是對你或任何人的評定。</p></section>${tools()}`); bindMission(round); bindTools(round); }
  function bindMission(round) { let dragged; const target = q('#mi15Target'); const choices = qa('[data-mi15-answer]'); choices.forEach((button) => { button.addEventListener('click', () => answer(button.dataset.mi15Answer, round)); button.addEventListener('dragstart', (event) => { dragged = button; event.dataTransfer?.setData('text/plain', button.dataset.mi15Answer); button.classList.add('is-dragging'); target?.classList.add('is-ready'); }); button.addEventListener('dragend', () => { button.classList.remove('is-dragging'); target?.classList.remove('is-ready'); dragged = null; }); }); target?.addEventListener('dragover', (event) => { event.preventDefault(); target.classList.add('is-ready'); }); target?.addEventListener('dragleave', () => target.classList.remove('is-ready')); target?.addEventListener('drop', (event) => { event.preventDefault(); const choice = dragged?.dataset.mi15Answer || event.dataTransfer?.getData('text/plain'); target.classList.remove('is-ready'); if (choice) answer(choice, round); dragged = null; }); }
  function answer(choice, round) { if (choice !== round.answer) { retries += 1; status(`↗ 可以再看看提示：${active.hint}`, 'try'); speak(active.hint); return; } correct += 1; q('#mi15Target')?.classList.add('is-filled'); q('#mi15Target').innerHTML = `<b>✓ 已收集小步卡</b><span>${escape(choice)}</span>`; qa('[data-mi15-answer]').forEach((button) => { button.disabled = true; if (button.dataset.mi15Answer === choice) button.classList.add('correct'); }); status(`✓ 「${choice}」是一個可行的小步。`, 'ok'); speak(`做得好。${choice}是一個可行的小步。`); window.setTimeout(() => { index += 1; index < active.rounds.length ? render() : finish(); }, 720); }
  function finish() { settings.onComplete?.({ label: `${active.title} · ${LABELS[settings.stage || 'lower']}`, mode: `mi15-${active.id}`, total: active.rounds.length, correct, incorrect: retries, completedAt: new Date().toLocaleString('zh-HK') }); mount(`<p class="mi15-kicker">${LABELS[settings.stage || 'lower']}</p><header class="mi15-head"><h2 id="mi15Title">${active.icon} 完成八題小練習</h2><p>你已按自己的節奏完成這項情緒支持練習；這不是對精神健康、能力或表現的評定。</p></header><section class="mi15-finish"><b>今日支持策略回顧</b><p>你可以帶走一個願意嘗試的小步，例如先停一停、看一件當下物件、說出需要，或告訴可信任成人。</p></section><div class="mi15-actions"><button class="mi15-tool" id="mi15Replay" type="button">↺ 再玩這一項</button><button class="mi15-tool primary" id="mi15Menu" type="button">選另一項</button></div>`); q('#mi15Replay').addEventListener('click', ready); q('#mi15Menu').addEventListener('click', menu); }
  window.MI_FIFTEEN_CATALOGUE_LAB = { activityCards(stage = 'lower') { return cards[stage] || []; }, open(options = {}) { settings = options; returnFocus = options.trigger || document.activeElement; speechOn = true; menu(); } };
}());
