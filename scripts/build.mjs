#!/usr/bin/env node
// Zero-dependency static build: src/ → dist/. Renders every page (with the first tool result already in the HTML),
// bundles each tool's scripts with a content hash, and writes sitemap.xml, robots.txt, llms.txt, _headers,
// the IndexNow key file and indexnow-manifest.json (per-URL content hashes used to ping only changed pages).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { render, site, abs } from '../src/layout.mjs';
import { BUNDLES } from '../src/tools.mjs';
import toolPages from '../src/pages/tools.mjs';
import colorPages from '../src/pages/colors.mjs';
import sitePages from '../src/pages/site.mjs';
import seasonPages from '../src/pages/seasons.mjs';
import weddingSeasonPages from '../src/pages/wedding-seasons.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const hash = (s, n = 10) => crypto.createHash('sha256').update(s).digest('hex').slice(0, n);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'assets/js'), { recursive: true });

// Static files (favicons, og image, manifest) are copied as they are.
fs.cpSync(path.join(root, 'static'), dist, { recursive: true });

// Script bundles: concatenated in dependency order, light whitespace/comment trim, hashed filename.
// src/ui/site.js (menu, search, share) leads every bundle; pages without a tool get it alone.
const bundleSrc = {};
const ALL = { site: [], contact: ['src/ui/contact.js'], ...BUNDLES };
for (const [name, list] of Object.entries(ALL)) {
  const files = ['src/ui/site.js', ...list];
  const code = files.map((f) => fs.readFileSync(path.join(root, f), 'utf8')
    .replace(/^\s*\/\/.*$/gm, '').replace(/\n\s*\n/g, '\n')).join('\n');
  const file = `/assets/js/${name}.${hash(code)}.js`;
  fs.writeFileSync(path.join(dist, file), code);
  bundleSrc[name] = file;
}

const pages = [...sitePages(), ...toolPages(), ...seasonPages(), ...weddingSeasonPages(), ...colorPages()];
const seen = new Set();
const manifest = {};
for (const page of pages) {
  if (seen.has(page.path)) throw new Error('Duplicate path ' + page.path);
  seen.add(page.path);
  const html = render(page, bundleSrc[page.bundle || 'site']);
  const out = page.path.endsWith('.html') ? page.path : page.path + 'index.html';
  fs.mkdirSync(path.dirname(path.join(dist, out)), { recursive: true });
  fs.writeFileSync(path.join(dist, out), html);
  if (!page.nositemap && !page.noindex) {
    // Hash what a crawler cares about (title, description, main content), not asset file names.
    const main = html.slice(html.indexOf('<title>'), html.indexOf('</title>')) + page.description + html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    manifest[abs(page.path)] = hash(main, 16);
  }
}

const listed = pages.filter((p) => !p.nositemap && !p.noindex);

// Site search index: [title, path, kind, description], fetched by site.js the first time search opens.
const kind = (p) => (p.app ? 'Tool' : p.path.startsWith('/colors/') ? 'Color guide' : p.path.startsWith('/seasons/') ? 'Color season'
  : p.path.startsWith('/wedding-guest/') ? 'Wedding guide' : 'Page');
fs.writeFileSync(path.join(dist, 'search-index.json'), JSON.stringify(listed.filter((p) => p.path !== '/')
  .map((p) => [p.title, p.path, kind(p), p.description])));
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${listed.map((p) => `<url><loc>${abs(p.path)}</loc><lastmod>${p.dateModified}</lastmod></url>`).join('\n')}
</urlset>
`);

// Search and AI answer engines are welcome: citations need crawling. Training-only crawlers can be refused here later.
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${abs('/sitemap.xml')}
`);

const llms = `# ${site.brand}

> ${site.description} ${site.tagline}

All tools run in the browser with published formulas; see ${abs('/methodology/')}. Methods verified ${site.dateModified}.

## Tools
${listed.filter((p) => p.path.startsWith('/tools/') && p.path !== '/tools/').map((p) => `- [${p.title}](${abs(p.path)}): ${p.llms}`).join('\n')}

## Color seasons
${listed.filter((p) => p.path.startsWith('/seasons/') && p.path !== '/seasons/').map((p) => `- [${p.title}](${abs(p.path)}): ${p.llms}`).join('\n')}

## Wedding guest guides
${listed.filter((p) => p.path.startsWith('/wedding-guest/')).map((p) => `- [${p.title}](${abs(p.path)}): ${p.llms}`).join('\n')}

## Color guides
${listed.filter((p) => p.path.startsWith('/colors/') && p.path !== '/colors/').map((p) => `- [${p.title}](${abs(p.path)}): ${p.llms}`).join('\n')}

## About
${listed.filter((p) => ['/about/', '/methodology/'].includes(p.path)).map((p) => `- [${p.title}](${abs(p.path)}): ${p.llms}`).join('\n')}
`;
fs.writeFileSync(path.join(dist, 'llms.txt'), llms);
manifest[abs('/llms.txt')] = hash(llms, 16);

// Full AI context dump (llms-full.txt) for Perplexity, ChatGPT Search, and Claude deep RAG indexing.
const stripTags = (s) => s.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<\/(h1|h2|h3|p|li|tr|div|section)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim();
const llmsFull = `${llms}\n---\n\n# Detailed Tool Specifications, Formulas, and FAQ Answers\n\n` +
  listed.map((p) => `## ${p.title}\nURL: ${abs(p.path)}\nSummary: ${p.description}\n${p.llms ? 'Technical Engine Summary: ' + p.llms + '\n' : ''}\n${stripTags(p.body)}\n`).join('\n---\n\n');
fs.writeFileSync(path.join(dist, 'llms-full.txt'), llmsFull);
manifest[abs('/llms-full.txt')] = hash(llmsFull, 16);

fs.writeFileSync(path.join(dist, `${site.indexNowKey}.txt`), site.indexNowKey);
fs.writeFileSync(path.join(dist, 'indexnow-manifest.json'), JSON.stringify(manifest, null, 1));

fs.writeFileSync(path.join(dist, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-DNS-Prefetch-Control: on
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://cloudflareinsights.com; base-uri 'self'; form-action 'self'; frame-ancestors 'self'
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*.html
  Cache-Control: public, max-age=0, s-maxage=604800, stale-while-revalidate=86400
/indexnow-manifest.json
  Cache-Control: no-store
`);

// www → apex and old paths; host redirects are a Cloudflare Redirect Rule (see README), not this file.
fs.writeFileSync(path.join(dist, '_redirects'), `/tools/color-combinations/ /tools/color-combination/ 301
/tools/size-chart/ /tools/size-converter/ 301
`);

console.log(`Built ${pages.length} pages, ${Object.keys(bundleSrc).length} bundles → dist/`);

