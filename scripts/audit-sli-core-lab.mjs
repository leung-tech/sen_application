import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9365;
const reportPath = '/home/ubuntu/sen_application/sli-core-lab-audit.json';
const baseUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html';
const stages = {
  lower: ['sound', 'portal', 'factory'],
  upper: ['timeline', 'emotion', 'courier'],
  junior: ['subtext', 'debate'],
  senior: ['interview', 'resolve'],
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sli-core-lab-audit', 'about:blank'], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(120);
  }
  throw new Error('無法連接 SLI 稽核瀏覽器。');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); },
      close() { socket.close(); },
    }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('SLI 稽核瀏覽器連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

async function openStage(client, stage) {
  await client.call('Page.navigate', { url: `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}sliAudit=${Date.now()}&stage=${stage}` });
  await sleep(1100);
  await evaluate(client, `(() => { document.querySelector('.pathway-card[data-type="8"]')?.click(); document.querySelector(${JSON.stringify(`.level-button[data-stage="${stage}"]`)})?.click(); })()`);
  await sleep(100);
}

async function menuAudit(client, stage) {
  await openStage(client, stage);
  return evaluate(client, `(() => ({
    stage: ${JSON.stringify(stage)},
    moduleLoaded: Boolean(window.SLI_CORE_LAB),
    title: document.querySelector('#gamesTitle')?.textContent.trim() || '',
    guide: document.querySelector('#stageGuide')?.textContent.trim() || '',
    cards: [...document.querySelectorAll('[data-sli-activity]')].map((card) => card.dataset.sliActivity),
  }))()`);
}

async function gameAudit(client, stage, game) {
  await openStage(client, stage);
  await evaluate(client, `document.querySelector(${JSON.stringify(`[data-sli-activity="${game}"]`)})?.click();`);
  await sleep(80);
  const ready = await evaluate(client, `(() => { const dialog = document.querySelector('.sli-core-shell'); const lab = document.querySelector('.sli-lab'); return { dialog: Boolean(dialog), role: dialog?.getAttribute('role') || '', modal: dialog?.getAttribute('aria-modal') || '', label: dialog?.getAttribute('aria-label') || '', start: document.querySelector('#sliReadyStart')?.textContent.trim() || '', steps: lab?.querySelectorAll('.sli-ready li').length || 0, status: document.querySelector('#sliFeedback')?.textContent.trim() || '', focusInside: Boolean(dialog?.contains(document.activeElement)) }; })()`);
  await evaluate(client, `document.querySelector('#sliReadyStart')?.click();`);
  await sleep(90);
  const initial = await evaluate(client, `(() => { const dialog = document.querySelector('.sli-lab'); const status = document.querySelector('#sliFeedback'); const progress = dialog?.querySelector('[role="progressbar"]'); const kind=${JSON.stringify(game)}; const check = kind==='portal' ? { sourceDraggable: document.querySelector('[data-sli-portal-item]')?.draggable === true, targets: document.querySelectorAll('[data-sli-portal]').length } : ['factory','timeline','courier','debate','interview','resolve'].includes(kind) ? { pieces: document.querySelectorAll('[data-sli-piece]').length, draggable: [...document.querySelectorAll('[data-sli-piece]')].every((piece) => piece.draggable), slots: document.querySelectorAll('[data-sli-slot]').length } : { choices: document.querySelectorAll('[data-sli-choice]').length }; return { dialog: Boolean(dialog), status: { role: status?.getAttribute('role') || '', live: status?.getAttribute('aria-live') || '', atomic: status?.getAttribute('aria-atomic') || '' }, progress: { role: progress?.getAttribute('role') || '', now: progress?.getAttribute('aria-valuenow') || '', min: progress?.getAttribute('aria-valuemin') || '', max: progress?.getAttribute('aria-valuemax') || '' }, lowPressure: ['sliRule','sliRead','sliBreak','sliSound','sliVisual'].every((id) => Boolean(document.getElementById(id))), check }; })()`);
  const interaction = await evaluate(client, `(() => { const kind=${JSON.stringify(game)}; let feedback=''; let drag=false; if (kind==='portal') { const item=document.querySelector('[data-sli-portal-item]'); const target=document.querySelector('[data-sli-portal]'); const dt=new DataTransfer(); item?.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt})); target?.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt})); drag=Boolean(target?.classList.contains('drop-target')); target?.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt})); } else if (['factory','timeline','courier','debate','interview','resolve'].includes(kind)) { const piece=document.querySelector('[data-sli-piece]'); const slot=document.querySelector('[data-sli-slot="0"]'); const dt=new DataTransfer(); piece?.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt})); slot?.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt})); drag=Boolean(slot?.classList.contains('drop-target')); slot?.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt})); } else { document.querySelector('[data-sli-choice]')?.click(); } feedback=document.querySelector('#sliFeedback')?.textContent.trim() || ''; return { drag, feedback }; })()`);
  return { stage, game, ready, initial, interaction };
}

async function keyboardAudit(client) {
  await openStage(client, 'lower');
  await evaluate(client, `document.querySelector('[data-sli-activity="sound"]')?.click();`); await sleep(50);
  return evaluate(client, `(() => { const dialog=document.querySelector('.sli-lab'); const controls=[...dialog.querySelectorAll('button:not([disabled])')].filter((button)=>button.offsetParent!==null); const first=controls[0]; const last=controls.at(-1); first?.focus(); first?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true})); const shiftWrap=document.activeElement===last; last?.focus(); last?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true})); const tabWrap=document.activeElement===first; document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return { tabWrap, shiftWrap, closed:!document.querySelector('.sli-lab'), restored:document.activeElement?.dataset?.sliActivity==='sound' }; })()`);
}

async function mobileAudit(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await openStage(client, 'lower');
  await evaluate(client, `document.querySelector('[data-sli-activity="factory"]')?.click(); document.querySelector('#sliReadyStart')?.click();`); await sleep(90);
  const output = await evaluate(client, `(() => { const dialog=document.querySelector('.sli-lab'); const controls=[...dialog.querySelectorAll('button')].filter((button)=>button.offsetParent!==null).map((button)=>{const box=button.getBoundingClientRect();return { label:button.textContent.trim().slice(0,45), width:Math.round(box.width), height:Math.round(box.height) };}); return { overflow:document.documentElement.scrollWidth>window.innerWidth, dialogWidth:Math.round(dialog?.getBoundingClientRect().width||0), controls:controls.length, narrow:controls.filter((button)=>button.width<40||button.height<40), pieces:[...document.querySelectorAll('[data-sli-piece]')].map((piece)=>{const box=piece.getBoundingClientRect();return {width:Math.round(box.width),height:Math.round(box.height),draggable:piece.draggable};}), slots:[...document.querySelectorAll('[data-sli-slot]')].map((slot)=>{const box=slot.getBoundingClientRect();return {width:Math.round(box.width),height:Math.round(box.height)};}) }; })()`);
  await client.call('Emulation.clearDeviceMetricsOverride');
  return output;
}

try {
  const client = await connect(await targetUrl()); await client.call('Page.enable'); await client.call('Accessibility.enable');
  const menus = []; for (const stage of Object.keys(stages)) menus.push(await menuAudit(client, stage));
  const games = []; for (const [stage, list] of Object.entries(stages)) for (const game of list) games.push(await gameAudit(client, stage, game));
  const keyboard = await keyboardAudit(client); const mobile = await mobileAudit(client); const ax = await client.call('Accessibility.getFullAXTree'); const failures = [];
  menus.forEach((menu) => { const expected = stages[menu.stage]; if (!menu.moduleLoaded || !menu.title.includes('SLI') || !menu.guide.includes('直接選擇') || menu.cards.length !== expected.length || expected.some((game) => !menu.cards.includes(game))) failures.push(`${menu.stage}：SLI 直接選關入口或分學段卡片不完整。`); });
  games.forEach((report) => { const { ready, initial, interaction } = report; if (!ready.dialog || ready.role !== 'dialog' || ready.modal !== 'true' || !ready.label || !ready.start.includes('我準備好了') || ready.steps !== 3 || !ready.status.includes('準備時間') || !ready.focusInside) failures.push(`${report.stage} ${report.game}：教師帶讀準備頁或焦點管理不完整。`); if (!initial.dialog || initial.status.role !== 'status' || initial.status.live !== 'polite' || initial.status.atomic !== 'true' || initial.progress.role !== 'progressbar' || !initial.progress.now || !initial.progress.min || !initial.progress.max || !initial.lowPressure) failures.push(`${report.stage} ${report.game}：動態語意、進度列或低壓工具不完整。`); if (report.game === 'portal' && (!initial.check.sourceDraggable || initial.check.targets !== 3 || !interaction.drag)) failures.push('初小詞彙傳送門：拖拉物件卡或傳送門落點不完整。'); if (['factory','timeline','courier','debate','interview','resolve'].includes(report.game) && (initial.check.pieces < 3 || initial.check.slots < 2 || !initial.check.draggable || !interaction.drag)) failures.push(`${report.stage} ${report.game}：語塊／排序拖拉或落點不完整。`); if (['sound','emotion','subtext'].includes(report.game) && (!initial.check.choices || !interaction.feedback)) failures.push(`${report.stage} ${report.game}：選項作答或動態回饋不完整。`); if (!interaction.feedback) failures.push(`${report.stage} ${report.game}：未產生互動回饋。`); });
  if (!keyboard.tabWrap || !keyboard.shiftWrap || !keyboard.closed || !keyboard.restored) failures.push('SLI 訓練室：Tab 焦點循環、Escape 關閉或焦點回復不完整。');
  if (mobile.overflow || mobile.narrow.length || mobile.pieces.some((item) => item.width < 40 || item.height < 40 || !item.draggable) || mobile.slots.some((item) => item.width < 40 || item.height < 40)) failures.push('SLI 訓練室：375px 手機版有橫向溢出、不足 40px 的控制或拖拉語塊。');
  const output = { standard: 'SLI ten direct-entry games, ready screen, interaction, drag, keyboard, semantics and 375px mobile audit', baseUrl, menus, games, keyboard, mobile, ax: { dialogs: ax.nodes.filter((node) => node.role?.value === 'dialog').length, statuses: ax.nodes.filter((node) => node.role?.value === 'status').length, progressbars: ax.nodes.filter((node) => node.role?.value === 'progressbar').length }, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`); console.log(JSON.stringify({ stages: menus.length, games: games.length, failureCount: failures.length, failures }, null, 2)); client.close();
} finally { chrome.kill('SIGTERM'); }
