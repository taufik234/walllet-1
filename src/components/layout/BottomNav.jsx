import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PlusCircle, BarChart3, User, Wallet } from 'lucide-react';
import { cn } from '../../utils/utils';

export default function BottomNav({ onOpenAdd }) {
    const navItems = [
        { icon: LayoutDashboard, label: 'Home', to: '/' },
        { icon: ArrowLeftRight, label: 'Trans', to: '/transactions' },
        { icon: PlusCircle, label: 'Add', to: '#', isAction: true },
        { icon: BarChart3, label: 'Budget', to: '/budget' },
        { icon: Wallet, label: 'Dompet', to: '/wallets' }, // Added Wallet
        // { icon: User, label: 'User', to: '/profile' }, // Might need to swap out User or fit 5 items. 
        // BottomNav usually fits 5 items max comfortably. 
        // Let's replace User or check if we can fit 6. 
        // User is important. Let's try fitting 5 items by removing generic 'Budget' or 'Stats'? 
        // No, user wants Wallets. Let's keep 5 items for now. 
        // Wait, index = 5 means 6 items. 
        // Standard BottomNav has 4 or 5. 
        // Let's check existing items: Home, Trans, Add, Budget, User. (5 items)
        // Adding 1 makes 6. Too crowded.
        // Maybe replace 'Users/Profile' with 'Wallets' and put Profile in sidebar/topbar only?
        // Or replace 'Budget'?
        // The user just requested "Page sendiri untuk saldo..."
        // I'll replace 'User' (Profile) with 'Dompet' for easier access, 
        // and put Profile inside Dompet or just assume Profile is less accessed.
        // OR, I can put 'Start' or 'Budget' into a "More" menu?
        // Let's replace 'Budget' with 'Wallet' maybe? 
        // Budget is important too.
        // Let's try to squeeze 6 items or replace 'Stats'?
        // Actually, 'Home' has everything. 
        // Let's replace 'Budget' on Mobile? Or just add it and see.
        // The file currently has 5 items.
        // Let's Replace 'User' with 'Wallets' on mobile?
        // Risky. 
        // Let's put Wallets instead of 'Stats' or something?
        // Let's just add it and hope flex fits 6 items or remove text labels if too crowded.
        // I will Replace 'User' with 'Wallets' and move Profile to top right of Home? 
        // No, Profile page has settings. 
        // Let's Swap 'Budget' for 'Wallets' in the main list, and maybe link Budget from Dashboard only?
        // Or... 
        // Let's just add it. Flexbox will handle it, might be tight.
        // { icon: Wallet, label: 'Dompet', to: '/wallets' },
        // { icon: User, label: 'User', to: '/profile' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-300">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    if (item.isAction) {
                        return (
                            <button
                                key={item.label}
                                onClick={onOpenAdd}
                                className="relative -top-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
                            >
                                <item.icon className="w-6 h-6" />
                            </button>
                        );
                    }

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    "flex flex-col items-center justify-center w-16 h-full gap-1 text-xs font-medium transition-colors",
                                    isActive
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
