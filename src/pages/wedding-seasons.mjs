// Seasonal wedding guest pages: each season shows its own colors, fabrics and outfits from the wedding guest engine.
import { createRequire } from 'node:module';
import { esc, faqBlock, table, cards, callout, site } from '../layout.mjs';
import { WEDDING_SEASONS } from '../data/wedding-seasons.mjs';
import { TOOLS } from '../tools.mjs';

const require = createRequire(import.meta.url);
const W = require('../lib/wedguest-core.js');
const D = require('../lib/dress-core.js');
const U = require('../ui/common.js');
const G = require('../lib/garments.js');
const PUBLISHED = '2026-11-02';
const NAMES = { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' };
const LOOKS = [['black-tie', 'evening', 'ballroom'], ['cocktail', 'evening', 'garden'], ['smart-casual', 'day', 'barn'], ['casual', 'day', 'beach']];

export const seasonPath = (s) => `/wedding-guest/${s}/`;
export const seasonPin = (s) => `/pins/wedding-guest-${s}.jpg`;
const list = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

function page(season) {
  const g = WEDDING_SEASONS[season], N = NAMES[season], lower = N.toLowerCase();
  const day = W.PALETTES[season].day.map((c) => c[0].toLowerCase()), eve = W.PALETTES[season].evening.map((c) => c[0].toLowerCase());
  const looks = LOOKS.map(([code, time, venue], i) => {
    const w = W.plan({ code, time, season, venue, style: 'womenswear', color: i % 4 }), m = W.plan({ code, time, season, venue, style: 'menswear', color: i % 4 });
    return { code, time, venue, w, m };
  });
  const cocktail = looks[1];
  const faq = [
    [`What should I wear to a ${lower} wedding?`, `${g.lead} By day, colors such as ${list(day)} work well; for evening, ${list(eve)}. ${g.fabrics}`],
    [`What colors are best for a ${lower} wedding guest?`, `Daytime: ${list(day)}. Evening: ${list(eve)}. Avoid white, ivory, cream and beige unless the couple asks for them.`],
    [`What shoes should I wear to a ${lower} wedding?`, g.shoes],
    [`What should a man wear to a ${lower} wedding?`, `For a cocktail or semi-formal ${lower} wedding: ${cocktail.m.pieces.map((p) => p[0].toLowerCase()).join(', ')}.`],
    [`Do I need a jacket or coat for a ${lower} wedding?`, `${g.layers} ${g.weather}`]
  ];
  const body = `<p class="eyebrow">Wedding guest guide · ${esc(N)}</p>
<h1>What to Wear to a ${esc(N)} Wedding: Guest Outfit Ideas</h1>
<p class="answer">${esc(g.lead)} Best daytime colors: ${esc(list(day))}; best evening colors: ${esc(list(eve))}. Avoid white, ivory, cream and beige unless the couple asks.</p>
<h2>${esc(N)} wedding guest colors</h2>
<h3>Daytime</h3><ul class="swatches">${W.PALETTES[season].day.map((c) => U.swatch('#' + c[1], c[0])).join('')}</ul>
<h3>Evening</h3><ul class="swatches">${W.PALETTES[season].evening.map((c) => U.swatch('#' + c[1], c[0])).join('')}</ul>
<h2>${esc(N)} wedding guest outfits by dress code</h2>
<ul class="looks looks--wide">${looks.map((l) => `<li><a href="/tools/wedding-guest-outfit/#c=${l.code}&t=${l.time}&s=${season}&v=${l.venue}&g=womenswear&i=${LOOKS.findIndex((x) => x[0] === l.code) % 4}">${D.svg(l.w.dress, { id: `ws-${season}-${l.code}`, width: 130 })}<span><b>${esc(W.CODES[l.code])}</b><br>${esc(W.TIMES[l.time].split(' (')[0])}, ${esc(W.VENUES[l.venue].toLowerCase())}</span></a></li>`).join('')}</ul>
${table(`${N} wedding guest outfits`, ['Dress code', 'Womenswear', 'Menswear'], looks.map((l) => [esc(W.CODES[l.code]),
    esc(l.w.pieces.slice(0, 3).map((p) => p[0]).join(', ')), esc(l.m.pieces.slice(0, 3).map((p) => p[0]).join(', '))]))}
<p class="prose">Change the dress code, time, venue or color for your wedding in the <a href="/tools/wedding-guest-outfit/#s=${season}">wedding guest outfit finder</a>, or design the exact dress in the <a href="/tools/dress-designer/">dress designer</a>.</p>
<h2>Fabrics, shoes and layers</h2>
${table(`What works for a ${lower} wedding`, ['Item', 'Advice'], [['Fabrics', esc(g.fabrics)], ['Shoes', esc(g.shoes)], ['Layers', esc(g.layers)], ['Avoid', esc(g.avoid)]])}
<figure class="pin"><img src="${seasonPin(season)}" width="1000" height="1500" loading="lazy" decoding="async" alt="What to wear to a ${esc(lower)} wedding: four guest dresses and the ${esc(lower)} color palette"><figcaption>Save this ${esc(lower)} wedding guest guide.</figcaption></figure>
${callout(esc(g.weather) + ' Wedding customs differ between cultures; the couple\'s guidance always comes first.')}
<p class="prose">Other seasons: ${Object.keys(NAMES).filter((s) => s !== season).map((s) => `<a href="${seasonPath(s)}">${NAMES[s]} weddings</a>`).join(', ')}.</p>
${faqBlock(faq)}
<section class="related" aria-labelledby="rel"><h2 id="rel">Related tools</h2>${cards(TOOLS.filter((t) => ['wedding-guest', 'dress-designer', 'dress-code'].includes(t.id)))}</section>`;
  return {
    path: seasonPath(season), type: 'article', title: `What to Wear to a ${N} Wedding: Guest Outfit Ideas`, crumb: `${N} weddings`,
    crumbs: [['Tools', '/tools/'], ['Wedding Guest Outfit Finder', '/tools/wedding-guest-outfit/']],
    description: `What to wear to a ${lower} wedding: ${list(day.slice(0, 2))} by day, ${list(eve.slice(0, 2))} at night, plus fabrics, shoes and outfits for every dress code.`,
    faq, body, datePublished: PUBLISHED, dateModified: site.dateModified,
    about: { '@type': 'Thing', name: `${N} wedding guest attire` },
    llms: `What to wear to a ${lower} wedding: ${g.lead} Day colors ${list(day)}; evening ${list(eve)}. Fabrics: ${g.fabrics} Shoes: ${g.shoes} Layers: ${g.layers}`
  };
}

export default () => Object.keys(NAMES).map(page);
