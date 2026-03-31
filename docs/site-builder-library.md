# Anywise Website Builder Library

**Version:** 1.0  
**Date:** March 31, 2026  
**Purpose:** Reusable website architecture, components, design decisions, and patterns for building high-performance, accessible landing pages similar to Anywise.

---

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Design System](#design-system)
3. [Component Library](#component-library)
4. [Page Sections](#page-sections)
5. [Interactive Features](#interactive-features)
6. [Responsive Design](#responsive-design)
7. [Performance & Accessibility](#performance--accessibility)
8. [Implementation Patterns](#implementation-patterns)

---

## Core Architecture

### File Structure

**Single-File HTML Application** (monolithic approach for simplicity and performance)

```
index.html
├── Head (meta, fonts, styles, theme setup)
├── Body
│   ├── Scroll Progress Bar
│   ├── Navigation Bar (fixed, sticky)
│   ├── Hero Section (full viewport with 3D globe)
│   ├── Purpose & Values Section
│   ├── Capabilities Section (3-column grid)
│   ├── Approach Section (2-column layout)
│   ├── Products Section (4-card grid with responsive layout)
│   ├── Track Record Section (4-stat counters)
│   ├── Team Section (2-column grid with image)
│   ├── News/Insights Section (4-card grid)
│   ├── CTA Section (call-to-action)
│   ├── Credentials Section
│   └── Footer
└── Scripts
    ├── Theme setup (inline, pre-render)
    ├── Theme toggle handler
    ├── Mobile menu handler
    ├── Scroll event handler (progress bar, reveal animations)
    └── Three.js module (globe visualization)
```

### Technology Stack

- **HTML5** semantic structure
- **CSS3** custom properties (variables), grid, flexbox, gradients
- **Vanilla JavaScript** (ES6+) — no frameworks
- **Three.js 0.170.0** (ES module via importmap) for 3D globe
- **Web APIs:** IntersectionObserver, matchMedia (prefers-reduced-motion)
- **Fonts:** General Sans (Fontshare), JetBrains Mono (Google Fonts)

### Key Design Patterns

1. **CSS Custom Properties (Variables)** for theming — single source of truth for colors, spacing, transitions
2. **Data Attributes** (`data-theme`) for theme state management
3. **localStorage** for user preference persistence
4. **IntersectionObserver** for lazy animations (scroll reveal)
5. **requestAnimationFrame** for performant scroll-based calculations
6. **Modular CSS** — section-based organization with clear hierarchies

---

## Design System

### Color Palette

#### Brand Colors (Both Themes)

```css
--apple:          #39a849  /* Primary green accent */
--lime:           #c3e01b  /* Lime accent */
--mint:           #2d7f36  /* Darker green */

/* Gradients */
--gradient-al:    linear-gradient(135deg, #39a849, #c3e01b)
--gradient-lm:    linear-gradient(135deg, #c3e01b, #2d7f36)
--gradient-ma:    linear-gradient(135deg, #2d7f36, #39a849)
--gradient-full:  linear-gradient(135deg, #2d7f36, #39a849, #c3e01b)
```

#### Dark Mode (Default) — Warm Dark Theme

```css
/* Surfaces — warm dark */
--bg-deep:        #0a0d0a   /* Darkest surface */
--bg:             #0e110e   /* Main background */
--bg-elevated:    #151a16   /* Elevated panels */
--bg-card:        #1a201b   /* Card background */
--bg-card-hover:  #212822   /* Card hover state */

/* Borders */
--border:         rgba(255,255,255,0.07)
--border-accent:  rgba(57,168,73,0.22)

/* Text — warmer whites */
--text-primary:   #f2f1ee
--text-secondary: #9a9d95
--text-tertiary:  #626860

/* Accent */
--accent:         #39a849
--accent-dim:     #2d7f36
--accent-muted:   rgba(57,168,73,0.06)
--accent-glow:    rgba(57,168,73,0.1)
```

#### Light Mode — CSS Variable Overrides

```css
[data-theme="light"] {
  --bg-deep:        #f5f6f3
  --bg:             #fafbf8
  --bg-elevated:    #ffffff
  --bg-card:        #ffffff
  --bg-card-hover:  #f0f2ed

  --text-primary:   #1a1d1a
  --text-secondary: #4a5248
  --text-tertiary:  #7a8275

  --border:         rgba(0,0,0,0.08)
  --border-accent:  rgba(57,168,73,0.25)
  --accent:         #2d7f36  /* Inverted: darker */
  --accent-dim:     #39a849
  --accent-muted:   rgba(57,168,73,0.04)
  --accent-glow:    rgba(57,168,73,0.06)
}
```

#### Hero Light Mode Overrides

```css
[data-theme="light"] .hero-bg::before {
  background: linear-gradient(to top,
    rgba(255,255,255,0.88) 0%,
    rgba(255,255,255,0.6)  40%,
    rgba(255,255,255,0.25) 70%,
    rgba(255,255,255,0.4)  100%
  );
}

[data-theme="light"] .hero h1 em {
  background: linear-gradient(135deg, #1a5c22, #2d7f36, #39a849);
}
```

### Typography

| Element | Font | Size | Weight | Use |
|---------|------|------|--------|-----|
| Brand | General Sans | 1.25rem | 700 | Logo |
| Hero H1 | General Sans | clamp(3rem, 5.5vw, 4.5rem) | 800 | Main heading |
| Section H2 | General Sans | clamp(2rem, 3.5vw, 2.8rem) | 800 | Section title |
| Card H3 | General Sans | 1.18rem | 700 | Card title |
| Body | General Sans | 0.88rem–1.05rem | 400 | Body text |
| Labels | JetBrains Mono | 0.65rem | 500 | Section labels, data |
| Tagline | JetBrains Mono | 0.72rem | 400 | Rotating tagline |

### Spacing System

```css
/* Base unit: 1rem = 16px */
Padding/Margin scale: 0.5rem, 0.8rem, 1rem, 1.2rem, 1.5rem, 1.8rem, 2rem, 2.2rem, 3rem, 4rem, 5rem, 7rem
```

**Section Padding Vertical:** 5rem–7rem (responsive with `clamp()`)  
**Container Max Width:** 1160px  
**Container Horizontal Padding:** 2rem (on mobile, maintains readable line length)

### Border Radius

```css
--radius:    8px   /* Buttons, small components */
--radius-lg: 14px  /* Cards, large components */
```

### Transitions & Animations

```css
--transition:      0.3s cubic-bezier(0.4, 0, 0.2, 1)  /* Standard */
--transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1)  /* Slow reveal */
```

---

## Component Library

### Navigation Bar

#### Structure

- **Fixed positioning** at `top: 0` with `z-index: 1000`
- **Padding:** `0.9rem 0` with `padding-top: 10px` (offset for progress bar)
- **Container:** flexbox, space-between alignment

#### States

1. **Default (scrolled out of view)**
   - Solid background color
   - Links in secondary color
   - Thin border-bottom: none

2. **Scrolled**
   - Backdrop blur (24px)
   - Background opacity: 0.92
   - Thin 1px border-bottom

#### Components

**Brand Logo**
```html
<a href="#" class="nav-brand">any<span>wise</span></a>
```
- First part in primary text color
- "wise" in accent color

**Navigation Links**
```html
<ul class="nav-links">
  <li><a href="#section">Link</a></li>
  ...
  <li><a href="#cta" class="nav-cta"><span>CTA Button</span></a></li>
  <li><button class="theme-toggle">☀</button></li>
</ul>
```

**Link Features:**
- Underline animation on hover (gradient)
- `:focus-visible` outline (2px accent, 4px offset)
- Gap between links: 2rem

**CTA Button**
- Green accent background
- Shiny hover effect (conic-gradient animation)
- `:focus-visible` outline (2px primary text, 2px offset)
- Transform on hover: `translateY(-1px)`

**Theme Toggle Button**
- Minimalist: no background, border only
- `:focus-visible` outline
- Emoji content: ☀ (light) / ☾ (dark)

**Mobile Hamburger Menu**
- Hidden by default, shown at 768px breakpoint
- Three-line icon that transforms to X on active
- `aria-expanded` and `aria-controls` for accessibility

#### Responsive Breakpoints

- **Desktop (1024px+):** Full nav visible, hamburger hidden
- **Tablet (768px–1024px):** Nav links hidden, hamburger visible, mobile menu overlay
- **Mobile (<768px):** Same as tablet

#### Mobile Menu Overlay

- Full-width, full-height overlay
- Backdrop blur background
- Slides in from top
- Z-index above nav bar

### Scroll Progress Bar

- **Fixed at top** (`top: 0`)
- **Height:** 2px
- **Z-index:** 1001 (above nav's 1000)
- **Gradient:** `--gradient-al` (green to lime)
- **Width driven by:** CSS custom property `--scroll-progress` (calculated via JS)

```js
// JavaScript
const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) || 0;
document.documentElement.style.setProperty('--scroll-progress', scrollPercent);
```

### Hero Section

#### Layout

- **Full viewport height** (`min-height: 100vh`)
- **Flexbox:** align content to bottom (`align-items: flex-end`)
- **Padding bottom:** 4rem
- **Z-index layering:**
  - Globe container: `z-index: 0`
  - Overlay gradient: `z-index: 2`
  - Text content: `z-index: 3`

#### Background

- **3D Globe** (Three.js)
  - Theme-aware texture (day/night)
  - Rotated to show Australia
  - Reacts to scroll zoom (scales with `--globeScrollProgress`)

- **Gradient Overlays** (two layers)
  1. Dark fade (to top): `rgba(0,0,0,0.92) → 0% to rgba(0,0,0,0.4) → 100%`
  2. Green tint at bottom (40% height): `rgba(57,168,73,0.06)`

#### Typography Animation

1. **Tagline (rotating)** 
   - 3 values that cycle every 9 seconds
   - Monospace, uppercase, faint
   - Keyword animation: `taglineRotate`

2. **Main Heading (line-by-line reveal)**
   - Each line starts with `transform: translateY(115%)`
   - On scroll-in-view, animates to `translateY(0)`
   - First line: no delay
   - Second line: 0.18s delay
   - Contains italic `<em>` with full gradient

3. **Subheading (fade + translate)**
   - Starts: `opacity: 0, transform: translateY(15px)`
   - On scroll-in-view: `opacity: 1, transform: translateY(0)`
   - Delay: 0.4s

#### Stats Bar

- **Backdrop blur** bar with 3 stat boxes
- **Flex layout:** equal-width boxes with right borders
- **Last box:** no border-right
- **Animation on hero in-view:** staggered reveal (0.35s, 0.45s, 0.55s)

### Buttons

#### Button Base

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.84rem;
  position: relative;
  overflow: hidden;
}
```

#### Primary Button (Outlined)

- **Background:** transparent
- **Border:** 1px `rgba(255,255,255,0.12)`
- **Hover:** border lightens, subtle background tint
- **Transform hover:** `translateY(-2px)`

#### Accent Button (Green/Lime)

- **Background:** `--accent` color
- **Shiny effect:** conic-gradient animation rotating 360° over 3s
- **Hover states:**
  - Opacity glow on shine layer
  - Gradient overlay opacity
  - Box-shadow: `0 6px 24px rgba(57,168,73,0.35), 0 0 20px rgba(57,168,73,0.15)`
  - Transform: `translateY(-2px)`

### Cards (Generic Pattern)

#### Base Card

```css
.card {
  padding: 2rem–2.2rem;
  border: 1px solid rgba(color, opacity);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  transition: transform 0.4s, box-shadow 0.4s, border-color 0.4s;
  position: relative;
  overflow: hidden;
}
```

#### Capability Card Variant

- **Dark green gradient background** (145deg angle)
- **Left accent border:** 3px lime
- **Spotlight effect on hover** (radial gradient following cursor position)
- **Top line gradient on hover** (scaleX from left)
- **Hover transform:** `translateY(-6px)`
- **Hover shadow:** `0 12px 40px rgba(0,0,0,0.35), 0 0 50px rgba(57,168,73,0.15)`

#### Product Card Variant

- **Image wrapper** with fixed aspect ratio
- **Body** with tag, title, description
- **Hover shadow:** `0 12px 40px rgba(0,0,0,0.1)`

#### News Card Variant

- **Link element** with image thumbnail
- **Date and title** in body
- **Arrow indicator** that appears on hover
- **Hover shadow:** `0 4px 16px rgba(0,0,0,0.08)`

---

## Page Sections

### Section Template Structure

```html
<section id="section-id" class="section-name">
  <div class="container">
    <p class="label">SECTION LABEL</p>
    <h2>Section Heading</h2>
    <!-- Content -->
  </div>
</section>
```

### 1. Purpose & Values Section

- **Centered text layout**
- **Heading:** Large, gradient text for emphasis
- **Values list:** Three rows, each with:
  - `value-name` (colored, nowrap, fixed width)
  - `value-dash` (visual divider)
  - `value-desc` (flexible text)

**Desktop width:** 18rem for name  
**Tablet width:** 12rem for name  
**Mobile width:** auto, wraps

### 2. Capabilities Section

- **3-column grid** (desktop)
- **2-column grid** (tablet, 768px–1024px)
- **1-column grid** (mobile, <768px)
- **Card pattern:** see above

**Content per card:**
- Number/label (01 — Capability)
- Heading (h3)
- Description (p)

### 3. Approach Section

- **2-column layout** (left text, right numbered list)
- **Left column:** label, heading, description, bullet list
- **Right column:** 4 numbered items with titles and descriptions
- **Reveal animations:** left (reveal-left), right (reveal-right)

### 4. Products Section

- **Header area** with label, title, intro text
- **Main grid:** 3 columns (3-1 layout — 3 items top, 1 below)
- **Card variant:** image top, body below with tag, title, highlights

**Desktop:** 3-column grid, then 1-column  
**Tablet:** 2-column grid  
**Mobile:** 1-column

### 5. Track Record Section

- **4-column stat layout**
- **Each stat:** heading (data counter), description
- **Animation:** counter increments on scroll-in-view

### 6. Team Section

- **2-column grid** (left text, right image)
- **Text:** label, heading with emphasis, subheading, 2 paragraphs
- **Image:** full-width responsive

### 7. News/Insights Section

- **4-card grid** (responsive to 2-column, 1-column)
- **Card:** image thumbnail, date, title with arrow
- **Link:** wraps entire card

### 8. CTA Section

- **Box pattern** (reveal-scale animation)
- **2-column layout:** text on left, image on right
- **Text:** heading, description, 2 buttons (primary + accent)
- **Image:** responsive

---

## Interactive Features

### Theme Toggle System

#### Detection & Initialization

```js
// Inline IIFE (runs before DOM paint)
(function() {
  var stored = localStorage.getItem('anywise-theme');
  var isLight;
  
  if (stored === 'light' || stored === 'dark') {
    isLight = stored === 'light';
  } else {
    // Fallback: Sydney timezone-based auto-detection
    isLight = false;
    try {
      var hour = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
      ).getHours();
      isLight = hour >= 6 && hour < 18;
    } catch(e) {}
  }
  
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = isLight ? '#f5f6f3' : '#0e110e';
})();
```

#### Toggle Handler

```js
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#f5f6f3' : '#0e110e';
  themeToggle.textContent = theme === 'light' ? '☾' : '☀';
  localStorage.setItem('anywise-theme', theme);
  if (window.updateGlobeTheme) window.updateGlobeTheme(theme === 'light');
}
```

#### Globe Theme Reactivity

- **Stub pattern:** Define dummy `window.updateGlobeTheme` in inline script
- **Module loads:** Three.js module replaces stub with real function
- **Texture switching:** Async load new texture, defer material update until GPU-ready
- **Lighting changes:** Ambient, directional, point lights adjust intensity
- **Glow shader:** Completely replaced (not mutated) with new material

### Scroll Event Handler

#### Performance Optimization

```js
let cachedHeroHeight = null;

window.addEventListener('resize', () => {
  cachedHeroHeight = null;  // Invalidate cache on resize
});

window.addEventListener('scroll', () => {
  const heroHeight = cachedHeroHeight || document.getElementById('hero').offsetHeight;
  if (!cachedHeroHeight) cachedHeroHeight = heroHeight;
  
  // Progress bar
  const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) || 0;
  document.documentElement.style.setProperty('--scroll-progress', scrollPercent);
  
  // Nav scrolled state
  const nav = document.querySelector('nav');
  if (window.scrollY > heroHeight * 0.3) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  // Scroll reveal animations
  updateRevealElements();
}, { passive: true });
```

**Key points:**
- `offsetHeight` cached and invalidated on resize
- `{ passive: true }` prevents layout thrashing
- Only DOM mutations happen in scroll loop

### Scroll Reveal Animations

#### IntersectionObserver Pattern

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
      entry.target.classList.add('visible');
      // Mark as done so it doesn't re-trigger
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  observer.observe(el);
});
```

#### Animation Classes

| Class | Transform | Opacity | Delay |
|-------|-----------|---------|-------|
| `.reveal` | `translateY(30px)` | 0 → 1 | varies |
| `.reveal-left` | `translateX(-40px)` | 0 → 1 | varies |
| `.reveal-right` | `translateX(40px)` | 0 → 1 | varies |
| `.reveal-scale` | `scale(0.92)` | 0 → 1 | varies |

**Transition timing:** 0.7s easing

### Label & Divider Animations

#### Section Label

```css
.label::before {
  width: 0;
  height: 1px;
  background: var(--gradient-al);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.label.visible::before {
  width: 2rem;  /* Animates gradient line in from left */
}
```

#### Section Divider

```css
.section-divider::after {
  width: 0;
  background: var(--gradient-al);
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.section-divider.visible::after {
  width: 100%;  /* Full-width gradient sweeps across */
}
```

### Mobile Menu Toggle

```js
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
  const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
  mobileToggle.setAttribute('aria-expanded', !isOpen);
  navLinks.classList.toggle('open');
  mobileToggle.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    mobileToggle.classList.remove('active');
  });
});
```

### Counter Animation (Track Section)

```js
const counters = document.querySelectorAll('.counter');
let isAnimating = false;

const animateCounters = () => {
  if (isAnimating) return;
  isAnimating = true;
  
  counters.forEach(counter => {
    const target = parseInt(counter.parentElement.dataset.count);
    const suffix = counter.parentElement.dataset.suffix || '';
    let current = 0;
    const increment = target / 50;  // 50 frames to animate
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + suffix;
      }
    };
    updateCounter();
  });
};

// Trigger on scroll-in-view
const trackSection = document.getElementById('track');
const trackObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    trackObserver.unobserve(trackSection);
  }
}, { threshold: 0.5 });
trackObserver.observe(trackSection);
```

### Three.js Globe

#### Initialization

- **Scene:** PerspectiveCamera looking at sphere
- **Sphere:** 64×64 resolution, lit with 3 light sources
- **Textures:** Two URLs (day/night, swapped on theme toggle)
- **Rotation:** Fixed Y rotation to show Australia
- **Glow:** Atmospheric glow layer with custom shader

#### Theme Reactivity

```js
function updateGlobeTheme(newIsLight) {
  isLight = newIsLight;
  
  // Clear color (background)
  renderer.setClearColor(isLight ? 0xf5f6f3 : 0x0a0d0a, 1);
  
  // Texture swap (deferred to GPU-ready callback)
  const oldTexture = earthMaterial.map;
  loadEarthTexture(isLight, (newTex) => {
    earthMaterial.map = newTex;
    earthMaterial.needsUpdate = true;
    if (oldTexture) oldTexture.dispose();
  });
  
  // Glow shader swap
  const oldGlowMat = glowMesh.material;
  glowMesh.material = makeGlowMaterial(isLight);
  oldGlowMat.dispose();
  
  // Lighting
  ambientLight.intensity = isLight ? 0.8 : 0.6;
  directionalLight.intensity = isLight ? 3.5 : 2.5;
  directionalLight.position.set(isLight ? 5 : -5, 3, 5);
  greenLight.intensity = isLight ? 0.3 : 0.8;
}
```

#### Scroll Zoom Effect

```js
// In animation loop
const progress = window.__globeScrollProgress || 0;
const zoomDistance = baseDistance - progress * 0.7;
camera.position.z = Math.max(zoomDistance, 1.2);
```

---

## Responsive Design

### Breakpoint Strategy

```css
/* Mobile-first approach */
/* Base: 320px–767px */

/* Tablet: 768px–1023px */
@media (min-width: 768px) {
  /* Adjust layouts, spacing, font sizes */
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  /* Full-featured layouts */
}
```

### Key Responsive Changes

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Nav | Hamburger | Hamburger | Full links |
| Hero H1 | `clamp(3rem, 5.5vw, 4.5rem)` | — | — |
| Capabilities Grid | 1-col | 2-col | 3-col |
| Products Grid | 1-col | 2-col | 3-1 layout |
| Approach Grid | 1-col | 1-col | 2-col |
| Value Name Width | auto | 12rem | 18rem |
| Container Padding | 1rem | 2rem | 2rem |

### Mobile-Specific Styles

```css
@media (max-width: 768px) {
  /* Hide desktop elements */
  .desktop-only { display: none; }
  
  /* Adjust spacing */
  section { padding: 3rem 0; }
  
  /* Stack layouts */
  .grid { grid-template-columns: 1fr; }
}
```

### Touch Targets

- **Minimum height:** 44px (button, nav links, interactive elements)
- **Padding around clickable areas:** ≥8px
- **No hover states on mobile** — use `:focus-visible` for keyboard nav

---

## Performance & Accessibility

### Accessibility Features

#### ARIA Attributes

```html
<!-- Theme toggle -->
<button aria-label="Toggle theme" title="Toggle light/dark mode">☀</button>

<!-- Mobile menu -->
<button aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
  <span></span><span></span><span></span>
</button>

<!-- Progress bar -->
<div class="scroll-progress" aria-hidden="true"></div>

<!-- Globe -->
<div id="globe-container" aria-hidden="true"></div>
```

#### Keyboard Navigation

- All interactive elements reachable via Tab
- `:focus-visible` outline on all buttons/links
- Outline offset: 2px–4px for breathing room
- Outline color: accent green for visibility

#### Screen Reader Support

- Semantic HTML (`<nav>`, `<section>`, `<h1>`–`<h6>`, `<button>`)
- `aria-label` on icon-only buttons
- `aria-expanded` on toggle buttons
- `aria-controls` linking toggle to target element
- `aria-hidden="true"` on decorative elements (globe, progress bar, tagline)

#### Motion Preferences

```js
const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
  .reveal, .reveal-left, .reveal-right, .reveal-scale { opacity: 1; transform: none; }
  @keyframes taglineRotate { 0%, 100% { transform: none; } }
}
```

### Performance Optimizations

#### Lazy Loading

- Images below hero: `loading="lazy"` attribute
- Scroll event: `{ passive: true }` flag to prevent blocking
- IntersectionObserver for animations (no scroll listener)

#### Resource Loading

```html
<!-- Preconnect to fonts -->
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Font display strategy -->
<link href="..." rel="stylesheet"> <!-- display=swap by default -->

<!-- Three.js importmap -->
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
  }
}
</script>
```

#### CSS Optimizations

- **CSS Custom Properties:** Single source of truth, no duplication
- **Transform-only animations:** `transform` and `opacity` use compositor thread
- **Explicit transitions:** Listed properties, not `transition: all`
- **Will-change:** Applied sparingly (cards, animated elements)

#### JavaScript Optimizations

- **Inline theme setup:** Executes before first paint, prevents flash
- **Cached measurements:** `offsetHeight` cached and invalidated on resize
- **RAF for scroll calculations:** Synced with frame rate
- **Passive event listeners:** `{ passive: true }` on scroll, resize
- **Single observer:** One IntersectionObserver for all reveals

---

## Implementation Patterns

### Theme System Wiring

1. **Detect preference** (inline IIFE, before `</head>`)
   - Check localStorage
   - Fallback to Sydney timezone-based auto-detection
   - Set `data-theme` attribute on `<html>`

2. **CSS responds to `data-theme`**
   - Light mode overrides are `[data-theme="light"] selector { ... }`
   - Dark mode is default (no wrapper needed)

3. **Toggle button updates**
   - Click handler calls `applyTheme('light'|'dark')`
   - Updates `localStorage`, `data-theme`, button text
   - Calls `window.updateGlobeTheme()` if available

4. **Three.js module**
   - Stub defined in inline script (queues pending theme)
   - Module loads, replaces stub with real function
   - Flushes pending theme if one arrived before module loaded

### Scroll Animation Wiring

1. **IntersectionObserver** detects elements entering viewport
2. **Adds `.visible` class** when threshold met
3. **CSS transitions** kick off (0.7s duration)
4. **JS can optionally trigger** additional effects (counters, etc.)

### Component Customization Guide

#### Changing Brand Colors

Find and replace in CSS custom properties:

```css
:root {
  --apple:       #39a849;     /* Change here */
  --lime:        #c3e01b;     /* And here */
  --mint:        #2d7f36;     /* And here */
  --accent:      var(--apple);  /* Derived from --apple */
  
  /* Light mode overrides */
  --accent:      #2d7f36;  /* Inverted color */
}
```

#### Adding a New Section

1. Copy section template structure
2. Use grid system (1-col mobile, 2-col tablet, 3-col desktop)
3. Add reveal animation classes (`.reveal`, `.reveal-left`, etc.)
4. Include label and heading
5. Observer will auto-detect and animate

#### Customizing Hero Background

- Replace Three.js globe with static image, video, or canvas
- Maintain gradient overlay for text legibility
- Keep responsive sizing (`min-height: 100vh`)

#### Adjusting Breakpoints

Default: 768px (mobile/desktop divide)

To change:
```css
/* Old: 768px */
/* New: 1024px */
@media (max-width: 1024px) { /* Was 768px */ }
@media (min-width: 1024px) { /* Was 768px */ }
```

---

## Skill Activation Guide

This library is designed to be used as a Claude Code skill for rapid website generation.

### Usage Flow

1. **Skill invoked** with business context and content
2. **Content mapped** to section templates
3. **Hero section** customized (globe, background, copy)
4. **Component variants** selected (card styles, button types)
5. **Color scheme** applied (brand colors, gradients)
6. **HTML generated** from templates
7. **CSS customized** (colors, spacing, responsive tweaks)
8. **JavaScript wired up** (theme, scroll, interactions)
9. **Accessibility verified** (WCAG 2.1 Level AA)
10. **Performance tested** (Lighthouse, Core Web Vitals)

### Customization Checklist

- [ ] Brand colors (primary, accent, gradients)
- [ ] Logo and nav links
- [ ] Hero heading, tagline, CTA
- [ ] Hero background (globe, image, video)
- [ ] Section content (capabilities, approach, products, team, etc.)
- [ ] Product cards (images, descriptions)
- [ ] Team image
- [ ] Contact/CTA copy and email
- [ ] News/insights links
- [ ] Footer (credentials, social, links)
- [ ] Favicon and metadata

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-31 | Initial library creation from Anywise v5 website |

