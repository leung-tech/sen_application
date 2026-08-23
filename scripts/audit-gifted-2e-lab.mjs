import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9384;
const baseUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html';
const reportPath = '/home/ubuntu/sen_application/gifted-2e-lab-audit.json';
const activities = { lower: 'flex-puzzle', upper: 'space-clues', junior: 'team-command', senior: 'values-sandbox' };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/gifted-2e-audit', 'about:blank'], { stdio: 'ignore' });

async function websocketUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = pages.find((item) => item.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error('無法連接資優／2e 稽核瀏覽器。');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); },
      close() { socket.close(); },
    }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('資優／2e 稽核瀏覽器連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

async function openStage(client, stage) {
  await client.call('Page.navigate', { url: `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}gifted2eAudit=${Date.now()}` });
  await sleep(900);
  await evaluate(client, `(() => { document.querySelector('.pathway-card[data-type="G"]')?.click(); document.querySelector('.level-button[data-stage="${stage}"]')?.click(); })()`);
  await sleep(100);
}

async function startActivity(client, stage) {
  const id = activities[stage];
  await openStage(client, stage);
  await evaluate(client, `(() => { const card=document.querySelector(${JSON.stringify(`[data-gifted2e-activity="${id}"]`)}); card?.focus(); card?.click(); })()`);
  await sleep(80);
  const ready = await evaluate(client, `(() => { const dialog=document.querySelector('.gifted2e-dialog'); return {dialog:Boolean(dialog),role:dialog?.getAttribute('role')||'',modal:dialog?.getAttribute('aria-modal')||'',rules:dialog?.querySelectorAll('.gifted2e-rule').length||0,start:Boolean(dialog?.querySelector('[data-action="start"]')),focusInside:Boolean(dialog?.contains(document.activeElement))}; })()`);
  await evaluate(client, `document.querySelector('[data-action="start"]')?.click()`);
  await sleep(60);
  const initial = await evaluate(client, `(() => { const dialog=document.querySelector('.gifted2e-dialog'); const status=dialog?.querySelector('[data-role="status"]'); const progress=dialog?.querySelector('[role="progressbar"]'); return {dialog:Boolean(dialog),status:{role:status?.getAttribute('role')||'',live:status?.getAttribute('aria-live')||'',atomic:status?.getAttribute('aria-atomic')||''},progress:${JSON.stringify(stage)}!== 'senior' ? {role:progress?.getAttribute('role')||'',min:progress?.getAttribute('aria-valuemin')||'',max:progress?.getAttribute('aria-valuemax')||''} : {role:'optional'},pause:Boolean(dialog?.querySelector('[data-action="pause"]')),teacher:Boolean(dialog?.querySelector('[data-action="teacher"]')),leave:Boolean(dialog?.querySelector('[data-action="close"]'))}; })()`);
  return { id, ready, initial };
}

async function completeLower(client) {
  for (const answer of ['◼️', '🔺', '10']) {
    await evaluate(client, `(() => [...document.querySelectorAll('[data-answer]')].find((node)=>node.dataset.answer===${JSON.stringify(answer)})?.click())()`);
    await sleep(25);
    await evaluate(client, `document.querySelector('[data-support]')?.click()`);
    await sleep(25);
  }
}
async function completeUpper(client) {
  for (const answer of ['◆', '▲', '星']) {
    await evaluate(client, `(() => [...document.querySelectorAll('[data-answer]')].find((node)=>node.dataset.answer===${JSON.stringify(answer)})?.click())()`);
    await sleep(20);
    await evaluate(client, `(() => [...document.querySelectorAll('[data-dialogue]')].find((node)=>node.textContent.includes('確認')||node.textContent.includes('舒服的方式'))?.click())()`);
    await sleep(25);
  }
}
async function completeJunior(client) {
  for (let round = 0; round < 3; round += 1) {
    for (const [role, zone] of [['research', 'clues'], ['designer', 'plan'], ['checker', 'check']]) {
      await evaluate(client, `(() => { document.querySelector(${JSON.stringify(`[data-role="${role}"]`)})?.click(); document.querySelector(${JSON.stringify(`[data-zone="${zone}"]`)})?.click(); })()`);
      await sleep(30);
    }
  }
}
async function completeSenior(client) {
  await evaluate(client, `document.querySelector('[data-path]')?.click()`); await sleep(20);
  await evaluate(client, `document.querySelector('[data-value="創造"]')?.click()`); await sleep(20);
  await evaluate(client, `document.querySelector('[data-value="學習"]')?.click()`); await sleep(20);
  await evaluate(client, `document.querySelector('[data-action="finish-values"]')?.click()`); await sleep(30);
}
async function interact(client, stage) {
  if (stage === 'lower') await completeLower(client);
  if (stage === 'upper') await completeUpper(client);
  if (stage === 'junior') await completeJunior(client);
  if (stage === 'senior') await completeSenior(client);
  return evaluate(client, `(() => ({complete:Boolean(document.querySelector('.gifted2e-finish')),text:document.querySelector('.gifted2e-finish')?.textContent.trim()||'',overflow:document.documentElement.scrollWidth>window.innerWidth}))()`);
}

async function keyboardAudit(client) {
  await openStage(client, 'lower');
  await evaluate(client, `(() => { const card=document.querySelector('[data-gifted2e-activity="flex-puzzle"]'); card?.focus(); card?.click(); })()`); await sleep(50);
  return evaluate(client, `(() => { const overlay=document.querySelector('.gifted2e-overlay'); const dialog=document.querySelector('.gifted2e-dialog'); const controls=[...dialog.querySelectorAll('button:not([disabled])')]; const first=controls[0],last=controls.at(-1); first?.focus(); first?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true})); const shiftWrap=document.activeElement===last; last?.focus(); last?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true})); const tabWrap=document.activeElement===first; overlay?.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return {tabWrap,shiftWrap,closed:!document.querySelector('.gifted2e-dialog'),restored:document.activeElement?.dataset?.gifted2eActivity==='flex-puzzle'}; })()`);
}

async function mobileAudit(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await startActivity(client, 'junior');
  const report = await evaluate(client, `(() => { const dialog=document.querySelector('.gifted2e-dialog'); const controls=[...dialog.querySelectorAll('button')].filter((item)=>item.offsetParent!==null).map((item)=>{const r=item.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}}); return {overflow:document.documentElement.scrollWidth>window.innerWidth,dialogWidth:Math.round(dialog?.getBoundingClientRect().width||0),narrow:controls.filter((item)=>item.w<40||item.h<40),roleCards:[...document.querySelectorAll('button[data-role]')].every((item)=>item.getAttribute('draggable')==='true')}; })()`);
  await client.call('Emulation.clearDeviceMetricsOverride');
  return report;
}

async function motionAudit(client) {
  await client.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await startActivity(client, 'lower');
  const report = await evaluate(client, `(() => ({transition:getComputedStyle(document.querySelector('.gifted2e-choice')).transitionDuration}))()`);
  await client.call('Emulation.setEmulatedMedia', { features: [] });
  return report;
}

try {
  const client = await connect(await websocketUrl());
  await client.call('Page.enable');
  const menus = [];
  const games = [];
  for (const [stage, id] of Object.entries(activities)) {
    await openStage(client, stage);
    menus.push(await evaluate(client, `(() => ({stage:${JSON.stringify(stage)},loaded:Boolean(window.GIFTED_2E_LAB),cards:[...document.querySelectorAll('[data-gifted2e-activity]')].map((node)=>node.dataset.gifted2eActivity),hiCard:Boolean(document.querySelector('[data-game-id="pathway-hi"]'))}))()`));
    const audit = await startActivity(client, stage);
    audit.stage = stage;
    audit.interaction = await interact(client, stage);
    games.push(audit);
  }
  const keyboard = await keyboardAudit(client);
  const mobile = await mobileAudit(client);
  const motion = await motionAudit(client);
  const failures = [];
  menus.forEach((menu) => { if (!menu.loaded || menu.cards.length !== 1 || menu.cards[0] !== activities[menu.stage] || menu.hiCard) failures.push(`${menu.stage}：資優／2e 直接選關或 HI 分隔不完整。`); });
  games.forEach((game) => {
    if (!game.ready.dialog || game.ready.role !== 'dialog' || game.ready.modal !== 'true' || game.ready.rules !== 3 || !game.ready.start || !game.ready.focusInside) failures.push(`${game.id}：教師準備頁或焦點管理不完整。`);
    if (!game.initial.dialog || game.initial.status.role !== 'status' || game.initial.status.live !== 'polite' || game.initial.status.atomic !== 'true' || (game.stage !== 'senior' && (!game.initial.progress.role || !game.initial.progress.min || !game.initial.progress.max)) || !game.initial.pause || !game.initial.teacher || !game.initial.leave) failures.push(`${game.id}：動態語意、進度或低壓支持不完整。`);
    if (!game.interaction.complete || game.interaction.overflow) failures.push(`${game.id}：核心互動未完成或有橫向溢出。`);
  });
  if (!keyboard.tabWrap || !keyboard.shiftWrap || !keyboard.closed || !keyboard.restored) failures.push('資優／2e：Tab 焦點循環、Escape 或焦點回復不完整。');
  if (mobile.overflow || mobile.narrow.length || !mobile.roleCards) failures.push('資優／2e：375px 手機版有橫向溢出、控制不足 40px 或拖拉角色卡不完整。');
  if (motion.transition !== '0s') failures.push('資優／2e：減少動態效果未關閉非必要轉場。');
  const output = { standard: 'Gifted/2e four-stage direct-entry games, preparation, safe low-pressure interactions, keyboard, reduced-motion and 375px audit', baseUrl, menus, games, keyboard, mobile, motion, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ stages: menus.length, games: games.length, failureCount: failures.length, failures }, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
