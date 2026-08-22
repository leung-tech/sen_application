import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const sourcePath = new URL('../modules/spld/spld-s1-lab.js', import.meta.url);
const source = await readFile(sourcePath, 'utf8');
const documentStub = {
  createElement() { return { textContent: '' }; },
  head: { appendChild() {} },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  body: { insertAdjacentHTML() {} },
  addEventListener() {}
};
const windowStub = { document: documentStub, setTimeout, speechSynthesis: { cancel() {} } };
const context = vm.createContext({ window: windowStub, document: documentStub, CustomEvent: class {}, setTimeout });
vm.runInContext(source, context, { filename: 'spld-s1-lab.js' });

const api = windowStub.SPLD_S1_LAB;
if (!api || typeof api.activityCards !== 'function' || typeof api.openActivity !== 'function' || typeof api.openMenu !== 'function') {
  throw new Error('初中 SpLD 模組未公開預期介面。');
}

const cards = api.activityCards();
const expectedTitles = ['關聯詞轉盤', '段落結構大洗牌', '文章冗詞除錯', '修辭手法分類卡', '成語圖解猜謎', '主旨提煉篩選器', '詞義辨析雷達', '句式關係校準'];
if (cards.length !== 8) throw new Error(`預期八項初中活動，實際為 ${cards.length} 項。`);
if (expectedTitles.some((title) => !cards.some((card) => card.title === title))) {
  throw new Error('初中 SpLD 模組缺少預期的詞義或句式進階活動。');
}
if (cards.some((card) => card.rounds.length !== 10)) {
  throw new Error('每項初中活動必須保留十個短回合。');
}

console.log(`已驗證 ${cards.length} 項初中 SpLD 活動；每項均為 10 個短回合。`);
