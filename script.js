// script.js
(function () {
  // Fade-in on load (respect reduced motion)
  document.addEventListener('DOMContentLoaded', function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.style.opacity = 1;
    } else {
      setTimeout(() => document.body.classList.add('loaded'), 40);
    }
  });

  // Modal logic and form handling
  const modal = document.getElementById('modal');
  const requestBtn = document.getElementById('requestAccessBtn');
  const closeBtn = document.getElementById('modalClose');
  const form = document.getElementById('accessForm');
  const sending = document.getElementById('formSending');
  const confirmation = document.getElementById('formConfirmation');
  const firstInput = document.getElementById('name');
  const codeLink = document.querySelector('.code-link');
  const theCodeSection = document.getElementById('the-code');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  let lastFocused = null;

  // Open modal
  requestBtn.addEventListener('click', () => {
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    setTimeout(() => firstInput.focus(), 120);
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    confirmation.hidden = true;
    sending.hidden = true;
    form.reset();
    form.style.display = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  closeBtn.addEventListener('click', closeModal);

  // Close modal on Escape
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Trap focus in modal
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('input, textarea, button:not([disabled]), [tabindex="0"]');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Close modal on click outside content
  modalBackdrop.addEventListener('mousedown', function (e) {
    closeModal();
  });

  // Form validation and confirmation
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    ['name', 'email', 'why'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.setAttribute('aria-invalid', 'true');
        el.style.borderColor = '#bfa76a';
        valid = false;
      } else {
        el.removeAttribute('aria-invalid');
        el.style.borderColor = '';
      }
    });
    if (!valid) {
      firstInput.focus();
      return;
    }
    form.style.display = 'none';
    sending.hidden = false;
    setTimeout(() => {
      sending.hidden = true;
      confirmation.hidden = false;
      confirmation.focus();
      // Compose mailto
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const why = document.getElementById('why').value.trim();
      const subject = encodeURIComponent('RoadHouse — Access Request');
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nWhy: ${why}`
      );
      const mailto = `mailto:daltonellscheid@gmail.com?subject=${subject}&body=${body}`;
      setTimeout(() => {
        window.location.href = mailto;
      }, 900);
    }, 500);
  });

  // "Read the Code" smooth scroll and focus
  codeLink.addEventListener('click', function (e) {
    e.preventDefault();
    if ('scrollBehavior' in document.documentElement.style &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      theCodeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => theCodeSection.focus(), 500);
    } else {
      theCodeSection.scrollIntoView();
      theCodeSection.focus();
    }
  });
})();