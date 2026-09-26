/* ============================================================
   CENT EDGE CONSULTING — script.js v2
   
   Features:
   1. Sticky header on scroll
   2. Mobile nav toggle (hamburger menu)
   3. Active nav link highlighting
   4. Scroll reveal animations (Intersection Observer — no library)
   5. Animated number counters on scroll
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. STICKY HEADER
     Adds .sticky class when user scrolls past 80px.
     CSS handles the visual change.
  ---------------------------------------------------------- */
  var header = document.getElementById('site-header');

  if (header) {
    function handleScroll() {
      header.classList.toggle('sticky', window.scrollY > 80);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }


  /* ----------------------------------------------------------
     2. MOBILE NAV TOGGLE
  ---------------------------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var siteNav   = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.contains('open') ? closeNav() : openNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (e) {
      if (
        siteNav.classList.contains('open') &&
        !siteNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeNav();
      }
    });

    function openNav() {
      siteNav.classList.add('open');
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }


  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK
  ---------------------------------------------------------- */
  var navLinks    = document.querySelectorAll('.site-nav a:not(.dropdown-menu a)');
  var currentPath = window.location.pathname.replace(/\/index\.html$/, '');
  if (currentPath.length > 1 && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
  }
  if (!currentPath) currentPath = '/';

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var normHref = href.replace(/\/index\.html$/, '');
    if (normHref.length > 1 && normHref.endsWith('/')) {
      normHref = normHref.slice(0, -1);
    }
    if (!normHref) normHref = '/';

    link.classList.remove('active');

    if (normHref === '/') {
      if (currentPath === '/') {
        link.classList.add('active');
      }
    } else {
      if (currentPath === normHref || currentPath.startsWith(normHref + '/')) {
        link.classList.add('active');
      }
    }
  });


  /* ----------------------------------------------------------
     4. SCROLL REVEAL
     Elements with [data-reveal] start invisible.
     When they scroll into view, .is-visible is added.
     CSS handles the transition.
     
     Add data-delay="200" (ms) for staggered animations.
     
     Usage: <div data-reveal>...</div>
            <div data-reveal data-delay="200">...</div>
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el    = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      revealObserver.observe(el);
    });

  } else {
    /* Fallback for browsers without IntersectionObserver */
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ----------------------------------------------------------
     5. NUMBER COUNTER ANIMATION
     Elements with [data-counter] count up from 0 to data-target
     when scrolled into view.
     
     Attributes:
     - data-target="111200"   — the end value (required)
     - data-prefix="₹"       — text before the number (optional)
     - data-suffix="%+"       — text after the number (optional)
     
     Usage: <span data-counter data-target="111200" data-prefix="₹">1,11,200</span>
            The HTML content is the SEO fallback (shown to no-JS users & bots).
  ---------------------------------------------------------- */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function runCounter(el) {
    var target   = parseFloat(el.getAttribute('data-target'));
    var prefix   = el.getAttribute('data-prefix')  || '';
    var suffix   = el.getAttribute('data-suffix')  || '';
    var duration = 1800;
    var startTime = null;
    var isLarge  = target >= 1000;

    function fmt(num) {
      return isLarge
        ? Math.floor(num).toLocaleString('en-IN')
        : Math.floor(num).toString();
    }

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed  = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var value    = easeOutCubic(progress) * target;
      el.textContent = prefix + fmt(value) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + (isLarge ? target.toLocaleString('en-IN') : target) + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-counter]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

})();
