import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9331;
const pageUrl = 'https://leung-tech.github.io/sen_application/index.html?senType=SpLD&stageLevel=S1%E2%80%93S3&mobileAudit=interaction';
const screenshotPath = '/home/ubuntu/sen_application/s1-mobile-connector-lab.png';
const chrome = spawn('chromium', [
  '--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`,
  '--user-data-dir=/tmp/sen-s1-mobile-cdp', '--window-size=375,812', 'about:blank'
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitForTarget = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const target = targets.find((item) => item.type === 'page');
      if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
    } catch {}
    await sleep(150);
  }
  throw new Error('無法連接手機版檢查瀏覽器。');
};

const connect = async (url) => new Promise((resolve, reject) => {
  const socket = new WebSocket(url);
  const pending = new Map();
  let sequence = 0;
  socket.addEventListener('open', () => resolve({
    call(method, params = {}) {
      const id = ++sequence;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall }));
    },
    close() { socket.close(); }
  }));
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
  });
  socket.addEventListener('error', () => reject(new Error('手機版檢查瀏覽器連線失敗。')));
});

try {
  const client = await connect(await waitForTarget());
  await client.call('Page.enable');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await client.call('Page.navigate', { url: pageUrl });
  await sleep(1800);
  const evaluation = await client.call('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('[data-spld-s1-activity="connector"]');
      if (!card || !window.SPLD_S1_LAB) return { error: '初中 SpLD 卡片或模組未載入。' };
      card.click();
      const lab = document.querySelector('.spld-s1-lab');
      const select = (selector) => Array.from(document.querySelectorAll(selector)).map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { text: element.textContent.trim(), width: Math.round(rect.width), height: Math.round(rect.height), left: Math.round(rect.left), top: Math.round(rect.top), fontSize: style.fontSize };
      });
      const labRect = lab?.getBoundingClientRect();
      return {
        viewport: { width: innerWidth, height: innerHeight },
        lab: labRect && { width: Math.round(labRect.width), height: Math.round(labRect.height), left: Math.round(labRect.left), top: Math.round(labRect.top) },
        title: lab?.querySelector('h2')?.textContent.trim(),
        prompt: select('.spld-s1-prompt'),
        choices: select('.spld-s1-choice'),
        tools: select('.spld-s1-tools button'),
        overflowX: document.documentElement.scrollWidth > innerWidth
      };
    })()`,
    returnByValue: true
  });
  const screenshot = await client.call('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  console.log(JSON.stringify(evaluation.result.value, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
