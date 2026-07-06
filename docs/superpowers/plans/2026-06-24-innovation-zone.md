# Innovation Zone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Innovation" area — an abridged homepage section (how Anywise innovates + a 4-innovation preview) plus a dedicated `innovation.html` page with a detailed, problem-first, public-safe section per innovation (SENTIA, SWIFT, Low-SWaP sensing & vision, Alternative communications) — matching Anywise's existing dark brand, markup patterns, and scroll-reveal motion.

**Architecture:** `index.html` carries its own inline `<style>`, so the homepage section CSS is added inline there. Standalone `innovation.html` is cloned from `careers.html`, which uses `shared.css` / `shared.js` (these already provide `.label`, `.reveal`, `.section-divider`, `.container`, `.btn*`, `.breadcrumb`, nav, footer, theme toggle, Engage modal, and the reveal IntersectionObserver). The page needs a page-specific `<style>` block for innovation-detail layout. No new JS.

**Tech Stack:** Static HTML + CSS, vanilla JS (existing `shared.js`). No build step. Cloudflare Pages.

**Content source of truth:** `docs/superpowers/specs/2026-06-24-innovation-zone-design.md`. All copy below is public-safe: NO named hardware/boards/sensors, NO named comms protocols (HaLow/LoRa/ESP-NOW/ESP-MESH).

---

## Conventions (verified against the codebase)

- **Reveal:** class `reveal` (+ `reveal-left/right/scale`); `shared.js` adds `.visible` on intersection; `index.html` runs the same observer inline. No new observer.
- **Eyebrow:** `<p class="label">TEXT</p>` — mono, uppercase, accent, animated leading rule.
- **Accent heading:** `<h2>…<em>x</em>…</h2>`; `em` = accent green (per `.team h2 em`).
- **Divider:** `<div class="section-divider"></div>` before major sections.
- **Standalone-page nav (careers.html):** items link `index.html#anchor`; own link `class="active"`; breadcrumb `Home / <Page>`.
- **No icon library** — use mono numeral/text labels, not icons.
- **Buttons:** `.btn .btn-accent` / `.btn .btn-ghost` (exist in `shared.css`; hero uses `.btn .btn-accent` in `index.html`).
- **Australian English**, minimal em-dashes.

---

## File Structure

- **Modify** `index.html`: inline `<style>` (add `.innovation*` rules); add nav `<li>`; insert `#innovation` section between `#products` and the `#track` divider.
- **Create** `innovation.html`: cloned/gutted from `careers.html`; four detailed innovation sections.
- **Modify** `sitemap.xml`: add `/innovation.html`.
- **Create** `assets/images/innovation/`: imagery via visual-generator skill.

---

### Task 1: Homepage Innovation section CSS (inline in index.html)

**Files:**
- Modify: `index.html` (inline `<style>`, insert immediately before the `.track {` rule at ~`index.html:1132`)

- [ ] **Step 1: Add the CSS block**

```css
/* ── INNOVATION ── */
.innovation { padding: 7rem 0; }
.innovation-head { max-width: 40rem; margin-bottom: 2.5rem; }
.innovation-head h2 {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 800; color: var(--text-primary);
  line-height: 1.12; letter-spacing: -0.03em; margin-bottom: 1.25rem;
}
.innovation-head h2 em { font-style: normal; color: var(--accent); }
.innovation-head p { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); }

.innovation-pathway { display: flex; align-items: stretch; gap: 0.75rem; margin: 2.5rem 0; }
.innovation-step { flex: 1; min-width: 0; }
.innovation-step .step-n { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.14em; color: var(--text-tertiary); }
.innovation-step .step-t { color: var(--text-primary); font-size: 0.95rem; font-weight: 500; margin: 0.4rem 0 0.2rem; }
.innovation-step .step-d { font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin: 0; }
.innovation-arrow { color: var(--accent-dim); font-size: 1.1rem; align-self: flex-start; margin-top: 1.4rem; }

.innovation-preview-label { font-family: var(--mono); font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-tertiary); margin: 2rem 0 1rem; }
.innovation-preview { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
.innovation-prev-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 1.1rem 1.2rem; transition: var(--transition);
}
.innovation-prev-card:hover { background: var(--bg-card-hover); transform: translateY(-3px); border-color: var(--border-accent); }
.innovation-prev-card h3 { color: var(--text-primary); font-size: 1rem; font-weight: 500; margin: 0 0 0.35rem; }
.innovation-prev-card p { font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin: 0; }

@media (max-width: 900px) { .innovation-preview { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .innovation-pathway { flex-direction: column; gap: 1rem; }
  .innovation-arrow { display: none; }
}
@media (max-width: 560px) { .innovation-preview { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Verify braces balance**

Run: `node -e "const c=require('fs').readFileSync('index.html','utf8'); const o=(c.match(/{/g)||[]).length, x=(c.match(/}/g)||[]).length; console.log('braces',o,x,o===x?'OK':'MISMATCH')"`
Expected: `braces <n> <n> OK`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(innovation): add homepage Innovation section styles"
```

---

### Task 2: Homepage Innovation section markup + nav link

**Files:**
- Modify: `index.html` nav list (after Products & Services `<li>` at ~`index.html:1607`); section insertion after `#products` `</section>` (~`index.html:1850`), before `<!-- TRACK RECORD -->` divider (~`index.html:1852`)

- [ ] **Step 1: Add nav link** (after the Products & Services `<li>`):

```html
      <li><a href="#innovation">Innovation</a></li>
```

- [ ] **Step 2: Insert the section markup**

```html
<!-- ═══ INNOVATION ═══ -->
<div class="section-divider"></div>
<section class="innovation" id="innovation">
  <div class="container">
    <div class="innovation-head reveal">
      <p class="label">Innovation</p>
      <h2>Innovation is what makes <em>Anywise, Anywise.</em></h2>
      <p>It's in how we work: take a hard, real-world problem, prove the concept, then harden it into something that holds up in the field. We build on sovereign IP and technology already proven, demonstrated, or under contract with the ADF.</p>
    </div>

    <div class="innovation-pathway reveal">
      <div class="innovation-step">
        <p class="step-n">01</p><p class="step-t">Proof of concept</p><p class="step-d">Prove the hard part works.</p>
      </div>
      <span class="innovation-arrow">&rarr;</span>
      <div class="innovation-step">
        <p class="step-n">02</p><p class="step-t">Validated</p><p class="step-d">Architecture and components stand up.</p>
      </div>
      <span class="innovation-arrow">&rarr;</span>
      <div class="innovation-step">
        <p class="step-n">03</p><p class="step-t">Fielded</p><p class="step-d">Hardened, trialled, in operators' hands.</p>
      </div>
    </div>

    <p class="innovation-preview-label reveal">Past proof of concept — four innovations</p>
    <div class="innovation-preview reveal">
      <div class="innovation-prev-card">
        <h3>SENTIA</h3>
        <p>The ecosystem our solutions live within. Sensor to commander.</p>
      </div>
      <div class="innovation-prev-card">
        <h3>SWIFT</h3>
        <p>Getting critical messages through when the network is denied.</p>
      </div>
      <div class="innovation-prev-card">
        <h3>Sensing &amp; vision</h3>
        <p>Small, abundant sensing where power and comms run out.</p>
      </div>
      <div class="innovation-prev-card">
        <h3>Alternative comms</h3>
        <p>Pushing data further through contested environments.</p>
      </div>
    </div>

    <div class="section-view-all reveal" style="margin-top:2.5rem;">
      <a href="innovation.html" class="btn btn-accent"><span>Explore our innovations &rarr;</span></a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify button class exists in index.html**

Run: `grep -c "btn-accent" index.html`
Expected: `>= 1` (hero CTA confirms `.btn-accent` styled). If 0, match the hero pattern at `index.html:1650-1651`.

- [ ] **Step 4: Local render check**

Run: `python3 -m http.server 8765 >/dev/null 2>&1 & sleep 1; curl -s http://localhost:8765/index.html | grep -c 'id="innovation"'; curl -s http://localhost:8765/index.html | grep -c 'innovation-prev-card'; kill %1 2>/dev/null`
Expected: `1` then `4`.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(innovation): add homepage Innovation section and nav link"
```

---

### Task 3: Scaffold innovation.html from careers.html

**Files:**
- Create: `innovation.html` (from `careers.html`)

- [ ] **Step 1: Copy**

Run: `cp careers.html innovation.html`

- [ ] **Step 2: Update `<head>` metadata**

- `<title>` → `Innovation | Anywise — Sovereign Technology for Defence &amp; Government`
- `<link rel="canonical">` → `https://anywise.com.au/innovation.html`
- `og:title` / `twitter:title` → `Innovation | Anywise`
- `og:url` (if present) → `https://anywise.com.au/innovation.html`
- description meta / `og:description` → `The innovations behind Anywise: SENTIA, SWIFT resilient comms, low-SWaP sensing and vision, and next-generation communications. Solving hard problems for defence, emergency services and government.`

- [ ] **Step 3: Set active nav link (both nav blocks)**

Primary nav (`.nav-links`, ~`careers.html:507-513`) — remove `active` from Careers, insert Innovation active, matching homepage order:

```html
      <li><a href="index.html#capabilities">Capabilities</a></li>
      <li><a href="index.html#approach">Approach</a></li>
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="innovation.html" class="active">Innovation</a></li>
      <li><a href="index.html#about">About</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="careers.html">Careers</a></li>
```

Also add `<a href="innovation.html">Innovation</a>` to the footer/mobile nav block (~`careers.html:658-677`) in the same relative position.

- [ ] **Step 4: Verify shared assets still referenced**

Run: `grep -c 'shared.css\|shared.js' innovation.html`
Expected: `>= 2`.

- [ ] **Step 5: Commit**

```bash
git add innovation.html
git commit -m "feat(innovation): scaffold innovation.html from careers template"
```

---

### Task 4: Innovations page body content

**Files:**
- Modify: `innovation.html` (replace careers hero + body between `<main id="main-content">` and `<footer>`)

- [ ] **Step 1: Replace hero/breadcrumb block**

```html
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb">
      <a href="index.html">Home</a>
      <span class="breadcrumb-sep">/</span>
      <span>Innovation</span>
    </div>
    <p class="label">Innovation</p>
    <h1>The problems we're <em>solving next.</em></h1>
    <p class="page-hero-sub">Each of these has passed proof of concept. Here's the problem it solves, and how far it has come.</p>
  </div>
</section>
```

- [ ] **Step 2: Insert the four detailed sections + CTA** (replace remaining careers body before `<footer>`)

```html
<section class="innovation-detail">
  <div class="container">

    <div class="innov-block reveal">
      <div class="innov-content">
        <h2 class="innov-name">SENTIA <span class="innov-badge badge-eco">The ecosystem</span></h2>
        <p class="innov-tag">Trustworthy decision advantage, sensor to commander</p>
        <p class="innov-desc">The volume and velocity of data now exceeds what people can process in time. SENTIA is the six-stage ecosystem our solutions live within: it turns fragmented data into trusted, AI-assisted outputs a practitioner can act on, with provenance tracked at every step.</p>
        <div class="innov-pipe">
          <span>Sense</span><em>&rsaquo;</em><span>Enrich</span><em>&rsaquo;</em><span>Nexus</span><em>&rsaquo;</em><span>Think</span><em>&rsaquo;</em><span>Inform</span><em>&rsaquo;</em><span>Assure</span>
        </div>
        <div class="innov-feat">
          <div class="feat-x"><b>Trusted autonomy</b><p>A human-oversight slider sets how much the system does. High-risk calls stay with people.</p></div>
          <div class="feat-x"><b>Built on proven work</b><p>Underpinned by Anywise systems already in use, demonstrated, or under contract with the ADF.</p></div>
        </div>
      </div>
      <div class="innov-media"><img src="assets/images/innovation/sentia.jpg" alt="The SENTIA ecosystem, from sensor to commander" loading="lazy" width="600" height="450"></div>
    </div>

    <div class="innov-block reveal">
      <div class="innov-content">
        <h2 class="innov-name">SWIFT <span class="innov-badge badge-val">TRL 3 &middot; advancing to TRL 4</span></h2>
        <p class="innov-tag">Getting the message through when the network is denied</p>
        <p class="innov-desc">Critical messages must arrive even when bearers are jammed, intercepted or degraded. SWIFT delivers disaggregated communications for defence, emergency services and low-bandwidth environments, splitting a message across multiple bearers at once so no single one carries the whole thing, and reassembling it at the far end.</p>
        <div class="innov-feat">
          <div class="feat-x"><b>No single point of failure</b><p>Split across bearers, not duplicated. Lose one, the message still completes.</p></div>
          <div class="feat-x"><b>Hard to intercept or jam</b><p>Short bursts, fragmented traffic, and adaptive rerouting before bearers fail.</p></div>
          <div class="feat-x"><b>Works on what you already have</b><p>Sits on existing tactical radios. No new hardware to field.</p></div>
          <div class="feat-x"><b>Part of SENTIA</b><p>Feeds assured, traceable delivery into the wider ecosystem.</p></div>
        </div>
      </div>
      <div class="innov-media"><img src="assets/images/innovation/swift.jpg" alt="SWIFT resilient multipath communications" loading="lazy" width="600" height="450"></div>
    </div>

    <div class="innov-block reveal">
      <div class="innov-content">
        <h2 class="innov-name">Low-SWaP sensing &amp; vision <span class="innov-badge badge-eco">TRL 5 &middot; fielded</span></h2>
        <p class="innov-tag">Eyes and ears where power and comms run out</p>
        <p class="innov-desc">Many environments that matter have no reliable power and no network, so they go unwatched. We field small, low-cost, abundant sensing suites that run in those power- and comms-denied conditions, collecting the sensing information that turns a blind spot into an intelligence-based decision. Configurations are tailored to the problem.</p>
        <div class="innov-usecase">
          <span>Vehicle detection &amp; classification — Defence</span>
          <span>Wildlife conservation &amp; animal detection — Aviation</span>
          <span>Event-of-significance detection — custom</span>
        </div>
      </div>
      <div class="innov-media"><img src="assets/images/innovation/sensing-vision.jpg" alt="Distributed low-power sensing in the field" loading="lazy" width="600" height="450"></div>
    </div>

    <div class="innov-block reveal">
      <div class="innov-content">
        <h2 class="innov-name">Alternative communications <span class="innov-badge badge-rd">R&amp;D capability</span></h2>
        <p class="innov-tag">Pushing data further through contested environments</p>
        <p class="innov-desc">When it matters most, data still has to get where it needs to go. We're pushing traditional communications past their limits in contested, high-stakes environments, using all of the available spectrum. Our prototypes combine every available transmission method with self-healing mesh networks to penetrate obstacles and keep information moving when conventional networks fail.</p>
        <div class="innov-feat">
          <div class="feat-x"><b>Uses all available spectrum</b><p>Not tied to one bearer or band. Whatever gets the data through.</p></div>
          <div class="feat-x"><b>Self-healing mesh</b><p>Reroutes around lost nodes. No single point of failure.</p></div>
        </div>
      </div>
      <div class="innov-media"><img src="assets/images/innovation/alt-comms.jpg" alt="Self-healing mesh communications" loading="lazy" width="600" height="450"></div>
    </div>

    <div class="innov-cta reveal">
      <a href="#" class="btn btn-accent" data-engage aria-haspopup="dialog"><span>Engage us &rarr;</span></a>
      <a href="index.html" class="btn btn-ghost">Back to home</a>
    </div>

  </div>
</section>
```

- [ ] **Step 3: Verify Engage hook + no named tech present**

Run:
```bash
grep -c 'data-engage' innovation.html
grep -ci 'halow\|lora\|esp-now\|espnow\|esp-mesh\|esp32\|microcontroller' innovation.html
```
Expected: first `>= 2`; second `0` (no named hardware/protocols).

- [ ] **Step 4: Commit**

```bash
git add innovation.html
git commit -m "feat(innovation): add four detailed innovation sections"
```

---

### Task 5: Innovations page styles

**Files:**
- Modify: `innovation.html` (`<style>` block in `<head>`, after the `shared.css` link)

- [ ] **Step 1: Add the `<style>` block**

```html
<style>
  .page-hero { padding: 9rem 0 3rem; }
  .page-hero h1 { font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 800; color: var(--text-primary); line-height: 1.08; letter-spacing: -0.03em; margin: 1rem 0; }
  .page-hero h1 em { font-style: normal; color: var(--accent); }
  .page-hero-sub { font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); max-width: 40rem; }

  .innovation-detail { padding: 1rem 0 7rem; }
  .innov-block {
    display: grid; grid-template-columns: 1fr 0.72fr; gap: 2.5rem; align-items: start;
    border-top: 1px solid var(--border); padding: 3rem 0;
  }
  .innov-name { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin: 0 0 0.4rem; line-height: 1.2; }
  .innov-tag { font-family: var(--mono); font-size: 0.8rem; letter-spacing: 0.04em; color: var(--accent); margin: 0 0 1rem; }
  .innov-desc { font-size: 0.98rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 1.25rem; }

  .innov-badge { display: inline-block; font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.3rem 0.65rem; border-radius: 30px; vertical-align: middle; margin-left: 0.5rem; font-weight: 500; }
  .badge-eco { background: rgba(57,168,73,0.14); color: #7bd189; border: 1px solid rgba(57,168,73,0.35); }
  .badge-val { background: rgba(195,224,27,0.10); color: var(--lime); border: 1px solid rgba(195,224,27,0.30); }
  .badge-rd { background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid var(--border); }
  [data-theme="light"] .badge-eco { color: var(--accent); }
  [data-theme="light"] .badge-val { color: var(--mint); background: rgba(45,127,54,0.10); border-color: rgba(45,127,54,0.30); }

  .innov-pipe { display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; margin: 0 0 1.25rem; }
  .innov-pipe span { font-family: var(--mono); font-size: 0.72rem; font-weight: 500; color: #06210b; background: var(--accent); padding: 0.5rem 0.7rem; border-radius: 6px; }
  .innov-pipe em { font-style: normal; color: var(--accent-dim); }

  .innov-feat { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .feat-x { border-left: 2px solid var(--border-accent); padding: 0.2rem 0 0.2rem 0.9rem; }
  .feat-x b { display: block; color: var(--text-primary); font-weight: 500; font-size: 0.9rem; margin-bottom: 0.25rem; }
  .feat-x p { font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin: 0; }

  .innov-usecase { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .innov-usecase span { font-size: 0.82rem; color: var(--text-secondary); background: rgba(255,255,255,0.04); border: 1px solid var(--border); padding: 0.45rem 0.8rem; border-radius: 30px; }
  [data-theme="light"] .innov-usecase span { background: rgba(0,0,0,0.03); }

  .innov-media { aspect-ratio: 4/3; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  .innov-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .innov-cta { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 3rem; }

  @media (max-width: 860px) {
    .innov-block { grid-template-columns: 1fr; gap: 1.5rem; }
    .innov-media { order: -1; aspect-ratio: 16/9; }
    .innov-feat { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) { .page-hero { padding: 7rem 0 2rem; } }
</style>
```

- [ ] **Step 2: Verify braces balance**

Run: `node -e "const c=require('fs').readFileSync('innovation.html','utf8'); const o=(c.match(/{/g)||[]).length, x=(c.match(/}/g)||[]).length; console.log('braces',o,x,o===x?'OK':'MISMATCH')"`
Expected: `braces <n> <n> OK`.

- [ ] **Step 3: Local render check**

Run: `python3 -m http.server 8765 >/dev/null 2>&1 & sleep 1; curl -s http://localhost:8765/innovation.html | grep -c 'innov-block'; kill %1 2>/dev/null`
Expected: `4`.

- [ ] **Step 4: Commit**

```bash
git add innovation.html
git commit -m "feat(innovation): add innovations page styles"
```

---

### Task 6: Generate and place imagery (visual-generator skill)

**Files:**
- Create: `assets/images/innovation/{sentia,swift,sensing-vision,alt-comms}.jpg`

- [ ] **Step 1: Make the directory**

Run: `mkdir -p assets/images/innovation`

- [ ] **Step 2: Generate via anthropic-skills:anywise-visual-generator**

Invoke the skill to produce Nano Banana (Gemini) prompts in the Anywise palette (Apple green #39a849, Lime #c3e01b, Mint #2d7f36), abstract and public-safe (NO identifiable hardware/equipment):
- `sentia.jpg` — abstract sensor→commander ecosystem / six-stage pipeline.
- `swift.jpg` — abstract disaggregated/multipath message across multiple paths.
- `sensing-vision.jpg` — abstract distributed small-sensor field / edge sensing (no identifiable devices).
- `alt-comms.jpg` — abstract self-healing mesh / spectrum motif.

Save to the paths above (4:3, ~600×450 or larger). Chris will swap in real photography later; styled containers degrade gracefully if an image is missing.

- [ ] **Step 3: Verify**

Run: `for f in sentia swift sensing-vision alt-comms; do test -f assets/images/innovation/$f.jpg && echo "$f OK" || echo "$f MISSING"; done`
Expected: four `OK` (or note deferred if Chris supplies later).

- [ ] **Step 4: Commit**

```bash
git add assets/images/innovation/
git commit -m "feat(innovation): add innovation imagery"
```

---

### Task 7: Add innovation.html to sitemap

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: Inspect format**

Run: `grep -n "careers.html" sitemap.xml`
Expected: a `<url>…<loc>…/careers.html</loc>…</url>` block to mirror.

- [ ] **Step 2: Add the URL** — copy the careers `<url>` block for `https://anywise.com.au/innovation.html`, `<lastmod>2026-06-24</lastmod>`, same changefreq/priority as careers.

- [ ] **Step 3: Validate XML**

Run: `python3 -c "import xml.dom.minidom; xml.dom.minidom.parse('sitemap.xml'); print('XML OK')"`
Expected: `XML OK`.

- [ ] **Step 4: Commit**

```bash
git add sitemap.xml
git commit -m "feat(innovation): add innovation page to sitemap"
```

---

### Task 8: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Smoke test both pages**

Run:
```bash
python3 -m http.server 8765 >/dev/null 2>&1 & sleep 1
echo "homepage section:"; curl -s http://localhost:8765/index.html | grep -c 'id="innovation"'
echo "homepage nav link:"; curl -s http://localhost:8765/index.html | grep -c 'href="#innovation"'
echo "preview cards:"; curl -s http://localhost:8765/index.html | grep -c 'innovation-prev-card'
echo "cta to page:"; curl -s http://localhost:8765/index.html | grep -c 'href="innovation.html"'
echo "detail blocks:"; curl -s http://localhost:8765/innovation.html | grep -c 'innov-block'
echo "no named tech (expect 0):"; curl -s http://localhost:8765/innovation.html | grep -ci 'halow\|lora\|esp-now\|espnow\|esp-mesh\|esp32\|microcontroller'
kill %1 2>/dev/null
```
Expected: `1`, `1`, `4`, `1`, `4`, `0`.

- [ ] **Step 2: Manual browser checklist** (Playwright or browser), both themes, desktop + mobile:
- "Innovation" in header nav; homepage click smooth-scrolls to `#innovation`; scroll-spy highlights it.
- Homepage section reveals on scroll; pathway readable; preview cards hover-lift; "Explore our innovations →" → `innovation.html`.
- `innovation.html`: breadcrumb, four blocks reveal on scroll, badges correct (eco/val/rd colours), SENTIA pipeline chips wrap cleanly, use-case tags on sensing block, "Engage us" opens modal, "Back to home" works.
- Mobile: pathway stacks (arrows hidden), preview → 1 col, `.innov-block` stacks with image on top, feature grid → 1 col.
- `prefers-reduced-motion`: reveals static.
- No console errors; homepage globe/hero/counters unaffected.

- [ ] **Step 3: Final fix commit (if needed)**

```bash
git add -A
git commit -m "fix(innovation): address verification findings"
```

---

## Self-Review Notes

- **Spec coverage:** homepage narrative + pathway + 4-preview + CTA (Tasks 1–2) ✓; detailed page with four problem-first sections and correct maturity badges (Tasks 3–5) ✓; SENTIA "The ecosystem"/no-TRL, SWIFT TRL 3→4, Sensing TRL 5 fielded, Alt comms R&D ✓; public-safe / no named hardware or protocols (enforced by grep in Tasks 4 & 8) ✓; nav link + scroll-spy (Task 2) ✓; placement after Products before Track (Task 2) ✓; imagery via visual-generator, public-safe (Task 6) ✓; motion reuse, no new JS (uses `.reveal`) ✓; sitemap (Task 7) ✓; light/dark + responsive + reduced-motion (Task 8) ✓.
- **Placeholder scan:** all code blocks complete; no TBD/TODO.
- **Class consistency:** homepage (`innovation`, `innovation-head`, `innovation-pathway`, `innovation-step`, `step-n/t/d`, `innovation-arrow`, `innovation-preview-label`, `innovation-preview`, `innovation-prev-card`) and page (`page-hero`, `innovation-detail`, `innov-block`, `innov-content`, `innov-name`, `innov-tag`, `innov-desc`, `innov-badge`, `badge-eco/val/rd`, `innov-pipe`, `innov-feat`, `feat-x`, `innov-usecase`, `innov-media`, `innov-cta`) are used identically in markup (Tasks 2/4) and CSS (Tasks 1/5).
- **Note:** `.innov-media img` uses images from Task 6; if imagery is deferred, the `img` renders empty inside a styled container (bg + border) — acceptable degradation.
