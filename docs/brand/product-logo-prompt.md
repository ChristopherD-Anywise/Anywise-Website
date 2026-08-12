# Anywise product logo — generation prompts

Briefs for new Anywise **product** wordmarks (a separate family from the corporate `anywise`
logo). Source of truth: `anywise_style_guide.json` (brand v2.0, Bloke Design) and the six
existing marks in `assets/images/products & services/`.

---

## READ THIS FIRST — how to run these

**One prompt = one logo = one image.** Never paste more than one brief per generation. Asking
for three marks at once produces a single stacked image with all three in it, which is useless.

**Always attach `WISDOM Logo.png` and `Eng-Aide Logo.png` as reference images.** Image models
match a supplied example far better than any written description. Without them you will not get
the right typographic weight.

**Ask for a white background, not a transparent one.** Raster image models cannot produce real
transparency — instructed to, they draw a grey-and-white checkerboard *pattern*, because that is
what "transparent" looks like in the training data. Generate on flat white, then knock the
background out afterwards (Photoshop, `remove.bg`, or Preview's Instant Alpha).

**Spelling is the main failure mode.** These models garble text constantly. Generate 4+ variants
of each and discard every one where the word is not letter-perfect. Check character by character.

### Honest expectation setting

A raster image model is the wrong tool for a typographic wordmark and will fight you on spelling.
Two better routes if these prompts frustrate you:

- **Ideogram** or **Recraft** — both markedly better at legible text than Gemini/DALL·E, and
  Recraft outputs real vector SVG.
- **Set it in a font yourself.** These marks are heavy condensed caps. Buy Druk, Archivo Black
  or Helvetica Now Black, type the word, tighten the tracking, and you are 90% there — that is
  essentially what Bloke Design did. The glyph substitution is the only custom drawing needed,
  and a designer can do that in an hour.

---

## Prompt 1 — AIDE

> A logo wordmark reading exactly "AIDE" — four letters, A-I-D-E.
>
> Typography: extremely heavy, condensed, geometric sans-serif in all capitals, similar to
> Helvetica Black or Archivo Black. Letters set tightly, almost touching. Solid pure black
> (#000000) on a plain flat white background.
>
> All four letters must be complete, correctly formed and clearly legible. Do not stylise,
> replace, overlap or decorate any letter. Do not add any symbol, icon, dot, line or graphic
> element. The word "AIDE" by itself, nothing else.
>
> Single horizontal line of text, centred, roughly 3:1 width to height, tight margins.
>
> Flat single-colour vector-style graphic. No gradients, no shading, no 3D, no outline, no
> shadow, no glow, no background texture, no checkerboard, no frame, no border, no tagline,
> no additional words or letters.

**Then, only if the clean version is right,** run this second pass to add the glyph:

> [attach your approved AIDE wordmark] Keep this wordmark exactly as it is, with all four
> letters "AIDE" unchanged and fully legible. Replace only the counter (the enclosed white
> space) inside the letter D with a small set of three thin straight lines converging to a
> single point. Change nothing else.

---

## Prompt 2 — ILS

> A logo wordmark reading exactly "ILS" — three letters, I-L-S.
>
> Typography: extremely heavy, condensed, geometric sans-serif in all capitals, similar to
> Helvetica Black or Archivo Black. Letters set tightly, almost touching. Solid pure black
> (#000000) on a plain flat white background.
>
> All three letters must be complete, correctly formed and clearly legible. Do not stylise,
> replace, overlap or decorate any letter. Do not add any symbol, icon, arrow or graphic
> element. The word "ILS" by itself, nothing else.
>
> Beneath the wordmark, on a second line, the words "INTEGRATED LOGISTICS SUPPORT" in a light
> weight sans-serif, all capitals, widely letterspaced, at about 15% of the height of the main
> letters, centred.
>
> Single horizontal lockup, roughly 3:1 width to height, tight margins.
>
> Flat single-colour vector-style graphic. No gradients, no shading, no 3D, no outline, no
> shadow, no glow, no background texture, no checkerboard, no frame, no border, no circular
> arrows, no recycling symbol.

**Note:** the first attempt produced a recycling-style circular arrow, which reads as
sustainability, not logistics. That is why the "no circular arrows" exclusion is there. ILS is
better off with no glyph at all — the descriptor line carries the meaning.

---

## Prompt 3 — SENTIA

> A logo wordmark reading exactly "SENTIA" — six letters, S-E-N-T-I-A.
>
> Typography: extremely heavy, condensed, geometric sans-serif in all capitals, similar to
> Helvetica Black or Archivo Black. Letters set tightly, almost touching. Solid pure black
> (#000000) on a plain flat white background.
>
> All six letters must be complete, correctly formed and clearly legible, spelling S-E-N-T-I-A.
> Do not stylise, replace, overlap or decorate any letter. Do not add any symbol, icon, node,
> network diagram or graphic element. The word "SENTIA" by itself, nothing else.
>
> Single horizontal line of text, centred, roughly 3:1 width to height, tight margins.
>
> Flat single-colour vector-style graphic. No gradients, no shading, no 3D, no outline, no
> shadow, no glow, no background texture, no checkerboard, no frame, no border, no tagline,
> no additional words or letters.

---

## What "house style" means here (for a human designer)

If you are briefing a person rather than a model, this is the short version:

- **Typographic wordmarks.** The type does all the work. No icon beside the name, no badge,
  shield, container or emblem.
- **Very heavy, condensed, geometric caps**, tracked tight to almost touching.
- **Pure black on transparent.** No colour at all — not even brand green. The site places these
  on white chips and recolours them in code, so any baked colour breaks it.
- **At most one glyph substitution**, and only where it genuinely helps. One letter may become a
  simple geometric symbol that still reads unambiguously as that letter, at the same visual
  width and weight. In WISDOM the second "O" is a fine radiating starburst. Used once, never
  twice — and never at the cost of legibility.
- **Optional descriptor line** in small, light, widely-letterspaced caps beneath, at 15–20% of
  cap height (as "powered by WISDOM" sits under ENG|AIDE).
- **Pipe convention:** in names like `ENG|AIDE`, the pipe is a thin vertical rule, the segment
  before it lighter, the segment after it heaviest.
- **Avoid:** swooshes, orbit rings, hexagons, circuit-board motifs, glowing nodes, gradient
  meshes, 3D extrusion, shields, eagles, globes, "AI brain" imagery. This is a defence-sector
  engineering brand — restrained, confident, typographic.
- **Deliver:** vector SVG, black on transparent, trimmed tight to the ink.

### Ask for a consistent ~3:1 ratio

The existing six range from 5.5:1 (WISDOM) to 1.2:1 (CAMP|AIDE), which forces per-logo CSS
tuning every time one is placed and already caused one sizing bug on the Capabilities page.
Specifying 3:1 up front costs the designer nothing.

---

## Which ones actually need a logo

| Product | Commission a mark? |
|---|---|
| **AIDE** | Yes — a named product, the enterprise layer |
| **ILS** | Yes — a named service line |
| **SENTIA** | Yes — the named ecosystem |
| **Sensing & vision** | Probably not — a descriptive category, not a brand |
| **Applied R&D** | No — a service offering, not a product |

The last two currently render as clean typographic wordmarks on the site, which suits a service
better than a logo would.

---

## Brand reference

| | |
|---|---|
| Apple (primary green) | `#39a849` |
| Lime (accent) | `#c3e01b` |
| Mint (deep) | `#2d7f36` |
| Black | `#000000` |
| Headings | General Sans, Bold 700 |
| Mono / labels | JetBrains Mono, 400–500 |

Graphic language, for glyph inspiration only: `any.thing` = plus sign (impact) ·
`any.way` = upward arrow (growth) · `any.one` = human silhouette (inclusivity).
