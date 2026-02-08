/**
 * Modal Component
 */

(function() {
    const Modal = {
        /**
         * Create and show a modal
         * @param {object} options - { title, content, buttons, onClose }
         */
        create(options = {}) {
            const {
                title = 'Modal',
                content = '',
                buttons = [{ text: 'Close', type: 'primary', action: 'close' }],
                onClose = null,
                size = 'medium' // small, medium, large
            } = options;

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay active';

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal';

            // Create header
            const header = document.createElement('div');
            header.className = 'modal-header';
            header.innerHTML = `
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" aria-label="Close modal">✕</button>
            `;

            // Create body
            const body = document.createElement('div');
            body.className = 'modal-body';
            body.innerHTML = content;

            // Create footer with buttons
            const footer = document.createElement('div');
            footer.className = 'modal-footer';
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = btn.text;
                button.className = `btn btn-${btn.type || 'primary'}`;

                if (btn.action === 'close') {
                    button.addEventListener('click', () => this.close(overlay, onClose));
                } else if (typeof btn.action === 'function') {
                    button.addEventListener('click', () => btn.action(overlay, onClose));
                }

                footer.appendChild(button);
            });

            // Assemble modal
            modal.appendChild(header);
            modal.appendChild(body);
            modal.appendChild(footer);
            overlay.appendChild(modal);

            // Add to DOM
            document.body.appendChild(overlay);

            // Close button handler
            const closeBtn = header.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => this.close(overlay, onClose));

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(overlay, onClose);
                }
            });

            // ESC key to close
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', handleEsc);
                    this.close(overlay, onClose);
                }
            };
            document.addEventListener('keydown', handleEsc);

            return { overlay, modal };
        },

        close(overlay, callback) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                if (callback) callback();
            }, 300);
        },

        /**
         * Show a confirm dialog
         */
        confirm(options = {}) {
            return new Promise((resolve) => {
                const {
                    title = 'Confirm',
                    message = 'Are you sure?'
                } = options;

                this.create({
                    title,
                    content: `<p>${message}</p>`,
                    buttons: [
                        {
                            text: 'Cancel',
                            type: 'ghost',
                            action: (overlay, cb) => {
                                this.close(overlay, () => {
                                    resolve(false);
                                    if (cb) cb();
                                });
                            }
                        },
                        {
                            text: 'Confirm',
                            type: 'danger',
                            action: (overlay, cb) => {
                                this.close(overlay, () => {
                                    resolve(true);
                                    if (cb) cb();
                                });
                            }
                        }
                    ]
                });
            });
        },

        /**
         * Show an alert dialog
         */
        alert(options = {}) {
            const {
                title = 'Alert',
                message = ''
            } = options;

            return this.create({
                title,
                content: `<p>${message}</p>`,
                buttons: [{
                    text: 'OK',
                    type: 'primary',
                    action: 'close'
                }]
            });
        }
    };

    window.Modal = Modal;
})();
