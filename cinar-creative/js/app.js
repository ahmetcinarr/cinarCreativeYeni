(function() {
  const html = document.documentElement;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) html.setAttribute('data-theme', storedTheme);

  function setTheme(next) {
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('.theme-toggle');
    if (t) {
      const now = html.getAttribute('data-theme') || 'dark';
      setTheme(now === 'dark' ? 'light' : 'dark');
    }
  });

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Custom cursor
  const cursor = document.querySelector('.custom-cursor');
  const outline = document.querySelector('.custom-cursor-outline');
  let mouseX = 0, mouseY = 0, outX = 0, outY = 0;
  function raf() {
    outX += (mouseX - outX) * 0.15;
    outY += (mouseY - outY) * 0.15;
    if (cursor) cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    if (outline) outline.style.transform = `translate(${outX - 18}px, ${outY - 18}px)`;
    requestAnimationFrame(raf);
  }
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  requestAnimationFrame(raf);

  // Navbar scroll state
  const header = document.querySelector('.site-header');
  function onScroll() {
    const scrolled = window.scrollY > 20;
    header && header.classList.toggle('scrolled', scrolled);
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Initialize smooth scroll (Lenis)
  function initLenis() {
    if (!window.Lenis) return null;
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.08 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return lenis;
  }

  // GSAP animations
  function initGSAP() {
    if (!window.gsap) return;
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.from(card, { opacity: 0, y: 24, duration: .8, delay: i * 0.05, scrollTrigger: { trigger: card, start: 'top 85%' } });
    });
    gsap.utils.toArray('.section-header').forEach((el) => {
      gsap.from(el, { opacity: 0, y: 16, duration: .6, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    gsap.utils.toArray('.work-card').forEach((el, i) => {
      gsap.from(el, { opacity: 0, y: 24, duration: .7, delay: i * 0.04, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
  }

  // Swiper
  function initSwipers() {
    if (!window.Swiper) return;
    const portfolioEl = document.querySelector('.portfolio-swiper');
    if (portfolioEl) {
      new Swiper(portfolioEl, {
        slidesPerView: 1.1,
        spaceBetween: 14,
        centeredSlides: true,
        loop: true,
        pagination: { el: '.portfolio .swiper-pagination', clickable: true },
        breakpoints: { 800: { slidesPerView: 1.4, spaceBetween: 18 } }
      });
    }
    const testiEl = document.querySelector('.testimonials-swiper');
    if (testiEl) {
      new Swiper(testiEl, {
        autoHeight: true,
        slidesPerView: 1,
        loop: true,
        pagination: { el: '.testimonials .swiper-pagination', clickable: true },
        autoplay: { delay: 4000 }
      });
    }
  }

  // GLightbox
  let lightbox;
  function initLightbox() {
    if (!window.GLightbox) return;
    if (lightbox) lightbox.destroy();
    lightbox = GLightbox({ selector: '.glightbox' });
  }

  // MixItUp on work grid
  function initMixitup() {
    if (!window.mixitup) return;
    const container = document.querySelector('#work-grid');
    if (container) {
      mixitup(container, { selectors: { target: '.mix' }, animation: { duration: 400, effects: 'fade translateY(12px)' } });
    }
  }

  // Barba transitions
  function initBarba() {
    if (!window.barba) return;
    barba.init({
      transitions: [{
        name: 'fade',
        leave(data) {
          document.body.classList.add('is-transitioning');
          return gsap && gsap.to(data.current.container, { opacity: 0, duration: 0.2 });
        },
        enter(data) {
          window.scrollTo(0, 0);
          document.body.classList.remove('is-transitioning');
          return gsap && gsap.from(data.next.container, { opacity: 0, duration: 0.2 });
        }
      }],
      views: [
        { namespace: 'home', beforeEnter() { initSwipers(); initLightbox(); } },
        { namespace: 'work', beforeEnter() { initMixitup(); initLightbox(); } },
        { namespace: 'about', beforeEnter() { initLightbox(); } },
        { namespace: 'services', beforeEnter() { /* noop */ } },
        { namespace: 'contact', beforeEnter() { /* noop */ } }
      ]
    });

    // re-init after any page change
    barba.hooks.afterEnter(() => {
      initGSAP();
      initSwipers();
      initLightbox();
      initMixitup();
    });
  }

  // Boot
  window.addEventListener('load', () => {
    initLenis();
    initGSAP();
    initSwipers();
    initLightbox();
    initMixitup();
    initBarba();
  });
})();