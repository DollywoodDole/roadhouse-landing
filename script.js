// Modal logic and form handling
const modal = document.getElementById('modal');
const requestBtn = document.getElementById('requestAccessBtn');
const closeBtn = document.getElementById('modalClose');
const form = document.getElementById('accessForm');
const confirmation = document.getElementById('formConfirmation');
const firstInput = document.getElementById('name');
const codeLink = document.querySelector('.code-link');
const theCodeSection = document.getElementById('the-code');

// Open modal
requestBtn.addEventListener('click', () => {
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
  form.reset();
  form.style.display = '';
  document.body.style.overflow = '';
  requestBtn.focus();
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

// Form validation and confirmation
form.addEventListener('submit', function(e) {
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
  confirmation.hidden = false;
  confirmation.focus();
});

// Close modal on click outside content
modal.addEventListener('mousedown', function(e) {
  if (e.target === modal) closeModal();
});

// "Read the Code" smooth scroll and focus
codeLink.addEventListener('click', function(e) {
  e.preventDefault();
  theCodeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => theCodeSection.focus(), 500);
});
