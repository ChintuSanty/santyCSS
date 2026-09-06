/*! @santycss/vue — Vue 3 bindings for SantyCSS | MIT
 *
 * Composables and components over santy.js, written with Vue's `h()` rather
 * than SFC templates, so the package ships as plain JavaScript with no build
 * step — the same promise the CSS makes.
 *
 *   import { useModal, useTheme, useToast, SantyModal, cn } from 'santycss/vue';
 *
 * Vue is a peer dependency and is required lazily, so importing this module
 * without Vue installed will not crash the bundle graph.
 */
'use strict';

var cn = require('../merge/santy-merge.js');

var Vue = null;
function vue() {
  if (Vue) return Vue;
  try {
    Vue = require('vue');
  } catch (e) {
    throw new Error('@santycss/vue requires "vue" (3.x) as a peer dependency.');
  }
  return Vue;
}

function santy() {
  if (typeof window === 'undefined') return null;
  return window.Santy || null;
}

/* ─── useSanty — resolves the global once santy.js has loaded ──────────── */

function useSanty() {
  var V = vue();
  var instance = V.shallowRef(santy());

  V.onMounted(function () {
    if (instance.value) return;
    // santy.js is usually deferred; poll briefly rather than racing the tag.
    var tries = 0;
    var id = setInterval(function () {
      var S = santy();
      if (S) { instance.value = S; clearInterval(id); }
      else if (++tries > 50) clearInterval(id);
    }, 40);
    V.onUnmounted(function () { clearInterval(id); });
  });

  return instance;
}

/* ─── overlay composables ──────────────────────────────────────────────── */

function makeOverlayComposable(apiName) {
  return function useOverlay(options) {
    var V = vue();
    var opts = options || {};
    var S = useSanty();
    var el = V.ref(null);
    var isOpen = V.ref(!!opts.defaultOpen);

    function onShown() { isOpen.value = true; if (opts.onOpen) opts.onOpen(); }
    function onHidden() { isOpen.value = false; if (opts.onClose) opts.onClose(); }

    V.onMounted(function () {
      if (!el.value) return;
      el.value.addEventListener('santy:shown', onShown);
      el.value.addEventListener('santy:hidden', onHidden);
      if (opts.defaultOpen && S.value) S.value[apiName].open(el.value);
    });
    V.onUnmounted(function () {
      if (!el.value) return;
      el.value.removeEventListener('santy:shown', onShown);
      el.value.removeEventListener('santy:hidden', onHidden);
    });

    function call(fn) {
      return function () { if (S.value && el.value) S.value[apiName][fn](el.value); };
    }

    return {
      el: el,
      isOpen: isOpen,
      open: call('open'),
      close: call('close'),
      toggle: call('toggle'),
    };
  };
}

var useModal = makeOverlayComposable('modal');
var useDrawer = makeOverlayComposable('drawer');
var useBottomSheet = makeOverlayComposable('sheet');

/* ─── useTheme ─────────────────────────────────────────────────────────── */

function useTheme() {
  var V = vue();
  var S = useSanty();
  var theme = V.ref(
    typeof document === 'undefined'
      ? 'light'
      : document.documentElement.getAttribute('data-theme') || 'light'
  );

  function onChange(e) { theme.value = e.detail.theme; }

  V.onMounted(function () {
    document.documentElement.addEventListener('santy:theme', onChange);
    if (S.value) theme.value = S.value.theme.get();
  });
  V.onUnmounted(function () {
    document.documentElement.removeEventListener('santy:theme', onChange);
  });

  return {
    theme: theme,
    isDark: V.computed(function () { return theme.value === 'dark'; }),
    setTheme: function (name) { if (S.value) S.value.theme.set(name); },
    toggle: function () { if (S.value) S.value.theme.toggle(); },
    system: function () { if (S.value) S.value.theme.system(); },
  };
}

/* ─── useToast ─────────────────────────────────────────────────────────── */

function useToast() {
  var S = useSanty();
  function show(message, options) {
    if (!S.value) return { dismiss: function () {} };
    return S.value.toast(message, options);
  }
  ['success', 'error', 'warning', 'info'].forEach(function (v) {
    show[v] = function (message, options) {
      return show(message, Object.assign({}, options, { variant: v }));
    };
  });
  return show;
}

/* ─── useDisclosure ────────────────────────────────────────────────────── */

function useDisclosure(defaultOpen) {
  var V = vue();
  var isOpen = V.ref(!!defaultOpen);
  return {
    isOpen: isOpen,
    open: function () { isOpen.value = true; },
    close: function () { isOpen.value = false; },
    toggle: function () { isOpen.value = !isOpen.value; },
  };
}

/* ─── components ───────────────────────────────────────────────────────── */

function createComponent(name, defaultClass, tag) {
  return {
    name: name,
    inheritAttrs: false,
    setup: function (props, ctx) {
      var V = vue();
      var el = V.ref(null);
      var S = useSanty();
      // New slot content needs santy.js to (re-)apply ARIA wiring.
      V.onMounted(function () { if (S.value && el.value) S.value.init(el.value); });
      V.onUpdated(function () { if (S.value && el.value) S.value.init(el.value); });
      return function () {
        var attrs = Object.assign({}, ctx.attrs);
        var cls = attrs.class;
        delete attrs.class;
        return V.h(tag || 'div',
          Object.assign({ ref: el, class: cn(defaultClass, cls) }, attrs),
          ctx.slots.default ? ctx.slots.default() : undefined);
      };
    },
  };
}

var SantyCard = createComponent('SantyCard', 'card', 'div');
var SantyCardHeader = createComponent('SantyCardHeader', 'card-header', 'div');
var SantyCardBody = createComponent('SantyCardBody', 'card-body', 'div');
var SantyCardFooter = createComponent('SantyCardFooter', 'card-footer', 'div');
var SantyAlert = createComponent('SantyAlert', 'alert', 'div');
var SantyBadge = createComponent('SantyBadge', 'badge', 'span');
var SantyProse = createComponent('SantyProse', 'prose', 'article');
var SantyModalBox = createComponent('SantyModalBox', 'modal-box', 'div');

var SantyButton = {
  name: 'SantyButton',
  inheritAttrs: false,
  props: {
    variant: { type: String, default: '' },
    size: { type: String, default: '' },
    ripple: { type: Boolean, default: false },
  },
  setup: function (props, ctx) {
    var V = vue();
    return function () {
      var attrs = Object.assign({}, ctx.attrs);
      var cls = attrs.class;
      delete attrs.class;
      var extra = props.ripple ? { 'data-santy-ripple': '' } : {};
      return V.h('button', Object.assign({
        type: attrs.type || 'button',
        class: cn('btn',
          props.variant && 'btn-' + props.variant,
          props.size && 'btn-' + props.size,
          cls),
      }, extra, attrs), ctx.slots.default ? ctx.slots.default() : undefined);
    };
  },
};

/** <SantyModal v-model="open"> — two-way bound to santy.js overlay state. */
var SantyModal = {
  name: 'SantyModal',
  inheritAttrs: false,
  props: {
    modelValue: { type: Boolean, default: false },
    staticBackdrop: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'opened', 'closed'],
  setup: function (props, ctx) {
    var V = vue();
    var el = V.ref(null);
    var S = useSanty();

    function onShown() { ctx.emit('update:modelValue', true); ctx.emit('opened'); }
    function onHidden() { ctx.emit('update:modelValue', false); ctx.emit('closed'); }

    V.onMounted(function () {
      if (!el.value) return;
      el.value.addEventListener('santy:shown', onShown);
      el.value.addEventListener('santy:hidden', onHidden);
      if (props.modelValue && S.value) S.value.modal.open(el.value);
    });
    V.onUnmounted(function () {
      if (!el.value) return;
      el.value.removeEventListener('santy:shown', onShown);
      el.value.removeEventListener('santy:hidden', onHidden);
    });

    V.watch(function () { return [props.modelValue, S.value]; }, function (next) {
      var want = next[0], api = next[1];
      if (!api || !el.value) return;
      if (want) api.modal.open(el.value);
      else api.modal.close(el.value);
    });

    return function () {
      var attrs = Object.assign({}, ctx.attrs);
      var cls = attrs.class;
      delete attrs.class;
      var extra = props.staticBackdrop ? { 'data-santy-backdrop': 'static' } : {};
      return V.h('div',
        Object.assign({ ref: el, class: cn('modal-overlay', cls) }, extra, attrs),
        ctx.slots.default ? ctx.slots.default() : undefined);
    };
  },
};

/** Vue plugin: app.use(SantyCSS) registers every component globally. */
var plugin = {
  install: function (app) {
    var all = {
      SantyButton: SantyButton, SantyCard: SantyCard, SantyCardHeader: SantyCardHeader,
      SantyCardBody: SantyCardBody, SantyCardFooter: SantyCardFooter,
      SantyAlert: SantyAlert, SantyBadge: SantyBadge, SantyProse: SantyProse,
      SantyModal: SantyModal, SantyModalBox: SantyModalBox,
    };
    Object.keys(all).forEach(function (n) { app.component(n, all[n]); });
    app.config.globalProperties.$santyToast = function (m, o) {
      var S = santy();
      return S ? S.toast(m, o) : null;
    };
  },
};

module.exports = {
  cn: cn,
  useSanty: useSanty,
  useModal: useModal,
  useDrawer: useDrawer,
  useBottomSheet: useBottomSheet,
  useTheme: useTheme,
  useToast: useToast,
  useDisclosure: useDisclosure,
  SantyButton: SantyButton,
  SantyCard: SantyCard, SantyCardHeader: SantyCardHeader,
  SantyCardBody: SantyCardBody, SantyCardFooter: SantyCardFooter,
  SantyAlert: SantyAlert, SantyBadge: SantyBadge, SantyProse: SantyProse,
  SantyModal: SantyModal, SantyModalBox: SantyModalBox,
  default: plugin,
  plugin: plugin,
};
