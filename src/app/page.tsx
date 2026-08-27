import Link from "next/link";
import { getFeaturedPortfolio } from "@/lib/data/public-cms";
import { getPublicSiteConfig } from "@/lib/data/site-settings";
import { HeroContent } from "@/components/3d/HeroContent";
import { PerspectiveCard } from "@/components/3d/PerspectiveCard";

export default async function HomePage() {
  const [featured, { media }] = await Promise.all([
    getFeaturedPortfolio(6),
    getPublicSiteConfig(),
  ]);

  const showreel = media.showreelUrl;
  const poster = media.showreelPosterUrl;

  return (
    <div className="grain">
      <HeroContent />

      {/* SHOWREEL */}
      <section id="showreel" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide">
              SEE WHAT WE SEE.
            </h2>
            <p className="mt-3 text-sm text-muted">
              Our latest showreel — a selection of cinematic work.
            </p>
          </div>

          <div className="relative aspect-video overflow-hidden bg-card border border-border shadow-[0_0_80px_rgba(225,29,72,0.08)]">
            {showreel ? (
              showreel.includes("youtube.com") ||
              showreel.includes("youtu.be") ||
              showreel.includes("vimeo.com") ? (
                <iframe
                  src={showreel}
                  title="META Pictures showreel"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  controls
                  playsInline
                  poster={poster || undefined}
                  src={showreel}
                />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/5">
                    <svg
                      className="h-6 w-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted">Showreel coming soon</p>
                  <p className="mt-1 text-xs text-muted/60">
                    Set NEXT_PUBLIC_SHOWREEL_URL in env
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
            <span>META Pictures · Showreel</span>
            <Link
              href="/work"
              className="uppercase tracking-widest hover:text-foreground transition-colors"
            >
              View all work →
            </Link>
          </div>
        </div>
      </section>

      {/* SELECTED WORK — 3D perspective cards */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">
                Selected Work
              </h2>
              <p className="mt-2 text-sm text-muted">
                Music videos · Commercials · Weddings · Documentaries
              </p>
            </div>
            <Link
              href="/work"
              className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
            >
              View All Work →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
              {featured.map((project) => (
                <PerspectiveCard
                  key={project.id}
                  href={`/work/${project.slug}`}
                  title={project.title}
                  category={project.category}
                  year={project.year}
                  coverUrl={project.cover_image_url}
                />
              ))}
            </div>
          ) : (
            <div className="border border-border bg-card/20 p-12 text-center">
              <p className="text-sm text-muted">
                Featured projects will appear here once published in the admin
                portfolio (mark items as Featured).
              </p>
              <Link
                href="/work"
                className="mt-6 inline-flex text-xs uppercase tracking-widest text-accent hover:underline"
              >
                Browse work →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="py-24 md:py-32 border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">
              What We Create
            </h2>
            <p className="mt-3 text-sm text-muted max-w-xl mx-auto">
              From music videos to documentaries — cinematic storytelling for
              brands, artists, and real moments.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Music Videos",
              "Commercial Films",
              "Wedding Films",
              "Event Production",
              "Corporate Films",
              "Documentaries",
              "Social Media Content",
              "Photography",
            ].map((service) => (
              <Link
                key={service}
                href="/services"
                className="group border border-border bg-background/50 p-6 transition hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] duration-300"
              >
                <h3 className="text-sm font-medium tracking-wide group-hover:text-accent transition-colors">
                  {service}
                </h3>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
            >
              Explore All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32 border-t border-border overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.12), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">
            Ready to tell your story?
          </h2>
          <p className="mt-4 text-muted text-sm sm:text-base">
            Whether you have a clear vision or just an idea — we help shape it
            into cinema.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/start-a-project"
              className="inline-flex min-w-[200px] items-center justify-center bg-accent px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-accent-hover shadow-[0_0_40px_rgba(225,29,72,0.2)]"
            >
              Start a Project
            </Link>
            <Link
              href="/book-consultation"
              className="inline-flex min-w-[200px] items-center justify-center border border-white/20 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-foreground transition hover:bg-white/5"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
