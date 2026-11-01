# SimplyStylo.com

**Find your style. Wear it better.** Free, privacy-first style tools: colors, sizes and outfits.
Static site, zero npm dependencies, hosted on Cloudflare Workers Static Assets (deployed by Workers Builds). © SimplyStylo. All rights reserved.

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
| 14 color guides | `/colors/<color>/` | color engine + `src/data/colors.mjs` | built-in validator |
| 12 color seasons | `/seasons/<season>/` | season engine + `src/data/seasons.mjs` | built-in validator |
| Garment illustrations | used by outfit + capsule results | `src/lib/garments.js` | `tests/garments.test.mjs` |

Plus home, tools, colors and seasons indexes, about, methodology, contact, privacy, terms and a 404 page (49 pages).
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
static/         favicon, icons, og.png, manifest (copied as is)
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
7. **Email:** Email → Email Routing → route `hello@simplystylo.com` to your inbox (free).
8. **Search engines:** verify in Google Search Console (DNS TXT) and submit `/sitemap.xml`; in Bing Webmaster Tools use
   "Import from GSC".

## IndexNow

The build writes `dist/indexnow-manifest.json` (URL → hash of title, description and main content) and the key file
`/<indexNowKey>.txt`. On each push to `main` the workflow builds both the new commit and the previous one,
waits until Cloudflare serves the new build (live manifest = built manifest), then `scripts/indexnow.mjs` sends only
new or changed URLs to `api.indexnow.org` (Bing, Yandex, Seznam, Naver; Bing feeds
ChatGPT search and Copilot). Asset renames don't count as changes. Run the workflow manually with "Send every URL"
after changing the key. Leave Cloudflare Crawler Hints off: it would duplicate these pings less precisely.

## Adding a tool (definition of done: see CLAUDE.md)

Engine in `src/lib/`, tests in `tests/`, UI in `src/ui/` (exports `controls`, `result`, `summary`, `mount`), page in
`src/pages/tools.mjs`, record + bundle in `src/tools.mjs`. Validator enforces answer paragraph, 7 FAQs, pre-rendered
result, aria-live and the verified date.

## Upkeep

- **Every content change:** bump `dateModified` in `src/site.json` (drives sitemap `lastmod` and "Method verified").
- **Yearly:** re-check the size sources in `size-core.js` `FACTS` and the retailer charts on the size page.
- **When adding ads or affiliate links:** update the CSP in `scripts/build.mjs`, the privacy policy and add a visible
  disclosure next to every affiliate block. Keep tool results free of paid placement.
