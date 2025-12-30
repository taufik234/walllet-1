import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/utils';

export default function BalanceCard() {
    const { stats } = useTransactions();

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <p className="text-indigo-200 text-sm font-medium mb-1">Total Saldo</p>
            <h2 className="text-4xl font-bold tracking-tight">
                {formatCurrency(stats.totalBalance)}
            </h2>
            <div className="mt-4 flex items-center gap-2">
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                    Active Wallet
                </span>
            </div>
        </div>
    );
}
