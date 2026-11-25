function initSearch() {
  const workbench = document.getElementById('face-workbench');
  const input = document.getElementById('face-search');
  const empty = document.getElementById('face-empty');
  if (!workbench || !input || !empty) return;

  const normalize = value => value.normalize('NFC').toLowerCase().trim();
  const individualTags = new Map([
    ['(=^･ω･^=)', 'cat kitten'],
    ['U･ᴥ･U', 'dog puppy'],
    ['ʕ•ᴥ•ʔ', 'bear'],
    ['ᕕ( ᐛ )ᕗ', 'run running'],
    ['(⊃‿⊂)', 'hide hiding'],
    ['(・∀・)ゞ', 'salute roger that'],
    ['¯\\_(ツ)_/¯', 'shrug confused']
  ]);
  const groups = Array.from(workbench.querySelectorAll('section[data-tags]'), section => ({
    section,
    buttons: Array.from(section.querySelectorAll('button'), button => {
      const face = normalize(button.textContent);
      const specific = individualTags.get(face);
      const shared = section.dataset.tags;
      const category = shared.startsWith('animals') ? 'animal animals cute' : 'action actions reaction reactions';
      return { button, face, tags: normalize(specific ? `${category} ${specific}` : shared) };
    })
  }));

  function filter() {
    const query = normalize(input.value);
    const terms = query.split(/\s+/);
    let total = 0;
    for (const { section, buttons } of groups) {
      let count = 0;
      for (const { button, face, tags } of buttons) {
        const matches = !query || face.includes(query) || terms.every(term => tags.includes(term));
        button.hidden = !matches;
        if (matches) count++;
      }
      section.hidden = count === 0;
      total += count;
    }
    empty.hidden = total !== 0;
  }

  input.addEventListener('input', () => queueMicrotask(filter));
  filter();
}

document.addEventListener('DOMContentLoaded', initSearch);