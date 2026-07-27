import { formatCurrency, formatDate } from '@/utils/utils';
import { ArrowLeftRight, ArrowUp, ArrowDown, PencilLine, Trash2 } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function TransactionDetailModal({ isOpen, onClose, transaction }) {
  const { deleteTransaction, deleteTransfer, openModal } = useTransactions();
  if (!isOpen || !transaction) return null;

  const isTransfer = !!transaction.transfer_pair_id;
  const isIncome = transaction.type === 'income';
  const walletLabel = transaction.wallet?.name || 'Cash';
  const catLabel = transaction.category?.name || 'Others';

  const handleDelete = () => {
    const msg = isTransfer ? 'Delete this transfer? Both sides will be removed.' : 'Delete this transaction?';
    if (window.confirm(msg)) { isTransfer ? deleteTransfer(transaction.transfer_pair_id) : deleteTransaction(transaction.id); onClose(); }
  };
  const handleEdit = () => { onClose(); setTimeout(() => openModal(transaction), 100); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <div className="flex flex-col items-center pb-5 border-b border-border">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${
            isTransfer
              ? 'bg-muted text-muted-foreground'
              : isIncome
                ? 'bg-income/15 text-income'
                : 'bg-expense-bg text-expense'
          }`}>
            {isTransfer ? <ArrowLeftRight size={24} strokeWidth={1.5} /> : isIncome ? <ArrowUp size={24} strokeWidth={1.5} /> : <ArrowDown size={24} strokeWidth={1.5} />}
          </div>
          <span className="text-xs font-medium text-muted-foreground mb-1">{isTransfer ? 'Transfer' : isIncome ? 'Income' : 'Expense'}</span>
          <p className="text-2xl font-bold text-foreground font-mono">{formatCurrency(transaction.amount)}</p>
        </div>

        <div className="space-y-3 pt-3">
          <Row label="Date" value={formatDate(transaction.date)} />
          <Row label={isTransfer ? 'Wallet' : 'Source'} value={walletLabel} />
          {!isTransfer && <Row label="Category" value={catLabel} />}
          {transaction.note && (
            <div className="pt-1">
              <p className="text-xs text-muted-foreground mb-1">Note</p>
              <p className="text-sm text-foreground bg-muted/50 rounded-xl px-3.5 py-2.5">"{transaction.note}"</p>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className={`grid gap-2 ${isTransfer ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {!isTransfer && (
            <Button variant="outline" onClick={handleEdit} className="gap-1.5">
              <PencilLine size={14} strokeWidth={1.5} /> Edit
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete} className={isTransfer ? 'col-span-full' : ''}>
            <Trash2 size={14} strokeWidth={1.5} className="mr-1.5" />
            Delete{isTransfer ? ' Transfer' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
