#!/usr/bin/env node
// Notifies the Google Indexing API about URLs. Zero dependencies: the service-account JWT is signed with node:crypto,
// so the googleapis package is not needed. Google officially supports this API only for JobPosting and livestream
// (BroadcastEvent) pages; for other pages sitemap.xml remains the supported route, so treat this as best-effort.
//
// Usage: node scripts/ping-google.mjs <previous-manifest.json>   submit URLs whose hash changed (missing file = all)
//        node scripts/ping-google.mjs --all                      submit every URL
//        node scripts/ping-google.mjs https://simplystylo.com/x/ submit the given URL(s)
// Env:   GOOGLE_SERVICE_ACCOUNT_JSON  path to the key file, or the JSON itself (add the service account email as
//                                      an Owner of the property in Search Console)
//        DRY_RUN=1  list URLs without sending;  MAX_URLS (default 200, the daily quota)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { changedUrls } from './indexnow.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const b64 = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');

function loadKey() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '';
  if (!raw) throw new Error('Set GOOGLE_SERVICE_ACCOUNT_JSON to the service-account key file path or JSON.');
  return JSON.parse(raw.trim().startsWith('{') ? raw : fs.readFileSync(raw, 'utf8'));
}

async function accessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'RS256', typ: 'JWT' });
  const claim = b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/indexing', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const sig = crypto.sign('RSA-SHA256', Buffer.from(`${head}.${claim}`), key.private_key).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` })
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token request failed: ${data.error_description || data.error || res.status}`);
  return data.access_token;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) throw new Error('Usage: node scripts/ping-google.mjs <previous-manifest.json> | --all | <url>...');
  let urls;
  if (/^https?:\/\//.test(arg)) urls = process.argv.slice(2);
  else {
    const next = JSON.parse(fs.readFileSync(path.join(root, 'dist/indexnow-manifest.json'), 'utf8'));
    let prev = {};
    if (arg !== '--all') {
      try { prev = JSON.parse(fs.readFileSync(arg, 'utf8')); } catch { console.log('No previous manifest: sending every URL.'); }
    }
    urls = changedUrls(prev, next);
  }
  urls = urls.slice(0, Number(process.env.MAX_URLS) || 200);
  console.log(`${urls.length} URL(s) to submit`);
  urls.forEach((u) => console.log('  ' + u));
  if (!urls.length || process.env.DRY_RUN === '1') return;

  const token = await accessToken(loadKey());
  for (const url of urls) {
    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url, type: 'URL_UPDATED' })
    });
    console.log(`${res.status} ${url}`);
    if (res.status >= 400) { console.log(await res.text()); process.exitCode = 1; if (res.status === 429) break; }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
