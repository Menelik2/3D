/**
 * Normalize YouTube / Vimeo / direct media URLs for playback.
 */

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const raw = url.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const u = new URL(raw);
    let host = u.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    if (host.startsWith("m.")) host = host.slice(2);
    if (host.startsWith("music.")) host = host.slice(6);

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0]?.split("?")[0];
      return id && /^[a-zA-Z0-9_-]{6,}$/.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "youtube-nocookie.com" ||
      host.endsWith(".youtube.com")
    ) {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.split("/")[2];
        return id || null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2] || null;
      }
      if (u.pathname.startsWith("/live/")) {
        return u.pathname.split("/")[2] || null;
      }
      if (u.pathname.startsWith("/v/")) {
        return u.pathname.split("/")[2] || null;
      }
      const v = u.searchParams.get("v");
      if (v) return v;
    }
  } catch {
    /* fall through */
  }

  const m = raw.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  return m?.[1] ?? null;
}

export function extractVimeoId(url: string): string | null {
  if (!url) return null;
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
  | { kind: "youtube"; embedUrl: string; watchUrl: string; posterUrl: string; id: string }
  | { kind: "vimeo"; embedUrl: string; watchUrl: string; posterUrl: null; id: string }
  | { kind: "file"; embedUrl: string; watchUrl: string; posterUrl: null }
  | { kind: "unknown"; embedUrl: string; watchUrl: string; posterUrl: null };

/** Convert any common video URL into something safe for <iframe> or <video>. */
export function getVideoEmbed(raw: string | null | undefined): EmbedInfo | null {
  if (!raw) return null;
  const url = raw.trim();
  if (!url) return null;

  const yt = extractYoutubeId(url);
  if (yt) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      controls: "1",
      fs: "1",
    });
    return {
      kind: "youtube",
      id: yt,
      embedUrl: `https://www.youtube.com/embed/${yt}?${params.toString()}`,
      watchUrl: `https://www.youtube.com/watch?v=${yt}`,
      posterUrl: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
    };
  }

  const vimeo = extractVimeoId(url);
  if (vimeo) {
    return {
      kind: "vimeo",
      id: vimeo,
      embedUrl: `https://player.vimeo.com/video/${vimeo}?title=0&byline=0&portrait=0`,
      watchUrl: `https://vimeo.com/${vimeo}`,
      posterUrl: null,
    };
  }

  if (/youtube\.com\/embed\//i.test(url) || /player\.vimeo\.com\/video\//i.test(url)) {
    return { kind: "unknown", embedUrl: url, watchUrl: url, posterUrl: null };
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return { kind: "file", embedUrl: url, watchUrl: url, posterUrl: null };
  }

  return { kind: "unknown", embedUrl: url, watchUrl: url, posterUrl: null };
}
