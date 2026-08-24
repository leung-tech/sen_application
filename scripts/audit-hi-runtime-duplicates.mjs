import fs from 'node:fs';
import vm from 'node:vm';
import { writeFile } from 'node:fs/promises';

const reportPath = '/home/ubuntu/sen_application/HI_RUNTIME_DUPLICITY_AUDIT_20260824.json';
globalThis.window = {};
const source = fs.readFileSync(new URL('../modules/hi/hi-eight-games-lab.js', import.meta.url), 'utf8');
vm.runInThisContext(source, { filename: 'hi-eight-games-lab.js' });

const normaliseText = (text) => String(text)
  .replace(/^溫習小題\s*\d+：\s*/, '')
  .replace(/練習\s*\d+\s*[：:]/g, '練習：')
  .replace(/第\s*\d+\s*(步|項|張|題)\s*[：:]/g, '第項：')
  .replace(/\s+/g, ' ')
  .trim();
const normalise = (value, key = '') => {
  if (Array.isArray(value)) {
    const next = value.map((item) => normalise(item, key));
    return ['choices', 'options'].includes(key) ? next.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : next;
  }
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter((item) => item !== 'id' && item !== 'band').map((item) => [item, normalise(value[item], item)]));
  return typeof value === 'string' ? normaliseText(value) : value;
};

const labels = { lower: '初小 P1–P3', upper: '高小 P4–P6', junior: '初中 S1–S3', senior: '高中 S4–S6' };
const activities = Object.entries(labels).flatMap(([stage, label]) => window.HI_EIGHT_GAMES_LAB.activityCards(stage).map((game) => {
  const rounds = game.rounds || [];
  const fingerprints = rounds.map((round) => JSON.stringify(normalise(round)));
  const duplicateIndexes = fingerprints.map((fingerprint, index) => fingerprints.indexOf(fingerprint) !== index ? index + 1 : 0).filter(Boolean);
  return { stage: label, id: game.key, title: game.title, rounds: rounds.length, uniqueRounds: new Set(fingerprints).size, duplicateIndexes };
}));
const duplicated = activities.filter((activity) => activity.rounds < 8 || activity.uniqueRounds < activity.rounds);
const output = { activities, duplicated, failureCount: duplicated.length };
await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ totalActivities: activities.length, duplicateActivityCount: duplicated.length, duplicated }, null, 2));
if (duplicated.length) process.exitCode = 1;
