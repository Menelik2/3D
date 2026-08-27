"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroScene } from "./HeroScene";
import { FloatingFrames } from "./FloatingFrames";

/** Local path first; GitHub raw works even before Vercel picks up public/ files */
const VIDEO_CANDIDATES = [
  "/brand/brand-optimized/meta-logo.mp4",
  "/brand/meta-logo.mp4",
  "https://raw.githubusercontent.com/Menelik2/3D/root/public/brand/brand-optimized/meta-logo.mp4",
];

const LOGO_FALLBACK = "/brand/meta-logo.jpg";

export function HeroContent({
  logoVideoUrl,
  logoUrl,
}: {
  logoVideoUrl?: string;
  logoUrl?: string;
}) {
  const logo = logoUrl?.trim() || LOGO_FALLBACK;
  const preferred = logoVideoUrl?.trim();
  const sources = preferred
    ? [preferred, ...VIDEO_CANDIDATES.filter((s) => s !== preferred)]
    : VIDEO_CANDIDATES;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [srcIndex, setSrcIndex] = useState(0);
  const [useImage, setUseImage] = useState(false);
  const [ready, setReady] = useState(false);

  const videoSrc = !useImage && srcIndex < sources.length ? sources[srcIndex] : null;

  // Force autoplay on mobile browsers after mount
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSrc) return;
    el.muted = true;
    const p = el.play();
    if (p) p.catch(() => {
      /* autoplay blocked — poster still shows */
    });
  }, [videoSrc]);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-background" />
      <HeroScene />
      <FloatingFrames />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.25)_50%,rgba(10,10,10,0.9)_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <h1 className="hero-fade-in mb-2 flex justify-center">
          <span className="sr-only">META Pictures</span>
          {videoSrc ? (
            <video
              ref={videoRef}
              key={videoSrc}
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={logo}
              onCanPlay={() => setReady(true)}
              onError={() => {
                if (srcIndex + 1 < sources.length) setSrcIndex((i) => i + 1);
                else setUseImage(true);
              }}
              className={`h-40 w-auto sm:h-52 md:h-64 lg:h-72 object-contain drop-shadow-[0_0_60px_rgba(225,29,72,0.35)] transition-opacity duration-700 ${
                ready ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            />
          ) : (
            <picture>
              <source srcSet="/brand/meta-logo.webp" type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt=""
                width={480}
                height={270}
                className="h-40 w-auto sm:h-52 md:h-64 lg:h-72 object-contain drop-shadow-[0_0_60px_rgba(225,29,72,0.35)]"
                decoding="async"
              />
            </picture>
          )}
        </h1>

        <p className="hero-fade-in hero-delay-1 mb-4 text-[10px] sm:text-xs uppercase tracking-[0.4em] text-muted">
          Cinematic Film & Media Production
        </p>
        <p className="hero-fade-in hero-delay-2 text-base sm:text-xl md:text-2xl font-light tracking-[0.12em] text-muted/90">
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
