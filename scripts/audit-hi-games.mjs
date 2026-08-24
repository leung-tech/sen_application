import fs from 'node:fs';
import vm from 'node:vm';

globalThis.window = {};
const source = fs.readFileSync(new URL('../modules/hi/hi-eight-games-lab.js', import.meta.url), 'utf8');
vm.runInThisContext(source, { filename: 'hi-eight-games-lab.js' });

const stages = ['lower', 'upper', 'junior', 'senior'];
const audit = stages.map((stage) => {
  const games = window.HI_EIGHT_GAMES_LAB.activityCards(stage);
  const underEight = games.filter((game) => game.steps < 8).map((game) => game.key);
  return {
    stage,
    count: games.length,
    minSteps: Math.min(...games.map((game) => game.steps)),
    underEight,
  };
});

console.table(audit);
if (audit.some((entry) => entry.count < 2 || entry.underEight.length)) process.exit(1);
console.log('HI visual-first games audit: OK');
