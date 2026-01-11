import { Clock } from 'lucide-react';

interface ServiceProps {
  value: number;
  onChange: (mins: number) => void;
}

export function ServiceDurationField({ value, onChange }: ServiceProps) {
  const quickTime = [15, 30, 60, 90];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-brand-green" />
        <label className="text-label">Estimated time</label>
      </div>

      <div className="flex gap-2">
        {quickTime.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`badge-pill transition-colors cursor-pointer ${
              value === t ? 'bg-brand-green text-white' : 'bg-brand-stone hover:bg-brand-border/30'
            }`}
          >
            {t < 60 ? `${t}m` : `${t/60}h`}
          </button>
        ))}
      </div>
    </div>
  );
}