/* ===========================
   DREAMEA INK — WORK PAGE JS
   =========================== */

// ===== NAV SHADOW ON SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10
    ? '0 1px 0 #e0e0e0'
    : 'none';
}, { passive: true });

// ===== MOBILE DRAWER =====
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('drawer');
const overlay = document.getElementById('drawerOverlay');

function toggleDrawer(open) {
  drawer.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  burger.classList.toggle('open', open);
}

burger?.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('open')));
overlay?.addEventListener('click', () => toggleDrawer(false));
drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));

// ===== CARDS =====
const cards = document.querySelectorAll('.card');


// ===== LOAD MORE =====
document.getElementById('loadMore')?.addEventListener('click', function () {
  this.textContent = 'No more projects';
  this.disabled = true;
  this.style.opacity = '0.4';
  this.style.cursor = 'default';
});

// ===== ENTRANCE ANIMATION =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'none';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -32px 0px' });

cards.forEach((card, i) => {
  card.style.opacity    = '0';
  card.style.transform  = 'translateY(20px)';
  card.style.transition = `opacity 0.65s ${i * 55}ms ease, transform 0.65s ${i * 55}ms ease`;
  io.observe(card);
});
