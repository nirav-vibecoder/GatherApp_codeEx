-- Optional demo seed. Safe to run after schema.sql.
-- Uses current_date so the seeded schedule always covers the next two weeks.
insert into public.events (event_name, cca, event_date, start_time, end_time, location, registration_link)
values
  ('Welcome Back Social', 'Cultural Committee', current_date, '17:00', '19:00', 'Students Activity Centre', null),
  ('Consulting Case Workshop', 'Consulting Club', current_date + 1, '10:00', '12:00', 'L-17', 'https://example.com/register'),
  ('Finance & Markets Talk', 'Finance & Investment Club', current_date + 2, '14:30', '16:00', 'L-21', null),
  ('Basketball Trials', 'Sports Committee', current_date + 3, '18:00', '20:00', 'SAC Ground', null),
  ('Alumni Career Session', 'Alumni Office', current_date + 4, '16:00', '17:30', 'L-18', 'https://example.com/alumni'),
  ('Quiz Night', 'Quizzing Club', current_date + 5, '19:00', '21:00', 'Mess Lawn', null),
  ('Entrepreneurship Workshop', 'Entrepreneurship Cell', current_date + 6, '11:00', '13:00', 'L-14', 'https://example.com/entrepreneurship'),
  ('Cultural Practice', 'Cultural Committee', current_date + 8, '15:00', '17:00', 'Auditorium', null),
  ('Guest Lecture: The Future of AI', 'Technology Club', current_date + 9, '17:30', '19:00', 'L-21', 'https://example.com/ai-talk'),
  ('Inter-CCA Football', 'Sports Committee', current_date + 10, '13:00', '15:00', 'Football Ground', null),
  ('Product Strategy Workshop', 'Consulting Club', current_date + 11, '18:30', '20:00', 'L-17', null),
  ('Founders & Finance', 'Finance & Investment Club', current_date + 13, '10:30', '12:00', 'L-21', 'https://example.com/founders')
on conflict (event_name, event_date, start_time) do update set
  cca = excluded.cca,
  end_time = excluded.end_time,
  location = excluded.location,
  registration_link = excluded.registration_link,
  updated_at = now();
