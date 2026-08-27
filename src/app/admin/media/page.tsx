import { getMediaConfig } from "@/lib/site-config";

export default function AdminMediaPage() {
  const media = getMediaConfig();
  const items = [
    { key: "Logo URL", env: "NEXT_PUBLIC_LOGO_URL", value: media.logoUrl },
    { key: "Logo video", env: "NEXT_PUBLIC_LOGO_VIDEO_URL", value: media.logoVideoUrl },
    { key: "Showreel", env: "NEXT_PUBLIC_SHOWREEL_URL", value: media.showreelUrl },
    { key: "Showreel poster", env: "NEXT_PUBLIC_SHOWREEL_POSTER_URL", value: media.showreelPosterUrl },
    { key: "OG image", env: "NEXT_PUBLIC_OG_IMAGE_URL", value: media.ogImageUrl },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Media</h1>
        <p className="mt-1 text-sm text-muted">
          Brand assets via env or Supabase Storage buckets (portfolio, bts, avatars).
        </p>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium">Env variable</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.env} className="border-b border-border/60">
                <td className="px-4 py-3">{row.key}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{row.env}</td>
                <td className="px-4 py-3">
                  {row.value ? (
                    <span className="text-xs text-emerald-500/90">Set</span>
                  ) : (
                    <span className="text-xs text-muted">Not set</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="border border-border bg-card/20 p-6 text-sm text-muted space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted">Storage buckets</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><code className="text-foreground/80">portfolio</code> — public covers &amp; videos</li>
          <li><code className="text-foreground/80">client-files</code> — private scripts &amp; deliverables</li>
          <li><code className="text-foreground/80">avatars</code> — team photos</li>
          <li><code className="text-foreground/80">bts</code> — behind-the-scenes</li>
        </ul>
      </section>
    </div>
  );
}
