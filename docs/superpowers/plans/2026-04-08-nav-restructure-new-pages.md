# Nav Restructure, New Pages & Section Navigation Links — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the site nav to link to separate pages (removing all homepage anchor links), add section navigation links to the homepage, create two new pages (`philanthropy.html`, `team.html`), add a Philanthropy section to the homepage, and update all footers.

**Architecture:** This is a static HTML/CSS/JS site. Changes are made by directly editing `.html` files and the shared `shared.css`. There is no build system — save the file and it's live. All pages share a common nav and footer pattern; `shared.css` provides global tokens and component styles. New CSS classes go in `shared.css` at the end of the relevant section.

**Tech Stack:** Vanilla HTML5, CSS custom properties (design tokens), vanilla JS. No frameworks, no bundlers. All pages reference `shared.css` and `shared.js` (root pages: bare path; subdirectory pages: `../` prefix).

**Spec:** `docs/superpowers/specs/2026-04-08-nav-restructure-new-pages-design.md`

---

## File Map

| File | Action | What changes |
|---|---|---|
| `shared.css` | Modify | Add `.section-nav-link` style; update `.footer-grid` to 3-column |
| `index.html` | Modify | Nav, footer, section ID rename, scroll-tracking JS, Philanthropy section, 4 section-nav-links |
| `philanthropy.html` | Create | New root-level page |
| `team.html` | Create | New root-level page |
| `sitemap.xml` | Modify | Add 2 new URLs |
| All 19 other live pages | Modify | Nav HTML + footer HTML (nav and footer only, no content changes) |

**Other live pages (nav + footer update only):**
- `contact.html`
- `privacy.html`
- `terms.html`
- `engage/index.html`
- `blog/index.html`
- `blog/post.html`
- `blog/commitment-to-ethical-quality-business.html`
- `blog/dcsp-catalyst-for-real-change.html`
- `blog/transforming-operational-challenges.html`
- `blog/vicworx-preparing-for-lift-off.html`
- `products/index.html`
- `products/aide.html`
- `products/campaide.html`
- `products/engaide.html`
- `products/fabhums.html`
- `products/fraud-analytics.html`
- `products/ils.html`
- `products/impact-framework.html`
- `products/wisdom.html`

---

## Nav HTML Reference

Use these exact nav blocks when updating each page. The only difference between pages is (a) path prefix and (b) which link has `class="active"`.

### Root-level nav (bare paths — index.html, contact.html, privacy.html, terms.html, philanthropy.html, team.html)

```html
<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="philanthropy.html">Philanthropy</a></li>
      <li><a href="team.html">Anywise Team</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="contact.html">Contact</a></li>
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

**Active class per root page:**
- `index.html` — no active class on any link
- `contact.html` — add `class="active"` to the Contact `<a>`
- `privacy.html` — no active class
- `terms.html` — no active class
- `philanthropy.html` — add `class="active"` to the Philanthropy `<a>`
- `team.html` — add `class="active"` to the Anywise Team `<a>`

### Subdirectory nav (`../` prefix — all blog/*, products/*, engage/*)

```html
<nav id="nav">
  <div class="container">
    <a href="../index.html" class="nav-brand"><img src="../assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../products/index.html">Products &amp; Services</a></li>
      <li><a href="../philanthropy.html">Philanthropy</a></li>
      <li><a href="../team.html">Anywise Team</a></li>
      <li><a href="../blog/index.html">Insights</a></li>
      <li><a href="../contact.html">Contact</a></li>
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

**Active class per subdirectory page:**
- `blog/index.html`, `blog/post.html`, `blog/*.html` — `class="active"` on the Insights `<a>`
- `products/index.html`, `products/*.html` — `class="active"` on the Products & Services `<a>`
- `engage/index.html` — no active class

---

## Footer HTML Reference

### Root-level footer (bare paths)

```html
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned</p>
      </div>
      <div class="footer-col">
        <h4>Products &amp; Services</h4>
        <a href="products/wisdom.html">WISDOM</a>
        <a href="products/engaide.html">ENG|AIDE</a>
        <a href="products/fraud-analytics.html">Fraud &amp; Analytics</a>
        <a href="products/impact-framework.html">Impact Measurement</a>
        <a href="products/fabhums.html">FABHUMS</a>
        <a href="products/campaide.html">CAMP|AIDE</a>
        <a href="products/ils.html">ILS</a>
        <a href="products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="team.html">Anywise Team</a>
        <a href="philanthropy.html">Philanthropy</a>
        <a href="blog/index.html">Insights</a>
        <a href="contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="copyrightYear">2026</span> Anywise Pty Ltd. All rights reserved. ABN 86 169 092 960.</p>
      <div class="footer-locations">
        <a href="contact.html">Melbourne</a>
        <a href="contact.html">Sydney</a>
        <a href="contact.html">Brisbane</a>
        <a href="contact.html">Perth</a>
        <a href="contact.html">Canberra</a>
      </div>
    </div>
    <div class="acknowledgement">
      Anywise accepts the invitation of the Uluru Statement from the Heart and supports a First Nations Voice to Parliament enshrined in the Australian Constitution.
      <a href="https://ulurustatement.org" style="color: var(--text-tertiary); text-decoration: underline;">UluruStatement.org</a><br>
      Anywise acknowledges the Traditional Owners of the land on which we operate. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>
```

### Subdirectory footer (`../` prefix)

Same structure but replace all bare paths with `../` prefix:
- `assets/Anywise_Logo.png` → `../assets/Anywise_Logo.png`
- `index.html` → `../index.html`
- `products/wisdom.html` → `../products/wisdom.html` (etc. for all product links)
- `team.html` → `../team.html`
- `philanthropy.html` → `../philanthropy.html`
- `blog/index.html` → `../blog/index.html`
- `contact.html` → `../contact.html`
- `privacy.html` → `../privacy.html`
- `terms.html` → `../terms.html`

---

## Task 1: Add `.section-nav-link` to shared.css and update footer grid

**Files:**
- Modify: `shared.css`

- [ ] **Step 1: Add `.section-nav-link` CSS**

Open `shared.css`. Find the line `/* ═══ SCROLL TO TOP ═══ */` (near end of file). Insert the following block immediately before it:

```css
/* ═══ SECTION NAV LINK ═══ */
.section-nav-link {
  color: var(--accent);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap var(--transition);
  align-self: flex-end;
  padding-bottom: 0.1rem;
}
.section-nav-link:hover {
  gap: 0.5rem;
}
```

- [ ] **Step 2: Update `.footer-grid` to 3 columns**

In `shared.css`, find:
```css
.footer-grid {
  display: grid;
  grid-template-columns: 2.2fr 1fr 1fr 1fr;
```

Replace with:
```css
.footer-grid {
  display: grid;
  grid-template-columns: 2.2fr 1fr 1fr;
```

Also find the tablet media query in `shared.css` (around `@media (max-width: 1024px)`) that has:
```css
  .footer-grid { grid-template-columns: 1fr 1fr; }
```
This stays as-is — 2-column at tablet is still correct with 3 total columns.

- [ ] **Step 3: Commit**

```bash
git add shared.css
git commit -m "feat: add section-nav-link styles, update footer grid to 3 columns"
```

---

## Task 2: Update index.html — nav, scroll-tracking JS, section ID, footer

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the nav block**

In `index.html`, find the entire `<nav id="nav">...</nav>` block (lines ~1581–1598). Replace it with the root-level nav from the **Nav HTML Reference** above. No `class="active"` on any link for the homepage.

- [ ] **Step 2: Rename section id="about" to id="team"**

Find:
```html
<section class="team" id="about">
```
Replace with:
```html
<section class="team" id="team">
```

- [ ] **Step 3: Update the scroll-tracking JS**

Find this block (around line 2070):
```js
  // Active nav link
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (sy >= top) current = section.getAttribute('id');
  });
  navLinksAll.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
```

Replace with:
```js
  // Active nav link — nav uses page links only, no anchor-based highlighting on homepage
```

Also remove any variable declarations that are now unused. Find these lines (around line 2032) and remove them:
```js
const sections = document.querySelectorAll('section[id]');
```
and:
```js
const navLinksAll = document.querySelectorAll('.nav-links a');
```
(Search for these exact strings — remove only if they exist and are not used elsewhere in the script.)

- [ ] **Step 4: Update the footer**

Find the entire `<footer>...</footer>` block in `index.html`. Replace it with the **root-level footer** from the Footer HTML Reference above.

- [ ] **Step 5: Verify in browser**

Open `index.html` in a browser (or with a local server). Confirm:
- Nav shows: Products & Services · Philanthropy · Anywise Team · Insights · Contact · Engage Us
- Footer shows 3 columns: brand | Products & Services | Company
- No JS console errors

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: update homepage nav, footer, section id rename, remove anchor scroll-tracking"
```

---

## Task 3: Add section navigation links and Philanthropy section to index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add section-nav-link to Products & Services section header**

Find in `index.html`:
```html
    <div class="products-head reveal">
      <div>
        <p class="label">Products &amp; Services</p>
        <h2>Sovereign, Australian-designed intelligence platforms.</h2>
      </div>
      <p>Our products combine...
```

Replace with:
```html
    <div class="products-head reveal" style="display:flex; justify-content:space-between; align-items:flex-end; gap:1rem;">
      <div>
        <p class="label">Products &amp; Services</p>
        <h2>Sovereign, Australian-designed intelligence platforms.</h2>
      </div>
      <a href="products/index.html" class="section-nav-link">View all Products &amp; Services &rarr;</a>
    </div>
    <p style="margin-bottom:2rem;">Our products combine...
```

Note: the `<p>` description paragraph that was inside the `.products-head` div gets moved outside it (still inside `.container`) so the flex row is clean. Check the actual closing structure carefully before editing.

- [ ] **Step 2: Add section-nav-link to Anywise Team section header**

Find:
```html
<section class="team" id="team">
  <div class="container">
    <div class="team-grid">
      <div class="reveal-left">
        <p class="label">Our People</p>
        <h2>any.<em>one</em> is welcome</h2>
        <p class="team-sub">The Anywise Team</p>
```

Replace:
```html
<section class="team" id="team">
  <div class="container">
    <div class="section-head-row reveal" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem;">
      <div>
        <p class="label">Our People</p>
        <h2 style="margin-bottom:0;">any.<em>one</em> is welcome</h2>
      </div>
      <a href="team.html" class="section-nav-link">Meet the Anywise team &rarr;</a>
    </div>
    <div class="team-grid">
      <div class="reveal-left">
        <p class="team-sub">The Anywise Team</p>
```

- [ ] **Step 3: Add section-nav-link to News (Insights) section header**

Find:
```html
    <div class="news-head reveal">
      <div>
        <p class="label">Latest Insights</p>
        <h2>any.news</h2>
      </div>
    </div>
```

Replace with:
```html
    <div class="news-head reveal" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem;">
      <div>
        <p class="label">Latest Insights</p>
        <h2>any.news</h2>
      </div>
      <a href="blog/index.html" class="section-nav-link">View all Insights &rarr;</a>
    </div>
```

- [ ] **Step 4: Add the Philanthropy homepage section**

Find the comment line that marks the end of the products section and the start of the next section (look for `<!-- ═══` comment or the `<div class="section-divider">` between products and team). Insert the following block immediately after the Products & Services section closes and before the Team section:

```html
<!-- ═══ PHILANTHROPY ═══ -->
<div class="section-divider"></div>
<section class="philanthropy-section" id="philanthropy">
  <div class="container">
    <div class="philanthropy-inner">
      <div class="philanthropy-left reveal-left">
        <p class="label">Philanthropy</p>
        <h2>Business as a force for good.</h2>
        <p>Anywise believes that building sovereign capability and giving back to community are not competing priorities — they are the same mission. We invest in the people, places, and planet that make Australia worth protecting.</p>
        <a href="philanthropy.html" class="section-nav-link" style="margin-top:0.5rem;">Learn more about our giving &rarr;</a>
      </div>
      <div class="philanthropy-pillars reveal-right">
        <div class="pillar-card">
          <p class="pillar-label">Community</p>
          <h3>People and place</h3>
          <p>Supporting First Nations communities, local employment, and social enterprise. We believe business has a responsibility to the communities it operates in.</p>
        </div>
        <div class="pillar-card">
          <p class="pillar-label">Environment</p>
          <h3>A sustainable future</h3>
          <p>Reducing our footprint and partnering with organisations working on climate and conservation. Ethical technology includes environmental stewardship.</p>
        </div>
        <div class="pillar-card">
          <p class="pillar-label">Education</p>
          <h3>Access and opportunity</h3>
          <p>Investing in STEM pathways, scholarships, and digital inclusion programs. We open doors for the next generation of Australian innovators.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Add Philanthropy section styles to index.html inline `<style>`**

In `index.html`, find the inline `<style>` block in the `<head>`. Append these styles to the end of it:

```css
/* ── Philanthropy section ── */
.philanthropy-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}
.philanthropy-left h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin-bottom: 1rem;
}
.philanthropy-left p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1rem;
}
.philanthropy-pillars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.pillar-card {
  background: var(--bg-card);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}
.pillar-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.4rem;
}
.pillar-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}
.pillar-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}
@media (max-width: 900px) {
  .philanthropy-inner { grid-template-columns: 1fr; gap: 2rem; }
}
```

- [ ] **Step 6: Add section-nav-link to Philanthropy section header**

The section-nav-link for Philanthropy is already inline in the HTML added in Step 4 (`<a href="philanthropy.html" class="section-nav-link" ...>`). No additional step needed.

- [ ] **Step 7: Verify in browser**

Open `index.html`. Confirm:
- Philanthropy section appears between Products & Services and the Team section
- Three pillar cards render correctly in both light and dark mode
- Section nav links appear flush-right in Products & Services, Team, News headers
- Philanthropy section nav link appears below the intro paragraph

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "feat: add philanthropy section and section-nav-links to homepage"
```

---

## Task 4: Create philanthropy.html

**Files:**
- Create: `philanthropy.html`

- [ ] **Step 1: Create the file with this exact content**

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Philanthropy — Business as a Force for Good | Anywise</title>
  <meta name="description" content="Anywise invests in community, environment, and education. Learn how we use business as a force for good across Australia.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Philanthropy | Anywise">
  <meta property="og:description" content="Anywise invests in community, environment, and education. Learn how we use business as a force for good across Australia.">
  <meta property="og:image" content="https://anywise.com.au/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Philanthropy | Anywise">
  <meta name="twitter:description" content="Anywise invests in community, environment, and education. Learn how we use business as a force for good across Australia.">
  <meta name="twitter:image" content="https://anywise.com.au/og-image.png">
  <link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
  <meta name="theme-color" content="#0e110e">
  <link rel="canonical" href="https://anywise.com.au/philanthropy.html">
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .phil-hero { padding: 8rem 0 4rem; border-bottom: 1px solid var(--border); }
    .phil-page { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--text-tertiary); margin-bottom: 2rem; }
    .breadcrumb a { color: var(--text-tertiary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--accent); }
    .breadcrumb span { color: var(--text-tertiary); }
    .phil-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .phil-tag { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; }
    .phil-hero-content h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1.25rem; }
    .phil-tagline { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; }
    .phil-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .phil-hero-visual { display: flex; align-items: center; justify-content: center; }
    .phil-hero-icon { width: 220px; height: 220px; border-radius: 50%; border: 2px solid var(--border-accent); background: var(--bg-card); display: flex; align-items: center; justify-content: center; }
    .phil-hero-icon svg { width: 80px; height: 80px; color: var(--accent); }

    .phil-section { padding: 5rem 0; border-bottom: 1px solid var(--border); }
    .phil-section:last-of-type { border-bottom: none; }

    .philosophy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
    .philosophy-left h2 { font-size: clamp(1.5rem, 2.5vw, 2rem); margin-bottom: 1.5rem; }
    .philosophy-left p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 1rem; }
    .pull-quote { background: var(--bg-card); border-left: 3px solid var(--accent); border-radius: var(--radius-lg); padding: 2.5rem; }
    .pull-quote blockquote { font-size: 1.25rem; font-weight: 600; line-height: 1.5; color: var(--text-primary); font-style: italic; margin: 0; }

    .pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
    .pillar-full-card { background: var(--bg-card); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: 2rem; }
    .pillar-full-card .pillar-icon { width: 2.5rem; height: 2.5rem; color: var(--accent); margin-bottom: 1rem; }
    .pillar-full-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.5rem; }
    .pillar-full-card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; }
    .pillar-full-card p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; margin: 0; }

    .phil-cta { text-align: center; padding: 5rem 0; }
    .phil-cta h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); margin-bottom: 1rem; }
    .phil-cta p { color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 2rem; }

    @media (max-width: 900px) {
      .phil-hero-inner { grid-template-columns: 1fr; }
      .phil-hero-visual { display: none; }
      .philosophy-grid { grid-template-columns: 1fr; }
      .pillars-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<a href="#main" class="skip-link">Skip to main content</a>

<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="philanthropy.html" class="active">Philanthropy</a></li>
      <li><a href="team.html">Anywise Team</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light/dark mode">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      <span class="close-x">&times;</span>
    </button>
  </div>
</nav>

<main id="main">

  <!-- ═══ HERO ═══ -->
  <section class="phil-hero">
    <div class="phil-page">
      <div class="breadcrumb">
        <a href="index.html">Home</a>
        <span>/</span>
        <span>Philanthropy</span>
      </div>
      <div class="phil-hero-inner">
        <div class="phil-hero-content reveal">
          <div class="phil-tag">Philanthropy</div>
          <h1>Business as a force for good.</h1>
          <p class="phil-tagline">Anywise believes that building sovereign capability and giving back to community are not competing priorities — they are the same mission. We invest in the people, places, and planet that make Australia worth protecting.</p>
          <div class="phil-hero-actions">
            <a href="#" class="btn btn-accent" data-engage aria-haspopup="dialog"><span>Engage Us &rarr;</span></a>
            <a href="products/index.html" class="btn btn-ghost">Our Products &amp; Services</a>
          </div>
        </div>
        <div class="phil-hero-visual reveal-scale">
          <div class="phil-hero-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.403 4.218 1 7.5 1c1.849 0 3.562.755 4.5 2.02C12.938 1.755 14.65 1 16.5 1 19.782 1 23 3.403 23 7.191c0 4.105-5.37 8.863-11 14.402z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ PHILOSOPHY ═══ -->
  <section class="phil-section">
    <div class="phil-page">
      <div class="philosophy-grid">
        <div class="philosophy-left reveal-left">
          <h2>Why we give.</h2>
          <p>From our founding, Anywise has been committed to the idea that a business can be both commercially excellent and genuinely good for the world. We hold B Corp Certification not as a marketing badge, but as a binding commitment to people and planet alongside profit.</p>
          <p>Sovereign capability means nothing if it isn't rooted in a society worth defending. That's why our giving is not a separate program — it's built into how we plan, budget, and operate. A percentage of every engagement funds our three giving pillars.</p>
          <p>We believe the best technology companies are also the most ethical ones. Our philanthropy is where we put that belief into practice.</p>
        </div>
        <div class="reveal-right">
          <div class="pull-quote">
            <blockquote>"Profit with purpose isn't a tagline. It's how we write our budgets."</blockquote>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ THREE PILLARS ═══ -->
  <section class="phil-section">
    <div class="phil-page">
      <div class="reveal">
        <p class="label">Our Giving Pillars</p>
        <h2>Where we invest.</h2>
      </div>
      <div class="pillars-grid">
        <div class="pillar-full-card reveal">
          <svg class="pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p class="pillar-full-label">Community</p>
          <h3>People and place</h3>
          <p>Supporting First Nations communities, local employment, and social enterprise across Australia. We partner with organisations creating genuine economic inclusion and cultural continuity.</p>
        </div>
        <div class="pillar-full-card reveal">
          <svg class="pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z"/>
          </svg>
          <p class="pillar-full-label">Environment</p>
          <h3>A sustainable future</h3>
          <p>Reducing our operational footprint and partnering with conservation and climate organisations. Ethical technology includes environmental stewardship — we have a responsibility to the land we work on.</p>
        </div>
        <div class="pillar-full-card reveal">
          <svg class="pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <p class="pillar-full-label">Education</p>
          <h3>Access and opportunity</h3>
          <p>Investing in STEM pathways, scholarships, and digital inclusion programs. We open doors for the next generation of Australian innovators, particularly those from underrepresented communities.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ CTA ═══ -->
  <section class="phil-section phil-cta">
    <div class="phil-page">
      <div class="reveal">
        <h2>Work with a company that gives back.</h2>
        <p>Every engagement with Anywise contributes to our giving commitments.</p>
        <a href="#" class="btn btn-primary" data-engage aria-haspopup="dialog">Engage Us &rarr;</a>
      </div>
    </div>
  </section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned</p>
      </div>
      <div class="footer-col">
        <h4>Products &amp; Services</h4>
        <a href="products/wisdom.html">WISDOM</a>
        <a href="products/engaide.html">ENG|AIDE</a>
        <a href="products/fraud-analytics.html">Fraud &amp; Analytics</a>
        <a href="products/impact-framework.html">Impact Measurement</a>
        <a href="products/fabhums.html">FABHUMS</a>
        <a href="products/campaide.html">CAMP|AIDE</a>
        <a href="products/ils.html">ILS</a>
        <a href="products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="team.html">Anywise Team</a>
        <a href="philanthropy.html">Philanthropy</a>
        <a href="blog/index.html">Insights</a>
        <a href="contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="copyrightYear">2026</span> Anywise Pty Ltd. All rights reserved. ABN 86 169 092 960.</p>
      <div class="footer-locations">
        <a href="contact.html">Melbourne</a>
        <a href="contact.html">Sydney</a>
        <a href="contact.html">Brisbane</a>
        <a href="contact.html">Perth</a>
        <a href="contact.html">Canberra</a>
      </div>
    </div>
    <div class="acknowledgement">
      Anywise accepts the invitation of the Uluru Statement from the Heart and supports a First Nations Voice to Parliament enshrined in the Australian Constitution.
      <a href="https://ulurustatement.org" style="color: var(--text-tertiary); text-decoration: underline;">UluruStatement.org</a><br>
      Anywise acknowledges the Traditional Owners of the land on which we operate. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>

<button id="scrollTopBtn" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>
<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify philanthropy.html in browser**

Open `philanthropy.html`. Check:
- Nav shows Philanthropy as active (highlighted)
- Breadcrumb: Home / Philanthropy
- Hero renders correctly in dark and light mode
- Philosophy two-column layout renders correctly
- Three pillar cards render in a row on desktop, stack on mobile
- Footer shows 3 columns

- [ ] **Step 3: Commit**

```bash
git add philanthropy.html
git commit -m "feat: create philanthropy.html page"
```

---

## Task 5: Create team.html

**Files:**
- Create: `team.html`

- [ ] **Step 1: Create the file with this exact content**

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anywise Team — any.one is welcome | Anywise</title>
  <meta name="description" content="Meet the Anywise team — defence professionals, data scientists, engineers, and community advocates united by a belief that technology should serve people.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Anywise Team | Anywise">
  <meta property="og:description" content="Meet the Anywise team — defence professionals, data scientists, engineers, and community advocates united by a belief that technology should serve people.">
  <meta property="og:image" content="https://anywise.com.au/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Anywise Team | Anywise">
  <meta name="twitter:description" content="Meet the Anywise team — defence professionals, data scientists, engineers, and community advocates united by a belief that technology should serve people.">
  <meta name="twitter:image" content="https://anywise.com.au/og-image.png">
  <link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
  <meta name="theme-color" content="#0e110e">
  <link rel="canonical" href="https://anywise.com.au/team.html">
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .team-page-hero { padding: 8rem 0 4rem; border-bottom: 1px solid var(--border); }
    .team-page { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--text-tertiary); margin-bottom: 2rem; }
    .breadcrumb a { color: var(--text-tertiary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--accent); }
    .breadcrumb span { color: var(--text-tertiary); }
    .team-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .team-tag { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; }
    .team-hero-content h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1.25rem; }
    .team-tagline { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; }
    .team-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .team-hero-visual { display: flex; align-items: center; justify-content: center; }
    .team-hero-icon { width: 220px; height: 220px; border-radius: 50%; border: 2px solid var(--border-accent); background: var(--bg-card); display: flex; align-items: center; justify-content: center; }
    .team-hero-icon svg { width: 80px; height: 80px; color: var(--accent); }

    .team-page-section { padding: 5rem 0; border-bottom: 1px solid var(--border); }
    .team-page-section:last-of-type { border-bottom: none; }

    .values-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 3rem; }
    .value-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; }
    .value-card h3 { font-size: 0.95rem; font-weight: 700; color: var(--accent); margin-bottom: 0.5rem; }
    .value-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

    .member-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
    .member-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.75rem; transition: transform var(--transition), box-shadow var(--transition); }
    .member-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
    .member-avatar { width: 4rem; height: 4rem; border-radius: 50%; border: 2px solid var(--border-accent); background: var(--bg-elevated); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; font-size: 1.1rem; font-weight: 700; color: var(--accent); }
    .member-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary); }
    .member-title { font-size: 0.825rem; color: var(--accent); margin-bottom: 0.75rem; font-weight: 500; }
    .member-bio { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

    .team-cta { text-align: center; padding: 5rem 0; }
    .team-cta h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); margin-bottom: 1rem; }
    .team-cta p { color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 2rem; }

    @media (max-width: 1024px) {
      .values-strip { grid-template-columns: repeat(2, 1fr); }
      .member-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 900px) {
      .team-hero-inner { grid-template-columns: 1fr; }
      .team-hero-visual { display: none; }
    }
    @media (max-width: 600px) {
      .member-grid { grid-template-columns: 1fr; }
      .values-strip { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<a href="#main" class="skip-link">Skip to main content</a>

<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="philanthropy.html">Philanthropy</a></li>
      <li><a href="team.html" class="active">Anywise Team</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light/dark mode">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      <span class="close-x">&times;</span>
    </button>
  </div>
</nav>

<main id="main">

  <!-- ═══ HERO ═══ -->
  <section class="team-page-hero">
    <div class="team-page">
      <div class="breadcrumb">
        <a href="index.html">Home</a>
        <span>/</span>
        <span>Anywise Team</span>
      </div>
      <div class="team-hero-inner">
        <div class="team-hero-content reveal">
          <div class="team-tag">Anywise Team</div>
          <h1>any.<strong>one</strong> is welcome.</h1>
          <p class="team-tagline">We are a team of defence professionals, data scientists, engineers, and community advocates united by a belief that technology should serve people — not the other way around.</p>
          <div class="team-hero-actions">
            <a href="#" class="btn btn-accent" data-engage aria-haspopup="dialog"><span>Engage Us &rarr;</span></a>
            <a href="philanthropy.html" class="btn btn-ghost">Learn about our giving</a>
          </div>
        </div>
        <div class="team-hero-visual reveal-scale">
          <div class="team-hero-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ VALUES STRIP ═══ -->
  <section class="team-page-section">
    <div class="team-page">
      <div class="reveal">
        <p class="label">What we stand for</p>
        <h2>Our values.</h2>
      </div>
      <div class="values-strip">
        <div class="value-card reveal">
          <h3>Ethical first</h3>
          <p>Every decision starts with what's right, not what's easy. Ethics isn't a constraint — it's our design principle.</p>
        </div>
        <div class="value-card reveal">
          <h3>Sovereign by design</h3>
          <p>Australian-built, Australian-owned, Australian-focused. We believe in capability that stays here.</p>
        </div>
        <div class="value-card reveal">
          <h3>Diverse by intent</h3>
          <p>any.one is welcome because diversity is a capability. We build teams that reflect the communities we serve.</p>
        </div>
        <div class="value-card reveal">
          <h3>Transparent always</h3>
          <p>We say what we mean and deliver what we promise. Trust is the foundation of every engagement.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ TEAM GRID ═══ -->
  <section class="team-page-section">
    <div class="team-page">
      <div class="reveal">
        <p class="label">The people behind the mission</p>
        <h2>Meet the team.</h2>
      </div>
      <div class="member-grid">
        <div class="member-card reveal">
          <div class="member-avatar">SR</div>
          <h3>Sarah Reynolds</h3>
          <p class="member-title">Chief Executive Officer</p>
          <p class="member-bio">Sarah brings 20 years of defence and public sector leadership to Anywise. She is passionate about building organisations where ethical intent and operational excellence are inseparable.</p>
        </div>
        <div class="member-card reveal">
          <div class="member-avatar">MT</div>
          <h3>Marcus Tran</h3>
          <p class="member-title">Chief Technology Officer</p>
          <p class="member-bio">Marcus leads Anywise's technology vision, with a background spanning machine learning, sovereign cloud infrastructure, and defence-grade data systems.</p>
        </div>
        <div class="member-card reveal">
          <div class="member-avatar">AK</div>
          <h3>Amara Kamara</h3>
          <p class="member-title">Head of Data Science</p>
          <p class="member-bio">Amara specialises in applied AI for complex operational environments. She holds a PhD in computational statistics and leads the analytics capability across all Anywise platforms.</p>
        </div>
        <div class="member-card reveal">
          <div class="member-avatar">JP</div>
          <h3>James Papadopoulos</h3>
          <p class="member-title">Director of Engineering</p>
          <p class="member-bio">James oversees software delivery across Anywise's product portfolio. He is a pragmatic engineer who believes simple, well-tested systems outlast clever ones.</p>
        </div>
        <div class="member-card reveal">
          <div class="member-avatar">LW</div>
          <h3>Lisa Wungthong</h3>
          <p class="member-title">Head of Delivery</p>
          <p class="member-bio">Lisa manages Anywise's government and defence engagements, ensuring every project is delivered on time, in scope, and with genuine impact for the end user community.</p>
        </div>
        <div class="member-card reveal">
          <div class="member-avatar">BN</div>
          <h3>Ben Nguyen</h3>
          <p class="member-title">Senior Intelligence Analyst</p>
          <p class="member-bio">Ben's background in strategic analysis and open-source intelligence shapes Anywise's approach to decision augmentation — keeping human judgment at the centre of every system.</p>
        </div>
        <div class="member-card reveal">
          <div class="member-avatar">FC</div>
          <h3>Fiona Clarke</h3>
          <p class="member-title">Community &amp; Philanthropy Lead</p>
          <p class="member-bio">Fiona connects Anywise's commercial activity with its giving commitments, managing partnerships across First Nations organisations, education bodies, and environmental groups.</p>
        </div>
        <div class="member-card reveal">
          <div class="member-avatar">DP</div>
          <h3>Daniel Pereira</h3>
          <p class="member-title">Principal Software Engineer</p>
          <p class="member-bio">Daniel is the technical lead on WISDOM and AIDE, with deep expertise in distributed systems and real-time data pipelines for operational environments.</p>
        </div>
        <div class="member-card reveal">
          <div class="member-avatar">RA</div>
          <h3>Rania Al-Hassan</h3>
          <p class="member-title">UX &amp; Human Factors Lead</p>
          <p class="member-bio">Rania ensures that every Anywise product is designed around the humans who use it. Her background in cognitive science and field research keeps usability front of mind.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ CTA ═══ -->
  <section class="team-page-section team-cta">
    <div class="team-page">
      <div class="reveal">
        <h2>Join the any.one community.</h2>
        <p>We're always looking for passionate people who want to make a difference.</p>
        <a href="#" class="btn btn-primary" data-engage aria-haspopup="dialog">Engage Us &rarr;</a>
      </div>
    </div>
  </section>

</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned</p>
      </div>
      <div class="footer-col">
        <h4>Products &amp; Services</h4>
        <a href="products/wisdom.html">WISDOM</a>
        <a href="products/engaide.html">ENG|AIDE</a>
        <a href="products/fraud-analytics.html">Fraud &amp; Analytics</a>
        <a href="products/impact-framework.html">Impact Measurement</a>
        <a href="products/fabhums.html">FABHUMS</a>
        <a href="products/campaide.html">CAMP|AIDE</a>
        <a href="products/ils.html">ILS</a>
        <a href="products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="team.html">Anywise Team</a>
        <a href="philanthropy.html">Philanthropy</a>
        <a href="blog/index.html">Insights</a>
        <a href="contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="copyrightYear">2026</span> Anywise Pty Ltd. All rights reserved. ABN 86 169 092 960.</p>
      <div class="footer-locations">
        <a href="contact.html">Melbourne</a>
        <a href="contact.html">Sydney</a>
        <a href="contact.html">Brisbane</a>
        <a href="contact.html">Perth</a>
        <a href="contact.html">Canberra</a>
      </div>
    </div>
    <div class="acknowledgement">
      Anywise accepts the invitation of the Uluru Statement from the Heart and supports a First Nations Voice to Parliament enshrined in the Australian Constitution.
      <a href="https://ulurustatement.org" style="color: var(--text-tertiary); text-decoration: underline;">UluruStatement.org</a><br>
      Anywise acknowledges the Traditional Owners of the land on which we operate. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>

<button id="scrollTopBtn" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>
<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify team.html in browser**

Open `team.html`. Check:
- Nav shows Anywise Team as active
- Breadcrumb: Home / Anywise Team
- Values strip shows 4 cards in a row (desktop), 2×2 (tablet), stacked (mobile)
- Team grid shows 9 cards, 3 columns (desktop), 2 (tablet), 1 (mobile)
- Footer shows 3 columns

- [ ] **Step 3: Commit**

```bash
git add team.html
git commit -m "feat: create team.html page"
```

---

## Task 6: Update nav and footer on all existing pages

**Files:** All 19 other live pages (see complete list in File Map above)

This task updates the nav and footer on every existing page. The content of each page does not change — only the nav and footer HTML blocks.

For each page, apply the correct nav (root or subdirectory, correct active class) and correct footer (root or subdirectory) from the reference sections at the top of this plan.

- [ ] **Step 1: Update root-level pages (bare paths)**

Pages: `contact.html`, `privacy.html`, `terms.html`

For each:
1. Find the `<nav id="nav">...</nav>` block and replace with the root-level nav reference
2. Set `class="active"` on Contact link for `contact.html`; no active class for `privacy.html` and `terms.html`
3. Find the `<footer>...</footer>` block and replace with the root-level footer reference

- [ ] **Step 2: Update blog pages (subdirectory, `../` prefix)**

Pages: `blog/index.html`, `blog/post.html`, `blog/commitment-to-ethical-quality-business.html`, `blog/dcsp-catalyst-for-real-change.html`, `blog/transforming-operational-challenges.html`, `blog/vicworx-preparing-for-lift-off.html`

For each:
1. Find the `<nav id="nav">...</nav>` block and replace with the subdirectory nav reference
2. Set `class="active"` on the Insights `<a>` for all blog pages
3. Find the `<footer>...</footer>` block and replace with the subdirectory footer reference

- [ ] **Step 3: Update products pages (subdirectory, `../` prefix)**

Pages: `products/index.html`, `products/aide.html`, `products/campaide.html`, `products/engaide.html`, `products/fabhums.html`, `products/fraud-analytics.html`, `products/ils.html`, `products/impact-framework.html`, `products/wisdom.html`

For each:
1. Find the `<nav id="nav">...</nav>` block and replace with the subdirectory nav reference
2. Set `class="active"` on the Products & Services `<a>` for all product pages
3. Find the `<footer>...</footer>` block and replace with the subdirectory footer reference

- [ ] **Step 4: Update template pages (housekeeping, low priority)**

Pages: `template/pages/home.html`, `template/pages/blog-index.html`, `template/pages/blog-post.html`, `template/pages/product-detail.html`, `template/pages/product-index.html`

These are internal scaffolding templates. Update their nav to match the subdirectory nav reference. No active class. No footer changes required (templates may not have full footers).

- [ ] **Step 6: Update engage/index.html (subdirectory, no active class)**

1. Find the `<nav id="nav">...</nav>` block and replace with the subdirectory nav reference
2. No active class on any link
3. Find the `<footer>...</footer>` block and replace with the subdirectory footer reference

- [ ] **Step 7: Spot-check in browser**

Open one page from each group (e.g. `contact.html`, `blog/index.html`, `products/aide.html`). Confirm:
- New nav links appear
- Correct link is highlighted active
- Footer shows 3 columns (not 4)
- No broken links to `#about`, `#capabilities`, `#approach`

- [ ] **Step 8: Commit**

```bash
git add contact.html privacy.html terms.html \
  blog/index.html blog/post.html \
  blog/commitment-to-ethical-quality-business.html \
  blog/dcsp-catalyst-for-real-change.html \
  blog/transforming-operational-challenges.html \
  blog/vicworx-preparing-for-lift-off.html \
  products/index.html products/aide.html products/campaide.html \
  products/engaide.html products/fabhums.html products/fraud-analytics.html \
  products/ils.html products/impact-framework.html products/wisdom.html \
  engage/index.html
git commit -m "feat: update nav and footer on all existing pages"
```

---

## Task 7: Update sitemap.xml

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: Add the two new URLs**

In `sitemap.xml`, find the closing `</urlset>` tag. Insert these two entries immediately before it:

```xml
  <url>
    <loc>https://anywise.com.au/philanthropy.html</loc>
    <lastmod>2026-04-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://anywise.com.au/team.html</loc>
    <lastmod>2026-04-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
```

- [ ] **Step 2: Commit**

```bash
git add sitemap.xml
git commit -m "feat: add philanthropy.html and team.html to sitemap"
```

---

## Task 8: Push to both remotes

- [ ] **Step 1: Push**

```bash
git push origin main
git push personal main
```

- [ ] **Step 2: Verify live**

Visit the deployed site. Confirm:
- Nav shows correct links on the homepage and at least one product and one blog page
- `philanthropy.html` and `team.html` load correctly
- Both pages appear in `sitemap.xml` on the deployed URL
