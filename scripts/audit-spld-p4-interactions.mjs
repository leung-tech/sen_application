import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9388;
const reportPath = '/home/ubuntu/sen_application/spld-p4-interaction-audit.json';
const pageUrl = 'file:///home/ubuntu/sen_application/index.html?senAudit=p4-interaction';
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-p4-interaction-cdp', '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function targetUrl() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((item) => item.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(150);
  }
  throw new Error('無法連接高小 SpLD 互動稽核瀏覽器。');
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
    socket.addEventListener('error', () => reject(new Error('高小 SpLD 互動稽核連線失敗。')));
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
  await sleep(1100);

  const challenge = await evaluate(client, `(() => {
    window.SPLD_P4_LAB.openActivity('sentence');
    document.querySelector('[data-p4-difficulty="challenge"]')?.click();
    const root = document.querySelector('.spld-p4-lab');
    return {
      root: Boolean(root),
      progress: root?.querySelector('.spld-p4-progress span')?.textContent || '',
      blocks: root?.querySelectorAll('.spld-p4-block[draggable="true"]').length || 0,
      slots: root?.querySelectorAll('[data-sentence-slot]').length || 0,
      preview: root?.querySelector('.spld-p4-sentence-preview')?.textContent || '',
      dragNote: root?.querySelector('#spldP4DragNote')?.textContent || ''
    };
  })()`);

  const sentenceDrop = await evaluate(client, `(() => {
    const root = document.querySelector('.spld-p4-lab');
    const block = [...(root?.querySelectorAll('.spld-p4-block[draggable="true"]') || [])].find((item) => item.textContent.trim() === '研究小組');
    const slot = root?.querySelector('[data-sentence-slot="0"]');
    if (!block || !slot || !window.DataTransfer) return { supported: false };
    const transfer = new DataTransfer();
    transfer.setData('text/plain', block.dataset.block || '');
    block.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    slot.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    slot.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    return { supported: true, placed: root?.querySelector('[data-sentence-slot="0"] strong')?.textContent || '', feedback: root?.querySelector('#spldP4Feedback')?.textContent || '' };
  })()`);

  const memoryBefore = await evaluate(client, `(() => {
    window.SPLD_P4_LAB.openActivity('memory');
    const root = document.querySelector('.spld-p4-lab');
    return {
      cards: root?.querySelectorAll('[data-memory-card]').length || 0,
      disabled: root?.querySelectorAll('[data-memory-card][disabled]').length || 0,
      hidden: [...(root?.querySelectorAll('[data-memory-card] span') || [])].every((card) => card.textContent === '？'),
      studyButton: root?.querySelector('#spldP4MemoryStudy')?.textContent || ''
    };
  })()`);

  const memoryStudy = await evaluate(client, `(() => {
    document.querySelector('#spldP4MemoryStudy')?.click();
    const root = document.querySelector('.spld-p4-lab');
    return {
      revealed: [...(root?.querySelectorAll('[data-memory-card] span') || [])].every((card) => card.textContent !== '？'),
      stillDisabled: root?.querySelectorAll('[data-memory-card][disabled]').length || 0,
      startButton: root?.querySelector('#spldP4MemoryStudy')?.textContent || ''
    };
  })()`);

  const memoryMatch = await evaluate(client, `(() => {
    document.querySelector('#spldP4MemoryStudy')?.click();
    const root = document.querySelector('.spld-p4-lab');
    return {
      hiddenAgain: [...(root?.querySelectorAll('[data-memory-card] span') || [])].every((card) => card.textContent === '？'),
      enabledCards: root?.querySelectorAll('[data-memory-card]:not([disabled])').length || 0,
      studyButtonGone: !root?.querySelector('#spldP4MemoryStudy')
    };
  })()`);

  const style = await evaluate(client, `(() => {
    const root = document.querySelector('.spld-p4-lab');
    const gap = getComputedStyle(root?.querySelector('.spld-p4-memory-board') || document.body).gap;
    const feedback = root?.querySelector('#spldP4Feedback');
    return { gap, feedbackRole: feedback?.getAttribute('role') || '', feedbackLive: feedback?.getAttribute('aria-live') || '' };
  })()`);

  await client.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const reducedMotion = await evaluate(client, `(() => {
    window.SPLD_P4_LAB.openActivity('sentence');
    const slot = document.querySelector('[data-sentence-slot]');
    const block = document.querySelector('.spld-p4-block');
    return { slotTransition: getComputedStyle(slot).transitionDuration, blockTransition: getComputedStyle(block).transitionDuration };
  })()`);

  const failures = [];
  if (!challenge.root || !challenge.progress.includes('/ 10') || challenge.blocks !== 3 || challenge.slots !== 3 || !challenge.preview.includes('完成三格後') || !challenge.dragNote.includes('拖拉或點選')) failures.push('句型重組挑戰難度未載入完整題庫或拖拉操作說明。');
  if (!sentenceDrop.supported || sentenceDrop.placed !== '研究小組' || !sentenceDrop.feedback) failures.push('句型積木拖拉至句法位置的互動或回饋不完整。');
  if (memoryBefore.cards !== 4 || memoryBefore.disabled !== 4 || !memoryBefore.hidden || !memoryBefore.studyButton.includes('翻開全部')) failures.push('翻卡遊戲未從全部遮蓋的記憶準備步驟開始。');
  if (!memoryStudy.revealed || memoryStudy.stillDisabled !== 4 || !memoryStudy.startButton.includes('我記好了')) failures.push('翻卡遊戲的全部翻開記憶步驟不完整。');
  if (!memoryMatch.hiddenAgain || memoryMatch.enabledCards !== 4 || !memoryMatch.studyButtonGone) failures.push('翻卡遊戲未正確由記憶步驟轉入配對步驟。');
  if (!style.gap || style.feedbackRole !== 'status' || style.feedbackLive !== 'polite') failures.push('高小互動區間距或動態回饋語意不完整。');
  if (parseFloat(reducedMotion.slotTransition) > 0.001 || parseFloat(reducedMotion.blockTransition) > 0.001) failures.push('高小拖拉與翻卡互動未遵從減少動態效果設定。');

  const report = { standard: 'P4 challenge bank, drag-or-click sentence assembly and staged memory matching', challenge, sentenceDrop, memoryBefore, memoryStudy, memoryMatch, style, reducedMotion, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ failureCount: failures.length, failures }, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
