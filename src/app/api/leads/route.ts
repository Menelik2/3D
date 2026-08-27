import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Empty strings break Postgres DATE columns — normalize to null. */
function optionalDate(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || body.full_name || "").trim();
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

    const projectTypes = body.projectTypes || body.project_types || [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: fullName,
        company: optionalText(body.company),
        email,
        phone: optionalText(body.phone),
        whatsapp: optionalText(body.whatsapp),
        preferred_contact:
          optionalText(body.preferredContact || body.preferred_contact) ||
          "email",
        project_types: Array.isArray(projectTypes) ? projectTypes : [],
        project_title: optionalText(body.title || body.project_title),
        project_description: optionalText(
          body.description || body.project_description
        ),
        creative_idea: optionalText(body.creativeIdea || body.creative_idea),
        references_text: optionalText(body.references || body.references_text),
        visual_style: optionalText(body.visualStyle || body.visual_style),
        preferred_date: optionalDate(
          body.preferredDate || body.preferred_date
        ),
        alternative_date: optionalDate(
          body.alternativeDate || body.alternative_date
        ),
        city: optionalText(body.city),
        location: optionalText(body.location),
        indoor_outdoor: optionalText(
          body.indoorOutdoor || body.indoor_outdoor
        ),
        expected_duration: optionalText(body.duration || body.expected_duration),
        budget_range: optionalText(body.budget || body.budget_range),
        source: optionalText(body.source) || "website",
        status: "NEW",
      })
      .select("id, reference_number")
      .single();

    if (error) {
      console.error("Lead insert error:", error.message);
      return NextResponse.json(
        {
          error:
            "Could not save your request. Please try again or contact us directly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      reference: data.reference_number,
      reference_number: data.reference_number,
      id: data.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
