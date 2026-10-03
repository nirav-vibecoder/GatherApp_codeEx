'use client';

import { useMemo } from 'react';
import type { EventRecord } from '@/types/events';

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function makeDays(start: Date) {
  return Array.from({ length: 14 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
}

export function TwoWeekCalendar({ startDate, selectedDate, events, onSelect }: { startDate: string; selectedDate: string; events: EventRecord[]; onSelect: (date: string) => void; }) {
  const start = useMemo(() => { const [y,m,d] = startDate.split('-').map(Number); return new Date(y,m-1,d,12); }, [startDate]);
  const days = useMemo(() => makeDays(start), [start]);
  const eventDates = new Set(events.map(e => e.event_date));
  const monthLabel = `${start.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} ${start.getDate()} — ${days[13].toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} ${days[13].getDate()}`;
  return (
    <section className="rounded-card bg-white p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Two week view</p><h2 className="mt-1 text-xl font-extrabold tracking-tight">{monthLabel}</h2></div>
        <div className="text-xs text-[#858585]">Click a day to explore</div>
      </div>
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="grid min-w-[720px] grid-cols-7 gap-1.5">
          {days.map(day => {
            const key = dateKey(day);
            const selected = key === selectedDate;
            const today = key === dateKey(new Date());
            const hasEvents = eventDates.has(key);
            return <button key={key} onClick={() => onSelect(key)} className={`group relative min-h-[88px] rounded-2xl px-2 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${selected ? 'bg-brand text-white shadow-md' : 'bg-[#f7f7f5] hover:-translate-y-0.5 hover:bg-[#efefed]'}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wide ${selected ? 'text-white/80' : 'text-[#8a8a8a]'}`}>{day.toLocaleDateString('en-US',{weekday:'short'})}</div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight">{day.getDate()}</div>
              {today && <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${selected ? 'bg-white/15 text-white' : 'bg-black text-white'}`}>Today</span>}
              {hasEvents && <span aria-label="Events available" className={`absolute bottom-3 left-2 h-1.5 w-1.5 rounded-full ${selected ? 'bg-white' : 'bg-brand'}`} />}
            </button>;
          })}
        </div>
      </div>
    </section>
  );
}
