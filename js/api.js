/**
 * Serviço de API - Simulação com localStorage
 * 
 * Este arquivo simula uma API usando localStorage.
 * Quando integrar com back-end real, substitua as funções
 * por chamadas fetch() para os endpoints da API.
 */

const API_BASE_URL = 'http://localhost:8000/api'; // Configure aqui a URL do seu back-end

// Inicializa dados mockados se não existirem
function initMockData() {
  if (!localStorage.getItem('transactions')) {
    const mockTransactions = [
      {
        id: '1',
        description: 'Salário',
        amount: 5000,
        type: 'income',
        category: 'Trabalho',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        description: 'Mercado',
        amount: 236.50,
        type: 'expense',
        category: 'Alimentação',
        date: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        description: 'Aluguel',
        amount: 1200,
        type: 'expense',
        category: 'Moradia',
        date: new Date(Date.now() - 172800000).toISOString(),
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '4',
        description: 'Freelance',
        amount: 800,
        type: 'income',
        category: 'Trabalho',
        date: new Date(Date.now() - 259200000).toISOString(),
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];
    localStorage.setItem('transactions', JSON.stringify(mockTransactions));
  }
  
  if (!localStorage.getItem('notifications')) {
    const mockNotifications = [
      {
        id: '1',
        title: 'Depósito recebido',
        message: 'Você recebeu um depósito de R$ 5.000,00',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '2',
        title: 'Pagamento realizado',
        message: 'Pagamento de R$ 236,50 foi processado',
        read: false,
        createdAt: new Date(Date.now() - 18000000).toISOString()
      },
      {
        id: '3',
        title: 'Lembrete de fatura',
        message: 'Sua fatura vence em 3 dias',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    localStorage.setItem('notifications', JSON.stringify(mockNotifications));
  }
  
  if (!localStorage.getItem('balance')) {
    localStorage.setItem('balance', '4363.50');
  }
}

// Autenticação
const authAPI = {
  async login(username, password) {
    // Simulação - substitua por chamada real à API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && password) {
          const token = 'mock-jwt-token-' + Date.now();
          const user = {
            id: '1',
            username: username,
            email: username + '@email.com'
          };
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(user));
          initMockData();
          resolve({ token, user });
        } else {
          reject(new Error('Credenciais inválidas'));
        }
      }, 500);
    });
    
    /* Exemplo de integração real:
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Erro no login');
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
    */
  },
  
  async resetPassword(email) {
    // Simulação - substitua por chamada real à API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Email de recuperação enviado com sucesso' });
      }, 500);
    });
  },
  
  async register(userData) {
    // Simulação - substitua por chamada real à API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verifica se o email já existe
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const emailExists = users.some(u => u.email === userData.email);
        const cpfExists = users.some(u => u.cpf === userData.cpf);
        
        if (emailExists) {
          reject(new Error('Este email já está cadastrado'));
          return;
        }
        
        if (cpfExists) {
          reject(new Error('Este CPF já está cadastrado'));
          return;
        }
        
        const newUser = {
          id: generateId(),
          ...userData,
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        const token = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(newUser));
        initMockData();
        
        resolve({ token, user: newUser });
      }, 800);
    });
    
    /* Exemplo de integração real:
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Erro no cadastro');
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
    */
  }
};

// Transações
const transactionsAPI = {
  async getAll() {
    // Simulação - substitua por chamada real à API
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    /* Exemplo de integração real:
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
    */
  },
  
  async create(transaction) {
    // Simulação - substitua por chamada real à API
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const newTransaction = {
      id: generateId(),
      ...transaction,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Atualiza saldo
    const currentBalance = parseFloat(localStorage.getItem('balance') || '0');
    const newBalance = transaction.type === 'income' 
      ? currentBalance + transaction.amount 
      : currentBalance - transaction.amount;
    localStorage.setItem('balance', newBalance.toString());
    
    return newTransaction;
  },
  
  async update(id, data) {
    // Simulação - substitua por chamada real à API
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      // Ajusta o saldo removendo o valor antigo
      const oldTransaction = transactions[index];
      let currentBalance = parseFloat(localStorage.getItem('balance') || '0');
      if (oldTransaction.type === 'income') {
        currentBalance -= oldTransaction.amount;
      } else {
        currentBalance += oldTransaction.amount;
      }
      
      // Atualiza a transação
      transactions[index] = { ...transactions[index], ...data, updatedAt: new Date().toISOString() };
      
      // Adiciona o novo valor ao saldo
      if (transactions[index].type === 'income') {
        currentBalance += transactions[index].amount;
      } else {
        currentBalance -= transactions[index].amount;
      }
      
      localStorage.setItem('transactions', JSON.stringify(transactions));
      localStorage.setItem('balance', currentBalance.toString());
      return transactions[index];
    }
    throw new Error('Transação não encontrada');
  },
  
  async delete(id) {
    // Simulação - substitua por chamada real à API
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      // Ajusta o saldo
      let currentBalance = parseFloat(localStorage.getItem('balance') || '0');
      if (transaction.type === 'income') {
        currentBalance -= transaction.amount;
      } else {
        currentBalance += transaction.amount;
      }
      localStorage.setItem('balance', currentBalance.toString());
      
      const filtered = transactions.filter(t => t.id !== id);
      localStorage.setItem('transactions', JSON.stringify(filtered));
      return { message: 'Transação deletada com sucesso' };
    }
    throw new Error('Transação não encontrada');
  }
};

// Conta
const accountAPI = {
  async getBalance() {
    // Simulação - substitua por chamada real à API
    const balance = parseFloat(localStorage.getItem('balance') || '0');
    return { balance };
  },
  
  async deposit(amount) {
    // Simulação - substitua por chamada real à API
    const currentBalance = parseFloat(localStorage.getItem('balance') || '0');
    const newBalance = currentBalance + amount;
    localStorage.setItem('balance', newBalance.toString());
    
    // Cria transação de depósito
    await transactionsAPI.create({
      description: 'Depósito',
      amount: amount,
      type: 'income',
      category: 'Depósito'
    });
    
    return { balance: newBalance };
  },
  
  async transfer(recipient, amount) {
    // Simulação - substitua por chamada real à API
    const currentBalance = parseFloat(localStorage.getItem('balance') || '0');
    if (currentBalance < amount) {
      throw new Error('Saldo insuficiente');
    }
    const newBalance = currentBalance - amount;
    localStorage.setItem('balance', newBalance.toString());
    
    // Cria transação de transferência
    await transactionsAPI.create({
      description: `Transferência para ${recipient}`,
      amount: amount,
      type: 'expense',
      category: 'Transferência'
    });
    
    return { balance: newBalance };
  }
};

// Notificações
const notificationsAPI = {
  async getAll() {
    // Simulação - substitua por chamada real à API
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  async markAsRead(id) {
    // Simulação - substitua por chamada real à API
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      localStorage.setItem('notifications', JSON.stringify(notifications));
      return notification;
    }
    throw new Error('Notificação não encontrada');
  },
  
  async markAllAsRead() {
    // Simulação - substitua por chamada real à API
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.forEach(n => n.read = true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    return { message: 'Todas as notificações foram marcadas como lidas' };
  }
};

// Estatísticas
const statsAPI = {
  async getMonthlySummary() {
    // Simulação - substitua por chamada real à API
    const transactions = await transactionsAPI.getAll();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Dados diários para o gráfico (últimos 7 dias)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayTransactions = monthlyTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === date.toDateString();
      });
      const dayTotal = dayTransactions.reduce((sum, t) => {
        return sum + (t.type === 'expense' ? t.amount : 0);
      }, 0);
      dailyData.push({
        day: date.getDay(),
        amount: dayTotal
      });
    }
    
    return {
      month: currentMonth + 1,
      year: currentYear,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      dailyData
    };
  },
  
  async getCategoryStats() {
    // Simulação - substitua por chamada real à API
    const transactions = await transactionsAPI.getAll();
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(t => {
      const category = t.category || 'Outros';
      categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
    });
    
    const totalExpense = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    const categories = Object.entries(categoryTotals).map(([name, total]) => ({
      name,
      totalExpense: total,
      percentage: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0
    }));
    
    return { categories: categories.sort((a, b) => b.totalExpense - a.totalExpense) };
  }
};

// Categorias
const categoriesAPI = {
  async getAll() {
    // Simulação - substitua por chamada real à API
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    if (categories.length === 0) {
      // Categorias padrão
      const defaultCategories = [
        { id: '1', name: 'Alimentação', icon: '🍔', color: '#ff6b6b', type: 'expense' },
        { id: '2', name: 'Transporte', icon: '🚗', color: '#4ecdc4', type: 'expense' },
        { id: '3', name: 'Moradia', icon: '🏠', color: '#45b7d1', type: 'expense' },
        { id: '4', name: 'Saúde', icon: '⚕️', color: '#96ceb4', type: 'expense' },
        { id: '5', name: 'Educação', icon: '📚', color: '#ffeaa7', type: 'expense' },
        { id: '6', name: 'Lazer', icon: '🎮', color: '#dfe6e9', type: 'expense' },
        { id: '7', name: 'Compras', icon: '🛍️', color: '#fd79a8', type: 'expense' },
        { id: '8', name: 'Contas', icon: '💳', color: '#fdcb6e', type: 'expense' },
        { id: '9', name: 'Salário', icon: '💼', color: '#00b894', type: 'income' },
        { id: '10', name: 'Freelance', icon: '💻', color: '#00cec9', type: 'income' },
        { id: '11', name: 'Investimentos', icon: '📈', color: '#0984e3', type: 'income' },
        { id: '12', name: 'Outros', icon: '💵', color: '#636e72', type: 'both' }
      ];
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return categories;
  },
  
  async create(category) {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const newCategory = {
      id: generateId(),
      ...category,
      createdAt: new Date().toISOString()
    };
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    return newCategory;
  },
  
  async update(id, data) {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('categories', JSON.stringify(categories));
      return categories[index];
    }
    throw new Error('Categoria não encontrada');
  },
  
  async delete(id) {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem('categories', JSON.stringify(filtered));
    return { message: 'Categoria deletada com sucesso' };
  }
};

// Metas Financeiras
const goalsAPI = {
  async getAll() {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    return goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  async create(goal) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const newGoal = {
      id: generateId(),
      ...goal,
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
    return newGoal;
  },
  
  async update(id, data) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const index = goals.findIndex(g => g.id === id);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('goals', JSON.stringify(goals));
      return goals[index];
    }
    throw new Error('Meta não encontrada');
  },
  
  async delete(id) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const filtered = goals.filter(g => g.id !== id);
    localStorage.setItem('goals', JSON.stringify(filtered));
    return { message: 'Meta deletada com sucesso' };
  },
  
  async addProgress(id, amount) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const goal = goals.find(g => g.id === id);
    if (goal) {
      goal.currentAmount = (goal.currentAmount || 0) + amount;
      goal.updatedAt = new Date().toISOString();
      localStorage.setItem('goals', JSON.stringify(goals));
      return goal;
    }
    throw new Error('Meta não encontrada');
  }
};

// Despesas Recorrentes
const recurringAPI = {
  async getAll() {
    const recurring = JSON.parse(localStorage.getItem('recurring') || '[]');
    return recurring.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  async create(recurringData) {
    const recurring = JSON.parse(localStorage.getItem('recurring') || '[]');
    const newRecurring = {
      id: generateId(),
      ...recurringData,
      active: true,
      lastGenerated: null,
      createdAt: new Date().toISOString()
    };
    recurring.push(newRecurring);
    localStorage.setItem('recurring', JSON.stringify(recurring));
    return newRecurring;
  },
  
  async update(id, data) {
    const recurring = JSON.parse(localStorage.getItem('recurring') || '[]');
    const index = recurring.findIndex(r => r.id === id);
    if (index !== -1) {
      recurring[index] = { ...recurring[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('recurring', JSON.stringify(recurring));
      return recurring[index];
    }
    throw new Error('Recorrência não encontrada');
  },
  
  async delete(id) {
    const recurring = JSON.parse(localStorage.getItem('recurring') || '[]');
    const filtered = recurring.filter(r => r.id !== id);
    localStorage.setItem('recurring', JSON.stringify(filtered));
    return { message: 'Recorrência deletada com sucesso' };
  },
  
  async toggle(id) {
    const recurring = JSON.parse(localStorage.getItem('recurring') || '[]');
    const item = recurring.find(r => r.id === id);
    if (item) {
      item.active = !item.active;
      item.updatedAt = new Date().toISOString();
      localStorage.setItem('recurring', JSON.stringify(recurring));
      return item;
    }
    throw new Error('Recorrência não encontrada');
  },
  
  async generatePending() {
    const recurring = JSON.parse(localStorage.getItem('recurring') || '[]');
    const now = new Date();
    const generated = [];
    
    for (const item of recurring) {
      if (!item.active) continue;
      
      const lastGen = item.lastGenerated ? new Date(item.lastGenerated) : new Date(item.createdAt);
      let shouldGenerate = false;
      
      switch (item.frequency) {
        case 'daily':
          shouldGenerate = (now - lastGen) >= 86400000; // 1 dia
          break;
        case 'weekly':
          shouldGenerate = (now - lastGen) >= 604800000; // 7 dias
          break;
        case 'monthly':
          shouldGenerate = now.getMonth() !== lastGen.getMonth() || now.getFullYear() !== lastGen.getFullYear();
          break;
        case 'yearly':
          shouldGenerate = now.getFullYear() !== lastGen.getFullYear();
          break;
      }
      
      if (shouldGenerate) {
        const transaction = await transactionsAPI.create({
          description: item.description + ' (Recorrente)',
          amount: item.amount,
          type: item.type,
          category: item.category,
          recurring: true,
          recurringId: item.id
        });
        
        item.lastGenerated = now.toISOString();
        generated.push(transaction);
      }
    }
    
    localStorage.setItem('recurring', JSON.stringify(recurring));
    return generated;
  }
};

// Inicializa dados mockados ao carregar
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('authToken');
  if (token) {
    initMockData();
  }
}

