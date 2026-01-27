// ==========================================
// INITIALIZATION & TRACKING
// ==========================================

// Track where user came from (UTM parameters)
const urlParams = new URLSearchParams(window.location.search);
const source = urlParams.get('utm_source') || 'direct';
const medium = urlParams.get('utm_medium') || 'none';
const campaign = urlParams.get('utm_campaign') || 'none';

// Store referral data
localStorage.setItem('referral_source', source);
localStorage.setItem('referral_medium', medium);
localStorage.setItem('referral_campaign', campaign);

// ==========================================
// ACTIVITY TICKER
// ==========================================

const activities = [
    'M.K. from Toronto just requested access',
    'R.T. from Vancouver joined 3 hours ago',
    'A.L. from Montreal is reviewing the code',
    'J.S. from Calgary just requested access',
    'E.W. from Edmonton joined 1 day ago',
    'L.P. from Winnipeg is reviewing the code',
    'D.M. from Halifax just requested access',
    'K.R. from Saskatoon joined 2 days ago'
];

function initActivityTicker() {
    const ticker = document.querySelector('.ticker-content');
    const repeatedActivities = [...activities, ...activities, ...activities];
    
    ticker.innerHTML = repeatedActivities.map(activity => 
        `<span style="padding: 0 3rem;">${activity}</span>`
    ).join('');
}

// ==========================================
// LIVE COUNTER ANIMATION
// ==========================================

function animateCounter() {
    const counter = document.getElementById('memberCount');
    const target = 247;
    const duration = 2000;
    const start = 180;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(current);
        }
    }, 16);
}

// Start counter animation when page loads
setTimeout(animateCounter, 1000);

// ==========================================
// SCARCITY COUNTER
// ==========================================

function updateScarcity() {
    const spotsElement = document.getElementById('spotsLeft');
    const currentSpots = parseInt(spotsElement.textContent);
    
    // Randomly decrease spots (simulate activity)
    setInterval(() => {
        if (currentSpots > 3 && Math.random() > 0.7) {
            const newSpots = currentSpots - 1;
            spotsElement.textContent = newSpots;
            
            // Show toast notification
            showToast('Someone just claimed a spot!');
        }
    }, 45000); // Check every 45 seconds
}

// ==========================================
// SOCIAL SHARING
// ==========================================

function shareOnTwitter() {
    const text = 'Just discovered RoadHouse - where restraint is strength and standards are silent but evident.';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    trackShare('twitter');
}

function shareOnLinkedIn() {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    trackShare('linkedin');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!');
        trackShare('copy');
    });
}

function trackShare(platform) {
    // Track social shares (integrate with your analytics)
    console.log(`Shared on ${platform} from ${source}`);
    
    // You can send this to your backend/analytics
    // Example: sendToAnalytics({ event: 'share', platform, source });
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// FAQ ACCORDION
// ==========================================

function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const wasActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked FAQ if it wasn't already active
    if (!wasActive) {
        faqItem.classList.add('active');
    }
}

// ==========================================
// SCROLL REVEAL
// ==========================================

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

// ==========================================
// SMOOTH SCROLL
// ==========================================

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

// ==========================================
// EXIT INTENT DETECTION
// ==========================================

let exitIntentShown = false;
let mouseLeaveTimer;

document.addEventListener('mouseleave', (e) => {
    // Only trigger if mouse leaves from top of page and hasn't been shown
    if (e.clientY < 10 && !exitIntentShown && window.scrollY < 500) {
        exitIntentShown = true;
        
        // Delay slightly to avoid false positives
        mouseLeaveTimer = setTimeout(() => {
            document.getElementById('exitIntentModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 500);
    }
});

// Cancel exit intent if mouse returns quickly
document.addEventListener('mouseenter', () => {
    if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
    }
});

function closeExitModal() {
    document.getElementById('exitIntentModal').classList.remove('active');
    document.body.style.overflow = '';
}

function handleExitSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('exitEmail').value;
    
    // Store email for reminder (send to your backend)
    console.log('Reminder requested:', email);
    
    // Show success message
    showToast('Reminder set! We\'ll be in touch.');
    
    // Close modal
    closeExitModal();
}

// ==========================================
// MAIN ACCESS MODAL
// ==========================================

function openModal() {
    document.getElementById('accessModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Track modal open
    console.log('Modal opened from:', source);
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

document.getElementById('exitIntentModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeExitModal();
    }
});

// Close on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeExitModal();
    }
});

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================

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
    const referral = document.getElementById('referral');
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
        // Prepare submission data with tracking
        const formData = {
            name: name.value,
            email: email.value,
            referral: referral.value || source, // Use dropdown or UTM source
            message: message.value,
            source: source,
            medium: medium,
            campaign: campaign,
            timestamp: new Date().toISOString()
        };
        
        console.log('Form submission:', formData);
        
        // Here you would send to your backend:
        // fetch('YOUR_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        
        // Simulate form submission
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        document.getElementById('submitText').textContent = 'Sending...';

        // Simulate API call
        setTimeout(() => {
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('successMessage').classList.add('active');
            
            // Track conversion
            console.log('Conversion tracked for:', source);
            
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

// ==========================================
// HEADER PARALLAX
// ==========================================

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('header');
    
    if (header && currentScroll < 500) {
        header.style.transform = `translateY(${currentScroll * 0.3}px)`;
        header.style.opacity = 1 - (currentScroll / 500);
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// PAGE VISIBILITY (Track engagement time)
// ==========================================

let startTime = Date.now();
let totalTime = 0;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        totalTime += Date.now() - startTime;
        console.log('Time on page:', Math.round(totalTime / 1000), 'seconds');
    } else {
        startTime = Date.now();
    }
});

// Track total time before user leaves
window.addEventListener('beforeunload', () => {
    totalTime += Date.now() - startTime;
    console.log('Final time on page:', Math.round(totalTime / 1000), 'seconds');
    
    // Send to analytics
    // sendToAnalytics({ event: 'time_on_page', seconds: Math.round(totalTime / 1000), source });
});

// ==========================================
// INITIALIZE ON LOAD
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    initActivityTicker();
    updateScarcity();
    
    // Track page view with source
    console.log('Page view from:', source, medium, campaign);
    
    // Send to analytics
    // sendToAnalytics({ event: 'page_view', source, medium, campaign });
});