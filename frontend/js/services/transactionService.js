(function(){
	let transactions = window.mockTransactions ? structuredClone(window.mockTransactions) : [];
	let nextId = transactions.reduce((max, t) => Math.max(max, t.id || 0), 0) + 1;

	function list(){
		return transactions.slice().sort((a,b) => new Date(b.date) - new Date(a.date));
	}

	function add(tx){
		const newTx = Object.assign({}, tx, { id: nextId++ });
		transactions.push(newTx);
		return newTx;
	}

	function remove(id){
		const idx = transactions.findIndex(t => t.id === Number(id));
		if(idx === -1) return false;
		transactions.splice(idx,1);
		return true;
	}

	function update(id, patch){
		const tx = transactions.find(t => t.id === Number(id));
		if(!tx) return null;
		Object.assign(tx, patch);
		return tx;
	}

	function find(id){
		return transactions.find(t => t.id === Number(id)) || null;
	}

	window.transactionService = { list, add, remove, update, find };
})();

(function(){
	let transactions = window.mockTransactions ? structuredClone(window.mockTransactions) : [];
	let nextId = transactions.reduce((max, t) => Math.max(max, t.id || 0), 0) + 1;

	function list(){
		// return a shallow copy sorted by date desc
		return transactions.slice().sort((a,b) => new Date(b.date) - new Date(a.date));
	}

	function add(tx){
		const newTx = Object.assign({}, tx, { id: nextId++ });
		transactions.push(newTx);
		return newTx;
	}

	function remove(id){
		const idx = transactions.findIndex(t => t.id === Number(id));
		if(idx === -1) return false;
		transactions.splice(idx,1);
		return true;
	}

	function update(id, patch){
		const tx = transactions.find(t => t.id === Number(id));
		if(!tx) return null;
		Object.assign(tx, patch);
		return tx;
	}

	function find(id){
		return transactions.find(t => t.id === Number(id)) || null;
	}

	window.transactionService = { list, add, remove, update, find };
})();
