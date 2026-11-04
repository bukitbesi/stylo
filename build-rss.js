#!/usr/bin/env node
// Writes two RSS 2.0 feeds from the real page data, so every item is a live, canonical URL with its true publish date.
// Hubs and legal pages are left out. Run after scripts/build.mjs, which wipes dist/ (npm run build does both).
//   dist/feed.xml       every tool and guide; items carry their 1000x1500 Pin image when the page has one
//   dist/pinterest.xml  only pages with a Pin image, for Pinterest auto-publish (it rejects items without an image)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, abs } from './src/layout.mjs';
import toolPages from './src/pages/tools.mjs';
import colorPages from './src/pages/colors.mjs';
import seasonPages from './src/pages/seasons.mjs';
import weddingSeasonPages from './src/pages/wedding-seasons.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const MAX_ITEMS = 100;
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rfc822 = (day) => new Date(`${day}T00:00:00Z`).toUTCString();
const pinOf = (p) => (p.body.match(/class="pin"><img src="([^"]+)"/) || [])[1];

// Pinterest reads the image from <enclosure> or <media:content>; both are sent so other readers work too.
function image(p) {
  const pin = pinOf(p);
  if (!pin) return '';
  const url = abs(pin);
  return `
<enclosure url="${url}" length="${fs.statSync(path.join(dist, pin)).size}" type="image/jpeg"/>
<media:content url="${url}" type="image/jpeg" medium="image" width="1000" height="1500"/>`;
}

const rss = (file, list) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${xml(site.brand)}</title>
<link>${abs('/')}</link>
<description>${xml(site.description)}</description>
<language>${site.lang.toLowerCase()}</language>
<lastBuildDate>${rfc822(list[0].datePublished)}</lastBuildDate>
<atom:link href="${abs('/' + file)}" rel="self" type="application/rss+xml"/>
${list.map((p) => `<item>
<title>${xml(p.title)}</title>
<link>${abs(p.path)}</link>
<guid isPermaLink="true">${abs(p.path)}</guid>
<description>${xml(p.description)}</description>
<pubDate>${rfc822(p.datePublished)}</pubDate>${image(p)}
</item>`).join('\n')}
</channel>
</rss>
`;

const items = [...toolPages(), ...seasonPages(), ...weddingSeasonPages(), ...colorPages()]
  .filter((p) => !p.nositemap && !p.noindex && p.path.split('/').length > 3)
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.title.localeCompare(b.title))
  .slice(0, MAX_ITEMS);

for (const [file, list] of [['feed.xml', items], ['pinterest.xml', items.filter(pinOf)]]) {
  fs.writeFileSync(path.join(dist, file), rss(file, list));
  console.log(`Wrote dist/${file} with ${list.length} items`);
}
