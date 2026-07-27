import { Link } from 'react-router-dom';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency, formatDate } from '@/utils/utils';
import { ArrowUp, ArrowDown, FileText, ArrowRight } from 'lucide-react';

export default function RecentTransactions() {
  const { filteredTransactions, openModal } = useTransactions();
  const recent = filteredTransactions.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground">Recent Transactions</h3>
        <Link
          to="/transactions"
          className="text-[11px] sm:text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          See all
          <ArrowRight size={12} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        {recent.map((trx) => {
          const cat = trx.category?.name || 'Others';
          return (
            <div
              key={trx._id}
              onClick={() => openModal(trx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(trx); } }}
              tabIndex={0}
              role="button"
              aria-label={`${trx.type === 'income' ? 'Income' : 'Expense'} ${formatCurrency(trx.amount)} - ${trx.note || cat}`}
              className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3 rounded-xl bg-card border border-border hover:border-ink-3 hover:shadow-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                trx.type === 'income'
                  ? 'bg-income/15 text-income'
                  : 'bg-expense-bg text-expense'
              }`} aria-hidden="true">
                {trx.type === 'income'
                  ? <ArrowUp size={14} strokeWidth={1.5} />
                  : <ArrowDown size={14} strokeWidth={1.5} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground capitalize truncate">{trx.note || cat}</p>
                <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                  <span className="text-[11px] sm:text-xs text-muted-foreground">{formatDate(trx.date)}</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground/40" aria-hidden="true">&middot;</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground capitalize">{cat}</span>
                </div>
              </div>
              <p className={`text-xs sm:text-sm font-semibold shrink-0 ${
                trx.type === 'income' ? 'text-income' : 'text-expense'
              }`}>
                {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
              </p>
            </div>
          );
        })}
        {recent.length === 0 && (
          <div className="p-6 sm:p-8 text-center rounded-xl bg-card border border-border">
            <FileText size={32} strokeWidth={1} className="text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">No transactions yet</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground/60 mt-1">Add your first transaction to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
