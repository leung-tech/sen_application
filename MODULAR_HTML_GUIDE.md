# 心晴同行｜模組化靜態 HTML 架構

## 目的

本網站維持為可直接部署至 GitHub Pages 的純靜態網站。`index.html` 只負責**共用 UI 外殼**：側欄、課堂模式、投影、學段與範疇篩選、遊戲卡及關卡畫面。每個 SEN 範疇的題目、提示和專屬遊戲程式則放在獨立檔案，日後可交給 Gemini 或其他協作者只修改指定模組，不需碰主 UI。

## 目錄規則

```text
index.html                         # 共用 UI 入口
assets/css/sen-ui.css              # 所有共用視覺樣式與響應式規則
assets/js/sen-app.js               # 共用互動、課堂模式、投影與關卡渲染
modules/core/module-entry.js       # 範疇 HTML 入口的共用導向程式
modules/spld/                      # SpLD 題庫、初小及高小多感官讀寫遊戲
modules/adhd/                      # ADHD 關卡及專注實驗室
modules/asd/                       # ASD 社交情境關卡
modules/ebd/                       # EBD 情緒識別與調節關卡
modules/id/                        # ID 生活自理與社交應對關卡
modules/gifted-hi/                 # Giftedness 與 HI 關卡
modules/<sen-type>/index.html      # 可直接開啟該範疇的靜態 HTML 入口
```

## Gemini 修改守則

| 需要修改的內容 | 只修改的檔案 |
|---|---|
| 全站排版、手機字級、按鈕或卡片 | `assets/css/sen-ui.css` |
| 課堂模式、投影、卡片渲染、通用提示 | `assets/js/sen-app.js` |
| 初小／高小 SpLD 題目及讀寫遊戲 | `modules/spld/` |
| ADHD 專注任務 | `modules/adhd/` |
| ASD 社交情境 | `modules/asd/` |
| EBD 情緒調節 | `modules/ebd/` |
| ID、Giftedness、HI 關卡 | 對應 `modules/` 資料夾 |

新增範疇時，先複製一個現有範疇資料夾，再在 `index.html` 加入對應的 `<script src="modules/新範疇/…">`。不要在 `index.html` 內重新貼上整段題庫；題目必須留在該範疇的獨立程式檔。

## 相容性

`index.html?senType=SpLD&stageLevel=P4–P6` 等既有快速開始網址將維持可用。各範疇的 `modules/<sen-type>/index.html` 是便利入口，會保留查詢參數並帶使用者回到共用 UI。
