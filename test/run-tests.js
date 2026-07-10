#!/usr/bin/env node
/**
 * SantyCSS test suite  —  node test/run-tests.js
 * Sanity + regression checks on the generated dist/ output.
 * Run `node build.js` first (or `npm test`, which does both).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

let passed = 0;
let failed = 0;
const fails = [];

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failed++;
    fails.push(`✗ ${name}\n    ${e.message}`);
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }

const read = f => fs.readFileSync(path.join(DIST, f), 'utf8');

// ── 1. Files exist and are non-trivial ──────────────────────────────────────
const REQUIRED = {
  'santy.css': 500000, 'santy.min.css': 400000, 'santy-core.css': 100000,
  'santy-variants.css': 100000, 'santy-start.css': 200000, 'santy-components.css': 100000,
  'santy-animations.css': 20000, 'santy-email.css': 5000, 'santy-scroll.js': 500,
  'santy-themes.css': 1000, 'santy-classmap.json': 100000,
  'santy-reset.css': 500, 'santy-layout.css': 10000, 'santy-flex.css': 1000,
  'santy-grid.css': 1000, 'santy-spacing.css': 10000, 'santy-sizing.css': 3000,
  'santy-typography.css': 3000, 'santy-colors.css': 30000, 'santy-borders.css': 5000,
  'santy-effects.css': 5000,
};
for (const [file, minSize] of Object.entries(REQUIRED)) {
  test(`dist/${file} exists and ≥ ${minSize}B`, () => {
    const p = path.join(DIST, file);
    assert(fs.existsSync(p), `${file} missing`);
    const size = fs.statSync(p).size;
    assert(size >= minSize, `${file} is ${size}B, expected ≥ ${minSize}B`);
  });
}

// ── 2. Core utilities present ────────────────────────────────────────────────
const css = read('santy.css');
[
  '.make-flex', '.make-grid', '.add-padding-24', '.add-margin-16',
  '.set-text-16', '.set-width-320', '.round-corners-12', '.add-shadow-md',
  '.background-blue-500', '.color-gray-900', '.border-color-red-500',
  '.grid-cols-12', '.gap-16', '.align-center', '.justify-between',
  '.position-sticky', '.pin-top-0', '.opacity-50', '.transition-all',
].forEach(sel => test(`utility ${sel}`, () => assert(css.includes(sel + ' '), `${sel} not found`)));

// ── 3. Variants ──────────────────────────────────────────────────────────────
[
  'on-hover\\:', 'on-focus\\:', 'dark\\:', 'md\\:', 'lg\\:',
  'on-mobile\\:', 'group-hover\\:', 'peer-checked\\:',
  'has-checked\\:', 'has-focus\\:', 'has-invalid\\:', 'group-has-checked\\:',
  'motion-safe\\:', 'motion-reduce\\:', 'print\\:',
].forEach(v => test(`variant ${v.replace('\\\\', '')}`, () => assert(css.includes('.' + v), `${v} not found`)));

// ── 4. :has() selectors actually valid ───────────────────────────────────────
test(':has() rules use real :has() selectors', () => {
  assert(/\.has-checked\\:[a-z0-9-]+:has\(:checked\)/.test(css), 'has-checked rule malformed');
  assert(/\.group:has\(:focus\)/.test(css), 'group-has rule malformed');
});

// ── 5. New v2.7.0 components ─────────────────────────────────────────────────
const comp = read('santy-components.css');
[
  '.toast', '.toast-container', '.toast-success',
  '.switch', '.switch-slider', '.checkbox', '.radio', '.range',
  '.carousel', '.carousel-item', '.carousel-dot',
  '.dialog', '.dialog::backdrop', '.popover', '.file-drop',
].forEach(sel => test(`component ${sel}`, () => assert(comp.includes(sel), `${sel} not found in components`)));

// ── 6. Semantic theming ──────────────────────────────────────────────────────
test('semantic tokens in :root', () => {
  ['--santy-surface:', '--santy-text:', '--santy-text-muted:', '--santy-border-color:']
    .forEach(t => assert(css.includes(t), `${t} missing from santy.css`));
});
test('semantic utilities', () => {
  ['.background-surface', '.color-text', '.color-text-muted', '.border-color-default']
    .forEach(c => assert(css.includes(c + ' '), `${c} missing`));
});
const themes = read('santy-themes.css');
['ocean', 'sunset', 'forest', 'midnight', 'mono'].forEach(t =>
  test(`theme "${t}"`, () => assert(themes.includes(`[data-theme="${t}"]`), `${t} theme missing`)));

// ── 7. Classmap ──────────────────────────────────────────────────────────────
test('classmap is valid JSON with >15k classes', () => {
  const map = JSON.parse(read('santy-classmap.json'));
  assert(Array.isArray(map.classes), 'classes not an array');
  assert(map.count === map.classes.length, `count ${map.count} !== length ${map.classes.length}`);
  assert(map.count > 15000, `only ${map.count} classes`);
  ['make-flex', 'add-padding-24', 'on-hover:scale-105', 'has-checked:background-blue-500', 'toast', 'switch']
    .forEach(c => assert(map.classes.includes(c), `classmap missing "${c}"`));
});

// ── 8. Minified output is structurally sound ─────────────────────────────────
test('santy.min.css braces balanced, no comments', () => {
  const min = read('santy.min.css');
  const open = (min.match(/\{/g) || []).length;
  const close = (min.match(/\}/g) || []).length;
  assert(open === close, `braces unbalanced: ${open} open vs ${close} close`);
  assert(!min.includes('/*'), 'comments not stripped');
});
test('santy.css braces balanced', () => {
  const open = (css.match(/\{/g) || []).length;
  const close = (css.match(/\}/g) || []).length;
  assert(open === close, `braces unbalanced: ${open} vs ${close}`);
});

// ── 9. package.json exports resolve to real files ────────────────────────────
test('package.json exports resolve', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  for (const [key, rel] of Object.entries(pkg.exports)) {
    assert(fs.existsSync(path.join(ROOT, rel)), `export "${key}" → ${rel} missing`);
  }
  for (const [name, rel] of Object.entries(pkg.bin || {})) {
    assert(fs.existsSync(path.join(ROOT, rel)), `bin "${name}" → ${rel} missing`);
  }
});

// ── 10. CLI init scaffolds ───────────────────────────────────────────────────
test('cli.js init scaffolds a starter', () => {
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'santy-test-'));
  const { execFileSync } = require('child_process');
  execFileSync('node', [path.join(ROOT, 'cli.js'), 'init', tmp]);
  const out = path.join(tmp, 'index.html');
  assert(fs.existsSync(out), 'index.html not created');
  const html = fs.readFileSync(out, 'utf8');
  assert(html.includes('cdn.jsdelivr.net/npm/santycss'), 'CDN link missing');
  fs.rmSync(tmp, { recursive: true, force: true });
});

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed`);
if (failed) {
  console.log('\n' + fails.join('\n'));
  process.exit(1);
}
console.log('✅ All tests passed');
