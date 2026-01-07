import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/utils';
import { goalService } from '../../lib/services';
import { useTransactions } from '../../context/TransactionContext';

export default function AddSavingsModal({ isOpen, onClose, goal }) {
    const { refetch } = useTransactions();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const remaining = goal ? (goal.target_amount - goal.current_amount) : 0;

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value === '') {
            setAmount('');
            return;
        }
        const formatted = new Intl.NumberFormat('id-ID').format(parseInt(value));
        setAmount(formatted);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const numericAmount = parseInt(amount.replace(/\./g, ''));
        if (!numericAmount || !goal) return;

        setLoading(true);
        try {
            await goalService.addSavings(goal.id, numericAmount);
            refetch();
            setAmount('');
            onClose();
        } catch (error) {
            console.error('Error adding savings:', error);
            alert('Gagal menambahkan tabungan');
        } finally {
            setLoading(false);
        }
    };

    const quickAmounts = [50000, 100000, 250000, 500000];

    // Helper to set formatted amount
    const setFormattedAmount = (val) => {
        setAmount(new Intl.NumberFormat('id-ID').format(val));
    };

    if (!isOpen || !goal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 scrollbar-hide">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Tambah Tabungan
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {goal.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Current Progress */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Terkumpul</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                                {formatCurrency(goal.current_amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Kurang</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {formatCurrency(remaining)}
                            </span>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Jumlah Tabungan
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={amount}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold"
                                required
                            />
                        </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Jumlah Cepat
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {quickAmounts.map((quickAmount) => (
                                <button
                                    key={quickAmount}
                                    type="button"
                                    onClick={() => setFormattedAmount(quickAmount)}
                                    className="px-2 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-xs font-medium transition-all"
                                >
                                    {(quickAmount / 1000)}K
                                </button>
                            ))}
                        </div>
                        {remaining > 0 && (
                            <button
                                type="button"
                                onClick={() => setFormattedAmount(remaining)}
                                className="w-full mt-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium transition-all"
                            >
                                Lunasi Semua ({formatCurrency(remaining)})
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !amount || parseFloat(amount) <= 0}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{loading ? 'Menyimpan...' : 'Tambah Tabungan'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
