import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const file = new URL('../modules/spld/spld-shape-sound-meaning-lab.js', import.meta.url);
const source = await readFile(file, 'utf8');
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(source, context, { filename: file.pathname });
const lab = context.window.SPLD_SHAPE_SOUND_MEANING_LAB;
if (!lab) throw new Error('找不到 SPLD_SHAPE_SOUND_MEANING_LAB 公開入口。');
const report = ['lower', 'upper', 'junior', 'senior'].map((stage) => {
  const rounds = lab.rounds(stage);
  const extensions = lab.extensionExamples(stage);
  return { stage, count: rounds.length, missingFields: rounds.filter((round) => round.length !== 5 || round.some((value) => !value)).length, extraExamples: extensions.length, missingExtraFields: extensions.filter((example) => example.length !== 3 || example.some((value) => !value)).length };
});
for (const row of report) if (row.count !== 8 || row.missingFields) throw new Error(`${row.stage} 的形音義資料必須有 8 個完整漢字。`);
for (const row of report) if (row.extraExamples !== 4 || row.missingExtraFields) throw new Error(`${row.stage} 的部件拆字字庫必須有 4 個完整示範字例。`);
if (!source.includes('id="spldSmDock"') || !source.includes('draggable="true"') || !source.includes('線索 ${phase + 1} / 3') || !source.includes('spldSmSplit') || !source.includes('EXTENSION_BANKS')) throw new Error('形音義工房缺少可選拖放、線索放大鏡、三步進度或部件拆字支援。');
console.log('SpLD shape-sound-meaning audit: OK');
console.table(report);
