(() => {
  const root = document.documentElement;
  if (!root.hasAttribute('data-studio-theme')) return;

  const key = 'ffg_theme';
  const system = window.matchMedia('(prefers-color-scheme: light)');

  function applyTheme() {
    let saved;
    try {
      saved = window.localStorage.getItem(key);
    } catch {
      // Match the homepage's device-based default when storage is unavailable.
    }
    const theme = saved === 'light' || saved === 'dark'
      ? saved
      : system.matches ? 'light' : 'dark';
    root.dataset.studioTheme = theme;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#192b23' : '#edf2e9');
  }

  applyTheme();
  if (system.addEventListener) system.addEventListener('change', applyTheme);
  else if (system.addListener) system.addListener(applyTheme);
  window.addEventListener('pageshow', applyTheme);
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) applyTheme();
  });
})();