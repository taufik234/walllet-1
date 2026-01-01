import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateFilter({ value, onChange }) {
    // Value is now object { day, month, year }
    const handleChange = (field, val) => {
        onChange({ ...value, [field]: val });
    };

    // Options Generators
    const days = Array.from({ length: 31 }, (_, i) => {
        const d = (i + 1).toString().padStart(2, '0');
        return { value: d, label: d };
    });

    const months = [
        { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' }, { value: '04', label: 'April' },
        { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' }, { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' }, { value: '12', label: 'Desember' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => {
        const y = (currentYear + 1 - i).toString();
        return { value: y, label: y };
    });

    const Select = ({ options, val, field, placeholder }) => (
        <select
            value={val}
            onChange={(e) => handleChange(field, e.target.value)}
            className="appearance-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg py-1 px-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-center font-medium placeholder-slate-500 transition-colors cursor-pointer"
            style={{ width: field === 'year' ? '70px' : field === 'month' ? '100px' : '50px' }}
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {opt.label}
                </option>
            ))}
        </select>
    );

    return (
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="pl-2 pr-1 text-slate-400 dark:text-slate-500">
                <Calendar className="w-4 h-4" />
            </div>

            <Select options={days} val={value.day} field="day" placeholder="Tgl" />
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
            <Select options={months} val={value.month} field="month" placeholder="Bulan" />
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
            <Select options={years} val={value.year} field="year" placeholder="Thn" />
        </div>
    );
}
