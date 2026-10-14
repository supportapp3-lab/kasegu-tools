/* Pure stock-and-pack arithmetic with a dependency-free browser controller. */
(function (root) {
  'use strict';
  const DEFAULTS = Object.freeze({ people: 1, frequency: 5, days: 7, stock: 0, packSize: null });
  const LIMITS = Object.freeze({ people: [1, 20], frequency: [1, 20], days: [1, 60], stock: [0, Number.MAX_SAFE_INTEGER] });

  function normalize(input) {
    if (!input || typeof input !== 'object') throw new TypeError('人数・回数・日数・在庫を入力してください。');
    const state = {};
    for (const [key, [min, max]] of Object.entries(LIMITS)) {
      if (!Number.isSafeInteger(input[key]) || input[key] < min || input[key] > max) {
        throw new RangeError('人数・1日回数は1〜20、日数は1〜60の整数、在庫は0以上の整数で入力してください。');
      }
      state[key] = input[key];
    }
    if (input.packSize !== null && (!Number.isSafeInteger(input.packSize) || input.packSize < 1)) throw new RangeError('1パックの回数は1以上の整数にするか、空欄にしてください。');
    state.packSize = input.packSize;
    return state;
  }

  function calculate(input) {
    const state = normalize(input);
    const perPerson = state.frequency * state.days;
    const perDay = state.people * state.frequency;
    const needed = state.people * perPerson;
    const shortage = Math.max(0, needed - state.stock);
    return { needed, shortage, packs: state.packSize === null ? null : Math.ceil(shortage / state.packSize), perPerson, perDay };
  }

  function readQuery(query) {
    const params = new URLSearchParams(query);
    const state = { ...DEFAULTS };
    for (const [key, [min, max]] of Object.entries(LIMITS)) {
      const raw = params.get(key);
      if (raw !== null && /^\d+$/.test(raw)) {
        const value = Number(raw);
        if (Number.isSafeInteger(value) && value >= min && value <= max) state[key] = value;
      }
    }
    const rawPack = params.get('packSize');
    if (rawPack !== null && /^\d+$/.test(rawPack) && Number.isSafeInteger(Number(rawPack)) && Number(rawPack) > 0) state.packSize = Number(rawPack);
    return state;
  }

  function writeQuery(input) {
    const state = normalize(input);
    const params = new URLSearchParams();
    for (const key of Object.keys(LIMITS)) params.set(key, String(state[key]));
    if (state.packSize !== null) params.set('packSize', String(state.packSize));
    return params.toString();
  }

  function formatResult(input) {
    const state = normalize(input);
    const result = calculate(state);
    return ['携帯トイレの備蓄目安', `${state.people}人 × 1人1日${state.frequency}回 × ${state.days}日`,
      `必要回数：${result.needed}回分`, `手元の在庫：${state.stock}回分／不足：${result.shortage}回分`,
      ...(result.packs === null ? [] : [`購入予定の製品：1パック${state.packSize}回分／不足分のパック数：${result.packs}パック`]),
      `1人あたり：${result.perPerson}回分（期間全体）／1日あたり：${result.perDay}回分（全員）`,
      '体調・年齢で回数は異なります。自治体・管理組合・避難所のルールを優先し、処理袋・凝固剤・使用済みの保管場所も確認してください。'].join('\n');
  }

  const api = Object.freeze({ DEFAULTS, calculate, readQuery, writeQuery, formatResult });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ToiletBichiku = api;
  if (typeof document === 'undefined') return;
  const form = document.getElementById('toilet-form');
  if (!form) return;
  const copy = document.getElementById('copy-result');
  const manual = document.getElementById('manual-copy');
  const manualLabel = document.getElementById('manual-copy-label');
  const copyStatus = document.getElementById('copy-status');
  let current = null;

  function showState(state) {
    for (const key of Object.keys(DEFAULTS)) form.elements[key].value = state[key] === null ? '' : String(state[key]);
  }

  function update(syncUrl = true) {
    manual.hidden = true;
    manualLabel.hidden = true;
    copyStatus.textContent = '';
    try {
      if (!form.checkValidity()) throw new RangeError('人数・回数・日数を範囲内の整数で入力してください。在庫は0以上、パック回数は1以上または空欄です。');
      current = normalize({ people: form.elements.people.valueAsNumber, frequency: form.elements.frequency.valueAsNumber,
        days: form.elements.days.valueAsNumber, stock: form.elements.stock.value === '' ? 0 : form.elements.stock.valueAsNumber,
        packSize: form.elements.packSize.value === '' ? null : form.elements.packSize.valueAsNumber });
      const result = calculate(current);
      for (const key of ['needed', 'shortage', 'perPerson', 'perDay']) document.getElementById(key).textContent = result[key].toLocaleString('ja-JP');
      document.getElementById('packs').textContent = result.packs === null ? '—' : result.packs.toLocaleString('ja-JP');
      document.getElementById('pack-result').hidden = result.packs === null;
      document.getElementById('pack-note').hidden = result.packs !== null;
      document.getElementById('result-context').textContent = `${current.people}人 × ${current.frequency}回 × ${current.days}日（在庫${current.stock}回分）`;
      document.getElementById('input-error').textContent = '';
      copy.disabled = false;
      if (syncUrl) history.replaceState(null, '', `${location.pathname}?${writeQuery(current)}${location.hash}`);
    } catch (error) {
      current = null;
      document.getElementById('input-error').textContent = error.message;
      document.getElementById('result-context').textContent = '入力内容を確認してください';
      copy.disabled = true;
      for (const key of ['needed', 'shortage', 'perPerson', 'perDay', 'packs']) document.getElementById(key).textContent = '—';
      document.getElementById('pack-result').hidden = true;
      document.getElementById('pack-note').hidden = true;
      if (syncUrl) history.replaceState(null, '', location.pathname + location.hash);
    }
    for (const button of form.querySelectorAll('[data-days]')) button.setAttribute('aria-pressed', String(Number(button.dataset.days) === form.elements.days.valueAsNumber));
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => update());
  for (const button of form.querySelectorAll('[data-days]')) button.addEventListener('click', () => { form.elements.days.value = button.dataset.days; update(); });
  window.addEventListener('popstate', () => { showState(readQuery(location.search)); update(false); });
  copy.addEventListener('click', async () => {
    if (!current) return;
    const text = formatResult(current) + '\n' + location.href;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('manual copy');
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = '結果と共有URLをコピーしました。';
    } catch (_error) {
      manual.hidden = false;
      manualLabel.hidden = false;
      manual.value = text;
      manual.focus();
      manual.select();
      copyStatus.textContent = '選択された文章を手動でコピーしてください。';
    }
  });
  showState(readQuery(location.search));
  update();
})(typeof globalThis !== 'undefined' ? globalThis : this);
