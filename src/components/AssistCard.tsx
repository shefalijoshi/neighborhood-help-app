import { Link } from '@tanstack/react-router';
import { format, addMinutes } from 'date-fns';
import { Clock, Calendar, ShieldAlert, ChevronRight } from 'lucide-react';
import { CATEGORY_INTENT } from '../lib/categoryIntent';

interface AssistCardProps {
  assist: any;
  currentProfileId: string;
}

export function AssistCard({ assist, currentProfileId }: AssistCardProps) {
  const category = CATEGORY_INTENT.find(c => c.id === assist.category_id);
  const Icon = category?.icon || Clock;
  const brandColor = category?.color || 'bg-brand-green';

  const isHelper = assist.helper_id === currentProfileId;

  const action = category?.actions.find(a => a.id === assist.action_id);
  const actionLabel = action?.label || assist.subject_tag;

  // 2. Heading Logic: display_name + action label
  const heading = assist.display_name 
    ? `${assist.display_name} — ${actionLabel}`
    : actionLabel;

  // Timing Logic
  const startTime = new Date(assist.scheduled_time);
  const endTime = addMinutes(startTime, assist.duration || 0);  

  return (
    <Link
      to="/assists/$assistId"
      params={{ assistId: assist.id }}
      className="block artisan-card px-4 pt-4 pb-2 hover:shadow-md transition-shadow group"
    >
      <div className="flex flex-col gap-4">
        {/* Header: Identity & Status */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className={`h-10 w-10 rounded-2xl ${brandColor} text-white flex items-center justify-center shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="artisan-card-title !text-xl">
                {heading}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="badge-pill !bg-brand-terracotta !text-white !text-[9px] !py-0.5">
                  {assist.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-brand-muted uppercase font-bold tracking-tight">
                  with {isHelper ? assist.seeker_name : assist.helper_name}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-brand-dark">
              <ShieldAlert className="w-3 h-3 text-brand-terracotta" /> 
              <span className="text-xs font-mono font-bold uppercase tracking-tighter">
                Code {assist.verification_code}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata: Category Tag & Duration/Return Date */}
        <div className="detail-row pt-2 border-t border-brand-stone">
          <div className="flex flex-wrap items-center gap-3 w-full">
            <span className="badge-pill hidden sm:inline-flex">
              {assist.subject_tag}
            </span>

            <div className="flex items-center gap-1 text-brand-text text-[13px]">
              {assist.request_type === 'service' ? (
                <>
                  <Clock className="w-4 h-4 opacity-70" />
                  <span>{assist.duration}m</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 opacity-70" />
                  <span>Return {format(endTime, 'MMM d')}</span>
                </>
              )}
            </div>

            <div className="ml-auto">
              <ChevronRight className="w-5 h-5 text-brand-stone group-hover:text-brand-green transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}