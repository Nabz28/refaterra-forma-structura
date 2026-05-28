// =============================================================
// REFATERRA · V2 POLESTAR — page behaviors
// IntersectionObserver-based reveals, no scroll listeners.
// =============================================================

(() => {
  'use strict';

  // ---------- 1. NAV: hide on scroll down, show on scroll up ----------
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;
  let navTicking = false;
  function onNavScroll() {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      // Hairline + background opacity bump once past hero
      nav.classList.toggle('is-scrolled', y > 80);
      // Hide on scroll-down past threshold, show on scroll-up
      if (y > 80 && y > lastY + 2) {
        nav.classList.add('is-hidden');
      } else if (y < lastY - 2 || y < 80) {
        nav.classList.remove('is-hidden');
      }
      lastY = y;
      navTicking = false;
    });
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });

  // ---------- 2. KINETIC COUNTERS ----------
  const counterIO = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const unit = el.dataset.unit || '';
      const pad = parseInt(el.dataset.pad || '0', 10);
      const isInt = Number.isInteger(target);
      const start = performance.now();
      const dur = 1400;

      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        // ease-out-expo
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        const v = target * eased;
        // Indonesian number convention: comma as decimal separator.
        let display = isInt ? Math.round(v).toString() : v.toFixed(1).replace('.', ',');
        if (pad > 0) display = display.padStart(pad, '0');
        if (suffix) display = display + suffix;
        if (unit) {
          el.innerHTML = display + '<span class="unit-mini">' + unit + '</span>';
        } else {
          el.textContent = display;
        }
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    }
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-n').forEach((el) => counterIO.observe(el));

  // ---------- 3. REVEAL ANIMATIONS ----------
  // Mark every direct content section child for reveal except hero & nav
  const revealTargets = document.querySelectorAll(
    '.statement-grid, .fleet-head, .marque, ' +
    '.ops-head, .ops-toggle, .ops-stats, ' +
    '.map-head, .map-wrap, ' +
    '.cab-text, .cab-media, ' +
    '.det-card, ' +
    '.incl-head, .incl-list, ' +
    '.contract-head, .contract-grid, ' +
    '.op-media, .op-text, ' +
    '.bay-text, ' +
    '.contact-l, .contact-r, ' +
    '.foot-grid'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealIO = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealIO.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach((el) => revealIO.observe(el));

  // Safety pass: any reveal target already inside the viewport at page
  // load gets unstuck. Prevents the opacity-0 stuck bug when the user
  // refreshes mid-page or lands via hash anchor.
  setTimeout(() => {
    revealTargets.forEach((el) => {
      if (el.classList.contains('is-in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('is-in');
      }
    });
  }, 120);

  // ---------- 4. MARQUE CONFIGURATOR ----------
  const tabs = document.querySelectorAll('.marque-tab');
  const images = document.querySelectorAll('.marque-img');
  const specs = document.querySelectorAll('[data-marque-spec]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t.dataset.tab === target;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active);
      });
      images.forEach((img) => {
        img.classList.toggle('is-active', img.dataset.marque === target);
      });
      specs.forEach((s) => {
        const match = s.dataset.marqueSpec === target;
        s.hidden = !match;
      });
    });
  });

  // ---------- 5. DAY / NIGHT TOGGLE ----------
  const opsButtons = document.querySelectorAll('.ops-btn');
  const opsImgs = document.querySelectorAll('.ops-img');
  const opsStats = document.querySelectorAll('.os-v');
  const opsStage = document.querySelector('.ops-stage');

  opsButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      opsButtons.forEach((b) => {
        const active = b.dataset.mode === mode;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active);
      });
      opsImgs.forEach((img) => {
        img.classList.toggle('is-active', img.dataset.img === mode);
      });
      opsStage.dataset.mode = mode;
      // Fade out, swap text, fade in
      opsStats.forEach((s) => {
        s.style.opacity = '0';
        setTimeout(() => {
          s.textContent = s.dataset[mode];
          s.style.opacity = '1';
        }, 200);
      });
    });
  });

  // ---------- 6. SMOOTH SCROLL OFFSET for fixed nav ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
      // close mobile drawer if open
      closeDrawer();
    });
  });

  // ---------- 7. MOBILE DRAWER ----------
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('mobile-drawer');
  const scrim = document.getElementById('m-scrim');
  const drawerClose = document.getElementById('m-drawer-close');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (scrim) scrim.classList.add('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('m-drawer-locked');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (scrim) scrim.classList.remove('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('m-drawer-locked');
  }

  if (burger) {
    burger.addEventListener('click', () => {
      if (drawer.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });
  }
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // ---------- 8. MOBILE STICKY ACTION BAR ----------
  // Show after user has scrolled past hero, hide near footer (avoid CTA overlap).
  const actionBar = document.getElementById('m-action');
  if (actionBar) {
    let actionTicking = false;
    function onActionScroll() {
      if (actionTicking) return;
      actionTicking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const heroH = (document.querySelector('.hero') || {}).offsetHeight || 600;
        const docH = document.documentElement.scrollHeight;
        const viewH = window.innerHeight;
        const nearBottom = (y + viewH) > (docH - 400); // hide last 400px (footer/contact CTA area)
        const pastHero = y > heroH - viewH * 0.4;
        actionBar.classList.toggle('is-visible', pastHero && !nearBottom);
        actionTicking = false;
      });
    }
    window.addEventListener('scroll', onActionScroll, { passive: true });
    window.addEventListener('resize', onActionScroll, { passive: true });
    onActionScroll();
  }
})();
