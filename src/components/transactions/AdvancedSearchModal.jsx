import React, { useState, useEffect } from 'react';
import { X, Calendar, Filter, SortAsc, ArrowDownUp, Check } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';

export default function AdvancedSearchModal({ isOpen, onClose }) {
    const { categories, advancedFilters, setAdvancedFilters, wallets } = useTransactions();

    // Local state for form (so we don't apply immediately)
    const [localFilters, setLocalFilters] = useState(advancedFilters);
    const [activeTab, setActiveTab] = useState('filter'); // 'filter' or 'sort'

    // Sync local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(advancedFilters);
        }
    }, [isOpen, advancedFilters]);

    if (!isOpen) return null;

    const handleApply = () => {
        setAdvancedFilters({
            ...localFilters,
            isActive: true // Activate advanced mode
        });
        onClose();
    };

    const handleReset = () => {
        const resetState = {
            isActive: false,
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: '',
            categories: [],
            sortBy: 'newest'
        };
        setLocalFilters(resetState);
        setAdvancedFilters(resetState);
        onClose();
    };

    const toggleCategory = (catId) => {
        setLocalFilters(prev => {
            const exists = prev.categories.includes(catId);
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter(id => id !== catId)
                    : [...prev.categories, catId]
            };
        });
    };

    // Helper for category badge color
    const getCatColor = (type) => type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Filter className="w-5 h-5 text-indigo-500" />
                        Filter & Pencarian
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('filter')}
                        className={`
                            flex-1 py-2 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2
                            ${activeTab === 'filter' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}
                        `}
                    >
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button
                        onClick={() => setActiveTab('sort')}
                        className={`
                            flex-1 py-2 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2
                            ${activeTab === 'sort' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}
                        `}
                    >
                        <SortAsc className="w-4 h-4" /> Urutkan
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {activeTab === 'filter' ? (
                        <div className="space-y-6">
                            {/* Date Range */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Rentang Tanggal
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Dari</label>
                                        <input
                                            type="date"
                                            value={localFilters.startDate}
                                            onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Sampai</label>
                                        <input
                                            type="date"
                                            value={localFilters.endDate}
                                            onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Amount Range */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nominal</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Min (Rp)"
                                        value={Number(localFilters.minAmount) ? Number(localFilters.minAmount).toLocaleString('id-ID') : localFilters.minAmount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setLocalFilters({ ...localFilters, minAmount: val });
                                        }}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white text-sm"
                                    />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Max (Rp)"
                                        value={Number(localFilters.maxAmount) ? Number(localFilters.maxAmount).toLocaleString('id-ID') : localFilters.maxAmount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setLocalFilters({ ...localFilters, maxAmount: val });
                                        }}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            {/* Categories (Multi-select) */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                                <div className="flex flex-wrap gap-2">
                                    {/* Merge Income and Expense for list */}
                                    {[...categories.expense, ...categories.income].map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.id)}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5
                                                ${localFilters.categories.includes(cat.id)
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                                                }
                                            `}
                                        >
                                            {localFilters.categories.includes(cat.id) && <Check className="w-3 h-3" />}
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Wallets (Multi-select) */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dompet</label>
                                <div className="flex flex-wrap gap-2">
                                    {wallets.map((wallet) => (
                                        <button
                                            key={wallet.id}
                                            onClick={() => {
                                                setLocalFilters(prev => {
                                                    const exists = prev.wallets.includes(wallet.id);
                                                    return {
                                                        ...prev,
                                                        wallets: exists
                                                            ? prev.wallets.filter(id => id !== wallet.id)
                                                            : [...prev.wallets, wallet.id]
                                                    };
                                                });
                                            }}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5
                                                ${localFilters.wallets.includes(wallet.id)
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                                                }
                                            `}
                                        >
                                            {localFilters.wallets.includes(wallet.id) && <Check className="w-3 h-3" />}
                                            {wallet.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Sorting Options */}
                            <div className="space-y-2">
                                {[
                                    { id: 'newest', label: 'Terbaru', icon: ArrowDownUp },
                                    { id: 'oldest', label: 'Terlama', icon: ArrowDownUp },
                                    { id: 'highest', label: 'Nominal Tertinggi', icon: SortAsc },
                                    { id: 'lowest', label: 'Nominal Terendah', icon: SortAsc },
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setLocalFilters({ ...localFilters, sortBy: opt.id })}
                                        className={`
                                            w-full flex items-center justify-between p-4 rounded-xl border transition-all
                                            ${localFilters.sortBy === opt.id
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${localFilters.sortBy === opt.id ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                                                <opt.icon className="w-4 h-4" />
                                            </div>
                                            <span className={`font-medium ${localFilters.sortBy === opt.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {opt.label}
                                            </span>
                                        </div>
                                        {localFilters.sortBy === opt.id && (
                                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        Terapkan Filter
                    </button>
                </div>
            </div>
        </div>
    );
}
