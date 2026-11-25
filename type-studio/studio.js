(() => {
  const main = document.querySelector('[data-studio]');
  const get = id => document.getElementById(id);
  const value = (id, fallback) => {
    const input = get(id);
    return Number.isFinite(input.valueAsNumber)
      ? Math.max(Number(input.min), Math.min(Number(input.max), input.valueAsNumber))
      : fallback;
  };
  if (main.dataset.studio === 'tester') {
    const render = () => {
      main.style.setProperty('--size', `${value('size', 32)}px`);
      main.style.setProperty('--spacing', `${value('spacing', 0)}px`);
      main.style.setProperty('--weight', get('weight').value);
      for (const sample of main.querySelectorAll('.sample,.body-sample')) {
        sample.textContent = get('sample').value || 'The quick brown fox jumps over the lazy dog.';
      }
    };
    main.addEventListener('input', render);
    render();
  }

  if (main.dataset.studio === 'png') {
    const canvas = get('art');
    const ctx = canvas.getContext('2d');
    const status = get('status');
    const download = get('download');
    const render = () => {
      download.disabled = true;
      canvas.hidden = true;
      if (!ctx) {
        status.textContent = 'Image export is unavailable in this browser.';
        return;
      }
      const text = get('sample').value;
      if (!text.trim()) {
        status.textContent = 'Enter text to preview an image.';
        return;
      }
      const lines = text.split('\n');
      const size = value('size', 72);
      const pad = value('padding', 24);
      const font = `${size}px "${get('face').value}", sans-serif`;
      ctx.font = font;
      const metrics = lines.map(line => ctx.measureText(line));
      const left = Math.ceil(Math.max(0, ...metrics.map(m => m.actualBoundingBoxLeft || 0)));
      const right = Math.ceil(Math.max(1, ...metrics.map(m => Math.max(m.width, m.actualBoundingBoxRight || 0))));
      const ascent = Math.ceil(Math.max(size, ...metrics.map(m => m.actualBoundingBoxAscent || 0)));
      const descent = Math.ceil(Math.max(size * .3, ...metrics.map(m => m.actualBoundingBoxDescent || 0)));
      const lineHeight = ascent + descent;
      const width = left + right + pad * 2;
      const height = lineHeight * lines.length + pad * 2;
      if (width > 8192 || height > 8192 || width * height > 16000000) {
        status.textContent = 'Image is too large. Reduce the text size or shorten the text.';
        return;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.font = font;
      ctx.fillStyle = get('colour').value;
      lines.forEach((line, index) => ctx.fillText(line, pad + left, pad + ascent + index * lineHeight));
      canvas.hidden = false;
      download.disabled = false;
      status.textContent = `${width} × ${height} px`;
    };
    main.addEventListener('input', render);
    download.addEventListener('click', () => canvas.toBlob(blob => {
      if (!blob) {
        status.textContent = 'Could not export the image. Try a smaller size.';
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transparent-text.png';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }, 'image/png'));
    render();
  }

  if (main.dataset.studio === 'letters') {
    const letter = get('letter');
    const status = get('status');
    for (const card of main.querySelectorAll('[data-base]')) {
      const glyph = card.querySelector('.glyph');
      const button = card.querySelector('button');
      const render = () => {
        glyph.textContent = String.fromCodePoint(Number(card.dataset.base) + letter.value.charCodeAt(0) - 65);
        status.textContent = '';
      };
      letter.addEventListener('change', render);
      button.disabled = false;
      button.addEventListener('click', async () => {
        const text = glyph.textContent;
        try {
          await navigator.clipboard.writeText(text);
          status.textContent = `Copied ${text}.`;
        } catch {
          status.textContent = 'Automatic copy is unavailable. Select the character and copy it manually.';
        }
      });
      render();
    }
    letter.disabled = false;
  }
})();