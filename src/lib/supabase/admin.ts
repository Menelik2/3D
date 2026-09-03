import { createClient } from "@supabase/supabase-js";

/**
 * Server-only admin client using the service role key.
 * NEVER import this file in client components or expose it to the browser.
 */
export function hasValidServiceRoleKey(): boolean {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  // Real JWTs start with eyJ. Reject empty values, placeholders, and typos
  // (a previous .env.example accidentally prefixed the key with "y").
  return k.startsWith("eyJ") && k.split(".").length === 3;
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function tryCreateAdminClient() {
  if (!hasValidServiceRoleKey()) return null;
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}
