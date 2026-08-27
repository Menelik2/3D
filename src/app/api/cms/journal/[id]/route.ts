import { NextResponse } from "next/server";
import { getCmsClient, slugify, parseBool } from "@/lib/cms";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.slug !== undefined) updates.slug = String(body.slug).trim() || slugify(String(body.title || "post"));
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt || null;
    if (body.body !== undefined) updates.body = body.body || null;
    if (body.category !== undefined) updates.category = body.category || null;
    if (body.cover_image_url !== undefined) updates.cover_image_url = body.cover_image_url || null;
    if (body.is_published !== undefined) {
      updates.is_published = parseBool(body.is_published);
      if (updates.is_published) updates.published_at = new Date().toISOString();
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("journal_posts")
      .update(updates)
      .eq("id", id)
      .select("id, slug")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
    const { error } = await supabase.from("journal_posts").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
