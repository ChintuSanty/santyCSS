#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

const ICONS = [
  'arrow-left-right','arrow-left-short','arrow-left-square','arrow-left-square-fill',
  'arrow-repeat','arrow-return-left','arrow-return-right',
  'arrow-right','arrow-right-circle','arrow-right-circle-fill','arrow-right-short',
  'arrow-right-square','arrow-right-square-fill',
  'arrow-through-heart','arrow-through-heart-fill',
  'arrow-up','arrow-up-circle','arrow-up-circle-fill',
  'arrow-up-left','arrow-up-left-circle','arrow-up-left-circle-fill',
  'arrow-up-left-square','arrow-up-left-square-fill',
  'arrow-up-right','arrow-up-right-circle','arrow-up-right-circle-fill',
  'arrow-up-right-square','arrow-up-right-square-fill',
  'arrow-up-short','arrow-up-square','arrow-up-square-fill',
  'arrows','arrows-angle-contract','arrows-angle-expand',
  'arrows-collapse','arrows-collapse-vertical','arrows-expand','arrows-expand-vertical',
  'arrows-fullscreen','arrows-move','arrows-vertical',
  'aspect-ratio','aspect-ratio-fill','asterisk','at','award','award-fill',
  'back','backpack','backpack-fill','backpack2','backpack2-fill',
  'backpack3','backpack3-fill','backpack4','backpack4-fill',
  'backspace','backspace-fill','backspace-reverse','backspace-reverse-fill',
  'badge-3d','badge-3d-fill','badge-4k','badge-4k-fill',
  'badge-8k','badge-8k-fill','badge-ad','badge-ad-fill',
  'badge-ar','badge-ar-fill','badge-cc','badge-cc-fill',
  'badge-hd','badge-hd-fill','badge-sd','badge-sd-fill',
  'badge-tm','badge-tm-fill','badge-vo','badge-vo-fill',
  'badge-vr','badge-vr-fill','badge-wc','badge-wc-fill',
  'bag','bag-check','bag-check-fill','bag-dash','bag-dash-fill','bag-fill',
  'bag-heart','bag-heart-fill','bag-plus','bag-plus-fill','bag-x','bag-x-fill',
  'balloon','balloon-fill','balloon-heart','balloon-heart-fill'
];

const SVG_DIR = path.join(__dirname, '..', 'icons', 'bootstrap');
if (!fs.existsSync(SVG_DIR)) fs.mkdirSync(SVG_DIR, { recursive: true });

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) return fetch(res.headers.location).then(resolve).catch(reject);
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

function encodeForCSS(svg) {
  return svg.replace(/\n\s*/g, ' ').replace(/"/g, "'").replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').trim();
}

async function main() {
  const cssLines = ['\n/* ── Essential UI Icons (Part 2) ── */\n'];
  const ok = [], fail = [];

  for (const name of ICONS) {
    const url = `https://raw.githubusercontent.com/twbs/icons/main/icons/${name}.svg`;
    try {
      const { status, body } = await fetch(url);
      if (status !== 200 || !body.includes('<svg')) { fail.push(name); console.log(`  ✗  ${name}  (${status})`); continue; }
      fs.writeFileSync(path.join(SVG_DIR, `${name}.svg`), body, 'utf8');
      const inner = body.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();
      const svgForCSS = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>${inner}</svg>`;
      cssLines.push(`.icon-${name} { --icon-url: url("data:image/svg+xml,${encodeForCSS(svgForCSS)}"); }`);
      ok.push(name);
      console.log(`  ✔  ${name}`);
    } catch(e) { fail.push(name); console.log(`  ✗  ${name}  (${e.message})`); }
    await new Promise(r => setTimeout(r, 80));
  }

  const outCSS = path.join(__dirname, '..', 'icons', 'bootstrap', '_essential-icons-2.css');
  fs.writeFileSync(outCSS, cssLines.join('\n') + '\n', 'utf8');
  console.log(`\n  Done — ${ok.length} ok, ${fail.length} failed`);
  if (fail.length) console.log('  Failed:', fail.join(', '));
}

main().catch(console.error);
