(() => {
  const directory = document.querySelector('#text-tools ul');
  if (!directory) return;

  for (const [path, title, description] of [
    ['gothic-font-generator', 'Gothic Font Generator', 'Compare regular and bold Fraktur blackletter.'],
    ['bold-font-generator', 'Bold Font Generator', 'Copy bold serif, sans serif or italic text.'],
    ['type-studio', 'Type Studio — Font Tester', 'Compare fonts side by side, make transparent text PNGs, or explore fancy letters A–Z.']
  ]) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const summary = document.createElement('p');
    link.href = `./${path}/`;
    link.textContent = title;
    summary.textContent = description;
    item.append(link, summary);
    directory.append(item);
  }
})();