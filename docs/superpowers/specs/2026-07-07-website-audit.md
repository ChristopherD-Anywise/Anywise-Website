# Anywise Website Audit — 2026-07-07

Exhaustive audit of all 23 real pages + shared systems, against impeccable + ui-ux-pro-max
known-good heuristics and cross-page consistency. Findings verified against source before
inclusion. This catalogues fixes to make BEFORE codifying the "how our site is built" skill,
so the skill reflects a corrected known-good state.

**Overall verdict:** genuinely well-built, low AI-slop, strong token discipline and SEO
baseline. Issues are concentrated in (a) accessibility gaps on interactive surfaces,
(b) a few systemic consistency/drift patterns, and (c) hygiene (dead files, sitemap errors).

---

## Systemic patterns (fix once, applies everywhere)

- **P1 — `:focus-visible` only covers nav.** shared.css defines it on `.nav-links a`, `a.nav-cta`,
  `.mobile-toggle` only. Missing on `.btn/.btn-accent/.btn-ghost`, `.product-card`,
  `.view-all-link`, breadcrumb/footer/body links, and `.theme-toggle` (its focus style lives
  ONLY in index.html inline, so it's absent on every shared.css page). *(verified)*
- **P2 — No image performance attributes site-wide.** ~30+ `<img>` across homepage + all 8
  product pages lack `loading="lazy"` / `width` / `height` / `decoding`. innovation.html and
  blog do it right — those are the template to copy. Causes CLS.
- **P3 — Blog article pages are dead-ends.** The 4 static articles have no nav, no footer, no
  skip-link, no theme toggle, no Engage trigger (the generator `scripts/generate-blog-static.js`
  doesn't emit them). *(verified: skip/main = 0 on articles)* These are the most-shared URLs.
- **P4 — Duplicated inline CSS drifts.** The 5 legal pages each inline the same ~20-line
  `.page-*` block instead of using shared.css; the `.page-content h3` rule already exists in
  only 2 of 5 and at different positions. Same smell: 2× inline-styled `<h2>` per product page.
- **P5 — Engage modal a11y gap.** Unlike the (excellent) mobile-nav, the injected Engage modal
  has no focus trap and no focus-return-to-trigger on close. It's the one interactive surface
  not covered by the site's otherwise-strong a11y patterns.
- **P6 — Stale docs will mislead the skill.** `anywise_style_guide.json` prescribes Open Sans /
  Roboto but the live site uses General Sans + JetBrains Mono. `docs/site-builder-library.md`
  documents the theme localStorage key as `anywise-theme` but the code uses `theme`. Reconcile
  before codifying so the skill documents the ACTUAL system.

---

## Critical (accessibility blockers)

- **[shared.css:252-301] Focus-visible gap (P1)** — keyboard users get no visible focus on the
  primary CTAs (`.btn*`), every product/innovation card link, view-all links, and the theme
  toggle (off homepage). WCAG 2.4.7. Fix: add a shared
  `a:focus-visible, button:focus-visible, .btn:focus-visible, .product-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }`
  and move `.theme-toggle:focus-visible` from index.html inline into shared.css.

## High

- **[terms.html:124-126] Empty legal sections** *(verified)* — §8 "Privacy" and §9 "Changes to
  These Terms" are headings with NO body text on a live legal page. Fix: add the content (or
  remove headings + renumber).
- **[sitemap.xml] Phantom + missing pages** *(verified)* — lists `contact.html` which doesn't
  exist (404 in sitemap); omits `careers.html` and all 3 indexable policy pages
  (grievance/whistleblower/weapons-exclusion). Fix: remove contact.html, add the 4 real pages.
- **[blog articles ×4] Dead-end pages (P3)** — no nav/footer/skip-link. Fix: emit shared
  nav+footer from the static blog generator.
- **[careers.html:1438] Unstyled `.invalid`** — wizard adds `.invalid` to failed fields but no
  `.invalid` CSS exists; the only error feedback is one generic sentence. Fix: add visible
  invalid state (border in a `--danger` token).
- **[careers.html:1436-1490] Form errors not announced** — no `aria-invalid`, no
  `aria-describedby`, error text not in an `aria-live` region; `<form novalidate>` disables
  native validation. SR users get no field-level error info. Fix: `aria-invalid` + `aria-live`.
- **[careers.html forms + shared.css:536] Touch targets <44px** — form controls ~38px, wizard
  nav buttons ~34px, job buttons ~30px, modal close 32px. WCAG 2.5.5. Fix: min-height 44px.
- **[index.html:1750-1758] Heading order skip** — three `.stat-box h3` appear before any `<h2>`
  (h1→h3 skip); they're not section headings. Fix: use `<p>`/`<span>`.
- **[index.html:789-791] Stat-box contrast over globe** — `rgba(255,255,255,0.5)` at 0.68rem on
  a blurred translucent box over a moving WebGL globe; fails 4.5:1 on light globe frames. Fix:
  raise opacity/size or solid backing.
- **[ils.html, impact-framework.html JSON-LD] Wrong schema type** — services typed as
  `SoftwareApplication`. Fix: `Service`/`ProfessionalService`.
- **[fraud-analytics/ils/impact-framework.html:6] Title pattern drift** — `Name — Anywise`
  instead of the house `Name — Category | Anywise`. Fix: normalise.

## Medium

- **Engage modal focus trap + focus return (P5)** [shared.js:367-386].
- **Legal-page inline CSS → shared.css (P4)** [privacy/terms/grievance/whistleblower/weapons ×5].
- **`.innov-pipe span` light-mode hard-codes `#39a849`** bypassing `--accent`; verify chip text
  contrast [innovation.html]. (Confirm whether `.innov-pipe` markup still exists — CSS may be dead.)
- **Badge text contrast** — `#7bd189` (badge-eco) / `--lime` (badge-val) at 0.6rem; verify ≥4.5:1.
- **Innovation media treatments inconsistent** — SENTIA dark SVG, Sensing white tile, SWIFT dark
  logo tile, Assured cover photo: three background philosophies stacked. Decide one system (the
  white tile "punches a hole" in the dark page). Tokenise the hard-coded `#1a1a1a`/`#ffffff` tiles.
- **Hard-coded error red `#e74c3c`** in shared.css:587, shared.js:344, careers.html — add
  `--danger` token.
- **`theme-color` meta inconsistent** — careers uses `#39a849`, blog uses `#0e110e`. Standardise.
- **Blog articles share generic `og:image`** — all 8 use og-image.png despite unique heroes;
  fix to per-article hero. (JSON-LD image is already correct.)
- **Meta descriptions >160 chars** — aide.html, engaide.html (184c).
- **fabhums.html AVIF hero** — `FABHUMS.jpg.avif` in bare `<img>`, no `<picture>` fallback,
  misleading double extension.
- **index.html ILS card uses a FABHUMS image** — product/image mismatch.
- **careers JobPosting schema missing `baseSalary`** — Google JobPosting warning.

## Low

- Body links distinguished by colour only in legal pages (add underline + focus).
- Hero `<h1>` reveal not reset for reduced-motion / no-JS fallback [index.html].
- Nav-brand href differs (`/` vs `index.html`).
- `.innov-badge` 0.6rem very small for info-bearing (TRL) badge.
- Inner `<svg>` in SENTIA figure may double-announce (add `role="presentation"`).
- Sydney time offset hard-coded UTC+10 (ignores DST) [shared.js:8].
- Three unthrottled (passive) scroll listeners — consolidate.
- JSON-LD `about` array order differs from its own `itemList` order [innovation.html].
- Legal sub-section labelling inconsistent (7a/7b vs named h3 vs numbered).
- US spelling "behavior" [whistleblower-policy.html:147]; "Anywise Consulting Pty Ltd" vs
  "Anywise Pty Ltd" entity-name inconsistency.
- Various proofing nits (stray commas, `--` used as dash in grievance list).

## Hygiene — dead/duplicate files to delete

`shared 2.css`, `shared 2.js`, `blog/index 2.html`, `blog/post 2.html`, `products/index 2.html`,
`engage/index 2.html`, `anywise-v4 1 (1).html`, `datavault-example.html`, `blog/posts 2.json`,
`site-builder-skill/SKILL 2.md`, `template/README 2.md`, `template/brand 2.css`, and ~20
`* 2.png` / `og-image 2.jpg` duplicate binaries.

---

## Positive findings — the "known good" to codify in the skill

- **Token system** — single canonical `:root` mirrored EXACTLY between index.html inline and
  shared.css *(verified identical)*; semantic ladders (`--bg`/`-elevated`/`-card`/`-card-hover`,
  `--text-primary/secondary/tertiary`, `--accent`/`-dim`/`-muted`/`-glow`); full light-mode
  override table; radius + transition tokens. **This is the authoritative token source — not the
  style-guide JSON.**
- **Theme architecture** — pre-paint inline IIFE (no FOUC), localStorage persistence, time-based
  fallback, `window.__themeHandled` escape hatch for the globe homepage.
- **Mobile nav a11y** — reference implementation: aria-expanded, Escape, full Tab focus-trap,
  focus in/out. (Copy this pattern to the Engage modal.)
- **SEO baseline** — every page: unique title/description, canonical, full OG + Twitter,
  favicons, theme-color; product pages have SoftwareApplication + BreadcrumbList; blog has
  BlogPosting (en-AU); innovation has CollectionPage; careers has JobPosting.
- **robots.txt** — model "answerable-not-trainable" posture: Content-Signal, training crawlers
  (CCBot/Bytespider/Amazonbot/Applebot-Extended) blocked, AI-search crawlers
  (GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended/meta-externalagent) allowed,
  sitemap declared.
- **`_headers`** — nosniff, X-Frame-Options, HSTS, scoped CSP.
- **Motion** — explicit transitions (never `transition: all`), transform/opacity-only reveals,
  passive scroll listeners, single IntersectionObserver with unobserve, global reduced-motion.
- **Copy voice** — specific, confident, grounded metrics (no invented "10x"). Bespoke inline
  SVG diagrams. Markdown sanitised via DOMPurify, libraries SRI-pinned.
