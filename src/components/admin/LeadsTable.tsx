"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type LeadRow = {
  id: string;
  reference_number: string;
  full_name: string;
  email: string;
  status: string;
  project_types: string[] | null;
  budget_range: string | null;
  created_at: string;
};

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allIds = useMemo(() => leads.map((l) => l.id), [leads]);
  const allSelected =
    leads.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  }

  async function bulkDelete() {
    if (!someSelected || busy) return;
    const n = selected.size;
    const ok = confirm(
      `Permanently delete ${n} lead${n === 1 ? "" : "s"} from the database?\n\nThis cannot be undone. Notes attached to these leads will also be removed.`
    );
    if (!ok) return;

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected] }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error || "Bulk delete failed");
        setBusy(false);
        return;
      }
      setSelected(new Set());
      setMessage(
        `Deleted ${data.deleted ?? n} lead${(data.deleted ?? n) === 1 ? "" : "s"} permanently.`
      );
      router.refresh();
    } catch {
      setMessage("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (leads.length === 0) {
    return (
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <tbody>
            <tr>
              <td className="px-4 py-16 text-center text-sm text-muted">
                No leads yet. Submissions from{" "}
                <Link href="/start-a-project" className="text-accent hover:underline">
                  Start a Project
                </Link>{" "}
                or{" "}
                <Link href="/admin/leads/new" className="text-accent hover:underline">
                  add one manually
                </Link>
                .
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!someSelected || busy}
          onClick={bulkDelete}
          className="border border-red-500/40 bg-red-500/10 px-4 py-2 text-[10px] uppercase tracking-widest text-red-300 hover:bg-red-500/20 disabled:opacity-40"
        >
          {busy
            ? "Deleting…"
            : `Delete selected${someSelected ? ` (${selected.size})` : ""}`}
        </button>
        {someSelected && !busy && (
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            Clear selection
          </button>
        )}
        {message && (
          <p className="text-xs text-muted">{message}</p>
        )}
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all leads"
                  className="h-3.5 w-3.5 accent-[var(--accent,#e11d48)]"
                />
              </th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Types</th>
              <th className="px-4 py-3 font-medium">Budget</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isOn = selected.has(lead.id);
              return (
                <tr
                  key={lead.id}
                  className={`border-b border-border/60 hover:bg-white/[0.02] ${
                    isOn ? "bg-accent/5" : ""
                  }`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggleOne(lead.id)}
                      aria-label={`Select ${lead.full_name}`}
                      className="h-3.5 w-3.5 accent-[var(--accent,#e11d48)]"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="hover:text-accent"
                    >
                      {lead.reference_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-foreground/90 hover:text-accent"
                    >
                      {lead.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{lead.email}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {lead.project_types?.slice(0, 2).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {lead.budget_range || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                      {lead.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
