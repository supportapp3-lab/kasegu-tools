/* Array-based local inventory, calendar-day arithmetic and browser UI. */
(function (root) {
  'use strict';
  const STORAGE_KEY = 'kasegu-tools.rolling-stock.v1';
  const CATEGORIES = Object.freeze({ water: '水', food: '主食・非常食', toilet: '携帯トイレ', other: '日用品・その他' });
  const WINDOWS = [7, 14, 30, 60];

  function dateNumber(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError('期限はYYYY-MM-DDの日付で入力してください。');
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(0, 0, 0, 0);
    if (year < 1 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError('存在する日付を入力してください。');
    return date.getTime() / 86400000;
  }

  function localToday(date = new Date()) {
    return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function remainingDays(expiry, today) { return dateNumber(expiry) - dateNumber(today); }

  function normalizeItem(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('1件の備蓄品はJSONオブジェクトにしてください。');
    if (typeof input.name !== 'string' || !input.name.trim() || input.name.length > 80) throw new RangeError('名前は1〜80文字で入力してください。');
    if (!Object.hasOwn(CATEGORIES, input.category)) throw new RangeError('カテゴリは用意された4種類から選んでください。');
    const quantity = input.quantity === undefined || input.quantity === null ? null : input.quantity;
    if (quantity !== null && (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0 || quantity > Number.MAX_SAFE_INTEGER)) throw new RangeError('数量は正の数にするか、空欄にしてください。');
    const unit = input.unit === undefined ? '' : input.unit;
    const memo = input.memo === undefined ? '' : input.memo;
    if (typeof unit !== 'string' || unit.length > 12) throw new RangeError('単位は12文字以内にしてください。');
    if (typeof memo !== 'string' || memo.length > 200) throw new RangeError('メモは200文字以内にしてください。');
    dateNumber(input.expiry);
    return { name: input.name.trim(), category: input.category, quantity, unit, expiry: input.expiry, memo };
  }

  function serialize(items) {
    if (!Array.isArray(items)) throw new TypeError('備蓄データはJSON配列です。');
    return JSON.stringify(items.map(normalizeItem), null, 2);
  }

  function parseItems(text) {
    let rows;
    try { rows = JSON.parse(text); } catch (_error) { return { items: [], skipped: 0, error: 'JSONを読み込めませんでした。配列形式を確認してください。' }; }
    if (!Array.isArray(rows)) return { items: [], skipped: 0, error: '備蓄データはJSON配列にしてください。' };
    const items = [];
    let skipped = 0;
    for (const row of rows) {
      try { items.push(normalizeItem(row)); } catch (_error) { skipped++; }
    }
    return { items, skipped, error: null };
  }

  function readStored(text) {
    if (text === null) return { items: [], warning: '' };
    const result = parseItems(text);
    if (result.error || result.skipped) return { items: [], warning: '保存データが壊れているため、空の一覧で開きました。元の保存データは変更していません。' };
    return { items: result.items, warning: '' };
  }

  function importItems(existing, text, mode) {
    if (!['append', 'replace'].includes(mode)) throw new RangeError('インポート方法を選択してください。');
    const result = parseItems(text);
    if (result.error) return { items: existing.map(normalizeItem), imported: 0, skipped: 0, error: result.error };
    // Entirely invalid imports cannot erase an existing inventory.
    if (!result.items.length && result.skipped) return { items: existing.map(normalizeItem), imported: 0, skipped: result.skipped, error: '有効な行がありません。一覧は変更していません。' };
    return { items: mode === 'append' ? [...existing.map(normalizeItem), ...result.items] : result.items,
      imported: result.items.length, skipped: result.skipped, error: null };
  }

  function viewItems(items, { today, windowDays = 30, filter = 'all', sort = 'expiry' }) {
    dateNumber(today);
    if (!WINDOWS.includes(windowDays) || !['all', 'expired', 'near', 'other'].includes(filter) || !['expiry', 'category'].includes(sort)) throw new RangeError('表示条件を確認してください。');
    const rows = items.map((item, index) => {
      const normalized = normalizeItem(item);
      const days = remainingDays(normalized.expiry, today);
      return { item: normalized, index, days, state: days < 0 ? 'expired' : days <= windowDays ? 'near' : 'other' };
    }).filter(row => filter === 'all' || row.state === filter);
    const categories = Object.keys(CATEGORIES);
    return rows.sort((a, b) => (sort === 'category' ? categories.indexOf(a.item.category) - categories.indexOf(b.item.category) : 0) ||
      a.item.expiry.localeCompare(b.item.expiry) || a.index - b.index);
  }

  const api = Object.freeze({ STORAGE_KEY, CATEGORIES, dateNumber, localToday, remainingDays, normalizeItem, serialize, parseItems, readStored, importItems, viewItems });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RollingStock = api;
  if (typeof document === 'undefined') return;
  const form = document.getElementById('stock-form');
  if (!form) return;
  const list = document.getElementById('stock-list');
  const notice = document.getElementById('storage-notice');
  const feedback = document.getElementById('action-status');
  const jsonText = document.getElementById('json-text');
  let items = [];
  let editing = null;
  let storageNotice = '';
  // No inventory or editor values are ever placed in location.search.

  function load() {
    try {
      const result = readStored(localStorage.getItem(STORAGE_KEY));
      items = result.items;
      storageNotice = result.warning;
    } catch (_error) {
      items = [];
      storageNotice = '保存データを読み込めません。この画面だけで管理し、JSONを控えてください。';
    }
    notice.textContent = storageNotice;
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, serialize(items)); storageNotice = ''; }
    catch (_error) { storageNotice = 'ブラウザに保存できませんでした。再読み込みで消える可能性があるため、JSONを書き出してください。'; }
    notice.textContent = storageNotice;
  }

  function resetEditor() {
    editing = null;
    form.reset();
    document.getElementById('save-item').textContent = '一覧に追加';
    document.getElementById('cancel-edit').hidden = true;
    document.getElementById('input-error').textContent = '';
    document.getElementById('draft-status').textContent = '名前と期限を入力してください。';
  }

  function draft() {
    if (!form.checkValidity()) throw new RangeError('名前と期限を入力し、数量・文字数の範囲を確認してください。');
    return normalizeItem({ name: form.elements.itemName.value, category: form.elements.category.value,
      quantity: form.elements.quantity.value === '' ? null : form.elements.quantity.valueAsNumber,
      unit: form.elements.unit.value, expiry: form.elements.expiry.value, memo: form.elements.memo.value });
  }

  function render() {
    list.replaceChildren();
    const today = localToday();
    const rows = viewItems(items, { today, windowDays: Number(document.getElementById('window-days').value),
      filter: document.getElementById('filter').value, sort: document.getElementById('sort').value });
    document.getElementById('list-context').textContent = `基準日 ${today} ／ 全${items.length}件中${rows.length}件を表示`;
    document.getElementById('empty-note').hidden = rows.length !== 0;
    document.getElementById('clear-all').disabled = items.length === 0;
    for (const row of rows) {
      const card = document.createElement('article');
      card.className = 'stock-card ' + row.state;
      const heading = document.createElement('h3');
      heading.textContent = row.item.name;
      const detail = document.createElement('p');
      detail.textContent = `${CATEGORIES[row.item.category]} ／ ${row.item.quantity === null ? '数量未指定' : row.item.quantity + (row.item.unit ? ' ' + row.item.unit : '')} ／ 期限 ${row.item.expiry}`;
      const state = document.createElement('p');
      state.className = 'deadline';
      state.textContent = row.days < 0 ? `期限切れ（${-row.days}日経過）` : row.days === 0 ? '期限当日（残り0日）' : `残り${row.days}日${row.state === 'near' ? '・期限が近い品目' : ''}`;
      const memo = document.createElement('p');
      memo.textContent = row.item.memo;
      const edit = document.createElement('button');
      edit.type = 'button'; edit.textContent = '編集'; edit.setAttribute('aria-label', row.item.name + 'を編集');
      edit.addEventListener('click', () => {
        editing = row.index;
        for (const key of ['category', 'unit', 'expiry', 'memo']) form.elements[key].value = items[editing][key];
        form.elements.itemName.value = items[editing].name;
        form.elements.quantity.value = items[editing].quantity === null ? '' : String(items[editing].quantity);
        document.getElementById('save-item').textContent = '変更を保存';
        document.getElementById('cancel-edit').hidden = false;
        form.elements.itemName.focus();
        document.getElementById('draft-status').textContent = '編集後は「変更を保存」を押してください。';
      });
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = '削除'; remove.setAttribute('aria-label', row.item.name + 'を削除');
      remove.addEventListener('click', () => {
        if (!window.confirm('この品目を削除しますか？')) return;
        items.splice(row.index, 1); resetEditor(); save(); render(); feedback.textContent = '品目を削除しました。';
      });
      card.append(heading, detail, state, memo, edit, remove);
      list.append(card);
    }
  }

  form.addEventListener('input', () => {
    try { const item = draft(); document.getElementById('draft-status').textContent = `${item.name} ／ 残り${remainingDays(item.expiry, localToday())}日（保存前の入力）`; document.getElementById('input-error').textContent = ''; }
    catch (error) { document.getElementById('draft-status').textContent = '入力中です。名前と期限を確認してください。'; document.getElementById('input-error').textContent = error.message; }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const item = draft();
      if (editing === null) items.push(item); else items[editing] = item;
      resetEditor(); save(); render(); feedback.textContent = '一覧を更新しました。';
    } catch (error) { document.getElementById('input-error').textContent = error.message; }
  });
  document.getElementById('cancel-edit').addEventListener('click', resetEditor);
  for (const id of ['window-days', 'filter', 'sort']) document.getElementById(id).addEventListener('change', render);
  document.getElementById('clear-all').addEventListener('click', () => {
    if (!window.confirm('すべての備蓄品を削除します。JSONの控えはありますか？')) return;
    items = []; resetEditor(); save(); render(); feedback.textContent = '一覧をすべて削除しました。';
  });
  document.getElementById('export-json').addEventListener('click', () => {
    jsonText.value = serialize(items);
    const url = URL.createObjectURL(new Blob([jsonText.value], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `rolling-stock-${localToday()}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback.textContent = '全一覧をJSONに書き出しました。下の欄にも表示しています。';
  });
  document.getElementById('copy-json').addEventListener('click', async () => {
    jsonText.value = serialize(items);
    try { if (!navigator.clipboard || !window.isSecureContext) throw new Error('manual copy'); await navigator.clipboard.writeText(jsonText.value); feedback.textContent = '全一覧のJSONをコピーしました。'; }
    catch (_error) { jsonText.focus(); jsonText.select(); feedback.textContent = 'JSONの文章を選択しました。手動でコピーしてください。'; }
  });
  document.getElementById('import-file').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try { jsonText.value = await file.text(); feedback.textContent = 'ファイルを読み込みました。方法を選び「インポート」を押してください。'; }
    catch (_error) { feedback.textContent = 'ファイルを読み込めませんでした。JSONを直接貼り付けることもできます。'; }
  });
  document.getElementById('import-json').addEventListener('click', () => {
    const mode = document.getElementById('import-mode').value;
    const result = importItems(items, jsonText.value, mode);
    if (result.error) { feedback.textContent = `${result.error} スキップ${result.skipped}件。`; return; }
    if (mode === 'replace' && !window.confirm('現在の一覧をインポート内容で上書きしますか？')) return;
    items = result.items; resetEditor(); save(); render(); feedback.textContent = `${mode === 'replace' ? '上書き' : '追記'}しました。取込${result.imported}件・不正行スキップ${result.skipped}件。`;
  });
  window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) { load(); resetEditor(); render(); feedback.textContent = '別タブの更新を読み込みました。'; } });
  window.addEventListener('focus', render);
  load(); render();
})(typeof globalThis !== 'undefined' ? globalThis : this);
