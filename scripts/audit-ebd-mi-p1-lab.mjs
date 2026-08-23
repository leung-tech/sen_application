import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9371;
const baseUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html';
const reportPath = '/home/ubuntu/sen_application/ebd-mi-p1-lab-audit.json';
const activities = {
  lower: { ebd: ['ebd-cool', 'ebd-stop', 'ebd-rhythm', 'ebd-tidy'], mi: ['mi-bubble', 'mi-safe', 'mi-calm', 'mi-breath'] },
  upper: { ebd: ['ebd-emotion-clue', 'ebd-pause-plan', 'ebd-repair-choice', 'ebd-classroom-reset'], mi: ['mi-weather-map', 'mi-support-menu', 'mi-thought-cloud', 'mi-small-step-route'] },
  junior: { ebd: ['ebd-tone-workshop', 'ebd-conflict-route', 'ebd-chain-clue', 'ebd-reset-rhythm'], mi: ['mi-context-card', 'mi-network-map', 'mi-anchor-breath', 'mi-task-breakdown'] },
  senior: { ebd: ['ebd-workplace-tone', 'ebd-incident-order', 'ebd-boundary-plan', 'ebd-reset-plan'], mi: ['mi-practicum-prep', 'mi-pressure-signal', 'mi-need-statement', 'mi-daily-return'] },
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/ebd-mi-p1-audit', 'about:blank'], { stdio: 'ignore' });

async function websocketUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = pages.find((item) => item.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error('無法連接 EBD／MI 稽核瀏覽器。');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); },
      close() { socket.close(); },
    }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('EBD／MI 稽核瀏覽器連線失敗。')));
  });
}
async function evaluate(client, expression) { const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); return result.result.value; }
async function openTrack(client, track, stage = 'lower') {
  const type = track === 'ebd' ? 'E' : '9';
  await client.call('Page.navigate', { url: `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}ebdMiAudit=${Date.now()}` }); await sleep(900);
  await evaluate(client, `(() => { document.querySelector('.pathway-card[data-type="${type}"]')?.click(); document.querySelector('.level-button[data-stage="${stage}"]')?.click(); })()`); await sleep(90);
}
async function interact(client) {
  const kind = await evaluate(client, `(() => ({ hold:Boolean(document.querySelector('[data-hold]')), go:Boolean(document.querySelector('[data-go]')), rhythm:Boolean(document.querySelector('[data-breath]')), next:Boolean(document.querySelector('[data-next]')), bubble:Boolean(document.querySelector('[data-bubble]')), calm:Boolean(document.querySelector('[data-calm]')), source:Boolean(document.querySelector('.ebdmi-source')), sourceValue:document.querySelector('.ebdmi-source')?.dataset.value||'' }))()`);
  if (kind.hold) await evaluate(client, `(() => { document.querySelector('[data-hold]')?.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); document.querySelector('[data-release]')?.click(); })()`);
  else if (kind.go) await evaluate(client, `(() => { document.querySelector('[data-go]')?.click(); document.querySelector('[data-stopped]')?.click(); })()`);
  else if (kind.rhythm) await evaluate(client, `(() => { for(let i=0;i<3;i+=1) document.querySelector('[data-breath]')?.click(); })()`);
  else if (kind.next) await evaluate(client, `(() => { for(let i=0;i<3;i+=1) document.querySelector('[data-next]')?.click(); })()`);
  else if (kind.bubble) await evaluate(client, `(() => { document.querySelector('[data-bubble]')?.click(); document.querySelector('[data-support-choice]')?.click(); })()`);
  else if (kind.calm) await evaluate(client, `document.querySelector('[data-calm]')?.click()`);
  else if (kind.source && kind.sourceValue === 'support') await evaluate(client, `(() => { document.querySelector('.ebdmi-source')?.click(); document.querySelector('.ebdmi-zone')?.click(); })()`);
  else if (kind.source) {
    for (let index = 0; index < 3; index += 1) {
      await evaluate(client, `(() => { const source=document.querySelector('.ebdmi-source'); const zone=[...document.querySelectorAll('.ebdmi-zone')].find((item)=>item.dataset.zone===source?.dataset.value); const dt=new DataTransfer(); source?.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt})); zone?.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt})); zone?.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt})); })()`);
      await sleep(340);
    }
  }
  return evaluate(client, `(() => ({ complete:Boolean(document.querySelector('.ebdmi-complete')), status:document.querySelector('[data-ebdmi-status]')?.textContent.trim()||'', progress:document.querySelector('[data-ebdmi-progress]')?.style.width||'' }))()`);
}
async function auditActivity(client, stage, track, id) {
  await openTrack(client, track, stage);
  await evaluate(client, `(() => { const card=document.querySelector(${JSON.stringify(`[data-ebdmi-activity="${id}"]`)}); card?.focus(); card?.click(); })()`); await sleep(60);
  const ready = await evaluate(client, `(() => { const dialog=document.querySelector('.ebdmi-dialog'); return { dialog:Boolean(dialog), role:dialog?.getAttribute('role')||'', modal:dialog?.getAttribute('aria-modal')||'', rules:dialog?.querySelectorAll('.ebdmi-rules li').length||0, start:[...dialog?.querySelectorAll('button')||[]].some((button)=>button.textContent.includes('我準備好了')), focusInside:Boolean(dialog?.contains(document.activeElement)) }; })()`);
  await evaluate(client, `[...document.querySelectorAll('button')].find((button)=>button.textContent.includes('我準備好了'))?.click()`); await sleep(50);
  const initial = await evaluate(client, `(() => { const dialog=document.querySelector('.ebdmi-dialog'); const progress=dialog?.querySelector('[role="progressbar"]'); return { dialog:Boolean(dialog), status:{role:document.querySelector('[data-ebdmi-status]')?.getAttribute('role')||'',live:document.querySelector('[data-ebdmi-status]')?.getAttribute('aria-live')||'',atomic:document.querySelector('[data-ebdmi-status]')?.getAttribute('aria-atomic')||''}, progress:{role:progress?.getAttribute('role')||'',min:progress?.getAttribute('aria-valuemin')||'',max:progress?.getAttribute('aria-valuemax')||''}, adult:Boolean(document.querySelector('[data-adult]')), pause:Boolean(document.querySelector('[data-pause]')), leave:Boolean(document.querySelector('[data-leave]')), draggable:[...document.querySelectorAll('.ebdmi-source')].every((node)=>node.draggable) }; })()`);
  const interaction = await interact(client);
  return { stage, track, id, ready, initial, interaction };
}
async function keyboardAudit(client) {
  await openTrack(client, 'ebd', 'lower'); await evaluate(client, `(() => { const card=document.querySelector('[data-ebdmi-activity="ebd-cool"]'); card?.focus(); card?.click(); })()`); await sleep(50);
  return evaluate(client, `(() => { const dialog=document.querySelector('.ebdmi-dialog'); const controls=[...dialog.querySelectorAll('button:not([disabled])')]; const first=controls[0],last=controls.at(-1); first?.focus(); first?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true})); const shiftWrap=document.activeElement===last; last?.focus(); last?.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true})); const tabWrap=document.activeElement===first; dialog?.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return {tabWrap,shiftWrap,closed:!document.querySelector('.ebdmi-dialog'),restored:document.activeElement?.dataset?.ebdmiActivity==='ebd-cool'}; })()`);
}
async function mobileAudit(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await openTrack(client, 'mi', 'lower'); await evaluate(client, `document.querySelector('[data-ebdmi-activity="mi-safe"]')?.click(); [...document.querySelectorAll('button')].find((button)=>button.textContent.includes('我準備好了'))?.click();`); await sleep(60);
  const report = await evaluate(client, `(() => { const dialog=document.querySelector('.ebdmi-dialog'); const controls=[...dialog.querySelectorAll('button')].filter((item)=>item.offsetParent!==null).map((item)=>{const r=item.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}}); const sources=[...document.querySelectorAll('.ebdmi-source')].map((item)=>{const r=item.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),draggable:item.draggable}}); const zones=[...document.querySelectorAll('.ebdmi-zone')].map((item)=>{const r=item.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}}); return {overflow:document.documentElement.scrollWidth>window.innerWidth,dialogWidth:Math.round(dialog?.getBoundingClientRect().width||0),narrow:controls.filter((item)=>item.w<40||item.h<40),sources,zones}; })()`);
  await client.call('Emulation.clearDeviceMetricsOverride'); return report;
}

try {
  const client = await connect(await websocketUrl()); await client.call('Page.enable'); await client.call('Accessibility.enable');
  const menus = []; for (const [stage, tracks] of Object.entries(activities)) for (const [track, ids] of Object.entries(tracks)) { await openTrack(client, track, stage); menus.push(await evaluate(client, `(() => ({stage:${JSON.stringify(stage)},track:${JSON.stringify(track)},loaded:Boolean(window.EBD_MI_CORE_LAB),cards:[...document.querySelectorAll('[data-ebdmi-activity]')].map((node)=>node.dataset.ebdmiActivity)}))()`)); }
  const games = []; for (const [stage, tracks] of Object.entries(activities)) for (const [track, ids] of Object.entries(tracks)) for (const id of ids) games.push(await auditActivity(client, stage, track, id));
  const keyboard = await keyboardAudit(client); const mobile = await mobileAudit(client); const failures = [];
  menus.forEach((menu) => { const expected = activities[menu.stage][menu.track]; if (!menu.loaded || menu.cards.length !== expected.length || expected.some((id)=>!menu.cards.includes(id))) failures.push(`${menu.stage} ${menu.track}：直接選關不完整。`); });
  games.forEach((game) => { if (!game.ready.dialog || game.ready.role!=='dialog' || game.ready.modal!=='true' || game.ready.rules!==3 || !game.ready.start || !game.ready.focusInside) failures.push(`${game.id}：教師準備頁或焦點管理不完整。`); if (!game.initial.dialog || game.initial.status.role!=='status' || game.initial.status.live!=='polite' || game.initial.status.atomic!=='true' || game.initial.progress.role!=='progressbar' || !game.initial.progress.min || !game.initial.progress.max || !game.initial.adult || !game.initial.pause || !game.initial.leave) failures.push(`${game.id}：動態語意、進度或低壓支持不完整。`); if (!game.interaction.complete || game.interaction.progress!=='100%') failures.push(`${game.id}：核心互動未完成。`); });
  if (!keyboard.tabWrap || !keyboard.shiftWrap || !keyboard.closed || !keyboard.restored) failures.push('EBD／MI：Tab 焦點循環、Escape 或焦點回復不完整。');
  if (mobile.overflow || mobile.narrow.length || mobile.sources.some((item)=>item.w<40||item.h<40||!item.draggable) || mobile.zones.some((item)=>item.w<40||item.h<40)) failures.push('EBD／MI：375px 手機版有橫向溢出、控制不足 40px 或拖拉卡不完整。');
  const output = { standard:'EBD/MI four-stage 32 direct-entry games, preparation, safe low-pressure interactions, keyboard and 375px audit', baseUrl, menus, games, keyboard, mobile, failureCount:failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output,null,2)}\n`); console.log(JSON.stringify({tracks:menus.length,games:games.length,failureCount:failures.length,failures},null,2)); client.close();
} finally { chrome.kill('SIGTERM'); }
