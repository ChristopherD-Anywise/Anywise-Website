# Innovation Zone — Design Spec

**Date:** 2026-06-24
**Status:** Approved (direction locked via v3 mockup)
**Author:** Chris Dennis / Claude
**Supersedes:** 2026-06-24-innovation-zone-em-design.md (EM-only concept)

## Summary

Add an "Innovation" area to the Anywise website with two parts:

1. **Homepage section** (`#innovation` on `index.html`) — an abridged section that conveys *how Anywise innovates* (innovation is core to who we are: take a hard real-world problem → prove concept → harden into the field, built on sovereign IP and proven ADF technology), a three-step maturity pathway, a compact preview of the four innovations, and a link to the full page.
2. **Dedicated Innovations page** (`/innovation.html`) — a detailed, full-width section per innovation, each framed problem-first, with a maturity badge and a visual.

A nav link ("Innovation") is added to the header. The build reuses existing site patterns (markup, CSS variables, `.reveal` scroll animation, `.btn` classes, footer, Engage modal) so it is native to the site.

## The four innovations (all past proof of concept)

Content is framed **problem-first** ("what does this solve for the customer"), and is **public-safe**: no classified detail, no named hardware/boards/sensors, no named comms protocols.

### 1. SENTIA — the ecosystem
- **Badge:** "The ecosystem" (no TRL — SENTIA is not a single maturity level; it is the ecosystem that holds the underlying products/solutions).
- **Tagline:** Trustworthy decision advantage, sensor to commander.
- **Problem/solution:** The volume and velocity of data now exceeds what people can process in time. SENTIA is the six-stage ecosystem our solutions live within: it turns fragmented data into trusted, AI-assisted outputs a practitioner can act on, with provenance tracked at every step.
- **Pipeline chips:** Sense › Enrich › Nexus › Think › Inform › Assure.
- **Feature points:** Trusted autonomy (human-oversight slider; high-risk calls stay with people); Built on proven work (underpinned by Anywise systems already in use, demonstrated, or under contract with the ADF).

### 2. SWIFT — resilient comms
- **Badge:** "TRL 3 · advancing to TRL 4".
- **Tagline:** Getting the message through when the network is denied.
- **Problem/solution:** Critical messages must arrive even when bearers are jammed, intercepted or degraded. SWIFT delivers disaggregated communications for defence, emergency services and low-bandwidth environments — splitting a message across multiple bearers at once so no single one carries the whole thing, and reassembling at the far end.
- **Feature points:** No single point of failure (split not duplicated); Hard to intercept or jam (short bursts, fragmented traffic, adaptive rerouting); Works on what you already have (sits on existing tactical radios); Part of SENTIA (feeds assured, traceable delivery).

### 3. Low-SWaP sensing & vision — fielded
- **Badge:** "TRL 5 · fielded".
- **Tagline:** Eyes and ears where power and comms run out.
- **Problem/solution:** Many environments that matter have no reliable power and no network, so they go unwatched. We field small, low-cost, abundant sensing suites that run in those power- and comms-denied conditions, collecting the sensing information that turns a blind spot into an intelligence-based decision. Configurations are tailored to the problem.
- **Use-case tags:** Vehicle detection & classification — Defence; Wildlife conservation & animal detection — Aviation; Event-of-significance detection — custom.
- **Constraint:** NO named boards/microcontrollers/sensor types in copy. Value-and-outcome framing only.

### 4. Alternative communications — R&D
- **Badge:** "R&D capability".
- **Tagline:** Pushing data further through contested environments.
- **Problem/solution:** When it matters most, data still has to get where it needs to go. We're pushing traditional communications past their limits in contested, high-stakes environments, using all of the available spectrum. Our prototypes combine every available transmission method with self-healing mesh networks to penetrate obstacles and keep information moving when conventional networks fail.
- **Feature points:** Uses all available spectrum (not tied to one bearer/band); Self-healing mesh (reroutes around lost nodes, no single point of failure).
- **Constraint:** NO named protocols/products (HaLow WiFi, LoRa, ESP-NOW, ESP-MESH) anywhere on the page.

## Goals

- Position innovation as central to the Anywise identity.
- Show a credible, honest maturity story (PoC → validated → fielded), with accurate per-innovation maturity.
- Frame every innovation by the customer problem it solves.
- Provide a clean path: homepage teaser → full Innovations page → Engage Us.
- Match the established Anywise visual language and motion exactly.

## Non-goals (YAGNI)

- No per-innovation detail pages (single Innovations page for now).
- No tabs, accordions, or carousels.
- No new JavaScript libraries — reuse existing `.reveal` IntersectionObserver and scroll-spy.
- No CMS / data-driven content; static HTML.
- No classified detail, no named hardware, no named comms protocols.

## Placement & Navigation

- **Homepage section** inserted **after Products & Services (`#products`), before Track Record (`#track`)**, preceded by the existing `<div class="section-divider"></div>`.
- **Nav link** in `index.html` `.nav-links` between "Products & Services" and "About": `<li><a href="#innovation">Innovation</a></li>`.
- Scroll-spy auto-discovers sections by `id`; no JS change for the active-link highlight.
- Standalone `innovation.html` follows the `careers.html` convention: nav items link to `index.html#anchor`; its own "Innovation" link is `class="active"`; breadcrumb `Home / Innovation`.

## Homepage section — structure

Reuses section-header pattern (`.label` + `<h2>` with `<em>` accent + intro `<p>`).

```
label:   "Innovation"
h2:      "Innovation is what makes <em>Anywise, Anywise.</em>"
intro:   "It's in how we work: take a hard, real-world problem, prove the concept,
          then harden it into something that holds up in the field. We build on
          sovereign IP and technology already proven, demonstrated, or under
          contract with the ADF."

[ pathway strip:  01 Proof of concept → 02 Validated → 03 Fielded ]

label:   "Past proof of concept — 4 innovations"
[ 4-up preview grid: SENTIA | SWIFT | Sensing & vision | Alt comms ]
  each: name + one-line problem framing

[ btn-accent ]  "Explore our innovations →"  → innovation.html
```

- Pathway strip: three steps with mono numerals + arrows, stacks on mobile.
- Preview grid: 4 columns desktop → 2 → 1 on mobile; cards hover-lift (matching existing card hover).
- `.reveal` with staggered `transition-delay` on the header, pathway, label, grid, and CTA.

## Innovations page — structure

New `innovation.html`, cloned from `careers.html` (inherits `<head>`, nav, footer, `shared.css`/`shared.js`, theme toggle, Engage modal).

```
breadcrumb: Home / Innovation
label:   "Innovation"
h1:      "The problems we're <em>solving next.</em>"
sub:     "Each of these has passed proof of concept. Here's the problem it solves,
          and how far it has come."

[ detailed section per innovation — full width, hairline divider between ]
  For each: 2-col grid (content left, visual right, stacks on mobile)
    h3: name + maturity badge
    tagline (mono, accent)
    problem/solution paragraph
    (SENTIA) pipeline chips
    feature points (2-col .feat) OR use-case tags
    image slot

[ CTA row ]  Engage us (btn-accent, data-engage) · Back to home (btn-ghost)
```

**Maturity badge styles (three variants):**
- In-use / ecosystem — green-tinted (SENTIA "The ecosystem", Low-SWaP "TRL 5 · fielded").
- Validated — lime-tinted (SWIFT "TRL 3 · advancing to TRL 4").
- R&D / neutral — grey (Alternative communications "R&D capability").

## Imagery

Generated via `anthropic-skills:anywise-visual-generator` (Nano Banana / Gemini), Anywise palette (Apple green #39a849, Lime #c3e01b, Mint #2d7f36). Chris will later swap in real images where available.

Assets needed (stored under `assets/images/innovation/`):
- `innovation-hero.jpg` (optional homepage/hero band or per-section visuals)
- `sentia.jpg` — abstract sensor→commander ecosystem/pipeline visual
- `swift.jpg` — multipath / disaggregated message visual (abstract, no equipment specifics)
- `sensing-vision.jpg` — distributed small-sensor field visual (no identifiable hardware)
- `alt-comms.jpg` — self-healing mesh / spectrum visual

All must be public-safe and non-specific about actual hardware. Styled placeholder containers (bg + border) degrade gracefully until real images land.

## Motion & styling alignment

- Colours/fonts via existing CSS variables (`--accent`, `--lime`, `--bg-card`, `--bg-card-hover`, `--text-primary/secondary/tertiary`, `--font`, `--mono`, `--radius-lg`, `--transition`, `--gradient-al`).
- Headings use `<em>` accent treatment (per `.team h2 em` → accent green).
- Scroll reveal: reuse `.reveal` + existing observer in `shared.js` and inline on `index.html`. No new observer.
- Mono uppercase `.label` eyebrows; `.section-divider` before the homepage section.
- Respect `prefers-reduced-motion` (handled globally).

## Testing / verification

- Renders in both light and dark themes, desktop + mobile breakpoints.
- Nav "Innovation" scrolls to `#innovation`; scroll-spy highlights it; mobile menu includes it.
- Homepage CTA → `innovation.html`; page nav/footer/Engage modal function.
- All four sections render with correct badges; reveals fire on scroll; disabled under reduced-motion.
- No named hardware/protocols present (grep check for HaLow/LoRa/ESP/microcontroller/ESP32 → zero matches in copy).
- No console errors; homepage globe/hero/counters unaffected.

## Future extension (not in scope)

Innovations can be added as further detailed sections; if the list grows large, consider per-innovation anchors or splitting to sub-pages. Preview grid on the homepage can grow beyond four with the existing responsive grid.
