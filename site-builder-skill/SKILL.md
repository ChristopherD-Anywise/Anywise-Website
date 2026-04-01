---
name: site-builder
description: When a user explicitly mentions they want to use a templated system to build a website, use this skill to guide them through building a complete, high-performance landing page. The skill takes company/product information as input, asks guided questions about color scheme and sections needed, suggests a 3D globe design via the 21st dev MCP if relevant, and generates a production-ready single-file HTML website. Use this skill whenever the user says they want to "use a template", "generate a website", "build a landing page with a template system", or similar. The skill is designed for one-shot generation with iterative refinement — user can request specific improvements and the skill regenerates the affected sections.
compatibility: Requires access to the 21st dev MCP for globe design suggestions
---

# Site Builder Skill

## Overview

This skill converts company/product information into a complete, production-ready landing page website using the Anywise Website Builder Library as the foundation. It's a guided, one-shot generation tool with iterative refinement — the user provides information once, the skill generates a full HTML file, and they can request specific improvements to sections without regenerating the entire site.

---

## The Process

### Phase 1: Information Gathering

Ask the user to provide:

1. **Company/Product Basics**
   - Company/product name
   - One-line tagline or mission statement
   - Industry/domain

2. **Content for Key Sections**
   - **Purpose & Values:** 2–3 core values or company principles
   - **Capabilities:** 3 key capabilities/offerings (bullet points or short descriptions)
   - **Approach:** 2–3 paragraphs describing methodology or philosophy
   - **Products/Services:** 3–4 product or service offerings (name + 1-sentence description each)
   - **Track Record:** 3–4 metrics or achievements (e.g., "500+ clients", "99.9% uptime")
   - **Team:** Optional — team size, expertise summary (or skip this section)
   - **News/Insights:** Optional — 3–4 blog post/article headlines and URLs (or skip)
   - **CTA (Call-to-Action):** What should the main CTA button say and link to?

**Format expectation:** Plain text, bullet points, or paragraphs — user doesn't need to worry about HTML.

---

### Phase 2: Design Questions

Ask these in order (group logically):

**Group A: Color & Visual Identity**

1. **Primary Brand Color**
   - "What's your primary brand color?" (provide hex, RGB, or color name)
   - Skill defaults to green (#39a849) if not specified.

2. **Secondary Colors (Optional)**
   - "Any accent or secondary colors you want to feature?" (optional, but valuable for visual hierarchy)

3. **Visual Tone**
   - "How would you describe your brand's visual personality?" (Choose 1–2: Modern & Minimalist, Bold & Energetic, Professional & Corporate, Playful & Creative, Organic & Natural)
   - This informs accent gradients, spacing, animation intensity

**Group B: Sections & Content Structure**

4. **Required Sections Checklist**
   - Present list: Purpose & Values, Capabilities, Approach, Products, Track Record, Team, News/Insights
   - "Which sections should we include?" (Let them deselect optional ones; all are included by default)

5. **Hero Section Style**
   - "How should the hero (main banner) feel?" (Choose 1: Bold statement with imagery, Minimalist with focus on text, Dynamic with animated elements)
   - This affects headline size, spacing, and visual emphasis

**Group C: Interactive Features**

6. **3D Globe in Hero**
   - "Your site can include an interactive 3D globe in the hero section. Would you like one?"
   - If YES: 
     - "What aspect of your company/product does the globe represent?" (e.g., global reach, environmental focus, technology, space/innovation)
     - Use 21st dev MCP to suggest 3–4 globe design options (texture themes, lighting, glow colors) relevant to their industry/vision
     - Present options (e.g., "Tech-inspired dark globe with blue glow", "Earth-textured with green lighting", "Minimalist wireframe globe", "Neon-themed globe")
     - User picks preferred option
   - If NO: "We can replace the globe with a static hero graphic, animated gradient background, or simple text focus. Which appeals to you?"

7. **Scroll Animations**
   - "Should content fade in and slide as users scroll down the page?" (Yes/No)
   - Most sites benefit, but can be disabled for accessibility preference or cleaner feel

**Group D: Call-to-Action & Footer**

8. **Primary CTA Button**
   - "What should your main CTA button say?" (e.g., "Get Started", "Request Demo", "Learn More")
   - "Where should it link?" (URL)

9. **Footer Content (Optional)**
   - "Any links or info you want in the footer?" (e.g., social media, company links, copyright note)
   - Skill provides sensible defaults if skipped

---

### Phase 3: Generation

Once you have information + design choices, **generate a complete HTML file** that incorporates all of the following from the Anywise Website Builder Library. Every generated website must implement all of these — they are the baseline, not options.

---

## Complete Technical Reference

This section documents every feature that MUST be included in every generated website. Read this carefully before generating HTML.

### File Architecture

**Single-file monolithic HTML** — no external dependencies except fonts and Three.js via CDN.

```
<head>
  ├── Meta tags (charset, viewport, theme-color)
  ├── Preconnect links (Fontshare, Google Fonts)
  ├── Font preload (General Sans + JetBrains Mono)
  ├── Three.js importmap
  ├── Inline <style> (ALL CSS)
  └── Inline <script> IIFE (theme detection — runs before first paint)

<body>
  ├── Scroll progress bar (aria-hidden)
  ├── <nav> (fixed, sticky)
  ├── <section class="hero"> (full viewport)
  ├── <section id="purpose">
  ├── <section id="capabilities">
  ├── <section id="approach">
  ├── <section id="products">
  ├── <section id="track"> (track record)
  ├── [<section id="team">] (optional)
  ├── [<section id="news">] (optional)
  ├── <section id="cta">
  └── <footer>

<script type="module"> (Three.js globe — bottom of body)
```

---

### CSS Custom Properties (Variables)

Define ALL of these in `:root`. They are the single source of truth for every color, spacing, and animation in the file.

```css
:root {
  /* Brand colors — replace with user's primary/secondary choices */
  --apple:          #39a849;
  --lime:           #c3e01b;
  --mint:           #2d7f36;

  /* Gradient shorthands */
  --gradient-al:    linear-gradient(135deg, var(--apple), var(--lime));
  --gradient-lm:    linear-gradient(135deg, var(--lime), var(--mint));
  --gradient-ma:    linear-gradient(135deg, var(--mint), var(--apple));
  --gradient-full:  linear-gradient(135deg, var(--mint), var(--apple), var(--lime));

  /* Dark mode surfaces (default) */
  --bg-deep:        #0a0d0a;
  --bg:             #0e110e;
  --bg-elevated:    #151a16;
  --bg-card:        #1a201b;
  --bg-card-hover:  #212822;

  /* Text */
  --text-primary:   #f2f1ee;
  --text-secondary: #9a9d95;
  --text-tertiary:  #626860;

  /* Borders */
  --border:         rgba(255,255,255,0.07);
  --border-accent:  rgba(57,168,73,0.22);

  /* Accent */
  --accent:         var(--apple);
  --accent-dim:     var(--mint);
  --accent-muted:   rgba(57,168,73,0.06);
  --accent-glow:    rgba(57,168,73,0.1);

  /* Radii */
  --radius:    8px;
  --radius-lg: 14px;

  /* Transitions */
  --transition:      0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  /* Scroll progress (set by JS) */
  --scroll-progress: 0;
}

/* Light mode overrides */
[data-theme="light"] {
  --bg-deep:        #f5f6f3;
  --bg:             #fafbf8;
  --bg-elevated:    #ffffff;
  --bg-card:        #ffffff;
  --bg-card-hover:  #f0f2ed;
  --text-primary:   #1a1d1a;
  --text-secondary: #4a5248;
  --text-tertiary:  #7a8275;
  --border:         rgba(0,0,0,0.08);
  --border-accent:  rgba(57,168,73,0.25);
  --accent:         var(--mint);       /* Inverted: darker green for contrast */
  --accent-dim:     var(--apple);
  --accent-muted:   rgba(57,168,73,0.04);
  --accent-glow:    rgba(57,168,73,0.06);
}
```

**When customizing colors for a user:** Replace `--apple`, `--lime`, `--mint` with their brand colors. All gradients and accent references inherit automatically. Re-derive `--border-accent`, `--accent-muted`, `--accent-glow` from the new primary color at appropriate opacities.

---

### Typography

```css
/* Fonts loaded via CDN */
/* General Sans: headlines + body */
/* JetBrains Mono: labels, taglines, data */

/* Font sizes (always use clamp for responsive scaling) */
.nav-brand    { font-size: 1.25rem; font-weight: 700; }
.hero h1      { font-size: clamp(3rem, 5.5vw, 4.5rem); font-weight: 800; line-height: 1.1; }
section h2    { font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 800; }
.card h3      { font-size: 1.18rem; font-weight: 700; }
.label        { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; }
.hero-tagline { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 400; }
body          { font-size: 0.88rem–1.05rem; /* use appropriate size per context */ }
```

---

### Scroll Progress Bar

```html
<div class="scroll-progress" aria-hidden="true"></div>
```

```css
.scroll-progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  width: calc(var(--scroll-progress) * 100%);
  background: var(--gradient-al);
  z-index: 1001;
  pointer-events: none;
}
```

```js
// In scroll handler
const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) || 0;
document.documentElement.style.setProperty('--scroll-progress', scrollPercent);
```

---

### Navigation Bar

#### Two Visual States

**Default (top of page):** No backdrop blur, no border
**Scrolled:** Backdrop blur 24px, background 92% opacity, 1px bottom border

```css
nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 0.9rem 0;
  padding-top: 10px; /* offset for progress bar */
  transition: background var(--transition), border-color var(--transition);
}

nav.scrolled {
  background: rgba(14,17,14,0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
}

[data-theme="light"] nav.scrolled {
  background: rgba(250,251,248,0.92);
}
```

#### Nav Links — Animated Underline on Hover

```css
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 1px;
  background: var(--gradient-al);
  transition: width var(--transition);
}
.nav-links a:hover::after { width: 100%; }
```

#### CTA Button — Shiny Accent Effect

```css
.nav-cta {
  background: var(--accent);
  position: relative; overflow: hidden;
}
.nav-cta::before {
  content: '';
  position: absolute; inset: 0;
  background: conic-gradient(from 0deg, transparent 0%, var(--lime) 25%, transparent 50%);
  animation: shineSpin 3s linear infinite;
  opacity: 0;
  transition: opacity var(--transition);
}
.nav-cta:hover::before { opacity: 0.4; }
.nav-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px var(--accent-glow);
}

@keyframes shineSpin { to { transform: rotate(360deg); } }
```

#### Mobile Menu

```html
<button id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
  <span></span><span></span><span></span>
</button>
```

```css
/* Three lines → X transform */
#mobileToggle span {
  display: block; width: 20px; height: 2px;
  background: var(--text-primary);
  transition: transform var(--transition), opacity var(--transition);
}
#mobileToggle.active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
#mobileToggle.active span:nth-child(2) { opacity: 0; }
#mobileToggle.active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* Mobile menu overlay */
.nav-links {
  /* On mobile: position absolute, full-width, slides down */
}
```

```js
mobileToggle.addEventListener('click', () => {
  const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
  mobileToggle.setAttribute('aria-expanded', !isOpen);
  navLinks.classList.toggle('open');
  mobileToggle.classList.toggle('active');
});
// Escape key closes
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { /* close menu */ }
});
// Click on link closes
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { /* close menu */ }));
```

---

### Hero Section

The hero ALWAYS uses the globe as a **full-viewport background** (not side-by-side with text). Text sits at the bottom of the hero, overlaid on the globe with gradient veils for legibility.

#### HTML Structure

```html
<section class="hero" id="hero">
  <div class="hero-bg" aria-hidden="true">
    <div id="globe-container"></div>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <p class="hero-tagline" aria-hidden="true"><!-- rotating tagline --></p>
    <h1>
      First line of heading<br>
      <em>gradient emphasis words</em>
    </h1>
    <p class="hero-sub">Supporting subtitle text</p>
    <div class="hero-stats" aria-label="Key metrics">
      <div class="stat"><!-- stat 1 --></div>
      <div class="stat"><!-- stat 2 --></div>
      <div class="stat"><!-- stat 3 --></div>
    </div>
  </div>
</section>
```

#### CSS — Z-Index Layering

```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end; /* content at bottom */
  padding-bottom: 4rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute; inset: 0;
  z-index: 0;
}

#globe-container {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}

.hero-overlay {
  position: absolute; inset: 0; z-index: 2;
  /* Two-layer gradient veil */
  background:
    linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%),
    linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%);
}

[data-theme="light"] .hero-overlay {
  background:
    linear-gradient(to top, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.25) 70%, rgba(255,255,255,0.4) 100%);
}

.hero-content {
  position: relative; z-index: 3;
  max-width: 1160px; margin: 0 auto;
  width: 100%; padding: 0 2rem;
}
```

#### Rotating Tagline Animation

The tagline cycles through 3 short phrases (company values or descriptors) every 9 seconds.

```css
.hero-tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem; font-weight: 400;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--text-tertiary);
  margin-bottom: 1.5rem;
  /* Uses taglineRotate animation */
}

@keyframes taglineRotate {
  0%, 28%   { content: attr(data-line-1); opacity: 1; transform: translateY(0); }
  33%       { opacity: 0; transform: translateY(-8px); }
  38%, 61%  { content: attr(data-line-2); opacity: 1; transform: translateY(0); }
  66%       { opacity: 0; transform: translateY(-8px); }
  71%, 94%  { content: attr(data-line-3); opacity: 1; transform: translateY(0); }
  99%       { opacity: 0; transform: translateY(-8px); }
}
/* Alternatively implement via JS setInterval swapping text content */
```

**Recommended JS implementation (simpler cross-browser):**
```js
const taglines = ['Value one.', 'Value two.', 'Value three.'];
let taglineIndex = 0;
const taglineEl = document.querySelector('.hero-tagline');

setInterval(() => {
  taglineEl.style.opacity = '0';
  taglineEl.style.transform = 'translateY(-8px)';
  setTimeout(() => {
    taglineIndex = (taglineIndex + 1) % taglines.length;
    taglineEl.textContent = taglines[taglineIndex];
    taglineEl.style.opacity = '1';
    taglineEl.style.transform = 'translateY(0)';
  }, 400);
}, 3000);
```

#### Hero H1 — Line-by-Line Reveal Animation

Each line of the H1 slides up from below on page load:

```css
.hero h1 {
  overflow: hidden; /* clip the translateY so lines slide in from below */
}
.hero h1 .line {
  display: block;
  transform: translateY(115%);
  transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero h1 .line:nth-child(2) { transition-delay: 0.18s; }
/* Add .line-visible class on DOMContentLoaded */
.hero h1 .line.line-visible { transform: translateY(0); }
```

```html
<!-- Wrap each line in a span -->
<h1>
  <span class="line">Building the future</span>
  <span class="line"><em>ethically engineered.</em></span>
</h1>
```

#### Hero H1 em — Gradient Text

```css
.hero h1 em {
  background: var(--gradient-full);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: normal;
}

[data-theme="light"] .hero h1 em {
  background: linear-gradient(135deg, #1a5c22, #2d7f36, #39a849);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

#### Hero Sub — Fade-In

```css
.hero-sub {
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: 0.4s;
}
.hero-sub.visible { opacity: 1; transform: translateY(0); }
```

#### Hero Stats Bar

Backdrop-blur row of 3 metrics, staggered reveal:

```css
.hero-stats {
  display: flex;
  gap: 0;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  margin-top: 2.5rem;
  overflow: hidden;
  width: fit-content;
}

[data-theme="light"] .hero-stats {
  background: rgba(0,0,0,0.04);
}

.hero-stats .stat {
  padding: 1rem 2rem;
  border-right: 1px solid var(--border);
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.hero-stats .stat:last-child { border-right: none; }
.hero-stats .stat.visible { opacity: 1; transform: translateY(0); }
.hero-stats .stat:nth-child(1) { transition-delay: 0.35s; }
.hero-stats .stat:nth-child(2) { transition-delay: 0.45s; }
.hero-stats .stat:nth-child(3) { transition-delay: 0.55s; }

.stat-value { font-size: 1.3rem; font-weight: 700; color: var(--accent); }
.stat-label { font-size: 0.75rem; color: var(--text-secondary); }
```

---

### Scroll Reveal Animations

Four animation classes — apply to any element that should animate on scroll:

```css
/* Base: hidden state */
.reveal       { opacity: 0; transform: translateY(30px);   transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-left  { opacity: 0; transform: translateX(-40px);  transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-right { opacity: 0; transform: translateX(40px);   transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-scale { opacity: 0; transform: scale(0.92);        transition: opacity 0.7s ease, transform 0.7s ease; }

/* Visible state (added by IntersectionObserver) */
.reveal.visible, .reveal-left.visible, .reveal-right.visible, .reveal-scale.visible {
  opacity: 1; transform: none;
}

/* Stagger siblings (for grid cards) */
.reveal:nth-child(2) { transition-delay: 0.1s; }
.reveal:nth-child(3) { transition-delay: 0.2s; }
.reveal:nth-child(4) { transition-delay: 0.3s; }
```

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // fire once only
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  observer.observe(el);
});
```

---

### Section Labels & Dividers

Every section has a short monospace label above the heading that animates a gradient line in from the left:

```html
<p class="label reveal">CAPABILITIES</p>
<h2>What We Do</h2>
```

```css
.label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--accent);
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 1rem;
}

.label::before {
  content: '';
  display: inline-block;
  width: 0; height: 1px;
  background: var(--gradient-al);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.label.visible::before { width: 2rem; }
```

Section dividers (horizontal rules between major sections):

```css
.section-divider {
  width: 100%; height: 1px;
  background: var(--border);
  position: relative;
}
.section-divider::after {
  content: '';
  position: absolute; inset: 0;
  width: 0;
  background: var(--gradient-al);
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.section-divider.visible::after { width: 100%; }
```

---

### Section Templates

#### Container

Every section wraps content in a container:

```html
<section id="..." class="...">
  <div class="container">
    ...
  </div>
</section>
```

```css
.container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 2rem;
}

section { padding: 5rem 0; }

@media (max-width: 768px) {
  section { padding: 3rem 0; }
  .container { padding: 0 1rem; }
}
```

---

#### Purpose & Values Section

Row-based list with fixed name column:

```html
<div class="values-list">
  <div class="value-row reveal">
    <span class="value-name">Security</span>
    <span class="value-dash">—</span>
    <span class="value-desc">End-to-end encryption and zero-knowledge architecture...</span>
  </div>
</div>
```

```css
.values-list { display: flex; flex-direction: column; gap: 1.5rem; }

.value-row {
  display: flex; align-items: baseline; gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border);
  transition: border-color var(--transition);
}
.value-row:hover { border-color: var(--border-accent); }

.value-name {
  font-weight: 700; color: var(--accent);
  white-space: nowrap;
  min-width: 18rem;   /* desktop */
}
.value-dash { color: var(--text-tertiary); }
.value-desc { color: var(--text-secondary); line-height: 1.7; flex: 1; }

@media (max-width: 1024px) { .value-name { min-width: 12rem; } }
@media (max-width: 768px)  { .value-row { flex-wrap: wrap; } .value-name { min-width: auto; width: 100%; } }
```

---

#### Capabilities Section

3-column grid with spotlight-effect cards:

```html
<div class="capabilities-grid">
  <div class="capability-card reveal" data-index="01">
    <h3>Capability Name</h3>
    <p>Description text.</p>
  </div>
</div>
```

```css
.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.capability-card {
  padding: 2.2rem;
  background: linear-gradient(145deg, var(--bg-card), var(--bg-elevated));
  border: 1px solid var(--border);
  border-left: 3px solid var(--lime);
  border-radius: var(--radius-lg);
  position: relative; overflow: hidden;
  transition: transform 0.4s, box-shadow 0.4s, border-color 0.4s;
  cursor: default;
}

/* Spotlight hover effect (mouse tracking via JS) */
.capability-card::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--accent-muted), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}
.capability-card:hover::before { opacity: 1; }

/* Top line gradient on hover */
.capability-card::after {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 0; height: 2px;
  background: var(--gradient-al);
  transition: width 0.4s;
}
.capability-card:hover::after { width: 100%; }

.capability-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35), 0 0 50px var(--accent-glow);
  border-color: var(--border-accent);
}

.capability-card .card-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--accent);
  opacity: 0.7;
  margin-bottom: 1rem;
}

@media (max-width: 1024px) { .capabilities-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .capabilities-grid { grid-template-columns: 1fr; } }
```

**Mouse tracking for spotlight (JS):**
```js
document.querySelectorAll('.capability-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});
```

---

#### Approach Section

2-column layout: left column = label + heading + description, right column = numbered list:

```html
<div class="approach-grid">
  <div class="approach-left reveal-left">
    <p class="label">OUR APPROACH</p>
    <h2>How We Think</h2>
    <p>Description text...</p>
  </div>
  <div class="approach-right reveal-right">
    <div class="approach-item">
      <span class="approach-num">01</span>
      <div>
        <h4>Step title</h4>
        <p>Explanation</p>
      </div>
    </div>
    <!-- more items -->
  </div>
</div>
```

```css
.approach-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 5rem; align-items: start;
}

.approach-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem; color: var(--accent);
  font-weight: 500; min-width: 2rem;
}

.approach-item {
  display: flex; gap: 1.5rem; align-items: flex-start;
  padding: 1.2rem 0; border-bottom: 1px solid var(--border);
}

@media (max-width: 768px) { .approach-grid { grid-template-columns: 1fr; gap: 2.5rem; } }
```

---

#### Products Section

Image cards with tag, title, description:

```html
<div class="products-grid">
  <div class="product-card reveal">
    <div class="product-image-wrap">
      <!-- image or gradient placeholder -->
    </div>
    <div class="product-body">
      <span class="product-tag">Category</span>
      <h3>Product Name</h3>
      <p>One sentence description.</p>
    </div>
  </div>
</div>
```

```css
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform 0.4s, box-shadow 0.4s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
}

.product-image-wrap {
  width: 100%; aspect-ratio: 16/9;
  background: linear-gradient(135deg, var(--bg-elevated), var(--bg-card));
  /* Use gradient if no image available */
}

.product-body { padding: 1.5rem; }
.product-tag { font-size: 0.72rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }

@media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .products-grid { grid-template-columns: 1fr; } }
```

---

#### Track Record Section

4-stat layout with **counter animation** (numbers count up on scroll-in-view):

```html
<div class="track-grid">
  <div class="track-stat" data-count="500" data-suffix="+">
    <span class="counter">0</span><span class="suffix">+</span>
    <p class="stat-label">Enterprise clients</p>
  </div>
</div>
```

```css
.track-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 2rem; text-align: center;
}

.track-stat { padding: 2rem; border: 1px solid var(--border); border-radius: var(--radius-lg); }

.counter {
  font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 800;
  color: var(--accent); line-height: 1;
}

@media (max-width: 1024px) { .track-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .track-grid { grid-template-columns: repeat(2, 1fr); } }
```

**Counter JS:**
```js
const animateCounters = (() => {
  let fired = false;
  return () => {
    if (fired) return;
    fired = true;
    document.querySelectorAll('.track-stat').forEach(stat => {
      const target = parseInt(stat.dataset.count);
      const suffix = stat.dataset.suffix || '';
      const counter = stat.querySelector('.counter');
      let current = 0;
      const increment = target / 60;
      const update = () => {
        current = Math.min(current + increment, target);
        counter.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(update);
        else counter.textContent = target;
      };
      requestAnimationFrame(update);
    });
  };
})();

const trackObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    trackObserver.unobserve(entries[0].target);
  }
}, { threshold: 0.5 });
trackObserver.observe(document.getElementById('track'));
```

---

#### CTA Section

Reveal-scale box, 2-column: text + buttons left, image right:

```html
<section id="cta">
  <div class="container">
    <div class="cta-box reveal-scale">
      <div class="cta-text">
        <p class="label">GET STARTED</p>
        <h2>Ready to begin?</h2>
        <p>Supporting copy.</p>
        <div class="cta-buttons">
          <a href="..." class="btn btn-accent">Primary CTA</a>
          <a href="..." class="btn btn-outline">Secondary</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

```css
.cta-box {
  padding: 4rem;
  background: linear-gradient(135deg, var(--bg-elevated), var(--bg-card));
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-lg);
}

.cta-buttons { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem; }
```

---

### Button System

#### Base

```css
.btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.75rem 1.8rem;
  border-radius: var(--radius);
  font-weight: 600; font-size: 0.84rem;
  text-decoration: none;
  position: relative; overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  cursor: pointer;
}
.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}
```

#### Accent Button (Primary CTA)

```css
.btn-accent {
  background: var(--accent);
  color: white; border: 1px solid transparent;
}
.btn-accent::before {
  content: '';
  position: absolute; inset: 0;
  background: conic-gradient(from 0deg, transparent 0%, var(--lime) 25%, transparent 50%);
  animation: shineSpin 3s linear infinite;
  opacity: 0; transition: opacity var(--transition);
}
.btn-accent:hover::before { opacity: 0.4; }
.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(57,168,73,0.35), 0 0 20px rgba(57,168,73,0.15);
}
```

#### Outline Button (Secondary)

```css
.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(255,255,255,0.12);
}
.btn-outline:hover {
  border-color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.04);
  transform: translateY(-2px);
}
[data-theme="light"] .btn-outline { border-color: rgba(0,0,0,0.15); }
[data-theme="light"] .btn-outline:hover { border-color: rgba(0,0,0,0.3); background: rgba(0,0,0,0.03); }
```

---

### Scroll Event Handler

```js
// Cache offsetHeight to avoid repeated layout reads
let cachedHeroHeight = null;
window.addEventListener('resize', () => { cachedHeroHeight = null; }, { passive: true });

window.addEventListener('scroll', () => {
  const heroHeight = cachedHeroHeight || (cachedHeroHeight = document.getElementById('hero')?.offsetHeight || 600);

  // Progress bar
  const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) || 0;
  document.documentElement.style.setProperty('--scroll-progress', scrollPercent);

  // Nav scrolled state
  document.querySelector('nav').classList.toggle('scrolled', window.scrollY > heroHeight * 0.3);
}, { passive: true });
```

---

### Theme System

#### Inline IIFE (before `</head>` — prevents flash of wrong theme)

```html
<script>
  (function() {
    var stored = localStorage.getItem('anywise-theme');
    var isLight;
    if (stored === 'light' || stored === 'dark') {
      isLight = stored === 'light';
    } else {
      isLight = false;
      try {
        var hour = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })).getHours();
        isLight = hour >= 6 && hour < 18;
      } catch(e) {}
    }
    document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = isLight ? '#f5f6f3' : '#0e110e';
    // Queuing stub replaced by Three.js module on load
    window.updateGlobeTheme = function(light) { window.__pendingGlobeTheme = light; };
  })();
</script>
```

#### Toggle Handler (in main script block)

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
themeToggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
});
// Set initial toggle icon
applyTheme(document.documentElement.dataset.theme);
```

---

### Three.js Globe (ES Module)

Load at bottom of `<body>` as `<script type="module">`. The globe fills the entire hero as a full-viewport background.

#### importmap (in `<head>`)

```html
<script type="importmap">
  { "imports": { "three": "https://unpkg.com/three@0.170.0/build/three.module.js" } }
</script>
```

#### Full Module Template

```js
import * as THREE from 'three';

let isLight = document.documentElement.dataset.theme === 'light';

const container = document.getElementById('globe-container');
if (!container) throw new Error('No globe container');

const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene = new THREE.Scene();

// Camera — wide FOV fills container
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.z = 1.9;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(isLight ? 0xf5f6f3 : 0x0a0d0a, 1);
container.appendChild(renderer.domElement);

// Earth sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);
const textureLoader = new THREE.TextureLoader();

function loadEarthTexture(light, onLoad) {
  const tex = textureLoader.load(
    light
      ? 'https://unpkg.com/three-globe@2.41.12/example/img/earth-blue-marble.jpg'
      : 'https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg',
    (loadedTex) => {
      if (onLoad) onLoad(loadedTex);
      renderer.render(scene, camera);
    }
  );
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const earthTexture = loadEarthTexture(isLight);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 1, metalness: 0 });
const earth = new THREE.Mesh(geometry, earthMaterial);
earth.rotation.y = -2.32; // face Australia (~133°E)
earth.rotation.x = 0.44;  // tilt for southern hemisphere
scene.add(earth);

// Atmospheric glow (shader — replaced on theme toggle, not mutated)
const glowGeometry = new THREE.SphereGeometry(1.02, 64, 64);

function makeGlowMaterial(light) {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: light ? `
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
    // ↑ Customize fragment shader colors to match brand glow color
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
}

const glowMesh = new THREE.Mesh(glowGeometry, makeGlowMaterial(isLight));
scene.add(glowMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.8 : 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, isLight ? 3.5 : 2.5);
directionalLight.position.set(isLight ? 5 : -5, 3, 5);
scene.add(directionalLight);

const accentLight = new THREE.PointLight(0x39a849, isLight ? 0.3 : 0.8, 10);
// ↑ Replace 0x39a849 with brand glow color
accentLight.position.set(2, 1, 3);
scene.add(accentLight);

// Theme update — called by applyTheme() in main script
function updateGlobeTheme(newIsLight) {
  isLight = newIsLight;
  renderer.setClearColor(isLight ? 0xf5f6f3 : 0x0a0d0a, 1);
  
  // Texture swap — deferred so old texture stays visible until new one loads
  const oldTexture = earthMaterial.map;
  loadEarthTexture(isLight, (newTex) => {
    earthMaterial.map = newTex;
    earthMaterial.needsUpdate = true;
    if (oldTexture) oldTexture.dispose();
  });
  
  // Glow — replace material entirely (can't swap fragmentShader at runtime)
  const oldGlowMat = glowMesh.material;
  glowMesh.material = makeGlowMaterial(isLight);
  oldGlowMat.dispose();
  
  // Lighting
  ambientLight.intensity = isLight ? 0.8 : 0.6;
  directionalLight.intensity = isLight ? 3.5 : 2.5;
  directionalLight.position.set(isLight ? 5 : -5, 3, 5);
  accentLight.intensity = isLight ? 0.3 : 0.8;
}

// Register real function, flush any pending theme change that arrived before module loaded
window.updateGlobeTheme = updateGlobeTheme;
if (window.__pendingGlobeTheme !== undefined) {
  updateGlobeTheme(window.__pendingGlobeTheme);
  delete window.__pendingGlobeTheme;
}

// Scroll zoom effect — camera zooms in as user scrolls
const baseDistance = 1.9;
let isVisible = true;

function animate() {
  requestAnimationFrame(animate);
  if (!isVisible) return;
  if (!prefersRM) {
    earth.rotation.y += 0.0008;
    glowMesh.rotation.y += 0.0008;
  }
  // Scroll-based zoom
  const progress = window.__globeScrollProgress || 0;
  camera.position.z = Math.max(baseDistance - progress * 0.7, 1.2);
  renderer.render(scene, camera);
}

// Scroll progress fed to globe
window.addEventListener('scroll', () => {
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    window.__globeScrollProgress = Math.min(window.scrollY / heroEl.offsetHeight, 1);
  }
}, { passive: true });

// Pause animation when off-screen
const obs = new IntersectionObserver(entries => {
  isVisible = entries[0].isIntersecting;
}, { threshold: 0 });
obs.observe(container);

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

animate();
```

**Customizing glow color for brand:** Change the `vec4(r, g, b, 1.0)` values in the fragment shader and the `0x39a849` hex in `accentLight` to match the brand's primary color.

---

### Accessibility

Every generated site MUST include all of:

```html
<!-- Scroll progress bar: decorative -->
<div class="scroll-progress" aria-hidden="true"></div>

<!-- Globe: decorative -->
<div id="globe-container" aria-hidden="true"></div>

<!-- Rotating tagline: decorative -->
<p class="hero-tagline" aria-hidden="true"></p>

<!-- Mobile toggle: -->
<button id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">

<!-- Theme toggle: -->
<button id="themeToggle" aria-label="Toggle light/dark theme">

<!-- Skip link (first element in body): -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
/* Skip link */
.skip-link {
  position: absolute; top: -40px; left: 1rem;
  background: var(--accent); color: white;
  padding: 0.5rem 1rem; border-radius: var(--radius);
  font-weight: 600; text-decoration: none;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus { top: 1rem; }

/* Focus indicators on all interactive elements */
a:focus-visible, button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}
```

---

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .reveal, .reveal-left, .reveal-right, .reveal-scale {
    opacity: 1 !important;
    transform: none !important;
  }
  .hero h1 .line { transform: none; }
  .hero-sub { opacity: 1; transform: none; }
  .hero-stats .stat { opacity: 1; transform: none; }
}
```

```js
// Disable globe rotation for reduced motion
const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Used in animate() loop: if (!prefersRM) { earth.rotation.y += 0.0008; }
```

---

### Responsive Breakpoints

Mobile-first approach:

```css
/* Mobile base: <768px — 1 column, compact spacing, hamburger */
/* Tablet: 768px — 2 columns, medium spacing */
/* Desktop: 1024px — 3 columns, full spacing */

@media (min-width: 768px)  { /* tablet adjustments */ }
@media (min-width: 1024px) { /* desktop adjustments */ }
```

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Nav | Hamburger menu | Hamburger menu | Full links visible |
| Hero H1 | `clamp(3rem, 5.5vw, 4.5rem)` — same across all | — | — |
| Capabilities grid | 1 column | 2 columns | 3 columns |
| Products grid | 1 column | 2 columns | 3 columns |
| Approach grid | 1 column | 1 column | 2 columns |
| Track grid | 2 columns | 2 columns | 4 columns |
| Value name width | auto (wraps) | 12rem | 18rem |
| Section padding | 3rem | 4rem | 5rem |

---

## Globe Integration (21st dev MCP)

If user wants a globe:

1. **Query the 21st dev MCP** with:
   ```
   Suggest 3-4 distinct 3D globe or Earth visualization designs suitable for a [COMPANY_DESCRIPTION] company/product. 
   Consider their industry ([INDUSTRY]) and vision ([TAGLINE]). 
   Offer varied approaches: e.g., day texture, night texture, tech-inspired (wireframe/neon), topographic, minimalist, organic.
   Include a brief description of each (1-2 sentences) and what visual mood it conveys.
   ```

2. **Present at least 3 options to user:**
   - Option A: [MCP-suggested design 1 with description]
   - Option B: [MCP-suggested design 2 with description]
   - Option C: [MCP-suggested design 3 with description]
   - Option D (Optional): Default Anywise globe (night texture, green glow, Australia-facing)

3. **User picks**, skill integrates the choice:
   - Customize the `makeGlowMaterial()` fragment shader `vec4` to match the glow color
   - Customize `accentLight` hex color to match brand glow
   - Customize light texture vs. night texture for initial load
   - If tech/neon theme: increase glow intensity, shift glow color toward cyan/blue
   - If nature/organic: softer glow, green/teal palette, lower intensity
   - If minimalist: reduce glow opacity, neutral or white light

**Fallback if MCP unavailable:**
- Option 1: Tech-inspired (dark sphere, blue/cyan glow — good for tech companies)
- Option 2: Nature-inspired (blue-green colors, soft glow — good for environmental/health)
- Option 3: Minimalist (neutral glow, low intensity — good for finance/professional)
- Option 4: Anywise default (night texture, green glow, Australia-facing)

---

## Phase 4: Iterative Refinement

After generation, ask: **"Would you like to refine any sections?"**

Supported refinements:
- "Make the hero tagline shorter"
- "Swap out the Track Record section with different metrics"
- "Change the CTA button color"
- "Add more capabilities"
- "Adjust spacing in the products section"
- "Use a different globe design"
- "Change the glow color"
- "Make animations faster/slower"

For each refinement: identify the affected section(s), regenerate only those sections, return the updated full HTML, ask again.

**Iteration limit:** Support up to 3–4 rounds of refinement within the skill. After that, offer this transition:

> "You've made great progress! At this point, further refinements would benefit from deeper development. Would you like to hand off this site to a development session where we can make more granular edits (styling tweaks, component restructuring, advanced customization)? Or are you happy with the current version?"

---

## Related Resources

- **Anywise Website Builder Library:** `/docs/site-builder-library.md` — Full reference for components, color system, typography, responsive patterns, and implementation details
- **21st dev MCP:** Used for globe design suggestions based on company/product context
