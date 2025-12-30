import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '../../utils/utils';
import { useTransactions } from '../../context/TransactionContext';
import { CATEGORIES } from '../../data/mockData';

export default function AddBudgetModal({ isOpen, onClose }) {
    const { updateBudget, budgets } = useTransactions();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    // Reset when opening
    React.useEffect(() => {
        if (isOpen) {
            setAmount('');
            setCategory('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Filter categories that don't have a budget yet
    const availableCategories = CATEGORIES.expense.filter(c => !budgets[c.id]);

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

        updateBudget(category, numericAmount);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white">
                        Tambah Target Budget
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-6">
                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">Target Anggaran (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold text-lg"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">Pilih Kategori</label>
                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                            {availableCategories.length > 0 ? (
                                availableCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-2 rounded-xl gap-1 transition-all border",
                                            category === cat.id
                                                ? "bg-indigo-600/10 border-indigo-600/50 text-indigo-400"
                                                : "bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                                        )}
                                    >
                                        <span className="text-[10px] uppercase font-bold tracking-wider">{cat.label}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-4 text-center py-4 text-slate-500 text-sm italic">
                                    Semua kategori sudah punya budget.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        type="submit"
                        disabled={!amount || !category}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-4 transition-all active:scale-[0.98]"
                    >
                        <Check className="w-5 h-5" />
                        Simpan Budget
                    </button>
                </form>
            </div>
        </div>
    );
}
