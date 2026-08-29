/**
 * Public site config: env defaults + site_settings CMS (runtime).
 * Non-empty CMS values override defaults. Explicit env vars still win last.
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

function explicitEnvContact(): Partial<ContactConfig> {
  return {
    phone: (process.env.NEXT_PUBLIC_CONTACT_PHONE || "").trim(),
    whatsapp: (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "").trim(),
    email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "").trim(),
    address: (process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "").trim(),
  };
}

function explicitEnvSocial(): Partial<SocialConfig> {
  return {
    instagram: (process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "").trim(),
    youtube: (process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "").trim(),
    tiktok: (process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || "").trim(),
    facebook: (process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "").trim(),
    telegram: (process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM || "").trim(),
  };
}

function explicitEnvMedia(): Partial<MediaConfig> {
  return {
    logoUrl: (process.env.NEXT_PUBLIC_LOGO_URL || "").trim(),
    logoVideoUrl: (process.env.NEXT_PUBLIC_LOGO_VIDEO_URL || "").trim(),
    showreelUrl: (process.env.NEXT_PUBLIC_SHOWREEL_URL || "").trim(),
    showreelPosterUrl: (process.env.NEXT_PUBLIC_SHOWREEL_POSTER_URL || "").trim(),
    ogImageUrl: (process.env.NEXT_PUBLIC_OG_IMAGE_URL || "").trim(),
  };
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
  let media = getMediaConfig();

  const supabase = settingsClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["contact", "social", "media"]);

      if (!error && data) {
        for (const row of data) {
          if (row.key === "contact") {
            contact = mergeFilled(contact, row.value as Partial<ContactConfig>);
          }
          if (row.key === "social") {
            social = mergeFilled(social, row.value as Partial<SocialConfig>);
          }
          if (row.key === "media") {
            media = mergeFilled(media, row.value as Partial<MediaConfig>);
          }
        }
      }
    } catch (e) {
      console.error("[getPublicSiteConfig]", e);
    }
  }

  contact = mergeFilled(contact, explicitEnvContact());
  social = mergeFilled(social, explicitEnvSocial());
  media = mergeFilled(media, explicitEnvMedia());

  return { contact, social, media };
}
