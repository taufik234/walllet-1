import React from 'react';
import { Wallet, CreditCard, Smartphone } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/utils';
import { WALLETS } from '../../data/mockData';
import { Link } from 'react-router-dom';

export default function WalletCards() {
    const { walletStats } = useTransactions();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {WALLETS.map((wallet) => {
                const Icon = wallet.id === 'cash' ? Wallet : wallet.id === 'bank' ? CreditCard : Smartphone;
                const balance = walletStats[wallet.id] || 0;

                return (
                    <Link
                        key={wallet.id}
                        to="/wallets"
                        className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-row md:flex-col items-center justify-between md:justify-center text-center hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all active:scale-95 cursor-pointer group"
                    >
                        <div className="flex items-center gap-4 md:flex-col md:gap-2">
                            <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                <Icon className="w-6 h-6 md:w-5 md:h-5" />
                            </div>
                            <div className="text-left md:text-center">
                                <span className="text-xs text-slate-500 font-medium group-hover:text-slate-400 block">{wallet.label}</span>
                                {/* Mobile: Show balance here */}
                                <span className="text-lg font-bold text-white md:hidden">
                                    {formatCurrency(balance)}
                                </span>
                            </div>
                        </div>

                        {/* Desktop: Show balance at bottom */}
                        <span className="hidden md:block text-sm sm:text-base font-bold text-white truncate w-full px-1">
                            {formatCurrency(balance)}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
