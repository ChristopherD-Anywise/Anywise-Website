# Anywise Blog System

The blog has three moving parts. Understand which one you're touching before editing.

## 1. `blog/posts.json` — the data
An array of post objects. Each post has: `slug`, `title`, `date` (YYYY-MM-DD), `readTime` (int), `category`, `author`, `heroImage` (path like `../assets/images/blog/xxx.jpg`, or omitted), `intro`, and `sections` (array of `{ heading, blocks }`, where blocks are `{type: 'paragraph'|'list'|'quote', ...}`). **Field names matter:** the data uses `date` and `intro` (not `publishDate`/`excerpt`) — the index render script was aligned to these; don't reintroduce the mismatch.

## 2. `scripts/generate-blog-static.js` — the generator
Reads `posts.json` and writes one static `blog/<slug>.html` per post. The generated articles are **full pages with the shared nav + footer + skip-link** (added during the audit) so they're not navigation dead-ends. Each gets a `BlogPosting` JSON-LD (en-AU) and a **per-article `og:image`** (falls back to the generic OG image only when a post has no hero).

**Blog articles are generated, not hand-authored.** To change an article's content, edit `posts.json`; to change the article *layout/chrome/meta*, edit the generator's template string. Then regenerate:
```bash
node scripts/generate-blog-static.js
```
The article body styling (`.post-body`, `.post-section-heading`, `.post-body ul`, `.pullquote`, `.post-hero-img`, etc.) lives in **shared.css** under `/* BLOG POST / ARTICLE */` — so both the generated static pages and the dynamic `post.html` inherit it. Don't duplicate those styles into the generator.

If you add/remove posts, also update `sitemap.xml` (the generator prints a reminder).

## 3. `blog/index.html` — the listing
JS fetches `posts.json`, sorts by `date` (newest first), filters out future-dated posts, and renders `.blog-post-item` cards linking to the **static** `<slug>.html` pages (not the dynamic `post.html?slug=` route). If the list ever renders empty, the usual cause is a field-name mismatch throwing in the sort/map (guarded now with `|| ''`), or `posts.json` failing to load.

## 4. `blog/post.html` — the dynamic fallback
A client-rendered template that reads `?slug=` and renders from posts.json at runtime (with DOMPurify sanitisation, SRI-pinned marked/purify). It's the fallback/preview path; the canonical URLs are the static `<slug>.html` files. It carries its own inline article styles historically, but shared.css is now the source of truth for article styling.

## Gotchas
- Don't point index cards at `post.html?slug=` — use the static `<slug>.html`.
- Don't hand-edit `blog/<slug>.html` — your change will be lost on the next regenerate.
- Keep `posts.json` field names (`date`, `intro`) — the render + generator both depend on them.
