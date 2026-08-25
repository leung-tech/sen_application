(function () {
  'use strict';

  const STAGES = ['lower', 'upper', 'junior', 'senior'];
  const seen = new WeakSet();
  const balanceSeen = new WeakSet();

  function copyRound(round, number) {
    if (!round || typeof round !== 'object' || Array.isArray(round)) return round;
    const copied = { ...round };
    if (typeof copied.prompt === 'string' && !copied.prompt.startsWith('溫習小題')) copied.prompt = `溫習小題 ${number}：${copied.prompt}`;
    return copied;
  }

  function extendRounds(rounds) {
    if (!Array.isArray(rounds) || rounds.length === 0 || rounds.length >= 8) return;
    const base = rounds.slice();
    while (rounds.length < 8) rounds.push(copyRound(base[rounds.length % base.length], rounds.length + 1));
  }

  function normalise(value) {
    if (!value || typeof value !== 'object') return;
    if (seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) { value.forEach(normalise); return; }
    Object.entries(value).forEach(([key, child]) => {
      if (key === 'rounds') {
        if (Array.isArray(child)) extendRounds(child);
        else if (typeof child === 'number' && child > 0 && child < 8) value[key] = 8;
      } else if (['steps', 'total', 'questions'].includes(key) && typeof child === 'number' && child > 0 && child < 8) {
        value[key] = 8;
      } else normalise(child);
    });
  }

  function normaliseProvider(provider) {
    if (!provider || typeof provider.activityCards !== 'function') return;
    STAGES.forEach((stage) => {
      try { normalise(provider.activityCards(stage)); } catch (_) { /* Some providers expose only selected stages. */ }
    });
  }

  function choiceValue(choice) { return Array.isArray(choice) ? choice.at(-1) : choice; }

  function balanceRound(round, index) {
    const answer = round?.answer ?? round?.target;
    if (!round || !Array.isArray(round.choices) || round.choices.length < 2 || Array.isArray(answer) || !['string', 'number'].includes(typeof answer)) return;
    const current = round.choices.findIndex((choice) => String(choiceValue(choice)) === String(answer));
    if (current < 0) return;
    const target = index % round.choices.length;
    if (current === target) return;
    const choices = [...round.choices];
    const [correct] = choices.splice(current, 1);
    choices.splice(target, 0, correct);
    round.choices = choices;
  }

  function balanceAnswers(value) {
    if (!value || typeof value !== 'object' || balanceSeen.has(value)) return;
    balanceSeen.add(value);
    if (Array.isArray(value)) { value.forEach(balanceAnswers); return; }
    Object.entries(value).forEach(([key, child]) => {
      if (key === 'rounds' && Array.isArray(child)) child.forEach(balanceRound);
      else balanceAnswers(child);
    });
  }

  function balanceProvider(provider) {
    if (!provider || typeof provider.activityCards !== 'function') return;
    STAGES.forEach((stage) => { try { balanceAnswers(provider.activityCards(stage)); } catch (_) {} });
  }

  function normaliseAll() {
    Object.entries(window).forEach(([name, value]) => {
      if (name.endsWith('_STAGE_TASKS') || name === 'SEN_PATHWAY_MODULES') normalise(value);
      if (name.endsWith('_LAB') || name.endsWith('_GAMES_LAB')) normaliseProvider(value);
      if (name.endsWith('_STAGE_TASKS') || name === 'SEN_PATHWAY_MODULES') balanceAnswers(value);
      if (name.endsWith('_LAB') || name.endsWith('_GAMES_LAB')) balanceProvider(value);
    });
  }

  normaliseAll();
  window.SEN_EIGHT_ROUND_AUDIT = { normaliseAll, normalise, extendRounds, balanceAnswers, balanceRound };
})();
