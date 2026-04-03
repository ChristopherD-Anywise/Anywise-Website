/* shared.js — Theme detection, mobile nav, scroll reveal, Engage Us modal */

/* ─── Theme Detection IIFE ────────────────────────────────────────────────── */
(function () {
  function getSydneyHour() {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const sydneyOffset = 10 * 3600000;
    return new Date(utcMs + sydneyOffset).getHours();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀' : '◑';
  }

  window.applyTheme = applyTheme;

  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved);
  } else {
    const hour = getSydneyHour();
    applyTheme(hour >= 6 && hour < 18 ? 'light' : 'dark');
  }
})();

/* ─── DOM Ready ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* Theme toggle — skip if the page has its own handler (e.g. main page with globe) */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle && !window.__themeHandled) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      window.applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ─── Mobile Menu ─────────────────────────────────────────────────────── */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close on nav link click */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileToggle.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ─── Nav Scroll ──────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ─── Scroll Reveal ───────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─── Engage Us Modal ─────────────────────────────────────────────────── */
  injectEngageModal();
  wireEngageTriggers();
});

/* ─── Modal Injection ─────────────────────────────────────────────────────── */
function injectEngageModal() {
  if (document.getElementById('engageModal')) return;

  const modal = document.createElement('div');
  modal.id = 'engageModal';
  modal.className = 'engage-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'engageModalTitle');
  modal.setAttribute('hidden', '');

  modal.innerHTML = `
    <div class="engage-panel">
      <button class="engage-close" id="engageClose" aria-label="Close">&times;</button>

      <div class="engage-header">
        <span class="label">Get in touch</span>
        <h2 id="engageModalTitle">Engage Us</h2>
        <p class="engage-sub">Tell us about your challenge. We'll get back to you within one business day.</p>
      </div>

      <form
        class="engage-form"
        id="engageForm"
      >
        <div class="engage-form-row">
          <div class="engage-group">
            <label for="engName">Full name <span aria-hidden="true">*</span></label>
            <input id="engName" name="name" type="text"
              placeholder="Jane Smith" autocomplete="name" required>
          </div>
          <div class="engage-group">
            <label for="engEmail">Work email <span aria-hidden="true">*</span></label>
            <input id="engEmail" name="email" type="email"
              placeholder="jane@organisation.gov.au" autocomplete="email" required>
          </div>
        </div>

        <div class="engage-form-row">
          <div class="engage-group">
            <label for="engOrg">Organisation <span aria-hidden="true">*</span></label>
            <input id="engOrg" name="organisation" type="text"
              placeholder="Department / Company" required>
          </div>
          <div class="engage-group">
            <label for="engRole">Your role</label>
            <input id="engRole" name="role" type="text"
              placeholder="e.g. CTO, Project Manager">
          </div>
        </div>

        <div class="engage-group">
          <label for="engEnquiry">What are you looking for? <span aria-hidden="true">*</span></label>
          <select class="engage-select" id="engEnquiry" name="enquiry" required>
            <option value="" disabled selected>Select one…</option>
            <option value="product">Product enquiry</option>
            <option value="partnership">Partnership or collaboration</option>
            <option value="general">General enquiry</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="engage-group" id="engProductGroup" hidden>
          <label for="engProduct">Which product or service? <span aria-hidden="true">*</span></label>
          <select class="engage-select" id="engProduct" name="product">
            <option value="" disabled selected>Select a product or service…</option>
            <option value="WISDOM">WISDOM</option>
            <option value="ENG|AIDE">ENG|AIDE</option>
            <option value="Fraud Analytics">Fraud Detection &amp; Compliance Analytics</option>
            <option value="Impact Framework">Impact Measurement &amp; Reporting</option>
            <option value="FABHUMS">FABHUMS</option>
            <option value="CAMP|AIDE">CAMP|AIDE</option>
            <option value="ILS">Integrated Logistics Support</option>
            <option value="AIDE">AIDE</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="engage-group">
          <label for="engMessage">Message <span aria-hidden="true">*</span></label>
          <textarea class="engage-textarea" id="engMessage" name="message"
            placeholder="Tell us about your challenge, context, or what you'd like to explore with Anywise…"
            required></textarea>
        </div>

        <div class="engage-actions">
          <p class="engage-privacy">We respect your privacy. Your details are never shared with third parties.</p>
          <button type="submit" class="btn btn-primary">Send &rarr;</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  /* Conditional product dropdown */
  const enquirySelect = document.getElementById('engEnquiry');
  const productGroup = document.getElementById('engProductGroup');
  const productSelect = document.getElementById('engProduct');

  enquirySelect.addEventListener('change', function () {
    const show = enquirySelect.value === 'product';
    productGroup.hidden = !show;
    productSelect.required = show;
  });

  /* Close button */
  document.getElementById('engageClose').addEventListener('click', closeEngageModal);

  /* Click outside panel */
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeEngageModal();
  });

  /* ESC key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeEngageModal();
  });

  /* Form submission handler */
  const form = document.getElementById('engageForm');
  if (form) {
    form.addEventListener('submit', handleEngageSubmit);
  }
}

function handleEngageSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  /* Remove any previous error */
  const prevErr = form.querySelector('.engage-error');
  if (prevErr) prevErr.remove();

  /* Collect form data */
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());

  /* Web3Forms payload */
  data.access_key = 'f1275295-758d-4103-b3e7-055977430b13';
  data.subject = 'Engage Us: ' + (data.enquiry || 'general') + ' enquiry from ' + data.name + ' (' + data.organisation + ')';
  data.from_name = 'Anywise Website';
  data.botcheck = '';

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(function (res) { return res.json(); })
    .then(function (result) {
      if (result.success) {
        /* Replace form with success message */
        const panel = form.closest('.engage-panel');
        if (panel) {
          form.innerHTML = '<div class="engage-success"><h3>Thanks for reaching out!</h3><p>We\'ll be in touch shortly.</p></div>';
        }
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    })
    .catch(function (err) {
      const errEl = document.createElement('p');
      errEl.className = 'engage-error';
      errEl.textContent = err.message || 'Failed to send. Please try again.';
      errEl.style.color = '#e74c3c';
      errEl.style.fontSize = '0.875rem';
      errEl.style.marginBottom = '0.75rem';
      const actionsDiv = form.querySelector('.engage-actions');
      if (actionsDiv) {
        actionsDiv.parentElement.insertBefore(errEl, actionsDiv);
      }
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
}

/* ─── Wire Engage Triggers ────────────────────────────────────────────────── */
function wireEngageTriggers() {
  document.querySelectorAll('[data-engage]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openEngageModal();
    });
  });
}

/* ─── Open / Close ────────────────────────────────────────────────────────── */
function openEngageModal() {
  const modal = document.getElementById('engageModal');
  if (!modal) return;
  modal.removeAttribute('hidden');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Focus first input */
  setTimeout(function () {
    const first = modal.querySelector('input, select, textarea, button');
    if (first) first.focus();
  }, 50);
}

function closeEngageModal() {
  const modal = document.getElementById('engageModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(function () { modal.setAttribute('hidden', ''); }, 300);
}

/* Expose globally so inline onclick / product page CTAs can call these */
window.openEngageModal = openEngageModal;
window.closeEngageModal = closeEngageModal;
