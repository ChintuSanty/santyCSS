'use strict';
/**
 * vite-plugin-santycss
 *
 * Vite plugin — purges unused SantyCSS classes at build time.
 * In dev mode it serves the full santy.css for instant class availability.
 * In build mode it purges and inlines only used classes.
 *
 * Usage in vite.config.js:
 *
 *   import santycss from './vite-plugin-santycss.js';
 *
 *   export default {
 *     plugins: [
 *       santycss({
 *         content: ['./src/**\/*.{html,jsx,tsx,vue,svelte}'],
 *         safelist: ['make-hidden', 'animate-spin'],
 *       })
 *     ]
 *   };
 *
 * Usage in vite.config.ts (with types):
 *
 *   import santycss from './vite-plugin-santycss.js';
 *   // same as above
 */

const path = require('path');
const fs   = require('fs');

function loadCore() {
  return require('./lib/purge-core');
}

function expandGlobs(patterns) {
  const { walkDir, EXTS } = loadCore();
  const files = [];
  for (const pattern of patterns) {
    if (fs.existsSync(pattern) && fs.statSync(pattern).isFile()) {
      files.push(pattern);
      continue;
    }
    if (!pattern.includes('*')) {
      walkDir(pattern, files);
      continue;
    }
    const parts   = pattern.split(/[/\\]/);
    const starIdx = parts.findIndex(p => p.includes('*'));
    const baseDir = parts.slice(0, starIdx).join('/') || '.';
    const extMatch = pattern.match(/\.\w+$/);
    const exts = extMatch ? [extMatch[0]] : EXTS;
    const all  = [];
    walkDir(baseDir, all);
    all.filter(f => exts.includes(path.extname(f).toLowerCase())).forEach(f => files.push(f));
  }
  return [...new Set(files)];
}

module.exports = function santycssVitePlugin(opts = {}) {
  const {
    content    = [],
    safelist   = [],
    cssFile    = path.resolve(__dirname, 'santy.css'),
    devMode    = 'full',   // 'full' = serve full CSS in dev | 'purge' = always purge
  } = opts;

  let isBuild = false;
  let fullCSS  = '';

  return {
    name: 'vite-plugin-santycss',
    enforce: 'pre',

    configResolved(config) {
      isBuild = config.command === 'build';
      if (fs.existsSync(cssFile)) {
        fullCSS = fs.readFileSync(cssFile, 'utf8');
      } else {
        config.logger.warn(`[santycss] Cannot find ${cssFile}. Run: node build.js`);
      }
    },

    // Intercept import of santy.css and serve the correct version
    resolveId(id) {
      if (id.endsWith('santy.css')) return '\0virtual:santy.css';
    },

    load(id) {
      if (id !== '\0virtual:santy.css') return;

      if (!isBuild && devMode === 'full') {
        // Dev: serve full CSS — every class available instantly
        return `/* SantyCSS — full (dev) */\n${fullCSS}`;
      }

      // Build (or devMode=purge): scan and purge
      const { purge } = loadCore();
      const files = expandGlobs(Array.isArray(content) ? content : [content]);

      if (files.length === 0) {
        console.warn('[santycss] No content files found. Serving full CSS.');
        return fullCSS;
      }

      const { css: purgedCSS, stats } = purge({
        css:          fullCSS,
        content:      files,
        safelist,
        minifyOutput: true,
      });

      const pct = (((stats.originalSize - stats.outputSize) / stats.originalSize) * 100).toFixed(1);
      console.log(`\n  [santycss] Purged: ${(stats.originalSize/1024).toFixed(1)} KB → ${(stats.outputSize/1024).toFixed(1)} KB (${pct}% smaller)\n`);

      return `/* SantyCSS — purged */\n${purgedCSS}`;
    },

    // Hot reload: when a source file changes in dev, trigger CSS reload
    handleHotUpdate({ file, server }) {
      const { EXTS } = loadCore();
      if (EXTS.includes(path.extname(file))) {
        const mod = server.moduleGraph.getModuleById('\0virtual:santy.css');
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
};
