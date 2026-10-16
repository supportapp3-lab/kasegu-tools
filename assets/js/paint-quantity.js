/* Pure, dependency-free calculation and browser controller for paint quantity. */
(function (root) {
  'use strict';

  const MAX_SURFACES = 20;
  const MAX_AREA_SQUARE_METERS = 10000;
  const MAX_COATS = 10;
  const MAX_COVERAGE_PER_CAN = 10000;
  const MAX_MEMO_LENGTH = 200;
  const DEFAULTS = Object.freeze({
    areas: Object.freeze([null]),
    coats: null,
    coveragePerCan: null,
    memo: ''
  });

  function defaultState() {
    return { areas: [...DEFAULTS.areas], coats: DEFAULTS.coats, coveragePerCan: DEFAULTS.coveragePerCan, memo: '' };
  }

  function numberValue(value) {
    if (value == null || value === '' || (typeof value !== 'number' && typeof value !== 'string')) return NaN;
    const number = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  function requireRange(value, min, max, label) {
    if (!Number.isFinite(value) || value <= min || value > max) {
      throw new RangeError(label + 'は' + min + 'より大きく' + max + '以下で入力してください。');
    }
    return value;
  }

  function normalize(input) {
    if (!input || typeof input !== 'object' || !Array.isArray(input.areas)
        || input.areas.length < 1 || input.areas.length > MAX_SURFACES) {
      throw new TypeError('塗る面は1〜' + MAX_SURFACES + '面で入力してください。');
    }
    const areas = input.areas.map((area, index) => requireRange(
      numberValue(area), 0, MAX_AREA_SQUARE_METERS, '面' + (index + 1) + 'の面積'
    ));
    const coats = numberValue(input.coats);
    if (!Number.isSafeInteger(coats) || coats < 1 || coats > MAX_COATS) {
      throw new RangeError('塗り回数は1〜' + MAX_COATS + '回の整数で入力してください。');
    }
    const coveragePerCan = requireRange(
      numberValue(input.coveragePerCan), 0, MAX_COVERAGE_PER_CAN, '1缶当たりの塗り面積'
    );
    const memo = input.memo == null ? '' : input.memo;
    if (typeof memo !== 'string' || memo.length > MAX_MEMO_LENGTH) {
      throw new RangeError('出典メモは' + MAX_MEMO_LENGTH + '文字以内で入力してください。');
    }
    return { areas, coats, coveragePerCan, memo };
  }

  function roundArea(value) {
    return Number(value.toFixed(3));
  }

  function calculate(input) {
    const state = normalize(input);
    const totalArea = state.areas.reduce((sum, area) => sum + area, 0);
    const requiredCoatArea = totalArea * state.coats;
    if (!Number.isFinite(totalArea) || !Number.isFinite(requiredCoatArea) || requiredCoatArea <= 0) {
      throw new RangeError('面積を計算できません。入力値を確認してください。');
    }
    return {
      ...state,
      totalArea: roundArea(totalArea),
      requiredCoatArea: roundArea(requiredCoatArea),
      canCount: Math.ceil(requiredCoatArea / state.coveragePerCan)
    };
  }

  function readQuery(query) {
    const params = new URLSearchParams(query || '');
    if (!params.has('areas') && !params.has('coats') && !params.has('coverage')) return defaultState();
    try {
      const areas = JSON.parse(params.get('areas') || 'null');
      return normalize({
        areas,
        coats: params.get('coats'),
        coveragePerCan: params.get('coverage'),
        memo: ''
      });
    } catch (_error) {
      return defaultState();
    }
  }

  function writeQuery(input) {
    const state = normalize(input);
    const params = new URLSearchParams();
    params.set('areas', JSON.stringify(state.areas));
    params.set('coats', String(state.coats));
    params.set('coverage', String(state.coveragePerCan));
    return params.toString();
  }

  function formatNumber(value) {
    return value.toLocaleString('ja-JP', { maximumFractionDigits: 3 });
  }

  function formatResult(input) {
    const result = calculate(input);
    return [
      '塗る面積の合計：' + formatNumber(result.totalArea) + '㎡',
      '塗り回数：' + result.coats + '回',
      '必要な塗り面積：' + formatNumber(result.requiredCoatArea) + '㎡',
      '入力した1缶当たりの塗り面積：' + formatNumber(result.coveragePerCan) + '㎡/回/缶',
      '容量だけから計算した最小缶数：' + result.canCount + '缶',
      '手持ちの塗料で足りるなら購入は不要です。'
    ].join('\n');
  }

  const api = Object.freeze({
    DEFAULTS,
    MAX_SURFACES,
    MAX_AREA_SQUARE_METERS,
    MAX_COATS,
    MAX_COVERAGE_PER_CAN,
    MAX_MEMO_LENGTH,
    calculate,
    normalize,
    readQuery,
    writeQuery,
    formatResult
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PaintQuantity = api;
  if (typeof document === 'undefined') return;

  const form = document.getElementById('paint-quantity-form');
  if (!form) return;
  const surfaceList = document.getElementById('surface-list');
  const addButton = document.getElementById('add-surface');
  const error = document.getElementById('input-error');
  const result = document.getElementById('result-summary');
  const resultTotalArea = document.getElementById('result-total-area');
  const resultCoats = document.getElementById('result-coats');
  const resultRequiredArea = document.getElementById('result-required-area');
  const resultCoverage = document.getElementById('result-coverage');
  const resultCans = document.getElementById('result-cans');
  let nextSurfaceId = 0;

  function renderSurface(area, index, count) {
    const rowId = nextSurfaceId++;
    const row = document.createElement('fieldset');
    row.className = 'surface-row';
    const legend = document.createElement('legend');
    legend.textContent = '塗る面 ' + (index + 1);
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const id = 'surface-area-' + rowId;
    label.htmlFor = id;
    label.textContent = '面積（㎡）';
    input.id = id;
    input.name = 'surface-area';
    input.dataset.field = 'area';
    input.type = 'number';
    input.inputMode = 'decimal';
    input.min = '0.01';
    input.max = String(MAX_AREA_SQUARE_METERS);
    input.step = 'any';
    input.required = true;
    input.value = area == null ? '' : String(area);
    wrapper.append(label, input);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button remove-surface';
    remove.textContent = 'この面を削除';
    remove.disabled = count <= 1;
    row.append(legend, wrapper, remove);
    surfaceList.append(row);
  }

  function showSurfaces(areas) {
    nextSurfaceId = 0;
    surfaceList.replaceChildren();
    areas.forEach((area, index) => renderSurface(area, index, areas.length));
    addButton.disabled = areas.length >= MAX_SURFACES;
  }

  function fieldValue(name) {
    const field = form.elements.namedItem(name);
    return field ? field.value : '';
  }

  function currentState() {
    return {
      areas: Array.from(surfaceList.querySelectorAll('.surface-row [data-field="area"]'), input => input.value),
      coats: fieldValue('coats'),
      coveragePerCan: fieldValue('coverage'),
      memo: fieldValue('memo')
    };
  }

  function showBlankResult() {
    result.hidden = true;
    resultTotalArea.textContent = '—';
    resultCoats.textContent = '—';
    resultRequiredArea.textContent = '—';
    resultCoverage.textContent = '—';
    resultCans.textContent = '—';
  }

  function update(syncUrl) {
    const state = currentState();
    try {
      const normalized = normalize(state);
      const calculated = calculate(normalized);
      error.textContent = '';
      resultTotalArea.textContent = formatNumber(calculated.totalArea);
      resultCoats.textContent = String(calculated.coats);
      resultRequiredArea.textContent = formatNumber(calculated.requiredCoatArea);
      resultCoverage.textContent = formatNumber(calculated.coveragePerCan);
      resultCans.textContent = String(calculated.canCount);
      result.hidden = false;
      if (syncUrl !== false) {
        history.replaceState(null, '', location.pathname + '?' + writeQuery(normalized) + location.hash);
      }
    } catch (problem) {
      error.textContent = problem.message;
      showBlankResult();
      if (syncUrl !== false) history.replaceState(null, '', location.pathname + location.hash);
    }
    const rows = surfaceList.querySelectorAll('.surface-row');
    rows.forEach(row => {
      const button = row.querySelector('.remove-surface');
      if (button) button.disabled = rows.length <= 1;
    });
    addButton.disabled = rows.length >= MAX_SURFACES;
  }

  surfaceList.addEventListener('click', event => {
    const button = event.target.closest('.remove-surface');
    if (!button || surfaceList.querySelectorAll('.surface-row').length <= 1) return;
    button.closest('.surface-row').remove();
    Array.from(surfaceList.querySelectorAll('.surface-row legend')).forEach((legend, index) => {
      legend.textContent = '塗る面 ' + (index + 1);
    });
    update();
  });
  addButton.addEventListener('click', () => {
    const rows = surfaceList.querySelectorAll('.surface-row');
    if (rows.length >= MAX_SURFACES) return;
    renderSurface(null, rows.length, rows.length + 1);
    update();
  });
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => update());
  window.addEventListener('popstate', () => {
    const state = readQuery(location.search);
    showSurfaces(state.areas);
    form.elements.namedItem('coats').value = state.coats == null ? '' : String(state.coats);
    form.elements.namedItem('coverage').value = state.coveragePerCan == null ? '' : String(state.coveragePerCan);
    form.elements.namedItem('memo').value = '';
    update(false);
  });

  const initial = readQuery(location.search);
  showSurfaces(initial.areas);
  form.elements.namedItem('coats').value = initial.coats == null ? '' : String(initial.coats);
  form.elements.namedItem('coverage').value = initial.coveragePerCan == null ? '' : String(initial.coveragePerCan);
  form.elements.namedItem('memo').value = '';
  update(false);
})(typeof globalThis !== 'undefined' ? globalThis : this);
