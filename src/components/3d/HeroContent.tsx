"use client";

import Link from "next/link";
import { HeroScene } from "./HeroScene";
import { FloatingFrames } from "./FloatingFrames";

export function HeroContent({
  logoVideoUrl,
  logoUrl,
}: {
  logoVideoUrl?: string;
  logoUrl?: string;
}) {
  const video = logoVideoUrl?.trim();
  const logo = logoUrl?.trim() || "/brand/meta-logo.jpg";

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-background" />
      <HeroScene />
      <FloatingFrames />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.35)_55%,rgba(10,10,10,0.92)_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <div className="hero-fade-in mb-8 flex justify-center">
          {video ? (
            <video
              key={video}
              src={video}
              autoPlay
              muted
              loop
              playsInline
              poster={logo}
              className="h-28 w-auto sm:h-36 md:h-44 object-contain drop-shadow-[0_0_40px_rgba(225,29,72,0.25)]"
              aria-label="META Pictures logo animation"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt="META Pictures"
              className="h-28 w-auto sm:h-36 md:h-44 object-contain drop-shadow-[0_0_40px_rgba(225,29,72,0.25)]"
            />
          )}
        </div>

        <p className="hero-fade-in hero-delay-1 mb-6 text-[10px] sm:text-xs uppercase tracking-[0.4em] text-muted">
          Cinematic Film &amp; Media Production
        </p>
        <h1 className="hero-fade-in hero-delay-1 text-4xl font-light tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <span className="inline-block hero-title-3d">META Pictures</span>
        </h1>
        <p className="hero-fade-in hero-delay-2 mt-6 text-base sm:text-xl md:text-2xl font-light tracking-[0.12em] text-muted/90">
          Every frame has a story.
        </p>
        <p className="hero-fade-in hero-delay-2 mx-auto mt-5 max-w-lg text-sm text-muted/70 leading-relaxed">
          Music videos, commercials, weddings, and documentaries — crafted with
          intentional framing and emotional honesty.
        </p>

        <div className="hero-fade-in hero-delay-3 mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="#showreel" className="btn-ghost min-w-[200px]">
            Watch Showreel
          </Link>
          <Link href="/start-a-project" className="btn-primary min-w-[200px]">
            Start a Project
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted/70 hero-fade-in hero-delay-4">
        <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-muted/60 to-transparent" />
      </div>
    </section>
  );
}
