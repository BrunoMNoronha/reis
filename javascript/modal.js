// Funções para modais
export function showModal(modal) {
    modal.style.display = 'flex';
    const input = modal.querySelector('input, select, textarea');
    if (input) input.focus();
}
export function hideModal(modal) {
    modal.style.display = 'none';
}
