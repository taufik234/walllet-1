import React, { useState, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, cn } from '../utils/utils';
import { Target, Plus, Trash2, TrendingUp, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import AddGoalModal from '../components/shared/AddGoalModal';
import AddSavingsModal from '../components/goals/AddSavingsModal';
import { goalService } from '../lib/services';

// Icon mapping for goals
const GOAL_ICONS = {
    Target: Target,
    TrendingUp: TrendingUp,
    Sparkles: Sparkles,
};

export default function Goals() {
    const { goals, refetch } = useTransactions();
    const [activeTab, setActiveTab] = useState('active');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);

    const filteredGoals = useMemo(() => {
        if (activeTab === 'active') {
            return goals.filter(g => g.status === 'active');
        }
        return goals.filter(g => g.status === 'completed');
    }, [goals, activeTab]);

    const handleAddSavings = (goal) => {
        setSelectedGoal(goal);
        setIsSavingsModalOpen(true);
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus goal ini?')) {
            try {
                await goalService.delete(id);
                refetch();
            } catch (error) {
                console.error('Error deleting goal:', error);
            }
        }
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setEditingGoal(null);
    };

    const handleCloseSavingsModal = () => {
        setIsSavingsModalOpen(false);
        setSelectedGoal(null);
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-emerald-500';
        if (percentage >= 75) return 'bg-emerald-400';
        if (percentage >= 50) return 'bg-amber-400';
        if (percentage >= 25) return 'bg-orange-400';
        return 'bg-rose-400';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Goals</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Kelola target tabungan dan wishlist kamu
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Goal</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('active')}
                    className={cn(
                        "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                        activeTab === 'active'
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Aktif</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={cn(
                        "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                        activeTab === 'completed'
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tercapai</span>
                    </div>
                </button>
            </div>

            {/* Goals Grid */}
            {filteredGoals.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Target className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                        {activeTab === 'active' ? 'Belum ada goal aktif' : 'Belum ada goal tercapai'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        {activeTab === 'active'
                            ? 'Mulai tetapkan target tabunganmu sekarang!'
                            : 'Goal yang sudah tercapai akan muncul di sini'}
                    </p>
                    {activeTab === 'active' && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Buat Goal Pertama</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGoals.map((goal) => {
                        const percentage = goal.target_amount > 0
                            ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
                            : 0;
                        const remaining = goal.target_amount - goal.current_amount;
                        const IconComponent = GOAL_ICONS[goal.icon] || Target;

                        return (
                            <div
                                key={goal.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center",
                                            goal.status === 'completed'
                                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                                : "bg-indigo-100 dark:bg-indigo-900/30"
                                        )}>
                                            <IconComponent className={cn(
                                                "w-6 h-6",
                                                goal.status === 'completed'
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-indigo-600 dark:text-indigo-400"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {goal.name}
                                            </h3>
                                            {goal.deadline && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Target: {new Date(goal.deadline).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {goal.status === 'completed' && (
                                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                                            ✓ Tercapai
                                        </span>
                                    )}
                                </div>

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-500", getProgressColor(percentage))}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Terkumpul</p>
                                        <p className="font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(goal.current_amount)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Target</p>
                                        <p className="font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(goal.target_amount)}
                                        </p>
                                    </div>
                                </div>

                                {/* Remaining */}
                                {goal.status === 'active' && remaining > 0 && (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Kurang</p>
                                        <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                                            {formatCurrency(remaining)}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {goal.status === 'active' && (
                                        <button
                                            onClick={() => handleAddSavings(goal)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Tambah</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(goal)}
                                        className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-all"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(goal.id)}
                                        className="px-3 py-2.5 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <AddGoalModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                editingGoal={editingGoal}
            />
            <AddSavingsModal
                isOpen={isSavingsModalOpen}
                onClose={handleCloseSavingsModal}
                goal={selectedGoal}
            />
        </div>
    );
}
