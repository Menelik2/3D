import { createClient } from "@/lib/supabase/server";
import { getContactConfig, getSocialConfig } from "@/lib/site-config";

export default async function AdminSettingsPage() {
  let dbSettings: Array<{ key: string; value: unknown }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    dbSettings = data ?? [];
  } catch {
    /* ignore */
  }

  const contact = getContactConfig();
  const social = getSocialConfig();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Contact, social and brand. Prefer <code className="text-foreground/80">site_settings</code> table or
          env vars in <code className="text-foreground/80">.env.local</code>.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-card/30 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted">Contact (env)</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Phone</dt><dd>{contact.phone || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">WhatsApp</dt><dd>{contact.whatsapp || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Email</dt><dd>{contact.email || "—"}</dd></div>
          </dl>
        </div>
        <div className="border border-border bg-card/30 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted">Social (env)</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Instagram</dt><dd className="truncate">{social.instagram || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">YouTube</dt><dd className="truncate">{social.youtube || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">TikTok</dt><dd className="truncate">{social.tiktok || "—"}</dd></div>
          </dl>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs uppercase tracking-widest text-muted">site_settings (database)</h2>
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
              <tr>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {dbSettings.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-10 text-center text-muted text-sm">
                    No rows (run schema seed) or not connected.
                  </td>
                </tr>
              ) : (
                dbSettings.map((row) => (
                  <tr key={row.key} className="border-b border-border/60">
                    <td className="px-4 py-3 font-mono text-xs">{row.key}</td>
                    <td className="px-4 py-3 text-xs text-muted font-mono max-w-md truncate">
                      {JSON.stringify(row.value)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
