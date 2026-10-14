/* Dependency-free calculation and browser controller. */
(function (root) {
  'use strict';
  const DEFAULTS = Object.freeze({ adults: 2, children: 0, infants: 0, days: 7, pets: false });
  const LIMITS = Object.freeze({ adults: 999, children: 999, infants: 999, days: 365 });

  function normalize(input) {
    const state = {};
    for (const key of ['adults', 'children', 'infants', 'days']) {
      const value = input[key];
      if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < (key === 'days' ? 1 : 0) || value > LIMITS[key]) {
        throw new RangeError('人数は0〜999、日数は1〜365の整数で入力してください。');
      }
      state[key] = value;
    }
    if (typeof input.pets !== 'boolean') throw new TypeError('ペットの有無を確認してください。');
    state.pets = input.pets;
    return state;
  }

  function calculate(input) {
    const state = normalize(input);
    const people = state.adults + state.children + state.infants;
    return Object.freeze({ people, days: state.days, waterLiters: people * state.days * 3,
      bottles: Math.ceil(people * state.days * 3 / 2), toilets: people * state.days * 5,
      meals: people * state.days * 3, needsInfantSupplies: state.infants > 0, needsPetSupplies: state.pets });
  }

  function readQuery(query) {
    const params = new URLSearchParams(query);
    const state = { ...DEFAULTS };
    for (const key of ['adults', 'children', 'infants', 'days']) {
      const raw = params.get(key);
      if (raw !== null && /^\d+$/.test(raw)) {
        const value = Number(raw);
        if (Number.isSafeInteger(value) && value <= LIMITS[key] && value >= (key === 'days' ? 1 : 0)) state[key] = value;
      }
    }
    if (params.has('pets')) state.pets = params.get('pets') === '1';
    return state;
  }

  function writeQuery(input, query = '') {
    const state = normalize(input);
    const params = new URLSearchParams(query);
    for (const key of ['adults', 'children', 'infants', 'days']) params.set(key, String(state[key]));
    params.set('pets', state.pets ? '1' : '0');
    return params.toString();
  }

  function formatResult(input) {
    const state = normalize(input);
    const result = calculate(state);
    return ['防災備蓄の目安', `大人${state.adults}人・子ども${state.children}人・乳幼児${state.infants}人／${state.days}日分`,
      `飲料・調理用水：${result.waterLiters}L（2Lボトル${result.bottles}本）`,
      `携帯トイレ：${result.toilets}回分`, `主食：${result.meals}食分`,
      '生活用水・おかず・個別の必需品は別途。乳幼児も同じ係数の簡易目安です。',
      ...(state.infants ? ['乳幼児：ミルク・離乳食・おむつなどを別途確認。'] : []),
      ...(state.pets ? ['ペット：水・フード・トイレ用品などを別途確認（計算には含みません）。'] : []),
      '目安であり、自治体の指示と各家庭の事情を優先してください。'].join('\n');
  }

  const api = Object.freeze({ DEFAULTS, calculate, readQuery, writeQuery, formatResult });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Bichiku = api;
  if (typeof document === 'undefined') return;
  const form = document.getElementById('bichiku-form');
  if (!form) return;
  const initial = readQuery(location.search);
  for (const key of ['adults', 'children', 'infants', 'days']) form.elements[key].value = String(initial[key]);
  form.elements.pets.checked = initial.pets;
  const error = document.getElementById('input-error');
  const copy = document.getElementById('copy-result');
  const copyStatus = document.getElementById('copy-status');
  const manual = document.getElementById('manual-copy');
  let current = null;

  function update(syncUrl = true) {
    copyStatus.textContent = '';
    manual.hidden = true;
    document.getElementById('manual-copy-label').hidden = true;
    try {
      if (!form.checkValidity()) throw new RangeError('人数は0〜999、日数は1〜365の整数で入力してください。');
      current = normalize({ adults: form.elements.adults.valueAsNumber, children: form.elements.children.valueAsNumber,
        infants: form.elements.infants.valueAsNumber, days: form.elements.days.valueAsNumber, pets: form.elements.pets.checked });
      const result = calculate(current);
      for (const key of ['waterLiters', 'bottles', 'toilets', 'meals']) document.getElementById(key).textContent = result[key].toLocaleString('ja-JP');
      document.getElementById('result-context').textContent = `${result.people}人 × ${result.days}日分`;
      document.getElementById('infant-note').hidden = !result.needsInfantSupplies;
      document.getElementById('pet-note').hidden = !result.needsPetSupplies;
      error.textContent = '';
      copy.disabled = false;
      for (const button of document.querySelectorAll('[data-days]')) button.setAttribute('aria-pressed', String(Number(button.dataset.days) === current.days));
      if (syncUrl) history.replaceState(null, '', `${location.pathname}?${writeQuery(current, location.search)}${location.hash}`);
    } catch (failure) {
      current = null;
      error.textContent = failure.message;
      copy.disabled = true;
      for (const key of ['waterLiters', 'bottles', 'toilets', 'meals']) document.getElementById(key).textContent = '—';
      document.getElementById('result-context').textContent = '入力内容を確認してください';
    }
  }
  form.addEventListener('input', () => update());
  form.addEventListener('submit', event => event.preventDefault());
  for (const button of document.querySelectorAll('[data-days]')) button.addEventListener('click', () => {
    form.elements.days.value = button.dataset.days;
    update();
  });
  window.addEventListener('popstate', () => {
    const state = readQuery(location.search);
    for (const key of ['adults', 'children', 'infants', 'days']) form.elements[key].value = String(state[key]);
    form.elements.pets.checked = state.pets;
    update(false);
  });
  copy.addEventListener('click', async () => {
    if (!current) return;
    const text = formatResult(current) + '\n' + location.href;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = '結果と共有URLをコピーしました。';
    } catch (_failure) {
      manual.hidden = false;
      document.getElementById('manual-copy-label').hidden = false;
      manual.value = text;
      manual.focus();
      manual.select();
      copyStatus.textContent = 'コピーできない場合は、選択された結果を手動でコピーしてください。';
    }
  });
  update(false);
})(typeof globalThis !== 'undefined' ? globalThis : this);
