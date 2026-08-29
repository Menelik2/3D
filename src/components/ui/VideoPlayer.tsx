"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { getVideoEmbed } from "@/lib/video";

type Props = {
  url: string | null | undefined;
  title?: string;
  posterUrl?: string | null;
  className?: string;
  autoLoad?: boolean;
  startMuted?: boolean;
  /** Eager poster load (above-the-fold). Default false = lazy. */
  priority?: boolean;
};

/**
 * Performance model:
 * - Poster image only until user clicks Play (no YouTube/network until then)
 * - MP4 src is not attached until Play
 * - Below-fold posters use loading="lazy"
 * - flushSync keeps autoplay inside the user-gesture turn
 */
export function VideoPlayer({
  url,
  title = "Video",
  posterUrl,
  className = "",
  autoLoad = false,
  startMuted = false,
  priority = false,
}: Props) {
  const embed = useMemo(() => getVideoEmbed(url), [url]);
  const [playing, setPlaying] = useState(autoLoad);
  const [inView, setInView] = useState(priority);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || playing) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority, playing]);

  const poster =
    posterUrl ||
    (embed && embed.kind === "youtube" ? embed.posterUrl : null) ||
    null;

  const iframeSrc = useMemo(() => {
    if (!embed || !playing) return "";
    if (embed.kind === "file") return embed.embedUrl;

    const u = new URL(embed.embedUrl);
    u.searchParams.set("autoplay", "1");
    if (startMuted) u.searchParams.set("mute", "1");
    else u.searchParams.delete("mute");
    u.searchParams.set("playsinline", "1");
    u.searchParams.set("rel", "0");
    return u.toString();
  }, [playing, embed, startMuted]);

  function handlePlay() {
    flushSync(() => {
      setPlaying(true);
    });
  }

  if (!embed) {
    if (posterUrl) {
      return (
        <div
          ref={rootRef}
          className={`relative aspect-video overflow-hidden bg-card border border-border ${className}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
        </div>
      );
    }
    return (
      <div
        ref={rootRef}
        className={`relative aspect-video overflow-hidden bg-card border border-border flex items-center justify-center ${className}`}
      >
        <span className="text-xs uppercase tracking-widest text-muted">No video</span>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`space-y-3 ${className}`}>
      <div className="relative aspect-video w-full overflow-hidden bg-black border border-border">
        {playing ? (
          embed.kind === "file" ? (
            <video
              className="absolute inset-0 h-full w-full"
              src={iframeSrc}
              controls
              autoPlay
              playsInline
              muted={startMuted}
              preload="auto"
              poster={poster || undefined}
            />
          ) : (
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              title={title}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="origin-when-cross-origin"
            />
          )
        ) : (
          <>
            {inView && poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={priority ? "high" : "auto"}
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-900" />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <button
              type="button"
              onClick={handlePlay}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 group cursor-pointer"
              aria-label={`Play ${title}`}
            >
              <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-white/30 bg-accent text-white shadow-[0_0_40px_rgba(225,29,72,0.5)] transition group-hover:scale-110 group-active:scale-95">
                <svg
                  className="h-7 w-7 sm:h-8 sm:w-8 ml-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white">
                Play video
              </span>
            </button>
          </>
        )}
      </div>

      {embed.kind === "youtube" && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-widest text-muted">
          <span>YouTube</span>
          <a
            href={embed.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Open on YouTube ↗
          </a>
        </div>
      )}
    </div>
  );
}
