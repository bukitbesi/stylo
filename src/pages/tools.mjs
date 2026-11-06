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
const DDCore = require('../lib/dress-core.js');
const DD = require('../ui/dress-designer.js');
const WGCore = require('../lib/wedguest-core.js');
const WG = require('../ui/wedding-guest.js');
const BPCore = require('../lib/bridesmaid-core.js');
const BP = require('../ui/bridesmaid-palette.js');
const FCore = require('../lib/face-core.js');
const FS = require('../ui/face-shape.js');
const PCore = require('../lib/pant-core.js');
const PB = require('../ui/pant-break.js');
const PropCore = require('../lib/proportion-core.js');
const PropUI = require('../ui/body-proportion.js');
const HatCore = require('../lib/hat-core.js');
const HatUI = require('../ui/hat-size.js');
const GloveCore = require('../lib/glove-core.js');
const GloveUI = require('../ui/glove-size.js');
const NeckCore = require('../lib/necklace-core.js');
const NeckUI = require('../ui/necklace-length.js');
const CareCore = require('../lib/care-core.js');
const CareUI = require('../ui/care-label.js');
const SkirtCore = require('../lib/skirt-core.js');
const SkirtUI = require('../ui/circle-skirt.js');

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
    ogTitle: 'Free Personal Color Analysis Quiz: Find Your 12-Season Palette',
    crumbs: [['Tools', '/tools/']],
    description: 'Free 8-question personal color analysis quiz. Discover your 12-season palette, best clothing colors, neutrals, and capsule wardrobe shades in 2 minutes.',
    ogDescription: 'Take our free 8-question personal color analysis quiz to find your color season out of 12, with 10 best clothing colors, 4 neutrals, and shades to avoid.',
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
    path: '/tools/capsule-wardrobe/', type: 'tool', title: 'Capsule Wardrobe Planner & Outfit Checklist', crumb: 'Capsule Wardrobe Planner',
    ogTitle: 'Free Capsule Wardrobe Planner & Printable Outfit Checklist (US & UK)',
    crumbs: [['Tools', '/tools/']],
    description: `Plan a 15, 25 or 35 piece capsule wardrobe for women or men. 25 pieces = ${w25.outfits} outfits. Free outfit planner, 60-30-10 color palette and checklist.`,
    ogDescription: `Build a custom 15, 25, or 35-piece capsule wardrobe for work, casual, or travel. Generates ${w25.outfits} outfits from 25 pieces with a printable checklist.`,
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
    path: '/tools/outfit-generator/', type: 'tool', title: 'Outfit Planner & Generator: What to Wear Today', crumb: 'Outfit Generator',
    ogTitle: 'Free Daily Outfit Planner & Generator for Women and Men',
    crumbs: [['Tools', '/tools/']],
    description: 'Free daily outfit planner and generator for womenswear and menswear. Pick the occasion, weather temperature, and color to build a complete 60-30-10 outfit.',
    ogDescription: 'Plan what to wear for any occasion and temperature (°F or °C) with our free daily outfit planner and color-matched wardrobe generator.',
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

// ---------- Dress Designer ----------
function dressDesigner() {
  const def = DDCore.DEFAULT, adv = DDCore.advise(def);
  const faq = [
    ['Can I design my own dress online for free?', 'Yes. Choose a neckline, sleeves, waist, skirt shape, length, color and print (or upload your own fabric photo), and the dress is drawn live on a dress form. You can download it as a PNG image or copy a link to share it. No sign-up is needed.'],
    ['Can I use my own fabric or print?', 'Yes. Choose "My photo / fabric" as the fabric and pick a photo of a print or fabric. It is cropped to a small square tile and repeated across the dress inside your browser; it is not uploaded and not included in shared links.'],
    ['Which dress shape flatters my body?', 'As a guide: A-line and fit-and-flare skirts balance fuller hips; V-necks balance a fuller bust; wrap and natural-waist styles define the waist; off-shoulder and boat necklines widen narrow shoulders. The designer lists the body shapes each design suits; find your shape with the body shape calculator.'],
    ['What is the difference between A-line and fit-and-flare?', 'An A-line skirt widens gradually from the waist like the letter A. A fit-and-flare skirt is fitted through the bodice and flares out more fully from the waist, often with gathers or pleats, so it creates a stronger waist.'],
    ['What dress length is best for a wedding guest?', 'Midi and knee-length dresses suit most day and cocktail weddings; floor-length gowns suit black tie evening weddings. Check the invitation\'s dress code, and avoid white unless the couple asks for it.'],
    ['Can I take my design to a dressmaker?', 'Yes. Download the PNG and the design summary, and bring them with your measurements and fabric. A dressmaker or tailor can turn the sketch into a pattern; the drawing shows style lines, not exact measurements.'],
    ['Why is there a "Designed on SimplyStylo.com" line on the image?', 'The downloaded image carries a small credit so friends know where the designer is when you share it. The drawing itself is yours to use for personal projects.']
  ];
  const body = `<p class="eyebrow">Free design tool</p>
<h1>Dress Designer: Design Your Own Dress Online</h1>
<p class="answer">Design your own dress for free: choose from 8 necklines, 7 sleeves, 3 waistlines, 7 skirt shapes and 4 lengths, pick any color and print or use your own fabric photo, then download it as an image. The designer also tells you which body shapes it flatters and where to wear it.</p>
${verifiedLine(DDCore.FACTS.verified)}
<h2>Start from a look</h2>
${DD.gallery()}
${toolShell('dress-designer', 'Dress designer', DD.controls(def), DD.result(def), '<button type="button" class="btn" data-download>Download PNG</button>')}
<figure class="pin"><img src="/pins/dress-designer.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Six dress designs made with the SimplyStylo dress designer: wedding guest midi, bridal gown, prom ball gown, office sheath, 1950s swing dress and boho maxi"><figcaption>Save this to Pinterest to come back to the designer.</figcaption></figure>
<h2>How the dress designer works</h2>
${steps([
    '<b>Pick the style lines:</b> neckline, sleeves, waist seam, skirt shape and length. The dress is redrawn on the dress form as you choose.',
    '<b>Choose the fabric:</b> any main color, a pattern color for dots, stripes, gingham or florals, or upload your own fabric photo.',
    '<b>Read the advice:</b> which body shapes the design suits, which dress code it fits and which color seasons its color belongs to.',
    '<b>Save it:</b> download a PNG to keep, pin or take to a dressmaker, or copy a link that reopens the same design.'])}
<h2>Neckline guide</h2>
${table('Necklines and what they do', ['Neckline', 'Effect', 'Often suits'], Object.values(DDCore.OPTIONS.neckline).map((o) => [esc(o.name), esc(o.tip), esc(o.suits.map((s) => DDCore.SHAPE_NAMES[s]).join(', '))]))}
<h2>Skirt shape guide</h2>
${table('Skirt shapes and what they do', ['Skirt', 'Effect', 'Often suits'], Object.values(DDCore.OPTIONS.skirt).map((o) => [esc(o.name), esc(o.tip), esc(o.suits.map((s) => DDCore.SHAPE_NAMES[s]).join(', '))]))}
${callout('Body shape suggestions are general styling guidance. Wear what you love: fit, fabric and confidence matter more than any rule.')}
${sources([
    ['Neckline (Wikipedia)', 'https://en.wikipedia.org/wiki/Neckline', 'neckline names and shapes'],
    ['A-line (Wikipedia)', 'https://en.wikipedia.org/wiki/A-line_(clothing)'],
    ['Female body shape and the FFIT method (Wikipedia)', 'https://en.wikipedia.org/wiki/Female_body_shape', 'body shape names used in the advice'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('dress-designer')}`;
  return {
    path: '/tools/dress-designer/', type: 'tool', title: 'Dress Designer: Design Your Own Dress Online Free', crumb: 'Dress Designer',
    crumbs: [['Tools', '/tools/']],
    description: 'Design your own dress online free: neckline, sleeves, waist, skirt, length, color and print or your own fabric photo. Download as PNG, no sign-up.',
    bundle: 'dress-designer', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('dress-designer').name, description: tool('dress-designer').blurb, features: ['8 necklines, 7 sleeves, 3 waists, 7 skirts, 4 lengths', 'Any color, 5 prints or your own fabric photo', 'Body shape and dress code advice', 'PNG download', 'Shareable design links'] },
    about: { '@type': 'Thing', name: 'Dress design' },
    llms: `Dress Designer: free online dress designer drawing a dress on a dress form from neckline (${Object.values(DDCore.OPTIONS.neckline).map((o) => o.name).join(', ')}), sleeves, waist, skirt (${Object.values(DDCore.OPTIONS.skirt).map((o) => o.name).join(', ')}), length, color and print or the user's own fabric photo (processed on device). Gives flattering body shapes, dress code and color season; PNG download. Example: ${DDCore.describe(def)} suits ${adv.shapes.map((s) => s.name).join(', ')}.`
  };
}

const variantShell = (variant, label, d, extra) => toolShell('dress-designer', label, DD.controls(d, variant), DD.result(d, null, variant), extra)
  .replace('data-tool="dress-designer"', `data-tool="dress-designer" data-variant="${variant}"`);

// ---------- Wedding Dress Designer ----------
function weddingDress() {
  const d0 = DDCore.WEDDING_PRESETS[0].d, O = DDCore.OPTIONS;
  const faq = [
    ['Can I design my own wedding dress online?', 'Yes. Choose a neckline, sleeves, waist, skirt silhouette, length, bridal shade and fabric (solid, lace, sparkle or your own fabric photo), then add a train and veil. The dress is drawn live on a dress form, and you can download it as an image to show your bridal shop or dressmaker.'],
    ['What are the wedding dress train lengths?', `From shortest to longest: ${Object.values(O.train).filter((t) => t.w).map((t) => t.name.toLowerCase()).join(', ')}. Measurements in inches differ between designers and bridal shops, so check the exact length on the gown you choose.`],
    ['What are the wedding veil lengths?', `From shortest to longest: ${Object.values(O.veil).filter((v) => v.y).map((v) => v.name.toLowerCase()).join(', ')}. As with trains, exact lengths vary by maker; a chapel veil usually reaches the floor and a cathedral veil extends beyond the dress.`],
    ['Which wedding dress silhouette suits my body shape?', 'As a guide: A-line and ball gown (fit-and-flare) skirts suit almost every shape and balance fuller hips; mermaid and sheath (column) styles show curves and suit hourglass shapes; empire waists skim the tummy. The designer lists the shapes each design suits.'],
    ['What is the difference between white, ivory and champagne?', 'Bright white is the cleanest white; soft white has a little warmth; ivory is creamier and flatters most skin tones; champagne has a golden-beige tint that suits warm complexions. Compare shades next to your face in daylight before you decide.'],
    ['What train length should I choose for my venue?', 'Shorter trains (sweep, court) are easier for outdoor, beach and garden weddings and for dancing; chapel and cathedral trains suit large indoor venues and formal ceremonies. Many brides bustle a long train for the reception.'],
    ['Is my fabric photo uploaded?', 'No. If you choose "My photo / fabric", the photo is cropped to a small tile inside your browser and never leaves your device. Shared links include the design choices but not the photo.']
  ];
  const body = `<p class="eyebrow">Free bridal design tool</p>
<h1>Wedding Dress Designer: Design Your Own Wedding Dress</h1>
<p class="answer">Design your wedding dress online for free: pick a silhouette, neckline, sleeves, bridal shade and lace or sparkle fabric, then add a train (sweep to royal) and a veil (elbow to cathedral). The gown is drawn live, with body shape advice, and downloads as an image for your bridal appointment.</p>
${verifiedLine(DDCore.FACTS.verified)}
<h2>Start from a bridal look</h2>
${DD.gallery('wedding')}
${variantShell('wedding', 'Wedding dress designer', d0, '<button type="button" class="btn" data-download>Download PNG</button>')}
<figure class="pin"><img src="/pins/wedding-dress-designer.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Six wedding dress designs: classic ball gown, lace mermaid, boho lace A-line, minimalist sheath, tea-length retro and off-shoulder princess"><figcaption>Save this to your wedding board.</figcaption></figure>
<h2>How the wedding dress designer works</h2>
${steps([
    '<b>Choose the silhouette:</b> skirt shape (A-line, ball gown, mermaid, sheath), length and waist.',
    '<b>Choose the bodice:</b> neckline and sleeves, from strapless sweetheart to long lace sleeves.',
    '<b>Choose the finish:</b> bridal shade, lace, sparkle or your own fabric photo, and an optional belt.',
    '<b>Add a train and veil</b> to see the full bridal look, then download it or copy the link.'])}
<h2>Train and veil lengths</h2>
${table('Wedding dress trains and veils, shortest to longest', ['Train', 'Veil'], [1, 2, 3, 4, 5].map((i) => [esc(Object.values(O.train)[i].name), esc((Object.values(O.veil)[i] || { name: '–' }).name)]))}
${callout('Train and veil lengths in inches differ between designers and bridal shops, so the designer shows them in order rather than in exact measurements. Check the length on the gown and veil you choose.')}
${sources([
    ['Train (clothing) (Wikipedia)', 'https://en.wikipedia.org/wiki/Train_(clothing)'],
    ['Wedding dress trains (The Knot)', 'https://www.theknot.com/content/wedding-dress-trains'],
    ['Wedding veil styles and lengths (The Knot)', 'https://www.theknot.com/content/beautiful-wedding-veil-styles'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('wedding-dress')}`;
  return {
    path: '/tools/wedding-dress-designer/', type: 'tool', title: 'Wedding Dress Designer: Design Your Own Wedding Dress', crumb: 'Wedding Dress Designer',
    crumbs: [['Tools', '/tools/']],
    description: 'Design your own wedding dress online free: silhouette, neckline, lace or sparkle, bridal shade, train and veil. Download your gown as an image.',
    bundle: 'dress-designer', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('wedding-dress').name, description: tool('wedding-dress').blurb, features: ['Bridal silhouettes and necklines', 'Lace, sparkle and own-fabric photo', '6 bridal shades', 'Trains from sweep to royal', 'Veils from elbow to cathedral', 'PNG download'] },
    about: { '@type': 'Thing', name: 'Wedding dress design' },
    llms: `Wedding Dress Designer: free online bridal gown designer with trains (${Object.values(O.train).filter((t) => t.w).map((t) => t.name).join(', ')}) and veils (${Object.values(O.veil).filter((v) => v.y).map((v) => v.name).join(', ')}), lace/sparkle fabrics, bridal shades and body shape advice; PNG download. Lengths shown in order because inches vary by designer.`
  };
}

// ---------- Prom Dress Designer ----------
function promDress() {
  const d0 = DDCore.PROM_PRESETS[0].d;
  const faq = [
    ['Can I design my own prom dress online for free?', 'Yes. Choose a neckline, sleeves, skirt (mermaid, ball gown, A-line, column and more), length, color and fabric including sequin sparkle or your own fabric photo, and add a side slit. Download the design as an image to show a dressmaker or your friends.'],
    ['What prom dress style suits my body shape?', 'As a guide: ball gown and A-line skirts balance fuller hips; mermaid and column styles show an hourglass figure; V-necks balance a fuller bust; off-shoulder and halter necklines suit narrower shoulders. The designer lists the body shapes each design suits.'],
    ['What color prom dress should I wear?', 'Choose colors from your color season: jewel tones such as emerald and sapphire suit deep and cool colorings, while coral and warm reds suit warm colorings. Take the free color analysis quiz to find yours, then set that color in the designer.'],
    ['Is a side slit appropriate for prom?', 'Many schools allow slits, but some dress codes limit how high a slit can go. Check your school\'s prom dress policy before you buy or commission a dress.'],
    ['How far ahead should I plan a custom prom dress?', 'Dressmakers often ask for several months for a made-to-order gown, plus time for fittings. Bring your downloaded design, measurements and fabric ideas to the first consultation.'],
    ['Can I see sequins or glitter fabric?', 'Yes: choose "Sequin / sparkle" as the fabric, then set the dress color and the sparkle color separately, for example navy with silver sparkle for a starry-night look.'],
    ['Is my fabric photo uploaded?', 'No. Fabric photos are cropped to a tile inside your browser and never sent anywhere; they are also not included in shared links.']
  ];
  const body = `<p class="eyebrow">Free prom design tool</p>
<h1>Prom Dress Designer: Design Your Own Prom Dress</h1>
<p class="answer">Design your prom dress online for free: choose a mermaid, ball gown, A-line or column silhouette, a neckline, sequin sparkle or satin, any color and an optional side slit. The dress is drawn live with body shape advice and downloads as an image to share or take to a dressmaker.</p>
${verifiedLine(DDCore.FACTS.verified)}
<h2>Start from a prom look</h2>
${DD.gallery('prom')}
${variantShell('prom', 'Prom dress designer', d0, '<button type="button" class="btn" data-download>Download PNG</button>')}
<figure class="pin"><img src="/pins/prom-dress-designer.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Six prom dress designs: sequin mermaid, red carpet slit, satin ball gown, starry night, blush princess and party mini"><figcaption>Save this prom inspiration to Pinterest.</figcaption></figure>
<h2>How the prom dress designer works</h2>
${steps([
    '<b>Pick a look</b> above or start from scratch.',
    '<b>Choose the silhouette:</b> mermaid, ball gown (fit-and-flare), A-line, column, tiered or pencil, and the length.',
    '<b>Make it shine:</b> sequin sparkle with its own sparkle color, any main color, a belt and an optional side slit.',
    '<b>Save it:</b> download a PNG or copy the link to share with friends.'])}
<h2>Prom silhouettes at a glance</h2>
${table('Prom dress skirt shapes', ['Skirt', 'Effect', 'Often suits'], ['flare', 'aline', 'mermaid', 'column', 'tiered'].map((k) => {
    const o = DDCore.OPTIONS.skirt[k];
    return [esc(k === 'flare' ? 'Ball gown (fit-and-flare)' : o.name), esc(o.tip), esc(o.suits.map((s) => DDCore.SHAPE_NAMES[s]).join(', '))];
  }))}
${callout('Body shape and color suggestions are general styling guidance. Check your school\'s prom dress code, and wear what makes you feel confident.')}
${sources([
    ['Female body shape and the FFIT method (Wikipedia)', 'https://en.wikipedia.org/wiki/Female_body_shape'],
    ['Neckline (Wikipedia)', 'https://en.wikipedia.org/wiki/Neckline'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('prom-dress')}`;
  return {
    path: '/tools/prom-dress-designer/', type: 'tool', title: 'Prom Dress Designer: Design Your Own Prom Dress', crumb: 'Prom Dress Designer',
    crumbs: [['Tools', '/tools/']],
    description: 'Design your own prom dress online free: mermaid, ball gown or A-line, sequins, any color and a side slit. Body shape advice and PNG download.',
    bundle: 'dress-designer', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('prom-dress').name, description: tool('prom-dress').blurb, features: ['Prom silhouettes', 'Sequin sparkle fabric', 'Side slit', 'Any color', 'PNG download'] },
    about: { '@type': 'Thing', name: 'Prom dress design' },
    llms: 'Prom Dress Designer: free online prom gown designer (mermaid, ball gown, A-line, column, tiered), sequin sparkle fabric with separate sparkle color, side slit, any color, body shape advice and PNG download; 6 preset prom looks.'
  };
}

// ---------- Wedding Guest Outfit Finder ----------
function weddingGuest() {
  const ex = WG.summary(WG.norm(WG.DEFAULT));
  const p = (o) => WGCore.plan(o).pieces.map((x) => x[0].toLowerCase()).join(', ');
  const faq = [
    ['What should I wear to a wedding as a guest?', 'Match the dress code on the invitation, then adjust for time, season and venue: darker and more formal for evening, lighter fabrics in summer, block heels for grass, flat sandals on the beach. Avoid white, ivory, cream and beige unless the couple asks for them.'],
    ['What is cocktail attire for a wedding?', `For women, a knee- to midi-length cocktail dress with heels or dressy flats; for men, a suit and tie. Example for a summer evening garden wedding: ${p({ code: 'cocktail', time: 'evening', season: 'summer', venue: 'garden' })}.`],
    ['What should a man wear to a wedding?', `It depends on the dress code: black tie means a tuxedo with a black bow tie; cocktail or semi-formal means a suit and tie; dressy casual means a blazer with chinos. Example, men's cocktail wedding: ${p({ code: 'cocktail', time: 'evening', season: 'fall', venue: 'ballroom', style: 'menswear' })}.`],
    ['Can I wear black to a wedding?', 'Black is widely accepted today, especially for evening and formal weddings, though some families and cultures still avoid it. If in doubt, choose a deep jewel tone such as emerald, burgundy or navy.'],
    ['Can I wear white, ivory or cream to a wedding?', 'No, unless the couple asks for it. White, ivory, cream and even beige can photograph as white and compete with the couple, so wedding guides such as The Knot and Zola advise against them.'],
    ['What should I wear to a beach wedding?', 'Light, breathable fabrics such as linen and chiffon, a flowy midi or maxi dress or linen suit, and flat sandals, loafers or espadrilles instead of heels that sink in sand.'],
    ['What should I wear to a winter wedding?', `Heavier fabrics such as velvet or wool crepe, long sleeves or a wrap, a proper coat for photos outside, and deep colors such as burgundy, emerald or navy. Example, winter evening cocktail: ${p({ code: 'cocktail', time: 'evening', season: 'winter', venue: 'ballroom' })}.`]
  ];
  const body = `<p class="eyebrow">Free wedding guest tool</p>
<h1>What to Wear to a Wedding: Guest Outfit Finder</h1>
<p class="answer">To choose a wedding guest outfit, match the invitation's dress code, then adjust for the time, season and venue, and avoid white, ivory, cream and beige. Example: ${esc(ex)} Set your wedding's details below for a complete outfit, colors and etiquette.</p>
${verifiedLine(WGCore.FACTS.verified)}
${toolShell('wedding-guest', 'Wedding guest outfit finder', WG.controls(WG.norm(WG.DEFAULT)), WG.result(WG.norm(WG.DEFAULT)))}
<figure class="pin"><img src="/pins/wedding-guest-outfit.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="What to wear to a wedding: guest dresses for spring, summer, fall and winter"><figcaption>Save this wedding guest guide.</figcaption></figure>
<h2>How the wedding guest outfit finder works</h2>
${steps([
    '<b>Dress code</b> sets the formality and the main pieces, following the Emily Post Institute attire guide.',
    '<b>Time and season</b> choose the colors: lighter by day and in spring and summer, deeper in the evening and in fall and winter.',
    '<b>Venue</b> chooses the shoes and layers: block heels on grass, flat sandals on sand, a wrap for church.',
    '<b>Etiquette</b> comes from wedding guides: no white or near-white, and the couple\'s request always wins.'])}
<h2>Wedding guest guides by season</h2>
<ul class="chips">${['spring', 'summer', 'fall', 'winter'].map((s) => `<li><a class="chip" href="/wedding-guest/${s}/"><span class="dot" style="background:#${WGCore.PALETTES[s].evening[0][1]}"></span>What to wear to a ${s} wedding</a></li>`).join('')}</ul>
<h2>Wedding guest dress codes</h2>
${table('What each wedding dress code means for guests', ['Dress code', 'Womenswear', 'Menswear'], Object.keys(WGCore.CODES).map((c) => [esc(WGCore.CODES[c]),
    esc(WGCore.plan({ code: c, style: 'womenswear' }).pieces[0][0]), esc(WGCore.plan({ code: c, style: 'menswear' }).pieces.slice(0, 2).map((x) => x[0]).join(' + '))]))}
<h2>Shoes by venue</h2>
${table('Wedding guest shoes for each venue', ['Venue', 'Womenswear', 'Menswear'], Object.keys(WGCore.VENUES).map((v) => [esc(WGCore.VENUES[v]),
    esc(WGCore.plan({ venue: v, style: 'womenswear' }).pieces[1][0]), esc(WGCore.plan({ venue: v, code: 'cocktail', style: 'menswear' }).pieces.find((x) => /shoes|loafers/i.test(x[0]))[0])]))}
${callout('Wedding customs differ between cultures and religions. When the invitation or the couple gives guidance, follow it over any general rule.')}
${sources([
    ['Attire guide: dress codes from casual to white tie (Emily Post Institute)', 'https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie'],
    ['How to tell your mother-in-law she can\'t wear white (The Knot)', 'https://www.theknot.com/content/how-to-tell-your-mother-in-law-she-cant-wear-white', 'why white, ivory, cream and beige are avoided'],
    ['Wedding guest attire: a guide to every dress code (Zola)', 'https://www.zola.com/expert-advice/what-to-wear-to-a-wedding'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('wedding-guest')}`;
  return {
    path: '/tools/wedding-guest-outfit/', type: 'tool', title: 'What to Wear to a Wedding: Guest Outfit Finder', crumb: 'Wedding Guest Outfit Finder',
    crumbs: [['Tools', '/tools/']],
    description: 'What to wear to a wedding as a guest: enter the dress code, time, season and venue for a complete outfit, colors and etiquette, for women and men.',
    bundle: 'wedding-guest', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('wedding-guest').name, description: tool('wedding-guest').blurb, features: ['5 wedding dress codes', 'Day or evening', '4 seasons', '6 venues', 'Womenswear and menswear', 'Etiquette notes'] },
    about: { '@type': 'Thing', name: 'Wedding guest attire' },
    llms: `Wedding Guest Outfit Finder: dress code (black tie, black tie optional, cocktail, dressy casual, casual) + day/evening + season + venue → outfit, 4 season colors and etiquette (no white/ivory/cream/beige unless asked; block heels on grass, flat sandals on sand; black widely accepted for evening). Example: ${ex}`
  };
}

// ---------- Bridesmaid Color Palette ----------
function bridesmaidPalette() {
  const ex = BP.summary(BP.norm(BP.DEFAULT));
  const faq = [
    ['How do I choose bridesmaid dress colors?', 'Start from one main wedding color, then choose a style: ombre (the same hue from light to dark), mix and match (the main color plus its neighbors on the color wheel and a light and a deep shade), or matching (one color with different necklines). The generator shows every bridesmaid\'s dress at once.'],
    ['What is an ombre bridal party?', 'Ombre bridesmaids wear the same color in graduating shades, usually lightest to darkest across the line. It looks coordinated in photos and lets each bridesmaid wear a slightly different shade.'],
    ['How do mix-and-match bridesmaid dresses still look coordinated?', 'Keep one element the same, such as fabric, length or neckline, and choose colors from one palette. The generator builds a five-color palette from your main color so every mix still belongs together.'],
    ['What color should groomsmen wear with the bridesmaids?', 'A neutral suit that contrasts with the bridesmaid color, with ties or pocket squares in the main wedding color. The generator suggests navy, light gray, tan or charcoal depending on your color and mood.'],
    ['How many bridesmaids can I plan for?', 'From 2 to 12. With more than 7, ombre and mix-and-match palettes repeat colors so the line stays balanced.'],
    ['Can I download the bridesmaid palette?', 'Yes. Download PNG saves the whole bridal party lineup as an image, ready to share with your bridesmaids or pin to a wedding board.'],
    ['What are the best bridesmaid color moods?', 'Soft pastels suit spring and garden weddings, rich jewel tones suit fall and winter evenings, and earthy muted shades suit rustic and boho weddings. Set the mood and the generator adjusts every shade.']
  ];
  const body = `<p class="eyebrow">Free wedding color tool</p>
<h1>Bridesmaid Color Palette Generator</h1>
<p class="answer">Pick one wedding color and the generator dresses every bridesmaid: ombre from light to dark, a mix-and-match palette, or one matching color in different necklines, with groomsmen suit and tie colors. Example: ${esc(ex)} Download the lineup as an image to share.</p>
${verifiedLine(BPCore.FACTS.verified)}
${toolShell('bridesmaid-palette', 'Bridesmaid color palette generator', BP.controls(BP.norm(BP.DEFAULT)), BP.result(BP.norm(BP.DEFAULT)), '<button type="button" class="btn" data-download>Download PNG</button>')}
<figure class="pin"><img src="/pins/bridesmaid-color-palette.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Bridesmaid color palette ideas: sage ombre, jewel mix and blush with mixed necklines"><figcaption>Save these bridesmaid palettes to your wedding board.</figcaption></figure>
<h2>How the bridesmaid palette generator works</h2>
${steps([
    '<b>Main color:</b> any color, adjusted to the mood you choose (pastel, jewel, earthy or exactly as chosen).',
    '<b>Ombre:</b> the same hue in even steps from light to dark, one per bridesmaid.',
    '<b>Mix and match:</b> a five-color palette (main color, two color-wheel neighbors 25° either side, a light tint and a deep shade) shared across the party.',
    '<b>Groomsmen:</b> a classic suit color that contrasts with the main color, with ties in the main color.'])}
${table('Bridesmaid color styles', ['Style', 'Looks', 'Best for'], [['Ombre', 'Same color, light to dark', 'Clear, coordinated photos'], ['Mix and match', 'Related colors from one palette', 'Relaxed, boho and garden weddings'], ['Matching', 'One color, different necklines', 'Classic, formal weddings']])}
${callout('Screens show colors differently from fabric. Ask for fabric swatches before ordering bridesmaid dresses.')}
${sources([
    ['Color scheme and color wheel harmonies (Wikipedia)', 'https://en.wikipedia.org/wiki/Color_scheme'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('bridesmaid-palette')}`;
  return {
    path: '/tools/bridesmaid-color-palette/', type: 'tool', title: 'Bridesmaid Color Palette Generator', crumb: 'Bridesmaid Color Palette',
    crumbs: [['Tools', '/tools/']],
    description: 'Free bridesmaid color palette generator: one wedding color becomes ombre, mix-and-match or matching dresses for every bridesmaid, plus groomsmen colors.',
    bundle: 'bridesmaid-palette', faq, body, datePublished: '2026-11-02', dateModified: MODIFIED,
    app: { name: tool('bridesmaid-palette').name, description: tool('bridesmaid-palette').blurb, features: ['Ombre, mix-and-match or matching', '4 color moods', '2 to 12 bridesmaids', 'Groomsmen colors', 'PNG download'] },
    about: { '@type': 'Thing', name: 'Bridesmaid dress colors' },
    llms: `Bridesmaid Color Palette Generator: main color + style (ombre light-to-dark, mix-and-match 5-color palette from ±25° analogous, tint and shade, or matching with varied necklines) + mood (pastel, jewel, earthy) + 2–12 bridesmaids → dress lineup, wedding palette and groomsmen suit/tie colors. Example: ${ex}`
  };
}

// ---------- Face Shape & Sunglasses Finder ----------
function faceShape() {
  const ex = FS.summary(FS.norm(FS.DEFAULT));
  const shapes = Object.entries(FCore.SHAPES);
  const faq = [
    ['How do I know my face shape for sunglasses?', 'Measure four distances across your face in front of a mirror: forehead width, cheekbone width, jawline width, and total face length from hairline to chin. An oval face is about 1.35 to 1.55 times as long as it is wide at the cheekbones; a round or square face is under 1.35; an oblong face is 1.55 or more.'],
    ['What sunglasses suit a round face?', 'Angular frames such as wayfarers, rectangular frames, geometric shapes, and upswept cat-eyes suit a round face best. Their straight lines and crisp corners add definition and visually lengthen the face, whereas small round lenses emphasize fullness.'],
    ['What sunglasses look best on a square face?', 'Round, oval, teardrop aviator, and classic browline (Clubmaster) sunglasses flatter a square face. Curved rims and thinner metal bridges soften a strong, angular jawline and wide forehead.'],
    ['What is the golden ratio or facial index for an oval face?', 'In facial anthropometry (Farkas, 1994), a mesoprosopic or balanced oval face has a length-to-cheekbone width ratio between 1.35 and 1.55, with the forehead slightly wider than the jaw and cheekbones forming the widest horizontal line.'],
    ['What frames fit a heart-shaped or diamond face?', 'Heart-shaped faces (wider forehead, narrow chin) suit aviators, round frames, and light or rimless bottom edges that add width lower down. Diamond faces (widest at the cheekbones) look best in browline, cat-eye, and oval frames that balance narrow temples.'],
    ['How wide should sunglasses be for my face?', 'Your frame width should match your cheekbone width within 2 to 3 millimeters so the temples neither pinch your head nor extend far past your face. Most medium adult frames measure 135 to 142 mm across the front.'],
    ['Does face shape also affect necklines and shirt collars?', 'Yes. Visual balance works the same way below the chin: round and square faces benefit from V-necks and open collars that lengthen the neck, while oblong faces look balanced in crew necks, boat necks, and spread shirt collars.']
  ];
  const body = `<p class="eyebrow">Free eyewear &amp; proportion tool</p>
<h1>Face Shape Calculator and Sunglasses Frame Matcher</h1>
<p class="answer">An oval face has a length-to-cheekbone ratio between 1.35 and 1.55; under 1.35 is round or square, and 1.55 or above is oblong. Example: ${esc(ex)} Enter your four measurements below to see your exact facial ratios, live contour diagram, and best sunglasses, haircuts, and necklines.</p>
${verifiedLine(FCore.FACTS.verified)}
${toolShell('face-shape', 'Face shape and sunglasses finder', FS.controls(FS.norm(FS.DEFAULT)), FS.result(FS.norm(FS.DEFAULT)))}
<h2>How the face shape and sunglasses matcher works</h2>
${steps([
    '<b>Length-to-width index</b> divides your face length (hairline to chin) by your cheekbone width, following Farkas facial anthropometry.',
    '<b>Contour taper ratios</b> compare your forehead and jawline against your cheekbones to distinguish oval, heart, diamond, and triangle shapes.',
    '<b>Oppositional frame geometry</b> matches curved frames to angular faces (square, diamond) and structured angular frames to soft faces (round).',
    '<b>Hair and collar balance</b> applies the same vertical vs horizontal optical rules to necklines, lapels, and haircuts.'])}
<h2>Face shapes and best sunglasses chart</h2>
${table('All 7 face shapes, their proportions, and recommended eyewear', ['Face shape', 'Key ratio / rule', 'Best sunglasses', 'Frames to avoid'], shapes.map(([, s]) => [
    esc(s.name), esc(s.rule), esc(s.frames.join(', ')), esc(s.avoid)]))}
${callout('Most people sit close to two shapes—for example, an oval face with a slightly square jaw. Use your primary shape for frame width and your secondary trait to choose between curved or angular rims.')}
${sources([
    ['Anthropometry of the Head and Face (Leslie G. Farkas, 1994)', 'https://en.wikipedia.org/wiki/Facial_index', 'facial index (length ÷ bizygomatic breadth) and contour classifications'],
    ['Eyewear and face shape dispensing guidelines (The Vision Council)', 'https://thevisioncouncil.org/', 'optical frame geometry and bridge balance'],
    ['SimplyStylo methodology', '/methodology/', 'how every tool is built and checked']])}
${faqBlock(faq)}
${relatedBlock('face-shape')}`;
  return {
    path: '/tools/face-shape-sunglasses/', type: 'tool', title: 'Face Shape Calculator: Best Sunglasses and Frames Guide', crumb: 'Face Shape Calculator',
    crumbs: [['Tools', '/tools/']],
    description: 'Calculate your face shape from forehead, cheekbone, jawline and length measurements. Find the best sunglasses, eyeglasses, haircuts and necklines.',
    bundle: 'face-shape', faq, body, datePublished: '2026-11-03', dateModified: MODIFIED,
    app: { name: tool('face-shape').name, description: tool('face-shape').blurb, features: ['7 anthropometric face shapes', 'Live SVG face & sunglasses diagram', 'Centimeters and inches', 'Eyewear, haircut and neckline advice'] },
    about: [
      { '@type': 'Thing', name: 'Facial index', sameAs: 'https://en.wikipedia.org/wiki/Facial_index' },
      { '@type': 'Thing', name: 'Sunglasses', sameAs: 'https://en.wikipedia.org/wiki/Sunglasses' }
    ],
    llms: `Face Shape and Sunglasses Finder: classifies 7 face shapes (Oval, Round, Square, Oblong, Heart, Diamond, Triangle) from forehead, cheekbone, jawline and face length in cm or inches using the facial index (length ÷ cheekbones: < 1.35 round/square, 1.35–1.55 oval, ≥ 1.55 oblong) and jaw/forehead taper ratios. Example: ${ex}`
  };
}

function pantBreak() {
  const ex = PB.summary(PB.norm(PB.DEFAULT));
  const breaks = Object.entries(PCore.BREAKS);
  const faq = [
    ['What is pant break in tailoring?', 'Pant break is the fold or crease that forms at the bottom front of your trouser leg where it rests on the top (vamp) of your shoe. Tailors measure it in five stages: cropped (ankle), no break, quarter break, half break, and full break.'],
    ['What is the difference between no break, quarter break, and half break?', 'No break means the trouser hem lightly kisses the top of the shoe with zero horizontal folding (+0 in offset). A quarter break adds about 0.4 in (1 cm) so a single subtle dimple forms. A half break adds 0.75 in (1.9 cm) for a classic Savile Row fold halfway down the shoe vamp.'],
    ['Which pant break is best for a modern suit or wedding?', 'A quarter break (slight break) is the most versatile choice for business suits and wedding guests: it looks clean while standing and covers the sock better than no-break trousers when you walk or sit.'],
    ['Does shoe style change my trouser inseam?', 'Yes. Loafers and slip-ons have a lower vamp than lace-up oxfords, so trousers worn primarily with loafers need to be hemmed about 0.25 in (0.6 cm) shorter to achieve the same break without pooling over the instep.'],
    ['How wide should my trouser leg opening be for each break?', 'Slim trousers (7 in / 17.8 cm flat leg opening) only accommodate cropped, no-break, or quarter-break hems because a narrow opening stops high on the shoe. Tailored trousers (7.75 in / 19.7 cm) work with no break through half break, while relaxed or wide-leg trousers (8.75 in / 22.2 cm) drape cleanly into a half or full break.'],
    ['How tall should trouser turn-up cuffs be?', 'Classic turn-up cuffs measure 1.5 in (3.8 cm) on slim trousers, 1.75 in (4.5 cm) on tailored straight trousers, and 2.0 in (5 cm) on relaxed or pleated trousers. A turn-up cuff requires about 4 in (10 cm) of extra unhemmed cloth.'],
    ['What is a military hem or angled trouser hem?', 'An angled hem (also called a military or Savile Row slant) cuts the back of the trouser leg 0.25 to 0.5 in lower than the front so the front drapes cleanly on the shoe vamp while the back covers the top of the shoe heel counter.']
  ];
  const body = `<p class="eyebrow">Free Savile Row tailoring tool</p>
<h1>Pant Break Guide and Trouser Hem Inseam Calculator</h1>
<p class="answer">Pant break is how much your trouser hem rests on your shoe: no break adds 0 in to your baseline inseam, a quarter break adds 0.4 in (1 cm), a half break adds 0.75 in (1.9 cm), and a full break adds 1.25 in (3.2 cm). Example: ${esc(ex)} Enter your inseam below for exact tailor instructions and a live side-profile diagram.</p>
${verifiedLine(PCore.FACTS.verified)}
${toolShell('pant-break', 'Pant break and trouser hem calculator', PB.controls(PB.norm(PB.DEFAULT)), PB.result(PB.norm(PB.DEFAULT)))}
<h2>How the trouser hem and pant break calculator works</h2>
${steps([
    '<b>Baseline no-break inseam</b> is measured from the crotch seam straight down to the top of your shoe vamp.',
    '<b>Break offset</b> adds or subtracts length: −1 in for cropped, 0 in for no break, +0.4 in for quarter break, +0.75 in for half break, and +1.25 in for full break.',
    '<b>Footwear vamp adjustment</b> shortens the hem by 0.25 in for low-vamp loafers or lengthens by 0.25 in for dress boots.',
    '<b>Leg opening and cuff check</b> pairs your trouser width (7 to 8.75 in flat) with the right cuff height (1.5 to 2 in) and flags combinations that bunch.'])}
<h2>Pant break comparison chart</h2>
${table('All 5 trouser breaks, their inseam offsets, and best occasions', ['Break style', 'Inseam offset', 'How it drapes', 'Best for'], breaks.map(([, b]) => [
    esc(b.name), `${b.offsetIn > 0 ? '+' : ''}${b.offsetIn} in (${Math.round(b.offsetIn * 2.54 * 10) / 10} cm)`, esc(b.look), esc(b.vibe)]))}
${callout('Always bring the exact shoes and belt you plan to wear to your fitting. Changing from oxfords to loafers or shifting your waistband by half an inch changes the break immediately.')}
${sources([
    ['Trouser length and break guide (Savile Row & Permanent Style)', 'https://www.permanentstyle.com/', 'quarter, half, and full break drape over the shoe instep'],
    ['Tailoring alterations and turn-up cuff proportions (Gentleman\'s Gazette)', 'https://www.gentlemansgazette.com/', 'cuff height and leg opening ratios'],
    ['SimplyStylo methodology', '/methodology/', 'how every tool is built and checked']])}
${faqBlock(faq)}
${relatedBlock('pant-break')}`;
  return {
    path: '/tools/pant-break-guide/', type: 'tool', title: 'Pant Break Guide: Trouser Hem and Inseam Calculator', crumb: 'Pant Break Calculator',
    crumbs: [['Tools', '/tools/']],
    description: 'Calculate your exact trouser hem inseam for no break, quarter break, half break, full break or cropped pants, adjusted for loafers, oxfords and cuffs.',
    bundle: 'pant-break', faq, body, datePublished: '2026-11-03', dateModified: MODIFIED,
    app: { name: tool('pant-break').name, description: tool('pant-break').blurb, features: ['5 trouser break styles', 'Footwear vamp adjustment', 'Leg opening and turn-up cuff specs', 'Live side-profile SVG diagram'] },
    about: [
      { '@type': 'Thing', name: 'Trousers', sameAs: 'https://en.wikipedia.org/wiki/Trousers' },
      { '@type': 'Thing', name: 'Hemline', sameAs: 'https://en.wikipedia.org/wiki/Hemline' }
    ],
    llms: `Pant Break and Trouser Hem Calculator: calculates finished trouser inseam, leg opening width, and cuff height from baseline no-break inseam (in or cm), break style (cropped −1 in, no break 0 in, quarter break +0.4 in, half break +0.75 in, full break +1.25 in), footwear vamp (loafers −0.25 in, oxfords 0 in, boots +0.25 in), and fit (slim 7 in, tailored 7.75 in, relaxed 8.75 in). Example: ${ex}`
  };
}

// ---------- Body Proportion & Golden Ratio Calculator ----------
function bodyProportion() {
  const ex = PropUI.summary(PropUI.norm(PropUI.DEFAULT));
  const faq = [
    ['What is the golden ratio in fashion and outfit styling?', 'The golden ratio (approx 1:1.618) in fashion is applied as the Rule of Thirds: dividing your visual height into 1/3 top and 2/3 bottom (or vice versa), rather than cutting your body in half at a 1:1 ratio. A 1:2 visual ratio elongates your silhouette, which is why tucking shirts and wearing high-rise trousers looks naturally balanced.'],
    ['How do I know if I have a long torso or long legs?', 'Measure your total standing height and your inseam (from crotch seam straight to the floor). Divide your inseam by your height: if the ratio is under 46% (0.46), you have a longer torso with shorter legs; between 46% and 49.5% is balanced; and above 49.5% indicates longer legs with a shorter torso.'],
    ['What should I wear if I have a long torso and shorter legs?', 'Wear high-rise trousers and high-waisted skirts to raise the perceived waistline. Always full-tuck your tops, wear cropped jackets or blazers ending at or above the hip bone, and choose shoes that match your trouser or hose color to create an uninterrupted vertical leg line.'],
    ['How should I dress if I have long legs and a shorter torso?', 'Balance your proportions with mid-rise or low-rise trousers, untucked tops, tunics, dropped waistlines, and longline blazers or duster cardigans. Avoid ultra high-waisted pants with wide contrast belts that sit directly beneath your bust.'],
    ['What is the Adonis Index in menswear tailoring?', 'The Adonis Index measures the golden taper from shoulder breadth across the back to waist diameter (waist circumference divided by π). A ratio around 1.618 produces the classic athletic V-taper. Tailors enhance this with roped or canvassed shoulder pads and suppressed jacket waists.'],
    ['Does tucking in your shirt really make your legs look longer?', 'Yes. Tucking your shirt into mid-rise or high-rise trousers shortens the vertical block of the top to roughly 1/3 of your height, allowing the trouser fabric to span the remaining 2/3. An untucked long shirt creates an optical 1:1 split, which visually foreshortens the legs.'],
    ['Can footwear color and vamp height change my body proportions?', 'Yes. Pointed-toe shoes and low-vamp loafers reveal more of the instep, which extends the perceived length of your leg. Matching your shoe leather to your trouser color avoids a visual horizontal cut at your ankles.']
  ];
  const body = `<p class="eyebrow">Free proportion &amp; tailoring tool</p>
<h1>Body Proportion Calculator: Find Your Golden Ratio</h1>
<p class="answer">Body proportions depend on your leg-to-torso ratio and the golden Rule of Thirds (1:2 vertical split). Example: ${esc(ex)} Enter your height, inseam, and shoulder measurements below to see your vertical percentage, live silhouette diagram, and tailored rise and tucking strategy.</p>
${verifiedLine(PropCore.FACTS.verified)}
${toolShell('body-proportion', 'Body proportion and golden ratio calculator', PropUI.controls(PropUI.norm(PropUI.DEFAULT)), PropUI.result(PropUI.norm(PropUI.DEFAULT)))}
<h2>How the body proportion calculator works</h2>
${steps([
    '<b>Leg-to-height ratio</b> divides your inseam by your total height: under 46% is a long torso, 46% to 49.5% is balanced, and over 49.5% is long legs.',
    '<b>Rule of Thirds calculation</b> computes the exact top and bottom garment lengths needed to form an optical 1:2 ratio (1/3 upper body, 2/3 lower body).',
    '<b>Upper frame analysis</b> compares shoulder width to waist diameter to evaluate athletic V-taper (menswear) or shoulder-to-waist presence (womenswear).',
    '<b>Tailoring rules</b> specify the exact trouser rise, jacket length, and shirt-tucking methods that optimize your silhouette.'])}
<h2>Vertical proportion classification</h2>
${table('Vertical body proportions and optimal tailoring rules', ['Proportion', 'Leg % of height', 'Trouser rise', 'Hem & tucking rule'], [
    ['Long torso / shorter legs', 'Under 46%', 'High-rise (above natural waist)', 'Always full-tuck tops; wear cropped jackets'],
    ['Balanced vertical', '46% to 49.5%', 'Classic mid-rise or high-rise', 'French tuck, full tuck, or neat tailored hems'],
    ['Long legs / shorter torso', 'Over 49.5%', 'Mid-rise or classic low-rise', 'Untucked tops, tunics, and longline blazers']
  ])}
${callout('Proportion is optical, not anatomical flaw. Every vertical type can wear any garment style simply by adjusting the hem height, waist rise, or layering pieces to restore the 1:2 golden visual division.')}
${sources([
    ['Vitruvian Man and Human Proportions (Leonardo da Vinci / Marcus Vitruvius)', 'https://en.wikipedia.org/wiki/Vitruvian_Man', 'classical human vertical proportions'],
    ['The Golden Ratio in Art and Architecture (Mario Livio)', 'https://en.wikipedia.org/wiki/Golden_ratio', 'golden section 1:1.618 and 1:2 thirds rule in visual design'],
    ['SimplyStylo methodology', '/methodology/', 'how every tool is built and checked']])}
${faqBlock(faq)}
${relatedBlock('body-proportion')}`;
  return {
    path: '/tools/body-proportion-calculator/', type: 'tool', title: 'Body Proportion Calculator: Golden Ratio Outfit Guide', crumb: 'Body Proportion Calculator',
    crumbs: [['Tools', '/tools/']],
    description: 'Calculate your leg-to-torso ratio, golden 1:2 thirds rule, optimal trouser rise, tucking strategy and jacket length with live silhouette SVG.',
    bundle: 'body-proportion', faq, body, datePublished: '2026-11-04', dateModified: MODIFIED,
    app: { name: tool('body-proportion').name, description: tool('body-proportion').blurb, features: ['Leg-to-torso vertical ratio', 'Golden 1:2 Rule of Thirds calculation', 'Optimal trouser rise guidance', 'Live proportional silhouette SVG diagram'] },
    about: [
      { '@type': 'Thing', name: 'Golden ratio', sameAs: 'https://en.wikipedia.org/wiki/Golden_ratio' },
      { '@type': 'Thing', name: 'Proportion (architecture)', sameAs: 'https://en.wikipedia.org/wiki/Proportion_(architecture)' }
    ],
    llms: `Body Proportion and Golden Ratio Calculator: evaluates vertical leg-to-height ratio (inseam ÷ height: < 46% long torso, 46–49.5% balanced, > 49.5% long legs), 1:2 Rule of Thirds garment length breakdown, shoulder-to-waist diameter ratio, and rise/tuck tailoring recommendations. Example: ${ex}`
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
    path: '/tools/', type: 'collection', title: 'Free Style Tools: Color Analysis & Outfit Planner', crumb: 'Tools',
    ogTitle: '20 Free Style Tools: Color Analysis, Capsule Wardrobe & Outfit Planner',
    description: 'Explore 20 free style tools: personal color analysis quiz, capsule wardrobe planner, daily outfit planner, US/UK/EU size converter, and tailoring guides.',
    ogDescription: 'Use all 20 free browser-based style tools: 12-season color analysis, capsule wardrobe planner, outfit planner, international size converter, and more.',
    body, datePublished: PUBLISHED, dateModified: MODIFIED, itemList: TOOLS.map((t) => [t.name, t.path]),
    llms: `Tools index: ${TOOLS.map((t) => t.name).join(', ')}.`
  };
}

// ---------- Hat Size Calculator ----------
function hatSize() {
  const h57 = HatCore.convert('cm', 57), h54 = HatCore.convert('cm', 54), h59 = HatCore.convert('cm', 59), us7 = HatCore.convert('us', 7);
  const faq = [
    ['What hat size is 57 cm?', `A 57 cm head is a US fitted hat size ${h57.usLabel} and EU size ${h57.eu}, about ${h57.inchLabel} inches around. US sizes are the head circumference divided by π, in inches.`],
    ['How do I measure my head for a hat?', `${HatCore.FACTS.measure}. Keep the tape level and snug, not tight, and measure twice. Enter the result in centimeters or inches.`],
    ['How do I convert head circumference to a US hat size?', `Divide the circumference in centimeters by 8 (more exactly by 2.54 × π = 7.98) and round to the nearest eighth. For example, 54 cm ÷ 7.98 = 6.77, a US ${h54.usLabel}; 59 cm is a US ${h59.usLabel}.`],
    ['What size is a US 7 hat in cm?', `A US 7 hat fits a head about ${us7.cm} cm (${us7.inchLabel} in) around, which is EU size ${us7.eu}. Each eighth of a US size adds about 1 cm of circumference.`],
    ['What if I am between hat sizes?', 'Choose the larger size: a hat that is slightly big can be snugged with a sizing strip inside the band, but one that is too small cannot be stretched much, especially straw.'],
    ['Why are UK hat sizes not shown?', 'Some published charts list UK sizes one eighth smaller than US sizes, while others list them the same. Rather than guess, the calculator gives US fitted sizes and centimeters, which every hat maker can work from.'],
    ['Do baseball caps use the same sizes?', 'Fitted caps use the same US fitted sizes, so the calculator applies directly. Stretch-fit and S/M/L caps use each brand\'s own ranges in centimeters, so compare your measurement with the brand\'s chart.']
  ];
  const body = `<p class="eyebrow">Free hat size tool</p>
<h1>Hat Size Calculator: Head Circumference to US and EU Sizes</h1>
<p class="answer">A 57 cm head is a US fitted hat size ${h57.usLabel} and EU size ${h57.eu}; a 54 cm head is a US ${h54.usLabel}. The US size is your head circumference divided by π in inches, which is almost exactly centimeters ÷ 8. Enter your measurement or a US size below.</p>
${verifiedLine(HatCore.FACTS.verified)}
${toolShell('hat-size', 'Hat size calculator', HatUI.controls(HatUI.DEFAULT), HatUI.result(HatUI.DEFAULT))}
<h2>How the hat size calculator works</h2>
${steps([
    `<b>Measure:</b> ${esc(HatCore.FACTS.measure)}.`,
    `<b>US fitted size:</b> ${esc(HatCore.FACTS.us)}.`,
    `<b>EU and metric:</b> ${esc(HatCore.FACTS.eu)}, rounded to the nearest centimeter.`,
    `<b>UK left out:</b> ${esc(HatCore.FACTS.uk)}`])}
<h2>Hat size chart</h2>
${table('US fitted hat sizes with head circumference', ['US fitted size', 'Circumference (cm)', 'Circumference (in)', 'EU size'],
    HatCore.table().map((r) => [esc(r.usLabel), r.cm, esc(r.inchLabel), r.eu]))}
<figure class="pin"><img src="/pins/hat-size-calculator.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Hat size chart: head circumference 54 to 61 cm with US fitted sizes 6¾ to 7⅝ and where to measure"><figcaption>Save this hat size chart for your next hat.</figcaption></figure>
${callout('Hat sizes vary by brand, style and material. Use this as a starting point and check the maker\'s own chart, especially for stretch-fit caps and S/M/L sizing.')}
${sources([
    ['Hat size (Wikipedia)', 'https://en.wikipedia.org/wiki/Hat_size', 'US size = head diameter in inches; circumference in cm ÷ 8'],
    ['Hat size calculator (Omni Calculator)', 'https://www.omnicalculator.com/everyday-life/hat-size', 'US and UK fitted sizes from circumference'],
    ['Hard hat and headwear size chart (Bullard)', 'https://eu.bullard.com/?p=5462', '54 cm = 21¼ in = US 6¾'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('hat-size')}`;
  return {
    path: '/tools/hat-size-calculator/', type: 'tool', title: 'Hat Size Calculator: Head Size to US and EU Hat Sizes', crumb: 'Hat Size Calculator',
    crumbs: [['Tools', '/tools/']],
    description: `Convert head circumference to US fitted and EU hat sizes: 57 cm = US ${h57.usLabel}, 54 cm = US ${h54.usLabel}. How to measure, a full size chart and fit tips.`,
    bundle: 'hat-size', faq, body, datePublished: '2026-11-05', dateModified: MODIFIED,
    app: { name: tool('hat-size').name, description: tool('hat-size').blurb, features: ['Head circumference in cm or inches to US fitted size', 'US size to circumference', 'EU / metric size', 'Size chart US 6½ to 8'] },
    about: { '@type': 'Thing', name: 'Hat size' },
    llms: `Hat Size Calculator: ${HatCore.FACTS.us}. ${HatCore.FACTS.eu}. 57 cm = US ${h57.usLabel} (EU ${h57.eu}); 54 cm = US ${h54.usLabel}; 59 cm = US ${h59.usLabel}; US 7 = ${us7.cm} cm. UK sizes omitted (charts disagree).`
  };
}

// ---------- Glove Size Calculator ----------
function gloveSize() {
  const t = GloveCore.table(), s8 = t.find((x) => x.size === 8), s7 = t.find((x) => x.size === 7), s9 = t.find((x) => x.size === 9);
  const faq = [
    ['How do I find my glove size?', `Measure around your dominant hand just below the knuckles, thumb excluded. In the EN ISO 21420 system the glove size is close to that measurement in inches: ${s8.circ / 10} cm (${s8.inches} in) is size 8, ${s9.circ / 10} cm is size 9.`],
    ['What glove size is a 20 cm hand?', `A hand about 20 cm around is glove size 8, whose standard circumference is ${s8.circ} mm and hand length ${s8.len} mm.`],
    ['How do I measure hand length for gloves?', `${GloveCore.FACTS.length}. Size 7 is ${s7.len} mm long, size 8 ${s8.len} mm and size 9 ${s9.len} mm.`],
    ['What if my circumference and length give different sizes?', 'Gloves are sized first by circumference. If your hand length points to a different size, try both, or look for a model cut with longer or shorter fingers.'],
    ['What are EN ISO 21420 glove sizes?', `EN ISO 21420 (which replaced EN 420) sets hand sizes 6 to 11 by hand circumference and length, from ${t[0].circ} mm around for size 6 to ${t[t.length - 1].circ} mm for size 11, about one inch per size. Work, ski and many fashion glove makers use it.`],
    ['Why are S, M and L glove sizes not shown?', 'Brands map letter sizes to different numbers; one chart calls size 9 a large, another a medium. Compare your number size or your centimeters with the brand\'s chart instead.'],
    ['Which hand should I measure?', 'Measure your dominant hand (right if you are right-handed), which is usually slightly larger, and measure at the end of the day.']
  ];
  const body = `<p class="eyebrow">Free glove size tool</p>
<h1>Glove Size Calculator: Find Your Glove Size From Hand Size</h1>
<p class="answer">A hand ${s8.circ / 10} cm (${s8.inches} in) around the palm is glove size 8 in the EN ISO 21420 standard, and each size up adds about 2.5 cm (1 in), from size 6 (${t[0].circ / 10} cm) to size 11 (${t[t.length - 1].circ / 10} cm). Enter your hand circumference and length below.</p>
${verifiedLine(GloveCore.FACTS.verified)}
${toolShell('glove-size', 'Glove size calculator', GloveUI.controls(GloveUI.DEFAULT), GloveUI.result(GloveUI.DEFAULT))}
<h2>How the glove size calculator works</h2>
${steps([
    `<b>Circumference:</b> ${esc(GloveCore.FACTS.circumference)}.`,
    `<b>Length (optional):</b> ${esc(GloveCore.FACTS.length)}.`,
    `<b>Size:</b> the nearest of the ${esc(GloveCore.FACTS.standard)}; your length is checked against the same table.`,
    `<b>Letter sizes left out:</b> ${esc(GloveCore.FACTS.letters)}`])}
<h2>Glove size chart</h2>
${table('EN ISO 21420 glove sizes', ['Size', 'Hand circumference', 'Hand length'], t.map((r) => [r.size, `${r.circ} mm (${r.inches} in)`, `${r.len} mm`]))}
<figure class="pin"><img src="/pins/glove-size-calculator.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Glove size chart: EN ISO 21420 sizes 6 to 11 by hand circumference, with where to measure"><figcaption>Save this glove size chart for winter shopping.</figcaption></figure>
${callout('Fit varies by glove model, material and lining. Leather stretches a little with wear, while ski and work gloves are cut roomier; check the maker\'s own chart.')}
${sources([
    ['EN ISO 21420 glove size guide (Ejendals TEGERA)', 'https://www.ejendals.com/pt/tegera-safety-gloves/gloves-size-guide/', 'sizes 6 to 11: circumference and hand length'],
    ['Glove size chart (Showa)', 'https://mruk.de/out/pictures/ddmedia/Showa%20Size%20Chart.pdf', '152, 178, 203 and 229 mm for sizes 6 to 9'],
    ['EN ISO 21420:2020 general requirements (Wenaas)', 'https://www.wenaas.com/en/en-iso-21420-general-requirements-and-test-methods'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('glove-size')}`;
  return {
    path: '/tools/glove-size-calculator/', type: 'tool', title: 'Glove Size Calculator: Find Your Glove Size', crumb: 'Glove Size Calculator',
    crumbs: [['Tools', '/tools/']],
    description: `Find your glove size from hand circumference and length with the EN ISO 21420 standard: ${s8.circ / 10} cm around = size 8. How to measure plus a full size chart.`,
    bundle: 'glove-size', faq, body, datePublished: '2026-11-05', dateModified: MODIFIED,
    app: { name: tool('glove-size').name, description: tool('glove-size').blurb, features: ['Hand circumference in cm or inches', 'Optional hand length check', 'EN ISO 21420 sizes 6 to 11', 'Size chart'] },
    about: { '@type': 'Thing', name: 'Glove size' },
    llms: `Glove Size Calculator: ${GloveCore.FACTS.standard}. ${t.map((r) => `size ${r.size} = ${r.circ} mm around, ${r.len} mm long`).join('; ')}. Letter sizes omitted (brands differ).`
  };
}

// ---------- Necklace Length Visualizer ----------
function necklaceLength() {
  const c = (x) => NeckCore.classify(x), n16 = c(16), n18 = c(18), n22 = c(22), n30 = c(30), n36 = c(36);
  const faq = [
    ['What is the most popular necklace length?', `Princess length, about 18 in (${n18.cm} cm). ${n18.type.where} It suits almost any neckline, which is why most pendants are sold on 18 in chains.`],
    ['Where does a 16 inch necklace fall?', `A 16 in (${n16.cm} cm) necklace is a choker length. ${n16.type.where} On a neck larger than about 14 in (36 cm) it sits closer to the neck.`],
    ['Where does a 22 inch necklace fall?', `A 22 in (${n22.cm} cm) necklace is a matinee length. ${n22.type.where} It works well over crew necks and high necklines.`],
    ['What are the standard necklace lengths?', `${NeckCore.FACTS.ranges}. ${NeckCore.FACTS.conflict}`],
    ['How far apart should layered necklaces be?', 'About 2 in (5 cm) apart, such as 16, 18 and 20 in, so each chain shows and they do not tangle. Some stylists space them 2 to 4 in apart for a more open look.'],
    ['What is an opera length necklace?', `Opera length starts at 28 in (71 cm). ${n30.type.where} A 36 in chain doubled wears as an 18 in princess, so long chains can be worn two ways.`],
    ['Which necklace length suits my neckline?', 'Chokers and collars suit open necklines such as off-shoulder and strapless; princess suits almost anything; matinee and opera lengths sit well over crew necks, turtlenecks and high necklines.']
  ];
  const body = `<p class="eyebrow">Free necklace length tool</p>
<h1>Necklace Length Visualizer: See Where Every Length Falls</h1>
<p class="answer">An 18 in (${n18.cm} cm) necklace is princess length and falls on the collarbone; 16 in is a choker at the base of the neck, 22 in a matinee on the upper chest and 30 in an opera at the bust. Enter one or more lengths to see them drawn on the body and check a layered stack.</p>
${verifiedLine(NeckCore.FACTS.verified)}
${toolShell('necklace-length', 'Necklace length visualizer', NeckUI.controls(NeckUI.DEFAULT), NeckUI.result(NeckUI.DEFAULT))}
<h2>How the necklace length visualizer works</h2>
${steps([
    '<b>Enter your lengths</b> in inches or centimeters: one necklace, or up to six for a layered stack.',
    `<b>Each length is named</b> with the ranges jewelry guides agree on: ${esc(NeckCore.FACTS.ranges)}.`,
    `<b>Disputed lengths are flagged:</b> ${esc(NeckCore.FACTS.conflict)}`,
    '<b>Layering check:</b> chains less than about 2 in (5 cm) apart are flagged because they overlap and tangle.'])}
<h2>Necklace length chart</h2>
${table('Standard necklace lengths and where they fall', ['Length', 'Range', 'Where it falls', 'Best with'],
    NeckCore.TYPES.map((t) => [esc(t.name), esc(t.range), esc(t.where), esc(t.best)]))}
<figure class="pin"><img src="/pins/necklace-length-visualizer.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Necklace length guide: 16, 18, 22, 30 and 36 inch necklaces drawn where they fall on the body"><figcaption>Save this necklace length guide for jewelry shopping.</figcaption></figure>
${callout(esc(NeckCore.FACTS.neck) + ' Pendants add their own drop below the chain.')}
${sources([
    ['Necklace length chart (Blue Nile)', 'https://www.bluenile.com/blog/fashion/necklace-length-chart', 'choker, princess, matinee, opera and rope'],
    ['Necklace lengths guide (Clean Origin)', 'https://cleanorigin.com/blog/necklace-lengths-guide'],
    ['Standard necklace and bracelet lengths (Beadaholique)', 'https://www.beadaholique.com/standard-necklace-and-bracelet-lengths', 'opera 28–32 in'],
    ['Necklace layering guide (With Clarity)', 'https://withclarity.com/blogs/jewelry/necklace-layering-guide', 'about 2 in between layers'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('necklace-length')}`;
  return {
    path: '/tools/necklace-length-visualizer/', type: 'tool', title: 'Necklace Length Visualizer: Where Each Length Falls', crumb: 'Necklace Length Visualizer',
    crumbs: [['Tools', '/tools/']],
    description: 'See where any necklace length falls: 16 in choker, 18 in princess, 22 in matinee, 30 in opera. Layer up to six chains and get a spacing check.',
    bundle: 'necklace-length', faq, body, datePublished: '2026-11-05', dateModified: MODIFIED,
    app: { name: tool('necklace-length').name, description: tool('necklace-length').blurb, features: ['Necklace drawn on the body', 'Standard length names', 'Up to six layered chains', 'Inches and centimeters', 'Layering spacing check'] },
    about: { '@type': 'Thing', name: 'Necklace length' },
    llms: `Necklace Length Visualizer: ${NeckCore.FACTS.ranges}. 16 in = choker (base of neck); 18 in (${n18.cm} cm) = princess (collarbone); 22 in = matinee (upper chest); 30 in = opera (bust); 36 in doubled = ${n36.doubled.inches} in ${n36.doubled.type.name.toLowerCase()}. ${NeckCore.FACTS.conflict} Layer about 2 in apart.`
  };
}

// ---------- Laundry Symbol Decoder ----------
function careLabel() {
  const sym = (g, o) => CareCore.svg(g.shape, o[3], 36, g.name + ': ' + o[1]);
  const faq = [
    ['What do the dots on a laundry symbol mean?', `On the iron, dots set the maximum temperature: ${CareCore.FACTS.iron.replace('Ironing dots: ', '')}. In the tumble dryer square, one dot means low heat and two dots normal heat. Some US labels also use dots in the washtub instead of a number: 1 dot 30 °C, 2 dots 40 °C, 3 dots 50 °C, 4 dots 60 °C.`],
    ['What does a line under the washing symbol mean?', 'One bar under the washtub means a mild process (an easy-care or synthetics cycle with reduced agitation and spin); two bars mean a very mild process for wool and delicates. No bar means a normal cycle.'],
    ['What does the triangle symbol mean on clothes?', 'The triangle is bleaching. An empty triangle allows any bleach, including chlorine; a triangle with two diagonal lines allows only oxygen (non-chlorine) bleach; a crossed-out triangle means do not bleach.'],
    ['What is the maximum temperature for hand wash?', 'The hand-in-tub symbol means wash by hand only, at no more than 40 °C, according to ISO 3758. Squeeze gently rather than rubbing or wringing.'],
    ['What do P, F and W in a circle mean?', 'The circle is professional care. P means dry cleaning in tetrachloroethylene (perc) or hydrocarbon solvents, F means hydrocarbon solvents only, and W means professional wet cleaning. A bar underneath asks for a milder process.'],
    ['What does a square with a circle inside mean?', 'A circle inside a square means tumble drying is allowed: one dot for low heat, two dots for normal heat. Crossed out, it means do not tumble dry. A square with lines but no circle is a natural drying symbol, such as line or flat drying.'],
    ['Can I wash clothes at a lower temperature than the label says?', 'Yes. The number is a maximum, and a milder treatment than the one shown is always acceptable: 30 °C is fine for a 40 °C label, and a mild cycle is fine for a normal one.']
  ];
  const body = `<p class="eyebrow">Free care label tool</p>
<h1>Laundry Symbol Decoder: What Your Care Label Means</h1>
<p class="answer">A washtub with 40 and one bar means machine wash at up to 40 °C on a mild cycle; an iron with two dots means up to 150 °C; a triangle with two lines means non-chlorine bleach only, and a cross over any symbol means do not. Pick the symbols on your label below to decode them all at once.</p>
${verifiedLine(CareCore.FACTS.verified)}
${toolShell('care-label', 'Laundry symbol decoder', CareUI.controls(CareUI.DEFAULT), CareUI.result(CareUI.DEFAULT))}
<h2>How to read a care label</h2>
${steps([
    `<b>Read left to right:</b> ${esc(CareCore.FACTS.order)}.`,
    `<b>Washing:</b> ${esc(CareCore.FACTS.wash)}.`,
    `<b>Dots mean heat:</b> ${esc(CareCore.FACTS.iron)}; in the tumble dryer square, one dot is low heat and two dots normal heat.`,
    '<b>A cross means do not:</b> a cross over any symbol means that treatment must not be used.',
    `<b>Milder is fine:</b> ${esc(CareCore.FACTS.milder)}.`])}
<h2>Laundry symbols chart</h2>
<div class="table-wrap"><table class="care-chart"><caption>Care label symbols and their meanings (ISO 3758)</caption><thead><tr><th scope="col">Symbol</th><th scope="col">Meaning</th></tr></thead><tbody>${CareCore.GROUPS.map((g) => g.list.map((o) =>
    `<tr><td>${sym(g, o)}</td><td><b>${esc(g.name)}: ${esc(o[1])}</b><br>${esc(o[2])}</td></tr>`).join('')).join('')}</tbody></table></div>
<figure class="pin"><img src="/pins/laundry-symbols.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Laundry symbols explained: 15 common care label symbols for washing, bleaching, drying, ironing and dry cleaning"><figcaption>Save this laundry symbols cheat sheet for laundry day.</figcaption></figure>
${callout(esc(CareCore.FACTS.natural) + ' ' + esc(CareCore.FACTS.us) + ' ' + esc(CareCore.FACTS.trademark))}
${sources([
    ['ISO 3758:2012 Textiles: care labelling code using symbols (preview, Table 1)', 'https://standards.iteh.ai/catalog/standards/iso/3fbbb179-3349-433c-b5c3-f8776e7f239d/iso-3758-2012', 'washing temperatures and processes; hand wash 40 °C'],
    ['The worldwide care labelling system (GINETEX)', 'https://www.ginetex.net/userfiles/files/gin_bro_gb_rz_brochure_web.pdf', 'symbol order, bars, dots and the St Andrew\'s cross'],
    ['Laundry symbol (Wikipedia)', 'https://en.wikipedia.org/wiki/Laundry_symbol', 'ironing at 110, 150 and 200 °C; P, F and W'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('care-label')}`;
  return {
    path: '/tools/laundry-symbols/', type: 'tool', title: 'Laundry Symbols Decoder: Care Label Meanings', crumb: 'Laundry Symbol Decoder',
    crumbs: [['Tools', '/tools/']],
    description: 'Decode any care label: washing temperatures and bars, bleach triangles, tumble dry and iron dots, and P, F, W dry cleaning circles, with a full symbols chart.',
    bundle: 'care-label', faq, body, datePublished: '2026-11-06', dateModified: MODIFIED,
    app: { name: tool('care-label').name, description: tool('care-label').blurb, features: ['All ISO 3758 washing symbols', 'Bleaching, tumble drying, ironing and professional care', 'Your label drawn symbol by symbol', 'Plain-English care instructions'] },
    about: { '@type': 'Thing', name: 'Laundry symbol' },
    llms: `Laundry Symbol Decoder: ${CareCore.FACTS.order}. ${CareCore.FACTS.wash}; hand wash max 40 °C. Bleach: empty triangle any bleach, two lines non-chlorine only. Tumble: one dot low, two dots normal. ${CareCore.FACTS.iron}. Professional: P perc or hydrocarbon, F hydrocarbon, W wet cleaning; bar = milder. Cross = do not. ${CareCore.FACTS.milder}.`
  };
}

// ---------- Circle Skirt Calculator ----------
function circleSkirt() {
  const base = { waist: 70, length: 60, seam: 1.5, hem: 2.5, width: 150 };
  const full = SkirtCore.calc({ ...base, type: 'full' }), half = SkirtCore.calc({ ...base, type: 'half' }), quarter = SkirtCore.calc({ ...base, type: 'quarter' });
  const narrow = SkirtCore.calc({ ...base, type: 'full', width: 110 }), inch = SkirtCore.calc({ waist: 28, length: 24, type: 'full', seam: 0.625, hem: 1, width: 60 });
  const faq = [
    ['How do I calculate the waist radius for a circle skirt?', `Divide the waist measurement by 2π (6.283) for a full circle, by π for a half circle and by π ÷ 2 for a quarter circle. A 70 cm waist gives ${full.r} cm for a full circle, ${half.r} cm for a half circle and ${quarter.r} cm for a quarter circle.`],
    ['How much fabric do I need for a full circle skirt?', `For a 70 cm waist and 60 cm length with 1.5 cm seam and 2.5 cm hem allowances, the hem is cut ${full.outer} cm from the center, so you need about ${full.fabric} cm of 150 cm wide fabric, cut in one piece. On 110 cm wide fabric it takes two half-circle pieces and about ${narrow.fabric} cm.`],
    ['What is the difference between a full, half and quarter circle skirt?', 'The fraction is how much of a circle the skirt makes when laid flat. A full circle has the most swing and volume, a half circle drapes in soft folds, and a quarter circle is close to an A-line with the least fabric.'],
    ['Why do I subtract the seam allowance from the waist radius?', 'The waist radius gives the sewing line. Cutting the waistline smaller by the seam allowance leaves fabric to sew the waistband on, so the finished waist matches your measurement.'],
    ['How do I calculate a circle skirt in inches?', `Use the same formulas with inches. A 28 in waist gives a ${inch.r} in waist radius for a full circle; with a 24 in length, ⅝ in seam and 1 in hem, you need about ${inch.fabric} in of 60 in wide fabric.`],
    ['Why does my circle skirt hem look uneven?', 'Circle skirts stretch on the bias. Hang the sewn skirt for 24 hours before hemming, then level the hem from the floor up and trim before turning it.'],
    ['How long is the hem of a full circle skirt?', `The hem circumference is 2π × (waist radius + length). For a 70 cm waist and 60 cm length that is about ${full.hemSweep} cm, which is why a narrow rolled hem or bias tape is easier than a deep folded hem.`]
  ];
  const body = `<p class="eyebrow">Free sewing tool</p>
<h1>Circle Skirt Calculator: Waist Radius and Fabric Needed</h1>
<p class="answer">For a full circle skirt, the waist radius is your waist ÷ 2π: a 70 cm waist gives ${full.r} cm, and with a 60 cm length you cut the hem ${full.outer} cm from the center and need about ${full.fabric} cm of 150 cm wide fabric. Enter your waist, length and skirt type below for the full pattern and fabric amount.</p>
${verifiedLine(SkirtCore.FACTS.verified)}
${toolShell('circle-skirt', 'Circle skirt calculator', SkirtUI.controls(SkirtUI.DEFAULT), SkirtUI.result(SkirtUI.DEFAULT))}
<h2>How the circle skirt calculator works</h2>
${steps([
    `<b>Waist radius:</b> ${esc(SkirtCore.FACTS.radius)}.`,
    `<b>Cutting lines:</b> ${esc(SkirtCore.FACTS.cut)}.`,
    `<b>Fabric:</b> ${esc(SkirtCore.FACTS.fabric)}.`,
    '<b>Draw it:</b> fold the fabric, pin a tape measure at the corner and mark the waist and hem arcs at the two cutting radii.'])}
<h2>Circle skirt waist radius chart</h2>
${table('Waist radius by waist measurement and skirt type (cm)', ['Waist', 'Full circle', 'Three-quarter', 'Half circle', 'Quarter circle'],
    [60, 65, 70, 75, 80, 85, 90, 100].map((w) => [w + ' cm', ...['full', 'three', 'half', 'quarter'].map((t) => SkirtCore.calc({ waist: w, length: 50, type: t, seam: 0, hem: 0, width: 300 }).r + ' cm')]))}
<figure class="pin"><img src="/pins/circle-skirt-calculator.jpg" width="1000" height="1500" loading="lazy" decoding="async" alt="Circle skirt pattern math: full, half and quarter circle patterns for a 70 cm waist with the radius formulas"><figcaption>Save these circle skirt formulas for your next sewing project.</figcaption></figure>
${callout(esc(SkirtCore.FACTS.limits) + ' Pre-wash the fabric before cutting.')}
${sources([
    ['Circle skirt calculator (Omni Calculator)', 'https://www.omnicalculator.com/everyday-life/circle-skirt', 'waist radius and fabric length formulas'],
    ['Circle skirt calculator (calculate.co.nz)', 'https://www.calculate.co.nz/circle-skirt-calculator.php', 'radius = waist ÷ (2π × circle fraction)'],
    ['Circle skirt formula (The Creative Curator)', 'https://www.thecreativecurator.com/circle-skirt-formula/', 'seam allowance taken off the waist radius'],
    ['SimplyStylo methodology', '/methodology/']])}
${faqBlock(faq)}
${relatedBlock('circle-skirt')}`;
  return {
    path: '/tools/circle-skirt-calculator/', type: 'tool', title: 'Circle Skirt Calculator: Waist Radius and Fabric', crumb: 'Circle Skirt Calculator',
    crumbs: [['Tools', '/tools/']],
    description: `Calculate a circle skirt pattern: waist radius, cutting lines and fabric needed for full, half and quarter circles. A 70 cm waist needs a ${full.r} cm radius.`,
    bundle: 'circle-skirt', faq, body, datePublished: '2026-11-06', dateModified: MODIFIED,
    app: { name: tool('circle-skirt').name, description: tool('circle-skirt').blurb, features: ['Full, three-quarter, half and quarter circles', 'Seam and hem allowances', 'Fabric length for your fabric width', 'Pattern drawing', 'Centimeters or inches'] },
    about: { '@type': 'Thing', name: 'Circle skirt' },
    llms: `Circle Skirt Calculator: ${SkirtCore.FACTS.radius}. ${SkirtCore.FACTS.cut}. 70 cm waist: full ${full.r} cm, half ${half.r} cm, quarter ${quarter.r} cm radius; full circle 60 cm long needs ${full.fabric} cm of 150 cm fabric. 28 in waist full circle = ${inch.r} in radius.`
  };
}

export default () => [colorCombination(), sizeConverter(), colorAnalysis(), capsule(), outfitGenerator(), bodyShape(), photoPalette(), ringSize(), costPerWear(), selfieAnalysis(), wardrobeColors(), packingList(), dressCode(), dressDesigner(), weddingDress(), promDress(), weddingGuest(), bridesmaidPalette(), faceShape(), pantBreak(), bodyProportion(), hatSize(), gloveSize(), necklaceLength(), careLabel(), circleSkirt(), toolsIndex()];
export { icon };

