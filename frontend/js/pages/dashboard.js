/**
 * Dashboard Page Handler
 */

(function() {
    const Dashboard = {
        // Mock data
        userData: {
            name: 'Ahmed Khan',
            email: 'ahmed@example.com'
        },
        
        recentTransactions: [
            { id: 1, date: 'Feb 06, 2026', merchant: 'Salary Deposit', category: 'Income', amount: 4500, type: 'income' },
            { id: 2, date: 'Feb 05, 2026', merchant: 'Coffee Shop', category: 'Food', amount: 12.50, type: 'expense' },
            { id: 3, date: 'Feb 04, 2026', merchant: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense' },
            { id: 4, date: 'Feb 03, 2026', merchant: 'Grocery Store', category: 'Shopping', amount: 87.45, type: 'expense' },
            { id: 5, date: 'Feb 02, 2026', merchant: 'Gas Station', category: 'Transport', amount: 45.00, type: 'expense' }
        ],

        categoryBreakdown: {
            'Food & Dining': 485,
            'Shopping': 720,
            'Entertainment': 150,
            'Transport': 320,
            'Utilities': 200,
            'Other': 245
        },

        monthlyStats: {
            income: 4500,
            expenses: 2120,
            savings: 2380
        },

        init() {
            this.render();
            this.setupEventListeners();
        },

        render() {
            const mainLayout = document.getElementById('mainLayout');
            const mainContent = document.getElementById('mainContent');

            // Load header and sidebar
            mainLayout.innerHTML = Components.createHeader(this.userData.name) + 
                                   Components.createSidebar('dashboard');

            // Render main content
            mainContent.innerHTML = `
                <div class="container">
                    <h1 style="margin-bottom: var(--spacing-lg)">Welcome back, ${this.userData.name}! 👋</h1>

                    <!-- Stats Cards -->
                    <div class="dashboard">
                        ${Components.createStatCard('💰', 'Total Balance', '5,750.32 AED', 'Your net worth', { value: 12.5, label: '+12.5% vs last month' })}
                        ${Components.createStatCard('📈', 'Income', '4,500.00 AED', 'This month', { value: 5, label: 'Monthly salary' })}
                        ${Components.createStatCard('📉', 'Expenses', '2,120.00 AED', 'This month', { value: -8, label: '-8% vs last month' })}
                        ${Components.createStatCard('💳', 'Savings', '2,380.00 AED', '52.9% of income', { value: 15, label: '+15% growth' })}
                    </div>

                    <!-- Charts Section -->
                    <div class="dashboard-grid mt-xl">
                        <div class="chart-card card">
                            <h2>📊 Spending Breakdown</h2>
                            <div class="chart-container">
                                <canvas id="categoryChart"></canvas>
                            </div>
                        </div>

                        <div class="quick-stats">
                            <div class="card">
                                <h3>Quick Stats</h3>
                                <div class="flex-col gap-lg">
                                    <div>
                                        <div class="text-secondary text-sm">Monthly Average</div>
                                        <div class="text-lg font-semibold">1,234 AED</div>
                                    </div>
                                    <div>
                                        <div class="text-secondary text-sm">Largest Expense</div>
                                        <div class="text-lg font-semibold">Shopping (720 AED)</div>
                                    </div>
                                    <div>
                                        <div class="text-secondary text-sm">Savings Goal</div>
                                        <div class="progress-bar">
                                            <div class="progress-fill success" style="width: 65%"></div>
                                        </div>
                                        <div class="text-secondary text-sm mt-sm">65% towards goal</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Transactions -->
                    <div class="card mt-xl">
                        <div class="flex-between">
                            <h2>💳 Recent Transactions</h2>
                            <a href="transactions.html" class="btn btn-primary btn-small">View All</a>
                        </div>
                        <div style="overflow-x: auto;">
                            <table class="transactions-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.recentTransactions.map(tx => Components.createTransactionRow(tx)).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="mt-xl" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg);">
                        <button class="btn btn-primary btn-large" onclick="openAddTransactionModal()">➕ Add Transaction</button>
                        <button class="btn btn-secondary btn-large" onclick="window.location.href='budget.html'">🎯 Set Budget</button>
                        <button class="btn btn-outline btn-large" onclick="window.location.href='ai-chat.html'">🤖 Ask AI</button>
                    </div>
                </div>
            `;

            // Initialize layout
            Components.initializeLayout('dashboard');
            this.renderCharts();
        },

        renderCharts() {
            // Doughnut chart for category breakdown
            const ctx = document.getElementById('categoryChart');
            if (ctx) {
                const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(this.categoryBreakdown),
                        datasets: [{
                            data: Object.values(this.categoryBreakdown),
                            backgroundColor: colors,
                            borderColor: '#FFF',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }
        },

        setupEventListeners() {
            // Any additional event listeners
        }
    };

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            Dashboard.init();
        });
    } else {
        Dashboard.init();
    }

    // Make Dashboard globally available
    window.Dashboard = Dashboard;
})();
    {
        id: 5,
        date: '2026-02-02',
        description: 'Freelance Payment',
        category: 'Income',
        amount: 250.00,
        type: 'income',
        status: 'completed'
    },
    {
        id: 6,
        date: '2026-02-01',
        description: 'Electric Bill',
        category: 'Utilities',
        amount: -125.00,
        type: 'expense',
        status: 'pending'
    }
];

// ============================================
// Dashboard Class
// ============================================
class Dashboard {
    constructor() {
        this.userData = null;
        this.transactions = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadTransactions();
        this.setupEventListeners();
        this.updateCurrentDate();
        this.renderStats();
        this.renderTransactions();
        
        console.log('Dashboard initialized');
    }

    setupEventListeners() {
        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        
        sidebarToggle?.addEventListener('click', () => {
            sidebar?.classList.toggle('open');
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn?.addEventListener('click', () => this.handleLogout());

        // View all transactions
        const viewAllLink = document.querySelector('.view-all');
        viewAllLink?.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Navigate to transactions page');
        });
    }

    loadUserData() {
        // Try to load from localStorage (backend data)
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                this.userData = JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to parse stored user data');
                this.userData = mockUserData;
            }
        } else {
            // Use mock data for demo
            this.userData = mockUserData;
        }

        // Update UI with user data
        this.updateUserUI();
    }

    updateUserUI() {
        document.getElementById('userName').textContent = this.userData.name.split(' ')[0];
        document.getElementById('userNameProfile').textContent = this.userData.name;
        document.getElementById('userEmailProfile').textContent = this.userData.email;
    }

    updateCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', options);
        document.getElementById('currentDate').textContent = formattedDate;
    }

    loadTransactions() {
        // Try to load from API or localStorage
        const stored = localStorage.getItem('transactions');
        if (stored) {
            try {
                this.transactions = JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to parse stored transactions');
                this.transactions = mockTransactions;
            }
        } else {
            this.transactions = mockTransactions;
        }
    }

    renderStats() {
        // Calculate stats
        const income = this.userData.monthlyIncome || 4500;
        const expenses = Math.abs(this.userData.monthlyExpenses || 2100.50);
        const balance = this.userData.totalBalance || 5750.32;
        const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

        // Update DOM
        document.getElementById('totalBalance').textContent = balance.toFixed(2);
        document.getElementById('totalIncome').textContent = income.toFixed(2);
        document.getElementById('totalExpenses').textContent = expenses.toFixed(2);
        document.getElementById('savingsRate').textContent = savingsRate;
    }

    renderTransactions() {
        const tbody = document.getElementById('transactionsBody');
        const noTransactions = document.getElementById('noTransactions');

        if (!tbody) return;

        if (this.transactions.length === 0) {
            tbody.innerHTML = '';
            noTransactions?.style.display = 'flex';
            return;
        }

        noTransactions?.style.display = 'none';
        tbody.innerHTML = '';

        // Show latest 6 transactions
        const recentTransactions = this.transactions.slice(0, 6);

        recentTransactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.style.animation = `slideInUp 0.4s ease-out forwards`;
            row.style.animationDelay = `${index * 0.05}s`;

            const amountClass = transaction.type === 'income' ? 'income' : 'expense';
            const amountPrefix = transaction.type === 'income' ? '+' : '';
            const formattedDate = this.formatDate(transaction.date);

            row.innerHTML = `
                <td class="transaction-date">${formattedDate}</td>
                <td>${transaction.description}</td>
                <td>
                    <span class="transaction-category">${transaction.category}</span>
                </td>
                <td class="transaction-amount ${amountClass}">
                    ${amountPrefix}$${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>
                    <span class="transaction-status ${transaction.status.toLowerCase()}">
                        ${this.capitalizeFirst(transaction.status)}
                    </span>
                </td>
                <td>
                    <div class="transaction-actions">
                        <button class="action-btn" title="Edit">✏️</button>
                        <button class="action-btn" title="Delete">🗑️</button>
                    </div>
                </td>
            `;

            tbody.appendChild(row);

            // Add action button listeners
            const editBtn = row.querySelector('.action-btn:first-child');
            const deleteBtn = row.querySelector('.action-btn:last-child');

            editBtn?.addEventListener('click', () => this.editTransaction(transaction.id));
            deleteBtn?.addEventListener('click', () => this.deleteTransaction(transaction.id));
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    handleNavigation(link) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');

        // Close sidebar on mobile
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth <= 768) {
            sidebar?.classList.remove('open');
        }

        const page = link.dataset.page;
        console.log('Navigating to:', page);

        // Mock navigation
        switch(page) {
            case 'overview':
                console.log('Loading overview...');
                break;
            case 'transactions':
                console.log('Loading transactions...');
                // window.location.href = '/transactions';
                break;
            case 'categories':
                console.log('Loading categories...');
                break;
            case 'budgets':
                console.log('Loading budgets...');
                break;
            case 'analytics':
                console.log('Loading analytics...');
                break;
            case 'settings':
                console.log('Loading settings...');
                break;
        }
    }

    editTransaction(transactionId) {
        const transaction = this.transactions.find(t => t.id === transactionId);
        console.log('Edit transaction:', transaction);
        alert(`Edit transaction: ${transaction?.description}`);
    }

    deleteTransaction(transactionId) {
        const transaction = this.transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        if (confirm(`Delete transaction: ${transaction.description}?`)) {
            this.transactions = this.transactions.filter(t => t.id !== transactionId);
            localStorage.setItem('transactions', JSON.stringify(this.transactions));
            this.renderTransactions();
            console.log('Transaction deleted:', transactionId);
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            console.log('Logout successful');
            
            // Redirect to login
            window.location.href = '/login.html';
        }
    }
}

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated OR in demo mode
    const authToken = localStorage.getItem('authToken');
    const demoMode = new URLSearchParams(window.location.search).has('demo');
    
    if (!authToken && !demoMode) {
        console.log('No auth token found, enabling demo mode');
        // Enable demo mode automatically
    }

    // Initialize dashboard
    new Dashboard();
});

// Handle responsive sidebar
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar?.classList.remove('open');
    }
});
