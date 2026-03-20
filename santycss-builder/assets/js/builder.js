/* SantyCSS Builder — drag-and-drop page builder UI */
(function () {
  'use strict';

  const cfg = window.SCB_CONFIG || {};

  /* ── State ────────────────────────────────────────────────────────── */
  const S = {
    postId:     null,
    data:       { sections: [] },
    selectedId: null,
    dirty:      false,
  };

  /* drag state */
  let dragType     = null;   // widget type from panel
  let dragWidgetId = null;   // widget id for canvas reorder
  let dragSrc      = null;   // { secId, colIdx, widgetIdx }

  /* ── Helpers ──────────────────────────────────────────────────────── */
  function uid() {
    return 'scb-' + Math.random().toString(36).slice(2, 9);
  }

  function getWidgetDef(type) {
    return (cfg.widgets || []).find(w => w.type === type) || null;
  }

  function findSection(id) {
    return S.data.sections.find(s => s.id === id) || null;
  }

  function findWidget(widgetId) {
    for (const sec of S.data.sections) {
      for (const col of sec.columns) {
        const w = col.find(w => w.id === widgetId);
        if (w) return w;
      }
    }
    return null;
  }

  /* Minimal element factory */
  function el(tag, props, children) {
    const e = document.createElement(tag);
    if (props) {
      Object.entries(props).forEach(([k, v]) => {
        if (k === 'className')   { e.className = v; }
        else if (k === 'innerHTML') { e.innerHTML = v; }
        else if (k.startsWith('on') && typeof v === 'function') {
          e.addEventListener(k.slice(2).toLowerCase(), v);
        } else {
          e.setAttribute(k, v);
        }
      });
    }
    if (children !== undefined) {
      [].concat(children).forEach(c => {
        if (c == null) return;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return e;
  }

  /* ── Public API ───────────────────────────────────────────────────── */
  const SCBBuilder = {

    open(postId) {
      S.postId = postId;
      this.buildOverlay();
      this.load();
    },

    close() {
      document.getElementById('scb-overlay')?.remove();
    },

    async load() {
      try {
        const res  = await fetch(
          cfg.ajaxUrl + '?action=scb_load&post_id=' + S.postId + '&nonce=' + cfg.nonce
        );
        const json = await res.json();
        if (json.success) {
          try { S.data = JSON.parse(json.data.data); } catch (e) { S.data = { sections: [] }; }
          if (!S.data || !S.data.sections) S.data = { sections: [] };
        }
      } catch (e) {
        S.data = { sections: [] };
      }
      this.renderCanvas();
    },

    async save() {
      const btn = document.getElementById('scb-save-btn');
      if (btn) { btn.textContent = cfg.l10n?.saving || 'Saving…'; btn.disabled = true; }

      /* sync hidden field in WP edit form */
      const hid = document.getElementById('scb-data');
      if (hid) hid.value = JSON.stringify(S.data);

      const body = new URLSearchParams({
        action:  'scb_save',
        nonce:   cfg.nonce,
        post_id: S.postId,
        data:    JSON.stringify(S.data),
      });

      try {
        const res  = await fetch(cfg.ajaxUrl, { method: 'POST', body });
        const json = await res.json();
        if (btn) {
          btn.textContent = json.success ? (cfg.l10n?.saved || 'Saved!') : 'Error!';
          btn.disabled = false;
          setTimeout(() => { if (btn) btn.textContent = 'Save'; }, 2000);
        }
        S.dirty = false;
      } catch (e) {
        if (btn) { btn.textContent = 'Error!'; btn.disabled = false; }
      }
    },

    /* ── Overlay shell ────────────────────────────────────────────── */
    buildOverlay() {
      document.getElementById('scb-overlay')?.remove();

      const overlay = el('div', { id: 'scb-overlay' });

      /* header */
      const header  = el('div', { id: 'scb-header' });
      const title   = el('div', { id: 'scb-header-title' });
      title.innerHTML = '<span style="font-size:20px">⚡</span> SantyCSS Builder';

      const actions = el('div', { id: 'scb-header-actions' });
      const saveBtn = el('button', { id: 'scb-save-btn', className: 'scb-btn scb-btn-primary', onclick: () => this.save() }, 'Save');
      const exitBtn = el('button', { id: 'scb-exit-btn', className: 'scb-btn scb-btn-ghost', onclick: () => this.close() }, '✕ Exit');
      actions.append(saveBtn, exitBtn);
      header.append(title, actions);

      /* body */
      const body   = el('div', { id: 'scb-body' });
      const left   = el('div', { id: 'scb-left' });
      left.innerHTML = this._buildWidgetPanelHTML();
      this._initWidgetPanelEvents(left);

      const canvas  = el('div', { id: 'scb-canvas' });
      const inner   = el('div', { id: 'scb-canvas-inner' });
      canvas.appendChild(inner);

      const right  = el('div', { id: 'scb-right' });
      right.innerHTML = '<div class="scb-no-sel">Select a widget to edit its settings</div>';

      body.append(left, canvas, right);
      overlay.append(header, body);
      document.body.appendChild(overlay);
    },

    /* ── Widget panel (left sidebar) ─────────────────────────────── */
    _buildWidgetPanelHTML() {
      const cats = {
        basic:       'Basic',
        media:       'Media',
        social:      'Social',
        interactive: 'Interactive',
        content:     'Content',
        pro:         'Pro',
        woocommerce: 'WooCommerce',
      };
      const grouped = {};
      (cfg.widgets || []).forEach(w => {
        const c = w.category || 'basic';
        (grouped[c] = grouped[c] || []).push(w);
      });

      let html = '<div class="scb-panel-hdr">Widgets</div>';
      html += '<div class="scb-panel-search"><input type="text" id="scb-wsearch" placeholder="Search widgets…"></div>';

      for (const [key, label] of Object.entries(cats)) {
        const items = grouped[key];
        if (!items?.length) continue;
        html += `<div class="scb-cat" data-cat="${key}"><div class="scb-cat-label">${label}</div><div class="scb-cat-items">`;
        for (const w of items) {
          const locked = w.tier === 'pro' && !cfg.isPro;
          html += `<div class="scb-wi${locked ? ' scb-locked' : ''}" draggable="${!locked}" data-type="${w.type}" title="${w.title}">`;
          html += `<span class="scb-wi-icon">${w.icon}</span><span class="scb-wi-name">${w.title}</span>`;
          if (locked) html += '<span class="scb-pro-tag">PRO</span>';
          html += '</div>';
        }
        html += '</div></div>';
      }
      return html;
    },

    _initWidgetPanelEvents(left) {
      left.querySelector('#scb-wsearch')?.addEventListener('input', function () {
        const q = this.value.toLowerCase();
        left.querySelectorAll('.scb-wi').forEach(i => {
          i.style.display = (i.title.toLowerCase().includes(q) || i.querySelector('.scb-wi-name').textContent.toLowerCase().includes(q)) ? '' : 'none';
        });
        left.querySelectorAll('.scb-cat').forEach(c => {
          c.style.display = [...c.querySelectorAll('.scb-wi')].some(i => i.style.display !== 'none') ? '' : 'none';
        });
      });

      left.querySelectorAll('.scb-wi[draggable="true"]').forEach(item => {
        item.addEventListener('dragstart', e => {
          dragType = item.dataset.type;
          dragWidgetId = null;
          e.dataTransfer.effectAllowed = 'copy';
        });
        item.addEventListener('dragend', () => { dragType = null; });
      });
    },

    /* ── Canvas ───────────────────────────────────────────────────── */
    renderCanvas() {
      const inner = document.getElementById('scb-canvas-inner');
      if (!inner) return;
      inner.innerHTML = '';

      S.data.sections.forEach((sec, si) => {
        inner.appendChild(this._buildSectionEl(sec, si));
      });

      /* add-section button */
      const wrap = el('div', { className: 'scb-add-sec-wrap' });
      const btn  = el('button', { className: 'scb-add-sec-btn', onclick: (e) => this._showSectionMenu(e, btn) }, '+ Add Section');
      wrap.appendChild(btn);
      inner.appendChild(wrap);
    },

    _buildSectionEl(sec, si) {
      const secEl = el('div', { className: 'scb-sec', 'data-sec-id': sec.id });

      /* section bar */
      const bar     = el('div', { className: 'scb-sec-bar' });
      const barLeft = el('span', { className: 'scb-sec-label' }, `Section ${si + 1} · ${sec.cols} col${sec.cols > 1 ? 's' : ''}`);
      const barR    = el('div',  { className: 'scb-sec-acts' });

      barR.append(
        el('button', { className: 'scb-sbtn', title: 'Move up',    onclick: () => this._moveSection(sec.id, -1) }, '↑'),
        el('button', { className: 'scb-sbtn', title: 'Move down',  onclick: () => this._moveSection(sec.id,  1) }, '↓'),
        el('button', { className: 'scb-sbtn scb-danger', title: 'Delete section', onclick: () => this._removeSection(sec.id) }, '✕'),
      );
      bar.append(barLeft, barR);
      secEl.appendChild(bar);

      /* columns */
      const colsEl = el('div', { className: `scb-cols scb-cols-${sec.cols}` });
      sec.columns.forEach((col, ci) => {
        const colEl = el('div', { className: 'scb-col' });
        col.forEach((w, wi) => colEl.appendChild(this._buildWidgetCard(w, sec.id, ci, wi)));

        /* drop zone at bottom of column */
        const dz = el('div', { className: 'scb-dz' }, 'Drop widget here');
        this._initDropZone(dz, sec.id, ci);
        colEl.appendChild(dz);
        colsEl.appendChild(colEl);
      });
      secEl.appendChild(colsEl);
      return secEl;
    },

    _buildWidgetCard(w, secId, colIdx, widgetIdx) {
      const def  = getWidgetDef(w.type);
      const card = el('div', {
        className:       'scb-wcard' + (S.selectedId === w.id ? ' scb-wsel' : ''),
        'data-widget-id': w.id,
        draggable:        'true',
        onclick:          (e) => { e.stopPropagation(); this._selectWidget(w.id); },
      });

      card.addEventListener('dragstart', e => {
        dragWidgetId = w.id;
        dragType     = null;
        dragSrc      = { secId, colIdx, widgetIdx };
        e.dataTransfer.effectAllowed = 'move';
      });

      const acts = el('div', { className: 'scb-wcard-acts' });
      acts.append(
        el('button', { className: 'scb-wbtn', title: 'Move up',   onclick: (e) => { e.stopPropagation(); this._moveWidget(secId, colIdx, widgetIdx, -1); } }, '↑'),
        el('button', { className: 'scb-wbtn', title: 'Move down', onclick: (e) => { e.stopPropagation(); this._moveWidget(secId, colIdx, widgetIdx,  1); } }, '↓'),
        el('button', { className: 'scb-wbtn scb-danger', title: 'Delete', onclick: (e) => { e.stopPropagation(); this._removeWidget(w.id); } }, '✕'),
      );

      card.append(
        el('span', { className: 'scb-wcard-icon' }, def?.icon || '□'),
        el('span', { className: 'scb-wcard-name' }, def?.title || w.type),
        acts,
      );
      return card;
    },

    _initDropZone(dz, secId, colIdx) {
      dz.addEventListener('dragover',  e => { e.preventDefault(); dz.classList.add('scb-dz-on'); });
      dz.addEventListener('dragleave', ()  => dz.classList.remove('scb-dz-on'));
      dz.addEventListener('drop', e => {
        e.preventDefault();
        dz.classList.remove('scb-dz-on');
        if (dragType) {
          this._addWidget(dragType, secId, colIdx);
        } else if (dragWidgetId && dragSrc) {
          this._moveWidgetTo(dragWidgetId, dragSrc, secId, colIdx);
        }
        dragType = null; dragWidgetId = null; dragSrc = null;
      });
    },

    _showSectionMenu(e, btn) {
      e.stopPropagation();
      document.querySelector('.scb-sec-menu')?.remove();
      const menu = el('div', { className: 'scb-sec-menu' });
      [[1,'⬜ 1 Column'],[2,'⬜⬜ 2 Columns'],[3,'⬜⬜⬜ 3 Columns']].forEach(([cols, label]) => {
        menu.appendChild(el('div', { className: 'scb-sec-menu-item', onclick: () => { this._addSection(cols); menu.remove(); } }, label));
      });
      btn.parentNode.style.position = 'relative';
      btn.parentNode.appendChild(menu);
      setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 0);
    },

    /* ── Controls panel (right sidebar) ──────────────────────────── */
    _selectWidget(widgetId) {
      S.selectedId = widgetId;
      document.querySelectorAll('.scb-wcard').forEach(c => c.classList.remove('scb-wsel'));
      document.querySelector(`[data-widget-id="${widgetId}"]`)?.classList.add('scb-wsel');
      this._renderControls();
    },

    _renderControls() {
      const right = document.getElementById('scb-right');
      if (!right) return;

      if (!S.selectedId) {
        right.innerHTML = '<div class="scb-no-sel">Select a widget to edit its settings</div>';
        return;
      }
      const w   = findWidget(S.selectedId);
      const def = w ? getWidgetDef(w.type) : null;
      if (!w || !def) {
        right.innerHTML = '<div class="scb-no-sel">Widget not found</div>';
        return;
      }

      right.innerHTML = '';
      const hdr = el('div', { className: 'scb-ctrl-hdr' });
      hdr.innerHTML = `<span class="scb-ctrl-hdr-icon">${def.icon}</span><span>${def.title}</span>`;
      right.appendChild(hdr);

      const body = el('div', { className: 'scb-ctrl-body' });
      def.controls.forEach(ctrl => {
        const val  = w.settings[ctrl.key] !== undefined ? w.settings[ctrl.key] : ctrl.default;
        const wrap = this._buildControl(ctrl, val, key => newVal => this._updateSetting(w.id, key, newVal));
        if (wrap) body.appendChild(wrap);
      });
      right.appendChild(body);
    },

    /* builds one control row; onChange factory = (key) => (value) => void */
    _buildControl(ctrl, val, onChangeFn) {
      if (ctrl.type === 'divider') return el('hr', { className: 'scb-divider' });
      if (ctrl.type === 'heading') return el('div', { className: 'scb-ctrl-grp-hdr' }, ctrl.label);

      const onChange = onChangeFn(ctrl.key);

      if (ctrl.type === 'toggle') {
        const row   = el('div', { className: 'scb-tog-row' });
        const lbl   = el('span', { className: 'scb-lbl' }, ctrl.label);
        const sw    = el('label', { className: 'scb-tog' });
        const inp   = el('input', { type: 'checkbox' });
        if (val) inp.checked = true;
        inp.addEventListener('change', () => onChange(inp.checked));
        sw.append(inp, el('span', { className: 'scb-tog-track' }));
        row.append(lbl, sw);
        return row;
      }

      const wrap = el('div', { className: 'scb-ctrl-row' });
      if (ctrl.type !== 'toggle') {
        wrap.appendChild(el('label', { className: 'scb-lbl' }, ctrl.label));
      }
      const inp = this._buildInput(ctrl, val, onChange);
      if (inp) wrap.appendChild(inp);
      return wrap;
    },

    /* returns only the input element (or composite wrapper) for a control */
    _buildInput(ctrl, val, onChange) {
      switch (ctrl.type) {

        case 'text':
        case 'url': {
          const i = el('input', { type: ctrl.type === 'url' ? 'url' : 'text', className: 'scb-inp', value: val || '' });
          i.addEventListener('input', () => onChange(i.value));
          return i;
        }

        case 'textarea':
        case 'wysiwyg': {
          const t = el('textarea', { className: 'scb-textarea', rows: '4' });
          t.value = val || '';
          t.addEventListener('input', () => onChange(t.value));
          return t;
        }

        case 'number': {
          const i = el('input', { type: 'number', className: 'scb-inp',
            value: val ?? ctrl.default ?? 0,
            min:   ctrl.min  ?? 0,
            max:   ctrl.max  ?? 9999,
            step:  ctrl.step ?? 1 });
          i.addEventListener('input', () => onChange(Number(i.value)));
          return i;
        }

        case 'color': {
          const w  = el('div', { className: 'scb-color-wrap' });
          const cp = el('input', { type: 'color', className: 'scb-color-pick', value: val || '#000000' });
          const ct = el('input', { type: 'text',  className: 'scb-inp scb-color-txt', value: val || '#000000' });
          cp.addEventListener('input', () => { ct.value = cp.value; onChange(cp.value); });
          ct.addEventListener('change', () => { try { cp.value = ct.value; onChange(ct.value); } catch(e){} });
          w.append(cp, ct);
          return w;
        }

        case 'select': {
          const s = el('select', { className: 'scb-sel' });
          Object.entries(ctrl.options || {}).forEach(([k, v]) => {
            const o = el('option', { value: k }, v);
            if (String(k) === String(val)) o.selected = true;
            s.appendChild(o);
          });
          s.addEventListener('change', () => onChange(s.value));
          return s;
        }

        case 'slider': {
          const w  = el('div', { className: 'scb-slider-wrap' });
          const r  = el('input', { type: 'range', className: 'scb-range',
            value: val ?? ctrl.default ?? 50,
            min:   ctrl.min ?? 0,
            max:   ctrl.max ?? 100 });
          const vl = el('span', { className: 'scb-range-val' }, String(val ?? ctrl.default ?? 50));
          r.addEventListener('input', () => { vl.textContent = r.value; onChange(Number(r.value)); });
          w.append(r, vl);
          return w;
        }

        case 'image': {
          const imgVal = (typeof val === 'object' && val) ? val : { url: '', id: 0 };
          const w      = el('div', { className: 'scb-img-wrap' });
          const prev   = el('div', { className: 'scb-img-prev' + (imgVal.url ? ' has-img' : '') });
          if (imgVal.url) prev.style.backgroundImage = `url(${imgVal.url})`;

          const pickBtn = el('button', { className: 'scb-btn scb-btn-sm', onclick: () => {
            if (typeof wp === 'undefined' || !wp.media) return;
            const frame = wp.media({ title: 'Select Image', button: { text: 'Use this image' }, multiple: false });
            frame.on('select', () => {
              const att = frame.state().get('selection').first().toJSON();
              onChange({ url: att.url, id: att.id });
              prev.style.backgroundImage = `url(${att.url})`;
              prev.classList.add('has-img');
              pickBtn.textContent = 'Change Image';
            });
            frame.open();
          }}, imgVal.url ? 'Change Image' : 'Select Image');

          const clrBtn = el('button', { className: 'scb-btn scb-btn-sm scb-btn-ghost', onclick: () => {
            onChange({ url: '', id: 0 });
            prev.style.backgroundImage = '';
            prev.classList.remove('has-img');
            pickBtn.textContent = 'Select Image';
          }}, 'Remove');

          w.append(prev, el('div', { className: 'scb-img-btns' }, [pickBtn, clrBtn]));
          return w;
        }

        case 'repeater': {
          const items  = Array.isArray(val) ? val.map(i => Object.assign({}, i))
                                            : (ctrl.default || []).map(i => Object.assign({}, i));
          const w      = el('div', { className: 'scb-rep' });

          const renderItems = () => {
            w.innerHTML = '';
            items.forEach((item, idx) => {
              const itemEl = el('div', { className: 'scb-rep-item' });
              const hdr    = el('div', { className: 'scb-rep-hdr' });
              hdr.append(
                el('span', {}, `Item ${idx + 1}`),
                el('button', { className: 'scb-rep-del', onclick: (e) => {
                  e.stopPropagation();
                  items.splice(idx, 1);
                  onChange([...items]);
                  renderItems();
                }}, '✕'),
              );
              const body = el('div', { className: 'scb-rep-body' });
              (ctrl.item_controls || []).forEach(sc => {
                const sv  = item[sc.key] !== undefined ? item[sc.key] : sc.default;
                const row = el('div', { className: 'scb-ctrl-row' });
                if (sc.type !== 'toggle') row.appendChild(el('label', { className: 'scb-lbl' }, sc.label));
                const inp = this._buildInput(sc, sv, (v) => {
                  item[sc.key] = v;
                  onChange([...items]);
                });
                if (inp) row.appendChild(inp);
                body.appendChild(row);
              });
              itemEl.append(hdr, body);
              w.appendChild(itemEl);
            });

            w.appendChild(el('button', { className: 'scb-btn scb-btn-sm scb-rep-add', onclick: () => {
              const ni = {};
              (ctrl.item_controls || []).forEach(sc => { ni[sc.key] = sc.default !== undefined ? sc.default : ''; });
              items.push(ni);
              onChange([...items]);
              renderItems();
            }}, '+ Add Item'));
          };

          renderItems();
          return w;
        }

        default:
          return null;
      }
    },

    /* ── Data mutations ───────────────────────────────────────────── */
    _addSection(cols) {
      S.data.sections.push({ id: uid(), cols, columns: Array.from({ length: cols }, () => []) });
      S.dirty = true;
      this.renderCanvas();
    },

    _removeSection(secId) {
      if (!confirm('Delete this section and all its widgets?')) return;
      S.data.sections = S.data.sections.filter(s => s.id !== secId);
      if (!findWidget(S.selectedId)) { S.selectedId = null; this._renderControls(); }
      S.dirty = true;
      this.renderCanvas();
    },

    _moveSection(secId, dir) {
      const idx = S.data.sections.findIndex(s => s.id === secId);
      const nxt = idx + dir;
      if (nxt < 0 || nxt >= S.data.sections.length) return;
      const [sec] = S.data.sections.splice(idx, 1);
      S.data.sections.splice(nxt, 0, sec);
      S.dirty = true;
      this.renderCanvas();
    },

    _addWidget(type, secId, colIdx) {
      const sec = findSection(secId);
      const def = getWidgetDef(type);
      if (!sec || !def) return;
      const w = { id: uid(), type, settings: Object.assign({}, def.defaults) };
      sec.columns[colIdx].push(w);
      S.dirty = true;
      this.renderCanvas();
      this._selectWidget(w.id);
    },

    _removeWidget(widgetId) {
      for (const sec of S.data.sections) {
        for (const col of sec.columns) {
          const i = col.findIndex(w => w.id === widgetId);
          if (i !== -1) { col.splice(i, 1); break; }
        }
      }
      if (S.selectedId === widgetId) { S.selectedId = null; this._renderControls(); }
      S.dirty = true;
      this.renderCanvas();
    },

    _moveWidget(secId, colIdx, widgetIdx, dir) {
      const sec = findSection(secId);
      if (!sec) return;
      const col = sec.columns[colIdx];
      const nxt = widgetIdx + dir;
      if (nxt < 0 || nxt >= col.length) return;
      const [w] = col.splice(widgetIdx, 1);
      col.splice(nxt, 0, w);
      S.dirty = true;
      this.renderCanvas();
    },

    _moveWidgetTo(widgetId, src, destSecId, destColIdx) {
      const srcSec = findSection(src.secId);
      if (!srcSec) return;
      const [w] = srcSec.columns[src.colIdx].splice(src.widgetIdx, 1);
      const dst = findSection(destSecId);
      if (!dst) return;
      dst.columns[destColIdx].push(w);
      S.dirty = true;
      this.renderCanvas();
    },

    _updateSetting(widgetId, key, value) {
      const w = findWidget(widgetId);
      if (!w) return;
      w.settings[key] = value;
      S.dirty = true;
    },
  };

  window.SCBBuilder = SCBBuilder;

  /* warn on unsaved changes */
  window.addEventListener('beforeunload', e => {
    if (S.dirty && document.getElementById('scb-overlay')) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

})();
