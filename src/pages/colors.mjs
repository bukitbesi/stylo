// Color guide pages: each page has its own computed palette data plus hand-written pairings and outfit formulas.
import { createRequire } from 'node:module';
import { esc, faqBlock, table, cards, site } from '../layout.mjs';
import { COLOR_GUIDES } from '../data/colors.mjs';
import { TOOLS } from '../tools.mjs';

const require = createRequire(import.meta.url);
const C = require('../lib/color-core.js');
const U = require('../ui/common.js');
const CC = require('../ui/color-combination.js');
const PUBLISHED = '2026-11-01';

function guide(slug) {
  const g = COLOR_GUIDES[slug], n = C.bySlug(slug), h = C.harmonies(n.hex), p = C.outfitPalette(n.hex);
  const name = n.name, lower = name.toLowerCase(), Title = name.replace(/\b\w/g, (c) => c.toUpperCase());
  const pairs = g.pairs.map((s) => C.bySlug(s));
  const faq = [
    [`What colors go with ${lower}?`, `${name} goes best with ${pairs.slice(0, 4).map((x) => x.name.toLowerCase()).join(', ')} and ${pairs[4].name.toLowerCase()}. ${g.tip}`],
    [`What is a good ${lower} outfit?`, g.outfits[0] + ' Another easy option: ' + g.outfits[1].charAt(0).toLowerCase() + g.outfits[1].slice(1)],
    [`What is the complementary color of ${lower}?`, h.achromatic
      ? `${name} is a neutral, so it has no single complementary color; it pairs with almost every color.`
      : `On the color wheel, the complementary color of ${lower} (${n.hex}) is ${h.complementary[1]}, close to ${C.nearestNamed(h.complementary[1]).name.toLowerCase()}. In an outfit, keep the complementary color to a small accent.`]
  ];
  const harmonyGroups = h.achromatic
    ? [['Tonal steps', h.monochromatic]]
    : [['Complementary', h.complementary], ['Analogous', h.analogous], ['Split complementary', h.splitComplementary], ['Monochrome', h.monochromatic]];
  const body = `<p class="eyebrow">Color guide</p>
<h1>What Colors Go With ${esc(Title)}?</h1>
<p class="answer">${esc(name)} goes best with ${pairs.map((x) => x.name.toLowerCase()).join(', ')}. ${esc(g.intro)}</p>
<ul class="swatches">${U.swatch(n.hex, name)}${pairs.map((x) => U.swatch(x.hex, x.name)).join('')}</ul>
<figure class="pin"><img src="/pins/color-${slug}.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="What colors go with ${esc(lower)}: ${esc(pairs.map((x) => x.name.toLowerCase()).join(', '))}"><figcaption>Save this ${esc(lower)} color guide.</figcaption></figure>
<h2>${esc(name)} outfit formulas</h2>
<ol class="steps">${g.outfits.map((o) => `<li>${esc(o)}</li>`).join('')}</ol>
<p class="callout">${esc(g.tip)}</p>
<h2>The 60-30-10 split for ${esc(lower)}</h2>
${U.bar([p.dominant.hex, p.secondary.hex, p.accent.hex], 'pal--outfit')}
<p class="prose">${esc(CC.summary(n.hex))}</p>
<h2>${esc(name)} on the color wheel</h2>
<div class="grid2">${harmonyGroups.map(([t, hexes]) => `<div class="panel"><h3>${t}</h3>${U.bar(hexes)}<p class="meta-line">${hexes.join(' · ')}</p></div>`).join('')}</div>
<p class="prose">Want to try another shade of ${esc(lower)}? Open it in the <a href="/tools/color-combination/#c=${n.hex.slice(1)}">color combination finder</a> and adjust the hex code.</p>
${table(`${name} reference`, ['Property', 'Value'], [
    ['Reference hex', n.hex], ['Type', n.neutral ? 'Neutral' : 'Color'], ['Best neutrals', C.bestNeutrals(n.hex, 3).map((x) => x.name).join(', ')],
    ['Accent (split complementary)', p.accent.name]])}
${faqBlock(faq)}
<section class="related" aria-labelledby="rel"><h2 id="rel">Related tools</h2>${cards(TOOLS.filter((t) => ['color-combination', 'color-analysis', 'capsule-wardrobe'].includes(t.id)))}</section>`;
  return {
    path: `/colors/${slug}/`, type: 'article', title: `What Colors Go With ${Title}? Outfit Ideas`, crumb: name,
    ogTitle: `What Colors Go With ${Title}? 60-30-10 Outfit Planner & Capsule Guide`,
    crumbs: [['Colors', '/colors/']],
    description: `What colors go with ${lower}? ${name} pairs with ${pairs.slice(0, 4).map((x) => x.name.toLowerCase()).join(', ')}. Capsule neutrals, 60-30-10 outfits, and color matches.`,
    ogDescription: `See what colors go with ${lower} clothes: best capsule wardrobe neutrals, 60-30-10 outfit planner formulas, and color-wheel combinations.`,
    faq, body, datePublished: PUBLISHED, dateModified: site.dateModified,
    about: { '@type': 'Thing', name: `${name} clothing` },
    llms: `What colors go with ${lower}: ${pairs.map((x) => x.name.toLowerCase()).join(', ')}. ${g.intro} Outfits: ${g.outfits.join(' ')} Tip: ${g.tip}`
  };
}

function index() {
  const slugs = Object.keys(COLOR_GUIDES);
  const body = `<p class="eyebrow">Color guides</p>
<h1>What Colors Go Together? Clothing Color Guides</h1>
<p class="answer">These ${slugs.length} guides show what goes with the most-worn clothing colors, with outfit formulas and color-wheel matches for each. For any other shade, use the <a href="/tools/color-combination/">color combination finder</a>.</p>
<ul class="cards">${slugs.map((s) => {
    const n = C.bySlug(s);
    return `<li class="card"><span class="dot" style="background:${n.hex};width:44px;height:44px"></span><h2 style="font-size:1.15rem;margin:4px 0 0"><a href="/colors/${s}/">${esc(n.name)}</a></h2><p>Goes with ${COLOR_GUIDES[s].pairs.slice(0, 3).map((p) => C.bySlug(p).name.toLowerCase()).join(', ')}</p></li>`;
  }).join('')}</ul>`;
  return {
    path: '/colors/', type: 'collection', title: 'Clothing Color Guides: What Goes With What', crumb: 'Colors',
    ogTitle: 'Clothing Color Guides: Capsule Wardrobe Palettes & Outfit Combinations',
    description: `What colors go with navy, black, beige, olive, and burgundy: ${slugs.length} clothing color guides with 60-30-10 outfit planner formulas and capsule palettes.`,
    ogDescription: `Browse ${slugs.length} clothing color combination guides with 60-30-10 outfit formulas, best neutrals, and capsule wardrobe pairings.`,
    body, datePublished: PUBLISHED, dateModified: site.dateModified, itemList: slugs.map((s) => [C.bySlug(s).name, `/colors/${s}/`]),
    llms: `Color guides index: ${slugs.map((s) => C.bySlug(s).name).join(', ')}.`
  };
}

export default () => [index(), ...Object.keys(COLOR_GUIDES).map(guide)];
