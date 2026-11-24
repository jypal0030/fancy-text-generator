async function copyText(text, status, source, label) {
  status.textContent = '';
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = label ? `${label} copied.` : `Copied${text.length < 24 ? `: ${text}` : ' to clipboard'}.`;
    return true;
  } catch {
    if (source && source.value === text) {
      source.focus();
      source.select();
      status.textContent = 'Automatic copy was unavailable. The result is selected; use your device’s copy command.';
    } else if (source && source.textContent === text && window.getSelection()) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(source);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Automatic copy was unavailable. The result is selected; use your device’s copy command.';
    } else {
      status.textContent = 'Clipboard unavailable. Select the text and copy it manually.';
    }
    return false;
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
    const extraCopy = form.querySelector('#case-copy');
    const previews = Array.from(form.querySelectorAll('[data-case-style]'), (card) => {
      const preview = card.querySelector('.fv-preview');
      const button = card.querySelector('button');
      const label = card.querySelector('h3').textContent;
      const example = preview.textContent;
      button.addEventListener('click', () => copyText(preview.textContent, status, preview, label));
      return { preview, button, example, style: card.dataset.caseStyle };
    });
    const updateExtra = () => {
      output.value = convert(input.value, mode.value);
      extraCopy.disabled = !output.value;
      status.textContent = '';
    };
    const update = () => {
      for (const { preview, button, example, style } of previews) {
        const result = convert(input.value, style);
        preview.textContent = input.value ? result || 'No convertible characters.' : example;
        button.disabled = !result;
      }
      updateExtra();
    };
    form.addEventListener('submit', (event) => event.preventDefault());
    input.addEventListener('input', update);
    mode.addEventListener('change', updateExtra);
    form.addEventListener('reset', (event) => {
      event.preventDefault();
      input.value = '';
      update();
      input.focus();
    });
    extraCopy.addEventListener('click', () => copyText(output.value, status, output, 'Converted text'));
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