import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const projectTypes =
      body.projectTypes || body.project_types || [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: fullName,
        company: body.company || null,
        email,
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        preferred_contact: body.preferredContact || body.preferred_contact || null,
        project_types: Array.isArray(projectTypes) ? projectTypes : [],
        project_title: body.title || body.project_title || null,
        project_description: body.description || body.project_description || null,
        creative_idea: body.creativeIdea || body.creative_idea || null,
        references_text: body.references || body.references_text || null,
        visual_style: body.visualStyle || body.visual_style || null,
        preferred_date: body.preferredDate || body.preferred_date || null,
        alternative_date: body.alternativeDate || body.alternative_date || null,
        city: body.city || null,
        location: body.location || null,
        indoor_outdoor: body.indoorOutdoor || body.indoor_outdoor || null,
        expected_duration: body.duration || body.expected_duration || null,
        budget_range: body.budget || body.budget_range || null,
        source: body.source || "website",
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
