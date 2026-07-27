import { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/utils';

export default function AdjustBalanceModal({ isOpen, onClose, walletId, currentBalance }) {
  const { addTransaction, wallets, categories } = useTransactions();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && currentBalance !== undefined) {
      setAmount(new Intl.NumberFormat('id-ID').format(currentBalance));
      setError('');
      setLoading(false);
    }
  }, [isOpen, currentBalance]);

  const walletLabel = wallets.find(w => w._id === walletId)?.name || 'Wallet';

  const handleAmountChange = (e) => {
    const { selectionStart, value } = e.target;
    const raw = value.replace(/\D/g, '');
    const formatted = raw ? new Intl.NumberFormat('id-ID').format(raw) : '';
    const diff = formatted.length - value.length;
    const pos = Math.max(0, (selectionStart || 0) + diff);
    setAmount(formatted);
    requestAnimationFrame(() => e.target.setSelectionRange(pos, pos));
  };

  const numericAmount = Number(amount.replace(/\./g, ''));
  const balanceDiff = numericAmount - currentBalance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!numericAmount) { setError('Jumlah saldo harus diisi'); return; }
    const diff = numericAmount - currentBalance;
    if (diff === 0) { onClose(); return; }
    setLoading(true);
    try {
      const type = diff > 0 ? 'income' : 'expense';
      const typeCategories = categories[type] || [];
      const lainnyaCategory = typeCategories.find(c => c.name?.toLowerCase() === 'lainnya');
      const categoryId = lainnyaCategory ? lainnyaCategory.id : undefined;
      await addTransaction({ type, amount: Math.abs(diff), category_id: categoryId, date: new Date().toISOString().split('T')[0], note: 'Penyesuaian Saldo Manual', wallet_id: walletId });
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyesuaikan saldo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Atur Saldo {walletLabel}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="adjust-balance" className="text-xs font-medium text-muted-foreground">Saldo Saat Ini (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Rp</span>
              <input id="adjust-balance" type="text" inputMode="numeric" value={amount} onChange={handleAmountChange}
                className="w-full bg-background border border-input rounded-lg py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-bold text-2xl" autoFocus />
            </div>
            {numericAmount > 0 && balanceDiff !== 0 && (
              <div className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${balanceDiff > 0 ? 'bg-income/10 text-income' : 'bg-destructive/10 text-destructive'}`}>
                <span className="font-medium">{balanceDiff > 0 ? 'Bertambah' : 'Berkurang'}</span>
                <span className="font-bold">{formatCurrency(Math.abs(balanceDiff))}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground italic">
              Sistem akan otomatis membuat transaksi penyesuaian selisih.
            </p>
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full gap-2">
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Menyimpan...</>
            ) : (
              <><Check className="w-5 h-5" />Simpan Saldo</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
