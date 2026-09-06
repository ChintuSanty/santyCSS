/*! @santycss/react — React bindings for SantyCSS | MIT
 *
 * Hooks and components over santy.js. Written with React.createElement rather
 * than JSX, so the package ships as plain JavaScript with no build step — the
 * same promise the CSS makes.
 *
 *   import { useModal, useTheme, useToast, Modal, cn } from 'santycss/react';
 *
 * React is a peer dependency and is required lazily, so importing this module
 * on a server without React installed will not crash the bundle graph.
 */
'use strict';

var cn = require('../merge/santy-merge.js');

/* React is resolved lazily so this file stays importable in a plain Node
   test run, where only the pure helpers (cn) are exercised. */
var React = null;
function react() {
  if (React) return React;
  try {
    React = require('react');
  } catch (e) {
    throw new Error('@santycss/react requires "react" as a peer dependency.');
  }
  return React;
}

function santy() {
  if (typeof window === 'undefined') return null;
  return window.Santy || null;
}

/* ─── useIsomorphicLayoutEffect ─────────────────────────────────────────────
   useLayoutEffect warns during SSR; fall back to useEffect on the server. */
function useIsoLayoutEffect(fn, deps) {
  var R = react();
  var hook = typeof window !== 'undefined' ? R.useLayoutEffect : R.useEffect;
  return hook(fn, deps);
}

/* ─── useSanty ─────────────────────────────────────────────────────────────
   Resolves the global Santy object once it exists. Returns null until then,
   so components render correctly during SSR and the first client paint. */
function useSanty() {
  var R = react();
  var ref = R.useState(santy());
  var value = ref[0], setValue = ref[1];

  R.useEffect(function () {
    if (value || typeof window === 'undefined') return;
    // santy.js may be deferred; poll briefly rather than racing the script tag.
    var tries = 0;
    var id = setInterval(function () {
      var S = santy();
      if (S) { setValue(S); clearInterval(id); }
      else if (++tries > 50) clearInterval(id);
    }, 40);
    return function () { clearInterval(id); };
  }, [value]);

  return value;
}

/* ─── useOverlay (modal / drawer / bottom sheet) ───────────────────────── */

function makeOverlayHook(apiName) {
  return function useOverlay(options) {
    var R = react();
    var opts = options || {};
    var S = useSanty();
    var ref = R.useRef(null);
    var state = R.useState(!!opts.defaultOpen);
    var isOpen = state[0], setIsOpen = state[1];

    // Track the caller's handlers in a ref so the effect below does not
    // re-subscribe on every render when they are defined inline.
    var handlers = R.useRef(opts);
    handlers.current = opts;

    R.useEffect(function () {
      var el = ref.current;
      if (!el) return;
      function onShown() { setIsOpen(true); if (handlers.current.onOpen) handlers.current.onOpen(); }
      function onHidden() { setIsOpen(false); if (handlers.current.onClose) handlers.current.onClose(); }
      el.addEventListener('santy:shown', onShown);
      el.addEventListener('santy:hidden', onHidden);
      return function () {
        el.removeEventListener('santy:shown', onShown);
        el.removeEventListener('santy:hidden', onHidden);
      };
    }, []);

    var open = R.useCallback(function () {
      if (S && ref.current) S[apiName].open(ref.current);
    }, [S]);
    var close = R.useCallback(function () {
      if (S && ref.current) S[apiName].close(ref.current);
    }, [S]);
    var toggle = R.useCallback(function () {
      if (S && ref.current) S[apiName].toggle(ref.current);
    }, [S]);

    // Open on mount when asked, once santy.js is actually available.
    useIsoLayoutEffect(function () {
      if (opts.defaultOpen && S && ref.current) S[apiName].open(ref.current);
    }, [S]);

    return { ref: ref, isOpen: isOpen, open: open, close: close, toggle: toggle };
  };
}

var useModal = makeOverlayHook('modal');
var useDrawer = makeOverlayHook('drawer');
var useBottomSheet = makeOverlayHook('sheet');

/* ─── useTheme ─────────────────────────────────────────────────────────── */

function useTheme() {
  var R = react();
  var S = useSanty();
  var state = R.useState(function () {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.getAttribute('data-theme') || 'light';
  });
  var theme = state[0], setThemeState = state[1];

  R.useEffect(function () {
    if (typeof document === 'undefined') return;
    function onChange(e) { setThemeState(e.detail.theme); }
    document.documentElement.addEventListener('santy:theme', onChange);
    if (S) setThemeState(S.theme.get());
    return function () { document.documentElement.removeEventListener('santy:theme', onChange); };
  }, [S]);

  var setTheme = R.useCallback(function (name) { if (S) S.theme.set(name); }, [S]);
  var toggle = R.useCallback(function () { if (S) S.theme.toggle(); }, [S]);
  var system = R.useCallback(function () { if (S) S.theme.system(); }, [S]);

  return { theme: theme, isDark: theme === 'dark', setTheme: setTheme, toggle: toggle, system: system };
}

/* ─── useToast ─────────────────────────────────────────────────────────── */

function useToast() {
  var R = react();
  var S = useSanty();
  return R.useMemo(function () {
    function show(message, options) {
      if (!S) return { dismiss: function () {} };
      return S.toast(message, options);
    }
    ['success', 'error', 'warning', 'info'].forEach(function (v) {
      show[v] = function (message, options) {
        var o = Object.assign({}, options, { variant: v });
        return show(message, o);
      };
    });
    return show;
  }, [S]);
}

/* ─── useDisclosure — headless open/close state for anything ───────────── */

function useDisclosure(defaultOpen) {
  var R = react();
  var s = R.useState(!!defaultOpen);
  var isOpen = s[0], set = s[1];
  return {
    isOpen: isOpen,
    open: R.useCallback(function () { set(true); }, []),
    close: R.useCallback(function () { set(false); }, []),
    toggle: R.useCallback(function () { set(function (v) { return !v; }); }, []),
  };
}

/* ─── components ───────────────────────────────────────────────────────── */

/** Re-run santy.js wiring whenever children change (new markup needs ARIA). */
function useSantyInit(ref, deps) {
  var S = useSanty();
  var R = react();
  R.useEffect(function () {
    if (S && ref.current) S.init(ref.current);
  }, [S].concat(deps || []));
}

function createComponent(displayName, defaultClass, tag) {
  function Component(props) {
    var R = react();
    var rest = Object.assign({}, props);
    var className = rest.className;
    var children = rest.children;
    var innerRef = rest.innerRef;
    delete rest.className; delete rest.children; delete rest.innerRef;

    var localRef = R.useRef(null);
    var ref = innerRef || localRef;
    useSantyInit(ref, [children]);

    return R.createElement(
      tag || 'div',
      Object.assign({ ref: ref, className: cn(defaultClass, className) }, rest),
      children
    );
  }
  Component.displayName = displayName;
  return Component;
}

var Card = createComponent('Card', 'card', 'div');
var CardHeader = createComponent('CardHeader', 'card-header', 'div');
var CardBody = createComponent('CardBody', 'card-body', 'div');
var CardFooter = createComponent('CardFooter', 'card-footer', 'div');
var Alert = createComponent('Alert', 'alert', 'div');
var Badge = createComponent('Badge', 'badge', 'span');
var Prose = createComponent('Prose', 'prose', 'article');

/** <Button variant="primary" size="lg" ripple /> */
function Button(props) {
  var R = react();
  var rest = Object.assign({}, props);
  var variant = rest.variant, size = rest.size, ripple = rest.ripple;
  var className = rest.className, children = rest.children;
  delete rest.variant; delete rest.size; delete rest.ripple;
  delete rest.className; delete rest.children;

  var ref = R.useRef(null);
  useSantyInit(ref, []);

  return R.createElement('button', Object.assign({
    ref: ref,
    type: rest.type || 'button',
    className: cn('btn', variant && 'btn-' + variant, size && 'btn-' + size, className),
  }, ripple ? { 'data-santy-ripple': '' } : null, rest), children);
}
Button.displayName = 'Button';

/**
 * <Modal isOpen onClose={…}> — a controlled wrapper over the overlay hook.
 * Renders in place rather than through a portal: santy.js already applies
 * `inert` to the rest of the page, so a portal buys nothing here.
 */
function Modal(props) {
  var R = react();
  var isOpen = props.isOpen, onClose = props.onClose;
  var className = props.className, children = props.children;
  var staticBackdrop = props.staticBackdrop;
  var S = useSanty();
  var ref = R.useRef(null);

  R.useEffect(function () {
    var el = ref.current;
    if (!el || !onClose) return;
    function onHidden() { onClose(); }
    el.addEventListener('santy:hidden', onHidden);
    return function () { el.removeEventListener('santy:hidden', onHidden); };
  }, [onClose]);

  R.useEffect(function () {
    if (!S || !ref.current) return;
    if (isOpen) S.modal.open(ref.current);
    else S.modal.close(ref.current);
  }, [S, isOpen]);

  var extra = {};
  if (staticBackdrop) extra['data-santy-backdrop'] = 'static';

  return R.createElement('div',
    Object.assign({ ref: ref, className: cn('modal-overlay', className) }, extra),
    children);
}
Modal.displayName = 'Modal';

var ModalHeader = createComponent('ModalHeader', 'modal-header', 'div');
var ModalBody = createComponent('ModalBody', 'modal-body', 'div');
var ModalFooter = createComponent('ModalFooter', 'modal-footer', 'div');
var ModalBox = createComponent('ModalBox', 'modal-box', 'div');

module.exports = {
  cn: cn,
  useSanty: useSanty,
  useModal: useModal,
  useDrawer: useDrawer,
  useBottomSheet: useBottomSheet,
  useTheme: useTheme,
  useToast: useToast,
  useDisclosure: useDisclosure,
  Button: Button,
  Card: Card, CardHeader: CardHeader, CardBody: CardBody, CardFooter: CardFooter,
  Alert: Alert, Badge: Badge, Prose: Prose,
  Modal: Modal, ModalBox: ModalBox,
  ModalHeader: ModalHeader, ModalBody: ModalBody, ModalFooter: ModalFooter,
};
