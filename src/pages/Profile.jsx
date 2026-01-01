import React from 'react';
import { User, Settings, LogOut, Download } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

export default function Profile() {
    const { transactions } = useTransactions();

    const handleExport = () => {
        if (!transactions || transactions.length === 0) {
            alert('Belum ada data transaksi untuk diekspor.');
            return;
        }

        // CSV Header
        const headers = ["Tanggal", "Tipe", "Kategori", "Jumlah", "Catatan"];

        // CSV Rows
        const rows = transactions.map(t => [
            t.date,
            t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
            `"${t.category}"`, // Quote category to handle potential commas
            t.amount,
            `"${t.note || ''}"` // Quote note
        ]);

        // Combine
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        // Create Blob and Link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `finance_data_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-white">Profile & Settings</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
                    JD
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">John Doe</h2>
                    <p className="text-slate-500">Premium Member</p>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400 px-2 uppercase tracking-wider">Umum</h3>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                    <button className="w-full p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left group">
                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors text-slate-400">
                            <Settings className="w-5 h-5" />
                        </div>
                        <span className="text-slate-200 font-medium">Pengaturan Aplikasi</span>
                    </button>

                    <button
                        onClick={handleExport}
                        className="w-full p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left group"
                    >
                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors text-slate-400">
                            <Download className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <span className="text-slate-200 font-medium block">Export Data (CSV)</span>
                            <span className="text-xs text-slate-500">Simpan riwayat transaksi ke Excel</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400 px-2 uppercase tracking-wider">Akun</h3>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <button className="w-full p-4 flex items-center gap-3 hover:bg-rose-500/10 transition-colors text-left group">
                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-colors text-slate-400">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="text-slate-200 font-medium group-hover:text-rose-500">Keluar Aplikasi</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
