"use client";

import {
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
} from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> & {
  /** Force immediate load (above-the-fold). Default: lazy via IO + native. */
  priority?: boolean;
  /** Root margin for IntersectionObserver (default 200px). */
  rootMargin?: string;
  /** Extra class on the wrapper (skeleton box). */
  wrapperClassName?: string;
};

/**
 * Lazy-loads images when near the viewport.
 * Shows a subtle skeleton until decoded, then fades in.
 */
export function LazyImage({
  src,
  alt = "",
  priority = false,
  rootMargin = "200px 0px",
  className = "",
  wrapperClassName = "",
  onLoad,
  onError,
  ...rest
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (priority || inView) return;
    const el = imgRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [priority, inView, rootMargin]);

  // Reset when src changes
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <span
      className={`lazy-img-wrap relative block overflow-hidden ${wrapperClassName}`}
      data-loaded={loaded ? "true" : "false"}
    >
      {!loaded && !failed && (
        <span
          className="lazy-img-skeleton absolute inset-0 animate-pulse bg-white/[0.06]"
          aria-hidden
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={inView && src ? src : undefined}
        data-src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`lazy-img transition-opacity duration-500 ease-out ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setFailed(true);
          setLoaded(true);
          onError?.(e);
        }}
        {...rest}
      />
    </span>
  );
}

/** Prefetch full-resolution images for smoother lightbox navigation. */
export function prefetchImages(urls: (string | null | undefined)[]) {
  if (typeof window === "undefined") return;
  for (const url of urls) {
    if (!url) continue;
    const img = new window.Image();
    img.decoding = "async";
    img.src = url;
  }
}
