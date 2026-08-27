import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedJournal } from "@/lib/data/public-cms";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBlock } from "@/components/ui/CtaBlock";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Production journal — cinematography, behind the scenes, creative direction and META Pictures news.",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export default async function JournalPage() {
  const posts = await getPublishedJournal();

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Notes from set"
          title="Journal"
          description="Process, craft, and stories from META Pictures productions."
        />

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="group border border-border bg-card/20 overflow-hidden block transition hover:border-accent/30"
              >
                <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                  {post.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                    {[post.category, formatDate(post.published_at)]
                      .filter(Boolean)
                      .join(" · ") || "Journal"}
                  </p>
                  <h2 className="mt-2 text-lg font-light tracking-tight group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-block text-[10px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-border bg-card/20 px-8 py-20 text-center">
            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              Journal entries will appear here once published from the studio
              dashboard.
            </p>
          </div>
        )}

        <CtaBlock />
      </div>
    </div>
  );
}
