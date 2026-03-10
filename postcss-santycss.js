'use strict';
/**
 * postcss-santycss
 *
 * PostCSS plugin that purges unused SantyCSS utilities — works exactly like
 * @fullhuman/postcss-purgecss / Tailwind's built-in purge.
 *
 * Usage in postcss.config.js:
 *
 *   const santycss = require('./postcss-santycss');
 *
 *   module.exports = {
 *     plugins: [
 *       santycss({
 *         content: ['./src/**\/*.{html,js,jsx,ts,tsx,vue,svelte}'],
 *         safelist: ['animate-spin', 'make-hidden'],
 *       }),
 *     ],
 *   };
 *
 * Works with:  Webpack, Vite (via vite-plugin-postcss), Parcel, Rollup, Next.js, Nuxt, etc.
 */

const path = require('path');
const fs   = require('fs');
const { purge, extractClasses, EXTS, minify } = require('./lib/purge-core');

// Expand glob-like patterns (simple ** support without extra deps)
function expandGlobs(patterns) {
  const files = [];
  for (const pattern of patterns) {
    if (fs.existsSync(pattern) && fs.statSync(pattern).isFile()) {
      files.push(pattern);
      continue;
    }
    // If pattern has no glob chars, treat as dir
    if (!pattern.includes('*') && !pattern.includes('?')) {
      const { walkDir } = require('./lib/purge-core');
      walkDir(pattern, files);
      continue;
    }
    // Resolve ** globs by walking the base dir and matching extension
    const parts  = pattern.split(/[/\\]/);
    const starIdx = parts.findIndex(p => p.includes('*'));
    const baseDir = parts.slice(0, starIdx).join('/') || '.';
    const extMatch = pattern.match(/\.\w+$/);
    const exts = extMatch
      ? [extMatch[0]]
      : EXTS;

    const { walkDir } = require('./lib/purge-core');
    const allFiles = [];
    walkDir(baseDir, allFiles);
    allFiles
      .filter(f => exts.includes(path.extname(f).toLowerCase()))
      .forEach(f => files.push(f));
  }
  return [...new Set(files)];
}

const plugin = (opts = {}) => {
  const {
    content  = [],     // glob patterns or file paths
    safelist = [],     // always-include class names
    enable   = process.env.NODE_ENV === 'production', // purge in production only by default
    always   = false,  // set true to always purge regardless of NODE_ENV
  } = opts;

  const shouldPurge = always || enable;

  return {
    postcssPlugin: 'postcss-santycss',

    async Once(root, { result }) {
      if (!shouldPurge) return; // skip in development

      // Collect full CSS string from this PostCSS run
      const css = root.toResult().css;

      // Expand content patterns to file paths
      const files = expandGlobs(Array.isArray(content) ? content : [content]);

      if (files.length === 0) {
        result.warn('postcss-santycss: no content files found to scan. Skipping purge.');
        return;
      }

      // Run purge
      const { css: purgedCSS, stats } = purge({
        css,
        content: files,
        safelist,
        minifyOutput: true,
      });

      // Replace the entire CSS tree with purged output
      root.removeAll();
      const postcss = require('postcss');
      const newRoot  = postcss.parse(purgedCSS);
      newRoot.each(node => root.append(node.clone()));

      // Attach stats to result messages
      result.messages.push({
        type:    'santycss-stats',
        plugin:  'postcss-santycss',
        ...stats,
      });

      const pct = (((stats.originalSize - stats.outputSize) / stats.originalSize) * 100).toFixed(1);
      console.log(`\n  [santycss] Purged: ${(stats.originalSize/1024).toFixed(1)} KB → ${(stats.outputSize/1024).toFixed(1)} KB (${pct}% smaller)`);
    },
  };
};

plugin.postcss = true;
module.exports = plugin;
