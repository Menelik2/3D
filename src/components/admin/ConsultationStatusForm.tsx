"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;

const fieldClass =
  "w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent";
const labelClass = "mb-1.5 block text-[10px] uppercase tracking-widest text-muted";

export function ConsultationStatusForm({
  id,
  initialStatus,
  initialNotes,
}: {
  id: string;
  initialStatus: string;
  initialNotes?: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/cms/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || "Update failed");
      else {
        setMsg("Saved");
        router.refresh();
      }
    } catch {
      setMsg("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4 max-w-lg">
      <div>
        <label className={labelClass}>Status</label>
        <select className={fieldClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Internal notes</label>
        <textarea
          rows={4}
          className={fieldClass}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {msg && <p className="text-xs text-muted">{msg}</p>}
      <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
        {busy ? "Saving…" : "Update consultation"}
      </button>
    </form>
  );
}
