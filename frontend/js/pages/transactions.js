(function(){
	function qs(sel){ return document.querySelector(sel); }
	function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

	function formatCurrency(n){
		return (typeof n === 'number' ? n : Number(n)).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
	}

	function renderTable(transactions){
		const tbody = qs('#transactions-table tbody');
		if(!tbody) return;
		tbody.innerHTML = '';
		if(!transactions.length){
			const tr = document.createElement('tr');
			tr.className = 'placeholder';
			tr.innerHTML = '<td colspan="6">No transactions to show.</td>';
			tbody.appendChild(tr);
			return;
		}

		transactions.forEach(tx => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${tx.date}</td>
				<td>${tx.description}</td>
				<td>${tx.category}</td>
				<td class="amount">${formatCurrency(tx.amount)}</td>
				<td>${tx.account || ''}</td>
				<td><button class="btn small btn-edit" data-id="${tx.id}">Edit</button> <button class="btn small btn-delete" data-id="${tx.id}">Delete</button></td>
			`;
			tbody.appendChild(tr);
		});
	}

	function loadAndRender(){
		const all = window.transactionService.list();
		renderTable(all);
		populateCategoryFilter(all);
	}

	function populateCategoryFilter(transactions){
		const select = qs('#tx-category');
		if(!select) return;
		const cats = Array.from(new Set(transactions.map(t => t.category))).filter(Boolean);
		select.innerHTML = '<option value="">All categories</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
	}

	function applyFilters(){
		const search = qs('#tx-search').value.toLowerCase();
		const cat = qs('#tx-category').value;
		const from = qs('#tx-from').value;
		const to = qs('#tx-to').value;

		let items = window.transactionService.list();
		if(search) items = items.filter(t => (t.description||'').toLowerCase().includes(search) || (t.account||'').toLowerCase().includes(search));
		if(cat) items = items.filter(t => t.category === cat);
		if(from) items = items.filter(t => new Date(t.date) >= new Date(from));
		if(to) items = items.filter(t => new Date(t.date) <= new Date(to));

		renderTable(items);
	}

	function bindActions(){
		const addBtn = qs('#add-transaction');
		const modal = qs('#tx-modal');
		const form = qs('#tx-form');

		if(addBtn) addBtn.addEventListener('click', () => {
			if(form) { delete form.dataset.editId; form.reset(); }
			window.openModal('tx-modal');
		});
		if(qs('.modal-close')) qs('.modal-close').addEventListener('click', () => { if(form) delete form.dataset.editId; window.closeModal('tx-modal'); });
		if(qs('#tx-cancel')) qs('#tx-cancel').addEventListener('click', () => { if(form) delete form.dataset.editId; window.closeModal('tx-modal'); });

		if(form){
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				const fd = new FormData(form);
				const editId = form.dataset.editId;
				if(editId){
					window.transactionService.update(editId, {
						date: fd.get('date'),
						description: fd.get('description'),
						amount: Number(fd.get('amount')),
						category: fd.get('category'),
						account: fd.get('account')
					});
					window.showToast('Transaction updated', 'success');
					delete form.dataset.editId;
				} else {
					const tx = {
						date: fd.get('date'),
						description: fd.get('description'),
						amount: Number(fd.get('amount')),
						category: fd.get('category'),
						account: fd.get('account')
					};
					window.transactionService.add(tx);
					window.showToast('Transaction added', 'success');
				}
				window.closeModal('tx-modal');
				form.reset();
				loadAndRender();
			});
		}

		// Delegated edit/delete
		const tbody = qs('#transactions-table tbody');
		if(tbody){
			tbody.addEventListener('click', (e) => {
				const del = e.target.closest('.btn-delete');
				const edit = e.target.closest('.btn-edit');
				if(del){
					const id = del.dataset.id;
					if(confirm('Delete this transaction?')){
						window.transactionService.remove(id);
						window.showToast('Deleted', 'warning');
						loadAndRender();
					}
				}
				if(edit){
					const id = edit.dataset.id;
					const tx = window.transactionService.find(id);
					if(!tx) return;
					const formEl = qs('#tx-form');
					formEl.date.value = tx.date;
					formEl.description.value = tx.description;
					formEl.amount.value = tx.amount;
					formEl.category.value = tx.category;
					formEl.account.value = tx.account || '';
					formEl.dataset.editId = id;
					window.openModal('tx-modal');
				}
			});
		}

		// filters
		['#tx-search','#tx-category','#tx-from','#tx-to'].forEach(sel => {
			const el = qs(sel);
			if(!el) return;
			el.addEventListener('input', applyFilters);
			el.addEventListener('change', applyFilters);
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
		loadAndRender();
		bindActions();
	});

})();
(function(){
	function qs(sel){ return document.querySelector(sel); }
	function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

	function formatCurrency(n){
		return (typeof n === 'number' ? n : Number(n)).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
	}

	function renderTable(transactions){
		const tbody = qs('#transactions-table tbody');
		if(!tbody) return;
		tbody.innerHTML = '';
		if(!transactions.length){
			const tr = document.createElement('tr');
			tr.className = 'placeholder';
			tr.innerHTML = '<td colspan="6">No transactions to show.</td>';
			tbody.appendChild(tr);
			return;
		}

		transactions.forEach(tx => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${tx.date}</td>
				<td>${tx.description}</td>
				<td>${tx.category}</td>
				<td class="amount">${formatCurrency(tx.amount)}</td>
				<td>${tx.account || ''}</td>
				<td><button class="btn small btn-edit" data-id="${tx.id}">Edit</button> <button class="btn small btn-delete" data-id="${tx.id}">Delete</button></td>
			`;
			tbody.appendChild(tr);
		});
	}

	function loadAndRender(){
		const all = window.transactionService.list();
		renderTable(all);
		populateCategoryFilter(all);
	}

	function populateCategoryFilter(transactions){
		const select = qs('#tx-category');
		if(!select) return;
		const cats = Array.from(new Set(transactions.map(t => t.category))).filter(Boolean);
		select.innerHTML = '<option value="">All categories</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
	}

	function applyFilters(){
		const search = qs('#tx-search').value.toLowerCase();
		const cat = qs('#tx-category').value;
		const from = qs('#tx-from').value;
		const to = qs('#tx-to').value;

		let items = window.transactionService.list();
		if(search) items = items.filter(t => (t.description||'').toLowerCase().includes(search) || (t.account||'').toLowerCase().includes(search));
		if(cat) items = items.filter(t => t.category === cat);
		if(from) items = items.filter(t => new Date(t.date) >= new Date(from));
		if(to) items = items.filter(t => new Date(t.date) <= new Date(to));

		renderTable(items);
	}

	function bindActions(){
		const addBtn = qs('#add-transaction');
		const modal = qs('#tx-modal');
		const form = qs('#tx-form');

		if(addBtn) addBtn.addEventListener('click', () => { window.openModal('tx-modal'); });
		if(qs('.modal-close')) qs('.modal-close').addEventListener('click', () => window.closeModal('tx-modal'));
		if(qs('#tx-cancel')) qs('#tx-cancel').addEventListener('click', () => window.closeModal('tx-modal'));

		if(form){
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				const fd = new FormData(form);
				const tx = {
					date: fd.get('date'),
					description: fd.get('description'),
					amount: Number(fd.get('amount')),
					category: fd.get('category'),
					account: fd.get('account')
				};
				const created = window.transactionService.add(tx);
				window.showToast('Transaction added', 'success');
				window.closeModal('tx-modal');
				form.reset();
				loadAndRender();
			});
		}

		// Delegated edit/delete
		document.querySelector('#transactions-table tbody').addEventListener('click', (e) => {
			const del = e.target.closest('.btn-delete');
			const edit = e.target.closest('.btn-edit');
			if(del){
				const id = del.dataset.id;
				if(confirm('Delete this transaction?')){
					window.transactionService.remove(id);
					window.showToast('Deleted', 'warning');
					loadAndRender();
				}
			}
			if(edit){
				const id = edit.dataset.id;
				const tx = window.transactionService.find(id);
				if(!tx) return;
				const formEl = qs('#tx-form');
				formEl.date.value = tx.date;
				formEl.description.value = tx.description;
				formEl.amount.value = tx.amount;
				formEl.category.value = tx.category;
				formEl.account.value = tx.account || '';
				// remove old submit handler and replace to perform update
				formEl.removeEventListener('submit', ()=>{});
				window.openModal('tx-modal');
				// on save, update
				const handler = function(ev){
					ev.preventDefault();
					const fd = new FormData(formEl);
					window.transactionService.update(id, {
						date: fd.get('date'),
						description: fd.get('description'),
						amount: Number(fd.get('amount')),
						category: fd.get('category'),
						account: fd.get('account')
					});
					window.showToast('Updated', 'success');
					window.closeModal('tx-modal');
					formEl.reset();
					loadAndRender();
					formEl.removeEventListener('submit', handler);
				};
				formEl.addEventListener('submit', handler);
			}
		});

		// filters
		['#tx-search','#tx-category','#tx-from','#tx-to'].forEach(sel => {
			const el = qs(sel);
			if(!el) return;
			el.addEventListener('input', applyFilters);
			el.addEventListener('change', applyFilters);
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
		loadAndRender();
		bindActions();
	});

})();

