/* =====================================================
   NAMAN SPORTS — script.js
   Shared JS for all 4 pages
   ===================================================== */

// ── 0. THEME TOGGLE ──
(function initTheme() {
  const saved = localStorage.getItem('ns-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('ns-theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('ns-theme', 'dark');
      }
    });
  }
});

// ── 1. PRELOADER ──
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
      setTimeout(() => preloader.remove(), 600);
    }, 1800);
  }
});

// ── 2. NAVBAR SCROLL EFFECT ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── 3. HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ── 4. SCROLL REVEAL (Intersection Observer) ──
function observeReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', observeReveal);
window.addEventListener('load', observeReveal);

// ── 5. HERO BACKGROUND CAROUSEL ──
(function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-bg');
  if (slides.length <= 1) return;

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 6000);
})();

// ── 6. HERO SPARKLE PARTICLES ──
(function initSparkles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let w, h, particles = [];
  let mouse = { x: -100, y: -100 };

  function resize() {
    w = canvas.width = container.offsetWidth;
    h = canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  class Sparkle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.sparkleChance = Math.random() * 0.05;
      this.twinkle = Math.random() * 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;

      // Twinkle effect
      this.alpha += (Math.random() - 0.5) * 0.05;
      if (this.alpha < 0.1) this.alpha = 0.1;
      if (this.alpha > 0.7) this.alpha = 0.7;

      // Mouse interaction
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x += dx * 0.01;
        this.y += dy * 0.01;
      }

      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      // Draw star shape for sparkle
      const spikes = 4;
      const outerRadius = this.size;
      const innerRadius = this.size / 2;
      let rot = Math.PI / 2 * 3;
      let x = this.x;
      let y = this.y;
      let step = Math.PI / spikes;

      ctx.moveTo(this.x, this.y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = this.x + Math.cos(rot) * outerRadius;
        y = this.y + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = this.x + Math.cos(rot) * innerRadius;
        y = this.y + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(this.x, this.y - outerRadius);
      ctx.closePath();

      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();

      // Bloom/glow
      if (this.alpha > 0.4) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.alpha * 0.3})`;
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Sparkle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── 7. HERO SCROLL INDICATOR FADE ──
const scrollHint = document.querySelector('.hero-scroll-indicator');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    scrollHint.style.opacity = window.scrollY > 120 ? '0' : '1';
  }, { passive: true });
}

// ── 8. BUTTON RIPPLE EFFECT ──
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ── 9. PRODUCT CATEGORY FILTER (Products page) ──
const filterBtns = document.querySelectorAll('.filter-btn');
const productSections = document.querySelectorAll('.product-section');

if (filterBtns.length && productSections.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      productSections.forEach(sec => {
        if (cat === 'all' || sec.dataset.category === cat) {
          sec.style.display = '';
          sec.style.opacity = '0';
          setTimeout(() => sec.style.opacity = '1', 50);
        } else {
          sec.style.display = 'none';
        }
      });

      // Re-observe reveals in newly shown sections
      observeReveal();
    });
  });
}

// ── 10. CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Show success toast
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
    contactForm.reset();
  });
}

// ── 11. CARD TILT EFFECT (Desktop) ──
document.querySelectorAll('.cat-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -4;
    const rotateY = ((x - cx) / cx) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── 12. ACTIVE NAV LINK ──
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── 13. COUNTER ANIMATION ──
function animateCounters() {
  document.querySelectorAll('.stat-value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current + suffix;
    }, 30);
  });
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}
