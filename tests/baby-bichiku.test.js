'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { calculate, readQuery, writeQuery, formatResult, emptyChild } = require('../assets/js/baby-bichiku.js');
const child = overrides => ({ name: '', powderGrams: 100, liquidUnits: 0, waterMl: 700, diapers: 6, wipes: 20, foodUnits: 2, ...overrides });

test('multiple individual daily quantities produce separate results and totals', () => {
  const result = calculate({ days: 7, children: [child({ name: 'A' }), child({ name: 'B', powderGrams: 0, liquidUnits: 2, waterMl: 0, diapers: 5, wipes: 15, foodUnits: 0 })] });
  assert.deepEqual(result.children[0], { name: 'A', powderGrams: 700, powderKg: 0.7, liquidUnits: 0, waterLiters: 4.9, bottles: 3, diapers: 42, wipes: 140, foodUnits: 14 });
  assert.deepEqual(result.total, { powderGrams: 700, powderKg: 0.7, liquidUnits: 14, waterLiters: 4.9, bottles: 3, diapers: 77, wipes: 245, foodUnits: 14 });
});

test('water bottles round upward after combining, without floating-point overcount', () => {
  const result = calculate({ days: 7, children: [child(), child()] });
  assert.equal(result.total.waterLiters, 9.8);
  assert.equal(result.total.bottles, 5);
  assert.equal(result.children[0].bottles + result.children[1].bottles, 6);
  assert.equal(calculate({ days: 1, children: [child({ waterMl: 0.001 })] }).total.bottles, 1);
  assert.equal(calculate({ days: 3, children: [child({ waterMl: 2000 })] }).total.bottles, 3);
});

test('powder-only, liquid-only, combined and breastfeeding households support unused zeros', () => {
  assert.equal(calculate({ days: 7, children: [child()] }).total.liquidUnits, 0);
  assert.equal(calculate({ days: 7, children: [child({ powderGrams: 0, liquidUnits: 3, waterMl: 0 })] }).total.waterLiters, 0);
  const mixed = calculate({ days: 7, children: [child({ liquidUnits: 1 })] });
  assert.equal(mixed.total.powderGrams, 700);
  assert.equal(mixed.total.liquidUnits, 7);
  const noMilk = calculate({ days: 7, children: [child({ powderGrams: 0, liquidUnits: 0, waterMl: 0 })] });
  assert.equal(noMilk.total.diapers, 42);
  assert.equal(noMilk.total.powderGrams, 0);
  assert.equal(calculate({ days: 7, children: [emptyChild()] }).total.bottles, 0);
});

test('3 and 7 day presets, arbitrary periods and maximum ten rows', () => {
  for (const days of [1, 3, 7, 11, 60]) assert.equal(calculate({ days, children: [child()] }).total.wipes, 20 * days);
  assert.equal(calculate({ days: 7, children: Array.from({ length: 10 }, () => child()) }).total.diapers, 420);
  assert.throws(() => calculate({ days: 7, children: [] }));
  assert.throws(() => calculate({ days: 7, children: Array.from({ length: 11 }, () => child()) }));
});

test('invalid data and missing powder preparation water are rejected', () => {
  for (const days of [0, -1, 61, 0.5, NaN, Infinity, '7', null]) assert.throws(() => calculate({ days, children: [child()] }));
  for (const key of ['powderGrams', 'liquidUnits', 'waterMl', 'diapers', 'wipes', 'foodUnits']) {
    for (const value of [-1, NaN, Infinity, '', '2', null, true, 1000001, 0.0001]) assert.throws(() => calculate({ days: 7, children: [child({ [key]: value })] }));
  }
  for (const key of ['liquidUnits', 'diapers', 'wipes', 'foodUnits']) assert.throws(() => calculate({ days: 7, children: [child({ [key]: 0.5 })] }));
  assert.throws(() => calculate({ days: 7, children: [child({ waterMl: 0 })] }));
  assert.throws(() => calculate({ days: 7, children: [child({ name: 'a'.repeat(81) })] }));
});

test('URL roundtrip saves quantities while excluding all nicknames', () => {
  const input = { days: 11, children: [child({ name: 'private-baby-A' }), child({ name: 'private-baby-B', powderGrams: 60.25, waterMl: 450.5 })] };
  const query = writeQuery(input);
  assert.ok(!decodeURIComponent(query).includes('private'));
  assert.equal(new URLSearchParams(query).has('name'), false);
  assert.deepEqual(readQuery(query), { days: 11, children: input.children.map(row => ({ ...row, name: '' })) });
  assert.deepEqual(calculate(readQuery(query)).total, calculate(input).total);
});

test('malformed URLs and extra personal parameters do not supply invalid inputs', () => {
  for (const raw of ['broken', '{}', '[]', '[[]]', '[[1,0,0,6,20,2]]', 'a'.repeat(10001)]) {
    assert.deepEqual(readQuery('?days=0&children=' + encodeURIComponent(raw) + '&name=private'), { days: 7, children: [emptyChild()] });
  }
  const tooMany = JSON.stringify(Array.from({ length: 11 }, () => [0, 0, 0, 0, 0, 0]));
  assert.equal(readQuery('?children=' + encodeURIComponent(tooMany)).children.length, 1);
});

test('copy includes individual and total quantities with scope and consultation note', () => {
  const text = formatResult({ days: 7, children: [child({ name: 'はる' })] });
  for (const expected of ['はる', '700g', '0.7kg', '4.9L', '42枚', '140枚', '14個／食', '入力した', '助産師', '洗浄', '自治体']) assert.ok(text.includes(expected));
});

test('calculation is nonmutating and no standard quantity is inferred from zero', () => {
  const row = Object.freeze(emptyChild());
  const input = Object.freeze({ days: 7, children: Object.freeze([row]) });
  assert.deepEqual(calculate(input).total, { powderGrams: 0, powderKg: 0, liquidUnits: 0, waterLiters: 0, bottles: 0, diapers: 0, wipes: 0, foodUnits: 0 });
  writeQuery(input);
  assert.equal(row.powderGrams, 0);
});
