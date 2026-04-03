# Anywise Website

Production website for [Anywise](https://anywise.com.au) — an Australian B Corp-certified technology and services company specialising in defence, government, and social impact.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic, accessible) |
| Styling | CSS3 (custom properties, Grid, Flexbox, animations) |
| Scripts | Vanilla JavaScript (no frameworks, no bundler) |
| 3D | Three.js (WebGL globe on homepage) |
| Hosting | Cloudflare Workers & Pages |
| Domain | anywise.com.au (registered via eCompanies, DNS managed by Cloudflare) |
| Form Submissions | Web3Forms (client-side, emails to sales@anywise.com.au) |
| Fonts | General Sans (body), JetBrains Mono (code) — loaded via Fontshare & Google Fonts |

## Project Structure

```
/
├── index.html                 # Homepage (hero, globe, capabilities, products, CTA)
├── shared.css                 # Global design system stylesheet
├── shared.js                  # Global JS (theme, nav, scroll reveal, engage modal)
├── worker.js                  # Cloudflare Worker entry point
├── wrangler.toml              # Cloudflare deployment config
├── anywise_style_guide.json   # Brand identity source of truth
│
├── products/                  # Product & service pages
│   ├── index.html             # Products overview grid
│   ├── wisdom.html            # WISDOM — Strategic Intelligence
│   ├── engaide.html           # ENG|AIDE — Engineering Intelligence
│   ├── fraud-analytics.html   # Fraud Detection & Compliance Analytics
│   ├── impact-framework.html  # Impact Measurement & Reporting
│   ├── fabhums.html           # FABHUMS — Health & Usage Monitoring
│   ├── campaide.html          # CAMP|AIDE — Facilities Intelligence
│   ├── ils.html               # Integrated Logistics Support
│   └── aide.html              # AIDE — Enterprise Intelligence
│
├── blog/                      # Blog system
│   ├── index.html             # Blog listing page
│   ├── post.html              # Dynamic post renderer
│   └── posts.json             # Blog post data (JSON array)
│
├── engage/                    # Contact page
│   └── index.html             # Standalone Engage Us form
│
├── assets/
│   ├── images/                # All imagery (products, blog, team, certifications)
│   ├── js/three.module.js     # Three.js library
│   └── textures/              # Globe textures (blue marble, night lights)
│
├── functions/                 # Cloudflare Pages Functions (legacy, unused)
│   └── api/engage.js
│
├── template/                  # Reusable template kit for new branded sites
│   ├── brand.css              # Brand tokens to override per project
│   ├── shared.css             # Base stylesheet (do not edit)
│   ├── shared.js              # Base JS (do not edit)
│   ├── README.md              # Template documentation
│   └── pages/                 # Page templates with <!-- REPLACE --> placeholders
│
└── docs/                      # Documentation & planning
    ├── cloudflare-deployment-guide.md
    └── superpowers/           # Design specs & implementation plans
```

## Design System

### Colour Palette

| Name | Hex | Usage |
|------|-----|-------|
| Apple | `#39a849` | Primary accent (dark mode) |
| Lime | `#c3e01b` | Gradient highlights |
| Mint | `#2d7f36` | Primary accent (light mode), secondary |

Three gradients are derived from these: `--gradient-al`, `--gradient-lm`, `--gradient-ma`, `--gradient-full`.

### Theme System

The site supports dark and light modes:

- **Default:** Auto-detected based on Sydney, Australia timezone (6am-6pm = light, else dark)
- **User override:** Toggle button stores preference in `localStorage` key `'theme'`
- **Implementation:** CSS custom properties on `:root` / `[data-theme="light"]`, toggled via `data-theme` attribute on `<html>`
- **Globe:** Homepage Three.js globe swaps between blue marble (light) and night lights (dark) textures

### Typography

- **Body:** General Sans (400, 500, 600, 700) via Fontshare
- **Monospace:** JetBrains Mono (400, 500) via Google Fonts
- **Fluid sizing:** Uses `clamp()` for responsive scaling

### Key Components

| Component | CSS Class | Notes |
|-----------|-----------|-------|
| Navigation | `.nav-*` | Fixed top, scroll shadow, mobile hamburger with focus trapping |
| Buttons | `.btn`, `.btn-primary`, `.btn-accent` | Three variants |
| Cards | Product cards, capability cards, news cards | Grid-based, hover states |
| Engage Modal | `.engage-overlay`, `.engage-panel` | Injected by shared.js on every page |
| Scroll Reveal | `.reveal`, `.reveal-scale` | IntersectionObserver at 10% threshold |
| Section Divider | `.section-divider` | Animated sweep line between sections |
| Footer | `.footer-grid`, `.footer-col` | 4-column grid, responsive |

## Important: index.html Has Inline Styles

The homepage (`index.html`) contains its own `<style>` block that overrides `shared.css` for the hero, globe, navigation, and footer. If you update styles in `shared.css`, you **must also check and update** the inline styles in `index.html` or the homepage will look different from all other pages.

## How the Blog Works

Blog posts are stored in `/blog/posts.json` as a JSON array. Each post object contains:

```json
{
  "slug": "post-url-slug",
  "title": "Post Title",
  "date": "Feb 15, 2026",
  "readTime": "3 min read",
  "category": "Insights",
  "author": "Anywise Team",
  "heroImage": "../assets/images/blog/image.jpg",
  "intro": "Opening paragraph...",
  "sections": [
    { "heading": "Section Title", "paragraphs": ["..."] },
    { "pullquote": "Highlighted quote" },
    { "list": ["Item 1", "Item 2"] }
  ]
}
```

`/blog/index.html` reads this JSON and renders the listing. `/blog/post.html` reads the `?slug=` query parameter and renders the full post.

## Engage Us Form

The contact form is available as:
1. **Modal** — injected on every page by `shared.js`, triggered by any element with `data-engage` attribute
2. **Standalone page** — `/engage/index.html`

### How Submission Works

The form submits client-side to [Web3Forms](https://web3forms.com):

```
Browser → fetch('https://api.web3forms.com/submit', { JSON payload })
                          ↓
              Web3Forms sends email
                          ↓
              sales@anywise.com.au inbox
```

- **Access key:** `f1275295-758d-4103-b3e7-055977430b13` (not secret — safe in client-side code)
- **Free tier:** 250 submissions/month, no branding
- **Reply-to:** Set to the submitter's email so sales can reply directly
- **Subject format:** `Engage Us: {enquiry type} enquiry from {name} ({organisation})`

### Form Fields

| Field | Required | Notes |
|-------|----------|-------|
| Full name | Yes | |
| Work email | Yes | |
| Organisation | Yes | |
| Your role | No | |
| Enquiry type | Yes | Product, Partnership, General, Other |
| Product | Conditional | Shown only when enquiry type = "Product" |
| Message | Yes | |

## Cloudflare Deployment

### Architecture

```
eCompanies (registrar)
  └── Nameservers → Cloudflare
        ├── DNS management (MX, SPF, DKIM, Microsoft 365, etc.)
        ├── SSL termination
        └── Workers & Pages
              ├── Static assets (HTML, CSS, JS, images)
              └── Worker script (worker.js)
                    └── Custom domains:
                          ├── anywise.com.au
                          └── www.anywise.com.au
```

### Build & Deploy

The site is deployed via Cloudflare Workers & Pages connected to the GitHub repo `ChristopherD-Anywise/Anywise-Website` on the `main` branch.

**Build command:**
```
mkdir -p public && cp -r index.html shared.css shared.js favicon-96x96.png favicon-32.png favicon-16.png apple-touch-icon.png og-image.png assets products blog engage functions public/
```

**Deploy command:**
```
npx wrangler deploy ./worker.js --assets ./public --name anywise-website --compatibility-date 2025-09-27
```

**Why explicit file copying:** Cloudflare's build environment would otherwise deploy the entire repo including `.git/`, which exceeds the 25MB single-file asset limit. We explicitly copy only production files into `public/`.

**Key constraints:**
- `rsync` is not available in the Cloudflare build environment — use `cp -r`
- Wrangler may auto-generate a `wrangler.jsonc` that overrides committed config
- The Worker script path is a **positional argument** to `wrangler deploy`, not a `--main` flag

### Custom Domain Setup

The domain `anywise.com.au` is registered with **eCompanies** (.au registrar). DNS is managed by **Cloudflare**.

**How it was configured:**
1. Added `anywise.com.au` as a site in Cloudflare (free plan)
2. Cloudflare auto-imported existing DNS records
3. Deleted old hosting records (Wix A records, CNAMEs)
4. Kept all email/Microsoft 365 records (MX, autodiscover, DKIM, SPF, etc.)
5. Updated nameservers at eCompanies to Cloudflare's nameservers
6. Added custom domains via Workers & Pages → Settings → Domains & Routes → Custom Domain

**Critical:** Do NOT manually create CNAME or A records for the domain. Use Cloudflare's **Custom Domains** feature which auto-creates the correct DNS records. Manual records cause 522/1016 errors.

### DNS Records to Preserve

When making DNS changes, **do not delete** these records:

| Type | Purpose |
|------|---------|
| MX | Email delivery (Microsoft 365) |
| TXT (SPF) | `v=spf1 include:_spf.google.com include:spf.protection.outlook.com include:spfa.cpmails.com include:spf.au.exclaimer.net include:relay.mailchannels.net ~all` |
| TXT (DKIM) | `_mailchannels` — Web3Forms email authentication |
| CNAME | autodiscover, selector1/2 — Microsoft 365 |
| SRV | _sip, _sipfederationtls — Teams/Skype |
| TXT | Google site verification, Microsoft verification, Brave verification |
| TXT (DMARC) | `_dmarc` — email authentication policy |

## Development

### Local Development

No build step required. Open any HTML file directly in a browser, or use a local server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .

# VS Code
# Use the Live Server extension
```

### Adding a New Product Page

1. Copy an existing product page (e.g. `products/wisdom.html`)
2. Update the content, meta tags, and OG tags
3. Add the product to `/products/index.html` grid
4. Add a product card entry to the homepage `index.html` if desired
5. Update the Engage Us modal product dropdown in `shared.js` (line ~219)

### Adding a Blog Post

1. Add a new entry to `/blog/posts.json`
2. Add the hero image to `/assets/images/blog/`
3. The blog index and post pages render dynamically from the JSON

### Editing Styles

- **All pages except homepage:** Edit `shared.css`
- **Homepage:** Edit BOTH `shared.css` AND the `<style>` block in `index.html`
- **Template:** Edit `template/brand.css` for brand tokens, do not edit `template/shared.css`

### Language

All content uses **Australian English**: programme (not program), standardised (not standardized), organisations (not organizations). The only exception is "program" when referring to computer programs.

## Repositories

| Repo | Purpose |
|------|---------|
| [Anywise-au/Anywise-Website](https://github.com/Anywise-au/Anywise-Website) | Organisation repo (origin) |
| [ChristopherD-Anywise/Anywise-Website](https://github.com/ChristopherD-Anywise/Anywise-Website) | Personal repo (connected to Cloudflare) |

Both repos are kept in sync. Cloudflare deploys from the **personal** repo.

## Template Kit

The `/template/` directory contains a reusable website template kit for spinning up new branded sites. It uses the same design system but with `<!-- REPLACE -->` placeholder comments throughout.

To create a new site:
1. Copy the `template/` directory
2. Edit `brand.css` to set your brand colours, fonts, and spacing
3. Search and replace all `<!-- REPLACE: ... -->` comments in the HTML files
4. Add your images and content
5. Deploy to Cloudflare using the same build/deploy pattern

See `/template/README.md` for full documentation.
