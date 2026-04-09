# B Corp Policy Pages -- Design Spec

**Date:** 10 April 2026
**Ticket:** ANYHQ-7164
**Status:** Pending director review before deploy

---

## Overview

Add three B Corp policy document pages to the Anywise website, following the existing `terms.html` template pattern. Update the footer across all site pages to link to them.

## Scope

- 3 new HTML pages (root-level, alongside `terms.html` and `privacy.html`)
- Footer update across all 18 existing HTML files
- Verbatim content from source documents (no editing)
- NOT in scope: Philanthropy page linkage (deferred), content editing, director review process

## Source Documents

1. **ANY-POL-009** -- Grievance/Complaints Mechanism Policy (PDF attachment on ANYHQ-7164)
2. **ANY-POL-010** -- Anywise Whistleblowing Policy (PDF attachment on ANYHQ-7164)
3. **Defence Industry Disclosure Statement** (ClickUp comment on ANYHQ-7164)

## Page Specifications

### Page 1: `grievance-policy.html`

- **Title tag:** Grievance Mechanism Policy | Anywise
- **Meta description:** Anywise's grievance mechanism policy. How stakeholders can raise and resolve concerns regarding the company, its operations, or conduct.
- **Hero label:** Policy
- **Hero h1:** Grievance Mechanism Policy
- **Hero description:** How Anywise stakeholders can raise and resolve concerns regarding the company, its operations, or conduct.
- **Canonical:** https://anywise.com.au/grievance-policy.html
- **Content sections (h2, numbered):**
  1. Policy Brief and Purpose
  2. Scope
  3. Core Principles
  4. Communication and Feedback Channels
  5. Grounds for Accepting a Grievance
  6. Grievance Process Steps and Targeted Deadlines
  7. Appeals
  8. Record Keeping
- **Content format:** Paragraphs and bullet lists, verbatim from PDF

### Page 2: `whistleblower-policy.html`

- **Title tag:** Whistleblower Policy | Anywise
- **Meta description:** Anywise's whistleblower policy under the Corporations Act 2001. Who is protected, what can be reported, how to report, and legal protections.
- **Hero label:** Policy
- **Hero h1:** Whistleblower Policy
- **Hero description:** Anywise's whistleblower protections under the Corporations Act 2001, including how to report concerns and non-retaliation commitments.
- **Canonical:** https://anywise.com.au/whistleblower-policy.html
- **Content sections (h2, numbered):**
  1. Policy Brief and Purpose
  2. Scope
  3. Be Safe
  4. Comply with the Law
  5. Specific Considerations
  6. Handling Revelations from a Whistleblower
  7. Procedures for Anywise
- **Section 7 sub-sections (h3):**
  - 7a. Notices
  - 7b. Non-Retaliation and Consequences
  - 7c. Mechanisms for Whistleblower Protection
  - 7d. Communication and Outcome Notification
- **Content format:** Paragraphs and bullet lists, verbatim from PDF

### Page 3: `weapons-exclusion.html`

- **Title tag:** Defence Industry Disclosure | Anywise
- **Meta description:** Anywise's position on defence industry work, ethical screening, weapons exclusion, and due diligence practices.
- **Hero label:** Policy
- **Hero h1:** Defence Industry Disclosure
- **Hero description:** Anywise's position on defence industry work, ethical screening, and weapons exclusion.
- **Canonical:** https://anywise.com.au/weapons-exclusion.html
- **Content sections (h2, numbered):**
  1. About Anywise
  2. Weapons Exclusion Stance
  3. Types of Defence Work
  4. Policies and Practices
- **Section 4 sub-sections (h3):**
  - Suppliers
  - Projects
  - Clients
- **Content format:** Paragraphs and bullet lists, verbatim from ClickUp comment

## Template Pattern

All three pages clone the exact structure from `terms.html`:

### HTML structure
```
<!DOCTYPE html>
<html lang="en">
<head>
  [meta tags -- title, description, OG, Twitter, canonical]
  [favicons]
  [theme-color: #0e110e]
  [font imports: General Sans, JetBrains Mono]
  [shared.css]
  <style> [inline page styles -- identical to terms.html] </style>
</head>
<body>
  [skip link]
  [nav -- identical to terms.html]
  <main id="main-content">
    <div class="page-wrap">
      <div class="page-hero">
        [breadcrumb: Home / Page Name]
        [label: Policy]
        [h1]
        [description paragraph]
      </div>
      <div class="page-content">
        [page-updated date]
        [numbered h2 sections with paragraphs and lists]
      </div>
    </div>
  </main>
  [footer -- with new links added]
  [scroll-to-top button]
  [shared.js]
</body>
</html>
```

### Additional CSS (for pages with sub-sections)
```css
.page-content h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 2rem 0 0.75rem;
}
```

This `h3` style is added to the inline `<style>` block on `whistleblower-policy.html` and `weapons-exclusion.html` only.

## Footer Update

### Change
Add 3 links to the Company column, after the existing "Terms of Use" link:

**Root-level pages** (index.html, terms.html, privacy.html, contact.html, + new pages):
```html
<a href="grievance-policy.html">Grievance Policy</a>
<a href="whistleblower-policy.html">Whistleblower Policy</a>
<a href="weapons-exclusion.html">Defence Disclosure</a>
```

**Subdirectory pages** (products/, blog/, engage/):
```html
<a href="../grievance-policy.html">Grievance Policy</a>
<a href="../whistleblower-policy.html">Whistleblower Policy</a>
<a href="../weapons-exclusion.html">Defence Disclosure</a>
```

### Files to update (18 total)
**Root (4):** index.html, privacy.html, contact.html, terms.html
**Products (8):** products/index.html, products/wisdom.html, products/engaide.html, products/fraud-analytics.html, products/impact-framework.html, products/fabhums.html, products/campaide.html, products/ils.html, products/aide.html
**Blog (2):** blog/index.html
**Duplicates/backups (4):** engage/index 2.html, blog/post 2.html, blog/index 2.html, products/index 2.html

Note: The "2" files appear to be duplicates/backups. Update them for consistency but flag for cleanup.

## Director Review Gate

Per ANYHQ-7164: all three documents must be reviewed and approved by a director before being committed/deployed. Implementation creates the pages on a feature branch. Deploy only after director sign-off.

## Acceptance Criteria

- [ ] All three pages live on the site with verbatim policy content
- [ ] Pages follow identical formatting to terms.html
- [ ] Footer updated on all pages with links to the three new policies
- [ ] Subdirectory pages use correct relative paths (../)
- [ ] Meta tags (OG, Twitter, canonical) set correctly for each page
- [ ] Dark/light mode works correctly on all new pages
- [ ] Mobile responsive layout works correctly
- [ ] Director review completed before deploy
