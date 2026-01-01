import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Layers } from 'lucide-react';
import { cn } from '../../utils/utils';

export default function TypeFilter({ value, onChange }) {
    const options = [
        { id: 'all', label: 'Semua', icon: Layers, color: 'text-slate-400' },
        { id: 'income', label: 'Pemasukan', icon: ArrowUpCircle, color: 'text-emerald-400' },
        { id: 'expense', label: 'Pengeluaran', icon: ArrowDownCircle, color: 'text-rose-400' }
    ];

    return (
        <div className="grid grid-cols-3 w-full bg-slate-900/50 p-1 rounded-2xl border border-slate-800/50">
            {options.map((opt) => {
                const Icon = opt.icon;
                const isActive = value === opt.id;

                return (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        className={cn(
                            "flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all sm:gap-2 sm:px-4",
                            isActive
                                ? "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.1)]"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        )}
                    >
                        <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isActive ? "text-indigo-400" : opt.color)} />
                        <span className="truncate">{opt.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
