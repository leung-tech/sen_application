import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9332;
const pageUrl = 'file:///home/ubuntu/sen_application/index.html?senType=SpLD&stageLevel=S4%E2%80%93S6&mobileAudit=senior';
const screenshotPath = '/home/ubuntu/sen_application/s4-mobile-polysemy-lab.png';
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-s4-mobile-cdp', '--window-size=375,812', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTarget() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((item) => item.type === 'page');
      if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
    } catch {}
    await sleep(150);
  }
  throw new Error('無法連接高中手機版檢查瀏覽器。');
}

async function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let sequence = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { const id = ++sequence; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall })); },
      close() { socket.close(); }
    }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); const entry = pending.get(message.id); if (!entry) return; pending.delete(message.id); message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('高中手機版檢查瀏覽器連線失敗。')));
  });
}

try {
  const client = await connect(await getTarget());
  await client.call('Page.enable');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await client.call('Page.navigate', { url: pageUrl });
  await sleep(1500);
  const evaluation = await client.call('Runtime.evaluate', { expression: `(() => {
    const card = document.querySelector('[data-spld-s4-activity="polysemy"]');
    if (!card || !window.SPLD_S4_LAB) return { error: '高中 SpLD 卡片或模組未載入。' };
    card.click();
    const measurements = (selector) => Array.from(document.querySelectorAll(selector)).map((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return { text: element.textContent.trim(), width: Math.round(rect.width), height: Math.round(rect.height), fontSize: style.fontSize }; });
    const lab = document.querySelector('.spld-s4-lab'); const rect = lab.getBoundingClientRect();
    return { viewport: { width: innerWidth, height: innerHeight }, lab: { width: Math.round(rect.width), height: Math.round(rect.height), left: Math.round(rect.left), top: Math.round(rect.top) }, title: lab.querySelector('h2')?.textContent.trim(), prompt: measurements('.spld-s4-prompt'), choices: measurements('.spld-s4-choice'), tools: measurements('.spld-s4-tools button'), overflowX: document.documentElement.scrollWidth > innerWidth };
  })()`, returnByValue: true });
  const screenshot = await client.call('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  console.log(JSON.stringify(evaluation.result.value, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
