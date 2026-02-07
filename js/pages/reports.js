/**
 * Reports Page Handler
 */

(function() {
    const Reports = {
        init() {
            this.render();
        },

        render() {
            const mainLayout = document.getElementById('mainLayout');
            const mainContent = document.getElementById('mainContent');

            mainLayout.innerHTML = Components.createHeader('Ahmed Khan') + 
                                   Components.createSidebar('reports');

            mainContent.innerHTML = `
                <h1>📊 Financial Reports</h1>

                <div class="dashboard-grid mt-lg">
                    <div class="chart-card card">
                        <h2>📈 Income vs Expenses</h2>
                        <div class="chart-container">
                            <canvas id="incomeExpenseChart"></canvas>
                        </div>
                    </div>

                    <div class="quick-stats">
                        <div class="card">
                            <h3>This Month</h3>
                            <div class="flex-col gap-lg">
                                <div>
                                    <div class="text-secondary text-sm">Income</div>
                                    <div class="text-lg font-semibold text-success">4,500 AED</div>
                                </div>
                                <div>
                                    <div class="text-secondary text-sm">Expenses</div>
                                    <div class="text-lg font-semibold text-danger">2,120 AED</div>
                                </div>
                                <div>
                                    <div class="text-secondary text-sm">Savings</div>
                                    <div class="text-lg font-semibold">2,380 AED</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mt-lg">
                    <h2>📉 Spending Trends</h2>
                    <div class="chart-container">
                        <canvas id="trendChart"></canvas>
                    </div>
                </div>
            `;

            Components.initializeLayout('reports');
            this.renderCharts();
        },

        renderCharts() {
            // Income vs Expense chart
            const incomeExpenseCtx = document.getElementById('incomeExpenseChart');
            if (incomeExpenseCtx) {
                new Chart(incomeExpenseCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [
                            {
                                label: 'Income',
                                data: [4500, 4500, 4500, 5000, 4500, 4500],
                                backgroundColor: '#10B981'
                            },
                            {
                                label: 'Expenses',
                                data: [1800, 2120, 1950, 2100, 1850, 2000],
                                backgroundColor: '#EF4444'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            }

            // Trend chart
            const trendCtx = document.getElementById('trendChart');
            if (trendCtx) {
                new Chart(trendCtx, {
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [{
                            label: 'Weekly Spending',
                            data: [450, 520, 480, 670],
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: true }
                        }
                    }
                });
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Reports.init());
    } else {
        Reports.init();
    }

    window.Reports = Reports;
})();
