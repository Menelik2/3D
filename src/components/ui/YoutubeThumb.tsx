"use client";

import { useMemo, useState } from "react";
import { youtubeThumbnailUrls } from "@/lib/video";

type Props = {
  /** YouTube video id */
  videoId?: string | null;
  /** Optional custom cover (used first if valid) */
  coverUrl?: string | null;
  /** Precomputed YouTube candidates from getVideoEmbed */
  candidates?: string[] | null;
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
};

/**
 * Shows YouTube's official thumbnail with quality fallbacks.
 * maxresdefault → sddefault → hqdefault → mqdefault
 */
export function YoutubeThumb({
  videoId,
  coverUrl,
  candidates,
  alt = "",
  className = "",
  loading = "lazy",
}: Props) {
  const list = useMemo(() => {
    const out: string[] = [];
    const custom = coverUrl?.trim();
    // Only use custom cover if it's not an empty string and not a known-broken placeholder
    if (custom && !custom.includes("undefined") && custom !== "null") {
      out.push(custom);
    }
    if (candidates?.length) {
      for (const c of candidates) if (c && !out.includes(c)) out.push(c);
    } else if (videoId) {
      for (const c of youtubeThumbnailUrls(videoId)) {
        if (!out.includes(c)) out.push(c);
      }
    }
    return out;
  }, [coverUrl, candidates, videoId]);

  const [idx, setIdx] = useState(0);
  const src = list[idx] ?? null;

  if (!src) {
    return <div className={`bg-zinc-900 ${className}`} aria-hidden />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        setIdx((i) => (i + 1 < list.length ? i + 1 : i));
      }}
    />
  );
}
