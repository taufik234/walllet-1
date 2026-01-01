import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/utils';

export default function SummaryCards() {
    const { stats } = useTransactions();

    return (
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {/* Income */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 lg:p-5 flex flex-col justify-between shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <ArrowDownLeft className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Pemasukan</span>
                </div>
                <p className="text-lg lg:text-xl font-bold text-emerald-500 dark:text-emerald-400 truncate">
                    {formatCurrency(stats.totalIncome)}
                </p>
            </div>

            {/* Expense */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 lg:p-5 flex flex-col justify-between shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Pengeluaran</span>
                </div>
                <p className="text-lg lg:text-xl font-bold text-rose-500 dark:text-rose-400 truncate">
                    {formatCurrency(stats.totalExpense)}
                </p>
            </div>
        </div>
    );
}
