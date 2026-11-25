(() => {
  const key = 'ffg_theme';
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  function applyTheme() {
    let saved;
    try {
      saved = window.localStorage.getItem(key);
    } catch {
      // Match the homepage's device-based default if storage is unavailable.
    }

    const theme = saved === 'light' || saved === 'dark'
      ? saved
      : prefersLight.matches ? 'light' : 'dark';

    document.documentElement.dataset.studioTheme = theme;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#192b23' : '#edf2e9');
  }

  applyTheme();
  if (prefersLight.addEventListener) {
    prefersLight.addEventListener('change', applyTheme);
  } else if (prefersLight.addListener) {
    prefersLight.addListener(applyTheme);
  }
  window.addEventListener('pageshow', applyTheme);
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) applyTheme();
  });
})();