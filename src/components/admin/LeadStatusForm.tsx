"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export function LeadStatusForm({
  leadId,
  initialStatus,
}: {
  leadId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Update failed");
      } else {
        setMessage("Status saved");
        router.refresh();
      }
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-widest text-muted">Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-accent outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={save}
        disabled={saving || status === initialStatus}
        className="bg-accent px-4 py-2 text-[10px] uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-40"
      >
        {saving ? "Saving…" : "Update status"}
      </button>
      {message && <p className="text-xs text-muted">{message}</p>}
    </div>
  );
}
