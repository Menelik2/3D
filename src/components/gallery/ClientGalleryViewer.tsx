"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { prefetchImages } from "@/components/ui/LazyImage";
import { ClientGalleryUpload } from "@/components/gallery/ClientGalleryUpload";
import "@/app/gallery-3d.css";

export type GalleryPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_MS = 280;
const DOUBLE_TAP_ZOOM = 2.5;

function dist(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number }
) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}

function mid(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number }
) {
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function ZoomablePhoto({
  src,
  alt,
  onZoomChange,
}: {
  src: string;
  alt: string;
  onZoomChange?: (zoomed: boolean) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  const [transform, setTransform] = useState({ s: 1, x: 0, y: 0 });

  const modeRef = useRef<"none" | "pinch" | "pan">("none");
  const startDistRef = useRef(0);
  const startScaleRef = useRef(1);
  const startTxRef = useRef(0);
  const startTyRef = useRef(0);
  const startMidRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const lastTapRef = useRef(0);
  const lastTapPosRef = useRef({ x: 0, y: 0 });

  const apply = useCallback(
    (s: number, x: number, y: number) => {
      scaleRef.current = s;
      txRef.current = x;
      tyRef.current = y;
      setTransform({ s, x, y });
      onZoomChange?.(s > 1.02);
    },
    [onZoomChange]
  );

  const reset = useCallback(() => {
    apply(1, 0, 0);
  }, [apply]);

  useEffect(() => {
    reset();
  }, [src, reset]);

  function onTouchStart(e: ReactTouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault();
      modeRef.current = "pinch";
      const t0 = e.touches[0]!;
      const t1 = e.touches[1]!;
      startDistRef.current = dist(t0, t1) || 1;
      startScaleRef.current = scaleRef.current;
      startTxRef.current = txRef.current;
      startTyRef.current = tyRef.current;
      startMidRef.current = mid(t0, t1);
      return;
    }

    if (e.touches.length === 1) {
      const t = e.touches[0]!;
      const now = Date.now();
      const dt = now - lastTapRef.current;
      const dx = t.clientX - lastTapPosRef.current.x;
      const dy = t.clientY - lastTapPosRef.current.y;
      const near = Math.hypot(dx, dy) < 36;

      if (dt < DOUBLE_TAP_MS && near) {
        e.preventDefault();
        lastTapRef.current = 0;
        if (scaleRef.current > 1.15) {
          apply(1, 0, 0);
        } else {
          const rect = wrapRef.current?.getBoundingClientRect();
          if (rect) {
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const target = DOUBLE_TAP_ZOOM;
            const nx = (cx - t.clientX) * (target - 1);
            const ny = (cy - t.clientY) * (target - 1);
            apply(target, nx, ny);
          } else {
            apply(DOUBLE_TAP_ZOOM, 0, 0);
          }
        }
        modeRef.current = "none";
        return;
      }

      lastTapRef.current = now;
      lastTapPosRef.current = { x: t.clientX, y: t.clientY };

      if (scaleRef.current > 1.02) {
        modeRef.current = "pan";
        panStartRef.current = { x: t.clientX, y: t.clientY };
        startTxRef.current = txRef.current;
        startTyRef.current = tyRef.current;
      } else {
        modeRef.current = "none";
      }
    }
  }

  function onTouchMove(e: ReactTouchEvent) {
    if (modeRef.current === "pinch" && e.touches.length === 2) {
      e.preventDefault();
      const t0 = e.touches[0]!;
      const t1 = e.touches[1]!;
      const d = dist(t0, t1) || 1;
      const next = clamp(
        startScaleRef.current * (d / startDistRef.current),
        MIN_SCALE,
        MAX_SCALE
      );
      const m = mid(t0, t1);
      const dx = m.x - startMidRef.current.x;
      const dy = m.y - startMidRef.current.y;
      apply(next, startTxRef.current + dx, startTyRef.current + dy);
      return;
    }

    if (modeRef.current === "pan" && e.touches.length === 1) {
      e.preventDefault();
      const t = e.touches[0]!;
      const dx = t.clientX - panStartRef.current.x;
      const dy = t.clientY - panStartRef.current.y;
      apply(scaleRef.current, startTxRef.current + dx, startTyRef.current + dy);
    }
  }

  function onTouchEnd(e: ReactTouchEvent) {
    if (e.touches.length === 0) {
      modeRef.current = "none";
      if (scaleRef.current < 1.05) {
        apply(1, 0, 0);
      }
    } else if (e.touches.length === 1 && modeRef.current === "pinch") {
      modeRef.current = "pan";
      const t = e.touches[0]!;
      panStartRef.current = { x: t.clientX, y: t.clientY };
      startTxRef.current = txRef.current;
      startTyRef.current = tyRef.current;
    }
  }

  return (
    <div
      ref={wrapRef}
      className="g3d-zoom-wrap"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        fetchPriority="high"
        className="g3d-zoom-img"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.s})`,
        }}
      />
    </div>
  );
}

/** Side bias for 3D column tilt: left / center / right of a 3-col rhythm */
function sideClass(index: number): string {
  const col = index % 3;
  if (col === 0) return "g3d-side-left";
  if (col === 2) return "g3d-side-right";
  return "g3d-side-center";
}

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
    // Stronger side rotation (Y) for cinematic 3D
    const ry = (x - 0.5) * 22;
    const rx = (0.5 - y) * 14;

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--lift", "22px");
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
      className={`g3d-card ${sideClass(index)}`}
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
      <span className="g3d-card-edge" aria-hidden />
    </button>
  );
}

export function ClientGalleryViewer({
  title,
  clientName,
  photos: initialPhotos,
  token,
  allowUpload = false,
}: {
  title: string;
  clientName?: string | null;
  photos: GalleryPhoto[];
  token?: string;
  allowUpload?: boolean;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [index, setIndex] = useState<number | null>(null);
  const [swapDir, setSwapDir] = useState<"next" | "prev" | "open">("open");
  const [swapKey, setSwapKey] = useState(0);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const zoomedRef = useRef(false);

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  const open = index !== null;
  const current = index !== null ? photos[index] : null;

  const bumpChrome = useCallback(() => {
    setChromeHidden(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChromeHidden(true), 3200);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    setChromeHidden(false);
    setZoomed(false);
    zoomedRef.current = false;
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
      setZoomed(false);
      zoomedRef.current = false;
      bumpChrome();
    },
    [photos.length, bumpChrome]
  );

  const openAt = useCallback(
    (i: number) => {
      setSwapDir("open");
      setIndex(i);
      setSwapKey((k) => k + 1);
      setZoomed(false);
      zoomedRef.current = false;
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
    let tracking = false;

    function onStart(e: TouchEvent) {
      if (zoomedRef.current || e.touches.length !== 1) return;
      startX = e.touches[0]?.clientX ?? 0;
      startY = e.touches[0]?.clientY ?? 0;
      tracking = true;
      bumpChrome();
    }
    function onEnd(e: TouchEvent) {
      if (!tracking || zoomedRef.current) {
        tracking = false;
        return;
      }
      tracking = false;
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
        <div className="g3d-header-inner">
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
          <p className="shrink-0 text-[11px] uppercase tracking-widest tabular-nums text-white/40">
            {photos.length} {photos.length === 1 ? "photo" : "photos"}
          </p>
        </div>
      </header>

      <main className="g3d-stage">
        {allowUpload && token ? (
          <div className="mb-5">
            <ClientGalleryUpload
              token={token}
              onAdded={(items) => {
                setPhotos((prev) => [
                  ...prev,
                  ...items.map((i) => ({
                    id: i.id,
                    image_url: i.image_url,
                    caption: i.caption,
                  })),
                ]);
              }}
            />
          </div>
        ) : null}

        {photos.length === 0 ? (
          <p className="py-16 text-center text-sm text-white/40">
            {allowUpload
              ? "No photos yet — tap Add photos to upload."
              : "No photos in this gallery yet."}
          </p>
        ) : (
          <div className="g3d-grid g3d-grid-3d">
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
          className={`g3d-lightbox${chromeHidden ? " is-chrome-hidden" : ""}${zoomed ? " is-zoomed" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo"
          onClick={() => {
            if (zoomed) return;
            if (chromeHidden) bumpChrome();
            else setChromeHidden(true);
          }}
        >
          <button
            type="button"
            className="g3d-back-btn"
            aria-label="Back to gallery"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              close();
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <div
            className="g3d-lb-chrome g3d-lb-chrome-top"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="w-[6.5rem]" aria-hidden />
            <p className="g3d-lb-counter">
              {index + 1} / {photos.length}
            </p>
            <span className="w-[6.5rem]" aria-hidden />
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
              <ZoomablePhoto
                src={current.image_url}
                alt={current.caption || ""}
                onZoomChange={(z) => {
                  zoomedRef.current = z;
                  setZoomed(z);
                }}
              />
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
              <p className="g3d-zoom-hint">
                Pinch to zoom · double-tap · swipe
              </p>
            )}

            {photos.length > 1 && (
              <div ref={filmRef} className="g3d-filmstrip g3d-filmstrip-3d">
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
                      setZoomed(false);
                      zoomedRef.current = false;
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
