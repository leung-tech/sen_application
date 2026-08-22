import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9354;
const reportPath = '/home/ubuntu/sen_application/adhd-graded-lab-audit.json';
const baseUrl = 'https://leung-tech.github.io/sen_application/index.html';
const stages = ['lower', 'upper', 'junior', 'senior'];
const games = ['cpt', 'nback', 'flanker', 'switch', 'mot', 'stroop', 'nogo', 'corsi', 'schulte'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/adhd-graded-lab-audit', 'about:blank'], { stdio: 'ignore' });

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

async function openLab(client, stage = 'lower') {
  await client.call('Page.navigate', { url: `${baseUrl}?adhdGradedAudit=${Date.now()}&stage=${stage}` });
  await sleep(1150);
  await evaluate(client, `(() => {
    document.querySelector('.pathway-card[data-type="4"]')?.click();
    document.querySelector(${JSON.stringify(`.level-button[data-stage="${stage}"]`)})?.click();
    document.querySelector('[data-game-id="pathway-adhd"]')?.click();
    document.querySelector('#adhdGradedLabLaunch')?.focus();
    document.querySelector('#adhdGradedLabLaunch')?.click();
  })()`);
  await sleep(100);
}

async function directEntryAudit(client) {
  await client.call('Page.navigate', { url: `${baseUrl}?adhdDirectEntryAudit=${Date.now()}` });
  await sleep(1150);
  return evaluate(client, `(() => {
    document.querySelector('.pathway-card[data-type="4"]')?.click();
    const directCard = document.querySelector('[data-adhd-graded-direct]');
    const before = {
      directCard: Boolean(directCard),
      title: document.querySelector('#gamesTitle')?.textContent.trim() || '',
      guide: document.querySelector('#stageGuide')?.textContent.trim() || '',
      directText: directCard?.innerText.trim() || '',
    };
    directCard?.click();
    const dialog = document.querySelector('.graded-lab-shell');
    const sound = document.querySelector('#gradedSoundToggle');
    const visual = document.querySelector('#gradedVisualToggle');
    const tools = ['gradedRuleHelp', 'gradedBreakHelp', 'gradedSoundToggle', 'gradedVisualToggle'];
    const after = {
      dialog: Boolean(dialog), gameCards: document.querySelectorAll('[data-graded-game]').length,
      effort: Boolean(document.querySelector('.graded-effort-meter')),
      toolsPresent: tools.every((id) => Boolean(document.getElementById(id))),
      soundPressed: sound?.getAttribute('aria-pressed') || '', visualPressed: visual?.getAttribute('aria-pressed') || '',
    };
    sound?.click(); visual?.click();
    after.soundCanDisable = sound?.getAttribute('aria-pressed') === 'false';
    after.visualCanDisable = visual?.getAttribute('aria-pressed') === 'false';
    return { before, after };
  })()`);
}

async function menuAudit(client, stage) {
  await openLab(client, stage);
  return evaluate(client, `(() => {
    const dialog = document.querySelector('.graded-lab-shell');
    const controls = dialog ? [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null) : [];
    const keys = [...document.querySelectorAll('[data-graded-game]')].map((button) => button.dataset.gradedGame);
    return {
      stage: ${JSON.stringify(stage)}, dialog: Boolean(dialog), role: dialog?.getAttribute('role') || '', modal: dialog?.getAttribute('aria-modal') || '', name: dialog?.getAttribute('aria-label') || '',
      focusInside: Boolean(dialog?.contains(document.activeElement)), stageLabel: dialog?.querySelector('.graded-eyebrow')?.textContent.trim() || '',
      gameKeys: keys, controls: controls.length, unnamed: controls.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length,
    };
  })()`);
}

async function gameAudit(client, stage, game) {
  await openLab(client, stage);
  await evaluate(client, `document.querySelector(${JSON.stringify(`[data-graded-game="${game}"]`)})?.click();`);
  await sleep(game === 'corsi' ? 2600 : game === 'mot' ? 7800 : 100);
  const initial = await evaluate(client, `(() => {
    const dialog = document.querySelector('.graded-lab-shell');
    const feedback = document.querySelector('#gradedLabFeedback');
    const progress = dialog?.querySelector('[role="progressbar"]');
    const controls = dialog ? [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null) : [];
    return {
      dialog: Boolean(dialog), feedbackRole: feedback?.getAttribute('role') || '', feedbackLive: feedback?.getAttribute('aria-live') || '', feedbackAtomic: feedback?.getAttribute('aria-atomic') || '',
      progressRole: progress?.getAttribute('role') || '', progressNow: progress?.getAttribute('aria-valuenow') || '', progressMin: progress?.getAttribute('aria-valuemin') || '', progressMax: progress?.getAttribute('aria-valuemax') || '',
      controls: controls.length, unnamed: controls.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length,
      motAlternative: ${JSON.stringify(game)} === 'mot' ? Boolean(document.querySelector('#motChoices:not([hidden]) [data-mot-ball]:not([disabled])')) : true,
    };
  })()`);
  const interaction = await evaluate(client, `(() => {
    const selectors = {
      cpt: '#gradedResponse', nback: '#gradedResponse', stroop: '[data-color]', nogo: '#gradedResponse', flanker: '[data-direction]', switch: '[data-switch-card]', corsi: '[data-corsi-cell]', schulte: '[data-schulte-number]:not([disabled])', mot: '[data-mot-ball]:not([disabled])'
    };
    const control = document.querySelector(selectors[${JSON.stringify(game)}]);
    control?.click();
    return { exists: Boolean(control), feedback: document.querySelector('#gradedLabFeedback')?.textContent.trim() || '' };
  })()`);
  await sleep(35);
  return { stage, game, initial, interaction };
}

async function keyboardAudit(client) {
  await openLab(client, 'lower');
  const focusCycle = await evaluate(client, `(() => {
    const dialog = document.querySelector('.graded-lab-shell');
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
  const close = await evaluate(client, `({ closed: !document.querySelector('.graded-lab-shell'), restored: document.activeElement?.id === 'adhdGradedLabLaunch' })`);
  return { focusCycle, close };
}

async function mobileAudit(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await openLab(client, 'lower');
  const result = await evaluate(client, `(() => {
    const dialog = document.querySelector('.graded-lab');
    const controls = [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null).map((button) => { const box = button.getBoundingClientRect(); return { label: button.innerText.trim().slice(0, 50), width: Math.round(box.width), height: Math.round(box.height) }; });
    return { overflow: document.documentElement.scrollWidth > window.innerWidth, dialogWidth: Math.round(dialog?.getBoundingClientRect().width || 0), narrowTargets: controls.filter((button) => button.width < 40 || button.height < 40), controls: controls.length };
  })()`);
  await client.call('Emulation.clearDeviceMetricsOverride');
  return result;
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Accessibility.enable');
  const directEntry = await directEntryAudit(client);
  const menus = [];
  for (const stage of stages) menus.push(await menuAudit(client, stage));
  const gameReports = [];
  for (const stage of stages) for (const game of games) gameReports.push(await gameAudit(client, stage, game));
  const keyboard = await keyboardAudit(client);
  const mobile = await mobileAudit(client);
  const ax = await client.call('Accessibility.getFullAXTree');
  const failures = [];
  if (!directEntry.before.directCard || !directEntry.before.title.includes('ADHD') || !directEntry.before.guide.includes('九項分級認知遊戲') || !directEntry.before.directText.includes('低壓短回合') || !directEntry.after.dialog || directEntry.after.gameCards !== games.length || !directEntry.after.effort || !directEntry.after.toolsPresent || directEntry.after.soundPressed !== 'true' || directEntry.after.visualPressed !== 'true' || !directEntry.after.soundCanDisable || !directEntry.after.visualCanDisable) failures.push('ADHD 首層直接選關或低壓聲光回饋控制不完整。');
  menus.forEach((menu) => {
    if (!menu.dialog || menu.role !== 'dialog' || menu.modal !== 'true' || !menu.name || !menu.focusInside || menu.unnamed || menu.gameKeys.length !== games.length || games.some((game) => !menu.gameKeys.includes(game))) failures.push(`${menu.stage}：分級選關對話框或九張遊戲卡不完整。`);
  });
  gameReports.forEach((report) => {
    const item = report.initial;
    if (!item.dialog || item.feedbackRole !== 'status' || item.feedbackLive !== 'polite' || item.feedbackAtomic !== 'true' || item.progressRole !== 'progressbar' || !item.progressNow || !item.progressMin || !item.progressMax || item.unnamed || !item.motAlternative) failures.push(`${report.game}：遊戲語意或替代操作不完整。`);
    if (!report.interaction.exists || !report.interaction.feedback) failures.push(`${report.game}：找不到可操作控制或作答回饋。`);
  });
  if (!keyboard.focusCycle.tabWraps || !keyboard.focusCycle.shiftTabWraps || !keyboard.close.closed || !keyboard.close.restored) failures.push('分級訓練室：Tab 焦點循環、Escape 關閉或焦點回復不完整。');
  if (mobile.overflow || mobile.narrowTargets.length) failures.push('分級訓練室：375px 行動版有橫向溢出或小於 40px 的控制。');
  const output = { standard: 'ADHD graded-game keyboard, direct-entry rewards, semantics and 375px mobile audit', directEntry, menus, gameReports, keyboard, mobile, ax: { dialogs: ax.nodes.filter((node) => node.role?.value === 'dialog').length, statuses: ax.nodes.filter((node) => node.role?.value === 'status').length, progressbars: ax.nodes.filter((node) => node.role?.value === 'progressbar').length }, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ stages: menus.length, games: gameReports.length, failureCount: failures.length, failures }, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
