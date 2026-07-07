---
name: anywise-site
description: How the Anywise website (anywise.com.au) is built — its design system, page structure, component patterns, navigation rules, and deploy/SEO setup. Use this skill whenever working on the Anywise website: adding or editing a page, building a section or component, touching shared.css / shared.js / the blog generator, changing navigation, adjusting colours/typography/spacing, working on the innovation/products/blog/careers/about pages, or anything involving the site's look, structure, SEO, or Cloudflare deployment. Use it even when the request doesn't say "design system" — if the work touches how the site looks or is structured, this skill defines the known-good patterns to follow so the result stays cohesive.
---

# Anywise Website — How It's Built

The Anywise site (anywise.com.au) is a **hand-authored static site** (plain HTML/CSS/JS, no framework, no build step for pages) deployed on **Cloudflare Pages**. Its cohesion comes from a shared token system + a small set of repeated patterns, not a component library. Your job when working on it is to extend those patterns faithfully so new work is indistinguishable from existing work.

**Golden rule: match the surrounding code.** Before adding anything, look at how a similar existing page/section does it and follow that exact pattern. The patterns below are descriptions of what's already there, not new inventions.

## Architecture at a glance

- **`shared.css`** — the design system: the `:root` token block, light-mode overrides, and all cross-page components (nav, footer, buttons, breadcrumb, reveal animations, modal, blog-article + legal-page layouts, focus states). Every page except the homepage links this and inherits from it.
- **`shared.js`** — cross-page behaviour: theme detection/toggle, mobile nav (with focus trap), scroll-reveal IntersectionObserver, the injected Engage Us modal, scroll-to-top, dynamic copyright year.
- **`index.html`** — the homepage is **self-contained**: it has its OWN inline `<style>` with a `:root` block that MUST stay byte-identical to shared.css's (it also links shared.css). It carries extra homepage-only machinery (WebGL globe hero, hero animations). Treat its inline `:root` and shared.css's `:root` as one source of truth kept in sync.
- **Pages** — `innovation.html`, `about.html`, `careers.html`, `products/*.html`, `blog/*.html`, policy pages. Each is a full HTML doc that links shared.css + shared.js and reuses the shared chrome.
- **`scripts/generate-blog-static.js`** — generates the static blog article pages from `blog/posts.json`. Blog articles are NOT hand-edited; edit the generator (or posts.json) and re-run `node scripts/generate-blog-static.js`.
- **`sitemap.xml`, `robots.txt`, `_headers`** — the SEO / AI-discovery / security layer. See `references/seo-deploy.md`.

## Non-negotiable rules

These are the things that, if broken, make the site feel inconsistent or regress the audit fixes. Follow them.

1. **Use design tokens, never raw values.** Colours, radii, transitions, fonts all come from CSS variables (`var(--accent)`, `var(--bg-card)`, `var(--radius-lg)`, `var(--transition)`, `var(--font)`, `var(--mono)`). The only sanctioned raw hex are documented exceptions (e.g. the SWIFT logo tile `#12140f`, pipeline-chip text `#06210b`, SVG illustration fills) — see `references/design-system.md`. If you reach for a raw colour, there's almost certainly a token for it.
2. **Everything must work in BOTH dark and light mode.** Light mode is driven by `[data-theme="light"]` token overrides. Because you use tokens, this is usually automatic — but any hard-coded colour, and any tile/badge with a baked background, needs a light-mode check. Mentally test: "if the background were near-white, is this still readable?"
3. **Keep the homepage `:root` and `shared.css` `:root` identical.** Adding or changing a token means editing BOTH blocks. A drift here is a real bug.
4. **The header nav is destinations-only and identical on every page.** Order: Products & Services · Innovation · About · Insights · Careers · Engage Us (CTA) · theme toggle. Every item is a real page (no in-page `#anchor` items in the top bar). The current page's link gets `class="active"`. Sub-pages use the correct relative depth (root pages link `about.html`; `products/` and `blog/` pages link `../about.html`). See `references/page-templates.md`.
5. **Every page needs the shared chrome + a11y baseline:** skip-link (`<a href="#main-content" class="skip-link">`), `<nav id="nav">`, `<main id="main-content">`, the shared `<footer>`, and it must link shared.css + shared.js. New standalone pages are quickest to build by copying an existing simple page (e.g. `about.html` or a policy page) and gutting the content — never build the shell from scratch.
6. **Accessibility is part of "done":** heading order with no skips (one `<h1>`, then `<h2>`→`<h3>`; stat/figure text is NOT a heading), `:focus-visible` works on all interactive elements (handled globally in shared.css — don't suppress outlines), form fields get `aria-required`/`aria-invalid` + `role="alert"` errors, 44px minimum touch targets, images get `alt` + `loading="lazy"` + intrinsic `width`/`height` (below-the-fold), and decorative SVGs get `role="presentation"`/`aria-hidden`. See `references/design-system.md#accessibility`.
7. **Australian English** everywhere (colour, optimise, behaviour, organisation, centre). The registered entity is **Anywise Pty Ltd**.

## The design language (what makes it feel like Anywise)

- **Palette:** three greens — Apple `#39a849` (primary/accent), Lime `#c3e01b` (highlight), Mint `#2d7f36` (deep). Warm-dark surfaces by default; near-white in light mode. Green is the *only* colour — there is no secondary hue.
- **Typography:** General Sans (headings + body), JetBrains Mono (eyebrow labels, stat figures, technical/meta text). Two weights do most of the work: 400 and 700/800 for headings.
- **Signature moves** (reuse these, they tie the site together):
  - **Eyebrow label** — mono, uppercase, accent-green, with an animated gradient underline rule. `<p class="label">Section Name</p>` above most section headings. Give every major section one.
  - **Accent heading** — headings use `<em>` (rendered non-italic, accent-green) to highlight the key phrase, e.g. `<h2>Hard problems, <em>engineered into capability.</em></h2>`.
  - **Scroll reveal** — content fades/rises in via `.reveal` (+ `.reveal-left/right/scale`); the IntersectionObserver adds `.visible`. Respects `prefers-reduced-motion`.
  - **Cards** — the dark `.product-card` (image-top, mono tag, title, blurb, italic highlight) is the default card language. The green-gradient `.cap-card` is a deliberate accent reserved for the homepage Capabilities section only — don't spread it elsewhere.
- **Voice:** confident, specific, problem-first. Real metrics only (no invented "10x"). No AI-slop tells — no gradient-text sprinkled everywhere (the hero `<em>` is the one sanctioned gradient), no glassmorphism pile-ons, no meaningless stat boxes.
- **CTAs:** the contact action is **"Engage Us"** (opens the injected modal via `data-engage`). Keep this label consistent; the one sanctioned variant is the innovation page's "Bring us your problem."

## Reference files — read the one that matches your task

- **`references/design-system.md`** — full token table (dark + light), typography scale, the component recipes (nav, footer, buttons, breadcrumb, cards, eyebrow labels, reveal, modal, badges), and the accessibility checklist. Read this for anything visual or component-level.
- **`references/page-templates.md`** — the anatomy of each page type (homepage sections, standalone page shell, product page, blog index + article, policy page, about page), the canonical nav/footer markup with correct relative paths, and how to add a new page. Read this when creating or restructuring a page.
- **`references/blog-system.md`** — how the blog works: `posts.json` shape, the static generator, the index render script, and the dynamic `post.html` fallback. Read this before touching anything under `blog/`.
- **`references/seo-deploy.md`** — sitemap conventions, robots.txt (the "answerable-not-trainable" AI-crawler posture), `_headers` (CSP + security), structured data (JSON-LD) patterns per page type, and Cloudflare Pages deployment notes. Read this for SEO, structured data, crawler, or deploy work.

## Working method

Brainstorm/plan for anything non-trivial (this project follows the superpowers workflow). When building UI, check this skill's patterns first, implement, then **verify in a browser in both themes and at mobile width** before calling it done — the site has been through a full accessibility + cohesion audit and the bar is "indistinguishable from existing work, correct in both themes, no console errors."
