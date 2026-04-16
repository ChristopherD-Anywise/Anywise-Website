# Careers Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Careers page with a job board (rendered from `jobs.json`), a multi-step application wizard overlay, an EOI form, and a Cloudflare Worker backend that creates ClickUp tasks and sends email notifications.

**Architecture:** Single `careers.html` page with three zones (hero, job listings, EOI form). Job cards render from `jobs.json` via client-side JS following the blog index pattern. The application wizard is a full-screen overlay (same modal pattern as Engage Us). Form submissions post to a Cloudflare Worker that uploads CVs to R2, creates ClickUp tasks, and sends emails via Web3Forms.

**Tech Stack:** HTML/CSS/JS (vanilla, no frameworks — matching existing site), Cloudflare Workers (TypeScript), Cloudflare R2, ClickUp API v2, Web3Forms API.

**Spec:** `docs/superpowers/specs/2026-04-16-careers-page-design.md`

---

## File Structure

**Create:**
- `careers.html` — Careers page (hero + job listings + EOI form + application wizard overlay)
- `jobs.json` — Job listings data file (root level, like `blog/posts.json`)
- `workers/careers-api/src/index.ts` — Cloudflare Worker entry point
- `workers/careers-api/wrangler.toml` — Worker configuration
- `workers/careers-api/package.json` — Worker dependencies
- `workers/careers-api/tsconfig.json` — TypeScript config

**Modify:**
- `shared.css` — Add careers-specific styles (job cards, wizard overlay, EOI section, progress bar)
- `shared.js` — Add wizard logic, job card rendering, EOI form handler
- `index.html` — Add Careers to nav + footer + 7th mobile nav animation delay
- All other HTML files — Add Careers to nav + footer (see full list in Task 8)

---

## Task 1: Create `jobs.json` Data File

**Files:**
- Create: `jobs.json`

- [ ] **Step 1: Create `jobs.json` with one sample listing**

```json
[
  {
    "slug": "senior-data-engineer",
    "title": "Senior Data Engineer",
    "location": ["Melbourne"],
    "type": "Full-time",
    "closingDate": "2026-05-31",
    "active": true,
    "shortDescription": "Design and build sovereign data pipelines for defence and government platforms. Work with classified environments and real operational impact.",
    "responsibilities": [
      "Design and implement scalable data pipelines on sovereign infrastructure",
      "Build ETL/ELT workflows for defence and government data sources",
      "Work within classified environments and maintain security compliance",
      "Collaborate with engineers, analysts, and product teams to deliver data solutions",
      "Contribute to platform architecture decisions and technical documentation"
    ],
    "requirements": [
      "5+ years of data engineering experience (Python, SQL, Spark, or equivalent)",
      "Experience with cloud data platforms (AWS, Azure, or GCP)",
      "Strong understanding of data modelling, warehousing, and pipeline orchestration",
      "Australian citizenship (required for security clearance eligibility)",
      "Experience in defence, government, or regulated environments (desirable)"
    ]
  }
]
```

- [ ] **Step 2: Validate JSON**

Run: `python3 -c "import json; json.load(open('jobs.json')); print('Valid JSON')"`
Expected: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add jobs.json
git commit -m "feat(careers): add jobs.json data file with sample listing"
```

---

## Task 2: Create `careers.html` — Page Shell, Hero, and Nav/Footer

**Files:**
- Create: `careers.html`

This task creates the page with hero, nav, footer, and empty placeholder sections for job listings and EOI. The JS rendering and wizard come in later tasks.

- [ ] **Step 1: Create `careers.html`**

Use `grievance-policy.html` as the structural reference. The page needs:
- Full `<head>` with meta tags, Open Graph, shared.css link, and page-specific `<style>` block
- Nav (same as `index.html` but with Careers link added — see Task 8 for the exact nav HTML)
- `.page-wrap` with `.page-hero` (breadcrumb, label, h1, description, hero background image)
- Job listings section with `#jobList` container and `#jobEmpty` empty state
- Why Anywise section (shared content + certification badges)
- EOI section with form
- Footer (same as `index.html` but with Careers link added)
- Script tags for `shared.js` and inline JS

The hero uses `team-photo-alt.jpg` as a background image with a dark overlay for text readability.

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Careers | Anywise — Sovereign Technology for Defence &amp; Government</title>
  <meta name="description" content="Join Anywise. Explore open roles in software engineering, data, cyber security, and defence advisory. Help build ethical, sovereign technology for Australia.">

  <!-- Open Graph -->
  <meta property="og:title" content="Careers | Anywise">
  <meta property="og:description" content="Join Anywise. Explore open roles in software engineering, data, cyber security, and defence advisory.">
  <meta property="og:image" content="assets/images/team/team-photo-alt.jpg">
  <meta property="og:type" content="website">

  <!-- Fonts -->
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="shared.css">

  <style>
    /* ═══ PAGE LAYOUT ═══ */
    .page-wrap { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }

    /* ═══ HERO ═══ */
    .careers-hero {
      position: relative;
      padding: 7rem 0 3rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 3rem;
      overflow: hidden;
    }
    .careers-hero-bg {
      position: absolute;
      inset: 0;
      background: url('assets/images/team/team-photo-alt.jpg') center/cover no-repeat;
      opacity: 0.15;
      filter: blur(2px);
      z-index: 0;
    }
    .careers-hero-content { position: relative; z-index: 1; }
    .careers-hero .breadcrumb {
      display: flex; gap: 0.5rem; align-items: center;
      margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-tertiary);
    }
    .careers-hero .breadcrumb a { color: var(--text-tertiary); transition: color 0.2s; }
    .careers-hero .breadcrumb a:hover { color: var(--accent); }
    .careers-hero .label {
      font-family: var(--mono);
      font-size: 0.65rem; font-weight: 500; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--accent);
      margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 0.6rem;
    }
    .careers-hero .label::before {
      content: ''; width: 0; height: 1px;
      background: var(--gradient-al);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .careers-hero .label.visible::before { width: 2rem; }
    .careers-hero h1 {
      font-size: clamp(2rem, 5vw, 3rem); font-weight: 700;
      line-height: 1.15; color: var(--text-primary); margin-bottom: 1rem;
    }
    .careers-hero p {
      font-size: 1.1rem; color: var(--text-secondary); max-width: 600px;
    }

    /* ═══ JOB LISTINGS ═══ */
    .careers-section {
      margin-bottom: 3rem;
    }
    .careers-section h2 {
      font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;
    }
    .careers-section .section-sub {
      font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;
    }

    .job-list { display: flex; flex-direction: column; gap: 1rem; }

    .job-card {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      background: var(--bg-card);
      transition: border-color 0.2s;
    }
    .job-card:hover { border-color: var(--border-accent); }

    .job-card-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      flex-wrap: wrap; gap: 0.75rem;
    }
    .job-card-title { font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; }
    .job-card-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .job-badge {
      font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 20px;
      background: rgba(57, 168, 73, 0.12); color: var(--accent); font-weight: 500;
    }
    .job-card-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
    .job-btn-details, .job-btn-apply {
      font-size: 0.78rem; padding: 0.4rem 0.85rem; border-radius: 8px;
      cursor: pointer; font-family: var(--font); font-weight: 500;
      transition: all 0.2s; border: none;
    }
    .job-btn-details {
      background: transparent; border: 1px solid var(--border);
      color: var(--text-secondary);
    }
    .job-btn-details:hover { border-color: var(--border-accent); color: var(--text-primary); }
    .job-btn-apply {
      background: var(--accent); color: var(--bg-deep); font-weight: 600;
    }
    .job-btn-apply:hover { box-shadow: 0 0 16px rgba(57, 168, 73, 0.3); }

    .job-card-desc {
      font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.75rem; line-height: 1.6;
    }
    .job-card-closing {
      font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.5rem;
    }

    /* Expanded details — animated expand/collapse */
    .job-card-details {
      margin-top: 0; padding-top: 0;
      border-top: 1px solid transparent;
      max-height: 0; overflow: hidden; opacity: 0;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.3s ease,
                  margin-top 0.3s ease,
                  padding-top 0.3s ease,
                  border-color 0.3s ease;
    }
    .job-card.expanded .job-card-details {
      max-height: 1200px; opacity: 1;
      margin-top: 1.25rem; padding-top: 1.25rem;
      border-top-color: var(--border);
    }
    .job-card.expanded .job-btn-details-text::after { content: ' ↑'; }
    .job-card:not(.expanded) .job-btn-details-text::after { content: ' ↓'; }

    .job-detail-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
    }
    .job-detail-col h3 {
      font-size: 0.85rem; font-weight: 600; color: var(--text-primary);
      margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;
    }
    .job-detail-col ul {
      list-style: none; padding: 0; margin: 0;
    }
    .job-detail-col li {
      font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6;
      padding-left: 1rem; position: relative; margin-bottom: 0.35rem;
    }
    .job-detail-col li::before {
      content: '→'; position: absolute; left: 0; color: var(--accent); font-size: 0.75rem;
    }

    /* Empty state */
    .job-empty {
      text-align: center; padding: 3rem 1rem;
      border: 1px dashed var(--border); border-radius: 12px;
    }
    .job-empty p { color: var(--text-secondary); font-size: 0.95rem; }
    .job-empty a { color: var(--accent); font-weight: 500; }

    /* ═══ WHY ANYWISE ═══ */
    .why-anywise {
      margin-top: 1.5rem; padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }
    .why-anywise h3 {
      font-size: 0.85rem; font-weight: 600; color: var(--text-primary);
      margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;
    }
    .why-anywise p {
      font-size: 0.82rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 0.75rem;
    }
    .why-badges {
      display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-top: 1rem;
    }
    .why-badges img {
      height: 40px; opacity: 0; transform: scale(0.85);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .job-card.expanded .why-badges img {
      opacity: 0.85; transform: scale(1);
    }
    .why-badges img:nth-child(1) { transition-delay: 0.1s; }
    .why-badges img:nth-child(2) { transition-delay: 0.15s; }
    .why-badges img:nth-child(3) { transition-delay: 0.2s; }
    .why-badges img:nth-child(4) { transition-delay: 0.25s; }
    .why-badges img:nth-child(5) { transition-delay: 0.3s; }
    .why-badges img:nth-child(6) { transition-delay: 0.35s; }
    .job-card.expanded .why-badges img:hover { opacity: 1; }

    /* ═══ EOI SECTION ═══ */
    .eoi-section {
      position: relative; padding: 3rem 0; margin-bottom: 3rem;
      border-top: 1px solid var(--border);
    }
    .eoi-bg {
      position: absolute; inset: 0;
      background: url('assets/images/engagement/bridge.jpg') center/cover no-repeat;
      opacity: 0.08; filter: blur(3px); z-index: 0;
    }
    .eoi-content { position: relative; z-index: 1; }
    .eoi-section h2 {
      font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;
    }
    .eoi-section .section-sub {
      font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;
    }

    /* ═══ APPLICATION WIZARD OVERLAY ═══ */
    .wizard-overlay {
      position: fixed; inset: 0;
      background: rgba(10, 13, 10, 0.85);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    .wizard-overlay.open { opacity: 1; pointer-events: all; }

    .wizard-panel {
      background: var(--bg-card);
      border: 1px solid var(--border-accent);
      border-radius: 20px;
      width: 100%; max-width: 640px;
      padding: 2.5rem;
      position: relative;
      transform: translateY(24px);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      max-height: 90vh; overflow-y: auto;
    }
    .wizard-overlay.open .wizard-panel { transform: translateY(0); }

    .wizard-close {
      position: absolute; top: 1.25rem; right: 1.25rem;
      width: 2rem; height: 2rem;
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: 50%; cursor: pointer;
      color: var(--text-secondary); font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.2s, color 0.2s;
      font-family: var(--font);
    }
    .wizard-close:hover { border-color: var(--border-accent); color: var(--text-primary); }

    .wizard-role-title {
      font-size: 0.78rem; font-weight: 500; color: var(--accent);
      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem;
    }
    .wizard-panel h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; }
    .wizard-sub {
      font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;
    }

    /* Progress bar */
    .wizard-progress {
      display: flex; gap: 0.5rem; margin-bottom: 2rem;
    }
    .wizard-step-indicator {
      flex: 1; text-align: center; font-size: 0.7rem; font-weight: 500;
      color: var(--text-tertiary); position: relative; padding-top: 0.75rem;
    }
    .wizard-step-indicator::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0;
      height: 3px; border-radius: 2px;
      background: var(--border);
      transition: background 0.3s;
    }
    .wizard-step-indicator.active::before,
    .wizard-step-indicator.completed::before {
      background: var(--accent);
    }
    .wizard-step-indicator.active { color: var(--accent); }
    .wizard-step-indicator.completed { color: var(--text-secondary); }

    /* Wizard form elements reuse engage-group styles from shared.css */
    .wizard-step {
      display: none;
      opacity: 0; transform: translateX(12px);
    }
    .wizard-step.active {
      display: block;
      animation: wizardStepIn 0.3s ease forwards;
    }
    @keyframes wizardStepIn {
      from { opacity: 0; transform: translateX(12px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .wizard-actions {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 2rem; gap: 1rem;
    }
    .wizard-btn-back {
      background: transparent; border: 1px solid var(--border);
      color: var(--text-secondary); padding: 0.55rem 1.2rem;
      border-radius: 8px; cursor: pointer; font-family: var(--font);
      font-size: 0.85rem; font-weight: 500; transition: all 0.2s;
    }
    .wizard-btn-back:hover { border-color: var(--border-accent); color: var(--text-primary); }
    .wizard-btn-next, .wizard-btn-submit {
      background: var(--accent); color: var(--bg-deep);
      padding: 0.55rem 1.5rem; border-radius: 8px; border: none;
      cursor: pointer; font-family: var(--font);
      font-size: 0.85rem; font-weight: 600; transition: all 0.2s;
    }
    .wizard-btn-next:hover, .wizard-btn-submit:hover {
      box-shadow: 0 0 16px rgba(57, 168, 73, 0.3);
    }

    /* Review step */
    .wizard-review-section {
      margin-bottom: 1.25rem; padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    .wizard-review-section:last-child { border-bottom: none; }
    .wizard-review-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 0.5rem;
    }
    .wizard-review-header h4 {
      font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--accent);
    }
    .wizard-review-edit {
      font-size: 0.75rem; color: var(--text-tertiary); cursor: pointer;
      background: none; border: none; font-family: var(--font);
      transition: color 0.2s;
    }
    .wizard-review-edit:hover { color: var(--accent); }
    .wizard-review-row {
      display: flex; justify-content: space-between; padding: 0.25rem 0;
      font-size: 0.82rem;
    }
    .wizard-review-label { color: var(--text-tertiary); }
    .wizard-review-value { color: var(--text-primary); font-weight: 500; text-align: right; }

    .wizard-success {
      text-align: center; padding: 3rem 1rem;
    }
    .wizard-success h3 {
      font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    .wizard-success p {
      font-size: 0.95rem; color: var(--text-secondary);
    }

    .wizard-error {
      font-size: 0.875rem; color: #e74c3c; margin-bottom: 0.75rem;
    }

    .wizard-privacy {
      font-size: 0.78rem; color: var(--text-tertiary); line-height: 1.4;
    }

    /* File input styling */
    .file-input-wrapper {
      position: relative;
    }
    .file-input-wrapper input[type="file"] {
      position: absolute; inset: 0; opacity: 0; cursor: pointer;
    }
    .file-input-label {
      display: flex; align-items: center; gap: 0.5rem;
      background: var(--bg-elevated); border: 1px dashed var(--border);
      border-radius: var(--radius); padding: 0.75rem;
      font-size: 0.85rem; color: var(--text-tertiary);
      transition: border-color 0.2s;
    }
    .file-input-wrapper:hover .file-input-label { border-color: var(--border-accent); }
    .file-input-label.has-file { color: var(--text-primary); border-style: solid; border-color: var(--accent); }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 768px) {
      .job-card-header { flex-direction: column; }
      .job-card-actions { width: 100%; }
      .job-btn-details, .job-btn-apply { flex: 1; text-align: center; }
      .job-detail-grid { grid-template-columns: 1fr; }

      .wizard-overlay { align-items: flex-end; padding: 0; }
      .wizard-panel {
        padding: 1.75rem 1.25rem;
        border-radius: 16px 16px 0 0;
        max-height: 100dvh;
        -webkit-overflow-scrolling: touch;
        padding-bottom: calc(5rem + env(safe-area-inset-bottom, 1rem));
      }
      .wizard-actions {
        position: fixed; bottom: 0; left: 0; right: 0;
        background: var(--bg-card);
        padding: 1rem 1.25rem;
        padding-bottom: calc(1rem + env(safe-area-inset-bottom, 1rem));
        border-top: 1px solid var(--border); z-index: 2001;
      }

      .engage-form-row { grid-template-columns: 1fr; }
    }

    @media (max-width: 480px) {
      .why-badges img { height: 30px; }
    }
  </style>
</head>
<body>

<!-- NAV (copy from index.html, add Careers link between Insights and Engage Us) -->
<nav id="nav">
  <div class="container">
    <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="26"></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#capabilities">Capabilities</a></li>
      <li><a href="index.html#approach">Approach</a></li>
      <li><a href="products/index.html">Products &amp; Services</a></li>
      <li><a href="index.html#about">About</a></li>
      <li><a href="blog/index.html">Insights</a></li>
      <li><a href="careers.html" class="active">Careers</a></li>
      <li><a href="#" class="nav-cta" data-engage aria-haspopup="dialog"><span>Engage Us</span></a></li>
      <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light/dark mode">☀</button></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
    </button>
  </div>
</nav>

<main id="main-content">
<div class="page-wrap">

  <!-- HERO -->
  <div class="careers-hero">
    <div class="careers-hero-bg" aria-hidden="true"></div>
    <div class="careers-hero-content">
      <div class="breadcrumb">
        <a href="index.html">Home</a>
        <span>/</span>
        <span>Careers</span>
      </div>
      <span class="label reveal">Careers</span>
      <h1 class="reveal">Join Anywise</h1>
      <p class="reveal">Help build sovereign, ethical technology for the organisations that protect and serve Australia. We're looking for people who care about the work as much as the craft.</p>
    </div>
  </div>

  <!-- JOB LISTINGS -->
  <section class="careers-section">
    <h2 class="reveal">Current Openings</h2>
    <p class="section-sub reveal">Explore our open roles and find where you fit.</p>

    <div class="job-list" id="jobList">
      <!-- Job cards rendered by JS -->
    </div>

    <div class="job-empty" id="jobEmpty" hidden>
      <p>No open roles right now — <a href="#eoi-section">register your interest</a> below.</p>
    </div>
  </section>

  <!-- EOI SECTION -->
  <section class="eoi-section" id="eoi-section">
    <div class="eoi-bg" aria-hidden="true"></div>
    <div class="eoi-content">
      <h2 class="reveal">Don't see the right role?</h2>
      <p class="section-sub reveal">Register your interest and we'll be in touch when something relevant comes up.</p>

      <form class="engage-form reveal" id="eoiForm">
        <div class="engage-form-row">
          <div class="engage-group">
            <label for="eoiName">Full name <span aria-hidden="true">*</span></label>
            <input id="eoiName" name="name" type="text" placeholder="Jane Smith" autocomplete="name" required>
          </div>
          <div class="engage-group">
            <label for="eoiEmail">Email <span aria-hidden="true">*</span></label>
            <input id="eoiEmail" name="email" type="email" placeholder="jane@example.com" autocomplete="email" required>
          </div>
        </div>

        <div class="engage-group">
          <label for="eoiDiscipline">Area of interest <span aria-hidden="true">*</span></label>
          <select id="eoiDiscipline" name="discipline" required>
            <option value="" disabled selected>Select one…</option>
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

        <div class="engage-group">
          <label for="eoiMessage">Tell us about yourself <span aria-hidden="true">*</span></label>
          <textarea id="eoiMessage" name="message" placeholder="What experience do you bring and what kind of work excites you?" required></textarea>
        </div>

        <div class="engage-group">
          <label for="eoiCv">Upload your CV <span style="color:var(--text-tertiary);">(optional)</span></label>
          <div class="file-input-wrapper">
            <input type="file" id="eoiCv" name="cv" accept=".pdf,.doc,.docx">
            <div class="file-input-label" id="eoiCvLabel">
              <span>Choose file… (.pdf, .doc, .docx)</span>
            </div>
          </div>
        </div>

        <div class="engage-actions">
          <p class="engage-privacy">Your details are never shared with third parties.</p>
          <button type="submit" class="btn btn-primary">Submit &rarr;</button>
        </div>
      </form>
    </div>
  </section>

</div>
</main>

<!-- FOOTER (copy from index.html, add Careers link in Company column) -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand"><img src="assets/Anywise_Logo.png" alt="Anywise" height="22"></a>
        <p>Sovereign, ethical technology and services for defence and government.</p>
        <p class="footer-legal">ABN 86 169 092 960 · B Corp Certified · Wholly Australian-Owned</p>
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
        <a href="products/fraud-analytics.html">Fraud Analytics</a>
        <a href="products/impact-framework.html">Impact Framework</a>
        <a href="products/fabhums.html">FABHUMS</a>
        <a href="products/campaide.html">CAMP|AIDE</a>
        <a href="products/ils.html">ILS</a>
        <a href="products/aide.html">AIDE</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="index.html#about">About</a>
        <a href="blog/index.html">Insights</a>
        <a href="careers.html">Careers</a>
        <a href="grievance-policy.html">Grievance Policy</a>
        <a href="whistleblower-policy.html">Whistleblower Policy</a>
        <a href="weapons-exclusion.html">Defence Disclosure</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
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
      Anywise accepts the invitation of the Uluru Statement from the Heart and recognises First Nations peoples as the traditional custodians of the lands on which we live and work. We pay our respects to Elders past, present, and emerging.
    </div>
  </div>
</footer>

<script src="shared.js"></script>
<script>
  /* Job rendering and wizard JS added in Task 3 and Task 4 */
</script>
</body>
</html>
```

Note: The exact nav, footer, and product links should be verified against the current `index.html` at implementation time — copy the live HTML rather than relying on this plan's snapshot.

- [ ] **Step 2: Open in browser and verify structure**

Open `careers.html` in a browser. Verify:
- Nav renders with Careers link active
- Hero shows with background image and overlay
- Empty state shows for job listings (JS not wired yet)
- EOI form renders with all fields
- Footer shows with Careers link in Company column
- Theme toggle works
- Mobile responsive at 768px breakpoint

- [ ] **Step 3: Commit**

```bash
git add careers.html
git commit -m "feat(careers): add careers.html page shell with hero, EOI form, and empty job list"
```

---

## Task 3: Job Card Rendering from `jobs.json`

**Files:**
- Modify: `careers.html` (inline `<script>` block)

Add JS to fetch `jobs.json`, render job cards, and handle expand/collapse.

- [ ] **Step 1: Add job rendering JS to careers.html**

Replace the empty `<script>` block at the bottom of `careers.html` with:

```javascript
(function () {
  var jobList = document.getElementById('jobList');
  var jobEmpty = document.getElementById('jobEmpty');

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function isExpired(closingDate) {
    if (!closingDate) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(closingDate + 'T23:59:59') < today;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderBadges(locations, type) {
    var badges = '';
    locations.forEach(function (loc) {
      badges += '<span class="job-badge">' + escapeHtml(loc) + '</span>';
    });
    if (type) {
      badges += '<span class="job-badge">' + escapeHtml(type) + '</span>';
    }
    return badges;
  }

  function renderList(items) {
    return '<ul>' + items.map(function (item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('') + '</ul>';
  }

  var whyAnywiseHTML = ''
    + '<div class="why-anywise">'
    + '  <h3>Why Anywise</h3>'
    + '  <p>Anywise is a certified B Corp and wholly Australian-owned technology company. '
    + 'We build sovereign, ethical solutions for defence and government — work that matters, '
    + 'delivered with integrity. We pay fairly, invest in our people, and hold ourselves '
    + 'accountable to the highest standards of governance and social responsibility.</p>'
    + '  <div class="why-badges">'
    + '    <img src="assets/images/certifications/bCorp.png" alt="B Corp Certified" loading="lazy">'
    + '    <img src="assets/images/certifications/australianOwned.png" alt="Australian Owned" loading="lazy">'
    + '    <img src="assets/images/certifications/WePayFairly.png" alt="We Pay Fairly" loading="lazy">'
    + '    <img src="assets/images/certifications/FACE.png" alt="FACE" loading="lazy">'
    + '    <img src="assets/images/certifications/ISO9001.jpg" alt="ISO 9001" loading="lazy">'
    + '    <img src="assets/images/certifications/BFTW-2022-Governance-Badge.png" alt="Best for the World — Governance" loading="lazy">'
    + '  </div>'
    + '</div>';

  fetch('jobs.json')
    .then(function (r) {
      if (!r.ok) throw new Error('Failed to load');
      return r.json();
    })
    .then(function (jobs) {
      /* Filter to active and not expired */
      var active = jobs.filter(function (j) {
        return j.active && !isExpired(j.closingDate);
      });

      if (!active.length) {
        jobEmpty.hidden = false;
        return;
      }

      active.forEach(function (job) {
        var card = document.createElement('div');
        card.className = 'job-card reveal';
        card.setAttribute('data-slug', job.slug);

        card.innerHTML = ''
          + '<div class="job-card-header">'
          + '  <div>'
          + '    <div class="job-card-title">' + escapeHtml(job.title) + '</div>'
          + '    <div class="job-card-badges">' + renderBadges(job.location, job.type) + '</div>'
          + '  </div>'
          + '  <div class="job-card-actions">'
          + '    <button class="job-btn-details" onclick="toggleJobDetails(this)">'
          + '      <span class="job-btn-details-text">View Details</span>'
          + '    </button>'
          + '    <button class="job-btn-apply" onclick="openApplicationWizard(\'' + job.slug + '\')">'
          + '      Apply Now →'
          + '    </button>'
          + '  </div>'
          + '</div>'
          + '<div class="job-card-desc">' + escapeHtml(job.shortDescription) + '</div>'
          + (job.closingDate
            ? '<div class="job-card-closing">Applications close ' + formatDate(job.closingDate) + '</div>'
            : '')
          + '<div class="job-card-details">'
          + '  <div class="job-detail-grid">'
          + '    <div class="job-detail-col">'
          + '      <h3>Responsibilities</h3>'
          + '      ' + renderList(job.responsibilities)
          + '    </div>'
          + '    <div class="job-detail-col">'
          + '      <h3>Requirements</h3>'
          + '      ' + renderList(job.requirements)
          + '    </div>'
          + '  </div>'
          + '  ' + whyAnywiseHTML
          + '</div>';

        jobList.appendChild(card);
      });

      /* Reveal observer for cards */
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
          });
        }, { threshold: 0.05 });
        jobList.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
      } else {
        jobList.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
      }

      /* Store jobs data for wizard */
      window.__jobs = active;
    })
    .catch(function () {
      jobEmpty.hidden = false;
    });

  /* Toggle job card expand/collapse */
  window.toggleJobDetails = function (btn) {
    var card = btn.closest('.job-card');
    card.classList.toggle('expanded');
    var isExpanded = card.classList.contains('expanded');
    btn.querySelector('.job-btn-details-text').textContent = isExpanded ? 'Hide Details' : 'View Details';
  };
})();
```

- [ ] **Step 2: Test in browser**

Open `careers.html`. Verify:
- Job card renders from `jobs.json` with title, badges, description, closing date
- "View Details" expands to show responsibilities, requirements, Why Anywise, badges
- "Hide Details" collapses it back
- If `jobs.json` has no active jobs or all are expired, empty state shows
- Scroll reveal animation works on cards

- [ ] **Step 3: Commit**

```bash
git add careers.html
git commit -m "feat(careers): add job card rendering from jobs.json with expand/collapse"
```

---

## Task 4: Application Wizard Overlay

**Files:**
- Modify: `careers.html` (add wizard HTML markup + wizard JS)

- [ ] **Step 1: Add wizard overlay HTML to `careers.html`**

Add this just before `</body>`, after the footer and before the `<script>` tags:

```html
<!-- APPLICATION WIZARD -->
<div class="wizard-overlay" id="wizardOverlay" role="dialog" aria-modal="true" aria-labelledby="wizardTitle" hidden>
  <div class="wizard-panel">
    <button class="wizard-close" id="wizardClose" aria-label="Close">&times;</button>

    <div class="wizard-role-title" id="wizardRoleTitle"></div>
    <h2 id="wizardTitle">Apply Now</h2>
    <p class="wizard-sub">Complete the steps below to submit your application.</p>

    <!-- Progress bar -->
    <div class="wizard-progress">
      <div class="wizard-step-indicator active" data-step="1">Your Details</div>
      <div class="wizard-step-indicator" data-step="2">Eligibility</div>
      <div class="wizard-step-indicator" data-step="3">Experience</div>
      <div class="wizard-step-indicator" data-step="4">Review &amp; Submit</div>
    </div>

    <form id="wizardForm" novalidate>
      <!-- Step 1: Your Details -->
      <div class="wizard-step active" data-step="1">
        <div class="engage-form-row">
          <div class="engage-group">
            <label for="wizName">Full name <span aria-hidden="true">*</span></label>
            <input id="wizName" name="name" type="text" placeholder="Jane Smith" autocomplete="name" required>
          </div>
          <div class="engage-group">
            <label for="wizEmail">Email <span aria-hidden="true">*</span></label>
            <input id="wizEmail" name="email" type="email" placeholder="jane@example.com" autocomplete="email" required>
          </div>
        </div>
        <div class="engage-form-row">
          <div class="engage-group">
            <label for="wizPhone">Phone <span aria-hidden="true">*</span></label>
            <input id="wizPhone" name="phone" type="tel" placeholder="0412 345 678" autocomplete="tel" required>
          </div>
          <div class="engage-group">
            <label for="wizLinkedin">LinkedIn URL</label>
            <input id="wizLinkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" autocomplete="url">
          </div>
        </div>
      </div>

      <!-- Step 2: Eligibility -->
      <div class="wizard-step" data-step="2">
        <div class="engage-group">
          <label for="wizCitizenship">Australian citizenship / work rights <span aria-hidden="true">*</span></label>
          <select id="wizCitizenship" name="citizenship" required>
            <option value="" disabled selected>Select one…</option>
            <option value="Australian Citizen">Australian Citizen</option>
            <option value="Permanent Resident">Permanent Resident</option>
            <option value="Visa Holder">Visa Holder</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="engage-group" id="wizCitizenshipDetailGroup" hidden>
          <label for="wizCitizenshipDetail">Please provide details <span aria-hidden="true">*</span></label>
          <input id="wizCitizenshipDetail" name="citizenshipDetail" type="text" placeholder="e.g. Visa subclass, expiry date">
        </div>
      </div>

      <!-- Step 3: Experience -->
      <div class="wizard-step" data-step="3">
        <div class="engage-group">
          <label for="wizCv">Upload your CV <span aria-hidden="true">*</span></label>
          <div class="file-input-wrapper">
            <input type="file" id="wizCv" name="cv" accept=".pdf,.doc,.docx" required>
            <div class="file-input-label" id="wizCvLabel">
              <span>Choose file… (.pdf, .doc, .docx)</span>
            </div>
          </div>
        </div>
        <div class="engage-group">
          <label for="wizCover">Cover letter / message <span aria-hidden="true">*</span></label>
          <textarea id="wizCover" name="coverLetter" placeholder="Tell us why you're interested in this role and what you'd bring to Anywise…" required></textarea>
        </div>
        <div class="engage-form-row">
          <div class="engage-group">
            <label for="wizNotice">Notice period <span aria-hidden="true">*</span></label>
            <select id="wizNotice" name="noticePeriod" required>
              <option value="" disabled selected>Select one…</option>
              <option value="Available immediately">Available immediately</option>
              <option value="2 weeks">2 weeks</option>
              <option value="4 weeks">4 weeks</option>
              <option value="3+ months">3+ months</option>
            </select>
          </div>
          <div class="engage-group">
            <label for="wizSalary">Salary expectations</label>
            <input id="wizSalary" name="salaryExpectation" type="text" placeholder="e.g. $120k–$140k or negotiable">
          </div>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div class="wizard-step" data-step="4">
        <div id="wizardReview">
          <!-- Populated by JS -->
        </div>
        <p class="wizard-privacy">By submitting this application you consent to Anywise storing your details for recruitment purposes. Your data is never shared with third parties.</p>
      </div>

      <!-- Navigation -->
      <div class="wizard-actions">
        <button type="button" class="wizard-btn-back" id="wizardBack" hidden>← Back</button>
        <span></span>
        <button type="button" class="wizard-btn-next" id="wizardNext">Next →</button>
        <button type="submit" class="wizard-btn-submit" id="wizardSubmit" hidden>Submit Application →</button>
      </div>
    </form>
  </div>
</div>
```

- [ ] **Step 2: Add wizard JS to careers.html inline script**

Append this to the existing `<script>` block (after the job rendering IIFE):

```javascript
(function () {
  var overlay = document.getElementById('wizardOverlay');
  var form = document.getElementById('wizardForm');
  var steps = overlay.querySelectorAll('.wizard-step');
  var indicators = overlay.querySelectorAll('.wizard-step-indicator');
  var btnBack = document.getElementById('wizardBack');
  var btnNext = document.getElementById('wizardNext');
  var btnSubmit = document.getElementById('wizardSubmit');
  var reviewContainer = document.getElementById('wizardReview');
  var currentStep = 1;
  var currentSlug = '';
  var wizardHasData = false;

  /* WORKER_URL will be set during deployment — use relative path or env */
  var WORKER_URL = 'https://careers-api.anywise.com.au';

  /* Open wizard */
  window.openApplicationWizard = function (slug) {
    currentSlug = slug;
    var job = (window.__jobs || []).find(function (j) { return j.slug === slug; });
    var roleTitle = document.getElementById('wizardRoleTitle');
    roleTitle.textContent = job ? 'Applying for: ' + job.title : '';

    /* Reset form and state */
    form.reset();
    currentStep = 1;
    wizardHasData = false;
    updateFileLabels();
    showStep(1);

    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add('open');
    });
    document.body.style.overflow = 'hidden';

    /* Focus first input */
    var firstInput = steps[0].querySelector('input, select, textarea');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 300);
  };

  /* Close wizard */
  function closeWizard() {
    if (wizardHasData && !confirm('Are you sure? Your application data will be lost.')) return;
    overlay.classList.remove('open');
    setTimeout(function () { overlay.hidden = true; }, 300);
    document.body.style.overflow = '';
  }

  document.getElementById('wizardClose').addEventListener('click', closeWizard);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeWizard();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeWizard();
  });

  /* Track data entry */
  form.addEventListener('input', function () { wizardHasData = true; });

  /* Step navigation */
  function showStep(step) {
    currentStep = step;
    steps.forEach(function (s) {
      s.classList.toggle('active', parseInt(s.dataset.step) === step);
    });
    indicators.forEach(function (ind) {
      var indStep = parseInt(ind.dataset.step);
      ind.classList.toggle('active', indStep === step);
      ind.classList.toggle('completed', indStep < step);
    });
    btnBack.hidden = step === 1;
    btnNext.hidden = step === 4;
    btnSubmit.hidden = step !== 4;

    if (step === 4) buildReview();

    /* Remove previous errors */
    var prevErr = form.querySelector('.wizard-error');
    if (prevErr) prevErr.remove();
  }

  btnBack.addEventListener('click', function () {
    if (currentStep > 1) showStep(currentStep - 1);
  });

  btnNext.addEventListener('click', function () {
    if (!validateStep(currentStep)) return;
    if (currentStep < 4) showStep(currentStep + 1);
  });

  /* Conditional citizenship detail field */
  var citizenshipSelect = document.getElementById('wizCitizenship');
  var citizenshipDetailGroup = document.getElementById('wizCitizenshipDetailGroup');
  var citizenshipDetail = document.getElementById('wizCitizenshipDetail');

  citizenshipSelect.addEventListener('change', function () {
    var needsDetail = citizenshipSelect.value === 'Visa Holder' || citizenshipSelect.value === 'Other';
    citizenshipDetailGroup.hidden = !needsDetail;
    citizenshipDetail.required = needsDetail;
  });

  /* File input labels */
  function updateFileLabels() {
    ['wizCv'].forEach(function (id) {
      var input = document.getElementById(id);
      var label = document.getElementById(id + 'Label');
      if (input && label) {
        var span = label.querySelector('span');
        if (input.files && input.files.length > 0) {
          span.textContent = input.files[0].name;
          label.classList.add('has-file');
        } else {
          span.textContent = 'Choose file… (.pdf, .doc, .docx)';
          label.classList.remove('has-file');
        }
      }
    });
  }

  document.getElementById('wizCv').addEventListener('change', updateFileLabels);

  /* Validation */
  function validateStep(step) {
    var stepEl = overlay.querySelector('.wizard-step[data-step="' + step + '"]');
    var fields = stepEl.querySelectorAll('[required]');
    var valid = true;

    fields.forEach(function (field) {
      if (field.closest('[hidden]')) return; /* skip hidden fields */
      field.classList.remove('invalid');
      if (!field.value || !field.value.trim()) {
        field.classList.add('invalid');
        valid = false;
      }
      /* Email validation */
      if (field.type === 'email' && field.value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          field.classList.add('invalid');
          valid = false;
        }
      }
      /* File validation */
      if (field.type === 'file' && field.required) {
        if (!field.files || field.files.length === 0) {
          valid = false;
        } else {
          var file = field.files[0];
          var allowed = ['.pdf', '.doc', '.docx'];
          var ext = '.' + file.name.split('.').pop().toLowerCase();
          if (allowed.indexOf(ext) === -1) {
            valid = false;
          }
          if (file.size > 10 * 1024 * 1024) { /* 10MB */
            valid = false;
          }
        }
      }
    });

    if (!valid) {
      var errEl = document.createElement('p');
      errEl.className = 'wizard-error';
      errEl.textContent = 'Please complete all required fields.';
      var prevErr = form.querySelector('.wizard-error');
      if (prevErr) prevErr.remove();
      var actions = overlay.querySelector('.wizard-actions');
      actions.parentElement.insertBefore(errEl, actions);
    }

    return valid;
  }

  /* Build review summary */
  function buildReview() {
    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (value, key) { data[key] = value; });

    var cvFile = document.getElementById('wizCv').files[0];
    var cvName = cvFile ? cvFile.name : 'None';

    reviewContainer.innerHTML = ''
      + reviewSection('Your Details', 1, [
          ['Full name', data.name || ''],
          ['Email', data.email || ''],
          ['Phone', data.phone || ''],
          ['LinkedIn', data.linkedin || 'Not provided']
        ])
      + reviewSection('Eligibility', 2, [
          ['Work rights', data.citizenship || ''],
          data.citizenshipDetail ? ['Details', data.citizenshipDetail] : null
        ].filter(Boolean))
      + reviewSection('Experience', 3, [
          ['CV', cvName],
          ['Cover letter', (data.coverLetter || '').substring(0, 120) + (data.coverLetter && data.coverLetter.length > 120 ? '…' : '')],
          ['Notice period', data.noticePeriod || ''],
          ['Salary expectations', data.salaryExpectation || 'Not provided']
        ]);
  }

  function reviewSection(title, step, rows) {
    var rowsHtml = rows.map(function (r) {
      return '<div class="wizard-review-row">'
        + '<span class="wizard-review-label">' + r[0] + '</span>'
        + '<span class="wizard-review-value">' + escapeHtml(r[1]) + '</span>'
        + '</div>';
    }).join('');

    return '<div class="wizard-review-section">'
      + '<div class="wizard-review-header">'
      + '  <h4>' + title + '</h4>'
      + '  <button type="button" class="wizard-review-edit" onclick="showStep(' + step + ')">Edit</button>'
      + '</div>'
      + rowsHtml
      + '</div>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  /* Expose showStep for review edit buttons */
  window.showStep = showStep;

  /* Form submission */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(4)) return;

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Submitting…';

    var prevErr = form.querySelector('.wizard-error');
    if (prevErr) prevErr.remove();

    var fd = new FormData(form);
    fd.append('role', currentSlug);

    /* Find role title */
    var job = (window.__jobs || []).find(function (j) { return j.slug === currentSlug; });
    if (job) fd.append('roleTitle', job.title);

    fetch(WORKER_URL + '/apply', {
      method: 'POST',
      body: fd
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success) {
          var panel = overlay.querySelector('.wizard-panel');
          panel.innerHTML = ''
            + '<button class="wizard-close" onclick="document.getElementById(\'wizardOverlay\').classList.remove(\'open\');'
            + 'setTimeout(function(){document.getElementById(\'wizardOverlay\').hidden=true;},300);'
            + 'document.body.style.overflow=\'\';" aria-label="Close">&times;</button>'
            + '<div class="wizard-success">'
            + '  <h3>Thanks for applying!</h3>'
            + '  <p>We\'ve received your application' + (job ? ' for ' + job.title : '') + ' and will be in touch.</p>'
            + '</div>';
        } else {
          throw new Error(result.message || 'Something went wrong');
        }
      })
      .catch(function (err) {
        var errEl = document.createElement('p');
        errEl.className = 'wizard-error';
        errEl.textContent = err.message || 'Failed to submit. Please try again.';
        var actions = overlay.querySelector('.wizard-actions');
        if (actions) actions.parentElement.insertBefore(errEl, actions);
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Submit Application →';
      });
  });
})();
```

- [ ] **Step 3: Test wizard flow in browser**

Open `careers.html`. Click "Apply Now" on a job card. Verify:
- Overlay opens with role title at top
- Progress bar shows Step 1 active
- "Next" validates fields before advancing
- Conditional citizenship detail field shows for Visa Holder / Other
- File input label updates with filename
- Step 4 shows review summary with edit buttons
- "Edit" buttons jump back to correct step
- Close button shows confirmation if data entered
- ESC key closes with confirmation
- Mobile responsive: overlay slides up from bottom

- [ ] **Step 4: Commit**

```bash
git add careers.html
git commit -m "feat(careers): add 4-step application wizard overlay with validation and review"
```

---

## Task 5: EOI Form Submission Handler

**Files:**
- Modify: `careers.html` (add EOI JS to inline script)

- [ ] **Step 1: Add EOI form handler JS**

Append to the inline `<script>` block in `careers.html`:

```javascript
(function () {
  var eoiForm = document.getElementById('eoiForm');
  if (!eoiForm) return;

  var WORKER_URL = 'https://careers-api.anywise.com.au';

  /* File input label for EOI CV */
  var eoiCv = document.getElementById('eoiCv');
  var eoiCvLabel = document.getElementById('eoiCvLabel');
  if (eoiCv && eoiCvLabel) {
    eoiCv.addEventListener('change', function () {
      var span = eoiCvLabel.querySelector('span');
      if (eoiCv.files && eoiCv.files.length > 0) {
        span.textContent = eoiCv.files[0].name;
        eoiCvLabel.classList.add('has-file');
      } else {
        span.textContent = 'Choose file… (.pdf, .doc, .docx)';
        eoiCvLabel.classList.remove('has-file');
      }
    });
  }

  eoiForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = eoiForm.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    var prevErr = eoiForm.querySelector('.engage-error');
    if (prevErr) prevErr.remove();

    var fd = new FormData(eoiForm);

    fetch(WORKER_URL + '/eoi', {
      method: 'POST',
      body: fd
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success) {
          eoiForm.innerHTML = '<div class="engage-success">'
            + '<h3>Thanks for your interest!</h3>'
            + '<p>We\'ll keep your details on file and be in touch when a relevant opportunity arises.</p>'
            + '</div>';
        } else {
          throw new Error(result.message || 'Something went wrong');
        }
      })
      .catch(function (err) {
        var errEl = document.createElement('p');
        errEl.className = 'engage-error';
        errEl.textContent = err.message || 'Failed to submit. Please try again.';
        errEl.style.color = '#e74c3c';
        errEl.style.fontSize = '0.875rem';
        errEl.style.marginBottom = '0.75rem';
        var actionsDiv = eoiForm.querySelector('.engage-actions');
        if (actionsDiv) actionsDiv.parentElement.insertBefore(errEl, actionsDiv);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
})();
```

- [ ] **Step 2: Test EOI form in browser**

Verify:
- Form validates required fields
- File input label updates
- Submit shows loading state
- (Actual submission will fail until Worker is deployed — verify the fetch is called with correct FormData by checking Network tab)

- [ ] **Step 3: Commit**

```bash
git add careers.html
git commit -m "feat(careers): add EOI form submission handler"
```

---

## Task 6: Cloudflare Worker — Project Setup

**Files:**
- Create: `workers/careers-api/package.json`
- Create: `workers/careers-api/tsconfig.json`
- Create: `workers/careers-api/wrangler.toml`
- Create: `workers/careers-api/src/index.ts`

- [ ] **Step 1: Create worker project directory and config files**

```bash
mkdir -p workers/careers-api/src
```

`workers/careers-api/package.json`:

```json
{
  "name": "anywise-careers-api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240000.0",
    "typescript": "^5.5.0",
    "wrangler": "^4.0.0"
  }
}
```

`workers/careers-api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"]
}
```

`workers/careers-api/wrangler.toml`:

```toml
name = "anywise-careers-api"
main = "src/index.ts"
compatibility_date = "2024-12-01"

[[r2_buckets]]
binding = "CV_BUCKET"
bucket_name = "anywise-careers-cv"

[[ratelimits]]
name = "CAREERS_RATE_LIMITER"
namespace_id = "1001"

  [ratelimits.simple]
  limit = 5
  period = 60

[vars]
CORS_ORIGIN = "https://anywise.com.au"
CLICKUP_LIST_ID = ""
```

Note: `CLICKUP_LIST_ID` will be set after creating the ClickUp list. Secrets (`CLICKUP_API_KEY`, `WEB3FORMS_ACCESS_KEY`) are added via `wrangler secret put`.

- [ ] **Step 2: Install dependencies**

```bash
cd workers/careers-api && npm install
```

- [ ] **Step 3: Commit**

```bash
cd ../..
git add workers/
git commit -m "feat(careers): scaffold Cloudflare Worker project with wrangler config"
```

---

## Task 7: Cloudflare Worker — Implementation

**Files:**
- Create: `workers/careers-api/src/index.ts`

- [ ] **Step 1: Implement the Worker**

```typescript
interface Env {
  CV_BUCKET: R2Bucket;
  CAREERS_RATE_LIMITER: RateLimit;
  CORS_ORIGIN: string;
  CLICKUP_API_KEY: string;
  CLICKUP_LIST_ID: string;
  WEB3FORMS_ACCESS_KEY: string;
}

interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const headers = corsHeaders(env.CORS_ORIGIN);

    /* CORS preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    /* Only allow POST */
    if (request.method !== 'POST') {
      return Response.json({ success: false, message: 'Method not allowed' }, { status: 405, headers });
    }

    /* Rate limiting */
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitResult = await env.CAREERS_RATE_LIMITER.limit({ key: clientIP });
    if (!rateLimitResult.success) {
      return Response.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429, headers }
      );
    }

    try {
      if (url.pathname === '/apply') {
        return await handleApply(request, env, headers);
      } else if (url.pathname === '/eoi') {
        return await handleEOI(request, env, headers);
      } else {
        return Response.json({ success: false, message: 'Not found' }, { status: 404, headers });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      return Response.json({ success: false, message }, { status: 500, headers });
    }
  },
} satisfies ExportedHandler<Env>;

/* ── Apply handler ── */

async function handleApply(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const linkedin = formData.get('linkedin') as string || '';
  const citizenship = formData.get('citizenship') as string;
  const citizenshipDetail = formData.get('citizenshipDetail') as string || '';
  const coverLetter = formData.get('coverLetter') as string;
  const noticePeriod = formData.get('noticePeriod') as string;
  const salaryExpectation = formData.get('salaryExpectation') as string || '';
  const role = formData.get('role') as string;
  const roleTitle = formData.get('roleTitle') as string || role;
  const cvFile = formData.get('cv') as File | null;

  /* Validate required fields */
  if (!name || !email || !phone || !citizenship || !coverLetter || !noticePeriod || !role) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400, headers });
  }

  /* Upload CV to R2 */
  let cvUrl = '';
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      return Response.json({ success: false, message: 'Invalid file type. Accepted: .pdf, .doc, .docx' }, { status: 400, headers });
    }
    if (cvFile.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large. Maximum 10MB.' }, { status: 400, headers });
    }

    const timestamp = Date.now();
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const key = `cv/${timestamp}-${safeName}.${ext}`;
    await env.CV_BUCKET.put(key, cvFile.stream(), {
      httpMetadata: { contentType: cvFile.type },
      customMetadata: { applicantName: name, role: role },
    });
    cvUrl = key;
  }

  /* Create ClickUp task */
  const taskDescription = [
    `## Application: ${roleTitle}`,
    '',
    '### Contact',
    `- **Name:** ${name}`,
    `- **Email:** ${email}`,
    `- **Phone:** ${phone}`,
    linkedin ? `- **LinkedIn:** ${linkedin}` : '',
    '',
    '### Eligibility',
    `- **Work Rights:** ${citizenship}`,
    citizenshipDetail ? `- **Details:** ${citizenshipDetail}` : '',
    '',
    '### Experience',
    `- **Notice Period:** ${noticePeriod}`,
    salaryExpectation ? `- **Salary Expectations:** ${salaryExpectation}` : '',
    cvUrl ? `- **CV:** Uploaded to R2 (key: ${cvUrl})` : '- **CV:** Not uploaded',
    '',
    '### Cover Letter',
    coverLetter,
  ].filter(Boolean).join('\n');

  await createClickUpTask(env, `${roleTitle} — ${name}`, taskDescription, ['application']);

  /* Send email via Web3Forms */
  await sendEmail(env, {
    subject: `New Application: ${roleTitle} — ${name}`,
    message: `New application received for ${roleTitle}.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nWork Rights: ${citizenship}\nNotice Period: ${noticePeriod}\n\nCheck ClickUp for full details.`,
    from_name: 'Anywise Careers',
  });

  return Response.json({ success: true, message: 'Application submitted' }, { headers });
}

/* ── EOI handler ── */

async function handleEOI(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const discipline = formData.get('discipline') as string;
  const message = formData.get('message') as string;
  const cvFile = formData.get('cv') as File | null;

  if (!name || !email || !discipline || !message) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400, headers });
  }

  /* Optional CV upload */
  let cvUrl = '';
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (ext && allowed.includes(ext) && cvFile.size <= 10 * 1024 * 1024) {
      const timestamp = Date.now();
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const key = `cv/eoi-${timestamp}-${safeName}.${ext}`;
      await env.CV_BUCKET.put(key, cvFile.stream(), {
        httpMetadata: { contentType: cvFile.type },
        customMetadata: { applicantName: name, type: 'eoi' },
      });
      cvUrl = key;
    }
  }

  const taskDescription = [
    '## Expression of Interest',
    '',
    `- **Name:** ${name}`,
    `- **Email:** ${email}`,
    `- **Area of Interest:** ${discipline}`,
    cvUrl ? `- **CV:** Uploaded to R2 (key: ${cvUrl})` : '',
    '',
    '### Message',
    message,
  ].filter(Boolean).join('\n');

  await createClickUpTask(env, `EOI — ${name} (${discipline})`, taskDescription, ['eoi']);

  await sendEmail(env, {
    subject: `New EOI: ${name} — ${discipline}`,
    message: `New expression of interest received.\n\nName: ${name}\nEmail: ${email}\nArea: ${discipline}\n\nMessage:\n${message}`,
    from_name: 'Anywise Careers',
  });

  return Response.json({ success: true, message: 'Expression of interest submitted' }, { headers });
}

/* ── Helpers ── */

async function createClickUpTask(
  env: Env,
  name: string,
  description: string,
  tags: string[]
): Promise<void> {
  const response = await fetch(
    `https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_ID}/task`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': env.CLICKUP_API_KEY,
      },
      body: JSON.stringify({
        name,
        description,
        tags,
        status: 'to do',
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error('ClickUp error:', err);
    /* Don't throw — application was received even if ClickUp fails */
  }
}

async function sendEmail(
  env: Env,
  opts: { subject: string; message: string; from_name: string }
): Promise<void> {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_ACCESS_KEY,
      subject: opts.subject,
      message: opts.message,
      from_name: opts.from_name,
      botcheck: '',
    }),
  });

  if (!response.ok) {
    console.error('Web3Forms error:', await response.text());
  }
}
```

- [ ] **Step 2: Type check**

```bash
cd workers/careers-api && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Test locally with wrangler dev**

```bash
npx wrangler dev
```

Note: R2 and rate limiting won't work locally without setup. Verify the Worker starts and responds to requests on the correct routes. Use curl to test:

```bash
curl -X POST http://localhost:8787/apply -F "name=Test" -F "email=test@example.com" -F "phone=0400000000" -F "citizenship=Australian Citizen" -F "coverLetter=Test" -F "noticePeriod=Available immediately" -F "role=test-role"
```

Expected: Response (may error on ClickUp/R2 but should not crash).

- [ ] **Step 4: Commit**

```bash
cd ../..
git add workers/careers-api/src/index.ts
git commit -m "feat(careers): implement Cloudflare Worker with /apply and /eoi endpoints"
```

---

## Task 8: Update Nav and Footer on All Existing Pages

**Files to modify (25 files total):**

Root pages (7):
- `index.html`
- `privacy.html`
- `terms.html`
- `grievance-policy.html`
- `whistleblower-policy.html`
- `weapons-exclusion.html`
- `datavault-example.html`

Products (9):
- `products/index.html`
- `products/wisdom.html`
- `products/engaide.html`
- `products/fraud-analytics.html`
- `products/impact-framework.html`
- `products/fabhums.html`
- `products/campaide.html`
- `products/ils.html`
- `products/aide.html`

Blog (5):
- `blog/index.html`
- `blog/post.html`
- `blog/commitment-to-ethical-quality-business.html`
- `blog/dcsp-catalyst-for-real-change.html`
- `blog/transforming-operational-challenges.html`
- `blog/vicworx-preparing-for-lift-off.html`

Engage (1):
- `engage/index.html`

Template pages (6 — update to keep templates in sync):
- `template/pages/home.html`
- `template/pages/engage.html`
- `template/pages/blog-post.html`
- `template/pages/blog-index.html`
- `template/pages/product-detail.html`
- `template/pages/product-index.html`

- [ ] **Step 1: Nav update — root-level pages**

For each root-level HTML file, find the nav `<ul class="nav-links">` and add between the Insights `<li>` and the Engage Us `<li>`:

```html
<li><a href="careers.html">Careers</a></li>
```

For `index.html` specifically, also add the 7th mobile animation delay to the `<style>` block — find the existing `nth-child(6)` rule and add after it:

```css
.nav-links.open li:nth-child(7) a { animation-delay: 0.35s; }
.nav-links.open li:nth-child(8) a { animation-delay: 0.4s; }
```

(7 = Careers, 8 = Engage Us CTA, which shifts from 6th to 8th with the theme toggle)

- [ ] **Step 2: Nav update — subdirectory pages**

For each file in `products/`, `blog/`, `engage/`, and `template/pages/`, add between Insights and Engage Us:

```html
<li><a href="../careers.html">Careers</a></li>
```

- [ ] **Step 3: Footer update — root-level pages**

For each root-level HTML file, find the Company `<div class="footer-col">` and add between the Insights link and the Grievance Policy link:

```html
<a href="careers.html">Careers</a>
```

- [ ] **Step 4: Footer update — subdirectory pages**

For each subdirectory file, add between Insights and Grievance Policy in the Company footer column:

```html
<a href="../careers.html">Careers</a>
```

- [ ] **Step 5: Verify all pages**

Spot-check at least 3 pages (one root, one product, one blog):
- Careers link appears in nav between Insights and Engage Us
- Careers link appears in footer Company column
- Links resolve correctly (no 404s)
- Mobile nav animation still flows smoothly

- [ ] **Step 6: Commit**

```bash
git add index.html privacy.html terms.html grievance-policy.html whistleblower-policy.html weapons-exclusion.html datavault-example.html products/ blog/ engage/ template/
git commit -m "feat(careers): add Careers link to nav and footer across all pages"
```

---

## Task 9: Cloudflare Worker Deployment & Integration

**Files:**
- Modify: `workers/careers-api/wrangler.toml` (set CLICKUP_LIST_ID)
- Modify: `careers.html` (update WORKER_URL to production URL)

This task covers the deployment steps. Some steps require access to Cloudflare dashboard and ClickUp.

- [ ] **Step 1: Create R2 bucket**

```bash
cd workers/careers-api
npx wrangler r2 bucket create anywise-careers-cv
```

- [ ] **Step 2: Create ClickUp list for applications**

Use the ClickUp MCP to create a new list called "Careers Applications" in the Anywise Website folder. Record the list ID.

- [ ] **Step 3: Set Worker secrets and vars**

```bash
echo "<your-clickup-api-key>" | npx wrangler secret put CLICKUP_API_KEY
echo "f1275295-758d-4103-b3e7-055977430b13" | npx wrangler secret put WEB3FORMS_ACCESS_KEY
```

Update `wrangler.toml` with the ClickUp list ID:

```toml
[vars]
CORS_ORIGIN = "https://anywise.com.au"
CLICKUP_LIST_ID = "<the-list-id-from-step-2>"
```

- [ ] **Step 4: Deploy Worker**

```bash
npx wrangler deploy
```

Record the deployed Worker URL (e.g. `https://anywise-careers-api.<your-subdomain>.workers.dev`).

- [ ] **Step 5: Configure custom domain (optional)**

If using a custom domain like `careers-api.anywise.com.au`, configure the route in Cloudflare dashboard or `wrangler.toml`:

```toml
[routes]
pattern = "careers-api.anywise.com.au/*"
```

- [ ] **Step 6: Update WORKER_URL in careers.html**

Find both `WORKER_URL` variables in the inline script (application wizard and EOI handler) and update to the production URL:

```javascript
var WORKER_URL = 'https://careers-api.anywise.com.au';
```

- [ ] **Step 7: End-to-end test**

1. Open `careers.html` on the live site
2. Click "Apply Now" on a job listing
3. Complete all 4 wizard steps with test data
4. Submit — verify success message appears
5. Check ClickUp "Careers Applications" list for new task
6. Check email at `admin@anywise.com.au` for notification
7. Check R2 bucket for uploaded CV
8. Submit EOI form — verify same flow works
9. Test rate limiting: submit 6 times rapidly — 6th should be rejected

- [ ] **Step 8: Commit final integration**

```bash
cd ../..
git add careers.html workers/careers-api/wrangler.toml
git commit -m "feat(careers): connect frontend to deployed Cloudflare Worker"
```

---

## Task 10: Final Polish and Validation

**Files:**
- Modify: `careers.html` (any fixes from testing)

- [ ] **Step 1: Cross-browser testing**

Test in Chrome, Safari, Firefox, and mobile Safari/Chrome:
- Hero image displays with overlay
- Job cards expand/collapse
- Wizard overlay opens/closes correctly
- File upload works
- EOI form submits
- Theme toggle works on careers page (light and dark mode)

- [ ] **Step 2: Accessibility check**

Verify:
- All form fields have labels
- Wizard overlay has `role="dialog"` and `aria-modal="true"`
- Close buttons have `aria-label`
- Focus trapped in wizard overlay when open
- Keyboard navigation works (Tab through fields, Escape to close)

- [ ] **Step 3: SEO check**

Verify in `careers.html`:
- `<title>` is "Careers | Anywise — Sovereign Technology for Defence & Government"
- `<meta name="description">` present
- Open Graph tags present with hero image
- `<h1>` is the only h1 on the page
- Semantic HTML (`<main>`, `<section>`, `<nav>`, `<footer>`)

- [ ] **Step 4: Fix any issues found**

Address any bugs or issues from steps 1–3.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix(careers): polish and accessibility fixes from testing"
```
