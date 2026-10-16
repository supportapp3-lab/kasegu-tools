'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const {
  DEFAULTS,
  MAX_SURFACES,
  MAX_AREA_SQUARE_METERS,
  MAX_COATS,
  calculate,
  normalize,
  readQuery,
  writeQuery,
  formatResult
} = require('../assets/js/paint-quantity.js');

const input = overrides => ({
  areas: [10],
  coats: 2,
  coveragePerCan: 20,
  memo: '',
  ...overrides
});

test('10 square meters, two coats, and 20 square meters per can needs one can', () => {
  const result = calculate(input({}));
  assert.equal(result.totalArea, 10);
  assert.equal(result.requiredCoatArea, 20);
  assert.equal(result.canCount, 1);
});

test('fractional required area rounds up to the next can', () => {
  const result = calculate(input({ areas: [10.5] }));
  assert.equal(result.requiredCoatArea, 21);
  assert.equal(result.canCount, 2);
});

test('multiple surfaces add to the same result as one combined surface', () => {
  const combined = calculate(input({ areas: [10] }));
  const split = calculate(input({ areas: [4, 6] }));
  assert.equal(split.totalArea, combined.totalArea);
  assert.equal(split.requiredCoatArea, combined.requiredCoatArea);
  assert.equal(split.canCount, combined.canCount);
});

test('surface order does not change the result', () => {
  const first = calculate(input({ areas: [2.5, 4, 6.25] }));
  const second = calculate(input({ areas: [6.25, 2.5, 4] }));
  assert.equal(first.totalArea, second.totalArea);
  assert.equal(first.requiredCoatArea, second.requiredCoatArea);
  assert.equal(first.canCount, second.canCount);
});

test('coat count must be a positive integer within the stated limit', () => {
  for (const coats of [0, -1, 1.5, MAX_COATS + 1, NaN, Infinity, 'abc', '']) {
    assert.throws(() => calculate(input({ coats })));
  }
});

test('empty, zero, negative, non-numeric, and over-limit areas are rejected', () => {
  for (const area of ['', null, 0, -1, NaN, Infinity, 'abc', MAX_AREA_SQUARE_METERS + 1]) {
    assert.throws(() => calculate(input({ areas: [area] })));
  }
  assert.throws(() => calculate(input({ areas: Array(MAX_SURFACES + 1).fill(1) })));
  assert.throws(() => calculate(input({ areas: [] })));
});

test('coverage per can must be positive and within the stated limit', () => {
  for (const coveragePerCan of ['', null, 0, -1, NaN, Infinity, 'abc', 10001]) {
    assert.throws(() => calculate(input({ coveragePerCan })));
  }
});

test('numeric query state roundtrips multiple surfaces but never includes the memo', () => {
  const state = normalize(input({ areas: [4, 6], memo: 'manufacturer label' }));
  const query = writeQuery(state);
  assert.deepEqual(readQuery(query), {
    areas: [4, 6],
    coats: 2,
    coveragePerCan: 20,
    memo: ''
  });
  assert.doesNotMatch(query, /memo|manufacturer/);
  assert.equal(readQuery('?areas=%5B10%5D&coats=2&coverage=20&memo=private').memo, '');
  assert.deepEqual(readQuery(''), DEFAULTS);
  assert.deepEqual(readQuery('?areas=%5B%5D&coats=2&coverage=20'), DEFAULTS);
});

test('memo must be text within its limit and is not used in the formatted result', () => {
  assert.throws(() => normalize(input({ memo: 'x'.repeat(201) })));
  const text = formatResult(input({ areas: [10.5], memo: 'private note' }));
  assert.match(text, /手持ちの塗料で足りるなら購入は不要/);
  assert.doesNotMatch(text, /推奨|適合|おすすめ|売れ筋|private note/);
});

test('HTML keeps the warning before results, the affiliate area empty, and schema present', () => {
  const html = readFileSync(path.join(__dirname, '../tools/paint-quantity/index.html'), 'utf8');
  const warning = html.indexOf('id="calculation-warning"');
  const results = html.indexOf('id="result-summary"');
  assert.ok(warning >= 0 && warning < results);
  const affiliate = html.match(/<section class="affiliate" data-category="paint"[^>]*>([\s\S]*?)<\/section>/);
  assert.ok(affiliate);
  assert.doesNotMatch(affiliate[1], /<a\b|<img\b|価格/);
  assert.match(html, /"@type":"WebApplication"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
});

test('top page links to paint quantity after planter soil outside the disaster grid', () => {
  const home = readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const disasterStart = home.indexOf('id="tools-title"');
  const livingStart = home.indexOf('aria-labelledby="outing-title"');
  assert.ok(disasterStart >= 0 && livingStart > disasterStart);
  assert.equal(home.slice(disasterStart, livingStart).includes('tools/paint-quantity/'), false);
  const living = home.slice(livingStart);
  assert.ok(living.indexOf('tools/planter-soil/') < living.indexOf('tools/paint-quantity/'));
  assert.match(living, /09 \/ 塗装の量/);
  assert.match(living, /href="tools\/paint-quantity\/index\.html"/);
});
