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

function toolsIndex() {
  const body = `<p class="eyebrow">All tools</p>
<h1>Free Style Tools</h1>
<p class="answer">SimplyStylo has ${TOOLS.length} free style tools: a color combination finder, an international size converter, a personal color analysis quiz, a capsule wardrobe planner and an outfit generator. All of them run in your browser with no sign-up.</p>
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

export default () => [colorCombination(), sizeConverter(), colorAnalysis(), capsule(), outfitGenerator(), toolsIndex()];
export { icon };
