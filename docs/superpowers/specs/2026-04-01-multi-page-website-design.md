# Multi-Page Website Design Spec
**Date:** 2026-04-01
**Branch:** multi-page-website
**Status:** Approved for implementation

---

## Overview

Extend the Anywise v5 single-page website into a full multi-page site. Three new page groups are in scope: product pages (home + one page per product), a blog/news section (home listing + single post template driven by JSON), and an Engage Us modal (accessible from all pages via the nav CTA). All pages share a common `shared.css` design system extracted from `anywise-v5-redesign.html`.

---

## Architecture

**Approach: Shared CSS + individual HTML pages**

A single `shared.css` file contains all design tokens, component styles, nav, and footer. Each HTML page is lightweight and links to it. The blog post template renders dynamically from `blog/posts.json` using a `?slug=` URL parameter — no new HTML file is needed per post.

### File Structure

```
anywise-v5-redesign.html       ← existing main page (updated to link shared.css)
shared.css                     ← new: extracted design system

products/
  index.html                   ← products home (card grid of all 5)
  wisdom.html
  engaide.html
  fabhums.html
  campaide.html
  aide.html

blog/
  index.html                   ← blog home (editorial list)
  post.html                    ← single post template (renders via ?slug=)
  posts.json                   ← all post content

engage/
  index.html                   ← standalone engage page (same content as modal, for direct linking)

favicon.svg
docs/
```

---

## shared.css

Extract from `anywise-v5-redesign.html`:
- All CSS custom properties (dark and light mode via `[data-theme]`)
- Nav styles and behaviour
- Footer styles
- Typography scale (General Sans + JetBrains Mono)
- Button variants (`.btn-primary`, `.btn-accent`) — note: `.btn-ghost` does not exist in the current codebase and must be created as a new variant (border: 1px solid `var(--border)`, transparent background, `var(--text-primary)` text)
- Section divider (`.section-divider`)
- `.container`, `.label`, `.reveal` utility classes
- Light/dark mode toggle logic (JS)
- Theme detection IIFE (Sydney timezone-aware, from existing implementation)

The main page `anywise-v5-redesign.html` is updated to `<link rel="stylesheet" href="shared.css">` and its inline styles reduced accordingly. All new pages link the same file with a relative path (e.g. `../shared.css` from within subdirectories).

**JS extraction scope:** Only the theme detection IIFE and light/dark toggle logic are extracted into `shared.css` (via an accompanying `shared.js`). The scroll progress bar, active nav link detection, and globe initialisation remain in `anywise-v5-redesign.html` only — they are main-page-specific and will not work on product/blog pages.

**Relative path convention:** All inner pages (e.g. `products/wisdom.html`) prefix paths with `../` for root-level assets: `../shared.css`, `../shared.js`, `../favicon.svg`. Nav links: `../products/index.html`, `../blog/index.html`, `../anywise-v5-redesign.html`.

**Local development note:** The blog `post.html` and `blog/index.html` use `fetch()` to load `posts.json`. `fetch()` fails on `file://` URLs in most browsers. Development requires a local HTTP server — e.g. VS Code Live Server extension or `python3 -m http.server 8080` from the repo root.

---

## Products Section

### products/index.html — Products Home

**Layout:** Card grid matching the existing main page products section, expanded with a full intro header and each card linking to its individual product page.

- Header: label "Products & Technology", H2 "Sovereign, Australian-designed intelligence platforms.", intro paragraph
- Grid: 3-column top row (WISDOM, ENG|AIDE, FABHUMS) + 2-column bottom row (CAMP|AIDE, AIDE) — same structure as main page
- Each card: hero image, category tag, product name (H3), one-line description, highlight text, "Learn more →" link to individual page
- CTA strip at bottom: "Ready to explore our products?" → Engage Us modal

### Individual Product Pages — Section Structure

Each product page (e.g. `products/wisdom.html`) follows this scroll flow:

1. **Hero** — breadcrumb (Home / Products / [Product]), category label, product name (H1), tagline, two CTAs (Engage Us → | All Products), hero image right
2. **What is [Product]?** — overview section: image left, text right (alternated from hero)
3. **Key Benefits** — 4-column card grid: icon, benefit name, one-liner description
4. **How It Works** — numbered 3-step flow (left column) paired with Use Cases (right column)
5. **Feature Breakdown** — 2-column feature list (left) paired with product screenshot/graphic (right)
6. **CTA** — "Ready to explore [Product] for your organisation?" → Engage Us modal + View All Products

**Alternating image/text columns:** Hero = text left / image right. What is it = image left / text right. Feature Breakdown = features left / image right. This prevents the stretched single-column feel.

**Image placeholders:** Three per page — hero image (aspect-ratio 4/3), product diagram (16/9), feature screenshot (4/3). All use a consistent styled placeholder with SVG icon until real assets are provided.

**Max content width:** 1100px (wider than default to reduce stretched feel).

### Product Content

| Product | Category | Tagline |
|---|---|---|
| WISDOM | Strategic Intelligence | Accelerated, reliable decision-making |
| ENG\|AIDE | Engineering Intelligence | Reducing operational risk, improving reliability |
| FABHUMS | Health & Usage Monitoring | Enhancing safety, extending asset life |
| CAMP\|AIDE | Facilities Intelligence | Faster planning, safer outcomes |
| AIDE | Enterprise Intelligence | Unified foresight at decision speed |

---

## Blog / News Section

### blog/posts.json — Content Schema

All posts stored as a single JSON array. Adding a new post = appending one object.

```json
[
  {
    "slug": "transforming-operational-challenges",
    "title": "Transforming Operational Challenges into Dual-Use Intelligence Solutions in Engineering",
    "date": "2026-02-15",
    "readTime": 3,
    "category": "Insights",
    "author": "Anywise Team",
    "heroImage": "https://...",
    "intro": "One paragraph summary shown on listing page and at top of post.",
    "sections": [
      {
        "heading": "From Problem to Practical Solution",
        "blocks": [
          { "type": "paragraph", "content": "..." },
          { "type": "image", "src": "https://...", "caption": "..." },
          { "type": "list", "items": ["item 1", "item 2"] },
          { "type": "pullquote", "content": "..." }
        ]
      }
    ]
  }
]
```

Block types: `paragraph`, `image` (with optional caption), `list` (unordered), `pullquote`.

**Initial posts (migrated from Wix):**
1. Transforming Operational Challenges into Dual-Use Intelligence Solutions in Engineering (15 Feb 2026)
2. The DCSP Must Be a Catalyst for Real Change (4 Jan 2026)
3. VICWORX is Preparing for Lift Off (25 Feb 2025)
4. Strengthening Our Commitment to Ethical, Quality-Driven Business (3 Oct 2024)

### blog/index.html — Blog Home

**Layout:** Editorial list (option B from design review)

- Header: label "Latest Insights", H1 "any.news"
- No category filter tabs (too few posts currently — add when count grows)
- Post list: each item = thumbnail (left, fixed size), date + category + read time, title, excerpt (first 160 characters of `intro`, truncated with ellipsis via JS — no separate `excerpt` field needed in the JSON schema)
- Posts sorted newest first
- Content loaded from `posts.json` via `fetch()`
- "No posts" empty state if JSON fails to load

### blog/post.html — Single Post Template

- Reads `?slug=` from URL, fetches `posts.json`, finds matching post
- Renders: breadcrumb (Home / Insights / [Title]), hero image (full-width), title (H1), author + date + read time, intro, sections with headings and blocks
- Handles unknown slug: shows "Post not found" message with link back to blog home
- Social share strip at bottom: LinkedIn, X, copy link (matching Wix post style)
- "More from Anywise" section: 2 recent posts below the article

---

## Engage Us Modal

### Behaviour

- Triggered by: "Engage Us" nav CTA button (all pages), hero CTA buttons, product page CTA buttons
- Opens as a full-screen overlay matching the mobile hamburger menu pattern — slides up from below, blurred page behind
- Closes via: ✕ button (top right), ESC key, click outside the modal panel
- Also accessible as a standalone page at `engage/index.html` for direct linking

### Form Fields

| Field | Type | Required |
|---|---|---|
| Full name | Text input | Yes |
| Work email | Email input | Yes |
| Organisation | Text input | Yes |
| Your role | Text input | No |
| What are you looking for? | Select dropdown | Yes |
| → Which product? | Conditional select (shown when "Product enquiry" selected) | Yes (if shown) |
| Message | Textarea | Yes |

**"What are you looking for?" options:**
- Product enquiry ← triggers product sub-dropdown
- Partnership or collaboration
- General enquiry
- Other

**"Which product?" options (shown conditionally):**
- WISDOM
- ENG|AIDE
- FABHUMS
- CAMP|AIDE
- AIDE
- Other

### Design

- Matches existing site design system exactly: CSS custom properties, General Sans font, dark/light mode aware
- Panel: max-width 620px, centered, `border: 1px solid var(--border-accent)`, `border-radius: 20px`
- Overlay: `rgba(10,13,10,0.85)` (`var(--bg-deep)` at opacity) with `backdrop-filter: blur(8px)` — same feel as mobile nav overlay
- Animation: slides up (translateY) on open, fades out on close
- Inputs use `var(--bg-card)` background, `var(--border)` border, focus state uses `var(--border-accent)`
- Submit button: `.btn-primary` style (accent green background, `var(--bg-deep)` text)
- Privacy note below submit: "We respect your privacy. Your details are never shared with third parties."
- Form submission: `mailto:sales@anywise.com.au` via `action` attribute (no backend required initially). Can be upgraded to Formspree or similar later.

---

## Navigation Updates

The shared nav is updated to include links to the new page groups:

```
anywise  |  Capabilities  Approach  Products  About  Insights  [Engage Us →]
```

- "Products" links to `products/index.html`
- "Insights" links to `blog/index.html`
- "Engage Us" triggers the modal (not a page navigation)
- "Capabilities" and "Approach" link back to `/#capabilities` and `/#approach` (main page anchors) from inner pages
- On product and blog pages, all nav links use relative paths (e.g. `../products/index.html`, `../blog/index.html`)
- "Engage Us" nav CTA: on all pages it triggers the modal overlay via JS (`openEngageModal()`). It does NOT navigate to `engage/index.html`. The `href` attribute is `#` with `event.preventDefault()`.
- `engage/index.html` exists as a fallback standalone page for direct linking (e.g. from external emails or campaigns). It is not linked in the nav.
- Mobile nav `nth-child` animation delays: the existing CSS has delays for 6 items. When nav is updated, these selectors must be updated to match the new item count.

---

## Light & Dark Mode

All new pages inherit the existing theme system from `shared.css`:
- Sydney timezone-aware auto-detection (6am–6pm = light, otherwise dark)
- `[data-theme="light"]` overrides on all components
- Theme toggle button present on all pages
- Globe component only present on main page — product and blog pages use static hero images

---

## Responsive Behaviour

- **Desktop (>1024px):** Two-column layouts as designed
- **Tablet (768–1024px):** Two-column collapses to single column for product sections; benefits grid 2×2
- **Mobile (<768px):** All single column; nav collapses to hamburger (existing pattern); modal goes full-screen

---

## Out of Scope

- CMS integration (future: Wix Headless or Supabase when author workflow requires it)
- Form backend (initially mailto, upgrade path noted above)
- Search functionality on blog
- Post tagging / category filtering (add when post count warrants it)
- Case studies, downloadable PDFs, customer quotes on product pages (future)
- Dynamic OG/SEO meta tags for blog posts: `<title>` and `og:title` are set via JS after slug resolution, which social crawlers won't see. Accepted tradeoff for client-side rendering — full SEO requires server-side rendering or a static site generator (future).
- Post tagging / category filtering on blog (add when post count warrants it)
