/**
 * SantyCSS — main entry point
 *
 * CSS path helpers:
 *   const santy = require('santycss');
 *   santy.css        → absolute path to dist/santy.css
 *   santy.core       → absolute path to dist/santy-core.css
 *   santy.components → absolute path to dist/santy-components.css
 *   santy.animations → absolute path to dist/santy-animations.css
 *
 * Granular module imports (React / Vue / Vite / Next.js):
 *   import 'santycss/css/reset';      // CSS reset + design tokens
 *   import 'santycss/css/layout';     // display, position, overflow, z-index, flex, grid helpers
 *   import 'santycss/css/flex';       // flexbox utilities
 *   import 'santycss/css/grid';       // CSS grid utilities
 *   import 'santycss/css/spacing';    // padding & margin
 *   import 'santycss/css/sizing';     // width & height
 *   import 'santycss/css/typography'; // font size, weight, family, text alignment
 *   import 'santycss/css/colors';     // text, background & border colors
 *   import 'santycss/css/borders';    // border width, style & radius
 *   import 'santycss/css/effects';    // opacity, shadows, filters, transitions, cursor
 *   import 'santycss/css/animations'; // keyframe animations
 *   import 'santycss/css/components'; // pre-built UI components
 *   import 'santycss/css/variants';   // responsive & state variants (hover, dark, md, lg…)
 *
 * Full bundles:
 *   import 'santycss/css';            // everything (1.2MB)
 *   import 'santycss/css/core';       // utilities only, no components
 *   import 'santycss/css/start';      // core + components, no extended variants
 *
 * Purge / tree-shake:
 *   const { purge, purgeFiles } = require('santycss');
 */
'use strict';

const path = require('path');
const dist = path.join(__dirname, 'dist');

// Full bundle paths
const css        = path.join(dist, 'santy.css');
const min        = path.join(dist, 'santy.min.css');
const core       = path.join(dist, 'santy-core.css');
const start      = path.join(dist, 'santy-start.css');
const components = path.join(dist, 'santy-components.css');
const animations = path.join(dist, 'santy-animations.css');
const variants   = path.join(dist, 'santy-variants.css');
const email      = path.join(dist, 'santy-email.css');

// Granular module paths
const reset      = path.join(dist, 'santy-reset.css');
const layout     = path.join(dist, 'santy-layout.css');
const flex       = path.join(dist, 'santy-flex.css');
const grid       = path.join(dist, 'santy-grid.css');
const spacing    = path.join(dist, 'santy-spacing.css');
const sizing     = path.join(dist, 'santy-sizing.css');
const typography = path.join(dist, 'santy-typography.css');
const colors     = path.join(dist, 'santy-colors.css');
const borders    = path.join(dist, 'santy-borders.css');
const effects    = path.join(dist, 'santy-effects.css');

// Purge API (tree-shaking)
const { purge, purgeFiles, extractClasses, minify, EXTS } = require('./lib/purge-core');

module.exports = {
  // Full bundles
  css, min, core, start, components, animations, variants, email,

  // Granular modules
  reset, layout, flex, grid, spacing, sizing, typography, colors, borders, effects,

  // Purge API
  purge, purgeFiles, extractClasses, minify, EXTS,
};
