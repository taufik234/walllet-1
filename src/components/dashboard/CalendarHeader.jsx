import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, startOfMonth, endOfMonth, isWithinInterval, addMonths, getDaysInMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { useTransactions } from '../../context/TransactionContext';

export default function CalendarHeader({ currentDate, onDateChange }) {
    const { transactions } = useTransactions();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const scrollContainerRef = useRef(null);

    // Generate days for the entire month
    const monthStart = startOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const days = Array.from({ length: daysInMonth }).map((_, i) => addDays(monthStart, i));

    // Filter transactions for the current selected DATE (Daily)
    const dailyTransactions = useMemo(() => {
        return transactions.filter(t => {
            const date = new Date(t.date);
            return isSameDay(date, currentDate);
        });
    }, [transactions, currentDate]);

    // Calculate total amount for the day
    const dailyTotal = useMemo(() => {
        return dailyTransactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
    }, [dailyTransactions]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200; // Scroll roughly 2-3 items
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Auto-center active date
    useEffect(() => {
        const timer = setTimeout(() => {
            if (scrollContainerRef.current) {
                const activeElement = scrollContainerRef.current.querySelector('[data-active="true"]');
                if (activeElement) {
                    activeElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }
        }, 100); // Small delay to ensure rendering and smooth transition
        return () => clearTimeout(timer);
    }, [currentDate]);

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
            {/* Top Row: Status & Stats */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold">Aktif</span>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-indigo-100">{dailyTransactions.length} Transaksi</p>
                    <p className="text-xs text-indigo-200">
                        Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(dailyTotal)}
                    </p>
                </div>
            </div>

            {/* Month Navigation - Centered Style */}
            <div className="flex items-center justify-center gap-8 mb-6">
                <button
                    onClick={() => onDateChange(addMonths(currentDate, -1))}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                >
                    <ChevronLeft className="w-6 h-6 text-indigo-100 group-hover:text-white" />
                </button>
                <h2 className="text-xl font-bold tracking-tight min-w-[140px] text-center">
                    {format(currentDate, 'MMMM yyyy', { locale: id })}
                </h2>
                <button
                    onClick={() => onDateChange(addMonths(currentDate, 1))}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                >
                    <ChevronRight className="w-6 h-6 text-indigo-100 group-hover:text-white" />
                </button>
            </div>

            {/* Days Slider */}
            <div className="relative group px-1">
                {/* Desktop Scroll Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="w-4 h-4 text-white" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2 -mx-2 px-2"
                >
                    {days.map((day, index) => {
                        const isActive = isSameDay(day, currentDate);
                        const dayHasTrans = transactions.some(t => isSameDay(new Date(t.date), day));

                        return (
                            <button
                                key={index}
                                data-active={isActive}
                                onClick={() => onDateChange(day)}
                                className={`
                                    flex flex-col items-center justify-center min-w-[14.28%] w-[14.28%] flex-shrink-0 snap-center rounded-2xl py-2 gap-2 transition-all duration-300
                                    ${isActive ? 'bg-white/10 backdrop-blur-sm' : 'hover:bg-white/5'}
                                `}
                            >
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-indigo-200'}`}>
                                    {format(day, 'EEE', { locale: id })}
                                </span>

                                <div className={`
                                    w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all
                                    ${isActive
                                        ? 'bg-emerald-400 text-white shadow-lg shadow-emerald-400/30 scale-110'
                                        : 'text-white'
                                    }
                                `}>
                                    {format(day, 'd')}
                                </div>

                                {/* Transaction Dot Indicator */}
                                <div className={`h-1 w-1 rounded-full ${dayHasTrans && !isActive ? 'bg-emerald-400' : 'bg-transparent'}`} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
