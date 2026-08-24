import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9481;
const reportPath = '/home/ubuntu/sen_application/ID_RUNTIME_DUPLICITY_AUDIT_20260824.json';
const url = 'file:///home/ubuntu/sen_application/index.html?idRuntimeDuplicateAudit=20260824';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/id-runtime-duplicate-audit', 'about:blank'], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error('無法連接 ID 題庫掃描瀏覽器。');
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
    socket.addEventListener('error', () => reject(new Error('ID 題庫掃描瀏覽器連線失敗。')));
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
    const normaliseText = (text) => String(text)
      .replace(/^溫習小題\\s*\\d+：\\s*/, '')
      .replace(/小步\\s*\\d+\\s*[：:]/g, '小步：')
      .replace(/練習\\s*\\d+\\s*[：:]/g, '練習：')
      .replace(/第\\s*\\d+\\s*(步|項|張|題)\\s*[：:]/g, '第項：')
      .replace(/\\s+/g, ' ')
      .trim();
    const normalise = (value, key = '') => {
      if (Array.isArray(value)) {
        const next = value.map((item) => normalise(item, key));
        return ['choices', 'options'].includes(key) ? next.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : next;
      }
      if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter((item) => item !== 'id' && item !== 'band').map((item) => [item, normalise(value[item], item)]));
      return typeof value === 'string' ? normaliseText(value) : value;
    };
    const taskFingerprint = (round) => JSON.stringify(normalise(round));
    const collect = (stage, source, cards) => cards.map((activity) => {
      const rounds = activity.rounds || [];
      const fullPrints = rounds.map((round) => JSON.stringify(normalise(round)));
      const taskPrints = rounds.map(taskFingerprint);
      const duplicateIndexes = taskPrints.map((value, index) => taskPrints.indexOf(value) !== index ? index + 1 : 0).filter(Boolean);
      return { stage, source, id: activity.id, title: activity.title, rounds: rounds.length, uniqueRounds: new Set(fullPrints).size, uniqueTasks: new Set(taskPrints).size, duplicateIndexes };
    });
    const stageKeys = [['lower', '初小 P1–P3'], ['upper', '高小 P4–P6'], ['junior', '初中 S1–S3'], ['senior', '高中 S4–S6']];
    const stageTasks = stageKeys.flatMap(([key, label]) => collect(label, '主路線', [{ id: 'id-stage-' + key, title: window.idStageTraining?.[key]?.title || 'ID 主路線', rounds: window.idStageTraining?.[key]?.rounds || [] }]));
    const providers = [
      ['八項直接選關', window.ID_EIGHT_GAMES_LAB], ['進階直接選關', window.ID_ADVANCED_GAMES_LAB], ['十五項直接選關', window.ID_FIFTEEN_CATALOGUE_LAB]
    ];
    const direct = stageKeys.flatMap(([key, label]) => providers.flatMap(([source, provider]) => collect(label, source, provider?.activityCards?.(key) || [])));
    return [...stageTasks, ...direct];
  })()`);
  const duplicated = activities.filter((activity) => activity.rounds < 8 || activity.uniqueRounds < activity.rounds || activity.uniqueTasks < activity.rounds);
  const output = { activities, duplicated, failureCount: duplicated.length };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ totalActivities: activities.length, duplicateActivityCount: duplicated.length, duplicated }, null, 2));
  client.close();
  if (duplicated.length) process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
}
