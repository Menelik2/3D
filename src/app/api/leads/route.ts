import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    // Basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: fullName,
        company: body.company || null,
        email,
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        preferred_contact: body.preferredContact || null,
        project_types: Array.isArray(body.projectTypes) ? body.projectTypes : [],
        project_title: body.title || null,
        project_description: body.description || null,
        creative_idea: body.creativeIdea || null,
        references_text: body.references || null,
        visual_style: body.visualStyle || null,
        preferred_date: body.preferredDate || null,
        alternative_date: body.alternativeDate || null,
        city: body.city || null,
        location: body.location || null,
        indoor_outdoor: body.indoorOutdoor || null,
        expected_duration: body.duration || null,
        budget_range: body.budget || null,
        source: "website",
        status: "NEW",
      })
      .select("id, reference_number")
      .single();

    if (error) {
      console.error("Lead insert error:", error.message);
      return NextResponse.json(
        { error: "Could not save your request. Please try again or contact us directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      reference: data.reference_number,
      id: data.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
