"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PublishToggle({
  endpoint,
  field = "is_published",
  initial,
  labels = ["Yes", "Draft"],
}: {
  endpoint: string;
  field?: string;
  initial: boolean;
  labels?: [string, string];
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !value;
    setBusy(true);
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      });
      if (res.ok) {
        setValue(next);
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
      onClick={toggle}
      className={`text-xs ${value ? "text-emerald-500/90" : "text-muted"} hover:underline disabled:opacity-50`}
    >
      {value ? labels[0] : labels[1]}
    </button>
  );
}
