# META Pictures — Cinematic Production Platform

**EVERY FRAME HAS A STORY.**

Production-ready foundation for META Pictures, a professional film & media production company website.

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend / DB**: Supabase (PostgreSQL + Auth + Storage)
- **Design**: Dark cinematic UI, premium minimalism, film-inspired spacing

## Supabase Project

- URL: `https://oqipymvqqptjxiaeasgd.supabase.co`

### Setup

1. Clone and install:

```bash
git clone https://github.com/Menelik2/3D.git
cd 3D
git checkout root
npm install
```

2. Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

3. Fill in keys from your Supabase dashboard → **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://oqipymvqqptjxiaeasgd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run the database schema:

- Open Supabase Dashboard → **SQL Editor**
- Paste and run the contents of `supabase/schema.sql`
- This creates tables, RLS policies, triggers, and seed data (budget ranges + site settings)

5. Create Storage buckets (Dashboard → Storage):

| Bucket         | Public |
|----------------|--------|
| `portfolio`    | Yes    |
| `client-files` | No     |
| `avatars`      | Yes    |
| `bts`          | Yes    |

6. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current Features

- Cinematic public website (all routes)
- Multi-step **Start a Project** inquiry → saves to `leads` table
- **Book Consultation** form → saves to `consultations` table
- Full PostgreSQL schema with RLS
- Role-ready profiles (SUPER_ADMIN, ADMIN, PRODUCER, EDITOR, CLIENT)
- Lead status pipeline
- Portfolio, journal, team, FAQ, BTS structures

## Database Entities

`profiles` · `clients` · `leads` · `lead_notes` · `projects` · `project_members` · `portfolio_items` · `services` · `consultations` · `availability_slots` · `blocked_dates` · `testimonials` · `team_members` · `journal_posts` · `bts_posts` · `faqs` · `media` · `documents` · `deliverable_revisions` · `messages` · `notifications` · `audit_logs` · `site_settings` · `budget_ranges`

## Security Notes

- Never commit `.env.local` or the service role key
- RLS is enabled; public can only insert leads/consultations and read published content
- Staff policies use `is_staff()` helper
- Tighten policies further by role as you build the admin dashboard

## Roadmap

1. ✅ Public site + inquiry forms
2. ✅ Database schema + Supabase client
3. Admin dashboard (leads, portfolio CMS, team, FAQ)
4. Auth (login for staff + client portal)
5. File uploads to Storage
6. Consultation availability calendar
7. Client portal + approval system
8. Email notifications

## Brand

- Primary: **EVERY FRAME HAS A STORY.**
- Supporting: We Don't Just Film. We Create Cinema.

## License

Private / proprietary for META Pictures. All rights reserved.
