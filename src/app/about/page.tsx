import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBlock } from "@/components/ui/CtaBlock";
import { getPublishedTeam } from "@/lib/data/public-cms";

export const metadata: Metadata = {
  title: "About",
  description:
    "META Pictures — a creative film and media production company. We transform ideas into visual stories that people remember.",
};

export default async function AboutPage() {
  const team = await getPublishedTeam();

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Studio"
          title="About META Pictures"
          description="We transform ideas into visual stories that people remember. Intentional framing. Thoughtful pacing. Emotional honesty."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">
              Who we are
            </h2>
            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              META Pictures is a creative film and media production company that
              turns ideas, people, brands, music, events, and real stories into
              cinematic visual experiences.
            </p>
            <p className="text-muted leading-relaxed text-sm sm:text-base">
              We don&apos;t just film. We create cinema — for artists, brands,
              and moments that matter.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">
              Philosophy
            </h2>
            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              Every frame has a story. Whether it&apos;s a music video, a brand
              film, or a wedding day, we build narrative through light,
              movement, and careful editing — not just coverage.
            </p>
          </section>
        </div>

        <section className="mt-20 grid gap-10 border-t border-border pt-16 md:grid-cols-2">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
              What we create
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-muted">
              {[
                "Music Videos",
                "Commercial & Brand Films",
                "Wedding Films",
                "Documentaries",
                "Corporate Communication",
                "Event Coverage",
                "Social Content",
                "Photography",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent/80" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
              Production process
            </h2>
            <ol className="space-y-3 text-sm">
              {[
                "Idea & creative direction",
                "Pre-production",
                "Production",
                "Editing & color",
                "Client review",
                "Final delivery",
              ].map((step, i) => (
                <li key={step} className="flex gap-4 text-muted">
                  <span className="font-mono text-[11px] text-accent/90 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground/85">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {team.length > 0 && (
          <section className="mt-20 border-t border-border pt-16">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
                  People
                </p>
                <h2 className="text-2xl font-light">The team</h2>
              </div>
              <Link
                href="/team"
                className="text-[11px] uppercase tracking-widest text-muted hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.slice(0, 6).map((member) => (
                <div
                  key={member.id}
                  className="border border-border bg-card/20 overflow-hidden"
                >
                  <div className="aspect-[4/5] bg-zinc-900 relative">
                    {member.profile_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.profile_image_url}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-light">{member.name}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <CtaBlock />
      </div>
    </div>
  );
}
