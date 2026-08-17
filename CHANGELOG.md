# Changelog

All notable changes to SantyCSS are documented here.
The full illustrated changelog lives at [santycss.santy.in/changelog.html](https://santycss.santy.in/changelog.html).

## [2.8.0] — 2026-08-17

### Added
- **Configuration system** — optional `santy.config.json` (consumed by `node build.js`
  and the new `npx santycss build` command) with support for:
  - `colors` — extend/override the palette with brand colors (single hex or full shade map)
  - `spacing` / `fontSizes` — extra scale values
  - `breakpoints` — custom responsive prefixes
  - `prefix` — class prefix (e.g. `sty-`) to avoid collisions in legacy codebases
  - `output` — output directory for custom builds
- **`npx santycss build`** — build a customized framework from `santy.config.json`
  without cloning the repo (writes to `./santy-dist` by default).
- **ARIA variants** — `aria-expanded:` `aria-selected:` `aria-checked:` `aria-pressed:`
  `aria-disabled:` `aria-current:` `aria-hidden:` `aria-busy:` `aria-invalid:` plus
  `group-aria-*:` for styling children from an ancestor's ARIA state.
- **RTL/LTR variants** — `rtl:` and `ltr:` prefixes keyed off `<html dir="rtl|ltr">`.
- **Max-width breakpoints** — `max-sm:` `max-md:` `max-lg:` `max-xl:` `max-xxl:`
  (apply *below* the breakpoint, Tailwind-style).
- **TypeScript declarations** — `index.d.ts` for the main entry point and the
  `santy.config.json` shape.
- `LICENSE` (MIT), `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`.
- **CI workflow** — every push/PR now builds, runs the test suite, type-checks the
  declarations, and verifies the committed CSS matches `build.js` output.

### Changed
- npm publish workflow now runs the test suite before publishing.
- CLI starter page and docs pin the CDN to the current major (`santycss@2`).
- `prepublish` script replaced with `prepublishOnly` (build + test).

## [2.7.0] — 2026-07

### Added
- `:has()` parent variants — `has-checked:` `has-focus:` `has-hover:` `has-invalid:`
  and 6 more, plus `group-has-*:`.
- 9 new components: `.toast`, `.switch`, `.checkbox`, `.radio`, `.range`, `.carousel`,
  `.dialog`, `.popover`, `.file-drop` — all with dark-mode styles.
- Semantic theming: 5 prebuilt themes (`ocean`, `sunset`, `forest`, `midnight`, `mono`)
  via `data-theme`, with semantic utilities (`background-surface`, `color-text`, …).
- `npx santycss init` starter scaffold; `santy-classmap.json` (21,000+ classes);
  83-check regression test suite.

### Fixed
- `transition-all` was documented but never generated; templates page Copy Code now
  rewrites local CSS paths to CDN URLs.

## [2.6.1] — 2026-06
- 4 new industry templates (school, salon, eye clinic, brewery).

## [2.6.0] — 2026-06
- Granular module imports (`santycss/css/flex`, `santycss/css/spacing`, …) —
  10 module files with package export subpaths.

## [2.5.1] — 2026-05
- Interactive snippets library (`snippets.html`) with 40+ ready-to-use snippets.

## [2.5.0] — 2026-05
- Three portfolio templates and supporting component classes.

## [2.4.x and earlier]
See [santycss.santy.in/changelog.html](https://santycss.santy.in/changelog.html).
