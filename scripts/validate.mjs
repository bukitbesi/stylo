#!/usr/bin/env node
// Fails the build on SEO, schema, link and accessibility-token problems in dist/. Run after build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/site.json'), 'utf8'));
const C = createRequire(import.meta.url)('../src/lib/color-core.js');
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const htmlFiles = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p); else if (f.name.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const exists = (urlPath) => {
  const clean = decodeURI(urlPath.split('#')[0].split('?')[0]);
  if (!clean) return true;
  const p = path.join(dist, clean);
  return fs.existsSync(clean.endsWith('/') ? path.join(p, 'index.html') : p);
};

const titles = new Map(), descs = new Map();
for (const file of htmlFiles) {
  const rel = '/' + path.relative(dist, file).split(path.sep).join('/').replace(/index\.html$/, '');
  const html = fs.readFileSync(file, 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = unescape((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const noindex = /<meta name="robots" content="noindex"/.test(html);

  if (!title) fail(rel, 'missing <title>');
  if (title.length > 70) fail(rel, `title is ${title.length} characters (max 70): ${title}`);
  if (desc.length < 70 || desc.length > 160) fail(rel, `description is ${desc.length} characters (70–160)`);
  if (canonical !== site.origin + rel.replace(/^\/404\.html$/, '/404.html')) fail(rel, `canonical ${canonical} does not match`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(rel, 'needs exactly one <h1>');
  if (!noindex) {
    if (titles.has(title)) fail(rel, `duplicate title with ${titles.get(title)}`);
    if (descs.has(desc)) fail(rel, `duplicate description with ${descs.get(desc)}`);
    titles.set(title, rel); descs.set(desc, rel);
  }

  // Only our own scripts may load; JSON-LD must parse and FAQ schema must match the visible FAQ.
  for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
    const src = (m[1].match(/src="([^"]+)"/) || [])[1];
    if (src && !src.startsWith('/assets/js/')) fail(rel, `third-party or unexpected script ${src}`);
    if (src && !/\bdefer\b/.test(m[1])) fail(rel, `script ${src} must be deferred`);
    if (src && !exists(src)) fail(rel, `missing script ${src}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { fail(rel, 'invalid JSON-LD: ' + e.message); continue; }
    const faq = data['@graph'].find((n) => n['@type'] === 'FAQPage');
    if (faq) {
      const visible = [...html.matchAll(/<summary>([^<]*)<\/summary>/g)].map((x) => unescape(x[1]));
      for (const q of faq.mainEntity) if (!visible.includes(q.name)) fail(rel, `FAQ schema question not visible: ${q.name}`);
      if (faq.mainEntity.length !== visible.length) fail(rel, 'FAQ schema and visible FAQ differ in length');
    }
  }

  for (const m of html.matchAll(/\shref="(\/[^"]*)"/g)) if (!exists(m[1])) fail(rel, `broken internal link ${m[1]}`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]+"/.test(m[0])) fail(rel, 'image without alt text');
    if (!/\swidth="\d+"/.test(m[0]) || !/\sheight="\d+"/.test(m[0])) fail(rel, 'image without width/height (layout shift)');
    const src = (m[0].match(/\ssrc="([^"]+)"/) || [])[1];
    if (src && src.startsWith('/') && !exists(src)) fail(rel, `missing image ${src}`);
  }
  if (/data-tool=/.test(html)) {
    const res = (html.match(/<div class="result" data-result>([\s\S]*?)<\/div>\n<\/section>/) || [])[1] || '';
    if (res.replace(/<[^>]+>/g, '').trim().length < 40) fail(rel, 'tool result is not rendered into the HTML');
    if (!/aria-live="polite"/.test(html)) fail(rel, 'tool needs an aria-live region');
    if (!/<p class="answer">/.test(html)) fail(rel, 'tool page needs an answer-first paragraph');
    if ((html.match(/<details[\s>]/g) || []).length < 7) fail(rel, 'tool page needs at least 7 FAQs');
    if (!/Method verified/.test(html)) fail(rel, 'tool page must show the verified date');
  }
}

// Sitemap: every URL exists and is canonical; every indexable page is listed.
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) if (!loc.startsWith(site.origin) || !exists(loc.slice(site.origin.length))) fail('sitemap.xml', `bad URL ${loc}`);
if (locs.length !== titles.size) fail('sitemap.xml', `${locs.length} URLs but ${titles.size} indexable pages`);
// RSS feed: every item must be a URL from the sitemap, so the feed can never point at a missing or non-canonical page.
if (!exists('/feed.xml')) fail('dist', 'feed.xml missing (run npm run build, not scripts/build.mjs alone)');
else {
  const items = [...fs.readFileSync(path.join(dist, 'feed.xml'), 'utf8').matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map((m) => m[1]);
  if (!items.length) fail('feed.xml', 'no items');
  for (const link of items) if (!locs.includes(link)) fail('feed.xml', `item not in sitemap: ${link}`);
}
if (!fs.existsSync(path.join(dist, site.indexNowKey + '.txt'))) fail('dist', 'IndexNow key file missing');
if (!/^[a-f0-9]{32}$/.test(site.indexNowKey)) fail('site.json', 'indexNowKey must be 32 hex characters');

// Text color tokens must pass WCAG AA (4.5:1) on page and surface backgrounds, in light and dark mode.
const css = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');
const tokens = (block) => Object.fromEntries([...block.matchAll(/--([\w-]+):(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
const light = tokens(css.match(/:root\{[^}]*\}/)[0]);
const dark = { ...light, ...tokens(css.match(/prefers-color-scheme:dark\)\{:root\{[^}]*\}/)[0]) };
for (const [mode, t] of [['light', light], ['dark', dark]]) {
  for (const fg of ['text', 'text-2', 'muted', 'accent']) for (const bg of ['bg', 'surface']) {
    const ratio = C.contrast(t[fg], t[bg]);
    if (ratio < 4.5) fail('styles.css', `${mode}: --${fg} on --${bg} is ${ratio.toFixed(2)}:1 (needs 4.5)`);
  }
  if (C.contrast(t['accent-ink'], t.accent) < 4.5) fail('styles.css', `${mode}: button text on accent below 4.5:1`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(`Validated ${htmlFiles.length} pages, ${locs.length} sitemap URLs: OK`);
