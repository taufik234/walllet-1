import React from 'react';
import { X, Calendar, Wallet, FileText, ArrowUpCircle, ArrowDownCircle, Pencil, Trash2, Share2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/utils';
import { useTransactions } from '../../context/TransactionContext';

export default function TransactionDetailModal({ isOpen, onClose, transaction }) {
    const { deleteTransaction, openModal } = useTransactions();

    if (!isOpen || !transaction) return null;

    const isIncome = transaction.type === 'income';

    // Use optional chaining and fallback for Supabase relation objects
    const WalletLabel = transaction.wallet?.name || 'Tunai';
    const categoryLabel = transaction.category?.name || 'Lainnya';

    const handleDelete = () => {
        if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
            deleteTransaction(transaction.id);
            onClose();
        }
    };

    const handleEdit = () => {
        onClose();
        // Slight delay to allow efficient modal swap
        setTimeout(() => openModal(transaction), 100);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative transition-colors">
                {/* Receipt Pattern Top */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center pt-4 pb-8">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 ${isIncome ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-500 dark:text-rose-400'
                            }`}>
                            {isIncome ? <ArrowUpCircle className="w-8 h-8" /> : <ArrowDownCircle className="w-8 h-8" />}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">
                            {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                        </p>
                        <h2 className={`text-3xl font-bold ${isIncome ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'
                            }`}>
                            {formatCurrency(transaction.amount)}
                        </h2>
                    </div>

                    {/* Receipt Details */}
                    <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-5 space-y-4 border border-slate-200 dark:border-slate-800/50">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50 pb-3">
                            <span className="text-slate-500 text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Tanggal
                            </span>
                            <span className="text-slate-900 dark:text-slate-200 font-medium text-sm">
                                {formatDate(transaction.date)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50 pb-3">
                            <span className="text-slate-500 text-sm flex items-center gap-2">
                                <Wallet className="w-4 h-4" /> Sumber
                            </span>
                            <span className="text-slate-900 dark:text-slate-200 font-medium text-sm capitalize">
                                {WalletLabel}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50 pb-3">
                            <span className="text-slate-500 text-sm flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Kategori
                            </span>
                            <span className="text-slate-900 dark:text-slate-200 font-medium text-sm capitalize">
                                {categoryLabel}
                            </span>
                        </div>
                        {transaction.note && (
                            <div className="pt-1">
                                <p className="text-slate-500 text-xs mb-1">Catatan</p>
                                <p className="text-slate-700 dark:text-slate-300 text-sm italic">"{transaction.note}"</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <button
                            onClick={handleEdit}
                            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-500 dark:text-indigo-400 font-medium py-3 rounded-xl transition-colors"
                        >
                            <Pencil className="w-4 h-4" /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 dark:text-rose-400 font-medium py-3 rounded-xl transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
