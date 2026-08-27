import Link from "next/link";
import {
  telLink,
  whatsappLink,
  type ContactConfig,
  type SocialConfig,
} from "@/lib/site-config";

const explore = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export function Footer({
  contact,
  social,
}: {
  contact: ContactConfig;
  social: SocialConfig;
}) {
  const contactLinks = [
    contact.email
      ? { href: `mailto:${contact.email}`, label: contact.email }
      : null,
    contact.whatsapp
      ? { href: whatsappLink(contact.whatsapp), label: "WhatsApp" }
      : null,
    contact.phone ? { href: telLink(contact.phone), label: contact.phone } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  const socialLinks = [
    social.instagram ? { href: social.instagram, label: "Instagram" } : null,
    social.youtube ? { href: social.youtube, label: "YouTube" } : null,
    social.tiktok ? { href: social.tiktok, label: "TikTok" } : null,
    social.facebook ? { href: social.facebook, label: "Facebook" } : null,
    social.telegram ? { href: social.telegram, label: "Telegram" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="border-t border-border bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
              Next project
            </p>
            <p className="text-lg font-light tracking-tight">
              Ready when you are.
            </p>
          </div>
          <Link href="/start-a-project" className="btn-primary self-start sm:self-auto">
            Start a Project
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-[13px] font-semibold tracking-[0.2em] uppercase group-hover:text-accent transition-colors">
                META Pictures
              </span>
            </Link>
            <p className="mt-5 text-sm text-muted leading-relaxed max-w-xs">
              Every frame has a story.
            </p>
            <p className="mt-2 text-xs text-muted/65 leading-relaxed max-w-xs">
              Cinematic film &amp; media production for brands, artists, and
              real moments.
            </p>
            {contact.address && (
              <p className="mt-5 text-xs text-muted/65">{contact.address}</p>
            )}
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground mb-5">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground mb-5">
              Contact
            </h3>
            {contactLinks.length > 0 ? (
              <ul className="space-y-2.5">
                {contactLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">
                <Link href="/contact" className="hover:text-foreground">
                  Get in touch →
                </Link>
              </p>
            )}
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground mb-5">
              Follow
            </h3>
            {socialLinks.length > 0 ? (
              <ul className="space-y-2.5">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted/60">
                Social links: Admin → Settings
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} META Pictures. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
