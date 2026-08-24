import fs from 'node:fs';
import vm from 'node:vm';
import { writeFile } from 'node:fs/promises';

const reportPath = '/home/ubuntu/sen_application/SLI_RUNTIME_DUPLICITY_AUDIT_20260824.json';
const context = { window: {}, document: {}, console, setTimeout, clearTimeout, navigator: {} };
context.window.window = context.window;
vm.createContext(context);
for (const file of ['sli-stage-data.js', 'sli-core-lab.js', 'sli-eight-games-lab.js', 'sli-fifteen-catalogue-lab.js']) {
  vm.runInContext(fs.readFileSync(new URL(`../modules/sli/${file}`, import.meta.url), 'utf8'), context, { filename: file });
}
const cleanText = (value) => String(value).replace(/^溫習小題\s*\d+：\s*/, '').replace(/第\s*\d+\s*(個小步|步|題|項|張|回合)\s*[：:]/g, '第項：').replace(/\s+/g, ' ').trim();
const clean = (value, key = '') => {
  if (Array.isArray(value)) {
    const items = value.map((item) => clean(item, key));
    return ['choices', 'options'].includes(key) ? items.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : items;
  }
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter((item) => !['id', 'order', 'band', 'sliActivityKey', 'sliEightActivityKey'].includes(item)).map((item) => [item, clean(value[item], item)]));
  return typeof value === 'string' ? cleanText(value) : value;
};
const check = (stage, source, activity) => {
  const rounds = activity.rounds || [];
  const prints = rounds.map((round) => JSON.stringify(clean(round)));
  const duplicateIndexes = prints.map((print, index) => prints.indexOf(print) < index ? index + 1 : 0).filter(Boolean);
  return { stage, source, id: activity.id, title: activity.title || activity.id, rounds: rounds.length, uniqueRounds: new Set(prints).size, duplicateIndexes };
};
const labels = { lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' };
const pathway = context.window.SEN_PATHWAY_MODULES.SLI;
const activities = [check(labels.lower, 'SLI 主路線', pathway.card), ...Object.entries(pathway.stages).map(([stage, value]) => check(labels[stage], 'SLI 主路線', { id: `sli-pathway-${stage}`, title: `SLI ${labels[stage]}`, rounds: value.rounds }))];
for (const [stage, label] of Object.entries(labels)) {
  context.window.SLI_CORE_LAB.activityCards(stage).forEach((activity) => activities.push(check(label, 'SLI 核心直接選關', activity)));
  context.window.SLI_EIGHT_GAMES_LAB.activityCards(stage).forEach((activity) => activities.push(check(label, 'SLI 八項直接選關', activity)));
  context.window.SLI_FIFTEEN_CATALOGUE_LAB.activityCards(stage).forEach((activity) => activities.push(check(label, 'SLI 十五項目錄', activity)));
}
const duplicated = activities.filter((activity) => activity.rounds < 8 || activity.uniqueRounds < activity.rounds);
const output = { totalActivities: activities.length, activities, duplicated, failureCount: duplicated.length };
await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ totalActivities: activities.length, duplicateActivityCount: duplicated.length, duplicated }, null, 2));
if (duplicated.length) process.exitCode = 1;
