(() => {
  const studioHref = './type-studio/';
  const hero = document.querySelector('#ffg-root .ffg-hero');
  if (hero && !hero.querySelector('.ffg-studio-feature')) {
    const feature = document.createElement('a');
    feature.className = 'ffg-studio-feature';
    feature.href = studioHref;

    const makeSpan = (className, text) => {
      const span = document.createElement('span');
      span.className = className;
      span.textContent = text;
      return span;
    };

    const specimen = makeSpan('ffg-studio-specimen', 'Aa');
    specimen.setAttribute('aria-hidden', 'true');
    const copy = makeSpan('ffg-studio-copy', '');
    const heading = makeSpan('ffg-studio-heading', '');
    heading.append(
      makeSpan('ffg-studio-badge', 'New'),
      makeSpan('ffg-studio-title', 'Type Studio'),
    );
    copy.append(heading, makeSpan('ffg-studio-detail', 'Compare fonts, export text as PNG, or explore fancy letters.'));
    const cta = makeSpan('ffg-studio-cta', 'Open Font Tester');
    const arrow = makeSpan('ffg-studio-arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    cta.append(' ', arrow);
    feature.append(specimen, copy, cta);
    hero.append(feature);
  }

  const directory = document.querySelector('#text-tools ul');
  if (!directory) return;

  const destinations = new Set(Array.from(directory.querySelectorAll('a[href]'), link => link.href));
  for (const [path, title, description] of [
    ['gothic-font-generator', 'Gothic Font Generator', 'Compare regular and bold Fraktur blackletter.'],
    ['bold-font-generator', 'Bold Font Generator', 'Copy bold serif, sans serif or italic text.'],
    ['type-studio', 'Type Studio — Font Tester', 'Compare fonts side by side, make transparent text PNGs, or explore fancy letters A–Z.']
  ]) {
    const link = document.createElement('a');
    link.href = path === 'type-studio' ? studioHref : `./${path}/`;
    if (destinations.has(link.href)) continue;

    const item = document.createElement('li');
    const summary = document.createElement('p');
    link.textContent = title;
    summary.textContent = description;
    item.append(link, summary);
    directory.append(item);
  }
})();