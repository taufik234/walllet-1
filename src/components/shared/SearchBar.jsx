import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1">
      <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search transactions…"
        className="pl-9"
      />
    </div>
  );
}
