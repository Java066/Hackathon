/**
 * Form Validation Utilities
 */

(function() {
    const Validators = {
        /**
         * Validate email format
         */
        email(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        /**
         * Validate password strength
         * Requirements: min 8 chars, at least one uppercase, one lowercase, one number
         */
        password(password) {
            const minLength = password.length >= 8;
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            
            return minLength && hasUppercase && hasLowercase && hasNumber;
        },

        /**
         * Get password strength level
         */
        getPasswordStrength(password) {
            if (!password) return null;
            
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            
            if (strength < 3) return 'weak';
            if (strength < 5) return 'fair';
            return 'strong';
        },

        /**
         * Validate that two passwords match
         */
        passwordMatch(password, confirmPassword) {
            return password === confirmPassword && password.length > 0;
        },

        /**
         * Validate required field
         */
        required(value) {
            return value && value.trim().length > 0;
        },

        /**
         * Validate full name (at least 2 words)
         */
        fullName(name) {
            const parts = name.trim().split(/\s+/);
            return parts.length >= 2 && parts.every(part => part.length >= 2);
        },

        /**
         * Validate amount (positive number)
         */
        amount(value) {
            const num = parseFloat(value);
            return !isNaN(num) && num > 0;
        },

        /**
         * Validate date
         */
        date(dateString) {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        },

        /**
         * Get error message for validation
         */
        getErrorMessage(field, rule) {
            const messages = {
                email: 'Please enter a valid email address',
                password: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
                passwordMatch: 'Passwords do not match',
                required: 'This field is required',
                fullName: 'Please enter your full name (first and last name)',
                amount: 'Please enter a valid amount',
                date: 'Please enter a valid date',
                terms: 'You must agree to the terms and conditions',
            };

            return messages[rule] || 'This field is invalid';
        }
    };

    window.Validators = Validators;
})();

