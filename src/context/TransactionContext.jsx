import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    transactionService,
    walletService,
    budgetService,
    categoryService,
    goalService
} from '../lib/services';
import { supabase } from '../lib/supabase';

const TransactionContext = createContext();

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};

export const TransactionProvider = ({ children }) => {
    const { user } = useAuth();

    // Theme State (Default to Dark)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Data States
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [categories, setCategories] = useState({ income: [], expense: [] });
    const [budgets, setBudgets] = useState([]);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all data from Supabase
    const fetchData = useCallback(async () => {
        if (!user) {
            setTransactions([]);
            setWallets([]);
            setBudgets([]);
            setGoals([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const [txData, walletData, catData, budgetData, goalData] = await Promise.all([
                transactionService.list(),
                walletService.list(),
                categoryService.getGrouped(),
                budgetService.getWithStats(),
                goalService.list(),
            ]);

            setTransactions(txData || []);
            setWallets(walletData || []);
            setCategories(catData || { income: [], expense: [] });
            setBudgets(budgetData || []);
            setGoals(goalData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch data when user changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Realtime Subscription
    useEffect(() => {
        if (!user) return;

        // Subscribe to changes in all relevant tables
        const channel = supabase
            .channel('db_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'transactions' },
                () => fetchData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'wallets' },
                () => fetchData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'budgets' },
                () => fetchData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'categories' },
                () => fetchData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'goals' },
                () => fetchData()
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Realtime connected!');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchData]);

    // Transaction CRUD
    const addTransaction = async (transaction) => {
        try {
            const newTx = await transactionService.create({
                type: transaction.type,
                amount: transaction.amount,
                date: transaction.date || new Date().toISOString().split('T')[0],
                note: transaction.note,
                wallet_id: transaction.wallet_id || transaction.walletId,
                category_id: transaction.category_id || transaction.categoryId,
            });
            setTransactions(prev => [newTx, ...prev]);
            return newTx;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await transactionService.delete(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    };

    const editTransaction = async (id, updatedData) => {
        try {
            const updated = await transactionService.update(id, updatedData);
            setTransactions(prev => prev.map(t => t.id === id ? updated : t));
            return updated;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
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
        const statsObj = {};
        wallets.forEach(w => statsObj[w.id] = 0);

        transactions.forEach(t => {
            const walletId = t.wallet_id || 'cash';
            const amount = Number(t.amount);
            if (t.type === 'income') {
                statsObj[walletId] = (statsObj[walletId] || 0) + amount;
            } else {
                statsObj[walletId] = (statsObj[walletId] || 0) - amount;
            }
        });

        return statsObj;
    }, [transactions, wallets]);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [walletFilter, setWalletFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ day: '', month: '', year: '' });

    // Advanced Filter State
    const [advancedFilters, setAdvancedFilters] = useState({
        isActive: false,
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        categories: [],
        wallets: [],
        sortBy: 'newest' // newest, oldest, highest, lowest
    });

    // Filtering Logic
    const filteredTransactions = useMemo(() => {
        let result = transactions.filter(t => {
            // 1. Basic Filters (Always active unless overridden or cleared)
            const [tYear, tMonth, tDay] = (t.date || '').split('-');

            // If Advanced Search is NOT active, use the simple Date/Month filter
            let matchesDate = true;
            if (!advancedFilters.isActive) {
                const matchesYear = !dateFilter.year || tYear === dateFilter.year;
                const matchesMonth = !dateFilter.month || tMonth === dateFilter.month;
                const matchesDay = !dateFilter.day || tDay === dateFilter.day;
                matchesDate = matchesYear && matchesMonth && matchesDay;
            } else {
                // Advanced Date Range
                const tDate = new Date(t.date);
                if (advancedFilters.startDate) {
                    const start = new Date(advancedFilters.startDate);
                    if (tDate < start) matchesDate = false;
                }
                if (matchesDate && advancedFilters.endDate) {
                    const end = new Date(advancedFilters.endDate);
                    if (tDate > end) matchesDate = false;
                }
            }

            const matchesType = typeFilter === 'all' || t.type === typeFilter;

            const tWallet = t.wallet_id || 'cash';
            const matchesWallet = walletFilter === 'all' || tWallet === walletFilter;

            const query = searchQuery.toLowerCase();
            const matchesSearch =
                t.note?.toLowerCase().includes(query) ||
                t.category?.name?.toLowerCase().includes(query) ||
                t.amount?.toString().includes(query);

            // 2. Advanced Filters (Amount & Category)
            let matchesAdvanced = true;
            if (advancedFilters.isActive) {
                // Category (Multi-select)
                if (advancedFilters.categories.length > 0) {
                    // Check category_id or category.name (flexible)
                    const catId = t.category_id;
                    const catName = t.category?.name; // fallback
                    // Assuming filter stores IDs or Names. Let's assume IDs.
                    if (!advancedFilters.categories.includes(catId)) {
                        matchesAdvanced = false;
                    }
                }

                // Wallet (Multi-select) - NEW
                if (advancedFilters.wallets.length > 0) {
                    const wId = t.wallet_id;
                    if (!advancedFilters.wallets.includes(wId)) {
                        matchesAdvanced = false;
                    }
                }

                // Amount Range
                const amt = Number(t.amount);
                if (matchesAdvanced && advancedFilters.minAmount && amt < Number(advancedFilters.minAmount)) {
                    matchesAdvanced = false;
                }
                if (matchesAdvanced && advancedFilters.maxAmount && amt > Number(advancedFilters.maxAmount)) {
                    matchesAdvanced = false;
                }
            }

            return matchesDate && matchesType && matchesSearch && matchesWallet && matchesAdvanced;
        });

        // 3. Sorting
        if (advancedFilters.isActive && advancedFilters.sortBy) {
            result.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                const amtA = Number(a.amount);
                const amtB = Number(b.amount);

                switch (advancedFilters.sortBy) {
                    case 'newest': return dateB - dateA; // Descending
                    case 'oldest': return dateA - dateB; // Ascending
                    case 'highest': return amtB - amtA;
                    case 'lowest': return amtA - amtB;
                    default: return 0;
                }
            });
        }

        return result;
    }, [transactions, dateFilter, typeFilter, walletFilter, searchQuery, advancedFilters]);

    // Grouping Logic
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

    // Budget Stats (from Supabase)
    const budgetStats = useMemo(() => {
        return budgets;
    }, [budgets]);

    const updateBudget = async (categoryId, limit) => {
        try {
            // Find existing budget for this category
            const existing = budgets.find(b => b.category_id === categoryId);
            if (existing) {
                await budgetService.update(existing.id, { limit_amount: limit });
            } else {
                await budgetService.create({ category_id: categoryId, limit_amount: limit });
            }
            await fetchData(); // Refresh data
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };

    const deleteBudget = async (categoryId) => {
        try {
            const existing = budgets.find(b => b.category_id === categoryId || b.category?.name?.toLowerCase() === categoryId);
            if (existing) {
                await budgetService.delete(existing.id);
                await fetchData();
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const resetBudget = async () => {
        try {
            await budgetService.resetCycle();
            await fetchData();
        } catch (error) {
            console.error('Error resetting budget:', error);
        }
    };

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
        // Loading
        loading,
        refetch: fetchData,

        // Transactions
        transactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
        stats,
        groupedTransactions,
        filteredTransactions,

        // Filters
        searchQuery, setSearchQuery,
        typeFilter, setTypeFilter,
        dateFilter, setDateFilter,
        walletFilter, setWalletFilter,
        advancedFilters, setAdvancedFilters,

        // Budget
        budgets,
        budgetStats,
        updateBudget,
        deleteBudget,
        resetBudget,

        // Wallets & Categories
        wallets,
        walletStats,
        categories,

        // Modal
        isModalOpen,
        editingTransaction,
        isPreset,
        openModal,
        closeModal,

        // Theme
        theme,
        toggleTheme,

        // Goals
        goals,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};
