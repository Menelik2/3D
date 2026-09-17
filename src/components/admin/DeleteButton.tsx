"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  endpoint,
  redirectTo,
  label = "Delete",
  confirmMessage = "Delete this item permanently?",
}: {
  endpoint: string;
  redirectTo: string;
  label?: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    if (!confirm(confirmMessage)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Delete failed");
        setBusy(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error");
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={onDelete}
        className="text-[10px] uppercase tracking-widest text-red-400/80 hover:text-red-300 disabled:opacity-50"
      >
        {busy ? "Deleting…" : label}
      </button>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </span>
  );
}
