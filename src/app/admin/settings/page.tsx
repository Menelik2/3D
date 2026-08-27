import { createClient } from "@/lib/supabase/server";
import { getContactConfig, getSocialConfig } from "@/lib/site-config";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const envContact = getContactConfig();
  const envSocial = getSocialConfig();

  let contact = { ...envContact };
  let social = { ...envSocial };

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    for (const row of data ?? []) {
      if (row.key === "contact" && row.value && typeof row.value === "object") {
        contact = { ...contact, ...(row.value as object) };
      }
      if (row.key === "social" && row.value && typeof row.value === "object") {
        social = { ...social, ...(row.value as object) };
      }
    }
  } catch { /* ignore */ }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Site settings</h1>
        <p className="mt-1 text-sm text-muted">
          Edit contact &amp; social stored in <code className="text-foreground/80">site_settings</code>. Env vars still override if set.
        </p>
      </div>
      <SettingsForm contact={contact} social={social} />
    </div>
  );
}
