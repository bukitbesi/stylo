#!/usr/bin/env node
// Browser check at 390 px (phone width): every page loads without console errors or horizontal overflow, and every
// tool reacts to input. Uses the pre-installed Playwright Chromium. Run after build: node scripts/e2e.mjs [shotDir]
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const shots = process.argv[2];
const port = 4399, base = `http://localhost:${port}`;
const server = spawn(process.execPath, [path.join(root, 'scripts/preview.mjs'), String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));

const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>https:\/\/[^/]+([^<]+)<\/loc>/g)].map((m) => m[1]).concat('/nope/');
const problems = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

const interactions = {
  '/tools/color-combination/': async (p) => {
    await p.click('.chip[data-hex="#1F2A44"]');
    await p.fill('#cc-hex', '#C1272D');
    return /Colors that go with red/i.test(await p.textContent('[data-result]')) && /c=C1272D/.test(p.url());
  },
  '/tools/size-converter/': async (p) => {
    await p.selectOption('#sz-k', 'women');
    await p.fill('#sz-v', '4');
    return /UK 8/.test(await p.textContent('[data-result]')) && /k=women/.test(p.url());
  },
  '/tools/color-analysis/': async (p) => {
    for (const [name, v] of [['veins', 2], ['metal', 2], ['white', 2], ['sun', 2], ['hair', 2], ['skin', 2], ['eyes', 1], ['contrast', 1]]) {
      await p.check(`input[name=${name}][value="${v}"]`);
    }
    return /Deep Autumn/.test(await p.textContent('[data-result]')) && /a=22222211/.test(p.url());
  },
  '/tools/capsule-wardrobe/': async (p) => {
    await p.selectOption('#cw-w', 'men');
    return /60 outfits/.test(await p.textContent('[data-result]'));
  },
  '/tools/body-shape-calculator/': async (p) => {
    await p.fill('#bs-b', '40'); await p.fill('#bs-w', '33'); await p.fill('#bs-hh', '34'); await p.fill('#bs-h', '35');
    const ok = /Inverted Triangle/.test(await p.textContent('[data-result]'));
    await p.selectOption('#bs-u', 'cm');
    return ok && (await p.inputValue('#bs-b')) === '101.5' && /Inverted Triangle/.test(await p.textContent('[data-result]'));
  },
  '/tools/photo-color-palette/': async (p) => {
    await p.setInputFiles('#pp-file', path.join(root, 'static/og.png'));
    await p.waitForFunction(() => /Your Photo/.test(document.querySelector('[data-result]').textContent), null, { timeout: 5000 });
    return /p=[0-9A-F]{6}\.\d+/.test(p.url());
  },
  '/tools/ring-size-converter/': async (p) => {
    await p.fill('#rs-v', '8');
    const a = /EU\/ISO 57/.test(await p.textContent('[data-result]'));
    await p.selectOption('#rs-s', 'diameter');
    return a && (await p.inputValue('#rs-v')) === '18.1';
  },
  '/tools/cost-per-wear-calculator/': async (p) => {
    await p.fill('#cpw-by', '50');
    return /Trend top costs \$0\.80 per wear/.test(await p.textContent('[data-result]'));
  },
  '/tools/selfie-color-analysis/': async (p) => {
    await p.setInputFiles('#sf-file', path.join(root, 'static/og.png'));
    await p.waitForSelector('.selfie:not([hidden])');
    await p.locator('.selfie canvas').scrollIntoViewIfNeeded();
    const box = await p.locator('.selfie canvas').boundingBox();
    for (const [fx, fy] of [[0.3, 0.9], [0.1, 0.15], [0.85, 0.2]]) await p.mouse.click(box.x + box.width * fx, box.y + box.height * fy);
    for (const q of ['veins', 'metal', 'white', 'sun']) await p.check(`input[name=${q}][value="0"]`);
    return /Your result/.test(await p.textContent('[data-result]')) && /a=\d{8}/.test(p.url());
  },
  '/tools/wardrobe-color-checker/': async (p) => {
    await p.fill('#wc-red', '5');
    return /17 pieces/.test(await p.textContent('[data-result]')) && /red\.5/.test(p.url());
  },
  '/tools/packing-list-generator/': async (p) => {
    await p.fill('#pk-n', '3');
    await p.selectOption('#pk-t', 'beach');
    return /For 3 days \(beach holiday/.test(await p.textContent('[data-result]')) && /Swimsuit/.test(await p.textContent('[data-result]'));
  },
  '/tools/dress-code-guide/': async (p) => {
    await p.selectOption('#dc-d', 'black-tie');
    await p.selectOption('#dc-s', 'menswear');
    return /Black bow tie/.test(await p.textContent('[data-result]')) && /d=black-tie/.test(p.url());
  },
  '/tools/dress-designer/': async (p) => {
    await p.selectOption('#dd-n', 'sweetheart');
    await p.selectOption('#dd-k', 'mermaid');
    const a = /Midi mermaid dress with a sweetheart/.test(await p.textContent('[data-result]')) && /n=sweetheart/.test(p.url());
    await p.click('[data-preset=prom]');
    const b = /Maxi \/ floor length fit-and-flare dress with a off-shoulder|off-shoulder/.test(await p.textContent('[data-result]'));
    await p.selectOption('#dd-p', 'photo');
    await p.setInputFiles('#dd-photo', path.join(root, 'static/og.png'));
    await p.waitForFunction(() => /data:image\/jpeg/.test(document.querySelector('[data-stage]').innerHTML), null, { timeout: 5000 });
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 5000 }), p.click('[data-download]')]);
    const ok = dl.suggestedFilename() === 'simplystylo-dress.png';
    // The photo is not part of the shared link, so restore the plain design before the link check.
    await p.selectOption('#dd-p', 'solid');
    return a && b && ok;
  },
  '/tools/outfit-generator/': async (p) => {
    const before = await p.textContent('[data-result]');
    await p.selectOption('#og-o', 'formal');
    await p.click('[data-shuffle]');
    const after = await p.textContent('[data-result]');
    await p.selectOption('#og-u', 'f');
    return before !== after && (await p.inputValue('#og-t')) === '68';
  }
};

for (const pth of paths) {
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(base + pth, { waitUntil: 'load' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) problems.push(`${pth}: horizontal overflow ${overflow}px`);
  if (interactions[pth]) {
    try { if (!(await interactions[pth](page))) problems.push(`${pth}: tool did not update as expected`); }
    catch (e) { problems.push(`${pth}: interaction failed: ${e.message.split('\n')[0]}`); }
    const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow2 > 0) problems.push(`${pth}: overflow after use ${overflow2}px`);
    // Reload with the hash: the shared link must restore the same result.
    const url = page.url(), text = await page.textContent('[data-result]');
    await page.goto('about:blank'); await page.goto(url, { waitUntil: 'load' });
    if ((await page.textContent('[data-result]')) !== text) problems.push(`${pth}: shared link did not restore the result`);
  }
  if (shots) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, (pth.replace(/\//g, '_') || 'home') + '.png'), fullPage: true }); }
  if (errs.length) problems.push(`${pth}: console errors: ${errs.join(' | ')}`);
  await page.close();
}
await browser.close();
server.kill();
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`E2E OK: ${paths.length} pages at 390 px, ${Object.keys(interactions).length} tools exercised`);
