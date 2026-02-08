// Authentication Form Handling

// ============================================
// Form Validation
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters with uppercase, lowercase, and numbers
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    
    if (input && errorElement) {
        input.parentElement.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    
    if (input && errorElement) {
        input.parentElement.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// ============================================
// Login Form Handler
// ============================================

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) return;
    
    // Clear errors on input
    const inputs = loginForm.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            clearError(this.id);
        });
    });
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validation
        let isValid = true;
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Simulate login
        handleLogin(email, password);
    });
}

function handleLogin(email, password) {
    const button = document.querySelector('.auth-button');
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Login successful for:', email);
        // Redirect to dashboard
        // window.location.href = '/dashboard';
        alert('Login successful! (Demo)');
        button.classList.remove('loading');
        button.disabled = false;
    }, 1500);
}

// ============================================
// Signup Form Handler
// ============================================

function initSignupForm() {
    const signupForm = document.getElementById('signupForm');
    
    if (!signupForm) return;
    
    // Clear errors on input
    const inputs = signupForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.id !== 'terms') {
                clearError(this.id);
            }
        });
    });
    
    // Real-time password validation
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const hint = document.querySelector('.password-hint');
            if (!validatePassword(this.value)) {
                hint.style.color = '#e74c3c';
            } else {
                hint.style.color = '#27ae60';
            }
        });
    }
    
    // Handle form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsCheckbox = document.getElementById('terms');
        
        // Validation
        let isValid = true;
        
        if (!fullname) {
            showError('fullname', 'Full name is required');
            isValid = false;
        } else if (fullname.length < 2) {
            showError('fullname', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError('password', 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!termsCheckbox.checked) {
            const termsError = document.getElementById('termsError');
            termsError.textContent = 'You must agree to the terms';
            termsError.classList.add('show');
            isValid = false;
        } else {
            const termsError = document.getElementById('termsError');
            termsError.classList.remove('show');
        }
        
        if (!isValid) return;
        
        // Simulate signup
        handleSignup(fullname, email, password);
    });
}

function handleSignup(fullname, email, password) {
    const button = document.querySelector('.auth-button');
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Signup successful for:', email);
        // Show success message and redirect
        alert('Account created successfully! (Demo)\nRedirecting to login...');
        // window.location.href = '/login';
        button.classList.remove('loading');
        button.disabled = false;
    }, 1500);
}

// ============================================
// Initialize on Page Load
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth forms initialized');
    initLoginForm();
    initSignupForm();
});
