# Innovation Zone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Innovation" area — an abridged, outward-facing homepage section (how Anywise takes on hard problems + a 4-innovation preview, fielded-first) plus a dedicated `innovation.html` page with a detailed, problem-first, public-safe section per innovation (Sensing & vision, SENTIA, SWIFT, Assured Connectivity) — matching Anywise's existing dark brand, markup patterns, and scroll-reveal motion.

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
      <h2>Sovereign capability that <em>holds up where it's needed most.</em></h2>
      <p>We take the problems others treat as too hard — denied networks, no power, data no one can act on in time — and engineer them into working, sovereign capability. Melbourne-based, with Australian RD&amp;I in house and Agile speed to delivery. Some is fielded today. Some is close behind.</p>
    </div>

    <div class="innovation-pathway reveal">
      <div class="innovation-step">
        <p class="step-n">01</p><p class="step-t">Prove the hard part</p><p class="step-d">Solve what others can't.</p>
      </div>
      <span class="innovation-arrow">&rarr;</span>
      <div class="innovation-step">
        <p class="step-n">02</p><p class="step-t">Validate</p><p class="step-d">Stand it up against the real environment.</p>
      </div>
      <span class="innovation-arrow">&rarr;</span>
      <div class="innovation-step">
        <p class="step-n">03</p><p class="step-t">Field it</p><p class="step-d">Hardened, trialled, in operators' hands.</p>
      </div>
    </div>

    <p class="innovation-preview-label reveal">What we've built</p>
    <div class="innovation-preview reveal">
      <div class="innovation-prev-card">
        <h3>Sensing &amp; vision</h3>
        <p>Fielded eyes and ears where power and comms run out.</p>
      </div>
      <div class="innovation-prev-card">
        <h3>SENTIA</h3>
        <p>The ecosystem that turns sensor data into a decision.</p>
      </div>
      <div class="innovation-prev-card">
        <h3>SWIFT</h3>
        <p>Getting the message through when the network is denied.</p>
      </div>
      <div class="innovation-prev-card">
        <h3>Assured Connectivity</h3>
        <p>Data that reaches where nothing else can.</p>
      </div>
    </div>

    <div class="section-view-all reveal" style="margin-top:2.5rem;">
      <a href="innovation.html" class="btn btn-accent"><span>See what we've built &rarr;</span></a>
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
    <h1>Hard problems, <em>engineered into capability.</em></h1>
    <p class="page-hero-sub">From fielded systems to active research, here's what we've built, what it does for the people who use it, and how far it's come.</p>
  </div>
</section>
```

- [ ] **Step 2: Insert the four detailed sections + CTA** (replace remaining careers body before `<footer>`)

```html
<section class="innovation-detail">
  <div class="container">

    <div class="innov-block reveal">
      <div class="innov-content">
        <h2 class="innov-name">Sensing &amp; vision <span class="innov-badge badge-eco">Fielded &middot; TRL 5</span></h2>
        <p class="innov-tag">Eyes and ears where power and comms run out</p>
        <p class="innov-desc">The places that matter most are often the ones you can't watch: no power, no network, no easy access. We field small, low-cost sensors you can deploy in numbers and leave in place, turning those blind spots into a live picture you can act on. Each configuration is built around the problem, not the other way round.</p>
        <div class="innov-usecase">
          <span>Vehicle detection &amp; classification — Defence</span>
          <span>Wildlife &amp; animal detection — Aviation</span>
          <span>Events of significance — custom</span>
        </div>
        <p class="innov-for"><b>For:</b> anyone who needs to know what's happening somewhere they can't reach, power, or connect.</p>
      </div>
      <div class="innov-media"><img src="assets/images/innovation/sensing-vision.jpg" alt="Distributed low-power sensing in the field" loading="lazy" width="600" height="450"></div>
    </div>

    <div class="innov-block reveal">
      <div class="innov-content">
        <h2 class="innov-name">SENTIA <span class="innov-badge badge-eco">The ecosystem</span></h2>
        <p class="innov-tag">From sensor to commander, with the reasoning shown</p>
        <p class="innov-desc">There is more data reaching decision-makers than any person can weigh in the time they have. SENTIA is the ecosystem our systems plug into: it senses, links and interprets that data, then hands the decision-maker a clear recommendation, and shows the reasoning and the sources behind it, so they can trust it or overrule it.</p>
        <div class="innov-pipe">
          <span>Sense</span><em>&rsaquo;</em><span>Enrich</span><em>&rsaquo;</em><span>Nexus</span><em>&rsaquo;</em><span>Think</span><em>&rsaquo;</em><span>Inform</span><em>&rsaquo;</em><span>Assure</span>
        </div>
        <div class="innov-feat">
          <div class="feat-x"><b>You set the level of automation</b><p>From advisory to hands-on. High-stakes calls always stay with a person.</p></div>
          <div class="feat-x"><b>Built on proven systems</b><p>Underpinned by Anywise capability in use, demonstrated, or under contract with the ADF.</p></div>
        </div>
        <p class="innov-for"><b>For:</b> commanders and practitioners who have to make a defensible call, fast, and stand behind it.</p>
      </div>
      <div class="innov-media"><img src="assets/images/innovation/sentia.jpg" alt="The SENTIA ecosystem, from sensor to commander" loading="lazy" width="600" height="450"></div>
    </div>

    <div class="innov-block reveal">
      <div class="innov-content">
        <h2 class="innov-name">SWIFT <span class="innov-badge badge-val">Validated &middot; TRL 3, advancing to 4</span></h2>
        <p class="innov-tag">Getting the message through when the network is denied</p>
        <p class="innov-desc">When bearers are jammed, intercepted or degraded, the message still has to arrive. SWIFT splits each message across several bearers at once, so no single one carries the whole thing, and reassembles it at the far end. Lose a bearer and the message still completes. Intercept one and an adversary gets a meaningless fragment. And it runs on the radios you already operate.</p>
        <div class="innov-feat">
          <div class="feat-x"><b>No single point of failure</b><p>Split across bearers, not duplicated. Lose one, it still gets through.</p></div>
          <div class="feat-x"><b>Hard to intercept or jam</b><p>Short bursts, fragmented traffic, reroutes before a bearer fails.</p></div>
          <div class="feat-x"><b>No new hardware</b><p>Sits on your existing tactical radios.</p></div>
          <div class="feat-x"><b>Part of SENTIA</b><p>Delivery you can prove: did it arrive, and intact?</p></div>
        </div>
        <p class="innov-for"><b>For:</b> defence and emergency teams who can't assume the network will be there.</p>
      </div>
      <div class="innov-media"><img src="assets/images/innovation/swift.jpg" alt="SWIFT resilient communications" loading="lazy" width="600" height="450"></div>
    </div>

    <div class="innov-block reveal">
      <div class="innov-content">
        <h2 class="innov-name">Assured Connectivity <span class="innov-badge badge-rd">Active R&amp;D</span></h2>
        <p class="innov-tag">Data that reaches where nothing else can</p>
        <p class="innov-desc">Some environments defeat conventional communications entirely — too contested, too remote, too much in the way. We're engineering prototypes that use every available slice of spectrum and heal their own networks around lost nodes, pushing data through obstacles and keeping it moving when everything else drops out. This is where we're pushing the edge next.</p>
        <div class="innov-feat">
          <div class="feat-x"><b>Uses all available spectrum</b><p>Not tied to one bearer or band. Whatever gets the data through.</p></div>
          <div class="feat-x"><b>Self-healing networks</b><p>Reroute around lost nodes automatically. No single point of failure.</p></div>
        </div>
        <p class="innov-for"><b>For:</b> operations in places where "no signal" isn't an acceptable answer.</p>
      </div>
      <div class="innov-media"><img src="assets/images/innovation/alt-comms.jpg" alt="Self-healing mesh communications" loading="lazy" width="600" height="450"></div>
    </div>

    <div class="innov-cta reveal">
      <p class="innov-cta-line">Have a problem that looks too hard? That's usually where we start.</p>
      <div class="innov-cta-btns">
        <a href="#" class="btn btn-accent" data-engage aria-haspopup="dialog"><span>Bring us your problem &rarr;</span></a>
        <a href="index.html" class="btn btn-ghost">Back to home</a>
      </div>
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

  .innov-usecase { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem; }
  .innov-usecase span { font-size: 0.82rem; color: var(--text-secondary); background: rgba(255,255,255,0.04); border: 1px solid var(--border); padding: 0.45rem 0.8rem; border-radius: 30px; }
  [data-theme="light"] .innov-usecase span { background: rgba(0,0,0,0.03); }

  .innov-for { font-size: 0.85rem; line-height: 1.5; color: var(--accent); margin: 1rem 0 0; }
  .innov-for b { color: var(--text-secondary); font-weight: 400; }
  [data-theme="light"] .innov-for { color: var(--mint); }

  .innov-media { aspect-ratio: 4/3; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  .innov-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .innov-cta { border-top: 1px solid var(--border); padding-top: 2rem; margin-top: 0.5rem; }
  .innov-cta-line { font-size: 1.05rem; color: var(--text-primary); margin: 0 0 1.25rem; max-width: 34rem; }
  .innov-cta-btns { display: flex; flex-wrap: wrap; gap: 1rem; }

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

- [ ] **Step 2a: Place the real SWIFT logo (supplied by Chris)**

SWIFT uses the REAL supplied logo (low-poly blue/white bird on dark), NOT a generated image. Chris will drop the file at `assets/images/innovation/swift.jpg` (or `.png` — update the `<img src>` in Task 4 to match the extension). Treatment decision: because the other three tiles are conceptual/photographic while this is a product logo on dark, either (a) present the logo centred on a branded tile (dark bg, subtle accent border — matches `.innov-media` bg) or (b) build a SWIFT capability visual with the logo as a small lockup. Default to (a) — the `.innov-media` container already has a dark bg + border, and `object-fit: cover` should become `object-fit: contain` with padding for a logo. Add to Task 5 CSS if chosen: `.innov-block:nth-of-type(3) .innov-media img { object-fit: contain; padding: 2.5rem; }` (SWIFT is the 3rd block).

- [ ] **Step 2b: Generate the other three via anthropic-skills:anywise-visual-generator**

Invoke the skill to produce Nano Banana (Gemini) prompts in the Anywise palette (Apple green #39a849, Lime #c3e01b, Mint #2d7f36), abstract and public-safe (NO identifiable hardware/equipment):
- `sensing-vision.jpg` — abstract distributed small-sensor field / edge sensing (no identifiable devices).
- `sentia.jpg` — abstract sensor→commander ecosystem / six-stage pipeline.
- `alt-comms.jpg` — abstract self-healing mesh / spectrum motif (Assured Connectivity).

Save to the paths above (4:3, ~600×450 or larger). Chris will swap in real photography later; styled containers degrade gracefully if an image is missing.

- [ ] **Step 3: Verify**

Run: `for f in sensing-vision sentia swift alt-comms; do test -f assets/images/innovation/$f.jpg -o -f assets/images/innovation/$f.png && echo "$f OK" || echo "$f MISSING"; done`
Expected: four `OK` (or note deferred if Chris supplies later; SWIFT depends on Chris's file).

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
- Homepage section reveals on scroll; pathway readable; preview cards hover-lift (fielded-first order); "See what we've built →" → `innovation.html`.
- `innovation.html`: breadcrumb, four blocks reveal in fielded-first order (Sensing → SENTIA → SWIFT → Assured Connectivity), badges correct (eco/val/rd colours), SENTIA pipeline chips wrap cleanly, use-case tags + "For:" line on sensing block, every block has a "For:" line, closing CTA line shows, "Bring us your problem" opens Engage modal, "Back to home" works.
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
- **Class consistency:** homepage (`innovation`, `innovation-head`, `innovation-pathway`, `innovation-step`, `step-n/t/d`, `innovation-arrow`, `innovation-preview-label`, `innovation-preview`, `innovation-prev-card`) and page (`page-hero`, `innovation-detail`, `innov-block`, `innov-content`, `innov-name`, `innov-tag`, `innov-desc`, `innov-badge`, `badge-eco/val/rd`, `innov-pipe`, `innov-feat`, `feat-x`, `innov-usecase`, `innov-for`, `innov-media`, `innov-cta`, `innov-cta-line`, `innov-cta-btns`) are used identically in markup (Tasks 2/4) and CSS (Tasks 1/5).
- **Copy source of truth:** all copy matches the v4 customer-lens rewrite in the spec — outward headline, fielded-first order (Sensing → SENTIA → SWIFT → Assured Connectivity), "For:" lines, "Bring us your problem" CTA, sovereignty framed as Melbourne-based / in-house Australian RD&I / Agile speed. SENTIA's "second brain" line removed. "Alternative communications" renamed "Assured Connectivity".
- **Note:** `.innov-media img` uses images from Task 6; if imagery is deferred, the `img` renders empty inside a styled container (bg + border) — acceptable degradation.
