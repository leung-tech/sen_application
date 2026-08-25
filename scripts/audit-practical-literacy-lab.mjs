import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const port = 9388;
const reportPath = '/home/ubuntu/sen_application/practical-literacy-audit.json';
const baseUrl = pathToFileURL(resolve('index.html')).href;
const stages = ['lower', 'upper', 'junior', 'senior'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/practical-literacy-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });

async function socketUrl() { for (let attempt = 0; attempt < 50; attempt += 1) { try { const target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((item) => item.type === 'page'); if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl; } catch {} await sleep(120); } throw new Error('無法連接消費題材包稽核瀏覽器。'); }
function connect(url) { return new Promise((resolve, reject) => { const socket = new WebSocket(url); const pending = new Map(); let id = 0; socket.addEventListener('open', () => resolve({ call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } })); socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); }); socket.addEventListener('error', () => reject(new Error('消費題材包稽核瀏覽器連線失敗。'))); }); }
async function evaluate(client, expression) { return (await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value; }
async function navigate(client) { await client.call('Page.navigate', { url: `${baseUrl}?practicalAudit=${Date.now()}` }); await sleep(1300); }

async function completeStage(client, stage) {
  await navigate(client);
  const expected = await evaluate(client, `window.PRACTICAL_LITERACY_LAB?.roundsFor('finance', ${JSON.stringify(stage)}) || []`);
  const opened = await evaluate(client, `(() => { const trigger = document.querySelector('[data-practical-pack="finance"]'); window.PRACTICAL_LITERACY_LAB?.open('finance', { stage: ${JSON.stringify(stage)}, trigger }); document.querySelector('[data-practical-start]')?.click(); return Boolean(document.querySelector('.practical-host')); })()`);
  const choices = [];
  for (const round of expected) { choices.push(await evaluate(client, `(() => { const buttons = [...document.querySelectorAll('[data-practical-choice]')]; const button = buttons.find((item) => item.textContent.includes(${JSON.stringify(round.answer)})); button?.click(); return { found: Boolean(button), count: buttons.length, named: buttons.every((item) => item.getAttribute('aria-label') && item.textContent.trim()), progress: document.querySelector('.practical-progress span')?.textContent || '' }; })()`)); await sleep(480); }
  const completed = await evaluate(client, `(() => ({ finish: Boolean(document.querySelector('.practical-finish')), dialog: document.querySelector('.practical-dialog')?.getAttribute('role') || '', status: document.querySelector('#practicalStatus')?.getAttribute('role') || '', live: document.querySelector('#practicalStatus')?.getAttribute('aria-live') || '', focusInside: Boolean(document.querySelector('.practical-host')?.contains(document.activeElement)) }))()`);
  return { stage, expected, opened, choices, completed };
}

async function auditEscape(client) {
  await navigate(client);
  const before = await evaluate(client, `(() => { const card = document.querySelector('[data-practical-pack="finance"]'); card?.focus(); card?.click(); return { card: Boolean(card), dialog: Boolean(document.querySelector('.practical-host')) }; })()`);
  await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`); await sleep(80);
  return { before, after: await evaluate(client, `(() => ({ closed: !document.querySelector('.practical-host'), restored: document.activeElement?.dataset?.practicalPack === 'finance', activePack: document.activeElement?.dataset?.practicalPack || '' }))()`) };
}

async function auditMobile(client) {
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true }); const reports = [];
  for (const stage of stages) { await navigate(client); await evaluate(client, `window.PRACTICAL_LITERACY_LAB?.open('finance', { stage: ${JSON.stringify(stage)}, trigger: document.querySelector('[data-practical-pack="finance"]') }); document.querySelector('[data-practical-start]')?.click();`); await sleep(60); reports.push(await evaluate(client, `(() => { const dialog = document.querySelector('.practical-dialog'); const buttons = [...(dialog?.querySelectorAll('button') || [])].filter((item) => item.offsetParent !== null).map((item) => { const box = item.getBoundingClientRect(); return { width: Math.round(box.width), height: Math.round(box.height) }; }); return { stage: ${JSON.stringify(stage)}, dialog: Boolean(dialog), overflow: document.documentElement.scrollWidth > window.innerWidth, columns: getComputedStyle(document.querySelector('.practical-choices')).gridTemplateColumns, narrow: buttons.filter((item) => item.width < 40 || item.height < 40) }; })()`)); await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`); }
  await client.call('Emulation.clearDeviceMetricsOverride'); return reports;
}

try {
  const client = await connect(await socketUrl()); await client.call('Page.enable');
  await navigate(client);
  const structural = await Promise.all(stages.map((stage) => evaluate(client, `(() => { const rounds = window.PRACTICAL_LITERACY_LAB?.roundsFor('finance', ${JSON.stringify(stage)}) || []; const positions = rounds.map((round) => round.choices.indexOf(round.answer)); const text = rounds.map((round) => [round.title, round.scene, round.prompt, round.hint].join('｜')).join('\\n'); return { stage: ${JSON.stringify(stage)}, count: rounds.length, ids: rounds.map((round) => round.id), distinct: new Set(rounds.map((round) => round.title + '｜' + round.scene)).size, choicesValid: rounds.every((round) => round.choices.length === 3 && new Set(round.choices).size === 3 && round.choices.includes(round.answer)), positions, balanced: positions.every((position, index) => position === index % 3), unsafeCollectionLanguage: /(輸入|填寫).{0,14}(銀行|信用卡|八達通|帳戶|密碼|電話|地址|付款資料)/.test(text), prohibitedAdvice: /(投資建議|信貸建議|借貸建議|賭博建議)/.test(text) }; })()`)));
  const flows = []; for (const stage of stages) flows.push(await completeStage(client, stage));
  const escape = await auditEscape(client); const mobile = await auditMobile(client); const failures = [];
  structural.forEach((entry) => { if (entry.count !== 8 || new Set(entry.ids).size !== 8 || entry.distinct !== 8) failures.push(`${entry.stage}：未有八個不同的消費情境。`); if (!entry.choicesValid || !entry.balanced) failures.push(`${entry.stage}：三欄選項或左中右答案位置不正確。`); if (entry.unsafeCollectionLanguage || entry.prohibitedAdvice) failures.push(`${entry.stage}：出現不符合金錢資料或建議安全界線的文字。`); });
  flows.forEach((flow) => { if (!flow.opened || flow.choices.length !== 8 || flow.choices.some((item) => !item.found || item.count !== 3 || !item.named) || !flow.completed.finish || flow.completed.dialog !== 'dialog' || flow.completed.status !== 'status' || flow.completed.live !== 'polite' || !flow.completed.focusInside) failures.push(`${flow.stage}：八關互動、完成頁或可及性流程失敗。`); });
  if (!escape.before.card || !escape.before.dialog || !escape.after.closed || !escape.after.restored) failures.push('消費題材包：Escape 未能關閉並將焦點回復至啟動卡。');
  mobile.forEach((entry) => { if (!entry.dialog || entry.overflow || entry.narrow.length || entry.columns.split(' ').length !== 1) failures.push(`${entry.stage}：375px 行動版有未載入、橫向溢出、過小控制或非單欄選項。`); });
  const output = { scope: '日常金錢與消費決策：四學段各八個虛構情境', structural, flows: flows.map(({ expected, ...flow }) => ({ ...flow, rounds: expected.length })), escape, mobile, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`); console.log(JSON.stringify({ structuralSets: structural.length, interactionFlows: flows.length, failureCount: failures.length, failures }, null, 2)); client.close(); if (failures.length) process.exitCode = 1;
} finally { chrome.kill('SIGTERM'); }
