import { useRef } from 'react';
import { format, addDays, startOfMonth, isSameDay, addMonths, isPast, isToday } from 'date-fns';
import { id } from 'date-fns/locale';
import { useTransactions } from '@/context/TransactionContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarHeader({ currentDate, onDateChange }) {
  const { transactions } = useTransactions();
  const scrollRef = useRef(null);

  const monthStart = startOfMonth(currentDate);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }).map((_, i) => addDays(monthStart, i));
  const dailyTransactions = transactions.filter(t => isSameDay(new Date(t.date), currentDate));
  const today = new Date();
  const todayFormatted = format(today, 'dd MMM', { locale: id });

  const lastTxDate = transactions.length > 0
    ? format(new Date(transactions[0].date), 'dd MMM', { locale: id })
    : todayFormatted;

  const dayHasTx = (day) => transactions.some(t => isSameDay(new Date(t.date), day));

  const setActiveRef = (node) => {
    if (node && scrollRef.current) {
      node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const dayStatus = (day) => {
    if (isSameDay(day, currentDate)) return 'active';
    if (isPast(day) && !isToday(day)) return 'past';
    return 'future';
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-primary/5 to-primary/[0.02] dark:from-primary/10 dark:to-primary/5 border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 gap-2">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 dark:bg-primary/15 text-primary px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary motion-safe:animate-pulse" aria-hidden="true" />
          {dailyTransactions.length > 0 ? 'Aktif' : 'Tidak ada'}
        </div>
        <div className="text-[10px] sm:text-xs font-medium text-muted-foreground text-right" aria-live="polite">
          {dailyTransactions.length} transaksi <span className="opacity-40" aria-hidden="true">&middot;</span> Terakhir: <span className="font-semibold">{lastTxDate}</span>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => onDateChange(addMonths(currentDate, -1))}
          aria-label="Bulan sebelumnya"
          className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm sm:text-lg font-semibold text-foreground">
          {format(currentDate, 'MMMM yyyy', { locale: id })}
        </h2>
        <button
          onClick={() => onDateChange(addMonths(currentDate, 1))}
          aria-label="Bulan berikutnya"
          className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Days */}
      <div className="flex overflow-x-auto accent-scroll snap-x snap-mandatory gap-0 pb-1 -mx-1 px-1" ref={scrollRef} role="listbox" aria-label="Pilih tanggal">
        {days.map((day, i) => {
          const status = dayStatus(day);
          const hasTx = dayHasTx(day);
          const isActive = status === 'active';

          return (
            <div
              key={i}
              ref={isActive ? setActiveRef : undefined}
              role="option"
              aria-selected={isActive}
              aria-label={format(day, 'EEEE, d MMMM yyyy', { locale: id })}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onDateChange(day)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDateChange(day); } }}
              className={`flex flex-col items-center gap-1 sm:gap-2 min-w-[calc(100%/7)] w-[calc(100%/7)] snap-start shrink-0 relative pt-0.5 pb-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-xl ${
                isActive ? 'z-10' : ''
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 -top-0.5 -bottom-0.5 -left-px -right-px bg-background dark:bg-card rounded-xl sm:rounded-2xl shadow-sm z-[-1]" aria-hidden="true" />
              )}

              <span className={`text-[9px] sm:text-[11px] font-semibold uppercase tracking-wide ${
                isActive
                  ? 'text-foreground'
                  : status === 'future'
                    ? 'text-muted-foreground/50'
                    : 'text-muted-foreground'
              }`}>
                {format(day, 'EEE', { locale: id }).slice(0, 2)}
              </span>

              <div className="flex flex-col items-center gap-px sm:gap-1">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : status === 'past'
                      ? hasTx ? 'bg-primary/15 text-foreground' : ''
                      : 'text-muted-foreground/50'
                }`}>
                  {format(day, 'd')}
                </div>
                <span className={`w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] rounded-full transition-colors ${
                  hasTx
                    ? isActive
                      ? 'bg-foreground'
                      : 'bg-primary'
                    : 'bg-transparent'
                }`} aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
