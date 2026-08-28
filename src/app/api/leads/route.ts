import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendLeadNotification } from "@/lib/email";

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

    const company = optionalText(body.company);
    const phone = optionalText(body.phone);
    const whatsapp = optionalText(body.whatsapp);
    const preferredContact =
      optionalText(body.preferredContact || body.preferred_contact) || "email";
    const projectTitle = optionalText(body.title || body.project_title);
    const projectDescription = optionalText(
      body.description || body.project_description
    );
    const creativeIdea = optionalText(body.creativeIdea || body.creative_idea);
    const city = optionalText(body.city);
    const location = optionalText(body.location);
    const preferredDate = optionalDate(
      body.preferredDate || body.preferred_date
    );
    const budgetRange = optionalText(body.budget || body.budget_range);
    const source = optionalText(body.source) || "website";
    const typesArr = Array.isArray(projectTypes) ? projectTypes : [];

    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: fullName,
        company,
        email,
        phone,
        whatsapp,
        preferred_contact: preferredContact,
        project_types: typesArr,
        project_title: projectTitle,
        project_description: projectDescription,
        creative_idea: creativeIdea,
        references_text: optionalText(body.references || body.references_text),
        visual_style: optionalText(body.visualStyle || body.visual_style),
        preferred_date: preferredDate,
        alternative_date: optionalDate(
          body.alternativeDate || body.alternative_date
        ),
        city,
        location,
        indoor_outdoor: optionalText(
          body.indoorOutdoor || body.indoor_outdoor
        ),
        expected_duration: optionalText(body.duration || body.expected_duration),
        budget_range: budgetRange,
        source,
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

    // Fire-and-forget email — never block the client on mail failures
    void sendLeadNotification({
      reference: data.reference_number,
      fullName,
      email,
      phone,
      whatsapp,
      company,
      preferredContact,
      projectTypes: typesArr,
      projectTitle,
      projectDescription,
      creativeIdea,
      city,
      location,
      preferredDate,
      budgetRange,
      source,
    });

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
