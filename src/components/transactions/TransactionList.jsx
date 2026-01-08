import { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { cn, formatCurrency, formatDate } from '../../utils/utils';
import { Wallet, ShoppingBag, Utensils, Car, Film, Gift, TrendingUp, MoreHorizontal, Trash2, Pencil, Heart, GraduationCap, Receipt, Briefcase } from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal';

// Helper to get icon (duplicated for now, could be shared)
const getIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    switch (name) {
        case 'makan': return Utensils;
        case 'transport': return Car;
        case 'belanja': return ShoppingBag;
        case 'hiburan': return Film;
        case 'gaji': return Wallet;
        case 'bonus': return Gift;
        case 'investasi': return TrendingUp;
        case 'kesehatan': return Heart;
        case 'pendidikan': return GraduationCap;
        case 'tagihan': return Receipt;
        case 'freelance': return Briefcase;
        default: return MoreHorizontal;
    }
};

export default function TransactionList() {
    const { filteredTransactions, deleteTransaction, openModal, advancedFilters } = useTransactions();
    const [viewTransaction, setViewTransaction] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10); // Show 10 items initially

    // 1. Slice transactions for pagination
    const visibleTransactions = filteredTransactions.slice(0, visibleCount);
    const hasMore = visibleCount < filteredTransactions.length;

    // Check if we should group by date
    // We only group if NOT sorting by amount (highest/lowest)
    const shouldGroup = !advancedFilters?.isActive || (advancedFilters?.sortBy !== 'highest' && advancedFilters?.sortBy !== 'lowest');

    // 2. Group transactions by date (Locally) - ONLY if shouldGroup is true
    const groupedTransactions = shouldGroup ? visibleTransactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {}) : {};

    // Sort dates based on user preference
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        // If sort order is 'oldest', show oldest dates first (Ascending)
        if (advancedFilters?.isActive && advancedFilters?.sortBy === 'oldest') {
            return dateA - dateB;
        }
        // Default to Newest dates first (Descending)
        return dateB - dateA;
    });

    if (filteredTransactions.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <p className="mb-2">Belum ada transaksi</p>
                <p className="text-sm">Mulai catat keuanganmu sekarang!</p>
            </div>
        );
    }

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const TransactionItem = ({ trx }) => {
        const categoryName = trx.category?.name || 'Lainnya';
        const Icon = getIcon(categoryName);
        return (
            <div
                onClick={() => setViewTransaction(trx)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98] shadow-sm dark:shadow-none"
            >
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    trx.type === 'income' ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500 dark:text-rose-400"
                )}>
                    <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-medium capitalize truncate pr-8">{trx.note || categoryName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="capitalize">{categoryName}</span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span className="capitalize">{trx.wallet?.name || 'Tunai'}</span>
                        {!shouldGroup && <span className="text-slate-400 dark:text-slate-600">• {formatDate(trx.date)}</span>}
                    </p>
                </div>

                <div className={cn(
                    "font-bold whitespace-nowrap text-right",
                    trx.type === 'income' ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                )}>
                    {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 pb-8">
            {shouldGroup ? (
                // Grouped View
                sortedDates.map((date) => {
                    const dayTransactions = groupedTransactions[date];
                    const isToday = date === new Date().toISOString().split('T')[0];
                    const isYesterday = date === new Date(Date.now() - 86400000).toISOString().split('T')[0];

                    const displayDate = isToday ? 'Hari Ini' : isYesterday ? 'Kemarin' : formatDate(date);

                    return (
                        <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur py-2 z-10 w-full transition-colors">
                                {displayDate}
                            </h3>
                            <div className="space-y-3">
                                {dayTransactions.map((trx) => (
                                    <TransactionItem key={trx.id} trx={trx} />
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                // Flat View (Sorted by Amount)
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {visibleTransactions.map((trx) => (
                        <TransactionItem key={trx.id} trx={trx} />
                    ))}
                </div>
            )}

            {hasMore && (
                <button
                    onClick={handleLoadMore}
                    className="w-full py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-sm dark:shadow-none"
                >
                    Muat Lebih Banyak...
                </button>
            )}

            <TransactionDetailModal
                isOpen={!!viewTransaction}
                onClose={() => setViewTransaction(null)}
                transaction={viewTransaction}
            />
        </div>
    );
}
