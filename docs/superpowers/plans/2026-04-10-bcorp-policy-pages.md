# B Corp Policy Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three B Corp policy pages (Grievance, Whistleblower, Defence Disclosure) to the Anywise website and link them from the footer on all pages.

**Architecture:** Three standalone HTML files cloned from `terms.html`, with verbatim policy content slotted into the existing page template. Footer updated across all 18 HTML files with new links using correct relative paths.

**Tech Stack:** Static HTML, CSS variables from `shared.css`, `shared.js` for theme/nav/scroll functionality.

**Spec:** `docs/superpowers/specs/2026-04-10-bcorp-policy-pages-design.md`
**Ticket:** ANYHQ-7164

---

### Task 1: Create grievance-policy.html

**Files:**
- Create: `grievance-policy.html`
- Reference: `terms.html` (template source)

- [ ] **Step 1: Copy terms.html as the base**

```bash
cp terms.html grievance-policy.html
```

- [ ] **Step 2: Replace head meta tags**

In `grievance-policy.html`, replace all meta/title/canonical content. The `<head>` section from `<title>` through `<link rel="canonical">` should become:

```html
<title>Grievance Mechanism Policy | Anywise</title>
<meta name="description" content="Anywise's grievance mechanism policy. How stakeholders can raise and resolve concerns regarding the company, its operations, or conduct.">
<meta property="og:type" content="website">
<meta property="og:title" content="Grievance Mechanism Policy | Anywise">
<meta property="og:description" content="Anywise's grievance mechanism policy. How stakeholders can raise and resolve concerns regarding the company, its operations, or conduct.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/grievance-policy.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Grievance Mechanism Policy | Anywise">
<meta name="twitter:description" content="Anywise's grievance mechanism policy. How stakeholders can raise and resolve concerns regarding the company, its operations, or conduct.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
```

And the canonical:
```html
<link rel="canonical" href="https://anywise.com.au/grievance-policy.html">
```

- [ ] **Step 3: Replace hero section**

Replace the `.page-hero` div content with:

```html
<div class="page-hero">
  <div class="breadcrumb">
    <a href="index.html">Home</a>
    <span>/</span>
    <span>Grievance Mechanism Policy</span>
  </div>
  <span class="label">Policy</span>
  <h1>Grievance Mechanism Policy</h1>
  <p>How Anywise stakeholders can raise and resolve concerns regarding the company, its operations, or conduct.</p>
</div>
```

- [ ] **Step 4: Replace page-content with verbatim policy text**

Replace the entire `.page-content` div with:

```html
<div class="page-content">
  <p class="page-updated">Last updated: 10 April 2026</p>

  <h2>1. Policy Brief and Purpose</h2>
  <p>The purpose of this policy is to establish a clear, fair, and consistent mechanism through which Anywise stakeholders may raise and resolve concerns regarding the company, its operations, or conduct. Anywise considers stakeholder feedback and grievances essential to its commitment to ethical conduct, accountability, and continuous improvement. All concerns will be addressed promptly, confidentially, and without victimisation or retaliation.</p>

  <h2>2. Scope</h2>
  <p>This policy applies to all internal and external stakeholders of Anywise, including:</p>
  <ul>
    <li><strong>Internal stakeholders:</strong> Employees, contractors, and volunteers.</li>
    <li><strong>External stakeholders:</strong> Clients, customers, suppliers, vendors, business partners, community members, and the general public.</li>
  </ul>

  <h2>3. Core Principles</h2>
  <p>Grievances are managed in accordance with the following principles:</p>
  <ul>
    <li><strong>Fairness</strong> -- All parties are treated with respect and impartiality and are provided an opportunity to be heard.</li>
    <li><strong>Accessibility</strong> -- Multiple, clearly defined channels are available for submitting grievances.</li>
    <li><strong>Confidentiality</strong> -- Information is handled on a strict need-to-know basis to protect privacy and the integrity of the process.</li>
    <li><strong>Non-Retaliation</strong> -- Stakeholders will not be disadvantaged for raising genuine grievances in good faith.</li>
    <li><strong>Timeliness</strong> -- Grievances are acknowledged, investigated, and resolved promptly and efficiently.</li>
  </ul>

  <h2>4. Communication and Feedback Channels</h2>
  <p>Anywise maintains transparent and accessible mechanisms to facilitate proactive feedback and grievance reporting, including:</p>
  <ul>
    <li><strong>Public Access:</strong> Company details, contact information and a direct contact mechanism are available on the Anywise website.</li>
    <li><strong>Feedback Integration:</strong> Stakeholder input is actively sought and embedded in continuous improvement practices.</li>
    <li><strong>Agile Delivery Framework:</strong> Regular sprint reviews and showcases provide structured opportunities for stakeholders to raise issues during project delivery.</li>
    <li><strong>Transparency:</strong> Open communication channels and regular reviews support early issue identification and resolution.</li>
    <li><strong>Whistleblower Mechanism:</strong> Serious misconduct or unlawful activity may be reported confidentially through the <a href="whistleblower-policy.html">Whistleblower Policy</a>.</li>
  </ul>

  <h2>5. Grounds for Accepting a Grievance</h2>
  <p>Anywise accepts grievances related to alleged breaches of our code of conduct, ethical standards, operational procedures, or any conduct that negatively impacts stakeholders. Grievances must be submitted in good faith and with sufficient information to allow for an investigation.</p>
  <p>The company may decline a grievance submission if it does not fall within the stated grounds for acceptance. A rationale for non-acceptance will be communicated in writing and may include reasons such as the grievance being outside the company's scope, being deemed frivolous or vexatious, or lacking sufficient information or evidence to warrant an investigation.</p>

  <h2>6. Grievance Process Steps and Targeted Deadlines</h2>
  <ul>
    <li><strong>Step 1: Formal Submission:</strong> If a matter is unresolved or of a serious nature, a formal grievance can be submitted in writing via email or the website contact form. Submissions should include stakeholder details, the nature of the issue, relevant dates, and desired resolution. An acknowledgment will be issued within five (5) working days.</li>
    <li><strong>Step 2: Investigation:</strong> Grievances will be reviewed by management or an impartial investigator. The investigation will be completed within a targeted deadline of 20 working days.</li>
    <li><strong>Step 3: Outcome and Resolution:</strong> The outcome will be communicated in writing to the complainant, including the rationale for the decisions. The company will regularly communicate each step and its outcome in the process, confirming when a resolution has been achieved.</li>
  </ul>

  <h2>7. Appeals</h2>
  <p>Stakeholders may lodge a written appeal within ten (10) working days of receiving the outcome. Appeals will be reviewed by a Senior Manager not involved in the initial investigation. This decision will be final.</p>

  <h2>8. Record Keeping</h2>
  <p>All grievance-related documentation will be securely stored by management in compliance with Australian privacy and record-keeping legislation. Records will be retained for the period required by applicable law and company policy.</p>
</div>
```

- [ ] **Step 5: Verify the page renders correctly**

```bash
open grievance-policy.html
```

Check: breadcrumb, hero, content sections, dark/light mode toggle, mobile menu, scroll-to-top all work.

- [ ] **Step 6: Commit**

```bash
git add grievance-policy.html
git commit -m "feat: add grievance mechanism policy page (ANYHQ-7164)"
```

---

### Task 2: Create whistleblower-policy.html

**Files:**
- Create: `whistleblower-policy.html`
- Reference: `terms.html` (template source)

- [ ] **Step 1: Copy terms.html as the base**

```bash
cp terms.html whistleblower-policy.html
```

- [ ] **Step 2: Add h3 style to inline CSS**

In the `<style>` block, after the `.page-content a:hover` rule and before the closing `</style>`, add:

```css
.page-content h3 { font-size: 1.15rem; font-weight: 600; color: var(--text-primary); margin: 2rem 0 0.75rem; }
```

- [ ] **Step 3: Replace head meta tags**

Replace all meta/title/canonical content:

```html
<title>Whistleblower Policy | Anywise</title>
<meta name="description" content="Anywise's whistleblower policy under the Corporations Act 2001. Who is protected, what can be reported, how to report, and legal protections.">
<meta property="og:type" content="website">
<meta property="og:title" content="Whistleblower Policy | Anywise">
<meta property="og:description" content="Anywise's whistleblower policy under the Corporations Act 2001. Who is protected, what can be reported, how to report, and legal protections.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/whistleblower-policy.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Whistleblower Policy | Anywise">
<meta name="twitter:description" content="Anywise's whistleblower policy under the Corporations Act 2001. Who is protected, what can be reported, how to report, and legal protections.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
```

And the canonical:
```html
<link rel="canonical" href="https://anywise.com.au/whistleblower-policy.html">
```

- [ ] **Step 4: Replace hero section**

```html
<div class="page-hero">
  <div class="breadcrumb">
    <a href="index.html">Home</a>
    <span>/</span>
    <span>Whistleblower Policy</span>
  </div>
  <span class="label">Policy</span>
  <h1>Whistleblower Policy</h1>
  <p>Anywise's whistleblower protections under the Corporations Act 2001, including how to report concerns and non-retaliation commitments.</p>
</div>
```

- [ ] **Step 5: Replace page-content with verbatim policy text**

```html
<div class="page-content">
  <p class="page-updated">Last updated: 10 April 2026</p>

  <h2>1. Policy Brief and Purpose</h2>
  <p>Our Whistleblowing company policy outlines our expectations regarding employees' compliance with our company culture and principles as they apply to Whistleblowing.</p>

  <h2>2. Scope</h2>
  <p>This policy applies to all our employees regardless of employment agreement or rank. Company employees are bound by their contract to follow our Whistleblowing Policy while performing their duties. The need for a good corporate governance policy to foster upward reporting in an environment free from recriminations and victimisation is essential if Anywise senior management and the board are to adequately manage risk and cultural issues within the company. We outline the components of our Whistleblowing Policy below:</p>

  <h2>3. Be Safe</h2>
  <p>At all times, it is an expectation that all of our team members, regardless of level, responsibilities or authority, will remain safe and endeavour to ensure that others also remain safe.</p>

  <h2>4. Comply with the Law</h2>
  <p>All employees must protect our company's legality. They should comply with all environmental, safety and fair dealing laws. We expect employees to be ethical and responsible when dealing with our company's finances, products, partnerships and public image.</p>

  <h2>5. Specific Considerations</h2>
  <p>A person is protected as a whistleblower if they are:</p>
  <ul>
    <li>an officer or</li>
    <li>an employee of a company or</li>
    <li>a contractor or their employee who has a contract to supply goods or services to the company.</li>
  </ul>
  <p>The Corporations Act restricts any retaliation against a whistleblower and gives them a civil right, including seeking reinstatement of employment. Protection is extensive providing qualified privilege against defamation and precluding contractual or other remedies from being enforced, including civil and criminal liability, for making the disclosure. This means that secrecy provisions in employment contracts and the like will not preclude whistleblowing.</p>
  <p>To qualify for protection a whistleblower's revelation must be made to:</p>
  <ul>
    <li>ASIC or</li>
    <li>the company's auditor or a member of the audit team or</li>
    <li>a director, secretary or</li>
    <li>senior manager of the company or</li>
    <li>another person authorised by the company to receive revelations of this kind. (e.g. outsourced internal audit functions)</li>
  </ul>
  <p>To trigger the provisions of the Corporations Act, the whistleblower must:</p>
  <ul>
    <li>Give their name before making the disclosure</li>
    <li>Have reasonable grounds to suspect that their revelation indicates the company or an officer or employee has, or may have, contravened the Corporations legislation (which includes both the Corporations Act and the ASIC Act) and act in good faith.</li>
  </ul>

  <h2>6. Handling Revelations from a Whistleblower</h2>
  <p>Under the Corporations Act, Anywise can only pass on the revelation and the identity of the whistleblower (or information that may lead to the identity of the whistleblower) under the following circumstances:</p>
  <ul>
    <li>We can pass it on to ASIC, APRA or the Australian Federal Police without asking for the whistleblower's permission.</li>
    <li>We can only pass it on to a third party if the whistleblower has given their consent. This means, for example, that a company secretary cannot pass on the revelation to members of the board or the CEO unless the whistleblower has consented to them doing this. Anywise recommends that whistleblowers make their revelations directly to an appropriate person, such as the chairman of the audit committee of the Board or some other person as required by another regulator or overseas regulatory requirement relevant to the company.</li>
  </ul>

  <h2>7. Procedures for Anywise</h2>

  <h3>7a. Notices</h3>
  <p>Whistleblowers are to submit concerns to the company Secretary, Adam Evans. If this is inappropriate, any Senior Manager (Heads) or CEO is to be notified. Failing this, submission to the Board of Directors can be made in writing to:</p>
  <p>The Board of Directors - Anywise Consulting Pty Ltd<br>
  PO Box 292, Brunswick East, Vic, 3056</p>

  <h3>7b. Non-Retaliation and Consequences</h3>
  <p>Anywise strictly prohibits retaliation against any individual who makes a disclosure under this policy in good faith. Retaliation is defined as any adverse action, including but not limited to, termination, demotion, harassment, or a change in work conditions. Any employee found to have engaged in retaliatory behavior will be subject to disciplinary action, up to and including termination of employment, in accordance with Anywise's internal disciplinary procedures. The company is committed to ensuring a safe and supportive environment for whistleblowers and will take prompt and effective action to address any identified retaliation.</p>

  <h3>7c. Mechanisms for Whistleblower Protection</h3>
  <ul>
    <li><strong>Confidentiality:</strong> All whistleblower revelations will be treated with the utmost confidentiality. Information will be handled on a strict need-to-know basis to protect the identity of the whistleblower and the integrity of the investigation. The identity of the whistleblower will not be disclosed without their consent, unless required by law.</li>
    <li><strong>Support and Resources:</strong> Anywise will provide support to whistleblowers, which may include offering a safe work environment and accommodations as necessary during an investigation.</li>
    <li><strong>Protection from Legal Liability:</strong> The company will ensure that no contractual remedies or other legal actions are taken against a whistleblower who makes a disclosure in good faith, in accordance with the Corporations Act.</li>
  </ul>

  <h3>7d. Communication and Outcome Notification</h3>
  <p>Anywise is committed to maintaining transparent communication with whistleblowers throughout the investigation process.</p>
  <ul>
    <li>Whistleblowers will receive timely updates acknowledging receipt of their disclosure, confirmation when an investigation commences, and progress updates at key stages where appropriate.</li>
    <li>Upon completion of the investigation, the whistleblower will be notified in writing of the outcome, including confirmation of any actions taken or the rationale where a matter was not accepted as a formal disclosure.</li>
    <li>All communications will respect confidentiality and applicable legal obligations.</li>
  </ul>
</div>
```

- [ ] **Step 6: Verify the page renders correctly**

```bash
open whistleblower-policy.html
```

Check: breadcrumb, hero, all 7 sections with h3 sub-sections, dark/light mode, mobile, scroll-to-top.

- [ ] **Step 7: Commit**

```bash
git add whistleblower-policy.html
git commit -m "feat: add whistleblower policy page (ANYHQ-7164)"
```

---

### Task 3: Create weapons-exclusion.html

**Files:**
- Create: `weapons-exclusion.html`
- Reference: `terms.html` (template source)

- [ ] **Step 1: Copy terms.html as the base**

```bash
cp terms.html weapons-exclusion.html
```

- [ ] **Step 2: Add h3 style to inline CSS**

In the `<style>` block, after the `.page-content a:hover` rule and before the closing `</style>`, add:

```css
.page-content h3 { font-size: 1.15rem; font-weight: 600; color: var(--text-primary); margin: 2rem 0 0.75rem; }
```

- [ ] **Step 3: Replace head meta tags**

```html
<title>Defence Industry Disclosure | Anywise</title>
<meta name="description" content="Anywise's position on defence industry work, ethical screening, weapons exclusion, and due diligence practices.">
<meta property="og:type" content="website">
<meta property="og:title" content="Defence Industry Disclosure | Anywise">
<meta property="og:description" content="Anywise's position on defence industry work, ethical screening, weapons exclusion, and due diligence practices.">
<meta property="og:image" content="https://anywise.com.au/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://anywise.com.au/weapons-exclusion.html">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Defence Industry Disclosure | Anywise">
<meta name="twitter:description" content="Anywise's position on defence industry work, ethical screening, weapons exclusion, and due diligence practices.">
<meta name="twitter:image" content="https://anywise.com.au/og-image.png">
```

And the canonical:
```html
<link rel="canonical" href="https://anywise.com.au/weapons-exclusion.html">
```

- [ ] **Step 4: Replace hero section**

```html
<div class="page-hero">
  <div class="breadcrumb">
    <a href="index.html">Home</a>
    <span>/</span>
    <span>Defence Industry Disclosure</span>
  </div>
  <span class="label">Policy</span>
  <h1>Defence Industry Disclosure</h1>
  <p>Anywise's position on defence industry work, ethical screening, and weapons exclusion.</p>
</div>
```

- [ ] **Step 5: Replace page-content with verbatim disclosure text**

```html
<div class="page-content">
  <p class="page-updated">Last updated: 10 April 2026</p>

  <h2>1. About Anywise</h2>
  <p>Anywise is a specialist advisory firm based in Melbourne, Australia. Launched by Adam Evans and Meaghan Barry in 2014. We specialise in technology solutions and digital transformation, complex project mobilisation, agile project design and delivery, consulting services, innovation and product development, logistics support and training and development.</p>
  <p>Anywise provides support to the Australian government, including the Department of Defence and defence industry. Approximately 80% of the company's annual revenue comes from clients in the Defence Sector.</p>
  <p>This percentage has been decreasing since 2017 as it continues to diversify into the department of industry, innovation and science and State Government.</p>

  <h2>2. Weapons Exclusion Stance</h2>
  <p>There are many reasons we may say no to a contract, project, supplier, or client. Anywise does not work on mission systems that involve the design, manufacture or supply of weapons or ammunition. The company closely controls project and engineering interfaces to ensure that it is not involved in systems that actively deliver lethal force, preferring systems that deliver humanitarian, logistics or personnel training. Its industry clients are screened for ethical conduct and the directors are involved in the decision to pursue work for clients that are or may have been or could be involved in arms trades or supply of systems that profit from war. The firm is not involved in any projects related to offensive weapon systems or offensive weapon carrier; projects related to controversial weapons and emerging technologies such as drones, artificial intelligence and neurotechnologies with a capability to harm people and the planet in disproportionate and indiscriminate ways; nor is involved in any projects serving clients that have a high likelihood of misuse (e.g. governments involved with alleged human rights abuses).</p>

  <h2>3. Types of Defence Work</h2>
  <p>Anywise provides professional services to Defence Industry clients inclusive of Project Management; Integrated Logistics Support and Engineering services into Federal Agencies capability acquisition (Deployable camps and humanitarian supplies); Safety and equipment asset management systems (Bridging equipment) and training support (Personnel training for military police and protective services); and Safety cases and engineering support for user safety manuals for laser equipment. The company has a stated and resourced strategy to grow its impact in circular economies, data management, safety systems, asset management and renewable technologies.</p>

  <h2>4. Policies and Practices</h2>
  <p>Anywise has policies and practices in place for carrying out due diligence of its clients, so as to ensure that the services provided by the company are not used for harming people and the environment. These include client qualifications and bid no bid decisions. In addition to this, all staff that work on defence related projects receive training on the contents of the company's due diligence policy.</p>
  <p>The following selection criteria are used within our due diligence policy for the selection of suppliers, clients and projects:</p>

  <h3>Suppliers</h3>
  <p>Guiding points for decision-making:</p>
  <ul>
    <li>The service can be performed better or less expensively by a third party provider</li>
    <li>It would be cost-prohibitive or otherwise unreasonable to perform this service in-house</li>
    <li>Outsourcing the service will positively affect the quality of this service</li>
    <li>The cost of the service is worth the benefit and the risks associated with outsourcing the service are worth the benefit</li>
  </ul>
  <p>Once the decision to outsource a function has been made, selecting the appropriate provider is critical to the success. Due diligence must be performed after the potential providers have been reduced to a short list of two to three companies. Due diligence must always be performed prior to a provider being selected.</p>
  <p>The process should include an evaluation of the provider's ability to perform the requested services, and must specifically cover the following areas:</p>
  <ul>
    <li>Technical ability of the provider</li>
    <li>Ability to deliver the service</li>
    <li>Experience of the provider</li>
    <li>Reputation of the provider</li>
    <li>Policies and procedures related to the service</li>
    <li>Financial strength of the provider</li>
    <li>Service Level Agreements related to the service</li>
  </ul>
  <p>If the outsourced service will involve the provider having access to, or storing the company's or our stakeholder's confidential information, due diligence must cover the provider's security controls for access to the confidential information. The provider must be given the least amount of network, system, and/or data access required to perform the contracted services. This access must follow applicable policies and be periodically audited.</p>

  <h3>Projects</h3>
  <p>Even though the company has limited information about how its projects are used, were it to discover that its projects were being utilised for maleficent ends, it would immediately stop working on such a project and discontinue relationships with the related client. During the project execution phase, the company, conducts regular check-ins with its engineers to check if it has ethical concerns or feedback about the projects. Although Anywise works across a wide range of projects in a variety of markets, the company is willing to step away from projects that do not align with its core values.</p>

  <h3>Clients</h3>
  <p>To address the risk of corruption, the company has an Ethics and Anti Corruption Policy that maintains an expectation "...that all of our team members, regardless of level, responsibilities or authority will remain safe and endeavour to ensure that others also remain safe." In addition, "All employees must protect our company's legality. They should comply with all environmental, safety, and fair dealing laws. We expect employees to be ethical and responsible when dealing with our company's finances, products, partnerships and public image." The company promotes honest and transparent business practices.</p>
  <p>Failure to comply with this company policy, or any other policy, may result in disciplinary actions for those that do not comply, going as far as termination of employment. This policy is shared with all staff and specific training on the policy is provided periodically for new and existing employees that are part of the management, support, and sales teams. The policy also promotes the reporting of breaches of the policy without any fear of retaliation.</p>
  <p>Anywise's <a href="whistleblower-policy.html">Whistleblowing Policy</a> details the steps to be taken in case concerns are received from whistleblowers. Such concerns are managed by the company secretary. If this is inappropriate, any Senior Manager (Heads) or Director is to be notified. Failing this, submission to the board of Directors can be made in writing. The governing member decides on preventative and remediative measures to be taken. The Corporations Act restricts any retaliation against a whistleblower and gives them a civil right, including seeking reinstatement of employment.</p>
  <p>Anywise is committed to ensuring that all stakeholders, including employees, suppliers, partners, and community members, have a clear and accessible way to raise concerns. Our <a href="grievance-policy.html">Grievance and Complaints Mechanism</a> provides a fair, confidential, and timely process for addressing issues, supporting accountability, and continuous improvement.</p>
</div>
```

- [ ] **Step 6: Verify the page renders correctly**

```bash
open weapons-exclusion.html
```

Check: breadcrumb, hero, 4 sections with h3 sub-sections, cross-links to whistleblower and grievance pages work, dark/light mode, mobile, scroll-to-top.

- [ ] **Step 7: Commit**

```bash
git add weapons-exclusion.html
git commit -m "feat: add defence industry disclosure page (ANYHQ-7164)"
```

---

### Task 4: Update footer on all root-level HTML pages

**Files:**
- Modify: `index.html` (footer Company column)
- Modify: `privacy.html` (footer Company column)
- Modify: `contact.html` (footer Company column)
- Modify: `terms.html` (footer Company column)
- Modify: `grievance-policy.html` (footer Company column -- already has terms.html footer from template)
- Modify: `whistleblower-policy.html` (footer Company column)
- Modify: `weapons-exclusion.html` (footer Company column)

- [ ] **Step 1: Update footer in all root-level pages**

In each file listed above, find the footer Company column. Locate these two lines:

```html
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
```

Replace with:

```html
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
        <a href="grievance-policy.html">Grievance Policy</a>
        <a href="whistleblower-policy.html">Whistleblower Policy</a>
        <a href="weapons-exclusion.html">Defence Disclosure</a>
```

Apply this change to all 7 root-level files.

- [ ] **Step 2: Verify links work on at least 2 root-level pages**

Open `index.html` and `terms.html` in a browser. Scroll to footer. Confirm all 5 policy links are present and clickable.

- [ ] **Step 3: Commit**

```bash
git add index.html privacy.html contact.html terms.html grievance-policy.html whistleblower-policy.html weapons-exclusion.html
git commit -m "feat: add B Corp policy links to footer on root-level pages (ANYHQ-7164)"
```

---

### Task 5: Update footer on all subdirectory HTML pages

**Files:**
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
- Modify: `engage/index 2.html`
- Modify: `blog/post 2.html`
- Modify: `blog/index 2.html`
- Modify: `products/index 2.html`

- [ ] **Step 1: Update footer in all subdirectory pages**

In each file listed above, find the footer Company column. Locate these two lines:

```html
        <a href="../privacy.html">Privacy Policy</a>
        <a href="../terms.html">Terms of Use</a>
```

Replace with:

```html
        <a href="../privacy.html">Privacy Policy</a>
        <a href="../terms.html">Terms of Use</a>
        <a href="../grievance-policy.html">Grievance Policy</a>
        <a href="../whistleblower-policy.html">Whistleblower Policy</a>
        <a href="../weapons-exclusion.html">Defence Disclosure</a>
```

Apply this change to all 14 subdirectory files.

Note: The "2" files (`engage/index 2.html`, `blog/post 2.html`, `blog/index 2.html`, `products/index 2.html`) appear to be duplicates/backups. Update them for consistency but flag in commit message.

- [ ] **Step 2: Verify links work on at least 2 subdirectory pages**

Open `products/wisdom.html` and `blog/index.html` in a browser. Scroll to footer. Confirm all 5 policy links are present and use `../` prefix paths correctly.

- [ ] **Step 3: Commit**

```bash
git add products/index.html products/wisdom.html products/engaide.html products/fraud-analytics.html products/impact-framework.html products/fabhums.html products/campaide.html products/ils.html products/aide.html blog/index.html "engage/index 2.html" "blog/post 2.html" "blog/index 2.html" "products/index 2.html"
git commit -m "feat: add B Corp policy links to footer on subdirectory pages (ANYHQ-7164)

Includes duplicate/backup files (index 2.html, post 2.html) for consistency."
```

---

### Task 6: Final verification

**Files:** None (verification only)

- [ ] **Step 1: Check all 3 new pages load correctly**

Open each in browser and verify:
- Page title in browser tab
- Breadcrumb shows correct text and Home link works
- Hero label says "Policy"
- All content sections present with correct headings
- Dark/light mode toggle works
- Mobile hamburger menu works
- Scroll-to-top button appears on scroll
- Footer shows all 5 policy links

```bash
open grievance-policy.html
open whistleblower-policy.html
open weapons-exclusion.html
```

- [ ] **Step 2: Check cross-links between policy pages**

On `grievance-policy.html`, section 4 "Whistleblower Mechanism" links to `whistleblower-policy.html` -- click it, confirm it works.

On `weapons-exclusion.html`, section 4 "Clients" links to `whistleblower-policy.html` and `grievance-policy.html` -- click both, confirm they work.

- [ ] **Step 3: Spot-check footer on 3 existing pages**

Open `index.html`, `products/wisdom.html`, and `blog/index.html`. Scroll to footer. Confirm:
- All 5 policy links present (Privacy Policy, Terms of Use, Grievance Policy, Whistleblower Policy, Defence Disclosure)
- Links navigate to the correct pages
- No broken relative paths

- [ ] **Step 4: Update ClickUp task status**

Move ANYHQ-7164 from "Backlog / Ideas" to "In Review" (pending director review before deploy).
