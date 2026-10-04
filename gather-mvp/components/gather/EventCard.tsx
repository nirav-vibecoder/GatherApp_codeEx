import { ArrowUpRight, MapPin } from 'lucide-react';
import type { EventRecord } from '@/types/events';

function formatTime(value: string) {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2,'0')} ${suffix}`;
}

export function EventCard({ event, onOpen }: { event: EventRecord; onOpen: () => void }) {
  return <button onClick={onOpen} className="group w-full rounded-card bg-white p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-float focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:p-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="w-full shrink-0 sm:w-[110px]">
        <div className="text-sm font-extrabold">{formatTime(event.start_time)}</div>
        {event.end_time && <div className="mt-1 text-xs text-[#888]">until {formatTime(event.end_time)}</div>}
      </div>
      <div className="min-w-0 flex-1 border-l-0 sm:border-l sm:border-black/8 sm:pl-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand">{event.cca}</div>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight sm:text-xl">{event.event_name}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#6f6f6f]"><MapPin className="h-3.5 w-3.5" />{event.location}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-sm font-bold text-brand">{event.registration_link ? 'REGISTER' : 'VIEW DETAILS'}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
    </div>
  </button>;
}
