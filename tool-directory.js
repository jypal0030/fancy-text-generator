(() => {
  const directory = document.querySelector('[data-tool-directory]');
  if (!directory) return;

  const tools = [
    ['bubble-text-generator/', 'Bubble Text Generator', 'Turn letters into outlined or filled circles.'],
    ['brackets-boxed-text-generator/', 'Brackets and Boxed Text Generator', 'Frame a phrase in brackets or turn letters into squares.'],
    ['cursive-text-generator/', 'Cursive Text Generator', 'Compare regular and bold Unicode script.'],
    ['instagram-bio-fonts/', 'Instagram Bio Fonts', 'Try readable styles on editable profile bio examples.'],
    ['case-converter/', 'Case Converter', 'Compare and copy uppercase, title case, snake case and more.'],
    ['cute-fancy-text/', 'Cute Fancy Text', 'Decorate captions and messages with hearts, stars, bows or soft script.'],
    ['kaomoji/', 'Kaomoji & Japanese Emoticons', 'Search and copy Japanese smileys, Lenny faces and other text reactions.'],
    ['type-studio/', 'Type Studio — Font Tester', 'Compare fonts side by side, export transparent text PNGs, or explore fancy letters A–Z.'],
    ['gothic-font-generator/', 'Gothic Font Generator', 'Compare regular and bold Fraktur blackletter.'],
    ['bold-font-generator/', 'Bold Font Generator', 'Copy bold serif, sans serif or italic text.']
  ];

  const current = new URL(directory.dataset.current || './', document.baseURI).href;
  const list = document.createElement('ul');

  for (const [path, name, description] of tools) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const summary = document.createElement('p');
    link.href = new URL(`../${path}`, document.baseURI).href;
    link.textContent = name;
    if (link.href === current) link.setAttribute('aria-current', 'page');
    summary.textContent = description;
    item.append(link, summary);
    list.append(item);
  }

  directory.append(list);
})();