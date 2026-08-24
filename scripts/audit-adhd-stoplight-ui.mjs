import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9480;
const reportPath = '/home/ubuntu/sen_application/ADHD_STOPLIGHT_UI_AUDIT_20260824.json';
const url = 'file:///home/ubuntu/sen_application/index.html?adhdStoplightUiAudit=20260824';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/adhd-stoplight-ui-audit', 'about:blank'], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error('無法連接 ADHD 紅綠燈介面測試瀏覽器。');
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
    socket.addEventListener('error', () => reject(new Error('ADHD 紅綠燈介面測試瀏覽器連線失敗。')));
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
  await evaluate(client, `(() => {
    window.ADHD_FIFTEEN_CATALOGUE_LAB?.open({ stage: 'lower' });
    document.querySelector('[data-adhd15-activity="stopLight"]')?.click();
    document.querySelector('#adhd15Start')?.click();
  })()`);
  await sleep(120);
  const rounds = [];
  for (let index = 0; index < 8; index += 1) {
    const round = await evaluate(client, `(() => ({
      progress: document.querySelector('.adhd15-progress b')?.textContent.trim() || '',
      scene: document.querySelector('.adhd15-scene p')?.textContent.trim() || '',
      prompt: document.querySelector('.adhd15-prompt')?.textContent.trim() || '',
      answer: window.ADHD_FIFTEEN_CATALOGUE_LAB.activityCards('lower').find((activity) => activity.id === 'stopLight').rounds[${index}].answer,
      choices: [...document.querySelectorAll('[data-adhd15-answer]')].map((button) => button.dataset.adhd15Answer || '')
    }))()`);
    rounds.push(round);
    await evaluate(client, `(() => {
      const answer = window.ADHD_FIFTEEN_CATALOGUE_LAB.activityCards('lower').find((activity) => activity.id === 'stopLight').rounds[${index}].answer;
      document.querySelector('[data-adhd15-answer="' + CSS.escape(answer) + '"]')?.click();
    })()`);
    await sleep(900);
  }
  const finished = await evaluate(client, `document.querySelector('#adhdFifteenCatalogueHost h2')?.textContent.trim() || ''`);
  const issues = [];
  for (const key of ['scene', 'prompt', 'answer']) if (new Set(rounds.map((round) => round[key])).size !== 8) issues.push(`${key} 在實際介面中重覆。`);
  if (rounds.some((round) => !round.progress.includes('/ 8') || round.choices.length !== 3 || round.prompt.includes('溫習小題'))) issues.push('實際介面的八關進度、選項或題幹不完整。');
  if (!finished.includes('完成八題小練習')) issues.push('八關完成畫面未正常顯示。');
  const output = { rounds, finished, failureCount: issues.length, issues };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ failureCount: issues.length, issues, rounds: rounds.map(({ progress, scene, prompt, answer }) => ({ progress, scene, prompt, answer })) }, null, 2));
  client.close();
  if (issues.length) process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
}
