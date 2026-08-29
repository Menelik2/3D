/**
 * Public CMS reads (Supabase).
 * Cache Components temporarily disabled for stable Vercel builds.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null | undefined;

function publicSupabase(): SupabaseClient | null {
  if (_client !== undefined) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    _client = null;
    return null;
  }
  _client = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

export type PortfolioListItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number | null;
  cover_image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
};

export type PortfolioDetail = PortfolioListItem & {
  description: string | null;
  client_name: string | null;
  artist_name: string | null;
  director: string | null;
  cinematographer: string | null;
  location: string | null;
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

export type JournalDetail = JournalListItem & {
  body: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  profile_image_url: string | null;
  skills: string[] | null;
};

/** Slugs for generateStaticParams (build-time prerender). */
export async function getPublishedPortfolioSlugs(): Promise<string[]> {
  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolio_items")
    .select("slug")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(100);

  if (error) {
    console.error("[getPublishedPortfolioSlugs]", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug as string).filter(Boolean);
}

export async function getPublishedJournalSlugs(): Promise<string[]> {
  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("journal_posts")
    .select("slug")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[getPublishedJournalSlugs]", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug as string).filter(Boolean);
}

/** Published portfolio items (list). */
export async function getPublishedPortfolio(): Promise<PortfolioListItem[]> {
  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      "id, title, slug, category, year, cover_image_url, video_url, is_featured"
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
  const supabase = publicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      "id, title, slug, category, year, cover_image_url, video_url, is_featured"
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

  const { data: fallback } = await supabase
    .from("portfolio_items")
    .select(
      "id, title, slug, category, year, cover_image_url, video_url, is_featured"
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  return (fallback ?? []) as PortfolioListItem[];
}

const PORTFOLIO_DETAIL_SELECT =
  "id, title, slug, category, year, cover_image_url, is_featured, description, client_name, artist_name, director, cinematographer, location, video_url, video_poster_url, gallery, credits";

function decodeSlugParam(slug: string): string {
  let s = slug.trim();
  try {
    s = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }
  return s;
}

/** Single published portfolio item by slug (or UUID id). */
export async function getPortfolioBySlug(
  slug: string
): Promise<PortfolioDetail | null> {
  const supabase = publicSupabase();
  if (!supabase) return null;

  const decoded = decodeSlugParam(slug);
  const candidates = Array.from(
    new Set([decoded, slug.trim()].filter(Boolean))
  );

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select(PORTFOLIO_DETAIL_SELECT)
      .eq("slug", candidate)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("[getPortfolioBySlug]", error.message);
      continue;
    }
    if (data) return data as PortfolioDetail;
  }

  const maybeId = decoded;
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      maybeId
    )
  ) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select(PORTFOLIO_DETAIL_SELECT)
      .eq("id", maybeId)
      .eq("is_published", true)
      .maybeSingle();
    if (error) {
      console.error("[getPortfolioBySlug:id]", error.message);
      return null;
    }
    if (data) return data as PortfolioDetail;
  }

  return null;
}

/** Published FAQs. */
export async function getPublishedFaqs(): Promise<FaqItem[]> {
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

/** Single published journal post by slug. */
export async function getJournalBySlug(
  slug: string
): Promise<JournalDetail | null> {
  const supabase = publicSupabase();
  if (!supabase) return null;

  const decoded = decodeSlugParam(slug);
  const { data, error } = await supabase
    .from("journal_posts")
    .select(
      "id, title, slug, excerpt, category, cover_image_url, published_at, body, tags, seo_title, seo_description"
    )
    .eq("slug", decoded)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[getJournalBySlug]", error.message);
    return null;
  }
  return data as JournalDetail | null;
}

/** Published team members. */
export async function getPublishedTeam(): Promise<TeamMember[]> {
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
