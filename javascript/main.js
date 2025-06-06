document.addEventListener('DOMContentLoaded', () => {
    // === Seletores de DOM ===
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const addExpenseMicBtn = document.getElementById('add-expense-mic-btn');
    const micFeedback = document.getElementById('mic-feedback');
    const expenseModal = document.getElementById('expense-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const expenseForm = document.getElementById('expense-form');
    const expenseListContainer = document.getElementById('expense-list-container');
    const noExpensesMessage = document.querySelector('.no-expenses-message');
    const expenseItemTemplate = document.getElementById('expense-item-template');
    const tabs = document.querySelectorAll('.view-toggle .tab');
    const views = document.querySelectorAll('.view');
    const summaryTotalEl = document.getElementById('summary-total');
    const summaryByCategoryEl = document.getElementById('summary-by-category');
    const analyzeBtn = document.getElementById('analyze-btn');
    const analysisContainer = document.getElementById('analysis-container');
    const analysisContent = document.getElementById('analysis-content');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmOkBtn = document.getElementById('confirm-ok-btn');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    const fixedExpenseModal = document.getElementById('fixed-expense-modal');
    const fixedExpenseForm = document.getElementById('fixed-expense-form');
    const fixedExpenseListContainer = document.getElementById('fixed-expense-list-container');
    const noFixedExpensesMessage = document.querySelector('.no-fixed-expenses-message');
    const fixedExpenseItemTemplate = document.getElementById('fixed-expense-item-template');
    const addFixedExpenseBtn = document.getElementById('add-fixed-expense-btn');
    const fixedCancelBtn = document.getElementById('fixed-cancel-btn');

    // === Estado da Aplicação ===
    let expenses = [];
    let fixedExpenses = [];
    let currentTheme = 'light';
    let expenseChart = null; // Guarda a instância do gráfico
    let confirmCallback = null; // Guarda a ação a ser confirmada

    // === API de Reconhecimento de Voz ===
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isRecognitionAvailable = SpeechRecognition ? true : false;
    let recognition;

    if (isRecognitionAvailable) {
        recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    } else {
        addExpenseMicBtn.style.display = 'none'; // Esconde o botão se a API não for suportada
    }

    // === Funções de Persistência ===
    const saveExpenses = () => localStorage.setItem('reis_expenses', JSON.stringify(expenses));
    const loadExpenses = () => {
        const storedExpenses = localStorage.getItem('reis_expenses');
        expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
    };
    const saveFixedExpenses = () => localStorage.setItem('reis_fixed_expenses', JSON.stringify(fixedExpenses));
    const loadFixedExpenses = () => {
        const stored = localStorage.getItem('reis_fixed_expenses');
        fixedExpenses = stored ? JSON.parse(stored) : [];
    };
    const saveTheme = () => localStorage.setItem('reis_theme', currentTheme);
    const loadTheme = () => {
        const storedTheme = localStorage.getItem('reis_theme') || 'light';
        setTheme(storedTheme);
    };

    // === Funções de Renderização ===
    const renderExpenses = () => {
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
    };
    
    const renderFixedExpenses = () => {
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
    };
    
    const renderSummary = () => {
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

        renderChart(byCategory);
        analyzeBtn.disabled = monthlyExpenses.length === 0;
    };

    const renderChart = (dataByCategory) => {
        const chartContainer = document.querySelector('.chart-container');
        const ctx = document.getElementById('expense-chart').getContext('2d');
        const labels = Object.keys(dataByCategory);
        const data = Object.values(dataByCategory);

        if (expenseChart) expenseChart.destroy();
        
        if (labels.length === 0) {
            chartContainer.style.display = 'none';
            return;
        }
        chartContainer.style.display = 'block';

        expenseChart = new Chart(ctx, {
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
    };

    // === Funções de Lógica ===
    const setTheme = (theme) => {
        currentTheme = theme;
        document.documentElement.className = theme === 'dark' ? 'dark-theme' : '';
        themeToggleBtn.innerHTML = theme === 'dark' ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>` : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        saveTheme();
        renderSummary();
    };

    const toggleTheme = () => setTheme(currentTheme === 'light' ? 'dark' : 'light');

    const showModal = () => {
        expenseForm.reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        document.getElementById('expense-id').value = '';
        document.getElementById('modal-title').textContent = 'Nova Despesa';
        expenseModal.style.display = 'flex';
        document.getElementById('value').focus();
    };
    const hideModal = () => expenseModal.style.display = 'none';

    const showConfirm = (callback) => {
        confirmCallback = callback;
        confirmModal.style.display = 'flex';
    };
    const hideConfirm = () => {
        confirmCallback = null;
        confirmModal.style.display = 'none';
    };

    const addOrUpdateExpense = (e) => {
        e.preventDefault();
        const expenseData = {
            value: document.getElementById('value').value,
            category: document.getElementById('category').value,
            date: document.getElementById('date').value,
            observation: document.getElementById('observation').value.trim(),
            id: document.getElementById('expense-id').value || Date.now().toString(),
        };
        
        const existingIndex = expenses.findIndex(exp => exp.id === expenseData.id);
        if (existingIndex > -1) expenses[existingIndex] = expenseData;
        else expenses.push(expenseData);

        saveExpenses();
        renderAll();
        hideModal();
    };
    
    const deleteExpense = (id) => {
        showConfirm(() => {
            expenses = expenses.filter(exp => exp.id !== id);
            saveExpenses();
            renderAll();
        });
    };

    const addFixedExpense = (e) => {
        e.preventDefault();
        const newFixed = {
            id: Date.now().toString(),
            description: document.getElementById('fixed-description').value,
            value: document.getElementById('fixed-value').value,
            category: document.getElementById('fixed-category').value,
            dueDay: parseInt(document.getElementById('fixed-due-day').value)
        };
        fixedExpenses.push(newFixed);
        saveFixedExpenses();
        renderFixedExpenses();
        hideFixedExpenseModal();
    };
    const deleteFixedExpense = (id) => {
        fixedExpenses = fixedExpenses.filter(exp => exp.id !== id);
        saveFixedExpenses();
        renderFixedExpenses();
    };

    const showFixedExpenseModal = () => {
        fixedExpenseForm.reset();
        fixedExpenseModal.style.display = 'flex';
        document.getElementById('fixed-description').focus();
    };
    const hideFixedExpenseModal = () => fixedExpenseModal.style.display = 'none';

    const switchView = (viewId) => {
        views.forEach(view => view.classList.remove('active'));
        tabs.forEach(tab => tab.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        document.querySelector(`.tab[data-view="${viewId}"]`).classList.add('active');
    };

    // === Lógica de Reconhecimento de Voz ===
    const handleVoiceCommand = () => {
        if (!isRecognitionAvailable) return;
        micFeedback.textContent = "Ouvindo... por favor, fale o comando.";
        micFeedback.style.color = 'var(--text-muted-color)';
        micFeedback.style.display = 'block';
        addExpenseMicBtn.classList.add('is-listening');
        addExpenseMicBtn.disabled = true;
        recognition.start();
    };

    const parseAndFillForm = (transcript) => {
        const regex = /(?:lançar|gastei|registrar|anotar)\s+(\d+(?:[.,]\d+)?)\s*(?:reais|real)?\s+em\s+([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+)(?:\s+para\s+(.+))?/i;
        const match = transcript.match(regex);

        if (match) {
            const value = match[1].replace(',', '.');
            const category = match[2].toLowerCase();
            const observation = match[3] || '';
            const categoryOptions = Array.from(document.querySelectorAll('#category option'));
            const foundOption = categoryOptions.find(opt => opt.value.toLowerCase() === category);
            
            if (foundOption) {
                showModal();
                document.getElementById('value').value = value;
                document.getElementById('category').value = foundOption.value;
                document.getElementById('observation').value = observation.trim();
                micFeedback.textContent = "Comando reconhecido! Conclua e salve.";
                micFeedback.style.color = 'var(--color-primary)';
            } else {
                micFeedback.textContent = `Categoria "${match[2]}" não foi encontrada.`;
                micFeedback.style.color = 'var(--color-danger)';
            }
        } else {
            micFeedback.textContent = "Não entendi o comando. Ex: 'lançar 50 reais em Lazer para cinema";
            micFeedback.style.color = 'var(--color-danger)';
        }
    };

    if(isRecognitionAvailable){
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            parseAndFillForm(transcript);
        };
        recognition.onerror = (event) => {
            let errorMessage = 'Ocorreu um erro no reconhecimento.';
            if (event.error === 'no-speech') errorMessage = 'Não ouvi nada. Tente novamente.';
            else if (event.error === 'not-allowed') errorMessage = 'A permissão para o microfone foi negada.';
            micFeedback.textContent = errorMessage;
            micFeedback.style.color = 'var(--color-danger)';
        };
        recognition.onend = () => {
            addExpenseMicBtn.classList.remove('is-listening');
            addExpenseMicBtn.disabled = false;
            setTimeout(() => { if(micFeedback) micFeedback.style.display = 'none'; }, 5000);
        };
    }

    const getExpenseAnalysis = async () => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyExpenses = expenses.filter(exp => new Date(exp.date + 'T00:00:00-03:00') >= firstDayOfMonth);

        if (monthlyExpenses.length === 0) {
            analysisContent.textContent = "Não há despesas suficientes este mês para uma análise.";
            analysisContainer.style.display = 'block';
            return;
        }

        analysisContent.innerHTML = `<span class="loading-spinner"></span> A analisar os seus gastos...`;
        analysisContainer.style.display = 'block';
        analyzeBtn.disabled = true;

        const byCategory = monthlyExpenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.value);
            return acc;
        }, {});
        
        let promptData = "Estas são as minhas despesas totais por categoria para o mês atual (em Reais Brasileiros):\n";
        for (const category in byCategory) promptData += `- ${category}: R$ ${byCategory[category].toFixed(2)}\n`;
        
        const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.value), 0);
        promptData += `\nTotal de Despesas do Mês: R$ ${totalExpenses.toFixed(2)}\n\n`;
        promptData += "Forneça uma breve análise (2-4 frases) dos meus hábitos de consumo este mês, destacando as categorias mais significativas. Ofereça uma ou duas sugestões concisas e práticas para otimizar os meus gastos. Seja amigável e direto. Use a moeda Real Brasileiro (R$) quando mencionar valores.";

        const payload = { contents: [{ role: "user", parts: [{ text: promptData }] }] };
        const apiKey = (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) ? process.env.GEMINI_API_KEY : ""; // Para compatibilidade
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
            
            const result = await response.json();
            const text = result.candidates[0].content.parts[0].text;
            analysisContent.textContent = text;
        } catch (error) {
            console.error("Erro na API Gemini:", error);
            analysisContent.textContent = `Ocorreu um erro ao obter a análise. Tente novamente mais tarde. (${error.message})`;
        } finally {
            analyzeBtn.disabled = false;
        }
    };
    
    // === Inicialização ===
    const renderAll = () => {
        renderExpenses();
        renderFixedExpenses();
        renderSummary();
        analysisContainer.style.display = 'none';
    };

    const init = () => {
        loadTheme();
        loadExpenses();
        loadFixedExpenses();
        renderAll();

        // Listeners de eventos
        themeToggleBtn.addEventListener('click', toggleTheme);
        addExpenseBtn.addEventListener('click', showModal);
        cancelBtn.addEventListener('click', hideModal);
        expenseForm.addEventListener('submit', addOrUpdateExpense);
        analyzeBtn.addEventListener('click', getExpenseAnalysis);
        if(isRecognitionAvailable) addExpenseMicBtn.addEventListener('click', handleVoiceCommand);
        
        confirmOkBtn.addEventListener('click', () => {
            if (confirmCallback) confirmCallback();
            hideConfirm();
        });
        confirmCancelBtn.addEventListener('click', hideConfirm);

        tabs.forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.view)));
        
        window.addEventListener('click', (e) => {
            if (e.target === expenseModal) hideModal();
            if (e.target === confirmModal) hideConfirm();
        });

        addFixedExpenseBtn.addEventListener('click', showFixedExpenseModal);
        fixedCancelBtn.addEventListener('click', hideFixedExpenseModal);
        fixedExpenseForm.addEventListener('submit', addFixedExpense);
    };

    init();
});
