"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  "Client",
  "Project type",
  "Details",
  "Date & location",
  "Budget",
  "Files",
  "Review",
];

const PROJECT_TYPES = [
  "Music Video",
  "Commercial",
  "Wedding Film",
  "Event Coverage",
  "Photography",
  "Documentary",
  "Corporate Film",
  "Social Media Content",
  "Other",
];

const BUDGETS = [
  "Under 10,000 ETB",
  "10,000–25,000 ETB",
  "25,000–50,000 ETB",
  "50,000–100,000 ETB",
  "100,000+ ETB",
  "Not sure / Need a quote",
];

const field =
  "w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none transition-colors";
const label =
  "block text-[10px] uppercase tracking-[0.25em] text-muted mb-2";

export default function StartProjectPage() {
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
    setForm((p) => ({ ...p, [k]: v }));
  const toggleType = (t: string) =>
    setForm((p) => ({
      ...p,
      projectTypes: p.projectTypes.includes(t)
        ? p.projectTypes.filter((x) => x !== t)
        : [...p.projectTypes, t],
    }));

  function canContinue() {
    if (step === 0) return form.fullName.trim() && form.email.trim();
    if (step === 1) return form.projectTypes.length > 0;
    return true;
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
        setError(data.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      setReferenceNumber(data.reference_number || data.reference || "");
      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="pt-28 pb-24 min-h-[70vh] flex items-center">
        <div className="mx-auto max-w-xl px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
            Received
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">
            Thank you
          </h1>
          <p className="mt-3 text-lg text-muted font-light tracking-wide">
            Your story starts here.
          </p>
          <p className="mt-6 text-sm text-muted leading-relaxed">
            Your project request has been received. META Pictures will review
            your information and contact you.
          </p>
          {referenceNumber && (
            <p className="mt-4 font-mono text-[11px] text-muted/70">
              Reference: {referenceNumber}
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/work" className="btn-ghost">
              View portfolio
            </Link>
            <Link href="/" className="btn-primary">
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <header className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
            Inquiry
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">
            Start a Project
          </h1>
          <p className="mt-4 text-sm text-muted max-w-md mx-auto leading-relaxed">
            Tell us about your vision. We&apos;ll respond with next steps and a
            clear production path.
          </p>
          <div className="mt-8 mx-auto h-px w-16 bg-accent/80" />
        </header>

        <div className="mb-10">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
            <span>{STEPS[step]}</span>
          </div>
          <div className="h-0.5 bg-border overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{
                width: `${((step + 1) / STEPS.length) * 100}%`,
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
                <label className={label}>Full name *</label>
                <input
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Company / artist</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Email *</label>
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
                  <label className={label}>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>WhatsApp</label>
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
              {PROJECT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`border px-4 py-3.5 text-left text-sm transition ${
                    form.projectTypes.includes(t)
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:border-white/25"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={label}>Project title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className={`${field} resize-y`}
                />
              </div>
              <div>
                <label className={label}>Creative idea</label>
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
                  <label className={label}>Preferred date</label>
                  <input
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => set("preferredDate", e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>Alternative date</label>
                  <input
                    type="date"
                    value={form.alternativeDate}
                    onChange={(e) => set("alternativeDate", e.target.value)}
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label className={label}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Location / venue</label>
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
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => set("budget", b)}
                  className={`w-full border px-4 py-3.5 text-left text-sm transition ${
                    form.budget === b
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:border-white/25"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="border border-dashed border-border bg-card/10 p-10 text-center">
              <p className="text-sm text-muted">Reference files (optional)</p>
              <p className="mt-2 text-xs text-muted/60 leading-relaxed max-w-sm mx-auto">
                You can share links in the description for now. Secure file
                upload to private storage will connect in a later release.
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
                Summary
              </p>
              {(
                [
                  ["Name", form.fullName],
                  ["Email", form.email],
                  ["Types", form.projectTypes.join(", ")],
                  ["Budget", form.budget],
                  ["City", form.city],
                  ["Description", form.description],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex flex-col sm:flex-row sm:gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
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
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canContinue()}
                onClick={() =>
                  setStep((s) => Math.min(STEPS.length - 1, s + 1))
                }
                className="btn-primary disabled:opacity-40"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit request"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
