# 模組化 HTML 驗證記錄

## 結果

共用 UI 已由 `index.html` 拆分為 `assets/css/sen-ui.css` 和 `assets/js/sen-app.js`。主頁保留為 UI 入口，並由 `modules/` 載入各 SEN 範疇資料及專屬遊戲程式。

已驗證本機及 GitHub Pages 的 `index.html?senType=SpLD&stageLevel=P4–P6` 可正常顯示高小 SpLD 的基礎練習與六張直接選關卡。公開的 `modules/spld/p4-p6.html` 入口亦會保留查詢參數並導向同一個高小 SpLD UI。

## 已建立的模組入口

| 範疇 | HTML 入口 | 題庫／遊戲資料位置 |
|---|---|---|
| SpLD | `modules/spld/index.html`、`p1-p3.html`、`p4-p6.html` | `modules/spld/` |
| ADHD | `modules/adhd/index.html` | `modules/adhd/` |
| ASD | `modules/asd/index.html` | `modules/asd/` |
| EBD | `modules/ebd/index.html` | `modules/ebd/` |
| ID | `modules/id/index.html` | `modules/id/` |
| Giftedness | `modules/gifted/index.html` | `modules/gifted-hi/` |
| HI | `modules/hi/index.html` | `modules/gifted-hi/` |
| SLI | `modules/sli/index.html` | `modules/sli/sli-stage-data.js` |
| MI | `modules/mi/index.html` | `modules/mi/mi-stage-data.js` |

現有快速開始、直接選關、課堂模式及投影功能仍由共用 `assets/js/sen-app.js` 維持，避免因拆分資料檔而改變既有使用流程。
