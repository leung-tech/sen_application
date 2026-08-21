(() => {
  const moduleName = document.documentElement.dataset.senModule;
  const stageLevel = document.documentElement.dataset.stageLevel;
  const params = new URLSearchParams(window.location.search);
  if (moduleName && !params.has('senType')) params.set('senType', moduleName);
  if (stageLevel && !params.has('stageLevel')) params.set('stageLevel', stageLevel);
  const destination = `../../index.html?${params.toString()}`;
  window.location.replace(destination);
})();
