"use client";

import { useRef, useState } from "react";
import {
  compressImages,
  formatBytes,
  GALLERY_COMPRESS_DEFAULTS,
} from "@/lib/image-compress";

type AddedPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
};

export function ClientGalleryUpload({
  token,
  onAdded,
}: {
  token: string;
  onAdded: (photos: AddedPhoto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | File[]) {
    const list = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      setErr("Please choose image files (JPEG, PNG, WebP).");
      return;
    }
    if (list.length > 20) {
      setErr("You can upload up to 20 photos at a time.");
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

      const form = new FormData();
      let original = 0;
      let saved = 0;
      for (const c of compressed) {
        original += c.originalBytes;
        saved += c.compressedBytes;
        form.append(
          "files",
          new File([c.blob], c.fileName, { type: c.mime || "image/jpeg" })
        );
      }

      setProgress("Uploading…");
      const res = await fetch(`/api/g/${encodeURIComponent(token)}/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const items = (data.items ?? []) as AddedPhoto[];
      onAdded(items);

      const ratio =
        original > 0 ? Math.round((1 - saved / original) * 100) : 0;
      setMsg(
        `Added ${items.length || compressed.length} photo(s)` +
          (ratio > 0
            ? ` · ${formatBytes(original)} → ${formatBytes(saved)} (${ratio}% smaller)`
            : "")
      );
      setOpen(false);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="g3d-upload">
      <button
        type="button"
        className="g3d-upload-toggle"
        onClick={() => {
          setOpen((v) => !v);
          setErr(null);
          setMsg(null);
        }}
        disabled={busy}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        {open ? "Close" : "Add photos"}
      </button>

      {open && (
        <div className="g3d-upload-panel">
          <p className="g3d-upload-hint">
            Choose photos from your phone or computer. Images are optimized
            (max ~1920px, WebP) before upload and only visible on this private
            link.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/*"
            multiple
            disabled={busy}
            className="g3d-upload-input"
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) void handleFiles(files);
            }}
          />
          {progress && <p className="g3d-upload-progress">{progress}</p>}
          {msg && <p className="g3d-upload-ok">{msg}</p>}
          {err && <p className="g3d-upload-err">{err}</p>}
        </div>
      )}

      {!open && msg && (
        <p className="g3d-upload-ok" style={{ marginTop: 8 }}>
          {msg}
        </p>
      )}
    </div>
  );
}
