import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceRoots = ['modules', 'assets/js'];
const reportPath = path.join(root, 'QUESTION_DUPLICITY_AUDIT_20260824.md');
const fields = ['prompt', 'question', 'scenario', 'context', 'stem', 'sentence', 'task', 'instruction'];
const fieldPattern = new RegExp(`\\b(${fields.join('|')})\\s*:\\s*(['\"\`])`, 'g');

async function filesUnder(relativePath) {
  const directory = path.join(root, relativePath);
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const next = path.join(relativePath, entry.name);
    return entry.isDirectory() ? filesUnder(next) : (entry.name.endsWith('.js') ? [next] : []);
  }));
  return nested.flat();
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length;
}

function readQuoted(source, start, quote) {
  let value = ''; let index = start + 1;
  while (index < source.length) {
    const char = source[index];
    if (char === '\\') { value += source.slice(index, index + 2); index += 2; continue; }
    if (char === quote) return { value, end: index + 1 };
    value += char; index += 1;
  }
  return { value, end: source.length };
}

function bracePairs(source) {
  const stack = []; const pairs = []; let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (char === '\'' || char === '\"' || char === '\`') { index = readQuoted(source, index, char).end; continue; }
    if (char === '/' && source[index + 1] === '/') { const end = source.indexOf('\n', index); index = end === -1 ? source.length : end + 1; continue; }
    if (char === '/' && source[index + 1] === '*') { const end = source.indexOf('*/', index + 2); index = end === -1 ? source.length : end + 2; continue; }
    if (char === '{') stack.push(index);
    if (char === '}') { const start = stack.pop(); if (start !== undefined) pairs.push({ start, end: index }); }
    index += 1;
  }
  return pairs;
}

function containingObject(pairs, position) {
  return pairs.filter((pair) => pair.start <= position && pair.end >= position).sort((a, b) => (a.end - a.start) - (b.end - b.start))[0];
}

function normalise(text) {
  return text
    .replace(/\$\{[^}]*\}/g, '')
    .replace(/[`'\"\s，。！？、；：,.!?;:()（）\[\]{}「」『』【】—–-]/g, '')
    .toLowerCase();
}

function isQuestionText(text) {
  const plain = normalise(text);
  const han = (plain.match(/[\u3400-\u9fff]/g) || []).length;
  return !text.includes('${') && (han >= 5 || plain.length >= 14);
}

function optionList(objectSource) {
  const match = objectSource.match(/\b(?:choices|options|cards|answers)\s*:\s*\[([\s\S]*?)\]/);
  if (!match) return [];
  const values = []; const literal = /(['\"\`])((?:\\.|(?!\1)[\s\S])*)\1/g;
  let item;
  while ((item = literal.exec(match[1]))) {
    if (!item[2].includes('${')) values.push(normalise(item[2]));
  }
  return [...new Set(values)].filter(Boolean);
}

function bigrams(value) {
  const chars = [...normalise(value)];
  if (chars.length < 2) return new Set(chars);
  return new Set(chars.slice(0, -1).map((char, index) => `${char}${chars[index + 1]}`));
}

function similarity(a, b) {
  const left = bigrams(a); const right = bigrams(b);
  const shared = [...left].filter((value) => right.has(value)).length;
  return shared / Math.max(1, left.size + right.size - shared);
}

function rows(items) {
  return items.map((item) => `| \`${item.file}\`:${item.line} | ${item.field} | ${item.text.replace(/\|/g, '\\|').replace(/\n/g, ' ')} |`).join('\n');
}

const sourceFiles = (await Promise.all(sourceRoots.map(filesUnder))).flat().sort();
const records = [];
for (const file of sourceFiles) {
  const source = await readFile(path.join(root, file), 'utf8');
  const pairs = bracePairs(source);
  fieldPattern.lastIndex = 0;
  let match;
  while ((match = fieldPattern.exec(source))) {
    const quote = match[2];
    const quoted = readQuoted(source, fieldPattern.lastIndex - 1, quote);
    const text = quoted.value.trim();
    fieldPattern.lastIndex = quoted.end;
    if (!isQuestionText(text)) continue;
    const container = containingObject(pairs, match.index);
    const objectSource = container ? source.slice(container.start, container.end + 1) : '';
    const options = optionList(objectSource);
    records.push({ file, line: lineOf(source, match.index), field: match[1], text, key: normalise(text), options, optionKey: [...options].sort().join('||'), optionOrder: options.join('||') });
  }
}

const exactGroups = [...records.reduce((groups, item) => {
  if (!groups.has(item.key)) groups.set(item.key, []);
  groups.get(item.key).push(item); return groups;
}, new Map()).values()].filter((group) => group.length > 1);

const exactQuestionGroups = exactGroups.filter((group) => group.some((item) => ['prompt', 'question', 'scenario', 'stem'].includes(item.field)));
const isFallbackMirror = (group) => group.length === 2
  && group.some((item) => item.file === 'assets/js/sen-app.js')
  && group.some((item) => /-stage-data\.js$/.test(item.file));
const fallbackMirrorGroups = exactQuestionGroups.filter(isFallbackMirror);
const learnerVisibleExactGroups = exactQuestionGroups.filter((group) => !isFallbackMirror(group));
const orderOnlyGroups = learnerVisibleExactGroups.filter((group) => {
  const ordered = new Set(group.map((item) => item.optionOrder).filter(Boolean));
  const sorted = new Set(group.map((item) => item.optionKey).filter(Boolean));
  return sorted.size === 1 && ordered.size > 1;
});

const nearPairs = [];
for (let left = 0; left < records.length; left += 1) {
  for (let right = left + 1; right < records.length; right += 1) {
    const a = records[left]; const b = records[right];
    if (a.key === b.key || a.field !== b.field || a.key.length < 10 || b.key.length < 10) continue;
    const score = similarity(a.text, b.text);
    if (score >= 0.86) nearPairs.push({ a, b, score });
  }
}

const report = [
  '# 全站題目重複性稽核',
  '',
  `**掃描範圍：** ${sourceFiles.length} 個題庫或主前端 JavaScript 檔案（${sourceRoots.join('、')}）。`,
  `**可分析題幹／情境／指令紀錄：** ${records.length} 項。`,
  '**判定方式：** 完全重複會比較標準化題幹；近似重複以中文字符雙字組相似度達 0.86 為候選；換序重複會比較同一題幹的選項集合與原有排列。UI 通用按鈕、短提示和含動態插值的樣板字串不列為題目。',
  '',
  '> 本工具先提供可重複執行的候選清單。候選題目仍須人工判讀：跨學段為複習目的的相同概念不一定是錯誤；同一活動內完全相同題幹與選項則應優先修正。',
  '',
  '## 摘要',
  '',
  '| 類型 | 候選群組／配對 | 人工處理原則 |',
  '| --- | ---: | --- |',
  `| 題庫來源鏡像（主頁備援與分學段資料） | ${fallbackMirrorGroups.length} | 不會在同一學生流程雙重出題；保留作主頁資料備援。 |`,
  `| 學生可見的完全相同題幹／情境 | ${learnerVisibleExactGroups.length} | 檢查是否位於同一活動、同一學段或只是跨學段刻意複習。 |`,
  `| 同題幹、相同選項集合、只換排列 | ${orderOnlyGroups.length} | 視為高風險；若同一活動重覆出現，應改題幹、情境或選項。 |`,
  `| 高相似題幹／情境 | ${nearPairs.length} | 檢查是否只是同義改寫、不同語境的必要複習，或實質重覆。 |`,
  '',
  '## 題庫來源鏡像（不列為學生可見重覆）',

  fallbackMirrorGroups.length ? fallbackMirrorGroups.map((group, index) => `### 鏡像 ${index + 1}\n\n| 位置 | 欄位 | 文字 |\n| --- | --- | --- |\n${rows(group)}`).join('\n\n') : '沒有偵測到主頁備援與分學段資料鏡像。',

  '',
  '## 學生可見的完全相同題幹／情境候選',
  '',
  learnerVisibleExactGroups.length ? learnerVisibleExactGroups.map((group, index) => `### 群組 ${index + 1}\n\n| 位置 | 欄位 | 文字 |\n| --- | --- | --- |\n${rows(group)}`).join('\n\n') : '沒有偵測到學生可見的完全相同題幹／情境。',
  '',
  '## 同題幹而只換選項排列候選',
  '',
  orderOnlyGroups.length ? orderOnlyGroups.map((group, index) => `### 群組 ${index + 1}\n\n| 位置 | 欄位 | 文字 |\n| --- | --- | --- |\n${rows(group)}`).join('\n\n') : '沒有偵測到符合條件的換序題目。',
  '',
  '## 高相似題幹／情境候選',
  '',
  nearPairs.length ? nearPairs.map((pair, index) => `| ${index + 1} | ${(pair.score * 100).toFixed(0)}% | \`${pair.a.file}\`:${pair.a.line} | \`${pair.b.file}\`:${pair.b.line} | ${pair.a.text.replace(/\|/g, '\\|')} | ${pair.b.text.replace(/\|/g, '\\|')} |`).join('\n').replace(/^/, '| # | 相似度 | 位置 A | 位置 B | 文字 A | 文字 B |\n| ---: | ---: | --- | --- | --- | --- |\n') : '沒有偵測到達門檻的高相似題幹／情境。',
  '',
  '## 人工複核順序',
  '',
  '1. 先處理同一活動、同一學段內的完全相同題幹與選項。',
  '2. 再處理同題幹只換選項順序的回合，確認是否有新的詞語、圖像或情境足以構成不同練習。',
  '3. 最後評估跨學段的近似題；如保留，應在教學紀錄中說明其為刻意螺旋式複習，並提高語言負荷或情境複雜度。',
];

await writeFile(reportPath, `${report.join('\n')}\n`, 'utf8');
console.log(`Question duplicate audit: scanned ${sourceFiles.length} files and ${records.length} candidate question records.`);
console.log(`Exact question groups: ${exactQuestionGroups.length}; order-only groups: ${orderOnlyGroups.length}; near pairs: ${nearPairs.length}.`);
console.log(`Report written: ${path.relative(root, reportPath)}`);
