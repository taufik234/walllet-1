import React from 'react';
import TransactionList from '../components/transactions/TransactionList';
import SearchBar from '../components/shared/SearchBar';
import DateFilter from '../components/shared/MonthFilter';
import TypeFilter from '../components/shared/TypeFilter';
import WalletFilter from '../components/shared/WalletFilter';
import { useTransactions } from '../context/TransactionContext';

export default function Transactions() {
    const { searchQuery, setSearchQuery, dateFilter, setDateFilter, typeFilter, setTypeFilter, walletFilter, setWalletFilter } = useTransactions();

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-white">Riwayat Transaksi</h1>

                {/* Type Filter (Tabs Style) */}
                <div className="self-start flex flex-col gap-2 w-full md:w-auto">
                    <TypeFilter value={typeFilter} onChange={setTypeFilter} />
                    <WalletFilter value={walletFilter} onChange={setWalletFilter} />
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-3">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <div className="flex-shrink-0">
                    <DateFilter value={dateFilter} onChange={setDateFilter} />
                </div>
            </div>

            <TransactionList />
        </div>
    );
}
