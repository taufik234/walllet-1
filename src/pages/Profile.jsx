import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Download, Upload, Trash2, Moon, Sun, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { transactions, theme, toggleTheme, resetBudget } = useTransactions();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleExport = () => {
        if (!transactions || transactions.length === 0) {
            alert('Belum ada data transaksi untuk diekspor.');
            return;
        }
        const dataStr = JSON.stringify(transactions, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `finance_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    if (window.confirm(`Ditemukan ${importedData.length} transaksi. Data yang ada sekarang akan DITIMPA. Lanjutkan?`)) {
                        localStorage.setItem('transactions', JSON.stringify(importedData));
                        alert('Import berhasil! Aplikasi akan dimuat ulang.');
                        window.location.reload();
                    }
                } else {
                    alert('Format file tidak valid. Harap gunakan file JSON hasil export.');
                }
            } catch (error) {
                alert('Gagal membaca file JSON.');
            }
        };
        reader.readAsText(file);
    };

    const handleFactoryReset = () => {
        if (window.confirm('PERINGATAN: Semua data transaksi dan budget akan DIHAPUS PERMANEN. Tindakan ini tidak bisa dibatalkan.\n\nApakah anda yakin?')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Profile & Settings</h1>

            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-4 transition-colors duration-300 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
                    JD
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">John Doe</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Free Plan</p>
                </div>
            </div>

            {/* Appearance */}
            <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">Tampilan</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors duration-300 shadow-sm">
                    <button
                        onClick={toggleTheme}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </div>
                            <span className="text-slate-700 dark:text-slate-200 font-medium">Tema Aplikasi</span>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full capitalize">
                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Data Management */}
            <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">Manajemen Data</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">

                    {/* Export */}
                    <button
                        onClick={handleExport}
                        className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                    >
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-600 group-hover:text-emerald-600 dark:group-hover:text-white transition-colors text-slate-500 dark:text-slate-400">
                            <Download className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <span className="text-slate-900 dark:text-slate-200 font-medium block">Backup Data (JSON)</span>
                            <span className="text-xs text-slate-500">Download data transaksi ke file JSON</span>
                        </div>
                    </button>

                    {/* Import */}
                    <label className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group cursor-pointer">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-500/10 dark:group-hover:bg-blue-600 group-hover:text-blue-600 dark:group-hover:text-white transition-colors text-slate-500 dark:text-slate-400">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <span className="text-slate-900 dark:text-slate-200 font-medium block">Restore Data</span>
                            <span className="text-xs text-slate-500">Upload file JSON backup</span>
                        </div>
                        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>
                </div>
            </div>


            {/* Account Management */}
            <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">Akun</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors duration-300 shadow-sm">
                    <button
                        onClick={handleLogout}
                        className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                    >
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-slate-500 dark:text-slate-400">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <span className="text-slate-900 dark:text-slate-200 font-medium block">Keluar Aplikasi</span>
                            <span className="text-xs text-slate-500">Log out dari akun anda</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-2">
                <h3 className="text-xs font-bold text-rose-500 px-2 uppercase tracking-wider">Danger Zone</h3>
                <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl overflow-hidden transition-colors duration-300 shadow-sm">
                    <button
                        onClick={handleFactoryReset}
                        className="w-full p-4 flex items-center gap-3 hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-colors text-left group"
                    >
                        <div className="p-2 bg-rose-500/10 dark:bg-rose-500/20 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-colors text-rose-600 dark:text-rose-500">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <span className="text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 font-medium block">Factory Reset</span>
                            <span className="text-xs text-rose-500/80 group-hover:text-rose-600/90 dark:group-hover:text-rose-400/80">Hapus semua data & reset ke setelan awal</span>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            <div className="text-center text-xs text-slate-500 dark:text-slate-600 pt-8 transition-colors duration-300">
                Finance Dashboard v1.0.0
            </div>
        </div>
    );
}
