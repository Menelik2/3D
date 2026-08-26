# META Pictures — Cinematic Production Platform

**EVERY FRAME HAS A STORY.**

Production-ready foundation for META Pictures, a professional film & media production company website.

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Design**: Dark cinematic UI, premium minimalism, film-inspired spacing
- **Planned backend**: PostgreSQL + secure auth (RBAC) + object storage (e.g. Supabase Storage)

## Current Status

This repository contains a **working public website shell** with:

- Cinematic homepage (hero, showreel section, selected work, services teaser, CTA)
- Work / Services / About / Contact / Journal / Team / BTS / FAQ routes
- Multi-step **Start a Project** inquiry wizard (7 steps)
- Responsive mobile navigation (full-screen menu)
- Premium dark theme matching the META Pictures logo aesthetic (red accent)
- SEO metadata, 404 page, Privacy & Terms placeholders
- Footer with configurable contact/social structure

### Intentionally left as architecture / next steps

The original brief is very large (full admin CMS, lead management, client portal, consultation booking with conflict prevention, file uploads to private storage, RBAC, notifications, etc.).

These systems require:

1. Database (PostgreSQL) + schema
2. Auth (e.g. NextAuth / Supabase Auth) with roles: SUPER_ADMIN, ADMIN, PRODUCER, EDITOR, CLIENT
3. Object storage for videos/images/documents
4. Environment secrets (never commit them)

They are **not** fully implemented in this initial push so the public site remains clean and deployable immediately.

## Getting Started

```bash
git clone https://github.com/Menelik2/3D.git
cd 3D
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` (when added) and configure:

- Database URL
- Auth secrets
- Storage credentials
- Contact numbers / WhatsApp / email (site settings)

Never commit real secrets.

## Design Direction

- Deep charcoal / black backgrounds
- White typography
- Subtle red accent (`#e11d48`) matching the logo
- Large editorial cards, film-inspired spacing
- Full-screen mobile menu
- Grain texture, reduced-motion support
- Accessible focus states

## Primary Conversion Path

Visitor → Cinematic experience → Showreel → Work → Services → Trust → **Start a Project** → Consultation → Production → Delivery

## Roadmap (recommended order)

1. Connect PostgreSQL + define schema (users, clients, leads, projects, portfolio_items, services, consultations, site_settings, …)
2. Secure file uploads (public portfolio vs private client files)
3. Admin dashboard + lightweight CMS
4. Lead status pipeline & notes
5. Consultation booking + availability
6. Client portal + approval / revision system
7. Email notification templates
8. Analytics events
9. Full SEO (sitemap, structured data, OG images)

## Brand

- Primary message: **EVERY FRAME HAS A STORY.**
- Supporting: We Don't Just Film. We Create Cinema. / Your Vision. Our Frame.

## License

Private / proprietary for META Pictures. All rights reserved.

---

Built as a production foundation — not a template.
