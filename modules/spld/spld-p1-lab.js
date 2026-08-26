(function () {
  // 初小 SpLD 畫面層答案位置原則：每項八關保持左 3／中 3／右 2，但不用左→中→右的可預測循環。
  const ANSWER_POSITION_PATTERNS = {
    spotting: [2, 0, 1, 2, 1, 0, 1, 0],
    rhyme: [1, 2, 0, 1, 0, 2, 0, 1],
    triple: [0, 2, 1, 2, 0, 1, 0, 1],
    radical: [1, 0, 2, 1, 0, 2, 0, 1],
    train: [2, 1, 0, 2, 0, 1, 0, 1],
    semantic: [1, 2, 0, 1, 0, 2, 1, 0],
    numberline: [0, 2, 1, 2, 0, 1, 0, 1],
    sentenceTrain: [2, 0, 1, 0, 2, 1, 0, 1],
    rhyme: [1, 0, 2, 1, 2, 0, 1, 0]
  };
  // 部件拼盤是雙部件任務，以下順序表示每一關「部件列」顯示原資料的哪一項。
  // 它避免兩個正確部件總是佔據最左兩格，並保持每關可重現。
  const ASSEMBLY_PART_ORDERS = [
    [0, 2, 1], [2, 0, 1], [0, 1, 2], [2, 0, 1],
    [0, 2, 1], [0, 1, 2], [2, 0, 1], [0, 2, 1]
  ];

  const activities = {
    assembly: {
      icon: '🧩',
      title: '部件拼盤',
      description: '把左邊和右邊的部件放好，砌出目標漢字。',
      focus: '字形結構',
      accent: 'violet',
      rounds: [
        { target: '河', guide: '左 + 右', prompt: '把「氵」和「可」砌成「河」。', parts: ['氵', '可', '木'], answer: ['氵', '可'], meaning: '河水的「河」有三點水。', hint: '想一想：河水和水有關，所以左邊是三點水。' },
        { target: '晴', guide: '左 + 右', prompt: '把「日」和「青」砌成「晴」。', parts: ['日', '青', '月'], answer: ['日', '青'], meaning: '晴天的「晴」有日字旁。', hint: '想一想：晴天有太陽，所以左邊是日。' },
        { target: '媽', guide: '左 + 右', prompt: '把「女」和「馬」砌成「媽」。', parts: ['女', '馬', '木'], answer: ['女', '馬'], meaning: '媽媽的「媽」有女字旁。', hint: '想一想：媽媽是女性家人，所以左邊是女。' },
        { target: '拍', guide: '左 + 右', prompt: '把「扌」和「白」砌成「拍」。', parts: ['扌', '白', '氵'], answer: ['扌', '白'], meaning: '拍手的「拍」有提手旁。', hint: '想一想：拍手要用手，所以左邊是提手旁。' },
        { target: '花', guide: '上 + 下', prompt: '把「艹」和「化」砌成「花」。', parts: ['艹', '化', '女'], answer: ['艹', '化'], meaning: '花朵的「花」有草字頭。', hint: '想一想：花是植物，先找上面的草字頭。' },
        { target: '請', guide: '左 + 右', prompt: '把「訁」和「青」砌成「請」。', parts: ['訁', '青', '日'], answer: ['訁', '青'], meaning: '請說的「請」有言字旁。', hint: '想一想：請人幫忙要說話，所以左邊是言字旁。' },
        { target: '狗', guide: '左 + 右', prompt: '把「犭」和「句」砌成「狗」。', parts: ['犭', '句', '口'], answer: ['犭', '句'], meaning: '小狗的「狗」有反犬旁。', hint: '想一想：狗是動物，先找反犬旁。' },
        { target: '姐', guide: '左 + 右', prompt: '把「女」和「且」砌成「姐」。', parts: ['女', '且', '目'], answer: ['女', '且'], meaning: '姐姐的「姐」有女字旁。', hint: '想一想：姐姐是女性家人，所以左邊是女。' }
      ]
    },
    spotting: {
      icon: '🔎',
      title: '形近字捉迷藏',
      description: '看句子和意思提示，找出藏起來的正確字。',
      focus: '視覺細節辨析',
      accent: 'amber',
      rounds: [
        { sentence: '天氣很好，今天是＿＿天。', target: '晴', choices: ['晴', '情', '請'], hint: '太陽出來的好天氣是「晴天」；晴字有日字旁。', meaning: '☀️ 有太陽的天氣' },
        { sentence: '小明口渴，想＿＿水。', target: '喝', choices: ['喝', '渴', '竭'], hint: '用嘴巴喝水，所以選有口字旁的「喝」。', meaning: '🥤 用嘴巴喝水' },
        { sentence: '星期六和星期日是週＿＿。', target: '末', choices: ['未', '末', '朱'], hint: '一星期最後的日子是週末；末字上面一橫較短。', meaning: '📅 一星期最後的日子' },
        { sentence: '我每天都會和＿＿媽說早晨。', target: '媽', choices: ['媽', '馬', '嗎'], hint: '說的是家中的媽媽；選有女字旁的「媽」。', meaning: '👩 女性家人' },
        { sentence: '小朋友在＿＿邊看見很多水。', target: '河', choices: ['河', '何', '可'], hint: '有很多水流過的地方是河；選有三點水的「河」。', meaning: '🌊 有水流過的地方' },
        { sentence: '花園裡有一朵紅色的＿＿。', target: '花', choices: ['花', '化', '華'], hint: '植物會開出花朵；選有草字頭的「花」。', meaning: '🌼 植物開出的花朵' },
        { sentence: '音樂一開始，大家一起＿＿手。', target: '拍', choices: ['拍', '怕', '伯'], hint: '拍手要用手；選有提手旁的「拍」。', meaning: '👏 用手發出聲音' },
        { sentence: '下雨時，記得帶＿＿出門。', target: '傘', choices: ['傘', '散', '山'], hint: '可以擋雨的是雨傘；選「傘」。', meaning: '☂️ 下雨時的用品' }
      ]
    },
    rhyme: {
      icon: '🔊', title: '聲韻密碼鎖', description: '聽一聽，找出第一個聲音相同的字。', focus: '聲韻覺識', accent: 'teal',
      rounds: [
        { listen: '花', prompt: '聽「花」，找第一個聲音一樣的字。', target: '火', choices: ['火', '馬', '書'], hint: '慢慢讀：花 faa、火 fo，兩個字都以 f 聲開始。', meaning: '👂 先聽第一個聲音', success: '「花」和「火」的第一個聲音一樣。' },
        { listen: '高', prompt: '聽「高」，找第一個聲音一樣的字。', target: '歌', choices: ['歌', '花', '書'], hint: '慢慢讀：高 gou、歌 go，兩個字都以 g 聲開始。', meaning: '👂 先聽第一個聲音', success: '「高」和「歌」的第一個聲音一樣。' },
        { listen: '米', prompt: '聽「米」，找第一個聲音一樣的字。', target: '馬', choices: ['馬', '花', '書'], hint: '慢慢讀：米 mai、馬 maa，兩個字都以 m 聲開始。', meaning: '👂 先聽第一個聲音', success: '「米」和「馬」的第一個聲音一樣。' },
        { listen: '書', prompt: '聽「書」，找第一個聲音一樣的字。', target: '水', choices: ['水', '馬', '花'], hint: '慢慢讀：書 syu、水 seoi，兩個字都以 s 聲開始。', meaning: '👂 先聽第一個聲音', success: '「書」和「水」的第一個聲音一樣。' },
        { listen: '東', prompt: '聽「東」，找第一個聲音一樣的字。', target: '多', choices: ['多', '花', '書'], hint: '慢慢讀：東 dung、多 do，兩個字都以 d 聲開始。', meaning: '👂 先聽第一個聲音', success: '「東」和「多」的第一個聲音一樣。' },
        { listen: '風', prompt: '聽「風」，找第一個聲音一樣的字。', target: '飛', choices: ['飛', '馬', '書'], hint: '慢慢讀：風 fung、飛 fei，兩個字都以 f 聲開始。', meaning: '👂 先聽第一個聲音', success: '「風」和「飛」的第一個聲音一樣。' },
        { listen: '手', prompt: '聽「手」，找第一個聲音一樣的字。', target: '山', choices: ['山', '花', '馬'], hint: '慢慢讀：手 sau、山 saan，兩個字都以 s 聲開始。', meaning: '👂 先聽第一個聲音', success: '「手」和「山」的第一個聲音一樣。' },
        { listen: '口', prompt: '聽「口」，找第一個聲音一樣的字。', target: '海', choices: ['海', '花', '書'], hint: '慢慢讀：口 hau、海 hoi，兩個字都以 h 聲開始。', meaning: '👂 先聽第一個聲音', success: '「口」和「海」的第一個聲音一樣。' }
      ]
    },
    stroke: {
      icon: '✍️', title: '筆劃拼圖', description: '按正確筆順點選筆劃，讓字形慢慢出現。', focus: '筆順與動覺連結', accent: 'blue',
      rounds: [
        { target: '人', prompt: '按「人」字的筆順，先撇後捺。', steps: ['撇', '捺'], hint: '人字像兩隻腳走路：先由左上向下撇，再由右上向下捺。', meaning: '✍️ 每次只按一筆', success: '你完成了「人」字的筆順。' },
        { target: '口', prompt: '按「口」字的筆順，先豎，再橫折，最後橫。', steps: ['豎', '橫折', '橫'], hint: '先畫左邊直線，再由上面轉到右邊，最後封好底部。', meaning: '✍️ 每次只按一筆', success: '你完成了「口」字的筆順。' },
        { target: '木', prompt: '按「木」字的筆順，先橫、豎、撇、捺。', steps: ['橫', '豎', '撇', '捺'], hint: '先做十字，再加左邊撇和右邊捺。', meaning: '✍️ 每次只按一筆', success: '你完成了「木」字的筆順。' },
        { target: '大', prompt: '按「大」字的筆順，先橫、撇、捺。', steps: ['橫', '撇', '捺'], hint: '先寫中間的一橫，再向左撇、向右捺。', meaning: '✍️ 每次只按一筆', success: '你完成了「大」字的筆順。' },
        { target: '日', prompt: '按「日」字的筆順，先豎、橫折、橫、橫。', steps: ['豎', '橫折', '橫', '橫'], hint: '先寫左邊直線，再從上面轉到右邊，最後補兩橫。', meaning: '✍️ 每次只按一筆', success: '你完成了「日」字的筆順。' },
        { target: '土', prompt: '按「土」字的筆順，先橫、豎、橫。', steps: ['橫', '豎', '橫'], hint: '先寫上面短橫，再寫中間豎，最後寫下面長橫。', meaning: '✍️ 每次只按一筆', success: '你完成了「土」字的筆順。' },
        { target: '山', prompt: '按「山」字的筆順，先豎、豎折、豎。', steps: ['豎', '豎折', '豎'], hint: '先寫中間直線，再寫左邊轉到底部，最後補右邊直線。', meaning: '✍️ 每次只按一筆', success: '你完成了「山」字的筆順。' },
        { target: '十', prompt: '按「十」字的筆順，先橫後豎。', steps: ['橫', '豎'], hint: '先畫一條橫線，再從中間向下寫一豎。', meaning: '✍️ 每次只按一筆', success: '你完成了「十」字的筆順。' }
      ]
    },
    triple: {
      icon: '🖼️', title: '圖文音三連配對', description: '看圖、聽語音，再選正確的正體字詞。', focus: '形音意多感官連結', accent: 'pink',
      rounds: [
        { picture: '🍎', audio: '蘋果', prompt: '看紅色水果圖，聽「蘋果」，選出正確字詞。', target: '蘋果', choices: ['蘋果', '平果', '評果'], hint: '圖中是紅色的水果，讀作「蘋果」。', meaning: '🍎 圖像＋語音＋字詞', success: '圖、聲音和「蘋果」連起來了。' },
        { picture: '📚', audio: '圖書', prompt: '看書本圖，聽「圖書」，選出正確字詞。', target: '圖書', choices: ['圖書', '途書', '圖輸'], hint: '圖書館裡有很多可以閱讀的「圖書」。', meaning: '📚 圖像＋語音＋字詞', success: '圖、聲音和「圖書」連起來了。' },
        { picture: '☂️', audio: '雨傘', prompt: '看雨傘圖，聽「雨傘」，選出正確字詞。', target: '雨傘', choices: ['雨傘', '雨散', '雨山'], hint: '下雨時用來擋雨的是「雨傘」。', meaning: '☂️ 圖像＋語音＋字詞', success: '圖、聲音和「雨傘」連起來了。' },
        { picture: '🐶', audio: '小狗', prompt: '看小動物圖，聽「小狗」，選出正確字詞。', target: '小狗', choices: ['小狗', '小句', '小勾'], hint: '圖中有四隻腳、會汪汪叫的小動物是「小狗」。', meaning: '🐶 圖像＋語音＋字詞', success: '圖、聲音和「小狗」連起來了。' },
        { picture: '☀️', audio: '太陽', prompt: '看發光天空圖，聽「太陽」，選出正確字詞。', target: '太陽', choices: ['太陽', '大陽', '太樣'], hint: '白天在天空發光、帶來光和暖的是「太陽」。', meaning: '☀️ 圖像＋語音＋字詞', success: '圖、聲音和「太陽」連起來了。' },
        { picture: '🚌', audio: '巴士', prompt: '看交通工具圖，聽「巴士」，選出正確字詞。', target: '巴士', choices: ['巴士', '把士', '巴示'], hint: '可以載很多人上學或出門的交通工具是「巴士」。', meaning: '🚌 圖像＋語音＋字詞', success: '圖、聲音和「巴士」連起來了。' },
        { picture: '🧸', audio: '玩具', prompt: '看玩樂物品圖，聽「玩具」，選出正確字詞。', target: '玩具', choices: ['玩具', '完具', '玩句'], hint: '可以拿來玩、不是上課文具的物品叫「玩具」。', meaning: '🧸 圖像＋語音＋字詞', success: '圖、聲音和「玩具」連起來了。' },
        { picture: '🥛', audio: '牛奶', prompt: '看飲品圖，聽「牛奶」，選出正確字詞。', target: '牛奶', choices: ['牛奶', '午奶', '牛乃'], hint: '白色、可以喝的飲品是「牛奶」。', meaning: '🥛 圖像＋語音＋字詞', success: '圖、聲音和「牛奶」連起來了。' }
      ]
    },
    radical: {
      icon: '🧺', title: '部首歸類大作戰', description: '看意思與部件提示，把漢字放進合適的部首籃子。', focus: '部首規律與字義連結', accent: 'green',
      rounds: [
        { character: '拍', picture: '👏', prompt: '「拍」字和手部動作有關，送到哪個部首籃子？', target: '扌', choices: ['扌', '氵', '艹'], hint: '拍手要用手；「拍」字左邊有提手旁扌。', meaning: '✋ 手部動作字', success: '答對了！「拍」有提手旁，和手部動作有關。' },
        { character: '河', picture: '🌊', prompt: '「河」字和水有關，送到哪個部首籃子？', target: '氵', choices: ['氵', '扌', '艹'], hint: '河水是水；「河」字左邊有三點水氵。', meaning: '💧 水相關字', success: '答對了！「河」有三點水，和水有關。' },
        { character: '花', picture: '🌼', prompt: '「花」字和植物有關，送到哪個部首籃子？', target: '艹', choices: ['艹', '扌', '氵'], hint: '花是植物；「花」字上面有草字頭艹。', meaning: '🌱 植物相關字', success: '答對了！「花」有草字頭，和植物有關。' },
        { character: '晴', picture: '☀️', prompt: '「晴」字和太陽有關，送到哪個部首籃子？', target: '日', choices: ['日', '氵', '扌'], hint: '晴天有太陽；「晴」字左邊有日字旁。', meaning: '☀️ 太陽相關字', success: '答對了！「晴」有日字旁，和太陽有關。' },
        { character: '林', picture: '🌲', prompt: '「林」字和樹木有關，送到哪個部首籃子？', target: '木', choices: ['木', '艹', '女'], hint: '森林裡有很多樹；「林」字由兩個木組成。', meaning: '🌳 樹木相關字', success: '答對了！「林」有木字，和樹木有關。' },
        { character: '媽', picture: '👩', prompt: '「媽」字和女性家人有關，送到哪個部首籃子？', target: '女', choices: ['女', '扌', '口'], hint: '媽媽是女性家人；「媽」字左邊有女字旁。', meaning: '👩 女性家人字', success: '答對了！「媽」有女字旁。' },
        { character: '喝', picture: '🥤', prompt: '「喝」字和嘴巴動作有關，送到哪個部首籃子？', target: '口', choices: ['口', '氵', '日'], hint: '喝水要用嘴巴；「喝」字左邊有口字旁。', meaning: '👄 嘴巴動作字', success: '答對了！「喝」有口字旁。' },
        { character: '狗', picture: '🐶', prompt: '「狗」字和動物有關，送到哪個部首籃子？', target: '犭', choices: ['犭', '艹', '扌'], hint: '小狗是動物；「狗」字左邊有反犬旁。', meaning: '🐾 動物相關字', success: '答對了！「狗」有反犬旁，和動物有關。' }
      ]
    },
    train: {
      icon: '🚂', title: '詞語接龍列車', description: '看尾字和意思，選出可以接上車廂的詞語。', focus: '詞彙提取與工作記憶', accent: 'violet',
      rounds: [
        { sentence: '「雨＿＿」後面最適合接哪個字，組成和天氣有關的詞？', target: '傘', choices: ['傘', '筆', '床'], hint: '下雨時會用到的是雨傘。', meaning: '🌧️ 雨＋傘＝雨傘', success: '答對了！雨傘已經接上列車。' },
        { sentence: '「書＿＿」後面最適合接哪個字，組成放課本的詞？', target: '包', choices: ['包', '花', '山'], hint: '課本通常放進書包。', meaning: '🎒 書＋包＝書包', success: '答對了！書包已經接上列車。' },
        { sentence: '「校＿＿」後面最適合接哪個字，組成上課的地方？', target: '園', choices: ['園', '車', '水'], hint: '同學每天回到校園上課。', meaning: '🏫 校＋園＝校園', success: '答對了！校園已經接上列車。' },
        { sentence: '「手＿＿」後面最適合接哪個字，組成保暖用品？', target: '套', choices: ['套', '紙', '口'], hint: '天冷時可以戴手套保護雙手。', meaning: '🧤 手＋套＝手套', success: '答對了！手套已經接上列車。' },
        { sentence: '「火＿＿」後面最適合接哪個字，組成交通工具？', target: '車', choices: ['車', '山', '花'], hint: '火車可以載人到不同地方。', meaning: '🚆 火＋車＝火車', success: '答對了！火車已經接上列車。' },
        { sentence: '「圖＿＿」後面最適合接哪個字，組成可以閱讀的物品？', target: '書', choices: ['書', '雨', '手'], hint: '圖書館裡有很多圖書。', meaning: '📚 圖＋書＝圖書', success: '答對了！圖書已經接上列車。' },
        { sentence: '「花＿＿」後面最適合接哪個字，組成開滿植物的地方？', target: '園', choices: ['園', '筆', '車'], hint: '有很多花的地方可以叫花園。', meaning: '🌷 花＋園＝花園', success: '答對了！花園已經接上列車。' },
        { sentence: '「口＿＿」後面最適合接哪個字，組成用來喝水的物品？', target: '杯', choices: ['杯', '袋', '門'], hint: '喝水時可以使用口杯。', meaning: '🥤 口＋杯＝口杯', success: '答對了！口杯已經接上列車。' }
      ]
    },
    semantic: {
      icon: '🏝️', title: '語意分類島', description: '看詞語意思，把它送到合適的分類小島。', focus: '語意網絡與詞彙組織', accent: 'green',
      rounds: [
        { sentence: '「蘋果」應該送到哪一個分類小島？', target: '水果', choices: ['水果', '動物', '文具'], hint: '蘋果可以吃，是水果。', meaning: '🍎 看意思分類', success: '答對了！蘋果來到水果島。' },
        { sentence: '「小狗」應該送到哪一個分類小島？', target: '動物', choices: ['動物', '交通工具', '衣服'], hint: '小狗是會走路和叫的動物。', meaning: '🐶 看意思分類', success: '答對了！小狗來到動物島。' },
        { sentence: '「鉛筆」應該送到哪一個分類小島？', target: '文具', choices: ['文具', '水果', '家具'], hint: '寫字和畫畫會用到鉛筆。', meaning: '✏️ 看意思分類', success: '答對了！鉛筆來到文具島。' },
        { sentence: '「巴士」應該送到哪一個分類小島？', target: '交通工具', choices: ['交通工具', '植物', '食物'], hint: '巴士可以載人出行。', meaning: '🚌 看意思分類', success: '答對了！巴士來到交通工具島。' },
        { sentence: '「雨傘」應該送到哪一個分類小島？', target: '日用品', choices: ['日用品', '動物', '水果'], hint: '下雨時可以用雨傘，是生活常用品。', meaning: '☂️ 看意思分類', success: '答對了！雨傘來到日用品島。' },
        { sentence: '「玫瑰」應該送到哪一個分類小島？', target: '植物', choices: ['植物', '文具', '交通工具'], hint: '玫瑰會生長和開花，是植物。', meaning: '🌹 看意思分類', success: '答對了！玫瑰來到植物島。' },
        { sentence: '「牛奶」應該送到哪一個分類小島？', target: '飲品', choices: ['飲品', '家具', '衣服'], hint: '牛奶可以喝，是飲品。', meaning: '🥛 看意思分類', success: '答對了！牛奶來到飲品島。' },
        { sentence: '「外套」應該送到哪一個分類小島？', target: '衣服', choices: ['衣服', '食物', '動物'], hint: '外套穿在身上保暖。', meaning: '🧥 看意思分類', success: '答對了！外套來到衣服島。' }
      ]
    },
    numberline: {
      icon: '🔢', title: '數字跳格子', description: '在清楚數線上慢慢向前或向後跳，找出答案。', focus: '數感與心理數線', accent: 'blue',
      rounds: [
        { sentence: '從 2 向前跳 3 格，會到哪個數字？', target: '5', choices: ['5', '3', '6'], hint: '2 之後數 3、4、5，一共向前跳三格。', meaning: '2 ＋ 3', success: '答對了！你跳到 5。' },
        { sentence: '從 7 向後跳 2 格，會到哪個數字？', target: '5', choices: ['5', '6', '9'], hint: '7 往回數兩格：6、5。', meaning: '7 － 2', success: '答對了！你跳到 5。' },
        { sentence: '從 4 向前跳 4 格，會到哪個數字？', target: '8', choices: ['8', '7', '9'], hint: '4 之後數 5、6、7、8。', meaning: '4 ＋ 4', success: '答對了！你跳到 8。' },
        { sentence: '從 9 向後跳 3 格，會到哪個數字？', target: '6', choices: ['6', '7', '12'], hint: '9 往回數 8、7、6。', meaning: '9 － 3', success: '答對了！你跳到 6。' },
        { sentence: '從 1 向前跳 6 格，會到哪個數字？', target: '7', choices: ['7', '6', '8'], hint: '從 1 後面逐格數到第六格是 7。', meaning: '1 ＋ 6', success: '答對了！你跳到 7。' },
        { sentence: '從 10 向後跳 4 格，會到哪個數字？', target: '6', choices: ['6', '5', '14'], hint: '10 往回數 9、8、7、6。', meaning: '10 － 4', success: '答對了！你跳到 6。' },
        { sentence: '從 3 向前跳 5 格，會到哪個數字？', target: '8', choices: ['8', '7', '9'], hint: '3 後面數 4、5、6、7、8。', meaning: '3 ＋ 5', success: '答對了！你跳到 8。' },
        { sentence: '從 8 向後跳 5 格，會到哪個數字？', target: '3', choices: ['3', '4', '13'], hint: '8 往回數 7、6、5、4、3。', meaning: '8 － 5', success: '答對了！你跳到 3。' }
      ]
    },
    sentenceTrain: {
      icon: '📝', title: '句子重組小火車', description: '比較三個短句，選出詞序清楚的一句。', focus: '句法意識與句子理解', accent: 'amber',
      rounds: [
        { sentence: '把「小明、操場、跑步」排成最清楚的句子。', target: '小明在操場跑步。', choices: ['小明在操場跑步。', '操場小明跑步在。', '跑步小明在操場。'], hint: '先找誰：小明；再找在哪裏：操場；最後是做甚麼：跑步。', meaning: '🚂 誰＋在哪裏＋做甚麼', success: '答對了！句子列車排得很清楚。' },
        { sentence: '姐姐在哪裏做甚麼？選一列意思清楚的車廂。', target: '姐姐在房間看書。', choices: ['姐姐在房間看書。', '房間姐姐看書在。', '看書姐姐房間在。'], hint: '姐姐是誰，房間是地點，看書是動作。', meaning: '🚂 誰＋在哪裏＋做甚麼', success: '答對了！句子列車排得很清楚。' },
        { sentence: '找出能清楚說明爸爸煮飯地點的一句。', target: '爸爸在廚房煮飯。', choices: ['爸爸在廚房煮飯。', '煮飯爸爸廚房在。', '廚房煮飯在爸爸。'], hint: '爸爸做煮飯這個動作，地點在廚房。', meaning: '🚂 誰＋在哪裏＋做甚麼', success: '答對了！句子列車排得很清楚。' },
        { sentence: '小美上學前帶了甚麼？選排列正確的句子。', target: '小美帶雨傘上學。', choices: ['小美帶雨傘上學。', '雨傘小美上學帶。', '上學帶小美雨傘。'], hint: '先找小美，再找她帶甚麼和要去哪裏。', meaning: '🚂 誰＋帶甚麼＋做甚麼', success: '答對了！句子列車排得很清楚。' },
        { sentence: '老師向同學提出了哪個清楚要求？', target: '老師請同學安靜排隊。', choices: ['老師請同學安靜排隊。', '同學老師排隊安靜請。', '安靜老師請排隊同學。'], hint: '老師是提出要求的人，同學是要做事的人。', meaning: '🚂 誰＋請誰＋做甚麼', success: '答對了！句子列車排得很清楚。' },
        { sentence: '把一起做的課堂工作排成一句順暢的話。', target: '我們一起整理課本。', choices: ['我們一起整理課本。', '課本一起我們整理。', '整理我們課本一起。'], hint: '我們是做事的人，整理是動作，課本是物品。', meaning: '🚂 誰＋做甚麼＋甚麼', success: '答對了！句子列車排得很清楚。' },
        { sentence: '弟弟最喜歡的食物是甚麼？選詞序正確的一句。', target: '弟弟喜歡吃蘋果。', choices: ['弟弟喜歡吃蘋果。', '蘋果弟弟吃喜歡。', '喜歡蘋果弟弟吃。'], hint: '弟弟是人物，吃是動作，蘋果是食物。', meaning: '🚂 誰＋做甚麼＋甚麼', success: '答對了！句子列車排得很清楚。' },
        { sentence: '媽媽正在協助我找甚麼？選最清楚的句子。', target: '媽媽幫我找水樽。', choices: ['媽媽幫我找水樽。', '水樽媽媽我找幫。', '幫水樽媽媽找我。'], hint: '媽媽是幫忙的人，水樽是要找的物品。', meaning: '🚂 誰＋幫誰＋做甚麼', success: '答對了！句子列車排得很清楚。' }
      ]
    }
  };

  let active = null;
  let roundIndex = 0;
  let selectedParts = ['', ''];
  let draggedPart = null;
  let selectedStrokes = [];
  let strokeOptions = [];
  let result = { correct: 0, retries: 0, hints: 0 };
  let completed = false;

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[「」＿＿]/g, ''));
    utterance.lang = 'zh-HK';
    utterance.rate = 0.72;
    window.speechSynthesis.speak(utterance);
  }

  function shuffleSteps(steps) {
    const output = [...steps];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const nextIndex = Math.floor(Math.random() * (index + 1));
      [output[index], output[nextIndex]] = [output[nextIndex], output[index]];
    }
    return output;
  }

  function makeStrokeOptions(steps) {
    return shuffleSteps(steps.map((label, index) => ({ id: `${label}-${index + 1}`, label })));
  }

  function closeLab() {
    window.speechSynthesis?.cancel();
    document.querySelector('.spld-p1-lab-backdrop')?.remove();
  }

  function currentRound() {
    return active.rounds[roundIndex];
  }

  function displayedChoices(round) {
    const choices = [...(round.choices || [])];
    const pattern = ANSWER_POSITION_PATTERNS[active && Object.keys(activities).find((key) => activities[key] === active)];
    const targetPosition = pattern?.[roundIndex];
    const targetIndex = choices.indexOf(round.target);
    if (targetPosition === undefined || targetIndex < 0 || targetPosition >= choices.length) return choices;
    const ordered = Array(choices.length);
    ordered[targetPosition] = round.target;
    let sourceIndex = 0;
    for (let index = 0; index < ordered.length; index += 1) {
      if (index === targetPosition) continue;
      while (sourceIndex === targetIndex) sourceIndex += 1;
      ordered[index] = choices[sourceIndex];
      sourceIndex += 1;
    }
    return ordered;
  }

  function displayedAssemblyParts(round) {
    const order = ASSEMBLY_PART_ORDERS[roundIndex] || [0, 1, 2];
    return order.map((index) => round.parts[index]);
  }

  function labShell(content) {
    return `<div class="spld-p1-lab-backdrop" role="presentation"><section class="spld-p1-lab" role="dialog" aria-modal="true" aria-label="初小讀寫實驗室"><button class="spld-lab-close" type="button" aria-label="關閉初小讀寫實驗室">×</button>${content}</section></div>`;
  }

  function menuMarkup() {
    return labShell(`<div class="spld-lab-heading"><span class="spld-lab-kicker">初小 P.1–P.3 · SpLD</span><h2>初小讀寫實驗室</h2><p>先選一項短練習。可以慢慢做、重聽規則、看提示或隨時離開。</p></div><div class="spld-lab-choice-row">${Object.entries(activities).map(([key, activity]) => `<button class="spld-lab-activity-card ${activity.accent}" type="button" data-activity="${key}"><span class="spld-lab-icon">${activity.icon}</span><strong>${activity.title}</strong><small>${activity.description}</small><em>約 2–3 分鐘</em></button>`).join('')}</div><aside class="spld-lab-low-pressure"><strong>可以這樣參與：</strong><span>👀 先看示範</span><span>👆 點選答案</span><span>🔊 重聽規則</span><span>💡 使用提示</span></aside>`);
  }

  function openMenu() {
    closeLab();
    document.body.insertAdjacentHTML('beforeend', menuMarkup());
    document.querySelector('.spld-lab-close')?.addEventListener('click', closeLab);
    document.querySelectorAll('[data-activity]').forEach((button) => button.addEventListener('click', () => startActivity(button.dataset.activity)));
  }

  function feedback(message, type = '') {
    const panel = document.querySelector('#spldLabFeedback');
    if (!panel) return;
    panel.className = `spld-lab-feedback ${type}`;
    panel.textContent = message;
  }

  function renderRound() {
    const round = currentRound();
    const total = active.rounds.length;
    const progress = `<div class="spld-lab-progress"><span>第 ${roundIndex + 1} / ${total} 關</span><div><i style="width:${((roundIndex + 1) / total) * 100}%"></i></div></div>`;
    const tools = `<div class="spld-lab-tools"><button type="button" id="spldLabRead">🔊 朗讀規則</button><button type="button" id="spldLabHint">💡 看提示</button><button type="button" id="spldLabBack">← 換一項練習</button></div>`;
    let activityMarkup = '';
    const radicalBaskets = { '扌': ['✋', '手部動作'], '氵': ['💧', '水相關'], '艹': ['🌱', '植物相關'], '日': ['☀️', '太陽相關'], '木': ['🌳', '樹木相關'], '女': ['👩', '女性家人'], '口': ['👄', '嘴巴動作'], '犭': ['🐾', '動物相關'] };

    if (active === activities.assembly) {
      const slotLabels = round.guide.includes('上') ? ['上面', '下面'] : ['左邊', '右邊'];
      const placementInstruction = round.guide.includes('上') ? '可把部件拖到上面或下面的位置；也可按一個部件，它會放到合適的位置。' : '可把部件拖到左右位置；也可按一個部件，它會放到合適的位置。';
      activityMarkup = `<div class="spld-assembly-guide"><span>目標字</span><strong>${round.target}</strong><small>${round.guide} 結構</small></div><p class="spld-lab-prompt">${round.prompt}</p><p class="spld-lab-meaning">${round.meaning}</p><div class="spld-assembly-slots" aria-label="部件拼盤"><button type="button" class="spld-part-slot" data-slot="0" data-sen-drop-zone="part"><span>${slotLabels[0]}</span><strong>${selectedParts[0] || '？'}</strong></button><span class="spld-plus">＋</span><button type="button" class="spld-part-slot" data-slot="1" data-sen-drop-zone="part"><span>${slotLabels[1]}</span><strong>${selectedParts[1] || '？'}</strong></button></div><p class="spld-lab-instruction">${placementInstruction}</p><div class="spld-part-bank">${displayedAssemblyParts(round).map((part) => `<button type="button" class="spld-part-piece ${selectedParts.includes(part) ? 'used' : ''}" data-part="${part}" draggable="${!selectedParts.includes(part)}" data-sen-drag-source ${selectedParts.includes(part) ? 'disabled' : ''}>${part}</button>`).join('')}</div>`;
    } else if (active === activities.stroke) {
      activityMarkup = `<div class="spld-stroke-target"><span>目標字</span><strong>${round.target}</strong><small>${round.steps.length} 筆</small></div><p class="spld-lab-prompt">${round.prompt}</p><p class="spld-lab-meaning">${round.meaning}</p><div class="spld-stroke-slots">${round.steps.map((_, index) => `<div class="spld-stroke-slot ${selectedStrokes[index] ? 'filled' : ''}"><b>${index + 1}</b><strong>${selectedStrokes[index]?.label || '？'}</strong></div>`).join('')}</div><div class="spld-stroke-options">${strokeOptions.map((step) => { const used = selectedStrokes.some((selected) => selected.id === step.id); return `<button type="button" class="spld-stroke-option ${used ? 'used' : ''}" data-stroke="${step.id}" ${used ? 'disabled' : ''} aria-label="選擇第 ${step.id.split('-').at(-1)} 個「${step.label}」筆劃">${step.label}</button>`; }).join('')}</div>`;
    } else if (active === activities.triple) {
      activityMarkup = `<div class="spld-triple-scene"><span class="spld-triple-picture" aria-label="圖片提示">${round.picture}</span><button type="button" class="spld-triple-listen" id="spldTripleListen">🔊 聽字詞</button><small>${round.meaning}</small></div><p class="spld-lab-prompt">${round.prompt}</p><div class="spld-spotting-choices">${displayedChoices(round).map((choice, index) => `<button type="button" class="spld-spotting-choice" data-choice="${choice}"><span>${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div>`;
    } else if (active === activities.rhyme) {
      activityMarkup = `<div class="spld-sound-scene"><span>🎧</span><strong>聽一聽：「${round.listen}」</strong><button type="button" id="spldRhymeListen">🔊 再聽一次</button><small>${round.meaning}</small></div><p class="spld-lab-prompt">${round.prompt}</p><div class="spld-spotting-choices">${displayedChoices(round).map((choice, index) => `<button type="button" class="spld-spotting-choice" data-choice="${choice}"><span>${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div>`;
    } else if (active === activities.radical) {
      activityMarkup = `<div class="spld-radical-target"><span>${round.picture}</span><strong>${round.character}</strong><small>${round.meaning}</small></div><p class="spld-lab-prompt">${round.prompt}</p><div class="spld-radical-baskets">${displayedChoices(round).map((choice) => `<button type="button" class="spld-radical-basket" data-choice="${choice}"><span>${radicalBaskets[choice][0]}</span><strong>${choice}</strong><small>${radicalBaskets[choice][1]}籃子</small></button>`).join('')}</div>`;
    } else {
      activityMarkup = `<div class="spld-spotting-scene"><p>${round.sentence.replace('＿＿', '<strong class="spld-blank">？</strong>')}</p><small>${round.meaning}</small></div><p class="spld-lab-prompt">找出最適合放進空格的字。</p><div class="spld-spotting-choices">${displayedChoices(round).map((choice, index) => `<button type="button" class="spld-spotting-choice" data-choice="${choice}"><span>${index + 1}</span><strong>${choice}</strong></button>`).join('')}</div>`;
    }

    const inner = `<div class="spld-lab-heading compact"><span class="spld-lab-kicker">${active.title} · ${active.focus}</span><h2>${active.icon} ${active.title}</h2><p>${active.description}</p></div>${progress}<div class="spld-lab-play-area">${activityMarkup}</div><div class="spld-lab-feedback" id="spldLabFeedback">慢慢看一看；不知道時可按提示。</div>${tools}`;
    const dialog = document.querySelector('.spld-p1-lab');
    dialog.innerHTML = `<button class="spld-lab-close" type="button" aria-label="關閉初小讀寫實驗室">×</button>${inner}`;
    bindRound(round);
  }

  function bindRound(round) {
    document.querySelector('.spld-lab-close')?.addEventListener('click', closeLab);
    document.querySelector('#spldLabRead')?.addEventListener('click', () => speak(`${active.title}。${round.prompt}`));
    document.querySelector('#spldLabHint')?.addEventListener('click', () => { result.hints += 1; feedback(`💡 ${round.hint}`, 'hint'); speak(round.hint); });
    document.querySelector('#spldLabBack')?.addEventListener('click', openMenu);
    if (active === activities.assembly) {
      document.querySelectorAll('.spld-part-piece').forEach((button) => {
        button.addEventListener('click', () => choosePart(button.dataset.part));
        button.addEventListener('dragstart', (event) => { draggedPart = button.dataset.part; try { event.dataTransfer?.setData('text/plain', draggedPart); } catch {} });
        button.addEventListener('dragend', () => { draggedPart = null; });
      });
      document.querySelectorAll('.spld-part-slot').forEach((slot) => {
        slot.addEventListener('dragover', (event) => event.preventDefault());
        slot.addEventListener('drop', (event) => { event.preventDefault(); const part = event.dataTransfer?.getData('text/plain') || draggedPart; if (part) choosePart(part, Number(slot.dataset.slot)); draggedPart = null; });
      });
      document.querySelectorAll('.spld-part-slot').forEach((button) => button.addEventListener('click', () => clearSlot(Number(button.dataset.slot))));
    } else if (active === activities.stroke) {
      document.querySelectorAll('.spld-stroke-option').forEach((button) => button.addEventListener('click', () => chooseStroke(button.dataset.stroke)));
    } else {
      document.querySelectorAll('.spld-spotting-choice, .spld-radical-basket').forEach((button) => button.addEventListener('click', () => checkChoice(button, round)));
      document.querySelector('#spldRhymeListen')?.addEventListener('click', () => speak(round.listen));
      document.querySelector('#spldTripleListen')?.addEventListener('click', () => speak(round.audio));
    }
  }

  function choosePart(part, preferredSlot = null) {
    if (selectedParts.includes(part)) return;
    const correctSlot = currentRound().answer.indexOf(part);
    const slot = Number.isInteger(preferredSlot) && !selectedParts[preferredSlot]
      ? preferredSlot
      : correctSlot !== -1 && !selectedParts[correctSlot]
        ? correctSlot
        : selectedParts.findIndex((value) => !value);
    if (slot === -1) return;
    selectedParts[slot] = part;
    if (selectedParts.length === 2 && selectedParts.every(Boolean)) {
      if (selectedParts.every((value, index) => value === currentRound().answer[index])) {
        result.correct += 1;
        feedback(`✓ 砌好了！${currentRound().meaning}`, 'success');
        speak(`答對了。${currentRound().target}。${currentRound().meaning}`);
        setTimeout(nextRound, 1150);
      } else {
        result.retries += 1;
        feedback('先看看部件的位置，再試一次。', 'try');
        speak('先看看部件的位置，再試一次。');
        setTimeout(() => { selectedParts = ['', '']; renderRound(); }, 820);
      }
    } else {
      renderRound();
    }
  }

  function clearSlot(slot) {
    if (!selectedParts[slot]) return;
    selectedParts[slot] = '';
    renderRound();
  }

  function checkChoice(button, round) {
    const choice = button.dataset.choice;
    if (choice === round.target) {
      result.correct += 1;
      button.classList.add('correct');
      feedback(`✓ ${round.success || `找到了「${round.target}」！${round.meaning}`}`, 'success');
      speak(`答對了。${round.success || round.target}`);
      setTimeout(nextRound, 1150);
    } else {
      result.retries += 1;
      button.classList.add('wrong');
      feedback('先看看意思提示和字的左邊部件，再試一次。', 'try');
      speak('先看看意思提示和字的左邊部件，再試一次。');
      setTimeout(() => button.classList.remove('wrong'), 650);
    }
  }

  function chooseStroke(strokeId) {
    const stroke = strokeOptions.find((option) => option.id === strokeId);
    if (!stroke || selectedStrokes.some((selected) => selected.id === stroke.id)) return;
    selectedStrokes.push(stroke);
    const round = currentRound();
    if (selectedStrokes.length === round.steps.length) {
      if (selectedStrokes.every((step, index) => step.label === round.steps[index])) {
        result.correct += 1;
        feedback(`✓ ${round.success}`, 'success');
        speak(`答對了。${round.success}`);
        setTimeout(nextRound, 1150);
      } else {
        result.retries += 1;
        feedback('先看一看每一筆的先後，再試一次。', 'try');
        speak('先看一看每一筆的先後，再試一次。');
        setTimeout(() => { selectedStrokes = []; renderRound(); }, 820);
      }
    } else {
      renderRound();
    }
  }

  function nextRound() {
    if (roundIndex < active.rounds.length - 1) {
      roundIndex += 1;
      selectedParts = ['', ''];
      selectedStrokes = [];
      strokeOptions = active === activities.stroke ? makeStrokeOptions(currentRound().steps) : [];
      renderRound();
    } else {
      finish();
    }
  }

  function finish() {
    if (completed) return;
    completed = true;
    document.dispatchEvent(new CustomEvent('spld-p1-lab-complete', { detail: { ...result, activity: active.title } }));
    const dialog = document.querySelector('.spld-p1-lab');
    dialog.innerHTML = `<button class="spld-lab-close" type="button" aria-label="關閉初小讀寫實驗室">×</button><div class="spld-lab-result"><span class="spld-lab-kicker">本次讀寫回顧</span><h2>完成 ${active.title}</h2><p>你可以休息、重玩另一項練習，或回到一般 SpLD 關卡。</p><div class="spld-result-grid"><div><strong>${result.correct} / ${active.rounds.length}</strong><span>完成回合</span></div><div><strong>${result.retries}</strong><span>溫和重試</span></div><div><strong>${result.hints}</strong><span>使用提示</span></div></div><aside>這些數字只記錄本次練習；它們用來幫助教師調整下一步，不作比較。</aside><div class="spld-lab-result-actions"><button type="button" id="spldLabTryAgain">↺ 選另一項練習</button><button type="button" id="spldLabExit">回到 SpLD 關卡</button></div></div>`;
    dialog.querySelector('.spld-lab-close')?.addEventListener('click', closeLab);
    dialog.querySelector('#spldLabTryAgain')?.addEventListener('click', openMenu);
    dialog.querySelector('#spldLabExit')?.addEventListener('click', closeLab);
  }

  function startActivity(key) {
    active = activities[key];
    roundIndex = 0;
    selectedParts = ['', ''];
    selectedStrokes = [];
    strokeOptions = active === activities.stroke ? makeStrokeOptions(active.rounds[0].steps) : [];
    result = { correct: 0, retries: 0, hints: 0 };
    completed = false;
    renderRound();
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .spld-primary-lab-launch{margin:18px 0;padding:16px;border:1px solid rgba(108,88,202,.22);border-radius:18px;background:linear-gradient(135deg,#f2edff,#fff);display:flex;gap:14px;align-items:center;justify-content:space-between}.spld-primary-lab-launch strong{display:block;color:#4d3b9e;font-size:17px}.spld-primary-lab-launch small{display:block;color:#625c75;margin-top:4px;line-height:1.5}.spld-primary-lab-launch button{border:0;border-radius:12px;padding:12px 15px;background:#624fc2;color:#fff;font-weight:800;cursor:pointer;white-space:nowrap}.spld-p1-lab-backdrop{position:fixed;inset:0;z-index:90;background:rgba(22,27,55,.66);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}.spld-p1-lab{position:relative;width:min(720px,100%);max-height:calc(100vh - 32px);overflow:auto;border-radius:26px;background:#fff;padding:31px;box-shadow:0 28px 70px rgba(16,18,47,.32);color:#2e2a3d}.spld-lab-close{position:absolute;top:13px;right:15px;border:0;border-radius:50%;width:37px;height:37px;background:#f3f1f9;color:#574e74;font-size:27px;line-height:1;cursor:pointer}.spld-lab-heading{padding-right:36px}.spld-lab-heading h2{margin:5px 0 6px;font-size:28px;color:#3e326d}.spld-lab-heading p{margin:0;color:#625d71;line-height:1.55}.spld-lab-kicker{display:block;color:#725bd2;font-size:13px;font-weight:850;letter-spacing:.05em}.spld-lab-choice-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:22px 0}.spld-lab-activity-card{min-height:190px;text-align:left;border:2px solid #e2ddf4;border-radius:20px;padding:18px;background:#fff;cursor:pointer;display:flex;flex-direction:column;gap:7px;transition:transform .16s ease,box-shadow .16s ease}.spld-lab-activity-card:hover{transform:translateY(-3px);box-shadow:0 13px 26px rgba(88,68,160,.14)}.spld-lab-activity-card.amber{border-color:#f4dfae;background:#fffaf0}.spld-lab-icon{font-size:36px}.spld-lab-activity-card strong{font-size:20px;color:#3e326d}.spld-lab-activity-card small{line-height:1.5;color:#5d576e}.spld-lab-activity-card em{font-style:normal;font-weight:750;color:#735dd0;margin-top:auto}.spld-lab-low-pressure{display:flex;flex-wrap:wrap;gap:8px;align-items:center;border-radius:14px;background:#edf8f5;padding:12px 14px;color:#365a52;font-size:14px}.spld-lab-low-pressure span{border-radius:999px;background:#fff;padding:5px 8px}.spld-lab-progress{display:flex;align-items:center;gap:12px;margin:20px 0 14px;font-size:14px;font-weight:800;color:#62567e}.spld-lab-progress>div{height:8px;flex:1;border-radius:999px;background:#e8e4f3;overflow:hidden}.spld-lab-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#725bd2,#9b85ee)}.spld-lab-play-area{border:1px solid #e4ddf4;border-radius:20px;padding:20px;background:linear-gradient(145deg,#fcfbff,#f5f1ff)}.spld-assembly-guide{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:#fff;box-shadow:0 5px 14px rgba(78,54,147,.08)}.spld-assembly-guide span{font-weight:750;color:#6d6385}.spld-assembly-guide strong{font-size:42px;color:#4b399f}.spld-assembly-guide small{margin-left:auto;color:#7c709e}.spld-lab-prompt{font-size:20px;font-weight:850;line-height:1.45;color:#372c5d;margin:20px 0 5px}.spld-lab-meaning{margin:0 0 16px;color:#655e77}.spld-assembly-slots{display:flex;align-items:center;justify-content:center;gap:10px;margin:16px 0}.spld-part-slot{width:130px;min-height:118px;border:2px dashed #a895e1;border-radius:18px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer}.spld-part-slot span{font-size:13px;color:#70648d;font-weight:750}.spld-part-slot strong{font-size:54px;color:#493599}.spld-plus{font-size:28px;color:#806bd5;font-weight:900}.spld-lab-instruction{font-size:14px;text-align:center;color:#6e6681;margin:4px 0 12px}.spld-part-bank{display:flex;justify-content:center;gap:11px;flex-wrap:wrap}.spld-part-piece{width:80px;min-height:74px;border:2px solid #b7a9e5;border-radius:14px;background:#fff;color:#483495;font-size:34px;font-weight:850;cursor:pointer}.spld-part-piece.used{opacity:.45}.spld-spotting-scene{border-radius:17px;background:#fff;padding:20px;text-align:center}.spld-spotting-scene p{font-size:23px;font-weight:850;line-height:1.7;margin:0;color:#393149}.spld-spotting-scene small{display:inline-block;margin-top:10px;padding:5px 9px;background:#f1effa;border-radius:99px;color:#605773}.spld-blank{display:inline-block;min-width:36px;color:#b37519;border-bottom:3px solid #e2ab42}.spld-spotting-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}.spld-spotting-choice{min-height:90px;border:2px solid #e4c97e;border-radius:15px;background:#fff9e9;color:#7b5816;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}.spld-spotting-choice span{font-size:12px;font-weight:800}.spld-spotting-choice strong{font-size:35px}.spld-spotting-choice.correct,.spld-part-piece.correct{border-color:#49a56e;background:#ebf9ef;color:#257246}.spld-spotting-choice.wrong{border-color:#d27b7b;background:#fff0f0;color:#9d4545}.spld-lab-feedback{min-height:24px;margin:14px 0;color:#625c73;line-height:1.45}.spld-lab-feedback.success{color:#26704a;font-weight:800}.spld-lab-feedback.try{color:#a14d4d;font-weight:800}.spld-lab-feedback.hint{color:#895e10;font-weight:800}.spld-lab-tools{display:flex;flex-wrap:wrap;gap:9px}.spld-lab-tools button,.spld-lab-result-actions button{border:1px solid #d8d0eb;border-radius:11px;background:#fff;color:#4c3b95;padding:10px 12px;font-weight:800;cursor:pointer}.spld-lab-tools button:first-child,.spld-lab-result-actions button:first-child{background:#5d48b9;color:#fff;border-color:#5d48b9}.spld-lab-result{text-align:center;padding-top:15px}.spld-lab-result h2{font-size:28px;color:#3e326d;margin:7px 0}.spld-lab-result>p{color:#625d71;line-height:1.55}.spld-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin:22px 0}.spld-result-grid div{border-radius:16px;background:#f5f2fd;padding:14px}.spld-result-grid strong{display:block;font-size:25px;color:#47359a}.spld-result-grid span{font-size:13px;color:#645c79}.spld-lab-result aside{border-radius:13px;background:#eef8f4;padding:12px;color:#3c6457;font-size:14px;line-height:1.5}.spld-lab-result-actions{display:flex;justify-content:center;gap:10px;margin-top:18px}@media (max-width:620px){.spld-p1-lab{padding:24px 16px;border-radius:21px}.spld-lab-choice-row{grid-template-columns:1fr}.spld-lab-activity-card{min-height:145px}.spld-lab-heading h2{font-size:24px}.spld-lab-prompt{font-size:18px}.spld-spotting-scene p{font-size:20px}.spld-part-slot{width:110px;min-height:105px}.spld-result-grid{gap:7px}.spld-result-grid strong{font-size:21px}.spld-lab-tools button{flex:1}.spld-primary-lab-launch{align-items:flex-start;flex-direction:column}.spld-primary-lab-launch button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  window.SPLD_P1_LAB = {
    activityCards(stage = 'lower') {
      if (stage !== 'lower') return [];
      return Object.entries(activities).map(([key, activity]) => ({
        id: `spld-p1-${key}`,
        activityKey: key,
        category: 'cognition',
        categoryName: '初小 · SpLD 多感官讀寫',
        tone: ({ assembly: 'purple', spotting: 'orange', rhyme: 'teal', stroke: 'blue', triple: 'pink', radical: 'yellow', train: 'purple', semantic: 'green', numberline: 'blue', sentenceTrain: 'orange' })[key] || 'purple',
        icon: activity.icon,
        title: activity.title,
        description: activity.description,
        tag: `P1–P3 · ${activity.focus}`,
        supports: ['1'],
        answerPositionStrategy: ANSWER_POSITION_PATTERNS[key] ? 'irregular-balanced' : null,
        answerPositionPattern: ANSWER_POSITION_PATTERNS[key] || null,
        rounds: activity.rounds
      }));
    },
    openActivity(key) {
      if (!activities[key]) return;
      closeLab();
      document.body.insertAdjacentHTML('beforeend', labShell(''));
      startActivity(key);
    },
    launcherMarkup() {
      return '<section class="spld-primary-lab-launch" aria-label="初小讀寫實驗室"><div><strong>🧩 初小讀寫實驗室</strong><small>部件拼盤與形近字捉迷藏：每項只需約 2–3 分鐘，可慢讀、看提示或隨時休息。</small></div><button type="button" class="spld-p1-lab-open">開啟初小練習</button></section>';
    },
    bindLauncher() {
      document.querySelector('.spld-p1-lab-open')?.addEventListener('click', openMenu);
    }
  };

  injectStyles();
  const advancedStyle = document.createElement('style');
  advancedStyle.textContent = `.spld-sound-scene,.spld-triple-scene{display:flex;flex-direction:column;align-items:center;gap:9px;border-radius:17px;background:#fff;padding:19px;text-align:center}.spld-sound-scene>span{font-size:42px}.spld-sound-scene strong{font-size:23px;color:#3c3261}.spld-sound-scene button,.spld-triple-listen{border:0;border-radius:11px;background:#4f9f91;color:#fff;padding:10px 14px;font-weight:850;cursor:pointer}.spld-sound-scene small,.spld-triple-scene small{padding:5px 9px;border-radius:99px;background:#edf8f5;color:#3e685f}.spld-triple-picture{font-size:64px;line-height:1}.spld-triple-listen{background:#b06694}.spld-stroke-target{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:#fff;box-shadow:0 5px 14px rgba(78,54,147,.08)}.spld-stroke-target span{font-weight:750;color:#6d6385}.spld-stroke-target strong{font-size:42px;color:#3279a3}.spld-stroke-target small{margin-left:auto;color:#5d7c94}.spld-stroke-slots{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:17px 0}.spld-stroke-slot{width:92px;min-height:76px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px dashed #8bbfd6;border-radius:14px;background:#fff;color:#4a7890}.spld-stroke-slot b{font-size:12px}.spld-stroke-slot strong{font-size:24px}.spld-stroke-slot.filled{border-style:solid;background:#edf9fe}.spld-stroke-options{display:flex;justify-content:center;gap:9px;flex-wrap:wrap}.spld-stroke-option{min-width:76px;min-height:52px;border:2px solid #a9d1e2;border-radius:12px;background:#fff;color:#2f7799;font-size:17px;font-weight:850;cursor:pointer}.spld-stroke-option.used{opacity:.42}@media (max-width:620px){.spld-stroke-slot{width:68px;min-height:67px}.spld-stroke-option{min-width:64px}.spld-sound-scene strong{font-size:20px}}`;
  document.head.appendChild(advancedStyle);
  const touchTargetStyle = document.createElement('style');
  touchTargetStyle.textContent = `.spld-p1-lab .spld-lab-close{width:44px;height:44px}.spld-p1-lab .spld-lab-heading{padding-right:52px}.spld-p1-lab .spld-lab-tools button,.spld-p1-lab .spld-lab-result-actions button,.spld-p1-lab .spld-sound-scene button,.spld-p1-lab .spld-triple-listen{min-width:40px;min-height:44px;display:inline-flex;align-items:center;justify-content:center}`;
  document.head.appendChild(touchTargetStyle);
  const radicalStyle = document.createElement('style');
  radicalStyle.textContent = `.spld-radical-target{display:flex;align-items:center;justify-content:center;gap:12px;padding:16px;border-radius:17px;background:#fff}.spld-radical-target>span{font-size:45px}.spld-radical-target strong{font-size:46px;color:#438654}.spld-radical-target small{padding:6px 9px;border-radius:99px;background:#eef8ee;color:#39734a}.spld-radical-baskets{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}.spld-radical-basket{min-height:128px;border:2px solid #abd5ae;border-radius:17px;background:#f7fff6;color:#2d7041;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}.spld-radical-basket>span{font-size:28px}.spld-radical-basket strong{font-size:34px}.spld-radical-basket small{font-size:12px;font-weight:750}@media (max-width:620px){.spld-radical-baskets{grid-template-columns:1fr}.spld-radical-basket{min-height:86px;flex-direction:row}.spld-radical-target{gap:8px}.spld-radical-target strong{font-size:39px}}`;
  document.head.appendChild(radicalStyle);
})();
