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
const WG = require('../src/lib/wedguest-core.js');
const BM = require('../src/lib/bridesmaid-core.js');
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

const lookGrid = (presets, url, title, sub) => frame(`<div style="font:600 74px/1.05 ${serif};margin:48px 0 12px;letter-spacing:-2px">${title}</div>
<div style="font:400 30px/1.35 ${sans};color:#4E4B46;margin-bottom:28px">${sub}</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">${presets.map((p) => `<div style="background:#FFFFFF;border-radius:20px;padding:8px;text-align:center;font:500 22px/1.2 ${sans}">${DR.svg(p.d, { id: 'pin-' + p.id, width: 260 })}<div style="margin:2px 0 8px">${p.name}</div></div>`).join('')}</div>`, url);

const SEASON_LOOKS = [['black-tie', 'evening', 'ballroom', 'Black tie'], ['cocktail', 'evening', 'garden', 'Cocktail'], ['smart-casual', 'day', 'barn', 'Dressy casual'], ['casual', 'day', 'beach', 'Beach']];
function weddingSeasonPin(season) {
  const N = season[0].toUpperCase() + season.slice(1), pal = WG.PALETTES[season];
  return frame(`<div style="font:600 76px/1.05 ${serif};margin:48px 0 24px;letter-spacing:-2px">What to Wear to a<br>${N} Wedding</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${SEASON_LOOKS.map(([code, time, venue, label], i) => {
    const p = WG.plan({ code, time, season, venue, color: i });
    return `<div style="background:#FFFFFF;border-radius:18px;padding:6px;text-align:center;font:500 21px/1.2 ${sans}">${DR.svg(p.dress, { id: 'wp-' + season + i, width: 196 })}<div style="margin:0 0 8px">${label}</div></div>`;
  }).join('')}</div>
<div style="font:600 30px/1 ${sans};margin:34px 0 14px">Day colors</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">${pal.day.map((c) => chip('#' + c[1], c[0], 120)).join('')}</div>
<div style="font:600 30px/1 ${sans};margin:28px 0 14px">Evening colors</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">${pal.evening.map((c) => chip('#' + c[1], c[0], 120)).join('')}</div>`, `/wedding-guest/${season}/`);
}

function guestHubPin() {
  return frame(`<div style="font:600 76px/1.05 ${serif};margin:48px 0 14px;letter-spacing:-2px">What to Wear<br>to a Wedding</div>
<div style="font:400 30px/1.35 ${sans};color:#4E4B46;margin-bottom:26px">Guest outfits for every season, dress code and venue</div>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">${['spring', 'summer', 'fall', 'winter'].map((s, i) => {
    const p = WG.plan({ code: i % 2 ? 'cocktail' : 'black-tie', time: 'evening', season: s, venue: 'ballroom', color: 0 });
    return `<div style="background:#FFFFFF;border-radius:20px;padding:8px;text-align:center;font:600 26px/1.2 ${serif}">${DR.svg(p.dress, { id: 'hub' + s, width: 300 }).replace('height="510"', 'height="420" preserveAspectRatio="xMidYMin slice"')}<div style="margin:2px 0 8px">${s[0].toUpperCase() + s.slice(1)}</div></div>`;
  }).join('')}</div>`, '/tools/wedding-guest-outfit/');
}

function bridesmaidPin() {
  const rows = [['#9CAF94', 'ombre', 'classic', 'Sage ombre'], ['#6D1F2E', 'mix', 'jewel', 'Jewel mix'], ['#E8B9B0', 'match', 'pastel', 'Blush, mixed necklines']];
  return frame(`<div style="font:600 70px/1.05 ${serif};margin:48px 0 26px;letter-spacing:-2px">Bridesmaid Color<br>Palette Ideas</div>
${rows.map(([c, style, vibe, label], r) => {
    const p = BM.plan({ color: c, style, vibe, count: 5 });
    return `<div style="font:600 28px/1 ${sans};margin:10px 0 8px">${label}</div><div style="display:flex;gap:4px;background:#FFFFFF;border-radius:18px;padding:6px 10px;margin-bottom:14px">${p.maids.map((m, i) =>
      DR.svg({ n: m.neckline, s: 'none', w: 'natural', k: 'aline', l: 'maxi', p: 'solid', c: m.hex.slice(1), a: 'FAFAF7', b: '' }, { id: 'bmp' + r + i, width: 168 }).replace('height="286"', 'height="250" preserveAspectRatio="xMidYMin slice"')).join('')}</div>`;
  }).join('')}`, '/tools/bridesmaid-color-palette/');
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
  await shot(lookGrid(DR.WEDDING_PRESETS, '/tools/wedding-dress-designer/', 'Design Your<br>Wedding Dress', 'Silhouettes, lace, trains and veils: free online wedding dress designer'), 1000, 1500, 'pins/wedding-dress-designer.jpg', 'jpeg');
  await shot(lookGrid(DR.PROM_PRESETS, '/tools/prom-dress-designer/', 'Design Your<br>Prom Dress', 'Mermaid, ball gown or slit: free online prom dress designer'), 1000, 1500, 'pins/prom-dress-designer.jpg', 'jpeg');
  await shot(guestHubPin(), 1000, 1500, 'pins/wedding-guest-outfit.jpg', 'jpeg');
  await shot(bridesmaidPin(), 1000, 1500, 'pins/bridesmaid-color-palette.jpg', 'jpeg');
  for (const s of ['spring', 'summer', 'fall', 'winter']) await shot(weddingSeasonPin(s), 1000, 1500, `pins/wedding-guest-${s}.jpg`, 'jpeg');
  console.log(`wrote ${Object.keys(SE.SEASONS).length + Object.keys(COLOR_GUIDES).length + 9} Pinterest images`);
}
await browser.close();
