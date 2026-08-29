"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBlock } from "@/components/ui/CtaBlock";
import { WorkFilterGrid } from "@/components/WorkFilterGrid";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WorkContent({ projects }: { projects: any[] }) {
  const { locale } = useI18n();
  const p = getPageCopy(locale).work;

  return (
    <div className="relative pt-24 md:pt-28 pb-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 work-gallery-atmosphere" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

        {projects.length > 0 ? (
          <WorkFilterGrid projects={projects} />
        ) : (
          <div className="border border-border bg-card/20 px-8 py-20 text-center">
            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">{p.empty}</p>
            <Link href="/start-a-project" className="btn-primary mt-8 inline-flex">
              {p.commission}
            </Link>
          </div>
        )}

        <CtaBlock />
      </div>
    </div>
  );
}
