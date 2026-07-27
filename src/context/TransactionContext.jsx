import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

const TOKEN_KEY = 'auth_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth();
  const convex = useConvex();

  // Data States
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({ totalBalance: 0, totalIncome: 0, totalExpense: 0 });
  const [walletStats, setWalletStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all data from Convex
  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!user || !token) {
      setTransactions([]);
      setWallets([]);
      setBudgets([]);
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [txData, walletData, catData, budgetData, goalData, userStats] = await Promise.all([
        convex.query(api.transactions.list, { token }),
        convex.query(api.wallets.list, { token }),
        convex.query(api.categories.getGrouped),
        convex.query(api.budgets.getWithStats, { token, referenceDate: new Date().toISOString() }),
        convex.query(api.goals.list, { token }),
        convex.query(api.stats.getStats, { token }),
      ]);

      setTransactions(txData || []);
      setWallets(walletData || []);
      setCategories(catData || { income: [], expense: [] });
      setBudgets(budgetData || []);
      setGoals(goalData || []);

      if (userStats) {
        setStats(userStats.global || { totalBalance: 0, totalIncome: 0, totalExpense: 0 });
        setWalletStats(userStats.wallets || {});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, convex]);

  // Fetch data when user changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transaction CRUD
  const addTransaction = async (transaction) => {
    const token = getToken();
    try {
      const walletId = transaction.walletId || transaction.wallet_id;
      if (!walletId) throw new Error('Wallet harus dipilih');

      const newTx = await convex.mutation(api.transactions.create, {
        token,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date || new Date().toISOString().split('T')[0],
        note: transaction.note,
        walletId,
        categoryId: transaction.categoryId || transaction.category_id,
      });
      setTransactions((prev) => [newTx, ...prev]);
      return newTx;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    const token = getToken();
    try {
      await convex.mutation(api.transactions.remove, { token, id });
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const editTransaction = async (id, updatedData) => {
    const token = getToken();
    try {
      const updated = await convex.mutation(api.transactions.update, { token, id, ...updatedData });
      setTransactions((prev) => prev.map((t) => (t._id === id ? updated : t)));
      return updated;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  // Transfer CRUD
  const addTransfer = async ({ fromWalletId, toWalletId, amount, date, note }) => {
    const token = getToken();
    try {
      const { transactions: newTxs } = await convex.mutation(api.transfers.create, {
        token,
        fromWalletId,
        toWalletId,
        amount,
        date,
        note,
      });
      setTransactions((prev) => [...newTxs, ...prev]);
      return newTxs;
    } catch (error) {
      console.error('Error adding transfer:', error);
      throw error;
    }
  };

  const deleteTransfer = async (transferPairId) => {
    const token = getToken();
    try {
      await convex.mutation(api.transfers.remove, { token, transferPairId });
      setTransactions((prev) => prev.filter((t) => t.transferPairId !== transferPairId));
    } catch (error) {
      console.error('Error deleting transfer:', error);
      throw error;
    }
  };

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
    sortBy: 'newest',
  });

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    let result = transactions.filter((t) => {
      const [tYear, tMonth, tDay] = (t.date || '').split('-');

      let matchesDate = true;
      if (!advancedFilters.isActive) {
        const matchesYear = !dateFilter.year || tYear === dateFilter.year;
        const matchesMonth = !dateFilter.month || tMonth === dateFilter.month;
        const matchesDay = !dateFilter.day || tDay === dateFilter.day;
        matchesDate = matchesYear && matchesMonth && matchesDay;
      } else {
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
      const matchesWallet = walletFilter === 'all' || t.walletId === walletFilter;

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        t.note?.toLowerCase().includes(query) ||
        t.category?.name?.toLowerCase().includes(query) ||
        t.amount?.toString().includes(query);

      let matchesAdvanced = true;
      if (advancedFilters.isActive) {
        if (advancedFilters.categories.length > 0) {
          if (!advancedFilters.categories.includes(t.categoryId)) {
            matchesAdvanced = false;
          }
        }
        if (advancedFilters.wallets.length > 0) {
          if (!advancedFilters.wallets.includes(t.walletId)) {
            matchesAdvanced = false;
          }
        }
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

    if (advancedFilters.isActive && advancedFilters.sortBy) {
      result.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const amtA = Number(a.amount);
        const amtB = Number(b.amount);
        switch (advancedFilters.sortBy) {
          case 'newest':
            return dateB - dateA;
          case 'oldest':
            return dateA - dateB;
          case 'highest':
            return amtB - amtA;
          case 'lowest':
            return amtA - amtB;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [transactions, dateFilter, typeFilter, walletFilter, searchQuery, advancedFilters]);

  const groupedTransactions = useMemo(() => {
    const grouped = {};
    filteredTransactions.forEach((transaction) => {
      const date = transaction.date;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(transaction);
    });
    return grouped;
  }, [filteredTransactions]);

  const budgetStats = useMemo(() => budgets, [budgets]);

  const updateBudget = async (categoryId, limit) => {
    const token = getToken();
    try {
      const existing = budgets.find((b) => b.categoryId === categoryId);
      if (existing) {
        await convex.mutation(api.budgets.update, { token, id: existing._id, limitAmount: limit });
      } else {
        await convex.mutation(api.budgets.create, {
          token,
          categoryId,
          limitAmount: limit,
        });
      }
      await fetchData();
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const deleteBudget = async (categoryId) => {
    const token = getToken();
    try {
      const existing = budgets.find(
        (b) =>
          b.categoryId === categoryId || b.category?.name?.toLowerCase() === categoryId
      );
      if (existing) {
        await convex.mutation(api.budgets.remove, { token, id: existing._id });
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const resetBudget = async () => {
    const token = getToken();
    try {
      await convex.mutation(api.budgets.resetCycle, { token });
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

  const createWallet = async (name, initialBalance = 0) => {
    const token = getToken();
    try {
      const w = await convex.mutation(api.wallets.create, { token, name, initialBalance });
      setWallets((prev) => [...prev, w]);
      return w;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  };

  const deleteWallet = async (id) => {
    const token = getToken();
    try {
      await convex.mutation(api.wallets.remove, { token, id });
      setWallets((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  };

  const value = {
    loading,
    refetch: fetchData,

    transactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    stats,
    groupedTransactions,
    filteredTransactions,

    addTransfer,
    deleteTransfer,

    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    dateFilter,
    setDateFilter,
    walletFilter,
    setWalletFilter,
    advancedFilters,
    setAdvancedFilters,

    budgets,
    budgetStats,
    updateBudget,
    deleteBudget,
    resetBudget,

    wallets,
    walletStats,
    createWallet,
    deleteWallet,
    categories,

    isModalOpen,
    editingTransaction,
    isPreset,
    openModal,
    closeModal,

    goals,
  };

  return (
    <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
  );
};
