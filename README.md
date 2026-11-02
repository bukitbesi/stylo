# SimplyStylo.com

**Find your style. Wear it better.** Free, privacy-first style tools: colors, sizes and outfits.
Static site, zero npm dependencies, hosted on Cloudflare Workers Static Assets (deployed by Workers Builds), plus a
tiny Worker (`worker/`) that only handles the contact form at `/api/contact`. © SimplyStylo. All rights reserved.

| Tool | URL | Engine | Tests |
| --- | --- | --- | --- |
| Color Combination Finder | `/tools/color-combination/` | `src/lib/color-core.js` | `tests/color.test.mjs` |
| International Size Converter | `/tools/size-converter/` | `src/lib/size-core.js` | `tests/size.test.mjs` |
| Personal Color Analysis | `/tools/color-analysis/` | `src/lib/season-core.js` | `tests/season.test.mjs` |
| Capsule Wardrobe Planner | `/tools/capsule-wardrobe/` | `src/lib/capsule-core.js` | `tests/capsule.test.mjs` |
| Outfit Generator | `/tools/outfit-generator/` | `src/lib/outfit-core.js` | `tests/outfit.test.mjs` |
| Body Shape Calculator | `/tools/body-shape-calculator/` | `src/lib/body-core.js` | `tests/body.test.mjs` |
| Photo Color Palette | `/tools/photo-color-palette/` | `src/lib/palette-core.js` | `tests/palette.test.mjs` |
| Ring Size Converter | `/tools/ring-size-converter/` | `src/lib/ring-core.js` | `tests/ring.test.mjs` |
| Cost Per Wear Calculator | `/tools/cost-per-wear-calculator/` | `src/lib/cpw-core.js` | `tests/cpw.test.mjs` |
| Selfie Color Analysis | `/tools/selfie-color-analysis/` | `src/lib/selfie-core.js` | `tests/selfie.test.mjs` |
| Wardrobe Color Checker | `/tools/wardrobe-color-checker/` | `src/lib/wardrobe-core.js` | `tests/wardrobe.test.mjs` |
| Packing List Generator | `/tools/packing-list-generator/` | `src/lib/packing-core.js` | `tests/packing.test.mjs` |
| Dress Code Guide | `/tools/dress-code-guide/` | `src/lib/dresscode-core.js` | `tests/dresscode.test.mjs` |
| Dress Designer | `/tools/dress-designer/` | `src/lib/dress-core.js` | `tests/dress.test.mjs` |
| Wedding Dress Designer | `/tools/wedding-dress-designer/` | `src/lib/dress-core.js` (wedding variant) | `tests/wedding.test.mjs` |
| Prom Dress Designer | `/tools/prom-dress-designer/` | `src/lib/dress-core.js` (prom variant) | `tests/wedding.test.mjs` |
| Wedding Guest Outfit Finder | `/tools/wedding-guest-outfit/` | `src/lib/wedguest-core.js` | `tests/wedding.test.mjs` |
| Bridesmaid Color Palette | `/tools/bridesmaid-color-palette/` | `src/lib/bridesmaid-core.js` | `tests/wedding.test.mjs` |
| 14 color guides | `/colors/<color>/` | color engine + `src/data/colors.mjs` | built-in validator |
| 12 color seasons | `/seasons/<season>/` | season engine + `src/data/seasons.mjs` | built-in validator |
| Contact form | `/contact/` → `POST /api/contact` | `worker/contact.js` | `tests/contact.test.mjs` |
| Site search | header search + `/search/` | `src/ui/site.js` + `dist/search-index.json` | `scripts/e2e.mjs` |
| Garment illustrations | used by outfit + capsule results | `src/lib/garments.js` | `tests/garments.test.mjs` |

Plus home, tools, colors and seasons indexes, about, methodology, contact, privacy, terms, search, a 404 page and
four seasonal wedding guest guides (60 pages). Every page has a header (menu + search), share bar and 3-column footer.
Every season and color guide has a 1000×1500 Pinterest image in `static/pins/` (shown on the page, lazy-loaded).

## Why no Astro

The build is ~100 lines of Node with no dependencies: nothing to update, no supply-chain risk, builds in under a
second. Each tool's engine is one UMD file used three ways: by the unit tests, by the build (which renders the first
result, tables and FAQ numbers into the HTML, so pages are complete before any script runs and have zero layout
shift) and in the browser. Measured locally: Lighthouse mobile 100/100/100/100, CLS 0, on every tool page.

## Commands

```bash
npm test            # unit tests (worked examples = FAQ numbers)
npm run build       # src/ → dist/
npm run validate    # titles, descriptions, canonicals, JSON-LD, FAQ match, links, sitemap, contrast tokens
npm run check       # all three
npm run preview     # http://localhost:4321/
node scripts/e2e.mjs [shots-dir]   # Playwright at 390 px: no overflow, no console errors, tools respond, links restore
npm run images      # re-render favicon, icons, og.png and the 26 Pinterest images (after brand, palette or guide changes)
```

## Layout

```
src/lib/        engines (pure maths, UMD)        src/ui/      tool UIs (render + mount, UMD)
src/pages/      page modules (content + FAQ)     src/data/    hand-written color guide notes
src/layout.mjs  page shell, JSON-LD @graph, blocks          src/styles.css  design tokens + components (inlined)
src/tools.mjs   tool catalog + script bundles    src/site.json  origin, brand, IndexNow key, dateModified
scripts/        build, validate, indexnow, e2e, preview, images
static/         favicon, icons, og.png, manifest, pins/ (copied as is)
worker/         Cloudflare Worker for /api/contact (static pages never run it)
```

## One-time setup (Cloudflare, free plan)

1. **Domain:** add `simplystylo.com` to Cloudflare and switch the registrar's nameservers to Cloudflare's.
2. **Crawlers (important for AI citations):** Security → Bots: turn **off** "Block AI bots" and Bot Fight Mode, and
   turn **off** the Cloudflare-managed robots.txt, so our own `robots.txt` (which allows everyone) is served.
3. **Deploy:** Workers & Pages → the `stylo` Worker is connected to this repo (Workers Builds, build command
   `npm run build`, deploy command `npx wrangler deploy`). Every push to `main` deploys; `wrangler.jsonc` attaches
   `simplystylo.com` as the custom domain. No GitHub secrets are needed.
4. **GitHub Pages:** keep it off (Settings → Pages → Source: None); Cloudflare is the only host.
5. **www → apex:** add a DNS record `www` (proxied, AAAA `100::`) and Rules → Redirect Rules → "Redirect from WWW to
   root" template (301).
6. **Analytics:** Web Analytics → add site (automatic setup, cookieless). Already allowed by the CSP in `_headers`.
7. **Email (free):** Email → Email Routing → Get started → add custom address `hello` → destination = your Gmail
   (click the verification link Cloudflare emails you). Optionally add `ads@` and `press@` the same way.
   To *reply as* hello@: Gmail → Settings → Accounts → "Send mail as" (needs an SMTP relay such as Brevo's free tier).
8. **Contact form:** after step 7, Workers & Pages → `stylo` → Settings → Variables and Secrets → add a **Secret**
   named `CONTACT_TO` = the verified Gmail address from step 7. (It is a secret so it is never in this public repo.)
   Mail arrives from `form@simplystylo.com` with Reply-To set to the visitor. Until this is set the form shows a
   friendly "email us at hello@" message.
9. **Search engines:** verify in Google Search Console (DNS TXT) and submit `/sitemap.xml`; in Bing Webmaster Tools use
   "Import from GSC".

## IndexNow

The build writes `dist/indexnow-manifest.json` (URL → hash of title, description and main content) and the key file
`/<indexNowKey>.txt`. On each push to `main` the workflow builds both the new commit and the previous one,
waits until Cloudflare serves the new build (live manifest = built manifest), then `scripts/indexnow.mjs` sends only
new or changed URLs to `api.indexnow.org` (Bing, Yandex, Seznam, Naver; Bing feeds
ChatGPT search and Copilot). Asset renames don't count as changes. Run the workflow manually with "Send every URL"
after changing the key. Leave Cloudflare Crawler Hints off: it would duplicate these pings less precisely.

## Editing pages yourself (GitHub web editor, no tools needed)

Open the file on github.com, click the pencil, edit, "Commit changes" to `main`: Cloudflare rebuilds and the change is
live in about a minute. If the build fails, the old site stays up; Cloudflare → Workers & Pages → stylo → Deployments shows why.

| To change | Edit |
| --- | --- |
| Home, about, contact, privacy, terms text | `src/pages/site.mjs` |
| A color guide's notes, pairings, occasions | `src/data/colors.mjs` |
| A season's notes | `src/data/seasons.mjs` |
| Seasonal wedding guest advice | `src/data/wedding-seasons.mjs` |
| Tool names and card blurbs | `src/tools.mjs` |
| Tool page text and FAQs | `src/pages/tools.mjs` |
| Colors, fonts, spacing | `src/styles.css` (`:root` tokens at the top) |

**Adding a photo:** upload a JPG/WebP (≤ 200 KB, ≥ 1200 px wide) to `static/img/` with "Add file → Upload files", then
in the page text add `<img src="/img/name.jpg" width="1200" height="800" alt="What the photo shows" loading="lazy">`
(width/height = the photo's real pixel size; the validator rejects images without alt, width or height). Use only your
own photos or ones licensed for commercial use. Bump `dateModified` in `src/site.json` after content changes.

## Adding a tool (definition of done: see CLAUDE.md)

Engine in `src/lib/`, tests in `tests/`, UI in `src/ui/` (exports `controls`, `result`, `summary`, `mount`), page in
`src/pages/tools.mjs`, record + bundle in `src/tools.mjs`. Validator enforces answer paragraph, 7 FAQs, pre-rendered
result, aria-live and the verified date.

## Upkeep

- **Every content change:** bump `dateModified` in `src/site.json` (drives sitemap `lastmod` and "Method verified").
- **Yearly:** re-check the size sources in `size-core.js` `FACTS` and the retailer charts on the size page.
- **When adding ads or affiliate links:** update the CSP in `scripts/build.mjs`, the privacy policy and add a visible
  disclosure next to every affiliate block. Keep tool results free of paid placement.
