"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

export function SettingsForm({
  contact,
  social,
}: {
  contact: { phone: string; whatsapp: string; email: string; address: string };
  social: {
    instagram: string;
    youtube: string;
    tiktok: string;
    facebook: string;
    telegram: string;
  };
}) {
  const router = useRouter();
  const [c, setC] = useState(contact);
  const [s, setS] = useState(social);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(key: "contact" | "social", value: object) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/cms/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Save failed");
        return;
      }
      setMsg(
        key === "contact"
          ? "Contact saved — visible on site footer, contact page & dashboard."
          : "Social links saved — visible on site footer & dashboard."
      );
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10 max-w-2xl">
      {msg && (
        <p className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {msg}
        </p>
      )}
      {err && (
        <p className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {err}
        </p>
      )}

      <section className="space-y-4 border border-border p-6 bg-card/20">
        <h2 className="text-xs uppercase tracking-widest text-muted">Contact</h2>
        {(["phone", "whatsapp", "email", "address"] as const).map((k) => (
          <div key={k}>
            <label className={labelClass}>{k}</label>
            <input
              className={fieldClass}
              value={c[k]}
              onChange={(e) => setC({ ...c, [k]: e.target.value })}
              placeholder={k === "email" ? "Metapictures23@gmail.com" : ""}
            />
          </div>
        ))}
        <button
          type="button"
          disabled={saving}
          onClick={() => save("contact", c)}
          className="bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save contact"}
        </button>
      </section>

      <section className="space-y-4 border border-border p-6 bg-card/20">
        <h2 className="text-xs uppercase tracking-widest text-muted">Social</h2>
        {(["instagram", "youtube", "tiktok", "facebook", "telegram"] as const).map(
          (k) => (
            <div key={k}>
              <label className={labelClass}>{k}</label>
              <input
                className={fieldClass}
                value={s[k]}
                onChange={(e) => setS({ ...s, [k]: e.target.value })}
                placeholder="https://…"
              />
            </div>
          )
        )}
        <button
          type="button"
          disabled={saving}
          onClick={() => save("social", s)}
          className="bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save social"}
        </button>
      </section>
    </div>
  );
}
