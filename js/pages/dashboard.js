// Dashboard Page Handler

// ============================================
// Mock Data for Demo
// ============================================
const mockUserData = {
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    totalBalance: 5750.32,
    monthlyIncome: 4500.00,
    monthlyExpenses: 2100.50
};

const mockTransactions = [
    {
        id: 1,
        date: '2026-02-06',
        description: 'Salary Deposit',
        category: 'Income',
        amount: 4500,
        type: 'income',
        status: 'completed'
    },
    {
        id: 2,
        date: '2026-02-05',
        description: 'Coffee Shop',
        category: 'Food & Dining',
        amount: -12.50,
        type: 'expense',
        status: 'completed'
    },
    {
        id: 3,
        date: '2026-02-04',
        description: 'Netflix Subscription',
        category: 'Entertainment',
        amount: -15.99,
        type: 'expense',
        status: 'completed'
    },
    {
        id: 4,
        date: '2026-02-03',
        description: 'Grocery Store',
        category: 'Shopping',
        amount: -87.45,
        type: 'expense',
        status: 'completed'
    },
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
