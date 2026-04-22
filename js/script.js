/* ============================================================
   DR. MOHIT KUMAR MATHUR — ACADEMIC PORTFOLIO
   Interactions & Behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────
  // PAGE LOADER
  // ─────────────────────────────────────────────
  const loader = document.getElementById('pageLoader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 400);
    });
    // Fallback in case load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => loader.classList.add('loaded'), 400);
    }
  }

  // ─────────────────────────────────────────────
  // NAV TOGGLE (Hamburger → X)
  // ─────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll('#navLinks a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  // ─────────────────────────────────────────────
  // NAV SCROLL EFFECT
  // ─────────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }
  }, { passive: true });

  // ─────────────────────────────────────────────
  // ACTIVE NAV LINK (Intersection Observer)
  // ─────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('#navLinks a:not(.nav-cta)');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ─────────────────────────────────────────────
  // SCROLL REVEAL (Intersection Observer)
  // ─────────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
    revealObserver.observe(el);
  });

  // ─────────────────────────────────────────────
  // ANIMATED COUNTERS
  // ─────────────────────────────────────────────
  const counterEls = document.querySelectorAll('[data-count]');
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    counterEls.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: ease-out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(step);
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  // ─────────────────────────────────────────────
  // PUBLICATION FILTER
  // ─────────────────────────────────────────────
  window.filterPub = function(btn, cat) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.pub-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.style.display = '';
        card.style.animation = 'fadeUp 0.4s ease both';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // ─────────────────────────────────────────────
  // CONTACT FORM VALIDATION & SUBMIT
  // ─────────────────────────────────────────────
  window.handleSubmit = function() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;

    inputs.forEach(input => {
      input.classList.remove('error');
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      }
      // Email validation
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          input.classList.add('error');
          valid = false;
        }
      }
    });

    if (!valid) {
      return;
    }

    const btn = document.querySelector('.submit-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Message Sent!';
    btn.classList.add('success');
    btn.disabled = true;

    // Clear form
    inputs.forEach(input => input.value = '');
    const select = form.querySelector('select');
    if (select) select.selectedIndex = 0;

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove('success');
      btn.disabled = false;
    }, 3000);
  };

  // Clear error state on input
  document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

  // ─────────────────────────────────────────────
  // RESOURCE FILTER (MBBS / Masters)
  // ─────────────────────────────────────────────
  window.filterResources = function(btn, type) {
    const section = document.getElementById('students');
    section.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    section.querySelectorAll('.resource-item').forEach(card => {
      if (type === 'all' || card.dataset.type === type) {
        card.style.display = '';
        card.style.animation = 'fadeUp 0.4s ease both';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // ─────────────────────────────────────────────
  // BACK TO TOP
  // ─────────────────────────────────────────────
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─────────────────────────────────────────────
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ─────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─────────────────────────────────────────────
  // DYNAMIC FOOTER YEAR
  // ─────────────────────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
