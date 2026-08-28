"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

export function NotFoundContent() {
  const { locale } = useI18n();
  const p = getPageCopy(locale).notFound;

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.35em] text-muted mb-4">{p.code}</p>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight">{p.title}</h1>
        <p className="mt-4 text-sm text-muted leading-relaxed">{p.description}</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-w-[160px] items-center justify-center bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-accent-hover"
          >
            {p.home}
          </Link>
          <Link
            href="/work"
            className="inline-flex min-w-[160px] items-center justify-center border border-white/20 px-6 py-3 text-xs font-medium uppercase tracking-widest text-foreground transition hover:bg-white/5"
          >
            {p.viewWork}
          </Link>
        </div>
      </div>
    </div>
  );
}
