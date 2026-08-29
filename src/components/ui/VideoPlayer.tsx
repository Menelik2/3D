"use client";

import { useState } from "react";
import { getVideoEmbed } from "@/lib/video";

type Props = {
  url: string | null | undefined;
  title?: string;
  posterUrl?: string | null;
  className?: string;
};

/**
 * Poster + play button. Loads YouTube/Vimeo embed (or file) only after click
 * so the user gets a clear play control on the site.
 */
export function VideoPlayer({
  url,
  title = "Video",
  posterUrl,
  className = "",
}: Props) {
  const [playing, setPlaying] = useState(false);
  const embed = getVideoEmbed(url);

  if (!embed) {
    if (posterUrl) {
      return (
        <div
          className={`relative aspect-video overflow-hidden bg-card border border-border ${className}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      );
    }
    return (
      <div
        className={`relative aspect-video overflow-hidden bg-card border border-border flex items-center justify-center ${className}`}
      >
        <span className="text-xs uppercase tracking-widest text-muted">No video</span>
      </div>
    );
  }

  const poster =
    posterUrl || (embed.kind === "youtube" ? embed.posterUrl : null) || null;

  const playSrc =
    embed.kind === "youtube"
      ? `${embed.embedUrl}${embed.embedUrl.includes("?") ? "&" : "?"}autoplay=1`
      : embed.kind === "vimeo"
        ? `${embed.embedUrl}${embed.embedUrl.includes("?") ? "&" : "?"}autoplay=1`
        : embed.embedUrl;

  return (
    <div
      className={`relative aspect-video overflow-hidden bg-card border border-border ${className}`}
    >
      {playing ? (
        embed.kind === "file" ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={playSrc}
            controls
            autoPlay
            playsInline
            poster={poster || undefined}
          />
        ) : (
          <iframe
            src={playSrc}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )
      ) : (
        <>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-900" />
          )}
          <div className="absolute inset-0 bg-black/35" />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 group cursor-pointer"
            aria-label={`Play ${title}`}
          >
            <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-white/30 bg-accent/90 text-white shadow-[0_0_40px_rgba(225,29,72,0.45)] transition group-hover:scale-110 group-hover:bg-accent group-hover:shadow-[0_0_56px_rgba(225,29,72,0.55)]">
              <svg
                className="h-7 w-7 sm:h-8 sm:w-8 ml-1"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white/90">
              Play video
            </span>
          </button>
        </>
      )}
    </div>
  );
}
