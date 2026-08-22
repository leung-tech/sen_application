import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const sourcePath = new URL('../modules/spld/spld-s4-lab.js', import.meta.url);
const source = await readFile(sourcePath, 'utf8');
const documentStub = {
  createElement() { return { textContent: '' }; },
  head: { appendChild() {} },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  body: { insertAdjacentHTML() {} }
};
const windowStub = { document: documentStub, setTimeout, speechSynthesis: { cancel() {} } };
const context = vm.createContext({ window: windowStub, document: documentStub, CustomEvent: class {}, setTimeout });
vm.runInContext(source, context, { filename: 'spld-s4-lab.js' });

const api = windowStub.SPLD_S4_LAB;
if (!api || typeof api.activityCards !== 'function' || typeof api.openActivity !== 'function' || typeof api.openMenu !== 'function') {
  throw new Error('高中 SpLD 模組未公開預期介面。');
}

const expectedTitles = ['文言一詞多義對決', '通假字配對連線', '論證三要素拼圖', '文言虛詞分流', '高階學術詞彙間隔卡', '語病診斷與手術'];
const cards = api.activityCards();
if (cards.length !== 6) throw new Error(`預期六項高中活動，實際為 ${cards.length} 項。`);
if (expectedTitles.some((title) => !cards.some((card) => card.title === title))) throw new Error('高中 SpLD 模組缺少指定遊戲。');
if (cards.some((card) => card.rounds.length !== 10)) throw new Error('每項高中活動必須保留十個短回合。');

console.log(`已驗證 ${cards.length} 項高中 SpLD 活動；每項均為 10 個短回合。`);
