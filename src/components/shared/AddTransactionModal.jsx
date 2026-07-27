import { useState, useEffect } from 'react';
import { Calendar, FileText, Check } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AddTransactionModal({ isOpen, onClose, editData = null }) {
  const { addTransaction, editTransaction, isPreset, categories, wallets } = useTransactions();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [wallet, setWallet] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setType(editData.type);
        setAmount(new Intl.NumberFormat('id-ID').format(editData.amount));
        setCategory(editData.category_id || editData.category);
        setDate(editData.date || new Date().toISOString().split('T')[0]);
        setNote(editData.note || '');
        setWallet(editData.wallet_id || editData.wallet || '');
      } else {
        setType('expense');
        setAmount('');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
        setNote('');
        setWallet(wallets.length > 0 ? wallets[0]._id : '');
      }
    }
  }, [isOpen, editData, wallets]);

  const handleAmountChange = (e) => {
    const { selectionStart, value } = e.target;
    const raw = value.replace(/\D/g, '');
    const formatted = raw ? new Intl.NumberFormat('id-ID').format(raw) : '';
    const diff = formatted.length - value.length;
    const pos = Math.max(0, (selectionStart || 0) + diff);
    setAmount(formatted);
    requestAnimationFrame(() => e.target.setSelectionRange(pos, pos));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(amount.replace(/\./g, ''));
    if (!numericAmount || !category) return;
    const transactionData = { type, amount: numericAmount, category_id: category, date, note, wallet_id: wallet || (wallets[0]?._id) };
    if (editData && !isPreset) editTransaction(editData.id, transactionData);
    else addTransaction(transactionData);
    onClose();
  };

  const currentCategories = categories ? categories[type] : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editData && !isPreset ? 'Edit Transaksi' : 'Tambah Transaksi'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
            <button type="button" onClick={() => { setType('expense'); setCategory(''); }}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${type === 'expense' ? 'bg-background text-destructive shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              Pengeluaran
            </button>
            <button type="button" onClick={() => { setType('income'); setCategory(''); }}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${type === 'income' ? 'bg-background text-income shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              Pemasukan
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Jumlah (Rp)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">Rp</span>
              <input type="text" inputMode="numeric" value={amount} onChange={handleAmountChange} placeholder="0"
                className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-3 text-foreground placeholder:text-muted-foreground font-bold text-lg focus:outline-none focus:ring-2 focus:ring-ring" autoFocus />
            </div>
          </div>

          {/* Wallet Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Sumber Dana</label>
            <div className="bg-muted p-1 rounded-lg flex gap-1 overflow-x-auto">
              {wallets.map(w => (
                <button key={w._id} type="button" onClick={() => setWallet(w._id)}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${wallet === w._id ? 'bg-background text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground border border-transparent'}`}>
                  {w.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Kategori</label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
              {currentCategories.length > 0 ? currentCategories.map((cat) => (
                <button key={cat._id} type="button" onClick={() => setCategory(cat._id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg gap-1 transition-colors border ${category === cat._id ? 'bg-background border-primary text-foreground shadow-sm' : 'bg-muted border-border text-muted-foreground hover:text-foreground'}`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-center">{cat.name}</span>
                </button>
              )) : <div className="col-span-4 text-center py-4 text-muted-foreground text-sm italic">Memuat kategori...</div>}
            </div>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background border border-input rounded-lg py-2 pl-10 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Catatan</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opsional"
                  className="w-full bg-background border border-input rounded-lg py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={!amount || !category} className="w-full gap-2">
            <Check className="w-4 h-4" />
            {editData && !isPreset ? 'Simpan Perubahan' : 'Simpan Transaksi'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
