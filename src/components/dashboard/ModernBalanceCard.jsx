import React, { useState } from 'react';
import { ChevronDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/utils';
import { useTransactions } from '../../context/TransactionContext';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ModernBalanceCard({ currentDate, onDateChange }) {
    const { stats, transactions } = useTransactions();

    const displayDate = format(currentDate, 'MMMM yyyy', { locale: id });

    const handleMonthChange = (e) => {
        const date = new Date(e.target.value);
        if (!isNaN(date.getTime())) {
            onDateChange(date);
        }
    };

    // Get last income
    const lastIncome = React.useMemo(() => {
        const incomes = transactions.filter(t => t.type === 'income');
        if (incomes.length === 0) return 0;
        // Sort by date desc
        incomes.sort((a, b) => new Date(b.date) - new Date(a.date));
        return incomes[0].amount;
    }, [transactions]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Saldo Saya</span>
                <div className="relative">
                    <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        {displayDate}
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    <input
                        type="month"
                        value={format(currentDate, 'yyyy-MM')}
                        onChange={handleMonthChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Main Balance */}
            <div className="mb-6">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {formatCurrency(stats?.totalBalance || 0)}
                </h2>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Wallet className="w-4 h-4" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Pendapatan terakhir</span>
                    <span className="text-sm font-bold text-emerald-500">
                        {lastIncome > 0 ? '+' : ''}{formatCurrency(lastIncome)}
                    </span>
                </div>
            </div>
        </div>
    );
}
