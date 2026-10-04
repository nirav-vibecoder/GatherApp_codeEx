'use client';

import { useEffect } from 'react';
import { ArrowUpRight, CalendarDays, Clock3, MapPin, X } from 'lucide-react';
import type { EventRecord } from '@/types/events';

function formatTime(value: string) { const [h,m]=value.split(':').map(Number); const suffix=h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${suffix}`; }
function formatDate(value: string) { return new Date(`${value}T12:00:00`).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}); }

export function EventDrawer({ event, onClose }: { event: EventRecord | null; onClose: () => void }) {
  useEffect(() => {
    if (!event) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [event, onClose]);
  if (!event) return null;
  return <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Event details">
    <button className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" aria-label="Close event details" onClick={onClose} />
    <aside className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-white p-6 shadow-float sm:p-8" style={{animation:'drawer-in .22s ease-out'}}>
      <div className="flex items-center justify-between"><span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-brand">Event details</span><button onClick={onClose} className="rounded-full p-2 hover:bg-[#f2f2f0]" aria-label="Close"><X className="h-5 w-5" /></button></div>
      <div className="mt-10"><p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{event.cca}</p><h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.03em]">{event.event_name}</h2>
        <div className="mt-8 space-y-4 border-y border-black/8 py-6 text-sm">
          <div className="flex gap-3"><CalendarDays className="h-5 w-5 text-[#999]" /><span>{formatDate(event.event_date)}</span></div>
          <div className="flex gap-3"><Clock3 className="h-5 w-5 text-[#999]" /><span>{formatTime(event.start_time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ''}</span></div>
          <div className="flex gap-3"><MapPin className="h-5 w-5 text-[#999]" /><span>{event.location}</span></div>
        </div>
        {event.description && <p className="mt-7 text-sm leading-7 text-[#666]">{event.description}</p>}
        {event.speaker && <p className="mt-5 text-sm"><span className="font-bold">Speaker:</span> {event.speaker}</p>}
      </div>
      <div className="mt-auto pt-8">{event.registration_link ? <a href={event.registration_link} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">REGISTER NOW <ArrowUpRight className="h-4 w-4" /></a> : <div className="rounded-2xl bg-[#f7f7f5] px-4 py-3 text-center text-sm font-semibold text-[#666]">No registration required</div>}</div>
    </aside>
  </div>;
}
