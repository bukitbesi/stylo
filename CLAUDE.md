# SimplyStylo.com: working rules

Global English (US spelling) style-utility site. Owner is a solo publisher on a tight budget: every change must be
complete, accurate, fast and AdSense/affiliate-safe. All rights reserved; never add an open-source license.

## Definition of done for every tool

1. **Verified method.** Formulas and conversion data checked against at least two sources (standards bodies first:
   ISO, EN, W3C). Where sources disagree, leave the figure out and say so on the page. Each engine has
   `FACTS.verified`, shown on the page as "Method verified …".
2. **Tested engine** in `src/lib/<name>-core.js` (UMD, pure), tests in `tests/<name>.test.mjs` whose worked examples
   match the numbers quoted in the page's answer and FAQs.
3. **UI** in `src/ui/<name>.js` (UMD, vanilla, exports `controls`, `result`, `summary`, `mount`): live results on
   input, state in the URL hash (never personal data), Copy link + Print, `aria-live` summary. Bundle in `src/tools.mjs`.
4. **Build-time render:** the page calls the UI's `controls`/`result` so the first result is in the HTML (no CLS).
5. **Page content (AEO/LLM):** `.answer` paragraph with the key number in the first sentence, how-it-works steps,
   data table from the engine, disclaimer callout, sources with links, 7 self-contained FAQs quoting exact figures,
   related tools, an `llms` paragraph.
6. **Meta:** full title ≤ 70 chars (no `&`), description 70–160, `app` (WebApplication), `faq`, `crumbs`, dates.
7. **Checks before push:** `npm run check` and `node scripts/e2e.mjs`; Lighthouse mobile 100/100/100/100, CLS 0.

## Rules

- No frameworks, no npm dependencies, no third-party scripts, system fonts, inline SVG. Never commit `dist/`.
- No doorway pages: a new color/size page must carry genuinely different data and hand-written notes.
- Don't cannibalise: check `src/tools.mjs` and `/colors/` before adding overlapping pages.
- White-hat only. No fake reviews/ratings, no FAQ text that isn't visible, no paid placement inside tool results.
- Affiliate or ad blocks need a visible label/disclosure and a CSP update; keep them out of the tool result itself.
