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

function isRemote(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function canOptimize(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const h = new URL(src).hostname;
    return (
      h.endsWith(".supabase.co") ||
      h === "images.unsplash.com" ||
      h.endsWith(".cloudinary.com")
    );
  } catch {
    return false;
  }
}

/**
 * Gallery-safe image: next/image when possible, native <img> fallback.
 * Never stays invisible if the file loads.
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
  const optimize = useMemo(() => canOptimize(src) && !useNative, [src, useNative]);
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  if (!src) {
    return (
      <span
        className={`relative block overflow-hidden bg-zinc-900 ${wrapperClassName}`}
        aria-hidden
      />
    );
  }

  // Native path — most reliable for arbitrary storage URLs
  if (useNative || !optimize) {
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
        // Remote gallery hosts: skip optimizer if anything fails — still use Image API
        unoptimized={isRemote(src)}
        className={`${fitClass} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-90"} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          // Fall back to plain <img> on next render
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
