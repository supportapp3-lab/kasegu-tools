/* Daily-use quantities only: no standard feeding or diaper assumptions. */
(function (root) {
  'use strict';
  const emptyChild = () => ({ name: '', powderGrams: 0, liquidUnits: 0, waterMl: 0, diapers: 0, wipes: 0, foodUnits: 0 });
  const LIMITS = Object.freeze({ powderGrams: 100000, liquidUnits: 10000, waterMl: 1000000, diapers: 10000, wipes: 10000, foodUnits: 10000 });
  const NUMBERS = Object.keys(LIMITS);
  const COUNTS = ['liquidUnits', 'diapers', 'wipes', 'foodUnits'];
  const round = value => Math.round((value + Number.EPSILON) * 1000000) / 1000000;
  const ceil = value => {
    const nearest = Math.round(value);
    return nearest > 0 && Math.abs(value - nearest) <= Number.EPSILON * Math.max(1, Math.abs(value)) * 8 ? nearest : Math.ceil(value);
  };

  function normalize(input) {
    if (!input || !Number.isSafeInteger(input.days) || input.days < 1 || input.days > 60) throw new RangeError('日数は1〜60の整数で入力してください。');
    if (!Array.isArray(input.children) || input.children.length < 1 || input.children.length > 10) throw new RangeError('お子さんは1〜10人分を入力してください。');
    const children = input.children.map(child => {
      if (!child || typeof child.name !== 'string' || child.name.length > 80) throw new TypeError('呼び名は80文字以内で入力してください。');
      const copy = { name: child.name };
      for (const key of NUMBERS) {
        const value = child[key];
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > LIMITS[key] ||
            (COUNTS.includes(key) && !Number.isSafeInteger(value)) || Math.abs(value * 1000 - Math.round(value * 1000)) > 0.00001) {
          throw new RangeError('普段の1日量を0以上で入力してください。粉ミルクg・水mlは小数3桁まで、枚数・本数・個数は整数です。');
        }
        copy[key] = value;
      }
      if (copy.powderGrams > 0 && copy.waterMl === 0) throw new RangeError('粉ミルクを入力した場合は、普段の調乳・湯冷まし用水も入力してください。');
      return copy;
    });
    return { days: input.days, children };
  }

  function calculate(input) {
    const state = normalize(input);
    const children = state.children.map(child => {
      const powderGrams = round(child.powderGrams * state.days);
      const waterLiters = round(child.waterMl * state.days / 1000);
      return { name: child.name, powderGrams, powderKg: round(powderGrams / 1000), liquidUnits: child.liquidUnits * state.days,
        waterLiters, bottles: ceil(waterLiters / 2), diapers: child.diapers * state.days, wipes: child.wipes * state.days, foodUnits: child.foodUnits * state.days };
    });
    const total = children.reduce((sum, child) => ({ powderGrams: round(sum.powderGrams + child.powderGrams), liquidUnits: sum.liquidUnits + child.liquidUnits,
      waterLiters: round(sum.waterLiters + child.waterLiters), diapers: sum.diapers + child.diapers, wipes: sum.wipes + child.wipes, foodUnits: sum.foodUnits + child.foodUnits }),
    { powderGrams: 0, liquidUnits: 0, waterLiters: 0, diapers: 0, wipes: 0, foodUnits: 0 });
    total.powderKg = round(total.powderGrams / 1000);
    total.bottles = ceil(total.waterLiters / 2);
    return { days: state.days, children, total };
  }

  function writeQuery(input) {
    const state = normalize(input);
    const params = new URLSearchParams({ days: String(state.days) });
    params.set('children', JSON.stringify(state.children.map(child => NUMBERS.map(key => child[key]))));
    return params.toString();
  }

  function readQuery(query) {
    const params = new URLSearchParams(query);
    const rawDays = params.get('days');
    const days = rawDays !== null && /^\d+$/.test(rawDays) && Number(rawDays) >= 1 && Number(rawDays) <= 60 ? Number(rawDays) : 7;
    try {
      const raw = params.get('children');
      if (!raw || raw.length > 10000) throw new Error('invalid children');
      const rows = JSON.parse(raw);
      if (!Array.isArray(rows) || !rows.length || rows.length > 10) throw new Error('invalid rows');
      const children = rows.map(row => {
        if (!Array.isArray(row) || row.length !== NUMBERS.length) throw new Error('invalid row');
        return { name: '', ...Object.fromEntries(NUMBERS.map((key, i) => [key, row[i]])) };
      });
      return normalize({ days, children });
    } catch (_error) { return { days, children: [emptyChild()] }; }
  }

  function describe(child) {
    return `粉ミルク${child.powderGrams}g（${child.powderKg}kg）、液体ミルク${child.liquidUnits}本／缶、調乳・湯冷まし用水${child.waterLiters}L（2Lボトル${child.bottles}本）、おむつ${child.diapers}枚、おしりふき${child.wipes}枚、離乳食${child.foodUnits}個／食`;
  }

  function formatResult(input) {
    const result = calculate(input);
    return ['赤ちゃん向け防災用品の備蓄目安', `${result.children.length}人／${result.days}日分`,
      ...result.children.map((child, i) => `${i + 1}人目${child.name ? '（' + child.name + '）' : ''}：${describe(child)}`), `合計：${describe(result.total)}`,
      '入力した普段の1日量×日数です。授乳量・育児方法を決める結果ではありません。洗浄・消毒の水は別途。授乳・離乳・アレルギー・病状は医師・助産師等へ相談し、自治体・避難所のルールを優先してください。'].join('\n');
  }

  const api = Object.freeze({ calculate, readQuery, writeQuery, formatResult, emptyChild });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BabyBichiku = api;
  if (typeof document === 'undefined') return;
  const form = document.getElementById('baby-form');
  if (!form) return;
  const rows = document.getElementById('baby-rows');
  const add = document.getElementById('add-child');
  const copy = document.getElementById('copy-result');
  const manual = document.getElementById('manual-copy');
  const manualLabel = document.getElementById('manual-copy-label');
  const copyStatus = document.getElementById('copy-status');
  const RESULT_KEYS = ['powderGrams', 'powderKg', 'liquidUnits', 'waterLiters', 'bottles', 'diapers', 'wipes', 'foodUnits'];
  let current = null;
  let nextId = 0;

  function numberRows() {
    const items = [...rows.children];
    items.forEach((node, i) => {
      node.querySelector('legend').textContent = `${i + 1}人目`;
      const remove = node.querySelector('[data-remove]');
      remove.disabled = items.length === 1;
      remove.setAttribute('aria-label', `${i + 1}人目を削除`);
    });
    add.disabled = items.length >= 10;
  }

  function addRow(child) {
    const node = document.getElementById('baby-template').content.firstElementChild.cloneNode(true);
    const id = ++nextId;
    for (const label of node.querySelectorAll('label[data-field]')) label.htmlFor = `baby-${id}-${label.dataset.field}`;
    for (const control of node.querySelectorAll('[data-key]')) {
      control.id = `baby-${id}-${control.dataset.key}`;
      control.value = String(child[control.dataset.key]);
    }
    node.querySelector('[data-remove]').addEventListener('click', () => { node.remove(); numberRows(); add.focus(); update(); });
    rows.append(node);
    numberRows();
    return node;
  }

  function showState(state) {
    rows.replaceChildren();
    form.elements.days.value = state.days;
    state.children.forEach(addRow);
  }

  function update(syncUrl = true) {
    manual.hidden = true;
    manualLabel.hidden = true;
    copyStatus.textContent = '';
    const resultList = document.getElementById('child-results');
    resultList.replaceChildren();
    try {
      if (!form.checkValidity()) throw new RangeError('日数と数量を入力欄の範囲内で入力してください。使わない品目は0にします。');
      const children = [...rows.children].map(node => Object.fromEntries([...node.querySelectorAll('[data-key]')].map(control =>
        [control.dataset.key, NUMBERS.includes(control.dataset.key) ? control.valueAsNumber : control.value])));
      current = normalize({ days: form.elements.days.valueAsNumber, children });
      const result = calculate(current);
      for (const key of RESULT_KEYS) document.getElementById(key).textContent = result.total[key].toLocaleString('ja-JP', { maximumFractionDigits: 6 });
      result.children.forEach((child, i) => {
        const item = document.createElement('li');
        item.textContent = `${i + 1}人目${child.name ? '（' + child.name + '）' : ''}：${describe(child)}`;
        resultList.append(item);
      });
      document.getElementById('result-context').textContent = `${result.children.length}人 × ${result.days}日分（入力した分のみ）`;
      document.getElementById('input-error').textContent = '';
      copy.disabled = false;
      if (syncUrl) history.replaceState(null, '', `${location.pathname}?${writeQuery(current)}${location.hash}`);
    } catch (error) {
      current = null;
      document.getElementById('input-error').textContent = error.message;
      document.getElementById('result-context').textContent = '入力内容を確認してください';
      copy.disabled = true;
      for (const key of RESULT_KEYS) document.getElementById(key).textContent = '—';
      if (syncUrl) history.replaceState(null, '', location.pathname + location.hash);
    }
    for (const button of form.querySelectorAll('[data-days]')) button.setAttribute('aria-pressed', String(Number(button.dataset.days) === form.elements.days.valueAsNumber));
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => update());
  add.addEventListener('click', () => {
    if (rows.children.length >= 10) return;
    const node = addRow(emptyChild());
    node.querySelector('[data-key="name"]').focus();
    update();
  });
  for (const button of form.querySelectorAll('[data-days]')) button.addEventListener('click', () => { form.elements.days.value = button.dataset.days; update(); });
  window.addEventListener('popstate', () => { showState(readQuery(location.search)); update(false); });
  copy.addEventListener('click', async () => {
    if (!current) return;
    const text = formatResult(current) + '\n' + location.href;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('manual copy');
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = '結果と共有URLをコピーしました。呼び名は文章に含まれますが、URLには含まれません。';
    } catch (_error) {
      manual.hidden = false;
      manualLabel.hidden = false;
      manual.value = text;
      manual.focus();
      manual.select();
      copyStatus.textContent = '選択された文章を手動でコピーしてください。文章には入力した呼び名が含まれます。';
    }
  });
  showState(readQuery(location.search));
  update();
})(typeof globalThis !== 'undefined' ? globalThis : this);
