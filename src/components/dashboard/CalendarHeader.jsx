import { useRef } from 'react';
import { format, addDays, startOfMonth, isSameDay, addMonths, isPast, isFuture, isToday } from 'date-fns';
import { id } from 'date-fns/locale';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarHeader({ currentDate, onDateChange }) {
  const { transactions } = useTransactions();
  const scrollRef = useRef(null);

  const monthStart = startOfMonth(currentDate);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }).map((_, i) => addDays(monthStart, i));
  const dailyTransactions = transactions.filter(t => isSameDay(new Date(t.date), currentDate));
  const dailyTotal = dailyTransactions.reduce((a, c) => a + Number(c.amount), 0);
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
    <div className="rounded-2xl p-5 bg-gradient-to-br from-[oklch(0.88_0.03_170)] to-[oklch(0.95_0.005_160)] dark:from-[oklch(0.15_0.02_170)] dark:to-[oklch(0.10_0.005_160)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="inline-flex items-center gap-1.5 bg-[oklch(0.85_0.06_150/0.3)] dark:bg-[oklch(0.72_0.16_140/0.2)] text-[oklch(0.25_0.06_170)] dark:text-foreground px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.62_0.18_150)] dark:bg-[oklch(0.72_0.16_140)]" />
          {dailyTransactions.length > 0 ? 'Aktif' : 'Tidak ada'}
        </div>
        <div className="text-xs font-medium text-[oklch(0.35_0.04_170)] dark:text-muted-foreground">
          {dailyTransactions.length} transaksi <span className="opacity-40">&middot;</span> Terakhir: <span className="font-semibold">{lastTxDate}</span>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={() => onDateChange(addMonths(currentDate, -1))} className="text-[oklch(0.35_0.04_170)] dark:text-muted-foreground hover:text-[oklch(0.25_0.06_170)] dark:hover:text-foreground transition-colors">
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <h2 className="text-lg font-semibold text-[oklch(0.2_0.05_170)] dark:text-foreground">
          {format(currentDate, 'MMMM yyyy', { locale: id })}
        </h2>
        <button onClick={() => onDateChange(addMonths(currentDate, 1))} className="text-[oklch(0.35_0.04_170)] dark:text-muted-foreground hover:text-[oklch(0.25_0.06_170)] dark:hover:text-foreground transition-colors">
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Days */}
      <div className="flex overflow-x-auto accent-scroll snap-x snap-mandatory gap-0 pb-1" ref={scrollRef}>
        {days.map((day, i) => {
          const status = dayStatus(day);
          const hasTx = dayHasTx(day);
          const isActive = status === 'active';

          return (
            <div
              key={i}
              ref={isActive ? setActiveRef : undefined}
              onClick={() => onDateChange(day)}
              className={`flex flex-col items-center gap-2 min-w-[calc(100%/7)] w-[calc(100%/7)] snap-start shrink-0 relative py-1 cursor-pointer ${
                isActive ? 'z-10' : ''
              }`}
            >
              {/* Active white pill background */}
              {isActive && (
                <div className="absolute inset-0 -top-1 -bottom-1 -left-0.5 -right-0.5 bg-white dark:bg-card rounded-2xl shadow-sm z-[-1]" />
              )}

              <span className={`text-[11px] font-semibold uppercase tracking-wide ${
                isActive
                  ? 'text-[oklch(0.2_0.05_170)] dark:text-foreground'
                  : status === 'future'
                    ? 'text-[oklch(0.6_0.03_170)] dark:text-muted-foreground/50'
                    : 'text-[oklch(0.4_0.04_170)] dark:text-muted-foreground'
              }`}>
                {format(day, 'EEE', { locale: id }).slice(0, 2)}
              </span>

              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all ${
                  isActive
                    ? 'bg-[oklch(0.62_0.18_150)] dark:bg-[oklch(0.72_0.16_140)] text-white shadow-lg shadow-[oklch(0.62_0.18_150/0.3)] dark:shadow-[oklch(0.72_0.16_140/0.2)]'
                    : status === 'past'
                      ? hasTx ? 'bg-[oklch(0.85_0.06_150/0.5)] dark:bg-[oklch(0.72_0.16_140/0.15)] text-[oklch(0.25_0.06_170)] dark:text-foreground' : ''
                      : 'text-[oklch(0.6_0.03_170)] dark:text-muted-foreground/50'
                }`}>
                  {format(day, 'd')}
                </div>
                <span className={`w-[5px] h-[5px] rounded-full ${
                  hasTx
                    ? isActive
                      ? 'bg-[oklch(0.4_0.06_170)] dark:bg-foreground'
                      : 'bg-[oklch(0.62_0.18_150)] dark:bg-[oklch(0.72_0.16_140)]'
                    : 'bg-transparent'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
