# Gather — Etrigan 3.0

A production-quality MVP for a campus event calendar inside the Etrigan 3.0 ecosystem. Gather answers one simple question: **what is happening on campus over the next two weeks?**

> Everything happening on campus.
>
> That WhatsApp message is probably gone by now.

## 1. Product overview

Gather consolidates fragmented event announcements into one lightweight two-week calendar. The student experience defaults to today, lets students select any of the next 14 days, and opens event details in a responsive side drawer.

## 2. Problem statement

Campus event information is spread across email, WhatsApp, club/committee announcements, sports communications and guest-lecture announcements. The core problem is discoverability, not information availability.

## 3. User personas

- **Student:** wants a fast view of today and the next two weeks, with a clear way to open event details and register.
- **Gather admin:** uploads a standardized Excel schedule, sees row-level validation, and imports only valid workbooks into Supabase.

## 4. MVP scope

Included: student Gather page, 14-day calendar, day selection, event cards, event details drawer, registration links, today/empty state, Excel upload, validation, Supabase persistence, Supabase Auth admin protection, responsive UI and Vercel-ready structure.

Explicitly not implemented: recommendations, event density, AI, push notifications, WhatsApp/Google Calendar integrations, native app, student-created events, RSVP management, analytics, chatbot, comments or club dashboards.

## 5. User flow

1. Open `/gather`.
2. See today selected and the next 14 days.
3. Click a date.
4. Read that day's events.
5. Click an event.
6. Open details drawer.
7. Follow registration in a new tab when available.
8. Admin signs in at `/admin/gather/login`.
9. Upload Excel → validate → import.
10. Return to Gather and see the imported events.

## 6. Screens

- `/gather` — student experience.
- `/admin/gather/login` — Supabase Auth login.
- `/admin/gather` — admin Excel import and validation.

## 7. Tech stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Lucide React
- Supabase PostgreSQL
- Supabase Auth
- SheetJS (`xlsx`)
- Vercel

## 8. Architecture

Server components load the relevant 14-day event window. Client components handle date selection and the event drawer. The admin upload route runs in the Node.js runtime, parses the workbook, validates every row, and uses the Supabase service-role client only on the server for writes.

## 9. Database schema

See `supabase/schema.sql`.

Required fields: `event_name`, `cca`, `event_date`, `start_time`, `location`.

Nullable: `end_time`, `registration_link`, `description`, `speaker`.

Indexes cover `event_date` and `(event_date, start_time)`. A unique constraint on `(event_name, event_date, start_time)` makes imports idempotent through upsert.

## 10. Authentication approach

Supabase Auth handles admin email/password authentication. The admin route then checks the signed-in user's email against `ADMIN_EMAIL`. This is intentionally simple for the MVP and avoids hard-coded credentials.

### Configure an admin

1. Create the admin user in Supabase Authentication → Users.
2. Set `ADMIN_EMAIL` to exactly that email in your local `.env.local` and Vercel project settings.
3. Do not put the service-role key in client code.

## 11. Excel import flow

The accepted headers are:

`Event Name | CCA | Date | Time | Location | Registration Link`

Optional headers accepted by the parser are `End Time`, `Description`, and `Speaker`.

Validation checks missing event name, missing CCA, invalid date, invalid time, missing location and invalid registration URL. The admin sees row-level errors. Valid rows can still be imported; invalid rows are skipped and reported in the success summary.

Dates accept ISO dates and other values that JavaScript can safely parse. Excel date serials are also supported. Times accept Excel time serials and common `HH:MM`, `H:MM AM/PM` formats.

## 12. Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
```

The service-role key is server-only and must never be prefixed with `NEXT_PUBLIC_`.

## 13. Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000/gather`.

If Supabase variables are not configured, Gather intentionally falls back to deterministic demo events so the UI can be evaluated immediately. Admin import requires Supabase configuration.

## 14. Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Enable Email/Password under Authentication → Providers.
4. Create the admin user.
5. Add the Supabase URL, anon key, service-role key and `ADMIN_EMAIL` to `.env.local`.

## 15. Vercel deployment

1. Push this project to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Add the four environment variables from `.env.example`.
4. Deploy.
5. In Supabase Auth, add the Vercel URL to the appropriate Site URL / redirect configuration.
6. Verify `/gather` and `/admin/gather/login`.

The app does not use local filesystem persistence, SQLite, Docker, or long-running server processes.

## 16. Demo data

When Supabase is not configured, `lib/events.ts` supplies 12 deterministic fictional campus events across the current 14-day window. This is intentionally separate from the database and can be removed once a Supabase environment is seeded.

## 17. How admin upload works

The browser sends the workbook to `/api/admin/gather/import`. The route first checks the Supabase Auth session and `ADMIN_EMAIL`. It then parses and validates the workbook. A preview request never writes. A normal request upserts the validated rows using the server-only service-role client.

## 18. Known limitations

- Student authentication is represented by a realistic demo session (`Nirav Meghani`, `PGP42147`) rather than Etrigan production auth.
- The public calendar currently uses server-side service-role reads when Supabase is configured; the provided RLS policy also permits public reads for the `events` table.
- The MVP intentionally does not implement advanced event filtering, recommendations or notifications.

## 19. Future roadmap

Potential later phases: event density visualization, search/filtering, recommendation engine, push/email notifications, WhatsApp/Google Calendar integrations, student-created events, RSVP management and analytics.


## Local browser preview (no npm/network required)

This repository also includes `preview.html`, a dependency-free visual demo of the student Gather experience. It uses deterministic demo events and supports day selection and the event details drawer.

Run it with:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/preview.html`.

The preview is only a local visual fallback; the Next.js application remains the production implementation.

## 20. AI/Codex development prompts used

Add your Codex prompts here as development progresses.

## AI Development Log

| Date | Prompt / change | Result |
|---|---|---|
| | | |

## Quality checklist

- [x] Gather page
- [x] Etrigan-inspired visual language
- [x] Header + left navigation
- [x] 14-day calendar
- [x] Today selected by default
- [x] Day selection without navigation
- [x] Event cards
- [x] Event drawer
- [x] Registration links
- [x] Empty state
- [x] Excel validation
- [x] Invalid rows rejected
- [x] Supabase persistence path
- [x] Admin Auth + allowlist
- [x] Loading/error/success states
- [x] Responsive layout
- [x] `.env.example`
- [x] Vercel deployment instructions
- [x] No committed secrets
