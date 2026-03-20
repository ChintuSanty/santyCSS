/**
 * SantyCSS Inspector — Figma Plugin Backend
 * Inspects the selected Figma node and maps its properties
 * to the closest SantyCSS utility classes.
 */

figma.showUI(__html__, { width: 380, height: 600, themeColors: true });

// ─── COLOR PALETTE (mirrors build.js) ────────────────────────────────────────
const PALETTE = {
  red:    { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d' },
  orange: { 50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12' },
  amber:  { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f' },
  yellow: { 50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207',800:'#854d0e',900:'#713f12' },
  lime:   { 50:'#f7fee7',100:'#ecfccb',200:'#d9f99d',300:'#bef264',400:'#a3e635',500:'#84cc16',600:'#65a30d',700:'#4d7c0f',800:'#3f6212',900:'#365314' },
  green:  { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d' },
  teal:   { 50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a' },
  cyan:   { 50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4',600:'#0891b2',700:'#0e7490',800:'#155e75',900:'#164e63' },
  blue:   { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
  indigo: { 50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81' },
  violet: { 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95' },
  purple: { 50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87' },
  pink:   { 50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843' },
  rose:   { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337' },
  slate:  { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a' },
  gray:   { 50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827' },
  zinc:   { 50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',500:'#71717a',600:'#52525b',700:'#3f3f46',800:'#27272a',900:'#18181b' },
  stone:  { 50:'#fafaf9',100:'#f5f5f4',200:'#e7e5e4',300:'#d6d3d1',400:'#a8a29e',500:'#78716c',600:'#57534e',700:'#44403c',800:'#292524',900:'#1c1917' },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  return { r, g, b };
}

function colorDistance(r1,g1,b1, r2,g2,b2) {
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

function closestPaletteColor(r, g, b) {
  let bestName='gray', bestShade='500', bestDist=Infinity;
  for (const [name, shades] of Object.entries(PALETTE)) {
    for (const [shade, hex] of Object.entries(shades)) {
      const c = hexToRgb(hex);
      const d = colorDistance(r,g,b, c.r,c.g,c.b);
      if (d < bestDist) { bestDist=d; bestName=name; bestShade=shade; }
    }
  }
  // if very close to white
  if (colorDistance(r,g,b,1,1,1) < 0.05) return { name:'white', shade:'', dist:bestDist };
  // if very close to black
  if (colorDistance(r,g,b,0,0,0) < 0.05) return { name:'black', shade:'', dist:bestDist };
  return { name:bestName, shade:bestShade, dist:bestDist };
}

function snapToSpacing(n) {
  const steps = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,32,36,40,44,48,52,56,60,64,72,80,96,112,128,160,192,200,256,320,384,448,512];
  return steps.reduce((a,b) => Math.abs(b-n)<Math.abs(a-n) ? b : a);
}

function fontWeightClass(w) {
  if (w >= 900) return 'text-black';
  if (w >= 800) return 'text-extrabold';
  if (w >= 700) return 'text-bold';
  if (w >= 600) return 'text-semibold';
  if (w >= 500) return 'text-medium';
  if (w >= 300) return 'text-light';
  if (w >= 200) return 'text-extralight';
  return 'text-thin';
}

function shadowClass(effects) {
  const shadows = effects.filter(e => e.type === 'DROP_SHADOW' && e.visible !== false);
  if (!shadows.length) return null;
  const s = shadows[0];
  const blur = s.radius || 0;
  if (blur <= 4)  return 'add-shadow-sm';
  if (blur <= 10) return 'add-shadow-md';
  if (blur <= 20) return 'add-shadow-lg';
  if (blur <= 30) return 'add-shadow-xl';
  return 'add-shadow-2xl';
}

function opacityClass(opacity) {
  const pct = Math.round(opacity * 100);
  const snapped = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100]
    .reduce((a,b) => Math.abs(b-pct)<Math.abs(a-pct) ? b : a);
  if (snapped === 100) return null;
  return `opacity-${snapped}`;
}

// ─── MAIN ANALYSIS ────────────────────────────────────────────────────────────

function analyzeNode(node) {
  const groups = {
    layout:     [],
    spacing:    [],
    size:       [],
    typography: [],
    color:      [],
    border:     [],
    effects:    [],
    misc:       [],
  };

  const type = node.type;

  // ── Layout (Frames with auto-layout) ──
  if ('layoutMode' in node) {
    if (node.layoutMode === 'HORIZONTAL') {
      groups.layout.push({ cls: 'make-flex', desc: 'Horizontal flex container' });
      groups.layout.push({ cls: 'flex-row', desc: 'Row direction' });
    } else if (node.layoutMode === 'VERTICAL') {
      groups.layout.push({ cls: 'make-flex', desc: 'Vertical flex container' });
      groups.layout.push({ cls: 'flex-column', desc: 'Column direction' });
    }

    if (node.layoutMode !== 'NONE') {
      // Alignment
      const justify = node.primaryAxisAlignItems;
      const align   = node.counterAxisAlignItems;

      if (justify === 'CENTER') groups.layout.push({ cls: 'justify-center', desc: 'Center main axis' });
      else if (justify === 'MAX') groups.layout.push({ cls: 'justify-end', desc: 'Align to end' });
      else if (justify === 'SPACE_BETWEEN') groups.layout.push({ cls: 'justify-between', desc: 'Space between' });

      if (align === 'CENTER') groups.layout.push({ cls: 'align-center', desc: 'Center cross axis' });
      else if (align === 'MAX') groups.layout.push({ cls: 'align-end', desc: 'Align cross end' });
      else if (align === 'BASELINE') groups.layout.push({ cls: 'align-baseline', desc: 'Baseline alignment' });

      // Wrap
      if (node.layoutWrap === 'WRAP') groups.layout.push({ cls: 'flex-wrap', desc: 'Flex wrap' });

      // Gap
      if (node.itemSpacing && node.itemSpacing > 0) {
        const g = snapToSpacing(node.itemSpacing);
        groups.spacing.push({ cls: `gap-${g}`, desc: `Gap ${g}px` });
      }
    }
  }

  // ── Padding ──
  if ('paddingLeft' in node && node.layoutMode !== 'NONE') {
    const pl = snapToSpacing(node.paddingLeft  || 0);
    const pr = snapToSpacing(node.paddingRight || 0);
    const pt = snapToSpacing(node.paddingTop   || 0);
    const pb = snapToSpacing(node.paddingBottom|| 0);

    if (pl===pr && pt===pb && pl===pt) {
      if (pl > 0) groups.spacing.push({ cls: `add-padding-${pl}`, desc: `Padding all sides ${pl}px` });
    } else if (pl===pr && pt===pb) {
      if (pl > 0) groups.spacing.push({ cls: `add-padding-x-${pl}`, desc: `Horizontal padding ${pl}px` });
      if (pt > 0) groups.spacing.push({ cls: `add-padding-y-${pt}`, desc: `Vertical padding ${pt}px` });
    } else {
      if (pt > 0) groups.spacing.push({ cls: `add-padding-top-${pt}`, desc: `Padding top ${pt}px` });
      if (pr > 0) groups.spacing.push({ cls: `add-padding-right-${pr}`, desc: `Padding right ${pr}px` });
      if (pb > 0) groups.spacing.push({ cls: `add-padding-bottom-${pb}`, desc: `Padding bottom ${pb}px` });
      if (pl > 0) groups.spacing.push({ cls: `add-padding-left-${pl}`, desc: `Padding left ${pl}px` });
    }
  }

  // ── Size ──
  if ('width' in node && 'height' in node) {
    const w = Math.round(node.width);
    const h = Math.round(node.height);

    const wMode = node.layoutSizingHorizontal || '';
    const hMode = node.layoutSizingVertical   || '';

    if (wMode === 'FILL') groups.size.push({ cls: 'set-width-full', desc: 'Width 100%' });
    else if (wMode === 'HUG') groups.size.push({ cls: 'set-width-fit', desc: 'Width fit-content' });
    else {
      const snap = snapToSpacing(w);
      groups.size.push({ cls: `set-width-${snap}`, desc: `Width ≈${w}px` });
    }

    if (hMode === 'FILL') groups.size.push({ cls: 'set-height-full', desc: 'Height 100%' });
    else if (hMode === 'HUG') groups.size.push({ cls: 'set-height-fit', desc: 'Height fit-content' });
    else {
      const snap = snapToSpacing(h);
      if (snap > 0) groups.size.push({ cls: `set-height-${snap}`, desc: `Height ≈${h}px` });
    }
  }

  // ── Border radius ──
  if ('cornerRadius' in node && node.cornerRadius !== figma.mixed) {
    const r = Math.round(node.cornerRadius);
    if (r >= 9999) groups.border.push({ cls: 'make-pill', desc: 'Full border radius' });
    else if (r > 0) groups.border.push({ cls: `round-corners-${snapToSpacing(r)}`, desc: `Border radius ${r}px` });
  }

  // ── Strokes (border) ──
  if ('strokes' in node && node.strokes && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    const sw = Math.round(node.strokeWeight || 1);
    groups.border.push({ cls: `add-border-${sw}`, desc: `Border ${sw}px` });

    if (stroke.type === 'SOLID') {
      const { r,g,b } = stroke.color;
      const match = closestPaletteColor(r,g,b);
      const shade = match.shade ? `-${match.shade}` : '';
      groups.border.push({ cls: `border-color-${match.name}${shade}`, desc: `Border color` });
    }
  }

  // ── Background fills ──
  if ('fills' in node && node.fills && node.fills !== figma.mixed && node.fills.length > 0) {
    const fill = node.fills.find(f => f.visible !== false);
    if (fill && fill.type === 'SOLID') {
      const { r,g,b } = fill.color;
      const a = fill.opacity !== undefined ? fill.opacity : 1;
      const match = closestPaletteColor(r,g,b);
      const shade = match.shade ? `-${match.shade}` : '';
      const prefix = type === 'TEXT' ? 'color' : 'background';
      const cls = `${prefix}-${match.name}${shade}`;
      if (a < 0.95) {
        const pct = Math.round(a*100/25)*25 || 10;
        groups.color.push({ cls: `${cls}/${pct}`, desc: `${type==='TEXT'?'Text':'Background'} color at ${pct}% opacity` });
      } else {
        groups.color.push({ cls, desc: `${type==='TEXT'?'Text':'Background'} color` });
      }
    } else if (fill && fill.type === 'GRADIENT_LINEAR') {
      groups.color.push({ cls: '/* linear gradient — no direct SantyCSS class */', desc: 'Gradient fill', note: true });
    }
  }

  // ── Text-specific properties ──
  if (type === 'TEXT') {
    const fs = Math.round(node.fontSize);
    const fontSizes = [8,9,10,11,12,13,14,15,16,17,18,19,20,22,24,26,28,30,32,36,40,44,48,52,56,60,64,72,80,96,120,144];
    const snapFs = fontSizes.reduce((a,b) => Math.abs(b-fs)<Math.abs(a-fs)?b:a);
    groups.typography.push({ cls: `set-text-${snapFs}`, desc: `Font size ${fs}px` });

    const fw = typeof node.fontWeight === 'number' ? node.fontWeight : 400;
    const wCls = fontWeightClass(fw);
    groups.typography.push({ cls: wCls, desc: `Font weight ${fw}` });

    const align = node.textAlignHorizontal;
    if (align === 'CENTER') groups.typography.push({ cls: 'text-center', desc: 'Center aligned' });
    else if (align === 'RIGHT') groups.typography.push({ cls: 'text-right', desc: 'Right aligned' });
    else if (align === 'JUSTIFIED') groups.typography.push({ cls: 'text-justify', desc: 'Justified text' });

    if (typeof node.lineHeight === 'object' && node.lineHeight.unit !== 'AUTO') {
      const lh = node.lineHeight.value;
      if (node.lineHeight.unit === 'PERCENT') {
        const ratio = (lh/100).toFixed(2);
        groups.typography.push({ cls: `line-height-${ratio}`, desc: `Line height ${lh}%` });
      }
    }

    if (node.textDecoration === 'UNDERLINE') groups.typography.push({ cls: 'text-underline', desc: 'Underline' });
    if (node.textDecoration === 'STRIKETHROUGH') groups.typography.push({ cls: 'text-line-through', desc: 'Strikethrough' });

    if (node.textCase === 'UPPER') groups.typography.push({ cls: 'text-uppercase', desc: 'Uppercase' });
    if (node.textCase === 'LOWER') groups.typography.push({ cls: 'text-lowercase', desc: 'Lowercase' });
    if (node.textCase === 'TITLE') groups.typography.push({ cls: 'text-capitalize', desc: 'Capitalize' });
  }

  // ── Effects ──
  if ('effects' in node && node.effects && node.effects.length > 0) {
    const sc = shadowClass(node.effects);
    if (sc) groups.effects.push({ cls: sc, desc: 'Drop shadow' });
  }

  // ── Opacity ──
  if ('opacity' in node && node.opacity !== undefined && node.opacity < 0.99) {
    const oc = opacityClass(node.opacity);
    if (oc) groups.effects.push({ cls: oc, desc: `Opacity ${Math.round(node.opacity*100)}%` });
  }

  // ── Overflow ──
  if ('clipsContent' in node && node.clipsContent) {
    groups.misc.push({ cls: 'overflow-hidden', desc: 'Clips content (overflow hidden)' });
  }

  return {
    nodeType: type,
    nodeName: node.name,
    groups,
    allClasses: Object.values(groups).flat().filter(c => !c.note).map(c => c.cls).join(' '),
  };
}

// ─── EVENT LISTENERS ─────────────────────────────────────────────────────────

function broadcast() {
  const sel = figma.currentPage.selection;
  if (!sel.length) {
    figma.ui.postMessage({ type: 'no-selection' });
    return;
  }
  try {
    const result = analyzeNode(sel[0]);
    figma.ui.postMessage({ type: 'result', data: result });
  } catch(e) {
    figma.ui.postMessage({ type: 'error', message: e.message });
  }
}

figma.on('selectionchange', broadcast);
figma.ui.onmessage = msg => {
  if (msg.type === 'ready') broadcast();
  if (msg.type === 'close') figma.closePlugin();
};
