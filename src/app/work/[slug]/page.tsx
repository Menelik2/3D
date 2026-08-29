import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPortfolioBySlug,
  getPublishedPortfolio,
  getPublishedPortfolioSlugs,
} from "@/lib/data/public-cms";
import { getVideoEmbed } from "@/lib/video";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

type Props = { params: Promise<{ slug: string }> };

/** Live CMS: new slugs + edits without Vercel redeploy */
export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getPublishedPortfolioSlugs();
  if (slugs.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (item) {
    return {
      title: item.title,
      description:
        item.description?.slice(0, 160) ||
        `${item.title} — cinematic project by META Pictures.`,
    };
  }
  return {
    title: "Project",
    description: "Cinematic project by META Pictures.",
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);

  if (!item) {
    notFound();
  }

  const related = (await getPublishedPortfolio())
    .filter((p) => p.id !== item.id)
    .slice(0, 3);

  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const embed = getVideoEmbed(item.video_url);
  const cover =
    item.cover_image_url ||
    (embed && embed.kind === "youtube" ? embed.posterUrl : null);

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-muted mb-3">
            {item.category}
            {item.year ? ` · ${item.year}` : ""}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            {item.title}
          </h1>
          {item.description && (
            <p className="mt-4 text-muted text-sm leading-relaxed">
              {item.description}
            </p>
          )}
        </header>

        <div className="mb-16">
          <VideoPlayer
            url={item.video_url}
            title={item.title}
            posterUrl={cover}
          />
        </div>

        {gallery.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {gallery.map((src, i) =>
              typeof src === "string" ? (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden bg-card border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ) : null
            )}
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1fr_240px]">
          <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
            {item.client_name && (
              <p>
                <span className="text-muted">Client</span> — {item.client_name}
              </p>
            )}
            {item.artist_name && (
              <p>
                <span className="text-muted">Artist</span> — {item.artist_name}
              </p>
            )}
          </div>

          <aside className="space-y-6 text-sm">
            {item.director && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Director
                </p>
                <p className="mt-1">{item.director}</p>
              </div>
            )}
            {item.cinematographer && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Cinematographer
                </p>
                <p className="mt-1">{item.cinematographer}</p>
              </div>
            )}
            {item.location && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Location
                </p>
                <p className="mt-1">{item.location}</p>
              </div>
            )}
            {item.year && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Year</p>
                <p className="mt-1">{item.year}</p>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-border pt-12">
          <Link
            href="/work"
            className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
          >
            ← All Work
          </Link>
          <Link
            href="/start-a-project"
            className="inline-flex items-center justify-center bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest text-white hover:bg-accent-hover"
          >
            Start Your Project
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-8">
              More from META Pictures
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="group block aspect-[4/5] bg-card border border-border relative overflow-hidden"
                >
                  {p.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover_image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="text-sm group-hover:text-accent transition-colors">
                      {p.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
