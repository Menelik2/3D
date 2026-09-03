import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";
import { revalidateCms } from "@/lib/data/revalidate";

const ALLOWED_KEYS = new Set(["contact", "social", "media", "brand"]);

export async function GET() {
  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value, updated_at")
      .in("key", ["contact", "social", "media", "brand"]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settings: Record<string, unknown> = {};
    for (const row of data ?? []) {
      settings[row.key] = row.value;
    }
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const key = String(body.key || "").trim();
    if (!key) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }
    if (!ALLOWED_KEYS.has(key)) {
      return NextResponse.json(
        { error: `key must be one of: ${[...ALLOWED_KEYS].join(", ")}` },
        { status: 400 }
      );
    }

    const value =
      body.value && typeof body.value === "object" && !Array.isArray(body.value)
        ? body.value
        : {};

    // Normalize string fields
    const normalized: Record<string, string> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      normalized[k] = v == null ? "" : String(v).trim();
    }

    const supabase = await getCmsClient();

    // Do NOT chain .select() / RETURNING. If the client is the user session
    // (service role missing/invalid), staff may be allowed to UPDATE/INSERT
    // but not always to SELECT the row back — PostgREST then reports RLS
    // failure even though the write succeeded. Same pattern as /api/leads.
    const { error } = await supabase.from("site_settings").upsert(
      {
        key,
        value: normalized,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      console.error("[cms/settings] upsert error:", error.message);
      return NextResponse.json(
        {
          error:
            error.message +
            " — Ensure SUPABASE_SERVICE_ROLE_KEY is set, or your admin role is SUPER_ADMIN/ADMIN and site_settings RLS allows staff.",
        },
        { status: 500 }
      );
    }

    revalidateCms("settings");
    return NextResponse.json({ ok: true, key, value: normalized });
  } catch (e) {
    console.error("[cms/settings]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
