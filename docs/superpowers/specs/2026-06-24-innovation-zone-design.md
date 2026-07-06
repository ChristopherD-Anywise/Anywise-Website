# Innovation Zone — Design Spec

**Date:** 2026-06-24
**Status:** Approved (copy locked via v4 mockup; customer-lens rewrite applied)
**Author:** Chris Dennis / Claude
**Supersedes:** 2026-06-24-innovation-zone-em-design.md (EM-only concept)

## Summary

Add an "Innovation" area to the Anywise website with two parts:

1. **Homepage section** (`#innovation` on `index.html`) — an abridged, outward-facing section that positions Anywise as taking on hard problems others treat as too hard and engineering them into sovereign capability. Includes a three-step pathway (Prove the hard part → Validate → Field it), a compact preview of the four innovations (ordered fielded-first), and a link to the full page.
2. **Dedicated Innovations page** (`/innovation.html`) — a detailed, full-width section per innovation, each framed problem-first with a "For:" line naming the buyer, a maturity badge, and a visual.

A nav link ("Innovation") is added to the header. The build reuses existing site patterns (markup, CSS variables, `.reveal` scroll animation, `.btn` classes, footer, Engage modal) so it is native to the site.

## Copy principles (customer lens)

The copy was reviewed and rewritten from the perspective of a mixed audience: operational buyers (defence capability leads, emergency-services CTOs, government programme owners) AND innovation/R&D partners. Governing principles:

- **Outward-facing, benefit-led.** Headlines speak to the customer's problem and outcome, not Anywise's self-image.
- **Trust first, pipeline second.** Lead with fielded/proven capability; present R&D as momentum ("what we're pushing next"), never as the opening impression. Innovations are ordered fielded-first.
- **Concrete over abstract.** Each innovation says what the user actually gets. Avoid generic "AI-assisted decision advantage" filler.
- **Honest maturity.** Accurate per-innovation maturity badges — a credibility signal, not something to hide or inflate.
- **Sovereignty as a differentiator**, expressed concretely: based in Melbourne, in-house Australian RD&I capability, and speed to delivery through Agile methodology (not just "Australian-owned").
- **Public-safe.** No classified detail, no named hardware/boards/sensors, no named comms protocols.

## The four innovations (all past proof of concept), ordered fielded-first

Order on the page: **1. Sensing & vision (fielded) → 2. SENTIA (ecosystem) → 3. SWIFT (validated) → 4. Assured Connectivity (R&D).** Trust-first, pipeline-last.

### 1. Sensing & vision — fielded
- **Badge:** "Fielded · TRL 5".
- **Tagline:** Eyes and ears where power and comms run out.
- **Problem/solution:** The places that matter most are often the ones you can't watch: no power, no network, no easy access. We field small, low-cost sensors you can deploy in numbers and leave in place, turning those blind spots into a live picture you can act on. Each configuration is built around the problem, not the other way round.
- **Use-case tags:** Vehicle detection & classification — Defence; Wildlife & animal detection — Aviation; Events of significance — custom.
- **For:** anyone who needs to know what's happening somewhere they can't reach, power, or connect.
- **Constraint:** NO named boards/microcontrollers/sensor types in copy. "Deploy in numbers and leave in place" replaces the earlier word "abundant". Value-and-outcome framing only.

### 2. SENTIA — the ecosystem
- **Badge:** "The ecosystem" (no TRL — SENTIA is not a single maturity level; it is the ecosystem that holds the underlying products/solutions).
- **Tagline:** From sensor to commander, with the reasoning shown.
- **Problem/solution:** There is more data reaching decision-makers than any person can weigh in the time they have. SENTIA is the ecosystem our systems plug into: it senses, links and interprets that data, then hands the decision-maker a clear recommendation, and shows the reasoning and the sources behind it, so they can trust it or overrule it.
- **Pipeline chips:** Sense › Enrich › Nexus › Think › Inform › Assure.
- **Feature points:** You set the level of automation (from advisory to hands-on; high-stakes calls always stay with a person); Built on proven systems (underpinned by Anywise capability in use, demonstrated, or under contract with the ADF).
- **For:** commanders and practitioners who have to make a defensible call, fast, and stand behind it.
- **Note:** the earlier line "Not a black box. A second brain that shows its working." was cut (removed per Chris — off-tone).

### 3. SWIFT — resilient comms
- **Badge:** "Validated · TRL 3, advancing to 4".
- **Tagline:** Getting the message through when the network is denied.
- **Problem/solution:** When bearers are jammed, intercepted or degraded, the message still has to arrive. SWIFT splits each message across several bearers at once, so no single one carries the whole thing, and reassembles it at the far end. Lose a bearer and the message still completes. Intercept one and an adversary gets a meaningless fragment. And it runs on the radios you already operate.
- **Feature points:** No single point of failure (split across bearers, not duplicated); Hard to intercept or jam (short bursts, fragmented traffic, reroutes before a bearer fails); No new hardware (sits on your existing tactical radios); Part of SENTIA (delivery you can prove — did it arrive, and intact?).
- **For:** defence and emergency teams who can't assume the network will be there.
- **Imagery:** uses the real SWIFT logo (low-poly bird) supplied by Chris — NOT a generated image. See Imagery section for treatment.

### 4. Assured Connectivity — R&D
- **Badge:** "Active R&D".
- **Tagline:** Data that reaches where nothing else can.
- **Problem/solution:** Some environments defeat conventional communications entirely — too contested, too remote, too much in the way. We're engineering prototypes that use every available slice of spectrum and heal their own networks around lost nodes, pushing data through obstacles and keeping it moving when everything else drops out. This is where we're pushing the edge next.
- **Feature points:** Uses all available spectrum (not tied to one bearer/band); Self-healing networks (reroute around lost nodes automatically, no single point of failure).
- **For:** operations in places where "no signal" isn't an acceptable answer.
- **Naming:** renamed from "Alternative communications" (weak/backup connotation) to **Assured Connectivity** (outcome-led).
- **Constraint:** NO named protocols/products (HaLow WiFi, LoRa, ESP-NOW, ESP-MESH) anywhere on the page.

## Goals

- Position Anywise as the team that takes on hard problems and engineers them into sovereign, working capability.
- Earn trust by leading with fielded/proven capability; show R&D as forward momentum.
- Frame every innovation by the customer problem it solves, and name who it's for.
- Show a credible, honest maturity story with accurate per-innovation maturity.
- Express sovereignty concretely: Melbourne-based, in-house Australian RD&I, Agile speed-to-delivery.
- Provide a clean path: homepage teaser → full Innovations page → "Bring us your problem" CTA.
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
h2:      "Sovereign capability that <em>holds up where it's needed most.</em>"
intro:   "We take the problems others treat as too hard — denied networks, no power,
          data no one can act on in time — and engineer them into working, sovereign
          capability. Melbourne-based, with Australian RD&I in house and Agile speed
          to delivery. Some is fielded today. Some is close behind."

[ pathway strip:  01 Prove the hard part → 02 Validate → 03 Field it ]
  01 "Solve what others can't."
  02 "Stand it up against the real environment."
  03 "Hardened, trialled, in operators' hands."

label:   "What we've built"
[ 4-up preview grid, fielded-first: Sensing & vision | SENTIA | SWIFT | Assured Connectivity ]
  Sensing & vision      — "Fielded eyes and ears where power and comms run out."
  SENTIA                — "The ecosystem that turns sensor data into a decision."
  SWIFT                 — "Getting the message through when the network is denied."
  Assured Connectivity  — "Data that reaches where nothing else can."

[ btn-accent ]  "See what we've built →"  → innovation.html
```

- Pathway strip: three steps with mono numerals + arrows, stacks on mobile (arrows hidden).
- Preview grid: 4 columns desktop → 2 → 1 on mobile; cards hover-lift (matching existing card hover).
- `.reveal` with staggered `transition-delay` on the header, pathway, label, grid, and CTA.

## Innovations page — structure

New `innovation.html`, cloned from `careers.html` (inherits `<head>`, nav, footer, `shared.css`/`shared.js`, theme toggle, Engage modal).

```
breadcrumb: Home / Innovation
label:   "Innovation"
h1:      "Hard problems, <em>engineered into capability.</em>"
sub:     "From fielded systems to active research, here's what we've built, what it
          does for the people who use it, and how far it's come."

[ detailed section per innovation — full width, hairline divider between; order:
  Sensing & vision → SENTIA → SWIFT → Assured Connectivity ]
  For each: 2-col grid (content left, visual right, stacks on mobile)
    h3: name + maturity badge
    tagline (mono, accent)
    problem/solution paragraph
    (SENTIA) pipeline chips
    feature points (2-col .feat) OR use-case tags (Sensing)
    "For:" line (accent-tinted) naming the buyer
    image slot

[ closing CTA block ]
  line:  "Have a problem that looks too hard? That's usually where we start."
  [ btn-accent ] "Bring us your problem →" (data-engage)   [ btn-ghost ] "Back to home"
```

**Maturity badge styles (three variants):**
- Fielded / ecosystem — green-tinted (Sensing "Fielded · TRL 5", SENTIA "The ecosystem").
- Validated — lime-tinted (SWIFT "Validated · TRL 3, advancing to 4").
- R&D / neutral — grey (Assured Connectivity "Active R&D").

## Imagery

Generated via `anthropic-skills:anywise-visual-generator` (Nano Banana / Gemini), Anywise palette (Apple green #39a849, Lime #c3e01b, Mint #2d7f36), abstract and public-safe (no identifiable hardware). Chris will later swap in real photography where available.

Assets (stored under `assets/images/innovation/`):
- `sensing-vision.jpg` — distributed small-sensor field / edge sensing (no identifiable devices).
- `sentia.jpg` — abstract sensor→commander ecosystem / six-stage pipeline.
- `swift.jpg` — **REAL SWIFT logo supplied by Chris** (low-poly blue/white bird on dark), NOT generated. Treatment TBD at build: options are (a) logo centred on a branded tile (dark bg + subtle accent), or (b) a SWIFT capability visual with the logo as a small lockup. Because the other three tiles are conceptual/photographic, a bare logo in an identical tile risks looking inconsistent — decide treatment when wiring the image.
- `alt-comms.jpg` — abstract self-healing mesh / spectrum motif (Assured Connectivity).

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
