(() => {
  const header = document.querySelector('#ffg-root .fv-top');
  if (!header || header.hasAttribute('data-nav-ready')) return;

  const toggle = header.querySelector('.fv-nav-toggle');
  const nav = header.querySelector('#fv-nav-links');
  if (!toggle || !nav) return;

  const explore = nav.querySelector('.fv-nav-more');
  const summary = explore?.querySelector('summary');
  const mobile = window.matchMedia('(max-width: 64rem)');
  header.setAttribute('data-nav-ready', '');
  header.setAttribute('data-enhanced', '');

  function closeExplore() {
    if (explore) explore.open = false;
  }

  function setMenu(open, returnFocus = false) {
    header.toggleAttribute('data-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (!open) closeExplore();
    if (returnFocus) toggle.focus();
  }

  setMenu(false);

  toggle.addEventListener('click', () => {
    setMenu(!header.hasAttribute('data-menu-open'));
  });

  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) setMenu(false);
    else if (explore && !explore.contains(event.target)) closeExplore();
  });

  header.addEventListener('focusout', event => {
    if (!event.relatedTarget) return;
    if (!header.contains(event.relatedTarget)) setMenu(false);
    else if (explore && !explore.contains(event.relatedTarget)) closeExplore();
  });

  header.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (explore?.open) {
      closeExplore();
      summary?.focus();
    } else if (header.hasAttribute('data-menu-open')) {
      setMenu(false, true);
    } else {
      return;
    }
    event.preventDefault();
  });

  function resetAtBreakpoint() {
    const focused = document.activeElement;
    setMenu(false, mobile.matches && nav.contains(focused));
    if (!mobile.matches && focused === toggle) nav.querySelector('a')?.focus();
  }

  if (mobile.addEventListener) mobile.addEventListener('change', resetAtBreakpoint);
  else mobile.addListener(resetAtBreakpoint);

  nav.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute('href');
    const target = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
    setMenu(false, !target && mobile.matches);
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  function markCurrentSection() {
    for (const link of nav.querySelectorAll('a[href^="#"]')) {
      if (location.hash === link.hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  window.addEventListener('hashchange', markCurrentSection);
  markCurrentSection();
})();