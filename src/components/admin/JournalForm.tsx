"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

type Initial = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  body?: string | null;
  category?: string | null;
  cover_image_url?: string | null;
  is_published?: boolean;
};

export function JournalForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    category: initial?.category ?? "",
    cover_image_url: initial?.cover_image_url ?? "",
    is_published: initial?.is_published ?? false,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url = isEdit ? `/api/cms/journal/${initial!.id}` : "/api/cms/journal";
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
    router.push("/admin/journal");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      {error && <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
      <div>
        <label className={labelClass}>Title *</label>
        <input required className={fieldClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Slug</label>
          <input className={fieldClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto" />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <input className={fieldClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Excerpt</label>
        <textarea rows={2} className={fieldClass + " resize-y"} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Body</label>
        <textarea rows={10} className={fieldClass + " resize-y"} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Cover image URL</label>
        <input className={fieldClass} value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
        Published on /journal
      </label>
      <button type="submit" disabled={saving} className="bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50">
        {saving ? "Saving…" : isEdit ? "Update" : "Create"}
      </button>
    </form>
  );
}
