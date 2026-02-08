// Header component - injects into element with id "main-header" if present
(function(){
    function createHeader(){
        const header = document.getElementById('main-header');
        if(!header) return;
        header.innerHTML = `
            <div class="header-container">
                <div class="logo">
                    <h2>Where's My Money</h2>
                </div>
                <nav class="main-nav">
                    <a href="dashboard.html">Dashboard</a>
                    <a href="transactions.html">Transactions</a>
                    <a href="budget.html">Budget</a>
                    <a href="reports.html">Reports</a>
                    <a href="ai-chat.html">AI Assistant</a>
                </nav>
                <div class="user-menu">
                    <span id="user-name">John Doe</span>
                    <button id="logout-btn">Logout</button>
                </div>
            </div>
        `;

        const logoutBtn = document.getElementById('logout-btn');
        if(logoutBtn) logoutBtn.addEventListener('click', () => { window.location = 'login.html'; });
    }

    document.addEventListener('DOMContentLoaded', createHeader);
})();
