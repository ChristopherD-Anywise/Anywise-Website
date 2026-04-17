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
| Navigation | `.nav-*` | Fixed top, scroll shadow, mobile hamburger with focus trapping. Hamburger uses `.bar` spans + `.close-x` for open/close animation |
| Buttons | `.btn`, `.btn-primary`, `.btn-accent` | Three variants |
| Cards | Product cards, capability cards, news cards | Grid-based, hover states |
| Engage Modal | `.engage-overlay`, `.engage-panel` | Injected by shared.js on every page. Full-viewport bottom sheet on mobile with fixed Send button |
| Scroll Reveal | `.reveal`, `.reveal-scale` | IntersectionObserver at 10% threshold |
| Section Divider | `.section-divider` | Animated sweep line between sections |
| Footer | `.footer-grid`, `.footer-col` | 4-column grid, responsive |

## Important: index.html Has Inline Styles

The homepage (`index.html`) contains its own `<style>` block that overrides `shared.css` for the hero, globe, navigation, and footer. If you update styles in `shared.css`, you **must also check and update** the inline styles in `index.html` or the homepage will look different from all other pages.

## Mobile Navigation

The hamburger menu (< 768px) uses this markup on **every page**:

```html
<button id="mobileToggle" class="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">
  <span class="bar"></span><span class="bar"></span><span class="bar"></span>
  <span class="close-x">&times;</span>
</button>
```

The `.bar` spans are absolutely positioned within the button (top: 0, 7px, 14px). When `.open` is added, the bars hide and the `.close-x` appears as an X. All styling is in `shared.css` — do not rely on index.html inline styles for this.

**Backdrop-filter and stacking contexts:** When the user scrolls, `nav.scrolled` gets `backdrop-filter: blur(24px)` which creates a CSS stacking context. When the mobile menu opens, `shared.js` disables `backdrop-filter` on nav instantly (with `transition: none` to avoid a visible animation) so the full-screen menu overlay renders correctly. It's restored when the menu closes.

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

### Mobile Behaviour

On mobile (< 768px), the modal renders as a full-viewport bottom sheet:
- `align-items: flex-end` with `max-height: 100dvh` fills the screen from the bottom
- Rounded top corners (`border-radius: 16px 16px 0 0`)
- The **Send button and privacy text** are `position: fixed` at the bottom of the screen so they're always visible regardless of scroll position
- The panel has extra `padding-bottom: 5rem` to prevent the Message field from being hidden behind the fixed actions bar
- `panel.scrollTop = 0` is set on open so the form always starts at the top
- Safe area insets are respected for iOS notch and home indicator

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
mkdir -p public && cp -r index.html shared.css shared.js favicon-96x96.png favicon-32.png favicon-16.png apple-touch-icon.png og-image.png sitemap.xml robots.txt privacy.html terms.html contact.html assets products blog engage functions public/
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

## Careers System

The careers platform has two sides: **job listings** (ClickUp → website) and **applications** (website → ClickUp). Both are handled by the `careers-api` Cloudflare Worker in `workers/careers-api/`.

### Architecture

```
ClickUp (Roles list)                    ClickUp (Talent Community list)
   │ "published" tasks                      ▲ applicant/EOI tasks
   │                                        │
   ▼ /sync-jobs webhook                     │ /apply or /eoi POST
careers-api Worker ──────────────────── careers-api Worker
   │                                        │
   ▼ GitHub Contents API                    ├── CV → R2 staging → ClickUp attachment → R2 cleanup
jobs.json committed to repo                 ├── Task linked to matching role (applications only)
   │                                        └── "EOI" tag added (expressions of interest only)
   ▼
careers.html reads jobs.json
```

### Two ClickUp Lists

| List | ID | Purpose |
|------|----|---------|
| **Roles** | `901614527130` | Job ads — tasks with status "published" are synced to the website |
| **Talent Community** | `162603016` | Where applicant and EOI tasks are created |

### Job Listings Pipeline (ClickUp → Website)

1. Someone creates/edits a task in the **Roles** list and sets its status to **published**
2. A webhook triggers `POST /sync-jobs` on the Worker (authenticated via `X-Webhook-Secret` header)
3. The Worker fetches all published tasks from the Roles list via the ClickUp API
4. Each task's description is parsed into structured sections (see [Writing a Job Ad](#writing-a-new-job-ad))
5. Custom fields are read: **Type** (Full-time, etc.), **Location** (labels field), **Closing Date**
6. The Worker commits the resulting `jobs.json` to GitHub via the Contents API
7. Cloudflare rebuilds the site, and `careers.html` renders listings from `jobs.json`

**To remove a job:** Change its status to anything other than "published" (e.g. "closed") and trigger the sync. It will be excluded from the next `jobs.json` commit.

### Application Pipeline (Website → ClickUp)

1. User fills out the multi-step application wizard on `careers.html` and submits
2. `POST /apply` receives multipart form data (name, email, phone, CV file, etc.)
3. CV is uploaded to R2 as a staging file
4. A ClickUp task is created in the **Talent Community** list with all form data as custom fields and a markdown description
5. The task is linked to the matching role task in the Roles list (by slugifying the role name)
6. The CV is fetched from R2 and attached directly to the ClickUp task via the attachment API
7. On successful attachment, the R2 staging file is deleted
8. Success response returned to the browser

**Expression of Interest (EOI):** `POST /eoi` follows the same flow but creates a task tagged "EOI" without role linking.

### Worker Configuration

**`wrangler.toml` variables:**

| Variable | Value | Purpose |
|----------|-------|---------|
| `ALLOWED_ORIGINS` | `https://anywise.com.au,https://www.anywise.com.au` | CORS |
| `CLICKUP_LIST_ID` | `162603016` | Talent Community list for applications |
| `CLICKUP_ROLES_LIST_ID` | `901614527130` | Roles list for job sync |
| `R2_PUBLIC_URL` | `https://pub-9ca69b476984498ea82bd6e6b2cffe0f.r2.dev` | R2 bucket public URL |
| `GITHUB_REPO` | `ChristopherD-Anywise/Anywise-Website` | Target repo for jobs.json commits |

**Secrets** (set via `npx wrangler secret put <NAME>`):

| Secret | Purpose |
|--------|---------|
| `CLICKUP_API_KEY` | ClickUp API personal token |
| `WEBHOOK_SECRET` | Authenticates `/sync-jobs` webhook calls |
| `GITHUB_TOKEN` | GitHub personal access token for committing jobs.json |

**R2 bucket:** `anywise-careers-cv` — used for temporary CV staging during the attachment flow.

### Worker Source Files

| File | Responsibility |
|------|---------------|
| `src/index.ts` | Route handlers (`/apply`, `/eoi`, `/sync-jobs`), ClickUp task creation, custom field mapping |
| `src/sync-jobs.ts` | Fetches published roles from ClickUp, parses descriptions, triggers GitHub commit |
| `src/parse-description.ts` | Parses markdown job descriptions into structured sections |
| `src/github.ts` | Commits `jobs.json` to GitHub via the Contents API |
| `src/clickup-attachment.ts` | Attaches CV files to ClickUp tasks, cleans up R2 staging files |
| `src/clickup-link.ts` | Links applicant tasks to role tasks by slug matching |

### Custom Fields in ClickUp

The Worker maps form data to ClickUp custom fields using hardcoded UUIDs. If fields are added or changed in ClickUp, the UUIDs in `src/index.ts` must be updated. Use the ClickUp API (`GET /list/{list_id}/field`) or the ClickUp MCP to find field and option UUIDs.

**Important:** Dropdown option UUIDs must be the **full UUID** (e.g. `7510c0cb-1671-4d26-8b01-737e3750ab26`), not truncated.

### Deploying the Worker

```bash
cd workers/careers-api
npm install
npx wrangler deploy
```

To set secrets:
```bash
npx wrangler secret put CLICKUP_API_KEY
npx wrangler secret put WEBHOOK_SECRET
npx wrangler secret put GITHUB_TOKEN
```

### Writing a New Job Ad

Create a task in the **Roles** list in ClickUp. The task description should use this markdown structure:

```markdown
A short summary paragraph describing the role. This becomes the card preview text on the website.

## The Opportunity

Detailed description of what this role involves and why it's exciting.

## What You'll Be Doing

- Responsibility one
- Responsibility two
- Responsibility three

## What We're Looking For

- Requirement one
- Requirement two
- Requirement three

## Bonus Points

- Nice-to-have one
- Nice-to-have two

## Security Clearance

Details about security clearance requirements, if any.
```

**Section names are flexible** — the parser recognises `##` headings, `**bold**` headings, and bare text matching known names. Legacy names like "Responsibilities" and "Requirements" also work.

**Custom fields to set on the task:**
- **Type** — dropdown: Full-time, Part-time, Contract, etc.
- **Location** — labels field: select one or more cities (Melbourne, Sydney, Perth, Canberra, Brisbane, Adelaide)
- **Closing Date** — date field (optional)

**To publish:** Set the task status to **published**, then trigger the sync webhook or wait for the next scheduled sync.

**To unpublish:** Change the status to anything else (e.g. "closed", "draft") and trigger the sync.

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
