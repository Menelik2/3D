# META Pictures

Cinematic film & media production platform — public website + admin CMS.

**Repo:** https://github.com/Menelik2/3D  
**Primary branch:** `root` (full application)  
**Supabase:** `https://oqipymvqqptjxiaeasgd.supabase.co`  
**Admin email:** `Metapictures23@gmail.com`

> **Note:** Branch `main` is outdated. Use **`root`** for all development and deploys.

```bash
git clone https://github.com/Menelik2/3D.git
cd 3D
git checkout root
npm install
cp .env.example .env.local
# fill Supabase keys, then:
npm run dev
```

To make `main` match `root`:

```bash
git checkout main
git reset --hard origin/root
git push origin main --force
```

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres, Auth, RLS, Storage)
- Single-admin dashboard + lightweight CMS

## Public site

| Path | Description |
|------|-------------|
| `/` | Homepage (hero, showreel, selected work) |
| `/work` | Portfolio |
| `/services` | Services |
| `/start-a-project` | 7-step inquiry wizard → `leads` |
| `/book-consultation` | Consultation booking |
| `/about` `/team` `/journal` `/faq` `/contact` | Content pages |

## Admin (`/admin`)

Login required (`SUPER_ADMIN` / `ADMIN` only).

| Path | Description |
|------|-------------|
| `/admin` | Dashboard KPIs + pipeline |
| `/admin/leads` | Lead list + detail (status, notes) |
| `/admin/portfolio` | CMS: create / edit / publish |
| `/admin/faqs` `/team` `/journal` | Lightweight CMS |
| `/admin/settings` | Contact & social |
| `/admin/media` | Brand media env status |

## Setup checklist

1. Copy `.env.example` → `.env.local`
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Run `supabase/schema.sql` in SQL Editor
4. Create Auth user: `Metapictures23@gmail.com`
5. Run `supabase/single-admin-setup.sql`
6. `npm run dev` → http://localhost:3000/admin/login

## License

Private — META Pictures
