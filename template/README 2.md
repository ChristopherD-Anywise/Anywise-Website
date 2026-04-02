# Website Template

A zero-build multi-page website template. Vanilla HTML/CSS/JS — no bundler, no framework, no CMS.

---

## Quick start

1. Copy `template/` into your new project root
2. Edit `brand.css` — swap colour tokens, update font `<link>` tags in each page `<head>`, and update the 6 hardcoded nav/overlay rgba values in `shared.css` (see Brand token reference below)
3. Run `python3 -m http.server 8080` from the project root and open `http://localhost:8080/pages/` in your browser — blog pages require a local server, `file://` URLs won't work for `fetch()`

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
| Label / eyebrow | `.label` | none (CSS animation built in) |
| Scroll reveal — fade up | `.reveal` | shared.js IntersectionObserver |
| Scroll reveal — scale | `.reveal-scale` | shared.js IntersectionObserver |
| Button — filled | `.btn.btn-primary` | none |
| Button — outline accent | `.btn.btn-accent` | none |
| Button — ghost | `.btn.btn-ghost` | none |
| Nav CTA | `a.nav-cta` | none — **separate from .btn, do not substitute** |
| Breadcrumb | `.breadcrumb` | none |
| Image placeholder | `.img-placeholder` | none |
| Navigation | `#nav`, `.nav-brand`, `#navLinks`, `.nav-links`, `#mobileToggle`, `.mobile-toggle`, `#themeToggle`, `.theme-toggle` | shared.js |
| Footer | `.footer-grid`, `.footer-brand`, `.footer-col`, `.footer-links`, `.footer-legal`, `.footer-locations`, `.acknowledgement`, `.footer-bottom` | none |
| Engage modal | `.engage-overlay`, `.engage-panel`, `#engageClose` | shared.js (injected on every page) |

---

## Animation reference

| Animation | How to use | Trigger |
|---|---|---|
| `.reveal` | Add class to any element | shared.js adds `.visible` at 10% viewport intersection |
| `.reveal-scale` | Add class to images/cards | Same trigger as `.reveal` |
| `.label` | Built into the class — always animates | No extra class needed |
| `.section-divider` | `<div class="section-divider"></div>` between sections | CSS `@keyframes dividerSweep` |
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

`heroImage` is optional — leave as `""` for a placeholder. `slug` must be lowercase with hyphens, no spaces.

---

## AI usage note

> When building with this template, read `README.md` and `brand.css` first. `shared.css` and `shared.js` are not modified per project — only `brand.css`, page content, and the 6 hardcoded nav rgba values change. Use `<!-- REPLACE: ... -->` comments to locate all content swap points. Product detail and blog pages include page-level `<style>` blocks that must be copied into each new instance — these are not in `shared.css`. The `anywise_style_guide.json` in the Anywise-Website repo root is the brand identity source of truth for colour rationale, voice, and imagery guidelines.
