"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "IDEA",
  "PRE_PRODUCTION",
  "PRODUCTION",
  "EDITING",
  "COLOR_GRADING",
  "CLIENT_REVIEW",
  "FINAL_DELIVERY",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
] as const;

const fieldClass =
  "w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent";
const labelClass = "mb-1.5 block text-[10px] uppercase tracking-widest text-muted";

export type ProjectInitial = {
  id?: string;
  title?: string;
  slug?: string | null;
  status?: string;
  category?: string | null;
  description?: string | null;
  budget?: number | null;
  location?: string | null;
  production_date?: string | null;
  delivery_date?: string | null;
  cover_image_url?: string | null;
};

export function ProjectForm({ initial }: { initial?: ProjectInitial | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    status: initial?.status ?? "IDEA",
    category: initial?.category ?? "",
    description: initial?.description ?? "",
    budget: initial?.budget?.toString() ?? "",
    location: initial?.location ?? "",
    production_date: initial?.production_date?.slice(0, 10) ?? "",
    delivery_date: initial?.delivery_date?.slice(0, 10) ?? "",
    cover_image_url: initial?.cover_image_url ?? "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : null,
        production_date: form.production_date || null,
        delivery_date: form.delivery_date || null,
      };
      const url = isEdit ? `/api/cms/projects/${initial!.id}` : "/api/cms/projects";
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
      router.push("/admin/projects");
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
        <label className={labelClass}>Title *</label>
        <input
          required
          className={fieldClass}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
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
          <label className={labelClass}>Status</label>
          <select
            className={fieldClass}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Category</label>
          <input
            className={fieldClass}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Music Video, Wedding"
          />
        </div>
        <div>
          <label className={labelClass}>Budget</label>
          <input
            type="number"
            step="0.01"
            className={fieldClass}
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={4}
          className={fieldClass}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Location</label>
        <input
          className={fieldClass}
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Production date</label>
          <input
            type="date"
            className={fieldClass}
            value={form.production_date}
            onChange={(e) => set("production_date", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Delivery date</label>
          <input
            type="date"
            className={fieldClass}
            value={form.delivery_date}
            onChange={(e) => set("delivery_date", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Cover image URL</label>
        <input
          className={fieldClass}
          value={form.cover_image_url}
          onChange={(e) => set("cover_image_url", e.target.value)}
        />
      </div>
      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? "Saving..." : isEdit ? "Update project" : "Create project"}
      </button>
    </form>
  );
}
