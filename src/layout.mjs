// Page shell and content blocks. Everything a crawler needs (answer, tool result, tables, FAQ) is in the HTML.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  swatch: '<rect x="3" y="3" width="8" height="18" rx="2"/><path d="m11 7 5-3 4 7-9 6"/><circle cx="7" cy="17" r="1"/>'
};
export const icon = (name, size = 24) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// ---------- content blocks ----------
export const faqBlock = (faq) => `<section class="faq" aria-labelledby="faq"><h2 id="faq">Frequently asked questions</h2>${faq
  .map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`;

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

// ---------- page shell ----------
const NAV = [['Tools', '/tools/'], ['Colors', '/colors/'], ['Seasons', '/seasons/'], ['Color Analysis', '/tools/color-analysis/']];

// Title Case for page titles and H1s: every word starts with a capital letter ("vs" stays as is).
export function titleCase(str) {
  return String(str).split(' ').map((w) => (w === 'vs' ? w
    : w.split('-').map((part) => part.replace(/^([("']?)([a-z])/, (m, p1, c) => p1 + c.toUpperCase())).join('-'))).join(' ');
}

// The brand mark: an ink tile with a hand-drawn "S" stroke and the 60/30/10 palette bar the tools are built on.
export const MARK = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="15" fill="#171717"/><path d="M42 17.5c-2.6-3-6.2-4.5-10.4-4.5-6.2 0-10.6 3.4-10.6 8.6 0 11.8 22 7.4 22 19.2 0 5.6-4.8 9.2-11.4 9.2-4.6 0-8.6-1.8-11.6-5" fill="none" stroke="#F5F1E9" stroke-width="5.6" stroke-linecap="round"/><rect x="12" y="54" width="24" height="4" rx="2" fill="#B98A57"/><rect x="38" y="54" width="9" height="4" rx="2" fill="#9CAF94"/><rect x="49" y="54" width="3" height="4" rx="1.5" fill="#E8B9B0"/></svg>`;

function graph(page, url, crumbs) {
  const org = {
    '@type': 'Organization', '@id': abs('/#org'), name: site.brand, url: abs('/'), logo: abs('/icon-512.png'),
    email: site.email, foundingDate: site.founded, ...(site.sameAs.length ? { sameAs: site.sameAs } : {})
  };
  const website = { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: site.brand, description: site.description, publisher: { '@id': abs('/#org') }, inLanguage: site.lang };
  const webpage = {
    '@type': page.type === 'collection' || page.type === 'home' ? 'CollectionPage' : page.type === 'about' ? 'AboutPage' : 'WebPage',
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
<meta name="theme-color" content="#F5F1E9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#151514" media="(prefers-color-scheme: dark)">
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
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-head"><div class="wrap site-head__in"><a class="logo" href="/" aria-label="${site.brand} home">${MARK(34)}<span>Simply<i>Stylo</i></span></a><nav class="nav" aria-label="Main">${nav}</nav></div></header>
<main id="main"><div class="wrap">
${crumbHtml}
${body}
</div></main>
<footer class="site-foot"><div class="wrap">
<p><b>${site.brand}</b>: ${esc(site.tagline)} Free tools for colors, sizes and outfits. Everything runs in your browser; no sign-up.</p>
<nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/colors/">Color guides</a><a href="/about/">About</a><a href="/methodology/">Methodology</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
<p>© ${site.founded} ${site.brand}. All rights reserved.</p>
</div></footer>
${scriptSrc ? `<script src="${scriptSrc}" defer></script>` : ''}
</body>
</html>
`;
}
