import { getPublicSiteConfig } from "@/lib/data/site-settings";
import { MediaForm } from "@/components/admin/MediaForm";

export default async function AdminMediaPage() {
  const { media } = await getPublicSiteConfig();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Media</h1>
        <p className="mt-1 text-sm text-muted">
          Brand assets stored in site_settings (media). Env vars override when set.
        </p>
      </div>

      <MediaForm media={media} />

      <section className="border border-border bg-card/20 p-6 text-sm text-muted space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted">Storage buckets</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <code className="text-foreground/80">portfolio</code> — public covers &amp; videos
          </li>
          <li>
            <code className="text-foreground/80">client-files</code> — private scripts &amp; deliverables
          </li>
          <li>
            <code className="text-foreground/80">avatars</code> — team photos
          </li>
          <li>
            <code className="text-foreground/80">bts</code> — behind-the-scenes
          </li>
        </ul>
        <p className="pt-2 text-xs">
          Create these buckets in Supabase → Storage (public for portfolio, bts, avatars).
          Paste public object URLs into the fields above, or set the matching{" "}
          <code className="text-foreground/80">NEXT_PUBLIC_*</code> env vars on Vercel.
        </p>
      </section>
    </div>
  );
}
