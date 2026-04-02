# Products & Services Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the website from 5 products to 8 products & services, replace text logo with image logo, update favicon, and prepare OG/Twitter card meta tags.

**Architecture:** Three new service detail pages cloned from the existing product page template (`products/wisdom.html`). Landing page featured grid changes from 5 products (3+2) to 5 new featured items (3+2). Products index page expands to 3-3-2 grid with 8 items. Logo changes from text `any<span>wise</span>` to `<img>` across all 14 pages. Favicon replaces generated SVG with provided 96x96 PNG. OG meta tags updated across all pages.

**Tech Stack:** Static HTML/CSS/JS, no build tools. All pages follow existing patterns in shared.css/shared.js.

**OG Image:** `assets/OG.jpeg` (JPEG format, NOT PNG)

**IMPORTANT — Image paths:** The directory `assets/images/products & services/` has a space and ampersand in the name. In HTML `src` attributes, URL-encode the space and ampersand: `assets/images/products%20%26%20services/WISDOM.png`. Alternatively, use the unencoded path — modern browsers handle it, but encoding is safer.

---

## Execution Order

**CRITICAL: Create new pages FIRST, then update across all pages.**

1. **T3** — Create Fraud Detection service page
2. **T4** — Create Impact Measurement service page
3. **T5** — Create ILS service page
4. **T1** — Replace text logo with image (all 14 pages including new ones)
5. **T2** — Update favicon (all pages)
6. **T6** — Expand Products & Services index page (3-3-2 grid)
7. **T7** — Update landing page featured products (new 5)
8. **T8** — Update product detail hero images
9. **T9** — Update nav, footer, breadcrumbs, shared.js modal across all pages
10. **T10** — Add OG & Twitter Card meta tags to all pages

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `products/fraud-analytics.html` | Fraud Detection & Compliance Analytics service detail page |
| `products/impact-framework.html` | Impact Measurement & Reporting Frameworks service detail page |
| `products/ils.html` | Integrated Logistics Support service detail page |

### Modified Files
| File | Changes |
|------|---------|
| `anywise-v5-redesign.html` | Logo image, **remove inline .nav-brand CSS (lines 375-384)**, featured products grid (new 5), section heading rename, favicon links, OG/Twitter meta tags, footer updates |
| `products/index.html` | Logo image, 3-3-2 grid with 8 items, section heading rename, **title tag**, **meta description**, copy updates, favicon, footer |
| `products/wisdom.html` | Logo image, favicon, footer product links, product image update, **breadcrumb text** |
| `products/engaide.html` | Logo image, favicon, footer product links, product image update, **breadcrumb text** |
| `products/fabhums.html` | Logo image, favicon, footer product links, product image update, **breadcrumb text** |
| `products/campaide.html` | Logo image, favicon, footer product links, **breadcrumb text** |
| `products/aide.html` | Logo image, favicon, footer product links, **breadcrumb text** |
| `products/fraud-analytics.html` | (Created in T3, then updated in T1, T2, T9, T10) |
| `products/impact-framework.html` | (Created in T4, then updated in T1, T2, T9, T10) |
| `products/ils.html` | (Created in T5, then updated in T1, T2, T9, T10) |
| `blog/index.html` | Logo image, favicon, nav text |
| `blog/post.html` | Logo image, favicon, nav text |
| `engage/index.html` | Logo image, favicon, nav text |
| `shared.css` | `.nav-brand` styles updated for image logo |
| `shared.js` | **Engage modal product dropdown — add 3 new services** |

---

## Task 3: Create Fraud Detection & Compliance Analytics Service Page

**Files:**
- Create: `products/fraud-analytics.html`
- Reference: `products/wisdom.html` (clone as template)
- Content source: `/Users/chrisdennis/Downloads/anywise_new_services.md` (Section: "Fraud Detection & Compliance Analytics")

- [ ] **Step 1: Copy the template**

```bash
cp products/wisdom.html products/fraud-analytics.html
```

- [ ] **Step 2: Replace all content in `products/fraud-analytics.html`**

Make the following replacements throughout the file:

**Title and meta:**
```html
<title>Fraud Detection & Compliance Analytics — Anywise</title>
<meta name="description" content="Protecting program integrity through intelligent data analysis. Custom fraud detection engines that integrate with your existing data pipeline.">
```

**Breadcrumb:**
```html
<span>Fraud Detection & Compliance Analytics</span>
```

**Hero section:**
```html
<div class="prod-tag">Compliance Intelligence</div>
<h1>Fraud Detection &amp; Compliance Analytics</h1>
<p class="prod-tagline">Protecting program integrity through intelligent data analysis. We build detection engines tailored to your data pipeline that surface fraud patterns manual review misses.</p>
```

**Hero image:** Use a placeholder SVG icon (same pattern as existing pages) — Chris will provide the image later. Keep the existing SVG placeholder pattern from wisdom.html's `.img-placeholder`.

**Overview section (`.prod-two-col.flip`):**
- Heading: "What is Fraud Detection & Compliance Analytics?"
- Content: Use the first three paragraphs from the `.md` file:
  - "Large government programs generate mountains of transaction data..."
  - "We don't just build dashboards. We embed with your team..."
  - "The system classifies risk hierarchically..."

**Key Benefits Grid (`.prod-benefits-grid`, 4 cards):**

| Card | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | Shield icon | Hierarchical Risk Classification | Program-wide, transaction-level, and entity-level pattern detection feeding a single actionable risk score |
| 2 | Users icon | Embedded Engagement | We work alongside your compliance and data teams to map fraud patterns specific to your program |
| 3 | Zap icon | 80% Faster Screening | Cut case screening time dramatically — in one program, from weeks of manual review to hours of targeted investigation |
| 4 | Refresh icon | Continuous Refinement | Detection engines evolve as fraud patterns change — not a set-and-forget tool |

Use the same SVG icon pattern as wisdom.html benefit cards.

**How It Works (`.prod-steps`, 4 steps):**

| Step | Title | Description |
|------|-------|-------------|
| 1 | Embed & Discover | We join your compliance team to understand how fraud actually happens in your program — the specific patterns, edge cases, and things that look suspicious but aren't |
| 2 | Build Detection Engine | Custom engine integrated with your data pipeline: entity-level tracking, transaction scoring, program-wide pattern detection |
| 3 | Calibrate Risk Scoring | Tune risk models to your regulatory context, ensuring investigators get actionable scores — not noise |
| 4 | Refine & Evolve | Ongoing refinement as fraud patterns shift. The system learns from your program's data, not generic models |

**Use Cases (`.use-cases-list`):**
- State regulatory program fraud screening
- Coordinated entity scheme detection
- Government grant compliance monitoring
- Multi-account behavioural pattern analysis

**Feature Breakdown (`.prod-feature-list`):**
- Embed with compliance and data teams to map program-specific fraud patterns
- Custom detection engines integrating with existing data pipelines
- Hierarchical classification across entity, transaction, and program levels
- Risk scoring models tuned to regulatory context
- Investigator-focused dashboards (not just pretty charts)
- Ongoing refinement as fraud patterns evolve

**CTA section:**
```html
<h2>Ready to protect program integrity?</h2>
<p>Tell us about your compliance challenge. We'll show you how tailored detection changes the game.</p>
```

- [ ] **Step 3: Verify the page renders**

Open `http://localhost:8081/products/fraud-analytics.html` and check all sections render.

- [ ] **Step 4: Commit**

```bash
git add products/fraud-analytics.html
git commit -m "feat: add Fraud Detection & Compliance Analytics service page"
```

---

## Task 4: Create Impact Measurement & Reporting Frameworks Service Page

**Files:**
- Create: `products/impact-framework.html`
- Reference: `products/wisdom.html` (clone as template)
- Content source: `/Users/chrisdennis/Downloads/anywise_new_services.md` (Section: "Impact Measurement & Reporting Frameworks")

- [ ] **Step 1: Copy the template**

```bash
cp products/wisdom.html products/impact-framework.html
```

- [ ] **Step 2: Replace all content in `products/impact-framework.html`**

**Title and meta:**
```html
<title>Impact Measurement & Reporting Frameworks — Anywise</title>
<meta name="description" content="Turn fragmented program data into clear evidence of what works. Standardized data collection and automated reporting dashboards for multi-site programs.">
```

**Breadcrumb:** `<span>Impact Measurement</span>`

**Hero section:**
```html
<div class="prod-tag">Program Intelligence</div>
<h1>Impact Measurement &amp; Reporting Frameworks</h1>
<p class="prod-tagline">Turn fragmented program data into clear evidence of what works. We design frameworks that standardize collection and automate reporting — no more quarterly panic.</p>
```

**Hero image:** Placeholder SVG icon.

**Overview:** "What is Impact Measurement & Reporting?" — use .md content.

**Key Benefits (4 cards):**
1. BarChart → "60% → 95% Compliance"
2. Clock → "Weeks → Days"
3. Globe → "Low-Connectivity Ready"
4. Layers → "Multi-Site Standardization"

**How It Works (4 steps):**
1. Map Your Data Landscape
2. Design Collection Framework
3. Build Automated Dashboards
4. Train & Support

**Use Cases:** Federal reporting, research tracking, community outcomes, cross-team standardization

**Features:** System design, low-connectivity templates, automated dashboards, training, remote support

**CTA:** "Ready to measure what matters?"

- [ ] **Step 3: Verify and commit**

```bash
git add products/impact-framework.html
git commit -m "feat: add Impact Measurement & Reporting Frameworks service page"
```

---

## Task 5: Create Integrated Logistics Support Service Page

**Files:**
- Create: `products/ils.html`
- Reference: `products/wisdom.html` (clone as template)
- Content source: `/Users/chrisdennis/Downloads/anywise_new_services.md`
- Image: `assets/images/products%20%26%20services/FABHUMS_Training.jpg`

- [ ] **Step 1: Copy the template**

```bash
cp products/wisdom.html products/ils.html
```

- [ ] **Step 2: Replace all content in `products/ils.html`**

**Title and meta:**
```html
<title>Integrated Logistics Support & Technical Publications — Anywise</title>
<meta name="description" content="Making complex systems supportable through life. ILS frameworks, technical publications, and WISDOM-powered documentation for defence and industry.">
```

**Breadcrumb:** `<span>Integrated Logistics Support</span>`

**Hero section:**
```html
<div class="prod-tag">Logistics Intelligence</div>
<h1>Integrated Logistics Support</h1>
<p class="prod-tagline">Making complex systems supportable through life. We develop ILS frameworks and technical publications that keep capabilities operational long after initial delivery.</p>
```

**Hero image — USE REAL IMAGE (not SVG placeholder):**
```html
<div class="prod-hero-img reveal-scale">
  <img src="../assets/images/products%20%26%20services/FABHUMS_Training.jpg" alt="Anywise delivering ILS training to defence personnel" style="width:100%;height:auto;border-radius:var(--radius-lg);">
</div>
```

**Overview:** from .md — defence needs, embed with teams, WISDOM 50% faster / 80% less edit time.

**Key Benefits (4 cards):**
1. FileText → "50% Faster Documentation"
2. Refresh → "80% Less Update Time"
3. Search → "Searchable Legacy Docs"
4. Shield → "Defence-Grade Standards"

**How It Works (4 steps):**
1. Embed with Project Teams
2. Develop Support Concepts
3. Produce Technical Publications
4. Transform with WISDOM

**Use Cases:** Through-life support, AIS development, legacy doc modernization, multi-vendor support

**Features:** AIS concepts, operational manuals, ILS planning, supply chain analysis, WISDOM-powered publications, training aligned to Defence standards

**CTA:** "Ready to make your systems supportable?"

- [ ] **Step 3: Verify and commit**

```bash
git add products/ils.html
git commit -m "feat: add Integrated Logistics Support service page"
```

---

## Task 1: Replace Text Logo with Image Logo

**Files:**
- Modify: `shared.css` (Lines 214-223 — `.nav-brand` styles)
- Modify: `anywise-v5-redesign.html` (nav brand, footer brand, **AND inline .nav-brand CSS at lines 375-384**)
- Modify: ALL 8 product pages, 2 blog pages, 1 engage page (14 total)

**Logo file:** `assets/Anywise_Logo.png` (green "anywise" wordmark on transparent background)

- [ ] **Step 1: Update shared.css `.nav-brand` styles for image logo**

In `shared.css`, find the `.nav-brand` block (around lines 214-223) and replace:

```css
/* FIND THIS: */
.nav-brand {
  font-family: var(--font);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--white);
  letter-spacing: -0.02em;
  text-decoration: none;
  transition: color var(--transition);
}
.nav-brand span { color: var(--accent); }

/* REPLACE WITH: */
.nav-brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
.nav-brand img {
  height: 1.6rem;
  width: auto;
  display: block;
}
```

- [ ] **Step 2: CRITICAL — Remove inline .nav-brand CSS in `anywise-v5-redesign.html`**

**This inline CSS will override shared.css if not removed.**

Find in `anywise-v5-redesign.html` (around lines 375-384):
```css
.nav-brand {
  font-family: var(--font);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--white);
  letter-spacing: -0.02em;
  text-decoration: none;
  transition: color var(--transition);
}
.nav-brand span {
  color: var(--accent);
}
```

**DELETE both rules entirely.** The shared.css styles will now apply.

- [ ] **Step 3: Update nav brand HTML in `anywise-v5-redesign.html`**

Nav (around line 1560):
```html
<!-- FIND: -->
<a href="/" class="nav-brand">any<span>wise</span></a>
<!-- REPLACE WITH: -->
<a href="/" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
```

Footer (around line 1954-1956):
```html
<!-- FIND: -->
<a href="/" class="nav-brand" style="font-size:1.15rem;">any<span>wise</span></a>
<!-- REPLACE WITH: -->
<a href="/" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
```

- [ ] **Step 4: Update nav brand in ALL product pages (8 total)**

For each of: `products/wisdom.html`, `products/engaide.html`, `products/fabhums.html`, `products/campaide.html`, `products/aide.html`, `products/index.html`, **`products/fraud-analytics.html`**, **`products/impact-framework.html`**, **`products/ils.html`**

Find (appears twice — nav and footer):
```html
<a href="../anywise-v5-redesign.html" class="nav-brand">any<span>wise</span></a>
```
Replace with:
```html
<a href="../anywise-v5-redesign.html" class="nav-brand"><img src="../assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
```

For footer instances with `style="font-size:1.15rem;"`:
```html
<a href="../anywise-v5-redesign.html" class="nav-brand"><img src="../assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
```

- [ ] **Step 5: Update nav brand in blog and engage pages**

`blog/index.html`, `blog/post.html`, `engage/index.html` — same pattern with `../` relative paths.

- [ ] **Step 6: Verify logo renders on every page in both themes**

- [ ] **Step 7: Commit**

```bash
git add shared.css anywise-v5-redesign.html products/*.html blog/*.html engage/index.html
git commit -m "feat: replace text logo with Anywise image wordmark across all pages"
```

---

## Task 2: Update Favicon

**Files:**
- Use: `favicon-96x96.png` (96×96 "any." mark)
- Modify: All HTML pages

- [ ] **Step 1: Generate smaller favicon sizes**

```bash
cd /Users/chrisdennis/Documents/GitHub/Anywise-Website
sips -z 32 32 favicon-96x96.png --out favicon-32.png
sips -z 16 16 favicon-96x96.png --out favicon-16.png
cp favicon-96x96.png apple-touch-icon.png
```

- [ ] **Step 2: Remove old SVG favicon if it exists**

```bash
rm -f favicon.svg
```

- [ ] **Step 3: Update favicon link tags in `anywise-v5-redesign.html`**

Replace existing favicon links in `<head>`:
```html
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
```

- [ ] **Step 4: Update ALL sub-pages (products/, blog/, engage/)**

Find any existing favicon `<link>` tag(s) and replace with the full set using `../` paths:
```html
<link rel="icon" type="image/png" sizes="96x96" href="../favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
```

**NOTE:** Some sub-pages may only have ONE favicon line (e.g. `products/index.html` only has the SVG link). Replace that one line with all four lines above.

- [ ] **Step 5: Verify favicon and commit**

```bash
git add favicon-96x96.png favicon-32.png favicon-16.png apple-touch-icon.png anywise-v5-redesign.html products/*.html blog/*.html engage/index.html
git commit -m "feat: update favicon to official Anywise 'any.' mark"
```

---

## Task 6: Update Products & Services Index Page

**Files:**
- Modify: `products/index.html`

- [ ] **Step 1: Update `<title>` tag**

```html
<!-- FIND: -->
<title>Products & Technology | Anywise</title>
<!-- REPLACE: -->
<title>Products & Services | Anywise</title>
```

- [ ] **Step 2: Update `<meta name="description">`**

```html
<!-- FIND: -->
<meta name="description" content="Sovereign, Australian-designed intelligence platforms for defence and government. WISDOM, ENG|AIDE, FABHUMS, CAMP|AIDE, AIDE.">
<!-- REPLACE: -->
<meta name="description" content="Sovereign, Australian-designed intelligence platforms and services for defence and government. WISDOM, ENG|AIDE, Fraud & Analytics, Impact Measurement, FABHUMS, CAMP|AIDE, ILS, AIDE.">
```

- [ ] **Step 3: Update the hero section copy**

```html
<!-- FIND: -->
<span class="label">Products &amp; Technology</span>
<h1>Sovereign, Australian-designed<br>intelligence platforms.</h1>
<p>Five purpose-built platforms that transform operational complexity into actionable intelligence — for defence, government, and industry.</p>

<!-- REPLACE WITH: -->
<span class="label">Products &amp; Services</span>
<h1>Sovereign, Australian-designed<br>intelligence platforms and services.</h1>
<p>Eight purpose-built platforms and specialist services that transform operational complexity into actionable intelligence — for defence, government, and industry.</p>
```

Also update the breadcrumb: `<span>Products</span>` → `<span>Products &amp; Services</span>`

- [ ] **Step 4: Add CSS for middle row**

Add to the `<style>` block in `products/index.html`:
```css
.prod-grid-mid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
@media (max-width: 900px) { .prod-grid-mid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .prod-grid-mid { grid-template-columns: 1fr; } }
```

Update `.prod-grid-bottom` to center 2 items:
```css
.prod-grid-bottom { max-width: 66.666%; margin: 0 auto; }
@media (max-width: 900px) { .prod-grid-bottom { max-width: 100%; } }
```

- [ ] **Step 5: Replace grid HTML with 3-3-2 layout (8 items)**

**Row 1 (`prod-grid-top`):** WISDOM, ENG|AIDE, Fraud & Analytics
**Row 2 (`prod-grid-mid`):** Impact Framework, FABHUMS, CAMP|AIDE
**Row 3 (`prod-grid-bottom`):** ILS, AIDE (centered)

Each card follows the existing `.prod-card` pattern. Use real images where available:
- WISDOM: `../assets/images/products%20%26%20services/WISDOM.png`
- ENG|AIDE: `../assets/images/products%20%26%20services/ENG_AIDE_Tablet.png`
- FABHUMS: `../assets/images/products%20%26%20services/FABHUMS-Lite.jpeg`
- ILS: `../assets/images/products%20%26%20services/FABHUMS_Training.jpg`
- Fraud, Impact, CAMP|AIDE, AIDE: SVG placeholder icons

Links: `fraud-analytics.html`, `impact-framework.html`, `ils.html`, etc.

- [ ] **Step 6: Verify and commit**

```bash
git add products/index.html
git commit -m "feat: expand products index to 8-item Products & Services page with 3-3-2 grid"
```

---

## Task 7: Update Landing Page Featured Products

**Files:**
- Modify: `anywise-v5-redesign.html` (products section, ~lines 1732-1803)

**New featured 5:**
- Row 1 (`.product-grid`, 3): WISDOM, ENG|AIDE, Fraud & Analytics
- Row 2 (`.product-grid-bottom`, 2): Impact Measurement, FABHUMS

- [ ] **Step 1: Update section heading**

```html
<!-- FIND: -->
<p class="label">Products &amp; Technology</p>
<!-- REPLACE: -->
<p class="label">Products &amp; Services</p>
```

- [ ] **Step 2: Replace product grid cards**

Replace all 5 cards. Use real images for WISDOM, ENG|AIDE, FABHUMS. SVG placeholders for Fraud and Impact.

Image paths use: `./assets/images/products%20%26%20services/` prefix.

Card links: `products/wisdom.html`, `products/engaide.html`, `products/fraud-analytics.html`, `products/impact-framework.html`, `products/fabhums.html`

- [ ] **Step 3: Update "View All" link if present**

Change text to "View all products & services".

- [ ] **Step 4: Verify and commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: update landing page to feature 5 products & services with new images"
```

---

## Task 8: Update Product Detail Page Hero Images

**Files:**
- Modify: `products/wisdom.html`, `products/engaide.html`, `products/fabhums.html`

- [ ] **Step 1: Replace SVG placeholder hero images with real images**

**WISDOM:** `../assets/images/products%20%26%20services/WISDOM.png`
**ENG|AIDE:** `../assets/images/products%20%26%20services/ENG_AIDE_Tablet.png`
**FABHUMS:** `../assets/images/products%20%26%20services/FABHUMS-Lite.jpeg`

Pattern:
```html
<div class="prod-hero-img reveal-scale">
  <img src="../assets/images/products%20%26%20services/WISDOM.png" alt="WISDOM interface showing annotated technical document analysis" style="width:100%;height:auto;border-radius:var(--radius-lg);">
</div>
```

- [ ] **Step 2: Verify and commit**

```bash
git add products/wisdom.html products/engaide.html products/fabhums.html
git commit -m "feat: update product detail page hero images with real assets"
```

---

## Task 9: Update Nav, Footer, Breadcrumbs, and shared.js Modal

**Files:**
- Modify: All 14 HTML pages + `shared.js`

- [ ] **Step 1: Update nav "Products" link text on ALL pages**

Find in every page's `<nav>`:
```html
>Products</a>
```
Replace with:
```html
>Products &amp; Services</a>
```

**All 14 files:** `anywise-v5-redesign.html`, all 8 product pages, 2 blog pages, `engage/index.html`

- [ ] **Step 2: Update breadcrumb "Products" link on ALL product detail pages**

In each of the 8 product detail pages, find:
```html
<a href="index.html">Products</a>
```
Replace with:
```html
<a href="index.html">Products &amp; Services</a>
```

- [ ] **Step 3: Update footer product links on product detail pages**

Find the footer product column in each product detail page:
```html
<h4>Products</h4>
<a href="wisdom.html">WISDOM</a>
<a href="engaide.html">ENG|AIDE</a>
<a href="fabhums.html">FABHUMS</a>
<a href="campaide.html">CAMP|AIDE</a>
<a href="aide.html">AIDE</a>
```

Replace with:
```html
<h4>Products &amp; Services</h4>
<a href="wisdom.html">WISDOM</a>
<a href="engaide.html">ENG|AIDE</a>
<a href="fraud-analytics.html">Fraud &amp; Analytics</a>
<a href="impact-framework.html">Impact Measurement</a>
<a href="fabhums.html">FABHUMS</a>
<a href="campaide.html">CAMP|AIDE</a>
<a href="ils.html">ILS</a>
<a href="aide.html">AIDE</a>
```

Apply to ALL 8 product detail pages.

- [ ] **Step 4: Update "All Products" AND "View All Products" button text**

In each product detail page, find BOTH of these (they appear in different sections):
```html
>All Products</a>
>View All Products</a>
```
Replace with:
```html
>All Products &amp; Services</a>
>View All Products &amp; Services</a>
```

- [ ] **Step 5: CRITICAL — Update shared.js engage modal product dropdown**

In `shared.js`, find the product dropdown (around lines 219-227):
```html
<option value="" disabled selected>Select a product…</option>
<option value="WISDOM">WISDOM</option>
<option value="ENG|AIDE">ENG|AIDE</option>
<option value="FABHUMS">FABHUMS</option>
<option value="CAMP|AIDE">CAMP|AIDE</option>
<option value="AIDE">AIDE</option>
<option value="other">Other</option>
```

Replace with:
```html
<option value="" disabled selected>Select a product or service…</option>
<option value="WISDOM">WISDOM</option>
<option value="ENG|AIDE">ENG|AIDE</option>
<option value="Fraud Analytics">Fraud Detection &amp; Compliance Analytics</option>
<option value="Impact Framework">Impact Measurement &amp; Reporting</option>
<option value="FABHUMS">FABHUMS</option>
<option value="CAMP|AIDE">CAMP|AIDE</option>
<option value="ILS">Integrated Logistics Support</option>
<option value="AIDE">AIDE</option>
<option value="other">Other</option>
```

Also update the label from "Which product?" to "Which product or service?":
```html
<label for="engProduct">Which product or service? <span aria-hidden="true">*</span></label>
```

- [ ] **Step 6: Verify all links work and commit**

```bash
git add anywise-v5-redesign.html products/*.html blog/*.html engage/index.html shared.js
git commit -m "feat: update nav, footer, breadcrumbs and engage modal to Products & Services across all pages"
```

---

## Task 10: Update Open Graph & Twitter Card Meta Tags

**Files:**
- Modify: All HTML pages

**OG Image file:** `assets/OG.jpeg` (JPEG format — NOT PNG)

- [ ] **Step 1: Copy OG image to root for canonical URL**

```bash
cp assets/OG.jpeg og-image.jpg
```

- [ ] **Step 2: Update OG meta tags on main page**

In `anywise-v5-redesign.html`, update the existing OG block. Key changes:
- `og:image` → `https://www.anywise.com.au/og-image.jpg`
- `og:image:type` → `image/jpeg` (NOT image/png)
- `twitter:image` → same URL

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Anywise | Ethical Technology and Services">
<meta property="og:description" content="Decision augmentation for defence and government. Anywise delivers intelligent technology and agile services. Wholly Australian-owned, B Corp certified.">
<meta property="og:image" content="https://www.anywise.com.au/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:url" content="https://www.anywise.com.au">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anywise | Ethical Technology and Services">
<meta name="twitter:description" content="Decision augmentation for defence and government. Anywise delivers intelligent technology and agile services.">
<meta name="twitter:image" content="https://www.anywise.com.au/og-image.jpg">
```

- [ ] **Step 3: Add OG tags to each product/service page**

Add after `<meta name="description">` in `<head>`. Per-page titles:

| Page | og:title |
|------|----------|
| wisdom.html | WISDOM — Strategic Intelligence \| Anywise |
| engaide.html | ENG\|AIDE — Engineering Intelligence \| Anywise |
| fabhums.html | FABHUMS — Health & Usage Monitoring \| Anywise |
| campaide.html | CAMP\|AIDE — Facilities Intelligence \| Anywise |
| aide.html | AIDE — Enterprise Intelligence \| Anywise |
| fraud-analytics.html | Fraud Detection & Compliance Analytics \| Anywise |
| impact-framework.html | Impact Measurement & Reporting \| Anywise |
| ils.html | Integrated Logistics Support \| Anywise |

Use each page's `<meta name="description">` content for `og:description`.
All pages share the same `og:image` URL: `https://www.anywise.com.au/og-image.jpg`
All use `og:image:type` = `image/jpeg`

- [ ] **Step 4: Add OG tags to index, blog, engage pages**

- `products/index.html` — "Products & Services | Anywise"
- `blog/index.html` — "Insights | Anywise"
- `engage/index.html` — "Engage Us | Anywise"

- [ ] **Step 5: Commit**

```bash
git add og-image.jpg anywise-v5-redesign.html products/*.html blog/*.html engage/index.html
git commit -m "feat: add Open Graph and Twitter Card meta tags to all pages"
```

---

## Execution Checklist

After all tasks are complete, verify:

- [ ] Logo image renders on every page (nav + footer) in both dark and light modes
- [ ] Favicon shows "any." mark in browser tab
- [ ] Landing page shows 5 featured products & services (3+2)
- [ ] Products & Services index shows 8 items (3-3-2)
- [ ] All 3 new service pages render correctly with full content
- [ ] All nav links say "Products & Services" and work
- [ ] All breadcrumbs say "Products & Services" on detail pages
- [ ] All footer product links include the 3 new services
- [ ] Engage Us modal dropdown includes 3 new services
- [ ] OG meta tags present on all pages with correct JPEG type
- [ ] No broken images or 404s
- [ ] Mobile responsive layout works for all new/changed sections
- [ ] Engage Us modal opens from every page
