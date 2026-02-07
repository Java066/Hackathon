// previous version (empty) restored
// Chart helpers using Chart.js if available
(function(){
	function createSpendingChart(canvasId){
		const el = document.getElementById(canvasId);
		if(!el || typeof Chart === 'undefined') return null;
		return new Chart(el.getContext('2d'), {
			type: 'doughnut',
			data: {
				labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'],
				datasets: [{
					data: [300,150,200,100,50],
					backgroundColor: ['#10B981','#3B82F6','#F59E0B','#EF4444','#6B7280']
				}]
			},
			options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
		});
	}

	function createIncomeExpenseChart(canvasId){
		const el = document.getElementById(canvasId);
		if(!el || typeof Chart === 'undefined') return null;
		return new Chart(el.getContext('2d'), {
			type: 'bar',
			data: {
				labels: ['Jan','Feb','Mar','Apr','May','Jun'],
				datasets:[
					{ label: 'Income', data:[3000,3200,3100,3300,3400,3500], backgroundColor:'#10B981' },
					{ label: 'Expenses', data:[2200,2400,2300,2500,2600,2400], backgroundColor:'#EF4444' }
				]
			},
			options: { responsive:true, scales: { y: { beginAtZero: true } } }
		});
	}

	window.createSpendingChart = createSpendingChart;
	window.createIncomeExpenseChart = createIncomeExpenseChart;
})();
