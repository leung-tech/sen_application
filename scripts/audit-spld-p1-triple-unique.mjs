import { readFile } from 'node:fs/promises';

const file = 'modules/spld/spld-p1-lab.js';
const source = await readFile(file, 'utf8');
const start = source.indexOf('    triple: {');
const end = source.indexOf('    radical: {', start);
if (start < 0 || end < 0) throw new Error('找不到初小圖文音三連配對題庫區段。');

const block = source.slice(start, end);
const extract = (pattern) => [...block.matchAll(pattern)].map((match) => match[1]);
const pictures = extract(/picture: '([^']+)'/g);
const audio = extract(/audio: '([^']+)'/g);
const targets = extract(/target: '([^']+)'/g);
const prompts = extract(/prompt: '([^']+)'/g);
const issues = [];

for (const [label, values] of [['圖像', pictures], ['語音字詞', audio], ['正確字詞', targets], ['題幹', prompts]]) {
  if (values.length !== 8) issues.push(`${label}數量為 ${values.length}，應為 8。`);
  if (new Set(values).size !== values.length) issues.push(`${label}出現重覆：${values.filter((value, index) => values.indexOf(value) !== index).join('、')}。`);
}
if (prompts.some((prompt) => prompt.includes('溫習小題'))) issues.push('圖文音題庫不應依賴「溫習小題」複製回合。');
if (issues.length) throw new Error(`初小圖文音三連配對唯一性稽核失敗：\n- ${issues.join('\n- ')}`);

console.log('初小 SpLD 圖文音三連配對唯一性稽核：通過（8 個不同圖像、語音、字詞及題幹）。');
