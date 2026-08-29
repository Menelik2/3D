"use client";

import { useEffect } from "react";
import Link from "next/link";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { PortfolioListItem } from "@/lib/data/public-cms";
import { getVideoEmbed } from "@/lib/video";

export function WorkCinema({
  item,
  onClose,
}: {
  item: PortfolioListItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const embed = getVideoEmbed(item.video_url);
  const poster =
    item.cover_image_url ||
    (embed && embed.kind === "youtube" ? embed.posterUrl : null);

  return (
    <div
      className="work-cinema-overlay fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 cursor-pointer"
        aria-label="Close player"
        onClick={onClose}
      />

      <div className="work-cinema-frame relative z-10 w-full max-w-5xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">
              {item.category || "Project"}
              {item.year ? ` · ${item.year}` : ""}
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-light tracking-tight">
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 border border-border px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted hover:text-foreground hover:border-white/30 transition-colors"
          >
            Close
          </button>
        </div>

        <VideoPlayer
          url={item.video_url}
          title={item.title}
          posterUrl={poster}
          autoLoad
          priority
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/work/${item.slug}`}
            className="text-[11px] uppercase tracking-[0.22em] text-accent hover:underline"
          >
            View project →
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Esc to close
          </p>
        </div>
      </div>
    </div>
  );
}
