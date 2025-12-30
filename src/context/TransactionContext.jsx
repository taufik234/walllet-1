import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialTransactions } from '../data/mockData';

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

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'
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

            // 3. Search Filter
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                t.note?.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query) ||
                t.amount.toString().includes(query);

            return matchesDate && matchesType && matchesSearch;
        });
    }, [transactions, dateFilter, typeFilter, searchQuery]);

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
            // If deleting the last one, maybe keep empty object
            return newBudgets;
        });
    };

    const budgetStats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

        const currentMonthTransactions = transactions.filter(t =>
            t.type === 'expense' && t.date.startsWith(currentMonth)
        );

        const status = Object.keys(budgets).map(category => {
            const limit = budgets[category];
            const spent = currentMonthTransactions
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
    }, [transactions, budgets]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const openModal = (transaction = null) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const value = {
        // Transactions
        transactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
        stats,
        groupedTransactions, // The filtered & grouped result

        // Filters
        searchQuery, setSearchQuery,
        typeFilter, setTypeFilter,
        dateFilter, setDateFilter,

        // Budget
        budgets,
        updateBudget,
        deleteBudget,
        budgetStats,

        // Modal
        isModalOpen,
        editingTransaction,
        openModal,
        closeModal
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};
