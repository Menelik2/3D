import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getJournalBySlug,
  getPublishedJournal,
  getPublishedJournalSlugs,
} from "@/lib/data/public-cms";

type Props = { params: Promise<{ slug: string }> };

/** Live CMS: new slugs + edits without Vercel redeploy */
export const dynamicParams = true;
export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const slugs = await getPublishedJournalSlugs();
  if (slugs.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalBySlug(slug);
  if (!post) {
    return { title: "Journal" };
  }
  return {
    title: post.seo_title || post.title,
    description:
      post.seo_description ||
      post.excerpt?.slice(0, 160) ||
      `${post.title} — META Pictures Journal.`,
  };
}

export default async function JournalDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getJournalBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = (await getPublishedJournal())
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const dateLabel = formatDate(post.published_at);
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : [];

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/journal"
          className="inline-block text-[11px] uppercase tracking-widest text-muted hover:text-foreground transition-colors mb-10"
        >
          ← Journal
        </Link>

        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted mb-4">
            {[post.category, dateLabel].filter(Boolean).join(" · ") ||
              "Journal"}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-muted text-base sm:text-lg leading-relaxed">
              {post.excerpt}
            </p>
          )}
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest border border-border px-2 py-1 text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.cover_image_url && (
          <div className="relative aspect-[16/9] mb-12 overflow-hidden bg-card border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}

        {post.body ? (
          <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {post.body}
          </div>
        ) : (
          <p className="text-sm text-muted">This post has no body yet.</p>
        )}

        <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Link
            href="/journal"
            className="text-[11px] uppercase tracking-widest text-muted hover:text-foreground transition-colors"
          >
            ← All posts
          </Link>
          <Link href="/start-a-project" className="btn-primary">
            Start a Project
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-8">
            More from the journal
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/journal/${p.slug}`}
                className="group border border-border bg-card/20 overflow-hidden block transition hover:border-accent/30"
              >
                <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                  {p.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover_image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-widest text-muted">
                    {p.category || "Journal"}
                  </p>
                  <h3 className="mt-2 text-lg font-light group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
