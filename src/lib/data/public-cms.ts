/**
 * Public CMS reads with Cache Components ("use cache").
 * Safe for Server Components — no cookies / request APIs inside cached scopes.
 * Invalidate via revalidateTag / updateTag from CMS write routes.
 */

import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

function publicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type PortfolioListItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number | null;
  cover_image_url: string | null;
  is_featured: boolean;
};

export type PortfolioDetail = PortfolioListItem & {
  description: string | null;
  client_name: string | null;
  artist_name: string | null;
  director: string | null;
  cinematographer: string | null;
  location: string | null;
  video_url: string | null;
  video_poster_url: string | null;
  gallery: unknown;
  credits: unknown;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
};

export type JournalListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  profile_image_url: string | null;
  skills: string[] | null;
};

/** Published portfolio items (list). Cached + tagged for CMS revalidation. */
export async function getPublishedPortfolio(): Promise<PortfolioListItem[]> {
  "use cache";
  cacheTag("portfolio");
  cacheLife("hours");

  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      "id, title, slug, category, year, cover_image_url, is_featured"
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(48);

  if (error) {
    console.error("[getPublishedPortfolio]", error.message);
    return [];
  }
  return (data ?? []) as PortfolioListItem[];
}

/** Featured portfolio for homepage teaser. */
export async function getFeaturedPortfolio(
  limit = 6
): Promise<PortfolioListItem[]> {
  "use cache";
  cacheTag("portfolio");
  cacheLife("hours");

  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      "id, title, slug, category, year, cover_image_url, is_featured"
    )
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[getFeaturedPortfolio]", error.message);
    return [];
  }

  if (data && data.length > 0) return data as PortfolioListItem[];

  // Fallback: latest published if none are featured
  const { data: fallback } = await supabase
    .from("portfolio_items")
    .select(
      "id, title, slug, category, year, cover_image_url, is_featured"
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  return (fallback ?? []) as PortfolioListItem[];
}

/** Single published portfolio item by slug. */
export async function getPortfolioBySlug(
  slug: string
): Promise<PortfolioDetail | null> {
  "use cache";
  cacheTag("portfolio");
  cacheTag(`portfolio:${slug}`);
  cacheLife("hours");

  const supabase = publicSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      "id, title, slug, category, year, cover_image_url, is_featured, description, client_name, artist_name, director, cinematographer, location, video_url, video_poster_url, gallery, credits"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[getPortfolioBySlug]", error.message);
    return null;
  }
  return data as PortfolioDetail | null;
}

/** Published FAQs. */
export async function getPublishedFaqs(): Promise<FaqItem[]> {
  "use cache";
  cacheTag("faqs");
  cacheLife("days");

  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, category")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getPublishedFaqs]", error.message);
    return [];
  }
  return (data ?? []) as FaqItem[];
}

/** Published journal posts (list). */
export async function getPublishedJournal(): Promise<JournalListItem[]> {
  "use cache";
  cacheTag("journal");
  cacheLife("hours");

  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("journal_posts")
    .select(
      "id, title, slug, excerpt, category, cover_image_url, published_at"
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(24);

  if (error) {
    console.error("[getPublishedJournal]", error.message);
    return [];
  }
  return (data ?? []) as JournalListItem[];
}

/** Published team members. */
export async function getPublishedTeam(): Promise<TeamMember[]> {
  "use cache";
  cacheTag("team");
  cacheLife("days");

  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, role, bio, profile_image_url, skills")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getPublishedTeam]", error.message);
    return [];
  }
  return (data ?? []) as TeamMember[];
}
