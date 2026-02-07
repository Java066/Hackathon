/**
 * Budget Page Handler
 */

(function() {
    const Budget = {
        budgets: [
            { id: 1, category: 'Food & Dining', limit: 500, spent: 340 },
            { id: 2, category: 'Transport', limit: 300, spent: 245 },
            { id: 3, category: 'Entertainment', limit: 200, spent: 85 },
            { id: 4, category: 'Shopping', limit: 400, spent: 380 },
            { id: 5, category: 'Utilities', limit: 250, spent: 198 },
        ],

        init() {
            this.render();
        },

        render() {
            const mainLayout = document.getElementById('mainLayout');
            const mainContent = document.getElementById('mainContent');

            mainLayout.innerHTML = Components.createHeader('Ahmed Khan') + 
                                   Components.createSidebar('budget');

            mainContent.innerHTML = `
                <h1>🎯 Budgets</h1>

                <div style="margin-bottom: var(--spacing-lg);">
                    <button class="btn btn-primary" onclick="Budget.openCreateModal()">➕ Create Budget</button>
                </div>

                <div class="grid grid-2">
                    ${this.budgets.map(b => Components.createBudgetCard(b.category, b.spent, b.limit)).join('')}
                </div>
            `;

            Components.initializeLayout('budget');
        },

        openCreateModal() {
            Modal.create({
                title: '➕ Create Budget',
                content: `
                    <form class="auth-form">
                        <div class="form-group">
                            <label>Category</label>
                            <select id="budgetCategory">
                                <option>Food & Dining</option>
                                <option>Transport</option>
                                <option>Entertainment</option>
                                <option>Shopping</option>
                                <option>Utilities</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Monthly Limit (AED)</label>
                            <input type="number" id="budgetLimit" step="0.01" placeholder="0.00">
                        </div>
                    </form>
                `,
                buttons: [
                    { text: 'Cancel', type: 'ghost', action: 'close' },
                    {
                        text: 'Create Budget',
                        type: 'primary',
                        action: () => this.saveBudget()
                    }
                ]
            });
        },

        saveBudget() {
            Toast.success('Budget created successfully!', 'Success');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Budget.init());
    } else {
        Budget.init();
    }

    window.Budget = Budget;
})();
