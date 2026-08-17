/**
 * SantyCSS — type declarations for the main entry point.
 *
 *   const santy = require('santycss');
 *   santy.css  →  absolute path to dist/santy.css
 */

/** Absolute filesystem paths to the bundled CSS/JS/JSON assets. */
declare const santy: {
  /** dist/santy.css — the full framework bundle */
  css: string;
  /** dist/santy.min.css — minified full bundle */
  min: string;
  /** dist/santy-start.css — CDN drop-in: base + components */
  start: string;
  /** dist/santy-core.css — utilities only, no extended variants */
  core: string;
  /** dist/santy-variants.css — extended responsive/state variants */
  variants: string;
  /** dist/santy-components.css — pre-built UI components */
  components: string;
  /** dist/santy-animations.css — keyframe animations */
  animations: string;
  /** dist/santy-email.css — email-safe styles */
  email: string;
  /** dist/santy-themes.css — prebuilt data-theme presets */
  themes: string;
  /** dist/santy-reset.css — CSS reset + design tokens */
  reset: string;
  /** dist/santy-layout.css */
  layout: string;
  /** dist/santy-flex.css */
  flex: string;
  /** dist/santy-grid.css */
  grid: string;
  /** dist/santy-spacing.css */
  spacing: string;
  /** dist/santy-sizing.css */
  sizing: string;
  /** dist/santy-typography.css */
  typography: string;
  /** dist/santy-colors.css */
  colors: string;
  /** dist/santy-borders.css */
  borders: string;
  /** dist/santy-effects.css */
  effects: string;
  /** dist/santy-classmap.json — every generated class name */
  classmap: string;

  /** Remove unused classes from a CSS string. `content` is file paths or raw markup. */
  purge: (options: {
    css: string;
    content?: string[];
    safelist?: string[];
    minifyOutput?: boolean;
  }) => santy.PurgeResult;
  /** Purge a CSS file based on the classes found under the given directories. */
  purgeFiles: (options?: {
    cssFile?: string;
    inputDirs?: string[];
    safelist?: string[];
    minifyOutput?: boolean;
  }) => santy.PurgeResult;
  /** Extract class names from HTML/JS/JSX source text. */
  extractClasses: (source: string) => Set<string>;
  /** Minify a CSS string. */
  minify: (css: string) => string;
  /** File extensions scanned by the purger. */
  EXTS: string[];
};

declare namespace santy {
  interface PurgeResult {
    css: string;
    stats: {
      classesFound: number;
      rulesKept: number;
      rulesDropped: number;
      originalSize: number;
      outputSize: number;
    };
  }

  /**
   * Shape of an optional `santy.config.json` consumed by `npx santycss build`
   * (and `node build.js` in a repo checkout).
   */
  interface SantyConfig {
    /** Extend/override the color palette. A string applies the hex to every shade. */
    colors?: Record<string, string | Partial<Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>>>;
    /** Extra spacing values (px) added to the scale. */
    spacing?: number[];
    /** Extra font-size values (px). */
    fontSizes?: number[];
    /** Extend/override breakpoints, e.g. { "tablet-up": "(min-width: 900px)" }. */
    breakpoints?: Record<string, string>;
    /** Prefix applied to every generated class name, e.g. "sty-". */
    prefix?: string;
    /** Directory the build writes to (relative to the working directory). */
    output?: string;
  }
}

export = santy;
