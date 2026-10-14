'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { calculate, readQuery, writeQuery, formatResult, emptyPet } = require('../assets/js/pet-bichiku.js');
const pet = overrides => ({ kind: 'dog', name: '', foodGrams: 150, waterMl: 500, sheets: 3, litterLiters: 0, bagGrams: 1000, ...overrides });

test('multiple pets, individual quantities, totals, bags and combined bottles', () => {
  const result = calculate({ days: 7, pets: [pet({ name: '犬A' }), pet({ kind: 'cat', name: '猫B', foodGrams: 60, waterMl: 200, sheets: 0, litterLiters: 0.2, bagGrams: 500 })] });
  assert.deepEqual(result.pets[0], { kind: 'dog', name: '犬A', foodGrams: 1050, foodKg: 1.05, waterLiters: 3.5, bottles: 2, sheets: 21, litterLiters: 0, bags: 2 });
  assert.equal(result.pets[1].bags, 1);
  assert.deepEqual(result.total, { foodGrams: 1470, foodKg: 1.47, waterLiters: 4.9, bottles: 3, sheets: 21, litterLiters: 1.4 });
});

test('round upward only once for shared water; bags remain individual', () => {
  const result = calculate({ days: 1, pets: [pet({ waterMl: 1000 }), pet({ waterMl: 1000, bagGrams: 0 })] });
  assert.equal(result.pets[0].bottles + result.pets[1].bottles, 2);
  assert.equal(result.total.bottles, 1);
  assert.equal(result.pets[1].bags, null);
  assert.equal(calculate({ days: 3, pets: [pet({ foodGrams: 0.1, bagGrams: 0.3, waterMl: 0.001 })] }).pets[0].bags, 1);
  assert.equal(calculate({ days: 1, pets: [pet({ waterMl: 0.001 })] }).total.bottles, 1);
  assert.equal(calculate({ days: 1, pets: [pet({ foodGrams: 1000.001 })] }).pets[0].bags, 2);
});

test('5, 7 and arbitrary days plus maximum of ten pets', () => {
  for (const days of [1, 5, 7, 11, 60]) assert.equal(calculate({ days, pets: [pet()] }).total.foodGrams, 150 * days);
  assert.equal(calculate({ days: 7, pets: Array.from({ length: 10 }, () => pet()) }).total.foodGrams, 10500);
  assert.throws(() => calculate({ days: 7, pets: Array.from({ length: 11 }, () => pet()) }));
  assert.throws(() => calculate({ days: 7, pets: [] }));
});

test('invalid values never produce negative, missing or infinite supplies', () => {
  for (const days of [0, -1, 61, 1.5, NaN, Infinity, '7', null]) assert.throws(() => calculate({ days, pets: [pet()] }));
  for (const key of ['foodGrams', 'waterMl', 'sheets', 'litterLiters', 'bagGrams']) {
    for (const value of [-1, NaN, Infinity, '', '2', null, true, 1000001, 0.0001]) assert.throws(() => calculate({ days: 7, pets: [pet({ [key]: value })] }));
  }
  for (const key of ['foodGrams', 'waterMl']) assert.throws(() => calculate({ days: 7, pets: [pet({ [key]: 0 })] }));
  for (const value of [0.5, 1001]) assert.throws(() => calculate({ days: 7, pets: [pet({ sheets: value })] }));
  for (const kind of ['rabbit', '__proto__', null]) assert.throws(() => calculate({ days: 7, pets: [pet({ kind })] }));
  assert.throws(() => calculate({ days: 7, pets: [pet({ name: 'a'.repeat(81) })] }));
});

test('URL roundtrip includes all numerical state and explicitly excludes every name', () => {
  const input = { days: 11, pets: [pet({ name: 'private-dog-name' }), pet({ kind: 'other', name: 'private-cat-name', foodGrams: 60.25, waterMl: 250, litterLiters: 0.15 })] };
  const query = writeQuery(input);
  assert.ok(!decodeURIComponent(query).includes('private'));
  assert.deepEqual(readQuery(query), { days: 11, pets: input.pets.map(row => ({ ...row, name: '' })) });
  assert.deepEqual(calculate(readQuery(query)).total, calculate(input).total);
  assert.equal(new URLSearchParams(query).has('name'), false);
});

test('malformed and malicious URLs use empty input rather than accept broken state', () => {
  for (const value of ['bad-json', '{}', '[]', '[[]]', '[["dog",-1,500,0,0,0]]', '[["__proto__",150,500,0,0,0]]', 'a'.repeat(10001)]) {
    assert.deepEqual(readQuery('?days=0&pets=' + encodeURIComponent(value) + '&name=private'), { days: 7, pets: [emptyPet()] });
  }
  const tooMany = JSON.stringify(Array.from({ length: 11 }, () => ['dog', 150, 500, 0, 0, 0]));
  assert.equal(readQuery('?pets=' + encodeURIComponent(tooMany)).pets.length, 1);
});

test('copy text explains individual quantities, totals and scope', () => {
  const text = formatResult({ days: 7, pets: [pet({ name: 'ポチ' })] });
  for (const expected of ['ポチ', '1050g', '1.05kg', '2袋', '3.5L', '21枚', '獣医師', '自治体', '洗浄用水']) assert.ok(text.includes(expected));
});

test('input and individual pet objects are not mutated', () => {
  const row = Object.freeze(pet());
  const input = Object.freeze({ days: 7, pets: Object.freeze([row]) });
  calculate(input);
  writeQuery(input);
  assert.equal(row.foodGrams, 150);
});

test('species labels never change the user-entered daily quantity', () => {
  for (const kind of ['dog', 'cat', 'other']) assert.equal(calculate({ days: 7, pets: [pet({ kind })] }).total.foodGrams, 1050);
});
