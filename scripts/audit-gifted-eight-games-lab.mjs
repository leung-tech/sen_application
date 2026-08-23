import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9394;
const baseUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html';
const reportPath = '/home/ubuntu/sen_application/gifted-eight-games-lab-audit.json';
const activities = { lower: ['flex-castle', 'selective-listening'], upper: ['viewpoint-studio', 'rule-sandbox'], junior: ['perspective-toolkit', 'tone-workbench'], senior: ['achievement-map', 'values-sandbox'] };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/gifted-eight-audit', 'about:blank'], { stdio: 'ignore' });

async function websocketUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json()); const page = pages.find((item) => item.type === 'page'); if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl; } catch {}
    await sleep(100);
  }
  throw new Error('無法連接 Giftedness 八項活動稽核瀏覽器。');
}
function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({ call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('Giftedness 八項活動稽核瀏覽器連線失敗。')));
  });
}
async function evaluate(client, expression) { const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); return result.result.value; }
async function openStage(client, stage) {
  await client.call('Page.navigate', { url: `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}giftedEightAudit=${Date.now()}` }); await sleep(900);
  await evaluate(client, `(() => { document.querySelector('.pathway-card[data-type="G"]')?.click(); document.querySelector('.level-button[data-stage="${stage}"]')?.click(); })()`); await sleep(90);
}
async function startActivity(client, stage, id) {
  await openStage(client, stage);
  await evaluate(client, `document.querySelector(${JSON.stringify(`[data-gifted-eight-activity="${id}"]`)})?.click()`); await sleep(60);
  const ready = await evaluate(client, `(() => { const dialog=document.querySelector('.g8-dialog'); return {dialog:Boolean(dialog),role:dialog?.getAttribute('role')||'',modal:dialog?.getAttribute('aria-modal')||'',rules:dialog?.querySelectorAll('.g8-rule').length||0,start:Boolean(dialog?.querySelector('[data-action="start"]')),focusInside:Boolean(dialog?.contains(document.activeElement))}; })()`);
  await evaluate(client, `document.querySelector('[data-action="start"]')?.click()`); await sleep(50);
  const initial = await evaluate(client, `(() => { const dialog=document.querySelector('.g8-dialog'); const status=dialog?.querySelector('[data-role="status"]'); const progress=dialog?.querySelector('[role="progressbar"]'); return {dialog:Boolean(dialog),status:{role:status?.getAttribute('role')||'',live:status?.getAttribute('aria-live')||'',atomic:status?.getAttribute('aria-atomic')||''},progress:{role:progress?.getAttribute('role')||'',min:progress?.getAttribute('aria-valuemin')||'',max:progress?.getAttribute('aria-valuemax')||''},pause:Boolean(dialog?.querySelector('[data-action="pause"]')),teacher:Boolean(dialog?.querySelector('[data-action="teacher"]')),leave:Boolean(dialog?.querySelector('[data-action="close"]'))}; })()`);
  return { stage, id, ready, initial };
}
async function clickText(client, selector, text) { await evaluate(client, `(() => [...document.querySelectorAll(${JSON.stringify(selector)})].find((node)=>node.textContent.trim()===${JSON.stringify(text)})?.click())()`); await sleep(35); }
async function completeCastle(client) {
  const rounds = [[['入口標示', '入口位置'], ['安全欄杆', '城牆邊'], ['歡迎旗幟', '塔頂']], [['遮雨蓋', '入口位置'], ['防滑石路', '通道地面'], ['觀察窗', '城牆邊']], [['休息長椅', '花園中央'], ['清楚路牌', '分岔位置'], ['小樹苗', '花園邊']]];
  for (const round of rounds) for (const [card, slot] of round) { await evaluate(client, `document.querySelector(${JSON.stringify(`[data-g8-card="${card}"]`)})?.click(); document.querySelector(${JSON.stringify(`[data-g8-slot="${slot}"]`)})?.click()`); await sleep(35); }
}
async function completeChoices(client, selector, answers) { for (const answer of answers) await clickText(client, selector, answer); }
async function completeChoiceFree(client, selector) { for (let i = 0; i < 3; i += 1) { await evaluate(client, `document.querySelector(${JSON.stringify(selector)})?.click(); document.querySelector('[data-action="next-choice"]')?.click()`); await sleep(35); } }
async function interact(client, id) {
  if (id === 'flex-castle') await completeCastle(client);
  if (id === 'selective-listening') await completeChoices(client, '[data-g8-choice]', ['○', '△', '↗']);
  if (id === 'viewpoint-studio') await completeChoices(client, '[data-g8-view]', ['先問：哪些用水可安全重用，以及幼苗最少需要多少水？', '先問：哪兩組書架移動後可同時留出安靜區與短時討論區？', '先問：可否用一張導覽卡連結地圖、數據與參觀順序？']);
  if (id === 'rule-sandbox') await completeChoices(client, '[data-g8-rule]', ['先試行分時入口與清楚步行線，並邀請不同使用者提出觀察。', '先用可見預約卡和安靜時段試行一週，再一起修訂。', '先標示一條平緩路線與觀察區，再收集使用者意見調整。']);
  if (id === 'perspective-toolkit') await completeChoices(client, '[data-g8-perspective]', ['先查看版本紀錄，並用中性句確認圖表是否移到別頁。', '先查看新日期，再詢問是否有替代安排或需要預先準備的資料。', '請對方指出一個例子，並先選一小部分一起修訂。']);
  if (id === 'tone-workbench') await completeChoices(client, '[data-g8-tone]', ['我看到你已整理了景點；我們可否一起補上每段交通時間，再比較兩個安排？', '我想確認這一段的來源；我們可否一起補上連結，再決定要不要保留？', '我看到這一部分還未更新；你想先說說目前卡在哪裡，還是我們一起調整時間表？']);
  if (id === 'achievement-map') await completeChoiceFree(client, '[data-g8-achievement]');
  if (id === 'values-sandbox') await completeChoiceFree(client, '[data-g8-value]');
  return evaluate(client, `(() => ({complete:Boolean(document.querySelector('.g8-finish')),overflow:document.documentElement.scrollWidth>window.innerWidth,text:document.querySelector('.g8-finish')?.textContent.trim()||''}))()`);
}
async function keyboardAudit(client) {
  await openStage(client, 'lower'); await evaluate(client, `document.querySelector('[data-gifted-eight-activity="flex-castle"]')?.click()`); await sleep(50);
  return evaluate(client, `(() => { const overlay=document.querySelector('.g8-overlay'); const dialog=document.querySelector('.g8-dialog'); const items=[...dialog.querySelectorAll('button:not([disabled])')]; const first=items[0],last=items.at(-1); first?.focus(); first?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true})); const shiftWrap=document.activeElement===last; last?.focus(); last?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true})); const tabWrap=document.activeElement===first; document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return {tabWrap,shiftWrap,closed:!document.querySelector('.g8-dialog'),restored:document.activeElement?.dataset?.giftedEightActivity==='flex-castle'}; })()`);
}
async function mobileAudit(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true }); await startActivity(client, 'lower', 'flex-castle');
  const report = await evaluate(client, `(() => { const dialog=document.querySelector('.g8-dialog'); const controls=[...dialog.querySelectorAll('button')].filter((item)=>item.offsetParent!==null).map((item)=>{const r=item.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}}); return {overflow:document.documentElement.scrollWidth>window.innerWidth,dialogWidth:Math.round(dialog?.getBoundingClientRect().width||0),narrow:controls.filter((item)=>item.w<40||item.h<40),dragCards:[...document.querySelectorAll('[data-g8-card]')].every((item)=>item.getAttribute('draggable')==='true')}; })()`);
  await client.call('Emulation.clearDeviceMetricsOverride'); return report;
}
async function motionAudit(client) { await client.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }); await startActivity(client, 'lower', 'selective-listening'); const report = await evaluate(client, `getComputedStyle(document.querySelector('.g8-choice')).transitionDuration`); await client.call('Emulation.setEmulatedMedia', { features: [] }); return report; }

try {
  const client = await connect(await websocketUrl()); await client.call('Page.enable'); const menus = []; const games = [];
  for (const [stage, ids] of Object.entries(activities)) { await openStage(client, stage); menus.push(await evaluate(client, `(() => ({stage:${JSON.stringify(stage)},loaded:Boolean(window.GIFTED_EIGHT_GAMES_LAB),cards:[...document.querySelectorAll('[data-gifted-eight-activity]')].map((node)=>node.dataset.giftedEightActivity),hiCard:Boolean(document.querySelector('[data-game-id="pathway-hi"]'))}))()`)); for (const id of ids) { const audit = await startActivity(client, stage, id); audit.interaction = await interact(client, id); games.push(audit); } }
  const keyboard = await keyboardAudit(client); const mobile = await mobileAudit(client); const motion = await motionAudit(client); const failures = [];
  menus.forEach((menu) => { const expected = activities[menu.stage]; if (!menu.loaded || menu.cards.length !== expected.length || expected.some((id) => !menu.cards.includes(id)) || menu.hiCard) failures.push(`${menu.stage}：Giftedness 專有直接選關或 HI 分隔不完整。`); });
  games.forEach((game) => { if (!game.ready.dialog || game.ready.role !== 'dialog' || game.ready.modal !== 'true' || game.ready.rules !== 3 || !game.ready.start || !game.ready.focusInside) failures.push(`${game.id}：教師準備頁或焦點管理不完整。`); if (!game.initial.dialog || game.initial.status.role !== 'status' || game.initial.status.live !== 'polite' || game.initial.status.atomic !== 'true' || !game.initial.progress.role || !game.initial.progress.min || !game.initial.progress.max || !game.initial.pause || !game.initial.teacher || !game.initial.leave) failures.push(`${game.id}：動態語意、進度或低壓支持不完整。`); if (!game.interaction.complete || game.interaction.overflow) failures.push(`${game.id}：核心互動未完成或有橫向溢出。`); });
  if (!keyboard.tabWrap || !keyboard.shiftWrap || !keyboard.closed || !keyboard.restored) failures.push('Giftedness：Tab 焦點循環、Escape 或焦點回復不完整。');
  if (mobile.overflow || mobile.narrow.length || !mobile.dragCards) failures.push('Giftedness：375px 手機版有橫向溢出、控制不足 40px 或拖拉卡不完整。');
  if (motion !== '0s') failures.push('Giftedness：減少動態效果未關閉非必要轉場。');
  const output = { standard: 'Giftedness eight-game direct-entry, preparation, safe interactions, keyboard, reduced-motion and 375px audit', baseUrl, menus, games, keyboard, mobile, motion, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`); console.log(JSON.stringify({ stages: menus.length, games: games.length, failureCount: failures.length, failures }, null, 2)); client.close();
} finally { chrome.kill('SIGTERM'); }
