'use strict';
/**
 * SantyCSS — core purge engine (used by CLI, PostCSS plugin, and Vite plugin)
 */

const fs = require('fs');
const path = require('path');

const EXTS = ['.html','.js','.jsx','.ts','.tsx','.vue','.svelte','.njk','.hbs','.pug','.php','.astro','.mdx','.md'];
const SKIP  = new Set(['build.js','purge.js','postcss.config.js','postcss.config.cjs','vite.config.js','vite.config.ts','webpack.config.js','next.config.js','nuxt.config.js','nuxt.config.ts']);

// ─── File walker ──────────────────────────────────────────────────────────────
function walkDir(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (!SKIP.has(path.basename(dir))) files.push(dir);
    return files;
  }
  for (const entry of fs.readdirSync(dir)) {
    if (['node_modules','.git','dist','.next','.nuxt','.output','build','__pycache__','.svelte-kit'].includes(entry)) continue;
    walkDir(path.join(dir, entry), files);
  }
  return files;
}

// ─── Class extractor ──────────────────────────────────────────────────────────
const CLASS_ATTR  = /class(?:Name)?=(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;
const BARE_STRING = /["'`]([\w][\w\-:/]+)["'`]/g;

function extractClasses(content) {
  const found = new Set();

  // 1. class="..." / className="..." / class='...' / class=`...`
  CLASS_ATTR.lastIndex = 0;
  let m;
  while ((m = CLASS_ATTR.exec(content)) !== null) {
    const raw = (m[1] || m[2] || m[3] || '').trim();
    raw.split(/\s+/).forEach(c => c && found.add(c.trim()));
  }

  // 2. Dynamic: clsx(['foo','bar']), cn('a','b'), classList.add('x')
  //    Match any quoted string that looks like a CSS class (has a dash, no spaces)
  BARE_STRING.lastIndex = 0;
  while ((m = BARE_STRING.exec(content)) !== null) {
    const c = m[1].trim();
    if (c.includes('-') && !c.includes(' ')) found.add(c);
  }

  // 3. Template literals: `make-flex ${condition ? 'add-padding-16' : 'add-padding-8'}`
  const tpl = content.match(/`[^`]+`/g) || [];
  tpl.forEach(t => {
    t.split(/\s+|\$\{[^}]+\}/).forEach(part => {
      const c = part.replace(/[`'"]/g, '').trim();
      if (c && c.includes('-')) found.add(c);
    });
  });

  return found;
}

// ─── CSS parser ───────────────────────────────────────────────────────────────
function parseCSS(css) {
  const blocks = [];
  let i = 0, len = css.length;

  while (i < len) {
    while (i < len && /\s/.test(css[i])) i++;
    if (i >= len) break;

    if (css[i] === '/' && css[i+1] === '*') {
      const end = css.indexOf('*/', i + 2);
      if (end === -1) break;
      blocks.push({ type: 'comment', raw: css.slice(i, end + 2) });
      i = end + 2;
      continue;
    }

    if (css[i] === '@' || css.slice(i, i+5) === ':root') {
      let bs = i;
      while (bs < len && css[bs] !== '{' && css[bs] !== ';') bs++;
      if (bs >= len) break;
      if (css[bs] === ';') { blocks.push({ type: 'at-simple', raw: css.slice(i, bs + 1) }); i = bs + 1; continue; }
      let depth = 0, j = bs;
      while (j < len) {
        if (css[j] === '{') depth++;
        else if (css[j] === '}' && --depth === 0) { j++; break; }
        j++;
      }
      blocks.push({ type: 'at-block', raw: css.slice(i, j) });
      i = j;
      continue;
    }

    let bs = i;
    while (bs < len && css[bs] !== '{') bs++;
    if (bs >= len) break;
    let be = bs;
    while (be < len && css[be] !== '}') be++;
    if (be >= len) break;
    blocks.push({ type: 'rule', selector: css.slice(i, bs).trim(), raw: css.slice(i, be + 1) });
    i = be + 1;
  }
  return blocks;
}

// ─── Selector usage check ─────────────────────────────────────────────────────
const BASE_SELECTORS = ['*', ':root', 'html', 'body', ':before', ':after', '::before', '::after'];

function selectorUsed(selector, usedSet) {
  if (BASE_SELECTORS.some(s => selector.includes(s))) return true;
  const classMatches = selector.match(/\.([\w\-\\:]+)/g);
  if (!classMatches) return true; // non-class selector — keep
  return classMatches.some(cm => usedSet.has(cm.slice(1).replace(/\\/g, '')));
}

// ─── @media / @keyframes filter ──────────────────────────────────────────────
function filterAtBlock(raw, usedSet) {
  const headerMatch = raw.match(/^([^{]+)\{/);
  if (!headerMatch) return raw;
  const atRule = headerMatch[1].trim();

  // Always keep keyframes, font-face
  if (atRule.startsWith('@keyframes') || atRule.startsWith('@font-face')) return raw;

  // :root block — always keep
  if (atRule.startsWith(':root')) return raw;

  // For @media — filter inner rules
  const innerStart = raw.indexOf('{') + 1;
  const innerEnd   = raw.lastIndexOf('}');
  const inner      = raw.slice(innerStart, innerEnd);

  const kept = [];
  const ruleRe = /([^{]+)\{([^}]+)\}/g;
  let m;
  while ((m = ruleRe.exec(inner)) !== null) {
    if (selectorUsed(m[1].trim(), usedSet)) {
      kept.push(`  ${m[1].trim()} { ${m[2].trim()} }`);
    }
  }
  return kept.length ? `${atRule} {\n${kept.join('\n')}\n}` : null;
}

// ─── Minifier ─────────────────────────────────────────────────────────────────
function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

// ─── Main purge function ──────────────────────────────────────────────────────
/**
 * @param {object} opts
 * @param {string}   opts.css         Full source CSS string (santy.css contents)
 * @param {string[]} opts.content     Array of file paths OR raw content strings to scan
 * @param {string[]} [opts.safelist]  Class names to always keep
 * @param {boolean}  [opts.minify]    Minify output (default true)
 * @returns {{ css: string, stats: object }}
 */
function purge({ css, content = [], safelist = [], minifyOutput = true }) {
  const usedClasses = new Set(safelist);

  for (const item of content) {
    // item is either a file path or raw content
    let text = item;
    if (typeof item === 'string' && fs.existsSync(item) && !item.includes('\n')) {
      try { text = fs.readFileSync(item, 'utf8'); } catch (_) { text = item; }
    }
    extractClasses(text).forEach(c => usedClasses.add(c));
  }

  const blocks = parseCSS(css);
  const kept = [];
  let keptRules = 0, droppedRules = 0;

  for (const block of blocks) {
    if (block.type === 'comment')  { kept.push(block.raw); continue; }
    if (block.type === 'at-simple'){ kept.push(block.raw); continue; }

    if (block.type === 'at-block') {
      const filtered = filterAtBlock(block.raw, usedClasses);
      if (filtered) { kept.push(filtered); keptRules++; }
      else droppedRules++;
      continue;
    }

    if (block.type === 'rule') {
      if (selectorUsed(block.selector, usedClasses)) {
        kept.push(block.raw); keptRules++;
      } else droppedRules++;
    }
  }

  const rawOutput = kept.join('\n');
  const output    = minifyOutput ? minify(rawOutput) : rawOutput;

  return {
    css: output,
    stats: {
      classesFound: usedClasses.size,
      rulesKept:    keptRules,
      rulesDropped: droppedRules,
      originalSize: Buffer.byteLength(css, 'utf8'),
      outputSize:   Buffer.byteLength(output, 'utf8'),
    }
  };
}

// ─── File-based helper ────────────────────────────────────────────────────────
function purgeFiles({ cssFile = 'santy.css', inputDirs = ['.'], safelist = [], minifyOutput = true } = {}) {
  const css = fs.readFileSync(cssFile, 'utf8');
  const files = [];
  inputDirs.forEach(d => walkDir(d, files));
  const sourceFiles = files.filter(f => EXTS.includes(path.extname(f).toLowerCase()));
  return purge({ css, content: sourceFiles, safelist, minifyOutput });
}

module.exports = { purge, purgeFiles, extractClasses, walkDir, minify, EXTS };
