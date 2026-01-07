import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart3, User, Wallet, Plus, PieChart, Target } from 'lucide-react';
import { cn, formatCurrency } from '../../utils/utils';
import { useTransactions } from '../../context/TransactionContext';

export default function Sidebar({ onOpenAdd, isOpen, onClose }) {
    const { stats } = useTransactions();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: ArrowLeftRight, label: 'Transaksi', to: '/transactions' },
        { icon: BarChart3, label: 'Statistik', to: '/stats' },
        { icon: PieChart, label: 'Budget', to: '/budget' },
        { icon: Target, label: 'Goals', to: '/goals' },
        { icon: Wallet, label: 'Dompet', to: '/wallets' },
        { icon: User, label: 'Profile', to: '/profile' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out",
                "lg:fixed lg:translate-x-0 lg:inset-y-0 lg:left-0", // Desktop: Fixed and always visible
                isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full" // Mobile: Toggle visibility
            )}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">FinDashboard</h1>
                        </div>
                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 -mr-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>

                    <div className="hidden lg:block bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors duration-300">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Saldo</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{formatCurrency(stats?.totalBalance || 0)}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => onClose()} // Close sidebar on navigate (mobile)
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                                )
                            }
                        >
                            <item.icon className={cn("w-5 h-5 transition-colors")} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden lg:block p-4 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">
                    <button
                        onClick={onOpenAdd}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Input Transaksi</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
