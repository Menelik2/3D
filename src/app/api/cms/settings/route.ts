import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const key = String(body.key || "").trim();
    if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });

    const value = body.value ?? {};
    const supabase = await getCmsClient();

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { error } = await supabase.from("site_settings").insert({ key, value });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
