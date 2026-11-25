(() => {
  const main = document.querySelector('[data-studio]');
  if (!main) return;

  const get = id => document.getElementById(id);
  const announce = (node, message) => {
    if (node.textContent !== message) node.textContent = message;
  };
  const numberError = (input, label) => {
    if (input.validity.valid) {
      input.removeAttribute('aria-invalid');
      return '';
    }

    input.setAttribute('aria-invalid', 'true');
    const format = input.step === '.5' ? 'in steps of 0.5' : 'as a whole number';
    return `Enter ${label} ${format} between ${input.min} and ${input.max} px.`;
  };

  if (main.dataset.studio === 'tester') {
    const input = get('sample');
    const size = get('size');
    const spacing = get('spacing');
    const status = get('tester-status');
    const render = () => {
      const sizeError = numberError(size, 'a size');
      const spacingError = numberError(spacing, 'letter spacing');
      if (!sizeError) main.style.setProperty('--size', `${size.valueAsNumber}px`);
      if (!spacingError) main.style.setProperty('--spacing', `${spacing.valueAsNumber}px`);
      main.style.setProperty('--weight', get('weight').value);
      const text = input.value.trim() ? input.value : '';
      for (const sample of main.querySelectorAll('.sample,.body-sample')) {
        sample.textContent = text || 'The quick brown fox jumps over the lazy dog.';
      }
      const messages = [sizeError, spacingError].filter(Boolean);
      if (messages.length) messages.push('The preview keeps the last valid value for each invalid setting.');
      if (!text) messages.push('Showing sample text. Type your own text to compare it.');
      announce(status, messages.join(' '));
    };
    main.addEventListener('input', render);
    render();
  }

  if (main.dataset.studio === 'png') {
    const canvas = get('art');
    const preview = get('image-preview');
    const status = get('status');
    const exportStatus = get('export-status');
    const download = get('download');
    const sizeInput = get('size');
    const paddingInput = get('padding');
    let ready = false;
    let exporting = false;
    let ctx;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      // Leave the export unavailable if the canvas cannot be initialized.
    }

    const syncDownload = () => {
      download.disabled = !ready || exporting;
      download.textContent = exporting ? 'Preparing PNG…' : 'Download PNG';
      if (exporting) download.setAttribute('aria-busy', 'true');
      else download.removeAttribute('aria-busy');
    };

    const render = () => {
      ready = false;
      syncDownload();
      preview.hidden = true;
      if (!exporting) announce(exportStatus, '');
      if (!ctx) {
        announce(status, 'This browser could not create a canvas preview. Try using another browser.');
        return;
      }
      const errors = [
        numberError(sizeInput, 'a size'),
        numberError(paddingInput, 'padding')
      ].filter(Boolean);
      const text = get('sample').value;
      if (!text.trim()) errors.push('Enter text to preview an image.');
      if (errors.length) {
        announce(status, errors.join(' '));
        return;
      }
      const lines = text.split('\n');
      const size = sizeInput.valueAsNumber;
      const pad = paddingInput.valueAsNumber;
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
        announce(status, 'Image is too large. Reduce the text size or padding, or shorten the text.');
        return;
      }
      try {
        canvas.width = width;
        canvas.height = height;
        ctx.font = font;
        ctx.fillStyle = get('colour').value;
        lines.forEach((line, index) => ctx.fillText(line, pad + left, pad + ascent + index * lineHeight));
      } catch {
        announce(status, 'Could not draw the image. Try a smaller size or fewer lines.');
        return;
      }
      preview.hidden = false;
      ready = typeof canvas.toBlob === 'function';
      syncDownload();
      announce(status, ready ? `${width} × ${height} px` : `${width} × ${height} px. PNG export is unavailable in this browser.`);
    };
    main.addEventListener('input', render);
    download.addEventListener('click', () => {
      if (!ready || exporting) return;
      exporting = true;
      syncDownload();
      announce(exportStatus, 'Preparing your PNG.');
      const finish = message => {
        exporting = false;
        syncDownload();
        announce(exportStatus, message);
      };

      try {
        canvas.toBlob(blob => {
          if (!blob || !blob.size || blob.type !== 'image/png') {
            finish('Could not create a PNG. Try a smaller image.');
            return;
          }

          let url;
          const link = document.createElement('a');
          try {
            url = URL.createObjectURL(blob);
            link.href = url;
            link.download = 'transparent-text.png';
            document.body.append(link);
            link.click();
            finish('PNG download requested. If it doesn’t appear, check your browser’s download controls.');
          } catch {
            finish('Could not start the download. Try again or use another browser.');
          } finally {
            link.remove();
            if (url) setTimeout(() => URL.revokeObjectURL(url), 30000);
          }
        }, 'image/png');
      } catch {
        finish('Could not create a PNG. Try again or use another browser.');
      }
    });
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
        status.textContent = '';
        try {
          await navigator.clipboard.writeText(text);
          status.textContent = `Copied ${text}.`;
        } catch {
          const selection = window.getSelection();
          if (selection && glyph.textContent === text) {
            const range = document.createRange();
            range.selectNodeContents(glyph);
            selection.removeAllRanges();
            selection.addRange(range);
            if (selection.toString() === text) {
              status.textContent = 'Automatic copy failed. The letter is selected; use your device’s copy command.';
              return;
            }
          }
          status.textContent = 'Automatic copy failed. Select the letter and copy it manually.';
        }
      });
      render();
    }
    letter.disabled = false;
  }
})();