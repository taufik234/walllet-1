import { Link } from 'react-router-dom';
import { BarChart3, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function StatsShortcut() {
  return (
    <Link to="/stats" className="block group">
      <Card className="px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 h-full hover:border-ink-3 transition-all duration-200">
        <div className="flex items-center gap-3 sm:flex-col sm:text-center">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BarChart3 size={20} strokeWidth={1.5} className="text-primary" />
          </div>
          <div className="text-center sm:text-center">
            <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">Analytics</h3>
            <p className="text-[11px] sm:text-sm text-muted-foreground">Spending & income</p>
          </div>
        </div>
        <ArrowRight size={16} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
      </Card>
    </Link>
  );
}
