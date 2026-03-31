# High Priority Design Fixes — Anywise Website

**Date:** 2026-03-31
**File:** `anywise-v5-redesign.html`
**Scope:** 5 high-priority issues identified during design review

---

## 1. Typography — Replace Inter with General Sans

**Problem:** Inter is the most common AI-generated website font. It signals "AI made this" immediately.

**Solution:**
- Replace Google Fonts import (`fonts.googleapis.com`) with Fontshare API: `https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap`
- Update CSS variable `--font` from `'Inter', -apple-system, sans-serif` to `'General Sans', -apple-system, sans-serif`
- Remove the `&family=JetBrains+Mono:wght@400;500` from the Google Fonts URL — load JetBrains Mono separately or keep as a second `<link>` from Google Fonts
- Audit line-heights and letter-spacing after swap — General Sans has slightly different metrics than Inter, may need minor tweaks to `line-height: 1.65` on body and heading `letter-spacing: -0.04em`

**Keep unchanged:** JetBrains Mono for all monospace usage (`.label`, `.cap-num`, `.product-card-tag`, `.news-date`, `.stat-box p`, `.track-stat p`, `.footer-bottom`)

---

## 2. Gradient Text Restraint — Reduce from 7+ to 2 Uses

**Problem:** Gradient text (`background-clip: text` with `--gradient-full` or `--gradient-al`) appears on 7+ elements. When everything glows green, nothing stands out.

**Keep gradient on (2 uses):**
- **Hero h1 `<em>`** (line ~390): "ethically engineered." — the primary brand moment
- **Purpose statement `<em>`** (line ~614): "positive impact" — the secondary brand moment

**Switch to solid `color: var(--accent)` (#39a849):**

| Element | Current CSS | Line ref | Change |
|---------|-------------|----------|--------|
| `.nav-brand span` | `background: var(--gradient-al); -webkit-background-clip: text; -webkit-text-fill-color: transparent;` | ~210 | Replace with `color: var(--accent);` and remove background-clip properties |
| `.stat-box h3 .accent` | Same gradient clip pattern | ~582 | Replace with `color: var(--accent);` |
| `.track-stat h3` | Same gradient clip pattern | ~984 | Removed entirely — replaced by `.track-item h3` with `color: var(--text-primary)` in issue #3c |
| `.team h2 em` | Same gradient clip pattern | ~1021 | Replace with `color: var(--accent);` and add `-webkit-text-fill-color: unset;` |
| `.team-sub` | Same gradient clip pattern | ~1029 | Replace with `color: var(--accent);` |
| `.product-card-highlight` | Same gradient clip pattern | ~924 | Replace with `color: var(--accent);` |

The `.gradient-text` utility class (line ~76) can remain defined but should not be used on any current elements. Remove if no elements reference it.

---

## 3. Card Pattern Variation — Three Sections Get New Layouts

### 3a. Values Section → Inline Text Flow

**Current** (lines ~621-655 CSS, ~1451-1468 HTML): Three `.value-card` components in a 3-column grid with emoji icons.

**New layout:**
- Remove `.values-row` grid, `.value-card`, `.value-icon` CSS rules
- Remove the three `<div class="value-card">` blocks from HTML
- Replace with inline rows, each containing:
  - Value name in `color: var(--accent); font-weight: 600;`
  - A horizontal dash/line separator (`width: 2rem; height: 1px; background: var(--border);`)
  - Description text in `color: var(--text-secondary);`
- Each row is a flex container with `align-items: baseline` and `gap: 0.8rem`
- Stack vertically with `~0.6rem` gap between rows
- Sits directly under the purpose statement with `margin-top: 2rem`

**CSS to add:**
```css
.values-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 2rem;
}
.value-row {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  font-size: 0.88rem;
}
.value-name {
  color: var(--accent);
  font-weight: 600;
  white-space: nowrap;
}
.value-dash {
  width: 2rem;
  height: 1px;
  background: var(--border);
  flex-shrink: 0;
  align-self: center;
}
.value-desc {
  color: var(--text-secondary);
  line-height: 1.5;
}
```

**Responsive:** At `768px`, stack name above description and hide the dash:
```css
@media (max-width: 768px) {
  .value-row {
    flex-direction: column;
    gap: 0.2rem;
  }
  .value-dash {
    display: none;
  }
}
```

### 3b. Approach Features → Numbered List

**Current** (lines ~777-820 CSS, ~1512-1529 HTML): Four `.feature-card` components stacked vertically in the right column with borders, backgrounds, and left accent line hover.

**New layout:**
- Remove `.approach-features`, `.feature-card` CSS rules (including `::before` pseudo-element)
- Replace with numbered items using this structure per item:
  - Monospace number (`font-family: var(--mono); font-size: 0.72rem; color: var(--accent);`)
  - Title (`font-weight: 600; color: var(--text-primary);`)
  - Description below (`color: var(--text-secondary); font-size: 0.85rem;`)
- Each item is a flex row: number on left, text block on right
- Gap between items: `1.2rem`

**CSS to add:**
```css
.approach-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.approach-item {
  display: flex;
  gap: 0.8rem;
  align-items: start;
}
.approach-item-num {
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--accent);
  flex-shrink: 0;
  padding-top: 0.15rem;
  transition: color 0.3s;
}
.approach-item h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  transition: color 0.3s;
}
.approach-item p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

**Hover:** Number color transitions from `var(--accent)` to `var(--lime)` (#c3e01b). Title brightens to `var(--text-primary)`. No movement.

```css
.approach-item:hover .approach-item-num {
  color: var(--lime);
}
```
(The `transition: color 0.3s` is already on the base `.approach-item h4` rule above.)

### 3c. Track Record Stats → Inline Row

**Current** (lines ~954-999 CSS, ~1613-1631 HTML): Four `.track-stat` cards in a 4-column grid with gradient numbers, borders, and hover lift.

**New layout:**
- Remove `.track-stats` grid, `.track-stat` card CSS (including `::after` pseudo-element)
- Replace with a horizontal flex row separated by thin vertical dividers
- Each stat: large number in `color: var(--text-primary)` (white, NOT gradient) + label below in `color: var(--text-tertiary)`
- Bottom border under the entire row: `1px solid var(--border)`
- No hover effects — stats are informational, not interactive

**CSS to add:**
```css
.track-row {
  display: flex;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1.5rem;
}
.track-item {
  flex: 1;
  padding: 0.5rem 1rem;
}
.track-item + .track-item {
  border-left: 1px solid var(--border);
}
.track-item h3 {
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  margin-bottom: 0.3rem;
}
.track-item p {
  font-size: 0.72rem;
  color: var(--text-tertiary);
  line-height: 1.5;
  font-family: var(--mono);
}
```

**Responsive:**

At `1024px`, switch to 2x2 grid (replacing the existing `.track-stats` 1024px rule):
```css
@media (max-width: 1024px) {
  .track-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .track-item + .track-item {
    border-left: none;
  }
  .track-item {
    border-bottom: 1px solid var(--border);
    padding: 1rem;
  }
}
```

At `768px`, keep 2-column grid (same rules cascade from 1024px breakpoint — no additional rule needed).

**Counter animation:** Keep the existing counter JS — it still targets `[data-count]` elements, just update the selector if the class name changes from `.counter`.

---

## 4. Hover Effect Diversity

**Problem:** Nearly every interactive element uses `translateY(-6px)` + green `box-shadow`. This creates visual monotony.

### Changes per section:

**Capability cards — No change.** The cursor-tracking spotlight + gradient background differentiate these already. Note: these do use `translateY(-6px)` + green glow (the pattern criticized elsewhere), but the cursor-tracking spotlight and unique gradient backgrounds provide enough differentiation to justify keeping the lift here. This is an intentional exception.

**Product cards — Simplify to tilt only:**
- Remove `translateY(-6px)` from the JS tilt transform (line ~1939) — the `perspective() rotateX() rotateY()` is sufficient
- Remove the `.product-card-img-wrap::after` green overlay on hover (lines ~892-901)
- Keep image `scale(1.08)` zoom
- Keep the cursor spotlight (`::before`)
- Reduce `box-shadow` to `0 20px 60px rgba(0,0,0,0.5)` only (remove green glow portion)

**News cards — Scale instead of lift:**
- Replace `transform: translateY(-6px)` with `transform: scale(1.02)`
- Remove `box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 30px rgba(57,168,73,0.04)` — replace with `box-shadow: 0 8px 24px rgba(0,0,0,0.3)`
- Remove `.news-card-thumb-wrap::after` green overlay (lines ~1098-1106)
- Keep `.news-card-thumb` image zoom (`scale(1.08)`)
- Keep `.news-card-arrow` reveal animation
- Keep `.news-date` color change on hover

**Approach features — Color shift only (new numbered list):**
- Number: `color` transitions from `var(--accent)` to `var(--lime)` on hover
- Title: brightens slightly
- No movement, no shadows

**Track record stats — No hover.** Informational display only.

**CTA box — Remove container hover:**
- Remove `.cta-box:hover` rule (border-color change, box-shadow)
- Keep `.cta-image img` subtle zoom on hover
- Button hover states (`.btn-primary:hover`, `.btn-accent:hover`) remain unchanged

**Value cards — N/A.** Replaced with inline text, no hover needed.

---

## 5. Meta Tags & Brand Assets

### 5a. SVG Favicon

Create `favicon.svg` in project root:
- "A" lettermark from "Anywise" brand
- Fill: `#39a849` (brand green)
- Transparent background
- Simple, clean geometry — readable at 16x16

Also create `favicon.ico` (32x32) as fallback for older browsers.

Add to `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

### 5b. Open Graph Image

Create `og-image.png` (1200x630):
- Background: `#0e110e` (site background)
- "anywise" wordmark centered, "wise" in `#39a849`
- Tagline below: "Ethical Technology and Services" in `#9a9d95`
- Subtle green accent line or glow for visual interest
- Save as PNG for maximum social platform compatibility

### 5c. Meta Tags

Add to `<head>` after existing `<meta name="description">`:

```html
<meta name="theme-color" content="#0e110e">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="Anywise | Ethical Technology and Services">
<meta property="og:description" content="Decision augmentation for defence and government. Anywise delivers intelligent technology and agile services. Wholly Australian-owned, B Corp certified.">
<meta property="og:image" content="https://www.anywise.com.au/og-image.png">
<meta property="og:url" content="https://www.anywise.com.au">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anywise | Ethical Technology and Services">
<meta name="twitter:description" content="Decision augmentation for defence and government. Anywise delivers intelligent technology and agile services.">
<meta name="twitter:image" content="https://www.anywise.com.au/og-image.png">
```

**Note:** `og:image` and `twitter:image` use absolute URLs as required by social platforms.

---

## CSS Cleanup

As part of these changes, remove the following dead CSS:
- `.value-card`, `.value-icon`, `.values-row` (replaced by `.values-list` / `.value-row`)
- `.feature-card`, `.feature-card::before`, `.approach-features` (replaced by `.approach-list` / `.approach-item`)
- `.track-stat`, `.track-stat::after`, `.track-stats` (replaced by `.track-row` / `.track-item`)
- `.gradient-text` utility class if unused after gradient restraint changes
- `.approach-left h2`, `.approach-left p` (lines 742, 750) — dead CSS, class never used in HTML (approach section uses `reveal-left` instead)
- Remove `!important` declarations from `.nav-cta` (lines 243-249) — refactor with better selector specificity

## JS Cleanup

- **Product card tilt JS (line ~1939):** Remove `translateY(-6px)` from the transform string in the mousemove handler. Change `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)` to `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
- **Counter animation:** No changes needed — the counter JS uses `[data-count]` and `.counter` selectors, neither of which changes with the new `.track-item` markup. Just ensure the new HTML keeps `data-count` attributes and `.counter` class on the number elements
- **Reveal observer:** No changes needed — the observer queries the DOM dynamically. Elements that no longer have `.reveal-scale` are automatically excluded

## Responsive Considerations

- Values inline text: wraps naturally on mobile, consider stacking name above description at 768px
- Track stats row: switch to 2x2 grid at 768px with bottom borders replacing side dividers
- Approach numbered list: works as-is on mobile (flex column)

---

## Out of Scope

These medium/lower priority items were identified but are NOT part of this plan:
- Image lazy loading (`loading="lazy"`)
- Self-hosting images (currently on Wix CDN)
- News card placeholder images
- Copyright year update
- File splitting (CSS/JS separation)
- Credential marquee keyboard accessibility
- Dead footer location links
- Aria improvements on rotating tagline
