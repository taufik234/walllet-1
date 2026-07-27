import { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { ArrowLeftRight, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function TransferModal({ isOpen, onClose }) {
  const { wallets, walletStats, addTransfer } = useTransactions();
  const [fromWalletId, setFromWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) { setFromWalletId(wallets[0]?._id || ''); setToWalletId(wallets[1]?._id || ''); setAmount(''); setDate(new Date().toISOString().split('T')[0]); setNote(''); setError(''); }
  }, [isOpen, wallets]);

  const na = (e) => { const r = e.target.value.replace(/\D/g,''); setAmount(r ? new Intl.NumberFormat('id-ID').format(r) : ''); };
  const num = Number(amount.replace(/\./g,''));
  const fromBalance = walletStats[fromWalletId] ?? 0;
  const swap = () => { const t = fromWalletId; setFromWalletId(toWalletId); setToWalletId(t); };
  const validate = () => { if (!fromWalletId || !toWalletId) return 'Select source and destination.'; if (fromWalletId === toWalletId) return 'Wallets must differ.'; if (!num || num <= 0) return 'Amount must be > 0.'; return ''; };
  const submit = async (e) => { e.preventDefault(); const err = validate(); if (err) { setError(err); return; } setError(''); setLoading(true); try { await addTransfer({ fromWalletId, toWalletId, amount: num, date, note: note || 'Transfer' }); onClose(); } catch (err) { setError(err.message || 'Failed.'); } finally { setLoading(false); } };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">From</label>
              <select value={fromWalletId} onChange={e => setFromWalletId(e.target.value)}
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {wallets.map(w => <option key={w._id} value={w._id} disabled={w._id === toWalletId}>{w.name}</option>)}
              </select>
              {fromWalletId && <p className="text-xs text-muted-foreground mt-1">Balance: {formatCurrency(walletStats[fromWalletId] ?? 0)}</p>}
            </div>
            <button type="button" onClick={swap}
              className="mb-1 p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeftRight size={16} strokeWidth={1.5} />
            </button>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">To</label>
              <select value={toWalletId} onChange={e => setToWalletId(e.target.value)}
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {wallets.map(w => <option key={w._id} value={w._id} disabled={w._id === fromWalletId}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Amount</label>
            <input type="text" inputMode="numeric" value={amount} onChange={na} placeholder="0" autoFocus
              className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            {fromBalance > 0 && num > fromBalance && <p className="text-xs text-destructive mt-1">Exceeds source balance</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Note</label>
              <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Optional"
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          {error && <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>}

          {fromWalletId && toWalletId && num > 0 && (
            <div className="bg-muted p-3 rounded-lg text-sm flex items-center gap-2">
              <span className="font-medium text-foreground">{wallets.find(w => w._id === fromWalletId)?.name}</span>
              <ArrowRight size={14} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="font-medium text-foreground">{wallets.find(w => w._id === toWalletId)?.name}</span>
              <span className="ml-auto font-semibold text-foreground">{formatCurrency(num)}</span>
            </div>
          )}

          <Button type="submit" disabled={loading || !num || fromWalletId === toWalletId} className="w-full">
            {loading ? 'Processing…' : 'Execute Transfer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
