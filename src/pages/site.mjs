// Home, trust and legal pages.
import { createRequire } from 'node:module';
import { esc, cards, faqBlock, site, longDate, icon } from '../layout.mjs';
import { TOOLS } from '../tools.mjs';
import { COLOR_GUIDES } from '../data/colors.mjs';

const require = createRequire(import.meta.url);
const C = require('../lib/color-core.js');
const S = require('../lib/size-core.js');
const SE = require('../lib/season-core.js');
const K = require('../lib/capsule-core.js');
const B = require('../lib/body-core.js');
const R = require('../lib/ring-core.js');
const P = require('../lib/cpw-core.js');
const PL = require('../lib/palette-core.js');
const SF = require('../lib/selfie-core.js');
const WR = require('../lib/wardrobe-core.js');
const PK = require('../lib/packing-core.js');
const DC = require('../lib/dresscode-core.js');
const PUBLISHED = '2026-11-01';
const M = site.dateModified;

function home() {
  const uk8 = S.convertShoe('uk', 8), w25 = K.build({ wardrobe: 'women', size: 25 });
  const faq = [
    ['Is SimplyStylo free?', 'Yes. Every tool is free, works without an account and runs in your browser. Nothing you enter is sent to a server.'],
    ['Which tool should I start with?', 'Start with the personal color analysis quiz to find colors that suit you, then use the color combination finder to pair them, and the capsule wardrobe planner to turn them into a wardrobe.'],
    ['How accurate are the size conversions?', `They follow the published formulas for each sizing system; for example a UK 8 shoe is about a US men's ${uk8.usMen} and EU ${uk8.eu}. Brands differ by half to one size, so compare with the brand's chart.`]
  ];
  const body = `<section class="hero">
<p class="eyebrow">Fashion decisions, made simple</p>
<h1>Find your style. Wear it better.</h1>
<p class="lede">Free tools that answer the everyday questions: which colors go together, which colors suit you, what size to order abroad and what to wear today. No sign-up, nothing to install.</p>
<p><a class="btn" href="/tools/color-analysis/">Find your colors</a> <a class="btn btn--ghost" href="/tools/">See all tools</a></p>
</section>
<p class="answer">SimplyStylo is a free style toolkit: ${TOOLS.length} interactive tools and ${Object.keys(COLOR_GUIDES).length} color guides. Example answers: a UK 8 shoe is about a US men's ${uk8.usMen}, and a 25-piece capsule wardrobe makes ${w25.outfits} outfits.</p>
<h2>Style tools</h2>
${cards(TOOLS)}
<h2>Popular color guides</h2>
<div class="chips">${Object.keys(COLOR_GUIDES).map((s) => {
    const n = C.bySlug(s);
    return `<a class="chip" href="/colors/${s}/"><span class="dot" style="background:${n.hex}"></span>${esc(n.name)}</a>`;
  }).join('')}</div>
<h2>The 12 color seasons</h2>
<div class="chips">${Object.entries(SE.SEASONS).map(([id, x]) => `<a class="chip" href="/seasons/${id}/"><span class="dot" style="background:${x.palette[0]}"></span>${esc(x.name)}</a>`).join('')}</div>
<h2>Why SimplyStylo</h2>
<div class="grid2">
<div class="panel"><h3>Decisions, not trends</h3><p>We do not publish fashion news. Every page answers a practical question with a clear result.</p></div>
<div class="panel"><h3>Transparent methods</h3><p>Every number comes from a published formula or rule, explained on the page and in our <a href="/methodology/">methodology</a>.</p></div>
<div class="panel"><h3>Private by design</h3><p>The tools run in your browser. We do not ask for photos, accounts or personal details.</p></div>
</div>
${faqBlock(faq)}`;
  return {
    path: '/', type: 'home', title: 'SimplyStylo: Free Style Tools for Colors, Sizes and Outfits',
    description: 'Free style tools: find colors that go together, your color season, international clothing and shoe sizes, a capsule wardrobe and outfit ideas.',
    body, faq, datePublished: PUBLISHED, dateModified: M, itemList: TOOLS.map((t) => [t.name, t.path]),
    llms: `SimplyStylo (simplystylo.com) is a free, privacy-first style toolkit with ${TOOLS.length} browser-based tools (${TOOLS.map((t) => t.name).join(', ')}) and color guides. All tools run client-side with published formulas.`
  };
}

function about() {
  const body = `<h1>About SimplyStylo</h1>
<p class="answer">SimplyStylo is an independent website that helps people make everyday fashion decisions with free, interactive tools: matching colors, finding a color season, converting sizes, planning a capsule wardrobe and choosing an outfit.</p>
<div class="prose">
<h2>What we do</h2>
<p>Fashion media is mostly news and trends. We focus on the questions people actually ask before getting dressed or buying something: <em>what goes with this, what size am I, what suits me?</em> Each tool gives a clear answer, explains how it got there and links to its sources.</p>
<h2>How we work</h2>
<ul>
<li><b>Published methods.</b> Size conversions follow the published formulas for each system; color tools use standard color science (WCAG contrast, the Oklab color space and color-wheel harmonies). See the <a href="/methodology/">methodology</a>.</li>
<li><b>Honest limits.</b> Where sources disagree, we say so instead of guessing, and every tool explains what it cannot know about you.</li>
<li><b>Privacy first.</b> The tools run in your browser. No photos, no accounts.</li>
<li><b>Independent.</b> No brand pays for placement in a tool result. If we add affiliate links or ads in future, they will be clearly labeled and kept separate from results.</li>
</ul>
<h2>Contact</h2>
<p>Corrections and suggestions are welcome: <a href="mailto:${site.email}">${site.email}</a>.</p>
</div>`;
  return {
    path: '/about/', type: 'about', title: 'About SimplyStylo', crumb: 'About',
    description: 'SimplyStylo is an independent site with free, transparent style tools for colors, sizes and outfits. Learn how we work and how to contact us.',
    body, datePublished: PUBLISHED, dateModified: M,
    llms: 'About: independent, privacy-first site; tools run in the browser; methods and sources are published; no paid placement in results.'
  };
}

function methodology() {
  const body = `<h1>Methodology: How Our Style Tools Work</h1>
<p class="answer">Every SimplyStylo tool runs a tested, published rule set in your browser: size conversions use the standard sizing formulas, color tools use WCAG contrast, the Oklab color space and color-wheel harmonies, and the planners use documented rules. Methods were last verified on ${longDate(M)}.</p>
<div class="prose">
<h2>Size conversions</h2>
<p>Shoe sizes are converted through foot length. ${esc(S.FACTS.shoe.uk)}; ${esc(S.FACTS.shoe.usMen)}; ${esc(S.FACTS.shoe.usWomen)}; ${esc(S.FACTS.shoe.eu)}; ${esc(S.FACTS.shoe.mondo)}. Results are rounded to the nearest half size. Women's clothing: ${esc(S.FACTS.clothing.womenUK)}, ${esc(S.FACTS.clothing.womenAU)}, ${esc(S.FACTS.clothing.womenEU)}. Men's jackets: ${esc(S.FACTS.clothing.menJacketEU)}. Collars: ${esc(S.FACTS.clothing.collar)}. French and Italian dress numbers and EU trouser numbers are left out because published charts disagree.</p>
<h2>Color tools</h2>
<p>${esc(C.FACTS.method)} Neutrals for a color are ranked by how different they look from it. The 60-30-10 outfit split uses the most contrasting neutral as the main color and the split-complementary color as the accent. Achromatic colors (grays, black, white and very low-saturation shades) get tonal steps instead of color-wheel combinations.</p>
<h2>Personal color analysis</h2>
<p>Eight questions score three dimensions taken from the Munsell color system: temperature (hue), value (light or deep) and chroma (bright or soft). Each score is scaled to the same range; the strongest dimension names the season and the next decides between the two seasons that share it. When no dimension clearly leads, the result is marked as borderline. It is a self-assessment guide, not a professional draping.</p>
<h2>Capsule wardrobe planner</h2>
<p>Each capsule size has a fixed split of tops, bottoms, dresses, layers and shoes. Pieces in our library are tagged for work, casual, smart, hot and cold use and ranked for your choices; core basics get priority. Outfits are counted as tops × bottoms + dresses; shoe and layer variations are shown separately.</p>
<h2>Outfit generator</h2>
<p>The occasion filters garments, five temperature bands set layers, and a seeded random pick (saved in the link) chooses between suitable pieces. Your chosen color goes on one statement piece and best-matching neutrals on the rest.</p>
<h2>Body shape calculator</h2>
<p>Uses ${esc(B.FACTS.method)}. Seven rules compare bust − hips, bust − waist, hips − waist and high hip ÷ waist in inches, in the published order; the first match is the result. Measurements that meet no rule are reported as between shapes.</p>
<h2>Ring size converter</h2>
<p>${esc(R.FACTS.us)}; ${esc(R.FACTS.iso)}. ${esc(R.FACTS.uk)}</p>
<h2>Cost per wear calculator</h2>
<p>${esc(P.FACTS.formula)}.</p>
<h2>Photo color palette</h2>
<p>${esc(PL.FACTS.method)}, run on a downscaled copy of the photo inside the browser. Colors are named after the nearest reference clothing color and matched to the closest seasonal palettes by Oklab distance.</p>
<h2>Selfie color analysis</h2>
<p>Colors tapped on the photo are averaged over a small square, optionally corrected against a white reference (gray-world white balance), and read in Oklab. ${esc(Object.values(SF.FACTS.scale).join('; '))}. These cut-offs are SimplyStylo's own guide scale. Undertone is answered by the visitor, not read from the photo.</p>
<h2>Wardrobe color checker</h2>
<p>${esc(WR.FACTS.rule)} Pairs are weighted by the number of pieces in each color; suggestions rank unowned colors by their weighted pairing score, neutrals first when neutrals are under 60%.</p>
<h2>Packing list generator</h2>
<p>${esc(PK.FACTS.rules.join(' '))} Layers follow the weather; swimwear is added for beach trips and hot weather.</p>
<h2>Dress code guide</h2>
<p>Garments follow the ${esc(DC.FACTS.source)}. Where British and American usage differ (white tie and black tie for women, "lounge suit"), the page notes both.</p>
<h2>Dress designer</h2>
<p>The dress is drawn as a vector image from the chosen neckline, sleeves, waist seam, skirt shape and length. Body shape suggestions add up the shapes each chosen element is commonly recommended for (for example, A-line skirts for triangle and spoon shapes, V-necks for top hourglass and inverted triangle shapes); this is styling guidance, not a rule. The suggested dress code follows length, neckline, skirt and fabric formality. A fabric photo is cropped to a small tile in the browser and never uploaded.</p>
<h2>Wedding and prom dress designers</h2>
<p>The same drawing engine as the dress designer, with bridal shades, lace and sparkle fabrics, a side slit, and trains and veils. Train and veil names are shown from shortest to longest only: their lengths in inches differ between designers and bridal shops.</p>
<h2>Wedding guest outfit finder</h2>
<p>Garments follow the dress code guide (Emily Post Institute). Colors are chosen per season and time of day and are tested to stay clearly away from white and ivory. Etiquette notes follow wedding guides from The Knot and Zola: no white, ivory, cream or beige unless the couple asks; block heels on grass; flat shoes on sand.</p>
<h2>Bridesmaid color palette</h2>
<p>Colors are calculated in HSL. Ombre spreads the main hue in even lightness steps (±22 points); mix-and-match uses a five-color palette of the main color, its neighbors 25° either side on the color wheel, a light tint and a deep shade; moods clamp saturation and lightness. The groomsmen suit is the classic suit color that contrasts most with the main color.</p>
<h2>Testing</h2>
<p>Every engine has automated tests whose worked examples match the numbers quoted in our FAQs, and every page is checked for accessibility, mobile layout and speed before publishing.</p>
</div>`;
  return {
    path: '/methodology/', type: 'page', title: 'Methodology: How Our Style Tools Work', crumb: 'Methodology',
    description: 'How SimplyStylo calculates size conversions, color combinations, color seasons, capsule wardrobes and outfits, with formulas and sources.',
    body, datePublished: PUBLISHED, dateModified: M,
    llms: `Methodology: shoe sizes via foot length (UK ≈ 3 × in − 23; US men UK + 1; US women UK + 2 to 2.5; EU ≈ 1.5 × cm + 2; Mondopoint mm). Colors: WCAG contrast, Oklab distance, HSL harmonies. Seasons: Munsell hue/value/chroma scoring. Capsules: tops × bottoms + dresses.`
  };
}

function simple(pathname, title, description, h1, html) {
  return { path: pathname, type: 'page', title, crumb: h1, description, datePublished: PUBLISHED, dateModified: M, body: `<h1>${esc(h1)}</h1><div class="prose">${html}</div>` };
}

// Contact: a real form (posted to the /api/contact Worker) with the email address as a fallback.
function contact() {
  const topics = [['general', 'General question'], ['correction', 'Correction or error report'], ['tool', 'Tool idea or feedback'],
    ['advertising', 'Advertising and sponsorship'], ['partnership', 'Affiliate or brand partnership'], ['press', 'Press and media']];
  const body = `<p class="eyebrow">Contact</p>
<h1>Contact SimplyStylo and Work With Us</h1>
<p class="answer">Send us a message with the form below or email <a href="mailto:${site.email}">${site.email}</a>. We reply to every genuine message, usually within two working days, whether it is a correction, a tool idea or a brand partnership.</p>
<ul class="cards cards--contact">
<li class="card"><span class="card__icon">${icon('sparkle')}</span><h2>Readers</h2><p>Spotted an error, have a style question or an idea for a tool? Corrections are checked against our sources and fixed with a new page date.</p><p><a href="/contact/?topic=correction#form">Report a correction</a></p></li>
<li class="card" id="advertise"><span class="card__icon">${icon('star')}</span><h2>Brands and advertisers</h2><p>Sponsored guides, affiliate partnerships and display advertising for fashion, bridal and accessories brands. Paid content is always labeled and never appears inside a tool result.</p><p><a href="/contact/?topic=advertising#form">Ask about advertising</a></p></li>
<li class="card"><span class="card__icon">${icon('image')}</span><h2>Press and creators</h2><p>Journalists, bloggers and creators may quote our guides and link to any tool. Ask us for data, charts or a comment.</p><p><a href="/contact/?topic=press#form">Press enquiry</a></p></li>
</ul>
<form class="form" id="form" action="/api/contact" method="post" data-contact>
<h2>Send a message</h2>
<div class="form__grid">
<div class="field"><label for="cf-name">Your name</label><input id="cf-name" name="name" autocomplete="name" required minlength="2" maxlength="100"></div>
<div class="field"><label for="cf-email">Email address</label><input id="cf-email" name="email" type="email" autocomplete="email" required maxlength="200"></div>
<div class="field"><label for="cf-company">Company or website <span class="field__opt">(optional)</span></label><input id="cf-company" name="company" autocomplete="organization" maxlength="120"></div>
<div class="field"><label for="cf-topic">Topic</label><select id="cf-topic" name="topic">${topics.map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></div>
</div>
<div class="field"><label for="cf-message">Message</label><textarea id="cf-message" name="message" rows="6" required minlength="10" maxlength="5000"></textarea></div>
<div class="hp" aria-hidden="true"><label for="cf-website">Leave this empty</label><input id="cf-website" name="website" tabindex="-1" autocomplete="off"></div>
<input type="hidden" name="t" value="">
<p class="form__note">We use your name and email only to reply to you. Messages are delivered to our inbox and are not shared or added to any mailing list. See our <a href="/privacy/">privacy policy</a>.</p>
<p><button class="btn" type="submit">Send message</button></p>
<p class="form-status" role="status" data-status></p>
</form>
<div class="prose">
<h2>Before you write</h2>
<ul>
<li><b>Corrections:</b> include the page address and what you expected to see. We fix verified errors and update the page date.</li>
<li><b>Partnerships:</b> tell us about your brand, the products and the kind of placement you have in mind. We only work with brands we would recommend to readers.</li>
<li><b>Styling questions:</b> we cannot give one-to-one styling advice, but popular questions become new guides and tools.</li>
</ul>
</div>`;
  return {
    path: '/contact/', type: 'contact', title: 'Contact SimplyStylo and Work With Us', crumb: 'Contact', bundle: 'contact', noshare: true,
    description: 'Contact SimplyStylo: corrections, tool ideas, advertising, affiliate partnerships and press enquiries. We reply within two working days.',
    body, datePublished: PUBLISHED, dateModified: M
  };
}

const sent = () => ({
  path: '/contact/sent/', type: 'page', title: 'Message Sent', crumb: 'Message sent', noindex: true, nositemap: true,
  crumbs: [['Contact', '/contact/']], datePublished: PUBLISHED, dateModified: M,
  description: 'Thank you for contacting SimplyStylo. Your message has been sent and we usually reply within two working days.',
  body: `<h1>Thank you, your message is on its way</h1><p class="lede">We reply to every genuine message, usually within two working days. Meanwhile, try one of our free tools:</p>${cards(TOOLS.slice(0, 6))}`
});

const search = () => ({
  path: '/search/', type: 'page', title: 'Search SimplyStylo', crumb: 'Search', noindex: true, nositemap: true,
  datePublished: PUBLISHED, dateModified: M,
  description: 'Search every SimplyStylo tool and guide: colors, sizes, wedding outfits, dresses, color seasons and more.',
  body: `<h1>Search SimplyStylo</h1><div class="search-page" data-search-page><form class="search__form" action="/search/" role="search">${icon('search', 22)}<label class="sr" for="sp-q">Search tools and guides</label><input id="sp-q" name="q" type="search" placeholder="Search tools and guides" autocomplete="off"></form><ul class="search__results" data-search-results>${TOOLS.slice(0, 6).map((t) => `<li><a href="${t.path}"><b>${esc(t.name)}</b><span>Tool · ${esc(t.blurb)}</span></a></li>`).join('')}</ul></div>`
});

const privacy = () => simple('/privacy/', 'Privacy Policy', 'SimplyStylo privacy policy: tools run in your browser, no accounts, no photos uploaded, privacy-friendly analytics.', 'Privacy Policy',
  `<p class="meta-line">Last updated ${longDate(M)}</p>
<p class="answer">SimplyStylo tools run entirely in your browser. We do not ask for accounts, we do not upload photos, and what you enter in a tool is not sent to us.</p>
<h2>What we collect</h2>
<p>We use Cloudflare Web Analytics, a privacy-first service that counts page views without cookies and without tracking you across sites. Our host, Cloudflare, processes standard request data (such as IP address and browser type) to deliver and protect the site.</p>
<h2>Tool settings in links</h2>
<p>Some tools save your choices (for example a color or a size) in the page address after the # sign so you can share a result. This part of the address is not sent to our server.</p>
<h2>Contact form</h2>
<p>If you use our contact form, your name, email address, optional company and message are sent by email to our inbox through Cloudflare so we can reply. We keep them only as long as needed to handle your request, never sell or share them, and never add you to a mailing list.</p>
<h2>Cookies</h2>
<p>The site does not set cookies. If we add advertising or other services in future, we will update this policy and ask for consent where the law requires it.</p>
<h2>Your rights and contact</h2>
<p>Because we do not hold personal data from the tools, there is usually nothing to access or delete. For any privacy question, email <a href="mailto:${site.email}">${site.email}</a>.</p>`);

const terms = () => simple('/terms/', 'Terms of Use', 'Terms of use for SimplyStylo: free style tools provided as guidance, copyright notice and limitation of liability.', 'Terms of Use',
  `<p class="meta-line">Last updated ${longDate(M)}</p>
<p class="answer">SimplyStylo's tools and guides are free general guidance. They are not professional styling, fitting or color-draping services, and results should be checked against brand size charts and in real light.</p>
<h2>Copyright</h2>
<p>© ${site.founded} ${site.brand}. All rights reserved. The site's text, code, tools, data and design may not be copied, republished or reused without written permission. You may link to any page and share tool results by link.</p>
<h2>No warranty</h2>
<p>We work to keep the tools accurate, but sizes and colors vary by brand, fabric and screen. The site is provided "as is" without warranties, and we are not liable for purchases or decisions made using it.</p>
<h2>Changes</h2>
<p>We may update these terms; the date above shows the latest version. Questions: <a href="mailto:${site.email}">${site.email}</a>.</p>`);

function notFound() {
  return {
    path: '/404.html', type: 'page', title: 'Page Not Found', crumb: 'Not found', noindex: true, nositemap: true,
    description: 'This page does not exist or has moved. Try one of our free style tools for colors, sizes and outfits.', datePublished: PUBLISHED, dateModified: M,
    body: `<h1>Page not found</h1><p class="lede">This page does not exist or has moved. Try one of our free style tools:</p>${cards(TOOLS)}`
  };
}

export default () => [home(), about(), methodology(), contact(), sent(), search(), privacy(), terms(), notFound()];
