import React, { useState } from 'react';
import { X, Check, Calendar, FileText, DollarSign } from 'lucide-react';
import { cn } from '../../utils/utils';
import { useTransactions } from '../../context/TransactionContext';
import { CATEGORIES, WALLETS } from '../../data/mockData';

export default function AddTransactionModal({ isOpen, onClose, editData = null }) {
    const { addTransaction, editTransaction, isPreset } = useTransactions();
    const [type, setType] = useState('expense'); // 'income' | 'expense'
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [wallet, setWallet] = useState('cash');

    // Load data when editData changes
    React.useEffect(() => {
        if (editData) {
            setType(editData.type);
            setAmount(new Intl.NumberFormat('id-ID').format(editData.amount));
            setCategory(editData.category);
            // If preset, use TODAY not the old date (which might be from a template)
            // Actually, for presets, we likely create a new object with 'date' set to today in QuickActions
            // But to be safe, if strictly preset, maybe default to today? 
            // Let's assume the preset object passed has correct date or we override it.
            // For now, trust the data passed.
            setDate(editData.date || new Date().toISOString().split('T')[0]);
            setNote(editData.note || '');
            setWallet(editData.wallet || 'cash');
        } else {
            // Reset if no editData (Add mode)
            setType('expense');
            setAmount('');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]);
            setNote('');
            setWallet('cash');
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

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
        if (!numericAmount || !category) return;

        const transactionData = {
            type,
            amount: numericAmount,
            category,
            date,
            note,
            wallet
        };

        // If it looks like editData but isPreset is true, we treat it as ADD
        if (editData && !isPreset) {
            editTransaction(editData.id, transactionData);
        } else {
            addTransaction(transactionData);
        }

        onClose();
    };

    const currentCategories = CATEGORIES[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {editData && !isPreset ? 'Edit Transaksi' : 'Tambah Transaksi'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Type Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl">
                        <button
                            type="button"
                            onClick={() => { setType('expense'); setCategory(''); }}
                            className={cn(
                                "py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                type === 'expense' ? "bg-white dark:bg-slate-800 text-rose-500 dark:text-rose-400 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                            )}
                        >
                            Pengeluaran
                        </button>
                        <button
                            type="button"
                            onClick={() => { setType('income'); setCategory(''); }}
                            className={cn(
                                "py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                type === 'income' ? "bg-white dark:bg-slate-800 text-emerald-500 dark:text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                            )}
                        >
                            Pemasukan
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Jumlah (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold text-lg"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Wallet Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Sumber Dana</label>
                        <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-xl flex gap-1">
                            {WALLETS.map(w => (
                                <button
                                    key={w.id}
                                    type="button"
                                    onClick={() => setWallet(w.id)}
                                    className={cn(
                                        "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all border",
                                        wallet === w.id
                                            ? "bg-white dark:bg-indigo-600/10 border-indigo-500 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                            : "bg-transparent border-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-900"
                                    )}
                                >
                                    {w.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Kategori</label>
                        <div className="grid grid-cols-4 gap-2">
                            {currentCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-2 rounded-xl gap-1 transition-all border",
                                        category === cat.id
                                            ? "bg-white dark:bg-indigo-600/10 border-indigo-500 dark:border-indigo-600/50 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <span className="text-[10px] uppercase font-bold tracking-wider">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Note */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Tanggal</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Catatan</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Opsional"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        type="submit"
                        disabled={!amount || !category}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-4 transition-all active:scale-[0.98]"
                    >
                        <Check className="w-5 h-5" />
                        {editData && !isPreset ? 'Simpan Perubahan' : 'Simpan Transaksi'}
                    </button>
                </form>
            </div>
        </div>
    );
}
