/**
 * Public site config: env (deploy-time) + site_settings CMS (runtime).
 * Non-empty env values win; CMS fills gaps.
 */

import { createClient } from "@supabase/supabase-js";
import {
  getContactConfig,
  getMediaConfig,
  getSocialConfig,
  type ContactConfig,
  type MediaConfig,
  type SocialConfig,
} from "@/lib/site-config";

export type PublicSiteConfig = {
  contact: ContactConfig;
  social: SocialConfig;
  media: MediaConfig;
};

function mergeFilled<T extends Record<string, string>>(
  base: T,
  overlay: Partial<Record<keyof T, unknown>> | null | undefined
): T {
  if (!overlay || typeof overlay !== "object") return base;
  const next = { ...base };
  for (const key of Object.keys(base) as (keyof T)[]) {
    const v = overlay[key];
    if (typeof v === "string" && v.trim()) {
      next[key] = v.trim() as T[keyof T];
    }
  }
  return next;
}

function settingsClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) return null;
  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  if (anon) {
    return createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return null;
}

export async function getPublicSiteConfig(): Promise<PublicSiteConfig> {
  let contact = getContactConfig();
  let social = getSocialConfig();
  const media = getMediaConfig();

  const supabase = settingsClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["contact", "social"]);

      if (!error && data) {
        for (const row of data) {
          if (row.key === "contact") {
            contact = mergeFilled(contact, row.value as Partial<ContactConfig>);
          }
          if (row.key === "social") {
            social = mergeFilled(social, row.value as Partial<SocialConfig>);
          }
        }
      }
    } catch (e) {
      console.error("[getPublicSiteConfig]", e);
    }
  }

  contact = mergeFilled(contact, getContactConfig());
  social = mergeFilled(social, getSocialConfig());

  return { contact, social, media };
}
