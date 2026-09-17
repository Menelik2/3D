"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  compressImages,
  formatBytes,
  GALLERY_COMPRESS_DEFAULTS,
} from "@/lib/image-compress";
import { LazyImage } from "@/components/ui/LazyImage";
import { fieldClass, labelClass } from "./CmsFormFields";

type Img = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export function GalleryImagesManager({
  galleryId,
  initial,
}: {
  galleryId: string;
  initial: Img[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(initial);
  const [urlsText, setUrlsText] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function registerUrls(urls: string[]) {
    const res = await fetch(`/api/cms/galleries/${galleryId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to save image records");
    if (data.items) {
      setImages((prev) => [...prev, ...data.items]);
    }
    return data.items?.length ?? urls.length;
  }

  async function addFromUrls(e: React.FormEvent) {
    e.preventDefault();
    const urls = urlsText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (urls.length === 0) return;

    setBusy(true);
    setErr(null);
    setMsg(null);
    setProgress(null);
    try {
      const n = await registerUrls(urls);
      setUrlsText("");
      setMsg(`Added ${n} photo(s)`);
      router.refresh();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  async function uploadCompressed(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      setErr("Select image files (JPEG, PNG, WebP).");
      return;
    }
    if (list.length > 30) {
      setErr("You can upload up to 30 photos at a time.");
      return;
    }

    setBusy(true);
    setErr(null);
    setMsg(null);

    try {
      setProgress(`Compressing 0 / ${list.length}…`);
      const compressed = await compressImages(
        list,
        {
          maxEdge: GALLERY_COMPRESS_DEFAULTS.maxEdge,
          quality: GALLERY_COMPRESS_DEFAULTS.quality,
          preferWebp: true,
          maxBytes: GALLERY_COMPRESS_DEFAULTS.maxBytes,
        },
        (done, total, name) => {
          setProgress(
            done >= total
              ? "Uploading…"
              : `Compressing ${done + 1} / ${total}${name ? ` · ${name}` : ""}`
          );
        }
      );

      let originalBytes = 0;
      let savedBytes = 0;
      const form = new FormData();
      for (const c of compressed) {
        originalBytes += c.originalBytes;
        savedBytes += c.compressedBytes;
        form.append(
          "files",
          new File([c.blob], c.fileName, { type: c.mime || "image/jpeg" })
        );
      }

      setProgress("Uploading…");
      const res = await fetch(`/api/cms/galleries/${galleryId}/images/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const items = (data.items ?? []) as Img[];
      if (items.length) {
        setImages((prev) => [...prev, ...items]);
      }

      const ratio =
        originalBytes > 0
          ? Math.round((1 - savedBytes / originalBytes) * 100)
          : 0;
      setMsg(
        `Added ${items.length || compressed.length} photo(s) · ${formatBytes(originalBytes)} → ${formatBytes(savedBytes)}` +
          (ratio > 0 ? ` (${ratio}% smaller)` : "")
      );
      router.refresh();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  /** Hard-delete from database + storage */
  async function removeImages(ids: string[]) {
    if (ids.length === 0) return;
    const label =
      ids.length === 1
        ? "Delete this photo permanently from the gallery and database?"
        : `Delete ${ids.length} photos permanently from the gallery and database?`;
    if (!confirm(label)) return;

    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/cms/galleries/${galleryId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          ids.length === 1 ? { image_id: ids[0] } : { image_ids: ids }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }
      setImages((prev) => prev.filter((i) => !ids.includes(i.id)));
      setSelected((prev) => {
        const next = new Set(prev);
        for (const id of ids) next.delete(id);
        return next;
      });
      setMsg(
        ids.length === 1
          ? "Photo deleted from database"
          : `${data.deleted ?? ids.length} photos deleted from database`
      );
      router.refresh();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 border border-border bg-card/20 p-5">
        <div>
          <p className={labelClass}>Upload & compress</p>
          <p className="text-[11px] text-muted mb-3">
            Images are resized (max {GALLERY_COMPRESS_DEFAULTS.maxEdge}px) and
            compressed in your browser before upload.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/*"
            multiple
            disabled={busy}
            className="block w-full text-sm text-muted file:mr-4 file:border-0 file:bg-accent file:px-4 file:py-2.5 file:text-[10px] file:uppercase file:tracking-widest file:text-white hover:file:bg-accent-hover disabled:opacity-50"
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) void uploadCompressed(files);
            }}
          />
        </div>

        {progress && (
          <p className="text-xs text-accent animate-pulse">{progress}</p>
        )}

        <form onSubmit={addFromUrls} className="space-y-3 border-t border-border pt-4">
          <label className={labelClass}>Or paste image URLs</label>
          <textarea
            rows={3}
            className={fieldClass + " resize-y font-mono text-[13px]"}
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            placeholder={"One URL per line\nhttps://….jpg"}
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !urlsText.trim()}
            className="bg-accent px-5 py-2.5 text-[10px] uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {busy ? "Working…" : "Add from URLs"}
          </button>
        </form>

        {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        {err && <p className="text-xs text-red-400">{err}</p>}
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-muted py-8 text-center border border-dashed border-border">
          No photos yet. Upload files or paste URLs above.
        </p>
      ) : (
        <>
          {selected.size > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs text-muted">{selected.size} selected</p>
              <button
                type="button"
                disabled={busy}
                onClick={() => removeImages([...selected])}
                className="bg-red-600/90 px-4 py-2 text-[10px] uppercase tracking-widest text-white hover:bg-red-600 disabled:opacity-50"
              >
                Delete selected permanently
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setSelected(new Set())}
                className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
              >
                Clear selection
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {images.map((img, i) => {
              const isSel = selected.has(img.id);
              return (
                <div
                  key={img.id}
                  className={`group relative aspect-square overflow-hidden border bg-black/40 ${
                    isSel ? "border-accent ring-1 ring-accent" : "border-border"
                  }`}
                >
                  <LazyImage
                    src={img.image_url}
                    alt={img.caption || ""}
                    priority={i < 4}
                    wrapperClassName="absolute inset-0"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    quality={70}
                  />
                  <label className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center bg-black/70">
                    <input
                      type="checkbox"
                      checked={isSel}
                      disabled={busy}
                      onChange={() => toggleSelect(img.id)}
                      className="h-3.5 w-3.5 accent-accent"
                      aria-label="Select photo"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => removeImages([img.id])}
                    className="absolute right-2 top-2 z-10 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest text-red-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
