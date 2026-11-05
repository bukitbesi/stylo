// The 12 season guide pages and the seasons index. Colors come from the season engine; notes from src/data/seasons.mjs.
import { createRequire } from 'node:module';
import { esc, faqBlock, table, cards, site } from '../layout.mjs';
import { SEASON_GUIDES } from '../data/seasons.mjs';
import { COLOR_GUIDES } from '../data/colors.mjs';
import { TOOLS } from '../tools.mjs';

const require = createRequire(import.meta.url);
const SE = require('../lib/season-core.js');
const C = require('../lib/color-core.js');
const U = require('../ui/common.js');
const PUBLISHED = '2026-11-01';
const IDS = Object.keys(SE.SEASONS);

const and = (list) => (list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1]);
const named = (hex) => C.nearestNamed(hex).name.toLowerCase();
const uniqueNames = (hexes, n) => [...new Set(hexes.map(named))].slice(0, n);
const swatchList = (hexes) => `<ul class="swatches">${hexes.map((h) => U.swatch(h, C.nearestNamed(h).name)).join('')}</ul>`;

// Color guides that sit closest to this season's palette, for internal links.
function relatedColors(s) {
  const slugs = Object.keys(COLOR_GUIDES);
  return slugs.map((slug) => ({ slug, d: Math.min(...[...s.palette, ...s.neutrals].map((h) => C.distance(h, C.bySlug(slug).hex))) }))
    .sort((a, b) => a.d - b.d).slice(0, 4).map((x) => x.slug);
}

export function pinPath(id) { return `/pins/season-${id}.jpg`; }

function guide(id) {
  const s = SE.SEASONS[id], g = SEASON_GUIDES[id], sister = SE.SEASONS[g.vs[0]];
  const best = uniqueNames(s.palette, 5), neutrals = uniqueNames(s.neutrals, 3), avoid = uniqueNames(s.avoid, 3);
  const family = IDS.filter((x) => SE.SEASONS[x].family === s.family);
  const faq = [
    [`What colors look best on a ${s.name}?`, `${s.name} looks best in ${s.traits} colors, for example ${and(best)}. Its best neutrals are close to ${and(neutrals)}.`],
    [`What colors should a ${s.name} avoid?`, `${s.name} should keep colors close to ${and(avoid)} away from the face, because they clash with ${s.traits} coloring. They still work in trousers, skirts, shoes and bags.`],
    [`What is the difference between ${s.name} and ${sister.name}?`, g.vs[1]],
    [`Which metals and makeup suit a ${s.name}?`, `Metals: ${g.metals} Makeup: ${g.makeup}`],
    [`How do I know if I am a ${s.name}?`, `Take the free 8-question color analysis quiz, then test this palette in daylight next to your face. If these colors make your skin look even and your eyes brighter than the ${sister.name} colors do, ${s.name} is likely your season.`]
  ];
  const body = `<p class="eyebrow">${esc(s.family)} family · Color season</p>
<h1>${esc(s.name)} Color Palette: Best Colors, Makeup and Outfits</h1>
<p class="answer">The ${esc(s.name)} palette is ${esc(s.traits)}: its best colors include ${esc(and(best))}; its neutrals are close to ${esc(and(neutrals))}; and it should keep ${esc(and(avoid))} away from the face.</p>
<p class="lede">${esc(g.intro)}</p>
<h2>${esc(s.name)} best colors</h2>
${swatchList(s.palette)}
<h2>${esc(s.name)} neutrals</h2>
${swatchList(s.neutrals)}
<h2>Colors to wear away from the face</h2>
${swatchList(s.avoid)}
<figure class="pin"><img src="${pinPath(id)}" width="1000" height="1500" loading="lazy" decoding="async" alt="${esc(s.name)} color palette: 10 best colors, 4 neutrals and 3 colors to avoid"><figcaption>Save this ${esc(s.name)} palette for shopping.</figcaption></figure>
<h2>Metals, makeup and hair</h2>
${table(`${s.name} styling guide`, ['Area', 'What suits ' + s.name], [['Metals', esc(g.metals)], ['Makeup', esc(g.makeup)], ['Hair colors', esc(g.hair)]])}
<h2>${esc(s.name)} outfit ideas</h2>
<ol class="steps">${g.outfits.map((o) => `<li>${esc(o)}</li>`).join('')}</ol>
<h2>${esc(s.name)} vs ${esc(sister.name)}</h2>
<p class="prose">${esc(g.vs[1])} See the <a href="/seasons/${g.vs[0]}/">${esc(sister.name)} palette</a> to compare.</p>
<h2>Not sure this is your season?</h2>
<p class="prose">Take the free <a href="/tools/color-analysis/">personal color analysis quiz</a> (8 questions, nothing uploaded), or compare the other ${esc(s.family)} seasons: ${family.filter((x) => x !== id).map((x) => `<a href="/seasons/${x}/">${esc(SE.SEASONS[x].name)}</a>`).join(' and ')}.</p>
<p class="prose">Color guides that match this palette: ${relatedColors(s).map((c) => `<a href="/colors/${c}/">${esc(C.bySlug(c).name)}</a>`).join(', ')}.</p>
<p class="callout">Seasonal color analysis is a styling guide, not a science. Swatches are reference colors: screens, lighting and fabrics change how they look, so always check colors in daylight next to your face.</p>
${faqBlock(faq)}
<section class="related" aria-labelledby="rel"><h2 id="rel">Related tools</h2>${cards(TOOLS.filter((t) => ['color-analysis', 'color-combination', 'capsule-wardrobe'].includes(t.id)))}</section>`;
  return {
    path: `/seasons/${id}/`, type: 'article', title: `${s.name} Color Palette: Colors, Makeup and Outfits`, crumb: s.name,
    ogTitle: `${s.name} Color Analysis Palette: Best Colors, Neutrals & Outfits`,
    crumbs: [['Color Seasons', '/seasons/']],
    description: `${s.name} color analysis palette: best colors like ${best.slice(0, 3).join(', ')}, capsule wardrobe neutrals, shades to avoid, makeup, and outfit ideas.`,
    ogDescription: `Explore the ${s.name} personal color analysis palette: 10 best clothing colors, 4 capsule wardrobe neutrals, jewelry metals, makeup, and outfit formulas.`,
    faq, body, datePublished: PUBLISHED, dateModified: site.dateModified, image: pinPath(id),
    about: { '@type': 'Thing', name: `${s.name} seasonal color palette` },
    llms: `${s.name} (${s.family} family): ${s.traits}. Best colors: ${s.palette.join(' ')} (${best.join(', ')}). Neutrals: ${s.neutrals.join(' ')}. Avoid near face: ${avoid.join(', ')}. Metals: ${g.metals} Sister season: ${sister.name}.`
  };
}

function index() {
  const body = `<p class="eyebrow">Seasonal color analysis</p>
<h1>The 12 Color Seasons: Palettes for Every Season</h1>
<p class="answer">The 12-season system groups people by three traits of their natural coloring: temperature (warm or cool), value (light or deep) and chroma (bright or soft). Each of the 4 families (Spring, Summer, Autumn, Winter) has 3 seasons, named after its strongest trait. Open a season to see its 10 best colors, neutrals, makeup and outfits.</p>
<p><a class="btn" href="/tools/color-analysis/">Find my season (free quiz)</a></p>
${['Spring', 'Summer', 'Autumn', 'Winter'].map((fam) => `<h2>${fam} seasons</h2><ul class="season-grid">${IDS.filter((id) => SE.SEASONS[id].family === fam).map((id) => {
    const s = SE.SEASONS[id];
    return `<li><h3><a href="/seasons/${id}/">${esc(s.name)}</a></h3>${U.bar(s.palette.slice(0, 8))}<p>${esc(s.traits.charAt(0).toUpperCase() + s.traits.slice(1))}.</p></li>`;
  }).join('')}</ul>`).join('')}
${table('Season traits at a glance', ['Season', 'Strongest trait', 'Sister season'], IDS.map((id) => [
    `<a href="/seasons/${id}/">${esc(SE.SEASONS[id].name)}</a>`, esc(SE.SEASONS[id].traits.split(',')[0]), esc(SE.SEASONS[SEASON_GUIDES[id].vs[0]].name)]))}
<p class="callout">Seasonal color analysis is a styling guide, not a science. Use the palettes as a starting point and trust what you see in daylight.</p>`;
  return {
    path: '/seasons/', type: 'collection', title: 'The 12 Color Seasons: Palettes and Guides', crumb: 'Color Seasons',
    ogTitle: 'The 12 Color Analysis Seasons: Palettes, Neutrals & Capsule Guides',
    description: 'All 12 personal color analysis seasons explained: Spring, Summer, Autumn, and Winter palettes with capsule wardrobe neutrals, makeup, and outfit ideas.',
    ogDescription: 'Compare all 12 personal color analysis seasons across Spring, Summer, Autumn, and Winter with best clothing colors, capsule neutrals, and outfit guides.',
    body, datePublished: PUBLISHED, dateModified: site.dateModified, itemList: IDS.map((id) => [SE.SEASONS[id].name, `/seasons/${id}/`]),
    llms: `12 color seasons index: ${IDS.map((id) => SE.SEASONS[id].name).join(', ')}. Traits: temperature, value, chroma.`
  };
}

export default () => [index(), ...IDS.map(guide)];
