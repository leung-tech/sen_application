# P0 發布阻礙：修復程式碼與實作方案

**適用版本：** `3424750`  
**用途：** 將 `EDGE_CASE_RISK_ASSESSMENT_20260825.md` 的 P0 項目轉化為可實作工作。程式碼範例是建議基線；必須接入現有靜態模組並完成對應驗收，才可標示為已關閉。

> **重要界線：** 螢幕閱讀器實測、危機支援流程與資產授權均不能只靠 JavaScript 完成。程式可提供入口、提示與紀錄；學校、內容專家及權利人仍須作正式簽核。

## 實作順序

| 次序 | P0 項目 | 建議交付物 | 關閉條件 |
| --- | --- | --- | --- |
| 1 | E-06、A-04、A-05 | 共用可操作選擇器、減少動態狀態與讀屏拖放替代 | 每一類互動可用鍵盤、觸控及至少一種非拖放路徑完成八關 |
| 2 | R-03 | 共用裝置清除列、課堂摘要清除確認與退出提醒 | 共用平板轉交下一名學生前不再顯示上一節紀錄 |
| 3 | R-01 | 發布版本檔、資產版本參數、無痕冒煙測試及回退記錄 | 正式網址所載 HTML 與所有模組均屬同一發布版本 |
| 4 | R-04 | 可設定的可信任成人支援元件與校方程序 | 每個相關活動顯示正確本校支援資料，且校方已演練流程 |
| 5 | R-06 | 資產登錄冊與 CI／人工發布閘門 | 所有公開資產有來源、授權、修改權與替代檔記錄 |
| 6 | A-01 | 人手讀屏驗收記錄 | NVDA、VoiceOver、TalkBack 代表流程均由真人簽核 |

## 1. E-06、A-04、A-05：單鍵、減少動態與讀屏拖放替代

### 統一狀態模型

建議新增 `assets/js/sen-access-controls.js`，令每個活動只讀取同一份使用者偏好，而非各自猜測是否應啟動掃描、動畫或自動前進。

```js
// assets/js/sen-access-controls.js
(function () {
  const storageKey = 'sen-access-controls-v1';
  const defaults = {
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    scanEnabled: false,
    scanIntervalMs: 1800,
    dwellEnabled: false
  };

  function load() {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
    catch { return { ...defaults }; }
  }

  let state = load();
  function save(next) {
    state = { ...state, ...next };
    localStorage.setItem(storageKey, JSON.stringify(state));
    document.dispatchEvent(new CustomEvent('sen-access-controls-change', { detail: state }));
    return state;
  }

  window.SEN_ACCESS = Object.freeze({ get: () => ({ ...state }), set: save });
}());
```

當 `reducedMotion` 為真時，**不可**只停止掃描動畫；必須改成固定、可逐一聚焦的按鈕。下例把原本掃描控制變成兩種同等路徑。

```js
function renderChoiceBank(options, onChoose) {
  const { reducedMotion, scanEnabled } = window.SEN_ACCESS.get();
  const automatedScan = scanEnabled && !reducedMotion;
  const hint = automatedScan
    ? '光圈會逐項移動；按空白鍵、Enter 或直接按選項。'
    : '使用 Tab 選到選項後按 Enter 或空白鍵；也可直接按選項。';

  host.innerHTML = `
    <p id="choiceHelp">${hint}</p>
    <div class="sen-choice-bank" role="group" aria-describedby="choiceHelp">
      ${options.map((option, index) => `
        <button type="button" class="sen-choice" data-index="${index}"
          aria-label="選項 ${index + 1}：${option.label}">${option.label}</button>`).join('')}
    </div>`;

  const buttons = [...host.querySelectorAll('.sen-choice')];
  let index = 0;
  let timer = null;
  const select = () => onChoose(options[index], index);
  const paint = () => buttons.forEach((button, i) => {
    const current = i === index;
    button.classList.toggle('is-scan-current', automatedScan && current);
    button.setAttribute('aria-current', current ? 'true' : 'false');
  });
  const stop = () => { if (timer) clearInterval(timer); timer = null; };

  buttons.forEach((button, i) => button.addEventListener('click', () => {
    stop(); index = i; select();
  }));
  host.onkeydown = (event) => {
    if (!automatedScan) return;
    if (event.key === 'Enter' || event.code === 'Space') { event.preventDefault(); stop(); select(); }
  };
  if (automatedScan) { paint(); timer = setInterval(() => { index = (index + 1) % buttons.length; paint(); }, Math.max(1500, window.SEN_ACCESS.get().scanIntervalMs)); }
  return stop;
}
```

所有拖放活動應視「點選／鍵盤放置」為第一級互動，而不是後備。每一個可移動物件與落點都要是按鈕，並用 `aria-live` 說出已選內容與位置。

```js
let selectedPiece = null;
function choosePiece(pieceButton) {
  selectedPiece = pieceButton.dataset.piece;
  live.textContent = `已選「${selectedPiece}」。請選擇要放入的位置。`;
  dropTargets[0].focus();
}
function placePiece(targetButton) {
  if (!selectedPiece) { live.textContent = '請先選擇一個部件。'; return; }
  place(selectedPiece, targetButton.dataset.slot);
  live.textContent = `已把「${selectedPiece}」放入${targetButton.dataset.slot}位置。`;
  selectedPiece = null;
}
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  .is-scan-current { outline: 4px solid currentColor; outline-offset: 4px; }
}
```

| 驗收 | 必須結果 |
| --- | --- |
| 減少動態 | 任何掃描題不自動移動，但所有選項可用 Tab／Enter／Space 與觸控完成。 |
| 單鍵 | 掃描開啟時，空白鍵只作一次選擇；連按不會完成兩次或跳兩關。 |
| 讀屏拖放 | VoiceOver／TalkBack 可聽到已選部件、可選位置、已放入位置及完成提示，無需拖曳手勢。 |

## 2. R-03：共用裝置的本機紀錄清除

將「清除」放在課堂摘要與全站頁尾，並用可理解的確認語句。不應只在瀏覽器設定內要求教師清除資料。

```js
// assets/js/sen-shared-device-privacy.js
(function () {
  const keys = ['sen-class-summary-v1', 'sen-access-controls-v1'];
  function clearSharedDeviceData() {
    keys.forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
    document.dispatchEvent(new CustomEvent('sen-shared-device-cleared'));
  }
  window.SEN_SHARED_DEVICE = { clearSharedDeviceData };
}());
```

```html
<section class="sen-shared-device" aria-labelledby="sharedDeviceTitle">
  <h2 id="sharedDeviceTitle">共用裝置完成後</h2>
  <p>如下一位學生會使用此裝置，請清除本節課的本機摘要與偏好設定。</p>
  <button type="button" id="clearSharedDevice">清除本機課堂紀錄</button>
  <p id="clearResult" role="status" aria-live="polite"></p>
</section>
```

```js
document.querySelector('#clearSharedDevice')?.addEventListener('click', () => {
  if (!confirm('確定清除這部裝置上的本節課紀錄嗎？此動作不能復原。')) return;
  window.SEN_SHARED_DEVICE.clearSharedDeviceData();
  document.querySelector('#clearResult').textContent = '已清除本機課堂紀錄；可以安全交給下一位學生。';
});
```

| 驗收 | 必須結果 |
| --- | --- |
| 清除前 | 摘要可見目前一節的完成、提示與重試。 |
| 清除後 | 重新整理、開新分頁及切換活動後均不再顯示先前學生的紀錄。 |
| 共用流程 | 教師能在 30 秒內找到並完成清除；不需閱讀技術文件。 |

## 3. R-01：版本、快取與回退

建立單一發布版本檔，所有本地 CSS／JS 引用從該版本產生 query string。**不要**依賴使用者手動清快取作為修復方式。

```js
// assets/js/release-version.js
window.SEN_RELEASE = Object.freeze({ id: '2026.08.25.1' });
```

```html
<script src="assets/js/release-version.js"></script>
<script>
  const version = encodeURIComponent(window.SEN_RELEASE.id);
  for (const src of ['modules/eight-round-normalizer.js', 'assets/js/sen-app.js']) {
    const script = document.createElement('script');
    script.src = `${src}?v=${version}`;
    script.defer = true;
    document.head.append(script);
  }
</script>
```

加入 `RELEASE_MANIFEST.json`，記錄 commit、發布時間、入口頁、資產版本與回退 commit。發布後必須在無痕、另一台手機網絡及硬重新整理各開啟一次，每一入口在 console 應顯示同一 release id。

```json
{
  "release": "2026.08.25.1",
  "commit": "<填入實際 Git 提交>",
  "rollbackCommit": "<填入上一個已簽核提交>",
  "entrypoints": ["index.html", "spld.html", "adhd.html", "asd.html"]
}
```

## 4. R-04：可信任成人與危機支援

不可在程式內硬編碼學校電話或服務資訊。改用受版本控制但由學校填寫的設定檔，並在沒有資料時採保守的成人支援語句。

```js
// assets/js/sen-support-config.js — 發布前由校方核准
window.SEN_SUPPORT = Object.freeze({
  schoolName: '請由校方填寫',
  trustedAdultLabel: '班主任、社工、輔導人員或你信任的成人',
  helpLocation: '請向校方確認支援地點及安排',
  emergencyInstruction: '如你或他人正有即時危險，請立即通知身旁成人，並依學校的緊急程序求助。'
});
```

```js
function renderAdultSupport(host) {
  const s = window.SEN_SUPPORT;
  host.innerHTML = `<aside class="sen-adult-support" role="note" aria-labelledby="adultSupportTitle">
    <h2 id="adultSupportTitle">需要成人幫手時</h2>
    <p>你可以暫停或離開這個練習，並找${s.trustedAdultLabel}。</p>
    <p>${s.helpLocation}</p><p>${s.emergencyInstruction}</p>
  </aside>`;
}
```

校方必須另行指定值班角色、非上課時間安排、家長通報及緊急程序；網站不應宣稱會即時回應。

## 5. R-06：資產授權發布閘門

新增 `ASSET_REGISTER.csv`（或試算表）並在每次發布前以人工簽核。每一項圖片、字型、音效、插圖、影片、商標及外部程式庫均需一行紀錄。

| asset_id | 路徑／URL | 類型 | 來源 | 授權 | 可修改／公開 | 到期日 | 替代檔 | 核准人 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 示例 | `assets/audio/example.mp3` | 音效 | 供應商名稱 | 授權編號 | 是／否 | 日期 | `assets/audio/fallback.mp3` | 姓名 | 待核准 |

建議在發布腳本加入最小閘門：只要資產登錄冊有空白、`待核准` 或已到期紀錄，即中止發布程序。靜態網站可先用 Node 稽核檔完成，不應把該檢查放在學生端。

```js
// scripts/audit-asset-register.mjs（發布端，不載入至網站）
import fs from 'node:fs';
const rows = fs.readFileSync('ASSET_REGISTER.csv', 'utf8').trim().split(/\r?\n/).slice(1);
const invalid = rows.filter((row) => row.split(',').some((cell) => !cell.trim()) || /待核准|已到期/.test(row));
if (invalid.length) throw new Error(`資產登錄冊仍有 ${invalid.length} 項未通過授權閘門`);
```

## 6. A-01：讀屏真人驗收不能用程式碼取代

以下是可直接放入 `SCREEN_READER_SIGNOFF.md` 的記錄表。每個活動家族、瀏覽器及讀屏組合均要填一行；任何「否」均使相關 P0 保持開啟。

| 日期 | 活動家族 | 組合 | 找到入口 | 聽到題目／進度 | 可完成八關 | 提示／暫停可用 | Escape 焦點可辨 | 結果 | 測試者／覆核者 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | NVDA + Firefox | 是／否 | 是／否 | 是／否 | 是／否 | 是／否 | 通過／失敗 | |
| | | VoiceOver + Safari | 是／否 | 是／否 | 是／否 | 是／否 | 是／否 | 通過／失敗 | |
| | | TalkBack + Chrome | 是／否 | 是／否 | 是／否 | 是／否 | 是／否 | 通過／失敗 | |

## P0 完成定義

只有在下表所有條件同時滿足時，才可把 P0 從「開啟」改為「關閉」。

| P0 | 必須證據 |
| --- | --- |
| E-06、A-04、A-05 | 合併後程式碼、每類遊戲回歸、減少動態八關結果、讀屏／單鍵真人記錄 |
| R-01 | 公開網址的無痕／手機／硬重新整理結果、版本 manifest、成功回退演練 |
| R-03 | 共用裝置清除功能的截圖或測試記錄與教師流程簽核 |
| R-04 | 校方填妥的支援設定、危機程序擁有人、內容專家／校方簽核 |
| R-06 | 完整資產登錄冊、授權佐證、發布閘門通過紀錄 |
| A-01 | 三種讀屏組合的完整真人簽核表 |

## References

[1]: https://www.w3.org/TR/WCAG22/ "Web Content Accessibility Guidelines (WCAG) 2.2 — W3C"
