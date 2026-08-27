import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title,
    description: `${title} — cinematic project by META Pictures.`,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-muted mb-3">
            Music Video · 2026
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-muted text-sm">
            Placeholder project detail. Replace with real content from the CMS
            (title, category, year, client, director, cinematographer, location,
            description, gallery, credits).
          </p>
        </header>

        <div className="relative aspect-video mb-16 overflow-hidden bg-card border border-border">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/5">
                <svg className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm text-muted">Project video / still placeholder</p>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xs uppercase tracking-widest text-muted mb-3">
                About the Project
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Full project description will live here. Story, creative
                direction, production notes and outcome.
              </p>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-muted mb-3">
                Gallery
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/3] bg-card border border-border" />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Client</p>
              <p className="mt-1">—</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Director</p>
              <p className="mt-1">—</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Cinematographer</p>
              <p className="mt-1">—</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Location</p>
              <p className="mt-1">—</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Year</p>
              <p className="mt-1">2026</p>
            </div>
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

        <section className="mt-20">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-8">
            More from META Pictures
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Link
                key={i}
                href={`/work/project-${i}`}
                className="group block aspect-[4/5] bg-card border border-border relative overflow-hidden"
              >
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="text-sm group-hover:text-accent transition-colors">
                    Related Project {i}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
