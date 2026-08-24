import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const bankFile = new URL('../modules/spld/spld-shape-sound-meaning-bank.js', import.meta.url);
const labFile = new URL('../modules/spld/spld-shape-sound-meaning-lab.js', import.meta.url);
const [bankSource, labSource] = await Promise.all([readFile(bankFile, 'utf8'), readFile(labFile, 'utf8')]);
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(bankSource, context, { filename: bankFile.pathname });
vm.runInContext(labSource, context, { filename: labFile.pathname });

const lab = context.window.SPLD_SHAPE_SOUND_MEANING_LAB;
if (!lab) throw new Error('找不到 SPLD_SHAPE_SOUND_MEANING_LAB 公開入口。');
if (Object.keys(lab.starLevels?.() || {}).length !== 5) throw new Error('形音義工房必須提供五個星級。');

const stages = ['lower', 'upper', 'junior', 'senior'];
const stars = [1, 2, 3, 4, 5];
const report = [];
for (const stage of stages) {
  const orderKeys = [];
  for (const star of stars) {
    const rounds = lab.rounds(stage, star);
    const examples = lab.extensionExamples(stage, star);
    const missingFields = rounds.filter((round) => round.length < 6 || round.slice(0, 6).some((value) => !value)).length;
    const uniqueCharacters = new Set(rounds.map((round) => round[0])).size;
    const uniqueWords = new Set(rounds.map((round) => round[5])).size;
    if (rounds.length < 20 || missingFields || uniqueCharacters < 20 || uniqueWords < 20) throw new Error(`${stage} 的 ${star} 星題庫必須有至少 20 個完整且不重複的漢字與詞語。`);
    if (examples.length !== 4 || examples.some((example) => example.length !== 3 || example.some((value) => !value))) throw new Error(`${stage} 的 ${star} 星必須有 4 個完整拆字示範。`);
    orderKeys.push(rounds.map((round) => round[0]).join(''));
    report.push({ stage, star, characters: rounds.length, uniqueCharacters, uniqueWords, examples: examples.length });
  }
  if (new Set(orderKeys).size !== 5) throw new Error(`${stage} 的五個星級必須使用不同題目組合排序。`);
}

for (const required of ['data-spld-sm-star', '20 個漢字 · 60 個線索小步', 'taskCount()', 'spldSmSplit', 'draggable="true"', '線索 ${phase + 1} / 3']) {
  if (!labSource.includes(required)) throw new Error(`形音義工房缺少五星級或低壓互動支援：${required}`);
}

console.log('SpLD five-star shape-sound-meaning audit: OK');
console.table(report);
