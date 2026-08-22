# ID 生活技能訓練與 ASD 感官自主調節：教師使用指南

## 使用定位

本網站的 ID 與 ASD 模組是教師面對面帶領時的短回合、視覺化預習及重複練習工具。功能性生活技能與日常參與是 ID 教育的重要內容，而數碼模擬應配合真實物品、真實場景及成人支援使用，而非取代實地教學。[1] [2]

> 遊戲結果只供本節課堂回顧，不用於能力標籤、學生比較、診斷或治療判斷。學生選擇休息、跳過、靜音或離開均屬合理參與。

## ID 生活技能直接選關

教師可使用 **ID 路線 → 學段 →「生活技能直接選關」** 開啟活動。每一項活動均先有三步教師帶讀準備頁；未按「我準備好了」前不會出題、播放聲音或計分。所有活動提供大型按鈕、可選粵語朗讀、看提示、先停一停、努力星及溫和重試。

| 遊戲 | 初小／高小 | 初中／高中 | 教師帶領重點 |
|---|---|---|---|
| 物品分類小幫手 | 水果、衣服、交通、文具兩類配對 | 相同概念，增加回合與跨情境重複 | 先命名物品，再選一個箱子。 |
| 小店付款練習 | 2–4 枚一元硬幣逐格配對 | 4–6 枚一元硬幣，保留慢數節奏 | 讓學生每放一枚硬幣都指出「一枚」。 |
| 生活步驟排一排 | 洗手、雨天出門、刷牙、上課準備 | 相同 ADL 流程，以更多回合重複 | 不先要求背誦；每次只問「下一步」。 |
| 大路線追蹤 | 觸控／滑鼠沿粗大虛線走 | 相同路線，增加練習回合 | 可用 1–4 按鈕替代畫線，避免手部動作成為唯一門檻。 |
| 大鼓跟一跟 | 單一紅鼓模仿 | 2–4 色短節奏模仿 | 系統先示範；可不限次重播。 |
| 茶餐廳打工記 | 不在初小／高小顯示 | 初中／高中：選餐點、每次放 2 元、交給店長 | 使用成人化語言；只完成「接單→付款」兩個明確步驟。 |

## 「茶餐廳打工記」的課堂流程

初中及高中學生可用一張訂單完成短角色模擬。教師先讀「客人要甚麼」，讓學生在四項餐點中選擇；系統才進入付款格。學生每次放一枚 2 元，付款格滿後按「交給店長」。如學生停下，可給出三種低壓選擇：重讀訂單、指向食物圖示，或由教師與學生一起放第一枚硬幣。

## ASD 高年級安心感官小空間

初中及高中開啟「安心感官小空間」後，可先自主選擇當前情境，例如課室轉堂、小組活動、實習前、轉乘途中或交功課前。學生可以自行選擇柔和藍綠、暖色或深靛畫面，以及幾乎靜止、緩慢或穩定的流動速度；所有畫面無閃爍，聲音只會在學生主動按下播放後出現。

| 自主設定 | 可用選項 | 教師提示 |
|---|---|---|
| 情境 | 3 個符合當前學段的校園／社區／實習情境 | 「你現在較像哪個情境？」不需要解釋原因。 |
| 畫面色調 | 柔和藍綠、暖色、深靛 | 「想要哪一種感覺？」學生可隨時再改。 |
| 流動速度 | 幾乎靜止、緩慢流動、穩定流動 | 「哪一個速度最舒服？」避免把較快設定描述為更好。 |
| 呼吸節奏 | 學生按「下一拍」才顯示吸氣、停一停或呼氣 | 不強制倒數；學生可停在任何一拍。 |
| 返回課堂 | 返回配對、先停一停、關閉視窗 | 「你想回去、休息，還是換一項？」三者均可接受。 |

讓自閉症學生自行控制感官變化，在部分研究中與較高注意及較少感官相關行為有關；但現有證據不支持把多感官環境當成普遍有效的治療。因此本模組把**選擇、可預期性與退出權**放在表現或耐受度之前。[3] [4]

## 公開版本驗證

公開 GitHub Pages 已以 Chromium 與 Chrome DevTools Protocol 驗證四個學段的 ID 遊戲流程：初小與高小各五項，初中與高中各六項，合共 **22 個流程**。稽核覆蓋直接入口、三步準備頁、動態狀態訊息、進度列、Tab／Shift+Tab、Escape、焦點回復、375px 手機版大型控制及 ASD 高年級感官自主設定，最終結果為 **`failureCount: 0`**。可重跑腳本位於 [`scripts/audit-id-sensory-labs.mjs`](scripts/audit-id-sensory-labs.mjs)。

## 參考資料

[1] [Bouck, *Reports of life skills training for students with intellectual disabilities in and out of school*](https://pubmed.ncbi.nlm.nih.gov/21105934/)

[2] [Panerai et al., *Remote Home-Based Virtual Training of Functional Living Skills for Adolescents and Young Adults With Intellectual Disability*](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01730/full)

[3] [Unwin et al., *The use of Multi-Sensory Environments with autistic children: Exploring the effect of having control of sensory changes*](https://pmc.ncbi.nlm.nih.gov/articles/PMC9340127/)

[4] [Yuan et al., *Interventions for Sensory Over-Responsivity in Individuals with Autism Spectrum Disorder: A Narrative Review*](https://pmc.ncbi.nlm.nih.gov/articles/PMC9601143/)
