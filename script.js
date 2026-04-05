/* ============================================================
   VICTOR MORAIS — script.js
   ============================================================ */

// ── Navbar scroll state ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ── Mobile menu toggle ──
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerLines = menuBtn.querySelectorAll('.hamburger-line');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('hidden', !menuOpen);

  if (menuOpen) {
    hamburgerLines[0].style.transform = 'translateY(7px) rotate(45deg)';
    hamburgerLines[1].style.opacity = '0';
    hamburgerLines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    hamburgerLines[0].style.transform = '';
    hamburgerLines[1].style.opacity = '';
    hamburgerLines[2].style.transform = '';
  }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link, #mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.add('hidden');
    hamburgerLines[0].style.transform = '';
    hamburgerLines[1].style.opacity = '';
    hamburgerLines[2].style.transform = '';
  });
});


// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ── Reveal on scroll (IntersectionObserver) ──
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for sibling cards
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 60, 300);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ── Animated counters ──
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isLarge = target >= 100;

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = isLarge ? current.toLocaleString('pt-BR') : current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isLarge ? target.toLocaleString('pt-BR') : target;
    }
  };

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active-nav');
        }
      });
    }
  });
}, {
  rootMargin: '-30% 0px -60% 0px'
});

sections.forEach(section => activeObserver.observe(section));


// ── Parallax subtle effect on hero orbs ──
window.addEventListener('mousemove', (e) => {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');

  if (!orb1 || !orb2) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  orb1.style.transform = `translate(${x * 15}px, ${y * 15}px) scale(1)`;
  orb2.style.transform = `translate(${-x * 10}px, ${-y * 10}px) scale(1)`;
}, { passive: true });
