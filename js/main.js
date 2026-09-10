// Boulder Bright Lights — site interactions

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initReveal();
  initSnow();
  initYear();
  initContactForm();
});

function initNavToggle() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('is-open'));
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  items.forEach((el) => io.observe(el));
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

function initSnow() {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let width, height, flakes;
  const FLAKE_COUNT = 70;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function makeFlakes() {
    flakes = Array.from({ length: FLAKE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 0.6 + 0.25,
      drift: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    flakes.forEach((f) => {
      ctx.globalAlpha = f.opacity;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.y += f.speed;
      f.x += f.drift;
      if (f.y > height) { f.y = -4; f.x = Math.random() * width; }
      if (f.x > width) f.x = 0;
      if (f.x < 0) f.x = width;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  resize();
  makeFlakes();
  tick();
  window.addEventListener('resize', () => {
    resize();
    makeFlakes();
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!firstName || !email || !message) {
      status.textContent = 'Please fill in your name, email, and message.';
      return;
    }

    const subject = encodeURIComponent(`Lighting consultation request from ${firstName} ${lastName}`);
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:Boulderbrightlights@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = 'Opening your email app to send this — talk soon!';
    form.reset();
  });
}
