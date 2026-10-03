import { createSupabaseAdminClient } from './supabase/admin';
import type { EventRecord } from '@/types/events';

function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDateRange(start = new Date()) {
  const from = new Date(start);
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 13);
  return { from: isoDate(from), to: isoDate(to) };
}

export async function getEventsForWindow(start = new Date()): Promise<EventRecord[]> {
  const { from, to } = getDateRange(start);
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return getDemoEvents(start);
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', from)
      .lte('event_date', to)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) throw error;
    return (data ?? []) as EventRecord[];
  } catch (error) {
    console.error('Falling back to demo events:', error);
    return getDemoEvents(start);
  }
}

export async function getAllEventsForDate(date: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('events').select('*').eq('event_date', date).order('start_time');
  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

function addDays(base: Date, offset: number) {
  const d = new Date(base);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

function demoEvent(base: Date, offset: number, time: string, name: string, cca: string, location: string, link?: string): EventRecord {
  return {
    id: `demo-${offset}-${time.replace(':', '')}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    event_name: name,
    cca,
    event_date: isoDate(addDays(base, offset)),
    start_time: time,
    end_time: null,
    location,
    registration_link: link ?? null,
    description: null,
    speaker: null,
  };
}

export function getDemoEvents(base = new Date()): EventRecord[] {
  return [
    demoEvent(base, 0, '17:00', 'Welcome Back Social', 'Cultural Committee', 'Students Activity Centre'),
    demoEvent(base, 1, '10:00', 'Consulting Case Workshop', 'Consulting Club', 'L-17', 'https://example.com/register'),
    demoEvent(base, 2, '14:30', 'Finance & Markets Talk', 'Finance & Investment Club', 'L-21'),
    demoEvent(base, 3, '18:00', 'Basketball Trials', 'Sports Committee', 'SAC Ground'),
    demoEvent(base, 4, '16:00', 'Alumni Career Session', 'Alumni Office', 'L-18', 'https://example.com/alumni'),
    demoEvent(base, 5, '19:00', 'Quiz Night', 'Quizzing Club', 'Mess Lawn'),
    demoEvent(base, 6, '11:00', 'Entrepreneurship Workshop', 'Entrepreneurship Cell', 'L-14', 'https://example.com/entrepreneurship'),
    demoEvent(base, 8, '15:00', 'Cultural Practice', 'Cultural Committee', 'Auditorium'),
    demoEvent(base, 9, '17:30', 'Guest Lecture: The Future of AI', 'Technology Club', 'L-21', 'https://example.com/ai-talk'),
    demoEvent(base, 10, '13:00', 'Inter-CCA Football', 'Sports Committee', 'Football Ground'),
    demoEvent(base, 11, '18:30', 'Product Strategy Workshop', 'Consulting Club', 'L-17'),
    demoEvent(base, 13, '10:30', 'Founders & Finance', 'Finance & Investment Club', 'L-21', 'https://example.com/founders'),
  ];
}
