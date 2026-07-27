import { useNavigate } from 'react-router-dom';
import { Utensils, Car, Coffee, ShoppingBag, Zap, ArrowRightLeft, History } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import TransferModal from '@/components/transactions/TransferModal';
import { useState } from 'react';

export default function QuickActions() {
  const { openModal, categories } = useTransactions();
  const navigate = useNavigate();
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const CAT_MAP = [
    { label: 'Makan', icon: Utensils, name: 'Makan', note: 'Makan Siang' },
    { label: 'Transport', icon: Car, name: 'Transport', note: 'Bensin / Ojol' },
    { label: 'Kopi', icon: Coffee, name: 'Makan', note: 'Ngopi' },
    { label: 'Mart', icon: ShoppingBag, name: 'Belanja', note: 'Minimarket' },
    { label: 'Tagihan', icon: Zap, name: 'Tagihan', note: 'Listrik / Air' },
  ];

  const handleAction = (data) => {
    const today = new Date().toISOString().split('T')[0];
    const cat = (categories?.expense || []).find(c => c.name?.toLowerCase() === data.name.toLowerCase());
    openModal({ type: data.type, category_id: cat?._id || '', note: data.note, wallet: 'cash', date: today, category: cat?._id || '' }, true);
  };

  return (
    <div>
      <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 px-1">Aksi Cepat</h3>
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        <Button
          variant="outline"
          className="flex items-center gap-1.5 sm:gap-2 shrink-0 h-9 sm:h-10 rounded-xl bg-background hover:bg-muted/50 text-xs sm:text-sm"
          onClick={() => navigate('/transactions')}
        >
          <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Riwayat</span>
          <span className="xs:hidden inline">Riwayat</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-1.5 sm:gap-2 shrink-0 h-9 sm:h-10 rounded-xl bg-background hover:bg-muted/50 text-xs sm:text-sm"
          onClick={() => setIsTransferOpen(true)}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Transfer
        </Button>
        {CAT_MAP.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button
              key={idx}
              variant="ghost"
              className="flex items-center gap-1.5 sm:gap-2 shrink-0 h-9 sm:h-10 rounded-xl bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all duration-200 text-xs sm:text-sm"
              onClick={() => handleAction(action)}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {action.label}
            </Button>
          );
        })}
      </div>
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
    </div>
  );
}
