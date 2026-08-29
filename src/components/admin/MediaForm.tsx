"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "./CmsFormFields";

type Media = {
  logoUrl: string;
  logoVideoUrl: string;
  showreelUrl: string;
  showreelPosterUrl: string;
  ogImageUrl: string;
};

const FIELDS: { key: keyof Media; label: string; env: string; placeholder: string }[] = [
  {
    key: "logoUrl",
    label: "Logo URL",
    env: "NEXT_PUBLIC_LOGO_URL",
    placeholder: "https://…/logo.png",
  },
  {
    key: "logoVideoUrl",
    label: "Logo video",
    env: "NEXT_PUBLIC_LOGO_VIDEO_URL",
    placeholder: "https://…/logo.mp4",
  },
  {
    key: "showreelUrl",
    label: "Showreel video (homepage)",
    env: "NEXT_PUBLIC_SHOWREEL_URL",
    placeholder: "YouTube link or /brand/videos/showreel.mp4",
  },
  {
    key: "showreelPosterUrl",
    label: "Showreel poster image",
    env: "NEXT_PUBLIC_SHOWREEL_POSTER_URL",
    placeholder: "Image shown before play (optional)",
  },
  {
    key: "ogImageUrl",
    label: "OG image",
    env: "NEXT_PUBLIC_OG_IMAGE_URL",
    placeholder: "https://…/og.jpg",
  },
];

export function MediaForm({ media }: { media: Media }) {
  const router = useRouter();
  const [m, setM] = useState<Media>({
    logoUrl: media.logoUrl || "",
    logoVideoUrl: media.logoVideoUrl || "",
    showreelUrl: media.showreelUrl || "",
    showreelPosterUrl: media.showreelPosterUrl || "",
    ogImageUrl: media.ogImageUrl || "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/cms/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "media", value: m }),
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || "Save failed");
      else {
        setMsg("Media settings saved");
        router.refresh();
      }
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {msg && <p className="text-sm text-muted">{msg}</p>}

      <section className="space-y-4 border border-border p-6 bg-card/20">
        {FIELDS.map(({ key, label, env, placeholder }) => (
          <div key={key}>
            <label className={labelClass}>
              {label}{" "}
              <span className="font-mono normal-case tracking-normal text-[10px] text-muted/70">
                ({env})
              </span>
            </label>
            <input
              className={fieldClass}
              value={m[key]}
              onChange={(e) => setM({ ...m, [key]: e.target.value })}
              placeholder={placeholder}
            />
            <p className="mt-1 text-[11px] text-muted">
              {m[key]?.trim() ? (
                <span className="text-emerald-500/90">Set</span>
              ) : (
                <span>Not set</span>
              )}
            </p>
          </div>
        ))}
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save media"}
        </button>
      </section>
    </div>
  );
}
