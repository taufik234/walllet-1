import React from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/utils';
import { useTransactions } from '../../context/TransactionContext';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function IncomeCard({ currentDate, onDateChange }) {
    const { stats, transactions } = useTransactions();

    const handleMonthChange = (e) => {
        const date = new Date(e.target.value);
        if (!isNaN(date.getTime())) {
            onDateChange(date);
        }
    };

    // Calculate stats
    const incomeStats = React.useMemo(() => {
        const thisMonth = currentDate.getMonth();
        const thisYear = currentDate.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const currentMonthIncome = transactions
            .filter(t => {
                const d = new Date(t.date);
                return t.type === 'income' && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            })
            .reduce((acc, curr) => acc + curr.amount, 0);

        const lastMonthIncome = transactions
            .filter(t => {
                const d = new Date(t.date);
                return t.type === 'income' && d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
            })
            .reduce((acc, curr) => acc + curr.amount, 0);

        const percentage = lastMonthIncome === 0
            ? currentMonthIncome > 0 ? 100 : 0
            : ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;

        return { currentMonthIncome, percentage };
    }, [transactions, currentDate]);

    // Generate bars (last 7 days relative to currentDate)
    const bars = React.useMemo(() => {
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(currentDate);
            d.setDate(d.getDate() - i);
            const dayIncome = transactions
                .filter(t => t.type === 'income' && new Date(t.date).toDateString() === d.toDateString())
                .reduce((acc, curr) => acc + curr.amount, 0);
            result.push(dayIncome);
        }
        // Normalize for visual height (max 100%)
        const max = Math.max(...result, 1); // avoid division by zero
        return result.map(val => (val / max) * 100);
    }, [transactions, currentDate]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Pemasukan Saya</span>
                <div className="relative">
                    <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        {format(currentDate, 'MMMM yyyy', { locale: id })}
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

            {/* Main Content Row */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                        {formatCurrency(incomeStats.currentMonthIncome)}
                    </h2>

                    <div className="flex gap-3">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${incomeStats.percentage >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            <TrendingUp className={`w-3 h-3 ${incomeStats.percentage < 0 ? 'rotate-180' : ''}`} />
                            <span>{Math.abs(incomeStats.percentage).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span>Bulan ini</span>
                        </div>
                    </div>
                </div>

                {/* Visualizer Bars */}
                <div className="flex items-end gap-1 h-12 pb-1">
                    {bars.map((height, i) => (
                        <div
                            key={i}
                            className={`w-2 rounded-full ${i === bars.length - 1 ? 'bg-emerald-500' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}
                            style={{ height: `${Math.max(height, 10)}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
