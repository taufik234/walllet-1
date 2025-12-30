import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';

export default function Profile() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Profile</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                    JD
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">John Doe</h2>
                    <p className="text-slate-500">Premium Member</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors cursor-pointer border-b border-slate-800">
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-200">Pengaturan</span>
                </div>
                <div className="p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors cursor-pointer text-rose-400">
                    <LogOut className="w-5 h-5" />
                    <span>Keluar</span>
                </div>
            </div>
        </div>
    );
}
