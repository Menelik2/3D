import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublicSiteConfig } from "@/lib/data/site-settings";
import { telLink, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with META Pictures. Start a project, book a consultation or send a message.",
};

export default async function ContactPage() {
  const { contact, social } = await getPublicSiteConfig();

  const channels = [
    contact.whatsapp
      ? { href: whatsappLink(contact.whatsapp), label: "WhatsApp", external: true }
      : null,
    contact.phone
      ? { href: telLink(contact.phone), label: contact.phone, external: false }
      : null,
    contact.email
      ? { href: `mailto:${contact.email}`, label: contact.email, external: false }
      : null,
    social.instagram
      ? { href: social.instagram, label: "Instagram", external: true }
      : null,
  ].filter(Boolean) as { href: string; label: string; external: boolean }[];

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Connect"
          title="Contact"
          description="Ready to start a conversation? Reach out directly or use a structured inquiry so we can respond with the right next step."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-5">
                Direct lines
              </h2>
              {channels.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {channels.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      {...(c.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="border border-border px-5 py-3 text-xs uppercase tracking-widest text-muted hover:border-accent hover:text-foreground transition-colors"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  Contact details will appear here once set in Admin → Settings
                  or environment variables.
                </p>
              )}
              {contact.address && (
                <p className="mt-6 text-sm text-muted leading-relaxed">
                  {contact.address}
                </p>
              )}
            </div>

            <div className="border border-border bg-card/20 p-6 text-sm text-muted leading-relaxed">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
                Response time
              </p>
              <p>
                Project inquiries are reviewed in order received. For time-sensitive
                shoots, include preferred dates in your form so we can prioritize.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/start-a-project"
              className="group block border border-border bg-card/30 p-8 transition hover:border-accent/50"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
                Primary
              </p>
              <h3 className="text-xl font-light tracking-tight group-hover:text-accent transition-colors">
                Start a Project
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Multi-step inquiry — vision, dates, location, budget, and
                references. Best for productions with a clear brief.
              </p>
              <span className="mt-6 inline-block text-[11px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                Begin inquiry →
              </span>
            </Link>
            <Link
              href="/book-consultation"
              className="group block border border-border bg-card/30 p-8 transition hover:border-accent/50"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
                Meeting
              </p>
              <h3 className="text-xl font-light tracking-tight group-hover:text-accent transition-colors">
                Book a Consultation
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Creative direction, production planning, wedding or music video
                meetings — when you want to talk before committing.
              </p>
              <span className="mt-6 inline-block text-[11px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                Request a slot →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
