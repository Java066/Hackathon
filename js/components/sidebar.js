// Sidebar component - injects into element with id "sidebar" if present
(function(){
    function createSidebar(){
        const sidebar = document.getElementById('sidebar');
        if(!sidebar) return;
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3>Menu</h3>
            </div>
            <ul class="sidebar-menu">
                <li><a href="dashboard.html"><i class="icon-dashboard"></i> Dashboard</a></li>
                <li><a href="transactions.html"><i class="icon-wallet"></i> Transactions</a></li>
                <li><a href="budget.html"><i class="icon-budget"></i> Budget</a></li>
                <li><a href="reports.html"><i class="icon-chart"></i> Reports</a></li>
                <li><a href="ai-chat.html"><i class="icon-chat"></i> AI Chat</a></li>
                <li><a href="settings.html"><i class="icon-settings"></i> Settings</a></li>
            </ul>
        `;
    }

    document.addEventListener('DOMContentLoaded', createSidebar);
})();
