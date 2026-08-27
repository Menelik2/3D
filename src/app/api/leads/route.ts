import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { LeadInsert } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadInsert;

    if (!body.full_name?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const payload: LeadInsert = {
      full_name: body.full_name.trim(),
      company: body.company?.trim() || null,
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      whatsapp: body.whatsapp?.trim() || null,
      preferred_contact: body.preferred_contact || "email",
      project_types: body.project_types || [],
      project_title: body.project_title?.trim() || null,
      project_description: body.project_description?.trim() || null,
      creative_idea: body.creative_idea?.trim() || null,
      references_text: body.references_text?.trim() || null,
      visual_style: body.visual_style?.trim() || null,
      preferred_date: body.preferred_date || null,
      alternative_date: body.alternative_date || null,
      city: body.city?.trim() || null,
      location: body.location?.trim() || null,
      indoor_outdoor: body.indoor_outdoor || null,
      expected_duration: body.expected_duration?.trim() || null,
      budget_range: body.budget_range || null,
      source: body.source || "website",
    };

    const { data, error } = await supabase
      .from("leads")
      .insert(payload)
      .select("id, reference_number")
      .single();

    if (error) {
      console.error("Lead insert error:", error.message);
      return NextResponse.json(
        { error: "Failed to submit project request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reference_number: data.reference_number,
      id: data.id,
    });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
