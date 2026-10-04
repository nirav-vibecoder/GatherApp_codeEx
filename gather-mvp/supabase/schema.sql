create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  cca text not null,
  event_date date not null,
  start_time time not null,
  end_time time,
  location text not null,
  registration_link text,
  description text,
  speaker text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_name, event_date, start_time)
);

create index if not exists events_event_date_idx on public.events(event_date);
create index if not exists events_event_date_start_time_idx on public.events(event_date, start_time);

alter table public.events enable row level security;

-- Students may read events; only the server-side admin route writes them.
drop policy if exists "events are readable by everyone" on public.events;
create policy "events are readable by everyone" on public.events for select using (true);

-- Optional helper seed. Run after the table exists; the app also has an in-code demo fallback.
