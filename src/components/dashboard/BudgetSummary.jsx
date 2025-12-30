import React, { useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency, cn } from '../../utils/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BudgetSummary() {
    const { budgetStats } = useTransactions();

    const globalStats = useMemo(() => {
        const totalLimit = budgetStats.reduce((acc, curr) => acc + curr.limit, 0);
        const totalSpent = budgetStats.reduce((acc, curr) => acc + curr.spent, 0);
        const totalRemaining = totalLimit - totalSpent;
        const percentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

        return { totalLimit, totalSpent, totalRemaining, percentage };
    }, [budgetStats]);

    if (globalStats.totalLimit === 0) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Target Anggaran</h3>
                </div>
                <div className="text-center py-6">
                    <p className="text-slate-400 text-sm mb-4">Belum ada target anggaran yang diatur.</p>
                    <Link to="/budget" className="text-indigo-400 text-sm font-medium hover:underline">
                        Atur Budget Sekarang
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Target Anggaran</h3>
                <Link to="/budget" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Lihat Detail <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-slate-400 text-sm">Total Budget</span>
                        <span className="text-white font-bold">{formatCurrency(globalStats.totalLimit)}</span>
                    </div>
                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                globalStats.percentage > 100 ? "bg-rose-500" :
                                    globalStats.percentage > 80 ? "bg-amber-400" : "bg-emerald-500"
                            )}
                            style={{ width: `${Math.min(globalStats.percentage, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Terpakai</p>
                        <p className={cn("font-bold", globalStats.percentage > 100 ? "text-rose-400" : "text-white")}>
                            {formatCurrency(globalStats.totalSpent)}
                        </p>
                    </div>
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Sisa</p>
                        <p className={cn("font-bold", globalStats.totalRemaining < 0 ? "text-rose-400" : "text-emerald-400")}>
                            {formatCurrency(globalStats.totalRemaining)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
