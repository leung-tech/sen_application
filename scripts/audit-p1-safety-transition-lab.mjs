import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const port = 9387;
const reportPath = '/home/ubuntu/sen_application/p1-safety-transition-audit.json';
const baseUrl = pathToFileURL(resolve('index.html')).href;
const stages = ['lower', 'upper', 'junior', 'senior'];
const topics = ['digital', 'change', 'advocate', 'repair'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/p1-safety-transition-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((item) => item.type === 'page');
      if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
    } catch {}
    await sleep(120);
  }
  throw new Error('無法連接 P1 題材包稽核瀏覽器。');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); },
      close() { socket.close(); }
    }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!pending.has(message.id)) return; const request = pending.get(message.id); pending.delete(message.id); message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('P1 題材包稽核瀏覽器連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

async function navigate(client, suffix = '') {
  await client.call('Page.navigate', { url: `${baseUrl}?p1Audit=${Date.now()}${suffix}` });
  await sleep(1300);
}

async function completePack(client, topic, stage) {
  await navigate(client);
  const expected = await evaluate(client, `window.P1_SAFETY_TRANSITION_LAB?.roundsFor(${JSON.stringify(topic)}, ${JSON.stringify(stage)}) || []`);
  const opened = await evaluate(client, `(() => { window.P1_SAFETY_TRANSITION_LAB?.openTopic(${JSON.stringify(topic)}, { stage: ${JSON.stringify(stage)}, trigger: document.querySelector('[data-p1-topic]') }); document.querySelector('[data-p1-start]')?.click(); return Boolean(document.querySelector('.p1-host')); })()`);
  const checks = [];
  for (const round of expected) {
    const result = await evaluate(client, `(() => {
      const choices = [...document.querySelectorAll('[data-p1-choice]')];
      const target = choices.find((button) => button.textContent.includes(${JSON.stringify(round.answer)}));
      const progress = document.querySelector('.p1-progress span')?.textContent || '';
      target?.click();
      return { target: Boolean(target), progress, choiceCount: choices.length, named: choices.every((button) => button.getAttribute('aria-label') && button.textContent.trim()) };
    })()`);
    checks.push(result);
    await sleep(480);
  }
  const completed = await evaluate(client, `(() => ({ finish: Boolean(document.querySelector('.p1-finish')), dialog: document.querySelector('.p1-dialog')?.getAttribute('role') || '', status: document.querySelector('#p1Status')?.getAttribute('role') || '', live: document.querySelector('#p1Status')?.getAttribute('aria-live') || '', focusInside: Boolean(document.querySelector('.p1-host')?.contains(document.activeElement)) }))()`);
  return { topic, stage, expected, opened, checks, completed };
}

async function auditEscape(client) {
  await navigate(client);
  const before = await evaluate(client, `(() => { const card = document.querySelector('[data-p1-topic="digital"]'); card?.focus(); card?.click(); return { card: Boolean(card), dialog: Boolean(document.querySelector('.p1-host')) }; })()`);
  await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  await sleep(80);
  return { before, after: await evaluate(client, `(() => ({ closed: !document.querySelector('.p1-host'), restored: document.activeElement?.dataset?.p1Topic === 'digital', activeTopic: document.activeElement?.dataset?.p1Topic || '', activeText: document.activeElement?.textContent?.trim().slice(0, 80) || '' }))()`) };
}

async function auditMobile(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await navigate(client);
  const reports = [];
  for (const topic of topics) {
    await evaluate(client, `window.P1_SAFETY_TRANSITION_LAB?.openTopic(${JSON.stringify(topic)}, { stage: 'lower', trigger: document.querySelector('[data-p1-topic]') }); document.querySelector('[data-p1-start]')?.click();`);
    await sleep(50);
    reports.push(await evaluate(client, `(() => { const dialog = document.querySelector('.p1-dialog'); const controls = [...(dialog?.querySelectorAll('button') || [])].filter((button) => button.offsetParent !== null).map((button) => { const box = button.getBoundingClientRect(); return { width: Math.round(box.width), height: Math.round(box.height), label: button.textContent.trim().slice(0, 70) }; }); return { topic: ${JSON.stringify(topic)}, dialog: Boolean(dialog), overflow: document.documentElement.scrollWidth > window.innerWidth, choiceGridColumns: getComputedStyle(document.querySelector('.p1-choices')).gridTemplateColumns, narrow: controls.filter((item) => item.width < 40 || item.height < 40), controls: controls.length }; })()`));
    await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  }
  await client.call('Emulation.clearDeviceMetricsOverride');
  return reports;
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  const structural = [];
  for (const topic of topics) for (const stage of stages) {
    await navigate(client);
    structural.push(await evaluate(client, `(() => { const rounds = window.P1_SAFETY_TRANSITION_LAB?.roundsFor(${JSON.stringify(topic)}, ${JSON.stringify(stage)}) || []; const indices = rounds.map((round) => round.choices.indexOf(round.answer)); return { topic: ${JSON.stringify(topic)}, stage: ${JSON.stringify(stage)}, count: rounds.length, ids: rounds.map((round) => round.id), distinctPrompts: new Set(rounds.map((round) => round.title + '｜' + round.scene)).size, choicesValid: rounds.every((round) => round.choices.length === 3 && round.choices.includes(round.answer) && new Set(round.choices).size === 3), answerIndices: indices, positionsBalanced: indices.every((index, position) => index === position % 3), privateDataFree: rounds.every((round) => !/(輸入|填寫).{0,12}(密碼|電話|帳戶|地址|位置)/.test(round.prompt + round.scene + round.hint)) }; })()`));
  }
  const flows = [];
  for (const topic of topics) for (const stage of stages) flows.push(await completePack(client, topic, stage));
  const escape = await auditEscape(client);
  const mobile = await auditMobile(client);
  const failures = [];
  structural.forEach((entry) => {
    if (entry.count !== 8 || new Set(entry.ids).size !== 8 || entry.distinctPrompts !== 8) failures.push(`${entry.topic}｜${entry.stage}：未有八個不同的原生情境。`);
    if (!entry.choicesValid || !entry.positionsBalanced) failures.push(`${entry.topic}｜${entry.stage}：三欄選項、正解對應或左中右位置平衡不正確。`);
    if (!entry.privateDataFree) failures.push(`${entry.topic}｜${entry.stage}：題面可能要求或暗示輸入私人資料。`);
  });
  flows.forEach((flow) => {
    if (!flow.opened || flow.checks.length !== 8 || flow.checks.some((item) => !item.target || item.choiceCount !== 3 || !item.named) || !flow.completed.finish || flow.completed.dialog !== 'dialog' || flow.completed.status !== 'status' || flow.completed.live !== 'polite' || !flow.completed.focusInside) failures.push(`${flow.topic}｜${flow.stage}：八關完成、控制語意或對話框流程失敗。`);
  });
  if (!escape.before.card || !escape.before.dialog || !escape.after.closed || !escape.after.restored) failures.push('P1 題材包：Escape 未能關閉並將焦點回復至啟動卡。');
  mobile.forEach((entry) => { if (!entry.dialog || entry.overflow || entry.narrow.length || entry.choiceGridColumns.split(' ').length !== 1) failures.push(`${entry.topic}：375px 行動版有未載入、橫向溢出、過小控制或非單欄選項。`); });
  const output = { scope: '四個 P1 跨類別題材包，四學段各八個虛構情境', structural, flows: flows.map(({ expected, ...flow }) => ({ ...flow, rounds: expected.length })), escape, mobile, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ structuralSets: structural.length, interactionFlows: flows.length, failureCount: failures.length, failures }, null, 2));
  client.close();
  if (failures.length) process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
}
