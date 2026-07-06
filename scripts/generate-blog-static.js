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
    // CSS class is 'pullquote' (not 'post-pullquote') — must match shared.css
    return `<blockquote class="pullquote">${escapeHtml(block.content)}</blockquote>`;
  }
  if (block.type === 'list') {
    const items = block.items.map(i => `<li>${escapeHtml(i)}</li>`).join('\n      ');
    return `<ul>\n      ${items}\n    </ul>`;
  }
  return '';
}

function generateHtml(post) {
  const canonicalUrl = `https://anywise.com.au/blog/${post.slug}.html`;
  // Per-article social image (fall back to the generic OG image when no hero)
  const ogImage = post.heroImage
    ? `https://anywise.com.au/${post.heroImage.replace('../', '')}`
    : 'https://anywise.com.au/og-image.png';
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
<meta property="og:image" content="${ogImage}">
<meta property="og:url" content="${canonicalUrl}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(post.title)} | Anywise">
<meta name="twitter:description" content="${escapeHtml(post.intro.slice(0, 155))}">
<meta name="twitter:image" content="${ogImage}">
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

<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- ═══ NAV ═══ -->
<nav id="nav">
  <div class="container">
    <a href="../index.html" class="nav-brand"><img src="../assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../index.html#capabilities">Capabilities</a></li>
      <li><a href="../index.html#approach">Approach</a></li>
      <li><a href="../products/index.html">Products &amp; Services</a></li>
      <li><a href="../innovation.html">Innovation</a></li>
      <li><a href="../index.html#about">About</a></li>
      <li><a href="../blog/index.html" class="active">Insights</a></li>
      <li><a href="../careers.html">Careers</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      <span class="close-x">&times;</span>
    </button>
  </div>
</nav>

<script src="../shared.js" defer></script>

<main id="main-content">
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

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="../index.html" class="nav-brand"><img src="../assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned</p>
        <p class="footer-phone"><a href="tel:1800861893">1800 861 893</a></p>
        <p class="footer-email"><a href="mailto:sales@anywise.com.au">sales@anywise.com.au</a></p>
        <p class="footer-social"><a href="https://www.linkedin.com/company/anywiseaus" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
      <div class="footer-col">
        <h4>Capabilities</h4>
        <a href="../index.html#capabilities">Technology</a>
        <a href="../index.html#capabilities">Services</a>
        <a href="../index.html#approach">Our Approach</a>
      </div>
      <div class="footer-col">
        <h4>Products &amp; Services</h4>
        <a href="../products/wisdom.html">WISDOM</a>
        <a href="../products/engaide.html">ENG|AIDE</a>
        <a href="../products/fraud-analytics.html">Fraud &amp; Analytics</a>
        <a href="../products/impact-framework.html">Impact Measurement</a>
        <a href="../products/fabhums.html">FABHUMS</a>
        <a href="../products/campaide.html">CAMP|AIDE</a>
        <a href="../products/ils.html">ILS</a>
        <a href="../products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="../index.html#about">About</a>
        <a href="../blog/index.html">Insights</a>
        <a href="../careers.html">Careers</a>
        <a href="../grievance-policy.html">Grievance Policy</a>
        <a href="../whistleblower-policy.html">Whistleblower Policy</a>
        <a href="../weapons-exclusion.html">Defence Disclosure</a>
        <a href="../privacy.html">Privacy Policy</a>
        <a href="../terms.html">Terms of Use</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="copyrightYear">2026</span> Anywise Pty Ltd. All rights reserved. ABN 86 169 092 960.</p>
      <div class="footer-locations">
        <span>Melbourne</span>
        <span>Canberra</span>
        <span>Brisbane</span>
      </div>
    </div>
    <div class="acknowledgement">
      Anywise accepts the invitation of the Uluru Statement from the Heart and supports a First Nations Voice to Parliament enshrined in the Australian Constitution.
      <a href="https://ulurustatement.org">UluruStatement.org</a><br>
      Anywise acknowledges the Traditional Owners of the land on which we operate. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>

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
