# Website Template Design Spec
**Date:** 2026-04-01
**Branch:** multi-page-website
**Status:** Approved for implementation

---

## Overview

Extract the Anywise v5 multi-page website into a reusable template kit. The template serves two audiences: humans starting a new project (copy folder, edit brand tokens, go) and AI builders (Claude Code reads `README.md` + `brand.css` to understand the system before touching anything).

---

## Architecture

**Approach: CSS variable override layer**

- `brand.css` — brand tokens only (colours, fonts, logo). The only file that changes per project.
- `shared.css` — design system (layout, components, animation). No hardcoded brand values. Referenced unchanged across all projects.
- `shared.js` — behaviour (theme detection, nav, scroll reveal, engage modal). Referenced unchanged.
- Page shells — complete HTML files with `<!-- REPLACE: ... -->` comments. Render correctly out of the box with placeholder content.

Each page links `brand.css` then `shared.css`. Brand overrides land first, design system consumes them.

---

## File Structure

```
template/
  brand.css                ← brand tokens (edit this per project)
  shared.css               ← design system (do not edit)
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
- Layout: `--white`, `--font`, `--mono`, `--radius`, `--radius-lg`, `--transition`, `--transition-slow`

**Light mode (`[data-theme="light"]`) overrides:**
- All surface, text, border, and accent tokens re-declared for light mode
- Does NOT include structural or layout tokens (those don't change between themes)

**Light mode component overrides (brand-specific only):**
- `.btn-primary` border/background in light mode
- `.btn-accent` colour and hover shadow in light mode
- Nav background in light and scrolled states
- Mobile nav overlay background

**Logo mark:**
- `.nav-brand` wordmark style: font-size, font-weight, letter-spacing, colour
- `.nav-brand span` accent colour for the `wise` portion

---

## shared.css

Design system — no hardcoded colours or font names. All values via CSS variables from `brand.css`.

**Component inventory:**

| Category | Classes |
|---|---|
| Reset | `*, *::before, *::after` box-sizing reset, `html/body` base |
| Layout | `.container` (max-width 1100px, centered, responsive padding), `.section-divider` (gradient line) |
| Typography | `.label` (small caps accent label with reveal animation), heading scale via `clamp()` |
| Animation | `.reveal` (fade up), `.reveal-scale` (scale + fade), `.visible` trigger class, `@media (prefers-reduced-motion)` override |
| Buttons | `.btn` (base), `.btn-primary` (ghost/outline), `.btn-accent` (filled gradient, shine animation), `.btn-ghost` (transparent border) |
| Breadcrumb | `.breadcrumb` with `/` separators and hover state |
| Image placeholder | `.img-placeholder` (styled div with SVG icon + caption label — used until real assets land) |
| Navigation | `.nav-brand`, `.nav-links`, `.nav-cta`, `.theme-toggle`, `.mobile-toggle`, scroll `.scrolled` state, 7-item nth-child stagger animation for mobile |
| Footer | `.footer-grid`, `.footer-brand`, `.footer-col`, `.footer-legal`, `.footer-bottom`, `.footer-links`, `.acknowledgement` |
| Engage modal | `.engage-overlay`, `.engage-panel`, `.engage-header`, `.engage-form`, `.engage-row`, `.engage-group`, `.engage-input/select/textarea`, `.engage-actions`, `.engage-note`, `.engage-close` |

---

## shared.js

Behaviour — no brand-specific values. All DOM targeting via IDs and classes defined in `shared.css`.

**Responsibilities:**
1. **Theme detection IIFE** — runs before DOM ready, reads `localStorage('theme')`, falls back to Sydney timezone hour (6am–6pm = light). Sets `data-theme` on `<html>`.
2. **`window.applyTheme(theme)`** — global function. Sets `data-theme`, updates localStorage, updates toggle button icon.
3. **Theme toggle** — click handler on `#themeToggle`. Skipped if `window.__themeHandled = true` (used by main page which has globe-specific theme logic).
4. **Mobile menu** — toggle `#mobileToggle` / `#navLinks.open`, body scroll lock, close on link click.
5. **Nav scroll** — adds `.scrolled` to `#nav` after 50px scroll.
6. **Scroll reveal** — IntersectionObserver on `.reveal` and `.reveal-scale`, adds `.visible` at 10% threshold.
7. **Engage modal injection** — appends modal HTML to `<body>` on DOMContentLoaded. Includes conditional product dropdown logic.
8. **`window.openEngageModal()` / `window.closeEngageModal()`** — global functions. Close on ✕ button, ESC key, click outside.
9. **`[data-engage]` wire-up** — all elements with `data-engage` attribute get `preventDefault` + `openEngageModal()` on click.

---

## Page Shells

Each shell:
- Links `../brand.css` then `../shared.css` (relative path from `pages/` subdirectory)
- Has `<script src="../shared.js"></script>` before `</body>`
- Contains full structural HTML with real component markup
- Uses `<!-- REPLACE: description -->` comments on every content node that must change per project
- Renders correctly with placeholder text without any edits

### home.html
Sections: nav, hero (h1 + tagline + two CTAs + stats bar), capabilities, products grid (3+2), news cards (4), footer. Hero has a `#globe-container` placeholder div (hidden until Three.js wired — no globe JS in template).

### product-index.html
Sections: nav, breadcrumb hero, 3+2 card grid (`.prod-card`), CTA strip, footer.

### product-detail.html
Sections: nav, hero (text left / image right), what-is (image left / text right), key benefits (4-column grid), how it works + use cases (2-column), feature breakdown (features left / screenshot right), final CTA, footer. Uses `.prod-two-col` and `.prod-two-col.flip` for alternating layout.

### blog-index.html
Sections: nav, hero with `any.news` heading, editorial post list (fetch from `../blog/posts.json`), footer. JS renders posts sorted newest-first; shows empty state if fetch fails.

### blog-post.html
Sections: nav, dynamic content (rendered by JS from `?slug=` param), footer. Renders: breadcrumb, hero image / placeholder, post header (meta bar + h1 + intro), sections with block types (paragraph, pullquote, list, image), social share strip (LinkedIn, X, copy link), "More from Anywise" 2-card grid.

### engage.html
Sections: nav, centered form panel (full-width page layout). Form fields: name, email, org, role, enquiry type dropdown, conditional product dropdown (shown only when "Product enquiry" selected), message textarea, privacy note, submit. Action: `mailto:` (no backend).

---

## README.md

### Sections

**Quick start (3 steps)**
1. Copy `template/` into your new project root
2. Edit `brand.css` — swap colours, font imports, logo CSS
3. Open any page in a browser (or run `python3 -m http.server 8080` from root for blog fetch() support)

**Brand token reference**
Table of every variable in `brand.css`: name, what it controls, Anywise default value.

**Component catalogue**
One-liner per component: class name, what it does, any JS dependency.

**Animation reference**
- `.reveal` — fade up from 8px below, 0.6s ease, triggers on 10% viewport intersection
- `.reveal-scale` — scale from 0.96 + fade, same trigger
- `.label` — same fade-up, always animated (not just on `.reveal` elements)
- `.btn-accent` — conic gradient shine sweep on hover (`@property --btn-shine-angle`)
- `.nav-links.open li` — 7-item staggered slide-in at 50ms intervals (mobile nav)
- `.engage-panel` — translateY(24px) → 0 slide-up on modal open, 0.3s ease
- All animations respect `prefers-reduced-motion: reduce`

**Engage modal**
- Triggered by any element with `data-engage` attribute
- Programmatic: `window.openEngageModal()` / `window.closeEngageModal()`
- Form submits via `mailto:` — update `action` attribute or swap for Formspree

**Theme system**
- Sydney timezone auto-detection: 6am–6pm = light, otherwise dark
- User preference stored in `localStorage('theme')`
- Main page globe integration: set `window.__themeHandled = true` before `shared.js` loads, then call `window.applyTheme()` + your globe update function from your own click handler

**AI usage note**
> When building with this template, read `README.md` and `brand.css` first. `shared.css` and `shared.js` are not modified per project — only `brand.css` and page content change. Use `<!-- REPLACE: ... -->` comments to locate all content swap points. The `anywise_style_guide.json` in the root of the Anywise-Website repo is the brand identity source of truth for colour rationale, voice, and imagery guidelines.

---

## Out of Scope

- Build pipeline / CSS preprocessor (template stays zero-build)
- Component JS framework (vanilla only)
- CMS integration (blog stays JSON-driven)
- Form backend (mailto only; Formspree upgrade path noted in README)
- Globe / Three.js (main page specific — not in template)
- Export script to create a new repo from the template folder
