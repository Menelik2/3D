"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

export function FaqContent({ cmsFaqs }: { cmsFaqs: { q: string; a: string }[] }) {
  const { locale } = useI18n();
  const p = getPageCopy(locale).faq;
  const faqs = cmsFaqs.length > 0 ? cmsFaqs : p.fallback;

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

        <div className="space-y-0 border-t border-border">
          {faqs.map((item) => (
            <div key={item.q} className="border-b border-border py-7 first:pt-8">
              <h2 className="text-base sm:text-lg font-light tracking-tight">{item.q}</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 border border-border bg-card/20 p-8 text-center">
          <p className="text-sm text-muted">{p.stillQuestions}</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact" className="btn-ghost min-w-[160px]">{p.contact}</Link>
            <Link href="/start-a-project" className="btn-primary min-w-[160px]">{p.startProject}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
