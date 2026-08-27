import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "META Pictures — a creative film and media production company. We transform ideas into visual stories that people remember.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-20 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            About META Pictures
          </h1>
          <p className="mt-6 text-lg text-muted font-light leading-relaxed">
            We transform ideas into visual stories that people remember.
          </p>
        </header>

        <div className="grid gap-16 lg:grid-cols-2">
          <section>
            <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
              Who We Are
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              META Pictures is a creative film and media production company that
              transforms ideas, people, brands, music, events and real stories
              into cinematic visual experiences.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              We don&apos;t just film. We create cinema.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
              Our Philosophy
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              Every frame has a story. We believe in intentional framing,
              thoughtful pacing and emotional honesty — whether the project is a
              music video, a brand film or a wedding day.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
              What We Create
            </h2>
            <ul className="space-y-2 text-muted">
              <li>Music Videos</li>
              <li>Commercial & Brand Films</li>
              <li>Wedding Films</li>
              <li>Documentaries</li>
              <li>Corporate Communication</li>
              <li>Event Coverage</li>
              <li>Social Content & Photography</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
              Production Process
            </h2>
            <ol className="space-y-3 text-muted">
              <li><span className="text-foreground">01</span> — Idea & Creative Direction</li>
              <li><span className="text-foreground">02</span> — Pre-Production</li>
              <li><span className="text-foreground">03</span> — Production</li>
              <li><span className="text-foreground">04</span> — Editing & Color</li>
              <li><span className="text-foreground">05</span> — Client Review</li>
              <li><span className="text-foreground">06</span> — Final Delivery</li>
            </ol>
          </section>
        </div>

        <div className="mt-24 border-t border-border pt-16 text-center">
          <h2 className="text-2xl font-light">Meet the team</h2>
          <p className="mt-3 text-sm text-muted">
            Team members are managed in the admin dashboard.
          </p>
          <Link
            href="/team"
            className="mt-6 inline-block text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
          >
            View Team →
          </Link>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/start-a-project"
            className="inline-flex items-center justify-center bg-accent px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-accent-hover"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </div>
  );
}
