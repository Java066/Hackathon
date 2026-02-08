// Landing Page Interactions

// ============================================
// Smooth Scrolling for Navigation Links
// ============================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// CTA Button Click Handlers
// ============================================
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only prevent default for button elements, not links
            if (this.tagName === 'BUTTON') {
                e.preventDefault();
                addRippleEffect(this, e);
                
                const buttonText = this.innerText;
                console.log(`Button clicked: ${buttonText}`);
                handleCTAAction(buttonText);
            }
        });
    });
}

// Ripple effect on button click
function addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Remove previous ripple if exists
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();
    
    button.appendChild(ripple);
    
    console.log('Ripple effect added');
}

// Handle CTA actions
function handleCTAAction(buttonText) {
    if (buttonText.includes('Get Started')) {
        // Navigate to signup or open signup modal
        console.log('Navigating to signup...');
        // window.location.href = '/signup';
    } else if (buttonText.includes('Start Free Trial')) {
        // Trigger trial signup
        console.log('Starting free trial...');
        // window.location.href = '/trial-signup';
    }
}

// ============================================
// Intersection Observer for Scroll Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class to visible elements
                entry.target.classList.add('animated');
                
                // Optional: stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });
    
    // Observe step cards
    const stepCards = document.querySelectorAll('.step');
    stepCards.forEach(step => {
        observer.observe(step);
    });
    
    // Observe feature section heading
    const featureHeadings = document.querySelectorAll('.features h2, .how-it-works h2');
    featureHeadings.forEach(heading => {
        observer.observe(heading);
    });
}

// ============================================
// Navbar Interactions
// ============================================
function initNavbar() {
    const header = document.querySelector('header');
    
    // Add shadow on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ============================================
// Hero Section Interactions
// ============================================
function initHeroAnimations() {
    const heroSection = document.querySelector('.hero');
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (heroSection) {
            heroSection.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
        }
    });
}

// ============================================
// Keyboard Navigation
// ============================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Escape key to close any open modals/popups (future feature)
        if (event.key === 'Escape') {
            console.log('Escape key pressed');
        }
        
        // Tab key for accessibility (handled by browser by default)
    });
}

// ============================================
// Initialize All Functions
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page initialized');
    
    initSmoothScroll();
    initCTAButtons();
    initScrollAnimations();
    initNavbar();
    initHeroAnimations();
    initKeyboardNavigation();
});

// ============================================
// Utility Functions
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    console.log(`Event tracked: ${eventName}`, eventData);
    // Replace with actual analytics service (Google Analytics, Mixpanel, etc.)
}
