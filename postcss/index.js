'use strict';
/**
 * postcss-santycss
 *
 * PostCSS plugin that purges unused SantyCSS utilities.
 *
 * Usage in postcss.config.js:
 *
 *   const santycss = require('santycss/postcss');
 *
 *   module.exports = {
 *     plugins: [
 *       santycss({
 *         content: ['./src/**\/*.{html,js,jsx,ts,tsx,vue,svelte}'],
 *         safelist: ['animate-spin', 'make-hidden'],
 *       }),
 *     ],
 *   };
 */

const path = require('path');
const fs   = require('fs');
const { purge, extractClasses, EXTS } = require('../lib/purge-core');

function expandGlobs(patterns) {
  const files = [];
  for (const pat of patterns) {
    if (!pat.includes('*')) {
      if (fs.existsSync(pat)) files.push(pat);
      continue;
    }
    const parts  = pat.split(/[/\\]/);
    const base   = parts.slice(0, parts.findIndex(p => p.includes('*'))).join('/') || '.';
    const extMatch = pat.match(/\.([\w,{}]+)$/);
    const exts   = extMatch ? extMatch[1].replace(/[{}]/g,'').split(',') : EXTS;
    function walk(dir) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = dir + '/' + entry.name;
        if (entry.isDirectory()) walk(full);
        else if (exts.some(e => entry.name.endsWith('.' + e))) files.push(full);
      }
    }
    walk(base);
  }
  return [...new Set(files)];
}

module.exports = (opts = {}) => {
  const { content = [], safelist = [], sourceFile = null } = opts;

  return {
    postcssPlugin: 'postcss-santycss',
    async Once(root, { result }) {
      const files = expandGlobs(content);
      if (!files.length && !sourceFile) return;

      const sourceCSS = sourceFile
        ? fs.readFileSync(sourceFile, 'utf8')
        : fs.readFileSync(path.join(__dirname, '../dist/santy.css'), 'utf8');

      const html = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
      const purged = purge(sourceCSS, html, { safelist });

      root.removeAll();
      const postcss = require('postcss');
      const parsed  = postcss.parse(purged);
      parsed.each(node => root.append(node.clone()));

      result.messages.push({
        type: 'santycss',
        plugin: 'postcss-santycss',
        text: `Purged to ${(purged.length / 1024).toFixed(1)}KB from ${files.length} files`,
      });
    },
  };
};

module.exports.postcss = true;
