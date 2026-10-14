'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { calculate, readQuery, writeQuery, formatResult } = require('../assets/js/bichiku.js');

test('family of four for seven days and mixed ages', () => {
  assert.deepEqual(calculate({ adults: 2, children: 1, infants: 1, days: 7, pets: true }),
    { people: 4, days: 7, waterLiters: 84, bottles: 42, toilets: 140, meals: 84, needsInfantSupplies: true, needsPetSupplies: true });
});
test('round bottles upward and support arbitrary and zero-person totals', () => {
  assert.equal(calculate({ adults: 1, children: 0, infants: 0, days: 3, pets: false }).bottles, 5);
  assert.equal(calculate({ adults: 3, children: 0, infants: 0, days: 11, pets: false }).waterLiters, 99);
  assert.equal(calculate({ adults: 0, children: 0, infants: 0, days: 7, pets: false }).meals, 0);
});
test('pets only change the supplementary checklist', () => {
  const input = { adults: 1, children: 0, infants: 0, days: 7, pets: false };
  assert.equal(calculate(input).waterLiters, calculate({ ...input, pets: true }).waterLiters);
  assert.equal(calculate(input).needsPetSupplies, false);
});
test('invalid inputs fail rather than produce misleading totals', () => {
  const input = { adults: 2, children: 0, infants: 0, days: 7, pets: false };
  for (const key of ['adults', 'children', 'infants', 'days']) {
    for (const value of [-1, 0.5, NaN, Infinity, '', '2', null, true, 1000]) assert.throws(() => calculate({ ...input, [key]: value }));
  }
  assert.throws(() => calculate({ ...input, days: 0 }));
  assert.throws(() => calculate({ ...input, days: 366 }));
  assert.throws(() => calculate({ ...input, pets: 'true' }));
});
test('query roundtrip preserves state and unrelated parameters', () => {
  const input = { adults: 3, children: 2, infants: 1, days: 11, pets: true };
  const query = writeQuery(input, 'ref=family');
  assert.deepEqual(readQuery(query), input);
  assert.equal(new URLSearchParams(query).get('ref'), 'family');
});
test('malformed shared URL uses documented defaults', () => {
  assert.deepEqual(readQuery('?adults=-1&children=0.5&infants=%3Cscript%3E&days=0&pets=0'),
    { adults: 2, children: 0, infants: 0, days: 7, pets: false });
  assert.equal(readQuery('?days=999999999999999999999999').days, 7);
});
test('result copy includes numbers, scope and supplementary notes', () => {
  const text = formatResult({ adults: 2, children: 1, infants: 1, days: 7, pets: true });
  for (const value of ['84L', '42本', '140回分', '84食分', '乳幼児', 'ペット', '自治体']) assert.ok(text.includes(value));
});
test('calculation leaves its input unchanged', () => {
  const input = Object.freeze({ adults: 2, children: 0, infants: 0, days: 7, pets: false });
  calculate(input);
  assert.equal(input.adults, 2);
});
