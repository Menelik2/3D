import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

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

/** Matches the DB trigger format: MP-YYMMDD-XXXXXX */
function generateLeadReference(): string {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `MP-${yy}${mm}${dd}-${rand}`;
}

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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.full_name || body.fullName || "").trim();
    const email = String(body.email || "").trim();

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const statusRaw = String(body.status || "NEW").trim();
    const status = ALLOWED_STATUSES.has(statusRaw) ? statusRaw : "NEW";

    const projectTypes = body.project_types || body.projectTypes || [];
    const typesArr = Array.isArray(projectTypes) ? projectTypes.map(String) : [];

    const payload: Record<string, unknown> = {
      full_name: fullName,
      company: optionalText(body.company),
      email,
      phone: optionalText(body.phone),
      whatsapp: optionalText(body.whatsapp),
      preferred_contact: optionalText(body.preferred_contact) || "email",
      project_types: typesArr,
      project_title: optionalText(body.project_title),
      project_description: optionalText(body.project_description),
      creative_idea: optionalText(body.creative_idea),
      references_text: optionalText(body.references_text),
      visual_style: optionalText(body.visual_style),
      preferred_date: optionalDate(body.preferred_date),
      alternative_date: optionalDate(body.alternative_date),
      city: optionalText(body.city),
      location: optionalText(body.location),
      indoor_outdoor: optionalText(body.indoor_outdoor),
      expected_duration: optionalText(body.expected_duration),
      budget_range: optionalText(body.budget_range),
      notes: optionalText(body.notes),
      source: optionalText(body.source) || "admin",
      status,
    };

    if (body.estimated_budget !== undefined && body.estimated_budget !== "") {
      const n = Number(body.estimated_budget);
      payload.estimated_budget = Number.isFinite(n) ? n : null;
    }

    const supabase = await getCmsClient();
    let data: { id: string; reference_number: string } | null = null;
    let lastError: string | null = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      const reference_number = generateLeadReference();
      const { data: row, error } = await supabase
        .from("leads")
        .insert({ ...payload, reference_number })
        .select("id, reference_number")
        .single();

      if (!error && row) {
        data = row;
        break;
      }
      lastError = error?.message || "Insert failed";
      // Unique reference collision — retry
      if (error?.code !== "23505") break;
    }

    if (!data) {
      console.error("[admin/leads] create error:", lastError);
      return NextResponse.json(
        { error: lastError || "Could not create lead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, lead: data });
  } catch (e) {
    console.error("[admin/leads]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

/**
 * Bulk hard-delete leads from the database.
 * Body: { ids: string[] }
 * lead_notes are removed via ON DELETE CASCADE.
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const raw = Array.isArray(body.ids) ? body.ids : [];
    const ids = [
      ...new Set(
        raw
          .map((id: unknown) => String(id).trim())
          .filter((id: string) => UUID_RE.test(id))
      ),
    ];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Provide at least one valid lead id in ids[]." },
        { status: 400 }
      );
    }

    if (ids.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 leads per bulk delete." },
        { status: 400 }
      );
    }

    const supabase = await getCmsClient();

    // Hard delete — rows are removed from the database permanently.
    // lead_notes cascade via FK ON DELETE CASCADE.
    const { error, count } = await supabase
      .from("leads")
      .delete({ count: "exact" })
      .in("id", ids);

    if (error) {
      console.error("[admin/leads] bulk delete error:", error.message);
      return NextResponse.json(
        { error: error.message || "Bulk delete failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      deleted: count ?? ids.length,
      ids,
    });
  } catch (e) {
    console.error("[admin/leads] bulk delete", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
