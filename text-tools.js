(() => {
  const form = document.querySelector('[data-tool]');
  if (!form) return;

  const input = form.querySelector('textarea');
  const status = form.querySelector('[role="status"]');
  const ranges = {
    bubble: [0x24B6, 0x24D0, '⓪①②③④⑤⑥⑦⑧⑨'],
    filled: [0x1F157, 0x1F157, '⓿❶❷❸❹❺❻❼❽❾'],
    script: [0x1D49C, 0x1D4B6],
    boldScript: [0x1D4D0, 0x1D4EA],
    bold: [0x1D5D4, 0x1D5EE],
    italic: [0x1D608, 0x1D622],
    wide: [0xFF21, 0xFF41, '０１２３４５６７８９']
  };
  const scriptExceptions = {
    B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
    e: 'ℯ', g: 'ℊ', o: 'ℴ'
  };

  function convert(text, style) {
    const [upper, lower, digits] = ranges[style];
    return text.replace(/[A-Za-z0-9]/g, letter => {
      if (style === 'script' && Object.hasOwn(scriptExceptions, letter)) return scriptExceptions[letter];
      const code = letter.charCodeAt(0);
      if (code >= 97) return String.fromCodePoint(lower + code - 97);
      if (code >= 65) return String.fromCodePoint(upper + code - 65);
      return digits ? digits[code - 48] : letter;
    });
  }

  const cards = Array.from(form.querySelectorAll('[data-style]'), card => {
    const preview = card.querySelector('.fv-preview');
    const button = card.querySelector('button');
    const label = card.querySelector('h2').textContent;
    const style = card.dataset.style;

    button.addEventListener('click', async () => {
      const text = preview.textContent;
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = `${label} copied.`;
      } catch {
        const selection = window.getSelection();
        if (selection && preview.textContent === text) {
          const range = document.createRange();
          range.selectNodeContents(preview);
          selection.removeAllRanges();
          selection.addRange(range);
          status.textContent = 'Automatic copy was unavailable. The text is selected; use your device’s copy command.';
        } else {
          status.textContent = 'Automatic copy was unavailable. Select and copy the preview manually.';
        }
      }
    });

    return { preview, button, style };
  });

  function render() {
    const hasText = Boolean(input.value.trim());
    for (const { preview, button, style } of cards) {
      preview.textContent = hasText ? convert(input.value, style) : 'Your preview will appear here.';
      button.disabled = !hasText;
    }
    status.textContent = '';
  }

  form.addEventListener('submit', event => event.preventDefault());
  input.addEventListener('input', render);
  for (const example of form.querySelectorAll('[data-example]')) {
    example.addEventListener('click', () => {
      input.value = example.dataset.example;
      render();
      input.focus();
    });
  }
  render();
})();