import { NextResponse } from "next/server";
import { getCmsClient, parseBool } from "@/lib/cms";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.question !== undefined) updates.question = String(body.question).trim();
    if (body.answer !== undefined) updates.answer = String(body.answer).trim();
    if (body.category !== undefined) updates.category = body.category || null;
    if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
    if (body.is_published !== undefined) updates.is_published = parseBool(body.is_published);

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("faqs")
      .update(updates)
      .eq("id", id)
      .select("id")
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
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
