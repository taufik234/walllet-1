import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';
import AddTransactionModal from '@/components/shared/AddTransactionModal';
import { useTransactions } from '@/context/TransactionContext';
import { Toaster } from '@/components/ui/sonner';

export default function Layout() {
  const { isModalOpen, closeModal, openModal } = useTransactions();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar onOpenAdd={() => openModal()} />
      <MobileHeader />
      <main className="lg:pl-64 min-h-[100dvh] pb-16 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 pt-4 lg:px-8 lg:pt-8">
          <Outlet />
        </div>
      </main>
      <BottomNav onOpenAdd={() => openModal()} />
      <AddTransactionModal isOpen={isModalOpen} onClose={closeModal} />
      <Toaster position="top-right" richColors />
    </div>
  );
}
