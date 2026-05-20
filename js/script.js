/* ============================================================
   DR. MOHIT KUMAR MATHUR — ACADEMIC PORTFOLIO
   Interactions & Behavior
   ============================================================ */

// ─────────────────────────────────────────────
// PAGE LOADER (Immediate Execution)
// ─────────────────────────────────────────────
(function() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    const hideLoader = () => {
      console.log('Hiding loader...');
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    };

    // Hide loader on window load
    window.addEventListener('load', hideLoader);

    // Fallback in case load already fired or ready state is complete
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(hideLoader, 400);
    }

    // Safety timeout: hide loader after max 3 seconds anyway
    setTimeout(hideLoader, 3000);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');

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
  // RESOURCE FILTER (MBBS / Masters / Pre- & Post-Op)
  // ─────────────────────────────────────────────
  window.filterResources = function(btn, type) {
    const section = document.getElementById('library');
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

  // ─────────────────────────────────────────────
  // HERO MOUSE PARALLAX EFFECT
  // ─────────────────────────────────────────────
  const heroSection = document.getElementById('home');
  const heroImgWrap = document.querySelector('.hero-img-wrap');
  const heroAccents = document.querySelectorAll('.hero-accent, .hero-accent2');
  const heroLeft = document.querySelector('.hero-left');

  if (heroSection) {
    heroSection.style.perspective = '1500px';
    
    heroSection.addEventListener('mousemove', (e) => {
      const { width, height, left, top } = heroSection.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / (width / 2); // -1 to 1
      const y = (e.clientY - top - height / 2) / (height / 2); // -1 to 1

      if (heroImgWrap) {
        heroImgWrap.style.transform = `perspective(1200px) rotateX(${y * -7}deg) rotateY(${x * 7}deg) translate3d(${x * 12}px, ${y * 12}px, 0)`;
      }

      if (heroLeft) {
        heroLeft.style.transform = `translate3d(${x * 4}px, ${y * 4}px, 0)`;
      }

      heroAccents.forEach((accent, idx) => {
        const factor = (idx + 1) * 15;
        const dx = x * factor * (idx === 0 ? -1 : 1);
        const dy = y * factor * (idx === 0 ? -1 : 1);
        
        if (accent.classList.contains('hero-accent')) {
          accent.style.transform = `translate3d(${dx}px, calc(-50% + ${dy}px), 0)`;
        } else {
          accent.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        }
      });
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      if (heroImgWrap) heroImgWrap.style.transform = '';
      if (heroLeft) heroLeft.style.transform = '';
      heroAccents.forEach(accent => accent.style.transform = '');
    });
  }

  // ─────────────────────────────────────────────
  // TYPEWRITER EFFECT IN HERO BADGE
  // ─────────────────────────────────────────────
  const typewriter = document.querySelector('.typewriter');
  if (typewriter) {
    const words = JSON.parse(typewriter.dataset.words);
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 150;

    const type = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typewriter.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        delay = 50;
      } else {
        typewriter.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        delay = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        delay = 2500; // Hold full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 300; // Pause before typing next word
      }

      setTimeout(type, delay);
    };

    setTimeout(type, 800);
  }

  // ─────────────────────────────────────────────
  // 3D TILT PARALLAX CARD EFFECT (Library & Publications)
  // ─────────────────────────────────────────────
  const tiltCards = document.querySelectorAll('.teach-card, .pub-card');

  tiltCards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease';

    card.querySelectorAll('> *').forEach(child => {
      child.style.transform = 'translateZ(20px)';
      child.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xc = rect.width / 2;
      const yc = rect.height / 2;

      // Calculate tilt angles (max 6-8 degrees for clean professional looks)
      const angleX = (yc - y) / 18;
      const angleY = (x - xc) / 18;

      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-6px)`;

      // Dynamic Reflection Highlight
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      card.style.setProperty('--reflection', `radial-gradient(circle at ${px}% ${py}%, rgba(255, 255, 255, 0.08) 0%, transparent 65%)`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--reflection');
      card.querySelectorAll('> *').forEach(child => {
        child.style.transform = '';
      });
    });
  });

  console.log('Premium Dynamic features initialized.');

});
