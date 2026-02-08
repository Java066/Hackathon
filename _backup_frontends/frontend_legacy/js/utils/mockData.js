/* Mock data for demo purposes (attached to window for global access) */
(function(){
    const mockUser = {
        name: 'John Doe',
        email: 'john@example.com',
        balance: 5420.50,
        income: 3500.00,
        expenses: 2180.00
    };

    const mockTransactions = [
        { id: 1, description: 'Grocery Shopping', amount: 85.50, category: 'Food', type: 'expense', date: '2026-02-05', account: 'Checking' },
        { id: 2, description: 'Salary', amount: 3500.00, category: 'Income', type: 'income', date: '2026-02-01', account: 'Bank' },
        { id: 3, description: 'Uber Ride', amount: 15.75, category: 'Transport', type: 'expense', date: '2026-02-04', account: 'Credit Card' },
        { id: 4, description: 'Netflix Subscription', amount: 14.99, category: 'Entertainment', type: 'expense', date: '2026-02-03', account: 'Credit Card' },
        { id: 5, description: 'Electricity Bill', amount: 120.00, category: 'Utilities', type: 'expense', date: '2026-02-02', account: 'Bank' }
    ];

    window.mockUser = mockUser;
    window.mockTransactions = mockTransactions;
})();
