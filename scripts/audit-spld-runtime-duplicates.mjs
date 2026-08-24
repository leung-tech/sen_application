import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9478;
const reportPath = '/home/ubuntu/sen_application/SPLD_RUNTIME_DUPLICITY_AUDIT_20260824.json';
const url = 'file:///home/ubuntu/sen_application/index.html?spldRuntimeDuplicateAudit=20260824';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/spld-runtime-duplicate-audit', 'about:blank'], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error('無法連接 SpLD 題庫掃描瀏覽器。');
}

function connect(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) {
        const requestId = ++id;
        socket.send(JSON.stringify({ id: requestId, method, params }));
        return new Promise((resolveCall, rejectCall) => {
          const timer = setTimeout(() => { pending.delete(requestId); rejectCall(new Error(`CDP 呼叫逾時：${method}`)); }, 15_000);
          pending.set(requestId, { resolve(value) { clearTimeout(timer); resolveCall(value); }, reject(error) { clearTimeout(timer); rejectCall(error); } });
        });
      },
      close() { socket.close(); },
    }));
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id || !pending.has(message.id)) return;
      const item = pending.get(message.id); pending.delete(message.id);
      message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result);
    });
    socket.addEventListener('error', () => reject(new Error('SpLD 題庫掃描瀏覽器連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const response = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || '頁面評估失敗。');
  return response.result.value;
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Page.navigate', { url });
  await sleep(900);
  const activities = await evaluate(client, `(() => {
    const providers = [
      ['P1', window.SPLD_P1_LAB], ['P4', window.SPLD_P4_LAB], ['S1', window.SPLD_S1_LAB], ['S4', window.SPLD_S4_LAB]
    ];
    const normalise = (value) => {
      if (Array.isArray(value)) return value.map(normalise);
      if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalise(value[key])]));
      return typeof value === 'string' ? value.replace(/^溫習小題\\s*\\d+：\\s*/, '') : value;
    };
    const fingerprint = (round) => JSON.stringify(normalise(round));
    return providers.flatMap(([stage, provider]) => (provider?.activityCards?.() || []).map((activity) => {
      const rounds = activity.rounds || [];
      const prints = rounds.map(fingerprint);
      const duplicateIndexes = prints.map((value, index) => prints.indexOf(value) !== index ? index + 1 : 0).filter(Boolean);
      return { stage, id: activity.id, title: activity.title, rounds: rounds.length, uniqueRounds: new Set(prints).size, duplicateIndexes };
    }));
  })()`);
  const duplicated = activities.filter((activity) => activity.rounds < 8 || activity.uniqueRounds < activity.rounds);
  const output = { activities, duplicated, failureCount: duplicated.length };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ totalActivities: activities.length, duplicateActivityCount: duplicated.length, duplicated }, null, 2));
  client.close();
  if (duplicated.length) process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
}
