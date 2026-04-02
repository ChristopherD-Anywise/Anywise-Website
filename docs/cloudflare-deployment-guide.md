# Anywise Website — Cloudflare Deployment & DNS Migration Guide

> **Last updated:** 2 April 2026
> **Domain:** anywise.com.au / www.anywise.com.au
> **Cloudflare project:** anywise-website
> **Worker URL:** anywise-website.christopher-dennis.workers.dev
> **Registrar:** eCompanies (.com.au)

---

## Table of Contents

1. [Background](#background)
2. [Repository Setup](#repository-setup)
3. [Cloudflare Workers & Pages Deployment](#cloudflare-workers--pages-deployment)
4. [Build & Deploy Configuration](#build--deploy-configuration)
5. [DNS Migration to Cloudflare](#dns-migration-to-cloudflare)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Gotchas & Hard-Learned Lessons](#gotchas--hard-learned-lessons)
8. [Open Graph & Social Media](#open-graph--social-media)
9. [Ongoing Maintenance](#ongoing-maintenance)

---

## Background

The Anywise website was originally hosted on Wix (www.anywise.com.au). As part of a full redesign, the site was rebuilt as a static HTML/CSS/JS site and migrated to Cloudflare Workers & Pages for hosting. The domain DNS was migrated from eCompanies to Cloudflare to enable custom domain support, SSL, and caching.

**Previous hosting:** Wix (DNS pointed to `185.230.63.x` A records and `cdn1.wixdns.net` CNAME)
**New hosting:** Cloudflare Workers & Pages (static assets deployment)

---

## Repository Setup

The site is maintained in two GitHub repositories (kept in sync):

| Repository | URL |
|---|---|
| Organisation repo | https://github.com/Anywise-au/Anywise-Website.git (origin) |
| Personal repo | https://github.com/ChristopherD-Anywise/Anywise-Website.git (personal) |

**Push to both:**
```bash
git push origin main && git push personal main
```

---

## Cloudflare Workers & Pages Deployment

The site is deployed to Cloudflare's combined Workers & Pages platform. The Cloudflare project is connected to the GitHub repository and auto-deploys on push to `main`.

### Why Workers & Pages (not just Pages)?

Cloudflare merged Pages into the Workers platform. New projects are created under Workers & Pages in the dashboard. The deployment uses the `wrangler` CLI with the `--assets` flag to serve static files.

---

## Build & Deploy Configuration

### The Problem

Cloudflare's auto-detection sets the assets directory to `.` (the entire repo root). This causes the `.git/objects/pack` file to be included, which exceeds the **25MB per-asset limit** and fails the deployment.

### Solution: Explicit Build & Deploy Commands

**Build command** (configured in Cloudflare dashboard):
```bash
mkdir -p public && cp -r index.html shared.css shared.js favicon-96x96.png favicon-32.png favicon-16.png apple-touch-icon.png og-image.jpg assets products blog engage public/
```

This copies only production files into a `public/` directory, excluding `.git/`, `docs/`, and other non-production files.

> **Note:** `rsync` is NOT available in the Cloudflare build environment. You must use `cp -r`.

**Deploy command:**
```bash
cd public && npx wrangler deploy --assets . --name anywise-website --compatibility-date 2025-09-27
```

### Local Wrangler Config

A `wrangler.jsonc` file exists in the repo for local development:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "anywise-website",
  "compatibility_date": "2025-09-27",
  "assets": {
    "directory": "./public"
  }
}
```

> **Important:** Wrangler auto-generates and overwrites `wrangler.jsonc` in the Cloudflare CI environment, so the committed config is ignored during CI builds. The build/deploy commands in the dashboard are the source of truth.

---

## DNS Migration to Cloudflare

Custom domains on Cloudflare Workers require the domain's DNS to be managed by Cloudflare. You cannot simply add a CNAME at an external registrar — Cloudflare rejects it with *"Only domains active on your Cloudflare account can be added."*

### Step-by-Step Process

#### 1. Add site to Cloudflare

Dashboard > Add a site > enter `anywise.com.au` > select Free plan.

Cloudflare auto-imports existing DNS records from the current nameservers.

#### 2. Review imported DNS records

Carefully review all imported records before proceeding.

#### 3. Delete old hosting records

Remove records pointing to the old Wix hosting:

- **A records** pointing to old Wix IPs (e.g. `185.230.63.x`)
- **CNAME `www`** pointing to `cdn1.wixdns.net`
- **CNAME `m`** pointing to old Wix mobile site (e.g. `www155.wixdns...`)

#### 4. Keep email and Microsoft 365 records

**Do NOT delete these:**

| Type | Records | Purpose |
|---|---|---|
| CNAME | autodiscover, enterpriseenrollment, enterpriseregistration, lyncdiscover | Microsoft 365 auto-configuration |
| CNAME | s1._domainkey, s2._domainkey, selector1, selector2 | DKIM email signing |
| CNAME | sip, _sipfederation, _sip._tls | Teams/Skype federation |
| MX | (various) | Email delivery |
| TXT | (various) | SPF, Google verification, Microsoft verification |

#### 5. Update nameservers at registrar

At eCompanies (.com.au registrar):

1. Log in to domain management
2. Change nameservers to the two Cloudflare nameservers shown on the Cloudflare Overview page
3. Wait for propagation (minutes to ~1 hour)

#### 6. Set up Custom Domains (CRITICAL)

**Use Custom Domains, NOT manual CNAME + Routes.**

1. Delete ALL `www` and `@` DNS records (A, AAAA, CNAME) for the domain
2. Delete ALL worker routes for the domain
3. Go to **Workers & Pages > anywise-website > Settings > Domains & Routes > Add > Custom Domain**
4. Enter `anywise.com.au` — Cloudflare auto-creates the DNS record
5. Add second Custom Domain: `www.anywise.com.au`

Custom Domains handle DNS + routing + SSL all in one step.

---

## Custom Domain Setup

### Why Cloudflare DNS is Required

Workers custom domains need Cloudflare's proxy to terminate SSL and route traffic. An external CNAME alone won't work — you'd get certificate errors since Cloudflare can't issue an SSL cert for a domain it doesn't manage.

### Final Domain Configuration

| Domain | Type | Target |
|---|---|---|
| `anywise.com.au` | Custom Domain (auto-managed) | anywise-website worker |
| `www.anywise.com.au` | Custom Domain (auto-managed) | anywise-website worker |

Both configured via Workers & Pages > Settings > Domains & Routes.

---

## Gotchas & Hard-Learned Lessons

### Deployment Gotchas

1. **`rsync` is NOT available** in the Cloudflare build environment — use `cp -r` instead
2. **Don't rely on committed `wrangler.jsonc`** — Wrangler overwrites it with auto-detected settings in CI
3. **Must `cd public` before deploying** so Wrangler only sees production files, not `.git/`
4. **Must pass `--name` and `--compatibility-date` as CLI flags** when running from a directory without wrangler config
5. **No separate "build output directory" field** in the new combined Workers & Pages UI — it's controlled by the `--assets` flag

### DNS / Custom Domain Gotchas

These were discovered through trial and error during the migration:

| What NOT to do | What happens |
|---|---|
| Manually create CNAME records pointing to `<project>.workers.dev` | **522 errors** — Cloudflare tries to connect to an "origin server" instead of routing to the worker |
| Use dummy A records (`192.0.2.1`) | **1016 "Origin DNS error"** |
| Use worker Routes (`*.anywise.com.au/*`) with manual DNS records | Route + CNAME combination conflicts — produces 522/1016 errors |
| Add a Custom Domain while manual CNAME/A records exist for that name | Cloudflare rejects with *"DNS record could not be added"* |

### The Only Approach That Works

**Delete all DNS records for the domain first, then use Custom Domains which auto-create everything.**

---

## Open Graph & Social Media

### OG Image Configuration

- **Image:** `og-image.png` (1200x630 PNG format)
- **Location:** Repository root, copied to `public/` during build
- **URL:** `https://anywise.com.au/og-image.png`

> **Note:** Use the root domain URL (`anywise.com.au`), not `www.anywise.com.au`, as `www` redirects to root. Facebook's crawler follows redirects but may cache incorrectly.

> **Note:** The OG image was converted from JPEG to PNG because Facebook's scraper rejected the JPEG as corrupted.

### Meta Tags

All pages include Open Graph and Twitter Card meta tags:

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Page Title | Anywise">
<meta property="og:description" content="Page description...">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title | Anywise">
<meta name="twitter:description" content="Page description...">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
```

---

## Ongoing Maintenance

### Adding New Files to Deployment

When adding new top-level files or directories, update the **build command** in Cloudflare dashboard to include them in the `cp -r` list.

Current build command copies:
- `index.html`, `shared.css`, `shared.js`
- Favicons: `favicon-96x96.png`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`
- `og-image.jpg`
- Directories: `assets/`, `products/`, `blog/`, `engage/`

### Pushing Changes

```bash
# Push to both repositories
git push origin main && git push personal main
```

Cloudflare auto-deploys from the connected GitHub repository on push to `main`.

### Checking Deployment Status

- Cloudflare Dashboard > Workers & Pages > anywise-website > Deployments
- Worker URL: https://anywise-website.christopher-dennis.workers.dev
- Live site: https://anywise.com.au

### Australian English

All site content uses Australian English spelling (e.g. standardised, authorised, organisations, colour, centre). Check for American variants when adding new content.
