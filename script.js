/* =============================================================
   ANTIGRAVITY ISTANBUL — ZERO-G INTERACTIVITY ENGINE
   ============================================================= */

(function () {
  'use strict';

  /* ─── CUSTOM CURSOR ─── */
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth trail
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Cursor hover state on interactive elements
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '22px';
      cursor.style.height = '22px';
      trail.style.width = '56px';
      trail.style.height = '56px';
      trail.style.borderColor = 'rgba(26,159,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      trail.style.width = '36px';
      trail.style.height = '36px';
      trail.style.borderColor = 'rgba(26,159,255,0.5)';
    });
  });

  /* ─── NAV SCROLL BEHAVIOR ─── */
  const nav = document.getElementById('nav');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  /* ─── MOBILE MENU ─── */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = menuBtn.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      const spans = menuBtn.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });

  /* ─── INTERSECTION OBSERVER: REVEAL ANIMATIONS ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─── FLOAT-IN ANIMATIONS (Home section) ─── */
  const floatObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          floatObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll('.float-in').forEach(el => floatObserver.observe(el));

  /* ─── REVEAL GRAVITY TEXT (title outline fill) ─── */
  const titleGravity = document.querySelector('.title-gravity');
  if (titleGravity) {
    setTimeout(() => titleGravity.classList.add('revealed'), 800);
  }

  /* ─── SLOGAN ROTATOR ─── */
  const slogans = document.querySelectorAll('.slogan');
  let currentSlogan = 0;

  if (slogans.length) {
    setInterval(() => {
      slogans[currentSlogan].classList.remove('active');
      currentSlogan = (currentSlogan + 1) % slogans.length;
      slogans[currentSlogan].classList.add('active');
    }, 3200);
  }

  /* ─── COUNTER ANIMATION ─── */
  const counters = document.querySelectorAll('.counter-num');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (isNaN(target)) return; // skip ∞
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current);
              }
            }, 30);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(c => counterObserver.observe(c));

  /* ─── PARALLAX: ZERO-G FLOATING ON SCROLL ─── */
  const parallaxElements = [
    { el: document.querySelector('.g1'), speed: 0.06 },
    { el: document.querySelector('.g2'), speed: -0.04 },
    { el: document.querySelector('.g3'), speed: 0.08 },
    { el: document.querySelector('.home-title'), speed: 0.03 },
    { el: document.querySelector('.home-manifesto'), speed: 0.015 },
    { el: document.querySelector('.scroll-indicator'), speed: 0.05 },
  ].filter(p => p.el);

  let ticking = false;

  function applyParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(({ el, speed }) => {
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });

  /* ─── MOUSE PARALLAX (subtle tilt on home section) ─── */
  const homeSection = document.querySelector('.section-home');
  if (homeSection) {
    window.addEventListener('mousemove', (e) => {
      if (window.scrollY > window.innerHeight) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (e.clientX - centerX) / centerX;
      const offsetY = (e.clientY - centerY) / centerY;

      ['.g1', '.g2', '.g3'].forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const factor = (i + 1) * 8;
        const scrollOffset = window.scrollY * [0.06, -0.04, 0.08][i];
        el.style.transform = `translate(${offsetX * factor}px, ${offsetY * factor + scrollOffset}px)`;
      });
    }, { passive: true });
  }

  /* ─── NAV LOGO HOVER EFFECT ─── */
  const navLogo = document.getElementById('navLogo');
  if (navLogo) {
    navLogo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── CASE VISUAL MAGNETIC HOVER ─── */
  document.querySelectorAll('.case-visual').forEach(visual => {
    visual.addEventListener('mousemove', (e) => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      visual.querySelector('.case-visual-inner').style.transform =
        `translate(${x * 12}px, ${y * 12}px)`;
    });
    visual.addEventListener('mouseleave', () => {
      visual.querySelector('.case-visual-inner').style.transform = 'translate(0,0)';
    });
  });

  /* ─── ELECTRIC HOVER TRAIL ON CTA ─── */
  const ctaBtn = document.getElementById('ctaBtn');
  if (ctaBtn) {
    ctaBtn.addEventListener('mousemove', (e) => {
      const rect = ctaBtn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      ctaBtn.style.setProperty('--mx', x + '%');
      ctaBtn.style.setProperty('--my', y + '%');
    });
  }

  /* ─── SERVICE CARD STAGGER REVEAL ─── */
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index || 1) - 1;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 100);
          serviceObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  serviceCards.forEach(card => serviceObserver.observe(card));

  /* ─── SMOOTH SCROLL FOR NAV LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── ACTIVE NAV LINK HIGHLIGHT ─── */
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '0.4';
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ─── PHILOSOPHY STRIP PAUSE ON HOVER ─── */
  const strip = document.querySelector('.philosophy-strip');
  if (strip) {
    strip.addEventListener('mouseenter', () => {
      strip.style.animationPlayState = 'paused';
    });
    strip.addEventListener('mouseleave', () => {
      strip.style.animationPlayState = 'running';
    });
  }

  /* ─── INIT: trigger visible state for elements already in view ─── */
  window.dispatchEvent(new Event('scroll'));

})();
