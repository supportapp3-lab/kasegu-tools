/* User-entered travel costs only; pure arithmetic and compact share-state. */
(function (root) {
  'use strict';
  const MAX = Number.MAX_SAFE_INTEGER;
  function defaults() {
    return { people: 1, performances: 1, nights: 0,
      transport: [{ name: '往復交通費', amount: 0, perPerson: true }],
      lodging: { mode: 'room', amount: 0, rooms: 1 }, ticket: { price: 0, count: 1, auto: true },
      extras: ['グッズ', '食事', 'その他'].map(name => ({ name, amount: 0, perPerson: true })), budget: null };
  }
  function integer(value, min = 0, max = MAX) {
    if (!Number.isSafeInteger(value) || value < min || value > max) throw new RangeError('人数・回数・泊数は指定範囲、金額・枚数・室数は範囲内の整数で入力してください。');
    return value;
  }
  function expense(row) {
    if (!row || typeof row.name !== 'string' || !row.name.trim() || row.name.length > 60 || typeof row.perPerson !== 'boolean') throw new RangeError('費目名は1〜60文字で入力し、1人あたりか全員の合計かを選んでください。');
    return { name: row.name.trim(), amount: integer(row.amount), perPerson: row.perPerson };
  }
  function normalize(input) {
    if (!input || !Array.isArray(input.transport) || !Array.isArray(input.extras) || !input.lodging || !input.ticket) throw new TypeError('入力の形式を確認してください。');
    const people = integer(input.people, 1, 20);
    const performances = integer(input.performances, 1, 30);
    if (!['room', 'total'].includes(input.lodging.mode) || typeof input.ticket.auto !== 'boolean') throw new RangeError('宿泊費の方法とチケット枚数の指定を確認してください。');
    return { people, performances, nights: integer(input.nights, 0, 30),
      transport: input.transport.map(expense), extras: input.extras.map(expense),
      lodging: { mode: input.lodging.mode, amount: integer(input.lodging.amount), rooms: integer(input.lodging.rooms, 1) },
      ticket: { price: integer(input.ticket.price), count: input.ticket.auto ? people * performances : integer(input.ticket.count), auto: input.ticket.auto },
      budget: input.budget === null ? null : integer(input.budget) };
  }
  function safe(value) {
    if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('合計額が安全に計算できる整数の上限を超えています。金額・枚数・室数を確認してください。');
    return value;
  }
  function calculate(input) {
    const state = normalize(input);
    const detail = [];
    for (const row of state.transport) detail.push({ name: row.name, group: '交通費', amount: safe(row.amount * (row.perPerson ? state.people : 1)) });
    detail.push({ name: '宿泊費', group: '宿泊費', amount: safe(state.lodging.amount * (state.lodging.mode === 'room' ? state.lodging.rooms * state.nights : 1)) });
    detail.push({ name: 'チケット代', group: 'チケット代', amount: safe(state.ticket.price * state.ticket.count) });
    for (const row of state.extras) detail.push({ name: row.name, group: '自由費目', amount: safe(row.amount * (row.perPerson ? state.people : 1)) });
    const total = detail.reduce((sum, row) => safe(sum + row.amount), 0);
    return { total, perPerson: Math.round(total / state.people), perPerformance: Math.round(total / state.performances),
      breakdown: detail.map(row => ({ ...row, percent: total === 0 ? 0 : Math.round(row.amount / total * 1000) / 10 })),
      budgetDifference: state.budget === null ? null : state.budget - total };
  }
  function writeQuery(input) {
    const state = normalize(input); calculate(state);
    const rows = list => list.map(row => [row.name, row.amount, row.perPerson ? 1 : 0]);
    // Strings in the shared payload are expense names only. All mode flags are numeric.
    return new URLSearchParams({ s: JSON.stringify({ v: 1, p: state.people, c: state.performances, n: state.nights,
      t: rows(state.transport), h: [state.lodging.mode === 'room' ? 0 : 1, state.lodging.amount, state.lodging.rooms],
      k: [state.ticket.price, state.ticket.count, state.ticket.auto ? 1 : 0], e: rows(state.extras), b: state.budget }) }).toString();
  }
  function readQuery(query) {
    const fallback = defaults();
    let data;
    try { data = JSON.parse(new URLSearchParams(query).get('s')); } catch (_error) { return fallback; }
    if (!data || typeof data !== 'object' || Array.isArray(data) || data.v !== 1) return fallback;
    const validInt = (value, otherwise, min = 0, max = MAX) => Number.isSafeInteger(value) && value >= min && value <= max ? value : otherwise;
    fallback.people = validInt(data.p, 1, 1, 20); fallback.performances = validInt(data.c, 1, 1, 30); fallback.nights = validInt(data.n, 0, 0, 30);
    const restoreRows = (raw, otherwise) => {
      if (!Array.isArray(raw)) return otherwise;
      return raw.flatMap(row => {
        try {
          if (!Array.isArray(row) || row.length !== 3 || ![0, 1].includes(row[2])) return [];
          return [expense({ name: row[0], amount: row[1], perPerson: row[2] === 1 })];
        } catch (_error) { return []; }
      });
    };
    fallback.transport = restoreRows(data.t, fallback.transport); fallback.extras = restoreRows(data.e, fallback.extras);
    if (Array.isArray(data.h) && data.h.length === 3 && [0, 1].includes(data.h[0])) fallback.lodging = { mode: data.h[0] === 0 ? 'room' : 'total', amount: validInt(data.h[1], 0), rooms: validInt(data.h[2], 1, 1) };
    if (Array.isArray(data.k) && data.k.length === 3 && [0, 1].includes(data.k[2])) fallback.ticket = { price: validInt(data.k[0], 0), count: validInt(data.k[1], fallback.people * fallback.performances), auto: data.k[2] === 1 };
    fallback.budget = data.b === null ? null : validInt(data.b, null);
    try { const state = normalize(fallback); calculate(state); return state; } catch (_error) { return defaults(); }
  }
  function formatResult(input) {
    const state = normalize(input); const result = calculate(state);
    const yen = value => value.toLocaleString('ja-JP') + '円';
    return ['推し活・ライブ遠征費の計算', `${state.people}人／${state.performances}公演・参加回／${state.nights}泊`,
      `総額：${yen(result.total)}`, `1人あたり：${yen(result.perPerson)}／1公演あたり：${yen(result.perPerformance)}（円未満は四捨五入）`,
      ...result.breakdown.map(row => `${row.group}・${row.name}：${yen(row.amount)}（${row.percent}%）`),
      ...(state.budget === null ? [] : [`予算：${yen(state.budget)}／${result.budgetDifference < 0 ? '超過' : '残り'}：${yen(Math.abs(result.budgetDifference))}`]),
      '入力した金額だけの計算です。実際の料金は各事業者で確認してください。費目名に個人情報を書かないでください。'].join('\n');
  }
  const api = Object.freeze({ defaults, normalize, calculate, writeQuery, readQuery, formatResult });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.EnseiHi = api;
  if (typeof document === 'undefined') return;
  const form = document.getElementById('ensei-form'); if (!form) return;
  const copy = document.getElementById('copy-result'); const manual = document.getElementById('manual-copy');
  const manualLabel = document.getElementById('manual-copy-label'); const status = document.getElementById('copy-status');
  let current = null; let autoTickets = true; let nextRow = 0;
  const yen = value => value.toLocaleString('ja-JP') + '円';
  function addRow(kind, value) {
    const container = document.getElementById(kind + '-rows'); const row = document.createElement('div');
    row.className = 'expense-row'; const prefix = kind + '-' + nextRow++;
    const addControl = (key, labelText, type) => {
      const wrapper = document.createElement('div'); const label = document.createElement('label');
      const control = document.createElement(type === 'select' ? 'select' : 'input');
      control.id = prefix + '-' + key; control.dataset.key = key; label.htmlFor = control.id; label.textContent = labelText;
      if (type === 'select') {
        for (const [value, text] of [['1', '1人あたり'], ['0', '全員の合計']]) { const option = document.createElement('option'); option.value = value; option.textContent = text; control.append(option); }
      } else {
        control.type = type;
        if (type === 'number') { control.min = '0'; control.max = String(MAX); control.step = '1'; control.inputMode = 'numeric'; }
        else { control.maxLength = 60; control.required = true; control.autocomplete = 'off'; }
      }
      wrapper.append(label, control); row.append(wrapper); return control;
    };
    addControl('name', '費目名', 'text').value = value.name;
    addControl('amount', '金額（円）', 'number').value = String(value.amount);
    addControl('perPerson', '金額の単位', 'select').value = value.perPerson ? '1' : '0';
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'この行を削除';
    remove.addEventListener('click', () => { row.remove(); update(); }); row.append(remove); container.append(row);
  }
  function showState(state) {
    for (const key of ['people', 'performances', 'nights']) form.elements[key].value = String(state[key]);
    for (const [key, value] of Object.entries({ lodgingMode: state.lodging.mode, lodgingAmount: state.lodging.amount, rooms: state.lodging.rooms,
      ticketPrice: state.ticket.price, ticketCount: state.ticket.count, budget: state.budget === null ? '' : state.budget })) form.elements[key].value = String(value);
    autoTickets = state.ticket.auto;
    for (const kind of ['transport', 'extras']) { document.getElementById(kind + '-rows').replaceChildren(); state[kind].forEach(row => addRow(kind, row)); }
  }
  function readForm() {
    const number = (key, optional = false) => { const input = form.elements[key]; return input.value === '' ? optional ? null : 0 : input.valueAsNumber; };
    const rows = kind => Array.from(document.querySelectorAll('#' + kind + '-rows .expense-row'), row => ({ name: row.querySelector('[data-key="name"]').value,
      amount: row.querySelector('[data-key="amount"]').value === '' ? 0 : row.querySelector('[data-key="amount"]').valueAsNumber, perPerson: row.querySelector('[data-key="perPerson"]').value === '1' }));
    return normalize({ people: number('people'), performances: number('performances'), nights: number('nights'), transport: rows('transport'), extras: rows('extras'),
      lodging: { mode: form.elements.lodgingMode.value, amount: number('lodgingAmount'), rooms: form.elements.lodgingMode.value === 'total' && (!Number.isSafeInteger(number('rooms')) || number('rooms') < 1) ? 1 : number('rooms') },
      ticket: { price: number('ticketPrice'), count: number('ticketCount'), auto: autoTickets }, budget: number('budget', true) });
  }
  function update(syncUrl = true) {
    manual.hidden = true; manualLabel.hidden = true; status.textContent = '';
    const byRoom = form.elements.lodgingMode.value === 'room';
    form.elements.rooms.disabled = !byRoom; document.getElementById('room-control').hidden = !byRoom;
    document.getElementById('lodging-amount-label').textContent = byRoom ? '1泊1室あたり（円）' : '宿泊費の合計（円）';
    document.getElementById('lodging-note').textContent = byRoom ? '入力金額 × 室数 × 泊数。人数を重ねて掛けません。' : '入力した合計額をそのまま使用します。人数・室数・泊数を掛けません。';
    if (autoTickets && Number.isSafeInteger(form.elements.people.valueAsNumber) && Number.isSafeInteger(form.elements.performances.valueAsNumber)) form.elements.ticketCount.value = String(form.elements.people.valueAsNumber * form.elements.performances.valueAsNumber);
    document.getElementById('ticket-count-note').textContent = autoTickets ? '枚数は人数×参加回数に連動しています。手入力すると固定できます。' : '枚数は手入力した値で固定しています。人数や参加回数では変わりません。';
    const table = document.getElementById('breakdown'); table.replaceChildren();
    try {
      if (!form.checkValidity()) throw new RangeError('入力欄の範囲・整数・費目名を確認してください。');
      current = readForm(); const result = calculate(current);
      for (const key of ['total', 'perPerson', 'perPerformance']) document.getElementById(key).textContent = yen(result[key]);
      document.getElementById('budget-result').textContent = result.budgetDifference === null ? '予算未指定' : `${result.budgetDifference < 0 ? '予算を超過' : '予算の残り'}：${yen(Math.abs(result.budgetDifference))}`;
      for (const row of result.breakdown) {
        const tr = document.createElement('tr');
        for (const value of [`${row.group} / ${row.name}`, yen(row.amount), row.percent + '%']) { const td = document.createElement('td'); td.textContent = value; tr.append(td); } table.append(tr);
      }
      document.getElementById('input-error').textContent = ''; copy.disabled = false;
      if (syncUrl) history.replaceState(null, '', `${location.pathname}?${writeQuery(current)}`);
    } catch (error) {
      current = null; copy.disabled = true; document.getElementById('input-error').textContent = error.message;
      for (const key of ['total', 'perPerson', 'perPerformance']) document.getElementById(key).textContent = '—';
      document.getElementById('budget-result').textContent = '入力を確認してください';
      if (syncUrl) history.replaceState(null, '', location.pathname);
    }
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', event => { if (event.target === form.elements.ticketCount) autoTickets = false; update(); });
  form.addEventListener('change', () => update());
  for (const kind of ['transport', 'extras']) document.getElementById('add-' + kind).addEventListener('click', () => {
    addRow(kind, { name: kind === 'transport' ? '交通費' : 'その他', amount: 0, perPerson: true }); update();
    document.getElementById(kind + '-rows').lastElementChild.querySelector('input').focus();
  });
  document.getElementById('reset-ticket-count').addEventListener('click', () => { autoTickets = true; update(); });
  window.addEventListener('popstate', () => { showState(readQuery(location.search)); update(); });
  copy.addEventListener('click', async () => {
    if (!current) return; const text = formatResult(current) + '\n' + location.origin + location.pathname + '?' + writeQuery(current);
    try { if (!navigator.clipboard || !window.isSecureContext) throw Error('manual copy'); await navigator.clipboard.writeText(text); status.textContent = '結果と共有URLをコピーしました。'; }
    catch (_error) { manual.hidden = false; manualLabel.hidden = false; manual.value = text; manual.focus(); manual.select(); status.textContent = '選択された文章を手動でコピーしてください。'; }
  });
  showState(readQuery(location.search)); update();
})(typeof globalThis !== 'undefined' ? globalThis : this);
