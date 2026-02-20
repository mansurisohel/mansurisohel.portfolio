/* ============================================================
   main.js  |  Portfolio — Shared functionality
   Dark Mode | Mobile Menu | Navbar Scroll | Back to Top
   ============================================================ */

(function () {
    'use strict';

    /* -------------------------------------------------------
       Dark Mode Toggle
       Checkbox id: themeCheckbox
    ------------------------------------------------------- */
    var checkbox   = document.getElementById('themeCheckbox');
    var toggleLabel = document.querySelector('.toggle-label');

    function applyDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        if (checkbox)     checkbox.checked       = !!enabled;
        if (toggleLabel)  toggleLabel.textContent = enabled ? 'Light' : 'Dark';
    }

    /* Restore saved preference on page load */
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
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
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
    });

    /* -------------------------------------------------------
       Back to Top click
    ------------------------------------------------------- */
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

}());
