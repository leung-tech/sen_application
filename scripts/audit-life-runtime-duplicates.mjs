import fs from 'node:fs';
import vm from 'node:vm';
import { writeFile } from 'node:fs/promises';

const reportPath = '/home/ubuntu/sen_application/LIFE_RUNTIME_DUPLICITY_AUDIT_20260824.json';
const source = fs.readFileSync(new URL('../assets/js/sen-app.js', import.meta.url), 'utf8');
const cutoff = source.indexOf('      const spldTraining =');
if (cutoff < 0) throw new Error('找不到一般生活技能題庫定義終點');
const noop = () => {};
const node = () => ({ textContent: '', dataset: {}, classList: { add: noop, remove: noop, toggle: noop }, addEventListener: noop, querySelector: node, querySelectorAll: () => [], style: {} });
const context = { window: {}, document: { querySelector: node, querySelectorAll: () => [] }, console, clearTimeout: noop, setTimeout: noop, Intl, Date };
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(`${source.slice(0, cutoff)}\nwindow.__life = { gameLibrary, stageTasks };\n})();`, context, { filename: 'sen-app-life-data.js' });
const normalizeText = (value) => String(value).replace(/^溫習小題\s*\d+：\s*/, '').replace(/第\s*\d+\s*(個小步|步|題|項|張|回合)\s*[：:]/g, '第項：').replace(/\s+/g, ' ').trim();
const normalize = (value, key = '') => {
  if (Array.isArray(value)) { const items = value.map((item) => normalize(item, key)); return ['choices', 'cards'].includes(key) ? items.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : items; }
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter((item) => !['id', 'order'].includes(item)).map((item) => [item, normalize(value[item], item)]));
  return typeof value === 'string' ? normalizeText(value) : value;
};
const ids = ['routine', 'signal', 'weather', 'path'];
const labels = { lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' };
const lower = Object.fromEntries(context.window.__life.gameLibrary.map((game) => [game.id, game]));
const sources = { lower, upper: context.window.__life.stageTasks.upper, junior: context.window.__life.stageTasks.junior, senior: context.window.__life.stageTasks.senior };
const activities = Object.entries(sources).flatMap(([stage, data]) => ids.map((id) => {
  const activity = data[id]; const prints = activity.rounds.map((round) => JSON.stringify(normalize(round)));
  return { stage: labels[stage], id, title: activity.title || activity.description || id, rounds: activity.rounds.length, uniqueRounds: new Set(prints).size, duplicateIndexes: prints.map((print, index) => prints.indexOf(print) < index ? index + 1 : 0).filter(Boolean) };
}));
const duplicated = activities.filter((activity) => activity.rounds < 8 || activity.uniqueRounds < activity.rounds);
const output = { totalActivities: activities.length, activities, duplicated, failureCount: duplicated.length };
await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ totalActivities: activities.length, duplicateActivityCount: duplicated.length, duplicated }, null, 2));
if (duplicated.length) process.exitCode = 1;
