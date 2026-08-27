# META Pictures — Cinematic Production Platform

**EVERY FRAME HAS A STORY.**

Production-ready foundation for META Pictures, a professional film & media production company website.

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend / DB**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Design**: Dark cinematic UI, red accent matching logo

## Supabase Project

- **URL**: `https://oqipymvqqptjxiaeasgd.supabase.co`

### Setup (required)

1. Clone and install:

```bash
git clone https://github.com/Menelik2/3D.git
cd 3D
git checkout root
npm install
```

2. Create `.env.local`:

```bash
cp .env.example .env.local
```

3. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Project Settings → API** and copy:

```
NEXT_PUBLIC_SUPABASE_URL=https://oqipymvqqptjxiaeasgd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

> Never commit `.env.local` or the service role key.

4. **Run the schema**

- Dashboard → **SQL Editor** → New query
- Paste the full contents of `supabase/schema.sql`
- Run it

This creates enums, tables, indexes, RLS policies, lead reference generator, and seed data (budget ranges + site settings).

5. **Storage buckets** (Dashboard → Storage → New bucket):

| Bucket          | Public |
|-----------------|--------|
| `portfolio`     | Yes    |
| `client-files`  | No     |
| `avatars`       | Yes    |
| `bts`           | Yes    |

6. Start:

```bash
npm run dev
```

## Features

- Full public site (home, work, services, about, team, journal, BTS, FAQ, contact)
- Multi-step **Start a Project** → `POST /api/leads` → `leads` table
- **Book Consultation** → `POST /api/consultations` → `consultations` table
- Automatic lead reference numbers (`MP-YYMMDD-XXXXXX`)
- RLS: public can insert leads/consultations; staff can manage; clients see own data

## Database tables

`profiles` · `clients` · `leads` · `lead_notes` · `projects` · `project_members` · `portfolio_items` · `services` · `consultations` · `availability_slots` · `blocked_dates` · `testimonials` · `team_members` · `journal_posts` · `bts_posts` · `faqs` · `media` · `documents` · `deliverable_revisions` · `messages` · `notifications` · `audit_logs` · `site_settings` · `budget_ranges`

## Roles (RBAC)

`SUPER_ADMIN` · `ADMIN` · `PRODUCER` · `EDITOR` · `CLIENT`

## Next steps

1. Paste your **anon** + **service_role** keys into `.env.local`
2. Run `supabase/schema.sql` in the SQL Editor
3. Create storage buckets
4. (Optional) Create first admin user in Auth, then set `role = 'SUPER_ADMIN'` on their `profiles` row
5. Admin dashboard + client portal

## License

Private / proprietary for META Pictures.
