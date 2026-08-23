import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9390;
const reportPath = '/home/ubuntu/sen_application/spld-p4-challenge-content-audit.json';
const pageUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html?senAudit=p4-challenge-content';
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-p4-challenge-cdp', '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function targetUrl() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = pages.find((item) => item.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(150);
  }
  throw new Error('無法連接挑戰題庫內容稽核瀏覽器。');
}

async function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let sequence = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) {
        const id = ++sequence;
        socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall }));
      },
      close() { socket.close(); }
    }));
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data); const entry = pending.get(message.id);
      if (!entry) return; pending.delete(message.id);
      message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result);
    });
    socket.addEventListener('error', () => reject(new Error('挑戰題庫內容稽核連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Page.navigate', { url: pageUrl });
  await sleep(1000);
  const analysis = await evaluate(client, `(() => {
    const rounds = (window.SPLD_P4_LAB?.activityCards?.().find((card) => card.p4ActivityKey === 'sentence')?.rounds || []).filter((round) => round.level === 'challenge');
    const abstractTerms = ['數據', '論點', '策略', '計畫', '變化', '安排', '論據', '論證', '意見', '成效'];
    const items = rounds.map((round, index) => ({
      number: index + 1,
      subject: round.subject,
      verb: round.verb,
      object: round.object,
      sentence: [round.subject, round.verb, round.object].join(''),
      subjectLength: [...round.subject].length,
      verbLength: [...round.verb].length,
      objectLength: [...round.object].length,
      abstractTerms: abstractTerms.filter((term) => (round.subject + round.verb + round.object).includes(term)),
      hasHint: Boolean(round.hint)
    }));
    return {
      count: items.length,
      items,
      minObjectLength: Math.min(...items.map((item) => item.objectLength)),
      maxObjectLength: Math.max(...items.map((item) => item.objectLength)),
      allSvo: items.every((item) => item.subject && item.verb && item.object),
      allHints: items.every((item) => item.hasHint),
      distinctVerbs: new Set(items.map((item) => item.verb)).size,
      distinctSubjects: new Set(items.map((item) => item.subject)).size
    };
  })()`);
  const failures = [];
  if (analysis.count !== 10) failures.push('挑戰級不是十關。');
  if (!analysis.allSvo || !analysis.allHints) failures.push('部分挑戰題缺少主語、謂語、賓語或提示。');
  if (analysis.minObjectLength < 4 || analysis.maxObjectLength < 8) failures.push('挑戰題的賓語長度缺少由中等至較高語言負荷的跨度。');
  if (analysis.distinctVerbs < 8 || analysis.distinctSubjects < 8) failures.push('挑戰題的核心動詞或主語重複過多。');
  const report = { standard: 'P4 sentence challenge content count, SVO completeness, vocabulary diversity and language-load span', ...analysis, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ count: report.count, objectLengthRange: [report.minObjectLength, report.maxObjectLength], distinctVerbs: report.distinctVerbs, distinctSubjects: report.distinctSubjects, failureCount: report.failureCount, failures }, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
