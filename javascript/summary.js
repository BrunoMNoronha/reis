// Função para renderizar o resumo e gráfico
export function renderSummary(expenses, summaryTotalEl, summaryByCategoryEl, renderChart, analyzeBtn, currentTheme) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyExpenses = expenses.filter(exp => new Date(exp.date + 'T00:00:00-03:00') >= firstDayOfMonth);
    const total = monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.value), 0);
    summaryTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    const byCategory = monthlyExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.value);
        return acc;
    }, {});
    summaryByCategoryEl.innerHTML = '';
    const sortedCategories = Object.entries(byCategory).sort(([, a], [, b]) => b - a);
    if(sortedCategories.length > 0) {
        const listTitle = document.createElement('h3');
        listTitle.textContent = 'Gastos por Categoria';
        listTitle.style.marginBottom = '1rem';
        summaryByCategoryEl.appendChild(listTitle);
    }
    sortedCategories.forEach(([category, value]) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<div class="category-item"><span>${category}</span><strong>R$ ${value.toFixed(2).replace('.', ',')}</strong></div><div class="progress-bar-container"><div class="progress-bar" style="width: ${percentage}%;"></div></div>`;
        summaryByCategoryEl.appendChild(categoryDiv);
    });
    renderChart(byCategory, currentTheme);
    if (analyzeBtn) analyzeBtn.disabled = monthlyExpenses.length === 0;
}

export function renderChart(dataByCategory, currentTheme) {
    const chartContainer = document.querySelector('.chart-container');
    const ctx = document.getElementById('expense-chart').getContext('2d');
    const labels = Object.keys(dataByCategory);
    const data = Object.values(dataByCategory);
    if (window.expenseChart) window.expenseChart.destroy();
    if (labels.length === 0) {
        chartContainer.style.display = 'none';
        return;
    }
    chartContainer.style.display = 'block';
    window.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Despesas do Mês',
                data: data,
                backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#6b7280', '#facc15'],
                borderColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                borderWidth: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => ` ${context.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed)}` } }
            }
        }
    });
}
