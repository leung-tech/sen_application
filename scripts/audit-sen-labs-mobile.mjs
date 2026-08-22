import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9336;
const outputPath = '/home/ubuntu/sen_application/sen-labs-mobile-audit.json';
const pageUrl = 'file:///home/ubuntu/sen_application/index.html?senAudit=labs';
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-labs-audit-cdp', '--window-size=375,812', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function targetUrl() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { const target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((item) => item.type === 'page'); if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl; } catch {}
    await sleep(150);
  }
  throw new Error('無法連接專屬遊戲手機稽核瀏覽器。');
}

async function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let sequence = 0;
    socket.addEventListener('open', () => resolve({ call(method, params = {}) { const id = ++sequence; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); const entry = pending.get(message.id); if (!entry) return; pending.delete(message.id); message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('專屬遊戲手機稽核瀏覽器連線失敗。')));
  });
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await client.call('Page.navigate', { url: pageUrl });
  await sleep(1600);
  const catalog = await client.call('Runtime.evaluate', { expression: `(() => ({
    p1: window.SPLD_P1_LAB?.activityCards?.().map((card) => card.activityKey) || [],
    p4: window.SPLD_P4_LAB?.activityCards?.().map((card) => card.p4ActivityKey) || [],
    s1: window.SPLD_S1_LAB?.activityCards?.().map((card) => card.s1ActivityKey) || [],
    s4: window.SPLD_S4_LAB?.activityCards?.().map((card) => card.s4ActivityKey) || []
  }))()`, returnByValue: true });
  const mapping = { p1: ['SPLD_P1_LAB', '.spld-p1-lab'], p4: ['SPLD_P4_LAB', '.spld-p4-lab'], s1: ['SPLD_S1_LAB', '.spld-s1-lab'], s4: ['SPLD_S4_LAB', '.spld-s4-lab'] };
  const results = [];
  for (const [lab, activities] of Object.entries(catalog.result.value)) {
    for (const activity of activities) {
      const [objectName, selector] = mapping[lab];
      const measure = await client.call('Runtime.evaluate', { expression: `(() => {
        window.${objectName}.openActivity(${JSON.stringify(activity)});
        const root = document.querySelector(${JSON.stringify(selector)});
        const targetSelectors = 'button, [role="button"]';
        const rects = [...(root?.querySelectorAll(targetSelectors) || [])].map((element) => { const rect = element.getBoundingClientRect(); return { width: Math.round(rect.width), height: Math.round(rect.height) }; }).filter((rect) => rect.width > 0 && rect.height > 0);
        const labRect = root?.getBoundingClientRect();
        return { lab: ${JSON.stringify(lab)}, activity: ${JSON.stringify(activity)}, found: Boolean(root), horizontalOverflow: document.documentElement.scrollWidth > innerWidth, labWidth: Math.round(labRect?.width || 0), toolCount: rects.length, minTargetHeight: rects.length ? Math.min(...rects.map((rect) => rect.height)) : 0, minTargetWidth: rects.length ? Math.min(...rects.map((rect) => rect.width)) : 0 };
      })()`, returnByValue: true });
      results.push(measure.result.value); await sleep(45);
    }
  }
  const adhd = await client.call('Runtime.evaluate', { expression: `(() => { window.ADHD_FOCUS_LAB?.open(); const root = document.querySelector('#adhdFocusLabRoot'); const rects = [...(root?.querySelectorAll('button') || [])].map((element) => { const rect = element.getBoundingClientRect(); return { width: Math.round(rect.width), height: Math.round(rect.height) }; }).filter((rect) => rect.width > 0 && rect.height > 0); return { lab: 'adhd', activity: 'home', found: Boolean(root), horizontalOverflow: document.documentElement.scrollWidth > innerWidth, labWidth: Math.round(root?.getBoundingClientRect().width || 0), toolCount: rects.length, minTargetHeight: rects.length ? Math.min(...rects.map((rect) => rect.height)) : 0, minTargetWidth: rects.length ? Math.min(...rects.map((rect) => rect.width)) : 0 }; })()`, returnByValue: true });
  results.push(adhd.result.value);
  const failures = results.filter((result) => !result.found || result.horizontalOverflow || result.labWidth > 375 || result.minTargetHeight < 36);
  const report = { checkCount: results.length, failureCount: failures.length, failures, results };
  await writeFile(outputPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checkCount: report.checkCount, failureCount: report.failureCount, failures }, null, 2));
  client.close();
} finally { chrome.kill('SIGTERM'); }
