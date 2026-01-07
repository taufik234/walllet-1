import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Moon, Sun, User, PanelLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PAGE_TITLES = {
    '/': 'Dashboard',
    '/transactions': 'Transaksi',
    '/stats': 'Statistik',
    '/budget': 'Budget',
    '/goals': 'Goals',
    '/wallets': 'Dompet',
    '/profile': 'Profile',
};

export default function MobileHeader({ onMenuClick }) {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

    return (
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Sidebar Toggle & Title */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Open sidebar"
                    >
                        <PanelLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Profile Link */}
                    <Link
                        to="/profile"
                        className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm"
                    >
                        <User className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
