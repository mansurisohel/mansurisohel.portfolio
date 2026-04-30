/* ============================================================
   main.js  |  Portfolio — Shared functionality (Enhanced)
   Dark Mode | Mobile Menu | Navbar Scroll | Back to Top
   Parallax | Scroll Reveal | Typed Text | Skill Bars
   ============================================================ */

(function () {
    'use strict';

    /* -------------------------------------------------------
       Dark Mode Toggle
    ------------------------------------------------------- */
    var checkbox    = document.getElementById('themeCheckbox');
    var toggleLabel = document.querySelector('.toggle-label');

    function applyDarkMode(enabled) {
        document.body.classList.toggle('dark-mode', !!enabled);
        if (checkbox)    checkbox.checked        = !!enabled;
        if (toggleLabel) toggleLabel.textContent = enabled ? 'Light' : 'Dark';
    }

    applyDarkMode(localStorage.getItem('darkMode') === 'enabled');

    if (checkbox) {
        checkbox.addEventListener('change', function () {
            applyDarkMode(this.checked);
            localStorage.setItem('darkMode', this.checked ? 'enabled' : 'disabled');
        });
    }

    /* -------------------------------------------------------
       Mobile Menu
    ------------------------------------------------------- */
    var menuToggle = document.getElementById('menuToggle');
    var navMenu    = document.getElementById('navMenu');
    var overlay    = document.getElementById('overlay');

    function closeMenu() {
        if (menuToggle) menuToggle.classList.remove('active');
        if (navMenu)    navMenu.classList.remove('active');
        if (overlay)    overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        if (menuToggle) menuToggle.classList.add('active');
        if (navMenu)    navMenu.classList.add('active');
        if (overlay)    overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navMenu && navMenu.classList.contains('active') ? closeMenu() : openMenu();
        });
    }

    if (overlay) overlay.addEventListener('click', closeMenu);
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    /* -------------------------------------------------------
       Navbar scroll effect + Back-to-Top visibility
    ------------------------------------------------------- */
    var navbar    = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (navbar)    navbar.classList.toggle('scrolled', y > 50);
        if (backToTop) backToTop.classList.toggle('visible', y > 300);
        handleScrollReveal();
        handleCounters();
        animateSkillBars();
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* -------------------------------------------------------
       Parallax — hero background + floating cards
    ------------------------------------------------------- */
    var heroBackground = document.querySelector('.hero-background');
    var heroOrb        = document.querySelector('.hero-gradient-orb');
    var floatingCards  = document.querySelectorAll('.floating-card');

    /* Unified rAF loop for smooth parallax + floating cards */
    var ticking = false;
    function onScroll() { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }
    function updateParallax() {
        var y = window.scrollY;
        if (heroBackground) heroBackground.style.transform = 'translateY(' + (y * 0.28) + 'px)';
        if (heroOrb)        heroOrb.style.transform        = 'translateY(' + (y * 0.12) + 'px)';
        ticking = false;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Floating cards — pure rAF sine wave + parallax */
    if (floatingCards.length) {
        floatingCards.forEach(function (c) { c.style.animation = 'none'; }); /* disable CSS anim */
        var startTs = null;
        function animCards(ts) {
            if (!startTs) startTs = ts;
            var t   = (ts - startTs) / 1000;
            var sy  = window.scrollY;
            floatingCards.forEach(function (card, i) {
                var floatY    = Math.sin(t + i * 2.09) * 14;
                var parallaxY = -sy * (0.06 + i * 0.03);
                card.style.transform = 'translateY(' + (floatY + parallaxY) + 'px)';
            });
            requestAnimationFrame(animCards);
        }
        requestAnimationFrame(animCards);
    }

    /* -------------------------------------------------------
       Scroll Reveal
    ------------------------------------------------------- */
    var revealTargets = [
        '.service-card', '.skill-category', '.timeline-item',
        '.project-card-full', '.info-card', '.stat-box',
        '.certificate-card', '.section-header', '.about-text',
        '.about-image-wrapper', '.cta-content', '.audio-wrapper',
        '.footer-col', '.contact-left', '.contact-right'
    ];
    var revealEls = [];

    function initReveal() {
        document.querySelectorAll(revealTargets.join(',')).forEach(function (el) {
            if (el.dataset.srInit) return;
            el.dataset.srInit = '1';
            el.classList.add('sr-hidden');
            revealEls.push(el);
        });
    }

    function handleScrollReveal() {
        var wh = window.innerHeight;
        revealEls.forEach(function (el, idx) {
            if (el.classList.contains('sr-visible')) return;
            var rect = el.getBoundingClientRect();
            if (rect.top < wh * 0.9) {
                /* Stagger siblings */
                var delay = 0;
                var parent = el.parentElement;
                if (parent) {
                    var siblings = Array.prototype.slice.call(parent.children);
                    var pos = siblings.indexOf(el);
                    delay = Math.min(pos * 70, 350);
                }
                el.style.transitionDelay = delay + 'ms';
                el.classList.add('sr-visible');
                el.classList.remove('sr-hidden');
            }
        });
    }

    /* -------------------------------------------------------
       Animated Counters (elements with data-counter attribute)
    ------------------------------------------------------- */
    var countersTriggered = false;
    function handleCounters() {
        if (countersTriggered) return;
        var els = document.querySelectorAll('[data-counter]');
        if (!els.length) return;
        var rect = els[0].getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.9) return;
        countersTriggered = true;
        els.forEach(function (el) {
            var target   = parseFloat(el.getAttribute('data-counter'));
            var suffix   = el.getAttribute('data-suffix') || '';
            var startTs  = null;
            var duration = 1600;
            function step(ts) {
                if (!startTs) startTs = ts;
                var p = Math.min((ts - startTs) / duration, 1);
                var e = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(target * e) + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    /* -------------------------------------------------------
       Skill Bar Animation
    ------------------------------------------------------- */
    var skillBarsAnimated = false;
    function animateSkillBars() {
        if (skillBarsAnimated) return;
        var bars = document.querySelectorAll('.skill-progress');
        if (!bars.length) return;
        var rect = bars[0].getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.92) return;
        skillBarsAnimated = true;
        bars.forEach(function (bar) {
            var target = bar.style.width;
            bar.style.width      = '0%';
            bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
            setTimeout(function () { bar.style.width = target; }, 120);
        });
    }

    /* -------------------------------------------------------
       Typed Text (element with class .typed-text + data-words)
    ------------------------------------------------------- */
    var typedEl = document.querySelector('.typed-text');
    if (typedEl) {
        var words = [];
        try { words = JSON.parse(typedEl.getAttribute('data-words') || '[]'); } catch(e) {}
        if (words.length) {
            var wIdx = 0, cIdx = 0, deleting = false;
            function type() {
                var word = words[wIdx];
                if (!deleting) {
                    typedEl.textContent = word.substring(0, ++cIdx);
                    if (cIdx === word.length) { deleting = true; return setTimeout(type, 1800); }
                } else {
                    typedEl.textContent = word.substring(0, --cIdx);
                    if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
                }
                setTimeout(type, deleting ? 55 : 115);
            }
            type();
        }
    }

    /* -------------------------------------------------------
       Cursor glow (desktop only)
    ------------------------------------------------------- */
    if (window.matchMedia('(pointer: fine)').matches) {
        var glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        var mx = 0, my = 0, gx = 0, gy = 0;
        document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
        (function animGlow() {
            gx += (mx - gx) * 0.1;
            gy += (my - gy) * 0.1;
            glow.style.left = gx + 'px';
            glow.style.top  = gy + 'px';
            requestAnimationFrame(animGlow);
        })();
        document.querySelectorAll('a, button, .service-card, .project-card-full, .skill-category, .detail-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () { glow.classList.add('cursor-glow--active'); });
            el.addEventListener('mouseleave', function () { glow.classList.remove('cursor-glow--active'); });
        });
    }

    /* -------------------------------------------------------
       Active nav link from current path
    ------------------------------------------------------- */
    var path = (window.location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav-link').forEach(function (link) {
        var href = link.getAttribute('href') || '';
        var match = href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html');
        link.classList.toggle('active', match);
    });

    /* -------------------------------------------------------
       Smooth anchor scroll
    ------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    /* Init */
    initReveal();
    handleScrollReveal();
    handleCounters();
    animateSkillBars();

}());
