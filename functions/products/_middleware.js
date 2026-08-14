/**
 * Cloudflare Pages Function: /products/*  ->  /capabilities/*  (301)
 *
 * The section was renamed when Products & Services became Capabilities. The
 * platform pages (WISDOM, FABHUMS, ENG|AIDE and the rest) were indexed at the
 * old paths, so these permanent redirects preserve their search ranking and
 * keep external links and bookmarks working.
 *
 * This is a Function rather than a _redirects rule because Pages serves clean,
 * extensionless URLs — an inbound /products/wisdom.html is normalised to
 * /products/wisdom, which the explicit .html rules never matched. Matching here
 * covers both forms and any future page added under the old path.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);

  // /products, /products/, /products/anything(.html)
  const rest = url.pathname.replace(/^\/products\/?/, '');
  url.pathname = '/capabilities/' + rest;

  return Response.redirect(url.toString(), 301);
}
