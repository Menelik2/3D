import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with META Pictures. Start a project, book a consultation or send a message.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            Contact
          </h1>
          <p className="mt-4 text-muted text-sm sm:text-base">
            Ready to start a conversation? Reach out through any of the channels
            below or use the project inquiry form.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
                Quick Contact
              </h2>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="border border-border px-5 py-3 text-xs uppercase tracking-widest text-muted hover:border-accent hover:text-foreground transition-colors">WhatsApp</a>
                <a href="tel:+0000000000" className="border border-border px-5 py-3 text-xs uppercase tracking-widest text-muted hover:border-accent hover:text-foreground transition-colors">Call</a>
                <a href="mailto:hello@metapictures.example" className="border border-border px-5 py-3 text-xs uppercase tracking-widest text-muted hover:border-accent hover:text-foreground transition-colors">Email</a>
                <a href="#" className="border border-border px-5 py-3 text-xs uppercase tracking-widest text-muted hover:border-accent hover:text-foreground transition-colors">Instagram</a>
              </div>
              <p className="mt-4 text-xs text-muted/60">
                Contact channels are configurable in site settings. Replace placeholders with real numbers and links.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Link href="/start-a-project" className="block border border-border bg-card/40 p-8 transition hover:border-accent/50">
              <h3 className="text-lg font-light">Start a Project</h3>
              <p className="mt-2 text-sm text-muted">Multi-step inquiry form — tell us about your vision, dates, budget and references.</p>
              <span className="mt-4 inline-block text-xs uppercase tracking-widest text-accent">Begin inquiry →</span>
            </Link>
            <Link href="/book-consultation" className="block border border-border bg-card/40 p-8 transition hover:border-accent/50">
              <h3 className="text-lg font-light">Book a Consultation</h3>
              <p className="mt-2 text-sm text-muted">Creative consultation, production planning, wedding or music video meetings.</p>
              <span className="mt-4 inline-block text-xs uppercase tracking-widest text-accent">View availability →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
