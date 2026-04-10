# Exec Feature Requests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement five features requested by the exec team: Careers EOI page, remove em dashes site-wide, scroll-to-top button, Philanthropy page content, and three B Corp policy documents.

**Architecture:** All pages are standalone HTML files using `shared.css` and `shared.js`. Forms submit via Web3Forms (access_key already in shared.js). No build pipeline — changes are deployed directly to Cloudflare Pages by pushing to `main`. All new pages follow the `contact.html` / `terms.html` page pattern: `shared.css` link, `<nav>` block, `.page-wrap` + `.page-hero`, `<footer>`, `<script src="shared.js">`.

**Tech Stack:** Vanilla HTML/CSS/JS, shared.css design system, Web3Forms for form submission, Cloudflare Pages for hosting.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `careers.html` | Create | Careers EOI page with Web3Forms form |
| `philanthropy.html` | Create | Philanthropy page (giving, B Corp, donations) |
| `grievance-policy.html` | Create | Grievance Mechanism Policy document |
| `whistleblower-policy.html` | Create | Whistleblower Protection Policy document |
| `weapons-exclusion.html` | Create | Weapons Exclusion Statement document |
| `shared.js` | Modify | Add scroll-to-top button logic |
| `shared.css` | Modify | Add scroll-to-top button styles |
| `index.html` | Modify | Add scroll-to-top button markup; remove em dashes |
| All `.html` files | Modify | Remove em dashes; add Careers + Philanthropy + policy links to nav and footer |

---

## Task 1: Remove em dashes site-wide

**Files:**
- Modify: `index.html`, `products/index.html`, `products/wisdom.html`, `products/engaide.html`, `products/fraud-analytics.html`, `products/impact-framework.html`, `products/fabhums.html`, `products/campaide.html`, `products/ils.html`, `products/aide.html`, `blog/index.html`, `blog/commitment-to-ethical-quality-business.html`, `blog/dcsp-catalyst-for-real-change.html`, `blog/transforming-operational-challenges.html`, `blog/vicworx-preparing-for-lift-off.html`, `contact.html`, `privacy.html`, `terms.html`

- [ ] **Step 1: Find all em dash instances**

```bash
grep -rn "—\|&mdash;" --include="*.html" . | grep -v ".superpowers\|template\|brainstorm\|" 2>/dev/null
```

Review the output. For each hit, decide: replace `—` with ` - ` (hyphen with spaces), or rewrite the sentence for natural flow. The goal is zero AI-tell punctuation.

- [ ] **Step 2: Replace em dashes in each file**

For each file with a match, open it and replace em dashes. Common patterns:

| Original | Replace with |
|----------|-------------|
| `technology — from` | `technology, from` |
| `services — including` | `services including` |
| `Anywise — a` | `Anywise, a` |
| `outcome — not` | `outcome, not` |

Use the Edit tool, not sed. Read the context before replacing so the sentence still flows naturally.

- [ ] **Step 3: Verify zero remaining em dashes**

```bash
grep -rn "—\|&mdash;" --include="*.html" . | grep -v ".superpowers\|template\|brainstorm"
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "fix: remove em dashes site-wide"
```

---

## Task 2: Scroll-to-top button

**Files:**
- Modify: `shared.css` (styles)
- Modify: `shared.js` (logic — add after existing modal code)
- Modify: `index.html` (add `<button>` markup before `</body>`)

The button already exists in `shared.css`/`shared.js` scope so it will work on every page that loads them — which is every page on the site.

- [ ] **Step 1: Add CSS to shared.css**

Append to the end of `shared.css`:

```css
/* ═══ SCROLL TO TOP ═══ */
#scrollTopBtn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s, transform 0.25s;
  z-index: 900;
  box-shadow: 0 4px 16px rgba(57,168,73,0.3);
}
#scrollTopBtn.visible {
  opacity: 1;
  pointer-events: auto;
}
#scrollTopBtn:hover { transform: translateY(-2px); background: var(--accent-dim); }
#scrollTopBtn svg { width: 1.1rem; height: 1.1rem; }
```

- [ ] **Step 2: Add JS to shared.js**

Append to the end of `shared.js`:

```js
/* ── Scroll to top ── */
(function () {
  var btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());
```

- [ ] **Step 3: Add button markup to every page**

Add the following button element directly before `<script src="shared.js"></script>` (or `<script src="../shared.js"></script>` for subdirectory pages) in every `.html` file:

```html
<button id="scrollTopBtn" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>
```

Pages to update (use Grep to find all `<script src` lines if unsure):
- `index.html`
- `contact.html`
- `privacy.html`
- `terms.html`
- `products/index.html`
- `products/wisdom.html`
- `products/engaide.html`
- `products/fraud-analytics.html`
- `products/impact-framework.html`
- `products/fabhums.html`
- `products/campaide.html`
- `products/ils.html`
- `products/aide.html`
- `blog/index.html`
- `blog/commitment-to-ethical-quality-business.html`
- `blog/dcsp-catalyst-for-real-change.html`
- `blog/transforming-operational-challenges.html`
- `blog/vicworx-preparing-for-lift-off.html`

- [ ] **Step 4: Verify button appears and works**

Open `index.html` in a browser. Scroll down past 400px. The green circular button should appear bottom-right. Click it — page should smooth-scroll to top. Button should disappear once back at top.

- [ ] **Step 5: Commit**

```bash
git add shared.css shared.js index.html contact.html privacy.html terms.html products/ blog/
git commit -m "feat: add scroll-to-top button to all pages"
```

---

## Task 3: Careers page (EOI form only)

**Files:**
- Create: `careers.html`
- Modify: All `.html` nav + footer blocks (add Careers link)

The nav in every page has the same structure. The footer `Company` column is where `Careers` should be added, between `Contact` and `Engage Us`.

- [ ] **Step 1: Create careers.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Careers | Anywise</title>
<meta name="description" content="Join Anywise. We're a certified B Corp building sovereign technology for Australian defence and government. Submit an expression of interest to work with us.">
<meta property="og:type" content="website">
<meta property="og:title" content="Careers | Anywise">
<meta property="og:description" content="Join Anywise. We're a certified B Corp building sovereign technology for Australian defence and government.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/careers.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Careers | Anywise">
<meta name="twitter:description" content="Join Anywise. We're a certified B Corp building sovereign technology for Australian defence and government.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/careers.html">
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

.careers-section { padding-bottom: 5rem; }
.careers-intro { margin-bottom: 2.5rem; }
.careers-intro p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem; }

.careers-form-wrap {
  background: var(--bg-elevated);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
}
.careers-form-wrap h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
.careers-form-wrap .form-note {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin-bottom: 2rem;
}

.form-row { margin-bottom: 1.25rem; }
.form-row label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
}
.form-row input,
.form-row select,
.form-row textarea {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-family: var(--font);
  font-size: 0.95rem;
  transition: border-color 0.2s;
  appearance: none;
}
.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  outline: none;
  border-color: var(--accent);
}
.form-row textarea { resize: vertical; min-height: 120px; }
.form-row input[type="file"] {
  padding: 0.6rem 1rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.form-submit {
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
  margin-top: 0.5rem;
}
.form-submit:hover { background: var(--accent-dim); transform: translateY(-1px); }
.form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.careers-success { text-align: center; padding: 2rem 0; }
.careers-success h3 { font-size: 1.4rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.75rem; }
.careers-success p { color: var(--text-secondary); }
.careers-error { color: #e74c3c; font-size: 0.875rem; margin-bottom: 1rem; }
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
      <span>Careers</span>
    </div>
    <span class="label">Join the Team</span>
    <h1>Careers at Anywise</h1>
    <p>We're building sovereign, ethical technology for Australian defence and government. If that mission resonates, we'd love to hear from you.</p>
  </div>

  <div class="careers-section">

    <div class="careers-intro">
      <p>Anywise is a certified B Corporation and wholly Australian-owned technology company. We work on some of Australia's most complex and consequential programmes - from defence logistics and intelligence systems to government digital transformation and fraud detection.</p>
      <p>We believe in doing things the right way: with integrity, deep technical capability, and a genuine commitment to positive impact. Our people are central to that. We invest in your growth, and we expect you to bring your best thinking to work that matters.</p>
      <p>We're not always actively recruiting, but we keep a strong talent pipeline. Submit an expression of interest below and we'll reach out when a relevant opportunity comes up.</p>
    </div>

    <div class="careers-form-wrap">
      <h2>Expression of Interest</h2>
      <p class="form-note">Tell us a bit about yourself and what you're looking for. All fields marked * are required.</p>

      <form id="careersForm" novalidate>
        <div class="form-row">
          <label for="careers-name">Full name *</label>
          <input type="text" id="careers-name" name="name" required autocomplete="name" placeholder="Jane Smith">
        </div>
        <div class="form-row">
          <label for="careers-email">Email address *</label>
          <input type="email" id="careers-email" name="email" required autocomplete="email" placeholder="jane@example.com">
        </div>
        <div class="form-row">
          <label for="careers-discipline">Area of interest *</label>
          <select id="careers-discipline" name="discipline" required>
            <option value="" disabled selected>Select a discipline</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Data Engineering / Analytics">Data Engineering / Analytics</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Project / Programme Management">Project / Programme Management</option>
            <option value="Business Analysis">Business Analysis</option>
            <option value="Defence / Government Advisory">Defence / Government Advisory</option>
            <option value="Design / UX">Design / UX</option>
            <option value="Operations / Corporate">Operations / Corporate</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-row">
          <label for="careers-message">Tell us about yourself *</label>
          <textarea id="careers-message" name="message" required placeholder="Brief overview of your background, experience level, and what you're looking for."></textarea>
        </div>
        <div class="form-row">
          <label for="careers-cv">Upload your CV (optional)</label>
          <input type="file" id="careers-cv" name="cv" accept=".pdf,.doc,.docx">
        </div>

        <p class="careers-error" id="careersError" style="display:none"></p>

        <button type="submit" class="form-submit" id="careersSubmit">Submit Expression of Interest</button>
      </form>
    </div>

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
        <a href="careers.html">Careers</a>
        <a href="philanthropy.html">Philanthropy</a>
        <a href="#" data-engage>Engage Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
        <a href="grievance-policy.html">Grievance Policy</a>
        <a href="whistleblower-policy.html">Whistleblower Policy</a>
        <a href="weapons-exclusion.html">Weapons Exclusion</a>
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

<button id="scrollTopBtn" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>

<script src="shared.js"></script>
<script>
(function () {
  var form = document.getElementById('careersForm');
  var submitBtn = document.getElementById('careersSubmit');
  var errorEl = document.getElementById('careersError');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    var fd = new FormData(form);
    var data = Object.fromEntries(fd.entries());
    data.access_key = 'f1275295-758d-4103-b3e7-055977430b13';
    data.subject = 'Careers EOI: ' + (data.discipline || 'General') + ' - ' + data.name;
    data.from_name = 'Anywise Careers';
    data.botcheck = '';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success) {
          form.innerHTML = '<div class="careers-success"><h3>Thanks for your interest!</h3><p>We\'ll keep your details on file and be in touch when a relevant opportunity arises.</p></div>';
        } else {
          throw new Error(result.error || 'Something went wrong');
        }
      })
      .catch(function (err) {
        errorEl.textContent = err.message || 'Failed to submit. Please try again or email careers@anywise.com.au.';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Expression of Interest';
      });
  });
}());
</script>
</body>
</html>
```

- [ ] **Step 2: Add Careers link to nav on all existing pages**

The current nav has no Careers link. Add it as a list item in `<ul class="nav-links">` on every existing page, between Insights and Engage Us:

```html
<li><a href="careers.html">Careers</a></li>
```

For subdirectory pages (`products/`, `blog/`), the href is `../careers.html`.

Pages to update:
- `index.html`
- `contact.html`
- `privacy.html`
- `terms.html`
- `products/index.html`, `products/wisdom.html`, `products/engaide.html`, `products/fraud-analytics.html`, `products/impact-framework.html`, `products/fabhums.html`, `products/campaide.html`, `products/ils.html`, `products/aide.html`
- `blog/index.html`, `blog/commitment-to-ethical-quality-business.html`, `blog/dcsp-catalyst-for-real-change.html`, `blog/transforming-operational-challenges.html`, `blog/vicworx-preparing-for-lift-off.html`

- [ ] **Step 3: Update footer on all existing pages**

Replace the `footer-col` Company section on every existing page with the updated version that includes Careers, Philanthropy, and the three policy links (use the footer block from Step 1 above as the template — adjust hrefs for subdirectory pages using `../careers.html` etc.).

- [ ] **Step 4: Verify form submission works**

Open `careers.html` in a browser. Fill in all required fields. Submit. Expect the success message. Verify an email arrives at the Web3Forms account.

- [ ] **Step 5: Commit**

```bash
git add careers.html index.html contact.html privacy.html terms.html products/ blog/
git commit -m "feat: add Careers EOI page and update nav/footer across all pages"
```

---

## Task 4: Philanthropy page

**Files:**
- Create: `philanthropy.html`

Note: The donations tally figure, 20% giving commitment copy, and B Corp logo asset must be confirmed with stakeholders before this goes live. Use placeholder values marked `<!-- TODO -->` where content is pending.

- [ ] **Step 1: Create philanthropy.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Philanthropy | Anywise</title>
<meta name="description" content="Anywise is a certified B Corporation committed to giving 20% of profits to community and charitable causes. Learn about our giving commitment and impact.">
<meta property="og:type" content="website">
<meta property="og:title" content="Philanthropy | Anywise">
<meta property="og:description" content="Anywise is a certified B Corporation committed to giving 20% of profits to community and charitable causes.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/philanthropy.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Philanthropy | Anywise">
<meta name="twitter:description" content="Anywise is a certified B Corporation committed to giving 20% of profits to community and charitable causes.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/philanthropy.html">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared.css">
<style>
.page-wrap { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
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

.phil-section { padding-bottom: 5rem; }

/* Tally stat */
.phil-tally {
  background: var(--bg-elevated);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-lg);
  padding: 3rem 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
}
.phil-tally .tally-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
  display: block;
}
.phil-tally .tally-amount {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.75rem;
  font-variant-numeric: tabular-nums;
}
.phil-tally .tally-sub { font-size: 1rem; color: var(--text-secondary); }

/* Two-col content */
.phil-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}
.phil-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}
.phil-card .card-icon { font-size: 2rem; margin-bottom: 1rem; }
.phil-card h2 { font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.75rem; }
.phil-card p { color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; }

/* B Corp section */
.bcorp-section {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  margin-bottom: 3rem;
}
.bcorp-logo { flex-shrink: 0; }
.bcorp-logo img { width: 100px; height: auto; }
.bcorp-content h2 { font-size: 1.3rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.75rem; }
.bcorp-content p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.75rem; }
.bcorp-content p:last-child { margin-bottom: 0; }

/* Policy links */
.policy-links { border-top: 1px solid var(--border); padding-top: 2rem; }
.policy-links h3 { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 1rem; }
.policy-links ul { list-style: none; display: flex; flex-wrap: wrap; gap: 0.75rem; }
.policy-links ul li a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--accent);
  transition: color 0.2s;
}
.policy-links ul li a:hover { color: var(--text-primary); text-decoration: underline; }

@media (max-width: 700px) {
  .phil-grid { grid-template-columns: 1fr; }
  .bcorp-section { flex-direction: column; text-align: center; }
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
      <li><a href="careers.html">Careers</a></li>
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
      <span>Philanthropy</span>
    </div>
    <span class="label">Giving Back</span>
    <h1>Philanthropy</h1>
    <p>Profit-for-purpose isn't a tagline for us. We've built giving into the structure of how Anywise operates.</p>
  </div>

  <div class="phil-section">

    <!-- Donations tally -->
    <div class="phil-tally">
      <span class="tally-label">Total donated to date</span>
      <!-- TODO: Replace with actual tally figure confirmed by stakeholders -->
      <div class="tally-amount">$[AMOUNT]</div>
      <p class="tally-sub">Given to community organisations, charities, and causes across Australia</p>
    </div>

    <!-- 20% giving + how it works -->
    <div class="phil-grid">
      <div class="phil-card">
        <div class="card-icon">💚</div>
        <h2>The 20% Commitment</h2>
        <!-- TODO: Replace placeholder copy with approved text from stakeholders -->
        <p>Anywise commits 20% of profits to charitable giving and community investment. This is a founding principle of the business, not an afterthought. Every engagement we win translates directly into giving capacity.</p>
      </div>
      <div class="phil-card">
        <div class="card-icon">🎯</div>
        <h2>Where It Goes</h2>
        <!-- TODO: Populate with actual beneficiaries/causes confirmed by stakeholders -->
        <p>We direct our giving to causes aligned with our values: First Nations support, STEM education, veterans' welfare, environmental resilience, and community organisations in the regions where we operate.</p>
      </div>
    </div>

    <!-- B Corp certification -->
    <div class="bcorp-section">
      <div class="bcorp-logo">
        <!-- TODO: Add B Corp logo asset. Place file at assets/bcorp-logo.png -->
        <!-- <img src="assets/bcorp-logo.png" alt="Certified B Corporation"> -->
        <div style="width:100px;height:100px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);font-size:0.75rem;text-align:center;padding:0.5rem;">B Corp Logo</div>
      </div>
      <div class="bcorp-content">
        <h2>Certified B Corporation</h2>
        <p>Anywise is a certified B Corporation, meeting the highest verified standards of social and environmental performance, transparency, and accountability. B Corp certification is awarded by B Lab and requires a rigorous assessment across governance, workers, community, environment, and customers.</p>
        <p>Certification is not self-reported. It is independently verified and requires recertification every three years. For Anywise, it is the formal commitment that our commercial success directly benefits the people and communities around us.</p>
      </div>
    </div>

    <!-- Policy document links -->
    <div class="policy-links">
      <h3>Related Policies</h3>
      <ul>
        <li><a href="grievance-policy.html">&#8599; Grievance Mechanism Policy</a></li>
        <li><a href="whistleblower-policy.html">&#8599; Whistleblower Protection Policy</a></li>
        <li><a href="weapons-exclusion.html">&#8599; Weapons Exclusion Statement</a></li>
      </ul>
    </div>

  </div>
</div>
</main>

<footer>
  <!-- Use updated footer block from Task 3 Step 3 -->
</footer>

<button id="scrollTopBtn" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>

<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Populate footer**

Copy the full updated footer block from Task 3 Step 1 into the `<footer>` element above.

- [ ] **Step 3: Stakeholder content gate**

Before committing, confirm with stakeholders:
1. Donations tally dollar figure (replace `$[AMOUNT]`)
2. Approved copy for the 20% commitment section
3. B Corp logo asset (place at `assets/bcorp-logo.png`, uncomment the `<img>` tag, remove the placeholder div)

- [ ] **Step 4: Commit (after stakeholder content confirmed)**

```bash
git add philanthropy.html
git commit -m "feat: add Philanthropy page with giving tally, 20% commitment, and B Corp section"
```

---

## Task 5: B Corp policy documents

**Files:**
- Create: `grievance-policy.html`
- Create: `whistleblower-policy.html`
- Create: `weapons-exclusion.html`

All three follow the `terms.html` pattern exactly: `max-width: 800px`, `.page-content` with `h2` sections, `.page-updated` date stamp.

- [ ] **Step 1: Create grievance-policy.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Grievance Mechanism Policy | Anywise</title>
<meta name="description" content="Anywise Grievance Mechanism Policy. How staff, clients, and community members can raise concerns and how we respond.">
<meta property="og:type" content="website">
<meta property="og:title" content="Grievance Mechanism Policy | Anywise">
<meta property="og:description" content="Anywise Grievance Mechanism Policy. How staff, clients, and community members can raise concerns and how we respond.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/grievance-policy.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Grievance Mechanism Policy | Anywise">
<meta name="twitter:description" content="How staff, clients, and community members can raise concerns with Anywise and how we respond.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/grievance-policy.html">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared.css">
<style>
.page-wrap { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
.page-hero { padding: 7rem 0 3rem; border-bottom: 1px solid var(--border); margin-bottom: 3rem; }
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
      <li><a href="careers.html">Careers</a></li>
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
      <a href="philanthropy.html">Philanthropy</a>
      <span>/</span>
      <span>Grievance Mechanism Policy</span>
    </div>
    <span class="label">Policy</span>
    <h1>Grievance Mechanism Policy</h1>
    <p>How to raise a concern with Anywise, and how we will respond.</p>
  </div>

  <div class="page-content">
    <p class="page-updated">Last updated: April 2026</p>

    <h2>1. Purpose</h2>
    <p>Anywise Pty Ltd is committed to operating with integrity and accountability. This policy establishes a clear, accessible mechanism for staff, clients, contractors, community members, and other stakeholders to raise grievances and have them addressed in a fair and timely manner.</p>
    <p>This policy supports Anywise's obligations as a certified B Corporation and reflects our commitment to ethical business conduct.</p>

    <h2>2. Scope</h2>
    <p>This policy applies to:</p>
    <ul>
      <li>All Anywise employees and contractors</li>
      <li>Clients and project partners</li>
      <li>Community members and organisations affected by Anywise's operations</li>
      <li>Any other stakeholder with a legitimate grievance related to Anywise's conduct</li>
    </ul>

    <h2>3. What Is a Grievance?</h2>
    <p>A grievance is any complaint, concern, or dispute relating to Anywise's conduct, decisions, products, services, or the behaviour of its personnel. This includes, but is not limited to:</p>
    <ul>
      <li>Workplace conduct, including discrimination, harassment, or bullying</li>
      <li>Service delivery failures or contractual disputes</li>
      <li>Ethical concerns about how a project or engagement is being conducted</li>
      <li>Environmental or community impacts arising from Anywise's operations</li>
      <li>Concerns about supplier or subcontractor conduct</li>
    </ul>

    <h2>4. How to Raise a Grievance</h2>
    <p>Grievances may be raised in writing to:</p>
    <ul>
      <li><strong>Email:</strong> <a href="mailto:grievance@anywise.com.au">grievance@anywise.com.au</a></li>
      <li><strong>Post:</strong> Grievance Officer, Anywise Pty Ltd, Melbourne VIC, Australia</li>
    </ul>
    <p>All submissions should include: the nature of the grievance, the parties involved, any relevant dates or events, and the outcome you are seeking. Anonymous grievances will be accepted where possible, though our ability to investigate and respond may be limited.</p>

    <h2>5. How We Respond</h2>
    <p>Upon receipt of a grievance, Anywise will:</p>
    <ul>
      <li>Acknowledge receipt within 5 business days</li>
      <li>Assign a Grievance Officer who is independent of the subject matter</li>
      <li>Conduct a fair and confidential investigation</li>
      <li>Provide a written outcome within 30 business days (or advise of any extension required)</li>
      <li>Offer an avenue for appeal if the complainant is not satisfied with the outcome</li>
    </ul>

    <h2>6. Confidentiality and Non-Retaliation</h2>
    <p>All grievances will be handled with strict confidentiality. Information will only be disclosed to those directly involved in the investigation. Anywise strictly prohibits retaliation against any person who raises a grievance in good faith. Any retaliation will itself be treated as a serious disciplinary matter.</p>

    <h2>7. External Remedies</h2>
    <p>This policy does not limit a person's right to seek external remedies. Depending on the nature of the grievance, relevant external bodies include the Fair Work Commission, the Australian Human Rights Commission, relevant state ombudsman offices, or B Lab (for B Corp-related concerns).</p>

    <h2>8. Review</h2>
    <p>This policy is reviewed annually by Anywise's leadership team. Substantive changes will be reflected in the "Last updated" date above.</p>
  </div>

</div>
</main>

<footer>
  <!-- Use updated footer block from Task 3 Step 1 -->
</footer>

<button id="scrollTopBtn" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>

<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create whistleblower-policy.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Whistleblower Protection Policy | Anywise</title>
<meta name="description" content="Anywise Whistleblower Protection Policy. Protections and reporting procedures for anyone who discloses suspected misconduct.">
<meta property="og:type" content="website">
<meta property="og:title" content="Whistleblower Protection Policy | Anywise">
<meta property="og:description" content="Protections and reporting procedures for anyone who discloses suspected misconduct at Anywise.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/whistleblower-policy.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Whistleblower Protection Policy | Anywise">
<meta name="twitter:description" content="Protections and reporting procedures for anyone who discloses suspected misconduct at Anywise.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/whistleblower-policy.html">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared.css">
<style>
.page-wrap { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
.page-hero { padding: 7rem 0 3rem; border-bottom: 1px solid var(--border); margin-bottom: 3rem; }
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
      <li><a href="careers.html">Careers</a></li>
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
      <a href="philanthropy.html">Philanthropy</a>
      <span>/</span>
      <span>Whistleblower Protection Policy</span>
    </div>
    <span class="label">Policy</span>
    <h1>Whistleblower Protection Policy</h1>
    <p>Protections and procedures for reporting suspected misconduct at Anywise.</p>
  </div>

  <div class="page-content">
    <p class="page-updated">Last updated: April 2026</p>

    <h2>1. Purpose</h2>
    <p>Anywise Pty Ltd encourages the reporting of suspected misconduct. This policy provides legal and procedural protections for anyone who discloses information about wrongdoing in good faith, and sets out how Anywise will handle such disclosures.</p>
    <p>This policy is consistent with the requirements of the <em>Corporations Act 2001</em> (Cth) Part 9.4AAA (Whistleblower Protections) and reflects our obligations as a certified B Corporation.</p>

    <h2>2. Who Is Protected?</h2>
    <p>This policy protects disclosures made by:</p>
    <ul>
      <li>Current and former Anywise employees and contractors</li>
      <li>Officers and directors of Anywise</li>
      <li>Suppliers and their employees</li>
      <li>Associates of Anywise</li>
      <li>Relatives or dependants of any of the above</li>
    </ul>

    <h2>3. What Can Be Reported?</h2>
    <p>A protected disclosure may relate to:</p>
    <ul>
      <li>Conduct that is illegal, fraudulent, or corrupt</li>
      <li>Serious breaches of Anywise policy or the law</li>
      <li>Conduct that represents a significant risk to the health, safety, or welfare of any person</li>
      <li>Conduct that may cause substantial harm to Anywise, its clients, or the public</li>
      <li>Any deliberate concealment of the above</li>
    </ul>
    <p>Disclosures must be made honestly and in good faith. This policy does not protect disclosures that are knowingly false.</p>

    <h2>4. How to Make a Disclosure</h2>
    <p>Disclosures should be made to:</p>
    <ul>
      <li><strong>Email:</strong> <a href="mailto:whistleblower@anywise.com.au">whistleblower@anywise.com.au</a> (monitored by the Whistleblower Protection Officer)</li>
      <li><strong>Post:</strong> Whistleblower Protection Officer (confidential), Anywise Pty Ltd, Melbourne VIC, Australia</li>
    </ul>
    <p>Disclosures may also be made to the Australian Securities and Investments Commission (ASIC) or the Australian Prudential Regulation Authority (APRA) as applicable.</p>
    <p>Anonymous disclosures are accepted. Where a disclosure is anonymous, Anywise will still investigate to the extent possible.</p>

    <h2>5. Protections for Disclosers</h2>
    <p>Any person who makes a protected disclosure in good faith is entitled to:</p>
    <ul>
      <li>Confidentiality - their identity will not be disclosed without consent except as required by law</li>
      <li>Protection from civil, criminal, or administrative liability arising from the disclosure</li>
      <li>Protection from any form of victimisation, including demotion, termination, harassment, or discrimination</li>
    </ul>
    <p>Any Anywise person who retaliates against a whistleblower will face disciplinary action up to and including termination of employment or contract.</p>

    <h2>6. Investigation Process</h2>
    <p>On receipt of a disclosure, Anywise will:</p>
    <ul>
      <li>Acknowledge receipt within 5 business days (if contact details are provided)</li>
      <li>Assign an independent Whistleblower Protection Officer to oversee the investigation</li>
      <li>Conduct a fair, thorough, and confidential investigation</li>
      <li>Keep the discloser informed of progress where possible</li>
      <li>Take appropriate corrective action where misconduct is substantiated</li>
    </ul>

    <h2>7. Review</h2>
    <p>This policy is reviewed annually. Anywise may update this policy from time to time to reflect changes in law or company structure. The "Last updated" date above reflects the most recent review.</p>
  </div>

</div>
</main>

<footer>
  <!-- Use updated footer block from Task 3 Step 1 -->
</footer>

<button id="scrollTopBtn" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>

<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create weapons-exclusion.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Weapons Exclusion Statement | Anywise</title>
<meta name="description" content="Anywise's formal statement excluding participation in the design, manufacture, or sale of weapons systems.">
<meta property="og:type" content="website">
<meta property="og:title" content="Weapons Exclusion Statement | Anywise">
<meta property="og:description" content="Anywise's formal statement excluding participation in the design, manufacture, or sale of weapons systems.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/weapons-exclusion.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Weapons Exclusion Statement | Anywise">
<meta name="twitter:description" content="Anywise's formal statement excluding participation in the design, manufacture, or sale of weapons systems.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#0e110e">
<link rel="canonical" href="https://anywise.com.au/weapons-exclusion.html">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared.css">
<style>
.page-wrap { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
.page-hero { padding: 7rem 0 3rem; border-bottom: 1px solid var(--border); margin-bottom: 3rem; }
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
.statement-box {
  background: var(--bg-elevated);
  border: 1px solid var(--border-accent);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin: 2rem 0;
}
.statement-box p {
  color: var(--text-primary);
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0;
  font-weight: 500;
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
      <li><a href="careers.html">Careers</a></li>
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
      <a href="philanthropy.html">Philanthropy</a>
      <span>/</span>
      <span>Weapons Exclusion Statement</span>
    </div>
    <span class="label">Statement</span>
    <h1>Weapons Exclusion Statement</h1>
    <p>Anywise's formal position on participation in weapons-related activities.</p>
  </div>

  <div class="page-content">
    <p class="page-updated">Last updated: April 2026</p>

    <div class="statement-box">
      <p>Anywise Pty Ltd does not participate in the design, manufacture, sale, or direct operational support of weapons systems or lethal autonomous weapons. This exclusion is absolute and applies to all subsidiaries, joint ventures, and contracted work carried out on behalf of Anywise.</p>
    </div>

    <h2>Context</h2>
    <p>Anywise works extensively with Australian defence and government clients. Our work spans logistics, enterprise technology, data analytics, and programme management. While we are proud to support the operational effectiveness of Australia's defence capability, our contribution is limited to non-lethal systems and support functions.</p>
    <p>We do not design, develop, or supply:</p>
    <ul>
      <li>Weapons, munitions, or weapons platforms</li>
      <li>Lethal autonomous weapons systems (LAWS)</li>
      <li>Targeting systems or fire control systems</li>
      <li>Electronic warfare systems designed to cause physical harm</li>
    </ul>

    <h2>B Corp Alignment</h2>
    <p>This statement forms part of Anywise's B Corp certification obligations and is published in accordance with B Lab's requirements for companies operating in the defence sector. B Corp certification requires companies to be transparent about the nature of their work and any ethical boundaries they have established.</p>
    <p>Anywise's B Corp certification is maintained through rigorous triennial assessments. This exclusion is a standing condition of our certification and cannot be waived without forfeiting B Corp status.</p>

    <h2>Questions</h2>
    <p>If you have questions about this statement or Anywise's work in the defence sector, please contact us at <a href="mailto:info@anywise.com.au">info@anywise.com.au</a>.</p>
  </div>

</div>
</main>

<footer>
  <!-- Use updated footer block from Task 3 Step 1 -->
</footer>

<button id="scrollTopBtn" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>

<script src="shared.js"></script>
</body>
</html>
```

- [ ] **Step 4: Populate footers in all three new policy files**

Copy the full updated footer block from Task 3 Step 1 into each of the three policy pages.

- [ ] **Step 5: Director review gate**

Before committing these files, the content of all three documents must be reviewed and approved by a director. These are legal/compliance documents.

- [ ] **Step 6: Commit (after director approval)**

```bash
git add grievance-policy.html whistleblower-policy.html weapons-exclusion.html
git commit -m "feat: add Grievance Policy, Whistleblower Policy, and Weapons Exclusion Statement pages"
```

---

## Final: Update sitemap and push

- [ ] **Step 1: Add new pages to sitemap.xml**

Open `sitemap.xml`. Add entries for all new pages:

```xml
<url>
  <loc>https://anywise.com.au/careers.html</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://anywise.com.au/philanthropy.html</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://anywise.com.au/grievance-policy.html</loc>
  <changefreq>yearly</changefreq>
  <priority>0.4</priority>
</url>
<url>
  <loc>https://anywise.com.au/whistleblower-policy.html</loc>
  <changefreq>yearly</changefreq>
  <priority>0.4</priority>
</url>
<url>
  <loc>https://anywise.com.au/weapons-exclusion.html</loc>
  <changefreq>yearly</changefreq>
  <priority>0.4</priority>
</url>
```

- [ ] **Step 2: Final commit and push**

```bash
git add sitemap.xml
git commit -m "feat: add new pages to sitemap"
git push origin main
```

Cloudflare Pages will deploy automatically on push to `main`.

---

## Stakeholder Gates (do not ship without these)

| Task | Gate | Owner |
|------|------|-------|
| Philanthropy page | Donations tally figure | Exec team |
| Philanthropy page | Approved 20% giving copy | Exec team |
| Philanthropy page | B Corp logo asset (`assets/bcorp-logo.png`) | Exec team |
| B Corp policy docs | Director review and sign-off on all three documents | Director |
