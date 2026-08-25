import { spawn } from 'node:child_process';

const port = 9446;
const baseUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/sen-answer-balance-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });

async function socketUrl() {
  for (let i = 0; i < 50; i += 1) {
    try { const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json()); const page = pages.find((item) => item.type === 'page'); if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl; } catch {}
    await sleep(120);
  }
  throw new Error('無法連接答案位置稽核瀏覽器。');
}

async function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({ call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(requestId, { resolve: resolveCall, reject: rejectCall })); }, close() { socket.close(); } }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('答案位置稽核瀏覽器連線失敗。')));
  });
}

try {
  const client = await connect(await socketUrl());
  await client.call('Page.enable');
  await client.call('Page.navigate', { url: `${baseUrl}?answerBalanceAudit=${Date.now()}` });
  await sleep(1600);
  const response = await client.call('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(() => {
    const targets = Object.entries(window).filter(([name]) => name.endsWith('_STAGE_TASKS') || name.endsWith('_LAB') || name.endsWith('_GAMES_LAB') || name === 'SEN_PATHWAY_MODULES' || name === 'idStageTraining'); const seen = new WeakSet(); const sets=[];
    const valueOf = (choice) => Array.isArray(choice) ? choice.at(-1) : (choice && typeof choice === 'object' ? (choice.value ?? choice.answer ?? choice.label) : choice);
    const walk = (value, path, inheritedStrategy = null, inheritedPattern = null) => { if (!value || typeof value !== 'object' || seen.has(value)) return; seen.add(value); if (Array.isArray(value)) { value.forEach((item, index) => walk(item, path + '[' + index + ']', inheritedStrategy, inheritedPattern)); return; } const strategy = value.answerPositionStrategy || inheritedStrategy; const pattern = Array.isArray(value.answerPositionPattern) ? value.answerPositionPattern : inheritedPattern; Object.entries(value).forEach(([key, child]) => { if (key === 'rounds' && Array.isArray(child)) { const entries = child.map((round) => { const answer=round?.answer ?? round?.target; if (!round || !Array.isArray(round.choices) || round.choices.length < 2 || !['string','number'].includes(typeof answer) || Array.isArray(answer)) return null; const position=round.choices.findIndex((choice) => String(valueOf(choice)) === String(answer)); return Number.isInteger(position) && position >= 0 ? {position, width:round.choices.length} : null; }).filter(Boolean); if (entries.length >= 2) { const positions=entries.map((entry)=>entry.position); const widths=entries.map((entry)=>entry.width); const legacyBalanced=entries.every((entry, index) => entry.position === index % entry.width); const counts=positions.reduce((all, position) => { all[position]=(all[position] || 0)+1; return all; }, {}); const spread=Math.max(...Object.values(counts))-Math.min(...Object.values(counts)); let run=1; let longestRun=1; positions.slice(1).forEach((position, index) => { run=position === positions[index] ? run + 1 : 1; longestRun=Math.max(longestRun, run); }); const patternMatch=Array.isArray(pattern) && positions.every((position, index) => position === pattern[index % pattern.length]); const balanced=strategy === 'irregular-balanced' ? Boolean(patternMatch && !legacyBalanced && spread <= 1 && longestRun <= 1) : legacyBalanced; sets.push({ path: path + '.rounds', total: entries.length, positions, widths, strategy:strategy || 'cyclic', balanced }); } } else walk(child, path + '.' + key, strategy, pattern); }); };
    targets.forEach(([name, value]) => { walk(value, name); if (typeof value?.activityCards === 'function') ['lower','upper','junior','senior'].forEach((stage) => { try { walk(value.activityCards(stage), name + '.activityCards(' + stage + ')'); } catch {} }); });
    const summary = {}; sets.forEach((set) => { const name = set.path.split('.')[0]; summary[name] ||= { sets: 0, rounds: 0, left: 0, middle: 0, right: 0, failures: 0 }; const item = summary[name]; item.sets += 1; item.rounds += set.total; set.positions.forEach((position) => { if (position === 0) item.left += 1; else if (position === 1) item.middle += 1; else item.right += 1; }); if (!set.balanced) item.failures += 1; }); return { sets, summary, failureCount: sets.filter((set) => !set.balanced).length }; })()` });
  const output = response.result.value;
  console.log(JSON.stringify(output, null, 2));
  if (!output || output.failureCount) process.exitCode = 1;
  client.close();
} finally { chrome.kill('SIGTERM'); }
