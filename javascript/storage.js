// Funções de persistência de dados
export function saveExpenses(expenses) {
    localStorage.setItem('reis_expenses', JSON.stringify(expenses));
}
export function loadExpenses() {
    const storedExpenses = localStorage.getItem('reis_expenses');
    return storedExpenses ? JSON.parse(storedExpenses) : [];
}
export function saveFixedExpenses(fixedExpenses) {
    localStorage.setItem('reis_fixed_expenses', JSON.stringify(fixedExpenses));
}
export function loadFixedExpenses() {
    const stored = localStorage.getItem('reis_fixed_expenses');
    return stored ? JSON.parse(stored) : [];
}
export function saveTheme(theme) {
    localStorage.setItem('reis_theme', theme);
}
export function loadTheme() {
    return localStorage.getItem('reis_theme') || 'light';
}
