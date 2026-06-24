# Innovation Zone (Emergency Services) — Design Spec

**Date:** 2026-06-24
**Status:** Approved (direction locked via mockup)
**Author:** Chris Dennis / Claude

## Summary

Add an "Innovation Zone" to the Anywise website, scoped for now to **Emergency Services (EM)** only. It has two parts:

1. **Homepage section** (`#innovation` on `index.html`) — a lean, thought-provoking teaser that signals Anywise is innovating in the EM space, frames what EM customers actually need, and links through to the dedicated page.
2. **Dedicated Innovation page** (`/innovation.html`) — the detail view showing the EM capability threads with use-case-driven blurbs.

A nav link ("Innovation") is added to the header. The build reuses existing site patterns (markup, CSS variables, `reveal` scroll animation) so it feels native. EM is the only market for launch; the design leaves room to add Disaster Relief and Wildlife Detection & Conservation later without rework.

## Goals

- Communicate that Anywise is actively innovating in Emergency Services.
- Lead with the customer problem ("not more data — the right call, in the moment"), not a feature list.
- Provide a clear path from homepage teaser → dedicated page → Engage Us.
- Match the established Anywise visual language and motion exactly.

## Non-goals (YAGNI)

- No Disaster Relief or Wildlife sections yet (structure must accommodate them later, but not built now).
- No tabs, accordions, or carousels.
- No new JavaScript libraries — reuse the existing IntersectionObserver `reveal` mechanism and scroll-spy.
- No CMS / data-driven content; content is static HTML.

## Placement & Navigation

- **Homepage section** inserted **after Products & Services (`#products`), before Track Record (`#track`)**, preceded by the existing `<div class="section-divider"></div>`.
- **Nav link** added to `index.html` `.nav-links` between "Products & Services" and "About":
  `<li><a href="#innovation">Innovation</a></li>`
- Scroll-spy auto-discovers sections by `id`; no JS change needed for the active-link highlight.
- The dedicated page nav mirrors the homepage nav. Its "Innovation" link points back to `index.html#innovation` (consistent with how `careers.html` / product pages link home), OR is marked active if we treat `/innovation.html` as a standalone page — implementation will follow the existing product-page nav convention.

## Homepage section — structure & content

Reuses the section header pattern (`.label` + `<h2>` + intro `<p>`) and card styling consistent with `.cap-card` / `.product-card`.

```
<section class="innovation" id="innovation">
  label:  "Innovation Zone"
  h2:     "Where the next decade of <em>emergency response</em> is being built."
  intro:  "Emergency services don't need more data — they need the right call, in
           the moment, with the information already on hand. That's the problem
           we're innovating against."

  [ teaser card (left) ]                 [ imagery (right) ]
   label: "Emergency Services"
   copy:  "From the sensor to the command post: real-time detection, resilient
           communications, and human-in-the-loop decision tools — including our
           FIRE|AIDE products."
   pills: Sensing · Communications · AIDE tools
   cta:   "See how we're innovating →"  → /innovation.html
```

- Two-column on desktop (teaser card + imagery), stacks to one column on mobile at the existing breakpoint.
- Teaser card uses the `border-left: 3px solid var(--accent)` accent treatment already present in the codebase.
- `reveal` on the header and on the card row (with a short transition-delay on the second element), matching existing stagger behaviour.

## Innovation page — structure & content

New file `innovation.html`, cloned from an existing simple page (e.g. `careers.html`) per the project convention "clone an existing page and gut the content." Inherits the same `<head>`, nav, footer, `shared.css`/`shared.js`, theme toggle, and Engage modal.

Section: `Innovation Zone / Emergency Services`

```
label:  "Innovation Zone / Emergency Services"
h2:     "Augmenting the people who <em>respond</em>."
intro:  "Four capability threads, built to put the right decision in reach when
         conditions are worst and time matters most."

[ full-bleed hero imagery band ]

Capability list (icon + name + blurb per row, hairline divider between rows):

1. Sensing
   "Real-time detection and reporting on assets, resources and potential threats —
    feeding decision-making platforms with meaningful, trustworthy data."

2. Communications
   "Critical data transfer in multi-bearer environments, ensuring field data reaches
    where it needs to go — even in hostile, disrupted conditions."

3. Planning & Execution
   "Turning a live, changing picture into coordinated response — sequencing effort
    against what's actually happening on the ground."

4. AIDE products (FIRE|AIDE)
   "Purpose-built decision augmentation that keeps a human in the loop — helping
    decision-makers make the right call with the information on hand."

5. Decision-making tools
   "Automating policy and process so sound, defensible decisions can be made faster —
    without surrendering judgement to the machine."

CTAs:  [ Engage us → ]  [ Back to home ]
```

> Note: copy above is intentionally em-dash-light per house style (recent commits replaced em-dashes); implementation should use the site's existing punctuation convention.

- Capability rows reuse the hairline-divider + hover-shift interaction shown in the mockup (subtle `padding-left` shift on hover, `var(--transition)`).
- Icons: Anywise does not load Tabler; use the site's existing icon approach (inline SVG / existing icon set). Implementation will match whatever `index.html` capability/feature rows use. If no icon system exists, omit icons and use the `.cap-num`-style mono label instead.
- `reveal` animations on header, hero band, and capability block, matching the site's IntersectionObserver.

## Imagery

Generated via the `anywise-visual-generator` (Nano Banana / Gemini) skill, in the Anywise palette (Apple green #39a849, Lime #c3e01b, Mint #2d7f36) and graphic language.

Assets needed:
- **Homepage teaser** — 4:3, EM field response / command post theme.
- **Innovation page hero band** — wide (~21:7), sensor → comms → command narrative.

Stored under `assets/images/` (subfolder e.g. `innovation/`), referenced with the site's existing relative-path + URL-encoding convention. Until generated, styled placeholders are acceptable but the launch target is real imagery.

## Motion & styling alignment

- Colours/fonts via existing CSS variables (`--accent`, `--bg-card`, `--text-primary`, `--font`, `--mono`, `--radius-lg`, `--transition`).
- Headings use the gradient-text `<em>` treatment already used elsewhere (`background: var(--gradient-al); -webkit-background-clip:text`).
- Scroll reveal: reuse `.reveal` class + existing observer in `shared.js` / `index.html` — do not introduce a new observer.
- Mono uppercase `.label` for eyebrow text; pills styled to match existing tag conventions.
- Respect `prefers-reduced-motion` (already handled globally).

## Testing / verification

- Visual: section renders in both light and dark themes (theme toggle), desktop + mobile breakpoints.
- Nav: "Innovation" link scrolls to `#innovation`; scroll-spy highlights it; mobile menu includes it.
- Link: teaser CTA navigates to `innovation.html`; page nav + footer + Engage modal all function (inherited from clone).
- Reveal animations fire on scroll and are disabled under reduced-motion.
- No console errors; existing page behaviour (globe, hero zoom, counters) unaffected by the inserted section.

## Future extension (not in scope)

When Disaster Relief and Wildlife Detection & Conservation are added, the homepage section becomes a multi-market grid (3 cards) and the dedicated page either gains market sub-sections or splits into per-market views. The current markup should not hard-code "single card only" assumptions that block this.
