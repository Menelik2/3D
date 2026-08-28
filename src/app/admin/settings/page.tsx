import { getCmsClient } from "@/lib/cms";
import { getContactConfig, getSocialConfig } from "@/lib/site-config";
import { SettingsForm } from "@/components/admin/SettingsForm";

type Contact = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
};

type Social = {
  instagram: string;
  youtube: string;
  tiktok: string;
  facebook: string;
  telegram: string;
};

function asContact(v: unknown, fallback: Contact): Contact {
  if (!v || typeof v !== "object") return fallback;
  const o = v as Record<string, unknown>;
  return {
    phone: typeof o.phone === "string" ? o.phone : fallback.phone,
    whatsapp: typeof o.whatsapp === "string" ? o.whatsapp : fallback.whatsapp,
    email: typeof o.email === "string" ? o.email : fallback.email,
    address: typeof o.address === "string" ? o.address : fallback.address,
  };
}

function asSocial(v: unknown, fallback: Social): Social {
  if (!v || typeof v !== "object") return fallback;
  const o = v as Record<string, unknown>;
  return {
    instagram: typeof o.instagram === "string" ? o.instagram : fallback.instagram,
    youtube: typeof o.youtube === "string" ? o.youtube : fallback.youtube,
    tiktok: typeof o.tiktok === "string" ? o.tiktok : fallback.tiktok,
    facebook: typeof o.facebook === "string" ? o.facebook : fallback.facebook,
    telegram: typeof o.telegram === "string" ? o.telegram : fallback.telegram,
  };
}

export default async function AdminSettingsPage() {
  const envContact = getContactConfig();
  const envSocial = getSocialConfig();

  let contact: Contact = { ...envContact };
  let social: Social = { ...envSocial };
  let loadedFromDb = false;
  let loadError: string | null = null;

  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["contact", "social"]);

    if (error) {
      loadError = error.message;
    } else if (data) {
      for (const row of data) {
        if (row.key === "contact") {
          contact = asContact(row.value, contact);
          loadedFromDb = true;
        }
        if (row.key === "social") {
          social = asSocial(row.value, social);
          loadedFromDb = true;
        }
      }
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Site settings</h1>
        <p className="mt-1 text-sm text-muted">
          Contact &amp; social are stored in the database (<code className="text-foreground/80">site_settings</code>)
          and appear on the public site and admin dashboard after you save.
        </p>
        {loadedFromDb && (
          <p className="mt-2 text-[11px] uppercase tracking-widest text-emerald-500/90">
            Loaded from database
          </p>
        )}
        {loadError && (
          <p className="mt-2 text-sm text-amber-500/90">
            Could not load saved settings: {loadError}. Saving may still work if the service role key is set.
          </p>
        )}
      </div>
      <SettingsForm contact={contact} social={social} />
    </div>
  );
}
