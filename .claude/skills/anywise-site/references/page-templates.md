# Anywise Page Templates & Structure

Every page is a full standalone HTML document (no server-side includes). Consistency comes from copying the shared chrome. **To create a new page, clone an existing simple page and gut the content** — don't assemble the shell from scratch. Good clone sources: `about.html` (root-level, clean) or a policy page like `privacy.html`.

## Table of contents
- Page shell (head + chrome)
- Canonical nav (root vs subdir)
- Canonical footer
- Homepage anatomy
- Standalone content page (innovation, about)
- Product pages
- Blog (see also blog-system.md)
- Policy pages
- Adding a new page — checklist

## Page shell

Every page `<head>` includes, in this order: charset/viewport, `<title>` in the house pattern **`Name — Category | Anywise`**, meta description (≤160 chars), favicons, `theme-color` `#0e110e`, canonical, OG + Twitter tags, Fontshare (General Sans) + Google (JetBrains Mono) font links, `<link rel="stylesheet" href="shared.css">` (use `../shared.css` from subdirs), optional page-specific `<style>`, and JSON-LD (see seo-deploy.md).

`<body>` order: skip-link → `.scroll-progress` div → `<nav id="nav">` → `<main id="main-content">` … `</main>` → `<footer>` → `<script src="shared.js"></script>`.

## Canonical nav

Destinations-only, identical everywhere, current page marked `class="active"`. Root-level pages:

```html
<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="innovation.html">Innovation</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="careers.html">Careers</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light/dark mode">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      <span class="close-x">&times;</span>
    </button>
  </div>
</nav>
```

**Subdirectory pages** (`products/`, `blog/`) use `../` on every internal link: `../index.html`, `../products/index.html`, `../innovation.html`, `../about.html`, `../blog/index.html`, `../careers.html`, and `../assets/Anywise_Logo.png`. Mark the section's own item `class="active"` (e.g. a product page marks Products & Services active; a blog page marks Insights active).

There are NO in-page `#anchor` items in the top bar. Capabilities/Approach/Purpose live only on the homepage and are reached via the hero "Our Capabilities" button + the footer's Capabilities column.

## Canonical footer

Four-column grid: brand blurb (logo, tagline, ABN/B-Corp line, phone, email, LinkedIn) · **Capabilities** (Technology/Services/Our Approach → homepage anchors) · **Products & Services** (all 8 products) · **Company** (About, Innovation, Insights, Careers, the policy pages). Then `.footer-bottom` (copyright with `#copyrightYear` span, locations) and the `.acknowledgement` (Uluru statement). Copy it verbatim from `about.html` or `innovation.html`, adjusting `../` for subdir pages. The Company column links `about.html` first.

## Homepage (`index.html`) anatomy

Self-contained (own inline `<style>` + `:root`, WebGL globe). Section order (each a `<section class="…" id="…">`):
1. **hero** (`#hero`) — globe background, rotating tagline, line-reveal `<h1>` with gradient `<em>`, hero-sub, actions ("Our Capabilities" scroll + "Engage Us"), stats bar (`.stat-box` with `.stat-value` — NOT headings).
2. **purpose** (`#purpose`) — "Our Purpose" statement + "Our Values" list.
3. **capabilities** (`#capabilities`) — eyebrow + `.cap-grid` of 3 green `.cap-card`s.
4. **approach** (`#approach`).
5. **products** (`#products`) — "Products & Services" head + `.product-grid` (3) + `.product-grid-bottom` (2) of `.product-card`s + view-all link.
6. **innovation** (`#innovation`) — teaser: eyebrow, headline, PoC→Validate→Field pathway, 4-up `.product-card` preview, "Explore all our innovations →" → innovation.html.
7. **track** (`#track`) — Track Record stat counters.
8. **team** (`#about`) — "Our People", "any.one is welcome".
9. **news** (`#news`) — "any.news" latest insights.
10. **cta** (`#contact`) — "Get in touch" eyebrow + "Ready to tackle…" + Engage Us / Our Capabilities.
11. **creds** — certification marquee.

## Standalone content page (innovation.html, about.html)

Pattern: `.page-hero`/`.about-hero` (breadcrumb, eyebrow, `<h1>` with `<em>`, sub) → content sections (`.innovation-detail`, `.about-section`, etc.) → optional CTA block → footer. These carry a page-specific `<style>` block for their unique layout, but pull colours/spacing from tokens. `about.html` is the cleanest reference for a content page.

## Product pages (`products/*.html`)

All 8 share an identical template: `.prod-hero` (tag, `<h1>`, tagline, actions, hero image) → `.prod-section` two-column blocks → `.prod-benefits` grid → `.prod-how` (steps + use cases) → `.prod-features` → CTA. Each has `SoftwareApplication` **or** `Service` JSON-LD + `BreadcrumbList` (see seo-deploy.md — ILS and Impact Measurement are `Service`, the rest `SoftwareApplication`). `products/index.html` is the listing. When adding a product, clone an existing product page and keep the section structure identical.

## Blog

`blog/index.html` (JS-rendered list from posts.json) + generated static articles + `blog/post.html` (dynamic fallback). See `blog-system.md` — do not hand-edit generated articles.

## Policy pages (privacy, terms, grievance, whistleblower, weapons-exclusion)

Near-identical shells using the shared `.page-wrap` / `.page-hero` / `.page-content` classes (these live in shared.css now — do NOT re-inline them per page). Content is numbered `<h2>` sections. Eyebrow reads "Legal" or "Policy".

## Adding a new page — checklist

1. Clone `about.html` (root) or a subdir page as the shell.
2. Update `<head>`: title (house pattern), description, canonical, OG/Twitter, JSON-LD.
3. Confirm nav uses the correct relative depth and marks the right item `active` (or none if the new page isn't a top-level destination).
4. Copy the footer (verbatim, adjust `../`).
5. Build content with tokens + the signature patterns (eyebrow labels, `<em>` headings, `.reveal`).
6. Add the page to `sitemap.xml` (see seo-deploy.md for priority conventions).
7. If it should be in the top nav, add it to the nav on **every** page + the blog generator (it's a site-wide change).
8. Verify in browser: both themes, mobile width, keyboard focus, no console errors.
