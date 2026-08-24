import fs from 'node:fs';
import vm from 'node:vm';
import { writeFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const reportPath = '/home/ubuntu/sen_application/MI_RUNTIME_DUPLICITY_AUDIT_20260824.json';
const context = { window: {}, document: {}, console, setTimeout, clearTimeout };
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../modules/mi/mi-stage-data.js', import.meta.url), 'utf8'), context, { filename: 'mi-stage-data.js' });
vm.runInContext(fs.readFileSync(new URL('../modules/mi/mi-fifteen-catalogue-lab.js', import.meta.url), 'utf8'), context, { filename: 'mi-fifteen-catalogue-lab.js' });

const normaliseText = (value) => String(value).replace(/^溫習小題\s*\d+：\s*/, '').replace(/第\s*\d+\s*(個小步|步|題|項|張)\s*[：:]/g, '第項：').replace(/\s+/g, ' ').trim();
const normalise = (value, key = '') => {
  if (Array.isArray(value)) {
    const result = value.map((item) => normalise(item, key));
    return ['choices', 'options'].includes(key) ? result.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : result;
  }
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter((item) => !['id', 'order', 'band'].includes(item)).map((item) => [item, normalise(value[item], item)]));
  return typeof value === 'string' ? normaliseText(value) : value;
};
const inspect = (stage, source, activity) => {
  const rounds = activity.rounds || [];
  const prints = rounds.map((round) => JSON.stringify(normalise(round)));
  const duplicates = prints.map((print, index) => prints.indexOf(print) !== index ? index + 1 : 0).filter(Boolean);
  return { stage, source, id: activity.id || activity.title, title: activity.title || activity.id, rounds: rounds.length, uniqueRounds: new Set(prints).size, duplicateIndexes: duplicates };
};
const pathway = context.window.SEN_PATHWAY_MODULES.MI;
const activities = [inspect('初小 P1–P3', 'MI 主路線', pathway.card), ...Object.entries(pathway.stages).map(([stage, item]) => inspect({ upper:'高小 P4–P6', junior:'初中 S1–S3', senior:'高中 S4–S6' }[stage], 'MI 主路線', { id:`mi-${stage}`, title:`MI ${stage}`, rounds:item.rounds }))];
const labels = { lower:'初小 P1–P3', upper:'高小 P4–P6', junior:'初中 S1–S3', senior:'高中 S4–S6' };
for (const [stage, label] of Object.entries(labels)) context.window.MI_FIFTEEN_CATALOGUE_LAB.activityCards(stage).forEach((activity) => activities.push(inspect(label, 'MI 十五項目錄', activity)));
const duplicated = activities.filter((activity) => activity.rounds < 8 || activity.uniqueRounds < activity.rounds);
const output = { totalActivities: activities.length, activities, duplicated, failureCount: duplicated.length };
await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ totalActivities: activities.length, duplicateActivityCount: duplicated.length, duplicated }, null, 2));
if (duplicated.length) process.exitCode = 1;
