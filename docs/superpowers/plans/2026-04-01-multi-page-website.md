# Multi-Page Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `anywise-v5-redesign.html` into a full multi-page site with shared CSS, product pages, blog section, and Engage Us modal.

**Architecture:** Extract the design system into `shared.css` + `shared.js`, then build product pages, blog (JSON-driven), and a modal-based contact form — all sharing the same tokens, nav, and footer.

**Tech Stack:** Vanilla HTML/CSS/JS. No build pipeline. `fetch()` for JSON. `mailto:` for form submission. Serve locally via `python3 -m http.server 8080` or VS Code Live Server.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `shared.css` | Create | All design tokens, nav, footer, buttons, utilities, light/dark overrides |
| `shared.js` | Create | Theme detection IIFE, `applyTheme()`, mobile menu, `openEngageModal()`, scroll reveal, engage modal HTML + behaviour |
| `anywise-v5-redesign.html` | Modify | Remove inline CSS/JS that moves to shared files; update nav links |
| `products/index.html` | Create | Products home — card grid of all 5 products |
| `products/wisdom.html` | Create | WISDOM product page |
| `products/engaide.html` | Create | ENG\|AIDE product page |
| `products/fabhums.html` | Create | FABHUMS product page |
| `products/campaide.html` | Create | CAMP\|AIDE product page |
| `products/aide.html` | Create | AIDE product page |
| `blog/posts.json` | Create | All blog post content |
| `blog/index.html` | Create | Blog home — editorial list rendered from posts.json |
| `blog/post.html` | Create | Single post template — renders via `?slug=` |
| `engage/index.html` | Create | Standalone Engage Us page (fallback, not in nav) |

---

## Phase 1 — shared.css + shared.js

### Task 1: Create shared.css

**Files:**
- Create: `shared.css`

- [ ] **Step 1: Create shared.css with all design tokens and global resets**

```css
/* shared.css — Anywise design system */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  background: var(--bg);
  font-family: var(--font);
  color: var(--text-primary);
  line-height: 1.6;
}

:root {
  --apple: #39a849;
  --lime: #c3e01b;
  --mint: #2d7f36;
  --gradient-al: linear-gradient(135deg, #39a849, #c3e01b);
  --gradient-lm: linear-gradient(135deg, #c3e01b, #2d7f36);
  --gradient-ma: linear-gradient(135deg, #2d7f36, #39a849);
  --gradient-full: linear-gradient(135deg, #2d7f36, #39a849, #c3e01b);

  --bg-deep: #0a0d0a;
  --bg: #0e110e;
  --bg-elevated: #151a16;
  --bg-card: #1a201b;
  --bg-card-hover: #212822;

  --border: rgba(255,255,255,0.07);
  --border-accent: rgba(57,168,73,0.22);

  --text-primary: #f2f1ee;
  --text-secondary: #9a9d95;
  --text-tertiary: #626860;

  --accent: #39a849;
  --accent-dim: #2d7f36;
  --accent-muted: rgba(57,168,73,0.06);
  --accent-glow: rgba(57,168,73,0.1);

  --white: #ffffff;
  --font: 'General Sans', -apple-system, sans-serif;
  --mono: 'JetBrains Mono', monospace;
  --radius: 8px;
  --radius-lg: 14px;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

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

/* ── TYPOGRAPHY ── */
.label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s, transform 0.5s;
}
.label.visible { opacity: 1; transform: none; }

/* ── LAYOUT ── */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── SECTION DIVIDER ── */
.section-divider {
  height: 1px;
  background: var(--border);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.6s;
}
.section-divider.visible { opacity: 1; }
.section-divider::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 60%;
  height: 100%;
  background: var(--gradient-al);
  animation: dividerSweep 2s ease forwards;
}
@keyframes dividerSweep { to { left: 140%; } }

/* ── REVEAL ANIMATIONS ── */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s var(--transition), transform 0.6s var(--transition);
}
.reveal.visible { opacity: 1; transform: none; }
.reveal-scale {
  opacity: 0;
  transform: scale(0.97);
  transition: opacity 0.6s, transform 0.6s;
}
.reveal-scale.visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .reveal, .reveal-scale, .label { opacity: 1; transform: none; }
}

/* ── BUTTONS ── */
.btn, a.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.4rem;
  border-radius: var(--radius);
  font-family: var(--font);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: transform var(--transition), box-shadow var(--transition), opacity var(--transition);
}
.btn:hover { transform: translateY(-1px); }
.btn-primary {
  background: var(--accent);
  color: var(--bg-deep);
}
.btn-accent {
  background: transparent;
  border: 1px solid var(--border-accent);
  color: var(--accent);
}
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
}
.btn-ghost:hover { border-color: var(--border-accent); color: var(--accent); }

/* ── BREADCRUMB ── */
.breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}
.breadcrumb a { color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
.breadcrumb a:hover { color: var(--accent); }
.breadcrumb-sep { opacity: 0.4; }

/* ── IMAGE PLACEHOLDER ── */
.img-placeholder {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-tertiary);
  font-size: 0.82rem;
}
.img-placeholder svg { width: 2rem; height: 2rem; opacity: 0.4; }

/* ── NAV ── */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 0.9rem 0;
  background: var(--bg);
  transition: background var(--transition), backdrop-filter var(--transition);
}
nav.scrolled {
  background: rgba(14,17,14,0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
}
[data-theme="light"] nav { background: #fafbf8; }
[data-theme="light"] nav.scrolled {
  background: rgba(250,251,248,0.95);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
nav .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-brand {
  font-family: var(--font);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--white);
  letter-spacing: -0.02em;
  text-decoration: none;
  transition: color var(--transition);
}
.nav-brand span { color: var(--accent); }
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
}
.nav-links a {
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  position: relative;
}
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0;
  width: 0; height: 1px;
  background: var(--gradient-al);
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
}
.nav-links a:hover { color: var(--text-primary); }
.nav-links a:hover::after { width: 100%; }
.nav-links a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 2px; }
a.nav-cta {
  background: var(--accent);
  color: var(--bg-deep) !important;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.78rem;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
a.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 16px var(--accent-glow); }
a.nav-cta:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; }
.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 50%;
  width: 2rem; height: 2rem;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s, color 0.2s;
}
.theme-toggle:hover { border-color: var(--border-accent); color: var(--accent); }

/* Mobile nav */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.mobile-toggle span {
  display: block;
  width: 22px; height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: var(--transition);
  position: relative;
}
@media (max-width: 768px) {
  .mobile-toggle { display: flex; }
  .nav-links { display: none; }
  .nav-links.open {
    display: flex;
    flex-direction: column;
    position: fixed; inset: 0;
    background: rgba(14,17,14,0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    z-index: 999;
  }
  [data-theme="light"] .nav-links.open { background: rgba(250,251,248,0.98); }
  .nav-links.open a {
    font-size: 1.1rem;
    opacity: 0;
    transform: translateY(15px);
    animation: mobileNavIn 0.4s forwards;
  }
  /* 7 items: 5 links + Engage Us + theme toggle */
  .nav-links.open li:nth-child(1) a { animation-delay: 0.05s; }
  .nav-links.open li:nth-child(2) a { animation-delay: 0.1s; }
  .nav-links.open li:nth-child(3) a { animation-delay: 0.15s; }
  .nav-links.open li:nth-child(4) a { animation-delay: 0.2s; }
  .nav-links.open li:nth-child(5) a { animation-delay: 0.25s; }
  .nav-links.open li:nth-child(6) a { animation-delay: 0.3s; }
  .nav-links.open li:nth-child(7) a { animation-delay: 0.35s; }
  @keyframes mobileNavIn { to { opacity: 1; transform: translateY(0); } }
}

/* ── FOOTER ── */
footer {
  padding: 4rem 0 2rem;
  border-top: 1px solid var(--border);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}
.footer-brand p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.75rem;
  max-width: 240px;
  line-height: 1.6;
}
.footer-col h4 {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}
.footer-col a {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.6rem;
  transition: color 0.2s;
}
.footer-col a:hover { color: var(--accent); }
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--text-tertiary);
}
.footer-locations { display: flex; gap: 1.5rem; }
.footer-locations a { color: var(--text-tertiary); text-decoration: none; }
.footer-locations a:hover { color: var(--accent); }

@media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
  .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
  .footer-locations { flex-wrap: wrap; justify-content: center; }
}

/* ── ENGAGE US MODAL ── */
.engage-overlay {
  position: fixed; inset: 0;
  background: rgba(10,13,10,0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.engage-overlay.open {
  opacity: 1;
  pointer-events: all;
}
.engage-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-accent);
  border-radius: 20px;
  width: 100%;
  max-width: 620px;
  padding: 2.5rem;
  position: relative;
  transform: translateY(24px);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  max-height: 90vh;
  overflow-y: auto;
}
.engage-overlay.open .engage-panel { transform: translateY(0); }
.engage-close {
  position: absolute; top: 1.25rem; right: 1.25rem;
  width: 2rem; height: 2rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s, color 0.2s;
}
.engage-close:hover { border-color: var(--border-accent); color: var(--text-primary); }
.engage-panel .label { margin-bottom: 0.5rem; opacity: 1; transform: none; }
.engage-panel h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; }
.engage-panel .engage-sub {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.5;
}
.engage-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}
.engage-group { display: flex; flex-direction: column; gap: 0.35rem; }
.engage-group.full { grid-column: 1 / -1; }
.engage-group label { font-size: 0.78rem; font-weight: 500; color: var(--text-secondary); }
.engage-group input,
.engage-group select,
.engage-group textarea {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.65rem 0.875rem;
  color: var(--text-primary);
  font-family: var(--font);
  font-size: 0.9rem;
  outline: none;
  width: 100%;
  transition: border-color 0.2s, background 0.2s;
}
.engage-group input:focus,
.engage-group select:focus,
.engage-group textarea:focus {
  border-color: var(--border-accent);
  background: var(--bg-card);
}
.engage-group input::placeholder,
.engage-group textarea::placeholder { color: var(--text-tertiary); }
.engage-group select option { background: var(--bg-card); }
.engage-group textarea { resize: vertical; min-height: 100px; line-height: 1.5; }
.engage-product-row {
  display: none;
  margin-bottom: 1rem;
}
.engage-product-row.visible { display: block; }
.engage-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}
.engage-privacy {
  font-size: 0.78rem;
  color: var(--text-tertiary);
  line-height: 1.4;
}
@media (max-width: 768px) {
  .engage-form-row { grid-template-columns: 1fr; }
  .engage-panel { padding: 1.75rem 1.25rem; border-radius: 16px 16px 0 0; }
  .engage-overlay { align-items: flex-end; }
}
```

- [ ] **Step 2: Verify the file exists**

```bash
ls -la shared.css
```
Expected: file exists, non-zero size.

- [ ] **Step 3: Commit**

```bash
git add shared.css
git commit -m "feat: create shared.css with design system, nav, footer, modal styles"
```

---

### Task 2: Create shared.js

**Files:**
- Create: `shared.js`

- [ ] **Step 1: Create shared.js**

```javascript
/* shared.js — Anywise shared behaviour */

/* ── THEME DETECTION (Sydney timezone-aware) ── */
(function() {
  const stored = localStorage.getItem('anywise-theme');
  if (stored) {
    document.documentElement.dataset.theme = stored;
    return;
  }
  // Sydney time: AEST = UTC+10, AEDT = UTC+11
  const now = new Date();
  const sydneyOffset = 10; // approximation; DST handled by tzname check
  const utcHour = now.getUTCHours();
  const sydneyHour = (utcHour + sydneyOffset) % 24;
  document.documentElement.dataset.theme = (sydneyHour >= 6 && sydneyHour < 18) ? 'light' : 'dark';
})();

document.addEventListener('DOMContentLoaded', function() {

  /* ── THEME TOGGLE ── */
  const themeToggle = document.getElementById('themeToggle');
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#f5f6f3' : '#0e110e';
    if (themeToggle) themeToggle.textContent = theme === 'light' ? '☾' : '☀';
    localStorage.setItem('anywise-theme', theme);
    if (window.updateGlobeTheme) window.updateGlobeTheme(theme === 'light');
  }
  if (themeToggle) {
    themeToggle.textContent = document.documentElement.dataset.theme === 'light' ? '☾' : '☀';
    themeToggle.addEventListener('click', function() {
      applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
    });
  }

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── MOBILE MENU ── */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      const isOpen = mobileToggle.classList.contains('active');
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(!isOpen));
    });
    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .reveal-scale, .label, .section-divider').forEach(function(el, i) {
    if (!prefersReducedMotion) {
      const parent = el.parentElement;
      const siblings = parent ? Array.from(parent.children).filter(function(c) {
        return c.classList.contains('reveal') || c.classList.contains('reveal-scale');
      }) : [];
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = (idx * 0.1) + 's';
    }
    revealObserver.observe(el);
  });

  /* ── ENGAGE US MODAL ── */
  // Inject modal HTML once
  if (!document.getElementById('engageOverlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'engageOverlay';
    overlay.className = 'engage-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'engageTitle');
    overlay.innerHTML = `
      <div class="engage-panel" id="engagePanel">
        <button class="engage-close" id="engageClose" aria-label="Close">✕</button>
        <p class="label">Get in touch</p>
        <h2 id="engageTitle">Engage Us</h2>
        <p class="engage-sub">Tell us about your challenge. We'll get back to you within one business day.</p>
        <form id="engageForm" action="mailto:sales@anywise.com.au" method="post" enctype="text/plain">
          <div class="engage-form-row">
            <div class="engage-group">
              <label for="engageName">Full name <span aria-hidden="true">*</span></label>
              <input type="text" id="engageName" name="name" placeholder="Jane Smith" required autocomplete="name">
            </div>
            <div class="engage-group">
              <label for="engageEmail">Work email <span aria-hidden="true">*</span></label>
              <input type="email" id="engageEmail" name="email" placeholder="jane@organisation.gov.au" required autocomplete="email">
            </div>
            <div class="engage-group">
              <label for="engageOrg">Organisation <span aria-hidden="true">*</span></label>
              <input type="text" id="engageOrg" name="organisation" placeholder="Department / Company" required>
            </div>
            <div class="engage-group">
              <label for="engageRole">Your role</label>
              <input type="text" id="engageRole" name="role" placeholder="e.g. CTO, Project Manager" autocomplete="organization-title">
            </div>
            <div class="engage-group full">
              <label for="engageType">What are you looking for? <span aria-hidden="true">*</span></label>
              <select id="engageType" name="enquiry_type" required>
                <option value="" disabled selected>Select one...</option>
                <option value="product">Product enquiry</option>
                <option value="partnership">Partnership or collaboration</option>
                <option value="general">General enquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div class="engage-product-row engage-group full" id="engageProductRow">
            <label for="engageProduct">Which product? <span aria-hidden="true">*</span></label>
            <select id="engageProduct" name="product">
              <option value="" disabled selected>Select a product...</option>
              <option value="wisdom">WISDOM</option>
              <option value="engaide">ENG|AIDE</option>
              <option value="fabhums">FABHUMS</option>
              <option value="campaide">CAMP|AIDE</option>
              <option value="aide">AIDE</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="engage-group full" style="margin-bottom:1rem;">
            <label for="engageMessage">Message <span aria-hidden="true">*</span></label>
            <textarea id="engageMessage" name="message" placeholder="Tell us about your challenge, context, or what you'd like to explore with Anywise..." required></textarea>
          </div>
          <div class="engage-actions">
            <p class="engage-privacy">We respect your privacy. Your details are never shared with third parties.</p>
            <button type="submit" class="btn btn-primary">Send →</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(overlay);

    // Show/hide product sub-dropdown
    document.getElementById('engageType').addEventListener('change', function() {
      const row = document.getElementById('engageProductRow');
      const productSelect = document.getElementById('engageProduct');
      const show = this.value === 'product';
      row.classList.toggle('visible', show);
      productSelect.required = show;
    });

    // Close handlers
    document.getElementById('engageClose').addEventListener('click', closeEngageModal);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeEngageModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeEngageModal();
    });
  }

  // Wire up all "Engage Us" triggers on the page
  document.querySelectorAll('[data-engage]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      openEngageModal();
    });
  });
});

function openEngageModal() {
  const overlay = document.getElementById('engageOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(function() {
    const first = overlay.querySelector('input, select, textarea, button');
    if (first) first.focus();
  }, 50);
}

function closeEngageModal() {
  const overlay = document.getElementById('engageOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
```

- [ ] **Step 2: Verify**

```bash
ls -la shared.js
```

- [ ] **Step 3: Commit**

```bash
git add shared.js
git commit -m "feat: create shared.js with theme detection, mobile menu, scroll reveal, engage modal"
```

---

### Task 3: Update anywise-v5-redesign.html to use shared files

**Files:**
- Modify: `anywise-v5-redesign.html`

- [ ] **Step 1: Add shared.css and shared.js links to the `<head>` and remove the opening `<style>` block**

In `anywise-v5-redesign.html`, after the font `<link>` tags (around line 27), add:
```html
<link rel="stylesheet" href="shared.css">
```

Find and **delete** the entire `<style>` block from line 28 (`<style>`) through to its closing `</style>` tag — BUT only delete the portions now covered by `shared.css`. Specifically, keep in a remaining `<style>` block anything that is page-specific to the main page (globe styles, hero styles, cap/approach/products/track/team/news/cta/creds/footer section-specific styles, scroll progress bar, counter, tagline, etc.).

The simplest approach: keep all existing `<style>` content intact for now, and add `shared.css` above it. The shared.css variables and component styles will cascade correctly via specificity. The page-specific inline styles are not duplicated in shared.css and will coexist without conflict.

- [ ] **Step 2: Update the nav HTML to use new links and `data-engage` on "Engage Us"**

Find the nav `<ul>` (line 1540) and replace with:

```html
<ul class="nav-links" id="navLinks">
  <li><a href="#capabilities">Capabilities</a></li>
  <li><a href="#approach">Approach</a></li>
  <li><a href="products/index.html">Products</a></li>
  <li><a href="#about">About</a></li>
  <li><a href="blog/index.html">Insights</a></li>
  <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
  <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light/dark mode">☀</button></li>
</ul>
```

- [ ] **Step 3: Update hero "Engage Us" button to use `data-engage`**

Find line 1582:
```html
<a href="#contact" class="btn btn-accent"><span>Engage Us &rarr;</span></a>
```
Replace with:
```html
<a href="#" class="btn btn-accent" data-engage aria-haspopup="dialog"><span>Engage Us &rarr;</span></a>
```

- [ ] **Step 4: Add shared.js before closing `</body>`**

Find the closing `</body>` tag. Before the existing `<script>` blocks (the theme IIFE), add:
```html
<script src="shared.js"></script>
```

Then remove from the inline scripts: the theme IIFE, `applyTheme()`, `themeToggle` event listener, mobile menu handler, and nav scroll handler — since these are now in shared.js.

- [ ] **Step 5: Open in browser and verify**

```bash
python3 -m http.server 8080
```
Open http://localhost:8080/anywise-v5-redesign.html. Check:
- Nav renders correctly with Products and Insights links
- Theme toggle works
- "Engage Us" opens the modal overlay
- Mobile hamburger still works
- Globe, scroll reveal, counters still work

- [ ] **Step 6: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: wire main page to shared.css/js, update nav links, add engage modal trigger"
```

---

## Phase 2 — Products

### Task 4: Create the shared nav/footer HTML snippet

This task documents the exact HTML to copy into every new page. No file to create — just reference this in Tasks 5–10.

**Standard page head (for pages inside subdirectories e.g. `products/`):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PAGE TITLE | Anywise</title>
<meta name="description" content="PAGE DESCRIPTION">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<meta name="theme-color" content="#0e110e">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../shared.css">
<!-- PAGE-SPECIFIC STYLES IF NEEDED -->
</head>
<body>
```

**Theme IIFE (place immediately after `<body>`):**
```html
<script>
(function(){
  var s=localStorage.getItem('anywise-theme');
  if(s){document.documentElement.dataset.theme=s;return;}
  var h=(new Date().getUTCHours()+10)%24;
  document.documentElement.dataset.theme=(h>=6&&h<18)?'light':'dark';
})();
</script>
```

**Standard nav (for inner pages — links use `../` prefix):**
```html
<nav id="nav">
  <div class="container">
    <a href="../anywise-v5-redesign.html" class="nav-brand">any<span>wise</span></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../anywise-v5-redesign.html#capabilities">Capabilities</a></li>
      <li><a href="../anywise-v5-redesign.html#approach">Approach</a></li>
      <li><a href="../products/index.html">Products</a></li>
      <li><a href="../anywise-v5-redesign.html#about">About</a></li>
      <li><a href="../blog/index.html">Insights</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
```

**Standard footer (for all pages):**
```html
<div class="section-divider"></div>
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="../anywise-v5-redesign.html" class="nav-brand" style="font-size:1.15rem;">any<span>wise</span></a>
        <p>Ethical decision augmentation for defence and government. Melbourne, Australia.</p>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <a href="../products/wisdom.html">WISDOM</a>
        <a href="../products/engaide.html">ENG|AIDE</a>
        <a href="../products/fabhums.html">FABHUMS</a>
        <a href="../products/campaide.html">CAMP|AIDE</a>
        <a href="../products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="../anywise-v5-redesign.html#about">About Anywise</a>
        <a href="../anywise-v5-redesign.html#approach">Our Approach</a>
        <a href="../blog/index.html">Insights</a>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <a href="https://www.anywise.com.au/privacy-policy">Privacy Policy</a>
        <a href="https://www.anywise.com.au/defence-industry-disclosure">Security Compliance</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Anywise Consulting Pty Ltd. All rights reserved.</p>
      <div class="footer-locations">
        <span>Melbourne</span><span>Sydney</span><span>Brisbane</span><span>Perth</span><span>Canberra</span>
      </div>
    </div>
  </div>
</footer>
<script src="../shared.js"></script>
</body>
</html>
```

---

### Task 5: Create products/index.html

**Files:**
- Create: `products/index.html`

- [ ] **Step 1: Create the products directory and index.html**

```bash
mkdir -p products
```

Create `products/index.html` using the standard head/nav/footer from Task 4, with title `"Products & Technology | Anywise"` and this body content between nav and footer:

```html
<style>
  .products-hero {
    padding: 8rem 0 4rem;
    border-bottom: 1px solid var(--border);
  }
  .products-hero .label { opacity: 1; transform: none; margin-bottom: 0.75rem; }
  .products-hero h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.15; margin-bottom: 1rem; }
  .products-hero p { color: var(--text-secondary); max-width: 640px; font-size: 1rem; line-height: 1.7; }

  .products-section { padding: 5rem 0; }
  .products-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; margin-bottom: 3rem; }
  .products-intro h2 { font-size: 1.5rem; font-weight: 700; }
  .products-intro p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; }

  .product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
  .product-grid-bottom { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; max-width: calc(66.66% + 0.5rem); }

  .product-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: block;
    transition: border-color var(--transition), transform var(--transition);
  }
  .product-card:hover { border-color: var(--border-accent); transform: translateY(-2px); }
  .product-card-img-wrap { aspect-ratio: 3/2; overflow: hidden; background: var(--bg-elevated); }
  .product-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .product-card:hover .product-card-img { transform: scale(1.05); }
  .product-card-body { padding: 1.5rem; }
  .product-card-tag { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); font-weight: 600; margin-bottom: 0.5rem; }
  .product-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
  .product-card p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.75rem; }
  .product-card-cta { font-size: 0.82rem; font-weight: 600; color: var(--accent); }

  .products-cta {
    margin-top: 4rem;
    background: var(--bg-card);
    border: 1px solid var(--border-accent);
    border-radius: var(--radius-lg);
    padding: 3rem;
    text-align: center;
  }
  .products-cta h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
  .products-cta p { color: var(--text-secondary); margin-bottom: 1.5rem; }

  @media (max-width: 1024px) { .product-grid { grid-template-columns: 1fr 1fr; } .product-grid-bottom { grid-template-columns: 1fr 1fr; max-width: 100%; } }
  @media (max-width: 768px) { .product-grid, .product-grid-bottom { grid-template-columns: 1fr; max-width: 100%; } .products-intro { grid-template-columns: 1fr; gap: 1rem; } }
</style>

<section class="products-hero">
  <div class="container">
    <p class="label">Products &amp; Technology</p>
    <h1>Sovereign, Australian-designed<br>intelligence platforms.</h1>
    <p>Our products combine advanced data integration, GenAI-enabled analytics and human expertise to deliver augmented intelligence directly into the hands of user communities — from defence and emergency services to infrastructure and industry.</p>
  </div>
</section>

<div class="section-divider"></div>

<section class="products-section">
  <div class="container">
    <div class="product-grid">
      <a href="wisdom.html" class="product-card reveal">
        <div class="product-card-img-wrap">
          <img class="product-card-img" src="https://static.wixstatic.com/media/7f952a_24fdd43f52fb4b9caee6a8681023e560~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_24fdd43f52fb4b9caee6a8681023e560~mv2.png" alt="WISDOM">
        </div>
        <div class="product-card-body">
          <p class="product-card-tag">Strategic Intelligence</p>
          <h3>WISDOM</h3>
          <p>A secure intelligence platform fusing fragmented data, generative AI and experienced analysts to transform information overload into decision-ready foresight.</p>
          <span class="product-card-cta">Learn more →</span>
        </div>
      </a>
      <a href="engaide.html" class="product-card reveal">
        <div class="product-card-img-wrap">
          <img class="product-card-img" src="https://static.wixstatic.com/media/7f952a_ea2f32f556c240bc8db88d7ba70044e0~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_ea2f32f556c240bc8db88d7ba70044e0~mv2.png" alt="ENG|AIDE">
        </div>
        <div class="product-card-body">
          <p class="product-card-tag">Engineering Intelligence</p>
          <h3>ENG|AIDE</h3>
          <p>Dual-use engineering assistance that transforms technical documentation, telemetry and lifecycle data into clear, actionable insights across defence and industry.</p>
          <span class="product-card-cta">Learn more →</span>
        </div>
      </a>
      <a href="fabhums.html" class="product-card reveal">
        <div class="product-card-img-wrap">
          <img class="product-card-img" src="https://static.wixstatic.com/media/7f952a_3e2d3289d68440598bd34548fe774603~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_3e2d3289d68440598bd34548fe774603~mv2.png" alt="FABHUMS">
        </div>
        <div class="product-card-body">
          <p class="product-card-tag">Health &amp; Usage Monitoring</p>
          <h3>FABHUMS</h3>
          <p>A world-first, fully integrated Health and Usage Monitoring System for deployable bridging. Real-time structural health, predictive maintenance across mixed fleets.</p>
          <span class="product-card-cta">Learn more →</span>
        </div>
      </a>
    </div>
    <div class="product-grid-bottom">
      <a href="campaide.html" class="product-card reveal">
        <div class="product-card-img-wrap">
          <img class="product-card-img" src="https://static.wixstatic.com/media/7f952a_b2f35870d2344d98955ab0eccb0933d3~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_b2f35870d2344d98955ab0eccb0933d3~mv2.png" alt="CAMP|AIDE">
        </div>
        <div class="product-card-body">
          <p class="product-card-tag">Facilities Intelligence</p>
          <h3>CAMP|AIDE</h3>
          <p>Augmented decision support for camp planning and deployable infrastructure. Integrates spatial data, engineering constraints and logistics into coherent, risk-aware sustainment models.</p>
          <span class="product-card-cta">Learn more →</span>
        </div>
      </a>
      <a href="aide.html" class="product-card reveal">
        <div class="product-card-img-wrap">
          <img class="product-card-img" src="https://static.wixstatic.com/media/7f952a_1a4f7471555f4b9bb4965da42225ed50~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_1a4f7471555f4b9bb4965da42225ed50~mv2.png" alt="AIDE">
        </div>
        <div class="product-card-body">
          <p class="product-card-tag">Enterprise Intelligence</p>
          <h3>AIDE</h3>
          <p>Enterprise-grade intelligence that synthesises human-machine outputs across the organisation into a unified, forward-looking operational picture for leaders in both secure and civilian contexts.</p>
          <span class="product-card-cta">Learn more →</span>
        </div>
      </a>
    </div>

    <div class="products-cta reveal-scale">
      <h2>Ready to explore our products?</h2>
      <p>Tell us about your challenge and we'll match you with the right capability.</p>
      <a href="#" class="btn btn-primary" data-engage aria-haspopup="dialog">Engage Us →</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Open in browser and verify**

Open http://localhost:8080/products/index.html — check 5 cards render, links work, theme toggle works, modal opens.

- [ ] **Step 3: Commit**

```bash
git add products/index.html
git commit -m "feat: add products home page with card grid"
```

---

### Task 6: Create individual product page template and WISDOM page

**Files:**
- Create: `products/wisdom.html`

This task defines the full product page structure. Tasks 7–10 reuse the same structure with different content.

- [ ] **Step 1: Create products/wisdom.html**

Use the standard head (title: `"WISDOM | Anywise"`, description: `"A secure intelligence platform fusing fragmented data, generative AI and experienced analysts to transform information overload into decision-ready foresight."`), standard nav, and standard footer from Task 4.

Add this page-specific `<style>` block after `shared.css`:

```html
<style>
  .prod-hero {
    padding: 8rem 0 5rem;
    border-bottom: 1px solid var(--border);
    background: radial-gradient(ellipse 70% 50% at 70% 50%, var(--accent-muted) 0%, transparent 70%);
  }
  .prod-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .prod-hero .label { opacity: 1; transform: none; margin-bottom: 0.75rem; }
  .prod-hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 1rem; }
  .prod-hero p { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; max-width: 480px; }
  .prod-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .prod-hero-img { aspect-ratio: 4/3; border-radius: var(--radius-lg); }

  .prod-section { padding: 4rem 0; border-bottom: 1px solid var(--border); }
  .prod-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .prod-two-col.flip { direction: rtl; }
  .prod-two-col.flip > * { direction: ltr; }
  .prod-text .label { opacity: 1; transform: none; margin-bottom: 0.75rem; }
  .prod-text h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2; }
  .prod-text p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 1rem; }
  .prod-img { aspect-ratio: 16/9; border-radius: var(--radius-lg); }

  .benefits-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .benefit-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem 1.25rem;
  }
  .benefit-card .icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
  .benefit-card h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem; }
  .benefit-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

  .how-cases { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
  .steps { display: flex; flex-direction: column; }
  .step { display: grid; grid-template-columns: 2.5rem 1fr; gap: 1rem; padding: 1.25rem 0; border-bottom: 1px solid var(--border); }
  .step:last-child { border-bottom: none; }
  .step-num {
    width: 2rem; height: 2rem;
    background: var(--accent-muted); border: 1px solid var(--border-accent);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700; color: var(--accent); flex-shrink: 0;
  }
  .step h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; }
  .step p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
  .use-cases { display: flex; flex-direction: column; gap: 1rem; }
  .use-case {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 0 var(--radius) var(--radius) 0;
    padding: 1rem 1.25rem;
  }
  .use-case h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; }
  .use-case p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

  .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .feature-item { border-left: 2px solid var(--border-accent); padding-left: 1rem; }
  .feature-item h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; }
  .feature-item p { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; }
  .features-img { aspect-ratio: 4/3; border-radius: var(--radius-lg); }

  .prod-cta { padding: 5rem 0; }
  .prod-cta-box {
    background: var(--bg-card);
    border: 1px solid var(--border-accent);
    border-radius: var(--radius-lg);
    padding: 3.5rem 4rem;
  }
  .prod-cta-box h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75rem; }
  .prod-cta-box p { color: var(--text-secondary); max-width: 540px; line-height: 1.7; }
  .prod-cta-actions { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }

  @media (max-width: 1024px) {
    .prod-hero-inner, .prod-two-col, .how-cases { grid-template-columns: 1fr; gap: 2.5rem; }
    .prod-two-col.flip { direction: ltr; }
    .benefits-grid { grid-template-columns: 1fr 1fr; }
    .prod-cta-box { padding: 2.5rem 2rem; }
  }
  @media (max-width: 768px) {
    .benefits-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr; }
  }
</style>
```

Body content between nav and footer:

```html
<!-- HERO -->
<section class="prod-hero">
  <div class="container">
    <div class="prod-hero-inner">
      <div>
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="../anywise-v5-redesign.html">Home</a>
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
          <a href="index.html">Products</a>
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
          <span aria-current="page">WISDOM</span>
        </nav>
        <p class="label">Strategic Intelligence</p>
        <h1>WISDOM</h1>
        <p>A secure intelligence platform fusing fragmented data, generative AI and experienced analysts to transform information overload into decision-ready foresight.</p>
        <div class="prod-hero-actions">
          <a href="#" class="btn btn-primary" data-engage aria-haspopup="dialog">Engage Us →</a>
          <a href="index.html" class="btn btn-ghost">All Products</a>
        </div>
      </div>
      <div class="img-placeholder prod-hero-img">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        Product hero image
      </div>
    </div>
  </div>
</section>

<div class="section-divider"></div>

<!-- WHAT IS WISDOM — image left, text right -->
<section class="prod-section">
  <div class="container">
    <div class="prod-two-col flip reveal">
      <div class="prod-text">
        <p class="label">Overview</p>
        <h2>What is WISDOM?</h2>
        <p>WISDOM addresses the challenge of decision-making in complex, data-rich environments where fragmented information, competing priorities and time pressure combine to create risk.</p>
        <p>By combining multi-source data ingestion, GenAI-enabled synthesis and experienced human analysts, WISDOM delivers structured, decision-ready intelligence directly into the hands of commanders, planners and leaders — across defence, government and critical infrastructure.</p>
      </div>
      <div class="img-placeholder prod-img">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        Product diagram
      </div>
    </div>
  </div>
</section>

<div class="section-divider"></div>

<!-- KEY BENEFITS -->
<section class="prod-section">
  <div class="container">
    <p class="label">Why WISDOM</p>
    <h2 style="font-size:1.5rem;font-weight:700;margin:0.5rem 0 2rem;">Key Benefits</h2>
    <div class="benefits-grid">
      <div class="benefit-card reveal">
        <div class="icon" aria-hidden="true">↗</div>
        <h3>Faster decisions</h3>
        <p>Reduces analyst burden by surfacing the signal from the noise — automatically and at speed.</p>
      </div>
      <div class="benefit-card reveal">
        <div class="icon" aria-hidden="true">🔒</div>
        <h3>Secure by design</h3>
        <p>Built for classified and sensitive environments, with deployment options for on-premise or sovereign cloud.</p>
      </div>
      <div class="benefit-card reveal">
        <div class="icon" aria-hidden="true">⚙</div>
        <h3>GenAI-enabled</h3>
        <p>Human-machine teaming at the core — AI assists, humans decide. No black-box outputs.</p>
      </div>
      <div class="benefit-card reveal">
        <div class="icon" aria-hidden="true">🇦🇺</div>
        <h3>Sovereign capability</h3>
        <p>Designed, built and operated in Australia. No foreign dependencies on critical intelligence infrastructure.</p>
      </div>
    </div>
  </div>
</section>

<div class="section-divider"></div>

<!-- HOW IT WORKS + USE CASES -->
<section class="prod-section">
  <div class="container">
    <div class="how-cases reveal">
      <div>
        <p class="label">Process</p>
        <h2 style="font-size:1.5rem;font-weight:700;margin:0.5rem 0 1.5rem;">How It Works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num" aria-hidden="true">1</div>
            <div>
              <h3>Ingest</h3>
              <p>WISDOM connects to disparate data sources — reports, telemetry, feeds, documents — and normalises them into a unified schema.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num" aria-hidden="true">2</div>
            <div>
              <h3>Analyse</h3>
              <p>GenAI layers synthesise patterns and anomalies. Experienced analysts review and enrich outputs, adding context and judgement.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num" aria-hidden="true">3</div>
            <div>
              <h3>Deliver</h3>
              <p>Decision-ready intelligence delivered as structured briefings, dashboards, or direct integration into command systems.</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p class="label">Applications</p>
        <h2 style="font-size:1.5rem;font-weight:700;margin:0.5rem 0 1.5rem;">Use Cases</h2>
        <div class="use-cases">
          <div class="use-case">
            <h3>Defence Procurement</h3>
            <p>Synthesising supplier, risk and capability data to support complex acquisition decisions with confidence.</p>
          </div>
          <div class="use-case">
            <h3>Emergency Services Command</h3>
            <p>Real-time situational awareness across multiple agencies, delivering a unified operational picture under pressure.</p>
          </div>
          <div class="use-case">
            <h3>Government Policy Intelligence</h3>
            <p>Translating complex, multi-source data landscapes into structured strategic recommendations for senior decision-makers.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="section-divider"></div>

<!-- FEATURE BREAKDOWN — features left, image right -->
<section class="prod-section">
  <div class="container">
    <div class="prod-two-col reveal">
      <div>
        <p class="label">Capabilities</p>
        <h2 style="font-size:1.5rem;font-weight:700;margin:0.5rem 0 2rem;">Feature Breakdown</h2>
        <div class="features-grid">
          <div class="feature-item">
            <h3>Data Fusion</h3>
            <p>Multi-source ingestion with schema normalisation across structured and unstructured formats.</p>
          </div>
          <div class="feature-item">
            <h3>GenAI Layer</h3>
            <p>LLM-assisted synthesis with human review gates at every stage.</p>
          </div>
          <div class="feature-item">
            <h3>Analyst Workbench</h3>
            <p>Purpose-built interface for enrichment, annotation and confidence scoring.</p>
          </div>
          <div class="feature-item">
            <h3>Secure Hosting</h3>
            <p>On-premise or sovereign cloud. No data leaves the customer environment without consent.</p>
          </div>
          <div class="feature-item">
            <h3>Output Formats</h3>
            <p>Structured briefings, dashboards, API endpoints and command system integration.</p>
          </div>
          <div class="feature-item">
            <h3>Audit Trail</h3>
            <p>Full provenance tracking — every output traceable to its source data.</p>
          </div>
        </div>
      </div>
      <div class="img-placeholder features-img">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        Feature screenshot
      </div>
    </div>
  </div>
</section>

<div class="section-divider"></div>

<!-- CTA -->
<section class="prod-cta">
  <div class="container">
    <div class="prod-cta-box reveal-scale">
      <h2>Ready to explore WISDOM for your organisation?</h2>
      <p>Whether you're navigating a procurement decision, standing up a new intelligence capability, or evaluating what sovereign AI looks like in your context — let's talk.</p>
      <div class="prod-cta-actions">
        <a href="#" class="btn btn-primary" data-engage aria-haspopup="dialog">Engage Us →</a>
        <a href="index.html" class="btn btn-ghost">View All Products</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Open in browser and verify**

Open http://localhost:8080/products/wisdom.html. Scroll through all 6 sections. Verify alternating image sides, modal opens from all three CTAs, breadcrumb works.

- [ ] **Step 3: Commit**

```bash
git add products/wisdom.html
git commit -m "feat: add WISDOM product page"
```

---

### Tasks 7–10: Remaining product pages

Each of these pages uses the identical structure from Task 6. Only the content differs. Create each file, substitute the values from the table below, then commit.

**Files:** `products/engaide.html`, `products/fabhums.html`, `products/campaide.html`, `products/aide.html`

| File | Name | Category | Description | Tagline | Image URL |
|---|---|---|---|---|---|
| `engaide.html` | ENG\|AIDE | Engineering Intelligence | Dual-use engineering assistance that transforms technical documentation, telemetry and lifecycle data into clear, actionable insights across defence and industry. | Reducing operational risk, improving reliability. | `https://static.wixstatic.com/media/7f952a_ea2f32f556c240bc8db88d7ba70044e0~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_ea2f32f556c240bc8db88d7ba70044e0~mv2.png` |
| `fabhums.html` | FABHUMS | Health & Usage Monitoring | A world-first, fully integrated Health and Usage Monitoring System for deployable bridging. Real-time structural health, predictive maintenance across mixed fleets. | Enhancing safety, extending asset life. | `https://static.wixstatic.com/media/7f952a_3e2d3289d68440598bd34548fe774603~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_3e2d3289d68440598bd34548fe774603~mv2.png` |
| `campaide.html` | CAMP\|AIDE | Facilities Intelligence | Augmented decision support for camp planning and deployable infrastructure. Integrates spatial data, engineering constraints and logistics into coherent, risk-aware sustainment models. | Faster planning, safer outcomes. | `https://static.wixstatic.com/media/7f952a_b2f35870d2344d98955ab0eccb0933d3~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_b2f35870d2344d98955ab0eccb0933d3~mv2.png` |
| `aide.html` | AIDE | Enterprise Intelligence | Enterprise-grade intelligence that synthesises human-machine outputs across the organisation into a unified, forward-looking operational picture for leaders in both secure and civilian contexts. | Unified foresight at decision speed. | `https://static.wixstatic.com/media/7f952a_1a4f7471555f4b9bb4965da42225ed50~mv2.png/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f952a_1a4f7471555f4b9bb4965da42225ed50~mv2.png` |

For each product page, adapt the How It Works steps and Use Cases to the product domain:

**ENG|AIDE** — Steps: Connect → Synthesise → Advise. Use cases: Fleet maintenance scheduling, Engineering risk assessment, Technical document analysis.

**FABHUMS** — Steps: Sense → Monitor → Alert. Use cases: Bridge health monitoring across mixed fleets, Predictive maintenance scheduling, Post-deployment structural assessment.

**CAMP|AIDE** — Steps: Map → Plan → Sustain. Use cases: Deployable camp layout planning, Infrastructure constraint modelling, Logistics and sustainment optimisation.

**AIDE** — Steps: Aggregate → Synthesise → Present. Use cases: Executive operational picture, Cross-domain intelligence fusion, Strategic risk reporting.

- [ ] **Step 1: Create products/engaide.html** (copy wisdom.html structure, substitute ENG|AIDE content)
- [ ] **Step 2: Commit** `git commit -m "feat: add ENG|AIDE product page"`
- [ ] **Step 3: Create products/fabhums.html**
- [ ] **Step 4: Commit** `git commit -m "feat: add FABHUMS product page"`
- [ ] **Step 5: Create products/campaide.html**
- [ ] **Step 6: Commit** `git commit -m "feat: add CAMP|AIDE product page"`
- [ ] **Step 7: Create products/aide.html**
- [ ] **Step 8: Commit** `git commit -m "feat: add AIDE product page"`

---

## Phase 3 — Blog

### Task 11: Create blog/posts.json

**Files:**
- Create: `blog/posts.json`

- [ ] **Step 1: Create blog directory and posts.json**

```bash
mkdir -p blog
```

Create `blog/posts.json`:

```json
[
  {
    "slug": "transforming-operational-challenges",
    "title": "Transforming Operational Challenges into Dual-Use Intelligence Solutions in Engineering",
    "date": "2026-02-15",
    "readTime": 3,
    "category": "Insights",
    "author": "Anywise Team",
    "heroImage": "https://static.wixstatic.com/media/7f952a_cb19018ab2fe4c37bcd9bd2965bf6d2f~mv2.jpg/v1/fill/w_1200,h_600,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/blog_podcastEp1-Hero.jpg",
    "intro": "Operational challenges in defence and engineering environments are rarely simple. Fragmented systems, legacy infrastructure and time-critical decision-making create conditions where intelligence tools must be both powerful and adaptable — capable of serving defence and civilian contexts simultaneously.",
    "sections": [
      {
        "heading": "From Problem to Practical Solution",
        "blocks": [
          { "type": "paragraph", "content": "The starting point is a simple but critical question: how do defence organisations manage the transition from operational knowledge to actionable intelligence? The answer lies in purpose-built platforms like ENG|AIDE — tools that understand the language of engineering and translate it into decision-ready insight." },
          { "type": "paragraph", "content": "This dual-use philosophy is at the heart of Anywise's engineering intelligence work — planning platforms that can enhance efficiency for both defence and civilian contexts." }
        ]
      },
      {
        "heading": "Improving Planning with Digital Tools",
        "blocks": [
          { "type": "paragraph", "content": "Government and defence agencies are increasingly looking for ways to use digital tools to improve planning and reduce risk. Tools like ENG|AIDE and FABHUMS are designed to meet this need, providing integrated support for engineering decision-making across the asset lifecycle." },
          { "type": "paragraph", "content": "A key insight from practitioner engagement is that the most valuable capability is not the tool itself — it is the ability to move fluidly between data, analysis and decision. Anywise platforms are built around this workflow." }
        ]
      },
      {
        "heading": "Advancing Edge Intelligence",
        "blocks": [
          { "type": "paragraph", "content": "No single solution can address all challenges. Logistics and engineering are still skills-intensive disciplines that require human judgement at every stage. The goal of edge intelligence is not replacement — it is augmentation." },
          { "type": "list", "items": [
            "Replacing guesswork and ad-hoc knowledge transfer with structured data flows",
            "Equipping engineers with real-time asset data to make faster, safer decisions",
            "Reducing administrative overhead by automating routine data aggregation",
            "Some level of experimentation is needed — outcomes cannot always be predicted in advance"
          ]},
          { "type": "paragraph", "content": "These insights have been validated through real-world deployment experiences, improving safety outcomes and operational readiness." }
        ]
      },
      {
        "heading": "Dual-Use Applications Beyond Defence",
        "blocks": [
          { "type": "paragraph", "content": "The same capabilities that serve defence procurement and asset management have direct application in civilian infrastructure, emergency services and industrial operations." },
          { "type": "list", "items": [
            "Emergency preparedness and situational awareness for first responders",
            "Permitting and infrastructure operations in local government",
            "Transport infrastructure inspection and lifecycle management",
            "Multi-agency coordination for complex engineering projects"
          ]}
        ]
      },
      {
        "heading": "Practical Takeaways",
        "blocks": [
          { "type": "list", "items": [
            "Data standards are foundational — without them, integration is impossible",
            "Tool selection must be informed by the actual decision-making workflow, not just feature lists",
            "Human expertise and machine intelligence work best when designed together from the start",
            "Incremental deployment reduces risk and builds organisational trust in new capabilities"
          ]}
        ]
      },
      {
        "heading": "Closing Thought",
        "blocks": [
          { "type": "paragraph", "content": "The opportunity is clear. As defence and government organisations face increasing pressure to do more with less, the organisations that invest in dual-use intelligence platforms — tools built for both the precision of defence and the scale of government — will be better positioned to meet these challenges and deliver lasting capability." }
        ]
      }
    ]
  },
  {
    "slug": "dcsp-must-be-catalyst-for-real-change",
    "title": "The DCSP Must Be a Catalyst for Real Change",
    "date": "2026-01-04",
    "readTime": 4,
    "category": "Defence",
    "author": "Anywise Team",
    "heroImage": "https://static.wixstatic.com/media/7f952a_e52cb4de647743f284ad3f7a1e674b79~mv2.png/v1/fill/w_1200,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/blog_podcastEp1-Hero.png",
    "intro": "The Defence Capability Support Package was established with the best of intentions: to catalyse a more agile, responsive and innovative defence industrial base. But good intentions are not the same as meaningful change. If the DCSP is to fulfil its mandate, it must move from policy framework to real, measurable impact for SMEs.",
    "sections": [
      {
        "heading": "DCSP is a Model Built for Today's Tempo — Not Yesterday's Contracts",
        "blocks": [
          { "type": "paragraph", "content": "For the DCSP to work, it must dramatically simplify the procurement entry point for SMEs. The defence industry's standard RFT process is resource-intensive — frequently deterring exactly the kind of agile, technology-focused organisations the DCSP is designed to attract." },
          { "type": "paragraph", "content": "Because the hard truth is simple: if the DCSP fails to implement change, the industry will continue along the same trajectory — dominated by a small number of large primes, with limited opportunity for the innovation that smaller players deliver." }
        ]
      },
      {
        "heading": "SMEs Are the Gap — They Are the Solution",
        "blocks": [
          { "type": "paragraph", "content": "Digital effects are driving the need for a new category of defence supplier." },
          { "type": "list", "items": [
            "Most digital innovation happens in SMEs, not large primes",
            "Defence procurement systems were not designed with SME capability in mind",
            "Developing technology to fill SME niches takes too long at the current pace",
            "A track record of innovation and reliability matters more than company size"
          ]},
          { "type": "paragraph", "content": "SMEs need an industry structure that allows them to build long-term capacity and capability while also taking on challenging problems. The DCSP must create the conditions for this." }
        ]
      },
      {
        "heading": "The Moment to Get This Right Is Now",
        "blocks": [
          { "type": "paragraph", "content": "The DCSP doesn't have a guaranteed future. It needs to demonstrate value by delivering outcomes that matter to the organisations it is meant to serve. If it fails to do so, it will lose credibility and be replaced." },
          { "type": "pullquote", "content": "The DCSP must be the catalyst. Not a new acronym." }
        ]
      }
    ]
  },
  {
    "slug": "vicworx-preparing-for-lift-off",
    "title": "VICWORX is Preparing for Lift Off",
    "date": "2025-02-25",
    "readTime": 2,
    "category": "Industry",
    "author": "Anywise Team",
    "heroImage": "https://static.wixstatic.com/media/60cb3d_dd936abb4356474c9c7761479d8a683b~mv2.png/v1/fill/w_1200,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/blog_podcastEp1-Hero.png",
    "intro": "VICWORX — Victoria's premier defence industry expo — is gearing up for another year of connecting capability with opportunity. Anywise is proud to be participating as the Victorian defence industry ecosystem continues to grow in scale and strategic importance.",
    "sections": [
      {
        "heading": "Why VICWORX Matters",
        "blocks": [
          { "type": "paragraph", "content": "Victoria's defence industry has reached an inflection point. With significant investments in sovereign capability, the state is positioning itself as a hub for defence technology, manufacturing and services." },
          { "type": "paragraph", "content": "VICWORX is the centrepiece of this ambition — a platform where businesses, government and academia come together to identify opportunities, forge partnerships and demonstrate emerging capabilities." }
        ]
      },
      {
        "heading": "What Anywise Will Be Showcasing",
        "blocks": [
          { "type": "paragraph", "content": "At this year's event, Anywise will be showcasing our suite of intelligence products — including WISDOM, ENG|AIDE and FABHUMS — alongside our consulting and advisory services for defence and government clients." },
          { "type": "paragraph", "content": "We look forward to connecting with procurement teams, industry partners and government agencies who are exploring what ethical, sovereign AI looks like in practice." }
        ]
      }
    ]
  },
  {
    "slug": "strengthening-commitment-to-ethical-business",
    "title": "Strengthening Our Commitment to Ethical, Quality-Driven Business",
    "date": "2024-10-03",
    "readTime": 3,
    "category": "Culture",
    "author": "Adam Ioannou",
    "heroImage": "https://static.wixstatic.com/media/60cb3d_d6a0ba6b031f4c7b9422c8dc23e470d0~mv2.webp/v1/fill/w_1200,h_600,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/blog_podcastEp1-Hero.webp",
    "intro": "At Anywise, we are on an exciting path of continuous improvement. As we work towards recertifying our B Corp status, we are also actively pursuing ISO certifications for 9001, 45001, 14001 and 27001. These certifications represent our commitment to ethical business practices: ensuring quality, safeguarding employee well-being, protecting data, and minimising our environmental impact.",
    "sections": [
      {
        "heading": "Working Towards B Corp Recertification",
        "blocks": [
          { "type": "paragraph", "content": "B Corp certification represents the highest standards of social and environmental responsibility, and we are committed to maintaining this esteemed status. Our recertification process is a thorough review of how we continue to positively impact all stakeholders, with a strong focus on ethical governance, community engagement, and sustainability." },
          { "type": "paragraph", "content": "This certification goes beyond recognition — it forms the foundation of our decision-making processes." }
        ]
      },
      {
        "heading": "ISO Certifications: A Framework for Quality and Security",
        "blocks": [
          { "type": "list", "items": [
            "ISO 9001 (Quality Management System): Consistently meeting customer expectations and regulatory requirements",
            "ISO 45001 (Occupational Health and Safety): Prioritising the health and safety of every employee",
            "ISO 14001 (Environmental Management System): Reducing our environmental footprint and minimising waste",
            "ISO 27001 (Information Security Management): Protecting our data and that of our clients in an interconnected world"
          ]}
        ]
      },
      {
        "heading": "A Unified Approach to Responsible Business",
        "blocks": [
          { "type": "paragraph", "content": "Our pursuit of both B Corp recertification and multiple ISO certifications demonstrates our holistic approach to responsible and sustainable business. Together, these certifications strengthen our ability to deliver ethical, high-quality services while prioritising the well-being of people, the environment, and our data security." }
        ]
      }
    ]
  }
]
```

- [ ] **Step 2: Validate JSON is well-formed**

```bash
python3 -c "import json; data=json.load(open('blog/posts.json')); print(f'Valid — {len(data)} posts')"
```
Expected: `Valid — 4 posts`

- [ ] **Step 3: Commit**

```bash
git add blog/posts.json
git commit -m "feat: add blog/posts.json with 4 migrated posts from Wix"
```

---

### Task 12: Create blog/index.html

**Files:**
- Create: `blog/index.html`

- [ ] **Step 1: Create blog/index.html**

Use standard head (title: `"any.news | Anywise Insights"`, description: `"The latest insights, analysis and thinking from the Anywise team."`), standard nav, standard footer from Task 4.

```html
<style>
  .blog-hero {
    padding: 8rem 0 4rem;
    border-bottom: 1px solid var(--border);
  }
  .blog-hero .label { opacity: 1; transform: none; margin-bottom: 0.75rem; }
  .blog-hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; letter-spacing: -0.02em; }

  .blog-list-section { padding: 4rem 0; }
  .blog-list { display: flex; flex-direction: column; gap: 0; }

  .blog-item {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 2rem;
    padding: 2rem 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    color: inherit;
    transition: background var(--transition);
  }
  .blog-item:first-child { border-top: 1px solid var(--border); }
  .blog-item:hover .blog-item-title { color: var(--accent); }

  .blog-thumb-wrap {
    aspect-ratio: 16/10;
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--bg-card);
    flex-shrink: 0;
  }
  .blog-thumb {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  .blog-item:hover .blog-thumb { transform: scale(1.05); }

  .blog-item-body { display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; }
  .blog-item-meta { font-size: 0.78rem; color: var(--text-tertiary); display: flex; gap: 1rem; }
  .blog-item-meta .category { color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  .blog-item-title { font-size: 1.1rem; font-weight: 700; line-height: 1.3; transition: color 0.2s; }
  .blog-item-excerpt { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; }
  .blog-item-arrow { font-size: 0.875rem; color: var(--accent); font-weight: 600; margin-top: 0.25rem; }

  .blog-empty {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .blog-item { grid-template-columns: 1fr; gap: 1rem; }
    .blog-thumb-wrap { aspect-ratio: 16/9; }
  }
</style>

<section class="blog-hero">
  <div class="container">
    <p class="label">Latest Insights</p>
    <h1>any.news</h1>
  </div>
</section>

<div class="section-divider"></div>

<section class="blog-list-section">
  <div class="container">
    <div class="blog-list" id="blogList">
      <div class="blog-empty">Loading posts...</div>
    </div>
  </div>
</section>

<script>
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}
function truncate(str, n) {
  if (!str || str.length <= n) return str;
  return str.slice(0, n).trimEnd() + '…';
}
fetch('posts.json')
  .then(function(r) { return r.json(); })
  .then(function(posts) {
    posts.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    const list = document.getElementById('blogList');
    if (!posts.length) {
      list.innerHTML = '<div class="blog-empty">No posts yet.</div>';
      return;
    }
    list.innerHTML = posts.map(function(p) {
      return `<a href="post.html?slug=${encodeURIComponent(p.slug)}" class="blog-item reveal">
        <div class="blog-thumb-wrap">
          <img class="blog-thumb" src="${p.heroImage}" alt="${p.title}" loading="lazy">
        </div>
        <div class="blog-item-body">
          <div class="blog-item-meta">
            <span class="category">${p.category}</span>
            <span>${formatDate(p.date)}</span>
            <span>${p.readTime} min read</span>
          </div>
          <div class="blog-item-title">${p.title}</div>
          <div class="blog-item-excerpt">${truncate(p.intro, 160)}</div>
          <div class="blog-item-arrow">Read more →</div>
        </div>
      </a>`;
    }).join('');
    // Re-run reveal observer on new elements
    if (window.__runReveal) window.__runReveal();
  })
  .catch(function() {
    document.getElementById('blogList').innerHTML = '<div class="blog-empty">Unable to load posts. Please try again later.</div>';
  });
</script>
```

- [ ] **Step 2: Verify**

Open http://localhost:8080/blog/index.html — should show 4 posts in newest-first order with thumbnails, meta, and excerpts.

- [ ] **Step 3: Commit**

```bash
git add blog/index.html
git commit -m "feat: add blog home page with editorial list from posts.json"
```

---

### Task 13: Create blog/post.html

**Files:**
- Create: `blog/post.html`

- [ ] **Step 1: Create blog/post.html**

Use standard head (title set via JS), standard nav, standard footer.

```html
<style>
  .post-hero { padding: 8rem 0 0; }
  .post-hero-inner { max-width: 760px; margin: 0 auto; padding: 0 2rem; }
  .post-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 1.5rem; flex-wrap: wrap; }
  .post-meta .category { color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  .post-hero h1 { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
  .post-intro { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.75; margin-bottom: 2rem; }
  .post-hero-img-wrap {
    margin-top: 2rem;
    aspect-ratio: 16/7;
    overflow: hidden;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  .post-hero-img { width: 100%; height: 100%; object-fit: cover; }

  .post-body { padding: 3rem 0 5rem; }
  .post-body-inner { max-width: 760px; margin: 0 auto; padding: 0 2rem; }

  .post-section { margin-bottom: 2.5rem; }
  .post-section h2 { font-size: 1.35rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); }
  .post-section p { font-size: 0.975rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem; }
  .post-section ul { padding-left: 1.5rem; margin-bottom: 1rem; }
  .post-section ul li { font-size: 0.975rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.4rem; }
  .post-section ul li::marker { color: var(--accent); }
  .post-pullquote {
    border-left: 3px solid var(--accent);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    background: var(--bg-card);
    border-radius: 0 var(--radius) var(--radius) 0;
    font-size: 1.05rem;
    font-style: italic;
    color: var(--text-primary);
    line-height: 1.6;
  }
  .post-inline-img { margin: 1.5rem 0; }
  .post-inline-img img { width: 100%; border-radius: var(--radius-lg); }
  .post-inline-img figcaption { font-size: 0.78rem; color: var(--text-tertiary); margin-top: 0.5rem; text-align: center; }

  .post-share {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem 0;
    border-top: 1px solid var(--border);
    margin-top: 2rem;
    flex-wrap: wrap;
  }
  .post-share span { font-size: 0.82rem; color: var(--text-tertiary); }
  .post-share a, .post-share button {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-decoration: none;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.4rem 0.875rem;
    cursor: pointer;
    font-family: var(--font);
    transition: border-color 0.2s, color 0.2s;
  }
  .post-share a:hover, .post-share button:hover { border-color: var(--border-accent); color: var(--accent); }

  .post-more { padding: 4rem 0; border-top: 1px solid var(--border); }
  .post-more .label { opacity: 1; transform: none; margin-bottom: 1.5rem; }
  .post-more-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .post-more-card {
    display: block;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: border-color var(--transition);
  }
  .post-more-card:hover { border-color: var(--border-accent); }
  .post-more-thumb { aspect-ratio: 16/9; overflow: hidden; }
  .post-more-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .post-more-body { padding: 1.25rem; }
  .post-more-meta { font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.5rem; }
  .post-more-title { font-size: 0.95rem; font-weight: 600; line-height: 1.4; }

  .post-not-found { padding: 10rem 0; text-align: center; }
  .post-not-found h1 { font-size: 2rem; margin-bottom: 1rem; }
  .post-not-found p { color: var(--text-secondary); margin-bottom: 2rem; }

  @media (max-width: 768px) {
    .post-more-grid { grid-template-columns: 1fr; }
  }
</style>

<div id="postContent">
  <div style="padding:10rem 0;text-align:center;color:var(--text-secondary);">Loading...</div>
</div>

<script>
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderBlock(block) {
  if (block.type === 'paragraph') {
    return `<p>${block.content}</p>`;
  }
  if (block.type === 'list') {
    return `<ul>${block.items.map(function(i) { return `<li>${i}</li>`; }).join('')}</ul>`;
  }
  if (block.type === 'image') {
    return `<figure class="post-inline-img"><img src="${block.src}" alt="${block.caption || ''}"><figcaption>${block.caption || ''}</figcaption></figure>`;
  }
  if (block.type === 'pullquote') {
    return `<blockquote class="post-pullquote">${block.content}</blockquote>`;
  }
  return '';
}

function renderPost(post, allPosts) {
  // Set page title
  document.title = post.title + ' | Anywise';

  // "More" posts: up to 2 other posts, newest first
  const more = allPosts
    .filter(function(p) { return p.slug !== post.slug; })
    .sort(function(a, b) { return new Date(b.date) - new Date(a.date); })
    .slice(0, 2);

  const sectionsHTML = post.sections.map(function(s) {
    return `<div class="post-section">
      <h2>${s.heading}</h2>
      ${s.blocks.map(renderBlock).join('')}
    </div>`;
  }).join('');

  const moreHTML = more.length ? `
    <section class="post-more">
      <div class="container" style="max-width:760px;">
        <p class="label">More from Anywise</p>
        <div class="post-more-grid">
          ${more.map(function(p) { return `
            <a href="post.html?slug=${encodeURIComponent(p.slug)}" class="post-more-card">
              <div class="post-more-thumb"><img src="${p.heroImage}" alt="${p.title}" loading="lazy"></div>
              <div class="post-more-body">
                <div class="post-more-meta">${formatDate(p.date)} · ${p.readTime} min read</div>
                <div class="post-more-title">${p.title}</div>
              </div>
            </a>`; }).join('')}
        </div>
      </div>
    </section>` : '';

  const pageURL = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(post.title);

  document.getElementById('postContent').innerHTML = `
    <article>
      <header class="post-hero">
        <div class="post-hero-inner">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="../anywise-v5-redesign.html">Home</a>
            <span class="breadcrumb-sep" aria-hidden="true">/</span>
            <a href="index.html">Insights</a>
            <span class="breadcrumb-sep" aria-hidden="true">/</span>
            <span aria-current="page">${post.title}</span>
          </nav>
          <div class="post-meta">
            <span class="category">${post.category}</span>
            <span>${formatDate(post.date)}</span>
            <span>${post.readTime} min read</span>
            <span>By ${post.author}</span>
          </div>
          <h1>${post.title}</h1>
          <p class="post-intro">${post.intro}</p>
        </div>
        <div class="post-hero-img-wrap">
          <img class="post-hero-img" src="${post.heroImage}" alt="${post.title}">
        </div>
      </header>

      <div class="post-body">
        <div class="post-body-inner">
          ${sectionsHTML}

          <div class="post-share">
            <span>Share:</span>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${pageURL}" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://twitter.com/intent/tweet?url=${pageURL}&text=${pageTitle}" target="_blank" rel="noopener">X / Twitter</a>
            <button onclick="navigator.clipboard.writeText(window.location.href).then(function(){this.textContent='Copied!';}.bind(this))">Copy link</button>
          </div>
        </div>
      </div>
    </article>
    ${moreHTML}`;
}

function renderNotFound() {
  document.getElementById('postContent').innerHTML = `
    <div class="post-not-found">
      <h1>Post not found</h1>
      <p>This post doesn't exist or may have moved.</p>
      <a href="index.html" class="btn btn-primary">Back to Insights</a>
    </div>`;
}

const slug = new URLSearchParams(window.location.search).get('slug');
if (!slug) {
  renderNotFound();
} else {
  fetch('posts.json')
    .then(function(r) { return r.json(); })
    .then(function(posts) {
      const post = posts.find(function(p) { return p.slug === slug; });
      if (!post) { renderNotFound(); } else { renderPost(post, posts); }
    })
    .catch(renderNotFound);
}
</script>
```

- [ ] **Step 2: Verify**

Open http://localhost:8080/blog/post.html?slug=transforming-operational-challenges — should render full post with hero image, sections, share buttons and "More from Anywise".

Test not-found: http://localhost:8080/blog/post.html?slug=does-not-exist — should show "Post not found".

- [ ] **Step 3: Commit**

```bash
git add blog/post.html
git commit -m "feat: add blog single post template with JSON-driven rendering"
```

---

## Phase 4 — Engage Standalone Page

### Task 14: Create engage/index.html

**Files:**
- Create: `engage/index.html`

- [ ] **Step 1: Create engage directory and index.html**

```bash
mkdir -p engage
```

Create `engage/index.html` using the standard head (title: `"Engage Us | Anywise"`, description: `"Get in touch with the Anywise team. Tell us about your challenge and we'll get back to you within one business day."`), standard nav and footer from Task 4. The form content mirrors the modal exactly but in a full-page layout.

```html
<style>
  .engage-page {
    min-height: 100vh;
    padding: 8rem 0 5rem;
  }
  .engage-page-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: start;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  .engage-page-text .label { opacity: 1; transform: none; margin-bottom: 0.75rem; }
  .engage-page-text h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.15; margin-bottom: 1rem; }
  .engage-page-text p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem; }
  .engage-page-text .contact-detail { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; font-size: 0.9rem; color: var(--text-secondary); }
  .engage-page-text .contact-detail a { color: var(--accent); text-decoration: none; }

  .engage-page-form {
    background: var(--bg-card);
    border: 1px solid var(--border-accent);
    border-radius: 20px;
    padding: 2.5rem;
  }
  .engage-page-form h2 { font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; }

  /* Reuse .engage-group, .engage-form-row, .engage-product-row, .engage-actions, .engage-privacy from shared.css */

  @media (max-width: 1024px) {
    .engage-page-inner { grid-template-columns: 1fr; gap: 3rem; }
  }
</style>

<section class="engage-page">
  <div class="engage-page-inner">
    <div class="engage-page-text">
      <p class="label">Get in touch</p>
      <h1>Engage Us</h1>
      <p>Tell us about your most complex challenge. Whether you're navigating a procurement decision, standing up a new capability, or exploring what ethical AI looks like in your context — we want to hear from you.</p>
      <p>We'll get back to you within one business day.</p>
      <div class="contact-detail">
        <span>✉</span>
        <a href="mailto:sales@anywise.com.au">sales@anywise.com.au</a>
      </div>
      <div class="contact-detail">
        <span>📞</span>
        <a href="tel:1800861963">1800 861 963</a>
      </div>
    </div>
    <div class="engage-page-form">
      <h2>Tell us about your challenge</h2>
      <form action="mailto:sales@anywise.com.au" method="post" enctype="text/plain">
        <div class="engage-form-row">
          <div class="engage-group">
            <label for="epName">Full name <span aria-hidden="true">*</span></label>
            <input type="text" id="epName" name="name" placeholder="Jane Smith" required autocomplete="name">
          </div>
          <div class="engage-group">
            <label for="epEmail">Work email <span aria-hidden="true">*</span></label>
            <input type="email" id="epEmail" name="email" placeholder="jane@organisation.gov.au" required autocomplete="email">
          </div>
          <div class="engage-group">
            <label for="epOrg">Organisation <span aria-hidden="true">*</span></label>
            <input type="text" id="epOrg" name="organisation" placeholder="Department / Company" required>
          </div>
          <div class="engage-group">
            <label for="epRole">Your role</label>
            <input type="text" id="epRole" name="role" placeholder="e.g. CTO, Project Manager" autocomplete="organization-title">
          </div>
          <div class="engage-group full">
            <label for="epType">What are you looking for? <span aria-hidden="true">*</span></label>
            <select id="epType" name="enquiry_type" required>
              <option value="" disabled selected>Select one...</option>
              <option value="product">Product enquiry</option>
              <option value="partnership">Partnership or collaboration</option>
              <option value="general">General enquiry</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div class="engage-group full engage-product-row" id="epProductRow" style="display:none;margin-bottom:1rem;">
          <label for="epProduct">Which product? <span aria-hidden="true">*</span></label>
          <select id="epProduct" name="product">
            <option value="" disabled selected>Select a product...</option>
            <option value="wisdom">WISDOM</option>
            <option value="engaide">ENG|AIDE</option>
            <option value="fabhums">FABHUMS</option>
            <option value="campaide">CAMP|AIDE</option>
            <option value="aide">AIDE</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="engage-group full" style="margin-bottom:1rem;">
          <label for="epMessage">Message <span aria-hidden="true">*</span></label>
          <textarea id="epMessage" name="message" placeholder="Tell us about your challenge..." required></textarea>
        </div>
        <div class="engage-actions">
          <p class="engage-privacy">We respect your privacy. Your details are never shared with third parties.</p>
          <button type="submit" class="btn btn-primary">Send →</button>
        </div>
      </form>
    </div>
  </div>
</section>

<script>
document.getElementById('epType').addEventListener('change', function() {
  var row = document.getElementById('epProductRow');
  var productSelect = document.getElementById('epProduct');
  var show = this.value === 'product';
  row.style.display = show ? 'block' : 'none';
  productSelect.required = show;
});
</script>
```

- [ ] **Step 2: Verify**

Open http://localhost:8080/engage/index.html — form renders, selecting "Product enquiry" shows product dropdown, theme toggle works.

- [ ] **Step 3: Commit**

```bash
git add engage/index.html
git commit -m "feat: add standalone Engage Us page"
```

---

## Phase 5 — Final wiring and push

### Task 15: Update main page nav links and footer

**Files:**
- Modify: `anywise-v5-redesign.html`

- [ ] **Step 1: Update footer links in anywise-v5-redesign.html**

Find the footer section (around line 1924). Update the Company column links:
```html
<div class="footer-col">
  <h4>Products</h4>
  <a href="products/wisdom.html">WISDOM</a>
  <a href="products/engaide.html">ENG|AIDE</a>
  <a href="products/fabhums.html">FABHUMS</a>
  <a href="products/campaide.html">CAMP|AIDE</a>
  <a href="products/aide.html">AIDE</a>
</div>
<div class="footer-col">
  <h4>Company</h4>
  <a href="#about">About Anywise</a>
  <a href="#approach">Our Approach</a>
  <a href="blog/index.html">Insights</a>
</div>
```

- [ ] **Step 2: Update news section links to point to blog post pages**

Find the 4 news card `<a>` elements (around line 1842). Replace each `href` with the corresponding internal blog URL:

```html
<!-- Post 1 -->
<a href="blog/post.html?slug=transforming-operational-challenges" class="news-card reveal">
<!-- Post 2 -->
<a href="blog/post.html?slug=dcsp-must-be-catalyst-for-real-change" class="news-card reveal">
<!-- Post 3 -->
<a href="blog/post.html?slug=vicworx-preparing-for-lift-off" class="news-card reveal">
<!-- Post 4 -->
<a href="blog/post.html?slug=strengthening-commitment-to-ethical-business" class="news-card reveal">
```

- [ ] **Step 3: Update products section card links to point to product pages**

Find the product cards (around line 1719). Add `href` to each card or wrap each in an `<a>`:
The cards are currently `<div class="product-card">` — change each to `<a class="product-card" href="products/SLUG.html">` and add `text-decoration:none;color:inherit;display:block;` to `.product-card` if not already present.

- [ ] **Step 4: Full smoke test**

```bash
python3 -m http.server 8080
```

Check:
1. http://localhost:8080/anywise-v5-redesign.html — all nav links work, Engage Us modal opens, footer links work, news card links go to blog posts, product cards link to product pages
2. http://localhost:8080/products/index.html — 5 cards, all link to product pages
3. http://localhost:8080/products/wisdom.html — full page, all 3 CTAs open modal, breadcrumb works
4. http://localhost:8080/blog/index.html — 4 posts listed, newest first
5. http://localhost:8080/blog/post.html?slug=transforming-operational-challenges — full post renders
6. http://localhost:8080/engage/index.html — form renders, product dropdown shows conditionally
7. Dark/light mode toggle works on every page
8. Mobile hamburger works on every page (resize browser to <768px)

- [ ] **Step 5: Commit and push**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: wire main page nav, footer, news and product links to new pages"
git push origin multi-page-website
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ shared.css — Task 1
- ✅ shared.js with theme, mobile menu, reveal, modal — Task 2
- ✅ main page updated with new nav links and engage modal trigger — Task 3
- ✅ products/index.html card grid — Task 5
- ✅ individual product pages (all 5) with 6-section structure — Tasks 6–10
- ✅ alternating image/text columns — enforced via `.prod-two-col.flip` in Task 6
- ✅ image placeholders on all product pages — included in Task 6 template
- ✅ blog/posts.json with 4 migrated posts — Task 11
- ✅ blog/index.html editorial list — Task 12
- ✅ blog/post.html slug-based rendering, not-found state, share strip, more posts — Task 13
- ✅ engage/index.html standalone — Task 14
- ✅ engage modal in shared.js with conditional product dropdown — Task 2
- ✅ .btn-ghost defined in shared.css — Task 1
- ✅ correct CSS variable names (--border-accent, --bg-card, --bg-deep) throughout — Task 1
- ✅ mobile nth-child updated to 7 items — Task 1
- ✅ intro truncated to 160 chars in blog listing — Task 12
- ✅ fetch() note — documented in spec, local server used in all verify steps
- ✅ nav links use `data-engage` + `event.preventDefault()` — Task 2 & 3
- ✅ `engage/index.html` not in nav — Task 4 nav template confirms
- ✅ footer updated on main page — Task 15

**No placeholders found** — all code steps are complete.

**Type consistency:** `openEngageModal()` and `closeEngageModal()` defined in Task 2 and called consistently. `data-engage` attribute used consistently in Tasks 2, 3, 5, 6. `posts.json` schema defined in Task 11 matches rendering in Tasks 12 and 13.
