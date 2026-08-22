import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const port = 9335;
const outputPath = '/home/ubuntu/sen_application/sen-layout-audit.json';
const screenshotDir = '/home/ubuntu/sen_application/layout-audit-screenshots';
const baseUrl = 'file:///home/ubuntu/sen_application/index.html';
const viewports = [{ name: 'desktop', width: 1280, height: 720 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 375, height: 812 }];
const routes = ['SpLD', 'ID', 'ASD', 'ADHD', 'EBD', 'Giftedness', 'HI', 'SLI', 'MI'].flatMap((senType) => ['P1–P3', 'P4–P6', 'S1–S3', 'S4–S6'].map((stageLevel) => ({ senType, stageLevel })));
const showcases = new Map([['desktop', { senType: 'SpLD', stageLevel: 'S4–S6' }], ['tablet', { senType: 'ASD', stageLevel: 'S1–S3' }], ['mobile', { senType: 'SpLD', stageLevel: 'S1–S3' }]]);
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-layout-audit-cdp', '--window-size=1280,720', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function targetUrl() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { const target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((item) => item.type === 'page'); if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl; } catch {}
    await sleep(150);
  }
  throw new Error('無法連接版面稽核瀏覽器。');
}

async function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let sequence = 0;
    socket.addEventListener('open', () => resolve({ call(method, params = {}) { const id = ++sequence; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); const entry = pending.get(message.id); if (!entry) return; pending.delete(message.id); message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('版面稽核瀏覽器連線失敗。')));
  });
}

try {
  await mkdir(screenshotDir, { recursive: true });
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  const results = [];
  for (const viewport of viewports) {
    await client.call('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.name === 'mobile' });
    for (const route of routes) {
      const params = new URLSearchParams(route);
      await client.call('Page.navigate', { url: `${baseUrl}?${params}` });
      await sleep(280);
      const measure = await client.call('Runtime.evaluate', { expression: `(() => {
        const visible = (element) => { const style = getComputedStyle(element); const rect = element.getBoundingClientRect(); return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0; };
        const cards = [...document.querySelectorAll('.game-card')].filter(visible);
        const pathwayCards = [...document.querySelectorAll('.pathway-card')].filter(visible);
        const measurements = cards.map((card) => { const rect = card.getBoundingClientRect(); return { width: Math.round(rect.width), height: Math.round(rect.height), left: Math.round(rect.left), right: Math.round(rect.right) }; });
        const directControls = [...document.querySelectorAll('.game-card, .pathway-card, .lesson-mode-toggle, #projectorButton, #fullscreenButton')].filter(visible).map((element) => { const rect = element.getBoundingClientRect(); return { width: Math.round(rect.width), height: Math.round(rect.height) }; });
        return { scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, cardCount: cards.length, pathwayCardCount: pathwayCards.length, cardsWithinViewportWidth: measurements.every((card) => card.left >= 0 && card.right <= innerWidth), minGameCardWidth: measurements.length ? Math.min(...measurements.map((card) => card.width)) : 0, minGameCardHeight: measurements.length ? Math.min(...measurements.map((card) => card.height)) : 0, minPrimaryTargetWidth: directControls.length ? Math.min(...directControls.map((target) => target.width)) : 0, minPrimaryTargetHeight: directControls.length ? Math.min(...directControls.map((target) => target.height)) : 0 };
      })()`, returnByValue: true });
      results.push({ viewport: viewport.name, route, ...measure.result.value });
    }
    const showcase = showcases.get(viewport.name); const params = new URLSearchParams(showcase);
    await client.call('Page.navigate', { url: `${baseUrl}?${params}` }); await sleep(180);
    const screenshot = await client.call('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
    await writeFile(`${screenshotDir}/${viewport.name}.png`, Buffer.from(screenshot.data, 'base64'));
  }
  const failures = results.filter((result) => result.horizontalOverflow || result.cardCount < 1 || !result.cardsWithinViewportWidth || result.minGameCardHeight < 44);
  const report = { routeCount: routes.length, checkCount: results.length, failureCount: failures.length, failures, results };
  await writeFile(outputPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ routeCount: report.routeCount, checkCount: report.checkCount, failureCount: report.failureCount, failures: report.failures }, null, 2));
  client.close();
} finally { chrome.kill('SIGTERM'); }
