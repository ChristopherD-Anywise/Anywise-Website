# Anywise SEO, Discovery & Deployment

## Sitemap (`sitemap.xml`)
Plain urlset. Every real, indexable page is listed; NO backup/duplicate/scratch pages. Priority convention:
- `1.0` homepage
- `0.9` products landing, innovation
- `0.8` product detail pages, about
- `0.7` blog index, careers
- `0.6` blog articles
- `0.3` policy pages
Add `<lastmod>` (YYYY-MM-DD) for newer/changed pages. When you add a page, add it here. Never list a page that doesn't exist (a phantom URL is a 404 in the sitemap — this was an audit finding). Validate after editing: `python3 -c "import xml.dom.minidom; xml.dom.minidom.parse('sitemap.xml')"`.

## robots.txt — the "answerable, not trainable" posture
Deliberate strategy, keep it intact:
- Global `Content-Signal: search=yes,ai-train=no` + `Allow: /`.
- **AI-training crawlers BLOCKED:** CCBot, Bytespider, Amazonbot, Applebot-Extended (`Disallow: /`).
- **AI-search / answer crawlers ALLOWED:** GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, meta-externalagent (`Allow: /`) — so Anywise is visible in ChatGPT/Perplexity/Google AI Overviews/Claude answers without feeding training sets.
- `Sitemap:` declared.

## Structured data (JSON-LD) — per page type
Every page carries a `<script type="application/ld+json">` block. Patterns in use:
- **Homepage:** `Organization` (@id `https://anywise.com.au/#organization`, legalName **Anywise Pty Ltd**) + `WebSite`.
- **Product platforms** (WISDOM, ENG|AIDE, AIDE, CAMP|AIDE, FABHUMS, Fraud Detection): `SoftwareApplication` + `BreadcrumbList`.
- **Product services** (ILS, Impact Measurement): `Service` (with `serviceType`, `provider`, `areaServed`) + `BreadcrumbList` — NOT SoftwareApplication (they're consultancy/service offerings).
- **Innovation:** `CollectionPage` with an `about[]` array + `ItemList` naming SENTIA, Sensing & vision, SWIFT, Assured Connectivity (keep `about` and `itemList` in the same order as the page).
- **Blog articles:** `BlogPosting` (en-AU, per-article image) — emitted by the generator.
- **About:** `AboutPage` → Organization.
- **Careers:** `JobPosting` per active role (JS-injected at runtime).
Reference the shared org node by `@id` rather than redefining it. Keep JSON-LD field names/order aligned to what the page actually shows.

## `_headers` — security (Cloudflare Pages)
Applies to `/*`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, and a **`Content-Security-Policy-Report-Only`** that allowlists only the real external origins: fontshare + googleapis/gstatic (fonts), web3forms (Engage form), and the careers-api Worker (`connect-src`). If you add a new external dependency (a font host, an API, an embed), you MUST extend the CSP allowlist or it'll be blocked/reported. Keep `frame-src 'none'`, `object-src 'none'`, `base-uri 'self'`.

## Deployment (Cloudflare Pages)
- The site is static; Cloudflare Pages builds/serves from the org repo `main` (`Anywise-au/Anywise-Website`). Pushing to `origin/main` triggers a deploy.
- There's a personal fork remote (`ChristopherD-Anywise`) that carries automated careers/job-sync commits; when syncing both, **merge** into personal/main (don't force-push over its commits) and fast-forward origin/main.
- Don't auto-push — the owner reviews locally first. See `docs/cloudflare-deployment-guide.md` for the full deploy notes and any gotchas.
- The repo lives under OneDrive, which periodically regenerates macOS `" 2"` duplicate files; `.gitignore` excludes `* 2.*` so they don't get committed.

## When adding SEO/meta to a new page
1. Unique `<title>` (`Name — Category | Anywise`), unique meta description ≤160 chars.
2. `<link rel="canonical">` self-referencing the real URL.
3. Full OG + Twitter set (per-page title/description/image).
4. The right JSON-LD type for the page (see above).
5. Add to `sitemap.xml`.
6. If it introduces an external origin, update `_headers` CSP.
