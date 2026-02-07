// Simple validators exposed on window.validators
(function(){
	function validateEmail(email){
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	}

	function validatePassword(password){
		if(typeof password !== 'string') return false;
		return password.length >= 8;
	}

	function validateRequired(value){
		return String(value || '').trim() !== '';
	}

	function validateNumber(value){
		const n = Number(value);
		return !Number.isNaN(n) && isFinite(n);
	}

	window.validators = { validateEmail, validatePassword, validateRequired, validateNumber };
})();

