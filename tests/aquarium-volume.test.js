'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const {
  DEFAULTS,
  MAX_WIDTH_CM,
  MAX_DEPTH_CM,
  MAX_HEIGHT_CM,
  MAX_SUBSTRATE_CM,
  MAX_BAG_LITERS,
  calculate,
  normalize,
  readQuery,
  writeQuery,
  formatResult
} = require('../assets/js/aquarium-volume.js');

const input = overrides => ({
  widthCm: 60,
  depthCm: 30,
  heightCm: 36,
  substrateCm: null,
  bagLiters: null,
  memo: '',
  ...overrides
});

test('water and substrate volumes use the stated cubic-centimeter conversion', () => {
  assert.equal(calculate(input()).waterLiters, 64.8);
  assert.equal(calculate(input({ substrateCm: 5 })).substrateLiters, 9);
});

test('blank or zero substrate thickness omits substrate and bag results', () => {
  for (const substrateCm of ['', 0, null]) {
    const result = calculate(input({ substrateCm, bagLiters: 4 }));
    assert.equal(result.waterLiters, 64.8);
    assert.equal(result.substrateLiters, null);
    assert.equal(result.bagCount, null);
  }
});

test('bag count rounds up and keeps exact division boundaries', () => {
  assert.equal(calculate(input({ substrateCm: 5, bagLiters: 4 })).bagCount, 3);
  assert.equal(calculate(input({ substrateCm: 4, bagLiters: 4 })).bagCount, 1);
});

test('dimension permutations preserve volume', () => {
  const expected = calculate(input()).waterLiters;
  assert.equal(calculate(input({ widthCm: 30, depthCm: 36, heightCm: 60 })).waterLiters, expected);
  assert.equal(calculate(input({ widthCm: 36, depthCm: 60, heightCm: 30 })).waterLiters, expected);
});

test('dimensions reject empty, zero, negative, nonnumeric, and over-limit values', () => {
  for (const key of ['widthCm', 'depthCm', 'heightCm']) {
    for (const value of ['', null, 0, -1, NaN, Infinity, 'abc']) {
      assert.throws(() => calculate(input({ [key]: value })));
    }
  }
  assert.throws(() => calculate(input({ widthCm: MAX_WIDTH_CM + 0.1 })));
  assert.throws(() => calculate(input({ depthCm: MAX_DEPTH_CM + 0.1 })));
  assert.throws(() => calculate(input({ heightCm: MAX_HEIGHT_CM + 0.1 })));
  assert.throws(() => calculate(input({ substrateCm: -0.1 })));
  assert.throws(() => calculate(input({ substrateCm: MAX_SUBSTRATE_CM + 0.1 })));
  for (const value of [0, -1, NaN, Infinity, 'abc', MAX_BAG_LITERS + 0.1]) {
    assert.throws(() => calculate(input({ substrateCm: 5, bagLiters: value })));
  }
  assert.equal(calculate(input({ widthCm: 300, depthCm: 150, heightCm: 150 })).waterLiters, 6750);
});

test('query roundtrip keeps numeric options but never includes source memo', () => {
  const state = normalize(input({ substrateCm: 5, bagLiters: 4, memo: '測定位置のメモ' }));
  const query = writeQuery(state);
  assert.deepEqual(readQuery(query), { ...state, memo: '' });
  assert.doesNotMatch(query, /memo|測定位置/);
  assert.equal(readQuery('?width=60&depth=30&height=36&memo=private').memo, '');
  assert.deepEqual(readQuery(''), DEFAULTS);
  assert.deepEqual(readQuery('?width=0&depth=30&height=36'), DEFAULTS);
});

test('formatted results do not claim suitability or recommend a purchase', () => {
  const text = formatResult(input({ substrateCm: 5, bagLiters: 4, memo: 'private note' }));
  assert.match(text, /理論上の水容量：64\.8L/);
  assert.match(text, /理論上の底砂容量：9L/);
  assert.match(text, /最小袋数：3袋/);
  assert.match(text, /手持ちの底砂で足りるなら購入は不要/);
  assert.doesNotMatch(text, /推奨|適合|おすすめ|売れ筋|飼育に適|private note/);
  assert.doesNotMatch(formatResult(input()), /底砂容量|袋数/);
});

test('HTML places the calculation warning before results and keeps an empty aquarium affiliate slot', () => {
  const html = readFileSync(path.join(__dirname, '../tools/aquarium-volume/index.html'), 'utf8');
  const warning = html.indexOf('id="calculation-warning"');
  const results = html.indexOf('id="result-summary"');
  assert.ok(warning >= 0 && warning < results);
  const affiliate = html.match(/<section class="affiliate" data-category="aquarium"[^>]*>([\s\S]*?)<\/section>/);
  assert.ok(affiliate);
  assert.doesNotMatch(affiliate[1], /<a\b|<img\b|価格/);
  assert.match(html, /"@type":"WebApplication"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
});

test('top page links to aquarium volume in the living grid, outside the disaster grid', () => {
  const home = readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const disasterStart = home.indexOf('id="tools-title"');
  const livingStart = home.indexOf('aria-labelledby="outing-title"');
  assert.ok(disasterStart >= 0 && livingStart > disasterStart);
  assert.equal(home.slice(disasterStart, livingStart).includes('tools/aquarium-volume/'), false);
  const living = home.slice(livingStart);
  const aquarium = living.indexOf('tools/aquarium-volume/');
  const wallpaper = living.indexOf('tools/wallpaper-quantity/');
  assert.ok(aquarium > wallpaper);
  assert.match(living, /11 \/ 水槽の容量/);
});
