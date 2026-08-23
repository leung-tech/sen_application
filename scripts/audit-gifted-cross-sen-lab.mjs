import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9386;
const baseUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html';
const reportPath = '/home/ubuntu/sen_application/gifted-cross-sen-lab-audit.json';
const activities = {
  lower: ['quiet-lab', 'concept-blocks'],
  upper: ['case-workshop', 'memory-map'],
  junior: ['thought-workbench', 'social-decoder'],
  senior: ['story-editor', 'community-sandbox']
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/gifted-cross-sen-audit', 'about:blank'], { stdio: 'ignore' });

async function websocketUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json()); const page = pages.find((item) => item.type === 'page'); if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl; } catch {}
    await sleep(100);
  }
  throw new Error('無法連接跨 SEN 資優／2e 稽核瀏覽器。');
}
function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({ call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('跨 SEN 資優／2e 稽核瀏覽器連線失敗。')));
  });
}
async function evaluate(client, expression) { const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); return result.result.value; }
async function openStage(client, stage) {
  await client.call('Page.navigate', { url: `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}cross2eAudit=${Date.now()}` });
  await sleep(900);
  await evaluate(client, `(() => { document.querySelector('.pathway-card[data-type="G"]')?.click(); document.querySelector('.level-button[data-stage="${stage}"]')?.click(); })()`);
  await sleep(100);
}
async function startActivity(client, stage, id) {
  await openStage(client, stage);
  await evaluate(client, `(() => { const card=document.querySelector(${JSON.stringify(`[data-gifted-cross-activity="${id}"]`)}); card?.focus(); card?.click(); })()`);
  await sleep(60);
  const ready = await evaluate(client, `(() => { const dialog=document.querySelector('.cross2e-dialog'); return {dialog:Boolean(dialog),role:dialog?.getAttribute('role')||'',modal:dialog?.getAttribute('aria-modal')||'',rules:dialog?.querySelectorAll('.cross2e-rule').length||0,start:Boolean(dialog?.querySelector('[data-action="start"]')),focusInside:Boolean(dialog?.contains(document.activeElement))}; })()`);
  await evaluate(client, `document.querySelector('[data-action="start"]')?.click()`); await sleep(50);
  const initial = await evaluate(client, `(() => { const dialog=document.querySelector('.cross2e-dialog'); const status=dialog?.querySelector('[data-role="status"]'); const progress=dialog?.querySelector('[role="progressbar"]'); return {dialog:Boolean(dialog),status:{role:status?.getAttribute('role')||'',live:status?.getAttribute('aria-live')||'',atomic:status?.getAttribute('aria-atomic')||''},progress:{role:progress?.getAttribute('role')||'',min:progress?.getAttribute('aria-valuemin')||'',max:progress?.getAttribute('aria-valuemax')||''},pause:Boolean(dialog?.querySelector('[data-action="pause"]')),teacher:Boolean(dialog?.querySelector('[data-action="teacher"]')),leave:Boolean(dialog?.querySelector('[data-action="close"]'))}; })()`);
  return { stage, id, ready, initial };
}
async function clickAnswer(client, selector, answer) { await evaluate(client, `(() => [...document.querySelectorAll(${JSON.stringify(selector)})].find((node)=>node.dataset.answer===${JSON.stringify(answer)})?.click())()`); await sleep(30); }
async function completeQuiet(client) { for (const answer of ['加入藍色一滴', '🔺', '5 格水']) await clickAnswer(client, '[data-answer]', answer); }
async function completeLink(client, answers) { for (const answer of answers) { await evaluate(client, `document.querySelector('[data-term]')?.click()`); await sleep(20); await evaluate(client, `(() => [...document.querySelectorAll('[data-zone]')].find((node)=>node.dataset.zone===${JSON.stringify(answer)})?.click())()`); await sleep(30); } }
async function completeCase(client) { for (const answer of ['先協助安全存檔，再約定交回時間和補回展示安排。', '先保留原稿，再用短時間一起選出必留資料與修改方法。', '一起標示安靜區與可討論位置，並約定小聲討論的時間。']) { await evaluate(client, `(() => [...document.querySelectorAll('[data-case-choice]')].find((node)=>node.dataset.caseChoice===${JSON.stringify(answer)})?.click())()`); await sleep(30); } }
async function completeWorkbench(client) { for (let round = 0; round < 3; round += 1) for (const type of ['事實卡', '可能想法卡', '支持選項卡']) { await evaluate(client, `(() => { document.querySelector(${JSON.stringify(`[data-work-card="${type}"]`)})?.click(); document.querySelector(${JSON.stringify(`[data-work-zone="${type}"]`)})?.click(); })()`); await sleep(30); } }
async function completeDecoder(client) { for (let round = 0; round < 3; round += 1) { await evaluate(client, `(() => [...document.querySelectorAll('[data-decoder-choice]')].find((node)=>node.textContent.includes('確認')||node.textContent.includes('謝謝'))?.click())()`); await sleep(30); } }
async function completeStory(client) { for (let round = 0; round < 3; round += 1) { await evaluate(client, `document.querySelector('[data-story-card]')?.click(); document.querySelector('[data-action="finish-story"]')?.click()`); await sleep(30); } }
async function completeCommunity(client) { for (let round = 0; round < 3; round += 1) { await evaluate(client, `document.querySelector('[data-community-plan]')?.click()`); await sleep(20); await evaluate(client, `document.querySelector('[data-community-question]')?.click()`); await sleep(20); await evaluate(client, `document.querySelector('[data-action="finish-community"]')?.click()`); await sleep(30); } }
async function interact(client, id) {
  if (id === 'quiet-lab') await completeQuiet(client);
  if (id === 'concept-blocks') await completeLink(client, ['水變成水氣', '物件向地面靠近', '暖空氣上升、冷空氣下降']);
  if (id === 'case-workshop') await completeCase(client);
  if (id === 'memory-map') await completeLink(client, ['太陽、雲與雨滴', '駱駝、地圖與貨物', '植物、昆蟲與雀鳥']);
  if (id === 'thought-workbench') await completeWorkbench(client);
  if (id === 'social-decoder') await completeDecoder(client);
  if (id === 'story-editor') await completeStory(client);
  if (id === 'community-sandbox') await completeCommunity(client);
  return evaluate(client, `(() => ({complete:Boolean(document.querySelector('.cross2e-finish')),overflow:document.documentElement.scrollWidth>window.innerWidth,text:document.querySelector('.cross2e-finish')?.textContent.trim()||''}))()`);
}
async function keyboardAudit(client) {
  await openStage(client, 'lower');
  await evaluate(client, `(() => { const card=document.querySelector('[data-gifted-cross-activity="quiet-lab"]'); card?.focus(); card?.click(); })()`); await sleep(50);
  return evaluate(client, `(() => { const overlay=document.querySelector('.cross2e-overlay'); const dialog=document.querySelector('.cross2e-dialog'); const controls=[...dialog.querySelectorAll('button:not([disabled])')]; const first=controls[0],last=controls.at(-1); first?.focus(); first?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true})); const shiftWrap=document.activeElement===last; last?.focus(); last?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true})); const tabWrap=document.activeElement===first; overlay?.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return {tabWrap,shiftWrap,closed:!document.querySelector('.cross2e-dialog'),restored:document.activeElement?.dataset?.giftedCrossActivity==='quiet-lab'}; })()`);
}
async function mobileAudit(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await startActivity(client, 'junior', 'thought-workbench');
  const report = await evaluate(client, `(() => { const dialog=document.querySelector('.cross2e-dialog'); const controls=[...dialog.querySelectorAll('button')].filter((item)=>item.offsetParent!==null).map((item)=>{const r=item.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}}); return {overflow:document.documentElement.scrollWidth>window.innerWidth,dialogWidth:Math.round(dialog?.getBoundingClientRect().width||0),narrow:controls.filter((item)=>item.w<40||item.h<40),dragCards:[...document.querySelectorAll('[data-work-card]')].every((item)=>item.getAttribute('draggable')==='true')}; })()`);
  await client.call('Emulation.clearDeviceMetricsOverride'); return report;
}
async function motionAudit(client) {
  await client.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await startActivity(client, 'lower', 'quiet-lab');
  const report = await evaluate(client, `(() => ({transition:getComputedStyle(document.querySelector('.cross2e-choice')).transitionDuration}))()`);
  await client.call('Emulation.setEmulatedMedia', { features: [] }); return report;
}

try {
  const client = await connect(await websocketUrl()); await client.call('Page.enable');
  const menus = []; const games = [];
  for (const [stage, ids] of Object.entries(activities)) {
    await openStage(client, stage);
    menus.push(await evaluate(client, `(() => ({stage:${JSON.stringify(stage)},loaded:Boolean(window.GIFTED_CROSS_SEN_LAB),cards:[...document.querySelectorAll('[data-gifted-cross-activity]')].map((node)=>node.dataset.giftedCrossActivity),hiCard:Boolean(document.querySelector('[data-game-id="pathway-hi"]'))}))()`));
    for (const id of ids) { const audit = await startActivity(client, stage, id); audit.interaction = await interact(client, id); games.push(audit); }
  }
  const keyboard = await keyboardAudit(client); const mobile = await mobileAudit(client); const motion = await motionAudit(client); const failures = [];
  menus.forEach((menu) => { const expected = activities[menu.stage]; if (!menu.loaded || menu.cards.length !== expected.length || expected.some((id) => !menu.cards.includes(id)) || menu.hiCard) failures.push(`${menu.stage}：跨 SEN 2e 直接選關或 HI 分隔不完整。`); });
  games.forEach((game) => { if (!game.ready.dialog || game.ready.role !== 'dialog' || game.ready.modal !== 'true' || game.ready.rules !== 3 || !game.ready.start || !game.ready.focusInside) failures.push(`${game.id}：教師準備頁或焦點管理不完整。`); if (!game.initial.dialog || game.initial.status.role !== 'status' || game.initial.status.live !== 'polite' || game.initial.status.atomic !== 'true' || !game.initial.progress.role || !game.initial.progress.min || !game.initial.progress.max || !game.initial.pause || !game.initial.teacher || !game.initial.leave) failures.push(`${game.id}：動態語意、進度或低壓支持不完整。`); if (!game.interaction.complete || game.interaction.overflow) failures.push(`${game.id}：核心互動未完成或有橫向溢出。`); });
  if (!keyboard.tabWrap || !keyboard.shiftWrap || !keyboard.closed || !keyboard.restored) failures.push('跨 SEN 2e：Tab 焦點循環、Escape 或焦點回復不完整。');
  if (mobile.overflow || mobile.narrow.length || !mobile.dragCards) failures.push('跨 SEN 2e：375px 手機版有橫向溢出、控制不足 40px 或拖拉卡不完整。');
  if (motion.transition !== '0s') failures.push('跨 SEN 2e：減少動態效果未關閉非必要轉場。');
  const output = { standard: 'Cross-SEN 2e eight-game direct-entry, preparation, safe interactions, keyboard, reduced-motion and 375px audit', baseUrl, menus, games, keyboard, mobile, motion, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`); console.log(JSON.stringify({ stages: menus.length, games: games.length, failureCount: failures.length, failures }, null, 2)); client.close();
} finally { chrome.kill('SIGTERM'); }
