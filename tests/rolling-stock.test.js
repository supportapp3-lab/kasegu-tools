'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { STORAGE_KEY, dateNumber, localToday, remainingDays, normalizeItem, serialize, parseItems, readStored, importItems, viewItems } = require('../assets/js/rolling-stock.js');
const item = overrides => ({ name: '水', category: 'water', quantity: 2, unit: '本', expiry: '2026-10-14', memo: '', ...overrides });
const options = overrides => ({ today: '2026-10-14', windowDays: 30, filter: 'all', sort: 'expiry', ...overrides });

test('calendar boundaries: expiry day 0, previous day 1, next day negative', () => {
  assert.equal(remainingDays('2026-10-14', '2026-10-14'), 0);
  assert.equal(remainingDays('2026-10-14', '2026-10-13'), 1);
  assert.equal(remainingDays('2026-10-14', '2026-10-15'), -1);
  assert.equal(remainingDays('2024-03-01', '2024-02-28'), 2);
  assert.equal(remainingDays('2026-01-01', '2025-12-31'), 1);
  assert.equal(remainingDays('2026-03-09', '2026-03-08'), 1);
  assert.equal(localToday(new Date(2026, 9, 14, 23, 59)), '2026-10-14');
  assert.equal(remainingDays('0099-01-02', '0099-01-01'), 1);
});

test('invalid calendar dates and ambiguous formats are rejected', () => {
  for (const date of ['2026-02-29', '2026-13-01', '2026-01-00', '2026-04-31', '2026-1-1', '2026-10-14T00:00:00Z', '0000-01-01', '', null]) assert.throws(() => dateNumber(date));
});

test('expiry sorting is stable and category sorting uses the fixed list', () => {
  const rows = [item({ name: '薬', category: 'other', expiry: '2026-12-01' }), item({ name: '缶', category: 'food', expiry: '2026-10-10' }), item({ name: '袋', category: 'toilet', expiry: '2026-10-09' }), item({ name: '水' }), item({ name: '同日' })];
  assert.deepEqual(viewItems(rows, options()).map(row => row.item.name), ['袋', '缶', '水', '同日', '薬']);
  assert.deepEqual(viewItems(rows, options({ sort: 'category' })).map(row => row.item.name), ['水', '同日', '缶', '袋', '薬']);
  assert.equal(viewItems(rows, options())[0].index, 2);
});

test('expired, near-window inclusive boundary and other filters are disjoint', () => {
  const rows = [item({ expiry: '2026-10-13' }), item(), item({ expiry: '2026-11-13' }), item({ expiry: '2026-11-14' })];
  assert.deepEqual(viewItems(rows, options({ filter: 'expired' })).map(row => row.days), [-1]);
  assert.deepEqual(viewItems(rows, options({ filter: 'near' })).map(row => row.days), [0, 30]);
  assert.deepEqual(viewItems(rows, options({ filter: 'other' })).map(row => row.days), [31]);
  for (const windowDays of [7, 14, 30, 60]) assert.equal(viewItems([item()], options({ filter: 'near', windowDays })).length, 1);
});

test('JSON roundtrip preserves optional quantity and all text fields', () => {
  const rows = [item(), item({ name: '<img src=x>', quantity: null, unit: '', memo: 'メモ' })];
  assert.deepEqual(parseItems(serialize(rows)), { items: rows, skipped: 0, error: null });
  assert.equal(STORAGE_KEY, 'kasegu-tools.rolling-stock.v1');
});

test('malformed stored JSON or any invalid stored row falls back to an empty list with warning', () => {
  assert.deepEqual(readStored(null), { items: [], warning: '' });
  for (const text of ['invalid', '{}', JSON.stringify([item(), { bad: true }])]) {
    const result = readStored(text);
    assert.deepEqual(result.items, []);
    assert.ok(result.warning);
  }
  assert.equal(readStored(serialize([item()])).items.length, 1);
});

test('imports skip invalid rows and count accepted rows for append and replacement', () => {
  const text = JSON.stringify([item({ name: '追加' }), { bad: true }, item({ name: 'もう1件' })]);
  const appended = importItems([item()], text, 'append');
  assert.equal(appended.items.length, 3);
  assert.equal(appended.imported, 2);
  assert.equal(appended.skipped, 1);
  const replaced = importItems([item()], text, 'replace');
  assert.deepEqual(replaced.items.map(row => row.name), ['追加', 'もう1件']);
  assert.equal(replaced.skipped, 1);
});

test('invalid imports cannot destroy existing inventory; explicit empty replacement is allowed', () => {
  for (const text of ['not-json', '{}', '[{}]']) {
    const result = importItems([item()], text, 'replace');
    assert.deepEqual(result.items, [item()]);
    assert.ok(result.error);
  }
  assert.deepEqual(importItems([item()], '[]', 'replace').items, []);
});

test('item validation enforces categories, lengths, dates and positive optional quantities', () => {
  for (const name of ['', ' ', 'a'.repeat(81), null]) assert.throws(() => normalizeItem(item({ name })));
  for (const category of ['custom', '__proto__', null]) assert.throws(() => normalizeItem(item({ category })));
  for (const quantity of [0, -1, NaN, Infinity, '2', true, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => normalizeItem(item({ quantity })));
  assert.equal(normalizeItem(item({ quantity: null })).quantity, null);
  assert.equal(normalizeItem(item({ quantity: 0.5 })).quantity, 0.5);
  assert.throws(() => normalizeItem(item({ unit: 'a'.repeat(13) })));
  assert.throws(() => normalizeItem(item({ memo: 'a'.repeat(201) })));
});

test('display and serialization do not mutate source arrays and unknown fields are omitted', () => {
  const row = Object.freeze(item({ extra: 'not part of schema' }));
  const source = Object.freeze([row]);
  viewItems(source, options());
  assert.ok(!serialize(source).includes('extra'));
  assert.equal(row.name, '水');
});
