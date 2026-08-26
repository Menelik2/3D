import Link from "next/link";

const footerLinks = {
  explore: [
    { href: "/work", label: "Work" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/journal", label: "Journal" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  contact: [
    { href: "mailto:hello@metapictures.example", label: "Email" },
    { href: "#", label: "WhatsApp" },
    { href: "tel:+0000000000", label: "Call" },
  ],
  social: [
    { href: "#", label: "Instagram" },
    { href: "#", label: "YouTube" },
    { href: "#", label: "TikTok" },
    { href: "#", label: "Facebook" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-sm font-semibold tracking-cinematic uppercase"
            >
              META Pictures
            </Link>
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs">
              Every Frame Has a Story.
            </p>
            <p className="mt-2 text-xs text-muted/70">
              We transform ideas into visual stories that people remember.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-foreground mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
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

          {/* Contact */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-foreground mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              {footerLinks.contact.map((link) => (
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
            <p className="mt-4 text-xs text-muted/60">
              {/* Placeholder — configure real contact in admin settings */}
              Contact details are managed in site settings.
            </p>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-foreground mb-4">
              Follow
            </h3>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
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
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} META Pictures. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
