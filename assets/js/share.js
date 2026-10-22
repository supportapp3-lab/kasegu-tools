(function () {
  'use strict';

  document.querySelectorAll('[data-share-copy]').forEach(function (button) {
    const block = button.closest('.page-share');
    const status = block.querySelector('[data-share-status]');
    const fallback = block.querySelector('[data-share-fallback]');
    button.addEventListener('click', async function () {
      button.disabled = true;
      status.textContent = '';
      fallback.hidden = true;
      try {
        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
          throw new Error('Clipboard unavailable');
        }
        await navigator.clipboard.writeText(button.dataset.shareUrl);
        status.textContent = 'コピーしました';
      } catch {
        status.textContent = '自動コピーを利用できません。下のURLをコピーしてください。';
        fallback.hidden = false;
      } finally {
        button.disabled = false;
      }
    });
  });
}());
