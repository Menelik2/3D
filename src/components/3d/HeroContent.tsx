"use client";

import Link from "next/link";
import { HeroScene } from "./HeroScene";
import { FloatingFrames } from "./FloatingFrames";

export function HeroContent() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-background" />
      <HeroScene />
      <FloatingFrames />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-background/80 z-[2]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <p className="hero-fade-in mb-6 text-xs uppercase tracking-[0.35em] text-muted">
          Film · Media · 3D Motion
        </p>
        <h1 className="hero-fade-in hero-delay-1 text-4xl font-light tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="inline-block hero-title-3d">META Pictures</span>
        </h1>
        <p className="hero-fade-in hero-delay-2 mt-6 text-lg sm:text-xl md:text-2xl font-light tracking-wide text-muted">
          EVERY FRAME HAS A STORY.
        </p>

        <div className="hero-fade-in hero-delay-3 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#showreel"
            className="inline-flex min-w-[200px] items-center justify-center border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-foreground backdrop-blur-sm transition hover:bg-white/10 hover:border-accent/40"
          >
            Watch Showreel
          </Link>
          <Link
            href="/start-a-project"
            className="inline-flex min-w-[200px] items-center justify-center bg-accent px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-accent-hover shadow-[0_0_40px_rgba(225,29,72,0.25)]"
          >
            Start a Project
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted hero-fade-in hero-delay-4">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-muted to-transparent animate-pulse" />
      </div>
    </section>
  );
}
