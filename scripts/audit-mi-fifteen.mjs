import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/mi/mi-fifteen-catalogue-lab.js', import.meta.url), 'utf8');
const context = { window: {}, document: {}, console, setTimeout, clearTimeout };
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'mi-fifteen-catalogue-lab.js' });

const lab = context.window.MI_FIFTEEN_CATALOGUE_LAB;
if (!lab) throw new Error('找不到 MI_FIFTEEN_CATALOGUE_LAB API');

const report = ['lower', 'upper', 'junior', 'senior'].map((stage) => {
  const activities = lab.activityCards(stage);
  const underEight = activities.filter((activity) => activity.rounds.length < 8).map((activity) => activity.id);
  return { stage, count: activities.length, minRounds: Math.min(...activities.map((activity) => activity.rounds.length)), underEight };
});

console.table(report);
if (report.some((row) => row.count !== 15 || row.minRounds < 8 || row.underEight.length)) {
  throw new Error('MI 十五項活動稽核失敗');
}
console.log('MI fifteen catalogue audit: OK');
