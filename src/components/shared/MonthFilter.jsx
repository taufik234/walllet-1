export default function DateFilter({ value, onChange }) {
  const handleChange = (field, val) => onChange({ ...value, [field]: val });

  const days = Array.from({ length: 31 }, (_, i) => {
    const d = (i + 1).toString().padStart(2, '0');
    return { value: d, label: d };
  });
  const months = [
    { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' }, { value: '04', label: 'Apr' },
    { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' }, { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const y = (currentYear + 1 - i).toString();
    return { value: y, label: y };
  });

  const Select = ({ options, val, field, placeholder }) => (
    <select value={val} onChange={(e) => handleChange(field, e.target.value)}
      className="appearance-none bg-transparent hover:bg-muted py-1.5 px-2 text-sm text-foreground focus:outline-none cursor-pointer"
      style={{ width: field === 'year' ? '65px' : field === 'month' ? '75px' : '45px' }}>
      <option value="" className="bg-popover">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-popover text-foreground">{opt.label}</option>
      ))}
    </select>
  );

  return (
    <div className="flex items-center border border-border bg-background rounded-lg overflow-hidden">
      <Select options={days} val={value.day} field="day" placeholder="DD" />
      <div className="w-px h-4 bg-border" />
      <Select options={months} val={value.month} field="month" placeholder="MMM" />
      <div className="w-px h-4 bg-border" />
      <Select options={years} val={value.year} field="year" placeholder="YYYY" />
    </div>
  );
}
