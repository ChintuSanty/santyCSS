/*! @santycss/elements — SantyCSS custom elements | MIT
 *
 * Framework-agnostic wrappers around santy.js. Works in React 19+, Vue, Svelte,
 * Angular, Astro and plain HTML — one build, every framework.
 *
 *   <script src="https://cdn.jsdelivr.net/npm/santycss@2/dist/santy.js" defer></script>
 *   <script src="https://cdn.jsdelivr.net/npm/santycss@2/dist/santy-elements.js" defer></script>
 *
 *   <santy-modal id="confirm">
 *     <div class="modal-box add-padding-24">…</div>
 *   </santy-modal>
 *
 *   document.querySelector('#confirm').open = true;
 *
 * These deliberately render into the LIGHT DOM, not a shadow root: SantyCSS is
 * a global stylesheet, and a shadow boundary would cut every utility class off
 * from the content inside it.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  if (typeof window === 'undefined' || typeof HTMLElement === 'undefined') {
    // Imported during SSR — nothing to define.
    return { defined: false };
  }

  /** santy.js may load after this file; resolve it lazily on first use. */
  function santy() {
    return window.Santy || null;
  }

  function warnMissing(tag) {
    if (santy()) return false;
    console.warn('[santy-elements] <' + tag + '> needs santy.js — load dist/santy.js first.');
    return true;
  }

  function boolAttr(el, name) {
    var v = el.getAttribute(name);
    return v !== null && v !== 'false';
  }

  /** Re-emit a santy:* lifecycle event under a framework-friendly name. */
  function relay(el, from, to) {
    el.addEventListener(from, function (e) {
      el.dispatchEvent(new CustomEvent(to, { bubbles: true, detail: e.detail }));
    });
  }

  /* ─── shared overlay element (modal / drawer / bottom sheet) ──────────── */

  function makeOverlayElement(tag, cssClass, apiName) {
    function El() { return Reflect.construct(HTMLElement, [], El); }
    El.prototype = Object.create(HTMLElement.prototype);
    El.prototype.constructor = El;
    Object.setPrototypeOf(El, HTMLElement);

    Object.defineProperty(El, 'observedAttributes', { get: function () { return ['open']; } });

    El.prototype.connectedCallback = function () {
      if (this.__wired) return;
      this.__wired = true;
      // The element itself becomes the overlay node santy.js drives.
      this.classList.add(cssClass);
      if (!this.id) this.id = 'santy-el-' + Math.random().toString(36).slice(2, 8);
      relay(this, 'santy:shown', 'opened');
      relay(this, 'santy:hidden', 'closed');
      // Keep the attribute in sync when closed from inside (Esc, backdrop, ×).
      var self = this;
      this.addEventListener('santy:hidden', function () {
        if (self.hasAttribute('open')) self.removeAttribute('open');
      });
      if (santy()) santy().init(this);
      if (boolAttr(this, 'open')) this.open = true;
    };

    El.prototype.attributeChangedCallback = function (name, oldV, newV) {
      if (name !== 'open' || oldV === newV || !this.__wired) return;
      var S = santy();
      if (!S) return;
      if (newV !== null && newV !== 'false') S[apiName].open(this);
      else S[apiName].close(this);
    };

    Object.defineProperty(El.prototype, 'open', {
      get: function () { return boolAttr(this, 'open'); },
      set: function (v) {
        if (warnMissing(tag)) return;
        if (v) this.setAttribute('open', '');
        else this.removeAttribute('open');
      }
    });

    El.prototype.show = function () { this.open = true; return this; };
    El.prototype.hide = function () { this.open = false; return this; };
    El.prototype.toggle = function () { this.open = !this.open; return this; };

    return El;
  }

  var SantyModal  = makeOverlayElement('santy-modal', 'modal-overlay', 'modal');
  var SantyDrawer = makeOverlayElement('santy-drawer', 'drawer-overlay', 'drawer');
  var SantySheet  = makeOverlayElement('santy-bottom-sheet', 'bottom-sheet', 'sheet');

  /* ─── <santy-tabs> ───────────────────────────────────────────────────── */

  function SantyTabs() { return Reflect.construct(HTMLElement, [], SantyTabs); }
  SantyTabs.prototype = Object.create(HTMLElement.prototype);
  SantyTabs.prototype.constructor = SantyTabs;
  Object.setPrototypeOf(SantyTabs, HTMLElement);
  Object.defineProperty(SantyTabs, 'observedAttributes', { get: function () { return ['value']; } });

  SantyTabs.prototype.connectedCallback = function () {
    if (this.__wired) return;
    this.__wired = true;
    var self = this;
    if (santy()) santy().init(this);
    // Mirror the active tab back onto the value attribute for two-way binding.
    this.addEventListener('santy:shown', function (e) {
      var tab = e.target;
      if (!tab.classList || !tab.classList.contains('tabs-item')) return;
      var v = tab.getAttribute('data-value') || tab.getAttribute('data-santy-target') || '';
      if (self.getAttribute('value') !== v) self.setAttribute('value', v);
      self.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: v } }));
    });
    var initial = this.getAttribute('value');
    if (initial) this.value = initial;
  };

  SantyTabs.prototype.attributeChangedCallback = function (name, oldV, newV) {
    if (name !== 'value' || oldV === newV || !this.__wired) return;
    this.value = newV;
  };

  Object.defineProperty(SantyTabs.prototype, 'value', {
    get: function () { return this.getAttribute('value') || ''; },
    set: function (v) {
      var S = santy();
      if (!S || !v) return;
      var tab = this.querySelector('.tabs-item[data-value="' + v + '"]') ||
                this.querySelector('.tabs-item[data-santy-target="' + v + '"]');
      if (tab) S.tabs.show(tab);
    }
  });

  /* ─── <santy-dropdown> ───────────────────────────────────────────────── */

  function SantyDropdown() { return Reflect.construct(HTMLElement, [], SantyDropdown); }
  SantyDropdown.prototype = Object.create(HTMLElement.prototype);
  SantyDropdown.prototype.constructor = SantyDropdown;
  Object.setPrototypeOf(SantyDropdown, HTMLElement);
  Object.defineProperty(SantyDropdown, 'observedAttributes', { get: function () { return ['open']; } });

  SantyDropdown.prototype.connectedCallback = function () {
    if (this.__wired) return;
    this.__wired = true;
    this.classList.add('dropdown');
    var self = this;
    if (santy()) santy().init(this);
    relay(this, 'santy:shown', 'opened');
    relay(this, 'santy:hidden', 'closed');
    this.addEventListener('santy:hidden', function () {
      if (self.hasAttribute('open')) self.removeAttribute('open');
    });
    this.addEventListener('santy:shown', function () {
      if (!self.hasAttribute('open')) self.setAttribute('open', '');
    });
  };

  SantyDropdown.prototype.attributeChangedCallback = function (name, oldV, newV) {
    if (name !== 'open' || oldV === newV || !this.__wired) return;
    var S = santy();
    if (!S) return;
    if (newV !== null && newV !== 'false') S.dropdown.open(this);
    else S.dropdown.close(this);
  };

  /* ─── <santy-theme-toggle> ───────────────────────────────────────────── */

  function SantyThemeToggle() { return Reflect.construct(HTMLElement, [], SantyThemeToggle); }
  SantyThemeToggle.prototype = Object.create(HTMLElement.prototype);
  SantyThemeToggle.prototype.constructor = SantyThemeToggle;
  Object.setPrototypeOf(SantyThemeToggle, HTMLElement);

  SantyThemeToggle.prototype.connectedCallback = function () {
    if (this.__wired) return;
    this.__wired = true;
    var self = this;
    if (!this.getAttribute('role')) this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    if (!this.getAttribute('aria-label')) this.setAttribute('aria-label', 'Toggle colour theme');

    function flip(e) {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      if (e.type === 'keydown') e.preventDefault();
      var S = santy();
      if (!S) return warnMissing('santy-theme-toggle');
      var named = self.getAttribute('theme');
      var next = named ? S.theme.set(named) : S.theme.toggle();
      self.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
      self.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { theme: next } }));
    }
    this.addEventListener('click', flip);
    this.addEventListener('keydown', flip);

    var S = santy();
    if (S) this.setAttribute('aria-pressed', S.theme.get() === 'dark' ? 'true' : 'false');
  };

  /* ─── <santy-tooltip text="…"> ───────────────────────────────────────── */

  function SantyTooltip() { return Reflect.construct(HTMLElement, [], SantyTooltip); }
  SantyTooltip.prototype = Object.create(HTMLElement.prototype);
  SantyTooltip.prototype.constructor = SantyTooltip;
  Object.setPrototypeOf(SantyTooltip, HTMLElement);
  Object.defineProperty(SantyTooltip, 'observedAttributes', { get: function () { return ['text', 'placement']; } });

  SantyTooltip.prototype.connectedCallback = function () {
    if (this.__wired) return;
    this.__wired = true;
    this.style.display = this.style.display || 'inline-block';
    this.syncAttrs();
    if (santy()) santy().init(this.parentNode || document);
  };

  SantyTooltip.prototype.attributeChangedCallback = function () {
    if (this.__wired) this.syncAttrs();
  };

  SantyTooltip.prototype.syncAttrs = function () {
    var text = this.getAttribute('text');
    if (text) this.setAttribute('data-santy-tooltip', text);
    var p = this.getAttribute('placement');
    if (p) this.setAttribute('data-santy-placement', p);
  };

  /* ─── registration ───────────────────────────────────────────────────── */

  var ELEMENTS = {
    'santy-modal': SantyModal,
    'santy-drawer': SantyDrawer,
    'santy-bottom-sheet': SantySheet,
    'santy-tabs': SantyTabs,
    'santy-dropdown': SantyDropdown,
    'santy-theme-toggle': SantyThemeToggle,
    'santy-tooltip': SantyTooltip,
  };

  /** Register every element. Safe to call twice — existing tags are skipped. */
  function define(prefixOrMap) {
    var defined = [];
    Object.keys(ELEMENTS).forEach(function (tag) {
      var name = typeof prefixOrMap === 'string' ? prefixOrMap + tag.replace(/^santy-/, '') : tag;
      if (customElements.get(name)) return;
      customElements.define(name, ELEMENTS[tag]);
      defined.push(name);
    });
    return defined;
  }

  define();

  return { define: define, elements: ELEMENTS, defined: true };
}));
