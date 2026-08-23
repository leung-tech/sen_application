import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9391;
const reportPath = '/home/ubuntu/sen_application/spld-p4-mobile-drag-audit.json';
const pageUrl = process.env.SEN_AUDIT_URL || 'file:///home/ubuntu/sen_application/index.html?senAudit=p4-mobile-drag';
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-p4-mobile-drag-cdp', '--window-size=375,812', 'about:blank'], { stdio: 'ignore' });
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
  throw new Error('無法連接句型積木手機拖拉稽核瀏覽器。');
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
    socket.addEventListener('error', () => reject(new Error('句型積木手機拖拉稽核連線失敗。')));
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

  const drag = await evaluate(client, `(() => {
    window.SPLD_P4_LAB.openActivity('sentence');
    const root = document.querySelector('.spld-p4-lab');
    root.scrollTop = Math.max(0, (root.querySelector('.spld-p4-play-area')?.offsetTop || 0) - 70);
    const expected = '小明';
    const block = [...root.querySelectorAll('.spld-p4-block')].find((item) => item.textContent.trim() === expected);
    const slot = root.querySelector('[data-sentence-slot="0"]');
    const center = (element) => { const rect = element.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, top: rect.top, width: Math.round(rect.width), height: Math.round(rect.height) }; };
    const from = center(block); const to = center(slot);
    const pointer = (type, point) => block.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 41, pointerType: 'touch', clientX: point.x, clientY: point.y }));
    pointer('pointerdown', from);
    pointer('pointermove', { x: from.x + 5, y: from.y + 4 });
    const shortMove = { ready: block.classList.contains('touch-ready'), dragging: block.classList.contains('touch-dragging') };
    pointer('pointermove', to);
    const dragging = { block: block.classList.contains('touch-dragging'), slot: slot.classList.contains('touch-drag-over'), feedback: root.querySelector('#spldP4Feedback')?.textContent || '' };
    pointer('pointerup', to);
    const updatedRoot = document.querySelector('.spld-p4-lab');
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      scrollTop: Math.round(root.scrollTop),
      touchAction: block.style.touchAction || getComputedStyle(block).touchAction,
      from,
      to,
      shortMove,
      dragging,
      placed: updatedRoot?.querySelector('[data-sentence-slot="0"] strong')?.textContent || '',
      successFeedback: updatedRoot?.querySelector('#spldP4Feedback')?.textContent || '',
      blockAboveSlot: from.top < to.top,
      slotSizes: [...(updatedRoot?.querySelectorAll('[data-sentence-slot]') || [])].map((item) => { const rect = item.getBoundingClientRect(); return { width: Math.round(rect.width), height: Math.round(rect.height) }; })
    };
  })()`);

  const returnToBank = await evaluate(client, `(() => {
    window.SPLD_P4_LAB.openActivity('sentence');
    const root = document.querySelector('.spld-p4-lab');
    const block = root.querySelector('.spld-p4-block');
    const rect = block.getBoundingClientRect(); const point = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const pointer = (type, x, y) => block.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 42, pointerType: 'touch', clientX: x, clientY: y }));
    pointer('pointerdown', point.x, point.y);
    pointer('pointermove', point.x + 18, point.y + 18);
    pointer('pointerup', 8, 8);
    return { nonePlaced: [...root.querySelectorAll('[data-sentence-slot] strong')].every((item) => item.textContent === '？'), feedback: root.querySelector('#spldP4Feedback')?.textContent || '' };
  })()`);

  const tapAlternative = await evaluate(client, `(() => {
    window.SPLD_P4_LAB.openActivity('sentence');
    const root = document.querySelector('.spld-p4-lab');
    const block = [...root.querySelectorAll('.spld-p4-block')].find((item) => item.textContent.trim() === '小明');
    block?.click();
    const updatedRoot = document.querySelector('.spld-p4-lab');
    return { placed: updatedRoot?.querySelector('[data-sentence-slot="0"] strong')?.textContent || '', feedback: updatedRoot?.querySelector('#spldP4Feedback')?.textContent || '' };
  })()`);

  const failures = [];
  if (drag.overflow || drag.touchAction !== 'none' || !drag.blockAboveSlot) failures.push('375px：句型積木的手機拖拉佈局或手勢設定不完整。');
  if (!drag.shortMove.ready || drag.shortMove.dragging || !drag.dragging.block || !drag.dragging.slot || !drag.dragging.feedback.includes('已拿起')) failures.push('375px：短移動門檻或拖拉中的落點高亮／回饋不完整。');
  if (drag.placed !== '小明' || !drag.successFeedback.includes('放好了') || drag.slotSizes.some((rect) => rect.width < 44 || rect.height < 44)) failures.push('375px：拖放成功後的放置、回饋或觸控落點不完整。');
  if (!returnToBank.nonePlaced || !returnToBank.feedback.includes('放回積木區')) failures.push('375px：放開於非落點時未提供溫和退回回饋。');
  if (tapAlternative.placed !== '小明' || !tapAlternative.feedback.includes('放好了')) failures.push('375px：點選積木的低精細動作替代未正常運作。');

  const report = { standard: '375px P4 sentence touch drag threshold, highlight, drop, return and tap alternative audit', drag, returnToBank, tapAlternative, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ failureCount: failures.length, failures }, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
