/* Pure, dependency-free aquarium volume calculation and browser controller. */
(function (root) {
  'use strict';

  const MAX_WIDTH_CM = 300;
  const MAX_DEPTH_CM = 150;
  const MAX_HEIGHT_CM = 150;
  const MAX_SUBSTRATE_CM = 30;
  const MAX_BAG_LITERS = 100;
  const DEFAULTS = Object.freeze({
    widthCm: null,
    depthCm: null,
    heightCm: null,
    substrateCm: null,
    bagLiters: null,
    memo: ''
  });

  function numberValue(value) {
    if (value == null || value === '' || (typeof value !== 'number' && typeof value !== 'string')) return NaN;
    const number = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  function toTenths(value, label, max, allowZero) {
    const number = numberValue(value);
    const scaled = number * 10;
    const units = Math.round(scaled);
    if (!Number.isFinite(number) || !Number.isSafeInteger(units)
        || Math.abs(scaled - units) > 1e-7
        || (allowZero ? number < 0 : number <= 0) || number > max) {
      const rule = allowZero ? '0以上' : '0より大きく';
      throw new RangeError(label + 'は' + rule + '、' + max + 'cm以下で0.1cm単位で入力してください。');
    }
    return units;
  }

  function optionalTenths(value, label, max, zeroOmits) {
    if (value == null || value === '') return null;
    const number = numberValue(value);
    if (zeroOmits && number === 0) return null;
    return toTenths(value, label, max, true);
  }

  function normalize(input) {
    if (!input || typeof input !== 'object') throw new TypeError('入力内容を確認してください。');
    const widthUnits = toTenths(input.widthCm, '内側の幅', MAX_WIDTH_CM, false);
    const depthUnits = toTenths(input.depthCm, '内側の奥行', MAX_DEPTH_CM, false);
    const heightUnits = toTenths(input.heightCm, '内側の高さ', MAX_HEIGHT_CM, false);
    const substrateUnits = optionalTenths(input.substrateCm, '底砂の厚み', MAX_SUBSTRATE_CM, true);
    let bagUnits = null;
    if (input.bagLiters != null && input.bagLiters !== '') {
      const bag = numberValue(input.bagLiters);
      const scaled = bag * 10;
      bagUnits = Math.round(scaled);
      if (!Number.isFinite(bag) || !Number.isSafeInteger(bagUnits)
          || Math.abs(scaled - bagUnits) > 1e-7 || bag <= 0 || bag > MAX_BAG_LITERS) {
        throw new RangeError('底砂の袋容量は0より大きく' + MAX_BAG_LITERS + 'L以下で入力してください。');
      }
    }
    const memo = input.memo == null ? '' : input.memo;
    if (typeof memo !== 'string' || memo.length > 200) throw new RangeError('出典メモは200文字以内で入力してください。');
    return {
      widthCm: widthUnits / 10,
      depthCm: depthUnits / 10,
      heightCm: heightUnits / 10,
      substrateCm: substrateUnits == null ? null : substrateUnits / 10,
      bagLiters: bagUnits == null ? null : bagUnits / 10,
      memo
    };
  }

  function ceilDivide(numerator, denominator) {
    return Math.floor((numerator + denominator - 1) / denominator);
  }

  function calculate(input) {
    const state = normalize(input);
    const widthUnits = Math.round(state.widthCm * 10);
    const depthUnits = Math.round(state.depthCm * 10);
    const heightUnits = Math.round(state.heightCm * 10);
    const volumeProduct = widthUnits * depthUnits * heightUnits;
    const waterLiters = volumeProduct / 1000000;
    let substrateLiters = null;
    let bagCount = null;
    if (state.substrateCm != null) {
      const substrateUnits = Math.round(state.substrateCm * 10);
      const substrateProduct = widthUnits * depthUnits * substrateUnits;
      substrateLiters = substrateProduct / 1000000;
      if (state.bagLiters != null) {
        const bagUnits = Math.round(state.bagLiters * 10);
        bagCount = ceilDivide(substrateProduct, 100000 * bagUnits);
      }
    }
    return { ...state, waterLiters, substrateLiters, bagCount };
  }

  function readQuery(query) {
    const params = new URLSearchParams(query || '');
    if (!['width', 'depth', 'height', 'substrate', 'bag'].some(key => params.has(key))) return { ...DEFAULTS };
    try {
      return normalize({
        widthCm: params.get('width'),
        depthCm: params.get('depth'),
        heightCm: params.get('height'),
        substrateCm: params.get('substrate'),
        bagLiters: params.get('bag'),
        memo: ''
      });
    } catch (_error) {
      return { ...DEFAULTS };
    }
  }

  function writeQuery(input) {
    const state = normalize(input);
    const params = new URLSearchParams();
    params.set('width', String(state.widthCm));
    params.set('depth', String(state.depthCm));
    params.set('height', String(state.heightCm));
    if (state.substrateCm != null) params.set('substrate', String(state.substrateCm));
    if (state.bagLiters != null) params.set('bag', String(state.bagLiters));
    return params.toString();
  }

  function formatNumber(value) {
    return value.toLocaleString('ja-JP', { maximumFractionDigits: 3 });
  }

  function formatResult(input) {
    const result = calculate(input);
    const lines = [
      '入力条件：内側の幅 ' + formatNumber(result.widthCm) + 'cm × 奥行 ' + formatNumber(result.depthCm)
        + 'cm × 水面までの高さ ' + formatNumber(result.heightCm) + 'cm',
      '理論上の水容量：' + formatNumber(result.waterLiters) + 'L'
    ];
    if (result.substrateLiters != null) {
      lines.push('理論上の底砂容量：' + formatNumber(result.substrateLiters) + 'L');
      if (result.bagCount != null) lines.push('容量だけから計算した最小袋数：' + result.bagCount + '袋');
    }
    lines.push('手持ちの底砂で足りるなら購入は不要です。');
    return lines.join('\n');
  }

  const api = Object.freeze({
    DEFAULTS,
    MAX_WIDTH_CM,
    MAX_DEPTH_CM,
    MAX_HEIGHT_CM,
    MAX_SUBSTRATE_CM,
    MAX_BAG_LITERS,
    calculate,
    normalize,
    readQuery,
    writeQuery,
    formatResult
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AquariumVolume = api;
  if (typeof document === 'undefined') return;

  const form = document.getElementById('aquarium-volume-form');
  if (!form) return;
  const error = document.getElementById('input-error');
  const summary = document.getElementById('result-summary');
  const resultInputs = document.getElementById('result-inputs');
  const waterVolume = document.getElementById('result-water-volume');
  const substrateRow = document.getElementById('substrate-result');
  const substrateVolume = document.getElementById('result-substrate-volume');
  const bagRow = document.getElementById('bag-result');
  const bagCount = document.getElementById('result-bag-count');

  function fieldValue(name) {
    const field = form.elements.namedItem(name);
    return field ? field.value : '';
  }

  function currentState() {
    return {
      widthCm: fieldValue('width'),
      depthCm: fieldValue('depth'),
      heightCm: fieldValue('height'),
      substrateCm: fieldValue('substrate'),
      bagLiters: fieldValue('bag'),
      memo: fieldValue('memo')
    };
  }

  function clearResult() {
    summary.hidden = true;
    resultInputs.textContent = '';
    waterVolume.textContent = '—';
    substrateRow.hidden = true;
    substrateVolume.textContent = '—';
    bagRow.hidden = true;
    bagCount.textContent = '—';
  }

  function setForm(state) {
    for (const [name, value] of Object.entries({
      width: state.widthCm,
      depth: state.depthCm,
      height: state.heightCm,
      substrate: state.substrateCm,
      bag: state.bagLiters
    })) {
      form.elements.namedItem(name).value = value == null ? '' : String(value);
    }
    form.elements.namedItem('memo').value = '';
  }

  function update(syncUrl) {
    try {
      const result = calculate(currentState());
      error.textContent = '';
      resultInputs.textContent = '幅 ' + formatNumber(result.widthCm) + 'cm × 奥行 '
        + formatNumber(result.depthCm) + 'cm × 水面までの高さ ' + formatNumber(result.heightCm) + 'cm';
      waterVolume.textContent = formatNumber(result.waterLiters);
      substrateRow.hidden = result.substrateLiters == null;
      substrateVolume.textContent = result.substrateLiters == null ? '—' : formatNumber(result.substrateLiters);
      bagRow.hidden = result.bagCount == null;
      bagCount.textContent = result.bagCount == null ? '—' : String(result.bagCount);
      summary.hidden = false;
      if (syncUrl !== false) history.replaceState(null, '', location.pathname + '?' + writeQuery(result) + location.hash);
    } catch (problem) {
      error.textContent = problem.message;
      clearResult();
      if (syncUrl !== false) history.replaceState(null, '', location.pathname + location.hash);
    }
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => update());
  window.addEventListener('popstate', () => {
    setForm(readQuery(location.search));
    update(false);
  });
  setForm(readQuery(location.search));
  update(false);
})(typeof globalThis !== 'undefined' ? globalThis : this);
