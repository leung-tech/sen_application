(function () {
  'use strict';

  const STAGES = ['lower', 'upper', 'junior', 'senior'];
  const seen = new WeakSet();

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

  function normaliseAll() {
    Object.entries(window).forEach(([name, value]) => {
      if (name.endsWith('_STAGE_TASKS') || name === 'SEN_PATHWAY_MODULES') normalise(value);
      if (name.endsWith('_LAB') || name.endsWith('_GAMES_LAB')) normaliseProvider(value);
    });
  }

  normaliseAll();
  window.SEN_EIGHT_ROUND_AUDIT = { normaliseAll, normalise, extendRounds };
})();
