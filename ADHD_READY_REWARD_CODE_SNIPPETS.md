# ADHD 準備頁與專屬獎勵程式碼片段

本文件摘錄自 `modules/adhd/adhd-graded-lab.js`，方便日後以 Gemini 修改文字、音階或動畫圖示。所有效果均受「回饋聲」及「視覺獎勵」開關控制；關閉後，畫面仍保留文字回饋與無障礙狀態訊息。

## 1. 教師帶讀準備頁

每次由九張遊戲卡選擇活動時，`startGame()` 不會立即計時或出題，而是先顯示三步規則及明確開始按鈕。

```js
function startGame(game) {
  clearTimers();
  renderReadyScreen(game);
}

function renderReadyScreen(game) {
  const info = GAME_INFO[game];
  const prep = GAME_PREP[game];
  state = { game, effortStars: 0, preparing: true, keyHandler: null };

  shell(`${top(`${info.title} · 準備頁`,
    '請先由教師帶讀規則。未按「我準備好了」前不會開始計時、移動或出題。',
    `${grade().label} · 一起準備`
  )}
  <section class="graded-ready-card">
    <div class="graded-ready-icon">${prep.icon}</div>
    <div class="graded-ready-copy">
      <p class="graded-ready-kicker">先一起讀三步</p>
      <h3>準備好了才開始</h3>
      <ol>${prep.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
    </div>
  </section>
  <div class="graded-ready-actions">
    <button id="gradedReadyBack" type="button">← 換一項遊戲</button>
    <button id="gradedReadyStart" type="button">✓ 我準備好了，開始第一回合</button>
  </div>`);

  host.querySelector('#gradedReadyBack')?.addEventListener('click', renderMenu);
  host.querySelector('#gradedReadyStart')?.addEventListener('click', () => beginActivity(game));
}
```

> 要改某個遊戲的教師帶讀內容，修改 `GAME_PREP` 中該遊戲的三條 `steps` 即可。

## 2. 規則偵探卡片：規則發現解鎖效果

當學生連續答對並遇到規則切換時，遊戲使用 `switch-discovery`：播放四音解鎖音階、顯示鎖匙與卡片光效，並亮起兩顆努力星。

```js
if (state.successStreak >= state.switchTrigger) {
  const rules = stage === 'lower' ? ['color', 'shape'] : ['color', 'shape', 'count'];
  state.rule = rules[(rules.indexOf(state.rule) + 1) % rules.length];
  state.successStreak = 0;
  setFeedback(
    '✓ 規則偵探很細心。下一張規則已經改變；重新從回饋找線索。',
    'ok',
    'switch-discovery'
  );
} else {
  setFeedback('✓ 配對正確。記住這次的線索，再觀察下一張。', 'ok', 'switch-match');
}
```

## 3. 綠燈停手：啟動與停手的不同回饋

綠色時正確回應使用 `nogo-go`；紅色時成功不按，則使用較明顯的 `nogo-stop` 盾牌動畫與三音肯定，表揚「停得住」而不只表揚反應速度。

```js
const rewardKind = pressed ? 'nogo-go' : 'nogo-stop';
setFeedback(
  correct
    ? (pressed ? '✓ 做得好，綠色時才按。' : '✓ 做得好，紅色時你停住了。')
    : (pressed ? '↗ 紅色時先停一停；下一張再試。' : '↗ 綠色時可以按；下一張慢慢看。'),
  correct ? 'ok' : 'try',
  rewardKind
);
```

## 4. 音階與視覺圖示設定

`rewardVisual()` 決定動畫圖示，`playRewardSound()` 決定音高。若需調整刺激程度，可刪減圖示數量、把音量由 `0.028` 調低，或讓學生使用畫面上的開關關閉其中一種效果。

```js
const visuals = {
  'switch-discovery': ['🔓', '🗝️', '🃏', '✨', '🌟'],
  'switch-match': ['🧩', '✨', '🔎'],
  'nogo-go': ['🟢', '🚀', '✨'],
  'nogo-stop': ['🛡️', '🛑', '⭐', '💫'],
};

const notes = {
  'switch-discovery': [392, 523, 659, 784],
  'switch-match': [440, 554],
  'nogo-go': [523, 659],
  'nogo-stop': [349, 440, 523],
};
```
