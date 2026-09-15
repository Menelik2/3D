"use client";

import { useCallback, useEffect, useState } from "react";

export type GalleryPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
};

export function ClientGalleryViewer({
  title,
  clientName,
  photos,
}: {
  title: string;
  clientName?: string | null;
  photos: GalleryPhoto[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const current = index !== null ? photos[index] : null;

  const close = useCallback(() => setIndex(null), []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => {
        if (i === null || photos.length === 0) return i;
        return (i + dir + photos.length) % photos.length;
      });
    },
    [photos.length]
  );

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, go]);

  // Touch swipe
  useEffect(() => {
    if (!open) return;
    let startX = 0;
    function onStart(e: TouchEvent) {
      startX = e.touches[0]?.clientX ?? 0;
    }
    function onEnd(e: TouchEvent) {
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const dx = endX - startX;
      if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [open, go]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
              META Pictures
            </p>
            <h1 className="mt-1 truncate text-lg font-light tracking-tight text-white sm:text-xl">
              {title}
            </h1>
            {clientName ? (
              <p className="mt-0.5 text-xs text-white/50">{clientName}</p>
            ) : null}
          </div>
          <p className="shrink-0 text-[11px] tabular-nums text-white/40">
            {photos.length} {photos.length === 1 ? "photo" : "photos"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-2 py-3 sm:px-4 sm:py-6">
        {photos.length === 0 ? (
          <p className="py-24 text-center text-sm text-white/40">
            No photos in this gallery yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 sm:grid-cols-3 sm:gap-1 md:grid-cols-4 lg:grid-cols-5">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                className="group relative aspect-square overflow-hidden bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url}
                  alt={p.caption || ""}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] group-active:scale-[0.98]"
                  loading={i < 12 ? "eager" : "lazy"}
                  decoding="async"
                />
                <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen lightbox — iPhone Photos style */}
      {open && current && index !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div className="flex items-center justify-between gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
            <button
              type="button"
              onClick={close}
              className="flex h-11 min-w-[44px] items-center justify-center px-2 text-sm text-white/90"
            >
              Close
            </button>
            <p className="text-[11px] tabular-nums text-white/50">
              {index + 1} / {photos.length}
            </p>
            <span className="w-14" />
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-1 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur sm:flex hover:bg-white/20"
              aria-label="Previous"
            >
              ‹
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image_url}
              alt={current.caption || ""}
              className="max-h-full max-w-full object-contain select-none"
              draggable={false}
            />

            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-1 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur sm:flex hover:bg-white/20"
              aria-label="Next"
            >
              ›
            </button>
          </div>

          <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 text-center">
            {current.caption ? (
              <p className="text-sm text-white/70">{current.caption}</p>
            ) : (
              <p className="text-[10px] uppercase tracking-widest text-white/30">
                Swipe or use arrows
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
