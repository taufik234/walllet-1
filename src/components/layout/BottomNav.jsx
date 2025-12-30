import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PlusCircle, BarChart3, User } from 'lucide-react';
import { cn } from '../../utils/utils';

export default function BottomNav({ onOpenAdd }) {
    const navItems = [
        { icon: LayoutDashboard, label: 'Home', to: '/' },
        { icon: ArrowLeftRight, label: 'Trans', to: '/transactions' },
        { icon: PlusCircle, label: 'Add', to: '#', isAction: true },
        { icon: BarChart3, label: 'Budget', to: '/budget' },
        { icon: User, label: 'User', to: '/profile' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 pb-safe z-50">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    if (item.isAction) {
                        return (
                            <button
                                key={item.label}
                                onClick={onOpenAdd}
                                className="relative -top-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg shadow-indigo-500/30 transition-transform active:scale-95"
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
                                    isActive ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
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
