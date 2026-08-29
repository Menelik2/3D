"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

/** Stable English values stored in the database / admin */
const PROJECT_TYPE_VALUES = [
  "Music Video",
  "Commercial",
  "Wedding Film",
  "Event Coverage",
  "Photography",
  "Documentary",
  "Corporate Film",
  "Social Media Content",
  "Other",
] as const;

const BUDGET_VALUES = [
  "Under 10,000 ETB",
  "10,000–25,000 ETB",
  "25,000–50,000 ETB",
  "50,000–100,000 ETB",
  "100,000+ ETB",
  "Not sure / Need a quote",
] as const;

const field =
  "w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none transition-colors";
const label =
  "block text-[10px] uppercase tracking-[0.25em] text-muted mb-2";

export default function StartProjectPage() {
  const { locale } = useI18n();
  const p = getPageCopy(locale).startProject;

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    whatsapp: "",
    preferredContact: "email",
    projectTypes: [] as string[],
    title: "",
    description: "",
    creativeIdea: "",
    references: "",
    visualStyle: "",
    preferredDate: "",
    alternativeDate: "",
    city: "",
    location: "",
    indoorOutdoor: "",
    duration: "",
    budget: "",
  });

  const set = (k: string, v: string | string[]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const toggleType = (value: string) =>
    setForm((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(value)
        ? prev.projectTypes.filter((x) => x !== value)
        : [...prev.projectTypes, value],
    }));

  function canContinue() {
    if (step === 0) return form.fullName.trim() && form.email.trim();
    if (step === 1) return form.projectTypes.length > 0;
    return true;
  }

  function typeLabel(value: string) {
    const i = PROJECT_TYPE_VALUES.indexOf(value as (typeof PROJECT_TYPE_VALUES)[number]);
    return i >= 0 ? p.projectTypes[i] : value;
  }

  function budgetLabel(value: string) {
    const i = BUDGET_VALUES.indexOf(value as (typeof BUDGET_VALUES)[number]);
    return i >= 0 ? p.budgets[i] : value;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || p.submitError);
        setSubmitting(false);
        return;
      }
      setReferenceNumber(data.reference_number || data.reference || "");
      setSubmitted(true);
    } catch {
      setError(p.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="pt-28 pb-24 min-h-[70vh] flex items-center">
        <div className="mx-auto max-w-xl px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
            {p.successEyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">
            {p.successTitle}
          </h1>
          <p className="mt-3 text-lg text-muted font-light tracking-wide">
            {p.successTagline}
          </p>
          <p className="mt-6 text-sm text-muted leading-relaxed">{p.successBody}</p>
          {referenceNumber && (
            <p className="mt-4 font-mono text-[11px] text-muted/70">
              {p.reference}: {referenceNumber}
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/work" className="btn-ghost">
              {p.viewPortfolio}
            </Link>
            <Link href="/" className="btn-primary">
              {p.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stepLabel = p.stepOf
    .replace("{current}", String(step + 1))
    .replace("{total}", String(p.steps.length));

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <header className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
            {p.eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">{p.title}</h1>
          <p className="mt-4 text-sm text-muted max-w-md mx-auto leading-relaxed">
            {p.description}
          </p>
          <div className="mt-8 mx-auto h-px w-16 bg-accent/80" />
        </header>

        <div className="mb-10">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
            <span>{stepLabel}</span>
            <span>{p.steps[step]}</span>
          </div>
          <div className="h-0.5 bg-border overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{
                width: `${((step + 1) / p.steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className={label}>{p.fullName}</label>
                <input
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>{p.company}</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>{p.email}</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={field}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label}>{p.phone}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>{p.whatsapp}</label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => set("whatsapp", e.target.value)}
                    className={field}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPE_VALUES.map((value, i) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleType(value)}
                  className={`border px-4 py-3.5 text-left text-sm transition ${
                    form.projectTypes.includes(value)
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:border-white/25"
                  }`}
                >
                  {p.projectTypes[i]}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={label}>{p.projectTitle}</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>{p.projectDescription}</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className={`${field} resize-y`}
                />
              </div>
              <div>
                <label className={label}>{p.creativeIdea}</label>
                <textarea
                  rows={3}
                  value={form.creativeIdea}
                  onChange={(e) => set("creativeIdea", e.target.value)}
                  className={`${field} resize-y`}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label}>{p.preferredDate}</label>
                  <input
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => set("preferredDate", e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>{p.alternativeDate}</label>
                  <input
                    type="date"
                    value={form.alternativeDate}
                    onChange={(e) => set("alternativeDate", e.target.value)}
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label className={label}>{p.city}</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>{p.location}</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className={field}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              {BUDGET_VALUES.map((value, i) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("budget", value)}
                  className={`w-full border px-4 py-3.5 text-left text-sm transition ${
                    form.budget === value
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:border-white/25"
                  }`}
                >
                  {p.budgets[i]}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="border border-dashed border-border bg-card/10 p-10 text-center">
              <p className="text-sm text-muted">{p.filesTitle}</p>
              <p className="mt-2 text-xs text-muted/60 leading-relaxed max-w-sm mx-auto">
                {p.filesHint}
              </p>
              <input
                type="file"
                multiple
                disabled
                className="mt-6 text-sm text-muted/50 cursor-not-allowed"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov"
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-sm border border-border p-6 md:p-8 bg-card/25">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
                {p.summary}
              </p>
              {(
                [
                  [p.summaryName, form.fullName],
                  [p.summaryEmail, form.email],
                  [
                    p.summaryTypes,
                    form.projectTypes.map(typeLabel).join(", "),
                  ],
                  [p.summaryBudget, form.budget ? budgetLabel(form.budget) : ""],
                  [p.summaryCity, form.city],
                  [p.summaryDescription, form.description],
                ] as const
              ).map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-col sm:flex-row sm:gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-[10px] uppercase tracking-widest text-muted sm:w-28 shrink-0 pt-0.5">
                    {k}
                  </span>
                  <span className="text-foreground/90 whitespace-pre-wrap">
                    {v || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-border gap-4">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-[11px] uppercase tracking-widest text-muted disabled:opacity-30 hover:text-foreground transition-colors"
            >
              {p.back}
            </button>
            {step < p.steps.length - 1 ? (
              <button
                type="button"
                disabled={!canContinue()}
                onClick={() =>
                  setStep((s) => Math.min(p.steps.length - 1, s + 1))
                }
                className="btn-primary disabled:opacity-40"
              >
                {p.continue}
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? p.submitting : p.submit}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
