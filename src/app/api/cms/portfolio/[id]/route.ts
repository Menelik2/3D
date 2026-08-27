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
    if (body.slug !== undefined) updates.slug = String(body.slug).trim() || slugify(String(body.title || "item"));
    if (body.category !== undefined) updates.category = String(body.category).trim();
    if (body.description !== undefined) updates.description = body.description || null;
    if (body.client_name !== undefined) updates.client_name = body.client_name || null;
    if (body.year !== undefined) updates.year = body.year === "" || body.year == null ? null : Number(body.year);
    if (body.cover_image_url !== undefined) updates.cover_image_url = body.cover_image_url || null;
    if (body.video_url !== undefined) updates.video_url = body.video_url || null;
    if (body.is_published !== undefined) updates.is_published = parseBool(body.is_published);
    if (body.is_featured !== undefined) updates.is_featured = parseBool(body.is_featured);
    if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .update(updates)
      .eq("id", id)
      .select("id, slug, is_published")
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
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
