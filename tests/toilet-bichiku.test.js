'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { DEFAULTS, calculate, readQuery, writeQuery, formatResult } = require('../assets/js/toilet-bichiku.js');
const input = overrides => ({ people: 4, frequency: 5, days: 7, stock: 0, packSize: null, ...overrides });

test('four people times five daily uses times seven days equals 140', () => {
  assert.deepEqual(calculate(input()), { needed: 140, shortage: 140, packs: null, perPerson: 35, perDay: 20 });
});

test('deduct stock and never report negative shortage or packs', () => {
  assert.equal(calculate(input({ stock: 40 })).shortage, 100);
  for (const stock of [140, 200, Number.MAX_SAFE_INTEGER]) {
    const result = calculate(input({ stock, packSize: 10 }));
    assert.equal(result.shortage, 0);
    assert.equal(result.packs, 0);
  }
});

test('pack count rounds up based on shortage and provided product capacity only', () => {
  assert.equal(calculate(input({ stock: 40, packSize: 30 })).packs, 4);
  assert.equal(calculate(input({ stock: 40, packSize: 50 })).packs, 2);
  assert.equal(calculate(input({ packSize: Number.MAX_SAFE_INTEGER })).packs, 1);
  assert.equal(calculate(input({ packSize: null })).packs, null);
});

test('3, 7 and arbitrary periods and supported maxima', () => {
  for (const days of [1, 3, 7, 11, 60]) assert.equal(calculate(input({ days })).needed, 20 * days);
  assert.equal(calculate(input({ people: 20, frequency: 20, days: 60 })).needed, 24000);
  assert.equal(DEFAULTS.frequency, 5);
  assert.equal(DEFAULTS.days, 7);
  assert.equal(DEFAULTS.packSize, null);
});

test('invalid inputs fail instead of silently producing quantities', () => {
  for (const key of ['people', 'frequency', 'days', 'stock']) {
    for (const value of [-1, 0.5, NaN, Infinity, '', '4', null, true, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => calculate(input({ [key]: value })));
  }
  for (const key of ['people', 'frequency']) for (const value of [0, 21]) assert.throws(() => calculate(input({ [key]: value })));
  for (const days of [0, 61]) assert.throws(() => calculate(input({ days })));
  for (const packSize of [0, -1, 0.5, NaN, Infinity, '', '50', undefined, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => calculate(input({ packSize })));
});

test('query roundtrip with and without optional pack size', () => {
  for (const packSize of [null, 30]) {
    const state = input({ people: 3, frequency: 6, days: 11, stock: 25, packSize });
    assert.deepEqual(readQuery(writeQuery(state)), state);
    assert.equal(new URLSearchParams(writeQuery(state)).has('packSize'), packSize !== null);
  }
});

test('malformed query parameters revert to documented defaults independently', () => {
  assert.deepEqual(readQuery('?people=0&frequency=0.5&days=61&stock=-1&packSize=0'), DEFAULTS);
  assert.equal(readQuery('?people=3&stock=9007199254740992&packSize=%3Cscript%3E').people, 3);
  assert.equal(readQuery('?people=3&stock=9007199254740992').stock, 0);
});

test('copy reports calculations and optional packs without inventing product values', () => {
  const text = formatResult(input({ stock: 40, packSize: 30 }));
  for (const value of ['140回分', '100回分', '4パック', '35回分', '20回分', '自治体', '管理組合']) assert.ok(text.includes(value));
  assert.ok(!formatResult(input()).includes('パック'));
});

test('calculation and query serialization leave input unchanged', () => {
  const state = Object.freeze(input());
  calculate(state);
  writeQuery(state);
  assert.equal(state.people, 4);
});
