import { Link } from 'react-router-dom';
import { BarChart3, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function StatsShortcut() {
  return (
    <Link to="/stats" className="block group">
      <Card className="px-6 py-6 flex flex-col items-center justify-center gap-2 h-full hover:border-ink-3 transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BarChart3 size={22} strokeWidth={1.5} className="text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Analytics</h3>
            <p className="text-sm text-muted-foreground">Spending & income</p>
          </div>
        </div>
        <ArrowRight size={16} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
      </Card>
    </Link>
  );
}
