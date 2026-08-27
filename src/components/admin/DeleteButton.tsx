"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  endpoint,
  redirectTo,
}: {
  endpoint: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this item permanently?")) return;
    setBusy(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onDelete}
      className="text-[10px] uppercase tracking-widest text-red-400/80 hover:text-red-300 disabled:opacity-50"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
