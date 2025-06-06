# 💸 Réis – Controle de Finança Pessoal

**Réis** é um aplicativo simples, leve e 100% offline para controle de finanças pessoais. Inspirado na primeira moeda oficial do Brasil, ele oferece uma gestão moderna, minimalista e sem distrações — ideal para quem quer registrar seus gastos de forma prática e segura.

---

## ✨ Funcionalidades

- ✅ Registro rápido de despesas (valor, categoria e descrição)
- ✅ Histórico de lançamentos com data
- ✅ Saldo acumulado automaticamente
- ✅ Armazenamento local com `localStorage`
- 🔐 Senhas armazenadas como hash SHA-256 (apenas proteção básica)
- ✅ Interface limpa, responsiva e sem anúncios
- ✅ Exportação de dados em CSV
- ✅ Importação de dados via CSV

---

## ⚠️ Segurança

Todas as informações ficam gravadas apenas no seu navegador por meio do `localStorage`.
O hash SHA-256 das senhas serve apenas como uma proteção simples e **não** deve ser
considerado uma criptografia forte.

---

## 🚀 Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript Vanilla**
- **LocalStorage** (persistência de dados no navegador)

---

## 📦 Como Usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/BrunoMNoronha/reis.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd reis
   ```

3. Abra o arquivo `index.html` diretamente no navegador.

### Restaurar dados de um CSV

1. No menu **Configurações**, clique em **Importar CSV**.
2. Selecione o arquivo exportado anteriormente.
3. As transações serão carregadas imediatamente no histórico.

---

## 📈 Em breve

- 📊 Gráficos interativos com Chart.js
- 🔐 Proteção com PIN
- 🌙 Tema escuro automático
- ☁️ Backup e restauração local

---

## 📝 Estrutura de itens recorrentes

Para automações de lançamento, cada objeto salvo na chave `recurring` do
`localStorage` deve conter os seguintes campos:

- `id`: identificador único gerado pelo app;
- `description`: texto descritivo da transação;
- `amount`: valor numérico em reais;
- `category`: uma das categorias suportadas (ex: `food`, `bills`);
- `type`: `'income'` ou `'expense'`;
- `startDate`: data inicial no formato `YYYY-MM-DD`;
- `frequency`: `'weekly'`, `'monthly'` ou `'annually'`.

---

## 🖼️ Capturas de Tela *(opcional)*

> _Você pode adicionar aqui imagens ou GIFs demonstrando o funcionamento do app._

---

## 📜 Licença

Distribuído sob a licença [MIT](LICENSE).
Sinta-se livre para usar, editar e compartilhar! 🤝

---

**Desenvolvido com ♥ no Brasil 🇧🇷**
