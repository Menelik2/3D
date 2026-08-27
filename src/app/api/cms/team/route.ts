import { NextResponse } from "next/server";
import { getCmsClient, parseBool } from "@/lib/cms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const role = String(body.role || "").trim();
    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("team_members")
      .insert({
        name,
        role,
        bio: body.bio || null,
        profile_image_url: body.profile_image_url || null,
        sort_order: body.sort_order != null ? Number(body.sort_order) : 0,
        is_published: parseBool(body.is_published, false),
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
