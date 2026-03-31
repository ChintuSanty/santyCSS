#!/usr/bin/env node
/**
 * Fetches Bootstrap icons, saves SVG files and generates CSS entries.
 * Run: node scripts/fetch-bootstrap-icons.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

const ICONS = [
  '0-circle','0-circle-fill','0-square','0-square-fill',
  '1-circle','1-circle-fill','1-square','1-square-fill',
  '123',
  '2-circle','2-circle-fill','2-square','2-square-fill',
  '3-circle','3-circle-fill','3-square','3-square-fill',
  '4-circle','4-circle-fill','4-square','4-square-fill',
  '5-circle','5-circle-fill','5-square','5-square-fill',
  '6-circle','6-circle-fill','6-square','6-square-fill',
  '7-circle','7-circle-fill','7-square','7-square-fill',
  '8-circle','8-circle-fill','8-square','8-square-fill',
  '9-circle','9-circle-fill','9-square','9-square-fill',
  'activity',
  'airplane','airplane-engines','airplane-engines-fill','airplane-fill',
  'alarm','alarm-fill',
  'alexa',
  'align-bottom','align-center','align-end','align-middle','align-start','align-top',
  'alipay',
  'alphabet','alphabet-uppercase',
  'alt',
  'amazon','amd',
  'android','android2',
  'anthropic',
  'app','app-indicator',
  'apple','apple-music',
  'archive','archive-fill',
  'arrow-90deg-down','arrow-90deg-left','arrow-90deg-right','arrow-90deg-up',
  'arrow-bar-down','arrow-bar-left','arrow-bar-right','arrow-bar-up',
  'arrow-clockwise','arrow-counterclockwise',
  'arrow-down','arrow-down-circle','arrow-down-circle-fill',
  'arrow-down-left','arrow-down-left-circle','arrow-down-left-circle-fill',
  'arrow-down-left-square','arrow-down-left-square-fill',
  'arrow-down-right','arrow-down-right-circle','arrow-down-right-circle-fill',
  'arrow-down-right-square','arrow-down-right-square-fill',
  'arrow-down-short','arrow-down-square','arrow-down-square-fill','arrow-down-up',
  'arrow-left','arrow-left-circle','arrow-left-circle-fill'
];

const SVG_DIR = path.join(__dirname, '..', 'icons', 'bootstrap');
if (!fs.existsSync(SVG_DIR)) fs.mkdirSync(SVG_DIR, { recursive: true });

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

function encodeForCSS(svg) {
  // Minimal encoding needed for url("...") in CSS
  return svg
    .replace(/\n\s*/g, ' ')
    .replace(/"/g, "'")
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .trim();
}

function toCSSName(name) {
  // SantyCSS convention: .icon-{name}
  return `icon-${name}`;
}

async function main() {
  const cssLines = ['\n/* ── Bootstrap Icons ── */\n'];
  const ok = [];
  const fail = [];

  for (const name of ICONS) {
    const url = `https://raw.githubusercontent.com/twbs/icons/main/icons/${name}.svg`;
    try {
      const { status, body } = await fetch(url);
      if (status !== 200 || !body.includes('<svg')) {
        fail.push(name);
        console.log(`  ✗  ${name}  (${status})`);
        continue;
      }

      // Save SVG file
      fs.writeFileSync(path.join(SVG_DIR, `${name}.svg`), body, 'utf8');

      // Build CSS data URI — strip outer <svg> wrapper, rebuild lean version
      // Extract inner content
      const inner = body
        .replace(/<svg[^>]*>/, '')
        .replace(/<\/svg>/, '')
        .trim();

      const svgForCSS = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>${inner}</svg>`;
      const encoded = encodeForCSS(svgForCSS);
      const className = toCSSName(name);

      cssLines.push(`.${className} { --icon-url: url("data:image/svg+xml,${encoded}"); }`);
      ok.push(name);
      console.log(`  ✔  ${name}`);
    } catch (e) {
      fail.push(name);
      console.log(`  ✗  ${name}  (${e.message})`);
    }

    // Small delay to be polite to GitHub raw CDN
    await new Promise(r => setTimeout(r, 80));
  }

  // Write CSS block to a temp file — we'll manually append to santy-icons.css
  const outCSS = path.join(__dirname, '..', 'icons', 'bootstrap', '_bootstrap-icons.css');
  fs.writeFileSync(outCSS, cssLines.join('\n') + '\n', 'utf8');

  console.log(`\n  Done — ${ok.length} ok, ${fail.length} failed`);
  if (fail.length) console.log('  Failed:', fail.join(', '));
  console.log(`  CSS written to: icons/bootstrap/_bootstrap-icons.css`);
  console.log(`  SVGs saved to:  icons/bootstrap/`);
}

main().catch(console.error);
