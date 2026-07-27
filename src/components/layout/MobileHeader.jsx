import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { SidebarContent } from './Sidebar';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/transactions': 'Transaksi',
  '/stats': 'Statistik',
  '/budget': 'Budget',
  '/goals': 'Goals',
  '/wallets': 'Dompet',
  '/profile': 'Profile',
};

export default function MobileHeader() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Open menu">
              <Menu size={20} strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col h-full bg-sidebar">
                <div className="p-4 border-b border-sidebar-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                      <span className="text-primary-foreground text-sm font-bold">G</span>
                    </div>
                    <div>
                      <h1 className="text-base font-bold text-sidebar-foreground tracking-tight leading-none">My duit gw</h1>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Finance Tracker</p>
                    </div>
                  </div>
                </div>
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <h1 className="font-bold text-foreground text-sm">{pageTitle}</h1>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
        </button>
      </div>
    </header>
  );
}
