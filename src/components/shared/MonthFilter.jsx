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
            className="appearance-none bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer text-center font-medium placeholder-slate-500"
            style={{ width: field === 'year' ? '80px' : field === 'month' ? '110px' : '64px' }}
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );

    return (
        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-2xl border border-slate-800/50">
            <div className="pl-2 pr-1 text-slate-500">
                <Calendar className="w-4 h-4" />
            </div>

            <Select options={days} val={value.day} field="day" placeholder="Tgl" />
            <Select options={months} val={value.month} field="month" placeholder="Bulan" />
            <Select options={years} val={value.year} field="year" placeholder="Thn" />
        </div>
    );
}
