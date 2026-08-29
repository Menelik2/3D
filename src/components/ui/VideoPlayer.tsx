"use client";

import { useMemo, useState } from "react";
import { getVideoEmbed } from "@/lib/video";

type Props = {
  url: string | null | undefined;
  title?: string;
  posterUrl?: string | null;
  className?: string;
  autoLoad?: boolean;
};

export function VideoPlayer({
  url,
  title = "Video",
  posterUrl,
  className = "",
  autoLoad = false,
}: Props) {
  const embed = useMemo(() => getVideoEmbed(url), [url]);
  const [playing, setPlaying] = useState(autoLoad);

  const poster =
    posterUrl ||
    (embed && embed.kind === "youtube" ? embed.posterUrl : null) ||
    null;

  const iframeSrc = useMemo(() => {
    if (!embed) return "";
    if (!playing) return embed.embedUrl;
    if (embed.kind === "file") return embed.embedUrl;
    const join = embed.embedUrl.includes("?") ? "&" : "?";
    return `${embed.embedUrl}${join}autoplay=1`;
  }, [playing, embed]);

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

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative aspect-video w-full overflow-hidden bg-black border border-border">
        {playing ? (
          embed.kind === "file" ? (
            <video
              className="absolute inset-0 h-full w-full"
              src={iframeSrc}
              controls
              autoPlay
              playsInline
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
            <div className="absolute inset-0 bg-black/40" />
            <button
              type="button"
              onClick={() => setPlaying(true)}
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
