# Nav Restructure, New Pages & Section Navigation Links

**Date:** 2026-04-08  
**Status:** Approved (post-review)

---

## Overview

Three interconnected changes to the Anywise website:

1. **Nav bar restructure** — remove homepage anchor links, add Philanthropy and Anywise Team as top-level nav items, reorder to reflect site priority
2. **Section navigation links** — add right-aligned "view all" text links to 4 homepage sections
3. **Two new pages** — `philanthropy.html` and `team.html` with placeholder content matching existing subpage design patterns
4. **New Philanthropy section** on the homepage — inserted between Products & Services and the existing News/About sections

---

## 1. Nav Bar Restructure

### New nav order (all pages)

```
Products & Services | Philanthropy | Anywise Team | Insights | Contact | Engage Us | [theme toggle]
```

### Changes from current nav

| Current | New | Notes |
|---|---|---|
| `#capabilities` anchor | Removed | Internal section, not a top-level destination |
| `#approach` anchor | Removed | Internal section, not a top-level destination |
| `Products & Services` → `products/index.html` | Unchanged | Already a full page link |
| `About` → `#about` anchor | `Anywise Team` → `team.html` | Renamed + new page |
| — | `Philanthropy` → `philanthropy.html` | New nav item + new page |
| `Insights` → `blog/index.html` | Unchanged | Already a full page link |
| — | `Contact` → `contact.html` | Added explicitly to nav |
| `Engage Us` (modal trigger) | Unchanged | Stays as modal CTA |
| `[theme toggle]` | Unchanged | Stays at end |

### Complete file list for nav updates

Every file in this list needs the nav HTML replaced. Root-level pages use bare relative paths; subdirectory pages use `../` prefixes.

**Root level:**
- `index.html`
- `contact.html` ← also add `class="active"` on the Contact link
- `privacy.html` ← no active state (not a nav item)
- `terms.html` ← no active state (not a nav item)
- `philanthropy.html` ← new file, active: Philanthropy
- `team.html` ← new file, active: Anywise Team

**Blog subdirectory (`../` prefix):**
- `blog/index.html` ← active: Insights
- `blog/post.html` ← active: Insights (this is the shared template for all blog posts loaded via `?slug=`)
- `blog/commitment-to-ethical-quality-business.html` ← active: Insights
- `blog/dcsp-catalyst-for-real-change.html` ← active: Insights
- `blog/transforming-operational-challenges.html` ← active: Insights
- `blog/vicworx-preparing-for-lift-off.html` ← active: Insights

**Products subdirectory (`../` prefix):**
- `products/index.html` ← active: Products & Services
- `products/aide.html` ← active: Products & Services
- `products/campaide.html` ← active: Products & Services
- `products/engaide.html` ← active: Products & Services
- `products/fabhums.html` ← active: Products & Services
- `products/fraud-analytics.html` ← active: Products & Services
- `products/ils.html` ← active: Products & Services
- `products/impact-framework.html` ← active: Products & Services
- `products/wisdom.html` ← active: Products & Services

**Engage subdirectory (`../` prefix):**
- `engage/index.html` ← no active state (not a primary nav destination); update nav HTML only

**Templates (low priority, housekeeping only):**
- `template/pages/*.html` ← simplified nav, update for consistency

Total live pages: 21 (19 existing + 2 new)

### Active state rules

- Pages that correspond to a nav item set `class="active"` on that link
- `privacy.html`, `terms.html`, `engage/index.html` — no active state (not nav items)
- `index.html` — no active state on any link (homepage, user is not "in" a section)

### Homepage scroll-tracking JS note

The homepage inline script tracks section IDs to highlight nav links on scroll. Since `#capabilities` and `#approach` are being removed from the nav, and `#about` is being renamed to `#team` (see Section 2), the scroll-tracking logic in `index.html` must be updated to remove references to `#capabilities`, `#approach`, and `#about`. The new nav has no anchor-based items, so scroll-based active highlighting on the homepage can be simplified or removed entirely — it no longer serves a purpose. **Do not leave stale section ID references in the scroll-tracking script.**

### Hero CTA decision

The homepage hero has `<a href="#capabilities" class="btn btn-primary">Our Capabilities</a>`. This in-page anchor still works as a scroll target even though `#capabilities` is removed from the nav. The button is kept as-is — it scrolls the user to the capabilities section on the homepage, which remains correct behaviour. No change needed.

---

## 2. Section Navigation Links (Homepage)

### Design

A right-aligned accent text link appears in the header of 4 homepage sections, flush right on the same visual row as the section label/heading.

**Link style:** `var(--accent)` colour, no underline, 0.875rem, font-weight 600, arrow character (→) as text. Hover effect: `gap` between text and arrow expands from `0.25rem` to `0.5rem` — this is a gap-based animation, not `translateX`. One shared class: `.section-nav-link`.

**Section header structure change:** Headers with `div > label + h2` get their wrapper converted to `display: flex; justify-content: space-between; align-items: flex-end`. Left side retains the label + h2 stack; right side holds the `.section-nav-link`.

### Section links

| Section ID | Link text | Destination |
|---|---|---|
| `#products` | `View all Products & Services →` | `products/index.html` |
| `#philanthropy` | `Learn more about our giving →` | `philanthropy.html` |
| `#team` (renamed from `#about`) | `Meet the Anywise team →` | `team.html` |
| `#news` | `View all Insights →` | `blog/index.html` |

### Section ID rename

The homepage `<section id="about">` must be renamed to `<section id="team">` to match the new page and nav item name. The homepage CTA section `<section id="contact">` is **not renamed** — it's a distinct section from the Contact page and is not referenced by the nav. The new nav Contact link points to `contact.html`, not `#contact`, so there is no conflict.

### CSS addition (shared.css)

```css
/* ═══ SECTION NAV LINK ═══ */
.section-nav-link {
  color: var(--accent);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap var(--transition);
}
.section-nav-link:hover {
  gap: 0.5rem;
}
```

---

## 3. New Philanthropy Section (Homepage)

### Position

After `#products` (Products & Services), before existing `#news` / `#team` sections. Section ID: `philanthropy`.

### Structure

Two-column split matching the existing `approach` and `about` section patterns:

- **Left column:**
  - `<p class="label">Philanthropy</p>`
  - `<h2>` — "Business as a force for good."
  - 2–3 sentence summary: Anywise's commitment to giving back — environmental stewardship, community investment, and education access
  - `.section-nav-link` → `philanthropy.html` with text "Learn more about our giving →"

- **Right column:**
  - 3 pillar cards in a vertical stack:
    - **Community** — Supporting First Nations communities, local employment, and social enterprise
    - **Environment** — Reducing our footprint and partnering with organisations working on sustainability
    - **Education** — Investing in STEM pathways, scholarships, and digital inclusion programs

### Pillar card style

Matches `.capability-card` / `.feature-item` pattern — border `var(--border-accent)`, background `var(--bg-card)`, radius `var(--radius-lg)`, padding `1.5rem`, accent-coloured label, short paragraph.

---

## 4. New Pages

Both pages are at root level. They follow the subpage pattern for `<head>`, nav, and footer. Key differences from `products/aide.html` (which lives in a subdirectory):

- Use bare relative paths (not `../`) for all asset, CSS, and script references
- Use bare relative paths in nav links and footer links
- Breadcrumb is one level deep: `Home / [Page Name]` — not three levels like product detail pages
- Scroll-to-top button before `<script src="shared.js"></script>`

### Footer path conventions

Root-level pages (`philanthropy.html`, `team.html`, `index.html`, etc.) use bare paths:
```
href="team.html"         href="philanthropy.html"     href="blog/index.html"
href="contact.html"      href="privacy.html"           href="terms.html"
```

Subdirectory pages (`products/*.html`, `blog/*.html`) use `../` prefixed paths:
```
href="../team.html"      href="../philanthropy.html"   href="../blog/index.html"
href="../contact.html"   href="../privacy.html"        href="../terms.html"
```

---

### 4a. philanthropy.html (root level)

**Path:** `/philanthropy.html`
**Canonical:** `https://anywise.com.au/philanthropy.html`
**Nav active:** `Philanthropy`

#### Sections

**1. Hero**
- Label: `Philanthropy`
- h1: "Business as a force for good."
- Tagline: Anywise believes that building sovereign capability and giving back to community are not competing priorities — they are the same mission. We invest in the people, places, and planet that make Australia worth protecting.
- CTA buttons: `Engage Us →` (modal) + `Our Products & Services` (→ `products/index.html`)

**2. Philosophy**
Two-column:
- Left: h2 "Why we give", 3 short paragraphs on Anywise's ethical business commitment, B Corp values, community-first mindset
- Right: pull-quote block — a single bold statement styled as a large blockquote, e.g. "Profit with purpose isn't a tagline. It's how we write our budgets."

**3. Three Pillars**
Card grid (3 columns on desktop, 1 on mobile):
- **Community** — SVG icon + h3 + 2-sentence description
- **Environment** — SVG icon + h3 + 2-sentence description
- **Education** — SVG icon + h3 + 2-sentence description

Use inline SVG icons consistent with existing product page icon style.

**4. CTA**
- h2: "Work with a company that gives back."
- Subtext: Every engagement with Anywise contributes to our giving commitments.
- Button: `Engage Us →` (modal trigger)

---

### 4b. team.html (root level)

**Path:** `/team.html`
**Canonical:** `https://anywise.com.au/team.html`
**Nav active:** `Anywise Team`

#### Sections

**1. Hero**
- Label: `Anywise Team`
- h1: "any.<strong>one</strong> is welcome." (bold emphasis on "one" matching homepage style)
- Tagline: We are a team of defence professionals, data scientists, engineers, and community advocates united by a belief that technology should serve people — not the other way around.
- CTA buttons: `Engage Us →` (modal) + `Learn about our giving →` (→ `philanthropy.html`)

**2. Values Strip**
4 short value statements in a horizontal row (collapses to 2×2 on mobile):
- **Ethical first** — Every decision starts with what's right, not what's easy
- **Sovereign by design** — Australian-built, Australian-owned, Australian-focused
- **Diverse by intent** — any.one is welcome because diversity is a capability
- **Transparent always** — We say what we mean and deliver what we promise

**3. Team Grid**
Responsive card grid (3 columns desktop, 2 tablet, 1 mobile). 8–10 placeholder cards.

Each card:
- Photo placeholder: circular `div` with `background: var(--bg-card); border: 2px solid var(--border-accent)` and centred initials
- Name: `h3` at 1rem, font-weight 600
- Title: `p` at 0.825rem, `var(--text-secondary)`
- Short bio: 1–2 sentence placeholder
- Card style: `var(--bg-card)`, `var(--border)` border, `var(--radius-lg)` radius, hover lifts slightly (`translateY(-2px)`, `box-shadow`)

Placeholder team members represent the breadth of the team: defence, data science, engineering, operations, community roles.

**4. CTA**
- h2: "Join the any.one community."
- Subtext: We're always looking for passionate people who want to make a difference.
- Buttons: `Engage Us →` (modal) — omit careers link (page does not yet exist)

---

## 5. Footer Updates

### "Company" column — all pages

```
Anywise Team    → team.html (or ../team.html for subdir pages)
Philanthropy    → philanthropy.html (or ../philanthropy.html)
Insights        → blog/index.html (or ../blog/index.html)
Contact         → contact.html (or ../contact.html)
Engage Us       → modal trigger (data-engage)
Privacy Policy  → privacy.html (or ../privacy.html)
Terms of Use    → terms.html (or ../terms.html)
```

### "Capabilities" column — remove entirely

The existing footer Capabilities column (`#capabilities`, `#approach` anchors) is **removed** from all pages. The Products & Services column (listing individual product links) is retained unchanged.

The footer grid on pages that currently have 4 columns (Brand | Capabilities | Products | Company) becomes 3 columns (Brand | Products | Company).

---

## 6. Sitemap Updates

Add to `sitemap.xml`:

```xml
<url>
  <loc>https://anywise.com.au/philanthropy.html</loc>
  <lastmod>2026-04-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://anywise.com.au/team.html</loc>
  <lastmod>2026-04-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## Scope Summary

| Deliverable | Files affected |
|---|---|
| Nav update | 21 live HTML pages (see complete list in Section 1) + templates |
| Scroll-tracking JS cleanup | `index.html` inline script |
| Section ID rename | `index.html`: `id="about"` → `id="team"` |
| Section nav links + CSS | `index.html` (4 sections), `shared.css` (1 new class) |
| Philanthropy section | `index.html` |
| `philanthropy.html` | New root-level file |
| `team.html` | New root-level file |
| Footer: remove Capabilities column | All 21 live pages |
| Footer: update Company column | All 21 live pages |
| Sitemap | `sitemap.xml` — 2 new URLs at priority 0.8 / monthly |

---

## Out of Scope

- Real photography or team headshots (placeholders only)
- Careers page
- Any backend or form functionality on new pages
- Mobile nav reorder (inherits from desktop nav HTML order)
- Renaming the homepage CTA section `id="contact"` — it remains as-is; the nav Contact link points to `contact.html` directly, not `#contact`
