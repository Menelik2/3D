"use client";

import { useState } from "react";
import Link from "next/link";

const TYPES = [
  "Creative Consultation",
  "Production Planning",
  "Commercial Meeting",
  "Wedding Consultation",
  "Music Video Consultation",
];

export default function BookConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type) {
      setError("Please select a consultation type.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          fullName: name,
          email,
          phone,
          date,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Check your connection and try again.");
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
            Consultation requested
          </h1>
          <p className="mt-5 text-muted text-sm leading-relaxed">
            We have your request. META Pictures will confirm availability and
            contact you shortly.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-ghost">
              Return home
            </Link>
            <Link href="/work" className="btn-primary">
              View work
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
            Meeting
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">
            Book a Consultation
          </h1>
          <p className="mt-4 text-sm text-muted max-w-md mx-auto leading-relaxed">
            Choose a type, preferred date, and a short note about what you want
            to discuss.
          </p>
          <div className="mt-8 mx-auto h-px w-16 bg-accent/80" />
        </header>

        <form onSubmit={onSubmit} className="space-y-8">
          {error && (
            <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-3">
              Consultation type *
            </label>
            <div className="space-y-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`w-full border px-4 py-3.5 text-left text-sm transition ${
                    type === t
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:border-white/25"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
                Full name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
                Email *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
                Preferred date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
              Project notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none resize-y"
              placeholder="What would you like to discuss?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Request Consultation"}
          </button>
        </form>
      </div>
    </div>
  );
}
