import fs from 'node:fs';
import vm from 'node:vm';
import { writeFile } from 'node:fs/promises';

const reportPath = '/home/ubuntu/sen_application/EBD_RUNTIME_DUPLICITY_AUDIT_20260824.json';
const context = { window: {}, document: {}, console, setTimeout, clearTimeout, navigator: {} };
context.window.window = context.window;
vm.createContext(context);
for (const file of ['ebd-stage-data.js', 'ebd-strategy-lab.js']) vm.runInContext(fs.readFileSync(new URL(`../modules/ebd/${file}`, import.meta.url), 'utf8'), context, { filename: file });
const normalizeText = (value) => String(value).replace(/^溫習小題\s*\d+：\s*/, '').replace(/第\s*\d+\s*(個小步|步|題|項|張|回合)\s*[：:]/g, '第項：').replace(/\s+/g, ' ').trim();
const normalize = (value, key = '') => {
  if (Array.isArray(value)) { const items = value.map((item) => normalize(item, key)); return ['choices', 'options'].includes(key) ? items.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : items; }
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter((item) => !['id', 'band', 'order'].includes(item)).map((item) => [item, normalize(value[item], item)]));
  return typeof value === 'string' ? normalizeText(value) : value;
};
const inspect = (stage, source, activity) => { const prints = activity.rounds.map((round) => JSON.stringify(normalize(round))); const duplicateIndexes = prints.map((print, index) => prints.indexOf(print) < index ? index + 1 : 0).filter(Boolean); return { stage, source, id: activity.id, title: activity.title, rounds: activity.rounds.length, uniqueRounds: new Set(prints).size, duplicateIndexes }; };
const labels = { lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' };
const activities = Object.entries(context.window.EBD_STAGE_TASKS).map(([stage, item]) => inspect(labels[stage], 'EBD 主路線', { id: `ebd-pathway-${stage}`, title: item.title, rounds: item.rounds }));
for (const [stage, label] of Object.entries(labels)) context.window.EBD_STRATEGY_LAB.activityCards(stage).forEach((item) => activities.push(inspect(label, 'EBD 雙贏策略桌', item)));
const duplicated = activities.filter((activity) => activity.rounds < 8 || activity.uniqueRounds < activity.rounds);
const output = { totalActivities: activities.length, activities, duplicated, failureCount: duplicated.length };
await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ totalActivities: activities.length, duplicateActivityCount: duplicated.length, duplicated }, null, 2));
if (duplicated.length) process.exitCode = 1;
