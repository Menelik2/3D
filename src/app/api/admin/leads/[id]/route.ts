import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

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

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function optionalDate(v: unknown): string | null {
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

    if (body.status !== undefined) {
      const status = String(body.status);
      if (!ALLOWED_STATUSES.has(status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updates.status = status;
    }

    if (body.full_name !== undefined) {
      const name = String(body.full_name).trim();
      if (!name) {
        return NextResponse.json({ error: "Full name is required." }, { status: 400 });
      }
      updates.full_name = name;
    }

    if (body.email !== undefined) {
      const email = String(body.email).trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
      }
      updates.email = email;
    }

    if (body.company !== undefined) updates.company = optionalText(body.company);
    if (body.phone !== undefined) updates.phone = optionalText(body.phone);
    if (body.whatsapp !== undefined) updates.whatsapp = optionalText(body.whatsapp);
    if (body.preferred_contact !== undefined)
      updates.preferred_contact = optionalText(body.preferred_contact) || "email";
    if (body.project_title !== undefined)
      updates.project_title = optionalText(body.project_title);
    if (body.project_description !== undefined)
      updates.project_description = optionalText(body.project_description);
    if (body.creative_idea !== undefined)
      updates.creative_idea = optionalText(body.creative_idea);
    if (body.references_text !== undefined)
      updates.references_text = optionalText(body.references_text);
    if (body.visual_style !== undefined)
      updates.visual_style = optionalText(body.visual_style);
    if (body.preferred_date !== undefined)
      updates.preferred_date = optionalDate(body.preferred_date);
    if (body.alternative_date !== undefined)
      updates.alternative_date = optionalDate(body.alternative_date);
    if (body.city !== undefined) updates.city = optionalText(body.city);
    if (body.location !== undefined) updates.location = optionalText(body.location);
    if (body.indoor_outdoor !== undefined)
      updates.indoor_outdoor = optionalText(body.indoor_outdoor);
    if (body.expected_duration !== undefined)
      updates.expected_duration = optionalText(body.expected_duration);
    if (body.budget_range !== undefined)
      updates.budget_range = optionalText(body.budget_range);
    if (body.notes !== undefined)
      updates.notes = body.notes === null ? null : String(body.notes);
    if (body.source !== undefined) updates.source = optionalText(body.source);

    if (body.project_types !== undefined) {
      updates.project_types = Array.isArray(body.project_types)
        ? body.project_types.map(String)
        : [];
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

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select("id, status, full_name, email, notes, estimated_budget, updated_at")
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

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await getCmsClient();

    // lead_notes cascade via FK; delete lead
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      console.error("Lead delete error:", error.message);
      return NextResponse.json(
        { error: error.message || "Delete failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
