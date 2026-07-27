import { useRef } from 'react';
import { format, addDays, startOfMonth, isSameDay, addMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function CalendarHeader({ currentDate, onDateChange }) {
  const { transactions } = useTransactions();
  const scrollRef = useRef(null);

  const monthStart = startOfMonth(currentDate);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }).map((_, i) => addDays(monthStart, i));
  const dailyTransactions = transactions.filter(t => isSameDay(new Date(t.date), currentDate));
  const dailyTotal = dailyTransactions.reduce((a, c) => a + Number(c.amount), 0);

  const setActiveRef = (node) => {
    if (node && scrollRef.current) {
      node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} strokeWidth={1.5} className="text-primary" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{dailyTransactions.length}</span> tx today
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground">Total</span>
          <p className="text-sm font-bold text-foreground font-mono">{formatCurrency(dailyTotal)}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 px-5 py-3 bg-muted/20">
        <button onClick={() => onDateChange(addMonths(currentDate, -1))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm font-semibold text-foreground text-center">{format(currentDate, 'MMMM yyyy', { locale: id })}</h2>
        <button onClick={() => onDateChange(addMonths(currentDate, 1))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>
      <div className="border-t border-border">
        <div className="flex overflow-x-auto accent-scroll snap-x snap-mandatory px-3 pb-3 pt-2 gap-0" ref={scrollRef}>
          {days.map((day, i) => {
            const act = isSameDay(day, currentDate);
            return (
              <button
                key={i}
                ref={act ? setActiveRef : undefined}
                onClick={() => onDateChange(day)}
                className={`flex flex-col items-center justify-center min-w-[calc(100%/7)] w-[calc(100%/7)] py-2 rounded-xl transition-all duration-200 snap-start shrink-0 ${
                  act
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className={`text-[10px] font-medium ${
                  act ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {format(day, 'EEE', { locale: id }).slice(0, 3)}
                </span>
                <span className="text-sm mt-0.5 font-bold">{format(day, 'd')}</span>
                <span className={`w-1 h-1 mt-1 rounded-full ${
                  transactions.some(t => isSameDay(new Date(t.date), day))
                    ? (act ? 'bg-primary-foreground/60' : 'bg-primary')
                    : 'bg-transparent'
                }`} />
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
