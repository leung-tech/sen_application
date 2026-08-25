import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const port = 9334;
const outputPath = '/home/ubuntu/sen_application/sen-content-audit.json';
const pageUrl = 'file:///home/ubuntu/sen_application/index.html?senAudit=content';
const chrome = spawn('chromium', ['--headless', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=/tmp/sen-content-audit-cdp', '--window-size=1280,720', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function targetUrl() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((item) => item.type === 'page');
      if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
    } catch {}
    await sleep(150);
  }
  throw new Error('無法連接題庫稽核瀏覽器。');
}

async function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); const pending = new Map(); let sequence = 0;
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { const id = ++sequence; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall })); },
      close() { socket.close(); }
    }));
    socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); const entry = pending.get(message.id); if (!entry) return; pending.delete(message.id); message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result); });
    socket.addEventListener('error', () => reject(new Error('題庫稽核瀏覽器連線失敗。')));
  });
}

try {
  const client = await connect(await targetUrl());
  await client.call('Page.enable');
  await client.call('Page.navigate', { url: pageUrl });
  await sleep(1800);
  const response = await client.call('Runtime.evaluate', { expression: `(() => {
    const sets = []; const coverage = []; const STAGES = ['lower', 'upper', 'junior', 'senior'];
    const add = (name, rounds) => { if (Array.isArray(rounds) && rounds.length) sets.push({ name, rounds }); };
    const addStages = (name, source) => Object.entries(source || {}).forEach(([stage, value]) => add(name + ' · ' + stage, value?.rounds));
    const tagList = (cards) => [...new Set((cards || []).flatMap((card) => [card.tag, card.categoryName, card.focus].filter(Boolean).map((tag) => String(tag))))];
    const addCoverage = (area, stage, cards, source, sharedAcrossStages = false) => {
      const activities = (cards || []).filter((card) => Array.isArray(card?.rounds) && card.rounds.length);
      if (!activities.length) return;
      coverage.push({ area, stage, activities: activities.length, rounds: activities.reduce((sum, card) => sum + card.rounds.length, 0), tags: tagList(activities), source, sharedAcrossStages });
    };
    const addCardStages = (area, provider, source) => STAGES.forEach((stage) => { try { addCoverage(area, stage, provider?.activityCards?.(stage) || [], source); } catch {} });
    addStages('SpLD 基礎訓練', window.SPLD_STAGE_TASKS);
    addStages('ID', window.idStageTraining);
    addStages('ASD', window.ASD_STAGE_TASKS);
    addStages('ADHD', window.ADHD_STAGE_TASKS);
    addStages('EBD', window.EBD_STAGE_TASKS);
    addStages('Giftedness／HI', window.GIFTED_HI_STAGE_TASKS);
    ['SLI', 'MI'].forEach((name) => { const source = window.SEN_PATHWAY_MODULES?.[name]; add(name + ' · 直接選關', source?.card?.rounds); addStages(name, source?.stages); });
    [['SpLD 初小實驗室', window.SPLD_P1_LAB], ['SpLD 高小實驗室', window.SPLD_P4_LAB], ['SpLD 初中實驗室', window.SPLD_S1_LAB], ['SpLD 高中實驗室', window.SPLD_S4_LAB], ['ADHD 專注實驗室', window.ADHD_FOCUS_LAB]].forEach(([name, lab]) => { try { (lab?.activityCards?.() || []).forEach((card) => add(name + ' · ' + card.title, card.rounds)); } catch {} });
    const general = window.SEN_CONTENT_AUDIT_SOURCE;
    STAGES.forEach((stage) => {
      const grouped = (general?.stages?.[stage] || []).reduce((result, card) => { (result[card.categoryName || card.category || '一般活動'] ||= []).push(card); return result; }, {});
      Object.entries(grouped).forEach(([area, cards]) => addCoverage(area, stage, cards, 'sen-app general stage data'));
    });
    addCardStages('MI 情緒與求助', window.MI_FIFTEEN_CATALOGUE_LAB, 'MI fifteen catalogue');
    addCardStages('SLI 理解與表達', window.SLI_FIFTEEN_CATALOGUE_LAB, 'SLI fifteen catalogue');
    addCardStages('SLI 核心語言支架', window.SLI_CORE_LAB, 'SLI core lab');
    addCardStages('SLI 八項語言遊戲', window.SLI_EIGHT_GAMES_LAB, 'SLI eight games');
    addCardStages('Giftedness 八項探究', window.GIFTED_EIGHT_GAMES_LAB, 'Gifted eight games');
    addCardStages('Giftedness 2e 調適', window.GIFTED_2E_LAB, 'Gifted 2e lab');
    addCardStages('Giftedness 依附與關係', window.GIFTED_ATTACHMENT_ARCADE, 'Gifted attachment lab');
    addCardStages('Giftedness 跨 SEN 探究', window.GIFTED_CROSS_SEN_LAB, 'Gifted cross-SEN lab');
    addCardStages('HI 視覺化溝通', window.HI_EIGHT_GAMES_LAB, 'HI eight games');
    addCardStages('VI 無障礙學習', window.VI_GAMES_LAB, 'VI games');
    addCardStages('PD 無障礙學習', window.PD_GAMES_LAB, 'PD games');
    addCardStages('生涯規劃', window.CAREER_GAMES_LAB, 'Career games');
    ['emotion', 'cognition'].forEach((track) => STAGES.forEach((stage) => addCoverage(track === 'emotion' ? '情緒社交策略' : '認知學習策略', stage, (window.CROSS_CATEGORY_STRATEGY_LAB?.cards?.(track) || []).map((card) => ({ ...card, rounds: [card], tag: track === 'emotion' ? '跨類別 SEL 策略' : '跨類別學習策略' })), 'cross-category shared strategy cards', true)));
    const normalizeChoice = (choice) => Array.isArray(choice) ? String(choice.at(-1) ?? '') : String(choice ?? '');
    const report = sets.map(({ name, rounds }) => {
      const issues = []; const seen = new Map();
      rounds.forEach((round, index) => {
        const label = round.id || round.band || '第 ' + (index + 1) + ' 關';
        const isLab = name.includes('實驗室');
        const pairWords = Array.isArray(round.pairs) ? round.pairs.flat().map(normalizeChoice) : [];
        const prompt = String(round.prompt || round.question || round.sentence || [round.before, round.after].filter(Boolean).join('＿＿') || round.riddle || round.passage || (Array.isArray(round.order) ? round.order.join(' ') : '') || [round.relation, pairWords.join('、')].filter(Boolean).join('：') || [round.subject, round.verb, round.object].filter(Boolean).join(' ') || [round.verb, round.target].filter(Boolean).join(' ') || '').trim();
        const context = String(round.context || round.meaning || round.category || round.guide || '').trim();
        const hint = String(round.clue || round.hint || '').trim();
        const instruction = String(round.instruction || '').trim();
        const choices = Array.isArray(round.choices) ? round.choices.map(normalizeChoice) : (Array.isArray(round.parts) ? round.parts.map(normalizeChoice) : (Array.isArray(round.steps) ? round.steps.map(normalizeChoice) : (Array.isArray(round.order) ? round.order.map(normalizeChoice) : pairWords)));
        const rawAnswer = Array.isArray(round.answer) ? round.answer.map(normalizeChoice) : (Array.isArray(round.steps) ? round.steps.map(normalizeChoice) : (Array.isArray(round.order) ? round.order.map(normalizeChoice) : (pairWords.length ? pairWords : [String(round.answer || round.target || [round.subject, round.verb, round.object].filter(Boolean).join(' ') || '').trim()].filter(Boolean))));
        if (!prompt) issues.push(label + '：缺少題幹或互動指令');
        if (!hint) issues.push(label + '：缺少提示');
        if (!isLab && !context) issues.push(label + '：缺少語境');
        if (!isLab && !instruction) issues.push(label + '：缺少作答指示');
        const orderedSteps = Array.isArray(round.steps);
        if (choices.length && !orderedSteps && new Set(choices).size !== choices.length) issues.push(label + '：選項重覆');
        if (!isLab && choices.length < 2) issues.push(label + '：選項少於兩個');
        if (!rawAnswer.length) issues.push(label + '：缺少答案或目標');
        if (choices.length && rawAnswer.some((answer) => !choices.includes(answer))) issues.push(label + '：答案未對應可選項');
        const duplicateKey = prompt + '｜' + context;
        if (prompt) { if (seen.has(duplicateKey)) issues.push(label + '：題幹與「' + seen.get(duplicateKey) + '」重覆'); else seen.set(duplicateKey, label); }
      });
      return { name, rounds: rounds.length, issues };
    });
    const coverageSummary = coverage.reduce((summary, entry) => {
      const key = entry.area + ' · ' + entry.stage;
      summary[key] = { activities: entry.activities, rounds: entry.rounds, tags: entry.tags, source: entry.source, sharedAcrossStages: entry.sharedAcrossStages };
      return summary;
    }, {});
    return { setCount: report.length, roundCount: report.reduce((sum, set) => sum + set.rounds, 0), issueCount: report.reduce((sum, set) => sum + set.issues.length, 0), sets: report, coverageMatrix: coverage, coverageSummary };
  })()`, returnByValue: true });
  await writeFile(outputPath, JSON.stringify(response.result.value, null, 2));
  console.log(JSON.stringify(response.result.value, null, 2));
  client.close();
} finally {
  chrome.kill('SIGTERM');
}
