"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
  sizes?: string;
  objectFit?: "cover" | "contain";
  quality?: number;
};

/** Hosts allowed through the Next.js image optimizer (+ CDN cache). */
function canOptimize(src: string): boolean {
  if (!src) return false;
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
 * Lazy image via next/image when the host is allowlisted (cached by
 * /_next/image + minimumCacheTTL). Unknown hosts use a native <img>
 * so pasting arbitrary URLs still works.
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
}: Props) {
  const [useNative, setUseNative] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const optimize = useMemo(
    () => canOptimize(src) && !useNative,
    [src, useNative]
  );
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  if (!src) {
    return (
      <span
        className={`relative block overflow-hidden bg-zinc-900 ${wrapperClassName}`}
        aria-hidden
      />
    );
  }

  // Unknown host → native img (browser HTTP cache only)
  if (!optimize) {
    return (
      <span
        className={`lazy-img-wrap relative block overflow-hidden bg-zinc-900 ${wrapperClassName}`}
      >
        {!loaded && (
          <span
            className="absolute inset-0 animate-pulse bg-white/[0.05]"
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
          className={`absolute inset-0 h-full w-full ${fitClass} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-90"} ${className}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </span>
    );
  }

  // Allowlisted host → next/image optimizer (AVIF/WebP + edge cache)
  return (
    <span
      className={`lazy-img-wrap relative block overflow-hidden bg-zinc-900 ${wrapperClassName}`}
    >
      {!loaded && (
        <span
          className="absolute inset-0 animate-pulse bg-white/[0.05]"
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
        // Optimized path — enables /_next/image caching
        unoptimized={false}
        className={`${fitClass} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-90"} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setUseNative(true);
          setLoaded(false);
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
