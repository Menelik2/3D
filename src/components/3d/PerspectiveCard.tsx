"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  href: string;
  title: string;
  category: string | null;
  year: number | null;
  coverUrl: string | null;
  hasVideo?: boolean;
  featured?: boolean;
  aspect?: "cinema" | "poster";
  index?: number;
  onPlay?: () => void;
};

export function PerspectiveCard({
  href,
  title,
  category,
  year,
  coverUrl,
  hasVideo = false,
  featured = false,
  aspect = "cinema",
  index = 0,
  onPlay,
}: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const reset = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.classList.remove("is-tracking");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--px", "50%");
    el.style.setProperty("--py", "50%");
    el.style.setProperty("--lift", "0px");
  }, []);

  function onMove(e: React.MouseEvent) {
    const el = cardRef.current;
    if (!el || reduceRef.current) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const intensity = featured ? 6 : 9;
    el.classList.add("is-tracking");
    el.style.setProperty("--rx", `${(py - 0.5) * -intensity}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * (intensity + 2)}deg`);
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
    el.style.setProperty("--lift", featured ? "16px" : "10px");
  }

  const aspectClass = featured
    ? "aspect-[16/9] md:aspect-[2.2/1]"
    : aspect === "poster"
      ? "aspect-[4/5]"
      : "aspect-video";

  return (
    <div
      className="work-card-enter"
      style={{ animationDelay: `${Math.min(index, 10) * 70}ms` }}
    >
      <Link
        ref={cardRef}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className={`work-card group relative block overflow-hidden bg-card ${aspectClass}`}
      >
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="work-card-media absolute inset-0 h-full w-full object-cover"
            loading={featured || index < 2 ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}

        <span className="work-card-letterbox" aria-hidden />
        <span className="work-card-glare" aria-hidden />
        <span className="work-card-rim" aria-hidden />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        {hasVideo && (
          <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
            {onPlay ? (
              <button
                type="button"
                aria-label={`Play ${title}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPlay();
                }}
                className="work-play pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm md:h-16 md:w-16"
              >
                <svg
                  className="ml-0.5 h-6 w-6 md:h-7 md:w-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : (
              <span
                className="work-play flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm md:h-16 md:w-16"
              >
                <svg
                  className="ml-0.5 h-6 w-6 md:h-7 md:w-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            )}
          </div>
        )}

        <div
          className="absolute inset-x-0 bottom-0 z-[7] flex items-end justify-between gap-4 p-5 md:p-7 pointer-events-none"
          style={{ transform: "translateZ(36px)" }}
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">
              {category || "Project"}
              {year ? ` · ${year}` : ""}
              {hasVideo ? " · Film" : ""}
            </p>
            <h3
              className={`mt-1.5 font-light tracking-tight text-white transition-colors duration-300 group-hover:text-accent ${
                featured
                  ? "text-2xl sm:text-3xl md:text-4xl"
                  : "text-lg sm:text-xl"
              }`}
            >
              {title}
            </h3>
          </div>
          {featured && (
            <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.28em] text-white/50 sm:block">
              Featured
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
