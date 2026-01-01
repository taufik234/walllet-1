import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, ShoppingBag, Utensils, Car, Film, Gift, TrendingUp, MoreHorizontal } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { cn, formatCurrency, formatDate } from '../../utils/utils';

// Helper to get icon
const getIcon = (category) => {
    // Simple mapping based on ID. In a real app, maybe store this better.
    switch (category) {
        case 'makan': return Utensils;
        case 'transport': return Car;
        case 'belanja': return ShoppingBag;
        case 'hiburan': return Film;
        case 'gaji': return Wallet;
        case 'bonus': return Gift;
        case 'investasi': return TrendingUp;
        default: return MoreHorizontal;
    }
};

export default function RecentTransactions() {
    const { transactions } = useTransactions();
    const recent = transactions.slice(0, 5); // display top 5

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transaksi Terakhir</h3>
                <Link to="/transactions" className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1">
                    Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-3">
                {recent.map((trx) => {
                    const Icon = getIcon(trx.category);
                    return (
                        <div key={trx.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                trx.type === 'income' ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500 dark:text-rose-400"
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-slate-900 dark:text-white font-medium capitalize truncate">{trx.note || trx.category}</p>
                                <p className="text-xs text-slate-500">{formatDate(trx.date)} • <span className="capitalize">{trx.category}</span></p>
                            </div>

                            <div className={cn(
                                "font-bold whitespace-nowrap",
                                trx.type === 'income' ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                            )}>
                                {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                            </div>
                        </div>
                    );
                })}

                {recent.length === 0 && (
                    <div className="text-center py-8 text-slate-500">Belum ada transaksi</div>
                )}
            </div>
        </div>
    );
}
