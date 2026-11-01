#!/usr/bin/env node
// Renders the social card and app icons into static/ with the pre-installed Playwright Chromium.
// Run only when the brand changes; the PNGs are committed so the build itself needs no browser.
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'static');
const serif = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif";

const og = `<body style="margin:0;width:1200px;height:630px;background:#F5F1E9;font-family:${serif};display:flex">
<div style="flex:1;padding:72px 64px;display:flex;flex-direction:column;justify-content:space-between">
<div style="font-size:44px;font-weight:600;color:#171717;letter-spacing:-1px">simplystylo<span style="color:#5A6359">.</span></div>
<div><div style="font-size:86px;line-height:1.02;color:#171717;font-weight:600;letter-spacing:-2px">Find your style.<br>Wear it better.</div>
<div style="font:400 30px/1.4 system-ui,sans-serif;color:#4E4B46;margin-top:24px">Free tools for colors, sizes and outfits</div></div></div>
<div style="width:330px;display:grid;grid-template-rows:repeat(5,1fr)">
${['#1F2A44', '#B98A57', '#6B6B3A', '#6D1F2E', '#E8B9B0'].map((c) => `<div style="background:${c}"></div>`).join('')}</div></body>`;

const iconHtml = (size, pad) => `<body style="margin:0;width:${size}px;height:${size}px;background:#171717;display:grid;place-items:center">
<div style="font:600 ${Math.round(size * 0.62)}px/1 ${serif};color:#F5F1E9;margin-top:-${Math.round(size * 0.08)}px;padding:${pad}px">s<span style="color:#B8A58D">.</span></div></body>`;

const browser = await chromium.launch();
const shot = async (html, w, h, file) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html);
  await page.screenshot({ path: path.join(out, file) });
  await page.close();
  console.log('wrote static/' + file);
};
await shot(og, 1200, 630, 'og.png');
await shot(iconHtml(512, 40), 512, 512, 'icon-512.png');
await shot(iconHtml(192, 16), 192, 192, 'icon-192.png');
await shot(iconHtml(180, 14), 180, 180, 'apple-touch-icon.png');
await browser.close();
