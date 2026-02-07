/**
 * Toast Notification Component
 */

(function() {
    const Toast = {
        container: null,

        init() {
            // Create container if it doesn't exist
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        },

        /**
         * Show a toast notification
         * @param {object} options - { title, message, type, duration }
         */
        show(options = {}) {
            this.init();

            const {
                title = 'Notification',
                message = '',
                type = 'info', // info, success, error, warning
                duration = 3000
            } = options;

            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <div class="toast-icon">${icons[type]}</div>
                <div class="toast-content">
                    ${title ? `<div class="toast-title">${title}</div>` : ''}
                    ${message ? `<p class="toast-message">${message}</p>` : ''}
                </div>
                <button class="toast-close" aria-label="Close">✕</button>
                <div class="toast-progress"></div>
            `;

            this.container.appendChild(toast);

            // Close button handler
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => {
                this.remove(toast);
            });

            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    if (toast.parentElement) {
                        this.remove(toast);
                    }
                }, duration);
            }

            return toast;
        },

        remove(toast) {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                toast.remove();
            }, 300);
        },

        success(message, title = 'Success') {
            return this.show({ title, message, type: 'success', duration: 3000 });
        },

        error(message, title = 'Error') {
            return this.show({ title, message, type: 'error', duration: 4000 });
        },

        warning(message, title = 'Warning') {
            return this.show({ title, message, type: 'warning', duration: 3000 });
        },

        info(message, title = 'Info') {
            return this.show({ title, message, type: 'info', duration: 3000 });
        },

        clear() {
            if (this.container) {
                this.container.innerHTML = '';
            }
        }
    };

    window.Toast = Toast;
})();
