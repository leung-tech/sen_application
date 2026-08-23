import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9389;
const reportPath = '/home/ubuntu/sen_application/spld-p4-mobile-interaction-audit.json';
const pageUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html?senAudit=p4-mobile';
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-p4-mobile-cdp', '--window-size=375,812', 'about:blank'], { stdio: 'ignore' });
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
  throw new Error('無法連接高小 SpLD 手機互動稽核瀏覽器。');
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
    socket.addEventListener('error', () => reject(new Error('高小 SpLD 手機互動稽核連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await client.call('Page.navigate', { url: pageUrl });
  await sleep(1100);

  const memoryInitial = await evaluate(client, `(() => {
    window.SPLD_P4_LAB.openActivity('memory');
    const root = document.querySelector('.spld-p4-lab');
    const cards = [...(root?.querySelectorAll('[data-memory-card]') || [])];
    const rects = cards.map((card) => { const rect = card.getBoundingClientRect(); return { width: Math.round(rect.width), height: Math.round(rect.height), font: getComputedStyle(card.querySelector('span')).fontSize }; });
    return { root: Boolean(root), overflow: document.documentElement.scrollWidth > innerWidth, cards: cards.length, hidden: cards.every((card) => card.querySelector('span')?.textContent === '？'), disabled: cards.filter((card) => card.disabled).length, study: root?.querySelector('#spldP4MemoryStudy')?.textContent || '', rects };
  })()`);

  const memoryStudy = await evaluate(client, `(() => {
    document.querySelector('#spldP4MemoryStudy')?.click();
    const root = document.querySelector('.spld-p4-lab');
    const cards = [...(root?.querySelectorAll('[data-memory-card]') || [])];
    return { shown: cards.every((card) => card.querySelector('span')?.textContent !== '？'), next: root?.querySelector('#spldP4MemoryStudy')?.textContent || '', disabled: cards.filter((card) => card.disabled).length };
  })()`);

  const memoryMatch = await evaluate(client, `(() => {
    document.querySelector('#spldP4MemoryStudy')?.click();
    const root = document.querySelector('.spld-p4-lab');
    const cards = [...(root?.querySelectorAll('[data-memory-card]') || [])];
    return { hiddenAgain: cards.every((card) => card.querySelector('span')?.textContent === '？'), enabled: cards.filter((card) => !card.disabled).length, studyGone: !root?.querySelector('#spldP4MemoryStudy'), overflow: document.documentElement.scrollWidth > innerWidth };
  })()`);

  const collocation = await evaluate(client, `(() => {
    window.SPLD_P4_LAB.openActivity('collocation');
    const root = document.querySelector('.spld-p4-lab');
    const choices = [...(root?.querySelectorAll('.spld-p4-choice') || [])];
    const target = choices.find((choice) => choice.dataset.choice === '潛能');
    const wrong = choices.find((choice) => choice.dataset.choice !== '潛能');
    wrong?.click();
    const retry = root?.querySelector('#spldP4Feedback')?.textContent || '';
    const retryState = root?.querySelector('#spldP4Feedback')?.className || '';
    target?.click();
    const success = root?.querySelector('#spldP4Feedback')?.textContent || '';
    const successState = root?.querySelector('#spldP4Feedback')?.className || '';
    const rects = choices.map((choice) => { const rect = choice.getBoundingClientRect(); return { width: Math.round(rect.width), height: Math.round(rect.height), font: getComputedStyle(choice.querySelector('strong')).fontSize }; });
    const prompt = root?.querySelector('.spld-p4-prompt');
    return { root: Boolean(root), overflow: document.documentElement.scrollWidth > innerWidth, choices: choices.length, retry, retryState, success, successState, promptFont: prompt ? getComputedStyle(prompt).fontSize : '', rects };
  })()`);

  const allRects = [...memoryInitial.rects, ...collocation.rects];
  const failures = [];
  if (!memoryInitial.root || memoryInitial.overflow || memoryInitial.cards !== 4 || !memoryInitial.hidden || memoryInitial.disabled !== 4 || !memoryInitial.study.includes('翻開全部')) failures.push('375px：翻卡的初始記憶步驟、遮蓋卡或版面不完整。');
  if (!memoryStudy.shown || memoryStudy.disabled !== 4 || !memoryStudy.next.includes('我記好了')) failures.push('375px：翻卡的共同記憶步驟未正確呈現。');
  if (!memoryMatch.hiddenAgain || memoryMatch.enabled !== 4 || !memoryMatch.studyGone || memoryMatch.overflow) failures.push('375px：翻卡轉入配對步驟後的操作狀態不完整。');
  if (!collocation.root || collocation.overflow || collocation.choices !== 3 || !collocation.retry || !collocation.retryState.includes('try') || !collocation.success || !collocation.successState.includes('success')) failures.push('375px：詞語配對的點選回饋或版面不完整。');
  if (allRects.some((rect) => rect.height < 44 || rect.width < 44)) failures.push('375px：翻卡或詞語配對的觸控目標小於 44px。');
  if (parseFloat(collocation.promptFont) < 18 || allRects.some((rect) => parseFloat(rect.font) < 18)) failures.push('375px：題幹或選項字級不足 18px。');

  const report = { standard: '375px P4 memory study-to-match and collocation touch interaction audit', memoryInitial, memoryStudy, memoryMatch, collocation, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ failureCount: failures.length, failures }, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
