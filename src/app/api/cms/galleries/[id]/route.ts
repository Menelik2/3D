import { NextResponse } from "next/server";
import { getCmsClient, parseBool } from "@/lib/cms";

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const t = String(body.title).trim();
      if (!t) {
        return NextResponse.json({ error: "Title is required." }, { status: 400 });
      }
      updates.title = t;
    }
    if (body.client_name !== undefined)
      updates.client_name = optionalText(body.client_name);
    if (body.client_email !== undefined)
      updates.client_email = optionalText(body.client_email);
    if (body.cover_image_url !== undefined)
      updates.cover_image_url = optionalText(body.cover_image_url);
    if (body.notes !== undefined) updates.notes = optionalText(body.notes);
    if (body.is_published !== undefined)
      updates.is_published = parseBool(body.is_published);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("client_galleries")
      .update(updates)
      .eq("id", id)
      .select("id, token, title, is_published")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await getCmsClient();
    const { error } = await supabase
      .from("client_galleries")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
