"use client";

import { useMemo, useState } from "react";
import Image, { type ImageProps } from "next/image";

type Props = {
  src: string;
  alt?: string;
  /** Above-the-fold: skip lazy, high fetch priority */
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
  /** Responsive sizes hint for next/image (default gallery tile) */
  sizes?: string;
  /** Object-fit style via class; default cover for fill layout */
  objectFit?: "cover" | "contain";
  quality?: number;
  onLoad?: ImageProps["onLoad"];
  onError?: ImageProps["onError"];
};

/** Hosts we optimize through the Next.js image pipeline. */
function canOptimize(src: string): boolean {
  if (!src) return false;
  // Local / public assets
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const u = new URL(src);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname;
    return (
      h.endsWith(".supabase.co") ||
      h === "images.unsplash.com" ||
      h.endsWith(".cloudinary.com") ||
      h === "localhost" ||
      h === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

/**
 * Lazy-loading image via next/image.
 * Uses fill layout; parent must be position:relative with size.
 * Non-allowlisted remote URLs fall back to unoptimized (still lazy).
 */
export function LazyImage({
  src,
  alt = "",
  priority = false,
  className = "",
  wrapperClassName = "",
  sizes = "(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw",
  objectFit = "cover",
  quality = 80,
  onLoad,
  onError,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const optimize = useMemo(() => canOptimize(src), [src]);

  if (!src) {
    return (
      <span
        className={`relative block overflow-hidden bg-white/[0.04] ${wrapperClassName}`}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={`lazy-img-wrap relative block overflow-hidden ${wrapperClassName}`}
      data-loaded={loaded ? "true" : "false"}
    >
      {!loaded && !failed && (
        <span
          className="absolute inset-0 animate-pulse bg-white/[0.06]"
          aria-hidden
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        unoptimized={!optimize}
        className={`transition-opacity duration-500 ease-out ${loaded ? "opacity-100" : "opacity-0"} ${objectFit === "contain" ? "object-contain" : "object-cover"} ${className}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setFailed(true);
          setLoaded(true);
          onError?.(e);
        }}
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
