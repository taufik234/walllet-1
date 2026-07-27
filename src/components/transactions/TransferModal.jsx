import { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { ArrowLeftRight, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) { setFromWalletId(wallets[0]?._id || ''); setToWalletId(wallets[1]?._id || ''); setAmount(''); setDate(new Date().toISOString().split('T')[0]); setNote(''); setError(''); setSuccess(false); }
  }, [isOpen, wallets]);

  const na = (e) => { const r = e.target.value.replace(/\D/g,''); setAmount(r ? new Intl.NumberFormat('id-ID').format(r) : ''); };
  const num = Number(amount.replace(/\./g,''));
  const fromBalance = walletStats[fromWalletId] ?? 0;
  const swap = () => { const t = fromWalletId; setFromWalletId(toWalletId); setToWalletId(t); };
  const validate = () => { if (!fromWalletId || !toWalletId) return 'Pilih dompet asal dan tujuan.'; if (fromWalletId === toWalletId) return 'Dompet harus berbeda.'; if (!num || num <= 0) return 'Jumlah harus lebih dari 0.'; return ''; };
  const submit = async (e) => { e.preventDefault(); const err = validate(); if (err) { setError(err); return; } setError(''); setLoading(true); setSuccess(false); try { await addTransfer({ fromWalletId, toWalletId, amount: num, date, note: note || 'Transfer' }); setSuccess(true); setTimeout(onClose, 1200); } catch (err) { setError(err.message || 'Transfer gagal.'); } finally { setLoading(false); } };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor="transfer-from" className="block text-xs font-medium text-muted-foreground mb-1.5">Dari</label>
              <select id="transfer-from" value={fromWalletId} onChange={e => setFromWalletId(e.target.value)}
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {wallets.map(w => <option key={w._id} value={w._id} disabled={w._id === toWalletId}>{w.name}</option>)}
              </select>
              {fromWalletId && <p className="text-xs text-muted-foreground mt-1">Saldo: {formatCurrency(fromBalance)}</p>}
            </div>
            <button type="button" onClick={swap} aria-label="Tukar dompet asal dan tujuan"
              className="cursor-pointer mb-1 p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeftRight size={16} strokeWidth={1.5} />
            </button>
            <div className="flex-1">
              <label htmlFor="transfer-to" className="block text-xs font-medium text-muted-foreground mb-1.5">Ke</label>
              <select id="transfer-to" value={toWalletId} onChange={e => setToWalletId(e.target.value)}
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {wallets.map(w => <option key={w._id} value={w._id} disabled={w._id === fromWalletId}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="transfer-amount" className="block text-xs font-medium text-muted-foreground mb-1.5">Jumlah</label>
            <input id="transfer-amount" type="text" inputMode="numeric" value={amount} onChange={na} placeholder="0" autoFocus
              className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            {num > fromBalance && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Melebihi saldo dompet ({formatCurrency(fromBalance)})
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="transfer-date" className="block text-xs font-medium text-muted-foreground mb-1.5">Tanggal</label>
              <input id="transfer-date" type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label htmlFor="transfer-note" className="block text-xs font-medium text-muted-foreground mb-1.5">Catatan</label>
              <input id="transfer-note" type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Opsional"
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div role="status" className="flex items-center gap-2 rounded-lg bg-income/10 px-4 py-3 text-sm font-medium text-income">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Transfer berhasil!</span>
            </div>
          )}

          {fromWalletId && toWalletId && num > 0 && (
            <div className="bg-muted p-3 rounded-lg text-sm flex items-center gap-2">
              <span className="font-medium text-foreground">{wallets.find(w => w._id === fromWalletId)?.name}</span>
              <ArrowRight size={14} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="font-medium text-foreground">{wallets.find(w => w._id === toWalletId)?.name}</span>
              <span className="ml-auto font-semibold text-foreground">{formatCurrency(num)}</span>
            </div>
          )}

          <Button type="submit" disabled={loading || success || !num || fromWalletId === toWalletId} className="w-full">
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Memproses...</>
            ) : success ? 'Terkirim ✓' : 'Jalankan Transfer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
