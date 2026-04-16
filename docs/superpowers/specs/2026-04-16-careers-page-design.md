# Careers Page — Design Spec

**Date:** 2026-04-16
**ClickUp:** ANYHQ-7160
**Status:** Approved

---

## Overview

Add a Careers page to the Anywise website with two functions:

1. **Job Board** — multiple concurrent listings rendered from `jobs.json`, each with an "Apply Now" button that opens a multi-step application wizard overlay
2. **Expression of Interest (EOI)** — a simpler form below the listings for candidates who don't see a matching role

Applications submit to a **Cloudflare Worker** backend that creates a ClickUp task and sends an email notification to `admin@anywise.com.au`.

---

## Page Structure — `careers.html`

Single page, three zones:

### 1. Page Hero

Standard `.page-hero` pattern:
- Breadcrumb: Home / Careers
- Label: "Careers"
- H1: "Join Anywise"
- Description paragraph about working at Anywise
- **Background image:** `team-photo-alt.jpg` (Anywise team at defence field site)

### 2. Job Listings Section

- Heading: "Current Openings"
- Subtext: "Explore our open roles and find where you fit."
- Job cards rendered dynamically from `jobs.json`
- **Empty state** when no active listings: "No open roles right now — register your interest below."

**Each job card (collapsed):**
- Job title
- Location badge(s) + employment type badge (pill-style, green accent)
- Short description (2–3 sentences)
- "View Details" button — expands card inline
- "Apply Now" button — opens application wizard overlay

**Each job card (expanded):**
- All collapsed content plus:
- Responsibilities (bullet list)
- Requirements (bullet list)
- **Why Anywise** — shared company-level content (B Corp, mission, culture, benefits)
- Certification badges row: B Corp, Australian Owned, We Pay Fairly, FACE, ISO 9001, Best for the World (Governance)

**Card design:** Clean text-only, no imagery on cards. Location and type shown as small pill badges.

### 3. EOI Section

- Heading: "Don't see the right role?"
- Subtext: "Register your interest and we'll be in touch when something relevant comes up."
- **Background:** `bridge.jpg` as subtle background/accent
- Form fields:
  - Full name (text, required)
  - Email (email, required)
  - Area of interest (dropdown, required): Software Engineering, Data Engineering / Analytics, Cyber Security, Project / Programme Management, Business Analysis, Defence / Government Advisory, Design / UX, Operations / Corporate, Other
  - Tell us about yourself (textarea, required)
  - Upload CV (file, optional — .pdf, .doc, .docx)
- Submit button
- Privacy note: "Your details are never shared with third parties."
- Submits through the same Cloudflare Worker as applications

---

## Application Wizard Overlay

Full-screen overlay (same pattern as Engage Us modal but multi-step). Role title displayed at the top for context.

**Progress bar:** 4 labelled steps with active/completed states:
`① Your Details → ② Eligibility → ③ Experience → ④ Review & Submit`

### Step 1 — Your Details
- Full name (text, required)
- Email (email, required)
- Phone (tel, required)
- LinkedIn URL (url, optional)

### Step 2 — Eligibility
- Australian citizenship / work rights (dropdown, required): Australian Citizen, Permanent Resident, Visa Holder, Other
- If "Visa Holder" or "Other" selected → conditional text field: "Please provide details"

### Step 3 — Experience
- Upload CV (file, required — .pdf, .doc, .docx)
- Cover letter / message (textarea, required)
- Notice period (dropdown, required): Available immediately, 2 weeks, 4 weeks, 3+ months
- Salary expectations (text, optional — free text)

### Step 4 — Review & Submit
- Summary of all entered data, organised by step
- Edit buttons per section to jump back to that step
- Role title shown at top
- Privacy note + Submit button

### Wizard Behaviour
- **Navigation:** Back / Next buttons at the bottom of each step
- **Validation:** "Next" validates current step fields before advancing
- **Data preservation:** "Back" preserves all entered data
- **Close:** × button with "Are you sure?" confirmation if data has been entered
- **Submit:** Posts to Cloudflare Worker
- **Success:** Replaces wizard with confirmation message: "Thanks for applying! We've received your application for {role title} and will be in touch."

---

## Data Model — `jobs.json`

Flat JSON array following the `blog/posts.json` pattern:

```json
[
  {
    "slug": "senior-data-engineer",
    "title": "Senior Data Engineer",
    "location": ["Melbourne"],
    "type": "Full-time",
    "closingDate": "2026-05-15",
    "active": true,
    "shortDescription": "Design and build data pipelines for defence and government platforms.",
    "responsibilities": [
      "Design scalable data pipelines for sovereign infrastructure",
      "Work within classified environments"
    ],
    "requirements": [
      "5+ years data engineering experience",
      "Australian citizenship"
    ]
  }
]
```

**Key decisions:**
- `active` flag controls visibility — set `false` to delist without deleting
- `location` is an array — supports multi-location roles (e.g. `["Melbourne", "Canberra"]`)
- `closingDate` displayed on card; JS auto-hides expired listings
- "Why Anywise" content is **not** in JSON — it's shared, hardcoded in the HTML once
- EOI area-of-interest dropdown options hardcoded in HTML

---

## Cloudflare Worker Backend

Single Worker handling two endpoints.

### `POST /apply` — Job Application

1. Parse multipart form data (includes CV file)
2. Upload CV to **Cloudflare R2** bucket (`anywise-careers-cv`) with key `cv/{timestamp}-{name}.pdf`
3. Create **ClickUp task** in a dedicated "Careers Applications" list (to be created in ClickUp under the Anywise Website list's parent folder during implementation):
   - Task name: `{Role Title} — {Applicant Name}`
   - Description: all form fields formatted as markdown
   - CV linked as R2 public URL (bucket configured with public access for the `cv/` prefix)
4. Send **email notification** to `admin@anywise.com.au` via Web3Forms with application summary
5. Return success/error JSON

### `POST /eoi` — Expression of Interest

1. Parse form data (optional CV file)
2. If CV attached, upload to R2
3. Create ClickUp task in same list, tagged as "EOI"
4. Send email to `admin@anywise.com.au` via Web3Forms
5. Return success/error JSON

### Configuration — `wrangler.toml`

```toml
name = "anywise-careers-api"
main = "src/index.ts"

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
```

### Secrets (via `wrangler secret put`)
- `CLICKUP_API_KEY`
- `WEB3FORMS_ACCESS_KEY` (value: `f1275295-758d-4103-b3e7-055977430b13`)

### Security
- **CORS:** Locked to `https://anywise.com.au` origin only
- **Rate limiting:** Cloudflare native binding — 5 requests per 60 seconds per IP via `env.CAREERS_RATE_LIMITER.limit({ key: clientIP })`
- **File validation:** Accept only .pdf, .doc, .docx; max size 10MB
- **Secrets:** API keys stored as Worker secrets, never exposed to client-side code

---

## Nav & Footer Changes (All Pages)

### Navigation
Add "Careers" between Insights and Engage Us:
- Root pages: `<li><a href="careers.html">Careers</a></li>`
- Subdirectory pages: `<li><a href="../careers.html">Careers</a></li>`

### Footer — Company Column
Add "Careers" between Insights and the policy links:
```
About
Insights
Careers          ← new
Grievance Policy
Whistleblower Policy
Defence Disclosure
Privacy Policy
Terms of Use
```
- Root pages: `<a href="careers.html">Careers</a>`
- Subdirectory pages: `<a href="../careers.html">Careers</a>`

---

## SEO

- Meta title: "Careers | Anywise — Sovereign Technology for Defence & Government"
- Meta description: "Join Anywise. Explore open roles in software engineering, data, cyber security, and defence advisory. Help build ethical, sovereign technology for Australia."
- Open Graph tags with hero image

---

## Acceptance Criteria

1. Job listings render from `jobs.json` and display correctly (collapsed and expanded)
2. Application wizard completes all 4 steps and submits successfully
3. Cloudflare Worker creates ClickUp task with correct fields and sends email notification
4. CV uploads to R2 and is accessible from the ClickUp task
5. EOI form submits successfully with same backend flow
6. Empty state shown when no active listings in `jobs.json`
7. Page is mobile responsive across all components (cards, wizard, EOI form)
8. Careers link visible in nav and footer on all pages
9. Rate limiting prevents spam submissions

---

## Out of Scope

- ATS integration
- Individual job detail pages (expand-in-place only)
- Philanthropy footer link (future)
- Job search/filtering (add when listing count warrants it)
