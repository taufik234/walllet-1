import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AdjustBalanceModal({ isOpen, onClose, walletId, currentBalance }) {
  const { addTransaction, wallets, categories } = useTransactions();
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen && currentBalance !== undefined) {
      setAmount(new Intl.NumberFormat('id-ID').format(currentBalance));
    }
  }, [isOpen, currentBalance]);

  const walletLabel = wallets.find(w => w.id === walletId)?.name || 'Wallet';

  const handleAmountChange = (e) => {
    const cleanValue = e.target.value.replace(/\D/g, '');
    setAmount(cleanValue ? new Intl.NumberFormat('id-ID').format(cleanValue) : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(amount.replace(/\./g, ''));
    const diff = numericAmount - currentBalance;
    if (diff === 0) { onClose(); return; }
    const type = diff > 0 ? 'income' : 'expense';
    const typeCategories = categories[type] || [];
    const lainnyaCategory = typeCategories.find(c => c.name?.toLowerCase() === 'lainnya');
    const categoryId = lainnyaCategory ? lainnyaCategory.id : null;
    addTransaction({ type, amount: Math.abs(diff), category_id: categoryId, date: new Date().toISOString().split('T')[0], note: 'Penyesuaian Saldo Manual', wallet_id: walletId });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Atur Saldo {walletLabel}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Saldo Saat Ini (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Rp</span>
              <input type="text" inputMode="numeric" value={amount} onChange={handleAmountChange}
                className="w-full bg-background border border-input rounded-lg py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-bold text-2xl" autoFocus />
            </div>
            <p className="text-xs text-muted-foreground italic">
              Sistem akan otomatis membuat transaksi penyesuaian selisih.
            </p>
          </div>
          <Button type="submit" className="w-full gap-2">
            <Check className="w-5 h-5" />Simpan Saldo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
