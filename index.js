/**
 * SantyCSS — main entry point
 *
 * CSS path helpers:
 *   const santy = require('santycss');
 *   santy.css        → absolute path to dist/santy.css
 *   santy.min        → absolute path to dist/santy.min.css
 *   santy.core       → absolute path to dist/santy-core.css
 *   santy.components → absolute path to dist/santy-components.css
 *   santy.animations → absolute path to dist/santy-animations.css
 *
 * Import CSS directly (React / Vue / Vite / Next.js):
 *   import 'santycss/css';
 *   import 'santycss/css/core';
 *   import 'santycss/css/components';
 *   import 'santycss/css/animations';
 *
 * Purge / tree-shake:
 *   const { purge, purgeFiles } = require('santycss');
 */
'use strict';

const path = require('path');
const dist = path.join(__dirname, 'dist');

// Path helpers (useful for webpack / rollup config)
const css        = path.join(dist, 'santy.css');
const min        = path.join(dist, 'santy.min.css');
const core       = path.join(dist, 'santy-core.css');
const components = path.join(dist, 'santy-components.css');
const animations = path.join(dist, 'santy-animations.css');
const email      = path.join(dist, 'santy-email.css');

// Purge API (tree-shaking)
const { purge, purgeFiles, extractClasses, minify, EXTS } = require('./lib/purge-core');

module.exports = {
  // CSS paths
  css,
  min,
  core,
  components,
  animations,
  email,

  // Purge API
  purge,
  purgeFiles,
  extractClasses,
  minify,
  EXTS,
};
