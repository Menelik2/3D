"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

type Channel = { href: string; label: string; external: boolean };

export function ContactContent({
  channels,
  address,
}: {
  channels: Channel[];
  address?: string;
}) {
  const { locale } = useI18n();
  const p = getPageCopy(locale).contact;

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-5">{p.directLines}</h2>
              {channels.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {channels.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="border border-border px-5 py-3 text-xs uppercase tracking-widest text-muted hover:border-accent hover:text-foreground transition-colors"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">{p.noDetails}</p>
              )}
              {address && <p className="mt-6 text-sm text-muted leading-relaxed">{address}</p>}
            </div>

            <div className="border border-border bg-card/20 p-6 text-sm text-muted leading-relaxed">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">{p.responseTitle}</p>
              <p>{p.responseBody}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/start-a-project"
              className="group block border border-border bg-card/30 p-8 transition hover:border-accent/50"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">{p.primary}</p>
              <h3 className="text-xl font-light tracking-tight group-hover:text-accent transition-colors">
                {p.startTitle}
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">{p.startDesc}</p>
              <span className="mt-6 inline-block text-[11px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                {p.beginInquiry}
              </span>
            </Link>
            <Link
              href="/book-consultation"
              className="group block border border-border bg-card/30 p-8 transition hover:border-accent/50"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">{p.meeting}</p>
              <h3 className="text-xl font-light tracking-tight group-hover:text-accent transition-colors">
                {p.consultTitle}
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">{p.consultDesc}</p>
              <span className="mt-6 inline-block text-[11px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                {p.requestSlot}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
