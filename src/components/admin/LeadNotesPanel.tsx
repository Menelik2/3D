"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: string;
  body: string;
  created_at: string;
};

export function LeadNotesPanel({
  leadId,
  initialNotes,
}: {
  leadId: string;
  initialNotes: Note[];
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save note");
      } else if (data.note) {
        setNotes((prev) => [data.note, ...prev]);
        setBody("");
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addNote} className="space-y-3">
        <label className="block text-xs uppercase tracking-widest text-muted">Add note</label>
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Call summary, next steps, internal comments…"
          className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none resize-y"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={saving || !body.trim()}
          className="bg-accent px-4 py-2 text-[10px] uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-40"
        >
          {saving ? "Saving…" : "Add note"}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-muted">History</h3>
        {notes.length === 0 ? (
          <p className="text-sm text-muted">No notes yet.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="border border-border bg-card/30 p-4">
                <p className="text-sm whitespace-pre-wrap">{n.body}</p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-muted">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
