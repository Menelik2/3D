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
  tags?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  social_image_url?: string | null;
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
    tags: (initial?.tags ?? []).join(", "),
    seo_title: initial?.seo_title ?? "",
    seo_description: initial?.seo_description ?? "",
    social_image_url: initial?.social_image_url ?? "",
    is_published: initial?.is_published ?? false,
  });

  const set = (k: string, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(/[,\n]/)
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const url = isEdit
        ? `/api/cms/journal/${initial!.id}`
        : "/api/cms/journal";
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
      router.push("/admin/journal");
      router.refresh();
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="space-y-4 border border-border bg-card/20 p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted">Content</h2>
        <div>
          <label className={labelClass}>Title *</label>
          <input
            required
            className={fieldClass}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Slug</label>
            <input
              className={fieldClass}
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="auto from title"
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              className={fieldClass}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Production, Behind the scenes"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea
            rows={2}
            className={fieldClass + " resize-y"}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Body</label>
          <textarea
            rows={12}
            className={fieldClass + " resize-y font-mono text-[13px]"}
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            placeholder="Markdown or plain text"
          />
        </div>
        <div>
          <label className={labelClass}>Tags</label>
          <input
            className={fieldClass}
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="cinema, ethiopia, production (comma-separated)"
          />
        </div>
        <div>
          <label className={labelClass}>Cover image URL</label>
          <input
            className={fieldClass}
            value={form.cover_image_url}
            onChange={(e) => set("cover_image_url", e.target.value)}
            placeholder="https://… or /brand/…"
          />
        </div>
      </section>

      <section className="space-y-4 border border-border bg-card/20 p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted">SEO</h2>
        <div>
          <label className={labelClass}>SEO title</label>
          <input
            className={fieldClass}
            value={form.seo_title}
            onChange={(e) => set("seo_title", e.target.value)}
            placeholder="Defaults to post title"
          />
        </div>
        <div>
          <label className={labelClass}>SEO description</label>
          <textarea
            rows={2}
            className={fieldClass + " resize-y"}
            value={form.seo_description}
            onChange={(e) => set("seo_description", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Social image URL</label>
          <input
            className={fieldClass}
            value={form.social_image_url}
            onChange={(e) => set("social_image_url", e.target.value)}
            placeholder="OG / share image"
          />
        </div>
      </section>

      <section className="space-y-4 border border-border bg-card/20 p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted">Publish</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => set("is_published", e.target.checked)}
          />
          Published on /journal
        </label>
      </section>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Update post" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/journal")}
          className="border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
