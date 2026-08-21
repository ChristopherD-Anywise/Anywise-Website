#!/usr/bin/env sh
# Cloudflare Pages build — assembles the deployable site into ./public
#
# Replaces the hardcoded `cp` list that used to live in the dashboard build
# command. That list broke whenever a directory was renamed (the /products ->
# /capabilities rename failed the build outright) and silently omitted
# _redirects and _headers, so redirects and security headers never shipped.
#
# This copies everything except source/tooling, so new pages and directories
# are picked up automatically.
#
# Cloudflare dashboard settings:
#   Build command:         sh build.sh
#   Build output directory: public

set -eu

rm -rf public
mkdir -p public

# Everything at the repo root except tooling, docs and build artefacts.
# Dotfiles are handled separately below so _headers/_redirects are never missed.
for item in *; do
  case "$item" in
    public|build.sh|node_modules|scripts|docs|tasks|template|screenshots|\
    site-builder-skill|workers|worker.js|wrangler.toml|README.md|\
    anywise_style_guide.json|*.md|\
    mobile-*.png|engage-fixed-*.png|engage-modal-*.png|engage-scrolled-*.png)
      continue ;;
  esac
  cp -R "$item" public/
done

# Pages control files — these MUST ship or redirects and headers are inert.
for f in _headers _redirects; do
  [ -f "$f" ] && cp "$f" public/
done

echo "Build complete. public/ contains:"
ls -1 public
