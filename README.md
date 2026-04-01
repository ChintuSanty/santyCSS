# SantyCSS

[![npm version](https://img.shields.io/npm/v/santycss.svg?style=flat-square)](https://www.npmjs.com/package/santycss)
[![npm downloads](https://img.shields.io/npm/dm/santycss.svg?style=flat-square)](https://www.npmjs.com/package/santycss)
[![license](https://img.shields.io/npm/l/santycss.svg?style=flat-square)](https://github.com/ChintuSanty/santyCSS/blob/main/LICENSE)
[![bundle size](https://img.shields.io/badge/core-310KB-blue?style=flat-square)](https://www.npmjs.com/package/santycss)

🇮🇳 **India's first utility-first CSS framework.**
**Plain-English class names. No build step. No configuration. Just link and use.**
Class names read like sentences — `add-padding-24` instead of `p-6`. AI tools understand them instantly, no lookup table needed.

```html
<div class="make-flex align-center gap-16 background-blue-500 round-corners-12 add-padding-24">
  <button class="make-button style-primary size-large shape-pill on-hover:animate-bounce">
    Get Started
  </button>
</div>
```

> 🌐 **[santycss.santy.in](https://santycss.santy.in)** · 📖 **[Class Reference](https://santycss.santy.in/classes.html)** · 🌊 **[Webflow](https://santycss.santy.in/webflow.html)** · 🎬 **[Animations](https://santycss.santy.in/animations.html)** · 📦 **[npm Docs](https://santycss.santy.in/docs.html)**

---

## What's New in v2.4.0

### ⚡ Migrate from Tailwind in One Command

Already using Tailwind CSS? Switch your entire project — HTML, JSX, TSX, Vue, Svelte — without rewriting a single file:

```bash
npx santycss migrate --input=src/
```

**Options:**
```bash
npx santycss migrate --input=src/     # convert all files in src/
npx santycss migrate --file=index.html # single file
npx santycss migrate --dry-run        # preview only, no writes
npx santycss migrate --dry-run --report  # also list unmapped classes
```

**What gets converted:**

| Tailwind | SantyCSS |
|---|---|
| `flex items-center gap-4` | `make-flex align-center gap-16` |
| `p-6 mt-4 mb-8` | `add-padding-24 add-margin-top-16 add-margin-bottom-32` |
| `text-lg font-semibold` | `set-text-18 text-semibold` |
| `bg-blue-500 text-white rounded-lg shadow-md` | `background-blue-500 color-white make-rounded-lg add-shadow-md` |
| `hidden md:block` | `make-hidden tablet:make-block` |
| `grid grid-cols-3 gap-6` | `make-grid grid-cols-3 gap-24` |

Covers 150+ Tailwind class names across flex/grid, spacing, typography, colors, borders, shadows, overflow, position, z-index, transitions, and more.

---

### 🌙 Dark Mode Semantic Token System

New CSS-variable token layer — add `data-theme="dark"` to any element and every utility class adapts automatically. No duplicate classes, no `dark:` prefixes for common patterns:

```html
<!-- Dark theme -->
<html data-theme="dark">

<!-- Follow OS preference -->
<html class="theme-auto">

<!-- Semantic utility classes — adapt in both themes -->
<div class="bg-surface text-base">
  <p class="text-muted">Subtitle</p>
  <span class="text-accent">Highlight</span>
  <hr class="border-base">
</div>
```

**New semantic token classes:**

| Class | Light | Dark |
|---|---|---|
| `bg-base` | `#ffffff` | `#0f172a` |
| `bg-subtle` | `#f9fafb` | `#1e293b` |
| `bg-surface` | `#ffffff` | `#1e293b` |
| `bg-elevated` | `#ffffff` | `#334155` |
| `text-base` | `#111827` | `#f1f5f9` |
| `text-muted` | `#6b7280` | `#94a3b8` |
| `text-subtle` | `#9ca3af` | `#64748b` |
| `text-accent` | `#3b82f6` | `#60a5fa` |
| `bg-accent` | `#3b82f6` | `#60a5fa` |
| `bg-accent-light` | `rgba(59,130,246,.12)` | `rgba(96,165,250,.15)` |
| `border-base` | `#e5e7eb` | `#334155` |
| `border-strong` | `#d1d5db` | `#475569` |

**Override tokens in your own CSS:**
```css
:root {
  --santy-accent: #7c3aed;        /* brand purple */
  --santy-accent-light: rgba(124,58,237,.12);
}
[data-theme="dark"] {
  --santy-accent: #a78bfa;
}
```

---

### 🤖 AI-First — Why SantyCSS is Better for AI

SantyCSS class names **are** the documentation. `add-bg-blue make-rounded` tells an LLM exactly what it's doing. `bg-blue-500 rounded-lg` requires a lookup table.

```
Tailwind:   bg-blue-500 rounded-lg shadow-md p-6 text-white font-semibold
SantyCSS:   background-blue-500 make-rounded-lg add-shadow-md add-padding-24 color-white text-semibold
```

The SantyCSS version is self-documenting — any developer (or AI) reading it knows exactly what CSS is applied. No docs needed.

**Use the context file** — paste `santycss.context.md` into Claude, GPT-4, or Cursor's system prompt:
```
Paste santycss.context.md → AI writes SantyCSS instead of Tailwind, every time
```

---

## What's New in v2.0

### 🦇 Creature Animations — Premium Free

10 hand-crafted creature animations included free in v2.0. No extra import, no paywall — just add the class.

| Class | Creature | Description |
|---|---|---|
| `animate-bat-fly` | 🦇 Bat | Flies across screen with arcing path |
| `animate-bat-wings` | 🦇 Bat wings | Wing flap loop (combine with `animate-bat-fly`) |
| `animate-butterfly` | 🦋 Butterfly | Wing flap using scaleX |
| `animate-butterfly-drift` | 🦋 Butterfly drift | Drifts through the air while flapping |
| `animate-firefly` | 🌟 Firefly | Erratic glowing float |
| `animate-firefly-glow` | ✨ Firefly glow | Pulsing yellow glow effect |
| `animate-spider-drop` | 🕷️ Spider | Descends on thread and ascends |
| `animate-spider-swing` | 🕷️ Spider swing | Pendulum swing on thread |
| `animate-fish-swim` | 🐟 Fish | Swims with tail-wave body motion |
| `animate-jellyfish` | 🎐 Jellyfish | Pulsing bell contraction + float |
| `animate-jellyfish-tendrils` | 🎐 Tendrils | Trailing tendril sway |
| `animate-bird-flock` | 🐦 Bird | Soaring arc with rotation |
| `animate-bird-flock-2` / `animate-bird-flock-3` | 🐦🐦 Flock | Staggered offsets for formation effect |
| `animate-bee-hover` | 🐝 Bee | Hovering with natural drift |
| `animate-bee-buzz` | 🐝 Buzz | Rapid wing-buzz shake |
| `animate-snake-slither` | 🐍 Snake | Sinusoidal slithering path |
| `animate-dragon-fire` | 🔥 Dragon fire | Fire burst expanding and fading |
| `animate-fire-flicker` | 🔥 Flicker | Rapid flame flicker |

```html
<!-- Bat flying across -->
<span class="animate-bat-fly animate-bat-wings">🦇</span>

<!-- Butterfly flapping and drifting -->
<span class="animate-butterfly animate-butterfly-drift">🦋</span>

<!-- Firefly with glow -->
<span class="animate-firefly animate-firefly-glow">✨</span>

<!-- Bird flock formation (3 birds) -->
<span class="animate-bird-flock">🐦</span>
<span class="animate-bird-flock-2">🐦</span>
<span class="animate-bird-flock-3">🐦</span>

<!-- Dragon fire breath -->
<span class="animate-dragon-fire animate-fire-flicker">🔥</span>
```

> 🎬 **[See all creature animations live →](https://santycss.santy.in/animations.html#creature-animations)**

---

## What's New in v1.9

### 🌊 Scroll & Scrollbar Utilities

| Class | Description |
|---|---|
| `scroll-smooth` | `scroll-behavior: smooth` |
| `scroll-auto` | `scroll-behavior: auto` |
| `scrollbar-thin` | Narrow scrollbar (webkit + standard) |
| `scrollbar-dark` | Dark-themed scrollbar |
| `scrollbar-hidden` | Hide scrollbar, keep scroll functionality |

### 🪟 Glass Morphism

| Class | Description |
|---|---|
| `glass` | Frosted glass effect (blur + semi-transparent white) |
| `glass-dark` | Dark frosted glass |
| `glass-light` | Light frosted glass |

### 🌈 Radial Gradients

```html
<div class="gradient-radial-blue-purple">...</div>
<div class="gradient-radial-pink-orange">...</div>
```

All `gradient-radial-*` utilities use CSS `radial-gradient()` matching the existing linear gradient palette.

### 🎬 New Animation Utilities

| Class | Description |
|---|---|
| `animate-spin-slow` | Slow clockwise rotation |
| `animate-spin-fast` | Fast clockwise rotation |
| `animate-spin-cw` | Explicit clockwise spin |
| `animate-spin-ccw` | Counter-clockwise spin |
| `animate-spin-xslow` | Very slow rotation |
| `animate-pulse-dot` | Pulsing dot indicator |
| `skill-bar-animated` | Animated skill/progress bar fill |

```html
<!-- Pulsing status indicator -->
<span class="animate-pulse-dot background-green-500"></span>

<!-- Animated skill bar -->
<div class="skill-bar-animated" style="--skill-width: 80%"></div>

<!-- Counter-clockwise spinner -->
<div class="animate-spin-ccw">↺</div>
```

---

## What's New in v1.8

### 🎨 SantyCSS Inspector — Figma Plugin

Inspect any Figma layer and get the exact SantyCSS classes in one click.

**Download / Install:**

> 🌐 **[Download from santycss.santy.in/docs.html](https://santycss.santy.in/docs.html#figma-plugin)** — full setup guide and one-click download

**Local development install:**
1. Clone this repo — the plugin lives in `figma-plugin-santycss/`
2. Open **Figma Desktop** → Plugins → Development → **Import plugin from manifest**
3. Select `figma-plugin-santycss/manifest.json`
4. Select any frame/text layer → run **SantyCSS Inspector**

**What it detects:**

| Figma property | SantyCSS output |
|---|---|
| Auto-layout (horizontal) | `make-flex flex-row` |
| Auto-layout (vertical) | `make-flex flex-column` |
| Alignment | `justify-center`, `align-center`, `justify-between` |
| Gap | `gap-16`, `gap-24` |
| Padding | `add-padding-24`, `add-padding-x-16 add-padding-y-8` |
| Width / Height | `set-width-320`, `set-width-full`, `set-height-fit` |
| Corner radius | `round-corners-8`, `make-pill` |
| Stroke | `add-border-1`, `border-color-blue-500` |
| Fill / background | `background-blue-500` (nearest of 200 palette colors) |
| Text color | `color-gray-900` |
| Font size | `set-text-16` |
| Font weight | `text-bold`, `text-semibold` |
| Text align | `text-center`, `text-right` |
| Drop shadow | `add-shadow-sm` / `add-shadow-lg` |
| Opacity | `opacity-50` |
| Clips content | `overflow-hidden` |

**Plugin UI:**
- Grouped classes (Layout / Spacing / Size / Typography / Color / Border / Effects)
- Click any chip to copy that class
- **Copy All** button — copies all classes as one string
- Dark mode — follows Figma's theme automatically

---

## What's New in v1.7

### ♿ Accessibility Utilities

| Class | What it does |
|---|---|
| `.skip-to-content` | Skip-nav link — visible on focus, hidden otherwise |
| `.focus-trap` | Container for modal/drawer focus trapping |
| `.aria-live-polite` / `.aria-live-assertive` | Visually hidden ARIA live regions |
| `.screen-reader-only` | Visually hide but keep accessible |
| `.focus-ring` / `.focus-ring-white` | Consistent focus outline utilities |
| `.focus-visible-ring` | Focus ring only on keyboard navigation |
| `.motion-safe-animate` | Disables animation when OS reduces motion |
| `.high-contrast-border/bg/outline` | `forced-colors` media query support |

### 🌐 Internationalisation (i18n)

| Class | What it does |
|---|---|
| `.add-padding-block-{n}` / `.add-padding-inline-{n}` | Logical padding (direction-aware) |
| `.add-margin-block-{n}` / `.add-margin-inline-{n}` | Logical margin |
| `.pin-block-start-0` / `.pin-inline-start-0` | Logical positioning |
| `.border-block-start` / `.border-inline-start` | Logical borders |
| `.make-text-vertical` | `writing-mode: vertical-rl` — for CJK/Japanese |
| `.make-text-vertical-up` | `writing-mode: vertical-lr` |
| `.text-orientation-mixed` / `.text-orientation-upright` | Text orientation control |
| `.text-direction-ltr` / `.text-direction-rtl` | Explicit `direction` control |

### 📱 Mobile-First Components

| Class | What it does |
|---|---|
| `.bottom-sheet` + `.open` | Slide-up panel from bottom (with safe-area support) |
| `.bottom-sheet-handle` / `.bottom-sheet-body` / `.bottom-sheet-footer` | Bottom sheet parts |
| `.bottom-sheet-overlay` + `.visible` | Semi-transparent backdrop |
| `.swipe-carousel` + `.swipe-carousel-item` | Touch-friendly horizontal scroll carousel |
| `.swipe-carousel-full` / `.peek` / `.multi` | Carousel layout variants |
| `.swipe-carousel-dot` + `.active` | Progress dots |
| `.pull-to-refresh` + `.pulling` / `.refreshing` | Pull-to-refresh indicator |
| `.padding-safe-top/bottom/left/right/all` | `env(safe-area-inset-*)` padding |

### 🗓 New Components

| Class | What it does |
|---|---|
| `.command-palette-wrap` + `.open` | VS Code-style Ctrl+K command palette overlay |
| `.command-palette-input` / `.command-palette-item` | Command palette parts |
| `.date-picker` / `.date-picker-grid` / `.date-picker-day` | Full calendar date picker |
| `.date-picker-day.today` / `.selected` / `.in-range` | Day state modifiers |

### 🎨 Figma Plugin

The **SantyCSS Figma Plugin** is live — inspect Figma designs and get the exact SantyCSS classes that match. See [What's New in v1.8](#-santycss-inspector--figma-plugin) above for full details and the download link.

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

## What's New in v2.4.5

### 🎨 1000 Essential UI Icons + Scrollable Grid + Sub-filters

600 new icons added — calendars (all variants), camera & media, chat & messaging, cloud & weather, clipboard, checks & chevrons, database & devices, emoji, envelopes, files & documents, and more.

The icon browser now features:
- **Scrollable Essential UI grid** — browse 1000 icons in a fixed-height scrollable area
- **Sub-filters** — filter by category: Numbers, Arrows, Calendar, Camera, Chat, Cloud, Database, Emoji, Files, Shapes, Shopping

```html
<span class="icon icon-chat-left-text-fill icon-size-xl" style="color:#6366f1;"></span>
<span class="icon icon-cloud-lightning-rain-fill icon-size-xl" style="color:#0ea5e9;"></span>
<span class="icon icon-file-earmark-pdf-fill icon-size-xl" style="color:#ef4444;"></span>
<span class="icon icon-emoji-laughing-fill icon-size-xl" style="color:#f59e0b;"></span>
```

---

## What's New in v2.4.4

### 🎯 400 Essential UI Icons (+100 new)

100 more icons — boxes, buildings, browsers, calendars, brightness controls and more.

```html
<span class="icon icon-building-fill icon-size-2x" style="color:#6366f1;"></span>
<span class="icon icon-calendar-heart-fill icon-size-xl" style="color:#ec4899;"></span>
<span class="icon icon-briefcase-fill icon-size-xl" style="color:#3b82f6;"></span>
<span class="icon icon-brightness-high-fill icon-size-xl" style="color:#f59e0b;"></span>
<span class="icon icon-bug-fill icon-size-xl" style="color:#ef4444;"></span>
```

**New icons (100):**

| Group | Icons |
|---|---|
| Boxes | `box2-fill` `box2-heart` `box2-heart-fill` `boxes` |
| Dev | `braces` `braces-asterisk` `bricks` `bug` `bug-fill` |
| Work | `briefcase` `briefcase-fill` `bullseye` |
| Display | `brightness-alt-high` `brightness-alt-high-fill` `brightness-alt-low` `brightness-alt-low-fill` `brightness-high` `brightness-high-fill` `brightness-low` `brightness-low-fill` `brilliance` |
| Media | `broadcast` `broadcast-pin` |
| Browsers | `browser-chrome` `browser-edge` `browser-firefox` `browser-safari` |
| Design | `brush` `brush-fill` `bucket` `bucket-fill` |
| Buildings | `building` `building-add` `building-check` `building-dash` `building-down` `building-exclamation` `building-fill` `building-fill-add` `building-fill-check` `building-fill-dash` `building-fill-down` `building-fill-exclamation` `building-fill-gear` `building-fill-lock` `building-fill-slash` `building-fill-up` `building-fill-x` `building-gear` `building-lock` `building-slash` `building-up` `building-x` `buildings` `buildings-fill` |
| Transport | `bus-front` `bus-front-fill` |
| Legal | `c-circle` `c-circle-fill` `c-square` `c-square-fill` |
| Food | `cake` `cake-fill` `cake2` `cake2-fill` |
| Tools | `calculator` `calculator-fill` |
| Calendars | `calendar` `calendar-check` `calendar-check-fill` `calendar-date` `calendar-date-fill` `calendar-day` `calendar-day-fill` `calendar-event` `calendar-event-fill` `calendar-fill` `calendar-heart` `calendar-heart-fill` `calendar-minus` `calendar-minus-fill` `calendar-month` `calendar-month-fill` `calendar-plus` `calendar-plus-fill` `calendar-range` `calendar-range-fill` `calendar-week` `calendar-week-fill` `calendar-x` `calendar-x-fill` `calendar2` `calendar2-check` `calendar2-check-fill` `calendar2-date` `calendar2-date-fill` `calendar2-day` `calendar2-day-fill` `calendar2-event` `calendar2-event-fill` |

---

## What's New in v2.4.3

### 🎯 300 Essential UI Icons (+100 new)

100 more icons added — ban/block, charts, baskets, battery, books, bookmarks, boxes, borders and more.

```html
<span class="icon icon-ban-fill icon-size-xl" style="color:#ef4444;"></span>
<span class="icon icon-bar-chart-fill icon-size-2x" style="color:#3b82f6;"></span>
<span class="icon icon-bookmark-heart-fill icon-size-xl" style="color:#ec4899;"></span>
<span class="icon icon-box-arrow-up-right icon-size-lg"></span>
<span class="icon icon-battery-full icon-size-xl" style="color:#22c55e;"></span>
```

**New icons (100):**

| Group | Icons |
|---|---|
| Block / Medical | `ban` `ban-fill` `bandaid` `bandaid-fill` |
| Finance | `bank` `bank2` `bar-chart` `bar-chart-fill` `bar-chart-line` `bar-chart-line-fill` `bar-chart-steps` |
| Shopping | `basket` `basket-fill` `basket2` `basket2-fill` `basket3` `basket3-fill` |
| Device | `battery` `battery-charging` `battery-full` `battery-half` `battery-low` |
| Science / Social | `beaker` `beaker-fill` `behance` `bing` `bluesky` `bluetooth` |
| Notifications | `bell` `bell-fill` `bell-slash` `bell-slash-fill` |
| Design | `bezier` `bezier2` `binoculars` `binoculars-fill` `bounding-box` `bounding-box-circles` |
| Transport | `bicycle` |
| Text | `blockquote-left` `blockquote-right` `body-text` |
| Books | `book` `book-fill` `book-half` `bookmarks` `bookmarks-fill` `bookshelf` |
| Bookmarks | `bookmark` `bookmark-check` `bookmark-check-fill` `bookmark-dash` `bookmark-dash-fill` `bookmark-fill` `bookmark-heart` `bookmark-heart-fill` `bookmark-plus` `bookmark-plus-fill` `bookmark-star` `bookmark-star-fill` `bookmark-x` `bookmark-x-fill` |
| Media | `boombox` `boombox-fill` |
| Framework | `bootstrap` `bootstrap-fill` `bootstrap-reboot` |
| Border | `border` `border-all` `border-bottom` `border-center` `border-inner` `border-left` `border-middle` `border-outer` `border-right` `border-style` `border-top` `border-width` |
| Boxes | `box` `box-arrow-down` `box-arrow-down-left` `box-arrow-down-right` `box-arrow-in-down` `box-arrow-in-down-left` `box-arrow-in-down-right` `box-arrow-in-left` `box-arrow-in-right` `box-arrow-in-up` `box-arrow-in-up-left` `box-arrow-in-up-right` `box-arrow-left` `box-arrow-right` `box-arrow-up` `box-arrow-up-left` `box-arrow-up-right` `box-fill` `box-seam` `box-seam-fill` `box2` |

---

## What's New in v2.4.2

### 🎯 200 Essential UI Icons (+100 new)

Another 100 icons added to the **Essential UI** category — arrows (all directions, variants), aspect ratio, badges, bags, balloons, backpacks and more.

```html
<span class="icon icon-arrow-repeat icon-size-xl" style="color:#3b82f6;"></span>
<span class="icon icon-arrows-fullscreen icon-size-lg"></span>
<span class="icon icon-bag-heart-fill icon-size-2x" style="color:#ef4444;"></span>
<span class="icon icon-award-fill icon-size-2x" style="color:#f59e0b;"></span>
<span class="icon icon-balloon-heart icon-size-xl" style="color:#ec4899;"></span>
```

**New icons (100):**

| Group | Icons |
|---|---|
| Arrows (more) | `arrow-left-right` `arrow-left-short` `arrow-left-square` `arrow-left-square-fill` `arrow-repeat` `arrow-return-left` `arrow-return-right` `arrow-right` `arrow-right-circle` `arrow-right-circle-fill` `arrow-right-short` `arrow-right-square` `arrow-right-square-fill` `arrow-through-heart` `arrow-through-heart-fill` `arrow-up` `arrow-up-circle` `arrow-up-circle-fill` `arrow-up-left` `arrow-up-left-circle` `arrow-up-left-circle-fill` `arrow-up-left-square` `arrow-up-left-square-fill` `arrow-up-right` `arrow-up-right-circle` `arrow-up-right-circle-fill` `arrow-up-right-square` `arrow-up-right-square-fill` `arrow-up-short` `arrow-up-square` `arrow-up-square-fill` |
| Arrows (set) | `arrows` `arrows-angle-contract` `arrows-angle-expand` `arrows-collapse` `arrows-collapse-vertical` `arrows-expand` `arrows-expand-vertical` `arrows-fullscreen` `arrows-move` `arrows-vertical` |
| UI | `aspect-ratio` `aspect-ratio-fill` `asterisk` `at` `award` `award-fill` `back` `backspace` `backspace-fill` `backspace-reverse` `backspace-reverse-fill` |
| Bags & Packs | `backpack` `backpack-fill` `backpack2` `backpack2-fill` `backpack3` `backpack3-fill` `backpack4` `backpack4-fill` `bag` `bag-check` `bag-check-fill` `bag-dash` `bag-dash-fill` `bag-fill` `bag-heart` `bag-heart-fill` `bag-plus` `bag-plus-fill` `bag-x` `bag-x-fill` |
| Badges | `badge-3d` `badge-3d-fill` `badge-4k` `badge-4k-fill` `badge-8k` `badge-8k-fill` `badge-ad` `badge-ad-fill` `badge-ar` `badge-ar-fill` `badge-cc` `badge-cc-fill` `badge-hd` `badge-hd-fill` `badge-sd` `badge-sd-fill` `badge-tm` `badge-tm-fill` `badge-vo` `badge-vo-fill` `badge-vr` `badge-vr-fill` `badge-wc` `badge-wc-fill` |
| Fun | `balloon` `balloon-fill` `balloon-heart` `balloon-heart-fill` |

---

## What's New in v2.4.1

### 🎯 100 Essential UI Icons

New category — **Essential UI** — adds 100 carefully selected icons to `santy-icons.css`. Use them with the same `.icon` system.

```html
<link rel="stylesheet" href="santy-icons.css">

<!-- Number badges -->
<span class="icon icon-0-circle"></span>
<span class="icon icon-5-circle-fill icon-size-lg" style="color:#3b82f6;"></span>

<!-- Arrows -->
<span class="icon icon-arrow-down"></span>
<span class="icon icon-arrow-clockwise icon-size-xl" style="color:#22c55e;"></span>

<!-- UI chrome -->
<span class="icon icon-activity"></span>
<span class="icon icon-alarm icon-size-2x" style="color:#ef4444;"></span>
<span class="icon icon-archive-fill"></span>
```

**Full icon list (100):**

| Group | Icons |
|---|---|
| Numbers | `0-circle` `0-circle-fill` `0-square` `0-square-fill` `1-circle` `1-circle-fill` `1-square` `1-square-fill` `123` `2-circle` `2-circle-fill` `2-square` `2-square-fill` `3-circle` `3-circle-fill` `3-square` `3-square-fill` `4-circle` `4-circle-fill` `4-square` `4-square-fill` `5-circle` `5-circle-fill` `5-square` `5-square-fill` `6-circle` `6-circle-fill` `6-square` `6-square-fill` `7-circle` `7-circle-fill` `7-square` `7-square-fill` `8-circle` `8-circle-fill` `8-square` `8-square-fill` `9-circle` `9-circle-fill` `9-square` `9-square-fill` |
| Activity & Travel | `activity` `airplane` `airplane-engines` `airplane-engines-fill` `airplane-fill` `alarm` `alarm-fill` |
| Brands | `alexa` `alipay` `amazon` `amd` `android` `android2` `anthropic` `apple` `apple-music` `app` `app-indicator` |
| Alignment | `align-bottom` `align-center` `align-end` `align-middle` `align-start` `align-top` |
| Text | `alphabet` `alphabet-uppercase` `alt` |
| Files | `archive` `archive-fill` |
| Arrows | `arrow-90deg-down` `arrow-90deg-left` `arrow-90deg-right` `arrow-90deg-up` `arrow-bar-down` `arrow-bar-left` `arrow-bar-right` `arrow-bar-up` `arrow-clockwise` `arrow-counterclockwise` `arrow-down` `arrow-down-circle` `arrow-down-circle-fill` `arrow-down-left` `arrow-down-left-circle` `arrow-down-left-circle-fill` `arrow-down-left-square` `arrow-down-left-square-fill` `arrow-down-right` `arrow-down-right-circle` `arrow-down-right-circle-fill` `arrow-down-right-square` `arrow-down-right-square-fill` `arrow-down-short` `arrow-down-square` `arrow-down-square-fill` `arrow-down-up` `arrow-left` `arrow-left-circle` `arrow-left-circle-fill` |

> 🎨 **[Icon Browser](https://santycss.santy.in/icons.html)** — filter by "Essential UI" to browse all 100

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

## Webflow

Use SantyCSS on **[Webflow](https://webflow.com/)** without a build step: add the CDN `<link>` in **Project settings → Custom Code → Head**, then enter utility classes in the **Style → Selector** field on any element.

- **[Webflow guide + copy-paste snippets + sidebar class index](https://santycss.santy.in/webflow.html)** — head/footer code, optional split bundles, scroll-animation helper, design tokens.

---

## Installation

```bash
npm install santycss
```

**CDN — drop in and go (recommended for beginners):**
```html
<!-- Base utilities + components, no extended variants/animations -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/santycss/dist/santy-start.css">
```

**CDN — full responsive coverage:**
```html
<!-- Core utilities (slimmed) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/santycss/dist/santy-core.css">
<!-- xl:, xxl:, on-wide:, peer-*, group-*, print:, motion-*, RTL -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/santycss/dist/santy-variants.css">
```

**CDN — PostCSS/Vite purge workflow (teams):**
```html
<!-- Full bundle — purge down to ~15KB with PostCSS/Vite -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/santycss/dist/santy.min.css">
```

**Import in JS/TS (React, Vue, Next, Nuxt, Vite):**
```js
import 'santycss/css/start';      // drop-in: base utilities + components
import 'santycss/css/core';       // utilities only (slimmed, no extended variants)
import 'santycss/css/variants';   // xl:, peer-*, group-*, print:, motion-*, RTL
import 'santycss/css';            // full bundle
import 'santycss/css/components'; // component shortcuts
import 'santycss/css/animations'; // animations only
import 'santycss/css/email';      // email-safe CSS
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
| `dist/santy-start.css` | 527KB | **CDN drop-in** — base utilities + components, no extended variants/animations |
| `dist/santy-core.css` | 310KB | Utilities only — base + on-mobile/tablet/desktop/md + hover/focus |
| `dist/santy-variants.css` | 287KB | Extended — xl:, xxl:, on-wide:, peer-*, group-*, print:, motion-*, RTL |
| `dist/santy-components.css` | 217KB | Component shortcuts only |
| `dist/santy-animations.css` | 53KB | 120+ animations only |
| `dist/santy.css` | 868KB | Everything — full unminified bundle |
| `dist/santy.min.css` | 758KB | Minified full bundle (purge with PostCSS/Vite → ~15KB) |
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
- 🌊 Webflow: [santycss.santy.in/webflow.html](https://santycss.santy.in/webflow.html)
- 🎬 Animations: [santycss.santy.in/animations.html](https://santycss.santy.in/animations.html)
- 🎮 Live Demo: [santycss.santy.in/demo.html](https://santycss.santy.in/demo.html)
- 📦 npm Docs: [santycss.santy.in/docs.html](https://santycss.santy.in/docs.html)
- 🐛 Issues: [github.com/ChintuSanty/santyCSS/issues](https://github.com/ChintuSanty/santyCSS/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/ChintuSanty/santyCSS/discussions/1)

---

## License

MIT © [Santy](https://github.com/ChintuSanty)
