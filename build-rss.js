#!/usr/bin/env node
// Writes dist/feed.xml (RSS 2.0) from the real page data, so every item is a live, canonical URL with its true
// publish date. Hubs and legal pages are left out. Run after scripts/build.mjs, which wipes dist/ (npm run build does both).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, abs } from './src/layout.mjs';
import toolPages from './src/pages/tools.mjs';
import colorPages from './src/pages/colors.mjs';
import seasonPages from './src/pages/seasons.mjs';
import weddingSeasonPages from './src/pages/wedding-seasons.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const MAX_ITEMS = 50;
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rfc822 = (day) => new Date(`${day}T00:00:00Z`).toUTCString();

const items = [...toolPages(), ...seasonPages(), ...weddingSeasonPages(), ...colorPages()]
  .filter((p) => !p.nositemap && !p.noindex && p.path.split('/').length > 3)
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.title.localeCompare(b.title))
  .slice(0, MAX_ITEMS);

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${xml(site.brand)}</title>
<link>${abs('/')}</link>
<description>${xml(site.description)}</description>
<language>${site.lang.toLowerCase()}</language>
<lastBuildDate>${rfc822(items[0].datePublished)}</lastBuildDate>
<atom:link href="${abs('/feed.xml')}" rel="self" type="application/rss+xml"/>
${items.map((p) => `<item>
<title>${xml(p.title)}</title>
<link>${abs(p.path)}</link>
<guid isPermaLink="true">${abs(p.path)}</guid>
<description>${xml(p.description)}</description>
<pubDate>${rfc822(p.datePublished)}</pubDate>
</item>`).join('\n')}
</channel>
</rss>
`;

fs.writeFileSync(path.join(root, 'dist/feed.xml'), feed);
console.log(`Wrote dist/feed.xml with ${items.length} items`);
