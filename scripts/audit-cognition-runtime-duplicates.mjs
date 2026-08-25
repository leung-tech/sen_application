import fs from 'node:fs';
import vm from 'node:vm';
import { writeFile } from 'node:fs/promises';

const reportPath = '/home/ubuntu/sen_application/COGNITION_RUNTIME_DUPLICITY_AUDIT_20260824.json';
const context = { window: {}, document: {}, console, setTimeout, clearTimeout };
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../modules/cross-category/cross-category-strategy-lab.js', import.meta.url), 'utf8'), context, { filename: 'cross-category-strategy-lab.js' });
const normalizeText = (value) => String(value).replace(/^溫習小題\s*\d+：\s*/, '').replace(/第\s*\d+\s*(張|題|項|回合)\s*[：:]/g, '第項：').replace(/\s+/g, ' ').trim();
const normalize = (value, key = '') => {
  if (Array.isArray(value)) { const items = value.map((item) => normalize(item, key)); return key === 'choices' ? items.sort() : items; }
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter((item) => !['id', 'order'].includes(item)).map((item) => [item, normalize(value[item], item)]));
  return typeof value === 'string' ? normalizeText(value) : value;
};
const cards = context.window.CROSS_CATEGORY_STRATEGY_LAB.cards('cognition');
const prints = cards.map((card) => JSON.stringify(normalize(card)));
const duplicateIndexes = prints.map((print, index) => prints.indexOf(print) < index ? index + 1 : 0).filter(Boolean);
const output = { totalActivities: 1, activities: [{ id: 'cognition-strategy-console', title: '學習策略控制台', rounds: cards.length, uniqueRounds: new Set(prints).size, duplicateIndexes }], duplicated: cards.length < 8 || duplicateIndexes.length ? [{ id: 'cognition-strategy-console', rounds: cards.length, duplicateIndexes }] : [], failureCount: cards.length < 8 || duplicateIndexes.length ? 1 : 0 };
await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ totalActivities: output.totalActivities, rounds: cards.length, duplicateActivityCount: output.duplicated.length, duplicated: output.duplicated }, null, 2));
if (output.failureCount) process.exitCode = 1;
