"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

type Props = {
  title?: string;
  description?: string;
};

export function CtaBlock({ title, description }: Props) {
  const { locale } = useI18n();
  const p = getPageCopy(locale);

  return (
    <section className="relative mt-20 border-t border-border pt-16 md:pt-20 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(225,29,72,0.1), transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
          {title ?? p.cta.title}
        </h2>
        <p className="mt-4 text-sm text-muted leading-relaxed">
          {description ?? p.cta.description}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/start-a-project" className="btn-primary min-w-[180px]">
            {p.cta.startProject}
          </Link>
          <Link href="/book-consultation" className="btn-ghost min-w-[180px]">
            {p.cta.bookConsultation}
          </Link>
        </div>
      </div>
    </section>
  );
}
