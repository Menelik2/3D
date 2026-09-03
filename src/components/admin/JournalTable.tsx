"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublishToggle } from "@/components/admin/PublishToggle";

export type JournalRow = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  category: string | null;
  published_at?: string | null;
  created_at?: string | null;
};

export function JournalTable({ posts }: { posts: JournalRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allIds = useMemo(() => posts.map((p) => p.id), [posts]);
  const allSelected =
    posts.length > 0 && allIds.every((id) => selected.has(id));
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
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  }

  async function bulkDelete() {
    if (!someSelected || busy) return;
    const n = selected.size;
    const ok = confirm(
      `Permanently delete ${n} journal post${n === 1 ? "" : "s"} from the database?\n\nThis cannot be undone.`
    );
    if (!ok) return;

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/cms/journal", {
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
        `Deleted ${data.deleted ?? n} post${(data.deleted ?? n) === 1 ? "" : "s"} permanently.`
      );
      router.refresh();
    } catch {
      setMessage("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="border border-border px-4 py-16 text-center text-sm text-muted">
        No posts yet.{" "}
        <Link href="/admin/journal/new" className="text-accent hover:underline">
          Write one
        </Link>
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
        {message && <p className="text-xs text-muted">{message}</p>}
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all posts"
                  className="h-3.5 w-3.5 accent-[var(--accent,#e11d48)]"
                />
              </th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => {
              const isOn = selected.has(p.id);
              const dateStr = p.published_at || p.created_at;
              return (
                <tr
                  key={p.id}
                  className={`border-b border-border/60 hover:bg-white/[0.02] ${
                    isOn ? "bg-accent/5" : ""
                  }`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggleOne(p.id)}
                      aria-label={`Select ${p.title}`}
                      className="h-3.5 w-3.5 accent-[var(--accent,#e11d48)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/journal/${p.id}`}
                      className="text-foreground/90 hover:text-accent"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {p.slug}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {p.category || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <PublishToggle
                      endpoint={`/api/cms/journal/${p.id}`}
                      initial={p.is_published}
                      labels={["Published", "Draft"]}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {dateStr ? new Date(dateStr).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/journal/${p.id}`}
                      className="text-[10px] uppercase tracking-widest text-muted hover:text-accent"
                    >
                      Edit
                    </Link>
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
