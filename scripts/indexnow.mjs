#!/usr/bin/env node
// Tells IndexNow (Bing, Yandex, Seznam, Naver; Bing also feeds ChatGPT search and Copilot) which URLs changed in a
// deploy. The build writes dist/indexnow-manifest.json (URL → content hash). Before deploying, CI downloads the live
// manifest; after deploying it runs this script, which sends only new or changed URLs, as IndexNow asks.
// Google does not use IndexNow; it reads sitemap.xml.
//
// Usage: node scripts/indexnow.mjs <previous-manifest.json>   send URLs whose hash changed (missing file = all)
//        node scripts/indexnow.mjs --all                      send every URL (after a key change)
// Env:   DRY_RUN=1  list URLs without sending
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function changedUrls(prev, next) {
  return Object.keys(next).filter((u) => prev[u] !== next[u]).sort();
}

async function main() {
  const site = JSON.parse(fs.readFileSync(path.join(root, 'src/site.json'), 'utf8'));
  const next = JSON.parse(fs.readFileSync(path.join(root, 'dist/indexnow-manifest.json'), 'utf8'));
  const arg = process.argv[2];
  if (!arg) throw new Error('Usage: node scripts/indexnow.mjs <previous-manifest.json> | --all');
  let prev = {};
  if (arg !== '--all') {
    try { prev = JSON.parse(fs.readFileSync(arg, 'utf8')); } catch { console.log('No previous manifest: sending every URL.'); }
  }
  const urls = changedUrls(prev, next);
  console.log(`${urls.length} URL(s) to submit`);
  urls.forEach((u) => console.log('  ' + u));
  if (!urls.length || process.env.DRY_RUN === '1') return;

  // IndexNow fetches the key file before accepting anything, so wait until the new deploy serves it.
  const keyLocation = `${site.origin}/${site.indexNowKey}.txt`;
  let live = '';
  for (let i = 0; i < 10 && live !== site.indexNowKey; i++) {
    if (i) await new Promise((r) => setTimeout(r, 30e3));
    live = await fetch(`${keyLocation}?v=${Date.now()}`).then((r) => (r.ok ? r.text() : '')).then((t) => t.trim()).catch(() => '');
  }
  if (live !== site.indexNowKey) {
    console.log(`::warning::Key file ${keyLocation} is not live; IndexNow skipped.`);
    return;
  }
  for (let i = 0; i < urls.length; i += 10000) {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(site.origin).host, key: site.indexNowKey, keyLocation, urlList: urls.slice(i, i + 10000) })
    });
    console.log(`IndexNow responded ${res.status} ${res.statusText}`);
    if (res.status >= 400 && res.status !== 429) process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
