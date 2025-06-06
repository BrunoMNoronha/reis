// Funções de renderização de despesas, fixas e resumo
export function renderExpenses(expenses, expenseListContainer, noExpensesMessage, expenseItemTemplate, deleteExpense) {
    expenseListContainer.innerHTML = '';
    if (expenses.length === 0) {
        expenseListContainer.appendChild(noExpensesMessage);
        noExpensesMessage.style.display = 'block';
        return;
    }
    noExpensesMessage.style.display = 'none';
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    expenses.forEach(expense => {
        const templateClone = expenseItemTemplate.content.cloneNode(true);
        const expenseItem = templateClone.querySelector('.expense-list-item');
        expenseItem.dataset.id = expense.id;
        templateClone.querySelector('.value').textContent = `R$ ${parseFloat(expense.value).toFixed(2).replace('.', ',')}`;
        templateClone.querySelector('.category').textContent = expense.category;
        templateClone.querySelector('.date').textContent = new Date(expense.date + 'T00:00:00-03:00').toLocaleDateString('pt-BR');
        const observationEl = templateClone.querySelector('.observation');
        if (expense.observation) {
            observationEl.textContent = `"${expense.observation}"`;
            observationEl.style.display = 'block';
        } else {
            observationEl.style.display = 'none';
        }
        templateClone.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(expense.id));
        expenseListContainer.appendChild(templateClone);
    });
}

export function renderFixedExpenses(fixedExpenses, fixedExpenseListContainer, noFixedExpensesMessage, fixedExpenseItemTemplate, deleteFixedExpense) {
    fixedExpenseListContainer.innerHTML = '';
    if (fixedExpenses.length === 0) {
        fixedExpenseListContainer.appendChild(noFixedExpensesMessage);
        noFixedExpensesMessage.style.display = 'block';
        return;
    }
    noFixedExpensesMessage.style.display = 'none';
    fixedExpenses.forEach(exp => {
        const templateClone = fixedExpenseItemTemplate.content.cloneNode(true);
        const item = templateClone.querySelector('.expense-list-item');
        item.dataset.id = exp.id;
        templateClone.querySelector('.value').textContent = `R$ ${parseFloat(exp.value || exp.amount).toFixed(2).replace('.', ',')} - ${exp.description || exp.name}`;
        templateClone.querySelector('.category').textContent = exp.category;
        templateClone.querySelector('.due-day').textContent = `Vence todo dia ${exp.dueDay || exp.dueDate}`;
        templateClone.querySelector('.delete-btn').addEventListener('click', () => deleteFixedExpense(exp.id));
        fixedExpenseListContainer.appendChild(templateClone);
    });
}
