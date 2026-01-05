import React, { useState, useEffect } from 'react';
import { X, Target, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '../../utils/utils';
import { goalService } from '../../lib/services';
import { useTransactions } from '../../context/TransactionContext';

const ICON_OPTIONS = [
    { value: 'Target', icon: Target, label: 'Target' },
    { value: 'TrendingUp', icon: TrendingUp, label: 'Trending' },
    { value: 'Sparkles', icon: Sparkles, label: 'Sparkles' },
];

export default function AddGoalModal({ isOpen, onClose, editingGoal }) {
    const { refetch } = useTransactions();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        target_amount: '',
        deadline: '',
        icon: 'Target',
    });

    useEffect(() => {
        if (editingGoal) {
            setFormData({
                name: editingGoal.name || '',
                target_amount: editingGoal.target_amount || '',
                deadline: editingGoal.deadline || '',
                icon: editingGoal.icon || 'Target',
            });
        } else {
            setFormData({
                name: '',
                target_amount: '',
                deadline: '',
                icon: 'Target',
            });
        }
    }, [editingGoal, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.target_amount) return;

        setLoading(true);
        try {
            const goalData = {
                name: formData.name,
                target_amount: parseFloat(formData.target_amount),
                deadline: formData.deadline || null,
                icon: formData.icon,
            };

            if (editingGoal) {
                await goalService.update(editingGoal.id, goalData);
            } else {
                await goalService.create(goalData);
            }

            refetch();
            onClose();
        } catch (error) {
            console.error('Error saving goal:', error);
            alert('Gagal menyimpan goal');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {editingGoal ? 'Edit Goal' : 'Tambah Goal Baru'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Nama Goal
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Contoh: iPhone 16 Pro"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Target Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Target Jumlah
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                            <input
                                type="number"
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                                placeholder="0"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Target Tanggal <span className="text-slate-400">(opsional)</span>
                        </label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Icon Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Pilih Ikon
                        </label>
                        <div className="flex gap-3">
                            {ICON_OPTIONS.map((option) => {
                                const IconComponent = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon: option.value })}
                                        className={cn(
                                            "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                            formData.icon === option.value
                                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                        )}
                                    >
                                        <IconComponent className={cn(
                                            "w-6 h-6",
                                            formData.icon === option.value
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-slate-400"
                                        )} />
                                        <span className={cn(
                                            "text-xs font-medium",
                                            formData.icon === option.value
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-slate-500"
                                        )}>
                                            {option.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !formData.name || !formData.target_amount}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                    >
                        {loading ? 'Menyimpan...' : (editingGoal ? 'Simpan Perubahan' : 'Buat Goal')}
                    </button>
                </form>
            </div>
        </div>
    );
}
