import { useState } from 'react';
import TransactionList from '@/components/transactions/TransactionList';
import SearchBar from '@/components/shared/SearchBar';
import DateFilter from '@/components/shared/MonthFilter';
import TypeFilter from '@/components/shared/TypeFilter';
import WalletFilter from '@/components/shared/WalletFilter';
import { Filter } from 'lucide-react';
import AdvancedSearchModal from '@/components/transactions/AdvancedSearchModal';
import { useTransactions } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';

export default function Transactions() {
  const { searchQuery, setSearchQuery, dateFilter, setDateFilter, typeFilter, setTypeFilter, walletFilter, setWalletFilter, advancedFilters } = useTransactions();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="pb-24 space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-1 h-5 rounded-full bg-primary" />
        <h1 className="text-lg font-semibold text-foreground">Transactions</h1>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <TypeFilter value={typeFilter} onChange={setTypeFilter} />
          <WalletFilter value={walletFilter} onChange={setWalletFilter} />
          <Button
            variant={advancedFilters.isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={16} strokeWidth={1.5} className="mr-1.5" />
            {advancedFilters.isActive ? 'Active' : 'Filter'}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1"><SearchBar value={searchQuery} onChange={setSearchQuery} /></div>
          {!advancedFilters.isActive && <DateFilter value={dateFilter} onChange={setDateFilter} />}
        </div>
      </div>
      <TransactionList />
      <AdvancedSearchModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
