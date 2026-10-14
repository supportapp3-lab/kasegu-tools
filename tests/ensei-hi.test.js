'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { defaults, normalize, calculate, writeQuery, readQuery, formatResult } = require('../assets/js/ensei-hi.js');
function sample() {
  return { people: 2, performances: 2, nights: 2,
    transport: [{name:'往復',amount:1000,perPerson:true},{name:'現地移動',amount:300,perPerson:false}],
    lodging:{mode:'room',amount:2000,rooms:1}, ticket:{price:500,count:4,auto:true},
    extras:[{name:'グッズ',amount:100,perPerson:true},{name:'食事',amount:200,perPerson:false}], budget:9000 };
}
test('default amounts are zero and no market price or preset is invented', () => {
  assert.equal(calculate(defaults()).total,0); assert.equal(calculate(defaults()).budgetDifference,null);
  assert.ok(calculate(defaults()).breakdown.every(row=>row.percent===0));
});
test('multiple transport and free expenses apply per-person multiplier exactly once', () => {
  const result=calculate(sample()); assert.equal(result.total,8700); assert.equal(result.perPerson,4350); assert.equal(result.perPerformance,4350);
  assert.deepEqual(result.breakdown.map(r=>r.amount),[2000,300,4000,2000,200,200]); assert.equal(result.budgetDifference,300);
});
test('per-room lodging multiplies rooms and nights, not people; zero nights costs zero', () => {
  const state=defaults(); state.people=3; state.nights=2; state.lodging={mode:'room',amount:1000,rooms:2};
  assert.equal(calculate(state).total,4000); state.nights=0; assert.equal(calculate(state).total,0);
});
test('total lodging is independent of people, room count and nights', () => {
  const state=defaults(); state.people=20; state.nights=0; state.lodging={mode:'total',amount:1234,rooms:5};
  assert.equal(calculate(state).total,1234);
});
test('automatic ticket count follows people times performances and manual count supports zero', () => {
  const state=defaults(); state.people=3; state.performances=2; state.ticket.price=100;
  assert.equal(normalize(state).ticket.count,6); assert.equal(calculate(state).total,600);
  state.ticket.auto=false; state.ticket.count=4; assert.equal(calculate(state).total,400);
  state.ticket.count=0; assert.equal(calculate(state).total,0);
});
test('yen rounding and one-decimal composition ratios include zero total', () => {
  const state=defaults(); state.people=2; state.performances=2; state.transport=[{name:'合計',amount:5,perPerson:false}];
  assert.equal(calculate(state).perPerson,3); assert.equal(calculate(state).perPerformance,3);
  assert.equal(calculate(state).breakdown[0].percent,100);
  state.extras=[{name:'追加',amount:10,perPerson:false}]; assert.equal(calculate(state).breakdown[0].percent,33.3);
});
test('optional, zero, exceeded and exactly matched budgets stay distinct', () => {
  const state=sample(); state.budget=null; assert.equal(calculate(state).budgetDifference,null);
  state.budget=0; assert.equal(calculate(state).budgetDifference,-8700);
  state.budget=8700; assert.equal(calculate(state).budgetDifference,0);
  state.budget=10000; assert.equal(calculate(state).budgetDifference,1300);
});
test('bounds, fractional and negative quantities, wrong types and expense names are rejected', () => {
  for(const [field, values] of Object.entries({people:[0,21,1.5,'2'],performances:[0,31,NaN],nights:[-1,31,0.5]})) {
    for(const value of values) assert.throws(()=>calculate({...defaults(),[field]:value}));
  }
  for(const value of [-1,0.5,Infinity,'100',Number.MAX_SAFE_INTEGER+1]) { const s=defaults();s.transport[0].amount=value;assert.throws(()=>calculate(s)); }
  for(const name of ['', '  ', 'a'.repeat(61),null]) {const s=defaults();s.extras[0].name=name;assert.throws(()=>calculate(s));}
  assert.throws(()=>calculate({...defaults(),budget:-1}));
  const max=defaults();max.people=20;max.performances=30;max.nights=30;assert.equal(normalize(max).ticket.count,600);
});
test('unsafe products and sums are rejected instead of returning inaccurate totals', () => {
  const s=defaults();s.people=2;s.transport[0].amount=Number.MAX_SAFE_INTEGER;assert.throws(()=>calculate(s));
  s.people=1;s.extras[0].amount=1;assert.throws(()=>calculate(s));assert.throws(()=>writeQuery(s));
});
test('query roundtrip preserves numeric input, names, modes and manually fixed tickets only', () => {
  const s=sample();s.ticket.auto=false;s.ticket.count=3;s.extras[0].name='グッズ & = # あいう';s.secret='private';
  const query=writeQuery(s);assert.deepEqual(readQuery(query),normalize(s));assert.ok(!decodeURIComponent(query).includes('private'));
  const data=JSON.parse(new URLSearchParams(query).get('s'));assert.ok(data.t.every(row=>typeof row[1]==='number'&&typeof row[2]==='number'));
  s.lodging.mode='total';s.budget=0;assert.deepEqual(readQuery(writeQuery(s)),normalize(s));
  s.transport=[];s.extras=[];assert.deepEqual(readQuery(writeQuery(s)),normalize(s));
});
test('malformed queries discard invalid rows, unknown fields, unsafe amounts and bad scalar values', () => {
  for(const query of ['','s=invalid','s=null','s=%5B%5D','s=%7B%22v%22%3A2%7D']) assert.deepEqual(readQuery(query),defaults());
  const data={v:1,p:999,c:0,n:-1,t:[['valid',2,0],['bad',-1,1],['bad type','4',1]],e:[],h:[1,-2,0],k:[100,-1,1],b:-1,personal:'secret'};
  const restored=readQuery(new URLSearchParams({s:JSON.stringify(data)})); assert.equal(restored.people,1);assert.equal(restored.performances,1);assert.equal(restored.nights,0);
  assert.deepEqual(restored.transport,[{name:'valid',amount:2,perPerson:false}]);assert.equal(restored.budget,null);assert.ok(!writeQuery(restored).includes('secret'));
  data.p=20;data.t=[['huge',Number.MAX_SAFE_INTEGER,1]];assert.deepEqual(readQuery(new URLSearchParams({s:JSON.stringify(data)})),defaults());
});
test('format explains totals, rounding, details, optional budgets and does not mutate inputs', () => {
  const s=sample();const before=JSON.stringify(s);const text=formatResult(s);
  assert.ok(text.includes('総額：8,700円'));assert.ok(text.includes('残り：300円'));assert.ok(text.includes('四捨五入'));assert.ok(text.includes('往復'));
  calculate(s);writeQuery(s);assert.equal(JSON.stringify(s),before);assert.notEqual(defaults().extras,defaults().extras);
});
