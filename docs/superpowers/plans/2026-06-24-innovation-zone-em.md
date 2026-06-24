# Innovation Zone (Emergency Services) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Emergency-Services-focused "Innovation Zone" — a teaser section on the homepage plus a dedicated `innovation.html` page — matching Anywise's existing dark brand, markup patterns, and scroll-reveal motion.

**Architecture:** The homepage (`index.html`) carries its own inline `<style>`, so the teaser section's CSS is added inline there. The standalone `innovation.html` page is cloned from `careers.html`, which uses the shared `shared.css` / `shared.js` (these already provide `.label`, `.reveal`, `.section-divider`, `.container`, `.btn*`, `.breadcrumb`, nav, footer, theme toggle, Engage modal, and the reveal IntersectionObserver). The page only needs a small page-specific `<style>` block for the capability rows. No new JS.

**Tech Stack:** Static HTML + CSS, vanilla JS (existing `shared.js` IntersectionObserver). No build step. Deployed via Cloudflare Pages.

---

## Conventions (verified against the codebase)

- **Reveal animation:** add class `reveal` (or `reveal-left` / `reveal-right` / `reveal-scale`); `shared.js` adds `.visible` on intersection. On `index.html` the same observer runs inline. Do NOT add a new observer.
- **Eyebrow label:** `<p class="label">TEXT</p>` — mono, uppercase, accent, animated leading rule.
- **Gradient/accent heading:** headings use `<h2>…<em>highlighted</em>…</h2>`; `em` renders in accent green (per `.team h2 em`).
- **Section divider:** `<div class="section-divider"></div>` precedes major sections.
- **Standalone-page nav convention (from `careers.html`):** nav items link to `index.html#anchor`; the current page's own link gets `class="active"`. Breadcrumb is `Home / <Page>`.
- **No new icon library** — Anywise does not load Tabler. Capability rows use a mono numeral label (`.cap-num` style: `01 — Sensing`), NOT icons.
- **Australian English**, minimal em-dashes (recent commits replaced them); use commas / "—"-free phrasing where natural.

---

## File Structure

- **Modify** `index.html`:
  - Inline `<style>`: add `.innovation` section CSS.
  - Markup: add `<li>` nav link; insert `#innovation` section between `#products` and the `.section-divider`+`#track`.
- **Create** `innovation.html` (clone of `careers.html`, gutted): EM detail page.
- **Modify** `sitemap.xml`: add `/innovation.html` URL.
- **Create** `assets/images/innovation/` (imagery; see Task 6 — handled separately via visual-generator skill).

---

### Task 1: Add the homepage Innovation section CSS (inline in index.html)

**Files:**
- Modify: `index.html` (inline `<style>`, insert after the `.products` block which ends near `index.html:1131`, before `.track {` at `index.html:1132`)

- [ ] **Step 1: Add the CSS block**

Insert immediately before the `.track {` rule (around `index.html:1132`):

```css
/* ── INNOVATION ── */
.innovation { padding: 7rem 0; }
.innovation-head { max-width: 36rem; margin-bottom: 3rem; }
.innovation-head h2 {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.12;
  letter-spacing: -0.03em;
  margin-bottom: 1.25rem;
}
.innovation-head h2 em { font-style: normal; color: var(--accent); }
.innovation-head p { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); }
.innovation-head p strong { color: var(--text-primary); font-weight: 500; }

.innovation-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 2rem;
  align-items: center;
}
.innovation-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: var(--transition);
}
.innovation-card:hover { background: var(--bg-card-hover); }
.innovation-card p.card-copy { font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1.25rem; }
.innovation-card p.card-copy strong { color: var(--text-primary); font-weight: 500; }
.innovation-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.innovation-pills span {
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  padding: 0.4rem 0.7rem;
  border-radius: 30px;
}
[data-theme="light"] .innovation-pills span { background: rgba(0,0,0,0.03); }

.innovation-media {
  aspect-ratio: 4 / 3;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.innovation-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

@media (max-width: 768px) {
  .innovation-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Verify CSS is well-formed**

Run: `node -e "const c=require('fs').readFileSync('index.html','utf8'); const o=(c.match(/{/g)||[]).length, x=(c.match(/}/g)||[]).length; console.log('braces',o,x, o===x?'OK':'MISMATCH')"`
Expected: `braces <n> <n> OK` (counts equal).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(innovation): add homepage Innovation section styles"
```

---

### Task 2: Add the homepage Innovation section markup + nav link

**Files:**
- Modify: `index.html` nav list (`index.html:1607` area) and section insertion point (after `#products` `</section>` at `index.html:1850`, before `<!-- TRACK RECORD -->` divider at `index.html:1852`)

- [ ] **Step 1: Add the nav link**

In the `.nav-links` list, insert after the Products & Services `<li>` (currently `index.html:1607`):

```html
      <li><a href="#innovation">Innovation</a></li>
```

Resulting order: Capabilities, Approach, Products & Services, **Innovation**, About, Insights, Careers, Engage Us, theme toggle.

- [ ] **Step 2: Insert the section markup**

Between the close of `#products` (`</section>` at `index.html:1850`) and the `<!-- ═══ TRACK RECORD ═══ -->` divider (`index.html:1852`), insert:

```html
<!-- ═══ INNOVATION ═══ -->
<div class="section-divider"></div>
<section class="innovation" id="innovation">
  <div class="container">
    <div class="innovation-head reveal">
      <p class="label">Innovation Zone</p>
      <h2>Where the next decade of <em>emergency response</em> is being built.</h2>
      <p>Emergency services don't need more data. They need the <strong>right call, in the moment, with the information already on hand.</strong> That's the problem we're innovating against.</p>
    </div>
    <div class="innovation-grid reveal">
      <div class="innovation-card">
        <p class="label">Emergency Services</p>
        <p class="card-copy">From the sensor to the command post: real-time detection, resilient communications, and human-in-the-loop decision tools, including our <strong>FIRE|AIDE</strong> products.</p>
        <div class="innovation-pills">
          <span>Sensing</span>
          <span>Communications</span>
          <span>AIDE tools</span>
        </div>
        <a href="innovation.html" class="btn btn-accent"><span>See how we're innovating &rarr;</span></a>
      </div>
      <div class="innovation-media">
        <img src="assets/images/innovation/em-homepage.jpg" alt="Emergency services field response and command post" loading="lazy" width="800" height="600">
      </div>
    </div>
  </div>
</section>
```

(Note: `.btn` / `.btn-accent` exist in `index.html`'s inline styles — verify with Step 3. If `index.html` uses a different button class, match the hero's `<a class="btn btn-accent">` at `index.html:1651`.)

- [ ] **Step 3: Verify button class exists in index.html**

Run: `grep -n "btn-accent" index.html | head -3`
Expected: at least one match (the hero CTA at ~`index.html:1651`), confirming `.btn-accent` is styled. If absent, change the CTA to use the same classes as `index.html:1650-1651`.

- [ ] **Step 4: Visual check (local)**

Run: `python3 -m http.server 8765 >/dev/null 2>&1 & sleep 1; curl -s http://localhost:8765/index.html | grep -c 'id="innovation"'; kill %1 2>/dev/null`
Expected: `1` (section present in served page).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(innovation): add homepage Innovation section and nav link"
```

---

### Task 3: Create innovation.html by cloning and gutting careers.html

**Files:**
- Create: `innovation.html` (from `careers.html`)

- [ ] **Step 1: Copy the file**

Run: `cp careers.html innovation.html`
Expected: `innovation.html` exists.

- [ ] **Step 2: Update the `<head>` metadata**

In `innovation.html`, replace the careers title/canonical/OG/twitter values:
- `<title>` → `Innovation | Anywise — Sovereign Technology for Defence &amp; Government`
- `<link rel="canonical" ...>` → `https://anywise.com.au/innovation.html`
- `og:title` / `twitter:title` → `Innovation | Anywise`
- `og:url` (if present) → `https://anywise.com.au/innovation.html`
- Any `og:description` / `meta description` → `How Anywise is innovating in emergency services: sensing, communications, planning, and human-in-the-loop decision augmentation including FIRE|AIDE.`

- [ ] **Step 3: Set the active nav link**

In the `.nav-links` list (around `careers.html:507-513`), remove `class="active"` from the Careers link and add an Innovation link marked active, matching the homepage order:

```html
      <li><a href="index.html#capabilities">Capabilities</a></li>
      <li><a href="index.html#approach">Approach</a></li>
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="innovation.html" class="active">Innovation</a></li>
      <li><a href="index.html#about">About</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="careers.html">Careers</a></li>
```

Also update the mobile-menu nav links block (the second nav near `careers.html:649-677`) to include `<a href="innovation.html">Innovation</a>` in the same position, and ensure the Careers entry there is not marked active.

- [ ] **Step 4: Verify file still loads shared assets**

Run: `grep -c 'shared.css\|shared.js' innovation.html`
Expected: `2` or more (page inherits shared styles + JS, including the reveal observer and Engage modal).

- [ ] **Step 5: Commit**

```bash
git add innovation.html
git commit -m "feat(innovation): scaffold innovation.html from careers template"
```

---

### Task 4: Build the innovation.html body content

**Files:**
- Modify: `innovation.html` (replace the careers hero + body content between `<main id="main-content">` and `<footer>`)

- [ ] **Step 1: Replace the hero/breadcrumb block**

Replace the careers `<section class="careers-hero">` block with:

```html
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb">
      <a href="index.html">Home</a>
      <span class="breadcrumb-sep">/</span>
      <span>Innovation</span>
    </div>
    <p class="label">Innovation Zone / Emergency Services</p>
    <h1>Augmenting the people who <em>respond</em>.</h1>
    <p class="page-hero-sub">Four capability threads, built to put the right decision in reach when conditions are worst and time matters most.</p>
  </div>
</section>
```

- [ ] **Step 2: Replace the careers body with the capability content**

Replace everything from the end of the hero to just before `<footer>` with:

```html
<section class="innovation-detail">
  <div class="container">
    <div class="innovation-hero-media reveal">
      <img src="assets/images/innovation/em-hero.jpg" alt="From sensor to command post: the emergency response decision chain" loading="lazy" width="1400" height="467">
    </div>

    <div class="capability-list reveal">
      <div class="capability-row">
        <p class="cap-num">01 — Sensing</p>
        <p>Real-time detection and reporting on assets, resources, and potential threats, feeding decision-making platforms with meaningful, trustworthy data.</p>
      </div>
      <div class="capability-row">
        <p class="cap-num">02 — Communications</p>
        <p>Critical data transfer in multi-bearer environments, ensuring field data reaches where it needs to go, even in hostile, disrupted conditions.</p>
      </div>
      <div class="capability-row">
        <p class="cap-num">03 — Planning &amp; Execution</p>
        <p>Turning a live, changing picture into coordinated response, sequencing effort against what is actually happening on the ground.</p>
      </div>
      <div class="capability-row">
        <p class="cap-num">04 — AIDE products <span class="cap-accent">(FIRE|AIDE)</span></p>
        <p>Purpose-built decision augmentation that keeps a human in the loop, helping decision-makers make the right call with the information on hand.</p>
      </div>
      <div class="capability-row">
        <p class="cap-num">05 — Decision-making tools</p>
        <p>Automating policy and process so sound, defensible decisions can be made faster, without surrendering judgement to the machine.</p>
      </div>
    </div>

    <div class="innovation-cta reveal">
      <a href="#" class="btn btn-accent" data-engage aria-haspopup="dialog"><span>Engage us &rarr;</span></a>
      <a href="index.html" class="btn btn-ghost">Back to home</a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify Engage modal hook is present**

Run: `grep -c 'data-engage' innovation.html`
Expected: `>= 2` (nav CTA + the new page CTA; modal handler is in `shared.js`).

- [ ] **Step 4: Commit**

```bash
git add innovation.html
git commit -m "feat(innovation): add EM capability content to innovation page"
```

---

### Task 5: Add innovation.html page-specific styles

**Files:**
- Modify: `innovation.html` (add a `<style>` block in `<head>`, after the `shared.css` link)

- [ ] **Step 1: Add the page `<style>` block**

After the `<link rel="stylesheet" href="shared.css">` line, add:

```html
<style>
  .page-hero { padding: 9rem 0 3rem; }
  .page-hero h1 {
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.08;
    letter-spacing: -0.03em;
    margin: 1rem 0;
  }
  .page-hero h1 em { font-style: normal; color: var(--accent); }
  .page-hero-sub { font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); max-width: 38rem; }

  .innovation-detail { padding: 1rem 0 7rem; }
  .innovation-hero-media {
    aspect-ratio: 21 / 7;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    margin-bottom: 3.5rem;
  }
  .innovation-hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .capability-list { max-width: 44rem; }
  .capability-row {
    display: grid;
    gap: 0.4rem;
    padding: 1.5rem 0;
    border-top: 1px solid var(--border);
    transition: padding-left var(--transition);
  }
  .capability-row:hover { padding-left: 0.6rem; }
  .cap-num {
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    margin: 0;
  }
  .cap-accent { color: var(--accent); }
  .capability-row p:last-child {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
  }

  .innovation-cta { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 3rem; }

  @media (max-width: 768px) {
    .page-hero { padding: 7rem 0 2rem; }
    .innovation-hero-media { aspect-ratio: 16 / 9; }
  }
</style>
```

- [ ] **Step 2: Verify braces balance in the style block**

Run: `node -e "const c=require('fs').readFileSync('innovation.html','utf8'); const o=(c.match(/{/g)||[]).length, x=(c.match(/}/g)||[]).length; console.log('braces',o,x, o===x?'OK':'MISMATCH')"`
Expected: `braces <n> <n> OK`.

- [ ] **Step 3: Local render check**

Run: `python3 -m http.server 8765 >/dev/null 2>&1 & sleep 1; curl -s http://localhost:8765/innovation.html | grep -c 'capability-row'; kill %1 2>/dev/null`
Expected: `5` (five capability rows present).

- [ ] **Step 4: Commit**

```bash
git add innovation.html
git commit -m "feat(innovation): add innovation page styles"
```

---

### Task 6: Generate and place imagery (visual-generator skill)

**Files:**
- Create: `assets/images/innovation/em-homepage.jpg` (4:3, ~800×600)
- Create: `assets/images/innovation/em-hero.jpg` (~21:7, ~1400×467)

- [ ] **Step 1: Create the image directory**

Run: `mkdir -p assets/images/innovation`

- [ ] **Step 2: Generate prompts via the anywise-visual-generator skill**

Invoke the `anthropic-skills:anywise-visual-generator` skill to produce Nano Banana (Gemini) prompts in the Anywise palette (Apple green #39a849, Lime #c3e01b, Mint #2d7f36) for:
- **em-homepage** (4:3): emergency-services field response into a command post; on-brand, dark, abstract-tech aesthetic consistent with existing site imagery.
- **em-hero** (wide 21:7 band): a sensor → communications → command decision chain; same brand language.

Generate the images, save to the paths above. (If the user prefers to supply final images later, leave the styled media containers — they already have a background and border, so they degrade gracefully with a broken/missing `img`; replace `src` when assets land.)

- [ ] **Step 3: Verify images referenced resolve**

Run: `for f in em-homepage.jpg em-hero.jpg; do test -f assets/images/innovation/$f && echo "$f OK" || echo "$f MISSING"; done`
Expected: both `OK` (or note as deferred if user opted to supply later).

- [ ] **Step 4: Commit**

```bash
git add assets/images/innovation/
git commit -m "feat(innovation): add emergency services imagery"
```

---

### Task 7: Add innovation.html to the sitemap

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: Inspect existing sitemap entry format**

Run: `grep -n "careers.html" sitemap.xml`
Expected: a `<url>…<loc>https://anywise.com.au/careers.html</loc>…</url>` block to mirror.

- [ ] **Step 2: Add the innovation URL**

Copy the careers `<url>` block and add an equivalent for `https://anywise.com.au/innovation.html` (use today's date `2026-06-24` for `<lastmod>`, and the same `<changefreq>`/`<priority>` as careers or other top-level pages).

- [ ] **Step 3: Verify XML is well-formed**

Run: `python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('sitemap.xml'); print('XML OK')"`
Expected: `XML OK`.

- [ ] **Step 4: Commit**

```bash
git add sitemap.xml
git commit -m "feat(innovation): add innovation page to sitemap"
```

---

### Task 8: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Serve and smoke-test both pages**

Run:
```bash
python3 -m http.server 8765 >/dev/null 2>&1 & sleep 1
echo "homepage section:"; curl -s http://localhost:8765/index.html | grep -c 'id="innovation"'
echo "homepage nav link:"; curl -s http://localhost:8765/index.html | grep -c 'href="#innovation"'
echo "page capability rows:"; curl -s http://localhost:8765/innovation.html | grep -c 'capability-row'
echo "page CTA link from homepage:"; curl -s http://localhost:8765/index.html | grep -c 'href="innovation.html"'
kill %1 2>/dev/null
```
Expected: `1`, `1`, `5`, `1`.

- [ ] **Step 2: Manual browser checklist** (use Playwright or browser)

Verify on `index.html` and `innovation.html`, in BOTH light and dark theme (toggle), at desktop AND mobile width:
- "Innovation" appears in the header nav; clicking it on the homepage smooth-scrolls to the section and scroll-spy highlights it.
- Homepage Innovation section reveal-animates on scroll; "See how we're innovating →" navigates to `innovation.html`.
- `innovation.html`: breadcrumb, five capability rows reveal on scroll, hover shifts rows right, "Engage us" opens the Engage modal, "Back to home" returns to `index.html`.
- Mobile menu lists "Innovation".
- `prefers-reduced-motion`: reveals do not animate (inherited global behaviour).
- No console errors; homepage globe/hero zoom/counters still work (section insertion didn't break them).

- [ ] **Step 3: Final review commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix(innovation): address verification findings"
```
(Skip if nothing needed fixing.)

---

## Self-Review Notes

- **Spec coverage:** Homepage teaser (Tasks 1–2) ✓; dedicated page with 5 EM capability blurbs (Tasks 3–5) ✓; nav link + scroll-spy (Task 2, relies on existing auto-discovery) ✓; placement after Products before Track (Task 2) ✓; imagery via visual-generator (Task 6) ✓; motion reuse (uses `.reveal` + existing observer, no new JS) ✓; sitemap (Task 7) ✓; light/dark + responsive + reduced-motion (Task 8) ✓; future multi-market extension left unblocked (single card in a grid that can grow) ✓.
- **Icons:** spec allowed icons OR mono-label fallback; codebase has no icon library, so the plan uses the `.cap-num` mono-label style. Resolved, not ambiguous.
- **Nav behaviour for standalone page:** resolved to the `careers.html` convention (`index.html#anchor` links + own link `active`).
- **CSS location:** resolved — homepage CSS inline in `index.html`; page CSS in a `<style>` block in `innovation.html` on top of inherited `shared.css`.
- **Type/class consistency:** class names (`innovation`, `innovation-head`, `innovation-grid`, `innovation-card`, `innovation-pills`, `innovation-media`, `page-hero`, `innovation-detail`, `innovation-hero-media`, `capability-list`, `capability-row`, `cap-num`, `cap-accent`, `innovation-cta`) are used identically in markup (Tasks 2/4) and CSS (Tasks 1/5).
