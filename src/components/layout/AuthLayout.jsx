import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                <Outlet />
            </div>
            
            {/* Background decorative elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse"></div>
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse delay-700"></div>
            </div>
        </div>
    );
}
