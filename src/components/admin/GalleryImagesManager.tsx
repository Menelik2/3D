"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [images, setImages] = useState(initial);
  const [urlsText, setUrlsText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function addImages(e: React.FormEvent) {
    e.preventDefault();
    const urls = urlsText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (urls.length === 0) return;

    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/cms/galleries/${galleryId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Failed to add images");
        setBusy(false);
        return;
      }
      setUrlsText("");
      setMsg(`Added ${data.items?.length ?? urls.length} photo(s)`);
      router.refresh();
      if (data.items) {
        setImages((prev) => [...prev, ...data.items]);
      }
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
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
      <form onSubmit={addImages} className="space-y-3 border border-border bg-card/20 p-5">
        <label className={labelClass}>Add photos (image URLs)</label>
        <textarea
          rows={4}
          className={fieldClass + " resize-y font-mono text-[13px]"}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder={
            "Paste one URL per line\nhttps://….jpg\nhttps://….webp"
          }
        />
        <p className="text-[11px] text-muted">
          Upload files to Supabase Storage bucket <code className="text-foreground/80">galleries</code>{" "}
          (public), then paste the public URLs here.
        </p>
        <button
          type="submit"
          disabled={busy || !urlsText.trim()}
          className="bg-accent px-5 py-2.5 text-[10px] uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add photos"}
        </button>
        {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        {err && <p className="text-xs text-red-400">{err}</p>}
      </form>

      {images.length === 0 ? (
        <p className="text-sm text-muted py-8 text-center border border-dashed border-border">
          No photos yet. Add image URLs above.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden border border-border bg-black/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={img.caption || ""}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => removeImage(img.id)}
                className="absolute right-2 top-2 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest text-red-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
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
