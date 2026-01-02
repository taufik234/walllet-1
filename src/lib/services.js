import { supabase } from './supabase';

// ============================================
// AUTH SERVICES
// ============================================
export const authService = {
    async signUp(email, password, name) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });
        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    async getUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return data.user;
    },

    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    },
};

// ============================================
// TRANSACTION SERVICES
// ============================================
export const transactionService = {
    async list({ type, walletId, startDate, endDate, limit = 100 } = {}) {
        let query = supabase
            .from('transactions')
            .select('*, wallet:wallets(*), category:categories(*)')
            .order('date', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(limit);

        if (type) query = query.eq('type', type);
        if (walletId) query = query.eq('wallet_id', walletId);
        if (startDate) query = query.gte('date', startDate);
        if (endDate) query = query.lte('date', endDate);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async create(transaction) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('transactions')
            .insert({ ...transaction, user_id: user.id })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('transactions')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};

// ============================================
// WALLET SERVICES
// ============================================
export const walletService = {
    async list() {
        const { data, error } = await supabase
            .from('wallets')
            .select('*')
            .order('created_at');
        if (error) throw error;
        return data;
    },

    async getBalances() {
        const wallets = await this.list();
        const transactions = await transactionService.list();

        const balances = {};
        wallets.forEach(w => {
            const initial = parseFloat(w.initial_balance) || 0;
            const walletTx = transactions.filter(t => t.wallet_id === w.id);
            const income = walletTx.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
            const expense = walletTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
            balances[w.id] = initial + income - expense;
        });

        return balances;
    },

    async create(wallet) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('wallets')
            .insert({ ...wallet, user_id: user.id })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('wallets')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('wallets')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async adjustBalance(walletId, newBalance) {
        const balances = await this.getBalances();
        const currentBalance = balances[walletId] || 0;
        const difference = newBalance - currentBalance;

        if (difference === 0) return;

        await transactionService.create({
            wallet_id: walletId,
            type: difference > 0 ? 'income' : 'expense',
            amount: Math.abs(difference),
            date: new Date().toISOString().split('T')[0],
            note: 'Penyesuaian Saldo Manual',
        });
    },
};

// ============================================
// CATEGORY SERVICES
// ============================================
export const categoryService = {
    async list(type = null) {
        let query = supabase.from('categories').select('*').order('name');
        if (type) query = query.eq('type', type);
        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async getGrouped() {
        const all = await this.list();
        return {
            income: all.filter(c => c.type === 'income'),
            expense: all.filter(c => c.type === 'expense'),
        };
    },
};

// ============================================
// BUDGET SERVICES
// ============================================
export const budgetService = {
    async list() {
        const { data, error } = await supabase
            .from('budgets')
            .select('*, category:categories(*)')
            .order('created_at');
        if (error) throw error;
        return data;
    },

    async getWithStats() {
        const budgets = await this.list();
        const transactions = await transactionService.list({ type: 'expense' });

        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

        return budgets.map(b => {
            let effectiveStart = b.cycle_start;
            const cycleDate = new Date(b.cycle_start);
            if (now.getMonth() !== cycleDate.getMonth() || now.getFullYear() !== cycleDate.getFullYear()) {
                effectiveStart = firstOfMonth;
            }

            const spent = transactions
                .filter(t => t.category_id === b.category_id && t.date >= effectiveStart)
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            const limit = parseFloat(b.limit_amount);
            const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

            return {
                ...b,
                categoryName: b.category?.name || 'Unknown',
                spent,
                percentage,
                remaining: limit - spent,
                isOver: spent > limit,
            };
        }).sort((a, b) => b.percentage - a.percentage);
    },

    async create(budget) {
        const { data: { user } } = await supabase.auth.getUser();
        const cycleStart = budget.cycle_start || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('budgets')
            .insert({ ...budget, cycle_start: cycleStart, user_id: user.id })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('budgets')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async resetCycle() {
        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
            .from('budgets')
            .update({ cycle_start: today, updated_at: new Date().toISOString() });
        if (error) throw error;
    },
};

// ============================================
// STATS SERVICES
// ============================================
export const statsService = {
    async getSummary(startDate = null, endDate = null) {
        const transactions = await transactionService.list({ startDate, endDate });

        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        return {
            totalBalance: income - expense,
            totalIncome: income,
            totalExpense: expense,
        };
    },

    async getByCategory(startDate = null, endDate = null) {
        const transactions = await transactionService.list({ type: 'expense', startDate, endDate });

        const grouped = {};
        transactions.forEach(t => {
            const catId = t.category_id || 'unknown';
            const catName = t.category?.name || 'Lainnya';
            if (!grouped[catId]) {
                grouped[catId] = { categoryId: catId, categoryName: catName, amount: 0 };
            }
            grouped[catId].amount += parseFloat(t.amount);
        });

        const result = Object.values(grouped).sort((a, b) => b.amount - a.amount);
        const total = result.reduce((sum, r) => sum + r.amount, 0);

        return result.map(r => ({
            ...r,
            percentage: total > 0 ? (r.amount / total) * 100 : 0,
        }));
    },
};
