/**
 * Settings Page Handler
 */

(function() {
    const Settings = {
        userData: {
            name: 'Ahmed Khan',
            email: 'ahmed@example.com',
            phone: '+971 50 123 4567'
        },

        preferences: {
            notifications: true,
            emailAlerts: true,
            darkMode: false,
            twoFactor: false
        },

        init() {
            this.loadUserData();
            this.render();
        },

        loadUserData() {
            const stored = localStorage.getItem('user');
            if (stored) {
                this.userData = JSON.parse(stored);
            }
        },

        render() {
            const mainLayout = document.getElementById('mainLayout');
            const mainContent = document.getElementById('mainContent');

            mainLayout.innerHTML = Components.createHeader('Ahmed Khan') + 
                                   Components.createSidebar('settings');

            mainContent.innerHTML = `
                <h1>⚙️ Settings</h1>

                <div class="settings-container">
                    <!-- Profile Section -->
                    <div class="settings-section">
                        <div class="profile-section">
                            <div class="avatar">👤</div>
                            <div class="profile-info">
                                <h3>${this.userData.name}</h3>
                                <p>${this.userData.email}</p>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="nameInput" value="${this.userData.name}">
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="emailInput" value="${this.userData.email}">
                        </div>

                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" id="phoneInput" value="${this.userData.phone}">
                        </div>

                        <div class="button-group">
                            <button class="btn btn-primary" id="updateProfileBtn">Update Profile</button>
                        </div>
                    </div>

                    <!-- Security Section -->
                    <div class="settings-section">
                        <h2>🔒 Security</h2>

                        <div class="form-group">
                            <label>Current Password</label>
                            <input type="password" id="currentPassword" placeholder="Enter current password">
                        </div>

                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" id="newPassword" placeholder="Enter new password">
                        </div>

                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" id="confirmPassword" placeholder="Confirm new password">
                        </div>

                        <div class="button-group">
                            <button class="btn btn-primary" id="changePasswordBtn">Change Password</button>
                        </div>
                    </div>

                    <!-- Preferences Section -->
                    <div class="settings-section">
                        <h2>🔔 Preferences</h2>

                        <div class="settings-group">
                            <div class="settings-label">
                                <span class="label-title">Push Notifications</span>
                                <span class="label-desc">Receive alerts about transactions</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="notificationsToggle" ${this.preferences.notifications ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="settings-group">
                            <div class="settings-label">
                                <span class="label-title">Email Alerts</span>
                                <span class="label-desc">Send budget alerts via email</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="emailToggle" ${this.preferences.emailAlerts ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="settings-group">
                            <div class="settings-label">
                                <span class="label-title">Two-Factor Authentication</span>
                                <span class="label-desc">Add extra security to your account</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="twoFactorToggle" ${this.preferences.twoFactor ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Danger Zone -->
                    <div class="settings-section danger-zone">
                        <h2>⚠️ Danger Zone</h2>
                        <p style="color: var(--gray-600); margin-bottom: var(--spacing-lg);">
                            Be careful with these actions. They cannot be undone.
                        </p>
                        <div class="button-group">
                            <button class="btn btn-outline btn-danger" id="logoutBtn">Logout</button>
                            <button class="btn btn-danger" id="deleteAccountBtn">Delete Account</button>
                        </div>
                    </div>
                </div>
            `;

            Components.initializeLayout('settings');
            this.setupEventListeners();
        },

        setupEventListeners() {
            document.getElementById('updateProfileBtn').addEventListener('click', () => this.updateProfile());
            document.getElementById('changePasswordBtn').addEventListener('click', () => this.changePassword());
            document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
            document.getElementById('deleteAccountBtn').addEventListener('click', () => this.deleteAccount());

            // Toggle switches
            document.getElementById('notificationsToggle').addEventListener('change', (e) => {
                this.preferences.notifications = e.target.checked;
                this.savePreferences();
            });

            document.getElementById('emailToggle').addEventListener('change', (e) => {
                this.preferences.emailAlerts = e.target.checked;
                this.savePreferences();
            });

            document.getElementById('twoFactorToggle').addEventListener('change', (e) => {
                this.preferences.twoFactor = e.target.checked;
                this.savePreferences();
            });
        },

        updateProfile() {
            const name = document.getElementById('nameInput').value.trim();
            const email = document.getElementById('emailInput').value.trim();
            const phone = document.getElementById('phoneInput').value.trim();

            if (!name || !email) {
                Toast.error('Name and email are required');
                return;
            }

            if (!Validators.email(email)) {
                Toast.error('Invalid email address');
                return;
            }

            this.userData = { name, email, phone };
            localStorage.setItem('user', JSON.stringify(this.userData));
            Toast.success('Profile updated successfully!');
        },

        changePassword() {
            const current = document.getElementById('currentPassword').value;
            const newPwd = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;

            if (!current || !newPwd || !confirm) {
                Toast.error('All password fields are required');
                return;
            }

            if (!Validators.password(newPwd)) {
                Toast.error('Password must be at least 8 characters with uppercase, lowercase, and number');
                return;
            }

            if (newPwd !== confirm) {
                Toast.error('Passwords do not match');
                return;
            }

            // Simulate password change
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            
            Toast.success('Password changed successfully!');
        },

        savePreferences() {
            localStorage.setItem('preferences', JSON.stringify(this.preferences));
            Toast.success('Preferences saved!');
        },

        logout() {
            Modal.confirm({
                title: 'Logout',
                message: 'Are you sure you want to logout?',
                okText: 'Yes, Logout',
                onOk: () => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                }
            });
        },

        deleteAccount() {
            Modal.confirm({
                title: 'Delete Account',
                message: 'This action cannot be undone. All your data will be permanently deleted.',
                okText: 'Delete Account',
                cancelText: 'Cancel',
                isDanger: true,
                onOk: () => {
                    localStorage.clear();
                    Toast.success('Account deleted. Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Settings.init());
    } else {
        Settings.init();
    }

    window.Settings = Settings;
})();
