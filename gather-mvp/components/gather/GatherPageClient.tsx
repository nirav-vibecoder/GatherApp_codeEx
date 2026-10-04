'use client';

import { useMemo, useState } from 'react';
import type { EventRecord } from '@/types/events';
import { TwoWeekCalendar } from './TwoWeekCalendar';
import { EventCard } from './EventCard';
import { EventDrawer } from './EventDrawer';

function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
function todayAtNoon() { const d = new Date(); d.setHours(12,0,0,0); return d; }

export function GatherPageClient({ events }: { events: EventRecord[] }) {
  const today = useMemo(() => todayAtNoon(), []);
  const todayKey = dateKey(today);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [openEvent, setOpenEvent] = useState<EventRecord | null>(null);
  const selectedEvents = events.filter(e => e.event_date === selectedDate);
  const selectedDateLabel = new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  const isToday = selectedDate === todayKey;
  return <>
    <TwoWeekCalendar startDate={todayKey} selectedDate={selectedDate} events={events} onSelect={setSelectedDate} />
    <section className="mt-7">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><div className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">{isToday ? 'Today' : 'Selected day'}</div><h2 className="mt-1 text-2xl font-extrabold tracking-tight">{selectedDateLabel}</h2></div>
        <div className="text-sm text-[#888]">{selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'}</div>
      </div>
      {selectedEvents.length ? <div className="space-y-3">{selectedEvents.map(event => <EventCard key={event.id} event={event} onOpen={() => setOpenEvent(event)} />)}</div> : <div className="rounded-card bg-white px-6 py-16 text-center shadow-card"><div className="mx-auto max-w-md"><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand">{isToday ? 'Nothing planned today.' : 'A quiet one.'}</p><h3 className="mt-3 text-2xl font-extrabold tracking-tight">{isToday ? 'You are officially free.' : 'Looks like campus is taking a break.'}</h3><p className="mt-2 text-sm text-[#777]">{isToday ? 'Enjoy it while it lasts.' : 'Check another day in the calendar above.'}</p></div></div>}
    </section>
    <EventDrawer event={openEvent} onClose={() => setOpenEvent(null)} />
  </>;
}
