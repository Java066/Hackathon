/**
 * Reusable Components
 */

(function() {
    const Components = {
        /**
         * Create Header Component
         */
        createHeader(userName = 'User') {
            return `
                <header class="header">
                    <div class="header-content">
                        <div class="header-left">
                            <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">☰</button>
                            <div class="logo">
                                <span class="logo-icon">💰</span>
                                <span>Where's My Money</span>
                            </div>
                        </div>
                        
                        <div class="header-right">
                            <div class="user-menu" id="userMenu">
                                <div class="user-avatar" id="userAvatar">${userName.charAt(0).toUpperCase()}</div>
                                <div class="user-info">
                                    <div class="user-info-name">${userName}</div>
                                    <div class="user-info-role">User</div>
                                </div>
                                
                                <div class="dropdown-menu" id="dropdownMenu">
                                    <a href="settings.html">⚙️ Settings</a>
                                    <div class="dropdown-divider"></div>
                                    <button type="button" id="logoutBtn">🚪 Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            `;
        },

        /**
         * Create Sidebar Component
         */
        createSidebar(activePage = 'dashboard') {
            const isActive = (page) => activePage === page ? 'active' : '';
            
            return `
                <aside class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <div class="sidebar-logo">💰 Money</div>
                        <button class="sidebar-close-btn" id="sidebarClose">✕</button>
                    </div>
                    
                    <ul class="sidebar-menu">
                        <li class="sidebar-menu-item ${isActive('dashboard')}" data-page="dashboard">
                            <span class="sidebar-menu-icon">📊</span>
                            <span class="sidebar-menu-text"><a href="dashboard.html">Dashboard</a></span>
                        </li>
                        <li class="sidebar-menu-item ${isActive('transactions')}" data-page="transactions">
                            <span class="sidebar-menu-icon">💳</span>
                            <span class="sidebar-menu-text"><a href="transactions.html">Transactions</a></span>
                        </li>
                        <li class="sidebar-menu-item ${isActive('budget')}" data-page="budget">
                            <span class="sidebar-menu-icon">🎯</span>
                            <span class="sidebar-menu-text"><a href="budget.html">Budgets</a></span>
                        </li>
                        <li class="sidebar-menu-item ${isActive('reports')}" data-page="reports">
                            <span class="sidebar-menu-icon">📈</span>
                            <span class="sidebar-menu-text"><a href="reports.html">Reports</a></span>
                        </li>
                        <li class="sidebar-menu-item ${isActive('ai-chat')}" data-page="ai-chat">
                            <span class="sidebar-menu-icon">🤖</span>
                            <span class="sidebar-menu-text"><a href="ai-chat.html">AI Assistant</a></span>
                        </li>
                    </ul>
                </aside>
                <div class="sidebar-overlay" id="sidebarOverlay"></div>
            `;
        },

        /**
         * Initialize header and sidebar interactions
         */
        initializeLayout(activePage = 'dashboard') {
            // Menu toggle
            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            const sidebarClose = document.getElementById('sidebarClose');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.add('mobile-visible');
                    sidebarOverlay.classList.add('active');
                });
            }
            
            if (sidebarClose) {
                sidebarClose.addEventListener('click', () => {
                    sidebar.classList.remove('mobile-visible');
                    sidebarOverlay.classList.remove('active');
                });
            }
            
            if (sidebarOverlay) {
                sidebarOverlay.addEventListener('click', () => {
                    sidebar.classList.remove('mobile-visible');
                    sidebarOverlay.classList.remove('active');
                });
            }

            // User menu dropdown
            const userMenu = document.getElementById('userMenu');
            const dropdownMenu = document.getElementById('dropdownMenu');
            
            if (userMenu && dropdownMenu) {
                userMenu.addEventListener('click', () => {
                    dropdownMenu.classList.toggle('active');
                });
                
                document.addEventListener('click', (e) => {
                    if (!userMenu.contains(e.target)) {
                        dropdownMenu.classList.remove('active');
                    }
                });
            }

            // Logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('user_session');
                    window.location.href = 'index.html';
                });
            }
        },

        /**
         * Create Stat Card
         */
        createStatCard(icon, title, value, subtitle = '', trend = null) {
            let trendHTML = '';
            if (trend) {
                const trendClass = trend.value >= 0 ? 'text-success' : 'text-danger';
                const trendIcon = trend.value >= 0 ? '↑' : '↓';
                trendHTML = `<div class="stat-trend ${trendClass}">${trendIcon} ${trend.label}</div>`;
            }

            return `
                <div class="stat-card card">
                    <div class="stat-icon">${icon}</div>
                    <div class="stat-content">
                        <div class="stat-title">${title}</div>
                        <div class="stat-value">${value}</div>
                        ${subtitle ? `<div class="stat-subtitle">${subtitle}</div>` : ''}
                        ${trendHTML}
                    </div>
                </div>
            `;
        },

        /**
         * Create Transaction Row
         */
        createTransactionRow(transaction) {
            const isIncome = transaction.type === 'income';
            const amountClass = isIncome ? 'text-success' : 'text-danger';
            const amountSign = isIncome ? '+' : '-';
            
            return `
                <tr>
                    <td>
                        <div class="transaction-description">
                            <div class="transaction-merchant">${transaction.merchant}</div>
                            <div class="transaction-date">${transaction.date}</div>
                        </div>
                    </td>
                    <td><span class="badge badge-${transaction.category.toLowerCase()}">${transaction.category}</span></td>
                    <td class="${amountClass}"><strong>${amountSign}${Math.abs(transaction.amount).toFixed(2)}</strong></td>
                    <td>
                        <button class="btn btn-ghost btn-small" onclick="editTransaction(${transaction.id})">Edit</button>
                        <button class="btn btn-danger btn-small" onclick="deleteTransaction(${transaction.id})">Delete</button>
                    </td>
                </tr>
            `;
        },

        /**
         * Create Budget Card
         */
        createBudgetCard(category, spent, limit) {
            const percentage = (spent / limit) * 100;
            let progressColor = 'success';
            let progressText = 'On track';
            
            if (percentage >= 100) {
                progressColor = 'danger';
                progressText = 'Over budget';
            } else if (percentage >= 80) {
                progressColor = 'warning';
                progressText = 'Nearly there';
            }

            return `
                <div class="budget-card card">
                    <div class="flex-between">
                        <h3>${category}</h3>
                        <button class="btn btn-ghost btn-small">Edit</button>
                    </div>
                    <div class="budget-amount">
                        <span class="budget-spent">${spent.toFixed(2)} AED</span>
                        <span class="text-secondary">/ ${limit.toFixed(2)} AED</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${progressColor}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="flex-between mt-sm">
                        <span class="text-secondary">${percentage.toFixed(0)}% spent</span>
                        <span class="text-sm ${progressColor === 'success' ? 'text-success' : progressColor === 'warning' ? 'text-warning' : 'text-danger'}">
                            ${progressText}
                        </span>
                    </div>
                </div>
            `;
        }
    };

    window.Components = Components;
})();
