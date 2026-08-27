"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

export function SettingsForm({
  contact,
  social,
}: {
  contact: { phone: string; whatsapp: string; email: string; address: string };
  social: { instagram: string; youtube: string; tiktok: string; facebook: string; telegram: string };
}) {
  const router = useRouter();
  const [c, setC] = useState(contact);
  const [s, setS] = useState(social);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(key: "contact" | "social", value: object) {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/cms/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setMsg(data.error || "Save failed");
    else {
      setMsg("Saved " + key);
      router.refresh();
    }
  }

  return (
    <div className="space-y-10 max-w-2xl">
      {msg && <p className="text-sm text-muted">{msg}</p>}

      <section className="space-y-4 border border-border p-6 bg-card/20">
        <h2 className="text-xs uppercase tracking-widest text-muted">Contact</h2>
        {(["phone", "whatsapp", "email", "address"] as const).map((k) => (
          <div key={k}>
            <label className={labelClass}>{k}</label>
            <input className={fieldClass} value={c[k]} onChange={(e) => setC({ ...c, [k]: e.target.value })} />
          </div>
        ))}
        <button type="button" disabled={saving} onClick={() => save("contact", c)} className="bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50">
          Save contact
        </button>
      </section>

      <section className="space-y-4 border border-border p-6 bg-card/20">
        <h2 className="text-xs uppercase tracking-widest text-muted">Social</h2>
        {(["instagram", "youtube", "tiktok", "facebook", "telegram"] as const).map((k) => (
          <div key={k}>
            <label className={labelClass}>{k}</label>
            <input className={fieldClass} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} placeholder="https://…" />
          </div>
        ))}
        <button type="button" disabled={saving} onClick={() => save("social", s)} className="bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50">
          Save social
        </button>
      </section>
    </div>
  );
}
