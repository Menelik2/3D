/**
 * Normalize YouTube / Vimeo / direct media URLs for playback.
 */

export function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2] || null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2] || null;
      }
      if (u.pathname.startsWith("/live/")) {
        return u.pathname.split("/")[2] || null;
      }
      const v = u.searchParams.get("v");
      if (v) return v;
    }
  } catch {
    /* fall through */
  }

  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  return m?.[1] ?? null;
}

export function extractVimeoId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts.find((p) => /^\d+$/.test(p));
      return id || null;
    }
  } catch {
    /* fall through */
  }
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}

export type EmbedInfo =
  | { kind: "youtube"; embedUrl: string; posterUrl: string; id: string }
  | { kind: "vimeo"; embedUrl: string; posterUrl: null; id: string }
  | { kind: "file"; embedUrl: string; posterUrl: null }
  | { kind: "unknown"; embedUrl: string; posterUrl: null };

/** Convert any common video URL into something safe for <iframe> or <video>. */
export function getVideoEmbed(raw: string | null | undefined): EmbedInfo | null {
  if (!raw) return null;
  const url = raw.trim();
  if (!url) return null;

  const yt = extractYoutubeId(url);
  if (yt) {
    return {
      kind: "youtube",
      id: yt,
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1&playsinline=1`,
      posterUrl: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
    };
  }

  const vimeo = extractVimeoId(url);
  if (vimeo) {
    return {
      kind: "vimeo",
      id: vimeo,
      embedUrl: `https://player.vimeo.com/video/${vimeo}?title=0&byline=0&portrait=0`,
      posterUrl: null,
    };
  }

  if (/youtube\.com\/embed\//i.test(url) || /player\.vimeo\.com\/video\//i.test(url)) {
    return { kind: "unknown", embedUrl: url, posterUrl: null };
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return { kind: "file", embedUrl: url, posterUrl: null };
  }

  return { kind: "unknown", embedUrl: url, posterUrl: null };
}
