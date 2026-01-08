import React, { useState } from 'react';
import TransactionList from '../components/transactions/TransactionList';
import SearchBar from '../components/shared/SearchBar';
import DateFilter from '../components/shared/MonthFilter';
import TypeFilter from '../components/shared/TypeFilter';
import WalletFilter from '../components/shared/WalletFilter';
import AdvancedSearchModal from '../components/transactions/AdvancedSearchModal';
import { useTransactions } from '../context/TransactionContext';
import { SlidersHorizontal } from 'lucide-react';

export default function Transactions() {
    const { searchQuery, setSearchQuery, dateFilter, setDateFilter, typeFilter, setTypeFilter, walletFilter, setWalletFilter, advancedFilters } = useTransactions();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="space-y-6 pb-24">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Riwayat Transaksi</h1>
                </div>

                {/* Type & Wallet Filter (Tabs Style) */}
                <div className="flex flex-col gap-3 w-full">
                    <TypeFilter value={typeFilter} onChange={setTypeFilter} />
                    <WalletFilter value={walletFilter} onChange={setWalletFilter} />
                </div>
            </div>

            {/* Search & Advanced Filter Row */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex gap-3">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`
                            px-4 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap
                            ${advancedFilters.isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
                        `}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        {advancedFilters.isActive ? 'Filter Aktif' : 'Filter'}
                    </button>
                </div>

                {/* Show Month Filter only if Advanced Search is NOT active */}
                {!advancedFilters.isActive && (
                    <div className="flex-shrink-0">
                        <DateFilter value={dateFilter} onChange={setDateFilter} />
                    </div>
                )}
            </div>

            <TransactionList />

            <AdvancedSearchModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />
        </div>
    );
}
