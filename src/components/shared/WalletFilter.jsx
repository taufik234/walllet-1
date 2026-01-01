import React from 'react';
import { Wallet, CreditCard, Smartphone, LayoutGrid } from 'lucide-react';
import { cn } from '../../utils/utils';
import { WALLETS } from '../../data/mockData';

export default function WalletFilter({ value, onChange }) {
    const options = [
        { id: 'all', label: 'Semua', icon: LayoutGrid },
        ...WALLETS.map(w => ({
            ...w,
            icon: w.id === 'cash' ? Wallet : w.id === 'bank' ? CreditCard : Smartphone
        }))
    ];

    return (
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800/50 overflow-x-auto no-scrollbar">
            {options.map((opt) => {
                const Icon = opt.icon;
                const isActive = value === opt.id;

                return (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                            isActive
                                ? "bg-white dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.1)] ring-1 ring-slate-200 dark:ring-indigo-500/50"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
                        )}
                    >
                        <Icon className={cn("w-3.5 h-3.5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-500")} />
                        <span>{opt.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
