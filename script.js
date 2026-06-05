/* ===========================
   DREAMEA INK — INTERACTIONS
   =========================== */

// ===== CUSTOM CURSOR =====
const cursor = document.createElement('div');
cursor.className = 'cursor';
const cursorRing = document.createElement('div');
cursorRing.className = 'cursor-ring';
document.body.append(cursor, cursorRing);

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function followRing() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(followRing);
})();

document.querySelectorAll('a, button, .project-card, .service-item, .social-item, .slide-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('expanded');
    cursorRing.classList.add('expanded');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('expanded');
    cursorRing.classList.remove('expanded');
  });
});

// ===== NAV SCROLL BEHAVIOUR =====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 64);
}, { passive: true });

// ===== MOBILE MENU TOGGLE =====
const menuToggle  = document.getElementById('menuToggle');
const navOverlay  = document.getElementById('navOverlay');

function openNav() {
  nav.classList.add('open');
  navOverlay.classList.add('visible');
  menuToggle.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  nav.classList.remove('open');
  navOverlay.classList.remove('visible');
  menuToggle.classList.remove('active');
  document.body.style.overflow = '';
}

menuToggle?.addEventListener('click', () => {
  nav.classList.contains('open') ? closeNav() : openNav();
});

navOverlay?.addEventListener('click', closeNav);

// Close nav on topbar link click (mobile — topbar is hidden but just in case)
document.querySelectorAll('.topbar-links a').forEach(a => {
  a.addEventListener('click', () => closeNav());
});

// ===== WORD MASK REVEAL — split headings into animated words =====
function splitIntoWords(selector) {
  document.querySelectorAll(selector).forEach(el => {
    // Preserve <br> tags by replacing with a placeholder
    const raw = el.innerHTML.replace(/<br\s*\/?>/gi, '|||BR|||');
    const segments = raw.split('|||BR|||');

    el.innerHTML = segments.map(seg => {
      return seg.trim().split(/\s+/).filter(Boolean).map(word =>
        `<span class="word-mask"><span class="word-inner">${word}</span></span>`
      ).join(' ');
    }).join('<br>');

    // Stagger each word's transition-delay
    el.querySelectorAll('.word-inner').forEach((w, i) => {
      w.style.transitionDelay = `${i * 0.07}s`;
    });
  });
}

splitIntoWords('.about-title, .section-title, .cta-title');

// Observe headings — bidirectional: animate in AND out on scroll
const wordObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('words-visible');
    } else {
      entry.target.classList.remove('words-visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.about-title, .section-title, .cta-title').forEach(el => {
  wordObserver.observe(el);
});

// ===== SECTION LABEL WIPE — bidirectional =====
const labelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('label-visible');
    } else {
      entry.target.classList.remove('label-visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-label').forEach(el => labelObserver.observe(el));

// ===== PROJECT CARDS STAGGER — bidirectional =====
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const cards = [...entry.target.querySelectorAll('.project-card')];
    if (entry.isIntersecting) {
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('card-visible'), i * 120);
      });
    } else {
      cards.forEach(card => card.classList.remove('card-visible'));
    }
  });
}, { threshold: 0.1 });

const projectsGrid = document.querySelector('.projects-grid');
if (projectsGrid) cardObserver.observe(projectsGrid);

// ===== GENERAL REVEAL — bidirectional =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const dur    = 2000;
  let start    = null;

  function tick(ts) {
    if (!start) start = ts;
    const p     = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsBlock = document.querySelector('.about-stats');
if (statsBlock) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      statsBlock.querySelectorAll('.stat-num').forEach(countUp);
    }
  }, { threshold: 0.5 }).observe(statsBlock);
}

// ===== HERO VIDEO FADE-IN =====
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const onReady = () => heroVideo.classList.add('loaded');
  heroVideo.readyState >= 3 ? onReady()
    : heroVideo.addEventListener('canplaythrough', onReady, { once: true });
  heroVideo.addEventListener('loadeddata', onReady, { once: true });
}

// ===== PHOTO SLIDER — DRAG TO SCRUB =====
const sliderWrap = document.querySelector('.photo-slider-wrap');
const slider     = document.querySelector('.photo-slider');

if (slider && sliderWrap) {
  let isDragging  = false;
  let startX      = 0;
  let currentOffset = 0;
  let animOffset  = 0;
  let rafId       = null;

  // Read the current CSS animation translateX value
  function getAnimX() {
    const style = window.getComputedStyle(slider);
    const mat   = new WebKitCSSMatrix(style.transform);
    return mat.m41;
  }

  sliderWrap.addEventListener('mousedown', (e) => {
    isDragging  = true;
    startX      = e.clientX;
    animOffset  = getAnimX();
    currentOffset = animOffset;
    slider.style.animationPlayState = 'paused';
    slider.style.transform = `translateX(${currentOffset}px)`;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta  = e.clientX - startX;
    currentOffset = animOffset + delta;
    slider.style.transform = `translateX(${currentOffset}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.animationPlayState = '';
    slider.style.transform = '';
  });

  // Touch support
  sliderWrap.addEventListener('touchstart', (e) => {
    startX     = e.touches[0].clientX;
    animOffset = getAnimX();
    currentOffset = animOffset;
    slider.style.animationPlayState = 'paused';
    slider.style.transform = `translateX(${currentOffset}px)`;
  }, { passive: true });

  sliderWrap.addEventListener('touchmove', (e) => {
    const delta  = e.touches[0].clientX - startX;
    currentOffset = animOffset + delta;
    slider.style.transform = `translateX(${currentOffset}px)`;
  }, { passive: true });

  sliderWrap.addEventListener('touchend', () => {
    slider.style.animationPlayState = '';
    slider.style.transform = '';
  });
}

// ===== SERVICE LIST — DIM SIBLINGS ON HOVER =====
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    serviceItems.forEach(s => { if (s !== item) s.style.opacity = '0.4'; });
  });
  item.addEventListener('mouseleave', () => {
    serviceItems.forEach(s => s.style.opacity = '');
  });
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

