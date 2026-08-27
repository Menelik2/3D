"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

type Initial = {
  id?: string;
  question?: string;
  answer?: string;
  category?: string | null;
  sort_order?: number;
  is_published?: boolean;
};

export function FaqForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    question: initial?.question ?? "",
    answer: initial?.answer ?? "",
    category: initial?.category ?? "",
    sort_order: String(initial?.sort_order ?? 0),
    is_published: initial?.is_published ?? true,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
    const url = isEdit ? `/api/cms/faqs/${initial!.id}` : "/api/cms/faqs";
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
    router.push("/admin/faqs");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      {error && <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
      <div>
        <label className={labelClass}>Question *</label>
        <input required className={fieldClass} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Answer *</label>
        <textarea required rows={5} className={fieldClass + " resize-y"} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Category</label>
          <input className={fieldClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="General, Pricing…" />
        </div>
        <div>
          <label className={labelClass}>Sort order</label>
          <input type="number" className={fieldClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
        Published on /faq
      </label>
      <button type="submit" disabled={saving} className="bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50">
        {saving ? "Saving…" : isEdit ? "Update" : "Create"}
      </button>
    </form>
  );
}
