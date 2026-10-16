/* Pure, dependency-free calculation and browser controller for the planter soil tool. */
(function (root) {
  'use strict';

  const MAX_DIMENSION_CM = 10000;
  const MAX_CAPACITY_LITERS = 1000000;
  const DEFAULTS = Object.freeze({
    mode: 'dimensions',
    lengthCm: null,
    widthCm: null,
    depthCm: null,
    containerLiters: null,
    bagLiters: null
  });

  function defaultState() {
    return { ...DEFAULTS };
  }

  function numberValue(value) {
    if (value == null || value === '') return NaN;
    const number = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  function requireRange(value, min, max, label) {
    if (!Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(label + 'は' + min + 'より大きく' + max + '以下で入力してください。');
    }
    return value;
  }

  function normalize(input) {
    if (!input || typeof input !== 'object') throw new TypeError('入力内容を確認してください。');
    if (input.mode !== 'dimensions' && input.mode !== 'labeled') {
      throw new TypeError('計算方法を選択してください。');
    }
    const bagLiters = requireRange(
      numberValue(input.bagLiters), 0, MAX_CAPACITY_LITERS, '袋の表示容量'
    );
    let lengthCm = null;
    let widthCm = null;
    let depthCm = null;
    let containerLiters = null;
    if (input.mode === 'dimensions') {
      lengthCm = requireRange(numberValue(input.lengthCm), 0, MAX_DIMENSION_CM, '内側の長さ');
      widthCm = requireRange(numberValue(input.widthCm), 0, MAX_DIMENSION_CM, '内側の幅');
      depthCm = requireRange(numberValue(input.depthCm), 0, MAX_DIMENSION_CM, '土を入れる深さ');
    } else {
      containerLiters = requireRange(
        numberValue(input.containerLiters), 0, MAX_CAPACITY_LITERS, '容器の表示容量'
      );
    }
    return { mode: input.mode, lengthCm, widthCm, depthCm, containerLiters, bagLiters };
  }

  function roundLiters(value) {
    return Number(value.toFixed(3));
  }

  function calculate(input) {
    const state = normalize(input);
    const volumeLiters = state.mode === 'dimensions'
      ? (state.lengthCm * state.widthCm * state.depthCm) / 1000
      : state.containerLiters;
    if (!Number.isFinite(volumeLiters) || volumeLiters <= 0) {
      throw new RangeError('容量を計算できません。入力値を確認してください。');
    }
    return {
      ...state,
      volumeLiters: roundLiters(volumeLiters),
      bagCount: Math.ceil(volumeLiters / state.bagLiters)
    };
  }

  function readQuery(query) {
    const params = new URLSearchParams(query || '');
    if (!params.has('mode') && !params.has('bag')) return defaultState();
    try {
      return normalize({
        mode: params.get('mode'),
        lengthCm: params.get('length'),
        widthCm: params.get('width'),
        depthCm: params.get('depth'),
        containerLiters: params.get('container'),
        bagLiters: params.get('bag')
      });
    } catch (_error) {
      return defaultState();
    }
  }

  function writeQuery(input) {
    const state = normalize(input);
    const params = new URLSearchParams();
    params.set('mode', state.mode);
    if (state.mode === 'dimensions') {
      params.set('length', String(state.lengthCm));
      params.set('width', String(state.widthCm));
      params.set('depth', String(state.depthCm));
    } else {
      params.set('container', String(state.containerLiters));
    }
    params.set('bag', String(state.bagLiters));
    return params.toString();
  }

  function formatNumber(value) {
    return value.toLocaleString('ja-JP', { maximumFractionDigits: 3 });
  }

  function formatResult(input) {
    const result = calculate(input);
    const method = result.mode === 'dimensions' ? '寸法による直方体近似' : '容器の表示容量';
    return [
      '計算方法：' + method,
      '幾何上の容量：' + formatNumber(result.volumeLiters) + 'L',
      '入力した袋の表示容量：' + formatNumber(result.bagLiters) + 'L',
      '容量だけから計算した最小袋数：' + result.bagCount + '袋',
      '実際の必要量は容器の形状・排水・栽培条件で異なります。不足がなければ購入は不要です。'
    ].join('\n');
  }

  const api = Object.freeze({
    DEFAULTS,
    MAX_DIMENSION_CM,
    MAX_CAPACITY_LITERS,
    calculate,
    normalize,
    readQuery,
    writeQuery,
    formatResult
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PlanterSoil = api;
  if (typeof document === 'undefined') return;

  const form = document.getElementById('planter-soil-form');
  if (!form) return;
  const modeInputs = Array.from(form.querySelectorAll('input[name="mode"]'));
  const dimensionFields = document.getElementById('dimension-fields');
  const labeledFields = document.getElementById('labeled-fields');
  const error = document.getElementById('input-error');
  const result = document.getElementById('result-summary');
  const resultMethod = document.getElementById('result-method');
  const resultVolume = document.getElementById('result-volume');
  const resultBag = document.getElementById('result-bag');
  const resultCount = document.getElementById('result-count');

  function fieldValue(name) {
    const field = form.elements.namedItem(name);
    return field ? field.value : '';
  }

  function currentState() {
    return {
      mode: modeInputs.find(input => input.checked)?.value || '',
      lengthCm: fieldValue('length'),
      widthCm: fieldValue('width'),
      depthCm: fieldValue('depth'),
      containerLiters: fieldValue('container'),
      bagLiters: fieldValue('bag')
    };
  }

  function setMode(mode) {
    const dimensions = mode === 'dimensions';
    dimensionFields.hidden = !dimensions;
    labeledFields.hidden = dimensions;
    dimensionFields.querySelectorAll('input').forEach(input => { input.required = dimensions; });
    labeledFields.querySelectorAll('input').forEach(input => { input.required = !dimensions; });
  }

  function showBlankResult() {
    result.hidden = true;
    resultMethod.textContent = '—';
    resultVolume.textContent = '—';
    resultBag.textContent = '—';
    resultCount.textContent = '—';
  }

  function update(syncUrl) {
    const state = currentState();
    setMode(state.mode);
    try {
      const normalized = normalize(state);
      const calculated = calculate(normalized);
      error.textContent = '';
      resultMethod.textContent = normalized.mode === 'dimensions' ? '寸法による直方体近似' : '容器の表示容量';
      resultVolume.textContent = formatNumber(calculated.volumeLiters);
      resultBag.textContent = formatNumber(normalized.bagLiters);
      resultCount.textContent = String(calculated.bagCount);
      result.hidden = false;
      if (syncUrl !== false) {
        history.replaceState(null, '', location.pathname + '?' + writeQuery(normalized) + location.hash);
      }
    } catch (problem) {
      error.textContent = problem.message;
      showBlankResult();
      if (syncUrl !== false) history.replaceState(null, '', location.pathname + location.hash);
    }
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => update());
  modeInputs.forEach(input => input.addEventListener('change', () => update()));
  window.addEventListener('popstate', () => {
    const state = readQuery(location.search);
    modeInputs.forEach(input => { input.checked = input.value === state.mode; });
    form.elements.namedItem('length').value = state.lengthCm == null ? '' : String(state.lengthCm);
    form.elements.namedItem('width').value = state.widthCm == null ? '' : String(state.widthCm);
    form.elements.namedItem('depth').value = state.depthCm == null ? '' : String(state.depthCm);
    form.elements.namedItem('container').value = state.containerLiters == null ? '' : String(state.containerLiters);
    form.elements.namedItem('bag').value = state.bagLiters == null ? '' : String(state.bagLiters);
    update(false);
  });

  const initial = readQuery(location.search);
  modeInputs.forEach(input => { input.checked = input.value === initial.mode; });
  form.elements.namedItem('length').value = initial.lengthCm == null ? '' : String(initial.lengthCm);
  form.elements.namedItem('width').value = initial.widthCm == null ? '' : String(initial.widthCm);
  form.elements.namedItem('depth').value = initial.depthCm == null ? '' : String(initial.depthCm);
  form.elements.namedItem('container').value = initial.containerLiters == null ? '' : String(initial.containerLiters);
  form.elements.namedItem('bag').value = initial.bagLiters == null ? '' : String(initial.bagLiters);
  update(false);
})(typeof globalThis !== 'undefined' ? globalThis : this);
