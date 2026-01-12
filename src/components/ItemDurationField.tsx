import { useState, useEffect } from 'react';
import { Calendar, Info } from 'lucide-react';

interface ItemProps {
  start: string | undefined;
  end: string | undefined;
  onDurationChange: (mins: number) => void;
}

export function ItemDurationField({ start, end, onDurationChange }: ItemProps) {
  const [pickup, setPickup] = useState(start);
  const [returnDate, setReturnDate] = useState(end);

  useEffect(() => {
    if (pickup && returnDate) {
      const start = new Date(pickup);
      const end = new Date(returnDate);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.max(60, Math.floor(diffMs / (1000 * 60)));
      onDurationChange(diffMins);
    }
  }, [pickup, returnDate, onDurationChange]);

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-brand-green" />
          <label className="text-label">Pick up</label>
        </div>
        <input 
          type="date"
          value={pickup}
          className="artisan-input !py-3 text-sm" 
          onChange={(e) => setPickup(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-brand-green" />
          <label className="text-label">Return</label>
        </div>
        <input 
          type="date" 
          value={returnDate}
          className="artisan-input !py-3 text-sm" 
          onChange={(e) => setReturnDate(e.target.value)}
        />
      </div>
      <p className="text-[11px] text-brand-muted italic flex items-center gap-1">
        <Info className="w-3 h-3" />
        Items are typically borrowed for 24-72 hours.
      </p>
    </div>
  );
}