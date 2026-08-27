"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

type Initial = {
  id?: string;
  name?: string;
  role?: string;
  bio?: string | null;
  profile_image_url?: string | null;
  sort_order?: number;
  is_published?: boolean;
};

export function TeamForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    role: initial?.role ?? "",
    bio: initial?.bio ?? "",
    profile_image_url: initial?.profile_image_url ?? "",
    sort_order: String(initial?.sort_order ?? 0),
    is_published: initial?.is_published ?? false,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
    const url = isEdit ? `/api/cms/team/${initial!.id}` : "/api/cms/team";
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
    router.push("/admin/team");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      {error && <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name *</label>
          <input required className={fieldClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Role *</label>
          <input required className={fieldClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Bio</label>
        <textarea rows={4} className={fieldClass + " resize-y"} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Photo URL</label>
        <input className={fieldClass} value={form.profile_image_url} onChange={(e) => setForm({ ...form, profile_image_url: e.target.value })} />
      </div>
      <div className="flex flex-wrap gap-6 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Published on /team
        </label>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Sort</label>
          <input type="number" className={fieldClass + " w-20"} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>
      </div>
      <button type="submit" disabled={saving} className="bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50">
        {saving ? "Saving…" : isEdit ? "Update" : "Create"}
      </button>
    </form>
  );
}
