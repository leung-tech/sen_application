import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9468;
const reportPath = '/home/ubuntu/sen_application/SYSTEM_INTERACTION_SCORE_RAW_20260824.json';
const baseUrl = 'file:///home/ubuntu/sen_application/index.html?systemInteractionAudit=20260824';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', [
  '--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files',
  `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-system-interaction-audit', 'about:blank',
], { stdio: 'ignore' });

async function targetUrl() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error('無法連接系統測試瀏覽器。');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const pending = new Map(); let id = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) {
        const requestId = ++id;
        socket.send(JSON.stringify({ id: requestId, method, params }));
        return new Promise((resolveCall, rejectCall) => {
          const timer = setTimeout(() => {
            pending.delete(requestId);
            rejectCall(new Error(`CDP 呼叫逾時：${method}`));
          }, 15_000);
          pending.set(requestId, {
            resolve(value) { clearTimeout(timer); resolveCall(value); },
            reject(error) { clearTimeout(timer); rejectCall(error); },
          });
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
    socket.addEventListener('error', () => reject(new Error('系統測試瀏覽器連線失敗。')));
  });
}

async function evaluate(client, expression) {
  const response = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || '頁面評估失敗。');
  return response.result.value;
}

const snapshotExpression = `(() => {
  const byId = (id) => document.getElementById(id);
  const number = (id) => Number((byId(id)?.textContent || '').replace(/\\D/g, '')) || 0;
  return {
    completed: number('lessonGames'), correct: number('lessonCorrect'),
    hints: number('lessonHints'), retries: number('lessonRetries'),
    earnedTokens: document.querySelectorAll('.token.earned').length,
    gameVisible: Boolean(byId('gameView') && !byId('gameView').classList.contains('hidden')),
    gameTitle: byId('stageTitle')?.textContent.trim() || '',
    feedback: byId('gameFeedback')?.textContent.trim() || ''
  };
})()`;

try {
  console.error('[system-test] connecting to browser');
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Runtime.enable');
  console.error('[system-test] navigating to local page');
  await client.call('Page.navigate', { url: baseUrl });
  await sleep(900);

  console.error('[system-test] checking page controls');
  const loaded = await evaluate(client, `(() => ({
    title: document.title,
    start: Boolean(document.getElementById('startSuggested')),
    lessonControls: ['lessonModeToggle','lessonAddHint','lessonAddRetry','lessonReset','addToken'].every((id) => Boolean(document.getElementById(id))),
    spldApi: Object.keys(window.SPLD_SHAPE_SOUND_MEANING_LAB || {}),
    spldFiveStarCount: window.SPLD_SHAPE_SOUND_MEANING_LAB?.rounds?.('lower', 5)?.length || 0
  }))()`);

  await evaluate(client, `(() => { window.confirm = () => true; return true; })()`);
  console.error('[system-test] checking manual lesson controls');
  await evaluate(client, `(() => {
    document.getElementById('lessonReset')?.click();
    return true;
  })()`);
  await sleep(30);
  await evaluate(client, `(() => {
    ['lessonModeToggle', 'lessonAddHint', 'lessonAddRetry', 'addToken'].forEach((id) => document.getElementById(id)?.click());
    return true;
  })()`);
  await sleep(80);
  const manualControls = await evaluate(client, snapshotExpression);

  console.error('[system-test] launching suggested game');
  await evaluate(client, `document.getElementById('startSuggested')?.click()`);
  await sleep(120);
  const afterLaunch = await evaluate(client, snapshotExpression);

  console.error('[system-test] completing suggested game');
  const attempts = [];
  for (let round = 0; round < 12; round += 1) {
    const interaction = await evaluate(client, `(() => {
      const buttons = [...document.querySelectorAll('#gameView button[data-answer]:not([disabled])')];
      for (const button of buttons) {
        button.click();
        if (button.classList.contains('correct')) return { found: true, answer: button.dataset.answer || button.textContent.trim() };
      }
      return { found: false, buttonCount: buttons.length };
    })()`);
    attempts.push(interaction);
    if (!interaction.found) break;
    await sleep(1050);
    const state = await evaluate(client, snapshotExpression);
    if (!state.gameVisible) break;
  }
  const afterRounds = await evaluate(client, snapshotExpression);

  console.error('[system-test] checking Escape and reset');
  await evaluate(client, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await sleep(100);
  const afterEscape = await evaluate(client, `({ ...${snapshotExpression}, focusReturned: document.activeElement === document.getElementById('startSuggested') })`);

  await evaluate(client, `document.getElementById('lessonReset')?.click()`);
  await sleep(60);
  const afterReset = await evaluate(client, snapshotExpression);

  await evaluate(client, `(() => {
    document.getElementById('lessonModeToggle')?.click();
    document.dispatchEvent(new CustomEvent('spld-shape-sound-meaning-complete', {
      detail: { activity: '自動化回歸題例', star: 5, correct: 4, retries: 2, hints: 3, total: 60 }
    }));
    return true;
  })()`);
  await sleep(80);
  const spldCompletionCallback = await evaluate(client, snapshotExpression);
  await evaluate(client, `document.getElementById('lessonReset')?.click()`);
  await sleep(60);
  const finalReset = await evaluate(client, snapshotExpression);

  const failures = [];
  if (!loaded.start || !loaded.lessonControls || !loaded.spldApi.includes('open') || loaded.spldFiveStarCount < 20) failures.push('首頁課堂控制或形音義五星級題庫入口不完整。');
  if (manualControls.hints !== 1 || manualControls.retries !== 1 || manualControls.earnedTokens !== 1 || manualControls.correct !== 0) failures.push('手動提示、重試或努力星控制未按預期更新。');
  if (!afterLaunch.gameVisible || !afterLaunch.gameTitle) failures.push('一般建議活動無法啟動。');
  if (!attempts.some((item) => item.found) || afterRounds.correct < 1) failures.push('一般遊戲未能找到正確選項或更新正確作答記錄。');
  if (afterRounds.completed < 1) failures.push('一般遊戲完成後未更新完成關卡記錄。');
  if (afterEscape.gameVisible || !afterEscape.focusReturned) failures.push('Escape 未能關閉一般遊戲或把焦點返回啟動按鈕。');
  if (afterReset.completed || afterReset.correct || afterReset.hints || afterReset.retries) failures.push('課堂摘要重設未清零。');
  if (spldCompletionCallback.completed !== 1 || spldCompletionCallback.correct !== 4 || spldCompletionCallback.retries !== 2 || spldCompletionCallback.hints !== 3) failures.push('形音義工房完成事件未正確匯入課堂摘要。');
  if (finalReset.completed || finalReset.correct || finalReset.hints || finalReset.retries) failures.push('形音義完成事件後的課堂摘要重設未清零。');

  const output = { standard: 'main-game scoring and completion regression', loaded, manualControls, afterLaunch, attempts, afterRounds, afterEscape, afterReset, spldCompletionCallback, finalReset, failureCount: failures.length, failures };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ failureCount: failures.length, failures, afterRounds, afterEscape, afterReset }, null, 2));
  client.close();
  if (failures.length) process.exitCode = 1;
} catch (error) {
  const output = { standard: 'main-game scoring and completion regression', status: 'execution-error', error: error.message || String(error) };
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  console.error(`[system-test] ${output.error}`);
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
}
