# Anywise Design System

The authoritative token source is the `:root` block in `shared.css` (mirrored byte-for-byte in `index.html`'s inline `<style>`). The 2020 `anywise_style_guide.json` is a brand *bible* — its colour palette matches, but its fonts (Open Sans/Roboto) are historical; the web uses General Sans + JetBrains Mono. **Trust the CSS, not the JSON.**

## Table of contents
- Design tokens (dark + light)
- Typography
- Components: eyebrow label, buttons, breadcrumb, cards, badges, media tiles, reveal, nav, footer, modal
- Sanctioned raw-colour exceptions
- Accessibility checklist

## Design tokens

Defined in `:root` (dark, default) and overridden under `[data-theme="light"]`. Adding/changing a token = edit BOTH the shared.css block AND the index.html inline block.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--apple` | `#39a849` | `#39a849` | brand green (constant) |
| `--lime` | `#c3e01b` | `#c3e01b` | highlight green (constant) |
| `--mint` | `#2d7f36` | `#2d7f36` | deep green (constant) |
| `--accent` | `#39a849` | `#2d7f36` | primary accent (darkens in light for contrast) |
| `--accent-dim` | `#2d7f36` | `#39a849` | secondary accent |
| `--accent-muted` | `rgba(57,168,73,.06)` | `rgba(57,168,73,.04)` | faint accent fills |
| `--accent-glow` | `rgba(57,168,73,.1)` | `rgba(57,168,73,.06)` | glow/shadow accent |
| `--bg-deep` | `#0a0d0a` | `#f5f6f3` | deepest surface |
| `--bg` | `#0e110e` | `#fafbf8` | page background |
| `--bg-elevated` | `#151a16` | `#ffffff` | raised surface / media tiles |
| `--bg-card` | `#1a201b` | `#ffffff` | card background |
| `--bg-card-hover` | `#212822` | `#f0f2ed` | card hover |
| `--border` | `rgba(255,255,255,.07)` | `rgba(0,0,0,.08)` | hairline borders |
| `--border-accent` | `rgba(57,168,73,.22)` | `rgba(57,168,73,.25)` | accent borders/hover |
| `--text-primary` | `#f2f1ee` | `#1a1d1a` | headings, key text |
| `--text-secondary` | `#9a9d95` | `#4a5248` | body text |
| `--text-tertiary` | `#626860` | `#7a8275` | meta, captions |
| `--danger` | `#e5686c` | `#c0272d` | form errors / invalid state |
| `--white` | `#ffffff` | `#1a1d1a` | "white" that flips in light mode — do NOT use for things that must stay white (e.g. skip-link text uses literal `#ffffff`) |
| `--gradient-al` | `linear-gradient(135deg,#39a849,#c3e01b)` | — | apple→lime, the eyebrow underline + hero em |
| `--gradient-lm` / `--gradient-ma` / `--gradient-full` | green gradients | — | decorative |
| `--radius` | `8px` | — | default corner |
| `--radius-lg` | `14px` | — | cards, tiles, larger surfaces |
| `--font` | `'General Sans', -apple-system, sans-serif` | — | headings + body |
| `--mono` | `'JetBrains Mono', monospace` | — | labels, stats, meta |
| `--transition` | `0.3s cubic-bezier(0.4,0,0.2,1)` | — | standard easing |
| `--transition-slow` | `0.6s cubic-bezier(0.4,0,0.2,1)` | — | slower reveals |

Fonts load via Fontshare (General Sans) + Google Fonts (JetBrains Mono) `<link>`s in each page head. Never use `transition: all` — always name the properties (compositor-friendly, matches existing code).

## Typography

- Headings: General Sans, weight 700–800, tight letter-spacing (`-0.02em` to `-0.03em`), `clamp()` for fluid sizing.
- Accent phrase inside a heading: wrap in `<em>` — rendered non-italic in `--accent`. This is the signature heading treatment.
- Body: General Sans 400, `line-height: 1.7–1.8`, `--text-secondary`.
- Eyebrow labels + stats + meta: JetBrains Mono (`var(--mono)`), uppercase, letter-spacing ~`0.1–0.2em`, small (0.62–0.72rem), `--accent` or `--text-tertiary`.
- Sentence case for prose; UPPERCASE only for mono eyebrow labels.

## Components

### Eyebrow label
`<p class="label">Section Name</p>` — mono/uppercase/accent with an animated gradient underline (`::before` grows to `2rem` on `.visible`). In shared.css `.label` starts at `opacity:0` and is revealed by the IntersectionObserver (which observes `.label` directly on the homepage; on sub-pages inside `.page-hero` it's always visible via a `.page-hero .label { opacity:1 }` rule). If you place a bare `.label` outside a revealed context, make sure it becomes visible (either the observer targets it, or add an explicit `opacity:1` override as `about.html` does).

### Buttons
`.btn` base + variant: `.btn-accent` (accent-outline, the common CTA), `.btn-primary` (solid accent), `.btn-ghost` (subtle outline). The Engage CTA in the nav is `a.nav-cta` (solid accent pill). Contact CTAs say **"Engage Us"** and carry `data-engage aria-haspopup="dialog"` to open the modal.

### Breadcrumb
`.breadcrumb` with `<a>Home</a>` + `.breadcrumb-sep` (or a bare `<span>/</span>`) + current-page `<span>`. Sub-pages link Home to the right relative depth.

### Cards
- **`.product-card`** (default): an `<a>` wrapping `.product-card-img-wrap > .product-card-img` (image top), then `.product-card-body` with `.product-card-tag` (mono category), `<h3>`, `<p>`, `.product-card-highlight` (italic mono accent line). Dark card, hover lift + spotlight. Used on Products, homepage innovation preview, etc.
- **`.cap-card`** (accent, homepage Capabilities ONLY): green-gradient background, gradient top-line on hover. Deliberate one-off — don't reuse elsewhere.

### Badges (maturity/status pills — innovation page)
`.innov-badge` + variant: `.badge-eco` (green-tinted, "fielded"/"ecosystem"), `.badge-val` (lime-tinted, "validated"), `.badge-rd` (grey, "R&D"). Each has a `[data-theme="light"]` override.

### Media tiles (innovation page)
`.innov-media` = 4:3 tile, `--bg-elevated` bg, photos fill via `object-fit: cover`. `.innov-media-logo` = a dark tile (`#12140f`, kept dark in both themes) for the SWIFT product logo which has a baked-in dark background — contained + padded, not cover. Rule of thumb: **photos cover a neutral tile; a logo with a baked background gets a matching solid tile + contain.**

### Scroll reveal
Add `.reveal` (or `.reveal-left`, `.reveal-right`, `.reveal-scale`) to elements that should animate in. The IntersectionObserver in shared.js (and index.html's own inline observer) adds `.visible`. `prefers-reduced-motion` neutralises all of it globally. Don't hand-roll new reveal mechanisms.

### Nav & footer
Canonical markup + relative-path rules live in `page-templates.md`. Nav is fixed, gains `.scrolled` background on scroll, has a mobile hamburger with a full focus trap (in shared.js). Footer is a 4-column grid (brand / Capabilities / Products & Services / Company) + bottom bar + Uluru acknowledgement.

### Engage Us modal
Injected by shared.js (not in page markup) and opened by any `[data-engage]` element. It has focus-return-to-trigger and a Tab focus-trap. To add a contact CTA, just add `data-engage aria-haspopup="dialog"` to a button/link — don't build your own modal.

## Sanctioned raw-colour exceptions
These are intentional, not token violations:
- `#12140f` — the SWIFT logo media tile (stays dark both themes; the logo image has a baked dark bg).
- `#06210b` — dark-green text ON the accent-green pipeline chips / SWIFT tile (needs to be near-black-green for contrast on green).
- SVG illustration fills (e.g. the SENTIA ecosystem SVG) — use the `s-*` class system with `[data-theme="light"]` overrides; `#ffffff` letter fills etc. are legitimate inside that.
- `#ffffff` on `.skip-link` — must stay white on the green skip-link background (using `--white` would flip it dark in light mode and fail contrast).
Anything else should be a token.

## Accessibility checklist
The site passed a full a11y audit; keep it there.
- **Focus:** global `:focus-visible` (2px accent outline) is defined in shared.css for links/buttons/`.btn`/`.product-card`/`.view-all-link`/`[tabindex]`/theme-toggle. Never set `outline:none` without a replacement.
- **Headings:** one `<h1>` per page; then `<h2>`→`<h3>` with no skipped levels. Stat figures / decorative numbers are NOT headings — use `<div>`/`<p>` (e.g. `.stat-value`).
- **Forms:** required fields get `aria-required="true"`; on validation failure set `aria-invalid="true"` + add `.invalid` (shared `.invalid { border: 1px solid var(--danger) !important }`); error messages get `role="alert"` (or an `aria-live` region). Controls + buttons have `min-height: 44px`. Tooltips must be reachable by keyboard/AT (`role="button"` + `aria-describedby` to an `.sr-only` span), not hover-only.
- **Images:** `alt` always; below-the-fold get `loading="lazy" decoding="async"`; all get intrinsic `width`/`height` to prevent layout shift (CLS). Above-the-fold hero images stay eager.
- **Motion:** `@media (prefers-reduced-motion: reduce)` in shared.css neutralises transitions/reveals — don't fight it.
- **Landmarks:** skip-link → `<main id="main-content">`; semantic `<nav>`/`<main>`/`<footer>`; mobile toggle has `aria-expanded`/`aria-controls`.
