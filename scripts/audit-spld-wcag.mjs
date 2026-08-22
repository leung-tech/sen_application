import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9337;
const pageUrl = 'file:///home/ubuntu/sen_application/index.html?senType=SpLD&stageLevel=S1%E2%80%93S3';
const outputPath = '/home/ubuntu/sen_application/spld-wcag-audit.json';
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/spld-wcag-audit-cdp', '--window-size=1280,720', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function targetUrl() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { const target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((item) => item.type === 'page'); if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl; } catch {}
    await sleep(150);
  }
  throw new Error('無法連接 WCAG 稽核瀏覽器。');
}

async function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let sequence = 0;
    socket.addEventListener('open', () => resolve({ call(method, params = {}) { const id = ++sequence; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); const entry = pending.get(message.id); if (!entry) return; pending.delete(message.id); message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('WCAG 稽核瀏覽器連線失敗。')));
  });
}

const inspect = (lab, selector, feedbackSelector) => `(() => {
  const dialog = document.querySelector(${JSON.stringify(selector)});
  const feedback = document.querySelector(${JSON.stringify(feedbackSelector)});
  const progress = dialog?.querySelector('[role="progressbar"]');
  const controls = [...(dialog?.querySelectorAll('button') || [])];
  return {
    lab: ${JSON.stringify(lab)},
    dialogFound: Boolean(dialog),
    dialogRole: dialog?.getAttribute('role') || '',
    modal: dialog?.getAttribute('aria-modal') || '',
    dialogName: dialog?.getAttribute('aria-label') || dialog?.getAttribute('aria-labelledby') || '',
    focusInsideDialog: Boolean(dialog?.contains(document.activeElement)),
    activeElement: document.activeElement?.id || document.activeElement?.className || document.activeElement?.tagName || '',
    feedbackRole: feedback?.getAttribute('role') || '',
    feedbackLive: feedback?.getAttribute('aria-live') || '',
    feedbackAtomic: feedback?.getAttribute('aria-atomic') || '',
    progressRole: progress?.getAttribute('role') || '',
    progressValue: progress?.getAttribute('aria-valuenow') || '',
    unnamedControls: controls.filter((button) => !(button.getAttribute('aria-label') || button.textContent.trim())).length,
    controlCount: controls.length,
    hasReducedMotionRule: [...document.styleSheets].some((sheet) => { try { return [...sheet.cssRules].some((rule) => rule.conditionText?.includes('prefers-reduced-motion')); } catch { return false; } })
  };
})()`;

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  const checks = [
    { lab: '初中 S1–S3', route: 'file:///home/ubuntu/sen_application/index.html?senType=SpLD&stageLevel=S1%E2%80%93S3', trigger: '[data-spld-s1-activity]', selector: '.spld-s1-lab', feedback: '#spldS1Feedback' },
    { lab: '高中 S4–S6', route: 'file:///home/ubuntu/sen_application/index.html?senType=SpLD&stageLevel=S4%E2%80%93S6', trigger: '[data-spld-s4-activity]', selector: '.spld-s4-lab', feedback: '#spldS4Feedback' }
  ];
  const results = [];
  for (const check of checks) {
    await client.call('Page.navigate', { url: check.route }); await sleep(900);
    await client.call('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(check.trigger)})?.click()` }); await sleep(80);
    const result = await client.call('Runtime.evaluate', { expression: inspect(check.lab, check.selector, check.feedback), returnByValue: true });
    const focusCycle = await client.call('Runtime.evaluate', { expression: `(() => { const dialog = document.querySelector(${JSON.stringify(check.selector)}); const controls = [...dialog.querySelectorAll('button:not([disabled])')].filter((element) => element.offsetParent !== null); const first = controls[0]; const last = controls.at(-1); first.focus(); first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })); const shiftTabWraps = document.activeElement === last; last.focus(); last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })); return { shiftTabWraps, tabWraps: document.activeElement === first }; })()`, returnByValue: true });
    await client.call('Runtime.evaluate', { expression: `document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))` }); await sleep(30);
    const escape = await client.call('Runtime.evaluate', { expression: `Boolean(document.querySelector(${JSON.stringify(check.selector)}))`, returnByValue: true });
    const restored = await client.call('Runtime.evaluate', { expression: `document.activeElement?.matches(${JSON.stringify(check.trigger)}) || false`, returnByValue: true });
    results.push({ ...result.result.value, ...focusCycle.result.value, closesWithEscape: !escape.result.value, restoresFocusToTrigger: restored.result.value });
  }
  const report = { standard: 'WCAG 2.1 AA', checks: results };
  await writeFile(outputPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  client.close();
} finally { chrome.kill('SIGTERM'); }
