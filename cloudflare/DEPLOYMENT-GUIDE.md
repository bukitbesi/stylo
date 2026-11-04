# SimplyStylo · Cloudflare Production Deployment & Configuration Guide

This guide gives you everything you need to host, accelerate, and secure **simplystylo.com** on Cloudflare with **0 server costs**, **sub-50ms TTFB worldwide**, and **perfect Core Web Vitals (CWV)**.

---

## 1. Quick Deploy via Terminal (Recommended)

SimplyStylo is configured with Cloudflare Workers Static Assets (`wrangler.jsonc`). All 63 static pages, sitemaps, robots.txt, and AI context files are served straight from edge cache without worker overhead.

```bash
# 1. Build the distribution folder
npm run build

# 2. Login to Cloudflare (one time)
npx wrangler login

# 3. Set the contact email recipient secret
npx wrangler secret put CONTACT_TO
# Enter your private destination email address when prompted

# 4. Deploy to Cloudflare Workers Static Assets
npx wrangler deploy
```

---

## 2. Cloudflare Dashboard Settings (One-Time Setup)

### A. SSL / TLS Settings
1. Go to **SSL/TLS** > **Overview**:
   - Set encryption mode to **Full (strict)**.
2. Go to **SSL/TLS** > **Edge Certificates**:
   - Turn **Always Use HTTPS** ON.
   - Set **Minimum TLS Version** to **TLS 1.2** (TLS 1.3 is enabled by default).
   - Turn **Automatic HTTPS Rewrites** ON.
   - Turn **Opportunistic Encryption** ON.

### B. Speed & Caching (CWV & LCP Optimization)
1. Go to **Speed** > **Optimization**:
   - **Brotli**: ON.
   - **Early Hints (103)**: ON (sends preload headers while page is compiling).
   - **Rocket Loader**: OFF (SimplyStylo has zero heavy third-party JS, keep OFF for cleanest hydration).
2. Go to **Caching** > **Tiered Cache**:
   - Turn **Tiered Cache** ON (Free feature that pools global edge caches).
3. Go to **Caching** > **Cache Rules**:
   - You can review `cloudflare/rules/cache-rules.json`.
   - Set edge cache TTL to **7 days** for `*.html` and **1 year immutable** for `/assets/*`.

### C. Redirect Rules (Apex Domain Canonicalization)
1. Go to **Rules** > **Redirect Rules**:
   - Create a rule from `cloudflare/rules/redirect-rules.json`:
   - When incoming host is `www.simplystylo.com`, 301 Redirect to `https://simplystylo.com` (Preserve Query String).

### D. Security & WAF (Web Application Firewall)
1. Go to **Security** > **WAF** > **Custom Rules**:
   - Review `cloudflare/rules/waf-custom-rules.json`.
   - Set a rate limit rule on `POST /api/contact` to prevent automated contact form spam.
   - Whitelist **Verified Bots** (Googlebot, Bingbot, PerplexityBot, GPTBot, ClaudeBot) so search engine and AI indexing are never restricted.

### E. Email Routing (Free Contact Form Forwarding)
1. Go to **Email** > **Email Routing**:
   - Enable Email Routing for `simplystylo.com`.
   - Cloudflare will automatically add the required MX and SPF records shown in `cloudflare/rules/email-routing.json`.
   - Create a custom address: `contact@simplystylo.com`.
   - Destination address: Enter your real personal or work email. Verify the confirmation email sent by Cloudflare.
   - Now, any message submitted through SimplyStylo's `/contact/` form or `/api/contact` will instantly arrive in your personal inbox with zero third-party mailer fees.

---

## 3. Uploadable Files Summary

| File | Purpose | Cloudflare Destination |
|---|---|---|
| `cloudflare/wrangler.jsonc` | Workers + Static Assets config | Root of project (`wrangler.jsonc`) |
| `cloudflare/_headers` | HTTP cache & security headers | Copied into `dist/_headers` on build |
| `cloudflare/_redirects` | Edge 301 redirects | Copied into `dist/_redirects` on build |
| `cloudflare/rules/redirect-rules.json` | Apex domain redirection rule | Cloudflare Dashboard > Rules > Redirect Rules |
| `cloudflare/rules/cache-rules.json` | Edge TTL & API bypass cache rules | Cloudflare Dashboard > Caching > Cache Rules |
| `cloudflare/rules/transform-rules.json` | Header modifications & caching rules | Cloudflare Dashboard > Rules > Transform Rules |
| `cloudflare/rules/waf-custom-rules.json` | WAF security & bot crawler whitelist | Cloudflare Dashboard > Security > WAF |
| `cloudflare/rules/email-routing.json` | Email forwarding DNS & route config | Cloudflare Dashboard > Email > Email Routing |
