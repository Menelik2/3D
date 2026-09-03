import { createClient } from "@/lib/supabase/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin";

/** Prefer service role for CMS writes; fall back to user session. */
export async function getCmsClient() {
  const admin = tryCreateAdminClient();
  if (admin) return admin;
  return createClient();
}

export function slugify(input: string): string {
  // Keep Latin + Unicode letters (e.g. Amharic) so non-English titles get real slugs
  const s = input
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/['"\u2018\u2019\u201c\u201d]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 80);
  if (s) return s;
  return `item-${Date.now().toString(36)}`;
}

export function parseBool(v: unknown, fallback = false): boolean {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === "1" || v === "on") return true;
  if (v === "false" || v === "0" || v === "off") return false;
  return fallback;
}
