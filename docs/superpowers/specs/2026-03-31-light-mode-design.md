# Light Mode — Time-Based Theme Switching

**Date:** 2026-03-31
**Status:** Approved
**Approach:** Hybrid (CSS custom property swap + targeted component overrides)

## Overview

Add a light mode to the Anywise website that activates based on Sydney local time. Between 6:00 AM and 6:00 PM (AEST/AEDT, auto-adjusting for DST), the site displays in light mode. Outside that window, the current dark mode is shown. The theme is determined on page load with no transition flash — no live switching while the page is open.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Light mode feel | Clean & Corporate | Matches defence/gov audience. White/light gray backgrounds, dark text, green accents. |
| Globe texture | NASA Blue Marble Day | Realistic daytime counterpart to current night texture. |
| Transition | Instant on load, no flash | Theme set in `<head>` before paint. No CSS transitions on load — avoids white flash in dark mode. |
| Hero treatment | Light overlay, dark text | Semi-transparent white overlay on daytime globe. Full inversion from dark mode. |
| Architecture | Hybrid variables + targeted rules | Variables handle ~80% of theming. Targeted rules handle hardcoded rgba() values in gradients, overlays, cards. |

## Color System

### CSS Custom Property Overrides

All overrides scoped under `[data-theme="light"]` on the root element.

#### Backgrounds

| Variable | Dark Mode | Light Mode |
|----------|-----------|------------|
| `--bg-deep` | `#0a0d0a` | `#f5f6f3` (warm off-white) |
| `--bg` | `#0e110e` | `#fafbf8` (near-white, green tint) |
| `--bg-elevated` | `#151a16` | `#ffffff` |
| `--bg-card` | `#1a201b` | `#ffffff` |
| `--bg-card-hover` | `#212822` | `#f0f2ed` (subtle green-gray) |

#### Text

| Variable | Dark Mode | Light Mode |
|----------|-----------|------------|
| `--text-primary` | `#f2f1ee` | `#1a1d1a` (near-black, green tint) |
| `--text-secondary` | `#9a9d95` | `#4a5248` (muted dark green) |
| `--text-tertiary` | `#626860` | `#7a8275` (soft gray-green) |
| `--white` | `#ffffff` | `#1a1d1a` (used as "high-contrast text" throughout — maps to near-black in light mode) |

#### Borders & Accents

| Variable | Dark Mode | Light Mode |
|----------|-----------|------------|
| `--border` | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.08)` |
| `--border-accent` | `rgba(57,168,73,0.22)` | `rgba(57,168,73,0.25)` |
| `--accent` | `#39a849` | `#2d7f36` (darker for WCAG AA on white) |
| `--accent-dim` | `#2d7f36` | `#39a849` |
| `--accent-muted` | `rgba(57,168,73,0.06)` | `rgba(57,168,73,0.04)` |
| `--accent-glow` | `rgba(57,168,73,0.1)` | `rgba(57,168,73,0.06)` |

#### Design Notes

- All light backgrounds tinted slightly toward green for brand cohesion — no sterile grays.
- No pure `#fff` for page backgrounds — only for elevated surfaces (cards).
- Accent green darkens to `#2d7f36` to maintain WCAG AA contrast ratio on light backgrounds.
- Shadows shift from black-based to green-tinted, lower opacity, softer spread.

## Hardcoded Value Override Table

Every hardcoded `rgba()`/hex color value in the CSS that needs a `[data-theme="light"]` override rule.

### Hero & Globe

| Selector | Property | Dark Value | Light Override |
|----------|----------|------------|----------------|
| `#globe-container` | `background` | `#0a0d0a` | `#f5f6f3` |
| `.hero-bg::before` | `background` (gradient) | `rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.4) 100%` | `rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.25) 70%, rgba(255,255,255,0.4) 100%` |
| `.hero-tagline` | `color` | `rgba(255,255,255,0.45)` | `rgba(0,0,0,0.5)` |
| `.hero-sub` | `color` | `rgba(255,255,255,0.7)` | `rgba(0,0,0,0.6)` |

### Navigation

| Selector | Property | Dark Value | Light Override |
|----------|----------|------------|----------------|
| `nav` | `background` | `rgba(14,17,14,0.85)` | `rgba(250,251,248,0.85)` |
| `nav.scrolled` | `background` | `rgba(14,17,14,0.92)` | `rgba(250,251,248,0.95)` |
| `nav.scrolled` | `border-bottom` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.06)` |
| `.nav-links.open` (mobile) | `background` | `rgba(14,17,14,0.98)` | `rgba(250,251,248,0.98)` |

### Buttons

| Selector | Property | Dark Value | Light Override |
|----------|----------|------------|----------------|
| `.btn-primary` | `border` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.12)` |
| `.btn-primary:hover` | `border-color` | `rgba(255,255,255,0.25)` | `rgba(0,0,0,0.2)` |
| `.btn-primary:hover` | `background` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.04)` |
| `.btn-accent::before` | `conic-gradient` | contains `rgba(255,255,255,0.8)` | replace with `rgba(57,168,73,0.4)` (green shine instead of white) |

### Stats Bar

| Selector | Property | Dark Value | Light Override |
|----------|----------|------------|----------------|
| `.hero-stats-bar` | `border` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.08)` |
| `.stat-box` | `background` | `rgba(0,0,0,0.35)` | `rgba(255,255,255,0.7)` |
| `.stat-box` | `border-right` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.06)` |
| `.stat-box:hover` | `background` | `rgba(0,0,0,0.5)` | `rgba(255,255,255,0.85)` |
| `.stat-box p` | `color` | `rgba(255,255,255,0.5)` | `rgba(0,0,0,0.5)` |

### Capability Cards

| Selector | Property | Dark Value | Light Override |
|----------|----------|------------|----------------|
| `.cap-card` | `background` | `linear-gradient(145deg, #1a3d1e, #1b5e2a, #163d1f)` | `var(--bg-card)` (white) |
| `.cap-card` | `border` | `1px solid rgba(45,127,54,0.3)` | `1px solid rgba(0,0,0,0.08)` + `border-left: 3px solid var(--accent)` |
| `.cap-card:hover` | `background` | `linear-gradient(145deg, #224a27, #247035, #1e4a28)` | `var(--bg-card-hover)` |
| `.cap-card:hover` | `box-shadow` | `0 12px 40px rgba(0,0,0,0.35), 0 0 50px rgba(57,168,73,0.15)` | `0 8px 30px rgba(0,0,0,0.08), 0 0 30px rgba(57,168,73,0.06)` |

### Product & News Cards

| Selector | Property | Dark Value | Light Override |
|----------|----------|------------|----------------|
| `.product-card:hover` | `box-shadow` | `0 20px 60px rgba(0,0,0,0.5)` | `0 12px 40px rgba(0,0,0,0.1)` |
| `.news-card:hover` | `box-shadow` | `0 8px 24px rgba(0,0,0,0.3)` | `0 4px 16px rgba(0,0,0,0.08)` |

### Credentials Marquee

| Selector | Property | Dark Value | Light Override |
|----------|----------|------------|----------------|
| `.creds img` | `filter` | `grayscale(1) brightness(0.7)` | `grayscale(1) brightness(0.4)` (darker silhouettes on light bg) |
| `.creds img` | `opacity` | `0.3` | `0.5` (more visible on light) |
| `.creds img:hover` | `filter` | `grayscale(0) brightness(1)` | `grayscale(0) brightness(1)` (no change needed) |

## Component-Specific Overrides

### 1. Hero Section

**Globe (JS-controlled):**
- Texture: conditionally load only the needed texture (day or night — not both)
  - Day: `https://unpkg.com/three-globe@2.41.12/example/img/earth-blue-marble.jpg` (1.46 MB)
  - Night: `https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg` (715 KB)
- Renderer clear color: `0xf5f6f3` (match `--bg-deep`)
- Directional light: intensity 3.5 (up from 2.5), repositioned to (5, 3, 5) for sun effect
- Atmospheric glow shader: reduce intensity multiplier from 0.6 to 0.3, shift color toward `(0.8, 0.9, 0.8)`
- Green point light: reduce intensity from 0.8 to 0.3
- Ambient light: 0.6 → 0.8

**Overlay (CSS):**
- `::before` gradient: 4-stop gradient matching dark mode structure but inverted (see override table above)
- `::after` green tint: keep at similar opacity

**Text (CSS):**
- H1: `var(--text-primary)` (#1a1d1a) — dark text on light overlay
- Italic gradient line: keep green gradient (works on both backgrounds)
- Hero tagline: `rgba(0,0,0,0.5)` (see override table)
- Hero sub-text: `rgba(0,0,0,0.6)` (see override table)
- Label text: dark green via `var(--accent)`

### 2. Navigation

**Desktop:**
- Backdrop: `rgba(250,251,248,0.85)` with blur (see override table)
- Scrolled state: `rgba(250,251,248,0.95)` (see override table)
- Nav links: dark text via `var(--text-secondary)`, green hover
- CTA button: keep green accent (works on both)
- Bottom border: `rgba(0,0,0,0.06)` (see override table)

**Mobile (overlay):**
- Full-screen overlay: `rgba(250,251,248,0.98)` (see override table)
- Mobile nav links: dark text via variables (auto)
- Close button/hamburger: needs color inversion to dark

### 3. Capability Cards

- Background: `var(--bg-card)` (white) with green left border accent
- Remove dark green gradient backgrounds entirely
- Spotlight/cursor-tracking effect: reduce opacity to `rgba(57,168,73,0.06)`
- Hover: subtle shadow elevation (see override table)
- Text colors: auto via variables

### 4. Stats Bar

- Container border: `rgba(0,0,0,0.08)` (see override table)
- Box backgrounds: `rgba(255,255,255,0.7)` with blur (see override table)
- Box hover: `rgba(255,255,255,0.85)` (see override table)
- Stat values: green `var(--accent)` (keeps contrast on white)
- Stat labels: `rgba(0,0,0,0.5)` (see override table)
- Dividers: `rgba(0,0,0,0.06)` (see override table)

### 5. Buttons

- Primary button: dark border `rgba(0,0,0,0.12)`, dark hover states (see override table)
- Accent button: green shine effect shifts from white to green tint (see override table)
- Accent button text: keep `var(--bg-deep)` which becomes light in light mode — **needs override to stay dark**: `color: #1a1d1a`

### 6. Product Cards

- Background: white via variables
- Hover shadow: lighter `0 12px 40px rgba(0,0,0,0.1)` (see override table)
- Image areas: keep as-is

### 7. News Cards

- Background: white via variables
- Hover shadow: lighter `0 4px 16px rgba(0,0,0,0.08)` (see override table)
- Text: auto via variables

### 8. CTA Section

- Background: `var(--bg-deep)` (light gray, auto via variables)
- Green radial glow: `rgba(57,168,73,0.06)` (subtle)

### 9. Credentials Marquee

- Logo filter: `grayscale(1) brightness(0.4)` + `opacity: 0.5` (darker and more visible on light bg)
- Hover: `grayscale(0) brightness(1)` (no change needed)
- Fade edges: auto via `var(--bg)` in existing gradient

### 10. Footer

- Background: `var(--bg-deep)` (light gray, auto via variables)
- Text: auto via variables

## JavaScript Implementation

### Time Detection

```javascript
function getSydneyHour() {
  // Uses Intl to get correct Sydney time, auto-handling AEST/AEDT
  const now = new Date();
  const sydneyTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
  );
  return sydneyTime.getHours();
}

function isLightMode() {
  const hour = getSydneyHour();
  return hour >= 6 && hour < 18;
}
```

This correctly handles DST transitions — `Australia/Sydney` timezone automatically switches between AEST (UTC+10) and AEDT (UTC+11).

### Theme Application (inline in `<head>`)

```javascript
// Set theme before first paint — no flash
(function() {
  var hour = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
  ).getHours();
  document.documentElement.dataset.theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
})();
```

- Runs synchronously in `<head>` before any rendering
- No CSS transitions on theme properties — instant application, zero flash
- Globe init (later in page) reads `document.documentElement.dataset.theme` to choose texture and lighting

### Theme Color Meta Tag

The inline script also updates the browser chrome color:

```javascript
document.querySelector('meta[name="theme-color"]').content =
  (hour >= 6 && hour < 18) ? '#f5f6f3' : '#0e110e';
```

### Globe Texture (conditional load)

```javascript
const isLight = document.documentElement.dataset.theme === 'light';
const textureUrl = isLight
  ? 'https://unpkg.com/three-globe@2.41.12/example/img/earth-blue-marble.jpg'
  : 'https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg';
```

Only the needed texture is loaded — no wasted bandwidth.

### Globe Lighting Adjustments (Light Mode)

| Parameter | Dark Mode | Light Mode |
|-----------|-----------|------------|
| Ambient light intensity | 0.6 | 0.8 |
| Directional light intensity | 2.5 | 3.5 |
| Directional light position | (-5, 3, 5) | (5, 3, 5) |
| Green point light intensity | 0.8 | 0.3 |
| Renderer clear color | `0x0a0d0a` | `0xf5f6f3` |
| Glow shader intensity | `* 0.6` | `* 0.3` |
| Glow shader color | `(0.22, 0.66, 0.29)` | `(0.8, 0.9, 0.8)` |

Note: The glow shader uses hardcoded GLSL values. The JS must create a different ShaderMaterial for light mode (or pass uniforms).

## File Changes

All changes in `anywise-v5-redesign.html`:

1. **CSS additions** (~120-140 lines): `[data-theme="light"]` variable overrides + all targeted component rules from override table
2. **JS additions in `<head>`** (~8 lines): Sydney time detection, theme setter, meta theme-color update
3. **JS modifications in globe init** (~25 lines): conditional texture URL, lighting params, shader material, clear color
4. **No new files** — everything stays in the single HTML file

## Out of Scope

- Manual light/dark toggle button (future enhancement)
- User preference persistence (localStorage)
- `prefers-color-scheme` media query integration
- Sunrise/sunset calculation (using fixed 6am/6pm for now)
- Live switching while page is open
- CSS transitions between themes (removed to avoid flash)
