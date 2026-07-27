import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PlusCircle, Target, Wallet, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav({ onOpenAdd }) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', to: '/' },
    { icon: ArrowLeftRight, label: 'Trans', to: '/transactions' },
    { icon: PlusCircle, label: 'Add', to: '#', isAction: true },
    { icon: Target, label: 'Goals', to: '/goals' },
    { icon: BarChart3, label: 'Stats', to: '/stats' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={onOpenAdd}
                className="relative -top-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3.5 shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 hover:scale-105"
                aria-label="Add transaction"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-16 h-full gap-0.5 text-[10px] font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/60 hover:text-foreground/80"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-sm")} strokeWidth={isActive ? 2.5 : 1.75} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
