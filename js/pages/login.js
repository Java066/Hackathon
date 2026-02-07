// Login Page Handler with Backend API Integration

// ============================================
// API Configuration
// ============================================
const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    endpoints: {
        login: '/auth/login',
        refreshToken: '/auth/refresh',
        forgotPassword: '/auth/forgot-password'
    },
    timeout: 10000
};

// ============================================
// Login Form Class
// ============================================
class LoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('remember');
        this.submitButton = this.form?.querySelector('.auth-button');
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.loadSavedEmail();
    }

    setupEventListeners() {
        // Real-time validation on input
        this.emailInput?.addEventListener('input', () => this.validateEmail());
        this.passwordInput?.addEventListener('input', () => this.validatePassword());
        
        // Clear errors on focus
        this.emailInput?.addEventListener('focus', () => this.clearError('email'));
        this.passwordInput?.addEventListener('focus', () => this.clearError('password'));
        
        // Form submission
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Forgot password link
        const forgotLink = document.querySelector('.forgot-password');
        forgotLink?.addEventListener('click', (e) => this.handleForgotPassword(e));
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('email', 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }
        
        this.clearError('email');
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'Password must be at least 6 characters');
            return false;
        }
        
        this.clearError('password');
        return true;
    }

    showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (input && errorElement) {
            input.parentElement.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(fieldId) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (input && errorElement) {
            input.parentElement.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validate both fields
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        
        if (!emailValid || !passwordValid) {
            return;
        }
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberCheckbox?.checked || false;
        
        // Save email if "Remember me" is checked
        if (rememberMe) {
            localStorage.setItem('savedEmail', email);
        } else {
            localStorage.removeItem('savedEmail');
        }
        
        // Attempt login
        await this.submitLogin(email, password);
    }

    async submitLogin(email, password) {
        this.isSubmitting = true;
        this.setButtonLoading(true);
        
        try {
            const response = await this.makeAPIRequest(
                'POST',
                API_CONFIG.endpoints.login,
                { email, password }
            );
            
            if (response.success) {
                this.handleLoginSuccess(response);
            } else {
                this.handleLoginError(response.message || 'Login failed');
            }
        } catch (error) {
            this.handleLoginError(error.message || 'Network error. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.setButtonLoading(false);
        }
    }

    async makeAPIRequest(method, endpoint, data = null) {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: API_CONFIG.timeout
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        console.log(`Calling API: ${method} ${url}`);
        console.log('Payload:', data);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    handleLoginSuccess(response) {
        // Store auth token
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }
        
        // Store user info
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        console.log('Login successful');
        alert('Login successful! Redirecting to dashboard...');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
    }

    handleLoginError(message) {
        console.error('Login error:', message);
        
        // Show general error or specific field errors
        if (message.includes('email')) {
            this.showError('email', message);
        } else if (message.includes('password')) {
            this.showError('password', message);
        } else {
            alert(`Login failed: ${message}`);
        }
    }

    setButtonLoading(isLoading) {
        if (isLoading) {
            this.submitButton?.classList.add('loading');
            this.submitButton?.setAttribute('disabled', 'disabled');
        } else {
            this.submitButton?.classList.remove('loading');
            this.submitButton?.removeAttribute('disabled');
        }
    }

    loadSavedEmail() {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail && this.emailInput) {
            this.emailInput.value = savedEmail;
            this.rememberCheckbox.checked = true;
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const email = this.emailInput.value.trim();
        
        if (!email || !this.validateEmail()) {
            alert('Please enter your email address first');
            return;
        }
        
        // Redirect to forgot password page or show modal
        console.log('Forgot password requested for:', email);
        window.location.href = `/forgot-password?email=${encodeURIComponent(email)}`;
    }
}

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page initialized');
    new LoginForm();
    
    // Log API configuration for debugging
    console.log('API Base URL:', API_CONFIG.baseURL);
    console.log('Login endpoint:', API_CONFIG.baseURL + API_CONFIG.endpoints.login);
});
