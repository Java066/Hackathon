/**
 * Signup Page Handler
 */

(function() {
    class SignupForm {
        constructor() {
            this.form = document.getElementById('signupForm');
            this.fullnameInput = document.getElementById('fullname');
            this.emailInput = document.getElementById('email');
            this.passwordInput = document.getElementById('password');
            this.confirmPasswordInput = document.getElementById('confirmPassword');
            this.termsCheckbox = document.getElementById('terms');
            this.submitBtn = document.getElementById('submitBtn');
            this.strengthIndicator = document.getElementById('strengthIndicator');
            this.strengthText = document.getElementById('strengthText');
            this.isSubmitting = false;

            if (this.form) {
                this.init();
            }
        }

        init() {
            this.setupEventListeners();
        }

        setupEventListeners() {
            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Real-time validation
            this.fullnameInput.addEventListener('blur', () => this.validateFullname());
            this.emailInput.addEventListener('blur', () => this.validateEmail());
            this.passwordInput.addEventListener('input', () => this.updatePasswordStrength());
            this.passwordInput.addEventListener('blur', () => this.validatePassword());
            this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());

            // Clear errors on input
            this.fullnameInput.addEventListener('input', () => this.clearError('fullname'));
            this.emailInput.addEventListener('input', () => this.clearError('email'));
            this.passwordInput.addEventListener('input', () => this.clearError('password'));
            this.confirmPasswordInput.addEventListener('input', () => this.clearError('confirmPassword'));
        }

        validateFullname() {
            const fullname = this.fullnameInput.value.trim();
            
            if (!fullname) {
                this.showError('fullnameError', 'Full name is required');
                return false;
            }

            if (!Validators.fullName(fullname)) {
                this.showError('fullnameError', 'Please enter your first and last name');
                return false;
            }

            this.clearError('fullname');
            return true;
        }

        validateEmail() {
            const email = this.emailInput.value.trim();

            if (!email) {
                this.showError('emailError', 'Email is required');
                return false;
            }

            if (!Validators.email(email)) {
                this.showError('emailError', 'Please enter a valid email address');
                return false;
            }

            this.clearError('email');
            return true;
        }

        validatePassword() {
            const password = this.passwordInput.value;

            if (!password) {
                this.showError('passwordError', 'Password is required');
                return false;
            }

            if (password.length < 8) {
                this.showError('passwordError', 'Password must be at least 8 characters');
                return false;
            }

            if (!Validators.password(password)) {
                this.showError('passwordError', 'Password must contain uppercase, lowercase, and numbers');
                return false;
            }

            this.clearError('password');
            return true;
        }

        validateConfirmPassword() {
            const password = this.passwordInput.value;
            const confirmPassword = this.confirmPasswordInput.value;

            if (!confirmPassword) {
                this.showError('confirmPasswordError', 'Please confirm your password');
                return false;
            }

            if (!Validators.passwordMatch(password, confirmPassword)) {
                this.showError('confirmPasswordError', 'Passwords do not match');
                return false;
            }

            this.clearError('confirmPassword');
            return true;
        }

        validateTerms() {
            if (!this.termsCheckbox.checked) {
                this.showError('termsError', 'You must agree to the terms and conditions');
                return false;
            }

            this.clearError('terms');
            return true;
        }

        updatePasswordStrength() {
            const password = this.passwordInput.value;
            const strength = Validators.getPasswordStrength(password);

            this.strengthIndicator.className = 'strength-indicator';
            this.strengthIndicator.classList.add(strength || '');

            const strengthMap = {
                weak: 'Weak password',
                fair: 'Fair password',
                strong: 'Strong password'
            };

            this.strengthText.textContent = strengthMap[strength] || 'Create a strong password (min 8 chars)';
        }

        showError(elementId, message) {
            const el = document.getElementById(elementId);
            if (el) {
                el.textContent = message;
                el.style.display = 'block';
            }
        }

        clearError(fieldName) {
            const errorId = fieldName + 'Error';
            const el = document.getElementById(errorId);
            if (el) {
                el.textContent = '';
                el.style.display = 'none';
            }
        }

        async handleSubmit(e) {
            e.preventDefault();

            // Validate all fields
            const fullnameValid = this.validateFullname();
            const emailValid = this.validateEmail();
            const passwordValid = this.validatePassword();
            const confirmPasswordValid = this.validateConfirmPassword();
            const termsValid = this.validateTerms();

            if (!fullnameValid || !emailValid || !passwordValid || !confirmPasswordValid || !termsValid) {
                return;
            }

            this.isSubmitting = true;
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('btn-loading');
            this.submitBtn.textContent = 'Creating Account...';

            try {
                // Simulate API call
                await this.simulateSignup();

                // Show success
                Toast.success('Account created successfully!', 'Welcome');

                // Redirect to login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } catch (error) {
                Toast.error(error.message || 'Signup failed. Please try again.', 'Error');
                this.submitBtn.disabled = false;
                this.submitBtn.classList.remove('btn-loading');
                this.submitBtn.textContent = 'Create Account';
                this.isSubmitting = false;
            }
        }

        simulateSignup() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const fullname = this.fullnameInput.value;
                    const email = this.emailInput.value;
                    const password = this.passwordInput.value;

                    // Save user data to localStorage (demo only)
                    localStorage.setItem('new_user', JSON.stringify({
                        fullname,
                        email,
                        createdAt: new Date().toISOString()
                    }));

                    resolve();
                }, 1500);
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SignupForm();
        });
    } else {
        new SignupForm();
    }
})();
        this.emailInput?.addEventListener('focus', () => this.clearError('email'));
        this.passwordInput?.addEventListener('focus', () => this.clearError('password'));
        this.confirmPasswordInput?.addEventListener('focus', () => this.clearError('confirmPassword'));
        
        // Form submission
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateFullname() {
        const fullname = this.fullnameInput.value.trim();
        
        if (!fullname) {
            this.showError('fullname', 'Full name is required');
            return false;
        }
        
        if (fullname.length < 2) {
            this.showError('fullname', 'Full name must be at least 2 characters');
            return false;
        }
        
        if (fullname.length > 100) {
            this.showError('fullname', 'Full name must be less than 100 characters');
            return false;
        }
        
        if (!/^[a-zA-Z\s'-]+$/.test(fullname)) {
            this.showError('fullname', 'Full name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }
        
        this.clearError('fullname');
        return true;
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
        
        if (email.length > 254) {
            this.showError('email', 'Email is too long');
            return false;
        }
        
        this.clearError('email');
        return true;
    }

    async checkEmailAvailability() {
        const email = this.emailInput.value.trim();
        
        if (!this.validateEmail()) return false;
        
        try {
            const response = await this.makeAPIRequest(
                'POST',
                API_CONFIG.endpoints.checkEmail,
                { email }
            );
            
            if (!response.available) {
                this.showError('email', 'This email is already registered');
                return false;
            }
            
            return true;
        } catch (error) {
            console.warn('Could not check email availability:', error.message);
            // Don't show error for now - API might not be ready
            return true;
        }
    }

    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'Password is required');
            this.updatePasswordHint('', false);
            return false;
        }
        
        // Password strength criteria
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const isLongEnough = password.length >= 8;
        
        if (!isLongEnough) {
            this.showError('password', 'Password must be at least 8 characters');
            this.updatePasswordHint('', false);
            return false;
        }
        
        if (!hasLowercase || !hasUppercase || !hasNumber) {
            this.showError('password', 'Password must include uppercase, lowercase, and numbers');
            this.updatePasswordHint('Almost there! Add more variety', false);
            return false;
        }
        
        this.clearError('password');
        this.updatePasswordHint('Strong password!', true);
        return true;
    }

    updatePasswordHint(message, isStrong) {
        if (this.passwordHint) {
            this.passwordHint.textContent = message;
            this.passwordHint.style.color = isStrong ? '#27ae60' : '#e74c3c';
        }
    }

    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (!confirmPassword) {
            this.showError('confirmPassword', 'Please confirm your password');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            return false;
        }
        
        this.clearError('confirmPassword');
        return true;
    }

    validateTerms() {
        if (!this.termsCheckbox.checked) {
            const termsError = document.getElementById('termsError');
            if (termsError) {
                termsError.textContent = 'You must agree to the terms of service';
                termsError.classList.add('show');
            }
            return false;
        }
        
        const termsError = document.getElementById('termsError');
        if (termsError) {
            termsError.textContent = '';
            termsError.classList.remove('show');
        }
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
        
        // Validate all fields
        const fullnameValid = this.validateFullname();
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        const confirmPasswordValid = this.validateConfirmPassword();
        const termsValid = this.validateTerms();
        
        if (!fullnameValid || !emailValid || !passwordValid || !confirmPasswordValid || !termsValid) {
            return;
        }
        
        const fullname = this.fullnameInput.value.trim();
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        // Attempt signup
        await this.submitSignup(fullname, email, password);
    }

    async submitSignup(fullname, email, password) {
        this.isSubmitting = true;
        this.setButtonLoading(true);
        
        try {
            const response = await this.makeAPIRequest(
                'POST',
                API_CONFIG.endpoints.signup,
                { fullname, email, password }
            );
            
            if (response.success) {
                this.handleSignupSuccess(response);
            } else {
                this.handleSignupError(response.message || 'Signup failed');
            }
        } catch (error) {
            this.handleSignupError(error.message || 'Network error. Please try again.');
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

    handleSignupSuccess(response) {
        console.log('Signup successful');
        
        // Store account info temporarily
        if (response.user) {
            localStorage.setItem('newUser', JSON.stringify(response.user));
        }
        
        // Check if email verification is required
        if (response.requiresEmailVerification) {
            alert('Account created! Please check your email to verify your account.');
            window.location.href = '/verify-email';
        } else {
            alert('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
    }

    handleSignupError(message) {
        console.error('Signup error:', message);
        
        // Map errors to specific fields
        if (message.toLowerCase().includes('email')) {
            this.showError('email', message);
        } else if (message.toLowerCase().includes('password')) {
            this.showError('password', message);
        } else if (message.toLowerCase().includes('name')) {
            this.showError('fullname', message);
        } else {
            alert(`Signup failed: ${message}`);
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
}

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Signup page initialized');
    new SignupForm();
    
    // Log API configuration for debugging
    console.log('API Base URL:', API_CONFIG.baseURL);
    console.log('Signup endpoint:', API_CONFIG.baseURL + API_CONFIG.endpoints.signup);
});
