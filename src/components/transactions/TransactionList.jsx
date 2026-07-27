import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency, formatDate } from '@/utils/utils';
import { ArrowUp, ArrowDown, ChevronDown, ArrowRightLeft, Search } from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal';

export default function TransactionList() {
  const { filteredTransactions } = useTransactions();
  const [viewTx, setViewTx] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const visible = filteredTransactions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTransactions.length;

  if (filteredTransactions.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center rounded-xl bg-card border border-border border-dashed">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Search size={28} strokeWidth={1.5} className="text-primary" />
        </div>
        <p className="text-base font-bold text-foreground mb-1">Belum ada transaksi</p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Mulai catat keuanganmu sekarang dengan menambahkan transaksi pertama!</p>
      </div>
    );
  }

  const incomeTotal = visible.filter(t => t.type === 'income').reduce((a, c) => a + Number(c.amount), 0);
  const expenseTotal = visible.filter(t => t.type === 'expense').reduce((a, c) => a + Number(c.amount), 0);

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      {visible.length > 0 && (
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground px-1">
          <span className="font-medium text-foreground">{visible.length} transaksi</span>
          {incomeTotal > 0 && <><span className="opacity-30" aria-hidden="true">|</span><span className="text-income font-semibold">+{formatCurrency(incomeTotal)}</span></>}
          {expenseTotal > 0 && <><span className="opacity-30" aria-hidden="true">|</span><span className="text-expense font-semibold">-{formatCurrency(expenseTotal)}</span></>}
        </div>
      )}

      {visible.map((trx, idx) => {
        const cat = trx.category?.name || 'Others';
        const isInc = trx.type === 'income';
        const isTransfer = !!trx.transfer_pair_id;
        return (
          <div
            key={trx._id}
            onClick={() => setViewTx(trx)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setViewTx(trx); } }}
            tabIndex={0}
            role="button"
            aria-label={`${isTransfer ? 'Transfer' : isInc ? 'Income' : 'Expense'} ${formatCurrency(trx.amount)}`}
            className="group px-4 py-3 flex items-center gap-3 rounded-xl bg-card border border-border hover:border-ink-3 hover:shadow-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring animate-in fade-in slide-in-from-bottom-1"
            style={{ animationDelay: `${idx * 30}ms`, animationFillMode: 'backwards' }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
              isTransfer
                ? 'bg-muted text-muted-foreground'
                : isInc
                  ? 'bg-income/15 text-income'
                  : 'bg-expense-bg text-expense'
            }`}>
              {isTransfer
                ? <ArrowRightLeft size={16} strokeWidth={1.5} />
                : isInc
                  ? <ArrowUp size={16} strokeWidth={1.5} />
                  : <ArrowDown size={16} strokeWidth={1.5} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground capitalize truncate">{trx.note || cat}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-muted-foreground">{trx.wallet?.name || 'Cash'}</span>
                <span className="text-xs text-muted-foreground/40" aria-hidden="true">&middot;</span>
                <span className="text-xs text-muted-foreground">{formatDate(trx.date)}</span>
                {cat !== (trx.note || 'Others') && (
                  <>
                    <span className="text-xs text-muted-foreground/40" aria-hidden="true">&middot;</span>
                    <span className="text-xs text-muted-foreground capitalize truncate max-w-[80px]">{cat}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-sm font-bold font-mono tabular-nums ${isTransfer ? 'text-muted-foreground' : isInc ? 'text-income' : 'text-expense'}`}>
                {isTransfer ? '' : isInc ? '+' : '-'}{formatCurrency(trx.amount)}
              </p>
            </div>
          </div>
        );
      })}

      {hasMore && (
        <button
          onClick={() => setVisibleCount(p => p + 10)}
          className="w-full py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 border border-border border-dashed"
        >
          <ChevronDown size={14} strokeWidth={1.5} />
          Load more ({filteredTransactions.length - visibleCount} remaining)
        </button>
      )}

      <TransactionDetailModal isOpen={!!viewTx} onClose={() => setViewTx(null)} transaction={viewTx} />
    </div>
  );
}
