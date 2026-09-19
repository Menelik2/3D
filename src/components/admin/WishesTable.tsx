"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type WishRow = {
  id: string;
  gallery_id: string;
  author_name: string;
  message: string;
  created_at: string;
  gallery_title?: string | null;
  gallery_token?: string | null;
  client_name?: string | null;
};

export function WishesTable({ wishes }: { wishes: WishRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allIds = useMemo(() => wishes.map((w) => w.id), [wishes]);
  const allSelected =
    wishes.length > 0 && allIds.every((id) => selected.has(id));
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
      `Permanently delete ${n} wish${n === 1 ? "" : "es"} from the database?\n\nThis cannot be undone.`
    );
    if (!ok) return;

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/cms/wishes", {
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
        `Deleted ${data.deleted ?? n} wish${(data.deleted ?? n) === 1 ? "" : "es"} permanently.`
      );
      router.refresh();
    } catch {
      setMessage("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (wishes.length === 0) {
    return (
      <div className="border border-border px-4 py-16 text-center text-sm text-muted">
        No wishes yet. Guests can leave messages on private gallery links, or{" "}
        <Link href="/admin/wishes/new" className="text-accent hover:underline">
          add one manually
        </Link>
        .
      </div>
    );
  }

  const toolbar = (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={!someSelected || busy}
        onClick={bulkDelete}
        className="border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-[10px] uppercase tracking-widest text-red-300 hover:bg-red-500/20 disabled:opacity-40"
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
  );

  return (
    <div className="space-y-3">
      {toolbar}

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        <label className="flex items-center gap-2 px-1 text-[10px] uppercase tracking-widest text-muted">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 accent-[var(--accent,#e11d48)]"
          />
          Select all
        </label>
        {wishes.map((w) => {
          const isOn = selected.has(w.id);
          return (
            <div
              key={w.id}
              className={`border border-border bg-card/20 p-4 ${
                isOn ? "border-accent/40 bg-accent/5" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => toggleOne(w.id)}
                  aria-label={`Select wish from ${w.author_name}`}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent,#e11d48)]"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/admin/wishes/${w.id}`}
                      className="text-sm font-medium text-foreground/95 hover:text-accent"
                    >
                      {w.author_name}
                    </Link>
                    <span className="shrink-0 text-[10px] text-muted">
                      {new Date(w.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted line-clamp-3 whitespace-pre-wrap">
                    {w.message}
                  </p>
                  <p className="text-[11px] text-muted">
                    {w.gallery_title || "Gallery"}
                    {w.client_name ? ` · ${w.client_name}` : ""}
                  </p>
                  <Link
                    href={`/admin/wishes/${w.id}`}
                    className="inline-block pt-1 text-[10px] uppercase tracking-widest text-accent"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all wishes"
                  className="h-3.5 w-3.5 accent-[var(--accent,#e11d48)]"
                />
              </th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Gallery</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishes.map((w) => {
              const isOn = selected.has(w.id);
              return (
                <tr
                  key={w.id}
                  className={`border-b border-border/60 hover:bg-white/[0.02] ${
                    isOn ? "bg-accent/5" : ""
                  }`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggleOne(w.id)}
                      aria-label={`Select wish from ${w.author_name}`}
                      className="h-3.5 w-3.5 accent-[var(--accent,#e11d48)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/wishes/${w.id}`}
                      className="text-foreground/90 hover:text-accent font-medium"
                    >
                      {w.author_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted max-w-xs">
                    <span className="line-clamp-2 whitespace-pre-wrap">
                      {w.message}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {w.gallery_token ? (
                      <Link
                        href={`/admin/galleries/${w.gallery_id}`}
                        className="hover:text-accent"
                      >
                        {w.gallery_title || "Gallery"}
                      </Link>
                    ) : (
                      w.gallery_title || "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                    {new Date(w.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/wishes/${w.id}`}
                      className="text-[10px] uppercase tracking-widest text-accent"
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
