'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/share.js'), 'utf8');
const canonical = 'https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/';

function setup(clipboard) {
  const status = { textContent: '' };
  const fallback = { hidden: true };
  let click;
  const button = {
    disabled: false, dataset: { shareUrl: canonical },
    closest: () => ({ querySelector: (selector) => selector === '[data-share-status]' ? status : fallback }),
    addEventListener: (name, handler) => { assert.equal(name, 'click'); click = handler; },
  };
  vm.runInNewContext(source, {
    document: { querySelectorAll: () => [button] },
    navigator: { clipboard },
    location: { href: canonical + '?adults=9#result' },
    fetch: () => { throw new Error('network must not be used'); },
  });
  return { button, status, fallback, click: () => click() };
}

test('share: copies static canonical only and announces success after completion', async () => {
  let copied;
  let resolve;
  const ui = setup({ writeText: (text) => { copied = text; return new Promise((done) => { resolve = done; }); } });
  const pending = ui.click();
  assert.equal(copied, canonical);
  assert.equal(ui.button.disabled, true);
  assert.equal(ui.status.textContent, '');
  resolve();
  await pending;
  assert.equal(ui.status.textContent, 'コピーしました');
  assert.equal(ui.button.disabled, false);
  assert.equal(ui.fallback.hidden, true);
});

test('share: missing Clipboard API shows manual-copy fallback', async () => {
  const ui = setup(undefined);
  await ui.click();
  assert.equal(ui.fallback.hidden, false);
  assert.match(ui.status.textContent, /下のURLをコピー/);
  assert.equal(ui.button.disabled, false);
});

test('share: denied clipboard never claims success, and a later retry can succeed', async () => {
  let denied = true;
  const ui = setup({ writeText: () => denied ? Promise.reject(new Error('denied')) : Promise.resolve() });
  await ui.click();
  assert.equal(ui.fallback.hidden, false);
  assert.doesNotMatch(ui.status.textContent, /コピーしました/);
  denied = false;
  await ui.click();
  assert.equal(ui.fallback.hidden, true);
  assert.equal(ui.status.textContent, 'コピーしました');
});
