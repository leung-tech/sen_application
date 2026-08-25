/* Design reminder: low-pressure, non-diagnostic cross-category practice; fictional contexts, accessible dialog controls, no personal data collection. */
(() => {
  'use strict';

  const STAGES = { lower: { label: '初小 · P1–P3' }, upper: { label: '高小 · P4–P6' }, junior: { label: '初中 · S1–S3' }, senior: { label: '高中 · S4–S6' } };
  const financeGuides = {
    lower: { cue: '在家中、課室或小食部和熟悉成人一起練習時', support: '可以指一指、請成人讀題或慢慢再看。' },
    upper: { cue: '在小食部、校園活動或家人一起購物時', support: '可以先看提示，再和教師或照顧者討論。' },
    junior: { cue: '在社區購物、班會活動或網上看到付款提醒時', support: '可以先停一停、核對資料，再找可信任成人商量。' },
    senior: { cue: '在實習、出行、社區服務或日常消費安排中', support: '可以先比較需要、核對收據，再和教師、照顧者或相關負責人討論。' }
  };
  const bodyGuides = {
    lower: { cue: '在家中、課室或小組活動中和熟悉成人一起練習時', support: '可以指一指身體訊號卡，或說「我有點不舒服」。' },
    upper: { cue: '在校園、活動日或外出前後感到需要停一停時', support: '可以先找老師或照顧者，慢慢說出自己想要的協助。' },
    junior: { cue: '在課堂、社區活動或出行安排中留意自己狀態時', support: '可以先到安全位置，告訴已指定成人，再一起決定下一步。' },
    senior: { cue: '在實習、出行或社區服務中管理休息與求助安排時', support: '可以及早告訴負責人，使用已商量好的休息或求助方式。' }
  };

  const PACKS = {
    finance: {
      phase: 'P2', icon: '🪙', tone: 'yellow', title: '日常金錢與消費決策', short: '需要與想要、付款核對、收據與安全界線', category: '生活技能／消費素養', contextLabel: '虛構消費情境',
      intro: '這是虛構日常消費情境練習，所有金額和物品均為示例。活動不會要求你輸入銀行、信用卡、八達通、帳戶、密碼、電話或任何付款資料，也不提供投資、信貸、借貸或賭博建議。',
      safetyBullets: ['每一題都是虛構情境，不需要分享私人金錢、帳戶或付款資料。', '可選朗讀、看提示、暫停、重試或隨時離開。', '涉及真實付款、帳戶、借貸、疑似詐騙或不安全事情，請先找可信任成人。'],
      readyStatus: '現在是準備時間，沒有倒數或個人理財評分。', playStatus: '可直接點選；鍵盤可按 1、2 或 3。這不是個人理財評分。', finishTitle: '已查看八個虛構消費情境', finishMessage: '你可以帶走一個小步：先分清需要與想要、付款前核對、保留收據、看清定期收費，或在不確定時找可信任成人。這不是財務能力、信用或價值評分。',
      badges: ['虛構金額', '不收集付款資料'], stageGuides: financeGuides,
      cards: [
        ['需要與想要', '你有 20 枚練習代幣，要先選一樣日常需要的物品。', '先選需要的物品，再考慮想要的物品', ['把所有代幣即時花在抽獎', '因為想要就借別人的帳戶'], '把「需要」和「想要」分開，可以幫助慢慢決定。'],
        ['付款前核對', '牌價寫著「練習價 12 代幣」，你準備付款。', '先核對物品、練習價和找續是否相符', ['不看價錢直接付款', '把別人的付款卡資料輸入'], '付款前停一停核對，是照顧自己的習慣。'],
        ['找續與收好', '你用 20 枚練習代幣買 12 代幣的物品。', '慢慢核對找續，再把練習代幣收好', ['不看找續便立刻離開', '把找續交給陌生人保管'], '練習金額只用來理解找續概念，不需要快。'],
        ['八達通餘額', '出行前你不知道練習八達通餘額是否足夠。', '先查看餘額；不清楚時請可信任成人一起核對', ['隨便借用別人的八達通', '把八達通號碼公開給陌生人'], '出行前核對餘額，可以減少臨時猜測。'],
        ['保留收據', '你買了一件物品後，收到一張收據。', '先保留收據，方便和成人一起核對', ['立刻把收據丟到地上', '把收據上的資料公開傳到群組'], '收據可用來核對物品和練習價。'],
        ['簡單預算', '你為一星期活動準備 50 枚虛構代幣。', '先列出必需安排，再決定其餘可用代幣', ['把代幣一次過花完', '承諾一定能花得剛剛好'], '預算是預先想一想，不是保證或比較。'],
        ['訂閱提醒', '一個服務寫著「試用後每月自動收取練習代幣」。', '先看清楚提醒和取消方法，再和成人討論是否需要', ['不看條款便立即同意', '用別人的帳戶自行開通'], '定期收費前可以先看清楚和請人一起核對。'],
        ['帳戶安全界線', '有人說「借我你的帳戶或付款工具，我幫你買東西」。', '不要借出帳戶或付款工具；找可信任成人商量', ['把帳戶和密碼交給對方', '替不認識的人收取或轉交付款'], '帳戶和付款工具有重要安全界線；不確定時找成人。']
      ]
    },
    body: {
      phase: 'P2', icon: '🌿', tone: 'teal', title: '身體訊號、休息與日常健康溝通', short: '留意狀態、說出需要、休息與找成人協助', category: '生活技能／日常健康溝通', contextLabel: '虛構日常健康溝通情境',
      intro: '這是虛構日常身體訊號與溝通情境練習。活動不會要求你分享任何真實症狀、病歷、用藥、聯絡或健康資料；不作病症診斷，也不提供服藥或治療指示。',
      safetyBullets: ['每一題都是虛構情境，不需要分享真實身體、病歷、用藥或健康資料。', '可選朗讀、看提示、暫停、重試或隨時離開；休息不是失敗。', '若有急切安全疑慮、突然無法保持安全或需要立即協助，請立刻找可信任成人，並依所在場所緊急程序由成人協助聯絡緊急服務。'],
      readyStatus: '現在是準備時間，沒有倒數、診斷或健康表現評分。', playStatus: '可直接點選；鍵盤可按 1、2 或 3。這不是健康、體力或能力評分。', finishTitle: '已查看八個虛構日常健康溝通情境', finishMessage: '你可以帶走一個小步：留意身體訊號、用簡單句說出需要、在安全位置休息、及早找可信任成人協助。這不是病症診斷或健康表現評分。',
      badges: ['日常溝通', '不作診斷', '找成人協助'], stageGuides: bodyGuides,
      cards: [
        ['留意身體訊號', '在虛構課堂中，你覺得口乾、很累或有點不舒服，不確定怎樣開始。', '先用簡單句告訴可信任成人「我有點不舒服／想先休息」', ['假裝沒有感覺並一直硬撐', '自行在網上判斷自己患了甚麼'], '先留意、再用簡單句說出需要，不必自己猜病症。'],
        ['先停一停、補充水分', '活動後你有點口乾和累；場所容許喝水和休息。', '先停在安全地方，告訴成人並按成人安排喝水或休息', ['不告訴任何人，繼續勉強活動', '拿不明飲品或成人物品自行處理'], '可先停在安全地方，再讓成人知道你的需要。'],
        ['說出不舒服', '在課堂中你感到不舒服，想請人協助你決定下一步。', '說「老師／照顧者，我感到不舒服，想請你協助我看看下一步」', ['只留下一句模糊訊息後獨自離開', '忍到很難受才說'], '清楚說出感受和想要的協助，成人才較容易跟進。'],
        ['找合適成人', '在學校或活動場所，你需要有人協助你停一停。', '找當值老師、照顧者、校護或已指定的負責成人', ['跟不認識的人到偏僻地方', '自己離開場所而不通知'], '先找已知和可信任的成人，保持在安全位置。'],
        ['藥物由成人管理', '有人把不認識的藥物交給你，說「你自己試一下」。', '不自行服用或分享，立即交由可信任成人按既有安排處理', ['根據同學說法自行試用', '替別人保管並傳給其他人'], '不認識的藥物不由學生自行處理，應交給成人。'],
        ['活動後調節', '在虛構體育或外出活動後，你覺得累，想調整下一步。', '先到安全地方坐下或休息，告訴成人並按成人安排調整下一步', ['和同學比拼誰能撐得更久', '突然離隊而不告訴人'], '休息和告訴成人是負責任的調節，不是比賽。'],
        ['晚間準備與休息', '你連續幾天覺得日間精神不足，想改善晚上準備。', '和照顧者一起看晚間準備與休息安排，記下明天要帶的物品', ['以不明產品強迫自己不睡', '在群組公開自己的私人健康細節'], '可和照顧者一起整理可行的日常安排，不需要獨自處理。'],
        ['實習日能量分配', '在虛構實習日，你想預先安排休息和求助方式。', '出發前與負責人約好可休息或求助的方式，感到需要時及早說出來', ['答應不論怎樣也不休息', '獨自使用不熟悉的健康產品'], '及早說出需要和約好求助方式，可讓安排更清楚。']
      ]
    },
    study: {
      phase: 'P2', icon: '🧰', tone: 'blue', title: '學習工具與考試調適自我管理', short: '讀題、清單、輔具、休息、核對與學校確認', category: '認知學習／自我管理', contextLabel: '虛構學習工具與調適情境', stages: ['upper', 'junior', 'senior'],
      intro: '這是虛構的學習工具與自我管理情境練習。活動不代表公開試規則，不保證獲得任何調適、輔具或評核安排；不同學習和評核安排應與學校按實際情況確認。',
      safetyBullets: ['每一題都是虛構學習情境，不需要分享真實成績、診斷、學校帳戶或個人資料。', '可選朗讀、看提示、暫停、重試或隨時離開；完成速度和分數不是能力判斷。', '如不清楚指示、可用輔具、休息方式或評核安排，請先與教師、照顧者或學校相關人員確認。'],
      readyStatus: '現在是準備時間，沒有倒數、公開試規則判定或能力評分。', playStatus: '可直接點選；鍵盤可按 1、2 或 3。這不是成績、資格或能力評分。', finishTitle: '已查看八個虛構學習工具與自我管理情境', finishMessage: '你可以帶走一個小步：分段讀題、使用清單、澄清指示、按已商量方式休息、交卷前核對和考後反思。不同學習與評核安排，請與學校確認。',
      badges: ['學習工具', '不保證調適', '與學校確認'], stageGuides: {
        upper: { cue: '在高小課堂、功課或校內練習中使用學習工具時', support: '可以請成人讀題、一起把工作分成小步，或先看提示。' },
        junior: { cue: '在初中測驗、專題或溫習安排中管理下一步時', support: '可以先重讀指示、使用清單，再向教師確認不清楚的安排。' },
        senior: { cue: '在高中評核、溫習或實習學習安排中使用已商量的策略時', support: '可以及早向教師或相關負責人確認可用工具、休息和下一步。' }
      },
      cards: [
        ['讀題前分段', '你看到一條較長的虛構題目，第一眼不確定由哪裡開始。', '先圈出關鍵詞，把問題分成小步再開始', ['一看到長題就隨便猜答案', '因為不明白便不告訴任何人'], '先分段和找關鍵詞，可令下一步更清楚。'],
        ['視覺清單', '明天有一項校內練習，你想記住準備物品和次序。', '用校方可用的視覺清單寫下物品和小步驟', ['把所有事情只靠最後一刻記憶', '直接抄同學的私人帳戶或檔案'], '清單可以把大任務拆成看得見的小步。'],
        ['重讀與求澄清', '你重讀虛構工作紙後，仍不清楚一個指示的意思。', '先重讀，再請教師用不同方式說明或給一個例子', ['假裝明白並胡亂完成', '把不明白的部分公開嘲笑'], '澄清指示是學習策略，不是失敗。'],
        ['選用已商量的輔具', '你發現自己較容易在有清楚閱讀支援時開始工作。', '按已商量的需要使用校方可用工具，或先向教師確認', ['自行承諾每個評核一定可以使用任何工具', '把別人的輔具拿走而不詢問'], '可用工具和安排由學校按實際情況確認。'],
        ['短暫休息後回來', '你做完一個小部分後覺得專注力下降，想停一停。', '按已同意的方式短暫休息，再回來完成下一小步', ['不通知任何人便離開場所', '逼自己不停做直到很不舒服'], '短暫休息可以是已商量的學習安排之一。'],
        ['交卷前核對', '在虛構練習結束前，你還有幾分鐘可以看看工作。', '按清單逐題核對有沒有漏答、名字或需要補充的地方', ['急著交出而完全不看', '把一次漏答當成自己沒有能力'], '最後核對是照顧作品的小步，不是追求完美。'],
        ['考前用品與安排', '明天有一項校內評核或練習，你不確定要帶甚麼和何時到達。', '早一日按學校資訊準備已知用品，不確定時向教師核實', ['相信群組未核實的消息便改變安排', '承諾所有評核都有同一套規則'], '實際用品和安排要以學校提供的資訊為準。'],
        ['考後反思與確認', '完成一項虛構評核後，你想為下一次學習準備。', '記下一項有效工具，並列出一項下次想問教師或學校確認的事', ['把一次結果當作永久能力結論', '不理會任何可改善的小步'], '反思可以聚焦工具和下一步，而不是標籤自己。']
      ]
    },
    community: {
      phase: 'P3', icon: '🏘️', tone: 'green', title: '家庭與社區責任小任務', short: '協商分工、環保、禮儀與安全求助', category: '生活技能／家庭與社區參與', contextLabel: '虛構家庭與社區情境', stages: ['lower', 'upper', 'junior'],
      intro: '這是虛構家庭與社區合作情境練習。活動不會指定哪種性別或身分應做哪些家務，也不要求你照顧任何人、動物或植物；每個人可按當日情況、能力和意願，與可信任成人或同伴協商可做的小步。',
      safetyBullets: ['每一題都是虛構情境，不需要分享真實住址、鄰居資料、聯絡方式、相片或家庭安排。', '分工、回收或社區參與都可協商、可求助、可暫停；不把責任推給任何一種性別、年齡或身分。', '真實危險、受傷、走失、嚴重衝突或不安全情況，請停止活動、保持安全距離，找可信任成人按所在場所程序協助。'],
      readyStatus: '現在是準備時間，沒有倒數、責任排名或品格評分。', playStatus: '可直接點選；鍵盤可按 1、2 或 3。這不是勤勞、品格或能力評分。', finishTitle: '已查看八個虛構家庭與社區合作情境', finishMessage: '你可以帶走一個小步：先協商、看清標籤、尊重他人空間、借用前先問、保持安全距離及在不確定時找可信任成人。責任可以協商，不需要一個人承擔。',
      badges: ['協商分工', '不性別化', '安全求助'], stageGuides: {
        lower: { cue: '在家中、課室或熟悉社區活動中和成人一起練習時', support: '可以看圖卡、指一指，或請成人陪你選下一步。' },
        upper: { cue: '在小組、家庭或社區活動中練習合作安排時', support: '可以先說出自己可做或需要幫忙的地方，再一起協商。' },
        junior: { cue: '在班會、家庭或社區服務預演中一起安排小任務時', support: '可以提出選擇、確認界線；真實不安全事情先找成人處理。' }
      },
      cards: [
        ['協商分工', '在虛構家庭或小組活動前，大家想把簡單任務分開做。', '一起看看可做選項，按每人當日情況協商誰做哪一小步', ['因為某人的性別指定他必須做家務', '要求同一人包辦所有事情'], '分工可以協商，不由性別或身分決定。'],
        ['垃圾分類', '在虛構活動後，你看到有清楚標籤的不同收集箱。', '先看容器標籤，按提示把物品放入相應收集箱；不清楚就問成人', ['不看分類便全部混在一起', '把危險或不明物品自行拆開'], '先看清標籤；不清楚或不安全的物品可以找成人。'],
        ['鄰里音量', '在虛構社區場所，你發現聲音可能影響附近的人。', '降低音量或關好聲源，尊重共用空間的安靜需要', ['故意用更大聲回應', '把責任全推給某一個人'], '共用空間可互相照顧，不需要責怪任何人。'],
        ['排隊與輪候', '在虛構社區活動的服務台前，有人正在排隊。', '站在指示線後輪候，保持合適距離並按次序等候', ['從隊伍前面衝進去', '緊貼前面的人催促'], '輪候時保持距離，讓每個人都有空間。'],
        ['借用物品', '你想借用一件虛構共用物品完成小任務。', '先問可否借用，說清楚何時歸還，並按約定愛惜使用', ['未經同意便拿走', '借了後故意不歸還'], '先問和按約歸還，可以照顧彼此的界線。'],
        ['回收與再用', '在虛構工作坊後，有些乾淨材料可能仍可使用。', '先看看能否再用，或按標籤放到合適回收位置', ['把所有材料立刻丟掉', '把不確定的物品隨便留在通道'], '再用或回收前可以先看清楚標籤和安全位置。'],
        ['寵物與小動物安全', '在虛構社區中，你看到別人帶著一隻小動物。', '先不自行觸碰，問照顧者或主人是否安全，再保持合適距離', ['未問便抱起或追趕', '餵不認識的動物食物'], '看見動物不等於要照顧牠；先問和保持安全距離。'],
        ['社區求助', '在虛構社區場所，你發現一處地方讓你覺得不安全或需要協助。', '保持安全距離，找當值人員或可信任成人，清楚說出你看到的情況', ['獨自走近危險地方查看', '把情況拍下後公開轉發'], '不安全時先保持距離和找成人，不必自己處理。']
      ]
    }
  };

  PACKS.finance.answerPositionPatterns = { lower: [2, 0, 1, 2, 1, 0, 2, 0], upper: [1, 0, 2, 1, 2, 0, 1, 0] };
  PACKS.body.answerPositionPatterns = { lower: [1, 2, 0, 1, 0, 2, 1, 0], upper: [0, 2, 1, 0, 1, 2, 0, 2] };
  PACKS.study.answerPositionPatterns = { upper: [2, 0, 1, 2, 1, 0, 2, 0] };
  PACKS.community.answerPositionPatterns = { lower: [0, 2, 1, 0, 1, 2, 0, 2], upper: [1, 2, 0, 1, 0, 2, 1, 0] };

  let host = null; let currentKey = null; let currentStage = 'lower'; let index = 0; let speechOn = false; let restoreFocus = null;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const pack = () => PACKS[currentKey];
  const guide = () => pack()?.stageGuides?.[currentStage] || { cue: '', support: '' };
  const speak = (text) => { if (!speechOn || !window.speechSynthesis || !text) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(String(text)); utterance.lang = 'zh-HK'; utterance.rate = .78; window.speechSynthesis.speak(utterance); };
  const roundsFor = (key, stage = 'lower') => (PACKS[key]?.cards || []).map(([title, scene, answer, distractors, hint], position) => { const choices = [...distractors]; const pattern = PACKS[key]?.answerPositionPatterns?.[stage]; const target = Number.isInteger(pattern?.[position % pattern.length]) ? pattern[position % pattern.length] : position % 3; choices.splice(target, 0, answer); const stageGuide = PACKS[key]?.stageGuides?.[stage] || PACKS[key]?.stageGuides?.lower || {}; return { id: `practical-${key}-${stage}-${position + 1}`, title, scene: `${stageGuide.cue}，${scene}`, prompt: '哪一個下一步較安全、清楚而可行？', choices, answer, hint: `${hint} ${stageGuide.support}`.trim() }; });
  const say = (text, kind = '') => { const node = $('#practicalStatus', host); if (node) { node.textContent = text; node.className = `practical-status ${kind}`; } };
  const close = () => { window.speechSynthesis?.cancel(); document.removeEventListener('keydown', onKey, true); host?.remove(); host = null; if (restoreFocus?.isConnected) requestAnimationFrame(() => restoreFocus.focus()); };

  function styles() {
    if (document.getElementById('practicalLiteracyStyles')) return;
    const style = document.createElement('style'); style.id = 'practicalLiteracyStyles';
    style.textContent = `.practical-host{position:fixed;inset:0;z-index:1211;display:grid;place-items:center;padding:16px;overflow:auto;background:rgba(25,38,58,.8);color:#1e2d42}.practical-dialog{width:min(940px,100%);max-height:94vh;overflow:auto;padding:clamp(18px,3vw,32px);border:3px solid #e0b760;border-radius:24px;background:#fffdf7;box-shadow:0 26px 75px rgba(0,0,0,.42)}.practical-head{display:flex;justify-content:space-between;gap:16px}.practical-head span{font-weight:950;font-size:12px;letter-spacing:.08em;color:#785211}.practical-head h2{margin:4px 0;font-size:clamp(25px,4vw,37px);line-height:1.18}.practical-head p{margin:0;color:#5e5a4b;line-height:1.55}.practical-close{width:48px;height:48px;border:2px solid #cfa34b;border-radius:50%;background:#fff1ca;color:#62430d;font-size:28px}.practical-ready,.practical-scene{margin-top:18px;padding:18px;border:2px solid #e4c785;border-radius:18px;background:#fff8e8;line-height:1.62}.practical-ready strong{font-size:19px}.practical-ready ul{margin:8px 0 0;padding-left:21px}.practical-progress{display:grid;gap:7px;margin-top:18px;color:#6d571e;font-weight:900}.practical-progress i{display:block;height:11px;border-radius:99px;overflow:hidden;background:#f3dfaf}.practical-progress b{display:block;height:100%;border-radius:99px;background:#d8a742;transition:width .2s ease}.practical-scene small{font-weight:950;color:#835d11}.practical-scene h3{margin:3px 0;font-size:23px}.practical-scene p{margin:0;color:#4a4b42}.practical-question{margin:16px 0 0;font-size:clamp(20px,2.6vw,27px);font-weight:950;line-height:1.42}.practical-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}.practical-choice{display:grid;align-content:start;gap:10px;min-height:146px;padding:16px;border:3px solid #d7b86d;border-radius:17px;background:#fff;color:#473913;text-align:left;font:inherit;font-weight:850;line-height:1.5}.practical-choice:hover{border-color:#b9841c;background:#fff6df}.practical-choice b{display:grid;place-items:center;width:31px;height:31px;border-radius:50%;background:#fff0bd;color:#72500d}.practical-tools,.practical-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}.practical-actions{justify-content:center}.practical-tools button,.practical-actions button{min-height:47px;padding:0 15px;border:2px solid #d4b465;border-radius:12px;background:#fff7e8;color:#5e4310;font:inherit;font-weight:900}.practical-actions .main{border-color:#a47e25;background:#e6bd5c;color:#3e2b00}.practical-status{min-height:32px;margin-top:15px;color:#6d571e;text-align:center;font-weight:850;line-height:1.5}.practical-status.ok{color:#1c745b}.practical-status.try{color:#98600c}.practical-status.pause{color:#6d571e}.practical-finish{text-align:center;margin-top:20px;padding:24px;border:2px solid #e2c486;border-radius:20px;background:#fffaf0;line-height:1.65}.practical-finish>span{display:grid;place-items:center;width:68px;height:68px;margin:auto;border-radius:50%;background:#e9c46d;color:#4e3705;font-size:35px;font-weight:950}.practical-host button:focus-visible{outline:5px solid #64b3d8;outline-offset:4px}@media(max-width:640px){.practical-dialog{padding:18px}.practical-choices{grid-template-columns:1fr}.practical-choice{min-height:74px}.practical-tools,.practical-actions{flex-direction:column}.practical-tools button,.practical-actions button{width:100%}}@media(prefers-reduced-motion:reduce){.practical-host *{animation:none!important;transition:none!important}}`;
    document.head.appendChild(style);
  }
  const header = () => `<header class="practical-head"><div><span>${esc(STAGES[currentStage].label)} · 跨類別 ${esc(pack().phase)} 題材包</span><h2 id="practicalTitle">${esc(pack().icon)} ${esc(pack().title)}</h2><p>${esc(pack().short)}</p></div><button class="practical-close" type="button" aria-label="關閉${esc(pack().title)}">×</button></header>`;
  const tools = () => `<div class="practical-tools"><button type="button" data-practical="read">${speechOn ? '🔊 朗讀：開' : '🔇 朗讀：關'}</button><button type="button" data-practical="hint">💡 看提示</button><button type="button" data-practical="pause">⏸ 先停一停</button></div>`;
  function shell(content) { host.innerHTML = `<section class="practical-dialog" role="dialog" aria-modal="true" aria-labelledby="practicalTitle">${content}</section>`; $('.practical-close', host)?.addEventListener('click', close); }
  function bindTools(round) { $$('[data-practical]', host).forEach((button) => button.addEventListener('click', () => { if (button.dataset.practical === 'read') { speechOn = !speechOn; button.textContent = speechOn ? '🔊 朗讀：開' : '🔇 朗讀：關'; if (speechOn) speak(round ? `${round.title}。${round.scene}。${round.prompt}` : pack().intro); } if (button.dataset.practical === 'hint') say(`提示：${round?.hint || guide().support}`); if (button.dataset.practical === 'pause') say('已停在目前情境。可以慢慢看、按關閉離開，或準備好後再繼續。', 'pause'); })); }
  function ready() { shell(`${header()}<main class="practical-ready"><strong>開始前先知道</strong><p>${esc(pack().intro)}</p><ul>${pack().safetyBullets.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><div class="practical-actions"><button class="main" type="button" data-practical-start="true">✓ 我準備好了</button></div></main><p id="practicalStatus" class="practical-status" role="status" aria-live="polite">${esc(pack().readyStatus)}</p>${tools()}`); $('[data-practical-start]', host)?.addEventListener('click', play); bindTools(); }
  function play() { const rounds = roundsFor(currentKey, currentStage); const round = rounds[index]; shell(`${header()}<div class="practical-progress"><i><b style="width:${(index / rounds.length) * 100}%"></b></i><span>情境 ${index + 1} / ${rounds.length} · 可慢慢完成</span></div><main><article class="practical-scene"><small>${esc(pack().contextLabel)}</small><h3>${esc(round.title)}</h3><p>${esc(round.scene)}</p></article><p class="practical-question">${esc(round.prompt)}</p><div class="practical-choices" aria-label="可選下一步">${round.choices.map((choice, choiceIndex) => `<button type="button" class="practical-choice" data-practical-choice="${choiceIndex}" aria-label="選項 ${choiceIndex + 1}：${esc(choice)}"><b aria-hidden="true">${choiceIndex + 1}</b><span>${esc(choice)}</span></button>`).join('')}</div></main><p id="practicalStatus" class="practical-status" role="status" aria-live="polite">${esc(pack().playStatus)}</p>${tools()}`); $$('[data-practical-choice]', host).forEach((button) => button.addEventListener('click', () => answer(Number(button.dataset.practicalChoice), round))); bindTools(round); requestAnimationFrame(() => $('[data-practical-choice]', host)?.focus()); }
  function answer(choiceIndex, round) { if (round.choices[choiceIndex] !== round.answer) { say(`↗ 可以再比較：${round.hint}`, 'try'); return; } say(`✓ ${round.hint}`, 'ok'); window.setTimeout(() => { index += 1; index < roundsFor(currentKey, currentStage).length ? play() : finish(); }, window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 80 : 420); }
  function finish() { shell(`${header()}<main class="practical-finish"><span>✓</span><h3>${esc(pack().finishTitle)}</h3><p>${esc(pack().finishMessage)}</p><div class="practical-actions"><button type="button" data-practical-replay="true">↺ 再看一次</button><button class="main" type="button" data-practical-close="true">← 返回活動庫</button></div></main><p id="practicalStatus" class="practical-status ok" role="status" aria-live="polite">可以先休息，或選另一個活動。</p>${tools()}`); $('[data-practical-replay]', host)?.addEventListener('click', () => { index = 0; ready(); }); $('[data-practical-close]', host)?.addEventListener('click', close); bindTools(); requestAnimationFrame(() => $('[data-practical-close]', host)?.focus()); }
  function onKey(event) { if (!host) return; if (event.key === 'Escape') { event.preventDefault(); close(); } else if (/^[1-3]$/.test(event.key) && $('[data-practical-choice]', host)) { event.preventDefault(); $$('[data-practical-choice]', host)[Number(event.key) - 1]?.click(); } }
  function open(key, options = {}) { if (!PACKS[key]) return; close(); currentKey = key; currentStage = STAGES[options.stage] ? options.stage : 'lower'; index = 0; speechOn = false; restoreFocus = options.trigger || document.activeElement; styles(); host = document.createElement('div'); host.className = 'practical-host'; document.body.appendChild(host); document.addEventListener('keydown', onKey, true); ready(); }
  function activityCards(stage = 'lower') { return Object.entries(PACKS).filter(([, data]) => !data.stages || data.stages.includes(stage)).map(([key, data]) => { const answerPositionPattern = data.answerPositionPatterns?.[stage]; return { id: `practical-${key}-${stage}`, icon: data.icon, title: data.title, description: data.short, tag: `${STAGES[stage]?.label || STAGES.lower.label} · 8 個虛構情境`, tone: data.tone, supports: ['all'], practicalPack: key, phase: data.phase, badges: data.badges, answerPositionStrategy: answerPositionPattern ? 'irregular-balanced' : undefined, answerPositionPattern, rounds: roundsFor(key, stage) }; }); }
  window.PRACTICAL_LITERACY_LAB = { activityCards, open, roundsFor, packs: () => Object.keys(PACKS), packInfo: (key) => PACKS[key] || null, availableStages: (key) => PACKS[key]?.stages || Object.keys(STAGES) };
})();
