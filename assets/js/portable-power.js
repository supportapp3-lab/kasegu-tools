/* Pure, dependency-free calculation and browser controller for the portable-power tool. */
(function (root) {
  'use strict';

  const MAX_ITEMS = 20;
  const MAX_NAME_LENGTH = 40;
  const MAX_WATTS = 100000;
  const MAX_HOURS_PER_DAY = 24;
  const MAX_DAYS = 365;
  const DEFAULTS = Object.freeze({
    items: Object.freeze([{ name: '', watts: null, hoursPerDay: null, days: null }])
  });

  function defaultState() {
    return { items: DEFAULTS.items.map(item => ({ ...item })) };
  }

  function normalize(input) {
    if (!input || typeof input !== 'object' || !Array.isArray(input.items)
        || input.items.length < 1 || input.items.length > MAX_ITEMS) {
      throw new TypeError('機器は1〜20行で入力してください。');
    }
    const items = input.items.map(item => {
      if (!item || typeof item !== 'object') throw new TypeError('機器の入力を確認してください。');
      const name = item.name == null ? '' : item.name;
      if (typeof name !== 'string' || name.length > MAX_NAME_LENGTH) {
        throw new RangeError('機器名は40文字以内で入力してください。');
      }
      if (typeof item.watts !== 'number' || !Number.isFinite(item.watts)
          || item.watts <= 0 || item.watts > MAX_WATTS) {
        throw new RangeError('消費電力は0より大きく100,000W以下で入力してください。');
      }
      if (typeof item.hoursPerDay !== 'number' || !Number.isFinite(item.hoursPerDay)
          || item.hoursPerDay <= 0 || item.hoursPerDay > MAX_HOURS_PER_DAY) {
        throw new RangeError('使用時間は0より大きく24時間以下で入力してください。');
      }
      if (!Number.isSafeInteger(item.days) || item.days < 1 || item.days > MAX_DAYS) {
        throw new RangeError('日数は1〜365日の整数で入力してください。');
      }
      return {
        name: name.trim(),
        watts: item.watts,
        hoursPerDay: item.hoursPerDay,
        days: item.days
      };
    });
    return { items };
  }

  function roundWh(value) {
    return Number(value.toFixed(2));
  }

  function calculate(input) {
    const state = normalize(input);
    const items = state.items.map(item => ({
      ...item,
      wh: roundWh(item.watts * item.hoursPerDay * item.days)
    }));
    return { items, totalWh: roundWh(items.reduce((sum, item) => sum + item.wh, 0)) };
  }

  function readQuery(query) {
    const params = new URLSearchParams(query || '');
    const raw = params.get('items');
    if (raw === null) return defaultState();
    try {
      return normalize({ items: JSON.parse(raw) });
    } catch (_error) {
      return defaultState();
    }
  }

  function writeQuery(input) {
    const state = normalize(input);
    const params = new URLSearchParams();
    params.set('items', JSON.stringify(state.items));
    return params.toString();
  }

  function formatNumber(value) {
    return value.toLocaleString('ja-JP', { maximumFractionDigits: 2 });
  }

  function formatResult(input) {
    const result = calculate(input);
    const lines = ['理想上の電力量整理（Wh）'];
    result.items.forEach((item, index) => {
      const name = item.name || ('機器' + (index + 1));
      lines.push(name + '：' + formatNumber(item.watts) + 'W × '
        + formatNumber(item.hoursPerDay) + '時間/日 × ' + item.days + '日 = '
        + formatNumber(item.wh) + 'Wh');
    });
    lines.push('理想上の負荷合計：' + formatNumber(result.totalWh) + 'Wh');
    lines.push('これは入力した条件の理想上の負荷整理です。実際の使用量や使える電力量を示すものではありません。');
    return lines.join('\n');
  }

  const api = Object.freeze({ DEFAULTS, MAX_ITEMS, calculate, normalize, readQuery, writeQuery, formatResult });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PortablePower = api;
  if (typeof document === 'undefined') return;

  const form = document.getElementById('portable-power-form');
  if (!form) return;
  const list = document.getElementById('appliance-list');
  const addButton = document.getElementById('add-appliance');
  const error = document.getElementById('input-error');
  const output = document.getElementById('result-items');
  const total = document.getElementById('total-wh');
  const copyButton = document.getElementById('copy-result');
  const copyStatus = document.getElementById('copy-status');
  const manualCopy = document.getElementById('manual-copy');
  const manualCopyLabel = document.getElementById('manual-copy-label');
  let current = null;
  let nextRowId = 0;

  function makeField(labelText, field, type, value, max, step, rowId) {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const id = field + '-' + rowId;
    label.htmlFor = id;
    label.textContent = labelText;
    input.id = id;
    input.type = type;
    input.dataset.field = field;
    input.value = value == null ? '' : String(value);
    if (type === 'number') {
      input.min = field === 'days' ? '1' : '0.01';
      input.max = String(max);
      input.step = step;
      input.required = true;
      input.inputMode = 'decimal';
    } else {
      input.maxLength = MAX_NAME_LENGTH;
      input.autocomplete = 'off';
    }
    wrapper.append(label, input);
    return wrapper;
  }

  function renderRow(item, index, count) {
    const rowId = nextRowId++;
    const row = document.createElement('fieldset');
    row.className = 'appliance-row';
    const legend = document.createElement('legend');
    legend.textContent = '機器 ' + (index + 1);
    const fields = document.createElement('div');
    fields.className = 'field-grid';
    fields.append(
      makeField('機器名（任意）', 'name', 'text', item.name, null, null, rowId),
      makeField('消費電力（W）', 'watts', 'number', item.watts, MAX_WATTS, 'any', rowId),
      makeField('使用時間（時間/日）', 'hoursPerDay', 'number', item.hoursPerDay, MAX_HOURS_PER_DAY, 'any', rowId),
      makeField('日数', 'days', 'number', item.days, MAX_DAYS, '1', rowId)
    );
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button';
    remove.textContent = 'この行を削除';
    remove.disabled = count <= 1;
    remove.addEventListener('click', () => {
      if (list.querySelectorAll('.appliance-row').length <= 1) return;
      row.remove();
      update();
    });
    row.append(legend, fields, remove);
    list.append(row);
  }

  function showState(state) {
    nextRowId = 0;
    list.replaceChildren();
    state.items.forEach((item, index) => renderRow(item, index, state.items.length));
    addButton.disabled = state.items.length >= MAX_ITEMS;
  }

  function formState() {
    const rows = Array.from(list.querySelectorAll('.appliance-row'));
    return {
      items: rows.map(row => {
        const value = field => row.querySelector('[data-field="' + field + '"]').value;
        return {
          name: value('name'),
          watts: value('watts') === '' ? NaN : Number(value('watts')),
          hoursPerDay: value('hoursPerDay') === '' ? NaN : Number(value('hoursPerDay')),
          days: value('days') === '' ? NaN : Number(value('days'))
        };
      })
    };
  }

  function update(syncUrl) {
    const shouldSyncUrl = syncUrl !== false;
    copyStatus.textContent = '';
    manualCopy.hidden = true;
    manualCopyLabel.hidden = true;
    try {
      const state = normalize(formState());
      const result = calculate(state);
      current = state;
      output.replaceChildren();
      result.items.forEach((item, index) => {
        const line = document.createElement('li');
        const name = item.name || ('機器' + (index + 1));
        line.textContent = name + '：' + formatNumber(item.watts) + 'W × '
          + formatNumber(item.hoursPerDay) + '時間/日 × ' + item.days + '日 = '
          + formatNumber(item.wh) + 'Wh';
        output.append(line);
      });
      total.textContent = formatNumber(result.totalWh);
      error.textContent = '';
      copyButton.disabled = false;
      if (shouldSyncUrl) {
        history.replaceState(null, '', location.pathname + '?' + writeQuery(state) + location.hash);
      }
    } catch (problem) {
      current = null;
      error.textContent = problem.message;
      output.replaceChildren();
      total.textContent = '—';
      copyButton.disabled = true;
      if (shouldSyncUrl) history.replaceState(null, '', location.pathname + location.hash);
    }
    addButton.disabled = list.querySelectorAll('.appliance-row').length >= MAX_ITEMS;
    const rows = list.querySelectorAll('.appliance-row');
    rows.forEach(row => {
      const button = row.querySelector('button');
      if (button) button.disabled = rows.length <= 1;
    });
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => update());
  addButton.addEventListener('click', () => {
    const rows = list.querySelectorAll('.appliance-row');
    if (rows.length >= MAX_ITEMS) return;
    renderRow({ name: '', watts: null, hoursPerDay: null, days: null }, rows.length, rows.length + 1);
    update();
  });
  window.addEventListener('popstate', () => {
    showState(readQuery(location.search));
    update(false);
  });
  copyButton.addEventListener('click', async () => {
    if (!current) return;
    const text = formatResult(current) + '\n' + location.href;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('manual copy');
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = '結果と共有URLをコピーしました。';
    } catch (_error) {
      manualCopy.hidden = false;
      manualCopyLabel.hidden = false;
      manualCopy.value = text;
      manualCopy.focus();
      manualCopy.select();
      copyStatus.textContent = '選択された文章を手動でコピーしてください。';
    }
  });

  showState(readQuery(location.search));
  update(false);
})(typeof globalThis !== 'undefined' ? globalThis : this);
