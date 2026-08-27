import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_STATUSES = new Set([
  "NEW",
  "CONTACTED",
  "CONSULTATION_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CONFIRMED",
  "IN_PRODUCTION",
  "COMPLETED",
  "CANCELLED",
  "ARCHIVED",
]);

async function getWriteClient() {
  // Prefer service role for reliable staff writes when configured
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return createAdminClient();
    }
  } catch {
    /* fall through */
  }
  return createClient();
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      const status = String(body.status);
      if (!ALLOWED_STATUSES.has(status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updates.status = status;
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes === null ? null : String(body.notes);
    }

    if (body.estimated_budget !== undefined) {
      updates.estimated_budget =
        body.estimated_budget === null || body.estimated_budget === ""
          ? null
          : Number(body.estimated_budget);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided." }, { status: 400 });
    }

    const supabase = await getWriteClient();
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select("id, status, notes, estimated_budget, updated_at")
      .single();

    if (error) {
      console.error("Lead update error:", error.message);
      return NextResponse.json(
        { error: error.message || "Update failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, lead: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
