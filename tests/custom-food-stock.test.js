'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { MAX_ROWS, calculateRows, formatResult, normalizeRow } = require('../assets/js/custom-food-stock.js');

const row = overrides => ({ name: '保存食', unit: '食分', target: 10, stock: 4, ...overrides });

test('target above usable stock shows the per-row difference', () => {
  const [result] = calculateRows([row()]);
  assert.equal(result.shortage, 6);
  assert.equal(result.hasShortage, true);
  assert.match(formatResult([row()]), /不足あり（不足 6 食分）/);
});

test('equal target and stock has no shortage and says no purchase is needed', () => {
  const [result] = calculateRows([row({ stock: 10 })]);
  assert.equal(result.shortage, 0);
  assert.equal(result.hasShortage, false);
  assert.match(formatResult([row({ stock: 10 })]), /不足なし（買い足しは不要です）/);
});

test('stock above target never creates a negative shortage', () => {
  const [result] = calculateRows([row({ target: 3, stock: 5 })]);
  assert.equal(result.shortage, 0);
  assert.equal(result.hasShortage, false);
});

test('zero stock and decimal quantities are supported to two places', () => {
  const [result] = calculateRows([row({ target: 2.5, stock: 0 })]);
  assert.equal(result.shortage, 2.5);
  assert.equal(calculateRows([row({ target: 0.3, stock: 0.1 })])[0].shortage, 0.2);
  assert.match(formatResult([row({ target: 2.5, stock: 0 })]), /不足 2\.5 食分/);
  assert.equal(normalizeRow(row({ target: 1.234 })).valid, false);
});

test('blank names or quantities, negative, nonnumeric, and over-limit values are invalid with reasons', () => {
  for (const input of [
    row({ name: '' }),
    row({ target: NaN }),
    row({ stock: NaN }),
    row({ target: -1 }),
    row({ stock: -1 }),
    row({ target: 'abc' }),
    row({ stock: 1000001 })
  ]) {
    const result = normalizeRow(input);
    assert.equal(result.valid, false);
    assert.ok(result.reason);
  }
});

test('same-named rows are evaluated independently and units are never combined', () => {
  const results = calculateRows([
    row({ target: 10, stock: 8, unit: '食分' }),
    row({ target: 2, stock: 3, unit: 'パック' }),
    row({ target: 4, stock: 1, unit: '食分' })
  ]);
  assert.deepEqual(results.map(result => result.shortage), [2, 0, 3]);
  assert.equal(Object.prototype.hasOwnProperty.call(results, 'total'), false);
  assert.match(formatResult([row({ stock: 10 }), row({ unit: '本', target: 2, stock: 2 })]), /食分/);
  assert.match(formatResult([row({ stock: 10 }), row({ unit: '本', target: 2, stock: 2 })]), /本/);
});

test('adding or removing a row recalculates only the current rows', () => {
  const rows = [row({ target: 10, stock: 4 }), row({ name: '飲料', unit: '本', target: 3, stock: 0 })];
  assert.deepEqual(calculateRows(rows).map(result => result.shortage), [6, 3]);
  rows.pop();
  assert.deepEqual(calculateRows(rows).map(result => result.shortage), [6]);
  rows.push(row({ target: 4, stock: 4 }));
  assert.deepEqual(calculateRows(rows).map(result => result.shortage), [6, 0]);
});

test('item names and units have short explicit limits', () => {
  assert.equal(normalizeRow(row({ name: '食'.repeat(41) })).valid, false);
  assert.equal(normalizeRow(row({ unit: '単'.repeat(13) })).valid, false);
});

test('row limits are enforced', () => {
  assert.throws(() => calculateRows([]), /1〜20/);
  assert.throws(() => calculateRows(Array.from({ length: MAX_ROWS + 1 }, () => row())), /1〜20/);
});

test('results expose no share URL, query writer, or combined quantity', () => {
  assert.equal(typeof require('../assets/js/custom-food-stock.js').writeQuery, 'undefined');
  const output = formatResult([row()]);
  assert.ok(!/https?:\/\/|\?/.test(output));
  assert.ok(!/合計/.test(output));
});
