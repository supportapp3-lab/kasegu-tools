'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const {
  DEFAULTS,
  MAX_DIMENSION_CM,
  calculate,
  normalize,
  readQuery,
  writeQuery,
  formatResult
} = require('../assets/js/planter-soil.js');

const dimensions = overrides => ({
  mode: 'dimensions',
  lengthCm: 10,
  widthCm: 10,
  depthCm: 10,
  containerLiters: null,
  bagLiters: 2,
  ...overrides
});

test('10 × 10 × 10 cm is one liter', () => {
  assert.equal(calculate(dimensions()).volumeLiters, 1);
});

test('bag count rounds up and keeps exact boundaries', () => {
  assert.equal(calculate(dimensions({ bagLiters: 2 })).bagCount, 1);
  assert.equal(calculate(dimensions({ lengthCm: 20, bagLiters: 2 })).bagCount, 1);
  assert.equal(calculate(dimensions({ lengthCm: 40, bagLiters: 2 })).bagCount, 2);
  assert.equal(calculate(dimensions({ lengthCm: 41, bagLiters: 2 })).bagCount, 3);
});

test('labeled capacity uses only the container label, not dimensions', () => {
  const result = calculate({
    mode: 'labeled',
    lengthCm: 900,
    widthCm: 800,
    depthCm: 700,
    containerLiters: 5.5,
    bagLiters: 2
  });
  assert.equal(result.volumeLiters, 5.5);
  assert.equal(result.bagCount, 3);
  assert.equal(result.lengthCm, null);
  assert.equal(result.widthCm, null);
  assert.equal(result.depthCm, null);
});

test('mode switching recalculates from the selected input method', () => {
  const measured = calculate(dimensions({ lengthCm: 20 }));
  const labeled = calculate({
    mode: 'labeled',
    containerLiters: 7,
    bagLiters: 2
  });
  assert.equal(measured.volumeLiters, 2);
  assert.equal(labeled.volumeLiters, 7);
  assert.equal(labeled.bagCount, 4);
});

test('empty, zero, negative, non-numeric, and over-limit inputs are rejected', () => {
  for (const value of ['', null, 0, -1, NaN, Infinity, 'abc']) {
    assert.throws(() => calculate(dimensions({ lengthCm: value })));
    assert.throws(() => calculate(dimensions({ bagLiters: value })));
    assert.throws(() => calculate({
      mode: 'labeled',
      containerLiters: value,
      bagLiters: 2
    }));
  }
  assert.throws(() => calculate(dimensions({ widthCm: MAX_DIMENSION_CM + 1 })));
  assert.throws(() => calculate({
    mode: 'labeled',
    containerLiters: 1,
    bagLiters: 1000001
  }));
});

test('permuting length, width, and depth leaves volume unchanged', () => {
  const first = calculate(dimensions({ lengthCm: 12, widthCm: 25, depthCm: 8 }));
  const second = calculate(dimensions({ lengthCm: 8, widthCm: 12, depthCm: 25 }));
  assert.equal(first.volumeLiters, second.volumeLiters);
});

test('dimension and labeled query state roundtrips without changing the selected method', () => {
  const measured = normalize(dimensions({ lengthCm: 25.5, bagLiters: 3 }));
  assert.deepEqual(readQuery(writeQuery(measured)), measured);
  const labeled = normalize({
    mode: 'labeled',
    containerLiters: 12.5,
    bagLiters: 4
  });
  assert.deepEqual(readQuery(writeQuery(labeled)), labeled);
  assert.deepEqual(readQuery(''), DEFAULTS);
  assert.deepEqual(readQuery('?mode=invalid&bag=1'), DEFAULTS);
});

test('formatted result avoids recommendation or suitability claims', () => {
  const text = formatResult(dimensions());
  assert.match(text, /幾何上の容量：1L/);
  assert.match(text, /不足がなければ購入は不要です/);
  for (const forbidden of ['推奨', '適性', '売れ筋', 'この土を買え']) {
    assert.ok(!text.includes(forbidden), 'unexpected result wording: ' + forbidden);
  }
});

test('HTML keeps the warning before results and the affiliate area empty', () => {
  const html = readFileSync(path.join(__dirname, '../tools/planter-soil/index.html'), 'utf8');
  const warning = html.indexOf('id="calculation-warning"');
  const results = html.indexOf('id="result-summary"');
  assert.ok(warning >= 0 && warning < results);
  const affiliate = html.match(/<section class="affiliate" data-category="potting-soil"[^>]*>([\s\S]*?)<\/section>/);
  assert.ok(affiliate);
  assert.doesNotMatch(affiliate[1], /<a\b|<img\b|価格/);
  assert.match(html, /"@type":"WebApplication"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
});

test('top page links from the living and outing section, outside the disaster grid', () => {
  const home = readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const disasterStart = home.indexOf('id="tools-title"');
  const livingStart = home.indexOf('aria-labelledby="outing-title"');
  assert.ok(disasterStart >= 0 && livingStart > disasterStart);
  assert.equal(home.slice(disasterStart, livingStart).includes('tools/planter-soil/'), false);
  assert.match(home.slice(livingStart), /href="tools\/planter-soil\/index\.html"/);
});

test('fictional calculation example matches the formula section', () => {
  const result = calculate(dimensions({ lengthCm: 65, widthCm: 22, depthCm: 18, bagLiters: 14 }));
  assert.equal(result.volumeLiters, 25.74);
  assert.equal(result.bagCount, 2);

  const html = readFileSync(path.join(__dirname, '../tools/planter-soil/index.html'), 'utf8');
  const formula = html.match(/<section id="formula"[\\s\\S]*?<\\/section>/);
  assert.ok(formula);
  const example = formula[0].match(/<p class="example">([\\s\\S]*?)<\\/p>/);
  assert.ok(example);
  assert.match(example[1], /25\\.74L/);
  assert.match(example[1], /2袋/);
  assert.match(example[1], /架空/);
});
