'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const {
  DEFAULTS,
  MAX_WALL_WIDTH_CM,
  MAX_WALL_HEIGHT_CM,
  MAX_REPEAT_CM,
  MAX_ALLOWANCE_CM,
  MAX_ROLL_LENGTH_M,
  calculate,
  normalize,
  readQuery,
  writeQuery,
  formatResult
} = require('../assets/js/wallpaper-quantity.js');

const input = overrides => ({
  wallWidthCm: 360,
  wallHeightCm: 240,
  usableWidthCm: 92,
  repeatCm: 0,
  allowanceCm: 0,
  rollLengthM: null,
  memo: '',
  ...overrides
});

test('strip count rounds up and preserves exact-width boundaries', () => {
  assert.equal(calculate(input({ wallWidthCm: 368 })).stripCount, 4);
  assert.equal(calculate(input({ wallWidthCm: 369 })).stripCount, 5);
});

test('plain wallpaper length and total meters use the stated dimensions', () => {
  const result = calculate(input());
  assert.equal(result.cutLengthCm, 240);
  assert.equal(result.stripCount, 4);
  assert.equal(result.totalLengthM, 9.6);
  assert.equal(result.totalLengthMDisplay, 9.6);
});

test('repeat rounds each cut up to a whole repeat using integer tenth-centimeter units', () => {
  assert.equal(calculate(input({ wallWidthCm: 92, repeatCm: 32.1 })).cutLengthCm, 256.8);
  assert.equal(calculate(input({ wallWidthCm: 92, repeatCm: 30 })).cutLengthCm, 240);
});

test('user-supplied allowance is added without an automatic trim allowance', () => {
  assert.equal(calculate(input({ wallWidthCm: 92, allowanceCm: 10 })).cutLengthCm, 250);
  assert.equal(calculate(input({ wallWidthCm: 92 })).cutLengthCm, 240);
});

test('roll length computes strips per roll and the ceiling roll count', () => {
  const fourPerRoll = calculate(input({ rollLengthM: 10 }));
  assert.equal(fourPerRoll.stripsPerRoll, 4);
  assert.equal(fourPerRoll.rollCount, 1);
  const fiveStrips = calculate(input({ wallWidthCm: 369, rollLengthM: 10 }));
  assert.equal(fiveStrips.stripsPerRoll, 4);
  assert.equal(fiveStrips.rollCount, 2);
});

test('roll length shorter than one cut does not produce a roll count', () => {
  const result = calculate(input({ wallHeightCm: 240, rollLengthM: 2 }));
  assert.equal(result.rollTooShort, true);
  assert.equal(result.stripsPerRoll, 0);
  assert.equal(result.rollCount, null);
});

test('width, height, and usable width reject empty, zero, negative, nonnumeric, and over-limit values', () => {
  for (const value of ['', null, 0, -1, NaN, Infinity, 'abc']) {
    assert.throws(() => calculate(input({ wallWidthCm: value })));
    assert.throws(() => calculate(input({ wallHeightCm: value })));
    assert.throws(() => calculate(input({ usableWidthCm: value })));
  }
  assert.throws(() => calculate(input({ wallWidthCm: MAX_WALL_WIDTH_CM + 0.1 })));
  assert.throws(() => calculate(input({ wallHeightCm: MAX_WALL_HEIGHT_CM + 0.1 })));
  assert.throws(() => calculate(input({ usableWidthCm: 29.9 })));
  assert.throws(() => calculate(input({ usableWidthCm: 200.1 })));
  assert.equal(calculate(input({ usableWidthCm: 30 })).stripCount, 12);
  assert.equal(calculate(input({ usableWidthCm: 200 })).stripCount, 2);
});

test('repeat, allowance, and roll length reject negative, over-limit, or invalid precision values', () => {
  for (const value of [-0.1, MAX_REPEAT_CM + 0.1, 'abc', Infinity, 30.01]) {
    assert.throws(() => calculate(input({ repeatCm: value })));
  }
  for (const value of [-0.1, MAX_ALLOWANCE_CM + 0.1, 'abc', Infinity, 1.01]) {
    assert.throws(() => calculate(input({ allowanceCm: value })));
  }
  for (const value of ['', 0, -1, NaN, Infinity, 'abc', MAX_ROLL_LENGTH_M + 0.1, 1.0001]) {
    assert.throws(() => calculate(input({ rollLengthM: value })));
  }
  assert.equal(calculate(input({ rollLengthM: null })).rollCount, null);
});

test('query state roundtrips optional values but never includes or restores source memo', () => {
  const state = normalize(input({ repeatCm: 32.1, allowanceCm: 5.5, rollLengthM: 10.125, memo: 'catalog note' }));
  const query = writeQuery(state);
  assert.deepEqual(readQuery(query), { ...state, memo: '' });
  assert.doesNotMatch(query, /memo|catalog/);
  assert.equal(readQuery('?width=360&height=240&usable=92&memo=private').memo, '');
  assert.deepEqual(readQuery(''), DEFAULTS);
  assert.deepEqual(readQuery('?width=0&height=240&usable=92'), DEFAULTS);
});

test('formatted results avoid suitability or purchase recommendations', () => {
  const text = formatResult(input({ wallWidthCm: 369, rollLengthM: 10, memo: 'private note' }));
  assert.match(text, /切り出し枚数：5枚/);
  assert.match(text, /ロール本数：2本/);
  assert.match(text, /手持ちの壁紙で足りるなら購入は不要/);
  assert.doesNotMatch(text, /推奨|適合|おすすめ|売れ筋|private note/);
});

test('HTML keeps caution before results, affiliate placeholder empty, and required schema', () => {
  const html = readFileSync(path.join(__dirname, '../tools/wallpaper-quantity/index.html'), 'utf8');
  const warning = html.indexOf('id="calculation-warning"');
  const results = html.indexOf('id="result-summary"');
  assert.ok(warning >= 0 && warning < results);
  const affiliate = html.match(/<section class="affiliate" data-category="wallpaper"[^>]*>([\s\S]*?)<\/section>/);
  assert.ok(affiliate);
  assert.doesNotMatch(affiliate[1], /<a\b|<img\b|価格/);
  assert.match(html, /"@type":"WebApplication"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
});

test('top page links to wallpaper after paint inside the living grid, outside the disaster grid', () => {
  const home = readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const disasterStart = home.indexOf('id="tools-title"');
  const livingStart = home.indexOf('aria-labelledby="outing-title"');
  assert.ok(disasterStart >= 0 && livingStart > disasterStart);
  assert.equal(home.slice(disasterStart, livingStart).includes('tools/wallpaper-quantity/'), false);
  const living = home.slice(livingStart);
  assert.ok(living.indexOf('tools/paint-quantity/') < living.indexOf('tools/wallpaper-quantity/'));
  assert.match(living, /10 \/ 壁紙の量/);
  assert.match(living, /href="tools\/wallpaper-quantity\/index\.html"/);
});
