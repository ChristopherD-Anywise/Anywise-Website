# Nav Restructure, New Pages & Section Navigation Links

**Date:** 2026-04-08  
**Status:** Approved

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

### Files to update

- `index.html` — update nav
- All 20 existing live HTML pages — update nav
- `template/pages/*.html` — update nav in templates

### Active state logic

Each page sets `class="active"` on its corresponding nav link. New pages `philanthropy.html` and `team.html` follow the same pattern. Root-level pages use relative paths (`products/index.html`), subdirectory pages use `../` prefixed paths.

---

## 2. Section Navigation Links (Homepage)

### Design

A right-aligned accent text link appears in the header of 4 homepage sections. It sits on the same visual row as the section label/heading, flush right.

**Link style:** `var(--accent)` colour, no underline, 0.875rem, font-weight 600, small right arrow (→), hover: `translateX(3px)` on the arrow, opacity transition. One shared class: `.section-nav-link`.

**Section header structure change:** Headers with `div > label + h2` get their wrapper converted to `display: flex; justify-content: space-between; align-items: flex-end`. Left side retains the label + h2 stack; right side holds the `.section-nav-link`.

### Section links

| Section ID | Link text | Destination |
|---|---|---|
| `#products` | `View all Products & Services →` | `products/index.html` |
| `#philanthropy` | `Learn more about our giving →` | `philanthropy.html` |
| `#about` (renamed `#team`) | `Meet the Anywise team →` | `team.html` |
| `#news` | `View all Insights →` | `blog/index.html` |

### CSS addition (shared.css)

```css
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

After `#products` (Products & Services), before existing `#news` / `#about` sections. Section ID: `philanthropy`.

### Structure

Two-column split matching the existing `approach` and `about` section patterns:

- **Left column:** 
  - `<p class="label">Philanthropy</p>`
  - `<h2>` — "Business as a force for good."
  - 2–3 sentence summary: Anywise's commitment to giving back — environmental stewardship, community investment, and education access
  - `.section-nav-link` → `philanthropy.html`

- **Right column:**
  - 3 pillar cards in a vertical stack or small grid:
    - **Community** — Supporting First Nations communities, local employment, and social enterprise
    - **Environment** — Reducing our footprint and partnering with organisations working on sustainability
    - **Education** — Investing in STEM pathways, scholarships, and digital inclusion programs

### Pillar card style

Matches `.capability-card` or `.feature-item` pattern — border `var(--border-accent)`, background `var(--bg-card)`, radius `var(--radius-lg)`, padding `1.5rem`, accent-coloured label, short paragraph.

---

## 4. New Pages

Both pages follow the exact subpage pattern established by `products/aide.html`:
- Same `<head>` structure: meta tags, OG tags, Twitter card, favicons, font preconnects, `shared.css`, then inline `<style>`
- Same nav (updated per Section 1 above)
- Breadcrumb: `Home / [Page Name]`
- Same footer (updated per Section 1 above)
- Scroll-to-top button before the shared.js script tag (`shared.js` for root pages, `../shared.js` for subdirectory pages)

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
- **Community** — icon + h3 + 2-sentence description
- **Environment** — icon + h3 + 2-sentence description  
- **Education** — icon + h3 + 2-sentence description

Use SVG inline icons consistent with existing product page icon style.

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
- h1: "any.**one** is welcome." (matching homepage styling with bold emphasis on "one")
- Tagline: We are a team of defence professionals, data scientists, engineers, and community advocates united by a belief that technology should serve people — not the other way around.
- CTA buttons: `Engage Us →` (modal) + `Learn about our giving →` (→ `philanthropy.html`)

**2. Values Strip**
4 short value statements in a horizontal row (collapses to 2×2 on mobile):
- **Ethical first** — Every decision starts with what's right, not what's easy
- **Sovereign by design** — Australian-built, Australian-owned, Australian-focused
- **Diverse by intent** — any.one is welcome because diversity is a capability
- **Transparent always** — We say what we mean and deliver what we promise

**3. Team Grid**
Responsive card grid (3 columns desktop, 2 tablet, 1 mobile).

Each card:
- Photo placeholder: circular `div` with `background: var(--bg-card); border: 2px solid var(--border-accent)` and initials or icon centred
- Name: `h3` at 1rem, font-weight 600
- Title: `p` at 0.825rem, `var(--text-secondary)`
- Short bio: 1–2 sentence placeholder
- Card style: `var(--bg-card)`, `var(--border)` border, `var(--radius-lg)` radius, hover lifts slightly

Placeholder team members (8–10 cards with realistic-sounding names, titles, and bios representing the breadth of the team — defence, data, engineering, operations, community).

**4. CTA**
- h2: "Join the any.one community."
- Subtext: We're always looking for passionate people who want to make a difference.
- Buttons: `Engage Us →` (modal) + `View open roles →` (→ `careers.html` if it exists, otherwise omit)

---

## 5. Footer Updates

The "Company" column in the footer across all pages updates to:

```
Anywise Team    → team.html
Philanthropy    → philanthropy.html
Insights        → blog/index.html
Contact         → contact.html
Engage Us       → modal trigger
Privacy Policy  → privacy.html
Terms of Use    → terms.html
```

Remove the `#capabilities`, `#approach`, and `#about` anchor references from the footer Capabilities column. Replace with:

```
Capabilities column → remove entirely or rename to "Explore"
Keep: Products & Services index link
```

---

## Scope Summary

| Deliverable | Files affected |
|---|---|
| Nav update | `index.html` + all 20 live pages + templates |
| Section nav links | `index.html` (4 sections), `shared.css` (1 new class) |
| Philanthropy section | `index.html` |
| `philanthropy.html` | New file (root level) |
| `team.html` | New file (root level) |
| Footer updates | All 20+ live pages |
| Sitemap | `sitemap.xml` — add 2 new URLs |

---

## Out of Scope

- Real photography or team headshots (placeholders only)
- Careers page (referenced in team CTA only if already exists)
- Any backend or form functionality on new pages
- Mobile nav reorder (inherits from desktop nav HTML order)
