// Boulder Bright Lights — site interactions

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initReveal();
  initSnow();
  initYear();
  initContactForm();
  initGallery();
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
    status.textContent = 'Opening your email app to send this. Talk soon!';
    form.reset();
  });
}

function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close photo">&times;</button>' +
    '<button type="button" class="lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
    '<figure><img alt="" /><figcaption><span class="lightbox-text"></span><span class="lightbox-count"></span></figcaption></figure>' +
    '<button type="button" class="lightbox-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(box);

  const img = box.querySelector('img');
  const text = box.querySelector('.lightbox-text');
  const count = box.querySelector('.lightbox-count');
  const closeBtn = box.querySelector('.lightbox-close');
  const prevBtn = box.querySelector('.lightbox-prev');
  const nextBtn = box.querySelector('.lightbox-next');
  let current = 0;
  let lastFocus = null;

  if (items.length < 2) { prevBtn.hidden = true; nextBtn.hidden = true; }

  function show(i) {
    current = (i + items.length) % items.length;
    const item = items[current];
    const thumb = item.querySelector('img');
    img.src = item.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    text.textContent = item.dataset.caption || '';
    count.textContent = items.length > 1 ? (current + 1) + ' / ' + items.length : '';
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }
  function close() {
    box.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    if (lastFocus) lastFocus.focus();
  }

  items.forEach((item, i) => {
    item.addEventListener('click', (e) => { e.preventDefault(); open(i); });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
}
