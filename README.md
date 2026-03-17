# SantyCSS

[![npm version](https://img.shields.io/npm/v/santycss.svg?style=flat-square)](https://www.npmjs.com/package/santycss)
[![npm downloads](https://img.shields.io/npm/dm/santycss.svg?style=flat-square)](https://www.npmjs.com/package/santycss)
[![license](https://img.shields.io/npm/l/santycss.svg?style=flat-square)](https://github.com/ChintuSanty/santyCSS/blob/main/LICENSE)
[![bundle size](https://img.shields.io/badge/full_bundle-701KB-blue?style=flat-square)](https://www.npmjs.com/package/santycss)

**Plain-English utility-first CSS framework.**
Class names read like sentences. No build step. No configuration. Just link and use.

```html
<div class="make-flex align-center gap-16 background-blue-500 round-corners-12 add-padding-24">
  <button class="make-button style-primary size-large shape-pill on-hover:animate-bounce">
    Get Started
  </button>
</div>
```

> 🌐 **[santycss.santy.in](https://santycss.santy.in)** · 📖 **[Class Reference](https://santycss.santy.in/classes.html)** · 🎬 **[Animations](https://santycss.santy.in/animations.html)** · 📦 **[npm Docs](https://santycss.santy.in/docs.html)**

---

## What's New in v1.4

### 🧩 VS Code IntelliSense Extension

**SantyCSS IntelliSense** is now available as a VS Code extension — similar to Tailwind CSS IntelliSense.

- **Autocomplete** — type inside `class=""` or `className=""` and get instant suggestions for all 8,500+ SantyCSS classes
- **Hover docs** — hover any class to see the CSS it generates
- **Works in** HTML, JSX, TSX, Vue, Svelte, PHP, ERB
- **Toggle command** — `SantyCSS: Toggle IntelliSense` in the Command Palette

Install: search **SantyCSS IntelliSense** in the Extensions panel.

---

## What's New in v1.3

### 🎨 70+ SVG Icons (new: Business & Finance)

SantyCSS now ships **two icon systems** in `santy-icons.css`:

**Brand Icons** (35) — `.brand-icon` + `.brand-icon-{name}`
Social media, developer tools, platforms & payment services.

**Business & Finance Icons** (35) — `.icon` + `.icon-{name}`
35 utility icons sourced from Font Awesome 6 Free (CC BY 4.0):

| Category | Icons |
|---|---|
| Charts | `chart-bar` · `chart-column` · `chart-line` · `chart-pie` · `chart-area` · `chart-simple` |
| Money | `dollar-sign` · `euro-sign` · `coins` · `money-bill` · `money-bill-wave` · `sack-dollar` · `percent` |
| Business | `briefcase` · `handshake` · `building` · `building-columns` · `landmark` · `store` · `hotel` |
| Documents | `file-invoice` · `file-invoice-dollar` · `receipt` · `credit-card` · `wallet` |
| Commerce | `tag` · `tags` · `cash-register` · `calculator` · `piggy-bank` · `scale-balanced` |
| Trends | `arrow-trend-up` · `arrow-trend-down` · `hand-holding-dollar` · `house` |

```html
<!-- Include the icon stylesheet -->
<link rel="stylesheet" href="santy-icons.css">

<!-- Brand icon (social/dev) -->
<span class="brand-icon brand-icon-github"></span>
<span class="brand-icon brand-icon-react brand-icon-color-react brand-icon-xl"></span>

<!-- Business & Finance icon -->
<span class="icon icon-briefcase"></span>
<span class="icon icon-dollar-sign icon-xl" style="color:#16a34a;"></span>
<span class="icon icon-chart-line icon-32"></span>
```

**Size modifiers** (same for both systems):
```
.icon-xs  .icon-sm  .icon-md  .icon-lg  .icon-xl
.icon-2x  .icon-3x  .icon-4x  .icon-5x  .icon-6x
.icon-16  .icon-24  .icon-32  .icon-48  .icon-64
```

**Animations:**
```html
<span class="icon icon-coins icon-spin icon-xl" style="color:#f59e0b;"></span>
```

> 🎨 **[Icon Browser](https://santycss.santy.in/icons.html)** — search, filter, and copy-click any icon

---

## What's New in v1.2

### 🎬 120+ Animations (was 70+)

**Scroll-Triggered** — elements animate when they enter the viewport:
```html
<div class="animate-on-scroll-slide-up scroll-reveal-delay-200">Reveals on scroll</div>
<!-- Add IntersectionObserver once in your JS -->
```

**Hover-Triggered** — full animations on mouse-over, not just transforms:
```html
<button class="make-button style-primary on-hover:animate-rubber-band">Hover me</button>
<div class="animate-text-gradient-flow set-text-32 text-bold">Gradient Flow</div>
```

**Text Animations:**
```html
<h1 class="animate-typewriter">Hello, World!</h1>
<h2 class="animate-text-glitch">Glitch</h2>
<p class="animate-text-neon-pulse color-blue-400">Neon Pulse</p>
```

**Staggered Entrances** — children animate in sequence:
```html
<ul class="animate-stagger-slide-up animate-stagger-children-100">
  <li>Item 1</li>  <!-- 0ms delay   -->
  <li>Item 2</li>  <!-- 100ms delay -->
  <li>Item 3</li>  <!-- 200ms delay -->
</ul>
```

**3D Animations:**
```html
<div class="animate-flip-3d-y">Card flip</div>
<div class="animate-morph-blob" style="width:80px;height:80px;background:#6366f1;"></div>
<div class="animate-border-spin">Spinning border</div>
```

**UI Feedback Animations** — paired with components:
```html
<div class="animate-toast-in">Toast notification</div>
<div class="animate-modal-in">Modal dialog</div>
<div class="animate-error-shake">Form error</div>
```

**New helper classes:**
```
animation-ease-bounce     animation-ease-elastic    animation-ease-spring
animation-direction-reverse  animation-direction-alternate
animation-pause-on-hover  animation-delay-750       animation-delay-1500
animation-delay-2500      animation-speed-ultra-fast
```

---

### 🧩 Component Variant System (`make-*`)

Replaces the old `btn btn-primary` pattern with a composable modifier system:

```html
<!-- Old way -->
<button class="btn btn-success btn-lg">Old</button>

<!-- New way -->
<button class="make-button style-success size-large shape-pill">New</button>
<button class="make-button style-danger size-small shape-rounded">Delete</button>
<div class="make-card style-elevated">
  <div class="card-body">...</div>
</div>
<span class="make-badge style-success">Active</span>
<div class="make-alert style-warning">Watch out</div>
```

**All components:** `make-button` · `make-card` · `make-badge` · `make-alert` · `make-input` · `make-avatar` · `make-spinner` · `make-skeleton` · `make-progress` · `make-navbar` · `make-tooltip` · `make-modal` · `make-drawer` · `make-accordion` · `make-dropdown`

**Style modifiers:** `style-primary` · `style-secondary` · `style-success` · `style-danger` · `style-warning` · `style-info` · `style-outline` · `style-ghost` · `style-dark` · `style-flat` · `style-elevated` · `style-bordered`

**Size modifiers:** `size-small` · `size-large` · `size-xl` · `size-full`

**Shape modifiers:** `shape-pill` · `shape-rounded` · `shape-square`

---

### 🌐 20 Modern CSS Utility Groups

| Group | Classes |
|---|---|
| Container Queries | `container-query`, `cq-sm:make-flex`, `cq-md:grid-cols-3` |
| Scroll & Snap | `scroll-smooth`, `scroll-snap-x`, `scroll-snap-center`, `overscroll-contain` |
| Logical Properties | `add-padding-inline-{n}`, `ps-{n}`, `pe-{n}`, `ms-auto`, `text-start`, `text-end` |
| Fluid Typography | `text-fluid-sm` through `text-fluid-hero` (CSS `clamp()`) |
| Clip Path | `clip-circle`, `clip-hexagon`, `clip-diamond`, `clip-star`, `clip-arrow-right` |
| Gradients | `gradient-radial-from-center`, `gradient-conic`, `text-gradient-blue-to-purple` |
| Advanced Grid | `grid-auto-fit-min-200`, `masonry-cols-3`, `grid-area-header/sidebar/main/footer` |
| Advanced Typography | `text-balance`, `text-pretty`, `text-clamp-1/2/3`, `drop-cap`, `font-tabular-nums` |
| Cursor Utilities | 30 cursor types including `cursor-cell`, `cursor-copy`, `cursor-resize-ns` |
| Dynamic Viewport | `set-height-dvh`, `set-height-svh`, `set-height-lvh`, `set-min-height-dvh` |
| Color Mix / Opacity | `background-blue-500/50`, `background-white/75`, `background-mix-blue-red-50` |
| Semantic Z-index | `z-modal: 400`, `z-tooltip: 600`, `z-toast: 700`, `isolate` |
| View Transitions | `view-transition-fade`, `view-transition-slide` (View Transitions API) |
| Size Utilities | `set-size-16` through `set-size-200`, `set-size-full/screen/fit` |
| Print Utilities | `print-hidden`, `print-only`, `print-break-before`, `print-show-links` |
| Subgrid | `grid-cols-subgrid`, `span-col-subgrid-3` |
| Math / Calc | `set-width-calc-100-minus-64`, `set-height-calc-screen-minus-80`, `set-max-width-readable` |
| Pointer / Touch | `touch-none`, `touch-pan-x`, `touch-manipulation`, `will-change-transform` |
| @layer | `@layer santy-base, santy-utilities, santy-components, santy-overrides` |
| 3D Transform | `perspective-*`, `rotate-3d`, `transform-origin-*` (extended) |

---

### 🤖 Built for the AI Era

SantyCSS ships a **context file** (`santycss.context.md`) — paste it into Claude, GPT-4, or Cursor's system prompt and the AI generates SantyCSS instead of Tailwind, every time:

```
Paste santycss.context.md → AI writes SantyCSS instead of Tailwind
```

The **built-in AI Generator** converts plain English → SantyCSS classes in the browser (no API key):

> "a centered flex container with green background and white text and gap"
> → `make-flex align-center justify-center background-green-500 color-white gap-16`

---

## Installation

```bash
npm install santycss
```

**CDN (fastest — zero install):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/santycss/dist/santy.css">
```

**Import in JS/TS (React, Vue, Next, Nuxt, Vite):**
```js
import 'santycss/css';             // full bundle
import 'santycss/css/core';        // utilities only
import 'santycss/css/components';  // component shortcuts
import 'santycss/css/animations';  // animations only
import 'santycss/css/email';       // email-safe CSS
```

**PostCSS:**
```js
// postcss.config.js
module.exports = {
  plugins: [require('santycss/postcss')]
};
```

**Vite plugin:**
```js
// vite.config.js
import santyCSS from 'santycss/vite';
export default { plugins: [santyCSS()] };
```

---

## Core Naming Conventions

| Pattern | Example | Meaning |
|---|---|---|
| `add-{prop}-{n}` | `add-padding-24` | Additive — border, padding, margin, shadow |
| `make-{val}` | `make-flex`, `make-circle` | Display / behaviour |
| `set-{prop}-{val}` | `set-text-24`, `set-width-320` | Dimension / size setter |
| `pin-{side}-{n}` | `pin-top-0`, `pin-center` | Absolute / fixed positioning |
| `on-hover:{class}` | `on-hover:scale-110` | State / responsive prefix |
| `md:{class}` | `md:grid-cols-3` | Responsive breakpoint |
| `make-button style-* size-* shape-*` | `make-button style-success size-large shape-pill` | Component variant system |

---

## Quick Examples

**Responsive hero:**
```html
<section class="make-flex flex-column align-center justify-center text-center add-padding-y-80 background-gray-50">
  <h1 class="set-text-56 text-bold color-gray-900 add-margin-bottom-16 md:set-text-40 on-mobile:set-text-32">
    Build faster
  </h1>
  <p class="set-text-20 color-gray-500 line-height-relaxed add-margin-bottom-32">
    Plain-English CSS that reads like you wrote it.
  </p>
  <a href="#" class="make-button style-primary size-large shape-pill on-hover:scale-105 transition-all">
    Get started →
  </a>
</section>
```

**Card with hover effect:**
```html
<div class="make-card style-bordered add-border-left-4 border-color-blue-500 on-hover:scale-105 transition-all cursor-pointer add-padding-28 add-shadow-md round-corners-16">
  <h3 class="set-text-20 text-bold color-gray-900 add-margin-bottom-8">Card Title</h3>
  <p class="set-text-14 color-gray-500 line-height-relaxed">Card description.</p>
</div>
```

**Dark-mode card grid:**
```html
<div class="make-grid grid-cols-3 gap-24 on-mobile:grid-cols-1 md:grid-cols-2">
  <div class="make-card style-elevated background-white dark:background-gray-800 round-corners-16 add-padding-24">
    <span class="make-badge style-primary add-margin-bottom-12">New</span>
    <h4 class="set-text-18 text-semibold color-gray-900 dark:color-white">Feature</h4>
    <p class="set-text-14 color-gray-500 dark:color-gray-400 line-height-relaxed">Description.</p>
  </div>
</div>
```

**Scroll-triggered stagger:**
```html
<div class="make-grid grid-cols-3 gap-24 animate-stagger-slide-up animate-stagger-children-200">
  <div class="make-card style-bordered">Card 1</div>
  <div class="make-card style-bordered">Card 2</div>
  <div class="make-card style-bordered">Card 3</div>
</div>
<script>
new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('is-visible'); });
}, { threshold: 0.15 }).observe(
  ...document.querySelectorAll('[class*="animate-on-scroll"],[class*="scroll-reveal"]')
);
</script>
```

---

## Spacing & Sizing Reference

**Spacing values (n):** 0–50 every 1px · 52–200 every 4px · plus 256, 320, 384, 448, 512, 640, 768, 1024

| Category | Classes |
|---|---|
| Padding | `add-padding-{n}` · `-top-` · `-bottom-` · `-left-` · `-right-` · `-x-` · `-y-{n}` |
| Margin | `add-margin-{n}` · `-top-` · `-bottom-` · `-left-` · `-right-` · `-x-` · `-y-{n}` · `-x-auto` |
| Gap | `gap-{n}` · `gap-x-{n}` · `gap-y-{n}` |
| Width | `set-width-{n}` · `-full` · `-screen` · `-fit` |
| Height | `set-height-{n}` · `-full` · `-screen` · `-dvh` · `-svh` · `-lvh` |
| Text size | `set-text-{n}` (8–144px) |

---

## Colors

20 color families × 10 shades (50–950):

`blue` `red` `green` `yellow` `purple` `pink` `orange` `gray` `indigo` `cyan` `teal` `rose` `violet` `emerald` `amber` `lime` `sky` `slate` `zinc` `neutral` `stone`

```html
<p class="color-blue-500">Text</p>
<div class="background-emerald-100 border-color-emerald-400 add-border-2">Card</div>
```

---

## Responsive Breakpoints

```
sm:{class}          640px+
md:{class}          768px+
lg:{class}          1024px+
xl:{class}          1280px+
on-mobile:{class}   max 767px
on-tablet:{class}   768–1023px
on-desktop:{class}  1024px+
```

---

## CSS Design Tokens

Override to brand your entire UI with zero rebuilding:

```css
:root {
  --santy-primary:   #3b82f6;
  --santy-secondary: #8b5cf6;
  --santy-accent:    #10b981;
  --santy-radius:    0.5rem;
  --santy-font:      'Inter', system-ui, sans-serif;
}
```

---

## Component Classes (Legacy)

The original `.btn`, `.card`, `.badge` classes still work and are fully supported:

```html
<button class="btn btn-primary btn-lg">Button</button>
<div class="card card-body">Card</div>
<span class="badge badge-success">Active</span>
<div class="alert alert-warning">Warning</div>
```

For new projects, the **Component Variant System** (`make-button style-*`) is recommended.

---

## Files in the Package

| File | Size | Contents |
|---|---|---|
| `dist/santy.css` | 723KB | Everything — utilities + components + animations |
| `dist/santy.min.css` | 615KB | Minified full bundle |
| `dist/santy-core.css` | 598KB | Utilities only (no components) |
| `dist/santy-components.css` | 52KB | Component shortcuts only |
| `dist/santy-animations.css` | 60KB | 120+ animations only |
| `dist/santy-email.css` | 13KB | Email-safe CSS for HTML email |

---

## Tree-shaking / Purge

Keep only the classes you use:

```bash
npx santycss purge --input ./src --output ./dist/santy.purged.css
```

Or in Node.js:

```js
const { purge } = require('santycss/purge');
purge({ input: './src', output: './dist/santy.purged.css' });
```

---

## LLM / AI Integration

```
npm show santycss homepage
→ https://santycss.santy.in
```

The file `santycss.context.md` (in the GitHub repo) is a ready-made system prompt for LLMs. Paste it into your AI tool of choice and it will generate SantyCSS class names instead of Tailwind utilities.

---

## Links

- 🌐 Website: [santycss.santy.in](https://santycss.santy.in)
- 📖 Class Reference: [santycss.santy.in/classes.html](https://santycss.santy.in/classes.html)
- 🎬 Animations: [santycss.santy.in/animations.html](https://santycss.santy.in/animations.html)
- 🎮 Live Demo: [santycss.santy.in/demo.html](https://santycss.santy.in/demo.html)
- 📦 npm Docs: [santycss.santy.in/docs.html](https://santycss.santy.in/docs.html)
- 🐛 Issues: [github.com/ChintuSanty/santyCSS/issues](https://github.com/ChintuSanty/santyCSS/issues)

---

## License

MIT © [Santy](https://github.com/ChintuSanty)
