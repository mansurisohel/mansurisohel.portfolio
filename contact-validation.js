/* ============================================================
   contact-validation.js  |  Enhanced Contact Form Validation
   Real-time validation | Animated feedback | Submit handling
   ============================================================ */

(function () {
    'use strict';

    var form       = document.getElementById('contactForm');
    var successMsg = document.getElementById('successMsg');
    var submitBtn  = form && form.querySelector('button[type="submit"]');

    if (!form) return;

    /* -------------------------------------------------------
       Helpers
    ------------------------------------------------------- */
    function getError(input) {
        return input.parentElement.querySelector('.field-error');
    }

    function showError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        var existing = getError(input);
        if (existing) {
            existing.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + message;
        } else {
            var err = document.createElement('span');
            err.className = 'field-error';
            err.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + message;
            /* Slide in */
            err.style.opacity   = '0';
            err.style.transform = 'translateY(-6px)';
            err.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            input.parentElement.appendChild(err);
            requestAnimationFrame(function () {
                err.style.opacity   = '1';
                err.style.transform = 'translateY(0)';
            });
        }
    }

    function showSuccess(input) {
        input.classList.remove('error');
        input.classList.add('success');
        var existing = getError(input);
        if (existing) {
            existing.style.opacity = '0';
            setTimeout(function () { if (existing.parentElement) existing.remove(); }, 250);
        }
    }

    /* -------------------------------------------------------
       Validation Rules
    ------------------------------------------------------- */
    var rules = {
        firstName: function (v) {
            if (!v)          return 'First name is required.';
            if (v.length < 2) return 'Must be at least 2 characters.';
            if (!/^[A-Za-z\s\-']+$/.test(v)) return 'Letters only please.';
            return null;
        },
        lastName: function (v) {
            if (!v)          return 'Last name is required.';
            if (v.length < 2) return 'Must be at least 2 characters.';
            return null;
        },
        email: function (v) {
            if (!v) return 'Email address is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
            return null;
        },
        phone: function (v) {
            if (!v) return null; /* optional */
            if (!/^[0-9+\-\s()]{7,15}$/.test(v)) return 'Enter a valid phone number.';
            return null;
        },
        subject: function (v) {
            if (!v)          return 'Subject is required.';
            if (v.length < 3) return 'Subject is too short (min 3 chars).';
            return null;
        },
        message: function (v) {
            if (!v)           return 'Message is required.';
            if (v.length < 10) return 'Message must be at least 10 characters.';
            if (v.length > 2000) return 'Message is too long (max 2000 chars).';
            return null;
        }
    };

    function validateField(input) {
        var name  = input.name;
        var value = input.value.trim();
        var rule  = rules[name];
        if (!rule) { showSuccess(input); return true; }
        var error = rule(value);
        if (error) { showError(input, error); return false; }
        showSuccess(input);
        return true;
    }

    /* -------------------------------------------------------
       Character Counter for Message
    ------------------------------------------------------- */
    var messageField = form.querySelector('#message');
    if (messageField) {
        var counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'font-size:0.78rem;color:var(--gray-mid);text-align:right;margin-top:4px;transition:color 0.2s ease;';
        messageField.parentElement.appendChild(counter);

        messageField.addEventListener('input', function () {
            var len = this.value.length;
            counter.textContent = len + ' / 2000';
            counter.style.color = len > 1800 ? '#ef4444' : len > 1500 ? '#f59e0b' : 'var(--gray-mid)';
        });
    }

    /* -------------------------------------------------------
       Real-time Validation Events
    ------------------------------------------------------- */
    form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('blur', function () {
            validateField(this);
        });
        field.addEventListener('input', function () {
            if (this.classList.contains('error')) validateField(this);
        });
    });

    /* -------------------------------------------------------
       Submit Handler with loading state
    ------------------------------------------------------- */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var isValid = true;
        form.querySelectorAll('input, textarea').forEach(function (field) {
            if (!validateField(field)) isValid = false;
        });

        if (!isValid) {
            /* Shake the submit button */
            if (submitBtn) {
                submitBtn.classList.add('btn-shake');
                setTimeout(function () { submitBtn.classList.remove('btn-shake'); }, 500);
            }
            /* Scroll to first error */
            var firstError = form.querySelector('.error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        /* Simulate sending — show loading state */
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        }

        setTimeout(function () {
            /* Show success */
            if (successMsg) {
                successMsg.classList.add('show');
            }

            /* Reset form */
            form.reset();
            form.querySelectorAll('input, textarea').forEach(function (f) {
                f.classList.remove('success', 'error');
            });
            if (messageField) counter.textContent = '0 / 2000';

            /* Restore button */
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }

            /* Hide success after 5s */
            setTimeout(function () {
                if (successMsg) successMsg.classList.remove('show');
            }, 5000);
        }, 1200);
    });

}());
