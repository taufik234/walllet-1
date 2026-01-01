import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { WALLETS } from '../../data/mockData';

export default function AdjustBalanceModal({ isOpen, onClose, walletId, currentBalance }) {
    const { addTransaction } = useTransactions();
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (isOpen && currentBalance !== undefined) {
            setAmount(new Intl.NumberFormat('id-ID').format(currentBalance));
        }
    }, [isOpen, currentBalance]);

    if (!isOpen) return null;

    const walletLabel = WALLETS.find(w => w.id === walletId)?.label || 'Wallet';

    const handleAmountChange = (e) => {
        const cleanValue = e.target.value.replace(/\D/g, '');
        if (cleanValue) {
            const formatted = new Intl.NumberFormat('id-ID').format(cleanValue);
            setAmount(formatted);
        } else {
            setAmount('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const numericAmount = Number(amount.replace(/\./g, ''));
        const diff = numericAmount - currentBalance;

        if (diff === 0) {
            onClose();
            return;
        }

        const transactionData = {
            type: diff > 0 ? 'income' : 'expense',
            amount: Math.abs(diff),
            category: 'lainnya',
            date: new Date().toISOString().split('T')[0],
            note: 'Penyesuaian Saldo Manual',
            wallet: walletId,
        };

        addTransaction(transactionData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Atur Saldo {walletLabel}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Saldo Saat Ini (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">Rp</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={amount}
                                onChange={handleAmountChange}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold text-2xl"
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-slate-500 italic">
                            Sistem akan otomatis membuat transaksi penyesuaian selisih.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <Check className="w-5 h-5" />
                        Simpan Saldo
                    </button>
                </form>
            </div>
        </div>
    );
}
