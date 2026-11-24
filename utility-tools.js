async function copyText(text, status) {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = `Copied${text.length < 24 ? `: ${text}` : ' to clipboard'}.`;
  } catch {
    status.textContent = 'Clipboard unavailable. Select the text and copy it manually.';
  }
}

const wordsOf = (text) => text
  .replace(/(\p{Ll}|\d)(\p{Lu})/gu, '$1 $2')
  .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
  .match(/[\p{L}\p{M}\p{N}]+/gu) || [];
const cap = (text) => text.replace(/^\p{L}/u, (letter) => letter.toUpperCase());

function convert(text, mode) {
  const lower = () => text.toLowerCase();
  const words = () => wordsOf(text).map((word) => word.toLowerCase());
  switch (mode) {
    case 'upper': return text.toUpperCase();
    case 'lower': return lower();
    case 'title': {
      const small = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'for', 'at', 'by']);
      const tokens = [...lower().matchAll(/\p{L}[\p{L}\p{M}'’]*/gu)];
      let index = 0;
      return lower().replace(/\p{L}[\p{L}\p{M}'’]*/gu, (word) => {
        const current = index++;
        return current === 0 || current === tokens.length - 1 || !small.has(word) ? cap(word) : word;
      });
    }
    case 'sentence': return lower().replace(/(^|[.!?]\s+|\n)([^\p{L}\n]*)(\p{L})/gu,
      (_, start, prefix, letter) => start + prefix + letter.toUpperCase());
    case 'toggle': return text.replace(/\p{L}/gu, (letter) =>
      letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase());
    case 'alternate': {
      let index = 0;
      return text.replace(/\p{L}/gu, (letter) => index++ % 2 ? letter.toUpperCase() : letter.toLowerCase());
    }
    case 'camel': return words().map((word, index) => index ? cap(word) : word).join('');
    case 'pascal': return words().map(cap).join('');
    case 'snake': return words().join('_');
    case 'constant': return words().join('_').toUpperCase();
    case 'kebab': return words().join('-');
    case 'header': return words().map(cap).join('-');
    case 'dot': return words().join('.');
    case 'slug': return lower().normalize('NFKD').replace(/\p{M}/gu, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    case 'trim': return text.split(/\r?\n/).map((line) => line.trim()).join('\n');
    case 'spaces': return text.replace(/[^\S\r\n]+/g, ' ');
    case 'quotes': return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
    case 'dashes': return text.replace(/[‐‑‒–—―−]/g, '-');
    case 'ascii': return text.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
    default: return text;
  }
}

function init() {
  const form = document.querySelector('#case-workbench');
  if (form) {
    const input = form.querySelector('#case-input');
    const mode = form.querySelector('#case-mode');
    const output = form.querySelector('#case-output');
    const status = form.querySelector('#case-status');
    const update = () => {
      output.value = convert(input.value, mode.value);
      status.textContent = '';
    };
    form.addEventListener('submit', (event) => event.preventDefault());
    input.addEventListener('input', update);
    mode.addEventListener('change', update);
    form.addEventListener('reset', () => setTimeout(update, 0));
    form.querySelector('#case-copy').addEventListener('click', () => {
      if (output.value) copyText(output.value, status);
      else status.textContent = 'There is no result to copy.';
    });
    update();
  }

  const faces = document.querySelector('#face-workbench');
  if (faces) {
    const search = faces.querySelector('#face-search');
    const status = faces.querySelector('#face-status');
    const sections = [...faces.querySelectorAll('[data-tags]')];
    search.addEventListener('input', () => {
      const terms = search.value.toLowerCase().trim().split(/\s+/);
      sections.forEach((section) => {
        const haystack = `${section.dataset.tags} ${section.textContent}`.toLowerCase();
        section.hidden = !terms.every((term) => haystack.includes(term));
      });
      faces.querySelector('#face-empty').hidden = sections.some((section) => !section.hidden);
      status.textContent = '';
    });
    faces.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) copyText(button.textContent.trim(), status);
    });
  }
}

document.addEventListener('DOMContentLoaded', init);