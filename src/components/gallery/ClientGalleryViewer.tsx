"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "@/app/gallery-3d.css";

export type GalleryPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
};

function GalleryTile({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip heavy tilt on coarse pointers (most phones)
    if (e.pointerType === "touch") return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const ry = (x - 0.5) * 14; // deg
    const rx = (0.5 - y) * 12;

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--lift", "18px");
    el.style.setProperty("--px", `${x * 100}%`);
    el.style.setProperty("--py", `${y * 100}%`);
    el.classList.add("is-tracking");
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lift", "0px");
    el.classList.remove("is-tracking");
  }

  return (
    <button
      ref={ref}
      type="button"
      className="g3d-card"
      style={{ animationDelay: `${Math.min(index, 18) * 45}ms` }}
      onClick={onOpen}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-label={photo.caption || `Photo ${index + 1}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.image_url}
        alt={photo.caption || ""}
        className="g3d-card-media"
        loading={index < 12 ? "eager" : "lazy"}
        decoding="async"
      />
      <span className="g3d-card-depth" aria-hidden />
      <span className="g3d-card-rim" aria-hidden />
      <span className="g3d-card-glare" aria-hidden />
    </button>
  );
}

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
  const [swapKey, setSwapKey] = useState(0);
  const open = index !== null;
  const current = index !== null ? photos[index] : null;

  const close = useCallback(() => setIndex(null), []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => {
        if (i === null || photos.length === 0) return i;
        return (i + dir + photos.length) % photos.length;
      });
      setSwapKey((k) => k + 1);
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
    <div className="g3d-root">
      <div className="g3d-atmosphere" aria-hidden>
        <div className="g3d-frame g3d-frame-a" />
        <div className="g3d-frame g3d-frame-b" />
        <div className="g3d-frame g3d-frame-c" />
      </div>

      <header className="relative z-20 sticky top-0 border-b border-white/10 bg-black/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
              META Pictures
            </p>
            <h1 className="mt-1 truncate text-lg font-light tracking-tight text-white sm:text-xl hero-title-3d">
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

      <main className="g3d-stage relative z-10 mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-8">
        {photos.length === 0 ? (
          <p className="py-24 text-center text-sm text-white/40">
            No photos in this gallery yet.
          </p>
        ) : (
          <div className="g3d-grid">
            {photos.map((p, i) => (
              <GalleryTile
                key={p.id}
                photo={p}
                index={i}
                onOpen={() => {
                  setIndex(i);
                  setSwapKey((k) => k + 1);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {open && current && index !== null && (
        <div
          className="g3d-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div className="flex items-center justify-between gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
            <button
              type="button"
              onClick={close}
              className="flex h-11 min-w-[44px] items-center justify-center px-3 text-sm text-white/90 hover:text-white"
            >
              Close
            </button>
            <p className="text-[11px] tabular-nums text-white/50">
              {index + 1} / {photos.length}
            </p>
            <span className="w-14" />
          </div>

          <div className="g3d-lb-stage">
            <button
              type="button"
              className="g3d-nav-btn g3d-nav-prev"
              onClick={() => go(-1)}
              aria-label="Previous"
            >
              ‹
            </button>

            <div
              key={swapKey}
              className="g3d-lb-frame is-swap"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image_url}
                alt={current.caption || ""}
                draggable={false}
              />
            </div>

            <button
              type="button"
              className="g3d-nav-btn g3d-nav-next"
              onClick={() => go(1)}
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
                Swipe · arrows · Esc
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
