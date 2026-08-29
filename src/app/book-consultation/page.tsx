"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { getPageCopy } from "@/lib/i18n/pages";

/** Stable English values stored in the database / admin */
const TYPE_VALUES = [
  "Creative Consultation",
  "Production Planning",
  "Commercial Meeting",
  "Wedding Consultation",
  "Music Video Consultation",
] as const;

export default function BookConsultationPage() {
  const { locale } = useI18n();
  const p = getPageCopy(locale).bookConsultation;

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeIndex, setTypeIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (typeIndex === null) {
      setError(p.selectTypeError);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: TYPE_VALUES[typeIndex],
          fullName: name,
          email,
          phone,
          date,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || p.submitError);
        setSubmitting(false);
        return;
      }
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
          <p className="mt-5 text-muted text-sm leading-relaxed">{p.successBody}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-ghost">
              {p.returnHome}
            </Link>
            <Link href="/work" className="btn-primary">
              {p.viewWork}
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
            {p.eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">{p.title}</h1>
          <p className="mt-4 text-sm text-muted max-w-md mx-auto leading-relaxed">
            {p.description}
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
              {p.typeLabel}
            </label>
            <div className="space-y-2">
              {p.types.map((label, i) => (
                <button
                  key={TYPE_VALUES[i]}
                  type="button"
                  onClick={() => setTypeIndex(i)}
                  className={`w-full border px-4 py-3.5 text-left text-sm transition ${
                    typeIndex === i
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:border-white/25"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
                {p.fullName}
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
                {p.email}
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
                {p.phone}
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
                {p.preferredDate}
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
              {p.projectNotes}
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none resize-y"
              placeholder={p.notesPlaceholder}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? p.submitting : p.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
