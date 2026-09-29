document.documentElement.classList.add('js');

// Scroll animation: dikendalikan CSS (animation-timeline: view()) bila didukung.
// Fallback: state ditentukan posisi elemen (bukan arah scroll), jadi reversible.
if (!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'))) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const top = e.rootBounds ? e.rootBounds.top : 0;
      e.target.classList.toggle('visible', e.isIntersecting);
      e.target.classList.toggle('is-above', !e.isIntersecting && e.boundingClientRect.top < top);
    });
  }, { threshold: 0, rootMargin: '-10% 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
}

const navLinks = [...document.querySelectorAll('nav ul a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => {
  const s = document.querySelector(a.getAttribute('href'));
  if (s) spy.observe(s);
});

// Light/dark mode
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    root.removeAttribute('data-theme');
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
}

let saved = null;
try { saved = localStorage.getItem('theme'); } catch (err) { /* storage unavailable, ignore */ }
const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved || (systemDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (err) { /* storage unavailable, ignore */ }
});