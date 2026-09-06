/*! @santycss/merge — conflict-aware class merging | MIT
 *
 * The problem this solves: in any component library you end up composing class
 * strings, and the loser is decided by CSS source order, not by argument order.
 *
 *   <Card class="add-padding-24" />  +  user passes "add-padding-8"
 *   → "add-padding-24 add-padding-8" → whichever the stylesheet defines last wins
 *
 * cn() drops the earlier class whenever a later one targets the same property,
 * so the last argument always wins — which is what callers expect.
 *
 *   cn('add-padding-24', 'add-padding-8')            → 'add-padding-8'
 *   cn('background-blue-500', 'background-red-500')  → 'background-red-500'
 *   cn('add-padding-24', 'add-padding-x-8')          → 'add-padding-24 add-padding-x-8'
 *   cn('md:add-padding-24', 'add-padding-8')         → 'md:add-padding-24 add-padding-8'
 *
 * Variants are scoped: `md:add-padding-4` never conflicts with `add-padding-8`,
 * because they apply at different breakpoints.
 *
 *   const { cn } = require('@santycss/merge');
 *   import { cn } from 'santycss/merge';
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.santyMerge = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Conflict groups, most specific pattern first — the first match wins, so
   * `add-padding-top-8` must be tested before `add-padding-8`.
   *
   * Two classes conflict when they resolve to the same group key AND carry the
   * same variant prefix. Sub-axis classes (padding-x vs padding-top) get their
   * own keys, because they genuinely set different properties.
   */
  var GROUPS = [
    /* ── spacing: side-specific before axis before all-sides ── */
    [/^add-padding-(top|bottom|left|right|start|end|block|inline)-/, 'p-$1'],
    [/^add-padding-(x|y)-/, 'p-$1'],
    [/^add-padding-\d/, 'p'],
    [/^add-margin-(top|bottom|left|right|start|end|block|inline)-/, 'm-$1'],
    [/^add-margin-(x|y)-/, 'm-$1'],
    [/^add-margin-(\d|auto)/, 'm'],

    /* ── sizing ── */
    [/^set-min-width-/, 'min-w'],
    [/^set-max-width-/, 'max-w'],
    [/^set-min-height-/, 'min-h'],
    [/^set-max-height-/, 'max-h'],
    [/^set-width-/, 'w'],
    [/^set-height-/, 'h'],
    [/^set-size-/, 'size'],
    [/^set-text-/, 'text-size'],
    [/^set-font-weight-/, 'font-weight'],

    /* ── color ── */
    [/^background-/, 'bg'],
    [/^border-color-/, 'border-color'],
    [/^color-/, 'color'],
    [/^caret-/, 'caret'],

    /* ── border ── */
    [/^add-border-(top|bottom|left|right|start|end|block|inline)-/, 'border-$1'],
    [/^add-border-\d/, 'border-w'],
    [/^round-corners-/, 'radius'],
    [/^(make-circle|make-pill)$/, 'radius'],

    /* ── effects ── */
    [/^add-shadow-/, 'shadow'],
    [/^opacity-/, 'opacity'],

    /* ── layout ── */
    [/^(make-flex|make-grid|make-block|make-inline-block|make-inline-flex|make-inline|make-hidden|make-contents|make-table)$/, 'display'],
    [/^(flex-row|flex-row-reverse|flex-column|flex-column-reverse)$/, 'flex-dir'],
    [/^(flex-wrap|flex-nowrap|flex-wrap-reverse)$/, 'flex-wrap'],
    [/^align-/, 'align-items'],
    [/^justify-/, 'justify'],
    [/^grid-cols-/, 'grid-cols'],
    [/^grid-rows-/, 'grid-rows'],
    [/^gap-(x|y)-/, 'gap-$1'],
    [/^gap-\d/, 'gap'],
    [/^position-/, 'position'],
    [/^pin-(top|bottom|left|right)-/, 'pin-$1'],
    [/^z-/, 'z'],
    [/^overflow-(x|y)-/, 'overflow-$1'],
    [/^overflow-/, 'overflow'],

    /* ── typography ── */
    [/^(text-left|text-center|text-right|text-justify|text-start|text-end)$/, 'text-align'],
    [/^(text-bold|text-semibold|text-medium|text-light|text-thin|text-normal|text-extrabold|text-black)$/, 'font-weight'],
    [/^(text-uppercase|text-lowercase|text-capitalize|text-normal-case)$/, 'text-transform'],
    [/^line-height-/, 'leading'],
    [/^letter-space-/, 'tracking'],
    [/^text-clamp-/, 'line-clamp'],

    /* ── misc ── */
    [/^cursor-/, 'cursor'],
    [/^object-fit-/, 'object-fit'],
    [/^object-position-/, 'object-position'],
    [/^aspect-/, 'aspect'],
    [/^(scale-|rotate-|translate-x-|translate-y-)/, null], // transforms compose — never drop
    [/^pointer-events-/, 'pointer-events'],
    [/^user-select-/, 'user-select'],
  ];

  var groupCache = Object.create(null);

  /**
   * Resolve a bare class (no variant prefix) to its conflict group key,
   * or null when the class composes rather than conflicts.
   */
  function groupOf(base) {
    if (base in groupCache) return groupCache[base];
    var key = null;
    for (var i = 0; i < GROUPS.length; i++) {
      var m = GROUPS[i][0].exec(base);
      if (m) {
        var target = GROUPS[i][1];
        // A null target marks a composing family (transforms), never dropped.
        key = target === null ? null
            : target.replace(/\$(\d)/g, function (_, n) { return m[Number(n)]; });
        break;
      }
    }
    groupCache[base] = key;
    return key;
  }

  /**
   * Split `md:on-hover:add-padding-8` into its variant prefix and base class.
   * Arbitrary values can contain colons inside brackets, so bracket depth is
   * tracked rather than splitting on every colon.
   */
  function splitVariants(cls) {
    var depth = 0, lastColon = -1;
    for (var i = 0; i < cls.length; i++) {
      var c = cls.charAt(i);
      if (c === '[') depth++;
      else if (c === ']') depth--;
      else if (c === ':' && depth === 0) lastColon = i;
    }
    return lastColon === -1
      ? { variants: '', base: cls }
      : { variants: cls.slice(0, lastColon), base: cls.slice(lastColon + 1) };
  }

  /** Flatten the clsx-style argument forms into a flat class string. */
  function toClassString(args) {
    var out = [];
    for (var i = 0; i < args.length; i++) {
      var a = args[i];
      if (!a) continue;
      var t = typeof a;
      if (t === 'string' || t === 'number') {
        out.push(String(a));
      } else if (Array.isArray(a)) {
        var inner = toClassString(a);
        if (inner) out.push(inner);
      } else if (t === 'object') {
        for (var k in a) {
          if (Object.prototype.hasOwnProperty.call(a, k) && a[k]) out.push(k);
        }
      }
    }
    return out.join(' ');
  }

  /**
   * Merge class names, dropping earlier classes that a later class overrides.
   * Accepts the same argument shapes as clsx: strings, arrays, and
   * `{ 'class-name': condition }` objects.
   */
  function cn() {
    var classes = toClassString(Array.prototype.slice.call(arguments))
      .split(/\s+/)
      .filter(Boolean);
    if (classes.length < 2) return classes.join(' ');

    var seen = Object.create(null);
    var keep = new Array(classes.length);

    // Walk backwards so the last occurrence of a group is the one retained.
    for (var i = classes.length - 1; i >= 0; i--) {
      var cls = classes[i];
      var parts = splitVariants(cls);
      var group = groupOf(parts.base);

      if (group === null) {
        // Not a known conflict group — dedupe exact repeats only.
        var exact = 'x:' + cls;
        if (seen[exact]) { keep[i] = false; continue; }
        seen[exact] = true;
        keep[i] = true;
        continue;
      }

      var id = parts.variants + '|' + group;
      if (seen[id]) { keep[i] = false; continue; }
      seen[id] = true;
      keep[i] = true;
    }

    var out = [];
    for (var j = 0; j < classes.length; j++) if (keep[j]) out.push(classes[j]);
    return out.join(' ');
  }

  /**
   * Build a cn() that also understands your own conflict groups.
   *
   *   const cn = extend([[/^brand-tone-/, 'brand-tone']]);
   */
  function extend(extraGroups) {
    var merged = (extraGroups || []).concat(GROUPS);
    return function () {
      var saved = GROUPS;
      var savedCache = groupCache;
      GROUPS = merged;
      groupCache = Object.create(null);
      try {
        return cn.apply(null, arguments);
      } finally {
        GROUPS = saved;
        groupCache = savedCache;
      }
    };
  }

  cn.cn = cn;
  cn.clsx = function () { return toClassString(Array.prototype.slice.call(arguments)); };
  cn.groupOf = groupOf;
  cn.splitVariants = splitVariants;
  cn.extend = extend;
  cn.default = cn;

  return cn;
}));
