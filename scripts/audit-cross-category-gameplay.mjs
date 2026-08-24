import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const file = new URL('../modules/cross-category/cross-category-strategy-lab.js', import.meta.url);
const source = await readFile(file, 'utf8');
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(source, context, { filename: file.pathname });

const lab = context.window.CROSS_CATEGORY_STRATEGY_LAB;
if (!lab) throw new Error('找不到 CROSS_CATEGORY_STRATEGY_LAB 公開入口。');

const report = ['emotion', 'cognition'].map((track) => {
  const cards = lab.cards(track);
  return {
    track,
    count: cards.length,
    minChoices: Math.min(...cards.map((card) => card.choices.length)),
    invalidAnswers: cards.filter((card) => !Number.isInteger(card.answer) || card.answer < 0 || card.answer >= card.choices.length).map((card) => card.title),
    missingText: cards.filter((card) => !card.title || !card.scene || !card.prompt || !card.note).map((card) => card.title || '(未命名)')
  };
});

for (const row of report) {
  if (row.count !== 8) throw new Error(`${row.track} 必須有固定 8 張策略卡，目前為 ${row.count}。`);
  if (row.minChoices < 3) throw new Error(`${row.track} 存在少於 3 張策略卡的任務。`);
  if (row.invalidAnswers.length || row.missingText.length) throw new Error(`${row.track} 存在無效答案或缺少文字的任務。`);
}

if (!source.includes('id="crossDock"') || !source.includes('draggable="true"') || !source.includes('bindMissionBoard')) {
  throw new Error('策略卡任務桌缺少收集盒、可選拖放或事件接線。');
}

console.log('Cross-category mission board audit: OK');
console.table(report);
