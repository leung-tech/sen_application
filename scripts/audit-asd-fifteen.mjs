import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/asd/asd-fifteen-catalogue-lab.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: 'asd-fifteen-catalogue-lab.js' });

const catalogue = sandbox.window.ASD_FIFTEEN_CATALOGUE_LAB;
if (!catalogue) throw new Error('找不到 ASD_FIFTEEN_CATALOGUE_LAB。');

const results = ['lower', 'upper', 'junior', 'senior'].map((stage) => {
  const activities = catalogue.activityCards(stage);
  const roundCounts = activities.map((activity) => activity.rounds.length);
  return {
    stage,
    count: activities.length,
    minRounds: Math.min(...roundCounts),
    underEight: activities.filter((activity) => activity.rounds.length < 8).map((activity) => activity.id),
  };
});

for (const result of results) {
  if (result.count !== 15 || result.minRounds < 8 || result.underEight.length) {
    throw new Error(`${result.stage} 未符合 15 項且每項最少 8 題：${JSON.stringify(result)}`);
  }
}

console.table(results);
console.log('ASD 十五項目錄稽核通過。');
