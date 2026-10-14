/* Pure pet supply calculations and a dependency-free browser controller. */
(function (root) {
  'use strict';
  const emptyPet = () => ({ kind: 'dog', name: '', foodGrams: 0, waterMl: 0, sheets: 0, litterLiters: 0, bagGrams: 0 });
  const LIMITS = Object.freeze({ foodGrams: 100000, waterMl: 1000000, sheets: 1000, litterLiters: 1000, bagGrams: 1000000 });
  const KINDS = Object.freeze({ dog: '犬', cat: '猫', other: 'その他' });
  const NUMBERS = Object.keys(LIMITS);
  const round = value => Math.round((value + Number.EPSILON) * 1000000) / 1000000;
  // Subtract only floating-point noise before rounding up (e.g. 0.1 * 3 / 0.3).
  const ceil = value => {
    const nearest = Math.round(value);
    return nearest > 0 && Math.abs(value - nearest) <= Number.EPSILON * Math.max(1, Math.abs(value)) * 8 ? nearest : Math.ceil(value);
  };

  function normalize(input) {
    if (!input || !Number.isSafeInteger(input.days) || input.days < 1 || input.days > 60) throw new RangeError('日数は1〜60の整数で入力してください。');
    if (!Array.isArray(input.pets) || input.pets.length < 1 || input.pets.length > 10) throw new RangeError('ペットは1〜10頭分を入力してください。');
    const pets = input.pets.map(pet => {
      if (!pet || !Object.hasOwn(KINDS, pet.kind)) throw new TypeError('種類は犬・猫・その他から選んでください。');
      if (typeof pet.name !== 'string' || pet.name.length > 80) throw new TypeError('名前は80文字以内で入力してください。');
      const copy = { kind: pet.kind, name: pet.name };
      for (const key of NUMBERS) {
        const value = pet[key];
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > LIMITS[key] ||
            (key === 'sheets' && !Number.isSafeInteger(value)) || Math.abs(value * 1000 - Math.round(value * 1000)) > 0.00001 ||
            ((key === 'foodGrams' || key === 'waterMl') && value < 0.001)) {
          throw new RangeError('フード・水には普段の1日量を入力してください。数量は小数3桁まで、シーツは整数で入力してください。');
        }
        copy[key] = value;
      }
      return copy;
    });
    return { days: input.days, pets };
  }

  function calculate(input) {
    const state = normalize(input);
    const pets = state.pets.map(pet => {
      const foodGrams = round(pet.foodGrams * state.days);
      const waterLiters = round(pet.waterMl * state.days / 1000);
      return { kind: pet.kind, name: pet.name, foodGrams, foodKg: round(foodGrams / 1000),
        bags: pet.bagGrams ? ceil(foodGrams / pet.bagGrams) : null, waterLiters,
        bottles: ceil(waterLiters / 2), sheets: pet.sheets * state.days, litterLiters: round(pet.litterLiters * state.days) };
    });
    const total = pets.reduce((sum, pet) => ({ foodGrams: round(sum.foodGrams + pet.foodGrams), waterLiters: round(sum.waterLiters + pet.waterLiters),
      sheets: sum.sheets + pet.sheets, litterLiters: round(sum.litterLiters + pet.litterLiters) }), { foodGrams: 0, waterLiters: 0, sheets: 0, litterLiters: 0 });
    total.foodKg = round(total.foodGrams / 1000);
    total.bottles = ceil(total.waterLiters / 2);
    return { days: state.days, pets, total };
  }

  function writeQuery(input) {
    const state = normalize(input);
    // Build a fresh query: names and unrelated personal parameters are never preserved.
    const params = new URLSearchParams({ days: String(state.days) });
    params.set('pets', JSON.stringify(state.pets.map(pet => [pet.kind, ...NUMBERS.map(key => pet[key])])));
    return params.toString();
  }

  function readQuery(query) {
    const params = new URLSearchParams(query);
    let days = 7;
    const rawDays = params.get('days');
    if (rawDays !== null && /^\d+$/.test(rawDays) && Number(rawDays) >= 1 && Number(rawDays) <= 60) days = Number(rawDays);
    try {
      const raw = params.get('pets');
      if (!raw || raw.length > 10000) throw new Error('no valid pet state');
      const rows = JSON.parse(raw);
      if (!Array.isArray(rows) || !rows.length || rows.length > 10) throw new Error('invalid rows');
      const pets = rows.map(row => {
        if (!Array.isArray(row) || row.length !== NUMBERS.length + 1) throw new Error('invalid row');
        return { kind: row[0], name: '', ...Object.fromEntries(NUMBERS.map((key, i) => [key, row[i + 1]])) };
      });
      return normalize({ days, pets });
    } catch (_error) {
      return { days, pets: [emptyPet()] };
    }
  }

  function formatResult(input) {
    const result = calculate(input);
    const lines = ['ペットの防災備蓄の目安', `${result.pets.length}頭／${result.days}日分`];
    result.pets.forEach((pet, i) => lines.push(`${i + 1}. ${KINDS[pet.kind]}${pet.name ? '（' + pet.name + '）' : ''}：フード${pet.foodGrams}g（${pet.foodKg}kg${pet.bags === null ? '' : '・' + pet.bags + '袋'}）、水${pet.waterLiters}L（2Lボトル${pet.bottles}本）、シーツ${pet.sheets}枚・猫砂${pet.litterLiters}L`));
    const total = result.total;
    lines.push(`合計：フード${total.foodGrams}g（${total.foodKg}kg）、水${total.waterLiters}L（2Lボトル${total.bottles}本）、シーツ${total.sheets}枚・猫砂${total.litterLiters}L`,
      '普段の1日量×日数の目安です。洗浄用水や薬は別途。療法食・持病は獣医師に相談し、自治体・避難所のルールを優先してください。');
    return lines.join('\n');
  }

  const api = Object.freeze({ calculate, readQuery, writeQuery, formatResult, emptyPet });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PetBichiku = api;
  if (typeof document === 'undefined') return;
  const form = document.getElementById('pet-form');
  if (!form) return;
  const rows = document.getElementById('pet-rows');
  const add = document.getElementById('add-pet');
  const copy = document.getElementById('copy-result');
  const manual = document.getElementById('manual-copy');
  const manualLabel = document.getElementById('manual-copy-label');
  const copyStatus = document.getElementById('copy-status');
  let current = null;
  let nextId = 0;

  function addRow(pet) {
    const node = document.getElementById('pet-template').content.firstElementChild.cloneNode(true);
    const id = ++nextId;
    for (const label of node.querySelectorAll('label[data-field]')) label.htmlFor = `pet-${id}-${label.dataset.field}`;
    for (const control of node.querySelectorAll('[data-key]')) {
      const key = control.dataset.key;
      control.id = `pet-${id}-${key}`;
      control.value = ((key === 'foodGrams' || key === 'waterMl') && !pet[key]) ? '' : String(pet[key]);
    }
    node.querySelector('[data-remove]').addEventListener('click', () => {
      node.remove();
      numberRows();
      add.focus();
      update();
    });
    rows.append(node);
    numberRows();
    return node;
  }

  function numberRows() {
    const items = [...rows.children];
    items.forEach((node, i) => {
      node.querySelector('legend').textContent = `${i + 1}頭目`;
      const remove = node.querySelector('[data-remove]');
      remove.disabled = items.length === 1;
      remove.setAttribute('aria-label', `${i + 1}頭目を削除`);
    });
    add.disabled = items.length >= 10;
  }

  function showState(state) {
    rows.replaceChildren();
    form.elements.days.value = state.days;
    state.pets.forEach(addRow);
  }

  function update(syncUrl = true) {
    manual.hidden = true;
    manualLabel.hidden = true;
    copyStatus.textContent = '';
    const resultList = document.getElementById('pet-results');
    resultList.replaceChildren();
    try {
      if (!form.checkValidity()) throw new RangeError('普段のフード量・飲水量と、1〜60日の日数を入力してください。');
      const pets = [...rows.children].map(node => Object.fromEntries([...node.querySelectorAll('[data-key]')].map(control => {
        const key = control.dataset.key;
        return [key, NUMBERS.includes(key) ? (control.value === '' ? 0 : control.valueAsNumber) : control.value];
      })));
      current = normalize({ days: form.elements.days.valueAsNumber, pets });
      const result = calculate(current);
      for (const key of ['foodGrams', 'foodKg', 'waterLiters', 'bottles', 'sheets', 'litterLiters']) document.getElementById(key).textContent = result.total[key].toLocaleString('ja-JP', { maximumFractionDigits: 6 });
      result.pets.forEach((pet, i) => {
        const item = document.createElement('li');
        item.textContent = `${i + 1}頭目 ${KINDS[pet.kind]}${pet.name ? '（' + pet.name + '）' : ''}：フード ${pet.foodGrams}g / ${pet.foodKg}kg${pet.bags === null ? '（袋容量未指定）' : ' / ' + pet.bags + '袋'}、水 ${pet.waterLiters}L / 2Lボトル${pet.bottles}本、シーツ ${pet.sheets}枚、猫砂 ${pet.litterLiters}L`;
        resultList.append(item);
      });
      document.getElementById('result-context').textContent = `${result.pets.length}頭 × ${result.days}日分`;
      document.getElementById('input-error').textContent = '';
      copy.disabled = false;
      if (syncUrl) history.replaceState(null, '', `${location.pathname}?${writeQuery(current)}${location.hash}`);
    } catch (error) {
      current = null;
      document.getElementById('input-error').textContent = error.message;
      document.getElementById('result-context').textContent = '入力後に必要量を表示します';
      copy.disabled = true;
      for (const key of ['foodGrams', 'foodKg', 'waterLiters', 'bottles', 'sheets', 'litterLiters']) document.getElementById(key).textContent = '—';
      // Do not leave the previous valid quantities in a shareable URL after an invalid edit.
      if (syncUrl) history.replaceState(null, '', location.pathname + location.hash);
    }
    for (const button of form.querySelectorAll('[data-days]')) button.setAttribute('aria-pressed', String(Number(button.dataset.days) === form.elements.days.valueAsNumber));
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => update());
  form.addEventListener('change', () => update());
  add.addEventListener('click', () => {
    if (rows.children.length >= 10) return;
    const node = addRow(emptyPet());
    node.querySelector('[data-key="kind"]').focus();
    update();
  });
  for (const button of form.querySelectorAll('[data-days]')) button.addEventListener('click', () => {
    form.elements.days.value = button.dataset.days;
    update();
  });
  window.addEventListener('popstate', () => { showState(readQuery(location.search)); update(false); });
  copy.addEventListener('click', async () => {
    if (!current) return;
    const text = formatResult(current) + '\n' + location.href;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('manual copy');
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = '結果と共有URLをコピーしました。名前は文章に含まれますが、URLには含まれません。';
    } catch (_error) {
      manual.hidden = false;
      manualLabel.hidden = false;
      manual.value = text;
      manual.focus();
      manual.select();
      copyStatus.textContent = '選択された文章を手動でコピーしてください。共有する文章には名前が含まれます。';
    }
  });
  showState(readQuery(location.search));
  update();
})(typeof globalThis !== 'undefined' ? globalThis : this);
