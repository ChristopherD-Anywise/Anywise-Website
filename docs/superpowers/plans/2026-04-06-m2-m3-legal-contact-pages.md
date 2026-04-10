# M2 + M3: Legal Pages and Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create Privacy Policy, Terms of Use, and Contact pages that are indexable, match the site design, and link from the footer of all pages.

**Architecture:** Static HTML pages at the root level (`/privacy.html`, `/terms.html`, `/contact.html`). Each page follows the exact same structure as `blog/index.html` — inline `<nav>`, manual footer HTML, `shared.js` at the bottom. No framework, no build step. All three files reference `shared.css` from root. Footer on every existing page is updated to link to privacy, terms, and contact pages.

**Tech Stack:** Vanilla HTML/CSS, `shared.css` design system, `shared.js` (engage modal + mobile nav + theme toggle), no JavaScript beyond shared.js.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `privacy.html` | Privacy Policy page |
| Create | `terms.html` | Terms of Use page |
| Create | `contact.html` | Contact page with office locations and indexed alternative to modal |
| Modify | `index.html` | Add footer links to Privacy, Terms, Contact |
| Modify | `products/index.html` | Add footer links to Privacy, Terms, Contact |
| Modify | `products/wisdom.html` | Add footer links |
| Modify | `products/engaide.html` | Add footer links |
| Modify | `products/fraud-analytics.html` | Add footer links |
| Modify | `products/impact-framework.html` | Add footer links |
| Modify | `products/fabhums.html` | Add footer links |
| Modify | `products/campaide.html` | Add footer links |
| Modify | `products/ils.html` | Add footer links |
| Modify | `products/aide.html` | Add footer links |
| Modify | `blog/index.html` | Add footer links |
| Modify | `sitemap.xml` | Add 3 new URLs |
| Modify | `README.md` | Update Cloudflare build command to include new pages |

---

## Design Reference

All new pages must use these exact patterns copied from `blog/index.html` and `products/wisdom.html`:

**`<head>` block:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PAGE TITLE | Anywise</title>
<meta name="description" content="PAGE DESCRIPTION">
<meta property="og:type" content="website">
<meta property="og:title" content="PAGE TITLE | Anywise">
<meta property="og:description" content="PAGE DESCRIPTION">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/PAGE.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="PAGE TITLE | Anywise">
<meta name="twitter:description" content="PAGE DESCRIPTION">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/PAGE.html">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared.css">
```

**`<nav>` block (root-relative paths):**
```html
<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#capabilities">Capabilities</a></li>
      <li><a href="index.html#approach">Approach</a></li>
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="index.html#about">About</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      <span class="close-x">&times;</span>
    </button>
  </div>
</nav>
```

**Footer block (root-relative, with Privacy/Terms/Contact links added to Company column):**
```html
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned</p>
      </div>
      <div class="footer-col">
        <h4>Capabilities</h4>
        <a href="index.html#capabilities">Technology</a>
        <a href="index.html#capabilities">Services</a>
        <a href="index.html#approach">Our Approach</a>
      </div>
      <div class="footer-col">
        <h4>Products &amp; Services</h4>
        <a href="products/wisdom.html">WISDOM</a>
        <a href="products/engaide.html">ENG|AIDE</a>
        <a href="products/fraud-analytics.html">Fraud &amp; Analytics</a>
        <a href="products/impact-framework.html">Impact Measurement</a>
        <a href="products/fabhums.html">FABHUMS</a>
        <a href="products/campaide.html">CAMP|AIDE</a>
        <a href="products/ils.html">ILS</a>
        <a href="products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="index.html#about">About</a>
        <a href="blog/index.html">Insights</a>
        <a href="contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="copyrightYear">2026</span> Anywise Pty Ltd. All rights reserved. ABN 86 169 092 960.</p>
      <div class="footer-locations">
        <a href="contact.html">Melbourne</a>
        <a href="contact.html">Sydney</a>
        <a href="contact.html">Brisbane</a>
        <a href="contact.html">Perth</a>
        <a href="contact.html">Canberra</a>
      </div>
    </div>
    <div class="acknowledgement">
      Anywise accepts the invitation of the Uluru Statement from the Heart and supports a First Nations Voice to Parliament enshrined in the Australian Constitution.
      <a href="https://ulurustatement.org" style="color: var(--text-tertiary); text-decoration: underline;">UluruStatement.org</a><br>
      Anywise acknowledges the Traditional Owners of the land on which we operate. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>

<script src="shared.js"></script>
```

**Page-scoped CSS (inner content layout used on all three new pages):**
```css
<style>
.page-wrap { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
.page-hero {
  padding: 7rem 0 3rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 3rem;
}
.page-hero .breadcrumb { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-tertiary); }
.page-hero .breadcrumb a { color: var(--text-tertiary); transition: color 0.2s; }
.page-hero .breadcrumb a:hover { color: var(--accent); }
.page-hero .breadcrumb span { color: var(--text-tertiary); }
.page-hero .label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; display: block; }
.page-hero h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; line-height: 1.15; color: var(--text-primary); margin-bottom: 1rem; }
.page-hero p { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; }
.page-content { padding-bottom: 5rem; }
.page-content h2 { font-size: 1.3rem; font-weight: 600; color: var(--text-primary); margin: 2.5rem 0 1rem; }
.page-content h3 { font-size: 1rem; font-weight: 600; color: var(--text-secondary); margin: 1.5rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
.page-content p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem; }
.page-content ul { color: var(--text-secondary); line-height: 1.8; margin: 0.5rem 0 1rem 1.5rem; }
.page-content a { color: var(--accent); }
.page-content a:hover { text-decoration: underline; }
.page-updated { font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 2rem; }
</style>
```

---

## Task 1: Create privacy.html

**Files:**
- Create: `privacy.html`

- [ ] **Step 1: Create the file**

Write the complete file to `/Users/chrisdennis/Documents/GitHub/Anywise-Website/privacy.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy | Anywise</title>
<meta name="description" content="Anywise Pty Ltd Privacy Policy. How we collect, use, and protect your personal information in accordance with the Australian Privacy Act 1988.">
<meta property="og:type" content="website">
<meta property="og:title" content="Privacy Policy | Anywise">
<meta property="og:description" content="Anywise Pty Ltd Privacy Policy. How we collect, use, and protect your personal information in accordance with the Australian Privacy Act 1988.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/privacy.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Privacy Policy | Anywise">
<meta name="twitter:description" content="Anywise Pty Ltd Privacy Policy. How we collect, use, and protect your personal information in accordance with the Australian Privacy Act 1988.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/privacy.html">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared.css">
<style>
.page-wrap { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
.page-hero {
  padding: 7rem 0 3rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 3rem;
}
.page-hero .breadcrumb { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-tertiary); }
.page-hero .breadcrumb a { color: var(--text-tertiary); transition: color 0.2s; }
.page-hero .breadcrumb a:hover { color: var(--accent); }
.page-hero .breadcrumb span { color: var(--text-tertiary); }
.page-hero .label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; display: block; }
.page-hero h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; line-height: 1.15; color: var(--text-primary); margin-bottom: 1rem; }
.page-hero p { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; }
.page-content { padding-bottom: 5rem; }
.page-content h2 { font-size: 1.3rem; font-weight: 600; color: var(--text-primary); margin: 2.5rem 0 1rem; }
.page-content h3 { font-size: 1rem; font-weight: 600; color: var(--text-secondary); margin: 1.5rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
.page-content p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem; }
.page-content ul { color: var(--text-secondary); line-height: 1.8; margin: 0.5rem 0 1rem 1.5rem; }
.page-content a { color: var(--accent); }
.page-content a:hover { text-decoration: underline; }
.page-updated { font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 2rem; }
</style>
</head>
<body>

<a href="#main-content" class="skip-link">Skip to main content</a>

<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#capabilities">Capabilities</a></li>
      <li><a href="index.html#approach">Approach</a></li>
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="index.html#about">About</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      <span class="close-x">&times;</span>
    </button>
  </div>
</nav>

<main id="main-content">
<div class="page-wrap">

  <div class="page-hero">
    <div class="breadcrumb">
      <a href="index.html">Home</a>
      <span>/</span>
      <span>Privacy Policy</span>
    </div>
    <span class="label">Legal</span>
    <h1>Privacy Policy</h1>
    <p>How Anywise Pty Ltd collects, uses, and protects your personal information.</p>
  </div>

  <div class="page-content">
    <p class="page-updated">Last updated: 6 April 2026</p>

    <h2>1. Who We Are</h2>
    <p>Anywise Pty Ltd (ABN 86 169 092 960) ("Anywise", "we", "us", "our") is a wholly Australian-owned technology company and certified B Corporation. We operate from offices in Melbourne, Sydney, Brisbane, Perth, and Canberra, and deliver intelligent technology and agile services to defence and government clients.</p>

    <h2>2. Our Commitment</h2>
    <p>We are committed to protecting your privacy and handling personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs). This policy explains what personal information we collect, why we collect it, how we use it, and how we protect it.</p>

    <h2>3. Personal Information We Collect</h2>
    <p>We may collect the following types of personal information:</p>
    <ul>
      <li>Contact details: name, email address, phone number, organisation</li>
      <li>Enquiry and correspondence content submitted via our website or email</li>
      <li>Technical data: browser type, IP address, and pages visited (collected automatically via server logs)</li>
    </ul>
    <p>We do not collect sensitive information (as defined in the Privacy Act) unless you voluntarily provide it and consent to its collection.</p>

    <h2>4. How We Collect Information</h2>
    <p>We collect personal information when you:</p>
    <ul>
      <li>Submit an enquiry through the "Engage Us" form on our website</li>
      <li>Contact us by email or phone</li>
      <li>Engage with us in a professional or contractual capacity</li>
    </ul>
    <p>We do not use cookies for tracking or advertising. Our website may use session cookies solely to support core functionality.</p>

    <h2>5. Why We Collect and Use Your Information</h2>
    <p>We collect personal information to:</p>
    <ul>
      <li>Respond to enquiries and provide requested information</li>
      <li>Assess and fulfil contractual and service obligations</li>
      <li>Comply with legal and regulatory requirements</li>
      <li>Improve our website and services</li>
    </ul>

    <h2>6. Disclosure of Personal Information</h2>
    <p>We do not sell, rent, or trade personal information. We may share it with:</p>
    <ul>
      <li>Staff and contractors who need it to perform their duties</li>
      <li>Service providers who assist us in operating our business (e.g., email and hosting providers), bound by confidentiality obligations</li>
      <li>Government or regulatory bodies where required by law</li>
    </ul>
    <p>We do not disclose personal information to overseas recipients unless required by law or with your explicit consent.</p>

    <h2>7. Data Security</h2>
    <p>We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access. These measures include access controls, encryption in transit (HTTPS), and staff training. When personal information is no longer needed and is not required to be retained by law, we take reasonable steps to destroy or de-identify it.</p>

    <h2>8. Accessing and Correcting Your Information</h2>
    <p>You have the right to request access to personal information we hold about you, and to request corrections if it is inaccurate, out of date, or incomplete. To make a request, contact us at <a href="mailto:info@anywise.com.au">info@anywise.com.au</a>. We will respond within 30 days.</p>

    <h2>9. Complaints</h2>
    <p>If you believe we have breached the Australian Privacy Principles, you may lodge a complaint by contacting us at <a href="mailto:info@anywise.com.au">info@anywise.com.au</a>. We will investigate and respond within 30 days. If you are not satisfied with our response, you may contact the <a href="https://www.oaic.gov.au">Office of the Australian Information Commissioner (OAIC)</a>.</p>

    <h2>10. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. The current version will always be available at <a href="https://anywise.com.au/privacy.html">anywise.com.au/privacy.html</a>. Material changes will be notified via this page.</p>

    <h2>11. Contact Us</h2>
    <p>For privacy-related enquiries, contact:<br>
    <strong>Anywise Pty Ltd</strong><br>
    Email: <a href="mailto:info@anywise.com.au">info@anywise.com.au</a><br>
    ABN: 86 169 092 960</p>
  </div>

</div>
</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned</p>
      </div>
      <div class="footer-col">
        <h4>Capabilities</h4>
        <a href="index.html#capabilities">Technology</a>
        <a href="index.html#capabilities">Services</a>
        <a href="index.html#approach">Our Approach</a>
      </div>
      <div class="footer-col">
        <h4>Products &amp; Services</h4>
        <a href="products/wisdom.html">WISDOM</a>
        <a href="products/engaide.html">ENG|AIDE</a>
        <a href="products/fraud-analytics.html">Fraud &amp; Analytics</a>
        <a href="products/impact-framework.html">Impact Measurement</a>
        <a href="products/fabhums.html">FABHUMS</a>
        <a href="products/campaide.html">CAMP|AIDE</a>
        <a href="products/ils.html">ILS</a>
        <a href="products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="index.html#about">About</a>
        <a href="blog/index.html">Insights</a>
        <a href="contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="copyrightYear">2026</span> Anywise Pty Ltd. All rights reserved. ABN 86 169 092 960.</p>
      <div class="footer-locations">
        <a href="contact.html">Melbourne</a>
        <a href="contact.html">Sydney</a>
        <a href="contact.html">Brisbane</a>
        <a href="contact.html">Perth</a>
        <a href="contact.html">Canberra</a>
      </div>
    </div>
    <div class="acknowledgement">
      Anywise accepts the invitation of the Uluru Statement from the Heart and supports a First Nations Voice to Parliament enshrined in the Australian Constitution.
      <a href="https://ulurustatement.org" style="color: var(--text-tertiary); text-decoration: underline;">UluruStatement.org</a><br>
      Anywise acknowledges the Traditional Owners of the land on which we operate. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>

<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the file exists**

Run: `ls -la /Users/chrisdennis/Documents/GitHub/Anywise-Website/privacy.html`
Expected: file exists, size > 3000 bytes

- [ ] **Step 3: Verify HTML is valid (spot check)**

Run: `grep -c "<h2>" /Users/chrisdennis/Documents/GitHub/Anywise-Website/privacy.html`
Expected: `11` (11 h2 sections)

- [ ] **Step 4: Commit**

```bash
cd /Users/chrisdennis/Documents/GitHub/Anywise-Website
git add privacy.html
git commit -m "feat: add Privacy Policy page (M2)"
```

---

## Task 2: Create terms.html

**Files:**
- Create: `terms.html`

- [ ] **Step 1: Create the file**

Write the complete file to `/Users/chrisdennis/Documents/GitHub/Anywise-Website/terms.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms of Use | Anywise</title>
<meta name="description" content="Anywise Pty Ltd Terms of Use. The terms governing your use of the anywise.com.au website and services.">
<meta property="og:type" content="website">
<meta property="og:title" content="Terms of Use | Anywise">
<meta property="og:description" content="Anywise Pty Ltd Terms of Use. The terms governing your use of the anywise.com.au website and services.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/terms.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Terms of Use | Anywise">
<meta name="twitter:description" content="Anywise Pty Ltd Terms of Use. The terms governing your use of the anywise.com.au website and services.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/terms.html">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared.css">
<style>
.page-wrap { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
.page-hero {
  padding: 7rem 0 3rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 3rem;
}
.page-hero .breadcrumb { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-tertiary); }
.page-hero .breadcrumb a { color: var(--text-tertiary); transition: color 0.2s; }
.page-hero .breadcrumb a:hover { color: var(--accent); }
.page-hero .breadcrumb span { color: var(--text-tertiary); }
.page-hero .label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; display: block; }
.page-hero h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; line-height: 1.15; color: var(--text-primary); margin-bottom: 1rem; }
.page-hero p { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; }
.page-content { padding-bottom: 5rem; }
.page-content h2 { font-size: 1.3rem; font-weight: 600; color: var(--text-primary); margin: 2.5rem 0 1rem; }
.page-content p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem; }
.page-content ul { color: var(--text-secondary); line-height: 1.8; margin: 0.5rem 0 1rem 1.5rem; }
.page-content a { color: var(--accent); }
.page-content a:hover { text-decoration: underline; }
.page-updated { font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 2rem; }
</style>
</head>
<body>

<a href="#main-content" class="skip-link">Skip to main content</a>

<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#capabilities">Capabilities</a></li>
      <li><a href="index.html#approach">Approach</a></li>
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="index.html#about">About</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      <span class="close-x">&times;</span>
    </button>
  </div>
</nav>

<main id="main-content">
<div class="page-wrap">

  <div class="page-hero">
    <div class="breadcrumb">
      <a href="index.html">Home</a>
      <span>/</span>
      <span>Terms of Use</span>
    </div>
    <span class="label">Legal</span>
    <h1>Terms of Use</h1>
    <p>The terms and conditions governing your use of the Anywise website.</p>
  </div>

  <div class="page-content">
    <p class="page-updated">Last updated: 6 April 2026</p>

    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using the Anywise website at <a href="https://anywise.com.au">anywise.com.au</a> ("the Website"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Website. These terms are governed by the laws of Victoria, Australia.</p>

    <h2>2. About Anywise</h2>
    <p>Anywise Pty Ltd (ABN 86 169 092 960) is a wholly Australian-owned technology company and certified B Corporation. The Website provides information about Anywise's products, services, and insights. It does not constitute professional, legal, financial, or security advice.</p>

    <h2>3. Permitted Use</h2>
    <p>You may use the Website for lawful purposes only. You must not:</p>
    <ul>
      <li>Use the Website in a way that violates any applicable law or regulation</li>
      <li>Attempt to gain unauthorised access to any part of the Website or its underlying systems</li>
      <li>Transmit any harmful, offensive, or disruptive content</li>
      <li>Reproduce, distribute, or commercially exploit Website content without prior written permission from Anywise</li>
    </ul>

    <h2>4. Intellectual Property</h2>
    <p>All content on the Website — including text, graphics, logos, and software — is the property of Anywise Pty Ltd or its licensors and is protected by Australian copyright law. The Anywise name, logo, and product names are trademarks of Anywise Pty Ltd. Nothing on the Website grants you any licence or right to use these marks.</p>

    <h2>5. Disclaimer of Warranties</h2>
    <p>The Website is provided "as is" without warranties of any kind, express or implied. Anywise does not warrant that the Website will be uninterrupted, error-free, or free of viruses. To the extent permitted by law, Anywise disclaims all implied warranties including merchantability and fitness for a particular purpose.</p>

    <h2>6. Limitation of Liability</h2>
    <p>To the maximum extent permitted by the <em>Australian Consumer Law</em>, Anywise is not liable for any indirect, incidental, special, or consequential loss arising from your use of the Website. Where liability cannot be excluded, it is limited to the re-supply of the relevant service.</p>

    <h2>7. Third-Party Links</h2>
    <p>The Website may contain links to third-party websites. These are provided for convenience only. Anywise does not endorse, control, or assume responsibility for the content or privacy practices of any third-party site.</p>

    <h2>8. Privacy</h2>
    <p>Your use of the Website is also governed by our <a href="privacy.html">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

    <h2>9. Changes to These Terms</h2>
    <p>Anywise may update these Terms of Use at any time. The current version will always be available at <a href="https://anywise.com.au/terms.html">anywise.com.au/terms.html</a>. Continued use of the Website after changes constitutes acceptance of the updated Terms.</p>

    <h2>10. Governing Law</h2>
    <p>These Terms are governed by and construed in accordance with the laws of the State of Victoria, Australia. You submit to the exclusive jurisdiction of the courts of Victoria.</p>

    <h2>11. Contact</h2>
    <p>For queries regarding these Terms, contact:<br>
    <strong>Anywise Pty Ltd</strong><br>
    Email: <a href="mailto:info@anywise.com.au">info@anywise.com.au</a><br>
    ABN: 86 169 092 960</p>
  </div>

</div>
</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned</p>
      </div>
      <div class="footer-col">
        <h4>Capabilities</h4>
        <a href="index.html#capabilities">Technology</a>
        <a href="index.html#capabilities">Services</a>
        <a href="index.html#approach">Our Approach</a>
      </div>
      <div class="footer-col">
        <h4>Products &amp; Services</h4>
        <a href="products/wisdom.html">WISDOM</a>
        <a href="products/engaide.html">ENG|AIDE</a>
        <a href="products/fraud-analytics.html">Fraud &amp; Analytics</a>
        <a href="products/impact-framework.html">Impact Measurement</a>
        <a href="products/fabhums.html">FABHUMS</a>
        <a href="products/campaide.html">CAMP|AIDE</a>
        <a href="products/ils.html">ILS</a>
        <a href="products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="index.html#about">About</a>
        <a href="blog/index.html">Insights</a>
        <a href="contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="copyrightYear">2026</span> Anywise Pty Ltd. All rights reserved. ABN 86 169 092 960.</p>
      <div class="footer-locations">
        <a href="contact.html">Melbourne</a>
        <a href="contact.html">Sydney</a>
        <a href="contact.html">Brisbane</a>
        <a href="contact.html">Perth</a>
        <a href="contact.html">Canberra</a>
      </div>
    </div>
    <div class="acknowledgement">
      Anywise accepts the invitation of the Uluru Statement from the Heart and supports a First Nations Voice to Parliament enshrined in the Australian Constitution.
      <a href="https://ulurustatement.org" style="color: var(--text-tertiary); text-decoration: underline;">UluruStatement.org</a><br>
      Anywise acknowledges the Traditional Owners of the land on which we operate. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>

<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the file exists**

Run: `ls -la /Users/chrisdennis/Documents/GitHub/Anywise-Website/terms.html`
Expected: file exists, size > 2000 bytes

- [ ] **Step 3: Verify section count**

Run: `grep -c "<h2>" /Users/chrisdennis/Documents/GitHub/Anywise-Website/terms.html`
Expected: `11`

- [ ] **Step 4: Commit**

```bash
cd /Users/chrisdennis/Documents/GitHub/Anywise-Website
git add terms.html
git commit -m "feat: add Terms of Use page (M2)"
```

---

## Task 3: Create contact.html

**Files:**
- Create: `contact.html`

This page is the indexable alternative to the "Engage Us" modal. It lists office locations with addresses, a general contact email, and a prominent CTA that also opens the Engage Us modal (for users who prefer it). This makes all office city content indexable.

- [ ] **Step 1: Create the file**

Write the complete file to `/Users/chrisdennis/Documents/GitHub/Anywise-Website/contact.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact Us | Anywise</title>
<meta name="description" content="Get in touch with Anywise. Offices in Melbourne, Sydney, Brisbane, Perth, and Canberra. Wholly Australian-owned, B Corp certified technology and services for defence and government.">
<meta property="og:type" content="website">
<meta property="og:title" content="Contact Us | Anywise">
<meta property="og:description" content="Get in touch with Anywise. Offices in Melbourne, Sydney, Brisbane, Perth, and Canberra. Wholly Australian-owned technology and services.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/contact.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Contact Us | Anywise">
<meta name="twitter:description" content="Get in touch with Anywise. Offices in Melbourne, Sydney, Brisbane, Perth, and Canberra.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/contact.html">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared.css">
<style>
.page-wrap { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }
.page-hero {
  padding: 7rem 0 3rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 3rem;
}
.page-hero .breadcrumb { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-tertiary); }
.page-hero .breadcrumb a { color: var(--text-tertiary); transition: color 0.2s; }
.page-hero .breadcrumb a:hover { color: var(--accent); }
.page-hero .breadcrumb span { color: var(--text-tertiary); }
.page-hero .label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; display: block; }
.page-hero h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; line-height: 1.15; color: var(--text-primary); margin-bottom: 1rem; }
.page-hero p { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; }

/* Contact layout */
.contact-section { padding-bottom: 5rem; }
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}
.contact-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}
.contact-card h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}
.contact-card .city-state {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
  display: block;
}
.contact-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}
.contact-general {
  background: var(--bg-elevated);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  margin-bottom: 3rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
}
.contact-general h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
.contact-general p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}
.contact-general a.email-link {
  color: var(--accent);
  font-weight: 500;
}
.contact-general a.email-link:hover { text-decoration: underline; }
.btn-engage {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.9rem 1.75rem;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  white-space: nowrap;
  text-decoration: none;
}
.btn-engage:hover { background: var(--accent-dim); transform: translateY(-1px); }

@media (max-width: 768px) {
  .contact-grid { grid-template-columns: 1fr; }
  .contact-general { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<a href="#main-content" class="skip-link">Skip to main content</a>

<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#capabilities">Capabilities</a></li>
      <li><a href="index.html#approach">Approach</a></li>
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="index.html#about">About</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      <span class="close-x">&times;</span>
    </button>
  </div>
</nav>

<main id="main-content">
<div class="page-wrap">

  <div class="page-hero">
    <div class="breadcrumb">
      <a href="index.html">Home</a>
      <span>/</span>
      <span>Contact</span>
    </div>
    <span class="label">Get in Touch</span>
    <h1>Contact Anywise</h1>
    <p>We operate across Australia — reach out to discuss how we can support your mission.</p>
  </div>

  <div class="contact-section">

    <!-- General contact CTA -->
    <div class="contact-general">
      <div>
        <h2>Ready to engage?</h2>
        <p>Use the form to tell us about your project, or email us directly at <a href="mailto:info@anywise.com.au" class="email-link">info@anywise.com.au</a>. We respond to all enquiries within two business days.</p>
      </div>
      <a href="#" class="btn-engage" data-engage aria-haspopup="dialog">Engage Us</a>
    </div>

    <!-- Office locations -->
    <h2 style="font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-bottom: 1.5rem;">Our Offices</h2>
    <div class="contact-grid">

      <div class="contact-card">
        <h2>Melbourne</h2>
        <span class="city-state">Victoria</span>
        <p>Our headquarters and primary operations centre. Home to leadership, product development, and delivery teams.</p>
      </div>

      <div class="contact-card">
        <h2>Canberra</h2>
        <span class="city-state">Australian Capital Territory</span>
        <p>Our defence and government engagement hub, located close to key Commonwealth clients and the ADF.</p>
      </div>

      <div class="contact-card">
        <h2>Sydney</h2>
        <span class="city-state">New South Wales</span>
        <p>Supporting NSW Government and enterprise clients with technology and managed services delivery.</p>
      </div>

      <div class="contact-card">
        <h2>Brisbane</h2>
        <span class="city-state">Queensland</span>
        <p>Supporting Queensland Government and northern region defence capability programmes.</p>
      </div>

      <div class="contact-card">
        <h2>Perth</h2>
        <span class="city-state">Western Australia</span>
        <p>Supporting Western Australian Government clients and HMAS Stirling–adjacent defence programmes.</p>
      </div>

    </div>

    <!-- ABN / legal -->
    <p style="font-size: 0.9rem; color: var(--text-tertiary); margin-top: 1rem;">
      Anywise Pty Ltd &nbsp;·&nbsp; ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned
    </p>

  </div>
</div>
</main>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 &nbsp;·&nbsp; B Corp Certified &nbsp;·&nbsp; Wholly Australian-Owned</p>
      </div>
      <div class="footer-col">
        <h4>Capabilities</h4>
        <a href="index.html#capabilities">Technology</a>
        <a href="index.html#capabilities">Services</a>
        <a href="index.html#approach">Our Approach</a>
      </div>
      <div class="footer-col">
        <h4>Products &amp; Services</h4>
        <a href="products/wisdom.html">WISDOM</a>
        <a href="products/engaide.html">ENG|AIDE</a>
        <a href="products/fraud-analytics.html">Fraud &amp; Analytics</a>
        <a href="products/impact-framework.html">Impact Measurement</a>
        <a href="products/fabhums.html">FABHUMS</a>
        <a href="products/campaide.html">CAMP|AIDE</a>
        <a href="products/ils.html">ILS</a>
        <a href="products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="index.html#about">About</a>
        <a href="blog/index.html">Insights</a>
        <a href="contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="copyrightYear">2026</span> Anywise Pty Ltd. All rights reserved. ABN 86 169 092 960.</p>
      <div class="footer-locations">
        <a href="contact.html">Melbourne</a>
        <a href="contact.html">Sydney</a>
        <a href="contact.html">Brisbane</a>
        <a href="contact.html">Perth</a>
        <a href="contact.html">Canberra</a>
      </div>
    </div>
    <div class="acknowledgement">
      Anywise accepts the invitation of the Uluru Statement from the Heart and supports a First Nations Voice to Parliament enshrined in the Australian Constitution.
      <a href="https://ulurustatement.org" style="color: var(--text-tertiary); text-decoration: underline;">UluruStatement.org</a><br>
      Anywise acknowledges the Traditional Owners of the land on which we operate. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>

<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the file exists**

Run: `ls -la /Users/chrisdennis/Documents/GitHub/Anywise-Website/contact.html`
Expected: file exists, size > 4000 bytes

- [ ] **Step 3: Verify offices are all present**

Run: `grep -c "contact-card" /Users/chrisdennis/Documents/GitHub/Anywise-Website/contact.html`
Expected: `10` (5 open + 5 close tags)

- [ ] **Step 4: Commit**

```bash
cd /Users/chrisdennis/Documents/GitHub/Anywise-Website
git add contact.html
git commit -m "feat: add Contact page with office locations (M3)"
```

---

## Task 4: Update footer on all existing pages

**Files:**
- Modify: `index.html`
- Modify: `products/index.html`
- Modify: `products/wisdom.html`
- Modify: `products/engaide.html`
- Modify: `products/fraud-analytics.html`
- Modify: `products/impact-framework.html`
- Modify: `products/fabhums.html`
- Modify: `products/campaide.html`
- Modify: `products/ils.html`
- Modify: `products/aide.html`
- Modify: `blog/index.html`

In every file listed above, the Company footer column currently looks like:
```html
      <div class="footer-col">
        <h4>Company</h4>
        <a href="#about">About</a>        <!-- may be ../index.html#about on subpages -->
        <a href="blog/index.html">Insights</a>   <!-- may be ../blog/index.html on subpages -->
        <a href="#" data-engage>Engage Us</a>
      </div>
```

It needs to become (preserving the correct relative paths for each file's location):
```html
      <div class="footer-col">
        <h4>Company</h4>
        <a href="[ABOUT_HREF]">About</a>
        <a href="[INSIGHTS_HREF]">Insights</a>
        <a href="[CONTACT_HREF]">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="[PRIVACY_HREF]">Privacy Policy</a>
        <a href="[TERMS_HREF]">Terms of Use</a>
      </div>
```

Also update the footer-locations links from `<a href="#">Melbourne</a>` etc. to `<a href="[CONTACT_HREF]">Melbourne</a>` etc.

**Exact paths by file location:**

| File | ABOUT_HREF | INSIGHTS_HREF | CONTACT_HREF | PRIVACY_HREF | TERMS_HREF |
|------|------------|---------------|--------------|--------------|------------|
| `index.html` | `#about` | `blog/index.html` | `contact.html` | `privacy.html` | `terms.html` |
| `products/index.html` | `../index.html#about` | `../blog/index.html` | `../contact.html` | `../privacy.html` | `../terms.html` |
| `products/*.html` (all 8) | `../index.html#about` | `../blog/index.html` | `../contact.html` | `../privacy.html` | `../terms.html` |
| `blog/index.html` | `../index.html#about` | `index.html` (self, can omit or keep) | `../contact.html` | `../privacy.html` | `../terms.html` |

- [ ] **Step 1: Update index.html footer Company column**

In `/Users/chrisdennis/Documents/GitHub/Anywise-Website/index.html`, find:
```html
      <div class="footer-col">
        <h4>Company</h4>
        <a href="#about">About</a>
        <a href="blog/index.html">Insights</a>
        <a href="#" data-engage>Engage Us</a>
      </div>
```
Replace with:
```html
      <div class="footer-col">
        <h4>Company</h4>
        <a href="#about">About</a>
        <a href="blog/index.html">Insights</a>
        <a href="contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
      </div>
```

- [ ] **Step 2: Update index.html footer-locations links**

In `/Users/chrisdennis/Documents/GitHub/Anywise-Website/index.html`, find:
```html
      <div class="footer-locations">
        <a href="#">Melbourne</a>
        <a href="#">Sydney</a>
        <a href="#">Brisbane</a>
        <a href="#">Perth</a>
        <a href="#">Canberra</a>
      </div>
```
Replace with:
```html
      <div class="footer-locations">
        <a href="contact.html">Melbourne</a>
        <a href="contact.html">Sydney</a>
        <a href="contact.html">Brisbane</a>
        <a href="contact.html">Perth</a>
        <a href="contact.html">Canberra</a>
      </div>
```

- [ ] **Step 3: Update blog/index.html footer**

In `/Users/chrisdennis/Documents/GitHub/Anywise-Website/blog/index.html`, find the Company footer-col block and replace it with the version including Contact, Privacy Policy, Terms of Use using `../contact.html`, `../privacy.html`, `../terms.html`. Then update footer-locations to use `../contact.html`.

Current in blog/index.html (lines ~251-257):
```html
      <div class="footer-col">
        <h4>Company</h4>
        <a href="../index.html#about">About</a>
        <a href="../blog/index.html">Insights</a>
        <a href="#" data-engage>Engage Us</a>
      </div>
```
Replace with:
```html
      <div class="footer-col">
        <h4>Company</h4>
        <a href="../index.html#about">About</a>
        <a href="../blog/index.html">Insights</a>
        <a href="../contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="../privacy.html">Privacy Policy</a>
        <a href="../terms.html">Terms of Use</a>
      </div>
```

Also update footer-locations in blog/index.html to use `../contact.html`.

- [ ] **Step 4: Update all products/*.html footers**

For each of these 9 files: `products/index.html`, `products/wisdom.html`, `products/engaide.html`, `products/fraud-analytics.html`, `products/impact-framework.html`, `products/fabhums.html`, `products/campaide.html`, `products/ils.html`, `products/aide.html`:

Find the Company footer-col (currently ending with `<a href="#" data-engage>Engage Us</a>`):
```html
      <div class="footer-col">
        <h4>Company</h4>
        <a href="../index.html#about">About</a>
        <a href="../blog/index.html">Insights</a>
        <a href="#" data-engage>Engage Us</a>
      </div>
```
Replace with:
```html
      <div class="footer-col">
        <h4>Company</h4>
        <a href="../index.html#about">About</a>
        <a href="../blog/index.html">Insights</a>
        <a href="../contact.html">Contact</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="../privacy.html">Privacy Policy</a>
        <a href="../terms.html">Terms of Use</a>
      </div>
```

Also update footer-locations in each to use `../contact.html` instead of `#`.

- [ ] **Step 5: Verify changes across files**

Run: `grep -l "Privacy Policy" /Users/chrisdennis/Documents/GitHub/Anywise-Website/index.html /Users/chrisdennis/Documents/GitHub/Anywise-Website/blog/index.html /Users/chrisdennis/Documents/GitHub/Anywise-Website/products/*.html`
Expected: all 11 files listed

Run: `grep -c 'href="contact.html"' /Users/chrisdennis/Documents/GitHub/Anywise-Website/index.html`
Expected: `6` (1 in Company col + 5 city links)

- [ ] **Step 6: Commit**

```bash
cd /Users/chrisdennis/Documents/GitHub/Anywise-Website
git add index.html blog/index.html products/index.html products/wisdom.html products/engaide.html products/fraud-analytics.html products/impact-framework.html products/fabhums.html products/campaide.html products/ils.html products/aide.html
git commit -m "feat: add Contact, Privacy Policy, Terms links to all page footers"
```

---

## Task 5: Update sitemap.xml

**Files:**
- Modify: `sitemap.xml`

Add three new `<url>` entries for the new pages. The sitemap is at `/Users/chrisdennis/Documents/GitHub/Anywise-Website/sitemap.xml`.

- [ ] **Step 1: Verify current sitemap URL count**

Run: `grep -c "<loc>" /Users/chrisdennis/Documents/GitHub/Anywise-Website/sitemap.xml`
Expected: `15`

- [ ] **Step 2: Add new URLs to sitemap**

Read the current sitemap and add these three entries before the closing `</urlset>` tag:

```xml
  <url>
    <loc>https://anywise.com.au/contact.html</loc>
    <lastmod>2026-04-06</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://anywise.com.au/privacy.html</loc>
    <lastmod>2026-04-06</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://anywise.com.au/terms.html</loc>
    <lastmod>2026-04-06</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
```

- [ ] **Step 3: Verify URL count after edit**

Run: `grep -c "<loc>" /Users/chrisdennis/Documents/GitHub/Anywise-Website/sitemap.xml`
Expected: `18`

- [ ] **Step 4: Commit**

```bash
cd /Users/chrisdennis/Documents/GitHub/Anywise-Website
git add sitemap.xml
git commit -m "feat: add contact, privacy, terms to sitemap.xml"
```

---

## Task 6: Update Cloudflare build command

**Files:**
- Modify: `README.md`

The Cloudflare Pages build command must include `privacy.html`, `terms.html`, and `contact.html` in its `cp` list, or they won't be deployed.

- [ ] **Step 1: Read current build command in README**

Run: `grep -n "cp -r\|mkdir" /Users/chrisdennis/Documents/GitHub/Anywise-Website/README.md`
Expected output includes: `mkdir -p public && cp -r index.html shared.css shared.js favicon-96x96.png favicon-32.png favicon-16.png apple-touch-icon.png og-image.png sitemap.xml robots.txt assets products blog engage functions public/`

- [ ] **Step 2: Update build command in README.md**

In `/Users/chrisdennis/Documents/GitHub/Anywise-Website/README.md`, find the current build command line and replace it with:

```
mkdir -p public && cp -r index.html shared.css shared.js favicon-96x96.png favicon-32.png favicon-16.png apple-touch-icon.png og-image.png sitemap.xml robots.txt privacy.html terms.html contact.html assets products blog engage functions public/
```

- [ ] **Step 3: Verify the update**

Run: `grep "privacy.html" /Users/chrisdennis/Documents/GitHub/Anywise-Website/README.md`
Expected: line containing `privacy.html terms.html contact.html` in the build command

- [ ] **Step 4: Commit**

```bash
cd /Users/chrisdennis/Documents/GitHub/Anywise-Website
git add README.md
git commit -m "chore: update Cloudflare build command to include privacy, terms, contact pages"
```

---

## Post-Implementation

After all tasks are complete:

1. **Cloudflare dashboard**: Update the build command in Settings → Builds & deployments → Build command to include `privacy.html terms.html contact.html` (copy from README.md). Trigger a new deployment.

2. **Verify live URLs** after deployment:
   - `https://anywise.com.au/privacy.html` — should return 200
   - `https://anywise.com.au/terms.html` — should return 200
   - `https://anywise.com.au/contact.html` — should return 200
   - `https://anywise.com.au/sitemap.xml` — should list all 18 URLs

3. **Google Search Console**: Request indexing for the three new pages.
