# Website Template Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the Anywise v5 multi-page website into a reusable template kit at `template/` that any developer or AI can copy, rebrand, and deploy without touching the design system.

**Architecture:** A CSS variable override layer separates brand tokens (`brand.css`) from the design system (`shared.css`) and behaviour (`shared.js`). Six HTML page shells contain full structural markup with `<!-- REPLACE: ... -->` comments marking all content swap points. All files render correctly out of the box with placeholder content — no build step required.

**Tech Stack:** Vanilla HTML/CSS/JS, General Sans (Fontshare), JetBrains Mono (Google Fonts), IntersectionObserver API, localStorage, fetch API (blog pages require local HTTP server)

---

## File Map

**Files to create:**

| File | Responsibility |
|---|---|
| `template/brand.css` | Brand tokens only — `:root` dark + `[data-theme="light"]` light overrides. The only file edited per project. |
| `template/shared.css` | Copy of root `shared.css` — design system, unchanged. |
| `template/shared.js` | Copy of root `shared.js` — behaviour, unchanged. |
| `template/pages/home.html` | Shell: nav, hero (globe placeholder), stats, capabilities, products grid, news cards, footer |
| `template/pages/product-index.html` | Shell: nav, hero with breadcrumb, product card grid (3+2), CTA strip, footer |
| `template/pages/product-detail.html` | Shell: nav, 6-section product page with page-level styles (~270 lines) |
| `template/pages/blog-index.html` | Shell: nav, JSON-driven editorial post list with inline JS, footer |
| `template/pages/blog-post.html` | Shell: nav, slug-driven dynamic post renderer with inline JS, footer |
| `template/pages/engage.html` | Shell: nav, standalone `.engage-standalone` contact form panel, footer |
| `template/pages/posts.json` | Sample posts.json with 1 example post showing all block types |
| `template/README.md` | Usage guide for humans and AI builders |

**Files to copy (not modify):**
- `shared.css` → `template/shared.css`
- `shared.js` → `template/shared.js`

---

## Task 1: Create brand.css with full token set

**Files:**
- Create: `template/brand.css`

- [ ] **Step 1: Create the template directory and brand.css**

```bash
mkdir -p template/pages
```

- [ ] **Step 2: Write brand.css**

Create `template/brand.css` with this exact content:

```css
/* brand.css — Brand tokens for this project.
 * This is the ONLY file you edit when rebranding.
 * Every value here is consumed by shared.css via CSS custom properties.
 *
 * AFTER EDITING TOKENS: also update the 6 hardcoded rgba values in shared.css
 * that are derived from --bg and --bg-deep (see README.md for the full table).
 */

/* ─── Dark mode (default) ─── */
:root {
  /* Brand palette */
  --apple:          #39a849;
  --lime:           #c3e01b;
  --mint:           #2d7f36;

  /* Gradients */
  --gradient-al:    linear-gradient(135deg, #39a849, #c3e01b);
  --gradient-lm:    linear-gradient(135deg, #c3e01b, #2d7f36);
  --gradient-ma:    linear-gradient(135deg, #2d7f36, #39a849);
  --gradient-full:  linear-gradient(135deg, #2d7f36, #39a849, #c3e01b);

  /* Surfaces */
  --bg-deep:        #0a0d0a;
  --bg:             #0e110e;
  --bg-elevated:    #151a16;
  --bg-card:        #1a201b;
  --bg-card-hover:  #212822;

  /* Borders */
  --border:         rgba(255,255,255,0.07);
  --border-accent:  rgba(57,168,73,0.22);

  /* Text */
  --text-primary:   #f2f1ee;
  --text-secondary: #9a9d95;
  --text-tertiary:  #626860;

  /* Accent */
  --accent:         #39a849;
  --accent-dim:     #2d7f36;
  --accent-muted:   rgba(57,168,73,0.06);
  --accent-glow:    rgba(57,168,73,0.1);

  /* Misc */
  --white:          #ffffff;
  --font:           'General Sans', -apple-system, sans-serif;
  --mono:           'JetBrains Mono', monospace;
  --radius:         8px;
  --radius-lg:      14px;
  --transition:     0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── Light mode overrides ─── */
[data-theme="light"] {
  --bg-deep:        #f5f6f3;
  --bg:             #fafbf8;
  --bg-elevated:    #ffffff;
  --bg-card:        #ffffff;
  --bg-card-hover:  #f0f2ed;

  --text-primary:   #1a1d1a;
  --text-secondary: #4a5248;
  --text-tertiary:  #7a8275;

  /* --white flips to near-black for nav text in light mode */
  --white:          #1a1d1a;

  --border:         rgba(0,0,0,0.08);
  --border-accent:  rgba(57,168,73,0.25);

  --accent:         #2d7f36;
  --accent-dim:     #39a849;
  --accent-muted:   rgba(45,127,54,0.06);
  --accent-glow:    rgba(45,127,54,0.08);
}

/* ─── Light mode component overrides ─── */
/* These override components defined in shared.css using brand-specific values */

[data-theme="light"] .btn-primary {
  border-color: rgba(45,127,54,0.3);
  background: var(--accent);
}

[data-theme="light"] .btn-accent {
  color: var(--accent);
}

[data-theme="light"] .btn-accent:hover {
  box-shadow: 0 4px 16px rgba(45,127,54,0.15);
}

[data-theme="light"] #nav {
  background: #fafbf8;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

[data-theme="light"] #nav.scrolled {
  background: rgba(250,251,248,0.95);
}

[data-theme="light"] .nav-links.open {
  background: rgba(250,251,248,0.98);
}

/* ─── Logo mark ─── */
/* .nav-brand is the wordmark — update font, weight, letter-spacing, colour here */
.nav-brand {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  text-decoration: none;
}

/* .nav-brand span wraps the accent portion of the brand name (e.g. "wise" in "Anywise") */
.nav-brand span {
  color: var(--accent);
}
```

- [ ] **Step 3: Verify brand.css is well-formed**

Open `template/brand.css` and confirm: `:root` block is complete with all tokens listed in the spec, `[data-theme="light"]` block overrides all surface/text/border/accent tokens, and light mode component overrides cover `.btn-primary`, `.btn-accent`, `#nav`, `#nav.scrolled`, `.nav-links.open`.

- [ ] **Step 4: Commit**

```bash
git add template/brand.css
git commit -m "feat: add brand.css token layer for template kit"
```

---

## Task 2: Copy shared.css and shared.js into template/

**Files:**
- Create: `template/shared.css` (copy of root `shared.css`)
- Create: `template/shared.js` (copy of root `shared.js`)

- [ ] **Step 1: Copy the files**

```bash
cp shared.css template/shared.css
cp shared.js template/shared.js
```

- [ ] **Step 2: Verify shared.css does NOT contain :root variable definitions**

The root `shared.css` has `:root` variable definitions at the top (lines 11–45) that were kept for the main Anywise site. In `template/shared.css`, these are superseded by `brand.css` which loads first — having both is fine (brand.css wins due to cascade order). No edit required; just confirm the file copied correctly.

```bash
head -5 template/shared.css
# Expected: /* shared.css — Anywise design system */
wc -l template/shared.css
# Expected: same line count as shared.css in root
```

- [ ] **Step 3: Commit**

```bash
git add template/shared.css template/shared.js
git commit -m "feat: copy shared.css and shared.js into template kit"
```

---

## Task 3: Create home.html shell

**Files:**
- Create: `template/pages/home.html`
- Reference: `anywise-v5-redesign.html` (source structure)

- [ ] **Step 1: Create home.html**

Create `template/pages/home.html` with the following content. Paths to CSS/JS use `../` because pages live in `pages/` subdirectory:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- REPLACE: Page title --></title>
  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../brand.css">
  <link rel="stylesheet" href="../shared.css">
</head>
<body>

  <!-- Navigation -->
  <nav id="nav">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding-top:1rem;padding-bottom:1rem;">
      <a href="home.html" class="nav-brand"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent portion --></span></a>
      <ul id="navLinks" class="nav-links">
        <li><a href="product-index.html"><!-- REPLACE: Nav link 1 --></a></li>
        <li><a href="blog-index.html"><!-- REPLACE: Nav link 2 --></a></li>
        <li><a href="#" data-engage>Engage Us</a></li>
      </ul>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">◑</button>
        <a href="#" class="nav-cta" data-engage><!-- REPLACE: CTA label --></a>
        <button id="mobileToggle" class="mobile-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section style="padding: 8rem 0 4rem; text-align: center;">
    <div class="container">
      <div class="label reveal"><!-- REPLACE: Hero label --></div>
      <h1 class="reveal" style="font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.03em; margin: 1rem 0 1.5rem; line-height: 1.1;">
        <!-- REPLACE: Hero headline line 1 --><br>
        <span style="background: var(--gradient-al); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"><!-- REPLACE: Gradient headline portion --></span>
      </h1>
      <p class="reveal" style="font-size: 1.2rem; color: var(--text-secondary); max-width: 560px; margin: 0 auto 2.5rem;">
        <!-- REPLACE: Hero tagline -->
      </p>
      <div class="reveal" style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <a href="#" class="btn btn-primary" data-engage><!-- REPLACE: Primary CTA --></a>
        <a href="product-index.html" class="btn btn-accent"><!-- REPLACE: Secondary CTA --></a>
      </div>
      <!-- Globe placeholder — wire Three.js separately if needed. See README for theme hook. -->
      <div id="globe-container" style="width:100%;max-width:600px;height:400px;margin:3rem auto 0;display:flex;align-items:center;justify-content:center;">
        <div class="img-placeholder" style="width:100%;height:100%;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>Globe placeholder</span>
        </div>
      </div>
      <!-- Stats bar -->
      <div class="reveal" style="display:flex;gap:3rem;justify-content:center;flex-wrap:wrap;margin-top:3rem;padding-top:3rem;border-top:1px solid var(--border);">
        <div style="text-align:center;">
          <div style="font-size:2rem;font-weight:700;background:var(--gradient-al);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;"><!-- REPLACE: Stat 1 value --></div>
          <div style="font-size:0.85rem;color:var(--text-secondary);"><!-- REPLACE: Stat 1 label --></div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:2rem;font-weight:700;background:var(--gradient-al);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;"><!-- REPLACE: Stat 2 value --></div>
          <div style="font-size:0.85rem;color:var(--text-secondary);"><!-- REPLACE: Stat 2 label --></div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:2rem;font-weight:700;background:var(--gradient-al);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;"><!-- REPLACE: Stat 3 value --></div>
          <div style="font-size:0.85rem;color:var(--text-secondary);"><!-- REPLACE: Stat 3 label --></div>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- Capabilities -->
  <section style="padding: 5rem 0;">
    <div class="container">
      <div class="label reveal"><!-- REPLACE: Capabilities label --></div>
      <h2 class="reveal" style="font-size:clamp(1.8rem,3vw,2.5rem);font-weight:700;letter-spacing:-0.02em;margin:0.75rem 0 1rem;"><!-- REPLACE: Capabilities heading --></h2>
      <p class="reveal" style="color:var(--text-secondary);max-width:560px;margin-bottom:3rem;"><!-- REPLACE: Capabilities intro --></p>
      <div class="reveal" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;">
        <!-- REPLACE: Capability cards — copy this block per capability -->
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem;">
          <div style="font-size:1.5rem;margin-bottom:1rem;"><!-- REPLACE: Icon/emoji --></div>
          <h3 style="font-size:1rem;font-weight:600;margin-bottom:0.5rem;"><!-- REPLACE: Capability title --></h3>
          <p style="font-size:0.9rem;color:var(--text-secondary);"><!-- REPLACE: Capability description --></p>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- Products grid -->
  <section style="padding: 5rem 0;">
    <div class="container">
      <div class="label reveal"><!-- REPLACE: Products label --></div>
      <h2 class="reveal" style="font-size:clamp(1.8rem,3vw,2.5rem);font-weight:700;letter-spacing:-0.02em;margin:0.75rem 0 2.5rem;"><!-- REPLACE: Products heading --></h2>
      <!-- Top row: 3 cards -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-bottom:1.5rem;">
        <!-- REPLACE: 3 product cards -->
        <a href="product-detail.html" style="display:block;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem;text-decoration:none;transition:var(--transition);" class="reveal">
          <div class="label" style="margin-bottom:0.75rem;"><!-- REPLACE: Product tag --></div>
          <h3 style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:0.5rem;"><!-- REPLACE: Product name --></h3>
          <p style="font-size:0.9rem;color:var(--text-secondary);"><!-- REPLACE: Product summary --></p>
        </a>
        <a href="product-detail.html" style="display:block;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem;text-decoration:none;transition:var(--transition);" class="reveal">
          <div class="label" style="margin-bottom:0.75rem;"><!-- REPLACE: Product tag --></div>
          <h3 style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:0.5rem;"><!-- REPLACE: Product name --></h3>
          <p style="font-size:0.9rem;color:var(--text-secondary);"><!-- REPLACE: Product summary --></p>
        </a>
        <a href="product-detail.html" style="display:block;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem;text-decoration:none;transition:var(--transition);" class="reveal">
          <div class="label" style="margin-bottom:0.75rem;"><!-- REPLACE: Product tag --></div>
          <h3 style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:0.5rem;"><!-- REPLACE: Product name --></h3>
          <p style="font-size:0.9rem;color:var(--text-secondary);"><!-- REPLACE: Product summary --></p>
        </a>
      </div>
      <!-- Bottom row: 2 cards -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;">
        <!-- REPLACE: 2 product cards -->
        <a href="product-detail.html" style="display:block;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem;text-decoration:none;transition:var(--transition);" class="reveal">
          <div class="label" style="margin-bottom:0.75rem;"><!-- REPLACE: Product tag --></div>
          <h3 style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:0.5rem;"><!-- REPLACE: Product name --></h3>
          <p style="font-size:0.9rem;color:var(--text-secondary);"><!-- REPLACE: Product summary --></p>
        </a>
        <a href="product-detail.html" style="display:block;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem;text-decoration:none;transition:var(--transition);" class="reveal">
          <div class="label" style="margin-bottom:0.75rem;"><!-- REPLACE: Product tag --></div>
          <h3 style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:0.5rem;"><!-- REPLACE: Product name --></h3>
          <p style="font-size:0.9rem;color:var(--text-secondary);"><!-- REPLACE: Product summary --></p>
        </a>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- News cards -->
  <section style="padding: 5rem 0;">
    <div class="container">
      <div class="label reveal"><!-- REPLACE: News label --></div>
      <h2 class="reveal" style="font-size:clamp(1.8rem,3vw,2.5rem);font-weight:700;letter-spacing:-0.02em;margin:0.75rem 0 2.5rem;"><!-- REPLACE: News heading --></h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        <!-- REPLACE: News cards — copy per article -->
        <a href="blog-post.html?slug=<!-- REPLACE: slug -->" style="display:block;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem;text-decoration:none;" class="reveal">
          <div style="font-size:0.75rem;color:var(--text-tertiary);margin-bottom:0.5rem;font-family:var(--mono);"><!-- REPLACE: Date --></div>
          <h3 style="font-size:1rem;font-weight:600;color:var(--text-primary);margin-bottom:0.5rem;line-height:1.4;"><!-- REPLACE: Article title --></h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);"><!-- REPLACE: Article excerpt --></p>
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer style="padding:4rem 0 2rem;border-top:1px solid var(--border);margin-top:4rem;">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="home.html" class="nav-brand" style="display:inline-block;margin-bottom:0.75rem;"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent portion --></span></a>
          <p style="font-size:0.875rem;color:var(--text-secondary);max-width:280px;"><!-- REPLACE: Brand tagline --></p>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="product-index.html"><!-- REPLACE: Footer link --></a></li>
            <li><a href="blog-index.html"><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="#" data-engage><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-legal"><!-- REPLACE: Legal line e.g. ABN / cert --></p>
        <p class="footer-locations"><!-- REPLACE: City · City · City --></p>
        <p class="acknowledgement"><!-- REPLACE: Acknowledgement of Country --></p>
        <p style="font-size:0.8rem;color:var(--text-tertiary);margin-top:1rem;">© <!-- REPLACE: Year --> <!-- REPLACE: Company name -->. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="../shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add template/pages/home.html
git commit -m "feat: add home.html shell to template kit"
```

---

## Task 4: Create product-index.html shell

**Files:**
- Create: `template/pages/product-index.html`
- Reference: `products/index.html` (copy `<style>` block and card structure)

- [ ] **Step 1: Read the source style block from products/index.html**

Open `products/index.html` and copy the entire `<style>...</style>` block from the `<head>`. It contains styles for `.prod-grid-top`, `.prod-grid-bottom`, `.prod-card`, `.prod-card-img`, `.prod-card-body`, `.prod-card-tag`, `.prod-card-highlight`, `.prod-card-link`.

- [ ] **Step 2: Create product-index.html**

Create `template/pages/product-index.html` with nav, hero, the copied style block, two grid divs (`.prod-grid-top` 3-column / `.prod-grid-bottom` 2-column), and footer. Use the nav and footer pattern from Task 3. Insert the source `<style>` block verbatim inside `<head>` after `shared.css`. Full shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- REPLACE: Products page title --></title>
  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../brand.css">
  <link rel="stylesheet" href="../shared.css">
  <style>
    /* Page-level product grid styles — copy from products/index.html */
    /* REPLACE THIS COMMENT BLOCK with the full <style> content from products/index.html */
  </style>
</head>
<body>

  <!-- Navigation — same pattern as home.html -->
  <nav id="nav">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding-top:1rem;padding-bottom:1rem;">
      <a href="home.html" class="nav-brand"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
      <ul id="navLinks" class="nav-links">
        <li><a href="product-index.html"><!-- REPLACE: Nav link 1 --></a></li>
        <li><a href="blog-index.html"><!-- REPLACE: Nav link 2 --></a></li>
        <li><a href="#" data-engage>Engage Us</a></li>
      </ul>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">◑</button>
        <a href="#" class="nav-cta" data-engage><!-- REPLACE: CTA label --></a>
        <button id="mobileToggle" class="mobile-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section style="padding:7rem 0 4rem;">
    <div class="container">
      <nav class="breadcrumb reveal"><span><a href="home.html" style="color:var(--text-tertiary);text-decoration:none;">Home</a></span><span><!-- REPLACE: Section name --></span></nav>
      <div class="label reveal" style="margin-top:1.5rem;"><!-- REPLACE: Hero label --></div>
      <h1 class="reveal" style="font-size:clamp(2rem,4vw,3rem);font-weight:700;letter-spacing:-0.03em;margin:0.75rem 0 1rem;"><!-- REPLACE: Products heading --></h1>
      <p class="reveal" style="font-size:1.1rem;color:var(--text-secondary);max-width:540px;"><!-- REPLACE: Products intro paragraph --></p>
    </div>
  </section>

  <!-- Product grid -->
  <section style="padding:2rem 0 5rem;">
    <div class="container">
      <!-- Top row: 3 cards -->
      <div class="prod-grid-top">
        <!-- REPLACE: 3 product cards using .prod-card structure -->
        <a href="product-detail.html" class="prod-card reveal">
          <div class="prod-card-img">
            <div class="img-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span><!-- REPLACE: Product name --></span></div>
          </div>
          <div class="prod-card-body">
            <span class="prod-card-tag"><!-- REPLACE: Tag --></span>
            <h3 class="prod-card-highlight"><!-- REPLACE: Product name --></h3>
            <p><!-- REPLACE: One-line product description --></p>
            <span class="prod-card-link">Learn more →</span>
          </div>
        </a>
        <a href="product-detail.html" class="prod-card reveal">
          <div class="prod-card-img">
            <div class="img-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span><!-- REPLACE: Product name --></span></div>
          </div>
          <div class="prod-card-body">
            <span class="prod-card-tag"><!-- REPLACE: Tag --></span>
            <h3 class="prod-card-highlight"><!-- REPLACE: Product name --></h3>
            <p><!-- REPLACE: One-line product description --></p>
            <span class="prod-card-link">Learn more →</span>
          </div>
        </a>
        <a href="product-detail.html" class="prod-card reveal">
          <div class="prod-card-img">
            <div class="img-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span><!-- REPLACE: Product name --></span></div>
          </div>
          <div class="prod-card-body">
            <span class="prod-card-tag"><!-- REPLACE: Tag --></span>
            <h3 class="prod-card-highlight"><!-- REPLACE: Product name --></h3>
            <p><!-- REPLACE: One-line product description --></p>
            <span class="prod-card-link">Learn more →</span>
          </div>
        </a>
      </div>
      <!-- Bottom row: 2 cards -->
      <div class="prod-grid-bottom">
        <a href="product-detail.html" class="prod-card reveal">
          <div class="prod-card-img">
            <div class="img-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span><!-- REPLACE: Product name --></span></div>
          </div>
          <div class="prod-card-body">
            <span class="prod-card-tag"><!-- REPLACE: Tag --></span>
            <h3 class="prod-card-highlight"><!-- REPLACE: Product name --></h3>
            <p><!-- REPLACE: One-line product description --></p>
            <span class="prod-card-link">Learn more →</span>
          </div>
        </a>
        <a href="product-detail.html" class="prod-card reveal">
          <div class="prod-card-img">
            <div class="img-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span><!-- REPLACE: Product name --></span></div>
          </div>
          <div class="prod-card-body">
            <span class="prod-card-tag"><!-- REPLACE: Tag --></span>
            <h3 class="prod-card-highlight"><!-- REPLACE: Product name --></h3>
            <p><!-- REPLACE: One-line product description --></p>
            <span class="prod-card-link">Learn more →</span>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- CTA strip -->
  <section style="padding:4rem 0;background:var(--bg-elevated);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
    <div class="container" style="text-align:center;">
      <h2 class="reveal" style="font-size:1.75rem;font-weight:700;margin-bottom:1rem;"><!-- REPLACE: CTA heading --></h2>
      <p class="reveal" style="color:var(--text-secondary);margin-bottom:2rem;"><!-- REPLACE: CTA subtext --></p>
      <a href="#" class="btn btn-primary reveal" data-engage><!-- REPLACE: CTA button label --></a>
    </div>
  </section>

  <!-- Footer — same pattern as home.html -->
  <footer style="padding:4rem 0 2rem;border-top:1px solid var(--border);margin-top:4rem;">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="home.html" class="nav-brand" style="display:inline-block;margin-bottom:0.75rem;"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
          <p style="font-size:0.875rem;color:var(--text-secondary);max-width:280px;"><!-- REPLACE: Brand tagline --></p>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="product-index.html"><!-- REPLACE: Footer link --></a></li>
            <li><a href="blog-index.html"><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="#" data-engage><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-legal"><!-- REPLACE: Legal line --></p>
        <p class="footer-locations"><!-- REPLACE: Cities --></p>
        <p class="acknowledgement"><!-- REPLACE: Acknowledgement of Country --></p>
        <p style="font-size:0.8rem;color:var(--text-tertiary);margin-top:1rem;">© <!-- REPLACE: Year --> <!-- REPLACE: Company name -->. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="../shared.js"></script>
</body>
</html>
```

- [ ] **Step 3: Paste the actual style block from products/index.html**

Open `products/index.html`, copy the full content of the `<style>` tag in the `<head>`, and replace the `/* REPLACE THIS COMMENT BLOCK ... */` placeholder in `template/pages/product-index.html` with that content verbatim.

- [ ] **Step 4: Commit**

```bash
git add template/pages/product-index.html
git commit -m "feat: add product-index.html shell to template kit"
```

---

## Task 5: Create product-detail.html shell

**Files:**
- Create: `template/pages/product-detail.html`
- Reference: `products/wisdom.html` (copy full ~270-line `<style>` block)

- [ ] **Step 1: Read the full style block from products/wisdom.html**

Open `products/wisdom.html` and copy the entire `<style>` block. It defines: `.prod-page`, `.prod-hero`, `.prod-hero-inner`, `.prod-two-col`, `.prod-two-col.flip`, `.prod-section`, `.prod-benefits`, `.prod-benefits-grid`, `.benefit-card`, `.prod-how`, `.prod-how-inner`, `.prod-steps`, `.prod-step`, `.step-num`, `.use-cases-list`, `.use-case`, `.prod-features`, `.prod-feature-list`, `.feature-item`, `.feature-check`, `.prod-final-cta`.

- [ ] **Step 2: Create product-detail.html with 6-section structure**

Create `template/pages/product-detail.html`. Note: the page wrapper is `.prod-page` (max-width 1100px, 1.5rem padding) — NOT `.container`. The style block goes in `<head>`. Full shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- REPLACE: Product name --> — <!-- REPLACE: Brand name --></title>
  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../brand.css">
  <link rel="stylesheet" href="../shared.css">
  <style>
    /* Page-level product detail styles (~270 lines) — copy verbatim from products/wisdom.html */
    /* REPLACE THIS COMMENT BLOCK with the full <style> content from products/wisdom.html */
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav id="nav">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding-top:1rem;padding-bottom:1rem;">
      <a href="home.html" class="nav-brand"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
      <ul id="navLinks" class="nav-links">
        <li><a href="product-index.html"><!-- REPLACE: Nav link 1 --></a></li>
        <li><a href="blog-index.html"><!-- REPLACE: Nav link 2 --></a></li>
        <li><a href="#" data-engage>Engage Us</a></li>
      </ul>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">◑</button>
        <a href="#" class="nav-cta" data-engage><!-- REPLACE: CTA label --></a>
        <button id="mobileToggle" class="mobile-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <div class="prod-page">

    <!-- 1. Hero: text left / image right -->
    <section class="prod-hero">
      <div class="prod-hero-inner">
        <div>
          <nav class="breadcrumb reveal"><span><a href="home.html" style="color:var(--text-tertiary);text-decoration:none;">Home</a></span><span><a href="product-index.html" style="color:var(--text-tertiary);text-decoration:none;"><!-- REPLACE: Products section name --></a></span><span><!-- REPLACE: Product name --></span></nav>
          <div class="label reveal" style="margin-top:1.5rem;"><!-- REPLACE: Product category label --></div>
          <h1 class="reveal" style="font-size:clamp(2rem,4vw,3rem);font-weight:700;letter-spacing:-0.03em;margin:0.75rem 0 1rem;"><!-- REPLACE: Product name --></h1>
          <p class="reveal" style="font-size:1.1rem;color:var(--text-secondary);margin-bottom:2rem;"><!-- REPLACE: Product one-liner --></p>
          <div class="reveal" style="display:flex;gap:1rem;flex-wrap:wrap;">
            <a href="#" class="btn btn-primary" data-engage><!-- REPLACE: Primary CTA --></a>
            <a href="product-index.html" class="btn btn-ghost">← All products</a>
          </div>
        </div>
        <div class="reveal-scale">
          <div class="img-placeholder" style="height:340px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
            <span><!-- REPLACE: Product name --> hero image</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. What is it: image left / text right -->
    <section class="prod-section">
      <div class="prod-two-col flip">
        <div class="reveal-scale">
          <div class="img-placeholder" style="height:300px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            <span>Overview visual</span>
          </div>
        </div>
        <div>
          <div class="label reveal"><!-- REPLACE: Section label e.g. "Overview" --></div>
          <h2 class="reveal" style="font-size:1.75rem;font-weight:700;margin:0.75rem 0 1rem;"><!-- REPLACE: "What is [product]?" heading --></h2>
          <p class="reveal" style="color:var(--text-secondary);margin-bottom:1rem;"><!-- REPLACE: First overview paragraph --></p>
          <p class="reveal" style="color:var(--text-secondary);"><!-- REPLACE: Second overview paragraph --></p>
        </div>
      </div>
    </section>

    <!-- 3. Key benefits: 4-column grid -->
    <section class="prod-section prod-benefits">
      <div class="label reveal"><!-- REPLACE: Benefits label --></div>
      <h2 class="reveal" style="font-size:1.75rem;font-weight:700;margin:0.75rem 0 2rem;"><!-- REPLACE: Benefits heading --></h2>
      <div class="prod-benefits-grid">
        <!-- REPLACE: 4 benefit cards -->
        <div class="benefit-card reveal">
          <div style="font-size:1.5rem;margin-bottom:0.75rem;"><!-- REPLACE: Icon/emoji --></div>
          <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.5rem;"><!-- REPLACE: Benefit title --></h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);"><!-- REPLACE: Benefit description --></p>
        </div>
        <div class="benefit-card reveal">
          <div style="font-size:1.5rem;margin-bottom:0.75rem;"><!-- REPLACE: Icon/emoji --></div>
          <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.5rem;"><!-- REPLACE: Benefit title --></h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);"><!-- REPLACE: Benefit description --></p>
        </div>
        <div class="benefit-card reveal">
          <div style="font-size:1.5rem;margin-bottom:0.75rem;"><!-- REPLACE: Icon/emoji --></div>
          <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.5rem;"><!-- REPLACE: Benefit title --></h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);"><!-- REPLACE: Benefit description --></p>
        </div>
        <div class="benefit-card reveal">
          <div style="font-size:1.5rem;margin-bottom:0.75rem;"><!-- REPLACE: Icon/emoji --></div>
          <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.5rem;"><!-- REPLACE: Benefit title --></h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);"><!-- REPLACE: Benefit description --></p>
        </div>
      </div>
    </section>

    <!-- 4. How it works + use cases: 2-column -->
    <section class="prod-section prod-how">
      <div class="prod-how-inner">
        <div>
          <div class="label reveal"><!-- REPLACE: How it works label --></div>
          <h2 class="reveal" style="font-size:1.75rem;font-weight:700;margin:0.75rem 0 1.5rem;"><!-- REPLACE: How it works heading --></h2>
          <ol class="prod-steps">
            <!-- REPLACE: 3–5 steps -->
            <li class="prod-step reveal"><span class="step-num">01</span><div><strong><!-- REPLACE: Step title --></strong><p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.25rem;"><!-- REPLACE: Step description --></p></div></li>
            <li class="prod-step reveal"><span class="step-num">02</span><div><strong><!-- REPLACE: Step title --></strong><p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.25rem;"><!-- REPLACE: Step description --></p></div></li>
            <li class="prod-step reveal"><span class="step-num">03</span><div><strong><!-- REPLACE: Step title --></strong><p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.25rem;"><!-- REPLACE: Step description --></p></div></li>
          </ol>
        </div>
        <div>
          <div class="label reveal"><!-- REPLACE: Use cases label --></div>
          <h2 class="reveal" style="font-size:1.75rem;font-weight:700;margin:0.75rem 0 1.5rem;"><!-- REPLACE: Use cases heading --></h2>
          <ul class="use-cases-list">
            <!-- REPLACE: 3–5 use cases -->
            <li class="use-case reveal">
              <h4 style="font-weight:600;margin-bottom:0.25rem;"><!-- REPLACE: Use case title --></h4>
              <p style="font-size:0.875rem;color:var(--text-secondary);"><!-- REPLACE: Use case description --></p>
            </li>
            <li class="use-case reveal">
              <h4 style="font-weight:600;margin-bottom:0.25rem;"><!-- REPLACE: Use case title --></h4>
              <p style="font-size:0.875rem;color:var(--text-secondary);"><!-- REPLACE: Use case description --></p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 5. Feature breakdown: feature list left / screenshot right -->
    <section class="prod-section prod-features">
      <div class="prod-two-col">
        <div>
          <div class="label reveal"><!-- REPLACE: Features label --></div>
          <h2 class="reveal" style="font-size:1.75rem;font-weight:700;margin:0.75rem 0 1.5rem;"><!-- REPLACE: Features heading --></h2>
          <ul class="prod-feature-list">
            <!-- REPLACE: 4–6 feature items -->
            <li class="feature-item reveal"><span class="feature-check">✓</span><div><strong><!-- REPLACE: Feature name --></strong><p style="font-size:0.875rem;color:var(--text-secondary);margin-top:0.2rem;"><!-- REPLACE: Feature description --></p></div></li>
            <li class="feature-item reveal"><span class="feature-check">✓</span><div><strong><!-- REPLACE: Feature name --></strong><p style="font-size:0.875rem;color:var(--text-secondary);margin-top:0.2rem;"><!-- REPLACE: Feature description --></p></div></li>
            <li class="feature-item reveal"><span class="feature-check">✓</span><div><strong><!-- REPLACE: Feature name --></strong><p style="font-size:0.875rem;color:var(--text-secondary);margin-top:0.2rem;"><!-- REPLACE: Feature description --></p></div></li>
            <li class="feature-item reveal"><span class="feature-check">✓</span><div><strong><!-- REPLACE: Feature name --></strong><p style="font-size:0.875rem;color:var(--text-secondary);margin-top:0.2rem;"><!-- REPLACE: Feature description --></p></div></li>
          </ul>
        </div>
        <div class="reveal-scale">
          <div class="img-placeholder" style="height:360px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            <span><!-- REPLACE: Product name --> screenshot</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Final CTA -->
    <section class="prod-final-cta reveal">
      <h2 style="font-size:1.75rem;font-weight:700;margin-bottom:1rem;"><!-- REPLACE: Final CTA heading --></h2>
      <p style="color:var(--text-secondary);margin-bottom:2rem;"><!-- REPLACE: Final CTA supporting text --></p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <a href="#" class="btn btn-primary" data-engage><!-- REPLACE: Primary CTA label --></a>
        <a href="product-index.html" class="btn btn-accent"><!-- REPLACE: Secondary CTA label --></a>
      </div>
    </section>

  </div><!-- /.prod-page -->

  <!-- Footer -->
  <footer style="padding:4rem 0 2rem;border-top:1px solid var(--border);margin-top:4rem;">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="home.html" class="nav-brand" style="display:inline-block;margin-bottom:0.75rem;"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
          <p style="font-size:0.875rem;color:var(--text-secondary);max-width:280px;"><!-- REPLACE: Brand tagline --></p>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="product-index.html"><!-- REPLACE: Footer link --></a></li>
            <li><a href="blog-index.html"><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="#" data-engage><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-legal"><!-- REPLACE: Legal line --></p>
        <p class="footer-locations"><!-- REPLACE: Cities --></p>
        <p class="acknowledgement"><!-- REPLACE: Acknowledgement of Country --></p>
        <p style="font-size:0.8rem;color:var(--text-tertiary);margin-top:1rem;">© <!-- REPLACE: Year --> <!-- REPLACE: Company name -->. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="../shared.js"></script>
</body>
</html>
```

- [ ] **Step 3: Paste the actual style block from products/wisdom.html**

Open `products/wisdom.html`, copy the full `<style>` tag content, and replace the `/* REPLACE THIS COMMENT BLOCK ... */` placeholder in `template/pages/product-detail.html` with that content verbatim.

- [ ] **Step 4: Commit**

```bash
git add template/pages/product-detail.html
git commit -m "feat: add product-detail.html shell to template kit"
```

---

## Task 6: Create blog-index.html shell

**Files:**
- Create: `template/pages/blog-index.html`
- Reference: `blog/index.html` (copy full `<style>` block and inline JS verbatim)

- [ ] **Step 1: Read blog/index.html**

Open `blog/index.html`. Copy: (a) the full `<style>` block from `<head>`, and (b) the inline `<script>` block inside `<body>` that fetches `posts.json` and renders the list. You will paste both verbatim.

- [ ] **Step 2: Create blog-index.html**

Create `template/pages/blog-index.html`. The `posts.json` fetch path must be `'posts.json'` (same-directory relative — `posts.json` will live in `template/pages/`). Full shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- REPLACE: Blog name e.g. "any.news" --> — <!-- REPLACE: Brand name --></title>
  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../brand.css">
  <link rel="stylesheet" href="../shared.css">
  <style>
    /* Page-level blog index styles — copy verbatim from blog/index.html */
    /* REPLACE THIS COMMENT BLOCK with the full <style> content from blog/index.html */
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav id="nav">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding-top:1rem;padding-bottom:1rem;">
      <a href="home.html" class="nav-brand"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
      <ul id="navLinks" class="nav-links">
        <li><a href="product-index.html"><!-- REPLACE: Nav link 1 --></a></li>
        <li><a href="blog-index.html"><!-- REPLACE: Nav link 2 --></a></li>
        <li><a href="#" data-engage>Engage Us</a></li>
      </ul>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">◑</button>
        <a href="#" class="nav-cta" data-engage><!-- REPLACE: CTA label --></a>
        <button id="mobileToggle" class="mobile-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="blog-hero">
    <div class="container">
      <div class="label reveal"><!-- REPLACE: Blog section label --></div>
      <h1 class="reveal"><!-- REPLACE: Blog name e.g. "any.news" --></h1>
      <p class="reveal"><!-- REPLACE: Blog tagline --></p>
    </div>
  </section>

  <!-- Post list — rendered by inline JS below -->
  <section style="padding:2rem 0 5rem;">
    <div class="container">
      <div id="postList" class="blog-list">
        <!-- Posts injected here by JS -->
      </div>
      <div class="blog-empty" id="blogEmpty" style="display:none;">
        <p>No posts yet.</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer style="padding:4rem 0 2rem;border-top:1px solid var(--border);margin-top:4rem;">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="home.html" class="nav-brand" style="display:inline-block;margin-bottom:0.75rem;"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
          <p style="font-size:0.875rem;color:var(--text-secondary);max-width:280px;"><!-- REPLACE: Brand tagline --></p>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="product-index.html"><!-- REPLACE: Footer link --></a></li>
            <li><a href="blog-index.html"><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="#" data-engage><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-legal"><!-- REPLACE: Legal line --></p>
        <p class="footer-locations"><!-- REPLACE: Cities --></p>
        <p class="acknowledgement"><!-- REPLACE: Acknowledgement of Country --></p>
        <p style="font-size:0.8rem;color:var(--text-tertiary);margin-top:1rem;">© <!-- REPLACE: Year --> <!-- REPLACE: Company name -->. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="../shared.js"></script>
  <script>
    /* Blog list renderer — copy verbatim from blog/index.html inline script */
    /* REPLACE THIS COMMENT BLOCK with the full inline <script> content from blog/index.html */
    /* IMPORTANT: verify the fetch path reads 'posts.json' (same directory) not '../posts.json' */
  </script>
</body>
</html>
```

- [ ] **Step 3: Paste actual style block and script from blog/index.html**

Open `blog/index.html`:
1. Copy the `<style>` block content → paste into the `/* REPLACE THIS COMMENT BLOCK ... style ... */` placeholder.
2. Copy the inline `<script>` block content (the post-fetching/rendering JS) → paste into the `/* REPLACE THIS COMMENT BLOCK ... script ... */` placeholder.
3. Verify the fetch path inside the script reads `'posts.json'`, not a path containing `blog/`.

- [ ] **Step 4: Commit**

```bash
git add template/pages/blog-index.html
git commit -m "feat: add blog-index.html shell to template kit"
```

---

## Task 7: Create blog-post.html shell

**Files:**
- Create: `template/pages/blog-post.html`
- Reference: `blog/post.html` (copy full `<style>` block and inline JS verbatim)

- [ ] **Step 1: Read blog/post.html**

Open `blog/post.html`. Copy: (a) the full `<style>` block, and (b) the inline `<script>` block that reads the `?slug=` param, fetches `posts.json`, and renders the post into `#postContent`.

- [ ] **Step 2: Create blog-post.html**

The `posts.json` fetch path must be `'posts.json'` (same directory). Full shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading…</title><!-- JS sets this dynamically -->
  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../brand.css">
  <link rel="stylesheet" href="../shared.css">
  <style>
    /* Page-level blog post styles — copy verbatim from blog/post.html */
    /* REPLACE THIS COMMENT BLOCK with the full <style> content from blog/post.html */
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav id="nav">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding-top:1rem;padding-bottom:1rem;">
      <a href="home.html" class="nav-brand"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
      <ul id="navLinks" class="nav-links">
        <li><a href="product-index.html"><!-- REPLACE: Nav link 1 --></a></li>
        <li><a href="blog-index.html"><!-- REPLACE: Nav link 2 --></a></li>
        <li><a href="#" data-engage>Engage Us</a></li>
      </ul>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">◑</button>
        <a href="#" class="nav-cta" data-engage><!-- REPLACE: CTA label --></a>
        <button id="mobileToggle" class="mobile-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Post content — all rendered by inline JS -->
  <div id="postContent"></div>

  <!-- Footer -->
  <footer style="padding:4rem 0 2rem;border-top:1px solid var(--border);margin-top:4rem;">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="home.html" class="nav-brand" style="display:inline-block;margin-bottom:0.75rem;"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
          <p style="font-size:0.875rem;color:var(--text-secondary);max-width:280px;"><!-- REPLACE: Brand tagline --></p>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="product-index.html"><!-- REPLACE: Footer link --></a></li>
            <li><a href="blog-index.html"><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="#" data-engage><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-legal"><!-- REPLACE: Legal line --></p>
        <p class="footer-locations"><!-- REPLACE: Cities --></p>
        <p class="acknowledgement"><!-- REPLACE: Acknowledgement of Country --></p>
        <p style="font-size:0.8rem;color:var(--text-tertiary);margin-top:1rem;">© <!-- REPLACE: Year --> <!-- REPLACE: Company name -->. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="../shared.js"></script>
  <script>
    /* Blog post renderer — copy verbatim from blog/post.html inline script */
    /* REPLACE THIS COMMENT BLOCK with the full inline <script> content from blog/post.html */
    /* IMPORTANT: verify the fetch path reads 'posts.json' (same directory) not '../posts.json' */
  </script>
</body>
</html>
```

- [ ] **Step 3: Paste actual style block and script from blog/post.html**

Open `blog/post.html`:
1. Copy the `<style>` block content → paste into the style placeholder.
2. Copy the inline `<script>` block content → paste into the script placeholder.
3. Verify the fetch path inside the script reads `'posts.json'`.

- [ ] **Step 4: Commit**

```bash
git add template/pages/blog-post.html
git commit -m "feat: add blog-post.html shell to template kit"
```

---

## Task 8: Create engage.html shell

**Files:**
- Create: `template/pages/engage.html`
- Reference: `engage/index.html` (copy `.engage-page` and `.engage-standalone` styles)

- [ ] **Step 1: Read engage/index.html page-level styles**

Open `engage/index.html` and copy the `<style>` block. It contains `.engage-page` and `.engage-standalone` styles. The modal panel styles (`.engage-panel`, `.engage-overlay` etc.) come from `shared.css`, not the page.

- [ ] **Step 2: Create engage.html**

Note per spec: `shared.js` injects the Engage Us modal on every page. On `engage.html`, the nav "Engage Us" CTA will open the injected modal — this is acceptable, no suppression needed.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Engage Us — <!-- REPLACE: Brand name --></title>
  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../brand.css">
  <link rel="stylesheet" href="../shared.css">
  <style>
    /* Page-level engage page styles — copy verbatim from engage/index.html */
    /* REPLACE THIS COMMENT BLOCK with the full <style> content from engage/index.html */
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav id="nav">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding-top:1rem;padding-bottom:1rem;">
      <a href="home.html" class="nav-brand"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
      <ul id="navLinks" class="nav-links">
        <li><a href="product-index.html"><!-- REPLACE: Nav link 1 --></a></li>
        <li><a href="blog-index.html"><!-- REPLACE: Nav link 2 --></a></li>
        <li><a href="#" data-engage>Engage Us</a></li>
      </ul>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">◑</button>
        <a href="#" class="nav-cta" data-engage><!-- REPLACE: CTA label --></a>
        <button id="mobileToggle" class="mobile-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Standalone engage form page -->
  <!-- Note: shared.js also injects the modal overlay on this page.
       The nav "Engage Us" CTA will open the injected modal — acceptable behaviour. -->
  <main class="engage-page">
    <div class="engage-standalone">
      <div class="engage-header"><!-- REPLACE: Form heading e.g. "Work with us" --></div>
      <p class="engage-sub"><!-- REPLACE: Form subheading --></p>

      <form class="engage-form" action="mailto:<!-- REPLACE: contact@yourdomain.com -->" method="post" enctype="text/plain">
        <div class="engage-form-row">
          <div class="engage-group">
            <label for="engageName">Name</label>
            <input type="text" id="engageName" name="name" placeholder="<!-- REPLACE: Placeholder -->" required>
          </div>
          <div class="engage-group">
            <label for="engageOrg">Organisation</label>
            <input type="text" id="engageOrg" name="organisation" placeholder="<!-- REPLACE: Placeholder -->">
          </div>
        </div>
        <div class="engage-group">
          <label for="engageEmail">Email</label>
          <input type="email" id="engageEmail" name="email" placeholder="<!-- REPLACE: Placeholder -->" required>
        </div>
        <div class="engage-group">
          <label for="engageType">Type of enquiry</label>
          <select id="engageType" name="enquiry_type">
            <option value="">Select…</option>
            <option value="product">Product enquiry</option>
            <option value="partnership">Partnership</option>
            <option value="general">General</option>
          </select>
        </div>
        <!-- Product dropdown — shown only when enquiry type = "product" -->
        <div class="engage-group" id="engageProductGroup" hidden>
          <label for="engageProduct">Which product?</label>
          <select id="engageProduct" name="product">
            <option value="">Select…</option>
            <!-- REPLACE: product options -->
          </select>
        </div>
        <div class="engage-group">
          <label for="engageMessage">Message</label>
          <textarea id="engageMessage" name="message" rows="4" placeholder="<!-- REPLACE: Placeholder -->"></textarea>
        </div>
        <div class="engage-actions">
          <button type="submit" class="btn btn-primary">Send message</button>
        </div>
        <p class="engage-privacy"><!-- REPLACE: Privacy note --></p>
      </form>
    </div>
  </main>

  <!-- Footer -->
  <footer style="padding:4rem 0 2rem;border-top:1px solid var(--border);margin-top:4rem;">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="home.html" class="nav-brand" style="display:inline-block;margin-bottom:0.75rem;"><!-- REPLACE: Brand name --><span><!-- REPLACE: Accent --></span></a>
          <p style="font-size:0.875rem;color:var(--text-secondary);max-width:280px;"><!-- REPLACE: Brand tagline --></p>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="product-index.html"><!-- REPLACE: Footer link --></a></li>
            <li><a href="blog-index.html"><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:1rem;"><!-- REPLACE: Column heading --></h4>
          <ul class="footer-links">
            <li><a href="#" data-engage><!-- REPLACE: Footer link --></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-legal"><!-- REPLACE: Legal line --></p>
        <p class="footer-locations"><!-- REPLACE: Cities --></p>
        <p class="acknowledgement"><!-- REPLACE: Acknowledgement of Country --></p>
        <p style="font-size:0.8rem;color:var(--text-tertiary);margin-top:1rem;">© <!-- REPLACE: Year --> <!-- REPLACE: Company name -->. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="../shared.js"></script>
</body>
</html>
```

- [ ] **Step 3: Paste actual style block from engage/index.html**

Open `engage/index.html`, copy the `<style>` block content, and replace the placeholder comment in `template/pages/engage.html`.

- [ ] **Step 4: Commit**

```bash
git add template/pages/engage.html
git commit -m "feat: add engage.html shell to template kit"
```

---

## Task 9: Create posts.json sample data

**Files:**
- Create: `template/pages/posts.json`

- [ ] **Step 1: Create posts.json with one example post covering all block types**

Create `template/pages/posts.json`:

```json
[
  {
    "slug": "getting-started-with-your-new-site",
    "title": "Getting Started With Your New Site",
    "date": "2026-04-01",
    "readTime": 3,
    "category": "Guides",
    "author": "Your Name",
    "heroImage": "",
    "intro": "This is a sample post demonstrating all available block types. Replace this content with your own articles.",
    "sections": [
      {
        "heading": "What this template includes",
        "blocks": [
          { "type": "paragraph", "content": "Your site includes six page templates: home, product index, product detail, blog index, blog post, and an engage/contact page. All pages are styled via shared.css and branded via brand.css." },
          { "type": "pullquote", "content": "Brand tokens in brand.css are the only values you change per project." },
          { "type": "list", "items": ["Copy the template/ folder into your new project", "Edit brand.css to set your colours and fonts", "Update the 6 hardcoded rgba nav values in shared.css", "Replace <!-- REPLACE: ... --> comments throughout the HTML shells", "Run python3 -m http.server 8080 to preview blog pages locally"] }
        ]
      },
      {
        "heading": "Adding your own posts",
        "blocks": [
          { "type": "paragraph", "content": "Add posts by appending objects to this posts.json file. Each post needs a unique slug (URL-safe, lowercase, hyphens), a title, date (YYYY-MM-DD), readTime in minutes, category, author, and an intro paragraph." },
          { "type": "image", "src": "", "caption": "Example image caption — replace src with a real URL or leave empty for a placeholder." }
        ]
      }
    ]
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add template/pages/posts.json
git commit -m "feat: add sample posts.json to template kit"
```

---

## Task 10: Create README.md

**Files:**
- Create: `template/README.md`

- [ ] **Step 1: Create README.md**

Create `template/README.md`:

```markdown
# Website Template

A zero-build multi-page website template. Vanilla HTML/CSS/JS — no bundler, no framework.

---

## Quick start

1. Copy `template/` into your new project root
2. Edit `brand.css` — swap colour tokens, update font `<link>` tags in each page `<head>`, and update the 6 hardcoded nav/overlay rgba values in `shared.css` (see Brand token reference below)
3. Run `python3 -m http.server 8080` from the project root and open `http://localhost:8080/pages/` in your browser — blog pages require a local server, `file://` URLs won't work for fetch()

---

## File structure

```
template/
  brand.css          ← EDIT THIS: brand tokens per project
  shared.css         ← do not edit (except hardcoded nav rgba — see below)
  shared.js          ← do not edit
  pages/
    home.html
    product-index.html
    product-detail.html
    blog-index.html
    blog-post.html
    engage.html
    posts.json       ← blog content
  README.md
```

---

## Brand token reference

Every variable in `brand.css` and what it controls:

| Variable | Controls | Anywise default |
|---|---|---|
| `--apple` | Brand green 1 | `#39a849` |
| `--lime` | Brand green 2 (bright) | `#c3e01b` |
| `--mint` | Brand green 3 (deep) | `#2d7f36` |
| `--gradient-al` | Apple → lime gradient | `linear-gradient(135deg, #39a849, #c3e01b)` |
| `--gradient-lm` | Lime → mint gradient | `linear-gradient(135deg, #c3e01b, #2d7f36)` |
| `--gradient-ma` | Mint → apple gradient | `linear-gradient(135deg, #2d7f36, #39a849)` |
| `--gradient-full` | Full 3-stop gradient | `linear-gradient(135deg, #2d7f36, #39a849, #c3e01b)` |
| `--bg-deep` | Deepest background (modals, overlays) | `#0a0d0a` |
| `--bg` | Page background | `#0e110e` |
| `--bg-elevated` | Slightly elevated surfaces | `#151a16` |
| `--bg-card` | Card backgrounds | `#1a201b` |
| `--bg-card-hover` | Card hover state | `#212822` |
| `--border` | Subtle borders | `rgba(255,255,255,0.07)` |
| `--border-accent` | Accent-coloured borders | `rgba(57,168,73,0.22)` |
| `--text-primary` | Body text | `#f2f1ee` |
| `--text-secondary` | Secondary/muted text | `#9a9d95` |
| `--text-tertiary` | Placeholder/hint text | `#626860` |
| `--accent` | Primary accent colour | `#39a849` |
| `--accent-dim` | Dimmed accent | `#2d7f36` |
| `--accent-muted` | Very subtle accent tint | `rgba(57,168,73,0.06)` |
| `--accent-glow` | Accent glow/shadow | `rgba(57,168,73,0.1)` |
| `--white` | Nav text (flips in light mode) | `#ffffff` |
| `--font` | Body font stack | `'General Sans', -apple-system, sans-serif` |
| `--mono` | Monospace font | `'JetBrains Mono', monospace` |
| `--radius` | Default border radius | `8px` |
| `--radius-lg` | Large border radius | `14px` |
| `--transition` | Standard transition | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-slow` | Slow transition | `0.6s cubic-bezier(0.4, 0, 0.2, 1)` |

### Hardcoded rgba values to update in shared.css

When you change `--bg` or `--bg-deep`, also manually update these 6 values in `shared.css`:

| Location | Hardcoded value | What it is |
|---|---|---|
| `nav.scrolled` (dark) | `rgba(14,17,14,0.92)` | `--bg` at 92% opacity |
| `[data-theme="light"] #nav` | `#fafbf8` | light mode `--bg` |
| `[data-theme="light"] #nav.scrolled` | `rgba(250,251,248,0.95)` | light mode `--bg` at 95% |
| `.nav-links.open` (dark mobile) | `rgba(14,17,14,0.98)` | `--bg` at 98% opacity |
| `[data-theme="light"] .nav-links.open` | `rgba(250,251,248,0.98)` | light mode `--bg` at 98% |
| `.engage-overlay` | `rgba(10,13,10,0.85)` | `--bg-deep` at 85% opacity |

---

## Component catalogue

| Component | Class(es) | JS dependency |
|---|---|---|
| Layout container | `.container` | none |
| Section divider | `.section-divider` | none (CSS animation) |
| Label / eyebrow | `.label` | none (CSS animation) |
| Scroll reveal — fade up | `.reveal` | shared.js IntersectionObserver |
| Scroll reveal — scale | `.reveal-scale` | shared.js IntersectionObserver |
| Button — filled | `.btn.btn-primary` | none |
| Button — outline accent | `.btn.btn-accent` | none |
| Button — ghost | `.btn.btn-ghost` | none |
| Nav CTA | `a.nav-cta` | none — separate from .btn |
| Breadcrumb | `.breadcrumb` | none |
| Image placeholder | `.img-placeholder` | none |
| Navigation | `#nav`, `.nav-brand`, `#navLinks`, `.nav-links`, `#mobileToggle`, `.mobile-toggle`, `#themeToggle` | shared.js |
| Footer | `.footer-grid`, `.footer-brand`, `.footer-col`, `.footer-links`, `.footer-legal`, `.footer-locations`, `.acknowledgement`, `.footer-bottom` | none |
| Engage modal | `.engage-overlay`, `.engage-panel`, `#engageClose` | shared.js (injected on every page) |

---

## Animation reference

| Animation | How to use | Trigger |
|---|---|---|
| `.reveal` | Add class to any element | shared.js adds `.visible` at 10% viewport intersection |
| `.reveal-scale` | Add class to images/cards | Same trigger as `.reveal` |
| `.label` | Built into the class — always animates | No extra class needed |
| `.section-divider` | Place `<div class="section-divider"></div>` between sections | CSS `@keyframes dividerSweep` |
| Nav stagger | `.nav-links.open li a` | Automatic on mobile menu open |
| Engage panel | `.engage-panel` | `window.openEngageModal()` |

All animations respect `prefers-reduced-motion: reduce`.

---

## Engage modal

- **Trigger from HTML:** `<a href="#" data-engage>...</a>` — any element with `data-engage` attribute
- **Trigger from JS:** `window.openEngageModal()` / `window.closeEngageModal()`
- **Close:** ✕ button (`#engageClose`), ESC key, or click outside the panel
- **Form submission:** `mailto:` action by default — update the `action` attribute or swap for [Formspree](https://formspree.io)
- **"Which product?" dropdown:** Only visible when enquiry type = "Product enquiry" (controlled by shared.js)

---

## Theme system

- **Auto-detect:** Sydney timezone hours 6am–6pm = light mode, otherwise dark
- **User preference:** Stored in `localStorage` key `'theme'`
- **Programmatic:** `window.applyTheme('light')` or `window.applyTheme('dark')`
- **Custom logic (e.g. globe integration):** Set `window.__themeHandled = true` before `shared.js` runs. Handle the toggle click yourself, then call `window.applyTheme(theme)` from `shared.js` to keep localStorage in sync.

---

## Blog — adding posts

Edit `pages/posts.json`. Add a new object to the array:

```json
{
  "slug": "your-url-safe-slug",
  "title": "Post Title",
  "date": "2026-04-01",
  "readTime": 4,
  "category": "Insights",
  "author": "Author Name",
  "heroImage": "",
  "intro": "One paragraph shown on the listing page and at the top of the post.",
  "sections": [
    {
      "heading": "Section heading",
      "blocks": [
        { "type": "paragraph", "content": "Body text." },
        { "type": "pullquote", "content": "A pull quote." },
        { "type": "list", "items": ["Item one", "Item two"] },
        { "type": "image", "src": "https://...", "caption": "Optional." }
      ]
    }
  ]
}
```

`heroImage` is optional — leave as `""` for placeholder. `slug` must be lowercase with hyphens, no spaces.

---

## AI usage note

> When building with this template, read `README.md` and `brand.css` first. `shared.css` and `shared.js` are not modified per project — only `brand.css`, page content, and the 6 hardcoded nav rgba values change. Use `<!-- REPLACE: ... -->` comments to locate all content swap points. Product detail and blog pages include page-level `<style>` blocks that must be copied into each new instance — these are not in `shared.css`. The `anywise_style_guide.json` in the Anywise-Website repo root is the brand identity source of truth for colour rationale, voice, and imagery guidelines.
```

- [ ] **Step 2: Commit**

```bash
git add template/README.md
git commit -m "docs: add README.md to template kit"
```

---

## Task 11: Smoke test all pages

**Files:** None created — verification only

- [ ] **Step 1: Start local HTTP server**

```bash
cd /path/to/project && python3 -m http.server 8080
```

- [ ] **Step 2: Check each page opens without console errors**

Open in browser and verify:

| URL | Check |
|---|---|
| `http://localhost:8080/template/pages/home.html` | Nav renders, hero visible, theme toggle works, mobile menu opens |
| `http://localhost:8080/template/pages/product-index.html` | Grid renders 3+2 cards, breadcrumb visible |
| `http://localhost:8080/template/pages/product-detail.html` | All 6 sections visible, `.prod-page` wrapper (not `.container`) |
| `http://localhost:8080/template/pages/blog-index.html` | Sample post from posts.json appears in list |
| `http://localhost:8080/template/pages/blog-post.html?slug=getting-started-with-your-new-site` | Post content renders, title updates in browser tab |
| `http://localhost:8080/template/pages/engage.html` | Standalone form visible |

For each page, also verify:
- Engage modal opens on `data-engage` button click
- No JS errors in browser console
- Theme toggle switches between dark and light

- [ ] **Step 3: Check shared.css and shared.js are referenced correctly**

In browser DevTools → Network tab, confirm `brand.css`, `shared.css`, and `shared.js` all load with 200 status on every page.

- [ ] **Step 4: Commit smoke test sign-off**

```bash
git add -p  # stage any fixes found during smoke test
git commit -m "fix: smoke test corrections to template kit" --allow-empty
```

---

## Self-Review: Spec Coverage Check

| Spec requirement | Covered by |
|---|---|
| brand.css with :root and light mode tokens | Task 1 |
| shared.css copied unchanged | Task 2 |
| shared.js copied unchanged | Task 2 |
| home.html with globe placeholder, stats, products 3+2, news | Task 3 |
| product-index.html with breadcrumb, .prod-grid-top/.prod-grid-bottom | Task 4 |
| product-detail.html with 6 sections, .prod-page (not .container), page-level styles | Task 5 |
| blog-index.html with inline JS fetch, dynamic reveal, blog-empty state | Task 6 |
| blog-post.html with slug render, all block types, social share, more posts | Task 7 |
| engage.html with .engage-standalone, modal note | Task 8 |
| posts.json with all block types documented | Task 9 |
| README.md with quick start, token table, hardcoded rgba table, component catalogue, animation reference, engage docs, theme docs, AI note | Task 10 |
| Smoke test all pages | Task 11 |
| brand.css light mode component overrides: .btn-primary, .btn-accent, nav states | Task 1 ✓ |
| a.nav-cta is separate from .btn | Documented in README Task 10 ✓ |
| .engage-group[hidden] override for product dropdown | In engage.html `hidden` attribute + shared.css ✓ |
| Font link tags in every page head | In all page shells ✓ |
| posts.json same-directory fetch path | Tasks 6 & 7 step 3 ✓ |
