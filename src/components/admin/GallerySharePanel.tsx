"use client";

import { useMemo, useState } from "react";

export function GallerySharePanel({
  token,
  title,
}: {
  token: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `/g/${token}`;
    return `${window.location.origin}/g/${token}`;
  }, [token]);

  const qrUrl = useMemo(() => {
    const data = encodeURIComponent(shareUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${data}`;
  }, [shareUrl]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
      prompt("Copy this link:", shareUrl);
    }
  }

  return (
    <div className="border border-border bg-card/30 p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-widest text-muted">
        Client access
      </h2>
      <p className="text-sm text-muted">
        Only people with this link (or QR) can open <strong className="text-foreground/90">{title}</strong>.
        No login required.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          readOnly
          value={shareUrl}
          className="flex-1 border border-border bg-background px-3 py-2.5 text-xs font-mono truncate"
          onFocus={(e) => e.target.select()}
        />
        <button
          type="button"
          onClick={copyLink}
          className="shrink-0 bg-accent px-4 py-2.5 text-[10px] uppercase tracking-widest text-white hover:bg-accent-hover"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt="QR code for gallery"
          width={240}
          height={240}
          className="bg-white p-2 rounded-sm"
        />
        <p className="text-[10px] uppercase tracking-widest text-muted text-center">
          Scan to open gallery · Send this QR to the client
        </p>
        <a
          href={qrUrl}
          download={`gallery-${token}-qr.png`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-widest text-accent hover:underline"
        >
          Open QR image ↗
        </a>
      </div>
    </div>
  );
}
