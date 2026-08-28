"use client";

import Link from "next/link";
import { PerspectiveCard } from "@/components/3d/PerspectiveCard";
import { useT } from "@/lib/i18n/context";

type FeaturedProject = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  year: number | null;
  cover_image_url: string | null;
};

export function HomeSections({
  featured,
  showreel,
  poster,
}: {
  featured: FeaturedProject[];
  showreel?: string;
  poster?: string;
}) {
  const t = useT();

  return (
    <>
      <section id="showreel" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted mb-4">
              {t.home.showreelLabel}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
              {t.home.showreelTitle}
            </h2>
            <p className="mt-3 text-sm text-muted">{t.home.showreelDesc}</p>
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
                <div className="text-center px-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <svg className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted">{t.home.showreelSoon}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-muted">
            <span>META Pictures</span>
            <Link href="/work" className="hover:text-foreground transition-colors">
              {t.home.viewAllWork}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted mb-3">
                {t.home.portfolioLabel}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
                {t.home.portfolioTitle}
              </h2>
              <p className="mt-2 text-sm text-muted">{t.home.portfolioDesc}</p>
            </div>
            <Link
              href="/work"
              className="text-[11px] uppercase tracking-widest text-muted hover:text-foreground transition-colors"
            >
              {t.home.viewAllWork}
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
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
              <p className="text-sm text-muted max-w-md mx-auto">{t.home.featuredEmpty}</p>
              <Link href="/work" className="btn-ghost mt-8 inline-flex">
                {t.home.browseWork}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-card/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted mb-3">
              {t.home.capabilitiesLabel}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
              {t.home.capabilitiesTitle}
            </h2>
            <p className="mt-3 text-sm text-muted max-w-xl mx-auto">
              {t.home.capabilitiesDesc}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.services.map((service) => (
              <Link
                key={service}
                href="/services"
                className="group border border-border bg-background/40 px-5 py-6 transition duration-300 hover:border-accent/40 hover:-translate-y-0.5"
              >
                <h3 className="text-sm font-medium tracking-wide group-hover:text-accent transition-colors">
                  {service}
                </h3>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/services" className="btn-ghost">
              {t.home.exploreServices}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 border-t border-border overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(225,29,72,0.1), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
            {t.home.ctaTitle}
          </h2>
          <p className="mt-4 text-muted text-sm sm:text-base max-w-lg mx-auto">
            {t.home.ctaDesc}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/start-a-project" className="btn-primary min-w-[200px]">
              {t.nav.startProject}
            </Link>
            <Link href="/book-consultation" className="btn-ghost min-w-[200px]">
              {t.home.bookConsultation}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
