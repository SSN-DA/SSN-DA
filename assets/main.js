const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Scroll reveal: fade in once, then hand control back to hover styles ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');
    revealObserver.unobserve(el);
    // once the entrance finishes, drop the fade classes so their long delays don't slow down hover effects
    el.addEventListener('transitionend', function done(e) {
      if (e.target !== el || (e.propertyName !== 'opacity' && e.propertyName !== 'transform')) return;
      el.removeEventListener('transitionend', done);
      el.className = el.className.replace(/\bfade-up(-delay-\d)?\b|\bvisible\b/g, '').replace(/\s+/g, ' ').trim();
    });
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// ── Nav: shrink on scroll + highlight current section ──
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
[...navLinks].map(a => a.getAttribute('href')).filter(h => h.startsWith('#')).map(h => h.slice(1)).forEach(id => {
  const s = document.getElementById(id); if (s) sectionObserver.observe(s);
});

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
function setMenu(open) {
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  hamburger.setAttribute('aria-expanded', open);
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.setAttribute('aria-hidden', !open);
}
hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

// ── Hero: typing role line ──
const typed = document.getElementById('typed');
const roles = JSON.parse(typed.dataset.roles);
if (reduceMotion) {
  typed.textContent = roles[0];
} else {
  let r = 0, c = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    typed.textContent = word.slice(0, c);
    let delay = deleting ? 28 : 55;
    if (!deleting && c === word.length) { deleting = true; delay = 1700; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
    c += deleting ? -1 : 1;
    setTimeout(tick, delay);
  })();
}

// ── Hero: gentle photo parallax on mouse move ──
const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero-frame img');
if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
  hero.addEventListener('pointermove', e => {
    const b = hero.getBoundingClientRect();
    heroImg.style.setProperty('--px', ((e.clientX - b.left) / b.width - 0.5) * -16 + 'px');
    heroImg.style.setProperty('--py', ((e.clientY - b.top) / b.height - 0.5) * -12 + 'px');
  });
  hero.addEventListener('pointerleave', () => { heroImg.style.setProperty('--px', '0px'); heroImg.style.setProperty('--py', '0px'); });
}

// ── Cards: cursor-follow spotlight ──
document.querySelectorAll('.sk, .int-card, .edu-banner').forEach(card => {
  card.addEventListener('pointermove', e => {
    const b = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - b.left) + 'px');
    card.style.setProperty('--my', (e.clientY - b.top) + 'px');
  });
});
