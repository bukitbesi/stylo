#!/usr/bin/env node
// Renders the brand images into static/ with the pre-installed Playwright Chromium: favicon.svg + PNG icons,
// the 1200×630 social card, and 1000×1500 Pinterest images for every season and color guide.
// Run when the brand, a palette or a color guide changes; outputs are committed so the build needs no browser.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { MARK } from '../src/layout.mjs';
import { COLOR_GUIDES } from '../src/data/colors.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const SE = require('../src/lib/season-core.js');
const DR = require('../src/lib/dress-core.js');
const C = require('../src/lib/color-core.js');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'static');
const serif = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif";
const sans = 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
const only = process.argv[2]; // optional: "icons" | "pins"

fs.writeFileSync(path.join(out, 'favicon.svg'), MARK(64).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(' aria-hidden="true"', ''));

const wordmark = (px) => `<div style="display:flex;align-items:center;gap:${px * 0.3}px;font:600 ${px}px/1 ${serif};color:#171717;letter-spacing:-0.5px">${MARK(px * 1.25)}<span>Simply<i style="font-weight:500">Stylo</i></span></div>`;

const og = `<body style="margin:0;width:1200px;height:630px;background:#F5F1E9;display:flex">
<div style="flex:1;padding:64px;display:flex;flex-direction:column;justify-content:space-between">${wordmark(40)}
<div><div style="font:600 84px/1.02 ${serif};color:#171717;letter-spacing:-2px">Find Your Style.<br>Wear It Better.</div>
<div style="font:400 30px/1.4 ${sans};color:#4E4B46;margin-top:24px">Free tools for colors, sizes and outfits</div></div></div>
<div style="width:330px;display:grid;grid-template-rows:repeat(5,1fr)">
${['#1F2A44', '#B98A57', '#6B6B3A', '#6D1F2E', '#E8B9B0'].map((c) => `<div style="background:${c}"></div>`).join('')}</div></body>`;

// Maskable icons keep the mark inside the central 80% safe zone.
const icon = (size, pad) => `<body style="margin:0;width:${size}px;height:${size}px;background:#171717;display:grid;place-items:center">
<div style="width:${size - pad * 2}px;height:${size - pad * 2}px">${MARK(size - pad * 2)}</div></body>`;

const ink = (hex) => (C.contrast(hex, '#171717') >= C.contrast(hex, '#FFFFFF') ? '#171717' : '#FFFFFF');
const chip = (hex, label, h) => `<div style="background:${hex};color:${ink(hex)};border-radius:18px;height:${h}px;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;font:500 22px/1.25 ${sans};box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)">${label ? `<b style="font-weight:600">${label}</b>` : ''}<span style="opacity:.85">${hex}</span></div>`;
const frame = (inner, url) => `<body style="margin:0;width:1000px;height:1500px;background:#F5F1E9;font-family:${sans};color:#171717;display:flex;flex-direction:column;padding:64px;box-sizing:border-box">
${wordmark(34)}${inner}<div style="margin-top:auto;font:500 26px/1 ${sans};color:#4E4B46">simplystylo.com${url}</div></body>`;

function seasonPin(id) {
  const s = SE.SEASONS[id];
  return frame(`<div style="font:600 92px/1 ${serif};margin:56px 0 8px;letter-spacing:-2px">${s.name}</div>
<div style="font:400 34px/1.3 ${sans};color:#4E4B46;margin-bottom:36px">Color palette · ${s.traits}</div>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px">${s.palette.map((h) => chip(h, '', 190)).join('')}</div>
<div style="font:600 30px/1 ${sans};margin:40px 0 16px">Best neutrals</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${s.neutrals.map((h) => chip(h, '', 120)).join('')}</div>
<div style="font:600 30px/1 ${sans};margin:40px 0 16px">Keep away from the face</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${s.avoid.map((h) => chip(h, '', 100)).join('')}</div>`, `/seasons/${id}/`);
}

function colorPin(slug) {
  const n = C.bySlug(slug), g = COLOR_GUIDES[slug];
  return frame(`<div style="font:600 80px/1.05 ${serif};margin:56px 0 32px;letter-spacing:-2px">What Goes With<br>${n.name.replace(/\b\w/g, (c) => c.toUpperCase())}?</div>
<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:14px">${chip(n.hex, n.name, 400)}${g.pairs.slice(0, 2).map((p) => chip(C.bySlug(p).hex, C.bySlug(p).name, 400)).join('')}</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:14px">${g.pairs.slice(2, 6).map((p) => chip(C.bySlug(p).hex, C.bySlug(p).name, 170)).join('')}</div>
<div style="font:600 30px/1 ${sans};margin:44px 0 18px">Outfit formulas</div>
<ol style="margin:0;padding-left:34px;font:400 29px/1.45 ${sans};color:#2F2C28">${g.outfits.map((o) => `<li style="margin-bottom:10px">${o}</li>`).join('')}</ol>`, `/colors/${slug}/`);
}

function dressPin() {
  return frame(`<div style="font:600 78px/1.05 ${serif};margin:52px 0 12px;letter-spacing:-2px">Design Your<br>Own Dress</div>
<div style="font:400 30px/1.35 ${sans};color:#4E4B46;margin-bottom:30px">Free online dress designer: necklines, sleeves, skirts, colors and your own fabric photo</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">${DR.PRESETS.map((p) => `<div style="background:#FFFFFF;border-radius:20px;padding:8px;text-align:center;font:500 22px/1.2 ${sans}">${DR.svg(p.d, { id: 'pin-' + p.id, width: 260 })}<div style="margin:2px 0 8px">${p.name}</div></div>`).join('')}</div>`, '/tools/dress-designer/');
}

const browser = await chromium.launch();
const shot = async (html, w, h, file, type = 'png') => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<!doctype html><meta charset="utf-8">${html}`);
  fs.mkdirSync(path.dirname(path.join(out, file)), { recursive: true });
  await page.screenshot({ path: path.join(out, file), type, ...(type === 'jpeg' ? { quality: 82 } : {}) });
  await page.close();
};
if (only !== 'pins') {
  await shot(og, 1200, 630, 'og.png');
  await shot(icon(512, 52), 512, 512, 'icon-512.png');
  await shot(icon(192, 20), 192, 192, 'icon-192.png');
  await shot(icon(180, 14), 180, 180, 'apple-touch-icon.png');
  await shot(`<body style="margin:0">${MARK(48)}</body>`, 48, 48, 'favicon-48.png');
  console.log('wrote favicon.svg, favicon-48.png, icons and og.png');
}
if (only !== 'icons') {
  for (const id of Object.keys(SE.SEASONS)) await shot(seasonPin(id), 1000, 1500, `pins/season-${id}.jpg`, 'jpeg');
  for (const slug of Object.keys(COLOR_GUIDES)) await shot(colorPin(slug), 1000, 1500, `pins/color-${slug}.jpg`, 'jpeg');
  await shot(dressPin(), 1000, 1500, 'pins/dress-designer.jpg', 'jpeg');
  console.log(`wrote ${Object.keys(SE.SEASONS).length + Object.keys(COLOR_GUIDES).length + 1} Pinterest images`);
}
await browser.close();
