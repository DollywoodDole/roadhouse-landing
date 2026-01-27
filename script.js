// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll reveal
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Modal functions
function openModal() {
    document.getElementById('accessModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('accessModal').classList.remove('active');
    document.body.style.overflow = '';
    resetForm();
}

// Close modal on outside click
document.getElementById('accessModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('invalid');
    });

    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Validate name
    if (!name.value.trim()) {
        name.closest('.form-group').classList.add('invalid');
        isValid = false;
    }

    // Validate email
    if (!validateEmail(email.value)) {
        email.closest('.form-group').classList.add('invalid');
        isValid = false;
    }

    // Validate message
    if (!message.value.trim() || message.value.trim().length < 10) {
        message.closest('.form-group').classList.add('invalid');
        const errorMsg = message.closest('.form-group').querySelector('.error');
        errorMsg.textContent = 'Please provide a meaningful response (at least 10 characters)';
        isValid = false;
    }

    if (isValid) {
        // Simulate form submission
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        document.getElementById('submitText').textContent = 'Sending...';

        // Simulate API call
        setTimeout(() => {
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('successMessage').classList.add('active');
            
            // Auto-close after 3 seconds
            setTimeout(() => {
                closeModal();
            }, 3000);
        }, 1000);
    }
}

function resetForm() {
    document.getElementById('accessForm').reset();
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('invalid');
    });
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('successMessage').classList.remove('active');
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitText').textContent = 'Send';
}

// Add subtle parallax effect to header
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('header');
    
    if (header) {
        header.style.transform = `translateY(${currentScroll * 0.3}px)`;
        header.style.opacity = 1 - (currentScroll / 500);
    }
    
    lastScroll = currentScroll;
});