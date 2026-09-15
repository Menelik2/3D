"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImages, formatBytes } from "@/lib/image-compress";
import { LazyImage } from "@/components/ui/LazyImage";
import { fieldClass, labelClass } from "./CmsFormFields";

type Img = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

const BUCKET = "galleries";

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

  async function registerUrls(urls: string[]) {
    const res = await fetch(`/api/cms/galleries/${galleryId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    });
    const data = await res.json();
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
      setErr("Select image files (JPEG, PNG, WebP, HEIC may not compress).");
      return;
    }

    setBusy(true);
    setErr(null);
    setMsg(null);

    try {
      setProgress(`Compressing 0 / ${list.length}…`);
      const compressed = await compressImages(
        list,
        { maxEdge: 2048, quality: 0.82 },
        (done, total, name) => {
          setProgress(
            done >= total
              ? "Uploading…"
              : `Compressing ${done + 1} / ${total}${name ? ` · ${name}` : ""}`
          );
        }
      );

      const supabase = createClient();
      const publicUrls: string[] = [];
      let savedBytes = 0;
      let originalBytes = 0;

      for (let i = 0; i < compressed.length; i++) {
        const c = compressed[i]!;
        originalBytes += c.originalBytes;
        savedBytes += c.compressedBytes;
        setProgress(`Uploading ${i + 1} / ${compressed.length}…`);

        const path = `${galleryId}/${Date.now()}-${i}-${safeName(c.fileName)}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, c.blob, {
            contentType: c.mime || "image/jpeg",
            upsert: false,
            cacheControl: "31536000",
          });

        if (upErr) {
          throw new Error(
            upErr.message.includes("Bucket not found")
              ? `Storage bucket "${BUCKET}" not found. Create a public bucket named "${BUCKET}" in Supabase → Storage.`
              : upErr.message
          );
        }

        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        if (pub?.publicUrl) publicUrls.push(pub.publicUrl);
      }

      setProgress("Saving…");
      const n = await registerUrls(publicUrls);

      const ratio =
        originalBytes > 0
          ? Math.round((1 - savedBytes / originalBytes) * 100)
          : 0;
      setMsg(
        `Added ${n} photo(s) · ${formatBytes(originalBytes)} → ${formatBytes(savedBytes)}` +
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

  async function removeImage(imageId: string) {
    if (!confirm("Remove this photo from the gallery?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/galleries/${galleryId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_id: imageId }),
      });
      if (res.ok) {
        setImages((prev) => prev.filter((i) => i.id !== imageId));
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 border border-border bg-card/20 p-5">
        <div>
          <p className={labelClass}>Upload & compress</p>
          <p className="text-[11px] text-muted mb-3">
            Images are resized (max 2048px) and compressed to WebP/JPEG in your browser
            before upload — faster delivery for clients.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/*"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden border border-border bg-black/40"
            >
              <LazyImage
                src={img.image_url}
                alt={img.caption || ""}
                priority={i < 4}
                wrapperClassName="absolute inset-0"
                sizes="(max-width: 640px) 50vw, 25vw"
                quality={70}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => removeImage(img.id)}
                className="absolute right-2 top-2 z-10 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest text-red-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
