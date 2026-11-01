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
const NAV = [['Tools', '/tools/'], ['Colors', '/colors/'], ['Color analysis', '/tools/color-analysis/'], ['About', '/about/']];

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
  const fullTitle = page.path === '/' ? page.title : `${page.title} | ${site.brand}`;
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
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta property="og:site_name" content="${site.brand}">
<meta property="og:type" content="${page.type === 'article' ? 'article' : 'website'}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
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
<header class="site-head"><div class="wrap site-head__in"><a class="logo" href="/" aria-label="${site.brand} home">simplystylo<b>.</b></a><nav class="nav" aria-label="Main">${nav}</nav></div></header>
<main id="main"><div class="wrap">
${crumbHtml}
${page.body}
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
