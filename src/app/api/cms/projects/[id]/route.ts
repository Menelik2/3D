import { NextResponse } from "next/server";
import { getCmsClient, slugify } from "@/lib/cms";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.slug !== undefined) {
      updates.slug = String(body.slug).trim() || slugify(String(body.title || "project"));
    }
    if (body.status !== undefined) updates.status = body.status;
    if (body.category !== undefined) updates.category = body.category || null;
    if (body.description !== undefined) updates.description = body.description || null;
    if (body.budget !== undefined) {
      updates.budget = body.budget !== "" && body.budget != null ? Number(body.budget) : null;
    }
    if (body.location !== undefined) updates.location = body.location || null;
    if (body.production_date !== undefined) updates.production_date = body.production_date || null;
    if (body.delivery_date !== undefined) updates.delivery_date = body.delivery_date || null;
    if (body.cover_image_url !== undefined) updates.cover_image_url = body.cover_image_url || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select("id, slug, status")
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
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
