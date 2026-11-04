// Page shell and content blocks. Everything a crawler needs (answer, tool result, tables, FAQ) is in the HTML.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOLS } from './tools.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const site = JSON.parse(fs.readFileSync(path.join(here, 'site.json'), 'utf8'));
const css = fs.readFileSync(path.join(here, 'styles.css'), 'utf8').replace(/\s*\n\s*/g, '');

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const abs = (p) => site.origin + p;
export const longDate = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const ICONS = {
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.9-.6-1.2-.6-2 0-.9.7-1.4 1.6-1.4H17a4 4 0 0 0 4-4c0-5-4-9-9-9Z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="14.5" cy="7" r="1.2"/>',
  ruler: '<path d="m3 15 12-12 6 6-12 12z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>',
  sparkle: '<circle cx="12" cy="9" r="4"/><path d="M5 21c1-4 4-6 7-6s6 2 7 6"/><path d="M19 3v4M17 5h4"/>',
  hanger: '<path d="M12 7a2 2 0 1 1 2-2"/><path d="M12 7v2L3 16a1 1 0 0 0 .6 1.8h16.8A1 1 0 0 0 21 16l-9-7"/>',
  shuffle: '<path d="M3 7h3c4 0 6 10 10 10h5"/><path d="M3 17h3c1.5 0 2.7-1.4 3.7-3.2M21 7h-5c-1.5 0-2.7 1.4-3.7 3.2"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>',
  figure: '<circle cx="12" cy="4" r="2"/><path d="M8 8h8l-1.5 5 2.5 8H7l2.5-8z"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m21 16-5-5-8 9"/>',
  ring: '<circle cx="12" cy="14" r="7"/><path d="m9 4 3 3 3-3-1-2h-4z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2 0 2.8 6 1.5 6 4.2 0 1.2-1.3 2-3 2-1.5 0-2.6-.6-3.1-1.6M12 6v2M12 16v2"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/>',
  suitcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M8 7v13M16 7v13"/>',
  bowtie: '<path d="M3 7l7 4v2l-7 4zM21 7l-7 4v2l7 4z"/><rect x="10" y="10" width="4" height="4" rx="1"/>',
  rings: '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="m10 4 2 3 2-3"/>',
  veil: '<path d="M12 3c-3 0-4 2-4 4l-4 14h16L16 7c0-2-1-4-4-4z"/><path d="M9 7h6"/>',
  star: '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
  party: '<path d="M5 21l2-9h2l2 9M13 21l2-9h2l2 9"/><circle cx="8" cy="7" r="2.5"/><circle cx="16" cy="7" r="2.5"/>',
  dress: '<path d="M9 3h6l-1 4 3 3-2 2 4 9H5l4-9-2-2 3-3z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.9 7.6-4.6M8.2 13.1l7.6 4.6"/>',
  pinterest: '<circle cx="12" cy="12" r="9"/><path d="M10.6 20.6 12.3 13"/><path d="M9.6 15.3c-1-.6-1.6-1.7-1.6-3.1 0-2.6 2-4.6 4.6-4.6 2.5 0 4.2 1.7 4.2 4 0 2.6-1.4 4.4-3.3 4.4-1 0-1.7-.6-1.6-1.6l.6-2.6"/>',
  facebook: '<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4A21 21 0 0 0 15.4 4c-2.3 0-3.9 1.4-3.9 4v2.5H9v3h2.5V21"/>',
  x: '<path d="M4 4h4.5L20 20h-4.5zM19.5 4l-6.3 7M10.8 13 4.5 20"/>',
  whatsapp: '<path d="M4 20l1.2-3.9A8.5 8.5 0 1 1 8 18.9z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l.8-1.6-2-1-1 .9a5 5 0 0 1-2.6-2.6l.9-1-1-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  swatch: '<rect x="3" y="3" width="8" height="18" rx="2"/><path d="m11 7 5-3 4 7-9 6"/><circle cx="7" cy="17" r="1"/>',
  glasses: '<circle cx="6.5" cy="14" r="4"/><circle cx="17.5" cy="14" r="4"/><path d="M10.5 14h3M2.5 14 4 8M21.5 14 20 8"/>',
  trousers: '<path d="M6 3h12l2 18h-5.5L12 10 9.5 21H4z"/><path d="M6 7h12"/>',
  proportion: '<rect x="6" y="2" width="12" height="20" rx="3"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="6" y1="16" x2="18" y2="16"/><circle cx="12" cy="9" r="1.5" fill="currentColor"/>'
};
export const icon = (name, size = 24) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// ---------- content blocks ----------
export const faqBlock = (faq) => `<section class="faq" aria-labelledby="faq"><h2 id="faq">Frequently asked questions</h2>${faq
  .map(([q, a], i) => `<details id="faq-${i + 1}"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`;

export const steps = (items) => `<ol class="steps">${items.map((s) => `<li>${s}</li>`).join('')}</ol>`;

export const sources = (list) => `<section class="sources" aria-labelledby="src"><h2 id="src">Sources and method</h2><ul>${list
  .map(([name, url, note]) => `<li><a href="${esc(url)}" rel="noopener">${esc(name)}</a>${note ? ': ' + esc(note) : ''}</li>`).join('')}</ul></section>`;

export const table = (caption, head, rows) => `<div class="table-wrap"><table><caption>${esc(caption)}</caption><thead><tr>${head
  .map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows
  .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;

export const callout = (html) => `<p class="callout">${html}</p>`;

export const toolShell = (id, label, controls, result, extra = '') => `<section class="tool" data-tool="${id}" aria-label="${esc(label)}">
${controls}
<div class="actions no-print">${extra}<button type="button" class="btn btn--ghost" data-copy>Copy link</button><button type="button" class="btn btn--ghost" data-print>Print</button></div>
<p class="sr" aria-live="polite" data-live></p>
<div class="result" data-result>${result}</div>
</section>`;

export const cards = (items) => `<ul class="cards">${items.map((t) => `<li class="card"><span class="card__icon">${icon(t.icon)}</span><h3><a href="${t.path}">${esc(t.name)}</a></h3><p>${esc(t.blurb)}</p></li>`).join('')}</ul>`;

// ---------- site chrome: header, search, share bar, footer ----------
// Share links are plain URLs (no third-party scripts); the native share sheet is offered where the browser has one.
function shareBar(page, url) {
  const pin = (page.body.match(/class="pin"><img src="([^"]+)"/) || [])[1] || site.ogImage.url;
  const u = encodeURIComponent(url), t = encodeURIComponent(titleCase(page.title)), d = encodeURIComponent(page.description);
  const links = [
    ['pinterest', 'Pinterest', `https://www.pinterest.com/pin/create/button/?url=${u}&media=${encodeURIComponent(abs(pin))}&description=${d}`],
    ['facebook', 'Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['x', 'X', `https://x.com/intent/post?url=${u}&text=${t}`],
    ['whatsapp', 'WhatsApp', `https://wa.me/?text=${t}%20${u}`],
    ['mail', 'Email', `mailto:?subject=${t}&body=${d}%0A%0A${u}`]
  ];
  return `<section class="share no-print" aria-labelledby="share-h"><h2 id="share-h">Share this page</h2><div class="share__row">
<button type="button" class="share__btn share__btn--native" data-share hidden>${icon('share', 20)}<span>Share</span></button>${links
    .map(([k, n, href]) => `<a class="share__btn share__btn--${k}" href="${esc(href)}" target="_blank" rel="noopener nofollow" aria-label="Share on ${n}">${icon(k, 20)}<span>${n}</span></a>`).join('')}
<button type="button" class="share__btn" data-share-copy aria-label="Copy link">${icon('link', 20)}<span>Copy link</span></button></div></section>`;
}

const GUIDES = [['Color guides', '/colors/'], ['Color seasons', '/seasons/'], ['Spring weddings', '/wedding-guest/spring/'], ['Summer weddings', '/wedding-guest/summer/'],
  ['Fall weddings', '/wedding-guest/fall/'], ['Winter weddings', '/wedding-guest/winter/']];
const COMPANY = [['About', '/about/'], ['Methodology', '/methodology/'], ['Contact and advertising', '/contact/'], ['Privacy', '/privacy/'], ['Terms', '/terms/']];
const linkList = (items) => `<ul>${items.map(([n, p]) => `<li><a href="${p}">${esc(n)}</a></li>`).join('')}</ul>`;

// Mobile menu is a <details> element, so it opens even before (or without) JavaScript.
const header = (nav) => `<header class="site-head"><div class="wrap site-head__in"><a class="logo" href="/" aria-label="${site.brand} home">${MARK(34)}<span>Simply<i>Stylo</i></span></a>
<nav class="nav" aria-label="Main">${nav}</nav>
<div class="head-act"><a class="icon-btn" href="/search/" data-search-open aria-label="Search">${icon('search', 22)}</a>
<details class="menu"><summary class="icon-btn" aria-label="Menu">${icon('menu', 22)}</summary><div class="menu__panel"><nav aria-label="Menu">
<div><p class="menu__h">Tools</p>${linkList(TOOLS.map((t) => [t.name, t.path]))}<p><a class="menu__all" href="/tools/">All tools</a></p></div>
<div><p class="menu__h">Guides</p>${linkList(GUIDES)}<p class="menu__h">${site.brand}</p>${linkList(COMPANY.slice(0, 3))}</div>
</nav></div></details></div></div></header>
<dialog class="search" id="search" aria-label="Search ${site.brand}"><form class="search__form" action="/search/" role="search">${icon('search', 22)}<label class="sr" for="search-q">Search tools and guides</label><input id="search-q" name="q" type="search" placeholder="Search tools and guides" autocomplete="off" enterkeyhint="search"><button type="button" class="icon-btn" data-search-close aria-label="Close search">${icon('close', 22)}</button></form><ul class="search__results" data-search-results></ul></dialog>`;

const footer = () => `<footer class="site-foot"><div class="wrap"><div class="foot-grid">
<section class="foot-col" aria-label="About ${site.brand}"><a class="logo" href="/" aria-label="${site.brand} home">${MARK(30)}<span>Simply<i>Stylo</i></span></a><p>${esc(site.tagline)} Free tools for colors, sizes, outfits and dresses. Everything runs in your browser: no sign-up, no uploads.</p><p><a class="btn btn--ghost" href="/contact/">Work with us</a></p></section>
<nav class="foot-col" aria-labelledby="foot-tools"><h2 class="foot-h" id="foot-tools">Popular tools</h2>${linkList([...TOOLS.slice(0, 7).map((t) => [t.name, t.path]), ['All tools', '/tools/']])}</nav>
<nav class="foot-col" aria-labelledby="foot-guides"><h2 class="foot-h" id="foot-guides">Guides and company</h2>${linkList([...GUIDES.slice(0, 2), ['Wedding guest outfits', '/wedding-guest/spring/'], ...COMPANY])}</nav>
</div><div class="foot-bar"><p>© ${site.founded} ${site.brand}. All rights reserved.</p><p>Independent · No paid placement in tool results</p></div></div></footer>`;

// ---------- page shell ----------
const NAV = [['Tools', '/tools/'], ['Colors', '/colors/'], ['Seasons', '/seasons/'], ['Color Analysis', '/tools/color-analysis/']];

// Title Case for page titles and H1s: every word starts with a capital letter ("vs" stays as is).
export function titleCase(str) {
  return String(str).split(' ').map((w) => (w === 'vs' ? w
    : w.split('-').map((part) => part.replace(/^([("']?)([a-z])/, (m, p1, c) => p1 + c.toUpperCase())).join('-'))).join(' ');
}

// The brand mark: an ink tile with a hand-drawn "S" stroke and the 60/30/10 palette bar the tools are built on.
export const MARK = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="15" fill="#111110"/><path d="M42 17.5c-2.6-3-6.2-4.5-10.4-4.5-6.2 0-10.6 3.4-10.6 8.6 0 11.8 22 7.4 22 19.2 0 5.6-4.8 9.2-11.4 9.2-4.6 0-8.6-1.8-11.6-5" fill="none" stroke="#FAF8F5" stroke-width="5.6" stroke-linecap="round"/><rect x="12" y="54" width="24" height="4" rx="2" fill="#B98A57"/><rect x="38" y="54" width="9" height="4" rx="2" fill="#1C2D22"/><rect x="49" y="54" width="3" height="4" rx="1.5" fill="#E8B9B0"/></svg>`;

function graph(page, url, crumbs) {
  const org = {
    '@type': 'Organization', '@id': abs('/#org'), name: site.brand, url: abs('/'), logo: abs('/icon-512.png'),
    email: site.email, foundingDate: site.founded, ...(site.sameAs.length ? { sameAs: site.sameAs } : {})
  };
  const website = { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: site.brand, description: site.description, publisher: { '@id': abs('/#org') }, inLanguage: site.lang };
  const webpage = {
    '@type': page.type === 'collection' || page.type === 'home' ? 'CollectionPage' : page.type === 'about' ? 'AboutPage' : page.type === 'contact' ? 'ContactPage' : 'WebPage',
    '@id': url + '#webpage', url, name: page.title, description: page.description, isPartOf: { '@id': abs('/#website') },
    inLanguage: site.lang, datePublished: page.datePublished, dateModified: page.dateModified,
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(site.ogImage.url) },
    ...(crumbs.length > 1 ? { breadcrumb: { '@id': url + '#breadcrumb' } } : {}),
    ...(page.about ? { about: page.about } : {})
  };
  const nodes = [org, website, webpage];
  if (crumbs.length > 1) nodes.push({
    '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
    itemListElement: crumbs.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(p) }))
  });
  if (page.app) nodes.push({
    '@type': 'WebApplication', '@id': url + '#app', name: page.app.name, url, description: page.app.description,
    applicationCategory: 'LifestyleApplication', operatingSystem: 'Any (web browser)', browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': abs('/#org') },
    ...(page.app.features ? { featureList: page.app.features } : {})
  });
  if (page.faq?.length) nodes.push({
    '@type': 'FAQPage', '@id': url + '#faq', mainEntity: page.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  });
  if (page.itemList) nodes.push({
    '@type': 'ItemList', '@id': url + '#list', itemListElement: page.itemList.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, url: abs(p) }))
  });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}

export function render(page, scriptSrc) {
  const url = abs(page.path);
  const crumbs = page.path === '/' ? [['Home', '/']] : [['Home', '/'], ...(page.crumbs || []), [page.crumb || page.h1 || page.title, page.path]];
  const title = titleCase(page.title);
  const fullTitle = page.path === '/' ? title : `${title} | ${site.brand}`;
  const body = page.body.replace(/<h1([^>]*)>([^<]*)<\/h1>/, (m, a, t) => `<h1${a}>${titleCase(t)}</h1>`);
  const nav = NAV.map(([n, p]) => `<a href="${p}"${page.path === p ? ' aria-current="page"' : ''}>${n}</a>`).join('');
  const crumbHtml = crumbs.length > 1 ? `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs
    .map(([n, p], i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${p}">${esc(n)}</a></li>`)).join('')}</ol></nav>` : '';
  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
${page.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">'}
<meta name="theme-color" content="#FAF8F5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E0F0E" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta property="og:site_name" content="${site.brand}">
<meta property="og:type" content="${page.type === 'article' ? 'article' : 'website'}">
<meta property="og:title" content="${esc(page.ogTitle || title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs(site.ogImage.url)}">
<meta property="og:image:width" content="${site.ogImage.width}">
<meta property="og:image:height" content="${site.ogImage.height}">
<meta property="og:image:alt" content="${esc(site.ogImage.alt)}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<style>${css}</style>
<script type="application/ld+json">${graph(page, url, crumbs)}</script>
<script type="speculationrules">{"prerender":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(nav)}
<main id="main"><div class="wrap">
${crumbHtml}
${body}
${page.noindex || page.noshare ? '' : shareBar(page, url)}
</div></main>
${footer()}
${scriptSrc ? `<script src="${scriptSrc}" defer></script>` : ''}
</body>
</html>
`;
}
