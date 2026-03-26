/* ═══════════════════════════════════════════════════════════════════
   RACMUN — Main JavaScript
   Features: Countdown Timer | Scroll Animations | Nav Scroll | Mobile Nav
═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   COUNTDOWN TIMER
   ✏️ EDIT: Change TARGET_DATE to your event date
   Format: 'YYYY-MM-DDTHH:MM:SS'
───────────────────────────────────────────── */
const TARGET_DATE = new Date('2026-04-15T10:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    // Event has started / passed
    document.getElementById('cd-days').textContent  = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

// Animate countdown number change
function animateChange(el) {
  el.style.transform = 'translateY(-4px)';
  el.style.opacity = '0.6';
  setTimeout(() => {
    el.style.transform = '';
    el.style.opacity = '';
  }, 150);
}

let prevSecs = -1;
function tickCountdown() {
  const now = new Date();
  const diff = TARGET_DATE - now;
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  if (secs !== prevSecs) {
    const cdSecs = document.getElementById('cd-secs');
    if (cdSecs) animateChange(cdSecs);
    prevSecs = secs;
  }

  updateCountdown();
}

updateCountdown();
setInterval(tickCountdown, 1000);


/* ─────────────────────────────────────────────
   NAVBAR SCROLL EFFECT
───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();


/* ─────────────────────────────────────────────
   MOBILE NAV TOGGLE
───────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
let mobileNavOpen = false;

navToggle.addEventListener('click', () => {
  mobileNavOpen = !mobileNavOpen;
  mobileNav.classList.toggle('open', mobileNavOpen);
  document.body.style.overflow = mobileNavOpen ? 'hidden' : '';

  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (mobileNavOpen) {
    spans[0].style.transform = 'translateY(6px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

function closeMobileNav() {
  mobileNavOpen = false;
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
  const spans = navToggle.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
}

// Close on backdrop click
mobileNav.addEventListener('click', (e) => {
  if (e.target === mobileNav) closeMobileNav();
});

// Expose to onclick handlers in HTML
window.closeMobileNav = closeMobileNav;


/* ─────────────────────────────────────────────
   SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver for performance
───────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-fade, .reveal-slide');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after first reveal for performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => {
    // Don't observe elements in hero (they use CSS animation directly)
    if (!el.closest('#hero')) {
      observer.observe(el);
    } else {
      el.classList.add('visible');
    }
  });
}

// Run after DOM content is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}


/* ─────────────────────────────────────────────
   SMOOTH SCROLL FOR ANCHOR LINKS
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar ? navbar.offsetHeight : 70;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetPos,
      behavior: 'smooth'
    });
  });
});


/* ─────────────────────────────────────────────
   SUBTLE PARALLAX ON HERO CHAKRA
───────────────────────────────────────────── */
const heroChakra = document.querySelector('.hero-chakra');

if (heroChakra) {
  let rafId = null;

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const opacity = Math.max(0, 0.18 - scrolled * 0.0002);
      heroChakra.style.opacity = opacity;
      heroChakra.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.12}px))`;
      rafId = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ─────────────────────────────────────────────
   LEADER CARD — TOUCH SUPPORT (mobile overlay)
───────────────────────────────────────────── */
const leaderCards = document.querySelectorAll('.leader-card');

leaderCards.forEach(card => {
  const overlay = card.querySelector('.leader-hover-overlay');
  if (!overlay) return;

  let isTouched = false;

  card.addEventListener('touchstart', () => {
    isTouched = true;
    leaderCards.forEach(c => {
      if (c !== card) {
        const o = c.querySelector('.leader-hover-overlay');
        if (o) o.style.opacity = '0';
      }
    });
    overlay.style.opacity = overlay.style.opacity === '1' ? '0' : '1';
  }, { passive: true });
});


/* ─────────────────────────────────────────────
   COMMITTEE CARD — TILT EFFECT (desktop only)
───────────────────────────────────────────── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const committeeCards = document.querySelectorAll('.committee-card-inner');

  committeeCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = y * 4; // degrees
      const tiltY = -x * 4;

      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.boxShadow = `
        ${-x * 12}px ${-y * 12 + 20}px 60px rgba(30,26,22,0.12),
        0 4px 16px rgba(30,26,22,0.06)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}


/* ─────────────────────────────────────────────
   PLACEHOLDER IMAGE FALLBACK STYLING
───────────────────────────────────────────── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.background = 'var(--parchment-dk)';
    this.style.objectFit = 'none';
    // Optional: add initials or icon as fallback
    const parent = this.parentElement;
    if (parent && !parent.querySelector('.img-placeholder-text')) {
      const placeholder = document.createElement('div');
      placeholder.className = 'img-placeholder-text';
      placeholder.style.cssText = `
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-cinzel); font-size: 0.7rem;
        letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--text-light); text-align: center; padding: 1rem;
      `;
      placeholder.textContent = this.alt || 'Photo';
      parent.style.position = 'relative';
      parent.appendChild(placeholder);
    }
  });
});
