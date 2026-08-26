import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grain">
      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background placeholder — replace with video or high-res image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-muted">
            Film & Media Production
          </p>
          <h1 className="text-4xl font-light tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            META Pictures
          </h1>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl font-light tracking-wide text-muted">
            EVERY FRAME HAS A STORY.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#showreel"
              className="inline-flex min-w-[200px] items-center justify-center border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-foreground backdrop-blur-sm transition hover:bg-white/10"
            >
              Watch Showreel
            </Link>
            <Link
              href="/start-a-project"
              className="inline-flex min-w-[200px] items-center justify-center bg-accent px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-accent-hover"
            >
              Start a Project
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-muted to-transparent" />
        </div>
      </section>

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

          {/* Video placeholder */}
          <div className="relative aspect-video overflow-hidden bg-card border border-border">
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
                <p className="text-sm text-muted">Showreel video placeholder</p>
                <p className="mt-1 text-xs text-muted/60">
                  Replace with real video + poster in CMS / settings
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
            <span>Production Year · Duration</span>
            <Link
              href="/work"
              className="uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Watch Full Showreel →
            </Link>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
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

          {/* Editorial grid of placeholder projects */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Project One", cat: "Music Video", year: "2025" },
              { title: "Project Two", cat: "Commercial", year: "2025" },
              { title: "Project Three", cat: "Wedding Film", year: "2024" },
              { title: "Project Four", cat: "Documentary", year: "2024" },
              { title: "Project Five", cat: "Corporate", year: "2025" },
              { title: "Project Six", cat: "Event", year: "2024" },
            ].map((project, i) => (
              <Link
                key={i}
                href="/work"
                className="group relative block aspect-[4/5] overflow-hidden bg-card border border-border"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition group-hover:opacity-90" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted">
                      {project.cat} · {project.year}
                    </p>
                    <h3 className="mt-1 text-lg font-light text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>
                {/* Placeholder image area */}
                <div className="absolute inset-0 -z-10 bg-zinc-900" />
              </Link>
            ))}
          </div>
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
                className="group border border-border bg-background/50 p-6 transition hover:border-accent/50"
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
      <section className="py-24 md:py-32 border-t border-border">
        <div className="mx-auto max-w-3xl px-4 text-center">
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
              className="inline-flex min-w-[200px] items-center justify-center bg-accent px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-accent-hover"
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
