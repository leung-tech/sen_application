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
    const targets = Object.entries(window).filter(([name]) => /^(SPLD|ASD|ADHD)_/.test(name)); const seen = new WeakSet(); const sets=[];
    const valueOf = (choice) => Array.isArray(choice) ? choice.at(-1) : choice;
    const walk = (value, path) => { if (!value || typeof value !== 'object' || seen.has(value)) return; seen.add(value); if (Array.isArray(value)) { value.forEach((item, index) => walk(item, path + '[' + index + ']')); return; } Object.entries(value).forEach(([key, child]) => { if (key === 'rounds' && Array.isArray(child)) { const positions = child.map((round) => { const answer=round?.answer ?? round?.target; if (!round || !Array.isArray(round.choices) || round.choices.length !== 3 || !['string','number'].includes(typeof answer) || Array.isArray(answer)) return null; return round.choices.findIndex((choice) => String(valueOf(choice)) === String(answer)); }).filter(Number.isInteger); if (positions.length >= 2) sets.push({ path: path + '.rounds', total: positions.length, positions, balanced: positions.every((position, index) => position === index % 3) }); } else walk(child, path + '.' + key); }); };
    targets.forEach(([name, value]) => { walk(value, name); if (typeof value?.activityCards === 'function') ['lower','upper','junior','senior'].forEach((stage) => { try { walk(value.activityCards(stage), name + '.activityCards(' + stage + ')'); } catch {} }); });
    const summary = {}; sets.forEach((set) => { const name = set.path.split('.')[0]; summary[name] ||= { sets: 0, rounds: 0, left: 0, middle: 0, right: 0, failures: 0 }; const item = summary[name]; item.sets += 1; item.rounds += set.total; set.positions.forEach((position) => { if (position === 0) item.left += 1; else if (position === 1) item.middle += 1; else item.right += 1; }); if (!set.balanced) item.failures += 1; }); return { sets, summary, failureCount: sets.filter((set) => !set.balanced).length }; })()` });
  const output = response.result.value;
  console.log(JSON.stringify(output, null, 2));
  if (!output || output.failureCount) process.exitCode = 1;
  client.close();
} finally { chrome.kill('SIGTERM'); }
