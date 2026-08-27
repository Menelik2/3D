/**
 * Site configuration from environment + optional CMS (site_settings table).
 * Prefer env for deploy-time overrides; CMS for runtime edits via admin.
 */

export type ContactConfig = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
};

export type SocialConfig = {
  instagram: string;
  youtube: string;
  tiktok: string;
  facebook: string;
  telegram: string;
};

export type MediaConfig = {
  logoUrl: string;
  logoVideoUrl: string;
  showreelUrl: string;
  showreelPosterUrl: string;
  ogImageUrl: string;
};

function env(key: string, fallback = ""): string {
  if (typeof process === "undefined") return fallback;
  return (process.env[key] || fallback).trim();
}

/** Contact details — set via .env.local or Admin → Settings */
export function getContactConfig(): ContactConfig {
  return {
    phone: env("NEXT_PUBLIC_CONTACT_PHONE"),
    whatsapp: env("NEXT_PUBLIC_CONTACT_WHATSAPP"),
    email: env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@metapictures.example"),
    address: env("NEXT_PUBLIC_CONTACT_ADDRESS"),
  };
}

/** Social links */
export function getSocialConfig(): SocialConfig {
  return {
    instagram: env("NEXT_PUBLIC_SOCIAL_INSTAGRAM"),
    youtube: env("NEXT_PUBLIC_SOCIAL_YOUTUBE"),
    tiktok: env("NEXT_PUBLIC_SOCIAL_TIKTOK"),
    facebook: env("NEXT_PUBLIC_SOCIAL_FACEBOOK"),
    telegram: env("NEXT_PUBLIC_SOCIAL_TELEGRAM"),
  };
}

/**
 * Brand media — optimized defaults under /public/brand/
 * Logo image is primary; set NEXT_PUBLIC_LOGO_VIDEO_URL or upload
 * public/brand/meta-logo.mp4 for the animated mark.
 */
export function getMediaConfig(): MediaConfig {
  return {
    logoUrl: env("NEXT_PUBLIC_LOGO_URL", "/brand/meta-logo.jpg"),
    logoVideoUrl: env("NEXT_PUBLIC_LOGO_VIDEO_URL"),
    showreelUrl: env("NEXT_PUBLIC_SHOWREEL_URL"),
    showreelPosterUrl: env(
      "NEXT_PUBLIC_SHOWREEL_POSTER_URL",
      "/brand/meta-logo-poster.jpg"
    ),
    ogImageUrl: env("NEXT_PUBLIC_OG_IMAGE_URL", "/brand/og.jpg"),
  };
}

export function whatsappLink(number: string): string {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export function telLink(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}
