"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBlock } from "@/components/ui/CtaBlock";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

type Member = {
  id: string;
  name: string;
  role: string;
  profile_image_url: string | null;
};

export function AboutContent({ team }: { team: Member[] }) {
  const { locale } = useI18n();
  const p = getPageCopy(locale).about;

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">{p.whoTitle}</h2>
            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">{p.whoP1}</p>
            <p className="text-muted leading-relaxed text-sm sm:text-base">{p.whoP2}</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">{p.philosophyTitle}</h2>
            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">{p.philosophyP}</p>
          </section>
        </div>

        <section className="mt-20 grid gap-10 border-t border-border pt-16 md:grid-cols-2">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">{p.createTitle}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-muted">
              {p.createItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent/80" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">{p.processTitle}</h2>
            <ol className="space-y-3 text-sm">
              {p.processSteps.map((step, i) => (
                <li key={step} className="flex gap-4 text-muted">
                  <span className="font-mono text-[11px] text-accent/90 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground/85">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {team.length > 0 && (
          <section className="mt-20 border-t border-border pt-16">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">{p.peopleLabel}</p>
                <h2 className="text-2xl font-light">{p.teamTitle}</h2>
              </div>
              <Link href="/team" className="text-[11px] uppercase tracking-widest text-muted hover:text-foreground transition-colors">
                {p.viewAll}
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.slice(0, 6).map((member) => (
                <div key={member.id} className="border border-border bg-card/20 overflow-hidden">
                  <div className="aspect-[4/5] bg-zinc-900 relative">
                    {member.profile_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.profile_image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-light">{member.name}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-widest text-muted">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <CtaBlock />
      </div>
    </div>
  );
}
