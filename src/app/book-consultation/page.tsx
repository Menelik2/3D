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
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  if (submitted) {
    return (
      <div className="pt-28 pb-24 min-h-[70vh] flex items-center">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h1 className="text-3xl font-light">Consultation Requested</h1>
          <p className="mt-4 text-muted text-sm">
            We have received your request. META Pictures will confirm availability and contact you shortly.
          </p>
          <Link href="/" className="mt-10 inline-flex border border-white/20 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white/5">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-light">Book a Consultation</h1>
          <p className="mt-3 text-sm text-muted">
            Choose a type, preferred date and tell us a little about your project.
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-8"
        >
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-3">Consultation Type</label>
            <div className="space-y-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`w-full border px-4 py-3 text-left text-sm transition ${
                    type === t ? "border-accent bg-accent/10" : "border-border text-muted hover:border-white/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Full Name *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Email *</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Preferred Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Project notes</label>
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none resize-y" placeholder="Brief description of what you would like to discuss" />
          </div>

          <p className="text-xs text-muted/70">
            Availability calendar and double-booking prevention will be connected when the backend and admin availability settings are live.
          </p>

          <button type="submit" className="w-full bg-accent px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white hover:bg-accent-hover">
            Request Consultation
          </button>
        </form>
      </div>
    </div>
  );
}
