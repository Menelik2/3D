"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

const CATEGORIES = [
  "Music Video",
  "Commercial",
  "Wedding",
  "Documentary",
  "Event",
  "Corporate",
  "Photography",
  "Other",
];

type Initial = {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  client_name?: string;
  year?: number | null;
  cover_image_url?: string;
  video_url?: string;
  is_published?: boolean;
  is_featured?: boolean;
  sort_order?: number;
};

export function PortfolioForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? "Music Video",
    description: initial?.description ?? "",
    client_name: initial?.client_name ?? "",
    year: initial?.year?.toString() ?? "",
    cover_image_url: initial?.cover_image_url ?? "",
    video_url: initial?.video_url ?? "",
    is_published: initial?.is_published ?? false,
    is_featured: initial?.is_featured ?? false,
    sort_order: initial?.sort_order?.toString() ?? "0",
  });

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : null,
        sort_order: Number(form.sort_order) || 0,
      };
      const url = isEdit ? `/api/cms/portfolio/${initial!.id}` : "/api/cms/portfolio";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        setSaving(false);
        return;
      }
      router.push("/admin/portfolio");
      router.refresh();
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      {error && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      )}
      <div>
        <label className={labelClass}>Title *</label>
        <input required className={fieldClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Slug</label>
          <input className={fieldClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select className={fieldClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={4} className={fieldClass + " resize-y"} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Client</label>
          <input className={fieldClass} value={form.client_name} onChange={(e) => set("client_name", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input type="number" className={fieldClass} value={form.year} onChange={(e) => set("year", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Cover image URL</label>
        <input className={fieldClass} value={form.cover_image_url} onChange={(e) => set("cover_image_url", e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <label className={labelClass}>Video URL</label>
        <input className={fieldClass} value={form.video_url} onChange={(e) => set("video_url", e.target.value)} placeholder="YouTube / Vimeo / MP4" />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
          Featured
        </label>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Sort</label>
          <input type="number" className={fieldClass + " w-20"} value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50">
          {saving ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
        <button type="button" onClick={() => router.push("/admin/portfolio")} className="border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}
