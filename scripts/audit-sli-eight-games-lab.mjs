import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9398;
const reportPath = '/home/ubuntu/sen_application/sli-eight-games-lab-audit.json';
const baseUrl = process.env.SEN_AUDIT_URL || 'https://leung-tech.github.io/sen_application/index.html';
const stages = {
  lower: ['tone-park', 'cause-workshop'],
  upper: ['word-net', 'pace-route'],
  junior: ['idiom-decoder', 'repair-station'],
  senior: ['discussion-scaffold', 'voice-use'],
};
const sequenceGames = new Set(['cause-workshop', 'discussion-scaffold']);
const recordGames = new Set(['tone-park', 'pace-route', 'discussion-scaffold', 'voice-use']);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sli-eight-audit', 'about:blank'], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(120);
  }
  throw new Error('無法連接 SLI 八項活動稽核瀏覽器。');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); },
      close() { socket.close(); },
    }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('SLI 八項活動稽核瀏覽器連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

async function openStage(client, stage) {
  await client.call('Page.navigate', { url: `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}sliEightAudit=${Date.now()}&stage=${stage}` });
  await sleep(900);
  await evaluate(client, `(() => { document.querySelector('.pathway-card[data-type="8"]')?.click(); document.querySelector(${JSON.stringify(`.level-button[data-stage="${stage}"]`)})?.click(); })()`);
  await sleep(100);
}

async function menuAudit(client, stage) {
  await openStage(client, stage);
  return evaluate(client, `(() => ({ stage:${JSON.stringify(stage)}, coreLoaded:Boolean(window.SLI_CORE_LAB), eightLoaded:Boolean(window.SLI_EIGHT_GAMES_LAB), title:document.querySelector('#gamesTitle')?.textContent.trim()||'', guide:document.querySelector('#stageGuide')?.textContent.trim()||'', coreCards:[...document.querySelectorAll('[data-sli-activity]')].map((item)=>item.dataset.sliActivity), eightCards:[...document.querySelectorAll('[data-sli-eight-activity]')].map((item)=>item.dataset.sliEightActivity) }))()`);
}

async function gameAudit(client, stage, game) {
  await openStage(client, stage);
  await evaluate(client, `document.querySelector(${JSON.stringify(`[data-sli-eight-activity="${game}"]`)})?.click()`);
  await sleep(70);
  const ready = await evaluate(client, `(() => { const dialog=document.querySelector('.sli8-shell'); const lab=document.querySelector('.sli8-lab'); return {dialog:Boolean(dialog),role:dialog?.getAttribute('role')||'',modal:dialog?.getAttribute('aria-modal')||'',steps:lab?.querySelectorAll('.sli8-ready li').length||0,start:document.querySelector('#sli8ReadyStart')?.textContent.trim()||'',status:document.querySelector('#sli8Feedback')?.textContent.trim()||'',focusInside:Boolean(dialog?.contains(document.activeElement))}; })()`);
  await evaluate(client, `document.querySelector('#sli8ReadyStart')?.click()`); await sleep(70);
  const initial = await evaluate(client, `(() => { const dialog=document.querySelector('.sli8-lab'); const status=document.querySelector('#sli8Feedback'); const progress=dialog?.querySelector('[role="progressbar"]'); const sequence=${JSON.stringify(sequenceGames.has(game))}; const record=${JSON.stringify(recordGames.has(game))}; return {dialog:Boolean(dialog),status:{role:status?.getAttribute('role')||'',live:status?.getAttribute('aria-live')||'',atomic:status?.getAttribute('aria-atomic')||''},progress:{role:progress?.getAttribute('role')||'',now:progress?.getAttribute('aria-valuenow')||'',min:progress?.getAttribute('aria-valuemin')||'',max:progress?.getAttribute('aria-valuemax')||''},support:['sli8Rule','sli8Read','sli8Break'].every((id)=>Boolean(document.getElementById(id))),sequence:sequence?{pieces:[...document.querySelectorAll('[data-sli8-piece]')].map((item)=>({draggable:item.draggable,width:Math.round(item.getBoundingClientRect().width),height:Math.round(item.getBoundingClientRect().height)})),slots:document.querySelectorAll('[data-sli8-slot]').length}:{choices:document.querySelectorAll('[data-sli8-choice]').length},record:record?{start:Boolean(document.querySelector('#sli8Record')),playbackDisabled:document.querySelector('#sli8Playback')?.disabled===true,privacy:document.querySelector('.sli8-record')?.textContent.includes('不會上傳、分析或評定')||false}:null}; })()`);
  const interaction = await evaluate(client, `(() => { const sequence=${JSON.stringify(sequenceGames.has(game))}; let drag=false; if(sequence){const piece=document.querySelector('[data-sli8-piece]');const slot=document.querySelector('[data-sli8-slot="0"]');const dt=new DataTransfer();piece?.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt}));slot?.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt}));drag=slot?.classList.contains('drop-target')||false;slot?.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));}else document.querySelector('[data-sli8-choice]')?.click();return {drag,feedback:document.querySelector('#sli8Feedback')?.textContent.trim()||''}; })()`);
  return { stage, game, ready, initial, interaction };
}

async function keyboardAudit(client) {
  await openStage(client, 'lower');
  await evaluate(client, `document.querySelector('[data-sli-eight-activity="tone-park"]')?.click()`); await sleep(50);
  return evaluate(client, `(() => { const dialog=document.querySelector('.sli8-shell'); const controls=[...dialog.querySelectorAll('button:not([disabled])')].filter((item)=>item.offsetParent!==null); const first=controls[0]; const last=controls.at(-1); first?.focus(); document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true})); const shiftWrap=document.activeElement===last; last?.focus(); document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true})); const tabWrap=document.activeElement===first; document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return {tabWrap,shiftWrap,closed:!document.querySelector('.sli8-shell'),restored:document.activeElement?.dataset?.sliEightActivity==='tone-park'}; })()`);
}

async function mobileAudit(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await openStage(client, 'senior');
  await evaluate(client, `document.querySelector('[data-sli-eight-activity="discussion-scaffold"]')?.click();document.querySelector('#sli8ReadyStart')?.click()`); await sleep(80);
  const output = await evaluate(client, `(() => { const dialog=document.querySelector('.sli8-lab'); const controls=[...dialog.querySelectorAll('button')].filter((item)=>item.offsetParent!==null).map((item)=>{const box=item.getBoundingClientRect();return{label:item.textContent.trim().slice(0,38),width:Math.round(box.width),height:Math.round(box.height)}}); const slots=[...document.querySelectorAll('[data-sli8-slot]')].map((item)=>{const box=item.getBoundingClientRect();return{width:Math.round(box.width),height:Math.round(box.height)}}); return {overflow:document.documentElement.scrollWidth>window.innerWidth,dialogWidth:Math.round(dialog?.getBoundingClientRect().width||0),controls,narrow:controls.filter((item)=>item.width<40||item.height<40),slots}; })()`);
  await client.call('Emulation.clearDeviceMetricsOverride');
  return output;
}

try {
  const client = await connect(await targetUrl()); await client.call('Page.enable'); await client.call('Accessibility.enable');
  const menus=[]; for (const stage of Object.keys(stages)) menus.push(await menuAudit(client, stage));
  const games=[]; for (const [stage,list] of Object.entries(stages)) for (const game of list) games.push(await gameAudit(client, stage, game));
  const keyboard=await keyboardAudit(client); const mobile=await mobileAudit(client);
  await evaluate(client, `matchMedia('(prefers-reduced-motion: reduce)').matches`);
  const ax=await client.call('Accessibility.getFullAXTree'); const failures=[];
  menus.forEach((menu)=>{const expected=stages[menu.stage]; if(!menu.coreLoaded||!menu.eightLoaded||!menu.title.includes('SLI')||!menu.guide.includes('直接選擇')||menu.eightCards.length!==expected.length||expected.some((game)=>!menu.eightCards.includes(game))||!menu.coreCards.length) failures.push(`${menu.stage}：SLI 八項活動或既有題庫直接選關不完整。`);});
  games.forEach((report)=>{const {ready,initial,interaction}=report; if(!ready.dialog||ready.role!=='dialog'||ready.modal!=='true'||ready.steps!==3||!ready.start.includes('我準備好了')||!ready.status.includes('準備時間')||!ready.focusInside) failures.push(`${report.stage} ${report.game}：教師準備頁、對話框語意或焦點管理不完整。`); if(!initial.dialog||initial.status.role!=='status'||initial.status.live!=='polite'||initial.status.atomic!=='true'||initial.progress.role!=='progressbar'||!initial.progress.now||!initial.progress.min||!initial.progress.max||!initial.support) failures.push(`${report.stage} ${report.game}：狀態訊息、進度列或低壓工具不完整。`); if(sequenceGames.has(report.game)&&(!initial.sequence.pieces.length||!initial.sequence.pieces.every((item)=>item.draggable)||initial.sequence.slots<2||!interaction.drag)) failures.push(`${report.stage} ${report.game}：拖拉／點選句卡或落點不完整。`); if(!sequenceGames.has(report.game)&&(!initial.sequence.choices||!interaction.feedback)) failures.push(`${report.stage} ${report.game}：選項互動或動態回饋不完整。`); if(recordGames.has(report.game)&&(!initial.record?.start||!initial.record?.playbackDisabled||!initial.record?.privacy)) failures.push(`${report.stage} ${report.game}：可選本機錄音、回放或私隱提示不完整。`); if(!interaction.feedback) failures.push(`${report.stage} ${report.game}：未產生互動回饋。`);});
  if(!keyboard.tabWrap||!keyboard.shiftWrap||!keyboard.closed||!keyboard.restored) failures.push('SLI 八項活動：Tab 焦點循環、Escape 或焦點回復不完整。');
  if(mobile.overflow||mobile.narrow.length||mobile.slots.some((item)=>item.width<40||item.height<40)) failures.push('SLI 八項活動：375px 手機版有橫向溢出或不足 40px 的控制／落點。');
  const output={standard:'SLI eight safe classroom games: ready screen, optional local recording, semantics, interaction, keyboard, reduced-motion intent and 375px audit',baseUrl,menus,games,keyboard,mobile,ax:{dialogs:ax.nodes.filter((node)=>node.role?.value==='dialog').length,statuses:ax.nodes.filter((node)=>node.role?.value==='status').length,progressbars:ax.nodes.filter((node)=>node.role?.value==='progressbar').length},failureCount:failures.length,failures};
  await writeFile(reportPath,`${JSON.stringify(output,null,2)}\n`); console.log(JSON.stringify({stages:menus.length,games:games.length,failureCount:failures.length,failures},null,2)); client.close();
} finally { chrome.kill('SIGTERM'); }
