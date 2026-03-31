# Light Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a time-based light mode to `anywise-v5-redesign.html` that activates between 6am–6pm Sydney time (AEST/AEDT, DST-aware), with a daytime globe texture, corporate light color scheme, and zero flash on load.

**Architecture:** A synchronous IIFE in `<head>` sets `data-theme="light"` or `"dark"` on `<html>` before first paint. CSS custom property overrides under `[data-theme="light"]` handle ~80% of theming. Targeted attribute-scoped rules handle the remaining hardcoded `rgba()` values. The Three.js globe init reads the theme attribute to conditionally load the correct texture and adjust lighting.

**Tech Stack:** Vanilla HTML/CSS/JS, Three.js (CDN), single-file architecture.

---

### Task 1: Theme Setter Script in `<head>`

**Files:**
- Modify: `anywise-v5-redesign.html:9` (meta theme-color tag) and before `</head>` at line 1312

- [ ] **Step 1: Add inline theme-setter script before `</head>`**

Find `</head>` at line 1312. Insert this block immediately before it:

```html
<script>
  // Set theme before first paint — Sydney time, DST-aware
  (function() {
    var hour = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
    ).getHours();
    var isLight = hour >= 6 && hour < 18;
    document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = isLight ? '#f5f6f3' : '#0e110e';
  })();
</script>
```

- [ ] **Step 2: Verify in browser — open the page and check `<html data-theme="...">`**

Open http://localhost:8765/anywise-v5-redesign.html in Chrome DevTools. In the Elements panel, confirm `<html>` has `data-theme="light"` or `"dark"` depending on your local time relative to Sydney.

To force light mode for testing, run in the console:
```javascript
document.documentElement.dataset.theme = 'light';
```

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: add Sydney time-based theme setter in head"
```

---

### Task 2: CSS Custom Property Overrides

**Files:**
- Modify: `anywise-v5-redesign.html` — add CSS block after existing `:root {}` (which ends around line 74)

- [ ] **Step 1: Add `[data-theme="light"]` variable overrides**

Find the closing `}` of the `:root { }` block (around line 74). Add this new CSS block immediately after it:

```css
/* ═══ LIGHT MODE — CSS VARIABLE OVERRIDES ═══ */
[data-theme="light"] {
  --bg-deep:        #f5f6f3;
  --bg:             #fafbf8;
  --bg-elevated:    #ffffff;
  --bg-card:        #ffffff;
  --bg-card-hover:  #f0f2ed;

  --text-primary:   #1a1d1a;
  --text-secondary: #4a5248;
  --text-tertiary:  #7a8275;
  --white:          #1a1d1a;

  --border:         rgba(0,0,0,0.08);
  --border-accent:  rgba(57,168,73,0.25);
  --accent:         #2d7f36;
  --accent-dim:     #39a849;
  --accent-muted:   rgba(57,168,73,0.04);
  --accent-glow:    rgba(57,168,73,0.06);
}
```

- [ ] **Step 2: Force light mode in console and verify backgrounds flip**

```javascript
document.documentElement.dataset.theme = 'light';
```

Scroll down the page. Body background, card backgrounds, and footer should switch to off-white. Text headings should be near-black. Accent greens should still show.

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: add light mode CSS variable overrides"
```

---

### Task 3: Hero Section CSS Overrides

**Files:**
- Modify: `anywise-v5-redesign.html` — add CSS after the light mode variable block from Task 2

- [ ] **Step 1: Add hero and globe container overrides**

Append to the light mode CSS section:

```css
/* ═══ LIGHT MODE — HERO ═══ */
[data-theme="light"] #globe-container {
  background: #f5f6f3;
}

[data-theme="light"] .hero-bg::before {
  background: linear-gradient(to top,
    rgba(255,255,255,0.88) 0%,
    rgba(255,255,255,0.6)  40%,
    rgba(255,255,255,0.25) 70%,
    rgba(255,255,255,0.4)  100%
  );
}

[data-theme="light"] .hero-tagline {
  color: rgba(0,0,0,0.5);
}

[data-theme="light"] .hero-sub {
  color: rgba(0,0,0,0.6);
}
```

- [ ] **Step 2: Verify hero in light mode**

With `document.documentElement.dataset.theme = 'light'` set in console, check:
- Hero overlay is white-ish (not black)
- Tagline text is visible and dark
- Sub-text paragraph under the heading is dark

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: light mode hero overlay and text overrides"
```

---

### Task 4: Navigation CSS Overrides

**Files:**
- Modify: `anywise-v5-redesign.html` — append to light mode CSS section

- [ ] **Step 1: Add nav overrides**

```css
/* ═══ LIGHT MODE — NAVIGATION ═══ */
[data-theme="light"] nav {
  background: rgba(250,251,248,0.85);
}

[data-theme="light"] nav.scrolled {
  background: rgba(250,251,248,0.95);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

/* Mobile nav overlay */
[data-theme="light"] .nav-links.open {
  background: rgba(250,251,248,0.98);
}
```

Note: The base `nav` element has no background in the current CSS — the `nav.scrolled` class adds it when scrolling. The `[data-theme="light"] nav` rule ensures the nav starts with a light tint even before scrolling.

- [ ] **Step 2: Verify nav in light mode**

Set light mode in console. Scroll down the page. The nav should show a frosted light background. Test on mobile viewport (375px) and open the hamburger menu — the overlay should be white not black.

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: light mode navigation overrides (desktop + mobile)"
```

---

### Task 5: Buttons CSS Overrides

**Files:**
- Modify: `anywise-v5-redesign.html` — append to light mode CSS section

The `.btn-accent` text uses `color: var(--bg-deep)` which in light mode becomes `#f5f6f3` — near-white text on a green button. Override it explicitly.

- [ ] **Step 1: Add button overrides**

```css
/* ═══ LIGHT MODE — BUTTONS ═══ */
[data-theme="light"] .btn-primary {
  border: 1px solid rgba(0,0,0,0.12);
  color: var(--text-primary);
}

[data-theme="light"] .btn-primary:hover {
  border-color: rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.04);
}

[data-theme="light"] .btn-accent {
  color: #1a1d1a;
}

[data-theme="light"] .btn-accent::before {
  background: conic-gradient(
    from var(--btn-shine-angle),
    transparent 60%,
    rgba(57,168,73,0.4) 75%,
    rgba(255,255,255,0.6) 80%,
    rgba(57,168,73,0.4) 85%,
    transparent 100%
  );
}
```

- [ ] **Step 2: Verify buttons in light mode**

Set light mode in console. Check:
- "Our Capabilities" (`.btn-primary`) has a visible dark border and dark text
- "Engage Us →" (`.btn-accent`) button has dark text on green background
- Hover state on primary button darkens slightly

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: light mode button overrides"
```

---

### Task 6: Stats Bar CSS Overrides

**Files:**
- Modify: `anywise-v5-redesign.html` — append to light mode CSS section

- [ ] **Step 1: Add stats bar overrides**

```css
/* ═══ LIGHT MODE — STATS BAR ═══ */
[data-theme="light"] .hero-stats-bar {
  border: 1px solid rgba(0,0,0,0.08);
}

[data-theme="light"] .stat-box {
  background: rgba(255,255,255,0.7);
  border-right: 1px solid rgba(0,0,0,0.06);
}

[data-theme="light"] .stat-box:hover {
  background: rgba(255,255,255,0.85);
}

[data-theme="light"] .stat-box p {
  color: rgba(0,0,0,0.5);
}
```

- [ ] **Step 2: Verify stats bar in light mode**

Set light mode. The three stats boxes ("10+", "APAC · EU", "Ethical AI") should have a frosted white background with dark label text beneath each number. Green accent numbers should remain visible.

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: light mode stats bar overrides"
```

---

### Task 7: Capability Cards CSS Overrides

**Files:**
- Modify: `anywise-v5-redesign.html` — append to light mode CSS section

- [ ] **Step 1: Add capability card overrides**

```css
/* ═══ LIGHT MODE — CAPABILITY CARDS ═══ */
[data-theme="light"] .cap-card {
  background: var(--bg-card);
  border: 1px solid rgba(0,0,0,0.08);
  border-left: 3px solid var(--accent);
}

[data-theme="light"] .cap-card:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 8px 30px rgba(0,0,0,0.08), 0 0 30px rgba(57,168,73,0.06);
}
```

- [ ] **Step 2: Verify capability cards in light mode**

Scroll to Capabilities section with light mode active. Cards should be white with a green left border accent. Hover should show a subtle elevation shadow, not the dark green gradient.

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: light mode capability card overrides"
```

---

### Task 8: Product, News Cards & Credentials CSS Overrides

**Files:**
- Modify: `anywise-v5-redesign.html` — append to light mode CSS section

- [ ] **Step 1: Add product cards, news cards, and credentials overrides**

```css
/* ═══ LIGHT MODE — PRODUCT & NEWS CARDS ═══ */
[data-theme="light"] .product-card:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
}

[data-theme="light"] .news-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

/* ═══ LIGHT MODE — CREDENTIALS MARQUEE ═══ */
[data-theme="light"] .creds-track img {
  filter: grayscale(1) brightness(0.4);
  opacity: 0.5;
}

[data-theme="light"] .creds-track img:hover {
  filter: grayscale(0) brightness(1);
  opacity: 1;
}
```

- [ ] **Step 2: Verify in light mode**

- Products section: hover a product card — shadow should be soft and light, not deep black
- News section: hover a news card — same
- Credentials marquee: logos should be visible dark silhouettes on white background, not near-invisible faint smudges

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: light mode product/news/credentials overrides"
```

---

### Task 9: Globe JS — Conditional Texture and Lighting

**Files:**
- Modify: `anywise-v5-redesign.html` — Three.js globe init block (lines ~1917–2040)

The globe init is a self-contained module script. It needs to: (1) read the theme to pick the correct texture URL, (2) adjust lighting values, (3) use the correct renderer clear color, (4) use the light-mode glow shader when needed.

- [ ] **Step 1: Read the current globe init to understand its structure**

Read lines 1917–2010 of `anywise-v5-redesign.html` to find the exact positions of:
- The texture URL line (~1945–1946)
- `renderer.setClearColor` (~1937)
- `new THREE.AmbientLight(0xffffff, 0.6)` (~1992)
- `new THREE.DirectionalLight(0xffffff, 2.5)` (~1995)
- `directionalLight.position.set(-5, 3, 5)` (~1996)
- `new THREE.PointLight(0x39a849, 0.8, 10)` (~2000)
- The glow `ShaderMaterial` fragmentShader string (~1977)

- [ ] **Step 2: Add theme detection variable at top of globe init script**

At the very start of the globe init module script (the first line after `<script type="module">`), add:

```javascript
const isLightTheme = document.documentElement.dataset.theme === 'light';
```

- [ ] **Step 3: Replace the hardcoded texture URL**

Find:
```javascript
'https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg'
```

Replace with:
```javascript
isLightTheme
  ? 'https://unpkg.com/three-globe@2.41.12/example/img/earth-blue-marble.jpg'
  : 'https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg'
```

- [ ] **Step 4: Replace the hardcoded renderer clear color**

Find:
```javascript
renderer.setClearColor(0x0a0d0a, 1);
```

Replace with:
```javascript
renderer.setClearColor(isLightTheme ? 0xf5f6f3 : 0x0a0d0a, 1);
```

- [ ] **Step 5: Replace hardcoded lighting values**

Find:
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
```
Replace with:
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, isLightTheme ? 0.8 : 0.6);
```

Find:
```javascript
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(-5, 3, 5);
```
Replace with:
```javascript
const directionalLight = new THREE.DirectionalLight(0xffffff, isLightTheme ? 3.5 : 2.5);
directionalLight.position.set(isLightTheme ? 5 : -5, 3, 5);
```

Find:
```javascript
const greenLight = new THREE.PointLight(0x39a849, 0.8, 10);
```
Replace with:
```javascript
const greenLight = new THREE.PointLight(0x39a849, isLightTheme ? 0.3 : 0.8, 10);
```

- [ ] **Step 6: Update the glow shader for light mode**

Find the fragmentShader string inside the glow `ShaderMaterial`. It currently contains:

```glsl
float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
gl_FragColor = vec4(0.22, 0.66, 0.29, 1.0) * intensity * 0.6;
```

Replace the entire `ShaderMaterial` creation with:

```javascript
const glowMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: isLightTheme ? `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      gl_FragColor = vec4(0.8, 0.9, 0.8, 1.0) * intensity * 0.3;
    }
  ` : `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      gl_FragColor = vec4(0.22, 0.66, 0.29, 1.0) * intensity * 0.6;
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true
});
```

- [ ] **Step 7: Verify globe in light mode**

Open http://localhost:8765/anywise-v5-redesign.html. If currently dark mode time, run in console:
```javascript
// Can't change theme post-load for globe (globe already initialized)
// Instead: temporarily change the hour range to force light — OR test at 6am–6pm Sydney time
// Verify by checking: globe has blue/green daytime texture, no dark canvas background, softer glow
```

To properly test, reload the page between 6am–6pm Sydney time (AEST/AEDT). Alternatively, temporarily change line with `hour >= 6 && hour < 18` to `true` in the `<head>` script, reload, then revert.

Expected in light mode:
- Globe shows realistic daytime Earth (blues, greens, browns)
- No black rectangle visible behind globe
- Atmospheric glow is subtle warm-green, not vivid green

- [ ] **Step 8: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: light mode globe — day texture, sun lighting, soft glow"
```

---

### Task 10: Final Visual QA Pass

**Files:**
- Read-only QA — no code changes unless issues found

- [ ] **Step 1: Set light mode and do full scroll-through**

Open http://localhost:8765/anywise-v5-redesign.html. In console:
```javascript
document.documentElement.dataset.theme = 'light';
```

Scroll from top to bottom and check every section:

| Section | What to verify |
|---------|---------------|
| Hero | White overlay visible, dark heading text, green gradient italic line, dark sub-text, stats bar frosted white |
| Nav | Light frosted glass, dark nav links, green CTA button with dark text |
| Purpose | Light background, dark body text |
| Capabilities | White cards with green left border, dark card text |
| Approach | Light background, dark text |
| Products | White cards, light hover shadows |
| Track Record | Light background, dark text |
| Team | Light background |
| News | White cards, light hover shadows |
| CTA | Off-white background, subtle green glow |
| Credentials | Dark-silhouette logos visible on light bg |
| Footer | Off-white background, dark text |

- [ ] **Step 2: Test on mobile viewport**

In Chrome DevTools, switch to 375px width. Open mobile nav (hamburger). Verify:
- Hamburger icon is visible (dark) on the light nav background
- Mobile nav overlay is white, not black
- Nav links are readable (dark text on white)

- [ ] **Step 3: Verify dark mode is unaffected**

Remove the console override (or reload page). The site should return to dark mode outside Sydney 6am–6pm. Do a full scroll-through to confirm no dark mode elements were accidentally broken.

- [ ] **Step 4: Fix any issues found and commit**

If any issues found, fix them and commit:
```bash
git add anywise-v5-redesign.html
git commit -m "fix: light mode QA corrections"
```

- [ ] **Step 5: Final commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: time-based light mode complete — Sydney 6am-6pm AEST/AEDT"
```
