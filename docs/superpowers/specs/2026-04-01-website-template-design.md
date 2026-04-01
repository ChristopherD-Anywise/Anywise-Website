# Website Template Design Spec
**Date:** 2026-04-01
**Branch:** multi-page-website
**Status:** Approved for implementation
**Review:** Pre-implementation code review completed — bugs fixed in codebase, spec updated accordingly.

---

## Overview

Extract the Anywise v5 multi-page website into a reusable template kit. The template serves two audiences: humans starting a new project (copy folder, edit brand tokens, go) and AI builders (Claude Code reads `README.md` + `brand.css` to understand the system before touching anything).

---

## Architecture

**Approach: CSS variable override layer**

- `brand.css` — brand tokens only (colours, fonts, logo). The only file that changes per project.
- `shared.css` — design system (layout, components, animation). Nearly all values via CSS variables; a small number of nav/overlay background values are hardcoded rgba derivations of `--bg` — these must be manually updated when rebranding (see brand.css section).
- `shared.js` — behaviour (theme detection, nav, scroll reveal, engage modal). Referenced unchanged.
- Page shells — complete HTML files with `<!-- REPLACE: ... -->` comments. Render correctly out of the box with placeholder content.

Each page links `brand.css` then `shared.css`. Brand overrides land first, design system consumes them.

---

## File Structure

```
template/
  brand.css                ← brand tokens (edit this per project)
  shared.css               ← design system (do not edit, except hardcoded nav colours — see below)
  shared.js                ← behaviour (do not edit)
  pages/
    home.html              ← hero + stats + capabilities + products + news + footer
    product-index.html     ← card grid of all products
    product-detail.html    ← 6-section product page (hero / overview / benefits / how it works / features / CTA)
    blog-index.html        ← editorial post list (fetch-driven)
    blog-post.html         ← slug-driven single post template
    engage.html            ← standalone contact/engage page
  README.md                ← usage guide for humans and AI
```

---

## brand.css

Contains only tokens — no selectors beyond `:root` and `[data-theme="light"]`. Every value here is a CSS custom property consumed by `shared.css`.

**Dark mode (`:root`) tokens:**
- Brand colours: `--apple`, `--lime`, `--mint`
- Gradients: `--gradient-al`, `--gradient-lm`, `--gradient-ma`, `--gradient-full`
- Surfaces: `--bg-deep`, `--bg`, `--bg-elevated`, `--bg-card`, `--bg-card-hover`
- Borders: `--border`, `--border-accent`
- Text: `--text-primary`, `--text-secondary`, `--text-tertiary`
- Accent: `--accent`, `--accent-dim`, `--accent-muted`, `--accent-glow`
- Misc: `--white`, `--font`, `--mono`, `--radius`, `--radius-lg`, `--transition`, `--transition-slow`

**Light mode (`[data-theme="light"]`) overrides:**
- All surface, text, border, and accent tokens re-declared for light mode
- `--white` is also overridden in light mode (becomes near-black for nav text) — include it in the light mode block

**Light mode component overrides (brand-specific only):**
- `.btn-primary` border/background in light mode
- `.btn-accent` colour and hover shadow in light mode
- Nav background in light and scrolled states
- Mobile nav overlay background

**Hardcoded values to update when rebranding:**
The following values in `shared.css` are derived from `--bg` but hardcoded as rgba — update them to match your brand's background colour:

| Location in shared.css | Hardcoded value | Derived from |
|---|---|---|
| `nav.scrolled` (dark) | `rgba(14,17,14,0.92)` | `--bg` at 92% opacity |
| `[data-theme="light"] nav` | `#fafbf8` | light mode `--bg` |
| `[data-theme="light"] nav.scrolled` | `rgba(250,251,248,0.95)` | light mode `--bg` at 95% |
| `.nav-links.open` (dark mobile) | `rgba(14,17,14,0.98)` | `--bg` at 98% opacity |
| `[data-theme="light"] .nav-links.open` | `rgba(250,251,248,0.98)` | light mode `--bg` at 98% |
| `.engage-overlay` | `rgba(10,13,10,0.85)` | `--bg-deep` at 85% opacity |

**Logo mark:**
- `.nav-brand` wordmark style: font-size, font-weight, letter-spacing, colour
- `.nav-brand span` accent colour for the `wise` portion

**Font loading:**
Fonts are loaded via `<link>` tags in each page's `<head>` — not via `@import` in `brand.css`. When rebranding, update the font `<link>` tags in each page shell and update `--font` and `--mono` in `brand.css`.

---

## shared.css

Design system — all values via CSS variables from `brand.css` except the hardcoded nav/overlay rgba values listed above.

**Button variants (important — descriptions are precise):**

| Class | Style | Use |
|---|---|---|
| `.btn-primary` | Filled, `--accent` background, `--bg-deep` text | Primary CTA |
| `.btn-accent` | Transparent, `--border-accent` border, `--accent` text | Secondary CTA |
| `.btn-ghost` | Transparent, `--border` border, `--text-primary` text | Tertiary / back links |

**`a.nav-cta` is NOT part of the `.btn` system.** It is a separate element with its own styles: smaller font (0.78rem), custom padding, `color: var(--bg-deep) !important` override. Do not replace it with `.btn.btn-primary` — the cascade and sizing will be wrong.

**Component inventory:**

| Category | Classes | Notes |
|---|---|---|
| Reset | `*`, `html/body` | Box-sizing, font, colour, line-height |
| Layout | `.container` | max-width 1100px, centered, 2rem side padding, responsive |
| Divider | `.section-divider` | Gradient horizontal rule with `@keyframes dividerSweep` reveal animation |
| Typography | `.label` | Small caps accent label, fade-up reveal animation built in |
| Animation | `.reveal`, `.reveal-scale`, `.visible` | `.reveal` = fade up from translateY(20px); `.reveal-scale` = scale(0.97) + fade. Add `.visible` to trigger (done by shared.js IntersectionObserver). `prefers-reduced-motion` respected. |
| Buttons | `.btn`, `.btn-primary`, `.btn-accent`, `.btn-ghost` | See table above |
| Nav CTA | `a.nav-cta` | Separate from `.btn` — see note above |
| Breadcrumb | `.breadcrumb` | `<span>` children as separators (no `.breadcrumb-sep` class needed) |
| Image placeholder | `.img-placeholder` | Styled div with SVG icon + text span, used until real assets land |
| Navigation | `.nav-brand`, `.nav-links`, `.nav-cta`, `.theme-toggle`, `.mobile-toggle` | `.scrolled` added to `#nav` on scroll. Mobile: `.nav-links.open` shows menu, `.mobile-toggle.open` animates hamburger to ✕ |
| Footer | `.footer-grid`, `.footer-brand`, `.footer-col`, `.footer-legal`, `.footer-bottom`, `.footer-links`, `.footer-locations`, `.acknowledgement` | `.footer-legal` = ABN/cert line; `.footer-locations` = city list |
| Engage modal | `.engage-overlay`, `.engage-panel`, `.engage-header`, `.engage-sub`, `.engage-form`, `.engage-form-row`, `.engage-group`, `.engage-group[hidden]`, `.engage-actions`, `.engage-privacy`, `.engage-close` | Form inputs styled via `.engage-group input/select/textarea` element selectors (not standalone classes). `.engage-form-row` = 2-col grid. `.engage-group[hidden]` = `display:none` override for conditional product field. |

---

## shared.js

Behaviour — no brand-specific values. All DOM targeting via IDs and classes defined above.

**Responsibilities:**
1. **Theme detection IIFE** — runs before DOM ready, reads `localStorage('theme')`, falls back to Sydney timezone hour (6am–6pm = light). Sets `data-theme` on `<html>`.
2. **`window.applyTheme(theme)`** — global function. Sets `data-theme`, updates localStorage, updates toggle button icon (☀ / ◑).
3. **Theme toggle** — click handler on `#themeToggle`. Skipped if `window.__themeHandled = true` (used by pages with custom theme logic, e.g. main page with globe).
4. **Mobile menu** — toggles `.open` class on both `#mobileToggle` and `#navLinks`, locks body scroll, closes on nav link click.
5. **Nav scroll** — adds `.scrolled` to `#nav` after 50px scroll.
6. **Scroll reveal** — IntersectionObserver on `.reveal` and `.reveal-scale`, adds `.visible` at 10% threshold. Falls back to immediately adding `.visible` if IntersectionObserver unavailable.
7. **Engage modal injection** — appends modal HTML to `<body>` on DOMContentLoaded. Includes conditional product dropdown (shown only when `enquiry === 'product'`). **Runs on every page** — see engage.html note below.
8. **`window.openEngageModal()` / `window.closeEngageModal()`** — global functions. Close on ✕ button (`#engageClose`), ESC key, or click outside panel.
9. **`[data-engage]` wire-up** — all elements with `data-engage` attribute get `preventDefault` + `openEngageModal()` on click.

---

## Page Shells

Each shell:
- Links `../brand.css` then `../shared.css` (relative path from `pages/` subdirectory)
- Has `<script src="../shared.js"></script>` before `</body>`
- Contains full structural HTML with real component markup
- Uses `<!-- REPLACE: description -->` comments on every content node that must change per project
- Renders correctly with placeholder text without any edits
- **Requires a local HTTP server** for any page using `fetch()` (blog-index, blog-post). `file://` URLs will fail. Run `python3 -m http.server 8080` from the project root.

### home.html
Sections: nav, hero (h1 + tagline + two CTAs + stats bar), capabilities, products grid (3+2), news cards (4), footer. Hero includes a `#globe-container` placeholder div — leave empty; globe JS is not in the template and must be wired separately if needed.

### product-index.html
Sections: nav, hero with breadcrumb + `.label` + h1 + intro paragraph, product grid, CTA strip, footer.

**Grid structure:** Two separate wrapper divs — `.prod-grid-top` (3-column) and `.prod-grid-bottom` (2-column). Not a single grid element.

**Card sub-components** (page-level styles, not in shared.css): `.prod-card`, `.prod-card-img`, `.prod-card-body`, `.prod-card-tag`, `.prod-card-highlight`, `.prod-card-link`. Copy the `<style>` block from `products/index.html` into the shell.

### product-detail.html
Sections: nav, hero (text left / image right), what-is overview (image left / text right via `.prod-two-col.flip`), key benefits (4-column `.prod-benefits-grid`), how it works + use cases (2-column `.prod-how-inner`), feature breakdown (`.prod-two-col` with feature list left / screenshot right), final CTA, footer.

**Layout wrapper:** Uses `.prod-page` (max-width 1100px, 1.5rem padding), NOT `.container`. Defined in the page `<style>` block.

**Page-level styles (~270 lines):** All product detail layout classes are in the page's `<style>` block, not in `shared.css`. Copy the full `<style>` block from `products/wisdom.html` into the shell. Classes include: `.prod-page`, `.prod-hero`, `.prod-hero-inner`, `.prod-two-col`, `.prod-two-col.flip`, `.prod-section`, `.prod-benefits`, `.prod-benefits-grid`, `.benefit-card`, `.prod-how`, `.prod-steps`, `.prod-step`, `.step-num`, `.use-cases-list`, `.use-case`, `.prod-features`, `.prod-feature-list`, `.feature-item`, `.feature-check`, `.prod-final-cta`.

### blog-index.html
Sections: nav, hero with `any.news` h1, editorial post list rendered by inline JS, footer.

**Data source:** Fetches `posts.json` from the same directory as `blog-index.html` (not a relative path — keep posts.json in the same folder as the page, or update the fetch path). Posts sorted newest-first. Shows `.blog-empty` empty state if fetch fails.

**Page-level styles:** All blog list styles (`.blog-hero`, `.blog-list`, `.blog-post-item`, `.post-thumb`, `.post-meta`, `.post-title`, `.post-excerpt`, etc.) are in the page `<style>` block — copy from `blog/index.html`.

**Dynamic reveal:** The inline JS re-runs an IntersectionObserver on dynamically injected `.reveal` elements after posts are rendered.

### blog-post.html
Sections: nav, dynamic content area (`#postContent`), footer. All content is injected by inline JS.

**Rendering flow:** JS reads `?slug=` from URL → fetches `posts.json` (same-directory relative path) → finds matching post → renders full page HTML into `#postContent`. Handles unknown slug with a "Post not found" state. Sets `document.title` dynamically.

**Block types rendered:** `paragraph` → `<p>`, `pullquote` → `<blockquote class="pullquote">`, `list` → `<ul>`, `image` → `<img>` with optional caption.

**Social share:** LinkedIn, X, and copy-link buttons wired after render.

**More posts:** 2 most-recent posts (excluding current) rendered below article.

**Page-level styles:** `.post-hero`, `.post-header`, `.post-body`, `.pullquote`, `.post-share`, `.share-btn`, `.more-grid`, `.more-card`, `.post-not-found` — copy from `blog/post.html`.

### engage.html
Sections: nav, centered `.engage-standalone` form panel, footer.

**Important:** `shared.js` injects the Engage Us modal on every page. On `engage.html`, the nav "Engage Us" CTA will open the injected modal (a duplicate of the inline form). This is acceptable behaviour — the nav CTA opens the modal overlay while the page itself shows the static form. No suppression needed unless the duplication is undesirable for a specific project.

**Page-level styles:** `.engage-page`, `.engage-standalone` — copy from `engage/index.html`. The modal panel styles (`.engage-panel` etc.) come from `shared.css`.

---

## posts.json Schema

All blog content lives in a single JSON array. Adding a post = appending one object.

```json
[
  {
    "slug": "url-safe-identifier",
    "title": "Full post title",
    "date": "2026-02-15",
    "readTime": 3,
    "category": "Insights",
    "author": "Author Name",
    "heroImage": "",
    "intro": "One paragraph shown on listing page and at top of post.",
    "sections": [
      {
        "heading": "Section heading",
        "blocks": [
          { "type": "paragraph", "content": "Body text." },
          { "type": "pullquote", "content": "Pull quote text." },
          { "type": "list", "items": ["Item 1", "Item 2"] },
          { "type": "image", "src": "https://...", "caption": "Optional caption." }
        ]
      }
    ]
  }
]
```

`heroImage` is optional — leave empty string for placeholder. `readTime` is in minutes (integer). `slug` must be URL-safe (lowercase, hyphens, no spaces).

---

## README.md

### Sections

**Quick start (3 steps)**
1. Copy `template/` into your new project root
2. Edit `brand.css` — swap colour tokens, update font `<link>` tags in each page `<head>`, update the 6 hardcoded nav/overlay rgba values in `shared.css` to match your `--bg` colour
3. Run `python3 -m http.server 8080` from the project root and open `http://localhost:8080/pages/` — blog pages require a local server, `file://` URLs won't work

**Brand token reference**
Table of every variable in `brand.css`: name, what it controls, Anywise default value.

**Component catalogue**
One-liner per component: class name, what it does, any JS dependency.

**Animation reference**
- `.reveal` — fade up from `translateY(20px)`, uses `var(--transition)` cubic-bezier, triggers on 10% viewport intersection via shared.js
- `.reveal-scale` — `scale(0.97)` + fade, same trigger
- `.label` — fade up from `translateY(8px)`, always animated (does not need `.reveal` class)
- `.section-divider` — gradient sweep reveal via `@keyframes dividerSweep`
- `.nav-links.open li:nth-child(n) a` — 7-item staggered slide-in at 50ms intervals on mobile nav open
- `.engage-panel` — `translateY(24px)` → 0, `cubic-bezier(0.4,0,0.2,1)`, 0.3s on modal open
- All animations respect `prefers-reduced-motion: reduce`

**Engage modal**
- Triggered by any element with `data-engage` attribute
- Programmatic: `window.openEngageModal()` / `window.closeEngageModal()`
- Form submits via `mailto:` — update `action` attribute or swap for Formspree
- "Which product?" dropdown only shows when enquiry type = "Product enquiry"

**Theme system**
- Sydney timezone auto-detection: 6am–6pm = light, otherwise dark
- User preference stored in `localStorage('theme')`
- To add custom theme logic (e.g. globe integration): set `window.__themeHandled = true` before `shared.js` loads, handle the toggle click yourself, call `window.applyTheme(theme)` from shared.js to keep localStorage in sync

**AI usage note**
> When building with this template, read `README.md` and `brand.css` first. `shared.css` and `shared.js` are not modified per project — only `brand.css`, page content, and the 6 hardcoded nav rgba values change. Use `<!-- REPLACE: ... -->` comments to locate all content swap points. Product detail and blog pages include page-level `<style>` blocks that must be copied into each new instance — these are not in `shared.css`. The `anywise_style_guide.json` in the Anywise-Website repo root is the brand identity source of truth for colour rationale, voice, and imagery guidelines.

---

## Out of Scope

- Build pipeline / CSS preprocessor (template stays zero-build)
- Component JS framework (vanilla only)
- CMS integration (blog stays JSON-driven)
- Form backend (mailto only; Formspree upgrade path noted in README)
- Globe / Three.js (main page specific — not in template)
- Export script to create a new repo from the template folder
- Tokenising the 6 hardcoded nav/overlay rgba values (acceptable trade-off for zero-build approach)
