import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { cn, formatCurrency, formatDate } from '../../utils/utils';
import { Wallet, ShoppingBag, Utensils, Car, Film, Gift, TrendingUp, MoreHorizontal, Trash2, Pencil } from 'lucide-react';

// Helper to get icon (duplicated for now, could be shared)
const getIcon = (category) => {
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

export default function TransactionList() {
    const { groupedTransactions, deleteTransaction, openModal } = useTransactions();

    // Sort dates descending
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <p className="mb-2">Belum ada transaksi</p>
                <p className="text-sm">Mulai catat keuanganmu sekarang!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {sortedDates.map((date) => {
                const dayTransactions = groupedTransactions[date];
                const isToday = date === new Date().toISOString().split('T')[0];
                const isYesterday = date === new Date(Date.now() - 86400000).toISOString().split('T')[0];

                const displayDate = isToday ? 'Hari Ini' : isYesterday ? 'Kemarin' : formatDate(date);

                return (
                    <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-sm font-bold text-slate-400 mb-3 sticky top-0 bg-slate-950/90 backdrop-blur py-2 z-10">
                            {displayDate}
                        </h3>
                        <div className="space-y-3">
                            {dayTransactions.map((trx) => {
                                const Icon = getIcon(trx.category);
                                return (
                                    <div key={trx.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-slate-700 transition-colors group relative overflow-hidden">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                            trx.type === 'income' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium capitalize truncate pr-8">{trx.note || trx.category}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <span className="capitalize">{trx.category}</span>
                                            </p>
                                        </div>

                                        <div className={cn(
                                            "font-bold whitespace-nowrap text-right",
                                            trx.type === 'income' ? "text-emerald-400" : "text-rose-400"
                                        )}>
                                            {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                                        </div>

                                        {/* Actions (Visible on Hover/Focus) */}
                                        <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent pl-8 pr-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => openModal(trx)}
                                                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                                                aria-label="Edit transaction"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteTransaction(trx.id)}
                                                className="p-2 rounded-full hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                                                aria-label="Delete transaction"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
