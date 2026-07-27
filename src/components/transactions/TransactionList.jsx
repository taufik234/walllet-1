import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency, formatDate } from '@/utils/utils';
import { ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal';

export default function TransactionList() {
  const { filteredTransactions, deleteTransaction, openModal } = useTransactions();
  const [viewTx, setViewTx] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const visible = filteredTransactions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTransactions.length;

  if (filteredTransactions.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-card border border-border">
        <p className="text-sm text-muted-foreground">Belum ada transaksi</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Mulai catat keuanganmu sekarang!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {visible.map((trx) => {
        const cat = trx.category?.name || 'Others';
        const isInc = trx.type === 'income';
        return (
          <div
            key={trx._id}
            onClick={() => setViewTx(trx)}
            className="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-xl bg-card border border-border hover:border-ink-3 transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isInc ? 'bg-income/15 text-income' : 'bg-expense-bg text-expense'
            }`}>
              {isInc ? <ArrowUp size={16} strokeWidth={1.5} /> : <ArrowDown size={16} strokeWidth={1.5} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground capitalize truncate">{trx.note || cat}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-muted-foreground">{trx.wallet?.name || 'Cash'}</span>
                <span className="text-xs text-muted-foreground/40">&middot;</span>
                <span className="text-xs text-muted-foreground">{formatDate(trx.date)}</span>
              </div>
            </div>
            <p className={`text-sm font-semibold shrink-0 ${isInc ? 'text-income' : 'text-expense'}`}>
              {isInc ? '+' : '-'}{formatCurrency(trx.amount)}
            </p>
          </div>
        );
      })}
      {hasMore && (
        <button
          onClick={() => setVisibleCount(p => p + 10)}
          className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-center flex items-center justify-center gap-1.5"
        >
          <ChevronDown size={14} strokeWidth={1.5} />
          Load more ({filteredTransactions.length - visibleCount})
        </button>
      )}
      <TransactionDetailModal isOpen={!!viewTx} onClose={() => setViewTx(null)} transaction={viewTx} />
    </div>
  );
}
