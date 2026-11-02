// The five tool pages and the tools index. Numbers quoted in answers, tables and FAQs come from the engines,
// so the text can never drift from what the tool shows.
import { createRequire } from 'node:module';
import { esc, faqBlock, steps, sources, table, callout, toolShell, cards, longDate, site, icon } from '../layout.mjs';
import { TOOLS, related } from '../tools.mjs';

const require = createRequire(import.meta.url);
const C = require('../lib/color-core.js');
const S = require('../lib/size-core.js');
const SE = require('../lib/season-core.js');
const K = require('../lib/capsule-core.js');
const O = require('../lib/outfit-core.js');
const CC = require('../ui/color-combination.js');
const SZ = require('../ui/size-converter.js');
const CA = require('../ui/color-analysis.js');
const CW = require('../ui/capsule-wardrobe.js');
const OG = require('../ui/outfit-generator.js');
const B = require('../lib/body-core.js');
const R = require('../lib/ring-core.js');
const P = require('../lib/cpw-core.js');
const PL = require('../lib/palette-core.js');
const BS = require('../ui/body-shape.js');
const RS = require('../ui/ring-size.js');
const CW2 = require('../ui/cost-per-wear.js');
const PP = require('../ui/photo-palette.js');
const S2 = require('../lib/selfie-core.js');
const SF = require('../ui/selfie-analysis.js');
const WCore = require('../lib/wardrobe-core.js');
const WC = require('../ui/wardrobe-colors.js');
const PKCore = require('../lib/packing-core.js');
const PK = require('../ui/packing-list.js');
const DCore = require('../lib/dresscode-core.js');
const DC = require('../ui/dress-code.js');

const PUBLISHED = '2026-11-01';
const MODIFIED = site.dateModified;
const verifiedLine = (iso) => `<p class="meta-line">Method verified ${longDate(iso)} · Free · No sign-up · Runs in your browser</p>`;
const relatedBlock = (id) => `<section class="related" aria-labelledby="rel"><h2 id="rel">Related tools</h2>${cards(related(id))}</section>`;
const tool = (id) => TOOLS.find((t) => t.id === id);
const f = (x) => String(x).replace(/\.0$/, '');

// ---------- Color Combination Finder ----------
function colorCombination() {
  const olive = C.bySlug('olive-green').hex;
  const op = C.outfitPalette(olive);
  const navyN = C.bestNeutrals(C.bySlug('navy').hex, 3).map((n) => n.name.toLowerCase());
  const faq = [
    ['What colors go with olive green clothes?', CC.summary(olive) + ' Olive also works with rust, cream and denim for an easy earthy look.'],
    ['What is the 60-30-10 rule in fashion?', 'The 60-30-10 rule splits an outfit into one main color on about 60% of what you wear (usually a neutral such as a coat or trousers), a second color on about 30% (a top or dress) and an accent on about 10% (a bag, scarf or shoes). It keeps outfits balanced, and the finder suggests all three for any color.'],
    ['What are the safest neutral colors for clothes?', 'Black, white, gray, navy, beige, camel, ivory and brown are the classic clothing neutrals: they have little or no hue, so they pair with almost any color. Denim blue and khaki behave like neutrals too. For navy the finder ranks ' + navyN.join(', ') + ' as the best partners.'],
    ['What does complementary mean for outfit colors?', 'Complementary colors sit opposite each other on the color wheel, 180 degrees apart, such as blue and orange or red and green. They give the strongest contrast, so most stylists keep one of them small, for example a navy outfit with a rust scarf.'],
    ['Can you wear navy and black together?', 'Yes. Navy and black are both dark neutrals; the look works best when the difference is clear, for example a navy coat over black trousers, or when a lighter third color such as white or camel separates them.'],
    ['How many colors should one outfit have?', 'A common styling guideline is three colors or fewer, not counting denim and small metallics. Neutrals can be combined freely; add one or two colors on top, using the 60-30-10 split for balance.'],
    ['Are the colors on screen exactly like real fabric?', 'No. Screens, lighting and fabric texture all change how a color looks, so the swatches are references. The hex code for any color you pick is shown so you can compare it with a product photo, and it is best to check fabric in daylight.']
  ];
  const body = `<p class="eyebrow">Free color tool</p>
<h1>What Colors Go Together? Find Your Outfit Combination</h1>
<p class="answer">${esc(CC.summary(olive))} Pick any clothing color below to see its best neutrals, a ready 60-30-10 outfit split and five color-wheel combinations.</p>
${verifiedLine(C.FACTS.verified)}
${toolShell('color-combination', 'Color combination finder', CC.controls(CC.DEFAULT), CC.result(CC.DEFAULT))}
<h2>How the color combination finder works</h2>
${steps([
    '<b>Pick a color</b> from the clothing colors, the color picker or a hex code from a product page.',
    '<b>Read the 60-30-10 split.</b> The main color is the neutral that contrasts most with your pick; your color is the second; the accent comes from the split-complementary pair.',
    '<b>Choose a combination style.</b> Complementary is bold, analogous is calm, monochrome is always polished.',
    '<b>Copy the link or print</b> to keep the palette for shopping. The link reopens the same color.'])}
<h2>Worked example: olive green</h2>
<p class="prose">Olive green (${olive}) gets <b>${esc(op.dominant.name.toLowerCase())}</b> as its main neutral and <b>${esc(op.accent.name.toLowerCase())}</b> as its accent. In practice: ${esc(op.dominant.name.toLowerCase())} trousers or coat, an olive top or jacket, and the accent only in a bag or scarf.</p>
<h2>Color combination cheat sheet</h2>
${table('Best neutrals and accent for popular clothing colors', ['Color', 'Best neutrals', 'Accent'], ['navy', 'black', 'beige', 'olive-green', 'burgundy', 'blush-pink', 'emerald-green', 'mustard-yellow'].map((slug) => {
    const n = C.bySlug(slug), p = C.outfitPalette(n.hex);
    return [`<a href="/colors/${slug}/">${esc(n.name)}</a>`, C.bestNeutrals(n.hex, 3).map((x) => esc(x.name)).join(', '), esc(p.accent.name)];
  }))}
<p class="prose">See the full <a href="/colors/">color guides</a> for outfit formulas for each color.</p>
${callout('Color pairing is a guide, not a rule. Your own coloring, the fabric and the occasion all matter; if you want colors that suit your skin, hair and eyes, try the <a href="/tools/color-analysis/">personal color analysis</a>.')}
${sources([
    ['WCAG 2.2: contrast ratio and relative luminance (W3C)', 'https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio', 'used to pick readable text on swatches and rank contrast'],
    ['Oklab perceptual color space (Björn Ottosson)', 'https://bottosson.github.io/posts/oklab/', 'used to measure how different two colors look'],
    ['Color wheel and color harmony (Wikipedia)', 'https://en.wikipedia.org/wiki/Color_scheme', 'complementary, analogous, triadic and split-complementary schemes'],
    ['SimplyStylo methodology', '/methodology/', 'how every tool is built and checked']])}
${faqBlock(faq)}
${relatedBlock('color-combination')}`;
  return {
    path: '/tools/color-combination/', type: 'tool', title: 'What Colors Go Together? Outfit Color Combination Tool', crumb: 'Color Combination Finder',
    crumbs: [['Tools', '/tools/']],
    description: 'Find which colors go with any clothing color: best neutrals, a 60-30-10 outfit split and complementary, analogous and monochrome combinations.',
    bundle: 'color-combination', faq, body, datePublished: PUBLISHED, dateModified: MODIFIED,
    app: { name: tool('color-combination').name, description: tool('color-combination').blurb, features: ['60-30-10 outfit palette', 'Best neutrals', 'Complementary, analogous, triadic, split-complementary and monochrome schemes', 'Hex input'] },
    about: { '@type': 'Thing', name: 'Clothing color combinations' },
    llms: `Color Combination Finder: free tool that returns the best neutrals, a 60-30-10 outfit split and five color-wheel schemes for any clothing color or hex code. Example: ${CC.summary(olive)} Neutrals ranked by Oklab distance; harmonies by HSL hue rotation.`
  };
}

// ---------- International Size Converter ----------
function sizeConverter() {
  const uk8 = S.convertShoe('uk', 8), eu38 = S.convertShoe('eu', 38), w4 = S.womenClothing(4), j40 = S.menJacket(40);
  const faq = [
    ['What is a UK 8 shoe in US size?', `A UK 8 is about a US men's ${f(uk8.usMen)} and a US women's ${uk8.usWomen.join('–')}, and about EU ${f(uk8.eu)}. It fits a foot of roughly ${uk8.footCm} cm (${uk8.footIn} in). US men's sizes are one size above UK; US women's are two to two and a half above UK, depending on the brand.`],
    ['What is EU 38 in US women\'s shoes?', `EU 38 is about a US women's ${eu38.usWomen.join('–')} and a UK ${f(eu38.uk)}, for a foot about ${eu38.footCm} cm long. Many brands label EU 38 as UK 5, so check the brand's chart; differences of half a size are normal.`],
    ['What is a US size 4 dress in UK and EU sizes?', `A US women's 4 is a UK ${w4.uk}, an AU ${w4.au} and an EU ${w4.eu}. The rule of thumb is UK = US + 4 and EU = US + 32 on most international retailer charts.`],
    ['What is a US 40 suit in European sizes?', `A US or UK 40 suit jacket is an EU ${j40.eu}. European jacket sizes are 10 more than the US/UK chest size in inches; a 40 fits a chest of about ${j40.chestCm} cm.`],
    ['What is a 15.5 inch collar in centimeters?', `A 15.5 inch shirt collar is ${S.collar(15.5).cm} cm, and a 16 inch collar is ${S.collar(16).cm} cm. Collar sizes convert directly: centimeters = inches × 2.54, rounded to the nearest whole number.`],
    ['How do I measure my foot length for shoe size?', 'Stand on paper with your heel against a wall, mark the tip of your longest toe, and measure from the wall to the mark in centimeters. Measure both feet in the evening and use the longer one. Enter that length in the converter under "Foot length (cm)".'],
    ['Why is my shoe size different between brands?', 'Each brand designs its own lasts (the foot-shaped molds shoes are built on) and rounds sizes differently, and US women\'s sizing uses two scales. Brands can differ by half to one size, so foot length in centimeters or Mondopoint (millimeters) is the most reliable number to compare.']
  ];
  const shoeRows = S.shoeTable().map((r) => [f(r.uk), f(r.usMen), r.usWomen.join('–'), f(r.eu), `${r.footCm} cm / ${r.footIn} in`]);
  const body = `<p class="eyebrow">Free size tool</p>
<h1>International Size Converter: Shoes, Dresses and Suits</h1>
<p class="answer">A UK 8 shoe is about a US men's ${f(uk8.usMen)}, a US women's ${uk8.usWomen.join('–')} and an EU ${f(uk8.eu)}; a US size 4 dress is a UK ${w4.uk} and an EU ${w4.eu}. Choose what you want to convert below to get every system at once, with foot length in centimeters and inches.</p>
${verifiedLine(S.FACTS.verified)}
${toolShell('size-converter', 'International size converter', SZ.controls(SZ.DEFAULT), SZ.result(SZ.DEFAULT))}
<h2>How the size converter works</h2>
${steps([
    '<b>Shoes</b> are converted through foot length: each size system is a fixed formula of foot length, so any size can be turned into centimeters and back.',
    '<b>Women\'s clothing</b> uses the offsets retailer charts agree on: UK and AU are US + 4, EU is US + 32.',
    '<b>Men\'s jackets</b> use the chest size in inches for US and UK; EU is that number + 10.',
    '<b>Shirt collars</b> are a straight inch-to-centimeter conversion.'])}
<h2>Shoe size conversion chart (adult)</h2>
${table('UK, US and EU shoe sizes with foot length', ['UK', "US men's", "US women's", 'EU', 'Foot length'], shoeRows)}
<h2>Women's clothing size chart</h2>
${table("Women's dress and top sizes", ['US', 'UK', 'AU', 'EU'], S.womenTable().map((r) => [r.us, r.uk, r.au, r.eu]))}
<h2>Men's suit and shirt size charts</h2>
${table("Men's suit and jacket sizes", ['US / UK', 'EU', 'Chest'], S.menJacketTable().map((r) => [r.us, r.eu, `${r.us} in / ${r.chestCm} cm`]))}
${table("Men's shirt collar sizes", ['Inches', 'Centimeters'], S.collarTable().map((r) => [f(r.in), r.cm]))}
${callout('Conversions are approximate. Sizes are not standardized across brands, US women\'s shoes use two scales (UK + 2 and UK + 2.5), and French and Italian dress numbers are left out because published charts disagree on them. Always check the brand\'s own measurement chart before you buy.')}
<h2>The formulas</h2>
<ul class="prose">
<li>${esc(S.FACTS.shoe.uk)}</li><li>${esc(S.FACTS.shoe.usMen)}</li><li>${esc(S.FACTS.shoe.usWomen)}</li><li>${esc(S.FACTS.shoe.eu)}</li><li>${esc(S.FACTS.shoe.mondo)}</li>
</ul>
${sources([
    ['Shoe size: formulas for UK, US, Continental (Paris point) and Mondopoint systems (Wikipedia)', 'https://en.wikipedia.org/wiki/Shoe_size'],
    ['ISO 9407:2019 Footwear sizing: Mondopoint system of sizing and marking', 'https://www.iso.org/standard/71594.html'],
    ['EN 13402: European standard for clothing size labels (Wikipedia)', 'https://en.wikipedia.org/wiki/EN_13402'],
    ['Dress size conversion chart (Finder)', 'https://www.finder.com.au/dress-size-conversion-chart', 'US 4 = UK 8 = AU 8 = EU 36'],
    ['European vs US suit sizing (Edit Suits)', 'https://www.editsuits.com/blogs/news/european-vs-us-suit-sizing-what-s-the-difference', 'EU = US + 10, e.g. US 40 = EU 50']])}
${faqBlock(faq)}
${relatedBlock('size-converter')}`;
  return {
    path: '/tools/size-converter/', type: 'tool', title: 'Size Converter: US, UK, EU Shoe and Clothing Sizes', crumb: 'International Size Converter',
    crumbs: [['Tools', '/tools/']],
    description: `Convert shoe, dress, suit and shirt collar sizes between US, UK, EU and AU. UK 8 shoe = US men's ${f(uk8.usMen)} = EU ${f(uk8.eu)}. Charts and foot length included.`,
    bundle: 'size-converter', faq, body, datePublished: PUBLISHED, dateModified: MODIFIED,
    app: { name: tool('size-converter').name, description: tool('size-converter').blurb, features: ['Adult shoe sizes UK, US men, US women, EU, Mondopoint', "Women's dress sizes US, UK, AU, EU", "Men's suit sizes", 'Shirt collar inches to cm'] },
    about: { '@type': 'Thing', name: 'Clothing and shoe size conversion' },
    llms: `International Size Converter: adult shoe sizes via foot length (UK ≈ 3 × foot in − 23; US men = UK + 1; US women = UK + 2 to 2.5; EU ≈ 1.5 × foot cm + 2; Mondopoint = foot mm). UK 8 = US men ${f(uk8.usMen)} = US women ${uk8.usWomen.join('–')} = EU ${f(uk8.eu)} (foot ${uk8.footCm} cm). Women's clothing: UK = AU = US + 4, EU = US + 32 (US 4 = UK 8 = EU 36). Men's jackets: EU = US/UK chest + 10 (40 = EU 50). Collar 15.5 in = 39 cm.`
  };
}

// ---------- Personal Color Analysis ----------
function colorAnalysis() {
  const seasons = Object.entries(SE.SEASONS);
  const faq = [
    ['What is personal color analysis?', 'Personal color analysis matches clothing and makeup colors to your natural coloring: skin undertone, hair and eyes. The popular seasonal method sorts people into Spring, Summer, Autumn and Winter, an idea made famous by Carole Jackson\'s 1980 book Color Me Beautiful; the 12-season version splits each season into three.'],
    ['What are the 12 color seasons?', 'The 12 seasons are ' + seasons.map(([, s]) => s.name).join(', ') + '. Each is defined by its strongest trait: light, deep, bright, soft, warm or cool.'],
    ['How do I know if my undertone is warm or cool?', 'Look at the veins on your inner wrist in daylight (blue or purple suggests cool, green suggests warm), compare gold and silver jewelry next to your face, and compare pure white with cream. If the clues disagree you are probably neutral, and the quiz then leans on your hair, eyes and contrast instead.'],
    ['Is an online color analysis quiz accurate?', 'A quiz is a good starting point but not a professional draping. It relies on your own judgment of your coloring, and lighting, screens and hair dye can mislead. Use your result to test colors in daylight; if a color makes your skin look even and your eyes brighter, it works for you.'],
    ['What colors should I avoid for my season?', 'Each result lists three colors to keep away from your face, for example black for Light Spring or orange for Cool Summer. You can still wear them in trousers, skirts, shoes and bags, where they do not reflect onto your face.'],
    ['Can people with deep or dark skin be any season?', 'Yes. Seasons describe the relationship between undertone, depth and clarity, not skin depth alone, so people with deep skin can be any season. Deep and Winter results are common because hair and eyes are often dark, but bright, warm and soft results are just as possible.'],
    ['Does dyed hair change my color season?', 'Your season comes from your natural coloring, so answer the hair question with your natural color. Hair dye can make some palette colors look better or worse, and many people pick a dye that suits their season.']
  ];
  const body = `<p class="eyebrow">Free color quiz</p>
<h1>Personal Color Analysis Quiz: Find Your Color Season</h1>
<p class="answer">Personal color analysis matches colors to your undertone, depth and contrast; this 8-question quiz places you in one of 12 color seasons and shows 10 best colors, 4 neutrals and 3 colors to keep away from your face. It takes about two minutes and nothing is uploaded.</p>
${verifiedLine(SE.FACTS.verified)}
${toolShell('color-analysis', 'Personal color analysis quiz', CA.controls({}), CA.result({}), '<button type="button" class="btn btn--ghost" data-reset>Start over</button>')}
<h2>How the color analysis quiz works</h2>
${steps([
    '<b>Temperature (warm or cool)</b> comes from your veins, jewelry, the white that flatters you and how you tan.',
    '<b>Value (light or deep)</b> comes from your natural hair color and skin depth.',
    '<b>Chroma (bright or soft)</b> comes from your eyes and the contrast between your hair, skin and eyes.',
    '<b>Your season</b> is named after your strongest trait, and your second-strongest trait picks between the two seasons that share it; for example, light and cool gives Light Summer.'])}
<h2>The 12 color seasons at a glance</h2>
${table('The 12 seasons, their traits and sample colors', ['Season', 'Traits', 'Sample palette'], seasons.map(([id, s]) => [
    `<a href="/seasons/${id}/">${esc(s.name)}</a>`, esc(s.traits), `<span class="pal" style="min-height:24px;margin:0;width:180px">${s.palette.slice(0, 6).map((h) => `<span style="background:${h}"></span>`).join('')}</span>`]))}
${callout('This quiz is a self-assessment guide, not a professional color draping. Lighting, screens and makeup change how colors look; test your palette in daylight, next to your face.')}
${sources([
    ['Carole Jackson and Color Me Beautiful (Wikipedia)', 'https://en.wikipedia.org/wiki/Carole_Jackson', 'origin of the four-season system (1980)'],
    ['Munsell color system: hue, value and chroma (Wikipedia)', 'https://en.wikipedia.org/wiki/Munsell_color_system', 'the three dimensions behind the 12-season model'],
    ['SimplyStylo methodology', '/methodology/', 'how the quiz scores are calculated']])}
${faqBlock(faq)}
${relatedBlock('color-analysis')}`;
  return {
    path: '/tools/color-analysis/', type: 'tool', title: 'Personal Color Analysis Quiz: Find Your Season', crumb: 'Personal Color Analysis',
    crumbs: [['Tools', '/tools/']],
    description: 'Free 8-question personal color analysis quiz. Find your color season out of 12 and get your best colors, neutrals and colors to avoid.',
    bundle: 'color-analysis', faq, body, datePublished: PUBLISHED, dateModified: MODIFIED,
    app: { name: tool('color-analysis').name, description: tool('color-analysis').blurb, features: ['12-season result', '10 best colors', '4 neutrals', 'Colors to avoid near the face'] },
    about: { '@type': 'Thing', name: 'Seasonal color analysis' },
    llms: `Personal Color Analysis quiz: 8 questions score temperature (warm/cool), value (light/deep) and chroma (bright/soft); the strongest trait names one of 12 seasons (${seasons.map(([, s]) => s.name).join(', ')}). Each result gives 10 best colors, 4 neutrals and 3 colors to avoid near the face. Self-assessment guide, not professional draping.`
  };
}

// ---------- Capsule Wardrobe Planner ----------
function capsule() {
  const w25 = K.build({ wardrobe: 'women', size: 25 }), m25 = K.build({ wardrobe: 'men', size: 25 });
  const splitRows = [];
  for (const w of ['women', 'men']) for (const n of [15, 25, 35]) {
    const c = K.SPLITS[w][n], r = K.build({ wardrobe: w, size: n });
    splitRows.push([`${w === 'women' ? "Women's" : "Men's"} ${n}`, c.tops, c.bottoms, c.onePiece, c.layers, c.shoes, r.outfits]);
  }
  const faq = [
    ['How many outfits can you make from a 25-piece capsule wardrobe?', `With SimplyStylo's women's split, 25 pieces give ${w25.outfits} outfits: ${w25.counts.tops} tops × ${w25.counts.bottoms} bottoms + ${w25.counts.onePiece} dresses. The men's 25-piece split gives ${m25.outfits} (${m25.counts.tops} tops × ${m25.counts.bottoms} bottoms). Changing shoes multiplies that again, to ${w25.withShoes} and ${m25.withShoes} looks.`],
    ['What is a capsule wardrobe?', 'A capsule wardrobe is a small set of versatile clothes that all work together, so you can make many outfits from few pieces. The term is credited to London boutique owner Susie Faux in the 1970s, and Donna Karan popularized the idea with her 1985 "Seven Easy Pieces" collection.'],
    ['What counts as a piece in a capsule wardrobe?', 'Tops, bottoms, dresses, layers (blazers, cardigans, coats) and shoes count. Underwear, sleepwear, workout clothes, and usually jewelry and bags do not. The planner counts shoes because they change what an outfit can be worn for.'],
    ['How do I choose colors for a capsule wardrobe?', 'Pick one main neutral for about 60% of pieces (navy, black, charcoal or camel), a second neutral for about 30% (white, ivory, gray or denim) and one accent for about 10%. Because every piece matches the same palette, everything combines.'],
    ['Should I start with 15, 25 or 35 pieces?', 'Fifteen pieces suits a minimalist or a travel capsule, 25 is the classic seasonal capsule, and 35 suits someone with both an office and a busy social calendar. Start smaller than you think; you can always add.'],
    ['How do I build a capsule wardrobe for a hot climate?', 'Choose "Hot or tropical": the planner swaps one layer for an extra top, prefers linen, cotton and sandals, and leaves out wool coats and boots. Keep one light layer for air-conditioned offices.'],
    ["What should a men's capsule wardrobe include?", `A men's 25-piece capsule from the planner includes ${m25.groups.map((g) => `${g.items.length} ${g.label.toLowerCase()}`).join(', ')}, built around basics such as a white T-shirt, Oxford shirt, dark jeans, chinos, a navy blazer and white leather sneakers.`]
  ];
  const body = `<p class="eyebrow">Free wardrobe planner</p>
<h1>Capsule Wardrobe Planner and Printable Checklist</h1>
<p class="answer">A 25-piece capsule wardrobe makes ${w25.outfits} outfits for women (${w25.counts.tops} tops × ${w25.counts.bottoms} bottoms + ${w25.counts.onePiece} dresses) and ${m25.outfits} for men. Choose your wardrobe, size, lifestyle, climate and colors below to get a ready checklist you can print.</p>
${verifiedLine(K.FACTS.verified)}
${toolShell('capsule-wardrobe', 'Capsule wardrobe planner', CW.controls(CW.DEFAULT), CW.result(CW.DEFAULT))}
<h2>How the capsule wardrobe planner works</h2>
${steps([
    '<b>Size sets the split</b> between tops, bottoms, dresses, layers and shoes (see the table below).',
    '<b>Lifestyle ranks the pieces.</b> Each piece in our library is tagged for work, casual and smart occasions, and the best matches for your week are chosen first.',
    '<b>Climate adjusts</b> the mix: hot climates trade a layer for a top and drop wool and boots; cold climates do the opposite.',
    '<b>Colors follow 60/30/10.</b> Pieces whose color is in their name, such as white sneakers, keep it; the rest are assigned your main neutral, second neutral and accent.'])}
<h2>Capsule wardrobe splits and outfit counts</h2>
${table('Pieces per category and outfits (tops × bottoms + dresses), temperate climate', ['Capsule', 'Tops', 'Bottoms', 'Dresses', 'Layers', 'Shoes', 'Outfits'], splitRows)}
${callout('Outfit counts are combinations, not a promise that every pairing suits every occasion. Use the checklist to shop what you are missing, not to replace what already works.')}
${sources([
    ['Capsule wardrobe (Wikipedia)', 'https://en.wikipedia.org/wiki/Capsule_wardrobe', 'history: Susie Faux (1970s) and Donna Karan (1985)'],
    ['SimplyStylo methodology', '/methodology/', 'how pieces are ranked and outfits are counted']])}
${faqBlock(faq)}
${relatedBlock('capsule-wardrobe')}`;
  return {
    path: '/tools/capsule-wardrobe/', type: 'tool', title: 'Capsule Wardrobe Planner: Free Printable Checklist', crumb: 'Capsule Wardrobe Planner',
    crumbs: [['Tools', '/tools/']],
    description: `Plan a 15, 25 or 35 piece capsule wardrobe for women or men. 25 pieces = ${w25.outfits} outfits. Printable checklist, color palette and climate options.`,
    bundle: 'capsule-wardrobe', faq, body, datePublished: PUBLISHED, dateModified: MODIFIED,
    app: { name: tool('capsule-wardrobe').name, description: tool('capsule-wardrobe').blurb, features: ["Women's and men's capsules", '15, 25 or 35 pieces', 'Climate and lifestyle options', 'Outfit count', 'Printable checklist'] },
    about: { '@type': 'Thing', name: 'Capsule wardrobe' },
    llms: `Capsule Wardrobe Planner: builds a 15/25/35 piece women's or men's capsule ranked by lifestyle and climate, colors split 60/30/10. Outfits = tops × bottoms + dresses: women's 25 = ${w25.outfits}, men's 25 = ${m25.outfits}; with shoe changes ${w25.withShoes} and ${m25.withShoes}. Printable checklist.`
  };
}

// ---------- Outfit Generator ----------
function outfitGenerator() {
  const ex = OG.summary(OG.norm(OG.DEFAULT));
  const faq = [
    ['What should I wear when it is 15 °C (59 °F)?', `15 °C falls in the mild band (${O.BANDS[2].label.split('(')[1].replace(')', '')}). ${O.BANDS[2].tip} For example: a fine-knit sweater or shirt, straight-leg jeans or chinos, a trench coat or denim jacket, and loafers or ankle boots.`],
    ['What is smart casual?', 'Smart casual sits between business wear and weekend wear: a neat shirt, blouse, knit or polo with chinos, tailored trousers, dark jeans or a midi skirt, plus loafers, clean leather sneakers or ankle boots. A blazer is optional. Ripped denim, sportswear and flip-flops are usually out.'],
    ['What should I wear to a formal event?', 'For womenswear the generator picks a gown, slip dress or tailored separates with heels or pumps and a clutch. For menswear it builds a suit in one dark neutral with a white dress shirt, and puts your chosen color on the tie or pocket square. Always check the invitation: black tie is more formal than "formal".'],
    ['How does the outfit generator choose an outfit?', 'The occasion decides which garments are allowed, the temperature band decides fabrics and how many layers, and a seeded random pick chooses between suitable pieces. The color you choose goes on one statement piece; neutrals that suit it go everywhere else.'],
    ['What temperature bands does it use?', O.BANDS.map((b) => b.label).join('; ') + '.'],
    ['Why does my outfit link always show the same outfit?', 'Each outfit has a number (its seed) saved in the link, so the same link always rebuilds the same outfit. Press "New outfit" for a different idea; copy the link to save or share one you like.'],
    ['Can I use it for menswear and womenswear?', 'Yes. Choose womenswear or menswear; both cover casual, smart casual, office, formal and date-night outfits in all five temperature bands.']
  ];
  const body = `<p class="eyebrow">Free outfit idea tool</p>
<h1>Outfit Generator: What Should I Wear Today?</h1>
<p class="answer">Tell the outfit generator the occasion, the temperature and one color you want to wear, and it builds a complete outfit with neutrals that match. Example for smart casual at 20 °C in burgundy: ${esc(ex.split(': ')[1])}</p>
${verifiedLine(O.FACTS.verified)}
${toolShell('outfit-generator', 'Outfit generator', OG.controls(OG.DEFAULT), OG.result(OG.DEFAULT), '<button type="button" class="btn" data-shuffle>New outfit</button>')}
<h2>How the outfit generator works</h2>
${steps([
    '<b>Occasion</b> limits the garments to ones that suit it: no shorts at the office, no sneakers at a formal dinner.',
    '<b>Temperature</b> chooses fabrics and layers: none when hot, one light layer when mild, a knit and coat when cold.',
    '<b>Color</b> goes on one statement piece; the other pieces use the neutrals that suit it best.',
    '<b>New outfit</b> picks again from the suitable pieces. The link saves the exact outfit.'])}
<h2>What to wear by temperature</h2>
${table('Temperature bands used by the generator', ['Band', 'What to wear'], O.BANDS.map((b) => [esc(b.label), esc(b.tip)]))}
${callout('Temperature bands are general guidance. Wind, humidity, sun and how warm you usually feel all matter, so adjust layers to suit you.')}
${sources([
    ['Dress code (Wikipedia)', 'https://en.wikipedia.org/wiki/Dress_code', 'formal, business and smart casual definitions'],
    ['SimplyStylo methodology', '/methodology/', 'garment rules and temperature bands']])}
${faqBlock(faq)}
${relatedBlock('outfit-generator')}`;
  return {
    path: '/tools/outfit-generator/', type: 'tool', title: 'Outfit Generator: What Should I Wear Today?', crumb: 'Outfit Generator',
    crumbs: [['Tools', '/tools/']],
    description: 'Free outfit generator for womenswear and menswear. Pick the occasion, temperature and a color to get a complete outfit with matching neutrals.',
    bundle: 'outfit-generator', faq, body, datePublished: PUBLISHED, dateModified: MODIFIED,
    app: { name: tool('outfit-generator').name, description: tool('outfit-generator').blurb, features: ['Womenswear and menswear', '5 occasions', 'Temperature in °C or °F', 'Color matching', 'Shareable outfit links'] },
    about: { '@type': 'Thing', name: 'Outfit ideas' },
    llms: `Outfit Generator: rule-based outfits for womenswear or menswear across 5 occasions (casual, smart casual, office, formal, date night) and 5 temperature bands (hot ≥25 °C, warm 18–24, mild 12–17, cool 5–11, cold <5). Chosen color goes on one statement piece, matching neutrals elsewhere. Example: ${ex}`
  };
}

// ---------- Body Shape Calculator ----------
function bodyShape() {
  const ex = BS.summary(BS.norm(BS.DEFAULT));
  const shapes = Object.entries(B.SHAPES).filter(([id]) => id !== 'between');
  const faq = [
    ['How do I calculate my body shape?', 'Measure your bust, waist, high hip (about 4 in or 10 cm below the waist) and hips, then compare the differences. With the FFIT method, for example, bust 36 in, waist 27 in, high hip 34 in and hips 37 in is an hourglass: bust and hips are within 1 in and the bust is 9 in larger than the waist.'],
    ['What are the 7 body shapes in the FFIT method?', 'FFIT sorts measurements into hourglass, bottom hourglass, top hourglass, spoon, triangle (pear), inverted triangle and rectangle. The rules are tested in that order and the first one that matches is your shape.'],
    ['What measurements make an hourglass figure?', 'In FFIT an hourglass has bust and hips within 1 in of each other (hips no more than 3.6 in larger than the bust) and a defined waist: the bust is at least 9 in larger than the waist, or the hips at least 10 in larger.'],
    ['What is the difference between a triangle and a spoon body shape?', 'Both have hips at least 2 to 3.6 in larger than the bust. A spoon also has a pronounced high hip (high hip at least 1.193 times the waist) and hips 7 in or more larger than the waist; a triangle has less waist definition, with hips less than 9 in larger than the waist.'],
    ['How do I measure my high hip?', 'Stand straight and measure around the body about 4 in (10 cm) below your natural waist, across the top of the hip bones. Keep the tape level and snug but not tight. The high hip separates spoon from bottom hourglass shapes.'],
    ['Why does my body shape change when I re-measure?', 'FFIT uses fixed cut-offs, so a difference of half an inch near a boundary can move you to the next shape. Measure twice over thin clothing and use the result as a styling guide, not a label; proportions matter more than the name.'],
    ['Does this calculator work for men?', 'No. FFIT was developed and tested on women\'s body scans, so the cut-offs do not apply to men. For menswear, the capsule wardrobe planner and outfit generator give fit-independent guidance.']
  ];
  const body = `<p class="eyebrow">Free body shape tool</p>
<h1>Body Shape Calculator: What Is My Body Shape?</h1>
<p class="answer">Your body shape comes from comparing your bust, waist, high hip and hip measurements. ${esc(ex)} Enter your own measurements below to get your shape, a figure drawn to your proportions and styling tips, using the FFIT method from apparel research.</p>
${verifiedLine(B.FACTS.verified)}
${toolShell('body-shape', 'Body shape calculator', BS.controls(BS.DEFAULT), BS.result(BS.DEFAULT))}
<h2>How the body shape calculator works</h2>
${steps([
    '<b>Measure four points</b> over thin clothing: bust, natural waist, high hip and hips.',
    '<b>The differences are compared</b> in inches (centimeters are converted): bust − hips, bust − waist, hips − waist and high hip ÷ waist.',
    '<b>Seven FFIT rules are tested in order</b>; the first that matches is your shape. If none match, you are between two shapes.',
    '<b>The figure is drawn to your numbers</b>, so you can see your proportions, not a stock drawing.'])}
<h2>The 7 body shapes and their rules</h2>
${table('FFIT body shape rules (inches)', ['Shape', 'Rule'], shapes.map(([, s]) => [esc(s.name), esc(s.rule)]))}
${callout('Body shape is a styling guide, not a health measure. Measurements vary with posture and tape placement, and many people sit between two shapes.')}
${sources([
    ['Female body shape: FFIT formulas (Wikipedia)', 'https://en.wikipedia.org/wiki/Female_body_shape', 'rules from Lee, Istook, Nam & Park (2007)'],
    ['Female Figure Identification Technique (FFIT) for apparel, part I (Simmons, Istook & Devarajan)', 'https://www.researchgate.net/publication/286985579_Female_Figure_Identification_Technique_FFIT_for_apparel_part_I_Describing_female_shapes'],
    ['Investigating the impact of body shape on garment fit (University of Manchester)', 'https://pure.manchester.ac.uk/ws/portalfiles/portal/229065625/Body_Shape_JFMM_Paper_Accepted.pdf'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('body-shape')}`;
  return {
    path: '/tools/body-shape-calculator/', type: 'tool', title: 'Body Shape Calculator: What Is My Body Shape?', crumb: 'Body Shape Calculator',
    crumbs: [['Tools', '/tools/']],
    description: 'Free body shape calculator for women: enter bust, waist, high hip and hips to find your shape (hourglass, pear, rectangle and more) with styling tips.',
    bundle: 'body-shape', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('body-shape').name, description: tool('body-shape').blurb, features: ['7 FFIT body shapes', 'Inches or centimeters', 'Figure drawn to your measurements', 'Styling tips'] },
    about: { '@type': 'Thing', name: 'Female body shape' },
    llms: `Body Shape Calculator (FFIT, Lee et al. 2007): ${shapes.map(([, s]) => `${s.name}: ${s.rule}`).join(' ')} Example: 36/27/34/37 in = Hourglass.`
  };
}

// ---------- Photo Color Palette ----------
function photoPalette() {
  const demo = PP.demo();
  const faq = [
    ['How do I find the colors in an outfit photo?', 'Choose a photo and the tool groups similar pixels into up to 6 main colors, shows each color\'s share of the image, its hex code and nearest clothing color name. For example, a navy, camel and white outfit returns navy 50%, camel 30%, white 15% and burgundy 5%.'],
    ['Is my photo uploaded anywhere?', 'No. The photo is decoded and scaled down inside your browser and never sent to a server. Only the resulting list of colors is kept, in the page address, so you can share the palette without the photo.'],
    ['How does the color extraction work?', 'The tool samples up to 12,000 pixels and clusters them with k-means in the Oklab color space, which measures color differences the way eyes see them. The starting points are fixed, so the same photo always gives the same palette.'],
    ['Why does the background color show up in my palette?', 'Every pixel counts, so walls, floors and skin appear too. Crop the photo to the outfit before choosing it for a cleaner result.'],
    ['What does "closest color seasons" mean?', 'The palette is compared with all 12 seasonal palettes; the seasons whose colors sit closest to your photo\'s colors are listed. It tells you which season the outfit\'s colors belong to, not your own season.'],
    ['Can I use this to copy a look I like?', 'Yes. Save an inspiration photo, extract its palette, then open the color guides or the color combination finder to see what else works with those colors.'],
    ['Why do the colors look slightly different from the photo?', 'Each swatch is the average of many similar pixels, so highlights and shadows are blended together. Lighting and camera processing also shift colors, so treat the swatches as close references.']
  ];
  const body = `<p class="eyebrow">Free photo color tool</p>
<h1>Photo Color Palette: Find the Colors in an Outfit Photo</h1>
<p class="answer">Choose an outfit or inspiration photo and this tool finds its main colors, each color's share of the image, the nearest clothing color names and the color seasons it matches. Example: a navy, camel and white outfit gives ${esc(demo.map((c) => `${c.name.toLowerCase()} ${c.share}%`).join(', '))}. Your photo never leaves your device.</p>
${verifiedLine(PL.FACTS.verified)}
${toolShell('photo-palette', 'Photo color palette', PP.controls(), PP.result(demo, true), '<button type="button" class="btn btn--ghost" data-demo>Show example</button>')}
<h2>How the photo palette tool works</h2>
${steps([
    '<b>Choose a photo</b> from your camera roll. It is scaled down on your device; nothing is uploaded.',
    '<b>Pixels are clustered</b> into up to 6 colors with k-means in the Oklab color space, so similar shades merge the way your eye merges them.',
    '<b>Each color is named</b> after the nearest clothing color and linked to its color guide.',
    '<b>Seasons are matched</b> by comparing the palette with all 12 seasonal palettes.'])}
${callout('Results depend on lighting, camera processing and what else is in the frame. Crop to the outfit for the clearest palette.')}
${sources([
    ['k-means clustering (Wikipedia)', 'https://en.wikipedia.org/wiki/K-means_clustering', 'with k-means++ seeding'],
    ['Oklab perceptual color space (Björn Ottosson)', 'https://bottosson.github.io/posts/oklab/'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('photo-palette')}`;
  return {
    path: '/tools/photo-color-palette/', type: 'tool', title: 'Photo Color Palette: Find the Colors in an Outfit', crumb: 'Photo Color Palette',
    crumbs: [['Tools', '/tools/']],
    description: 'Find the colors in any outfit photo: main colors with hex codes and shares, nearest clothing color names and matching color seasons. Nothing is uploaded.',
    bundle: 'photo-palette', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('photo-palette').name, description: tool('photo-palette').blurb, features: ['Up to 6 main colors', 'Share of each color', 'Clothing color names', 'Season match', 'Private: runs on device'] },
    about: { '@type': 'Thing', name: 'Color palette from a photo' },
    llms: `Photo Color Palette: on-device k-means (Oklab) on up to 12,000 pixels; returns up to 6 colors with hex, share, nearest clothing color and the closest of 12 color seasons. Example navy/camel/white outfit: ${demo.map((c) => `${c.name} ${c.share}%`).join(', ')}. Photos are not uploaded.`
  };
}

// ---------- Ring Size Converter ----------
function ringSize() {
  const us7 = R.convert('us', 7), us6 = R.convert('us', 6);
  const faq = [
    ['What is a US size 7 ring in mm?', `A US size 7 ring has an inner diameter of ${us7.diameter} mm and an inner circumference of ${us7.circumference} mm, which is EU/ISO size ${us7.eu}. Each full US size adds about 0.81 mm to the diameter.`],
    ['How do I convert EU ring sizes to US?', `EU and ISO 8653 sizes are the inner circumference in millimeters. Divide by π to get the diameter, then US size = (diameter − 11.63) ÷ 0.8128. For example, EU 54 is about US 6¾ and EU 57 is about US 8.`],
    ['How can I measure my ring size at home?', 'Measure the inside diameter of a ring that fits the right finger, edge to edge, in millimeters, and enter it as "Inner diameter". Or wrap a strip of paper around the base of the finger, mark where it overlaps, and enter that length as "Inner circumference".'],
    ['What is the difference between ring diameter and circumference?', `Diameter is the distance straight across the inside of the ring; circumference is the distance around the inside. Circumference = π × diameter, so a ${us7.diameter} mm diameter is ${us7.circumference} mm around. EU/ISO sizes use the circumference in millimeters.`],
    ['Should I size up for a wide band?', 'Often yes. Bands wider than about 6 mm sit more snugly, so many jewelers suggest going up a quarter to half size. Check the jeweler\'s advice for the specific ring.'],
    ['Why are UK ring sizes not included?', 'UK and Australian letter sizes (such as N or P) are listed with different millimeter values on different published charts, by about half a letter. Rather than guess, the converter gives US, EU/ISO and exact millimeter sizes, which any jeweler can work from.'],
    ['When is the best time to measure my finger?', 'Measure at the end of the day when your hands are warm, since fingers are smaller in the cold and swell in heat. Measure two or three times and use the larger result if you are between sizes.']
  ];
  const body = `<p class="eyebrow">Free ring size tool</p>
<h1>Ring Size Converter: US, EU and Millimeter Sizes</h1>
<p class="answer">A US size 7 ring is ${us7.diameter} mm across the inside (${us7.circumference} mm around), which is EU/ISO size ${us7.eu}; a US 6 is ${us6.diameter} mm. Enter any US size, EU size, inner diameter or circumference below to convert it.</p>
${verifiedLine(R.FACTS.verified)}
${toolShell('ring-size', 'Ring size converter', RS.controls(RS.DEFAULT), RS.result(RS.DEFAULT))}
<h2>How the ring size converter works</h2>
${steps([
    `<b>US and Canada:</b> ${esc(R.FACTS.us)}.`,
    `<b>EU and ISO 8653:</b> the size is the inner circumference in millimeters (circumference = π × diameter).`,
    '<b>Any input is converted to an inner diameter first</b>, then to every other system, so all results agree.',
    `<b>UK letters are left out:</b> ${esc(R.FACTS.uk)}`])}
<h2>Ring size chart</h2>
${table('US ring sizes with inner diameter, circumference and EU/ISO size', ['US / Canada', 'Diameter (mm)', 'Circumference (mm)', 'EU / ISO'],
    R.table().map((r) => [RS.usLabel(r.us), r.diameter, r.circumference, r.eu]))}
${callout('Sizes are approximate: ring widths, comfort-fit bands and jewelers\' sizing tools vary. For an expensive ring, have your finger sized by a jeweler.')}
${sources([
    ['Ring size: US, ISO 8653 and other systems (Wikipedia)', 'https://en.wikipedia.org/wiki/Ring_size'],
    ['The complete guide to ring size conversions (Kiwi Sizing)', 'https://kiwisizing.com/blog/complete-guide-to-ring-size-conversion/', 'about 2.55 mm of circumference per US size'],
    ['Ring size conversion guide (Check Ring Size)', 'https://checkringsize.pages.dev/conversion-guide', 'US 0 = 11.63 mm, + 0.8128 mm per size'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('ring-size')}`;
  return {
    path: '/tools/ring-size-converter/', type: 'tool', title: 'Ring Size Converter: US, EU and MM Sizes', crumb: 'Ring Size Converter',
    crumbs: [['Tools', '/tools/']],
    description: `Convert ring sizes between US, EU/ISO, inner diameter and circumference. US 7 = ${us7.diameter} mm diameter = EU ${us7.eu}. Includes a full ring size chart.`,
    bundle: 'ring-size', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('ring-size').name, description: tool('ring-size').blurb, features: ['US / Canada sizes', 'EU / ISO 8653 sizes', 'Inner diameter and circumference in mm', 'Size chart'] },
    about: { '@type': 'Thing', name: 'Ring size' },
    llms: `Ring Size Converter: ${R.FACTS.us}; ${R.FACTS.iso}. US 7 = ${us7.diameter} mm diameter, ${us7.circumference} mm circumference, EU ${us7.eu}. US 6 = ${us6.diameter} mm. UK letters omitted (charts disagree).`
  };
}

// ---------- Cost Per Wear Calculator ----------
function costPerWear() {
  const ex = CW2.summary(CW2.norm(CW2.DEFAULT));
  const faq = [
    ['How do you calculate cost per wear?', 'Divide what an item costs by the number of times you wear it. A $150 coat worn 60 times a year for 5 years (300 wears) costs $0.50 per wear; a $40 top worn 10 times costs $4.00 per wear, so the coat is 8 times better value per wear.'],
    ['What is a good cost per wear?', 'There is no fixed number, but the lower the better: many people aim for under $1 per wear for everyday basics. The most useful test is comparison: choose the item that will cost less per wear for how you actually live.'],
    ['Should I include cleaning costs?', 'Yes, if an item needs dry cleaning or special care. Add the care cost per wear (for example, a $12 dry clean every 6 wears is $2 per wear), and the calculator adds it to the total.'],
    ['How does resale value change cost per wear?', 'Money you get back by reselling is taken off the total cost. A $200 bag worn 40 times and resold for $60 costs $140 over 40 wears, or $3.50 per wear instead of $5.00.'],
    ['How many times do I need to wear something to make it worth it?', 'Use the break-even line: it shows how many wears the more expensive item needs to match the cheaper one\'s cost per wear. In the example, the $150 coat matches the $4 top after 38 wears.'],
    ['Is cost per wear only about money?', 'Mostly, but it also points to sustainability: wearing clothes for longer and more often spreads their environmental cost over more wears.'],
    ['Does the calculator save my numbers?', 'Your numbers are saved only in the page address, so you can bookmark or share a comparison. Nothing is sent to a server.']
  ];
  const body = `<p class="eyebrow">Free shopping tool</p>
<h1>Cost Per Wear Calculator: Is It Worth Buying?</h1>
<p class="answer">Cost per wear is the price divided by the number of times you wear something. ${esc(ex)} Compare any two items below, including care costs and resale value.</p>
${verifiedLine(P.FACTS.verified)}
${toolShell('cost-per-wear', 'Cost per wear calculator', CW2.controls(CW2.norm(CW2.DEFAULT)), CW2.result(CW2.norm(CW2.DEFAULT)))}
<h2>How the cost per wear calculator works</h2>
${steps([
    '<b>Total wears</b> = wears per year × years you will keep it.',
    '<b>Total cost</b> = price + care cost per wear × total wears − resale value.',
    '<b>Cost per wear</b> = total cost ÷ total wears, rounded to the cent.',
    '<b>Break-even</b> shows how many wears the pricier item needs to match the cheaper one.'])}
<h2>Cost per wear examples</h2>
${table('Typical cost per wear (illustrative prices)', ['Item', 'Price', 'Wears', 'Cost per wear'], [
    ['Wool coat, 60 wears a year for 5 years', '$150', '300', '$' + P.item({ price: 150, perYear: 60, years: 5 }).cpw.toFixed(2)],
    ['Leather sneakers, 100 wears a year for 3 years', '$120', '300', '$' + P.item({ price: 120, perYear: 100, years: 3 }).cpw.toFixed(2)],
    ['Party dress, 3 wears', '$90', '3', '$' + P.item({ price: 90, perYear: 3, years: 1 }).cpw.toFixed(2)],
    ['Trend top, 10 wears', '$40', '10', '$' + P.item({ price: 40, perYear: 10, years: 1 }).cpw.toFixed(2)]])}
${callout('Cost per wear depends on your honest estimate of how often you will wear something. Be realistic, especially for occasion wear.')}
${sources([
    ['Sustainable fashion (Wikipedia)', 'https://en.wikipedia.org/wiki/Sustainable_fashion', 'wearing clothes longer as a sustainability practice'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('cost-per-wear')}`;
  return {
    path: '/tools/cost-per-wear-calculator/', type: 'tool', title: 'Cost Per Wear Calculator: Is It Worth Buying?', crumb: 'Cost Per Wear Calculator',
    crumbs: [['Tools', '/tools/']],
    description: 'Compare two clothes by cost per wear: price, wears per year, years kept, care costs and resale value. A $150 coat worn 300 times costs $0.50 per wear.',
    bundle: 'cost-per-wear', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('cost-per-wear').name, description: tool('cost-per-wear').blurb, features: ['Compare two items', 'Care costs', 'Resale value', 'Break-even wears', '5 currencies'] },
    about: { '@type': 'Thing', name: 'Cost per wear' },
    llms: `Cost Per Wear Calculator: ${P.FACTS.formula}. Example: $150 coat, 60 wears/yr × 5 yrs = $0.50/wear vs $40 top worn 10 times = $4.00/wear (8× better); break-even 38 wears.`
  };
}

// ---------- Selfie Color Analysis ----------
function selfieAnalysis() {
  const faq = [
    ['Can a selfie tell me my color season?', 'A selfie can measure how light your hair and skin are and how much contrast there is between them, which decides whether you are light, deep, bright or soft. It cannot reliably show undertone, because lighting changes skin hue, so this tool asks four undertone questions and combines both into one of 12 seasons.'],
    ['Is my selfie uploaded?', 'No. The photo is drawn on your screen and read by your own browser. Only the resulting quiz answers are kept in the page address so you can share your season; the photo itself is never sent anywhere.'],
    ['How should I take the selfie?', 'Face a window in daylight, with no filter, beauty mode or heavy makeup, and pull your hair forward so it is next to your face. Hold a sheet of plain white paper in the frame and tap it as the white reference so the tool can correct the lighting.'],
    ['What does the white paper do?', 'Indoor light makes photos look yellow and shade makes them look blue. Tapping white paper tells the tool what white looks like in your photo, and it removes that color cast from the skin, hair and eye readings before it measures them.'],
    ['How are skin, hair and eye readings turned into answers?', `The tool measures lightness and colorfulness in the Oklab color space. ${S2.FACTS.scale.hair}. ${S2.FACTS.scale.skin}. ${S2.FACTS.scale.contrast}. These cut-offs are SimplyStylo's own guide scale.`],
    ['Why is my result different from the quiz?', 'The quiz relies on how you see yourself; the selfie measures the photo. If they disagree, compare both seasons\' palettes in daylight next to your face. Dyed hair and photo filters are the most common causes.'],
    ['Is selfie color analysis as good as a professional?', 'No. A trained color analyst drapes fabric under controlled light. Use this result as a starting point to test colors, not as a final answer.']
  ];
  const body = `<p class="eyebrow">Free photo color analysis</p>
<h1>Selfie Color Analysis: Find Your Season from a Photo</h1>
<p class="answer">Choose a daylight selfie, tap your skin, hair and eyes, and answer four undertone questions: the tool measures your depth and contrast from the photo and returns one of 12 color seasons with your best colors. Your photo never leaves your device.</p>
${verifiedLine(S2.FACTS.verified)}
${toolShell('selfie-analysis', 'Selfie color analysis', SF.controls(), SF.result({ samples: null }))}
<h2>How selfie color analysis works</h2>
${steps([
    '<b>Depth from the photo:</b> hair and skin lightness decide whether your coloring is light or deep.',
    '<b>Contrast from the photo:</b> the lightness gap between hair and skin, and how colorful your eyes are, decide bright or soft.',
    '<b>Undertone from you:</b> four questions about veins, jewelry, whites and tanning decide warm or cool, because photos can\'t show it reliably.',
    '<b>Season:</b> the strongest of the three traits names your season, exactly as in the 8-question quiz.'])}
<h2>The scale used for photo readings</h2>
${table('How photo readings become answers (Oklab lightness 0 = black, 1 = white)', ['Reading', 'Scale'], Object.entries(S2.FACTS.scale).map(([k, v]) => [esc(k.charAt(0).toUpperCase() + k.slice(1)), esc(v)]))}
${callout('This is a styling guide based on your photo, not a professional color draping. Lighting, cameras, filters and hair dye all change results.')}
${sources([
    ['Oklab perceptual color space (Björn Ottosson)', 'https://bottosson.github.io/posts/oklab/', 'lightness and chroma readings'],
    ['Munsell color system: hue, value and chroma (Wikipedia)', 'https://en.wikipedia.org/wiki/Munsell_color_system'],
    ['Color constancy and white balance (Wikipedia)', 'https://en.wikipedia.org/wiki/Color_balance', 'why a white reference corrects lighting'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('selfie-analysis')}`;
  return {
    path: '/tools/selfie-color-analysis/', type: 'tool', title: 'Selfie Color Analysis: Find Your Season from a Photo', crumb: 'Selfie Color Analysis',
    crumbs: [['Tools', '/tools/']],
    description: 'Free selfie color analysis: tap skin, hair and eyes on your photo and answer 4 undertone questions to find your color season. Your photo is not uploaded.',
    bundle: 'selfie-analysis', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('selfie-analysis').name, description: tool('selfie-analysis').blurb, features: ['Reads depth and contrast from a selfie', 'White-paper lighting correction', '12-season result', 'Private: runs on device'] },
    about: { '@type': 'Thing', name: 'Seasonal color analysis from a photo' },
    llms: `Selfie Color Analysis: visitor taps skin, hair, eyes (+ optional white paper for white balance) on a selfie; Oklab readings set value and contrast answers (${Object.values(S2.FACTS.scale).join('; ')}); four undertone questions set warm/cool; result is one of 12 seasons. Photo stays on device.`
  };
}

// ---------- Wardrobe Color Checker ----------
function wardrobeColors() {
  const ex = WC.summary(WC.DEFAULT), r = WCore.analyse(WC.DEFAULT);
  const faq = [
    ['How many neutrals should a wardrobe have?', 'A common guideline is about 60% neutrals, 30% secondary colors and 10% accents. With 60% or more neutrals, almost every piece has several partners; below 40%, outfits get harder to combine.'],
    ['How does the checker decide which colors go together?', `${WCore.FACTS.rule} Each pair is weighted by how many pieces you own in each color.`],
    ['What color should I buy next?', `The checker scores every color you don't own by how well it pairs with your current pieces. If under 60% of your wardrobe is neutral it suggests neutrals first; otherwise it suggests accent colors. For a wardrobe of 4 navy, 3 white, 2 gray, 2 burgundy and 1 olive piece it suggests ${r.suggestions.map((s) => s.name.toLowerCase()).join(', ')}.`],
    ['What does "easy pairings" mean?', 'It is the share of all possible two-piece color combinations in your closet that work together: a neutral with anything, or two colors that are neighbors, opposites or evenly spaced on the color wheel.'],
    ['Which colors are hard to combine?', 'Two strong colors that are neither close nor opposite on the color wheel, such as red and yellow, or green and purple, clash more often. Put a neutral between them or wear them on separate days.'],
    ['Does this account for patterns and fabrics?', 'No. Count each piece by its main color. Patterns, textures and finishes change how colors combine, so use the result as a starting point.'],
    ['Why does it show color seasons?', 'Your wardrobe colors are compared with the 12 seasonal palettes so you can see which palette your closet already leans toward and compare it with your own season.']
  ];
  const body = `<p class="eyebrow">Free wardrobe tool</p>
<h1>Wardrobe Color Checker: Do Your Clothes Go Together?</h1>
<p class="answer">Enter how many pieces you own in each color and the checker shows your neutral balance, the share of color pairings that combine easily and the 3 best colors to buy next. Example: ${esc(ex)}</p>
${verifiedLine(WCore.FACTS.verified)}
${toolShell('wardrobe-colors', 'Wardrobe color checker', WC.controls(WC.DEFAULT), WC.result(WC.DEFAULT))}
<h2>How the wardrobe color checker works</h2>
${steps([
    '<b>Count your pieces</b> by main color: tops, bottoms, dresses, layers and shoes.',
    '<b>Neutral share</b> is the percentage of pieces in neutrals such as navy, black, white, gray, beige and camel.',
    `<b>Easy pairings:</b> ${esc(WCore.FACTS.rule)}`,
    '<b>Suggestions</b> rank the colors you don\'t own by how well they pair with what you do own.'])}
<h2>Wardrobe balance guide</h2>
${table('What your neutral share means', ['Neutral share', 'Verdict'], [['60% or more', 'Strong base: add accents freely'], ['40–59%', 'Balanced: keep new buys mostly neutral'], ['Under 40%', 'Color-heavy: add neutrals first']])}
${callout('Color pairing is a guide, not a rule: your own coloring, fabrics and patterns matter too.')}
${sources([
    ['Color wheel and color schemes (Wikipedia)', 'https://en.wikipedia.org/wiki/Color_scheme'],
    ['Capsule wardrobe (Wikipedia)', 'https://en.wikipedia.org/wiki/Capsule_wardrobe'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('wardrobe-colors')}`;
  return {
    path: '/tools/wardrobe-color-checker/', type: 'tool', title: 'Wardrobe Color Checker: Do Your Clothes Go Together?', crumb: 'Wardrobe Color Checker',
    crumbs: [['Tools', '/tools/']],
    description: 'Check the colors in your closet: neutral balance, how easily your colors combine and the best colors to buy next. Free, private, no sign-up.',
    bundle: 'wardrobe-colors', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('wardrobe-colors').name, description: tool('wardrobe-colors').blurb, features: ['Neutral balance', 'Easy pairing score', 'Best colors to buy next', 'Hard-to-combine pairs', 'Season match'] },
    about: { '@type': 'Thing', name: 'Wardrobe color planning' },
    llms: `Wardrobe Color Checker: counts pieces per color; neutral share (≥60% strong, 40–59% balanced, <40% color-heavy); ${WCore.FACTS.rule} Suggests 3 colors to buy. Example: ${ex}`
  };
}

// ---------- Packing List Generator ----------
function packingList() {
  const ex = PK.summary(PK.norm(PK.DEFAULT));
  const r7 = PKCore.plan({ days: 7, trip: 'city', weather: 'mild', wardrobe: 'women' });
  const faq = [
    ['How many outfits should I pack for 7 days?', `For a 7-day city trip in mild weather without laundry, the generator packs ${r7.pieces} clothing pieces: 6 tops, 3 bottoms, 1 dress, 2 layers and 2 pairs of shoes, which make ${r7.outfits} outfits. With laundry, longer trips pack the same amount.`],
    ['How many tops should I pack?', 'About 3 tops for every 4 days of clothes (at least 2), plus one extra in hot weather. Tops show wear first, so they are the piece worth packing more of.'],
    ['How many pairs of shoes should I take?', 'Two pairs cover most trips: one comfortable walking pair and one smarter pair. Add a third only for beach (sandals) or business trips (dress shoes), and wear the bulkiest pair while traveling.'],
    ['How does laundry change my packing list?', 'If you can wash clothes, pack for at most 7 days. A 14-day trip with laundry needs the same clothes as a 7-day trip, only more toiletries.'],
    ['How do I fit everything in a carry-on?', 'Choose one color palette so everything mixes, wear your heaviest shoes and coat on the plane, roll soft clothes, and keep liquids in containers of 100 ml or less in one clear bag.'],
    ['What essentials do people forget?', 'Phone charger and plug adapter, medication, a copy of your ID or passport, a reusable water bottle and a small bag for laundry.'],
    ['Can I print or save my packing list?', 'Yes. Use Print for a paper checklist, or Copy link: the link reopens the same list with your trip settings.']
  ];
  const body = `<p class="eyebrow">Free travel tool</p>
<h1>Packing List Generator: What to Pack for Your Trip</h1>
<p class="answer">${esc(ex)} Set your trip length, trip type, weather and laundry below to get a printable checklist sized to your trip, with every outfit built from the same pieces.</p>
${verifiedLine(PKCore.FACTS.verified)}
${toolShell('packing-list', 'Packing list generator', PK.controls(PK.norm(PK.DEFAULT)), PK.result(PK.norm(PK.DEFAULT)))}
<h2>How the packing list generator works</h2>
${steps(PKCore.FACTS.rules.map((r) => esc(r)))}
<h2>Packing amounts by trip length</h2>
${table("Clothing pieces and outfits, women's city trip in mild weather, no laundry", ['Days', 'Tops', 'Bottoms', 'Pieces', 'Outfits'], [3, 5, 7, 10, 14].map((d) => {
    const p = PKCore.plan({ days: d, trip: 'city', weather: 'mild', wardrobe: 'women' });
    const q = (id) => (p.groups.find((g) => g.id === id) || { items: [] }).items.reduce((s, i) => s + i.qty, 0);
    return [d, q('tops'), q('bottoms'), p.pieces, p.outfits];
  }))}
${callout('These are starting amounts. Check your airline\'s baggage allowance and the weather forecast before you pack.')}
${sources([
    ['Capsule wardrobe (Wikipedia)', 'https://en.wikipedia.org/wiki/Capsule_wardrobe', 'the mix-and-match idea behind the list'],
    ['SimplyStylo methodology', '/methodology/', 'packing rules']])}
${faqBlock(faq)}
${relatedBlock('packing-list')}`;
  return {
    path: '/tools/packing-list-generator/', type: 'tool', title: 'Packing List Generator: What to Pack for Any Trip', crumb: 'Packing List Generator',
    crumbs: [['Tools', '/tools/']],
    description: `Free packing list generator: enter trip days, type, weather and laundry for a printable checklist. 7 days in mild weather = ${r7.pieces} pieces, ${r7.outfits} outfits.`,
    bundle: 'packing-list', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('packing-list').name, description: tool('packing-list').blurb, features: ['1 to 30 days', '5 trip types', '3 weather types', 'Laundry option', 'Printable checklist'] },
    about: { '@type': 'Thing', name: 'Travel packing list' },
    llms: `Packing List Generator rules: ${PKCore.FACTS.rules.join(' ')} Example: 7-day women's city trip, mild, no laundry = ${r7.pieces} pieces, ${r7.outfits} outfits.`
  };
}

// ---------- Dress Code Guide ----------
function dressCode() {
  const g = (id) => DCore.get(id);
  const list = (id, s) => g(id)[s].map((i) => i[0].toLowerCase()).join(', ');
  const faq = [
    ['What is the difference between white tie and black tie?', `White tie is the most formal dress code: for men, ${list('white-tie', 'menswear')}; for women, a floor-length evening gown. Black tie is one step less formal: ${list('black-tie', 'menswear')} for men, and an evening gown or dressy cocktail dress for women.`],
    ['What does black tie optional mean?', `The hosts will wear black tie, and guests may too. Men can wear a tuxedo or a dark suit with a white dress shirt and a conservative tie; women can wear an evening gown, a dressy cocktail dress, a little black dress or dressy separates.`],
    ['What should I wear to a cocktail or semi-formal event?', `Men: ${list('cocktail', 'menswear')}. Women: a cocktail dress or little black dress, or a long dressy skirt and top. For events after 6 p.m., lean toward the more formal choice.`],
    ['What is business casual?', `Business casual mixes office wear with relaxed pieces: for men, ${list('business-casual', 'menswear')}; for women, a skirt, chinos or trousers with a blouse, knit top or sweater, or a dress. Always check your company's own rules.`],
    ['What is smart casual?', `Smart casual (also called dressy casual) is relaxed but polished: for men, ${list('smart-casual', 'menswear')}; for women, a dress, a skirt and dressy top, or nice jeans with a dressy top.`],
    ['What does lounge suit mean on a UK invitation?', 'In British usage, "lounge suit" means a business suit worn with a shirt and tie; it is the equivalent of business formal, not loungewear.'],
    ['What is creative black tie?', `Creative black tie keeps black tie formality but adds personality: for men, ${list('creative-black-tie', 'menswear')}; for women, an evening gown or cocktail dress with fun or unique accessories.`]
  ];
  const body = `<p class="eyebrow">Free dress code tool</p>
<h1>Dress Code Guide: What to Wear for Every Invitation</h1>
<p class="answer">Dress codes run from white tie (most formal) through black tie, cocktail and business to casual. Choose the dress code on your invitation and womenswear or menswear to see exactly what to wear, what to avoid and how formal it is.</p>
${verifiedLine(DCore.FACTS.verified)}
${toolShell('dress-code', 'Dress code guide', DC.controls(DC.DEFAULT), DC.result(DC.DEFAULT))}
<h2>Dress codes from most to least formal</h2>
${table('The 9 common dress codes', ['Dress code', 'Also called', 'Typical events'], DCore.CODES.map((c) => [esc(c.name), esc(c.aka), esc(c.when)]))}
<h2>How to read an invitation</h2>
${steps([
    '<b>Find the dress code</b>: usually at the bottom of the invitation, or on the event website.',
    '<b>Check the time:</b> for events after 6 p.m., lean toward the more formal option.',
    '<b>Check the venue and season:</b> a garden or beach changes fabrics and shoes, not the formality level.',
    '<b>If unsure, ask the host</b>, or dress one step more formal rather than less.'])}
${callout('Dress codes vary by country, culture and host. Religious, cultural and national dress are appropriate at any level of formality.')}
${sources([
    ['Attire guide: dress codes from casual to white tie (Emily Post Institute)', 'https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie'],
    ['Know your dress codes (Debrett\'s)', 'https://business.debretts.com/know-your-dress-codes', 'British usage, including lounge suit'],
    ['Deconstructing dress codes (Debrett\'s)', 'https://debretts.com/deconstructing-dress-codes/'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('dress-code')}`;
  return {
    path: '/tools/dress-code-guide/', type: 'tool', title: 'Dress Code Guide: What to Wear for Every Invitation', crumb: 'Dress Code Guide',
    crumbs: [['Tools', '/tools/']],
    description: 'What to wear for white tie, black tie, black tie optional, cocktail, business formal, business casual, smart casual and casual, for women and men.',
    bundle: 'dress-code', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('dress-code').name, description: tool('dress-code').blurb, features: ['9 dress codes', 'Womenswear and menswear', 'Garment checklist', 'What to avoid', 'Formality scale'] },
    about: { '@type': 'Thing', name: 'Dress codes' },
    llms: `Dress Code Guide (Emily Post Institute, Debrett's): ${DCore.CODES.map((c) => `${c.name}: men ${c.menswear.map((i) => i[0]).join(', ')}; women ${c.womenswear.map((i) => i[0]).join(', ')}.`).join(' ')}`
  };
}

function toolsIndex() {
  const body = `<p class="eyebrow">All tools</p>
<h1>Free Style Tools</h1>
<p class="answer">SimplyStylo has ${TOOLS.length} free style tools: ${TOOLS.map((t) => t.name.toLowerCase()).join(', ')}. All of them run in your browser with no sign-up.</p>
<h2>All tools</h2>
${cards(TOOLS)}
<h2>Color guides</h2>
<p class="prose">Looking for what goes with one specific color? Our <a href="/colors/">color guides</a> cover the most-worn clothing colors with outfit formulas.</p>`;
  return {
    path: '/tools/', type: 'collection', title: 'Free Style Tools: Colors, Sizes and Outfits', crumb: 'Tools',
    description: 'Free style tools: color combination finder, size converter, color analysis quiz, capsule wardrobe planner and outfit generator.',
    body, datePublished: PUBLISHED, dateModified: MODIFIED, itemList: TOOLS.map((t) => [t.name, t.path]),
    llms: `Tools index: ${TOOLS.map((t) => t.name).join(', ')}.`
  };
}

export default () => [colorCombination(), sizeConverter(), colorAnalysis(), capsule(), outfitGenerator(), bodyShape(), photoPalette(), ringSize(), costPerWear(), selfieAnalysis(), wardrobeColors(), packingList(), dressCode(), toolsIndex()];
export { icon };
