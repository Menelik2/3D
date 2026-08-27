import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Prefer service role for CMS writes; fall back to user session. */
export async function getCmsClient() {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return createAdminClient();
    }
  } catch {
    /* fall through */
  }
  return createClient();
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "item";
}

export function parseBool(v: unknown, fallback = false): boolean {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === "1" || v === "on") return true;
  if (v === "false" || v === "0" || v === "off") return false;
  return fallback;
}
