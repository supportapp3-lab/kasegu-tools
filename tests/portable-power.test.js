'use strict';
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { DEFAULTS, MAX_ITEMS, calculate, normalize, readQuery, writeQuery, formatResult } = require('../assets/js/portable-power.js');

const item = overrides => ({ name: '', watts: 100, hoursPerDay: 2, days: 3, ...overrides });
const input = items => ({ items });

test('one appliance uses W × hours per day × days', () => {
  assert.deepEqual(calculate(input([item()])), {
    items: [{ name: '', watts: 100, hoursPerDay: 2, days: 3, wh: 600 }],
    totalWh: 600
  });
});

test('multiple rows add together and decimal hours are supported', () => {
  const result = calculate(input([
    item({ name: '照明', watts: 10, hoursPerDay: 0.5, days: 2 }),
    item({ name: 'ラジオ', watts: 20, hoursPerDay: 1.25, days: 3 })
  ]));
  assert.deepEqual(result.items.map(row => row.wh), [10, 75]);
  assert.equal(result.totalWh, 85);
});

test('adding and removing rows recalculates only the remaining entries', () => {
  const rows = [item({ watts: 10 }), item({ watts: 20 })];
  assert.equal(calculate(input(rows)).totalWh, 180);
  rows.push(item({ watts: 30 }));
  assert.equal(calculate(input(rows)).totalWh, 360);
  rows.splice(1, 1);
  assert.equal(calculate(input(rows)).totalWh, 240);
});

test('input order does not change the total', () => {
  const rows = [item({ watts: 12, hoursPerDay: 1.5 }), item({ watts: 9, days: 5 }), item({ watts: 40, hoursPerDay: 0.25 })];
  assert.equal(calculate(input(rows)).totalWh, calculate(input([...rows].reverse())).totalWh);
});

test('empty rows, zero, negative, non-numeric, and over-limit values are rejected', () => {
  assert.throws(() => calculate(input([])));
  for (const value of [null, 0, -1, NaN, Infinity, '10', Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => calculate(input([item({ watts: value })])));
    assert.throws(() => calculate(input([item({ hoursPerDay: value })])));
  }
  for (const value of [0, -1, 1.5, NaN, Infinity, '3', 366, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => calculate(input([item({ days: value })])));
  }
});

test('row count and optional name length have explicit limits', () => {
  assert.throws(() => normalize(input(Array.from({ length: MAX_ITEMS + 1 }, () => item()))));
  assert.throws(() => calculate(input([item({ name: 'あ'.repeat(41) })])));
  assert.equal(normalize(input([item({ name: '  扇風機  ' })])).items[0].name, '扇風機');
});

test('share query roundtrips values and malformed input falls back to a blank row', () => {
  const state = input([item({ name: '照明', watts: 15.5, hoursPerDay: 0.75, days: 4 }), item({ watts: 45, hoursPerDay: 1.25, days: 2 })]);
  assert.deepEqual(readQuery(writeQuery(state)), normalize(state));
  assert.deepEqual(readQuery('?items=%3Cscript%3E'), DEFAULTS);
  assert.deepEqual(readQuery(''), DEFAULTS);
});

test('result labels describe ideal Wh only and include no prohibited capacity or runtime claims', () => {
  const text = formatResult(input([item()]));
  assert.match(text, /理想上の負荷合計：600Wh/);
  for (const forbidden of ['必要容量', '稼働時間', '推奨Wh', '何時間使える']) {
    assert.ok(!text.includes(forbidden), 'unexpected result wording: ' + forbidden);
  }
});

test('normalization and query serialization do not mutate caller input', () => {
  const source = input([Object.freeze(item())]);
  Object.freeze(source.items);
  Object.freeze(source);
  const normalized = normalize(source);
  writeQuery(source);
  assert.equal(normalized.items[0].watts, 100);
  assert.equal(source.items[0].name, '');
});

test('fictional calculation example matches the formula section', () => {
  const result = calculate(input([
    item({ watts: 10, hoursPerDay: 5, days: 3 }),
    item({ watts: 5, hoursPerDay: 2, days: 3 })
  ]));
  assert.deepEqual(result.items.map(row => row.wh), [150, 30]);
  assert.equal(result.totalWh, 180);

  const html = readFileSync(path.join(__dirname, '../tools/portable-power/index.html'), 'utf8');
  const formulaStart = html.indexOf('<section id="formula"');
  const formulaEnd = html.indexOf('</section>', formulaStart);
  assert.ok(formulaStart >= 0 && formulaEnd > formulaStart);
  const formula = html.slice(formulaStart, formulaEnd);
  const exampleStart = formula.indexOf('<p class="example">');
  const exampleEnd = formula.indexOf('</p>', exampleStart);
  assert.ok(exampleStart >= 0 && exampleEnd > exampleStart);
  const example = formula.slice(exampleStart, exampleEnd);
  for (const value of ['150Wh', '30Wh', '180Wh', '架空']) {
    assert.ok(example.includes(value), 'missing example text: ' + value);
  }
  for (const forbidden of ['必要容量', '稼働時間', '推奨Wh', '何時間使える']) {
    assert.ok(!example.includes(forbidden), 'unexpected example wording: ' + forbidden);
  }
});
