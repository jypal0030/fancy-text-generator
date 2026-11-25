(() => {
  const header = document.querySelector('#ffg-root .fv-top');
  if (!header) return;

  const toggle = header.querySelector('.fv-nav-toggle');
  const nav = header.querySelector('#fv-nav-links');
  const explore = nav.querySelector('.fv-nav-more');
  const summary = explore.querySelector('summary');
  const mobile = window.matchMedia('(max-width: 53rem)');
  header.setAttribute('data-enhanced', '');

  function setMenu(open, returnFocus = false) {
    header.toggleAttribute('data-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (!open) explore.open = false;
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    setMenu(!header.hasAttribute('data-menu-open'));
  });

  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) setMenu(false);
    else if (!explore.contains(event.target)) explore.open = false;
  });

  header.addEventListener('focusout', event => {
    if (!event.relatedTarget) return;
    if (!header.contains(event.relatedTarget)) setMenu(false);
    else if (!explore.contains(event.relatedTarget)) explore.open = false;
  });

  header.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (explore.open) {
      explore.open = false;
      summary.focus();
    } else if (header.hasAttribute('data-menu-open')) {
      setMenu(false, true);
    } else {
      return;
    }
    event.preventDefault();
  });

  mobile.addEventListener('change', () => {
    const focused = document.activeElement;
    setMenu(false, mobile.matches && nav.contains(focused));
    if (!mobile.matches && focused === toggle) nav.querySelector('a').focus();
  });

  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute('href');
    const target = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    setMenu(false, !target && mobile.matches);
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