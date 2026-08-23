import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const port = 9399;
const baseUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html';
const outFile = '/home/ubuntu/sen_application/gifted-eight-mobile-detail-audit.json';
const shotDir = '/home/ubuntu/sen_application/gifted-eight-mobile-screenshots';
const activities = { lower: ['flex-castle', 'selective-listening'], upper: ['viewpoint-studio', 'rule-sandbox'], junior: ['perspective-toolkit', 'tone-workbench'], senior: ['achievement-map', 'values-sandbox'] };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/gifted-eight-mobile-detail', 'about:blank'], { stdio: 'ignore' });

async function websocketUrl() {
  for (let i = 0; i < 50; i += 1) {
    try { const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json()); const page = pages.find((item) => item.type === 'page'); if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl; } catch {}
    await sleep(100);
  }
  throw new Error('無法連接 Giftedness 375px 稽核瀏覽器。');
}
function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({ call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('Giftedness 375px 稽核瀏覽器連線失敗。')));
  });
}
async function evaluate(client, expression) { const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); return result.result.value; }
async function openStage(client, stage) {
  await client.call('Page.navigate', { url: `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}giftedMobileDetail=${Date.now()}` }); await sleep(900);
  await evaluate(client, `(() => { document.querySelector('.pathway-card[data-type="G"]')?.click(); document.querySelector('.level-button[data-stage="${stage}"]')?.click(); })()`); await sleep(100);
}
async function screenshot(client, name) {
  const shot = await client.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  await writeFile(`${shotDir}/${name}.png`, Buffer.from(shot.data, 'base64'));
}
const measurements = (scope) => `(() => {
  const root=${scope}; const rect=(node)=>{const r=node.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),right:Math.round(r.right),bottom:Math.round(r.bottom)}};
  const visible=(node)=>node.offsetParent!==null; const buttons=[...root.querySelectorAll('button')].filter(visible).map((node)=>({text:node.textContent.trim().replace(/\\s+/g,' ').slice(0,48),...rect(node)}));
  const overflow=[...root.querySelectorAll('*')].filter(visible).map((node)=>{const s=getComputedStyle(node); return {tag:node.tagName,cls:String(node.className||''),text:(node.textContent||'').trim().replace(/\\s+/g,' ').slice(0,60),sw:Math.round(node.scrollWidth),cw:Math.round(node.clientWidth),overflowX:s.overflowX};}).filter((item)=>item.sw>item.cw+1&&item.overflowX!=='visible');
  return {rect:rect(root),buttons,tooSmall:buttons.filter((item)=>item.w<40||item.h<40),overflow,documentOverflow:document.documentElement.scrollWidth>window.innerWidth};
})()`;

try {
  await mkdir(shotDir, { recursive: true }); const client = await connect(await websocketUrl()); await client.call('Page.enable');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  const menus = []; const games = [];
  for (const [stage, ids] of Object.entries(activities)) {
    await openStage(client, stage);
    menus.push({ stage, documentOverflow: await evaluate(client, 'document.documentElement.scrollWidth>window.innerWidth'), cards: await evaluate(client, `([...document.querySelectorAll('[data-gifted-eight-activity]')].map((node)=>({id:node.dataset.giftedEightActivity,text:node.innerText.trim().replace(/\\s+/g,' ').slice(0,150),overflow:node.scrollWidth>node.clientWidth+1,rect:(()=>{const r=node.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),right:Math.round(r.right)}})()})))`) });
    for (const id of ids) {
      await evaluate(client, `document.querySelector(${JSON.stringify(`[data-gifted-eight-activity="${id}"]`)})?.click()`); await sleep(50);
      const ready = await evaluate(client, measurements('document.querySelector(".g8-dialog")'));
      await evaluate(client, `document.querySelector('[data-action="start"]')?.click()`); await sleep(50);
      const play = await evaluate(client, measurements('document.querySelector(".g8-dialog")'));
      const detail = await evaluate(client, `(() => ({id:${JSON.stringify(id)},dialogRole:document.querySelector('.g8-dialog')?.getAttribute('role')||'',dialogModal:document.querySelector('.g8-dialog')?.getAttribute('aria-modal')||'',progress:Boolean(document.querySelector('[role="progressbar"]')),status:document.querySelector('[data-role="status"]')?.getAttribute('aria-live')||'',dragCards:[...document.querySelectorAll('[data-g8-card]')].map((node)=>node.getAttribute('draggable')),clickAlternative:Boolean(document.querySelector('[data-g8-card]')&&document.querySelector('[data-g8-slot]')),valueSkip:Boolean(document.querySelector('[data-action="skip-values"]')),valueDecline:Boolean(document.querySelector('[data-action="decline-values"]'))}))()`);
      games.push({ stage, id, ready, play, detail });
      if (id === 'flex-castle' || id === 'values-sandbox') await screenshot(client, id);
      await evaluate(client, `document.querySelector('[data-action="close"]')?.click()`); await sleep(30);
    }
  }
  const failures = [];
  menus.forEach((menu) => { const expected=activities[menu.stage]; if (menu.documentOverflow || menu.cards.length!==expected.length || menu.cards.some((card)=>card.right>375||card.h<40||card.overflow)) failures.push(`${menu.stage} 直接選關：溢出、觸控範圍或卡片尺寸不符合。`); });
  games.forEach((game) => { if (game.ready.documentOverflow||game.play.documentOverflow||game.ready.tooSmall.length||game.play.tooSmall.length||game.ready.overflow.length||game.play.overflow.length) failures.push(`${game.id}：375px 對話框有溢出或控制不足 40px。`); if (game.ready.rect.w>375||game.play.rect.w>375||game.ready.rect.x<0||game.play.rect.x<0) failures.push(`${game.id}：375px 對話框寬度或邊距不正確。`); if (game.detail.dialogRole!=='dialog'||game.detail.dialogModal!=='true'||!game.detail.progress||game.detail.status!=='polite') failures.push(`${game.id}：手機版語意或進度元素不完整。`); });
  const castle=games.find((game)=>game.id==='flex-castle'); const values=games.find((game)=>game.id==='values-sandbox'); if (!castle?.detail.dragCards?.every((item)=>item==='true')||!castle?.detail.clickAlternative) failures.push('彈性城堡：手機版拖拉／點選替代不完整。'); if (!values?.detail.valueSkip||!values?.detail.valueDecline) failures.push('哲學價值沙盒：手機版略過或拒絕價值卡控制不完整。');
  const output={standard:'Giftedness eight activities detailed 375px direct-card, ready, dialog, touch target, overflow, alternative interaction and semantic audit',baseUrl,viewport:{width:375,height:812},menus,games,screenshots:[`${shotDir}/flex-castle.png`,`${shotDir}/values-sandbox.png`],failureCount:failures.length,failures};
  await writeFile(outFile, `${JSON.stringify(output,null,2)}\n`); console.log(JSON.stringify({menus:menus.length,games:games.length,failureCount:failures.length,failures},null,2)); client.close();
} finally { chrome.kill('SIGTERM'); }
