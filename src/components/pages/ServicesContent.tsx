"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBlock } from "@/components/ui/CtaBlock";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

export function ServicesContent() {
  const { locale } = useI18n();
  const p = getPageCopy(locale).services;

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

        <div className="grid gap-4 md:grid-cols-2">
          {p.items.map((service, i) => (
            <div
              key={service.title}
              className="group border border-border bg-card/20 p-8 md:p-10 transition duration-300 hover:border-accent/35 hover:bg-card/40"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] text-muted/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-1 w-1 rounded-full bg-accent/0 group-hover:bg-accent transition-colors mt-1.5" />
              </div>
              <h2 className="mt-4 text-xl font-light tracking-tight group-hover:text-accent transition-colors">
                {service.title}
              </h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <Link href="/work" className="btn-ghost">{p.viewWork}</Link>
          <Link href="/start-a-project" className="btn-primary">{p.startProject}</Link>
        </div>

        <CtaBlock title={p.ctaTitle} description={p.ctaDesc} />
      </div>
    </div>
  );
}
