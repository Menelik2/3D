"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { prefetchImages } from "@/components/ui/LazyImage";
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
  const priority = index < 12;

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (e.pointerType === "touch") return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const ry = (x - 0.5) * 14;
    const rx = (0.5 - y) * 12;

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--lift", "20px");
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
      style={{ animationDelay: `${Math.min(index, 20) * 40}ms` }}
      onClick={onOpen}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-label={photo.caption || `Photo ${index + 1}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.image_url}
        alt={photo.caption || ""}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="g3d-card-media absolute inset-0 h-full w-full object-cover"
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
  const [swapDir, setSwapDir] = useState<"next" | "prev" | "open">("open");
  const [swapKey, setSwapKey] = useState(0);
  const [chromeHidden, setChromeHidden] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filmRef = useRef<HTMLDivElement>(null);

  const open = index !== null;
  const current = index !== null ? photos[index] : null;

  const bumpChrome = useCallback(() => {
    setChromeHidden(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChromeHidden(true), 2800);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    setChromeHidden(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setSwapDir(dir > 0 ? "next" : "prev");
      setIndex((i) => {
        if (i === null || photos.length === 0) return i;
        return (i + dir + photos.length) % photos.length;
      });
      setSwapKey((k) => k + 1);
      bumpChrome();
    },
    [photos.length, bumpChrome]
  );

  const openAt = useCallback(
    (i: number) => {
      setSwapDir("open");
      setIndex(i);
      setSwapKey((k) => k + 1);
      bumpChrome();
    },
    [bumpChrome]
  );

  useEffect(() => {
    if (index === null || photos.length === 0) return;
    const n = photos.length;
    prefetchImages([
      photos[index]?.image_url,
      photos[(index + 1) % n]?.image_url,
      photos[(index - 1 + n) % n]?.image_url,
    ]);
  }, [index, photos]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      bumpChrome();
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, go, bumpChrome]);

  useEffect(() => {
    if (!open) return;
    let startX = 0;
    let startY = 0;
    function onStart(e: TouchEvent) {
      startX = e.touches[0]?.clientX ?? 0;
      startY = e.touches[0]?.clientY ?? 0;
      bumpChrome();
    }
    function onEnd(e: TouchEvent) {
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dx = endX - startX;
      const dy = endY - startY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
        go(dx > 0 ? -1 : 1);
      }
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [open, go, bumpChrome]);

  useEffect(() => {
    if (!open || index === null || !filmRef.current) return;
    const thumb = filmRef.current.querySelector(
      `[data-thumb="${index}"]`
    ) as HTMLElement | null;
    thumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [open, index]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const swapClass =
    swapDir === "next"
      ? "is-swap-next"
      : swapDir === "prev"
        ? "is-swap-prev"
        : "";

  return (
    <div className="g3d-root">
      <div className="g3d-atmosphere" aria-hidden>
        <div className="g3d-frame g3d-frame-a" />
        <div className="g3d-frame g3d-frame-b" />
        <div className="g3d-frame g3d-frame-c" />
      </div>

      <header className="g3d-header">
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

      <main className="g3d-stage relative z-10 mx-auto max-w-6xl px-2.5 py-4 sm:px-5 sm:py-8">
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
                onOpen={() => openAt(i)}
              />
            ))}
          </div>
        )}
      </main>

      {open && current && index !== null && (
        <div
          className={`g3d-lightbox${chromeHidden ? " is-chrome-hidden" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo"
          onClick={() => {
            if (chromeHidden) bumpChrome();
            else setChromeHidden(true);
          }}
        >
          {/* Always-visible Back — returns to gallery grid */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="g3d-back-btn"
            aria-label="Back to gallery"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Back</span>
          </button>

          <div
            className="g3d-lb-chrome g3d-lb-chrome-top"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="w-[5.5rem]" aria-hidden />
            <p className="text-[11px] tabular-nums text-white/55">
              {index + 1} / {photos.length}
            </p>
            <span className="w-[5.5rem]" aria-hidden />
          </div>

          <div className="g3d-lb-stage">
            <button
              type="button"
              className="g3d-nav-btn g3d-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous"
            >
              ‹
            </button>

            <div key={swapKey} className={`g3d-lb-frame ${swapClass}`}>
              <div className="relative h-[100dvh] w-[100vw]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.image_url}
                  alt={current.caption || ""}
                  className="absolute inset-0 h-full w-full object-contain"
                  draggable={false}
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>

            <button
              type="button"
              className="g3d-nav-btn g3d-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next"
            >
              ›
            </button>
          </div>

          <div
            className="g3d-lb-chrome g3d-lb-chrome-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {current.caption ? (
              <p className="text-center text-sm text-white/75 px-2">
                {current.caption}
              </p>
            ) : (
              <p className="text-center text-[10px] uppercase tracking-widest text-white/35">
                Back · swipe · arrows · Esc
              </p>
            )}

            {photos.length > 1 && (
              <div ref={filmRef} className="g3d-filmstrip">
                {photos.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    data-thumb={i}
                    className={`g3d-thumb relative${i === index ? " is-active" : ""}`}
                    onClick={() => {
                      if (i === index) return;
                      setSwapDir(i > index ? "next" : "prev");
                      setIndex(i);
                      setSwapKey((k) => k + 1);
                      bumpChrome();
                    }}
                    aria-label={`Go to photo ${i + 1}`}
                    aria-current={i === index}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image_url}
                      alt=""
                      loading={Math.abs(i - index) <= 5 ? "eager" : "lazy"}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
