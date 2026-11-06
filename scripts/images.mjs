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
const NK = require('../src/lib/necklace-core.js'), NKU = require('../src/ui/necklace-length.js');
const HT = require('../src/lib/hat-core.js'), HTU = require('../src/ui/hat-size.js');
const GV = require('../src/lib/glove-core.js'), GVU = require('../src/ui/glove-size.js');
const CR = require('../src/lib/care-core.js');
const SK = require('../src/lib/skirt-core.js'), SKU = require('../src/ui/circle-skirt.js');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'static');
const serif = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif";
const sans = 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
const only = process.argv[2]; // optional: "icons" | "pins" | "tool-pins" (only the accessory, care and sewing pins)

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

// ---------- accessory, care and sewing tool pins ----------
const card = (inner, extra = '') => `<div style="background:#FFFFFF;border-radius:22px;padding:22px;${extra}">${inner}</div>`;
const big = (svg, w) => svg.replace(/width="\d+" height="\d+"/, `width="${w}" height="${Math.round(w * (+svg.match(/viewBox="0 0 (\d+) (\d+)"/)[2] / +svg.match(/viewBox="0 0 (\d+) (\d+)"/)[1]))}"`).replace(/class="[^"]*"/, '');
const rowList = (rows) => rows.map(([a, b]) => `<div style="display:flex;justify-content:space-between;gap:16px;padding:20px 0;border-bottom:1px solid #E6E1D8;font:500 34px/1.2 ${sans}"><b style="font-weight:600">${a}</b><span style="color:#4E4B46;text-align:right">${b}</span></div>`).join('');

function necklacePin() {
  const s = NK.stack(['16', '18', '22', '30', '36'], 'in');
  return frame(`<div style="font:600 76px/1.05 ${serif};margin:48px 0 10px;letter-spacing:-2px">Necklace Length<br>Guide</div>
<div style="font:400 30px/1.35 ${sans};color:#4E4B46;margin-bottom:24px">Where every length falls, from choker to rope</div>
<div style="display:flex;gap:26px;align-items:flex-start">${card(big(NKU.figure(s), 470), 'padding:14px')}
<div style="flex:1">${rowList(s.items.map((i) => [i.inches + ' in', i.type.name]))}<div style="font:400 24px/1.4 ${sans};color:#4E4B46;margin-top:18px">Layer chains about 2 in (5 cm) apart so they don't tangle.</div></div></div>
${card(`<div style="font:600 34px/1.3 ${serif}">Doubled, a 36 in chain wears as an 18 in princess.</div>`, 'margin-top:28px')}`, '/tools/necklace-length-visualizer/');
}

function hatPin() {
  return frame(`<div style="font:600 80px/1.05 ${serif};margin:48px 0 10px;letter-spacing:-2px">What's My<br>Hat Size?</div>
<div style="font:400 30px/1.35 ${sans};color:#4E4B46;margin-bottom:24px">Measure around your head, 1 cm above the ears</div>
<div style="display:flex;gap:26px;align-items:flex-start">${card(big(HTU.figure(HT.convert('cm', 57)), 400), 'padding:14px')}
<div style="flex:1">${rowList([54, 55, 56, 57, 58, 59, 60, 61].map((c) => { const r = HT.convert('cm', c); return [c + ' cm', 'US ' + r.usLabel]; }))}</div></div>
${card(`<div style="font:600 34px/1.3 ${serif}">US hat size = head size in cm ÷ 8</div><div style="font:400 28px/1.4 ${sans};color:#4E4B46;margin-top:10px">Between sizes? Choose the larger one and add a sizing strip.</div>`, 'margin-top:28px')}`, '/tools/hat-size-calculator/');
}

function glovePin() {
  return frame(`<div style="font:600 80px/1.05 ${serif};margin:48px 0 10px;letter-spacing:-2px">Glove Size<br>Chart</div>
<div style="font:400 30px/1.35 ${sans};color:#4E4B46;margin-bottom:24px">Measure around the palm below the knuckles, thumb out</div>
<div style="display:flex;gap:26px;align-items:flex-start">${card(big(GVU.figure(GV.size(203, 182)), 380), 'padding:14px')}
<div style="flex:1">${rowList(GV.table().map((t) => ['Size ' + t.size, t.circ / 10 + ' cm · ' + t.inches + ' in']))}<div style="font:400 24px/1.4 ${sans};color:#4E4B46;margin-top:18px">EN ISO 21420 hand sizes 6 to 11.</div></div></div>
${card(`<div style="font:600 34px/1.3 ${serif}">Glove size ≈ hand size in inches</div><div style="font:400 28px/1.4 ${sans};color:#4E4B46;margin-top:10px">Measure your dominant hand at the end of the day.</div>`, 'margin-top:28px')}`, '/tools/glove-size-calculator/');
}

function carePin() {
  const pick = [['w', '40'], ['w', '30m'], ['w', '30vm'], ['w', 'hand'], ['w', 'no'], ['b', 'oxygen'], ['b', 'no'], ['t', 'low'], ['t', 'no'], ['i', 'low'], ['i', 'medium'], ['i', 'high'], ['p', 'P'], ['p', 'W'], ['p', 'no']];
  const cell = ([k, code]) => {
    const g = CR.GROUPS.find((x) => x.key === k), o = CR.find(g, code);
    return `<div style="background:#FFFFFF;border-radius:18px;padding:12px 8px;text-align:center;color:#171717;font:500 23px/1.25 ${sans}">${CR.svg(g.shape, o[3], 104)}<div style="margin-top:6px">${o[1]}</div></div>`;
  };
  return frame(`<div style="font:600 76px/1.05 ${serif};margin:44px 0 10px;letter-spacing:-2px">Laundry Symbols<br>Explained</div>
<div style="font:400 30px/1.35 ${sans};color:#4E4B46;margin-bottom:22px">Bars = gentler cycle · dots = heat · a cross = do not</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">${pick.map(cell).join('')}</div>`, '/tools/laundry-symbols/');
}

function skirtPin() {
  const cell = (t, label) => { const r = SK.calc({ waist: 70, length: 60, type: t, seam: 1.5, hem: 2.5, width: 300 }); return card(`<div style="font:600 30px/1.2 ${serif};margin-bottom:6px">${label}</div>${big(SKU.pattern(r, 'cm'), 400)}<div style="font:500 24px/1.3 ${sans};color:#4E4B46">Waist radius ${r.r} cm</div>`, 'padding:16px'); };
  return frame(`<div style="font:600 76px/1.05 ${serif};margin:44px 0 10px;letter-spacing:-2px">Circle Skirt<br>Pattern Math</div>
<div style="font:400 30px/1.35 ${sans};color:#4E4B46;margin-bottom:22px">Waist radius = waist ÷ 2π for a full circle (70 cm waist shown)</div>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">${cell('full', 'Full circle')}${cell('half', 'Half circle')}${cell('quarter', 'Quarter circle')}${card(`<div style="font:600 30px/1.2 ${serif};margin-bottom:12px">The formulas</div><div style="font:400 26px/1.55 ${sans}">Full: waist ÷ 2π<br>Half: waist ÷ π<br>Quarter: waist ÷ (π/2)<br><br>Cut the waist at the radius minus the seam allowance.</div>`, 'padding:22px')}</div>`, '/tools/circle-skirt-calculator/');
}

const browser = await chromium.launch();
const shot = async (html, w, h, file, type = 'png') => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<!doctype html><meta charset="utf-8">${html}`);
  fs.mkdirSync(path.dirname(path.join(out, file)), { recursive: true });
  await page.screenshot({ path: path.join(out, file), type, ...(type === 'jpeg' ? { quality: 82 } : {}) });
  await page.close();
};
if (only !== 'pins' && only !== 'tool-pins') {
  await shot(og, 1200, 630, 'og.png');
  await shot(icon(512, 52), 512, 512, 'icon-512.png');
  await shot(icon(192, 20), 192, 192, 'icon-192.png');
  await shot(icon(180, 14), 180, 180, 'apple-touch-icon.png');
  await shot(`<body style="margin:0">${MARK(48)}</body>`, 48, 48, 'favicon-48.png');
  console.log('wrote favicon.svg, favicon-48.png, icons and og.png');
}
if (only !== 'icons' && only !== 'tool-pins') {
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
if (only !== 'icons') {
  await shot(necklacePin(), 1000, 1500, 'pins/necklace-length-visualizer.jpg', 'jpeg');
  await shot(hatPin(), 1000, 1500, 'pins/hat-size-calculator.jpg', 'jpeg');
  await shot(glovePin(), 1000, 1500, 'pins/glove-size-calculator.jpg', 'jpeg');
  await shot(carePin(), 1000, 1500, 'pins/laundry-symbols.jpg', 'jpeg');
  await shot(skirtPin(), 1000, 1500, 'pins/circle-skirt-calculator.jpg', 'jpeg');
  console.log('wrote 5 tool Pinterest images');
}
await browser.close();
