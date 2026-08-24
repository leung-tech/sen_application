import fs from 'node:fs';
import vm from 'node:vm';

globalThis.window = {};
const source = fs.readFileSync(new URL('../modules/accessibility/vi-pd-games-lab.js', import.meta.url), 'utf8');
vm.runInThisContext(source, { filename: 'vi-pd-games-lab.js' });

const stages = ['lower', 'upper', 'junior', 'senior'];
const audit = stages.map((stage) => {
  const games = window.VI_GAMES_LAB.activityCards(stage);
  const underEight = games.filter((game) => game.rounds.length < 8).map((game) => game.id);
  return {
    stage,
    count: games.length,
    minRounds: Math.min(...games.map((game) => game.rounds.length)),
    underEight,
  };
});

console.table(audit);
if (audit.some((entry) => entry.count < 2 || entry.underEight.length)) process.exit(1);
console.log('VI accessibility games audit: OK');
