/* User-defined food-stock difference calculator; values stay in page memory only. */
(function (root) {
  'use strict';

  const MAX_ROWS = 20;
  const MAX_NAME_LENGTH = 40;
  const MAX_UNIT_LENGTH = 12;
  const MAX_QUANTITY = 1000000;

  function invalid(reason) {
    return { valid: false, reason };
  }

  function normalizeQuantity(value, label) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(label + 'を数値で入力してください。');
    }
    if (value < 0) throw new RangeError(label + 'は0以上で入力してください。');
    if (value > MAX_QUANTITY) throw new RangeError(label + 'は1,000,000以下で入力してください。');
    const hundredths = Math.round(value * 100);
    if (Math.abs(value * 100 - hundredths) > 1e-7) {
      throw new RangeError(label + 'は小数点以下2桁まで入力できます。');
    }
    return hundredths / 100;
  }

  function normalizeRow(input) {
    if (!input || typeof input !== 'object') return invalid('入力内容を確認してください。');
    const name = typeof input.name === 'string' ? input.name.trim() : '';
    if (!name) return invalid('品目名を入力してください。');
    if (name.length > MAX_NAME_LENGTH) return invalid('品目名は40文字以内で入力してください。');
    const unit = typeof input.unit === 'string' ? input.unit.trim() : '';
    if (!unit) return invalid('記録の単位を入力してください。');
    if (unit.length > MAX_UNIT_LENGTH) return invalid('単位は12文字以内で入力してください。');

    try {
      const target = normalizeQuantity(input.target, '目標数量');
      const stock = normalizeQuantity(input.stock, '現在使える在庫');
      const shortage = Math.max(Math.round((target - stock) * 100) / 100, 0);
      return {
        valid: true,
        name,
        unit,
        target,
        stock,
        shortage,
        hasShortage: shortage > 0
      };
    } catch (error) {
      return invalid(error.message);
    }
  }

  function calculateRows(rows) {
    if (!Array.isArray(rows) || rows.length < 1 || rows.length > MAX_ROWS) {
      throw new RangeError('品目は1〜20行で整理してください。');
    }
    return rows.map(normalizeRow);
  }

  function formatQuantity(value) {
    return value.toLocaleString('ja-JP', { maximumFractionDigits: 2 });
  }

  function formatRow(row) {
    if (!row.valid) return '入力エラー：' + row.reason;
    const detail = row.name + '：目標 ' + formatQuantity(row.target) + ' ' + row.unit
      + ' ／ 現在使える在庫 ' + formatQuantity(row.stock) + ' ' + row.unit;
    if (row.hasShortage) {
      return detail + ' ／ 不足あり（不足 ' + formatQuantity(row.shortage) + ' ' + row.unit + '）';
    }
    return detail + ' ／ 不足なし（買い足しは不要です）';
  }

  function formatResult(rows) {
    return calculateRows(rows).map((row, index) => '行' + (index + 1) + '：' + formatRow(row)).join('\n');
  }

  const api = Object.freeze({ MAX_ROWS, calculateRows, formatResult, normalizeRow });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CustomFoodStock = api;
  if (typeof document === 'undefined') return;

  const list = document.getElementById('custom-food-stock-list');
  const addButton = document.getElementById('custom-food-stock-add');
  const results = document.getElementById('custom-food-stock-results');
  const form = document.getElementById('custom-food-stock-form');
  if (!list || !addButton || !results || !form) return;

  let nextId = 0;

  function numericValue(row, field) {
    const raw = row.querySelector('[data-field="' + field + '"]').value;
    return raw === '' ? NaN : Number(raw);
  }

  function renderRow(index, count) {
    const row = document.createElement('fieldset');
    row.className = 'food-stock-row';
    const legend = document.createElement('legend');
    legend.textContent = '食品 ' + (index + 1);
    const fields = document.createElement('div');
    fields.className = 'field-grid';

    [
      ['品目名', 'name', 'text', 40],
      ['記録の単位', 'unit', 'text', 12],
      ['目標数量（0以上・小数点以下2桁まで）', 'target', 'number', 1000000],
      ['現在使える在庫（同じ単位）', 'stock', 'number', 1000000]
    ].forEach(([labelText, field, type, maxLengthOrValue]) => {
      const wrapper = document.createElement('div');
      const label = document.createElement('label');
      const input = document.createElement('input');
      const id = 'food-stock-' + field + '-' + nextId;
      label.htmlFor = id;
      label.textContent = labelText;
      input.id = id;
      input.dataset.field = field;
      input.type = type;
      input.required = true;
      if (type === 'number') {
        input.min = '0';
        input.max = String(maxLengthOrValue);
        input.step = '0.01';
        input.inputMode = 'decimal';
      } else {
        input.maxLength = maxLengthOrValue;
        input.autocomplete = 'off';
      }
      wrapper.append(label, input);
      fields.append(wrapper);
    });
    nextId++;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button';
    remove.textContent = 'この行を削除';
    remove.disabled = count <= 1;
    remove.addEventListener('click', () => {
      if (list.querySelectorAll('.food-stock-row').length <= 1) return;
      row.remove();
      update();
    });
    row.append(legend, fields, remove);
    list.append(row);
  }

  function update() {
    const rows = Array.from(list.querySelectorAll('.food-stock-row')).map(row => ({
      name: row.querySelector('[data-field="name"]').value,
      unit: row.querySelector('[data-field="unit"]').value,
      target: numericValue(row, 'target'),
      stock: numericValue(row, 'stock')
    }));
    const calculated = calculateRows(rows);
    results.replaceChildren();
    calculated.forEach((result, index) => {
      const item = document.createElement('li');
      item.textContent = '行' + (index + 1) + '：' + formatRow(result);
      if (!result.valid) item.className = 'error';
      results.append(item);
    });
    const rowCount = list.querySelectorAll('.food-stock-row').length;
    addButton.disabled = rowCount >= MAX_ROWS;
    list.querySelectorAll('.food-stock-row button').forEach(button => {
      button.disabled = rowCount <= 1;
    });
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  addButton.addEventListener('click', () => {
    const count = list.querySelectorAll('.food-stock-row').length;
    if (count >= MAX_ROWS) return;
    renderRow(count, count + 1);
    update();
  });
  showInitialRow();

  function showInitialRow() {
    nextId = 0;
    list.replaceChildren();
    renderRow(0, 1);
    update();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
