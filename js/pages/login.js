/**
 * Login Page Handler
 */

(function() {
    class LoginForm {
        constructor() {
            this.form = document.getElementById('loginForm');
            this.emailInput = document.getElementById('email');
            this.passwordInput = document.getElementById('password');
            this.rememberCheckbox = document.getElementById('remember');
            this.submitBtn = document.getElementById('submitBtn');
            this.isSubmitting = false;

            if (this.form) {
                this.init();
            }
        }

        init() {
            this.setupEventListeners();
            this.loadSavedEmail();
        }

        setupEventListeners() {
            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Real-time validation
            this.emailInput.addEventListener('blur', () => this.validateEmail());
            this.passwordInput.addEventListener('blur', () => this.validatePassword());

            // Clear errors on input
            this.emailInput.addEventListener('input', () => this.clearError('email'));
            this.passwordInput.addEventListener('input', () => this.clearError('password'));
        }

        loadSavedEmail() {
            const saved = localStorage.getItem('remembered_email');
            if (saved) {
                this.emailInput.value = saved;
                this.rememberCheckbox.checked = true;
            }
        }

        validateEmail() {
            const email = this.emailInput.value.trim();
            const errorEl = document.getElementById('emailError');

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
            const errorEl = document.getElementById('passwordError');

            if (!password) {
                this.showError('passwordError', 'Password is required');
                return false;
            }

            if (password.length < 6) {
                this.showError('passwordError', 'Password must be at least 6 characters');
                return false;
            }

            this.clearError('password');
            return true;
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
            const emailValid = this.validateEmail();
            const passwordValid = this.validatePassword();

            if (!emailValid || !passwordValid) {
                return;
            }

            this.isSubmitting = true;
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('btn-loading');
            this.submitBtn.textContent = 'Signing In...';

            try {
                // Simulate API call
                await this.simulateLogin();

                // Save email if remember me is checked
                if (this.rememberCheckbox.checked) {
                    localStorage.setItem('remembered_email', this.emailInput.value);
                } else {
                    localStorage.removeItem('remembered_email');
                }

                // Show success and redirect
                Toast.success('Login successful!', 'Welcome back');
                
                // Save user session
                localStorage.setItem('user_session', JSON.stringify({
                    email: this.emailInput.value,
                    loginTime: new Date().toISOString()
                }));

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } catch (error) {
                Toast.error(error.message || 'Login failed. Please try again.', 'Error');
                this.submitBtn.disabled = false;
                this.submitBtn.classList.remove('btn-loading');
                this.submitBtn.textContent = 'Sign In';
                this.isSubmitting = false;
            }
        }

        simulateLogin() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const email = this.emailInput.value;
                    // Demo: accept any valid email/password combo
                    if (email && this.passwordInput.value) {
                        resolve();
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }, 1500);
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new LoginForm();
        });
    } else {
        new LoginForm();
    }
})();

