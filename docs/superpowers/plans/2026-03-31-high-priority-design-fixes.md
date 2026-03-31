# High Priority Design Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 5 high-priority design issues in the Anywise website to eliminate AI-generated aesthetics and create visual variety across sections.

**Architecture:** Single-file website (`anywise-v5-redesign.html`) containing inline CSS and JS. All changes are to this one file plus two new asset files (favicon, OG image). Tasks are ordered to avoid conflicts — font and gradient changes first (global), then section-by-section layout rewrites, then hover refinements, then meta tags last.

**Tech Stack:** Vanilla HTML/CSS/JS, General Sans (Fontshare), JetBrains Mono (Google Fonts), Three.js (existing), SVG

---

### Task 1: Font Swap — Replace Inter with General Sans

**Files:**
- Modify: `anywise-v5-redesign.html:9-10` (font imports)
- Modify: `anywise-v5-redesign.html:48` (CSS variable)

- [ ] **Step 1: Replace the Google Fonts `<link>` tags**

Replace lines 9-10:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

With:
```html
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update the CSS `--font` variable**

Replace line 48:
```css
--font: 'Inter', -apple-system, sans-serif;
```

With:
```css
--font: 'General Sans', -apple-system, sans-serif;
```

- [ ] **Step 3: Visual check**

Open `anywise-v5-redesign.html` in a browser. Verify:
- All body text renders in General Sans (check DevTools computed font)
- All monospace labels (section labels, card tags, stat labels, footer) still render in JetBrains Mono
- Hero headline, section headings, card titles all use General Sans
- No layout shifts or text overflow from the font metric change

- [ ] **Step 4: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: replace Inter with General Sans typeface"
```

---

### Task 2: Gradient Text Restraint

**Files:**
- Modify: `anywise-v5-redesign.html:76-81` (remove `.gradient-text` utility)
- Modify: `anywise-v5-redesign.html:209-214` (`.nav-brand span`)
- Modify: `anywise-v5-redesign.html:582-587` (`.stat-box h3 .accent`)
- Modify: `anywise-v5-redesign.html:924-933` (`.product-card-highlight`)
- Modify: `anywise-v5-redesign.html:1021-1027` (`.team h2 em`)
- Modify: `anywise-v5-redesign.html:1028-1036` (`.team-sub`)

- [ ] **Step 1: Remove the `.gradient-text` utility class**

Delete lines 76-81:
```css
.gradient-text {
  background: var(--gradient-full);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 2: Convert `.nav-brand span` to solid accent**

Replace lines 209-214:
```css
.nav-brand span {
  background: var(--gradient-al);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

With:
```css
.nav-brand span {
  color: var(--accent);
}
```

- [ ] **Step 3: Convert `.stat-box h3 .accent` to solid accent**

Replace lines 582-587:
```css
.stat-box h3 .accent {
  background: var(--gradient-al);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

With:
```css
.stat-box h3 .accent {
  color: var(--accent);
}
```

- [ ] **Step 4: Convert `.product-card-highlight` to solid accent**

Replace lines 924-933:
```css
.product-card-highlight {
  font-family: var(--mono);
  font-size: 0.7rem;
  background: var(--gradient-al);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 0.8rem;
  font-style: italic;
}
```

With:
```css
.product-card-highlight {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--accent);
  margin-top: 0.8rem;
  font-style: italic;
}
```

- [ ] **Step 5: Convert `.team h2 em` to solid accent**

Replace lines 1021-1027:
```css
.team h2 em {
  font-style: normal;
  background: var(--gradient-al);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

With:
```css
.team h2 em {
  font-style: normal;
  color: var(--accent);
}
```

- [ ] **Step 6: Convert `.team-sub` to solid accent**

Replace lines 1028-1036:
```css
.team-sub {
  background: var(--gradient-al);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}
```

With:
```css
.team-sub {
  color: var(--accent);
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}
```

- [ ] **Step 7: Visual check**

Open in browser. Verify:
- Hero "ethically engineered." still has green-to-lime gradient text
- Purpose "positive impact" still has green-to-lime gradient text
- Nav brand "wise" is now solid green (no gradient)
- Hero stat numbers (10+, APAC/EU, Ethical AI) are solid green
- Product card highlights are solid green
- Team heading "one" is solid green
- Team sub-heading "The Anywise Team" is solid green

- [ ] **Step 8: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: restrain gradient text to hero and purpose statement only"
```

---

### Task 3: Values Section — Replace Cards with Inline Text Flow

**Files:**
- Modify: `anywise-v5-redesign.html:620-655` (remove old CSS, add new CSS)
- Modify: `anywise-v5-redesign.html:1348` (update 768px responsive rule)
- Modify: `anywise-v5-redesign.html:1450-1468` (replace HTML)

- [ ] **Step 1: Remove old value card CSS**

Delete the CSS rules for `.values-row`, `.value-card`, `.value-card:hover`, `.value-icon`, `.value-card h3`, `.value-card p` (lines ~620-655). This is the block starting with:
```css
.values-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
```
Through to:
```css
.value-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}
```

- [ ] **Step 2: Add new values list CSS**

In the same location where the old CSS was removed, add:
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

- [ ] **Step 3: Update the 768px responsive rule**

In the `@media (max-width: 768px)` block, replace:
```css
.values-row { grid-template-columns: 1fr; }
```

With:
```css
.value-row { flex-direction: column; gap: 0.2rem; }
.value-dash { display: none; }
```

- [ ] **Step 4: Replace values HTML**

Replace the values HTML block (the `<p class="label">` for "Our Values" and the entire `.values-row` div with its three `.value-card` children):
```html
      <p class="label" style="margin-top:3rem;">Our Values</p>
      <div class="values-row">
        <div class="value-card">
          <div class="value-icon">&#9878;</div>
          <h3>Act Ethically &amp; with Integrity</h3>
          <p>We hold ourselves to the highest standards of honesty, transparency and accountability in everything we do.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">&#9733;</div>
          <h3>Be Curious &amp; Innovative</h3>
          <p>We embrace continuous learning and creative problem-solving to deliver forward-thinking solutions.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">&#10038;</div>
          <h3>Champion Empowerment &amp; Collaboration</h3>
          <p>We lift each other up, share knowledge freely and work together to achieve extraordinary outcomes.</p>
        </div>
      </div>
```

With:
```html
      <p class="label" style="margin-top:3rem;">Our Values</p>
      <div class="values-list">
        <div class="value-row">
          <span class="value-name">Act Ethically &amp; with Integrity</span>
          <span class="value-dash"></span>
          <span class="value-desc">We hold ourselves to the highest standards of honesty, transparency and accountability in everything we do.</span>
        </div>
        <div class="value-row">
          <span class="value-name">Be Curious &amp; Innovative</span>
          <span class="value-dash"></span>
          <span class="value-desc">We embrace continuous learning and creative problem-solving to deliver forward-thinking solutions.</span>
        </div>
        <div class="value-row">
          <span class="value-name">Champion Empowerment &amp; Collaboration</span>
          <span class="value-dash"></span>
          <span class="value-desc">We lift each other up, share knowledge freely and work together to achieve extraordinary outcomes.</span>
        </div>
      </div>
```

- [ ] **Step 5: Visual check**

Open in browser. Verify:
- Values display as horizontal rows: green name — dash — description
- No cards, no borders, no emoji icons
- At 768px width, values stack vertically with name above description and dash hidden

- [ ] **Step 6: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: replace value cards with inline text flow"
```

---

### Task 4: Approach Section — Replace Feature Cards with Numbered List

**Files:**
- Modify: `anywise-v5-redesign.html:777-820` (remove old CSS, add new CSS)
- Modify: `anywise-v5-redesign.html:1512-1529` (replace HTML)

- [ ] **Step 1: Remove old feature card CSS**

Delete the CSS rules for `.approach-features`, `.feature-card`, `.feature-card::before`, `.feature-card:hover::before`, `.feature-card:hover`, `.feature-card h4`, `.feature-card p` (lines ~777-820). This is the block starting with:
```css
.approach-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```
Through to:
```css
.feature-card p {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

- [ ] **Step 2: Add new approach list CSS**

In the same location, add:
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
.approach-item:hover .approach-item-num {
  color: var(--lime);
}
```

- [ ] **Step 3: Replace approach features HTML**

Replace the approach features right column:
```html
      <div class="approach-features reveal-right">
        <div class="feature-card">
          <h4>Human-centred by design</h4>
          <p>Every system we build keeps the human in the decision loop — augmenting judgement, not replacing it.</p>
        </div>
        <div class="feature-card">
          <h4>Practitioner-led advisory</h4>
          <p>Our advisors carry operational credibility, not just credentials. Advice grounded in what actually works in complex environments.</p>
        </div>
        <div class="feature-card">
          <h4>Sovereign and secure</h4>
          <p>We understand data sovereignty, security obligations, and the sensitivity that defence and government work demands.</p>
        </div>
        <div class="feature-card">
          <h4>Outcome accountability</h4>
          <p>We mobilise to deliver. Clear milestones, transparent progress, and shared ownership of results.</p>
        </div>
      </div>
```

With:
```html
      <div class="approach-list reveal-right">
        <div class="approach-item">
          <span class="approach-item-num">01</span>
          <div>
            <h4>Human-centred by design</h4>
            <p>Every system we build keeps the human in the decision loop — augmenting judgement, not replacing it.</p>
          </div>
        </div>
        <div class="approach-item">
          <span class="approach-item-num">02</span>
          <div>
            <h4>Practitioner-led advisory</h4>
            <p>Our advisors carry operational credibility, not just credentials. Advice grounded in what actually works in complex environments.</p>
          </div>
        </div>
        <div class="approach-item">
          <span class="approach-item-num">03</span>
          <div>
            <h4>Sovereign and secure</h4>
            <p>We understand data sovereignty, security obligations, and the sensitivity that defence and government work demands.</p>
          </div>
        </div>
        <div class="approach-item">
          <span class="approach-item-num">04</span>
          <div>
            <h4>Outcome accountability</h4>
            <p>We mobilise to deliver. Clear milestones, transparent progress, and shared ownership of results.</p>
          </div>
        </div>
      </div>
```

- [ ] **Step 4: Visual check**

Open in browser. Verify:
- Approach section right column shows numbered items (01-04) with no card borders
- Hovering an item shifts the number from green to lime
- Layout collapses properly at 1024px (stacks below text) and 768px

- [ ] **Step 5: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: replace approach feature cards with numbered list"
```

---

### Task 5: Track Record — Replace Stat Cards with Inline Row

**Files:**
- Modify: `anywise-v5-redesign.html:954-999` (remove old CSS, add new CSS)
- Modify: `anywise-v5-redesign.html:1304-1311` (update 1024px responsive)
- Modify: `anywise-v5-redesign.html:1347` (update 768px responsive)
- Modify: `anywise-v5-redesign.html:1613-1631` (replace HTML)

- [ ] **Step 1: Remove old track stat CSS**

Delete the CSS rules for `.track-stats`, `.track-stat`, `.track-stat::after`, `.track-stat:hover::after`, `.track-stat:hover`, `.track-stat h3`, `.track-stat p` (lines ~954-999). This is the block starting with:
```css
.track-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
```
Through to:
```css
.track-stat p {
  font-size: 0.72rem;
  color: var(--text-tertiary);
  line-height: 1.5;
  font-family: var(--mono);
}
```

- [ ] **Step 2: Add new track row CSS**

In the same location, add:
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

- [ ] **Step 3: Update 1024px responsive rule**

In the `@media (max-width: 1024px)` block, replace:
```css
.track-stats { grid-template-columns: repeat(2, 1fr); }
```

With:
```css
.track-row { display: grid; grid-template-columns: 1fr 1fr; }
.track-item + .track-item { border-left: none; }
.track-item { border-bottom: 1px solid var(--border); padding: 1rem; }
```

- [ ] **Step 4: Update 768px responsive rule**

In the `@media (max-width: 768px)` block, replace:
```css
.track-stats { grid-template-columns: 1fr 1fr; }
```

With:
```css
.track-row { display: grid; grid-template-columns: 1fr 1fr; }
.track-item + .track-item { border-left: none; }
.track-item { border-bottom: 1px solid var(--border); padding: 1rem; }
```

- [ ] **Step 5: Replace track record HTML**

Replace the track stats HTML:
```html
    <div class="track-stats">
      <div class="track-stat reveal-scale" data-count="50" data-suffix="+">
        <h3 class="counter">50+</h3>
        <p>Defence &amp; government engagements delivered</p>
      </div>
      <div class="track-stat reveal-scale" data-count="3" data-suffix="+">
        <h3 class="counter">3+</h3>
        <p>Jurisdictions across APAC/EU/allied partners</p>
      </div>
      <div class="track-stat reveal-scale">
        <h3>ISO</h3>
        <p>Quality management certified</p>
      </div>
      <div class="track-stat reveal-scale">
        <h3>AIC+</h3>
        <p>Australian Industry Capability committed</p>
      </div>
    </div>
```

With:
```html
    <div class="track-row reveal">
      <div class="track-item" data-count="50" data-suffix="+">
        <h3 class="counter">50+</h3>
        <p>Defence &amp; government engagements delivered</p>
      </div>
      <div class="track-item" data-count="3" data-suffix="+">
        <h3 class="counter">3+</h3>
        <p>Jurisdictions across APAC/EU/allied partners</p>
      </div>
      <div class="track-item">
        <h3>ISO</h3>
        <p>Quality management certified</p>
      </div>
      <div class="track-item">
        <h3>AIC+</h3>
        <p>Australian Industry Capability committed</p>
      </div>
    </div>
```

Note: Changed from `reveal-scale` on individual items to single `reveal` on the container. Kept `data-count`, `data-suffix`, and `.counter` class for the counter animation JS.

- [ ] **Step 6: Visual check**

Open in browser. Verify:
- Stats display as a horizontal row with thin vertical dividers between items
- Numbers are white (not gradient)
- No hover effects on stats
- Counter animation still works on "50+" and "3+" when scrolling into view
- At 1024px and 768px, stats wrap to 2x2 grid

- [ ] **Step 7: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: replace track record stat cards with inline row"
```

---

### Task 6: Hover Effect Diversity

**Files:**
- Modify: `anywise-v5-redesign.html:863-866` (product card hover)
- Modify: `anywise-v5-redesign.html:892-901` (product card image overlay)
- Modify: `anywise-v5-redesign.html:1088-1092` (news card hover)
- Modify: `anywise-v5-redesign.html:1098-1106` (news card thumb overlay)
- Modify: `anywise-v5-redesign.html:1168-1171` (CTA box hover)
- Modify: `anywise-v5-redesign.html:1939` (product card tilt JS)

- [ ] **Step 1: Simplify product card hover CSS**

Replace the `.product-card:hover` rule:
```css
.product-card:hover {
  border-color: var(--border-accent);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 50px rgba(57,168,73,0.06);
}
```

With:
```css
.product-card:hover {
  border-color: var(--border-accent);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
```

- [ ] **Step 2: Remove product card image green overlay**

Delete the `.product-card-img-wrap::after` rule and its hover rule (the block that creates the green gradient overlay on product card images):
```css
/* Gradient overlay on hover */
.product-card-img-wrap::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(45, 127, 54, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.5s;
}
.product-card:hover .product-card-img-wrap::after { opacity: 1; }
```

- [ ] **Step 3: Update news card hover CSS**

Replace the `.news-card:hover` rule:
```css
.news-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 30px rgba(57,168,73,0.04);
}
```

With:
```css
.news-card:hover {
  border-color: var(--border-accent);
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}
```

- [ ] **Step 4: Remove news card thumb green overlay**

Delete the `.news-card-thumb-wrap::after` rule and its hover rule:
```css
/* Green overlay on hover */
.news-card-thumb-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(57,168,73,0.2), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
}
.news-card:hover .news-card-thumb-wrap::after { opacity: 1; }
```

- [ ] **Step 5: Remove CTA box hover**

Delete the `.cta-box:hover` rule:
```css
.cta-box:hover {
  border-color: var(--border-accent);
  box-shadow: 0 12px 48px rgba(0,0,0,0.3), 0 0 40px rgba(57,168,73,0.04);
}
```

- [ ] **Step 6: Remove translateY(-6px) from product card tilt JS**

In the JavaScript mousemove handler for product cards (line ~1939), replace:
```javascript
card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
```

With:
```javascript
card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
```

- [ ] **Step 7: Visual check**

Open in browser. Verify:
- **Product cards:** Tilt on hover without lifting. No green image overlay. Shadow is dark only (no green glow).
- **News cards:** Gentle scale up on hover (no vertical lift). No green overlay on thumbnails. Arrow still reveals on hover. Date still changes color.
- **CTA section:** Box does not change on hover. Image still zooms subtly. Buttons still have their own hover states.
- **Capability cards:** Unchanged — still lift, spotlight, and glow (intentional exception).

- [ ] **Step 8: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: diversify hover effects across sections"
```

---

### Task 7: CSS Cleanup — Dead Rules and !important Removal

**Files:**
- Modify: `anywise-v5-redesign.html:242-249` (`.nav-cta` !important cleanup)
- Modify: `anywise-v5-redesign.html:742-755` (dead `.approach-left` CSS)

- [ ] **Step 1: Fix `.nav-cta` !important declarations**

Replace:
```css
.nav-cta {
  background: var(--accent) !important;
  color: var(--bg-deep) !important;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600 !important;
  font-size: 0.78rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}
```

With:
```css
a.nav-cta {
  background: var(--accent);
  color: var(--bg-deep);
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.78rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
```

The `a.nav-cta` selector is more specific than `.nav-links a`, which eliminates the need for `!important`.

- [ ] **Step 2: Remove dead `.approach-left` CSS**

Delete these rules (the class `approach-left` is never used in the HTML — the approach section uses `reveal-left` instead):
```css
.approach-left h2 {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin-bottom: 2rem;
}
.approach-left p {
  font-size: 0.92rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.7;
}
```

- [ ] **Step 3: Visual check**

Open in browser. Verify:
- Nav "Engage Us" CTA button still has green background, dark text, correct size
- Nav CTA hover still works (gradient overlay, slight lift, green shadow)
- Approach section text styling is unchanged (the styles were already being applied by other selectors or inline)

- [ ] **Step 4: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "fix: remove !important from nav-cta and clean up dead CSS"
```

---

### Task 8: Meta Tags and Brand Assets

**Files:**
- Create: `favicon.svg`
- Modify: `anywise-v5-redesign.html:7-8` (add favicon and meta tags to `<head>`)

- [ ] **Step 1: Create SVG favicon**

Create `favicon.svg` in the project root:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path d="M16 2L3 28h6l2.5-5h9l2.5 5h6L16 2zm0 9l3.5 8h-7L16 11z" fill="#39a849"/>
</svg>
```

This is a simple "A" lettermark in brand green on transparent background. Readable at 16x16.

- [ ] **Step 2: Add favicon links and meta tags to `<head>`**

After the existing `<meta name="description">` tag (line ~7), add:
```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
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

- [ ] **Step 3: Visual check**

Open in browser. Verify:
- Favicon appears in browser tab (green "A" on transparent background)
- No console errors from the new meta tags

- [ ] **Step 4: Commit**

```bash
git add favicon.svg anywise-v5-redesign.html
git commit -m "feat: add favicon, Open Graph, and Twitter Card meta tags"
```

- [ ] **Step 5: Create OG image (manual step)**

The OG image (`og-image.png`, 1200x630) needs to be designed separately — this is a graphic asset, not code. Requirements:
- Background: `#0e110e`
- "anywise" wordmark centered, "wise" in `#39a849`
- Tagline below: "Ethical Technology and Services" in `#9a9d95`
- Subtle green accent line or glow
- Save as PNG at 1200x630

This can be created using Canva MCP, Figma, or any design tool. Place the file as `og-image.png` in the project root.

---

### Task 9: Final Verification

- [ ] **Step 1: Full page scroll test**

Open `anywise-v5-redesign.html` in browser. Scroll through the entire page and verify:
- General Sans renders across all non-monospace text
- Only hero "ethically engineered." and purpose "positive impact" use gradient text
- Values section: inline text rows, no cards
- Approach section: numbered list on the right, no cards
- Track record: horizontal stat row with dividers, no cards
- Each section has distinct hover behavior (no uniform lift+glow)
- Favicon visible in browser tab
- Globe still renders and zooms on scroll
- All scroll reveal animations still fire

- [ ] **Step 2: Mobile test (768px)**

Resize browser to 768px width. Verify:
- Values stack vertically (name above description, no dash)
- Track stats wrap to 2x2 grid
- Approach list stacks naturally
- Mobile nav still works
- No horizontal overflow

- [ ] **Step 3: Tablet test (1024px)**

Resize to 1024px. Verify:
- Track stats wrap to 2x2 grid
- Approach grid collapses to single column
- Product grid goes to 2 columns

- [ ] **Step 4: Reduced motion test**

Enable "Reduce motion" in OS accessibility settings. Verify:
- All animations disabled
- Page still renders correctly with no hidden content
- Counter numbers display final values immediately
