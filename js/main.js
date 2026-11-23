/* ========================================
   01Bytesoft — main.js
   ======================================== */

(function () {
  'use strict';

  /* ── Helpers ── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Sticky header ── */
  const header = qs('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  qsa('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ── Mobile menu ── */
  const hamburger  = qs('.hamburger');
  const mobileNav  = qs('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on nav link click
    qsa('.mobile-nav a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Mobile services submenu toggle
    const toggle = qs('.mobile-services-toggle');
    const submenu = qs('.mobile-submenu');
    if (toggle && submenu) {
      toggle.addEventListener('click', () => {
        const open = toggle.classList.toggle('open');
        submenu.classList.toggle('open', open);
      });
    }
  }

  /* ── Scroll-reveal ── */
  const revealEls = qsa('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Scroll-to-top ── */
  const scrollTop = qs('.scroll-top');
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      scrollTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Counter animation (stats strip) ── */
  const counters = qsa('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count, 10);
        const dur = 1800;
        const step = end / (dur / 16);
        let cur = 0;
        const tick = () => {
          cur = Math.min(cur + step, end);
          el.textContent = Math.floor(cur) + (el.dataset.suffix || '');
          if (cur < end) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countIO.observe(c));
  }

  /* ── Contact form ── */
  const contactForm = qs('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn    = contactForm.querySelector('[type=submit]');
      const status = qs('.form-status');
      const data   = new FormData(contactForm);

      btn.disabled = true;
      btn.textContent = 'Sending…';
      if (status) { status.textContent = ''; status.className = 'form-status'; }

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          if (status) { status.textContent = '✓ Message sent! We\'ll be in touch soon.'; status.className = 'form-status success'; }
          contactForm.reset();
        } else {
          throw new Error('server');
        }
      } catch {
        if (status) {
          status.textContent = '✗ Could not send. Please email us at Contacts@01Bytesoft.com';
          status.className = 'form-status error';
        }
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    });
  }

  /* ── Free-quote inline form ── */
  const quoteForm = qs('#quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn    = quoteForm.querySelector('[type=submit]');
      const status = qs('#quoteStatus');
      const data   = new FormData(quoteForm);

      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const res = await fetch(quoteForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          if (status) { status.textContent = '✓ Request received! We will reach out shortly.'; status.className = 'form-status success'; }
          quoteForm.reset();
        } else {
          throw new Error();
        }
      } catch {
        if (status) {
          status.textContent = '✗ Unable to submit. Email us at Contacts@01Bytesoft.com';
          status.className = 'form-status error';
        }
      } finally {
        btn.disabled = false;
        btn.textContent = 'Get a Free Quote';
      }
    });
  }

  /* ── Newsletter form ── */
  qsa('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type=email]');
      const btn   = form.querySelector('button');
      if (!input || !input.value) return;
      btn.textContent = '✓ Subscribed';
      btn.disabled = true;
      input.value = '';
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
    });
  });

})();
