"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = ["Client", "Project Type", "Details", "Date & Location", "Budget", "Files", "Review"];

const PROJECT_TYPES = [
  "Music Video", "Commercial", "Wedding Film", "Event Coverage",
  "Photography", "Documentary", "Corporate Film", "Social Media Content", "Other",
];
const BUDGETS = [
  "Under 10,000 ETB", "10,000–25,000 ETB", "25,000–50,000 ETB",
  "50,000–100,000 ETB", "100,000+ ETB", "Not sure / Need a quote",
];

export default function StartProjectPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [form, setForm] = useState({
    fullName: "", company: "", email: "", phone: "", whatsapp: "",
    preferredContact: "email", projectTypes: [] as string[],
    title: "", description: "", creativeIdea: "", references: "", visualStyle: "",
    preferredDate: "", alternativeDate: "", city: "", location: "",
    indoorOutdoor: "", duration: "", budget: "",
  });

  const set = (k: string, v: string | string[]) => setForm((p) => ({ ...p, [k]: v }));
  const toggleType = (t: string) =>
    setForm((p) => ({
      ...p,
      projectTypes: p.projectTypes.includes(t)
        ? p.projectTypes.filter((x) => x !== t)
        : [...p.projectTypes, t],
    }));

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
          <h1 className="text-3xl sm:text-4xl font-light">THANK YOU</h1>
          <p className="mt-4 text-xl text-muted font-light">YOUR STORY STARTS HERE.</p>
          <p className="mt-6 text-sm text-muted">
            Your project request has been received. META Pictures will review your information and contact you.
          </p>
          {referenceNumber && (
            <p className="mt-4 text-xs text-muted/70">Reference: {referenceNumber}</p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/work" className="inline-flex items-center justify-center border border-white/20 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white/5">
              Return to Portfolio
            </Link>
            <Link href="/" className="inline-flex items-center justify-center bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover">
              Back to Home
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
          <h1 className="text-3xl sm:text-4xl font-light">Start a Project</h1>
          <p className="mt-3 text-sm text-muted">Tell us about your vision. We&apos;ll take it from there.</p>
        </header>

        <div className="mb-10">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted mb-2">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{STEPS[step]}</span>
          </div>
          <div className="h-1 bg-border overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
          )}

          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Full Name *</label>
                <input required type="text" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Company / Artist</label>
                <input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2">WhatsApp</label>
                  <input type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => toggleType(t)}
                  className={`border px-4 py-3 text-left text-sm transition ${
                    form.projectTypes.includes(t) ? "border-accent bg-accent/10" : "border-border text-muted hover:border-white/30"
                  }`}>{t}</button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Project Title</label>
                <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Project Description</label>
                <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none resize-y" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Creative Idea</label>
                <textarea rows={3} value={form.creativeIdea} onChange={(e) => set("creativeIdea", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none resize-y" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2">Preferred Date</label>
                  <input type="date" value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2">Alternative Date</label>
                  <input type="date" value={form.alternativeDate} onChange={(e) => set("alternativeDate", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">City</label>
                <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Location / Venue</label>
                <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              {BUDGETS.map((b) => (
                <button key={b} type="button" onClick={() => set("budget", b)}
                  className={`w-full border px-4 py-3 text-left text-sm transition ${
                    form.budget === b ? "border-accent bg-accent/10" : "border-border text-muted hover:border-white/30"
                  }`}>{b}</button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted">File upload placeholder</p>
              <p className="mt-2 text-xs text-muted/60">Secure uploads to private storage come next.</p>
              <input type="file" multiple className="mt-6 text-sm text-muted" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov" />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-sm border border-border p-6 bg-card/30">
              <p><span className="text-muted text-xs">Name:</span> {form.fullName || "—"}</p>
              <p><span className="text-muted text-xs">Email:</span> {form.email || "—"}</p>
              <p><span className="text-muted text-xs">Types:</span> {form.projectTypes.join(", ") || "—"}</p>
              <p><span className="text-muted text-xs">Budget:</span> {form.budget || "—"}</p>
              <p className="whitespace-pre-wrap"><span className="text-muted text-xs">Description:</span> {form.description || "—"}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
              className="text-xs uppercase tracking-widest text-muted disabled:opacity-30 hover:text-foreground">← Back</button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest text-white hover:bg-accent-hover">Continue →</button>
            ) : (
              <button type="submit" disabled={submitting}
                className="bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50">
                {submitting ? "Submitting…" : "Submit Project Request"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
