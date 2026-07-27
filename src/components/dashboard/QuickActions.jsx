import { useNavigate } from 'react-router-dom';
import { Utensils, Car, Coffee, ShoppingBag, Zap, ArrowLeftRight, ArrowRightLeft, History } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import TransferModal from '@/components/transactions/TransferModal';
import { useState } from 'react';

export default function QuickActions() {
  const { openModal } = useTransactions();
  const navigate = useNavigate();
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const actions = [
    { label: 'Makan', icon: Utensils, data: { type: 'expense', category: 'makan', note: 'Makan Siang', wallet: 'cash' } },
    { label: 'Transport', icon: Car, data: { type: 'expense', category: 'transport', note: 'Bensin / Ojol', wallet: 'ewallet' } },
    { label: 'Kopi', icon: Coffee, data: { type: 'expense', category: 'makan', note: 'Ngopi', wallet: 'ewallet' } },
    { label: 'Mart', icon: ShoppingBag, data: { type: 'expense', category: 'belanja', note: 'Minimarket', wallet: 'cash' } },
    { label: 'Tagihan', icon: Zap, data: { type: 'expense', category: 'tagihan', note: 'Listrik / Air', wallet: 'bank' } },
  ];

  const handleAction = (data) => {
    const today = new Date().toISOString().split('T')[0];
    openModal({ ...data, date: today }, true);
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Aksi Cepat</h3>
      <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        <Button
          variant="outline"
          className="flex items-center gap-2 shrink-0 h-10 rounded-xl bg-background hover:bg-muted/50"
          onClick={() => navigate('/transactions')}
        >
          <History className="w-4 h-4" />
          Riwayat
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 shrink-0 h-10 rounded-xl bg-background hover:bg-muted/50"
          onClick={() => setIsTransferOpen(true)}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Transfer
        </Button>
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button
              key={idx}
              variant="ghost"
              className="flex items-center gap-2 shrink-0 h-10 rounded-xl bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all duration-200"
              onClick={() => handleAction(action.data)}
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </Button>
          );
        })}
      </div>
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
    </div>
  );
}
