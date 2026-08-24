import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/career/career-games-lab.js', import.meta.url), 'utf8');
const context = { window: {}, document: {}, console, setTimeout, clearTimeout };
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'career-games-lab.js' });

const lab = context.window.CAREER_GAMES_LAB;
if (!lab) throw new Error('找不到 CAREER_GAMES_LAB API');

const report = ['lower', 'upper', 'junior', 'senior'].map((stage) => {
  const activities = lab.activityCards(stage);
  const underEight = activities.filter((activity) => activity.rounds.length < 8).map((activity) => activity.id);
  return {
    stage,
    count: activities.length,
    minRounds: Math.min(...activities.map((activity) => activity.rounds.length)),
    underEight,
  };
});

console.table(report);
if (report.some((row) => row.minRounds < 8 || row.underEight.length)) {
  throw new Error('生涯規劃八題稽核失敗');
}
if (!source.includes('id="careerDock"') || !source.includes('draggable="true"') || !source.includes('bindCareerMission')) {
  throw new Error('職場行動卡任務桌缺少收集盒、可選拖放或事件接線');
}
console.log('Career eight-round audit: OK');
