import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9333;
const screenshotPath = '/home/ubuntu/sen_application/s4-mobile-surgery-lab.png';
const pageUrl = 'file:///home/ubuntu/sen_application/index.html?senType=SpLD&stageLevel=S4%E2%80%93S6&mobileAudit=all';
const activities = ['polysemy', 'loan', 'argument', 'functionWord', 'academic', 'surgery'];
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-s4-mobile-all-cdp', '--window-size=375,812', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function targetUrl() {
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
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await client.call('Page.navigate', { url: pageUrl });
  await sleep(1600);
  const results = [];
  for (const activity of activities) {
    const check = await client.call('Runtime.evaluate', { expression: `(() => {
      window.SPLD_S4_LAB?.openActivity(${JSON.stringify(activity)});
      const lab = document.querySelector('.spld-s4-lab');
      const measure = (selector) => Array.from(lab.querySelectorAll(selector)).map((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return { width: Math.round(rect.width), height: Math.round(rect.height), fontSize: style.fontSize, text: element.textContent.trim() }; });
      const hintButton = lab.querySelector('#spldS4Hint'); hintButton?.click();
      const feedback = lab.querySelector('#spldS4Feedback')?.textContent.trim() || '';
      return { activity: ${JSON.stringify(activity)}, title: lab.querySelector('h2')?.textContent.trim(), prompt: measure('.spld-s4-prompt')[0], choices: measure('.spld-s4-choice'), tools: measure('.spld-s4-tools button'), hintVisible: feedback.startsWith('💡'), overflowX: document.documentElement.scrollWidth > innerWidth, readLabel: lab.querySelector('#spldS4Read')?.textContent.trim(), hintLabel: hintButton?.textContent.trim() };
    })()`, returnByValue: true });
    results.push(check.result.value);
    await sleep(70);
  }
  await client.call('Runtime.evaluate', { expression: 'window.SPLD_S4_LAB?.openActivity("surgery")' });
  const screenshot = await client.call('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  console.log(JSON.stringify(results, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
