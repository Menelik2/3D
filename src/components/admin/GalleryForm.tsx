"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

type Initial = {
  id?: string;
  title?: string;
  client_name?: string | null;
  client_email?: string | null;
  cover_image_url?: string | null;
  notes?: string | null;
  is_published?: boolean;
  allow_client_upload?: boolean;
};

export function GalleryForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    client_name: initial?.client_name ?? "",
    client_email: initial?.client_email ?? "",
    cover_image_url: initial?.cover_image_url ?? "",
    notes: initial?.notes ?? "",
    is_published: initial?.is_published ?? true,
    allow_client_upload: initial?.allow_client_upload ?? true,
  });

  const set = (k: string, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = isEdit
        ? `/api/cms/galleries/${initial!.id}`
        : "/api/cms/galleries";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        setSaving(false);
        return;
      }
      const id = isEdit ? initial!.id : data.item?.id;
      router.push(id ? `/admin/galleries/${id}` : "/admin/galleries");
      router.refresh();
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      {error && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Gallery title *</label>
        <input
          required
          className={fieldClass}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Sara & Dawit — Wedding"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Client name</label>
          <input
            className={fieldClass}
            value={form.client_name}
            onChange={(e) => set("client_name", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Client email</label>
          <input
            type="email"
            className={fieldClass}
            value={form.client_email}
            onChange={(e) => set("client_email", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Cover image URL</label>
        <input
          className={fieldClass}
          value={form.cover_image_url}
          onChange={(e) => set("cover_image_url", e.target.value)}
          placeholder="https://… (optional — first photo can be cover)"
        />
      </div>

      <div>
        <label className={labelClass}>Internal notes</label>
        <textarea
          rows={2}
          className={fieldClass + " resize-y"}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => set("is_published", e.target.checked)}
        />
        Published (client can open the link)
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.allow_client_upload}
          onChange={(e) => set("allow_client_upload", e.target.checked)}
        />
        Allow client to upload photos on the private link
      </label>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Update gallery" : "Create gallery"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/galleries")}
          className="border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
