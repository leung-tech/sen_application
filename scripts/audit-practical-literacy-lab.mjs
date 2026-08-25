import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const port = 9388;
const reportPath = '/home/ubuntu/sen_application/practical-literacy-audit.json';
const baseUrl = pathToFileURL(resolve('index.html')).href;
const stages = ['lower', 'upper', 'junior', 'senior'];
const packs = { finance: { label: '日常金錢與消費決策', expectedContext: '虛構消費情境', stages }, body: { label: '身體訊號、休息與日常健康溝通', expectedContext: '虛構日常健康溝通情境', stages }, study: { label: '學習工具與考試調適自我管理', expectedContext: '虛構學習工具與調適情境', stages: ['upper', 'junior', 'senior'] } };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/practical-literacy-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });

async function socketUrl() { for (let attempt = 0; attempt < 50; attempt += 1) { try { const target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((item) => item.type === 'page'); if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl; } catch {} await sleep(120); } throw new Error('無法連接實用素養題材包稽核瀏覽器。'); }
function connect(url) { return new Promise((resolve, reject) => { const socket = new WebSocket(url); const pending = new Map(); let id = 0; socket.addEventListener('open', () => resolve({ call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } })); socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); }); socket.addEventListener('error', () => reject(new Error('實用素養題材包稽核瀏覽器連線失敗。'))); }); }
async function evaluate(client, expression) { const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || '頁面運算式失敗。'); return result.result.value; }
async function navigate(client) { await client.call('Page.navigate', { url: `${baseUrl}?practicalAudit=${Date.now()}` }); await sleep(1250); }

async function completeStage(client, key, stage) {
  await navigate(client);
  const expected = await evaluate(client, `window.PRACTICAL_LITERACY_LAB?.roundsFor(${JSON.stringify(key)}, ${JSON.stringify(stage)}) || []`);
  const opened = await evaluate(client, `(() => { const trigger = document.querySelector('[data-practical-pack=${JSON.stringify(key)}]'); window.PRACTICAL_LITERACY_LAB?.open(${JSON.stringify(key)}, { stage: ${JSON.stringify(stage)}, trigger }); document.querySelector('[data-practical-start]')?.click(); return { dialog: Boolean(document.querySelector('.practical-host')), context: document.querySelector('.practical-scene small')?.textContent || '' }; })()`);
  const choices = [];
  for (const round of expected) { choices.push(await evaluate(client, `(() => { const buttons = [...document.querySelectorAll('[data-practical-choice]')]; const button = buttons.find((item) => item.textContent.includes(${JSON.stringify(round.answer)})); button?.click(); return { found: Boolean(button), count: buttons.length, named: buttons.every((item) => item.getAttribute('aria-label') && item.textContent.trim()), progress: document.querySelector('.practical-progress span')?.textContent || '' }; })()`)); await sleep(480); }
  const completed = await evaluate(client, `(() => ({ finish: Boolean(document.querySelector('.practical-finish')), dialog: document.querySelector('.practical-dialog')?.getAttribute('role') || '', status: document.querySelector('#practicalStatus')?.getAttribute('role') || '', live: document.querySelector('#practicalStatus')?.getAttribute('aria-live') || '', focusInside: Boolean(document.querySelector('.practical-host')?.contains(document.activeElement)) }))()`);
  return { key, stage, expected, opened, choices, completed };
}

async function auditEscape(client, key, stage) {
  await navigate(client);
  await evaluate(client, `document.querySelector('[data-stage=${JSON.stringify(stage)}]')?.click();`); await sleep(100);
  const before = await evaluate(client, `(() => { const card = document.querySelector('[data-practical-pack=${JSON.stringify(key)}]'); card?.focus(); card?.click(); return { card: Boolean(card), dialog: Boolean(document.querySelector('.practical-host')) }; })()`);
  await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`); await sleep(80);
  return { key, before, after: await evaluate(client, `(() => ({ closed: !document.querySelector('.practical-host'), restored: document.activeElement?.dataset?.practicalPack === ${JSON.stringify(key)}, activePack: document.activeElement?.dataset?.practicalPack || '' }))()`) };
}

async function auditMobile(client, key, stage) {
  await navigate(client); await evaluate(client, `window.PRACTICAL_LITERACY_LAB?.open(${JSON.stringify(key)}, { stage: ${JSON.stringify(stage)}, trigger: document.querySelector('[data-practical-pack=${JSON.stringify(key)}]') }); document.querySelector('[data-practical-start]')?.click();`); await sleep(60);
  const report = await evaluate(client, `(() => { const dialog = document.querySelector('.practical-dialog'); const buttons = [...(dialog?.querySelectorAll('button') || [])].filter((item) => item.offsetParent !== null).map((item) => { const box = item.getBoundingClientRect(); return { width: Math.round(box.width), height: Math.round(box.height) }; }); return { key: ${JSON.stringify(key)}, stage: ${JSON.stringify(stage)}, dialog: Boolean(dialog), overflow: document.documentElement.scrollWidth > window.innerWidth, columns: getComputedStyle(document.querySelector('.practical-choices')).gridTemplateColumns, narrow: buttons.filter((item) => item.width < 40 || item.height < 40) }; })()`);
  await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`); return report;
}

try {
  const client = await connect(await socketUrl()); await client.call('Page.enable');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  const mobile = []; for (const [key, pack] of Object.entries(packs)) for (const stage of pack.stages) mobile.push(await auditMobile(client, key, stage)); await client.call('Emulation.clearDeviceMetricsOverride');
  await navigate(client);
  const structural = []; for (const [key, pack] of Object.entries(packs)) for (const stage of pack.stages) structural.push(await evaluate(client, `(() => { const source = window.PRACTICAL_LITERACY_LAB?.packInfo?.(${JSON.stringify(key)}) || {}; const rounds = window.PRACTICAL_LITERACY_LAB?.roundsFor(${JSON.stringify(key)}, ${JSON.stringify(stage)}) || []; const positions = rounds.map((round) => round.choices.indexOf(round.answer)); const text = rounds.map((round) => [round.title, round.scene, round.prompt, round.hint].join('｜')).join('\\n'); const safety = [source.intro, ...(source.safetyBullets || []), source.finishMessage].join('｜'); return { key: ${JSON.stringify(key)}, stage: ${JSON.stringify(stage)}, count: rounds.length, ids: rounds.map((round) => round.id), distinct: new Set(rounds.map((round) => round.title + '｜' + round.scene)).size, choicesValid: rounds.every((round) => round.choices.length === 3 && new Set(round.choices).size === 3 && round.choices.includes(round.answer)), positions, balanced: positions.every((position, index) => position === index % 3), financeCollectionRequest: /((請|必須|先).{0,12}(輸入|填寫|上傳|提供)).{0,30}(銀行|信用卡|八達通|帳戶|密碼|電話|地址|付款資料)/.test(text), prohibitedFinanceAdvice: /(投資建議|信貸建議|借貸建議|賭博建議)/.test(text), bodySafety: { noData: /不會要求.{0,24}(真實症狀|病歷|用藥|健康資料)/.test(safety), noDiagnosis: /不作.{0,12}診斷/.test(safety), noTreatment: /不提供.{0,16}(服藥|用藥).{0,12}(治療)?指示/.test(safety), urgentSupport: /(急切安全疑慮|需要立即協助).{0,42}(可信任成人|緊急服務)/.test(safety) }, studySafety: { noExamRules: /不代表.{0,16}公開試規則/.test(safety), noGuarantee: /不保證.{0,24}(調適|輔具|評核安排)/.test(safety), schoolConfirm: /與學校.{0,16}確認/.test(safety) } }; })()`));
  const flows = []; for (const [key, pack] of Object.entries(packs)) for (const stage of pack.stages) flows.push(await completeStage(client, key, stage));
  const escape = []; for (const [key, pack] of Object.entries(packs)) escape.push(await auditEscape(client, key, pack.stages[0]));
  const failures = [];
  structural.forEach((entry) => { if (entry.count !== 8 || new Set(entry.ids).size !== 8 || entry.distinct !== 8) failures.push(`${entry.key}／${entry.stage}：未有八個不同情境。`); if (!entry.choicesValid || !entry.balanced) failures.push(`${entry.key}／${entry.stage}：三欄選項或左中右答案位置不正確。`); if (entry.key === 'finance' && (entry.financeCollectionRequest || entry.prohibitedFinanceAdvice)) failures.push(`${entry.key}／${entry.stage}：出現不符合金錢資料或建議安全界線的文字。`); if (entry.key === 'body' && (!entry.bodySafety.noData || !entry.bodySafety.noDiagnosis || !entry.bodySafety.noTreatment || !entry.bodySafety.urgentSupport)) failures.push(`${entry.key}／${entry.stage}：缺少健康資料、診斷／治療或急切安全求助界線。`); if (entry.key === 'study' && (!entry.studySafety.noExamRules || !entry.studySafety.noGuarantee || !entry.studySafety.schoolConfirm)) failures.push(`${entry.key}／${entry.stage}：缺少公開試規則、調適保證或學校確認安全界線。`); });
  flows.forEach((flow) => { if (!flow.opened.dialog || flow.opened.context !== packs[flow.key].expectedContext || flow.choices.length !== 8 || flow.choices.some((item) => !item.found || item.count !== 3 || !item.named) || !flow.completed.finish || flow.completed.dialog !== 'dialog' || flow.completed.status !== 'status' || flow.completed.live !== 'polite' || !flow.completed.focusInside) failures.push(`${flow.key}／${flow.stage}：八關互動、完成頁、題材標籤或可及性流程失敗。`); });
  escape.forEach((entry) => { if (!entry.before.card || !entry.before.dialog || !entry.after.closed || !entry.after.restored) failures.push(`${entry.key}：Escape 未能關閉並將焦點回復至啟動卡。`); });
  mobile.forEach((entry) => { if (!entry.dialog || entry.overflow || entry.narrow.length || entry.columns.split(' ').length !== 1) failures.push(`${entry.key}／${entry.stage}：375px 行動版有未載入、橫向溢出、過小控制或非單欄選項。`); });
  const output = { scope: '日常金錢與消費決策、身體訊號／休息／日常健康溝通：四學段各八個虛構情境', packs, structural, flows: flows.map(({ expected, ...flow }) => ({ ...flow, rounds: expected.length })), escape, mobile, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`); console.log(JSON.stringify({ structuralSets: structural.length, interactionFlows: flows.length, failureCount: failures.length, failures }, null, 2)); client.close(); if (failures.length) process.exitCode = 1;
} finally { chrome.kill('SIGTERM'); }
