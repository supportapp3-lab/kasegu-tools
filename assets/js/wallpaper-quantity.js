/* Pure, dependency-free calculation and browser controller for wallpaper quantity. */
(function (root) {
  'use strict';

  const MAX_WALL_WIDTH_CM = 2000;
  const MAX_WALL_HEIGHT_CM = 500;
  const MIN_USABLE_WIDTH_CM = 30;
  const MAX_USABLE_WIDTH_CM = 200;
  const MAX_REPEAT_CM = 200;
  const MAX_ALLOWANCE_CM = 50;
  const MAX_ROLL_LENGTH_M = 100;
  const MAX_MEMO_LENGTH = 200;
  const DEFAULTS = Object.freeze({
    wallWidthCm: null,
    wallHeightCm: null,
    usableWidthCm: null,
    repeatCm: 0,
    allowanceCm: 0,
    rollLengthM: null,
    memo: ''
  });

  function defaultState() {
    return { ...DEFAULTS };
  }

  function numberValue(value) {
    if (value == null || value === '' || (typeof value !== 'number' && typeof value !== 'string')) return NaN;
    const number = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  function toTenths(value, label, min, max, allowZero) {
    const number = numberValue(value);
    const scaled = number * 10;
    const units = Math.round(scaled);
    if (!Number.isFinite(number) || !Number.isSafeInteger(units)
        || Math.abs(scaled - units) > 1e-7
        || (allowZero ? number < min : number <= min) || number > max) {
      const lower = allowZero ? min : min + 'より大きく';
      throw new RangeError(label + 'は' + lower + '、' + max + '以下で0.1cm単位で入力してください。');
    }
    return units;
  }

  function normalize(input) {
    if (!input || typeof input !== 'object') throw new TypeError('入力内容を確認してください。');
    const wallWidthUnits = toTenths(input.wallWidthCm, '壁の幅', 0, MAX_WALL_WIDTH_CM, false);
    const wallHeightUnits = toTenths(input.wallHeightCm, '壁の高さ', 0, MAX_WALL_HEIGHT_CM, false);
    const usableWidthCm = numberValue(input.usableWidthCm);
    if (!Number.isFinite(usableWidthCm) || usableWidthCm < MIN_USABLE_WIDTH_CM
        || usableWidthCm > MAX_USABLE_WIDTH_CM) {
      throw new RangeError('製品の有効幅は' + MIN_USABLE_WIDTH_CM + '〜' + MAX_USABLE_WIDTH_CM + 'cmで入力してください。');
    }
    const usableWidthUnits = toTenths(usableWidthCm, '製品の有効幅', MIN_USABLE_WIDTH_CM, MAX_USABLE_WIDTH_CM, false);
    const repeatUnits = toTenths(input.repeatCm == null || input.repeatCm === '' ? 0 : input.repeatCm,
      '柄リピート', 0, MAX_REPEAT_CM, true);
    const allowanceUnits = toTenths(input.allowanceCm == null || input.allowanceCm === '' ? 0 : input.allowanceCm,
      '上下の切りしろ', 0, MAX_ALLOWANCE_CM, true);
    let rollLengthM = null;
    if (input.rollLengthM != null && input.rollLengthM !== '') {
      const meters = numberValue(input.rollLengthM);
      const units = Math.round(meters * 10000);
      if (!Number.isFinite(meters) || !Number.isSafeInteger(units)
          || Math.abs(meters * 10000 - units) > 1e-7 || meters <= 0 || meters > MAX_ROLL_LENGTH_M) {
        throw new RangeError('ロール長は0より大きく' + MAX_ROLL_LENGTH_M + 'm以下で入力してください。');
      }
      rollLengthM = units / 10000;
    }
    const memo = input.memo == null ? '' : input.memo;
    if (typeof memo !== 'string' || memo.length > MAX_MEMO_LENGTH) {
      throw new RangeError('出典メモは' + MAX_MEMO_LENGTH + '文字以内で入力してください。');
    }
    return {
      wallWidthCm: wallWidthUnits / 10,
      wallHeightCm: wallHeightUnits / 10,
      usableWidthCm: usableWidthUnits / 10,
      repeatCm: repeatUnits / 10,
      allowanceCm: allowanceUnits / 10,
      rollLengthM,
      memo
    };
  }

  function ceilDivide(numerator, denominator) {
    return Math.floor((numerator + denominator - 1) / denominator);
  }

  function calculate(input) {
    const state = normalize(input);
    const wallWidthUnits = Math.round(state.wallWidthCm * 10);
    const wallHeightUnits = Math.round(state.wallHeightCm * 10);
    const usableWidthUnits = Math.round(state.usableWidthCm * 10);
    const repeatUnits = Math.round(state.repeatCm * 10);
    const allowanceUnits = Math.round(state.allowanceCm * 10);
    const stripCount = ceilDivide(wallWidthUnits, usableWidthUnits);
    const baseLengthUnits = wallHeightUnits + allowanceUnits;
    const cutLengthUnits = repeatUnits === 0
      ? baseLengthUnits
      : ceilDivide(baseLengthUnits, repeatUnits) * repeatUnits;
    const totalLengthUnits = stripCount * cutLengthUnits;
    if (!Number.isSafeInteger(totalLengthUnits) || totalLengthUnits <= 0) {
      throw new RangeError('必要な長さを計算できません。入力値を確認してください。');
    }
    let stripsPerRoll = null;
    let rollCount = null;
    let rollTooShort = false;
    if (state.rollLengthM != null) {
      const rollLengthUnits = Math.round(state.rollLengthM * 10000);
      stripsPerRoll = Math.floor(rollLengthUnits / cutLengthUnits);
      if (stripsPerRoll < 1) {
        stripsPerRoll = 0;
        rollTooShort = true;
      } else {
        rollCount = ceilDivide(stripCount, stripsPerRoll);
      }
    }
    return {
      ...state,
      stripCount,
      cutLengthCm: cutLengthUnits / 10,
      totalLengthM: totalLengthUnits / 1000,
      totalLengthMDisplay: Math.ceil(totalLengthUnits / 100) / 10,
      stripsPerRoll,
      rollCount,
      rollTooShort
    };
  }

  function readQuery(query) {
    const params = new URLSearchParams(query || '');
    if (!['width', 'height', 'usable', 'repeat', 'allowance', 'roll'].some(key => params.has(key))) {
      return defaultState();
    }
    try {
      return normalize({
        wallWidthCm: params.get('width'),
        wallHeightCm: params.get('height'),
        usableWidthCm: params.get('usable'),
        repeatCm: params.has('repeat') ? params.get('repeat') : 0,
        allowanceCm: params.has('allowance') ? params.get('allowance') : 0,
        rollLengthM: params.get('roll'),
        memo: ''
      });
    } catch (_error) {
      return defaultState();
    }
  }

  function writeQuery(input) {
    const state = normalize(input);
    const params = new URLSearchParams();
    params.set('width', String(state.wallWidthCm));
    params.set('height', String(state.wallHeightCm));
    params.set('usable', String(state.usableWidthCm));
    params.set('repeat', String(state.repeatCm));
    params.set('allowance', String(state.allowanceCm));
    if (state.rollLengthM != null) params.set('roll', String(state.rollLengthM));
    return params.toString();
  }

  function formatNumber(value, maximumFractionDigits) {
    return value.toLocaleString('ja-JP', { maximumFractionDigits: maximumFractionDigits == null ? 1 : maximumFractionDigits });
  }

  function formatResult(input) {
    const result = calculate(input);
    const lines = [
      '切り出し枚数：' + result.stripCount + '枚',
      '1枚の切り出し長さ：' + formatNumber(result.cutLengthCm) + 'cm',
      '合計の長さ（0.1m単位で切り上げ）：' + formatNumber(result.totalLengthMDisplay) + 'm'
    ];
    if (result.rollLengthM != null) {
      if (result.rollTooShort) {
        lines.push('入力したロール長では1枚を取れません。');
      } else {
        lines.push('1ロールから取れる枚数：' + result.stripsPerRoll + '枚');
        lines.push('ロール本数：' + result.rollCount + '本');
      }
    }
    lines.push('手持ちの壁紙で足りるなら購入は不要です。');
    return lines.join('\n');
  }

  const api = Object.freeze({
    DEFAULTS,
    MAX_WALL_WIDTH_CM,
    MAX_WALL_HEIGHT_CM,
    MIN_USABLE_WIDTH_CM,
    MAX_USABLE_WIDTH_CM,
    MAX_REPEAT_CM,
    MAX_ALLOWANCE_CM,
    MAX_ROLL_LENGTH_M,
    MAX_MEMO_LENGTH,
    calculate,
    normalize,
    readQuery,
    writeQuery,
    formatResult
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WallpaperQuantity = api;
  if (typeof document === 'undefined') return;

  const form = document.getElementById('wallpaper-quantity-form');
  if (!form) return;
  const error = document.getElementById('input-error');
  const result = document.getElementById('result-summary');
  const resultStrips = document.getElementById('result-strips');
  const resultCutLength = document.getElementById('result-cut-length');
  const resultTotalLength = document.getElementById('result-total-length');
  const rollResults = document.getElementById('roll-results');
  const resultStripsPerRoll = document.getElementById('result-strips-per-roll');
  const resultRollCount = document.getElementById('result-roll-count');
  const rollTooShort = document.getElementById('roll-too-short');

  function fieldValue(name) {
    const field = form.elements.namedItem(name);
    return field ? field.value : '';
  }

  function currentState() {
    return {
      wallWidthCm: fieldValue('width'),
      wallHeightCm: fieldValue('height'),
      usableWidthCm: fieldValue('usable'),
      repeatCm: fieldValue('repeat'),
      allowanceCm: fieldValue('allowance'),
      rollLengthM: fieldValue('roll'),
      memo: fieldValue('memo')
    };
  }

  function showBlankResult() {
    result.hidden = true;
    resultStrips.textContent = '—';
    resultCutLength.textContent = '—';
    resultTotalLength.textContent = '—';
    rollResults.hidden = true;
    rollTooShort.hidden = true;
  }

  function update(syncUrl) {
    const state = currentState();
    try {
      const normalized = normalize(state);
      const calculated = calculate(normalized);
      error.textContent = '';
      resultStrips.textContent = String(calculated.stripCount);
      resultCutLength.textContent = formatNumber(calculated.cutLengthCm);
      resultTotalLength.textContent = formatNumber(calculated.totalLengthMDisplay);
      rollResults.hidden = calculated.rollLengthM == null || calculated.rollTooShort;
      rollTooShort.hidden = calculated.rollLengthM == null || !calculated.rollTooShort;
      resultStripsPerRoll.textContent = String(calculated.stripsPerRoll);
      resultRollCount.textContent = String(calculated.rollCount);
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
  window.addEventListener('popstate', () => {
    const state = readQuery(location.search);
    form.elements.namedItem('width').value = state.wallWidthCm == null ? '' : String(state.wallWidthCm);
    form.elements.namedItem('height').value = state.wallHeightCm == null ? '' : String(state.wallHeightCm);
    form.elements.namedItem('usable').value = state.usableWidthCm == null ? '' : String(state.usableWidthCm);
    form.elements.namedItem('repeat').value = String(state.repeatCm);
    form.elements.namedItem('allowance').value = String(state.allowanceCm);
    form.elements.namedItem('roll').value = state.rollLengthM == null ? '' : String(state.rollLengthM);
    form.elements.namedItem('memo').value = '';
    update(false);
  });

  const initial = readQuery(location.search);
  form.elements.namedItem('width').value = initial.wallWidthCm == null ? '' : String(initial.wallWidthCm);
  form.elements.namedItem('height').value = initial.wallHeightCm == null ? '' : String(initial.wallHeightCm);
  form.elements.namedItem('usable').value = initial.usableWidthCm == null ? '' : String(initial.usableWidthCm);
  form.elements.namedItem('repeat').value = String(initial.repeatCm);
  form.elements.namedItem('allowance').value = String(initial.allowanceCm);
  form.elements.namedItem('roll').value = initial.rollLengthM == null ? '' : String(initial.rollLengthM);
  form.elements.namedItem('memo').value = '';
  update(false);
})(typeof globalThis !== 'undefined' ? globalThis : this);
