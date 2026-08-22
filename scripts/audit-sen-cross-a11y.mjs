import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9353;
const reportPath = '/home/ubuntu/sen_application/sen-cross-a11y-audit.json';
const baseUrl = 'https://leung-tech.github.io/sen_application/index.html';
const pathways = [
  { type: '3', id: 'pathway-asd', label: 'ASD 社交情境' },
  { type: '2', id: 'pathway-id', label: 'ID 生活選擇' },
  { type: 'G', id: 'pathway-gifted', label: 'Giftedness 邏輯解難' },
  { type: 'H', id: 'pathway-hi', label: 'HI 視覺溝通' },
  { type: 'E', id: 'pathway-ebd', label: 'EBD 情緒調節' },
  { type: '8', id: 'pathway-sli', label: 'SLI 理解與表達' },
  { type: '9', id: 'pathway-mi', label: 'MI 溝通與選擇' },
];
const asdStages = ['lower', 'upper', 'junior', 'senior'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-cross-a11y-audit', 'about:blank'], { stdio: 'ignore' });

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

async function navigate(client, suffix = '') {
  await client.call('Page.navigate', { url: `${baseUrl}?crossA11yAudit=${Date.now()}${suffix}` });
  await sleep(1250);
}

async function openPathwayGame(client, pathway, stage = 'lower') {
  await navigate(client, `&pathway=${pathway.type}&stage=${stage}`);
  const opened = await evaluate(client, `(() => {
    const pathway = document.querySelector(${JSON.stringify(`.pathway-card[data-type="${pathway.type}"]`)});
    const stage = document.querySelector(${JSON.stringify(`.level-button[data-stage="${stage}"]`)});
    pathway?.click();
    stage?.click();
    const card = document.querySelector(${JSON.stringify(`[data-game-id="${pathway.id}"]`)});
    card?.focus();
    card?.click();
    return { pathway: Boolean(pathway), stage: Boolean(stage), card: Boolean(card) };
  })()`);
  await sleep(110);
  return opened;
}

async function auditCommonGame(client, pathway, stage = 'lower') {
  const opened = await openPathwayGame(client, pathway, stage);
  const initial = await evaluate(client, `(() => {
    const activity = document.querySelector('#activityCard');
    const feedback = document.querySelector('#gameFeedback');
    const buttons = [...activity.querySelectorAll('button')].filter((button) => button.offsetParent !== null);
    const unnamed = buttons.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length;
    return {
      activityExists: Boolean(activity),
      activityFocused: document.activeElement === activity,
      feedbackRole: feedback?.getAttribute('role') || '',
      feedbackLive: feedback?.getAttribute('aria-live') || '',
      feedbackAtomic: feedback?.getAttribute('aria-atomic') || '',
      buttons: buttons.length,
      unnamed,
      nativeButtons: buttons.every((button) => button.tagName === 'BUTTON'),
      firstAnswerName: document.querySelector('.answer-card')?.innerText.trim() || '',
      hintExists: Boolean(document.querySelector('#hintButton')),
    };
  })()`);
  const feedback = await evaluate(client, `(() => {
    const hint = document.querySelector('#hintButton');
    hint?.click();
    return document.querySelector('#gameFeedback')?.textContent.trim() || '';
  })()`);
  return { label: `${pathway.label}｜${stage}`, opened, initial, feedback };
}

async function auditAdhd(client) {
  const adhd = { type: '4', id: 'pathway-adhd', label: 'ADHD 專注策略' };
  const opened = await openPathwayGame(client, adhd);
  const launch = await evaluate(client, `(() => {
    const button = document.querySelector('#adhdFocusLabLaunch');
    button?.focus();
    button?.click();
    return Boolean(button);
  })()`);
  await sleep(90);
  const home = await evaluate(client, `(() => {
    const dialog = document.querySelector('.focus-lab-shell');
    const controls = dialog ? [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null) : [];
    return {
      dialog: Boolean(dialog), role: dialog?.getAttribute('role') || '', modal: dialog?.getAttribute('aria-modal') || '', name: dialog?.getAttribute('aria-label') || '',
      focusInside: Boolean(dialog?.contains(document.activeElement)), controls: controls.length,
      unnamed: controls.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length,
    };
  })()`);
  const focusCycle = await evaluate(client, `(() => {
    const dialog = document.querySelector('.focus-lab-shell');
    const controls = dialog ? [...dialog.querySelectorAll('button:not([disabled])')].filter((button) => button.offsetParent !== null) : [];
    const first = controls[0]; const last = controls.at(-1);
    if (!first || !last) return { tabWraps: false, shiftTabWraps: false };
    first.focus(); first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    const shiftTabWraps = document.activeElement === last;
    last.focus(); last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    return { tabWraps: document.activeElement === first, shiftTabWraps };
  })()`);
  await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  await sleep(50);
  const escape = await evaluate(client, `({ closed: !document.querySelector('.focus-lab-shell'), restored: document.activeElement?.id === 'adhdFocusLabLaunch' })`);
  if (!escape.closed) await evaluate(client, `document.querySelector('.focus-lab-close')?.click();`);
  await sleep(50);
  const close = await evaluate(client, `({ closed: !document.querySelector('.focus-lab-shell'), restored: document.activeElement?.id === 'adhdFocusLabLaunch' })`);

  await evaluate(client, `document.querySelector('#adhdFocusLabLaunch')?.click(); document.querySelector('[data-mode="stroop"]')?.click();`);
  await sleep(70);
  const trial = await evaluate(client, `(() => {
    const feedback = document.querySelector('.focus-feedback');
    const progress = document.querySelector('.focus-progress');
    const choice = document.querySelector('.focus-choice');
    choice?.click();
    return {
      feedbackLive: feedback?.getAttribute('aria-live') || '', feedbackAtomic: feedback?.getAttribute('aria-atomic') || '', feedbackText: feedback?.textContent.trim() || '',
      progressRole: progress?.getAttribute('role') || '', progressNow: progress?.getAttribute('aria-valuenow') || '', progressMin: progress?.getAttribute('aria-valuemin') || '', progressMax: progress?.getAttribute('aria-valuemax') || '',
    };
  })()`);
  const tree = await client.call('Accessibility.getFullAXTree');
  const ax = { dialogs: tree.nodes.filter((node) => node.role?.value === 'dialog').map((node) => node.name?.value || ''), statuses: tree.nodes.filter((node) => node.role?.value === 'status').length, progressbars: tree.nodes.filter((node) => node.role?.value === 'progressbar').length };
  await evaluate(client, `document.querySelector('.focus-lab-close')?.click();`);
  return { opened, launch, home, focusCycle, escape, close, trial, ax };
}

async function auditMobile(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  const reports = [];
  for (const pathway of pathways) {
    await openPathwayGame(client, pathway);
    reports.push(await evaluate(client, `(() => {
      const activity = document.querySelector('#activityCard');
      const controls = [...activity.querySelectorAll('button')].filter((button) => button.offsetParent !== null).map((button) => {
        const box = button.getBoundingClientRect();
        return { label: button.innerText.trim().replace(/\\s+/g, ' ').slice(0, 80), width: Math.round(box.width), height: Math.round(box.height) };
      });
      return { label: ${JSON.stringify(pathway.label)}, overflow: document.documentElement.scrollWidth > window.innerWidth, narrowTargets: controls.filter((button) => button.width < 40 || button.height < 40), controlCount: controls.length };
    })()`));
  }
  await openPathwayGame(client, { type: '4', id: 'pathway-adhd', label: 'ADHD 專注策略' });
  await evaluate(client, `document.querySelector('#adhdFocusLabLaunch')?.click();`);
  await sleep(70);
  const adhd = await evaluate(client, `(() => {
    const dialog = document.querySelector('.focus-lab');
    const controls = [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null).map((button) => { const box = button.getBoundingClientRect(); return { label: button.innerText.trim().slice(0, 80), width: Math.round(box.width), height: Math.round(box.height) }; });
    return { overflow: document.documentElement.scrollWidth > window.innerWidth, dialogWidth: Math.round(dialog?.getBoundingClientRect().width || 0), narrowTargets: controls.filter((button) => button.width < 40 || button.height < 40), controlCount: controls.length };
  })()`);
  await client.call('Emulation.clearDeviceMetricsOverride');
  return { width: 375, height: 812, pathways: reports, adhd };
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Accessibility.enable');
  const common = [];
  for (const pathway of pathways) common.push(await auditCommonGame(client, pathway));
  const asd = [];
  for (const stage of asdStages) asd.push(await auditCommonGame(client, pathways[0], stage));
  const adhd = await auditAdhd(client);
  const mobile = await auditMobile(client);

  const failures = [];
  [...common, ...asd].forEach((report) => {
    const { initial } = report;
    if (!initial.activityFocused) failures.push(`${report.label}：開始活動後未把焦點帶到新內容。`);
    if (initial.feedbackRole !== 'status' || initial.feedbackLive !== 'polite' || initial.feedbackAtomic !== 'true') failures.push(`${report.label}：共用回饋區缺少完整狀態訊息語意。`);
    if (!initial.hintExists || !report.feedback) failures.push(`${report.label}：提示控制或動態回饋未完成。`);
    if (initial.unnamed || !initial.nativeButtons || !initial.firstAnswerName) failures.push(`${report.label}：互動控制的可及名稱或原生按鈕語意不足。`);
  });
  if (!adhd.home.dialog || adhd.home.role !== 'dialog' || adhd.home.modal !== 'true' || !adhd.home.name || !adhd.home.focusInside || adhd.home.unnamed) failures.push('ADHD：專注實驗室的對話框或初始焦點不完整。');
  if (!adhd.focusCycle.tabWraps || !adhd.focusCycle.shiftTabWraps) failures.push('ADHD：Tab／Shift+Tab 焦點未限制在專注實驗室。');
  if (!adhd.escape.closed || !adhd.escape.restored || !adhd.close.closed || !adhd.close.restored) failures.push('ADHD：Escape 或關閉按鈕未能關閉並回復焦點。');
  if (adhd.trial.feedbackLive !== 'polite' || adhd.trial.feedbackAtomic !== 'true' || !adhd.trial.feedbackText) failures.push('ADHD：作答動態回饋語意不足。');
  if (adhd.trial.progressRole !== 'progressbar' || !adhd.trial.progressNow || !adhd.trial.progressMin || !adhd.trial.progressMax || adhd.ax.progressbars < 1) failures.push('ADHD：進度未提供完整進度列語意。');
  if (adhd.ax.dialogs.length !== 1 || adhd.ax.statuses < 1) failures.push('ADHD：輔助科技語意樹未顯示預期對話框與狀態。');
  mobile.pathways.forEach((report) => { if (report.overflow || report.narrowTargets.length) failures.push(`${report.label}：375px 行動版出現橫向溢出或小於 40px 的互動控制。`); });
  if (mobile.adhd.overflow || mobile.adhd.narrowTargets.length) failures.push('ADHD：375px 行動版出現橫向溢出或小於 40px 的互動控制。');
  const output = { standard: 'WCAG 2.1 AA targeted keyboard and screen-reader simulation plus 375px touch-layout review', common, asd, adhd, mobile, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ commonRoutes: common.length, asdStages: asd.length, failureCount: failures.length, failures }, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
