# SEO Urgent Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 6 critical SEO issues on anywise.com.au that are currently preventing Google from indexing blog posts and establishing the site's entity identity.

**Architecture:** Static HTML site (no build tool) deployed via Cloudflare Pages from the repo root. Files are served directly — `index.html`, `blog/post.html`, `products/wisdom.html`, etc. No framework, no bundler. The blog uses a single `post.html` template that fetches `posts.json` at runtime and renders content via JavaScript. This is the core SEO problem for C1. All changes are pure HTML/JS/file additions — no build step required unless a static blog generator is added. The Cloudflare Worker (`worker.js`) handles form submission only — it does not serve or transform pages.

**Tech Stack:** Vanilla HTML/CSS/JS, Cloudflare Pages (static hosting), `posts.json` as the blog CMS, `wrangler` for deployment. Node.js available for the static blog generator script.

---

## Codebase Map

```
/                          ← site root (served as https://anywise.com.au/)
├── index.html             ← homepage — MODIFY: canonical, og:url fix, Organization+WebSite schema
├── robots.txt             ← DOES NOT EXIST — CREATE
├── sitemap.xml            ← DOES NOT EXIST — CREATE
├── llms.txt               ← DOES NOT EXIST — CREATE (H2, not in this plan)
├── shared.css             ← shared styles — DO NOT TOUCH
├── shared.js              ← shared JS (nav, engage modal) — DO NOT TOUCH
├── blog/
│   ├── posts.json         ← blog CMS data — READ ONLY (source for generator)
│   ├── index.html         ← blog listing — MODIFY: canonical, meta description update
│   ├── post.html          ← single post template — MODIFY: canonical (dynamic), BlogPosting schema injection
│   └── [slug].html        ← DOES NOT EXIST — CREATE 4 static files via generator script
├── products/
│   ├── index.html         ← products listing — MODIFY: canonical
│   ├── wisdom.html        ← MODIFY: canonical, SoftwareApplication+BreadcrumbList schema
│   ├── engaide.html       ← MODIFY: canonical, schema
│   ├── fabhums.html       ← MODIFY: canonical, schema
│   ├── campaide.html      ← MODIFY: canonical, schema
│   ├── ils.html           ← MODIFY: canonical, schema
│   ├── fraud-analytics.html ← MODIFY: canonical, schema
│   ├── impact-framework.html ← MODIFY: canonical, schema
│   └── aide.html          ← MODIFY: canonical, schema
└── scripts/
    └── generate-blog-static.js  ← CREATE: Node.js script that reads posts.json, outputs static HTML files
```

---

## Task 1: Fix `og:url` on homepage + add canonical to all pages

**What:** The homepage `og:url` points to `https://www.anywise.com.au` (www) but the canonical domain is `https://anywise.com.au` (non-www). Also, zero pages have `<link rel="canonical">`. Fix both.

**Why this matters:** Without canonicals, Google may index both www and non-www versions as separate pages, splitting link equity. The wrong og:url in sharing metadata reinforces this confusion.

**Files:**
- Modify: `index.html` — fix og:url + add canonical
- Modify: `blog/index.html` — add canonical
- Modify: `blog/post.html` — add dynamic canonical (set via JS alongside renderPost)
- Modify: `products/index.html` — add canonical
- Modify: `products/wisdom.html` — add canonical
- Modify: `products/engaide.html` — add canonical
- Modify: `products/fabhums.html` — add canonical
- Modify: `products/campaide.html` — add canonical
- Modify: `products/ils.html` — add canonical
- Modify: `products/fraud-analytics.html` — add canonical
- Modify: `products/impact-framework.html` — add canonical
- Modify: `products/aide.html` — add canonical

**No test file** — verify manually by opening each file and checking `<head>`.

- [ ] **Step 1: Fix `index.html` — og:url and canonical**

  Find this line in `index.html` (currently around line 24):
  ```html
  <meta property="og:url" content="https://www.anywise.com.au">
  ```
  Change it to:
  ```html
  <meta property="og:url" content="https://anywise.com.au/">
  ```

  Then directly below the `<meta name="theme-color">` line (around line 13), add:
  ```html
  <link rel="canonical" href="https://anywise.com.au/">
  ```

- [ ] **Step 2: Add canonical to `blog/index.html`**

  Find the `<meta name="theme-color">` line in `blog/index.html` and add directly below it:
  ```html
  <link rel="canonical" href="https://anywise.com.au/blog/">
  ```

- [ ] **Step 3: Add dynamic canonical to `blog/post.html`**

  The blog post page renders content dynamically from `posts.json`. The canonical must reflect the actual slug. Find the `renderPost` function in `blog/post.html` (around line 407). At the very start of `renderPost`, before updating `document.title`, add:

  ```javascript
  function renderPost(post, allPosts) {
    /* Canonical URL — set dynamically to match the post slug */
    var canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = 'https://anywise.com.au/blog/post.html?slug=' + encodeURIComponent(post.slug);

    /* Update page title */
    document.title = escapeHtml(post.title) + ' | Anywise';
    // ... rest of function unchanged
  ```

  Note: Do NOT add a static `<link rel="canonical">` to the `<head>` of `post.html` — it would always point to the wrong slug. The JS injection above is the correct approach.

- [ ] **Step 4: Add canonical to all 9 product/static pages**

  For each file below, find the `<meta name="theme-color">` line and insert the canonical directly below it:

  | File | Canonical href |
  |------|---------------|
  | `products/index.html` | `https://anywise.com.au/products/` |
  | `products/wisdom.html` | `https://anywise.com.au/products/wisdom.html` |
  | `products/engaide.html` | `https://anywise.com.au/products/engaide.html` |
  | `products/fabhums.html` | `https://anywise.com.au/products/fabhums.html` |
  | `products/campaide.html` | `https://anywise.com.au/products/campaide.html` |
  | `products/ils.html` | `https://anywise.com.au/products/ils.html` |
  | `products/fraud-analytics.html` | `https://anywise.com.au/products/fraud-analytics.html` |
  | `products/impact-framework.html` | `https://anywise.com.au/products/impact-framework.html` |
  | `products/aide.html` | `https://anywise.com.au/products/aide.html` |

  Add this line pattern to each (adjust href per table above):
  ```html
  <link rel="canonical" href="https://anywise.com.au/products/wisdom.html">
  ```

- [ ] **Step 5: Verify**

  Run in repo root:
  ```bash
  grep -r 'rel="canonical"' . --include="*.html" | grep -v " 2.html"
  ```
  Expected output — 12 lines (index, blog/index, blog/post, products/index, 8 product pages):
  ```
  ./index.html:<link rel="canonical" href="https://anywise.com.au/">
  ./blog/index.html:<link rel="canonical" href="https://anywise.com.au/blog/">
  ./blog/post.html:      canonicalEl.href = 'https://anywise.com.au/blog/post.html?slug=...
  ./products/index.html:<link rel="canonical" href="https://anywise.com.au/products/">
  ./products/wisdom.html:<link rel="canonical" href="https://anywise.com.au/products/wisdom.html">
  ... (8 product pages)
  ```

  Also verify the og:url fix:
  ```bash
  grep 'og:url' index.html
  ```
  Expected:
  ```
  <meta property="og:url" content="https://anywise.com.au/">
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add index.html blog/index.html blog/post.html products/index.html \
    products/wisdom.html products/engaide.html products/fabhums.html \
    products/campaide.html products/ils.html products/fraud-analytics.html \
    products/impact-framework.html products/aide.html
  git commit -m "seo: add canonical tags to all pages, fix homepage og:url"
  ```

---

## Task 2: Create `sitemap.xml` and `robots.txt`

**What:** The site has no `sitemap.xml` (returns 404) and no `robots.txt` (also 404 — misconfigured server returns 404 status while serving a body). Create both files at the repo root.

**Why this matters:** Without a sitemap, Google discovers pages by crawling links only. Without a valid robots.txt, crawlers may behave unpredictably.

**Files:**
- Create: `sitemap.xml`
- Create: `robots.txt`

- [ ] **Step 1: Create `sitemap.xml`**

  Create file at repo root `/Users/chrisdennis/Documents/GitHub/Anywise-Website/sitemap.xml`:

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://anywise.com.au/</loc>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/</loc>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/wisdom.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/engaide.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/fabhums.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/campaide.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/ils.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/fraud-analytics.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/impact-framework.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/products/aide.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/blog/</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <!-- Blog post static URLs added in Task 3 after static files are generated -->
  </urlset>
  ```

- [ ] **Step 2: Create `robots.txt`**

  Create file at repo root `/Users/chrisdennis/Documents/GitHub/Anywise-Website/robots.txt`:

  ```
  # As a condition of accessing this website, you agree to abide by the following content signals:
  # Content-Signal: search=yes,ai-train=no

  User-agent: *
  Content-Signal: search=yes,ai-train=no
  Allow: /

  # === TRAINING DATA CRAWLERS — blocked ===
  User-agent: CCBot
  Disallow: /

  User-agent: Bytespider
  Disallow: /

  User-agent: Amazonbot
  Disallow: /

  User-agent: Applebot-Extended
  Disallow: /

  # === AI SEARCH CRAWLERS — allowed (answer live user queries) ===
  # These crawlers fetch pages in real-time to answer user questions.
  # They do NOT build training datasets. Blocking them makes Anywise
  # invisible in ChatGPT, Google AI Overviews, Perplexity, and Claude.

  User-agent: GPTBot
  Allow: /

  User-agent: OAI-SearchBot
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: Google-Extended
  Allow: /

  User-agent: meta-externalagent
  Allow: /

  Sitemap: https://anywise.com.au/sitemap.xml
  ```

- [ ] **Step 3: Verify both files**

  ```bash
  # Confirm sitemap is valid XML
  python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml'); print('sitemap.xml: valid XML')"

  # Confirm robots.txt exists and has the Sitemap directive
  grep "Sitemap:" robots.txt
  ```

  Expected:
  ```
  sitemap.xml: valid XML
  Sitemap: https://anywise.com.au/sitemap.xml
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add sitemap.xml robots.txt
  git commit -m "seo: add sitemap.xml and robots.txt with AI crawler policy"
  ```

---

## Task 3: Generate static HTML files for blog posts (C1)

**What:** Currently `blog/post.html` fetches `posts.json` at runtime and renders content via JavaScript. Google sees only `<title>Loading… | Anywise</title>` and an empty meta description. Create a Node.js script that reads `posts.json` and generates one static HTML file per post (e.g. `blog/transforming-operational-challenges.html`). These static files serve full content to crawlers without JavaScript execution.

**Why this matters:** All 4 blog posts are currently invisible to Google. This is the highest-impact fix in the plan — it immediately makes 4 pages indexable with unique titles, descriptions, and content.

**Architecture decision:** The static files share the same visual design as `post.html`. The generator script reads the existing `post.html` as a template and replaces the dynamic `<head>` and inlines the content. The original `post.html?slug=X` URLs continue to work for existing links. New static URLs (`blog/[slug].html`) are added to the sitemap.

**Files:**
- Create: `scripts/generate-blog-static.js`
- Create (generated): `blog/transforming-operational-challenges.html`
- Create (generated): `blog/dcsp-catalyst-for-real-change.html`
- Create (generated): `blog/vicworx-preparing-for-lift-off.html`
- Create (generated): `blog/commitment-to-ethical-quality-business.html`
- Modify: `sitemap.xml` — add 4 blog post URLs

- [ ] **Step 1: Create the generator script**

  Create `scripts/generate-blog-static.js`:

  ```javascript
  #!/usr/bin/env node
  /**
   * generate-blog-static.js
   *
   * Reads blog/posts.json and generates a static HTML file for each post at
   * blog/[slug].html. Each file has correct <title>, <meta description>,
   * <link rel="canonical">, and full article content inlined — no JS required
   * for the core content to render.
   *
   * Run from repo root: node scripts/generate-blog-static.js
   */

  const fs = require('fs');
  const path = require('path');

  const posts = JSON.parse(fs.readFileSync('blog/posts.json', 'utf8'));

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function renderBlock(block) {
    if (block.type === 'paragraph') {
      return `<p>${escapeHtml(block.content)}</p>`;
    }
    if (block.type === 'pullquote') {
      return `<blockquote class="post-pullquote"><p>${escapeHtml(block.content)}</p></blockquote>`;
    }
    if (block.type === 'list') {
      const items = block.items.map(i => `<li>${escapeHtml(i)}</li>`).join('\n      ');
      return `<ul>\n      ${items}\n    </ul>`;
    }
    return '';
  }

  function generateHtml(post) {
    const canonicalUrl = `https://anywise.com.au/blog/${post.slug}.html`;
    const heroImg = post.heroImage
      ? `<img src="${escapeHtml(post.heroImage)}" alt="${escapeHtml(post.title)}" class="post-hero-img" width="1200" height="480">`
      : `<div class="post-hero-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>`;

    const sectionsHtml = post.sections.map(section => {
      const blocksHtml = section.blocks.map(renderBlock).join('\n    ');
      return `<h2 class="post-section-heading">${escapeHtml(section.heading)}</h2>\n    ${blocksHtml}`;
    }).join('\n\n    ');

    // BlogPosting schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.intro,
      "url": canonicalUrl,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Organization",
        "@id": "https://anywise.com.au/#organization",
        "name": "Anywise"
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://anywise.com.au/#organization",
        "name": "Anywise",
        "logo": { "@type": "ImageObject", "url": "https://anywise.com.au/assets/Anywise_Logo.png" }
      },
      "inLanguage": "en-AU",
      "isPartOf": {
        "@type": "Blog",
        "name": "any.news",
        "url": "https://anywise.com.au/blog/",
        "publisher": { "@id": "https://anywise.com.au/#organization" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
    };

    if (post.heroImage) {
      schema.image = { "@type": "ImageObject", "url": `https://anywise.com.au/${post.heroImage.replace('../', '')}` };
    }

    return `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.title)} | Anywise</title>
  <meta name="description" content="${escapeHtml(post.intro.slice(0, 155))}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(post.title)} | Anywise">
  <meta property="og:description" content="${escapeHtml(post.intro.slice(0, 155))}">
  <meta property="og:image" content="https://anywise.com.au/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:url" content="${canonicalUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(post.title)} | Anywise">
  <meta name="twitter:description" content="${escapeHtml(post.intro.slice(0, 155))}">
  <meta name="twitter:image" content="https://anywise.com.au/og-image.png">
  <link rel="icon" type="image/png" sizes="96x96" href="../favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
  <meta name="theme-color" content="#0e110e">
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../shared.css">
  <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
  </head>
  <body>
  <!-- NOTE: This file is auto-generated by scripts/generate-blog-static.js -->
  <!-- Do not edit manually — edit posts.json and re-run the generator. -->

  <script src="../shared.js" defer></script>

  <main>
    <section class="post-hero">
      <div class="container">
        <div class="breadcrumb">
          <a href="../index.html">Home</a><span>/</span>
          <a href="index.html">Insights</a><span>/</span>
          <span>${escapeHtml(post.title.length > 50 ? post.title.slice(0, 50) + '…' : post.title)}</span>
        </div>
        ${heroImg}
      </div>
    </section>

    <header class="post-header">
      <div class="post-meta-bar">
        <span class="post-cat">${escapeHtml(post.category)}</span>
        <span class="post-meta-sep">·</span>
        <span class="post-date">${formatDate(post.date)}</span>
        <span class="post-meta-sep">·</span>
        <span class="post-author">${escapeHtml(post.author)}</span>
        <span class="post-meta-sep">·</span>
        <span class="post-read">${post.readTime} min read</span>
      </div>
      <h1>${escapeHtml(post.title)}</h1>
      <p style="color:var(--text-secondary);line-height:1.7;font-size:1.05rem;margin-top:0.5rem">${escapeHtml(post.intro)}</p>
    </header>

    <article class="post-body">
      ${sectionsHtml}
    </article>
  </main>

  </body>
  </html>
  `;
  }

  // Generate one file per post
  posts.forEach(post => {
    const html = generateHtml(post);
    const outPath = path.join('blog', `${post.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`Generated: ${outPath}`);
  });

  console.log(`\nDone — ${posts.length} files generated.`);
  console.log('Next: add blog post URLs to sitemap.xml');
  ```

- [ ] **Step 2: Run the generator**

  ```bash
  node scripts/generate-blog-static.js
  ```

  Expected output:
  ```
  Generated: blog/transforming-operational-challenges.html
  Generated: blog/dcsp-catalyst-for-real-change.html
  Generated: blog/vicworx-preparing-for-lift-off.html
  Generated: blog/commitment-to-ethical-quality-business.html

  Done — 4 files generated.
  Next: add blog post URLs to sitemap.xml
  ```

- [ ] **Step 3: Verify generated files have correct content**

  ```bash
  # Check title is correct (not "Loading…")
  grep "<title>" blog/transforming-operational-challenges.html

  # Check canonical is set
  grep "canonical" blog/transforming-operational-challenges.html

  # Check description is populated
  grep 'meta name="description"' blog/transforming-operational-challenges.html

  # Check schema is present
  grep 'application/ld+json' blog/transforming-operational-challenges.html
  ```

  Expected (example values):
  ```
  <title>Transforming Operational Challenges into Dual-Use Intelligence Solutions in Engineering | Anywise</title>
  <link rel="canonical" href="https://anywise.com.au/blog/transforming-operational-challenges.html">
  <meta name="description" content="Engineering environments in defence and government present a unique set...">
  <script type="application/ld+json">
  ```

- [ ] **Step 4: Add blog post URLs to `sitemap.xml`**

  In `sitemap.xml`, replace the comment `<!-- Blog post static URLs added in Task 3 after static files are generated -->` with:

  ```xml
    <url>
      <loc>https://anywise.com.au/blog/transforming-operational-challenges.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/blog/dcsp-catalyst-for-real-change.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/blog/vicworx-preparing-for-lift-off.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://anywise.com.au/blog/commitment-to-ethical-quality-business.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
  ```

- [ ] **Step 5: Verify sitemap is still valid XML**

  ```bash
  python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml'); print('valid')"
  ```
  Expected: `valid`

- [ ] **Step 6: Commit**

  ```bash
  git add scripts/generate-blog-static.js \
    blog/transforming-operational-challenges.html \
    blog/dcsp-catalyst-for-real-change.html \
    blog/vicworx-preparing-for-lift-off.html \
    blog/commitment-to-ethical-quality-business.html \
    sitemap.xml
  git commit -m "seo: generate static HTML for all 4 blog posts, update sitemap"
  ```

---

## Task 4: Add Organization + WebSite schema to homepage (C4)

**What:** Add two JSON-LD schema blocks to `index.html`: `Organization` (entity identity for Anywise) and `WebSite` (sitewide metadata). No other pages need these — this is a homepage-only change.

**Why this matters:** Structured data is how Google builds its Knowledge Graph. Without an `Organization` schema, Anywise has no entity identity in search. This is required for Knowledge Panel eligibility and for AI platforms (ChatGPT, Perplexity, Claude) to reliably identify who Anywise is.

**Files:**
- Modify: `index.html` — add `<script type="application/ld+json">` block to `<head>`

- [ ] **Step 1: Add Organization + WebSite schema to `index.html`**

  Find the closing `</head>` tag in `index.html` and insert the following block directly before it:

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://anywise.com.au/#organization",
      "name": "Anywise",
      "legalName": "Anywise Pty Ltd",
      "url": "https://anywise.com.au",
      "logo": {
        "@type": "ImageObject",
        "url": "https://anywise.com.au/assets/Anywise_Logo.png"
      },
      "image": "https://anywise.com.au/og-image.png",
      "description": "Decision augmentation for defence and government. Anywise delivers intelligent technology and agile services. Wholly Australian-owned, B Corp certified.",
      "foundingCountry": "AU",
      "areaServed": "AU",
      "taxID": "86 169 092 960",
      "sameAs": [
        "https://www.linkedin.com/company/anywise",
        "https://www.bcorporation.net/en-us/find-a-b-corp/company/anywise"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://anywise.com.au/#website",
      "url": "https://anywise.com.au",
      "name": "Anywise",
      "description": "Ethical technology and services for Australian defence and government.",
      "publisher": {
        "@id": "https://anywise.com.au/#organization"
      }
    }
  ]
  </script>
  ```

- [ ] **Step 2: Verify schema is valid JSON**

  ```bash
  # Extract the JSON from the script tag and validate it
  python3 -c "
  import re, json
  html = open('index.html').read()
  m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
  data = json.loads(m.group(1))
  print('Schema types:', [d['@type'] for d in data])
  print('Valid JSON-LD: OK')
  "
  ```

  Expected:
  ```
  Schema types: ['Organization', 'WebSite']
  Valid JSON-LD: OK
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "seo: add Organization and WebSite JSON-LD schema to homepage"
  ```

---

## Task 5: Add SoftwareApplication schema to all 8 product pages (C5)

**What:** Add `SoftwareApplication` + `BreadcrumbList` JSON-LD schema to each of the 8 product pages. Each schema is unique to the product.

**Why this matters:** Enables software rich results in Google SERP and establishes each product as a named AI entity. Breadcrumbs appear in search results and reduce bounce rate.

**Files:**
- Modify: `products/wisdom.html`
- Modify: `products/engaide.html`
- Modify: `products/fabhums.html`
- Modify: `products/campaide.html`
- Modify: `products/ils.html`
- Modify: `products/fraud-analytics.html`
- Modify: `products/impact-framework.html`
- Modify: `products/aide.html`

For each file, insert the schema block directly before the closing `</head>` tag.

- [ ] **Step 1: Add schema to `products/wisdom.html`**

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "WISDOM",
      "alternateName": "WISDOM Strategic Intelligence Platform",
      "url": "https://anywise.com.au/products/wisdom.html",
      "description": "Sovereign intelligence platform for defence and government decision-makers. Integrates multi-source data into coherent operational pictures with explainable AI reasoning. Supports classified environments and air-gapped deployment.",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Decision Support Software",
      "publisher": { "@id": "https://anywise.com.au/#organization" },
      "offers": { "@type": "Offer", "seller": { "@id": "https://anywise.com.au/#organization" } },
      "audience": { "@type": "Audience", "audienceType": "Defence and Government" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anywise.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Products & Services", "item": "https://anywise.com.au/products/" },
        { "@type": "ListItem", "position": 3, "name": "WISDOM", "item": "https://anywise.com.au/products/wisdom.html" }
      ]
    }
  ]
  </script>
  ```

- [ ] **Step 2: Add schema to `products/engaide.html`**

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ENG|AIDE",
      "alternateName": "ENG|AIDE Engineering Intelligence Platform",
      "url": "https://anywise.com.au/products/engaide.html",
      "description": "Predictive engineering intelligence platform for defence and industrial asset management. Reduces operational risk through continuous monitoring, anomaly detection, and explainable maintenance recommendations.",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Engineering Intelligence Software",
      "publisher": { "@id": "https://anywise.com.au/#organization" },
      "offers": { "@type": "Offer", "seller": { "@id": "https://anywise.com.au/#organization" } },
      "audience": { "@type": "Audience", "audienceType": "Defence and Industrial Engineering" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anywise.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Products & Services", "item": "https://anywise.com.au/products/" },
        { "@type": "ListItem", "position": 3, "name": "ENG|AIDE", "item": "https://anywise.com.au/products/engaide.html" }
      ]
    }
  ]
  </script>
  ```

- [ ] **Step 3: Add schema to `products/fabhums.html`**

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "FABHUMS",
      "alternateName": "FABHUMS Health and Usage Monitoring System",
      "url": "https://anywise.com.au/products/fabhums.html",
      "description": "Continuous health and usage monitoring platform for safety-critical defence assets. Provides real-time structural health data, fatigue tracking, and predictive maintenance insights to extend asset life and enhance safety.",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Health and Usage Monitoring Software",
      "publisher": { "@id": "https://anywise.com.au/#organization" },
      "offers": { "@type": "Offer", "seller": { "@id": "https://anywise.com.au/#organization" } },
      "audience": { "@type": "Audience", "audienceType": "Defence Asset Management" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anywise.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Products & Services", "item": "https://anywise.com.au/products/" },
        { "@type": "ListItem", "position": 3, "name": "FABHUMS", "item": "https://anywise.com.au/products/fabhums.html" }
      ]
    }
  ]
  </script>
  ```

- [ ] **Step 4: Add schema to `products/campaide.html`**

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "CAMP|AIDE",
      "alternateName": "CAMP|AIDE Facilities Intelligence Platform",
      "url": "https://anywise.com.au/products/campaide.html",
      "description": "Intelligent facilities and estate management platform for defence and government. Delivers faster planning, safer outcomes, and reduced overhead across complex multi-site estates.",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Facilities Management Software",
      "publisher": { "@id": "https://anywise.com.au/#organization" },
      "offers": { "@type": "Offer", "seller": { "@id": "https://anywise.com.au/#organization" } },
      "audience": { "@type": "Audience", "audienceType": "Defence and Government Facilities" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anywise.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Products & Services", "item": "https://anywise.com.au/products/" },
        { "@type": "ListItem", "position": 3, "name": "CAMP|AIDE", "item": "https://anywise.com.au/products/campaide.html" }
      ]
    }
  ]
  </script>
  ```

- [ ] **Step 5: Add schema to `products/ils.html`**

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Integrated Logistics Support",
      "alternateName": "ILS and Technical Publications",
      "url": "https://anywise.com.au/products/ils.html",
      "description": "ILS frameworks and WISDOM-powered technical publications for complex defence and industrial systems. Makes complex systems supportable through life with intelligent documentation and logistics analysis.",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Logistics Support Software",
      "publisher": { "@id": "https://anywise.com.au/#organization" },
      "offers": { "@type": "Offer", "seller": { "@id": "https://anywise.com.au/#organization" } },
      "audience": { "@type": "Audience", "audienceType": "Defence Logistics and Sustainment" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anywise.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Products & Services", "item": "https://anywise.com.au/products/" },
        { "@type": "ListItem", "position": 3, "name": "Integrated Logistics Support", "item": "https://anywise.com.au/products/ils.html" }
      ]
    }
  ]
  </script>
  ```

- [ ] **Step 6: Add schema to `products/fraud-analytics.html`**

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Fraud Detection and Compliance Analytics",
      "alternateName": "Anywise Fraud Analytics Platform",
      "url": "https://anywise.com.au/products/fraud-analytics.html",
      "description": "Custom fraud detection and programme integrity analytics for government. Integrates with existing data pipelines to protect programme integrity with 80% faster case screening.",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Fraud Detection Software",
      "publisher": { "@id": "https://anywise.com.au/#organization" },
      "offers": { "@type": "Offer", "seller": { "@id": "https://anywise.com.au/#organization" } },
      "audience": { "@type": "Audience", "audienceType": "Government Programme Management" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anywise.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Products & Services", "item": "https://anywise.com.au/products/" },
        { "@type": "ListItem", "position": 3, "name": "Fraud Detection & Analytics", "item": "https://anywise.com.au/products/fraud-analytics.html" }
      ]
    }
  ]
  </script>
  ```

- [ ] **Step 7: Add schema to `products/impact-framework.html`**

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Impact Measurement Framework",
      "alternateName": "Anywise Impact Measurement and Reporting Platform",
      "url": "https://anywise.com.au/products/impact-framework.html",
      "description": "Standardised data collection and automated reporting dashboards for multi-site government programmes. Improves reporting compliance from 60% to 95% across complex programmes.",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Impact Measurement Software",
      "publisher": { "@id": "https://anywise.com.au/#organization" },
      "offers": { "@type": "Offer", "seller": { "@id": "https://anywise.com.au/#organization" } },
      "audience": { "@type": "Audience", "audienceType": "Government Programme Delivery" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anywise.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Products & Services", "item": "https://anywise.com.au/products/" },
        { "@type": "ListItem", "position": 3, "name": "Impact Measurement Framework", "item": "https://anywise.com.au/products/impact-framework.html" }
      ]
    }
  ]
  </script>
  ```

- [ ] **Step 8: Add schema to `products/aide.html`**

  ```html
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "AIDE",
      "alternateName": "AIDE Enterprise Intelligence Layer",
      "url": "https://anywise.com.au/products/aide.html",
      "description": "Enterprise intelligence layer connecting all Anywise platforms into a single coherent operational view. Gives leaders the visibility to act decisively across every domain.",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Enterprise Intelligence Software",
      "publisher": { "@id": "https://anywise.com.au/#organization" },
      "offers": { "@type": "Offer", "seller": { "@id": "https://anywise.com.au/#organization" } },
      "audience": { "@type": "Audience", "audienceType": "Defence and Government Leadership" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anywise.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Products & Services", "item": "https://anywise.com.au/products/" },
        { "@type": "ListItem", "position": 3, "name": "AIDE", "item": "https://anywise.com.au/products/aide.html" }
      ]
    }
  ]
  </script>
  ```

- [ ] **Step 9: Verify all 8 product pages have schema**

  ```bash
  grep -l 'application/ld+json' products/*.html | grep -v " 2.html"
  ```

  Expected — 8 files listed:
  ```
  products/aide.html
  products/campaide.html
  products/engaide.html
  products/fabhums.html
  products/fraud-analytics.html
  products/ils.html
  products/impact-framework.html
  products/wisdom.html
  ```

  Validate JSON in each:
  ```bash
  for f in products/wisdom.html products/engaide.html products/fabhums.html products/campaide.html products/ils.html products/fraud-analytics.html products/impact-framework.html products/aide.html; do
    python3 -c "
  import re, json
  html = open('$f').read()
  m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
  data = json.loads(m.group(1))
  print('$f: OK —', [d[\"@type\"] for d in data])
  "
  done
  ```

  Expected (8 lines):
  ```
  products/wisdom.html: OK — ['SoftwareApplication', 'BreadcrumbList']
  products/engaide.html: OK — ['SoftwareApplication', 'BreadcrumbList']
  ...
  ```

- [ ] **Step 10: Commit**

  ```bash
  git add products/wisdom.html products/engaide.html products/fabhums.html \
    products/campaide.html products/ils.html products/fraud-analytics.html \
    products/impact-framework.html products/aide.html
  git commit -m "seo: add SoftwareApplication and BreadcrumbList schema to all 8 product pages"
  ```

---

## Task 6: Add BlogPosting schema injection to `blog/post.html` (C6)

**What:** The dynamic `blog/post.html` template already renders content via JS. Add a BlogPosting schema injection at the end of the `renderPost` function so that when a user (or a JS-capable crawler like Googlebot) loads a post, structured data is injected into `<head>`.

**Why:** The static files from Task 3 already include BlogPosting schema. This task adds it to the dynamic template as well, so both access paths (static and dynamic) have structured data. This also future-proofs new posts added to `posts.json` before the generator is re-run.

**Files:**
- Modify: `blog/post.html` — add schema injection at end of `renderPost` function

- [ ] **Step 1: Add BlogPosting schema injection to `renderPost` in `blog/post.html`**

  Find the end of the `renderPost` function in `blog/post.html`. It ends just before the `/* Wire up share buttons */` comment (around line 492). Insert the following block between the `container.innerHTML = ...` assignment and the `/* Wire up share buttons */` comment:

  ```javascript
    /* Inject BlogPosting schema into <head> */
    var schemaData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.intro,
      "url": 'https://anywise.com.au/blog/post.html?slug=' + encodeURIComponent(post.slug),
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Organization",
        "@id": "https://anywise.com.au/#organization",
        "name": "Anywise"
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://anywise.com.au/#organization",
        "name": "Anywise",
        "logo": { "@type": "ImageObject", "url": "https://anywise.com.au/assets/Anywise_Logo.png" }
      },
      "inLanguage": "en-AU",
      "isPartOf": {
        "@type": "Blog",
        "name": "any.news",
        "url": "https://anywise.com.au/blog/",
        "publisher": { "@id": "https://anywise.com.au/#organization" }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": 'https://anywise.com.au/blog/post.html?slug=' + encodeURIComponent(post.slug)
      }
    };
    if (post.heroImage) {
      schemaData.image = {
        "@type": "ImageObject",
        "url": 'https://anywise.com.au/' + post.heroImage.replace('../', '')
      };
    }
    var schemaEl = document.createElement('script');
    schemaEl.type = 'application/ld+json';
    schemaEl.textContent = JSON.stringify(schemaData);
    document.head.appendChild(schemaEl);
  ```

- [ ] **Step 2: Verify the injection is syntactically correct**

  ```bash
  # Check no syntax errors in the JS
  node --check blog/post.html 2>&1 || echo "Note: node --check on HTML is not valid — use browser DevTools or a JS linter"
  
  # Just check the schema block is present
  grep -c 'BlogPosting' blog/post.html
  ```

  Expected: `1` (the schema injection block)

- [ ] **Step 3: Commit**

  ```bash
  git add blog/post.html
  git commit -m "seo: inject BlogPosting JSON-LD schema dynamically in blog post template"
  ```

---

## Final: Push branch and open PR

- [ ] **Step 1: Push branch to origin**

  ```bash
  git push -u origin seo/urgent-fixes
  ```

- [ ] **Step 2: Verify all tasks are complete**

  ```bash
  # Canonical tags — expect 12 lines
  grep -r 'rel="canonical"' . --include="*.html" | grep -v " 2.html" | wc -l

  # sitemap.xml exists and has 15 URLs (11 pages + 4 blog posts)
  grep -c "<loc>" sitemap.xml

  # robots.txt exists
  cat robots.txt | head -3

  # Organization schema in homepage
  grep "@type.*Organization" index.html

  # SoftwareApplication schema in product pages
  grep -l "SoftwareApplication" products/*.html | grep -v " 2.html" | wc -l

  # BlogPosting schema in post template
  grep "BlogPosting" blog/post.html

  # Static blog files exist
  ls blog/*.html | grep -v "index\|post " | grep -v " 2.html"
  ```

  Expected:
  ```
  12
  15
  # As a condition of accessing this website...
  "@type": "Organization",
  8
  schemaData["@type"] = "BlogPosting" (or similar)
  blog/commitment-to-ethical-quality-business.html
  blog/dcsp-catalyst-for-real-change.html
  blog/transforming-operational-challenges.html
  blog/vicworx-preparing-for-lift-off.html
  ```

- [ ] **Step 3: Create PR**

  ```bash
  gh pr create \
    --title "seo: critical SEO fixes — canonicals, sitemap, schema, static blog" \
    --body "Implements all 6 CRITICAL SEO fixes from the anywise.com.au audit (SEO Health Score: 44/100).

  ## Changes
  - **C1** Static HTML generated for all 4 blog posts (were invisible to Google due to JS rendering)
  - **C2** sitemap.xml created with 15 URLs
  - **C3** Canonical link tags added to all pages; og:url fixed on homepage
  - **C4** Organization + WebSite JSON-LD schema added to homepage
  - **C5** SoftwareApplication + BreadcrumbList schema added to all 8 product pages
  - **C6** BlogPosting schema injected dynamically in blog post template
  - **robots.txt** created with AI search crawler policy (GPTBot, ClaudeBot, PerplexityBot, Google-Extended allowed)

  ## Test checklist
  - [ ] Open each static blog post HTML file in browser — content visible without JS
  - [ ] Validate sitemap.xml with https://www.xml-sitemaps.com/validate-xml-sitemap.html
  - [ ] Test schema at https://search.google.com/test/rich-results for homepage and one product page
  - [ ] Check robots.txt at https://anywise.com.au/robots.txt after deploy
  - [ ] Submit sitemap to Google Search Console after merge

  ClickUp tasks: C1 (86d2j0vrh), C2 (86d2j0vrj), C3 (86d2j0vy7), C4 (86d2j0vrw), C5 (86d2j0vt6), C6 (86d2j0vtc)" \
    --base main \
    --head seo/urgent-fixes
  ```

---

## Post-Deploy Actions (manual, after PR merges)

These are not code tasks but must happen after deployment:

1. **Submit sitemap to Google Search Console:** `https://search.google.com/search-console` → Select anywise.com.au property → Sitemaps → Submit `https://anywise.com.au/sitemap.xml`
2. **Request indexing** for the 4 new static blog post URLs via Search Console URL Inspection tool
3. **Validate rich results** at `https://search.google.com/test/rich-results` — test the homepage and `products/wisdom.html`
4. **Update ClickUp tasks** C1–C6 to Done status
