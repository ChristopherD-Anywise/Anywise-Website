# Anywise Website — Design Cohesion Critique & Decisions

**Date:** 2026-07-07
**Scope:** Higher-level design *choices* — information architecture (header ↔ content mapping),
copy decisions, and element/component cohesion. Distinct from the 2026-07-07 accessibility/
consistency audit (which covered a11y, tokens, perf, SEO). This is design judgement.

**How to use:** each finding has a recommendation and, where it's a real choice, options.
Decide each (especially IA-1, the nav model) before implementing. Nothing here is built yet.

---

## A. Information architecture — the header doesn't map to the site

### IA-1 (Highest impact) — Nav mixes in-page anchors with separate pages
The 7 nav items operate on two mental models presented identically:

| Nav item | Target | Type |
|---|---|---|
| Capabilities | `#capabilities` | in-page anchor |
| Approach | `#approach` | in-page anchor |
| Products & Services | `products/index.html` | page |
| Innovation | `innovation.html` | page |
| About | `#about` | in-page anchor |
| Insights | `blog/index.html` | page |
| Careers | `careers.html` | page |

**Problems:**
- Clicking an anchor scrolls the current page; clicking a page navigates away — visually
  indistinguishable, so behaviour is unpredictable. From a sub-page, an anchor item
  (e.g. Capabilities → `index.html#capabilities`) throws the user back to the homepage mid-scroll.
- The homepage has sections with NO nav entry (Purpose, Track Record, Insights/news), while
  "Innovation" now points to the separate page, orphaning the homepage's own `#innovation`
  teaser section from navigation.

**Options:**
1. **(Recommended) Nav = destinations only.** Products, Innovation, Insights, Careers, About
   as real pages. Demote Capabilities/Approach/Purpose to homepage-scroll content reached via
   the hero "Our Capabilities" CTA, not top-level nav. Matches the site's multi-page trajectory;
   nav becomes predictable (every item = a page). Requires: an About page (or keep `#about` as
   the one deliberate anchor), removing Capabilities/Approach from nav.
2. **Nav = homepage TOC + pages, visually distinguished.** Keep anchors but separate them from
   page links (divider or grouping) so users can tell scroll-vs-navigate. More fragile; anchors
   still misbehave from sub-pages unless every anchor is `index.html#...`.

**Decision:** _pending_

### IA-2 — Sections missing from nav
Purpose, Track Record, and Insights(on-page news) have no nav path. Under Option 1 this is fine
(they're homepage narrative, not destinations). Under Option 2, decide which deserve entries.

**Decision:** _pending (follows IA-1)_

---

## B. Copy decisions

### C-1 — "Sovereign" headings collide (Medium)
Adjacent section H2s both open on "Sovereign":
- Products: *"Sovereign, Australian-designed intelligence platforms."*
- Innovation: *"Sovereign capability that holds up where it's needed most."*
Reads as a copy loop. **Recommendation:** reword one (e.g. Products → "Australian-designed
intelligence platforms." and let Innovation own "sovereign"). **Decision:** _pending wording_

### C-2 — Hero stat bar has two non-stats (Medium)
"10+ Years" (real) sits beside "APAC · EU" (a location) and "Ethical AI / Human-centred decision
augmentation" (a tagline) in identical stat boxes. The fake stats dilute the real one.
**Options:** (a) make all three real metrics (e.g. 50+ engagements, 3+ jurisdictions, ISO/B-Corp);
(b) keep "10+ Years" as the only stat and reframe the other two as plain labels, not number-boxes.
**Decision:** _pending_

### C-3 — CTA labels inconsistent (Medium)
One "contact us" intent, four labels: "Engage Us", "Engage Us →", "Start a Conversation",
"View Capabilities", plus innovation page's "Bring us your problem".
**Recommendation:** standardise the contact action on **"Engage Us"** everywhere it opens the
Engage modal; keep distinct labels only for genuinely different actions (e.g. "Our Capabilities"
scroll link is fine; "Bring us your problem" is a deliberate innovation-page variant — decide keep
or unify). **Decision:** _pending (which label is canonical; keep "Bring us your problem"?)_

### C-4 — Eyebrow labels: strength, with two gaps
Mono-uppercase eyebrows ("OUR PURPOSE", "TRACK RECORD") are a consistent, good signature.
Gaps: the Capabilities section and the closing CTA section have no eyebrow label.
**Recommendation:** add eyebrows to those two for rhythm. **Decision:** _low-risk, recommend just do_

---

## C. Element / component cohesion

### E-1 — Three card systems in proximity (Medium)
- Capabilities: green-gradient `.cap-card` (the only place this treatment appears)
- Products + Innovation preview: dark `.product-card`
One scroll passes green cards → dark cards → dark cards, reading like two design languages.
**Options:** (a) keep green gradient as a deliberate one-off accent for Capabilities only and
own it; (b) unify Capabilities toward the product-card language for a calmer page.
**Decision:** _pending_

### E-2 — Card-count rhythm (Low)
Capabilities 3, Products 5 (3+2 lopsided second row), Innovation 4. **Recommendation:** aim for
even grids (3/3/3 or 4-up) where content allows; the Products 3+2 split is the main offender.
**Decision:** _pending (may be constrained by real product count)_

### E-3 — "any." brand device used unevenly (Low)
"any.thing is possible", "any.one is welcome", "any.news" appear in 3 of ~9 sections.
**Recommendation:** decide if it's a consistent section-naming device or an occasional flourish;
current middle-ground feels accidental. **Decision:** _pending_

---

## D. What's cohesive — preserve (and codify in the skill)
- Mono-uppercase eyebrow labels + gradient-underline reveal — strong signature.
- `<em>` accent-green heading treatment — used site-wide, ties pages together.
- Token system + dark/light theming + (post-audit) consistent nav/footer across pages.
- Confident, specific, non-generic voice.

---

## Implementation note
Once decisions are made, most items are small edits (copy, labels, a card-class swap). IA-1 is
the only structural change and should be its own reviewed step. These decisions should also feed
the "how our site is built" skill so the codified system reflects the resolved design language.
