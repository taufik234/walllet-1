import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Car, Coffee, ShoppingBag, Zap, Briefcase, ArrowLeftRight } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';

export default function QuickActions() {
    const { openModal } = useTransactions();
    const navigate = useNavigate();

    const actions = [
        {
            label: 'Makan',
            icon: Utensils,
            color: 'text-orange-400 bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50',
            data: { type: 'expense', category: 'makan', note: 'Makan Siang', amount: 30000, wallet: 'cash' }
        },
        {
            label: 'Transport',
            icon: Car,
            color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
            data: { type: 'expense', category: 'transport', note: 'Bensin / Ojol', amount: 20000, wallet: 'ewallet' }
        },
        {
            label: 'Kopi',
            icon: Coffee,
            color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50',
            data: { type: 'expense', category: 'makan', note: 'Ngopi', amount: 25000, wallet: 'ewallet' }
        },
        {
            label: 'Mart',
            icon: ShoppingBag,
            color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50',
            data: { type: 'expense', category: 'belanja', note: 'Minimarket', amount: 50000, wallet: 'cash' }
        },
        {
            label: 'Tagihan',
            icon: Zap,
            color: 'text-violet-400 bg-violet-500/10 border-violet-500/20 hover:border-violet-500/50',
            data: { type: 'expense', category: 'tagihan', note: 'Listrik / Air', amount: 100000, wallet: 'bank' }
        },
    ];

    const handleAction = (data) => {
        // Set date to today explicitly
        const today = new Date().toISOString().split('T')[0];
        openModal({ ...data, date: today }, true); // true = isPreset
    };

    return (
        <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 px-1">Aksi Cepat</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {/* Transaction History Shortcut */}
                <button
                    onClick={() => navigate('/transactions')}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-all active:scale-95 whitespace-nowrap"
                >
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <ArrowLeftRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-bold">Riwayat</span>
                </button>

                {actions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={idx}
                            onClick={() => handleAction(action.data)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all active:scale-95 whitespace-nowrap bg-white dark:bg-transparent shadow-sm dark:shadow-none ${action.color}`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{action.label}</span>
                        </button>
                    );
                })}
            </div>
            {/* Scroll indicator hint if needed, but horizontal scroll is standard on mobile */}
        </div>
    );
}
