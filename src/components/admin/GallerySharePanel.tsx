"use client";

import { useMemo, useState } from "react";

/** Production site — permanent gallery links always use this host. */
const PERMANENT_ORIGIN = "https://metapictures.pro.et";

export function GallerySharePanel({
  token,
  title,
}: {
  token: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(
    () => `${PERMANENT_ORIGIN}/g/${token}`,
    [token]
  );

  const qrUrl = useMemo(() => {
    const data = encodeURIComponent(shareUrl);
    // High-quality QR for print / client handoff
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=16&ecc=M&data=${data}`;
  }, [shareUrl]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      prompt("Copy this permanent link:", shareUrl);
    }
  }

  function printQr() {
    const w = window.open("", "_blank", "noopener,noreferrer,width=480,height=640");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>QR — ${title}</title>
      <style>
        body{font-family:system-ui,sans-serif;text-align:center;padding:24px;color:#111}
        img{width:280px;height:280px;background:#fff;padding:12px}
        p{font-size:12px;word-break:break-all;margin-top:16px}
        h1{font-size:16px;font-weight:600}
      </style></head><body>
      <h1>${title.replace(/</g, "")}</h1>
      <img src="${qrUrl}" alt="QR code" />
      <p>${shareUrl}</p>
      <script>window.onload=function(){window.print()}<\/script>
      </body></html>`);
    w.document.close();
  }

  return (
    <div className="border border-border bg-card/30 p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-xs uppercase tracking-widest text-muted">
          Permanent client link
        </h2>
        <span className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-300/90">
          Never expires
        </span>
      </div>

      <p className="text-sm text-muted leading-relaxed">
        This URL is <strong className="text-foreground/90">permanent</strong> for{" "}
        <strong className="text-foreground/90">{title}</strong>. The token does not
        change when you edit the gallery. Anyone with the link or QR can open the
        photos — no login required.
      </p>

      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-widest text-muted">
          Permanent URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 border border-border bg-background px-3 py-2.5 text-xs font-mono"
            onFocus={(e) => e.target.select()}
            aria-label="Permanent gallery URL"
          />
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 bg-accent px-4 py-2.5 text-[10px] uppercase tracking-widest text-white hover:bg-accent-hover"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <p className="font-mono text-[11px] text-muted break-all">
          Token: {token}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-border/60 pt-5">
        <p className="text-[10px] uppercase tracking-widest text-muted">
          QR barcode · scan to open gallery
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`QR barcode for ${title}`}
          width={240}
          height={240}
          className="bg-white p-3 rounded-sm shadow-lg"
        />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={qrUrl}
            download={`gallery-${token}-qr.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-widest text-accent hover:underline"
          >
            Download QR ↗
          </a>
          <button
            type="button"
            onClick={printQr}
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            Print QR
          </button>
        </div>
        <p className="max-w-sm text-center text-[11px] text-muted leading-relaxed">
          Send this QR or link to the client. It stays valid forever unless you
          unpublish or delete the gallery.
        </p>
      </div>
    </div>
  );
}
