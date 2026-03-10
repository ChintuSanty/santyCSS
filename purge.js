#!/usr/bin/env node
/**
 * SantyCSS CLI Purger  —  node purge.js [options]
 *
 *   --input=<dir>        Directories to scan (default: .)
 *   --out=<file>         Output file (default: santy.min.css)
 *   --css=<file>         Source CSS (default: santy.css)
 *   --keep=<a,b,c>       Always-include class names
 *   --safelist=<file>    JSON file ["class1","class2",...]
 *   --verbose            List every class found
 *   --stats              Print stats only, no file written
 *   --no-minify          Write readable (un-minified) output
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { purge, walkDir, EXTS } = require('./lib/purge-core');

// ─── Parse CLI args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg  = (k, def) => { const m = args.find(a => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : def; };
const hasFlag = (k) => args.includes(`--${k}`);

const inputDirs  = getArg('input', '.').split(',').map(d => d.trim());
const outFile    = getArg('out', 'santy.min.css');
const cssFile    = getArg('css', 'santy.css');
const keepArg    = getArg('keep', '');
const safeFile   = getArg('safelist', '');
const verbose    = hasFlag('verbose');
const statsOnly  = hasFlag('stats');
const noMinify   = hasFlag('no-minify');

// ─── Load source CSS ──────────────────────────────────────────────────────────
if (!fs.existsSync(cssFile)) {
  console.error(`❌  Cannot find ${cssFile}. Run: node build.js first.`);
  process.exit(1);
}
const css = fs.readFileSync(cssFile, 'utf8');

// ─── Safelist ─────────────────────────────────────────────────────────────────
const safelist = [];
if (safeFile && fs.existsSync(safeFile)) {
  JSON.parse(fs.readFileSync(safeFile, 'utf8')).forEach(c => safelist.push(c));
}
if (keepArg) keepArg.split(',').map(c => c.trim()).filter(Boolean).forEach(c => safelist.push(c));

// ─── Collect files ────────────────────────────────────────────────────────────
const allFiles = [];
inputDirs.forEach(d => walkDir(d, allFiles));
const sourceFiles = allFiles.filter(f => EXTS.includes(path.extname(f).toLowerCase()));

if (sourceFiles.length === 0) {
  console.warn('⚠️  No source files found. Writing full CSS instead.');
  fs.writeFileSync(outFile, css, 'utf8');
  process.exit(0);
}

// ─── Run purge ────────────────────────────────────────────────────────────────
const { css: output, stats } = purge({ css, content: sourceFiles, safelist, minifyOutput: !noMinify });

// ─── Stats ────────────────────────────────────────────────────────────────────
const estGzip  = Math.round(stats.outputSize * 0.15);
const reduction = (((stats.originalSize - stats.outputSize) / stats.originalSize) * 100).toFixed(1);

console.log('\n📦  SantyCSS Purge Report');
console.log('─'.repeat(46));
console.log(`  Source files scanned  : ${sourceFiles.length}`);
console.log(`  Unique classes found  : ${stats.classesFound}`);
console.log(`  Rules kept            : ${stats.rulesKept}`);
console.log(`  Rules dropped         : ${stats.rulesDropped}`);
console.log('─'.repeat(46));
console.log(`  Original size   : ${(stats.originalSize/1024).toFixed(1)} KB`);
console.log(`  Purged size     : ${(stats.outputSize/1024).toFixed(1)} KB`);
console.log(`  Est. gzip       : ~${(estGzip/1024).toFixed(1)} KB`);
console.log(`  Reduction       : ${reduction}% smaller`);
console.log('─'.repeat(46));

if (verbose) {
  // Re-extract for display (stats don't store them)
  const { extractClasses } = require('./lib/purge-core');
  const all = new Set(safelist);
  sourceFiles.forEach(f => {
    const text = fs.readFileSync(f, 'utf8');
    extractClasses(text).forEach(c => all.add(c));
  });
  console.log('\nClasses found in source:');
  [...all].sort().forEach(c => console.log('   ', c));
}

if (statsOnly) {
  console.log('\n(--stats: no file written)\n');
  process.exit(0);
}

fs.writeFileSync(outFile, output, 'utf8');
console.log(`\n✅  Written → ${outFile}\n`);
