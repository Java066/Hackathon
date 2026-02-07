// Simple modal helper
(function(){
    function openModal(modalId){
        const modal = document.getElementById(modalId);
        if(!modal) return;
        modal.classList.remove('hidden');
    }

    function closeModal(modalId){
        const modal = document.getElementById(modalId);
        if(!modal) return;
        modal.classList.add('hidden');
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList && e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });

    window.openModal = openModal;
    window.closeModal = closeModal;
})();
