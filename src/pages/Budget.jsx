import React, { useState, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, cn } from '../utils/utils';
import { Pencil, AlertCircle, Plus, Trash2 } from 'lucide-react';
import AddBudgetModal from '../components/shared/AddBudgetModal';

export default function Budget() {
    const { budgetStats, deleteBudget, budgets, resetBudget, categories } = useTransactions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Calculate Global Budget Stats (Main Budget)
    const globalStats = useMemo(() => {
        const totalLimit = budgetStats.reduce((acc, curr) => acc + Number(curr.limit_amount || 0), 0);
        const totalSpent = budgetStats.reduce((acc, curr) => acc + Number(curr.spent || 0), 0);
        const totalRemaining = totalLimit - totalSpent;
        const percentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

        return { totalLimit, totalSpent, totalRemaining, percentage };
    }, [budgetStats]);

    // Check if we can add more budgets (if valid categories left)
    const canAddMore = useMemo(() => {
        const expenseCategories = categories?.expense || [];
        const budgetedCats = budgets.length;
        return expenseCategories.length > budgetedCats;
    }, [budgets, categories]);

    const handleOpenAdd = () => {
        setEditData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (categoryId, limit) => {
        setEditData({ category: categoryId, limit });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditData(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Target Anggaran</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (window.confirm('Reset progress budget bulan ini? Transaksi tidak akan dihapus, tetapi perhitungan "terpakai" akan dimulai dari nol.')) {
                                resetBudget();
                            }
                        }}
                        className="text-xs text-rose-500 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                    >
                        Reset
                    </button>
                    <div className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
                        {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Main Budget Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 shadow-2xl shadow-indigo-500/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <h2 className="text-indigo-100 font-medium mb-1">Total Anggaran Bulanan</h2>
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-4xl font-bold">{formatCurrency(globalStats.totalLimit)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-indigo-200 text-xs mb-1">Terpakai</p>
                            <p className="font-bold text-lg">{formatCurrency(globalStats.totalSpent)}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-indigo-200 text-xs mb-1">Sisa</p>
                            <p className="font-bold text-lg">{formatCurrency(globalStats.totalRemaining)}</p>
                        </div>
                    </div>

                    <div className="relative pt-2">
                        <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
                            <span>Progress</span>
                            <span>{globalStats.percentage.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    globalStats.percentage > 100 ? "bg-rose-400" : "bg-white"
                                )}
                                style={{ width: `${Math.min(globalStats.percentage, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-Budgets List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Rincian Per Kategori</h2>
                    {canAddMore && (
                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Budget
                        </button>
                    )}
                </div>

                <div className="grid gap-4">
                    {budgetStats.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 dark:hover:border-slate-700 transition-all group/card shadow-sm dark:shadow-none">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                                        {item.category?.name || 'Unknown'}
                                        {item.isOver && <AlertCircle className="w-5 h-5 text-rose-500" />}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                        Terpakai: <span className={item.isOver ? 'text-rose-500 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-200'}>{formatCurrency(item.spent)}</span>
                                    </p>
                                </div>

                                <div className="text-right flex items-start gap-3">
                                    <div className="flex flex-col items-end">
                                        <div
                                            className="group flex items-center gap-2 justify-end cursor-pointer"
                                            onClick={() => handleOpenEdit(item.category_id, item.limit_amount)}
                                        >
                                            <span className="text-slate-500 dark:text-slate-400 text-sm">Target:</span>
                                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{formatCurrency(item.limit_amount)}</span>
                                            <Pencil className="w-3 h-3 text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-all" />
                                        </div>
                                        <p className={cn("text-xs mt-1", item.remaining < 0 ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400")}>
                                            {item.remaining < 0 ? `Over: ${formatCurrency(Math.abs(item.remaining))}` : `Sisa: ${formatCurrency(item.remaining)}`}
                                        </p>
                                    </div>

                                    {/* Delete Button (Always Visible) */}
                                    <button
                                        onClick={() => deleteBudget(item.id || item.category_id)}
                                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors"
                                        title="Hapus Budget"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden relative">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        item.isOver ? "bg-rose-500" :
                                            item.percentage > 80 ? "bg-amber-400" : "bg-emerald-500"
                                    )}
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {budgetStats.length === 0 && (
                    <div className="text-center py-10 text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <p className="mb-2">Belum ada target anggaran.</p>
                        <button
                            onClick={handleOpenAdd}
                            className="text-indigo-500 dark:text-indigo-400 hover:underline"
                        >
                            Buat sekarang
                        </button>
                    </div>
                )}
            </div>

            <AddBudgetModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editData={editData}
            />
        </div>
    );
}
