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
