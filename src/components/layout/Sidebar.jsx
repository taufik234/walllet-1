import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart3, User, Wallet, Plus, PieChart, Target, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: ArrowLeftRight, label: 'Transaksi', to: '/transactions' },
  { icon: BarChart3, label: 'Statistik', to: '/stats' },
  { icon: PieChart, label: 'Budget', to: '/budget' },
  { icon: Target, label: 'Goals', to: '/goals' },
  { icon: Wallet, label: 'Dompet', to: '/wallets' },
  { icon: User, label: 'Profile', to: '/profile' },
];

function NavIcon({ Icon, isActive }) {
  return (
    <div className={cn(
      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
      isActive
        ? "bg-primary/15 text-primary"
        : "text-muted-foreground/60 group-hover:text-foreground/80 group-hover:bg-muted/50"
    )}>
      <Icon className="w-5 h-5" strokeWidth={1.75} />
    </div>
  );
}

export function SidebarContent() {
  return (
    <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 px-2 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary/8 text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )
          }
        >
          {({ isActive }) => (
            <>
              <NavIcon Icon={item.icon} isActive={isActive} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ onOpenAdd }) {
  const { stats } = useTransactions();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-sidebar border-r border-sidebar-border z-30">
      {/* Brand */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground text-sm font-bold">G</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-foreground tracking-tight leading-none">My duit gw</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Finance Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <SidebarContent />

      {/* Bottom CTA */}
      <div className="p-4 border-t border-sidebar-border mt-auto space-y-2">
        <Button onClick={onOpenAdd} className="w-full gap-2 h-10 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" />
          Input Transaksi
        </Button>
      </div>
    </aside>
  );
}
