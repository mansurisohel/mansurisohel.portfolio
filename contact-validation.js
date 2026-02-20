/* ============================================================
   contact-validation.js  |  Contact form validation
   ============================================================ */

(function () {
    'use strict';

    var form       = document.getElementById('contactForm');
    var successMsg = document.getElementById('successMsg');

    if (!form) return;

    function showError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        var existing = input.parentElement.querySelector('.field-error');
        if (existing) existing.remove();
        var err = document.createElement('span');
        err.className = 'field-error';
        err.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + message;
        input.parentElement.appendChild(err);
    }

    function showSuccess(input) {
        input.classList.remove('error');
        input.classList.add('success');
        var existing = input.parentElement.querySelector('.field-error');
        if (existing) existing.remove();
    }

    function validateField(input) {
        var value = input.value.trim();
        var name  = input.name;

        if (name === 'firstName' || name === 'lastName') {
            if (!value)           { showError(input, 'This field is required.');        return false; }
            if (value.length < 2) { showError(input, 'Must be at least 2 characters.'); return false; }
        }

        if (name === 'email') {
            if (!value) { showError(input, 'Email is required.'); return false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showError(input, 'Enter a valid email address.'); return false;
            }
        }

        if (name === 'phone' && value) {
            if (!/^[0-9+\-\s()]{7,15}$/.test(value)) {
                showError(input, 'Enter a valid phone number.'); return false;
            }
        }

        if (name === 'subject') {
            if (!value)           { showError(input, 'Subject is required.');  return false; }
            if (value.length < 3) { showError(input, 'Subject is too short.'); return false; }
        }

        if (name === 'message') {
            if (!value)            { showError(input, 'Message is required.');                     return false; }
            if (value.length < 10) { showError(input, 'Message must be at least 10 characters.'); return false; }
        }

        showSuccess(input);
        return true;
    }

    /* Real-time: validate on blur, re-validate while typing if field already has error */
    form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('blur', function () { validateField(this); });
        field.addEventListener('input', function () {
            if (this.classList.contains('error')) validateField(this);
        });
    });

    /* On form submit */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var isValid = true;

        form.querySelectorAll('input, textarea').forEach(function (field) {
            if (!validateField(field)) isValid = false;
        });

        if (isValid) {
            successMsg.classList.add('show');
            form.reset();
            form.querySelectorAll('input, textarea').forEach(function (f) {
                f.classList.remove('success', 'error');
            });
            setTimeout(function () { successMsg.classList.remove('show'); }, 5000);
        }
    });

}());
