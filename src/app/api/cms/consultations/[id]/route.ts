import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

const ALLOWED = new Set(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      const s = String(body.status);
      if (!ALLOWED.has(s)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updates.status = s;
    }
    if (body.notes !== undefined) updates.notes = body.notes || null;
    if (body.meeting_location !== undefined) updates.meeting_location = body.meeting_location || null;
    if (body.online_meeting_url !== undefined) {
      updates.online_meeting_url = body.online_meeting_url || null;
    }
    if (body.preferred_date !== undefined) updates.preferred_date = body.preferred_date || null;
    if (body.preferred_time !== undefined) updates.preferred_time = body.preferred_time || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("consultations")
      .update(updates)
      .eq("id", id)
      .select("id, status")
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
    const { error } = await supabase.from("consultations").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
