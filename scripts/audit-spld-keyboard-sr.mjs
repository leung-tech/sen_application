import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9348;
const reportPath = '/home/ubuntu/sen_application/spld-keyboard-sr-audit.json';
const audits = [
  { label: '初中 S1–S3', stage: 'S1%E2%80%93S3', namespace: 's1', cardSelector: '[data-spld-s1-activity]', labSelector: '.spld-s1-lab', feedback: '#spldS1Feedback', hint: '#spldS1Hint', read: '#spldS1Read', playSelector: '.spld-s1-play-area button' },
  { label: '高中 S4–S6', stage: 'S4%E2%80%93S6', namespace: 's4', cardSelector: '[data-spld-s4-activity]', labSelector: '.spld-s4-lab', feedback: '#spldS4Feedback', hint: '#spldS4Hint', read: '#spldS4Read', playSelector: '[data-s4-choice]' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/spld-keyboard-sr-audit', 'about:blank'], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const target = targets.find((item) => item.type === 'page');
      if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
    } catch {}
    await sleep(120);
  }
  throw new Error('無法連接自動化瀏覽器。');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const pending = new Map();
    let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) {
        const requestId = ++id;
        socket.send(JSON.stringify({ id: requestId, method, params }));
        return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall }));
      },
      close() { socket.close(); },
    }));
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id || !pending.has(message.id)) return;
      const item = pending.get(message.id);
      pending.delete(message.id);
      message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result);
    });
    socket.addEventListener('error', () => reject(new Error('自動化瀏覽器連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

async function auditActivity(client, config, key) {
  const openResult = await evaluate(client, `(() => {
    const card = document.querySelector(${JSON.stringify(`${config.cardSelector}[data-spld-${config.namespace}-activity="${key}"]`)});
    if (!card) return { error: '找不到直接選關卡。' };
    card.click();
    return { cardText: card.textContent.trim() };
  })()`);
  await sleep(90);
  const initial = await evaluate(client, `(() => {
    const dialog = document.querySelector(${JSON.stringify(config.labSelector)});
    const feedback = document.querySelector(${JSON.stringify(config.feedback)});
    const progress = dialog?.querySelector('[role="progressbar"]');
    const controls = dialog ? [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null) : [];
    const unnamed = controls.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length;
    return {
      dialog: Boolean(dialog), dialogRole: dialog?.closest('[role="dialog"]')?.getAttribute('role') || '', dialogName: dialog?.closest('[role="dialog"]')?.getAttribute('aria-label') || '',
      focusInside: Boolean(dialog?.closest('[role="dialog"]')?.contains(document.activeElement)), active: document.activeElement?.id || '',
      status: feedback?.getAttribute('role') || '', live: feedback?.getAttribute('aria-live') || '', atomic: feedback?.getAttribute('aria-atomic') || '',
      progress: progress?.getAttribute('aria-valuenow') || '', controls: controls.length, unnamed,
    };
  })()`);
  const hint = await evaluate(client, `(() => { const button = document.querySelector(${JSON.stringify(config.hint)}); button?.click(); const feedback = document.querySelector(${JSON.stringify(config.feedback)}); return { exists: Boolean(button), text: feedback?.textContent.trim() || '' }; })()`);
  const read = await evaluate(client, `(() => { const button = document.querySelector(${JSON.stringify(config.read)}); button?.click(); const state = { exists: Boolean(button), pressed: button?.getAttribute('aria-pressed') || '', label: button?.textContent.trim() || '' }; window.speechSynthesis?.cancel(); return state; })()`);
  const choice = await evaluate(client, `(() => { const button = [...document.querySelectorAll(${JSON.stringify(config.playSelector)})].filter((element) => !element.disabled && element.offsetParent !== null)[0]; button?.click(); const feedback = document.querySelector(${JSON.stringify(config.feedback)}); return { exists: Boolean(button), text: feedback?.textContent.trim() || '' }; })()`);
  await sleep(40);
  const focusCycle = await evaluate(client, `(() => { const dialog = document.querySelector('[role="dialog"]'); const controls = dialog ? [...dialog.querySelectorAll('button:not([disabled])')].filter((button) => button.offsetParent !== null) : []; const first = controls[0]; const last = controls.at(-1); if (!first || !last) return { tabWraps: false, shiftTabWraps: false }; first.focus(); first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })); const shiftTabWraps = document.activeElement === last; last.focus(); last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })); return { tabWraps: document.activeElement === first, shiftTabWraps }; })()`);
  const tree = await client.call('Accessibility.getFullAXTree');
  const accessibilityTree = {
    dialogNodes: tree.nodes.filter((node) => node.role?.value === 'dialog').map((node) => node.name?.value || ''),
    statusNodes: tree.nodes.filter((node) => node.role?.value === 'status').length,
  };
  await evaluate(client, `document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  await sleep(50);
  const close = await evaluate(client, `({ closed: !document.querySelector(${JSON.stringify(config.labSelector)}), restored: document.activeElement?.matches(${JSON.stringify(`${config.cardSelector}[data-spld-${config.namespace}-activity="${key}"]`)}) || false })`);
  return { key, ...openResult, initial, hint, read, choice, focusCycle, accessibilityTree, close };
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Accessibility.enable');
  const reports = [];
  for (const config of audits) {
    await client.call('Page.navigate', { url: `https://leung-tech.github.io/sen_application/index.html?senType=SpLD&stageLevel=${config.stage}&keyboardAudit=${Date.now()}` });
    await sleep(1700);
    const keys = await evaluate(client, `Array.from(document.querySelectorAll(${JSON.stringify(config.cardSelector)})).map((card) => card.dataset.spld${config.namespace === 's1' ? 'S1' : 'S4'}Activity)`);
    const activities = [];
    for (const key of keys) activities.push(await auditActivity(client, config, key));
    reports.push({ label: config.label, expected: keys.length, activities });
  }
  const failures = reports.flatMap((report) => report.activities.filter((activity) => !activity.initial.dialog || activity.initial.dialogRole !== 'dialog' || !activity.initial.dialogName || !activity.initial.focusInside || activity.initial.status !== 'status' || activity.initial.live !== 'polite' || activity.initial.atomic !== 'true' || !activity.initial.progress || activity.initial.unnamed > 0 || !activity.hint.exists || !activity.hint.text || !activity.read.exists || !['true', 'false'].includes(activity.read.pressed) || !activity.read.label || !activity.choice.exists || !activity.choice.text || !activity.focusCycle.tabWraps || !activity.focusCycle.shiftTabWraps || activity.accessibilityTree.dialogNodes.length !== 1 || activity.accessibilityTree.statusNodes < 1 || !activity.close.closed || !activity.close.restored));
  const output = { standard: 'WCAG 2.1 AA targeted keyboard and screen-reader simulation', reports, failureCount: failures.length, failures: failures.map((item) => ({ key: item.key, initial: item.initial, hint: item.hint, read: item.read, choice: item.choice, focusCycle: item.focusCycle, accessibilityTree: item.accessibilityTree, close: item.close })) };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ reports: reports.map((report) => ({ label: report.label, activities: report.activities.length })), failureCount: output.failureCount }, null, 2));
  if (output.failureCount) process.exitCode = 1;
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
