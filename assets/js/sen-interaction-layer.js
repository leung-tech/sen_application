(() => {
  if (window.SEN_INTERACTION_LAYER) return;
  window.SEN_INTERACTION_LAYER = true;

  const dropSelector = '[data-sen-drop-zone], [data-sli-slot], [data-sli-portal], [data-sentence-slot], .spld-part-slot, .sli-slot, .sli-portal, .drop-zone';
  const sourceSelector = '[draggable="true"], [data-sen-drag-source]';
  let activeSource = null;
  let activeTarget = null;
  let cleanTimer = 0;

  const closest = (element, selector) => element?.closest?.(selector) || null;
  const clearTarget = () => {
    if (activeTarget) activeTarget.classList.remove('sen-drop-ready');
    activeTarget = null;
  };
  const setTarget = (target) => {
    if (activeTarget === target) return;
    clearTarget();
    activeTarget = target;
    activeTarget?.classList.add('sen-drop-ready');
  };
  const flashSuccessSurface = (status) => {
    const text = status.textContent.trim();
    if (!/^(✓|答對|正確|完成|配對正確|放好了)/.test(text)) return;
    const surface = closest(status, '[role="dialog"], .activity-card, .game-card, .sli-lab, .id-lab, .asd-lab, .graded-lab, .focus-lab, .spld-p1-lab, .spld-p4-lab, .spld-s1-lab, .spld-s4-lab') || status.parentElement;
    if (!surface) return;
    surface.classList.remove('sen-success-flash');
    void surface.offsetWidth;
    surface.classList.add('sen-success-flash');
    window.setTimeout(() => surface.classList.remove('sen-success-flash'), 460);
  };

  document.addEventListener('dragstart', (event) => {
    const source = closest(event.target, sourceSelector);
    if (!source) return;
    activeSource = source;
    source.classList.add('sen-dragging');
    try { event.dataTransfer?.setData('text/plain', source.textContent.trim()); event.dataTransfer.effectAllowed = 'move'; } catch {}
  }, true);
  document.addEventListener('dragover', (event) => {
    const target = closest(event.target, dropSelector);
    if (!target || !activeSource) return;
    event.preventDefault();
    try { event.dataTransfer.dropEffect = 'move'; } catch {}
    setTarget(target);
  }, true);
  document.addEventListener('dragleave', (event) => {
    const target = closest(event.target, dropSelector);
    if (target && target === activeTarget && !target.contains(event.relatedTarget)) clearTarget();
  }, true);
  document.addEventListener('drop', (event) => {
    const target = closest(event.target, dropSelector);
    if (target && activeSource) {
      target.classList.add('sen-drop-placed');
      window.setTimeout(() => target.classList.remove('sen-drop-placed'), 300);
    }
    clearTarget();
  }, true);
  document.addEventListener('dragend', () => {
    activeSource?.classList.remove('sen-dragging');
    activeSource = null;
    clearTarget();
  }, true);

  const watchStatuses = (root = document) => root.querySelectorAll?.('[role="status"][aria-live]')?.forEach((status) => {
    if (status.dataset.senStatusWatched) return;
    status.dataset.senStatusWatched = 'true';
    new MutationObserver(() => flashSuccessSurface(status)).observe(status, { childList: true, characterData: true, subtree: true });
  });
  watchStatuses();
  new MutationObserver((records) => {
    window.clearTimeout(cleanTimer);
    cleanTimer = window.setTimeout(() => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === 1) watchStatuses(node);
    })), 0);
  }).observe(document.body, { childList: true, subtree: true });
})();
