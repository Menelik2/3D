"use client";

import Link from "next/link";
import { HeroScene } from "./HeroScene";
import { FloatingFrames } from "./FloatingFrames";
import { MetaTitle3D } from "./MetaTitle3D";
import { useT } from "@/lib/i18n/context";

export function HeroContent({
  logoVideoUrl: _logoVideoUrl,
  logoUrl: _logoUrl,
}: {
  logoVideoUrl?: string;
  logoUrl?: string;
}) {
  const t = useT();

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-background" />
      <HeroScene />
      <FloatingFrames />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(10,10,10,0.35)_55%,rgba(10,10,10,0.95)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10 py-20 sm:py-16 lg:py-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-5 sm:mb-6 lg:mb-8 flex w-full justify-center">
            <span className="sr-only">META Pictures</span>
            <MetaTitle3D />
          </h1>

          <p className="hero-fade-in hero-delay-1 mb-3 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-muted">
            {t.hero.tagline}
          </p>

          <p className="hero-fade-in hero-delay-2 text-xl sm:text-2xl md:text-3xl lg:text-[2.35rem] font-light tracking-[0.12em] uppercase text-foreground/95">
            {t.hero.headline}
          </p>

          <p className="hero-fade-in hero-delay-2 mx-auto mt-5 max-w-2xl text-sm sm:text-base md:text-[17px] text-muted/80 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="hero-fade-in hero-delay-3 mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="#showreel" className="btn-ghost min-w-[180px] sm:min-w-[200px]">
              {t.hero.watchShowreel}
            </Link>
            <Link href="/start-a-project" className="btn-primary min-w-[180px] sm:min-w-[200px]">
              {t.hero.startProject}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-muted/60 hero-fade-in hero-delay-4">
        <span className="text-[9px] uppercase tracking-[0.3em]">{t.hero.scroll}</span>
        <div className="h-8 w-px bg-gradient-to-b from-muted/50 to-transparent" />
      </div>
    </section>
  );
}
