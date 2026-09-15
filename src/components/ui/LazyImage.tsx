"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
  /** Kept for API compat; not used by native path */
  sizes?: string;
  objectFit?: "cover" | "contain";
  quality?: number;
};

/**
 * Gallery images use native <img>.
 * next/image optimizer was leaving blank tiles for remote Storage URLs
 * while plain img (fullscreen) loaded fine.
 */
export function LazyImage({
  src,
  alt = "",
  priority = false,
  className = "",
  wrapperClassName = "",
  objectFit = "cover",
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  if (!src) {
    return (
      <span
        className={`relative block overflow-hidden bg-zinc-900 ${wrapperClassName}`}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={`lazy-img-wrap relative block h-full w-full overflow-hidden bg-zinc-900 ${wrapperClassName}`}
    >
      {!loaded && !failed && (
        <span
          className="absolute inset-0 z-0 animate-pulse bg-white/[0.06]"
          aria-hidden
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 z-[1] h-full w-full ${fitClass} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-100"} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
      />
    </span>
  );
}

export function prefetchImages(urls: (string | null | undefined)[]) {
  if (typeof window === "undefined") return;
  for (const url of urls) {
    if (!url) continue;
    const img = new window.Image();
    img.decoding = "async";
    img.src = url;
  }
}
