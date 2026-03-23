/**
 * SantyCSS Framework Builder
 * Generates santy.css — a plain-English utility-first CSS framework.
 */

const fs   = require('fs');
const path = require('path');
const { ANIMATION_CSS } = require('./lib/animations');

// ─── VALUE RANGES ───────────────────────────────────────────────────────────
const spacing = [];
for (let i = 0; i <= 50; i++) spacing.push(i);
for (let i = 52; i <= 200; i += 4) spacing.push(i);
[220, 240, 256, 280, 320, 360, 384, 400, 448, 512, 640, 768, 1024].forEach(v => { if (!spacing.includes(v)) spacing.push(v); });

const fontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, 120, 144];
const radii = [...new Set([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 128])];
const borderWidths = [...new Set([0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48])];
const zIndexes = [0, 1, 2, 3, 5, 10, 20, 30, 40, 50, 100, 200, 500, 999, 1000, 9999];
const opacities = [];
for (let i = 0; i <= 100; i += 5) opacities.push(i);
const gridCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const lineHeights = [1, 1.25, 1.375, 1.5, 1.625, 1.75, 2, 2.5, 3];

// ─── COLOR PALETTE ──────────────────────────────────────────────────────────
const palette = {
  red:     { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d' },
  orange:  { 50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12' },
  amber:   { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f' },
  yellow:  { 50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207',800:'#854d0e',900:'#713f12' },
  lime:    { 50:'#f7fee7',100:'#ecfccb',200:'#d9f99d',300:'#bef264',400:'#a3e635',500:'#84cc16',600:'#65a30d',700:'#4d7c0f',800:'#3f6212',900:'#365314' },
  green:   { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d' },
  teal:    { 50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a' },
  cyan:    { 50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4',600:'#0891b2',700:'#0e7490',800:'#155e75',900:'#164e63' },
  blue:    { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
  indigo:  { 50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81' },
  violet:  { 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95' },
  purple:  { 50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87' },
  pink:    { 50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843' },
  rose:    { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337' },
  slate:   { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a' },
  gray:    { 50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827' },
  zinc:    { 50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',500:'#71717a',600:'#52525b',700:'#3f3f46',800:'#27272a',900:'#18181b' },
  stone:   { 50:'#fafaf9',100:'#f5f5f4',200:'#e7e5e4',300:'#d6d3d1',400:'#a8a29e',500:'#78716c',600:'#57534e',700:'#44403c',800:'#292524',900:'#1c1917' },
};
const namedColors = { white: '#ffffff', black: '#000000', transparent: 'transparent', current: 'currentColor' };

// ─── CSS OUTPUT BUILDER ─────────────────────────────────────────────────────
const lines = [];
const add = (...css) => lines.push(...css);

// ─── CSS RESET + BASE ────────────────────────────────────────────────────────
add(
`/* ============================================================
   SantyCSS v1.9.0  —  Plain-English Utility CSS Framework
   https://github.com/santybad/santy_css
   ============================================================ */

/* ── Box Sizing Reset ── */
*, *::before, *::after { box-sizing: border-box; }

/* ── CSS Custom Properties (Theme) ── */
:root {
  /* ── Design Tokens (override to customise) ── */
  --santy-primary:        #3b82f6;
  --santy-primary-dark:   #2563eb;
  --santy-primary-light:  #dbeafe;
  --santy-secondary:      #6b7280;
  --santy-success:        #22c55e;
  --santy-warning:        #f59e0b;
  --santy-danger:         #ef4444;
  --santy-info:           #06b6d4;
  --santy-radius-sm:      4px;
  --santy-radius:         8px;
  --santy-radius-md:      12px;
  --santy-radius-lg:      16px;
  --santy-radius-xl:      24px;
  --santy-radius-full:    9999px;
  --santy-font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --santy-font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --santy-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  --santy-transition-fast: all 0.15s ease;
  --santy-transition-normal: all 0.3s ease;
  --santy-transition-slow: all 0.5s ease;
  --santy-shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --santy-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  --santy-shadow-md: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  --santy-shadow-lg: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  --santy-shadow-xl: 0 25px 50px -12px rgba(0,0,0,0.25);
  --santy-shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,0.06);
}
`);

// ─── DISPLAY ────────────────────────────────────────────────────────────────
add(
`/* ── Display ── */
.make-block        { display: block; }
.make-inline       { display: inline; }
.make-inline-block { display: inline-block; }
.make-flex         { display: flex; }
.make-inline-flex  { display: inline-flex; }
.make-grid         { display: grid; }
.make-inline-grid  { display: inline-grid; }
.make-table        { display: table; }
.make-hidden       { display: none; }
.make-contents     { display: contents; }
`);

// ─── VISIBILITY ─────────────────────────────────────────────────────────────
add(
`/* ── Visibility ── */
.make-visible   { visibility: visible; }
.make-invisible { visibility: hidden; }
.make-collapse  { visibility: collapse; }
`);

// ─── FLEX ────────────────────────────────────────────────────────────────────
add(
`/* ── Flex Direction ── */
.flex-row            { flex-direction: row; }
.flex-row-reverse    { flex-direction: row-reverse; }
.flex-column         { flex-direction: column; }
.flex-column-reverse { flex-direction: column-reverse; }

/* ── Flex Wrap ── */
.flex-wrap        { flex-wrap: wrap; }
.flex-wrap-reverse{ flex-wrap: wrap-reverse; }
.flex-nowrap      { flex-wrap: nowrap; }

/* ── Flex Grow / Shrink / None ── */
.flex-grow        { flex-grow: 1; }
.flex-grow-none   { flex-grow: 0; }
.flex-shrink      { flex-shrink: 1; }
.flex-shrink-none { flex-shrink: 0; }
.flex-auto        { flex: 1 1 auto; }
.flex-initial     { flex: 0 1 auto; }
.flex-none        { flex: none; }
.flex-equal       { flex: 1; }

/* ── Align Items ── */
.align-start    { align-items: flex-start; }
.align-end      { align-items: flex-end; }
.align-center   { align-items: center; }
.align-stretch  { align-items: stretch; }
.align-baseline { align-items: baseline; }

/* ── Align Self ── */
.self-start    { align-self: flex-start; }
.self-end      { align-self: flex-end; }
.self-center   { align-self: center; }
.self-stretch  { align-self: stretch; }
.self-baseline { align-self: baseline; }
.self-auto     { align-self: auto; }

/* ── Align Content ── */
.content-start   { align-content: flex-start; }
.content-end     { align-content: flex-end; }
.content-center  { align-content: center; }
.content-stretch { align-content: stretch; }
.content-between { align-content: space-between; }
.content-around  { align-content: space-around; }
.content-evenly  { align-content: space-evenly; }

/* ── Justify Content ── */
.justify-start   { justify-content: flex-start; }
.justify-end     { justify-content: flex-end; }
.justify-center  { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around  { justify-content: space-around; }
.justify-evenly  { justify-content: space-evenly; }

/* ── Justify Items ── */
.justify-items-start   { justify-items: start; }
.justify-items-end     { justify-items: end; }
.justify-items-center  { justify-items: center; }
.justify-items-stretch { justify-items: stretch; }

/* ── Justify Self ── */
.justify-self-start   { justify-self: start; }
.justify-self-end     { justify-self: end; }
.justify-self-center  { justify-self: center; }
.justify-self-stretch { justify-self: stretch; }
.justify-self-auto    { justify-self: auto; }

/* ── Place Content / Items / Self ── */
.place-center  { place-items: center; place-content: center; }
.place-stretch { place-items: stretch; }

/* ── Order ── */
.order-first { order: -9999; }
.order-last  { order: 9999; }
.order-none  { order: 0; }
`);

for (let i = 1; i <= 12; i++) add(`.order-${i} { order: ${i}; }`);

// ─── GRID ────────────────────────────────────────────────────────────────────
add(`\n/* ── Grid Template Columns ── */`);
gridCols.forEach(n => add(`.grid-cols-${n} { grid-template-columns: repeat(${n}, minmax(0, 1fr)); }`));
add(`.grid-cols-none { grid-template-columns: none; }`);

add(`\n/* ── Grid Template Rows ── */`);
[1,2,3,4,5,6].forEach(n => add(`.grid-rows-${n} { grid-template-rows: repeat(${n}, minmax(0, 1fr)); }`));

add(`\n/* ── Grid Column / Row Span ── */`);
gridCols.forEach(n => {
  add(`.span-col-${n} { grid-column: span ${n} / span ${n}; }`);
});
[1,2,3,4,5,6].forEach(n => {
  add(`.span-row-${n} { grid-row: span ${n} / span ${n}; }`);
});
add(`.span-col-full { grid-column: 1 / -1; }`);
add(`.span-row-full { grid-row: 1 / -1; }`);

add(`\n/* ── Grid Auto Flow ── */
.grid-flow-row    { grid-auto-flow: row; }
.grid-flow-col    { grid-auto-flow: column; }
.grid-flow-dense  { grid-auto-flow: dense; }
.grid-auto-cols-min  { grid-auto-columns: min-content; }
.grid-auto-cols-max  { grid-auto-columns: max-content; }
.grid-auto-cols-fr   { grid-auto-columns: minmax(0, 1fr); }
`);

// ─── SPACING ─────────────────────────────────────────────────────────────────
const spDir = {
  '':       'all',
  'top':    'top',
  'bottom': 'bottom',
  'left':   'left',
  'right':  'right',
};

// Padding
add(`\n/* ── Padding ── */`);
spacing.forEach(v => {
  add(`.add-padding-${v}        { padding: ${v}px; }`);
  add(`.add-padding-top-${v}    { padding-top: ${v}px; }`);
  add(`.add-padding-bottom-${v} { padding-bottom: ${v}px; }`);
  add(`.add-padding-left-${v}   { padding-left: ${v}px; }`);
  add(`.add-padding-right-${v}  { padding-right: ${v}px; }`);
  add(`.add-padding-x-${v}      { padding-left: ${v}px; padding-right: ${v}px; }`);
  add(`.add-padding-y-${v}      { padding-top: ${v}px; padding-bottom: ${v}px; }`);
});

// Margin
add(`\n/* ── Margin ── */`);
spacing.forEach(v => {
  add(`.add-margin-${v}        { margin: ${v}px; }`);
  add(`.add-margin-top-${v}    { margin-top: ${v}px; }`);
  add(`.add-margin-bottom-${v} { margin-bottom: ${v}px; }`);
  add(`.add-margin-left-${v}   { margin-left: ${v}px; }`);
  add(`.add-margin-right-${v}  { margin-right: ${v}px; }`);
  add(`.add-margin-x-${v}      { margin-left: ${v}px; margin-right: ${v}px; }`);
  add(`.add-margin-y-${v}      { margin-top: ${v}px; margin-bottom: ${v}px; }`);
});
add(`.center-margin            { margin-left: auto; margin-right: auto; }`);
add(`.add-margin-auto          { margin: auto; }`);
add(`.add-margin-top-auto      { margin-top: auto; }`);
add(`.add-margin-bottom-auto   { margin-bottom: auto; }`);
add(`.add-margin-left-auto     { margin-left: auto; }`);
add(`.add-margin-right-auto    { margin-right: auto; }`);
add(`.add-margin-x-auto        { margin-left: auto; margin-right: auto; }`);
add(`.add-margin-y-auto        { margin-top: auto; margin-bottom: auto; }`);

// Negative margins
add(`\n/* ── Negative Margin ── */`);
[1,2,4,8,12,16,20,24,32,40,48,64].forEach(v => {
  add(`.subtract-margin-${v}        { margin: -${v}px; }`);
  add(`.subtract-margin-top-${v}    { margin-top: -${v}px; }`);
  add(`.subtract-margin-bottom-${v} { margin-bottom: -${v}px; }`);
  add(`.subtract-margin-left-${v}   { margin-left: -${v}px; }`);
  add(`.subtract-margin-right-${v}  { margin-right: -${v}px; }`);
});

// Gap
add(`\n/* ── Gap ── */`);
spacing.forEach(v => {
  add(`.gap-${v}   { gap: ${v}px; }`);
  add(`.gap-x-${v} { column-gap: ${v}px; }`);
  add(`.gap-y-${v} { row-gap: ${v}px; }`);
});

// ─── SIZING ──────────────────────────────────────────────────────────────────
add(`\n/* ── Width ── */`);
spacing.forEach(v => add(`.set-width-${v} { width: ${v}px; }`));
[1,2,3,4,5,6,7,8,9,10,11,12].forEach(n => {
  [2,3,4,5,6,12].forEach(d => {
    if (n < d) {
      const pct = ((n/d)*100).toFixed(6).replace(/\.?0+$/, '');
      const cls = `set-width-${n}-of-${d}`;
      add(`.${cls} { width: ${pct}%; }`);
    }
  });
});
add(`.set-width-full   { width: 100%; }`);
add(`.set-width-screen { width: 100vw; }`);
add(`.set-width-auto   { width: auto; }`);
add(`.set-width-min    { width: min-content; }`);
add(`.set-width-max    { width: max-content; }`);
add(`.set-width-fit    { width: fit-content; }`);

add(`\n/* ── Height ── */`);
spacing.forEach(v => add(`.set-height-${v} { height: ${v}px; }`));
add(`.set-height-full   { height: 100%; }`);
add(`.set-height-screen { height: 100vh; }`);
add(`.set-height-auto   { height: auto; }`);
add(`.set-height-min    { height: min-content; }`);
add(`.set-height-max    { height: max-content; }`);
add(`.set-height-fit    { height: fit-content; }`);

add(`\n/* ── Min/Max Width/Height ── */`);
spacing.filter(v => v <= 512).forEach(v => {
  add(`.min-width-${v}  { min-width: ${v}px; }`);
  add(`.max-width-${v}  { max-width: ${v}px; }`);
  add(`.min-height-${v} { min-height: ${v}px; }`);
  add(`.max-height-${v} { max-height: ${v}px; }`);
});
add(`.min-width-full   { min-width: 100%; }`);
add(`.max-width-full   { max-width: 100%; }`);
add(`.min-width-screen { min-width: 100vw; }`);
add(`.max-width-screen { max-width: 100vw; }`);
add(`.min-height-full   { min-height: 100%; }`);
add(`.max-height-full   { max-height: 100%; }`);
add(`.min-height-screen { min-height: 100vh; }`);
add(`.max-height-screen { max-height: 100vh; }`);
add(`.min-width-none    { min-width: none; }`);
add(`.max-width-none    { max-width: none; }`);

// ─── BORDER ──────────────────────────────────────────────────────────────────
add(`\n/* ── Border Width ── */`);
borderWidths.forEach(v => {
  add(`.add-border-${v}        { border: ${v}px solid; }`);
  add(`.add-border-top-${v}    { border-top: ${v}px solid; }`);
  add(`.add-border-bottom-${v} { border-bottom: ${v}px solid; }`);
  add(`.add-border-left-${v}   { border-left: ${v}px solid; }`);
  add(`.add-border-right-${v}  { border-right: ${v}px solid; }`);
  add(`.add-border-x-${v}      { border-left: ${v}px solid; border-right: ${v}px solid; }`);
  add(`.add-border-y-${v}      { border-top: ${v}px solid; border-bottom: ${v}px solid; }`);
});

add(`\n/* ── Border Style ── */
.border-solid  { border-style: solid; }
.border-dashed { border-style: dashed; }
.border-dotted { border-style: dotted; }
.border-double { border-style: double; }
.border-hidden { border-style: hidden; }
.border-none   { border-style: none; }

/* ── Border Radius ── */`);
radii.forEach(v => add(`.round-corners-${v} { border-radius: ${v}px; }`));
add(`.make-circle          { border-radius: 50%; }`);
add(`.make-pill            { border-radius: 9999px; }`);
add(`.round-top-${0}       { border-top-left-radius: 0; border-top-right-radius: 0; }`);
radii.filter(v=>v>0).forEach(v => {
  add(`.round-top-${v}    { border-top-left-radius: ${v}px; border-top-right-radius: ${v}px; }`);
  add(`.round-bottom-${v} { border-bottom-left-radius: ${v}px; border-bottom-right-radius: ${v}px; }`);
  add(`.round-left-${v}   { border-top-left-radius: ${v}px; border-bottom-left-radius: ${v}px; }`);
  add(`.round-right-${v}  { border-top-right-radius: ${v}px; border-bottom-right-radius: ${v}px; }`);
});

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
add(`\n/* ── Font Size ── */`);
fontSizes.forEach(v => add(`.set-text-${v} { font-size: ${v}px; }`));

add(`\n/* ── Font Weight ── */
.text-thin        { font-weight: 100; }
.text-extra-light { font-weight: 200; }
.text-light       { font-weight: 300; }
.text-normal      { font-weight: 400; }
.text-medium      { font-weight: 500; }
.text-semibold    { font-weight: 600; }
.text-bold        { font-weight: 700; }
.text-extra-bold  { font-weight: 800; }
.text-black-weight{ font-weight: 900; }

/* ── Font Style ── */
.text-italic     { font-style: italic; }
.text-not-italic { font-style: normal; }

/* ── Font Family ── */
.font-sans  { font-family: var(--santy-font-sans); }
.font-serif { font-family: var(--santy-font-serif); }
.font-mono  { font-family: var(--santy-font-mono); }

/* ── Text Align ── */
.text-left    { text-align: left; }
.text-center  { text-align: center; }
.text-right   { text-align: right; }
.text-justify { text-align: justify; }
.text-start   { text-align: start; }
.text-end     { text-align: end; }

/* ── Text Decoration ── */
.text-underline      { text-decoration: underline; }
.text-overline       { text-decoration: overline; }
.text-strikethrough  { text-decoration: line-through; }
.text-no-decoration  { text-decoration: none; }

/* ── Text Transform ── */
.text-uppercase  { text-transform: uppercase; }
.text-lowercase  { text-transform: lowercase; }
.text-capitalize { text-transform: capitalize; }
.text-no-transform { text-transform: none; }

/* ── Text Overflow ── */
.text-truncate   { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-clip       { text-overflow: clip; }
.text-ellipsis   { text-overflow: ellipsis; }
.text-wrap       { white-space: normal; }
.text-nowrap     { white-space: nowrap; }
.text-pre        { white-space: pre; }
.text-pre-wrap   { white-space: pre-wrap; }
.text-pre-line   { white-space: pre-line; }
.text-break-word { word-break: break-word; overflow-wrap: break-word; }
.text-break-all  { word-break: break-all; }

/* ── Line Height ── */
.line-height-none  { line-height: 1; }
.line-height-tight { line-height: 1.25; }
.line-height-snug  { line-height: 1.375; }
.line-height-normal { line-height: 1.5; }
.line-height-relaxed { line-height: 1.625; }
.line-height-loose { line-height: 2; }
`);
lineHeights.forEach(v => {
  const name = String(v).replace('.', '-');
  add(`.line-height-${name} { line-height: ${v}; }`);
});

add(`\n/* ── Letter Spacing ── */`);
[-2,-1,0,1,2,4,6,8,10,12,16].forEach(v => {
  const cls = v < 0 ? `subtract-letter-space-${Math.abs(v)}` : `add-letter-space-${v}`;
  add(`.${cls} { letter-spacing: ${v}px; }`);
});
add(`.letter-space-tight  { letter-spacing: -0.05em; }`);
add(`.letter-space-snug   { letter-spacing: -0.025em; }`);
add(`.letter-space-normal { letter-spacing: 0em; }`);
add(`.letter-space-wide   { letter-spacing: 0.025em; }`);
add(`.letter-space-wider  { letter-spacing: 0.05em; }`);
add(`.letter-space-widest { letter-spacing: 0.1em; }`);

// ─── COLORS ──────────────────────────────────────────────────────────────────
add(`\n/* ── Text Colors ── */`);
Object.entries(palette).forEach(([name, shades]) => {
  Object.entries(shades).forEach(([shade, hex]) => {
    add(`.color-${name}-${shade} { color: ${hex}; }`);
  });
});
Object.entries(namedColors).forEach(([name, val]) => add(`.color-${name} { color: ${val}; }`));

add(`\n/* ── Background Colors ── */`);
Object.entries(palette).forEach(([name, shades]) => {
  Object.entries(shades).forEach(([shade, hex]) => {
    add(`.background-${name}-${shade} { background-color: ${hex}; }`);
  });
});
Object.entries(namedColors).forEach(([name, val]) => add(`.background-${name} { background-color: ${val}; }`));

add(`\n/* ── Border Colors ── */`);
Object.entries(palette).forEach(([name, shades]) => {
  Object.entries(shades).forEach(([shade, hex]) => {
    add(`.border-color-${name}-${shade} { border-color: ${hex}; }`);
  });
});
Object.entries(namedColors).forEach(([name, val]) => add(`.border-color-${name} { border-color: ${val}; }`));

add(`\n/* ── Fill (SVG) ── */`);
Object.entries(palette).forEach(([name, shades]) => {
  Object.entries(shades).forEach(([shade, hex]) => {
    add(`.fill-${name}-${shade} { fill: ${hex}; }`);
  });
});

add(`\n/* ── Stroke (SVG) ── */`);
Object.entries(palette).forEach(([name, shades]) => {
  Object.entries(shades).forEach(([shade, hex]) => {
    add(`.stroke-${name}-${shade} { stroke: ${hex}; }`);
  });
});

// ─── BACKGROUND ──────────────────────────────────────────────────────────────
add(`\n/* ── Background Position ── */
.bg-top         { background-position: top; }
.bg-bottom      { background-position: bottom; }
.bg-left        { background-position: left; }
.bg-right       { background-position: right; }
.bg-center      { background-position: center; }
.bg-top-left    { background-position: top left; }
.bg-top-right   { background-position: top right; }
.bg-bottom-left { background-position: bottom left; }
.bg-bottom-right{ background-position: bottom right; }

/* ── Background Repeat ── */
.bg-repeat       { background-repeat: repeat; }
.bg-no-repeat    { background-repeat: no-repeat; }
.bg-repeat-x     { background-repeat: repeat-x; }
.bg-repeat-y     { background-repeat: repeat-y; }
.bg-repeat-round { background-repeat: round; }
.bg-repeat-space { background-repeat: space; }

/* ── Background Size ── */
.bg-cover   { background-size: cover; }
.bg-contain { background-size: contain; }
.bg-auto    { background-size: auto; }

/* ── Background Attachment ── */
.bg-fixed   { background-attachment: fixed; }
.bg-local   { background-attachment: local; }
.bg-scroll-bg { background-attachment: scroll; }

/* ── Background Clip ── */
.bg-clip-border  { background-clip: border-box; }
.bg-clip-padding { background-clip: padding-box; }
.bg-clip-content { background-clip: content-box; }
.bg-clip-text    { background-clip: text; -webkit-background-clip: text; }

/* ── Gradients ── */
.gradient-to-right  { background-image: linear-gradient(to right, var(--grad-from, transparent), var(--grad-to, transparent)); }
.gradient-to-left   { background-image: linear-gradient(to left, var(--grad-from, transparent), var(--grad-to, transparent)); }
.gradient-to-top    { background-image: linear-gradient(to top, var(--grad-from, transparent), var(--grad-to, transparent)); }
.gradient-to-bottom { background-image: linear-gradient(to bottom, var(--grad-from, transparent), var(--grad-to, transparent)); }
.gradient-to-top-right    { background-image: linear-gradient(to top right, var(--grad-from, transparent), var(--grad-to, transparent)); }
.gradient-to-bottom-right { background-image: linear-gradient(to bottom right, var(--grad-from, transparent), var(--grad-to, transparent)); }
`);

// ─── POSITION ────────────────────────────────────────────────────────────────
add(`\n/* ── Position ── */
.position-static   { position: static; }
.position-relative { position: relative; }
.position-absolute { position: absolute; }
.position-fixed    { position: fixed; }
.position-sticky   { position: sticky; }
`);
add(`\n/* ── Pin (top/bottom/left/right/inset) ── */`);
spacing.filter(v => v <= 200).forEach(v => {
  add(`.pin-top-${v}    { top: ${v}px; }`);
  add(`.pin-bottom-${v} { bottom: ${v}px; }`);
  add(`.pin-left-${v}   { left: ${v}px; }`);
  add(`.pin-right-${v}  { right: ${v}px; }`);
  add(`.pin-all-${v}    { top: ${v}px; right: ${v}px; bottom: ${v}px; left: ${v}px; }`);
});
add(`.pin-top-auto    { top: auto; }`);
add(`.pin-bottom-auto { bottom: auto; }`);
add(`.pin-left-auto   { left: auto; }`);
add(`.pin-right-auto  { right: auto; }`);
add(`.pin-center      { top: 50%; left: 50%; transform: translate(-50%, -50%); }`);
add(`.pin-center-x    { left: 50%; transform: translateX(-50%); }`);
add(`.pin-center-y    { top: 50%; transform: translateY(-50%); }`);
add(`.pin-top-full    { top: 100%; }`);
add(`.pin-bottom-full { bottom: 100%; }`);
add(`.pin-left-full   { left: 100%; }`);
add(`.pin-right-full  { right: 100%; }`);

// ─── Z-INDEX ─────────────────────────────────────────────────────────────────
add(`\n/* ── Layer (z-index) ── */`);
zIndexes.forEach(v => add(`.layer-${v} { z-index: ${v}; }`));
add(`.layer-auto { z-index: auto; }`);
// Standard z-* aliases
add(`\n/* ── Z-index (standard aliases) ── */
.z-0    { z-index: 0; }
.z-10   { z-index: 10; }
.z-20   { z-index: 20; }
.z-30   { z-index: 30; }
.z-40   { z-index: 40; }
.z-50   { z-index: 50; }
.z-100  { z-index: 100; }
.z-auto { z-index: auto; }`);

// ─── OVERFLOW ────────────────────────────────────────────────────────────────
add(`\n/* ── Overflow ── */
.overflow-auto    { overflow: auto; }
.overflow-hidden  { overflow: hidden; }
.overflow-scroll  { overflow: scroll; }
.overflow-visible { overflow: visible; }
.overflow-clip    { overflow: clip; }
.overflow-x-auto    { overflow-x: auto; }
.overflow-x-hidden  { overflow-x: hidden; }
.overflow-x-scroll  { overflow-x: scroll; }
.overflow-x-visible { overflow-x: visible; }
.overflow-y-auto    { overflow-y: auto; }
.overflow-y-hidden  { overflow-y: hidden; }
.overflow-y-scroll  { overflow-y: scroll; }
.overflow-y-visible { overflow-y: visible; }
`);

// ─── OPACITY ─────────────────────────────────────────────────────────────────
add(`\n/* ── Opacity ── */`);
opacities.forEach(v => add(`.opacity-${v} { opacity: ${v / 100}; }`));

// ─── SHADOWS ─────────────────────────────────────────────────────────────────
add(`\n/* ── Box Shadow ── */
.add-shadow-sm  { box-shadow: var(--santy-shadow-sm); }
.add-shadow     { box-shadow: var(--santy-shadow); }
.add-shadow-md  { box-shadow: var(--santy-shadow-md); }
.add-shadow-lg  { box-shadow: var(--santy-shadow-lg); }
.add-shadow-xl  { box-shadow: var(--santy-shadow-xl); }
.add-shadow-inner { box-shadow: var(--santy-shadow-inner); }
.add-shadow-none  { box-shadow: none; }
.no-shadow        { box-shadow: none; }

/* ── Drop Shadow (filter) ── */
.drop-shadow-sm  { filter: drop-shadow(0 1px 1px rgba(0,0,0,0.05)); }
.drop-shadow     { filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1)); }
.drop-shadow-md  { filter: drop-shadow(0 4px 3px rgba(0,0,0,0.07)); }
.drop-shadow-lg  { filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)); }
.drop-shadow-xl  { filter: drop-shadow(0 20px 13px rgba(0,0,0,0.03)); }
.drop-shadow-none { filter: drop-shadow(0 0 #0000); }

/* ── Text Shadow ── */
.text-shadow-sm  { text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.text-shadow     { text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.text-shadow-lg  { text-shadow: 0 4px 8px rgba(0,0,0,0.4); }
.text-shadow-none{ text-shadow: none; }
`);

// ─── TRANSITION & ANIMATION ───────────────────────────────────────────────────
add(`\n/* ── Transition ── */
.transition-fast   { transition: var(--santy-transition-fast); }
.transition-normal { transition: var(--santy-transition-normal); }
.transition-slow   { transition: var(--santy-transition-slow); }
.transition-none   { transition: none; }
.transition-colors { transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease; }
.transition-opacity{ transition: opacity 0.3s ease; }
.transition-transform{ transition: transform 0.3s ease; }

/* ── Transform ── */
.flip-horizontal  { transform: scaleX(-1); }
.flip-vertical    { transform: scaleY(-1); }
.rotate-45        { transform: rotate(45deg); }
.rotate-90        { transform: rotate(90deg); }
.rotate-135       { transform: rotate(135deg); }
.rotate-180       { transform: rotate(180deg); }
.rotate-270       { transform: rotate(270deg); }
.rotate-minus-45  { transform: rotate(-45deg); }
.rotate-minus-90  { transform: rotate(-90deg); }
.scale-75         { transform: scale(0.75); }
.scale-90         { transform: scale(0.90); }
.scale-95         { transform: scale(0.95); }
.scale-100        { transform: scale(1); }
.scale-105        { transform: scale(1.05); }
.scale-110        { transform: scale(1.10); }
.scale-125        { transform: scale(1.25); }
.scale-150        { transform: scale(1.50); }
.skew-x-3        { transform: skewX(3deg); }
.skew-x-6        { transform: skewX(6deg); }
.skew-x-12       { transform: skewX(12deg); }
.skew-y-3        { transform: skewY(3deg); }
.skew-y-6        { transform: skewY(6deg); }
.skew-y-12       { transform: skewY(12deg); }
.transform-origin-center      { transform-origin: center; }
.transform-origin-top         { transform-origin: top; }
.transform-origin-top-right   { transform-origin: top right; }
.transform-origin-right       { transform-origin: right; }
.transform-origin-bottom-right{ transform-origin: bottom right; }
.transform-origin-bottom      { transform-origin: bottom; }
.transform-origin-bottom-left { transform-origin: bottom left; }
.transform-origin-left        { transform-origin: left; }
.transform-origin-top-left    { transform-origin: top left; }

/* ── Animation ── */
.animate-spin     { animation: santy-spin 1s linear infinite; }
.animate-ping     { animation: santy-ping 1s cubic-bezier(0,0,0.2,1) infinite; }
.animate-pulse    { animation: santy-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
.animate-bounce   { animation: santy-bounce 1s infinite; }
.animate-fade-in  { animation: santy-fade-in 0.5s ease; }
.animate-fade-out { animation: santy-fade-out 0.5s ease; }
.animate-slide-up { animation: santy-slide-up 0.4s ease; }
.animate-slide-down { animation: santy-slide-down 0.4s ease; }
.animate-zoom-in  { animation: santy-zoom-in 0.3s ease; }
.animation-paused { animation-play-state: paused; }
.animation-none   { animation: none; }

@keyframes santy-spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes santy-ping    { 75%, 100% { transform: scale(2); opacity: 0; } }
@keyframes santy-pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes santy-bounce  { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); } }
@keyframes santy-fade-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes santy-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes santy-slide-up   { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes santy-slide-down { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes santy-zoom-in    { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`);

// ─── CURSOR ───────────────────────────────────────────────────────────────────
add(`\n/* ── Cursor ── */
.cursor-auto        { cursor: auto; }
.cursor-default     { cursor: default; }
.cursor-pointer     { cursor: pointer; }
.cursor-wait        { cursor: wait; }
.cursor-text        { cursor: text; }
.cursor-move        { cursor: move; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-crosshair   { cursor: crosshair; }
.cursor-grab        { cursor: grab; }
.cursor-grabbing    { cursor: grabbing; }
.cursor-zoom-in     { cursor: zoom-in; }
.cursor-zoom-out    { cursor: zoom-out; }
.cursor-help        { cursor: help; }
.cursor-none        { cursor: none; }
`);

// ─── OBJECT FIT / POSITION ────────────────────────────────────────────────────
add(`\n/* ── Object Fit ── */
.fit-cover   { object-fit: cover; }
.fit-contain { object-fit: contain; }
.fit-fill    { object-fit: fill; }
.fit-none    { object-fit: none; }
.fit-scale   { object-fit: scale-down; }
/* Standard object-fit-* aliases */
.object-fit-cover   { object-fit: cover; }
.object-fit-contain { object-fit: contain; }
.object-fit-fill    { object-fit: fill; }
.object-fit-none    { object-fit: none; }
.object-fit-scale   { object-fit: scale-down; }

/* ── Object Position ── */
.object-top              { object-position: top; }
.object-bottom           { object-position: bottom; }
.object-left             { object-position: left; }
.object-right            { object-position: right; }
.object-center           { object-position: center; }
.object-position-top     { object-position: top; }
.object-position-bottom  { object-position: bottom; }
.object-position-center  { object-position: center; }
.object-position-left    { object-position: left; }
.object-position-right   { object-position: right; }
`);

// ─── ASPECT RATIO ─────────────────────────────────────────────────────────────
add(`\n/* ── Aspect Ratio ── */
.ratio-square      { aspect-ratio: 1 / 1; }
.ratio-video       { aspect-ratio: 16 / 9; }
.ratio-portrait    { aspect-ratio: 9 / 16; }
.ratio-4-3         { aspect-ratio: 4 / 3; }
.ratio-3-2         { aspect-ratio: 3 / 2; }
.ratio-21-9        { aspect-ratio: 21 / 9; }
.ratio-auto        { aspect-ratio: auto; }
/* Standard aspect-ratio-* aliases */
.aspect-ratio-1-1  { aspect-ratio: 1 / 1; }
.aspect-ratio-16-9 { aspect-ratio: 16 / 9; }
.aspect-ratio-4-3  { aspect-ratio: 4 / 3; }
.aspect-ratio-3-2  { aspect-ratio: 3 / 2; }
.aspect-ratio-9-16 { aspect-ratio: 9 / 16; }
.aspect-square     { aspect-ratio: 1 / 1; }
.aspect-video      { aspect-ratio: 16 / 9; }
`);

// ─── FILTER ───────────────────────────────────────────────────────────────────
add(`\n/* ── Filter ── */
.blur-sm  { filter: blur(4px); }
.blur     { filter: blur(8px); }
.blur-md  { filter: blur(12px); }
.blur-lg  { filter: blur(16px); }
.blur-xl  { filter: blur(24px); }
.blur-none{ filter: blur(0); }
.brightness-50  { filter: brightness(0.5); }
.brightness-75  { filter: brightness(0.75); }
.brightness-90  { filter: brightness(0.9); }
.brightness-100 { filter: brightness(1); }
.brightness-110 { filter: brightness(1.1); }
.brightness-125 { filter: brightness(1.25); }
.brightness-150 { filter: brightness(1.5); }
.brightness-200 { filter: brightness(2); }
.contrast-50    { filter: contrast(0.5); }
.contrast-75    { filter: contrast(0.75); }
.contrast-100   { filter: contrast(1); }
.contrast-125   { filter: contrast(1.25); }
.contrast-150   { filter: contrast(1.5); }
.contrast-200   { filter: contrast(2); }
.grayscale      { filter: grayscale(100%); }
.grayscale-0    { filter: grayscale(0); }
.sepia          { filter: sepia(100%); }
.sepia-0        { filter: sepia(0); }
.invert         { filter: invert(100%); }
.invert-0       { filter: invert(0); }
.saturate-0     { filter: saturate(0); }
.saturate-50    { filter: saturate(0.5); }
.saturate-100   { filter: saturate(1); }
.saturate-150   { filter: saturate(1.5); }
.saturate-200   { filter: saturate(2); }
.hue-rotate-30  { filter: hue-rotate(30deg); }
.hue-rotate-60  { filter: hue-rotate(60deg); }
.hue-rotate-90  { filter: hue-rotate(90deg); }
.hue-rotate-180 { filter: hue-rotate(180deg); }
`);

// ─── POINTER / USER-SELECT ────────────────────────────────────────────────────
add(`\n/* ── Pointer Events ── */
.pointer-none         { pointer-events: none; }
.pointer-auto         { pointer-events: auto; }
.pointer-all          { pointer-events: all; }
/* Standard pointer-events-* aliases */
.pointer-events-none  { pointer-events: none; }
.pointer-events-auto  { pointer-events: auto; }

/* ── User Select ── */
.select-none  { user-select: none; }
.select-text  { user-select: text; }
.select-all   { user-select: all; }
.select-auto  { user-select: auto; }

/* ── Resize ── */
.resize-none { resize: none; }
.resize      { resize: both; }
.resize-x    { resize: horizontal; }
.resize-y    { resize: vertical; }

/* ── Appearance ── */
.appearance-none { appearance: none; -webkit-appearance: none; }
.appearance-auto { appearance: auto; }

/* ── Outline ── */
.outline-none     { outline: none; }
.outline          { outline: 2px solid currentColor; }
.outline-dashed   { outline: 2px dashed currentColor; }
.outline-offset-2 { outline-offset: 2px; }
.outline-offset-4 { outline-offset: 4px; }

/* ── List Style ── */
.list-none   { list-style-type: none; padding-left: 0; }
.list-disc   { list-style-type: disc; }
.list-decimal{ list-style-type: decimal; }
.list-inside { list-style-position: inside; }
.list-outside{ list-style-position: outside; }

/* ── Table ── */
.table-auto    { table-layout: auto; }
.table-fixed   { table-layout: fixed; }
.border-collapse{ border-collapse: collapse; }
.border-separate{ border-collapse: separate; }

/* ── Columns ── */
.columns-auto { columns: auto; }
`);
[1,2,3,4,5,6].forEach(n => add(`.columns-${n} { columns: ${n}; }`));

add(`\n/* ── Screen Reader Only ── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border-width: 0;
}
.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* ── Break ── */
.break-before-auto   { break-before: auto; }
.break-before-always { break-before: always; }
.break-before-avoid  { break-before: avoid; }
.break-after-auto    { break-after: auto; }
.break-after-always  { break-after: always; }
.break-after-avoid   { break-after: avoid; }
.break-inside-auto   { break-inside: auto; }
.break-inside-avoid  { break-inside: avoid; }

/* ── Isolation ── */
.isolate          { isolation: isolate; }
.isolation-auto   { isolation: auto; }

/* ── Mix Blend Mode ── */
.blend-normal      { mix-blend-mode: normal; }
.blend-multiply    { mix-blend-mode: multiply; }
.blend-screen      { mix-blend-mode: screen; }
.blend-overlay     { mix-blend-mode: overlay; }
.blend-darken      { mix-blend-mode: darken; }
.blend-lighten     { mix-blend-mode: lighten; }
.blend-difference  { mix-blend-mode: difference; }
.blend-exclusion   { mix-blend-mode: exclusion; }
.blend-hue         { mix-blend-mode: hue; }
.blend-saturation  { mix-blend-mode: saturation; }
.blend-color       { mix-blend-mode: color; }
.blend-luminosity  { mix-blend-mode: luminosity; }

/* ── Will Change ── */
.will-change-auto      { will-change: auto; }
.will-change-scroll    { will-change: scroll-position; }
.will-change-contents  { will-change: contents; }
.will-change-transform { will-change: transform; }
`);

// ─── RESPONSIVE BREAKPOINTS ───────────────────────────────────────────────────
const breakpoints = {
  'on-mobile':  '(max-width: 639px)',
  'on-tablet':  '(min-width: 640px) and (max-width: 1023px)',
  'on-desktop': '(min-width: 1024px)',
  'on-wide':    '(min-width: 1280px)',
  'on-ultra':   '(min-width: 1536px)',
  'sm':  '(min-width: 640px)',
  'md':  '(min-width: 768px)',
  'lg':  '(min-width: 1024px)',
  'xl':  '(min-width: 1280px)',
  'xxl': '(min-width: 1536px)',
};

// Responsive variants for the most commonly needed classes
const responsiveClasses = [
  // Display
  ['make-block','display:block'],['make-inline','display:inline'],['make-inline-block','display:inline-block'],
  ['make-flex','display:flex'],['make-grid','display:grid'],['make-hidden','display:none'],
  // Flex
  ['flex-row','flex-direction:row'],['flex-column','flex-direction:column'],
  ['flex-wrap','flex-wrap:wrap'],['flex-nowrap','flex-wrap:nowrap'],
  ['align-center','align-items:center'],['align-start','align-items:flex-start'],['align-end','align-items:flex-end'],
  ['justify-center','justify-content:center'],['justify-between','justify-content:space-between'],
  ['justify-start','justify-content:flex-start'],['justify-end','justify-content:flex-end'],
  // Text align
  ['text-left','text-align:left'],['text-center','text-align:center'],['text-right','text-align:right'],
];
// Responsive spacing for common values
const respSpacing = [0,4,8,12,16,20,24,32,40,48,64];
respSpacing.forEach(v => {
  responsiveClasses.push([`add-padding-${v}`,`padding:${v}px`]);
  responsiveClasses.push([`add-padding-x-${v}`,`padding-left:${v}px;padding-right:${v}px`]);
  responsiveClasses.push([`add-padding-y-${v}`,`padding-top:${v}px;padding-bottom:${v}px`]);
  responsiveClasses.push([`add-margin-${v}`,`margin:${v}px`]);
  responsiveClasses.push([`add-margin-x-${v}`,`margin-left:${v}px;margin-right:${v}px`]);
  responsiveClasses.push([`add-margin-y-${v}`,`margin-top:${v}px;margin-bottom:${v}px`]);
  responsiveClasses.push([`gap-${v}`,`gap:${v}px`]);
});
// Responsive grid cols
gridCols.forEach(n => {
  responsiveClasses.push([`grid-cols-${n}`,`grid-template-columns:repeat(${n},minmax(0,1fr))`]);
});
// Responsive font sizes
[12,14,16,18,20,24,28,32,36,40,48,56,64].forEach(v => {
  responsiveClasses.push([`set-text-${v}`,`font-size:${v}px`]);
});
// Responsive widths
['full','auto','screen'].forEach(v => {
  const val = v === 'full' ? '100%' : v === 'screen' ? '100vw' : 'auto';
  responsiveClasses.push([`set-width-${v}`,`width:${val}`]);
});
respSpacing.forEach(v => {
  responsiveClasses.push([`set-width-${v}`,`width:${v}px`]);
  responsiveClasses.push([`set-height-${v}`,`height:${v}px`]);
});

add(`\n/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE VARIANTS
   Usage: class="on-mobile:make-hidden md:make-flex lg:grid-cols-3"
   ═══════════════════════════════════════════════════════════════ */`);

Object.entries(breakpoints).forEach(([prefix, mq]) => {
  add(`\n@media ${mq} {`);
  responsiveClasses.forEach(([cls, props]) => {
    const escapedCls = cls.replace(/:/g, '\\:');
    add(`  .${prefix}\\:${cls} { ${props.split(';').map(p=>p.trim()+';').join(' ')} }`);
  });
  add(`}`);
});

// ─── DARK MODE ────────────────────────────────────────────────────────────────
add(`\n/* ═══════════════════════════════════════════════════════════════
   DARK MODE VARIANTS
   Usage: class="dark:background-gray-900 dark:color-white"
   ═══════════════════════════════════════════════════════════════ */`);
add(`@media (prefers-color-scheme: dark) {`);
const darkClasses = [
  ['background-white','background-color:#ffffff'],
  ['background-black','background-color:#000000'],
  ['color-white','color:#ffffff'],
  ['color-black','color:#000000'],
];
Object.entries(palette).forEach(([name, shades]) => {
  Object.entries(shades).forEach(([shade, hex]) => {
    darkClasses.push([`background-${name}-${shade}`, `background-color:${hex}`]);
    darkClasses.push([`color-${name}-${shade}`, `color:${hex}`]);
    darkClasses.push([`border-color-${name}-${shade}`, `border-color:${hex}`]);
  });
});
darkClasses.forEach(([cls, prop]) => {
  add(`  .dark\\:${cls} { ${prop}; }`);
});
add(`}`);

// ─── HOVER / FOCUS / ACTIVE VARIANTS ─────────────────────────────────────────
add(`\n/* ═══════════════════════════════════════════════════════════════
   STATE VARIANTS (hover, focus, active, disabled, group-hover)
   Usage: class="on-hover:background-blue-500 on-focus:outline-none"
   ═══════════════════════════════════════════════════════════════ */`);

const stateVariants = [
  ['on-hover', ':hover'],
  ['on-focus', ':focus'],
  ['on-active', ':active'],
  ['on-disabled', ':disabled'],
  ['on-checked', ':checked'],
  ['on-first', ':first-child'],
  ['on-last', ':last-child'],
  ['on-odd', ':nth-child(odd)'],
  ['on-even', ':nth-child(even)'],
  ['on-placeholder', '::placeholder'],
  ['on-focus-within', ':focus-within'],
  ['on-focus-visible', ':focus-visible'],
];

// Common classes for state variants
const stateClasses = [];
// Colors
Object.entries(palette).forEach(([name, shades]) => {
  [300,400,500,600,700].forEach(shade => {
    if (shades[shade]) {
      stateClasses.push([`background-${name}-${shade}`, `background-color:${shades[shade]}`]);
      stateClasses.push([`color-${name}-${shade}`, `color:${shades[shade]}`]);
      stateClasses.push([`border-color-${name}-${shade}`, `border-color:${shades[shade]}`]);
    }
  });
});
// Shadows
stateClasses.push(['add-shadow-sm','box-shadow:var(--santy-shadow-sm)']);
stateClasses.push(['add-shadow','box-shadow:var(--santy-shadow)']);
stateClasses.push(['add-shadow-md','box-shadow:var(--santy-shadow-md)']);
stateClasses.push(['add-shadow-lg','box-shadow:var(--santy-shadow-lg)']);
stateClasses.push(['no-shadow','box-shadow:none']);
// Opacity
[0,25,50,75,100].forEach(v => stateClasses.push([`opacity-${v}`,`opacity:${v/100}`]));
// Transforms
['scale-90','scale-95','scale-100','scale-105','scale-110'].forEach(cls => {
  const v = parseFloat(cls.split('-')[1])/100;
  stateClasses.push([cls, `transform:scale(${v})`]);
});
// Display
stateClasses.push(['make-hidden','display:none']);
stateClasses.push(['make-block','display:block']);
stateClasses.push(['make-flex','display:flex']);
// Cursor
stateClasses.push(['cursor-pointer','cursor:pointer']);
stateClasses.push(['cursor-not-allowed','cursor:not-allowed']);
// Misc
stateClasses.push(['outline-none','outline:none']);
stateClasses.push(['text-underline','text-decoration:underline']);
stateClasses.push(['text-no-decoration','text-decoration:none']);
stateClasses.push(['text-bold','font-weight:700']);
stateClasses.push(['transition-fast','transition:var(--santy-transition-fast)']);
stateClasses.push(['transition-normal','transition:var(--santy-transition-normal)']);
// Border
[1,2,4].forEach(v => {
  stateClasses.push([`add-border-${v}`, `border:${v}px solid`]);
});

stateVariants.forEach(([prefix, pseudo]) => {
  add(`\n/* ${prefix} */`);
  stateClasses.forEach(([cls, prop]) => {
    add(`.${prefix}\\:${cls}${pseudo} { ${prop}; }`);
  });
});

// Group hover
add(`\n/* ── Group Hover ── */
/* Add class="group" to parent, then use group-hover: on children */`);
stateClasses.forEach(([cls, prop]) => {
  add(`.group:hover .group-hover\\:${cls} { ${prop}; }`);
});

// ─── PRINT ────────────────────────────────────────────────────────────────────
add(`\n/* ── Print Utilities ── */
@media print {
  .print\\:hidden { display: none; }
  .print\\:block  { display: block; }
  .print\\:no-shadow { box-shadow: none !important; }
}
`);

// ─── MISSING UTILITIES ────────────────────────────────────────────────────────
add(`
/* ── Backdrop Filter ── */
.backdrop-blur-none { backdrop-filter: blur(0); -webkit-backdrop-filter: blur(0); }
.backdrop-blur-sm   { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
.backdrop-blur      { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.backdrop-blur-md   { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.backdrop-blur-lg   { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.backdrop-blur-xl   { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
.backdrop-blur-2xl  { backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); }
.backdrop-blur-3xl  { backdrop-filter: blur(64px); -webkit-backdrop-filter: blur(64px); }
.backdrop-brightness-50  { backdrop-filter: brightness(0.5); -webkit-backdrop-filter: brightness(0.5); }
.backdrop-brightness-75  { backdrop-filter: brightness(0.75); -webkit-backdrop-filter: brightness(0.75); }
.backdrop-brightness-110 { backdrop-filter: brightness(1.1); -webkit-backdrop-filter: brightness(1.1); }

/* ── Ring (Focus Rings) ── */
.ring-0 { box-shadow: 0 0 0 0px var(--santy-primary); }
.ring-1 { box-shadow: 0 0 0 1px var(--santy-primary); }
.ring-2 { box-shadow: 0 0 0 2px var(--santy-primary); }
.ring-4 { box-shadow: 0 0 0 4px var(--santy-primary); }
.ring-8 { box-shadow: 0 0 0 8px var(--santy-primary); }
.ring-inset { --ring-inset: inset; }
.ring-blue   { box-shadow: 0 0 0 3px rgba(59,130,246,.4); }
.ring-green  { box-shadow: 0 0 0 3px rgba(34,197,94,.4); }
.ring-red    { box-shadow: 0 0 0 3px rgba(239,68,68,.4); }
.ring-yellow { box-shadow: 0 0 0 3px rgba(234,179,8,.4); }
.ring-purple { box-shadow: 0 0 0 3px rgba(139,92,246,.4); }
/* Ring offset */
.ring-offset-1 { box-shadow: 0 0 0 1px #fff, 0 0 0 3px var(--santy-primary); }
.ring-offset-2 { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--santy-primary); }
.ring-offset-4 { box-shadow: 0 0 0 4px #fff, 0 0 0 6px var(--santy-primary); }

/* ── Gradient Color Stops ── */
.from-transparent { --grad-from: transparent; }
.from-white       { --grad-from: #ffffff; }
.from-black       { --grad-from: #000000; }
.from-gray-100    { --grad-from: #f3f4f6; }
.from-gray-900    { --grad-from: #111827; }
.from-blue-400    { --grad-from: #60a5fa; }
.from-blue-500    { --grad-from: #3b82f6; }
.from-blue-600    { --grad-from: #2563eb; }
.from-indigo-500  { --grad-from: #6366f1; }
.from-purple-500  { --grad-from: #a855f7; }
.from-purple-600  { --grad-from: #9333ea; }
.from-pink-500    { --grad-from: #ec4899; }
.from-rose-500    { --grad-from: #f43f5e; }
.from-red-500     { --grad-from: #ef4444; }
.from-orange-500  { --grad-from: #f97316; }
.from-amber-400   { --grad-from: #fbbf24; }
.from-yellow-400  { --grad-from: #facc15; }
.from-green-400   { --grad-from: #4ade80; }
.from-green-500   { --grad-from: #22c55e; }
.from-teal-500    { --grad-from: #14b8a6; }
.from-cyan-400    { --grad-from: #22d3ee; }
.from-sky-400     { --grad-from: #38bdf8; }
.from-sky-500     { --grad-from: #0ea5e9; }
.to-transparent   { --grad-to: transparent; }
.to-white         { --grad-to: #ffffff; }
.to-black         { --grad-to: #000000; }
.to-gray-100      { --grad-to: #f3f4f6; }
.to-gray-900      { --grad-to: #111827; }
.to-blue-400      { --grad-to: #60a5fa; }
.to-blue-500      { --grad-to: #3b82f6; }
.to-blue-600      { --grad-to: #2563eb; }
.to-indigo-500    { --grad-to: #6366f1; }
.to-purple-500    { --grad-to: #a855f7; }
.to-purple-600    { --grad-to: #9333ea; }
.to-pink-500      { --grad-to: #ec4899; }
.to-rose-500      { --grad-to: #f43f5e; }
.to-red-500       { --grad-to: #ef4444; }
.to-orange-500    { --grad-to: #f97316; }
.to-amber-400     { --grad-to: #fbbf24; }
.to-yellow-400    { --grad-to: #facc15; }
.to-green-400     { --grad-to: #4ade80; }
.to-green-500     { --grad-to: #22c55e; }
.to-teal-500      { --grad-to: #14b8a6; }
.to-cyan-400      { --grad-to: #22d3ee; }
.to-sky-400       { --grad-to: #38bdf8; }
.to-sky-500       { --grad-to: #0ea5e9; }

/* ── Text Wrap ── */
.text-wrap    { text-wrap: wrap; white-space: normal; }
.text-nowrap  { text-wrap: nowrap; white-space: nowrap; }
.text-balance { text-wrap: balance; }
.text-pretty  { text-wrap: pretty; }

/* ── Word Break / Overflow Wrap ── */
.word-break-normal { word-break: normal; overflow-wrap: normal; }
.word-break-all    { word-break: break-all; }
.word-break-words  { overflow-wrap: break-word; word-break: break-word; }
.word-break-keep   { word-break: keep-all; }
.truncate          { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-ellipsis     { text-overflow: ellipsis; }
.text-clip         { text-overflow: clip; }

/* ── Space Between (auto margin between siblings) ── */
.space-x-0  > * + * { margin-left: 0; }
.space-x-1  > * + * { margin-left: 4px; }
.space-x-2  > * + * { margin-left: 8px; }
.space-x-3  > * + * { margin-left: 12px; }
.space-x-4  > * + * { margin-left: 16px; }
.space-x-5  > * + * { margin-left: 20px; }
.space-x-6  > * + * { margin-left: 24px; }
.space-x-8  > * + * { margin-left: 32px; }
.space-x-10 > * + * { margin-left: 40px; }
.space-x-12 > * + * { margin-left: 48px; }
.space-x-16 > * + * { margin-left: 64px; }
.space-y-0  > * + * { margin-top: 0; }
.space-y-1  > * + * { margin-top: 4px; }
.space-y-2  > * + * { margin-top: 8px; }
.space-y-3  > * + * { margin-top: 12px; }
.space-y-4  > * + * { margin-top: 16px; }
.space-y-5  > * + * { margin-top: 20px; }
.space-y-6  > * + * { margin-top: 24px; }
.space-y-8  > * + * { margin-top: 32px; }
.space-y-10 > * + * { margin-top: 40px; }
.space-y-12 > * + * { margin-top: 48px; }
.space-y-16 > * + * { margin-top: 64px; }

/* ── Divide (borders between children) ── */
.divide-x > * + * { border-left: 1px solid #e5e7eb; }
.divide-x-2 > * + * { border-left: 2px solid #e5e7eb; }
.divide-y > * + * { border-top: 1px solid #e5e7eb; }
.divide-y-2 > * + * { border-top: 2px solid #e5e7eb; }
.divide-white > * + * { border-color: #fff; }
.divide-gray > * + * { border-color: #d1d5db; }
.divide-gray-dark > * + * { border-color: #374151; }

/* ── Content (::before / ::after) ── */
.content-none    { content: none; }
.content-empty   { content: ''; }
.content-open    { content: open-quote; }
.content-close   { content: close-quote; }

/* ── Will Change ── */
.will-change-opacity { will-change: opacity; }

/* ── Text Gradient ── */
.text-gradient-blue-purple {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-gradient-green-teal {
  background: linear-gradient(135deg, #22c55e, #14b8a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-gradient-orange-red {
  background: linear-gradient(135deg, #f97316, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-gradient-pink-rose {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-gradient-sky-blue {
  background: linear-gradient(135deg, #38bdf8, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── RTL / Logical Properties ── */
.ps-0  { padding-inline-start: 0; }
.ps-4  { padding-inline-start: 4px; }
.ps-8  { padding-inline-start: 8px; }
.ps-12 { padding-inline-start: 12px; }
.ps-16 { padding-inline-start: 16px; }
.ps-20 { padding-inline-start: 20px; }
.ps-24 { padding-inline-start: 24px; }
.ps-32 { padding-inline-start: 32px; }
.pe-0  { padding-inline-end: 0; }
.pe-4  { padding-inline-end: 4px; }
.pe-8  { padding-inline-end: 8px; }
.pe-12 { padding-inline-end: 12px; }
.pe-16 { padding-inline-end: 16px; }
.pe-20 { padding-inline-end: 20px; }
.pe-24 { padding-inline-end: 24px; }
.pe-32 { padding-inline-end: 32px; }
.ms-auto { margin-inline-start: auto; }
.me-auto { margin-inline-end: auto; }
.border-start-1 { border-inline-start: 1px solid; }
.border-start-2 { border-inline-start: 2px solid; }
.border-start-4 { border-inline-start: 4px solid; }
.border-end-1   { border-inline-end: 1px solid; }
.border-end-2   { border-inline-end: 2px solid; }
.border-end-4   { border-inline-end: 4px solid; }
.start-0  { inset-inline-start: 0; }
.end-0    { inset-inline-end: 0; }
.start-auto { inset-inline-start: auto; }
.end-auto   { inset-inline-end: auto; }
`);

// ─── PEER VARIANTS ───────────────────────────────────────────────────────────
// peer: mark an input as peer, then target siblings with peer-*:
add(`\n/* ── Peer Variants ── */
/* Usage: add class="peer" to input, then class="peer-checked:make-block" to sibling */`);
const peerClasses = [
  ['make-block','display:block'],['make-hidden','display:none'],['make-flex','display:flex'],
  ['opacity-100','opacity:1'],['opacity-0','opacity:0'],
  ['color-blue-600','color:#2563eb'],['color-gray-500','color:#6b7280'],
  ['border-blue-500','border-color:#3b82f6'],
  ['background-blue-50','background-color:#eff6ff'],
  ['background-green-50','background-color:#f0fdf4'],
  ['translate-x-full','transform:translateX(100%)'],
  ['translate-x-0','transform:translateX(0)'],
];
peerClasses.forEach(([cls, prop]) => {
  add(`.peer:hover ~ .peer-hover\\:${cls} { ${prop}; }`);
  add(`.peer:focus ~ .peer-focus\\:${cls} { ${prop}; }`);
  add(`.peer:checked ~ .peer-checked\\:${cls} { ${prop}; }`);
  add(`.peer:disabled ~ .peer-disabled\\:${cls} { ${prop}; }`);
});

// ─── MOTION VARIANTS ─────────────────────────────────────────────────────────
add(`\n/* ── Motion Variants ── */
@media (prefers-reduced-motion: no-preference) {
  .motion-safe\\:animate-spin    { animation: santy-spin 1s linear infinite; }
  .motion-safe\\:animate-bounce  { animation: santy-bounce 1s infinite; }
  .motion-safe\\:animate-pulse   { animation: santy-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
  .motion-safe\\:transition-fast { transition: var(--santy-transition-fast); }
  .motion-safe\\:transition-normal{ transition: var(--santy-transition-normal); }
}
@media (prefers-reduced-motion: reduce) {
  .motion-reduce\\:animate-none  { animation: none !important; }
  .motion-reduce\\:transition-none{ transition: none !important; }
  * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
`);

// ─── EXTRA STATE VARIANTS ────────────────────────────────────────────────────
add(`\n/* ── Extra State Variants ── */`);
const extraStateVariants = [
  ['on-visited',  ':visited'],
  ['on-required', ':required'],
  ['on-optional', ':optional'],
  ['on-invalid',  ':invalid'],
  ['on-valid',    ':valid'],
  ['on-empty',    ':empty'],
  ['on-open',     '[open]'],
  ['on-checked',  ':checked'],
  ['on-indeterminate', ':indeterminate'],
  ['on-placeholder-shown', ':placeholder-shown'],
  ['on-autofill', ':-webkit-autofill'],
  ['on-read-only', ':read-only'],
  ['on-read-write', ':read-write'],
];
const extraStateClasses = [
  ['color-blue-600','color:#2563eb'],['color-red-600','color:#dc2626'],
  ['color-green-600','color:#16a34a'],['color-gray-500','color:#6b7280'],
  ['border-blue-500','border-color:#3b82f6'],['border-red-500','border-color:#ef4444'],
  ['border-green-500','border-color:#22c55e'],
  ['background-blue-50','background-color:#eff6ff'],
  ['background-red-50','background-color:#fef2f2'],
  ['background-green-50','background-color:#f0fdf4'],
  ['opacity-100','opacity:1'],['opacity-75','opacity:0.75'],['opacity-50','opacity:0.5'],
  ['ring-blue','box-shadow:0 0 0 3px rgba(59,130,246,.4)'],
  ['ring-red','box-shadow:0 0 0 3px rgba(239,68,68,.4)'],
  ['ring-green','box-shadow:0 0 0 3px rgba(34,197,94,.4)'],
  ['make-block','display:block'],['make-hidden','display:none'],
];
extraStateVariants.forEach(([prefix, pseudo]) => {
  add(`\n/* ${prefix} */`);
  extraStateClasses.forEach(([cls, prop]) => {
    add(`.${prefix}\\:${cls}${pseudo} { ${prop}; }`);
  });
});

// ─── EXTENDED ANIMATIONS (animate.css compatible) ────────────────────────────
add(ANIMATION_CSS);

// ─── COMPONENT SHORTCUTS ───────────────────────────────────────────────────────
add(`\n/* ═══ SANTY COMPONENTS ═══ */

/* ═══════════════════════════════════════════════════════════════
   COMPONENT SHORTCUTS — Higher-level ready-to-use patterns
   ═══════════════════════════════════════════════════════════════ */

/* ── Container ── */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}
@media (min-width: 640px)  { .container { max-width: 640px; } }
@media (min-width: 768px)  { .container { max-width: 768px; } }
@media (min-width: 1024px) { .container { max-width: 1024px; } }
@media (min-width: 1280px) { .container { max-width: 1280px; } }
@media (min-width: 1536px) { .container { max-width: 1536px; } }

/* ── Card ── */
.card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: var(--santy-shadow);
  overflow: hidden;
}
.card-body { padding: 24px; }
.card-header { padding: 16px 24px; border-bottom: 1px solid #e5e7eb; }
.card-footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; }

/* ── Badge ── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 9999px;
  line-height: 1.5;
}

/* ── Button Base ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: var(--santy-transition-fast);
  text-decoration: none;
  line-height: 1.5;
  white-space: nowrap;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-sm { padding: 4px 12px; font-size: 12px; border-radius: 6px; }
.btn-lg { padding: 12px 28px; font-size: 16px; border-radius: 10px; }
.btn-xl { padding: 16px 36px; font-size: 18px; border-radius: 12px; }
.btn-primary { background-color: #3b82f6; color: #ffffff; }
.btn-primary:hover { background-color: #2563eb; }
.btn-secondary { background-color: #6b7280; color: #ffffff; }
.btn-secondary:hover { background-color: #4b5563; }
.btn-success { background-color: #22c55e; color: #ffffff; }
.btn-success:hover { background-color: #16a34a; }
.btn-danger { background-color: #ef4444; color: #ffffff; }
.btn-danger:hover { background-color: #dc2626; }
.btn-warning { background-color: #f59e0b; color: #ffffff; }
.btn-warning:hover { background-color: #d97706; }
.btn-outline { background-color: transparent; border: 2px solid currentColor; }
.btn-ghost { background-color: transparent; }
.btn-ghost:hover { background-color: rgba(0,0,0,0.05); }
.btn-full { width: 100%; }

/* ── Alert ── */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid currentColor;
  margin-bottom: 16px;
}
.alert-info    { background-color: #eff6ff; color: #1d4ed8; }
.alert-success { background-color: #f0fdf4; color: #15803d; }
.alert-warning { background-color: #fffbeb; color: #b45309; }
.alert-danger  { background-color: #fef2f2; color: #b91c1c; }

/* ── Input ── */
.input {
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}
.input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
.input-error  { border-color: #ef4444; }
.input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.2); }
.input-lg { padding: 12px 16px; font-size: 16px; border-radius: 8px; }
.input-sm { padding: 4px 8px; font-size: 12px; }

/* ── Divider ── */
.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
}
.divider-vertical {
  border: none;
  border-left: 1px solid #e5e7eb;
  align-self: stretch;
  margin: 0 16px;
}

/* ── Overlay ── */
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 40;
}

/* ── Avatar ── */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-sm  { width: 32px;  height: 32px; }
.avatar-md  { width: 40px;  height: 40px; }
.avatar-lg  { width: 56px;  height: 56px; }
.avatar-xl  { width: 80px;  height: 80px; }

/* ── Spinner ── */
.spinner {
  border: 3px solid rgba(0,0,0,0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: santy-spin 0.7s linear infinite;
}
.spinner-sm  { width: 16px; height: 16px; }
.spinner-md  { width: 24px; height: 24px; }
.spinner-lg  { width: 40px; height: 40px; }
.spinner-xl  { width: 56px; height: 56px; }

/* ── Skeleton (loading placeholder) ── */
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: santy-skeleton 1.5s ease-in-out infinite;
  border-radius: 4px;
}
@keyframes santy-skeleton {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Progress Bar ── */
.progress {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 9999px;
  transition: width 0.3s ease;
}
`);

// ─── EXTENDED COMPONENTS (Bootstrap, Material, Bulma parity) ─────────────────
add(`
/* ── Table ── */
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th, .table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
.table thead tr { background-color: #f9fafb; }
.table thead th { font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
.table-striped tbody tr:nth-child(even) { background-color: #f9fafb; }
.table-bordered { border: 1px solid #e5e7eb; }
.table-bordered th, .table-bordered td { border: 1px solid #e5e7eb; }
.table-hover tbody tr:hover { background-color: #f3f4f6; cursor: pointer; }
.table-compact th, .table-compact td { padding: 6px 10px; font-size: 13px; }
.table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* ── Breadcrumb ── */
.breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; list-style: none; margin: 0; padding: 0; font-size: 14px; }
.breadcrumb-item { color: #6b7280; }
.breadcrumb-item a { color: #3b82f6; text-decoration: none; }
.breadcrumb-item a:hover { text-decoration: underline; }
.breadcrumb-item + .breadcrumb-item::before { content: '/'; margin-right: 4px; color: #d1d5db; }
.breadcrumb-item.active { color: #111827; font-weight: 500; }
.breadcrumb-dot .breadcrumb-item + .breadcrumb-item::before { content: '·'; }
.breadcrumb-arrow .breadcrumb-item + .breadcrumb-item::before { content: '›'; font-size: 16px; color: #9ca3af; }

/* ── Pagination ── */
.pagination { display: flex; align-items: center; gap: 4px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; }
.page-link { display: inline-flex; align-items: center; justify-content: center; min-width: 36px; height: 36px; padding: 0 10px; font-size: 14px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #fff; color: #374151; text-decoration: none; cursor: pointer; transition: all 0.15s ease; user-select: none; }
.page-link:hover { background-color: #f3f4f6; border-color: #d1d5db; }
.page-item.active .page-link { background-color: #3b82f6; border-color: #3b82f6; color: #fff; }
.page-item.disabled .page-link { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
.pagination-sm .page-link { min-width: 28px; height: 28px; font-size: 12px; border-radius: 6px; }
.pagination-lg .page-link { min-width: 44px; height: 44px; font-size: 16px; border-radius: 10px; }

/* ── Chip / Tag ── */
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; font-size: 13px; font-weight: 500; border-radius: 9999px; background-color: #e5e7eb; color: #374151; cursor: default; transition: background-color 0.15s; }
.chip:hover { background-color: #d1d5db; }
.chip-sm { padding: 2px 8px; font-size: 11px; }
.chip-lg { padding: 6px 16px; font-size: 14px; }
.chip-blue   { background-color: #dbeafe; color: #1d4ed8; }
.chip-green  { background-color: #dcfce7; color: #15803d; }
.chip-red    { background-color: #fee2e2; color: #b91c1c; }
.chip-yellow { background-color: #fef9c3; color: #854d0e; }
.chip-purple { background-color: #ede9fe; color: #6d28d9; }
.chip-orange { background-color: #ffedd5; color: #c2410c; }
.chip-outline { background-color: transparent; border: 1px solid currentColor; }

/* ── List Group ── */
.list-group { display: flex; flex-direction: column; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; }
.list-group-item { display: flex; align-items: center; padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #e5e7eb; background-color: #fff; color: #374151; text-decoration: none; transition: background-color 0.15s; }
.list-group-item:last-child { border-bottom: none; }
.list-group-item:hover { background-color: #f9fafb; }
.list-group-item.active { background-color: #3b82f6; color: #fff; border-color: #3b82f6; }
.list-group-item.disabled { opacity: 0.5; pointer-events: none; }
.list-group-flush { border: none; border-radius: 0; }
.list-group-flush .list-group-item { border-left: none; border-right: none; }
.list-group-numbered .list-group-item { counter-increment: list-group; }
.list-group-numbered .list-group-item::before { content: counter(list-group) '. '; font-weight: 600; color: #9ca3af; margin-right: 8px; }

/* ── Form ── */
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-label { font-size: 14px; font-weight: 500; color: #374151; }
.form-label-required::after { content: ' *'; color: #ef4444; }
.form-hint { font-size: 12px; color: #6b7280; line-height: 1.4; }
.form-error-text { font-size: 12px; color: #ef4444; }
.form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.form-row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

/* ── Select ── */
.select { display: block; width: 100%; padding: 8px 36px 8px 12px; font-size: 14px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #fff; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: border-color 0.15s ease; }
.select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
.select-error { border-color: #ef4444; }
.select-sm { padding: 4px 28px 4px 8px; font-size: 12px; border-radius: 4px; }
.select-lg { padding: 12px 40px 12px 16px; font-size: 16px; border-radius: 8px; }

/* ── Textarea ── */
.textarea { display: block; width: 100%; padding: 8px 12px; font-size: 14px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #fff; transition: border-color 0.15s ease, box-shadow 0.15s ease; outline: none; resize: vertical; min-height: 80px; font-family: inherit; line-height: 1.5; }
.textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
.textarea-error { border-color: #ef4444; }
.textarea-no-resize { resize: none; }

/* ── Checkbox & Radio ── */
.checkbox, .radio-label { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #374151; user-select: none; }
.checkbox input[type="checkbox"], .radio-label input[type="radio"] { width: 16px; height: 16px; accent-color: #3b82f6; cursor: pointer; flex-shrink: 0; }

/* ── Toggle / Switch ── */
.toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-slider { position: absolute; cursor: pointer; inset: 0; background-color: #d1d5db; border-radius: 9999px; transition: background-color 0.2s; }
.toggle-slider::before { content: ''; position: absolute; width: 20px; height: 20px; left: 2px; top: 2px; background-color: #fff; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.toggle input:checked + .toggle-slider { background-color: #3b82f6; }
.toggle input:checked + .toggle-slider::before { transform: translateX(20px); }
.toggle input:disabled + .toggle-slider { opacity: 0.5; cursor: not-allowed; }
.toggle-sm { width: 34px; height: 18px; }
.toggle-sm .toggle-slider::before { width: 14px; height: 14px; }
.toggle-sm input:checked + .toggle-slider::before { transform: translateX(16px); }
.toggle-green input:checked + .toggle-slider { background-color: #22c55e; }
.toggle-purple input:checked + .toggle-slider { background-color: #8b5cf6; }

/* ── Range ── */
.range { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 9999px; background: #e5e7eb; outline: none; cursor: pointer; }
.range::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #3b82f6; cursor: pointer; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
.range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: none; }

/* ── Navbar ── */
.navbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background-color: #fff; border-bottom: 1px solid #e5e7eb; gap: 16px; }
.navbar-brand { font-size: 18px; font-weight: 700; color: #111827; text-decoration: none; flex-shrink: 0; }
.navbar-menu { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.navbar-item { padding: 6px 12px; font-size: 14px; color: #6b7280; text-decoration: none; border-radius: 6px; transition: background-color 0.15s, color 0.15s; white-space: nowrap; }
.navbar-item:hover { background-color: #f3f4f6; color: #111827; }
.navbar-item.active { color: #3b82f6; background-color: #eff6ff; font-weight: 500; }
.navbar-dark { background-color: #1e293b; border-bottom-color: #334155; }
.navbar-dark .navbar-brand { color: #f1f5f9; }
.navbar-dark .navbar-item { color: #94a3b8; }
.navbar-dark .navbar-item:hover { background-color: #334155; color: #f1f5f9; }
.navbar-sticky { position: sticky; top: 0; z-index: 50; }
.navbar-glass { background-color: rgba(255,255,255,0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.navbar-dark.navbar-glass { background-color: rgba(15,23,42,0.85); }

/* ── Accordion ── */
.accordion { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
.accordion-flush { border: none; border-radius: 0; }
.accordion-item { border-bottom: 1px solid #e5e7eb; }
.accordion-item:last-child { border-bottom: none; }
.accordion-header { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 14px 18px; font-size: 15px; font-weight: 500; color: #111827; background-color: #fff; cursor: pointer; border: none; text-align: left; transition: background-color 0.15s; }
.accordion-header:hover { background-color: #f9fafb; }
.accordion-header[aria-expanded="true"] { background-color: #f9fafb; color: #3b82f6; }
.accordion-icon { width: 18px; height: 18px; flex-shrink: 0; transition: transform 0.25s ease; }
.accordion-header[aria-expanded="true"] .accordion-icon { transform: rotate(180deg); }
.accordion-body { padding: 0 18px; font-size: 14px; color: #6b7280; line-height: 1.6; background-color: #fff; max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.2s ease; }
.accordion-body.open { max-height: 2000px; padding: 14px 18px; border-top: 1px solid #f3f4f6; }

/* ── Tabs ── */
.tabs { display: flex; border-bottom: 2px solid #e5e7eb; list-style: none; margin: 0; padding: 0; overflow-x: auto; }
.tabs-item { padding: 10px 20px; font-size: 14px; font-weight: 500; color: #6b7280; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; text-decoration: none; transition: color 0.15s, border-color 0.15s; white-space: nowrap; border: none; background: transparent; }
.tabs-item:hover { color: #374151; }
.tabs-item.active { color: #3b82f6; border-bottom: 2px solid #3b82f6; }
.tabs-pill { border-bottom: none; background-color: #f3f4f6; padding: 4px; border-radius: 10px; gap: 4px; }
.tabs-pill .tabs-item { border-bottom: none; border-radius: 6px; }
.tabs-pill .tabs-item.active { background-color: #fff; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.tabs-underline .tabs-item.active { color: #111827; border-bottom-color: #111827; }
.tab-panel { display: none; padding: 20px 0; }
.tab-panel.active { display: block; }

/* ── Tooltip (CSS-only) ── */
.tooltip { position: relative; display: inline-block; }
.tooltip-content { visibility: hidden; opacity: 0; position: absolute; z-index: 100; background-color: #1f2937; color: #f9fafb; font-size: 12px; padding: 5px 10px; border-radius: 6px; white-space: nowrap; pointer-events: none; transition: opacity 0.15s; line-height: 1.4; }
.tooltip:hover .tooltip-content { visibility: visible; opacity: 1; }
.tooltip-top    .tooltip-content { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.tooltip-bottom .tooltip-content { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.tooltip-left   .tooltip-content { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
.tooltip-right  .tooltip-content { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }

/* ── Notification / Toast ── */
.notification { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 10px; font-size: 14px; border: 1px solid transparent; line-height: 1.4; }
.notification-info    { background-color: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
.notification-success { background-color: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.notification-warning { background-color: #fffbeb; border-color: #fde68a; color: #b45309; }
.notification-error   { background-color: #fef2f2; border-color: #fecaca; color: #b91c1c; }
.notification-icon { flex-shrink: 0; width: 18px; height: 18px; margin-top: 1px; }
.notification-title { font-weight: 600; margin-bottom: 2px; }
.notification-desc { opacity: 0.85; font-size: 13px; }

/* ── Steps / Stepper ── */
.steps { display: flex; align-items: flex-start; list-style: none; margin: 0; padding: 0; }
.step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.step:not(:last-child)::after { content: ''; position: absolute; top: 15px; left: calc(50% + 16px); right: calc(-50% + 16px); height: 2px; background-color: #e5e7eb; }
.step.done:not(:last-child)::after { background-color: #22c55e; }
.step-dot { width: 32px; height: 32px; border-radius: 50%; background-color: #e5e7eb; color: #9ca3af; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 2px solid #e5e7eb; transition: all 0.2s; z-index: 1; }
.step-label { font-size: 12px; color: #9ca3af; margin-top: 6px; text-align: center; }
.step.active .step-dot { background-color: #3b82f6; color: #fff; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.15); }
.step.active .step-label { color: #1d4ed8; font-weight: 500; }
.step.done .step-dot { background-color: #22c55e; color: #fff; border-color: #22c55e; }
.step.done .step-label { color: #15803d; }

/* ── Modal (CSS-only via :target) ── */
.modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center; padding: 16px; }
.modal-overlay:target { display: flex; }
.modal-box { background-color: #fff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; animation: santy-zoom-in 0.25s ease; }
.modal-header { padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; }
.modal-title { font-size: 18px; font-weight: 600; color: #111827; margin: 0; }
.modal-body { padding: 24px; font-size: 14px; color: #6b7280; line-height: 1.6; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 10px; }
.modal-sm .modal-box { max-width: 400px; }
.modal-lg .modal-box { max-width: 768px; }
.modal-xl .modal-box { max-width: 1024px; }
.modal-full .modal-box { max-width: 100%; height: 100vh; border-radius: 0; max-height: 100vh; }
.modal-close { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: none; background-color: transparent; cursor: pointer; color: #9ca3af; transition: background-color 0.15s; font-size: 20px; line-height: 1; padding: 0; text-decoration: none; }
.modal-close:hover { background-color: #f3f4f6; color: #374151; }
.modal-close::before { content: '×'; }

/* ── Drawer / Off-canvas (CSS-only via :target) ── */
.drawer-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); z-index: 200; display: none; }
.drawer-overlay:target { display: block; }
.drawer-panel { position: fixed; top: 0; bottom: 0; left: 0; width: 300px; background-color: #fff; z-index: 201; overflow-y: auto; box-shadow: 4px 0 24px rgba(0,0,0,0.12); transform: translateX(-100%); transition: transform 0.3s ease; }
.drawer-overlay:target .drawer-panel { transform: translateX(0); }
.drawer-panel-right { left: auto; right: 0; transform: translateX(100%); box-shadow: -4px 0 24px rgba(0,0,0,0.12); }
.drawer-overlay:target .drawer-panel-right { transform: translateX(0); }
.drawer-header { padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; }
.drawer-body { padding: 20px 24px; }

/* ── Media Object ── */
.media { display: flex; gap: 16px; align-items: flex-start; }
.media-body { flex: 1; min-width: 0; }
.media-right { order: 2; }
.media-sm { gap: 10px; }
.media-lg { gap: 24px; }

/* ── Stat Card ── */
.stat-card { background-color: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 24px; }
.stat-label { font-size: 13px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
.stat-value { font-size: 32px; font-weight: 700; color: #111827; line-height: 1; margin-bottom: 8px; }
.stat-delta { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; }
.stat-delta-up   { color: #15803d; }
.stat-delta-down { color: #b91c1c; }

/* ── Kbd ── */
.kbd { display: inline-block; padding: 2px 7px; font-family: ui-monospace, monospace; font-size: 12px; color: #374151; background-color: #f3f4f6; border: 1px solid #d1d5db; border-bottom-width: 2px; border-radius: 4px; box-shadow: inset 0 -1px 0 #d1d5db; white-space: nowrap; }

/* ── Close Button ── */
.btn-close { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; border-radius: 6px; background-color: transparent; cursor: pointer; color: #9ca3af; transition: background-color 0.15s, color 0.15s; font-size: 20px; line-height: 1; padding: 0; }
.btn-close:hover { background-color: #f3f4f6; color: #374151; }
.btn-close::before { content: '×'; }
.btn-close-white { color: rgba(255,255,255,0.7); }
.btn-close-white:hover { background-color: rgba(255,255,255,0.1); color: #fff; }

/* ── Empty State ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; }
.empty-state-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; line-height: 1; }
.empty-state-title { font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px; }
.empty-state-desc { font-size: 14px; color: #6b7280; max-width: 320px; margin: 0 auto 20px; line-height: 1.5; }

/* ── Elevation (Material Design levels) ── */
.elevation-0 { box-shadow: none; }
.elevation-1 { box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24); }
.elevation-2 { box-shadow: 0 3px 6px rgba(0,0,0,.16), 0 3px 6px rgba(0,0,0,.23); }
.elevation-3 { box-shadow: 0 10px 20px rgba(0,0,0,.19), 0 6px 6px rgba(0,0,0,.23); }
.elevation-4 { box-shadow: 0 14px 28px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.22); }
.elevation-5 { box-shadow: 0 19px 38px rgba(0,0,0,.30), 0 15px 12px rgba(0,0,0,.22); }

/* ── Screen Reader / Accessibility ── */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }
.not-sr-only { position: static; width: auto; height: auto; overflow: visible; clip: auto; white-space: normal; }
.sr-only-focusable:focus { position: static; width: auto; height: auto; overflow: visible; clip: auto; white-space: normal; }
.focus-ring:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
.focus-ring-inset:focus-visible { outline: 2px solid #3b82f6; outline-offset: -2px; }
.focus-none:focus { outline: none; box-shadow: none; }

/* ── Pointer Events ── */
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }

/* ── User Select ── */
.select-none { user-select: none; -webkit-user-select: none; }
.select-text { user-select: text; }
.select-all  { user-select: all; }
.select-auto { user-select: auto; }

/* ── Will-change ── */
.will-change-auto      { will-change: auto; }
.will-change-scroll    { will-change: scroll-position; }
.will-change-contents  { will-change: contents; }
.will-change-transform { will-change: transform; }
.will-change-opacity   { will-change: opacity; }

/* ── Appearance ── */
.appearance-none { -webkit-appearance: none; appearance: none; }
.appearance-auto { -webkit-appearance: auto; appearance: auto; }

/* ── Caret color ── */
.caret-blue   { caret-color: #3b82f6; }
.caret-green  { caret-color: #22c55e; }
.caret-red    { caret-color: #ef4444; }
.caret-auto   { caret-color: auto; }
.caret-transparent { caret-color: transparent; }

/* ── Touch action ── */
.touch-none        { touch-action: none; }
.touch-pan-x       { touch-action: pan-x; }
.touch-pan-y       { touch-action: pan-y; }
.touch-manipulation{ touch-action: manipulation; }
.touch-auto        { touch-action: auto; }

/* ── Print utilities ── */
@media print {
  .print-hidden  { display: none !important; }
  .print-visible { display: block !important; }
  .print-break-before { page-break-before: always; }
  .print-break-after  { page-break-after: always; }
  .print-no-background { background: white !important; color: black !important; }
  .print-border-none { border: none !important; box-shadow: none !important; }
}

/* ── Message / Hero (Bulma-style) ── */
.message { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; font-size: 14px; }
.message-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; font-weight: 600; }
.message-body { padding: 14px 16px; color: #374151; line-height: 1.5; }
.message-info    .message-header { background-color: #3b82f6; color: #fff; }
.message-info    .message-body   { background-color: #eff6ff; }
.message-success .message-header { background-color: #22c55e; color: #fff; }
.message-success .message-body   { background-color: #f0fdf4; }
.message-warning .message-header { background-color: #f59e0b; color: #fff; }
.message-warning .message-body   { background-color: #fffbeb; }
.message-danger  .message-header { background-color: #ef4444; color: #fff; }
.message-danger  .message-body   { background-color: #fef2f2; }

/* ── Hero section ── */
.hero-section { display: flex; align-items: center; justify-content: center; min-height: 400px; padding: 64px 24px; text-align: center; }
.hero-section-sm { min-height: 200px; padding: 40px 24px; }
.hero-section-lg { min-height: 600px; }
.hero-section-full { min-height: 100vh; }
.hero-content { max-width: 800px; margin: 0 auto; }

/* ── Level (Bulma-style horizontal layout) ── */
.level { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.level-left  { display: flex; align-items: center; gap: 12px; }
.level-right { display: flex; align-items: center; gap: 12px; }
.level-item  { flex: 1; text-align: center; }

/* ── FAB (Material floating action button) ── */
.fab { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 50%; background-color: #3b82f6; color: #fff; border: none; cursor: pointer; box-shadow: 0 6px 10px rgba(0,0,0,.2), 0 2px 4px rgba(0,0,0,.15); transition: box-shadow 0.2s, transform 0.2s; }
.fab:hover { box-shadow: 0 8px 16px rgba(0,0,0,.25), 0 4px 6px rgba(0,0,0,.15); transform: translateY(-1px); }
.fab:active { box-shadow: 0 4px 8px rgba(0,0,0,.2); transform: translateY(0); }
.fab-sm { width: 40px; height: 40px; }
.fab-lg { width: 72px; height: 72px; }
.fab-extended { width: auto; border-radius: 9999px; padding: 0 20px; gap: 8px; font-size: 14px; font-weight: 600; }
.fab-bottom-right { position: fixed; bottom: 24px; right: 24px; z-index: 50; }
.fab-bottom-left  { position: fixed; bottom: 24px; left: 24px; z-index: 50; }

/* ── App Bar (Material-style) ── */
.app-bar { display: flex; align-items: center; gap: 16px; padding: 0 16px; height: 56px; background-color: #fff; border-bottom: 1px solid #e5e7eb; position: relative; z-index: 10; }
.app-bar-title { font-size: 18px; font-weight: 600; color: #111827; flex: 1; }
.app-bar-dark { background-color: #1e293b; border-bottom-color: #334155; }
.app-bar-dark .app-bar-title { color: #f1f5f9; }
.app-bar-primary { background-color: #3b82f6; border-bottom-color: #2563eb; }
.app-bar-primary .app-bar-title { color: #fff; }
.app-bar-sticky { position: sticky; top: 0; z-index: 50; }

/* ── Card variants (Bootstrap-style) ── */
.card-flat    { box-shadow: none; border: 1px solid #e5e7eb; }
.card-raised  { box-shadow: 0 10px 25px -5px rgba(0,0,0,.15), 0 4px 10px -4px rgba(0,0,0,.1); }
.card-outline { box-shadow: none; border: 2px solid #e5e7eb; background-color: transparent; }
.card-horizontal { display: flex; flex-direction: row; }
.card-horizontal .card-img { width: 200px; flex-shrink: 0; object-fit: cover; }
.card-img-top    { width: 100%; object-fit: cover; }
.card-img-bottom { width: 100%; object-fit: cover; }

/* ── Button groups ── */
.btn-group { display: inline-flex; }
.btn-group .btn { border-radius: 0; border-right-width: 0; }
.btn-group .btn:first-child { border-radius: 8px 0 0 8px; }
.btn-group .btn:last-child  { border-radius: 0 8px 8px 0; border-right-width: 1px; }
.btn-group-vertical { display: inline-flex; flex-direction: column; }
.btn-group-vertical .btn { border-radius: 0; border-bottom-width: 0; }
.btn-group-vertical .btn:first-child { border-radius: 8px 8px 0 0; }
.btn-group-vertical .btn:last-child  { border-radius: 0 0 8px 8px; border-bottom-width: 1px; }

/* ── Input group (Bootstrap-style) ── */
.input-group { display: flex; }
.input-group .input { border-radius: 0; border-right-width: 0; flex: 1; }
.input-group .input:first-child { border-radius: 6px 0 0 6px; }
.input-group .input:last-child  { border-radius: 0 6px 6px 0; border-right-width: 1px; }
.input-addon { display: flex; align-items: center; padding: 0 12px; background-color: #f3f4f6; border: 1px solid #d1d5db; border-right: none; font-size: 14px; color: #6b7280; white-space: nowrap; }
.input-addon:first-child { border-radius: 6px 0 0 6px; }
.input-addon:last-child  { border-radius: 0 6px 6px 0; border-left: none; border-right-width: 1px; }

/* ── Command Palette ── */
.cmd-palette-backdrop { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); z-index: 500; display: flex; align-items: flex-start; justify-content: center; padding-top: 10vh; }
.cmd-palette { width: 100%; max-width: 560px; background-color: #fff; border-radius: 14px; box-shadow: 0 25px 60px rgba(0,0,0,.3); overflow: hidden; animation: santy-zoom-in 0.15s ease; }
.cmd-palette-input-wrap { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #e5e7eb; }
.cmd-palette-icon { width: 18px; height: 18px; color: #9ca3af; flex-shrink: 0; }
.cmd-palette-input { flex: 1; border: none; outline: none; font-size: 16px; color: #111827; background: transparent; }
.cmd-palette-input::placeholder { color: #9ca3af; }
.cmd-palette-kbd { font-size: 11px; color: #9ca3af; background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px; padding: 2px 6px; white-space: nowrap; }
.cmd-palette-list { max-height: 360px; overflow-y: auto; padding: 6px; }
.cmd-palette-group { padding: 6px 10px 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; }
.cmd-palette-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 14px; color: #374151; cursor: pointer; transition: background-color 0.1s; }
.cmd-palette-item:hover, .cmd-palette-item.active { background-color: #eff6ff; color: #2563eb; }
.cmd-palette-item-icon { width: 20px; height: 20px; flex-shrink: 0; opacity: 0.6; }
.cmd-palette-item-label { flex: 1; }
.cmd-palette-item-hint { font-size: 12px; color: #9ca3af; }
.cmd-palette-empty { padding: 32px 16px; text-align: center; font-size: 14px; color: #9ca3af; }
.cmd-palette-footer { display: flex; align-items: center; gap: 12px; padding: 8px 14px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; background-color: #f9fafb; }

/* ── Kanban Board ── */
.kanban { display: flex; gap: 16px; overflow-x: auto; align-items: flex-start; padding-bottom: 8px; }
.kanban-col { flex-shrink: 0; width: 280px; background-color: #f3f4f6; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.kanban-col-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.kanban-col-title { font-size: 13px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; }
.kanban-col-count { font-size: 12px; font-weight: 600; background-color: #e5e7eb; color: #6b7280; border-radius: 9999px; padding: 1px 8px; }
.kanban-card { background-color: #fff; border-radius: 10px; padding: 12px 14px; box-shadow: 0 1px 4px rgba(0,0,0,.07); cursor: grab; transition: box-shadow 0.15s, transform 0.15s; font-size: 14px; color: #111827; }
.kanban-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.12); transform: translateY(-1px); }
.kanban-card:active { cursor: grabbing; }
.kanban-card-label { display: inline-block; font-size: 11px; font-weight: 600; border-radius: 4px; padding: 2px 7px; margin-bottom: 8px; }
.kanban-card-title { font-weight: 500; margin-bottom: 6px; line-height: 1.4; }
.kanban-card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #9ca3af; }
.kanban-add-btn { display: flex; align-items: center; gap: 6px; width: 100%; padding: 8px 10px; border: 2px dashed #d1d5db; border-radius: 8px; background: transparent; color: #9ca3af; font-size: 13px; cursor: pointer; transition: border-color 0.15s, color 0.15s; }
.kanban-add-btn:hover { border-color: #3b82f6; color: #3b82f6; }

/* ── Timeline / Activity Feed ── */
.timeline { display: flex; flex-direction: column; }
.timeline-item { display: flex; gap: 16px; position: relative; padding-bottom: 24px; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-item:not(:last-child) .timeline-dot::after { content: ''; position: absolute; top: 32px; left: 15px; bottom: 0; width: 2px; background-color: #e5e7eb; }
.timeline-dot { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background-color: #e5e7eb; border: 2px solid #fff; box-shadow: 0 0 0 2px #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 14px; position: relative; z-index: 1; }
.timeline-dot-blue   { background-color: #3b82f6; box-shadow: 0 0 0 2px #bfdbfe; color: #fff; }
.timeline-dot-green  { background-color: #22c55e; box-shadow: 0 0 0 2px #bbf7d0; color: #fff; }
.timeline-dot-red    { background-color: #ef4444; box-shadow: 0 0 0 2px #fecaca; color: #fff; }
.timeline-dot-yellow { background-color: #f59e0b; box-shadow: 0 0 0 2px #fde68a; color: #fff; }
.timeline-body { flex: 1; min-width: 0; padding-top: 4px; }
.timeline-time { font-size: 12px; color: #9ca3af; margin-bottom: 4px; }
.timeline-title { font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 4px; }
.timeline-desc { font-size: 13px; color: #6b7280; line-height: 1.5; }
.timeline-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; margin-top: 8px; font-size: 13px; color: #374151; }
.timeline-compact .timeline-item { padding-bottom: 12px; }
.timeline-compact .timeline-dot { width: 22px; height: 22px; font-size: 11px; }
.timeline-compact .timeline-item:not(:last-child) .timeline-dot::after { left: 10px; top: 22px; }

/* ── File Upload Dropzone ── */
.dropzone { border: 2px dashed #d1d5db; border-radius: 12px; padding: 40px 24px; text-align: center; background-color: #f9fafb; transition: border-color 0.2s, background-color 0.2s; cursor: pointer; }
.dropzone:hover, .dropzone.drag-over { border-color: #3b82f6; background-color: #eff6ff; }
.dropzone-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; line-height: 1; }
.dropzone-title { font-size: 15px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.dropzone-desc { font-size: 13px; color: #9ca3af; margin-bottom: 16px; }
.dropzone-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 18px; font-size: 13px; font-weight: 600; border-radius: 8px; background-color: #3b82f6; color: #fff; border: none; cursor: pointer; transition: background-color 0.15s; }
.dropzone-btn:hover { background-color: #2563eb; }
.dropzone-types { font-size: 12px; color: #9ca3af; margin-top: 10px; }
.dropzone-sm { padding: 20px 16px; }
.dropzone-sm .dropzone-icon { font-size: 28px; }
.file-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.file-list-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #fff; font-size: 13px; }
.file-list-name { flex: 1; font-weight: 500; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-list-size { color: #9ca3af; white-space: nowrap; }
.file-list-remove { color: #9ca3af; cursor: pointer; font-size: 18px; line-height: 1; padding: 0 2px; border: none; background: none; transition: color 0.1s; }
.file-list-remove:hover { color: #ef4444; }

/* ── Mega Menu ── */
.mega-menu-wrap { position: relative; }
.mega-menu { position: absolute; top: 100%; left: 0; min-width: 640px; background-color: #fff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 20px 40px rgba(0,0,0,.12); z-index: 300; padding: 20px; display: none; animation: santy-zoom-in 0.15s ease; }
.mega-menu.open, .mega-menu-wrap:hover .mega-menu { display: flex; }
.mega-menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; width: 100%; }
.mega-menu-col-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 10px; }
.mega-menu-item { display: flex; align-items: flex-start; gap: 10px; padding: 8px; border-radius: 8px; text-decoration: none; transition: background-color 0.12s; cursor: pointer; }
.mega-menu-item:hover { background-color: #f3f4f6; }
.mega-menu-item-icon { width: 36px; height: 36px; border-radius: 8px; background-color: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.mega-menu-item-title { font-size: 14px; font-weight: 500; color: #111827; }
.mega-menu-item-desc { font-size: 12px; color: #6b7280; margin-top: 2px; line-height: 1.4; }
.mega-menu-footer { margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #6b7280; }

/* ── Split Pane ── */
.split-pane { display: flex; height: 100%; overflow: hidden; }
.split-pane-vertical { flex-direction: column; }
.split-pane-panel { overflow: auto; flex: 1; min-width: 0; min-height: 0; }
.split-pane-divider { flex-shrink: 0; background-color: #e5e7eb; transition: background-color 0.15s; position: relative; z-index: 1; }
.split-pane:not(.split-pane-vertical) .split-pane-divider { width: 5px; cursor: col-resize; }
.split-pane.split-pane-vertical .split-pane-divider { height: 5px; cursor: row-resize; }
.split-pane-divider:hover, .split-pane-divider.dragging { background-color: #3b82f6; }
.split-pane-divider::after { content: ''; position: absolute; inset: -4px; }

/* ── Rating / Stars ── */
.rating { display: inline-flex; gap: 2px; align-items: center; }
.rating-star { font-size: 20px; color: #d1d5db; cursor: pointer; transition: color 0.1s, transform 0.1s; line-height: 1; user-select: none; }
.rating-star:hover, .rating-star.filled { color: #f59e0b; }
.rating-star:hover { transform: scale(1.15); }
.rating-sm .rating-star { font-size: 14px; }
.rating-lg .rating-star { font-size: 28px; }
.rating-readonly .rating-star { cursor: default; pointer-events: none; }
.rating-readonly .rating-star:hover { transform: none; }
.rating-value { font-size: 14px; font-weight: 600; color: #374151; margin-left: 6px; }
.rating-count { font-size: 13px; color: #9ca3af; margin-left: 4px; }

/* ── Code Block ── */
.code-block { position: relative; border-radius: 10px; background-color: #1e293b; color: #e2e8f0; font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace; font-size: 13px; line-height: 1.7; overflow: hidden; }
.code-block-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background-color: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.07); }
.code-block-lang { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; }
.code-block-dots { display: flex; gap: 6px; }
.code-block-dot { width: 12px; height: 12px; border-radius: 50%; }
.code-block-dot-red    { background-color: #ef4444; }
.code-block-dot-yellow { background-color: #f59e0b; }
.code-block-dot-green  { background-color: #22c55e; }
.code-block-copy { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; font-size: 12px; font-weight: 500; border-radius: 6px; border: 1px solid rgba(255,255,255,0.12); background-color: rgba(255,255,255,0.06); color: #94a3b8; cursor: pointer; transition: background-color 0.15s, color 0.15s; }
.code-block-copy:hover { background-color: rgba(255,255,255,0.12); color: #e2e8f0; }
.code-block-copy.copied { color: #22c55e; border-color: rgba(34,197,94,0.3); }
.code-block pre { margin: 0; padding: 16px 20px; overflow-x: auto; }
.code-block code { background: none; padding: 0; border-radius: 0; font-size: inherit; color: inherit; }
.code-block-line-numbers pre { padding-left: 0; }
.code-block-gutter { display: inline-flex; flex-direction: column; padding: 16px 12px 16px 16px; text-align: right; user-select: none; border-right: 1px solid rgba(255,255,255,0.07); color: #475569; font-size: 13px; line-height: 1.7; }
.code-block-inner { display: flex; }
.token-keyword { color: #c084fc; }
.token-string  { color: #86efac; }
.token-comment { color: #475569; font-style: italic; }
.token-number  { color: #fb923c; }
.token-fn      { color: #60a5fa; }
.token-tag     { color: #f87171; }
.token-attr    { color: #fbbf24; }
`);


// ─── DROPDOWN + DARK MODE VARIANTS ───────────────────────────────────────────
add(`
/* ── Dropdown ── */
.dropdown { position: relative; display: inline-block; }
.dropdown-toggle { cursor: pointer; }
.dropdown-menu {
  display: none;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 180px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: var(--santy-shadow-md);
  z-index: 200;
  padding: 4px;
  animation: santy-zoom-in 0.15s ease;
}
.dropdown-menu-right { left: auto; right: 0; }
.dropdown-menu-top   { top: auto; bottom: calc(100% + 4px); }
.dropdown.open .dropdown-menu,
.dropdown-toggle:focus + .dropdown-menu,
.dropdown-menu:target { display: block; }
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.1s;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}
.dropdown-item:hover { background-color: #f3f4f6; color: #111827; }
.dropdown-item.active { background-color: #eff6ff; color: #2563eb; }
.dropdown-item.danger { color: #dc2626; }
.dropdown-item.danger:hover { background-color: #fef2f2; }
.dropdown-item:disabled, .dropdown-item.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
.dropdown-divider { height: 1px; background-color: #e5e7eb; margin: 4px 0; }
.dropdown-header { padding: 6px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; }

/* ── Component Variant System ──────────────────────────────────────────── */
/* Usage: make-button style-success size-large shape-pill */

/* make-button */
.make-button {
  display:inline-flex; align-items:center; justify-content:center;
  gap:8px; padding:9px 20px; font-size:14px; font-weight:600;
  border-radius:8px; border:2px solid transparent; cursor:pointer;
  text-decoration:none; transition:all 0.2s; line-height:1.25; white-space:nowrap;
}
.make-button:disabled { opacity:.5; cursor:not-allowed; }
.make-button.style-primary   { background:#3b82f6; color:#fff; border-color:#3b82f6; }
.make-button.style-primary:hover { background:#2563eb; border-color:#2563eb; }
.make-button.style-secondary { background:#6b7280; color:#fff; border-color:#6b7280; }
.make-button.style-secondary:hover { background:#4b5563; border-color:#4b5563; }
.make-button.style-success   { background:#22c55e; color:#fff; border-color:#22c55e; }
.make-button.style-success:hover { background:#16a34a; border-color:#16a34a; }
.make-button.style-danger    { background:#ef4444; color:#fff; border-color:#ef4444; }
.make-button.style-danger:hover  { background:#dc2626; border-color:#dc2626; }
.make-button.style-warning   { background:#f59e0b; color:#fff; border-color:#f59e0b; }
.make-button.style-warning:hover { background:#d97706; border-color:#d97706; }
.make-button.style-info      { background:#06b6d4; color:#fff; border-color:#06b6d4; }
.make-button.style-info:hover { background:#0891b2; border-color:#0891b2; }
.make-button.style-outline   { background:transparent; border-color:currentColor; }
.make-button.style-outline:hover { background:rgba(0,0,0,.05); }
.make-button.style-ghost     { background:transparent; border-color:transparent; }
.make-button.style-ghost:hover { background:rgba(0,0,0,.05); }
.make-button.style-dark      { background:#1e293b; color:#f1f5f9; border-color:#1e293b; }
.make-button.style-dark:hover { background:#0f172a; border-color:#0f172a; }
.make-button.style-light     { background:#f3f4f6; color:#374151; border-color:#e5e7eb; }
.make-button.style-light:hover { background:#e5e7eb; }
.make-button.size-tiny   { padding:2px 8px;   font-size:11px; border-radius:4px; }
.make-button.size-small  { padding:5px 14px;  font-size:12px; border-radius:6px; }
.make-button.size-large  { padding:12px 28px; font-size:16px; border-radius:10px; }
.make-button.size-xl     { padding:16px 36px; font-size:18px; border-radius:12px; }
.make-button.size-full   { width:100%; justify-content:center; }
.make-button.shape-pill   { border-radius:9999px; }
.make-button.shape-square { border-radius:0; }
.make-button.shape-rounded { border-radius:14px; }

/* make-card */
.make-card { background:#fff; border-radius:12px; box-shadow:var(--santy-shadow); overflow:hidden; }
.make-card.style-bordered  { border:1px solid #e5e7eb; box-shadow:none; }
.make-card.style-elevated  { box-shadow:0 10px 40px -8px rgba(0,0,0,.15); }
.make-card.style-flat      { box-shadow:none; }
.make-card.style-dark      { background:#1e293b; color:#f1f5f9; }
.make-card.shape-pill      { border-radius:9999px; }
.make-card.shape-square    { border-radius:0; }
.make-card.shape-rounded   { border-radius:20px; }
.make-card.size-small      { border-radius:8px; }
.make-card.size-large      { border-radius:20px; }

/* make-badge */
.make-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; font-size:12px; font-weight:600; border-radius:9999px; line-height:1.4; }
.make-badge.style-primary   { background:#dbeafe; color:#1d4ed8; }
.make-badge.style-secondary { background:#f3f4f6; color:#374151; }
.make-badge.style-success   { background:#dcfce7; color:#15803d; }
.make-badge.style-danger    { background:#fee2e2; color:#b91c1c; }
.make-badge.style-warning   { background:#fef3c7; color:#b45309; }
.make-badge.style-info      { background:#cffafe; color:#0e7490; }
.make-badge.style-dark      { background:#1e293b; color:#f1f5f9; }
.make-badge.style-outline   { background:transparent; border:1.5px solid currentColor; }
.make-badge.size-small      { padding:1px 7px; font-size:10px; }
.make-badge.size-large      { padding:5px 14px; font-size:14px; }
.make-badge.shape-square    { border-radius:4px; }
.make-badge.shape-rounded   { border-radius:6px; }

/* make-alert */
.make-alert { display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border-radius:10px; font-size:14px; border:1px solid transparent; line-height:1.5; }
.make-alert.style-info    { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
.make-alert.style-success { background:#f0fdf4; border-color:#bbf7d0; color:#15803d; }
.make-alert.style-warning { background:#fffbeb; border-color:#fde68a; color:#b45309; }
.make-alert.style-danger  { background:#fef2f2; border-color:#fecaca; color:#b91c1c; }
.make-alert.style-dark    { background:#1e293b; border-color:#334155; color:#f1f5f9; }
.make-alert.size-small    { padding:10px 12px; font-size:13px; border-radius:8px; }
.make-alert.size-large    { padding:20px; font-size:16px; border-radius:12px; }
.make-alert.shape-square  { border-radius:0; }
.make-alert.shape-pill    { border-radius:9999px; padding-left:24px; }

/* make-input */
.make-input { display:block; width:100%; padding:9px 12px; font-size:14px; font-family:inherit; color:#111827; background:#fff; border:1.5px solid #d1d5db; border-radius:8px; transition:border-color .15s,box-shadow .15s; outline:none; line-height:1.5; }
.make-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.2); }
.make-input.style-error   { border-color:#ef4444; }
.make-input.style-error:focus { box-shadow:0 0 0 3px rgba(239,68,68,.2); }
.make-input.style-success { border-color:#22c55e; }
.make-input.size-small    { padding:4px 8px;   font-size:12px; border-radius:6px; }
.make-input.size-large    { padding:12px 16px; font-size:16px; border-radius:10px; }
.make-input.shape-pill    { border-radius:9999px; padding-left:20px; }
.make-input.shape-square  { border-radius:0; }

/* make-avatar */
.make-avatar { display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#e5e7eb; color:#374151; font-weight:600; font-size:14px; overflow:hidden; flex-shrink:0; }
.make-avatar img { width:100%; height:100%; object-fit:cover; }
.make-avatar.size-tiny   { width:24px;  height:24px;  font-size:10px; }
.make-avatar.size-small  { width:32px;  height:32px;  font-size:12px; }
.make-avatar.size-large  { width:56px;  height:56px;  font-size:18px; }
.make-avatar.size-xl     { width:80px;  height:80px;  font-size:24px; }
.make-avatar.shape-square  { border-radius:8px; }
.make-avatar.shape-rounded { border-radius:12px; }
.make-avatar.style-primary { background:#dbeafe; color:#1d4ed8; }
.make-avatar.style-success { background:#dcfce7; color:#15803d; }
.make-avatar.style-danger  { background:#fee2e2; color:#b91c1c; }
.make-avatar.style-warning { background:#fef3c7; color:#b45309; }
.make-avatar.style-dark    { background:#1e293b; color:#f1f5f9; }

/* make-spinner */
.make-spinner { display:inline-block; width:24px; height:24px; border:3px solid #e5e7eb; border-top-color:#3b82f6; border-radius:50%; animation:santy-spin .75s linear infinite; }
.make-spinner.size-tiny   { width:14px; height:14px; border-width:2px; }
.make-spinner.size-small  { width:18px; height:18px; border-width:2px; }
.make-spinner.size-large  { width:40px; height:40px; border-width:4px; }
.make-spinner.size-xl     { width:56px; height:56px; border-width:5px; }
.make-spinner.style-success { border-top-color:#22c55e; }
.make-spinner.style-danger  { border-top-color:#ef4444; }
.make-spinner.style-warning { border-top-color:#f59e0b; }
.make-spinner.style-dark    { border-color:#334155; border-top-color:#f1f5f9; }

/* make-skeleton */
.make-skeleton { background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:santy-shimmer 1.5s infinite; border-radius:6px; }
.make-skeleton.shape-circle  { border-radius:50%; }
.make-skeleton.shape-pill    { border-radius:9999px; }
.make-skeleton.shape-square  { border-radius:0; }
.make-skeleton.size-small { height:12px; }
.make-skeleton.size-large { height:24px; }

/* make-progress */
.make-progress { width:100%; background:#e5e7eb; border-radius:9999px; overflow:hidden; }
.make-progress > .bar { height:8px; background:#3b82f6; border-radius:9999px; transition:width .4s ease; }
.make-progress.style-success > .bar { background:#22c55e; }
.make-progress.style-danger  > .bar { background:#ef4444; }
.make-progress.style-warning > .bar { background:#f59e0b; }
.make-progress.style-dark    > .bar { background:#1e293b; }
.make-progress.size-small > .bar    { height:4px; }
.make-progress.size-large > .bar    { height:14px; }
.make-progress.shape-square { border-radius:0; }
.make-progress.shape-square > .bar  { border-radius:0; }

/* make-table */
.make-table { width:100%; border-collapse:collapse; font-size:14px; }
.make-table th,.make-table td { padding:10px 12px; text-align:left; border-bottom:1px solid #e5e7eb; }
.make-table thead tr { background:#f9fafb; }
.make-table thead th { font-weight:600; color:#374151; font-size:12px; text-transform:uppercase; letter-spacing:.05em; }
.make-table.style-striped tbody tr:nth-child(even) { background:#f9fafb; }
.make-table.style-bordered { border:1px solid #e5e7eb; }
.make-table.style-bordered th,.make-table.style-bordered td { border:1px solid #e5e7eb; }
.make-table.style-hover tbody tr:hover { background:#f3f4f6; cursor:pointer; }
.make-table.style-dark { background:#1e293b; color:#f1f5f9; }
.make-table.style-dark th,.make-table.style-dark td { border-color:#334155; }
.make-table.style-dark thead tr { background:#0f172a; }
.make-table.size-small th,.make-table.size-small td { padding:6px 10px; font-size:13px; }
.make-table.size-large th,.make-table.size-large td { padding:14px 16px; font-size:15px; }

/* make-navbar */
.make-navbar { display:flex; align-items:center; justify-content:space-between; padding:12px 24px; background:#fff; border-bottom:1px solid #e5e7eb; gap:16px; }
.make-navbar.style-dark        { background:#1e293b; border-color:#334155; color:#f1f5f9; }
.make-navbar.style-glass       { background:rgba(255,255,255,.8); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
.make-navbar.style-transparent { background:transparent; border-color:transparent; }
.make-navbar.style-dark.style-glass { background:rgba(15,23,42,.85); }
.make-navbar.size-small        { padding:8px 16px; }
.make-navbar.size-large        { padding:20px 32px; }
.make-navbar.shape-sticky      { position:sticky; top:0; z-index:50; }

/* make-tooltip */
.make-tooltip { position:relative; display:inline-block; }
.make-tooltip .tip { visibility:hidden; opacity:0; position:absolute; z-index:100; background:#1f2937; color:#f9fafb; font-size:12px; padding:5px 10px; border-radius:6px; white-space:nowrap; pointer-events:none; transition:opacity .15s; line-height:1.4; }
.make-tooltip:hover .tip { visibility:visible; opacity:1; }
.make-tooltip.style-top    .tip { bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); }
.make-tooltip.style-bottom .tip { top:calc(100% + 8px);    left:50%; transform:translateX(-50%); }
.make-tooltip.style-left   .tip { right:calc(100% + 8px);  top:50%;  transform:translateY(-50%); }
.make-tooltip.style-right  .tip { left:calc(100% + 8px);   top:50%;  transform:translateY(-50%); }
.make-tooltip.style-light  .tip { background:#fff; color:#111827; box-shadow:0 4px 12px rgba(0,0,0,.15); }

/* make-notification */
.make-notification { display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border-radius:10px; font-size:14px; border:1px solid transparent; line-height:1.4; }
.make-notification.style-info    { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
.make-notification.style-success { background:#f0fdf4; border-color:#bbf7d0; color:#15803d; }
.make-notification.style-warning { background:#fffbeb; border-color:#fde68a; color:#b45309; }
.make-notification.style-danger  { background:#fef2f2; border-color:#fecaca; color:#b91c1c; }
.make-notification.style-dark    { background:#1e293b; border-color:#334155; color:#f1f5f9; }
.make-notification.size-small    { padding:10px 12px; font-size:13px; }
.make-notification.size-large    { padding:20px; font-size:15px; }

/* make-modal */
.make-modal { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:200; display:none; align-items:center; justify-content:center; padding:16px; }
.make-modal:target { display:flex; }
.make-modal > .box { background:#fff; border-radius:16px; box-shadow:0 25px 50px -12px rgba(0,0,0,.25); max-width:560px; width:100%; max-height:90vh; overflow-y:auto; animation:santy-zoom-in .25s ease; }
.make-modal.size-small > .box { max-width:400px; }
.make-modal.size-large > .box { max-width:768px; }
.make-modal.size-xl    > .box { max-width:1024px; }
.make-modal.size-full  > .box { max-width:100%; height:100vh; border-radius:0; max-height:100vh; }
.make-modal.shape-square > .box { border-radius:0; }
.make-modal.style-dark > .box { background:#1e293b; color:#f1f5f9; }

/* make-drawer */
.make-drawer { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:200; display:none; }
.make-drawer:target { display:block; }
.make-drawer > .panel { position:fixed; top:0; bottom:0; left:0; width:300px; background:#fff; z-index:201; overflow-y:auto; box-shadow:4px 0 24px rgba(0,0,0,.12); transform:translateX(-100%); transition:transform .3s ease; }
.make-drawer:target > .panel { transform:translateX(0); }
.make-drawer.style-right > .panel { left:auto; right:0; transform:translateX(100%); box-shadow:-4px 0 24px rgba(0,0,0,.12); }
.make-drawer:target.style-right > .panel { transform:translateX(0); }
.make-drawer.style-dark > .panel { background:#1e293b; color:#f1f5f9; }
.make-drawer.size-small > .panel { width:220px; }
.make-drawer.size-large > .panel { width:420px; }

/* make-accordion */
.make-accordion { border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; }
.make-accordion.style-flush  { border:none; border-radius:0; }
.make-accordion.style-dark   { background:#1e293b; border-color:#334155; color:#f1f5f9; }
.make-accordion.shape-square { border-radius:0; }
.make-accordion.shape-rounded { border-radius:16px; }

/* make-dropdown */
.make-dropdown { position:relative; display:inline-block; }
.make-dropdown > .menu { display:none; position:absolute; top:calc(100% + 4px); left:0; min-width:180px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,.1); z-index:100; overflow:hidden; padding:4px; }
.make-dropdown.open > .menu { display:block; }
.make-dropdown.style-right > .menu { left:auto; right:0; }
.make-dropdown.style-top   > .menu { top:auto; bottom:calc(100% + 4px); }
.make-dropdown.style-dark  > .menu { background:#1e293b; border-color:#334155; }
.make-dropdown.size-small  > .menu { min-width:140px; font-size:13px; }
.make-dropdown.size-large  > .menu { min-width:240px; font-size:15px; }

/* ── Dark Mode Component Variants ── */
@media (prefers-color-scheme: dark) {
  .dark-auto .card         { background-color: #1e293b; }
  .dark-auto .card-header  { border-color: #334155; }
  .dark-auto .card-footer  { border-color: #334155; }
  .dark-auto .btn-outline  { border-color: #475569; color: #e2e8f0; }
  .dark-auto .input        { background-color: #1e293b; border-color: #334155; color: #f1f5f9; }
  .dark-auto .input::placeholder { color: #64748b; }
  .dark-auto .select       { background-color: #1e293b; border-color: #334155; color: #f1f5f9; }
}
/* Manual dark mode via .dark class on html/body */
.dark .card         { background-color: #1e293b; color: #f1f5f9; }
.dark .card-header  { border-color: #334155; }
.dark .card-footer  { border-color: #334155; }
.dark .card-body    { color: #cbd5e1; }
.dark .input        { background-color: #1e293b; border-color: #334155; color: #f1f5f9; }
.dark .input:focus  { border-color: #3b82f6; }
.dark .select       { background-color: #1e293b; border-color: #334155; color: #f1f5f9; }
.dark .textarea     { background-color: #1e293b; border-color: #334155; color: #f1f5f9; }
.dark .dropdown-menu { background-color: #1e293b; border-color: #334155; }
.dark .dropdown-item { color: #e2e8f0; }
.dark .dropdown-item:hover { background-color: #334155; color: #f1f5f9; }
.dark .list-group-item { background-color: #1e293b; border-color: #334155; color: #e2e8f0; }
.dark .list-group-item:hover { background-color: #334155; }
.dark .table th, .dark .table td { border-color: #334155; }
.dark .table thead tr { background-color: #0f172a; }
.dark .table thead th { color: #94a3b8; }
.dark .modal-box { background-color: #1e293b; color: #f1f5f9; }
.dark .modal-header { border-color: #334155; }
.dark .modal-footer { border-color: #334155; }
.dark .accordion { border-color: #334155; }
.dark .accordion-item { border-color: #334155; }
.dark .accordion-header { background-color: #1e293b; color: #f1f5f9; }
.dark .accordion-header:hover { background-color: #334155; }
.dark .accordion-body { background-color: #1e293b; color: #94a3b8; }
.dark .tabs { border-color: #334155; }
.dark .tabs-item { color: #94a3b8; }
.dark .tabs-item:hover { color: #e2e8f0; }
.dark .tabs-pill { background-color: #0f172a; }
.dark .tabs-pill .tabs-item.active { background-color: #1e293b; color: #f1f5f9; }
/* Dark buttons */
.dark .btn-outline { border-color: #475569; color: #e2e8f0; }
.dark .btn-outline:hover { background-color: #334155; }
.dark .btn-ghost { color: #cbd5e1; }
.dark .btn-ghost:hover { background-color: #334155; }
.dark .btn-secondary { background-color: #334155; color: #f1f5f9; border-color: #475569; }
.dark .btn-secondary:hover { background-color: #475569; }
/* Dark alerts */
.dark .alert { background-color: #1e293b; border-color: #334155; color: #e2e8f0; }
.dark .alert-info    { background-color: #0c1a2e; border-color: #1e3a5f; color: #93c5fd; }
.dark .alert-success { background-color: #052e16; border-color: #166534; color: #86efac; }
.dark .alert-warning { background-color: #2d1b00; border-color: #92400e; color: #fcd34d; }
.dark .alert-danger  { background-color: #2d0a0a; border-color: #991b1b; color: #fca5a5; }
/* Dark badges */
.dark .badge { background-color: #334155; color: #e2e8f0; }
/* Dark notifications */
.dark .notification { background-color: #1e293b; border-color: #334155; color: #e2e8f0; }
.dark .notification-success { background-color: #052e16; border-color: #166534; }
.dark .notification-error   { background-color: #2d0a0a; border-color: #991b1b; }
.dark .notification-warning { background-color: #2d1b00; border-color: #92400e; }
/* Dark breadcrumb + pagination */
.dark .breadcrumb-item { color: #94a3b8; }
.dark .breadcrumb-item.active { color: #e2e8f0; }
.dark .page-link { background-color: #1e293b; border-color: #334155; color: #e2e8f0; }
.dark .page-item.active .page-link { background-color: #3b82f6; border-color: #3b82f6; color: #fff; }
.dark .page-item.disabled .page-link { opacity: 0.4; }
/* Dark navbar */
.dark .navbar { background-color: #0f172a; border-color: #1e293b; }
.dark .navbar-brand { color: #f1f5f9; }
.dark .navbar-item { color: #94a3b8; }
.dark .navbar-item:hover { background-color: #1e293b; color: #f1f5f9; }
/* Dark drawer */
.dark .drawer-panel { background-color: #1e293b; }
.dark .drawer-header { border-color: #334155; color: #f1f5f9; }
.dark .drawer-body { color: #cbd5e1; }
/* Dark steps */
.dark .step-dot { background-color: #334155; color: #94a3b8; }
.dark .step.active .step-dot { background-color: #3b82f6; color: #fff; }
.dark .step.done .step-dot { background-color: #22c55e; color: #fff; }
.dark .step-label { color: #94a3b8; }
.dark .step.active .step-label { color: #f1f5f9; }

/* ── Container Queries (modern CSS) ── */
@container (min-width: 400px) { .cq-sm\\:make-flex { display: flex; } .cq-sm\\:grid-cols-2 { grid-template-columns: repeat(2,1fr); } }
@container (min-width: 600px) { .cq-md\\:grid-cols-3 { grid-template-columns: repeat(3,1fr); } .cq-md\\:make-flex { display: flex; } }
@container (min-width: 800px) { .cq-lg\\:grid-cols-4 { grid-template-columns: repeat(4,1fr); } }
.container-query { container-type: inline-size; }
.container-query-size { container-type: size; }
`);

// ─── DARK THEME TOKENS + UI COMPONENTS (v1.4) ─────────────────────────────────
add(`
/* ── Dark Theme CSS Tokens ── */
:root {
  --color-surface:      #0f172a;
  --color-card:         #1e293b;
  --color-accent:       #38bdf8;
  --color-accent-light: rgba(56,189,248,.13);
  --color-text:         #f1f5f9;
  --color-muted:        #64748b;
  --color-warning:      #facc15;
}

/* ── Semantic Color Utilities ── */
.bg-surface      { background-color: var(--color-surface); }
.bg-accent-light { background-color: var(--color-accent-light); }
.text-accent     { color: var(--color-accent); }
.text-primary    { color: var(--color-text); }
.text-muted      { color: var(--color-muted); }

/* ── Badge Color Variants ── */
.badge-green  { background-color: rgba(22,163,74,.13);  color: #4ade80; }
.badge-blue   { background-color: rgba(37,99,235,.13);  color: #60a5fa; }
.badge-yellow { background-color: rgba(202,138,4,.13);  color: #facc15; }
.badge-red    { background-color: rgba(220,38,38,.13);  color: #f87171; }

/* ── Named Height Utilities ── */
.h-xs { height: 24px; }
.h-sm { height: 48px; }
.h-md { height: 96px; }
.h-lg { height: 160px; }

/* ── Progress Bar Color Variants ── */
.progress-bar-green  { background-color: #22c55e; }
.progress-bar-red    { background-color: #ef4444; }
.progress-bar-yellow { background-color: #eab308; }
.progress-bar-purple { background-color: #8b5cf6; }
.progress-bar-orange { background-color: #f97316; }

/* ── Slider (Range — dark-themed) ── */
.slider { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 2px; background: var(--color-card, #1e293b); outline: none; cursor: pointer; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--color-accent, #38bdf8); cursor: pointer; box-shadow: 0 0 0 3px rgba(56,189,248,.2); }
.slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: var(--color-accent, #38bdf8); cursor: pointer; border: none; }

/* ── Stat Card ── */
.stat-card {
  background: var(--color-card, #1e293b);
  border-radius: 8px;
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* ── Button Icon ── */
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-light, rgba(56,189,248,.13));
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-icon:hover { opacity: 0.8; }

/* ── Input Text (dark-theme) ── */
.input-text {
  flex: 1;
  width: 100%;
  background: var(--color-surface, #0f172a);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--color-text, #f1f5f9);
  font-size: 15px;
  min-height: 44px;
  border: 1px solid #334155;
  outline: none;
}
.input-text:focus { border-color: var(--color-accent, #38bdf8); }

/* ── Chat Bubbles ── */
.chat-bubble-user {
  align-self: flex-end;
  background: var(--color-accent-light, rgba(56,189,248,.13));
  border-radius: 16px 16px 4px 16px;
  padding: 10px 14px;
  max-width: 78%;
  color: var(--color-text, #f1f5f9);
}
.chat-bubble-ai {
  align-self: flex-start;
  background: var(--color-card, #1e293b);
  border-radius: 16px 16px 16px 4px;
  padding: 10px 14px;
  max-width: 78%;
  color: var(--color-text, #f1f5f9);
}

/* ── Typing Indicator ── */
.typing-indicator { display: flex; gap: 4px; padding: 10px; align-self: flex-start; }
.typing-indicator span { width: 8px; height: 8px; border-radius: 50%; background: var(--color-muted, #64748b); animation: santy-blink 1.2s ease-in-out infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes santy-blink { 0%, 80%, 100% { opacity: 0; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }

/* ── Calorie Ring (SVG ring chart wrapper) ── */
.calorie-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }

/* ── Scan Overlay ── */
.scan-overlay { position: absolute; border: 2px solid var(--color-accent, #38bdf8); border-radius: 12px; overflow: hidden; }

/* ── Scan Line Animated ── */
.scan-line-animated { position: absolute; left: 0; right: 0; height: 2px; background: var(--color-accent, #38bdf8); animation: santy-scan-sweep 1.8s ease-in-out infinite alternate; }
@keyframes santy-scan-sweep { from { top: 0%; } to { top: 100%; } }

/* ── Bar Chart Wrapper ── */
.bar-chart-wrapper { background: var(--color-card, #1e293b); border-radius: 12px; padding: 16px; overflow: hidden; }
`);

// ─── WRITE FILES (full + split) ───────────────────────────────────────────────
const fullCSS = lines.join('\n');

// Split at component marker for santy-core.css (utilities only, no components)
const COMP_MARKER = '/* ═══ SANTY COMPONENTS ═══ */';
const compSplit = fullCSS.indexOf(COMP_MARKER);
const coreCSS = compSplit > -1 ? fullCSS.slice(0, compSplit).trim() : fullCSS;

// Split animations out for santy-animations.css
const ANIM_MARKER = '/* ═══════════════════════════════════════════════════════════════════════\n   SANTY ANIMATIONS';
const animSplit = coreCSS.indexOf(ANIM_MARKER);
const utilCSS = animSplit > -1 ? coreCSS.slice(0, animSplit).trim() : coreCSS;

// animations live in coreCSS (before the component marker)
const animCSS  = animSplit > -1 ? coreCSS.slice(animSplit) : '';
const compCSS  = compSplit > -1 ? fullCSS.slice(compSplit) : '';

// ─── EMAIL CSS MODULE ────────────────────────────────────────────────────────
const EMAIL_CSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   SANTY EMAIL — Email-safe CSS for HTML email templates
   Compatible with: Gmail, Outlook, Apple Mail, Yahoo Mail, Thunderbird
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Reset & Base ── */
.email-html, .email-body { margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
.email-wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f5; }
.email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }

/* ── Preheader (hidden preview text) ── */
.email-preheader { display: none; max-height: 0; max-width: 0; overflow: hidden; opacity: 0; visibility: hidden; mso-hide: all; font-size: 1px; color: transparent; }

/* ── Table Layout (email-safe) ── */
.email-table  { border-spacing: 0; border-collapse: collapse; width: 100%; }
.email-cell   { padding: 0; vertical-align: top; word-break: break-word; }
.email-cell-middle { vertical-align: middle; }
.email-cell-bottom { vertical-align: bottom; }
.email-row    { width: 100%; }
.email-col-half  { width: 50%; vertical-align: top; }
.email-col-third { width: 33.33%; vertical-align: top; }
.email-col-two-thirds { width: 66.66%; vertical-align: top; }

/* ── Header ── */
.email-header       { background-color: #1e293b; padding: 24px 32px; text-align: center; }
.email-header-light { background-color: #ffffff; padding: 20px 32px; border-bottom: 1px solid #e5e7eb; }
.email-logo         { max-width: 160px; height: auto; display: block; margin: 0 auto; }
.email-logo-left    { margin: 0; }

/* ── Body Wrapper ── */
.email-body-wrap        { background-color: #ffffff; padding: 40px 32px; }
.email-body-wrap-gray   { background-color: #f9fafb; padding: 32px; }
.email-section          { padding: 24px 0; }
.email-section-bordered { border-bottom: 1px solid #e5e7eb; padding: 24px 0; }

/* ── Footer ── */
.email-footer      { background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
.email-footer-dark { background-color: #0f172a; border-top-color: #1e293b; }

/* ── Typography ── */
.email-h1 { font-size: 28px; font-weight: 700; color: #111827; margin: 0 0 16px 0; line-height: 1.2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
.email-h2 { font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 12px 0; line-height: 1.3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
.email-h3 { font-size: 18px; font-weight: 600; color: #1e293b; margin: 0 0 10px 0; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
.email-p  { font-size: 15px; line-height: 1.7; color: #374151; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
.email-p-lead { font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 20px 0; }
.email-small { font-size: 12px; color: #6b7280; line-height: 1.5; }
.email-muted { color: #9ca3af; font-size: 13px; }
.email-link  { color: #3b82f6; text-decoration: underline; }
.email-link:hover { color: #2563eb; }
.email-text-center { text-align: center; }
.email-text-left   { text-align: left; }
.email-text-right  { text-align: right; }
.email-bold   { font-weight: 700; }
.email-semibold { font-weight: 600; }

/* ── Buttons ── */
.email-btn         { display: inline-block; padding: 13px 28px; background-color: #3b82f6; color: #ffffff !important; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; mso-padding-alt: 0; }
.email-btn-sm      { padding: 9px 20px; font-size: 13px; }
.email-btn-lg      { padding: 16px 36px; font-size: 17px; }
.email-btn-outline { display: inline-block; padding: 11px 26px; background-color: transparent; color: #3b82f6 !important; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; border: 2px solid #3b82f6; }
.email-btn-dark    { background-color: #1e293b; color: #ffffff !important; }
.email-btn-success { background-color: #22c55e; color: #ffffff !important; }
.email-btn-danger  { background-color: #ef4444; color: #ffffff !important; }
.email-btn-warning { background-color: #f59e0b; color: #ffffff !important; }
.email-btn-center  { text-align: center; padding: 24px 0; }
.email-btn-full    { display: block; text-align: center; }

/* ── Dividers ── */
.email-divider      { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
.email-divider-dark { border-top-color: #334155; }
.email-divider-thick { border-top: 3px solid #3b82f6; }

/* ── Cards & Callouts ── */
.email-card         { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px; }
.email-card-gray    { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px; }
.email-callout         { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; margin: 0 0 16px 0; }
.email-callout-success { background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px 20px; margin: 0 0 16px 0; }
.email-callout-warning { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; margin: 0 0 16px 0; }
.email-callout-danger  { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 20px; margin: 0 0 16px 0; }
.email-highlight    { background-color: #fef9c3; padding: 2px 6px; border-radius: 3px; }

/* ── Hero Section ── */
.email-hero         { padding: 48px 32px; text-align: center; background-color: #1e40af; }
.email-hero-light   { padding: 48px 32px; text-align: center; background-color: #eff6ff; }
.email-hero-gradient { padding: 48px 32px; text-align: center; background: linear-gradient(135deg, #1e40af, #7c3aed); }

/* ── Images ── */
.email-img         { max-width: 100%; height: auto; display: block; }
.email-img-rounded { border-radius: 8px; max-width: 100%; height: auto; display: block; }
.email-img-circle  { border-radius: 50%; }
.email-img-center  { margin: 0 auto; display: block; }
.email-img-full    { width: 100%; height: auto; display: block; }

/* ── Avatar ── */
.email-avatar-sm { width: 32px; height: 32px; border-radius: 50%; }
.email-avatar-md { width: 48px; height: 48px; border-radius: 50%; }
.email-avatar-lg { width: 64px; height: 64px; border-radius: 50%; }

/* ── List / Items ── */
.email-list       { padding: 0 0 0 20px; margin: 0 0 16px 0; }
.email-list li    { font-size: 15px; line-height: 1.7; color: #374151; margin-bottom: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
.email-check-list { list-style: none; padding: 0; margin: 0 0 16px 0; }
.email-check-list li { font-size: 15px; line-height: 1.7; color: #374151; margin-bottom: 8px; padding-left: 24px; position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
.email-check-list li::before { content: '✓'; position: absolute; left: 0; color: #22c55e; font-weight: 700; }

/* ── Product / Feature Rows ── */
.email-product-img  { width: 80px; height: 80px; border-radius: 8px; }
.email-product-name { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 4px 0; }
.email-product-desc { font-size: 13px; color: #6b7280; margin: 0; }
.email-product-price { font-size: 16px; font-weight: 700; color: #111827; }

/* ── Badges ── */
.email-badge         { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.email-badge-blue    { background-color: #dbeafe; color: #1d4ed8; }
.email-badge-green   { background-color: #dcfce7; color: #15803d; }
.email-badge-red     { background-color: #fee2e2; color: #dc2626; }
.email-badge-yellow  { background-color: #fef9c3; color: #a16207; }
.email-badge-purple  { background-color: #f3e8ff; color: #7e22ce; }
.email-badge-gray    { background-color: #f3f4f6; color: #374151; }
.email-badge-new     { background-color: #3b82f6; color: #ffffff; }

/* ── Stat Blocks ── */
.email-stat-value { font-size: 32px; font-weight: 700; color: #111827; line-height: 1; margin: 0 0 4px 0; }
.email-stat-label { font-size: 13px; color: #6b7280; margin: 0; }

/* ── Code Block ── */
.email-code { display: block; background-color: #1e293b; color: #e2e8f0; padding: 16px 20px; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.6; }
.email-code-inline { background-color: #f1f5f9; color: #e11d48; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 13px; }

/* ── Spacers ── */
.email-spacer-4  { height: 4px;  line-height: 4px;  font-size: 4px;  display: block; }
.email-spacer-8  { height: 8px;  line-height: 8px;  font-size: 8px;  display: block; }
.email-spacer-16 { height: 16px; line-height: 16px; font-size: 16px; display: block; }
.email-spacer-24 { height: 24px; line-height: 24px; font-size: 24px; display: block; }
.email-spacer-32 { height: 32px; line-height: 32px; font-size: 32px; display: block; }
.email-spacer-48 { height: 48px; line-height: 48px; font-size: 48px; display: block; }
.email-spacer-64 { height: 64px; line-height: 64px; font-size: 64px; display: block; }

/* ── Social Links ── */
.email-social-wrap { text-align: center; padding: 16px 0; }
.email-social-link { display: inline-block; margin: 0 6px; width: 36px; height: 36px; border-radius: 50%; background-color: #e5e7eb; text-align: center; line-height: 36px; text-decoration: none; font-size: 14px; color: #374151; }
.email-social-link-blue   { background-color: #dbeafe; color: #1d4ed8; }
.email-social-link-dark   { background-color: #334155; color: #e2e8f0; }
.email-social-text-link   { display: inline-block; margin: 0 8px; font-size: 13px; color: #6b7280; text-decoration: underline; }

/* ── Unsubscribe / Legal ── */
.email-legal    { font-size: 11px; color: #9ca3af; line-height: 1.6; text-align: center; }
.email-address  { font-size: 11px; color: #9ca3af; line-height: 1.6; }
.email-unsubscribe { font-size: 12px; color: #9ca3af; text-decoration: underline; }

/* ── Responsive (Mobile) ── */
@media screen and (max-width: 600px) {
  .email-container       { width: 100% !important; max-width: 100% !important; }
  .email-body-wrap       { padding: 24px 20px !important; }
  .email-header          { padding: 20px !important; }
  .email-footer          { padding: 20px !important; }
  .email-hero            { padding: 32px 20px !important; }
  .email-h1              { font-size: 22px !important; }
  .email-h2              { font-size: 18px !important; }
  .email-h3              { font-size: 16px !important; }
  .email-p-lead          { font-size: 16px !important; }
  .email-btn, .email-btn-outline { display: block !important; text-align: center !important; }
  .email-col-half, .email-col-third, .email-col-two-thirds { width: 100% !important; display: block !important; }
  .email-mobile-hidden   { display: none !important; max-height: 0 !important; overflow: hidden !important; }
  .email-mobile-visible  { display: block !important; }
  .email-mobile-full     { width: 100% !important; }
  .email-mobile-center   { text-align: center !important; }
  .email-mobile-padding  { padding: 16px !important; }
  .email-stat-value      { font-size: 24px !important; }
}

/* ── Dark Mode (Apple Mail, Outlook 2019+, Hey) ── */
@media (prefers-color-scheme: dark) {
  .email-wrapper, .email-body  { background-color: #0f172a !important; }
  .email-container             { background-color: #1e293b !important; }
  .email-body-wrap             { background-color: #1e293b !important; }
  .email-body-wrap-gray        { background-color: #0f172a !important; }
  .email-header-light          { background-color: #1e293b !important; border-bottom-color: #334155 !important; }
  .email-footer                { background-color: #0f172a !important; border-top-color: #1e293b !important; }
  .email-h1, .email-h2, .email-h3 { color: #f1f5f9 !important; }
  .email-p, .email-list li, .email-check-list li { color: #cbd5e1 !important; }
  .email-p-lead                { color: #e2e8f0 !important; }
  .email-card                  { background-color: #1e293b !important; border-color: #334155 !important; }
  .email-card-gray             { background-color: #0f172a !important; border-color: #334155 !important; }
  .email-divider               { border-top-color: #334155 !important; }
  .email-code                  { background-color: #0f172a !important; }
  .email-code-inline           { background-color: #334155 !important; color: #f472b6 !important; }
  .email-stat-value            { color: #f1f5f9 !important; }
  .email-product-name          { color: #f1f5f9 !important; }
  .email-product-price         { color: #f1f5f9 !important; }
  .email-social-link           { background-color: #334155 !important; color: #e2e8f0 !important; }
}
`;

// ── 20 new utility groups ──────────────────────────────────────────────────
add(`
/* ═══════════════════════════════════════════════════════════════════════════
   1. CONTAINER QUERIES
═══════════════════════════════════════════════════════════════════════════ */
.container-type-inline { container-type: inline-size; }
.container-type-size   { container-type: size; }
.container-type-normal { container-type: normal; }
.container-name-card   { container-name: card; }
.container-name-layout { container-name: layout; }
@container (min-width: 320px) { .on-container-xs\\:make-flex { display: flex; } .on-container-xs\\:make-block { display: block; } .on-container-xs\\:grid-cols-1 { grid-template-columns: repeat(1,1fr); } }
@container (min-width: 480px) { .on-container-sm\\:make-flex { display: flex; } .on-container-sm\\:make-grid { display: grid; } .on-container-sm\\:grid-cols-2 { grid-template-columns: repeat(2,1fr); } .on-container-sm\\:grid-cols-3 { grid-template-columns: repeat(3,1fr); } .on-container-sm\\:set-text-16 { font-size: 16px; } .on-container-sm\\:set-text-18 { font-size: 18px; } }
@container (min-width: 640px) { .on-container-md\\:make-flex { display: flex; } .on-container-md\\:make-grid { display: grid; } .on-container-md\\:grid-cols-2 { grid-template-columns: repeat(2,1fr); } .on-container-md\\:grid-cols-3 { grid-template-columns: repeat(3,1fr); } .on-container-md\\:grid-cols-4 { grid-template-columns: repeat(4,1fr); } .on-container-md\\:set-text-18 { font-size: 18px; } .on-container-md\\:set-text-20 { font-size: 20px; } }
@container (min-width: 768px) { .on-container-lg\\:make-flex { display: flex; } .on-container-lg\\:make-grid { display: grid; } .on-container-lg\\:grid-cols-3 { grid-template-columns: repeat(3,1fr); } .on-container-lg\\:grid-cols-4 { grid-template-columns: repeat(4,1fr); } .on-container-lg\\:set-text-20 { font-size: 20px; } .on-container-lg\\:set-text-24 { font-size: 24px; } .on-container-lg\\:make-hidden { display: none; } }
@container (min-width: 1024px) { .on-container-xl\\:grid-cols-4 { grid-template-columns: repeat(4,1fr); } .on-container-xl\\:grid-cols-6 { grid-template-columns: repeat(6,1fr); } .on-container-xl\\:set-text-24 { font-size: 24px; } }

/* ═══════════════════════════════════════════════════════════════════════════
   2. SCROLL UTILITIES
═══════════════════════════════════════════════════════════════════════════ */
.scroll-smooth   { scroll-behavior: smooth; }
.scroll-auto     { scroll-behavior: auto; }
.scroll-snap-x   { scroll-snap-type: x mandatory; overflow-x: scroll; }
.scroll-snap-y   { scroll-snap-type: y mandatory; overflow-y: scroll; }
.scroll-snap-x-proximity { scroll-snap-type: x proximity; overflow-x: scroll; }
.scroll-snap-y-proximity { scroll-snap-type: y proximity; overflow-y: scroll; }
.scroll-snap-start  { scroll-snap-align: start; }
.scroll-snap-center { scroll-snap-align: center; }
.scroll-snap-end    { scroll-snap-align: end; }
.scroll-snap-none   { scroll-snap-align: none; }
.scroll-snap-stop   { scroll-snap-stop: always; }
.overscroll-auto    { overscroll-behavior: auto; }
.overscroll-contain { overscroll-behavior: contain; }
.overscroll-none    { overscroll-behavior: none; }
.overscroll-x-contain { overscroll-behavior-x: contain; }
.overscroll-y-contain { overscroll-behavior-y: contain; }
.scroll-padding-top-0  { scroll-padding-top: 0; }
.scroll-padding-top-16 { scroll-padding-top: 16px; }
.scroll-padding-top-48 { scroll-padding-top: 48px; }
.scroll-padding-top-64 { scroll-padding-top: 64px; }
.scroll-padding-top-80 { scroll-padding-top: 80px; }
.scroll-padding-top-96 { scroll-padding-top: 96px; }
.scroll-margin-top-16  { scroll-margin-top: 16px; }
.scroll-margin-top-64  { scroll-margin-top: 64px; }
.scroll-margin-top-80  { scroll-margin-top: 80px; }

/* ═══════════════════════════════════════════════════════════════════════════
   3. ASPECT RATIO (expanded)
═══════════════════════════════════════════════════════════════════════════ */
.aspect-square    { aspect-ratio: 1 / 1; }
.aspect-video     { aspect-ratio: 16 / 9; }
.aspect-portrait  { aspect-ratio: 3 / 4; }
.aspect-cinema    { aspect-ratio: 21 / 9; }
.aspect-4-3       { aspect-ratio: 4 / 3; }
.aspect-3-2       { aspect-ratio: 3 / 2; }
.aspect-2-1       { aspect-ratio: 2 / 1; }
.aspect-1-2       { aspect-ratio: 1 / 2; }
.aspect-golden    { aspect-ratio: 1.618 / 1; }
.aspect-auto      { aspect-ratio: auto; }

/* ═══════════════════════════════════════════════════════════════════════════
   4. LOGICAL PROPERTIES (RTL/LTR)
═══════════════════════════════════════════════════════════════════════════ */
.text-start { text-align: start; }
.text-end   { text-align: end; }
.add-margin-inline-auto   { margin-inline: auto; }
.add-margin-inline-0      { margin-inline: 0; }
.add-margin-block-auto    { margin-block: auto; }
.add-padding-inline-8     { padding-inline: 8px; }
.add-padding-inline-16    { padding-inline: 16px; }
.add-padding-inline-24    { padding-inline: 24px; }
.add-padding-inline-32    { padding-inline: 32px; }
.add-padding-inline-48    { padding-inline: 48px; }
.add-padding-block-8      { padding-block: 8px; }
.add-padding-block-16     { padding-block: 16px; }
.add-padding-block-24     { padding-block: 24px; }
.add-padding-block-32     { padding-block: 32px; }
.add-padding-block-48     { padding-block: 48px; }
.add-border-inline-1      { border-inline: 1px solid; }
.add-border-inline-2      { border-inline: 2px solid; }
.add-border-block-1       { border-block: 1px solid; }
.add-border-block-2       { border-block: 2px solid; }
.border-start-1           { border-inline-start: 1px solid; }
.border-start-2           { border-inline-start: 2px solid; }
.border-start-4           { border-inline-start: 4px solid; }
.border-end-1             { border-inline-end: 1px solid; }
.border-end-2             { border-inline-end: 2px solid; }
.inset-inline-0           { inset-inline: 0; }
.inset-block-0            { inset-block: 0; }
.ps-0 { padding-inline-start: 0; }
.ps-8 { padding-inline-start: 8px; }
.ps-16 { padding-inline-start: 16px; }
.ps-24 { padding-inline-start: 24px; }
.pe-0 { padding-inline-end: 0; }
.pe-8 { padding-inline-end: 8px; }
.pe-16 { padding-inline-end: 16px; }
.pe-24 { padding-inline-end: 24px; }
.ms-auto { margin-inline-start: auto; }
.me-auto { margin-inline-end: auto; }

/* ═══════════════════════════════════════════════════════════════════════════
   5. GRADIENT UTILITIES (expanded)
═══════════════════════════════════════════════════════════════════════════ */
.gradient-radial-from-center { background: radial-gradient(circle at center, var(--grad-from, #3b82f6), var(--grad-to, #1e1b4b)); }
.gradient-radial-from-top    { background: radial-gradient(circle at top, var(--grad-from, #3b82f6), var(--grad-to, #1e1b4b)); }
.gradient-conic              { background: conic-gradient(from 0deg, var(--grad-from, #3b82f6), var(--grad-via, #8b5cf6), var(--grad-to, #ec4899), var(--grad-from, #3b82f6)); }
.gradient-conic-from-top     { background: conic-gradient(from 180deg at 50% 0%, var(--grad-from, #3b82f6), var(--grad-to, #8b5cf6)); }
.text-gradient { -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.text-gradient-blue-to-purple  { background-image: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.text-gradient-purple-to-pink  { background-image: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.text-gradient-orange-to-red   { background-image: linear-gradient(135deg, #f97316, #ef4444); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.text-gradient-green-to-cyan   { background-image: linear-gradient(135deg, #22c55e, #06b6d4); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.text-gradient-blue-to-green   { background-image: linear-gradient(135deg, #3b82f6, #22c55e); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.text-gradient-yellow-to-orange { background-image: linear-gradient(135deg, #eab308, #f97316); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.border-gradient-blue-to-purple { border: 2px solid transparent; background-clip: padding-box; position: relative; }
.border-gradient-blue-to-purple::before { content: ''; position: absolute; inset: -2px; border-radius: inherit; background: linear-gradient(135deg, #3b82f6, #8b5cf6); z-index: -1; }
.border-gradient-orange-to-pink { border: 2px solid transparent; background-clip: padding-box; position: relative; }
.border-gradient-orange-to-pink::before { content: ''; position: absolute; inset: -2px; border-radius: inherit; background: linear-gradient(135deg, #f97316, #ec4899); z-index: -1; }
.gradient-via-purple-400 { --grad-via: #a78bfa; }
.gradient-via-pink-400   { --grad-via: #f472b6; }
.gradient-via-cyan-400   { --grad-via: #22d3ee; }
.gradient-via-yellow-400 { --grad-via: #facc15; }

/* ═══════════════════════════════════════════════════════════════════════════
   6. CLIP PATH UTILITIES
═══════════════════════════════════════════════════════════════════════════ */
.clip-circle       { clip-path: circle(50%); }
.clip-ellipse      { clip-path: ellipse(60% 40% at 50% 50%); }
.clip-triangle-up  { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
.clip-triangle-down { clip-path: polygon(0% 0%, 100% 0%, 50% 100%); }
.clip-diamond      { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
.clip-hexagon      { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
.clip-pentagon     { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }
.clip-star         { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
.clip-chevron-right { clip-path: polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%, 20% 50%); }
.clip-arrow-right  { clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%); }
.clip-none         { clip-path: none; }

/* ═══════════════════════════════════════════════════════════════════════════
   7. CSS GRID ADVANCED
═══════════════════════════════════════════════════════════════════════════ */
.grid-auto-fit-min-120 { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
.grid-auto-fit-min-150 { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
.grid-auto-fit-min-200 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.grid-auto-fit-min-240 { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.grid-auto-fit-min-280 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.grid-auto-fit-min-320 { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
.grid-auto-fill-min-120 { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
.grid-auto-fill-min-150 { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.grid-auto-fill-min-200 { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
.grid-auto-fill-min-240 { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.grid-auto-fill-min-280 { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.grid-auto-fill-min-320 { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
.grid-area-header  { grid-area: header; }
.grid-area-nav     { grid-area: nav; }
.grid-area-sidebar { grid-area: sidebar; }
.grid-area-main    { grid-area: main; }
.grid-area-footer  { grid-area: footer; }
.grid-area-aside   { grid-area: aside; }
.grid-template-layout-holy-grail {
  display: grid;
  grid-template-areas: "header header header" "nav main aside" "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
.grid-template-layout-sidebar-left {
  display: grid;
  grid-template-areas: "sidebar main";
  grid-template-columns: 260px 1fr;
  gap: 0;
}
.grid-template-layout-sidebar-right {
  display: grid;
  grid-template-areas: "main sidebar";
  grid-template-columns: 1fr 260px;
  gap: 0;
}
.masonry-cols-2 { columns: 2; column-gap: 16px; }
.masonry-cols-3 { columns: 3; column-gap: 16px; }
.masonry-cols-4 { columns: 4; column-gap: 16px; }
.masonry-item   { break-inside: avoid; margin-bottom: 16px; }
.grid-dense     { grid-auto-flow: dense; }
.grid-row-dense { grid-auto-flow: row dense; }
.grid-col-dense { grid-auto-flow: column dense; }

/* ═══════════════════════════════════════════════════════════════════════════
   8. ADVANCED TYPOGRAPHY
═══════════════════════════════════════════════════════════════════════════ */
.text-balance  { text-wrap: balance; }
.text-pretty   { text-wrap: pretty; }
.text-nowrap   { white-space: nowrap; }
.text-wrap     { white-space: normal; }
.text-clamp-1  { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.text-clamp-2  { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.text-clamp-3  { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.text-clamp-4  { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.text-clamp-5  { display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
.text-indent-8  { text-indent: 8px; }
.text-indent-16 { text-indent: 16px; }
.text-indent-32 { text-indent: 32px; }
.hanging-punctuation { hanging-punctuation: first last; }
.drop-cap::first-letter { float: left; font-size: 3.5em; line-height: 0.85; font-weight: 700; margin-right: 8px; margin-top: 4px; }
.first-letter-large::first-letter { font-size: 2em; font-weight: 700; }
.first-letter-color-blue::first-letter { color: #3b82f6; }
.text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-break-all  { word-break: break-all; }
.text-break-word { overflow-wrap: break-word; word-break: break-word; }
.text-hyphen     { hyphens: auto; }
.font-tabular-nums { font-variant-numeric: tabular-nums; }
.font-ordinal      { font-variant-numeric: ordinal; }
.font-slashed-zero { font-variant-numeric: slashed-zero; }
.font-feature-liga { font-feature-settings: "liga" 1; }
.font-smoothing    { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

/* ═══════════════════════════════════════════════════════════════════════════
   9. FLUID TYPOGRAPHY
═══════════════════════════════════════════════════════════════════════════ */
.text-fluid-xs   { font-size: clamp(11px, 1.5vw, 13px); }
.text-fluid-sm   { font-size: clamp(13px, 2vw, 16px); }
.text-fluid-md   { font-size: clamp(16px, 2.5vw, 20px); }
.text-fluid-lg   { font-size: clamp(20px, 3.5vw, 28px); }
.text-fluid-xl   { font-size: clamp(28px, 5vw, 40px); }
.text-fluid-2xl  { font-size: clamp(36px, 6vw, 56px); }
.text-fluid-hero { font-size: clamp(36px, 8vw, 80px); }
.text-fluid-display { font-size: clamp(48px, 10vw, 120px); }

/* ═══════════════════════════════════════════════════════════════════════════
   10. CURSOR UTILITIES (expanded)
═══════════════════════════════════════════════════════════════════════════ */
.cursor-default     { cursor: default; }
.cursor-pointer     { cursor: pointer; }
.cursor-text        { cursor: text; }
.cursor-grab        { cursor: grab; }
.cursor-grabbing    { cursor: grabbing; }
.cursor-crosshair   { cursor: crosshair; }
.cursor-zoom-in     { cursor: zoom-in; }
.cursor-zoom-out    { cursor: zoom-out; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-wait        { cursor: wait; }
.cursor-progress    { cursor: progress; }
.cursor-cell        { cursor: cell; }
.cursor-copy        { cursor: copy; }
.cursor-move        { cursor: move; }
.cursor-none        { cursor: none; }
.cursor-help        { cursor: help; }
.cursor-context-menu { cursor: context-menu; }
.cursor-alias       { cursor: alias; }
.cursor-resize-ns   { cursor: ns-resize; }
.cursor-resize-ew   { cursor: ew-resize; }
.cursor-resize-n    { cursor: n-resize; }
.cursor-resize-s    { cursor: s-resize; }
.cursor-resize-e    { cursor: e-resize; }
.cursor-resize-w    { cursor: w-resize; }
.cursor-resize-ne   { cursor: ne-resize; }
.cursor-resize-nw   { cursor: nw-resize; }
.cursor-resize-se   { cursor: se-resize; }
.cursor-resize-sw   { cursor: sw-resize; }
.cursor-col-resize  { cursor: col-resize; }
.cursor-row-resize  { cursor: row-resize; }

/* ═══════════════════════════════════════════════════════════════════════════
   11. POINTER & TOUCH UTILITIES (expanded)
═══════════════════════════════════════════════════════════════════════════ */
.touch-none          { touch-action: none; }
.touch-auto          { touch-action: auto; }
.touch-pan-x         { touch-action: pan-x; }
.touch-pan-y         { touch-action: pan-y; }
.touch-pan-left      { touch-action: pan-left; }
.touch-pan-right     { touch-action: pan-right; }
.touch-pan-up        { touch-action: pan-up; }
.touch-pan-down      { touch-action: pan-down; }
.touch-manipulation  { touch-action: manipulation; }
.touch-pinch-zoom    { touch-action: pinch-zoom; }
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }
.pointer-events-all  { pointer-events: all; }
.user-select-none    { user-select: none; -webkit-user-select: none; }
.user-select-all     { user-select: all; -webkit-user-select: all; }
.user-select-text    { user-select: text; -webkit-user-select: text; }
.user-select-auto    { user-select: auto; -webkit-user-select: auto; }
.will-change-transform  { will-change: transform; }
.will-change-opacity    { will-change: opacity; }
.will-change-scroll     { will-change: scroll-position; }
.will-change-auto       { will-change: auto; }

/* ═══════════════════════════════════════════════════════════════════════════
   12. CSS SUBGRID
═══════════════════════════════════════════════════════════════════════════ */
.grid-cols-subgrid   { grid-template-columns: subgrid; }
.grid-rows-subgrid   { grid-template-rows: subgrid; }
.span-col-subgrid-2  { grid-column: span 2; grid-template-columns: subgrid; }
.span-col-subgrid-3  { grid-column: span 3; grid-template-columns: subgrid; }
.span-col-subgrid-4  { grid-column: span 4; grid-template-columns: subgrid; }
.span-row-subgrid-2  { grid-row: span 2; grid-template-rows: subgrid; }
.span-row-subgrid-3  { grid-row: span 3; grid-template-rows: subgrid; }

/* ═══════════════════════════════════════════════════════════════════════════
   13. VIEW TRANSITIONS
═══════════════════════════════════════════════════════════════════════════ */
.view-transition-none   { view-transition-name: none; }
.view-transition-hero   { view-transition-name: hero; }
.view-transition-header { view-transition-name: header; }
.view-transition-image  { view-transition-name: image; }
.view-transition-card   { view-transition-name: card; }
@keyframes santy-vt-fade-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes santy-vt-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes santy-vt-slide-in  { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes santy-vt-slide-out { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-24px); opacity: 0; } }
@keyframes santy-vt-scale-in  { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes santy-vt-scale-out { from { transform: scale(1); opacity: 1; } to { transform: scale(1.08); opacity: 0; } }
::view-transition-old(root) { animation: santy-vt-fade-out 0.25s ease; }
::view-transition-new(root) { animation: santy-vt-fade-in  0.25s ease; }
.view-transition-fade  ::view-transition-old(root) { animation: santy-vt-fade-out 0.3s ease; }
.view-transition-fade  ::view-transition-new(root) { animation: santy-vt-fade-in  0.3s ease; }
.view-transition-slide ::view-transition-old(root) { animation: santy-vt-slide-out 0.35s ease; }
.view-transition-slide ::view-transition-new(root) { animation: santy-vt-slide-in  0.35s ease; }
.view-transition-scale ::view-transition-old(root) { animation: santy-vt-scale-out 0.3s ease; }
.view-transition-scale ::view-transition-new(root) { animation: santy-vt-scale-in  0.3s ease; }

/* ═══════════════════════════════════════════════════════════════════════════
   14. @LAYER UTILITIES
═══════════════════════════════════════════════════════════════════════════ */
@layer santy-base, santy-utilities, santy-components, santy-overrides;
@layer santy-base      { .layer-base      { all: revert; } }
@layer santy-utilities { .layer-utilities { } }
@layer santy-components { .layer-components { } }
@layer santy-overrides  { .layer-overrides  { } }

/* ═══════════════════════════════════════════════════════════════════════════
   15. SIZE UTILITIES (width + height combined)
═══════════════════════════════════════════════════════════════════════════ */
.set-size-4   { width: 4px;   height: 4px; }
.set-size-8   { width: 8px;   height: 8px; }
.set-size-12  { width: 12px;  height: 12px; }
.set-size-16  { width: 16px;  height: 16px; }
.set-size-20  { width: 20px;  height: 20px; }
.set-size-24  { width: 24px;  height: 24px; }
.set-size-28  { width: 28px;  height: 28px; }
.set-size-32  { width: 32px;  height: 32px; }
.set-size-36  { width: 36px;  height: 36px; }
.set-size-40  { width: 40px;  height: 40px; }
.set-size-44  { width: 44px;  height: 44px; }
.set-size-48  { width: 48px;  height: 48px; }
.set-size-56  { width: 56px;  height: 56px; }
.set-size-64  { width: 64px;  height: 64px; }
.set-size-72  { width: 72px;  height: 72px; }
.set-size-80  { width: 80px;  height: 80px; }
.set-size-96  { width: 96px;  height: 96px; }
.set-size-120 { width: 120px; height: 120px; }
.set-size-160 { width: 160px; height: 160px; }
.set-size-200 { width: 200px; height: 200px; }
.set-size-full   { width: 100%;  height: 100%; }
.set-size-screen { width: 100vw; height: 100vh; }
.set-size-fit    { width: fit-content; height: fit-content; }
.set-size-min    { width: min-content; height: min-content; }
.set-size-max    { width: max-content; height: max-content; }

/* ═══════════════════════════════════════════════════════════════════════════
   16. DYNAMIC VIEWPORT UNITS
═══════════════════════════════════════════════════════════════════════════ */
.set-height-dvh      { height: 100dvh; }
.set-height-svh      { height: 100svh; }
.set-height-lvh      { height: 100lvh; }
.set-min-height-dvh  { min-height: 100dvh; }
.set-min-height-svh  { min-height: 100svh; }
.set-min-height-lvh  { min-height: 100lvh; }
.set-max-height-dvh  { max-height: 100dvh; }
.set-width-dvw       { width: 100dvw; }
.set-width-svw       { width: 100svw; }
.set-width-lvw       { width: 100lvw; }
.h-dvh { height: 100dvh; }
.h-svh { height: 100svh; }
.h-50dvh { height: 50dvh; }
.h-75dvh { height: 75dvh; }

/* ═══════════════════════════════════════════════════════════════════════════
   17. COLOR MIX & OPACITY MODIFIERS
═══════════════════════════════════════════════════════════════════════════ */
.background-blue-500\\/10  { background-color: rgba(59,130,246,.10); }
.background-blue-500\\/20  { background-color: rgba(59,130,246,.20); }
.background-blue-500\\/30  { background-color: rgba(59,130,246,.30); }
.background-blue-500\\/50  { background-color: rgba(59,130,246,.50); }
.background-blue-500\\/75  { background-color: rgba(59,130,246,.75); }
.background-red-500\\/10   { background-color: rgba(239,68,68,.10); }
.background-red-500\\/20   { background-color: rgba(239,68,68,.20); }
.background-red-500\\/30   { background-color: rgba(239,68,68,.30); }
.background-red-500\\/50   { background-color: rgba(239,68,68,.50); }
.background-green-500\\/10 { background-color: rgba(34,197,94,.10); }
.background-green-500\\/20 { background-color: rgba(34,197,94,.20); }
.background-green-500\\/30 { background-color: rgba(34,197,94,.30); }
.background-green-500\\/50 { background-color: rgba(34,197,94,.50); }
.background-purple-500\\/10 { background-color: rgba(168,85,247,.10); }
.background-purple-500\\/20 { background-color: rgba(168,85,247,.20); }
.background-purple-500\\/30 { background-color: rgba(168,85,247,.30); }
.background-purple-500\\/50 { background-color: rgba(168,85,247,.50); }
.background-yellow-500\\/10 { background-color: rgba(234,179,8,.10); }
.background-yellow-500\\/20 { background-color: rgba(234,179,8,.20); }
.background-yellow-500\\/50 { background-color: rgba(234,179,8,.50); }
.background-white\\/10  { background-color: rgba(255,255,255,.10); }
.background-white\\/20  { background-color: rgba(255,255,255,.20); }
.background-white\\/30  { background-color: rgba(255,255,255,.30); }
.background-white\\/50  { background-color: rgba(255,255,255,.50); }
.background-white\\/75  { background-color: rgba(255,255,255,.75); }
.background-black\\/10  { background-color: rgba(0,0,0,.10); }
.background-black\\/20  { background-color: rgba(0,0,0,.20); }
.background-black\\/30  { background-color: rgba(0,0,0,.30); }
.background-black\\/50  { background-color: rgba(0,0,0,.50); }
.background-black\\/75  { background-color: rgba(0,0,0,.75); }
.color-blue-500\\/75   { color: rgba(59,130,246,.75); }
.color-red-600\\/75    { color: rgba(220,38,38,.75); }
.color-gray-900\\/75   { color: rgba(17,24,39,.75); }
.background-mix-blue-red-50    { background-color: color-mix(in srgb, #3b82f6 50%, #ef4444); }
.background-mix-blue-green-50  { background-color: color-mix(in srgb, #3b82f6 50%, #22c55e); }
.background-mix-purple-pink-50 { background-color: color-mix(in srgb, #8b5cf6 50%, #ec4899); }

/* ═══════════════════════════════════════════════════════════════════════════
   18. ISOLATION & SEMANTIC Z-INDEX
═══════════════════════════════════════════════════════════════════════════ */
.isolate       { isolation: isolate; }
.isolation-auto { isolation: auto; }
.z-base        { z-index: 0; }
.z-raised      { z-index: 10; }
.z-dropdown    { z-index: 100; }
.z-sticky      { z-index: 200; }
.z-overlay     { z-index: 300; }
.z-modal       { z-index: 400; }
.z-popover     { z-index: 500; }
.z-tooltip     { z-index: 600; }
.z-toast       { z-index: 700; }
.z-top         { z-index: 9999; }
.z-negative    { z-index: -1; }

/* ═══════════════════════════════════════════════════════════════════════════
   19. PRINT UTILITIES (expanded)
═══════════════════════════════════════════════════════════════════════════ */
@media print {
  .print-hidden              { display: none !important; }
  .print-only                { display: block !important; }
  .print-only-flex           { display: flex !important; }
  .print-full-width          { width: 100% !important; max-width: 100% !important; }
  .print-no-shadow           { box-shadow: none !important; }
  .print-no-border           { border: none !important; }
  .print-black-white         { filter: grayscale(100%); }
  .print-break-before        { break-before: page; }
  .print-break-after         { break-after: page; }
  .print-break-inside-avoid  { break-inside: avoid; }
  .print-break-inside-auto   { break-inside: auto; }
  .print-text-black          { color: #000 !important; }
  .print-background-white    { background: #fff !important; }
  .print-show-links a::after { content: " (" attr(href) ")"; font-size: 11px; color: #666; }
}
.print-hidden { }
.print-only   { }

/* ═══════════════════════════════════════════════════════════════════════════
   20. MATH & CALCULATION UTILITIES
═══════════════════════════════════════════════════════════════════════════ */
.set-width-calc-100-minus-16  { width: calc(100% - 16px); }
.set-width-calc-100-minus-24  { width: calc(100% - 24px); }
.set-width-calc-100-minus-32  { width: calc(100% - 32px); }
.set-width-calc-100-minus-48  { width: calc(100% - 48px); }
.set-width-calc-100-minus-64  { width: calc(100% - 64px); }
.set-width-calc-100-minus-80  { width: calc(100% - 80px); }
.set-width-calc-100-minus-256 { width: calc(100% - 256px); }
.set-width-calc-100-minus-320 { width: calc(100% - 320px); }
.set-width-half               { width: calc(50% - 8px); }
.set-width-third              { width: calc(33.333% - 11px); }
.set-width-quarter            { width: calc(25% - 12px); }
.set-height-calc-screen-minus-48  { height: calc(100vh - 48px); }
.set-height-calc-screen-minus-64  { height: calc(100vh - 64px); }
.set-height-calc-screen-minus-80  { height: calc(100vh - 80px); }
.set-height-calc-screen-minus-96  { height: calc(100vh - 96px); }
.set-height-calc-dvh-minus-64  { height: calc(100dvh - 64px); }
.set-height-calc-dvh-minus-80  { height: calc(100dvh - 80px); }
.set-min-height-calc-screen-minus-80 { min-height: calc(100vh - 80px); }
.set-max-width-readable   { max-width: 65ch; }
.set-max-width-prose      { max-width: 72ch; }
.set-max-width-narrow     { max-width: 45ch; }
`);

// ─── UTILITY GAPS v1.6 ───────────────────────────────────────────────────────
add(`
/* ── Variable Font Weights ── */
.font-variable          { font-variation-settings: normal; }
.font-condensed         { font-stretch: condensed;  font-variation-settings: 'wdth' 75; }
.font-expanded          { font-stretch: expanded;   font-variation-settings: 'wdth' 125; }
.font-italic-variable   { font-style: italic; font-variation-settings: 'ital' 1; }
.set-font-weight-100 { font-weight: 100; font-variation-settings: 'wght' 100; }
.set-font-weight-200 { font-weight: 200; font-variation-settings: 'wght' 200; }
.set-font-weight-300 { font-weight: 300; font-variation-settings: 'wght' 300; }
.set-font-weight-400 { font-weight: 400; font-variation-settings: 'wght' 400; }
.set-font-weight-450 { font-weight: 450; font-variation-settings: 'wght' 450; }
.set-font-weight-500 { font-weight: 500; font-variation-settings: 'wght' 500; }
.set-font-weight-550 { font-weight: 550; font-variation-settings: 'wght' 550; }
.set-font-weight-600 { font-weight: 600; font-variation-settings: 'wght' 600; }
.set-font-weight-700 { font-weight: 700; font-variation-settings: 'wght' 700; }
.set-font-weight-800 { font-weight: 800; font-variation-settings: 'wght' 800; }
.set-font-weight-900 { font-weight: 900; font-variation-settings: 'wght' 900; }

/* ── Negative Z-index (layer behind parent) ── */
.z-minus-1  { z-index: -1; }
.z-minus-2  { z-index: -2; }
.z-minus-3  { z-index: -3; }
.z-minus-5  { z-index: -5; }
.z-minus-10 { z-index: -10; }

/* ── Fractional Widths — fifths & sixths ── */
.set-width-1-of-5 { width: 20%; }
.set-width-2-of-5 { width: 40%; }
.set-width-3-of-5 { width: 60%; }
.set-width-4-of-5 { width: 80%; }
.set-width-1-of-6 { width: 16.6667%; }
.set-width-2-of-6 { width: 33.3333%; }
.set-width-3-of-6 { width: 50%; }
.set-width-4-of-6 { width: 66.6667%; }
.set-width-5-of-6 { width: 83.3333%; }
`);

// Caret colors — full shade scale
add(`\n/* ── Caret Colors (full shade scale) ── */`);
Object.entries(palette).forEach(([name, shades]) => {
  Object.entries(shades).forEach(([shade, hex]) => {
    add(`.caret-${name}-${shade} { caret-color: ${hex}; }`);
  });
});

// Color-mix tints & shades using color-mix()
add(`\n/* ── Color-Mix Tints & Shades — background, text, border ── */`);
const tintLevels  = [10, 20, 30, 40, 50, 60, 70];
const shadeLevels = [10, 20, 30];
Object.entries(palette).forEach(([name, shades]) => {
  const base = shades[500];
  tintLevels.forEach(pct => {
    add(`.background-${name}-tint-${pct} { background-color: color-mix(in srgb, ${base} ${pct}%, #ffffff); }`);
    add(`.color-${name}-tint-${pct}      { color: color-mix(in srgb, ${base} ${pct}%, #ffffff); }`);
  });
  shadeLevels.forEach(pct => {
    const keep = 100 - pct * 10;
    add(`.background-${name}-shade-${pct}0 { background-color: color-mix(in srgb, ${base} ${keep}%, #000000); }`);
    add(`.color-${name}-shade-${pct}0      { color: color-mix(in srgb, ${base} ${keep}%, #000000); }`);
  });
  add(`.border-${name}-tint-20 { border-color: color-mix(in srgb, ${base} 20%, #ffffff); }`);
  add(`.border-${name}-tint-40 { border-color: color-mix(in srgb, ${base} 40%, #ffffff); }`);
  add(`.border-${name}-shade-10 { border-color: color-mix(in srgb, ${base} 90%, #000000); }`);
});

// ─── NEW FEATURES v1.7 ───────────────────────────────────────────────────────
add(`
/* ═══════════════════════════════════════════════════════════════════════════
   v1.7 — ACCESSIBILITY UTILITIES
═══════════════════════════════════════════════════════════════════════════ */

/* ── Skip to content (keyboard / screen-reader nav) ── */
.skip-to-content {
  position: absolute;
  top: -100%;
  left: 8px;
  z-index: 9999;
  padding: 8px 16px;
  background-color: #1e40af;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 0 0 6px 6px;
  text-decoration: none;
  transition: top 0.15s;
}
.skip-to-content:focus { top: 0; outline: 3px solid #fbbf24; outline-offset: 2px; }

/* ── Focus ring utilities ── */
.focus-ring          { outline: 2px solid #3b82f6; outline-offset: 2px; }
.focus-ring-white    { outline: 2px solid #fff;    outline-offset: 2px; }
.focus-ring-red      { outline: 2px solid #ef4444; outline-offset: 2px; }
.focus-ring-none     { outline: none; }
.focus-visible-ring:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
.focus-visible-ring:focus:not(:focus-visible) { outline: none; }

/* ── Focus trap container ── */
.focus-trap        { position: relative; }
.focus-trap-active { overflow: hidden; }

/* ── ARIA live regions (read by screen readers) ── */
.aria-live-polite,
.aria-live-assertive {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
}

/* ── Screen-reader only ── */
.screen-reader-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
.screen-reader-only:focus { position: static; width: auto; height: auto; clip: auto; white-space: normal; }

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .motion-safe-animate { animation: none !important; transition: none !important; }
}

/* ── High contrast support ── */
@media (forced-colors: active) {
  .high-contrast-border  { border: 2px solid ButtonText !important; }
  .high-contrast-outline { outline: 2px solid Highlight !important; }
  .high-contrast-bg      { background-color: ButtonFace !important; color: ButtonText !important; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   v1.7 — INTERNATIONALISATION (I18N) UTILITIES
═══════════════════════════════════════════════════════════════════════════ */

/* ── Logical properties (direction-aware layout) ── */
.add-padding-block-4   { padding-block: 4px; }
.add-padding-block-8   { padding-block: 8px; }
.add-padding-block-12  { padding-block: 12px; }
.add-padding-block-16  { padding-block: 16px; }
.add-padding-block-20  { padding-block: 20px; }
.add-padding-block-24  { padding-block: 24px; }
.add-padding-block-32  { padding-block: 32px; }
.add-padding-inline-4  { padding-inline: 4px; }
.add-padding-inline-8  { padding-inline: 8px; }
.add-padding-inline-12 { padding-inline: 12px; }
.add-padding-inline-16 { padding-inline: 16px; }
.add-padding-inline-20 { padding-inline: 20px; }
.add-padding-inline-24 { padding-inline: 24px; }
.add-padding-inline-32 { padding-inline: 32px; }
.add-margin-block-4    { margin-block: 4px; }
.add-margin-block-8    { margin-block: 8px; }
.add-margin-block-16   { margin-block: 16px; }
.add-margin-block-24   { margin-block: 24px; }
.add-margin-inline-4   { margin-inline: 4px; }
.add-margin-inline-8   { margin-inline: 8px; }
.add-margin-inline-16  { margin-inline: 16px; }
.add-margin-inline-24  { margin-inline: 24px; }
.pin-block-start-0     { inset-block-start: 0; }
.pin-block-end-0       { inset-block-end: 0; }
.pin-inline-start-0    { inset-inline-start: 0; }
.pin-inline-end-0      { inset-inline-end: 0; }
.set-width-logical     { inline-size: 100%; }
.set-height-logical    { block-size: 100%; }
.border-block-start    { border-block-start: 1px solid #e5e7eb; }
.border-block-end      { border-block-end: 1px solid #e5e7eb; }
.border-inline-start   { border-inline-start: 1px solid #e5e7eb; }
.border-inline-end     { border-inline-end: 1px solid #e5e7eb; }

/* ── Writing modes (CJK / vertical text) ── */
.make-text-vertical      { writing-mode: vertical-rl; text-orientation: mixed; }
.make-text-vertical-up   { writing-mode: vertical-lr; text-orientation: mixed; }
.make-text-horizontal    { writing-mode: horizontal-tb; }
.text-orientation-mixed    { text-orientation: mixed; }
.text-orientation-upright  { text-orientation: upright; }
.text-orientation-sideways { text-orientation: sideways; }

/* ── Text direction ── */
.text-direction-ltr { direction: ltr; }
.text-direction-rtl { direction: rtl; }

/* ═══════════════════════════════════════════════════════════════════════════
   v1.7 — MOBILE-FIRST COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

/* ── Safe area insets (notch / home bar) ── */
.padding-safe-top    { padding-top:    env(safe-area-inset-top, 0px); }
.padding-safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
.padding-safe-left   { padding-left:   env(safe-area-inset-left, 0px); }
.padding-safe-right  { padding-right:  env(safe-area-inset-right, 0px); }
.padding-safe-all    { padding: env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px); }
.margin-safe-bottom  { margin-bottom:  env(safe-area-inset-bottom, 0px); }
.pin-bottom-safe     { bottom:         env(safe-area-inset-bottom, 0px); }

/* ── Bottom sheet ── */
.bottom-sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 24px rgba(0,0,0,.12);
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 500;
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
.bottom-sheet.open          { transform: translateY(0); }
.bottom-sheet-handle {
  width: 36px; height: 4px;
  background-color: #d1d5db;
  border-radius: 9999px;
  margin: 12px auto 8px;
}
.bottom-sheet-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 20px 12px;
  border-bottom: 1px solid #f3f4f6;
}
.bottom-sheet-title  { font-size: 16px; font-weight: 600; color: #111827; }
.bottom-sheet-body   { padding: 16px 20px; overflow-y: auto; max-height: 70vh; }
.bottom-sheet-footer { padding: 12px 20px; border-top: 1px solid #f3f4f6; }
.bottom-sheet-overlay {
  position: fixed; inset: 0;
  background-color: rgba(0,0,0,0);
  z-index: 499;
  pointer-events: none;
  transition: background-color 0.3s;
}
.bottom-sheet-overlay.visible {
  background-color: rgba(0,0,0,0.45);
  pointer-events: auto;
}

/* ── Swipeable carousel ── */
.swipe-carousel {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  gap: 12px;
  padding-bottom: 4px;
}
.swipe-carousel::-webkit-scrollbar { display: none; }
.swipe-carousel-item {
  flex-shrink: 0;
  scroll-snap-align: start;
  border-radius: 12px;
  overflow: hidden;
}
.swipe-carousel-full  .swipe-carousel-item { width: 100%; }
.swipe-carousel-peek  .swipe-carousel-item { width: calc(100% - 32px); }
.swipe-carousel-multi .swipe-carousel-item { width: calc(50% - 6px); }
.swipe-carousel-dots  { display: flex; gap: 6px; justify-content: center; padding-top: 10px; }
.swipe-carousel-dot   { width: 6px; height: 6px; border-radius: 50%; background-color: #d1d5db; transition: background-color 0.2s, width 0.2s; }
.swipe-carousel-dot.active { background-color: #3b82f6; width: 18px; border-radius: 3px; }

/* ── Pull-to-refresh indicator ── */
.pull-to-refresh {
  display: flex; align-items: center; justify-content: center;
  height: 0; overflow: hidden;
  transition: height 0.2s;
  font-size: 13px; color: #6b7280; gap: 8px;
}
.pull-to-refresh.pulling,
.pull-to-refresh.refreshing { height: 48px; }
.pull-to-refresh-spinner {
  width: 18px; height: 18px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
}
.pull-to-refresh.refreshing .pull-to-refresh-spinner { animation: santy-spin 0.7s linear infinite; }

/* ═══════════════════════════════════════════════════════════════════════════
   v1.7 — COMMAND PALETTE
═══════════════════════════════════════════════════════════════════════════ */
.command-palette-wrap {
  position: fixed; inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: none;
  align-items: flex-start; justify-content: center;
  padding-top: 80px;
  z-index: 900;
}
.command-palette-wrap.open { display: flex; }
.command-palette {
  width: 100%; max-width: 560px;
  background-color: #fff;
  border-radius: 14px;
  box-shadow: 0 24px 48px rgba(0,0,0,.22);
  overflow: hidden;
}
.command-palette-input-row {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
}
.command-palette-icon  { color: #9ca3af; flex-shrink: 0; }
.command-palette-input {
  flex: 1; border: none; outline: none;
  font-size: 16px; color: #111827; background: transparent;
}
.command-palette-input::placeholder { color: #9ca3af; }
.command-palette-kbd {
  font-size: 11px; color: #6b7280;
  background-color: #f3f4f6; border: 1px solid #d1d5db;
  border-radius: 4px; padding: 2px 6px; font-family: inherit;
}
.command-palette-list  { max-height: 360px; overflow-y: auto; padding: 8px; }
.command-palette-group-label {
  font-size: 11px; font-weight: 600; color: #6b7280;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 8px 10px 4px;
}
.command-palette-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px; border-radius: 8px;
  cursor: pointer; font-size: 14px; color: #111827;
  transition: background-color 0.1s;
}
.command-palette-item:hover,
.command-palette-item.selected { background-color: #eff6ff; color: #1d4ed8; }
.command-palette-item-icon {
  width: 28px; height: 28px; border-radius: 6px;
  background-color: #f3f4f6;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.command-palette-item-label    { flex: 1; }
.command-palette-item-shortcut { font-size: 12px; color: #9ca3af; }
.command-palette-empty { text-align: center; padding: 32px 16px; color: #9ca3af; font-size: 14px; }
.command-palette-footer {
  display: flex; gap: 12px; align-items: center;
  padding: 10px 16px; border-top: 1px solid #f3f4f6;
  font-size: 12px; color: #9ca3af;
}

/* ═══════════════════════════════════════════════════════════════════════════
   v1.7 — DATE PICKER / CALENDAR
═══════════════════════════════════════════════════════════════════════════ */
.date-picker {
  display: inline-block;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,.1);
  padding: 16px;
  user-select: none;
  width: 280px;
}
.date-picker-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.date-picker-month-year { font-size: 15px; font-weight: 600; color: #111827; }
.date-picker-nav {
  width: 28px; height: 28px;
  border: none; background: transparent;
  border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #6b7280; font-size: 14px;
  transition: background-color 0.15s;
}
.date-picker-nav:hover      { background-color: #f3f4f6; }
.date-picker-weekdays {
  display: grid; grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 11px; font-weight: 600; color: #6b7280;
  text-transform: uppercase; letter-spacing: 0.04em;
  margin-bottom: 6px;
}
.date-picker-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.date-picker-day {
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: #374151;
  border-radius: 6px; cursor: pointer;
  transition: background-color 0.12s, color 0.12s;
}
.date-picker-day:hover       { background-color: #eff6ff; color: #1d4ed8; }
.date-picker-day.today       { font-weight: 700; color: #2563eb; }
.date-picker-day.selected    { background-color: #2563eb; color: #fff; }
.date-picker-day.selected:hover { background-color: #1d4ed8; }
.date-picker-day.in-range    { background-color: #dbeafe; color: #1d4ed8; border-radius: 0; }
.date-picker-day.range-start { border-radius: 6px 0 0 6px; background-color: #2563eb; color: #fff; }
.date-picker-day.range-end   { border-radius: 0 6px 6px 0; background-color: #2563eb; color: #fff; }
.date-picker-day.other-month { color: #d1d5db; }
.date-picker-day.disabled    { color: #e5e7eb; cursor: not-allowed; pointer-events: none; }
.date-picker-footer {
  display: flex; gap: 8px; justify-content: flex-end;
  margin-top: 12px; padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

/* ═══════════════════════════════════════════════════════════════════════════
   v1.7 — CUSTOM PROPERTY SHORTHAND TOKENS
═══════════════════════════════════════════════════════════════════════════ */
.use-custom-spacing { gap: var(--sc-gap, 16px); padding: var(--sc-padding, 16px); }
.use-custom-radius  { border-radius: var(--sc-radius, 8px); }
.use-custom-color   { color: var(--sc-color, inherit); background-color: var(--sc-bg, transparent); }
.use-custom-size    { width: var(--sc-width, auto); height: var(--sc-height, auto); }
.use-custom-font    { font-size: var(--sc-font-size, 1rem); font-weight: var(--sc-font-weight, 400); }
[data-story]         { display: block; padding: 24px; }
[data-story-bg="white"] { background-color: #fff; }
[data-story-bg="gray"]  { background-color: #f9fafb; }
[data-story-bg="dark"]  { background-color: #111827; }

/* ═══════════════════════════════════════════════════════════════════════════
   v1.9 — SCROLL, SCROLLBAR, GLASS & NEW ANIMATIONS
═══════════════════════════════════════════════════════════════════════════ */
.scroll-smooth { scroll-behavior: smooth; }
.scroll-auto   { scroll-behavior: auto; }
.scrollbar-thin::-webkit-scrollbar { width:4px; height:4px; }
.scrollbar-thin::-webkit-scrollbar-track { background:transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:4px; }
.scrollbar-thin { scrollbar-width:thin; scrollbar-color:#d1d5db transparent; }
.scrollbar-dark::-webkit-scrollbar { width:4px; height:4px; }
.scrollbar-dark::-webkit-scrollbar-track { background:#09090b; }
.scrollbar-dark::-webkit-scrollbar-thumb { background:#3f3f46; border-radius:4px; }
.scrollbar-dark { scrollbar-width:thin; scrollbar-color:#3f3f46 #09090b; }
.scrollbar-hidden { -ms-overflow-style:none; scrollbar-width:none; }
.scrollbar-hidden::-webkit-scrollbar { display:none; }
.glass       { background:rgba(255,255,255,0.1); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1px solid rgba(255,255,255,0.15); }
.glass-dark  { background:rgba(9,9,11,0.85); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1px solid rgba(255,255,255,0.08); }
.glass-light { background:rgba(255,255,255,0.7); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1px solid rgba(255,255,255,0.5); }
.gradient-radial        { background:radial-gradient(circle, var(--grad-from,#6366f1) 0%, var(--grad-to,transparent) 70%); }
.gradient-radial-top    { background:radial-gradient(ellipse at top, var(--grad-from,#6366f1) 0%, var(--grad-to,transparent) 70%); }
.gradient-radial-bottom { background:radial-gradient(ellipse at bottom, var(--grad-from,#6366f1) 0%, var(--grad-to,transparent) 70%); }
.gradient-radial-tl     { background:radial-gradient(ellipse at top left, var(--grad-from,#6366f1) 0%, var(--grad-to,transparent) 70%); }
.gradient-radial-tr     { background:radial-gradient(ellipse at top right, var(--grad-from,#6366f1) 0%, var(--grad-to,transparent) 70%); }
.gradient-radial-bl     { background:radial-gradient(ellipse at bottom left, var(--grad-from,#6366f1) 0%, var(--grad-to,transparent) 70%); }
.gradient-radial-br     { background:radial-gradient(ellipse at bottom right, var(--grad-from,#6366f1) 0%, var(--grad-to,transparent) 70%); }
@keyframes santy-spin-ccw  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
.animate-spin-slow      { animation:santy-spin     3s   linear infinite; }
.animate-spin-fast      { animation:santy-spin     0.4s linear infinite; }
.animate-spin-cw        { animation:santy-spin     1s   linear infinite; }
.animate-spin-ccw       { animation:santy-spin-ccw 1s   linear infinite; }
.animate-spin-slow-cw   { animation:santy-spin     3s   linear infinite; }
.animate-spin-slow-ccw  { animation:santy-spin-ccw 3s   linear infinite; }
.animate-spin-xslow-cw  { animation:santy-spin     8s   linear infinite; }
.animate-spin-xslow-ccw { animation:santy-spin-ccw 8s   linear infinite; }
@keyframes santy-pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
.animate-pulse-dot { animation:santy-pulse-dot 2s ease-in-out infinite; }
.skill-bar-animated { transition:width 1.2s cubic-bezier(.4,0,.2,1); }
`);

// Write all output files
fs.writeFileSync('santy.css', fullCSS);
fs.writeFileSync('santy-core.css', utilCSS);
fs.writeFileSync('santy-components.css', compCSS);
fs.writeFileSync('santy-animations.css', animCSS);
fs.writeFileSync('santy-email.css', EMAIL_CSS.trim());

// Mirror to dist/ for NPM package
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'santy.css'), fullCSS);
fs.writeFileSync(path.join(distDir, 'santy-core.css'), utilCSS);
fs.writeFileSync(path.join(distDir, 'santy-components.css'), compCSS);
fs.writeFileSync(path.join(distDir, 'santy-animations.css'), animCSS);
fs.writeFileSync(path.join(distDir, 'santy-email.css'), EMAIL_CSS.trim());

// Generate minified version
const minCSS = fullCSS
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s*\{\s*/g, '{')
  .replace(/\s*\}\s*/g, '}')
  .replace(/\s*:\s*/g, ':')
  .replace(/\s*;\s*/g, ';')
  .replace(/\s*,\s*/g, ',')
  .replace(/\n+/g, '')
  .replace(/\s{2,}/g, ' ')
  .trim();
fs.writeFileSync('santy.min.css', minCSS);
fs.writeFileSync(path.join(distDir, 'santy.min.css'), minCSS);

const kb = n => (n / 1024).toFixed(1) + 'KB';
console.log(`✅ santy.css          — ${kb(fullCSS.length)} (${fullCSS.split('\n').length.toLocaleString()} lines)`);
console.log(`✅ santy.min.css      — ${kb(minCSS.length)} (minified)`);
console.log(`✅ santy-core.css     — ${kb(utilCSS.length)} (utilities only)`);
console.log(`✅ santy-components.css — ${kb(compCSS.length)} (components only)`);
console.log(`✅ santy-animations.css — ${kb(animCSS.length)} (animations only)`);
console.log(`✅ santy-email.css    — ${kb(EMAIL_CSS.length)} (email templates)`);
console.log(`✅ dist/              — mirrored for NPM package`);
