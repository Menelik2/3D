"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export type WishFormInitial = {
  id?: string;
  gallery_id: string;
  author_name: string;
  message: string;
};

export type GalleryOption = {
  id: string;
  title: string;
  client_name: string | null;
};

export function WishForm({
  initial,
  galleries,
}: {
  initial?: WishFormInitial | null;
  galleries: GalleryOption[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [galleryId, setGalleryId] = useState(initial?.gallery_id ?? "");
  const [name, setName] = useState(initial?.author_name ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [errors, setErrors] = useState<{
    gallery?: string;
    name?: string;
    message?: string;
  }>({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate() {
    const next: typeof errors = {};
    if (!galleryId) next.gallery = "Select a gallery.";
    if (!name.trim()) next.name = "Name is required.";
    if (!message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setBusy(true);
    try {
      const url = isEdit
        ? `/api/cms/wishes/${initial!.id}`
        : "/api/cms/wishes";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gallery_id: galleryId,
          author_name: name.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(
          typeof data.error === "string" ? data.error : "Save failed."
        );
        setBusy(false);
        return;
      }
      if (isEdit) {
        router.refresh();
        setBusy(false);
      } else {
        const id = data.item?.id;
        if (id) router.push(`/admin/wishes/${id}`);
        else router.push("/admin/wishes");
        router.refresh();
      }
    } catch {
      setFormError("Network error.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl" noValidate>
      <div>
        <label
          htmlFor="wish-gallery"
          className="block text-[10px] uppercase tracking-widest text-muted mb-2"
        >
          Gallery <span className="text-accent">*</span>
        </label>
        <select
          id="wish-gallery"
          value={galleryId}
          onChange={(e) => {
            setGalleryId(e.target.value);
            if (errors.gallery) setErrors((x) => ({ ...x, gallery: undefined }));
          }}
          className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="">Select gallery…</option>
          {galleries.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
              {g.client_name ? ` (${g.client_name})` : ""}
            </option>
          ))}
        </select>
        {errors.gallery ? (
          <p className="mt-1 text-xs text-red-400">{errors.gallery}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="wish-name"
          className="block text-[10px] uppercase tracking-widest text-muted mb-2"
        >
          Name <span className="text-accent">*</span>
        </label>
        <input
          id="wish-name"
          type="text"
          maxLength={80}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((x) => ({ ...x, name: undefined }));
          }}
          className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="Guest name"
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-red-400">{errors.name}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="wish-message"
          className="block text-[10px] uppercase tracking-widest text-muted mb-2"
        >
          Message / wish <span className="text-accent">*</span>
        </label>
        <textarea
          id="wish-message"
          rows={5}
          maxLength={800}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message)
              setErrors((x) => ({ ...x, message: undefined }));
          }}
          className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent resize-y"
          placeholder="Best wishes message…"
        />
        <p className="mt-1 text-right text-[10px] text-muted">
          {message.trim().length}/800
        </p>
        {errors.message ? (
          <p className="mt-1 text-xs text-red-400">{errors.message}</p>
        ) : null}
      </div>

      {formError ? (
        <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-accent px-5 py-2.5 text-[10px] uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {busy ? "Saving…" : isEdit ? "Save changes" : "Create wish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/wishes")}
          className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
