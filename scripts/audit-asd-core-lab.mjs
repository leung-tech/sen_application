import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9361;
const reportPath = '/home/ubuntu/sen_application/asd-core-lab-audit.json';
const baseUrl = 'file:///home/ubuntu/sen_application/index.html';
const stages = ['lower', 'upper', 'junior', 'senior'];
const games = ['emotion', 'story', 'joint', 'visual', 'sensory'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/asd-core-lab-audit', 'about:blank'], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(120);
  }
  throw new Error('無法連接自動化瀏覽器。');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); },
      close() { socket.close(); },
    }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('自動化瀏覽器連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

async function openLab(client, stage = 'lower') {
  await client.call('Page.navigate', { url: `${baseUrl}?asdCoreAudit=${Date.now()}&stage=${stage}` });
  await sleep(1150);
  await evaluate(client, `(() => {
    document.querySelector('.pathway-card[data-type="3"]')?.click();
    document.querySelector(${JSON.stringify(`.level-button[data-stage="${stage}"]`)})?.click();
    document.querySelector('[data-asd-core-direct]')?.focus();
    document.querySelector('[data-asd-core-direct]')?.click();
  })()`);
  await sleep(120);
}

async function directEntryAudit(client) {
  await client.call('Page.navigate', { url: `${baseUrl}?asdCoreDirectAudit=${Date.now()}` });
  await sleep(1150);
  return evaluate(client, `(() => {
    document.querySelector('.pathway-card[data-type="3"]')?.click();
    const direct = document.querySelector('[data-asd-core-direct]');
    const before = { exists: Boolean(direct), title: document.querySelector('#gamesTitle')?.textContent.trim() || '', guide: document.querySelector('#stageGuide')?.textContent.trim() || '', text: direct?.innerText || '' };
    direct?.click();
    const dialog = document.querySelector('.asd-core-shell');
    const tools = ['asdRule', 'asdBreak', 'asdSound', 'asdVisual'];
    const sound = document.querySelector('#asdSound'); const visual = document.querySelector('#asdVisual');
    const after = { dialog: Boolean(dialog), games: document.querySelectorAll('[data-asd-game]').length, tools: tools.every((id) => Boolean(document.getElementById(id))), soundPressed: sound?.getAttribute('aria-pressed') || '', visualPressed: visual?.getAttribute('aria-pressed') || '' };
    sound?.click(); visual?.click();
    after.soundCanDisable = sound?.getAttribute('aria-pressed') === 'false'; after.visualCanDisable = visual?.getAttribute('aria-pressed') === 'false';
    return { before, after };
  })()`);
}

async function menuAudit(client, stage) {
  await openLab(client, stage);
  return evaluate(client, `(() => {
    const dialog = document.querySelector('.asd-core-shell'); const controls = dialog ? [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null) : []; const cardKeys = [...document.querySelectorAll('[data-asd-game]')].map((button) => button.dataset.asdGame);
    return { stage: ${JSON.stringify(stage)}, dialog: Boolean(dialog), role: dialog?.getAttribute('role') || '', modal: dialog?.getAttribute('aria-modal') || '', name: dialog?.getAttribute('aria-label') || '', focusInside: Boolean(dialog?.contains(document.activeElement)), cardKeys, controls: controls.length, unnamed: controls.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length };
  })()`);
}

async function gameAudit(client, stage, game) {
  await openLab(client, stage);
  await evaluate(client, `document.querySelector(${JSON.stringify(`[data-asd-game="${game}"]`)})?.click();`);
  await sleep(80);
  const ready = await evaluate(client, `(() => { const dialog = document.querySelector('.asd-core-shell'); const start = document.querySelector('#asdReadyStart'); return { dialog: Boolean(dialog), start: Boolean(start), startText: start?.textContent.trim() || '', steps: dialog?.querySelectorAll('.asd-ready li').length || 0, notice: document.querySelector('#asdLabFeedback')?.textContent.trim() || '' }; })()`);
  await evaluate(client, `document.querySelector('#asdReadyStart')?.click();`);
  await sleep(100);
  const initial = await evaluate(client, `(() => {
    const dialog = document.querySelector('.asd-core-shell'); const feedback = document.querySelector('#asdLabFeedback'); const progress = dialog?.querySelector('[role="progressbar"]'); const controls = dialog ? [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null) : [];
    const joint = ${JSON.stringify(game)} === 'joint' ? { composite: Boolean(dialog?.querySelector('.joint-composite-board')), clues: dialog?.querySelectorAll('.joint-composite-clues .joint-clue-card').length || 0, targets: dialog?.querySelectorAll('[data-joint]').length || 0, distractor: Boolean(dialog?.querySelector('.joint-clue-card.distractor')), ruleText: dialog?.querySelector('.asd-rule')?.textContent.trim() || '' } : null;
    return { dialog: Boolean(dialog), feedbackRole: feedback?.getAttribute('role') || '', feedbackLive: feedback?.getAttribute('aria-live') || '', feedbackAtomic: feedback?.getAttribute('aria-atomic') || '', progressRole: progress?.getAttribute('role') || '', progressNow: progress?.getAttribute('aria-valuenow') || '', progressMin: progress?.getAttribute('aria-valuemin') || '', progressMax: progress?.getAttribute('aria-valuemax') || '', controls: controls.length, unnamed: controls.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length, rule: Boolean(dialog?.querySelector('.asd-rule')), joint };
  })()`);
  const teacherDialogue = game === 'story' ? await evaluate(client, `(() => {
    const card = document.querySelector('.story-card'); const toggle = document.querySelector('#storyTeacherToggle');
    const before = { exists: Boolean(toggle), expanded: toggle?.getAttribute('aria-expanded') || '', level: card?.dataset.storyLevel || '' };
    toggle?.click(); const panel = document.getElementById(toggle?.getAttribute('aria-controls'));
    return { ...before, opens: Boolean(panel && !panel.hidden), expandedAfter: toggle?.getAttribute('aria-expanded') || '', headings: [...(panel?.querySelectorAll('strong') || [])].map((node) => node.textContent.trim()) };
  })()`) : null;
  const interaction = await evaluate(client, `(() => { const selectors = { emotion: '[data-emotion]', story: '[data-story]', joint: '[data-joint]:not([disabled])', visual: '[data-visual]', sensory: '[data-sound]' }; const control = document.querySelector(selectors[${JSON.stringify(game)}]); control?.click(); return { exists: Boolean(control), feedback: document.querySelector('#asdLabFeedback')?.textContent.trim() || '' }; })()`);
  await sleep(35);
  return { stage, game, ready, initial, teacherDialogue, interaction };
}

async function keyboardAudit(client) {
  await openLab(client, 'lower');
  const cycle = await evaluate(client, `(() => { const dialog = document.querySelector('.asd-core-shell'); const controls = dialog ? [...dialog.querySelectorAll('button:not([disabled])')].filter((button) => button.offsetParent !== null) : []; const first = controls[0]; const last = controls.at(-1); if (!first || !last) return { tabWraps: false, shiftTabWraps: false }; first.focus(); first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })); const shiftTabWraps = document.activeElement === last; last.focus(); last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })); return { tabWraps: document.activeElement === first, shiftTabWraps }; })()`);
  await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`); await sleep(50);
  const close = await evaluate(client, `({ closed: !document.querySelector('.asd-core-shell'), restored: document.activeElement?.dataset?.asdCoreDirect === 'true' })`);
  return { cycle, close };
}

async function mobileAudit(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true }); await openLab(client, 'senior');
  await evaluate(client, `document.querySelector('[data-asd-game="joint"]')?.click();`); await sleep(80); await evaluate(client, `document.querySelector('#asdReadyStart')?.click();`); await sleep(120);
  const result = await evaluate(client, `(() => { const dialog = document.querySelector('.asd-lab'); if (!dialog) return { available: false, overflow: false, dialogWidth: 0, controls: 0, narrow: [] }; const controls = [...dialog.querySelectorAll('button')].filter((button) => button.offsetParent !== null).map((button) => { const box = button.getBoundingClientRect(); return { label: button.innerText.trim().slice(0, 45), width: Math.round(box.width), height: Math.round(box.height) }; }); return { available: true, overflow: document.documentElement.scrollWidth > window.innerWidth, dialogWidth: Math.round(dialog.getBoundingClientRect().width || 0), controls: controls.length, narrow: controls.filter((button) => button.width < 40 || button.height < 40) }; })()`);
  await client.call('Emulation.clearDeviceMetricsOverride'); return result;
}

try {
  const client = await connect(await targetUrl()); await client.call('Page.enable'); await client.call('Accessibility.enable');
  const directEntry = await directEntryAudit(client);
  const menus = []; for (const stage of stages) menus.push(await menuAudit(client, stage));
  const gameReports = []; for (const stage of stages) for (const game of games) gameReports.push(await gameAudit(client, stage, game));
  const keyboard = await keyboardAudit(client); const mobile = await mobileAudit(client); const ax = await client.call('Accessibility.getFullAXTree'); const failures = [];
  if (!directEntry.before.exists || !directEntry.before.title.includes('ASD') || !directEntry.before.guide.includes('ASD 核心訓練') || !directEntry.before.text.includes('五項 ASD 核心訓練') || !directEntry.before.text.includes('教師帶讀') || !directEntry.after.dialog || directEntry.after.games !== games.length || !directEntry.after.tools || directEntry.after.soundPressed !== 'true' || directEntry.after.visualPressed !== 'true' || !directEntry.after.soundCanDisable || !directEntry.after.visualCanDisable) failures.push('ASD 首層直接入口或低壓設定控制不完整。');
  menus.forEach((menu) => { if (!menu.dialog || menu.role !== 'dialog' || menu.modal !== 'true' || !menu.name || !menu.focusInside || menu.unnamed || menu.cardKeys.length !== games.length || games.some((game) => !menu.cardKeys.includes(game))) failures.push(`${menu.stage}：ASD 核心選關對話框或五張卡不完整。`); });
  gameReports.forEach((report) => { const item = report.initial; if (!report.ready.dialog || !report.ready.start || !report.ready.startText.includes('我準備好了') || report.ready.steps !== 3 || !report.ready.notice.includes('準備時間')) failures.push(`${report.stage} ${report.game}：教師帶讀準備頁不完整。`); if (!item.dialog || item.feedbackRole !== 'status' || item.feedbackLive !== 'polite' || item.feedbackAtomic !== 'true' || item.progressRole !== 'progressbar' || !item.progressNow || !item.progressMin || !item.progressMax || !item.rule || item.unnamed) failures.push(`${report.stage} ${report.game}：遊戲語意、進度或規則提示不完整。`); if (report.game === 'story') { const dialogue = report.teacherDialogue; const needsHigherStory = ['junior', 'senior'].includes(report.stage); if (!dialogue?.exists || dialogue.expanded !== 'false' || !dialogue.opens || dialogue.expandedAfter !== 'true' || dialogue.headings.length !== 4 || (needsHigherStory && dialogue.level !== 'higher')) failures.push(`${report.stage}：社交故事的教師引導對話框或高年級生活情境不完整。`); } if (report.game === 'joint') { const joint = item.joint; if (['lower', 'upper'].includes(report.stage) && joint?.composite) failures.push(`${report.stage}：基本聯合注意不應誤用高年級複合版。`); if (report.stage === 'junior' && (!joint?.composite || joint.clues !== 3 || joint.targets < 8 || joint.distractor || !joint.ruleText.includes('跟眼睛和手'))) failures.push('初中：聯合注意雙線索與目標特徵難度不完整。'); if (report.stage === 'senior' && (!joint?.composite || joint.clues !== 3 || joint.targets < 12 || !joint.distractor || !joint.ruleText.includes('手勢正在'))) failures.push('高中：聯合注意衝突干擾與三特徵判讀不完整。'); } if (!report.interaction.exists || !report.interaction.feedback) failures.push(`${report.stage} ${report.game}：找不到作答控制或動態回饋。`); });
  if (!keyboard.cycle.tabWraps || !keyboard.cycle.shiftTabWraps || !keyboard.close.closed || !keyboard.close.restored) failures.push('ASD 核心訓練室：Tab 焦點循環、Escape 關閉或焦點回復不完整。');
  if (!mobile.available || mobile.overflow || mobile.narrow.length) failures.push('ASD 核心訓練室：375px 行動版未開啟、出現橫向溢出或小於 40px 的控制。');
  const output = { standard: 'ASD core games direct-entry, ready screen, keyboard, semantics and 375px mobile audit', directEntry, menus, gameReports, keyboard, mobile, ax: { dialogs: ax.nodes.filter((node) => node.role?.value === 'dialog').length, statuses: ax.nodes.filter((node) => node.role?.value === 'status').length, progressbars: ax.nodes.filter((node) => node.role?.value === 'progressbar').length }, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`); console.log(JSON.stringify({ stages: menus.length, games: gameReports.length, failureCount: failures.length, failures }, null, 2)); client.close();
} finally { chrome.kill('SIGTERM'); }
