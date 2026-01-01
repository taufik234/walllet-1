import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, ArrowRight } from 'lucide-react';

export default function StatsShortcut() {
    return (
        <Link
            to="/stats"
            className="group block w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-indigo-500/10"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-2.5 rounded-xl group-hover:bg-indigo-500 group-hover:text-white text-indigo-400 transition-colors">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Analisis Statistik</h3>
                        <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                            Lihat grafik detail keuanganmu
                        </p>
                    </div>
                </div>
                <div className="bg-slate-800 group-hover:bg-indigo-500 p-2 rounded-full transition-colors">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </div>
            </div>
        </Link>
    );
}
