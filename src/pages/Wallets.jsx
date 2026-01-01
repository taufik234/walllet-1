import React, { useState } from 'react';
import { Wallet, CreditCard, Smartphone, ArrowRight, Plus } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, cn } from '../utils/utils';
import { WALLETS } from '../data/mockData';
import AdjustBalanceModal from '../components/dashboard/AdjustBalanceModal';
import { Link } from 'react-router-dom';

export default function Wallets() {
    const { walletStats, transactions } = useTransactions();
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

    const handleAdjustClick = (walletId) => {
        setSelectedWallet(walletId);
        setIsAdjustModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-white">Dompet Saya</h1>

            {/* Wallet Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {WALLETS.map((wallet) => {
                    const Icon = wallet.id === 'cash' ? Wallet : wallet.id === 'bank' ? CreditCard : Smartphone;
                    const balance = walletStats[wallet.id] || 0;

                    // Get recent transactions for this wallet
                    const recentTx = transactions
                        .filter(t => (t.wallet || 'cash') === wallet.id)
                        .slice(0, 3); // Last 3

                    return (
                        <div key={wallet.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-indigo-500/30 transition-all group">
                            {/* Card Header & Balance */}
                            <div className="p-6 flex-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{wallet.label}</h2>
                                        <p className="text-sm text-slate-500">Saldo saat ini</p>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-white tracking-tight">
                                        {formatCurrency(balance)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleAdjustClick(wallet.id)}
                                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                                >
                                    Atur Saldo Manual <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Recent Activity Mini-List */}
                            <div className="bg-slate-950/50 p-4 border-t border-slate-800">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Aktivitas Terakhir</p>
                                <div className="space-y-3">
                                    {recentTx.length > 0 ? (
                                        recentTx.map(t => (
                                            <div key={t.id} className="flex justify-between items-center text-sm">
                                                <span className="text-slate-300 truncate max-w-[60%]">{t.note}</span>
                                                <span className={t.type === 'income' ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-600 italic">Belum ada transaksi</p>
                                    )}
                                </div>
                                {recentTx.length > 0 && (
                                    <Link to="/transactions" className="block mt-4 text-center text-xs text-slate-500 hover:text-white transition-colors">
                                        Lihat semua transaksi →
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AdjustBalanceModal
                isOpen={isAdjustModalOpen}
                onClose={() => setIsAdjustModalOpen(false)}
                walletId={selectedWallet}
                currentBalance={selectedWallet ? walletStats[selectedWallet] : 0}
            />
        </div>
    );
}
