import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialTransactions, WALLETS } from '../data/mockData';

const TransactionContext = createContext();

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};

export const TransactionProvider = ({ children }) => {
    // Transaction State
    const [transactions, setTransactions] = useState(initialTransactions);

    const addTransaction = (transaction) => {
        setTransactions(prev => [
            {
                ...transaction,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                date: transaction.date || new Date().toISOString().split('T')[0]
            },
            ...prev
        ]);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const editTransaction = (id, updatedData) => {
        setTransactions(prev => prev.map(t =>
            t.id === id ? { ...t, ...updatedData } : t
        ));
    };

    // Stats Calculation
    const stats = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        return {
            totalBalance: income - expense,
            totalIncome: income,
            totalExpense: expense
        };
    }, [transactions]);

    // Wallet Stats Calculation
    const walletStats = useMemo(() => {
        const stats = {};
        // Initialize with 0
        WALLETS.forEach(w => stats[w.id] = 0);

        // Calculate totals
        transactions.forEach(t => {
            const walletId = t.wallet || 'cash';
            const amount = Number(t.amount);
            if (t.type === 'income') {
                stats[walletId] = (stats[walletId] || 0) + amount;
            } else {
                stats[walletId] = (stats[walletId] || 0) - amount;
            }
        });

        return stats; // Returns object { cash: 1000, bank: 5000, ... }
    }, [transactions]);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'
    const [walletFilter, setWalletFilter] = useState('all'); // 'all', 'cash', 'bank', 'ewallet'
    const [dateFilter, setDateFilter] = useState({
        day: '',
        month: '',
        year: ''
    });

    // Filtering Logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const [tYear, tMonth, tDay] = t.date.split('-'); // YYYY-MM-DD

            // 1. Date Filter
            const matchesYear = !dateFilter.year || tYear === dateFilter.year;
            const matchesMonth = !dateFilter.month || tMonth === dateFilter.month;
            const matchesDay = !dateFilter.day || tDay === dateFilter.day;
            const matchesDate = matchesYear && matchesMonth && matchesDay;

            // 2. Type Filter
            const matchesType = typeFilter === 'all' || t.type === typeFilter;

            // 3. Wallet Filter (New)
            // Handle legacy data with no wallet by defaulting to 'cash' if needed, or loosely matching
            const tWallet = t.wallet || 'cash';
            const matchesWallet = walletFilter === 'all' || tWallet === walletFilter;

            // 4. Search Filter
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                t.note?.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query) ||
                t.amount.toString().includes(query);

            return matchesDate && matchesType && matchesSearch && matchesWallet;
        });
    }, [transactions, dateFilter, typeFilter, walletFilter, searchQuery]);

    // Grouping Logic (for List View)
    const groupedTransactions = useMemo(() => {
        const grouped = {};
        filteredTransactions.forEach(transaction => {
            const date = transaction.date;
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(transaction);
        });
        return grouped;
    }, [filteredTransactions]);

    // Budget State & Logic
    const [budgets, setBudgets] = useState({
        makan: 1000000,
        transport: 500000,
        belanja: 1000000,
        hiburan: 200000
    });

    // Budget Cycle State (Default: 1st of current month)
    const getStartOfMonth = () => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    };

    const [budgetCycle, setBudgetCycle] = useState(getStartOfMonth());

    const resetBudget = () => {
        // Set cycle start to TODAY
        setBudgetCycle(new Date().toISOString().split('T')[0]);
    };

    const updateBudget = (category, limit) => {
        setBudgets(prev => ({
            ...prev,
            [category]: limit
        }));
    };

    const deleteBudget = (category) => {
        setBudgets(prev => {
            const newBudgets = { ...prev };
            delete newBudgets[category];
            return newBudgets;
        });
    };

    const budgetStats = useMemo(() => {
        // Filter transactions starting from budgetCycle date
        // AND usually constrained to current month/limit? 
        // For simple "Monthly" budget, let's say it tracks from cycleStart until now (or forever if we don't cap).
        // Let's constrain it to "Transactions within the active cycle".
        // If I reset on Jan 15, should it count Jan 15 to Feb 15? Or Jan 15 to Jan 31?
        // User said "Reset otomatis (monthly) atau manual".
        // Let's assume standard behavior is CURRENT MONTH.
        // Manual reset just moves the "Start Date" forward for this month.

        const cycleDate = new Date(budgetCycle);
        const cycleMonth = cycleDate.getMonth();
        const cycleYear = cycleDate.getFullYear();

        // Safety check: If stored cycle is from a PAST month, auto-reset to 1st of Current Month
        // (This handles the "Automatic" part implicitly when entering a new month)
        // Actually, we need to enforce this logic or use a derived value.

        const now = new Date();
        let effectiveStart = budgetCycle;

        if (now.getMonth() !== cycleMonth || now.getFullYear() !== cycleYear) {
            // Cycle is stale (from prev month), use 1st of current month
            // We won't update state during render, just use derived date
            const firstOfMonth = new Date();
            firstOfMonth.setDate(1);
            effectiveStart = firstOfMonth.toISOString().split('T')[0];
        }

        const currentTransactions = transactions.filter(t =>
            t.type === 'expense' &&
            t.date >= effectiveStart
        );

        const status = Object.keys(budgets).map(category => {
            const limit = budgets[category];
            const spent = currentTransactions
                .filter(t => t.category.toLowerCase() === category.toLowerCase())
                .reduce((acc, curr) => acc + Number(curr.amount), 0);

            return {
                category,
                limit,
                spent,
                percentage: Math.min((spent / limit) * 100, 100),
                remaining: limit - spent,
                isOver: spent > limit
            };
        });

        return status.sort((a, b) => b.percentage - a.percentage);
    }, [transactions, budgets, budgetCycle]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isPreset, setIsPreset] = useState(false);

    const openModal = (transaction = null, preset = false) => {
        setEditingTransaction(transaction);
        setIsPreset(preset);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        setIsPreset(false);
    };

    const value = {
        // Transactions
        transactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
        stats,
        groupedTransactions, // Keep for backward compat if needed, or remove if unused
        filteredTransactions, // Export for Pagination

        // Filters
        searchQuery, setSearchQuery,
        typeFilter, setTypeFilter,
        dateFilter, setDateFilter,
        walletFilter, setWalletFilter,

        // Budget
        budgets,
        updateBudget,
        deleteBudget,
        resetBudget, // Export this
        budgetStats,

        // Wallet
        walletStats,

        // Modal
        isModalOpen,
        editingTransaction,
        isPreset, // Export this
        openModal,
        closeModal
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};
