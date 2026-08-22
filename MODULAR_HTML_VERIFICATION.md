# 模組化 HTML 驗證記錄

## 結果

共用 UI 已由 `index.html` 拆分為 `assets/css/sen-ui.css` 和 `assets/js/sen-app.js`。主頁保留為 UI 入口，並由 `modules/` 載入各 SEN 範疇資料及專屬遊戲程式。

已驗證本機及 GitHub Pages 的 `index.html?senType=SpLD&stageLevel=P4–P6` 可正常顯示高小 SpLD 的基礎練習與六張直接選關卡。公開的 `modules/spld/p4-p6.html` 入口亦會保留查詢參數並導向同一個高小 SpLD UI。

## 已建立的模組入口

| 範疇 | HTML 入口 | 題庫／遊戲資料位置 |
|---|---|---|
| SpLD | `modules/spld/index.html`、`p1-p3.html`、`p4-p6.html`、`s1-s3.html`、`s4-s6.html` | `modules/spld/` |
| ADHD | `modules/adhd/index.html` | `modules/adhd/` |
| ASD | `modules/asd/index.html` | `modules/asd/` |
| EBD | `modules/ebd/index.html` | `modules/ebd/` |
| ID | `modules/id/index.html` | `modules/id/` |
| Giftedness | `modules/gifted/index.html` | `modules/gifted-hi/` |
| HI | `modules/hi/index.html` | `modules/gifted-hi/` |
| SLI | `modules/sli/index.html` | `modules/sli/sli-stage-data.js` |
| MI | `modules/mi/index.html` | `modules/mi/mi-stage-data.js` |

現有快速開始、直接選關、課堂模式及投影功能仍由共用 `assets/js/sen-app.js` 維持，避免因拆分資料檔而改變既有使用流程。

公開回歸測試亦已確認 `senType=SLI&stageLevel=P4–P6` 會由 `modules/sli/sli-stage-data.js` 載入「關鍵詞小耳朵」高小題庫，並可打開首關「交功課前，先寫姓名」。公開 `modules/mi/index.html` 入口會正確帶入 MI 範疇並顯示「我的選擇卡」，確認兩個後補的獨立題庫和 HTML 入口均可用。

## ADHD 與 ASD 拆分評估

ADHD 已具備獨立的 `modules/adhd/adhd-focus-lab.js` 專注實驗室互動程式和範疇資料檔，適合將高互動的 Stroop、停／按、持續注意及雙線任務維持在專屬 JavaScript。ASD 則已有 `modules/asd/asd-stage-data.js`，包含初小至高中社交情境的分層題庫；目前所有 ASD 回合均使用共用選擇題、提示、朗讀、課堂模式和投影引擎，因此不額外複製一份 ASD 互動 JavaScript，以免日後修改共用功能時出現兩套不一致的流程。

各範疇現時均有獨立 HTML 入口與專屬資料檔；只有在某範疇新增如 ADHD 專注實驗室般的特殊互動機制時，才會增加該範疇的專屬 JavaScript 檔。

## 高小讀寫模組公開載入

公開瀏覽器已驗證高小 SpLD 頁面的七張直接選關，以及 `modules/spld/spld-p4-lab.js` 的語素接龍、句型重組積木、詞語配對連連看、上下文偵探、同反義詞翻牌和量詞填空大闖關。語素接龍的獨立模組現提供初階 10 題、進階 12 題及挑戰級 12 題；挑戰級首題為「論 → 論點、論據、論證」。

模組腳本已採用版本化網址載入，以確保 GitHub Pages 更新後不會因瀏覽器快取而沿用舊題庫。公開版本已確認顯示「挑戰」按鈕、論證詞／精準分類說明及第 1 / 12 關。

## 初中讀寫模組公開初檢

公開 `index.html?senType=SpLD&stageLevel=S1–S3` 已顯示初中 12 關基礎練習及原有六張直接選關卡：關聯詞轉盤、段落結構大洗牌、文章冗詞除錯、修辭手法分類卡、成語圖解猜謎、主旨提煉篩選器。關聯詞轉盤首關已驗證正常開啟，並顯示第 1 / 10 關、轉折關係、三個選項、朗讀題目、看提示及換一項練習控制。提示會顯示句意線索；正確選擇「然而」後，流程正常前進至第 2 / 10 關。段落結構大洗牌的首關亦已確認正常開啟，顯示時間順序、三個排序欄位和三張可點選句子卡；點選首句後會即時置入第一格並顯示「慢慢看下一句」提示。文章冗詞除錯的首關也已驗證，會顯示原句、精煉問題、三個可選字詞及同一組低壓工具。初中模組現已擴充為八項直接選關：新增「詞義辨析雷達」及「句式關係校準」，每項均為十個短回合並沿用朗讀、提示、換練習與完成摘要介面。

以 375 × 812 像素的行動裝置視窗實際開啟初中「關聯詞轉盤」後，彈窗寬度為 343px、沒有橫向溢出；題幹字級為 20px，三個選項均為 84 × 100px，朗讀及提示工具各為 151 × 50px，而「換一項練習」為 311 × 50px。主頁的八張初中遊戲卡採兩欄排列，未見文字或控制元件重疊。

## 高中讀寫模組本機驗證

`modules/spld/spld-s4-lab.js` 已建立六項高中直接選關：文言一詞多義對決、通假字配對連線、論證三要素拼圖、文言虛詞分流、高階學術詞彙間隔卡及語病診斷與手術。結構驗證已確認每項均有十個短回合，並公開 `activityCards()`、`openActivity()`、`openMenu()` 介面；`modules/spld/s4-s6.html` 與模組清單也已登錄。375px 本機行動視窗中，文言一詞多義對決的彈窗為 343px 寬、題幹為 19px、三個選項各為 98 × 100px，低壓工具維持兩欄加全寬換項按鈕，沒有橫向溢出。
