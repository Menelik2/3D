"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

const STATUSES = [
  "NEW",
  "CONTACTED",
  "CONSULTATION_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CONFIRMED",
  "IN_PRODUCTION",
  "COMPLETED",
  "CANCELLED",
  "ARCHIVED",
];

const PROJECT_TYPE_OPTIONS = [
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
  full_name?: string;
  company?: string | null;
  email?: string;
  phone?: string | null;
  whatsapp?: string | null;
  preferred_contact?: string | null;
  project_types?: string[] | null;
  project_title?: string | null;
  project_description?: string | null;
  creative_idea?: string | null;
  preferred_date?: string | null;
  city?: string | null;
  location?: string | null;
  budget_range?: string | null;
  estimated_budget?: number | null;
  notes?: string | null;
  status?: string;
  source?: string | null;
};

export function LeadForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: initial?.full_name ?? "",
    company: initial?.company ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    whatsapp: initial?.whatsapp ?? "",
    preferred_contact: initial?.preferred_contact ?? "email",
    project_types: (initial?.project_types ?? []) as string[],
    project_title: initial?.project_title ?? "",
    project_description: initial?.project_description ?? "",
    creative_idea: initial?.creative_idea ?? "",
    preferred_date: initial?.preferred_date
      ? String(initial.preferred_date).slice(0, 10)
      : "",
    city: initial?.city ?? "",
    location: initial?.location ?? "",
    budget_range: initial?.budget_range ?? "",
    estimated_budget: initial?.estimated_budget?.toString() ?? "",
    notes: initial?.notes ?? "",
    status: initial?.status ?? "NEW",
    source: initial?.source ?? (isEdit ? "website" : "admin"),
  });

  const set = (k: string, v: string | string[]) =>
    setForm((p) => ({ ...p, [k]: v }));

  function toggleType(t: string) {
    setForm((p) => {
      const has = p.project_types.includes(t);
      return {
        ...p,
        project_types: has
          ? p.project_types.filter((x) => x !== t)
          : [...p.project_types, t],
      };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        estimated_budget:
          form.estimated_budget === "" ? null : Number(form.estimated_budget),
      };
      const url = isEdit
        ? `/api/admin/leads/${initial!.id}`
        : "/api/admin/leads";
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
      const id = isEdit ? initial!.id : data.lead?.id;
      router.push(id ? `/admin/leads/${id}` : "/admin/leads");
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
        <h2 className="text-xs uppercase tracking-widest text-muted">Contact</h2>
        <div>
          <label className={labelClass}>Full name *</label>
          <input
            required
            className={fieldClass}
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Email *</label>
            <input
              required
              type="email"
              className={fieldClass}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input
              className={fieldClass}
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone</label>
            <input
              className={fieldClass}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input
              className={fieldClass}
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Preferred contact</label>
          <select
            className={fieldClass}
            value={form.preferred_contact}
            onChange={(e) => set("preferred_contact", e.target.value)}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      </section>

      <section className="space-y-4 border border-border bg-card/20 p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted">Project</h2>
        <div>
          <label className={labelClass}>Project types</label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPE_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                className={`border px-2.5 py-1 text-[10px] uppercase tracking-widest transition ${
                  form.project_types.includes(t)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Project title</label>
          <input
            className={fieldClass}
            value={form.project_title}
            onChange={(e) => set("project_title", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            rows={3}
            className={fieldClass + " resize-y"}
            value={form.project_description}
            onChange={(e) => set("project_description", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Creative idea</label>
          <textarea
            rows={2}
            className={fieldClass + " resize-y"}
            value={form.creative_idea}
            onChange={(e) => set("creative_idea", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Preferred date</label>
            <input
              type="date"
              className={fieldClass}
              value={form.preferred_date}
              onChange={(e) => set("preferred_date", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              className={fieldClass}
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            className={fieldClass}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Budget range</label>
            <input
              className={fieldClass}
              value={form.budget_range}
              onChange={(e) => set("budget_range", e.target.value)}
              placeholder="e.g. 50,000–100,000 ETB"
            />
          </div>
          <div>
            <label className={labelClass}>Estimated budget (number)</label>
            <input
              type="number"
              className={fieldClass}
              value={form.estimated_budget}
              onChange={(e) => set("estimated_budget", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 border border-border bg-card/20 p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted">Admin</h2>
        <div className="grid gap-4 sm:grid-cols-2">
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
          <div>
            <label className={labelClass}>Source</label>
            <input
              className={fieldClass}
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Internal notes</label>
          <textarea
            rows={3}
            className={fieldClass + " resize-y"}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </section>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Update lead" : "Create lead"}
        </button>
        <button
          type="button"
          onClick={() =>
            router.push(
              isEdit && initial?.id
                ? `/admin/leads/${initial.id}`
                : "/admin/leads"
            )
          }
          className="border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
